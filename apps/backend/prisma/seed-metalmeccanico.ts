import { prisma } from "./_client.js";

export async function seedMetalmeccanico() {
  const sectorName = "Metalmeccanico";
  const macroGroup = "metalmechanics";

  const [genericTemplate, trainingTemplate] = await prisma.$transaction([
    prisma.checklistTemplate.upsert({
      where: { id: "tmpl-metal-generic-v1" },
      update: {},
      create: {
        id: "tmpl-metal-generic-v1",
        name: "Checklist Sicurezza Metalmeccanico - Generale",
        macroGroup,
        isActive: true,
        description:
          "Controlli HSE specifici per officine meccaniche, carpenteria, saldatura e lavorazione metalli.",
      },
    }),
    prisma.trainingChecklistTemplate.upsert({
      where: { id: "tmpl-metal-training-v1" },
      update: {},
      create: {
        id: "tmpl-metal-training-v1",
        name: "Formazione Metalmeccanico",
        isActive: true,
        description: "Corsi obbligatori per addetti metalmeccanici.",
      },
    }),
  ]);

  const genericItems = [
    {
      orderIndex: 1, section: "machinery_safety", domain: "safety", area: "Macchine utensili", defaultSeverity: 4, defaultSanctionable: true,
      question: "Le macchine utensili (torni, fresatrici, trapani) sono dotate di dispositivi di protezione (carter, schermi, interblocchi) conformi al D.Lgs. 81/08, Titolo III, Capo II?",
      normReference: "D.Lgs. 81/2008, art. 71, Titolo III, Capo II",
    },
    {
      orderIndex: 2, section: "machinery_safety", domain: "safety", area: "Macchine utensili", defaultSeverity: 4, defaultSanctionable: true,
      question: "È presente un registro delle verifiche periodiche delle macchine (manutenzione, controlli funzionali) con attestazione di idoneità da parte del responsabile?",
      normReference: "D.Lgs. 81/2008, art. 71, comma 5",
    },
    {
      orderIndex: 3, section: "machinery_safety", domain: "safety", area: "Macchine utensili", defaultSeverity: 3, defaultSanctionable: false,
      question: "Le macchine utensili sono fornite di libretto d'uso e manutenzione in italiano, con indicazioni sui rischi e DPI consigliati?",
      normReference: "D.Lgs. 81/2008, art. 70; D.Lgs. 17/2010 (direttiva macchine)",
    },
    {
      orderIndex: 4, section: "machinery_safety", domain: "safety", area: "Macchine utensili", defaultSeverity: 3, defaultSanctionable: true,
      question: "Le presse punzonatrici e cesoie sono dotate di doppio pulsante antirientro o altri dispositivi di sicurezza contro la chiusura accidentale?",
      normReference: "UNI EN ISO 16092-1; D.Lgs. 81/2008, art. 71",
    },
    {
      orderIndex: 5, section: "machinery_safety", domain: "safety", area: "Macchine utensili", defaultSeverity: 3, defaultSanctionable: false,
      question: "È vietato l'uso di guanti durante la lavorazione su macchine in movimento (torni, fresatrici)?",
      normReference: "D.Lgs. 81/2008, art. 74; buona prassi",
    },
    {
      orderIndex: 6, section: "welding_thermal", domain: "safety", area: "Saldatura e lavori termici", defaultSeverity: 4, defaultSanctionable: true,
      question: "Le postazioni di saldatura sono dotate di aspirazione localizzata dei fumi (ventilazione per aspirazione) conforme al D.Lgs. 81/08, Titolo VIII, Capo IV?",
      normReference: "D.Lgs. 81/2008, art. 209; Titolo VIII, Capo IV",
    },
    {
      orderIndex: 7, section: "welding_thermal", domain: "safety", area: "Saldatura e lavori termici", defaultSeverity: 4, defaultSanctionable: true,
      question: "I saldatori sono dotati di maschera con filtri specifici per fumi di saldatura e radiazioni UV (DIN adeguato) e guanti termoresistenti?",
      normReference: "D.Lgs. 81/2008, art. 74; EN 175, EN 379",
    },
    {
      orderIndex: 8, section: "welding_thermal", domain: "safety", area: "Saldatura e lavori termici", defaultSeverity: 4, defaultSanctionable: true,
      question: "Sono presenti idranti, estintori e pannelli antincendio idonei nelle vicinanze delle aree di taglio termico e saldatura?",
      normReference: "D.Lgs. 81/2008, art. 46; DM 10/03/1998",
    },
    {
      orderIndex: 9, section: "welding_thermal", domain: "safety", area: "Saldatura e lavori termici", defaultSeverity: 3, defaultSanctionable: false,
      question: "È vietato eseguire lavori termici (saldatura, taglio ossiacetilenico) in prossimità di materiali infiammabili senza permesso di lavoro a caldo?",
      normReference: "D.Lgs. 81/2008, art. 46, comma 3",
    },
    {
      orderIndex: 10, section: "welding_thermal", domain: "safety", area: "Saldatura e lavori termici", defaultSeverity: 3, defaultSanctionable: false,
      question: "I cilindri di gas (ossigeno, acetilene, argon) sono stoccati in area ventilata, lontani da fonti di calore, con catene o supporti antribaltamento?",
      normReference: "D.Lgs. 81/2008, art. 46; DM 10/03/1998, Allegato VI",
    },
    {
      orderIndex: 11, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 4, defaultSanctionable: true,
      question: "Sono presenti estintori adeguati alla classe di incendio (polvere per classi A/B/C, CO2 per elettrico) con revisione semestrale?",
      normReference: "DM 10/03/1998; UNI 9994-1",
    },
    {
      orderIndex: 12, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 4, defaultSanctionable: true,
      question: "I percorsi di emergenza e le uscite di sicurezza sono sgombre, illuminate e segnalate con cartelli fotoluminescenti?",
      normReference: "UNI EN ISO 7010; D.Lgs. 81/2008, art. 43",
    },
    {
      orderIndex: 13, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 3, defaultSanctionable: false,
      question: "Il materiale infiammabile (vernici, solventi, lubrificanti) è stoccato in armadio ventilato o locale apposito con segnaletica ADR/IMDG?",
      normReference: "D.Lgs. 81/2008, art. 224; DM 10/03/1998",
    },
    {
      orderIndex: 14, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 2, defaultSanctionable: false,
      question: "I locali di deposito di solventi/pitture sono dotati di prese e implanti elettrici di tipo antideflagrante (EX)?",
      normReference: "CEI EN 60079; D.Lgs. 81/2008, art. 224",
    },
    {
      orderIndex: 15, section: "ppe", domain: "safety", area: "DPI", defaultSeverity: 3, defaultSanctionable: true,
      question: "I lavoratori indossano DPI specifici per il rischio meccanico (occhiali di protezione, scarpe antinfortunistiche S3, guanti da lavoro)?",
      normReference: "D.Lgs. 81/2008, Titolo IV, Capo II; Reg. UE 2016/425",
    },
    {
      orderIndex: 16, section: "ppe", domain: "safety", area: "DPI", defaultSeverity: 3, defaultSanctionable: true,
      question: "I saldatori dispongono di schermi facciali, guanti isolanti, grembiali in pelle/cotone ignifugo e protezione acustica ove previsto?",
      normReference: "D.Lgs. 81/2008, art. 74; EN ISO 11611",
    },
    {
      orderIndex: 17, section: "ppe", domain: "safety", area: "DPI", defaultSeverity: 3, defaultSanctionable: false,
      question: "I DPI sono in buono stato, puliti, privi di difetti e sostituiti con scadenza; è presente il libretto DPI?",
      normReference: "D.Lgs. 81/2008, art. 76; Allegato IV",
    },
    {
      orderIndex: 18, section: "ergonomics", domain: "safety", area: "Ergonomia", defaultSeverity: 2, defaultSanctionable: false,
      question: "I banchi da lavoro per assemblaggio e ispezione sono regolabili in altezza con piano antiscivolo e illuminazione conforme UNI 12464-1?",
      normReference: "UNI EN 12464-1; D.Lgs. 81/2008, Titolo VIII, Capo I",
    },
    {
      orderIndex: 19, section: "ergonomics", domain: "safety", area: "Ergonomia", defaultSeverity: 2, defaultSanctionable: false,
      question: "Sono previste pause di recupero, stretching e rotazione mansioni per lavoratori ad alta ripetitività con tolleranza del CTU?",
      normReference: "D.Lgs. 81/2008, art. 182; DM 19/09/1994",
    },
    {
      orderIndex: 20, section: "environmental", domain: "safety", area: "Ambiente e rifiuti", defaultSeverity: 3, defaultSanctionable: true,
      question: "I rifiuti speciali (fanghi di sabbiatura, polveri di filtrazione, solventi esausti) sono conferiti a gestore autorizzato con formulario di tracciabilità (FIR)?",
      normReference: "D.Lgs. 152/2006, art. 188; DM 12/06/2020",
    },
    {
      orderIndex: 21, section: "environmental", domain: "safety", area: "Ambiente e rifiuti", defaultSeverity: 3, defaultSanctionable: true,
      question: "È presente ed aggiornato il registro di carico/scarico rifiuti (Registro di Stato dei Rifiuti, ex MUD) per le categorie interessate?",
      normReference: "D.Lgs. 152/2006, art. 190",
    },
    {
      orderIndex: 22, section: "environmental", domain: "safety", area: "Ambiente e rifiuti", defaultSeverity: 2, defaultSanctionable: false,
      question: "Le vasche e i contenitori per oli/lubrificanti usati sono dotati di coperchio, vaschetta di raccolta e segnaletica ambiente?",
      normReference: "D.Lgs. 152/2006, art. 188",
    },
    {
      orderIndex: 23, section: "procedures_hygiene",       domain: "both", area: "Procedure e igiene", defaultSeverity: 2, defaultSanctionable: false,
      question: "Sono disponibili e aggiornate le procedure operative per la gestione della sicurezza della saldatura, del taglio termico e della verniciatura?",
      normReference: "D.Lgs. 81/2008, art. 17, comma 1, lett. a)",
    },
    {
      orderIndex: 24, section: "training_emergency", domain: "safety", area: "Formazione ed emergenza", defaultSeverity: 4, defaultSanctionable: true,
      question: "I lavoratori addetti alla saldatura, alla movimentazione carichi e all'uso di gru a bandiera hanno ricevuto formazione specifica con attestazione di frequenza?",
      normReference: "Accordo Stato-Regioni 22/02/2012; D.Lgs. 81/2008, art. 36, 37",
    },
    {
      orderIndex: 25, section: "documentation", domain: "both", area: "Documenti", defaultSeverity: 2, defaultSanctionable: false,
      question: "Il DVR/Documento di Valutazione Rischi è aggiornato con riferimento specifico ai rischi meccanici, termici, chimici e alla movimentazione manuale?",
      normReference: "D.Lgs. 81/2008, art. 17, 28; DM 19/09/1994",
    },
  ];

  // S8: idempotenza — wipe items dei template noti prima di ricrearli
  // (createMany fallisce su unique [templateId, orderIndex] al 2° run).
  // Scope sui templateId metalmeccanico per non toccare altri seed.
  await prisma.checklistItem.deleteMany({
    where: { templateId: genericTemplate.id },
  });
  await prisma.trainingChecklistItem.deleteMany({
    where: { templateId: trainingTemplate.id },
  });
  // I trainingCourses non hanno unique su `name` né FK al template:
  // le dup non sono bloccanti, ma per pulizia idempotente dropiamo le
  // istanze esistenti del settore (matching su targetAudience uniforme).
  await prisma.trainingCourse.deleteMany({
    where: { targetAudience: "Lavoratori", normReference: { contains: "Accordo Stato-Regioni" } },
  });

  await prisma.checklistItem.createMany({
    data: genericItems.map((i) => ({ ...i, templateId: genericTemplate.id })),
  });

  const trainingCourses = [
    { name: "Formazione base sicurezza lavoratori", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Obbligatoria per tutti i lavoratori" },
    { name: "Formazione specifica rischio meccanico", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Addetti a macchine utensili, presse, trapani" },
    { name: "Formazione saldatura e lavori termici", durationHours: 8, frequencyYears: 5, isMandatory: true, description: "Saldatori, operatori taglio termico" },
    { name: "Formazione DPI III categoria", durationHours: 2, frequencyYears: 5, isMandatory: true, description: "Maschere respiratorie, imbracature, guanti termici" },
    { name: "Formazione movimentazione manuale carichi", durationHours: 2, frequencyYears: 5, isMandatory: true, description: "Operai e magazzinieri" },
    { name: "Formazione addetti antincendio", durationHours: 8, frequencyYears: 5, isMandatory: true, description: "Squadra emergenza e antincendio" },
    { name: "Formazione uso gru/carroponte", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Addetti alla conduzione" },
  ];

  await prisma.trainingCourse.createMany({
    // Mappatura S8: il dataset usa la nomenclatura legacy
    // (durationHours/isMandatory) — convertiamo ai field Prisma
    // (minHours, drop isMandatory) e iniettiamo i default required
    // (targetAudience, normReference).
    data: trainingCourses.map((c) => ({
      name: c.name,
      description: c.description,
      minHours: c.durationHours,
      frequencyYears: c.frequencyYears,
      targetAudience: "Lavoratori",
      normReference: "D.Lgs. 81/2008, art. 37; Accordo Stato-Regioni 22/02/2012",
    })),
  });

  const trainingItems = [
    { orderIndex: 1, section: "safety_training", domain: "safety", area: "Formazione generale", defaultSeverity: 4, defaultSanctionable: false, question: "Il lavoratore ha sostenuto la formazione base sicurezza con attestato valido?" },
    { orderIndex: 2, section: "safety_training", domain: "safety", area: "Formazione specifica", defaultSeverity: 4, defaultSanctionable: true, question: "Il lavoratore ha sostenuto la formazione specifica per il rischio meccanico/saldatura?" },
    { orderIndex: 3, section: "safety_training", domain: "safety", area: "Formazione DPI", defaultSeverity: 3, defaultSanctionable: false, question: "È stata erogata formazione sull'uso corretto dei DPI III categoria?" },
    { orderIndex: 4, section: "safety_training", domain: "safety", area: "Formazione emergenza", defaultSeverity: 4, defaultSanctionable: true, question: "I membri della squadra antincendio hanno ricevuto formazione con aggiornamento quinquennale?" },
    { orderIndex: 5, section: "health_surveillance", domain: "safety", area: "Sorveglianza sanitaria", defaultSeverity: 3, defaultSanctionable: false, question: "Il lavoratore ha eseguito la visita medica di idoneità specifica per rischio rumore, vibrazioni, metalli pesanti?" },
  ];

  await prisma.trainingChecklistItem.createMany({
    data: trainingItems.map((i) => ({ ...i, templateId: trainingTemplate.id })),
  });

  console.log(`Seed Metalmeccanico completato: ${genericItems.length} item, ${trainingCourses.length} corsi, ${trainingItems.length} training item.`);
}
