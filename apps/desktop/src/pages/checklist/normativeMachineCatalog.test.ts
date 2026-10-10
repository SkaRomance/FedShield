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

// Verifica che codici generici (es. 56.21 catering) continuino a risolvere su ristorazione_alimentare
const cateringCatalog = getSectorMachineCatalogForAteco("56.21");
assert.equal(cateringCatalog.sectorKey, "ristorazione_alimentare", "ATECO 56.21 deve ricadere sul fallback generico ristorazione_alimentare");

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

console.log("=== TUTTI I TEST normativeMachineCatalog SUPERATI CON SUCCESSO! ===");
