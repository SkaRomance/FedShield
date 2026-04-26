import { prisma } from "./_client.js";

export async function seedUffici() {
  const sectorName = "Uffici / Servizi IT";
  const macroGroup = "office-it";

  const [genericTemplate, trainingTemplate] = await prisma.$transaction([
    prisma.checklistTemplate.upsert({
      where: { id: "tmpl-office-generic-v1" },
      update: {},
      create: {
        id: "tmpl-office-generic-v1",
        name: "Checklist Sicurezza Uffici e Servizi IT - Generale",
        macroGroup,
        isActive: true,
        description:
          "Controlli HSE per uffici, sedi amministrative, sale riunioni e ambienti IT/server.",
      },
    }),
    prisma.trainingChecklistTemplate.upsert({
      where: { id: "tmpl-office-training-v1" },
      update: {},
      create: {
        id: "tmpl-office-training-v1",
        name: "Formazione Uffici / Servizi IT",
        isActive: true,
        description: "Corsi obbligatori per dipendenti di ufficio e tecnici IT.",
      },
    }),
  ]);

  const genericItems = [
    {
      orderIndex: 1, section: "workstations", domain: "safety", area: "Postazioni lavoro", defaultSeverity: 2, defaultSanctionable: false,
      question: "Le postazioni di lavoro (scrivanie, sedie, monitor) sono regolate per garantire ergonomia, distanza ottimale dallo schermo e illuminazione conforme UNI EN 12464-1?",
      normReference: "D.Lgs. 81/2008, Titolo VIII, Capo I; UNI EN 12464-1",
    },
    {
      orderIndex: 2, section: "workstations", domain: "safety", area: "Postazioni lavoro", defaultSeverity: 2, defaultSanctionable: false,
      question: "I cavi elettrici sotto le scrivanie sono raccolti in canaline o fascette per prevenire inciampi ed usura?",
      normReference: "D.Lgs. 81/2008, art. 80; CEI 64-8",
    },
    {
      orderIndex: 3, section: "workstations", domain: "safety", area: "Postazioni lavoro", defaultSeverity: 2, defaultSanctionable: false,
      question: "Le sedie sono regolabili in altezza e dotate di braccioli e supporto lombare?",
      normReference: "ISO 9241-5; D.Lgs. 81/2008, Titolo VIII, Capo I",
    },
    {
      orderIndex: 4, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 4, defaultSanctionable: true,
      question: "Sono presenti estintori a polvere o CO2 con revisione semestrale e cartello di manutenzione visibile?",
      normReference: "DM 10/03/1998; D.Lgs. 81/2008, art. 46",
    },
    {
      orderIndex: 5, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 4, defaultSanctionable: true,
      question: "I percorsi di emergenza, le scale e le uscite di sicurezza sono sgombre, illuminate e segnalate con cartelli fotoluminescenti UNI EN ISO 7010?",
      normReference: "UNI EN ISO 7010; D.Lgs. 81/2008, art. 43",
    },
    {
      orderIndex: 6, section: "fire_prevention", domain: "safety", area: "Antincendio", defaultSeverity: 3, defaultSanctionable: false,
      question: "È vietato fumare negli uffici e nelle vicinanze di armadi server, stamperie e magazzini carta?",
      normReference: "D.Lgs. 81/2008, art. 46, comma 3",
    },
    {
      orderIndex: 7, section: "electrical", domain: "safety", area: "Impianti elettrici", defaultSeverity: 3, defaultSanctionable: true,
      question: "L'impianto elettrico dell'ufficio è stato verificato con periodicità decennale e munito di verbale di conformità CEI 64-8?",
      normReference: "CEI 64-8; D.Lgs. 81/2008, art. 80",
    },
    {
      orderIndex: 8, section: "electrical", domain: "safety", area: "Impianti elettrici", defaultSeverity: 3, defaultSanctionable: false,
      question: "Le prese elettriche, multiprese e UPS sono di qualità certificata, senza sovraccarichi o adattatori pericolosi (prolunge su prolunge)?",
      normReference: "CEI 64-8; buona prassi elettrica",
    },
    {
      orderIndex: 9, section: "electrical", domain: "safety", area: "Impianti elettrici", defaultSeverity: 4, defaultSanctionable: true,
      question: "La sala server/DC è dotata di climatizzazione dedicata, rilevazione incendi a gas inerte (FM200/Novec) e UPS centralizzato con manutenzione periodica?",
      normReference: "UNI EN ISO/IEC 27001:2022, A.7.13 (sala server); D.Lgs. 81/2008, art. 80",
    },
    {
      orderIndex: 10, section: "first_aid", domain: "safety", area: "Pronto soccorso", defaultSeverity: 3, defaultSanctionable: false,
      question: "È presente almeno una cassetta di pronto soccorso con contenuto conforme DM 388/2003 e personale addicato al primo soccorso formato?",
      normReference: "DM 388/2003 (Allegato 1); D.Lgs. 81/2008, art. 45",
    },
    {
      orderIndex: 11, section: "first_aid", domain: "safety", area: "Pronto soccorso", defaultSeverity: 2, defaultSanctionable: false,
      question: "È visibile il numero di emergenza 118 e il defibrillatore (DAE) è accessibile con personale formato all'uso?",
      normReference: "D.Lgs. 81/2008, art. 45; DM 18/01/2001",
    },
    {
      orderIndex: 12, section: "access_security", domain: "safety", area: "Accessi e sicurezza fisica", defaultSeverity: 2, defaultSanctionable: false,
      question: "L'accesso agli uffici è controllato (badge, reception, telecamere) e il registro dei visitatori è aggiornato?",
      normReference: "D.Lgs. 81/2008, art. 43; Reg. UE 2016/679 (privacy)",
    },
    {
      orderIndex: 13, section: "access_security", domain: "safety", area: "Accessi e sicurezza fisica", defaultSeverity: 3, defaultSanctionable: false,
      question: "La sala server ha accesso ristretto a personale autorizzato, con log degli accessi e cablaggio strutturato (armadio rack chiuso a chiave)?",
      normReference: "UNI EN ISO/IEC 27001:2022, A.7.7; A.7.13",
    },
    {
      orderIndex: 14, section: "it_security", domain: "safety", area: "Cybersicurezza e Dato", defaultSeverity: 3, defaultSanctionable: true,
      question: "I PC aziendali hanno antivirus aggiornato, firewall attivo, crittografia del disco (BitLocker/FileVault) e password policy conforme?",
      normReference: "UNI EN ISO/IEC 27001:2022, A.8.5, A.8.7; Reg. UE 2016/679, art. 32",
    },
    {
      orderIndex: 15, section: "it_security", domain: "safety", area: "Cybersicurezza e Dato", defaultSeverity: 3, defaultSanctionable: true,
      question: "È vietato l'uso di chiavette USB non criptate o personali su PC aziendali; è attivo il DLP (Data Loss Prevention)?",
      normReference: "UNI EN ISO/IEC 27001:2022, A.8.12; A.13.2",
    },
    {
      orderIndex: 16, section: "it_security", domain: "safety", area: "Cybersicurezza e Dato", defaultSeverity: 3, defaultSanctionable: false,
      question: "I backup aziendali sono eseguiti con regolarita (giornaliero), verificati, conservati off-site/cloud e testati periodicamente?",
      normReference: "UNI EN ISO/IEC 27001:2022, A.8.13, A.12.3",
    },
    {
      orderIndex: 17, section: "it_security", domain: "safety", area: "Cybersicurezza e Dato", defaultSeverity: 2, defaultSanctionable: false,
      question: "I dipendenti hanno ricevuto formazione su phishing, gestione password forte e segnalazione incidenti IT?",
      normReference: "UNI EN ISO/IEC 27001:2022, A.6.3, A.7.2; Reg. UE 2016/679, art. 32",
    },
    {
      orderIndex: 18, section: "gdpr_privacy",       domain: "both", area: "Privacy e GDPR", defaultSeverity: 3, defaultSanctionable: true,
      question: "L'azienda ha nominato un DPO (Responsabile Protezione Dati) se applicabile e mantiene il registro delle attivita di trattamento (RAT)?",
      normReference: "Reg. UE 2016/679, art. 37, art. 30",
    },
    {
      orderIndex: 19, section: "gdpr_privacy",       domain: "both", area: "Privacy e GDPR", defaultSeverity: 3, defaultSanctionable: false,
      question: "Le copie fisiche di documenti sensibili sono conservate in armadi chiusi a chiave e distrutte con trituratrice alla scadenza?",
      normReference: "Reg. UE 2016/679, art. 5, par. 1, lett. e); art. 17",
    },
    {
      orderIndex: 20, section: "gdpr_privacy",       domain: "both", area: "Privacy e GDPR", defaultSeverity: 3, defaultSanctionable: false,
      question: "È presente l'informativa privacy ai clienti e ai dipendenti in modo visibile e accessibile?",
      normReference: "Reg. UE 2016/679, art. 13, art. 14",
    },
    {
      orderIndex: 21, section: "environment", domain: "safety", area: "Ambiente e comfort", defaultSeverity: 1, defaultSanctionable: false,
      question: "La temperatura e la qualita dell'aria negli uffici sono conformi ai limiti (20-26°C invernale, 23-27°C estivo, IAQ)?",
      normReference: "UNI 10339; D.Lgs. 81/2008, Titolo VIII, Capo I",
    },
    {
      orderIndex: 22, section: "environment", domain: "safety", area: "Ambiente e comfort", defaultSeverity: 1, defaultSanctionable: false,
      question: "È garantito un minimo di luce naturale o equivalente e le sorgenti luminose non generano abbagliamento (glare)?",
      normReference: "UNI EN 12464-1; D.Lgs. 81/2008, Titolo VIII, Capo I",
    },
    {
      orderIndex: 23, section: "environment", domain: "safety", area: "Ambiente e comfort", defaultSeverity: 1, defaultSanctionable: false,
      question: "Sono presenti piante, schermi acustici o altre misure per ridurre il rumore ambientale (sotto 40 dBA per ufficio concentrato)?",
      normReference: "UNI EN ISO 11690-1; D.Lgs. 81/2008, Titolo VIII, Capo II",
    },
    {
      orderIndex: 24, section: "training_emergency", domain: "safety", area: "Formazione ed emergenza", defaultSeverity: 4, defaultSanctionable: true,
      question: "I lavoratori hanno ricevuto formazione base sicurezza (accordo Stato-Regioni) con attestazione valida?",
      normReference: "Accordo Stato-Regioni 22/02/2012; D.Lgs. 81/2008, art. 36",
    },
    {
      orderIndex: 25, section: "training_emergency", domain: "safety", area: "Formazione ed emergenza", defaultSeverity: 4, defaultSanctionable: true,
      question: "Sono individuati e formati gli addetti alla squadra di emergenza e di primo soccorso con numero adeguato?",
      normReference: "D.Lgs. 81/2008, art. 43, 45; DM 388/2003",
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
    where: { targetAudience: "Lavoratori uffici/IT" },
  });

  await prisma.checklistItem.createMany({
    data: genericItems.map((i) => ({ ...i, templateId: genericTemplate.id })),
  });

  const trainingCourses = [
    { name: "Formazione base sicurezza lavoratori", durationHours: 4, frequencyYears: 5, isMandatory: true, description: "Obbligatoria per tutti i lavoratori" },
    { name: "Formazione specifica rischio ufficio/VDT", durationHours: 2, frequencyYears: 5, isMandatory: true, description: "Addetti uso video terminali e ufficio" },
    { name: "Formazione cybersicurezza e phishing", durationHours: 2, frequencyYears: 3, isMandatory: true, description: "Tutti i dipendenti con accesso a PC aziendali" },
    { name: "Formazione privacy e GDPR", durationHours: 2, frequencyYears: 3, isMandatory: true, description: "Responsabili HR, amministrazione, operatori dati personali" },
    { name: "Formazione emergenza ed evacuazione", durationHours: 2, frequencyYears: 5, isMandatory: true, description: "Tutti i dipendenti e nuove assunzioni" },
    { name: "Formazione gestione incidenti IT e DLP", durationHours: 2, frequencyYears: 3, isMandatory: true, description: "Team IT, responsabili di settore" },
    { name: "Formazione primo soccorso e BLSD", durationHours: 4, frequencyYears: 3, isMandatory: true, description: "Addetti al primo soccorso e defibrillazione" },
  ];

  await prisma.trainingCourse.createMany({
    // S8: mappatura legacy → Prisma (durationHours → minHours, drop
    // isMandatory, default targetAudience/normReference).
    data: trainingCourses.map((c) => ({
      name: c.name,
      description: c.description,
      minHours: c.durationHours,
      frequencyYears: c.frequencyYears,
      targetAudience: "Lavoratori uffici/IT",
      normReference: "D.Lgs. 81/2008, art. 37; GDPR 2016/679",
    })),
  });

  const trainingItems = [
    { orderIndex: 1, section: "safety_training", domain: "safety", area: "Formazione generale", defaultSeverity: 4, defaultSanctionable: false, question: "Il lavoratore ha sostenuto la formazione base sicurezza con attestato valido?" },
    { orderIndex: 2, section: "safety_training", domain: "safety", area: "Formazione VDT", defaultSeverity: 3, defaultSanctionable: false, question: "Il lavoratore addetto a VDT ha ricevuto formazione specifica su posture, pause e illuminazione?" },
    { orderIndex: 3, section: "safety_training", domain: "safety", area: "Cybersicurezza", defaultSeverity: 3, defaultSanctionable: true, question: "Il lavoratore ha completato il corso di cybersicurezza e phishing con quiz di verifica?" },
    { orderIndex: 4, section: "safety_training", domain: "safety", area: "Privacy GDPR", defaultSeverity: 3, defaultSanctionable: false, question: "I responsabili del trattamento dati hanno certificazione sulla privacy e GDPR?" },
    { orderIndex: 5, section: "safety_training", domain: "safety", area: "Emergenza", defaultSeverity: 4, defaultSanctionable: true, question: "Gli addetti alla squadra emergenza e primo soccorso hanno ricevuto formazione e aggiornamento triennale?" },
  ];

  await prisma.trainingChecklistItem.createMany({
    data: trainingItems.map((i) => ({ ...i, templateId: trainingTemplate.id })),
  });

  console.log(`Seed Uffici/Servizi IT completato: ${genericItems.length} item, ${trainingCourses.length} corsi, ${trainingItems.length} training item.`);
}
