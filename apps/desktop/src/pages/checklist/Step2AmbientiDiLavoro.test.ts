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

console.log("=== TUTTI I TEST Step2AmbientiDiLavoro SUPERATI CON SUCCESSO! ===");
