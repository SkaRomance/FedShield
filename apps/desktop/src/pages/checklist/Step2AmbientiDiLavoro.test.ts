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

console.log("=== TUTTI I TEST Step2AmbientiDiLavoro SUPERATI CON SUCCESSO! ===");
