import assert from "node:assert/strict";
import {
  filterEnvironmentItemsByChecklistMode,
} from "./Step2AmbientiDiLavoro.js";
import {
  generateEnvironmentChecklistItems,
  defaultEnvironmentFeatures,
  evaluateEnvironmentCompliance,
  getStandardEnvironmentsForAteco,
  WorkEnvironmentInstance,
} from "./normativePremisesCatalog.js";

console.log("=== INIZIO TEST Step2AmbientiDiLavoro checklistMode filtering ===");

// 1. Test diretto su filterEnvironmentItemsByChecklistMode
const sampleItems = [
  { id: "1", title: "Cubatura e altezza", domain: "safety" as const },
  { id: "2", title: "Certificato Prevenzione Incendi (CPI)", domain: "safety" as const },
  { id: "3", title: "Pavimenti e canaline lavabili", domain: "both" as const },
  { id: "4", title: "Pareti lavabili e sgusce", domain: "both" as const },
  { id: "5", title: "Zanzariere finestre anti-infestanti", domain: "both" as const },
  { id: "6", title: "Separazione alimenti crudi/cotti", domain: "haccp" as const },
  { id: "7", title: "Tracciabilità lotti celle", domain: "haccp" as const },
];

// Test A: haccp_only
console.log("Test 1: checklistMode === 'haccp_only'");
const haccpFiltered = filterEnvironmentItemsByChecklistMode(sampleItems, "haccp_only");
assert.equal(haccpFiltered.length, 5, "Dovrebbero esserci 5 requisiti (3 both + 2 haccp)");
assert.ok(
  haccpFiltered.every((it) => it.domain === "haccp" || it.domain === "both"),
  "Tutti i requisiti devono essere haccp o both",
);
assert.ok(
  !haccpFiltered.some((it) => it.domain === "safety"),
  "Nessun requisito con domain 'safety' (es. cubatura, CPI) deve essere presente",
);
assert.ok(
  haccpFiltered.some((it) => it.id === "1") === false,
  "Cubatura deve essere esclusa in haccp_only",
);
assert.ok(
  haccpFiltered.some((it) => it.id === "2") === false,
  "CPI deve essere escluso in haccp_only",
);

// Test B: safety_only
console.log("Test 2: checklistMode === 'safety_only'");
const safetyFiltered = filterEnvironmentItemsByChecklistMode(sampleItems, "safety_only");
assert.equal(safetyFiltered.length, 5, "Dovrebbero esserci 5 requisiti (2 safety + 3 both)");
assert.ok(
  safetyFiltered.every((it) => it.domain === "safety" || it.domain === "both"),
  "Tutti i requisiti devono essere safety o both",
);
assert.ok(
  !safetyFiltered.some((it) => it.domain === "haccp"),
  "Nessun requisito con domain 'haccp' deve essere presente",
);
assert.ok(
  safetyFiltered.some((it) => it.id === "6") === false,
  "Separazione alimenti deve essere esclusa in safety_only",
);

// Test C: unified
console.log("Test 3: checklistMode === 'unified' o indefinito");
const unifiedFiltered = filterEnvironmentItemsByChecklistMode(sampleItems, "unified");
assert.equal(unifiedFiltered.length, 7, "Tutti i requisiti devono essere presenti in unified");

const defaultFiltered = filterEnvironmentItemsByChecklistMode(sampleItems, undefined);
assert.equal(defaultFiltered.length, 7, "Tutti i requisiti devono essere presenti se mode è undefined");

// 2. Test combinato con generateEnvironmentChecklistItems per una cucina
console.log("Test 4: Verifica requisiti generati normativi per cucina ristorante");
const cucinaEnv: WorkEnvironmentInstance = {
  id: "env-cucina-test",
  key: "cucina_calda",
  name: "Cucina Principale",
  icon: "🍳",
  category: "production",
  isDefault: true,
  heightM: 2.8,
  surfaceSqM: 35.0,
  volumeCuM: 98.0,
  occupantsCount: 3,
  windowSurfaceSqM: 4.5,
  hasForcedVentilation: true,
  gasThermalPowerKw: 45.0,
  isConfirmed: true,
  features: defaultEnvironmentFeatures("production"),
};

const generatedForCucina = generateEnvironmentChecklistItems(cucinaEnv, "56.10.11");
assert.ok(generatedForCucina.length > 0, "Devono essere generati requisiti per la cucina");

// In haccp_only
const cucinaHaccp = filterEnvironmentItemsByChecklistMode(generatedForCucina, "haccp_only");
assert.ok(cucinaHaccp.length > 0, "Devono esserci requisiti igienico-sanitari per la cucina");
for (const item of cucinaHaccp) {
  assert.notEqual(item.domain, "safety", `Requisito '${item.title}' con domain 'safety' non deve essere in haccp_only`);
  assert.ok(
    item.domain === "haccp" || item.domain === "both",
    `Requisito '${item.title}' deve avere domain 'haccp' o 'both'`,
  );
}
// Cubatura e altezza è domain safety -> non deve esserci in haccp_only
const hasCubaturaInHaccp = cucinaHaccp.some((it) => it.id.includes("dim-cubatura"));
assert.equal(hasCubaturaInHaccp, false, "Cubatura D.Lgs. 81 non deve essere presente in haccp_only");

// In safety_only
const cucinaSafety = filterEnvironmentItemsByChecklistMode(generatedForCucina, "safety_only");
assert.ok(cucinaSafety.length > 0, "Devono esserci requisiti di sicurezza per la cucina");
for (const item of cucinaSafety) {
  assert.notEqual(item.domain, "haccp", `Requisito '${item.title}' con domain 'haccp' non deve essere in safety_only`);
  assert.ok(
    item.domain === "safety" || item.domain === "both",
    `Requisito '${item.title}' deve avere domain 'safety' o 'both'`,
  );
}
const hasCubaturaInSafety = cucinaSafety.some((it) => it.id.includes("dim-cubatura"));
assert.equal(hasCubaturaInSafety, true, "Cubatura D.Lgs. 81 deve essere presente in safety_only");

// 3. Test Ipermercato ATECO 47.11.1 (o 47.11.10)
console.log("Test 5: getStandardEnvironmentsForAteco per Ipermercato (47.11.1)");
const iperEnvs = getStandardEnvironmentsForAteco("47.11.1");
assert.equal(iperEnvs.length, 12, "L'ipermercato deve avere esattamente 12 ambienti tipici");

// Verifica ID e nomi dei 12 reparti/ambienti
const expectedIds = [
  "env-iper-corsie",
  "env-iper-macelleria",
  "env-iper-pescheria",
  "env-iper-gastronomia",
  "env-iper-panetteria",
  "env-iper-ortofrutta",
  "env-iper-magazzino",
  "env-iper-celle-frigo",
  "env-iper-centrale-frigo",
  "env-iper-compattatore",
  "env-iper-casse-uffici",
  "env-iper-spogliatoi",
];

for (const id of expectedIds) {
  const envFound = iperEnvs.find((e) => e.id === id);
  assert.ok(envFound, `Ambiente con id ${id} deve essere presente nell'elenco Ipermercato`);
}

// Verifica proprietà specifiche dei locali chiave
const corsie = iperEnvs.find((e) => e.id === "env-iper-corsie")!;
assert.equal(corsie.surfaceSqM, 3500);
assert.equal(corsie.heightM, 5.0);
assert.equal(corsie.volumeCuM, 17500);
assert.equal(corsie.occupantsCount, 30);
assert.equal(corsie.features.forcedExhaustPresent, true);
assert.equal(corsie.features.emergencyExitsCount, 6);

const celleFrigo = iperEnvs.find((e) => e.id === "env-iper-celle-frigo")!;
assert.equal(celleFrigo.category, "storage");
assert.equal(celleFrigo.surfaceSqM, 150);
assert.equal(celleFrigo.features.hasTrappedPersonAlarm, true);

const magazzino = iperEnvs.find((e) => e.id === "env-iper-magazzino")!;
assert.equal(magazzino.surfaceSqM, 1200);
assert.equal(magazzino.heightM, 6.5);
assert.equal(magazzino.volumeCuM, 7800);

// Test 6: evaluateEnvironmentCompliance per Ipermercato
console.log("Test 6: evaluateEnvironmentCompliance per ambienti Ipermercato");
const evalCorsie = evaluateEnvironmentCompliance(corsie, "47.11.1");
assert.ok(evalCorsie.cpiActivityAlert, "L'area vendita corsie (3500mq) deve essere soggetta a CPI");
assert.ok(
  evalCorsie.summaryBadges.some((b) => b.text.includes("Corsie di esodo")),
  "Deve esserci badge per corsie di esodo ≥ 2,40m",
);
assert.ok(
  evalCorsie.summaryBadges.some((b) => b.text.includes("Uscite di emergenza")),
  "Deve esserci badge per uscite di emergenza con maniglioni antipanico",
);

const evalCelle = evaluateEnvironmentCompliance(celleFrigo, "47.11.1");
assert.ok(
  evalCelle.summaryBadges.some((b) => b.text.includes("Allarme uomo intrappolato")),
  "Deve esserci badge allarme uomo intrappolato a norma UNI EN 378 per celle",
);

const centraleFrigo = iperEnvs.find((e) => e.id === "env-iper-centrale-frigo")!;
const evalCentrale = evaluateEnvironmentCompliance(centraleFrigo, "47.11.1");
assert.ok(
  evalCentrale.summaryBadges.some((b) => b.text.includes("Sensori gas refrigerante")),
  "Deve esserci badge per sensori fughe gas refrigerante e ventilazione emergenza",
);

// Test 7: generateEnvironmentChecklistItems per reparti Ipermercato
console.log("Test 7: generateEnvironmentChecklistItems per reparti specifici Ipermercato");
const macelleria = iperEnvs.find((e) => e.id === "env-iper-macelleria")!;
const macelleriaItems = generateEnvironmentChecklistItems(macelleria, "47.11.1");
assert.ok(
  macelleriaItems.some((it) => it.id.includes("ganciere-guidovie")),
  "Macelleria deve avere verifica guidovie aeree e ganciere",
);
assert.ok(
  macelleriaItems.some((it) => it.id.includes("lavamani-sterilizzatore")),
  "Macelleria deve avere verifica lavamani comando non manuale e sterilizzatore coltelli",
);

const pescheria = iperEnvs.find((e) => e.id === "env-iper-pescheria")!;
const pescheriaItems = generateEnvironmentChecklistItems(pescheria, "47.11.1");
assert.ok(
  pescheriaItems.some((it) => it.id.includes("banco-pesce-scolo")),
  "Pescheria deve avere verifica banco ghiaccio con scolo acque continuo",
);
assert.ok(
  pescheriaItems.some((it) => it.id.includes("sicurezza-pescheria-dpi")),
  "Pescheria deve avere verifica pavimento R13 e guanti antitaglio in maglia d'acciaio",
);

const celleFrigoItems = generateEnvironmentChecklistItems(celleFrigo, "47.11.1");
assert.ok(
  celleFrigoItems.some((it) => it.id.includes("allarme-uomo-intrappolato")),
  "Celle frigorifere devono avere verifica allarme uomo intrappolato UNI EN 378",
);
assert.ok(
  celleFrigoItems.some((it) => it.id.includes("teletermometro-registrazione")),
  "Celle frigorifere devono avere verifica teletermometro continuo Reg. CE 37/2005",
);

const corsieItems = generateEnvironmentChecklistItems(corsie, "47.11.1");
assert.ok(
  corsieItems.some((it) => it.id.includes("corsie-esodo-vie-fuga")),
  "Corsie ipermercato devono avere verifica corsie esodo ≥ 2.40m",
);
assert.ok(
  corsieItems.some((it) => it.id.includes("scaffali-vendita-corsie")),
  "Corsie ipermercato devono avere verifica reti anticaduta e fermo-pacchi",
);

const centraleFrigoItems = generateEnvironmentChecklistItems(centraleFrigo, "47.11.1");
assert.ok(
  centraleFrigoItems.some((it) => it.id.includes("centrale-frigo-gas-refrigerante")),
  "Centrale frigorifera deve avere verifica rilevazione perdite gas refrigerante",
);

const compattatore = iperEnvs.find((e) => e.id === "env-iper-compattatore")!;
const compattatoreItems = generateEnvironmentChecklistItems(compattatore, "47.11.1");
assert.ok(
  compattatoreItems.some((it) => it.id.includes("compattatori-sicurezza-macchine")),
  "Compattatori devono avere verifica arresti d'emergenza e interblocchi",
);

// ============================================================================
// 4. Test Supermercato ATECO 47.11.2 (o 47.11.20 / 47112)
// ============================================================================
console.log("Test 8: getStandardEnvironmentsForAteco per Supermercato (47.11.2 / 47.11.20)");
const superEnvs = getStandardEnvironmentsForAteco("47.11.2");
assert.equal(superEnvs.length, 12, "Il supermercato deve avere esattamente 12 ambienti tipici");

// Verifica ID dei 12 ambienti standard del Supermercato
const expectedSuperIds = [
  "env-super-corsie",
  "env-super-gastronomia",
  "env-super-macelleria",
  "env-super-panetteria",
  "env-super-ortofrutta",
  "env-super-pescheria",
  "env-super-magazzino",
  "env-super-celle-frigo",
  "env-super-compattatore",
  "env-super-casse-uffici",
  "env-super-spogliatoi",
  "env-super-tecnico",
];

for (const id of expectedSuperIds) {
  const envFound = superEnvs.find((e) => e.id === id);
  assert.ok(envFound, `Ambiente con id ${id} deve essere presente nell'elenco Supermercato`);
}

// Verifica varianti di prefisso (47.11.20 e 47112)
const superEnvsVariant1 = getStandardEnvironmentsForAteco("47.11.20");
assert.equal(superEnvsVariant1.length, 12, "Anche 47.11.20 deve restituire 12 ambienti Supermercato");
const superEnvsVariant2 = getStandardEnvironmentsForAteco("47112");
assert.equal(superEnvsVariant2.length, 12, "Anche 47112 deve restituire 12 ambienti Supermercato");

// Verifica parametri dimensionali e caratteristiche dei reparti Supermercato
const superCorsie = superEnvs.find((e) => e.id === "env-super-corsie")!;
assert.equal(superCorsie.category, "sales_office");
assert.equal(superCorsie.surfaceSqM, 900);
assert.equal(superCorsie.heightM, 3.8);
assert.equal(superCorsie.volumeCuM, 3420);
assert.equal(superCorsie.occupantsCount, 12);
assert.equal(superCorsie.emergencyExitsCount, 3);
assert.equal(superCorsie.features.forcedExhaustPresent, true);
assert.equal(superCorsie.features.emergencyLighting, true);
assert.equal(superCorsie.features.shelvingCertified, true);
assert.equal(superCorsie.features.fireLoadHigh, true);

const superGastronomia = superEnvs.find((e) => e.id === "env-super-gastronomia")!;
assert.equal(superGastronomia.category, "production");
assert.equal(superGastronomia.surfaceSqM, 35);
assert.equal(superGastronomia.heightM, 3.0);
assert.equal(superGastronomia.volumeCuM, 105);
assert.equal(superGastronomia.occupantsCount, 3);
assert.equal(superGastronomia.features.wallsCondition, "washable_sanitizable_2m");

const superMacelleria = superEnvs.find((e) => e.id === "env-super-macelleria")!;
assert.equal(superMacelleria.category, "production");
assert.equal(superMacelleria.surfaceSqM, 40);
assert.equal(superMacelleria.heightM, 3.0);
assert.equal(superMacelleria.volumeCuM, 120);
assert.equal(superMacelleria.occupantsCount, 2);

const superPanetteria = superEnvs.find((e) => e.id === "env-super-panetteria")!;
assert.equal(superPanetteria.category, "production");
assert.equal(superPanetteria.surfaceSqM, 30);
assert.equal(superPanetteria.heightM, 3.2);
assert.equal(superPanetteria.volumeCuM, 96);
assert.equal(superPanetteria.occupantsCount, 2);

const superOrtofrutta = superEnvs.find((e) => e.id === "env-super-ortofrutta")!;
assert.equal(superOrtofrutta.category, "production");
assert.equal(superOrtofrutta.surfaceSqM, 45);
assert.equal(superOrtofrutta.heightM, 3.2);
assert.equal(superOrtofrutta.volumeCuM, 144);
assert.equal(superOrtofrutta.occupantsCount, 2);

const superPescheria = superEnvs.find((e) => e.id === "env-super-pescheria")!;
assert.equal(superPescheria.category, "production");
assert.equal(superPescheria.surfaceSqM, 30);
assert.equal(superPescheria.heightM, 3.0);
assert.equal(superPescheria.volumeCuM, 90);
assert.equal(superPescheria.occupantsCount, 2);

const superMagazzino = superEnvs.find((e) => e.id === "env-super-magazzino")!;
assert.equal(superMagazzino.category, "warehouse");
assert.equal(superMagazzino.surfaceSqM, 350);
assert.equal(superMagazzino.heightM, 4.5);
assert.equal(superMagazzino.volumeCuM, 1575);
assert.equal(superMagazzino.occupantsCount, 4);

const superCelleFrigo = superEnvs.find((e) => e.id === "env-super-celle-frigo")!;
assert.equal(superCelleFrigo.category, "storage");
assert.equal(superCelleFrigo.surfaceSqM, 50);
assert.equal(superCelleFrigo.heightM, 3.0);
assert.equal(superCelleFrigo.volumeCuM, 150);
assert.equal(superCelleFrigo.features.hasTrappedPersonAlarm, true);

const superCompattatore = superEnvs.find((e) => e.id === "env-super-compattatore")!;
assert.equal(superCompattatore.category, "technical");
assert.equal(superCompattatore.surfaceSqM, 30);
assert.equal(superCompattatore.heightM, 3.2);
assert.equal(superCompattatore.volumeCuM, 96);

const superCasseUffici = superEnvs.find((e) => e.id === "env-super-casse-uffici")!;
assert.equal(superCasseUffici.category, "sales_office");
assert.equal(superCasseUffici.surfaceSqM, 50);
assert.equal(superCasseUffici.heightM, 3.0);
assert.equal(superCasseUffici.volumeCuM, 150);
assert.equal(superCasseUffici.occupantsCount, 6);

const superSpogliatoi = superEnvs.find((e) => e.id === "env-super-spogliatoi")!;
assert.equal(superSpogliatoi.category, "changing_rooms");
assert.equal(superSpogliatoi.surfaceSqM, 45);
assert.equal(superSpogliatoi.heightM, 2.7);
assert.equal(superSpogliatoi.volumeCuM, 121.5);
assert.equal(superSpogliatoi.occupantsCount, 12);

const superTecnico = superEnvs.find((e) => e.id === "env-super-tecnico")!;
assert.equal(superTecnico.category, "technical");
assert.equal(superTecnico.surfaceSqM, 25);
assert.equal(superTecnico.heightM, 3.0);
assert.equal(superTecnico.volumeCuM, 75);
assert.equal(superTecnico.features.gasLeakDetectorPresent, true);

// Test 9: evaluateEnvironmentCompliance per Supermercato
console.log("Test 9: evaluateEnvironmentCompliance per ambienti Supermercato");
const evalSuperCorsie = evaluateEnvironmentCompliance(superCorsie, "47.11.2");
assert.ok(evalSuperCorsie.cpiActivityAlert, "L'area vendita del supermercato (900mq) deve essere soggetta a CPI");
assert.ok(
  evalSuperCorsie.cpiActivityAlert.code.includes("69.1.A"),
  "Superficie di 900mq deve rientrare nell'Attività 69.1.A (400-1500 mq)",
);
assert.ok(
  evalSuperCorsie.summaryBadges.some((b) => b.text.includes("Corsie di esodo principali ≥ 1,80m")),
  "Deve esserci badge per corsie di esodo ≥ 1,80m D.M. 27/07/2010 per supermercato",
);
assert.ok(
  evalSuperCorsie.summaryBadges.some((b) => b.text.includes("Uscite di emergenza: 3 varchi")),
  "Deve esserci badge per 3 varchi uscite di emergenza con maniglioni antipanico",
);

const evalSuperCelle = evaluateEnvironmentCompliance(superCelleFrigo, "47.11.2");
assert.ok(
  evalSuperCelle.summaryBadges.some((b) => b.text.includes("Allarme uomo intrappolato")),
  "Celle frigo supermercato devono avere badge allarme uomo intrappolato UNI EN 378",
);

const evalSuperTecnico = evaluateEnvironmentCompliance(superTecnico, "47.11.2");
assert.ok(
  evalSuperTecnico.summaryBadges.some((b) => b.text.includes("Sensori gas refrigerante")),
  "Locale tecnico compressori deve avere badge sensori gas refrigerante e ventilazione emergenza",
);

// Test 10: generateEnvironmentChecklistItems per reparti specifici Supermercato
console.log("Test 10: generateEnvironmentChecklistItems per reparti Supermercato");

// Corsie supermercato
const superCorsieItems = generateEnvironmentChecklistItems(superCorsie, "47.11.2");
assert.ok(
  superCorsieItems.some((it) => it.id.includes("corsie-esodo-vie-fuga") && it.title.includes("1,80 m")),
  "Corsie supermercato devono avere verifica vie di esodo ≥ 1,80 m",
);
assert.ok(
  superCorsieItems.some((it) => it.id.includes("scaffali-vendita-corsie")),
  "Corsie supermercato devono avere verifica scaffalature di vendita e reti anticaduta",
);
assert.ok(
  superCorsieItems.some((it) => it.id.includes("banchi-frigo-murali")),
  "Corsie supermercato devono avere verifica banchi frigo murali con teletermometri",
);

// Macelleria supermercato
const superMacelleriaItems = generateEnvironmentChecklistItems(superMacelleria, "47.11.2");
assert.ok(
  superMacelleriaItems.some((it) => it.id.includes("ganciere-guidovie")),
  "Macelleria supermercato deve avere verifica ganciere carni",
);
assert.ok(
  superMacelleriaItems.some((it) => it.id.includes("lavamani-sterilizzatore")),
  "Macelleria supermercato deve avere verifica lavamani comando non manuale e sterilizzatore",
);
assert.ok(
  superMacelleriaItems.some((it) => it.id.includes("banco-carni-canalina-cella")),
  "Macelleria supermercato deve avere verifica banco carni, canaline inox e cella",
);

// Gastronomia supermercato
const superGastroItems = generateEnvironmentChecklistItems(superGastronomia, "47.11.2");
assert.ok(
  superGastroItems.some((it) => it.id.includes("attrezzature-gastronomia")),
  "Gastronomia supermercato deve avere verifica affettatrici con protezioni e forni",
);
assert.ok(
  superGastroItems.some((it) => it.id.includes("gastronomia-banco-lavamani")),
  "Gastronomia supermercato deve avere verifica banco +4°C e lavamani non manuale",
);

// Panetteria / Bake-off supermercato
const superPaneItems = generateEnvironmentChecklistItems(superPanetteria, "47.11.2");
assert.ok(
  superPaneItems.some((it) => it.id.includes("forno-doratura-bakeoff")),
  "Panetteria supermercato deve avere verifica forno doratura bake-off e cappa a condensazione",
);
assert.ok(
  superPaneItems.some((it) => it.id.includes("tagliapane-banchi-selfservice")),
  "Panetteria supermercato deve avere verifica macchina tagliapane con ripari e banchi self-service",
);

// Ortofrutta supermercato
const superOrtoItems = generateEnvironmentChecklistItems(superOrtofrutta, "47.11.2");
assert.ok(
  superOrtoItems.some((it) => it.id.includes("ortofrutta-mondatura-bilance")),
  "Ortofrutta supermercato deve avere verifica tavoli mondatura inox e bilance self-service omologate",
);

// Pescheria supermercato
const superPesceItems = generateEnvironmentChecklistItems(superPescheria, "47.11.2");
assert.ok(
  superPesceItems.some((it) => it.id.includes("banco-pesce-scolo")),
  "Pescheria supermercato deve avere verifica banco pesce e scolo continuo",
);
assert.ok(
  superPesceItems.some((it) => it.id.includes("sicurezza-pescheria-dpi")),
  "Pescheria supermercato deve avere verifica pavimento R13 e guanti antitaglio in maglia",
);

// Magazzino merci supermercato
const superMagazzinoItems = generateEnvironmentChecklistItems(superMagazzino, "47.11.2");
assert.ok(
  superMagazzinoItems.some((it) => it.id.includes("scaffalature-transpallet-scarico")),
  "Magazzino supermercato deve avere verifica scaffalature porta-pallet medie e portone scarico",
);

// Celle frigo supermercato
const superCelleItems = generateEnvironmentChecklistItems(superCelleFrigo, "47.11.2");
assert.ok(
  superCelleItems.some((it) => it.id.includes("allarme-uomo-intrappolato")),
  "Celle frigo supermercato devono avere verifica allarme uomo intrappolato UNI EN 378",
);
assert.ok(
  superCelleItems.some((it) => it.id.includes("teletermometro-registrazione")),
  "Celle frigo supermercato devono avere verifica teletermometro registrazione continua",
);

// Compattatore imballaggi supermercato
const superCompattatoreItems = generateEnvironmentChecklistItems(superCompattatore, "47.11.2");
assert.ok(
  superCompattatoreItems.some((it) => it.id.includes("pressa-compattatrice-verticale")),
  "Compattatore supermercato deve avere verifica pressa compattatrice verticale UNI EN 16500",
);
assert.ok(
  superCompattatoreItems.some((it) => it.id.includes("igiene-area-rifiuti")),
  "Compattatore supermercato deve avere verifica igiene e lavaggio area rifiuti",
);

// Casse e Uffici supermercato
const superCasseItems = generateEnvironmentChecklistItems(superCasseUffici, "47.11.2");
assert.ok(
  superCasseItems.some((it) => it.id.includes("barriera-casse-esodo")),
  "Barriera casse deve avere verifica varchi di esodo ed evacuazione",
);
assert.ok(
  superCasseItems.some((it) => it.id.includes("ergonomia-postazione-cassa")),
  "Postazioni cassa devono avere verifica ergonomia sedute e poggiapiedi",
);
assert.ok(
  superCasseItems.some((it) => it.id.includes("nastri-motorizzati-casse")),
  "Banchi cassa devono avere verifica nastri motorizzati con fotocellula e pedale uomo presente",
);

// Locale tecnico compressori supermercato
const superTecnicoItems = generateEnvironmentChecklistItems(superTecnico, "47.11.2");
assert.ok(
  superTecnicoItems.some((it) => it.id.includes("centrale-frigo-gas-refrigerante")),
  "Locale tecnico deve avere verifica rilevazione fughe gas refrigerante e ventilazione",
);
assert.ok(
  superTecnicoItems.some((it) => it.id.includes("centrale-frigo-accesso-dpi")),
  "Locale tecnico deve avere verifica sgancio di emergenza e accesso autorizzato",
);

console.log("=== TUTTI I TEST Step2AmbientiDiLavoro SUPERATI CON SUCCESSO! ===");
