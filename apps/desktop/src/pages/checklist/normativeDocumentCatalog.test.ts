/**
 * normativeDocumentCatalog.test.ts
 * Test unitari per il catalogo normativo e il filtro documenti in modalità haccp_only, safety_only, unified.
 */

import {
  isDocumentApplicableToAteco,
  isCategoryApplicableForAteco,
  filterDocumentsForAteco,
  NORMATIVE_DOCUMENTS_CATALOG,
  findCatalogDefinition,
  parseDocumentExtraMeta,
  serializeDocumentExtraMeta,
} from "./normativeDocumentCatalog";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== INIZIO TEST normativeDocumentCatalog ===");

// 1. Test isCategoryApplicableForAteco in modalità haccp_only
console.log("Test 1: isCategoryApplicableForAteco haccp_only");
const catAcqueHaccp = isCategoryApplicableForAteco("acque_legionella", "56.10.11", "haccp_only");
assert(catAcqueHaccp.applicable === true, "acque_legionella deve essere applicabile in haccp_only");
assert(
  catAcqueHaccp.reason.includes("Piano Sicurezza Acque") && catAcqueHaccp.reason.includes("D.Lgs. 18/2023"),
  "La motivazione per acque_legionella deve citare il PSA e D.Lgs. 18/2023",
);

const catSicurezzaHaccp = isCategoryApplicableForAteco("sicurezza_81_08", "56.10.11", "haccp_only");
assert(catSicurezzaHaccp.applicable === false, "sicurezza_81_08 non deve essere applicabile in haccp_only");
assert(catSicurezzaHaccp.reason.includes("Solo HACCP"), "La motivazione deve citare Solo HACCP");

const catMatriciHaccp = isCategoryApplicableForAteco("matrici_ambientali", "56.10.11", "haccp_only");
assert(catMatriciHaccp.applicable === false, "matrici_ambientali non deve essere applicabile in haccp_only");
assert(catMatriciHaccp.reason.includes("Solo HACCP"), "La motivazione deve citare Solo HACCP");

const catBaseHaccp = isCategoryApplicableForAteco("base_autorizzativa", "56.10.11", "haccp_only");
assert(catBaseHaccp.applicable === true, "base_autorizzativa deve essere applicabile in haccp_only");

const catHaccpHaccp = isCategoryApplicableForAteco("haccp_alimentare", "56.10.11", "haccp_only");
assert(catHaccpHaccp.applicable === true, "haccp_alimentare deve essere applicabile per ristorante in haccp_only");

// 2. Test isDocumentApplicableToAteco in modalità haccp_only
console.log("Test 2: isDocumentApplicableToAteco haccp_only");
const docPsa = findCatalogDefinition("Piano di Sicurezza delle Acque");
assert(docPsa !== undefined, "Piano di Sicurezza delle Acque deve esistere nel catalogo");
if (docPsa) {
  assert(
    isDocumentApplicableToAteco(docPsa, "56.10.11", "haccp_only") === true,
    "acque-psa DEVE essere applicabile in haccp_only!",
  );
}

const docAcquePotabili = findCatalogDefinition("Rapporti di Prova Ufficiali di Analisi delle Acque Potabili");
assert(docAcquePotabili !== undefined, "Analisi Acque Potabili deve esistere nel catalogo");
if (docAcquePotabili) {
  assert(
    isDocumentApplicableToAteco(docAcquePotabili, "56.10.11", "haccp_only") === true,
    "Analisi acque potabili DEVE essere applicabile in haccp_only!",
  );
}

const docManualeHaccp = findCatalogDefinition("Manuale di Autocontrollo HACCP");
assert(docManualeHaccp !== undefined, "Manuale HACCP deve esistere nel catalogo");
if (docManualeHaccp) {
  assert(
    isDocumentApplicableToAteco(docManualeHaccp, "56.10.11", "haccp_only") === true,
    "Manuale HACCP deve essere applicabile in haccp_only",
  );
}

const docVisura = findCatalogDefinition("Visura Camerale");
assert(docVisura !== undefined, "Visura Camerale deve esistere nel catalogo");
if (docVisura) {
  assert(
    isDocumentApplicableToAteco(docVisura, "56.10.11", "haccp_only") === true,
    "Visura Camerale (base_autorizzativa) deve essere applicabile in haccp_only",
  );
}

const docDvr = NORMATIVE_DOCUMENTS_CATALOG.find((d) => d.id === "sec-dvr");
assert(docDvr !== undefined, "DVR deve esistere nel catalogo");
if (docDvr) {
  assert(
    isDocumentApplicableToAteco(docDvr, "56.10.11", "haccp_only") === false,
    "DVR (sicurezza_81_08) NON deve essere applicabile in haccp_only!",
  );
}

const docEmissioni = findCatalogDefinition("Rapporto di Prova Analisi Emissioni in Atmosfera ai Camini");
assert(docEmissioni !== undefined, "Emissioni deve esistere nel catalogo");
if (docEmissioni) {
  assert(
    isDocumentApplicableToAteco(docEmissioni, "56.10.11", "haccp_only") === false,
    "Emissioni fumi (matrici_ambientali) NON deve essere applicabile in haccp_only!",
  );
}

// 3. Test filterDocumentsForAteco con haccp_only
console.log("Test 3: filterDocumentsForAteco haccp_only");
const filteredHaccp = filterDocumentsForAteco(NORMATIVE_DOCUMENTS_CATALOG, "56.10.11", "haccp_only");
assert(filteredHaccp.length > 0, "La lista filtrata per haccp_only non deve essere vuota");

const hasSicurezzaInHaccpOnly = filteredHaccp.some((d) => d.category === "sicurezza_81_08");
assert(
  !hasSicurezzaInHaccpOnly,
  "NESSUN documento di sicurezza_81_08 deve essere presente nella lista haccp_only!",
);

const hasMatriciInHaccpOnly = filteredHaccp.some((d) => d.category === "matrici_ambientali");
assert(
  !hasMatriciInHaccpOnly,
  "NESSUN documento di matrici_ambientali deve essere presente nella lista haccp_only!",
);

const hasAcqueInHaccpOnly = filteredHaccp.some((d) => d.category === "acque_legionella");
assert(
  hasAcqueInHaccpOnly,
  "I documenti di acque_legionella DEVONO essere presenti nella lista haccp_only!",
);

const hasPsaSpecifically = filteredHaccp.some((d) => d.id === "acque-psa");
assert(hasPsaSpecifically, "Il documento acque-psa DEVE essere presente nella lista haccp_only!");

// 4. Test modalità safety_only
console.log("Test 4: isDocumentApplicableToAteco safety_only");
if (docDvr && docManualeHaccp && docPsa) {
  assert(
    isDocumentApplicableToAteco(docDvr, "45.20.1", "safety_only") === true,
    "DVR deve essere applicabile in safety_only",
  );
  assert(
    isDocumentApplicableToAteco(docManualeHaccp, "45.20.1", "safety_only") === false,
    "Manuale HACCP NON deve essere applicabile in safety_only",
  );
  assert(
    isDocumentApplicableToAteco(docPsa, "45.20.1", "safety_only") === true,
    "PSA deve essere applicabile in safety_only",
  );
}

// 5. Test extra meta con customCategory
console.log("Test 5: DocumentExtraMeta con customCategory");
const metaInput = {
  noteText: "Note di prova",
  customCategory: "acque_legionella" as const,
};
const serialized = serializeDocumentExtraMeta(metaInput);
assert(serialized.includes("acque_legionella"), "La stringa serializzata deve contenere customCategory");
const parsed = parseDocumentExtraMeta(serialized);
assert(parsed.customCategory === "acque_legionella", "Il parsing deve preservare customCategory");

console.log("=== TUTTI I TEST normativeDocumentCatalog SUPERATI CON SUCCESSO! ===");
