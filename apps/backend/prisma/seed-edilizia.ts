import { ChecklistSection, ComplianceDomain } from "@prisma/client";
import { prisma } from "./_client.js";

export async function seedEdilizia() {
  console.log("Seeding checklist Edilizia...");

  const ediliziaPremisesTemplate = await prisma.checklistTemplate.upsert({
    where: { id: "edilizia-premises-template-seed" },
    update: {
      name: "Checklist Edilizia - Cantiere e Attrezzature",
      description: "Controlli strutturali, impiantistici e sicurezza cantieri edili",
      atecoCode: "41.20",
      macroGroup: "EDILIZIA",
      isGeneral: false,
      isActive: true,
    },
    create: {
      id: "edilizia-premises-template-seed",
      name: "Checklist Edilizia - Cantiere e Attrezzature",
      description: "Controlli strutturali, impiantistici e sicurezza cantieri edili",
      atecoCode: "41.20",
      macroGroup: "EDILIZIA",
      isGeneral: false,
      isActive: true,
    },
  });

  const ediliziaProceduresTemplate = await prisma.checklistTemplate.upsert({
    where: { id: "edilizia-procedures-template-seed" },
    update: {
      name: "Checklist Edilizia - Procedure e Sicurezza",
      description: "Controlli procedurali, formazione, coordinamento e gestione emergenze cantieri",
      atecoCode: "41.20",
      macroGroup: "EDILIZIA",
      isGeneral: false,
      isActive: true,
    },
    create: {
      id: "edilizia-procedures-template-seed",
      name: "Checklist Edilizia - Procedure e Sicurezza",
      description: "Controlli procedurali, formazione, coordinamento e gestione emergenze cantieri",
      atecoCode: "41.20",
      macroGroup: "EDILIZIA",
      isGeneral: false,
      isActive: true,
    },
  });

  // Se la tabella ha gia item per questi template, saltiamo
  const existingPremises = await prisma.checklistItem.count({ where: { templateId: ediliziaPremisesTemplate.id } });
  const existingProcedures = await prisma.checklistItem.count({ where: { templateId: ediliziaProceduresTemplate.id } });

  if (existingPremises === 0) {
    const ediliziaPremisesItems = [
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 1, section: ChecklistSection.premises_equipment, area: "DVR", question: "DVR aggiornato con valutazione rischi specifici del cantiere (cadute, macchine, elettricita, incendio)?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 2, section: ChecklistSection.premises_equipment, area: "Organizzazione", question: "Nomina RSPP e preposti formalizzata e comunicata a tutto il personale del cantiere?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 3, section: ChecklistSection.premises_equipment, area: "Coordinamento", question: "PSC (Piano di Sicurezza e Coordinamento) o POS (Piano Operativo di Sicurezza) presente, aggiornato e noto a tutti?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 4, section: ChecklistSection.premises_equipment, area: "Coordinamento", question: "DUVRI (Documento Unico di Valutazione Rischi Interferenze) redatto per imprese esterne presenti in cantiere?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 5, section: ChecklistSection.premises_equipment, area: "Segnaletica", question: "Recinzione cantiere adeguata con cartelli obbligo DPI, divieto accesso e numero emergenza visibili?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 6, section: ChecklistSection.premises_equipment, area: "Accessi", question: "Accessi al cantiere controllati e registrati per visitatori, consegne e personale?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 7, section: ChecklistSection.premises_equipment, area: "Ponteggi", question: "Ponteggi e trabattelli conformi UNI EN 12810/12811, montati da personale qualificato con idoneita riscontrabile?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 8, section: ChecklistSection.premises_equipment, area: "Ponteggi", question: "Verifica periodica ponteggio documentata (mensile) con riscontro su conformita elementi strutturali?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 9, section: ChecklistSection.premises_equipment, area: "Cadute dall'alto", question: "DPI anticaduta (imbracature, cordini, ancoraggi) forniti a tutti i lavoratori in quota, con certificazione CE e libretto?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 10, section: ChecklistSection.premises_equipment, area: "Cadute dall'alto", question: "Reti di protezione, parapetti e piattaforme installati dove previsto e in buone condizioni?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 11, section: ChecklistSection.premises_equipment, area: "Cadute dall'alto", question: "Verifica periodica dispositivi anticaduta (cordini, imbracature) con registrazione scadenze?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 12, section: ChecklistSection.premises_equipment, area: "Macchine", question: "Trattori/scavatori con patentino conducente, libretto uso/manutenzione e revisioni in regola?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 13, section: ChecklistSection.premises_equipment, area: "Macchine", question: "Piattaforme aeree (PEMP) certificate, con libretto di manutenzione e revisione periodica?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 14, section: ChecklistSection.premises_equipment, area: "Macchine", question: "Gru/autogru con libretto, verifiche periodiche e operatori patentati/documentati?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 15, section: ChecklistSection.premises_equipment, area: "Macchine", question: "Seghe circolari, trapani, sabbiatrici con protezioni originali e sistemi di blocco funzionanti?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 16, section: ChecklistSection.premises_equipment, area: "Impianto elettrico", question: "Centrali elettriche cantiere in armadi protetti, con dispositivi differenziali e messa a terra?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 17, section: ChecklistSection.premises_equipment, area: "Impianto elettrico", question: "Cavi elettrici in buono stato, senza giunzioni improprie, dimensionati per i carichi, protetti da sollecitazioni meccaniche?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 18, section: ChecklistSection.premises_equipment, area: "Lavori elettrici", question: "PES/PAV nominati e documentati per lavori sotto tensione o vicino a parti attive?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 19, section: ChecklistSection.premises_equipment, area: "Antincendio", question: "Presidi antincendio adeguati al rischio cantiere (estintori a polvere/CO2, idranti se previsti) controllati entro scadenza?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 20, section: ChecklistSection.premises_equipment, area: "Antincendio", question: "Vie di esodo e uscite di emergenza dei locali provvisori/baracche libere e illuminate?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 21, section: ChecklistSection.premises_equipment, area: "Primo soccorso", question: "Cassette primo soccorso complete e posizionate in piu zone del cantiere con elenco contenuti visibile?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 22, section: ChecklistSection.premises_equipment, area: "Primo soccorso", question: "Addetti primo soccorso nominati e in numero adeguato in base ai lavoratori presenti?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 23, section: ChecklistSection.premises_equipment, area: "DPI", question: "Caschi, guanti, stivali, occhiali e abbigliamento alta visibilita forniti, in buono stato e utilizzati?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 24, section: ChecklistSection.premises_equipment, area: "DPI", question: "Maschere respiratorie e filtri specifici forniti per lavori con polveri/fumi/chimici, con riscontro formazione uso?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaPremisesTemplate.id, orderIndex: 25, section: ChecklistSection.premises_equipment, area: "Spazi confinati", question: "Se presenti, procedure spazi confinati redatte con piano di sorveglianza, DPI specifici e gas detector funzionanti?", defaultSeverity: 4, defaultSanctionable: true },
    ];
    await prisma.checklistItem.createMany({ data: ediliziaPremisesItems });
  }

  if (existingProcedures === 0) {
    const ediliziaProceduresItems = [
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 1, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione generale lavoratori (4h) svolta e attestati validi per TUTTO il personale in cantiere?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 2, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione specifica rischio ALTO (12h) svolta per tutti i lavoratori edili e aggiornamenti entro 5 anni?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 3, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione preposti (8h) svolta per capisquadra/capo cantiere con aggiornamenti entro 5 anni?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 4, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione RSPP (48h) in corso di validita per il responsabile prevenzione?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 5, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione addetti antincendio rischio MEDIO (8h) svolta con aggiornamenti entro 2 anni?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 6, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione primo soccorso svolta per addetti designati con attestati validi?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 7, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione lavori in quota, DPI anticaduta e imbracature svolta per lavoratori in piano superiore?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 8, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione specifica PES/PAV per lavoratori che eseguono lavori elettrici o vicini a parti sotto tensione?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 9, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione coordinamento sicurezza (DUVRI/CSC) per committente e coordinatori attiva?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 10, section: ChecklistSection.procedures_hygiene, area: "Formazione", question: "Formazione uso macchine movimento terra, piattaforme aeree e gru per operatori patentini?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 11, section: ChecklistSection.procedures_hygiene, area: "Documentazione", question: "Registro infortuni e near-miss aggiornato conforme D.Lgs. 81/2008, art. 18?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 12, section: ChecklistSection.procedures_hygiene, area: "Documentazione", question: "Verbali riunioni periodiche sicurezza e consultazione RLS documentati?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 13, section: ChecklistSection.procedures_hygiene, area: "Emergenze", question: "Piano emergenza e evacuazione cantiere redatto, affisso e noto a tutto il personale?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 14, section: ChecklistSection.procedures_hygiene, area: "Emergenze", question: "Esercitazione evacuazione/incendio svolta almeno semestralmente con verbale?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 15, section: ChecklistSection.procedures_hygiene, area: "Emergenze", question: "Numeri emergenza (118, pompieri, prefettura) affissi e squadra emergenza designata?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 16, section: ChecklistSection.procedures_hygiene, area: "Sorveglianza sanitaria", question: "Sorveglianza sanitaria attivata per tutti i lavoratori con idoneita specifica (lavoro in quota, amianto)?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 17, section: ChecklistSection.procedures_hygiene, area: "Appalti", question: "Imprese appaltatrici/subappaltatrici in possesso di DURC/posizione INAIL regolare e iscrizione INPS?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 18, section: ChecklistSection.procedures_hygiene, area: "Appalti", question: "DUVRI per ogni impresa esterna in presenza sul cantiere e registro interferenze aggiornato?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 19, section: ChecklistSection.procedures_hygiene, area: "Legionella", question: "Se presenti impianti idrici provvisori/baracche, piano controllo Legionella con campionamenti?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 20, section: ChecklistSection.procedures_hygiene, area: "Rumore", question: "Valutazione rischio rumore con piani azione e DPI auricolari forniti dove previsto?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 21, section: ChecklistSection.procedures_hygiene, area: "Vibrazioni", question: "Valutazione rischio vibrazioni per operatori martelli pneumatici e misure riduttive adottate?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 22, section: ChecklistSection.procedures_hygiene, area: "Amianto", question: "Se presente amianto/rifiuti contenenti, piano bonifica e lavoratori formati/registrati?", defaultSeverity: 4, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 23, section: ChecklistSection.procedures_hygiene, area: "Movimentazione", question: "Procedure movimentazione manuale carichi e mezzi di sollevamento rispettate con formazione?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 24, section: ChecklistSection.procedures_hygiene, area: "Lavoro notturno", question: "Se previsto lavoro notturno/straordinario, autorizzazioni INL e sorveglianza sanitaria adeguata?", defaultSeverity: 3, defaultSanctionable: true },
      { templateId: ediliziaProceduresTemplate.id, orderIndex: 25, section: ChecklistSection.procedures_hygiene, area: "Magazzino", question: "Materiali pericolosi (collanti, solventi, vernici) stoccati segregati con SDS visibili e accesso controllato?", defaultSeverity: 3, defaultSanctionable: true },
    ];
    await prisma.checklistItem.createMany({ data: ediliziaProceduresItems });
  }

  console.log(`Seeded Edilizia: ${existingPremises === 0 ? 25 : 0} premises + ${existingProcedures === 0 ? 25 : 0} procedures items.`);
}
