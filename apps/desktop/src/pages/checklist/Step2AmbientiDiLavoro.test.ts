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

console.log("=== TUTTI I TEST Step2AmbientiDiLavoro SUPERATI CON SUCCESSO! ===");
