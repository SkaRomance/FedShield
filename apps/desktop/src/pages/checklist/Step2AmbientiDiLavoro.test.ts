import assert from "node:assert/strict";
import {
  filterEnvironmentItemsByChecklistMode,
} from "./Step2AmbientiDiLavoro.js";
import {
  generateEnvironmentChecklistItems,
  defaultEnvironmentFeatures,
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

console.log("=== TUTTI I TEST Step2AmbientiDiLavoro SUPERATI CON SUCCESSO! ===");
