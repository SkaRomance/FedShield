import assert from "node:assert/strict";
import { buildApp } from "../app.js";

type SectorConfig = {
  ateco: string;
  macroGroup: string;
  expectedTemplate: string;
  expectedText: string[];
  minDocs: number;
};

async function run() {
  const app = buildApp();
  await app.ready();

  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: "senior@fedshield.local",
      password: "fedshield123",
    },
  });
  assert.equal(login.statusCode, 200);
  const { token } = login.json();
  const headers = { authorization: `Bearer ${token}` };

  const sectors: SectorConfig[] = [
    {
      ateco: "47.71",
      macroGroup: "COMMERCIO_NON_FOOD",
      expectedTemplate: "Commercio Non Food",
      expectedText: ["Scaffalature", "Privacy", "Antincendio"],
      minDocs: 6,
    },
    {
      ateco: "52.10",
      macroGroup: "LOGISTICA_MAGAZZINO",
      expectedTemplate: "Logistica e Magazzino",
      expectedText: ["Carrelli elevatori", "Baie di carico", "DUVRI"],
      minDocs: 6,
    },
    {
      ateco: "81.21",
      macroGroup: "PULIZIE_SANIFICAZIONE",
      expectedTemplate: "Pulizie e Sanificazione",
      expectedText: ["Prodotti chimici", "DUVRI", "sanificazione"],
      minDocs: 6,
    },
    {
      ateco: "96.02",
      macroGroup: "SERVIZI_PERSONA",
      expectedTemplate: "Servizi alla Persona",
      expectedText: ["Igiene strumenti", "Cosmetici", "Privacy"],
      minDocs: 6,
    },
    {
      ateco: "85.59",
      macroGroup: "ISTRUZIONE_FORMAZIONE",
      expectedTemplate: "Istruzione e Formazione",
      expectedText: ["Aule", "Privacy minori", "Laboratori"],
      minDocs: 6,
    },
    {
      ateco: "45.20",
      macroGroup: "AUTORIPARAZIONE",
      expectedTemplate: "Autoriparazioni",
      expectedText: ["Ponti sollevatori", "Rifiuti", "Gas di scarico"],
      minDocs: 6,
    },
    {
      ateco: "10.71",
      macroGroup: "INDUSTRIA_ALIMENTARE",
      expectedTemplate: "Industria Alimentare",
      expectedText: ["HACCP", "Allergeni", "Catena freddo"],
      minDocs: 8,
    },
    {
      ateco: "41.20",
      macroGroup: "EDILIZIA_COSTRUZIONI",
      expectedTemplate: "Edilizia e Costruzioni",
      expectedText: ["POS", "ponteggi", "scavi"],
      minDocs: 10,
    },
    {
      ateco: "42.11",
      macroGroup: "INGEGNERIA_CIVILE_INFRASTRUTTURE",
      expectedTemplate: "Ingegneria Civile",
      expectedText: ["traffico", "sottoservizi", "terre e rocce"],
      minDocs: 8,
    },
    {
      ateco: "42.11",
      macroGroup: "ASFALTI_PAVIMENTAZIONI_STRADALI",
      expectedTemplate: "Asfalti",
      expectedText: ["bitumi", "fresato", "segnaletica"],
      minDocs: 8,
    },
    {
      ateco: "43.11",
      macroGroup: "DEMOLIZIONI_SCAVI_PREPARAZIONE",
      expectedTemplate: "Demolizioni",
      expectedText: ["demolizione", "amianto", "rifiuti C&D"],
      minDocs: 8,
    },
    {
      ateco: "43.13",
      macroGroup: "FONDAZIONI_SPECIALI_PERFORAZIONI",
      expectedTemplate: "Fondazioni Speciali",
      expectedText: ["perforatrici", "fanghi", "sottoservizi"],
      minDocs: 8,
    },
    {
      ateco: "43.21",
      macroGroup: "IMPIANTISTICA_ELETTRICA",
      expectedTemplate: "Impiantistica Elettrica",
      expectedText: ["PES", "lockout", "DiCo"],
      minDocs: 8,
    },
    {
      ateco: "43.22",
      macroGroup: "IMPIANTISTICA_TERMOIDRAULICA",
      expectedTemplate: "Termoidraulica",
      expectedText: ["F-gas", "gas", "spazi confinati"],
      minDocs: 8,
    },
    {
      ateco: "43.33",
      macroGroup: "FINITURE_EDILI",
      expectedTemplate: "Finiture Edili",
      expectedText: ["silice", "collanti", "trabattelli"],
      minDocs: 8,
    },
    {
      ateco: "43.32",
      macroGroup: "SERRAMENTI_FACCIATE_VETRAZIONI",
      expectedTemplate: "Serramenti",
      expectedText: ["vetri", "facciate", "anti-taglio"],
      minDocs: 8,
    },
    {
      ateco: "43.91",
      macroGroup: "OPERE_SPECIALIZZATE_COPERTURE",
      expectedTemplate: "Opere Specializzate",
      expectedText: ["linee vita", "coperture", "impermeabilizzazioni"],
      minDocs: 8,
    },
    {
      ateco: "25.11",
      macroGroup: "CARPENTERIA_METALLICA_PREFABBRICATI",
      expectedTemplate: "Carpenteria Metallica",
      expectedText: ["saldatura", "sollevamento", "bulloneria"],
      minDocs: 8,
    },
    {
      ateco: "77.32",
      macroGroup: "NOLEGGIO_MEZZI_CANTIERE_OPERATORE",
      expectedTemplate: "Noleggio Mezzi",
      expectedText: ["PLE", "autogru", "piazzamento"],
      minDocs: 8,
    },
    {
      ateco: "81.30",
      macroGroup: "VERDE_OPERE_ESTERNE_CANTIERI",
      expectedTemplate: "Verde",
      expectedText: ["motoseghe", "fitosanitari", "potature"],
      minDocs: 8,
    },
    {
      ateco: "39.00",
      macroGroup: "BONIFICHE_AMBIENTALI_AMIANTO",
      expectedTemplate: "Bonifiche Ambientali",
      expectedText: ["categoria 9", "categoria 10", "piano di lavoro amianto"],
      minDocs: 8,
    },
    {
      ateco: "38.11",
      macroGroup: "RIFIUTI_EDILI_RECUPERO_SMALTIMENTO",
      expectedTemplate: "Rifiuti Edili",
      expectedText: ["FIR", "EER", "deposito temporaneo"],
      minDocs: 8,
    },
    {
      ateco: "71.12",
      macroGroup: "PROGETTAZIONE_DIREZIONE_LAVORI",
      expectedTemplate: "Progettazione",
      expectedText: ["PSC", "CSP", "direzione lavori"],
      minDocs: 8,
    },
    {
      ateco: "43.21",
      macroGroup: "IMPIANTISTICA_MANUTENZIONE",
      expectedTemplate: "Impiantistica e Manutenzione",
      expectedText: ["PES", "DiCo", "PLE"],
      minDocs: 6,
    },
    {
      ateco: "68.32",
      macroGroup: "GESTIONE_IMMOBILI_CONDOMINI",
      expectedTemplate: "Gestione Immobili e Condomini",
      expectedText: ["ascensori", "centrale termica", "amianto"],
      minDocs: 6,
    },
    {
      ateco: "49.31",
      macroGroup: "TRASPORTO_PERSONE",
      expectedTemplate: "Trasporto Persone",
      expectedText: ["Mezzi", "Turni", "passeggeri"],
      minDocs: 6,
    },
    {
      ateco: "16.23",
      macroGroup: "LEGNO_ARREDO",
      expectedTemplate: "Legno e Arredo",
      expectedText: ["polveri legno", "ATEX", "vernici"],
      minDocs: 6,
    },
    {
      ateco: "20.42",
      macroGroup: "CHIMICA_COSMETICA",
      expectedTemplate: "Chimica e Cosmetica",
      expectedText: ["CLP", "REACH", "SDS"],
      minDocs: 6,
    },
    {
      ateco: "96.01",
      macroGroup: "LAVANDERIE_TINTORIE",
      expectedTemplate: "Lavanderie e Tintorie",
      expectedText: ["solventi", "stiratura", "biancheria"],
      minDocs: 6,
    },
    {
      ateco: "90.02",
      macroGroup: "EVENTI_ALLESTIMENTI",
      expectedTemplate: "Eventi e Allestimenti",
      expectedText: ["carichi sospesi", "palchi", "pubblico"],
      minDocs: 6,
    },
  ];

  for (const sector of sectors) {
    const templatesResponse = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(sector.ateco)}&checklistMode=unified`,
      headers,
    });
    assert.equal(templatesResponse.statusCode, 200, `Template request failed for ${sector.ateco}`);
    const templates = templatesResponse.json() as Array<{ id: string; name: string; macroGroup?: string | null }>;
    const sectorTemplate = templates.find(
      (template) => template.macroGroup === sector.macroGroup && template.name.includes(sector.expectedTemplate),
    );
    assert.ok(sectorTemplate, `Missing macrosector template for ${sector.ateco}`);

    const itemsResponse = await app.inject({
      method: "GET",
      url: `/api/checklists/templates/${sectorTemplate.id}/items?checklistMode=unified`,
      headers,
    });
    assert.equal(itemsResponse.statusCode, 200);
    const items = itemsResponse.json().items as Array<{ area: string; question: string; orderIndex: number }>;
    assert.ok(items.length >= 10, `Too few macrosector items for ${sector.ateco}: ${items.length}`);
    assert.deepEqual(
      items.map((entry) => entry.orderIndex),
      Array.from({ length: items.length }, (_entry, index) => index + 1),
      `Order index gap for ${sector.ateco}`,
    );

    const itemText = items.map((entry) => `${entry.area} ${entry.question}`.toLowerCase()).join(" | ");
    for (const token of sector.expectedText) {
      assert.ok(itemText.includes(token.toLowerCase()), `Missing "${token}" coverage for ${sector.ateco}`);
    }

    const docsResponse = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(sector.ateco)}&checklistMode=unified`,
      headers,
    });
    assert.equal(docsResponse.statusCode, 200);
    const docs = docsResponse.json() as Array<{ name: string; macroGroup?: string | null }>;
    const sectorDocs = docs.filter((doc) => doc.macroGroup === sector.macroGroup);
    assert.ok(sectorDocs.length >= sector.minDocs, `Too few macrosector docs for ${sector.ateco}`);
  }

  const supermarketResponse = await app.inject({
    method: "GET",
    url: "/api/checklists/templates?atecoCode=47.11.2&checklistMode=unified",
    headers,
  });
  assert.equal(supermarketResponse.statusCode, 200);
  const supermarketTemplates = supermarketResponse.json() as Array<{ macroGroup?: string | null }>;
  assert.equal(
    supermarketTemplates.some((template) => template.macroGroup === "COMMERCIO_NON_FOOD"),
    false,
    "Food retail must not receive non-food retail checklist",
  );

  const beachClubResponse = await app.inject({
    method: "GET",
    url: "/api/checklists/templates?atecoCode=93.29.20&checklistMode=unified",
    headers,
  });
  assert.equal(beachClubResponse.statusCode, 200);
  const beachClubTemplates = beachClubResponse.json() as Array<{ macroGroup?: string | null }>;
  assert.equal(
    beachClubTemplates.some((template) => template.macroGroup === "EVENTI_ALLESTIMENTI"),
    false,
    "Beach club HoReCa must not receive generic events checklist",
  );

  console.log("Macro sectors checklist test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
