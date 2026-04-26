import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAgricoltura() {
  const sectorName = "Agricoltura e Cantine";
  const macroGroup = "agriculture";

  const [genericTemplate, trainingTemplate] = await prisma.$transaction([
    prisma.checklistTemplate.upsert({
      where: { id: "tmpl-agri-generic-v1" },
      update: {},
      create: {
        id: "tmpl-agri-generic-v1",
        name: "Checklist Sicurezza Agricoltura - Generale",
        macroGroup,
        isActive: true,
        description:
          "Controlli HSE per aziende agricole, trattori, fitosanitari, cantine, stalle e serre.",
      },
    }),
    prisma.trainingChecklistTemplate.upsert({
      where: { id: "tmpl-agri-training-v1" },
      update: {},
      create: {
        id: "tmpl-agri-training-v1",
        name: "Formazione Agricoltura",
        isActive: true,
        description: "Corsi obbligatori per operatori agricoli, trattoristi e cantinieri.",
      },
    }),
  ]);

  const genericItems = [
    {
      orderIndex: 1, section: "machinery_safety", domain: "safety", area: "Trattori e macchine agricole", defaultSeverity: 4, defaultSanctionable: true,
      question: "I trattori sono dotati di targa, libretto di circolazione, assicurazione e revisione periodica (ogni 2 anni per i nuovi, ogni anno per i vecchi)?",
      normReference: "Codice della Strada, art. 100-103; D.Lgs. 81/2008, Titolo III",
    },
    {
      orderIndex: 2, section: "machinery_safety", domain: "safety", area: "Trattori e macchine agricole", defaultSeverity: 4, defaultSanctionable: true,
      question: "I trattori sono dotati di protezioni per la trasmissione (cardani), gabbie antiribaltamento (ROPS) e cinture di sicurezza?",
      normReference: "D.Lgs. 81/2008, Titolo III, Capo II; UNI EN ISO 4254-1",
    },
    {
      orderIndex: 3, section: "machinery_safety", domain: "safety", area: "Trattori e macchine agricole", defaultSeverity: 3, defaultSanctionable: false,
      question: "Gli operatori di trattori possiedono la patente speciale (trattorista) e la carta di qualifica del conducente?",
      normReference: "Codice della Strada, art. 116-117; D.Lgs. 81/2008, art. 213",
    },
    {
      orderIndex: 4, section: "machinery_safety", domain: "safety", area: "Macchine da raccolta", defaultSeverity: 3, defaultSanctionable: true,
      question: "Le macchine da raccolta (vendemmiatrici, mietitrebbie, frantoi) sono dotate di carter, emergenze e pulsanti d'arresto immediato?",
      normReference: "D.Lgs. 81/2008, Titolo III, Capo II; UNI EN ISO 4254",
    },
    {
      orderIndex: 5, section: "machinery_safety", domain: "safety", area: "Attrezzature", defaultSeverity: 3, defaultSanctionable: false,
      question: "Le attrezzature (motoseghe, decespugliatori, soffiatori) sono usate con DPI adeguati, mai senza protezione antirumore e occhiali?",
      normReference: "D.Lgs. 81/2008, art. 74; Reg. UE 2016/425",
    },
    {
      orderIndex: 6, section: "chemical_fitosanitary", domain: "safety", area: "Fitosanitari e pesticidi", defaultSeverity: 4, defaultSanctionable: true,
      question: "Il registro dei trattamenti fitosanitari (FITO) e aggiornato con dose, prodotto, coltura, data e operatori, e conservato per 5 anni?",
      normReference: "Reg. CE 1107/2009, art. 67; DM 22/01/2014; D.Lgs. 150/2012",
    },
    {
      orderIndex: 7, section: "chemical_fitosanitary", domain: "safety", area: "Fitosanitari e pesticidi", defaultSeverity: 4, defaultSanctionable: true,
      question: "Gli operatori fitosanitari hanno la qualifica professionale (corso di formazione) e sono registrati nell'albo regionale?",
      normReference: "D.Lgs. 150/2012, art. 4; Reg. CE 1107/2009",
    },
    {
      orderIndex: 8, section: "chemical_fitosanitary", domain: "safety", area: "Fitosanitari e pesticidi", defaultSeverity: 4, defaultSanctionable: true,
      question: "I contenitori di prodotti fitosanitari (erbicidi, pesticidi, fungicidi) sono originali, etichettati con pericoli H/CLP e stoccati in locale chiuso e ventilato?",
      normReference: "Reg. CLP 1272/2008; D.Lgs. 150/2012; DM 14/04/2004",
    },
    {
      orderIndex: 9, section: "chemical_fitosanitary", domain: "safety", area: "Fitosanitari e pesticidi", defaultSeverity: 4, defaultSanctionable: true,
      question: "Gli avanzi di prodotto fitosanitario, i contenitori vuoti e le acque di lavaggio sono gestiti come rifiuti speciali (non riversati in terra/acque)?",
      normReference: "D.Lgs. 152/2006, art. 188; Reg. CE 1107/2009, art. 70",
    },
    {
      orderIndex: 10, section: "chemical_fitosanitary", domain: "safety", area: "Fitosanitari e pesticidi", defaultSeverity: 3, defaultSanctionable: false,
      question: "Sono presenti la scheda di sicurezza (SDS) per ogni prodotto fitosanitario e la bacheca con i prodotti autorizzati?",
      normReference: "Reg. REACH 1907/2006, art. 31; Reg. CLP 1272/2008",
    },
    {
      orderIndex: 11, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 4, defaultSanctionable: true,
      question: "Gli stocchi di paglia, fieno, legna e le serre hanno distanze di sicurezza antincendio, estintori adeguati e divieto di fumo?",
      normReference: "DM 10/03/1998; D.Lgs. 81/2008, art. 46",
    },
    {
      orderIndex: 12, section: "fire_prevention", domain: "safety", area: "Cantina e stalla", defaultSeverity: 4, defaultSanctionable: true,
      question: "Nelle cantine sono presenti estintori e rilevatori di CO2 (rischio asfissia nei locali di fermentazione) con segnaletica di pericolo?",
      normReference: "D.Lgs. 81/2008, art. 208; DM 10/03/1998",
    },
    {
      orderIndex: 13, section: "fire_prevention", domain: "safety", area: "Cantina e stalla", defaultSeverity: 3, defaultSanctionable: false,
      question: "Le stalle hanno ventilazione naturale o forzata, illuminazione antideflagrante e separazione elettrica per ambienti umidi?",
      normReference: "CEI EN 60079; D.Lgs. 81/2008, Titolo VIII, Capo I",
    },
    {
      orderIndex: 14, section: "premises_equipment", domain: "safety", area: "Serre e strutture", defaultSeverity: 3, defaultSanctionable: true,
      question: "Le serre e i tunnel hanno strutture stabili, ancoraggi a terra, materiali ignifughi e vie di fuga libere?",
      normReference: "D.Lgs. 81/2008, Titolo VIII, Capo I; UNI EN 13031-1",
    },
    {
      orderIndex: 15, section: "premises_equipment", domain: "safety", area: "Magazzini", defaultSeverity: 3, defaultSanctionable: true,
      question: "I magazzini di stoccaggio frutta/verdura hanno temperatura controllata, igienizzazione e tracciabilita del lotto (registro carico/scarico)?",
      normReference: "Reg. CE 852/2004; Reg. CE 178/2002; D.Lgs. 193/2007 (traccing)",
    },
    {
      orderIndex: 16, section: "ppe", domain: "safety", area: "DPI", defaultSeverity: 3, defaultSanctionable: true,
      question: "Gli operatori agricoli indossano DPI specifici: stivali in gomma, guanti in nitrile/Neoprene, maschera respiratoria con filtro A2P3 durante i trattamenti?",
      normReference: "D.Lgs. 81/2008, Titolo IV, Capo II; Reg. UE 2016/425; DM 14/04/2004",
    },
    {
      orderIndex: 17, section: "ppe", domain: "safety", area: "DPI", defaultSeverity: 3, defaultSanctionable: true,
      question: "Gli operatori al sole estivo usano occhiali UV, cappello, protezione solare e dispongono di punti di ristoro con acqua potabile?",
      normReference: "D.Lgs. 81/2008, Titolo VIII, Capo I; Accordo Stato-Regioni 28/03/2006 (calore)",
    },
    {
      orderIndex: 18, section: "environmental", domain: "safety", area: "Rifiuti e reflui", defaultSeverity: 3, defaultSanctionable: true,
      question: "I reflui zootecnici (letame) sono stoccati in vasche impermeabili, coperte e gestiti secondo il Piano di Utilizzazione Agronomica?",
      normReference: "DM 07/04/2006 (PUA); D.Lgs. 152/2006, art. 104",
    },
    {
      orderIndex: 19, section: "environmental", domain: "safety", area: "Rifiuti e reflui", defaultSeverity: 3, defaultSanctionable: true,
      question: "I rifiuti speciali agricoli (oli usati, batterie, contenitori fitosanitari) sono conferiti a gestore autorizzato con FIR?",
      normReference: "D.Lgs. 152/2006, art. 188",
    },
    {
      orderIndex: 20, section: "environmental", domain: "safety", area: "Acqua e pozzi", defaultSeverity: 3, defaultSanctionable: true,
      question: "I pozzi e le cisterne per irrigazione sono protetti da inquinamento, con chiusura ermetica e distanza da fossi e zone trattate?",
      normReference: "D.Lgs. 152/2006, art. 120; Regione (normativa specifica pozzi)",
    },
    {
      orderIndex: 21, section: "ergonomics", domain: "safety", area: "Sollevamento e postura", defaultSeverity: 2, defaultSanctionable: false,
      question: "Sono previste pause durante la raccolta manuale, sollevamento carichi controllato e uso di carrelli/traspallet per pesi superiori a 25 kg?",
      normReference: "DM 19/09/1994; D.Lgs. 81/2008, art. 170",
    },
    {
      orderIndex: 22, section: "training_emergency", domain: "safety", area: "Formazione ed emergenza", defaultSeverity: 4, defaultSanctionable: true,
      question: "Gli operatori hanno ricevuto formazione specifica sui rischi agricoli: macchine, fitosanitari, sollevamento carichi, primo soccorso?",
      normReference: "Accordo Stato-Regioni 22/02/2012; D.Lgs. 81/2008, art. 36, 37",
    },
    {
      orderIndex: 23, section: "training_emergency", domain: "safety", area: "Formazione ed emergenza", defaultSeverity: 4, defaultSanctionable: true,
      question: "E' presente un addetto alla squadra antincendio formato e un piano di emergenza per incendi, fuoriuscite di gas e infortuni alle macchine?",
      normReference: "D.Lgs. 81/2008, art. 43, 46; DM 10/03/1998",
    },
    {
      orderIndex: 24, section: "documentation", domain: "both", area: "Documenti", defaultSeverity: 2, defaultSanctionable: false,
      question: "Il DVR/Documento di Valutazione Rischi e aggiornato con i rischi agricoli: macchine, fitosanitari, rumore, vibrazioni, calore, zoonosi?",
      normReference: "D.Lgs. 81/2008, art. 17, 28; D.Lgs. 150/2012",
    },
    {
      orderIndex: 25, section: "documentation", domain: "both", area: "Documenti", defaultSeverity: 2, defaultSanctionable: false,
      question: "Sono aggiornati i registri di trattamento, il Piano di Utilizzazione Agronomica e la documentazione di tracciabilita (lotto, provenienza)?",
      normReference: "D.Lgs. 150/2012; Reg. CE 178/2002; DM 07/04/2006",
    },
  ];

  // S8: idempotenza — wipe items dei template noti prima di ricrearli.
  await prisma.checklistItem.deleteMany({
    where: { templateId: genericTemplate.id },
  });
  await prisma.trainingChecklistItem.deleteMany({
    where: { templateId: trainingTemplate.id },
  });
  await prisma.trainingCourse.deleteMany({
    where: { targetAudience: "Lavoratori agricoli" },
  });

  await prisma.checklistItem.createMany({
    data: genericItems.map((i) => ({ ...i, templateId: genericTemplate.id })),
  });

  const trainingCourses = [
    { name: "Formazione base sicurezza lavoratori", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Obbligatoria per tutti i lavoratori" },
    { name: "Formazione rischio macchine agricole", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Trattoristi e operatori macchine" },
    { name: "Formazione prodotti fitosanitari", durationHours: 8, frequencyYears: 5, isMandatory: true, description: "Addetti spruzzazione e diserbo" },
    { name: "Formazione primo soccorso", durationHours: 4, frequencyYears: 3, isMandatory: true, description: "Squadra di primo soccorso in azienda" },
    { name: "Formazione antincendio", durationHours: 8, frequencyYears: 5, isMandatory: true, description: "Squadra antincendio in stalle/magazzini" },
    { name: "Formazione tracciabilita alimentare e HACCP", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Addetti raccolta/stoccaggio prodotti agricoli" },
    { name: "Formazione protezione radiazioni solari e calore", durationHours: 2, frequencyYears: 5, isMandatory: true, description: "Lavoratori stagionali estivi" },
  ];

  await prisma.trainingCourse.createMany({
    // S8: mappatura legacy → Prisma (durationHours → minHours, drop
    // isMandatory, default targetAudience/normReference).
    data: trainingCourses.map((c) => ({
      name: c.name,
      description: c.description,
      minHours: c.durationHours,
      frequencyYears: c.frequencyYears,
      targetAudience: "Lavoratori agricoli",
      normReference: "D.Lgs. 81/2008, art. 37; D.Lgs. 150/2012 (fitosanitari)",
    })),
  });

  const trainingItems = [
    { orderIndex: 1, section: "safety_training", domain: "safety", area: "Formazione generale", defaultSeverity: 4, defaultSanctionable: false, question: "Il lavoratore ha sostenuto la formazione base sicurezza con attestato valido?" },
    { orderIndex: 2, section: "safety_training", domain: "safety", area: "Rischio macchine", defaultSeverity: 4, defaultSanctionable: true, question: "I trattoristi e gli operatori di macchine agricole hanno ricevuto formazione specifica con aggiornamento quinquennale?" },
    { orderIndex: 3, section: "safety_training", domain: "safety", area: "Fitosanitari", defaultSeverity: 4, defaultSanctionable: true, question: "Gli operatori fitosanitari hanno la qualifica professionale e il patentino di abilitazione?" },
    { orderIndex: 4, section: "safety_training", domain: "safety", area: "Emergenza", defaultSeverity: 4, defaultSanctionable: true, question: "E' presente un addetto alla squadra antincendio con formazione e aggiornamento?" },
    { orderIndex: 5, section: "health_surveillance", domain: "safety", area: "Sorveglianza sanitaria", defaultSeverity: 3, defaultSanctionable: false, question: "Il lavoratore ha eseguito la visita medica di idoneita per rischio fitosanitario, rumore e calore?" },
  ];

  await prisma.trainingChecklistItem.createMany({
    data: trainingItems.map((i) => ({ ...i, templateId: trainingTemplate.id })),
  });

  console.log(`Seed Agricoltura completato: ${genericItems.length} item, ${trainingCourses.length} corsi, ${trainingItems.length} training item.`);
}
