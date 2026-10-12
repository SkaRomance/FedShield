import assert from "node:assert/strict";
import {
  SECTOR_MACHINERY_CATALOGS,
  getSectorMachineCatalogForAteco,
  getSuggestedMachinesForEnvironmentsAndAteco,
  TRAINING_REQUIREMENTS_LIBRARY,
} from "./normativeMachineCatalog.js";

console.log("=== INIZIO TEST normativeMachineCatalog (ATECO 47.11.1 Ipermercato GDO) ===");

// -------------------------------------------------------------
// Test 1: Priorità e risoluzione catalogo ATECO Ipermercato GDO
// -------------------------------------------------------------
console.log("Test 1: Verifica priorità catalogo ATECO per Ipermercato GDO");
const catalogExact = getSectorMachineCatalogForAteco("47.11.1");
assert.equal(catalogExact.sectorKey, "ipermercato_gdo", "ATECO 47.11.1 deve restituire ipermercato_gdo");
assert.ok(catalogExact.sectorLabel.includes("Ipermercato"), "L'etichetta deve includere Ipermercato");

const catalogSubcode = getSectorMachineCatalogForAteco("47.11.10");
assert.equal(catalogSubcode.sectorKey, "ipermercato_gdo", "ATECO 47.11.10 deve restituire ipermercato_gdo");

// Verifica posizionamento: ipermercato_gdo e supermercato_alimentare vengono prima di logistica_magazzino
const iperIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ipermercato_gdo");
const superIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "supermercato_alimentare");
const logIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "logistica_magazzino");
assert.ok(iperIndex !== -1, "Settore ipermercato_gdo deve esistere nel catalogo");
assert.ok(superIndex !== -1, "Settore supermercato_alimentare deve esistere nel catalogo");
assert.ok(logIndex !== -1, "Settore logistica_magazzino deve esistere nel catalogo");
assert.equal(superIndex, iperIndex + 1, "supermercato_alimentare deve seguire immediatamente ipermercato_gdo");
assert.ok(superIndex < logIndex, "supermercato_alimentare deve precedere logistica_magazzino nell'elenco");

// Fallback su logistica per altri settori non alimentari/gdo
const fallbackCat = getSectorMachineCatalogForAteco("99.99");
assert.equal(fallbackCat.sectorKey, "logistica_magazzino", "Settore non riconosciuto deve avere fallback su logistica_magazzino");

// -------------------------------------------------------------
// Test 2: Verifica 21 macchine suddivise nei 6 reparti Ipermercato
// -------------------------------------------------------------
console.log("Test 2: Verifica completezza delle 21 attrezzature professionali");
assert.equal(catalogExact.machines.length, 21, "Il catalogo Ipermercato GDO deve contenere esattamente 21 macchine");

const expectedMachineKeys = [
  // Reparto 1: Logistica e Ricevimento Merci (8)
  "muletto_frontale_elettrico",
  "transpallet_elettrico_pedana",
  "transpallet_elettrico_terra",
  "transpallet_manuale",
  "pressa_compattatrice",
  "pedana_di_carico",
  "stazione_ricarica_batterie",
  "scaffalature_portapallet",
  // Reparto 2: Reparto Macelleria (3)
  "segaossa_nastro",
  "tritacarne_refrigerato",
  "insaccatrice_idraulica",
  // Reparto 3: Reparto Gastronomia e Salumeria (3)
  "affettatrice_gravita_gdo",
  "forno_gastronomia_gdo",
  "confezionatrice_sottovuoto_campana",
  // Reparto 4: Reparto Panetteria e Forno (4)
  "impastatrice_spirale_gdo",
  "spezzatrice_arrotondatrice",
  "forno_rotativo_pane",
  "tagliapane_professionale",
  // Reparto 5: Reparto Pescheria (2)
  "fabbricatore_ghiaccio_scaglie",
  "squamatore_elettrico",
  // Reparto 6: Pulizia e Igiene Corsie (1)
  "lavasciuga_uomo_bordo",
];

for (const key of expectedMachineKeys) {
  const found = catalogExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Attrezzatura con key '${key}' deve essere presente nel catalogo`);
  assert.ok(found.name.length > 5, `Nome attrezzatura '${key}' deve essere descrittivo`);
  assert.ok(found.suggestedManufacturer.length > 2, `Produttore suggerito presente per '${key}'`);
  assert.ok(found.suggestedModel.length > 1, `Modello suggerito presente per '${key}'`);
  assert.ok(found.safetyChecks.length >= 3, `L'attrezzatura '${key}' deve avere almeno 3 controlli di sicurezza specifici`);
}

// -------------------------------------------------------------
// Test 3: Verifiche periodiche INAIL e requisiti formativi
// -------------------------------------------------------------
console.log("Test 3: Controllo conformità INAIL e Accordo Stato-Regioni 22/02/2012");
const muletto = catalogExact.machines.find((m) => m.machineKey === "muletto_frontale_elettrico")!;
assert.equal(muletto.isSubjectToInailCheck, true, "Muletto frontale deve essere soggetto a verifica periodica INAIL/ARPA ex art. 71 c. 11");
assert.equal(muletto.inailFrequencyYears, 1, "La verifica periodica INAIL per carrello semovente deve essere annuale (1 anno)");
assert.equal(muletto.training.requiresPatentinoAccordoSR, true, "Muletto richiede patentino abilitante ex Accordo Stato-Regioni 22/02/2012");
assert.equal(muletto.training.minHours, 12, "Corso patentino carrelli deve essere di 12 ore");

const transpalletPedana = catalogExact.machines.find((m) => m.machineKey === "transpallet_elettrico_pedana")!;
assert.equal(transpalletPedana.isSubjectToInailCheck, false, "Transpallet con pedana non è soggetto a verifica INAIL All. VII");
assert.equal(transpalletPedana.training.requiresPatentinoAccordoSR, true, "Transpallet con operatore su pedana a bordo richiede patentino Accordo SR 22/02/2012");
assert.equal(transpalletPedana.training.minHours, 12, "Corso per carrello con uomo a bordo su pedana deve essere 12h");

const transpalletTerra = catalogExact.machines.find((m) => m.machineKey === "transpallet_elettrico_terra")!;
assert.equal(transpalletTerra.training.requiresPatentinoAccordoSR, false, "Transpallet con timone uomo a terra non richiede patentino ma addestramento specifico art. 73 c. 4");
assert.equal(transpalletTerra.training.minHours, 4, "Addestramento transpallet uomo a terra 4h");

const segaossa = catalogExact.machines.find((m) => m.machineKey === "segaossa_nastro")!;
assert.ok(segaossa.safetyChecks.some((c) => c.normReference.includes("UNI EN 12268")), "Segaossa deve citare norma tecnica UNI EN 12268");
assert.ok(segaossa.safetyChecks.some((c) => c.code === "SEGAOSSA_RAPID_MOTOR_BRAKE"), "Segaossa deve avere check freno rapido motore entro 4s");

const pressa = catalogExact.machines.find((m) => m.machineKey === "pressa_compattatrice")!;
assert.ok(pressa.safetyChecks.some((c) => c.normReference.includes("UNI EN 16500")), "Pressa compattatrice deve citare UNI EN 16500");

const banchina = catalogExact.machines.find((m) => m.machineKey === "pedana_di_carico")!;
assert.ok(banchina.safetyChecks.some((c) => c.normReference.includes("UNI EN 1398")), "Banchina di carico deve citare EN 1398");

const batterie = catalogExact.machines.find((m) => m.machineKey === "stazione_ricarica_batterie")!;
assert.ok(batterie.safetyChecks.some((c) => c.normReference.includes("CEI EN 62485-3")), "Stazione ricarica deve citare CEI EN 62485-3");

const scaffali = catalogExact.machines.find((m) => m.machineKey === "scaffalature_portapallet")!;
assert.ok(scaffali.safetyChecks.some((c) => c.normReference.includes("UNI EN 15635")), "Scaffalature devono citare UNI EN 15635");

// -------------------------------------------------------------
// Test 4: Associazione dinamica con i reparti / ambienti di lavoro
// -------------------------------------------------------------
console.log("Test 4: Verifica associazione ambienti Step 2 -> Step 4 Macchine");
const environments = [
  { id: "env-iper-magazzino", name: "Magazzino e Ricevimento Merci", category: "warehouse" },
  { id: "env-iper-macelleria", name: "Laboratorio Macelleria", category: "production" },
  { id: "env-iper-pescheria", name: "Reparto Pescheria", category: "production" },
  { id: "env-iper-gastronomia", name: "Laboratorio Gastronomia e Salumeria", category: "production" },
  { id: "env-iper-panetteria", name: "Laboratorio Panetteria e Forno", category: "production" },
  { id: "env-iper-corsie", name: "Corsie di Vendita Ipermercato", category: "sales_floor" },
];

const suggestedWithEnvs = getSuggestedMachinesForEnvironmentsAndAteco(environments, "47.11.1");
assert.equal(suggestedWithEnvs.length, 21, "Tutte le 21 macchine devono essere raccomandate e collegate agli ambienti");

// Verifica associazione per ciascun ambiente:
const magazzinoMachines = suggestedWithEnvs.filter((m) => m.targetEnvironmentId === "env-iper-magazzino");
assert.equal(magazzinoMachines.length, 8, "env-iper-magazzino deve contenere 8 attrezzature logistiche");
assert.ok(magazzinoMachines.some((m) => m.machineKey === "muletto_frontale_elettrico"));
assert.ok(magazzinoMachines.some((m) => m.machineKey === "transpallet_elettrico_pedana"));
assert.ok(magazzinoMachines.some((m) => m.machineKey === "transpallet_elettrico_terra"));
assert.ok(magazzinoMachines.some((m) => m.machineKey === "transpallet_manuale"));
assert.ok(magazzinoMachines.some((m) => m.machineKey === "pressa_compattatrice"));
assert.ok(magazzinoMachines.some((m) => m.machineKey === "pedana_di_carico"));
assert.ok(magazzinoMachines.some((m) => m.machineKey === "stazione_ricarica_batterie"));
assert.ok(magazzinoMachines.some((m) => m.machineKey === "scaffalature_portapallet"));

const macelleriaMachines = suggestedWithEnvs.filter((m) => m.targetEnvironmentId === "env-iper-macelleria");
assert.equal(macelleriaMachines.length, 3, "env-iper-macelleria deve contenere 3 attrezzature di macelleria");
assert.ok(macelleriaMachines.some((m) => m.machineKey === "segaossa_nastro"));
assert.ok(macelleriaMachines.some((m) => m.machineKey === "tritacarne_refrigerato"));
assert.ok(macelleriaMachines.some((m) => m.machineKey === "insaccatrice_idraulica"));

const pescheriaMachines = suggestedWithEnvs.filter((m) => m.targetEnvironmentId === "env-iper-pescheria");
assert.equal(pescheriaMachines.length, 2, "env-iper-pescheria deve contenere 2 attrezzature di pescheria");
assert.ok(pescheriaMachines.some((m) => m.machineKey === "fabbricatore_ghiaccio_scaglie"));
assert.ok(pescheriaMachines.some((m) => m.machineKey === "squamatore_elettrico"));

const gastronomiaMachines = suggestedWithEnvs.filter((m) => m.targetEnvironmentId === "env-iper-gastronomia");
assert.equal(gastronomiaMachines.length, 3, "env-iper-gastronomia deve contenere 3 attrezzature di gastronomia");
assert.ok(gastronomiaMachines.some((m) => m.machineKey === "affettatrice_gravita_gdo"));
assert.ok(gastronomiaMachines.some((m) => m.machineKey === "forno_gastronomia_gdo"));
assert.ok(gastronomiaMachines.some((m) => m.machineKey === "confezionatrice_sottovuoto_campana"));

const panetteriaMachines = suggestedWithEnvs.filter((m) => m.targetEnvironmentId === "env-iper-panetteria");
assert.equal(panetteriaMachines.length, 4, "env-iper-panetteria deve contenere 4 attrezzature di panetteria");
assert.ok(panetteriaMachines.some((m) => m.machineKey === "impastatrice_spirale_gdo"));
assert.ok(panetteriaMachines.some((m) => m.machineKey === "spezzatrice_arrotondatrice"));
assert.ok(panetteriaMachines.some((m) => m.machineKey === "forno_rotativo_pane"));
assert.ok(panetteriaMachines.some((m) => m.machineKey === "tagliapane_professionale"));

const corsieMachines = suggestedWithEnvs.filter((m) => m.targetEnvironmentId === "env-iper-corsie");
assert.equal(corsieMachines.length, 1, "env-iper-corsie deve contenere 1 macchina lavasciuga");
assert.ok(corsieMachines.some((m) => m.machineKey === "lavasciuga_uomo_bordo"));

// -------------------------------------------------------------
// Test 5: Risoluzione solo su codice ATECO senza locali censiti (Ipermercato)
// -------------------------------------------------------------
console.log("Test 5: Integrazione automatica macchine per ATECO 47.11.1 senza ambienti preventivi");
const suggestedOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "47.11.1");
assert.equal(suggestedOnlyAteco.length, 21, "Devono essere suggerite tutte le 21 macchine");
assert.ok(
  suggestedOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// =========================================================================
// TEST DEDICATI ATECO 47.11.2 — SUPERMERCATO ALIMENTARE (400 - 2.500 MQ)
// =========================================================================
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 47.11.2 Supermercato Alimentare) ===");

// -------------------------------------------------------------
// Test 6: Priorità e risoluzione catalogo ATECO per Supermercato
// -------------------------------------------------------------
console.log("Test 6: Verifica priorità catalogo ATECO per Supermercato Alimentare (47.11.2 / 47.11.20)");
const superCatalogExact = getSectorMachineCatalogForAteco("47.11.2");
assert.equal(superCatalogExact.sectorKey, "supermercato_alimentare", "ATECO 47.11.2 deve restituire supermercato_alimentare");
assert.ok(superCatalogExact.sectorLabel.includes("Supermercato"), "L'etichetta deve includere Supermercato");

const superCatalogSubcode = getSectorMachineCatalogForAteco("47.11.20");
assert.equal(superCatalogSubcode.sectorKey, "supermercato_alimentare", "ATECO 47.11.20 deve restituire supermercato_alimentare");

// -------------------------------------------------------------
// Test 7: Verifica completezza delle 17 macchine professionali
// -------------------------------------------------------------
console.log("Test 7: Verifica completezza delle 17 attrezzature del Supermercato");
assert.equal(superCatalogExact.machines.length, 17, "Il catalogo Supermercato deve contenere esattamente 17 macchine");

const expectedSuperMachineKeys = [
  // Reparto 1: Logistica e Deposito (6)
  "stoccatore_elettrico_timone",
  "transpallet_elettrico_supermercato",
  "transpallet_manuale_supermercato",
  "pressa_compattatrice_compatta",
  "scaffalature_deposito_supermercato",
  "caricabatterie_trazione_supermercato",
  // Reparto 2: Reparto Macelleria (3)
  "tritacarne_refrigerato_supermercato",
  "termosigillatrice_vaschette_carni",
  "segaossa_banco_macelleria",
  // Reparto 3: Reparto Gastronomia e Salumeria (3)
  "affettatrice_gravita_supermercato",
  "confezionatrice_sottovuoto_supermercato",
  "tagliagrana_filo_elettrico",
  // Reparto 4: Reparto Panetteria & Punto Caldo (2)
  "forno_doratura_pane",
  "tagliapane_banco_supermercato",
  // Reparto 5: Reparto Pescheria (1)
  "fabbricatore_ghiaccio_supermercato",
  // Reparto 6 & 7: Corsie e Barriera Casse (2)
  "lavasciuga_operatore_terra",
  "banco_cassa_nastro_motorizzato",
];

for (const key of expectedSuperMachineKeys) {
  const found = superCatalogExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Attrezzatura Supermercato con key '${key}' deve essere presente nel catalogo`);
  assert.ok(found.name.length > 5, `Nome attrezzatura '${key}' deve essere descrittivo`);
  assert.ok(found.suggestedManufacturer.length > 2, `Produttore presente per '${key}'`);
  assert.ok(found.suggestedModel.length > 1, `Modello presente per '${key}'`);
  assert.ok(found.safetyChecks.length >= 3, `L'attrezzatura '${key}' deve avere almeno 3 controlli di sicurezza specifici`);
}

// -------------------------------------------------------------
// Test 8: Requisiti normativi, corsi e controlli specifici macchine
// -------------------------------------------------------------
console.log("Test 8: Controllo requisiti normativi, formazione e controlli tecnici specifici");

// 1. Stoccatore a timone
const stoccatore = superCatalogExact.machines.find((m) => m.machineKey === "stoccatore_elettrico_timone")!;
assert.equal(stoccatore.training.minHours, 4, "Stoccatore con uomo a terra richiede addestramento 4h ex art. 73 c. 4");
assert.equal(stoccatore.training.requiresPatentinoAccordoSR, false, "Stoccatore a timone con uomo a terra non richiede patentino Accordo SR");
assert.ok(stoccatore.safetyChecks.some((c) => c.code === "STOCCATORE_BELLY_SAFETY"), "Stoccatore deve avere pulsante antipancia al timone");
assert.ok(stoccatore.safetyChecks.some((c) => c.code === "STOCCATORE_CREEP_VERTICAL"), "Stoccatore deve avere marcia tartaruga a timone eretto");
assert.ok(stoccatore.safetyChecks.some((c) => c.code === "STOCCATORE_EMERGENCY_DISCONNECT"), "Stoccatore deve avere fungo staccabatteria");

// 2. Transpallet elettrico supermercato
const transpEle = superCatalogExact.machines.find((m) => m.machineKey === "transpallet_elettrico_supermercato")!;
assert.equal(transpEle.training.minHours, 4, "Transpallet elettrico richiede addestramento 4h");
assert.ok(transpEle.safetyChecks.some((c) => c.code === "SUPER_TRANSP_AUTO_BRAKE"), "Transpallet elettrico deve avere freno automatico a rilascio timone");
assert.ok(transpEle.safetyChecks.some((c) => c.code === "SUPER_TRANSP_HORN_SLOW"), "Transpallet deve avere clacson e marcia lenta");

// 3. Transpallet manuale
const transpMan = superCatalogExact.machines.find((m) => m.machineKey === "transpallet_manuale_supermercato")!;
assert.ok(transpMan.safetyChecks.some((c) => c.code === "SUPER_TPM_OVERLOAD_VALVE"), "Transpallet manuale deve avere valvola di massima pressione 2500 kg");
assert.ok(transpMan.safetyChecks.some((c) => c.code === "SUPER_TPM_TILLER_RETURN"), "Transpallet manuale deve avere ritorno a molla del timone");
assert.ok(transpMan.safetyChecks.some((c) => c.code === "SUPER_TPM_POLY_ROLLERS"), "Transpallet manuale deve avere ruote in poliuretano");

// 4. Pressa compatta
const pressaCompatta = superCatalogExact.machines.find((m) => m.machineKey === "pressa_compattatrice_compatta")!;
assert.ok(pressaCompatta.safetyChecks.some((c) => c.normReference.includes("UNI EN 16500")), "Pressa compatta deve citare UNI EN 16500");
assert.ok(pressaCompatta.safetyChecks.some((c) => c.code === "SUPER_PRESS_TWO_HAND_EJECTION"), "Pressa deve avere espulsione balla a due mani");

// 5. Scaffalature deposito
const scaffaliSuper = superCatalogExact.machines.find((m) => m.machineKey === "scaffalature_deposito_supermercato")!;
assert.ok(scaffaliSuper.safetyChecks.some((c) => c.normReference.includes("UNI EN 15635")), "Scaffalature devono citare UNI EN 15635");
assert.ok(scaffaliSuper.safetyChecks.some((c) => c.code === "SUPER_SCAFF_LOAD_SIGNS"), "Scaffalature devono avere targhe di portata ben visibili");
assert.ok(scaffaliSuper.safetyChecks.some((c) => c.code === "SUPER_SCAFF_SAFETY_PINS"), "Scaffalature devono avere perni/spine di sicurezza");
assert.ok(scaffaliSuper.safetyChecks.some((c) => c.code === "SUPER_SCAFF_COLUMN_GUARDS"), "Scaffalature devono avere paracolpi d'angolo");

// 6. Stazione ricarica
const ricaricaSuper = superCatalogExact.machines.find((m) => m.machineKey === "caricabatterie_trazione_supermercato")!;
assert.ok(ricaricaSuper.safetyChecks.some((c) => c.normReference.includes("CEI EN 62485-3")), "Ricarica deve citare aerazione idrogeno CEI EN 62485-3");
assert.ok(ricaricaSuper.safetyChecks.some((c) => c.normReference.includes("UNI EN 15154")), "Ricarica deve citare doccetta lavaocchi UNI EN 15154");
assert.ok(ricaricaSuper.safetyChecks.some((c) => c.code === "SUPER_BATT_ACID_SPILL_KIT"), "Ricarica deve avere kit neutralizzante acido solforico");

// 7. Tritacarne banco
const tritacarneBanco = superCatalogExact.machines.find((m) => m.machineKey === "tritacarne_refrigerato_supermercato")!;
assert.ok(tritacarneBanco.safetyChecks.some((c) => c.normReference.includes("UNI EN 12331")), "Tritacarne deve citare UNI EN 12331");
assert.ok(tritacarneBanco.safetyChecks.some((c) => c.code === "SUPER_TRITA_NECK_GUARD"), "Tritacarne deve avere bocca salvadita h>=120mm foro max 52mm");
assert.ok(tritacarneBanco.safetyChecks.some((c) => c.code === "SUPER_TRITA_PESTLE_MOCA"), "Tritacarne deve imporre pestello MOCA e divieto spinta manuale");
assert.ok(tritacarneBanco.safetyChecks.some((c) => c.code === "SUPER_TRITA_DEAD_MAN_REVERSE"), "Tritacarne deve avere inversione ad azione mantenuta");

// 8. Termosigillatrice vaschette
const termosigillatrice = superCatalogExact.machines.find((m) => m.machineKey === "termosigillatrice_vaschette_carni")!;
assert.ok(termosigillatrice.safetyChecks.some((c) => c.code === "SUPER_SIGIL_DRAWER_SAFETY"), "Termosigillatrice deve avere cassetto protetto antischiacciamento");
assert.ok(termosigillatrice.safetyChecks.some((c) => c.code === "SUPER_SIGIL_DIGITAL_TEMP"), "Termosigillatrice deve avere regolatore termico digitale");
assert.ok(termosigillatrice.safetyChecks.some((c) => c.code === "SUPER_SIGIL_PERIMETER_BLADE"), "Termosigillatrice deve avere coltello perimetrale protetto");

// 9. Segaossa banco
const segaossaBanco = superCatalogExact.machines.find((m) => m.machineKey === "segaossa_banco_macelleria")!;
assert.ok(segaossaBanco.safetyChecks.some((c) => c.normReference.includes("UNI EN 12268")), "Segaossa deve citare UNI EN 12268");
assert.ok(segaossaBanco.safetyChecks.some((c) => c.code === "SUPER_SEGA_GUIDALAMA_SHIELD"), "Segaossa deve avere guidalama con schermo fisso");
assert.ok(segaossaBanco.safetyChecks.some((c) => c.code === "SUPER_SEGA_MEAT_PUSHER"), "Segaossa deve avere spingicarne protettivo");
assert.ok(segaossaBanco.safetyChecks.some((c) => c.code === "SUPER_SEGA_PULLEY_DOOR_SWITCH"), "Segaossa deve avere microinterruttori pulegge");
assert.ok(segaossaBanco.safetyChecks.some((c) => c.code === "SUPER_SEGA_RAPID_BRAKE"), "Segaossa deve avere arresto rapido entro 4s");

// 10. Affettatrice gravità
const affettatriceSuper = superCatalogExact.machines.find((m) => m.machineKey === "affettatrice_gravita_supermercato")!;
assert.ok(affettatriceSuper.safetyChecks.some((c) => c.normReference.includes("UNI EN 1974")), "Affettatrice deve citare UNI EN 1974");
assert.ok(affettatriceSuper.safetyChecks.some((c) => c.code === "SUPER_AFF_BLADE_GUARD_RING"), "Affettatrice deve avere anello fisso paralama");
assert.ok(affettatriceSuper.safetyChecks.some((c) => c.code === "SUPER_AFF_ZERO_THICKNESS_LOCK"), "Affettatrice deve avere blocco a zero spessore");
assert.ok(affettatriceSuper.safetyChecks.some((c) => c.code === "SUPER_AFF_MIN_VOLTAGE_RELAY"), "Affettatrice deve avere relè di minima tensione");
assert.ok(affettatriceSuper.safetyChecks.some((c) => c.code === "SUPER_AFF_TRANSPARENT_PUSHER"), "Affettatrice deve avere pressamerce trasparente");

// 11. Confezionatrice sottovuoto
const sottovuotoSuper = superCatalogExact.machines.find((m) => m.machineKey === "confezionatrice_sottovuoto_supermercato")!;
assert.ok(sottovuotoSuper.safetyChecks.some((c) => c.code === "SUPER_SOTT_PLEXI_LID_SAFETY"), "Sottovuoto deve avere pistoni anticaduta");
assert.ok(sottovuotoSuper.safetyChecks.some((c) => c.code === "SUPER_SOTT_TEFLON_BARS"), "Sottovuoto deve avere barre teflonate e spegnimento a coperchio aperto");

// 12. Tagliagrana
const tagliagrana = superCatalogExact.machines.find((m) => m.machineKey === "tagliagrana_filo_elettrico")!;
assert.ok(tagliagrana.safetyChecks.some((c) => c.code === "SUPER_TAGLIA_BIMANUAL_CONTROL"), "Tagliagrana deve avere azionamento bimanuale o carter interbloccato");

// 13. Forno doratura pane
const fornoDoratura = superCatalogExact.machines.find((m) => m.machineKey === "forno_doratura_pane")!;
assert.ok(fornoDoratura.safetyChecks.some((c) => c.code === "SUPER_FORNO_DOUBLE_GLASS"), "Forno doratura deve avere doppio vetro ventilato");
assert.ok(fornoDoratura.safetyChecks.some((c) => c.code === "SUPER_FORNO_FAN_STOP"), "Forno doratura deve arrestare ventole all'apertura porta");
assert.ok(fornoDoratura.safetyChecks.some((c) => c.code === "SUPER_FORNO_CONDENSING_HOOD"), "Forno doratura deve avere cappa canalizzata");

// 14. Tagliapane banco
const tagliapaneBanco = superCatalogExact.machines.find((m) => m.machineKey === "tagliapane_banco_supermercato")!;
assert.ok(tagliapaneBanco.safetyChecks.some((c) => c.normReference.includes("UNI EN 13954")), "Tagliapane deve citare UNI EN 13954");
assert.ok(tagliapaneBanco.safetyChecks.some((c) => c.code === "SUPER_PANE_INTERLOCKED_LID"), "Tagliapane deve avere coperchio interbloccato");
assert.ok(tagliapaneBanco.safetyChecks.some((c) => c.code === "SUPER_PANE_PUSHER_PROTECTION"), "Tagliapane deve avere spintore protetto");

// 15. Fabbricatore ghiaccio
const ghiaccioSuper = superCatalogExact.machines.find((m) => m.machineKey === "fabbricatore_ghiaccio_supermercato")!;
assert.ok(ghiaccioSuper.safetyChecks.some((c) => c.normReference.includes("UNI EN 378")), "Ghiaccio deve citare circuito UNI EN 378");
assert.ok(ghiaccioSuper.safetyChecks.some((c) => c.normReference.includes("Reg. CE 1935/2004")), "Ghiaccio deve citare MOCA");
assert.ok(ghiaccioSuper.safetyChecks.some((c) => c.code === "SUPER_GHIACCIO_AIR_GAP_DRAIN"), "Ghiaccio deve avere scarico air-gap");

// 16. Lavasciuga operatore a terra
const lavasciugaTerra = superCatalogExact.machines.find((m) => m.machineKey === "lavasciuga_operatore_terra")!;
assert.ok(lavasciugaTerra.safetyChecks.some((c) => c.code === "SUPER_LAVASCIUGA_DEAD_MAN"), "Lavasciuga deve avere timone con uomo presente");
assert.ok(lavasciugaTerra.safetyChecks.some((c) => c.code === "SUPER_LAVASCIUGA_TANKS"), "Lavasciuga deve avere serbatoi estraibili e sensore troppopieno");

// 17. Banco cassa nastro motorizzato
const bancoCassa = superCatalogExact.machines.find((m) => m.machineKey === "banco_cassa_nastro_motorizzato")!;
assert.ok(bancoCassa.safetyChecks.some((c) => c.code === "SUPER_CASSA_STOP_PHOTOCELL"), "Banco cassa deve avere fotocellula di stop a fine corsa");
assert.ok(bancoCassa.safetyChecks.some((c) => c.code === "SUPER_CASSA_FOOT_PEDAL"), "Banco cassa deve avere comando a pedale a uomo presente");
assert.ok(bancoCassa.safetyChecks.some((c) => c.code === "SUPER_CASSA_IDLER_GUARDS"), "Banco cassa deve avere protezione antischiacciamento rulli folli");

// -------------------------------------------------------------
// Test 9: Associazione 1-a-1 ambienti Step 2 Supermercato -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 9: Verifica associazione ambienti Step 2 Supermercato -> Step 4 Macchine");
const superEnvironments = [
  { id: "env-super-magazzino", name: "Magazzino e Deposito Merci", category: "warehouse" },
  { id: "env-super-macelleria", name: "Reparto Macelleria", category: "production" },
  { id: "env-super-gastronomia", name: "Reparto Gastronomia e Salumeria", category: "production" },
  { id: "env-super-panetteria", name: "Reparto Panetteria e Punto Caldo", category: "production" },
  { id: "env-super-pescheria", name: "Reparto Pescheria", category: "production" },
  { id: "env-super-corsie", name: "Corsie di Vendita Supermercato", category: "sales_floor" },
  { id: "env-super-casse-uffici", name: "Barriera Casse e Uffici", category: "sales_office" },
];

const suggestedWithSuperEnvs = getSuggestedMachinesForEnvironmentsAndAteco(superEnvironments, "47.11.2");
assert.equal(suggestedWithSuperEnvs.length, 17, "Tutte le 17 macchine devono essere raccomandate e collegate agli ambienti del supermercato");

// Verifica 1-a-1 per ciascun ambiente:
const superMagazzinoMachines = suggestedWithSuperEnvs.filter((m) => m.targetEnvironmentId === "env-super-magazzino");
assert.equal(superMagazzinoMachines.length, 6, "env-super-magazzino deve contenere 6 attrezzature di magazzino/logistica");
assert.ok(superMagazzinoMachines.some((m) => m.machineKey === "stoccatore_elettrico_timone"));
assert.ok(superMagazzinoMachines.some((m) => m.machineKey === "transpallet_elettrico_supermercato"));
assert.ok(superMagazzinoMachines.some((m) => m.machineKey === "transpallet_manuale_supermercato"));
assert.ok(superMagazzinoMachines.some((m) => m.machineKey === "pressa_compattatrice_compatta"));
assert.ok(superMagazzinoMachines.some((m) => m.machineKey === "scaffalature_deposito_supermercato"));
assert.ok(superMagazzinoMachines.some((m) => m.machineKey === "caricabatterie_trazione_supermercato"));

const superMacelleriaMachines = suggestedWithSuperEnvs.filter((m) => m.targetEnvironmentId === "env-super-macelleria");
assert.equal(superMacelleriaMachines.length, 3, "env-super-macelleria deve contenere 3 attrezzature di macelleria");
assert.ok(superMacelleriaMachines.some((m) => m.machineKey === "tritacarne_refrigerato_supermercato"));
assert.ok(superMacelleriaMachines.some((m) => m.machineKey === "termosigillatrice_vaschette_carni"));
assert.ok(superMacelleriaMachines.some((m) => m.machineKey === "segaossa_banco_macelleria"));

const superGastronomiaMachines = suggestedWithSuperEnvs.filter((m) => m.targetEnvironmentId === "env-super-gastronomia");
assert.equal(superGastronomiaMachines.length, 3, "env-super-gastronomia deve contenere 3 attrezzature di gastronomia/salumeria");
assert.ok(superGastronomiaMachines.some((m) => m.machineKey === "affettatrice_gravita_supermercato"));
assert.ok(superGastronomiaMachines.some((m) => m.machineKey === "confezionatrice_sottovuoto_supermercato"));
assert.ok(superGastronomiaMachines.some((m) => m.machineKey === "tagliagrana_filo_elettrico"));

const superPanetteriaMachines = suggestedWithSuperEnvs.filter((m) => m.targetEnvironmentId === "env-super-panetteria");
assert.equal(superPanetteriaMachines.length, 2, "env-super-panetteria deve contenere 2 attrezzature di panetteria/punto caldo");
assert.ok(superPanetteriaMachines.some((m) => m.machineKey === "forno_doratura_pane"));
assert.ok(superPanetteriaMachines.some((m) => m.machineKey === "tagliapane_banco_supermercato"));

const superPescheriaMachines = suggestedWithSuperEnvs.filter((m) => m.targetEnvironmentId === "env-super-pescheria");
assert.equal(superPescheriaMachines.length, 1, "env-super-pescheria deve contenere 1 attrezzatura di pescheria");
assert.ok(superPescheriaMachines.some((m) => m.machineKey === "fabbricatore_ghiaccio_supermercato"));

const superCorsieMachines = suggestedWithSuperEnvs.filter((m) => m.targetEnvironmentId === "env-super-corsie");
assert.equal(superCorsieMachines.length, 1, "env-super-corsie deve contenere 1 lavasciuga pavimenti");
assert.ok(superCorsieMachines.some((m) => m.machineKey === "lavasciuga_operatore_terra"));

const superCasseMachines = suggestedWithSuperEnvs.filter((m) => m.targetEnvironmentId === "env-super-casse-uffici");
assert.equal(superCasseMachines.length, 1, "env-super-casse-uffici deve contenere 1 banco cassa con nastro motorizzato");
assert.ok(superCasseMachines.some((m) => m.machineKey === "banco_cassa_nastro_motorizzato"));

// -------------------------------------------------------------
// Test 10: Risoluzione solo su codice ATECO senza locali (Supermercato)
// -------------------------------------------------------------
console.log("Test 10: Integrazione automatica macchine per ATECO 47.11.2 senza ambienti preventivi");
const suggestedSuperOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "47.11.2");
assert.equal(suggestedSuperOnlyAteco.length, 17, "Devono essere suggerite tutte le 17 macchine del supermercato");
assert.ok(
  suggestedSuperOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// =========================================================================
// TEST DEDICATI ATECO 56.10.11 — RISTORAZIONE CON SOMMINISTRAZIONE (RISTORANTI, TRATTORIE, OSTERIE)
// =========================================================================
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 56.10.11 Ristorazione con Somministrazione) ===");

// -------------------------------------------------------------
// Test 11: Priorità e risoluzione catalogo ATECO per Ristorazione con Somministrazione
// -------------------------------------------------------------
console.log("Test 11: Verifica priorità catalogo ATECO per Ristorazione con Somministrazione (56.10.11 / 56.10.10 / 56.10.1)");
const ristCatalogExact = getSectorMachineCatalogForAteco("56.10.11");
assert.equal(ristCatalogExact.sectorKey, "ristorazione_somministrazione", "ATECO 56.10.11 deve restituire ristorazione_somministrazione");
assert.ok(ristCatalogExact.sectorLabel.includes("Ristorazione con Somministrazione"), "L'etichetta deve includere Ristorazione con Somministrazione");

const ristCatalogSubcode = getSectorMachineCatalogForAteco("56.10.10");
assert.equal(ristCatalogSubcode.sectorKey, "ristorazione_somministrazione", "ATECO 56.10.10 deve restituire ristorazione_somministrazione");

const ristCatalogPrefix = getSectorMachineCatalogForAteco("56.10.1");
assert.equal(ristCatalogPrefix.sectorKey, "ristorazione_somministrazione", "ATECO 56.10.1 deve restituire ristorazione_somministrazione");

const ristCatalogNumeric = getSectorMachineCatalogForAteco("561011");
assert.equal(ristCatalogNumeric.sectorKey, "ristorazione_somministrazione", "ATECO 561011 (senza punti) deve restituire ristorazione_somministrazione");

const ristCatalogNumericPrefix = getSectorMachineCatalogForAteco("56101");
assert.equal(ristCatalogNumericPrefix.sectorKey, "ristorazione_somministrazione", "ATECO 56101 (senza punti) deve restituire ristorazione_somministrazione");

// Verifica posizionamento: ristorazione_somministrazione precede ristorazione_alimentare (generico 56. / 10.)
const ristSommIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_somministrazione");
const ristGenIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");
assert.ok(ristSommIndex !== -1, "Settore ristorazione_somministrazione deve esistere nel catalogo");
assert.ok(ristGenIndex !== -1, "Settore generico ristorazione_alimentare deve esistere nel catalogo");
assert.equal(ristSommIndex, 0, "ristorazione_somministrazione deve trovarsi al primo posto della lista");
assert.ok(ristSommIndex < ristGenIndex, "ristorazione_somministrazione deve precedere il settore generico");

// Verifica che codici generici non profilati (es. 56.99 altre attività ristorazione) continuino a risolvere su ristorazione_alimentare
const genericFallbackCatalog = getSectorMachineCatalogForAteco("56.99");
assert.equal(genericFallbackCatalog.sectorKey, "ristorazione_alimentare", "ATECO 56.99 deve ricadere sul fallback generico ristorazione_alimentare");

// -------------------------------------------------------------
// Test 12: Verifica completezza delle 16 macchine professionali
// -------------------------------------------------------------
console.log("Test 12: Verifica completezza delle 16 attrezzature professionali con verifiche, corsi e modelli reali");
assert.equal(ristCatalogExact.machines.length, 16, "Il catalogo Ristorazione con Somministrazione deve contenere esattamente 16 macchine");

const expectedRistMachineKeys = [
  // Reparto 1: Cottura & Blocco Fuochi (7)
  "cucina_fuochi_gas",
  "forno_misto_ristorante",
  "friggitrice_ristorante",
  "abbattitore_temperatura",
  "frytop_piastra",
  "bollitore_cuocipasta",
  "cappa_aspirazione_cucina",
  // Reparto 2: Preparazione Fredda & Lavorazione (5)
  "affettatrice_gravita_ristorante",
  "cutter_robot_tagliaverdure",
  "confezionatrice_sottovuoto_ristorante",
  "tritacarne_grattugia_ristorante",
  "frullatore_immersione_mixer",
  // Reparto 3: Lavaggio Stoviglie & Plonge (1)
  "lavastoviglie_capotta_plonge",
  // Reparto 4: Freddo & Magazzino (1)
  "armadio_frigo_conservazione",
  // Reparto 5: Bar & Somministrazione (2)
  "fabbricatore_ghiaccio_ristorante",
  "macchina_caffe_espresso",
];

for (const key of expectedRistMachineKeys) {
  const found = ristCatalogExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Attrezzatura Ristorante con key '${key}' deve essere presente nel catalogo`);
  assert.ok(found.name.length > 5, `Nome attrezzatura '${key}' deve essere descrittivo`);
  assert.ok(found.suggestedManufacturer.length > 2, `Produttore presente per '${key}'`);
  assert.ok(found.suggestedModel.length > 1, `Modello presente per '${key}'`);
  assert.ok(found.safetyChecks.length >= 4, `L'attrezzatura '${key}' deve avere almeno 4 controlli di sicurezza specifici`);
  assert.equal(found.isSubjectToInailCheck, false, `L'attrezzatura '${key}' non è soggetta a verifica periodica INAIL All. VII`);
}

// 1. Blocco Cottura Fuochi
const fuochi = ristCatalogExact.machines.find((m) => m.machineKey === "cucina_fuochi_gas")!;
assert.ok(fuochi.suggestedManufacturer.includes("Angelo Po"), "Produttore fuochi deve includere Angelo Po");
assert.ok(fuochi.safetyChecks.some((c) => c.normReference.includes("UNI EN 203-1")), "Fuochi gas devono citare UNI EN 203-1");
assert.ok(fuochi.safetyChecks.some((c) => c.code === "FUOCHI_TERMOCOPPIA_SICUREZZA"), "Fuochi gas devono avere termocoppie di sicurezza");
assert.ok(fuochi.safetyChecks.some((c) => c.code === "FUOCHI_MANOPOLE_FERMO_SICUREZZA"), "Fuochi gas devono avere manopole con fermo");
assert.ok(fuochi.safetyChecks.some((c) => c.code === "FUOCHI_GRIGLIE_GHISA_STABILITA"), "Fuochi gas devono avere griglie ghisa stabili");
assert.ok(fuochi.safetyChecks.some((c) => c.code === "FUOCHI_VALVOLA_INTERCETTAZIONE_GAS"), "Fuochi gas devono avere valvola intercettazione gas");

// 2. Forno Misto
const forno = ristCatalogExact.machines.find((m) => m.machineKey === "forno_misto_ristorante")!;
assert.ok(forno.suggestedModel.includes("iCombi Pro"), "Modello forno deve includere iCombi Pro");
assert.ok(forno.safetyChecks.some((c) => c.code === "FORNO_VETRO_VENTILATO_ANTIUSTIONE"), "Forno deve avere vetro ventilato anti-ustione UNI EN 203-1");
assert.ok(forno.safetyChecks.some((c) => c.code === "FORNO_ARRESTO_VENTOLE_VAPORE"), "Forno deve avere arresto ventole e vapore all'apertura");
assert.ok(forno.safetyChecks.some((c) => c.code === "FORNO_CAPPA_CONDENSAZIONE_GRASSI"), "Forno deve avere cappa a condensazione canalizzata con scarico grassi");
assert.ok(forno.safetyChecks.some((c) => c.code === "FORNO_SCARICO_AIR_GAP"), "Forno deve avere scarico con interruzione d'aria");

// 3. Friggitrice
const friggitrice = ristCatalogExact.machines.find((m) => m.machineKey === "friggitrice_ristorante")!;
assert.ok(friggitrice.safetyChecks.some((c) => c.code === "FRIGGITRICE_TERMOSTATO_MAX_230"), "Friggitrice deve avere termostato sicurezza riarmo manuale < 230°C");
assert.ok(friggitrice.safetyChecks.some((c) => c.code === "FRIGGITRICE_VALVOLA_SCARICO_SICURA"), "Friggitrice deve avere valvola scarico con sicura e prolunga");
assert.ok(friggitrice.safetyChecks.some((c) => c.code === "FRIGGITRICE_ZONA_FREDDA_DECANTATORE"), "Friggitrice deve avere zona fredda e controllo composti polari");

// 4. Abbattitore
const abbattitore = ristCatalogExact.machines.find((m) => m.machineKey === "abbattitore_temperatura")!;
assert.ok(abbattitore.suggestedManufacturer.includes("Irinox"), "Produttore abbattitore deve includere Irinox");
assert.ok(abbattitore.safetyChecks.some((c) => c.normReference.includes("Reg. CE 853/2004")), "Abbattitore deve citare Reg. CE 853/2004");
assert.ok(abbattitore.safetyChecks.some((c) => c.code === "ABBATTITORE_BONIFICA_ANISAKIS"), "Abbattitore deve avere bonifica preventiva Anisakis");
assert.ok(abbattitore.safetyChecks.some((c) => c.code === "ABBATTITORE_SONDA_CUORE_SPILLONE"), "Abbattitore deve avere sonda a spillone");
assert.ok(abbattitore.safetyChecks.some((c) => c.normReference.includes("UNI EN 378")), "Abbattitore deve citare circuito frigorifero UNI EN 378");

// 5. Frytop
const frytop = ristCatalogExact.machines.find((m) => m.machineKey === "frytop_piastra")!;
assert.ok(frytop.safetyChecks.some((c) => c.code === "FRYTOP_PARASPRUZZI_INOX"), "Frytop deve avere paraspruzzi perimetrale inox");
assert.ok(frytop.safetyChecks.some((c) => c.code === "FRYTOP_CASSETTO_RACCOGLIGRASSO"), "Frytop deve avere cassetto raccogligrasso con fermo corsa");

// 6. Cuocipasta
const cuocipasta = ristCatalogExact.machines.find((m) => m.machineKey === "bollitore_cuocipasta")!;
assert.ok(cuocipasta.safetyChecks.some((c) => c.code === "CUOCIPASTA_SFIORATORE_TROPPOPIENO"), "Cuocipasta deve avere scarico sfioratore troppopieno");
assert.ok(cuocipasta.safetyChecks.some((c) => c.code === "CUOCIPASTA_RUBINETTO_CARICO_ACQUA"), "Cuocipasta deve avere rubinetto carico acqua incorporato");
assert.ok(cuocipasta.safetyChecks.some((c) => c.code === "CUOCIPASTA_TERMOSTATO_SICUREZZA_SECCO"), "Cuocipasta deve avere termostato sicurezza funzionamento a secco");

// 7. Cappa aspirazione
const cappa = ristCatalogExact.machines.find((m) => m.machineKey === "cappa_aspirazione_cucina")!;
assert.ok(cappa.safetyChecks.some((c) => c.code === "CAPPA_FILTRI_LABIRINTO_INOX"), "Cappa deve avere filtri a labirinto inox lavabili");
assert.ok(cappa.safetyChecks.some((c) => c.code === "CAPPA_IMPIANTO_SPEGNIMENTO_ANSUL"), "Cappa deve avere impianto automatico spegnimento tipo Ansul R-102 NFPA 96 / UNI ISO 15371");
assert.ok(cappa.safetyChecks.some((c) => c.code === "CAPPA_CANALIZZAZIONE_TETTO_INDIPENDENTE"), "Cappa deve avere canalizzazione a tetto indipendente");

// 8. Affettatrice gravità
const affettatrice = ristCatalogExact.machines.find((m) => m.machineKey === "affettatrice_gravita_ristorante")!;
assert.ok(affettatrice.safetyChecks.some((c) => c.normReference.includes("UNI EN 1974")), "Affettatrice deve citare UNI EN 1974");
assert.ok(affettatrice.safetyChecks.some((c) => c.code === "AFFETTATRICE_ANELLO_FISSO_PARALAMA"), "Affettatrice deve avere anello fisso paralama continuo");
assert.ok(affettatrice.safetyChecks.some((c) => c.code === "AFFETTATRICE_BLOCCO_CARRO_SPESSORE_ZERO"), "Affettatrice deve avere blocco carro a spessore zero");
assert.ok(affettatrice.safetyChecks.some((c) => c.code === "AFFETTATRICE_RELE_MINIMA_TENSIONE"), "Affettatrice deve avere relè di minima tensione");
assert.ok(affettatrice.safetyChecks.some((c) => c.code === "AFFETTATRICE_PRESSAMERCE_SCHERMO_DITA"), "Affettatrice deve avere pressamerce con schermo salvadita");

// 9. Cutter robot
const cutter = ristCatalogExact.machines.find((m) => m.machineKey === "cutter_robot_tagliaverdure")!;
assert.ok(cutter.safetyChecks.some((c) => c.normReference.includes("UNI EN 12852")), "Cutter deve citare UNI EN 12852");
assert.ok(cutter.safetyChecks.some((c) => c.code === "CUTTER_COPERCHIO_INTERBLOCCO_2SEC"), "Cutter deve avere arresto lama entro 2s all'apertura coperchio");
assert.ok(cutter.safetyChecks.some((c) => c.code === "CUTTER_PESTELLO_SALVADITA"), "Cutter deve avere pestello salvadita sagomato");
assert.ok(cutter.safetyChecks.some((c) => c.code === "CUTTER_BLOCCO_VASCA_MECCANICO"), "Cutter deve avere blocco vasca meccanico");

// 10. Confezionatrice sottovuoto
const sottovuoto = ristCatalogExact.machines.find((m) => m.machineKey === "confezionatrice_sottovuoto_ristorante")!;
assert.ok(sottovuoto.safetyChecks.some((c) => c.code === "SOTTOVUOTO_COPERCHIO_PISTONI_ANTICADUTA"), "Sottovuoto deve avere coperchio con pistoni anticaduta");
assert.ok(sottovuoto.safetyChecks.some((c) => c.code === "SOTTOVUOTO_BARRE_SALDANTI_SCHERMATE"), "Sottovuoto deve avere barre saldanti teflonate schermate");
assert.ok(sottovuoto.safetyChecks.some((c) => c.code === "SOTTOVUOTO_POMPA_DISOLEATORE_FUMI"), "Sottovuoto deve avere pompa con disoleatore fumi");

// 11. Tritacarne grattugia
const tritacarne = ristCatalogExact.machines.find((m) => m.machineKey === "tritacarne_grattugia_ristorante")!;
assert.ok(tritacarne.safetyChecks.some((c) => c.normReference.includes("UNI EN 12331")), "Tritacarne deve citare UNI EN 12331");
assert.ok(tritacarne.safetyChecks.some((c) => c.code === "TRITACARNE_BOCCA_SALVADITA_12331"), "Tritacarne deve avere bocca salvadita collo h>=120mm foro max 52mm");
assert.ok(tritacarne.safetyChecks.some((c) => c.code === "TRITACARNE_LEVA_GRATTUGIA_INTERBLOCCO"), "Tritacarne deve avere leva pressore grattugia interbloccata UNI EN 454");
assert.ok(tritacarne.safetyChecks.some((c) => c.code === "TRITACARNE_PESTELLO_PLASTICO_MOCA"), "Tritacarne deve avere pestello plastico MOCA con divieto spinta manuale");

// 12. Frullatore immersione mixer
const mixer = ristCatalogExact.machines.find((m) => m.machineKey === "frullatore_immersione_mixer")!;
assert.ok(mixer.safetyChecks.some((c) => c.code === "MIXER_DOPPIO_COMANDO_SICUREZZA"), "Mixer deve avere interruttore a doppio comando");
assert.ok(mixer.safetyChecks.some((c) => c.code === "MIXER_CAMPANA_AVVOLGENTE_MOCA"), "Mixer deve avere campana avvolgente MOCA");

// 13. Lavastoviglie capotta
const lavastoviglie = ristCatalogExact.machines.find((m) => m.machineKey === "lavastoviglie_capotta_plonge")!;
assert.ok(lavastoviglie.safetyChecks.some((c) => c.code === "LAVASTOVIGLIE_CAPOTTA_CONTROBILANCIATA"), "Lavastoviglie deve avere capotta controbilanciata con arresto pompa al sollevamento");
assert.ok(lavastoviglie.safetyChecks.some((c) => c.normReference.includes("UNI EN 1717")), "Lavastoviglie deve citare dispositivo anti-reflusso UNI EN 1717");
assert.ok(lavastoviglie.safetyChecks.some((c) => c.code === "LAVASTOVIGLIE_DOSATORI_PERISTALTICI"), "Lavastoviglie deve avere dosatori peristaltici brillantante/detergente");

// 14. Armadio frigo
const frigo = ristCatalogExact.machines.find((m) => m.machineKey === "armadio_frigo_conservazione")!;
assert.ok(frigo.safetyChecks.some((c) => c.code === "FRIGO_CONTROLLO_DIGITALE_ALLARME_HACCP"), "Frigo deve avere controllo digitale temperatura con allarme HACCP");
assert.ok(frigo.safetyChecks.some((c) => c.code === "FRIGO_GUARNIZIONI_MAGNETICHE_PULIBILI"), "Frigo deve avere guarnizioni magnetiche pulibili e sostituibili");
assert.ok(frigo.safetyChecks.some((c) => c.code === "FRIGO_ISOLAMENTO_CICLOPENTANO_GAS_378"), "Frigo deve avere isolamento ciclopentano ecologico e circuito UNI EN 378");

// 15. Fabbricatore ghiaccio
const ghiaccio = ristCatalogExact.machines.find((m) => m.machineKey === "fabbricatore_ghiaccio_ristorante")!;
assert.ok(ghiaccio.safetyChecks.some((c) => c.normReference.includes("UNI EN 378")), "Fabbricatore ghiaccio deve citare UNI EN 378");
assert.ok(ghiaccio.safetyChecks.some((c) => c.normReference.includes("Reg. CE 1935/2004")), "Fabbricatore ghiaccio deve citare MOCA");
assert.ok(ghiaccio.safetyChecks.some((c) => c.normReference.includes("UNI EN 1717")), "Fabbricatore ghiaccio deve citare scarico anti-reflusso UNI EN 1717");

// 16. Macchina caffè espresso
const caffe = ristCatalogExact.machines.find((m) => m.machineKey === "macchina_caffe_espresso")!;
assert.ok(caffe.safetyChecks.some((c) => c.normReference.includes("D.Lgs. 26/2016")), "Macchina caffè deve citare PED D.Lgs. 26/2016");
assert.ok(caffe.safetyChecks.some((c) => c.code === "CAFFE_VALVOLA_PED_SOVRAPRESSIONE"), "Macchina caffè deve avere valvola di sicurezza PED");
assert.ok(caffe.safetyChecks.some((c) => c.code === "CAFFE_LANCIA_VAPORE_COOL_TOUCH"), "Macchina caffè deve avere lancia vapore isolata Cool-Touch antiscottatura");
assert.ok(caffe.safetyChecks.some((c) => c.code === "CAFFE_MANOMETRI_DOPPIA_SCALA"), "Macchina caffè deve avere manometri pressione certificati");

// -------------------------------------------------------------
// Test 13: Associazione 1-a-1 ambienti Step 2 Ristorante (env-rist-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 13: Verifica associazione ambienti Step 2 Ristorante (env-rist-*) -> Step 4 Macchine");
const ristEnvironments = [
  { id: "env-rist-cucina", name: "Cucina Calda e Blocco Fuochi", category: "production" },
  { id: "env-rist-prep-fredda", name: "Laboratorio Preparazione Fredda e Lavorazione", category: "production" },
  { id: "env-rist-plonge", name: "Zona Lavaggio Stoviglie e Plonge", category: "production" },
  { id: "env-rist-celle", name: "Celle Frigorifere e Conservazione", category: "warehouse" },
  { id: "env-rist-bar-cassa", name: "Banco Bar e Somministrazione", category: "public" },
];

const suggestedWithRistEnvs = getSuggestedMachinesForEnvironmentsAndAteco(ristEnvironments, "56.10.11");
assert.equal(suggestedWithRistEnvs.length, 16, "Tutte le 16 macchine devono essere raccomandate e collegate agli ambienti del ristorante");

// Verifica 1-a-1 per ciascun ambiente:
const cucinaMachines = suggestedWithRistEnvs.filter((m) => m.targetEnvironmentId === "env-rist-cucina");
assert.equal(cucinaMachines.length, 7, "env-rist-cucina deve contenere 7 attrezzature di cottura");
assert.ok(cucinaMachines.some((m) => m.machineKey === "cucina_fuochi_gas"));
assert.ok(cucinaMachines.some((m) => m.machineKey === "forno_misto_ristorante"));
assert.ok(cucinaMachines.some((m) => m.machineKey === "friggitrice_ristorante"));
assert.ok(cucinaMachines.some((m) => m.machineKey === "abbattitore_temperatura"));
assert.ok(cucinaMachines.some((m) => m.machineKey === "frytop_piastra"));
assert.ok(cucinaMachines.some((m) => m.machineKey === "bollitore_cuocipasta"));
assert.ok(cucinaMachines.some((m) => m.machineKey === "cappa_aspirazione_cucina"));

const prepFreddaMachines = suggestedWithRistEnvs.filter((m) => m.targetEnvironmentId === "env-rist-prep-fredda");
assert.equal(prepFreddaMachines.length, 5, "env-rist-prep-fredda deve contenere 5 attrezzature di preparazione fredda");
assert.ok(prepFreddaMachines.some((m) => m.machineKey === "affettatrice_gravita_ristorante"));
assert.ok(prepFreddaMachines.some((m) => m.machineKey === "cutter_robot_tagliaverdure"));
assert.ok(prepFreddaMachines.some((m) => m.machineKey === "confezionatrice_sottovuoto_ristorante"));
assert.ok(prepFreddaMachines.some((m) => m.machineKey === "tritacarne_grattugia_ristorante"));
assert.ok(prepFreddaMachines.some((m) => m.machineKey === "frullatore_immersione_mixer"));

const plongeMachines = suggestedWithRistEnvs.filter((m) => m.targetEnvironmentId === "env-rist-plonge");
assert.equal(plongeMachines.length, 1, "env-rist-plonge deve contenere 1 lavastoviglie a capotta");
assert.ok(plongeMachines.some((m) => m.machineKey === "lavastoviglie_capotta_plonge"));

const celleMachines = suggestedWithRistEnvs.filter((m) => m.targetEnvironmentId === "env-rist-celle");
assert.equal(celleMachines.length, 1, "env-rist-celle deve contenere 1 armadio frigo conservazione");
assert.ok(celleMachines.some((m) => m.machineKey === "armadio_frigo_conservazione"));

// Verifica anche supporto per env-rist-dispensa
const dispensaEnvTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-rist-dispensa", name: "Dispensa Alimenti", category: "warehouse" }],
  "56.10.11",
);
assert.ok(
  dispensaEnvTest.some((m) => m.targetEnvironmentId === "env-rist-dispensa" && m.machineKey === "armadio_frigo_conservazione"),
  "env-rist-dispensa deve associare l'armadio frigo di conservazione",
);

const barMachines = suggestedWithRistEnvs.filter((m) => m.targetEnvironmentId === "env-rist-bar-cassa");
assert.equal(barMachines.length, 2, "env-rist-bar-cassa deve contenere 2 attrezzature di bar/cassa");
assert.ok(barMachines.some((m) => m.machineKey === "fabbricatore_ghiaccio_ristorante"));
assert.ok(barMachines.some((m) => m.machineKey === "macchina_caffe_espresso"));

// -------------------------------------------------------------
// Test 14: Risoluzione solo su codice ATECO senza locali censiti (Ristorante)
// -------------------------------------------------------------
console.log("Test 14: Integrazione automatica macchine per ATECO 56.10.11 senza ambienti preventivi");
const suggestedRistOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "56.10.11");
assert.equal(suggestedRistOnlyAteco.length, 16, "Devono essere suggerite tutte le 16 macchine del ristorante");
assert.ok(
  suggestedRistOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per varianti di codice ATECO
for (const code of ["56.10.10", "56.10.1", "561011", "56101"]) {
  const fallbackRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackRes.length, 16, `ATECO variant '${code}' deve restituire tutte le 16 macchine`);
  assert.ok(fallbackRes.every((m) => m.sourceReason === "ateco"));
}

// -------------------------------------------------------------
// TEST DEDICATI ATECO 56.10.20 - PIZZERIA TRADIZIONALE, AL TAGLIO E ASPORTO / DELIVERY
// -------------------------------------------------------------
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 56.10.20 Pizzeria / Asporto) ===");

// -------------------------------------------------------------
// Test 15: Verifica priorità settore pizzeria_asporto su 56.10.20 e 56.10.2
// -------------------------------------------------------------
console.log("Test 15: Verifica priorità catalogo ATECO per Pizzeria / Asporto (56.10.20 / 56.10.2 / 561020 / 56102)");
const pizCatalogExact = getSectorMachineCatalogForAteco("56.10.20");
assert.equal(pizCatalogExact.sectorKey, "pizzeria_asporto", "ATECO 56.10.20 deve restituire pizzeria_asporto");
assert.ok(pizCatalogExact.sectorLabel.includes("Pizzeria"), "L'etichetta deve includere Pizzeria");

const pizCatalogPrefix = getSectorMachineCatalogForAteco("56.10.2");
assert.equal(pizCatalogPrefix.sectorKey, "pizzeria_asporto", "ATECO 56.10.2 deve restituire pizzeria_asporto");

const pizCatalogNumeric = getSectorMachineCatalogForAteco("561020");
assert.equal(pizCatalogNumeric.sectorKey, "pizzeria_asporto", "ATECO 561020 (senza punti) deve restituire pizzeria_asporto");

const pizCatalogNumericPrefix = getSectorMachineCatalogForAteco("56102");
assert.equal(pizCatalogNumericPrefix.sectorKey, "pizzeria_asporto", "ATECO 56102 (senza punti) deve restituire pizzeria_asporto");

// Verifica posizionamento: pizzeria_asporto segue ristorazione_somministrazione e precede ristorazione_alimentare generico
const ristSommIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_somministrazione");
const pizIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "pizzeria_asporto");
const ristGenIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");

assert.ok(pizIdx !== -1, "Settore pizzeria_asporto deve esistere nel catalogo");
assert.equal(pizIdx, 1, "pizzeria_asporto deve trovarsi subito dopo ristorazione_somministrazione (indice 1)");
assert.ok(ristSommIdx < pizIdx, "ristorazione_somministrazione deve precedere pizzeria_asporto");
assert.ok(pizIdx < ristGenIdx, "pizzeria_asporto deve precedere il settore generico ristorazione_alimentare");

// -------------------------------------------------------------
// Test 16: Verifica completezza delle 16 attrezzature professionali per pizzeria
// -------------------------------------------------------------
console.log("Test 16: Verifica completezza delle 16 attrezzature professionali per pizzeria con modelli reali e verifiche tecniche");
assert.equal(pizCatalogExact.machines.length, 16, "Il catalogo Pizzeria deve contenere esattamente 16 macchine");

const expectedPizMachineKeys = [
  // Laboratorio & Cottura Pizze (4)
  "forno_pizze_professionale",
  "banco_pizza_refrigerato",
  "stendi_pizza_dilaminatrice",
  "cappa_aspirazione_forno_pizze",
  // Impasto & Lievitazione (3)
  "impastatrice_spirale_pizzeria",
  "spezzatrice_arrotondatrice_pizze",
  "armadio_ferma_lievitazione",
  // Preparazione Condimenti & Fritti (4)
  "tagliamozzarella_sfilacciatrice",
  "affettatrice_gravita_pizzeria",
  "friggitrice_pizzeria",
  "cutter_robot_condimenti",
  // Lavaggio Teglie & Stoviglie (1)
  "lavaoggetti_lavateglie",
  // Freddo & Magazzino (1)
  "armadio_frigo_deperibili_pizza",
  // Sala & Bar (2)
  "fabbricatore_ghiaccio_pizzeria",
  "macchina_caffe_pizzeria",
  // Area Rifiuti & Ceneri (1)
  "bidone_metallico_ceneri",
];

for (const key of expectedPizMachineKeys) {
  const found = pizCatalogExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Attrezzatura Pizzeria con key '${key}' deve essere presente nel catalogo`);
  assert.ok(found.name.length > 5, `Nome attrezzatura '${key}' deve essere descrittivo`);
  assert.ok(found.suggestedManufacturer.length > 2, `Produttore presente per '${key}'`);
  assert.ok(found.suggestedModel.length > 1, `Modello presente per '${key}'`);
  assert.ok(found.safetyChecks.length >= 4, `L'attrezzatura '${key}' deve avere almeno 4 controlli di sicurezza specifici`);
  assert.equal(found.isSubjectToInailCheck, false, `L'attrezzatura '${key}' non è soggetta a verifica periodica INAIL All. VII`);
}

// 1. Forno Pizze Professionale
const fornoPiz = pizCatalogExact.machines.find((m) => m.machineKey === "forno_pizze_professionale")!;
assert.ok(fornoPiz.suggestedManufacturer.includes("Moretti Forni") || fornoPiz.suggestedManufacturer.includes("Marana Forni"), "Produttore forno pizze deve includere Moretti Forni o Marana");
assert.ok(fornoPiz.safetyChecks.some((c) => c.code === "FORNO_PIZZA_VETRO_VENTILATO_ISOLANTE"), "Forno deve avere vetro ventilato isolante");
assert.ok(fornoPiz.safetyChecks.some((c) => c.code === "FORNO_PIZZA_TERMOSTATO_MASSIMA_RIARMO"), "Forno deve avere termostato massima a riarmo");
assert.ok(fornoPiz.safetyChecks.some((c) => c.normReference.includes("UNI 1127")), "Forno deve citare UNI 1127 per abbattitore fuliggine");
assert.ok(fornoPiz.safetyChecks.some((c) => c.code === "FORNO_PIZZA_TERMOCOPPIA_INTERCETTAZIONE_GAS"), "Forno deve avere termocoppia sicurezza gas");

// 2. Banco Pizza Refrigerato
const banco = pizCatalogExact.machines.find((m) => m.machineKey === "banco_pizza_refrigerato")!;
assert.ok(banco.suggestedManufacturer.includes("Fimar") || banco.suggestedManufacturer.includes("Ilsa"), "Produttore banco pizza");
assert.ok(banco.safetyChecks.some((c) => c.normReference.includes("Reg. CE 1935/2004")), "Banco pizza granito deve citare MOCA");
assert.ok(banco.safetyChecks.some((c) => c.code === "BANCO_PIZZA_VETRINA_INGREDIENTI_PARAFIATO"), "Banco pizza deve avere vetrina parafiato");
assert.ok(banco.safetyChecks.some((c) => c.code === "BANCO_PIZZA_CONTROLLO_DIGITALE_HACCP"), "Banco pizza controllo digitale");
assert.ok(banco.safetyChecks.some((c) => c.normReference.includes("UNI EN 378")), "Banco pizza circuito frigo UNI EN 378");

// 3. Stendipizza Dilaminatrice
const stendipizza = pizCatalogExact.machines.find((m) => m.machineKey === "stendi_pizza_dilaminatrice")!;
assert.ok(stendipizza.suggestedManufacturer.includes("Fimar") || stendipizza.suggestedManufacturer.includes("Prismafood"), "Produttore stendipizza");
assert.ok(stendipizza.safetyChecks.some((c) => c.normReference.includes("UNI EN 12042")), "Stendipizza deve citare UNI EN 12042");
assert.ok(stendipizza.safetyChecks.some((c) => c.code === "STENDIPIZZA_ARRESTO_EMERGENZA_FUNGO"), "Stendipizza arresto emergenza fungo");

// 4. Cappa Aspirazione Forno Pizze
const cappaPizze = pizCatalogExact.machines.find((m) => m.machineKey === "cappa_aspirazione_forno_pizze")!;
assert.ok(cappaPizze.suggestedManufacturer.includes("Smoki") || cappaPizze.suggestedManufacturer.includes("Zainetti"), "Produttore cappa pizze Smoki/Zainetti");
assert.ok(cappaPizze.safetyChecks.some((c) => c.normReference.includes("UNI 1127")), "Cappa pizze deve citare abbattitore fuliggine ad acqua UNI 1127");
assert.ok(cappaPizze.safetyChecks.some((c) => c.code === "CAPPA_PIZZA_FILTRI_LABIRINTO_INOX"), "Cappa filtri labirinto inox");

// 5. Impastatrice a Spirale Pizzeria
const impastatrice = pizCatalogExact.machines.find((m) => m.machineKey === "impastatrice_spirale_pizzeria")!;
assert.ok(impastatrice.suggestedManufacturer.includes("Sunmix") || impastatrice.suggestedManufacturer.includes("Pizzagroup"), "Produttore impastatrice");
assert.ok(impastatrice.safetyChecks.some((c) => c.normReference.includes("UNI EN 453")), "Impastatrice deve citare UNI EN 453");
assert.ok(impastatrice.safetyChecks.some((c) => c.code === "IMPASTATRICE_RIPARO_GRIGLIA_INTERBLOCCO_453"), "Impastatrice riparo griglia interbloccato");
assert.ok(impastatrice.safetyChecks.some((c) => c.code === "IMPASTATRICE_DISTANZE_SICUREZZA_ORGANO_VASCA"), "Impastatrice distanze di sicurezza");

// 6. Spezzatrice Arrotondatrice Pizze
const arrotondatrice = pizCatalogExact.machines.find((m) => m.machineKey === "spezzatrice_arrotondatrice_pizze")!;
assert.ok(arrotondatrice.suggestedManufacturer.includes("Vitella") || arrotondatrice.suggestedManufacturer.includes("OEM"), "Produttore arrotondatrice");
assert.ok(arrotondatrice.safetyChecks.some((c) => c.normReference.includes("UNI EN 12042")), "Arrotondatrice deve citare UNI EN 12042");
assert.ok(arrotondatrice.safetyChecks.some((c) => c.code === "ARROTONDATRICE_TRAMOGGIA_SALVADITA_INTERBLOCCO"), "Arrotondatrice tramoggia salvadita");

// 7. Armadio Ferma-Lievitazione
const fermaLievito = pizCatalogExact.machines.find((m) => m.machineKey === "armadio_ferma_lievitazione")!;
assert.ok(fermaLievito.suggestedManufacturer.includes("Coldline") || fermaLievito.suggestedManufacturer.includes("Ilsa"), "Produttore ferma lievito Coldline/Ilsa");
assert.ok(fermaLievito.safetyChecks.some((c) => c.code === "FERMA_LIEVITO_CONTROLLO_TERMO_IGROMETRICO"), "Ferma lievito controllo termo-igrometrico");
assert.ok(fermaLievito.safetyChecks.some((c) => c.normReference.includes("UNI EN 1717")), "Ferma lievito disconnettore idrico UNI EN 1717");

// 8. Tagliamozzarella Sfilacciatrice
const tagliamozzarella = pizCatalogExact.machines.find((m) => m.machineKey === "tagliamozzarella_sfilacciatrice")!;
assert.ok(tagliamozzarella.suggestedManufacturer.includes("Sirman") || tagliamozzarella.suggestedManufacturer.includes("Fimar"), "Produttore tagliamozzarella");
assert.ok(tagliamozzarella.safetyChecks.some((c) => c.normReference.includes("UNI EN 12852")), "Tagliamozzarella deve citare UNI EN 12852");
assert.ok(tagliamozzarella.safetyChecks.some((c) => c.code === "TAGLIAMOZZARELLA_BOCCA_CARICO_PESTELLO"), "Tagliamozzarella pestello salvadita");

// 9. Affettatrice Gravità Pizzeria
const affettatricePiz = pizCatalogExact.machines.find((m) => m.machineKey === "affettatrice_gravita_pizzeria")!;
assert.ok(affettatricePiz.suggestedManufacturer.includes("Berkel") || affettatricePiz.suggestedManufacturer.includes("Sirman"), "Produttore affettatrice");
assert.ok(affettatricePiz.safetyChecks.some((c) => c.normReference.includes("UNI EN 1974")), "Affettatrice deve citare UNI EN 1974");
assert.ok(affettatricePiz.safetyChecks.some((c) => c.code === "AFFETTATRICE_PIZZA_ANELLO_FISSO_PARALAMA"), "Affettatrice anello fisso paralama");
assert.ok(affettatricePiz.safetyChecks.some((c) => c.code === "AFFETTATRICE_PIZZA_BLOCCO_CARRO_SPESSORE_ZERO"), "Affettatrice blocco carro spessore zero");

// 10. Friggitrice Pizzeria
const friggitricePiz = pizCatalogExact.machines.find((m) => m.machineKey === "friggitrice_pizzeria")!;
assert.ok(friggitricePiz.suggestedManufacturer.includes("Lotus") || friggitricePiz.suggestedManufacturer.includes("Giorik"), "Produttore friggitrice");
assert.ok(friggitricePiz.safetyChecks.some((c) => c.code === "FRIGGITRICE_PIZZA_TERMOSTATO_MAX_230"), "Friggitrice termostato max < 230C");
assert.ok(friggitricePiz.safetyChecks.some((c) => c.code === "FRIGGITRICE_PIZZA_ZONA_FREDDA_POLARI_25"), "Friggitrice composti polari < 25%");

// 11. Cutter Robot Condimenti
const cutterPiz = pizCatalogExact.machines.find((m) => m.machineKey === "cutter_robot_condimenti")!;
assert.ok(cutterPiz.suggestedManufacturer.includes("Robot Coupe") || cutterPiz.suggestedManufacturer.includes("Dito Sama"), "Produttore cutter");
assert.ok(cutterPiz.safetyChecks.some((c) => c.normReference.includes("UNI EN 12852")), "Cutter deve citare UNI EN 12852");
assert.ok(cutterPiz.safetyChecks.some((c) => c.code === "CUTTER_PIZZA_COPERCHIO_INTERBLOCCO_2SEC"), "Cutter arresto lama entro 2s");

// 12. Lavaoggetti Lavateglie
const lavaoggetti = pizCatalogExact.machines.find((m) => m.machineKey === "lavaoggetti_lavateglie")!;
assert.ok(lavaoggetti.suggestedManufacturer.includes("Winterhalter") || lavaoggetti.suggestedManufacturer.includes("Meiko"), "Produttore lavaoggetti");
assert.ok(lavaoggetti.safetyChecks.some((c) => c.normReference.includes("UNI EN 1717")), "Lavaoggetti dispositivo anti-reflusso UNI EN 1717");
assert.ok(lavaoggetti.safetyChecks.some((c) => c.code === "LAVATEGlie_VASCA_CAPOTTA_MICROINTERRUTTORE"), "Lavaoggetti microinterruttore capotta");

// 13. Armadio Frigo Deperibili Pizza
const frigoPiz = pizCatalogExact.machines.find((m) => m.machineKey === "armadio_frigo_deperibili_pizza")!;
assert.ok(frigoPiz.suggestedManufacturer.includes("Friulinox") || frigoPiz.suggestedManufacturer.includes("Polaris"), "Produttore frigo");
assert.ok(frigoPiz.safetyChecks.some((c) => c.normReference.includes("UNI EN 378")), "Frigo deperibili circuito UNI EN 378");
assert.ok(frigoPiz.safetyChecks.some((c) => c.code === "FRIGO_PIZZA_TERMOREGOLATORE_ALLARME_HACCP"), "Frigo termoregolatore HACCP");

// 14. Fabbricatore Ghiaccio Pizzeria
const ghiaccioPiz = pizCatalogExact.machines.find((m) => m.machineKey === "fabbricatore_ghiaccio_pizzeria")!;
assert.ok(ghiaccioPiz.suggestedManufacturer.includes("Brema") || ghiaccioPiz.suggestedManufacturer.includes("Icematic"), "Produttore ghiaccio");
assert.ok(ghiaccioPiz.safetyChecks.some((c) => c.normReference.includes("Reg. CE 1935/2004")), "Fabbricatore ghiaccio materiali MOCA");
assert.ok(ghiaccioPiz.safetyChecks.some((c) => c.normReference.includes("UNI EN 1717")), "Fabbricatore ghiaccio scarico anti-reflusso UNI EN 1717");

// 15. Macchina Caffè Pizzeria
const caffePiz = pizCatalogExact.machines.find((m) => m.machineKey === "macchina_caffe_pizzeria")!;
assert.ok(caffePiz.suggestedManufacturer.includes("Faema") || caffePiz.suggestedManufacturer.includes("La Marzocco"), "Produttore caffè");
assert.ok(caffePiz.safetyChecks.some((c) => c.normReference.includes("D.Lgs. 26/2016")), "Macchina caffè valvola PED D.Lgs. 26/2016");
assert.ok(caffePiz.safetyChecks.some((c) => c.code === "CAFFE_PIZZA_LANCIA_VAPORE_COOL_TOUCH"), "Macchina caffè lancia Cool-Touch");

// 16. Bidone Metallico Ceneri
const bidoneCeneri = pizCatalogExact.machines.find((m) => m.machineKey === "bidone_metallico_ceneri")!;
assert.ok(bidoneCeneri.suggestedManufacturer.includes("Inox Meccanica") || bidoneCeneri.suggestedManufacturer.includes("MetalBox") || bidoneCeneri.suggestedManufacturer.includes("Bonezzi"), "Produttore bidone metallico ceneri");
assert.ok(bidoneCeneri.safetyChecks.some((c) => c.normReference.includes("D.Lgs. 81/2008 All. IV p. 4")), "Bidone ceneri deve citare D.Lgs. 81/08 All. IV p. 4");
assert.ok(bidoneCeneri.safetyChecks.some((c) => c.code === "CENERI_STRUTTURA_METALLICA_INCOMBUSTIBILE"), "Bidone struttura metallica incombustibile");
assert.ok(bidoneCeneri.safetyChecks.some((c) => c.code === "CENERI_COPERCHIO_TENUTA_ERMETICA"), "Bidone coperchio tenuta ermetica");

// -------------------------------------------------------------
// Test 17: Associazione 1-a-1 ambienti Step 2 Pizzeria (env-piz-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 17: Verifica associazione ambienti Step 2 Pizzeria (env-piz-*) -> Step 4 Macchine");
const pizEnvironments = [
  { id: "env-piz-laboratorio", name: "Laboratorio Pizzeria e Cottura", category: "production" },
  { id: "env-piz-impasto", name: "Zona Impasto e Lievitazione", category: "production" },
  { id: "env-piz-prep-ingredienti", name: "Preparazione Farciture e Friggitrice", category: "production" },
  { id: "env-piz-lavaggio", name: "Lavaggio Teglie e Stoviglie (Plonge)", category: "production" },
  { id: "env-piz-celle", name: "Celle e Armadi Frigoriferi Deperibili", category: "warehouse" },
  { id: "env-piz-sala-asporto", name: "Sala Somministrazione e Banco Asporto/Delivery", category: "public" },
  { id: "env-piz-rifiuti", name: "Area Rifiuti e Stoccaggio Ceneri", category: "waste" },
];

const suggestedWithPizEnvs = getSuggestedMachinesForEnvironmentsAndAteco(pizEnvironments, "56.10.20");
assert.equal(suggestedWithPizEnvs.length, 16, "Tutte le 16 macchine devono essere raccomandate e collegate agli ambienti della pizzeria");

// Verifica 1-a-1 per ciascun ambiente:
const labMachines = suggestedWithPizEnvs.filter((m) => m.targetEnvironmentId === "env-piz-laboratorio");
assert.equal(labMachines.length, 4, "env-piz-laboratorio deve contenere 4 macchine di cottura e stesura");
assert.ok(labMachines.some((m) => m.machineKey === "forno_pizze_professionale"));
assert.ok(labMachines.some((m) => m.machineKey === "banco_pizza_refrigerato"));
assert.ok(labMachines.some((m) => m.machineKey === "stendi_pizza_dilaminatrice"));
assert.ok(labMachines.some((m) => m.machineKey === "cappa_aspirazione_forno_pizze"));

// Verifica anche supporto dedicato per env-piz-forno-legna
const fornoLegnaEnvTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-piz-forno-legna", name: "Area Forno a Legna", category: "production" }],
  "56.10.20",
);
const fornoLegnaLinked = fornoLegnaEnvTest.filter((m) => m.targetEnvironmentId === "env-piz-forno-legna");
assert.equal(fornoLegnaLinked.length, 4, "env-piz-forno-legna deve associare le 4 macchine di cottura e stesura");
assert.ok(fornoLegnaLinked.some((m) => m.machineKey === "forno_pizze_professionale"));
assert.ok(fornoLegnaLinked.some((m) => m.machineKey === "banco_pizza_refrigerato"));
assert.ok(fornoLegnaLinked.some((m) => m.machineKey === "stendi_pizza_dilaminatrice"));
assert.ok(fornoLegnaLinked.some((m) => m.machineKey === "cappa_aspirazione_forno_pizze"));

const impastoMachines = suggestedWithPizEnvs.filter((m) => m.targetEnvironmentId === "env-piz-impasto");
assert.equal(impastoMachines.length, 3, "env-piz-impasto deve contenere 3 macchine di impasto");
assert.ok(impastoMachines.some((m) => m.machineKey === "impastatrice_spirale_pizzeria"));
assert.ok(impastoMachines.some((m) => m.machineKey === "spezzatrice_arrotondatrice_pizze"));
assert.ok(impastoMachines.some((m) => m.machineKey === "armadio_ferma_lievitazione"));

const prepPizMachines = suggestedWithPizEnvs.filter((m) => m.targetEnvironmentId === "env-piz-prep-ingredienti");
assert.equal(prepPizMachines.length, 4, "env-piz-prep-ingredienti deve contenere 4 macchine di preparazione condimenti");
assert.ok(prepPizMachines.some((m) => m.machineKey === "tagliamozzarella_sfilacciatrice"));
assert.ok(prepPizMachines.some((m) => m.machineKey === "affettatrice_gravita_pizzeria"));
assert.ok(prepPizMachines.some((m) => m.machineKey === "friggitrice_pizzeria"));
assert.ok(prepPizMachines.some((m) => m.machineKey === "cutter_robot_condimenti"));

const lavaggioPizMachines = suggestedWithPizEnvs.filter((m) => m.targetEnvironmentId === "env-piz-lavaggio");
assert.equal(lavaggioPizMachines.length, 1, "env-piz-lavaggio deve contenere 1 lavaoggetti/lavateglie");
assert.ok(lavaggioPizMachines.some((m) => m.machineKey === "lavaoggetti_lavateglie"));

const cellePizMachines = suggestedWithPizEnvs.filter((m) => m.targetEnvironmentId === "env-piz-celle");
assert.equal(cellePizMachines.length, 1, "env-piz-celle deve contenere 1 armadio frigo deperibili");
assert.ok(cellePizMachines.some((m) => m.machineKey === "armadio_frigo_deperibili_pizza"));

const salaPizMachines = suggestedWithPizEnvs.filter((m) => m.targetEnvironmentId === "env-piz-sala-asporto");
assert.equal(salaPizMachines.length, 2, "env-piz-sala-asporto deve contenere 2 attrezzature bar/sala");
assert.ok(salaPizMachines.some((m) => m.machineKey === "fabbricatore_ghiaccio_pizzeria"));
assert.ok(salaPizMachines.some((m) => m.machineKey === "macchina_caffe_pizzeria"));

const rifiutiPizMachines = suggestedWithPizEnvs.filter((m) => m.targetEnvironmentId === "env-piz-rifiuti");
assert.equal(rifiutiPizMachines.length, 1, "env-piz-rifiuti deve contenere 1 bidone metallico ceneri");
assert.ok(rifiutiPizMachines.some((m) => m.machineKey === "bidone_metallico_ceneri"));

// -------------------------------------------------------------
// Test 18: Risoluzione solo su codice ATECO senza locali censiti (Pizzeria)
// -------------------------------------------------------------
console.log("Test 18: Integrazione automatica macchine per ATECO 56.10.20 senza ambienti preventivi");
const suggestedPizOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "56.10.20");
assert.equal(suggestedPizOnlyAteco.length, 16, "Devono essere suggerite tutte le 16 macchine della pizzeria");
assert.ok(
  suggestedPizOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per varianti di codice ATECO ("56.10.2", "561020", "56102")
for (const code of ["56.10.2", "561020", "56102"]) {
  const fallbackRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackRes.length, 16, `ATECO variant '${code}' deve restituire tutte le 16 macchine`);
  assert.ok(fallbackRes.every((m) => m.sourceReason === "ateco"));
}

// =============================================================
// TEST ATECO 56.29.10 / 56.29.20 / 56.29 (Mense e Ristorazione Collettiva / Centri Cottura)
// =============================================================
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 56.29.10 Mense e Ristorazione Collettiva) ===");

// -------------------------------------------------------------
// Test 19: Priorità e risoluzione catalogo ATECO Mense e Ristorazione Collettiva
// -------------------------------------------------------------
console.log("Test 19: Verifica priorità catalogo ATECO per Mense e Ristorazione Collettiva (56.29.10 / 56.29.1 / 56.29.20 / 56.29)");
const catalogMenseExact = getSectorMachineCatalogForAteco("56.29.10");
assert.equal(catalogMenseExact.sectorKey, "mense_catering_collettiva", "ATECO 56.29.10 deve restituire mense_catering_collettiva");
assert.ok(catalogMenseExact.sectorLabel.includes("Mense"), "L'etichetta deve includere Mense");

for (const code of ["56.29.1", "56.29.20", "56.29", "562910", "5629"]) {
  const catVariant = getSectorMachineCatalogForAteco(code);
  assert.equal(catVariant.sectorKey, "mense_catering_collettiva", `ATECO '${code}' deve risolvere su mense_catering_collettiva`);
}

// Verifica posizionamento: mense_catering_collettiva viene dopo pizzeria_asporto e prima di ristorazione_alimentare
const pizSectorIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "pizzeria_asporto");
const menseSectorIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "mense_catering_collettiva");
const restSectorIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");
assert.ok(menseSectorIndex !== -1, "Settore mense_catering_collettiva deve esistere nel catalogo");
assert.equal(menseSectorIndex, pizSectorIndex + 1, "mense_catering_collettiva deve seguire immediatamente pizzeria_asporto");
assert.ok(restSectorIndex > menseSectorIndex, "mense_catering_collettiva deve precedere il settore generico ristorazione_alimentare");

// -------------------------------------------------------------
// Test 20: Verifica completezza delle 18 attrezzature professionali per mense/collettività
// -------------------------------------------------------------
console.log("Test 20: Verifica completezza delle 18 attrezzature professionali per mense con modelli reali e controlli tecnici");
assert.equal(catalogMenseExact.machines.length, 18, "Il catalogo Mense e Ristorazione Collettiva deve contenere esattamente 18 macchine");

const expectedMensaKeys = [
  // Grandi Cotture & Blocco Caldo Industriale (6)
  "forno_industriale_carrello",
  "brasiera_ribaltabile_industriale",
  "pentola_cottura_indiretta",
  "abbattitore_roll_in",
  "cuocipasta_ribaltabile_industriale",
  "cappa_compensata_collettivita",
  // Mondatura Ortofrutta (1)
  "pelapatate_lavaverdure_industriale",
  // Preparazione Fredda & Lavorazione Carni/Verdure (2)
  "tagliaverdure_cutter_industriale",
  "affettatrice_industriale_continua",
  // Confezionamento & Logistica Pasti Veicolati (3)
  "termosigillatrice_automatica_vaschette",
  "contenitori_isotermici_trasporto",
  "transpallet_inox_alimentare",
  // Distribuzione Pasti & Sala (2)
  "linea_distribuzione_selfservice",
  "carrelli_termici_porta_gn",
  // Centrale Lavaggio Meccanizzato (2)
  "lavastoviglie_tunnel_traino",
  "lavaoggetti_ghigliottina_collettivita",
  // Freddo, Campioni & Stoccaggio (2)
  "armadio_congelatore_campioni",
  "celle_frigorifere_walkin",
];

for (const key of expectedMensaKeys) {
  const found = catalogMenseExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Attrezzatura con key '${key}' deve essere presente nel catalogo`);
  assert.ok(found.name.length > 5, `Nome attrezzatura '${key}' deve essere descrittivo`);
  assert.ok(found.suggestedManufacturer.length > 2, `Produttore suggerito presente per '${key}'`);
  assert.ok(found.suggestedModel.length > 1, `Modello suggerito presente per '${key}'`);
  assert.ok(found.safetyChecks.length >= 4, `L'attrezzatura '${key}' deve avere almeno 4 controlli di sicurezza specifici`);
}

// Controlli specifici per attrezzature critiche di ristorazione collettiva:
const fornoCarrello = catalogMenseExact.machines.find((m) => m.machineKey === "forno_industriale_carrello")!;
assert.ok(fornoCarrello.suggestedManufacturer.includes("Rational"), "Forno a carrello deve citare Rational");
assert.ok(fornoCarrello.suggestedModel.includes("iCombi Pro"), "Forno a carrello modello iCombi Pro");
assert.ok(fornoCarrello.safetyChecks.some((c) => c.code === "FORNO_CARRELLO_PORTA_TRIPLO_VETRO_VENTILATO" && c.normReference.includes("UNI EN 203-1")), "Porta triplo vetro ventilato UNI EN 203-1");
assert.ok(fornoCarrello.safetyChecks.some((c) => c.code === "FORNO_CARRELLO_ARRESTO_VENTOLE_VAPORE"), "Arresto ventole e vapore all'apertura");
assert.ok(fornoCarrello.safetyChecks.some((c) => c.code === "FORNO_CARRELLO_SONDA_CUORE_6_PUNTI"), "Sonda al cuore a 6 punti HACCP");

const brasiera = catalogMenseExact.machines.find((m) => m.machineKey === "brasiera_ribaltabile_industriale")!;
assert.ok(brasiera.suggestedManufacturer.includes("Angelo Po") || brasiera.suggestedManufacturer.includes("Firex"), "Brasiera Angelo Po / Firex");
assert.ok(brasiera.safetyChecks.some((c) => c.code === "BRASIERA_RIBALTAMENTO_MOTORIZZATO_UNI13885" && c.normReference.includes("UNI EN 13885")), "Ribaltamento motorizzato progressivo UNI EN 13885");
assert.ok(brasiera.safetyChecks.some((c) => c.code === "BRASIERA_ARRESTO_RISCALDAMENTO_INCLINATA"), "Arresto riscaldamento a vasca inclinata");

const pentolaIndiretta = catalogMenseExact.machines.find((m) => m.machineKey === "pentola_cottura_indiretta")!;
assert.ok(pentolaIndiretta.safetyChecks.some((c) => c.code === "PENTOLA_INTERCAPEDINE_PED_VALVOLA_MANOMETRO" && (c.normReference.includes("PED") || c.normReference.includes("26/2016"))), "Intercapedine certificata PED D.Lgs. 26/2016 con valvola di sicurezza");
assert.ok(pentolaIndiretta.safetyChecks.some((c) => c.code === "PENTOLA_RUBINETTO_FARFALLA_BLOCCO_MECCANICO"), "Rubinetto a farfalla da 2 pollici con blocco meccanico");

const abbattitoreMensa = catalogMenseExact.machines.find((m) => m.machineKey === "abbattitore_roll_in")!;
assert.ok(abbattitoreMensa.suggestedManufacturer.includes("Irinox"), "Abbattitore Irinox");
assert.ok(abbattitoreMensa.safetyChecks.some((c) => c.code === "ABBATTITORE_CICLO_COOK_CHILL_REG852" && c.normReference.includes("852/2004")), "Ciclo Cook & Chill +90/+3 e -18 Reg. CE 852/04");
assert.ok(abbattitoreMensa.safetyChecks.some((c) => c.code === "ABBATTITORE_RAMPA_CARRELLO_A_FILO"), "Rampa accesso carrelli a filo pavimento");

const cuocipastaMensa = catalogMenseExact.machines.find((m) => m.machineKey === "cuocipasta_ribaltabile_industriale")!;
assert.ok(cuocipastaMensa.safetyChecks.some((c) => c.code === "CUOCIPASTA_SOLLEVAMENTO_AUTOMATICO_CESTELLI" && c.normReference.includes("Titolo VI")), "Sollevamento automatico cestelli prevenzione MMC Titolo VI");
assert.ok(cuocipastaMensa.safetyChecks.some((c) => c.code === "CUOCIPASTA_RIEMPIMENTO_DISCONNESSIONE_UNI1717" && c.normReference.includes("UNI EN 1717")), "Riempimento acqua con interruzione d'aria UNI EN 1717");

const cappaAnsul = catalogMenseExact.machines.find((m) => m.machineKey === "cappa_compensata_collettivita")!;
assert.ok(cappaAnsul.safetyChecks.some((c) => c.code === "CAPPA_COLLETTIVITA_ESTINZIONE_ANSUL_R102" && (c.normReference.includes("NFPA 96") || c.normReference.includes("UNI ISO 15371"))), "Impianto Ansul R-102 conforme NFPA 96 / UNI ISO 15371");

const pelapatate = catalogMenseExact.machines.find((m) => m.machineKey === "pelapatate_lavaverdure_industriale")!;
assert.ok(pelapatate.safetyChecks.some((c) => c.code === "PELAPATATE_MICROINTERRUTTORE_UNI13208" && c.normReference.includes("UNI EN 13208")), "Microinterruttore su coperchio e bocca scarico UNI EN 13208");

const cutterMensa = catalogMenseExact.machines.find((m) => m.machineKey === "tagliaverdure_cutter_industriale")!;
assert.ok(cutterMensa.safetyChecks.some((c) => c.code === "CUTTER_ARRESTO_MOTORE_RAPIDO_UNI12852" && c.normReference.includes("UNI EN 12852")), "Arresto motore immediato < 2s UNI EN 12852");

const affettatriceMensa = catalogMenseExact.machines.find((m) => m.machineKey === "affettatrice_industriale_continua")!;
assert.ok(affettatriceMensa.safetyChecks.some((c) => c.code === "AFFETTATRICE_CONTINUA_RIPARI_INTERBLOCCATI_UNI1974" && c.normReference.includes("UNI EN 1974")), "Ripari integrali fissi e interbloccati UNI EN 1974");
assert.ok(affettatriceMensa.safetyChecks.some((c) => c.code === "AFFETTATRICE_CONTINUA_BLOCCO_SPESSORE_ZERO"), "Blocco a spessore zero della vela");

const termosigillatriceMensa = catalogMenseExact.machines.find((m) => m.machineKey === "termosigillatrice_automatica_vaschette")!;
assert.ok(termosigillatriceMensa.safetyChecks.some((c) => c.code === "TERMOSIGILLATRICE_CARTER_INTERBLOCCATI_SCHIACCIAMENTO"), "Carter perimetrali interbloccati anti-schiacciamento");
assert.ok(termosigillatriceMensa.safetyChecks.some((c) => c.code === "TERMOSIGILLATRICE_EVACUAZIONE_ARIA_GAS_INERTE"), "Evacuazione aria e iniezione gas inerte alimentare ATM");

const contenitoriMensa = catalogMenseExact.machines.find((m) => m.machineKey === "contenitori_isotermici_trasporto")!;
assert.ok(contenitoriMensa.safetyChecks.some((c) => c.code === "CONTENITORI_ISOTERMICI_CONFORMITA_ATP_TEMP" && c.normReference.includes("ATP")), "Conformità ATP legame caldo >= 65°C e legame freddo <= 4°C");
assert.ok(contenitoriMensa.safetyChecks.some((c) => c.code === "CONTENITORI_ISOTERMICI_GUARNIZIONI_SILICONICHE_MOCA" && c.normReference.includes("1935/2004")), "Guarnizioni siliconiche sanificabili MOCA Reg. CE 1935/2004");

const transpalletInox = catalogMenseExact.machines.find((m) => m.machineKey === "transpallet_inox_alimentare")!;
assert.ok(transpalletInox.suggestedManufacturer.includes("Pramac"), "Transpallet inox Pramac");
assert.ok(transpalletInox.safetyChecks.some((c) => c.code === "TRANSPALLET_INOX_POMPA_STAGNA_LAVAGGI"), "Pompa idraulica stagna resistente a lavaggi ad alta pressione");

const lineaSelf = catalogMenseExact.machines.find((m) => m.machineKey === "linea_distribuzione_selfservice")!;
assert.ok(lineaSelf.safetyChecks.some((c) => c.code === "LINEA_SELFSERVICE_BAGNOMARIA_CALDO_65C"), "Bagnomaria caldo mantenimento >= 65°C");
assert.ok(lineaSelf.safetyChecks.some((c) => c.code === "LINEA_SELFSERVICE_CRISTALLI_PARAFIATO_CURVI"), "Cristalli parafiato curvi igienici");

const carrelliTermici = catalogMenseExact.machines.find((m) => m.machineKey === "carrelli_termici_porta_gn")!;
assert.ok(carrelliTermici.safetyChecks.some((c) => c.code === "CARRELLO_TERMICO_MANTENIMENTO_TEMPERATURA_65C"), "Mantenimento legame caldo >= 65°C");
assert.ok(carrelliTermici.safetyChecks.some((c) => c.code === "CARRELLO_TERMICO_RUOTE_PIROETTANTI_FRENO"), "Ruote piroettanti con freno");

const lavastoviglieTunnel = catalogMenseExact.machines.find((m) => m.machineKey === "lavastoviglie_tunnel_traino")!;
assert.ok(lavastoviglieTunnel.safetyChecks.some((c) => c.code === "LAVASTOVIGLIE_TUNNEL_ARRESTO_EMERGENZA_FUNE_UNI50416" && c.normReference.includes("UNI EN 50416")), "Arresto emergenza a fune o fungo UNI EN 50416");
assert.ok(lavastoviglieTunnel.safetyChecks.some((c) => c.code === "LAVASTOVIGLIE_TUNNEL_RISCIACQUO_82C_DIN10510" && c.normReference.includes("DIN 10510")), "Risciacquo igienico >= 82°C DIN 10510");

const potWasher = catalogMenseExact.machines.find((m) => m.machineKey === "lavaoggetti_ghigliottina_collettivita")!;
assert.ok(potWasher.safetyChecks.some((c) => c.code === "LAVAOGGETTI_GHIGLIOTTINA_CONTROBILANCIATA_MICRO"), "Porta controbilanciata a ghigliottina con microinterruttore");
assert.ok(potWasher.safetyChecks.some((c) => c.code === "LAVAOGGETTI_DISPOSITIVO_ANTIRIFLUSSO_UNI1717" && c.normReference.includes("UNI EN 1717")), "Dispositivo antiriflusso UNI EN 1717");

const congelatoreCampioni = catalogMenseExact.machines.find((m) => m.machineKey === "armadio_congelatore_campioni")!;
assert.ok(congelatoreCampioni.safetyChecks.some((c) => c.code === "CONGELATORE_CAMPIONI_SERRATURA_CHIAVE_NAS"), "Serratura a chiave per custodia campioni testimoniali 72 ore ASL/NAS");
assert.ok(congelatoreCampioni.safetyChecks.some((c) => c.code === "CONGELATORE_CAMPIONI_TEMPERATURA_COSTANTE_18"), "Temperatura costante <= -18°C per 72 ore");

const celleWalkin = catalogMenseExact.machines.find((m) => m.machineKey === "celle_frigorifere_walkin")!;
assert.ok(celleWalkin.safetyChecks.some((c) => c.code === "CELLE_WALKIN_ALLARME_UOMO_INTRAPPOLATO_UNI378" && c.normReference.includes("UNI EN 378")), "Allarme uomo intrappolato a 24V UNI EN 378");
assert.ok(celleWalkin.safetyChecks.some((c) => c.code === "CELLE_WALKIN_APERTURA_INTERNA_LUMINESCENTE"), "Apertura interna luminescente di sicurezza");
assert.ok(celleWalkin.safetyChecks.some((c) => c.code === "CELLE_WALKIN_PAVIMENTO_FILO_RAMPA_CARRELLI"), "Pavimentazione calpestabile a filo pavimento con rampa carrelli");

// -------------------------------------------------------------
// Test 21: Associazione 1-a-1 ambienti Step 2 Mensa (env-mensa-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 21: Verifica associazione ambienti Step 2 Mensa (env-mensa-*) -> Step 4 Macchine");
const mensaEnvironments = [
  { id: "env-mensa-cottura", name: "Cucina e Cottura Industriale (Blocco Caldo)", category: "production" },
  { id: "env-mensa-mondatura", name: "Locale Mondatura Ortofrutta e Legumi", category: "production" },
  { id: "env-mensa-prep-fredda", name: "Preparazione Fredda, Carni e Gastronomia", category: "production" },
  { id: "env-mensa-confezionamento", name: "Area Confezionamento e Logistica Pasti Veicolati", category: "production" },
  { id: "env-mensa-sala-selfservice", name: "Sala Ristorazione e Linea Distribuzione Self-Service", category: "public" },
  { id: "env-mensa-tunnel-stoviglie", name: "Centrale Lavaggio Meccanizzato Stoviglie", category: "production" },
  { id: "env-mensa-lavaggio-pentole", name: "Area Lavaggio Pentole e Contenitori Cottura", category: "production" },
  { id: "env-mensa-celle-frigo", name: "Celle Frigorifere e Conservazione Materie Prime", category: "warehouse" },
];

const suggestedWithMensaEnvs = getSuggestedMachinesForEnvironmentsAndAteco(mensaEnvironments, "56.29.10");
assert.equal(suggestedWithMensaEnvs.length, 18, "Tutte le 18 macchine devono essere raccomandate e collegate agli 8 ambienti censiti");

// Verifica 1-a-1 per ciascun ambiente:
const cotturaMachines = suggestedWithMensaEnvs.filter((m) => m.targetEnvironmentId === "env-mensa-cottura");
assert.equal(cotturaMachines.length, 6, "env-mensa-cottura deve associare 6 macchine del blocco caldo");
assert.ok(cotturaMachines.some((m) => m.machineKey === "forno_industriale_carrello"));
assert.ok(cotturaMachines.some((m) => m.machineKey === "brasiera_ribaltabile_industriale"));
assert.ok(cotturaMachines.some((m) => m.machineKey === "pentola_cottura_indiretta"));
assert.ok(cotturaMachines.some((m) => m.machineKey === "abbattitore_roll_in"));
assert.ok(cotturaMachines.some((m) => m.machineKey === "cuocipasta_ribaltabile_industriale"));
assert.ok(cotturaMachines.some((m) => m.machineKey === "cappa_compensata_collettivita"));

const mondaturaMachines = suggestedWithMensaEnvs.filter((m) => m.targetEnvironmentId === "env-mensa-mondatura");
assert.equal(mondaturaMachines.length, 1, "env-mensa-mondatura deve associare 1 macchina pelapatate/lavaverdure");
assert.ok(mondaturaMachines.some((m) => m.machineKey === "pelapatate_lavaverdure_industriale"));

const prepFreddaMensaMachines = suggestedWithMensaEnvs.filter((m) => m.targetEnvironmentId === "env-mensa-prep-fredda");
assert.equal(prepFreddaMensaMachines.length, 2, "env-mensa-prep-fredda deve associare cutter e affettatrice");
assert.ok(prepFreddaMensaMachines.some((m) => m.machineKey === "tagliaverdure_cutter_industriale"));
assert.ok(prepFreddaMensaMachines.some((m) => m.machineKey === "affettatrice_industriale_continua"));

// Verifica anche supporto dedicato per env-mensa-diete-speciali
const dieteEnvTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-mensa-diete-speciali", name: "Laboratorio Diete Speciali e Celiachia", category: "production" }],
  "56.29.10",
);
const dieteLinked = dieteEnvTest.filter((m) => m.targetEnvironmentId === "env-mensa-diete-speciali");
assert.equal(dieteLinked.length, 2, "env-mensa-diete-speciali deve associare cutter e affettatrice");
assert.ok(dieteLinked.some((m) => m.machineKey === "tagliaverdure_cutter_industriale"));
assert.ok(dieteLinked.some((m) => m.machineKey === "affettatrice_industriale_continua"));

const confezMachines = suggestedWithMensaEnvs.filter((m) => m.targetEnvironmentId === "env-mensa-confezionamento");
assert.equal(confezMachines.length, 3, "env-mensa-confezionamento deve associare termosigillatrice, contenitori e transpallet");
assert.ok(confezMachines.some((m) => m.machineKey === "termosigillatrice_automatica_vaschette"));
assert.ok(confezMachines.some((m) => m.machineKey === "contenitori_isotermici_trasporto"));
assert.ok(confezMachines.some((m) => m.machineKey === "transpallet_inox_alimentare"));

const salaSelfMachines = suggestedWithMensaEnvs.filter((m) => m.targetEnvironmentId === "env-mensa-sala-selfservice");
assert.equal(salaSelfMachines.length, 2, "env-mensa-sala-selfservice deve associare linea self-service e carrelli termici");
assert.ok(salaSelfMachines.some((m) => m.machineKey === "linea_distribuzione_selfservice"));
assert.ok(salaSelfMachines.some((m) => m.machineKey === "carrelli_termici_porta_gn"));

const tunnelMachines = suggestedWithMensaEnvs.filter((m) => m.targetEnvironmentId === "env-mensa-tunnel-stoviglie");
assert.equal(tunnelMachines.length, 1, "env-mensa-tunnel-stoviglie deve associare lavastoviglie a tunnel");
assert.ok(tunnelMachines.some((m) => m.machineKey === "lavastoviglie_tunnel_traino"));

const pentoleMachines = suggestedWithMensaEnvs.filter((m) => m.targetEnvironmentId === "env-mensa-lavaggio-pentole");
assert.equal(pentoleMachines.length, 1, "env-mensa-lavaggio-pentole deve associare lavaoggetti ghigliottina");
assert.ok(pentoleMachines.some((m) => m.machineKey === "lavaoggetti_ghigliottina_collettivita"));

const celleMensaMachines = suggestedWithMensaEnvs.filter((m) => m.targetEnvironmentId === "env-mensa-celle-frigo");
assert.equal(celleMensaMachines.length, 2, "env-mensa-celle-frigo deve associare congelatore campioni e celle walk-in");
assert.ok(celleMensaMachines.some((m) => m.machineKey === "armadio_congelatore_campioni"));
assert.ok(celleMensaMachines.some((m) => m.machineKey === "celle_frigorifere_walkin"));

// Verifica anche supporto per env-mensa-dispensa
const dispensaMensaEnvTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-mensa-dispensa", name: "Dispensa Secca e Deposito Alimentari", category: "warehouse" }],
  "56.29.10",
);
const dispensaMensaLinked = dispensaMensaEnvTest.filter((m) => m.targetEnvironmentId === "env-mensa-dispensa");
assert.equal(dispensaMensaLinked.length, 2, "env-mensa-dispensa deve associare congelatore campioni e celle walk-in");
assert.ok(dispensaMensaLinked.some((m) => m.machineKey === "armadio_congelatore_campioni"));
assert.ok(dispensaMensaLinked.some((m) => m.machineKey === "celle_frigorifere_walkin"));

// -------------------------------------------------------------
// Test 22: Risoluzione solo su codice ATECO senza locali censiti (Mense)
// -------------------------------------------------------------
console.log("Test 22: Integrazione automatica macchine per ATECO 56.29.10 senza ambienti preventivi");
const suggestedMensaOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "56.29.10");
assert.equal(suggestedMensaOnlyAteco.length, 18, "Devono essere suggerite tutte le 18 macchine della mensa");
assert.ok(
  suggestedMensaOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per varianti di codice ATECO ("56.29.1", "56.29.20", "56.29", "562910", "5629")
for (const code of ["56.29.1", "56.29.20", "56.29", "562910", "5629"]) {
  const fallbackRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackRes.length, 18, `ATECO variant '${code}' deve restituire tutte le 18 macchine`);
  assert.ok(fallbackRes.every((m) => m.sourceReason === "ateco"));
}

// ============================================================================
// TEST ATECO 56.21.00 — CATERING PER EVENTI, BANQUETING E RICEVIMENTI
// ============================================================================
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 56.21.00 Catering Eventi / Banqueting) ===");

// -------------------------------------------------------------
// Test 23: Priorità e risoluzione catalogo ATECO 56.21.00
// -------------------------------------------------------------
console.log("Test 23: Verifica priorità catalogo ATECO per Catering Eventi e Banqueting (56.21.00 / 56.21.0 / 56.21)");
const catalogCatExact = getSectorMachineCatalogForAteco("56.21.00");
assert.equal(catalogCatExact.sectorKey, "catering_eventi_banqueting", "ATECO 56.21.00 deve restituire catering_eventi_banqueting");
assert.ok(catalogCatExact.sectorLabel.includes("Catering"), "L'etichetta del catalogo deve includere Catering");
assert.ok(catalogCatExact.sectorLabel.includes("Banqueting"), "L'etichetta del catalogo deve includere Banqueting");

for (const variant of ["56.21.0", "56.21", "562100", "5621"]) {
  const catVar = getSectorMachineCatalogForAteco(variant);
  assert.equal(catVar.sectorKey, "catering_eventi_banqueting", `Variante '${variant}' deve restituire catering_eventi_banqueting`);
}

// Verifica posizionamento: catering_eventi_banqueting segue immediatamente mense_catering_collettiva e precede ristorazione_alimentare
const menseIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "mense_catering_collettiva");
const catIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "catering_eventi_banqueting");
const ristGenIdxCat = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");
assert.ok(menseIdx !== -1, "Settore mense_catering_collettiva deve esistere");
assert.ok(catIdx !== -1, "Settore catering_eventi_banqueting deve esistere");
assert.ok(ristGenIdxCat !== -1, "Settore generico ristorazione_alimentare deve esistere");
assert.equal(catIdx, menseIdx + 1, "catering_eventi_banqueting deve seguire immediatamente mense_catering_collettiva");
assert.ok(catIdx < ristGenIdxCat, "catering_eventi_banqueting deve precedere ristorazione_alimentare nel catalogo");

// -------------------------------------------------------------
// Test 24: Verifica completezza delle 18 macchine per Catering / Banqueting
// -------------------------------------------------------------
console.log("Test 24: Verifica completezza delle 18 attrezzature professionali con modelli reali e controlli tecnici");
assert.equal(catalogCatExact.machines.length, 18, "Il catalogo Catering Eventi / Banqueting deve contenere esattamente 18 macchine");

const expectedCatMachineKeys = [
  // Reparto 1: Cucina Centrale & Produzione Base (4)
  "forno_combinato_catering",
  "abbattitore_temperatura_catering",
  "brasiera_ribaltabile_catering",
  "confezionatrice_sottovuoto_catering",
  // Reparto 2: Preparazione Finger Food & Lavorazione (2)
  "affettatrice_gravita_catering",
  "cutter_robot_catering",
  // Reparto 3: Attrezzature Mobili da Trasferta & Banqueting (5)
  "forno_rigeneratore_mobile",
  "chafing_dish_scaldavivande",
  "friggitrice_mobile_catering",
  "fabbricatore_ghiaccio_catering",
  "banco_bar_mobile_luminoso",
  // Reparto 4: Logistica, Spedizioni & Banchina (3)
  "contenitori_isotermici_catering",
  "rampa_carico_alluminio",
  "roll_container_isotermico",
  // Reparto 5: Centrale Lavaggio Rientro Eventi (2)
  "lavastoviglie_capotta_catering",
  "lavaoggetti_teglie_catering",
  // Reparto 6: Impianti da Campo & Sicurezza Mobile (2)
  "quadro_elettrico_mobile",
  "bombole_gpl_cucina_campo",
];

for (const key of expectedCatMachineKeys) {
  const found = catalogCatExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Macchina ${key} deve essere presente nel catalogo Catering Eventi`);
  assert.ok(found.name.length > 5, `Nome macchina ${key} deve essere esaustivo`);
  assert.ok(found.type.length > 5, `Tipologia macchina ${key} deve essere specificata`);
  assert.ok(found.suggestedManufacturer.length > 0, `Produttore suggerito per ${key} deve essere presente`);
  assert.ok(found.suggestedModel.length > 0, `Modello suggerito per ${key} deve essere presente`);
  assert.ok(found.safetyChecks.length >= 3, `Macchina ${key} deve avere almeno 3 controlli di sicurezza`);
  assert.ok(found.training, `Macchina ${key} deve avere un corso di formazione/addestramento associato`);
}

// Verifiche puntuali su modelli e controlli normativi specifici:
const fornoCat = catalogCatExact.machines.find((m) => m.machineKey === "forno_combinato_catering")!;
assert.ok(fornoCat.suggestedManufacturer.includes("Rational") || fornoCat.suggestedManufacturer.includes("Unox"), "Forno Rational o Unox");
assert.ok(fornoCat.safetyChecks.some((c) => c.code === "FORNO_CATERING_PORTA_TRIPLO_VETRO_VENTILATO" && c.normReference.includes("UNI EN 203-1")), "Porta triplo vetro ventilato anti-ustione UNI EN 203-1");
assert.ok(fornoCat.safetyChecks.some((c) => c.code === "FORNO_CATERING_SONDA_CUORE_6_PUNTI_CCP" && c.normReference.includes("852/2004")), "Sonda al cuore a 6 punti CCP");
assert.ok(fornoCat.safetyChecks.some((c) => c.code === "FORNO_CATERING_CAPPA_CONDENSAZIONE_SCARICO_GRASSI"), "Cappa condensazione canalizzata con scarico grassi");

const abbattitoreCat = catalogCatExact.machines.find((m) => m.machineKey === "abbattitore_temperatura_catering")!;
assert.ok(abbattitoreCat.suggestedManufacturer.includes("Irinox") || abbattitoreCat.suggestedManufacturer.includes("Coldline"), "Abbattitore Irinox o Coldline");
assert.ok(abbattitoreCat.safetyChecks.some((c) => c.code === "ABBATTITORE_CATERING_CICLO_RAPIDO_POSITIVO_NEGATIVO" && c.normReference.includes("852/2004")), "Ciclo rapido positivo e negativo Reg. CE 852/04");
assert.ok(abbattitoreCat.safetyChecks.some((c) => c.code === "ABBATTITORE_CATERING_SONDA_SPILLONE_RISCALDATA"), "Sonda spillone multipunto riscaldata a fine ciclo");
assert.ok(abbattitoreCat.safetyChecks.some((c) => c.code === "ABBATTITORE_CATERING_ALLARME_PORTA_RAMPA_CARRELLO"), "Allarme porta e rampa carrelli");

const brasieraCat = catalogCatExact.machines.find((m) => m.machineKey === "brasiera_ribaltabile_catering")!;
assert.ok(brasieraCat.suggestedManufacturer.includes("Firex") || brasieraCat.suggestedManufacturer.includes("Angelo Po"), "Brasiera Firex o Angelo Po");
assert.ok(brasieraCat.safetyChecks.some((c) => c.code === "BRASIERA_CATERING_RIBALTAMENTO_MOTORIZZATO_UNI13885" && c.normReference.includes("UNI EN 13885")), "Ribaltamento motorizzato progressivo hold-to-run UNI EN 13885");
assert.ok(brasieraCat.safetyChecks.some((c) => c.code === "BRASIERA_CATERING_ARRESTO_RISCALDAMENTO_INCLINATA"), "Arresto riscaldamento a vasca inclinata");
assert.ok(brasieraCat.safetyChecks.some((c) => c.code === "BRASIERA_CATERING_COPERCHIO_CONTROBILANCIATO_SFIATO"), "Coperchio controbilanciato con sfiato");

const sottovuotoCat = catalogCatExact.machines.find((m) => m.machineKey === "confezionatrice_sottovuoto_catering")!;
assert.ok(sottovuotoCat.suggestedManufacturer.includes("Orved") || sottovuotoCat.suggestedManufacturer.includes("Besser"), "Sottovuoto Orved o Besser");
assert.ok(sottovuotoCat.safetyChecks.some((c) => c.code === "SOTTOVUOTO_CATERING_CAMPANA_PLEXIGLASS_PISTONI"), "Coperchio bombato in plexiglass con pistoni anticaduta");
assert.ok(sottovuotoCat.safetyChecks.some((c) => c.code === "SOTTOVUOTO_CATERING_DOPPIA_BARRA_SALDANTE_SOUSVIDE"), "Doppia barra saldante ermetica per conservazione e sous-vide");

const affettatriceCat = catalogCatExact.machines.find((m) => m.machineKey === "affettatrice_gravita_catering")!;
assert.ok(affettatriceCat.suggestedManufacturer.includes("Berkel") || affettatriceCat.suggestedManufacturer.includes("Sirman"), "Affettatrice Berkel o Sirman 370");
assert.ok(affettatriceCat.safetyChecks.some((c) => c.code === "AFFETTATRICE_CATERING_ANELLO_FISSO_PARALAMA_UNI1974" && c.normReference.includes("UNI EN 1974")), "Anello fisso paralama continuo UNI EN 1974");
assert.ok(affettatriceCat.safetyChecks.some((c) => c.code === "AFFETTATRICE_CATERING_BLOCCO_CARRO_SPESSORE_ZERO"), "Blocco carro a spessore zero della vela");

const cutterCat = catalogCatExact.machines.find((m) => m.machineKey === "cutter_robot_catering")!;
assert.ok(cutterCat.suggestedManufacturer.includes("Robot Coupe") || cutterCat.suggestedManufacturer.includes("Dito"), "Robot Coupe o Dito Sama");
assert.ok(cutterCat.safetyChecks.some((c) => c.code === "CUTTER_CATERING_INTERBLOCCO_COPERCHIO_FRENO_LAMA_UNI12852" && c.normReference.includes("UNI EN 12852")), "Arresto lama entro 2 secondi UNI EN 12852");
assert.ok(cutterCat.safetyChecks.some((c) => c.code === "CUTTER_CATERING_PESTELLO_SALVADITA_TRAMOGGIA"), "Pestello salvadita");

const fornoRigen = catalogCatExact.machines.find((m) => m.machineKey === "forno_rigeneratore_mobile")!;
assert.ok(fornoRigen.suggestedManufacturer.includes("Angelo Po") || fornoRigen.suggestedManufacturer.includes("Moduline") || fornoRigen.suggestedManufacturer.includes("Lainox"), "Forno rigeneratore Angelo Po/Moduline/Lainox");
assert.ok(fornoRigen.safetyChecks.some((c) => c.code === "FORNO_RIGENERATORE_RIGENERAZIONE_TEMP_75C"), "Rigenerazione carrelli >= 75°C");
assert.ok(fornoRigen.safetyChecks.some((c) => c.code === "FORNO_RIGENERATORE_RUOTE_PIROETTANTI_FRENO_PEDALE"), "Ruote piroettanti con freno");

const chafingDish = catalogCatExact.machines.find((m) => m.machineKey === "chafing_dish_scaldavivande")!;
assert.ok(chafingDish.suggestedManufacturer.includes("Pinti") || chafingDish.suggestedManufacturer.includes("Sambonet") || chafingDish.suggestedManufacturer.includes("Paderno"), "Pinti / Sambonet / Paderno");
assert.ok(chafingDish.safetyChecks.some((c) => c.code === "CHAFING_DISH_COPERCHIO_ROLLTOP_FRIZIONATO"), "Coperchio roll-top frizionato a scomparsa");
assert.ok(chafingDish.safetyChecks.some((c) => c.code === "CHAFING_DISH_PORTA_FORNELLETTO_GEL_SICURO"), "Porta-fornelletto protetto gel atossico");

const friggitriceCat = catalogCatExact.machines.find((m) => m.machineKey === "friggitrice_mobile_catering")!;
assert.ok(friggitriceCat.suggestedManufacturer.includes("Lotus") || friggitriceCat.suggestedManufacturer.includes("Giorik"), "Lotus o Giorik");
assert.ok(friggitriceCat.safetyChecks.some((c) => c.code === "FRIGGITRICE_CATERING_TERMOSTATO_SICUREZZA_230C"), "Termostato limite < 230°C contro autocombustione olio");
assert.ok(friggitriceCat.safetyChecks.some((c) => c.code === "FRIGGITRICE_CATERING_RUBINETTO_SCARICO_SICURA"), "Valvola scarico olio con sicura");

const fabbricatoreCat = catalogCatExact.machines.find((m) => m.machineKey === "fabbricatore_ghiaccio_catering")!;
assert.ok(fabbricatoreCat.suggestedManufacturer.includes("Brema") || fabbricatoreCat.suggestedManufacturer.includes("Icematic"), "Brema o Icematic");
assert.ok(fabbricatoreCat.safetyChecks.some((c) => c.code === "GHIACCIO_CATERING_SCARICO_INTERRUZIONE_ARIA_UNI1717" && c.normReference.includes("UNI EN 1717")), "Scarico con interruzione d'aria anti-reflusso UNI EN 1717");
assert.ok(fabbricatoreCat.safetyChecks.some((c) => c.code === "GHIACCIO_CATERING_MATERIALI_MOCA_DEPURATORE" && c.normReference.includes("1935/2004")), "Materiali idonei MOCA");

const bancoBar = catalogCatExact.machines.find((m) => m.machineKey === "banco_bar_mobile_luminoso")!;
assert.ok(bancoBar.safetyChecks.some((c) => c.code === "BANCO_BAR_MOBILE_PIANO_INOX_MOCA"), "Piano lavoro inox MOCA");
assert.ok(bancoBar.safetyChecks.some((c) => c.code === "BANCO_BAR_MOBILE_ILLUMINAZIONE_LED_IP65_SELV"), "Illuminazione LED a bassa tensione IP65");

const contenitoriCat = catalogCatExact.machines.find((m) => m.machineKey === "contenitori_isotermici_catering")!;
assert.ok(contenitoriCat.suggestedManufacturer.includes("Melform") || contenitoriCat.suggestedManufacturer.includes("Rieber"), "Melform o Rieber");
assert.ok(contenitoriCat.safetyChecks.some((c) => c.code === "CONTENITORI_ISOTERMICI_OMOLOGAZIONE_ATP_TEMP" && c.normReference.includes("ATP")), "Omologazione ATP legame caldo >= 65°C e freddo <= 4°C");

const rampaCarico = catalogCatExact.machines.find((m) => m.machineKey === "rampa_carico_alluminio")!;
assert.ok(rampaCarico.suggestedManufacturer.includes("Altec") || rampaCarico.suggestedManufacturer.includes("WM System"), "Altec o WM System");
assert.ok(rampaCarico.safetyChecks.some((c) => c.code === "RAMPA_CARICO_BORDI_LATERALI_ANTI_USCITA" && c.normReference.includes("UNI EN 1398")), "Bordi laterali di sicurezza UNI EN 1398");
assert.ok(rampaCarico.safetyChecks.some((c) => c.code === "RAMPA_CARICO_PORTATA_CERTIFICATA_TARGHETTA"), "Portata certificata 500-1000 kg");

const rollIsotermico = catalogCatExact.machines.find((m) => m.machineKey === "roll_container_isotermico")!;
assert.ok(rollIsotermico.suggestedManufacturer.includes("Melform") || rollIsotermico.suggestedManufacturer.includes("Olivo"), "Melform o Olivo");
assert.ok(rollIsotermico.safetyChecks.some((c) => c.code === "ROLL_ISOTERMICO_MANIGLIONI_SPINTA_ERGONOMIA" && c.normReference.includes("Titolo VI")), "Maniglioni di spinta ergonomici Titolo VI MMC");

const lavastoviglieCat = catalogCatExact.machines.find((m) => m.machineKey === "lavastoviglie_capotta_catering")!;
assert.ok(lavastoviglieCat.suggestedManufacturer.includes("Winterhalter") || lavastoviglieCat.suggestedManufacturer.includes("Meiko"), "Winterhalter o Meiko");
assert.ok(lavastoviglieCat.safetyChecks.some((c) => c.code === "LAVASTOVIGLIE_CAPOTTA_RISCIACQUO_82C_DIN10510"), "Risciacquo ad alta temperatura >= 82°C");
assert.ok(lavastoviglieCat.safetyChecks.some((c) => c.code === "LAVASTOVIGLIE_CAPOTTA_ANTIRIFLUSSO_UNI1717" && c.normReference.includes("UNI EN 1717")), "Dispositivo antiriflusso UNI EN 1717");

const lavaoggettiCat = catalogCatExact.machines.find((m) => m.machineKey === "lavaoggetti_teglie_catering")!;
assert.ok(lavaoggettiCat.suggestedManufacturer.includes("Winterhalter") || lavaoggettiCat.suggestedManufacturer.includes("Comenda"), "Winterhalter o Comenda");
assert.ok(lavaoggettiCat.safetyChecks.some((c) => c.code === "LAVAOGGETTI_CATERING_MICRO_PORTA_BLOCCO_POMPA"), "Microinterruttore di blocco pompe all'apertura");

const quadroMobile = catalogCatExact.machines.find((m) => m.machineKey === "quadro_elettrico_mobile")!;
assert.ok(quadroMobile.suggestedManufacturer.includes("Gewiss") || quadroMobile.suggestedManufacturer.includes("Scame") || quadroMobile.suggestedManufacturer.includes("Rosi"), "Gewiss / Scame / Rosi");
assert.ok(quadroMobile.safetyChecks.some((c) => c.code === "QUADRO_MOBILE_INVOLUCRO_ISOLANTE_IP65"), "Involucro stagno IP65");
assert.ok(quadroMobile.safetyChecks.some((c) => c.code === "QUADRO_MOBILE_INTERRUTTORE_DIFFERENZIALE_30MA"), "Differenziale 30 mA salvavita");
assert.ok(quadroMobile.safetyChecks.some((c) => c.code === "QUADRO_MOBILE_PRESE_CEE_INTERBLOCCATE"), "Prese CEE interbloccate");

const bomboleGpl = catalogCatExact.machines.find((m) => m.machineKey === "bombole_gpl_cucina_campo")!;
assert.ok(bomboleGpl.safetyChecks.some((c) => c.code === "BOMBOLE_GPL_COLLARE_CATENELLE_ANTICADUTA"), "Catenelle anticaduta e collare di protezione");
assert.ok(bomboleGpl.safetyChecks.some((c) => c.code === "BOMBOLE_GPL_REGOLATORE_ECCESSO_FLUSSO_UNI7131"), "Regolatore con valvola blocco eccesso flusso");
assert.ok(bomboleGpl.safetyChecks.some((c) => c.code === "BOMBOLE_GPL_TUBI_FLESSIBILI_UNI7140_SCADENZA" && c.normReference.includes("UNI 7140")), "Tubi flessibili UNI 7140 con data di scadenza");

// -------------------------------------------------------------
// Test 25: Associazione 1-a-1 ambienti Step 2 Catering (env-cat-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 25: Verifica associazione ambienti Step 2 Catering (env-cat-*) -> Step 4 Macchine");
const catEnvironments = [
  { id: "env-cat-cucina-centrale", name: "Cucina Centrale di Produzione e Preparazione Basi", category: "production" },
  { id: "env-cat-prep-fingerfood", name: "Laboratorio Finger Food e Porzionamento Ricevimenti", category: "production" },
  { id: "env-cat-deposito-arredi", name: "Deposito Arredi Mobili, Chafing Dish e Attrezzature Ricevimenti", category: "warehouse" },
  { id: "env-cat-banchina-carico", name: "Banchina Carico Furgoni e Logistica Spedizioni", category: "warehouse" },
  { id: "env-cat-lavaggio-rientro", name: "Centrale Lavaggio e Sanificazione Stoviglie di Rientro", category: "production" },
  { id: "env-cat-deposito-gpl", name: "Area Deposito Bombole GPL e Quadri Mobili da Campo", category: "technical" },
];

const suggestedWithCatEnvs = getSuggestedMachinesForEnvironmentsAndAteco(catEnvironments, "56.21.00");
assert.equal(suggestedWithCatEnvs.length, 18, "Tutte le 18 macchine devono essere raccomandate e collegate ai 6 ambienti censiti");

// Verifica 1-a-1 per ciascun ambiente:
const cucinaCentraleMachines = suggestedWithCatEnvs.filter((m) => m.targetEnvironmentId === "env-cat-cucina-centrale");
assert.equal(cucinaCentraleMachines.length, 4, "env-cat-cucina-centrale deve associare 4 macchine di produzione base");
assert.ok(cucinaCentraleMachines.some((m) => m.machineKey === "forno_combinato_catering"));
assert.ok(cucinaCentraleMachines.some((m) => m.machineKey === "abbattitore_temperatura_catering"));
assert.ok(cucinaCentraleMachines.some((m) => m.machineKey === "brasiera_ribaltabile_catering"));
assert.ok(cucinaCentraleMachines.some((m) => m.machineKey === "confezionatrice_sottovuoto_catering"));

const prepFingerMachines = suggestedWithCatEnvs.filter((m) => m.targetEnvironmentId === "env-cat-prep-fingerfood");
assert.equal(prepFingerMachines.length, 2, "env-cat-prep-fingerfood deve associare affettatrice e cutter");
assert.ok(prepFingerMachines.some((m) => m.machineKey === "affettatrice_gravita_catering"));
assert.ok(prepFingerMachines.some((m) => m.machineKey === "cutter_robot_catering"));

// Verifica anche supporto dedicato per env-cat-diete-allergeni
const dieteCatEnvTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-cat-diete-allergeni", name: "Area Preparazione Diete Speciali e Senza Glutine", category: "production" }],
  "56.21.00",
);
const dieteCatLinked = dieteCatEnvTest.filter((m) => m.targetEnvironmentId === "env-cat-diete-allergeni");
assert.equal(dieteCatLinked.length, 2, "env-cat-diete-allergeni deve associare affettatrice e cutter");
assert.ok(dieteCatLinked.some((m) => m.machineKey === "affettatrice_gravita_catering"));
assert.ok(dieteCatLinked.some((m) => m.machineKey === "cutter_robot_catering"));

const depositoArrediMachines = suggestedWithCatEnvs.filter((m) => m.targetEnvironmentId === "env-cat-deposito-arredi");
assert.equal(depositoArrediMachines.length, 5, "env-cat-deposito-arredi deve associare 5 attrezzature da ricevimento e banqueting");
assert.ok(depositoArrediMachines.some((m) => m.machineKey === "forno_rigeneratore_mobile"));
assert.ok(depositoArrediMachines.some((m) => m.machineKey === "chafing_dish_scaldavivande"));
assert.ok(depositoArrediMachines.some((m) => m.machineKey === "friggitrice_mobile_catering"));
assert.ok(depositoArrediMachines.some((m) => m.machineKey === "fabbricatore_ghiaccio_catering"));
assert.ok(depositoArrediMachines.some((m) => m.machineKey === "banco_bar_mobile_luminoso"));

const banchinaMachines = suggestedWithCatEnvs.filter((m) => m.targetEnvironmentId === "env-cat-banchina-carico");
assert.equal(banchinaMachines.length, 3, "env-cat-banchina-carico deve associare contenitori, rampa e roll-container");
assert.ok(banchinaMachines.some((m) => m.machineKey === "contenitori_isotermici_catering"));
assert.ok(banchinaMachines.some((m) => m.machineKey === "rampa_carico_alluminio"));
assert.ok(banchinaMachines.some((m) => m.machineKey === "roll_container_isotermico"));

// Verifica anche supporto per env-cat-deposito-noleggio
const noleggioCatEnvTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-cat-deposito-noleggio", name: "Magazzino Materiale a Noleggio e Arredi", category: "warehouse" }],
  "56.21.00",
);
const noleggioCatLinked = noleggioCatEnvTest.filter((m) => m.targetEnvironmentId === "env-cat-deposito-noleggio");
assert.equal(noleggioCatLinked.length, 3, "env-cat-deposito-noleggio deve associare contenitori, rampa e roll-container");
assert.ok(noleggioCatLinked.some((m) => m.machineKey === "contenitori_isotermici_catering"));
assert.ok(noleggioCatLinked.some((m) => m.machineKey === "rampa_carico_alluminio"));
assert.ok(noleggioCatLinked.some((m) => m.machineKey === "roll_container_isotermico"));

const lavaggioRientroMachines = suggestedWithCatEnvs.filter((m) => m.targetEnvironmentId === "env-cat-lavaggio-rientro");
assert.equal(lavaggioRientroMachines.length, 2, "env-cat-lavaggio-rientro deve associare lavastoviglie capotta e lavaoggetti");
assert.ok(lavaggioRientroMachines.some((m) => m.machineKey === "lavastoviglie_capotta_catering"));
assert.ok(lavaggioRientroMachines.some((m) => m.machineKey === "lavaoggetti_teglie_catering"));

const depositoGplMachines = suggestedWithCatEnvs.filter((m) => m.targetEnvironmentId === "env-cat-deposito-gpl");
assert.equal(depositoGplMachines.length, 2, "env-cat-deposito-gpl deve associare quadro elettrico e bombole GPL");
assert.ok(depositoGplMachines.some((m) => m.machineKey === "quadro_elettrico_mobile"));
assert.ok(depositoGplMachines.some((m) => m.machineKey === "bombole_gpl_cucina_campo"));

// Verifica anche supporto per env-cat-ufficio-logistica
const ufficioCatEnvTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-cat-ufficio-logistica", name: "Ufficio Logistica e Pianificazione Eventi", category: "offices" }],
  "56.21.00",
);
const ufficioCatLinked = ufficioCatEnvTest.filter((m) => m.targetEnvironmentId === "env-cat-ufficio-logistica");
assert.equal(ufficioCatLinked.length, 2, "env-cat-ufficio-logistica deve associare quadro elettrico e bombole GPL");
assert.ok(ufficioCatLinked.some((m) => m.machineKey === "quadro_elettrico_mobile"));
assert.ok(ufficioCatLinked.some((m) => m.machineKey === "bombole_gpl_cucina_campo"));

// -------------------------------------------------------------
// Test 26: Risoluzione solo su codice ATECO senza locali censiti (Catering)
// -------------------------------------------------------------
console.log("Test 26: Integrazione automatica macchine per ATECO 56.21.00 senza ambienti preventivi");
const suggestedCatOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "56.21.00");
assert.equal(suggestedCatOnlyAteco.length, 18, "Devono essere suggerite tutte le 18 macchine del catering");
assert.ok(
  suggestedCatOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per varianti di codice ATECO ("56.21.0", "56.21", "562100", "5621")
for (const code of ["56.21.0", "56.21", "562100", "5621"]) {
  const fallbackRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackRes.length, 18, `ATECO variant '${code}' deve restituire tutte le 18 macchine`);
  assert.ok(fallbackRes.every((m) => m.sourceReason === "ateco"));
}

// ============================================================================
// TEST ATECO 56.10.42 — FOOD TRUCK, STREET FOOD E RISTORAZIONE AMBULANTE
// ============================================================================
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 56.10.42 Food Truck / Street Food) ===");

// -------------------------------------------------------------
// Test 27: Priorità e risoluzione catalogo ATECO Food Truck
// -------------------------------------------------------------
console.log("Test 27: Verifica priorità catalogo ATECO per Food Truck e Ristorazione Ambulante (56.10.42 / 56.10.4 / 561042 / 56104)");
const catalogFtExact = getSectorMachineCatalogForAteco("56.10.42");
assert.equal(catalogFtExact.sectorKey, "food_truck_street_food", "ATECO 56.10.42 deve restituire food_truck_street_food");
assert.ok(catalogFtExact.sectorLabel.includes("Food Truck"), "L'etichetta del catalogo deve includere Food Truck");
assert.ok(catalogFtExact.sectorLabel.includes("Street Food"), "L'etichetta del catalogo deve includere Street Food");
assert.ok(catalogFtExact.sectorLabel.includes("Ristorazione Ambulante"), "L'etichetta del catalogo deve includere Ristorazione Ambulante");

for (const variant of ["56.10.4", "561042", "56104"]) {
  const ftVar = getSectorMachineCatalogForAteco(variant);
  assert.equal(ftVar.sectorKey, "food_truck_street_food", `Variante '${variant}' deve restituire food_truck_street_food`);
}

// Verifica posizionamento: food_truck_street_food segue catering_eventi_banqueting e precede ristorazione_alimentare
const catIdxFt = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "catering_eventi_banqueting");
const ftIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "food_truck_street_food");
const ristGenIdxFt = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");
assert.ok(catIdxFt !== -1, "Settore catering_eventi_banqueting deve esistere");
assert.ok(ftIdx !== -1, "Settore food_truck_street_food deve esistere");
assert.ok(ristGenIdxFt !== -1, "Settore generico ristorazione_alimentare deve esistere");
assert.equal(ftIdx, catIdxFt + 1, "food_truck_street_food deve seguire immediatamente catering_eventi_banqueting");
assert.ok(ftIdx < ristGenIdxFt, "food_truck_street_food deve precedere ristorazione_alimentare nel catalogo");

// -------------------------------------------------------------
// Test 28: Verifica completezza delle 16 macchine per Food Truck
// -------------------------------------------------------------
console.log("Test 28: Verifica completezza delle 16 attrezzature professionali con modelli reali e controlli normativi dedicati");
assert.equal(catalogFtExact.machines.length, 16, "Il catalogo Food Truck deve contenere esattamente 16 macchine");

const expectedFtMachineKeys = [
  // Reparto 1: Cottura & Fumi Veicolari (4)
  "piastra_frytop_foodtruck",
  "friggitrice_incasso_foodtruck",
  "cappa_aspirazione_foodtruck",
  "affettatrice_compatta_blocco",
  // Reparto 2: Freddo & Conservazione Veicolare (2)
  "banco_frigo_orizzontale_veicolare",
  "armadio_freezer_veicolare",
  // Reparto 3: Somministrazione & Interfaccia Clienti (3)
  "vetrina_refrigerata_parafiato",
  "portellone_idraulico_banco",
  "estintore_polvere_co2_foodtruck",
  // Reparto 4: Energia & Impianto Elettrico Mobile (2)
  "gruppo_elettrogeno_silenziato",
  "quadro_elettrico_veicolare",
  // Reparto 5: Sicurezza Impianto Gas GPL (2)
  "impianto_rilevazione_gas_gpl",
  "bombole_gpl_vano_ermetico",
  // Reparto 6: Autonomia Idrica & Igiene Mani (3)
  "autoclave_pompa_acqua_12v",
  "boiler_elettrico_compatto",
  "lavello_inox_ginocchio_veicolare",
];

for (const key of expectedFtMachineKeys) {
  const found = catalogFtExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Macchina ${key} deve essere presente nel catalogo Food Truck`);
  assert.ok(found.name.length > 5, `Nome macchina ${key} deve essere esaustivo`);
  assert.ok(found.type.length > 5, `Tipologia macchina ${key} deve essere specificata`);
  assert.ok(found.suggestedManufacturer.length > 0, `Produttore suggerito per ${key} deve essere presente`);
  assert.ok(found.suggestedModel.length > 0, `Modello suggerito per ${key} deve essere presente`);
  assert.ok(found.safetyChecks.length >= 3, `Macchina ${key} deve avere almeno 3 controlli di sicurezza`);
  assert.ok(found.training, `Macchina ${key} deve avere un corso di formazione/addestramento associato`);
}

// Verifiche puntuali su modelli reali e controlli normativi specifici (UNI EN 1974, crash-sensor UNI EN 16129, MOCA 1935/2004, D.M. 03/09/2021 classe F, salvavita 30 mA, UNI 7140):
const piastraFt = catalogFtExact.machines.find((m) => m.machineKey === "piastra_frytop_foodtruck")!;
assert.ok(piastraFt.suggestedManufacturer.includes("Giorik") || piastraFt.suggestedManufacturer.includes("Lotus") || piastraFt.suggestedManufacturer.includes("Angelo Po"), "Giorik, Lotus o Angelo Po");
assert.ok(piastraFt.safetyChecks.some((c) => c.code === "PIASTRA_FT_PARASPRUZZI_ALTO"), "Paraspruzzi perimetrale inox alto");
assert.ok(piastraFt.safetyChecks.some((c) => c.code === "PIASTRA_FT_CASSETTO_GRASSI_BLOCCO_CURVA"), "Cassetto grassi con blocco curva");
assert.ok(piastraFt.safetyChecks.some((c) => c.code === "PIASTRA_FT_TERMOCOPPIA_SICUREZZA_GAS"), "Termocoppia sicurezza gas");

const friggitriceFt = catalogFtExact.machines.find((m) => m.machineKey === "friggitrice_incasso_foodtruck")!;
assert.ok(friggitriceFt.suggestedManufacturer.includes("Lotus") || friggitriceFt.suggestedManufacturer.includes("Fimar") || friggitriceFt.suggestedManufacturer.includes("Angelo Po"), "Lotus, Fimar o Angelo Po");
assert.ok(friggitriceFt.safetyChecks.some((c) => c.code === "FRIGGITRICE_FT_COPERCHIO_ERMETICO_GANCI_MARCIA"), "Coperchio ermetico con ganci marcia");
assert.ok(friggitriceFt.safetyChecks.some((c) => c.code === "FRIGGITRICE_FT_TERMOSTATO_MASSIMA_230C_RIARMO" && c.normReference.includes("03/09/2021")), "Termostato < 230°C contro autocombustione D.M. 03/09/2021");
assert.ok(friggitriceFt.safetyChecks.some((c) => c.code === "FRIGGITRICE_FT_RUBINETTO_SCARICO_PROLUNGA_SICURA"), "Valvola scarico con prolunga e sicura");

const cappaFt = catalogFtExact.machines.find((m) => m.machineKey === "cappa_aspirazione_foodtruck")!;
assert.ok(cappaFt.suggestedManufacturer.includes("Smoki") || cappaFt.suggestedManufacturer.includes("Camini & Cappe") || cappaFt.suggestedManufacturer.includes("Baraldi"), "Smoki, Camini & Cappe o Baraldi");
assert.ok(cappaFt.safetyChecks.some((c) => c.code === "CAPPA_FT_FILTRI_LABIRINTO_INOX_LAVABILI"), "Filtri labirinto inox");
assert.ok(cappaFt.safetyChecks.some((c) => c.code === "CAPPA_FT_SCARICO_TETTO_COMIGNOLO_AERODINAMICO"), "Scarico a tetto con comignolo aerodinamico");
assert.ok(cappaFt.safetyChecks.some((c) => c.code === "CAPPA_FT_MICROINTERRUTTORE_VENTILAZIONE_FORZATA"), "Microinterruttore ventilazione forzata");

const affettatriceFt = catalogFtExact.machines.find((m) => m.machineKey === "affettatrice_compatta_blocco")!;
assert.ok(affettatriceFt.suggestedManufacturer.includes("Sirman") || affettatriceFt.suggestedManufacturer.includes("Berkel"), "Sirman o Berkel");
assert.ok(affettatriceFt.safetyChecks.some((c) => c.code === "AFFETTATRICE_FT_ANELLO_FISSO_PARALAMA_360_UNI1974" && c.normReference.includes("UNI EN 1974")), "Anello fisso paralama continuo 360° UNI EN 1974");
assert.ok(affettatriceFt.safetyChecks.some((c) => c.code === "AFFETTATRICE_FT_ANCORAGGIO_RAPIDO_VOLANTINI_BANCO"), "Ancoraggio rapido al banco con volantini");
assert.ok(affettatriceFt.safetyChecks.some((c) => c.code === "AFFETTATRICE_FT_BLOCCO_VELA_SPESSORE_ZERO_CARRO"), "Blocco vela spessore zero");

const bancoFrigoFt = catalogFtExact.machines.find((m) => m.machineKey === "banco_frigo_orizzontale_veicolare")!;
assert.ok(bancoFrigoFt.suggestedManufacturer.includes("Friulinox") || bancoFrigoFt.suggestedManufacturer.includes("Mercatus") || bancoFrigoFt.suggestedManufacturer.includes("Ilsa"), "Friulinox, Mercatus o Ilsa");
assert.ok(bancoFrigoFt.safetyChecks.some((c) => c.code === "BANCO_FRIGO_FT_CASSETTI_FERMO_MECCANICO_CURVA"), "Cassetti con fermo meccanico anti-apertura in curva");
assert.ok(bancoFrigoFt.safetyChecks.some((c) => c.code === "BANCO_FRIGO_FT_CIRCUITO_ERMETICO_R290_UNI378" && c.normReference.includes("UNI EN 378")), "Circuito ermetico UNI EN 378 gas R290");

const freezerFt = catalogFtExact.machines.find((m) => m.machineKey === "armadio_freezer_veicolare")!;
assert.ok(freezerFt.suggestedManufacturer.includes("Liebherr") || freezerFt.suggestedManufacturer.includes("Ilsa"), "Liebherr o Ilsa");
assert.ok(freezerFt.safetyChecks.some((c) => c.code === "FREEZER_FT_TEMPERATURA_COSTANTE_18C_ISOLAMENTO"), "Temperatura costante <= -18°C");
assert.ok(freezerFt.safetyChecks.some((c) => c.code === "FREEZER_FT_SERRATURA_MECCANICA_CHIAVE_TRASPORTO"), "Serratura meccanica a chiave");

const vetrinaFt = catalogFtExact.machines.find((m) => m.machineKey === "vetrina_refrigerata_parafiato")!;
assert.ok(vetrinaFt.suggestedManufacturer.includes("Fimar") || vetrinaFt.suggestedManufacturer.includes("Mercatus"), "Fimar o Mercatus");
assert.ok(vetrinaFt.safetyChecks.some((c) => c.code === "VETRINA_FT_CRISTALLO_CURVO_PARAFIATO_ASL"), "Cristallo curvo parafiato igienico ASL");
assert.ok(vetrinaFt.safetyChecks.some((c) => c.code === "VETRINA_FT_BACINELLE_INOX_MOCA_1935_2004" && c.normReference.includes("1935/2004")), "Bacinelle inox con conformità MOCA 1935/2004");

const portelloneFt = catalogFtExact.machines.find((m) => m.machineKey === "portellone_idraulico_banco")!;
assert.ok(portelloneFt.safetyChecks.some((c) => c.code === "PORTELLONE_FT_PISTONI_GAS_BLOCCO_ANTICADUTA_VENTO"), "Pistoni gas e blocco meccanico anticaduta da vento");
assert.ok(portelloneFt.safetyChecks.some((c) => c.code === "PORTELLONE_FT_STRIP_LED_24V_ILLUMINAZIONE_CLIENTE"), "Strip LED 24V");

const estintoreFt = catalogFtExact.machines.find((m) => m.machineKey === "estintore_polvere_co2_foodtruck")!;
assert.ok(estintoreFt.suggestedManufacturer.includes("Anaf") || estintoreFt.suggestedManufacturer.includes("Mozzanica") || estintoreFt.suggestedManufacturer.includes("Mb"), "Anaf, Mozzanica o Mb");
assert.ok(estintoreFt.safetyChecks.some((c) => c.code === "ESTINTORE_FT_OMOLOGATO_DM2021_CLASSE_F_OLI_GRASSI" && c.normReference.includes("03/09/2021")), "Estintore omologato D.M. 03/09/2021 classe F per oli e grassi");
assert.ok(estintoreFt.safetyChecks.some((c) => c.code === "ESTINTORE_FT_COPERTA_ANTIFIAMMA_IGNIFUGA_EN1869"), "Coperta antifiamma EN 1869");

const generatoreFt = catalogFtExact.machines.find((m) => m.machineKey === "gruppo_elettrogeno_silenziato")!;
assert.ok(generatoreFt.suggestedManufacturer.includes("Pramac") || generatoreFt.suggestedManufacturer.includes("Honda") || generatoreFt.suggestedManufacturer.includes("Genmac"), "Pramac, Honda o Genmac");
assert.ok(generatoreFt.safetyChecks.some((c) => c.code === "GENERATORE_FT_INSONORIZZAZIONE_SOTTO_65DBA"), "Silenziato < 65 dBA");
assert.ok(generatoreFt.safetyChecks.some((c) => c.code === "GENERATORE_FT_SCARICO_GAS_CONVOGLIATO_TETTO_ESTERNO"), "Scarico gas a tetto esterno");

const quadroFt = catalogFtExact.machines.find((m) => m.machineKey === "quadro_elettrico_veicolare")!;
assert.ok(quadroFt.suggestedManufacturer.includes("Gewiss") || quadroFt.suggestedManufacturer.includes("Scame"), "Gewiss o Scame");
assert.ok(quadroFt.safetyChecks.some((c) => c.code === "QUADRO_FT_DIFFERENZIALE_SALVAVITA_30MA" && c.question.includes("30 mA")), "Differenziale salvavita 30 mA");
assert.ok(quadroFt.safetyChecks.some((c) => c.code === "QUADRO_FT_COMMUTATORE_RETE_GRUPPO_INTERBLOCCATO"), "Commutatore rete/gruppo interbloccato");

const rilevatoreGasFt = catalogFtExact.machines.find((m) => m.machineKey === "impianto_rilevazione_gas_gpl")!;
assert.ok(rilevatoreGasFt.suggestedManufacturer.includes("BEP") || rilevatoreGasFt.suggestedManufacturer.includes("CBE") || rilevatoreGasFt.suggestedManufacturer.includes("Cavagna"), "BEP, CBE o Cavagna");
assert.ok(rilevatoreGasFt.safetyChecks.some((c) => c.code === "RILEVATORE_FT_SENSORE_PAVIMENTO_GPL_CICALINO"), "Sensore a pavimento GPL con cicalino");
assert.ok(rilevatoreGasFt.safetyChecks.some((c) => c.code === "RILEVATORE_FT_ELETTROVALVOLA_NC_RIARMO_MANUALE"), "Elettrovalvola NC a riarmo manuale all'uscita bombole");

const bomboleFt = catalogFtExact.machines.find((m) => m.machineKey === "bombole_gpl_vano_ermetico")!;
assert.ok(bomboleFt.suggestedManufacturer.includes("Cavagna") || bomboleFt.suggestedManufacturer.includes("Truma"), "Cavagna o Truma");
assert.ok(bomboleFt.safetyChecks.some((c) => c.code === "BOMBOLE_FT_CRASH_SENSOR_DUOCONTROL_UNI16129" && c.normReference.includes("UNI EN 16129")), "Sensore crash-sensor DuoControl UNI EN 16129");
assert.ok(bomboleFt.safetyChecks.some((c) => c.code === "BOMBOLE_FT_TUBI_FLESSIBILI_UNI7140_SCADENZA" && c.normReference.includes("UNI 7140")), "Tubi flessibili UNI 7140 con data di scadenza");
assert.ok(bomboleFt.safetyChecks.some((c) => c.code === "BOMBOLE_FT_VANO_ERMETICO_INTERNO_AERAZIONE_PAVIMENTO"), "Vano bombole ermetico e aerato a pavimento");

const autoclaveFt = catalogFtExact.machines.find((m) => m.machineKey === "autoclave_pompa_acqua_12v")!;
assert.ok(autoclaveFt.suggestedManufacturer.includes("Flojet") || autoclaveFt.suggestedManufacturer.includes("Shurflo") || autoclaveFt.suggestedManufacturer.includes("Jabsco"), "Flojet, Shurflo o Jabsco");
assert.ok(autoclaveFt.safetyChecks.some((c) => c.code === "AUTOCLAVE_FT_MATERIALI_MOCA_1935_2004_DM174" && c.normReference.includes("1935/2004")), "Idoneità al contatto alimentare MOCA Reg. CE 1935/2004");

const boilerFt = catalogFtExact.machines.find((m) => m.machineKey === "boiler_elettrico_compatto")!;
assert.ok(boilerFt.suggestedManufacturer.includes("Truma") || boilerFt.suggestedManufacturer.includes("Ariston"), "Truma o Ariston");
assert.ok(boilerFt.safetyChecks.some((c) => c.code === "BOILER_FT_EROGAZIONE_ACQUA_45_50C_LAVAGGIO_MANI"), "Erogazione acqua 45-50°C per igiene mani");
assert.ok(boilerFt.safetyChecks.some((c) => c.code === "BOILER_FT_VALVOLA_SICUREZZA_SOVRAPRESSIONE_SCARICO_TERRA"), "Valvola sicurezza con scarico a terra");

const lavelloFt = catalogFtExact.machines.find((m) => m.machineKey === "lavello_inox_ginocchio_veicolare")!;
assert.ok(lavelloFt.suggestedManufacturer.includes("Bonomini") || lavelloFt.suggestedManufacturer.includes("Inox Piave") || lavelloFt.suggestedManufacturer.includes("Forcar"), "Bonomini, Inox Piave o Forcar");
assert.ok(lavelloFt.safetyChecks.some((c) => c.code === "LAVELLO_FT_COMANDO_NON_MANUALE_GINOCCHIO" && c.normReference.includes("852/2004")), "Comando a ginocchio non manuale Reg. CE 852/2004");
assert.ok(lavelloFt.safetyChecks.some((c) => c.code === "LAVELLO_FT_DISPENSATORI_SAPONE_CARTA_FISSATI"), "Distributori sapone e carta fissati");

// -------------------------------------------------------------
// Test 29: Associazione 1-a-1 ambienti Step 2 Food Truck (env-ft-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 29: Verifica associazione ambienti Step 2 Food Truck (env-ft-*) -> Step 4 Macchine");
const ftEnvironments = [
  { id: "env-ft-vano-cottura", name: "Vano Cottura e Piastre da Furgone", category: "cucina" },
  { id: "env-ft-vano-refrigerazione", name: "Vano Refrigerazione e Conservazione Veicolare", category: "magazzino_merci" },
  { id: "env-ft-banco-somministrazione", name: "Banco Somministrazione e Interfaccia Clienti", category: "sales_office" },
  { id: "env-ft-vano-generatore", name: "Vano Gruppo Elettrogeno Ausiliario", category: "tecnici_esterno" },
  { id: "env-ft-vano-bombole-gpl", name: "Vano Ermetico Bombole GPL", category: "tecnici_esterno" },
  { id: "env-ft-impianto-idrico", name: "Impianto Idrico Autonomo e Igiene Mani", category: "laboratorio_cucina" },
];

const suggestedWithFtEnvs = getSuggestedMachinesForEnvironmentsAndAteco(ftEnvironments, "56.10.42");
assert.equal(suggestedWithFtEnvs.length, 16, "Tutte le 16 macchine devono essere raccomandate e collegate ai 6 ambienti veicolari censiti");

// Verifica 1-a-1 per ciascun ambiente:
const cotturaFtMachines = suggestedWithFtEnvs.filter((m) => m.targetEnvironmentId === "env-ft-vano-cottura");
assert.equal(cotturaFtMachines.length, 4, "env-ft-vano-cottura deve associare 4 attrezzature di cottura e taglio");
assert.ok(cotturaFtMachines.some((m) => m.machineKey === "piastra_frytop_foodtruck"));
assert.ok(cotturaFtMachines.some((m) => m.machineKey === "friggitrice_incasso_foodtruck"));
assert.ok(cotturaFtMachines.some((m) => m.machineKey === "cappa_aspirazione_foodtruck"));
assert.ok(cotturaFtMachines.some((m) => m.machineKey === "affettatrice_compatta_blocco"));

const refrMachines = suggestedWithFtEnvs.filter((m) => m.targetEnvironmentId === "env-ft-vano-refrigerazione");
assert.equal(refrMachines.length, 2, "env-ft-vano-refrigerazione deve associare 2 attrezzature del freddo");
assert.ok(refrMachines.some((m) => m.machineKey === "banco_frigo_orizzontale_veicolare"));
assert.ok(refrMachines.some((m) => m.machineKey === "armadio_freezer_veicolare"));

const somministrazioneMachines = suggestedWithFtEnvs.filter((m) => m.targetEnvironmentId === "env-ft-banco-somministrazione");
assert.equal(somministrazioneMachines.length, 3, "env-ft-banco-somministrazione deve associare vetrina, portellone ed estintore");
assert.ok(somministrazioneMachines.some((m) => m.machineKey === "vetrina_refrigerata_parafiato"));
assert.ok(somministrazioneMachines.some((m) => m.machineKey === "portellone_idraulico_banco"));
assert.ok(somministrazioneMachines.some((m) => m.machineKey === "estintore_polvere_co2_foodtruck"));

const generatoreMachines = suggestedWithFtEnvs.filter((m) => m.targetEnvironmentId === "env-ft-vano-generatore");
assert.equal(generatoreMachines.length, 2, "env-ft-vano-generatore deve associare generatore e quadro elettrico");
assert.ok(generatoreMachines.some((m) => m.machineKey === "gruppo_elettrogeno_silenziato"));
assert.ok(generatoreMachines.some((m) => m.machineKey === "quadro_elettrico_veicolare"));

const bomboleMachines = suggestedWithFtEnvs.filter((m) => m.targetEnvironmentId === "env-ft-vano-bombole-gpl");
assert.equal(bomboleMachines.length, 2, "env-ft-vano-bombole-gpl deve associare rilevatore gas e gruppo bombole");
assert.ok(bomboleMachines.some((m) => m.machineKey === "impianto_rilevazione_gas_gpl"));
assert.ok(bomboleMachines.some((m) => m.machineKey === "bombole_gpl_vano_ermetico"));

const idricoMachines = suggestedWithFtEnvs.filter((m) => m.targetEnvironmentId === "env-ft-impianto-idrico");
assert.equal(idricoMachines.length, 3, "env-ft-impianto-idrico deve associare pompa autoclave, boiler e lavello");
assert.ok(idricoMachines.some((m) => m.machineKey === "autoclave_pompa_acqua_12v"));
assert.ok(idricoMachines.some((m) => m.machineKey === "boiler_elettrico_compatto"));
assert.ok(idricoMachines.some((m) => m.machineKey === "lavello_inox_ginocchio_veicolare"));

// Verifica anche supporto per ambienti ausiliari / di rimessaggio e sede
const cabinaTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-ft-cabina-guida", name: "Cabina di Guida Furgone Speciale", category: "offices" }],
  "56.10.42",
);
const cabinaLinked = cabinaTest.filter((m) => m.targetEnvironmentId === "env-ft-cabina-guida");
assert.equal(cabinaLinked.length, 2, "env-ft-cabina-guida deve associare estintore e quadro elettrico");
assert.ok(cabinaLinked.some((m) => m.machineKey === "estintore_polvere_co2_foodtruck"));
assert.ok(cabinaLinked.some((m) => m.machineKey === "quadro_elettrico_veicolare"));

const rimessaggioTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-ft-deposito-rimessaggio", name: "Rimessaggio Notturno e Deposito Veicoli", category: "warehouse" }],
  "56.10.42",
);
const rimessaggioLinked = rimessaggioTest.filter((m) => m.targetEnvironmentId === "env-ft-deposito-rimessaggio");
assert.equal(rimessaggioLinked.length, 4, "env-ft-deposito-rimessaggio deve associare 4 macchine");
assert.ok(rimessaggioLinked.some((m) => m.machineKey === "gruppo_elettrogeno_silenziato"));
assert.ok(rimessaggioLinked.some((m) => m.machineKey === "bombole_gpl_vano_ermetico"));
assert.ok(rimessaggioLinked.some((m) => m.machineKey === "banco_frigo_orizzontale_veicolare"));
assert.ok(rimessaggioLinked.some((m) => m.machineKey === "armadio_freezer_veicolare"));

const laboratorioSedeTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-ft-laboratorio-base", name: "Laboratorio Base Cucina e Stoccaggio Sede", category: "production" }],
  "56.10.42",
);
const laboratorioLinked = laboratorioSedeTest.filter((m) => m.targetEnvironmentId === "env-ft-laboratorio-base");
assert.equal(laboratorioLinked.length, 4, "env-ft-laboratorio-base deve associare 4 macchine di base");
assert.ok(laboratorioLinked.some((m) => m.machineKey === "piastra_frytop_foodtruck"));
assert.ok(laboratorioLinked.some((m) => m.machineKey === "affettatrice_compatta_blocco"));
assert.ok(laboratorioLinked.some((m) => m.machineKey === "cappa_aspirazione_foodtruck"));
assert.ok(laboratorioLinked.some((m) => m.machineKey === "lavello_inox_ginocchio_veicolare"));

// -------------------------------------------------------------
// Test 30: Risoluzione solo su codice ATECO senza locali censiti (Food Truck)
// -------------------------------------------------------------
console.log("Test 30: Integrazione automatica macchine per ATECO 56.10.42 senza ambienti preventivi");
const suggestedFtOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "56.10.42");
assert.equal(suggestedFtOnlyAteco.length, 16, "Devono essere suggerite tutte le 16 macchine del food truck");
assert.ok(
  suggestedFtOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per varianti di codice ATECO ("56.10.4", "561042", "56104")
for (const code of ["56.10.4", "561042", "56104"]) {
  const fallbackRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackRes.length, 16, `ATECO variant '${code}' deve restituire tutte le 16 macchine`);
  assert.ok(fallbackRes.every((m) => m.sourceReason === "ateco"));
}

// -------------------------------------------------------------
// Test 31: Priorità e risoluzione catalogo ATECO per Gelateria e Pasticceria Ambulante (56.10.41 / 561041)
// -------------------------------------------------------------
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 56.10.41 Gelateria e Pasticceria Ambulante) ===");
console.log("Test 31: Verifica priorità catalogo ATECO per Gelateria e Pasticceria Ambulante (56.10.41 / 561041)");
const catalogGelExact = getSectorMachineCatalogForAteco("56.10.41");
assert.equal(catalogGelExact.sectorKey, "gelateria_pasticceria_ambulante", "ATECO 56.10.41 deve restituire gelateria_pasticceria_ambulante");
assert.ok(catalogGelExact.sectorLabel.includes("Gelateria"), "L'etichetta del catalogo deve includere Gelateria");
assert.ok(catalogGelExact.sectorLabel.includes("Pasticceria Ambulante"), "L'etichetta del catalogo deve includere Pasticceria Ambulante");
assert.ok(catalogGelExact.sectorLabel.includes("Street Gelato"), "L'etichetta del catalogo deve includere Street Gelato");

for (const variant of ["56.10.41", "561041"]) {
  const gelVar = getSectorMachineCatalogForAteco(variant);
  assert.equal(gelVar.sectorKey, "gelateria_pasticceria_ambulante", `Variante '${variant}' deve restituire gelateria_pasticceria_ambulante`);
}

// Verifica posizionamento: gelateria_pasticceria_ambulante segue food_truck_street_food e precede ristorazione_alimentare
const ftIdxGel = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "food_truck_street_food");
const gelIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "gelateria_pasticceria_ambulante");
const ristGenIdxGel = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");
assert.ok(ftIdxGel !== -1, "Settore food_truck_street_food deve esistere");
assert.ok(gelIdx !== -1, "Settore gelateria_pasticceria_ambulante deve esistere");
assert.ok(ristGenIdxGel !== -1, "Settore generico ristorazione_alimentare deve esistere");
assert.equal(gelIdx, ftIdxGel + 1, "gelateria_pasticceria_ambulante deve seguire immediatamente food_truck_street_food");
assert.ok(gelIdx < ristGenIdxGel, "gelateria_pasticceria_ambulante deve precedere ristorazione_alimentare nel catalogo");

// -------------------------------------------------------------
// Test 32: Verifica completezza delle 16 macchine per Gelateria Ambulante
// -------------------------------------------------------------
console.log("Test 32: Verifica completezza delle 16 attrezzature professionali con modelli reali e controlli normativi dedicati");
assert.equal(catalogGelExact.machines.length, 16, "Il catalogo Gelateria Ambulante deve contenere esattamente 16 macchine");

const expectedGelMachineKeys = [
  // Veicolare Street Gelato & Servizio (8)
  "banco_pozzetti_gelato_veicolare",
  "lavaporzionatore_flusso_continuo",
  "piastra_crepes_veicolare",
  "piastra_waffle_gaufre",
  "macchina_gelato_soft_veicolare",
  "vetrina_monoporzioni_gelato",
  "portellone_panoramico_gelateria",
  "sistema_batterie_inverter_litio",
  // Laboratorio Base di Produzione & Freddo (8)
  "pastorizzatore_elettronico_gelato",
  "mantecatore_orizzontale_gelato",
  "abbattitore_surgelatore_carapine",
  "planetaria_pasticceria_base",
  "sfogliatrice_banco_pasticceria",
  "forno_ventilato_pasticceria",
  "lavaoggetti_carapine_stoviglie",
  "armadio_congelatore_carapine_sede",
];

for (const key of expectedGelMachineKeys) {
  const found = catalogGelExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Macchina ${key} deve essere presente nel catalogo Gelateria Ambulante`);
  assert.ok(found.name.length > 5, `Nome macchina ${key} deve essere esaustivo`);
  assert.ok(found.type.length > 5, `Tipologia macchina ${key} deve essere specificata`);
  assert.ok(found.suggestedManufacturer.length > 0, `Produttore suggerito per ${key} deve essere presente`);
  assert.ok(found.suggestedModel.length > 0, `Modello suggerito per ${key} deve essere presente`);
  assert.ok(found.safetyChecks.length >= 3, `Macchina ${key} deve avere almeno 3 controlli di sicurezza`);
  assert.ok(found.training, `Macchina ${key} deve avere un corso di formazione/addestramento associato`);
}

// Verifiche puntuali su modelli reali e controlli normativi specifici (Reg. CE 853/04 pastorizzazione +85°C, UNI EN 12852 mantecatore, UNI EN 454 planetaria, UNI EN 1674 sfogliatrice, MOCA 1935/2004, DIN 10510, LiFePO4 BMS):
const bancoGel = catalogGelExact.machines.find((m) => m.machineKey === "banco_pozzetti_gelato_veicolare")!;
assert.ok(bancoGel.suggestedManufacturer.includes("IFI") || bancoGel.suggestedManufacturer.includes("Frigomeccanica") || bancoGel.suggestedManufacturer.includes("Orion"), "IFI, Frigomeccanica o Orion");
assert.ok(bancoGel.safetyChecks.some((c) => c.code === "BANCO_POZZETTI_GLICOLE_RISERVA_FREDDO" && c.question.includes("glicole")), "Refrigerazione a glicole e riserva di freddo");
assert.ok(bancoGel.safetyChecks.some((c) => c.code === "BANCO_POZZETTI_COPERCHI_CAMPANA_BLOCCO_CURVA"), "Coperchi a campana inox con blocco curva");
assert.ok(bancoGel.safetyChecks.some((c) => c.code === "BANCO_POZZETTI_CIRCUITO_ERMETICO_R290" && c.normReference.includes("UNI EN 378")), "Circuito R290 UNI EN 378");

const lavaGel = catalogGelExact.machines.find((m) => m.machineKey === "lavaporzionatore_flusso_continuo")!;
assert.ok(lavaGel.suggestedManufacturer.includes("Stöckel") || lavaGel.suggestedManufacturer.includes("San Jamar"), "Stöckel o San Jamar");
assert.ok(lavaGel.safetyChecks.some((c) => c.code === "LAVAPORZIONATORE_GETTO_CONTINUO_TROPPOPIENO_ASL" && c.normReference.includes("852/2004")), "Getto d'acqua continuo con troppopieno a norma ASL");
assert.ok(lavaGel.safetyChecks.some((c) => c.code === "LAVAPORZIONATORE_MATERIALI_MOCA_1935_2004" && c.normReference.includes("1935/2004")), "Materiali conformi MOCA Reg. CE 1935/2004");

const crepesGel = catalogGelExact.machines.find((m) => m.machineKey === "piastra_crepes_veicolare")!;
assert.ok(crepesGel.suggestedManufacturer.includes("Krampouz") || crepesGel.suggestedManufacturer.includes("Roller Grill"), "Krampouz o Roller Grill");
assert.ok(crepesGel.safetyChecks.some((c) => c.code === "PIASTRA_CREPES_GHISA_CERTIFICATA_MOCA" && c.normReference.includes("1935/2004")), "Piastra in ghisa certificata MOCA priva di rivestimenti tossici");
assert.ok(crepesGel.safetyChecks.some((c) => c.code === "PIASTRA_CREPES_TERMOSTATO_SPIA_RESIDUO"), "Spia calore residuo");

const waffleGel = catalogGelExact.machines.find((m) => m.machineKey === "piastra_waffle_gaufre")!;
assert.ok(waffleGel.suggestedManufacturer.includes("Krampouz") || waffleGel.suggestedManufacturer.includes("Neumärker"), "Krampouz o Neumärker");
assert.ok(waffleGel.safetyChecks.some((c) => c.code === "PIASTRA_WAFFLE_MANIGLIA_ISOLATA_180" && c.title.includes("180°")), "Maniglia termoisolante anti-ustione e apertura 180°");
assert.ok(waffleGel.safetyChecks.some((c) => c.code === "PIASTRA_WAFFLE_STAMPI_GHISA_SMALTATA_MOCA" && c.normReference.includes("1935/2004")), "Stampi in ghisa smaltata antiaderente alimentare MOCA");

const softGel = catalogGelExact.machines.find((m) => m.machineKey === "macchina_gelato_soft_veicolare")!;
assert.ok(softGel.suggestedManufacturer.includes("Carpigiani") || softGel.suggestedManufacturer.includes("Gel Matic"), "Carpigiani o Gel Matic");
assert.ok(softGel.safetyChecks.some((c) => c.code === "GELATO_SOFT_VASCA_CONSERVAZIONE_4C" && c.question.includes("+4°C")), "Vasca refrigerata a +4°C");
assert.ok(softGel.safetyChecks.some((c) => c.code === "GELATO_SOFT_MICRO_ARRESTO_AGITATORE" && c.normReference.includes("UNI EN 12852")), "Micro di arresto all'apertura UNI EN 12852");
assert.ok(softGel.safetyChecks.some((c) => c.code === "GELATO_SOFT_CIRCUITO_FRIGO_UNI378" && c.normReference.includes("UNI EN 378")), "Circuito frigorifero ermetico UNI EN 378");

const vetrinaGel = catalogGelExact.machines.find((m) => m.machineKey === "vetrina_monoporzioni_gelato")!;
assert.ok(vetrinaGel.suggestedManufacturer.includes("Isa") || vetrinaGel.suggestedManufacturer.includes("IFI"), "Isa o IFI");
assert.ok(vetrinaGel.safetyChecks.some((c) => c.code === "VETRINA_MONOPORZIONI_CRISTALLI_RISCALDATI"), "Cristalli doppi riscaldati anticondensa");
assert.ok(vetrinaGel.safetyChecks.some((c) => c.code === "VETRINA_MONOPORZIONI_ALLARME_HACCP"), "Controllo digitale temperatura con allarme di soglia HACCP");

const portelloneGel = catalogGelExact.machines.find((m) => m.machineKey === "portellone_panoramico_gelateria")!;
assert.ok(portelloneGel.safetyChecks.some((c) => c.code === "PORTELLONE_GEL_PISTONI_E_PERNO_BLOCCO_VENTO" && c.question.includes("vento")), "Pistoni a gas rinforzati e blocco meccanico anti-vento");
assert.ok(portelloneGel.safetyChecks.some((c) => c.code === "PORTELLONE_GEL_ILLUMINAZIONE_LED_24V"), "Illuminazione LED 24V");

const batterieGel = catalogGelExact.machines.find((m) => m.machineKey === "sistema_batterie_inverter_litio")!;
assert.ok(batterieGel.suggestedManufacturer.includes("Victron") || batterieGel.suggestedManufacturer.includes("Mastervolt"), "Victron Energy o Mastervolt");
assert.ok(batterieGel.safetyChecks.some((c) => c.code === "BATTERIE_LITIO_BMS_SOVRATEMPERATURA_CORTO" && c.question.includes("BMS")), "BMS di protezione da sovratemperatura e cortocircuito");
assert.ok(batterieGel.safetyChecks.some((c) => c.code === "BATTERIE_LITIO_INVERTER_ONDA_PURA_SALVAVITA" && c.question.includes("30 mA")), "Inverter sinusoidale puro con salvavita 30 mA");

const pastoGel = catalogGelExact.machines.find((m) => m.machineKey === "pastorizzatore_elettronico_gelato")!;
assert.ok(pastoGel.suggestedManufacturer.includes("Carpigiani") || pastoGel.suggestedManufacturer.includes("Bravo") || pastoGel.suggestedManufacturer.includes("Cattabriga"), "Carpigiani, Bravo o Cattabriga");
assert.ok(pastoGel.safetyChecks.some((c) => c.code === "PASTORIZZATORE_CICLO_TERMICO_85_4_HACCP" && c.normReference.includes("853/2004")), "Ciclo termico +85°C e raffreddamento rapido +4°C Reg. CE 853/04");
assert.ok(pastoGel.safetyChecks.some((c) => c.code === "PASTORIZZATORE_MICRO_SICUREZZA_COPERCHIO"), "Micro di sicurezza al sollevamento coperchio");

const manteGel = catalogGelExact.machines.find((m) => m.machineKey === "mantecatore_orizzontale_gelato")!;
assert.ok(manteGel.suggestedManufacturer.includes("Carpigiani") || manteGel.suggestedManufacturer.includes("Cattabriga") || manteGel.suggestedManufacturer.includes("Frigomat"), "Carpigiani, Cattabriga o Frigomat");
assert.ok(manteGel.safetyChecks.some((c) => c.code === "MANTECATORE_GRIGLIA_SALVADITA_UNI12852" && c.normReference.includes("12852")), "Griglia salvadita e portello interbloccato UNI EN 12852");
assert.ok(manteGel.safetyChecks.some((c) => c.code === "MANTECATORE_AGITATORE_RASCHIATORI_MOCA" && c.normReference.includes("1935/2004")), "Agitatore inox con pattini raschiatori atossici MOCA 1935/2004");

const abbattGel = catalogGelExact.machines.find((m) => m.machineKey === "abbattitore_surgelatore_carapine")!;
assert.ok(abbattGel.suggestedManufacturer.includes("Irinox") || abbattGel.suggestedManufacturer.includes("Coldline"), "Irinox o Coldline");
assert.ok(abbattGel.safetyChecks.some((c) => c.code === "ABBATTITORE_GEL_INDURIMENTO_35C_CRISTALLI" && c.question.includes("-35°C")), "Indurimento rapido carapine a -35°C");

const planetGel = catalogGelExact.machines.find((m) => m.machineKey === "planetaria_pasticceria_base")!;
assert.ok(planetGel.suggestedManufacturer.includes("Dito Sama") || planetGel.suggestedManufacturer.includes("Pietro Berto") || planetGel.suggestedManufacturer.includes("Fimar"), "Dito Sama, Pietro Berto o Fimar");
assert.ok(planetGel.safetyChecks.some((c) => c.code === "PLANETARIA_GEL_GRIGLIA_INTERBLOCCATA_UNI454" && c.normReference.includes("UNI EN 454")), "Griglia di protezione interbloccata UNI EN 454");
assert.ok(planetGel.safetyChecks.some((c) => c.code === "PLANETARIA_GEL_FUNGO_EMERGENZA_RIARMO"), "Fungo di emergenza a riarmo");

const sfogliaGel = catalogGelExact.machines.find((m) => m.machineKey === "sfogliatrice_banco_pasticceria")!;
assert.ok(sfogliaGel.suggestedManufacturer.includes("Rollmatic") || sfogliaGel.suggestedManufacturer.includes("Rondo") || sfogliaGel.suggestedManufacturer.includes("Flamic"), "Rollmatic, Rondo o Flamic");
assert.ok(sfogliaGel.safetyChecks.some((c) => c.code === "SFOGLIATRICE_GEL_RIPARI_INTERBLOCCATI_UNI1674" && c.normReference.includes("UNI EN 1674")), "Ripari di sicurezza interbloccati sui cilindri UNI EN 1674");

const fornoGel = catalogGelExact.machines.find((m) => m.machineKey === "forno_ventilato_pasticceria")!;
assert.ok(fornoGel.suggestedManufacturer.includes("Unox") || fornoGel.suggestedManufacturer.includes("Rational"), "Unox o Rational");
assert.ok(fornoGel.safetyChecks.some((c) => c.code === "FORNO_GEL_DOPPIO_VETRO_ANTIUSTIONE"), "Porta con doppio vetro ventilato termoisolante anti-ustione");
assert.ok(fornoGel.safetyChecks.some((c) => c.code === "FORNO_GEL_ARRESTO_VENTOLA_APERTURA"), "Arresto ventola all'apertura della porta");

const lavaoggettiGel = catalogGelExact.machines.find((m) => m.machineKey === "lavaoggetti_carapine_stoviglie")!;
assert.ok(lavaoggettiGel.suggestedManufacturer.includes("Winterhalter") || lavaoggettiGel.suggestedManufacturer.includes("Comenda"), "Winterhalter o Comenda");
assert.ok(lavaoggettiGel.safetyChecks.some((c) => c.code === "LAVAOGGETTI_RISCIACQUO_82C_DIN10510" && c.normReference.includes("DIN 10510")), "Risciacquo igienico ad alta temperatura >= 82°C DIN 10510");
assert.ok(lavaoggettiGel.safetyChecks.some((c) => c.code === "LAVAOGGETTI_DISPOSITIVO_ANTIRIFLUSSO_UNI1717" && c.normReference.includes("UNI EN 1717")), "Dispositivo antiriflusso UNI EN 1717");

const congelatoreGel = catalogGelExact.machines.find((m) => m.machineKey === "armadio_congelatore_carapine_sede")!;
assert.ok(congelatoreGel.suggestedManufacturer.includes("Friulinox") || congelatoreGel.suggestedManufacturer.includes("Coldline") || congelatoreGel.suggestedManufacturer.includes("Liebherr"), "Friulinox, Coldline o Liebherr");
assert.ok(congelatoreGel.safetyChecks.some((c) => c.code === "CONGELATORE_CARAPINE_TEMP_25C_REGOLABILE" && c.question.includes("-25°C")), "Temperatura costante regolabile fino a -25°C");

// -------------------------------------------------------------
// Test 33: Associazione 1-a-1 ambienti Step 2 Gelateria (env-gelamb-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 33: Verifica associazione ambienti Step 2 Gelateria (env-gelamb-*) -> Step 4 Macchine");
const gelEnvironments = [
  { id: "env-gelamb-banco-veicolare", name: "Banco Somministrazione e Carapine Veicolare", category: "sales_office" },
  { id: "env-ft-crepes-waffle", name: "Postazione Calda Crêpes e Waffle", category: "cucina" },
  { id: "env-gelamb-vano-tecnico-batterie", name: "Vano Tecnico Batterie ed Erogatore Soft", category: "tecnici_esterno" },
  { id: "env-gelamb-lab-pastorizzazione", name: "Laboratorio Base Pastorizzazione Miscele", category: "production" },
  { id: "env-gelamb-lab-mantecazione", name: "Laboratorio Base Mantecazione e Abbattimento", category: "production" },
  { id: "env-gelamb-lab-pasticceria", name: "Laboratorio Pasticceria Cialde e Forno", category: "production" },
  { id: "env-gelamb-lavaggio-carapine", name: "Area Lavaggio Carapine e Pentolame", category: "services" },
  { id: "env-gelamb-cella-stoccaggio", name: "Cella Stoccaggio Carapine e Rimessaggio Sede", category: "warehouse" },
];

const suggestedWithGelEnvs = getSuggestedMachinesForEnvironmentsAndAteco(gelEnvironments, "56.10.41");
assert.equal(suggestedWithGelEnvs.length, 16, "Tutte le 16 macchine devono essere raccomandate e collegate agli 8 ambienti censiti");

const bancoMachines = suggestedWithGelEnvs.filter((m) => m.targetEnvironmentId === "env-gelamb-banco-veicolare");
assert.equal(bancoMachines.length, 4, "env-gelamb-banco-veicolare deve associare banco pozzetti, lavaporzionatore, vetrina e portellone");
assert.ok(bancoMachines.some((m) => m.machineKey === "banco_pozzetti_gelato_veicolare"));
assert.ok(bancoMachines.some((m) => m.machineKey === "lavaporzionatore_flusso_continuo"));
assert.ok(bancoMachines.some((m) => m.machineKey === "vetrina_monoporzioni_gelato"));
assert.ok(bancoMachines.some((m) => m.machineKey === "portellone_panoramico_gelateria"));

const crepesWaffleMachines = suggestedWithGelEnvs.filter((m) => m.targetEnvironmentId === "env-ft-crepes-waffle");
assert.equal(crepesWaffleMachines.length, 2, "env-ft-crepes-waffle deve associare piastra crepes e piastra waffle");
assert.ok(crepesWaffleMachines.some((m) => m.machineKey === "piastra_crepes_veicolare"));
assert.ok(crepesWaffleMachines.some((m) => m.machineKey === "piastra_waffle_gaufre"));

const tecnicoMachines = suggestedWithGelEnvs.filter((m) => m.targetEnvironmentId === "env-gelamb-vano-tecnico-batterie");
assert.equal(tecnicoMachines.length, 2, "env-gelamb-vano-tecnico-batterie deve associare macchina gelato soft e batterie litio");
assert.ok(tecnicoMachines.some((m) => m.machineKey === "macchina_gelato_soft_veicolare"));
assert.ok(tecnicoMachines.some((m) => m.machineKey === "sistema_batterie_inverter_litio"));

const pastorizzatoreMachines = suggestedWithGelEnvs.filter((m) => m.targetEnvironmentId === "env-gelamb-lab-pastorizzazione");
assert.equal(pastorizzatoreMachines.length, 1, "env-gelamb-lab-pastorizzazione deve associare pastorizzatore");
assert.ok(pastorizzatoreMachines.some((m) => m.machineKey === "pastorizzatore_elettronico_gelato"));

const mantecazioneMachines = suggestedWithGelEnvs.filter((m) => m.targetEnvironmentId === "env-gelamb-lab-mantecazione");
assert.equal(mantecazioneMachines.length, 2, "env-gelamb-lab-mantecazione deve associare mantecatore e abbattitore carapine");
assert.ok(mantecazioneMachines.some((m) => m.machineKey === "mantecatore_orizzontale_gelato"));
assert.ok(mantecazioneMachines.some((m) => m.machineKey === "abbattitore_surgelatore_carapine"));

const pasticceriaMachines = suggestedWithGelEnvs.filter((m) => m.targetEnvironmentId === "env-gelamb-lab-pasticceria");
assert.equal(pasticceriaMachines.length, 3, "env-gelamb-lab-pasticceria deve associare planetaria, sfogliatrice e forno");
assert.ok(pasticceriaMachines.some((m) => m.machineKey === "planetaria_pasticceria_base"));
assert.ok(pasticceriaMachines.some((m) => m.machineKey === "sfogliatrice_banco_pasticceria"));
assert.ok(pasticceriaMachines.some((m) => m.machineKey === "forno_ventilato_pasticceria"));

const lavaggioMachines = suggestedWithGelEnvs.filter((m) => m.targetEnvironmentId === "env-gelamb-lavaggio-carapine");
assert.equal(lavaggioMachines.length, 1, "env-gelamb-lavaggio-carapine deve associare lavaoggetti");
assert.ok(lavaggioMachines.some((m) => m.machineKey === "lavaoggetti_carapine_stoviglie"));

const cellaMachines = suggestedWithGelEnvs.filter((m) => m.targetEnvironmentId === "env-gelamb-cella-stoccaggio");
assert.equal(cellaMachines.length, 1, "env-gelamb-cella-stoccaggio deve associare armadio congelatore sede");
assert.ok(cellaMachines.some((m) => m.machineKey === "armadio_congelatore_carapine_sede"));

// Verifica anche associazione con hangar ricarica
const hangarTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-gelamb-hangar-ricarica", name: "Hangar Rimessaggio e Ricarica Furgoni Gelato", category: "warehouse" }],
  "56.10.41",
);
const hangarLinked = hangarTest.filter((m) => m.targetEnvironmentId === "env-gelamb-hangar-ricarica");
assert.equal(hangarLinked.length, 1, "env-gelamb-hangar-ricarica deve associare armadio congelatore sede");
assert.ok(hangarLinked.some((m) => m.machineKey === "armadio_congelatore_carapine_sede"));

// -------------------------------------------------------------
// Test 34: Risoluzione solo su codice ATECO senza locali censiti (Gelateria Ambulante)
// -------------------------------------------------------------
console.log("Test 34: Integrazione automatica macchine per ATECO 56.10.41 senza ambienti preventivi");
const suggestedGelOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "56.10.41");
assert.equal(suggestedGelOnlyAteco.length, 16, "Devono essere suggerite tutte le 16 macchine della gelateria ambulante");
assert.ok(
  suggestedGelOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback identico per variante senza punti ("561041")
const fallbackGelVar = getSuggestedMachinesForEnvironmentsAndAteco([], "561041");
assert.equal(fallbackGelVar.length, 16, "Variante 561041 deve restituire tutte le 16 macchine");
assert.ok(fallbackGelVar.every((m) => m.sourceReason === "ateco"));

// -------------------------------------------------------------
// Test 35: Priorità e risoluzione catalogo ATECO per Bar, Caffetteria, Snack Bar, Cocktail Bar e Birreria (56.30 / 56.3)
// -------------------------------------------------------------
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 56.30 Bar / Caffetteria / Cocktail Bar) ===");
console.log("Test 35: Verifica priorità catalogo ATECO per Bar, Caffetteria, Snack Bar, Cocktail Bar e Birreria (56.30.00 / 56.30.0 / 56.30 / 56.3 / 5630 / 563)");
const catalogBarExact = getSectorMachineCatalogForAteco("56.30");
assert.equal(catalogBarExact.sectorKey, "bar_caffetteria", "ATECO 56.30 deve restituire bar_caffetteria");
assert.ok(catalogBarExact.sectorLabel.includes("Bar"), "L'etichetta del catalogo deve includere Bar");
assert.ok(catalogBarExact.sectorLabel.includes("Caffetteria"), "L'etichetta del catalogo deve includere Caffetteria");
assert.ok(catalogBarExact.sectorLabel.includes("Cocktail Bar"), "L'etichetta del catalogo deve includere Cocktail Bar");
assert.ok(catalogBarExact.sectorLabel.includes("Birreria"), "L'etichetta del catalogo deve includere Birreria");

for (const variant of ["56.30.00", "56.30.0", "56.30", "56.3", "563000", "5630", "563"]) {
  const barVar = getSectorMachineCatalogForAteco(variant);
  assert.equal(barVar.sectorKey, "bar_caffetteria", `Variante '${variant}' deve restituire bar_caffetteria`);
}

// Verifica posizionamento: bar_caffetteria segue gelateria_pasticceria_ambulante e precede ristorazione_alimentare
const gelIdxBar = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "gelateria_pasticceria_ambulante");
const barIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "bar_caffetteria");
const ristGenIdxBar = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");
assert.ok(gelIdxBar !== -1, "Settore gelateria_pasticceria_ambulante deve esistere");
assert.ok(barIdx !== -1, "Settore bar_caffetteria deve esistere");
assert.ok(ristGenIdxBar !== -1, "Settore generico ristorazione_alimentare deve esistere");
assert.equal(barIdx, gelIdxBar + 1, "bar_caffetteria deve seguire immediatamente gelateria_pasticceria_ambulante");
assert.ok(barIdx < ristGenIdxBar, "bar_caffetteria deve precedere ristorazione_alimentare nel catalogo");

// -------------------------------------------------------------
// Test 36: Verifica completezza delle 16 macchine professionali per Bar con modelli reali, corsi e controlli tecnici
// -------------------------------------------------------------
console.log("Test 36: Verifica completezza delle 16 attrezzature professionali con verifiche, corsi e modelli reali");
assert.equal(catalogBarExact.machines.length, 16, "Il catalogo Bar / Caffetteria deve contenere esattamente 16 macchine");

const expectedBarMachineKeys = [
  "macchina_caffe_bar",
  "macinadosatore_caffe_ondemand",
  "lavabicchieri_bar_sottobanco",
  "fabbricatore_ghiaccio_bar",
  "cocktail_station_bar",
  "blender_frullatore_cocktail",
  "tritaghiaccio_professionale_bar",
  "spillatore_birra_bevande",
  "bombole_co2_azoto_spillatura",
  "piastra_panini_tostiera",
  "forno_microonde_speedoven",
  "affettatrice_gravita_bar",
  "vetrina_snack_refrigerata",
  "armadio_frigo_bar_bevande",
  "spremiagrumi_centrifuga_bar",
  "impianto_addolcitore_acque",
];

for (const key of expectedBarMachineKeys) {
  const found = catalogBarExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Macchina ${key} deve essere presente nel catalogo Bar / Caffetteria`);
  assert.ok(found.name.length > 5, `Nome macchina ${key} deve essere esaustivo`);
  assert.ok(found.type.length > 5, `Tipologia macchina ${key} deve essere specificata`);
  assert.ok(found.suggestedManufacturer.length > 0, `Produttore suggerito per ${key} deve essere presente`);
  assert.ok(found.suggestedModel.length > 0, `Modello suggerito per ${key} deve essere presente`);
  assert.ok(found.safetyChecks.length >= 3, `Macchina ${key} deve avere almeno 3 controlli di sicurezza`);
  assert.ok(found.training, `Macchina ${key} deve avere un corso di formazione/addestramento associato`);
}

// Verifiche puntuali su modelli reali e controlli normativi specifici:
const macchinaCaffe = catalogBarExact.machines.find((m) => m.machineKey === "macchina_caffe_bar")!;
assert.ok(macchinaCaffe.suggestedManufacturer.includes("La Marzocco") || macchinaCaffe.suggestedManufacturer.includes("Faema") || macchinaCaffe.suggestedManufacturer.includes("Rancilio"), "La Marzocco, Faema o Rancilio");
assert.ok(macchinaCaffe.suggestedModel.includes("Linea PB") || macchinaCaffe.suggestedModel.includes("Faema E71") || macchinaCaffe.suggestedModel.includes("Classe 9"), "Linea PB, Faema E71 o Classe 9");
assert.ok(macchinaCaffe.safetyChecks.some((c) => c.code === "MACCHINA_CAFFE_CALDAIA_PED_VALVOLA_SOVRAPRESSIONE" && c.normReference.includes("PED")), "Caldaia PED e valvola sovrapressione");
assert.ok(macchinaCaffe.safetyChecks.some((c) => c.code === "MACCHINA_CAFFE_LANCIA_VAPORE_COOL_TOUCH_ANTIUSTIONE" && c.title.includes("Cool-Touch")), "Lancia Cool-Touch anti-scottatura");
assert.ok(macchinaCaffe.safetyChecks.some((c) => c.code === "MACCHINA_CAFFE_MANOMETRI_PRESSIONE_CERTIFICATI"), "Manometri pressione certificati");
assert.equal(macchinaCaffe.training.minHours, 4, "Addestramento 4h uso sicuro macchine a vapore");

const macinadosatore = catalogBarExact.machines.find((m) => m.machineKey === "macinadosatore_caffe_ondemand")!;
assert.ok(macinadosatore.suggestedManufacturer.includes("Mazzer") || macinadosatore.suggestedManufacturer.includes("Eureka") || macinadosatore.suggestedManufacturer.includes("Fiorenzato"), "Mazzer, Eureka o Fiorenzato");
assert.ok(macinadosatore.safetyChecks.some((c) => c.code === "MACINADOSATORE_CAMPANA_MOCA_MICROINTERRUTTORE" && c.normReference.includes("1935/2004")), "Campana MOCA e microinterruttore");
assert.ok(macinadosatore.safetyChecks.some((c) => c.code === "MACINADOSATORE_BATTIFILTRO_FONOASSORBENTE_RUMORE" && c.normReference.includes("Titolo VIII")), "Cassetto battifiltro fonoassorbente rumore impulsivo D.Lgs. 81/08");

const lavabicchieri = catalogBarExact.machines.find((m) => m.machineKey === "lavabicchieri_bar_sottobanco")!;
assert.ok(lavabicchieri.suggestedManufacturer.includes("Winterhalter") || lavabicchieri.suggestedManufacturer.includes("Meiko") || lavabicchieri.suggestedManufacturer.includes("Comenda"), "Winterhalter, Meiko o Comenda");
assert.ok(lavabicchieri.safetyChecks.some((c) => c.code === "LAVABICCHIERI_RISCIACQUO_85C_HACCP_DIN10511" && c.question.includes("85°C")), "Risciacquo igienico 85°C HACCP");
assert.ok(lavabicchieri.safetyChecks.some((c) => c.code === "LAVABICCHIERI_DISPOSITIVO_BREAK_TANK_UNI1717" && c.normReference.includes("UNI EN 1717")), "Dispositivo Break Tank UNI EN 1717");
assert.ok(lavabicchieri.safetyChecks.some((c) => c.code === "LAVABICCHIERI_MICRO_ARRESTO_CICLO_APERTURA"), "Micro arresto all'apertura");

const fabbricatoreGhiaccio = catalogBarExact.machines.find((m) => m.machineKey === "fabbricatore_ghiaccio_bar")!;
assert.ok(fabbricatoreGhiaccio.suggestedManufacturer.includes("Brema") || fabbricatoreGhiaccio.suggestedManufacturer.includes("Icematic"), "Brema o Icematic");
assert.ok(fabbricatoreGhiaccio.safetyChecks.some((c) => c.code === "FABBRICATORE_GHIACCIO_CIRCUITO_ERMETICO_R290" && c.normReference.includes("UNI EN 378")), "Circuito R290 UNI EN 378");
assert.ok(fabbricatoreGhiaccio.safetyChecks.some((c) => c.code === "FABBRICATORE_GHIACCIO_MATERIALI_INTERNI_MOCA" && c.normReference.includes("1935/2004")), "Materiali interni MOCA");
assert.ok(fabbricatoreGhiaccio.safetyChecks.some((c) => c.code === "FABBRICATORE_GHIACCIO_SCARICO_INTERRUZIONE_ARIA" && c.normReference.includes("UNI EN 1717")), "Scarico anti-reflusso fognario UNI EN 1717");

const cocktailStation = catalogBarExact.machines.find((m) => m.machineKey === "cocktail_station_bar")!;
assert.ok(cocktailStation.suggestedManufacturer.includes("RG Mania") || cocktailStation.suggestedManufacturer.includes("Station Bar") || cocktailStation.suggestedManufacturer.includes("Forcar"), "RG Mania, Station Bar o Forcar");
assert.ok(cocktailStation.safetyChecks.some((c) => c.code === "COCKTAIL_STATION_VASCA_COIBENTATA_SCARICO_DIRETTO"), "Vasca ghiaccio coibentata");
assert.ok(cocktailStation.safetyChecks.some((c) => c.code === "COCKTAIL_STATION_SPEED_RAIL_ANTICADUTA"), "Speed-rail anticaduta bottiglie");
assert.ok(cocktailStation.safetyChecks.some((c) => c.code === "COCKTAIL_STATION_LAVELLO_BAGNAGHIACCIO_UNI1717" && c.normReference.includes("UNI EN 1717")), "Bagnaghiaccio a pressione UNI EN 1717");

const blender = catalogBarExact.machines.find((m) => m.machineKey === "blender_frullatore_cocktail")!;
assert.ok(blender.suggestedManufacturer.includes("Vitamix") || blender.suggestedManufacturer.includes("Hamilton Beach"), "Vitamix o Hamilton Beach");
assert.ok(blender.safetyChecks.some((c) => c.code === "BLENDER_CAMPANA_FONOASSORBENTE_MICRO_UNI12852" && c.normReference.includes("UNI EN 12852")), "Campana fonoassorbente micro UNI EN 12852");
assert.ok(blender.safetyChecks.some((c) => c.code === "BLENDER_BICCHIERE_MOCA_BPA_FREE_ANTIURTO" && c.normReference.includes("1935/2004")), "Bicchiere MOCA BPA-free antiurto");

const tritaghiaccio = catalogBarExact.machines.find((m) => m.machineKey === "tritaghiaccio_professionale_bar")!;
assert.ok(tritaghiaccio.suggestedManufacturer.includes("Sirman") || tritaghiaccio.suggestedManufacturer.includes("Ceado"), "Sirman o Ceado");
assert.ok(tritaghiaccio.safetyChecks.some((c) => c.code === "TRITAGHIACCIO_LEVA_PRESSORE_MICRO_UNI12852" && c.normReference.includes("UNI EN 12852")), "Leva pressore micro UNI EN 12852");

const spillatore = catalogBarExact.machines.find((m) => m.machineKey === "spillatore_birra_bevande")!;
assert.ok(spillatore.suggestedManufacturer.includes("Celli Group") || spillatore.suggestedManufacturer.includes("Vin Service"), "Celli Group o Vin Service");
assert.ok(spillatore.safetyChecks.some((c) => c.code === "SPILLATORE_VASCHETTA_LAVABICCHIERI_UNI1717" && c.normReference.includes("UNI EN 1717")), "Lavabicchieri a disconnessione UNI EN 1717");

const bombole = catalogBarExact.machines.find((m) => m.machineKey === "bombole_co2_azoto_spillatura")!;
assert.ok(bombole.safetyChecks.some((c) => c.code === "BOMBOLE_CO2_CATENELLE_ANTICADUTA_PARETE" && c.normReference.includes("Titolo XI")), "Catenelle anticaduta verticali D.Lgs. 81/08 Titolo XI");
assert.ok(bombole.safetyChecks.some((c) => c.code === "BOMBOLE_CO2_RILEVATORE_GAS_ALLARME_ANTIASFISSIA" && c.question.includes("anti-asfissia")), "Rilevatore fughe CO2 anti-asfissia");

const piastraPanini = catalogBarExact.machines.find((m) => m.machineKey === "piastra_panini_tostiera")!;
assert.ok(piastraPanini.suggestedManufacturer.includes("Sirman") || piastraPanini.suggestedManufacturer.includes("Milan Toast") || piastraPanini.suggestedManufacturer.includes("Spidocook"), "Sirman, Milan Toast o Spidocook");
assert.ok(piastraPanini.safetyChecks.some((c) => c.code === "PIASTRA_PANINI_PIANI_GHISA_VETROCERAMICA_MOCA"), "Piani ghisa/vetroceramica MOCA");
assert.ok(piastraPanini.safetyChecks.some((c) => c.code === "PIASTRA_PANINI_MANIGLIA_TERMOISOLANTE_ANTIUSTIONE"), "Maniglia termoisolante anti-ustione");

const speedOven = catalogBarExact.machines.find((m) => m.machineKey === "forno_microonde_speedoven")!;
assert.ok(speedOven.suggestedManufacturer.includes("Merrychef") || speedOven.suggestedManufacturer.includes("Menumaster"), "Merrychef o Menumaster");
assert.ok(speedOven.safetyChecks.some((c) => c.code === "SPEEDOVEN_TRIPLO_INTERBLOCCO_PORTA_MICROONDE"), "Triplo interblocco porta");
assert.ok(speedOven.safetyChecks.some((c) => c.code === "SPEEDOVEN_CATALIZZATORE_FUMI_SENZA_CANNA_FUMARIA"), "Catalizzatore fumi interno");

const affettatriceBar = catalogBarExact.machines.find((m) => m.machineKey === "affettatrice_gravita_bar")!;
assert.ok(affettatriceBar.suggestedManufacturer.includes("Berkel") || affettatriceBar.suggestedManufacturer.includes("Sirman"), "Berkel o Sirman");
assert.ok(affettatriceBar.safetyChecks.some((c) => c.code === "AFFETTATRICE_BAR_ANELLO_FISSO_PARALAMA_360" && c.normReference.includes("UNI EN 1974")), "Anello fisso 360° UNI EN 1974");
assert.ok(affettatriceBar.safetyChecks.some((c) => c.code === "AFFETTATRICE_BAR_BLOCCO_VELA_SPESSORE_ZERO"), "Blocco vela spessore zero");
assert.ok(affettatriceBar.safetyChecks.some((c) => c.code === "AFFETTATRICE_BAR_RELE_MINIMA_TENSIONE_NVR"), "Relè di minima tensione NVR");

const vetrinaSnack = catalogBarExact.machines.find((m) => m.machineKey === "vetrina_snack_refrigerata")!;
assert.ok(vetrinaSnack.suggestedManufacturer.includes("Afinox") || vetrinaSnack.suggestedManufacturer.includes("IFI") || vetrinaSnack.suggestedManufacturer.includes("Enofrigo"), "Afinox, IFI o Enofrigo");
assert.ok(vetrinaSnack.safetyChecks.some((c) => c.code === "VETRINA_SNACK_CRISTALLI_CURVI_PARATOIE_HACCP"), "Cristalli curvi panoramici parafiato");

const frigoBar = catalogBarExact.machines.find((m) => m.machineKey === "armadio_frigo_bar_bevande")!;
assert.ok(frigoBar.suggestedManufacturer.includes("Friulinox") || frigoBar.suggestedManufacturer.includes("Liebherr") || frigoBar.suggestedManufacturer.includes("Polaris"), "Friulinox, Liebherr o Polaris");
assert.ok(frigoBar.safetyChecks.some((c) => c.code === "FRIGO_BAR_PORTE_DOPPIO_VETRO_GUARNIZIONI_MAGNETICHE"), "Doppio vetro e guarnizioni magnetiche");

const spremiagrumi = catalogBarExact.machines.find((m) => m.machineKey === "spremiagrumi_centrifuga_bar")!;
assert.ok(spremiagrumi.suggestedManufacturer.includes("Ceado") || spremiagrumi.suggestedManufacturer.includes("Santos") || spremiagrumi.suggestedManufacturer.includes("Zumex"), "Ceado, Santos o Zumex");
assert.ok(spremiagrumi.safetyChecks.some((c) => c.code === "SPREMIAGRUMI_LEVA_PRESSORE_MICRO_UNI12852" && c.normReference.includes("UNI EN 12852")), "Leva pressore micro UNI EN 12852");

const addolcitore = catalogBarExact.machines.find((m) => m.machineKey === "impianto_addolcitore_acque")!;
assert.ok(addolcitore.suggestedManufacturer.includes("BWT") || addolcitore.suggestedManufacturer.includes("Brita"), "BWT water+more o Brita Purity");
assert.ok(addolcitore.safetyChecks.some((c) => c.code === "ADDOLCITORE_FILTRI_RESINE_POTABILITA_DLGS18_2023" && c.normReference.includes("18/2023")), "Potabilità D.Lgs. 18/2023");
assert.ok(addolcitore.safetyChecks.some((c) => c.code === "ADDOLCITORE_VALVOLA_ANTIRIFLUSSO_UNI1717" && c.normReference.includes("UNI EN 1717")), "Antiriflusso UNI EN 1717");

// -------------------------------------------------------------
// Test 37: Associazione 1-a-1 ambienti Step 2 Bar (env-bar-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 37: Verifica associazione ambienti Step 2 Bar (env-bar-*) -> Step 4 Macchine");
const barEnvironments = [
  { id: "env-bar-banco-caffetteria", name: "Banco Somministrazione, Caffetteria e Punto Cassa", category: "sales_office" },
  { id: "env-bar-cocktail-station", name: "Cocktail Station e Banco Mixology", category: "sales_office" },
  { id: "env-bar-retrobanco-snack", name: "Retrobanco Preparazione Snack e Tavola Fredda", category: "cucina" },
  { id: "env-bar-spillatura-co2", name: "Postazione Spillatura Birra e Vano Tecnico Bombole CO2", category: "tecnici_esterno" },
  { id: "env-bar-celle-frigo", name: "Celle Frigorifere e Deposito Bevande", category: "warehouse" },
  { id: "env-bar-tecnico-trattamento-acque", name: "Vano Tecnico Addolcitore e Plonge Lavaggio Bicchieri", category: "services" },
];

const suggestedWithBarEnvs = getSuggestedMachinesForEnvironmentsAndAteco(barEnvironments, "56.30");
assert.equal(suggestedWithBarEnvs.length, 16, "Tutte le 16 macchine devono essere raccomandate e collegate ai 6 ambienti censiti");

const bancoBarMachines = suggestedWithBarEnvs.filter((m) => m.targetEnvironmentId === "env-bar-banco-caffetteria");
assert.equal(bancoBarMachines.length, 6, "env-bar-banco-caffetteria deve associare 6 macchine");
assert.ok(bancoBarMachines.some((m) => m.machineKey === "macchina_caffe_bar"));
assert.ok(bancoBarMachines.some((m) => m.machineKey === "macinadosatore_caffe_ondemand"));
assert.ok(bancoBarMachines.some((m) => m.machineKey === "lavabicchieri_bar_sottobanco"));
assert.ok(bancoBarMachines.some((m) => m.machineKey === "fabbricatore_ghiaccio_bar"));
assert.ok(bancoBarMachines.some((m) => m.machineKey === "vetrina_snack_refrigerata"));
assert.ok(bancoBarMachines.some((m) => m.machineKey === "spremiagrumi_centrifuga_bar"));

const cocktailBarMachines = suggestedWithBarEnvs.filter((m) => m.targetEnvironmentId === "env-bar-cocktail-station");
assert.equal(cocktailBarMachines.length, 3, "env-bar-cocktail-station deve associare 3 macchine");
assert.ok(cocktailBarMachines.some((m) => m.machineKey === "cocktail_station_bar"));
assert.ok(cocktailBarMachines.some((m) => m.machineKey === "blender_frullatore_cocktail"));
assert.ok(cocktailBarMachines.some((m) => m.machineKey === "tritaghiaccio_professionale_bar"));

const snackBarMachines = suggestedWithBarEnvs.filter((m) => m.targetEnvironmentId === "env-bar-retrobanco-snack");
assert.equal(snackBarMachines.length, 3, "env-bar-retrobanco-snack deve associare 3 macchine");
assert.ok(snackBarMachines.some((m) => m.machineKey === "piastra_panini_tostiera"));
assert.ok(snackBarMachines.some((m) => m.machineKey === "forno_microonde_speedoven"));
assert.ok(snackBarMachines.some((m) => m.machineKey === "affettatrice_gravita_bar"));

const spillaturaBarMachines = suggestedWithBarEnvs.filter((m) => m.targetEnvironmentId === "env-bar-spillatura-co2");
assert.equal(spillaturaBarMachines.length, 2, "env-bar-spillatura-co2 deve associare 2 macchine");
assert.ok(spillaturaBarMachines.some((m) => m.machineKey === "spillatore_birra_bevande"));
assert.ok(spillaturaBarMachines.some((m) => m.machineKey === "bombole_co2_azoto_spillatura"));

const celleBarMachines = suggestedWithBarEnvs.filter((m) => m.targetEnvironmentId === "env-bar-celle-frigo");
assert.equal(celleBarMachines.length, 1, "env-bar-celle-frigo deve associare 1 macchina frigo bevande");
assert.ok(celleBarMachines.some((m) => m.machineKey === "armadio_frigo_bar_bevande"));

const tecnicoBarMachines = suggestedWithBarEnvs.filter((m) => m.targetEnvironmentId === "env-bar-tecnico-trattamento-acque");
assert.equal(tecnicoBarMachines.length, 1, "env-bar-tecnico-trattamento-acque deve associare addolcitore acque");
assert.ok(tecnicoBarMachines.some((m) => m.machineKey === "impianto_addolcitore_acque"));

// Verifica anche ambienti con alias deposito-bevande e plonge-lavaggio
const depositoBevandeTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-bar-deposito-bevande", name: "Magazzino e Deposito Fusti e Bottiglie", category: "warehouse" }],
  "56.30",
);
const depBarLinked = depositoBevandeTest.filter((m) => m.targetEnvironmentId === "env-bar-deposito-bevande");
assert.equal(depBarLinked.length, 1, "env-bar-deposito-bevande deve associare armadio_frigo_bar_bevande");
assert.ok(depBarLinked.some((m) => m.machineKey === "armadio_frigo_bar_bevande"));

const plongeLavaggioTest = getSuggestedMachinesForEnvironmentsAndAteco(
  [{ id: "env-bar-plonge-lavaggio", name: "Zona Plonge e Lavaggio Calici", category: "services" }],
  "56.30",
);
const plongeBarLinked = plongeLavaggioTest.filter((m) => m.targetEnvironmentId === "env-bar-plonge-lavaggio");
assert.equal(plongeBarLinked.length, 1, "env-bar-plonge-lavaggio deve associare impianto_addolcitore_acque");
assert.ok(plongeBarLinked.some((m) => m.machineKey === "impianto_addolcitore_acque"));

// -------------------------------------------------------------
// Test 38: Risoluzione solo su codice ATECO senza locali censiti (Bar / Caffetteria 56.30)
// -------------------------------------------------------------
console.log("Test 38: Integrazione automatica macchine per ATECO 56.30 senza ambienti preventivi");
const suggestedBarOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "56.30");
assert.equal(suggestedBarOnlyAteco.length, 16, "Devono essere suggerite tutte le 16 macchine del bar / caffetteria");
assert.ok(
  suggestedBarOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per varianti di codice ATECO ("56.30.00", "56.3", "5630", "563")
for (const code of ["56.30.00", "56.3", "5630", "563"]) {
  const fallbackBarRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackBarRes.length, 16, `ATECO variant '${code}' deve restituire tutte le 16 macchine`);
  assert.ok(fallbackBarRes.every((m) => m.sourceReason === "ateco"));
}

// -------------------------------------------------------------
// Test 39: Priorità e risoluzione catalogo ATECO Hotel e Strutture Ricettive (55.10.00 / 55.10.0 / 55.10 / 55.1)
// -------------------------------------------------------------
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 55.10 Hotel e Strutture Ricettive) ===");
console.log("Test 39: Verifica priorità catalogo ATECO per Hotel, Alberghi, Resort e Strutture Ricettive (55.10.00 / 55.10 / 55.1 / 551000 / 55100 / 5510 / 551)");
const catalogHotelExact = getSectorMachineCatalogForAteco("55.10.00");
assert.equal(catalogHotelExact.sectorKey, "hotel_strutture_ricettive", "ATECO 55.10.00 deve restituire hotel_strutture_ricettive");
assert.ok(catalogHotelExact.sectorLabel.includes("Hotel"), "L'etichetta del catalogo deve includere Hotel");
assert.ok(catalogHotelExact.sectorLabel.includes("Alberghi"), "L'etichetta del catalogo deve includere Alberghi");
assert.ok(catalogHotelExact.sectorLabel.includes("Resort"), "L'etichetta del catalogo deve includere Resort");
assert.ok(catalogHotelExact.sectorLabel.includes("Strutture Ricettive"), "L'etichetta del catalogo deve includere Strutture Ricettive");

for (const variant of ["55.10.00", "55.10.0", "55.10", "55.1", "551000", "55100", "5510", "551"]) {
  const hotelVar = getSectorMachineCatalogForAteco(variant);
  assert.equal(hotelVar.sectorKey, "hotel_strutture_ricettive", `Variante '${variant}' deve restituire hotel_strutture_ricettive`);
}

// Posizionamento: subito dopo bar_caffetteria e prima di ostello_residence e bnb_affittacamere
const barIdxHotel = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "bar_caffetteria");
const hotelIdx = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "hotel_strutture_ricettive");
const ostelloIdxHotel = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ostello_residence");
const bnbIdxHotel = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "bnb_affittacamere");
const ristGenIdxHotel = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");
assert.ok(barIdxHotel !== -1, "Settore bar_caffetteria deve esistere");
assert.ok(hotelIdx !== -1, "Settore hotel_strutture_ricettive deve esistere");
assert.ok(ostelloIdxHotel !== -1, "Settore ostello_residence deve esistere");
assert.ok(bnbIdxHotel !== -1, "Settore bnb_affittacamere deve esistere");
assert.ok(ristGenIdxHotel !== -1, "Settore generic ristorazione_alimentare deve esistere");
assert.equal(hotelIdx, barIdxHotel + 1, "hotel_strutture_ricettive deve seguire immediatamente bar_caffetteria");
assert.equal(hotelIdx + 1, ostelloIdxHotel, "hotel_strutture_ricettive deve precedere immediatamente ostello_residence nel catalogo");
assert.equal(ostelloIdxHotel + 1, bnbIdxHotel, "ostello_residence deve precedere immediatamente bnb_affittacamere nel catalogo");
assert.equal(bnbIdxHotel + 1, ristGenIdxHotel, "bnb_affittacamere deve precedere immediatamente ristorazione_alimentare nel catalogo");

// -------------------------------------------------------------
// Test 40: Verifica completezza delle 16 macchine professionali per Hotel con modelli reali, corsi e controlli tecnici
// -------------------------------------------------------------
console.log("Test 40: Verifica completezza delle 16 attrezzature professionali con verifiche, corsi e modelli reali");
assert.equal(catalogHotelExact.machines.length, 16, "Il catalogo Hotel deve contenere esattamente 16 macchine");

const expectedHotelMachineKeys = [
  "centrale_antincendio_evac",
  "gruppo_elettrogeno_emergenza",
  "ascensore_passeggeri_hotel",
  "montacarichi_servizio_piani",
  "impianto_dosaggio_biossido_legionella",
  "caldaia_centrale_termica_hotel",
  "centrale_trattamento_aria_uta",
  "lavatrice_industriale_hotel",
  "essiccatore_rotativo_industriale",
  "calandra_mangano_stireria",
  "distributore_bevande_calde_colazione",
  "linea_buffet_calda_induzione",
  "linea_buffet_refrigerata_colazioni",
  "carrelli_housekeeping_piani",
  "monospazzola_lavasciuga_moquette",
  "sanificatore_ozono_perossido",
];

for (const key of expectedHotelMachineKeys) {
  const found = catalogHotelExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Macchina ${key} deve essere presente nel catalogo Hotel / Strutture Ricettive`);
  assert.ok(found.name.length > 5, `Nome macchina ${key} deve essere esaustivo`);
  assert.ok(found.type.length > 5, `Tipologia macchina ${key} deve essere specificata`);
  assert.ok(found.suggestedManufacturer.length > 0, `Produttore suggerito per ${key} deve essere presente`);
  assert.ok(found.suggestedModel.length > 0, `Modello suggerito per ${key} deve essere presente`);
  assert.ok(found.safetyChecks.length >= 3, `Macchina ${key} deve avere almeno 3 controlli di sicurezza`);
  assert.ok(found.training, `Macchina ${key} deve avere un corso di formazione/addestramento associato`);
}

// Verifiche puntuali su modelli reali e controlli tecnici specifici per ciascuna delle 16 macchine:
// 1. Centrale Antincendio & EVAC
const antincendio = catalogHotelExact.machines.find((m) => m.machineKey === "centrale_antincendio_evac")!;
assert.ok(antincendio.suggestedManufacturer.includes("Notifier") || antincendio.suggestedManufacturer.includes("Inim") || antincendio.suggestedManufacturer.includes("Siemens"), "Notifier, Inim o Siemens");
assert.ok(antincendio.suggestedModel.includes("AM-8200") || antincendio.suggestedModel.includes("Previdia") || antincendio.suggestedModel.includes("Cerberus"), "AM-8200, Previdia o Cerberus");
assert.ok(antincendio.safetyChecks.some((c) => c.code === "CENTRALE_ANTINCENDIO_CONFORMITA_EN54_EVAC_ISO7240" && c.normReference.includes("UNI EN 54")), "Conformità EN 54 e EVAC ISO 7240");
assert.ok(antincendio.safetyChecks.some((c) => c.code === "CENTRALE_ANTINCENDIO_VERIFICA_SEMESTRALE_UNI11224" && c.normReference.includes("UNI 11224")), "Verifica semestrale UNI 11224");

// 2. Gruppo Elettrogeno Emergenza
const generatore = catalogHotelExact.machines.find((m) => m.machineKey === "gruppo_elettrogeno_emergenza")!;
assert.ok(generatore.suggestedManufacturer.includes("Pramac") || generatore.suggestedManufacturer.includes("Caterpillar") || generatore.suggestedManufacturer.includes("Bruno"), "Pramac, Caterpillar o Bruno Generators");
assert.ok(generatore.safetyChecks.some((c) => c.code === "GRUPPO_ELETTROGENO_QUADRO_ATS_INTERVENTO_15S" && c.question.includes("15 secondi")), "ATS entro 15s in blackout");
assert.ok(generatore.safetyChecks.some((c) => c.code === "GRUPPO_ELETTROGENO_BACINO_CONTENIMENTO_GASOLIO_110" && c.normReference.includes("13/07/2011")), "Bacino contenimento 110% DM 13/07/2011 Attività 49");

// 3. Ascensore Passeggeri Hotel
const ascensore = catalogHotelExact.machines.find((m) => m.machineKey === "ascensore_passeggeri_hotel")!;
assert.ok(ascensore.suggestedManufacturer.includes("Otis") || ascensore.suggestedManufacturer.includes("Schindler") || ascensore.suggestedManufacturer.includes("Kone"), "Otis, Schindler o Kone");
assert.equal(ascensore.isSubjectToInailCheck, true, "Ascensore passeggeri soggetto a verifiche periodiche biennali");
assert.equal(ascensore.inailFrequencyYears, 2, "Frequenza verifica biennale DPR 162/99");
assert.ok(ascensore.safetyChecks.some((c) => c.code === "ASCENSORE_HOTEL_TELEALLARME_BIDIREZIONALE_EN81_28" && c.normReference.includes("EN 81-28")), "Teleallarme bidirezionale EN 81-28");
assert.ok(ascensore.safetyChecks.some((c) => c.code === "ASCENSORE_HOTEL_VERIFICHE_BIENNALI_DPR162_99" && c.normReference.includes("D.P.R. 162/99")), "Verifiche biennali DPR 162/99");

// 4. Montacarichi Servizio Piani
const montacarichi = catalogHotelExact.machines.find((m) => m.machineKey === "montacarichi_servizio_piani")!;
assert.ok(montacarichi.suggestedManufacturer.includes("Daldoss") || montacarichi.suggestedManufacturer.includes("Kone") || montacarichi.suggestedManufacturer.includes("Schindler"), "Daldoss, Kone o Schindler");
assert.equal(montacarichi.isSubjectToInailCheck, true, "Montacarichi servizio soggetto a verifiche periodiche");
assert.equal(montacarichi.inailFrequencyYears, 2, "Verifica periodica biennale");
assert.ok(montacarichi.safetyChecks.some((c) => c.code === "MONTACARICHI_HOTEL_PARACADUTE_MECCANICO_ROTTURA_FUNI"), "Paracadute meccanico rottura funi");
assert.ok(montacarichi.safetyChecks.some((c) => c.code === "MONTACARICHI_HOTEL_INTERBLOCCO_PORTE_PIANO_DOPPIO_SCATTO"), "Interblocco porte doppio scatto");

// 5. Impianto Dosaggio Biossido Legionella
const legionella = catalogHotelExact.machines.find((m) => m.machineKey === "impianto_dosaggio_biossido_legionella")!;
assert.ok(legionella.suggestedManufacturer.includes("ProMinent") || legionella.suggestedManufacturer.includes("Grundfos") || legionella.suggestedManufacturer.includes("BWT"), "ProMinent, Grundfos o BWT");
assert.ok(legionella.safetyChecks.some((c) => c.code === "DOSAGGIO_LEGIONELLA_PROPORZIONALE_DLGS18_2023" && c.normReference.includes("18/2023")), "Dosaggio proporzionale D.Lgs. 18/2023");
assert.ok(legionella.safetyChecks.some((c) => c.code === "DOSAGGIO_LEGIONELLA_REGISTRO_CAMPIONAMENTI_SEMESTRALI" && c.normReference.includes("07/05/2015")), "Registro legionella e campionamenti semestrali Accordo SR 07/05/2015");

// 6. Caldaia Centrale Termica Hotel
const caldaia = catalogHotelExact.machines.find((m) => m.machineKey === "caldaia_centrale_termica_hotel")!;
assert.ok(caldaia.suggestedManufacturer.includes("Viessmann") || caldaia.suggestedManufacturer.includes("Ferroli") || caldaia.suggestedManufacturer.includes("Riello"), "Viessmann, Ferroli o Riello");
assert.equal(caldaia.isSubjectToInailCheck, true, "Centrale termica > 116 kW soggetta a verifiche INAIL");
assert.equal(caldaia.inailFrequencyYears, 1, "Verifica annuale INAIL rendimento e sicurezza");
assert.ok(caldaia.safetyChecks.some((c) => c.code === "CALDAIA_HOTEL_CIRCUITO_PED_VALVOLE_INAIL" && c.normReference.includes("PED")), "Circuito PED e valvole INAIL");
assert.ok(caldaia.safetyChecks.some((c) => c.code === "CALDAIA_HOTEL_ELETTROVALVOLA_GAS_ESTERNA_RIARMO"), "Elettrovalvola esterna gas a riarmo");

// 7. Centrale Trattamento Aria (UTA)
const uta = catalogHotelExact.machines.find((m) => m.machineKey === "centrale_trattamento_aria_uta")!;
assert.ok(uta.suggestedManufacturer.includes("Daikin") || uta.suggestedManufacturer.includes("Carrier") || uta.suggestedManufacturer.includes("Sabiana"), "Daikin, Carrier o Sabiana");
assert.ok(uta.safetyChecks.some((c) => c.code === "UTA_HOTEL_FILTRI_ALTA_EFFICIENZA_E95_HEPA"), "Filtri e95/HEPA");
assert.ok(uta.safetyChecks.some((c) => c.code === "UTA_HOTEL_SANIFICAZIONE_PERIODICA_LINEE_GUIDA_SALUTE" && c.normReference.includes("Salute")), "Sanificazione canalizzazioni Linee Guida Ministero Salute");

// 8. Lavatrice Industriale Hotel
const lavatrice = catalogHotelExact.machines.find((m) => m.machineKey === "lavatrice_industriale_hotel")!;
assert.ok(lavatrice.suggestedManufacturer.includes("Miele") || lavatrice.suggestedManufacturer.includes("Electrolux") || lavatrice.suggestedManufacturer.includes("Grandimpianti"), "Miele, Electrolux o Grandimpianti");
assert.ok(lavatrice.safetyChecks.some((c) => c.code === "LAVATRICE_HOTEL_MICROINTERRUTTORE_BLOCCO_TERMOELETTRICO" && c.normReference.includes("ISO 10472-2")), "Blocco termoelettrico UNI EN ISO 10472-2");
assert.ok(lavatrice.safetyChecks.some((c) => c.code === "LAVATRICE_HOTEL_DOSATORI_AUTOMATICI_DETERSIVI_CHIMICI"), "Dosatori automatici detersivi");

// 9. Essiccatore Rotativo Industriale
const essiccatore = catalogHotelExact.machines.find((m) => m.machineKey === "essiccatore_rotativo_industriale")!;
assert.ok(essiccatore.suggestedManufacturer.includes("Miele") || essiccatore.suggestedManufacturer.includes("Electrolux") || essiccatore.suggestedManufacturer.includes("Girbau"), "Miele, Electrolux o Girbau");
assert.ok(essiccatore.safetyChecks.some((c) => c.code === "ESSICCATORE_HOTEL_FILTRO_LANUGINE_ALLARME_INTASAMENTO" && c.normReference.includes("ISO 10472-4")), "Filtro lanugine allarme intasamento UNI EN ISO 10472-4");
assert.ok(essiccatore.safetyChecks.some((c) => c.code === "ESSICCATORE_HOTEL_TERMOSTATO_MASSIMA_RIARMO_MANUALE"), "Termostato di massima a riarmo manuale");

// 10. Mangano / Calandra Stireria
const mangano = catalogHotelExact.machines.find((m) => m.machineKey === "calandra_mangano_stireria")!;
assert.ok(mangano.suggestedManufacturer.includes("Grandimpianti") || mangano.suggestedManufacturer.includes("Electrolux") || mangano.suggestedManufacturer.includes("Miele"), "Grandimpianti, Electrolux o Miele");
assert.ok(mangano.safetyChecks.some((c) => c.code === "CALANDRA_HOTEL_BARRA_SALVADITA_BASCULANTE_ISO10472_5" && c.normReference.includes("ISO 10472-5")), "Barra salvadita basculante UNI EN ISO 10472-5");
assert.ok(mangano.safetyChecks.some((c) => c.code === "CALANDRA_HOTEL_PEDALE_COMANDO_AZIONE_MANTENUTA"), "Pedale comando azione mantenuta");

// 11. Distributore Bevande Calde Buffet Colazioni
const distributore = catalogHotelExact.machines.find((m) => m.machineKey === "distributore_bevande_calde_colazione")!;
assert.ok(distributore.suggestedManufacturer.includes("WMF") || distributore.suggestedManufacturer.includes("Franke") || distributore.suggestedManufacturer.includes("Schaerer"), "WMF, Franke o Schaerer");
assert.ok(distributore.safetyChecks.some((c) => c.code === "DISTRIBUTORE_COLAZIONI_BREAK_TANK_DISCONNESSIONE_UNI1717" && c.normReference.includes("UNI EN 1717")), "Dispositivo Break Tank UNI EN 1717");
assert.ok(distributore.safetyChecks.some((c) => c.code === "DISTRIBUTORE_COLAZIONI_EROGATORI_SANIFICABILI_MOCA" && c.normReference.includes("1935/2004")), "Erogatori MOCA 1935/2004");

// 12. Banco Buffet Riscaldato Caldo
const buffetCaldo = catalogHotelExact.machines.find((m) => m.machineKey === "linea_buffet_calda_induzione")!;
assert.ok(buffetCaldo.suggestedManufacturer.includes("Enofrigo") || buffetCaldo.suggestedManufacturer.includes("Afinox") || buffetCaldo.suggestedManufacturer.includes("Scaiola"), "Enofrigo, Afinox o Scaiola");
assert.ok(buffetCaldo.safetyChecks.some((c) => c.code === "BUFFET_CALDO_MANTENIMENTO_65C_HACCP_TERMOSTATO_DIGITALE" && c.question.includes("65°C")), "Mantenimento >= 65°C HACCP");
assert.ok(buffetCaldo.safetyChecks.some((c) => c.code === "BUFFET_CALDO_CRISTALLI_CURVI_PARAFIATO_ANTIAEROSOL"), "Cristalli curvi parafiato antiaerosol");

// 13. Banco Buffet Refrigerato Colazioni
const buffetFreddo = catalogHotelExact.machines.find((m) => m.machineKey === "linea_buffet_refrigerata_colazioni")!;
assert.ok(buffetFreddo.suggestedManufacturer.includes("Enofrigo") || buffetFreddo.suggestedManufacturer.includes("Afinox") || buffetFreddo.suggestedManufacturer.includes("IFI"), "Enofrigo, Afinox o IFI");
assert.ok(buffetFreddo.safetyChecks.some((c) => c.code === "BUFFET_FREDDO_TEMPERATURA_4C_DISPLAY_OSPITI_ALLARME"), "Temperatura +4°C display ospiti allarme HACCP");
assert.ok(buffetFreddo.safetyChecks.some((c) => c.code === "BUFFET_FREDDO_GAS_ECOLOGICO_R290_SBRINAMENTO_AUTOMATICO" && c.title.includes("R290")), "Gas ecologico R290");

// 14. Carrelli Housekeeping Piani
const carrelli = catalogHotelExact.machines.find((m) => m.machineKey === "carrelli_housekeeping_piani")!;
assert.ok(carrelli.suggestedManufacturer.includes("TTS") || carrelli.suggestedManufacturer.includes("Filmop") || carrelli.suggestedManufacturer.includes("IPC"), "TTS Cleaning, Filmop o IPC");
assert.ok(carrelli.safetyChecks.some((c) => c.code === "CARRELLO_HOTEL_TELAIO_TECNOPOLIMERO_FRENO_STAZIONAMENTO"), "Freno stazionamento a pedale");
assert.ok(carrelli.safetyChecks.some((c) => c.code === "CARRELLO_HOTEL_VANI_CHIUSI_SERRATURA_CHIMICI" && c.normReference.includes("Titolo IX")), "Vani chiusi serratura chimici D.Lgs. 81/08");

// 15. Monospazzola & Lavasciuga Moquette
const monospazzola = catalogHotelExact.machines.find((m) => m.machineKey === "monospazzola_lavasciuga_moquette")!;
assert.ok(monospazzola.suggestedManufacturer.includes("Comac") || monospazzola.suggestedManufacturer.includes("Nilfisk") || monospazzola.suggestedManufacturer.includes("Kärcher"), "Comac, Nilfisk o Kärcher");
assert.ok(monospazzola.safetyChecks.some((c) => c.code === "MONOSPAZZOLA_HOTEL_TIMONE_UOMO_PRESENTE_DOPPIO_INTERRUTTORE"), "Timone uomo presente doppio interruttore");
assert.ok(monospazzola.safetyChecks.some((c) => c.code === "MONOSPAZZOLA_HOTEL_ISOLAMENTO_IPX4_CAVO_ALTA_VISIBILITA" && c.title.includes("IPX4")), "Grado isolamento IPX4");

// 16. Sanificatore Ozono / Perossido
const ozono = catalogHotelExact.machines.find((m) => m.machineKey === "sanificatore_ozono_perossido")!;
assert.ok(ozono.suggestedManufacturer.includes("Ozonosan") || ozono.suggestedManufacturer.includes("Sanity") || ozono.suggestedManufacturer.includes("Caleffi"), "Ozonosan, Sanity System o Caleffi");
assert.ok(ozono.safetyChecks.some((c) => c.code === "SANIFICATORE_HOTEL_TIMER_DIGITALE_ALLARME_RICONVERSIONE"), "Timer digitale e riconversione catalitica rapida");
assert.ok(ozono.safetyChecks.some((c) => c.code === "SANIFICATORE_HOTEL_MARCATURA_CE_PROCEDURE_SICUREZZA" && c.normReference.includes("81/2008")), "Marcatura CE e procedure sicurezza D.Lgs. 81/08");

// -------------------------------------------------------------
// Test 41: Associazione 1-a-1 ambienti Step 2 Hotel (env-hotel-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 41: Verifica associazione ambienti Step 2 Hotel (env-hotel-*) -> Step 4 Macchine");
const hotelEnvironments = [
  { id: "env-hotel-reception-hall", name: "Reception, Hall e Portineria", category: "reception" },
  { id: "env-hotel-camere-piano", name: "Camere Ospiti e Corridoi Piani", category: "rooms" },
  { id: "env-hotel-sala-colazioni", name: "Sala Buffet Colazioni", category: "dining" },
  { id: "env-hotel-office-cucina-colazioni", name: "Office e Preparazione Colazioni", category: "kitchen" },
  { id: "env-hotel-lavanderia-stireria", name: "Lavanderia e Stireria Interna", category: "laundry" },
  { id: "env-hotel-deposito-housekeeping", name: "Deposito Housekeeping e Biancheria", category: "storage" },
  { id: "env-hotel-centrale-idrica-legionella", name: "Centrale Idrica e Sanificazione Anti-Legionella", category: "technical" },
  { id: "env-hotel-centrale-termica-clima", name: "Centrale Termica e Trattamento Aria (UTA)", category: "technical" },
  { id: "env-hotel-vano-gruppo-elettrogeno", name: "Locale Gruppo Elettrogeno di Emergenza", category: "technical" },
  { id: "env-hotel-vani-ascensori-montacarichi", name: "Vani Ascensori e Montacarichi di Servizio", category: "technical" },
];

const suggestedWithHotelEnvs = getSuggestedMachinesForEnvironmentsAndAteco(hotelEnvironments, "55.10.00");

// 1. Reception / Hall -> 2 macchine (centrale_antincendio_evac, ascensore_passeggeri_hotel)
const receptionMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-reception-hall");
assert.equal(receptionMachines.length, 2, "env-hotel-reception-hall deve associare 2 macchine");
assert.ok(receptionMachines.some((m) => m.machineKey === "centrale_antincendio_evac"), "centrale_antincendio_evac in reception");
assert.ok(receptionMachines.some((m) => m.machineKey === "ascensore_passeggeri_hotel"), "ascensore_passeggeri_hotel in reception");

// 2. Camere Piano -> 2 macchine (centrale_antincendio_evac, sanificatore_ozono_perossido)
const camereMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-camere-piano");
assert.equal(camereMachines.length, 2, "env-hotel-camere-piano deve associare 2 macchine");
assert.ok(camereMachines.some((m) => m.machineKey === "centrale_antincendio_evac"), "centrale_antincendio_evac in camere");
assert.ok(camereMachines.some((m) => m.machineKey === "sanificatore_ozono_perossido"), "sanificatore_ozono_perossido in camere");

// 3. Sala Colazioni -> 3 macchine (distributore_bevande_calde_colazione, linea_buffet_calda_induzione, linea_buffet_refrigerata_colazioni)
const colazioniMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-sala-colazioni");
assert.equal(colazioniMachines.length, 3, "env-hotel-sala-colazioni deve associare 3 macchine");
assert.ok(colazioniMachines.some((m) => m.machineKey === "distributore_bevande_calde_colazione"), "distributore colazioni");
assert.ok(colazioniMachines.some((m) => m.machineKey === "linea_buffet_calda_induzione"), "buffet caldo");
assert.ok(colazioniMachines.some((m) => m.machineKey === "linea_buffet_refrigerata_colazioni"), "buffet freddo");

// 4. Office Cucina Colazioni -> 2 macchine (distributore_bevande_calde_colazione, linea_buffet_calda_induzione)
const officeMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-office-cucina-colazioni");
assert.equal(officeMachines.length, 2, "env-hotel-office-cucina-colazioni deve associare 2 macchine");
assert.ok(officeMachines.some((m) => m.machineKey === "distributore_bevande_calde_colazione"), "distributore bevande");
assert.ok(officeMachines.some((m) => m.machineKey === "linea_buffet_calda_induzione"), "linea buffet calda");

// 5. Lavanderia Stireria -> 3 macchine (lavatrice_industriale_hotel, essiccatore_rotativo_industriale, calandra_mangano_stireria)
const lavanderiaMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-lavanderia-stireria");
assert.equal(lavanderiaMachines.length, 3, "env-hotel-lavanderia-stireria deve associare 3 macchine");
assert.ok(lavanderiaMachines.some((m) => m.machineKey === "lavatrice_industriale_hotel"), "lavatrice industriale");
assert.ok(lavanderiaMachines.some((m) => m.machineKey === "essiccatore_rotativo_industriale"), "essiccatore rotativo");
assert.ok(lavanderiaMachines.some((m) => m.machineKey === "calandra_mangano_stireria"), "calandra mangano");

// 6. Deposito Housekeeping -> 2 macchine (carrelli_housekeeping_piani, monospazzola_lavasciuga_moquette)
const hkMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-deposito-housekeeping");
assert.equal(hkMachines.length, 2, "env-hotel-deposito-housekeeping deve associare 2 macchine");
assert.ok(hkMachines.some((m) => m.machineKey === "carrelli_housekeeping_piani"), "carrelli housekeeping");
assert.ok(hkMachines.some((m) => m.machineKey === "monospazzola_lavasciuga_moquette"), "monospazzola");

// 7. Centrale Idrica Legionella -> 1 macchina (impianto_dosaggio_biossido_legionella)
const idricaMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-centrale-idrica-legionella");
assert.equal(idricaMachines.length, 1, "env-hotel-centrale-idrica-legionella deve associare 1 macchina");
assert.ok(idricaMachines.some((m) => m.machineKey === "impianto_dosaggio_biossido_legionella"), "impianto dosaggio biossido legionella");

// 8. Centrale Termica Clima -> 2 macchine (caldaia_centrale_termica_hotel, centrale_trattamento_aria_uta)
const termicaMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-centrale-termica-clima");
assert.equal(termicaMachines.length, 2, "env-hotel-centrale-termica-clima deve associare 2 macchine");
assert.ok(termicaMachines.some((m) => m.machineKey === "caldaia_centrale_termica_hotel"), "caldaia centrale termica");
assert.ok(termicaMachines.some((m) => m.machineKey === "centrale_trattamento_aria_uta"), "centrale UTA");

// 9. Vano Gruppo Elettrogeno -> 1 macchina (gruppo_elettrogeno_emergenza)
const elettrogenoMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-vano-gruppo-elettrogeno");
assert.equal(elettrogenoMachines.length, 1, "env-hotel-vano-gruppo-elettrogeno deve associare 1 macchina");
assert.ok(elettrogenoMachines.some((m) => m.machineKey === "gruppo_elettrogeno_emergenza"), "gruppo elettrogeno emergenza");

// 10. Vani Ascensori e Montacarichi -> 2 macchine (ascensore_passeggeri_hotel, montacarichi_servizio_piani)
const ascMontMachines = suggestedWithHotelEnvs.filter((m) => m.targetEnvironmentId === "env-hotel-vani-ascensori-montacarichi");
assert.equal(ascMontMachines.length, 2, "env-hotel-vani-ascensori-montacarichi deve associare 2 macchine");
assert.ok(ascMontMachines.some((m) => m.machineKey === "ascensore_passeggeri_hotel"), "ascensore passeggeri");
assert.ok(ascMontMachines.some((m) => m.machineKey === "montacarichi_servizio_piani"), "montacarichi servizio piani");

// -------------------------------------------------------------
// Test 42: Risoluzione solo su codice ATECO senza locali censiti (Hotel / Strutture Ricettive 55.10.00)
// -------------------------------------------------------------
console.log("Test 42: Integrazione automatica macchine per ATECO 55.10.00 senza ambienti preventivi");
const suggestedHotelOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "55.10.00");
assert.equal(suggestedHotelOnlyAteco.length, 16, "Devono essere suggerite tutte le 16 macchine dell'hotel");
assert.ok(
  suggestedHotelOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per tutte le varianti di codice ATECO ("55.10.00", "55.10.0", "55.10", "55.1", "551000", "55100", "5510", "551")
for (const code of ["55.10.00", "55.10.0", "55.10", "55.1", "551000", "55100", "5510", "551"]) {
  const fallbackHotelRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackHotelRes.length, 16, `ATECO variant '${code}' deve restituire tutte le 16 macchine`);
  assert.ok(fallbackHotelRes.every((m) => m.sourceReason === "ateco"), `Tutte le macchine con ATECO variant '${code}' devono avere sourceReason === 'ateco'`);
}

// -------------------------------------------------------------
// === INIZIO TEST normativeMachineCatalog (ATECO 55.20.51 Bed & Breakfast e Affittacamere) ===
// -------------------------------------------------------------
console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 55.20.51 B&B, Affittacamere e Guest House) ===");

// -------------------------------------------------------------
// Test 43: Priorità e risoluzione catalogo ATECO per B&B, Affittacamere e Guest House (55.20.51 / 55.20.5 / 55.20 / 55.2)
// -------------------------------------------------------------
console.log("Test 43: Verifica priorità catalogo ATECO per B&B, Affittacamere, Guest House e Room Rental (55.20.51 / 55.20 / 55.2)");
const catalogBnbExact = getSectorMachineCatalogForAteco("55.20.51");
assert.equal(catalogBnbExact.sectorKey, "bnb_affittacamere", "ATECO 55.20.51 deve restituire bnb_affittacamere");
assert.ok(catalogBnbExact.sectorLabel.includes("Bed & Breakfast"), "L'etichetta del catalogo deve includere Bed & Breakfast");
assert.ok(catalogBnbExact.sectorLabel.includes("Affittacamere"), "L'etichetta del catalogo deve includere Affittacamere");

for (const variant of ["55.20.51", "55.20.5", "55.20", "55.2", "552051", "55205", "5520", "552"]) {
  const bnbVar = getSectorMachineCatalogForAteco(variant);
  assert.equal(bnbVar.sectorKey, "bnb_affittacamere", `Variante '${variant}' deve restituire bnb_affittacamere`);
}

// Posizionamento: subito dopo ostello_residence e prima di ristorazione_alimentare
const hotelIdxBnb = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "hotel_strutture_ricettive");
const ostelloIdxBnb = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ostello_residence");
const bnbIdxCheck = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "bnb_affittacamere");
const ristGenIdxBnb = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ristorazione_alimentare");
assert.ok(hotelIdxBnb !== -1, "Settore hotel_strutture_ricettive deve esistere");
assert.ok(ostelloIdxBnb !== -1, "Settore ostello_residence deve esistere");
assert.ok(bnbIdxCheck !== -1, "Settore bnb_affittacamere deve esistere");
assert.ok(ristGenIdxBnb !== -1, "Settore generic ristorazione_alimentare deve esistere");
assert.equal(ostelloIdxBnb, hotelIdxBnb + 1, "ostello_residence deve seguire immediatamente hotel_strutture_ricettive");
assert.equal(bnbIdxCheck, ostelloIdxBnb + 1, "bnb_affittacamere deve seguire immediatamente ostello_residence");
assert.equal(bnbIdxCheck + 1, ristGenIdxBnb, "bnb_affittacamere deve precedere immediatamente ristorazione_alimentare");

// -------------------------------------------------------------
// Test 44: Verifica completezza delle 16 macchine professionali per B&B con modelli reali, verifiche e corsi
// -------------------------------------------------------------
console.log("Test 44: Verifica completezza delle 16 macchine professionali per B&B con modelli reali, corsi e verifiche tecniche");
assert.equal(catalogBnbExact.machines.length, 16, "Il catalogo B&B deve contenere esattamente 16 macchine");

const expectedBnbMachineKeys = [
  "macchina_caffe_capsule_grani_bnb",
  "bollitore_tostapane_buffet_bnb",
  "vetrina_refrigerata_snack_bnb",
  "spremiagrumi_centrifuga_compatta",
  "lavastoviglie_termodisinfezione_bnb",
  "forno_microonde_grill_bnb",
  "lavatrice_vapore_igienizzante_bnb",
  "asciugatrice_pompa_calore_bnb",
  "ferro_generatore_vapore_caldaia",
  "aspirapolvere_filtro_hepa_bnb",
  "generatore_ozono_sanificazione_bnb",
  "lavasciuga_pavimenti_compatta_bnb",
  "caldaia_murale_condensazione_acs",
  "centralina_rilevazione_fumi_bnb",
  "serrature_elettroniche_smartlock",
  "carrello_housekeeping_compatto_bnb",
];

for (const key of expectedBnbMachineKeys) {
  const found = catalogBnbExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Macchina ${key} deve essere presente nel catalogo B&B / Affittacamere`);
  assert.ok(found.name.length > 5, `Nome macchina ${key} deve essere esaustivo`);
  assert.ok(found.type.length > 5, `Tipologia macchina ${key} deve essere specificata`);
  assert.ok(found.suggestedManufacturer.length > 0, `Produttore suggerito per ${key} deve essere presente`);
  assert.ok(found.suggestedModel.length > 0, `Modello suggerito per ${key} deve essere presente`);
  assert.equal(found.isSubjectToInailCheck, false, `Macchina ${key} in B&B non è soggetta a verifiche periodiche INAIL All. VII`);
  assert.ok(found.safetyChecks.length >= 3, `Macchina ${key} deve avere almeno 3 controlli di sicurezza`);
  assert.ok(found.training, `Macchina ${key} deve avere un corso di formazione/addestramento associato`);
}

// Verifiche puntuali su modelli reali e controlli tecnici specifici per ciascuna delle 16 macchine:
// 1. Macchina Caffè Capsule / Grani da Buffet
const caffeBnb = catalogBnbExact.machines.find((m) => m.machineKey === "macchina_caffe_capsule_grani_bnb")!;
assert.ok(caffeBnb.suggestedManufacturer.includes("De Longhi") || caffeBnb.suggestedManufacturer.includes("Saeco") || caffeBnb.suggestedManufacturer.includes("Jura"), "De Longhi, Saeco o Jura");
assert.ok(caffeBnb.suggestedModel.includes("Magnifica S") || caffeBnb.suggestedModel.includes("Royal") || caffeBnb.suggestedModel.includes("Jura E8"), "Magnifica S, Royal o Jura E8");
assert.ok(caffeBnb.safetyChecks.some((c) => c.code === "BNB_CAFFE_LANCIA_VAPORE_LAVAGGIO_TERMICO" && c.title.includes("Lancia Vapore")), "Lancia vapore con lavaggio termico");
assert.ok(caffeBnb.safetyChecks.some((c) => c.code === "BNB_CAFFE_SERBATOIO_MOCA_SANIFICABILE" && c.normReference.includes("1935/2004")), "Serbatoio conforme MOCA 1935/2004");
assert.equal(caffeBnb.training.courseCode, "FORMAZ_HACCP_COLAZIONI_BNB", "Corso HACCP colazioni B&B");

// 2. Set Elettrico Buffet: Bollitore e Tostapane
const bollitoreBnb = catalogBnbExact.machines.find((m) => m.machineKey === "bollitore_tostapane_buffet_bnb")!;
assert.ok(bollitoreBnb.suggestedManufacturer.includes("Smeg") || bollitoreBnb.suggestedManufacturer.includes("Sirman") || bollitoreBnb.suggestedManufacturer.includes("Dualit"), "Smeg, Sirman o Dualit");
assert.ok(bollitoreBnb.suggestedModel.includes("Dualit Classic") || bollitoreBnb.suggestedModel.includes("Sirman") || bollitoreBnb.suggestedModel.includes("KLF03"), "Dualit Classic, Sirman o KLF03");
assert.ok(bollitoreBnb.safetyChecks.some((c) => c.code === "BNB_BOLLITORE_SPEGNIMENTO_AUTO_SECCO" && c.question.includes("secco")), "Spegnimento automatico e protezione funzionamento a secco");
assert.ok(bollitoreBnb.safetyChecks.some((c) => c.code === "BNB_TOSTAPANE_CASSETTO_BRICIOLE_ESTRAIBILE" && c.normReference.includes("02/09/2021")), "Cassetto raccoglibriciole estraibile prevenzione incendi");

// 3. Mini-Vetrina Refrigerata da Banco (+4°C)
const vetrinaBnb = catalogBnbExact.machines.find((m) => m.machineKey === "vetrina_refrigerata_snack_bnb")!;
assert.ok(vetrinaBnb.suggestedManufacturer.includes("Liebherr") || vetrinaBnb.suggestedManufacturer.includes("Polar") || vetrinaBnb.suggestedManufacturer.includes("Forcar"), "Liebherr, Polar o Forcar");
assert.ok(vetrinaBnb.safetyChecks.some((c) => c.code === "BNB_VETRINA_TERMOSTATO_DIGITALE_DISPLAY_HACCP" && c.question.includes("HACCP")), "Termostato digitale con display HACCP");
assert.ok(vetrinaBnb.safetyChecks.some((c) => c.code === "BNB_VETRINA_DOPPIO_VETRO_TEMPERATO_SICUREZZA" && c.normReference.includes("12150")), "Doppio vetro temperato UNI EN 12150");

// 4. Spremiagrumi Elettrico Compatto da Buffet
const spremiBnb = catalogBnbExact.machines.find((m) => m.machineKey === "spremiagrumi_centrifuga_compatta")!;
assert.ok(spremiBnb.suggestedManufacturer.includes("Ceado") || spremiBnb.suggestedManufacturer.includes("Santos") || spremiBnb.suggestedManufacturer.includes("Sirman"), "Ceado, Santos o Sirman");
assert.ok(spremiBnb.suggestedModel.includes("S98") || spremiBnb.suggestedModel.includes("Santos 11") || spremiBnb.suggestedModel.includes("Apollo"), "S98, Santos 11 o Apollo");
assert.ok(spremiBnb.safetyChecks.some((c) => c.code === "BNB_SPREMIAGRUMI_MICROINTERRUTTORE_LEVA_UNI12852" && c.normReference.includes("UNI EN 12852")), "Microinterruttore leva UNI EN 12852");
assert.ok(spremiBnb.safetyChecks.some((c) => c.code === "BNB_SPREMIAGRUMI_COMPONENTI_INOX_MOCA_SMONTABILI" && c.normReference.includes("1935/2004")), "Parti a contatto MOCA 1935/2004");

// 5. Lavastoviglie con Ciclo Igienizzante (75-80°C)
const lavaBnb = catalogBnbExact.machines.find((m) => m.machineKey === "lavastoviglie_termodisinfezione_bnb")!;
assert.ok(lavaBnb.suggestedManufacturer.includes("Miele") || lavaBnb.suggestedManufacturer.includes("Electrolux") || lavaBnb.suggestedManufacturer.includes("Krupps"), "Miele, Electrolux o Krupps");
assert.ok(lavaBnb.safetyChecks.some((c) => c.code === "BNB_LAVASTOVIGLIE_RISCIACQUO_ALTA_TEMP_DIN10512" && c.normReference.includes("DIN 10512")), "Risciacquo alta temperatura DIN 10512");
assert.ok(lavaBnb.safetyChecks.some((c) => c.code === "BNB_LAVASTOVIGLIE_ACQUASTOP_ANTIALAGAMENTO" && c.title.includes("Acquastop")), "Sensore Acquastop antiallagamento");

// 6. Forno a Microonde Professionale Combinato con Grill
const microondeBnb = catalogBnbExact.machines.find((m) => m.machineKey === "forno_microonde_grill_bnb")!;
assert.ok(microondeBnb.suggestedManufacturer.includes("Panasonic") || microondeBnb.suggestedManufacturer.includes("Samsung") || microondeBnb.suggestedManufacturer.includes("Sirman"), "Panasonic, Samsung o Sirman");
assert.ok(microondeBnb.suggestedModel.includes("NE-1027") || microondeBnb.suggestedModel.includes("CM1089") || microondeBnb.suggestedModel.includes("Panasonic"), "NE-1027 o CM1089");
assert.ok(microondeBnb.safetyChecks.some((c) => c.code === "BNB_MICROONDE_DOPPIO_INTERBLOCCO_PORTA"), "Doppio interblocco porta");
assert.ok(microondeBnb.safetyChecks.some((c) => c.code === "BNB_MICROONDE_CAMERA_INOX_SENZA_PIATTO_GIREVOLE" && c.question.includes("piatto girevole")), "Camera inox senza piatto girevole per igiene");

// 7. Lavatrice Professionale a Carica Frontale con Programma Vapore Igienizzante
const lavatriceBnb = catalogBnbExact.machines.find((m) => m.machineKey === "lavatrice_vapore_igienizzante_bnb")!;
assert.ok(lavatriceBnb.suggestedManufacturer.includes("Miele") || lavatriceBnb.suggestedManufacturer.includes("LG") || lavatriceBnb.suggestedManufacturer.includes("Electrolux"), "Miele, LG o Electrolux");
assert.ok(lavatriceBnb.suggestedModel.includes("PWM 300") || lavatriceBnb.suggestedModel.includes("Giant C+") || lavatriceBnb.suggestedModel.includes("MyPRO"), "PWM 300, Giant C+ o MyPRO");
assert.ok(lavatriceBnb.safetyChecks.some((c) => c.code === "BNB_LAVATRICE_BLOCCO_ELETTROMAGNETICO_OBLO" && c.normReference.includes("ISO 10472-2")), "Blocco oblò UNI EN ISO 10472-2");
assert.ok(lavatriceBnb.safetyChecks.some((c) => c.code === "BNB_LAVATRICE_CICLO_TERMICO_VAPORE_60_90C"), "Ciclo termico 60°/90°C vapore igienizzante");
assert.equal(lavatriceBnb.training.courseCode, "FORMAZ_HOUSEKEEPING_BNB", "Corso housekeeping B&B");

// 8. Asciugatrice a Pompa di Calore con Filtro Lanugine
const asciugatriceBnb = catalogBnbExact.machines.find((m) => m.machineKey === "asciugatrice_pompa_calore_bnb")!;
assert.ok(asciugatriceBnb.suggestedManufacturer.includes("Miele") || asciugatriceBnb.suggestedManufacturer.includes("Bosch") || asciugatriceBnb.suggestedManufacturer.includes("LG"), "Miele, Bosch o LG");
assert.ok(asciugatriceBnb.safetyChecks.some((c) => c.code === "BNB_ASCIUGATRICE_DOPPIO_FILTRO_LANUGINE_ALLARME" && c.title.includes("Allarme Visivo Intasamento")), "Doppio filtro lanugine allarme intasamento");
assert.ok(asciugatriceBnb.safetyChecks.some((c) => c.code === "BNB_ASCIUGATRICE_SENSORE_UMIDITA_RESIDUA"), "Sensore umidità residua");

// 9. Asse da Stiro Aspirante con Generatore di Vapore a Caldaia
const stiroBnb = catalogBnbExact.machines.find((m) => m.machineKey === "ferro_generatore_vapore_caldaia")!;
assert.ok(stiroBnb.suggestedManufacturer.includes("Battistella") || stiroBnb.suggestedManufacturer.includes("Lelit") || stiroBnb.suggestedManufacturer.includes("Bieffe"), "Battistella, Lelit o Bieffe");
assert.ok(stiroBnb.safetyChecks.some((c) => c.code === "BNB_STIRO_CALDAIA_PED_PRESSOSTATO_VALVOLA" && c.normReference.includes("PED")), "Caldaia certificata PED e valvola sicurezza");
assert.ok(stiroBnb.safetyChecks.some((c) => c.code === "BNB_STIRO_FERRO_PARAVAPORE_PIASTRA_ISOLATA" && c.question.includes("paravapore")), "Schermo paravapore salvamani");

// 10. Aspirapolvere con Filtro HEPA H13
const aspirapolvereBnb = catalogBnbExact.machines.find((m) => m.machineKey === "aspirapolvere_filtro_hepa_bnb")!;
assert.ok(aspirapolvereBnb.suggestedManufacturer.includes("Lindhaus") || aspirapolvereBnb.suggestedManufacturer.includes("Kärcher") || aspirapolvereBnb.suggestedManufacturer.includes("Numatic"), "Lindhaus, Kärcher o Numatic");
assert.ok(aspirapolvereBnb.safetyChecks.some((c) => c.code === "BNB_ASPIRAPOLVERE_FILTRO_HEPA_H13_ALLERGENI" && c.normReference.includes("UNI EN 1822")), "Filtro HEPA H13 UNI EN 1822");
assert.ok(aspirapolvereBnb.safetyChecks.some((c) => c.code === "BNB_ASPIRAPOLVERE_BASSO_LIVELLO_SONORO_65DB" && c.question.includes("65 dB")), "Rumorosità < 65 dB(A)");

// 11. Generatore di Ozono Compatto per Camere
const ozonoBnb = catalogBnbExact.machines.find((m) => m.machineKey === "generatore_ozono_sanificazione_bnb")!;
assert.ok(ozonoBnb.suggestedManufacturer.includes("Sanity System") || ozonoBnb.suggestedManufacturer.includes("Caleffi") || ozonoBnb.suggestedManufacturer.includes("Ozonosan"), "Sanity System, Caleffi o Ozonosan");
assert.ok(ozonoBnb.safetyChecks.some((c) => c.code === "BNB_OZONO_TIMER_PROGRAMMABILE_RICONVERSIONE" && c.question.includes("riconversione")), "Riconversione catalitica ozono in ossigeno");
assert.ok(ozonoBnb.safetyChecks.some((c) => c.code === "BNB_OZONO_PROTOCOLLO_DIVIETO_ACCESSO_SEGNALATICA" && c.normReference.includes("227")), "Divieto accesso D.Lgs. 81/08 art. 227");

// 12. Lavasciuga Pavimenti Compatta Verticale a Rulli
const lavasciugaBnb = catalogBnbExact.machines.find((m) => m.machineKey === "lavasciuga_pavimenti_compatta_bnb")!;
assert.ok(lavasciugaBnb.suggestedManufacturer.includes("Kärcher") || lavasciugaBnb.suggestedManufacturer.includes("Lindhaus") || lavasciugaBnb.suggestedManufacturer.includes("Fimap"), "Kärcher, Lindhaus o Fimap");
assert.ok(lavasciugaBnb.safetyChecks.some((c) => c.code === "BNB_LAVASCIUGA_ASCIUGATURA_IMMEDIATA_ANTISCIVOLO" && c.normReference.includes("Allegato IV")), "Asciugatura immediata antiscivolo All. IV");
assert.ok(lavasciugaBnb.safetyChecks.some((c) => c.code === "BNB_LAVASCIUGA_IMPUGNATURA_ERGONOMICA_UOMO_PRESENTE" && c.question.includes("uomo presente")), "Impugnatura uomo presente");

// 13. Caldaia Murale a Condensazione con Accumulo ACS Anti-Legionella
const caldaiaBnb = catalogBnbExact.machines.find((m) => m.machineKey === "caldaia_murale_condensazione_acs")!;
assert.ok(caldaiaBnb.suggestedManufacturer.includes("Viessmann") || caldaiaBnb.suggestedManufacturer.includes("Vaillant") || caldaiaBnb.suggestedManufacturer.includes("Bosch"), "Viessmann, Vaillant o Bosch");
assert.ok(caldaiaBnb.safetyChecks.some((c) => c.code === "BNB_CALDAIA_CAMERA_STAGNA_TIPO_C_FUMI_TETTO" && c.normReference.includes("37/2008")), "Camera stagna tipo C D.M. 37/08");
assert.ok(caldaiaBnb.safetyChecks.some((c) => c.code === "BNB_CALDAIA_SHOCK_TERMICO_ANTI_LEGIONELLA_65C" && c.question.includes("65°C")), "Shock termico anti-legionella a 65°C");

// 14. Centralina Rilevazione Fumi e Incendi Wireless
const fumiBnb = catalogBnbExact.machines.find((m) => m.machineKey === "centralina_rilevazione_fumi_bnb")!;
assert.ok(fumiBnb.suggestedManufacturer.includes("Inim") || fumiBnb.suggestedManufacturer.includes("Comelit") || fumiBnb.suggestedManufacturer.includes("Ajax"), "Inim, Comelit o Ajax");
assert.ok(fumiBnb.safetyChecks.some((c) => c.code === "BNB_ANTINCENDIO_SENSORI_FUMO_OTTICI_EN14604_EN54" && c.normReference.includes("UNI EN 14604")), "Rilevatori ottici UNI EN 14604 / EN 54");
assert.ok(fumiBnb.safetyChecks.some((c) => c.code === "BNB_ANTINCENDIO_CENTRALE_BATTERIA_TAMPONE_GSM" && c.question.includes("tampone")), "Batteria tampone di continuità");
assert.equal(fumiBnb.training.courseCode, "FORMAZ_ANTINCENDIO_L1", "Corso antincendio livello 1");

// 15. Sistema di Controllo Accessi Elettronico / Smart Lock
const smartlockBnb = catalogBnbExact.machines.find((m) => m.machineKey === "serrature_elettroniche_smartlock")!;
assert.ok(smartlockBnb.suggestedManufacturer.includes("VingCard") || smartlockBnb.suggestedManufacturer.includes("Nuki") || smartlockBnb.suggestedManufacturer.includes("Yale"), "VingCard, Nuki o Yale");
assert.ok(smartlockBnb.safetyChecks.some((c) => c.code === "BNB_SMARTLOCK_SBLOCCO_ANTIPANICO_MECCANICO_EN179" && c.normReference.includes("UNI EN 179")), "Sblocco antipanico meccanico UNI EN 179");
assert.ok(smartlockBnb.safetyChecks.some((c) => c.code === "BNB_SMARTLOCK_ALIMENTAZIONE_BATTERIA_AVVISO_SCARICA" && c.question.includes("batteria")), "Avviso batteria scarica e soccorso meccanico");

// 16. Carrello Ergonomico Housekeeping
const carrelloBnb = catalogBnbExact.machines.find((m) => m.machineKey === "carrello_housekeeping_compatto_bnb")!;
assert.ok(carrelloBnb.suggestedManufacturer.includes("TTS") || carrelloBnb.suggestedManufacturer.includes("Filmop") || carrelloBnb.suggestedManufacturer.includes("IPC"), "TTS, Filmop o IPC");
assert.ok(carrelloBnb.safetyChecks.some((c) => c.code === "BNB_CARRELLO_SEPARAZIONE_BIANCHERIA_SPORCO_PULITO"), "Separazione biancheria sporca e pulita");
assert.ok(carrelloBnb.safetyChecks.some((c) => c.code === "BNB_CARRELLO_VANO_CHIMICI_CHIUSO_A_CHIAVE" && c.question.includes("chiave")), "Scomparto chiuso con chiave per detergenti");

// -------------------------------------------------------------
// Test 45: Associazione 1-a-1 ambienti Step 2 B&B (env-bnb-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 45: Verifica associazione ambienti Step 2 B&B (env-bnb-*) -> Step 4 Macchine");
const bnbEnvironments = [
  { id: "env-bnb-ingresso-reception", name: "Ingresso, Reception e Check-in B&B", category: "reception" },
  { id: "env-bnb-camere-ospiti", name: "Camere Ospiti e Suite", category: "rooms" },
  { id: "env-bnb-bagni-privati", name: "Bagni Privati delle Camere", category: "bathrooms" },
  { id: "env-bnb-sala-colazioni", name: "Sala Colazioni e Buffet Ospiti", category: "dining" },
  { id: "env-bnb-kitchenette-office", name: "Kitchenette e Office Preparazione Colazioni", category: "kitchen" },
  { id: "env-bnb-lavanderia-office", name: "Lavanderia e Stireria Interna B&B", category: "laundry" },
  { id: "env-bnb-centrale-termica-boiler", name: "Centrale Termica Murale e Bollitore ACS", category: "boiler_room" },
  { id: "env-bnb-ripostiglio-housekeeping", name: "Ripostiglio Housekeeping e Biancheria Piani", category: "storage" },
  { id: "env-bnb-scale-disimpegni", name: "Scale Interne e Corridoi Disimpegni", category: "common" },
];

const suggestedWithBnbEnvs = getSuggestedMachinesForEnvironmentsAndAteco(bnbEnvironments, "55.20.51");

// 1. Ingresso / Reception -> 2 macchine (centralina_rilevazione_fumi_bnb, serrature_elettroniche_smartlock)
const receptionBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-ingresso-reception");
assert.equal(receptionBnbMachines.length, 2, "env-bnb-ingresso-reception deve associare 2 macchine");
assert.ok(receptionBnbMachines.some((m) => m.machineKey === "centralina_rilevazione_fumi_bnb"), "centralina_rilevazione_fumi_bnb in reception");
assert.ok(receptionBnbMachines.some((m) => m.machineKey === "serrature_elettroniche_smartlock"), "serrature_elettroniche_smartlock in reception");

// 2. Camere Ospiti -> 3 macchine (aspirapolvere_filtro_hepa_bnb, generatore_ozono_sanificazione_bnb, serrature_elettroniche_smartlock)
const camereBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-camere-ospiti");
assert.equal(camereBnbMachines.length, 3, "env-bnb-camere-ospiti deve associare 3 macchine");
assert.ok(camereBnbMachines.some((m) => m.machineKey === "aspirapolvere_filtro_hepa_bnb"), "aspirapolvere_filtro_hepa_bnb in camere");
assert.ok(camereBnbMachines.some((m) => m.machineKey === "generatore_ozono_sanificazione_bnb"), "generatore_ozono_sanificazione_bnb in camere");
assert.ok(camereBnbMachines.some((m) => m.machineKey === "serrature_elettroniche_smartlock"), "serrature_elettroniche_smartlock in camere");

// 3. Bagni Privati -> 3 macchine (aspirapolvere_filtro_hepa_bnb, generatore_ozono_sanificazione_bnb, serrature_elettroniche_smartlock)
const bagniBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-bagni-privati");
assert.equal(bagniBnbMachines.length, 3, "env-bnb-bagni-privati deve associare 3 macchine");
assert.ok(bagniBnbMachines.some((m) => m.machineKey === "aspirapolvere_filtro_hepa_bnb"), "aspirapolvere in bagni");
assert.ok(bagniBnbMachines.some((m) => m.machineKey === "generatore_ozono_sanificazione_bnb"), "ozono in bagni");
assert.ok(bagniBnbMachines.some((m) => m.machineKey === "serrature_elettroniche_smartlock"), "smartlock in bagni");

// 4. Sala Colazioni -> 4 macchine (macchina_caffe_capsule_grani_bnb, bollitore_tostapane_buffet_bnb, vetrina_refrigerata_snack_bnb, spremiagrumi_centrifuga_compatta)
const salaBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-sala-colazioni");
assert.equal(salaBnbMachines.length, 4, "env-bnb-sala-colazioni deve associare 4 macchine");
assert.ok(salaBnbMachines.some((m) => m.machineKey === "macchina_caffe_capsule_grani_bnb"), "macchina caffe in sala colazioni");
assert.ok(salaBnbMachines.some((m) => m.machineKey === "bollitore_tostapane_buffet_bnb"), "bollitore tostapane in sala colazioni");
assert.ok(salaBnbMachines.some((m) => m.machineKey === "vetrina_refrigerata_snack_bnb"), "vetrina refrigerata in sala colazioni");
assert.ok(salaBnbMachines.some((m) => m.machineKey === "spremiagrumi_centrifuga_compatta"), "spremiagrumi in sala colazioni");

// 5. Kitchenette / Office -> 2 macchine (lavastoviglie_termodisinfezione_bnb, forno_microonde_grill_bnb)
const kitchenBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-kitchenette-office");
assert.equal(kitchenBnbMachines.length, 2, "env-bnb-kitchenette-office deve associare 2 macchine");
assert.ok(kitchenBnbMachines.some((m) => m.machineKey === "lavastoviglie_termodisinfezione_bnb"), "lavastoviglie in kitchenette");
assert.ok(kitchenBnbMachines.some((m) => m.machineKey === "forno_microonde_grill_bnb"), "microonde in kitchenette");

// 6. Lavanderia / Office -> 3 macchine (lavatrice_vapore_igienizzante_bnb, asciugatrice_pompa_calore_bnb, ferro_generatore_vapore_caldaia)
const lavanderiaBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-lavanderia-office");
assert.equal(lavanderiaBnbMachines.length, 3, "env-bnb-lavanderia-office deve associare 3 macchine");
assert.ok(lavanderiaBnbMachines.some((m) => m.machineKey === "lavatrice_vapore_igienizzante_bnb"), "lavatrice in lavanderia");
assert.ok(lavanderiaBnbMachines.some((m) => m.machineKey === "asciugatrice_pompa_calore_bnb"), "asciugatrice in lavanderia");
assert.ok(lavanderiaBnbMachines.some((m) => m.machineKey === "ferro_generatore_vapore_caldaia"), "ferro caldaia in lavanderia");

// 7. Centrale Termica Boiler -> 1 macchina (caldaia_murale_condensazione_acs)
const caldaiaBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-centrale-termica-boiler");
assert.equal(caldaiaBnbMachines.length, 1, "env-bnb-centrale-termica-boiler deve associare 1 macchina");
assert.ok(caldaiaBnbMachines.some((m) => m.machineKey === "caldaia_murale_condensazione_acs"), "caldaia murale in centrale termica boiler");

// 8. Ripostiglio Housekeeping -> 2 macchine (carrello_housekeeping_compatto_bnb, lavasciuga_pavimenti_compatta_bnb)
const ripostiglioBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-ripostiglio-housekeeping");
assert.equal(ripostiglioBnbMachines.length, 2, "env-bnb-ripostiglio-housekeeping deve associare 2 macchine");
assert.ok(ripostiglioBnbMachines.some((m) => m.machineKey === "carrello_housekeeping_compatto_bnb"), "carrello housekeeping in ripostiglio");
assert.ok(ripostiglioBnbMachines.some((m) => m.machineKey === "lavasciuga_pavimenti_compatta_bnb"), "lavasciuga in ripostiglio");

// 9. Scale e Disimpegni -> 2 macchine (carrello_housekeeping_compatto_bnb, lavasciuga_pavimenti_compatta_bnb)
const scaleBnbMachines = suggestedWithBnbEnvs.filter((m) => m.targetEnvironmentId === "env-bnb-scale-disimpegni");
assert.equal(scaleBnbMachines.length, 2, "env-bnb-scale-disimpegni deve associare 2 macchine");
assert.ok(scaleBnbMachines.some((m) => m.machineKey === "carrello_housekeeping_compatto_bnb"), "carrello housekeeping in scale disimpegni");
assert.ok(scaleBnbMachines.some((m) => m.machineKey === "lavasciuga_pavimenti_compatta_bnb"), "lavasciuga in scale disimpegni");

// -------------------------------------------------------------
// Test 46: Risoluzione solo su codice ATECO senza locali censiti (B&B e Affittacamere 55.20.51)
// -------------------------------------------------------------
console.log("Test 46: Integrazione automatica macchine per ATECO 55.20.51 senza ambienti preventivi");
const suggestedBnbOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "55.20.51");
assert.equal(suggestedBnbOnlyAteco.length, 16, "Devono essere suggerite tutte le 16 macchine del B&B");
assert.ok(
  suggestedBnbOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per tutte le varianti di codice ATECO ("55.20.51", "55.20.5", "55.20", "55.2", "552051", "55205", "5520", "552")
for (const code of ["55.20.51", "55.20.5", "55.20", "55.2", "552051", "55205", "5520", "552"]) {
  const fallbackBnbRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackBnbRes.length, 16, `ATECO variant '${code}' deve restituire tutte le 16 macchine del B&B`);
  assert.ok(fallbackBnbRes.every((m) => m.sourceReason === "ateco"), `Tutte le macchine con ATECO variant '${code}' devono avere sourceReason === 'ateco'`);
}

console.log("\n=== INIZIO TEST normativeMachineCatalog (ATECO 55.20.20 Ostelli, Residence e Case per Ferie) ===");

// -------------------------------------------------------------
// Test 47: Verifica priorità catalogo ATECO per Ostello / Residence (55.20.20 / 55.20.2 / 552020 / 55202)
// -------------------------------------------------------------
console.log("Test 47: Verifica priorità catalogo ATECO per Ostelli e Residence (55.20.20 / 55.20.2 / 552020 / 55202)");
const catalogHostelExact = getSectorMachineCatalogForAteco("55.20.20");
assert.equal(catalogHostelExact.sectorKey, "ostello_residence", "ATECO 55.20.20 deve restituire ostello_residence");
assert.ok(catalogHostelExact.sectorLabel.includes("Ostelli"), "L'etichetta del catalogo deve includere 'Ostelli'");

const catalogHostelPrefix = getSectorMachineCatalogForAteco("55.20.2");
assert.equal(catalogHostelPrefix.sectorKey, "ostello_residence", "ATECO 55.20.2 deve restituire ostello_residence");

const catalogHostelDigits = getSectorMachineCatalogForAteco("552020");
assert.equal(catalogHostelDigits.sectorKey, "ostello_residence", "ATECO 552020 senza punti deve restituire ostello_residence");

const catalogHostelDigits5 = getSectorMachineCatalogForAteco("55202");
assert.equal(catalogHostelDigits5.sectorKey, "ostello_residence", "ATECO 55202 senza punti deve restituire ostello_residence");

// Verifica posizionamento: ostello_residence deve seguire hotel_strutture_ricettive e precedere bnb_affittacamere
const hotelIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "hotel_strutture_ricettive");
const hostelIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "ostello_residence");
const bnbIndex = SECTOR_MACHINERY_CATALOGS.findIndex((s) => s.sectorKey === "bnb_affittacamere");
assert.ok(hotelIndex !== -1, "Settore hotel_strutture_ricettive deve esistere nel catalogo");
assert.ok(hostelIndex !== -1, "Settore ostello_residence deve esistere nel catalogo");
assert.ok(bnbIndex !== -1, "Settore bnb_affittacamere deve esistere nel catalogo");
assert.equal(hostelIndex, hotelIndex + 1, "ostello_residence deve seguire immediatamente hotel_strutture_ricettive");
assert.equal(bnbIndex, hostelIndex + 1, "bnb_affittacamere deve seguire immediatamente ostello_residence");

// -------------------------------------------------------------
// Test 48: Verifica completezza delle 16 macchine professionali per ostello con modelli reali, corsi e verifiche tecniche
// -------------------------------------------------------------
console.log("Test 48: Verifica completezza delle 16 macchine professionali con verifiche, corsi e modelli reali");
assert.equal(catalogHostelExact.machines.length, 16, "Il catalogo Ostello e Residence deve contenere esattamente 16 macchine");

const expectedHostelMachineKeys = [
  "piano_induzione_comunitario_ostello",
  "forno_microonde_inox_comunitario",
  "frigorifero_multiposto_ospiti",
  "lavastoviglie_ciclo_breve_ostello",
  "distributore_snack_bevande_h24",
  "distributore_caffe_bevande_calde",
  "lavatrice_selfservice_gettone",
  "asciugatrice_selfservice_gettone",
  "ferro_stiro_aspirante_comunitario",
  "lockers_elettronici_bagagli",
  "aspirapolvere_battitappeto_hepa",
  "lavasciuga_pavimenti_compatta_ostello",
  "caldaia_centrale_acs_legionella",
  "centrale_antincendio_indirizzata_ostello",
  "porte_tagliafuoco_chiudiporta_ostello",
  "carrello_housekeeping_multitasche",
];

for (const key of expectedHostelMachineKeys) {
  const found = catalogHostelExact.machines.find((m) => m.machineKey === key);
  assert.ok(found, `Attrezzatura con key '${key}' deve essere presente nel catalogo ostello_residence`);
  assert.ok(found.name.length > 5, `Nome attrezzatura '${key}' deve essere descrittivo`);
  assert.ok(found.suggestedManufacturer.length > 2, `Produttore suggerito presente per '${key}'`);
  assert.ok(found.suggestedModel.length > 1, `Modello suggerito presente per '${key}'`);
  assert.ok(found.safetyChecks.length >= 3, `L'attrezzatura '${key}' deve avere almeno 3 controlli di sicurezza specifici`);
  assert.ok(found.training, `L'attrezzatura '${key}' deve avere una formazione definita`);
}

// Verifica requisiti specifici di formazione e sicurezza
const aspirapolvereHostel = catalogHostelExact.machines.find((m) => m.machineKey === "aspirapolvere_battitappeto_hepa")!;
assert.equal(aspirapolvereHostel.training.courseCode, "FORMAZ_HOUSEKEEPING_OSTELLO", "Aspirapolvere richiede corso housekeeping ostello");
assert.equal(aspirapolvereHostel.training.minHours, 4, "Corso housekeeping ostello è di 4 ore");

const carrelloHostel = catalogHostelExact.machines.find((m) => m.machineKey === "carrello_housekeeping_multitasche")!;
assert.equal(carrelloHostel.training.courseCode, "FORMAZ_HOUSEKEEPING_OSTELLO", "Carrello richiede corso housekeeping ostello");

const antincendioHostel = catalogHostelExact.machines.find((m) => m.machineKey === "centrale_antincendio_indirizzata_ostello")!;
assert.equal(antincendioHostel.training.courseCode, "FORMAZ_ANTINCENDIO_L2", "Centrale antincendio richiede corso antincendio livello 2");
assert.equal(antincendioHostel.training.minHours, 8, "Corso antincendio livello 2 è di 8 ore");

const porteTagliafuocoHostel = catalogHostelExact.machines.find((m) => m.machineKey === "porte_tagliafuoco_chiudiporta_ostello")!;
assert.equal(porteTagliafuocoHostel.training.courseCode, "FORMAZ_ANTINCENDIO_L2", "Porte tagliafuoco collegate a formazione antincendio livello 2");

// -------------------------------------------------------------
// Test 49: Verifica associazione ambienti Step 2 Ostello (env-ost-*) -> Step 4 Macchine
// -------------------------------------------------------------
console.log("Test 49: Verifica associazione ambienti Step 2 Ostello (env-ost-*) -> Step 4 Macchine");
const hostelEnvironments = [
  { id: "env-ost-reception-lounge", name: "Reception, Lounge e Area Comune", category: "reception" },
  { id: "env-ost-dormitori-camerate", name: "Dormitori Condivisi e Camerate con Letti a Castello", category: "rooms" },
  { id: "env-ost-camere-private", name: "Camere Private e Familiari", category: "rooms" },
  { id: "env-ost-servizi-igienici-comuni", name: "Servizi Igienici e Docce Comuni di Piano", category: "bathrooms" },
  { id: "env-ost-cucina-condivisa", name: "Cucina Condivisa per Ospiti", category: "kitchen" },
  { id: "env-ost-dispensa-frigo-ospiti", name: "Dispensa e Zona Frigoriferi Ospiti", category: "storage" },
  { id: "env-ost-lavanderia-self", name: "Lavanderia Self-Service per Ospiti", category: "laundry" },
  { id: "env-ost-deposito-housekeeping", name: "Deposito Housekeeping e Materiali Pulizia", category: "storage" },
  { id: "env-ost-area-rifiuti", name: "Area Raccolta Differenziata Rifiuti", category: "waste" },
  { id: "env-ost-deposito-bagagli", name: "Deposito Bagagli Automatizzato / Lockers", category: "storage" },
  { id: "env-ost-centrale-termica-acs", name: "Centrale Termica e Accumulo ACS", category: "boiler_room" },
  { id: "env-ost-corridoi-scale-esodo", name: "Corridoi, Scale e Vie di Esodo", category: "common" },
];

const suggestedWithHostelEnvs = getSuggestedMachinesForEnvironmentsAndAteco(hostelEnvironments, "55.20.20");

// 1. Reception / Lounge -> 3 macchine (distributore_snack_bevande_h24, distributore_caffe_bevande_calde, centrale_antincendio_indirizzata_ostello)
const receptionHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-reception-lounge");
assert.equal(receptionHostel.length, 3, "env-ost-reception-lounge deve associare 3 macchine");
assert.ok(receptionHostel.some((m) => m.machineKey === "distributore_snack_bevande_h24"), "distributore_snack_bevande_h24 in reception");
assert.ok(receptionHostel.some((m) => m.machineKey === "distributore_caffe_bevande_calde"), "distributore_caffe_bevande_calde in reception");
assert.ok(receptionHostel.some((m) => m.machineKey === "centrale_antincendio_indirizzata_ostello"), "centrale_antincendio_indirizzata_ostello in reception");

// 2. Dormitori / Camerate -> 2 macchine (aspirapolvere_battitappeto_hepa, centrale_antincendio_indirizzata_ostello)
const dormitoriHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-dormitori-camerate");
assert.equal(dormitoriHostel.length, 2, "env-ost-dormitori-camerate deve associare 2 macchine");
assert.ok(dormitoriHostel.some((m) => m.machineKey === "aspirapolvere_battitappeto_hepa"), "aspirapolvere in dormitori");
assert.ok(dormitoriHostel.some((m) => m.machineKey === "centrale_antincendio_indirizzata_ostello"), "antincendio in dormitori");

// 3. Camere Private -> 2 macchine (aspirapolvere_battitappeto_hepa, centrale_antincendio_indirizzata_ostello)
const camerePrivateHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-camere-private");
assert.equal(camerePrivateHostel.length, 2, "env-ost-camere-private deve associare 2 macchine");
assert.ok(camerePrivateHostel.some((m) => m.machineKey === "aspirapolvere_battitappeto_hepa"), "aspirapolvere in camere private");
assert.ok(camerePrivateHostel.some((m) => m.machineKey === "centrale_antincendio_indirizzata_ostello"), "antincendio in camere private");

// 4. Servizi Igienici Comuni -> 1 macchina (carrello_housekeeping_multitasche)
const bagniHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-servizi-igienici-comuni");
assert.equal(bagniHostel.length, 1, "env-ost-servizi-igienici-comuni deve associare 1 macchina");
assert.ok(bagniHostel.some((m) => m.machineKey === "carrello_housekeeping_multitasche"), "carrello in bagni comuni");

// 5. Cucina Condivisa -> 3 macchine (piano_induzione_comunitario_ostello, forno_microonde_inox_comunitario, lavastoviglie_ciclo_breve_ostello)
const cucinaHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-cucina-condivisa");
assert.equal(cucinaHostel.length, 3, "env-ost-cucina-condivisa deve associare 3 macchine");
assert.ok(cucinaHostel.some((m) => m.machineKey === "piano_induzione_comunitario_ostello"), "piano induzione in cucina");
assert.ok(cucinaHostel.some((m) => m.machineKey === "forno_microonde_inox_comunitario"), "microonde in cucina");
assert.ok(cucinaHostel.some((m) => m.machineKey === "lavastoviglie_ciclo_breve_ostello"), "lavastoviglie in cucina");

// 6. Dispensa Frigo Ospiti -> 1 macchina (frigorifero_multiposto_ospiti)
const dispensaHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-dispensa-frigo-ospiti");
assert.equal(dispensaHostel.length, 1, "env-ost-dispensa-frigo-ospiti deve associare 1 macchina");
assert.ok(dispensaHostel.some((m) => m.machineKey === "frigorifero_multiposto_ospiti"), "frigo multiposto in dispensa");

// 7. Lavanderia Self -> 3 macchine (lavatrice_selfservice_gettone, asciugatrice_selfservice_gettone, ferro_stiro_aspirante_comunitario)
const lavanderiaHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-lavanderia-self");
assert.equal(lavanderiaHostel.length, 3, "env-ost-lavanderia-self deve associare 3 macchine");
assert.ok(lavanderiaHostel.some((m) => m.machineKey === "lavatrice_selfservice_gettone"), "lavatrice in lavanderia self");
assert.ok(lavanderiaHostel.some((m) => m.machineKey === "asciugatrice_selfservice_gettone"), "asciugatrice in lavanderia self");
assert.ok(lavanderiaHostel.some((m) => m.machineKey === "ferro_stiro_aspirante_comunitario"), "ferro stiro in lavanderia self");

// 8. Deposito Housekeeping -> 2 macchine (carrello_housekeeping_multitasche, lavasciuga_pavimenti_compatta_ostello)
const depositoHousekeepingHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-deposito-housekeeping");
assert.equal(depositoHousekeepingHostel.length, 2, "env-ost-deposito-housekeeping deve associare 2 macchine");
assert.ok(depositoHousekeepingHostel.some((m) => m.machineKey === "carrello_housekeeping_multitasche"), "carrello in deposito housekeeping");
assert.ok(depositoHousekeepingHostel.some((m) => m.machineKey === "lavasciuga_pavimenti_compatta_ostello"), "lavasciuga in deposito housekeeping");

// 9. Area Rifiuti -> 2 macchine (carrello_housekeeping_multitasche, lavasciuga_pavimenti_compatta_ostello)
const areaRifiutiHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-area-rifiuti");
assert.equal(areaRifiutiHostel.length, 2, "env-ost-area-rifiuti deve associare 2 macchine");
assert.ok(areaRifiutiHostel.some((m) => m.machineKey === "carrello_housekeeping_multitasche"), "carrello in area rifiuti");
assert.ok(areaRifiutiHostel.some((m) => m.machineKey === "lavasciuga_pavimenti_compatta_ostello"), "lavasciuga in area rifiuti");

// 10. Deposito Bagagli -> 1 macchina (lockers_elettronici_bagagli)
const depositoBagagliHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-deposito-bagagli");
assert.equal(depositoBagagliHostel.length, 1, "env-ost-deposito-bagagli deve associare 1 macchina");
assert.ok(depositoBagagliHostel.some((m) => m.machineKey === "lockers_elettronici_bagagli"), "lockers in deposito bagagli");

// 11. Centrale Termica ACS -> 1 macchina (caldaia_centrale_acs_legionella)
const centraleTermicaHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-centrale-termica-acs");
assert.equal(centraleTermicaHostel.length, 1, "env-ost-centrale-termica-acs deve associare 1 macchina");
assert.ok(centraleTermicaHostel.some((m) => m.machineKey === "caldaia_centrale_acs_legionella"), "caldaia in centrale termica");

// 12. Corridoi e Scale d'Esodo -> 3 macchine (centrale_antincendio_indirizzata_ostello, porte_tagliafuoco_chiudiporta_ostello, lavasciuga_pavimenti_compatta_ostello)
const corridoiHostel = suggestedWithHostelEnvs.filter((m) => m.targetEnvironmentId === "env-ost-corridoi-scale-esodo");
assert.equal(corridoiHostel.length, 3, "env-ost-corridoi-scale-esodo deve associare 3 macchine");
assert.ok(corridoiHostel.some((m) => m.machineKey === "centrale_antincendio_indirizzata_ostello"), "antincendio in corridoi scale");
assert.ok(corridoiHostel.some((m) => m.machineKey === "porte_tagliafuoco_chiudiporta_ostello"), "porte tagliafuoco in corridoi scale");
assert.ok(corridoiHostel.some((m) => m.machineKey === "lavasciuga_pavimenti_compatta_ostello"), "lavasciuga in corridoi scale");

// -------------------------------------------------------------
// Test 50: Integrazione automatica macchine per ATECO 55.20.20 senza ambienti preventivi
// -------------------------------------------------------------
console.log("Test 50: Integrazione automatica macchine per ATECO 55.20.20 senza ambienti preventivi");
const suggestedHostelOnlyAteco = getSuggestedMachinesForEnvironmentsAndAteco([], "55.20.20");
assert.equal(suggestedHostelOnlyAteco.length, 16, "Devono essere suggerite tutte le 16 macchine dell'ostello");
assert.ok(
  suggestedHostelOnlyAteco.every((m) => m.sourceReason === "ateco"),
  "Tutte le macchine devono avere sourceReason === 'ateco' se nessun locale è stato specificato",
);

// Verifica fallback automatico identico per tutte le varianti di codice ATECO ("55.20.20", "55.20.2", "552020", "55202")
for (const code of ["55.20.20", "55.20.2", "552020", "55202"]) {
  const fallbackHostelRes = getSuggestedMachinesForEnvironmentsAndAteco([], code);
  assert.equal(fallbackHostelRes.length, 16, `ATECO variant '${code}' deve restituire tutte le 16 macchine dell'ostello`);
  assert.ok(fallbackHostelRes.every((m) => m.sourceReason === "ateco"), `Tutte le macchine con ATECO variant '${code}' devono avere sourceReason === 'ateco'`);
}

console.log("=== TUTTI I TEST normativeMachineCatalog SUPERATI CON SUCCESSO! ===");



