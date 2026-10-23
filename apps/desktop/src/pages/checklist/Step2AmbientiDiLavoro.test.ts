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

// ============================================================================
// 5. Test Ristorante con Somministrazione ATECO 56.10.11 (o 56.10.1 / 561011)
// ============================================================================
console.log("Test 11: getStandardEnvironmentsForAteco & conformità per Ristorante (56.10.11 / 56.10.1)");
const ristEnvs = getStandardEnvironmentsForAteco("56.10.11");
assert.equal(ristEnvs.length, 11, "Il ristorante con somministrazione deve avere esattamente 11 ambienti tipici");

// Verifica prefissi e varianti (56.10.1, 56.10.10, 561011, 56101)
const ristEnvsVar1 = getStandardEnvironmentsForAteco("56.10.1");
assert.equal(ristEnvsVar1.length, 11, "Anche prefisso 56.10.1 deve restituire gli 11 ambienti ristorante");
const ristEnvsVar2 = getStandardEnvironmentsForAteco("56.10.10");
assert.equal(ristEnvsVar2.length, 11, "Anche prefisso 56.10.10 deve restituire gli 11 ambienti ristorante");
const ristEnvsVar3 = getStandardEnvironmentsForAteco("561011");
assert.equal(ristEnvsVar3.length, 11, "Anche codice non formattato 561011 deve restituire 11 ambienti ristorante");
const ristEnvsVar4 = getStandardEnvironmentsForAteco("56101");
assert.equal(ristEnvsVar4.length, 11, "Anche codice non formattato 56101 deve restituire 11 ambienti ristorante");

// Verifica ID degli 11 ambienti standard del Ristorante
const expectedRistIds = [
  "env-rist-cucina",
  "env-rist-plonge",
  "env-rist-prep-fredda",
  "env-rist-celle",
  "env-rist-dispensa",
  "env-rist-sala",
  "env-rist-bar-cassa",
  "env-rist-spogliatoi",
  "env-rist-wc-clienti",
  "env-rist-rifiuti",
  "env-rist-tecnico",
];

for (const id of expectedRistIds) {
  const envFound = ristEnvs.find((e) => e.id === id);
  assert.ok(envFound, `Ambiente con id ${id} deve essere presente nell'elenco Ristorante`);
}

// 1. Cucina Ristorante
const ristCucina = ristEnvs.find((e) => e.id === "env-rist-cucina")!;
assert.equal(ristCucina.category, "production");
assert.equal(ristCucina.surfaceSqM, 45);
assert.equal(ristCucina.heightM, 3.0);
assert.equal(ristCucina.volumeCuM, 135);
assert.equal(ristCucina.occupantsCount, 4);
assert.equal(ristCucina.windowSurfaceSqM, 4.5);
assert.equal(ristCucina.features.forcedExhaustPresent, true);
assert.equal(ristCucina.features.forcedExhaustType, "kitchen_hood");
assert.equal(ristCucina.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ristCucina.features.flooringCondition, "compliant_anti_slip");
assert.equal(ristCucina.features.insectScreens, true);
assert.equal(ristCucina.features.microclimateCompliant, true);

// 2. Plonge
const ristPlonge = ristEnvs.find((e) => e.id === "env-rist-plonge")!;
assert.equal(ristPlonge.category, "production");
assert.equal(ristPlonge.surfaceSqM, 15);
assert.equal(ristPlonge.heightM, 3.0);
assert.equal(ristPlonge.volumeCuM, 45);
assert.equal(ristPlonge.occupantsCount, 2);
assert.equal(ristPlonge.windowSurfaceSqM, 1.5);
assert.equal(ristPlonge.features.forcedExhaustPresent, true);
assert.equal(ristPlonge.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ristPlonge.features.flooringCondition, "compliant_anti_slip");

// 3. Prep Fredda
const ristPrepFredda = ristEnvs.find((e) => e.id === "env-rist-prep-fredda")!;
assert.equal(ristPrepFredda.category, "production");
assert.equal(ristPrepFredda.surfaceSqM, 18);
assert.equal(ristPrepFredda.heightM, 3.0);
assert.equal(ristPrepFredda.volumeCuM, 54);
assert.equal(ristPrepFredda.occupantsCount, 2);
assert.equal(ristPrepFredda.windowSurfaceSqM, 2.0);
assert.equal(ristPrepFredda.features.forcedExhaustPresent, true);
assert.equal(ristPrepFredda.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ristPrepFredda.features.flooringCondition, "compliant_anti_slip");
assert.equal(ristPrepFredda.features.insectScreens, true);
assert.equal(ristPrepFredda.features.microclimateCompliant, true);

// 4. Celle Deperibili
const ristCelle = ristEnvs.find((e) => e.id === "env-rist-celle")!;
assert.equal(ristCelle.category, "storage");
assert.equal(ristCelle.surfaceSqM, 20);
assert.equal(ristCelle.heightM, 2.6);
assert.equal(ristCelle.volumeCuM, 52);
assert.equal(ristCelle.occupantsCount, 1);
assert.equal(ristCelle.windowSurfaceSqM, 0);
assert.equal(ristCelle.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ristCelle.features.flooringCondition, "compliant_anti_slip");
assert.equal(ristCelle.features.emergencyLighting, true);
assert.equal(ristCelle.features.hasTrappedPersonAlarm, true);

// 5. Dispensa Secco
const ristDispensa = ristEnvs.find((e) => e.id === "env-rist-dispensa")!;
assert.equal(ristDispensa.category, "warehouse");
assert.equal(ristDispensa.surfaceSqM, 25);
assert.equal(ristDispensa.heightM, 2.7);
assert.equal(ristDispensa.volumeCuM, 67.5);
assert.equal(ristDispensa.occupantsCount, 1);
assert.equal(ristDispensa.windowSurfaceSqM, 2.0);
assert.equal(ristDispensa.features.shelvingCertified, true);

// 6. Sala Ristorazione
const ristSala = ristEnvs.find((e) => e.id === "env-rist-sala")!;
assert.equal(ristSala.category, "public");
assert.equal(ristSala.surfaceSqM, 120);
assert.equal(ristSala.heightM, 2.8);
assert.equal(ristSala.volumeCuM, 336);
assert.equal(ristSala.occupantsCount, 60);
assert.equal(ristSala.windowSurfaceSqM, 15.0);
assert.equal(ristSala.emergencyExitsCount, 2);
assert.equal(ristSala.features.emergencyLighting, true);
assert.equal(ristSala.features.antiShatterGlass, true);

// 7. Bar / Cassa
const ristBarCassa = ristEnvs.find((e) => e.id === "env-rist-bar-cassa")!;
assert.equal(ristBarCassa.category, "sales_office");
assert.equal(ristBarCassa.surfaceSqM, 20);
assert.equal(ristBarCassa.heightM, 2.8);
assert.equal(ristBarCassa.volumeCuM, 56);
assert.equal(ristBarCassa.occupantsCount, 2);
assert.equal(ristBarCassa.windowSurfaceSqM, 2.0);
assert.equal(ristBarCassa.features.emergencyLighting, true);

// 8. Spogliatoi
const ristSpogliatoi = ristEnvs.find((e) => e.id === "env-rist-spogliatoi")!;
assert.equal(ristSpogliatoi.category, "changing_rooms");
assert.equal(ristSpogliatoi.surfaceSqM, 16);
assert.equal(ristSpogliatoi.heightM, 2.4);
assert.equal(ristSpogliatoi.volumeCuM, 38.4);
assert.equal(ristSpogliatoi.occupantsCount, 6);
assert.equal(ristSpogliatoi.windowSurfaceSqM, 1.5);
assert.equal(ristSpogliatoi.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ristSpogliatoi.features.flooringCondition, "compliant_anti_slip");
assert.equal(ristSpogliatoi.features.forcedExhaustPresent, true);
assert.equal(ristSpogliatoi.features.forcedExhaustType, "blind_toilet_fan");

// 9. WC Clienti
const ristWcClienti = ristEnvs.find((e) => e.id === "env-rist-wc-clienti")!;
assert.equal(ristWcClienti.category, "services");
assert.equal(ristWcClienti.surfaceSqM, 15);
assert.equal(ristWcClienti.heightM, 2.4);
assert.equal(ristWcClienti.volumeCuM, 36);
assert.equal(ristWcClienti.occupantsCount, 2);
assert.equal(ristWcClienti.windowSurfaceSqM, 1.5);
assert.equal(ristWcClienti.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ristWcClienti.features.flooringCondition, "compliant_anti_slip");
assert.equal(ristWcClienti.features.forcedExhaustPresent, true);
assert.equal(ristWcClienti.features.forcedExhaustType, "blind_toilet_fan");

// 10. Deposito Rifiuti
const ristRifiuti = ristEnvs.find((e) => e.id === "env-rist-rifiuti")!;
assert.equal(ristRifiuti.category, "technical");
assert.equal(ristRifiuti.surfaceSqM, 12);
assert.equal(ristRifiuti.heightM, 2.7);
assert.equal(ristRifiuti.volumeCuM, 32.4);
assert.equal(ristRifiuti.occupantsCount, 1);
assert.equal(ristRifiuti.windowSurfaceSqM, 0);
assert.equal(ristRifiuti.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ristRifiuti.features.flooringCondition, "compliant_anti_slip");

// 11. Locale Tecnico Gas
const ristTecnico = ristEnvs.find((e) => e.id === "env-rist-tecnico")!;
assert.equal(ristTecnico.category, "technical");
assert.equal(ristTecnico.surfaceSqM, 10);
assert.equal(ristTecnico.heightM, 2.5);
assert.equal(ristTecnico.volumeCuM, 25);
assert.equal(ristTecnico.occupantsCount, 1);
assert.equal(ristTecnico.windowSurfaceSqM, 0);
assert.equal(ristTecnico.features.emergencyLighting, true);
assert.equal(ristTecnico.features.gasLeakDetectorPresent, true);

// Verifica evaluateEnvironmentCompliance per locali Ristorante
const evalRistCucina = evaluateEnvironmentCompliance(ristCucina, "56.10.11");
assert.equal(evalRistCucina.isHeightCompliant, true, "Cucina ristorante h=3.00m è conforme");
assert.ok(
  evalRistCucina.summaryBadges.some((b) => b.text.includes("Cucina a norma: altezza ≥ 3,00m")),
  "Cucina deve avere badge altezza ≥ 3,00m e Ansul",
);
assert.ok(
  evalRistCucina.summaryBadges.some((b) => b.text.includes("Lavamani comando non manuale")),
  "Cucina deve avere badge lavamani comando non manuale",
);

const evalRistSala = evaluateEnvironmentCompliance(ristSala, "56.10.11");
assert.ok(
  evalRistSala.summaryBadges.some((b) => b.text.includes("Vie di esodo libere ≥ 1,20m")),
  "Sala deve avere badge vie di esodo libere ≥ 1,20m",
);
assert.ok(
  evalRistSala.summaryBadges.some((b) => b.text.includes("Illuminazione di emergenza ≥ 5 lux")),
  "Sala deve avere badge illuminazione emergenza ed estintori 34A 233B",
);

const evalRistPlonge = evaluateEnvironmentCompliance(ristPlonge, "56.10.11");
assert.ok(
  evalRistPlonge.summaryBadges.some((b) => b.text.includes("Plonge separata: percorso sporco/pulito")),
  "Plonge deve avere badge separazione marcia in avanti",
);

const evalRistCelle = evaluateEnvironmentCompliance(ristCelle, "56.10.11");
assert.ok(
  evalRistCelle.summaryBadges.some((b) => b.text.includes("Allarme uomo intrappolato")),
  "Celle devono avere badge allarme uomo intrappolato UNI EN 378",
);
assert.ok(
  evalRistCelle.summaryBadges.some((b) => b.text.includes("Teletermometri continui HACCP")),
  "Celle devono avere badge teletermometri continui HACCP",
);

const evalRistSpogliatoi = evaluateEnvironmentCompliance(ristSpogliatoi, "56.10.11");
assert.ok(
  evalRistSpogliatoi.summaryBadges.some((b) => b.text.includes("Armadietti doppio scomparto sporco/pulito")),
  "Spogliatoi staff devono avere badge armadietti doppio scomparto",
);

const evalRistTecnico = evaluateEnvironmentCompliance(ristTecnico, "56.10.11");
assert.ok(
  evalRistTecnico.summaryBadges.some((b) => b.text.includes("Elettrovalvola gas metano esterna")),
  "Locale tecnico deve avere badge elettrovalvola gas metano con sgancio",
);

// ============================================================================
// Test 12: generateEnvironmentChecklistItems per locali specifici Ristorante
// ============================================================================
console.log("Test 12: generateEnvironmentChecklistItems per locali Ristorante (ATECO 56.10.11)");

// Cucina
const cucinaItems = generateEnvironmentChecklistItems(ristCucina, "56.10.11");
assert.ok(
  cucinaItems.some((it) => it.id.includes("termocoppie-cappa-ansul") && it.domain === "both"),
  "Cucina deve avere verifica termocoppie fuochi e impianto Ansul (domain: both)",
);
assert.ok(
  cucinaItems.some((it) => it.id.includes("filtri-antigrasso-labirinto") && it.domain === "both"),
  "Cucina deve avere verifica filtri antigrasso a labirinto e canna fumaria (domain: both)",
);
assert.ok(
  cucinaItems.some((it) => it.id.includes("lavamani-non-manuale") && it.domain === "haccp"),
  "Cucina deve avere verifica lavamani ginocchio con sapone e carta monouso (domain: haccp)",
);
assert.ok(
  cucinaItems.some((it) => it.id.includes("canaline-scolo-sifonate") && it.domain === "both"),
  "Cucina deve avere verifica canaline scolo sifonate con griglie inox (domain: both)",
);

// Plonge
const plongeItems = generateEnvironmentChecklistItems(ristPlonge, "56.10.11");
assert.ok(
  plongeItems.some((it) => it.id.includes("cappa-vapori-lavastoviglie") && it.domain === "safety"),
  "Plonge deve avere verifica cappa aspirazione vapori lavastoviglie (domain: safety)",
);
assert.ok(
  plongeItems.some((it) => it.id.includes("marcia-avanti-stoviglie") && it.domain === "haccp"),
  "Plonge deve avere verifica marcia in avanti percorso sporco/pulito (domain: haccp)",
);
assert.ok(
  plongeItems.some((it) => it.id.includes("dosatori-automatici-chimici") && it.domain === "safety"),
  "Plonge deve avere verifica dosatori automatici detergenti (domain: safety)",
);

// Prep Fredda
const prepFreddaItems = generateEnvironmentChecklistItems(ristPrepFredda, "56.10.11");
assert.ok(
  prepFreddaItems.some((it) => it.id.includes("tavoli-refrigerati-termometro") && it.domain === "haccp"),
  "Prep fredda deve avere verifica tavoli refrigerati con display (domain: haccp)",
);
assert.ok(
  prepFreddaItems.some((it) => it.id.includes("lavello-dedicato-verdure") && it.domain === "haccp"),
  "Prep fredda deve avere verifica lavello dedicato lavaggio verdure (domain: haccp)",
);
assert.ok(
  prepFreddaItems.some((it) => it.id.includes("coltelleria-taglieri-codice-colore") && it.domain === "haccp"),
  "Prep fredda deve avere verifica taglieri con codice colore HACCP (domain: haccp)",
);

// Celle Deperibili
const celleItems = generateEnvironmentChecklistItems(ristCelle, "56.10.11");
assert.ok(
  celleItems.some((it) => it.id.includes("allarme-uomo-intrappolato") && it.domain === "safety"),
  "Celle deperibili devono avere verifica allarme uomo intrappolato UNI EN 378 (domain: safety)",
);
assert.ok(
  celleItems.some((it) => it.id.includes("teletermometro-registrazione") && it.domain === "haccp"),
  "Celle deperibili devono avere verifica registrazione continua temperature HACCP (domain: haccp)",
);

// Dispensa Secco
const dispensaItems = generateEnvironmentChecklistItems(ristDispensa, "56.10.11");
assert.ok(
  dispensaItems.some((it) => it.id.includes("scaffalature-sollevate-pest-control") && it.domain === "haccp"),
  "Dispensa deve avere verifica scaffali sollevati ≥15cm per pest control (domain: haccp)",
);
assert.ok(
  dispensaItems.some((it) => it.id.includes("assenza-umidita-muffe") && it.domain === "both"),
  "Dispensa deve avere verifica assenza umidità e muffe (domain: both)",
);

// Sala Ristorazione
const salaItems = generateEnvironmentChecklistItems(ristSala, "56.10.11");
assert.ok(
  salaItems.some((it) => it.id.includes("vie-esodo-sala") && it.domain === "safety"),
  "Sala deve avere verifica vie di esodo libere ≥ 1.20m (domain: safety)",
);
assert.ok(
  salaItems.some((it) => it.id.includes("uscite-emergenza-antipanico") && it.domain === "safety"),
  "Sala deve avere verifica porte sicurezza antipanico UNI EN 1125 (domain: safety)",
);
assert.ok(
  salaItems.some((it) => it.id.includes("illuminazione-sicurezza-estintori") && it.domain === "safety"),
  "Sala deve avere verifica illuminazione sicurezza ed estintori (domain: safety)",
);

// Bar / Cassa
const barItems = generateEnvironmentChecklistItems(ristBarCassa, "56.10.11");
assert.ok(
  barItems.some((it) => it.id.includes("lancia-vapore-cooltouch") && it.domain === "safety"),
  "Bar/Cassa deve avere verifica lancia vapore cool-touch (domain: safety)",
);
assert.ok(
  barItems.some((it) => it.id.includes("lavabicchieri-temperatura-risciacquo") && it.domain === "haccp"),
  "Bar/Cassa deve avere verifica lavabicchieri con risciacquo a 85°C (domain: haccp)",
);
assert.ok(
  barItems.some((it) => it.id.includes("fabbricatore-ghiaccio-moca") && it.domain === "haccp"),
  "Bar/Cassa deve avere verifica fabbricatore ghiaccio conforme MOCA (domain: haccp)",
);
assert.ok(
  !barItems.some((it) => it.id.includes("nastri-motorizzati-casse")),
  "Bar/Cassa ristorante non deve avere nastri motorizzati casse da supermercato",
);

// Spogliatoio Personale
const spogliatoiItems = generateEnvironmentChecklistItems(ristSpogliatoi, "56.10.11");
assert.ok(
  spogliatoiItems.some((it) => it.id.includes("armadietti-spogliatoio") && (it.domain === "both" || it.domain === "safety")),
  "Spogliatoi devono avere armadietti doppio scomparto sporco/pulito",
);
assert.ok(
  spogliatoiItems.some((it) => it.id.includes("lavamani-antibagno-spogliatoio") && it.domain === "both"),
  "Spogliatoi devono avere lavamani acqua calda/fredda nell'antibagno (domain: both)",
);

// WC Clienti
const wcClientiItems = generateEnvironmentChecklistItems(ristWcClienti, "56.10.11");
assert.ok(
  wcClientiItems.some((it) => it.id.includes("wc-disabili-tirante-campanello") && it.domain === "safety"),
  "WC Clienti deve avere verifica accessibilità disabili con tirante allarme (domain: safety)",
);
assert.ok(
  !wcClientiItems.some((it) => it.id.includes("armadietti-spogliatoio")),
  "WC Clienti non deve contenere armadietti da spogliatoio personale",
);

// Deposito Rifiuti
const rifiutiItems = generateEnvironmentChecklistItems(ristRifiuti, "56.10.11");
assert.ok(
  rifiutiItems.some((it) => it.id.includes("mastelli-olio-esausto-cer") && it.domain === "both"),
  "Deposito rifiuti deve avere verifica mastelli ermetici e olio esausto CER 20 01 25 (domain: both)",
);

// Locale Tecnico Gas
const tecnicoItems = generateEnvironmentChecklistItems(ristTecnico, "56.10.11");
assert.ok(
  tecnicoItems.some((it) => it.id.includes("elettrovalvola-gas-sgancio-emergenza") && it.domain === "safety"),
  "Locale tecnico deve avere verifica elettrovalvola esterna gas metano con pulsante emergenza (domain: safety)",
);
assert.ok(
  !tecnicoItems.some((it) => it.id.includes("centrale-frigo-gas-refrigerante")),
  "Locale tecnico ristorante gas metano non deve avere sensori gas refrigerante centrale frigorifera",
);

// Verifica conformità del filtro checklistMode per cucina ristorante
const cucinaHaccpMode = filterEnvironmentItemsByChecklistMode(cucinaItems, "haccp_only");
assert.ok(
  cucinaHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item cucina devono essere haccp o both",
);
assert.ok(
  !cucinaHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item cucina deve avere domain safety",
);

const cucinaSafetyMode = filterEnvironmentItemsByChecklistMode(cucinaItems, "safety_only");
assert.ok(
  cucinaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item cucina devono essere safety o both",
);
assert.ok(
  !cucinaSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item cucina deve avere domain haccp",
);

// ============================================================================
// Test 13: getStandardEnvironmentsForAteco & conformità per Pizzeria (56.10.20 / 56.10.2)
// ============================================================================
console.log("Test 13: getStandardEnvironmentsForAteco & conformità per Pizzeria (56.10.20 / 56.10.2)");
const pizEnvs = getStandardEnvironmentsForAteco("56.10.20");
assert.equal(pizEnvs.length, 12, "La Pizzeria (56.10.20) deve avere esattamente 12 ambienti standard");

// Verifica varianti di formato ATECO
const pizEnvsVar1 = getStandardEnvironmentsForAteco("56.10.2");
assert.equal(pizEnvsVar1.length, 12, "La variante 56.10.2 deve restituire 12 ambienti");
const pizEnvsVar2 = getStandardEnvironmentsForAteco("561020");
assert.equal(pizEnvsVar2.length, 12, "La variante 561020 deve restituire 12 ambienti");
const pizEnvsVar3 = getStandardEnvironmentsForAteco("56102");
assert.equal(pizEnvsVar3.length, 12, "La variante 56102 deve restituire 12 ambienti");

// Verifica presenza di tutti i 12 ambienti specifici
const expectedPizIds = [
  "env-piz-laboratorio",
  "env-piz-impasto",
  "env-piz-forno-legna",
  "env-piz-prep-ingredienti",
  "env-piz-lavaggio",
  "env-piz-celle",
  "env-piz-dispensa",
  "env-piz-sala-asporto",
  "env-piz-spogliatoi",
  "env-piz-wc-clienti",
  "env-piz-rifiuti",
  "env-piz-tecnico",
];
for (const id of expectedPizIds) {
  assert.ok(
    pizEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard Pizzeria`,
  );
}

// Verifica parametri dimensionali e tecnici
const pizLab = pizEnvs.find((e) => e.id === "env-piz-laboratorio")!;
assert.equal(pizLab.category, "production");
assert.equal(pizLab.surfaceSqM, 35);
assert.equal(pizLab.heightM, 3.0);
assert.equal(pizLab.volumeCuM, 105);
assert.equal(pizLab.occupantsCount, 3);
assert.equal(pizLab.windowSurfaceSqM, 3.5);
assert.equal(pizLab.features.forcedExhaustPresent, true);
assert.equal(pizLab.features.forcedExhaustType, "kitchen_hood");
assert.equal(pizLab.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(pizLab.features.flooringCondition, "compliant_anti_slip");

const pizImpasto = pizEnvs.find((e) => e.id === "env-piz-impasto")!;
assert.equal(pizImpasto.category, "production");
assert.equal(pizImpasto.surfaceSqM, 20);
assert.equal(pizImpasto.heightM, 3.0);
assert.equal(pizImpasto.volumeCuM, 60);
assert.equal(pizImpasto.occupantsCount, 2);

const pizForno = pizEnvs.find((e) => e.id === "env-piz-forno-legna")!;
assert.equal(pizForno.category, "production");
assert.equal(pizForno.surfaceSqM, 15);
assert.equal(pizForno.heightM, 3.2);
assert.equal(pizForno.volumeCuM, 48);
assert.equal(pizForno.occupantsCount, 1);

const pizPrep = pizEnvs.find((e) => e.id === "env-piz-prep-ingredienti")!;
assert.equal(pizPrep.category, "production");
assert.equal(pizPrep.surfaceSqM, 18);
assert.equal(pizPrep.heightM, 3.0);
assert.equal(pizPrep.volumeCuM, 54);

const pizLavaggio = pizEnvs.find((e) => e.id === "env-piz-lavaggio")!;
assert.equal(pizLavaggio.category, "production");
assert.equal(pizLavaggio.surfaceSqM, 14);
assert.equal(pizLavaggio.heightM, 3.0);
assert.equal(pizLavaggio.volumeCuM, 42);

const pizCelle = pizEnvs.find((e) => e.id === "env-piz-celle")!;
assert.equal(pizCelle.category, "storage");
assert.equal(pizCelle.surfaceSqM, 18);
assert.equal(pizCelle.heightM, 2.6);
assert.equal(pizCelle.volumeCuM, 46.8);
assert.equal(pizCelle.features.hasTrappedPersonAlarm, true);

const pizDispensa = pizEnvs.find((e) => e.id === "env-piz-dispensa")!;
assert.equal(pizDispensa.category, "warehouse");
assert.equal(pizDispensa.surfaceSqM, 25);
assert.equal(pizDispensa.heightM, 2.7);
assert.equal(pizDispensa.volumeCuM, 67.5);
assert.equal(pizDispensa.features.shelvingCertified, true);

const pizSala = pizEnvs.find((e) => e.id === "env-piz-sala-asporto")!;
assert.equal(pizSala.category, "public");
assert.equal(pizSala.surfaceSqM, 90);
assert.equal(pizSala.heightM, 2.8);
assert.equal(pizSala.volumeCuM, 252);
assert.equal(pizSala.occupantsCount, 45);

const pizSpogliatoi = pizEnvs.find((e) => e.id === "env-piz-spogliatoi")!;
assert.equal(pizSpogliatoi.category, "changing_rooms");
assert.equal(pizSpogliatoi.surfaceSqM, 15);
assert.equal(pizSpogliatoi.heightM, 2.4);
assert.equal(pizSpogliatoi.volumeCuM, 36);

const pizWc = pizEnvs.find((e) => e.id === "env-piz-wc-clienti")!;
assert.equal(pizWc.category, "services");
assert.equal(pizWc.surfaceSqM, 12);
assert.equal(pizWc.heightM, 2.4);
assert.equal(pizWc.volumeCuM, 28.8);

const pizRifiuti = pizEnvs.find((e) => e.id === "env-piz-rifiuti")!;
assert.equal(pizRifiuti.category, "technical");
assert.equal(pizRifiuti.surfaceSqM, 10);
assert.equal(pizRifiuti.heightM, 2.6);
assert.equal(pizRifiuti.volumeCuM, 26);

const pizTecnico = pizEnvs.find((e) => e.id === "env-piz-tecnico")!;
assert.equal(pizTecnico.category, "technical");
assert.equal(pizTecnico.surfaceSqM, 10);
assert.equal(pizTecnico.heightM, 2.5);
assert.equal(pizTecnico.volumeCuM, 25);
assert.equal(pizTecnico.features.gasLeakDetectorPresent, true);

// Verifica evaluateEnvironmentCompliance per locali Pizzeria
const evalPizLab = evaluateEnvironmentCompliance(pizLab, "56.10.20");
assert.equal(evalPizLab.isHeightCompliant, true, "Laboratorio pizzeria h=3.00m è conforme");
assert.ok(
  evalPizLab.summaryBadges.some((b) => b.text.includes("Laboratorio pizzeria a norma")),
  "Laboratorio deve avere badge altezza ≥ 3,00m e cappa",
);
assert.ok(
  evalPizLab.summaryBadges.some((b) => b.text.includes("Lavamani comando non manuale")),
  "Laboratorio deve avere badge lavamani comando non manuale",
);

const evalPizForno = evaluateEnvironmentCompliance(pizForno, "56.10.20");
assert.ok(
  evalPizForno.summaryBadges.some((b) => b.text.includes("Abbattitore fuliggine ad acqua")),
  "Forno legna deve avere badge abbattitore fuliggine UNI 1127",
);
assert.ok(
  evalPizForno.summaryBadges.some((b) => b.text.includes("Stoccaggio legna vergine")),
  "Forno legna deve avere badge legna vergine certificata ed estintore",
);

const evalPizImpasto = evaluateEnvironmentCompliance(pizImpasto, "56.10.20");
assert.ok(
  evalPizImpasto.summaryBadges.some((b) => b.text.includes("Riparo interbloccato impastatrice")),
  "Impasto deve avere badge riparo interbloccato UNI EN 453",
);

const evalPizDispensa = evaluateEnvironmentCompliance(pizDispensa, "56.10.20");
assert.ok(
  evalPizDispensa.summaryBadges.some((b) => b.text.includes("Sacchi farina su pedane sollevate")),
  "Dispensa deve avere badge pedane sollevate e cartoni pizza MOCA",
);

const evalPizSala = evaluateEnvironmentCompliance(pizSala, "56.10.20");
assert.ok(
  evalPizSala.summaryBadges.some((b) => b.text.includes("Vie di esodo libere ≥ 1,20m")),
  "Sala deve avere badge vie di esodo libere ≥ 1,20m",
);
assert.ok(
  evalPizSala.summaryBadges.some((b) => b.text.includes("Illuminazione di emergenza ≥ 5 lux")),
  "Sala deve avere badge illuminazione emergenza e banco ritiro asporto",
);

const evalPizCelle = evaluateEnvironmentCompliance(pizCelle, "56.10.20");
assert.ok(
  evalPizCelle.summaryBadges.some((b) => b.text.includes("Allarme uomo intrappolato")),
  "Celle devono avere badge allarme uomo intrappolato UNI EN 378",
);
assert.ok(
  evalPizCelle.summaryBadges.some((b) => b.text.includes("Teletermometri continui HACCP")),
  "Celle devono avere badge teletermometri continui HACCP per mozzarelle e latticini",
);

const evalPizSpogliatoi = evaluateEnvironmentCompliance(pizSpogliatoi, "56.10.20");
assert.ok(
  evalPizSpogliatoi.summaryBadges.some((b) => b.text.includes("Armadietti doppio scomparto")),
  "Spogliatoi devono avere badge armadietti doppio scomparto abiti civili/lavoro",
);

const evalPizRifiuti = evaluateEnvironmentCompliance(pizRifiuti, "56.10.20");
assert.ok(
  evalPizRifiuti.summaryBadges.some((b) => b.text.includes("Bidone metallico stagno per ceneri")),
  "Area rifiuti deve avere badge bidone metallico stagno ceneri forno legna",
);

const evalPizTecnico = evaluateEnvironmentCompliance(pizTecnico, "56.10.20");
assert.ok(
  evalPizTecnico.summaryBadges.some((b) => b.text.includes("Elettrovalvola gas metano")),
  "Locale tecnico deve avere badge elettrovalvola gas metano con sgancio e ricircolo fumi",
);

// ============================================================================
// Test 14: generateEnvironmentChecklistItems per locali specifici Pizzeria
// ============================================================================
console.log("Test 14: generateEnvironmentChecklistItems per locali Pizzeria (ATECO 56.10.20)");

// 1. Laboratorio Pizzeria
const labItems = generateEnvironmentChecklistItems(pizLab, "56.10.20");
assert.ok(
  labItems.some((it) => it.id.includes("banco-stesura-moca") && it.domain === "haccp"),
  "Laboratorio pizza deve avere verifica piano stesura MOCA (domain: haccp)",
);
assert.ok(
  labItems.some((it) => it.id.includes("vetrina-ingredienti-refrigerata") && it.domain === "haccp"),
  "Laboratorio pizza deve avere verifica vetrina ingredienti refrigerata +4°C con parafiato (domain: haccp)",
);
assert.ok(
  labItems.some((it) => it.id.includes("cappa-aspirazione-bocca-forno") && it.domain === "safety"),
  "Laboratorio pizza deve avere verifica cappa fumi bocca forno (domain: safety)",
);
assert.ok(
  labItems.some((it) => it.id.includes("lavamani-pedale-ginocchio") && it.domain === "haccp"),
  "Laboratorio pizza deve avere verifica lavamani comando pedale/ginocchio (domain: haccp)",
);
assert.ok(
  labItems.some((it) => it.id.includes("canaline-inox-sifonate") && it.domain === "both"),
  "Laboratorio pizza deve avere verifica canaline scolo sifonate griglie inox (domain: both)",
);

// 2. Locale Impasto
const impastoItems = generateEnvironmentChecklistItems(pizImpasto, "56.10.20");
assert.ok(
  impastoItems.some((it) => it.id.includes("impastatrice-riparo-interbloccato") && it.domain === "safety"),
  "Locale impasto deve avere verifica riparo interbloccato impastatrice spirale UNI EN 453 (domain: safety)",
);
assert.ok(
  impastoItems.some((it) => it.id.includes("cassette-portapalline-moca") && it.domain === "haccp"),
  "Locale impasto deve avere verifica cassette portapalline MOCA (domain: haccp)",
);
assert.ok(
  impastoItems.some((it) => it.id.includes("aspirazione-polveri-farina") && it.domain === "safety"),
  "Locale impasto deve avere verifica prevenzione/aspirazione polveri farina (domain: safety)",
);

// 3. Area Forno Legna
const fornoItems = generateEnvironmentChecklistItems(pizForno, "56.10.20");
assert.ok(
  fornoItems.some((it) => it.id.includes("abbattitore-fuliggine-acqua") && it.domain === "both"),
  "Area forno deve avere verifica abbattitore fuliggine ad acqua conforme UNI 1127 (domain: both)",
);
assert.ok(
  fornoItems.some((it) => it.id.includes("canna-fumaria-indipendente") && it.domain === "safety"),
  "Area forno deve avere verifica canna fumaria indipendente e pulizia periodica (domain: safety)",
);
assert.ok(
  fornoItems.some((it) => it.id.includes("legna-vergine-certificata") && it.domain === "haccp"),
  "Area forno deve avere verifica stoccaggio legna vergine certificata (domain: haccp)",
);
assert.ok(
  fornoItems.some((it) => it.id.includes("pala-metallica-guanti-termici") && it.domain === "safety"),
  "Area forno deve avere verifica guanti termici EN 407 ed estintore (domain: safety)",
);

// 4. Preparazione Ingredienti & Tagliamozzarella
const prepItems = generateEnvironmentChecklistItems(pizPrep, "56.10.20");
assert.ok(
  prepItems.some((it) => it.id.includes("tagliamozzarella-microinterruttore") && it.domain === "safety"),
  "Prep ingredienti deve avere verifica tagliamozzarella con microinterruttore e pestello UNI EN 12852 (domain: safety)",
);
assert.ok(
  prepItems.some((it) => it.id.includes("lavello-verdure-condimenti") && it.domain === "haccp"),
  "Prep ingredienti deve avere verifica lavello dedicato lavaggio verdure (domain: haccp)",
);
assert.ok(
  prepItems.some((it) => it.id.includes("taglieri-coltelli-codice-colore") && it.domain === "haccp"),
  "Prep ingredienti deve avere verifica taglieri con codice colore HACCP (domain: haccp)",
);

// 5. Lavaggio Teglie & Cassette
const lavaggioItems = generateEnvironmentChecklistItems(pizLavaggio, "56.10.20");
assert.ok(
  lavaggioItems.some((it) => it.id.includes("lavaoggetti-dosatori-antiriflusso") && it.domain === "both"),
  "Lavaggio deve avere verifica lavaoggetti con dosatori e valvola antiriflusso UNI EN 1717 (domain: both)",
);
assert.ok(
  lavaggioItems.some((it) => it.id.includes("sanificazione-teglie-cassette") && it.domain === "haccp"),
  "Lavaggio deve avere verifica sanificazione teglie 60x40 e cassette impasto (domain: haccp)",
);

// 6. Celle Deperibili
const celleItemsPiz = generateEnvironmentChecklistItems(pizCelle, "56.10.20");
assert.ok(
  celleItemsPiz.some((it) => it.id.includes("allarme-uomo-intrappolato") && it.domain === "safety"),
  "Celle deperibili pizzeria devono avere allarme uomo intrappolato UNI EN 378 (domain: safety)",
);
assert.ok(
  celleItemsPiz.some((it) => it.id.includes("monitoraggio-mozzarella-salumi") && it.domain === "haccp"),
  "Celle deperibili pizzeria devono avere monitoraggio continuo temperature mozzarella e salumi (domain: haccp)",
);

// 7. Dispensa Secco Farine & Cartoni
const dispensaItemsPiz = generateEnvironmentChecklistItems(pizDispensa, "56.10.20");
assert.ok(
  dispensaItemsPiz.some((it) => it.id.includes("sacchi-farina-pedane") && it.domain === "haccp"),
  "Dispensa farine deve avere verifica sacchi sollevati su pedane ≥ 15 cm (domain: haccp)",
);
assert.ok(
  dispensaItemsPiz.some((it) => it.id.includes("cartoni-pizza-moca") && it.domain === "haccp"),
  "Dispensa farine deve avere verifica cartoni pizza conformi MOCA Reg. CE 1935/2004 (domain: haccp)",
);
assert.ok(
  dispensaItemsPiz.some((it) => it.id.includes("monitoraggio-infestanti-farfalline") && it.domain === "both"),
  "Dispensa farine deve avere verifica monitoraggio infestanti e farfalline (domain: both)",
);

// 8. Sala Somministrazione & Asporto
const salaItemsPiz = generateEnvironmentChecklistItems(pizSala, "56.10.20");
assert.ok(
  salaItemsPiz.some((it) => it.id.includes("vie-esodo-sala-asporto") && it.domain === "safety"),
  "Sala/asporto deve avere verifica vie di esodo libere ≥ 1,20m (domain: safety)",
);
assert.ok(
  salaItemsPiz.some((it) => it.id.includes("uscite-emergenza-antipanico") && it.domain === "safety"),
  "Sala/asporto deve avere verifica porte emergenza antipanico UNI EN 1125 (domain: safety)",
);
assert.ok(
  salaItemsPiz.some((it) => it.id.includes("illuminazione-sicurezza-estintori") && it.domain === "safety"),
  "Sala/asporto deve avere verifica illuminazione emergenza ed estintori (domain: safety)",
);

// 9. Spogliatoi Personale
const spogliatoiItemsPiz = generateEnvironmentChecklistItems(pizSpogliatoi, "56.10.20");
assert.ok(
  spogliatoiItemsPiz.some((it) => it.id.includes("armadietti-spogliatoio") && (it.domain === "both" || it.domain === "safety")),
  "Spogliatoi pizzeria devono avere armadietti doppio scomparto per abiti da lavoro infarinati",
);
assert.ok(
  spogliatoiItemsPiz.some((it) => it.id.includes("lavamani-antibagno-spogliatoio") && it.domain === "both"),
  "Spogliatoi pizzeria devono avere lavamani con acqua calda/fredda nell'antibagno (domain: both)",
);

// 10. WC Clienti Disabili
const wcItemsPiz = generateEnvironmentChecklistItems(pizWc, "56.10.20");
assert.ok(
  wcItemsPiz.some((it) => it.id.includes("wc-disabili-tirante-campanello") && it.domain === "safety"),
  "WC Clienti deve avere verifica accessibilità disabili con tirante a campanello (domain: safety)",
);
assert.ok(
  !wcItemsPiz.some((it) => it.id.includes("armadietti-spogliatoio")),
  "WC Clienti non deve contenere armadietti da spogliatoio personale",
);

// 11. Deposito Rifiuti & Ceneri Forno Legna
const rifiutiItemsPiz = generateEnvironmentChecklistItems(pizRifiuti, "56.10.20");
assert.ok(
  rifiutiItemsPiz.some((it) => it.id.includes("bidone-ceneri-forno-legna") && it.domain === "safety"),
  "Area rifiuti deve avere verifica bidone metallico stagno ceneri forno a legna (domain: safety)",
);
assert.ok(
  rifiutiItemsPiz.some((it) => it.id.includes("mastelli-differenziata-ermetici") && it.domain === "both"),
  "Area rifiuti deve avere verifica mastelli differenziata ermetici (domain: both)",
);

// 12. Locale Tecnico Gas & Abbattitore Fumi
const tecnicoItemsPiz = generateEnvironmentChecklistItems(pizTecnico, "56.10.20");
assert.ok(
  tecnicoItemsPiz.some((it) => it.id.includes("quadro-generale-elettrovalvola-gas") && it.domain === "safety"),
  "Locale tecnico deve avere verifica elettrovalvola gas e quadro con sgancio rapido (domain: safety)",
);
assert.ok(
  tecnicoItemsPiz.some((it) => it.id.includes("ricircolo-idraulico-abbattitore") && it.domain === "safety"),
  "Locale tecnico deve avere verifica ricircolo idraulico abbattitore fuliggine (domain: safety)",
);
assert.ok(
  !tecnicoItemsPiz.some((it) => it.id.includes("centrale-frigo-gas-refrigerante")),
  "Locale tecnico pizzeria non deve contenere sensori centrale frigorifera supermercato",
);

// Verifica conformità del filtro checklistMode per laboratorio pizzeria
const labHaccpMode = filterEnvironmentItemsByChecklistMode(labItems, "haccp_only");
assert.ok(
  labHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item laboratorio pizza devono essere haccp o both",
);
assert.ok(
  !labHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item laboratorio pizza deve avere domain safety",
);

const labSafetyMode = filterEnvironmentItemsByChecklistMode(labItems, "safety_only");
assert.ok(
  labSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item laboratorio pizza devono essere safety o both",
);
assert.ok(
  !labSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item laboratorio pizza deve avere domain haccp",
);

// ============================================================================
// Test 15: getStandardEnvironmentsForAteco & conformità per Mense e Ristorazione Collettiva (ATECO 56.29.10 / 56.29)
// ============================================================================
console.log("Test 15: getStandardEnvironmentsForAteco & conformità per Mensa / Centri Cottura (56.29.10 / 56.29)");

// Verifica priorità e varianti di prefisso ATECO per Mense
const mensaEnvs1 = getStandardEnvironmentsForAteco("56.29.10");
const mensaEnvs2 = getStandardEnvironmentsForAteco("56.29.1");
const mensaEnvs3 = getStandardEnvironmentsForAteco("56.29.20");
const mensaEnvs4 = getStandardEnvironmentsForAteco("562910");
const mensaEnvs5 = getStandardEnvironmentsForAteco("56.29");

assert.equal(mensaEnvs1.length, 12, "ATECO 56.29.10 deve restituire esattamente 12 ambienti standard");
assert.equal(mensaEnvs2.length, 12, "ATECO 56.29.1 deve restituire 12 ambienti");
assert.equal(mensaEnvs3.length, 12, "ATECO 56.29.20 deve restituire 12 ambienti");
assert.equal(mensaEnvs4.length, 12, "ATECO 562910 deve restituire 12 ambienti");
assert.equal(mensaEnvs5.length, 12, "ATECO 56.29 deve restituire 12 ambienti");

const expectedMensaIds = [
  "env-mensa-cottura",
  "env-mensa-prep-fredda",
  "env-mensa-diete-speciali",
  "env-mensa-mondatura",
  "env-mensa-confezionamento",
  "env-mensa-celle-frigo",
  "env-mensa-dispensa",
  "env-mensa-lavaggio-pentole",
  "env-mensa-tunnel-stoviglie",
  "env-mensa-sala-selfservice",
  "env-mensa-spogliatoi-filtro",
  "env-mensa-rifiuti-tecnico",
];

for (const id of expectedMensaIds) {
  assert.ok(
    mensaEnvs1.some((e) => e.id === id),
    `Ambiente con id '${id}' deve essere presente negli ambienti standard della mensa`,
  );
}

// 1. Cucina Grandi Cotture Industriali
const mensaCottura = mensaEnvs1.find((e) => e.id === "env-mensa-cottura")!;
assert.equal(mensaCottura.surfaceSqM, 80);
assert.equal(mensaCottura.heightM, 3.5);
assert.equal(mensaCottura.volumeCuM, 280);
assert.equal(mensaCottura.occupantsCount, 5);
const compCottura = evaluateEnvironmentCompliance(mensaCottura, "56.29.10");
assert.equal(compCottura.isHeightCompliant, true, "Altezza 3.50m deve essere a norma (≥ 3.00m)");
assert.equal(compCottura.isCubatureCompliant, true, "Cubatura 280/5 = 56 mc/op deve essere a norma (≥ 10 mc)");
assert.ok(
  compCottura.summaryBadges.some((b) => b.text.includes("Cucina grandi cotture: altezza ottimale ≥ 3,50m")),
  "Deve essere presente il badge altezza ottimale cucina grandi cotture con Ansul e canaline",
);
assert.ok(
  compCottura.summaryBadges.some((b) => b.text.includes("Lavamani comando non manuale")),
  "Deve essere presente il badge lavamani a comando non manuale",
);

// 2. Prep Fredda, Salumi & Condimenti
const mensaPrepFredda = mensaEnvs1.find((e) => e.id === "env-mensa-prep-fredda")!;
assert.equal(mensaPrepFredda.surfaceSqM, 35);
assert.equal(mensaPrepFredda.heightM, 3.0);
const compPrep = evaluateEnvironmentCompliance(mensaPrepFredda, "56.29.10");
assert.equal(compPrep.isHeightCompliant, true);

// 3. Area Diete Speciali & Senza Glutine
const mensaDiete = mensaEnvs1.find((e) => e.id === "env-mensa-diete-speciali")!;
assert.equal(mensaDiete.surfaceSqM, 16);
const compDiete = evaluateEnvironmentCompliance(mensaDiete, "56.29.10");
assert.ok(
  compDiete.summaryBadges.some((b) => b.text.includes("Area diete speciali & gluten-free")),
  "Deve essere presente il badge diete speciali e gluten-free Reg. UE 1169/2011",
);

// 4. Mondatura Ortofrutta
const mensaMondatura = mensaEnvs1.find((e) => e.id === "env-mensa-mondatura")!;
assert.equal(mensaMondatura.surfaceSqM, 25);
assert.equal(mensaMondatura.heightM, 3.0);

// 5. Confezionamento, Termosigillatura & Spedizione
const mensaConfez = mensaEnvs1.find((e) => e.id === "env-mensa-confezionamento")!;
assert.equal(mensaConfez.surfaceSqM, 40);
const compConfez = evaluateEnvironmentCompliance(mensaConfez, "56.29.10");
assert.ok(
  compConfez.summaryBadges.some((b) => b.text.includes("Confezionamento pasti veicolati")),
  "Deve essere presente il badge legame caldo ≥ 65°C / legame freddo ≤ 4°C Cook & Chill",
);

// 6. Celle Frigorifere Walk-in Deperibili & Abbattuti
const mensaCelle = mensaEnvs1.find((e) => e.id === "env-mensa-celle-frigo")!;
assert.equal(mensaCelle.surfaceSqM, 45);
assert.equal(mensaCelle.heightM, 3.0);
const compCelle = evaluateEnvironmentCompliance(mensaCelle, "56.29.10");
assert.ok(
  compCelle.summaryBadges.some((b) => b.text.includes("Allarme uomo intrappolato") && b.text.includes("UNI EN 378")),
  "Celle deperibili devono avere allarme uomo intrappolato a norma UNI EN 378",
);
assert.ok(
  compCelle.summaryBadges.some((b) => b.text.includes("Teletermometri continui HACCP per celle pluritemperatura")),
  "Celle deperibili devono avere badge teletermometri continui HACCP",
);

// 7. Magazzino Merci Secche
const mensaDispensa = mensaEnvs1.find((e) => e.id === "env-mensa-dispensa")!;
assert.equal(mensaDispensa.surfaceSqM, 50);
assert.equal(mensaDispensa.heightM, 3.5);

// 8. Plonge Pentolame & Teglie
const mensaPlonge = mensaEnvs1.find((e) => e.id === "env-mensa-lavaggio-pentole")!;
assert.equal(mensaPlonge.surfaceSqM, 25);

// 9. Tunnel Meccanizzato Stoviglie & Vassoi
const mensaTunnel = mensaEnvs1.find((e) => e.id === "env-mensa-tunnel-stoviglie")!;
assert.equal(mensaTunnel.surfaceSqM, 35);

// 10. Sala Ristorazione & Self-Service
const mensaSala = mensaEnvs1.find((e) => e.id === "env-mensa-sala-selfservice")!;
assert.equal(mensaSala.surfaceSqM, 180);
assert.equal(mensaSala.occupantsCount, 120);
const compSala = evaluateEnvironmentCompliance(mensaSala, "56.29.10");
assert.ok(compSala.cpiActivityAlert !== null, "Con 120 persone deve scattare allerta CPI / alta capienza");
assert.ok(
  compSala.summaryBadges.some((b) => b.text.includes("Vie di esodo libere ≥ 1,20m")),
  "Sala mensa deve avere badge vie di esodo libere ≥ 1,20m",
);
assert.ok(
  compSala.summaryBadges.some((b) => b.text.includes("Linea self-service bagnomaria ≥ 65°C")),
  "Sala mensa deve avere badge bagnomaria e parafiato",
);

// 11. Spogliatoi con Filtro Igienico
const mensaSpogliatoi = mensaEnvs1.find((e) => e.id === "env-mensa-spogliatoi-filtro")!;
assert.equal(mensaSpogliatoi.surfaceSqM, 35);
assert.equal(mensaSpogliatoi.occupantsCount, 15);
const compSpogliatoi = evaluateEnvironmentCompliance(mensaSpogliatoi, "56.29.10");
assert.ok(
  compSpogliatoi.summaryBadges.some((b) => b.text.includes("Filtro igienico con lavamani a fotocellula")),
  "Spogliatoi mensa devono avere badge filtro igienico e armadietti doppio scomparto",
);

// 12. Locale Rifiuti Climatizzato e Tecnico
const mensaRifiuti = mensaEnvs1.find((e) => e.id === "env-mensa-rifiuti-tecnico")!;
assert.equal(mensaRifiuti.surfaceSqM, 25);
const compRifiuti = evaluateEnvironmentCompliance(mensaRifiuti, "56.29.10");
assert.ok(
  compRifiuti.summaryBadges.some((b) => b.text.includes("Cella frigorifera rifiuti umidi (≤ 5°C)")),
  "Locale rifiuti deve avere badge cella frigo umidi e oli esausti CER 20 01 25",
);

// ============================================================================
// Test 16: generateEnvironmentChecklistItems per locali Mensa (ATECO 56.29.10)
// ============================================================================
console.log("Test 16: generateEnvironmentChecklistItems per locali Mensa / Centri Cottura (ATECO 56.29.10)");

// 1. Cucina Grandi Cotture
const mensaCotturaItems = generateEnvironmentChecklistItems(mensaCottura, "56.29.10");
assert.ok(
  mensaCotturaItems.some((it) => it.id.includes("pentole-vapore-ped") && it.domain === "safety"),
  "Cucina grandi cotture deve verificare pentole a vapore PED (domain: safety)",
);
assert.ok(
  mensaCotturaItems.some((it) => it.id.includes("brasiere-ribaltabili-sicurezza") && it.domain === "safety"),
  "Cucina grandi cotture deve verificare brasiere ribaltabili UNI EN 13885 (domain: safety)",
);
assert.ok(
  mensaCotturaItems.some((it) => it.id.includes("impianto-spegnimento-ansul") && it.domain === "both"),
  "Cucina grandi cotture deve verificare impianto spegnimento cappa Ansul R-102 (domain: both)",
);
assert.ok(
  mensaCotturaItems.some((it) => it.id.includes("canaline-degrassatore-disoleatore") && it.domain === "both"),
  "Cucina grandi cotture deve verificare canaline e pozzetto degrassatore UNI EN 1825 (domain: both)",
);
assert.ok(
  mensaCotturaItems.some((it) => it.id.includes("lavamani-non-manuale-antibatterico") && it.domain === "haccp"),
  "Cucina grandi cotture deve verificare lavamani a comando non manuale con sapone antibatterico (domain: haccp)",
);

// 2. Prep Fredda & Salumi
const mensaPrepFreddaItems = generateEnvironmentChecklistItems(mensaPrepFredda, "56.29.10");
assert.ok(
  mensaPrepFreddaItems.some((it) => it.id.includes("temperatura-climatizzata-18c") && it.domain === "both"),
  "Prep fredda deve verificare temperatura controllata ≤ 18°C (domain: both)",
);
assert.ok(
  mensaPrepFreddaItems.some((it) => it.id.includes("tavoli-refrigerati-affettatrici") && it.domain === "both"),
  "Prep fredda deve verificare tavoli refrigerati e interblocchi affettatrici UNI EN 1974 (domain: both)",
);
assert.ok(
  mensaPrepFreddaItems.some((it) => it.id.includes("lavello-disinfezione-ortaggi") && it.domain === "haccp"),
  "Prep fredda deve verificare lavello dedicato disinfezione verdure (domain: haccp)",
);

// 3. Area Diete Speciali & Senza Glutine
const mensaDieteItems = generateEnvironmentChecklistItems(mensaDiete, "56.29.10");
assert.ok(
  mensaDieteItems.some((it) => it.id.includes("cross-contact-allergeni-glutine") && it.domain === "haccp"),
  "Diete speciali deve verificare prevenzione cross-contact allergeni e celiachia (domain: haccp)",
);
assert.ok(
  mensaDieteItems.some((it) => it.id.includes("armadietto-chiuso-gluten-free") && it.domain === "haccp"),
  "Diete speciali deve verificare armadietto chiuso esclusivo gluten-free (domain: haccp)",
);

// 4. Ricevimento & Mondatura Ortofrutta
const mensaMondaturaItems = generateEnvironmentChecklistItems(mensaMondatura, "56.29.10");
assert.ok(
  mensaMondaturaItems.some((it) => it.id.includes("pelapatate-microinterruttori-carter") && it.domain === "safety"),
  "Mondatura deve verificare pelapatate con microinterruttori e decantatore UNI EN 13208 (domain: safety)",
);
assert.ok(
  mensaMondaturaItems.some((it) => it.id.includes("vasche-lavaggio-vortice-disinfezione") && it.domain === "haccp"),
  "Mondatura deve verificare vasche lavaggio a vortice e disinfezione (domain: haccp)",
);
assert.ok(
  mensaMondaturaItems.some((it) => it.id.includes("pavimento-antiscivolo-canaletta-mondatura") && it.domain === "both"),
  "Mondatura deve verificare pavimento antiscivolo R13 e canale di scolo (domain: both)",
);

// 5. Confezionamento Pasti Veicolati
const mensaConfezItems = generateEnvironmentChecklistItems(mensaConfez, "56.29.10");
assert.ok(
  mensaConfezItems.some((it) => it.id.includes("termosigillatrice-carter-fotocellule") && it.domain === "safety"),
  "Confezionamento deve verificare termosigillatrice con fotocellule UNI EN 415-3 (domain: safety)",
);
assert.ok(
  mensaConfezItems.some((it) => it.id.includes("temperatura-legame-caldo-freddo") && it.domain === "haccp"),
  "Confezionamento deve verificare temperatura legame caldo ≥ 65°C / freddo ≤ 4°C (domain: haccp)",
);
assert.ok(
  mensaConfezItems.some((it) => it.id.includes("contenitori-isotermici-trasporto-atp") && it.domain === "haccp"),
  "Confezionamento deve verificare contenitori isotermici e trasporto ATP (domain: haccp)",
);

// 6. Celle Frigorifere Walk-in & Cella Abbattuti
const celleItemsMensa = generateEnvironmentChecklistItems(mensaCelle, "56.29.10");
assert.ok(
  celleItemsMensa.some((it) => it.id.includes("allarme-uomo-intrappolato") && it.domain === "safety"),
  "Celle frigorifere mensa devono avere allarme uomo intrappolato UNI EN 378 (domain: safety)",
);
assert.ok(
  celleItemsMensa.some((it) => it.id.includes("registrazione-temperature-campioni-72h") && it.domain === "haccp"),
  "Celle frigorifere mensa devono avere registrazione temperature e campioni testimone 72h (domain: haccp)",
);

// 7. Magazzino Merci Secche
const dispensaItemsMensa = generateEnvironmentChecklistItems(mensaDispensa, "56.29.10");
assert.ok(
  dispensaItemsMensa.some((it) => it.id.includes("scaffali-sollevati-ispezione-infestanti") && it.domain === "both"),
  "Magazzino secco deve verificare scaffalature sollevate ≥ 15 cm e pest control (domain: both)",
);
assert.ok(
  dispensaItemsMensa.some((it) => it.id.includes("scaffali-portata") && it.domain === "safety"),
  "Magazzino secco deve verificare portata scaffali UNI EN 15635 (domain: safety)",
);

// 8. Plonge Industriale Pentolame
const mensaPlongeItems = generateEnvironmentChecklistItems(mensaPlonge, "56.29.10");
assert.ok(
  mensaPlongeItems.some((it) => it.id.includes("dispositivo-antiriflusso-rete-idrica") && it.domain === "both"),
  "Plonge industriale deve verificare dispositivo antiriflusso UNI EN 1717 (domain: both)",
);
assert.ok(
  mensaPlongeItems.some((it) => it.id.includes("cappa-aspirazione-vapori-plonge") && it.domain === "safety"),
  "Plonge industriale deve verificare cappa aspirazione vapori (domain: safety)",
);
assert.ok(
  mensaPlongeItems.some((it) => it.id.includes("dosatori-chimici-contatto") && it.domain === "safety"),
  "Plonge industriale deve verificare dosatori automatici detergenti caustici (domain: safety)",
);

// 9. Tunnel Meccanizzato Stoviglie & Vassoi
const mensaTunnelItems = generateEnvironmentChecklistItems(mensaTunnel, "56.29.10");
assert.ok(
  mensaTunnelItems.some((it) => it.id.includes("arresto-emergenza-tunnel-nastro") && it.domain === "safety"),
  "Tunnel stoviglie deve verificare arresto di emergenza a fungo su nastro (domain: safety)",
);
assert.ok(
  mensaTunnelItems.some((it) => it.id.includes("risciacquo-termico-82c-sanificazione") && it.domain === "haccp"),
  "Tunnel stoviglie deve verificare risciacquo termico a ≥ 82°C DIN 10510 (domain: haccp)",
);
assert.ok(
  mensaTunnelItems.some((it) => it.id.includes("separazione-sbarazzo-pulito") && it.domain === "both"),
  "Tunnel stoviglie deve verificare separazione sbarazzo sporco e uscita pulito (domain: both)",
);

// 10. Sala Ristorazione & Linea Distribuzione Self-Service
const salaItemsMensa = generateEnvironmentChecklistItems(mensaSala, "56.29.10");
assert.ok(
  salaItemsMensa.some((it) => it.id.includes("bagnomaria-parafiato-selfservice") && it.domain === "haccp"),
  "Sala self-service deve verificare bagnomaria caldo ≥ 65°C con schermo parafiato (domain: haccp)",
);
assert.ok(
  salaItemsMensa.some((it) => it.id.includes("vie-esodo-maniglioni-sala-mensa") && it.domain === "safety"),
  "Sala self-service deve verificare vie di fuga ≥ 1,20m e uscite antipanico (domain: safety)",
);

// 11. Spogliatoi del Personale con Zona Filtro Igienico
const spogliatoiItemsMensa = generateEnvironmentChecklistItems(mensaSpogliatoi, "56.29.10");
assert.ok(
  spogliatoiItemsMensa.some((it) => it.id.includes("filtro-igienico-lavaggio-mani-dpi") && it.domain === "haccp"),
  "Spogliatoi con filtro igienico devono verificare lavamani a fotocellula e sanificazione mani (domain: haccp)",
);
assert.ok(
  spogliatoiItemsMensa.some((it) => it.id.includes("armadietti-spogliatoio") && (it.domain === "both" || it.domain === "safety")),
  "Spogliatoi mensa devono avere armadietti a doppio scomparto sporco/pulito",
);

// 12. Locale Rifiuti Climatizzato & Impianti
const rifiutiItemsMensa = generateEnvironmentChecklistItems(mensaRifiuti, "56.29.10");
assert.ok(
  rifiutiItemsMensa.some((it) => it.id.includes("cella-frigo-rifiuti-umidi-5c") && it.domain === "both"),
  "Locale rifiuti mensa deve verificare cella frigo umidi ≤ 5°C (domain: both)",
);
assert.ok(
  rifiutiItemsMensa.some((it) => it.id.includes("fusti-oli-vegetali-esausti-cer") && it.domain === "both"),
  "Locale rifiuti mensa deve verificare stoccaggio olio vegetale esausto CER 20 01 25 (domain: both)",
);
assert.ok(
  rifiutiItemsMensa.some((it) => it.id.includes("elettrovalvola-gas-sgancio-mensa") && it.domain === "safety"),
  "Locale tecnico rifiuti deve verificare elettrovalvola gas e pulsante sgancio (domain: safety)",
);

// Verifica del filtraggio checklistMode su cucina e diete speciali mensa
const cotturaHaccpMode = filterEnvironmentItemsByChecklistMode(mensaCotturaItems, "haccp_only");
assert.ok(
  cotturaHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item cucina mensa devono essere haccp o both",
);
assert.ok(
  !cotturaHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item cucina mensa deve avere domain safety",
);

const cotturaSafetyMode = filterEnvironmentItemsByChecklistMode(mensaCotturaItems, "safety_only");
assert.ok(
  cotturaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item cucina mensa devono essere safety o both",
);
assert.ok(
  !cotturaSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item cucina mensa deve avere domain haccp",
);

// ============================================================================
// Test 17: getStandardEnvironmentsForAteco & conformità per Catering per Eventi e Banqueting (ATECO 56.21.00 / 56.21)
// ============================================================================
console.log("Test 17: getStandardEnvironmentsForAteco & conformità per Catering Eventi / Banqueting (56.21.00 / 56.21)");

// Verifica priorità e varianti di prefisso ATECO per Catering
const catEnvs1 = getStandardEnvironmentsForAteco("56.21.00");
const catEnvs2 = getStandardEnvironmentsForAteco("56.21.0");
const catEnvs3 = getStandardEnvironmentsForAteco("56.21");
const catEnvs4 = getStandardEnvironmentsForAteco("562100");
const catEnvs5 = getStandardEnvironmentsForAteco("5621");

assert.equal(catEnvs1.length, 12, "ATECO 56.21.00 deve restituire esattamente 12 ambienti standard");
assert.equal(catEnvs2.length, 12, "ATECO 56.21.0 deve restituire 12 ambienti");
assert.equal(catEnvs3.length, 12, "ATECO 56.21 deve restituire 12 ambienti");
assert.equal(catEnvs4.length, 12, "ATECO 562100 deve restituire 12 ambienti");
assert.equal(catEnvs5.length, 12, "ATECO 5621 deve restituire 12 ambienti");

const expectedCatIds = [
  "env-cat-cucina-centrale",
  "env-cat-prep-fingerfood",
  "env-cat-diete-allergeni",
  "env-cat-celle-frigo",
  "env-cat-dispensa-dry",
  "env-cat-deposito-noleggio",
  "env-cat-deposito-arredi",
  "env-cat-banchina-carico",
  "env-cat-lavaggio-rientro",
  "env-cat-deposito-gpl",
  "env-cat-spogliatoi",
  "env-cat-ufficio-logistica",
];

for (const id of expectedCatIds) {
  assert.ok(
    catEnvs1.some((e) => e.id === id),
    `Ambiente con id '${id}' deve essere presente negli ambienti standard del Catering`,
  );
}

// 1. Cucina Centrale & Cotture di Base
const catCucina = catEnvs1.find((e) => e.id === "env-cat-cucina-centrale")!;
assert.equal(catCucina.surfaceSqM, 60);
assert.equal(catCucina.heightM, 3.2);
assert.equal(catCucina.volumeCuM, 192);
assert.equal(catCucina.occupantsCount, 4);
const compCucinaCat = evaluateEnvironmentCompliance(catCucina, "56.21.00");
assert.equal(compCucinaCat.isHeightCompliant, true, "Altezza 3.20m deve essere a norma (≥ 3.00m)");
assert.equal(compCucinaCat.isCubatureCompliant, true, "Cubatura 192/4 = 48 mc/op deve essere a norma (≥ 10 mc)");
assert.ok(
  compCucinaCat.summaryBadges.some((b) => b.text.includes("Cucina centrale eventi a norma") && b.text.includes("Ansul R-102")),
  "Deve essere presente il badge cucina centrale eventi con Ansul R-102 e canaline con degrassatore",
);
assert.ok(
  compCucinaCat.summaryBadges.some((b) => b.text.includes("Lavamani a ginocchio/pedale")),
  "Deve essere presente il badge lavamani a ginocchio/pedale Reg. CE 852/04",
);

// 2. Prep Finger Food
const catPrepFinger = catEnvs1.find((e) => e.id === "env-cat-prep-fingerfood")!;
assert.equal(catPrepFinger.surfaceSqM, 30);
assert.equal(catPrepFinger.heightM, 3.0);
assert.equal(catPrepFinger.volumeCuM, 90);
assert.equal(catPrepFinger.occupantsCount, 3);
const compPrepCat = evaluateEnvironmentCompliance(catPrepFinger, "56.21.00");
assert.equal(compPrepCat.isHeightCompliant, true);

// 3. Area Diete Speciali & Buffet Intolleranze
const catDiete = catEnvs1.find((e) => e.id === "env-cat-diete-allergeni")!;
assert.equal(catDiete.surfaceSqM, 15);
assert.equal(catDiete.heightM, 3.0);
assert.equal(catDiete.volumeCuM, 45);
assert.equal(catDiete.occupantsCount, 2);
const compDieteCat = evaluateEnvironmentCompliance(catDiete, "56.21.00");
assert.ok(
  compDieteCat.summaryBadges.some((b) => b.text.includes("Area diete speciali & buffet allergeni")),
  "Deve essere presente il badge diete speciali Reg. UE 1169/2011 & D.Lgs. 231/2017",
);

// 4. Celle Frigorifere Walk-in Deperibili & Cella Stoccaggio Eventi
const catCelle = catEnvs1.find((e) => e.id === "env-cat-celle-frigo")!;
assert.equal(catCelle.surfaceSqM, 35);
assert.equal(catCelle.heightM, 2.8);
assert.equal(catCelle.volumeCuM, 98);
assert.equal(catCelle.occupantsCount, 2);
const compCelleCat = evaluateEnvironmentCompliance(catCelle, "56.21.00");
assert.ok(
  compCelleCat.summaryBadges.some((b) => b.text.includes("Teletermometri continui HACCP per deperibili (0-4°C)")),
  "Celle devono avere teletermometri continui HACCP",
);
assert.ok(
  compCelleCat.summaryBadges.some((b) => b.text.includes("Allarme uomo intrappolato a 24V h24 a norma UNI EN 378")),
  "Celle devono avere allarme uomo intrappolato UNI EN 378 e sblocco fluorescente",
);

// 5. Magazzino Merci Secche & Beverage
const catDispensa = catEnvs1.find((e) => e.id === "env-cat-dispensa-dry")!;
assert.equal(catDispensa.surfaceSqM, 45);
assert.equal(catDispensa.heightM, 3.2);

// 6. Magazzino Stoviglie & Noleggio
const catNoleggio = catEnvs1.find((e) => e.id === "env-cat-deposito-noleggio")!;
assert.equal(catNoleggio.surfaceSqM, 80);
assert.equal(catNoleggio.heightM, 3.5);
assert.equal(catNoleggio.volumeCuM, 280);

// 7. Deposito Arredi & Ricevimenti
const catArredi = catEnvs1.find((e) => e.id === "env-cat-deposito-arredi")!;
assert.equal(catArredi.surfaceSqM, 70);
assert.equal(catArredi.heightM, 3.5);
assert.equal(catArredi.volumeCuM, 245);

// 8. Baia di Carico / Scarico Furgoni Coibentati
const catBanchina = catEnvs1.find((e) => e.id === "env-cat-banchina-carico")!;
assert.equal(catBanchina.surfaceSqM, 60);
assert.equal(catBanchina.heightM, 4.0);
assert.equal(catBanchina.volumeCuM, 240);
const compBanchinaCat = evaluateEnvironmentCompliance(catBanchina, "56.21.00");
assert.ok(
  compBanchinaCat.summaryBadges.some((b) => b.text.includes("Baia logistica eventi") && b.text.includes("rampe di carico") && b.text.includes("prese industriali CEE")),
  "Baia di carico deve avere badge rampe certificate e prese ricarica ATP",
);

// 9. Plonge & Centrale Lavaggio Rientro
const catLavaggio = catEnvs1.find((e) => e.id === "env-cat-lavaggio-rientro")!;
assert.equal(catLavaggio.surfaceSqM, 35);
assert.equal(catLavaggio.heightM, 3.0);
const compLavaggioCat = evaluateEnvironmentCompliance(catLavaggio, "56.21.00");
assert.ok(
  compLavaggioCat.summaryBadges.some((b) => b.text.includes("Centrale lavaggio rientro: marcia in avanti")),
  "Plonge rientro deve avere badge marcia in avanti contro contaminazioni incrociate",
);

// 10. Deposito Bombole GPL per Cucina da Campo
const catGpl = catEnvs1.find((e) => e.id === "env-cat-deposito-gpl")!;
assert.equal(catGpl.surfaceSqM, 10);
assert.equal(catGpl.heightM, 2.5);
assert.equal(catGpl.volumeCuM, 25);
const compGplCat = evaluateEnvironmentCompliance(catGpl, "56.21.00");
assert.ok(
  compGplCat.summaryBadges.some((b) => b.text.includes("Stoccaggio bombole GPL per cucine da campo")),
  "Deposito bombole GPL deve avere badge gabbia metallica areata ed estintore",
);

// 11. Spogliatoi del Personale
const catSpogliatoi = catEnvs1.find((e) => e.id === "env-cat-spogliatoi")!;
assert.equal(catSpogliatoi.surfaceSqM, 25);
assert.equal(catSpogliatoi.heightM, 2.7);
assert.equal(catSpogliatoi.occupantsCount, 10);

// 12. Ufficio Pianificazione Eventi
const catUfficio = catEnvs1.find((e) => e.id === "env-cat-ufficio-logistica")!;
assert.equal(catUfficio.surfaceSqM, 20);
assert.equal(catUfficio.heightM, 2.7);

// ============================================================================
// Test 18: generateEnvironmentChecklistItems per locali Catering (ATECO 56.21.00)
// ============================================================================
console.log("Test 18: generateEnvironmentChecklistItems per locali Catering Eventi / Banqueting (ATECO 56.21.00)");

// 1. Cucina Centrale
const catCucinaItems = generateEnvironmentChecklistItems(catCucina, "56.21.00");
assert.ok(
  catCucinaItems.some((it) => it.id.includes("termocoppie-fuochi-ansul-r102") && it.domain === "both"),
  "Cucina centrale deve verificare termocoppie fuochi e Ansul R-102 (domain: both)",
);
assert.ok(
  catCucinaItems.some((it) => it.id.includes("canaline-degrassatore-uni-en-1825") && it.domain === "both"),
  "Cucina centrale deve verificare canaline inox e degrassatore UNI EN 1825 (domain: both)",
);
assert.ok(
  catCucinaItems.some((it) => it.id.includes("lavamani-non-manuale-ginocchio-pedale") && it.domain === "haccp"),
  "Cucina centrale deve verificare lavamani a comando non manuale (domain: haccp)",
);

// 2. Prep Finger Food
const catPrepItems = generateEnvironmentChecklistItems(catPrepFinger, "56.21.00");
assert.ok(
  catPrepItems.some((it) => it.id.includes("catena-freddo-fingerfood-18c") && it.domain === "haccp"),
  "Prep finger food deve verificare catena del freddo <= 18°C (domain: haccp)",
);
assert.ok(
  catPrepItems.some((it) => it.id.includes("tenuta-saldatura-sottovuoto-evento") && it.domain === "haccp"),
  "Prep finger food deve verificare tenuta saldatura sottovuoto (domain: haccp)",
);
assert.ok(
  catPrepItems.some((it) => it.id.includes("protezioni-salvadita-affettatrici-cutter") && it.domain === "safety"),
  "Prep finger food deve verificare protezioni salvadita su affettatrici e cutter (domain: safety)",
);

// 3. Area Diete Speciali
const catDieteItems = generateEnvironmentChecklistItems(catDiete, "56.21.00");
assert.ok(
  catDieteItems.some((it) => it.id.includes("utensili-codice-colore-celiachia-allergeni") && it.domain === "haccp"),
  "Diete speciali deve verificare utensili esclusivi codice colore celiachia/allergeni (domain: haccp)",
);
assert.ok(
  catDieteItems.some((it) => it.id.includes("armadietto-chiuso-ingredienti-gluten-free") && it.domain === "haccp"),
  "Diete speciali deve verificare armadietto chiuso gluten-free (domain: haccp)",
);

// 4. Celle Frigorifere Walk-in
const catCelleItems = generateEnvironmentChecklistItems(catCelle, "56.21.00");
assert.ok(
  catCelleItems.some((it) => it.id.includes("allarme-uomo-intrappolato-batteria-tampone") && it.domain === "safety"),
  "Celle catering devono verificare allarme uomo intrappolato a 24V h24 UNI EN 378 (domain: safety)",
);
assert.ok(
  catCelleItems.some((it) => it.id.includes("monitoraggio-temperature-haccp-carrelli") && it.domain === "haccp"),
  "Celle catering devono verificare teletermometri deperibili e carrelli pronti (domain: haccp)",
);

// 5. Magazzino Noleggio
const catNoleggioItems = generateEnvironmentChecklistItems(catNoleggio, "56.21.00");
assert.ok(
  catNoleggioItems.some((it) => it.id.includes("integrita-sanificazione-ceste-stoviglie-antipolvere") && it.domain === "haccp"),
  "Magazzino noleggio deve verificare sanificazione ceste e cappe antipolvere (domain: haccp)",
);
assert.ok(
  catNoleggioItems.some((it) => it.id.includes("stabilita-scaffalature-porta-casse-noleggio") && it.domain === "safety"),
  "Magazzino noleggio deve verificare stabilità scaffalature porta-casse UNI EN 15635 (domain: safety)",
);

// 6. Deposito Arredi Mobili
const catArrediItems = generateEnvironmentChecklistItems(catArredi, "56.21.00");
assert.ok(
  catArrediItems.some((it) => it.id.includes("stoccaggio-sicuro-arredi-gazebi-ribaltamento") && it.domain === "safety"),
  "Deposito arredi deve verificare stoccaggio sicuro arredi e gazebi contro ribaltamento (domain: safety)",
);
assert.ok(
  catArrediItems.some((it) => it.id.includes("bruciatori-gel-chafing-dish-spegnifiamma") && it.domain === "both"),
  "Deposito arredi deve verificare bruciatori e gel atossico chafing dish con spegnifiamma (domain: both)",
);

// 7. Baia di Carico Furgoni
const catBanchinaItems = generateEnvironmentChecklistItems(catBanchina, "56.21.00");
assert.ok(
  catBanchinaItems.some((it) => it.id.includes("portata-rampe-alluminio-mandorlato") && it.domain === "safety"),
  "Baia di carico deve verificare portata rampe alluminio mandorlato antiscivolo (domain: safety)",
);
assert.ok(
  catBanchinaItems.some((it) => it.id.includes("cavi-prese-industriali-cee-veicoli-atp") && it.domain === "safety"),
  "Baia di carico deve verificare prese industriali CEE stagne per veicoli ATP (domain: safety)",
);
assert.ok(
  catBanchinaItems.some((it) => it.id.includes("igiene-vani-carico-coibentati-atp") && it.domain === "haccp"),
  "Baia di carico deve verificare igiene vani di carico coibentati ATP (domain: haccp)",
);

// 8. Plonge & Centrale Lavaggio Rientro Stoviglie
const catLavaggioItems = generateEnvironmentChecklistItems(catLavaggio, "56.21.00");
assert.ok(
  catLavaggioItems.some((it) => it.id.includes("separazione-stoviglie-sporche-rientro-pulito") && it.domain === "haccp"),
  "Plonge rientro deve verificare separazione sporco/pulito marcia in avanti (domain: haccp)",
);
assert.ok(
  catLavaggioItems.some((it) => it.id.includes("cappa-aspirazione-vapori-lavastoviglie-rientro") && it.domain === "safety"),
  "Plonge rientro deve verificare cappa aspirazione vapori su lavastoviglie (domain: safety)",
);
assert.ok(
  catLavaggioItems.some((it) => it.id.includes("dispositivo-antiriflusso-uni-en-1717-lavaggio") && it.domain === "both"),
  "Plonge rientro deve verificare dispositivo antiriflusso UNI EN 1717 (domain: both)",
);

// 9. Deposito Bombole GPL per Cucina da Campo
const catGplItems = generateEnvironmentChecklistItems(catGpl, "56.21.00");
assert.ok(
  catGplItems.some((it) => it.id.includes("catenelle-metalliche-anticaduta-bombole-gpl") && it.domain === "safety"),
  "Deposito bombole GPL deve verificare catenelle metalliche anticaduta UNI 7131 (domain: safety)",
);
assert.ok(
  catGplItems.some((it) => it.id.includes("ventilazione-naturale-permanente-gpl-esterno") && it.domain === "safety"),
  "Deposito bombole GPL deve verificare ventilazione naturale permanente all'aperto (domain: safety)",
);
assert.ok(
  catGplItems.some((it) => it.id.includes("estintore-polvere-34a-233b-deposito-gpl") && it.domain === "safety"),
  "Deposito bombole GPL deve verificare estintore a polvere 34A 233B (domain: safety)",
);
assert.ok(
  catGplItems.some((it) => it.id.includes("scadenza-tubi-flessibili-uni-7140-gpl") && it.domain === "safety"),
  "Deposito bombole GPL deve verificare data scadenza tubi flessibili UNI 7140 (domain: safety)",
);

// 10. Ufficio Pianificazione & Logistica
const catUfficioItems = generateEnvironmentChecklistItems(catUfficio, "56.21.00");
assert.ok(
  catUfficioItems.some((it) => it.id.includes("ergonomia-postazioni-vdt-logistica") && it.domain === "safety"),
  "Ufficio logistica deve verificare ergonomia postazioni VDT (domain: safety)",
);
assert.ok(
  catUfficioItems.some((it) => it.id.includes("tracciabilita-lotti-schede-allergeni-commesse") && it.domain === "haccp"),
  "Ufficio logistica deve verificare tracciabilità lotti e schede allergeni per ciascun evento (domain: haccp)",
);

// Verifica del filtraggio checklistMode su cucina e finger food catering
const catCucinaHaccpMode = filterEnvironmentItemsByChecklistMode(catCucinaItems, "haccp_only");
assert.ok(
  catCucinaHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item cucina catering devono essere haccp o both",
);
assert.ok(
  !catCucinaHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item cucina catering deve avere domain safety",
);

const catCucinaSafetyMode = filterEnvironmentItemsByChecklistMode(catCucinaItems, "safety_only");
assert.ok(
  catCucinaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item cucina catering devono essere safety o both",
);
assert.ok(
  !catCucinaSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item cucina catering deve avere domain haccp",
);

// ============================================================================
// Test 19: getStandardEnvironmentsForAteco & conformità per Food Truck (56.10.42 / 56.10.4)
// ============================================================================
console.log("Test 19: getStandardEnvironmentsForAteco & conformità per Food Truck / Ristorazione Ambulante (56.10.42 / 56.10.4)");
const ftEnvs1 = getStandardEnvironmentsForAteco("56.10.42");
assert.equal(ftEnvs1.length, 12, "Il food truck / autonegozio deve avere esattamente 12 ambienti tipici");

// Verifica varianti codice ATECO (56.10.4, 56.10.42, 561042, 56104)
const ftEnvsVar1 = getStandardEnvironmentsForAteco("56.10.4");
assert.equal(ftEnvsVar1.length, 12, "Anche prefisso 56.10.4 deve restituire i 12 ambienti food truck");
const ftEnvsVar2 = getStandardEnvironmentsForAteco("561042");
assert.equal(ftEnvsVar2.length, 12, "Anche codice non formattato 561042 deve restituire i 12 ambienti food truck");
const ftEnvsVar3 = getStandardEnvironmentsForAteco("56104");
assert.equal(ftEnvsVar3.length, 12, "Anche codice non formattato 56104 deve restituire i 12 ambienti food truck");

// Verifica ID degli ambienti standard del Food Truck
const expectedFtIds = [
  "env-ft-vano-cottura",
  "env-ft-banco-somministrazione",
  "env-ft-vano-refrigerazione",
  "env-ft-vano-bombole-gpl",
  "env-ft-vano-generatore",
  "env-ft-impianto-idrico",
  "env-ft-cabina-guida",
  "env-ft-deposito-rimessaggio",
  "env-ft-area-carico-scarico",
  "env-ft-magazzino-scorte",
  "env-ft-laboratorio-base",
  "env-ft-spogliatoi-sede",
];

for (const id of expectedFtIds) {
  const envFound = ftEnvs1.find((e) => e.id === id);
  assert.ok(envFound, `Ambiente con id ${id} deve essere presente nell'elenco Food Truck`);
}

// 1. Vano Operativo di Cottura & Piastre Food Truck
const ftCucina = ftEnvs1.find((e) => e.id === "env-ft-vano-cottura")!;
assert.equal(ftCucina.category, "production");
assert.equal(ftCucina.surfaceSqM, 10);
assert.equal(ftCucina.heightM, 2.2);
assert.equal(ftCucina.volumeCuM, 22);
assert.equal(ftCucina.occupantsCount, 2);
assert.equal(ftCucina.windowSurfaceSqM, 2.5);
assert.equal(ftCucina.features.forcedExhaustPresent, true);
assert.equal(ftCucina.features.forcedExhaustType, "kitchen_hood");
assert.equal(ftCucina.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ftCucina.features.flooringCondition, "compliant_anti_slip");
assert.equal(ftCucina.features.insectScreens, true);
assert.equal(ftCucina.features.microclimateCompliant, true);
const compCucinaFt = evaluateEnvironmentCompliance(ftCucina, "56.10.42");
assert.equal(compCucinaFt.isHeightCompliant, true, "Altezza 2.20m deve essere a norma veicolare (deroga autonegozi speciali ≥ 2.00m)");
assert.equal(compCucinaFt.isCubatureCompliant, true, "Cubatura 22/2 = 11 mc/op deve essere a norma (≥ 10 mc)");
assert.ok(
  compCucinaFt.summaryBadges.some((b) => b.text.includes("Vano cottura food truck a norma") && b.text.includes("cappa aspirazione inox")),
  "Deve essere presente il badge vano cottura food truck a norma",
);
assert.ok(
  compCucinaFt.summaryBadges.some((b) => b.text.includes("Lavamani con comando non manuale a ginocchio")),
  "Deve essere presente il badge lavamani non manuale Reg. CE 852/04",
);

// 2. Banco di Somministrazione, Cassa & Vetrina Parafiato Clienti
const ftBanco = ftEnvs1.find((e) => e.id === "env-ft-banco-somministrazione")!;
assert.equal(ftBanco.category, "sales_office");
assert.equal(ftBanco.surfaceSqM, 6);
assert.equal(ftBanco.heightM, 2.2);
assert.equal(ftBanco.volumeCuM, 13.2);
assert.equal(ftBanco.occupantsCount, 2);
assert.equal(ftBanco.windowSurfaceSqM, 3.0);
assert.equal(ftBanco.features.emergencyLighting, true);
const compBancoFt = evaluateEnvironmentCompliance(ftBanco, "56.10.42");
assert.equal(compBancoFt.isHeightCompliant, true);
assert.ok(
  compBancoFt.summaryBadges.some((b) => b.text.includes("Portellone panoramico con pistoni a gas")),
  "Deve essere presente il badge portellone panoramico con blocco meccanico anticaduta",
);
assert.ok(
  compBancoFt.summaryBadges.some((b) => b.text.includes("Vetrina refrigerata parafiato curvo")),
  "Deve essere presente il badge vetrina refrigerata parafiato igienico",
);

// 3. Vano Frigoriferi & Stoccaggio Deperibili a Bordo
const ftFrigo = ftEnvs1.find((e) => e.id === "env-ft-vano-refrigerazione")!;
assert.equal(ftFrigo.category, "storage");
assert.equal(ftFrigo.surfaceSqM, 5);
assert.equal(ftFrigo.heightM, 2.2);
assert.equal(ftFrigo.volumeCuM, 11);
assert.equal(ftFrigo.occupantsCount, 1);
assert.equal(ftFrigo.windowSurfaceSqM, 0);
assert.equal(ftFrigo.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ftFrigo.features.flooringCondition, "compliant_anti_slip");
assert.equal(ftFrigo.features.emergencyLighting, true);
const compFrigoFt = evaluateEnvironmentCompliance(ftFrigo, "56.10.42");
assert.equal(compFrigoFt.isHeightCompliant, true);

// 4. Vano Tecnico Bombole GPL del Veicolo
const ftGpl = ftEnvs1.find((e) => e.id === "env-ft-vano-bombole-gpl")!;
assert.equal(ftGpl.category, "technical");
assert.equal(ftGpl.surfaceSqM, 2);
assert.equal(ftGpl.heightM, 1.2);
assert.equal(ftGpl.volumeCuM, 2.4);
assert.equal(ftGpl.occupantsCount, 1);
assert.equal(ftGpl.features.emergencyLighting, true);
assert.equal(ftGpl.features.gasLeakDetectorPresent, true);
const compGplFt = evaluateEnvironmentCompliance(ftGpl, "56.10.42");
assert.equal(compGplFt.isHeightCompliant, true);
assert.ok(
  compGplFt.summaryBadges.some((b) => b.text.includes("Vano bombole GPL stagno verso l'abitacolo")),
  "Deve essere presente il badge vano bombole GPL stagno con aerazione a pavimento",
);
assert.ok(
  compGplFt.summaryBadges.some((b) => b.text.includes("Rilevatore fughe gas 12V con elettrovalvola")),
  "Deve essere presente il badge allarme gas 12V con elettrovalvola",
);

// 5. Vano Generatore Elettrico Ausiliario & Quadro Tecnico
const ftGen = ftEnvs1.find((e) => e.id === "env-ft-vano-generatore")!;
assert.equal(ftGen.category, "technical");
assert.equal(ftGen.surfaceSqM, 3);
assert.equal(ftGen.heightM, 1.2);
assert.equal(ftGen.volumeCuM, 3.6);
assert.equal(ftGen.occupantsCount, 1);
assert.equal(ftGen.features.emergencyLighting, true);
const compGenFt = evaluateEnvironmentCompliance(ftGen, "56.10.42");
assert.equal(compGenFt.isHeightCompliant, true);
assert.ok(
  compGenFt.summaryBadges.some((b) => b.text.includes("Generatore ausiliario: scarico fumi canalizzato a tetto")),
  "Deve essere presente il badge generatore ausiliario scarico fumi a tetto",
);
assert.ok(
  compGenFt.summaryBadges.some((b) => b.text.includes("Quadro elettrico con salvavita differenziale 30 mA")),
  "Deve essere presente il badge salvavita differenziale 30 mA",
);

// 6. Centrale Idrica Mobile (Serbatoi Acqua Potabile & Acque Grigie)
const ftIdrico = ftEnvs1.find((e) => e.id === "env-ft-impianto-idrico")!;
assert.equal(ftIdrico.category, "technical");
assert.equal(ftIdrico.surfaceSqM, 2);
assert.equal(ftIdrico.heightM, 1.2);
assert.equal(ftIdrico.volumeCuM, 2.4);
assert.equal(ftIdrico.occupantsCount, 1);
assert.equal(ftIdrico.features.wallsCondition, "washable_sanitizable_2m");
const compIdricoFt = evaluateEnvironmentCompliance(ftIdrico, "56.10.42");
assert.equal(compIdricoFt.isHeightCompliant, true);
assert.ok(
  compIdricoFt.summaryBadges.some((b) => b.text.includes("Centrale idrica mobile: serbatoi acqua potabile")),
  "Deve essere presente il badge serbatoi acqua potabile MOCA",
);
assert.ok(
  compIdricoFt.summaryBadges.some((b) => b.text.includes("Serbatoio acque grigie con valvola saracinesca")),
  "Deve essere presente il badge saracinesca acque grigie",
);

// 7. Cabina di Guida del Furgone / Autocarro Allestito
const ftCabina = ftEnvs1.find((e) => e.id === "env-ft-cabina-guida")!;
assert.equal(ftCabina.category, "sales_office");
assert.equal(ftCabina.surfaceSqM, 5);
assert.equal(ftCabina.heightM, 1.8);
assert.equal(ftCabina.volumeCuM, 9);
assert.equal(ftCabina.occupantsCount, 2);
assert.equal(ftCabina.features.emergencyLighting, true);
const compCabinaFt = evaluateEnvironmentCompliance(ftCabina, "56.10.42");
assert.equal(compCabinaFt.isHeightCompliant, true);

// 8. Hangar / Area Rimessaggio Coperto del Veicolo & Ricarica Notturna
const ftRimessaggio = ftEnvs1.find((e) => e.id === "env-ft-deposito-rimessaggio")!;
assert.equal(ftRimessaggio.category, "warehouse");
assert.equal(ftRimessaggio.surfaceSqM, 50);
assert.equal(ftRimessaggio.heightM, 4.0);
assert.equal(ftRimessaggio.volumeCuM, 200);
assert.equal(ftRimessaggio.occupantsCount, 2);
assert.equal(ftRimessaggio.features.emergencyLighting, true);
const compRimessaggioFt = evaluateEnvironmentCompliance(ftRimessaggio, "56.10.42");
assert.equal(compRimessaggioFt.isHeightCompliant, true);

// 9. Piazzale di Carico Merci, Rifornimento Acqua & Scarico Acque Grigie
const ftCarico = ftEnvs1.find((e) => e.id === "env-ft-area-carico-scarico")!;
assert.equal(ftCarico.category, "technical");
assert.equal(ftCarico.surfaceSqM, 30);
assert.equal(ftCarico.heightM, 4.0);
assert.equal(ftCarico.volumeCuM, 120);
assert.equal(ftCarico.occupantsCount, 2);
assert.equal(ftCarico.features.flooringCondition, "compliant_anti_slip");
const compCaricoFt = evaluateEnvironmentCompliance(ftCarico, "56.10.42");
assert.equal(compCaricoFt.isHeightCompliant, true);

// 10. Magazzino Secco & Packaging Monouso / MOCA di Sede
const ftScorte = ftEnvs1.find((e) => e.id === "env-ft-magazzino-scorte")!;
assert.equal(ftScorte.category, "warehouse");
assert.equal(ftScorte.surfaceSqM, 25);
assert.equal(ftScorte.heightM, 3.0);
assert.equal(ftScorte.volumeCuM, 75);
assert.equal(ftScorte.occupantsCount, 1);
assert.equal(ftScorte.features.shelvingCertified, true);
const compScorteFt = evaluateEnvironmentCompliance(ftScorte, "56.10.42");
assert.equal(compScorteFt.isHeightCompliant, true);

// 11. Laboratorio Base / Plonge di Sanificazione e Preparazione Linee
const ftLab = ftEnvs1.find((e) => e.id === "env-ft-laboratorio-base")!;
assert.equal(ftLab.category, "production");
assert.equal(ftLab.surfaceSqM, 20);
assert.equal(ftLab.heightM, 3.0);
assert.equal(ftLab.volumeCuM, 60);
assert.equal(ftLab.occupantsCount, 2);
assert.equal(ftLab.features.forcedExhaustPresent, true);
assert.equal(ftLab.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ftLab.features.flooringCondition, "compliant_anti_slip");
const compLabFt = evaluateEnvironmentCompliance(ftLab, "56.10.42");
assert.equal(compLabFt.isHeightCompliant, true);

// 12. Spogliatoio e Servizi Igienici Personale presso la Sede Operativa
const ftSpogliatoi = ftEnvs1.find((e) => e.id === "env-ft-spogliatoi-sede")!;
assert.equal(ftSpogliatoi.category, "changing_rooms");
assert.equal(ftSpogliatoi.surfaceSqM, 15);
assert.equal(ftSpogliatoi.heightM, 2.7);
assert.equal(ftSpogliatoi.volumeCuM, 40.5);
assert.equal(ftSpogliatoi.occupantsCount, 4);
assert.equal(ftSpogliatoi.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ftSpogliatoi.features.flooringCondition, "compliant_anti_slip");
assert.equal(ftSpogliatoi.features.forcedExhaustPresent, true);
assert.equal(ftSpogliatoi.features.forcedExhaustType, "blind_toilet_fan");
const compSpogliatoiFt = evaluateEnvironmentCompliance(ftSpogliatoi, "56.10.42");
assert.equal(compSpogliatoiFt.isHeightCompliant, true);

// ============================================================================
// Test 20: generateEnvironmentChecklistItems per locali Food Truck (ATECO 56.10.42)
// ============================================================================
console.log("Test 20: generateEnvironmentChecklistItems per locali Food Truck / Ristorazione Ambulante (ATECO 56.10.42)");

// 1. Vano Cottura Food Truck
const ftCucinaItems = generateEnvironmentChecklistItems(ftCucina, "56.10.42");
assert.ok(
  ftCucinaItems.some((it) => it.id.includes("cappa-aspirazione-labirinto-tetto") && it.domain === "both"),
  "Vano cottura food truck deve verificare cappa aspirazione canalizzata a tetto con filtri labirinto (domain: both)",
);
assert.ok(
  ftCucinaItems.some((it) => it.id.includes("paraspruzzi-blocco-grassi-friggitrice-piastra") && it.domain === "safety"),
  "Vano cottura food truck deve verificare paraspruzzi e protezioni antiscottatura su friggitrice e fry-top (domain: safety)",
);
assert.ok(
  ftCucinaItems.some((it) => it.id.includes("lavamani-ginocchio-acqua-calda-sapone") && it.domain === "haccp"),
  "Vano cottura food truck deve verificare lavamani a ginocchio con acqua calda e dosatori a perdere (domain: haccp)",
);
assert.ok(
  ftCucinaItems.some((it) => it.id.includes("pareti-inox-sanificabili-pavimento-antiscivolo") && it.domain === "both"),
  "Vano cottura food truck deve verificare pareti inox AISI 304 e pavimento antiscivolo R11 (domain: both)",
);

// 2. Banco Somministrazione
const ftBancoItems = generateEnvironmentChecklistItems(ftBanco, "56.10.42");
assert.ok(
  ftBancoItems.some((it) => it.id.includes("fermo-meccanico-portellone-laterale") && it.domain === "safety"),
  "Banco somministrazione deve verificare fermo meccanico di sicurezza portellone laterale (domain: safety)",
);
assert.ok(
  ftBancoItems.some((it) => it.id.includes("vetrina-parafiato-igienico-curvo") && it.domain === "haccp"),
  "Banco somministrazione deve verificare vetrina refrigerata parafiato curvo antiaerosol (domain: haccp)",
);
assert.ok(
  ftBancoItems.some((it) => it.id.includes("estintore-polvere-coperta-antifiamma-banco") && it.domain === "safety"),
  "Banco somministrazione deve verificare estintore omologato classe F e coperta antifiamma (domain: safety)",
);

// 3. Vano Frigoriferi a Bordo
const ftFrigoItems = generateEnvironmentChecklistItems(ftFrigo, "56.10.42");
assert.ok(
  ftFrigoItems.some((it) => it.id.includes("blocco-meccanico-apertura-frigo-curva") && it.domain === "safety"),
  "Vano refrigerazione veicolo deve verificare blocco meccanico a scatto ante/cassetti in curva (domain: safety)",
);
assert.ok(
  ftFrigoItems.some((it) => it.id.includes("registrazione-continua-temperature-haccp-frigo") && it.domain === "haccp"),
  "Vano refrigerazione veicolo deve verificare registrazione continua temperature HACCP (domain: haccp)",
);

// 4. Vano Tecnico Bombole GPL
const ftGplItems = generateEnvironmentChecklistItems(ftGpl, "56.10.42");
assert.ok(
  ftGplItems.some((it) => it.id.includes("tenuta-stagna-abitacolo-griglie-aerazione-pavimento") && it.domain === "safety"),
  "Vano bombole GPL veicolo deve verificare isolamento ermetico da abitacolo e aerazione esterna a pavimento (domain: safety)",
);
assert.ok(
  ftGplItems.some((it) => it.id.includes("catenelle-metalliche-anticaduta-bombole-gpl") && it.domain === "safety"),
  "Vano bombole GPL veicolo deve verificare catenelle metalliche anticaduta (domain: safety)",
);
assert.ok(
  ftGplItems.some((it) => it.id.includes("centralina-rilevatore-gas-12v-elettrovalvola-nc") && it.domain === "safety"),
  "Vano bombole GPL veicolo deve verificare rilevatore fughe gas 12V con elettrovalvola esterna NC (domain: safety)",
);
assert.ok(
  ftGplItems.some((it) => it.id.includes("scadenza-tubi-flessibili-uni-7140-crash-sensor") && it.domain === "safety"),
  "Vano bombole GPL veicolo deve verificare data scadenza tubi UNI 7140 e crash-sensor (domain: safety)",
);

// 5. Vano Generatore Elettrico Ausiliario
const ftGenItems = generateEnvironmentChecklistItems(ftGen, "56.10.42");
assert.ok(
  ftGenItems.some((it) => it.id.includes("scarico-fumi-tetto-generatore-ausiliario") && it.domain === "safety"),
  "Vano generatore deve verificare evacuazione gas di scarico all'esterno a tetto senza infiltrazioni (domain: safety)",
);
assert.ok(
  ftGenItems.some((it) => it.id.includes("salvavita-differenziale-30ma-quadro-veicolo") && it.domain === "safety"),
  "Vano generatore deve verificare interruttore differenziale salvavita 30 mA (domain: safety)",
);

// 6. Centrale Idrica Mobile
const ftIdricoItems = generateEnvironmentChecklistItems(ftIdrico, "56.10.42");
assert.ok(
  ftIdricoItems.some((it) => it.id.includes("certificazione-moca-serbatoio-pompa-acqua-potabile") && it.domain === "haccp"),
  "Centrale idrica mobile deve verificare certificazione MOCA serbatoio acqua potabile e pompa autoclave (domain: haccp)",
);
assert.ok(
  ftIdricoItems.some((it) => it.id.includes("boiler-acqua-calda-sanitaria-funzionamento") && it.domain === "haccp"),
  "Centrale idrica mobile deve verificare funzionamento boiler elettrico acqua calda 45-50°C (domain: haccp)",
);
assert.ok(
  ftIdricoItems.some((it) => it.id.includes("tenuta-serbatoio-acque-grigie-valvola-saracinesca") && it.domain === "both"),
  "Centrale idrica mobile deve verificare tenuta serbatoio acque grigie con valvola saracinesca (domain: both)",
);

// 7. Cabina di Guida del Furgone
const ftCabinaItems = generateEnvironmentChecklistItems(ftCabina, "56.10.42");
assert.ok(
  ftCabinaItems.some((it) => it.id.includes("paratia-divisoria-fissa-sicurezza-cucina") && it.domain === "safety"),
  "Cabina guida deve verificare paratia divisoria fissa di sicurezza tra cabina e laboratorio cucina (domain: safety)",
);
assert.ok(
  ftCabinaItems.some((it) => it.id.includes("estintore-veicolare-polvere-cabina") && it.domain === "safety"),
  "Cabina guida deve verificare estintore veicolare omologato 2 kg (domain: safety)",
);

// 8. Hangar Rimessaggio Coperto
const ftRimessaggioItems = generateEnvironmentChecklistItems(ftRimessaggio, "56.10.42");
assert.ok(
  ftRimessaggioItems.some((it) => it.id.includes("colonnina-ricarica-notturna-norma-cei") && it.domain === "safety"),
  "Rimessaggio deve verificare colonnina allacciamento elettrico notturno a norma CEI per gruppi frigo (domain: safety)",
);
assert.ok(
  ftRimessaggioItems.some((it) => it.id.includes("estintori-carrellati-rimessaggio-vie-fuga") && it.domain === "safety"),
  "Rimessaggio deve verificare estintori carrellati e corsie di manovra libere (domain: safety)",
);

// 9. Piazzale di Carico/Scarico Merci & Acque
const ftCaricoItems = generateEnvironmentChecklistItems(ftCarico, "56.10.42");
assert.ok(
  ftCaricoItems.some((it) => it.id.includes("pozzetto-scarico-acque-grigie-autorizzato") && it.domain === "both"),
  "Piazzale carico/scarico deve verificare scarico acque grigie in pozzetto fognario autorizzato con divieto sversamento a terra (domain: both)",
);
assert.ok(
  ftCaricoItems.some((it) => it.id.includes("rifornimento-acqua-potabile-canna-moca-antiriflusso") && it.domain === "both"),
  "Piazzale carico/scarico deve verificare rifornimento acqua potabile con canna alimentare MOCA e valvola antiriflusso UNI EN 1717 (domain: both)",
);

// 10. Magazzino Secco & Packaging Monouso / MOCA di Sede
const ftScorteItems = generateEnvironmentChecklistItems(ftScorte, "56.10.42");
assert.ok(
  ftScorteItems.some((it) => it.id.includes("conformita-moca-packaging-street-food") && it.domain === "haccp"),
  "Magazzino scorte sede deve verificare conformità MOCA packaging monouso Reg. CE 1935/2004 (domain: haccp)",
);
assert.ok(
  ftScorteItems.some((it) => it.id.includes("stoccaggio-rialzato-scaffali-scorte") && it.domain === "both"),
  "Magazzino scorte sede deve verificare stoccaggio merci e packaging su scaffalature rialzate >= 15 cm (domain: both)",
);

// 11. Laboratorio Base / Plonge di Sede
const ftLabItems = generateEnvironmentChecklistItems(ftLab, "56.10.42");
assert.ok(
  ftLabItems.some((it) => it.id.includes("plonge-sanificazione-attrezzature-rientro") && it.domain === "haccp"),
  "Laboratorio base deve verificare plonge inox gigante per sanificazione attrezzature di rientro (domain: haccp)",
);
assert.ok(
  ftLabItems.some((it) => it.id.includes("cappa-aspirazione-laboratorio-base") && it.domain === "both"),
  "Laboratorio base deve verificare cappa aspirazione fumi e pareti lavabili (domain: both)",
);

// 12. Spogliatoi e Servizi Igienici Sede
const ftSpogliatoiItems = generateEnvironmentChecklistItems(ftSpogliatoi, "56.10.42");
assert.ok(
  ftSpogliatoiItems.some((it) => it.id.includes("armadietti-doppio-scomparto-spogliatoio-sede") && it.domain === "safety"),
  "Spogliatoio sede deve verificare armadietti doppio scomparto sporco/pulito (domain: safety)",
);
assert.ok(
  ftSpogliatoiItems.some((it) => it.id.includes("lavamani-antibagno-sede") && it.domain === "haccp"),
  "Servizi igienici sede devono verificare antibagno con lavamani a comando non manuale (domain: haccp)",
);

// Verifica del filtraggio checklistMode su vano cottura food truck
const ftCucinaHaccpMode = filterEnvironmentItemsByChecklistMode(ftCucinaItems, "haccp_only");
assert.ok(
  ftCucinaHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item vano cottura food truck devono essere haccp o both",
);
assert.ok(
  !ftCucinaHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item vano cottura food truck deve avere domain safety",
);

const ftCucinaSafetyMode = filterEnvironmentItemsByChecklistMode(ftCucinaItems, "safety_only");
assert.ok(
  ftCucinaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item vano cottura food truck devono essere safety o both",
);
assert.ok(
  !ftCucinaSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item vano cottura food truck deve avere domain haccp",
);

// ============================================================================
// Test 21: getStandardEnvironmentsForAteco & conformità per Gelateria e Pasticceria Ambulante (56.10.41 / 56.10.4)
// ============================================================================
console.log("Test 21: getStandardEnvironmentsForAteco per Gelateria e Pasticceria Ambulante (ATECO 56.10.41 / 561041 / 56.10.4)");

const gelambEnvs1 = getStandardEnvironmentsForAteco("56.10.41");
assert.equal(gelambEnvs1.length, 12, "Gelateria ambulante deve avere esattamente 12 ambienti standard");

const gelambEnvs2 = getStandardEnvironmentsForAteco("561041");
assert.equal(gelambEnvs2.length, 12, "Anche formato 561041 deve restituire i 12 ambienti di gelateria ambulante");

const gelambEnvs3 = getStandardEnvironmentsForAteco("56.10.4");
assert.equal(gelambEnvs3.length, 12, "Anche formato 56.10.4 senza suffisso 2 deve restituire i 12 ambienti");

// Verifica ID ambienti generati
const expectedGelambIds = [
  "env-gelamb-banco-veicolare",
  "env-ft-crepes-waffle",
  "env-gelamb-vano-tecnico-batterie",
  "env-gelamb-centrale-idrica",
  "env-gelamb-cabina-guida",
  "env-gelamb-lab-pastorizzazione",
  "env-gelamb-lab-mantecazione",
  "env-gelamb-lab-pasticceria",
  "env-gelamb-cella-stoccaggio",
  "env-gelamb-dispensa-coni",
  "env-gelamb-lavaggio-carapine",
  "env-gelamb-hangar-ricarica",
];

for (const id of expectedGelambIds) {
  assert.ok(
    gelambEnvs1.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista per 56.10.41`,
  );
}

// 1. Vano Operativo Banco Pozzetti Gelato & Porzionatura Veicolare
const gelambBanco = gelambEnvs1.find((e) => e.id === "env-gelamb-banco-veicolare")!;
assert.equal(gelambBanco.category, "production");
assert.equal(gelambBanco.surfaceSqM, 8);
assert.equal(gelambBanco.heightM, 2.2);
assert.equal(gelambBanco.volumeCuM, 17.6);
assert.equal(gelambBanco.occupantsCount, 2);
assert.equal(gelambBanco.windowSurfaceSqM, 2.5);
assert.equal(gelambBanco.features.forcedExhaustPresent, true);
assert.equal(gelambBanco.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gelambBanco.features.flooringCondition, "compliant_anti_slip");
assert.equal(gelambBanco.features.insectScreens, true);
assert.equal(gelambBanco.features.microclimateCompliant, true);
const compBancoGelamb = evaluateEnvironmentCompliance(gelambBanco, "56.10.41");
assert.equal(compBancoGelamb.isHeightCompliant, true);
assert.ok(
  compBancoGelamb.summaryBadges.some((b) => b.text.includes("Banco pozzetti veicolare a norma")),
  "Deve essere presente il badge altezza veicolare a norma banco pozzetti",
);
assert.ok(
  compBancoGelamb.summaryBadges.some((b) => b.text.includes("Lavamani con comando non manuale a ginocchio & lavaporzionatore")),
  "Deve essere presente il badge lavamani a ginocchio e lavaporzionatore",
);
assert.ok(
  compBancoGelamb.summaryBadges.some((b) => b.text.includes("Vetrina parafiato curvo antiaerosol & portellone")),
  "Deve essere presente il badge vetrina parafiato e portellone",
);

// 2. Zona Piastre Crêpes, Waffle & Farciture Calde a Bordo
const gelambCrepes = gelambEnvs1.find((e) => e.id === "env-ft-crepes-waffle")!;
assert.equal(gelambCrepes.category, "production");
assert.equal(gelambCrepes.surfaceSqM, 4);
assert.equal(gelambCrepes.heightM, 2.2);
assert.equal(gelambCrepes.volumeCuM, 8.8);
assert.equal(gelambCrepes.occupantsCount, 1);
assert.equal(gelambCrepes.windowSurfaceSqM, 1.5);
assert.equal(gelambCrepes.features.forcedExhaustPresent, true);
assert.equal(gelambCrepes.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gelambCrepes.features.flooringCondition, "compliant_anti_slip");
const compCrepesGelamb = evaluateEnvironmentCompliance(gelambCrepes, "56.10.41");
assert.equal(compCrepesGelamb.isHeightCompliant, true);
assert.ok(
  compCrepesGelamb.summaryBadges.some((b) => b.text.includes("Postazione crêpes/waffle a norma")),
  "Deve essere presente il badge postazione crêpes a norma",
);
assert.ok(
  compCrepesGelamb.summaryBadges.some((b) => b.text.includes("Cappa aspirazione fumi inox a tetto & paraspruzzi")),
  "Deve essere presente il badge cappa a tetto e paraspruzzi",
);

// 3. Vano Tecnico Batterie Litio, Inverter & Quadro CEE Veicolare
const gelambBatterie = gelambEnvs1.find((e) => e.id === "env-gelamb-vano-tecnico-batterie")!;
assert.equal(gelambBatterie.category, "technical");
assert.equal(gelambBatterie.surfaceSqM, 3);
assert.equal(gelambBatterie.heightM, 1.2);
assert.equal(gelambBatterie.volumeCuM, 3.6);
assert.equal(gelambBatterie.occupantsCount, 1);
assert.equal(gelambBatterie.features.emergencyLighting, true);
const compBatterieGelamb = evaluateEnvironmentCompliance(gelambBatterie, "56.10.41");
assert.equal(compBatterieGelamb.isHeightCompliant, true);
assert.ok(
  compBatterieGelamb.summaryBadges.some((b) => b.text.includes("Pacco batterie LiFePO4 con BMS")),
  "Deve essere presente il badge batterie LiFePO4 con BMS",
);
assert.ok(
  compBatterieGelamb.summaryBadges.some((b) => b.text.includes("Quadro elettrico veicolare con salvavita")),
  "Deve essere presente il badge salvavita 30 mA",
);

// 4. Centrale Idrica Veicolare
const gelambIdrica = gelambEnvs1.find((e) => e.id === "env-gelamb-centrale-idrica")!;
assert.equal(gelambIdrica.category, "technical");
assert.equal(gelambIdrica.surfaceSqM, 2);
assert.equal(gelambIdrica.heightM, 1.2);
assert.equal(gelambIdrica.volumeCuM, 2.4);
assert.equal(gelambIdrica.occupantsCount, 1);
assert.equal(gelambIdrica.features.wallsCondition, "washable_sanitizable_2m");
const compIdricaGelamb = evaluateEnvironmentCompliance(gelambIdrica, "56.10.41");
assert.equal(compIdricaGelamb.isHeightCompliant, true);
assert.ok(
  compIdricaGelamb.summaryBadges.some((b) => b.text.includes("Centrale idrica veicolare: serbatoio acqua potabile")),
  "Deve essere presente il badge idrica potabile MOCA",
);
assert.ok(
  compIdricaGelamb.summaryBadges.some((b) => b.text.includes("Serbatoio acque grigie con saracinesca")),
  "Deve essere presente il badge acque grigie saracinesca",
);

// 5. Cabina di Guida Furgone / Ape Car Allestito Gelateria
const gelambCabina = gelambEnvs1.find((e) => e.id === "env-gelamb-cabina-guida")!;
assert.equal(gelambCabina.category, "sales_office");
assert.equal(gelambCabina.surfaceSqM, 4);
assert.equal(gelambCabina.heightM, 1.8);
assert.equal(gelambCabina.volumeCuM, 7.2);
assert.equal(gelambCabina.occupantsCount, 1);
assert.equal(gelambCabina.features.emergencyLighting, true);
const compCabinaGelamb = evaluateEnvironmentCompliance(gelambCabina, "56.10.41");
assert.equal(compCabinaGelamb.isHeightCompliant, true);
assert.ok(
  compCabinaGelamb.summaryBadges.some((b) => b.text.includes("Postazione guida omologata con paratia")),
  "Deve essere presente il badge paratia divisoria fissa di sicurezza",
);

// 6. Laboratorio Base: Zona Pastorizzazione & Maturazione Miscele Gelato
const gelambPastorizzazione = gelambEnvs1.find((e) => e.id === "env-gelamb-lab-pastorizzazione")!;
assert.equal(gelambPastorizzazione.category, "production");
assert.equal(gelambPastorizzazione.surfaceSqM, 25);
assert.equal(gelambPastorizzazione.heightM, 3.0);
assert.equal(gelambPastorizzazione.volumeCuM, 75);
assert.equal(gelambPastorizzazione.occupantsCount, 2);
assert.equal(gelambPastorizzazione.features.forcedExhaustPresent, true);
assert.equal(gelambPastorizzazione.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gelambPastorizzazione.features.flooringCondition, "compliant_anti_slip");
assert.equal(gelambPastorizzazione.features.insectScreens, true);
assert.equal(gelambPastorizzazione.features.microclimateCompliant, true);
const compPastGelamb = evaluateEnvironmentCompliance(gelambPastorizzazione, "56.10.41");
assert.equal(compPastGelamb.isHeightCompliant, true);
assert.ok(
  compPastGelamb.summaryBadges.some((b) => b.text.includes("Ciclo termico pastorizzazione HACCP (+85°C)")),
  "Deve essere presente il badge ciclo termico pastorizzazione e shock +4°C",
);

// 7. Laboratorio Base: Zona Mantecazione, Abbattimento & Farcitura
const gelambMantecazione = gelambEnvs1.find((e) => e.id === "env-gelamb-lab-mantecazione")!;
assert.equal(gelambMantecazione.category, "production");
assert.equal(gelambMantecazione.surfaceSqM, 30);
assert.equal(gelambMantecazione.heightM, 3.0);
assert.equal(gelambMantecazione.volumeCuM, 90);
assert.equal(gelambMantecazione.occupantsCount, 2);
assert.equal(gelambMantecazione.features.forcedExhaustPresent, true);
assert.equal(gelambMantecazione.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gelambMantecazione.features.flooringCondition, "compliant_anti_slip");
const compMantecazioneGelamb = evaluateEnvironmentCompliance(gelambMantecazione, "56.10.41");
assert.equal(compMantecazioneGelamb.isHeightCompliant, true);
assert.ok(
  compMantecazioneGelamb.summaryBadges.some((b) => b.text.includes("Mantecazione e abbattimento rapido carapine a -35°C")),
  "Deve essere presente il badge mantecazione e abbattimento a -35°C",
);

// 8. Laboratorio Base: Reparto Pasticceria da Forno, Cialde & Coni
const gelambPasticceria = gelambEnvs1.find((e) => e.id === "env-gelamb-lab-pasticceria")!;
assert.equal(gelambPasticceria.category, "production");
assert.equal(gelambPasticceria.surfaceSqM, 25);
assert.equal(gelambPasticceria.heightM, 3.0);
assert.equal(gelambPasticceria.volumeCuM, 75);
assert.equal(gelambPasticceria.occupantsCount, 2);
assert.equal(gelambPasticceria.features.forcedExhaustPresent, true);
assert.equal(gelambPasticceria.features.forcedExhaustType, "kitchen_hood");
const compPasticceriaGelamb = evaluateEnvironmentCompliance(gelambPasticceria, "56.10.41");
assert.equal(compPasticceriaGelamb.isHeightCompliant, true);
assert.ok(
  compPasticceriaGelamb.summaryBadges.some((b) => b.text.includes("Macchine pasticceria a norma: planetaria con riparo UNI EN 454")),
  "Deve essere presente il badge planetaria e sfogliatrice",
);

// 9. Cella Frigorifera Negativa Stoccaggio Carapine & Torte Gelato (-20°C)
const gelambCella = gelambEnvs1.find((e) => e.id === "env-gelamb-cella-stoccaggio")!;
assert.equal(gelambCella.category, "storage");
assert.equal(gelambCella.surfaceSqM, 20);
assert.equal(gelambCella.heightM, 2.6);
assert.equal(gelambCella.volumeCuM, 52);
assert.equal(gelambCella.occupantsCount, 1);
assert.equal(gelambCella.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gelambCella.features.emergencyLighting, true);
const compCellaGelamb = evaluateEnvironmentCompliance(gelambCella, "56.10.41");
assert.equal(compCellaGelamb.isHeightCompliant, true);
assert.ok(
  compCellaGelamb.summaryBadges.some((b) => b.text.includes("Stoccaggio carapine gelato a -20°C")),
  "Deve essere presente il badge teletermometri carapine a -20°C",
);
assert.ok(
  compCellaGelamb.summaryBadges.some((b) => b.text.includes("Allarme acustico-visivo uomo intrappolato a 24V h24")),
  "Deve essere presente il badge uomo intrappolato a 24V h24",
);

// 10. Magazzino Secco, Coni, Coppette & Packaging MOCA di Sede
const gelambPackaging = gelambEnvs1.find((e) => e.id === "env-gelamb-dispensa-coni")!;
assert.equal(gelambPackaging.category, "warehouse");
assert.equal(gelambPackaging.surfaceSqM, 25);
assert.equal(gelambPackaging.heightM, 3.0);
assert.equal(gelambPackaging.volumeCuM, 75);
assert.equal(gelambPackaging.occupantsCount, 1);
assert.equal(gelambPackaging.features.shelvingCertified, true);
const compPackagingGelamb = evaluateEnvironmentCompliance(gelambPackaging, "56.10.41");
assert.equal(compPackagingGelamb.isHeightCompliant, true);
assert.ok(
  compPackagingGelamb.summaryBadges.some((b) => b.text.includes("Stoccaggio coni, coppette e packaging MOCA")),
  "Deve essere presente il badge packaging MOCA",
);

// 11. Plonge di Sede: Lavaggio & Sanificazione Carapine e Fruste
const gelambPlonge = gelambEnvs1.find((e) => e.id === "env-gelamb-lavaggio-carapine")!;
assert.equal(gelambPlonge.category, "production");
assert.equal(gelambPlonge.surfaceSqM, 18);
assert.equal(gelambPlonge.heightM, 3.0);
assert.equal(gelambPlonge.volumeCuM, 54);
assert.equal(gelambPlonge.occupantsCount, 1);
assert.equal(gelambPlonge.features.forcedExhaustPresent, true);
assert.equal(gelambPlonge.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gelambPlonge.features.flooringCondition, "compliant_anti_slip");
const compPlongeGelamb = evaluateEnvironmentCompliance(gelambPlonge, "56.10.41");
assert.equal(compPlongeGelamb.isHeightCompliant, true);
assert.ok(
  compPlongeGelamb.summaryBadges.some((b) => b.text.includes("Plonge e lavaoggetti con risciacquo igienico ≥ 82°C")),
  "Deve essere presente il badge risciacquo igienico >= 82°C",
);

// 12. Hangar Rimessaggio Coperto con Colonnina di Ricarica Notturna Frigo
const gelambHangar = gelambEnvs1.find((e) => e.id === "env-gelamb-hangar-ricarica")!;
assert.equal(gelambHangar.category, "warehouse");
assert.equal(gelambHangar.surfaceSqM, 45);
assert.equal(gelambHangar.heightM, 4.0);
assert.equal(gelambHangar.volumeCuM, 180);
assert.equal(gelambHangar.occupantsCount, 2);
assert.equal(gelambHangar.features.emergencyLighting, true);
const compHangarGelamb = evaluateEnvironmentCompliance(gelambHangar, "56.10.41");
assert.equal(compHangarGelamb.isHeightCompliant, true);
assert.ok(
  compHangarGelamb.summaryBadges.some((b) => b.text.includes("Colonnina allaccio elettrico notturno a norma CEI")),
  "Deve essere presente il badge colonnina elettrica notturna norma CEI",
);

// ============================================================================
// Test 22: generateEnvironmentChecklistItems per locali Gelateria e Pasticceria Ambulante (ATECO 56.10.41)
// ============================================================================
console.log("Test 22: generateEnvironmentChecklistItems per locali Gelateria e Pasticceria Ambulante (ATECO 56.10.41)");

// 1. Banco Pozzetti Veicolare
const gelambBancoItems = generateEnvironmentChecklistItems(gelambBanco, "56.10.41");
assert.ok(
  gelambBancoItems.some((it) => it.id.includes("temperatura-pozzetti-carapine-glicole") && it.domain === "haccp"),
  "Banco pozzetti deve verificare mantenimento temperatura -12/-14°C (domain: haccp)",
);
assert.ok(
  gelambBancoItems.some((it) => it.id.includes("lavaporzionatore-flusso-continuo-sanificante") && it.domain === "haccp"),
  "Banco pozzetti deve verificare lavaporzionatore a flusso continuo o sanificante (domain: haccp)",
);
assert.ok(
  gelambBancoItems.some((it) => it.id.includes("vetrina-parafiato-curvo-antiaerosol") && it.domain === "haccp"),
  "Banco pozzetti deve verificare vetrina parafiato curvo antiaerosol (domain: haccp)",
);
assert.ok(
  gelambBancoItems.some((it) => it.id.includes("fermo-meccanico-portellone-veicolare") && it.domain === "safety"),
  "Banco pozzetti deve verificare fermo meccanico anticaduta portellone (domain: safety)",
);
assert.ok(
  gelambBancoItems.some((it) => it.id.includes("lavamani-comando-non-manuale-acqua-calda") && it.domain === "haccp"),
  "Banco pozzetti deve verificare lavamani a ginocchio con acqua calda sanitaria (domain: haccp)",
);

// 2. Zona Piastre Crêpes e Waffle
const gelambCrepesItems = generateEnvironmentChecklistItems(gelambCrepes, "56.10.41");
assert.ok(
  gelambCrepesItems.some((it) => it.id.includes("piastre-ghisa-moca-certificazione") && it.domain === "haccp"),
  "Zona piastre deve verificare ghisa alimentare certificata MOCA (domain: haccp)",
);
assert.ok(
  gelambCrepesItems.some((it) => it.id.includes("paraspruzzi-inox-perimetrale") && it.domain === "safety"),
  "Zona piastre deve verificare paraspruzzi inox perimetrale (domain: safety)",
);
assert.ok(
  gelambCrepesItems.some((it) => it.id.includes("cappa-aspirazione-scarico-tetto") && it.domain === "both"),
  "Zona piastre deve verificare cappa aspirazione con scarico a tetto (domain: both)",
);

// 3. Vano Tecnico Batterie Litio
const gelambBatterieItems = generateEnvironmentChecklistItems(gelambBatterie, "56.10.41");
assert.ok(
  gelambBatterieItems.some((it) => it.id.includes("batterie-litio-bms-ventilazione") && it.domain === "safety"),
  "Vano batterie deve verificare stato e ventilazione pacco LiFePO4 con BMS (domain: safety)",
);
assert.ok(
  gelambBatterieItems.some((it) => it.id.includes("salvavita-30ma-inverter-quadro-cee") && it.domain === "safety"),
  "Vano batterie deve verificare efficienza salvavita 30 mA (domain: safety)",
);

// 4. Centrale Idrica Veicolare
const gelambIdricaItems = generateEnvironmentChecklistItems(gelambIdrica, "56.10.41");
assert.ok(
  gelambIdricaItems.some((it) => it.id.includes("serbatoio-moca-pompa-autoclave-pressostato") && it.domain === "haccp"),
  "Centrale idrica deve verificare atossicità MOCA serbatoio e autoclave (domain: haccp)",
);
assert.ok(
  gelambIdricaItems.some((it) => it.id.includes("boiler-acqua-calda-funzionamento") && it.domain === "haccp"),
  "Centrale idrica deve verificare funzionamento boiler acqua calda (domain: haccp)",
);
assert.ok(
  gelambIdricaItems.some((it) => it.id.includes("serbatoio-acque-grigie-saracinesca-scarico") && it.domain === "both"),
  "Centrale idrica deve verificare saracinesca scarico acque grigie (domain: both)",
);

// 5. Cabina di Guida Furgone / Ape Car
const gelambCabinaItems = generateEnvironmentChecklistItems(gelambCabina, "56.10.41");
assert.ok(
  gelambCabinaItems.some((it) => it.id.includes("paratia-divisoria-fissa-sicurezza") && it.domain === "safety"),
  "Cabina guida deve verificare paratia divisoria fissa di sicurezza anti-intrusione (domain: safety)",
);
assert.ok(
  gelambCabinaItems.some((it) => it.id.includes("estintore-veicolare-polvere-2kg") && it.domain === "safety"),
  "Cabina guida deve verificare estintore veicolare (domain: safety)",
);

// 6. Laboratorio Pastorizzazione & Maturazione
const gelambPastItems = generateEnvironmentChecklistItems(gelambPastorizzazione, "56.10.41");
assert.ok(
  gelambPastItems.some((it) => it.id.includes("registrazione-ciclo-pastorizzazione-shock-termico") && it.domain === "haccp"),
  "Laboratorio pastorizzazione deve verificare ciclo pastorizzazione +85°C e shock +4°C (domain: haccp)",
);
assert.ok(
  gelambPastItems.some((it) => it.id.includes("lavamani-antibagno-laboratorio-pedale") && it.domain === "both"),
  "Laboratorio pastorizzazione deve verificare lavamani a comando non manuale (domain: both)",
);

// 7. Laboratorio Mantecazione & Abbattimento
const gelambMantecazioneItems = generateEnvironmentChecklistItems(gelambMantecazione, "56.10.41");
assert.ok(
  gelambMantecazioneItems.some((it) => it.id.includes("microinterruttore-sicurezza-scarico-mantecatore") && it.domain === "safety"),
  "Laboratorio mantecazione deve verificare microinterruttore su scarico mantecatore (domain: safety)",
);
assert.ok(
  gelambMantecazioneItems.some((it) => it.id.includes("abbattimento-rapido-carapine-35c") && it.domain === "haccp"),
  "Laboratorio mantecazione deve verificare abbattimento rapido carapine a -35°C (domain: haccp)",
);

// 8. Laboratorio Pasticceria da Forno, Cialde & Coni
const gelambPasticceriaItems = generateEnvironmentChecklistItems(gelambPasticceria, "56.10.41");
assert.ok(
  gelambPasticceriaItems.some((it) => it.id.includes("griglia-interbloccata-planetaria-uni-en-454") && it.domain === "safety"),
  "Laboratorio pasticceria deve verificare griglia interbloccata planetaria UNI EN 454 (domain: safety)",
);
assert.ok(
  gelambPasticceriaItems.some((it) => it.id.includes("ripari-mobili-sfogliatrice-uni-en-1674") && it.domain === "safety"),
  "Laboratorio pasticceria deve verificare ripari mobili sfogliatrice UNI EN 1674 (domain: safety)",
);
assert.ok(
  gelambPasticceriaItems.some((it) => it.id.includes("arresto-ventola-forno-pasticceria") && it.domain === "safety"),
  "Laboratorio pasticceria deve verificare arresto ventola forno all'apertura (domain: safety)",
);

// 9. Cella Frigorifera Negativa Stoccaggio Carapine (-20°C)
const gelambCellaItems = generateEnvironmentChecklistItems(gelambCella, "56.10.41");
assert.ok(
  gelambCellaItems.some((it) => it.id.includes("allarme-uomo-intrappolato-batteria-tampone-24v") && it.domain === "safety"),
  "Cella carapine deve verificare allarme uomo intrappolato a 24V h24 con batteria tampone (domain: safety)",
);
assert.ok(
  gelambCellaItems.some((it) => it.id.includes("teletermometro-registratore-continuo-haccp-20c") && it.domain === "haccp"),
  "Cella carapine deve verificare monitoraggio continuo <= -20°C (domain: haccp)",
);

// 10. Magazzino Packaging e Coni MOCA
const gelambPackagingItems = generateEnvironmentChecklistItems(gelambPackaging, "56.10.41");
assert.ok(
  gelambPackagingItems.some((it) => it.id.includes("conformita-moca-coni-coppette-palette") && it.domain === "haccp"),
  "Magazzino packaging deve verificare conformità MOCA coppette, coni e palette (domain: haccp)",
);
assert.ok(
  gelambPackagingItems.some((it) => it.id.includes("stoccaggio-rialzato-scaffali-scorte") && it.domain === "both"),
  "Magazzino packaging deve verificare stoccaggio sollevato da terra (domain: both)",
);

// 11. Plonge Carapine e Fruste
const gelambPlongeItems = generateEnvironmentChecklistItems(gelambPlonge, "56.10.41");
assert.ok(
  gelambPlongeItems.some((it) => it.id.includes("lavaoggetti-risciacquo-igienico-82c") && it.domain === "haccp"),
  "Plonge deve verificare risciacquo >= 82°C per sanificazione carapine inox (domain: haccp)",
);
assert.ok(
  gelambPlongeItems.some((it) => it.id.includes("disconnettore-antiriflusso-uni-en-1717") && it.domain === "both"),
  "Plonge deve verificare disconnettore antiriflusso UNI EN 1717 (domain: both)",
);

// 12. Hangar Rimessaggio Coperto
const gelambHangarItems = generateEnvironmentChecklistItems(gelambHangar, "56.10.41");
assert.ok(
  gelambHangarItems.some((it) => it.id.includes("colonnina-ricarica-notturna-norma-cei") && it.domain === "safety"),
  "Hangar deve verificare quadro colonnina allacciamento notturno CEE stagno (domain: safety)",
);
assert.ok(
  gelambHangarItems.some((it) => it.id.includes("estintori-carrellati-hangar") && it.domain === "safety"),
  "Hangar deve verificare estintori e vie di manovra libere (domain: safety)",
);

// Verifica del filtraggio checklistMode su banco pozzetti gelateria ambulante
const gelambBancoHaccpMode = filterEnvironmentItemsByChecklistMode(gelambBancoItems, "haccp_only");
assert.ok(
  gelambBancoHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item banco pozzetti gelateria ambulante devono essere haccp o both",
);
assert.ok(
  !gelambBancoHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item banco pozzetti gelateria ambulante deve avere domain safety",
);

const gelambBancoSafetyMode = filterEnvironmentItemsByChecklistMode(gelambBancoItems, "safety_only");
assert.ok(
  gelambBancoSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item banco pozzetti gelateria ambulante devono essere safety o both",
);
assert.ok(
  !gelambBancoSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item banco pozzetti gelateria ambulante deve avere domain haccp",
);

// ============================================================================
// Test 23: getStandardEnvironmentsForAteco & conformità per Bar / Caffetteria (56.30 / 56.3)
// ============================================================================
console.log("Test 23: getStandardEnvironmentsForAteco & conformità per Bar / Caffetteria (56.30 / 56.3)");

const barEnvs1 = getStandardEnvironmentsForAteco("56.30");
assert.equal(barEnvs1.length, 12, "Il Bar / Caffetteria deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO (56.30.00, 56.30.0, 56.3, 563000, 56300, 5630, 563)
const barEnvsVar1 = getStandardEnvironmentsForAteco("56.30.00");
assert.equal(barEnvsVar1.length, 12, "Anche prefisso 56.30.00 deve restituire 12 ambienti bar");
const barEnvsVar2 = getStandardEnvironmentsForAteco("56.30.0");
assert.equal(barEnvsVar2.length, 12, "Anche prefisso 56.30.0 deve restituire 12 ambienti bar");
const barEnvsVar3 = getStandardEnvironmentsForAteco("56.3");
assert.equal(barEnvsVar3.length, 12, "Anche prefisso 56.3 deve restituire 12 ambienti bar");
const barEnvsVar4 = getStandardEnvironmentsForAteco("563000");
assert.equal(barEnvsVar4.length, 12, "Anche codice numerico 563000 deve restituire 12 ambienti bar");
const barEnvsVar5 = getStandardEnvironmentsForAteco("56300");
assert.equal(barEnvsVar5.length, 12, "Anche codice numerico 56300 deve restituire 12 ambienti bar");
const barEnvsVar6 = getStandardEnvironmentsForAteco("5630");
assert.equal(barEnvsVar6.length, 12, "Anche codice numerico 5630 deve restituire 12 ambienti bar");
const barEnvsVar7 = getStandardEnvironmentsForAteco("563");
assert.equal(barEnvsVar7.length, 12, "Anche codice numerico 563 deve restituire 12 ambienti bar");

// Verifica ID dei 12 ambienti del Bar
const expectedBarIds = [
  "env-bar-banco-caffetteria",
  "env-bar-cocktail-station",
  "env-bar-retrobanco-snack",
  "env-bar-spillatura-co2",
  "env-bar-plonge-lavaggio",
  "env-bar-deposito-bevande",
  "env-bar-celle-frigo",
  "env-bar-sala-consumo",
  "env-bar-dehor-esterno",
  "env-bar-wc-clienti",
  "env-bar-spogliatoi-staff",
  "env-bar-tecnico-trattamento-acque",
];

for (const id of expectedBarIds) {
  assert.ok(
    barEnvs1.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista per 56.30`,
  );
}

// 1. Banco Bar Principale, Caffetteria & Mescita
const barBanco = barEnvs1.find((e) => e.id === "env-bar-banco-caffetteria")!;
assert.equal(barBanco.category, "sales_office");
assert.equal(barBanco.surfaceSqM, 25);
assert.equal(barBanco.heightM, 2.8);
assert.equal(barBanco.volumeCuM, 70);
assert.equal(barBanco.occupantsCount, 3);
assert.equal(barBanco.windowSurfaceSqM, 3.0);
assert.equal(barBanco.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(barBanco.features.flooringCondition, "compliant_anti_slip");
assert.equal(barBanco.features.emergencyLighting, true);
const compBancoBar = evaluateEnvironmentCompliance(barBanco, "56.30");
assert.equal(compBancoBar.isHeightCompliant, true);
assert.ok(
  compBancoBar.summaryBadges.some((b) => b.text.includes("Banco bar e mescita a norma: altezza ≥ 2,70m")),
  "Deve essere presente il badge altezza e gocciolatoi MOCA per banco bar",
);
assert.ok(
  compBancoBar.summaryBadges.some((b) => b.text.includes("Lavamani a comando non manuale")),
  "Deve essere presente il badge lavamani a comando non manuale banco bar",
);
assert.ok(
  compBancoBar.summaryBadges.some((b) => b.text.includes("Macchina caffè con valvola di sicurezza PED")),
  "Deve essere presente il badge valvola PED e lance cool-touch",
);

// 2. Zona Cocktail Bar, Mescita Alcolici & Banchi Bottiglie
const barCocktail = barEnvs1.find((e) => e.id === "env-bar-cocktail-station")!;
assert.equal(barCocktail.category, "sales_office");
assert.equal(barCocktail.surfaceSqM, 12);
assert.equal(barCocktail.heightM, 2.8);
assert.equal(barCocktail.volumeCuM, 33.6);
assert.equal(barCocktail.occupantsCount, 2);
assert.equal(barCocktail.windowSurfaceSqM, 1.5);
assert.equal(barCocktail.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(barCocktail.features.flooringCondition, "compliant_anti_slip");
const compCocktailBar = evaluateEnvironmentCompliance(barCocktail, "56.30");
assert.equal(compCocktailBar.isHeightCompliant, true);
assert.ok(
  compCocktailBar.summaryBadges.some((b) => b.text.includes("Cocktail station inox coibentata")),
  "Deve essere presente il badge cocktail station inox e speed-rail",
);
assert.ok(
  compCocktailBar.summaryBadges.some((b) => b.text.includes("Blender e tritaghiaccio insonorizzati conformi UNI EN 12852")),
  "Deve essere presente il badge blender UNI EN 12852",
);

// 3. Laboratorio Tavola Fredda, Piastre Panini & Preparazione Snack
const barSnack = barEnvs1.find((e) => e.id === "env-bar-retrobanco-snack")!;
assert.equal(barSnack.category, "production");
assert.equal(barSnack.surfaceSqM, 15);
assert.equal(barSnack.heightM, 3.0);
assert.equal(barSnack.volumeCuM, 45);
assert.equal(barSnack.occupantsCount, 2);
assert.equal(barSnack.windowSurfaceSqM, 2.0);
assert.equal(barSnack.features.forcedExhaustPresent, true);
assert.equal(barSnack.features.forcedExhaustType, "kitchen_hood");
assert.equal(barSnack.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(barSnack.features.flooringCondition, "compliant_anti_slip");
assert.equal(barSnack.features.insectScreens, true);
assert.equal(barSnack.features.microclimateCompliant, true);
const compSnackBar = evaluateEnvironmentCompliance(barSnack, "56.30");
assert.equal(compSnackBar.isHeightCompliant, true);
assert.ok(
  compSnackBar.summaryBadges.some((b) => b.text.includes("Laboratorio tavola fredda: cappa d'aspirazione")),
  "Deve essere presente il badge cappa laboratorio tavola fredda",
);
assert.ok(
  compSnackBar.summaryBadges.some((b) => b.text.includes("Affettatrice a gravità con anello paralama continuo 360° (UNI EN 1974)")),
  "Deve essere presente il badge affettatrice UNI EN 1974",
);

// 4. Impianto Spillatura Birra & Vano Bombole CO2 / Azoto Alimentare
const barSpillatura = barEnvs1.find((e) => e.id === "env-bar-spillatura-co2")!;
assert.equal(barSpillatura.category, "technical");
assert.equal(barSpillatura.surfaceSqM, 8);
assert.equal(barSpillatura.heightM, 2.5);
assert.equal(barSpillatura.volumeCuM, 20);
assert.equal(barSpillatura.occupantsCount, 1);
assert.equal(barSpillatura.windowSurfaceSqM, 1.0);
assert.equal(barSpillatura.features.forcedExhaustPresent, true);
assert.equal(barSpillatura.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(barSpillatura.features.flooringCondition, "compliant_anti_slip");
assert.equal(barSpillatura.features.emergencyLighting, true);
assert.equal(barSpillatura.features.gasLeakDetectorPresent, true);
const compSpillaturaBar = evaluateEnvironmentCompliance(barSpillatura, "56.30");
assert.equal(compSpillaturaBar.isHeightCompliant, true);
assert.ok(
  compSpillaturaBar.summaryBadges.some((b) => b.text.includes("Bombole CO2 ed azoto vincolate con catenelle verticali")),
  "Deve essere presente il badge catenelle bombole CO2",
);
assert.ok(
  compSpillaturaBar.summaryBadges.some((b) => b.text.includes("Rilevatore fughe CO2 con allarme ottico-acustico anti-asfissia")),
  "Deve essere presente il badge rilevatore fughe CO2",
);

// 5. Zona Lavaggio Bicchieri, Tazzine & Stoviglie (Plonge Separata)
const barPlonge = barEnvs1.find((e) => e.id === "env-bar-plonge-lavaggio")!;
assert.equal(barPlonge.category, "production");
assert.equal(barPlonge.surfaceSqM, 10);
assert.equal(barPlonge.heightM, 2.8);
assert.equal(barPlonge.volumeCuM, 28);
assert.equal(barPlonge.occupantsCount, 1);
assert.equal(barPlonge.windowSurfaceSqM, 1.5);
assert.equal(barPlonge.features.forcedExhaustPresent, true);
assert.equal(barPlonge.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(barPlonge.features.flooringCondition, "compliant_anti_slip");
const compPlongeBar = evaluateEnvironmentCompliance(barPlonge, "56.30");
assert.equal(compPlongeBar.isHeightCompliant, true);
assert.ok(
  compPlongeBar.summaryBadges.some((b) => b.text.includes("Lavabicchieri con risciacquo igienico ≥ 82-85°C & Break Tank UNI EN 1717")),
  "Deve essere presente il badge lavabicchieri 82-85°C e Break Tank UNI EN 1717",
);
assert.ok(
  compPlongeBar.summaryBadges.some((b) => b.text.includes("Canalina di scolo a pavimento sifonata")),
  "Deve essere presente il badge canalina di scolo a pavimento",
);

// 6. Magazzino Merci Secche, Bibite, Fusti & Cantina Vini
const barDeposito = barEnvs1.find((e) => e.id === "env-bar-deposito-bevande")!;
assert.equal(barDeposito.category, "warehouse");
assert.equal(barDeposito.surfaceSqM, 30);
assert.equal(barDeposito.heightM, 3.0);
assert.equal(barDeposito.volumeCuM, 90);
assert.equal(barDeposito.occupantsCount, 1);
assert.equal(barDeposito.windowSurfaceSqM, 2.0);
assert.equal(barDeposito.features.shelvingCertified, true);
const compDepositoBar = evaluateEnvironmentCompliance(barDeposito, "56.30");
assert.equal(compDepositoBar.isHeightCompliant, true);
assert.ok(
  compDepositoBar.summaryBadges.some((b) => b.text.includes("Stoccaggio bibite e fusti birra su scaffali certificati rialzati ≥ 15 cm")),
  "Deve essere presente il badge stoccaggio fusti rialzati",
);

// 7. Armadi Frigoriferi di Stoccaggio Deperibili (+2/+4°C e -18°C)
const barFrigo = barEnvs1.find((e) => e.id === "env-bar-celle-frigo")!;
assert.equal(barFrigo.category, "storage");
assert.equal(barFrigo.surfaceSqM, 12);
assert.equal(barFrigo.heightM, 2.6);
assert.equal(barFrigo.volumeCuM, 31.2);
assert.equal(barFrigo.occupantsCount, 1);
assert.equal(barFrigo.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(barFrigo.features.flooringCondition, "compliant_anti_slip");
assert.equal(barFrigo.features.emergencyLighting, true);
const compFrigoBar = evaluateEnvironmentCompliance(barFrigo, "56.30");
assert.equal(compFrigoBar.isHeightCompliant, true);
assert.ok(
  compFrigoBar.summaryBadges.some((b) => b.text.includes("Armadi frigoriferi positivi (+2/+4°C) e negativi (-18°C)")),
  "Deve essere presente il badge teletermometri continui HACCP per armadi frigo",
);

// 8. Sala Somministrazione, Tavoli & Zona Seduta Clienti (40-60 Coperti)
const barSala = barEnvs1.find((e) => e.id === "env-bar-sala-consumo")!;
assert.equal(barSala.category, "public");
assert.equal(barSala.surfaceSqM, 80);
assert.equal(barSala.heightM, 3.0);
assert.equal(barSala.volumeCuM, 240);
assert.equal(barSala.occupantsCount, 50);
assert.equal(barSala.windowSurfaceSqM, 12.0);
assert.equal(barSala.emergencyExitsCount, 2);
assert.equal(barSala.features.emergencyLighting, true);
assert.equal(barSala.features.antiShatterGlass, true);
const compSalaBar = evaluateEnvironmentCompliance(barSala, "56.30");
assert.equal(compSalaBar.isHeightCompliant, true);
assert.ok(
  compSalaBar.summaryBadges.some((b) => b.text.includes("Vie di esodo libere ≥ 1,20m & uscite di sicurezza con maniglioni antipanico")),
  "Deve essere presente il badge vie di esodo e maniglioni antipanico",
);
assert.ok(
  compSalaBar.summaryBadges.some((b) => b.text.includes("Illuminazione di emergenza ≥ 5 lux & estintori omologati 34A 233B")),
  "Deve essere presente il badge estintori 34A 233B e illuminazione di sicurezza",
);

// 9. Dehor Esterno / Area Tavoli all'Aperto & Gazebo
const barDehor = barEnvs1.find((e) => e.id === "env-bar-dehor-esterno")!;
assert.equal(barDehor.category, "public");
assert.equal(barDehor.surfaceSqM, 40);
assert.equal(barDehor.heightM, 2.8);
assert.equal(barDehor.volumeCuM, 112);
assert.equal(barDehor.occupantsCount, 30);
assert.equal(barDehor.features.emergencyLighting, true);
const compDehorBar = evaluateEnvironmentCompliance(barDehor, "56.30");
assert.equal(compDehorBar.isHeightCompliant, true);
assert.ok(
  compDehorBar.summaryBadges.some((b) => b.text.includes("Dehor esterno: paraventi certificati con ancoraggio antivento")),
  "Deve essere presente il badge paraventi antivento",
);
assert.ok(
  compDehorBar.summaryBadges.some((b) => b.text.includes("Funghi riscaldanti GPL con valvola antiribaltamento o lampade IR")),
  "Deve essere presente il badge riscaldatori funghi GPL con valvola antiribaltamento",
);

// 10. Servizi Igienici Clienti (Accessibile Disabili D.P.R. 503/96 - D.M. 236/89)
const barWcClienti = barEnvs1.find((e) => e.id === "env-bar-wc-clienti")!;
assert.equal(barWcClienti.category, "services");
assert.equal(barWcClienti.surfaceSqM, 12);
assert.equal(barWcClienti.heightM, 2.4);
assert.equal(barWcClienti.volumeCuM, 28.8);
assert.equal(barWcClienti.occupantsCount, 2);
assert.equal(barWcClienti.windowSurfaceSqM, 1.0);
assert.equal(barWcClienti.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(barWcClienti.features.flooringCondition, "compliant_anti_slip");
assert.equal(barWcClienti.features.forcedExhaustPresent, true);
assert.equal(barWcClienti.features.forcedExhaustType, "blind_toilet_fan");
const compWcClientiBar = evaluateEnvironmentCompliance(barWcClienti, "56.30");
assert.equal(compWcClientiBar.isHeightCompliant, true);
assert.ok(
  compWcClientiBar.summaryBadges.some((b) => b.text.includes("W.C. accessibile disabili (D.P.R. 503/96 - D.M. 236/89)")),
  "Deve essere presente il badge W.C. disabili con tirante",
);

// 11. Spogliatoio e Servizi Igienici del Personale con Antibagno
const barSpogliatoi = barEnvs1.find((e) => e.id === "env-bar-spogliatoi-staff")!;
assert.equal(barSpogliatoi.category, "changing_rooms");
assert.equal(barSpogliatoi.surfaceSqM, 12);
assert.equal(barSpogliatoi.heightM, 2.4);
assert.equal(barSpogliatoi.volumeCuM, 28.8);
assert.equal(barSpogliatoi.occupantsCount, 4);
assert.equal(barSpogliatoi.windowSurfaceSqM, 1.0);
assert.equal(barSpogliatoi.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(barSpogliatoi.features.flooringCondition, "compliant_anti_slip");
assert.equal(barSpogliatoi.features.forcedExhaustPresent, true);
assert.equal(barSpogliatoi.features.forcedExhaustType, "blind_toilet_fan");
const compSpogliatoiBar = evaluateEnvironmentCompliance(barSpogliatoi, "56.30");
assert.equal(compSpogliatoiBar.isHeightCompliant, true);
assert.ok(
  compSpogliatoiBar.summaryBadges.some((b) => b.text.includes("Armadietti a doppio scomparto sporco/pulito")),
  "Deve essere presente il badge armadietti doppio scomparto personale",
);

// 12. Locale Tecnico / Quadro Elettrico & Impianto Trattamento Acque
const barTecnico = barEnvs1.find((e) => e.id === "env-bar-tecnico-trattamento-acque")!;
assert.equal(barTecnico.category, "technical");
assert.equal(barTecnico.surfaceSqM, 8);
assert.equal(barTecnico.heightM, 2.5);
assert.equal(barTecnico.volumeCuM, 20);
assert.equal(barTecnico.occupantsCount, 1);
assert.equal(barTecnico.features.emergencyLighting, true);
const compTecnicoBar = evaluateEnvironmentCompliance(barTecnico, "56.30");
assert.equal(compTecnicoBar.isHeightCompliant, true);
assert.ok(
  compTecnicoBar.summaryBadges.some((b) => b.text.includes("Addolcitore a resine e filtri conformi D.Lgs. 18/2023 & D.M. 174/2004")),
  "Deve essere presente il badge trattamento acque D.Lgs. 18/2023",
);
assert.ok(
  compTecnicoBar.summaryBadges.some((b) => b.text.includes("Quadro elettrico con differenziale ad alta sensibilità")),
  "Deve essere presente il badge quadro elettrico e pulsante di sgancio rapido",
);

// ============================================================================
// Test 24: generateEnvironmentChecklistItems per locali Bar / Caffetteria (ATECO 56.30)
// ============================================================================
console.log("Test 24: generateEnvironmentChecklistItems per locali Bar / Caffetteria (ATECO 56.30)");

// 1. Banco Bar Principale
const barBancoItems = generateEnvironmentChecklistItems(barBanco, "56.30");
assert.ok(
  barBancoItems.some((it) => it.id.includes("macchina-espresso-valvola-ped-lancia-cooltouch") && it.domain === "safety"),
  "Banco bar deve verificare valvola di sicurezza PED e lance cool-touch (domain: safety)",
);
assert.ok(
  barBancoItems.some((it) => it.id.includes("macinadosatore-battifiltro-insonorizzato-rumore") && it.domain === "safety"),
  "Banco bar deve verificare cassetto battifiltro fonoassorbente Titolo VIII rumore (domain: safety)",
);
assert.ok(
  barBancoItems.some((it) => it.id.includes("vetrina-refrigerata-snack-parafiato-moca") && it.domain === "haccp"),
  "Banco bar deve verificare vetrina refrigerata snack parafiato +4°C (domain: haccp)",
);
assert.ok(
  barBancoItems.some((it) => it.id.includes("lavamani-banco-comando-non-manuale") && it.domain === "both"),
  "Banco bar deve verificare lavamani a ginocchio/pedale con acqua calda/fredda (domain: both)",
);

// 2. Cocktail Station
const barCocktailItems = generateEnvironmentChecklistItems(barCocktail, "56.30");
assert.ok(
  barCocktailItems.some((it) => it.id.includes("cocktail-station-vasca-ghiaccio-scarico-diretto") && it.domain === "haccp"),
  "Cocktail station deve verificare vasca ghiaccio a scarico continuo e palette MOCA (domain: haccp)",
);
assert.ok(
  barCocktailItems.some((it) => it.id.includes("blender-tritaghiaccio-microinterruttore-uni-en-12852") && it.domain === "safety"),
  "Cocktail station deve verificare blender e tritaghiaccio UNI EN 12852 (domain: safety)",
);
assert.ok(
  barCocktailItems.some((it) => it.id.includes("speed-rail-anticaduta-bottiglie-ergonomia") && it.domain === "both"),
  "Cocktail station deve verificare speed-rail con bordo anticaduta e sciacquabicchieri UNI EN 1717 (domain: both)",
);

// 3. Laboratorio Tavola Fredda / Retrobanco Snack
const barSnackItems = generateEnvironmentChecklistItems(barSnack, "56.30");
assert.ok(
  barSnackItems.some((it) => it.id.includes("affettatrice-paralama-360-blocco-vela-uni-en-1974") && it.domain === "safety"),
  "Retrobanco snack deve verificare affettatrice con paralama 360° UNI EN 1974 (domain: safety)",
);
assert.ok(
  barSnackItems.some((it) => it.id.includes("piastra-panini-isolamento-termico-cappa") && it.domain === "both"),
  "Retrobanco snack deve verificare piastra panini con isolamento e cappa (domain: both)",
);
assert.ok(
  barSnackItems.some((it) => it.id.includes("taglieri-coltelli-codice-colore-haccp") && it.domain === "haccp"),
  "Retrobanco snack deve verificare taglieri a codice colore (domain: haccp)",
);

// 4. Impianto Spillatura Birra & Bombole CO2
const barSpillaturaItems = generateEnvironmentChecklistItems(barSpillatura, "56.30");
assert.ok(
  barSpillaturaItems.some((it) => it.id.includes("bombole-co2-azoto-catenelle-verticali-titolo-xi") && it.domain === "safety"),
  "Spillatura birra deve verificare catenelle verticali anticaduta bombole CO2 Titolo XI (domain: safety)",
);
assert.ok(
  barSpillaturaItems.some((it) => it.id.includes("rilevatore-fughe-co2-allarme-anti-asfissia") && it.domain === "safety"),
  "Spillatura birra deve verificare rilevatore fughe CO2 anti-asfissia con allarme (domain: safety)",
);
assert.ok(
  barSpillaturaItems.some((it) => it.id.includes("linee-spillatura-sanificazione-periodica-haccp") && it.domain === "haccp"),
  "Spillatura birra deve verificare flussaggio e sanificazione linee HACCP (domain: haccp)",
);

// 5. Plonge Lavaggio Bicchieri & Tazzine
const barPlongeItems = generateEnvironmentChecklistItems(barPlonge, "56.30");
assert.ok(
  barPlongeItems.some((it) => it.id.includes("lavabicchieri-risciacquo-85c-break-tank-uni-en-1717") && it.domain === "both"),
  "Plonge deve verificare lavabicchieri con risciacquo >= 82-85°C e Break Tank UNI EN 1717 (domain: both)",
);
assert.ok(
  barPlongeItems.some((it) => it.id.includes("vasche-lavello-doccione-canalina-antiscivolo") && it.domain === "both"),
  "Plonge deve verificare canalina di scolo a terra e doccione (domain: both)",
);

// 6. Magazzino Merci Secche, Bibite & Fusti
const barDepositoItems = generateEnvironmentChecklistItems(barDeposito, "56.30");
assert.ok(
  barDepositoItems.some((it) => it.id.includes("scaffalature-portata-fusti-casse-acque") && it.domain === "safety"),
  "Magazzino merci deve verificare scaffalature fusti UNI EN 15635 (domain: safety)",
);
assert.ok(
  barDepositoItems.some((it) => it.id.includes("monitoraggio-infestanti-pallettizzazione-cantina") && it.domain === "haccp"),
  "Magazzino merci deve verificare monitoraggio infestanti e pedane lisce (domain: haccp)",
);

// 7. Armadi Frigoriferi Deperibili
const barFrigoItems = generateEnvironmentChecklistItems(barFrigo, "56.30");
assert.ok(
  barFrigoItems.some((it) => it.id.includes("teletermometri-registrazione-continua-haccp") && it.domain === "haccp"),
  "Armadi frigoriferi devono verificare teletermometri HACCP (domain: haccp)",
);
assert.ok(
  barFrigoItems.some((it) => it.id.includes("guarnizioni-frigo-integre-illuminazione-interna") && it.domain === "both"),
  "Armadi frigoriferi devono verificare tenuta guarnizioni magnetiche (domain: both)",
);

// 8. Sala Somministrazione Tavoli Clienti
const barSalaItems = generateEnvironmentChecklistItems(barSala, "56.30");
assert.ok(
  barSalaItems.some((it) => it.id.includes("vie-esodo-corridoi-passaggio-liberi-120cm") && it.domain === "safety"),
  "Sala somministrazione deve verificare corridoi liberi >= 1,20m (domain: safety)",
);
assert.ok(
  barSalaItems.some((it) => it.id.includes("uscite-sicurezza-maniglioni-antipanico-luci-emergenza") && it.domain === "safety"),
  "Sala somministrazione deve verificare uscite con maniglioni antipanico UNI EN 1125 (domain: safety)",
);

// 9. Dehor Esterno
const barDehorItems = generateEnvironmentChecklistItems(barDehor, "56.30");
assert.ok(
  barDehorItems.some((it) => it.id.includes("paraventi-dehor-ancoraggio-antivento-certificato") && it.domain === "safety"),
  "Dehor esterno deve verificare paraventi e gazebo con ancoraggio antivento (domain: safety)",
);
assert.ok(
  barDehorItems.some((it) => it.id.includes("riscaldatori-dehor-funghi-gpl-lampade-infrarossi") && it.domain === "safety"),
  "Dehor esterno deve verificare funghi riscaldanti GPL con valvola antiribaltamento (domain: safety)",
);

// 10. WC Clienti Accessibile Disabili
const barWcClientiItems = generateEnvironmentChecklistItems(barWcClienti, "56.30");
assert.ok(
  barWcClientiItems.some((it) => it.id.includes("accessibilita-disabili-dpr-503-dm-236") && it.domain === "safety"),
  "WC clienti deve verificare accessibilità disabili D.P.R. 503/96 e tirante allarme (domain: safety)",
);
assert.ok(
  barWcClientiItems.some((it) => it.id.includes("antibagno-lavamani-non-manuale-aerazione-forzata") && it.domain === "both"),
  "WC clienti deve verificare antibagno e aerazione forzata (domain: both)",
);

// 11. Spogliatoio e Servizi Personale
const barSpogliatoiItems = generateEnvironmentChecklistItems(barSpogliatoi, "56.30");
assert.ok(
  barSpogliatoiItems.some((it) => it.id.includes("armadietti-doppio-scomparto-sporco-pulito-staff") && it.domain === "both"),
  "Spogliatoio deve verificare armadietti doppio scomparto sporco/pulito (domain: both)",
);
assert.ok(
  barSpogliatoiItems.some((it) => it.id.includes("servizio-igienico-personale-doccia-lavamani") && it.domain === "both"),
  "Spogliatoio deve verificare bagno personale con lavamani a pedale e doccia (domain: both)",
);

// 12. Locale Tecnico / Quadro Elettrico & Trattamento Acque
const barTecnicoItems = generateEnvironmentChecklistItems(barTecnico, "56.30");
assert.ok(
  barTecnicoItems.some((it) => it.id.includes("impianto-addolcitore-resine-potabilita-dlgs-18-2023") && it.domain === "both"),
  "Locale tecnico deve verificare addolcitore a resine conforme D.Lgs. 18/2023 e D.M. 174/2004 (domain: both)",
);
assert.ok(
  barTecnicoItems.some((it) => it.id.includes("quadro-elettrico-differenziale-sgancio-rapido-emergenza") && it.domain === "safety"),
  "Locale tecnico deve verificare quadro elettrico con differenziale e pulsante sgancio (domain: safety)",
);

// Verifica del filtraggio checklistMode su banco mescita bar
const barBancoHaccpMode = filterEnvironmentItemsByChecklistMode(barBancoItems, "haccp_only");
assert.ok(
  barBancoHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item banco bar devono essere haccp o both",
);
assert.ok(
  !barBancoHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item banco bar deve avere domain safety",
);

const barBancoSafetyMode = filterEnvironmentItemsByChecklistMode(barBancoItems, "safety_only");
assert.ok(
  barBancoSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item banco bar devono essere safety o both",
);
assert.ok(
  !barBancoSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item banco bar deve avere domain haccp",
);

// ============================================================================
// 10. Test Hotel, Albergo, Resort e Strutture Ricettive ATECO 55.10.00 (o 55.10.0 / 55.10 / 55.1 / 551000 / 55100 / 5510 / 551)
// ============================================================================
console.log("Test 25: getStandardEnvironmentsForAteco & conformità per Hotel / Albergo (55.10.00 / 55.10 / 55.1)");

const hotelEnvs = getStandardEnvironmentsForAteco("55.10.00");
assert.equal(hotelEnvs.length, 12, "L'Hotel / Struttura ricettiva deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO (55.10.0, 55.10, 55.1, 551000, 55100, 5510, 551)
const hotelEnvsVar1 = getStandardEnvironmentsForAteco("55.10.0");
assert.equal(hotelEnvsVar1.length, 12, "Anche prefisso 55.10.0 deve restituire 12 ambienti hotel");
const hotelEnvsVar2 = getStandardEnvironmentsForAteco("55.10");
assert.equal(hotelEnvsVar2.length, 12, "Anche prefisso 55.10 deve restituire 12 ambienti hotel");
const hotelEnvsVar3 = getStandardEnvironmentsForAteco("55.1");
assert.equal(hotelEnvsVar3.length, 12, "Anche prefisso 55.1 deve restituire 12 ambienti hotel");
const hotelEnvsVar4 = getStandardEnvironmentsForAteco("551000");
assert.equal(hotelEnvsVar4.length, 12, "Anche codice numerico 551000 deve restituire 12 ambienti hotel");
const hotelEnvsVar5 = getStandardEnvironmentsForAteco("55100");
assert.equal(hotelEnvsVar5.length, 12, "Anche codice numerico 55100 deve restituire 12 ambienti hotel");
const hotelEnvsVar6 = getStandardEnvironmentsForAteco("5510");
assert.equal(hotelEnvsVar6.length, 12, "Anche codice numerico 5510 deve restituire 12 ambienti hotel");
const hotelEnvsVar7 = getStandardEnvironmentsForAteco("551");
assert.equal(hotelEnvsVar7.length, 12, "Anche codice numerico 551 deve restituire 12 ambienti hotel");

// Verifica ID dei 12 ambienti standard dell'Hotel
const expectedHotelIds = [
  "env-hotel-reception-hall",
  "env-hotel-camere-piano",
  "env-hotel-sala-colazioni",
  "env-hotel-office-cucina-colazioni",
  "env-hotel-lavanderia-stireria",
  "env-hotel-deposito-housekeeping",
  "env-hotel-centrale-idrica-legionella",
  "env-hotel-centrale-termica-clima",
  "env-hotel-vano-gruppo-elettrogeno",
  "env-hotel-vani-ascensori-montacarichi",
  "env-hotel-spogliatoi-personale",
  "env-hotel-deposito-rifiuti-differenziata",
];

for (const id of expectedHotelIds) {
  assert.ok(
    hotelEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard Hotel per 55.10.00`,
  );
}

// 1. Reception & Hall Principale
const hotelReception = hotelEnvs.find((e) => e.id === "env-hotel-reception-hall")!;
assert.equal(hotelReception.category, "sales_office");
assert.equal(hotelReception.surfaceSqM, 120);
assert.equal(hotelReception.heightM, 3.5);
assert.equal(hotelReception.volumeCuM, 420);
assert.equal(hotelReception.occupantsCount, 8);
assert.equal(hotelReception.windowSurfaceSqM, 15.0);
assert.equal(hotelReception.features.emergencyLighting, true);
assert.equal(hotelReception.features.antiShatterGlass, true);
const compReception = evaluateEnvironmentCompliance(hotelReception, "55.10.00");
assert.equal(compReception.isHeightCompliant, true);
assert.equal(compReception.isCubatureCompliant, true);
assert.ok(
  compReception.summaryBadges.some((b) => b.text.includes("UNI EN 16005")),
  "Reception deve includere badge porte automatiche scorrevoli UNI EN 16005",
);
assert.ok(
  compReception.summaryBadges.some((b) => b.text.includes("VDT D.Lgs. 81/08")),
  "Reception deve includere badge postazioni VDT ergonomiche D.Lgs. 81/08 Titolo VII",
);

// 2. Camere Ospiti, Suite & Corridoi ai Piani
const hotelCamere = hotelEnvs.find((e) => e.id === "env-hotel-camere-piano")!;
assert.equal(hotelCamere.category, "public");
assert.equal(hotelCamere.surfaceSqM, 400);
assert.equal(hotelCamere.heightM, 2.7);
assert.equal(hotelCamere.volumeCuM, 1080);
assert.equal(hotelCamere.occupantsCount, 80);
assert.equal(hotelCamere.windowSurfaceSqM, 60.0);
assert.equal(hotelCamere.features.emergencyLighting, true);
const compCamere = evaluateEnvironmentCompliance(hotelCamere, "55.10.00");
assert.equal(compCamere.isHeightCompliant, true);
assert.equal(compCamere.isCubatureCompliant, true);
assert.ok(
  compCamere.cpiActivityAlert !== null && compCamere.cpiActivityAlert.code.includes("Attività 66"),
  "Camere albergo (>25 posti letto) devono essere assoggettate ad Attività 66 D.P.R. 151/2011",
);
assert.ok(
  compCamere.summaryBadges.some((b) => b.text.includes("EI 30 / EI 60") && b.text.includes("D.M. 09/04/1994")),
  "Camere piano devono avere badge porte tagliafuoco EI 30 / EI 60 D.M. 09/04/1994",
);
assert.ok(
  compCamere.summaryBadges.some((b) => b.text.includes("IRAI")),
  "Camere piano devono avere badge rilevatori ottici di fumo IRAI",
);
assert.ok(
  compCamere.summaryBadges.some((b) => b.text.includes("D.P.R. 503/96")),
  "Camere piano devono avere badge bagni disabili D.P.R. 503/96 con tirante allarme",
);

// 3. Sala Colazioni & Ristorazione Ospiti
const hotelSalaColazioni = hotelEnvs.find((e) => e.id === "env-hotel-sala-colazioni")!;
assert.equal(hotelSalaColazioni.category, "public");
assert.equal(hotelSalaColazioni.surfaceSqM, 150);
assert.equal(hotelSalaColazioni.heightM, 3.0);
assert.equal(hotelSalaColazioni.volumeCuM, 450);
assert.equal(hotelSalaColazioni.occupantsCount, 100);
assert.equal(hotelSalaColazioni.windowSurfaceSqM, 20.0);
assert.equal(hotelSalaColazioni.features.emergencyLighting, true);
assert.equal(hotelSalaColazioni.features.antiShatterGlass, true);
const compSalaColazioni = evaluateEnvironmentCompliance(hotelSalaColazioni, "55.10.00");
assert.equal(compSalaColazioni.isHeightCompliant, true);
assert.ok(
  compSalaColazioni.summaryBadges.some((b) => b.text.includes("1,20 m") && b.text.includes("antipanico")),
  "Sala colazioni deve avere badge vie di esodo libere >= 1,20m e uscite antipanico",
);
assert.ok(
  compSalaColazioni.summaryBadges.some((b) => b.text.includes("parafiato igienici")),
  "Sala colazioni deve avere badge cristalli parafiato buffet",
);

// 4. Office / Cucina Preparazione Colazioni
const hotelOffice = hotelEnvs.find((e) => e.id === "env-hotel-office-cucina-colazioni")!;
assert.equal(hotelOffice.category, "production");
assert.equal(hotelOffice.surfaceSqM, 30);
assert.equal(hotelOffice.heightM, 3.0);
assert.equal(hotelOffice.volumeCuM, 90);
assert.equal(hotelOffice.occupantsCount, 3);
assert.equal(hotelOffice.windowSurfaceSqM, 3.0);
assert.equal(hotelOffice.features.forcedExhaustPresent, true);
assert.equal(hotelOffice.features.forcedExhaustType, "kitchen_hood");
assert.equal(hotelOffice.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(hotelOffice.features.flooringCondition, "compliant_anti_slip");
assert.equal(hotelOffice.features.insectScreens, true);
assert.equal(hotelOffice.features.microclimateCompliant, true);
const compOffice = evaluateEnvironmentCompliance(hotelOffice, "55.10.00");
assert.equal(compOffice.isHeightCompliant, true);
assert.equal(compOffice.isCubatureCompliant, true);
assert.ok(
  compOffice.summaryBadges.some((b) => b.text.includes("labirinto")),
  "Office colazioni deve avere badge cappa filtri a labirinto",
);
assert.ok(
  compOffice.summaryBadges.some((b) => b.text.includes("Break Tank") && b.text.includes("85°C")),
  "Office colazioni deve avere badge lavastoviglie con Break Tank e risciacquo a 85°C",
);

// 5. Lavanderia e Stireria Interna
const hotelLavanderia = hotelEnvs.find((e) => e.id === "env-hotel-lavanderia-stireria")!;
assert.equal(hotelLavanderia.category, "production");
assert.equal(hotelLavanderia.surfaceSqM, 40);
assert.equal(hotelLavanderia.heightM, 3.0);
assert.equal(hotelLavanderia.volumeCuM, 120);
assert.equal(hotelLavanderia.occupantsCount, 3);
assert.equal(hotelLavanderia.windowSurfaceSqM, 4.0);
assert.equal(hotelLavanderia.features.forcedExhaustPresent, true);
assert.equal(hotelLavanderia.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(hotelLavanderia.features.flooringCondition, "compliant_anti_slip");
const compLavanderia = evaluateEnvironmentCompliance(hotelLavanderia, "55.10.00");
assert.equal(compLavanderia.isHeightCompliant, true);
assert.equal(compLavanderia.isCubatureCompliant, true);
assert.ok(
  compLavanderia.summaryBadges.some((b) => b.text.includes("salvadita") && b.text.includes("UNI EN ISO 10472-5")),
  "Lavanderia deve avere badge calandra mangano con barra salvadita UNI EN ISO 10472-5",
);
assert.ok(
  compLavanderia.summaryBadges.some((b) => b.text.includes("marcia in avanti")),
  "Lavanderia deve avere badge marcia in avanti circuito sporco/pulito",
);

// 6. Guardaroba / Magazzino Housekeeping
const hotelHousekeeping = hotelEnvs.find((e) => e.id === "env-hotel-deposito-housekeeping")!;
assert.equal(hotelHousekeeping.category, "warehouse");
assert.equal(hotelHousekeeping.surfaceSqM, 35);
assert.equal(hotelHousekeeping.heightM, 2.7);
assert.equal(hotelHousekeeping.volumeCuM, 94.5);
assert.equal(hotelHousekeeping.occupantsCount, 2);
assert.equal(hotelHousekeeping.windowSurfaceSqM, 2.0);
assert.equal(hotelHousekeeping.features.shelvingCertified, true);
const compHousekeeping = evaluateEnvironmentCompliance(hotelHousekeeping, "55.10.00");
assert.equal(compHousekeeping.isHeightCompliant, true);
assert.equal(compHousekeeping.isCubatureCompliant, true);
assert.ok(
  compHousekeeping.summaryBadges.some((b) => b.text.includes("15 cm")),
  "Housekeeping deve avere badge scaffalature sollevate >= 15 cm da terra",
);

// 7. Centrale Idrica, Impianto ACS & Dosaggio Anti-Legionella
const hotelCentraleIdrica = hotelEnvs.find((e) => e.id === "env-hotel-centrale-idrica-legionella")!;
assert.equal(hotelCentraleIdrica.category, "technical");
assert.equal(hotelCentraleIdrica.surfaceSqM, 25);
assert.equal(hotelCentraleIdrica.heightM, 2.7);
assert.equal(hotelCentraleIdrica.volumeCuM, 67.5);
assert.equal(hotelCentraleIdrica.occupantsCount, 1);
assert.equal(hotelCentraleIdrica.windowSurfaceSqM, 0);
assert.equal(hotelCentraleIdrica.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(hotelCentraleIdrica.features.flooringCondition, "compliant_anti_slip");
assert.equal(hotelCentraleIdrica.features.emergencyLighting, true);
const compCentraleIdrica = evaluateEnvironmentCompliance(hotelCentraleIdrica, "55.10.00");
assert.equal(compCentraleIdrica.isHeightCompliant, true);
assert.equal(compCentraleIdrica.isCubatureCompliant, true);
assert.ok(
  compCentraleIdrica.summaryBadges.some((b) => b.text.includes("60°C") && b.text.includes("50°C")),
  "Centrale idrica deve verificare temperatura ACS >= 60°C e ricircolo >= 50°C",
);
assert.ok(
  compCentraleIdrica.summaryBadges.some((b) => b.text.includes("Registro Legionella")),
  "Centrale idrica deve verificare registro Legionella aggiornato",
);

// 8. Centrale Termica / Gruppi Frigo & CTA
const hotelCentraleTermica = hotelEnvs.find((e) => e.id === "env-hotel-centrale-termica-clima")!;
assert.equal(hotelCentraleTermica.category, "technical");
assert.equal(hotelCentraleTermica.surfaceSqM, 35);
assert.equal(hotelCentraleTermica.heightM, 3.0);
assert.equal(hotelCentraleTermica.volumeCuM, 105);
assert.equal(hotelCentraleTermica.occupantsCount, 1);
assert.equal(hotelCentraleTermica.windowSurfaceSqM, 0);
assert.equal(hotelCentraleTermica.features.emergencyLighting, true);
assert.equal(hotelCentraleTermica.features.gasLeakDetectorPresent, true);
const compCentraleTermica = evaluateEnvironmentCompliance(hotelCentraleTermica, "55.10.00");
assert.equal(compCentraleTermica.isHeightCompliant, true);
assert.ok(
  compCentraleTermica.cpiActivityAlert !== null && compCentraleTermica.cpiActivityAlert.code.includes("Attività 74"),
  "Centrale termica hotel deve essere assoggettata ad Attività 74 D.P.R. 151/2011",
);
assert.ok(
  compCentraleTermica.summaryBadges.some((b) => b.text.includes("INAIL") && b.text.includes("PED")),
  "Centrale termica deve verificare valvole INAIL e vasi di espansione PED",
);
assert.ok(
  compCentraleTermica.summaryBadges.some((b) => b.text.includes("Rilevatore fughe gas")),
  "Centrale termica deve verificare rilevatore fughe gas con elettrovalvola esterna",
);

// 9. Locale Gruppo Elettrogeno & Vano Gasolio Emergenza
const hotelGruppoElettrogeno = hotelEnvs.find((e) => e.id === "env-hotel-vano-gruppo-elettrogeno")!;
assert.equal(hotelGruppoElettrogeno.category, "technical");
assert.equal(hotelGruppoElettrogeno.surfaceSqM, 20);
assert.equal(hotelGruppoElettrogeno.heightM, 2.8);
assert.equal(hotelGruppoElettrogeno.volumeCuM, 56);
assert.equal(hotelGruppoElettrogeno.occupantsCount, 1);
assert.equal(hotelGruppoElettrogeno.windowSurfaceSqM, 0);
assert.equal(hotelGruppoElettrogeno.features.emergencyLighting, true);
const compGruppoElettrogeno = evaluateEnvironmentCompliance(hotelGruppoElettrogeno, "55.10.00");
assert.equal(compGruppoElettrogeno.isHeightCompliant, true);
assert.ok(
  compGruppoElettrogeno.cpiActivityAlert !== null && compGruppoElettrogeno.cpiActivityAlert.code.includes("Attività 49"),
  "Gruppo elettrogeno hotel deve essere assoggettato ad Attività 49 D.P.R. 151/2011",
);
assert.ok(
  compGruppoElettrogeno.summaryBadges.some((b) => b.text.includes("110%")),
  "Gruppo elettrogeno deve verificare vasca di contenimento gasolio al 110%",
);
assert.ok(
  compGruppoElettrogeno.summaryBadges.some((b) => b.text.includes("EI 120")),
  "Gruppo elettrogeno deve verificare porta tagliafuoco EI 120",
);

// 10. Vani Corsa Ascensori & Montacarichi
const hotelAscensori = hotelEnvs.find((e) => e.id === "env-hotel-vani-ascensori-montacarichi")!;
assert.equal(hotelAscensori.category, "technical");
assert.equal(hotelAscensori.surfaceSqM, 30);
assert.equal(hotelAscensori.heightM, 3.0);
assert.equal(hotelAscensori.volumeCuM, 90);
assert.equal(hotelAscensori.occupantsCount, 1);
assert.equal(hotelAscensori.windowSurfaceSqM, 0);
assert.equal(hotelAscensori.features.emergencyLighting, true);
const compAscensori = evaluateEnvironmentCompliance(hotelAscensori, "55.10.00");
assert.equal(compAscensori.isHeightCompliant, true);
assert.ok(
  compAscensori.summaryBadges.some((b) => b.text.includes("EN 81-28")),
  "Ascensori devono verificare teleallarme bidirezionale h24 EN 81-28",
);
assert.ok(
  compAscensori.summaryBadges.some((b) => b.text.includes("D.P.R. 162/99")),
  "Ascensori devono verificare verifica periodica biennale DPR 162/99",
);

// 11. Spogliatoi e Servizi Personale
const hotelSpogliatoi = hotelEnvs.find((e) => e.id === "env-hotel-spogliatoi-personale")!;
assert.equal(hotelSpogliatoi.category, "changing_rooms");
assert.equal(hotelSpogliatoi.surfaceSqM, 30);
assert.equal(hotelSpogliatoi.heightM, 2.4);
assert.equal(hotelSpogliatoi.volumeCuM, 72);
assert.equal(hotelSpogliatoi.occupantsCount, 15);
assert.equal(hotelSpogliatoi.windowSurfaceSqM, 2.0);
assert.equal(hotelSpogliatoi.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(hotelSpogliatoi.features.flooringCondition, "compliant_anti_slip");
assert.equal(hotelSpogliatoi.features.forcedExhaustPresent, true);
assert.equal(hotelSpogliatoi.features.forcedExhaustType, "blind_toilet_fan");
const compHotelSpogliatoi = evaluateEnvironmentCompliance(hotelSpogliatoi, "55.10.00");
assert.equal(compHotelSpogliatoi.isHeightCompliant, true);
assert.ok(
  compHotelSpogliatoi.summaryBadges.some((b) => b.text.includes("doppio scomparto")),
  "Spogliatoi personale devono verificare armadietti a doppio scomparto",
);

// 12. Deposito Rifiuti e Compattatore
const hotelRifiuti = hotelEnvs.find((e) => e.id === "env-hotel-deposito-rifiuti-differenziata")!;
assert.equal(hotelRifiuti.category, "technical");
assert.equal(hotelRifiuti.surfaceSqM, 20);
assert.equal(hotelRifiuti.heightM, 2.6);
assert.equal(hotelRifiuti.volumeCuM, 52);
assert.equal(hotelRifiuti.occupantsCount, 1);
assert.equal(hotelRifiuti.windowSurfaceSqM, 0);
assert.equal(hotelRifiuti.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(hotelRifiuti.features.flooringCondition, "compliant_anti_slip");
const compHotelRifiuti = evaluateEnvironmentCompliance(hotelRifiuti, "55.10.00");
assert.equal(compHotelRifiuti.isHeightCompliant, true);
assert.ok(
  compHotelRifiuti.summaryBadges.some((b) => b.text.includes("UNI EN 16500")),
  "Deposito rifiuti deve verificare compattatore cartone/plastica UNI EN 16500",
);

// ============================================================================
// Test 26: generateEnvironmentChecklistItems per locali Hotel (ATECO 55.10.00)
// ============================================================================
console.log("Test 26: generateEnvironmentChecklistItems per locali Hotel (ATECO 55.10.00)");

// 1. Reception
const hotelReceptionItems = generateEnvironmentChecklistItems(hotelReception, "55.10.00");
assert.ok(
  hotelReceptionItems.some((it) => it.id.includes("porte-automatiche-uni-en-16005-esodo") && it.domain === "safety"),
  "Reception hotel deve verificare porte automatiche scorrevoli UNI EN 16005 (domain: safety)",
);
assert.ok(
  hotelReceptionItems.some((it) => it.id.includes("banco-reception-ergonomia-vdt-presidio-h24") && it.domain === "safety"),
  "Reception hotel deve verificare banco reception VDT D.Lgs. 81/08 Titolo VII (domain: safety)",
);
assert.ok(
  hotelReceptionItems.some((it) => it.id.includes("percorsi-esodo-hall-planimetrie-luci-emergenza") && it.domain === "safety"),
  "Reception hotel deve verificare vie di esodo hall >= 1,50 m e luci emergenza (domain: safety)",
);

// 2. Camere ai piani
const hotelCamereItems = generateEnvironmentChecklistItems(hotelCamere, "55.10.00");
assert.ok(
  hotelCamereItems.some((it) => it.id.includes("porte-tagliafuoco-camere-ei30-chiudiporta-dm-1994") && it.domain === "safety"),
  "Camere piano devono verificare porte tagliafuoco EI 30 / EI 60 con chiudiporta D.M. 09/04/1994 (domain: safety)",
);
assert.ok(
  hotelCamereItems.some((it) => it.id.includes("rilevatori-fumo-irai-planimetrie-bilingue-evacuazione") && it.domain === "safety"),
  "Camere piano devono verificare rilevatori fumo indirizzati IRAI e planimetrie bilingue (domain: safety)",
);
assert.ok(
  hotelCamereItems.some((it) => it.id.includes("bagni-camere-disabili-dpr-503-tirante-soccorso") && it.domain === "safety"),
  "Camere piano devono verificare bagni disabili D.P.R. 503/96 con tirante allarme (domain: safety)",
);

// 3. Sala colazioni
const hotelSalaColazioniItems = generateEnvironmentChecklistItems(hotelSalaColazioni, "55.10.00");
assert.ok(
  hotelSalaColazioniItems.some((it) => it.id.includes("buffet-colazioni-parafiato-cristallo-temperature-haccp") && it.domain === "haccp"),
  "Sala colazioni deve verificare buffet con cristalli parafiato e temperature HACCP (domain: haccp)",
);
assert.ok(
  hotelSalaColazioniItems.some((it) => it.id.includes("vie-esodo-sala-coperti-porte-antipanico-uni-en-1125") && it.domain === "safety"),
  "Sala colazioni deve verificare corridoi liberi >= 1,20 m e maniglioni antipanico UNI EN 1125 (domain: safety)",
);
assert.ok(
  hotelSalaColazioniItems.some((it) => it.id.includes("estintori-omologati-34a-233b-luci-emergenza") && it.domain === "safety"),
  "Sala colazioni deve verificare estintori 34A 233B e illuminazione emergenza (domain: safety)",
);

// 4. Office cucina colazioni
const hotelOfficeItems = generateEnvironmentChecklistItems(hotelOffice, "55.10.00");
assert.ok(
  hotelOfficeItems.some((it) => it.id.includes("cappa-aspirazione-filtri-labirinto-forni-doppio-vetro") && it.domain === "both"),
  "Office cucina colazioni deve verificare cappa filtri a labirinto e forni doppio vetro (domain: both)",
);
assert.ok(
  hotelOfficeItems.some((it) => it.id.includes("lavamani-ginocchio-pedale-sapone-antibatterico") && it.domain === "both"),
  "Office cucina colazioni deve verificare lavamani a ginocchio/pedale (domain: both)",
);
assert.ok(
  hotelOfficeItems.some((it) => it.id.includes("lavastoviglie-break-tank-uni-en-1717-risciacquo-85c") && it.domain === "both"),
  "Office cucina colazioni deve verificare lavastoviglie con Break Tank UNI EN 1717 e risciacquo a 85°C (domain: both)",
);

// 5. Lavanderia e stireria
const hotelLavanderiaItems = generateEnvironmentChecklistItems(hotelLavanderia, "55.10.00");
assert.ok(
  hotelLavanderiaItems.some((it) => it.id.includes("lavatrici-essiccatori-industriali-uni-en-iso-10472") && it.domain === "safety"),
  "Lavanderia deve verificare lavatrici/essiccatori UNI EN ISO 10472 (domain: safety)",
);
assert.ok(
  hotelLavanderiaItems.some((it) => it.id.includes("calandra-mangano-barra-salvadita-microinterruttore-uni-en-iso-10472-5") && it.domain === "safety"),
  "Lavanderia deve verificare calandra mangano con barra salvadita a microinterruttore UNI EN ISO 10472-5 (domain: safety)",
);
assert.ok(
  hotelLavanderiaItems.some((it) => it.id.includes("separazione-marcia-in-avanti-sporco-pulito-ventilazione") && it.domain === "both"),
  "Lavanderia deve verificare circuito sporco/pulito marcia in avanti e ventilazione forzata (domain: both)",
);

// 6. Deposito housekeeping
const hotelHousekeepingItems = generateEnvironmentChecklistItems(hotelHousekeeping, "55.10.00");
assert.ok(
  hotelHousekeepingItems.some((it) => it.id.includes("scaffalature-biancheria-sollevate-15cm-portata-certificata") && it.domain === "safety"),
  "Housekeeping deve verificare scaffalature sollevate >= 15 cm e portata certificata (domain: safety)",
);
assert.ok(
  hotelHousekeepingItems.some((it) => it.id.includes("stoccaggio-carrelli-piani-schede-sicurezza-detergenti") && it.domain === "both"),
  "Housekeeping deve verificare stoccaggio carrelli e schede di sicurezza detergenti (domain: both)",
);

// 7. Centrale idrica & Legionella
const hotelCentraleIdricaItems = generateEnvironmentChecklistItems(hotelCentraleIdrica, "55.10.00");
assert.ok(
  hotelCentraleIdricaItems.some((it) => it.id.includes("temperatura-accumulo-acs-60c-ricircolo-50c-legionella") && it.domain === "both"),
  "Centrale idrica deve verificare temperatura ACS >= 60°C e ricircolo >= 50°C Accordo 07/05/2015 (domain: both)",
);
assert.ok(
  hotelCentraleIdricaItems.some((it) => it.id.includes("registro-legionella-campionamenti-periodici-dosaggio-cloro") && it.domain === "both"),
  "Centrale idrica deve verificare Registro Legionella e campionamenti periodici (domain: both)",
);
assert.ok(
  hotelCentraleIdricaItems.some((it) => it.id.includes("disconnettori-idrici-uni-en-1717-vaso-espansione-sicurezza") && it.domain === "both"),
  "Centrale idrica deve verificare disconnettori UNI EN 1717 e valvole di sicurezza (domain: both)",
);

// 8. Centrale termica & CTA
const hotelCentraleTermicaItems = generateEnvironmentChecklistItems(hotelCentraleTermica, "55.10.00");
assert.ok(
  hotelCentraleTermicaItems.some((it) => it.id.includes("rilevatore-fughe-gas-elettrovalvola-esterna-dm-2019") && it.domain === "safety"),
  "Centrale termica deve verificare rilevatore gas metano con elettrovalvola esterna D.M. 08/11/2019 (domain: safety)",
);
assert.ok(
  hotelCentraleTermicaItems.some((it) => it.id.includes("caldaie-valvole-inail-vaso-ped-attivita-74") && it.domain === "safety"),
  "Centrale termica deve verificare caldaie con valvole INAIL e vasi espansione PED (domain: safety)",
);
assert.ok(
  hotelCentraleTermicaItems.some((it) => it.id.includes("centrale-trattamento-aria-cta-filtri-sanificazione-canali") && it.domain === "both"),
  "Centrale termica/CTA deve verificare manutenzione filtri e sanificazione canali (domain: both)",
);

// 9. Vano gruppo elettrogeno
const hotelGruppoElettrogenoItems = generateEnvironmentChecklistItems(hotelGruppoElettrogeno, "55.10.00");
assert.ok(
  hotelGruppoElettrogenoItems.some((it) => it.id.includes("vasca-contenimento-gasolio-110-dm-13-07-2011-attivita-49") && it.domain === "safety"),
  "Gruppo elettrogeno deve verificare vasca di contenimento gasolio al 110% D.M. 13/07/2011 (domain: safety)",
);
assert.ok(
  hotelGruppoElettrogenoItems.some((it) => it.id.includes("porta-tagliafuoco-ei120-aerazione-permanente-dm-2011") && it.domain === "safety"),
  "Gruppo elettrogeno deve verificare porta tagliafuoco EI 120 e aerazione permanente (domain: safety)",
);
assert.ok(
  hotelGruppoElettrogenoItems.some((it) => it.id.includes("continuita-alimentazione-pompe-antincendio-luci-sicurezza") && it.domain === "safety"),
  "Gruppo elettrogeno deve verificare alimentazione pompe antincendio e luci emergenza (domain: safety)",
);

// 10. Vani ascensori e montacarichi
const hotelAscensoriItems = generateEnvironmentChecklistItems(hotelAscensori, "55.10.00");
assert.ok(
  hotelAscensoriItems.some((it) => it.id.includes("teleallarme-bidirezionale-h24-uni-en-81-28") && it.domain === "safety"),
  "Ascensori devono verificare teleallarme bidirezionale h24 UNI EN 81-28 (domain: safety)",
);
assert.ok(
  hotelAscensoriItems.some((it) => it.id.includes("ritorno-automatico-piano-blackout-uni-en-81-20") && it.domain === "safety"),
  "Ascensori devono verificare ritorno automatico al piano in blackout UNI EN 81-20 (domain: safety)",
);
assert.ok(
  hotelAscensoriItems.some((it) => it.id.includes("verifica-biennale-ascensori-dpr-162-99-ente-notificato") && it.domain === "safety"),
  "Ascensori devono verificare verifica periodica biennale D.P.R. 162/99 (domain: safety)",
);

// 11. Spogliatoi e servizi personale
const hotelSpogliatoiItems = generateEnvironmentChecklistItems(hotelSpogliatoi, "55.10.00");
assert.ok(
  hotelSpogliatoiItems.some((it) => it.id.includes("armadietti-doppio-scomparto-divise-alberghiere") && it.domain === "both"),
  "Spogliatoi personale devono verificare armadietti doppio scomparto per divise (domain: both)",
);
assert.ok(
  hotelSpogliatoiItems.some((it) => it.id.includes("docce-lavamani-non-manuali-aerazione-temporizzata") && it.domain === "both"),
  "Spogliatoi personale devono verificare docce e lavamani non manuali (domain: both)",
);

// 12. Deposito rifiuti e compattatore
const hotelRifiutiItems = generateEnvironmentChecklistItems(hotelRifiuti, "55.10.00");
assert.ok(
  hotelRifiutiItems.some((it) => it.id.includes("area-rifiuti-lavabile-chiusino-sifonato-igiene") && it.domain === "both"),
  "Area rifiuti deve verificare pavimentazione lavabile con chiusino sifonato (domain: both)",
);
assert.ok(
  hotelRifiutiItems.some((it) => it.id.includes("cassonetti-ermetici-differenziata-protezione-infestanti") && it.domain === "both"),
  "Area rifiuti deve verificare cassonetti differenziata a tenuta ermetica (domain: both)",
);
assert.ok(
  hotelRifiutiItems.some((it) => it.id.includes("pressa-compattatore-uni-en-16500-dispositivi-protezione") && it.domain === "safety"),
  "Area rifiuti deve verificare compattatore UNI EN 16500 con protezioni operatore (domain: safety)",
);

// Verifica del filtraggio checklistMode su office colazioni hotel
const hotelOfficeHaccpMode = filterEnvironmentItemsByChecklistMode(hotelOfficeItems, "haccp_only");
assert.ok(
  hotelOfficeHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item office colazioni hotel devono essere haccp o both",
);
assert.ok(
  !hotelOfficeHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item office colazioni hotel deve avere domain safety",
);

const hotelOfficeSafetyMode = filterEnvironmentItemsByChecklistMode(hotelOfficeItems, "safety_only");
assert.ok(
  hotelOfficeSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item office colazioni hotel devono essere safety o both",
);
assert.ok(
  !hotelOfficeSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item office colazioni hotel deve avere domain haccp",
);

// ============================================================================
// 11. Test B&B, Affittacamere, Case Vacanze, Guest House ATECO 55.20.51 (o 55.20.5 / 55.20 / 55.2 / 552051 / 55205 / 5520 / 552)
// ============================================================================
console.log("Test 27: getStandardEnvironmentsForAteco & conformità per B&B / Affittacamere (55.20.51 / 55.20.5 / 55.20 / 55.2 / 552051)");

const bnbEnvs = getStandardEnvironmentsForAteco("55.20.51");
assert.equal(bnbEnvs.length, 12, "Il B&B / Affittacamere deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO (55.20.5, 55.20, 55.2, 552051, 55205, 5520, 552)
const bnbEnvsVar1 = getStandardEnvironmentsForAteco("55.20.5");
assert.equal(bnbEnvsVar1.length, 12, "Anche prefisso 55.20.5 deve restituire 12 ambienti B&B");
const bnbEnvsVar2 = getStandardEnvironmentsForAteco("55.20");
assert.equal(bnbEnvsVar2.length, 12, "Anche prefisso 55.20 deve restituire 12 ambienti B&B");
const bnbEnvsVar3 = getStandardEnvironmentsForAteco("55.2");
assert.equal(bnbEnvsVar3.length, 12, "Anche prefisso 55.2 deve restituire 12 ambienti B&B");
const bnbEnvsVar4 = getStandardEnvironmentsForAteco("552051");
assert.equal(bnbEnvsVar4.length, 12, "Anche codice numerico 552051 deve restituire 12 ambienti B&B");
const bnbEnvsVar5 = getStandardEnvironmentsForAteco("55205");
assert.equal(bnbEnvsVar5.length, 12, "Anche codice numerico 55205 deve restituire 12 ambienti B&B");
const bnbEnvsVar6 = getStandardEnvironmentsForAteco("5520");
assert.equal(bnbEnvsVar6.length, 12, "Anche codice numerico 5520 deve restituire 12 ambienti B&B");
const bnbEnvsVar7 = getStandardEnvironmentsForAteco("552");
assert.equal(bnbEnvsVar7.length, 12, "Anche codice numerico 552 deve restituire 12 ambienti B&B");

// Verifica ID dei 12 ambienti standard B&B
const expectedBnbIds = [
  "env-bnb-ingresso-reception",
  "env-bnb-camere-ospiti",
  "env-bnb-bagni-privati",
  "env-bnb-sala-colazioni",
  "env-bnb-kitchenette-office",
  "env-bnb-guardaroba-biancheria",
  "env-bnb-lavanderia-office",
  "env-bnb-centrale-termica-boiler",
  "env-bnb-terrazzo-balconi",
  "env-bnb-scale-disimpegni",
  "env-bnb-ripostiglio-housekeeping",
  "env-bnb-area-rifiuti-differenziata",
];

for (const id of expectedBnbIds) {
  assert.ok(
    bnbEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard B&B per 55.20.51`,
  );
}

// 1. Ingresso Principale & Reception / Desk Accoglienza
const bnbReception = bnbEnvs.find((e) => e.id === "env-bnb-ingresso-reception")!;
assert.equal(bnbReception.category, "sales_office");
assert.equal(bnbReception.surfaceSqM, 25);
assert.equal(bnbReception.heightM, 2.8);
assert.equal(bnbReception.volumeCuM, 70);
assert.equal(bnbReception.occupantsCount, 4);
assert.equal(bnbReception.windowSurfaceSqM, 3.0);
assert.equal(bnbReception.features.emergencyLighting, true);
assert.equal(bnbReception.features.antiShatterGlass, true);
const compBnbReception = evaluateEnvironmentCompliance(bnbReception, "55.20.51");
assert.equal(compBnbReception.isHeightCompliant, true);
assert.equal(compBnbReception.isCubatureCompliant, true);
assert.ok(
  compBnbReception.summaryBadges.some((b) => b.text.includes("13A 89B") && b.text.includes("D.M. 03/09/2021")),
  "Reception B&B deve includere badge estintore 13A 89B D.M. 03/09/2021",
);
assert.ok(
  compBnbReception.summaryBadges.some((b) => b.text.includes("Planimetria di esodo bilingue")),
  "Reception B&B deve includere badge planimetria bilingue",
);
assert.ok(
  compBnbReception.summaryBadges.some((b) => b.text.includes("lampade autoalimentate")),
  "Reception B&B deve includere badge illuminazione di emergenza autoalimentata",
);

// 2. Camere da Letto Ospiti (Standard, Superior & Accessibile Disabili)
const bnbCamere = bnbEnvs.find((e) => e.id === "env-bnb-camere-ospiti")!;
assert.equal(bnbCamere.category, "public");
assert.equal(bnbCamere.surfaceSqM, 120);
assert.equal(bnbCamere.heightM, 2.7);
assert.equal(bnbCamere.volumeCuM, 324);
assert.equal(bnbCamere.occupantsCount, 12);
assert.equal(bnbCamere.windowSurfaceSqM, 18.0);
assert.equal(bnbCamere.features.emergencyLighting, true);
const compBnbCamere = evaluateEnvironmentCompliance(bnbCamere, "55.20.51");
assert.equal(compBnbCamere.isHeightCompliant, true);
assert.equal(compBnbCamere.isCubatureCompliant, true);
assert.equal(compBnbCamere.cpiActivityAlert, null, "Camere B&B con 12 posti letto (≤25) non devono essere assoggettate ad Attività 66 CPI");
assert.ok(
  compBnbCamere.summaryBadges.some((b) => b.text.includes("UNI EN 14604")),
  "Camere B&B devono includere badge rilevatori di fumo autonomi UNI EN 14604",
);
assert.ok(
  compBnbCamere.summaryBadges.some((b) => b.text.includes("aeroilluminante ≥ 1/8")),
  "Camere B&B devono includere badge aerazione naturale 1/8",
);
assert.ok(
  compBnbCamere.summaryBadges.some((b) => b.text.includes("D.Lgs. 81/08 Titolo VI")),
  "Camere B&B devono includere badge ergonomia rifacimento letti Titolo VI",
);

// 3. Servizi Igienici Privati & Bagno Disabili (D.P.R. 503/96)
const bnbBagni = bnbEnvs.find((e) => e.id === "env-bnb-bagni-privati")!;
assert.equal(bnbBagni.category, "services");
assert.equal(bnbBagni.surfaceSqM, 24);
assert.equal(bnbBagni.heightM, 2.4);
assert.equal(bnbBagni.volumeCuM, 57.6);
assert.equal(bnbBagni.occupantsCount, 2);
assert.equal(bnbBagni.windowSurfaceSqM, 3.0);
assert.equal(bnbBagni.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(bnbBagni.features.flooringCondition, "compliant_anti_slip");
assert.equal(bnbBagni.features.forcedExhaustPresent, true);
assert.equal(bnbBagni.features.forcedExhaustType, "blind_toilet_fan");
const compBnbBagni = evaluateEnvironmentCompliance(bnbBagni, "55.20.51");
assert.equal(compBnbBagni.isHeightCompliant, true);
assert.equal(compBnbBagni.isCubatureCompliant, true);
assert.ok(
  compBnbBagni.summaryBadges.some((b) => b.text.includes("D.P.R. 503/96") && b.text.includes("tirante allarme a campanello")),
  "Bagni B&B devono includere badge bagno accessibile D.P.R. 503/96 con tirante allarme",
);
assert.ok(
  compBnbBagni.summaryBadges.some((b) => b.text.includes("Legionella")),
  "Bagni B&B devono includere badge prevenzione Legionella soffioni doccia",
);

// 4. Area Colazioni, Zona Living & Tavoli Ospiti
const bnbSalaColazioni = bnbEnvs.find((e) => e.id === "env-bnb-sala-colazioni")!;
assert.equal(bnbSalaColazioni.category, "public");
assert.equal(bnbSalaColazioni.surfaceSqM, 35);
assert.equal(bnbSalaColazioni.heightM, 2.8);
assert.equal(bnbSalaColazioni.volumeCuM, 98);
assert.equal(bnbSalaColazioni.occupantsCount, 16);
assert.equal(bnbSalaColazioni.windowSurfaceSqM, 5.0);
assert.equal(bnbSalaColazioni.features.emergencyLighting, true);
const compBnbSalaColazioni = evaluateEnvironmentCompliance(bnbSalaColazioni, "55.20.51");
assert.equal(compBnbSalaColazioni.isHeightCompliant, true);
assert.ok(
  compBnbSalaColazioni.summaryBadges.some((b) => b.text.includes("MOCA") && b.text.includes("Reg. CE 1935/2004")),
  "Sala colazioni B&B deve includere badge buffet parafiato MOCA",
);
assert.ok(
  compBnbSalaColazioni.summaryBadges.some((b) => b.text.includes("Vie di esodo libere")),
  "Sala colazioni B&B deve includere badge vie di esodo libere ed estintore",
);

// 5. Kitchenette / Angolo Cottura, Scaldavivande & Office Colazioni
const bnbKitchenette = bnbEnvs.find((e) => e.id === "env-bnb-kitchenette-office")!;
assert.equal(bnbKitchenette.category, "production");
assert.equal(bnbKitchenette.surfaceSqM, 12);
assert.equal(bnbKitchenette.heightM, 2.7);
assert.equal(bnbKitchenette.volumeCuM, 32.4);
assert.equal(bnbKitchenette.occupantsCount, 2);
assert.equal(bnbKitchenette.windowSurfaceSqM, 2.0);
assert.equal(bnbKitchenette.features.forcedExhaustPresent, true);
assert.equal(bnbKitchenette.features.forcedExhaustType, "kitchen_hood");
assert.equal(bnbKitchenette.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(bnbKitchenette.features.flooringCondition, "compliant_anti_slip");
assert.equal(bnbKitchenette.features.insectScreens, true);
const compBnbKitchenette = evaluateEnvironmentCompliance(bnbKitchenette, "55.20.51");
assert.equal(compBnbKitchenette.isHeightCompliant, true);
assert.equal(compBnbKitchenette.isCubatureCompliant, true);
assert.ok(
  compBnbKitchenette.summaryBadges.some((b) => b.text.includes("termocoppia/induzione") && b.text.includes("cappa")),
  "Kitchenette B&B deve includere badge piano cottura a norma e cappa",
);
assert.ok(
  compBnbKitchenette.summaryBadges.some((b) => b.text.includes("+4°C") && b.text.includes("HACCP")),
  "Kitchenette B&B deve includere badge frigorifero +4°C HACCP",
);

// 6. Ripostiglio Guardaroba, Biancheria Pulita & Kit Cortesia
const bnbGuardaroba = bnbEnvs.find((e) => e.id === "env-bnb-guardaroba-biancheria")!;
assert.equal(bnbGuardaroba.category, "warehouse");
assert.equal(bnbGuardaroba.surfaceSqM, 10);
assert.equal(bnbGuardaroba.heightM, 2.6);
assert.equal(bnbGuardaroba.volumeCuM, 26);
assert.equal(bnbGuardaroba.occupantsCount, 1);
assert.equal(bnbGuardaroba.windowSurfaceSqM, 1.0);
assert.equal(bnbGuardaroba.features.shelvingCertified, true);
const compBnbGuardaroba = evaluateEnvironmentCompliance(bnbGuardaroba, "55.20.51");
assert.equal(compBnbGuardaroba.isHeightCompliant, true);
assert.equal(compBnbGuardaroba.isCubatureCompliant, true);
assert.ok(
  compBnbGuardaroba.summaryBadges.some((b) => b.text.includes("15 cm")),
  "Guardaroba B&B deve includere badge stoccaggio biancheria sollevata ≥ 15 cm",
);

// 7. Locale Lavanderia Interna, Stireria & Deposito Detergenti
const bnbLavanderia = bnbEnvs.find((e) => e.id === "env-bnb-lavanderia-office")!;
assert.equal(bnbLavanderia.category, "production");
assert.equal(bnbLavanderia.surfaceSqM, 12);
assert.equal(bnbLavanderia.heightM, 2.6);
assert.equal(bnbLavanderia.volumeCuM, 31.2);
assert.equal(bnbLavanderia.occupantsCount, 1);
assert.equal(bnbLavanderia.windowSurfaceSqM, 1.5);
assert.equal(bnbLavanderia.features.forcedExhaustPresent, true);
assert.equal(bnbLavanderia.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(bnbLavanderia.features.flooringCondition, "compliant_anti_slip");
const compBnbLavanderia = evaluateEnvironmentCompliance(bnbLavanderia, "55.20.51");
assert.equal(compBnbLavanderia.isHeightCompliant, true);
assert.equal(compBnbLavanderia.isCubatureCompliant, true);
assert.ok(
  compBnbLavanderia.summaryBadges.some((b) => b.text.includes("ciclo vapore igienizzante")),
  "Lavanderia B&B deve includere badge lavatrice ciclo vapore igienizzante",
);
assert.ok(
  compBnbLavanderia.summaryBadges.some((b) => b.text.includes("schede di sicurezza SDS")),
  "Lavanderia B&B deve includere badge armadietto detergenti SDS",
);

// 8. Vano Caldaia Murale & Boiler ACS
const bnbCaldaia = bnbEnvs.find((e) => e.id === "env-bnb-centrale-termica-boiler")!;
assert.equal(bnbCaldaia.category, "technical");
assert.equal(bnbCaldaia.surfaceSqM, 6);
assert.equal(bnbCaldaia.heightM, 2.5);
assert.equal(bnbCaldaia.volumeCuM, 15);
assert.equal(bnbCaldaia.occupantsCount, 1);
assert.equal(bnbCaldaia.windowSurfaceSqM, 0);
assert.equal(bnbCaldaia.features.emergencyLighting, true);
assert.equal(bnbCaldaia.features.gasLeakDetectorPresent, true);
const compBnbCaldaia = evaluateEnvironmentCompliance(bnbCaldaia, "55.20.51");
assert.equal(compBnbCaldaia.isHeightCompliant, true);
assert.equal(compBnbCaldaia.isCubatureCompliant, true);
assert.equal(compBnbCaldaia.cpiActivityAlert, null, "Caldaia murale B&B (<116 kW) non deve essere assoggettata ad Attività 74 CPI");
assert.ok(
  compBnbCaldaia.summaryBadges.some((b) => b.text.includes("55-60°C") && b.text.includes("Legionella")),
  "Centrale termica B&B deve includere badge temperatura ACS 55-60°C anti-legionella",
);
assert.ok(
  compBnbCaldaia.summaryBadges.some((b) => b.text.includes("D.M. 37/08")),
  "Centrale termica B&B deve includere badge caldaia a condensazione a norma D.M. 37/08",
);
assert.ok(
  compBnbCaldaia.summaryBadges.some((b) => b.text.includes("gas metano")),
  "Centrale termica B&B deve includere badge rilevatore gas metano",
);

// 9. Terrazzo, Balconi & Spazi all'Aperto
const bnbTerrazzo = bnbEnvs.find((e) => e.id === "env-bnb-terrazzo-balconi")!;
assert.equal(bnbTerrazzo.category, "public");
assert.equal(bnbTerrazzo.surfaceSqM, 25);
assert.equal(bnbTerrazzo.heightM, 2.8);
assert.equal(bnbTerrazzo.volumeCuM, 70);
assert.equal(bnbTerrazzo.occupantsCount, 8);
assert.equal(bnbTerrazzo.windowSurfaceSqM, 0);
assert.equal(bnbTerrazzo.features.emergencyLighting, true);
const compBnbTerrazzo = evaluateEnvironmentCompliance(bnbTerrazzo, "55.20.51");
assert.equal(compBnbTerrazzo.isHeightCompliant, true);
assert.ok(
  compBnbTerrazzo.summaryBadges.some((b) => b.text.includes("1,00 m")),
  "Terrazzo B&B deve includere badge parapetti h ≥ 1,00 m insuperabili",
);
assert.ok(
  compBnbTerrazzo.summaryBadges.some((b) => b.text.includes("R11")),
  "Terrazzo B&B deve includere badge pavimentazione antiscivolo R11",
);

// 10. Vano Scale, Corridoi di Distribuzione & Disimpegni Piani
const bnbScale = bnbEnvs.find((e) => e.id === "env-bnb-scale-disimpegni")!;
assert.equal(bnbScale.category, "public");
assert.equal(bnbScale.surfaceSqM, 25);
assert.equal(bnbScale.heightM, 2.7);
assert.equal(bnbScale.volumeCuM, 67.5);
assert.equal(bnbScale.occupantsCount, 2);
assert.equal(bnbScale.windowSurfaceSqM, 3.0);
assert.equal(bnbScale.features.emergencyLighting, true);
const compBnbScale = evaluateEnvironmentCompliance(bnbScale, "55.20.51");
assert.equal(compBnbScale.isHeightCompliant, true);
assert.equal(compBnbScale.isCubatureCompliant, true);
assert.ok(
  compBnbScale.summaryBadges.some((b) => b.text.includes("antisdrucciolo") && b.text.includes("corrimano continuo")),
  "Scale B&B devono includere badge gradini antisdrucciolo e corrimano continuo",
);
assert.ok(
  compBnbScale.summaryBadges.some((b) => b.text.includes("autonomia ≥ 1h")),
  "Scale B&B devono includere badge lampade di emergenza a led autonomia 1h",
);

// 11. Armadio / Ripostiglio Attrezzature Pulizie & Carrello Piani
const bnbHousekeeping = bnbEnvs.find((e) => e.id === "env-bnb-ripostiglio-housekeeping")!;
assert.equal(bnbHousekeeping.category, "storage");
assert.equal(bnbHousekeeping.surfaceSqM, 6);
assert.equal(bnbHousekeeping.heightM, 2.4);
assert.equal(bnbHousekeeping.volumeCuM, 14.4);
assert.equal(bnbHousekeeping.occupantsCount, 1);
assert.equal(bnbHousekeeping.windowSurfaceSqM, 0);
assert.equal(bnbHousekeeping.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(bnbHousekeeping.features.flooringCondition, "compliant_anti_slip");
const compBnbHousekeeping = evaluateEnvironmentCompliance(bnbHousekeeping, "55.20.51");
assert.equal(compBnbHousekeeping.isHeightCompliant, true);
assert.equal(compBnbHousekeeping.isCubatureCompliant, true);
assert.ok(
  compBnbHousekeeping.summaryBadges.some((b) => b.text.includes("HEPA") && b.text.includes("DPI")),
  "Ripostiglio pulizie B&B deve includere badge aspirapolvere HEPA e armadio DPI",
);

// 12. Zona Raccolta Differenziata Rifiuti & Stoccaggio Imballaggi
const bnbRifiuti = bnbEnvs.find((e) => e.id === "env-bnb-area-rifiuti-differenziata")!;
assert.equal(bnbRifiuti.category, "technical");
assert.equal(bnbRifiuti.surfaceSqM, 8);
assert.equal(bnbRifiuti.heightM, 2.4);
assert.equal(bnbRifiuti.volumeCuM, 19.2);
assert.equal(bnbRifiuti.occupantsCount, 1);
assert.equal(bnbRifiuti.windowSurfaceSqM, 0);
assert.equal(bnbRifiuti.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(bnbRifiuti.features.flooringCondition, "compliant_anti_slip");
const compBnbRifiuti = evaluateEnvironmentCompliance(bnbRifiuti, "55.20.51");
assert.equal(compBnbRifiuti.isHeightCompliant, true);
assert.equal(compBnbRifiuti.isCubatureCompliant, true);
assert.ok(
  compBnbRifiuti.summaryBadges.some((b) => b.text.includes("pedale") && b.text.includes("superficie lavabile")),
  "Area rifiuti B&B deve includere badge bidoni ermetici a pedale e superficie lavabile",
);

// ============================================================================
// Test 28: generateEnvironmentChecklistItems per locali B&B / Affittacamere (ATECO 55.20.51)
// ============================================================================
console.log("Test 28: generateEnvironmentChecklistItems per locali B&B / Affittacamere (ATECO 55.20.51)");

// 1. Ingresso e Reception
const bnbReceptionItems = generateEnvironmentChecklistItems(bnbReception, "55.20.51");
assert.ok(
  bnbReceptionItems.some(
    (it) => it.id.includes("estintore-13a-89b-dm-03-09-2021-minicodice") && it.domain === "safety",
  ),
  "Reception B&B deve verificare estintore 13A 89B a norma D.M. 03/09/2021 (domain: safety)",
);
assert.ok(
  bnbReceptionItems.some(
    (it) => it.id.includes("planimetria-esodo-bilingue-numeri-soccorso") && it.domain === "safety",
  ),
  "Reception B&B deve verificare planimetria bilingue con numeri emergenza 112 (domain: safety)",
);
assert.ok(
  bnbReceptionItems.some(
    (it) => it.id.includes("serratura-antipanico-smart-lock-illuminazione-emergenza") && it.domain === "safety",
  ),
  "Reception B&B deve verificare serratura antipanico/smart lock e illuminazione emergenza (domain: safety)",
);

// 2. Camere Ospiti
const bnbCamereItems = generateEnvironmentChecklistItems(bnbCamere, "55.20.51");
assert.ok(
  bnbCamereItems.some(
    (it) => it.id.includes("rilevatori-ottici-autonomi-fumo-uni-en-14604") && it.domain === "safety",
  ),
  "Camere B&B devono verificare rilevatori autonomi fumo UNI EN 14604 (domain: safety)",
);
assert.ok(
  bnbCamereItems.some(
    (it) => it.id.includes("aerazione-naturale-rapporto-aeroilluminante-finestre") && it.domain === "safety",
  ),
  "Camere B&B devono verificare rapporto aeroilluminante naturale 1/8 D.M. 05/07/1975 (domain: safety)",
);
assert.ok(
  bnbCamereItems.some(
    (it) => it.id.includes("ergonomia-rifacimento-letti-prevenzione-dms-housekeeping") && it.domain === "safety",
  ),
  "Camere B&B devono verificare ergonomia arredi e rifacimento letti D.Lgs. 81/08 Titolo VI (domain: safety)",
);
assert.ok(
  bnbCamereItems.some(
    (it) => it.id.includes("planimetria-fuga-retro-porta-istruzioni-emergenza") && it.domain === "safety",
  ),
  "Camere B&B devono verificare planimetria fuga sul retro della porta (domain: safety)",
);

// 3. Bagni Privati & Bagno Disabili
const bnbBagniItems = generateEnvironmentChecklistItems(bnbBagni, "55.20.51");
assert.ok(
  bnbBagniItems.some(
    (it) => it.id.includes("bagno-disabili-tirante-campanello-maniglioni-dpr-503-96") && it.domain === "both",
  ),
  "Bagno disabili B&B deve verificare tirante allarme campanello e maniglioni D.P.R. 503/96 (domain: both)",
);
assert.ok(
  bnbBagniItems.some(
    (it) => it.id.includes("prevenzione-legionella-soffioni-doccia-anticalcare-flussaggio") && it.domain === "both",
  ),
  "Bagni B&B devono verificare prevenzione legionella soffioni doccia Accordo 07/05/2015 e D.Lgs. 18/2023 (domain: both)",
);
assert.ok(
  bnbBagniItems.some(
    (it) => it.id.includes("pavimentazione-antiscivolo-aerazione-forzata-temporizzata") && it.domain === "safety",
  ),
  "Bagni B&B devono verificare pavimento antiscivolo e aerazione forzata temporizzata (domain: safety)",
);

// 4. Area Colazioni & Living
const bnbSalaColazioniItems = generateEnvironmentChecklistItems(bnbSalaColazioni, "55.20.51");
assert.ok(
  bnbSalaColazioniItems.some(
    (it) => it.id.includes("buffet-parafiato-moca-reg-ce-1935-2004-igiene") && it.domain === "haccp",
  ),
  "Sala colazioni B&B deve verificare buffet parafiato MOCA Reg. CE 1935/2004 (domain: haccp)",
);
assert.ok(
  bnbSalaColazioniItems.some(
    (it) => it.id.includes("cartello-allergeni-prodotti-colazione-reg-ue-1169-2011") && it.domain === "both",
  ),
  "Sala colazioni B&B deve verificare cartello allergeni Reg. UE 1169/2011 (domain: both)",
);
assert.ok(
  bnbSalaColazioniItems.some(
    (it) => it.id.includes("vie-esodo-sala-sgombre-estintore-adiacente") && it.domain === "safety",
  ),
  "Sala colazioni B&B deve verificare vie di esodo libere ed estintore adiacente (domain: safety)",
);

// 5. Kitchenette / Angolo Cottura & Office
const bnbKitchenetteItems = generateEnvironmentChecklistItems(bnbKitchenette, "55.20.51");
assert.ok(
  bnbKitchenetteItems.some(
    (it) => it.id.includes("cappa-aspirazione-canna-fumaria-pareti-lavabili") && it.domain === "both",
  ),
  "Kitchenette B&B deve verificare cappa aspirante e pareti lavabili Reg. CE 852/2004 (domain: both)",
);
assert.ok(
  bnbKitchenetteItems.some(
    (it) => it.id.includes("frigorifero-termometro-lettura-esterna-4c-haccp") && it.domain === "haccp",
  ),
  "Kitchenette B&B deve verificare frigorifero a +4°C con monitoraggio HACCP (domain: haccp)",
);
assert.ok(
  bnbKitchenetteItems.some(
    (it) => it.id.includes("piano-cottura-sicurezza-termocoppia-induzione-dm-37-08") && it.domain === "safety",
  ),
  "Kitchenette B&B deve verificare piano cottura con termocoppia/induzione D.M. 37/08 (domain: safety)",
);
assert.ok(
  bnbKitchenetteItems.some(
    (it) => it.id.includes("lavastoviglie-ciclo-termico-igienizzante-stoviglie-moca") && it.domain === "both",
  ),
  "Kitchenette B&B deve verificare lavastoviglie igienizzante e stoviglie MOCA (domain: both)",
);

// 6. Ripostiglio Guardaroba Biancheria
const bnbGuardarobaItems = generateEnvironmentChecklistItems(bnbGuardaroba, "55.20.51");
assert.ok(
  bnbGuardarobaItems.some(
    (it) => it.id.includes("stoccaggio-biancheria-pulita-armadi-chiusi-sollevati-15cm") && it.domain === "both",
  ),
  "Guardaroba B&B deve verificare stoccaggio biancheria sollevata 15 cm da terra (domain: both)",
);
assert.ok(
  bnbGuardarobaItems.some(
    (it) => it.id.includes("scaffalature-stabili-fissaggio-parete-antiribaltamento") && it.domain === "safety",
  ),
  "Guardaroba B&B deve verificare stabilità scaffalature e staffaggio antiribaltamento D.Lgs. 81/08 (domain: safety)",
);

// 7. Lavanderia e Stireria
const bnbLavanderiaItems = generateEnvironmentChecklistItems(bnbLavanderia, "55.20.51");
assert.ok(
  bnbLavanderiaItems.some(
    (it) => it.id.includes("armadietto-chiuso-detergenti-sds-etichettatura-clp") && it.domain === "safety",
  ),
  "Lavanderia B&B deve verificare armadietto chiuso per detergenti con SDS Titolo IX (domain: safety)",
);
assert.ok(
  bnbLavanderiaItems.some(
    (it) => it.id.includes("sicurezza-elettrica-lavatrice-asciugatrice-ferro-stiro") && it.domain === "safety",
  ),
  "Lavanderia B&B deve verificare sicurezza elettrica elettrodomestici D.M. 37/08 (domain: safety)",
);

// 8. Centrale Termica & Boiler ACS
const bnbCaldaiaItems = generateEnvironmentChecklistItems(bnbCaldaia, "55.20.51");
assert.ok(
  bnbCaldaiaItems.some(
    (it) => it.id.includes("temperatura-accumulo-boiler-acs-55-60c-legionella") && it.domain === "both",
  ),
  "Centrale termica B&B deve verificare boiler ACS ≥ 55-60°C contro Legionella Accordo 07/05/2015 (domain: both)",
);
assert.ok(
  bnbCaldaiaItems.some(
    (it) => it.id.includes("caldaia-condensazione-libretto-impianto-scarico-fumi-dm-37-08") && it.domain === "safety",
  ),
  "Centrale termica B&B deve verificare caldaia a condensazione, libretto impianto e scarico fumi D.M. 37/08 (domain: safety)",
);
assert.ok(
  bnbCaldaiaItems.some(
    (it) => it.id.includes("rilevatore-gas-valvola-sicurezza-scarico-convogliato") && it.domain === "safety",
  ),
  "Centrale termica B&B deve verificare rilevatore fughe gas e valvola di sicurezza convogliata (domain: safety)",
);

// 9. Terrazzo e Balconi
const bnbTerrazzoItems = generateEnvironmentChecklistItems(bnbTerrazzo, "55.20.51");
assert.ok(
  bnbTerrazzoItems.some(
    (it) => it.id.includes("parapetti-ringhiere-altezza-100cm-inscalabili") && it.domain === "safety",
  ),
  "Terrazzo B&B deve verificare parapetti h ≥ 1,00 m inscalabili D.M. 236/89 (domain: safety)",
);
assert.ok(
  bnbTerrazzoItems.some(
    (it) => it.id.includes("pavimentazione-esterna-antiscivolo-r11-illuminazione") && it.domain === "safety",
  ),
  "Terrazzo B&B deve verificare pavimentazione esterna antiscivolo R11 (domain: safety)",
);

// 10. Scale e Disimpegni
const bnbScaleItems = generateEnvironmentChecklistItems(bnbScale, "55.20.51");
assert.ok(
  bnbScaleItems.some(
    (it) => it.id.includes("gradini-antisdrucciolo-corrimano-continuo-vie-esodo") && it.domain === "safety",
  ),
  "Scale B&B devono verificare gradini antisdrucciolo e corrimano continuo D.Lgs. 81/08 All. IV (domain: safety)",
);
assert.ok(
  bnbScaleItems.some(
    (it) => it.id.includes("luci-emergenza-led-autonomia-1h-accensione-automatica") && it.domain === "safety",
  ),
  "Scale B&B devono verificare illuminazione emergenza led autonomia 1h UNI EN 1838 (domain: safety)",
);

// 11. Ripostiglio Housekeeping
const bnbHousekeepingItems = generateEnvironmentChecklistItems(bnbHousekeeping, "55.20.51");
assert.ok(
  bnbHousekeepingItems.some(
    (it) => it.id.includes("attrezzature-pulizia-aspirapolvere-hepa-mop-separati") && it.domain === "both",
  ),
  "Ripostiglio housekeeping B&B deve verificare aspirapolvere HEPA e mop separati per ambienti (domain: both)",
);
assert.ok(
  bnbHousekeepingItems.some(
    (it) => it.id.includes("dotazione-dpi-operatori-pulizie-guanti-mascherine") && it.domain === "safety",
  ),
  "Ripostiglio housekeeping B&B deve verificare dotazione DPI per addetti pulizie D.Lgs. 81/08 art. 77 (domain: safety)",
);

// 12. Area Rifiuti Differenziata
const bnbRifiutiItems = generateEnvironmentChecklistItems(bnbRifiuti, "55.20.51");
assert.ok(
  bnbRifiutiItems.some(
    (it) => it.id.includes("bidoni-raccolta-differenziata-coperchio-pedale-ermetici") && it.domain === "both",
  ),
  "Area rifiuti B&B deve verificare bidoni differenziata con coperchio a pedale ermetico (domain: both)",
);
assert.ok(
  bnbRifiutiItems.some(
    (it) => it.id.includes("pavimentazione-lavabile-pulizia-periodica-lotta-infestanti") && it.domain === "both",
  ),
  "Area rifiuti B&B deve verificare pavimentazione lavabile e protezione infestanti Reg. CE 852/2004 (domain: both)",
);

// Verifica del filtraggio checklistMode su kitchenette B&B
const bnbKitchenetteHaccpMode = filterEnvironmentItemsByChecklistMode(bnbKitchenetteItems, "haccp_only");
assert.ok(
  bnbKitchenetteHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item kitchenette B&B devono essere haccp o both",
);
assert.ok(
  !bnbKitchenetteHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item kitchenette B&B deve avere domain safety",
);

const bnbKitchenetteSafetyMode = filterEnvironmentItemsByChecklistMode(bnbKitchenetteItems, "safety_only");
assert.ok(
  bnbKitchenetteSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item kitchenette B&B devono essere safety o both",
);
assert.ok(
  !bnbKitchenetteSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item kitchenette B&B deve avere domain haccp",
);

// ============================================================================
// 12. Test Ostello, Residence, Case per Ferie, Alloggi per Studenti e Turisti
// ATECO 55.20.20 (o 55.20.2 / 552020 / 55202)
// ============================================================================
console.log("Test 29: getStandardEnvironmentsForAteco & conformità per Ostello / Residence (55.20.20 / 55.20.2 / 552020 / 55202)");

const ostEnvs = getStandardEnvironmentsForAteco("55.20.20");
assert.equal(ostEnvs.length, 12, "L'Ostello / Residence deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO (55.20.2, 552020, 55202)
const ostEnvsVar1 = getStandardEnvironmentsForAteco("55.20.2");
assert.equal(ostEnvsVar1.length, 12, "Anche prefisso 55.20.2 deve restituire 12 ambienti Ostello");
const ostEnvsVar2 = getStandardEnvironmentsForAteco("552020");
assert.equal(ostEnvsVar2.length, 12, "Anche codice numerico 552020 deve restituire 12 ambienti Ostello");
const ostEnvsVar3 = getStandardEnvironmentsForAteco("55202");
assert.equal(ostEnvsVar3.length, 12, "Anche codice numerico 55202 deve restituire 12 ambienti Ostello");

// Verifica ID dei 12 ambienti standard Ostello / Residence
const expectedOstIds = [
  "env-ost-reception-lounge",
  "env-ost-dormitori-camerate",
  "env-ost-camere-private",
  "env-ost-servizi-igienici-comuni",
  "env-ost-cucina-condivisa",
  "env-ost-dispensa-frigo-ospiti",
  "env-ost-lavanderia-self",
  "env-ost-deposito-housekeeping",
  "env-ost-deposito-bagagli",
  "env-ost-centrale-termica-acs",
  "env-ost-corridoi-scale-esodo",
  "env-ost-area-rifiuti",
];

for (const id of expectedOstIds) {
  assert.ok(
    ostEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard Ostello per 55.20.20`,
  );
}

// 1. Reception, Desk Accoglienza H24 & Lounge Sociale
const ostReception = ostEnvs.find((e) => e.id === "env-ost-reception-lounge")!;
assert.equal(ostReception.category, "sales_office");
assert.equal(ostReception.surfaceSqM, 60);
assert.equal(ostReception.heightM, 3.0);
assert.equal(ostReception.volumeCuM, 180);
assert.equal(ostReception.occupantsCount, 3);
assert.equal(ostReception.windowSurfaceSqM, 8.0);
assert.equal(ostReception.features.emergencyLighting, true);
const compOstReception = evaluateEnvironmentCompliance(ostReception, "55.20.20");
assert.equal(compOstReception.isHeightCompliant, true);
assert.equal(compOstReception.isCubatureCompliant, true);
assert.ok(
  compOstReception.summaryBadges.some((b) => b.text.includes("VDT ergonomica") && b.text.includes("30 mA")),
  "Reception Ostello deve includere badge VDT ergonomica e differenziale 30 mA",
);
assert.ok(
  compOstReception.summaryBadges.some((b) => b.text.includes("34A 233B") && b.text.toLowerCase().includes("planimetria di esodo bilingue")),
  "Reception Ostello deve includere badge estintore 34A 233B e planimetria bilingue",
);

// 2. Dormitori Comuni & Camerate a Letti a Castello
const ostDormitori = ostEnvs.find((e) => e.id === "env-ost-dormitori-camerate")!;
assert.equal(ostDormitori.category, "production");
assert.equal(ostDormitori.surfaceSqM, 80);
assert.equal(ostDormitori.heightM, 2.7);
assert.equal(ostDormitori.volumeCuM, 216);
assert.equal(ostDormitori.occupantsCount, 16);
assert.equal(ostDormitori.windowSurfaceSqM, 10.0);
assert.equal(ostDormitori.features.emergencyLighting, true);
const compOstDormitori = evaluateEnvironmentCompliance(ostDormitori, "55.20.20");
assert.equal(compOstDormitori.isHeightCompliant, true);
assert.equal(compOstDormitori.isCubatureCompliant, true);
assert.ok(
  compOstDormitori.summaryBadges.some((b) => b.text.includes("UNI EN 747") && b.text.includes("spondine anticaduta")),
  "Dormitori Ostello devono verificare letti a castello UNI EN 747 con spondine anticaduta",
);
assert.ok(
  compOstDormitori.summaryBadges.some((b) => b.text.includes("UNI EN 54")),
  "Dormitori Ostello devono verificare rilevatori fumo indirizzati UNI EN 54",
);
assert.ok(
  compOstDormitori.summaryBadges.some((b) => b.text.includes("Armadietti metallici individuali")),
  "Dormitori Ostello devono verificare armadietti metallici individuali",
);

// 3. Camere Private / Monolocali Residence con Bagno Esclusivo
const ostCamerePrivate = ostEnvs.find((e) => e.id === "env-ost-camere-private")!;
assert.equal(ostCamerePrivate.category, "production");
assert.equal(ostCamerePrivate.surfaceSqM, 50);
assert.equal(ostCamerePrivate.heightM, 2.7);
assert.equal(ostCamerePrivate.volumeCuM, 135);
assert.equal(ostCamerePrivate.occupantsCount, 6);
assert.equal(ostCamerePrivate.windowSurfaceSqM, 6.0);
assert.equal(ostCamerePrivate.features.emergencyLighting, true);
const compOstCamere = evaluateEnvironmentCompliance(ostCamerePrivate, "55.20.20");
assert.equal(compOstCamere.isHeightCompliant, true);
assert.equal(compOstCamere.isCubatureCompliant, true);
assert.ok(
  compOstCamere.summaryBadges.some((b) => b.text.includes("D.P.R. 503/96") && b.text.includes("D.M. 236/89")),
  "Camere private Ostello devono verificare accessibilità disabili PMR",
);
assert.ok(
  compOstCamere.summaryBadges.some((b) => b.text.includes("Porte tagliafuoco EI 30")),
  "Camere private Ostello devono verificare porte EI 30 con chiudiporta",
);

// 4. Blocco Servizi Igienici & Docce Multiple Comuni
const ostServiziIgienici = ostEnvs.find((e) => e.id === "env-ost-servizi-igienici-comuni")!;
assert.equal(ostServiziIgienici.category, "services");
assert.equal(ostServiziIgienici.surfaceSqM, 45);
assert.equal(ostServiziIgienici.heightM, 2.4);
assert.equal(ostServiziIgienici.volumeCuM, 108);
assert.equal(ostServiziIgienici.occupantsCount, 6);
assert.equal(ostServiziIgienici.windowSurfaceSqM, 4.5);
assert.equal(ostServiziIgienici.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ostServiziIgienici.features.flooringCondition, "compliant_anti_slip");
assert.equal(ostServiziIgienici.features.forcedExhaustPresent, true);
assert.equal(ostServiziIgienici.features.forcedExhaustType, "blind_toilet_fan");
const compOstBagni = evaluateEnvironmentCompliance(ostServiziIgienici, "55.20.20");
assert.equal(compOstBagni.isHeightCompliant, true);
assert.ok(
  compOstBagni.summaryBadges.some((b) => b.text.includes("R11") && b.text.includes("canaline sifonate")),
  "Bagni comuni Ostello devono verificare piatto doccia R11 e canaline sifonate",
);
assert.ok(
  compOstBagni.summaryBadges.some((b) => b.text.includes("Legionella") && b.text.includes("D.Lgs. 18/2023")),
  "Bagni comuni Ostello devono verificare prevenzione legionella soffioni doccia D.Lgs. 18/2023",
);

// 5. Cucina Comune Condivisa per Ospiti (Self-Catering) & Zona Pranzo
const ostCucina = ostEnvs.find((e) => e.id === "env-ost-cucina-condivisa")!;
assert.equal(ostCucina.category, "production");
assert.equal(ostCucina.surfaceSqM, 40);
assert.equal(ostCucina.heightM, 3.0);
assert.equal(ostCucina.volumeCuM, 120);
assert.equal(ostCucina.occupantsCount, 8);
assert.equal(ostCucina.windowSurfaceSqM, 5.0);
assert.equal(ostCucina.features.forcedExhaustPresent, true);
assert.equal(ostCucina.features.forcedExhaustType, "kitchen_hood");
assert.equal(ostCucina.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ostCucina.features.flooringCondition, "compliant_anti_slip");
assert.equal(ostCucina.features.insectScreens, true);
assert.equal(ostCucina.features.microclimateCompliant, true);
const compOstCucina = evaluateEnvironmentCompliance(ostCucina, "55.20.20");
assert.equal(compOstCucina.isHeightCompliant, true);
assert.ok(
  compOstCucina.summaryBadges.some((b) => b.text.includes("induzione") && b.text.includes("filtri labirinto inox")),
  "Cucina Ostello deve verificare induzione e cappa con filtri labirinto inox",
);
assert.ok(
  compOstCucina.summaryBadges.some((b) => b.text.includes("classe F") && b.text.includes("coperta antifiamma")),
  "Cucina Ostello deve verificare estintore classe F e coperta antifiamma",
);

// 6. Dispensa Comune & Frigoriferi Condivisi per Ospiti
const ostDispensaFrigo = ostEnvs.find((e) => e.id === "env-ost-dispensa-frigo-ospiti")!;
assert.equal(ostDispensaFrigo.category, "storage");
assert.equal(ostDispensaFrigo.surfaceSqM, 20);
assert.equal(ostDispensaFrigo.heightM, 2.6);
assert.equal(ostDispensaFrigo.volumeCuM, 52);
assert.equal(ostDispensaFrigo.occupantsCount, 2);
assert.equal(ostDispensaFrigo.windowSurfaceSqM, 2.0);
assert.equal(ostDispensaFrigo.features.emergencyLighting, true);
assert.equal(ostDispensaFrigo.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ostDispensaFrigo.features.flooringCondition, "compliant_anti_slip");
const compOstDispensa = evaluateEnvironmentCompliance(ostDispensaFrigo, "55.20.20");
assert.equal(compOstDispensa.isHeightCompliant, true);
assert.ok(
  compOstDispensa.summaryBadges.some((b) => b.text.includes("Frigoriferi ventilati") && b.text.includes("HACCP")),
  "Dispensa Ostello deve verificare frigoriferi ventilati con teletermometri HACCP",
);
assert.ok(
  compOstDispensa.summaryBadges.some((b) => b.text.includes("etichettatura alimenti")),
  "Dispensa Ostello deve verificare etichettatura per nome e check-out alimenti",
);

// 7. Lavanderia Self-Service per Ospiti a Gettoni/App & Locale Stireria
const ostLavanderia = ostEnvs.find((e) => e.id === "env-ost-lavanderia-self")!;
assert.equal(ostLavanderia.category, "services");
assert.equal(ostLavanderia.surfaceSqM, 25);
assert.equal(ostLavanderia.heightM, 2.5);
assert.equal(ostLavanderia.volumeCuM, 62.5);
assert.equal(ostLavanderia.occupantsCount, 3);
assert.equal(ostLavanderia.windowSurfaceSqM, 2.5);
assert.equal(ostLavanderia.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ostLavanderia.features.flooringCondition, "compliant_anti_slip");
assert.equal(ostLavanderia.features.forcedExhaustPresent, true);
const compOstLavanderia = evaluateEnvironmentCompliance(ostLavanderia, "55.20.20");
assert.equal(compOstLavanderia.isHeightCompliant, true);
assert.ok(
  compOstLavanderia.summaryBadges.some((b) => b.text.includes("UNI EN ISO 10472") && b.text.includes("blocco oblò")),
  "Lavanderia Ostello deve verificare blocco oblò UNI EN ISO 10472",
);
assert.ok(
  compOstLavanderia.summaryBadges.some((b) => b.text.includes("filtri lanugine") && b.text.includes("D.M. 02/09/2021")),
  "Lavanderia Ostello deve verificare pulizia filtri lanugine essiccatori D.M. 02/09/2021",
);

// 8. Guardaroba Biancheria, Deposito Housekeeping & Prodotti Pulizia
const ostHousekeeping = ostEnvs.find((e) => e.id === "env-ost-deposito-housekeeping")!;
assert.equal(ostHousekeeping.category, "warehouse");
assert.equal(ostHousekeeping.surfaceSqM, 20);
assert.equal(ostHousekeeping.heightM, 2.5);
assert.equal(ostHousekeeping.volumeCuM, 50);
assert.equal(ostHousekeeping.occupantsCount, 2);
assert.equal(ostHousekeeping.windowSurfaceSqM, 2.0);
assert.equal(ostHousekeeping.features.shelvingCertified, true);
const compOstHousekeeping = evaluateEnvironmentCompliance(ostHousekeeping, "55.20.20");
assert.equal(compOstHousekeeping.isHeightCompliant, true);
assert.ok(
  compOstHousekeeping.summaryBadges.some((b) => b.text.includes("15 cm")),
  "Housekeeping Ostello deve verificare scaffalature rialzate 15 cm per biancheria pulita",
);
assert.ok(
  compOstHousekeeping.summaryBadges.some((b) => b.text.includes("detergenti concentrati") && b.text.includes("Titolo IX")),
  "Housekeeping Ostello deve verificare armadio chiuso a chiave per detergenti con SDS",
);

// 9. Locale Deposito Bagagli Ospiti Custodito & Lockers Elettronici
const ostDepositoBagagli = ostEnvs.find((e) => e.id === "env-ost-deposito-bagagli")!;
assert.equal(ostDepositoBagagli.category, "storage");
assert.equal(ostDepositoBagagli.surfaceSqM, 20);
assert.equal(ostDepositoBagagli.heightM, 2.7);
assert.equal(ostDepositoBagagli.volumeCuM, 54);
assert.equal(ostDepositoBagagli.occupantsCount, 2);
assert.equal(ostDepositoBagagli.windowSurfaceSqM, 0);
assert.equal(ostDepositoBagagli.features.emergencyLighting, true);
const compOstBagagli = evaluateEnvironmentCompliance(ostDepositoBagagli, "55.20.20");
assert.equal(compOstBagagli.isHeightCompliant, true);
assert.ok(
  compOstBagagli.summaryBadges.some((b) => b.text.includes("Lockers automatizzati") && b.text.includes("bordo anticaduta")),
  "Deposito bagagli Ostello deve verificare lockers e scaffali con bordo anticaduta",
);

// 10. Centrale Termica / Impianto Riscaldamento & Produzione ACS Anti-Legionella
const ostCentraleTermica = ostEnvs.find((e) => e.id === "env-ost-centrale-termica-acs")!;
assert.equal(ostCentraleTermica.category, "technical");
assert.equal(ostCentraleTermica.surfaceSqM, 18);
assert.equal(ostCentraleTermica.heightM, 2.6);
assert.equal(ostCentraleTermica.volumeCuM, 46.8);
assert.equal(ostCentraleTermica.occupantsCount, 1);
assert.equal(ostCentraleTermica.windowSurfaceSqM, 0);
assert.equal(ostCentraleTermica.features.emergencyLighting, true);
const compOstTermica = evaluateEnvironmentCompliance(ostCentraleTermica, "55.20.20");
assert.equal(compOstTermica.isHeightCompliant, true);
assert.ok(
  compOstTermica.summaryBadges.some((b) => b.text.includes("60°C") && b.text.includes("50°C")),
  "Centrale termica Ostello deve verificare temperatura ACS ≥ 60°C e ricircolo ≥ 50°C",
);
assert.ok(
  compOstTermica.summaryBadges.some((b) => b.text.includes("Registro aziendale Legionella")),
  "Centrale termica Ostello deve verificare Registro Legionella e campionamenti",
);
assert.ok(
  compOstTermica.summaryBadges.some((b) => b.text.includes("INAIL") && b.text.includes("PED")),
  "Centrale termica Ostello deve verificare valvole INAIL e vasi PED",
);

// 11. Corridoi ai Piani, Vano Scale Antincendio & Uscite di Emergenza
const ostCorridoiScale = ostEnvs.find((e) => e.id === "env-ost-corridoi-scale-esodo")!;
assert.equal(ostCorridoiScale.category, "services");
assert.equal(ostCorridoiScale.surfaceSqM, 90);
assert.equal(ostCorridoiScale.heightM, 2.7);
assert.equal(ostCorridoiScale.volumeCuM, 243);
assert.equal(ostCorridoiScale.occupantsCount, 15);
assert.equal(ostCorridoiScale.windowSurfaceSqM, 8.0);
assert.equal(ostCorridoiScale.features.emergencyLighting, true);
const compOstCorridoi = evaluateEnvironmentCompliance(ostCorridoiScale, "55.20.20");
assert.equal(compOstCorridoi.isHeightCompliant, true);
assert.ok(
  compOstCorridoi.summaryBadges.some((b) => b.text.includes("1,20 m") && b.text.includes("UNI EN 1125")),
  "Corridoi Ostello devono verificare vie di fuga sgombre ≥ 1,20 m e maniglioni antipanico",
);
assert.ok(
  compOstCorridoi.summaryBadges.some((b) => b.text.includes("Porte tagliafuoco EI 30 / EI 60") && b.text.includes("chiudiporta idraulico")),
  "Scale Ostello devono verificare porte tagliafuoco EI con chiudiporta D.M. 09/04/1994",
);
assert.ok(
  compOstCorridoi.summaryBadges.some((b) => b.text.includes("5 lux")),
  "Scale Ostello devono verificare illuminazione emergenza ≥ 5 lux",
);

// 12. Locale / Area Esterna Differenziata & Compattatore Rifiuti
const ostAreaRifiuti = ostEnvs.find((e) => e.id === "env-ost-area-rifiuti")!;
assert.equal(ostAreaRifiuti.category, "technical");
assert.equal(ostAreaRifiuti.surfaceSqM, 15);
assert.equal(ostAreaRifiuti.heightM, 2.4);
assert.equal(ostAreaRifiuti.volumeCuM, 36);
assert.equal(ostAreaRifiuti.occupantsCount, 1);
assert.equal(ostAreaRifiuti.windowSurfaceSqM, 0);
assert.equal(ostAreaRifiuti.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(ostAreaRifiuti.features.flooringCondition, "compliant_anti_slip");
const compOstRifiuti = evaluateEnvironmentCompliance(ostAreaRifiuti, "55.20.20");
assert.equal(compOstRifiuti.isHeightCompliant, true);
assert.ok(
  compOstRifiuti.summaryBadges.some((b) => b.text.includes("Bidoni carrellati a tenuta") && b.text.includes("compattatore")),
  "Area rifiuti Ostello deve verificare bidoni carrellati ermetici e compattatore",
);
assert.ok(
  compOstRifiuti.summaryBadges.some((b) => b.text.includes("griglia sifonata") && b.text.includes("derattizzazione")),
  "Area rifiuti Ostello deve verificare pavimentazione lavabile con griglia sifonata e derattizzazione",
);

// ============================================================================
// Test 30: generateEnvironmentChecklistItems per locali Ostello / Residence (ATECO 55.20.20)
// ============================================================================
console.log("Test 30: generateEnvironmentChecklistItems per locali Ostello / Residence (ATECO 55.20.20)");

// 1. Reception, Desk Accoglienza H24 & Lounge Sociale
const ostReceptionItems = generateEnvironmentChecklistItems(ostReception, "55.20.20");
assert.ok(
  ostReceptionItems.some(
    (it) => it.id.includes("postazione-vdt-ergonomica-quadro-differenziale-30ma") && it.domain === "safety",
  ),
  "Reception Ostello deve verificare postazione VDT ergonomica e differenziale 30 mA (domain: safety)",
);
assert.ok(
  ostReceptionItems.some(
    (it) => it.id.includes("estintore-34a-233b-planimetria-esodo-bilingue-112") && it.domain === "safety",
  ),
  "Reception Ostello deve verificare estintore 34A 233B e planimetria bilingue 112 (domain: safety)",
);
assert.ok(
  ostReceptionItems.some(
    (it) => it.id.includes("videosorveglianza-privacy-cassette-sicurezza-gdpr") && it.domain === "safety",
  ),
  "Reception Ostello deve verificare videosorveglianza GDPR e cassette sicurezza (domain: safety)",
);

// 2. Dormitori Comuni & Camerate a Letti a Castello
const ostDormitoriItems = generateEnvironmentChecklistItems(ostDormitori, "55.20.20");
assert.ok(
  ostDormitoriItems.some(
    (it) => it.id.includes("letti-castello-spondine-scalette-uni-en-747") && it.domain === "safety",
  ),
  "Dormitori Ostello devono verificare letti a castello UNI EN 747 con spondine e scalette (domain: safety)",
);
assert.ok(
  ostDormitoriItems.some(
    (it) => it.id.includes("rilevatori-ottici-fumo-indirizzati-uni-en-54") && it.domain === "safety",
  ),
  "Dormitori Ostello devono verificare rilevatori fumo indirizzati UNI EN 54 (domain: safety)",
);
assert.ok(
  ostDormitoriItems.some(
    (it) => it.id.includes("planimetria-esodo-bilingue-retro-porta-istruzioni") && it.domain === "safety",
  ),
  "Dormitori Ostello devono verificare planimetria di esodo bilingue su retro porta (domain: safety)",
);
assert.ok(
  ostDormitoriItems.some(
    (it) => it.id.includes("armadietti-individuali-serratura-prese-protette") && it.domain === "both",
  ),
  "Dormitori Ostello devono verificare armadietti individuali con serratura e prese protette (domain: both)",
);

// 3. Camere Private / Monolocali Residence con Bagno Esclusivo
const ostCamerePrivateItems = generateEnvironmentChecklistItems(ostCamerePrivate, "55.20.20");
assert.ok(
  ostCamerePrivateItems.some(
    (it) => it.id.includes("camere-disabili-pmr-porte-manovra-dpr-503-96") && it.domain === "both",
  ),
  "Camere private Ostello devono verificare accessibilità disabili PMR D.P.R. 503/96 (domain: both)",
);
assert.ok(
  ostCamerePrivateItems.some(
    (it) => it.id.includes("campanello-allarme-tirante-bagno-privato-soccorso") && it.domain === "safety",
  ),
  "Camere private Ostello devono verificare campanello a tirante nel bagno (domain: safety)",
);
assert.ok(
  ostCamerePrivateItems.some(
    (it) => it.id.includes("porte-tagliafuoco-ei30-chiudiporta-dm-09-04-1994") && it.domain === "safety",
  ),
  "Camere private Ostello devono verificare porte tagliafuoco EI 30 con chiudiporta (domain: safety)",
);

// 4. Blocco Servizi Igienici & Docce Multiple Comuni
const ostServiziIgieniciItems = generateEnvironmentChecklistItems(ostServiziIgienici, "55.20.20");
assert.ok(
  ostServiziIgieniciItems.some(
    (it) => it.id.includes("disinfezione-soffioni-doccia-legionella-dlgs-18-2023") && it.domain === "both",
  ),
  "Bagni comuni Ostello devono verificare disinfezione soffioni e prevenzione legionella D.Lgs. 18/2023 (domain: both)",
);
assert.ok(
  ostServiziIgieniciItems.some(
    (it) => it.id.includes("piatti-doccia-pavimento-antiscivolo-r11-canaline-sifonate") && it.domain === "safety",
  ),
  "Bagni comuni Ostello devono verificare pavimentazione antiscivolo R11 e canaline sifonate (domain: safety)",
);
assert.ok(
  ostServiziIgieniciItems.some(
    (it) => it.id.includes("tirante-allarme-bagno-disabili-pmr-suoneria-esterna") && it.domain === "safety",
  ),
  "Bagni comuni Ostello devono verificare tirante allarme bagno disabili PMR con suoneria (domain: safety)",
);
assert.ok(
  ostServiziIgieniciItems.some(
    (it) => it.id.includes("antibagno-lavamani-sapone-asciugamani-aria-carta") && it.domain === "both",
  ),
  "Bagni comuni Ostello devono verificare antibagno con lavamani e asciugamani igienici (domain: both)",
);

// 5. Cucina Comune Condivisa per Ospiti (Self-Catering) & Zona Pranzo
const ostCucinaItems = generateEnvironmentChecklistItems(ostCucina, "55.20.20");
assert.ok(
  ostCucinaItems.some(
    (it) => it.id.includes("cappa-aspirazione-filtri-labirinto-inox-manutenzione") && it.domain === "both",
  ),
  "Cucina Ostello deve verificare cappa aspirante con filtri labirinto inox (domain: both)",
);
assert.ok(
  ostCucinaItems.some(
    (it) => it.id.includes("piani-induzione-spegnimento-automatico-sicurezza") && it.domain === "safety",
  ),
  "Cucina Ostello deve verificare piani a induzione con autospegnimento (domain: safety)",
);
assert.ok(
  ostCucinaItems.some(
    (it) => it.id.includes("estintore-classe-f-coperta-antifiamma-immediata") && it.domain === "safety",
  ),
  "Cucina Ostello deve verificare estintore classe F e coperta antifiamma (domain: safety)",
);
assert.ok(
  ostCucinaItems.some(
    (it) => it.id.includes("igienizzazione-superfici-moca-reg-ce-1935-2004") && it.domain === "haccp",
  ),
  "Cucina Ostello deve verificare sanificazione giornaliera superfici MOCA Reg. CE 1935/2004 (domain: haccp)",
);

// 6. Dispensa Comune & Frigoriferi Condivisi per Ospiti
const ostDispensaItems = generateEnvironmentChecklistItems(ostDispensaFrigo, "55.20.20");
assert.ok(
  ostDispensaItems.some(
    (it) => it.id.includes("etichettatura-alimenti-ospiti-procedura-haccp-scaduti") && it.domain === "haccp",
  ),
  "Dispensa Ostello deve verificare etichettatura per nome/check-out e smaltimento settimanale (domain: haccp)",
);
assert.ok(
  ostDispensaItems.some(
    (it) => it.id.includes("teletermometri-digitali-frigoriferi-temperatura-haccp") && it.domain === "haccp",
  ),
  "Dispensa Ostello deve verificare teletermometri frigoriferi +2/+4°C (domain: haccp)",
);

// 7. Lavanderia Self-Service per Ospiti a Gettoni/App & Locale Stireria
const ostLavanderiaItems = generateEnvironmentChecklistItems(ostLavanderia, "55.20.20");
assert.ok(
  ostLavanderiaItems.some(
    (it) => it.id.includes("blocco-oblo-interblocco-sicurezza-uni-en-iso-10472") && it.domain === "safety",
  ),
  "Lavanderia Ostello deve verificare interblocco sicurezza oblò UNI EN ISO 10472 (domain: safety)",
);
assert.ok(
  ostLavanderiaItems.some(
    (it) => it.id.includes("pulizia-filtri-lanugine-asciugatrici-prevenzione-incendi") && it.domain === "safety",
  ),
  "Lavanderia Ostello deve verificare pulizia filtri lanugine essiccatori D.M. 02/09/2021 (domain: safety)",
);

// 8. Guardaroba Biancheria, Deposito Housekeeping & Prodotti Pulizia
const ostHousekeepingItems = generateEnvironmentChecklistItems(ostHousekeeping, "55.20.20");
assert.ok(
  ostHousekeepingItems.some(
    (it) => it.id.includes("stoccaggio-biancheria-pulita-scaffali-sollevati-15cm") && it.domain === "both",
  ),
  "Housekeeping Ostello deve verificare stoccaggio biancheria sollevata 15 cm da terra (domain: both)",
);
assert.ok(
  ostHousekeepingItems.some(
    (it) => it.id.includes("armadio-detergenti-concentrati-sds-clp-titolo-ix") && it.domain === "safety",
  ),
  "Housekeeping Ostello deve verificare armadio chiuso a chiave per detergenti con SDS Titolo IX (domain: safety)",
);

// 9. Locale Deposito Bagagli Ospiti Custodito & Lockers Elettronici
const ostDepositoBagagliItems = generateEnvironmentChecklistItems(ostDepositoBagagli, "55.20.20");
assert.ok(
  ostDepositoBagagliItems.some(
    (it) => it.id.includes("lockers-bagagli-ancoraggio-parete-bordo-anticaduta") && it.domain === "safety",
  ),
  "Deposito bagagli Ostello deve verificare lockers e scaffali con bordo anticaduta e ancoraggio (domain: safety)",
);

// 10. Centrale Termica / Impianto Riscaldamento & Produzione ACS Anti-Legionella
const ostCentraleTermicaItems = generateEnvironmentChecklistItems(ostCentraleTermica, "55.20.20");
assert.ok(
  ostCentraleTermicaItems.some(
    (it) => it.id.includes("shock-termico-periodico-acs-65c-ricircolo-50c") && it.domain === "both",
  ),
  "Centrale termica Ostello deve verificare shock termico ACS a 65°C e ricircolo a 50°C (domain: both)",
);
assert.ok(
  ostCentraleTermicaItems.some(
    (it) => it.id.includes("registro-legionella-campionamenti-semestrali-valutazione") && it.domain === "both",
  ),
  "Centrale termica Ostello deve verificare Registro Legionella e campionamenti semestrali (domain: both)",
);
assert.ok(
  ostCentraleTermicaItems.some(
    (it) => it.id.includes("valvole-sicurezza-inail-vasi-ped-generatore-termico") && it.domain === "safety",
  ),
  "Centrale termica Ostello deve verificare valvole sicurezza INAIL e vasi PED (domain: safety)",
);

// 11. Corridoi ai Piani, Vano Scale Antincendio & Uscite di Emergenza
const ostCorridoiScaleItems = generateEnvironmentChecklistItems(ostCorridoiScale, "55.20.20");
assert.ok(
  ostCorridoiScaleItems.some(
    (it) => it.id.includes("porte-tagliafuoco-ei-chiudiporta-idraulico-dm-09-04-1994") && it.domain === "safety",
  ),
  "Corridoi Ostello devono verificare porte tagliafuoco EI 30/60 con chiudiporta idraulico (domain: safety)",
);
assert.ok(
  ostCorridoiScaleItems.some(
    (it) => it.id.includes("maniglioni-antipanico-uni-en-1125-vie-esodo-sgombre-120cm") && it.domain === "safety",
  ),
  "Corridoi Ostello devono verificare maniglioni antipanico UNI EN 1125 e vie di fuga sgombre ≥ 1,20 m (domain: safety)",
);
assert.ok(
  ostCorridoiScaleItems.some(
    (it) => it.id.includes("illuminazione-emergenza-5lux-allarme-ottico-acustico") && it.domain === "safety",
  ),
  "Corridoi Ostello devono verificare illuminazione di emergenza ≥ 5 lux e allarme evacuazione (domain: safety)",
);

// 12. Locale / Area Esterna Differenziata & Compattatore Rifiuti
const ostAreaRifiutiItems = generateEnvironmentChecklistItems(ostAreaRifiuti, "55.20.20");
assert.ok(
  ostAreaRifiutiItems.some(
    (it) => it.id.includes("bidoni-differenziata-carrellati-tenuta-coperchio-compattatore") && it.domain === "both",
  ),
  "Area rifiuti Ostello deve verificare bidoni carrellati a tenuta e compattatore (domain: both)",
);
assert.ok(
  ostAreaRifiutiItems.some(
    (it) => it.id.includes("pavimento-lavabile-pendenza-griglia-sifonata-derattizzazione") && it.domain === "both",
  ),
  "Area rifiuti Ostello deve verificare pavimentazione lavabile con griglia sifonata e derattizzazione (domain: both)",
);

// Verifica del filtraggio checklistMode su cucina e dormitori Ostello
const ostCucinaHaccpMode = filterEnvironmentItemsByChecklistMode(ostCucinaItems, "haccp_only");
assert.ok(
  ostCucinaHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item cucina Ostello devono essere haccp o both",
);
assert.ok(
  !ostCucinaHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item cucina Ostello deve avere domain safety",
);

const ostCucinaSafetyMode = filterEnvironmentItemsByChecklistMode(ostCucinaItems, "safety_only");
assert.ok(
  ostCucinaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item cucina Ostello devono essere safety o both",
);
assert.ok(
  !ostCucinaSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item cucina Ostello deve avere domain haccp",
);

const ostDormitoriSafetyMode = filterEnvironmentItemsByChecklistMode(ostDormitoriItems, "safety_only");
assert.ok(
  ostDormitoriSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item dormitori Ostello devono essere safety o both",
);

// ============================================================================
// 13. Test Campeggi, Villaggi Turistici, Camping Village e Allestimenti Camper
// ATECO 55.30.00 (o 55.30.0 / 55.30 / 55.3 / 553000 / 55300 / 5530 / 553)
// ============================================================================
console.log("Test 31: getStandardEnvironmentsForAteco & conformità per Campeggi, Camping Village (55.30.00 / 55.30.0 / 55.30 / 55.3 / 553000)");

const cmpEnvs = getStandardEnvironmentsForAteco("55.30.00");
assert.equal(cmpEnvs.length, 12, "Il Campeggio / Villaggio Turistico deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO (55.30.0, 55.30, 55.3, 553000, 55300, 5530, 553)
const cmpEnvsVar1 = getStandardEnvironmentsForAteco("55.30.0");
assert.equal(cmpEnvsVar1.length, 12, "Anche prefisso 55.30.0 deve restituire 12 ambienti Campeggio");
const cmpEnvsVar2 = getStandardEnvironmentsForAteco("55.30");
assert.equal(cmpEnvsVar2.length, 12, "Anche prefisso 55.30 deve restituire 12 ambienti Campeggio");
const cmpEnvsVar3 = getStandardEnvironmentsForAteco("55.3");
assert.equal(cmpEnvsVar3.length, 12, "Anche prefisso 55.3 deve restituire 12 ambienti Campeggio");
const cmpEnvsVar4 = getStandardEnvironmentsForAteco("553000");
assert.equal(cmpEnvsVar4.length, 12, "Anche codice numerico 553000 deve restituire 12 ambienti Campeggio");
const cmpEnvsVar5 = getStandardEnvironmentsForAteco("55300");
assert.equal(cmpEnvsVar5.length, 12, "Anche codice numerico 55300 deve restituire 12 ambienti Campeggio");
const cmpEnvsVar6 = getStandardEnvironmentsForAteco("5530");
assert.equal(cmpEnvsVar6.length, 12, "Anche codice numerico 5530 deve restituire 12 ambienti Campeggio");
const cmpEnvsVar7 = getStandardEnvironmentsForAteco("553");
assert.equal(cmpEnvsVar7.length, 12, "Anche codice numerico 553 deve restituire 12 ambienti Campeggio");

// Verifica ID dei 12 ambienti standard Campeggio / Villaggio Turistico
const expectedCmpIds = [
  "env-cmp-reception-direzione",
  "env-cmp-piazzole-tende-camper",
  "env-cmp-bungalow-mobilhome",
  "env-cmp-blocchi-servizi-docce",
  "env-cmp-camper-service-scarico",
  "env-cmp-piscina-solarium",
  "env-cmp-locale-tecnico-cloro",
  "env-cmp-ristorante-minimarket",
  "env-cmp-lavanderia-self",
  "env-cmp-centrale-idrica-antincendio",
  "env-cmp-officina-manutenzione",
  "env-cmp-isola-ecologica-rifiuti",
];

for (const id of expectedCmpIds) {
  assert.ok(
    cmpEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard Campeggio per 55.30.00`,
  );
}

// 1. Reception Principale, Check-in Ospiti & Uffici Direzione
const cmpReception = cmpEnvs.find((e) => e.id === "env-cmp-reception-direzione")!;
assert.equal(cmpReception.category, "sales_office");
assert.equal(cmpReception.surfaceSqM, 80);
assert.equal(cmpReception.heightM, 3.0);
assert.equal(cmpReception.volumeCuM, 240);
assert.equal(cmpReception.occupantsCount, 4);
assert.equal(cmpReception.windowSurfaceSqM, 10.0);
assert.equal(cmpReception.features.emergencyLighting, true);
const compCmpReception = evaluateEnvironmentCompliance(cmpReception, "55.30.00");
assert.equal(compCmpReception.isHeightCompliant, true);
assert.equal(compCmpReception.isCubatureCompliant, true);
assert.ok(
  compCmpReception.summaryBadges.some((b) => b.text.includes("VDT ergonomica") && b.text.includes("30 mA")),
  "Reception Campeggio deve includere badge VDT ergonomica e differenziale 30 mA",
);
assert.ok(
  compCmpReception.summaryBadges.some((b) => b.text.includes("34A 233B") && b.text.toLowerCase().includes("planimetria")),
  "Reception Campeggio deve includere badge estintore 34A 233B e planimetria bilingue",
);

// 2. Area Piazzole Campeggio & Viabilità Interna
const cmpPiazzole = cmpEnvs.find((e) => e.id === "env-cmp-piazzole-tende-camper")!;
assert.equal(cmpPiazzole.category, "production");
assert.equal(cmpPiazzole.surfaceSqM, 5000);
assert.equal(cmpPiazzole.heightM, 3.0);
assert.equal(cmpPiazzole.volumeCuM, 15000);
assert.equal(cmpPiazzole.occupantsCount, 200);
assert.equal(cmpPiazzole.features.emergencyLighting, true);
const compCmpPiazzole = evaluateEnvironmentCompliance(cmpPiazzole, "55.30.00");
assert.equal(compCmpPiazzole.isHeightCompliant, true);
assert.equal(compCmpPiazzole.isCubatureCompliant, true);
assert.ok(compCmpPiazzole.cpiActivityAlert !== null, "Piazzole campeggio devono essere assoggettate ad Attività 66 CPI");
assert.equal(compCmpPiazzole.cpiActivityAlert?.code, "Attività 66 (D.P.R. 151/2011)");
assert.ok(
  compCmpPiazzole.summaryBadges.some((b) => b.text.includes("3,50 m") && b.text.includes("D.M. 28/02/2014")),
  "Piazzole Campeggio devono verificare viabilità soccorsi VVF >= 3,50 m D.M. 28/02/2014",
);
assert.ok(
  compCmpPiazzole.summaryBadges.some((b) => b.text.includes("CEI 64-8 sez. 708") && b.text.includes("30 mA")),
  "Piazzole Campeggio devono verificare colonnine elettriche CEI 64-8 sez. 708",
);
assert.ok(
  compCmpPiazzole.summaryBadges.some((b) => b.text.includes("UNI 45/70 ogni 50 m")),
  "Piazzole Campeggio devono verificare idranti UNI 45/70 ogni 50 m",
);

// 3. Villaggio Case Mobili, Maxi Caravan & Bungalow Turistici
const cmpBungalow = cmpEnvs.find((e) => e.id === "env-cmp-bungalow-mobilhome")!;
assert.equal(cmpBungalow.category, "production");
assert.equal(cmpBungalow.surfaceSqM, 2000);
assert.equal(cmpBungalow.heightM, 2.5);
assert.equal(cmpBungalow.volumeCuM, 5000);
assert.equal(cmpBungalow.occupantsCount, 100);
assert.equal(cmpBungalow.windowSurfaceSqM, 200.0);
assert.equal(cmpBungalow.features.emergencyLighting, true);
const compCmpBungalow = evaluateEnvironmentCompliance(cmpBungalow, "55.30.00");
assert.equal(compCmpBungalow.isHeightCompliant, true);
assert.equal(compCmpBungalow.isCubatureCompliant, true);
assert.ok(compCmpBungalow.cpiActivityAlert !== null, "Villaggio bungalow deve essere assoggettato ad Attività 66 CPI");
assert.ok(
  compCmpBungalow.summaryBadges.some((b) => b.text.includes("UNI EN 14604")),
  "Bungalow Campeggio devono verificare rilevatori di fumo autonomi UNI EN 14604",
);
assert.ok(
  compCmpBungalow.summaryBadges.some((b) => b.text.includes("GPL") && b.text.includes("catenelle")),
  "Bungalow Campeggio devono verificare bombole GPL esterne con catenelle",
);

// 4. Blocchi Servizi Igienici Centralizzati & Docce Calde (con Servizi Disabili PMR)
const cmpBlocchiServizi = cmpEnvs.find((e) => e.id === "env-cmp-blocchi-servizi-docce")!;
assert.equal(cmpBlocchiServizi.category, "services");
assert.equal(cmpBlocchiServizi.surfaceSqM, 120);
assert.equal(cmpBlocchiServizi.heightM, 2.7);
assert.equal(cmpBlocchiServizi.volumeCuM, 324);
assert.equal(cmpBlocchiServizi.occupantsCount, 10);
assert.equal(cmpBlocchiServizi.windowSurfaceSqM, 12.0);
assert.equal(cmpBlocchiServizi.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(cmpBlocchiServizi.features.flooringCondition, "compliant_anti_slip");
assert.equal(cmpBlocchiServizi.features.forcedExhaustPresent, true);
assert.equal(cmpBlocchiServizi.features.forcedExhaustType, "blind_toilet_fan");
const compCmpBlocchiServizi = evaluateEnvironmentCompliance(cmpBlocchiServizi, "55.30.00");
assert.equal(compCmpBlocchiServizi.isHeightCompliant, true);
assert.equal(compCmpBlocchiServizi.isCubatureCompliant, true);
assert.ok(
  compCmpBlocchiServizi.summaryBadges.some((b) => b.text.includes("R11") && b.text.includes("canaline sifonate")),
  "Blocchi servizi docce devono verificare piatto antiscivolo R11 e canaline sifonate",
);
assert.ok(
  compCmpBlocchiServizi.summaryBadges.some((b) => b.text.includes("Legionella D.Lgs. 18/2023")),
  "Blocchi servizi docce devono verificare protocollo Legionella D.Lgs. 18/2023",
);
assert.ok(
  compCmpBlocchiServizi.summaryBadges.some((b) => b.text.includes("PMR D.P.R. 503/96")),
  "Blocchi servizi docce devono verificare accessibilità PMR D.P.R. 503/96",
);

// 5. Area Camper Service (Scarico Reflui Igienici & Rifornimento Acqua Potabile)
const cmpCamperService = cmpEnvs.find((e) => e.id === "env-cmp-camper-service-scarico")!;
assert.equal(cmpCamperService.category, "technical");
assert.equal(cmpCamperService.surfaceSqM, 60);
assert.equal(cmpCamperService.heightM, 3.0);
assert.equal(cmpCamperService.volumeCuM, 180);
assert.equal(cmpCamperService.occupantsCount, 2);
assert.equal(cmpCamperService.features.flooringCondition, "compliant_anti_slip");
const compCmpCamperService = evaluateEnvironmentCompliance(cmpCamperService, "55.30.00");
assert.equal(compCmpCamperService.isHeightCompliant, true);
assert.equal(compCmpCamperService.isCubatureCompliant, true);
assert.ok(
  compCmpCamperService.summaryBadges.some((b) => b.text.includes("UNI EN 1717")),
  "Camper Service deve verificare disconnettore UNI EN 1717 e separazione reflui",
);
assert.ok(
  compCmpCamperService.summaryBadges.some((b) => b.text.includes("Griglia carrabile")),
  "Camper Service deve verificare griglia carrabile autopulente",
);

// 6. Parco Piscine, Vasca Bambini & Area Solarium (UNI 10637)
const cmpPiscina = cmpEnvs.find((e) => e.id === "env-cmp-piscina-solarium")!;
assert.equal(cmpPiscina.category, "services");
assert.equal(cmpPiscina.surfaceSqM, 800);
assert.equal(cmpPiscina.heightM, 3.0);
assert.equal(cmpPiscina.volumeCuM, 2400);
assert.equal(cmpPiscina.occupantsCount, 80);
assert.equal(cmpPiscina.features.flooringCondition, "compliant_anti_slip");
assert.equal(cmpPiscina.features.emergencyLighting, true);
const compCmpPiscina = evaluateEnvironmentCompliance(cmpPiscina, "55.30.00");
assert.equal(compCmpPiscina.isHeightCompliant, true);
assert.equal(compCmpPiscina.isCubatureCompliant, true);
assert.ok(
  compCmpPiscina.summaryBadges.some((b) => b.text.includes("DIN 51097 classe C")),
  "Piscina solarium deve verificare pavimentazione antiscivolo bagnata DIN 51097 classe C",
);
assert.ok(
  compCmpPiscina.summaryBadges.some((b) => b.text.includes("bagnino") && b.text.includes("DAE")),
  "Piscina solarium deve verificare torretta bagnino con salvagente e DAE",
);
assert.ok(
  compCmpPiscina.summaryBadges.some((b) => b.text.includes("cloro/pH UNI 10637")),
  "Piscina solarium deve verificare controllo cloro/pH UNI 10637",
);

// 7. Locale Tecnico Trattamento Acque Piscina & Deposito Prodotti Chimici (Cloro/pH)
const cmpLocaleCloro = cmpEnvs.find((e) => e.id === "env-cmp-locale-tecnico-cloro")!;
assert.equal(cmpLocaleCloro.category, "technical");
assert.equal(cmpLocaleCloro.surfaceSqM, 25);
assert.equal(cmpLocaleCloro.heightM, 2.6);
assert.equal(cmpLocaleCloro.volumeCuM, 65);
assert.equal(cmpLocaleCloro.occupantsCount, 1);
assert.equal(cmpLocaleCloro.features.emergencyLighting, true);
const compCmpLocaleCloro = evaluateEnvironmentCompliance(cmpLocaleCloro, "55.30.00");
assert.equal(compCmpLocaleCloro.isHeightCompliant, true);
assert.equal(compCmpLocaleCloro.isCubatureCompliant, true);
assert.ok(
  compCmpLocaleCloro.summaryBadges.some((b) => b.text.includes("Vasche di contenimento") && b.text.includes("ipoclorito")),
  "Locale cloro deve verificare vasche di contenimento chimico",
);
assert.ok(
  compCmpLocaleCloro.summaryBadges.some((b) => b.text.includes("UNI EN 15154")),
  "Locale cloro deve verificare doccia di emergenza e lavaocchi UNI EN 15154",
);
assert.ok(
  compCmpLocaleCloro.summaryBadges.some((b) => b.text.includes("Ventilazione forzata permanente antideflagrante")),
  "Locale cloro deve verificare ventilazione forzata antideflagrante",
);

// 8. Ristorante, Pizzeria, Bar & Minimarket del Villaggio
const cmpRistorante = cmpEnvs.find((e) => e.id === "env-cmp-ristorante-minimarket")!;
assert.equal(cmpRistorante.category, "production");
assert.equal(cmpRistorante.surfaceSqM, 250);
assert.equal(cmpRistorante.heightM, 3.2);
assert.equal(cmpRistorante.volumeCuM, 800);
assert.equal(cmpRistorante.occupantsCount, 8);
assert.equal(cmpRistorante.windowSurfaceSqM, 25.0);
assert.equal(cmpRistorante.features.forcedExhaustPresent, true);
assert.equal(cmpRistorante.features.forcedExhaustType, "kitchen_hood");
assert.equal(cmpRistorante.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(cmpRistorante.features.flooringCondition, "compliant_anti_slip");
assert.equal(cmpRistorante.features.insectScreens, true);
assert.equal(cmpRistorante.features.microclimateCompliant, true);
const compCmpRistorante = evaluateEnvironmentCompliance(cmpRistorante, "55.30.00");
assert.equal(compCmpRistorante.isHeightCompliant, true);
assert.equal(compCmpRistorante.isCubatureCompliant, true);
assert.ok(
  compCmpRistorante.summaryBadges.some((b) => b.text.includes("Ansul R-102")),
  "Ristorante Campeggio deve verificare impianto automatico spegnimento cappe Ansul R-102",
);
assert.ok(
  compCmpRistorante.summaryBadges.some((b) => b.text.includes("HACCP") && b.text.includes("MOCA")),
  "Ristorante Campeggio deve verificare celle frigo HACCP e banchi MOCA",
);

// 9. Locale Lavanderia Self-Service per Campeggiatori & Stireria
const cmpLavanderia = cmpEnvs.find((e) => e.id === "env-cmp-lavanderia-self")!;
assert.equal(cmpLavanderia.category, "services");
assert.equal(cmpLavanderia.surfaceSqM, 30);
assert.equal(cmpLavanderia.heightM, 2.6);
assert.equal(cmpLavanderia.volumeCuM, 78);
assert.equal(cmpLavanderia.occupantsCount, 3);
assert.equal(cmpLavanderia.windowSurfaceSqM, 3.0);
assert.equal(cmpLavanderia.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(cmpLavanderia.features.flooringCondition, "compliant_anti_slip");
assert.equal(cmpLavanderia.features.forcedExhaustPresent, true);
const compCmpLavanderia = evaluateEnvironmentCompliance(cmpLavanderia, "55.30.00");
assert.equal(compCmpLavanderia.isHeightCompliant, true);
assert.equal(compCmpLavanderia.isCubatureCompliant, true);
assert.ok(
  compCmpLavanderia.summaryBadges.some((b) => b.text.includes("UNI EN ISO 10472")),
  "Lavanderia Campeggio deve verificare blocco oblò di sicurezza UNI EN ISO 10472",
);
assert.ok(
  compCmpLavanderia.summaryBadges.some((b) => b.text.includes("filtri lanugine essiccatori")),
  "Lavanderia Campeggio deve verificare pulizia quotidiana filtri lanugine",
);

// 10. Centrale Idrica, Gruppo di Pompaggio Antincendio & Serbatoi ACS
const cmpCentraleIdrica = cmpEnvs.find((e) => e.id === "env-cmp-centrale-idrica-antincendio")!;
assert.equal(cmpCentraleIdrica.category, "technical");
assert.equal(cmpCentraleIdrica.surfaceSqM, 35);
assert.equal(cmpCentraleIdrica.heightM, 3.0);
assert.equal(cmpCentraleIdrica.volumeCuM, 105);
assert.equal(cmpCentraleIdrica.occupantsCount, 1);
assert.equal(cmpCentraleIdrica.features.emergencyLighting, true);
const compCmpCentraleIdrica = evaluateEnvironmentCompliance(cmpCentraleIdrica, "55.30.00");
assert.equal(compCmpCentraleIdrica.isHeightCompliant, true);
assert.equal(compCmpCentraleIdrica.isCubatureCompliant, true);
assert.ok(
  compCmpCentraleIdrica.summaryBadges.some((b) => b.text.includes("UNI EN 12845") && b.text.includes("motopompa diesel")),
  "Centrale Idrica Campeggio deve verificare gruppo pompaggio antincendio UNI EN 12845 con motopompa diesel",
);
assert.ok(
  compCmpCentraleIdrica.summaryBadges.some((b) => b.text.includes("ACS a temperatura costante ≥ 60°C")),
  "Centrale Idrica Campeggio deve verificare mantenimento temperatura ACS >= 60°C anti-legionella",
);

// 11. Officina Manutenzione, Rimessaggio Mezzi di Servizio & Trattorini
const cmpOfficina = cmpEnvs.find((e) => e.id === "env-cmp-officina-manutenzione")!;
assert.equal(cmpOfficina.category, "warehouse");
assert.equal(cmpOfficina.surfaceSqM, 60);
assert.equal(cmpOfficina.heightM, 3.5);
assert.equal(cmpOfficina.volumeCuM, 210);
assert.equal(cmpOfficina.occupantsCount, 2);
assert.equal(cmpOfficina.windowSurfaceSqM, 6.0);
assert.equal(cmpOfficina.features.emergencyLighting, true);
const compCmpOfficina = evaluateEnvironmentCompliance(cmpOfficina, "55.30.00");
assert.equal(compCmpOfficina.isHeightCompliant, true);
assert.equal(compCmpOfficina.isCubatureCompliant, true);
assert.ok(
  compCmpOfficina.summaryBadges.some((b) => b.text.includes("golf-cart") && b.text.includes("anti-idrogeno")),
  "Officina Campeggio deve verificare ricarica batterie golf-cart ventilata anti-idrogeno",
);
assert.ok(
  compCmpOfficina.summaryBadges.some((b) => b.text.includes("REI 90 / EN 14470")),
  "Officina Campeggio deve verificare armadio tagliafuoco per benzine e carburanti",
);

// 12. Isola Ecologica Centrale Rifiuti & Compattatore Differenziata
const cmpIsolaEcologica = cmpEnvs.find((e) => e.id === "env-cmp-isola-ecologica-rifiuti")!;
assert.equal(cmpIsolaEcologica.category, "technical");
assert.equal(cmpIsolaEcologica.surfaceSqM, 80);
assert.equal(cmpIsolaEcologica.heightM, 3.0);
assert.equal(cmpIsolaEcologica.volumeCuM, 240);
assert.equal(cmpIsolaEcologica.occupantsCount, 2);
assert.equal(cmpIsolaEcologica.features.flooringCondition, "compliant_anti_slip");
const compCmpIsolaEcologica = evaluateEnvironmentCompliance(cmpIsolaEcologica, "55.30.00");
assert.equal(compCmpIsolaEcologica.isHeightCompliant, true);
assert.equal(compCmpIsolaEcologica.isCubatureCompliant, true);
assert.ok(
  compCmpIsolaEcologica.summaryBadges.some((b) => b.text.includes("differenziata carrellati con coperchio")),
  "Isola ecologica Campeggio deve verificare cassonetti con coperchio ermetico",
);
assert.ok(
  compCmpIsolaEcologica.summaryBadges.some((b) => b.text.includes("UNI EN 16500")),
  "Isola ecologica Campeggio deve verificare compattatore UNI EN 16500 con arresto d'emergenza",
);


// ============================================================================
// Test 32: generateEnvironmentChecklistItems per locali Campeggio (ATECO 55.30.00)
// ============================================================================
console.log("Test 32: generateEnvironmentChecklistItems per locali Campeggio (ATECO 55.30.00)");

// 1. Reception Principale & Uffici Direzione
const cmpReceptionItems = generateEnvironmentChecklistItems(cmpReception, "55.30.00");
assert.ok(
  cmpReceptionItems.some(
    (it) => it.id.includes("postazione-vdt-quadro-differenziale-30ma") && it.domain === "safety",
  ),
  "Reception Campeggio deve verificare postazione VDT ergonomica e differenziale 30 mA (domain: safety)",
);
assert.ok(
  cmpReceptionItems.some(
    (it) => it.id.includes("estintore-34a-233b-planimetria-esodo-bilingue") && it.domain === "safety",
  ),
  "Reception Campeggio deve verificare estintore 34A 233B e planimetria bilingue (domain: safety)",
);
assert.ok(
  cmpReceptionItems.some(
    (it) => it.id.includes("sistema-diffusione-sonora-evacuazione") && it.domain === "safety",
  ),
  "Reception Campeggio deve verificare sistema diffusione sonora emergenza all'aperto (domain: safety)",
);

// 2. Area Piazzole Campeggio (Tende, Roulotte, Camper) & Viabilità Interna
const cmpPiazzoleItems = generateEnvironmentChecklistItems(cmpPiazzole, "55.30.00");
assert.ok(
  cmpPiazzoleItems.some(
    (it) => it.id.includes("colonnine-elettriche-differenziale-30ma-cei-64-8") && it.domain === "safety",
  ),
  "Piazzole Campeggio devono verificare colonnine con differenziale 30 mA CEI 64-8 sez. 708 (domain: safety)",
);
assert.ok(
  cmpPiazzoleItems.some(
    (it) => it.id.includes("viabilita-soccorsi-vvf-larghezza-350m") && it.domain === "safety",
  ),
  "Piazzole Campeggio devono verificare viabilità VVF >= 3,50 m D.M. 28/02/2014 (domain: safety)",
);
assert.ok(
  cmpPiazzoleItems.some(
    (it) => it.id.includes("rete-idranti-uni-45-70-ogni-50m-distanziamento") && it.domain === "safety",
  ),
  "Piazzole Campeggio devono verificare idranti UNI 45/70 ogni 50 m e distanziamento >= 3 m (domain: safety)",
);

// 3. Villaggio Case Mobili, Maxi Caravan & Bungalow Turistici
const cmpBungalowItems = generateEnvironmentChecklistItems(cmpBungalow, "55.30.00");
assert.ok(
  cmpBungalowItems.some(
    (it) => it.id.includes("rilevatori-fumo-autonomi-uni-en-14604") && it.domain === "safety",
  ),
  "Bungalow Campeggio devono verificare rilevatori fumo autonomi UNI EN 14604 (domain: safety)",
);
assert.ok(
  cmpBungalowItems.some(
    (it) => it.id.includes("bombole-gpl-catenelle-flessibili-uni-7140") && it.domain === "safety",
  ),
  "Bungalow Campeggio devono verificare bombole GPL esterne e flessibili UNI 7140 (domain: safety)",
);
assert.ok(
  cmpBungalowItems.some(
    (it) => it.id.includes("estintori-polvere-distribuiti-percorsi-illuminati") && it.domain === "safety",
  ),
  "Bungalow Campeggio devono verificare estintori a polvere distribuiti e illuminazione >= 5 lux (domain: safety)",
);

// 4. Blocchi Servizi Igienici Centralizzati & Docce Calde (con Servizi Disabili PMR)
const cmpBlocchiServiziItems = generateEnvironmentChecklistItems(cmpBlocchiServizi, "55.30.00");
assert.ok(
  cmpBlocchiServiziItems.some(
    (it) => it.id.includes("protocollo-legionella-soffioni-docce-dlgs-18-2023") && it.domain === "both",
  ),
  "Blocchi docce Campeggio devono verificare protocollo Legionella D.Lgs. 18/2023 su soffioni (domain: both)",
);
assert.ok(
  cmpBlocchiServiziItems.some(
    (it) => it.id.includes("box-docce-antiscivolo-r11-canaline-sifonate") && it.domain === "both",
  ),
  "Blocchi docce Campeggio devono verificare piatti doccia R11 e antibagno con carta a perdere (domain: both)",
);
assert.ok(
  cmpBlocchiServiziItems.some(
    (it) => it.id.includes("bagno-disabili-pmr-tirante-soccorso-dlgs-503-96") && it.domain === "safety",
  ),
  "Blocchi docce Campeggio devono verificare tirante allarme bagno disabili PMR (domain: safety)",
);

// 5. Area Camper Service (Scarico Reflui Igienici & Rifornimento Acqua Potabile)
const cmpCamperServiceItems = generateEnvironmentChecklistItems(cmpCamperService, "55.30.00");
assert.ok(
  cmpCamperServiceItems.some(
    (it) => it.id.includes("separazione-reflui-acqua-potabile-disconnettore-uni-en-1717") && it.domain === "both",
  ),
  "Camper service deve verificare divieto contatto reflui/potabile e disconnettore UNI EN 1717 (domain: both)",
);
assert.ok(
  cmpCamperServiceItems.some(
    (it) => it.id.includes("griglia-carrabile-autopulente-scarico-acque-grigie") && it.domain === "both",
  ),
  "Camper service deve verificare pulizia griglia carrabile autopulente (domain: both)",
);

// 6. Parco Piscine, Vasca Bambini & Area Solarium (UNI 10637)
const cmpPiscinaItems = generateEnvironmentChecklistItems(cmpPiscina, "55.30.00");
assert.ok(
  cmpPiscinaItems.some(
    (it) => it.id.includes("controllo-giornaliero-cloro-ph-uni-10637") && it.domain === "both",
  ),
  "Piscina Campeggio deve verificare controllo giornaliero cloro libero e pH a norma UNI 10637 (domain: both)",
);
assert.ok(
  cmpPiscinaItems.some(
    (it) => it.id.includes("torretta-bagnino-salvagente-anulare-sagola") && it.domain === "safety",
  ),
  "Piscina Campeggio deve verificare bagnino con torretta, salvagente anulare e sagola (domain: safety)",
);
assert.ok(
  cmpPiscinaItems.some(
    (it) => it.id.includes("dae-defibrillatore-teca-riscaldata-pavimento-classe-c") && it.domain === "safety",
  ),
  "Piscina Campeggio deve verificare DAE operativo e pavimento classe C (domain: safety)",
);

// 7. Locale Tecnico Trattamento Acque Piscina & Deposito Prodotti Chimici (Cloro/pH)
const cmpLocaleCloroItems = generateEnvironmentChecklistItems(cmpLocaleCloro, "55.30.00");
assert.ok(
  cmpLocaleCloroItems.some(
    (it) => it.id.includes("vasche-contenimento-fusti-cloro-acido") && it.domain === "safety",
  ),
  "Locale cloro deve verificare tenuta stagna vasche di contenimento fusti (domain: safety)",
);
assert.ok(
  cmpLocaleCloroItems.some(
    (it) => it.id.includes("doccia-emergenza-lavaocchi-uni-en-15154") && it.domain === "safety",
  ),
  "Locale cloro deve verificare doccia di emergenza e lavaocchi UNI EN 15154 (domain: safety)",
);
assert.ok(
  cmpLocaleCloroItems.some(
    (it) => it.id.includes("ventilazione-forzata-dpi-respiratori-visiere") && it.domain === "safety",
  ),
  "Locale cloro deve verificare ventilazione forzata e DPI chimici (domain: safety)",
);

// 8. Ristorante, Pizzeria, Bar & Minimarket del Villaggio
const cmpRistoranteItems = generateEnvironmentChecklistItems(cmpRistorante, "55.30.00");
assert.ok(
  cmpRistoranteItems.some(
    (it) => it.id.includes("cappa-filtri-labirinto-spegnimento-ansul") && it.domain === "both",
  ),
  "Ristorante Campeggio deve verificare cappa aspirazione con filtri labirinto e spegnimento Ansul (domain: both)",
);
assert.ok(
  cmpRistoranteItems.some(
    (it) => it.id.includes("celle-frigo-haccp-temperature-moca") && it.domain === "haccp",
  ),
  "Ristorante Campeggio deve verificare celle frigorifere HACCP e banchi MOCA (domain: haccp)",
);
assert.ok(
  cmpRistoranteItems.some(
    (it) => it.id.includes("vie-fuga-antipanico-zanzariere") && it.domain === "safety",
  ),
  "Ristorante Campeggio deve verificare vie di fuga antipanico e zanzariere (domain: safety)",
);

// 9. Locale Lavanderia Self-Service per Campeggiatori & Stireria
const cmpLavanderiaItems = generateEnvironmentChecklistItems(cmpLavanderia, "55.30.00");
assert.ok(
  cmpLavanderiaItems.some(
    (it) => it.id.includes("blocco-oblo-uni-en-iso-10472-pavimento-antiscivolo") && it.domain === "safety",
  ),
  "Lavanderia Campeggio deve verificare blocco oblò UNI EN ISO 10472 e pavimento antiscivolo (domain: safety)",
);
assert.ok(
  cmpLavanderiaItems.some(
    (it) => it.id.includes("pulizia-giornaliera-filtri-lanugine-antincendio") && it.domain === "safety",
  ),
  "Lavanderia Campeggio deve verificare pulizia filtri lanugine essiccatori (domain: safety)",
);

// 10. Centrale Idrica, Gruppo di Pompaggio Antincendio & Serbatoi ACS
const cmpCentraleIdricaItems = generateEnvironmentChecklistItems(cmpCentraleIdrica, "55.30.00");
assert.ok(
  cmpCentraleIdricaItems.some(
    (it) => it.id.includes("prova-settimanale-motopompa-diesel-uni-en-12845") && it.domain === "safety",
  ),
  "Centrale Idrica deve verificare prova settimanale motopompa diesel UNI EN 12845 con livello gasolio (domain: safety)",
);
assert.ok(
  cmpCentraleIdricaItems.some(
    (it) => it.id.includes("temperatura-accumulo-acs-60-gradi-anti-legionella") && it.domain === "both",
  ),
  "Centrale Idrica deve verificare temperatura accumulo ACS >= 60°C anti-legionella (domain: both)",
);

// 11. Officina Manutenzione, Rimessaggio Mezzi di Servizio & Trattorini
const cmpOfficinaItems = generateEnvironmentChecklistItems(cmpOfficina, "55.30.00");
assert.ok(
  cmpOfficinaItems.some(
    (it) => it.id.includes("areazione-ricarica-batterie-golf-cart-anti-idrogeno") && it.domain === "safety",
  ),
  "Officina Campeggio deve verificare aerazione ricarica batterie golf-cart anti-idrogeno (domain: safety)",
);
assert.ok(
  cmpOfficinaItems.some(
    (it) => it.id.includes("armadio-tagliafuoco-carburanti-decespugliatori") && it.domain === "safety",
  ),
  "Officina Campeggio deve verificare armadio tagliafuoco benzine e miscele tosaerba (domain: safety)",
);

// 12. Isola Ecologica Centrale Rifiuti & Compattatore Differenziata
const cmpIsolaEcologicaItems = generateEnvironmentChecklistItems(cmpIsolaEcologica, "55.30.00");
assert.ok(
  cmpIsolaEcologicaItems.some(
    (it) => it.id.includes("compattatore-cartoni-arresto-emergenza-uni-en-16500") && it.domain === "safety",
  ),
  "Isola Ecologica Campeggio deve verificare compattatore con arresto emergenza UNI EN 16500 (domain: safety)",
);
assert.ok(
  cmpIsolaEcologicaItems.some(
    (it) => it.id.includes("cassonetti-coperchio-chiuso-derattizzazione-oli-esausti") && it.domain === "both",
  ),
  "Isola Ecologica Campeggio deve verificare cassonetti chiusi e piano derattizzazione (domain: both)",
);

// Verifica del filtraggio checklistMode su ristorante e blocchi docce Campeggio
const cmpRistoranteHaccpMode = filterEnvironmentItemsByChecklistMode(cmpRistoranteItems, "haccp_only");
assert.ok(
  cmpRistoranteHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item ristorante Campeggio devono essere haccp o both",
);
assert.ok(
  !cmpRistoranteHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item ristorante Campeggio deve avere domain safety",
);

const cmpRistoranteSafetyMode = filterEnvironmentItemsByChecklistMode(cmpRistoranteItems, "safety_only");
assert.ok(
  cmpRistoranteSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item ristorante Campeggio devono essere safety o both",
);
assert.ok(
  !cmpRistoranteSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item ristorante Campeggio deve avere domain haccp",
);

const cmpPiazzoleSafetyMode = filterEnvironmentItemsByChecklistMode(cmpPiazzoleItems, "safety_only");
assert.ok(
  cmpPiazzoleSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item piazzole Campeggio devono essere safety o both",
);

// ============================================================================
// Test 33: getStandardEnvironmentsForAteco & conformità per Stabilimenti Balneari, Lidi, Beach Club (93.29.20 / 93.29.2 / 93.29 / 93.2 / 932920)
// ============================================================================
console.log("Test 33: getStandardEnvironmentsForAteco & conformità per Stabilimenti Balneari, Lidi (93.29.20 / 93.29.2 / 93.29 / 93.2 / 932920)");

const balnEnvs = getStandardEnvironmentsForAteco("93.29.20");
assert.equal(balnEnvs.length, 12, "Lo Stabilimento Balneare / Lido deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO (93.29.2, 93.29, 93.2, 932920, 93292, 9329, 932)
const balnEnvsVar1 = getStandardEnvironmentsForAteco("93.29.2");
assert.equal(balnEnvsVar1.length, 12, "Anche prefisso 93.29.2 deve restituire 12 ambienti Stabilimento Balneare");
const balnEnvsVar2 = getStandardEnvironmentsForAteco("93.29");
assert.equal(balnEnvsVar2.length, 12, "Anche prefisso 93.29 deve restituire 12 ambienti Stabilimento Balneare");
const balnEnvsVar3 = getStandardEnvironmentsForAteco("93.2");
assert.equal(balnEnvsVar3.length, 12, "Anche prefisso 93.2 deve restituire 12 ambienti Stabilimento Balneare");
const balnEnvsVar4 = getStandardEnvironmentsForAteco("932920");
assert.equal(balnEnvsVar4.length, 12, "Anche codice numerico 932920 deve restituire 12 ambienti Stabilimento Balneare");
const balnEnvsVar5 = getStandardEnvironmentsForAteco("93292");
assert.equal(balnEnvsVar5.length, 12, "Anche codice numerico 93292 deve restituire 12 ambienti Stabilimento Balneare");
const balnEnvsVar6 = getStandardEnvironmentsForAteco("9329");
assert.equal(balnEnvsVar6.length, 12, "Anche codice numerico 9329 deve restituire 12 ambienti Stabilimento Balneare");
const balnEnvsVar7 = getStandardEnvironmentsForAteco("932");
assert.equal(balnEnvsVar7.length, 12, "Anche codice numerico 932 deve restituire 12 ambienti Stabilimento Balneare");

// Verifica ID dei 12 ambienti standard Stabilimento Balneare
const expectedBalnIds = [
  "env-baln-reception-cassa",
  "env-baln-arenile-ombrelloni",
  "env-baln-postazione-salvataggio",
  "env-baln-infermeria-primo-soccorso",
  "env-baln-cabine-spogliatoi",
  "env-baln-blocchi-servizi-docce",
  "env-baln-chiosco-bar",
  "env-baln-ristorante-cucina",
  "env-baln-celle-frigo-dispensa",
  "env-baln-centrale-idrica-solare",
  "env-baln-rimessaggio-puliscispiaggia",
  "env-baln-isola-ecologica-spiaggia",
];

for (const id of expectedBalnIds) {
  assert.ok(
    balnEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard Stabilimento Balneare per 93.29.20`,
  );
}

// 1. Reception Stabilimento, Cassa & Direzione Lido
const balnReception = balnEnvs.find((e) => e.id === "env-baln-reception-cassa")!;
assert.equal(balnReception.category, "sales_office");
assert.equal(balnReception.surfaceSqM, 30);
assert.equal(balnReception.heightM, 3.0);
assert.equal(balnReception.volumeCuM, 90);
assert.equal(balnReception.occupantsCount, 2);
const balnReceptionComp = evaluateEnvironmentCompliance(balnReception, "93.29.20");
assert.ok(balnReceptionComp.isHeightCompliant, "Reception Lido deve avere altezza conforme (3.00 m >= 2.70 m)");
assert.ok(balnReceptionComp.isCubatureCompliant, "Reception Lido deve avere cubatura conforme (45 mc/op >= 10 mc)");
assert.ok(
  balnReceptionComp.summaryBadges.some((b) => b.text.includes("Postazione VDT ergonomica")),
  "Reception Lido deve avere badge postazione VDT",
);

// 2. Arenile Attrezzato (File Ombrelloni, Lettini & Passerelle Accessibili PMR)
const balnArenile = balnEnvs.find((e) => e.id === "env-baln-arenile-ombrelloni")!;
assert.equal(balnArenile.category, "production");
assert.equal(balnArenile.surfaceSqM, 6000);
assert.equal(balnArenile.heightM, 3.0);
assert.equal(balnArenile.volumeCuM, 18000);
assert.equal(balnArenile.occupantsCount, 300);
const balnArenileComp = evaluateEnvironmentCompliance(balnArenile, "93.29.20");
assert.ok(balnArenileComp.isHeightCompliant, "Arenile deve avere altezza conforme");
assert.ok(balnArenileComp.isCubatureCompliant, "Arenile deve avere cubatura conforme (60 mc/op >= 10 mc)");
assert.ok(
  balnArenileComp.summaryBadges.some((b) => b.text.includes("Passerella disabili PMR")),
  "Arenile deve avere badge passerella PMR fino alla battigia e sedia JOB",
);

// 3. Torretta di Avvistamento Bagnino & Fronte Mare Salvataggio
const balnSalvataggio = balnEnvs.find((e) => e.id === "env-baln-postazione-salvataggio")!;
assert.equal(balnSalvataggio.category, "production");
assert.equal(balnSalvataggio.surfaceSqM, 20);
assert.equal(balnSalvataggio.heightM, 3.0);
assert.equal(balnSalvataggio.volumeCuM, 60);
assert.equal(balnSalvataggio.occupantsCount, 2);
const balnSalvataggioComp = evaluateEnvironmentCompliance(balnSalvataggio, "93.29.20");
assert.ok(balnSalvataggioComp.isHeightCompliant, "Torretta Salvataggio deve avere altezza conforme");
assert.ok(
  balnSalvataggioComp.summaryBadges.some((b) => b.text.includes("Pattino di salvataggio")),
  "Torretta Salvataggio deve avere badge pattino rosso a remi e cima 25m",
);

// 4. Locale Infermeria di Spiaggia & Postazione Primo Soccorso DAE
const balnInfermeria = balnEnvs.find((e) => e.id === "env-baln-infermeria-primo-soccorso")!;
assert.equal(balnInfermeria.category, "services");
assert.equal(balnInfermeria.surfaceSqM, 15);
assert.equal(balnInfermeria.heightM, 2.7);
assert.equal(balnInfermeria.volumeCuM, 40.5);
assert.equal(balnInfermeria.occupantsCount, 1);
const balnInfermeriaComp = evaluateEnvironmentCompliance(balnInfermeria, "93.29.20");
assert.ok(balnInfermeriaComp.isHeightCompliant, "Infermeria deve avere altezza conforme");
assert.ok(
  balnInfermeriaComp.summaryBadges.some((b) => b.text.includes("Defibrillatore DAE")),
  "Infermeria deve avere badge DAE in teca climatica antisalsedine",
);

// 5. Batteria Cabine Spogliatoi Ospiti & Deposito Giochi Spiaggia
const balnCabine = balnEnvs.find((e) => e.id === "env-baln-cabine-spogliatoi")!;
assert.equal(balnCabine.category, "services");
assert.equal(balnCabine.surfaceSqM, 80);
assert.equal(balnCabine.heightM, 2.4);
assert.equal(balnCabine.volumeCuM, 192);
assert.equal(balnCabine.occupantsCount, 4);
const balnCabineComp = evaluateEnvironmentCompliance(balnCabine, "93.29.20");
assert.ok(balnCabineComp.isHeightCompliant, "Cabine spogliatoio devono avere altezza conforme (2.40 m)");
assert.ok(
  balnCabineComp.summaryBadges.some((b) => b.text.includes("Cabina spogliatoio disabili PMR")),
  "Cabine spogliatoio devono avere badge PMR accessibile",
);

// 6. Blocco Servizi Igienici & Docce Esterne/Calde (con PMR D.P.R. 503/96)
const balnDocce = balnEnvs.find((e) => e.id === "env-baln-blocchi-servizi-docce")!;
assert.equal(balnDocce.category, "services");
assert.equal(balnDocce.surfaceSqM, 60);
assert.equal(balnDocce.heightM, 2.6);
assert.equal(balnDocce.volumeCuM, 156);
assert.equal(balnDocce.occupantsCount, 6);
const balnDocceComp = evaluateEnvironmentCompliance(balnDocce, "93.29.20");
assert.ok(balnDocceComp.isHeightCompliant, "Docce e bagni devono avere altezza conforme (2.60 m >= 2.40 m)");
assert.ok(
  balnDocceComp.summaryBadges.some((b) => b.text.includes("anti-legionella D.Lgs. 18/2023")),
  "Docce lido devono avere badge prevenzione legionella D.Lgs. 18/2023",
);

// 7. Chiosco Bar sulla Spiaggia & Banco Caffetteria / Gelati
const balnBar = balnEnvs.find((e) => e.id === "env-baln-chiosco-bar")!;
assert.equal(balnBar.category, "production");
assert.equal(balnBar.surfaceSqM, 40);
assert.equal(balnBar.heightM, 3.0);
assert.equal(balnBar.volumeCuM, 120);
assert.equal(balnBar.occupantsCount, 3);
const balnBarComp = evaluateEnvironmentCompliance(balnBar, "93.29.20");
assert.ok(balnBarComp.isHeightCompliant, "Chiosco Bar deve avere altezza conforme");
assert.ok(
  balnBarComp.summaryBadges.some((b) => b.text.includes("Banco bar inox MOCA")),
  "Chiosco Bar deve avere badge inox protetto da sabbia",
);

// 8. Cucina Ristorante del Lido & Preparazione Pesce / Primi
const balnCucina = balnEnvs.find((e) => e.id === "env-baln-ristorante-cucina")!;
assert.equal(balnCucina.category, "production");
assert.equal(balnCucina.surfaceSqM, 50);
assert.equal(balnCucina.heightM, 3.2);
assert.equal(balnCucina.volumeCuM, 160);
assert.equal(balnCucina.occupantsCount, 4);
const balnCucinaComp = evaluateEnvironmentCompliance(balnCucina, "93.29.20");
assert.ok(balnCucinaComp.isHeightCompliant, "Cucina lido deve avere altezza conforme (3.20 m >= 3.00 m)");
assert.ok(
  balnCucinaComp.summaryBadges.some((b) => b.text.includes("spegnimento Ansul R-102")),
  "Cucina lido deve avere badge spegnimento Ansul",
);

// 9. Celle Frigorifere Deperibili (Pesce Fresco +0/+2°C, Surgelati & Bevande)
const balnCelle = balnEnvs.find((e) => e.id === "env-baln-celle-frigo-dispensa")!;
assert.equal(balnCelle.category, "storage");
assert.equal(balnCelle.surfaceSqM, 25);
assert.equal(balnCelle.heightM, 2.6);
assert.equal(balnCelle.volumeCuM, 65);
assert.equal(balnCelle.occupantsCount, 1);
const balnCelleComp = evaluateEnvironmentCompliance(balnCelle, "93.29.20");
assert.ok(balnCelleComp.isHeightCompliant, "Celle frigo deperibili devono avere altezza conforme (2.60 m >= 2.40 m)");
assert.ok(
  balnCelleComp.summaryBadges.some((b) => b.text.includes("Cella pesce fresco")),
  "Celle frigo deperibili devono avere badge pesce fresco +0/+2°C",
);

// 10. Centrale Idrica, Impianto Solare Termico & Accumulo Docce Anti-Legionella
const balnCentraleIdrica = balnEnvs.find((e) => e.id === "env-baln-centrale-idrica-solare")!;
assert.equal(balnCentraleIdrica.category, "technical");
assert.equal(balnCentraleIdrica.surfaceSqM, 20);
assert.equal(balnCentraleIdrica.heightM, 2.6);
assert.equal(balnCentraleIdrica.volumeCuM, 52);
assert.equal(balnCentraleIdrica.occupantsCount, 1);
const balnCentraleIdricaComp = evaluateEnvironmentCompliance(balnCentraleIdrica, "93.29.20");
assert.ok(balnCentraleIdricaComp.isHeightCompliant, "Centrale Idrica deve avere altezza conforme");
assert.ok(
  balnCentraleIdricaComp.summaryBadges.some((b) => b.text.includes("accumulo ACS ≥ 60°C")),
  "Centrale Idrica deve avere badge accumulo ACS >= 60°C anti-legionella",
);

// 11. Rimessaggio Mezzi Spiaggia, Attrezzature Nautiche & Puliscispiaggia
const balnRimessaggio = balnEnvs.find((e) => e.id === "env-baln-rimessaggio-puliscispiaggia")!;
assert.equal(balnRimessaggio.category, "warehouse");
assert.equal(balnRimessaggio.surfaceSqM, 70);
assert.equal(balnRimessaggio.heightM, 3.5);
assert.equal(balnRimessaggio.volumeCuM, 245);
assert.equal(balnRimessaggio.occupantsCount, 2);
const balnRimessaggioComp = evaluateEnvironmentCompliance(balnRimessaggio, "93.29.20");
assert.ok(balnRimessaggioComp.isHeightCompliant, "Rimessaggio deve avere altezza conforme");
assert.ok(
  balnRimessaggioComp.summaryBadges.some((b) => b.text.includes("Macchina puliscispiaggia")),
  "Rimessaggio deve avere badge organi protetti All. V",
);
assert.ok(
  balnRimessaggioComp.summaryBadges.some((b) => b.text.includes("Divieto transito mezzi meccanici su arenile")),
  "Rimessaggio deve avere badge divieto transito con bagnanti",
);

// 12. Isola Ecologica Arenile & Stoccaggio Differenziata Rifiuti Spiaggia
const balnIsolaEcologica = balnEnvs.find((e) => e.id === "env-baln-isola-ecologica-spiaggia")!;
assert.equal(balnIsolaEcologica.category, "technical");
assert.equal(balnIsolaEcologica.surfaceSqM, 40);
assert.equal(balnIsolaEcologica.heightM, 3.0);
assert.equal(balnIsolaEcologica.volumeCuM, 120);
assert.equal(balnIsolaEcologica.occupantsCount, 1);
const balnIsolaEcologicaComp = evaluateEnvironmentCompliance(balnIsolaEcologica, "93.29.20");
assert.ok(balnIsolaEcologicaComp.isHeightCompliant, "Isola ecologica deve avere altezza conforme");
assert.ok(
  balnIsolaEcologicaComp.summaryBadges.some((b) => b.text.includes("Cassonetti differenziata pesanti")),
  "Isola ecologica deve avere badge cassonetti a prova di vento e gabbiani",
);

// ============================================================================
// Test 34: generateEnvironmentChecklistItems per locali Stabilimento Balneare (ATECO 93.29.20)
// ============================================================================
console.log("Test 34: generateEnvironmentChecklistItems per locali Stabilimento Balneare (ATECO 93.29.20)");

// 1. Reception Stabilimento Lido
const balnReceptionItems = generateEnvironmentChecklistItems(balnReception, "93.29.20");
assert.ok(
  balnReceptionItems.some(
    (it) => it.id.includes("postazione-vdt-quadro-differenziale-30ma-estintore") && it.domain === "safety",
  ),
  "Reception Lido deve verificare postazione VDT, differenziale 30 mA ed estintore (domain: safety)",
);
assert.ok(
  balnReceptionItems.some(
    (it) => it.id.includes("planimetria-spiaggia-bilingue-centralina-meteo") && it.domain === "safety",
  ),
  "Reception Lido deve verificare planimetria bilingue e centralina meteo (domain: safety)",
);

// 2. Arenile Attrezzato
const balnArenileItems = generateEnvironmentChecklistItems(balnArenile, "93.29.20");
assert.ok(
  balnArenileItems.some(
    (it) => it.id.includes("passerella-disabili-pmr-battigia-dpr-503-96") && it.domain === "safety",
  ),
  "Arenile deve verificare passerella PMR fino alla battigia D.P.R. 503/96 (domain: safety)",
);
assert.ok(
  balnArenileItems.some(
    (it) => it.id.includes("sedia-anfibia-job-disabili") && it.domain === "safety",
  ),
  "Arenile deve verificare sedia anfibia JOB disabili (domain: safety)",
);
assert.ok(
  balnArenileItems.some(
    (it) => it.id.includes("distanziamento-ombrelloni-corridoi-sicurezza") && it.domain === "both",
  ),
  "Arenile deve verificare distanziamento file ombrelloni e corridoi soccorsi (domain: both)",
);

// 3. Torretta di Avvistamento Bagnino & Salvataggio
const balnSalvataggioItems = generateEnvironmentChecklistItems(balnSalvataggio, "93.29.20");
assert.ok(
  balnSalvataggioItems.some(
    (it) => it.id.includes("torretta-avvistamento-bagnino-abilitato-mip") && it.domain === "safety",
  ),
  "Torretta Salvataggio deve verificare bagnino abilitato MIP/FIN in orario balneazione (domain: safety)",
);
assert.ok(
  balnSalvataggioItems.some(
    (it) => it.id.includes("pattino-salvataggio-salvagente-cima-25m-rullo") && it.domain === "safety",
  ),
  "Torretta Salvataggio deve verificare pattino rosso, rullo 200m e salvagente cima 25m (domain: safety)",
);
assert.ok(
  balnSalvataggioItems.some(
    (it) => it.id.includes("albero-segnali-bandiere-meteo-megafono") && it.domain === "safety",
  ),
  "Torretta Salvataggio deve verificare albero bandiere di segnalazione e megafono (domain: safety)",
);

// 4. Infermeria Spiaggia DAE
const balnInfermeriaItems = generateEnvironmentChecklistItems(balnInfermeria, "93.29.20");
assert.ok(
  balnInfermeriaItems.some(
    (it) => it.id.includes("dae-teca-climatica-antisalsedine-autotest") && it.domain === "safety",
  ),
  "Infermeria deve verificare DAE con autotest verde in teca antisalsedine (domain: safety)",
);
assert.ok(
  balnInfermeriaItems.some(
    (it) => it.id.includes("bombola-ossigeno-flussimetro-pallone-ambu") && it.domain === "safety",
  ),
  "Infermeria deve verificare bombola O2 con flussimetro e pallone AMBU (domain: safety)",
);
assert.ok(
  balnInfermeriaItems.some(
    (it) => it.id.includes("cassetta-pronto-soccorso-allegato-1-farmaci") && it.domain === "safety",
  ),
  "Infermeria deve verificare cassetta pronto soccorso All. 1 (domain: safety)",
);

// 5. Cabine Spogliatoi Ospiti
const balnCabineItems = generateEnvironmentChecklistItems(balnCabine, "93.29.20");
assert.ok(
  balnCabineItems.some(
    (it) => it.id.includes("cabine-pareti-lavabili-aerazione-pulizia") && it.domain === "both",
  ),
  "Cabine spogliatoio devono verificare pareti lavabili e aerazione (domain: both)",
);
assert.ok(
  balnCabineItems.some(
    (it) => it.id.includes("cabina-disabili-pmr-porta-scorrevole-maniglioni") && it.domain === "safety",
  ),
  "Cabine spogliatoio devono verificare cabina PMR con porta scorrevole e maniglioni (domain: safety)",
);

// 6. Blocco Servizi Igienici & Docce Esterne/Calde
const balnDocceItems = generateEnvironmentChecklistItems(balnDocce, "93.29.20");
assert.ok(
  balnDocceItems.some(
    (it) => it.id.includes("protocollo-legionella-soffioni-docce-dlgs-18-2023") && it.domain === "both",
  ),
  "Docce lido devono verificare protocollo anti-legionella soffioni D.Lgs. 18/2023 (domain: both)",
);
assert.ok(
  balnDocceItems.some(
    (it) => it.id.includes("piatti-doccia-antiscivolo-r11-lavapiedi") && it.domain === "safety",
  ),
  "Docce lido devono verificare piatti antiscivolo R11 e lavapiedi (domain: safety)",
);
assert.ok(
  balnDocceItems.some(
    (it) => it.id.includes("bagno-disabili-pmr-tirante-allarme") && it.domain === "safety",
  ),
  "Servizi lido devono verificare tirante allarme bagno disabili PMR (domain: safety)",
);

// 7. Chiosco Bar sulla Spiaggia
const balnBarItems = generateEnvironmentChecklistItems(balnBar, "93.29.20");
assert.ok(
  balnBarItems.some(
    (it) => it.id.includes("banco-bar-inox-protezione-sabbia-salsedine") && it.domain === "haccp",
  ),
  "Chiosco Bar deve verificare banco inox protetto da sabbia e fabbricatore ghiaccio (domain: haccp)",
);
assert.ok(
  balnBarItems.some(
    (it) => it.id.includes("vetrina-gelati-termometro-macchina-caffe-inail") && it.domain === "both",
  ),
  "Chiosco Bar deve verificare vetrina gelati a -18°C e macchina caffè INAIL (domain: both)",
);
assert.ok(
  balnBarItems.some(
    (it) => it.id.includes("lavastoviglie-bicchieri-risciacquo-82-gradi") && it.domain === "haccp",
  ),
  "Chiosco Bar deve verificare lavabicchieri con risciacquo >= 82°C (domain: haccp)",
);

// 8. Cucina Ristorante del Lido
const balnCucinaItems = generateEnvironmentChecklistItems(balnCucina, "93.29.20");
assert.ok(
  balnCucinaItems.some(
    (it) => it.id.includes("cappa-aspirante-filtri-inox-spegnimento-ansul") && it.domain === "both",
  ),
  "Cucina Lido deve verificare cappa con impianto spegnimento Ansul (domain: both)",
);
assert.ok(
  balnCucinaItems.some(
    (it) => it.id.includes("stoccaggio-pesce-fresco-ghiaccio-scolo-separato") && it.domain === "haccp",
  ),
  "Cucina Lido deve verificare pesce fresco su ghiaccio a scolo separato (domain: haccp)",
);
assert.ok(
  balnCucinaItems.some(
    (it) => it.id.includes("pavimentazione-antiscivolo-r12-lavamani-non-manuale") && it.domain === "both",
  ),
  "Cucina Lido deve verificare pavimento antiscivolo R12 e lavamani a pedale (domain: both)",
);

// 9. Celle Frigorifere Deperibili
const balnCelleItems = generateEnvironmentChecklistItems(balnCelle, "93.29.20");
assert.ok(
  balnCelleItems.some(
    (it) => it.id.includes("allarme-uomo-intrappolato-24v-uni-en-378") && it.domain === "safety",
  ),
  "Celle Frigo devono verificare allarme uomo intrappolato a 24V UNI EN 378 (domain: safety)",
);
assert.ok(
  balnCelleItems.some(
    (it) => it.id.includes("teletermometri-registrazione-continua-haccp-pesce") && it.domain === "haccp",
  ),
  "Celle Frigo devono verificare teletermometri continui HACCP (domain: haccp)",
);

// 10. Centrale Idrica & Solare Termico
const balnCentraleIdricaItems = generateEnvironmentChecklistItems(balnCentraleIdrica, "93.29.20");
assert.ok(
  balnCentraleIdricaItems.some(
    (it) => it.id.includes("temperatura-accumulo-acs-60-gradi-solare-termico") && it.domain === "both",
  ),
  "Centrale Idrica deve verificare temperatura accumulo ACS >= 60°C anti-legionella (domain: both)",
);
assert.ok(
  balnCentraleIdricaItems.some(
    (it) => it.id.includes("dosatore-clorazione-acque-registro-manutenzione-filtri") && it.domain === "both",
  ),
  "Centrale Idrica deve verificare dosatore clorazione e registro filtri (domain: both)",
);

// 11. Rimessaggio Puliscispiaggia & Mezzi Nautici
const balnRimessaggioItems = generateEnvironmentChecklistItems(balnRimessaggio, "93.29.20");
assert.ok(
  balnRimessaggioItems.some(
    (it) => it.id.includes("carter-protezione-macchina-puliscispiaggia-all-v") && it.domain === "safety",
  ),
  "Rimessaggio deve verificare carter organi rotanti puliscispiaggia All. V (domain: safety)",
);
assert.ok(
  balnRimessaggioItems.some(
    (it) => it.id.includes("divieto-transito-mezzi-arenile-bagnanti") && it.domain === "safety",
  ),
  "Rimessaggio deve verificare divieto transito mezzi su arenile con bagnanti (domain: safety)",
);
assert.ok(
  balnRimessaggioItems.some(
    (it) => it.id.includes("armadio-tagliafuoco-carburanti-lubrificanti") && it.domain === "safety",
  ),
  "Rimessaggio deve verificare armadio tagliafuoco carburanti benzina REI 90 (domain: safety)",
);

// 12. Isola Ecologica Arenile
const balnIsolaEcologicaItems = generateEnvironmentChecklistItems(balnIsolaEcologica, "93.29.20");
assert.ok(
  balnIsolaEcologicaItems.some(
    (it) => it.id.includes("cassonetti-differenziata-ermetici-antivento-gabbiani") && it.domain === "both",
  ),
  "Isola Ecologica deve verificare cassonetti ermetici zavorrati a prova di vento e gabbiani (domain: both)",
);
assert.ok(
  balnIsolaEcologicaItems.some(
    (it) => it.id.includes("pulizia-compattatore-derattizzazione-perimetrale") && it.domain === "both",
  ),
  "Isola Ecologica deve verificare pulizia compattatore e piano derattizzazione (domain: both)",
);

// Verifica del filtraggio checklistMode su cucina e bar Lido
const balnCucinaHaccpMode = filterEnvironmentItemsByChecklistMode(balnCucinaItems, "haccp_only");
assert.ok(
  balnCucinaHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item cucina Lido devono essere haccp o both",
);
assert.ok(
  !balnCucinaHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item cucina Lido deve avere domain safety",
);

const balnCucinaSafetyMode = filterEnvironmentItemsByChecklistMode(balnCucinaItems, "safety_only");
assert.ok(
  balnCucinaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item cucina Lido devono essere safety o both",
);
assert.ok(
  !balnCucinaSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item cucina Lido deve avere domain haccp",
);

const balnArenileSafetyMode = filterEnvironmentItemsByChecklistMode(balnArenileItems, "safety_only");
assert.ok(
  balnArenileSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item arenile Lido devono essere safety o both",
);

// ============================================================================
// Test 35: getStandardEnvironmentsForAteco & conformità per Discoteche, Sale da Ballo, Night-Club (93.29.10 / 93.29.1 / 932910 / 93291)
// ============================================================================
console.log("Test 35: getStandardEnvironmentsForAteco & conformità per Discoteche, Sale da Ballo (93.29.10 / 93.29.1 / 932910 / 93291)");

const dscEnvs = getStandardEnvironmentsForAteco("93.29.10");
assert.equal(dscEnvs.length, 12, "La Discoteca / Sala da Ballo deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO (93.29.1, 932910, 93291)
const dscEnvsVar1 = getStandardEnvironmentsForAteco("93.29.1");
assert.equal(dscEnvsVar1.length, 12, "Anche prefisso 93.29.1 deve restituire 12 ambienti Discoteca");
const dscEnvsVar2 = getStandardEnvironmentsForAteco("932910");
assert.equal(dscEnvsVar2.length, 12, "Anche codice numerico 932910 deve restituire 12 ambienti Discoteca");
const dscEnvsVar3 = getStandardEnvironmentsForAteco("93291");
assert.equal(dscEnvsVar3.length, 12, "Anche codice numerico 93291 deve restituire 12 ambienti Discoteca");

// Verifica ID dei 12 ambienti standard Discoteca
const expectedDscIds = [
  "env-dsc-ingresso-foyer",
  "env-dsc-guardaroba-deposito",
  "env-dsc-pista-ballo-centrale",
  "env-dsc-consolle-dj-regia",
  "env-dsc-cocktail-bar-principale",
  "env-dsc-secondo-bar-estivo",
  "env-dsc-area-tavoli-prive",
  "env-dsc-cucina-snack-food",
  "env-dsc-dispensa-beverage",
  "env-dsc-infermeria-primo-soccorso",
  "env-dsc-blocco-servizi-igienici",
  "env-dsc-locale-tecnico-quadri",
];

for (const id of expectedDscIds) {
  assert.ok(
    dscEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard Discoteca per 93.29.10`,
  );
}

// 1. Ingresso Principale, Foyer, Biglietteria & Cassa / Filtro Conta-Persone
const dscIngresso = dscEnvs.find((e) => e.id === "env-dsc-ingresso-foyer")!;
assert.equal(dscIngresso.category, "sales_office");
assert.equal(dscIngresso.surfaceSqM, 60);
assert.equal(dscIngresso.heightM, 3.2);
assert.equal(dscIngresso.volumeCuM, 192);
assert.equal(dscIngresso.occupantsCount, 4);
const evalIngresso = evaluateEnvironmentCompliance(dscIngresso, "93.29.10");
assert.ok(evalIngresso.isHeightCompliant, "Altezza Foyer (3,20 m) deve essere a norma");
assert.ok(
  evalIngresso.summaryBadges.some((b) => b.text.includes("ASC abilitato D.M. 06/10/2009")),
  "Foyer deve avere badge controllo accessi ASC",
);
assert.ok(
  evalIngresso.summaryBadges.some((b) => b.text.includes("conta-persone")),
  "Foyer deve avere badge conta-persone",
);

// 2. Locale Guardaroba Ospiti & Deposito Oggetti Smarriti / Caschi
const dscGuardaroba = dscEnvs.find((e) => e.id === "env-dsc-guardaroba-deposito")!;
assert.equal(dscGuardaroba.category, "services");
assert.equal(dscGuardaroba.surfaceSqM, 40);
assert.equal(dscGuardaroba.heightM, 3.0);
const evalGuardaroba = evaluateEnvironmentCompliance(dscGuardaroba, "93.29.10");
assert.ok(evalGuardaroba.isHeightCompliant, "Altezza Guardaroba (3,00 m) deve essere a norma");
assert.ok(
  evalGuardaroba.summaryBadges.some((b) => b.text.includes("Rastrelliere")),
  "Guardaroba deve avere badge rastrelliere ignifughe",
);

// 3. Pista da Ballo Centrale & Platea Spettacolo
const dscPista = dscEnvs.find((e) => e.id === "env-dsc-pista-ballo-centrale")!;
assert.equal(dscPista.category, "production");
assert.equal(dscPista.surfaceSqM, 400);
assert.equal(dscPista.heightM, 5.0);
assert.equal(dscPista.volumeCuM, 2000);
assert.equal(dscPista.occupantsCount, 400);
const evalPista = evaluateEnvironmentCompliance(dscPista, "93.29.10");
assert.ok(evalPista.isHeightCompliant, "Altezza Pista (5,00 m) deve essere a norma");
assert.ok(evalPista.cpiActivityAlert !== null, "Pista da 400 mq / 400 persone deve attivare alert Attività 65 CPI");
assert.equal(evalPista.cpiActivityAlert?.code, "Attività 65 (D.P.R. 151/2011)");
assert.ok(
  evalPista.summaryBadges.some((b) => b.text.includes("UNI EN 1125")),
  "Pista deve avere badge uscite con maniglioni antipanico UNI EN 1125",
);
assert.ok(
  evalPista.summaryBadges.some((b) => b.text.includes("EVAC") && b.text.includes("zittimento automatico")),
  "Pista deve avere badge EVAC con zittimento automatico",
);
assert.ok(
  evalPista.summaryBadges.some((b) => b.text.includes("≥ 5 lux")),
  "Pista deve avere badge illuminazione emergenza ≥ 5 lux",
);

// 4. Consolle DJ, Palco Animazione & Regia Audio/Luci/Laser
const dscConsolle = dscEnvs.find((e) => e.id === "env-dsc-consolle-dj-regia")!;
assert.equal(dscConsolle.category, "production");
assert.equal(dscConsolle.surfaceSqM, 35);
assert.equal(dscConsolle.heightM, 3.5);
const evalConsolle = evaluateEnvironmentCompliance(dscConsolle, "93.29.10");
assert.ok(evalConsolle.isHeightCompliant, "Altezza Consolle DJ (3,50 m) deve essere a norma");
assert.ok(
  evalConsolle.summaryBadges.some((b) => b.text.includes("Titolo VIII") && b.text.includes("otoprotettori")),
  "Consolle DJ deve avere badge otoprotettori rumore Titolo VIII",
);
assert.ok(
  evalConsolle.summaryBadges.some((b) => b.text.includes("Limitatore acustico sigillato") && b.text.includes("D.P.C.M. 215/99")),
  "Consolle DJ deve avere badge limitatore acustico sigillato D.P.C.M. 215/99",
);
assert.ok(
  evalConsolle.summaryBadges.some((b) => b.text.includes("Laser show") && b.text.includes("> 3 m")),
  "Consolle DJ deve avere badge laser show a quota > 3m CEI EN 60825-1",
);

// 5. Cocktail Bar Principale & Banchi di Mescita Bevande
const dscCocktailBar = dscEnvs.find((e) => e.id === "env-dsc-cocktail-bar-principale")!;
assert.equal(dscCocktailBar.category, "production");
assert.equal(dscCocktailBar.surfaceSqM, 70);
assert.equal(dscCocktailBar.heightM, 3.2);
const evalCocktailBar = evaluateEnvironmentCompliance(dscCocktailBar, "93.29.10");
assert.ok(evalCocktailBar.isHeightCompliant, "Altezza Cocktail Bar Principale (3,20 m) deve essere a norma");
assert.ok(
  evalCocktailBar.summaryBadges.some((b) => b.text.includes("≥ 82°C")),
  "Cocktail Bar Principale deve avere badge risciacquo lavabicchieri ≥ 82°C",
);
assert.ok(
  evalCocktailBar.summaryBadges.some((b) => b.text.includes("MOCA")),
  "Cocktail Bar Principale deve avere badge fabbricatore ghiaccio MOCA",
);

// 6. Cocktail Bar Secondario / Area Bar Privé
const dscBarSecondario = dscEnvs.find((e) => e.id === "env-dsc-secondo-bar-estivo")!;
assert.equal(dscBarSecondario.category, "production");
assert.equal(dscBarSecondario.surfaceSqM, 35);
const evalBarSecondario = evaluateEnvironmentCompliance(dscBarSecondario, "93.29.10");
assert.ok(evalBarSecondario.isHeightCompliant, "Altezza Bar Secondario (3,00 m) deve essere a norma");

// 7. Area Privé, Salottini VIP & Tavoli con Servizio Bottiglie
const dscPrive = dscEnvs.find((e) => e.id === "env-dsc-area-tavoli-prive")!;
assert.equal(dscPrive.category, "sales_office");
assert.equal(dscPrive.surfaceSqM, 120);
assert.equal(dscPrive.occupantsCount, 80);
const evalPrive = evaluateEnvironmentCompliance(dscPrive, "93.29.10");
assert.ok(evalPrive.isHeightCompliant, "Altezza Privé (3,50 m) deve essere a norma");
assert.ok(
  evalPrive.summaryBadges.some((b) => b.text.includes("classe 1 IM")),
  "Privé deve avere badge arredi imbottiti classe 1 IM",
);
assert.ok(
  evalPrive.summaryBadges.some((b) => b.text.includes("≥ 1,20 m")),
  "Privé deve avere badge corsie di passaggio ≥ 1,20 m",
);

// 8. Cucina Snack Bar, Friggitoria & Preparazione Food Notturno
const dscCucina = dscEnvs.find((e) => e.id === "env-dsc-cucina-snack-food")!;
assert.equal(dscCucina.category, "production");
assert.equal(dscCucina.surfaceSqM, 35);
const evalCucina = evaluateEnvironmentCompliance(dscCucina, "93.29.10");
assert.ok(evalCucina.isHeightCompliant, "Altezza Cucina Snack (3,00 m) deve essere a norma");
assert.ok(
  evalCucina.summaryBadges.some((b) => b.text.includes("Ansul")),
  "Cucina Snack deve avere badge spegnimento Ansul",
);
assert.ok(
  evalCucina.summaryBadges.some((b) => b.text.includes("< 230°C")),
  "Cucina Snack deve avere badge termostato friggitrice < 230°C",
);

// 9. Magazzino Merci Secche, Scorte Fusti Birra & Deposito Beverage
const dscMagazzino = dscEnvs.find((e) => e.id === "env-dsc-dispensa-beverage")!;
assert.equal(dscMagazzino.category, "warehouse");
assert.equal(dscMagazzino.surfaceSqM, 50);
const evalMagazzino = evaluateEnvironmentCompliance(dscMagazzino, "93.29.10");
assert.ok(evalMagazzino.isHeightCompliant, "Altezza Magazzino Beverage (3,20 m) deve essere a norma");
assert.ok(
  evalMagazzino.summaryBadges.some((b) => b.text.includes("CO2/azoto") && b.text.includes("1.5% e 3%")),
  "Magazzino Beverage deve avere badge rilevatore fughe gas CO2/azoto",
);
assert.ok(
  evalMagazzino.summaryBadges.some((b) => b.text.includes("catene metalliche")),
  "Magazzino Beverage deve avere badge bombole assicurate con catene",
);

// 10. Locale Infermeria di Presidio, Primo Soccorso & Postazione DAE
const dscInfermeria = dscEnvs.find((e) => e.id === "env-dsc-infermeria-primo-soccorso")!;
assert.equal(dscInfermeria.category, "services");
assert.equal(dscInfermeria.surfaceSqM, 18);
const evalInfermeria = evaluateEnvironmentCompliance(dscInfermeria, "93.29.10");
assert.ok(evalInfermeria.isHeightCompliant, "Altezza Infermeria (2,70 m) deve essere a norma");
assert.ok(
  evalInfermeria.summaryBadges.some((b) => b.text.includes("DAE") && b.text.includes("Legge 116/2021")),
  "Infermeria deve avere badge DAE Legge 116/2021",
);
assert.ok(
  evalInfermeria.summaryBadges.some((b) => b.text.includes("ossigeno terapeutico")),
  "Infermeria deve avere badge bombola ossigeno terapeutico",
);

// 11. Blocchi Servizi Igienici & Servizio Disabili PMR (D.M. 236/89)
const dscBagni = dscEnvs.find((e) => e.id === "env-dsc-blocco-servizi-igienici")!;
assert.equal(dscBagni.category, "services");
assert.equal(dscBagni.surfaceSqM, 50);
assert.equal(dscBagni.heightM, 2.4);
const evalBagni = evaluateEnvironmentCompliance(dscBagni, "93.29.10");
assert.ok(evalBagni.isHeightCompliant, "Altezza Bagni (2,40 m) deve essere a norma");
assert.ok(
  evalBagni.summaryBadges.some((b) => b.text.includes("PMR") && b.text.includes("tirante allarme")),
  "Bagni devono avere badge bagno disabili PMR con tirante allarme",
);

// 12. Locale Tecnico / Cabina Elettrica Principale & Gruppo di Continuità (UPS)
const dscLocaleTecnico = dscEnvs.find((e) => e.id === "env-dsc-locale-tecnico-quadri")!;
assert.equal(dscLocaleTecnico.category, "technical");
assert.equal(dscLocaleTecnico.surfaceSqM, 25);
const evalLocaleTecnico = evaluateEnvironmentCompliance(dscLocaleTecnico, "93.29.10");
assert.ok(evalLocaleTecnico.isHeightCompliant, "Altezza Locale Tecnico (3,00 m) deve essere a norma");
assert.ok(
  evalLocaleTecnico.summaryBadges.some((b) => b.text.includes("Pulsante di sgancio generale di emergenza esterno")),
  "Locale Tecnico deve avere badge pulsante di sgancio generale",
);
assert.ok(
  evalLocaleTecnico.summaryBadges.some((b) => b.text.includes("≥ 2 ore")),
  "Locale Tecnico deve avere badge gruppo UPS con autonomia ≥ 2 ore",
);

// ============================================================================
// Test 36: generateEnvironmentChecklistItems per locali Discoteca e Locali Serali (ATECO 93.29.10)
// ============================================================================
console.log("Test 36: generateEnvironmentChecklistItems per locali Discoteca (ATECO 93.29.10)");

// 1. Pista da Ballo Centrale
const dscPistaItems = generateEnvironmentChecklistItems(dscPista, "93.29.10");
assert.ok(
  dscPistaItems.some(
    (it) => it.id.includes("uscite-sicurezza-maniglioni-antipanico-uni-en-1125") && it.domain === "safety" && it.defaultSeverity === 4,
  ),
  "Pista deve verificare uscite di emergenza con maniglioni antipanico UNI EN 1125 a spinta (domain: safety, severity 4)",
);
assert.ok(
  dscPistaItems.some(
    (it) => it.id.includes("zittimento-automatico-evac-diffusione-sonora") && it.domain === "safety" && it.defaultSeverity === 4,
  ),
  "Pista deve verificare zittimento automatico EVAC diffusione sonora su allarme (domain: safety, severity 4)",
);
assert.ok(
  dscPistaItems.some(
    (it) => it.id.includes("illuminazione-emergenza-5-lux-pavimento-ignifugo") && it.domain === "safety",
  ),
  "Pista deve verificare illuminazione di emergenza ≥ 5 lux e pavimento R10 (domain: safety)",
);
assert.ok(
  dscPistaItems.some(
    (it) => it.id.includes("capienza-massima-autorizzata-ccvlps") && it.domain === "safety",
  ),
  "Pista deve verificare rispetto capienza massima CCVLPS (domain: safety)",
);

// 2. Consolle DJ, Palco Animazione & Regia Audio/Luci/Laser
const dscConsolleItems = generateEnvironmentChecklistItems(dscConsolle, "93.29.10");
assert.ok(
  dscConsolleItems.some(
    (it) => it.id.includes("fascicolo-laser-show-interblocco-quota-3m") && it.domain === "safety",
  ),
  "Consolle DJ deve verificare laser show quota > 3m e fascicolo TSL (domain: safety)",
);
assert.ok(
  dscConsolleItems.some(
    (it) => it.id.includes("limitatore-acustico-sigillato-dpcm-215-99") && it.domain === "safety",
  ),
  "Consolle DJ deve verificare limitatore acustico sigillato D.P.C.M. 215/99 (domain: safety)",
);
assert.ok(
  dscConsolleItems.some(
    (it) => it.id.includes("otoprotettori-dpi-rumore-sorveglianza-sanitaria-dj") && it.domain === "safety",
  ),
  "Consolle DJ deve verificare DPI otoprotettori e sorveglianza sanitaria audiometrica (domain: safety)",
);

// 3. Ingresso Principale, Foyer & Cassa
const dscIngressoItems = generateEnvironmentChecklistItems(dscIngresso, "93.29.10");
assert.ok(
  dscIngressoItems.some(
    (it) => it.id.includes("addetti-controllo-asc-elenco-prefettizio") && it.domain === "safety",
  ),
  "Foyer deve verificare addetti sicurezza ASC iscritti all'elenco prefettizio (domain: safety)",
);
assert.ok(
  dscIngressoItems.some(
    (it) => it.id.includes("conta-persone-digitale-capienza-ccvlps") && it.domain === "safety",
  ),
  "Foyer deve verificare dispositivi conta-persone digitali per capienza CCVLPS (domain: safety)",
);
assert.ok(
  dscIngressoItems.some(
    (it) => it.id.includes("planimetria-esodo-bilingue-estintori-34a-233b") && it.domain === "safety",
  ),
  "Foyer deve verificare planimetria di esodo bilingue ed estintori 34A 233B (domain: safety)",
);

// 4. Area Privé & Salottini VIP
const dscPriveItems = generateEnvironmentChecklistItems(dscPrive, "93.29.10");
assert.ok(
  dscPriveItems.some(
    (it) => it.id.includes("reazione-fuoco-arredi-imbottiti-classe-1-im") && it.domain === "safety",
  ),
  "Privé deve verificare omologazione reazione al fuoco classe 1 IM per poltrone (domain: safety)",
);
assert.ok(
  dscPriveItems.some(
    (it) => it.id.includes("corsie-passaggio-tavoli-uscite-sicurezza") && it.domain === "safety",
  ),
  "Privé deve verificare corsie di passaggio libere verso le uscite ≥ 1,20 m (domain: safety)",
);

// 5. Cocktail Bar Principale & Banchi di Mescita
const dscCocktailBarItems = generateEnvironmentChecklistItems(dscCocktailBar, "93.29.10");
assert.ok(
  dscCocktailBarItems.some(
    (it) => it.id.includes("lavabicchieri-risciacquo-82-gradi-sanificazione") && it.domain === "both",
  ),
  "Cocktail Bar deve verificare lavabicchieri con risciacquo ≥ 82°C per sanificazione (domain: both)",
);
assert.ok(
  dscCocktailBarItems.some(
    (it) => it.id.includes("igiene-fabbricatore-pozzetto-ghiaccio-moca") && it.domain === "haccp",
  ),
  "Cocktail Bar deve verificare igiene e conformità MOCA del fabbricatore ghiaccio (domain: haccp)",
);
assert.ok(
  dscCocktailBarItems.some(
    (it) => it.id.includes("pedana-antiscivolo-drenante-barman-sicurezza") && it.domain === "safety",
  ),
  "Cocktail Bar deve verificare pedana drenante antiscivolo per barman (domain: safety)",
);

// 6. Cocktail Bar Secondario / Area Privé
const dscBarSecondarioItems = generateEnvironmentChecklistItems(dscBarSecondario, "93.29.10");
assert.ok(
  dscBarSecondarioItems.some(
    (it) => it.id.includes("lavabicchieri-risciacquo-82-gradi-sanificazione") && it.domain === "both",
  ),
  "Bar Secondario deve verificare lavabicchieri con risciacquo ≥ 82°C (domain: both)",
);

// 7. Cucina Snack Bar, Friggitoria & Food Notturno
const dscCucinaItems = generateEnvironmentChecklistItems(dscCucina, "93.29.10");
assert.ok(
  dscCucinaItems.some(
    (it) => it.id.includes("cappa-compensata-spegnimento-ansul-friggitrici") && it.domain === "both",
  ),
  "Cucina Snack deve verificare cappa compensata con estinzione Ansul (domain: both)",
);
assert.ok(
  dscCucinaItems.some(
    (it) => it.id.includes("termostato-sicurezza-friggitrici-230-gradi") && it.domain === "safety",
  ),
  "Cucina Snack deve verificare termostato friggitrice < 230°C a riarmo manuale (domain: safety)",
);
assert.ok(
  dscCucinaItems.some(
    (it) => it.id.includes("lavamani-pedale-pareti-lavabili-zanzariere") && it.domain === "both",
  ),
  "Cucina Snack deve verificare lavamani a pedale, pareti lavabili a 2m e zanzariere (domain: both)",
);

// 8. Magazzino Merci Secche & Deposito Beverage
const dscMagazzinoItems = generateEnvironmentChecklistItems(dscMagazzino, "93.29.10");
assert.ok(
  dscMagazzinoItems.some(
    (it) => it.id.includes("rilevatore-fughe-co2-allarme-spillatura-birra") && it.domain === "safety" && it.defaultSeverity === 4,
  ),
  "Magazzino Beverage deve verificare sensore allarme fughe CO2 al 1.5% e 3% (domain: safety, severity 4)",
);
assert.ok(
  dscMagazzinoItems.some(
    (it) => it.id.includes("ancoraggio-bombole-gas-compresso-catenelle") && it.domain === "safety",
  ),
  "Magazzino Beverage deve verificare bombole gas vincolate con catenelle (domain: safety)",
);
assert.ok(
  dscMagazzinoItems.some(
    (it) => it.id.includes("scaffalature-certificate-stoccaggio-sollevato-15cm") && it.domain === "both",
  ),
  "Magazzino Beverage deve verificare scaffalature con portata e merci sollevate ≥ 15 cm (domain: both)",
);

// 9. Locale Infermeria di Presidio, Primo Soccorso & Postazione DAE
const dscInfermeriaItems = generateEnvironmentChecklistItems(dscInfermeria, "93.29.10");
assert.ok(
  dscInfermeriaItems.some(
    (it) => it.id.includes("defibrillatore-dae-teca-allarmata-autotest-verde") && it.domain === "safety" && it.defaultSeverity === 4,
  ),
  "Infermeria deve verificare DAE con autotest verde Legge 116/2021 (domain: safety, severity 4)",
);
assert.ok(
  dscInfermeriaItems.some(
    (it) => it.id.includes("bombola-ossigeno-ambu-cassetta-pronto-soccorso-all-1") && it.domain === "safety",
  ),
  "Infermeria deve verificare bombola ossigeno collaudata, pallone AMBU e cassetta All. 1 (domain: safety)",
);
assert.ok(
  dscInfermeriaItems.some(
    (it) => it.id.includes("barella-telo-sedia-portantina-soccorso") && it.domain === "safety",
  ),
  "Infermeria deve verificare barella a telo o sedia portantina per ambulanza 118 (domain: safety)",
);

// 10. Blocchi Servizi Igienici & Servizio Disabili PMR (D.M. 236/89)
const dscBagniItems = generateEnvironmentChecklistItems(dscBagni, "93.29.10");
assert.ok(
  dscBagniItems.some(
    (it) => it.id.includes("bagno-disabili-pmr-tirante-allarme-dm-236-89") && it.domain === "safety",
  ),
  "Bagni devono verificare bagno PMR con tirante allarme a campanello D.M. 236/89 (domain: safety)",
);
assert.ok(
  dscBagniItems.some(
    (it) => it.id.includes("aerazione-forzata-permanente-bagni-ciechi") && it.domain === "both",
  ),
  "Bagni devono verificare aerazione forzata permanente bagni ciechi (domain: both)",
);

// 11. Locale Tecnico / Cabina Elettrica Principale & Gruppo di Continuità (UPS)
const dscLocaleTecnicoItems = generateEnvironmentChecklistItems(dscLocaleTecnico, "93.29.10");
assert.ok(
  dscLocaleTecnicoItems.some(
    (it) => it.id.includes("pulsante-sgancio-emergenza-esterno-bobina") && it.domain === "safety",
  ),
  "Locale Tecnico deve verificare pulsante di sgancio generale di emergenza esterno (domain: safety)",
);
assert.ok(
  dscLocaleTecnicoItems.some(
    (it) => it.id.includes("soccorritore-ups-emergenza-autonomia-2-ore") && it.domain === "safety",
  ),
  "Locale Tecnico deve verificare gruppo soccorritore/UPS con autonomia ≥ 2 ore (domain: safety)",
);

// 12. Verifica del filtraggio checklistMode su cucina e cocktail bar della Discoteca
const dscCocktailBarHaccpMode = filterEnvironmentItemsByChecklistMode(dscCocktailBarItems, "haccp_only");
assert.ok(
  dscCocktailBarHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item del Cocktail Bar devono essere haccp o both",
);
assert.ok(
  !dscCocktailBarHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item del Cocktail Bar deve avere domain safety",
);

const dscCocktailBarSafetyMode = filterEnvironmentItemsByChecklistMode(dscCocktailBarItems, "safety_only");
assert.ok(
  dscCocktailBarSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item del Cocktail Bar devono essere safety o both",
);
assert.ok(
  !dscCocktailBarSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item del Cocktail Bar deve avere domain haccp",
);

const dscPistaSafetyMode = filterEnvironmentItemsByChecklistMode(dscPistaItems, "safety_only");
assert.ok(
  dscPistaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item della Pista devono essere safety o both",
);

// ============================================================================
// Test 37: getStandardEnvironmentsForAteco & conformità per Pasticcerie, Gelaterie Artigianali con Laboratorio e Somministrazione (56.10.30 / 56.10.3 / 561030 / 56103)
// ============================================================================
console.log("Test 37: getStandardEnvironmentsForAteco & conformità per Pasticcerie, Gelaterie Artigianali (56.10.30 / 56.10.3 / 561030 / 56103)");

const pastryEnvs = getStandardEnvironmentsForAteco("56.10.30");
assert.equal(pastryEnvs.length, 12, "La Pasticceria e Gelateria artigianale deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO (56.10.3, 561030, 56103)
const pastryEnvsVar1 = getStandardEnvironmentsForAteco("56.10.3");
assert.equal(pastryEnvsVar1.length, 12, "Anche prefisso 56.10.3 deve restituire 12 ambienti Pasticceria/Gelateria");
const pastryEnvsVar2 = getStandardEnvironmentsForAteco("561030");
assert.equal(pastryEnvsVar2.length, 12, "Anche codice numerico 561030 deve restituire 12 ambienti Pasticceria/Gelateria");
const pastryEnvsVar3 = getStandardEnvironmentsForAteco("56103");
assert.equal(pastryEnvsVar3.length, 12, "Anche codice numerico 56103 deve restituire 12 ambienti Pasticceria/Gelateria");

// Verifica ID dei 12 ambienti standard Pasticceria/Gelateria
const expectedPastryIds = [
  "env-pastry-laboratorio-pasticceria",
  "env-pastry-laboratorio-gelateria",
  "env-pastry-decorazione-cioccolateria",
  "env-pastry-cella-frigo-materie-prime",
  "env-pastry-cella-negativa-semifreddi",
  "env-pastry-dispensa-farine-zuccheri",
  "env-pastry-plonge-lavaggio-teglie",
  "env-pastry-area-vendita-banco-vetrine",
  "env-pastry-banco-caffetteria-snack",
  "env-pastry-sala-consumazione-tavoli",
  "env-pastry-spogliatoi-servizi-personale",
  "env-pastry-locale-tecnico-compressori",
];

for (const id of expectedPastryIds) {
  assert.ok(
    pastryEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard Pasticceria/Gelateria per 56.10.30`,
  );
}

// 1. Laboratorio Principale di Pasticceria, Forni & Cottura
const pastLabPastry = pastryEnvs.find((e) => e.id === "env-pastry-laboratorio-pasticceria")!;
assert.equal(pastLabPastry.category, "production");
assert.equal(pastLabPastry.surfaceSqM, 45);
assert.equal(pastLabPastry.heightM, 3.0);
assert.equal(pastLabPastry.volumeCuM, 135);
assert.equal(pastLabPastry.occupantsCount, 3);
assert.equal(pastLabPastry.emergencyExitsCount, 1);
assert.equal(pastLabPastry.windowSurfaceSqM, 4.5);
assert.equal(pastLabPastry.features.forcedExhaustPresent, true);
assert.equal(pastLabPastry.features.forcedExhaustType, "kitchen_hood");
assert.equal(pastLabPastry.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(pastLabPastry.features.flooringCondition, "compliant_anti_slip");
const evalPastryLab = evaluateEnvironmentCompliance(pastLabPastry, "56.10.30");
assert.ok(evalPastryLab.isHeightCompliant, "Altezza Laboratorio Pasticceria (3,00 m) deve essere a norma (min 3.0m)");
assert.equal(evalPastryLab.minHeightRequired, 3.0);
assert.ok(
  evalPastryLab.summaryBadges.some((b) => b.text.includes("sfogliatrice protetta (UNI EN 1674)")),
  "Laboratorio Pasticceria deve avere badge cappa fumi e sfogliatrice protetta",
);
assert.ok(
  evalPastryLab.summaryBadges.some((b) => b.text.includes("Lavamani comando non manuale")),
  "Laboratorio Pasticceria deve avere badge lavamani comando non manuale",
);

// 2. Laboratorio di Gelateria, Miscelazione & Mantecazione
const pastLabGelato = pastryEnvs.find((e) => e.id === "env-pastry-laboratorio-gelateria")!;
assert.equal(pastLabGelato.category, "production");
assert.equal(pastLabGelato.surfaceSqM, 30);
assert.equal(pastLabGelato.heightM, 3.0);
assert.equal(pastLabGelato.volumeCuM, 90);
assert.equal(pastLabGelato.occupantsCount, 2);
assert.equal(pastLabGelato.emergencyExitsCount, 1);
assert.equal(pastLabGelato.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(pastLabGelato.features.flooringCondition, "compliant_anti_slip");
const evalPastryGelato = evaluateEnvironmentCompliance(pastLabGelato, "56.10.30");
assert.ok(evalPastryGelato.isHeightCompliant, "Altezza Laboratorio Gelateria (3,00 m) deve essere a norma (min 3.0m)");
assert.equal(evalPastryGelato.minHeightRequired, 3.0);
assert.ok(
  evalPastryGelato.summaryBadges.some((b) => b.text.includes("pastorizzatore con registrazione HACCP")),
  "Laboratorio Gelateria deve avere badge pastorizzatore HACCP",
);
assert.ok(
  evalPastryGelato.summaryBadges.some((b) => b.text.includes("Abbattitore rapido")),
  "Laboratorio Gelateria deve avere badge abbattitore rapido",
);

// 3. Area Finitura, Decorazione Dolci, Pralineria & Cake Design
const pastDecorazione = pastryEnvs.find((e) => e.id === "env-pastry-decorazione-cioccolateria")!;
assert.equal(pastDecorazione.category, "production");
assert.equal(pastDecorazione.surfaceSqM, 20);
assert.equal(pastDecorazione.heightM, 2.8);
assert.equal(pastDecorazione.volumeCuM, 56);
assert.equal(pastDecorazione.occupantsCount, 2);
const evalPastryDecorazione = evaluateEnvironmentCompliance(pastDecorazione, "56.10.30");
assert.ok(evalPastryDecorazione.isHeightCompliant, "Altezza Area Decorazione (2,80 m) deve essere a norma (min 2.7m)");
assert.equal(evalPastryDecorazione.minHeightRequired, 2.7);
assert.ok(
  evalPastryDecorazione.summaryBadges.some((b) => b.text.includes("microclima controllato (18-20°C")),
  "Area Decorazione deve avere badge microclima controllato",
);
assert.ok(
  evalPastryDecorazione.summaryBadges.some((b) => b.text.includes("Piani in granito")),
  "Area Decorazione deve avere badge piani in granito e MOCA",
);

// 4. Cella Frigorifera Materie Prime Deperibili (+4°C)
const pastCellaPos = pastryEnvs.find((e) => e.id === "env-pastry-cella-frigo-materie-prime")!;
assert.equal(pastCellaPos.category, "storage");
assert.equal(pastCellaPos.surfaceSqM, 12);
assert.equal(pastCellaPos.heightM, 2.5);
assert.equal(pastCellaPos.volumeCuM, 30);
const evalPastryCellaPos = evaluateEnvironmentCompliance(pastCellaPos, "56.10.30");
assert.ok(evalPastryCellaPos.isHeightCompliant, "Altezza Cella Materie Prime (2,50 m) deve essere a norma (min 2.4m)");
assert.equal(evalPastryCellaPos.minHeightRequired, 2.4);
assert.ok(
  evalPastryCellaPos.summaryBadges.some((b) => b.text.includes("teletermometro continuo HACCP")),
  "Cella Materie Prime deve avere badge teletermometro",
);
assert.ok(
  evalPastryCellaPos.summaryBadges.some((b) => b.text.includes("Scaffalature forate MOCA sollevate ≥ 15 cm")),
  "Cella Materie Prime deve avere badge scaffalature MOCA",
);

// 5. Cella Frigorifera / Congelatore Negativo Semifreddi e Gelati (-18°/-25°C)
const pastCellaNeg = pastryEnvs.find((e) => e.id === "env-pastry-cella-negativa-semifreddi")!;
assert.equal(pastCellaNeg.category, "storage");
assert.equal(pastCellaNeg.surfaceSqM, 12);
assert.equal(pastCellaNeg.heightM, 2.5);
assert.equal(pastCellaNeg.volumeCuM, 30);
const evalPastryCellaNeg = evaluateEnvironmentCompliance(pastCellaNeg, "56.10.30");
assert.ok(evalPastryCellaNeg.isHeightCompliant, "Altezza Cella Negativa (2,50 m) deve essere a norma (min 2.4m)");
assert.equal(evalPastryCellaNeg.minHeightRequired, 2.4);
assert.ok(
  evalPastryCellaNeg.summaryBadges.some((b) => b.text.includes("pulsante luminoso uomo intrappolato") && b.status === "danger"),
  "Cella Negativa deve avere badge pericolo allarme uomo intrappolato UNI EN 378",
);
assert.ok(
  evalPastryCellaNeg.summaryBadges.some((b) => b.text.includes("resistenza termica anticongelamento")),
  "Cella Negativa deve avere badge resistenza anticongelamento porta",
);

// 6. Magazzino / Deposito Merci Secche, Farine e Zuccheri
const pastDispensa = pastryEnvs.find((e) => e.id === "env-pastry-dispensa-farine-zuccheri")!;
assert.equal(pastDispensa.category, "warehouse");
assert.equal(pastDispensa.surfaceSqM, 25);
assert.equal(pastDispensa.heightM, 2.7);
assert.equal(pastDispensa.volumeCuM, 67.5);
assert.equal(pastDispensa.features.shelvingCertified, true);
const evalPastryDispensa = evaluateEnvironmentCompliance(pastDispensa, "56.10.30");
assert.ok(evalPastryDispensa.isHeightCompliant, "Altezza Deposito Farine (2,70 m) deve essere a norma (min 2.7m)");
assert.equal(evalPastryDispensa.minHeightRequired, 2.7);
assert.ok(
  evalPastryDispensa.summaryBadges.some((b) => b.text.includes("pedane sollevate ≥ 15 cm")),
  "Deposito Farine deve avere badge stoccaggio sacchi su pedane sollevate",
);
assert.ok(
  evalPastryDispensa.summaryBadges.some((b) => b.text.includes("tarme della farina")),
  "Deposito Farine deve avere badge trappole tarme e lampada UV",
);

// 7. Plonge / Locale Lavaggio Teglie 60x40, Carapine e Attrezzi Laboratorio
const pastPlonge = pastryEnvs.find((e) => e.id === "env-pastry-plonge-lavaggio-teglie")!;
assert.equal(pastPlonge.category, "production");
assert.equal(pastPlonge.surfaceSqM, 15);
assert.equal(pastPlonge.heightM, 2.7);
assert.equal(pastPlonge.volumeCuM, 40.5);
assert.equal(pastPlonge.features.forcedExhaustPresent, true);
const evalPastryPlonge = evaluateEnvironmentCompliance(pastPlonge, "56.10.30");
assert.ok(evalPastryPlonge.isHeightCompliant, "Altezza Plonge Teglie (2,70 m) deve essere a norma (min 2.7m)");
assert.equal(evalPastryPlonge.minHeightRequired, 2.7);
assert.ok(
  evalPastryPlonge.summaryBadges.some((b) => b.text.includes("risciacquo 85°C DIN 10512")),
  "Plonge deve avere badge risciacquo 85°C DIN 10512",
);
assert.ok(
  evalPastryPlonge.summaryBadges.some((b) => b.text.includes("Break Tank UNI EN 1717")),
  "Plonge deve avere badge Break Tank antiriflusso",
);

// 8. Area Vendita, Cassa & Vetrina Espositiva Pasticceria Fresca e Gelati
const pastAreaVendita = pastryEnvs.find((e) => e.id === "env-pastry-area-vendita-banco-vetrine")!;
assert.equal(pastAreaVendita.category, "sales_office");
assert.equal(pastAreaVendita.surfaceSqM, 40);
assert.equal(pastAreaVendita.heightM, 3.2);
assert.equal(pastAreaVendita.volumeCuM, 128);
assert.equal(pastAreaVendita.occupantsCount, 3);
assert.equal(pastAreaVendita.emergencyExitsCount, 1);
const evalPastryAreaVendita = evaluateEnvironmentCompliance(pastAreaVendita, "56.10.30");
assert.ok(evalPastryAreaVendita.isHeightCompliant, "Altezza Area Vendita (3,20 m) deve essere a norma (min 2.7m)");
assert.ok(
  evalPastryAreaVendita.summaryBadges.some((b) => b.text.includes("allergeni") && b.text.includes("Reg. UE 1169/2011")),
  "Area Vendita deve avere badge registro allergeni Reg. UE 1169/2011",
);
assert.ok(
  evalPastryAreaVendita.summaryBadges.some((b) => b.text.includes("Vetrina refrigerata (+4°C)")),
  "Area Vendita deve avere badge vetrina refrigerata e pozzetti",
);

// 9. Banco Caffetteria, Somministrazione Bevande & Colazioni
const pastBancoBar = pastryEnvs.find((e) => e.id === "env-pastry-banco-caffetteria-snack")!;
assert.equal(pastBancoBar.category, "sales_office");
assert.equal(pastBancoBar.surfaceSqM, 25);
assert.equal(pastBancoBar.heightM, 3.0);
assert.equal(pastBancoBar.volumeCuM, 75);
const evalPastryBancoBar = evaluateEnvironmentCompliance(pastBancoBar, "56.10.30");
assert.ok(evalPastryBancoBar.isHeightCompliant, "Altezza Banco Caffetteria (3,00 m) deve essere a norma");
assert.ok(
  evalPastryBancoBar.summaryBadges.some((b) => b.text.includes("caldaia certificata PED") || b.text.includes("Cool-Touch")),
  "Banco Caffetteria deve avere badge caldaia PED e lancia Cool-Touch",
);
assert.ok(
  evalPastryBancoBar.summaryBadges.some((b) => b.text.includes("Lavabicchieri sottobanco risciacquo 85°C")),
  "Banco Caffetteria deve avere badge lavabicchieri 85°C",
);

// 10. Sala Consumazione / Dehors Clienti per Colazioni e Merende
const pastSala = pastryEnvs.find((e) => e.id === "env-pastry-sala-consumazione-tavoli")!;
assert.equal(pastSala.category, "public");
assert.equal(pastSala.surfaceSqM, 35);
assert.equal(pastSala.heightM, 3.0);
assert.equal(pastSala.volumeCuM, 105);
assert.equal(pastSala.occupantsCount, 25);
assert.equal(pastSala.emergencyExitsCount, 1);
const evalPastrySala = evaluateEnvironmentCompliance(pastSala, "56.10.30");
assert.ok(evalPastrySala.isHeightCompliant, "Altezza Sala (3,00 m) deve essere a norma");
assert.ok(
  evalPastrySala.summaryBadges.some((b) => b.text.includes("estintore omologato 34A 233B")),
  "Sala deve avere badge estintore 34A 233B",
);
assert.ok(
  evalPastrySala.summaryBadges.some((b) => b.text.includes("igienizzante MOCA")),
  "Sala deve avere badge disinfezione tavoli MOCA",
);

// 11. Spogliatoi e Servizi Igienici del Personale con Doccia
const pastSpogliatoi = pastryEnvs.find((e) => e.id === "env-pastry-spogliatoi-servizi-personale")!;
assert.equal(pastSpogliatoi.category, "changing_rooms");
assert.equal(pastSpogliatoi.surfaceSqM, 18);
assert.equal(pastSpogliatoi.heightM, 2.4);
assert.equal(pastSpogliatoi.volumeCuM, 43.2);
assert.equal(pastSpogliatoi.occupantsCount, 6);
const evalPastrySpogliatoi = evaluateEnvironmentCompliance(pastSpogliatoi, "56.10.30");
assert.ok(evalPastrySpogliatoi.isHeightCompliant, "Altezza Spogliatoi (2,40 m) deve essere a norma");
assert.ok(
  evalPastrySpogliatoi.summaryBadges.some((b) => b.text.includes("armadietti individuali doppi sporco/pulito")),
  "Spogliatoi devono avere badge armadietti doppi sporco/pulito",
);
assert.ok(
  evalPastrySpogliatoi.summaryBadges.some((b) => b.text.includes("Antibagno con lavamani a comando non manuale")),
  "Spogliatoi devono avere badge antibagno con lavamani a comando non manuale",
);

// 12. Locale Tecnico / Vano Compressori Centralizzati & Deposito Rifiuti
const pastLocaleTecnico = pastryEnvs.find((e) => e.id === "env-pastry-locale-tecnico-compressori")!;
assert.equal(pastLocaleTecnico.category, "technical");
assert.equal(pastLocaleTecnico.surfaceSqM, 15);
assert.equal(pastLocaleTecnico.heightM, 2.5);
assert.equal(pastLocaleTecnico.volumeCuM, 37.5);
const evalPastryLocaleTecnico = evaluateEnvironmentCompliance(pastLocaleTecnico, "56.10.30");
assert.ok(evalPastryLocaleTecnico.isHeightCompliant, "Altezza Locale Tecnico (2,50 m) deve essere a norma");
assert.ok(
  evalPastryLocaleTecnico.summaryBadges.some((b) => b.text.includes("Vano compressori con aerazione permanente")),
  "Locale Tecnico deve avere badge aerazione compressori UNI EN 378",
);
assert.ok(
  evalPastryLocaleTecnico.summaryBadges.some((b) => b.text.includes("addolcitore/filtro a resine")),
  "Locale Tecnico deve avere badge addolcitore acque D.Lgs. 18/2023",
);

// ============================================================================
// Test 38: generateEnvironmentChecklistItems per locali Pasticceria e Gelateria (ATECO 56.10.30)
// ============================================================================
console.log("Test 38: generateEnvironmentChecklistItems per locali Pasticceria e Gelateria (ATECO 56.10.30)");

// 1. Laboratorio Principale Pasticceria
const pastLabPastryItems = generateEnvironmentChecklistItems(pastLabPastry, "56.10.30");
assert.ok(
  pastLabPastryItems.some(
    (it) => it.id.includes("cappa-aspirazione-forni-labirinto") && it.domain === "both",
  ),
  "Laboratorio Pasticceria deve verificare cappa forni filtri a labirinto (domain: both)",
);
assert.ok(
  pastLabPastryItems.some(
    (it) => it.id.includes("forni-pasticceria-sicurezza-termoisolante") && it.domain === "safety",
  ),
  "Laboratorio Pasticceria deve verificare sicurezza forni pasticceria (domain: safety)",
);
assert.ok(
  pastLabPastryItems.some(
    (it) => it.id.includes("sfogliatrice-ripari-salvamani-interblocco") && it.domain === "safety" && it.defaultSeverity === 4,
  ),
  "Laboratorio Pasticceria deve verificare sfogliatrice con ripari salvamani UNI EN 1674 (domain: safety, severity 4)",
);
assert.ok(
  pastLabPastryItems.some(
    (it) => it.id.includes("tavoli-lavoro-inox-moca") && it.domain === "haccp",
  ),
  "Laboratorio Pasticceria deve verificare banchi inox conformi MOCA (domain: haccp)",
);
assert.ok(
  pastLabPastryItems.some(
    (it) => it.id.includes("lavamani-comando-non-manuale-sapone") && it.domain === "haccp",
  ),
  "Laboratorio Pasticceria deve verificare lavamani a comando non manuale (domain: haccp)",
);

// 2. Laboratorio Gelateria
const pastLabGelatoItems = generateEnvironmentChecklistItems(pastLabGelato, "56.10.30");
assert.ok(
  pastLabGelatoItems.some(
    (it) => it.id.includes("pastorizzatore-miscele-termoregistrazione-haccp") && it.domain === "haccp",
  ),
  "Laboratorio Gelateria deve verificare pastorizzatore con termoregistrazione (domain: haccp)",
);
assert.ok(
  pastLabGelatoItems.some(
    (it) => it.id.includes("mantecatore-gelato-interblocco-protezioni") && it.domain === "safety" && it.defaultSeverity === 4,
  ),
  "Laboratorio Gelateria deve verificare mantecatore con protezioni e blocco (domain: safety, severity 4)",
);
assert.ok(
  pastLabGelatoItems.some(
    (it) => it.id.includes("abbattitore-temperatura-rapido-sonda") && it.domain === "haccp",
  ),
  "Laboratorio Gelateria deve verificare abbattitore rapido con sonda al cuore (domain: haccp)",
);
assert.ok(
  pastLabGelatoItems.some(
    (it) => it.id.includes("vasca-lavello-carapine-non-manuale") && it.domain === "haccp",
  ),
  "Laboratorio Gelateria deve verificare vasca carapine con comando non manuale (domain: haccp)",
);
assert.ok(
  pastLabGelatoItems.some(
    (it) => it.id.includes("pavimento-antiscivolo-canaletta-sifonata") && it.domain === "both",
  ),
  "Laboratorio Gelateria deve verificare pavimentazione antiscivolo con canaletta sifonata (domain: both)",
);

// 3. Area Finitura, Decorazione Dolci & Cioccolateria
const pastDecorazioneItems = generateEnvironmentChecklistItems(pastDecorazione, "56.10.30");
assert.ok(
  pastDecorazioneItems.some(
    (it) => it.id.includes("microclima-condizionamento-temperatura-umidita") && it.domain === "both",
  ),
  "Area Decorazione deve verificare microclima controllato 18-20°C (domain: both)",
);
assert.ok(
  pastDecorazioneItems.some(
    (it) => it.id.includes("piani-temperaggio-granito-inox-moca") && it.domain === "haccp",
  ),
  "Area Decorazione deve verificare piani granito per temperaggio cioccolato (domain: haccp)",
);
assert.ok(
  pastDecorazioneItems.some(
    (it) => it.id.includes("dosatrici-creme-beccucci-inox-moca") && it.domain === "haccp",
  ),
  "Area Decorazione deve verificare dosatrici creme MOCA (domain: haccp)",
);
assert.ok(
  pastDecorazioneItems.some(
    (it) => it.id.includes("aerografo-colori-alimentari-aspirazione") && it.domain === "both",
  ),
  "Area Decorazione deve verificare aerografo colori alimentari con aspirazione (domain: both)",
);

// 4. Cella Frigorifera Materie Prime (+4°C)
const pastCellaPosItems = generateEnvironmentChecklistItems(pastCellaPos, "56.10.30");
assert.ok(
  pastCellaPosItems.some(
    (it) => it.id.includes("teletermometro-digitale-allarme-fuori-soglia") && it.domain === "haccp",
  ),
  "Cella Materie Prime deve verificare teletermometro continuo +4°C (domain: haccp)",
);
assert.ok(
  pastCellaPosItems.some(
    (it) => it.id.includes("scaffalature-forate-moca-rialzate-15cm") && it.domain === "haccp",
  ),
  "Cella Materie Prime deve verificare scaffalature forate MOCA rialzate (domain: haccp)",
);
assert.ok(
  pastCellaPosItems.some(
    (it) => it.id.includes("maniglia-interna-antintrappolamento-luminescente") && it.domain === "safety" && it.defaultSeverity === 4,
  ),
  "Cella Materie Prime deve verificare maniglia interna luminescente (domain: safety, severity 4)",
);

// 5. Cella Negativa Semifreddi e Gelati (-18°/-25°C)
const pastCellaNegItems = generateEnvironmentChecklistItems(pastCellaNeg, "56.10.30");
assert.ok(
  pastCellaNegItems.some(
    (it) => it.id.includes("allarme-uomo-intrappolato-uni-en-378") && it.domain === "safety" && it.defaultSeverity === 4,
  ),
  "Cella Negativa deve verificare allarme uomo intrappolato UNI EN 378 (domain: safety, severity 4)",
);
assert.ok(
  pastCellaNegItems.some(
    (it) => it.id.includes("resistenza-anticongelamento-valvola-compensazione") && it.domain === "safety",
  ),
  "Cella Negativa deve verificare resistenza anticongelamento porta (domain: safety)",
);
assert.ok(
  pastCellaNegItems.some(
    (it) => it.id.includes("termoregistratore-continuo-catena-freddo") && it.domain === "haccp",
  ),
  "Cella Negativa deve verificare termoregistratore catena del freddo (domain: haccp)",
);

// 6. Magazzino Farine e Zuccheri
const pastDispensaItems = generateEnvironmentChecklistItems(pastDispensa, "56.10.30");
assert.ok(
  pastDispensaItems.some(
    (it) => it.id.includes("stoccaggio-sacchi-pedane-sollevate-asciutto") && it.domain === "both",
  ),
  "Magazzino Farine deve verificare stoccaggio su pedane sollevate (domain: both)",
);
assert.ok(
  pastDispensaItems.some(
    (it) => it.id.includes("lampada-uv-trappole-feromoni-tarme") && it.domain === "haccp",
  ),
  "Magazzino Farine deve verificare trappole feromoni e lampada UV (domain: haccp)",
);
assert.ok(
  pastDispensaItems.some(
    (it) => it.id.includes("scaffalature-cartelli-portata-antiribaltamento") && it.domain === "safety",
  ),
  "Magazzino Farine deve verificare cartelli portata scaffali (domain: safety)",
);

// 7. Plonge Lavaggio Teglie 60x40
const pastPlongeItems = generateEnvironmentChecklistItems(pastPlonge, "56.10.30");
assert.ok(
  pastPlongeItems.some(
    (it) => it.id.includes("lavaoggetti-teglie-carapine-risciacquo-85c") && it.domain === "haccp",
  ),
  "Plonge deve verificare lavaoggetti teglie risciacquo 85°C DIN 10512 (domain: haccp)",
);
assert.ok(
  pastPlongeItems.some(
    (it) => it.id.includes("disconnessione-idrica-break-tank-uni-en-1717") && it.domain === "both",
  ),
  "Plonge deve verificare disconnessione Break Tank UNI EN 1717 (domain: both)",
);
assert.ok(
  pastPlongeItems.some(
    (it) => it.id.includes("vasca-doppio-bacino-doccione-prelavaggio") && it.domain === "haccp",
  ),
  "Plonge deve verificare vasca due buche e doccione (domain: haccp)",
);
assert.ok(
  pastPlongeItems.some(
    (it) => it.id.includes("cappa-estrazione-vapori-pavimento-antiscivolo") && it.domain === "safety",
  ),
  "Plonge deve verificare cappa estrazione vapori (domain: safety)",
);

// 8. Area Vendita, Vetrina Espositiva e Cassa
const pastAreaVenditaItems = generateEnvironmentChecklistItems(pastAreaVendita, "56.10.30");
assert.ok(
  pastAreaVenditaItems.some(
    (it) => it.id.includes("vetrina-refrigerata-pozzetti-parafiato") && it.domain === "haccp",
  ),
  "Area Vendita deve verificare vetrina refrigerata e pozzetti con parafiato (domain: haccp)",
);
assert.ok(
  pastAreaVenditaItems.some(
    (it) => it.id.includes("cartello-unico-allergeni-registro-ingredienti") && it.domain === "haccp" && it.defaultSeverity === 4,
  ),
  "Area Vendita deve verificare cartello unico allergeni Reg. UE 1169/2011 (domain: haccp, severity 4)",
);
assert.ok(
  pastAreaVenditaItems.some(
    (it) => it.id.includes("vetrate-sicurezza-antisfondamento-banco-cassa") && it.domain === "safety",
  ),
  "Area Vendita deve verificare vetrate antisfondamento UNI EN 12600 (domain: safety)",
);

// 9. Banco Caffetteria e Somministrazione
const pastBancoBarItems = generateEnvironmentChecklistItems(pastBancoBar, "56.10.30");
assert.ok(
  pastBancoBarItems.some(
    (it) => it.id.includes("macchina-caffe-ped-lancia-cooltouch") && it.domain === "safety",
  ),
  "Banco Caffetteria deve verificare macchina caffè PED con lancia Cool-Touch (domain: safety)",
);
assert.ok(
  pastBancoBarItems.some(
    (it) => it.id.includes("cassetto-battifiltro-fonoassorbente-rumore") && it.domain === "safety",
  ),
  "Banco Caffetteria deve verificare cassetto battifiltro fonoassorbente (domain: safety)",
);
assert.ok(
  pastBancoBarItems.some(
    (it) => it.id.includes("lavabicchieri-sottobanco-risciacquo-85c") && it.domain === "haccp",
  ),
  "Banco Caffetteria deve verificare lavabicchieri 85°C (domain: haccp)",
);

// 10. Sala Consumazione e Dehors
const pastSalaItems = generateEnvironmentChecklistItems(pastSala, "56.10.30");
assert.ok(
  pastSalaItems.some(
    (it) => it.id.includes("vie-esodo-sgombre-larghezza-norma") && it.domain === "safety",
  ),
  "Sala deve verificare percorsi di esodo sgombri (domain: safety)",
);
assert.ok(
  pastSalaItems.some(
    (it) => it.id.includes("estintore-omologato-34a-233b-revisione") && it.domain === "safety",
  ),
  "Sala deve verificare estintore omologato 34A 233B (domain: safety)",
);
assert.ok(
  pastSalaItems.some(
    (it) => it.id.includes("disinfezione-tavoli-prodotti-moca") && it.domain === "haccp",
  ),
  "Sala deve verificare procedura disinfezione tavoli con prodotti MOCA (domain: haccp)",
);

// 11. Spogliatoi e Servizi Personale
const pastSpogliatoiItems = generateEnvironmentChecklistItems(pastSpogliatoi, "56.10.30");
assert.ok(
  pastSpogliatoiItems.some(
    (it) => it.id.includes("armadietti-doppi-divise-laboratorio") && it.domain === "both",
  ),
  "Spogliatoi devono verificare armadietti doppi sporco/pulito (domain: both)",
);
assert.ok(
  pastSpogliatoiItems.some(
    (it) => it.id.includes("antibagno-lavamani-non-manuale-sapone") && it.domain === "both",
  ),
  "Spogliatoi devono verificare antibagno con comando non manuale (domain: both)",
);
assert.ok(
  pastSpogliatoiItems.some(
    (it) => it.id.includes("aspirazione-meccanica-bagni-ciechi") && it.domain === "safety",
  ),
  "Spogliatoi devono verificare aspirazione forzata bagni ciechi (domain: safety)",
);

// 12. Locale Tecnico Compressori Centralizzati
const pastLocaleTecnicoItems = generateEnvironmentChecklistItems(pastLocaleTecnico, "56.10.30");
assert.ok(
  pastLocaleTecnicoItems.some(
    (it) => it.id.includes("aerazione-permanente-compressori-uni-en-378") && it.domain === "safety",
  ),
  "Locale Tecnico deve verificare aerazione permanente compressori UNI EN 378 (domain: safety)",
);
assert.ok(
  pastLocaleTecnicoItems.some(
    (it) => it.id.includes("addolcitore-resine-potabilita-dlgs-18-2023") && it.domain === "haccp",
  ),
  "Locale Tecnico deve verificare impianto addolcitore D.Lgs. 18/2023 (domain: haccp)",
);
assert.ok(
  pastLocaleTecnicoItems.some(
    (it) => it.id.includes("stoccaggio-rifiuti-bidoni-pedale-ermetici") && it.domain === "haccp",
  ),
  "Locale Tecnico deve verificare bidoni rifiuti ermetici a pedale (domain: haccp)",
);

// 13. Verifica filtraggio checklistMode per locali Pasticceria
const pastLabPastryHaccpMode = filterEnvironmentItemsByChecklistMode(pastLabPastryItems, "haccp_only");
assert.ok(
  pastLabPastryHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item del Laboratorio Pasticceria devono essere haccp o both",
);
assert.ok(
  !pastLabPastryHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item del Laboratorio Pasticceria deve avere domain safety",
);

const pastLabPastrySafetyMode = filterEnvironmentItemsByChecklistMode(pastLabPastryItems, "safety_only");
assert.ok(
  pastLabPastrySafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item del Laboratorio Pasticceria devono essere safety o both",
);
assert.ok(
  !pastLabPastrySafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item del Laboratorio Pasticceria deve avere domain haccp",
);

const pastSalaSafetyMode = filterEnvironmentItemsByChecklistMode(pastSalaItems, "safety_only");
assert.ok(
  pastSalaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item della Sala devono essere safety o both",
);

// ============================================================================
// Test 39: getStandardEnvironmentsForAteco & conformità per Gastronomia e Piatti Pronti (10.85 / 10.85.0 / 10.85.00 / 10.85.01 / 10.8 / 108500 / 10850 / 1085 / 108)
// ============================================================================
console.log("Test 39: getStandardEnvironmentsForAteco & conformità per Gastronomia e Piatti Pronti (10.85 / 10.85.0 / 10.85.00 / 10.85.01 / 10.8 / 108500 / 10850 / 1085 / 108)");

const gastroEnvs = getStandardEnvironmentsForAteco("10.85");
assert.equal(gastroEnvs.length, 12, "Gastronomia / Piatti Pronti deve avere esattamente 12 ambienti standard");

// Verifica varianti codice ATECO
const gastroEnvsVar1 = getStandardEnvironmentsForAteco("10.85.0");
assert.equal(gastroEnvsVar1.length, 12, "Anche prefisso 10.85.0 deve restituire 12 ambienti Gastronomia");
const gastroEnvsVar2 = getStandardEnvironmentsForAteco("10.85.00");
assert.equal(gastroEnvsVar2.length, 12, "Anche codice 10.85.00 deve restituire 12 ambienti Gastronomia");
const gastroEnvsVar3 = getStandardEnvironmentsForAteco("10.85.01");
assert.equal(gastroEnvsVar3.length, 12, "Anche codice 10.85.01 deve restituire 12 ambienti Gastronomia");
const gastroEnvsVar4 = getStandardEnvironmentsForAteco("10.8");
assert.equal(gastroEnvsVar4.length, 12, "Anche codice 10.8 deve restituire 12 ambienti Gastronomia");
const gastroEnvsVar5 = getStandardEnvironmentsForAteco("108500");
assert.equal(gastroEnvsVar5.length, 12, "Anche codice numerico 108500 deve restituire 12 ambienti Gastronomia");
const gastroEnvsVar6 = getStandardEnvironmentsForAteco("10850");
assert.equal(gastroEnvsVar6.length, 12, "Anche codice numerico 10850 deve restituire 12 ambienti Gastronomia");
const gastroEnvsVar7 = getStandardEnvironmentsForAteco("1085");
assert.equal(gastroEnvsVar7.length, 12, "Anche codice numerico 1085 deve restituire 12 ambienti Gastronomia");
const gastroEnvsVar8 = getStandardEnvironmentsForAteco("108");
assert.equal(gastroEnvsVar8.length, 12, "Anche codice numerico 108 deve restituire 12 ambienti Gastronomia");

// Verifica ID dei 12 ambienti standard Gastronomia
const expectedGastroIds = [
  "env-gastro-ricevimento-materie-prime",
  "env-gastro-preparazione-primaria-mondatura",
  "env-gastro-reparto-cotture-calde",
  "env-gastro-abbattimento-surgelazione",
  "env-gastro-confezionamento-atmosfera-protettiva",
  "env-gastro-cella-frigo-materie-prime",
  "env-gastro-cella-negativa-congelati",
  "env-gastro-cella-prodotto-finito-spedizione",
  "env-gastro-locale-lavaggio-casse-attrezzi",
  "env-gastro-deposito-imballaggi-film-cartoni",
  "env-gastro-spogliatoi-filtro-igienico",
  "env-gastro-locale-tecnico-centrale-frigo-cip",
];

for (const id of expectedGastroIds) {
  assert.ok(
    gastroEnvs.some((e) => e.id === id),
    `Ambiente ${id} deve essere presente nella lista standard Gastronomia per 10.85`,
  );
}

// 1. Reparto Ricevimento Merci, Controllo Accettazione & Baia di Scarico
const gastroRicevimento = gastroEnvs.find((e) => e.id === "env-gastro-ricevimento-materie-prime")!;
assert.equal(gastroRicevimento.category, "warehouse");
assert.equal(gastroRicevimento.surfaceSqM, 60);
assert.equal(gastroRicevimento.heightM, 3.5);
assert.equal(gastroRicevimento.volumeCuM, 210);
assert.equal(gastroRicevimento.occupantsCount, 2);
assert.equal(gastroRicevimento.emergencyExitsCount, 1);
assert.equal(gastroRicevimento.features.forcedExhaustPresent, true);
assert.equal(gastroRicevimento.features.emergencyLighting, true);
const evalGastroRicevimento = evaluateEnvironmentCompliance(gastroRicevimento, "10.85");
assert.ok(evalGastroRicevimento.isHeightCompliant, "Altezza Ricevimento (3,50 m) deve essere a norma (min 3.0m)");
assert.equal(evalGastroRicevimento.minHeightRequired, 3.0);
assert.ok(
  evalGastroRicevimento.summaryBadges.some((b) => b.text.includes("banchina di scarico isotermica")),
  "Ricevimento deve avere badge banchina isotermica e teletermometro Reg. CE 852/04",
);
assert.ok(
  evalGastroRicevimento.summaryBadges.some((b) => b.text.includes("Bilancia a piattaforma certificata")),
  "Ricevimento deve avere badge bilancia a piattaforma",
);

// 2. Locale Preparazione Primaria, Lavaggio & Mondatura Ortaggi e Carni
const gastroPreparazione = gastroEnvs.find((e) => e.id === "env-gastro-preparazione-primaria-mondatura")!;
assert.equal(gastroPreparazione.category, "production");
assert.equal(gastroPreparazione.surfaceSqM, 50);
assert.equal(gastroPreparazione.heightM, 3.0);
assert.equal(gastroPreparazione.volumeCuM, 150);
assert.equal(gastroPreparazione.occupantsCount, 4);
assert.equal(gastroPreparazione.emergencyExitsCount, 1);
assert.equal(gastroPreparazione.features.forcedExhaustPresent, true);
assert.equal(gastroPreparazione.features.forcedExhaustType, "kitchen_hood");
assert.equal(gastroPreparazione.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gastroPreparazione.features.flooringCondition, "compliant_anti_slip");
const evalGastroPreparazione = evaluateEnvironmentCompliance(gastroPreparazione, "10.85");
assert.ok(evalGastroPreparazione.isHeightCompliant, "Altezza Preparazione (3,00 m) deve essere a norma (min 2.7m)");
assert.equal(evalGastroPreparazione.minHeightRequired, 2.7);
assert.ok(
  evalGastroPreparazione.summaryBadges.some((b) => b.text.includes("Vasche continue lavaggio a borbottaggio")),
  "Preparazione deve avere badge vasche borbottaggio ozono/cloro",
);
assert.ok(
  evalGastroPreparazione.summaryBadges.some((b) => b.text.includes("Canaline di scarico a pavimento sifonate")),
  "Preparazione deve avere badge canaline di scarico sifonate",
);

// 3. Reparto Cottura Calda, Brasiere Industriali & Trattamenti Termici
const gastroCotture = gastroEnvs.find((e) => e.id === "env-gastro-reparto-cotture-calde")!;
assert.equal(gastroCotture.category, "production");
assert.equal(gastroCotture.surfaceSqM, 80);
assert.equal(gastroCotture.heightM, 3.5);
assert.equal(gastroCotture.volumeCuM, 280);
assert.equal(gastroCotture.occupantsCount, 4);
assert.equal(gastroCotture.emergencyExitsCount, 2);
assert.equal(gastroCotture.features.forcedExhaustPresent, true);
assert.equal(gastroCotture.features.forcedExhaustType, "kitchen_hood");
assert.equal(gastroCotture.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gastroCotture.features.flooringCondition, "compliant_anti_slip");
const evalGastroCotture = evaluateEnvironmentCompliance(gastroCotture, "10.85");
assert.ok(evalGastroCotture.isHeightCompliant, "Altezza Reparto Cotture (3,50 m) deve essere a norma (min 3.0m)");
assert.equal(evalGastroCotture.minHeightRequired, 3.0);
assert.ok(
  evalGastroCotture.summaryBadges.some((b) => b.text.includes("Ansul R-102")),
  "Cotture deve avere badge cappa Ansul R-102",
);
assert.ok(
  evalGastroCotture.summaryBadges.some((b) => b.text.includes("Brasiere e cuocitori industriali")),
  "Cotture deve avere badge brasiere industriali",
);

// 4. Zona Abbattimento Rapido di Temperatura & Surgelazione Carrellata
const gastroAbbattimento = gastroEnvs.find((e) => e.id === "env-gastro-abbattimento-surgelazione")!;
assert.equal(gastroAbbattimento.category, "production");
assert.equal(gastroAbbattimento.surfaceSqM, 40);
assert.equal(gastroAbbattimento.heightM, 3.2);
assert.equal(gastroAbbattimento.volumeCuM, 128);
assert.equal(gastroAbbattimento.occupantsCount, 2);
assert.equal(gastroAbbattimento.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gastroAbbattimento.features.flooringCondition, "compliant_anti_slip");
const evalGastroAbbattimento = evaluateEnvironmentCompliance(gastroAbbattimento, "10.85");
assert.ok(evalGastroAbbattimento.isHeightCompliant, "Altezza Abbattimento (3,20 m) deve essere a norma (min 2.7m)");
assert.equal(evalGastroAbbattimento.minHeightRequired, 2.7);
assert.ok(
  evalGastroAbbattimento.summaryBadges.some((b) => b.text.includes("Abbattimento rapido +70°C -> +3°C")),
  "Abbattimento deve avere badge abbattimento rapido nei tempi HACCP",
);
assert.ok(
  evalGastroAbbattimento.summaryBadges.some((b) => b.text.includes("Termoregistratore digitale continuo")),
  "Abbattimento deve avere badge termoregistratore UNI EN 12830",
);

// 5. Reparto Dosaggio, Porzionatura & Confezionamento in Atmosfera Protettiva (MAP)
const gastroConfezionamento = gastroEnvs.find((e) => e.id === "env-gastro-confezionamento-atmosfera-protettiva")!;
assert.equal(gastroConfezionamento.category, "production");
assert.equal(gastroConfezionamento.surfaceSqM, 70);
assert.equal(gastroConfezionamento.heightM, 3.0);
assert.equal(gastroConfezionamento.volumeCuM, 210);
assert.equal(gastroConfezionamento.occupantsCount, 5);
assert.equal(gastroConfezionamento.features.wallsCondition, "washable_sanitizable_2m");
assert.equal(gastroConfezionamento.features.flooringCondition, "compliant_anti_slip");
assert.equal(gastroConfezionamento.features.microclimateCompliant, true);
const evalGastroConfezionamento = evaluateEnvironmentCompliance(gastroConfezionamento, "10.85");
assert.ok(evalGastroConfezionamento.isHeightCompliant, "Altezza Confezionamento MAP (3,00 m) deve essere a norma (min 2.7m)");
assert.equal(evalGastroConfezionamento.minHeightRequired, 2.7);
assert.ok(
  evalGastroConfezionamento.summaryBadges.some((b) => b.text.includes("Confezionamento MAP")),
  "Confezionamento deve avere badge atmosfera protettiva N2/CO2 a T <= +12°C",
);
assert.ok(
  evalGastroConfezionamento.summaryBadges.some((b) => b.text.includes("barriere ottiche immateriali")),
  "Confezionamento deve avere badge barriere ottiche Classe 4",
);

// 6. Cella Frigorifera Materie Prime (+0°/+4°C)
const gastroCellaMateriePrime = gastroEnvs.find((e) => e.id === "env-gastro-cella-frigo-materie-prime")!;
assert.equal(gastroCellaMateriePrime.category, "storage");
assert.equal(gastroCellaMateriePrime.surfaceSqM, 30);
assert.equal(gastroCellaMateriePrime.heightM, 2.6);
assert.equal(gastroCellaMateriePrime.volumeCuM, 78);
assert.equal(gastroCellaMateriePrime.occupantsCount, 1);
const evalGastroCellaMateriePrime = evaluateEnvironmentCompliance(gastroCellaMateriePrime, "10.85");
assert.ok(evalGastroCellaMateriePrime.isHeightCompliant, "Altezza Cella Frigo (2,60 m) deve essere a norma (min 2.4m)");
assert.equal(evalGastroCellaMateriePrime.minHeightRequired, 2.4);
assert.ok(
  evalGastroCellaMateriePrime.summaryBadges.some((b) => b.text.includes("Cella frigorifera materie prime")),
  "Cella frigo deve avere badge stoccaggio separato MOCA",
);
assert.ok(
  evalGastroCellaMateriePrime.summaryBadges.some((b) => b.text.includes("Maniglia interna di sicurezza antintrappolamento")),
  "Cella frigo deve avere badge maniglia antintrappolamento",
);

// 7. Cella Frigorifera a Bassa Temperatura per Basi Surgelate (-18°/-22°C)
const gastroCellaNegativa = gastroEnvs.find((e) => e.id === "env-gastro-cella-negativa-congelati")!;
assert.equal(gastroCellaNegativa.category, "storage");
assert.equal(gastroCellaNegativa.surfaceSqM, 35);
assert.equal(gastroCellaNegativa.heightM, 2.6);
assert.equal(gastroCellaNegativa.volumeCuM, 91);
assert.equal(gastroCellaNegativa.occupantsCount, 1);
const evalGastroCellaNegativa = evaluateEnvironmentCompliance(gastroCellaNegativa, "10.85");
assert.ok(evalGastroCellaNegativa.isHeightCompliant, "Altezza Cella Negativa (2,60 m) deve essere a norma (min 2.4m)");
assert.equal(evalGastroCellaNegativa.minHeightRequired, 2.4);
assert.ok(
  evalGastroCellaNegativa.summaryBadges.some((b) => b.text.includes("allarme uomo intrappolato a batteria tampone UNI EN 378")),
  "Cella negativa deve avere badge allarme uomo intrappolato UNI EN 378",
);
assert.ok(
  evalGastroCellaNegativa.summaryBadges.some((b) => b.text.includes("resistenza elettrica anticongelamento")),
  "Cella negativa deve avere badge resistenza anticongelamento",
);

// 8. Cella Frigorifera Prodotti Finiti Confezionati Pronti per Spedizione (+2°/+4°C)
const gastroCellaProdottoFinito = gastroEnvs.find((e) => e.id === "env-gastro-cella-prodotto-finito-spedizione")!;
assert.equal(gastroCellaProdottoFinito.category, "storage");
assert.equal(gastroCellaProdottoFinito.surfaceSqM, 45);
assert.equal(gastroCellaProdottoFinito.heightM, 2.8);
assert.equal(gastroCellaProdottoFinito.volumeCuM, 126);
assert.equal(gastroCellaProdottoFinito.occupantsCount, 2);
const evalGastroCellaProdottoFinito = evaluateEnvironmentCompliance(gastroCellaProdottoFinito, "10.85");
assert.ok(evalGastroCellaProdottoFinito.isHeightCompliant, "Altezza Cella Spedizione (2,80 m) deve essere a norma (min 2.4m)");
assert.equal(evalGastroCellaProdottoFinito.minHeightRequired, 2.4);
assert.ok(
  evalGastroCellaProdottoFinito.summaryBadges.some((b) => b.text.includes("paracolpi ad alta densità in polizene")),
  "Cella spedizione deve avere badge paracolpi in polizene",
);
assert.ok(
  evalGastroCellaProdottoFinito.summaryBadges.some((b) => b.text.includes("automezzi refrigerati ATP")),
  "Cella spedizione deve avere badge catena del freddo ATP",
);

// 9. Locale Lavaggio Industriale Casse, Gastronorm & Attrezzature
const gastroLavaggio = gastroEnvs.find((e) => e.id === "env-gastro-locale-lavaggio-casse-attrezzi")!;
assert.equal(gastroLavaggio.category, "production");
assert.equal(gastroLavaggio.surfaceSqM, 35);
assert.equal(gastroLavaggio.heightM, 2.8);
assert.equal(gastroLavaggio.volumeCuM, 98);
assert.equal(gastroLavaggio.occupantsCount, 2);
const evalGastroLavaggio = evaluateEnvironmentCompliance(gastroLavaggio, "10.85");
assert.ok(evalGastroLavaggio.isHeightCompliant, "Altezza Lavaggio (2,80 m) deve essere a norma (min 2.7m)");
assert.equal(evalGastroLavaggio.minHeightRequired, 2.7);
assert.ok(
  evalGastroLavaggio.summaryBadges.some((b) => b.text.includes("risciacquo igienico ad alta temperatura ≥ 85°C DIN 10512")),
  "Lavaggio deve avere badge risciacquo >= 85°C DIN 10512",
);
assert.ok(
  evalGastroLavaggio.summaryBadges.some((b) => b.text.includes("Break Tank conforme UNI EN 1717")),
  "Lavaggio deve avere badge Break Tank UNI EN 1717",
);

// 10. Magazzino Imballaggi Primari MOCA, Vaschette Barriera, Film & Cartoni
const gastroDepositoImballaggi = gastroEnvs.find((e) => e.id === "env-gastro-deposito-imballaggi-film-cartoni")!;
assert.equal(gastroDepositoImballaggi.category, "warehouse");
assert.equal(gastroDepositoImballaggi.surfaceSqM, 40);
assert.equal(gastroDepositoImballaggi.heightM, 3.2);
assert.equal(gastroDepositoImballaggi.volumeCuM, 128);
assert.equal(gastroDepositoImballaggi.occupantsCount, 1);
const evalGastroDepositoImballaggi = evaluateEnvironmentCompliance(gastroDepositoImballaggi, "10.85");
assert.ok(evalGastroDepositoImballaggi.isHeightCompliant, "Altezza Magazzino Imballaggi (3,20 m) deve essere a norma (min 2.7m)");
assert.equal(evalGastroDepositoImballaggi.minHeightRequired, 2.7);
assert.ok(
  evalGastroDepositoImballaggi.summaryBadges.some((b) => b.text.includes("Reg. CE 1935/2004 e Reg. UE 10/2011 (MOCA)")),
  "Magazzino imballaggi deve avere badge conformità MOCA",
);
assert.ok(
  evalGastroDepositoImballaggi.summaryBadges.some((b) => b.text.includes("UNI EN 15635")),
  "Magazzino imballaggi deve avere badge scaffalature UNI EN 15635",
);

// 11. Spogliatoi del Personale con Varco Sanitario / Filtro Igienico Obbligatorio
const gastroSpogliatoi = gastroEnvs.find((e) => e.id === "env-gastro-spogliatoi-filtro-igienico")!;
assert.equal(gastroSpogliatoi.category, "changing_rooms");
assert.equal(gastroSpogliatoi.surfaceSqM, 30);
assert.equal(gastroSpogliatoi.heightM, 2.4);
assert.equal(gastroSpogliatoi.volumeCuM, 72);
assert.equal(gastroSpogliatoi.occupantsCount, 10);
const evalGastroSpogliatoi = evaluateEnvironmentCompliance(gastroSpogliatoi, "10.85");
assert.ok(evalGastroSpogliatoi.isHeightCompliant, "Altezza Spogliatoi (2,40 m) deve essere a norma (min 2.4m)");
assert.equal(evalGastroSpogliatoi.minHeightRequired, 2.4);
assert.ok(
  evalGastroSpogliatoi.summaryBadges.some((b) => b.text.includes("armadietti doppi sporco/pulito")),
  "Spogliatoi deve avere badge armadietti doppi All. IV",
);
assert.ok(
  evalGastroSpogliatoi.summaryBadges.some((b) => b.text.includes("Varco sanitario obbligatorio")),
  "Spogliatoi deve avere badge varco sanitario con lavaggio suole",
);

// 12. Centrale Impianti Frigoriferi & Stazione Lavaggio CIP (Clean-In-Place)
const gastroCentraleCIP = gastroEnvs.find((e) => e.id === "env-gastro-locale-tecnico-centrale-frigo-cip")!;
assert.equal(gastroCentraleCIP.category, "technical");
assert.equal(gastroCentraleCIP.surfaceSqM, 25);
assert.equal(gastroCentraleCIP.heightM, 2.6);
assert.equal(gastroCentraleCIP.volumeCuM, 65);
assert.equal(gastroCentraleCIP.occupantsCount, 1);
const evalGastroCentraleCIP = evaluateEnvironmentCompliance(gastroCentraleCIP, "10.85");
assert.ok(evalGastroCentraleCIP.isHeightCompliant, "Altezza Centrale CIP (2,60 m) deve essere a norma (min 2.4m)");
assert.equal(evalGastroCentraleCIP.minHeightRequired, 2.4);
assert.ok(
  evalGastroCentraleCIP.summaryBadges.some((b) => b.text.includes("rilevatore fughe refrigerante e allarme ottico-acustico UNI EN 378")),
  "Centrale frigo deve avere badge sensore gas UNI EN 378",
);
assert.ok(
  evalGastroCentraleCIP.summaryBadges.some((b) => b.text.includes("Stazione lavaggio centralizzato CIP")),
  "Centrale CIP deve avere badge vasche contenimento Titolo IX e lavaocchi",
);

// ============================================================================
// Test 40: generateEnvironmentChecklistItems per locali Gastronomia e Piatti Pronti (ATECO 10.85)
// ============================================================================
console.log("Test 40: generateEnvironmentChecklistItems per locali Gastronomia e Piatti Pronti (ATECO 10.85)");

// 1. Reparto Ricevimento Merci
const gastroRicevimentoItems = generateEnvironmentChecklistItems(gastroRicevimento, "10.85");
assert.ok(
  gastroRicevimentoItems.some(
    (it) => it.id.includes("banchina-scarico-pedana-antischiacciamento") && it.domain === "safety",
  ),
  "Ricevimento deve verificare banchina isotermica e bordo antischiacciamento (domain: safety)",
);
assert.ok(
  gastroRicevimentoItems.some(
    (it) => it.id.includes("controllo-temperatura-merci-deperibili-haccp") && it.domain === "haccp",
  ),
  "Ricevimento deve verificare controllo T merci deperibili e termometro MOCA a sonda (domain: haccp)",
);
assert.ok(
  gastroRicevimentoItems.some(
    (it) => it.id.includes("bilancia-piattaforma-ricevimento-metrologica") && it.domain === "both",
  ),
  "Ricevimento deve verificare bilancia a piattaforma certificata (domain: both)",
);

// 2. Locale Preparazione Primaria, Lavaggio & Mondatura
const gastroPreparazioneItems = generateEnvironmentChecklistItems(gastroPreparazione, "10.85");
assert.ok(
  gastroPreparazioneItems.some(
    (it) => it.id.includes("vasche-lavaggio-borbottaggio-igienizzazione") && it.domain === "haccp",
  ),
  "Preparazione deve verificare vasche continue lavaggio con borbottaggio d'aria e dosaggio disinfettante (domain: haccp)",
);
assert.ok(
  gastroPreparazioneItems.some(
    (it) => it.id.includes("canaline-scarico-inox-sifonate-cestello") && it.domain === "both",
  ),
  "Preparazione deve verificare canaline di scarico inox sifonate con cestello (domain: both)",
);
assert.ok(
  gastroPreparazioneItems.some(
    (it) => it.id.includes("lavamani-fotocellula-comando-non-manuale") && it.domain === "haccp",
  ),
  "Preparazione deve verificare lavamani chirurgico a fotocellula (domain: haccp)",
);

// 3. Reparto Cottura Calda, Brasiere Industriali
const gastroCottureItems = generateEnvironmentChecklistItems(gastroCotture, "10.85");
assert.ok(
  gastroCottureItems.some(
    (it) => it.id.includes("cappa-compensazione-antincendio-ansul") && it.domain === "safety",
  ),
  "Cotture deve verificare cappa a compensazione con impianto spegnimento Ansul R-102 (domain: safety)",
);
assert.ok(
  gastroCottureItems.some(
    (it) => it.id.includes("brasiere-cuocitori-blocco-ribaltamento-scarico") && it.domain === "safety",
  ),
  "Cotture deve verificare sicurezza meccanica brasiere con blocco fine corsa (domain: safety)",
);
assert.ok(
  gastroCottureItems.some(
    (it) => it.id.includes("forni-vapore-carrellati-roll-in") && it.domain === "both",
  ),
  "Cotture deve verificare forni a vapore roll-in carrellati (domain: both)",
);

// 4. Zona Abbattimento Rapido di Temperatura & Surgelazione Carrellata
const gastroAbbattimentoItems = generateEnvironmentChecklistItems(gastroAbbattimento, "10.85");
assert.ok(
  gastroAbbattimentoItems.some(
    (it) => it.id.includes("abbattimento-rapido-parametri-haccp-tempi") && it.domain === "haccp",
  ),
  "Abbattimento deve verificare parametri HACCP tempi raffreddamento (+3°C <90min, -18°C <240min) (domain: haccp)",
);
assert.ok(
  gastroAbbattimentoItems.some(
    (it) => it.id.includes("termoregistratore-digitale-sonda-uni-en-12830") && it.domain === "haccp",
  ),
  "Abbattimento deve verificare termoregistratore digitale UNI EN 12830 (domain: haccp)",
);
assert.ok(
  gastroAbbattimentoItems.some(
    (it) => it.id.includes("pavimentazione-antiscivolo-cella-abbattimento") && it.domain === "safety",
  ),
  "Abbattimento deve verificare pavimento antiscivolo R11/R12 e rampa carrelli (domain: safety)",
);

// 5. Reparto Dosaggio, Porzionatura & Confezionamento MAP
const gastroConfezionamentoItems = generateEnvironmentChecklistItems(gastroConfezionamento, "10.85");
assert.ok(
  gastroConfezionamentoItems.some(
    (it) => it.id.includes("temperatura-locale-confezionamento-map") && it.domain === "haccp",
  ),
  "Confezionamento deve verificare temperatura controllata <= +12°C (domain: haccp)",
);
assert.ok(
  gastroConfezionamentoItems.some(
    (it) => it.id.includes("termosigillatrice-map-miscela-gas-barriere-sicurezza") && it.domain === "both",
  ),
  "Confezionamento deve verificare termosigillatrice MAP con gas E941/E290 e barriere ottiche Cat. 4 (domain: both)",
);
assert.ok(
  gastroConfezionamentoItems.some(
    (it) => it.id.includes("controllo-tenuta-saldatura-residuo-ossigeno") && it.domain === "haccp",
  ),
  "Confezionamento deve verificare tenuta saldature e analizzatore O2 residuo (domain: haccp)",
);

// 6. Cella Frigorifera Materie Prime (+0°/+4°C)
const gastroCellaMateriePrimeItems = generateEnvironmentChecklistItems(gastroCellaMateriePrime, "10.85");
assert.ok(
  gastroCellaMateriePrimeItems.some(
    (it) => it.id.includes("separazione-materie-prime-scaffalature-moca") && it.domain === "haccp",
  ),
  "Cella Materie Prime deve verificare stoccaggio distinto e ripiani forati MOCA >= 15 cm (domain: haccp)",
);
assert.ok(
  gastroCellaMateriePrimeItems.some(
    (it) => it.id.includes("termoregistratore-cella-materie-prime-allarmi") && it.domain === "haccp",
  ),
  "Cella Materie Prime deve verificare termoregistrazione continua e allarmi remoti (domain: haccp)",
);
assert.ok(
  gastroCellaMateriePrimeItems.some(
    (it) => it.id.includes("maniglia-antintrappolamento-cella-positiva") && it.domain === "safety",
  ),
  "Cella Materie Prime deve verificare maniglia interna luminescente antintrappolamento (domain: safety)",
);

// 7. Cella Frigorifera Bassa Temperatura Basi Surgelate (-18°/-22°C)
const gastroCellaNegativaItems = generateEnvironmentChecklistItems(gastroCellaNegativa, "10.85");
assert.ok(
  gastroCellaNegativaItems.some(
    (it) => it.id.includes("allarme-uomo-intrappolato-cella-negativa") && it.domain === "safety",
  ),
  "Cella Negativa deve verificare allarme uomo intrappolato a batteria tampone UNI EN 378 (domain: safety)",
);
assert.ok(
  gastroCellaNegativaItems.some(
    (it) => it.id.includes("resistenza-anticongelamento-porta-termoisolante") && it.domain === "safety",
  ),
  "Cella Negativa deve verificare resistenza elettrica guarnizione porta e valvola compensazione (domain: safety)",
);
assert.ok(
  gastroCellaNegativaItems.some(
    (it) => it.id.includes("temperatura-stoccaggio-surgelati-18") && it.domain === "haccp",
  ),
  "Cella Negativa deve verificare mantenimento temperatura costante <= -18°C (domain: haccp)",
);

// 8. Cella Frigorifera Prodotti Finiti Spedizione (+2°/+4°C)
const gastroCellaProdottoFinitoItems = generateEnvironmentChecklistItems(gastroCellaProdottoFinito, "10.85");
assert.ok(
  gastroCellaProdottoFinitoItems.some(
    (it) => it.id.includes("protezione-paracolpi-polizene-roll-container") && it.domain === "both",
  ),
  "Cella Spedizione deve verificare paracolpi in polizene per roll container (domain: both)",
);
assert.ok(
  gastroCellaProdottoFinitoItems.some(
    (it) => it.id.includes("etichettatura-lotto-scadenza-allergeni-reg-ue-1169") && it.domain === "haccp",
  ),
  "Cella Spedizione deve verificare etichettatura, lotto, TMC e allergeni Reg. UE 1169/2011 (domain: haccp)",
);
assert.ok(
  gastroCellaProdottoFinitoItems.some(
    (it) => it.id.includes("procedura-carico-veicoli-coibentati-atp") && it.domain === "haccp",
  ),
  "Cella Spedizione deve verificare trasferimento diretto su veicoli ATP senza soste (domain: haccp)",
);

// 9. Locale Lavaggio Industriale Casse & Attrezzature
const gastroLavaggioItems = generateEnvironmentChecklistItems(gastroLavaggio, "10.85");
assert.ok(
  gastroLavaggioItems.some(
    (it) => it.id.includes("lavacasse-tunnel-temperatura-din-10512") && it.domain === "haccp",
  ),
  "Lavaggio Casse deve verificare risciacquo igienico >= 85°C conforme DIN 10512 (domain: haccp)",
);
assert.ok(
  gastroLavaggioItems.some(
    (it) => it.id.includes("disconnessione-idrica-break-tank-uni-en-1717") && it.domain === "both",
  ),
  "Lavaggio Casse deve verificare dispositivo Break Tank antiriflusso UNI EN 1717 (domain: both)",
);
assert.ok(
  gastroLavaggioItems.some(
    (it) => it.id.includes("aspirazione-vapore-condense-locale-lavaggio") && it.domain === "safety",
  ),
  "Lavaggio Casse deve verificare cappa aspirazione vapore e scarico condense (domain: safety)",
);

// 10. Magazzino Imballaggi Primari MOCA
const gastroDepositoImballaggiItems = generateEnvironmentChecklistItems(gastroDepositoImballaggi, "10.85");
assert.ok(
  gastroDepositoImballaggiItems.some(
    (it) => it.id.includes("dichiarazioni-conformita-moca-imballaggi") && it.domain === "haccp",
  ),
  "Magazzino Imballaggi deve verificare fascicolo dichiarazioni MOCA Reg. CE 1935/2004 (domain: haccp)",
);
assert.ok(
  gastroDepositoImballaggiItems.some(
    (it) => it.id.includes("scaffalature-portata-ispezione-uni-en-15635") && it.domain === "safety",
  ),
  "Magazzino Imballaggi deve verificare scaffalature certificate e verifica UNI EN 15635 (domain: safety)",
);
assert.ok(
  gastroDepositoImballaggiItems.some(
    (it) => it.id.includes("protezione-polveri-infestanti-imballaggi") && it.domain === "haccp",
  ),
  "Magazzino Imballaggi deve verificare protezione da polvere e infestanti (domain: haccp)",
);

// 11. Spogliatoi del Personale con Varco Sanitario
const gastroSpogliatoiItems = generateEnvironmentChecklistItems(gastroSpogliatoi, "10.85");
assert.ok(
  gastroSpogliatoiItems.some(
    (it) => it.id.includes("varco-sanitario-tornello-lavamani-suole") && it.domain === "haccp",
  ),
  "Spogliatoi deve verificare varco sanitario con tornello, igienizzazione mani e lavaggio suole (domain: haccp)",
);
assert.ok(
  gastroSpogliatoiItems.some(
    (it) => it.id.includes("armadietti-doppio-scomparto-sporco-pulito") && it.domain === "both",
  ),
  "Spogliatoi deve verificare armadietti doppi a tetto spiovente All. IV (domain: both)",
);
assert.ok(
  gastroSpogliatoiItems.some(
    (it) => it.id.includes("distributore-dpi-monouso-cuffie-calzari") && it.domain === "both",
  ),
  "Spogliatoi deve verificare dispenser DPI monouso (cuffie, calzari) (domain: both)",
);

// 12. Centrale Impianti Frigoriferi & Stazione CIP
const gastroCentraleCIPItems = generateEnvironmentChecklistItems(gastroCentraleCIP, "10.85");
assert.ok(
  gastroCentraleCIPItems.some(
    (it) => it.id.includes("rilevatore-fughe-gas-refrigerante-uni-en-378") && it.domain === "safety",
  ),
  "Centrale CIP deve verificare rilevatore fughe gas con allarme UNI EN 378 (domain: safety)",
);
assert.ok(
  gastroCentraleCIPItems.some(
    (it) => it.id.includes("stazione-lavaggio-cip-vasche-contenimento-acidi") && it.domain === "safety",
  ),
  "Centrale CIP deve verificare vasche contenimento detergenti Titolo IX (domain: safety)",
);
assert.ok(
  gastroCentraleCIPItems.some(
    (it) => it.id.includes("doccia-d-emergenza-lavaocchi-centrale-chimica") && it.domain === "safety",
  ),
  "Centrale CIP deve verificare doccia d'emergenza e lavaocchi UNI EN 15154 (domain: safety)",
);

// 13. Verifica filtraggio checklistMode per locali Gastronomia
const gastroCottureHaccpMode = filterEnvironmentItemsByChecklistMode(gastroCottureItems, "haccp_only");
assert.ok(
  gastroCottureHaccpMode.every((it) => it.domain === "haccp" || it.domain === "both"),
  "In modalità haccp_only tutti gli item del Reparto Cotture devono essere haccp o both",
);
assert.ok(
  !gastroCottureHaccpMode.some((it) => it.domain === "safety"),
  "In modalità haccp_only nessun item del Reparto Cotture deve avere domain safety",
);

const gastroCottureSafetyMode = filterEnvironmentItemsByChecklistMode(gastroCottureItems, "safety_only");
assert.ok(
  gastroCottureSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item del Reparto Cotture devono essere safety o both",
);
assert.ok(
  !gastroCottureSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item del Reparto Cotture deve avere domain haccp",
);

const gastroRicevimentoSafetyMode = filterEnvironmentItemsByChecklistMode(gastroRicevimentoItems, "safety_only");
assert.ok(
  gastroRicevimentoSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item del Ricevimento devono essere safety o both",
);

// ============================================================================
// Test 41: getStandardEnvironmentsForAteco & conformità per Commercio al Dettaglio Non Alimentare / Negozi Abbigliamento e Retail Specializzato (47.71, 47.71.1, 47.71.2, 47.71.3, 47.72, 47.5, 47.6, 47.7, 4771, 477110, 477120, 47711, 47712, 47713, 477, 475, 476)
// ============================================================================
console.log("Test 41: getStandardEnvironmentsForAteco & conformità per Commercio al Dettaglio Non Alimentare / Retail (47.71, 47.71.1, 47.71.2, 47.71.3, 47.72, 47.5, 47.6, 47.7, 4771, 477110, 477120, 47711, 47712, 47713, 477, 475, 476)");

const retailAtecoVariants = [
  "47.71",
  "47.71.1",
  "47.71.2",
  "47.71.3",
  "47.72",
  "47.5",
  "47.6",
  "47.7",
  "4771",
  "477110",
  "477120",
  "47711",
  "47712",
  "47713",
  "477",
  "475",
  "476",
];

for (const code of retailAtecoVariants) {
  const envs = getStandardEnvironmentsForAteco(code);
  assert.equal(envs.length, 12, `ATECO ${code} deve restituire esattamente 12 ambienti standard retail`);
  assert.ok(envs.some((e) => e.id === "env-retail-area-vendita-principale"), `ATECO ${code} deve contenere Area Vendita`);
  assert.ok(envs.some((e) => e.id === "env-retail-banco-cassa-vdt"), `ATECO ${code} deve contenere Banco Cassa`);
  assert.ok(envs.some((e) => e.id === "env-retail-camerini-prova"), `ATECO ${code} deve contenere Camerini di Prova`);
  assert.ok(envs.some((e) => e.id === "env-retail-magazzino-scorte-merci"), `ATECO ${code} deve contenere Magazzino Scorte`);
  assert.ok(envs.some((e) => e.id === "env-retail-reparto-stoccaggio-capi-appesi"), `ATECO ${code} deve contenere Capi Appesi`);
  assert.ok(envs.some((e) => e.id === "env-retail-zona-stiratura-ricondizionamento"), `ATECO ${code} deve contenere Stiratura`);
  assert.ok(envs.some((e) => e.id === "env-retail-soppalco-magazzino"), `ATECO ${code} deve contenere Soppalco`);
  assert.ok(envs.some((e) => e.id === "env-retail-ufficio-direzione-amministrazione"), `ATECO ${code} deve contenere Ufficio`);
  assert.ok(envs.some((e) => e.id === "env-retail-spogliatoi-servizi-personale"), `ATECO ${code} deve contenere Spogliatoi e Servizi`);
  assert.ok(envs.some((e) => e.id === "env-retail-area-break-distributori"), `ATECO ${code} deve contenere Area Break`);
  assert.ok(envs.some((e) => e.id === "env-retail-vano-tecnico-quadro-clima"), `ATECO ${code} deve contenere Vano Tecnico`);
  assert.ok(envs.some((e) => e.id === "env-retail-area-compattazione-cartoni-scarico"), `ATECO ${code} deve contenere Area Scarico`);
}

const retailEnvs = getStandardEnvironmentsForAteco("47.71");
const retailAreaVendita = retailEnvs.find((e) => e.id === "env-retail-area-vendita-principale")!;
const retailBancoCassa = retailEnvs.find((e) => e.id === "env-retail-banco-cassa-vdt")!;
const retailCamerini = retailEnvs.find((e) => e.id === "env-retail-camerini-prova")!;
const retailMagazzino = retailEnvs.find((e) => e.id === "env-retail-magazzino-scorte-merci")!;
const retailCapiAppesi = retailEnvs.find((e) => e.id === "env-retail-reparto-stoccaggio-capi-appesi")!;
const retailStiratura = retailEnvs.find((e) => e.id === "env-retail-zona-stiratura-ricondizionamento")!;
const retailSoppalco = retailEnvs.find((e) => e.id === "env-retail-soppalco-magazzino")!;
const retailUfficio = retailEnvs.find((e) => e.id === "env-retail-ufficio-direzione-amministrazione")!;
const retailSpogliatoi = retailEnvs.find((e) => e.id === "env-retail-spogliatoi-servizi-personale")!;
const retailAreaBreak = retailEnvs.find((e) => e.id === "env-retail-area-break-distributori")!;
const retailVanoTecnico = retailEnvs.find((e) => e.id === "env-retail-vano-tecnico-quadro-clima")!;
const retailAreaScarico = retailEnvs.find((e) => e.id === "env-retail-area-compattazione-cartoni-scarico")!;

// Verifica conformità dimensionale e badge per ciascun ambiente
const evalRetailAreaVendita = evaluateEnvironmentCompliance(retailAreaVendita, "47.71");
assert.equal(evalRetailAreaVendita.minHeightRequired, 3.0, "Area vendita richiede altezza minima 3,00m");
assert.ok(evalRetailAreaVendita.isHeightCompliant, "Area vendita deve essere conforme in altezza (3.20m >= 3.00m)");
assert.ok(evalRetailAreaVendita.isCubatureCompliant, "Area vendita deve essere conforme in cubatura (480 / 25 = 19.2 mc/op)");
assert.ok(
  evalRetailAreaVendita.summaryBadges.some((b) => b.text.includes("Corsie di vendita e vie di esodo")),
  "Area vendita deve avere badge vie di esodo >= 1.20m",
);
assert.ok(
  evalRetailAreaVendita.summaryBadges.some((b) => b.text.includes("Illuminazione di emergenza")),
  "Area vendita deve avere badge illuminazione emergenza UNI EN 1838",
);

const evalRetailBancoCassa = evaluateEnvironmentCompliance(retailBancoCassa, "47.71");
assert.equal(evalRetailBancoCassa.minHeightRequired, 2.7, "Banco cassa richiede altezza minima 2,70m");
assert.ok(evalRetailBancoCassa.isHeightCompliant, "Banco cassa deve essere conforme in altezza (3.00m >= 2.70m)");
assert.ok(evalRetailBancoCassa.isCubatureCompliant, "Banco cassa deve essere conforme in cubatura");
assert.ok(
  evalRetailBancoCassa.summaryBadges.some((b) => b.text.includes("Postazione cassa ergonomica")),
  "Banco cassa deve avere badge ergonomia e VDT",
);
assert.ok(
  evalRetailBancoCassa.summaryBadges.some((b) => b.text.includes("Barriera antitaccheggio EAS")),
  "Banco cassa deve avere badge barriera antitaccheggio CEM UNI EN 50364",
);

const evalRetailCamerini = evaluateEnvironmentCompliance(retailCamerini, "47.71");
assert.equal(evalRetailCamerini.minHeightRequired, 2.7, "Camerini richiedono altezza minima 2,70m");
assert.ok(evalRetailCamerini.isHeightCompliant, "Camerini devono essere conformi in altezza (2.70m >= 2.70m)");
assert.ok(evalRetailCamerini.isCubatureCompliant, "Camerini devono essere conformi in cubatura");
assert.ok(
  evalRetailCamerini.summaryBadges.some((b) => b.text.includes("Box prova accessibile PMR")),
  "Camerini devono avere badge PMR D.P.R. 503/96",
);
assert.ok(
  evalRetailCamerini.summaryBadges.some((b) => b.text.includes("Specchi di sicurezza antischeggia")),
  "Camerini devono avere badge specchi antischeggia UNI EN 12600",
);

const evalRetailMagazzino = evaluateEnvironmentCompliance(retailMagazzino, "47.71");
assert.equal(evalRetailMagazzino.minHeightRequired, 3.0, "Magazzino richiede altezza minima 3,00m");
assert.ok(evalRetailMagazzino.isHeightCompliant, "Magazzino deve essere conforme in altezza (3.50m >= 3.00m)");
assert.ok(evalRetailMagazzino.isCubatureCompliant, "Magazzino deve essere conforme in cubatura");
assert.ok(
  evalRetailMagazzino.summaryBadges.some((b) => b.text.includes("Scaffalature industriali metalliche")),
  "Magazzino deve avere badge scaffalature UNI EN 15635",
);

const evalRetailCapiAppesi = evaluateEnvironmentCompliance(retailCapiAppesi, "47.71");
assert.equal(evalRetailCapiAppesi.minHeightRequired, 3.0, "Reparto Capi Appesi richiede altezza minima 3,00m");
assert.ok(evalRetailCapiAppesi.isHeightCompliant, "Capi appesi devono essere conformi in altezza (3.50m >= 3.00m)");
assert.ok(evalRetailCapiAppesi.isCubatureCompliant, "Capi appesi devono essere conformi in cubatura");
assert.ok(
  evalRetailCapiAppesi.summaryBadges.some((b) => b.text.includes("Stender ad alta densità")),
  "Capi appesi devono avere badge stender All. V D.Lgs. 81/08",
);
assert.ok(
  evalRetailCapiAppesi.summaryBadges.some((b) => b.text.includes("Distanziamento corpi illuminanti")),
  "Capi appesi devono avere badge prevenzione incendio tessuti",
);

const evalRetailStiratura = evaluateEnvironmentCompliance(retailStiratura, "47.71");
assert.equal(evalRetailStiratura.minHeightRequired, 2.7, "Zona Stiratura richiede altezza minima 2,70m");
assert.ok(evalRetailStiratura.isHeightCompliant, "Stiratura deve essere conforme in altezza (2.80m >= 2.70m)");
assert.ok(evalRetailStiratura.isCubatureCompliant, "Stiratura deve essere conforme in cubatura");
assert.ok(
  evalRetailStiratura.summaryBadges.some((b) => b.text.includes("Caldaia e generatori di vapore")),
  "Stiratura deve avere badge valvola sicurezza PED",
);
assert.ok(
  evalRetailStiratura.summaryBadges.some((b) => b.text.includes("Ventilazione ed estrazione")),
  "Stiratura deve avere badge controllo microclima vapore",
);

const evalRetailSoppalco = evaluateEnvironmentCompliance(retailSoppalco, "47.71");
assert.equal(evalRetailSoppalco.minHeightRequired, 2.4, "Soppalco deposito scorte richiede altezza minima 2,40m");
assert.ok(evalRetailSoppalco.isHeightCompliant, "Soppalco deve essere conforme in altezza (2.40m >= 2.40m)");
assert.ok(evalRetailSoppalco.isCubatureCompliant, "Soppalco deve essere conforme in cubatura");
assert.ok(
  evalRetailSoppalco.summaryBadges.some((b) => b.text.includes("Parapetto perimetrale normale h ≥ 1,00m")),
  "Soppalco deve avere badge parapetto e fermapiede 15 cm All. IV punto 1.4",
);

const evalRetailUfficio = evaluateEnvironmentCompliance(retailUfficio, "47.71");
assert.equal(evalRetailUfficio.minHeightRequired, 2.7, "Ufficio direzione richiede altezza minima 2,70m");
assert.ok(evalRetailUfficio.isHeightCompliant, "Ufficio deve essere conforme in altezza (2.70m >= 2.70m)");
assert.ok(evalRetailUfficio.isCubatureCompliant, "Ufficio deve essere conforme in cubatura");
assert.ok(
  evalRetailUfficio.summaryBadges.some((b) => b.text.includes("Impianto videosorveglianza")),
  "Ufficio deve avere badge videosorveglianza ITL e GDPR",
);

const evalRetailSpogliatoi = evaluateEnvironmentCompliance(retailSpogliatoi, "47.71");
assert.equal(evalRetailSpogliatoi.minHeightRequired, 2.4, "Spogliatoi richiedono altezza minima 2,40m");
assert.ok(evalRetailSpogliatoi.isHeightCompliant, "Spogliatoi devono essere conformi in altezza (2.40m >= 2.40m)");
assert.ok(
  evalRetailSpogliatoi.summaryBadges.some((b) => b.text.includes("Armadietti individuali")),
  "Spogliatoi devono avere badge armadietti All. IV",
);

const evalRetailAreaBreak = evaluateEnvironmentCompliance(retailAreaBreak, "47.71");
assert.equal(evalRetailAreaBreak.minHeightRequired, 2.7, "Area Break richiede altezza minima 2,70m");
assert.ok(evalRetailAreaBreak.isHeightCompliant, "Area break deve essere conforme in altezza (2.70m >= 2.70m)");
assert.ok(evalRetailAreaBreak.isCubatureCompliant, "Area break deve essere conforme in cubatura");
assert.ok(
  evalRetailAreaBreak.summaryBadges.some((b) => b.text.includes("Distributori cibi e bevande")),
  "Area break deve avere badge distributori automatici CEI 64-8",
);

const evalRetailVanoTecnico = evaluateEnvironmentCompliance(retailVanoTecnico, "47.71");
assert.ok(evalRetailVanoTecnico.isHeightCompliant, "Vano tecnico deve essere conforme in altezza (2.60m >= 2.40m)");
assert.ok(evalRetailVanoTecnico.isCubatureCompliant, "Vano tecnico deve essere conforme in cubatura");
assert.ok(
  evalRetailVanoTecnico.summaryBadges.some((b) => b.text.includes("Pulsante di sgancio elettrico")),
  "Vano tecnico deve avere badge pulsante sgancio CEI EN 60204-1",
);
assert.ok(
  evalRetailVanoTecnico.summaryBadges.some((b) => b.text.includes("Estintore CO2 5 kg classe 89B")),
  "Vano tecnico deve avere badge estintore CO2",
);

const evalRetailAreaScarico = evaluateEnvironmentCompliance(retailAreaScarico, "47.71");
assert.equal(evalRetailAreaScarico.minHeightRequired, 3.0, "Area scarico cartoni richiede altezza minima 3,00m");
assert.ok(evalRetailAreaScarico.isHeightCompliant, "Area scarico deve essere conforme in altezza (3.00m >= 3.00m)");
assert.ok(evalRetailAreaScarico.isCubatureCompliant, "Area scarico deve essere conforme in cubatura");
assert.ok(
  evalRetailAreaScarico.summaryBadges.some((b) => b.text.includes("Pressa compattatrice certificata")),
  "Area scarico deve avere badge pressa compattatrice Direttiva Macchine",
);

// ============================================================================
// Test 42: generateEnvironmentChecklistItems per locali Retail Non Alimentare (ATECO 47.71)
// ============================================================================
console.log("Test 42: generateEnvironmentChecklistItems per locali Retail Non Alimentare (ATECO 47.71)");

// 1. Area Vendita Principale
const retailAreaVenditaItems = generateEnvironmentChecklistItems(retailAreaVendita, "47.71");
assert.ok(
  retailAreaVenditaItems.some(
    (it) => it.id.includes("corsie-esodo-vie-fuga-dm-2021") && it.domain === "safety",
  ),
  "Area Vendita deve verificare corsie di vendita e vie di fuga libere >= 1.20m (domain: safety)",
);
assert.ok(
  retailAreaVenditaItems.some(
    (it) => it.id.includes("illuminazione-emergenza-uni-en-1838") && it.domain === "safety",
  ),
  "Area Vendita deve verificare illuminazione emergenza UNI EN 1838 (domain: safety)",
);
assert.ok(
  retailAreaVenditaItems.some(
    (it) => it.id.includes("stabilita-gondole-scaffali-espositivi") && it.domain === "safety",
  ),
  "Area Vendita deve verificare stabilità e ancoraggio gondole/scaffalature (domain: safety)",
);

// 2. Banco Cassa, Postazioni POS & Barriera Antitaccheggio
const retailBancoCassaItems = generateEnvironmentChecklistItems(retailBancoCassa, "47.71");
assert.ok(
  retailBancoCassaItems.some(
    (it) => it.id.includes("postazione-cassa-ergonomia-vdt") && it.domain === "safety",
  ),
  "Banco Cassa deve verificare ergonomia postazione e VDT EN 1335 (domain: safety)",
);
assert.ok(
  retailBancoCassaItems.some(
    (it) => it.id.includes("barriera-antitaccheggio-cem-uni-en-50364") && it.domain === "safety",
  ),
  "Banco Cassa deve verificare conformità barriera antitaccheggio CEM UNI EN 50364 (domain: safety)",
);
assert.ok(
  retailBancoCassaItems.some(
    (it) => it.id.includes("pulsante-antirapina-gestione-contante") && it.domain === "safety",
  ),
  "Banco Cassa deve verificare allarme silenzioso antirapina e cassa temporizzata (domain: safety)",
);

// 3. Camerini di Prova
const retailCameriniItems = generateEnvironmentChecklistItems(retailCamerini, "47.71");
assert.ok(
  retailCameriniItems.some(
    (it) => it.id.includes("box-prova-accessibile-pmr-porte") && it.domain === "safety",
  ),
  "Camerini deve verificare accessibilità PMR porta >= 90 cm D.P.R. 503/96 (domain: safety)",
);
assert.ok(
  retailCameriniItems.some(
    (it) => it.id.includes("specchi-sicurezza-antischeggia-uni-en-12600") && it.domain === "safety",
  ),
  "Camerini deve verificare specchi di sicurezza antischeggia UNI EN 12600 (domain: safety)",
);
assert.ok(
  retailCameriniItems.some(
    (it) => it.id.includes("aerazione-illuminazione-box-camerini") && it.domain === "safety",
  ),
  "Camerini deve verificare aerazione e corpi illuminanti protetti (domain: safety)",
);

// 4. Magazzino Scorte Merci
const retailMagazzinoItems = generateEnvironmentChecklistItems(retailMagazzino, "47.71");
assert.ok(
  retailMagazzinoItems.some(
    (it) => it.id.includes("scaffalature-portata-tassellamento-uni-en-15635") && it.domain === "safety",
  ),
  "Magazzino deve verificare scaffalature con cartelli portata e tassellamento UNI EN 15635 (domain: safety)",
);
assert.ok(
  retailMagazzinoItems.some(
    (it) => it.id.includes("movimentazione-carichi-transpallet-percorsi") && it.domain === "safety",
  ),
  "Magazzino deve verificare corsie transpallet libere da ingombri All. IV (domain: safety)",
);
assert.ok(
  retailMagazzinoItems.some(
    (it) => it.id.includes("scale-sgabelli-prelievo-uni-en-131") && it.domain === "safety",
  ),
  "Magazzino deve verificare scale e sgabelli UNI EN 131 / art. 113 (domain: safety)",
);

// 5. Reparto Capi Appesi
const retailCapiAppesiItems = generateEnvironmentChecklistItems(retailCapiAppesi, "47.71");
assert.ok(
  retailCapiAppesiItems.some(
    (it) => it.id.includes("stender-alta-densita-stabilita-ruote-frenate") && it.domain === "safety",
  ),
  "Capi Appesi deve verificare stender ad alta densità con ruote frenabili (domain: safety)",
);
assert.ok(
  retailCapiAppesiItems.some(
    (it) => it.id.includes("strutture-sospensione-aste-fermi-antisfilamento") && it.domain === "safety",
  ),
  "Capi Appesi deve verificare strutture sospensione con fermi antisfilamento (domain: safety)",
);
assert.ok(
  retailCapiAppesiItems.some(
    (it) => it.id.includes("distanziamento-lampade-tessuti-prevenzione-incendio") && it.domain === "safety",
  ),
  "Capi Appesi deve verificare distanza >= 0,50m lampade da tessuti infiammabili (domain: safety)",
);

// 6. Zona Stiratura
const retailStiraturaItems = generateEnvironmentChecklistItems(retailStiratura, "47.71");
assert.ok(
  retailStiraturaItems.some(
    (it) => it.id.includes("generatori-vapore-valvole-ped-direttiva-2014-68") && it.domain === "safety",
  ),
  "Stiratura deve verificare generatori vapore e valvole sicurezza PED (domain: safety)",
);
assert.ok(
  retailStiraturaItems.some(
    (it) => it.id.includes("estrazione-vapore-calore-microclima-stiratura") && it.domain === "safety",
  ),
  "Stiratura deve verificare estrazione vapore e controllo microclima (domain: safety)",
);
assert.ok(
  retailStiraturaItems.some(
    (it) => it.id.includes("guaine-isolanti-antitermiche-ferri-vapore") && it.domain === "safety",
  ),
  "Stiratura deve verificare guaine isolanti antiscottatura e cavi siliconici (domain: safety)",
);

// 7. Soppalco Metallico
const retailSoppalcoItems = generateEnvironmentChecklistItems(retailSoppalco, "47.71");
assert.ok(
  retailSoppalcoItems.some(
    (it) => it.id.includes("parapetto-perimetrale-fermapiede-all-iv") && it.domain === "safety",
  ),
  "Soppalco deve verificare parapetto h >= 1,00m e fermapiede 15 cm All. IV punto 1.4 (domain: safety)",
);
assert.ok(
  retailSoppalcoItems.some(
    (it) => it.id.includes("cartello-portata-sovraccarico-soppalco") && it.domain === "safety",
  ),
  "Soppalco deve verificare cartello portata massima kg/m² e collaudo statico (domain: safety)",
);
assert.ok(
  retailSoppalcoItems.some(
    (it) => it.id.includes("scala-fissa-accesso-soppalco-gradini-antiscivolo") && it.domain === "safety",
  ),
  "Soppalco deve verificare scala fissa con pendenza <= 45° e corrimano (domain: safety)",
);

// 8. Ufficio Direzione & Videosorveglianza
const retailUfficioItems = generateEnvironmentChecklistItems(retailUfficio, "47.71");
assert.ok(
  retailUfficioItems.some(
    (it) => it.id.includes("videosorveglianza-accordo-sindacale-gdpr") && it.domain === "safety",
  ),
  "Ufficio deve verificare videosorveglianza art. 4 L. 300/70 e GDPR (domain: safety)",
);
assert.ok(
  retailUfficioItems.some(
    (it) => it.id.includes("postazione-vdt-amministrazione-comfort") && it.domain === "safety",
  ),
  "Ufficio deve verificare postazione VDT ed ergonomia seduta EN 1335 (domain: safety)",
);
assert.ok(
  retailUfficioItems.some(
    (it) => it.id.includes("cassaforte-custodia-documenti-riservati") && it.domain === "safety",
  ),
  "Ufficio deve verificare custodia documenti e ancoraggio cassaforte (domain: safety)",
);

// 9. Spogliatoi e Servizi Igienici
const retailSpogliatoiItems = generateEnvironmentChecklistItems(retailSpogliatoi, "47.71");
assert.ok(
  retailSpogliatoiItems.some(
    (it) => it.id.includes("armadietti-personali-doppio-scomparto-all-iv") && it.domain === "safety",
  ),
  "Spogliatoi deve verificare armadietti individuali a doppio scomparto All. IV (domain: safety)",
);
assert.ok(
  retailSpogliatoiItems.some(
    (it) => it.id.includes("servizi-igienici-antibagno-aerazione-meccanica") && it.domain === "both",
  ),
  "Spogliatoi deve verificare servizi igienici con antibagno e aspirazione forzata (domain: both)",
);
assert.ok(
  retailSpogliatoiItems.some(
    (it) => it.id.includes("cassetta-pronto-soccorso-allegato-2-dm-388") && it.domain === "safety",
  ),
  "Spogliatoi deve verificare cassetta primo soccorso All. 2 D.M. 388/03 (domain: safety)",
);

// 10. Area Break Personale
const retailAreaBreakItems = generateEnvironmentChecklistItems(retailAreaBreak, "47.71");
assert.ok(
  retailAreaBreakItems.some(
    (it) => it.id.includes("distributori-automatici-sicurezza-elettrica-cei-64") && it.domain === "safety",
  ),
  "Area Break deve verificare distributori automatici a norma CEI 64-8 (domain: safety)",
);
assert.ok(
  retailAreaBreakItems.some(
    (it) => it.id.includes("igiene-elettrodomestici-ristoro-microonde-moca") && it.domain === "both",
  ),
  "Area Break deve verificare igiene elettrodomestici ristoro e cestini a pedale (domain: both)",
);
assert.ok(
  retailAreaBreakItems.some(
    (it) => it.id.includes("spazio-ristoro-confortevole-arredi-salubrita") && it.domain === "safety",
  ),
  "Area Break deve verificare arredi ristoro e salubrità locale All. IV p.to 1.11 (domain: safety)",
);

// 11. Vano Tecnico Quadro Elettrico & Clima
const retailVanoTecnicoItems = generateEnvironmentChecklistItems(retailVanoTecnico, "47.71");
assert.ok(
  retailVanoTecnicoItems.some(
    (it) => it.id.includes("sgancio-elettrico-emergenza-esterno-cei-en-60204") && it.domain === "safety",
  ),
  "Vano Tecnico deve verificare pulsante di sgancio d'emergenza esterno a fungo CEI EN 60204-1 (domain: safety)",
);
assert.ok(
  retailVanoTecnicoItems.some(
    (it) => it.id.includes("ups-batterie-ventilazione-antideflagrante") && it.domain === "safety",
  ),
  "Vano Tecnico deve verificare batterie UPS e ventilazione antiesalazioni CEI EN 50272-2 (domain: safety)",
);
assert.ok(
  retailVanoTecnicoItems.some(
    (it) => it.id.includes("estintore-co2-quadro-elettrico-classe-89b") && it.domain === "safety",
  ),
  "Vano Tecnico deve verificare estintore CO2 5 kg classe 89B (domain: safety)",
);

// 12. Area Retro Scarico & Compattazione Cartoni
const retailAreaScaricoItems = generateEnvironmentChecklistItems(retailAreaScarico, "47.71");
assert.ok(
  retailAreaScaricoItems.some(
    (it) => it.id.includes("pressa-compattatrice-direttiva-macchine-arresto-fungo") && it.domain === "safety",
  ),
  "Area Scarico deve verificare pressa compattatrice Direttiva Macchine con stop a fungo (domain: safety)",
);
assert.ok(
  retailAreaScaricoItems.some(
    (it) => it.id.includes("sicurezza-ribalta-scarico-autocarri-caduta") && it.domain === "safety",
  ),
  "Area Scarico deve verificare sicurezza banchina e cunei fermaruote autocarri (domain: safety)",
);
assert.ok(
  retailAreaScaricoItems.some(
    (it) => it.id.includes("gestione-antincendio-imballaggi-divieto-fumo") && it.domain === "safety",
  ),
  "Area Scarico deve verificare stoccaggio cartoni pressati e divieto di fumo (domain: safety)",
);

// 13. Verifica filtraggio checklistMode per locali Retail
const retailAreaSafetyMode = filterEnvironmentItemsByChecklistMode(retailAreaVenditaItems, "safety_only");
assert.ok(
  retailAreaSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item dell'Area Vendita devono essere safety o both",
);
assert.ok(
  !retailAreaSafetyMode.some((it) => it.domain === "haccp"),
  "In modalità safety_only nessun item dell'Area Vendita deve avere domain haccp",
);

const retailAreaUnifiedMode = filterEnvironmentItemsByChecklistMode(retailAreaVenditaItems, "unified");
assert.equal(
  retailAreaUnifiedMode.length,
  retailAreaVenditaItems.length,
  "In modalità unified tutti gli item dell'Area Vendita devono essere presenti",
);

const retailSpogliatoiSafetyMode = filterEnvironmentItemsByChecklistMode(retailSpogliatoiItems, "safety_only");
assert.ok(
  retailSpogliatoiSafetyMode.every((it) => it.domain === "safety" || it.domain === "both"),
  "In modalità safety_only tutti gli item degli Spogliatoi devono essere safety o both",
);

console.log("=== TUTTI I TEST Step2AmbientiDiLavoro SUPERATI CON SUCCESSO! ===");



