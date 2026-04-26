import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedSanita() {
  const sectorName = "Sanita e Farmacie";
  const macroGroup = "healthcare";

  const [genericTemplate, trainingTemplate] = await prisma.$transaction([
    prisma.checklistTemplate.upsert({
      where: { id: "tmpl-sanita-generic-v1" },
      update: {},
      create: {
        id: "tmpl-sanita-generic-v1",
        name: "Checklist Sicurezza Sanita - Generale",
        macroGroup,
        isActive: true,
        description:
          "Controlli HSE per studi medici, ambulatori, farmacie, laboratori analisi e RSA.",
      },
    }),
    prisma.trainingChecklistTemplate.upsert({
      where: { id: "tmpl-sanita-training-v1" },
      update: {},
      create: {
        id: "tmpl-sanita-training-v1",
        name: "Formazione Sanita",
        isActive: true,
        description: "Corsi obbligatori per operatori sanitari e farmacisti.",
      },
    }),
  ]);

  const genericItems = [
    {
      orderIndex: 1, section: "premises_equipment", domain: "safety", area: "Locali e strutture", defaultSeverity: 3, defaultSanctionable: true,
      question: "I locali sono dotati di illuminazione adeguata, pavimenti antiscivolo e accessi privi di barriere architettoniche per i pazienti?",
      normReference: "D.Lgs. 81/2008, Titolo VIII, Capo II; DM 388/2003",
    },
    {
      orderIndex: 2, section: "premises_equipment", domain: "safety", area: "Locali e strutture", defaultSeverity: 3, defaultSanctionable: false,
      question: "Sono presenti cartelli informativi sull'igiene delle mani, percorsi e modalita di accesso per i diversi reparti?",
      normReference: "D.Lgs. 81/2008, art. 43; accordo Stato-Regioni 07/07/2016",
    },
    {
      orderIndex: 3, section: "premises_equipment", domain: "safety", area: "Antincendio", defaultSeverity: 4, defaultSanctionable: true,
      question: "Sono presenti estintori adeguati, idranti, rilevatori di fumo e piano di evacuazione specifico per pazienti con mobilita ridotta?",
      normReference: "DM 10/03/1998; D.Lgs. 81/2008, art. 46",
    },
    {
      orderIndex: 4, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 4, defaultSanctionable: true,
      question: "I percorsi di emergenza e le uscite di sicurezza sono sgombre, segnalate con cartelli fotoluminescenti e accessibili alle barelle?",
      normReference: "UNI EN ISO 7010; D.Lgs. 81/2008, art. 43",
    },
    {
      orderIndex: 5, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 3, defaultSanctionable: false,
      question: "I materiali infiammabili (alcool, solventi, ossigeno) sono stoccati in aree ventilate lontane da fonti di calore e con scheda di sicurezza?",
      normReference: "D.Lgs. 81/2008, art. 224; DM 10/03/1998, Allegato VI",
    },
    {
      orderIndex: 6, section: "ppe", domain: "safety", area: "DPI e biosicurezza", defaultSeverity: 3, defaultSanctionable: true,
      question: "Il personale sanitario dispone di guanti monouso, camici, mascherine FFP2/N95, occhiali e schermi facciali per procedure ad alto rischio?",
      normReference: "D.Lgs. 81/2008, Titolo IV, Capo II; Reg. UE 2016/425",
    },
    {
      orderIndex: 7, section: "ppe", domain: "safety", area: "DPI e biosicurezza", defaultSeverity: 4, defaultSanctionable: true,
      question: "E' presente e funzionante la stazione di lavaggio/disinfettazione delle mani all'ingresso e in ogni ambiente di cura?",
      normReference: "Accordo Stato-Regioni 07/07/2016; DM 388/2003",
    },
    {
      orderIndex: 8, section: "ppe", domain: "safety", area: "DPI e biosicurezza", defaultSeverity: 3, defaultSanctionable: false,
      question: "I guanti, le mascherine e i camici sono utilizzati correttamente, mai riutilizzati se monouso, e smaltiti in appositi contenitori (rifiuti speciali)?",
      normReference: "D.Lgs. 81/2008, art. 224; D.Lgs. 152/2006",
    },
    {
      orderIndex: 9, section: "procedures_hygiene",       domain: "both", area: "Sterilizzazione e disinfezione", defaultSeverity: 4, defaultSanctionable: true,
      question: "Gli strumenti medici riutilizzabili (dentali, chirurgici, podologici) sono sottoposti a cicli di sterilizzazione e tracciati con tracciabilita lotto?",
      normReference: "DM 28/09/2000 (sterilizzazione); Linee guida ISS 2019",
    },
    {
      orderIndex: 10, section: "procedures_hygiene",       domain: "both", area: "Sterilizzazione e disinfezione", defaultSeverity: 4, defaultSanctionable: true,
      question: "E' presente un autoclave con stampante per tracciare la data, il ciclo, l'operatore e gli strumenti sterilizzati?",
      normReference: "DM 28/09/2000; UNI EN 13060; UNI EN 285",
    },
    {
      orderIndex: 11, section: "procedures_hygiene",       domain: "both", area: "Sterilizzazione e disinfezione", defaultSeverity: 3, defaultSanctionable: false,
      question: "Le superfici di lavoro, i lettini e gli strumenti sono disinfettati tra un paziente e l'altro con detergente-disinfettante certificato?",
      normReference: "Accordo Stato-Regioni 07/07/2016; Linee guida ISS",
    },
    {
      orderIndex: 12, section: "procedures_hygiene",       domain: "both", area: "Gestione rifiuti", defaultSeverity: 4, defaultSanctionable: true,
      question: "I rifiuti sanitari (Rs-Ri) sono separati, conferiti in contenitori ADR e gestiti da gestore autorizzato con formulario di tracciabilita?",
      normReference: "D.Lgs. 152/2006, art. 188; DM 18/06/2003; DM 07/09/2020",
    },
    {
      orderIndex: 13, section: "procedures_hygiene",       domain: "both", area: "Gestione rifiuti", defaultSeverity: 3, defaultSanctionable: true,
      question: "I rifiuti speciali (farmaci scaduti, siringhe, aghi) sono raccolti in contenitori rigidi anti-foratura (cassette NSF)?",
      normReference: "DM 07/09/2020 (cassette NSF); D.Lgs. 152/2006",
    },
    {
      orderIndex: 14, section: "procedures_hygiene",       domain: "both", area: "Privacy e consenso", defaultSeverity: 3, defaultSanctionable: true,
      question: "E' presente l'informativa privacy GDPR ai pazienti, il consenso informato per le procedure e il registro dei trattamenti (RAT)?",
      normReference: "Reg. UE 2016/679, art. 13, 14, 30; D.Lgs. 81/2008, art. 55",
    },
    {
      orderIndex: 15, section: "procedures_hygiene",       domain: "both", area: "Farmacia", defaultSeverity: 3, defaultSanctionable: true,
      question: "In farmacia sono rispettate le distanze di esercizio, i turni di reperibilita e la documentazione di acquisto dei farmaci da banco?",
      normReference: "D.Lgs. 193/2006 (farmacia); DM 06/08/2015",
    },
    {
      orderIndex: 16, section: "first_aid", domain: "safety", area: "Pronto soccorso", defaultSeverity: 3, defaultSanctionable: false,
      question: "E' presente una cassetta di pronto soccorso con contenuto DM 388/2003 e personale addicato al primo soccorso formato?",
      normReference: "DM 388/2003; D.Lgs. 81/2008, art. 45",
    },
    {
      orderIndex: 17, section: "first_aid", domain: "safety", area: "Pronto soccorso", defaultSeverity: 2, defaultSanctionable: false,
      question: "E' presente e accessibile il defibrillatore (DAE) con personale formato BLSD?",
      normReference: "D.Lgs. 81/2008, art. 45; DM 18/01/2001",
    },
    {
      orderIndex: 18, section: "electrical", domain: "safety", area: "Impianti elettrici", defaultSeverity: 3, defaultSanctionable: true,
      question: "L'impianto elettrico e delle apparecchiature mediche e stato verificato con periodicità decennale e munito di verbale CEI 64-8?",
      normReference: "CEI 64-8; D.Lgs. 81/2008, art. 80",
    },
    {
      orderIndex: 19, section: "electrical", domain: "safety", area: "Apparecchiature mediche", defaultSeverity: 4, defaultSanctionable: true,
      question: "Le apparecchiature elettromedicali (ECG, defibrillatori, autoclavi) hanno la manutenzione programmata e il libretto di uso?",
      normReference: "DM 10/2009 (sicurezza apparecchiature mediche); D.Lgs. 81/2008, art. 70",
    },
    {
      orderIndex: 20, section: "environmental", domain: "safety", area: "Radiazioni", defaultSeverity: 3, defaultSanctionable: true,
      question: "Negli studi radiologici e' rispettata la sorveglianza dosimetrica, la tracciabilita dei raggi X e la segnaletica di pericolo?",
      normReference: "D.Lgs. 101/2020 (radiazioni); D.Lgs. 81/2008, art. 208",
    },
    {
      orderIndex: 21, section: "environmental", domain: "safety", area: "Radiazioni", defaultSeverity: 3, defaultSanctionable: false,
      question: "I locali con radiazioni ionizzanti sono dotati di spessore murario adeguato, dosimetri ambientali e accesso controllato?",
      normReference: "D.Lgs. 101/2020; DM 17/11/2004 (protezione radiazioni mediche)",
    },
    {
      orderIndex: 22, section: "training_emergency", domain: "safety", area: "Formazione ed emergenza", defaultSeverity: 4, defaultSanctionable: true,
      question: "Il personale sanitario ha ricevuto formazione specifica sul rischio biologico (virus, batteri, sangue), uso DPI e procedure di disinfezione?",
      normReference: "Accordo Stato-Regioni 22/02/2012; D.Lgs. 81/2008, art. 36, 37",
    },
    {
      orderIndex: 23, section: "training_emergency", domain: "safety", area: "Formazione ed emergenza", defaultSeverity: 4, defaultSanctionable: true,
      question: "E' presente un addetto alla squadra antincendio formato e un piano di evacuazione per pazienti allettati/disabili?",
      normReference: "D.Lgs. 81/2008, art. 43, 46; DM 10/03/1998",
    },
    {
      orderIndex: 24, section: "documentation", domain: "both", area: "Documenti", defaultSeverity: 2, defaultSanctionable: false,
      question: "Il DVR/Documento di Valutazione Rischi aggiorna i rischi biologici, chimici (anestetici), fisici (radiazioni) e ergonomici?",
      normReference: "D.Lgs. 81/2008, art. 17, 28",
    },
    {
      orderIndex: 25, section: "documentation", domain: "both", area: "Documenti", defaultSeverity: 2, defaultSanctionable: false,
      question: "Sono disponibili e aggiornate le procedure operative per la sterilizzazione, la gestione dei rifiuti sanitari e la risposta alle emergenze?",
      normReference: "D.Lgs. 81/2008, art. 17, comma 1, lett. a); DM 28/09/2000",
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
    where: { targetAudience: "Personale sanitario" },
  });

  await prisma.checklistItem.createMany({
    data: genericItems.map((i) => ({ ...i, templateId: genericTemplate.id })),
  });

  const trainingCourses = [
    { name: "Formazione base sicurezza lavoratori", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Obbligatoria per tutti i lavoratori" },
    { name: "Formazione rischio biologico e contagio", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Personale sanitario, OSS, infermieri" },
    { name: "Formazione sterilizzazione e disinfezione", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Operatore sterilizzazione e personale tecnico" },
    { name: "Formazione gestione rifiuti sanitari", durationHours: 2, frequencyYears: 5, isMandatory: true, description: "Personale addetto raccolta Rs-Ri" },
    { name: "Formazione primo soccorso e BLSD", durationHours: 4, frequencyYears: 3, isMandatory: true, description: "Addetti primo soccorso e defibrillazione" },
    { name: "Formazione protezione radiazioni", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Radiologi, dentisti, tecnici RX" },
    { name: "Formazione privacy GDPR e consenso informato", durationHours: 2, frequencyYears: 3, isMandatory: true, description: "Personale amministrativo e sanitario" },
  ];

  await prisma.trainingCourse.createMany({
    // S8: mappatura legacy → Prisma (durationHours → minHours, drop
    // isMandatory, default targetAudience/normReference).
    data: trainingCourses.map((c) => ({
      name: c.name,
      description: c.description,
      minHours: c.durationHours,
      frequencyYears: c.frequencyYears,
      targetAudience: "Personale sanitario",
      normReference: "D.Lgs. 81/2008, art. 37; D.Lgs. 230/1995 (radioprot.)",
    })),
  });

  const trainingItems = [
    { orderIndex: 1, section: "safety_training", domain: "safety", area: "Formazione generale", defaultSeverity: 4, defaultSanctionable: false, question: "Il lavoratore ha sostenuto la formazione base sicurezza con attestato valido?" },
    { orderIndex: 2, section: "safety_training", domain: "safety", area: "Rischio biologico", defaultSeverity: 4, defaultSanctionable: true, question: "Il personale sanitario ha ricevuto formazione specifica su prevenzione contagio, uso DPI e disinfezione?" },
    { orderIndex: 3, section: "safety_training", domain: "safety", area: "Sterilizzazione", defaultSeverity: 3, defaultSanctionable: false, question: "L'operatore addetto alla sterilizzazione ha ricevuto formazione sull'uso dell'autoclave e della tracciabilita?" },
    { orderIndex: 4, section: "safety_training", domain: "safety", area: "Primo soccorso", defaultSeverity: 4, defaultSanctionable: true, question: "Gli addetti al primo soccorso e BLSD hanno ricevuto formazione e aggiornamento triennale?" },
    { orderIndex: 5, section: "health_surveillance", domain: "safety", area: "Sorveglianza sanitaria", defaultSeverity: 3, defaultSanctionable: false, question: "Il lavoratore ha eseguito la visita medica di idoneita specifica per rischio biologico e vibrazioni?" },
  ];

  await prisma.trainingChecklistItem.createMany({
    data: trainingItems.map((i) => ({ ...i, templateId: trainingTemplate.id })),
  });

  console.log(`Seed Sanita completato: ${genericItems.length} item, ${trainingCourses.length} corsi, ${trainingItems.length} training item.`);
}
