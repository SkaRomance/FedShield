// Catalogo normativo e libreria verifiche sicurezza macchine e attrezzature
// D.Lgs. 81/2008 Titolo III (art. 70, 71, 73), Allegato V e VI,
// Direttiva Macchine 2006/42/CE (D.Lgs. 17/2010), Accordo Stato-Regioni 22/02/2012 (Attrezzature con patentino)
// e D.M. 11/04/2011 (Verifiche periodiche INAIL / ARPA ex art. 71 c. 11).

export interface MachineSafetyCheckDef {
  code: string;
  title: string;
  question: string;
  normReference: string;
  defaultSeverity: number;
  defaultSanctionable: boolean;
}

export interface MachineTrainingRequirementDef {
  courseCode: string;
  courseTitle: string;
  normReference: string;
  minHours: number;
  frequencyYears: number;
  requiresPatentinoAccordoSR: boolean;
  targetRoleDescription: string;
}

export interface SectorMachineTemplate {
  machineKey: string;
  name: string;
  type: string;
  suggestedManufacturer: string;
  suggestedModel: string;
  isSubjectToInailCheck: boolean; // Verifica periodica periodica ex art. 71 c. 11
  inailFrequencyYears?: number;
  training: MachineTrainingRequirementDef;
  safetyChecks: MachineSafetyCheckDef[];
}

export interface SectorMachineCatalog {
  sectorKey: string;
  sectorLabel: string;
  atecoPrefixes: string[];
  machines: SectorMachineTemplate[];
}

// -------------------------------------------------------------
// LIBRERIA DEI CORSI DI FORMAZIONE SPECIFICA PER ATTREZZATURE
// -------------------------------------------------------------
export const TRAINING_REQUIREMENTS_LIBRARY: Record<string, MachineTrainingRequirementDef> = {
  carrello_elevatore: {
    courseCode: "FORMAZ_CARRELLI",
    courseTitle: "Abilitazione alla Conduzione di Carrelli Elevatori Semoventi (Patentino Muletto)",
    normReference: "Accordo Stato-Regioni 22/02/2012, All. VI; D.Lgs. 81/2008 art. 73 c. 5",
    minHours: 12,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: true,
    targetRoleDescription: "Operatori incaricati dell'uso di carrelli elevatori semoventi con conducente a bordo",
  },
  ple: {
    courseCode: "FORMAZ_PLE",
    courseTitle: "Abilitazione Piattaforme di Lavoro Elevabili (PLE con e senza stabilizzatori)",
    normReference: "Accordo Stato-Regioni 22/02/2012, All. III; D.Lgs. 81/2008 art. 73 c. 5",
    minHours: 10,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: true,
    targetRoleDescription: "Operatori incaricati dell'uso di piattaforme aeree",
  },
  gru_autocarro: {
    courseCode: "FORMAZ_GRU_AUTOCARRO",
    courseTitle: "Abilitazione Gru per Autocarro",
    normReference: "Accordo Stato-Regioni 22/02/2012, All. IV; D.Lgs. 81/2008 art. 73 c. 5",
    minHours: 12,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: true,
    targetRoleDescription: "Conducenti e operatori di gru idrauliche montate su autocarro",
  },
  trattore_agricolo: {
    courseCode: "FORMAZ_TRATTORI",
    courseTitle: "Abilitazione Conduzione Trattori Agricoli o Forestali a Ruote e Cingoli",
    normReference: "Accordo Stato-Regioni 22/02/2012, All. VIII; D.Lgs. 81/2008 art. 73 c. 5",
    minHours: 8,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: true,
    targetRoleDescription: "Lavoratori che operano con trattrici agricole gommate o cingolate",
  },
  ponte_sollevatore: {
    courseCode: "FORMAZ_PONTI_SOLLEVATORI",
    courseTitle: "Addestramento all'Uso in Sicurezza di Ponti Sollevatori per Autoveicoli",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Meccanici, meccatronici e gommisti addetti al sollevamento autovetture",
  },
  macchine_alimentari: {
    courseCode: "FORMAZ_MACCHINE_ALIMENTARI",
    courseTitle: "Addestramento all'Uso Sicuro di Macchine Alimentari (Affettatrici, Impastatrici, Tritacarne)",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Personale di cucina, pasticceri, fornai, pizzaioli e banconisti",
  },
  macchine_utensili_metallo: {
    courseCode: "FORMAZ_MACCHINE_METALLO",
    courseTitle: "Addestramento all'Uso Sicuro di Macchine Utensili (Torni, Frese, Presse, Mole)",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    minHours: 8,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Operai metalmeccanici, tornitori, fresatori e montatori",
  },
  saldatura: {
    courseCode: "FORMAZ_SALDATURA",
    courseTitle: "Formazione e Addestramento per Operatori di Saldatura (Rischi Fumi, ROA e DPI III cat.)",
    normReference: "D.Lgs. 81/2008 art. 37, 73 e 77",
    minHours: 6,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Saldatori ad arco, a filo (MIG/MAG) e TIG",
  },
  macchine_legno: {
    courseCode: "FORMAZ_MACCHINE_LEGNO",
    courseTitle: "Addestramento all'Uso di Macchine per Lavorazione del Legno (Seghe Circolari, Pialle, Toupie)",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    minHours: 8,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Falegnami, serramentisti e addetti al taglio e sagomatura pannelli in legno",
  },
  transpallet_elettrico: {
    courseCode: "FORMAZ_TRANSPALLET",
    courseTitle: "Formazione e Addestramento all'Uso di Transpallet Elettrici e Commissionatori",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Magazzinieri e addetti alla movimentazione merci e picking",
  },
  attrezzature_generiche: {
    courseCode: "FORMAZ_ATTREZZATURE_BASE",
    courseTitle: "Formazione e Addestramento all'Uso delle Attrezzature di Lavoro",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 1-4",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Lavoratori che utilizzano attrezzature o macchinari aziendali",
  },
  macchine_bar_vapore: {
    courseCode: "FORMAZ_MACCHINE_BAR_VAPORE",
    courseTitle: "Addestramento all'Uso Sicuro di Macchine Espresso a Vapore e Attrezzature Bar",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4; D.Lgs. 26/2016 (PED)",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Baristi, barman e operatori di banco caffetteria addetti all'uso di macchine per caffè a vapore",
  },
  bombole_gas_compressi: {
    courseCode: "FORMAZ_BOMBOLE_GAS_COMPRESSI",
    courseTitle: "Formazione e Addestramento per la Movimentazione e Uso in Sicurezza di Bombole di Gas Compressi (CO2/Azoto)",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7, art. 73 c. 4 e Titolo XI",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Baristi, spillatori e personale addetto alla sostituzione e gestione bombole CO2/azoto",
  },
  antincendio_evac: {
    courseCode: "FORMAZ_ANTINCENDIO_EVAC",
    courseTitle: "Formazione e Addestramento Addetti Antincendio, Gestione Allarmi ed Evacuazione EVAC (Livello 2/3)",
    normReference: "D.M. 02/09/2021; D.Lgs. 81/2008 art. 37 c. 9, art. 43; D.M. 09/04/1994 e D.M. 03/09/2021",
    minHours: 8,
    frequencyYears: 3,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Addetti alle emergenze, reception e personale di presidio alberghiero abilitato antincendio",
  },
  gruppi_elettrogeni: {
    courseCode: "FORMAZ_GRUPPI_ELETTROGENI",
    courseTitle: "Formazione e Addestramento alla Conduzione e Gestione in Sicurezza di Gruppi Elettrogeni di Emergenza",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7, art. 73 c. 4; D.M. 13/07/2011; CEI 64-8",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Manutentori tecnici, responsabili impianti tecnologici e addetti ai servizi generali hotel",
  },
  ascensori_montacarichi: {
    courseCode: "FORMAZ_ASCENSORI_MANOVRA_EMERGENZA",
    courseTitle: "Istruzione e Addestramento alla Manovra di Emergenza e Soccorso Passeggeri in Ascensore",
    normReference: "D.P.R. 162/99 art. 15; UNI EN 81-20/28; D.Lgs. 81/2008 art. 71 c. 7",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Personale di reception, portieri di notte e tecnici manutentori addetti alle manovre di soccorso",
  },
  trattamento_acque_legionella: {
    courseCode: "FORMAZ_LEGIONELLA_RISCHIO_BIOLOGICO",
    courseTitle: "Formazione Specifica sulla Prevenzione e Controllo della Legionellosi e Gestione Prodotti Chimici Biocidi",
    normReference: "Accordo Stato-Regioni 07/05/2015; D.Lgs. 81/2008 Titolo X (Rischio Biologico) e Titolo IX; D.Lgs. 18/2023",
    minHours: 6,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Responsabili impianti idrici, manutentori dell'hotel e incaricati del dosaggio biocidi",
  },
  centrali_termiche_clima: {
    courseCode: "FORMAZ_CENTRALI_TERMICHE_CLIMA",
    courseTitle: "Conduzione e Manutenzione Sicura di Impianti Termici ad Alta Potenza e UTA (Patentino Conduzione Impianti Termici)",
    normReference: "D.Lgs. 152/2006 art. 287; D.Lgs. 81/2008 art. 71 c. 7; D.Lgs. 26/2016 (PED)",
    minHours: 8,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Conduttori di impianti termici, tecnici manutentori e operatori centrali tecnologiche hotel",
  },
  lavanderia_stireria_industriale: {
    courseCode: "FORMAZ_LAVANDERIA_STIRERIA_INDUSTRIALE",
    courseTitle: "Addestramento all'Uso Sicuro di Macchinari per Lavanderia e Stireria Industriale (Lavatrici, Essiccatori, Mangani)",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4; UNI EN ISO 10472",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Addetti al guardaroba, lavanderia, stireria e gestione biancheria hotel",
  },
  housekeeping_sanificazione: {
    courseCode: "FORMAZ_HOUSEKEEPING_SANIFICAZIONE",
    courseTitle: "Formazione Ergonomia, Movimentazione Carichi e Uso Sicuro Prodotti Chimici e Ozono nel Housekeeping",
    normReference: "D.Lgs. 81/2008 Titolo VI (MMC ISO 11228), Titolo IX (Agenti Chimici) e art. 71",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Governante, cameriere ai piani, facchini e addetti al riassetto e sanificazione camere",
  },
  buffet_colazioni_haccp: {
    courseCode: "FORMAZ_BUFFET_COLAZIONI_HACCP",
    courseTitle: "Addestramento all'Uso Sicuro di Attrezzature Calde/Refrigerate per Buffet e Igiene HACCP",
    normReference: "Reg. CE 852/2004; D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Personale di sala colazioni, camerieri, addetti al buffet e commis di sala",
  },
  housekeeping_bnb: {
    courseCode: "FORMAZ_HOUSEKEEPING_BNB",
    courseTitle: "Addetto Housekeeping, Rifacimento Camere e Pulizia B&B / Affittacamere",
    normReference: "D.Lgs. 81/2008 art. 71/73, Titolo VI MMC ISO 11228, Titolo IX Chimico",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Addetto Housekeeping, Rifacimento Camere e Pulizia B&B / Affittacamere (D.Lgs. 81/08 art. 71/73, Titolo VI MMC ISO 11228, Titolo IX Chimico - 4h)",
  },
  haccp_colazioni_extra_alberghiere: {
    courseCode: "FORMAZ_HACCP_COLAZIONI_BNB",
    courseTitle: "Operatore Addetto alla Somministrazione Colazioni Extra-Alberghiere",
    normReference: "Reg. CE 852/2004, D.Lgs. 81/2008 art. 71/73",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Operatore Addetto alla Somministrazione Colazioni Extra-Alberghiere (Reg. CE 852/2004, D.Lgs. 81/08 art. 71/73 - 4h)",
  },
  antincendio_livello_1: {
    courseCode: "FORMAZ_ANTINCENDIO_L1",
    courseTitle: "Addetto Antincendio in Attività a Livello 1",
    normReference: "D.M. 02/09/2021",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Addetto Antincendio in Attività a Livello 1 (D.M. 02/09/2021 - 4h)",
  },
  housekeeping_ostello: {
    courseCode: "FORMAZ_HOUSEKEEPING_OSTELLO",
    courseTitle: "Addetto Housekeeping, Riassetto Dormitori e Igiene Ambienti Comunitari",
    normReference: "D.Lgs. 81/2008 art. 71/73, Titolo VI MMC (ISO 11228) e Titolo IX Chimico",
    minHours: 4,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Addetti al riassetto dormitori, rifacimento letti a castello, igienizzazione e sanificazione ambienti comunitari (4h)",
  },
  antincendio_livello_2: {
    courseCode: "FORMAZ_ANTINCENDIO_L2",
    courseTitle: "Addetto Antincendio in Attività a Livello 2 (Strutture Ricettive Turistiche > 25 posti letto)",
    normReference: "D.M. 02/09/2021; D.Lgs. 81/2008 art. 37 c. 9, art. 43; D.M. 09/04/1994",
    minHours: 8,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Addetti alla squadra antincendio ed evacuazione in strutture ricettive turistico-alberghiere con oltre 25 posti letto (8h)",
  },
  bagnino_piscine_villaggio: {
    courseCode: "FORMAZ_BAGNINO_PISCINE_VILLAGGIO",
    courseTitle: "Assistente Bagnanti per Piscine e Parchi Acquatici di Strutture Ricettive",
    normReference: "Accordo Stato-Regioni 16/01/2003; UNI 10637; D.Lgs. 81/2008 art. 37 e 43; Brevetto FIN/SNS/FISA",
    minHours: 20,
    frequencyYears: 3,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Assistenti bagnanti e personale addetto alla sorveglianza vasche e soccorso in piscine e parchi acquatici di strutture ricettive all'aperto (validità 3 anni)",
  },
  manutentore_verde_motosega: {
    courseCode: "FORMAZ_MANUTENTORE_VERDE_MOTOSEGA",
    courseTitle: "Operatore Manutenzione del Verde, Uso Decespugliatore e Motosega",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4; Accordo Stato-Regioni 22/02/2012 e s.m.i.",
    minHours: 8,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Operatori addetti alla manutenzione del verde, sfalcio e potatura con motosega e decespugliatore (8h, validità 5 anni)",
  },
  antincendio_livello_3: {
    courseCode: "FORMAZ_ANTINCENDIO_L3",
    courseTitle: "Addetto Antincendio in Attività a Livello 3 (Campeggi e Villaggi Turistici > 400 persone)",
    normReference: "D.M. 02/09/2021; D.M. 28/02/2014; D.Lgs. 81/2008 art. 37 c. 9, art. 43 (con idoneità tecnica VVF)",
    minHours: 16,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Addetti alla squadra antincendio ed emergenza in campeggi e villaggi turistici con oltre 400 persone con idoneità tecnica VVF (16h, validità 5 anni)",
  },
  bagnino_acque_libere_mare: {
    courseCode: "FORMAZ_BAGNINO_MARE_MIP",
    courseTitle: "Assistente Bagnanti per Acque Libere e Mare (Brevetto MIP)",
    normReference: "FIN/SNS/FISA; Ordinanze Balneari Capitanerie di Porto; D.Lgs. 81/2008 art. 37 e 43",
    minHours: 30,
    frequencyYears: 3,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Assistenti bagnanti per acque libere e mare con brevetto MIP abilitato al salvamento e BLSD (30h, rinnovo triennale)",
  },
  operatore_puliscispiaggia: {
    courseCode: "FORMAZ_OPERATORE_PULISCISPIAGGIA",
    courseTitle: "Operatore Macchine Trattrici e Puliscispiaggia per Arenili",
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4-5; Accordo Stato-Regioni 22/02/2012 All. VIII",
    minHours: 8,
    frequencyYears: 5,
    requiresPatentinoAccordoSR: true,
    targetRoleDescription: "Operatori addetti all'uso di macchine operatrici e puliscispiaggia semoventi su arenile (8h, validità 5 anni)",
  },
  addetto_blsd_dae: {
    courseCode: "FORMAZ_BLSD_DAE",
    courseTitle: "Operatore Abilitato all'Uso del Defibrillatore Semiautomatico Esterno (BLSD/PBLSD)",
    normReference: "Legge 116/2021; D.M. 24/04/2013; D.Lgs. 81/2008 art. 45",
    minHours: 5,
    frequencyYears: 2,
    requiresPatentinoAccordoSR: false,
    targetRoleDescription: "Operatori abilitati all'uso del defibrillatore semiautomatico esterno (BLSD/PBLSD, 5h, rinnovo biennale)",
  },
};

// -------------------------------------------------------------
// CATALOGO MACCHINE PREFORMATO PER SETTORI ATECO
// -------------------------------------------------------------
export const SECTOR_MACHINERY_CATALOGS: SectorMachineCatalog[] = [
  // 0. RISTORAZIONE CON SOMMINISTRAZIONE (Ristoranti classici, Trattorie, Osterie - ATECO 56.10.11, 56.10.10, 56.10.1)
  {
    sectorKey: "ristorazione_somministrazione",
    sectorLabel: "Ristorazione con Somministrazione (Ristoranti, Trattorie, Osterie)",
    atecoPrefixes: ["56.10.11", "56.10.10", "56.10.1"],
    machines: [
      // --- REPARTO 1: COTTURA & BLOCCO FUOCHI (env-rist-cucina) ---
      {
        machineKey: "cucina_fuochi_gas",
        name: "Blocco Cottura Fuochi Aperti a Gas / Induzione",
        type: "Apparecchiatura di Cottura Professionale a Gas / Induzione",
        suggestedManufacturer: "Angelo Po / Zanussi / Modular",
        suggestedModel: "Monoblocco Gamma 700/900 Fuochi Aperti",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FUOCHI_TERMOCOPPIA_SICUREZZA",
            title: "Termocoppie di Sicurezza Fiamma su Tutti i Bruciatori",
            question: "Tutti i bruciatori aperti sono dotati di termocoppia di sicurezza e valvola elettromagnetica che interrompe istantaneamente l'erogazione del gas in caso di spegnimento accidentale della fiamma?",
            normReference: "UNI EN 203-1:2021 punto 5.3; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FUOCHI_MANOPOLE_FERMO_SICUREZZA",
            title: "Manopole di Comando con Fermo di Sicurezza Meccanico",
            question: "Le manopole di regolazione del gas sono provviste di scatto/fermo meccanico sulla posizione di chiuso e richiedono pressione assiale per l'apertura contro azionamenti accidentali?",
            normReference: "UNI EN 203-1 punto 5.2.2; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FUOCHI_GRIGLIE_GHISA_STABILITA",
            title: "Griglie d'Appoggio Pentole in Ghisa Complanari e Stabili",
            question: "Le griglie superiori d'appoggio pentole in ghisa pesante sono integre, complanari e dotate di incastri di fermo stabili per evitare il rovesciamento di recipienti contenenti liquidi bollenti?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; UNI EN 203-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FUOCHI_VALVOLA_INTERCETTAZIONE_GAS",
            title: "Valvola Manuale di Intercettazione Rapida Gas a Monte",
            question: "È presente una valvola a sfera di intercettazione rapida del gas a monte del blocco fuochi, segnalata, accessibile e libera da intralci per l'immediata chiusura di emergenza?",
            normReference: "D.M. 12/04/1996 punto 5.4; D.M. 03/09/2021; UNI 8723",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "forno_misto_ristorante",
        name: "Forno Combinato Convezione/Vapore Professionale",
        type: "Forno Professionale Convezione Vapore Gastronomia",
        suggestedManufacturer: "Rational / Unox / Lainox",
        suggestedModel: "iCombi Pro 6-10 teglie / Cheftop Mind.Maps",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FORNO_VETRO_VENTILATO_ANTIUSTIONE",
            title: "Porta con Doppio/Triplo Vetro Ventilato Anti-Ustione (UNI EN 203-1)",
            question: "La porta del forno è dotata di doppio o triplo vetro con intercapedine d'aria ventilata anti-ustione conforme a norma UNI EN 203-1 per mantenere la superficie esterna a temperatura non ustionante?",
            normReference: "UNI EN 203-1 punto 5.4; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_ARRESTO_VENTOLE_VAPORE",
            title: "Arresto Automatico Ventole e Vapore all'Apertura Porta",
            question: "All'apertura della porta del forno il moto delle ventole di convezione e l'erogazione di vapore vivo si arrestano istantaneamente prima dell'apertura completa dell'anta?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; Direttiva Macchine 2006/42/CE All. I p. 1.3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_CAPPA_CONDENSAZIONE_GRASSI",
            title: "Cappa a Condensazione Canalizzata con Scarico Grassi",
            question: "Il forno è dotato di cappa a condensazione vapori canalizzata con vaschetta di scarico grassi integrata o allacciata al sistema di aspirazione generale priva di sgocciolamenti a pavimento?",
            normReference: "Reg. CE 852/2004 All. II cap. I; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "FORNO_SCARICO_AIR_GAP",
            title: "Scarico Condense con Interruzione d'Aria Anti-Reflusso (Air Gap)",
            question: "La condotta di scarico condense della camera di cottura presenta uno stacco con interruzione d'aria aperta (air gap) per prevenire il reflusso fognario o batterico nella camera a norma UNI EN 1717?",
            normReference: "UNI EN 1717; Reg. CE 852/2004 All. II cap. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "friggitrice_ristorante",
        name: "Friggitrice Professionale a Vasca Singola o Doppia",
        type: "Apparecchiatura Professionale di Cottura ad Olio",
        suggestedManufacturer: "Lotus / Angelo Po / Giorik",
        suggestedModel: "F18-94G / SuperFry 20L",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FRIGGITRICE_TERMOSTATO_MAX_230",
            title: "Termostato di Massima Temperatura a Riarmo Manuale (< 230°C)",
            question: "La friggitrice è equipaggiata con termostato di massima temperatura indipendente a riarmo manuale tarato sotto i 230°C contro l'autocombustione dell'olio in caso di avaria del termostato di lavoro?",
            normReference: "UNI EN 203-1:2021; D.Lgs. 81/2008 art. 71 e All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_VALVOLA_SCARICO_SICURA",
            title: "Valvola di Scarico Olio con Sicura Meccanica e Prolunga",
            question: "Il rubinetto di scarico dell'olio caldo è provvisto di sicura meccanica contro l'apertura involontaria e di prolunga metallica per il travaso in sicurezza nel contenitore di raccolta?",
            normReference: "D.Lgs. 81/2008 All. V p. 7; UNI EN 203-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_ZONA_FREDDA_DECANTATORE",
            title: "Zona Fredda Fondo Vasca e Controllo Composti Polari",
            question: "La vasca dispone di zona fredda sul fondo per la decantazione dei residui e viene eseguito il monitoraggio periodico della qualità dell'olio con composti polari rigorosamente < 25%?",
            normReference: "Reg. CE 852/2004; Circ. Min. Sanità 11/01/1991 n. 1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_LIVELLO_OLIO_MIN_MAX",
            title: "Tacche di Livello Minimo e Massimo Olio Incise in Vasca",
            question: "Sulla parete interna della vasca sono chiaramente incisi i livelli minimo e massimo dell'olio per prevenire incendi per scarso volume o traboccamenti durante l'immersione dei cestelli?",
            normReference: "UNI EN 203-1 punto 5.5; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "abbattitore_temperatura",
        name: "Abbattitore Rapido di Temperatura e Surgelatore (+90°C a +3°C / -18°C)",
        type: "Apparecchiatura Frigorifera Rapida per Sicurezza Alimentare",
        suggestedManufacturer: "Irinox / Coldline / Lainox",
        suggestedModel: "MultiFresh Next / Vision Pro",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "ABBATTITORE_BONIFICA_ANISAKIS",
            title: "Bonifica Preventiva Obbligatoria Anisakis Pesce Crudo (Reg. CE 853/04)",
            question: "L'apparecchio dispone del programma certificato di bonifica preventiva Anisakis (temperatura a cuore <= -20°C per almeno 24h o -35°C per 15h) con registrazione ciclo per preparazioni di pesce crudo?",
            normReference: "Reg. CE 853/2004 All. III sez. VIII cap. 3; D.M. 17/07/2013; D.Lgs. 81/2008",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_SONDA_CUORE_SPILLONE",
            title: "Sonda al Cuore Multipoint a Spillone Igienizzabile",
            question: "La sonda termometrica a spillone è integra, tarata e viene igienizzata e disinfettata prima e dopo ogni inserimento al cuore degli alimenti per prevenire contaminazioni crociate?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_ALLARME_PORTA_VENTOLE",
            title: "Allarme Visivo/Acustico Porta Aperta e Arresto Ventole",
            question: "L'abbattitore è provvisto di allarme visivo e acustico per porta aperta prolungata e di arresto automatico dei ventilatori di evaporazione al sollevamento/apertura dell'anta?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; CEI EN 60335-2-89",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "ABBATTITORE_CIRCUITO_UNI_EN_378",
            title: "Circuito Frigorifero Sigillato Conforme UNI EN 378 (Gas Ecologico)",
            question: "Il circuito frigorifero risponde alla norma UNI EN 378, con gas refrigerante ecologico a basso GWP (R290 o R452A) ed è privo di perdite o formazioni anomale di ghiaccio sull'evaporatore?",
            normReference: "UNI EN 378:2020; Reg. UE 517/2014; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "frytop_piastra",
        name: "Piastra Fry-Top Elettrica o a Gas Liscia/Rigata",
        type: "Apparecchiatura di Cottura a Contatto Diretto",
        suggestedManufacturer: "Angelo Po / Zanussi / Giorik",
        suggestedModel: "FT70G / FryTop 900 Cromo Duro",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FRYTOP_PARASPRUZZI_INOX",
            title: "Paraspruzzi Perimetrale Inox Amovibile Anti-Schizzi d'Olio Caldo",
            question: "La piastra è dotata di paraspruzzi perimetrale continuo amovibile in acciaio inox a protezione delle braccia e del viso dell'operatore contro schizzi di grasso rovente?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; UNI EN 203-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRYTOP_CASSETTO_RACCOGLIGRASSO",
            title: "Cassetto Raccogligrasso Estraibile con Fermo Corsa Meccanico",
            question: "Il cassetto di raccolta grassi è estraibile, munito di fermo corsa meccanico anticaduta per evitare ribaltamenti accidentali di liquidi caldi durante l'estrazione e di capacità adeguata?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; UNI EN 203-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRYTOP_TERMOSTATO_SICUREZZA",
            title: "Termostato di Sicurezza a Riarmo Manuale Sovratemperatura",
            question: "La piastra è dotata di termostato di limite massimo di sicurezza indipendente a riarmo manuale che disattiva l'alimentazione in caso di anomalia del termostato di regolazione?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FRYTOP_TERMOCOPPIA_FIAMMA",
            title: "Termocoppia di Sicurezza Fiamma e Accensione Elettrica (Gas)",
            question: "Nelle versioni a gas, ciascun bruciatore della piastra è provvisto di termocoppia rapida per l'intercettazione del gas e dispositivo di accensione piezoelettrico o pilota?",
            normReference: "UNI EN 203-1 punto 5.3; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "bollitore_cuocipasta",
        name: "Cuocipasta Automatico / Bollitore a Cestelli",
        type: "Apparecchiatura Termica di Cottura Idrica",
        suggestedManufacturer: "Lotus / Angelo Po / Modular",
        suggestedModel: "CP-74G / PastaPro 40L",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CUOCIPASTA_SFIORATORE_TROPPOPIENO",
            title: "Scarico Sfioratore Troppopieno per Evacuazione Amidi e Schiume",
            question: "La vasca è provvista di zona di sfioramento frontale con foro di troppopieno collegato a scarico canalizzato per l'evacuazione continua di amidi e schiume ed evitare traboccamenti d'acqua bollente?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CUOCIPASTA_RUBINETTO_CARICO_ACQUA",
            title: "Rubinetto Carico Acqua Incorporato con Valvola di Non Ritorno",
            question: "Il rubinetto di carico e rabbocco acqua è incorporato stabilmente sul piano vasca ed è dotato di dispositivo di non ritorno a tutela della rete idrica potabile conforme UNI EN 1717?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CUOCIPASTA_TERMOSTATO_SICUREZZA_SECCO",
            title: "Termostato di Sicurezza contro il Surriscaldamento a Secco",
            question: "La vasca è equipaggiata con termostato/pressostato di sicurezza a riarmo manuale che arresta il riscaldamento a gas o elettrico in caso di livello d'acqua insufficiente o funzionamento a secco?",
            normReference: "D.Lgs. 81/2008 All. V p. 7; CEI EN 60335-2-47",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CUOCIPASTA_CESTELLI_MANICI_ISOLATI",
            title: "Cestelli Forati Inox con Manici Termoisolanti Ergonomici",
            question: "I cestelli forati di cottura e scolo sono in acciaio inox idoneo MOCA, con manici rivestiti in materiale termoisolante antiscivolo integri e ganci di sgocciolamento stabili sul bordo vasca?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "cappa_aspirazione_cucina",
        name: "Cappa di Aspirazione Compensata con Impianto Estinzione Automatica",
        type: "Impianto di Aspirazione e Trattamento Aria Cucina con Antincendio",
        suggestedManufacturer: "Alvial / Misa / Giga",
        suggestedModel: "Compensata Induzione 3000 con Ansul R-102",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CAPPA_FILTRI_LABIRINTO_INOX",
            title: "Filtri a Labirinto Antigrasso in Acciaio Inox Lavabili",
            question: "La cappa è equipaggiata con filtri a labirinto inerziali in acciaio inox lavabili, inclinati a 45°, provvisti di canalina di raccolta e bacinella raccogli-olio a svuotamento programmato?",
            normReference: "UNI EN 16282-6; Reg. CE 852/2004 All. II cap. I; D.Lgs. 81/2008 art. 64",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_IMPIANTO_SPEGNIMENTO_ANSUL",
            title: "Impianto Automatico di Spegnimento a Pioggia Tipo Ansul R-102",
            question: "Sopra il blocco fuochi e le friggitrici è installato un impianto fisso di spegnimento a pioggia tipo Ansul R-102 a norma NFPA 96 / UNI ISO 15371 con bombola ad agente estinguente F e comando manuale di emergenza?",
            normReference: "NFPA 96; UNI ISO 15371; D.M. 03/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_CANALIZZAZIONE_TETTO_INDIPENDENTE",
            title: "Canalizzazione di Estrazione Fumi a Tetto Indipendente",
            question: "La condotta di estrazione fumi è indipendente a tenuta d'aria, sfociante a tetto sopra il colmo, priva di contropendenze e munita di portelle per l'ispezione e bonifica periodica?",
            normReference: "UNI EN 16282-7; D.Lgs. 81/2008 art. 64 e All. IV p. 1.9",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_INTERBLOCCO_ELETTROVALVOLA_GAS",
            title: "Asservimento Elettrovalvola Gas al Funzionamento Aspiratore",
            question: "L'erogazione del gas ai fuochi è asservita al funzionamento del ventilatore di estrazione cappa tramite pressostato o relè differenziale che ne blocca l'adduzione ad aspiratore fermo?",
            normReference: "D.M. 12/04/1996 punto 5.4; D.M. 03/09/2021; UNI 8723",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 2: PREPARAZIONE FREDDA & LAVORAZIONE (env-rist-prep-fredda) ---
      {
        machineKey: "affettatrice_gravita_ristorante",
        name: "Affettatrice Professionale a Gravità per Salumi Lama 350 mm",
        type: "Macchina per il Taglio e Affettamento Carni e Salumi",
        suggestedManufacturer: "Berkel / Sirman / RGV",
        suggestedModel: "Domina 350 / Palladio 350 Autocheck",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "AFFETTATRICE_ANELLO_FISSO_PARALAMA",
            title: "Anello Fisso Paralama Continuo a Norma UNI EN 1974",
            question: "L'affettatrice è munita di anello fisso di protezione continuo che copre l'intero profilo circolare della lama non impegnato dal taglio conforme a norma UNI EN 1974?",
            normReference: "UNI EN 1974:2010 punto 5.2.2; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_BLOCCO_CARRO_SPESSORE_ZERO",
            title: "Blocco Carro Portamerce a Spessore Zero della Vela per Pulizia Sicura",
            question: "Il carro scorrevole portamerce può essere sfilato per la pulizia e sanificazione solo con la manopola graduata dello spessore posizionata rigorosamente su '0' (filo lama coperto dalla vela)?",
            normReference: "UNI EN 1974:2010 punto 5.2.4; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_RELE_MINIMA_TENSIONE",
            title: "Relè di Minima Tensione Anti-Riavvio Spontaneo",
            question: "La pulsantiera di comando marcia/arresto (IP65) è dotata di relè di minima tensione che impedisce categoricamente il riavvio spontaneo dopo una momentanea interruzione di corrente?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_PRESSAMERCE_SCHERMO_DITA",
            title: "Pressamerce Ergonomico con Schermo Trasparente Salvadita",
            question: "Il pressamerce è dotato di maniglia ergonomica protetta e schermo trasparente in policarbonato integro a salvaguardia delle dita dell'operatore durante l'avanzamento verso la lama?",
            normReference: "UNI EN 1974:2010 punto 5.2.3; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "cutter_robot_tagliaverdure",
        name: "Cutter Robot / Tagliaverdure Professionale Combinato",
        type: "Robot Tagliaverdure e Cutter da Banco per Ristorazione",
        suggestedManufacturer: "Robot Coupe / Dito Sama / Sammic",
        suggestedModel: "R 301 Ultra / Bermixer Dito",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CUTTER_COPERCHIO_INTERBLOCCO_2SEC",
            title: "Coperchio Trasparente Interbloccato con Arresto Lama entro 2 Secondi (UNI EN 12852)",
            question: "Il coperchio trasparente della vasca cutter è interbloccato con microinterruttore di sicurezza che arresta la rotazione della lama entro 2 secondi dal sollevamento a norma UNI EN 12852?",
            normReference: "UNI EN 12852:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_PESTELLO_SALVADITA",
            title: "Pestello Salvadita Sagomato per Tramoggia Tagliaverdure",
            question: "La testata tagliaverdure dispone del pestello sagomato obbligatorio per l'avanzamento degli ortaggi nella tramoggia con divieto assoluto di spinta manuale delle verdure?",
            normReference: "UNI EN 1678:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_BLOCCO_VASCA_MECCANICO",
            title: "Blocco Vasca Meccanico con Microinterruttore di Consenso",
            question: "Il basamento motore impedisce la rotazione dell'albero motore qualora la vasca di lavorazione in acciaio inox non sia perfettamente inserita e bloccata in posizione di lavoro?",
            normReference: "UNI EN 12852; Direttiva Macchine 2006/42/CE All. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_PULSANTIERA_IP65_PULSE",
            title: "Pulsantiera Bassa Tensione IP65 con Funzione Impulso (Pulse)",
            question: "I pulsanti di comando marcia/arresto sono a tenuta stagna IP65 in bassissima tensione di sicurezza con tasto impulso (Pulse) per lavorazioni intermittenti di precisione?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2.1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "confezionatrice_sottovuoto_ristorante",
        name: "Confezionatrice Sottovuoto a Campana da Banco per Sous-Vide e Conservazione",
        type: "Macchina per Confezionamento Sottovuoto Professionale",
        suggestedManufacturer: "Orved / Besser Vacuum / Valko",
        suggestedModel: "Evox 30 / Mistral 40",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SOTTOVUOTO_COPERCHIO_PISTONI_ANTICADUTA",
            title: "Coperchio in Plexiglass con Pistoni Anticaduta",
            question: "La campana trasparente in plexiglass ad alto spessore è sostenuta da pistoni oleodinamici anticaduta perfettamente efficienti che evitano la caduta improvvisa del coperchio sulle mani dell'operatore?",
            normReference: "Direttiva Macchine 2006/42/CE; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SOTTOVUOTO_BARRE_SALDANTI_SCHERMATE",
            title: "Barre Saldanti Teflonate Schermate con Spegnimento a Campana Sollevata",
            question: "Le barre saldanti teflonate sono schermate e la linea elettrica di saldatura viene diseccitata istantaneamente quando la campana non è chiusa in camera di vuoto?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SOTTOVUOTO_POMPA_DISOLEATORE_FUMI",
            title: "Pompa a Bagno d'Olio con Disoleatore Fumi e Deumidificazione",
            question: "La pompa a vuoto rotativa a bagno d'olio è munita di filtro disoleatore allo scarico fumi integro per prevenire emissioni nell'aria del laboratorio e ciclo di deumidificazione olio programmato?",
            normReference: "Reg. CE 852/2004; D.Lgs. 81/2008 art. 64 e art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "SOTTOVUOTO_SENSORE_VUOTO_SOUSVIDE",
            title: "Sensore di Vuoto Assoluto per Sicurezza Cottura Sous-Vide",
            question: "La macchina è provvista di sensore di vuoto assoluto per garantire una percentuale residua di ossigeno idonea alla conservazione e alla cottura a bassa temperatura in sicurezza microbiologica (HACCP)?",
            normReference: "Reg. CE 852/2004; Linee Guida Ministeriali HACCP Cottura Sottovuoto",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "tritacarne_grattugia_ristorante",
        name: "Gruppo Combinato Tritacarne / Grattugia Elettrica Professionale",
        type: "Macchina Combinata per Macinazione Carne e Grattugia Formaggio",
        suggestedManufacturer: "Fimar / Sirman / Omega",
        suggestedModel: "TCG 12 / Combinato C/E 22",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "TRITACARNE_BOCCA_SALVADITA_12331",
            title: "Bocca Salvadita Collo h >= 120 mm Foro Max 52 mm (UNI EN 12331)",
            question: "La bocca di carico del tritacarne presenta un collo di altezza pari ad almeno 120 mm con foro massimo di 52 mm a norma UNI EN 12331 per impedire il contatto accidentale delle dita con la coclea?",
            normReference: "UNI EN 12331:2021; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TRITACARNE_LEVA_GRATTUGIA_INTERBLOCCO",
            title: "Leva Pressore Grattugia Interbloccata a Microinterruttore (UNI EN 454)",
            question: "La leva pressamerce della bocca grattugia è dotata di microinterruttore di sicurezza che arresta istantaneamente la rotazione del rullo dentato quando sollevata sopra l'angolo di sicurezza?",
            normReference: "UNI EN 454; UNI EN 12331; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TRITACARNE_PESTELLO_PLASTICO_MOCA",
            title: "Pestello Plastico MOCA con Divieto Assoluto Spinta Manuale",
            question: "È fornito di serie il pestello sagomato in plastica alimentare MOCA conforme Reg. CE 1935/2004, integro e utilizzato obbligatoriamente con divieto tassativo di spinta manuale del prodotto?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 81/2008 art. 71 e All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TRITACARNE_GRIGLIA_SCARICO_GRATTUGIA",
            title: "Griglia Fissa di Protezione Inferiore Scarico Grattugia",
            question: "La bocca inferiore di scarico del formaggio grattugiato è provvista di griglia metallica fissa anti-intrusione dita verso il rullo in rotazione?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; UNI EN ISO 13857",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "frullatore_immersione_mixer",
        name: "Mixer / Frullatore ad Immersione Professionale",
        type: "Attrezzatura Portatile di Miscelazione ed Emulsione ad Immersione",
        suggestedManufacturer: "Robot Coupe / Dito Sama / Dynamic",
        suggestedModel: "Micromix / Bermixer Pro / Master MX 91",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "MIXER_DOPPIO_COMANDO_SICUREZZA",
            title: "Interruttore ad Azione Mantenuta con Pulsante di Sicurezza a Doppio Comando",
            question: "L'impugnatura è provvista di interruttore ad azione mantenuta con pulsante di sicurezza a doppio comando per evitare azionamenti accidentali durante il lavaggio e lo spostamento?",
            normReference: "CEI EN 60335-2-64; D.Lgs. 81/2008 All. V p. 2.1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "MIXER_CAMPANA_AVVOLGENTE_MOCA",
            title: "Campana Lama Avvolgente Antischizzo e Coltelli Idonei MOCA",
            question: "Il coltello rotante è protetto da campana metallica sagomata continua in acciaio inox idoneo MOCA che scherma la lama e previene proiezioni di liquidi roventi?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "MIXER_DOPPIO_ISOLAMENTO_CLASSE_II",
            title: "Doppio Isolamento Elettrico (Classe II) e Cavo Antistrappo",
            question: "Il corpo motore presenta doppio isolamento elettrico di Classe II con cavo di alimentazione vulcanizzato antistrappo integro e grado di protezione ad immersione IPX4?",
            normReference: "CEI EN 60335-1; CEI 64-8; D.Lgs. 81/2008 Titolo III",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "MIXER_TUBO_SMONTABILE_SANIFICAZIONE",
            title: "Tubo ed Elica Smontabili per Sanificazione Sicura",
            question: "Il tubo a immersione con l'elica tagliente si sgancia completamente dal corpo motore per consentire il lavaggio e la disinfezione separata senza bagnare i componenti elettrici?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },

      // --- REPARTO 3: LAVAGGIO STOVIGLIE & PLONGE (env-rist-plonge) ---
      {
        machineKey: "lavastoviglie_capotta_plonge",
        name: "Lavastoviglie Industriale a Capotta Passante con Tavoli Inox",
        type: "Macchina Lavastoviglie a Capotta per Ristorazione",
        suggestedManufacturer: "Winterhalter / Meiko / Comenda",
        suggestedModel: "PT-M / UPster H 500 / LC 700",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "LAVASTOVIGLIE_CAPOTTA_CONTROBILANCIATA",
            title: "Capotta Controbilanciata con Arresto Pompa e Bracci al Sollevamento",
            question: "La capotta è dotata di maniglione controbilanciato a molle con microinterruttore di sicurezza che arresta istantaneamente la pompa di lavaggio e i bracci rotanti al sollevamento?",
            normReference: "UNI EN 50416; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_DISPOSITIVO_ANTIREFLUSSO",
            title: "Dispositivo Anti-Reflusso Idrico Fognario a Norma UNI EN 1717",
            question: "Il circuito idraulico è provvisto di dispositivo anti-reflusso a interruzione d'aria conforme UNI EN 1717 per impedire qualsiasi ritorno di acque saponate o reflue nella rete acquedotto?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_DOSATORI_PERISTALTICI",
            title: "Dosatori Automatici Peristaltici per Evitare Contatto con Prodotti Caustici",
            question: "I prodotti di lavaggio e risciacquo (detergente alcalino caustico e brillantante acido) sono dosati mediante pompe peristaltiche automatiche per evitare manipolazioni dirette dell'operatore?",
            normReference: "D.Lgs. 81/2008 Titolo IX art. 223 e 225; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_TERMOSTOP_SANIFICAZIONE",
            title: "Dispositivo Thermostop Risciacquo Sanificante HACCP (>= 82°C)",
            question: "La macchina integra il sistema Thermostop che garantisce l'avvio del ciclo di risciacquo unicamente se l'acqua del boiler ha raggiunto la temperatura di sanificazione termica >= 82°C?",
            normReference: "DIN 10510; DIN 10512; Reg. CE 852/2004 All. II",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 4: FREDDO & MAGAZZINO (env-rist-celle e env-rist-dispensa) ---
      {
        machineKey: "armadio_frigo_conservazione",
        name: "Armadi Frigoriferi Statici/Ventilati Positivi e Negativi 700/1400 Litri",
        type: "Attrezzatura Professionale di Refrigerazione e Conservazione Alimenti",
        suggestedManufacturer: "Friulinox / Polaris / Ilsa",
        suggestedModel: "AR70 / Master 1400 TN/BT",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FRIGO_CONTROLLO_DIGITALE_ALLARME_HACCP",
            title: "Controllo Digitale Temperatura con Allarme Visivo/Acustico HACCP",
            question: "Il termoregolatore digitale è visibile dall'esterno con allarme visivo e acustico per sovratemperatura, anomalia sonda o porta aperta prolungata per conformità HACCP?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRIGO_GUARNIZIONI_MAGNETICHE_PULIBILI",
            title: "Guarnizioni Magnetiche Pulibili e Sostituibili",
            question: "Le guarnizioni magnetiche perimetrali degli sportelli assicurano perfetta tenuta termica, sono integre, prive di muffe o fessurazioni e facilmente sfilabili per pulizia e sanificazione?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "FRIGO_ISOLAMENTO_CICLOPENTANO_GAS_378",
            title: "Isolamento Ciclopentano Ecologico e Circuito Conforme UNI EN 378",
            question: "La struttura presenta isolamento ecologico in ciclopentano espanso con gas refrigerante ecologico a basso GWP (R290) e circuito frigorifero a tenuta conforme a norma UNI EN 378?",
            normReference: "UNI EN 378:2020; Reg. UE 517/2014; CEI EN 60335-2-89",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRIGO_APERTURA_EMERGENZA_INTERNA",
            title: "Dispositivo di Apertura di Emergenza dall'Interno",
            question: "Per celle o grandi armadi con accesso a corpo intero, è presente e perfettamente funzionante la maniglia meccanica di sblocco di emergenza dall'interno anche a porta bloccata a chiave dall'esterno?",
            normReference: "UNI EN 378-1; D.Lgs. 81/2008 All. IV punto 1.11",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "fabbricatore_ghiaccio_ristorante",
        name: "Fabbricatore di Ghiaccio a Cubetti Cavi/Pieni per Bar e Cucina",
        type: "Apparecchiatura di Produzione Ghiaccio Alimentare",
        suggestedManufacturer: "Brema / Icematic / Scotsman",
        suggestedModel: "CB 249 / CS 28 / BarLine B",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "GHIACCIO_CIRCUITO_ERMETICO_378",
            title: "Circuito Sigillato Conforme UNI EN 378",
            question: "Il gruppo frigorifero a circuito sigillato ermetico è conforme alla norma UNI EN 378 ed è installato in posizione aerata priva di ostacoli per il raffreddamento del condensatore?",
            normReference: "UNI EN 378; CEI EN 60335-2-24; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "GHIACCIO_MATERIALI_MOCA_REG_1935",
            title: "Materiali Alimentari Idonei MOCA (Reg. CE 1935/2004)",
            question: "Il serbatoio di stoccaggio e i componenti a contatto con acqua e ghiaccio sono in materiali idonei MOCA Reg. CE 1935/2004 con procedura documentata di pulizia periodica anti-legionella?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004; Linee Guida per il Controllo della Legionellosi",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "GHIACCIO_SCARICO_INTERRUZIONE_ARIA",
            title: "Scarico con Interruzione d'Aria Anti-Reflusso Fognario",
            question: "La tubazione di scarico acqua della vasca presenta uno stacco a caduta libera con interruzione d'aria aperta (air break) per impedire ritorni di cattivi odori o batteri dalla colonna fognaria?",
            normReference: "UNI EN 1717; Reg. CE 852/2004 All. II cap. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "GHIACCIO_FILTRO_ACQUA_ANTIBATTERICO",
            title: "Filtrazione e Decalcificazione Acqua con Cartuccia Registrata",
            question: "La linea di alimentazione idrica è provvista di cartuccia filtrante/decalcificante a monte con registrazione periodica della sostituzione conforme ai requisiti dell'acqua potabile?",
            normReference: "D.Lgs. 31/2001; D.Lgs. 18/2023; Reg. CE 852/2004",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },

      // --- REPARTO 5: BAR & SOMMINISTRAZIONE (env-rist-bar-cassa) ---
      {
        machineKey: "macchina_caffe_espresso",
        name: "Macchina per Caffè Espresso Professionale a 2 o 3 Gruppi",
        type: "Apparecchiatura Idrotermica a Pressione per Somministrazione Bevande",
        suggestedManufacturer: "La Marzocco / Faema / Rancilio",
        suggestedModel: "Linea PB / E71 / Classe 9",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CAFFE_VALVOLA_PED_SOVRAPRESSIONE",
            title: "Valvola di Sicurezza Sovrapressione Certificata PED (D.Lgs. 26/2016)",
            question: "La caldaia a vapore è equipaggiata con valvola di sicurezza contro le sovrapressioni certificata CE secondo la Direttiva PED (D.Lgs. 26/2016) con scarico convogliato?",
            normReference: "Direttiva PED 2014/68/UE; D.Lgs. 26/2016; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CAFFE_LANCIA_VAPORE_COOL_TOUCH",
            title: "Lancia Vapore Isolata Cool-Touch Antiscottatura",
            question: "Le lance vapore per il montaggio latte sono dotate di isolamento termico interno Cool-Touch antiscottatura e impugnatura in gomma siliconica per prevenire ustioni alle mani?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; CEI EN 60335-2-75",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CAFFE_MANOMETRI_DOPPIA_SCALA",
            title: "Manometri Pressione Certificati e Chiaramente Leggibili",
            question: "I manometri di controllo della pressione caldaia vapore e pressione pompa erogazione sono integri, certificati e chiaramente leggibili dal posto di manovra dell'operatore?",
            normReference: "D.Lgs. 81/2008 All. V p. 1.2; CEI EN 60335-2-75",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "CAFFE_ADDOLCITORE_DISCONNETTORE",
            title: "Addolcitore Acqua a Monte con Disconnettore Idrico UNI EN 1717",
            question: "L'allacciamento idrico della macchina include addolcitore a resine e dispositivo di non ritorno a monte conforme a norma UNI EN 1717 per impedire reflussi verso l'acquedotto potabile?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 1. PIZZERIA / ASPORTO (Pizzerie tradizionali al tavolo, Pizzerie al taglio, Pizzerie d'asporto e delivery - ATECO 56.10.20, 56.10.2)
  {
    sectorKey: "pizzeria_asporto",
    sectorLabel: "Pizzeria Tradizionale, al Taglio e Asporto / Delivery",
    atecoPrefixes: ["56.10.20", "56.10.2"],
    machines: [
      // --- REPARTO 1: LABORATORIO & COTTURA PIZZE (env-piz-laboratorio e env-piz-forno-legna) ---
      {
        machineKey: "forno_pizze_professionale",
        name: "Forno Pizze Professionale (Elettrico / Gas / Legna)",
        type: "Apparecchiatura Termica di Cottura Pizze ad Alta Temperatura",
        suggestedManufacturer: "Moretti Forni / Marana Forni / Cuppone",
        suggestedModel: "Neapolis / Rotoforno / Giotto",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FORNO_PIZZA_VETRO_VENTILATO_ISOLANTE",
            title: "Porta con Vetro Refrattario Ventilato Termoisolante e Maniglia a Doppio Scatto",
            question: "La porta della camera di cottura è dotata di vetro refrattario o intercapedine termoisolante anti-ustione e maniglia di apertura atermica con meccanismo a doppio scatto per lo sfiato graduale dei vapori e calore a norma UNI EN 203-1?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_PIZZA_TERMOSTATO_MASSIMA_RIARMO",
            title: "Termostato di Massima Temperatura a Riarmo Manuale Indipendente",
            question: "Il forno è equipaggiato con termostato di limite massimo di sicurezza a riarmo manuale indipendente dal controllo digitale/elettronico che interviene interrompendo l'alimentazione elettrica o l'erogazione del gas in caso di surriscaldamento?",
            normReference: "CEI EN 60335-2-36; UNI EN 203-1; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_PIZZA_CANNA_FUMARIA_ABBATTITORE_UNI1127",
            title: "Cappa Integrata o Canna Fumaria con Abbattitore Fuliggine ad Acqua (UNI 1127 / UNI 10683)",
            question: "Il sistema di evacuazione fumi dispone di cappa integrata con filtri inox o canna fumaria dedicata con abbattitore di fuliggine ad acqua a circuito chiuso conforme a norma UNI 1127 e UNI 10683 per forni a legna o pellet?",
            normReference: "UNI 1127; UNI 10683:2022; D.Lgs. 81/2008 All. IV p. 1.9; D.M. 03/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_PIZZA_TERMOCOPPIA_INTERCETTAZIONE_GAS",
            title: "Dispositivo Termocoppia di Sicurezza e Valvola Intercettazione Rapida",
            question: "Nelle versioni a gas o ibride, i bruciatori della camera e della platea sono dotati di termocoppia rapida di sicurezza con valvola elettromagnetica e rubinetto generale di intercettazione gas a vista accessibile?",
            normReference: "UNI EN 203-1:2021 punto 5.3; D.M. 12/04/1996; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "banco_pizza_refrigerato",
        name: "Banco Pizza Refrigerato con Piano in Granito e Vetrina Ingredienti",
        type: "Banco di Lavorazione Refrigerato con Piano di Lavoro MOCA",
        suggestedManufacturer: "Fimar / Mercatus / Ilsa",
        suggestedModel: "PZ02 / Granita Pro / Pastry-Pizza 3 Porte",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BANCO_PIZZA_PIANO_GRANITO_MOCA",
            title: "Piano di Lavoro in Granito Levigato Sanificabile MOCA Esente da Fessurazioni",
            question: "Il piano superiore in granito o marmo naturale levigato è integro, privo di crepe, scheggiature o fessurazioni e conforme ai requisiti MOCA per il contatto diretto con alimenti e impasti (Reg. CE 1935/2004)?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BANCO_PIZZA_VETRINA_INGREDIENTI_PARAFIATO",
            title: "Vetrina Refrigerata Ingredienti con Cristalli Parafiato Igienici (+4°C)",
            question: "La vetrina porta-bacinelle ingredienti è protetta da cristalli parafiato igienici integri, mantiene la temperatura controllata di conservazione (+0°C / +4°C) e dispone di coperchio igienico di chiusura?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BANCO_PIZZA_CONTROLLO_DIGITALE_HACCP",
            title: "Termoregolatore Elettronico Digitale con Allarme HACCP",
            question: "Il gruppo frigo è dotato di centralina elettronica con display digitale visibile per il monitoraggio continuo della temperatura e allarme visivo per anomalie di refrigerazione o porta aperta prolungata?",
            normReference: "Reg. CE 852/2004 All. II cap. V; CEI EN 60335-2-89",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "BANCO_PIZZA_GUARNIZIONI_E_ISOLAMENTO_378",
            title: "Guarnizioni Magnetiche Sfilabili e Circuito Frigo Sigillato UNI EN 378",
            question: "Gli sportelli inferiori sono dotati di guarnizioni magnetiche perimetrali integre e sfilabili per la sanificazione, con circuito frigorifero a gas ecologico (R290) conforme alla norma UNI EN 378?",
            normReference: "UNI EN 378:2020; Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "stendi_pizza_dilaminatrice",
        name: "Formatrice / Dilaminatrice / Stendipizza a Rulli Inox",
        type: "Macchina per Formatrice e Dilaminatura a Freddo Impasti",
        suggestedManufacturer: "Fimar / Prismafood / OEM",
        suggestedModel: "SI420 / DMA 500 / Roll Pizza 42",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "STENDIPIZZA_RIPARI_FISSI_RULLI_12042",
            title: "Ripari di Sicurezza Fissi in Plexiglass/Inox su Imbocco Rulli (UNI EN 12042)",
            question: "I rulli superiori e inferiori di laminazione sono segregati da protezioni fisse trasparenti o in acciaio inox sagomate per impedire l'introduzione accidentale delle dita e mani nella zona di schiacciamento a norma UNI EN 12042?",
            normReference: "UNI EN 12042:2020; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "STENDIPIZZA_ARRESTO_EMERGENZA_FUNGO",
            title: "Pulsante di Arresto di Emergenza a Fungo con Riarmo Manuale",
            question: "Sulla struttura della macchina è presente un pulsante di arresto di emergenza a fungo rosso su fondo giallo ad azione positiva facilmente accessibile all'operatore in caso di trascinamento?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.3; CEI EN 60204-1; UNI EN ISO 13850",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "STENDIPIZZA_RELE_MINIMA_TENSIONE",
            title: "Relè di Minima Tensione Anti-Riavvio Accidentale",
            question: "La centralina di alimentazione della stendipizza è provvista di relè di minima tensione (NVR) che impedisce categoricamente il riavvio spontaneo dei rulli a seguito del ripristino della tensione di rete?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "STENDIPIZZA_RULLI_MOCA_TEFLON_INOX",
            title: "Rulli di Scorrimento in Resina Alimentare o Acciaio Inox MOCA",
            question: "I rulli cilindrici sono realizzati in resina acetalica atossica o acciaio inox idoneo al contatto alimentare MOCA Reg. CE 1935/2004, dotati di raschiatori smontabili per la pulizia quotidiana senza ausilio di utensili pericolosi?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "cappa_aspirazione_forno_pizze",
        name: "Cappa di Aspirazione Forno Pizze con Impianto Abbattimento Fumi",
        type: "Impianto di Aspirazione e Trattamento Fumi e Fuliggine Forno",
        suggestedManufacturer: "Zainetti / Camini & Cappe / Smoki",
        suggestedModel: "Smoki Junior / Maxi Cappa Pizza con Abbattitore ad Acqua",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CAPPA_PIZZA_FILTRI_LABIRINTO_INOX",
            title: "Filtri a Labirinto Antigrasso in Acciaio Inox Lavabili",
            question: "La cappa sovrastante la bocca del forno è equipaggiata con filtri a labirinto in acciaio inox lavabili ad alta efficienza per la separazione dei grassi e particelle volatili, con canalina di scolo e vaschetta estraibile?",
            normReference: "UNI EN 16282-6; D.Lgs. 81/2008 art. 64; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_PIZZA_ABBATTITORE_FULIGGINE_UNI1127",
            title: "Abbattitore di Fuliggine ad Acqua a Circuito Chiuso (UNI 1127)",
            question: "Per forni alimentati a legna, cippato o pellet, l'impianto include un abbattitore di fuliggine ad acqua a circuito chiuso conforme a norma UNI 1127 per la bagnatura e sedimentazione delle scintille e polveri incombuste?",
            normReference: "UNI 1127; UNI 10683; D.M. 03/09/2021; D.Lgs. 81/2008 All. IV p. 1.9",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_PIZZA_CANNA_FUMARIA_INDIPENDENTE",
            title: "Canalizzazione di Evacuazione a Tetto Indipendente e Tenuta Fumi",
            question: "La canna fumaria del forno pizze è completamente autonoma e indipendente da altre canalizzazioni, a tenuta di fumo, sfociante al di sopra del colmo del tetto e dotata di portelli di ispezione per la pulizia periodica delle ceneri?",
            normReference: "UNI EN 16282-7; UNI 10683; D.Lgs. 81/2008 art. 64",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_PIZZA_SERRANDA_TAGLIAFUOCO",
            title: "Serranda TagliafuOCO e Asservimento Motore Aspirazione",
            question: "L'impianto di aspirazione è provvisto di dispositivo termofusibile o serranda tagliafuoco conforme alle norme di prevenzione incendi e interruttore di sgancio di sicurezza dedicato in posizione protetta?",
            normReference: "D.M. 03/09/2021; UNI EN 1366-2; D.Lgs. 81/2008 All. IV p. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 2: IMPASTO & LIEVITAZIONE (env-piz-impasto) ---
      {
        machineKey: "impastatrice_spirale_pizzeria",
        name: "Impastatrice a Spirale Professionale per Pizza",
        type: "Macchina Impastatrice Professionale a Spirale per Panificazione e Pizzeria",
        suggestedManufacturer: "Sunmix / Pizzagroup / Pietro Berto",
        suggestedModel: "Sun 20/30 / IR22 / Spiral Line 30",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "IMPASTATRICE_RIPARO_GRIGLIA_INTERBLOCCO_453",
            title: "Riparo a Griglia Inox Interbloccato con Microinterruttore (UNI EN 453)",
            question: "La vasca impastatrice è protetta da riparo superiore a griglia in acciaio inox interbloccato con microinterruttore di sicurezza a rilascio positivo che arresta istantaneamente la spirale e la vasca al sollevamento conforme a norma UNI EN 453?",
            normReference: "UNI EN 453:2015; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "IMPASTATRICE_ARRESTO_EMERGENZA_FUNGO",
            title: "Pulsante di Arresto di Emergenza a Fungo con Ritenuta Meccanica",
            question: "Sulla testata della macchina è presente un pulsante a fungo rosso di arresto d'emergenza con autoritenuta meccanica conforme a CEI EN 60204-1 e UNI EN ISO 13850?",
            normReference: "UNI EN ISO 13850; CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2.3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "IMPASTATRICE_DISTANZE_SICUREZZA_ORGANO_VASCA",
            title: "Franchi e Distanze di Sicurezza Organo Lavoratore-Vasca",
            question: "La spirale, lo spacca-pasta e i bordi vasca rispettano i franchi e le distanze minime di sicurezza previsti dalla norma UNI EN 453 per prevenire il trascinamento o lo schiacciamento delle dita dell'operatore?",
            normReference: "UNI EN 453:2015 punto 5.2; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "IMPASTATRICE_RELE_MINIMA_TENSIONE",
            title: "Relè di Minima Tensione Anti-Riavvio Spontaneo e Temporizzatore",
            question: "L'impastatrice è munita di relè di minima tensione anti-riavvio in caso di blackout e timer di ciclo con comandi a bassa tensione IP55 privi di fessure per polveri di farina?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "spezzatrice_arrotondatrice_pizze",
        name: "Arrotondatrice / Spezzatrice per Palline di Impasto Pizza",
        type: "Macchina Professionale Formatrice Palline Pizza",
        suggestedManufacturer: "Vitella / OEM / FriulCo",
        suggestedModel: "Round 300 / Spaziale BM / Arrotondatrice a Coclea",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "ARROTONDATRICE_TRAMOGGIA_SALVADITA_INTERBLOCCO",
            title: "Tramoggia Protetta Salvadita con Microinterruttore di Sicurezza (UNI EN 12042)",
            question: "La tramoggia superiore di immissione porzioni di pasta è dimensionata secondo i franchi di sicurezza della norma UNI EN 12042 ed è provvista di microinterruttore di blocco all'apertura del coperchio?",
            normReference: "UNI EN 12042:2020; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ARROTONDATRICE_CARTER_PROTEZIONE_COCLEA",
            title: "Carter di Protezione Organi in Movimento e Coclea/Elica",
            question: "La coclea a spirale o cilindro arrotondatore è segregata da carter metallico fisso in acciaio inox che impedisce qualsiasi contatto con gli organi in rapida rotazione durante la lavorazione delle porzioni?",
            normReference: "UNI EN 12042; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ARROTONDATRICE_ARRESTO_EMERGENZA_FUNGO",
            title: "Pulsante di Arresto di Emergenza a Fungo ad Azione Rapida",
            question: "È presente sulla parte frontale della macchina un pulsante a fungo di arresto immediato per l'interruzione istantanea del ciclo in caso di anomalia o inceppamento impasto?",
            normReference: "UNI EN ISO 13850; CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2.3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ARROTONDATRICE_SUPERFICI_MOCA_TEFLONATE",
            title: "Superfici a Contatto Impasti Idonee MOCA con Rivestimento Sanificabile",
            question: "La coclea e il cilindro sono realizzati o trattati con materiali idonei MOCA (alluminio anodizzato / teflon alimentare / inox AISI 304) privi di abrasioni o distacchi di materiale antiaderente conforme al Reg. CE 1935/2004?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "armadio_ferma_lievitazione",
        name: "Armadio Frigorifero / Cella Ferma-Lievitazione Impasti",
        type: "Cella Climatizzata Elettronica per Ferma-Lievitazione e Maturazione Impasti",
        suggestedManufacturer: "Coldline / Ilsa / Everlasting",
        suggestedModel: "Levtronic 700 / Ilsa Lievito / King Pizza Ferma-Lievitazione",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FERMA_LIEVITO_CONTROLLO_TERMO_IGROMETRICO",
            title: "Controllo Elettronico Combinato Temperatura e Umidità Relativa",
            question: "La centralina microprocessore gestisce accuratamente le fasi di raffreddamento, conservazione, riscaldamento e umidificazione programmata con registrazione dei parametri per la salubrità dell'impasto?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FERMA_LIEVITO_ALLARME_PORTA_APERTA",
            title: "Allarme Visivo/Acustico Porta Aperta e Arresto Ventilazione",
            question: "L'armadio dispone di microinterruttore porta che disattiva la ventilazione forzata interna all'apertura dell'anta ed emette un allarme acustico e visivo in caso di apertura prolungata?",
            normReference: "CEI EN 60335-2-89; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "FERMA_LIEVITO_CIRCUITO_FRIGO_R290_378",
            title: "Circuito Frigorifero a Tenuta Conforme UNI EN 378 (Gas R290)",
            question: "Il gruppo motocondensante a gas refrigerante ecologico R290 è ermetico, conforme a norma UNI EN 378 e collocato in vano protetto provvisto di griglie di aerazione pulite e sgombre?",
            normReference: "UNI EN 378:2020; Reg. UE 517/2014; CEI EN 60335-2-89",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FERMA_LIEVITO_CARICO_ACQUA_DISCONNETTORE_1717",
            title: "Alimentazione Idrica Umidificatore con Dispositivo Anti-Reflusso UNI EN 1717",
            question: "L'allacciamento alla rete idrica per il generatore di vapore/umidità è provvisto di disconnettore idraulico anti-reflusso a norma UNI EN 1717 per prevenire contaminazioni della rete potabile?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 3: PREPARAZIONE CONDIMENTI & FRITTI (env-piz-prep-ingredienti) ---
      {
        machineKey: "tagliamozzarella_sfilacciatrice",
        name: "Tagliamozzarella Elettrico / Sfilacciatrice per Formaggi",
        type: "Macchina Professionale Taglia e Sfilaccia Mozzarella per Pizzeria",
        suggestedManufacturer: "Sirman / Fimar / Celme",
        suggestedModel: "TAS / TM Inox / Cheeser 250",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "TAGLIAMOZZARELLA_BOCCA_CARICO_PESTELLO",
            title: "Bocca di Carico con Cono e Pestello Ergonomico Salvadita",
            question: "La bocca di carico è provvista di pestello ergonomico sagomato conforme alle dimensioni di sicurezza per impedire l'accesso delle mani al disco/cono di taglio durante l'inserimento dei pani di formaggio?",
            normReference: "UNI EN 1678; UNI EN 12852; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TAGLIAMOZZARELLA_INTERBLOCCO_CAMPANA_12852",
            title: "Interblocco a Microinterruttore su Campana con Arresto Immediato (UNI EN 12852)",
            question: "Il coperchio/campana di chiusura corpo macchina è protetto da microinterruttore di sicurezza che toglie tensione arrestando istantaneamente il motore all'apertura del gruppo di taglio?",
            normReference: "UNI EN 12852:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TAGLIAMOZZARELLA_DISCO_INOX_FERMO_MECCANICO",
            title: "Disco di Taglio Inox con Fermo di Sicurezza e Protezione Scarico",
            question: "Il cono o disco di sfilacciatura in acciaio inox alimentare MOCA è dotato di fermo meccanico di bloccaggio e la bocca di espulsione impedisce l'introduzione involontaria delle dita dal basso verso l'utensile?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "TAGLIAMOZZARELLA_RELE_MINIMA_TENSIONE_IP55",
            title: "Pulsantiera Bassa Tensione IP55 con Relè di Minima Tensione",
            question: "I comandi di avvio e arresto sono isolati con protezione stagna IP55 contro infiltrazioni di liquidi/siero e dotati di relè di minima tensione anti-riavvio spontaneo?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2.1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "affettatrice_gravita_pizzeria",
        name: "Affettatrice Professionale a Gravità per Salumi Lama 350 mm",
        type: "Macchina per Affettamento Salumi da Banco Pizzeria",
        suggestedManufacturer: "Berkel / Sirman / RGV",
        suggestedModel: "Domina 350 / Palladio 350 Autocheck",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "AFFETTATRICE_PIZZA_ANELLO_FISSO_PARALAMA",
            title: "Anello Fisso Paralama Continuo a Norma UNI EN 1974",
            question: "L'affettatrice è munita di anello fisso di protezione continuo che copre interamente il filo della lama non impegnato dal taglio a norma UNI EN 1974?",
            normReference: "UNI EN 1974:2010 punto 5.2.2; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_PIZZA_BLOCCO_CARRO_SPESSORE_ZERO",
            title: "Blocco Carro a Spessore Zero della Vela per Pulizia Sicura",
            question: "Il piatto scorrevole portamerce può essere sfilato per la sanificazione solo con la manopola graduata dello spessore posizionata su '0' (filo lama completamente protetto dalla vela)?",
            normReference: "UNI EN 1974:2010 punto 5.2.4; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_PIZZA_RELE_MINIMA_TENSIONE",
            title: "Relè di Minima Tensione Anti-Riavvio Spontaneo",
            question: "La centralina di accensione è dotata di relè di minima tensione (NVR) che impedisce categoricamente il riavvio spontaneo dopo una momentanea interruzione di alimentazione elettrica?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_PIZZA_PRESSAMERCE_TRASPARENTE",
            title: "Pressamerce Ergonomico con Schermo Trasparente Salvadita",
            question: "Il pressamerce è dotato di impugnatura ergonomica protetta e schermo in policarbonato trasparente integro per preservare le dita dell'operatore durante l'avanzamento verso la lama?",
            normReference: "UNI EN 1974:2010 punto 5.2.3; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "friggitrice_pizzeria",
        name: "Friggitrice Professionale per Fritti e Pizze Fritte",
        type: "Apparecchiatura di Cottura Professionale ad Olio",
        suggestedManufacturer: "Lotus / Giorik / Angelo Po",
        suggestedModel: "F18-94G / FryPro 20L / Alpha Fryer",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FRIGGITRICE_PIZZA_TERMOSTATO_MAX_230",
            title: "Termostato di Massima Temperatura a Riarmo Manuale (< 230°C)",
            question: "La friggitrice è dotata di termostato di massima temperatura indipendente a riarmo manuale tarato sotto i 230°C contro l'autocombustione dell'olio in caso di blocco del termostato principale?",
            normReference: "UNI EN 203-1:2021; D.Lgs. 81/2008 art. 71 e All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_PIZZA_VALVOLA_SCARICO_SICURA",
            title: "Valvola di Scarico Olio con Sicura Meccanica e Prolunga",
            question: "Il rubinetto di svuotamento dell'olio esausto è dotato di sicura meccanica contro aperture involontarie e innesto a beccuccio sagomato per il travaso protetto nel fusto di recupero?",
            normReference: "D.Lgs. 81/2008 All. V p. 7; UNI EN 203-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_PIZZA_ZONA_FREDDA_POLARI_25",
            title: "Zona Fredda Fondo Vasca e Controllo Composti Polari (< 25%)",
            question: "La vasca presenta una zona fredda sottostante per evitare la carbonizzazione dei residui di pastella e viene effettuato il controllo periodico dei composti polari con limite tassativo < 25%?",
            normReference: "Reg. CE 852/2004; Circ. Min. Sanità 11/01/1991 n. 1; D.Lgs. 81/2008",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_PIZZA_LIVELLO_MIN_MAX",
            title: "Tacche di Livello Minimo e Massimo Olio Incise in Vasca",
            question: "Sulla vasca di frittura sono chiaramente impresse le tacche di livello minimo e massimo per prevenire inneschi da scarso battente d'olio o traboccamenti durante l'immersione di cestelli o pizze fritte?",
            normReference: "UNI EN 203-1 punto 5.5; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "cutter_robot_condimenti",
        name: "Cutter / Robot Tagliaverdure per Farciture",
        type: "Robot Tagliaverdure e Cutter da Banco per Farciture Pizzeria",
        suggestedManufacturer: "Robot Coupe / Dito Sama / Sammic",
        suggestedModel: "R 201 / TR210 / Sammic CA-31",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CUTTER_PIZZA_COPERCHIO_INTERBLOCCO_2SEC",
            title: "Coperchio Trasparente Interbloccato con Arresto Lama entro 2 Secondi (UNI EN 12852)",
            question: "Il coperchio trasparente della vasca cutter è protetto da microinterruttore di sicurezza che arresta la rotazione delle lame da taglio entro 2 secondi dal sollevamento conforme a norma UNI EN 12852?",
            normReference: "UNI EN 12852:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_PIZZA_PESTELLO_SALVADITA",
            title: "Pestello Salvadita Sagomato per Tramoggia Verdure",
            question: "La tramoggia tagliaverdure dispone del pestello sagomato per la spinta degli ortaggi nella bocca di taglio con divieto assoluto di spinta manuale diretta delle verdure?",
            normReference: "UNI EN 1678:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_PIZZA_BLOCCO_VASCA_MECCANICO",
            title: "Blocco Meccanico Vasca Inox con Microinterruttore di Consenso",
            question: "Il corpo motore impedisce la rotazione del mozzo portalame se la vasca di lavorazione in acciaio inox non è perfettamente alloggiata e bloccata con lo scatto meccanico di sicurezza?",
            normReference: "UNI EN 12852; Direttiva Macchine 2006/42/CE All. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_PIZZA_PULSANTIERA_IP65_PULSE",
            title: "Pulsantiera Bassa Tensione IP65 con Funzione Impulso (Pulse)",
            question: "I pulsanti marcia/arresto sono a tenuta stagna IP65 in bassissima tensione di sicurezza con tasto impulso per lavorazioni intermittenti e sminuzzamento controllato delle farciture?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2.1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 4: LAVAGGIO TEGLIE & STOVIGLIE (env-piz-lavaggio) ---
      {
        machineKey: "lavaoggetti_lavateglie",
        name: "Lavastoviglie Industriale Lavaoggetti / Lavateglie (Pot-Washer)",
        type: "Lavaoggetti Professionale ad Alta Pressione per Teglie 60x40 e Cassette",
        suggestedManufacturer: "Winterhalter / Meiko / Comenda",
        suggestedModel: "UF-M / Point2 M-iQ / Prime Lavaoggetti",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "LAVATEGlie_VASCA_CAPOTTA_MICROINTERRUTTORE",
            title: "Microinterruttore di Sicurezza Porta/Capotta con Arresto Pompe",
            question: "La porta controbilanciata o capotta della lavaoggetti è interbloccata da microinterruttore stagno che arresta istantaneamente le pompe ad alta pressione e i getti d'acqua bollente al sollevamento?",
            normReference: "CEI EN 60335-2-58; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVATEGlie_ANTI_REFLUSSO_UNI_EN_1717",
            title: "Dispositivo Anti-Reflusso Idrico a Interruzione d'Aria (UNI EN 1717)",
            question: "Il circuito idraulico di carico è dotato di dispositivo anti-reflusso a interruzione d'aria tipo AA/AB conforme UNI EN 1717 per prevenire ritorni di acque reflue verso l'acquedotto potabile?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; D.Lgs. 18/2023; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVATEGlie_DOSATORI_PERISTALTICI",
            title: "Dosatori Automatici Peristaltici Detergente e Brillantante",
            question: "I prodotti chimici concentrati di lavaggio e risciacquo sono dosati tramite pompe peristaltiche automatiche integrate a circuito chiuso per evitare contatti cutanei od oculari con sostanze corrosive?",
            normReference: "D.Lgs. 81/2008 Titolo IX art. 223 e 225; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVATEGlie_TERMOSTOP_SANIFICAZIONE_82",
            title: "Dispositivo Thermostop Risciacquo Sanificante HACCP (>= 82°C)",
            question: "La macchina è provvista del sistema Thermostop che garantisce l'avvio del ciclo di risciacquo finale solo quando l'acqua del boiler ha raggiunto la soglia termica di sanificazione di almeno 82°C?",
            normReference: "DIN 10510; DIN 10512; Reg. CE 852/2004 All. II",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 5: FREDDO & MAGAZZINO (env-piz-celle) ---
      {
        machineKey: "armadio_frigo_deperibili_pizza",
        name: "Armadio Frigorifero Statico/Ventilato TN 700/1400L",
        type: "Armadio Frigorifero Professionale per Conservazione Materie Prime Deperibili",
        suggestedManufacturer: "Friulinox / Polaris / Ilsa",
        suggestedModel: "AR70 Pizza / Master 1400 TN / Polar Line",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FRIGO_PIZZA_TERMOREGOLATORE_ALLARME_HACCP",
            title: "Termoregolatore Digitale con Allarme Visivo/Acustico HACCP",
            question: "Il display del termoregolatore digitale è visibile dall'esterno con allarme visivo e acustico per scostamento termico, porta aperta prolungata o guasto sonda a tutela della catena del freddo HACCP?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRIGO_PIZZA_GUARNIZIONI_MAGNETICHE_PULIBILI",
            title: "Guarnizioni Magnetiche Perimetrali Integre e Sfilabili",
            question: "Le guarnizioni magnetiche perimetrali degli sportelli garantiscono tenuta ermetica, sono prive di fessurazioni o muffe e facilmente rimovibili per la regolare pulizia e disinfezione?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "FRIGO_PIZZA_ISOLAMENTO_CICLOPENTANO_R290",
            title: "Isolamento Ecologico in Ciclopentano e Circuito Sigillato UNI EN 378 (Gas R290)",
            question: "L'armadio presenta isolamento ecologico privo di CFC con ciclopentano espanso e gruppo refrigerante sigillato conforme a norma UNI EN 378 operante con gas ecologico a basso impatto R290?",
            normReference: "UNI EN 378:2020; Reg. UE 517/2014; CEI EN 60335-2-89",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FRIGO_PIZZA_ANGOLI_RAGGIATI_PULIZIA",
            title: "Vano Interno in Acciaio Inox con Angoli Raggiati Sanificabili MOCA",
            question: "La camera interna in acciaio inox presenta il fondo con angoli raggiati e piletta di scarico lavaggio per consentire la perfetta pulizia ed evitare accumuli di sporcizia e proliferazioni batteriche?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },

      // --- REPARTO 6: SALA & BAR (env-piz-sala-asporto) ---
      {
        machineKey: "fabbricatore_ghiaccio_pizzeria",
        name: "Fabbricatore di Ghiaccio a Cubetti per Bevande",
        type: "Apparecchiatura di Produzione Ghiaccio Alimentare a Cubetti",
        suggestedManufacturer: "Brema / Icematic / Scotsman",
        suggestedModel: "CB 184 / CS 28 / BarLine B20",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "GHIACCIO_PIZZA_CIRCUITO_SIGILLATO_378",
            title: "Circuito Sigillato Conforme UNI EN 378",
            question: "Il gruppo frigorifero a circuito sigillato ermetico risponde alla norma UNI EN 378 ed è installato in locale idoneo provvisto di adeguata ventilazione per il dissipamento del calore di condensazione?",
            normReference: "UNI EN 378:2020; CEI EN 60335-2-24; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "GHIACCIO_PIZZA_MATERIALI_MOCA_REG_1935",
            title: "Materiali Idonei MOCA (Reg. CE 1935/2004) e Piano Pulizia Anti-Legionella",
            question: "Il contenitore di riserva e i componenti a contatto con l'acqua e il ghiaccio sono conformi alle normative MOCA e viene attuata una procedura periodica di sanificazione anticalcare e antibatterica?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004; Linee Guida Prevenzione Legionellosi",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "GHIACCIO_PIZZA_SCARICO_INTERRUZIONE_ARIA_1717",
            title: "Scarico con Interruzione d'Aria Anti-Reflusso Fognario (UNI EN 1717)",
            question: "La tubazione di scarico della vasca ghiaccio presenta un'interruzione d'aria aperta a caduta (air gap) per scongiurare qualsiasi risalita batterica o reflusso dalla rete fognaria?",
            normReference: "UNI EN 1717; Reg. CE 852/2004 All. II cap. I; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "GHIACCIO_PIZZA_PALETTA_DEPOSITATA_ESTERNO",
            title: "Paletta Prelievo Ghiaccio MOCA Alloggiata Esternamente",
            question: "La paletta di prelievo ghiaccio in materiale alimentare MOCA è mantenuta pulita e riposta in apposito supporto esterno alla vasca per prevenire contaminazioni dirette delle mani degli operatori?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; Reg. CE 1935/2004",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "macchina_caffe_pizzeria",
        name: "Macchina per Caffè Espresso Professionale a 2 Gruppi",
        type: "Apparecchiatura Idrotermica a Pressione per Somministrazione Bevande Calde",
        suggestedManufacturer: "Faema / La Marzocco / Rancilio",
        suggestedModel: "E71 / Linea Mini-PB / Classe 7",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CAFFE_PIZZA_VALVOLA_PED_SOVRAPRESSIONE",
            title: "Valvola di Sicurezza Sovrapressione Certificata PED (D.Lgs. 26/2016)",
            question: "La caldaia a pressione è provvista di valvola di sicurezza contro le sovrapressioni certificata CE secondo la Direttiva PED (D.Lgs. 26/2016) con scarico convogliato verso la vaschetta di scolo?",
            normReference: "Direttiva PED 2014/68/UE; D.Lgs. 26/2016; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CAFFE_PIZZA_LANCIA_VAPORE_COOL_TOUCH",
            title: "Lancia Vapore Isolata Cool-Touch Antiscottatura",
            question: "La lancia vapore presenta condotto isolato termicamente Cool-Touch con impugnatura protetta in gomma per scongiurare scottature alle dita durante l'erogazione del vapore?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; CEI EN 60335-2-75",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CAFFE_PIZZA_MANOMETRI_DOPPIA_SCALA",
            title: "Manometri Pressione Caldaia e Pompa Certificati",
            question: "I manometri per il controllo della pressione in caldaia (1-1.5 bar) e della pressione di erogazione pompa (9 bar) sono integri, funzionanti e perfettamente visibili dal banco di lavoro?",
            normReference: "D.Lgs. 81/2008 All. V p. 1.2; CEI EN 60335-2-75",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "CAFFE_PIZZA_ADDOLCITORE_DISCONNETTORE_1717",
            title: "Addolcitore Acqua a Monte con Disconnettore Idrico UNI EN 1717",
            question: "L'impianto di carico idrico è equipaggiato con addolcitore/filtro a resine e dispositivo di non ritorno a monte conforme a norma UNI EN 1717 per impedire qualsiasi riflusso verso l'acquedotto pubblico?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; D.Lgs. 18/2023; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 7: AREA RIFIUTI & CENERI (env-piz-rifiuti) ---
      {
        machineKey: "bidone_metallico_ceneri",
        name: "Contenitore Metallico con Coperchio Ermetico per Ceneri Forno a Legna",
        type: "Contenitore Stagno Incombustibile per Gestione e Smaltimento Ceneri Forno",
        suggestedManufacturer: "Inox Meccanica / MetalBox / F.lli Bonezzi",
        suggestedModel: "Bidone Ceneri Inox 50L Ermetico con Manici Atermici",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CENERI_STRUTTURA_METALLICA_INCOMBUSTIBILE",
            title: "Contenitore Stagno in Lamiera Zincata o Acciaio Inox Incombustibile",
            question: "Il bidone di raccolta delle ceneri è interamente realizzato in metallo incombustibile (acciaio inox o lamiera zincata spessa), a tenuta stagna sul fondo e sulle pareti per evitare la fuoriuscita di braci ardenti?",
            normReference: "D.Lgs. 81/2008 All. IV p. 4; D.M. 03/09/2021 (Criteri Generali di Sicurezza Antincendio)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CENERI_COPERCHIO_TENUTA_ERMETICA",
            title: "Coperchio di Tenuta Ermetica con Chiusura di Sicurezza",
            question: "Il fusto è munito di coperchio metallico sagomato a perfetta tenuta ermetica per soffocare eventuali inneschi ed evitare che faville o ceneri volatili si disperdano nell'ambiente o inneschino incendi?",
            normReference: "D.Lgs. 81/2008 All. IV p. 4; D.M. 03/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CENERI_MANICI_TERMOISOLANTI_SOLLEVAMENTO",
            title: "Manici di Sollevamento Robusti con Impugnature Termoisolanti",
            question: "Il contenitore è dotato di maniglie laterali saldate ad alta resistenza provviste di isolamento termico per consentire la movimentazione sicura senza rischio di ustioni termiche alle mani?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e Titolo VI (Movimentazione Manuale dei Carichi)",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CENERI_UBICAZIONE_SUPERFICIE_INCOMBUSTIBILE",
            title: "Posizionamento su Basamento Incombustibile Distante da Infiammabili",
            question: "Il bidone per le ceneri calde è collocato su pavimento incombustibile (gres, cemento, piastrelle) a distanza di sicurezza da scorte di legna, sacchi di farina, cartoni per pizza o altri materiali combustibili?",
            normReference: "D.Lgs. 81/2008 All. IV p. 4; D.M. 03/09/2021; D.M. 10/03/1998",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 1.2 MENSE AZIENDALI, SCOLASTICHE, OSPEDALIERE E CENTRI COTTURA PASTI VEICOLATI (Cook & Chill e Legame Caldo)
  // ATECO 56.29.10, 56.29.1, 56.29.20, 56.29
  {
    sectorKey: "mense_catering_collettiva",
    sectorLabel: "Mense Aziendali, Scolastiche, Ospedaliere e Centri Cottura Pasti Veicolati",
    atecoPrefixes: ["56.29.10", "56.29.1", "56.29.20", "56.29"],
    machines: [
      // --- REPARTO 1: GRANDI COTTURE & BLOCCO CALDO INDUSTRIALE (env-mensa-cottura) ---
      {
        machineKey: "forno_industriale_carrello",
        name: "Forno Combinato Industriale a Carrello Passante (20-40 Teglie GN)",
        type: "Apparecchiatura Termica di Cottura Industriale a Vapore/Convezione a Carrello",
        suggestedManufacturer: "Rational / Lainox / MKN",
        suggestedModel: "iCombi Pro 20-2/1 / Naboo Maxi 202",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FORNO_CARRELLO_SBLOCCO_GUIDA_ANTIRIBALTAMENTO",
            title: "Meccanismo di Blocco e Sblocco Sicuro Carrello Portateglie con Rampa a Filo",
            question: "Il sistema di aggancio e movimentazione del carrello portateglie (20-40 teglie GN 2/1 o GN 1/1) dispone di guide interne antiribaltamento, leva ergonomica di sblocco rapido protetta e rampa di accesso a filo pavimento per prevenire cadute di teglie con liquidi bollenti e sovraccarichi biomeccanici?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71 c. 3, All. V p. 6 e Titolo VI (MMC)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_CARRELLO_PORTA_TRIPLO_VETRO_VENTILATO",
            title: "Porta a Triplo Vetro Ventilato Termoisolante Anti-Ustione (UNI EN 203-1)",
            question: "La porta della camera di cottura è dotata di triplo vetro ventilato con rivestimento termoriflettente anti-ustione (temperatura superficiale esterna conforme a UNI EN 203-1) e maniglia di apertura a doppio scatto con sfiato controllato dei vapori caldi?",
            normReference: "UNI EN 203-1:2021; CEI EN 60335-2-42; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_CARRELLO_ARRESTO_VENTOLE_VAPORE",
            title: "Dispositivo di Arresto Immediato Ventole di Convezione e Iniezione Vapore all'Apertura",
            question: "All'apertura della porta del forno interviene microinterruttore di sicurezza che arresta istantaneamente la rotazione delle ventole di convezione e l'erogazione del vapore per prevenire ustioni da calore convettivo e vapore agli operatori?",
            normReference: "CEI EN 60335-2-42; UNI EN 203-1; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_CARRELLO_CAPPA_CONDENSAZIONE_FUMI",
            title: "Cappa a Condensazione di Vapori Canalizzata con Scarico Grassi Indipendente",
            question: "Il forno è asservito a cappa a condensazione fumi/vapori o canalizzazione indipendente a tetto provvista di scarico condense e separatore grassi per evitare ristagni oleosi, gocciolamenti e miasmi nell'area di cottura?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.9 e All. V p. 7; Reg. CE 852/2004 All. II cap. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_CARRELLO_SONDA_CUORE_6_PUNTI",
            title: "Sonda al Cuore Multipunto a 6 Punti di Misura con Registrazione Termica HACCP",
            question: "La sonda termometrica a spillone a 6 punti di rilevazione è integra, calibrata e interfacciata con il sistema di controllo per registrare il raggiungimento del punto critico CCP di cottura (>= +75°C al cuore) con allarme di deviazione?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "brasiera_ribaltabile_industriale",
        name: "Brasiera Ribaltabile Industriale Elettrica o a Gas (120-200 Litri)",
        type: "Macchina Termica Industriale di Cottura Multifunzione a Vasca Ribaltabile",
        suggestedManufacturer: "Angelo Po / Firex Cucimix / Nilma",
        suggestedModel: "Cucimix CBTG180 / Icon9000 / Magellano",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BRASIERA_RIBALTAMENTO_MOTORIZZATO_UNI13885",
            title: "Ribaltamento Motorizzato Progressivo a Uomo Presente (UNI EN 13885)",
            question: "Il meccanismo di ribaltamento della vasca (120-200 litri) è motorizzato con comando ad azione mantenuta (uomo presente) e velocità progressiva conforme a norma UNI EN 13885 per prevenire svuotamenti bruschi e sversamenti di liquidi bollenti?",
            normReference: "UNI EN 13885; D.Lgs. 81/2008 art. 71 c. 3, All. V p. 2 e All. VI",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BRASIERA_ARRESTO_RISCALDAMENTO_INCLINATA",
            title: "Dispositivo di Arresto Automatico Riscaldamento a Vasca Inclinata",
            question: "La brasiera è dotata di finecorsa di sicurezza che disattiva automaticamente bruciatori a gas o resistenze elettriche quando la vasca viene inclinata oltre l'assetto di cottura orizzontale?",
            normReference: "UNI EN 13885; CEI EN 60335-2-39; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BRASIERA_COPERCHIO_CONTROBILANCIATO_SFIATO",
            title: "Coperchio Controbilanciato con Sfiato Vapore e Maniglia Atermica",
            question: "Il coperchio superiore è provvisto di cerniere con molle di controbilanciamento antiraduta, maniglia atermica laterale e sfiato per convogliare l'uscita dei vapori in direzione opposta all'operatore?",
            normReference: "UNI EN 13885; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BRASIERA_ISOLAMENTO_TERMICO_SCARICO",
            title: "Pareti Termoisolate Anti-Ustione e Beccuccio di Scarico Frontale Controllato",
            question: "La struttura esterna della vasca è termoisolata per limitare le temperature di contatto superficiale e dispone di beccuccio o rubinetto di scarico frontale per lo svuotamento guidato nei carrelli porta-bacinelle?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 All. V p. 6; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BRASIERA_VALVOLA_GAS_TERMOSTATO_SICUREZZA",
            title: "Valvola Gas con Termocoppia di Sicurezza e Termostato di Massima Indipendente",
            question: "Nei modelli a gas o elettrici sono installati termostato di lavoro (50-300°C) e termostato di massima a riarmo manuale, con rubinetto a termocoppia rapida o accensione ionizzata con arresto gas in assenza di fiamma?",
            normReference: "UNI EN 203-1:2021; D.M. 12/04/1996; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "pentola_cottura_indiretta",
        name: "Pentola Industriale a Riscaldamento Indiretto / Vapore (150-300 Litri)",
        type: "Apparecchiatura di Cottura a Pressione/Vapore con Intercapedine Industriale",
        suggestedManufacturer: "Firex / Zanussi / Angelo Po",
        suggestedModel: "Major / Easyline 200 / Alpha 300L",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "PENTOLA_INTERCAPEDINE_PED_VALVOLA_MANOMETRO",
            title: "Intercapedine Acqua/Vapore Certificata PED con Valvola di Sicurezza e Manometro (D.Lgs. 26/2016)",
            question: "L'intercapedine di riscaldamento indiretto è marcata CE in conformità alla Direttiva PED (D.Lgs. 26/2016), dotata di manometro di pressione visibile e valvola di sicurezza a molla contro le sovrapressioni accidentali?",
            normReference: "Direttiva PED 2014/68/UE (D.Lgs. 26/2016); D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 7",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "PENTOLA_RUBINETTO_FARFALLA_BLOCCO_MECCANICO",
            title: "Rubinetto di Scarico a Farfalla da 2\" con Blocco Meccanico di Sicurezza",
            question: "Il rubinetto frontale a farfalla da 2 pollici è munito di levetta di blocco meccanico contro aperture accidentali da urto e convogliatore orientabile per evitare getti di liquidi bollenti sulle gambe dell'operatore?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PENTOLA_TERMOSTATO_LAVORO_MASSIMA_RIARMO",
            title: "Termostato Elettronico di Lavoro e Termostato Limite di Massima a Riarmo Manuale",
            question: "La pentola è munita di doppio sistema termostatico: termostato elettronico di lavoro e termostato di limite massimo indipendente a riarmo manuale che interviene disattivando il riscaldamento in caso di sovratemperatura o livello insufficiente nell'intercapedine?",
            normReference: "CEI EN 60335-2-47; UNI EN 203-1; D.Lgs. 81/2008 All. V p. 6 e 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PENTOLA_COPERCHIO_AUTOBILANCIATO_VALVOLA_SFIATO",
            title: "Coperchio Autobilanciato con Guarnizione e Valvola Depressiva di Sfiato",
            question: "Il coperchio superiore è autobilanciato con cerniere a molla progressive ed è provvisto di valvola di sfiato vapori caldi e valvola di compensazione depressione per impedire aperture violente sotto pressione?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "PENTOLA_LIVELLO_ACQUA_INTERCAPEDINE_AUTOMATICO",
            title: "Sistema di Reintegro Livello Acqua Intercapedine con Disconnettore UNI EN 1717",
            question: "Il circuito di rabbocco acqua dell'intercapedine dispone di sonde di livello con allarme di minimo e allaccio alla rete idrica dotato di interruzione d'aria a norma UNI EN 1717 per prevenire inquinamento dell'acquedotto potabile?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "abbattitore_roll_in",
        name: "Abbattitore Rapido a Carrello Passante (Roll-in Blast Chiller 100-200 kg)",
        type: "Impianto Frigorifero Rapido Industriale Cook & Chill a Carrello",
        suggestedManufacturer: "Irinox MultiFresh MF 250 / Coldline",
        suggestedModel: "MultiFresh MF 250 / Vision Industry Roll-in",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "ABBATTITORE_CICLO_COOK_CHILL_REG852",
            title: "Ciclo Cook & Chill Certificato: Abbattimento (+90°C a +3°C in 90 min) e Surgelazione (-18°C)",
            question: "L'abbattitore garantisce le curve termiche prescritte dal Reg. CE 852/2004 e dalle procedure HACCP per la ristorazione collettiva: abbattimento rapido positivo da +90°C a +3°C al cuore entro 90 minuti e surgelazione rapida fino a -18°C entro 240 minuti?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 193/2007; Linee Guida HACCP Ristorazione Collettiva",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_RAMPA_CARRELLO_A_FILO",
            title: "Rampa di Accesso Carrelli a Filo Pavimento con Guarnizione e Paracolpi",
            question: "La rampa di accesso per i carrelli portateglie GN è a filo pavimento senza dislivelli anti-inciampo ed è corredata da guarnizione inferiore a spazzola e paracolpi interni in acciaio inox sulle pareti della camera?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3 e 1.4; All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_SONDA_SPILLONE_RISCALDATA",
            title: "Sonda Spillone Multipunto con Riscaldamento a Fine Ciclo",
            question: "La sonda al cuore multipunto è dotata di sistema di riscaldamento automatico a fine ciclo per consentirne l'estrazione agevole dal prodotto congelato senza strappi, forzature o danneggiamento del cavo?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "ABBATTITORE_ALLARME_PORTA_E_SBLOCCO_INTERNO",
            title: "Allarme Visivo e Acustico Porta Aperta e Maniglione di Sblocco Interno",
            question: "La camera roll-in è provvista di allarme ottico e sonoro per porta aperta prolungata e dispositivo interno luminescente di apertura di emergenza azionabile a spinta dall'interno a norma UNI EN 378?",
            normReference: "UNI EN 378:2020; D.Lgs. 81/2008 All. IV p. 1.11 e All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_VENTOLE_GRIGLIE_PROTEZIONE",
            title: "Griglie di Protezione Ventole Evaporatore e Circuito Sigillato UNI EN 378",
            question: "Le potenti ventole di evaporazione ad alta portata sono dotate di griglie integrali di protezione a norma UNI EN ISO 13857 e il circuito frigorifero a gas a basso impatto ambientale è conforme alla norma UNI EN 378?",
            normReference: "UNI EN ISO 13857; UNI EN 378:2020; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "cuocipasta_ribaltabile_industriale",
        name: "Cuocipasta Automatico Industriale a Cestelli Basculanti Sollevabili",
        type: "Attrezzatura Termica di Cottura Primi Piatti a Sollevamento Automatico",
        suggestedManufacturer: "Nilma / Angelo Po / Firex",
        suggestedModel: "PastaMatic 150 / Icon Pasta Sollevabile",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CUOCIPASTA_SOLLEVAMENTO_AUTOMATICO_CESTELLI",
            title: "Sollevamento Automatico Temporizzato Cestelli per Prevenzione MMC e Ustioni (D.Lgs. 81/08 Titolo VI)",
            question: "I cestelli forati di cottura dispongono di sollevamento automatico motorizzato temporizzato per lo scolo controllato della pasta, eliminando sforzi lombosacrali per sollevamento carichi pesanti bagnati e scottature da vapore bollente?",
            normReference: "D.Lgs. 81/2008 Titolo VI (MMC), All. V p. 6 e All. XXXIII",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CUOCIPASTA_RIEMPIMENTO_DISCONNESSIONE_UNI1717",
            title: "Riempimento Automatico Livello Acqua con Interruzione d'Aria a Norma UNI EN 1717",
            question: "Il sistema di immissione acqua nella vasca di cottura è provvisto di disconnettore o erogatore a battente d'aria a norma UNI EN 1717 per impedire qualsiasi fenomeno di riflusso di amidi o acque reflue nella rete idrica potabile?",
            normReference: "UNI EN 1717:2002; D.Lgs. 31/2001; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CUOCIPASTA_SFIORATORE_AMIDI_TROPPOPIENO",
            title: "Scarico Sfioratore Amidi Continuo con Dispositivo Troppopieno Anti-Tracimazione",
            question: "La vasca è dotata di zona frontale di sfioro con troppopieno per l'eliminazione continua delle schiume amidacee, prevenendo tracimazioni di liquidi bollenti sul pavimento con rischio scivolamento e spegnimento fiamme?",
            normReference: "UNI EN 203-1:2021; D.Lgs. 81/2008 All. IV p. 1.3 e All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CUOCIPASTA_SENSORE_MANCANZA_ACQUA_TERMOSTATO",
            title: "Sensore di Livello Minimo e Termostato di Massima Anti-Funzionamento a Secco",
            question: "È installato dispositivo di sicurezza contro il funzionamento a secco che inibisce i bruciatori o le resistenze corazzate in caso di livello d'acqua insufficiente nella vasca?",
            normReference: "CEI EN 60335-2-47; UNI EN 203-1; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "cappa_compensata_collettivita",
        name: "Cappa di Aspirazione Compensata Industriale con Impianto Estinzione Ansul",
        type: "Impianto di Ventilazione Meccanica, Trattamento Aria e Antincendio Cucina",
        suggestedManufacturer: "Alvial / Camini & Cappe / Misa",
        suggestedModel: "Compensata Induzione High-Flow / Ansul R-102",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CAPPA_COLLETTIVITA_FILTRI_LABIRINTO_INOX",
            title: "Filtri a Labirinto Antigrasso in Acciaio Inox Lavabili con Bacinella Scolo",
            question: "La cappa è munita di filtri a labirinto inerziali in acciaio inox lavabili in lavastoviglie con canalina perimetrale e bacinella estraibile per la raccolta dei grassi condensati, prevenendo gocciolamenti infiammabili sui blocchi di cottura?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.9 e All. V p. 6; D.M. 03/09/2021; NFPA 96",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_COLLETTIVITA_ESTINZIONE_ANSUL_R102",
            title: "Impianto Automatico a Pioggia Ansul R-102 su Brasiere e Fuochi (NFPA 96 / UNI ISO 15371)",
            question: "Le apparecchiature termiche a forte carico calorico (brasiere, friggitrici, fuochi gas) sono protette da impianto automatico di spegnimento a umido Ansul R-102 a norma NFPA 96 e UNI ISO 15371, con comando manuale d'emergenza, intercettazione automatica del gas e tagliando semestrale?",
            normReference: "NFPA 96; UNI ISO 15371:2020; D.M. 03/09/2021; D.Lgs. 81/2008 art. 43 e 46",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_COLLETTIVITA_CANALIZZAZIONE_SERRANDA_REI",
            title: "Canalizzazione Indipendente a Tetto con Serranda Tagliafuoco",
            question: "Il condotto di estrazione fumi è a tenuta stagna per grassi e condense, indipendente da altre canalizzazioni, scarica a tetto e possiede serranda tagliafuoco certificata al passaggio dei compartimenti antincendio?",
            normReference: "UNI 10339; D.M. 03/09/2021; Regolamento Edilizio e d'Igiene; D.Lgs. 81/2008 All. IV",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_COLLETTIVITA_COMPENSAZIONE_INDUZIONE",
            title: "Sistema di Compensazione Aria con Mandata ad Induzione",
            question: "La cappa è provvista di mandata di compensazione con aria primaria trattata a induzione per bilanciare la forte estrazione senza generare depressioni nel locale e correnti disturbanti sulle fiamme dei bruciatori?",
            normReference: "UNI 10339; UNI EN 16282; D.Lgs. 81/2008 All. IV p. 1.9",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // --- REPARTO 2: MONDATURA ORTOFRUTTA (env-mensa-mondatura) ---
      {
        machineKey: "pelapatate_lavaverdure_industriale",
        name: "Pelapatate Industriale e Lavatrice per Verdure a Vortice Continuo",
        type: "Macchina Industriale di Pelatura Meccanica e Lavaggio Ortofrutta",
        suggestedManufacturer: "Dito Sama T15E / Sammic / Nilma",
        suggestedModel: "T15E / PI-20 / Atla Vortex",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "PELAPATATE_MICROINTERRUTTORE_UNI13208",
            title: "Microinterruttore di Arresto su Coperchio e Bocca di Scarico (UNI EN 13208)",
            question: "La macchina è provvista di microinterruttori di sicurezza con blocco istantaneo del piattello rotante all'apertura del coperchio superiore e dello sportello di scarico frontale a norma UNI EN 13208?",
            normReference: "UNI EN 13208; D.Lgs. 81/2008 art. 71, All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PELAPATATE_SCARICO_FILTRO_BUCCE_SIFONE",
            title: "Scarico Automatico con Cassetto Filtro Bucce e Sifone Decantatore",
            question: "Lo scarico dell'acqua è munito di cassetto filtro estraibile per la separazione e trattenimento delle bucce e scarti solidi, prevenendo ostruzioni fognarie e allagamenti del pavimento?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3; Reg. CE 852/2004 All. II cap. II",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "PELAPATATE_COMANDO_BASSA_TENSIONE_FUNGO",
            title: "Comando a Bassa Tensione 24V con Arresto di Emergenza a Fungo",
            question: "I comandi elettrici sono a bassissima tensione di sicurezza (24V) con grado di protezione IP65 contro getti d'acqua e includono pulsante di arresto di emergenza a fungo con ritenuta meccanica a vista?",
            normReference: "CEI EN 60204-1; CEI EN 60335-2-64; D.Lgs. 81/2008 All. V p. 2 e 8",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVAVERDURE_FLUSSO_VORTICE_REGOLABILE",
            title: "Lavatrice Verdure a Vortice Continuo con Centrifuga a Freno Meccanico",
            question: "La vasca di lavaggio ortaggi a flusso d'acqua regolabile e l'eventuale cestello di centrifugazione dispongono di freno motore a intervento rapido (< 3 secondi) all'apertura del coperchio?",
            normReference: "UNI EN 13208; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 3: PREPARAZIONE FREDDA & LAVORAZIONE CARNI/VERDURE (env-mensa-prep-fredda e env-mensa-diete-speciali) ---
      {
        machineKey: "tagliaverdure_cutter_industriale",
        name: "Robot Cutter / Tagliaverdure Industriale a Grande Capacità",
        type: "Macchina Elettromeccanica per Taglio, Cubettatura e Sminuzzamento Ortofrutta",
        suggestedManufacturer: "Robot Coupe CL 55 / CL 60",
        suggestedModel: "CL 55 Workstation / CL 60",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CUTTER_TRAMOGGIA_PRESSORE_SALVADITA",
            title: "Tramoggia per Tuberi Interi con Pressore Ergonomico Salvadita",
            question: "La tramoggia di carico a grande capacità è dotata di pressore ergonomico sagomato salvadita che impedisce l'introduzione delle mani nella zona di taglio durante il funzionamento dei dischi rotanti?",
            normReference: "UNI EN 12852:2010; UNI EN ISO 13857; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_ARRESTO_MOTORE_RAPIDO_UNI12852",
            title: "Arresto Motore Immediato (< 2s) al Sollevamento a Norma UNI EN 12852",
            question: "Il sensore magnetico codificato di sicurezza arresta la rotazione della lama entro un tempo inferiore a 2 secondi al sollevamento della leva pressore o allo sgancio del coperchio vasca a norma UNI EN 12852?",
            normReference: "UNI EN 12852; D.Lgs. 81/2008 All. V p. 2 e 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_BASAMENTO_INOX_MOCA",
            title: "Basamento e Componenti in Acciaio Inox Igienico MOCA (Reg. CE 1935/2004)",
            question: "Il basamento motore, la vasca e i gruppi dischi di taglio sono in acciaio inossidabile o polimeri per uso alimentare esenti da bave, facilmente smontabili e conformi ai requisiti MOCA?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_DISPOSITIVO_NO_VOLT_RIAVVIO",
            title: "Dispositivo di Riavvio No-Volt e Comandi a Bassa Tensione IP55",
            question: "I pulsanti di marcia e arresto sono a membrana stagna e integrano relè di minima tensione (No-Volt release) che impedisce il riavvio spontaneo della macchina a seguito di ripristino dell'energia elettrica?",
            normReference: "CEI EN 60204-1 punto 7.5; D.Lgs. 81/2008 All. V p. 2.1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "affettatrice_industriale_continua",
        name: "Affettatrice Industriale Automatica a Gravità con Nastro di Uscita",
        type: "Macchina per Affettatura Automatica Continua Carni e Salumi",
        suggestedManufacturer: "Berkel / Sirman Leonardo / Bizerba",
        suggestedModel: "Leonardo 350 Auto / Bizerba A400 / Berkel B300A",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "AFFETTATRICE_CONTINUA_RIPARI_INTERBLOCCATI_UNI1974",
            title: "Avanzamento Automatico Prodotto con Ripari Integrali Fissi e Interbloccati (UNI EN 1974)",
            question: "Il carrello ad avanzamento automatico motorizzato è protetto da ripari integrali fissi e interbloccati che impediscono l'accesso alla zona di taglio e al filo lama durante il ciclo automatico a norma UNI EN 1974?",
            normReference: "UNI EN 1974:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_CONTINUA_ANELLO_PARALAMA_FISSO",
            title: "Anello Paralama Continuo a Protezione del Filo Tagliente",
            question: "La porzione non attiva della lama circolare è permanentemente segregata da anello paralama circolare continuo fisso che garantisce protezione anche durante le operazioni di pulizia e sanificazione?",
            normReference: "UNI EN 1974 punto 5.2.2; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_CONTINUA_BLOCCO_SPESSORE_ZERO",
            title: "Dispositivo di Blocco a Spessore Zero della Vela per Smontaggio Piatto",
            question: "La macchina è provvista di meccanismo di sicurezza a camme che permette lo smontaggio del piatto portamerce solo quando la vela è completamente chiusa a spessore zero a contatto con la lama?",
            normReference: "UNI EN 1974 punto 5.2.5; D.Lgs. 81/2008 art. 71 c. 3 e All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_CONTINUA_NASTRO_USCITA_PRESSAMERCE",
            title: "Nastro di Uscita Fette o Dispositivo Deposito con Pressamerce Salvadita",
            question: "Il convogliatore/nastro di uscita e il pressamerce basculante sono muniti di protezioni e impugnature che mantengono le mani a debita distanza dal tagliente della lama?",
            normReference: "UNI EN 1974; UNI EN ISO 13857; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 4: CONFEZIONAMENTO & LOGISTICA PASTI VEICOLATI (env-mensa-confezionamento) ---
      {
        machineKey: "termosigillatrice_automatica_vaschette",
        name: "Termosigillatrice Automatica per Vaschette Pasti (ATM / Sottovuoto)",
        type: "Macchina Automatica per Confezionamento Vaschette in Atmosfera Protettiva",
        suggestedManufacturer: "Ilpra Foodpack / Gruppo Fabbri / Valko",
        suggestedModel: "Foodpack 400 Extra / Fabbri Automac / Linepack ATM",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "TERMOSIGILLATRICE_CARTER_INTERBLOCCATI_SCHIACCIAMENTO",
            title: "Carter Perimetrali Interbloccati Anti-Schiacciamento Mani su Stampo e Lame",
            question: "Lo stampo di saldatura termica e il gruppo coltelli perimetrali di rifilo film sono protetti da carter interbloccati o barriere ottiche che provocano l'arresto immediato del movimento all'apertura o intrusione delle mani?",
            normReference: "UNI EN 415-3; D.Lgs. 81/2008 All. V p. 6 e All. VI",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "TERMOSIGILLATRICE_BOBINA_FILM_FOTOCELLULA",
            title: "Bobina Film con Fotocellula di Centraggio Stampa e Riavvolgitore Scarti",
            question: "Il gruppo svolgitore della bobina è dotato di fotocellula per il centraggio della stampa e mandrino riavvolgitore dello sfrido film con frizione limitatrice di coppia contro i rischi di trascinamento dita?",
            normReference: "UNI EN 415-3; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "TERMOSIGILLATRICE_REGOLAZIONE_TEMPERATURA_PIASTRA",
            title: "Regolazione Temperatura Piastra Saldante con Allarme Soglia Termica",
            question: "La piastra saldante è controllata da termoregolatore digitale con allarme di tolleranza termica che arresta il confezionamento in caso di calo termico, garantendo sigillatura ermetica a tenuta igienica?",
            normReference: "Reg. CE 852/2004 All. II cap. X; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "TERMOSIGILLATRICE_EVACUAZIONE_ARIA_GAS_INERTE",
            title: "Evacuazione Aria e Iniezione Gas Inerte Alimentare (ATM) con Valvole di Sicurezza",
            question: "Il circuito del vuoto e dell'iniezione di miscela di gas inerte alimentare (N2/CO2) dispone di valvole di non ritorno, tubazioni certificate, bombole saldamente ancorate a parete e pressostati di sicurezza?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.11, All. V p. 7; Reg. CE 1935/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "contenitori_isotermici_trasporto",
        name: "Contenitori Isotermici Gastronorm per Trasporto Pasti Veicolati",
        type: "Attrezzatura Termica Passiva/Attiva per Logistica Alimentare Veicolata",
        suggestedManufacturer: "Melform Thermax / Rieber Thermoport",
        suggestedModel: "Thermax GN 1/1 / Thermoport 1000 / Camtainer",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CONTENITORI_ISOTERMICI_CONFORMITA_ATP_TEMP",
            title: "Conformità ATP per Trasporto Pasti in Legame Caldo (>= +65°C) e Freddo (<= +4°C)",
            question: "I contenitori isotermici monoblocco a doppia parete coibentata garantiscono la conformità ATP per mantenere i pasti trasportati a temperatura di sicurezza: legame caldo ad almeno +65°C e legame freddo entro +4°C fino alla consegna?",
            normReference: "Accordo ATP; Reg. CE 852/2004 All. II cap. IV; D.Lgs. 193/2007; Linee Guida Ristorazione Collettiva",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CONTENITORI_ISOTERMICI_CERNIERE_CHIUSURE_ERMETICHE",
            title: "Cerniere e Chiusure a Scatto Ermetiche con Valvola di Sfiato",
            question: "I ganci di chiusura a scatto e le cerniere sono integri e corredati da valvola di compensazione depressione per consentire l'apertura agevole senza strappi e senza spruzzi di liquidi caldi?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CONTENITORI_ISOTERMICI_GUARNIZIONI_SILICONICHE_MOCA",
            title: "Guarnizioni Perimetrali Siliconiche Sanificabili MOCA (Reg. CE 1935/2004)",
            question: "Le guarnizioni perimetrali di tenuta sono in silicone alimentare certificato MOCA, prive di fessurazioni, facilmente sfilabili per la sanificazione giornaliera e resistenti alle temperature di lavaggio?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CONTENITORI_ISOTERMICI_PREDISPOSIZIONE_PIASTRE_EUTETTICHE",
            title: "Predisposizione e Alloggiamento Sicuro Piastre Eutettiche Calde/Fredde",
            question: "Il contenitore dispone di guide e alloggiamenti stabili per l'inserimento bloccato di piastre eutettiche calde o fredde con fermo anti-caduta e maniglie di sollevamento ergonomiche per la presa a due mani?",
            normReference: "D.Lgs. 81/2008 Titolo VI e All. XXXIII; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "transpallet_inox_alimentare",
        name: "Transpallet Manuale in Acciaio Inox per Ambienti Umidi e Alimentari",
        type: "Attrezzatura Manuale di Movimentazione Pallet e Contenitori Alimentari",
        suggestedManufacturer: "Pramac Lifter GS Inox / Ravaglioli",
        suggestedModel: "GS Inox / TM Inox Special",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "TRANSPALLET_INOX_POMPA_STAGNA_LAVAGGI",
            title: "Pompa Idraulica Stagna Resistente a Lavaggi ad Alta Pressione e Acidi Detergenti",
            question: "Il telaio portante, le forche e la pompa idraulica sono costruiti interamente in acciaio inossidabile AISI 304/316 con guarnizioni a tenuta stagna resistenti a lavaggi frequenti e detergenti sanificanti acidi?",
            normReference: "UNI EN ISO 3691-5; D.Lgs. 81/2008 art. 71 c. 3; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "TRANSPALLET_INOX_VALVOLA_MASSIMA_PRESSIONE",
            title: "Valvola di Massima Pressione Idraulica Contro i Sovraccarichi",
            question: "Il circuito idraulico è provvisto di valvola di sovrappressione tarata che impedisce il sollevamento di carichi eccedenti la portata nominale (es. 2.000 kg), proteggendo l'operatore da ribaltamenti e cedimenti?",
            normReference: "UNI EN ISO 3691-5 punto 4.3; D.Lgs. 81/2008 All. V p. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TRANSPALLET_INOX_TIMONE_SALVAMANI_DISCESA",
            title: "Timone Ergonomico con Impugnatura Salvamani e Leva a 3 Posizioni",
            question: "L'impugnatura del timone protegge le mani dell'operatore ed è dotata di leva ergonomica a 3 posizioni (sollevamento, folle per trazione, discesa controllata con arresto graduale)?",
            normReference: "UNI EN ISO 3691-5 punto 4.4; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "TRANSPALLET_INOX_RUOTE_NYLON_ALIMENTARE",
            title: "Ruote e Rulli in Nylon Bianco Alimentare con Cuscinetti a Tenuta",
            question: "Le ruote direzionali e i rulli doppi di carico sono realizzati in nylon bianco alimentare anti-traccia, esenti da fessurazioni e con cuscinetti schermati a tenuta stagna contro la ruggine?",
            normReference: "UNI EN ISO 3691-5; Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },

      // --- REPARTO 5: DISTRIBUZIONE PASTI & SALA (env-mensa-sala-selfservice) ---
      {
        machineKey: "linea_distribuzione_selfservice",
        name: "Linea Self-Service Distribuzione Pasti (Banchi Caldi GN e Banchi Refrigerati)",
        type: "Impianto Modulare di Distribuzione e Mantenimento Termico Pasti",
        suggestedManufacturer: "Enofrigo / Afinox / Zanussi",
        suggestedModel: "Drop-In Twist / Fast Food 2000 / Selfline Pro",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LINEA_SELFSERVICE_BAGNOMARIA_CALDO_65C",
            title: "Bagnomaria Caldo con Mantenimento Rigoroso >= +65°C al Cuore con Termoregolatore",
            question: "La vasca bagnomaria calda assicura il mantenimento costante delle pietanze cotte ad almeno +65°C al cuore del cibo, con termoregolatore digitale a vista e rubinetto di scarico acqua con valvola protetta?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 193/2007; Linee Guida Ristorazione Collettiva",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LINEA_SELFSERVICE_CRISTALLI_PARAFIATO_CURVI",
            title: "Cristalli Parafiato Curvi Igienici di Protezione Antiaerosol",
            question: "La linea di distribuzione è protetta da cupole o vetri parafiato curvi in cristallo temperato di sicurezza integri, che schermano completamente il cibo da aerosol biologico e manipolazioni improprie dei commensali?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LINEA_SELFSERVICE_BANCHI_REFRIGERATI_4C",
            title: "Banchi Refrigerati +4°C per Piatti Freddi e Dessert con Sbrinamento Automatico",
            question: "Il modulo refrigerato a vasca mantiene la temperatura controllata tra +2°C e +4°C per piatti freddi, insalate e dessert, con display digitale e isolamento perimetrale anticondensa?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; CEI EN 60335-2-89",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LINEA_SELFSERVICE_SCORRIVASSOI_SENZA_SPIGOLI",
            title: "Scorrivassoi Tubolari Inox Privi di Spigoli Vivi e Sbavature Taglienti",
            question: "I binari scorrivassoi frontali sono fissati saldamente alla struttura, continui e in tubolari di acciaio inox esenti da spigoli vivi, sporgenze o sbavature taglienti?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "carrelli_termici_porta_gn",
        name: "Carrelli Termici Mobili Riscaldati / Refrigerati per Distribuzione Reparti",
        type: "Attrezzatura Mobile per Mantenimento Termico e Distribuzione Pasti",
        suggestedManufacturer: "Blanco / Rieber / ScanBox",
        suggestedModel: "BlancoTherm / Thermics GN 20 / Ergo Line",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CARRELLO_TERMICO_MANTENIMENTO_TEMPERATURA_65C",
            title: "Termostato Digitale per Mantenimento Legame Caldo >= +65°C Durante il Tragitto",
            question: "Il sistema termico ventilato assicura il mantenimento della temperatura delle pietanze calde ad almeno +65°C o fredde a <= +4°C durante il trasporto verso i reparti o le sale refettorio, con lettura digitale a display?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 193/2007; Linee Guida Ristorazione Ospedaliera",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CARRELLO_TERMICO_CAVO_SPIRALE_ALLOGGIAMENTO",
            title: "Cavo Elettrico a Spirale con Spina CEE e Supporto Portacavo a Bordo",
            question: "Il carrello dispone di cavo a spirale con spina industriale CEE e alloggiamento sagomato a bordo per impedire che il cavo venga calpestato o costituisca inciampo durante la movimentazione?",
            normReference: "CEI EN 60335-2-49; CEI 64-8; D.Lgs. 81/2008 All. V p. 2 e 8",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CARRELLO_TERMICO_PARACOLPI_GOMMATI_MANIGLIE",
            title: "Paracolpi Perimetrali Gommati e Maniglie di Manovra Ergonomiche",
            question: "La base e il perimetro superiore sono dotati di paracolpi continui in gomma elastica anti-traccia e maniglie ergonomiche isolate per evitare contusioni e schiacciamento mani nel passaggio attraverso porte e montacarichi?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; Titolo VI (MMC)",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CARRELLO_TERMICO_RUOTE_PIROETTANTI_FRENO",
            title: "Ruote Piroettanti Antitraccia con Freno Meccanico a Pedale",
            question: "Il carrello monta 4 ruote piroettanti in gomma o poliuretano anti-traccia di grande diametro, con freno a pedale indipendente su almeno due ruote per impedirne lo spostamento accidentale in stazionamento?",
            normReference: "UNI EN 12532; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 6: CENTRALE LAVAGGIO MECCANIZZATO (env-mensa-tunnel-stoviglie e env-mensa-lavaggio-pentole) ---
      {
        machineKey: "lavastoviglie_tunnel_traino",
        name: "Impianto di Lavaggio Meccanizzato a Nastro / Traino per Piatti e Vassoi",
        type: "Impianto Industriale Continuo di Lavaggio e Sanificazione Stoviglie",
        suggestedManufacturer: "Winterhalter MT Series / Hobart Premax / Meiko",
        suggestedModel: "MTF Series / Premax CPT / M-iQ",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LAVASTOVIGLIE_TUNNEL_ARRESTO_EMERGENZA_FUNE_UNI50416",
            title: "Arresto Emergenza a Fune o Fungo Lungo il Nastro Trasportatore (UNI EN 50416)",
            question: "L'impianto a nastro/traino continuo è dotato di dispositivo di arresto di emergenza a fune perimetrale o pulsanti a fungo accessibili lungo tutto lo sviluppo del nastro sia al carico sia allo scarico a norma UNI EN 50416?",
            normReference: "UNI EN 50416; CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_TUNNEL_CONDENSATORE_TENDINE",
            title: "Condensatore Vapori con Recupero Calore e Tendine Paraspruzzi",
            question: "Il tunnel è corredato da cappa/condensatore di vapori con evacuazione forzata (e recupero termico) e tendine paraspruzzi integre tra le sezioni per scongiurare fuoriuscite di vapori ustionanti e aerosol caustici?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.9 e All. V p. 6; Reg. CE 852/2004 All. II cap. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_TUNNEL_RISCIACQUO_82C_DIN10510",
            title: "Risciacquo Igienico ad Alta Temperatura (>= 82°C) Conforme a DIN 10510",
            question: "La fase di risciacquo finale garantisce una temperatura costante dell'acqua di almeno 82°C (o 85°C a norma DIN 10510) con termometro visibile a display per assicurare la termo-sanificazione delle stoviglie?",
            normReference: "DIN 10510; Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_TUNNEL_DOSATORI_CIRCUITO_CHIUSO",
            title: "Dosatori Automatici Peristaltici Detergente e Brillantante",
            question: "I prodotti chimici concentrati (detergente alcalino e brillantante) sono alimentati mediante dosatori peristaltici automatici a circuito chiuso direttamente dalle taniche originali senza travasi manuali?",
            normReference: "D.Lgs. 81/2008 Titolo IX (Rischio Chimico, art. 224-225); Reg. CE 852/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_TUNNEL_FRIZIONE_BLOCCO_NASTRO",
            title: "Frizione Elettronica di Sicurezza sul Traino con Blocco per Incaglio",
            question: "Il gruppo di trazione dispone di frizione di sicurezza o sensore amperometrico che blocca istantaneamente il nastro in caso di incaglio o inceppamento di piatti o vassoi?",
            normReference: "UNI EN 50416; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "lavaoggetti_ghigliottina_collettivita",
        name: "Lavaoggetti Industriale per Pentole e Teglie GN 2/1 (Pot-Washer)",
        type: "Macchina Industriale per Lavaggio Pesante Pentole, Bacinelle e Teglie",
        suggestedManufacturer: "Winterhalter UF-L / Comenda",
        suggestedModel: "UF-L Pot Washer / Comenda GE / Hobart UPT",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LAVAOGGETTI_GHIGLIOTTINA_CONTROBILANCIATA_MICRO",
            title: "Porta Controbilanciata a Ghigliottina con Microinterruttore di Arresto Ciclo",
            question: "La porta a scorrimento verticale a ghigliottina è dotata di molle di controbilanciamento antiraduta e microinterruttore di sicurezza che arresta istantaneamente la pompa ad alta pressione al sollevamento?",
            normReference: "CEI EN 60335-2-58; UNI EN 50416; D.Lgs. 81/2008 All. V p. 2 e 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVAOGGETTI_VASCA_CESTELLO_ESTRAIBILE_PENTOLE",
            title: "Vasca Profonda con Cestello Estraibile Rinforzato per Pentole Giganti e Teglie GN 2/1",
            question: "La macchina dispone di vasca profonda con cestello in acciaio inox rinforzato montato su guide di scorrimento con fermo anti-ribaltamento per facilitare il carico di pentolame pesante e teglie GN 2/1 senza sforzi posturali impropri?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; Titolo VI (MMC)",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVAOGGETTI_DOSATORI_PERISTALTICI_AUTOMATICI",
            title: "Dosatori Peristaltici Automatici per Detergenti e Disincrostanti Industriali",
            question: "I prodotti chimici ad azione sgrassante e disincrostante sono erogati da dosatori peristaltici automatici a prelievo diretto per azzerare il contatto degli operatori con sostanze chimiche corrosive?",
            normReference: "D.Lgs. 81/2008 Titolo IX art. 224-225; Reg. CE 852/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVAOGGETTI_DISPOSITIVO_ANTIRIFLUSSO_UNI1717",
            title: "Dispositivo di Prevenzione Antiriflusso a Disconnessione Idraulica UNI EN 1717",
            question: "Il circuito idraulico di carico è dotato di serbatoio con interruzione a battente d'aria (break tank) conforme alla norma UNI EN 1717 per scongiurare ritorni di acqua sporca nella rete potabile?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 7: FREDDO, CAMPIONI & STOCCAGGIO (env-mensa-celle-frigo e env-mensa-dispensa) ---
      {
        machineKey: "armadio_congelatore_campioni",
        name: "Armadio Congelatore Dedicato Campioni Testimoniali (Aliquota Pasti 72 Ore)",
        type: "Apparecchiatura Frigorifera Specializzata per Tracciabilità e Rischio Biologico",
        suggestedManufacturer: "Liebherr / Friulinox",
        suggestedModel: "MediLine Freezer / Friulinox Lab 700 / Ilsa Neos",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CONGELATORE_CAMPIONI_SERRATURA_CHIAVE_NAS",
            title: "Serratura a Chiave per Custodia Esclusiva Campioni Testimoniali ASL/NAS (72 Ore)",
            question: "L'armadio congelatore è dotato di serratura a chiave dedicata sotto la responsabilità del capocentro per la conservazione esclusiva e inviolabile delle aliquote pasto testimoniali per almeno 72 ore dal consumo ai fini di indagini ASL/NAS su tossinfezioni?",
            normReference: "Reg. CE 852/2004; Reg. CE 178/2002 art. 18; Linee Guida Ministero della Salute Ristorazione Collettiva",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CONGELATORE_CAMPIONI_TEMPERATURA_COSTANTE_18",
            title: "Temperatura Costante <= -18°C per Conservazione Aliquota Pasti 72 Ore",
            question: "L'impianto mantiene una temperatura rigorosa e continua pari o inferiore a -18°C con allarme di soglia e registrazione continua delle temperature a norma EN 12830?",
            normReference: "Linee Guida Ministeriali Ristorazione Scolastica/Ospedaliera; Reg. CE 852/2004 All. II cap. IX",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CONGELATORE_CAMPIONI_ALLARME_VISIVO_ACUSTICO",
            title: "Allarme Visivo e Acustico di Temperatura e Mancata Alimentazione",
            question: "È presente allarme sonoro e ottico che segnala tempestivamente innalzamenti termici anomali, porta aperta o mancanza di alimentazione elettrica?",
            normReference: "UNI EN 12830:2018; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "CONGELATORE_CAMPIONI_VASCHETTE_SIGILLATE_MOCA",
            title: "Ripiani con Vaschette Sigillabili Monouso MOCA Identificate per Pasto e Turno",
            question: "I campioni sono contenuti in vaschette sterili sigillabili monouso conformi MOCA, identificate per data, tipologia pasto e turno di preparazione?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. IV",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "celle_frigorifere_walkin",
        name: "Impianto Celle Frigorifere Walk-in Differenziate per Materie Prime e Finiti",
        type: "Impianto Frigorifero Industriale Modulare con Accesso a Uomo a Bordo/Carrelli",
        suggestedManufacturer: "Zanotti / Rivacold / Misa",
        suggestedModel: "Misa K-System / Rivacold Walk-in / Zanotti Blok",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CELLE_WALKIN_PAVIMENTO_FILO_RAMPA_CARRELLI",
            title: "Pavimentazione Calpestabile a Filo Pavimento con Rampa Carrelli e Superficie Antiscivolo",
            question: "La pavimentazione interna è a filo pavimento o provvista di rampa dolce per consentire l'ingresso senza urti di carrelli e transpallet ed è dotata di superficie mandorlata antiscivolo R11/R12?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3 e 1.4",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CELLE_WALKIN_ALLARME_UOMO_INTRAPPOLATO_UNI378",
            title: "Allarme Acustico-Visivo Uomo Intrappolato a Bassa Tensione h24 (UNI EN 378)",
            question: "All'interno di ciascuna cella frigorifera è installato pulsante luminoso 'Uomo Intrappolato' collegato ad allarme sonoro e lampeggiante esterno a 24V con batteria tampone h24 a norma UNI EN 378?",
            normReference: "UNI EN 378:2020 punto 6.2.14; D.Lgs. 81/2008 art. 43 e All. IV p. 1.11",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CELLE_WALKIN_APERTURA_INTERNA_LUMINESCENTE",
            title: "Dispositivo di Apertura Interna Fluorescente di Sicurezza",
            question: "La maniglia della porta è munita di pulsante o leva interna fluorescente luminescente che consente l'apertura immediata a spinta dall'interno anche con porta chiusa a chiave dall'esterno?",
            normReference: "UNI EN 378:2020; D.Lgs. 81/2008 All. IV p. 1.11 e All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CELLE_WALKIN_TELETERMOMETRI_REGISTRATORI_CONTINUI",
            title: "Teletermometri Registratori Continui a Display Digitale (EN 12830)",
            question: "Le celle frigorifere dispongono di teletermometri registratori continui digitali conformi a norma EN 12830 per il monitoraggio della catena del freddo e allarme remoto di anomalia termica?",
            normReference: "UNI EN 12830; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
    ],
  },

  // 1.3 CATERING PER EVENTI, BANQUETING E RICEVIMENTI
  // ATECO 56.21.00, 56.21.0, 56.21
  {
    sectorKey: "catering_eventi_banqueting",
    sectorLabel: "Catering per Eventi, Banqueting e Ricevimenti",
    atecoPrefixes: ["56.21.00", "56.21.0", "56.21"],
    machines: [
      // --- REPARTO 1: CUCINA CENTRALE & PRODUZIONE BASE (env-cat-cucina-centrale) ---
      {
        machineKey: "forno_combinato_catering",
        name: "Forno Combinato Convezione/Vapore Professionale per Grandi Volumi",
        type: "Apparecchiatura Termica di Cottura Professionale a Vapore/Convezione per Grandi Volumi",
        suggestedManufacturer: "Rational / Unox",
        suggestedModel: "iCombi Pro 10 o 20 teglie GN / Cheftop Mind.Maps",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FORNO_CATERING_PORTA_TRIPLO_VETRO_VENTILATO",
            title: "Porta con Triplo Vetro Ventilato e Temperatura Esterna Anti-Ustione (UNI EN 203-1)",
            question: "La porta della camera di cottura è provvista di triplo vetro ventilato con rivestimento atermico basso-emissivo conforme a norma UNI EN 203-1 per prevenire ustioni da contatto ed è dotata di maniglia con meccanismo di apertura a doppio scatto con sfogo controllato del vapore residuo?",
            normReference: "UNI EN 203-1; CEI EN 60335-2-42; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_CATERING_ARRESTO_VENTOLE_INIEZIONE_VAPORE",
            title: "Arresto Immediato di Rotazione Ventole e Generatore di Vapore all'Apertura Porta",
            question: "L'apertura della porta aziona microinterruttore di sicurezza che blocca tempestivamente la rotazione delle ventole di convezione e l'erogazione del vapore saturo per impedire getti violenti di calore convettivo e vapore verso il viso dell'operatore?",
            normReference: "CEI EN 60335-2-42; UNI EN 203-1; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_CATERING_SONDA_CUORE_6_PUNTI_CCP",
            title: "Sonda al Cuore Multipunto a 6 Punti di Misura con Registrazione Termica HACCP",
            question: "La sonda termometrica a spillone a 6 punti di rilevazione è calibrata, priva di lesioni al cavo di raccordo e integrata con il sistema digitale del forno per garantire e registrare il superamento del punto critico CCP di cottura (>= +75°C al cuore) secondo i protocolli per banqueting?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "FORNO_CATERING_CAPPA_CONDENSAZIONE_SCARICO_GRASSI",
            title: "Cappa a Condensazione Integrata o Canalizzata con Scarico Grassi Indipendente",
            question: "Il forno combinato per grandi volumi è asservito a cappa di aspirazione/condensazione vapori con separatore di grassi canalizzato e vaschetta di raccolta per prevenire fumi, accumuli scivolosi a pavimento e condense oleose?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.9 e All. V p. 7; Reg. CE 852/2004 All. II cap. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "abbattitore_temperatura_catering",
        name: "Abbattitore Rapido e Surgelatore Professionale a Carrello",
        type: "Apparecchiatura di Refrigerazione Rapida e Surgelazione Positiva/Negativa a Carrello",
        suggestedManufacturer: "Irinox / Coldline",
        suggestedModel: "MultiFresh Next / Vision Heavy Duty",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "ABBATTITORE_CATERING_CICLO_RAPIDO_POSITIVO_NEGATIVO",
            title: "Ciclo Rapido di Abbattimento Positivo (+3°C) e Negativo (-18°C) nei Tempi di Legge (Reg. CE 852/04)",
            question: "L'abbattitore garantisce il completamento dei cicli entro i limiti normativi (abbattimento positivo da +70°C a +3°C al cuore entro 90 minuti; surgelazione da +70°C a -18°C entro 240 minuti) per la pianificazione anticipata in sicurezza dei menu dell'evento?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_CATERING_SONDA_SPILLONE_RISCALDATA",
            title: "Sonda al Cuore Multipunto Riscaldata per Estrazione Sicura Senza Lacerazione Alimenti",
            question: "La sonda a spillone multipunto è integra, calibrata periodicamente ed è dotata di riscaldamento automatico a fine ciclo di surgelazione per consentirne l'estrazione senza sforzi traumatici dell'operatore né danneggiamento del prodotto?",
            normReference: "Reg. CE 852/2004; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "ABBATTITORE_CATERING_ALLARME_PORTA_RAMPA_CARRELLO",
            title: "Allarme Porta Aperta, Maniglia Ergonomica e Rampa Filo Pavimento per Carrelli GN",
            question: "La camera è provvista di avvisatore acustico/visivo di porta aperta prolungata, guarnizioni magnetiche riscaldate anticongelamento e rampa di invito a filo pavimento per l'inserimento senza urti o ribaltamenti dei carrelli teglie GN?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e Titolo VI (MMC); CEI EN 60335-2-89",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_CATERING_CIRCUITO_FRIGO_GAS_ECOLOGICO",
            title: "Circuito Frigorifero Sigillato con Gas Ecologico e Connessione Allarmi HACCP (EN 378)",
            question: "Il circuito refrigerante a gas ecologico è a tenuta conforme a norma UNI EN 378, con registro apparecchiature F-Gas aggiornato (se applicabile per carica refrigerante) e modulo telemetria per archiviazione dei grafici di abbattimento?",
            normReference: "UNI EN 378; Reg. UE 517/2014 / Reg. UE 2024/573; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "brasiera_ribaltabile_catering",
        name: "Brasiera Ribaltabile Professionale 80-120 Litri",
        type: "Macchina Termica di Cottura Multifunzione a Vasca Ribaltabile Motorizzata",
        suggestedManufacturer: "Firex / Angelo Po",
        suggestedModel: "Cucimix CBTG100 / Icon9000 80-120L",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BRASIERA_CATERING_RIBALTAMENTO_MOTORIZZATO_UNI13885",
            title: "Comando di Ribaltamento Motorizzato ad Azione Mantenuta Hold-To-Run (UNI EN 13885)",
            question: "Il sistema di ribaltamento vasca (80-120 litri) è motorizzato a bassa velocità controllata e azionato da comando a pulsante ad azione mantenuta (uomo presente) conforme a norma UNI EN 13885 per impedire versamenti improvvisi e ustioni da liquidi caldi?",
            normReference: "UNI EN 13885; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BRASIERA_CATERING_ARRESTO_RISCALDAMENTO_INCLINATA",
            title: "Interblocco di Sicurezza con Arresto Automatico Riscaldamento a Vasca Inclinata",
            question: "È presente un microinterruttore o finecorsa certificato che disattiva immediatamente bruciatori a gas o resistenze elettriche non appena la vasca viene inclinata oltre l'assetto orizzontale di cottura?",
            normReference: "UNI EN 13885; CEI EN 60335-2-39; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BRASIERA_CATERING_COPERCHIO_CONTROBILANCIATO_SFIATO",
            title: "Coperchio Controbilanciato Antiraduta con Sfiato Vapori e Maniglia Atermica",
            question: "Il coperchio in acciaio inox è montato su cerniere con molle di controbilanciamento progressive anticaduta, maniglia isolata atermica e condotto di sfiato orientato posteriormente per evitare getti di vapore sul corpo dell'operatore?",
            normReference: "UNI EN 13885; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BRASIERA_CATERING_VALVOLA_SCARICO_BECCUCCIO_FRONTALE",
            title: "Beccuccio di Scarico Frontale Sagomato con Convogliatore per Bacinelle Gastronorm",
            question: "Il bordo vasca dispone di beccuccio o canalina sagomata di scolo per il travaso progressivo senza schizzi di brodi, salse o stufati nei contenitori carrellati posizionati sottostanti?",
            normReference: "UNI EN 13885; D.Lgs. 81/2008 All. V p. 6; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "confezionatrice_sottovuoto_catering",
        name: "Confezionatrice Sottovuoto a Doppia Barra Saldante per Linee Eventi",
        type: "Macchina Confezionatrice Sottovuoto a Campana con Doppia Barra Saldante",
        suggestedManufacturer: "Orved / Besser Vacuum",
        suggestedModel: "VM 18 / Mistral 42 DUAL",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SOTTOVUOTO_CATERING_CAMPANA_PLEXIGLASS_PISTONI",
            title: "Coperchio Bombato in Plexiglass Antiurto con Pistoni a Gas Ammortizzati Anticaduta",
            question: "La campana di chiusura trasparente in materiale ad alta resistenza è integra (priva di fessurazioni o crepe strutturali) e supportata da pistoni a gas tarati che ne prevengono la ricaduta accidentale sulle mani dell'operatore?",
            normReference: "D.Lgs. 81/2008 All. V p. 2; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SOTTOVUOTO_CATERING_MICRO_SICUREZZA_CAMPANA_APERTA",
            title: "Microinterruttore di Sicurezza e Inibizione Ciclo di Vuoto a Campana Aperta",
            question: "Il ciclo di vuoto e l'impulso elettrico ad alta corrente alle doppie barre saldanti si attivano unicamente a campana completamente abbassata e si arrestano all'apertura d'emergenza della vasca?",
            normReference: "CEI EN 60335-2-45; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SOTTOVUOTO_CATERING_DOPPIA_BARRA_SALDANTE_SOUSVIDE",
            title: "Doppia Barra Saldante Ermetica per Sigillatura Buste da Cottura Sous-Vide e Conservazione",
            question: "Le barre saldanti dispongono di teflon protettivo integro, doppio filo di saldatura ad accostamento parallelo e regolazione elettronica del tempo di saldatura per garantire tenuta ermetica senza perdita di liquidi durante il trasporto e la rigenerazione?",
            normReference: "Reg. CE 852/2004 All. II cap. X; Reg. CE 1935/2004 (MOCA)",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "SOTTOVUOTO_CATERING_POMPA_VUOTO_FILTRO_DISOLEATORE",
            title: "Pompa Vuoto a Bagno d'Olio con Filtro Disoleatore Fumi e Scarico Condense",
            question: "La pompa del vuoto è sottoposta a manutenzione periodica del livello e qualità dell'olio ed è provvista di filtro disoleatore per evitare l'emissione di aerosol e vapori oleosi nell'ambiente di lavoro?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 4 e All. IV p. 1.9",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 2: PREPARAZIONE FINGER FOOD & LAVORAZIONE (env-cat-prep-fingerfood e env-cat-diete-allergeni) ---
      {
        machineKey: "affettatrice_gravita_catering",
        name: "Affettatrice Professionale a Gravità Lama 370 mm per Salumi e Carni",
        type: "Macchina per il Taglio Professionale di Salumi e Carni a Gravità Lama 370 mm",
        suggestedManufacturer: "Berkel / Sirman",
        suggestedModel: "Domina 370 / Palladio 370",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "AFFETTATRICE_CATERING_ANELLO_FISSO_PARALAMA_UNI1974",
            title: "Anello Fisso di Protezione Paralama Continuo a 360° Conforme a UNI EN 1974",
            question: "L'affettatrice con lama da 370 mm è dotata di anello di protezione fisso e continuo che copre interamente il filo della lama nella porzione non utilizzata durante il taglio, garantendo protezione anche a coprilama rimosso?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_CATERING_BLOCCO_CARRO_SPESSORE_ZERO",
            title: "Dispositivo di Blocco Meccanico del Carro e Vela Chiusa a Spessore Zero per Pulizia",
            question: "Il carro portamerce può essere sfilato per le operazioni di sanificazione solo quando la manopola graduata della vela regolatrice è posizionata a zero ('0') e il carro è bloccato in posizione di finecorsa di sicurezza?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_CATERING_PRESSAMERCE_SALVADITA",
            title: "Pressamerce Ergonomico con Paraspruzzi Trasparente Salvadita",
            question: "Il piatto porta-alimenti è dotato di pressamerce con impugnatura ergonomica, spuntoni di trattenuta e schermo para-mano trasparente rigido per mantenere le mani dell'operatore a distanza di sicurezza dalla lama?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_CATERING_RELE_MINIMA_TENSIONE_NVR",
            title: "Comando Avvio/Arresto con Relè di Minima Tensione (Protezione da Riavvio Accidentale)",
            question: "La pulsantiera a bassa tensione è provvista di bobina di sgancio di minima tensione (NVR) che impedisce il riavvio spontaneo e pericoloso della macchina dopo un'interruzione improvvisa dell'alimentazione elettrica?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "cutter_robot_catering",
        name: "Cutter Robot / Tagliaverdure Professionale per Finger Food",
        type: "Robot Multifunzione Tagliaverdure ed Emulsionatore per Finger Food",
        suggestedManufacturer: "Robot Coupe / Dito Sama",
        suggestedModel: "R 402 / K45",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CUTTER_CATERING_INTERBLOCCO_COPERCHIO_FRENO_LAMA_UNI12852",
            title: "Interblocco di Sicurezza con Freno Motore Arresto Lama <= 2 Secondi (UNI EN 12852)",
            question: "L'apertura o rotazione del coperchio trasparente determina l'arresto immediato delle lame rotanti entro un tempo massimo di 2 secondi tramite dispositivo di frenatura elettromeccanica conforme a norma UNI EN 12852?",
            normReference: "UNI EN 12852; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_CATERING_PESTELLO_SALVADITA_TRAMOGGIA",
            title: "Pestello Ergonomico Salvadita e Tramoggia Tagliaverdure Protetta",
            question: "L'accessorio tagliaverdure dispone di pestello sagomato per l'introduzione guidata di ortaggi e tuberi, con tramoggia progettata geometricamente per impedire l'introduzione accidentale delle dita verso i dischi rotanti?",
            normReference: "UNI EN 1678; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CUTTER_CATERING_BLOCCO_MECCANICO_VASCA",
            title: "Dispositivo di Blocco a Baionetta della Vasca in Acciaio Inox con Micro di Presenza",
            question: "La vasca di lavorazione in acciaio inox è vincolata al basamento motore mediante incastro a baionetta sicuro, con sensore che inibisce l'avviamento del motore qualora la vasca non sia correttamente serrata?",
            normReference: "UNI EN 12852; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 3: ATTREZZATURE MOBILI DA TRASFERTA & BANQUETING (env-cat-deposito-arredi) ---
      {
        machineKey: "forno_rigeneratore_mobile",
        name: "Forno Rigeneratore di Temperatura Mobile su Ruote per Ricevimenti",
        type: "Apparecchiatura Termica Mobile per Rigenerazione Pasti e Mantenimento Umidità su Ruote",
        suggestedManufacturer: "Angelo Po / Moduline / Lainox",
        suggestedModel: "CombiWave / Retigo Regenerator / Moduline RRV",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FORNO_RIGENERATORE_RIGENERAZIONE_TEMP_75C",
            title: "Rigenerazione Termica Rapida al Cuore >= +75°C con Mantenimento Umidità da Trasferta",
            question: "Il forno rigeneratore mobile garantisce il riscaldamento uniforme e rapido delle pietanze pre-cotte fino a raggiungere e mantenere >= +75°C al cuore dell'alimento nel rispetto delle schede HACCP di somministrazione agli eventi?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_RIGENERATORE_RUOTE_PIROETTANTI_FRENO_PEDALE",
            title: "Ruote Piroettanti Antitraccia ad Alta Resistenza con Freno Meccanico a Pedale",
            question: "Il forno mobile su ruote è equipaggiato con ruote piroettanti in gomma antitraccia provviste di freno meccanico a pedale per lo stazionamento stabile e sicuro durante le fasi operative e di carico/scarico?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 6; Titolo VI (MMC)",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_RIGENERATORE_MANIGLIE_ISOLANTI_CAVO_PROTETTO",
            title: "Maniglioni Perimetrali di Spinta Termoisolanti e Cavo Elettrico Industriale con Spina CEE",
            question: "La scocca esterna dispone di maniglioni tubolari di manovra protetti contro il calore per la spinta ergonomica, e cavo flessibile H07RN-F ad alta resistenza con spina industriale CEE IP44/IP67?",
            normReference: "CEI EN 60335-2-42; CEI 64-8; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "chafing_dish_scaldavivande",
        name: "Chafing Dish Scaldavivande a Bagnomaria con Coperchio a Scomparsa (Roll-Top)",
        type: "Scaldavivande da Buffet e Ricevimenti a Bagnomaria con Coperchio Roll-Top",
        suggestedManufacturer: "Pinti Inox / Sambonet / Paderno",
        suggestedModel: "5 Stelle Roll-Top GN 1/1 / Elite Buffet",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CHAFING_DISH_COPERCHIO_ROLLTOP_FRIZIONATO",
            title: "Coperchio Roll-Top a Scomparsa con Frizione di Arresto Anti-Scottatura (90° e 180°)",
            question: "Il coperchio del chafing dish è dotato di meccanismo roll-top frizionato che si arresta stabilmente a 90° e 180° senza rischio di ricadute improvvise e con maniglia atermica isolata per prevenire scottature agli operatori e agli ospiti?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "CHAFING_DISH_PORTA_FORNELLETTO_GEL_SICURO",
            title: "Alloggiamento Protetto per Fornelletti a Gel Combustibile con Spegnifiamma Rotante",
            question: "I portabicchieri inferiori per combustibile in pasta/gel sono provvisti di schermatura termica, calotta girevole per la regolazione e spegnimento istantaneo della fiamma senza rischio di fuoriuscita di materiale infiammabile?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. IV p. 4 (Prevenzione Incendi); DM 03/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CHAFING_DISH_IDONEITA_MOCA_VASCHETTE_GN",
            title: "Bacinelle Gastronorm e Vasca Bagnomaria in Acciaio Inox AISI 304 Idonee MOCA",
            question: "I contenitori a contatto con alimenti e la vasca bagnomaria sono realizzati in acciaio inossidabile conforme ai requisiti MOCA (Reg. CE 1935/2004), privi di corrosioni o ammaccature e facilmente igienizzabili?",
            normReference: "Reg. CE 1935/2004; D.M. 21/03/1973; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "friggitrice_mobile_catering",
        name: "Friggitrice Professionale Mobile per Cotture Espresse Finger Food",
        type: "Friggitrice Elettrica o a Gas Professionale da Banco/Mobile per Cotture Espresse",
        suggestedManufacturer: "Lotus / Giorik",
        suggestedModel: "F13-74ET / Unika 700 Mobile",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FRIGGITRICE_CATERING_TERMOSTATO_SICUREZZA_230C",
            title: "Termostato di Sicurezza a Riarmo Manuale Anti-Autocombustione dell'Olio (< 230°C)",
            question: "La friggitrice mobile è equipaggiata con termostato di sicurezza a riarmo manuale indipendente tarato per intervenire tassativamente sotto i 230°C per prevenire il punto di fumo critico e l'autocombustione dei grassi?",
            normReference: "CEI EN 60335-2-37; UNI EN 203-1; D.Lgs. 81/2008 All. V p. 6 e All. IV p. 4",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_CATERING_RUBINETTO_SCARICO_SICURA",
            title: "Rubinetto di Scarico Olio con Sicura Meccanica, Prolunga e Bacinella di Raccolta Filtro",
            question: "Il condotto di svuotamento dell'olio esausto dispone di leva con blocco meccanico accidentale, tubo prolunga sagomato e filtro di trattenuta residui per consentire il deflusso controllato senza schizzi su pavimenti o corpo dell'operatore?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 All. V p. 6; Reg. CE 852/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_CATERING_PARASPRUZZI_ALTEZZA_MINIMA",
            title: "Paraspruzzi Perimetrale in Acciaio Inox e Indicatori Livello Minimo/Massimo Olio",
            question: "La vasca dispone di bordi paraspruzzi perimetrali rialzati per evitare schizzi di olio bollente durante l'immersione di cestelli e finger food, e serigrafia indelebile con livelli di olio min/max?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "fabbricatore_ghiaccio_catering",
        name: "Fabbricatore di Ghiaccio Trasportabile ad Alta Resa per Open-Bar",
        type: "Fabbricatore di Ghiaccio Portatile ad Alta Resa per Open-Bar ed Eventi Esterni",
        suggestedManufacturer: "Brema / Icematic",
        suggestedModel: "CB 425 / Castor CS40",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "GHIACCIO_CATERING_MATERIALI_MOCA_DEPURATORE",
            title: "Superfici di Evaporazione e Deposito Ghiaccio Idonee al Contatto Alimentare MOCA",
            question: "La vasca di raccolta e l'evaporatore a spruzzo sono realizzati con materiali atossici conformi al Reg. CE 1935/2004 ed è presente idoneo sistema di filtrazione/trattamento dell'acqua di alimentazione conforme ai requisiti dell'acqua potabile?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 18/2023 (Acque Potabili); Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "GHIACCIO_CATERING_SCARICO_INTERRUZIONE_ARIA_UNI1717",
            title: "Scarico Condense e Troppopieno con Interruzione d'Aria Anti-Reflusso (UNI EN 1717)",
            question: "La tubazione di scarico della condensa e del troppopieno è collegata con spazio d'aria libero conforme a UNI EN 1717 per impedire qualsiasi reflusso o contaminazione microbiologica della riserva di ghiaccio alimentare?",
            normReference: "UNI EN 1717; Reg. CE 852/2004 All. II cap. I e cap. VII",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "GHIACCIO_CATERING_MANIGLIE_CIRCUITO_SIGILLATO_UNI378",
            title: "Maniglie Ergonomiche di Movimentazione e Circuito Ermetico Refrigerante (UNI EN 378)",
            question: "Il telaio trasportabile per open-bar è dotato di maniglie laterali a scatto per il sollevamento ergonomico a norma Titolo VI D.Lgs. 81/08 e circuito refrigerante ermetico sigillato conforme a UNI EN 378?",
            normReference: "UNI EN 378; D.Lgs. 81/2008 Titolo VI e art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "banco_bar_mobile_luminoso",
        name: "Banco Bar Modulare Trasportabile per Open-Bar ed Eventi Esterni",
        type: "Banco Bar Modulare Trasportabile e Allestimento Mobile per Ricevimenti",
        suggestedManufacturer: "Plust / Slide / RG Mania",
        suggestedModel: "Bartolomeo Modular Bar / Break Bar LED",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BANCO_BAR_MOBILE_PIANO_INOX_MOCA",
            title: "Piano di Lavoro Superiore in Acciaio Inox Sanificabile e Idoneo MOCA",
            question: "Il piano mescita e preparazione cocktail è in acciaio inossidabile liscio, privo di interstizi, angoli vivi o asperità, conforme alle norme MOCA e sanificabile facilmente tra un servizio e l'altro?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "BANCO_BAR_MOBILE_ILLUMINAZIONE_LED_IP65_SELV",
            title: "Impianto di Illuminazione LED Integrato a Bassissima Tensione di Sicurezza (SELV) IP65",
            question: "L'eventuale impianto di retroilluminazione LED del modulo bar è alimentato a bassissima tensione di sicurezza (<= 12V/24V SELV) con alimentatore isolato IP65 protetto contro penetrazione di acqua, umidità esterna e getti di bevande?",
            normReference: "CEI 64-8 parte 7; CEI EN 60598-1; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BANCO_BAR_MOBILE_STABILITA_MODULARE_SPEEDRAIL",
            title: "Stabilità Strutturale Antiribaltamento, Giunzioni Modulari e Speed-Rail Portabottiglie",
            question: "I moduli assemblabili dispongono di sistemi di aggancio solido tra elementi adiacenti, piedini regolabili per terreni sconnessi (giardini, sabbiati, terrazze) e speed-rail con barriere anticaduta bottiglie?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3 e All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // --- REPARTO 4: LOGISTICA, SPEDIZIONI & BANCHINA (env-cat-banchina-carico e env-cat-deposito-noleggio) ---
      {
        machineKey: "contenitori_isotermici_catering",
        name: "Contenitori Isotermici Gastronorm e Carrelli Termici Porta-Teglie",
        type: "Attrezzatura Isotermica e Contenitori Omologati ATP per Trasporto Pasti e Bacinelle GN",
        suggestedManufacturer: "Melform / Rieber",
        suggestedModel: "Thermax GN 1/1 / Thermoport 1000 K",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CONTENITORI_ISOTERMICI_OMOLOGAZIONE_ATP_TEMP",
            title: "Mantenimento Termico Certificato ATP: Legame Caldo >= 65°C e Legame Freddo <= 4°C",
            question: "I contenitori isotermici monoblocco per il trasporto pasti sono omologati per garantire il rispetto dei limiti HACCP durante il tragitto dalla cucina centrale alla location (caldo >= +65°C, freddo <= +4°C per oltre 3 ore)?",
            normReference: "Accordo ATP; Reg. CE 852/2004 All. II cap. IV e cap. IX; D.P.R. 327/80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CONTENITORI_ISOTERMICI_GUARNIZIONI_MOCA_SFIATO",
            title: "Guarnizioni Ermetiche Sanificabili MOCA e Valvola di Sfiato Depressurizzazione",
            question: "I portelloni sono dotati di guarnizioni siliconiche asportabili per la sanificazione a norma MOCA Reg. CE 1935/2004 e valvola di sfiato a membrana per consentire l'apertura agevole senza sforzi dovuti al sottovuoto termico?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "CONTENITORI_ISOTERMICI_CHIUSURE_LEVA_ERGONOMIA",
            title: "Chiusure a Leva Serrate e Maniglie Incassate per Movimentazione Manuale Sicura",
            question: "I ganci di chiusura a leva in acciaio inox o poliammide garantiscono tenuta a prova di apertura accidentale durante il trasporto, e le maniglie di presa incassate sono dimensionate per la presa sicura di due operatori?",
            normReference: "D.Lgs. 81/2008 Titolo VI e All. V p. 6; ISO 11228-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "rampa_carico_alluminio",
        name: "Rampa di Carico Pieghevole in Alluminio con Superficie Antiscivolo per Furgoni",
        type: "Attrezzatura di Carico e Scarico Merci Pieghevole per Automezzi e Furgoni",
        suggestedManufacturer: "Altec / WM System",
        suggestedModel: "AOL Pieghevole 500-1000 kg / WM Light Plus",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "RAMPA_CARICO_PORTATA_CERTIFICATA_TARGHETTA",
            title: "Targhetta di Marcatura con Portata Massima Certificata CE (500-1000 kg)",
            question: "La rampa di carico in lega di alluminio presenta targhetta indelebile con indicazione del costruttore, modello, portata massima ammissibile (SWL) e anno di costruzione conforme alla Direttiva Macchine 2006/42/CE?",
            normReference: "Direttiva Macchine 2006/42/CE All. I; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "RAMPA_CARICO_BORDI_LATERALI_ANTI_USCITA",
            title: "Bordi Laterali di Sicurezza Rialzati Anti-Uscita Ruote Roll-Container (UNI EN 1398)",
            question: "La superficie di transito presenta bordi laterali rialzati continui (cordoli di ritegno h >= 50 mm) per prevenire lo svio accidentale e la caduta laterale delle ruote dei roll-container o carrelli durante il carico?",
            normReference: "UNI EN 1398; D.Lgs. 81/2008 All. V p. 2 e All. VI",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "RAMPA_CARICO_SUPERFICIE_MANDORLATA_ANTISCIVOLO",
            title: "Superficie Mandorlata Forata con Coefficiente Antiscivolo per Condizioni Umide",
            question: "Il piano di calpestio presenta bugnatura mandorlata o foratura estrusa con coefficiente d'attrito R12/R13 per scongiurare scivolamenti degli operatori in caso di pioggia o pavimentazione bagnata?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3 e All. V p. 2; DIN 51130",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "RAMPA_CARICO_SISTEMA_PIEGHEVOLE_PISTONI_GAS",
            title: "Dispositivo di Bloccaggio Meccanico a Bordo Furgone con Pistoni a Gas di Ausilio",
            question: "Il meccanismo di chiusura pieghevole dispone di ganci di blocco meccanico antiribaltamento durante la marcia del furgone e pistoni ammortizzati a gas che riducono lo sforzo lombare di apertura/chiusura?",
            normReference: "D.Lgs. 81/2008 Titolo VI e art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "roll_container_isotermico",
        name: "Roll-Container Isotermico a Ruote per Movimentazione Pasti e Bevande",
        type: "Contenitore Mobile Isotermico su Ruote per Logistica e Distribuzione Pasti",
        suggestedManufacturer: "Melform / Olivo Cold Logistics",
        suggestedModel: "Cargo Plast 720 / Roll Box 780",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "ROLL_ISOTERMICO_ISOLAMENTO_MONOBLOCCO_ATP",
            title: "Scocca Coibentata Monoblocco Stampata in Rotazionale e Omologazione ATP",
            question: "Il corpo del roll-container isotermico è privo di spaccature o infiltrazioni nella schiumatura isolante di poliuretano, provvisto di chiusura ermetica per mantenere le temperature di trasporto conformi ai limiti ATP?",
            normReference: "Accordo ATP; Reg. CE 852/2004 All. II cap. IV; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "ROLL_ISOTERMICO_MANIGLIONI_SPINTA_ERGONOMIA",
            title: "Maniglioni di Manovra Integrati Ergonomici per Prevenzione Sforzi Lombari (Titolo VI)",
            question: "La struttura dispone di maniglie e punti di presa ergonomici posizionati ad altezza compresa tra 90 e 120 cm per consentire la movimentazione a spinta senza posture incongrue o sovraccarico biomeccanico del rachide?",
            normReference: "D.Lgs. 81/2008 Titolo VI (art. 167-168) e All. XXXIII; ISO 11228-2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "ROLL_ISOTERMICO_RUOTE_GOMMA_FRENO_PEDALE",
            title: "Ruote in Gomma Elastica Antitraccia con Freno a Pedale Meccanico",
            question: "Le ruote piroettanti e fisse sono integre, montate su cuscinetti scorrevoli esenti da blocchi e dotate di freno a pedale efficace per impedire movimenti non controllati su banchine o pavimentazioni in pendenza?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 5: CENTRALE LAVAGGIO RIENTRO EVENTI (env-cat-lavaggio-rientro) ---
      {
        machineKey: "lavastoviglie_capotta_catering",
        name: "Lavastoviglie Industriale a Capotta Passante con Cesto Stoviglie Noleggio",
        type: "Lavastoviglie Industriale Passante a Capotta per Rientro Eventi e Stoviglie Noleggio",
        suggestedManufacturer: "Winterhalter / Meiko",
        suggestedModel: "PT-L Energy / M-iClean HM",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LAVASTOVIGLIE_CAPOTTA_CONTROBILANCIATA_MICRO",
            title: "Capotta Controbilanciata con Arresto Posizione e Microinterruttore di Finecorsa",
            question: "Il gruppo capotta mobile è perfettamente controbilanciato con molle o tiranti di sostegno che ne impediscono la chiusura brusca accidentale ed è dotato di microinterruttore che disattiva immediatamente il ciclo di lavaggio all'apertura?",
            normReference: "UNI EN 50416; CEI EN 60335-2-58; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_CAPOTTA_RISCIACQUO_82C_DIN10510",
            title: "Risciacquo Igienico ad Alta Temperatura (>= 82°C) e Dosatori Peristaltici Automatici",
            question: "Il boiler garantisce una temperatura di risciacquo finale non inferiore a +82°C certificata per la termosanificazione di piatti, posate e bicchieri da banqueting e dispone di dosatori automatici per detergente e brillantante?",
            normReference: "DIN 10510 / DIN 10512; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVASTOVIGLIE_CAPOTTA_ANTIRIFLUSSO_UNI1717",
            title: "Dispositivo Antiriflusso dell'Acqua con Interruzione d'Aria Tipo AA/AB (UNI EN 1717)",
            question: "L'allacciamento alla rete idrica potabile è protetto da dispositivo di disconnessione idraulica antiriflusso conforme a UNI EN 1717 per impedire l'inquinamento della rete di acqua potabile con detergenti o acque reflue?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "lavaoggetti_teglie_catering",
        name: "Lavaoggetti Industriale per Teglie 60x40 e Bacinelle GN (Pot-Washer)",
        type: "Lavaoggetti Industriale Frontale/Ghigliottina per Teglie 60x40 e Pentolame (Pot-Washer)",
        suggestedManufacturer: "Winterhalter / Comenda",
        suggestedModel: "UF-M / GE 655 RCD",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LAVAOGGETTI_CATERING_CESTO_PROFONDO_GUIDE_INSERIMENTO",
            title: "Cesto di Carico Rinforzato con Guide Scorrevoli per Teglie 60x40 e Pentolame Pesante",
            question: "La camera di lavaggio presenta cesto rinforzato in tondino inox e guide telescopiche con arresto finecorsa per facilitare l'estrazione e il posizionamento senza ribaltamenti di pentolame ingombrante e bacinelle Gastronorm?",
            normReference: "D.Lgs. 81/2008 Titolo VI e art. 71 c. 3; CEI EN 60335-2-58",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "LAVAOGGETTI_CATERING_MICRO_PORTA_BLOCCO_POMPA",
            title: "Microinterruttore di Sicurezza su Porta a Ghigliottina o Ribalta con Blocco Pompa",
            question: "L'apertura della porta o dello sportello frontale arresta tempestivamente le potenti pompe di lavaggio ad alta pressione per evitare getti di acqua calda bollente e detergente verso l'operatore?",
            normReference: "CEI EN 60335-2-58; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVAOGGETTI_CATERING_VASCA_STAMPATA_ANGOLI_RAGGIATI",
            title: "Vasca Stampata con Angoli Raggiati, Filtri Inox Multipli e Dosatori Automatici",
            question: "La vasca di lavaggio è stampata con pareti lisce e angoli raggiati esenti da punti ciechi, munita di filtri estraibili a doppio stadio e dosatore temporizzato dei prodotti chimici per la tutela della cute dell'operatore?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 Titolo IX (Agenti Chimici)",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 6: IMPIANTI DA CAMPO & SICUREZZA MOBILE (env-cat-deposito-gpl e env-cat-ufficio-logistica) ---
      {
        machineKey: "quadro_elettrico_mobile",
        name: "Quadro Elettrico Portatile da Cantiere/Evento per Allacciamenti Provvisori",
        type: "Quadro Elettrico Portatile da Cantiere/Evento per Distribuzione e Allacciamenti Provvisori",
        suggestedManufacturer: "Gewiss / Scame / Rosi",
        suggestedModel: "Q-DIN 14 IP65 / Block 4 CEE / Serie Megalux",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "QUADRO_MOBILE_INVOLUCRO_ISOLANTE_IP65",
            title: "Involucro Stagno in Gomma Butilica/Termoplastica con Grado di Protezione IP65",
            question: "Il quadro portatile da distribuzione per esterni dispone di involucro in materiale isolante antiurto (gomma butilica o policarbonato autoestinguente) con grado di protezione certificato almeno IP65 contro pioggia, polvere e spruzzi d'acqua?",
            normReference: "CEI EN 61439-4 (Quadri ASC); CEI 64-8 parte 7; D.Lgs. 81/2008 art. 80 e All. V p. 5",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "QUADRO_MOBILE_INTERRUTTORE_DIFFERENZIALE_30MA",
            title: "Interruttore Generale Magnetotermico-Differenziale ad Alta Sensibilità (Idn <= 30 mA)",
            question: "Il quadro è protetto a monte da un interruttore differenziale con soglia di intervento non superiore a 30 mA (tipo A o B, in base ai carichi elettronici) sottoposto a prova periodica mediante pulsante di test prima di ogni evento?",
            normReference: "CEI 64-8 art. 412.5; D.Lgs. 81/2008 art. 80, 86 e All. V p. 5",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "QUADRO_MOBILE_PRESE_CEE_INTERBLOCCATE",
            title: "Prese a Spina Industriali Normate CEE con Meccanismo di Interblocco Meccanico/Elettrico",
            question: "Le prese di uscita (monofase 16A e trifase 16A/32A) sono conformi alle norme CEI EN 60309, provviste di coperchio a molla stagno e interblocco che impedisce l'inserimento o il disinserimento della spina sotto tensione?",
            normReference: "CEI EN 60309-1/2; CEI EN 61439-4; D.Lgs. 81/2008 All. V p. 5",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "QUADRO_MOBILE_CONDUTTORE_TERRA_CONTINUITA",
            title: "Morsetto di Equipotenzialità Esterna e Continuità del Conduttore di Protezione (PE)",
            question: "È verificata la continuità metallica del conduttore di terra (PE) verso il dispersore locale dell'evento o la presa madre dell'impianto fisso prima di alimentare le attrezzature di cucina da campo?",
            normReference: "CEI 64-8 parte 7; D.Lgs. 81/2008 art. 80 e 84",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "bombole_gpl_cucina_campo",
        name: "Gruppo Bombole GPL con Regolatore di Pressione e Rampa per Cucina Mobile",
        type: "Gruppo Impianto Bombole GPL con Regolatore e Rampa per Cotture Mobili da Campo",
        suggestedManufacturer: "Cavagna Group / Reca / Kosan Gas",
        suggestedModel: "Rampa Multibombola GPL con Invertitore Automatico e Valvola Eccesso Flusso",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BOMBOLE_GPL_COLLARE_CATENELLE_ANTICADUTA",
            title: "Collare Metallico di Protezione Valvola e Fissaggio Verticale con Catenelle Anticaduta",
            question: "Le bombole GPL mobili sono posizionate esclusivamente in posizione verticale, all'aperto o in vano aerato, assicurate mediante catenelle o collari metallici antiribaltamento e con cappellotto/collare a protezione della valvola?",
            normReference: "UNI 7131; D.Lgs. 81/2008 art. 71 c. 3, All. V p. 6 e All. IV p. 4; DM 03/09/2021",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_GPL_REGOLATORE_ECCESSO_FLUSSO_UNI7131",
            title: "Regolatore di Pressione Tarato con Dispositivo di Sicurezza per Eccesso di Flusso",
            question: "Sulla rampa o sulle singole bombole è installato un regolatore di primo o secondo stadio a taratura fissa conforme a UNI EN 16129 provvisto di valvola di intercettazione termica o limitatore di eccesso di flusso in caso di tranciatura accidentale della tubazione?",
            normReference: "UNI EN 16129; UNI 7131; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_GPL_TUBI_FLESSIBILI_UNI7140_SCADENZA",
            title: "Tubi Flessibili a Norma UNI 7140 con Scadenza non Superata e Fascette a Stringere Normate",
            question: "I tubi flessibili in gomma per il collegamento bruciatori/rampa sono conformi a norma UNI 7140 (o metallici flessibili UNI EN 14800), con stampigliatura visibile della data di scadenza non oltrepassata (max 5 anni), privi di screpolature e serrati con fascette stringitubo normate?",
            normReference: "UNI 7140; UNI 7131; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_GPL_ESTINTORE_IDONEO_CLASSE_B_C",
            title: "Disponibilità nelle Immediate Vicinanze di Estintore Portatile Omologato (Classe 34A 233B C)",
            question: "In prossimità del gruppo bombole e della cucina mobile da campo è presente e prontamente accessibile almeno un estintore a polvere idoneo per fuochi di gas (classi A-B-C) con cartellino di revisione semestrale in corso di validità?",
            normReference: "D.Lgs. 81/2008 art. 46, All. IV p. 4; D.M. 03/09/2021; UNI 9994-1",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 1-bis. FOOD TRUCK, STREET FOOD E RISTORAZIONE AMBULANTE ITINERANTE
  // ATECO 56.10.42, 56.10.4 (Furgoni e autonegozi speciali allestiti per somministrazione itinerante, chioschi mobili, paninoteche ambulanti, rosticcerie mobili con laboratorio/rimessaggio di supporto)
  {
    sectorKey: "food_truck_street_food",
    sectorLabel: "Food Truck, Street Food e Ristorazione Ambulante Itinerante",
    atecoPrefixes: ["56.10.42", "56.10.4"],
    machines: [
      // --- REPARTO 1: COTTURA & FUMI VEICOLARI (env-ft-vano-cottura) ---
      {
        machineKey: "piastra_frytop_foodtruck",
        name: "Piastra di Cottura Fry-Top a Gas / Elettrica da Furgone (Liscia/Rigata)",
        type: "Apparecchiatura di Cottura Professionale a Piastra da Banco Veicolare",
        suggestedManufacturer: "Giorik / Lotus / Angelo Po",
        suggestedModel: "Giorik Unika 700 / Lotus FTV Veicolare / Angelo Po Gamma 700",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "PIASTRA_FT_PARASPRUZZI_ALTO",
            title: "Paraspruzzi Perimetrale in Acciaio Inox Alto Anti-Schizzi Veicolare",
            question: "La piastra è provvista di paraspruzzi perimetrale continuo su tre lati in acciaio inox ad alto profilo, saldato o sigillato a tenuta stagna, per prevenire la fuoriuscita e lo sgocciolamento di grassi bollenti durante la cottura e il beccheggio/rollio del veicolo?",
            normReference: "UNI EN 203-1 punto 5.4; D.Lgs. 81/2008 All. V p. 2 e All. VI p. 1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_FT_CASSETTO_GRASSI_BLOCCO_CURVA",
            title: "Cassetto Raccogligrasso con Blocco Meccanico Antiribaltamento in Curva",
            question: "Il cassetto raccogligrasso estraibile è dotato di perno o fermo meccanico di ritenuta anti-sfilamento accidentale per impedire il rovesciamento di liquidi oleosi incandescenti durante le manovre di marcia o inclinazione del furgone?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 6; UNI EN 203-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_FT_TERMOCOPPIA_SICUREZZA_GAS",
            title: "Termocoppie di Sicurezza Fiamma su Tutti i Bruciatori a Gas",
            question: "Ciascun bruciatore a gas è munito di termocoppia a risposta rapida e valvola elettromagnetica di sicurezza per l'interruzione istantanea del flusso di gas combustibile in caso di spegnimento accidentale provocato da correnti d'aria a portellone aperto?",
            normReference: "UNI EN 203-1 punto 5.3; UNI 8723; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_FT_ACCENSIONE_PIEZO_PROTETTA",
            title: "Accensione Piezoelettrica Protetta e Manopole con Arresto di Sicurezza",
            question: "Il sistema di accensione piezoelettrico o elettronico è stagno, protetto da infiltrazioni di unto, e le manopole di comando presentano scatto meccanico con pressione assiale per scongiurare aperture accidentali da urto con gomiti o corpi in spazi ristretti?",
            normReference: "UNI EN 203-1 punto 5.2.2; CEI EN 60335-2-36; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "friggitrice_incasso_foodtruck",
        name: "Friggitrice Professionale a Vasca con Coperchio Ermetico da Trasporto",
        type: "Friggitrice Professionale a Vasca Singola o Doppia da Incasso Veicolare",
        suggestedManufacturer: "Lotus / Fimar / Angelo Po",
        suggestedModel: "Lotus F13-74ET / Fimar FT Mobile / Angelo Po FES700",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FRIGGITRICE_FT_COPERCHIO_ERMETICO_GANCI_MARCIA",
            title: "Coperchio Ermetico di Tenuta con Ganci a Scatto Anti-Fuoriuscita Olio da Viaggio",
            question: "La vasca di frittura è munita di coperchio inox rinforzato con guarnizione a tenuta stagna e ganci a scatto perimetrali di sicurezza che bloccano saldamente la chiusura, impedendo schizzi e traboccamenti di olio durante il trasferimento stradale dell'autonegozio?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3, All. V p. 6; Reg. CE 852/2004 All. II cap. IV",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_FT_TERMOSTATO_MASSIMA_230C_RIARMO",
            title: "Termostato di Massima a Riarmo Manuale Limite < 230°C Contro Autocombustione Olio",
            question: "È presente un termostato di sicurezza a soglia limite tarato a meno di 230°C, a riarmo esclusivamente manuale e indipendente dal regolatore di lavoro, per prevenire tempestivamente l'autocombustione dei grassi e oli vegetali (D.M. 03/09/2021)?",
            normReference: "CEI EN 60335-2-37; UNI EN 203-1; D.M. 03/09/2021; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_FT_RUBINETTO_SCARICO_PROLUNGA_SICURA",
            title: "Valvola di Scarico Frontale con Prolunga Sagomata e Sicura Meccanica",
            question: "Il rubinetto frontale di scarico olio è dotato di levetta con sicura meccanica a doppio movimento contro aperture fortuite e dispone di prolunga rigida amovibile per il travaso guidato nei bidoni di recupero oli esausti senza rischi di ustione?",
            normReference: "CEI EN 60335-2-37 p. 22; UNI EN 203-1; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FRIGGITRICE_FT_ZONA_FREDDA_AGGANCIO_CESTELLI",
            title: "Vasca Inox Stampata con Zona Fredda e Supporto Sgocciolamento Cestelli Stabile",
            question: "La vasca in acciaio inox AISI 304 presenta ampia zona fredda inferiore per la decantazione dei residui carbonizzati e staffe posteriori stabili per l'aggancio di sgocciolamento dei cestelli protette dalle oscillazioni del veicolo?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "cappa_aspirazione_foodtruck",
        name: "Cappa Aspirazione Inox con Filtri a Labirinto e Camino a Tetto Veicolare",
        type: "Impianto di Aspirazione Fumi e Vapori a Tetto per Autonegozio Speciale",
        suggestedManufacturer: "Smoki / Camini & Cappe / Baraldi",
        suggestedModel: "Smoki FoodTruck Inox / Camini & Cappe Aerodinamica Tetto / Baraldi Street",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CAPPA_FT_FILTRI_LABIRINTO_INOX_LAVABILI",
            title: "Filtri a Labirinto in Acciaio Inox Lavabili ed Estraibili con Vaschetta Grassi",
            question: "La cappa è provvista di pacco filtri a labirinto rompigoccia in acciaio inox 18/10 estraibili, facilmente lavabili, inclinati verso canalina perimetrale di drenaggio con rubinetto o vaschetta di spurgo grassi per eliminare il pericolo d'incendio?",
            normReference: "UNI EN 16282-2; D.Lgs. 81/2008 All. IV p. 1.9 e All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_FT_SCARICO_TETTO_COMIGNOLO_AERODINAMICO",
            title: "Scarico a Tetto con Comignolo Aerodinamico Antivento/Antipioggia Sigillato",
            question: "Il camino di espulsione fumi sul tetto del furgone è provvisto di comignolo aerodinamico antivento/antipioggia stagno e flangia sagomata con guarnizioni poliuretaniche elastiche per prevenire infiltrazioni d'acqua meteorica durante la marcia stradale?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; UNI EN 16282-3; Reg. CE 852/2004 All. II cap. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_FT_MICROINTERRUTTORE_VENTILAZIONE_FORZATA",
            title: "Elettroaspiratore Centrifugo con Microinterruttore Ventilazione Forzata",
            question: "L'aspiratore cassonato a 230V/12V è provvisto di regolatore di velocità, microinterruttore di consenso/sicurezza o interblocco che garantisce adeguata portata di ricambio aria nel vano ristretto e spegnimento d'emergenza accessibile?",
            normReference: "UNI EN 16282-4; CEI EN 60335-2-31; D.Lgs. 81/2008 All. IV p. 1.9",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CAPPA_FT_ILLUMINAZIONE_LED_STAGNA_IP65",
            title: "Illuminazione a LED Integrata con Plafoniere Stagne IP65 da Alta Temperatura",
            question: "I punti luce integrati nella cappa sul piano cottura sono realizzati con faretti o strip LED a tenuta stagna IP65, resistenti alle alte temperature e ai vapori d'olio, con vetro di protezione infrangibile per garantire corretta visibilità?",
            normReference: "UNI EN 12464-1; CEI EN 60598-2-1; D.Lgs. 81/2008 All. IV p. 1.10",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "affettatrice_compatta_blocco",
        name: "Affettatrice a Gravità Compatta da Banco con Blocco Meccanico da Viaggio",
        type: "Affettatrice Professionale a Gravità da Banco con Sistema di Ancoraggio Veicolare",
        suggestedManufacturer: "Sirman / Berkel",
        suggestedModel: "Sirman Palladio 250/300 / Berkel Essentia / Berkel Red Line 250",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "AFFETTATRICE_FT_ANELLO_FISSO_PARALAMA_360_UNI1974",
            title: "Anello Fisso Paralama Continuo a 360° Conforme UNI EN 1974",
            question: "La lama circolare è schermata da un anello fisso di protezione continuo a 360° conforme alla norma armonizzata UNI EN 1974, che protegge il tagliente anche a coprilama smontato per le operazioni di pulizia?",
            normReference: "UNI EN 1974 punto 5.2.2; Direttiva Macchine 2006/42/CE All. I p. 1.3; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_FT_ANCORAGGIO_RAPIDO_VOLANTINI_BANCO",
            title: "Sistema di Ancoraggio Rapido al Banco di Lavoro con Volantini Filettati Antiscivolo",
            question: "L'affettatrice è fissata rigidamente al banco inox tramite volantini filettati passanti, staffe a morsa o tasselli antivibranti a sgancio rapido per impedirne tassativamente lo scivolamento, ribaltamento o caduta durante la marcia e le frenate del mezzo?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2; UNI EN 1974",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_FT_BLOCCO_VELA_SPESSORE_ZERO_CARRO",
            title: "Blocco Meccanico della Vela a Spessore Zero con Fermo Piatto Merci da Trasporto",
            question: "Il dispositivo di regolazione fetta permette il blocco a spessore zero della vela con interblocco meccanico del piatto portamerce in posizione di riposo, evitando esposizioni accidentali del filo della lama durante il movimento del veicolo?",
            normReference: "UNI EN 1974 punto 5.2.4; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_FT_PRESSAMERCE_PARAPOLSO_SICUREZZA",
            title: "Pressamerce Ergonomico con Schermo Trasparente Parapolso e Protezione NVR",
            question: "Il pressamerce è provvisto di schermo trasparente parapolso in plexiglass ad alta resistenza, impugnatura ergonomica sagomata e relè di minima tensione NVR a pulsanti stagni IP65 per impedire il riavvio spontaneo dopo cali di corrente?",
            normReference: "UNI EN 1974 punto 5.2.3; CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 2: FREDDO & CONSERVAZIONE VEICOLARE (env-ft-vano-refrigerazione) ---
      {
        machineKey: "banco_frigo_orizzontale_veicolare",
        name: "Banco Refrigerato Orizzontale a Cassetti con Chiusura a Scatto da Furgone",
        type: "Tavolo Refrigerato Professionale Gastronorm con Cassettiere Meccaniche da Automezzo",
        suggestedManufacturer: "Friulinox / Mercatus / Ilsa",
        suggestedModel: "Friulinox Roll-In / Mercatus StreetFood GN 1/1 / Ilsa Horeca Van",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BANCO_FRIGO_FT_CASSETTI_FERMO_MECCANICO_CURVA",
            title: "Cassetti Inox Gastronorm con Fermo Meccanico Anti-Apertura in Curva",
            question: "Tutti i cassetti telescopici inox per contenitori GN sono muniti di chiusure a scatto con fermo o blocco meccanico a leva per impedire tassativamente l'apertura accidentale dovuta alle forze centrifughe in curva o in caso di frenata brusca del veicolo?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2; Reg. CE 852/2004 All. II cap. IX",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BANCO_FRIGO_FT_CONTROLLO_DIGITALE_ALLARME_HACCP",
            title: "Controllo Digitale Temperatura con Allarme Visivo/Acustico HACCP (+2/+4°C)",
            question: "La centralina frigorifera digitale è dotata di display ad alta visibilità con segnalazione allarmi sonori/visivi di superamento soglia critica (+2°C / +4°C) e registrazione dati conforme al manuale HACCP?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "BANCO_FRIGO_FT_CIRCUITO_ERMETICO_R290_UNI378",
            title: "Circuito Frigorifero Ermetico Tropicalizzato Conforme UNI EN 378 con Gas R290",
            question: "Il circuito refrigerante a gas ecologico naturale R290 è realizzato in esecuzione ermetica certificata UNI EN 378 classe tropicalizzata (funzionamento garantito fino a +43°C ambiente), con motocondensante protetta da griglia ventilata e supporti antivibranti?",
            normReference: "UNI EN 378-1/2; CEI EN 60335-2-89; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BANCO_FRIGO_FT_GUARNIZIONI_MAGNETICHE_IGIENE",
            title: "Guarnizioni Magnetiche Perimetrali Rimovibili ad Alta Tenuta Termica",
            question: "Le guarnizioni magnetiche di battuta dei cassetti sono integre, morbide, prive di screpolature, facilmente estraibili a pressione per le operazioni di lavaggio e sanificazione profonda senza residui organici?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "armadio_freezer_veicolare",
        name: "Armadio Congelatore Compatto a Bordo Furgone con Serratura Meccanica",
        type: "Congelatore Verticale Compatto Bassa Temperatura da Bordo Veicolo",
        suggestedManufacturer: "Liebherr / Ilsa",
        suggestedModel: "Liebherr ProfiLine Veicolare / Ilsa Neos BT Mobile",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FREEZER_FT_TEMPERATURA_COSTANTE_18C_ISOLAMENTO",
            title: "Mantenimento Costante Temperatura <= -18°C con Coibentazione Rinforzata",
            question: "Il congelatore garantisce il mantenimento costante della catena del freddo a temperatura <= -18°C per prodotti surgelati mediante schiumatura ad alta densità (spessore 70-80 mm) in grado di mantenere la temperatura anche durante brevi soste senza generatore?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FREEZER_FT_SERRATURA_MECCANICA_CHIAVE_TRASPORTO",
            title: "Serratura Meccanica a Chiave per Blocco Porte Durante il Tragitto Stradale",
            question: "La porta cieca dell'armadio congelatore è dotata di serratura meccanica frontale a chiave o gancio di ritenuta rinforzato per assicurare il blocco stagno dell'anta durante la circolazione stradale del veicolo?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2; Reg. CE 852/2004 All. II cap. IV",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FREEZER_FT_TELETERMOMETRO_ESTERNO_SOGLIA",
            title: "Teletermometro Digitale Esterno con Allarme di Soglia Critica e Blackout",
            question: "Sul cruscotto o sul pannello esterno del freezer è installato un teletermometro a lettura digitale continua provvisto di indicatore di massima temperatura raggiunta per rilevare tempestivamente eventuali anomalie o blackout notturni?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "FREEZER_FT_COMPRESSORE_SILENTBLOCK_ANTIVIBRAZIONE",
            title: "Compressore Ermetico Montato su Silent-Block Antivibranti per Sollecitazioni Stradali",
            question: "L'unità motocompressore è ancorata allo chassis tramite tamponi elastici silent-block rinforzati e tubazioni frigorifere flessibili a spira per assorbire buche stradali e vibrazioni del motore del furgone senza pericolo di microfessurazioni o rotture del circuito?",
            normReference: "UNI EN 378-2; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 3: SOMMINISTRAZIONE & INTERFACCIA CLIENTI (env-ft-banco-somministrazione) ---
      {
        machineKey: "vetrina_refrigerata_parafiato",
        name: "Vetrina Refrigerata da Banco Porta-Ingredienti con Parafiato Curvo",
        type: "Espositore Refrigerato Statico da Banco per Ingredienti e Condimenti",
        suggestedManufacturer: "Fimar / Mercatus",
        suggestedModel: "Fimar VR / Mercatus Top Ingredienti Street Food",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "VETRINA_FT_CRISTALLO_CURVO_PARAFIATO_ASL",
            title: "Cristallo Curvo Parafiato Igienico Antiaerosol a Norma ASL",
            question: "La vetrina è dotata di schermo superiore e frontale in cristallo temperato curvo o plexiglass atossico ad altezza idonea a fungere da barriera parafiato totale contro aerosol, tosse e goccioline respiratorie del pubblico a norma igienico-sanitaria ASL?",
            normReference: "Reg. CE 852/2004 All. II cap. III; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "VETRINA_FT_TEMPERATURA_CONTROLLATA_4C_INGREDIENTI",
            title: "Temperatura Controllata +4°C per la Conservazione di Ingredienti Deperibili",
            question: "La vasca refrigerata mantiene la temperatura tra +2°C e +4°C per la sosta e conservazione in sicurezza igienica di farciture deperibili (formaggi freschi, salse, salumi, vegetali cotti e crudi) con termostato digitale dedicato?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "VETRINA_FT_BACINELLE_INOX_MOCA_1935_2004",
            title: "Bacinelle Gastronorm Inox con Marcatura MOCA Reg. CE 1935/2004",
            question: "Tutte le vaschette portainredienti GN alloggiate nella vetrina sono in acciaio inox AISI 304 per contatto alimentare certificate MOCA a norma Reg. CE 1935/2004 e provviste di coperchi rimovibili per i momenti di inattività del servizio?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 29/2017; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "VETRINA_FT_STAFFA_ANCORAGGIO_BANCO_VEICOLARE",
            title: "Staffaggio Meccanico di Fissaggio al Banco di Somministrazione del Veicolo",
            question: "La vetrina è assicurata al piano del banco somministrazione con staffe di serraggio o squadrette imbullonate con guarnizioni in gomma per impedirne lo scostamento laterale o ribaltamento durante il moto del veicolo?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "portellone_idraulico_banco",
        name: "Portellone Laterale Panoramico con Pistoni a Gas e Blocco Meccanico Anticaduta",
        type: "Portellone Basculante di Vendita per Autonegozio Speciale con Pistoni a Gas",
        suggestedManufacturer: "Carrozzerie Speciali Allestimenti Food Truck",
        suggestedModel: "Portellone Alluminio Coibentato con Pistoni Rinforzati a Gas e Fermo Meccanico",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "PORTELLONE_FT_PISTONI_GAS_BLOCCO_ANTICADUTA_VENTO",
            title: "Pistoni a Gas Rinforzati e Perni di Fermo Meccanico Anticaduta da Raffiche di Vento",
            question: "Il portellone laterale apribile è sostenuto da pistoni a gas maggiorati e dispone di perni o aste metalliche di fermo meccanico di sicurezza anticaduta da inserire in apertura per evitare la chiusura accidentale dovuta a improvvise raffiche di vento?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.6 e All. V p. 2; Direttiva Macchine 2006/42/CE All. I",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "PORTELLONE_FT_STRIP_LED_24V_ILLUMINAZIONE_CLIENTE",
            title: "Strip LED Integrata a 24V con Diffusore Opale per Illuminazione Banco Cliente",
            question: "Nel perimetro interno del portellone è integrata una barra a strip LED alimentata a bassa tensione di sicurezza SELV (12V/24V) con grado IP65, priva di abbagliamento verso il cliente e protetta da schiacciamento alla chiusura?",
            normReference: "UNI EN 12464-1; CEI 64-8; D.Lgs. 81/2008 All. IV p. 1.10",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "PORTELLONE_FT_DOPPIO_BLOCCO_SERRATURA_MARCIA",
            title: "Doppia Chiusura Meccanica e Sensore Spia Cruscotto Portellone Aperto",
            question: "Il portellone è provvisto di chiavistelli meccanici a doppio punto di chiusura ermetica per la marcia stradale e di microinterruttore collegato a spia o cicalino in cabina guida che segnala il mancato bloccaggio del portellone prima della partenza?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; Codice della Strada art. 54 e 164",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PORTELLONE_FT_MENSOLA_APPOGGIO_CLIENTI_RIBALTABILE",
            title: "Mensola Ribaltabile d'Appoggio Clienti con Bordi Arrotondati e Arresto di Fine Corsa",
            question: "La mensola ribaltabile esterna d'appoggio per i clienti è in acciaio inox o alluminio con spigoli arrotondati antiurto, supporti a compasso con blocco di sicurezza e assenza di punti di cesoiamento per le dita durante l'apertura e chiusura?",
            normReference: "UNI EN ISO 13854; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "estintore_polvere_co2_foodtruck",
        name: "Dotazione Antincendio Veicolare e di Cucina (Polvere 34A 233B + Idrico/Schiuma F)",
        type: "Presidio Antincendio Portatile per Autonegozi e Cucine Itineranti",
        suggestedManufacturer: "Anaf Fire Protection / Mozzanica / Mb Antincendio",
        suggestedModel: "Set Estintore Idrico Classe F 6L + Estintore a Polvere 6kg 34A 233B C + Coperta Antifiamma",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "ESTINTORE_FT_OMOLOGATO_DM2021_CLASSE_F_OLI_GRASSI",
            title: "Estintore Omologato D.M. 03/09/2021 Classe F per Oli e Grassi di Cottura",
            question: "A bordo del vano cottura del food truck è presente un estintore idrico a base d'acqua con additivi estinguenti schiumogeni omologato conforme al D.M. 03/09/2021 per incendi di classe F (capacità minima 6 litri / classe 25F-40F), idoneo a spegnere fuochi di friggitrici e fry-top senza schizzi d'olio?",
            normReference: "D.M. 03/09/2021; UNI EN 3-7; D.Lgs. 81/2008 art. 46 e All. IV p. 4",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "ESTINTORE_FT_POLVERE_POLIVALENTE_34A_233B_C",
            title: "Estintore a Polvere Polivalente (Classe 34A 233B C) per Motore, Generatore e GPL",
            question: "È presente un estintore a polvere ABC con capacità estinguente non inferiore a 34A 233B C per la protezione del gruppo elettrogeno, vano motore del veicolo e impianto bombole gas GPL?",
            normReference: "D.M. 03/09/2021; D.Lgs. 81/2008 art. 46; UNI 9994-1",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "ESTINTORE_FT_COPERTA_ANTIFIAMMA_IGNIFUGA_EN1869",
            title: "Coperta Antifiamma Ignifuga a Rilascio Rapido a Norma EN 1869 a Portata di Mano",
            question: "È installata a parete o a paratia, a portata di mano del cuoco/operatore, una coperta antifiamma in fibra di vetro conforme a norma EN 1869 con tiranti a sgancio rapido per il tempestivo soffocamento di principi d'incendio su piastre, friggitrici o indumenti?",
            normReference: "UNI EN 1869; D.Lgs. 81/2008 art. 46 e All. IV p. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ESTINTORE_FT_REVISIONE_SEMESTRALE_UNI9994_1",
            title: "Manutenzione Periodica Semestrale con Cartellino Aggiornato UNI 9994-1",
            question: "Tutti gli estintori a bordo recano il cartellino di manutenzione periodica con data dell'ultima verifica semestrale regolarmente punzonata entro i termini previsti dalla norma UNI 9994-1 e manometro di pressione con indice nell'area verde?",
            normReference: "UNI 9994-1; D.M. 01/09/2021; D.Lgs. 81/2008 art. 71 c. 3 e art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 4: ENERGIA & IMPIANTO ELETTRICO MOBILE (env-ft-vano-generatore) ---
      {
        machineKey: "gruppo_elettrogeno_silenziato",
        name: "Generatore di Corrente Ausiliario Silenziato Inverter a Bordo (4-8 kW)",
        type: "Gruppo Elettrogeno Ausiliario a Benzina/Diesel Silenziato Inverter da Veicolo",
        suggestedManufacturer: "Pramac / Honda / Genmac",
        suggestedModel: "Pramac P3500i / Honda EU70is Inverter / Genmac Urban Silenziato",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "GENERATORE_FT_INSONORIZZAZIONE_SOTTO_65DBA",
            title: "Motore 4 Tempi Super-Insonorizzato con Emissione Sonora < 65 dB(A)",
            question: "Il gruppo elettrogeno a 4 tempi è alloggiato in vano insonorizzato o racchiuso in cofano silenziato con livello di potenza sonora inferiore a 65 dB(A) a 7 metri per contenere l'esposizione al rumore degli operatori e rispettare i regolamenti comunali di somministrazione?",
            normReference: "D.Lgs. 81/2008 Titolo VIII Capo II (art. 187-198); Direttiva 2000/14/CE",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "GENERATORE_FT_SCARICO_GAS_CONVOGLIATO_TETTO_ESTERNO",
            title: "Scarico Gas Combusti Convogliato a Tetto all'Esterno del Mezzo",
            question: "La tubazione dei fumi di scarico del motore endotermico è realizzata in metallo a tenuta stagna, coibentata contro il calore da contatto, ed è convogliata all'esterno del furgone a tetto per escludere totalmente il pericolo di intossicazione da monossido di carbonio (CO) nel vano di lavoro?",
            normReference: "D.Lgs. 81/2008 Titolo IX Capo I (art. 221-232), All. IV p. 1.9 e All. V p. 7",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "GENERATORE_FT_INTERRUTTORE_MAGNETOTERMICO_DIFFERENZIALE",
            title: "Interruttore Magnetotermico-Differenziale Incorporato e Morsetto di Terra",
            question: "Il generatore è munito di proprio interruttore magnetotermico-differenziale di bordo e di morsetto equipotenziale collegato al telaio del veicolo e/o al dispersore di terra portatile secondo la regola dell'arte CEI 64-8/7?",
            normReference: "CEI 64-8 Sezione 717; CEI EN 60204-1; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "GENERATORE_FT_SERBATOIO_CARBURANTE_CHIUSURA_ANTISPANDIMENTO",
            title: "Serbatoio Carburante con Tappo Ermetico e Vasca di Contenimento Antispandimento",
            question: "Il serbatoio carburante è dotato di tappo a tenuta ermetica con sfiato controllato, valvola manuale di chiusura combustibile e vaschetta inferiore metallica di contenimento per scongiurare sversamenti di benzina/gasolio a caldo o durante la marcia?",
            normReference: "D.Lgs. 81/2008 All. IV p. 4; D.M. 03/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "quadro_elettrico_veicolare",
        name: "Quadro Elettrico Generale di Bordo con Commutatore Rete/Gruppo e Salvavita",
        type: "Quadro Elettrico Generale di Distribuzione Veicolare Conforme CEI 64-8 Sezione 717",
        suggestedManufacturer: "Gewiss / Scame",
        suggestedModel: "Gewiss Q-DIN Veicolare / Scame Omnia StreetFood 230V-400V",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "QUADRO_FT_DIFFERENZIALE_SALVAVITA_30MA",
            title: "Interruttore Differenziale Generale Salvavita ad Alta Sensibilità (Idn <= 30 mA)",
            question: "Il quadro generale veicolare è presidiato da un interruttore differenziale magnetotermico generale ad alta sensibilità con corrente differenziale nominale di intervento Idn non superiore a 30 mA per la protezione addizionale contro i contatti indiretti e diretti?",
            normReference: "CEI 64-8 Sezione 717; D.Lgs. 81/2008 art. 80, 86 e All. V p. 5",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "QUADRO_FT_COMMUTATORE_RETE_GRUPPO_INTERBLOCCATO",
            title: "Commutatore di Linea 'Rete Esterna / Gruppo Elettrogeno / Zero' Meccanicamente Interbloccato",
            question: "È presente un commutatore rotativo a camme a tre posizioni con interblocco meccanico che impedisce la contemporanea alimentazione da rete pubblica esterna e da generatore di bordo, scongiurando pericolosi ritorni di tensione?",
            normReference: "CEI 64-8; CEI EN 61439-1/2; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "QUADRO_FT_SEZIONATORI_LINEE_SEPARATE_TARATE",
            title: "Sezionatori Magnetotermici Singoli per Cottura, Frigoriferi, Idrico e Luci",
            question: "Ciascun circuito (vano cottura, linea refrigerazione continua, impianto autoclave idrico, illuminazione e prese di servizio) è protetto da un interruttore magnetotermico dedicato opportunamente calibrato e identificato con targhetta indelebile?",
            normReference: "CEI EN 61439-1; CEI 64-8 Sezione 717; D.Lgs. 81/2008 All. V p. 5",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "QUADRO_FT_PRESA_CEE_ESTERNA_SPORTELLINO_MOLLA",
            title: "Presa Industriale CEE da Esterno Veicolo con Sportellino a Molla Stagna IP67",
            question: "L'allaccio alla rete esterna avviene tramite presa a spina industriale CEE (230V o 400V) a norma CEI EN 60309 montata a filo carrozzeria con sportellino a molla di chiusura stagna IP67 contro acqua e polvere durante il trasferimento stradale?",
            normReference: "CEI EN 60309-1/2; CEI 64-8 Sezione 717; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 5: SICUREZZA IMPIANTO GAS GPL (env-ft-vano-bombole-gpl) ---
      {
        machineKey: "impianto_rilevazione_gas_gpl",
        name: "Centralina Rilevatore Fughe Gas GPL a 12V con Elettrovalvola di Sicurezza",
        type: "Sistema di Rilevazione Fughe Gas Combustibili e Intercettazione Automatica Veicolare",
        suggestedManufacturer: "BEP Marine / CBE / Cavagna",
        suggestedModel: "BEP Gas Detector 12V / CBE BGV / Cavagna Gas Safe System",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "RILEVATORE_FT_SENSORE_PAVIMENTO_GPL_CICALINO",
            title: "Sensore Gas a Pavimento Tarato su GPL con Cicalino Acustico e LED",
            question: "Il sensore di rilevamento fughe è installato a filo pavimento (in quanto il GPL ha densità relativa maggiore dell'aria e si accumula sul fondo) con taratura certificata, allarme visivo a LED e cicalino acustico ad elevata potenza sonora (> 85 dB)?",
            normReference: "CEI EN 50194-2; UNI EN 1949; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 7",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "RILEVATORE_FT_ELETTROVALVOLA_NC_RIARMO_MANUALE",
            title: "Blocco Automatico Erogazione tramite Elettrovalvola NC a Riarmo Manuale all'Uscita Bombole",
            question: "L'impianto è provvisto di elettrovalvola a 12V normalmente chiusa a riarmo esclusivamente manuale, posizionata all'uscita delle bombole nel vano esterno, asservita alla centralina per l'immediata intercettazione del gas in caso di fuga?",
            normReference: "UNI EN 1949; UNI 7131; D.Lgs. 81/2008 All. V p. 7; D.M. 03/09/2021",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "RILEVATORE_FT_PULSANTE_EMERGENZA_SGANCIO_RAPIDO",
            title: "Pulsante Manuale di Sgancio d'Emergenza Gas Posizionato in Zona Libera",
            question: "È presente un pulsante di sgancio manuale di emergenza gas a fungo di colore rosso, chiaramente segnalato da cartellonistica di sicurezza e posizionato in posizione prontamente accessibile vicino alla via d'uscita per togliere l'alimentazione all'elettrovalvola?",
            normReference: "D.Lgs. 81/2008 All. V p. 2 e All. IV p. 4; D.M. 03/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "RILEVATORE_FT_TEST_PERIODICO_EFFICIENZA_SENSORE",
            title: "Pulsante di Test Periodico per la Verifica di Efficienza del Rilevatore e delle Valvole",
            question: "Sulla centralina è presente tasto di collaudo e autodiagnosi per testare periodicamente l'integrità del circuito elettronico, del cicalino di allarme e dello scatto di chiusura dell'elettrovalvola a gas?",
            normReference: "CEI EN 50194-2; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "bombole_gpl_vano_ermetico",
        name: "Coppia Bombole GPL con Rampa di Scambio Automatico e Riduttore Certificato",
        type: "Gruppo Bombole Gas di Petrolio Liquefatto (GPL) Veicolare Conforme UNI EN 1949",
        suggestedManufacturer: "Cavagna Group / Truma",
        suggestedModel: "Cavagna Group DuoControl / Truma DuoControl CS con Crash Sensor",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BOMBOLE_FT_CRASH_SENSOR_DUOCONTROL_UNI16129",
            title: "Riduttore Certificato con Sensore d'Urto Crash-Sensor UNI EN 16129",
            question: "La rampa di alimentazione monta riduttore di pressione certificato con valvola di sicurezza da sovrapressione e sensore d'urto meccanico (crash-sensor tipo Truma DuoControl CS / Cavagna) conforme a UNI EN 16129, che blocca istantaneamente l'erogazione del gas in caso di collisione o decelerazione violenta (3.5g)?",
            normReference: "UNI EN 16129 All. D; UNI EN 1949 punto 5.2; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_FT_VANO_ERMETICO_INTERNO_AERAZIONE_PAVIMENTO",
            title: "Vano Bombole Ermetico Verso l'Abitacolo con Griglie di Sfogo a Pavimento verso l'Esterno",
            question: "Il vano contenitore delle bombole è completamente sigillato e a tenuta di gas verso l'interno dell'autonegozio, ed è dotato sul fondo di feritoie libere di aerazione permanente aperte verso il suolo per l'evacuazione naturale del GPL?",
            normReference: "UNI EN 1949 punto 5.1; UNI 7131; D.Lgs. 81/2008 All. IV p. 4 e All. V p. 7",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_FT_CATENELLE_CINGHIE_ANTICADUTA_SOLIDE",
            title: "Cinghie o Catenelle Metalliche di Ancoraggio Rigido Anticaduta per la Marcia",
            question: "Ciascuna bombola è saldamente vincolata alla parete del vano mediante almeno due cinghie robuste o catenelle metalliche con tenditori a cricchetto per impedirne spostamenti, rotazioni o cadute durante il moto stradale?",
            normReference: "UNI EN 1949 punto 5.1; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_FT_TUBI_FLESSIBILI_UNI7140_SCADENZA",
            title: "Tubi Flessibili ad Alta Pressione a Norma UNI 7140 con Scadenza non Superata",
            question: "I tubi flessibili di raccordo in gomma ad alta pressione sono conformi a norma UNI 7140 con raccordi metallici crimpati di fabbrica, integri senza tagli o screpolature, e con data di scadenza stampigliata non oltrepassata (massimo 5 anni di validità)?",
            normReference: "UNI 7140; UNI EN 1949 punto 5.3; D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 6: AUTONOMIA IDRICA & IGIENE MANI (env-ft-impianto-idrico) ---
      {
        machineKey: "autoclave_pompa_acqua_12v",
        name: "Pompa Idrica Autoclave Autoadescante a Pressostato per Acqua Potabile",
        type: "Pompa Autoadescante a Pressostato per Erogazione Acqua Potabile da Veicolo",
        suggestedManufacturer: "Flojet / Shurflo / Jabsco",
        suggestedModel: "Flojet Quad Plus / Shurflo Trail King 12V / Jabsco Par-Max",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "AUTOCLAVE_FT_MATERIALI_MOCA_1935_2004_DM174",
            title: "Corpo Alimentare Atossico Certificato MOCA Reg. CE 1935/2004 e D.M. 174/2004",
            question: "I corpi pompanti, raccordi, tubazioni e membrane a contatto con l'acqua potabile sono realizzati esclusivamente con materiali idonei certificati MOCA Reg. CE 1935/2004 e D.M. 174/2004 privi di cessione di sostanze nocive?",
            normReference: "Reg. CE 1935/2004; D.M. 174/2004; Reg. CE 852/2004 All. II cap. VII",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AUTOCLAVE_FT_PRESSOSTATO_AUTOMATICO_FUNZIONAMENTO_SECCO",
            title: "Pressostato Automatico con Protezione Funzionamento a Secco e Bassa Tensione 12V",
            question: "La pompa è controllata da pressostato automatico che si attiva all'apertura di qualsiasi rubinetto e si arresta alla chiusura, dotato di protezione termica e contro il funzionamento prolungato a secco in assenza d'acqua nel serbatoio?",
            normReference: "CEI EN 60335-2-41; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "AUTOCLAVE_FT_FILTRO_ASPIRAZIONE_ISPEZIONABILE_LAVABILE",
            title: "Filtro di Aspirazione Ispezionabile a Rete Inox Lavabile Anti-Impurità",
            question: "A monte dell'autoclave è installato un filtro d'aspirazione trasparente con cartuccia a maglia inox estraibile e lavabile per trattenere sedimenti ed evitare ostruzioni del pressostato e delle valvole?",
            normReference: "Reg. CE 852/2004 All. II cap. VII; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "AUTOCLAVE_FT_SERBATOI_ACQUE_CHIARE_GRIGIE_UGUALI",
            title: "Serbatoi Acque Chiare e Acque Grigie di Pari Capacità con Sfiato e Valvola Scarico",
            question: "Il veicolo è dotato di serbatoio per acqua potabile e serbatoio di recupero acque reflue (acque grigie) di capienza equivalente (minimo 50-100 litri) con sfiati protetti da rete anti-insetti e saracinesca di scarico a tenuta per smaltimento in piazzola attrezzata?",
            normReference: "Reg. CE 852/2004 All. II cap. III e VII; D.Lgs. 152/2006 art. 101",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "boiler_elettrico_compatto",
        name: "Boiler Elettrico Rapido Sottolavello per Acqua Calda Sanitaria",
        type: "Scaldacqua Elettrico ad Accumulo Rapido Sottolavello per Automezzi",
        suggestedManufacturer: "Truma / Ariston",
        suggestedModel: "Truma Therme / Ariston Andris Lux Eco 10L / Elgena KB6",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BOILER_FT_EROGAZIONE_ACQUA_45_50C_LAVAGGIO_MANI",
            title: "Erogazione Rapida Acqua Calda Sanitaria a 45-50°C a Norma Igienico-Sanitaria ASL",
            question: "Il boiler garantisce la costante disponibilità di acqua calda corrente a 45-50°C al lavello per consentire l'efficace sgrassaggio e la corretta igiene delle mani degli operatori secondo i requisiti dei regolamenti d'igiene ASL?",
            normReference: "Reg. CE 852/2004 All. II cap. I e cap. VIII; D.Lgs. 81/2008 All. IV p. 1.13",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BOILER_FT_VALVOLA_SICUREZZA_SOVRAPRESSIONE_SCARICO_TERRA",
            title: "Valvola di Sicurezza Sovrapressione Tarata con Scarico Diretto a Terra",
            question: "Sull'impianto idraulico di adduzione è installata una valvola di sicurezza contro le sovrapressioni (tarata a 6 bar o secondo specifica costruttore) con tubo di sfogo canalizzato all'esterno o verso terra per prevenire scoppi o fessurazioni del boiler?",
            normReference: "UNI EN 1487; CEI EN 60335-2-21; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BOILER_FT_TERMOSTATO_SICUREZZA_SURRISCALDAMENTO",
            title: "Termostato di Sicurezza a Riarmo Meccanico Anti-Surriscaldamento a Secco",
            question: "Il gruppo riscaldante è protetto da un termostato di limite termico che interrompe automaticamente l'alimentazione elettrica in caso di sovratemperatura o accensione accidentale in assenza d'acqua nel serbatoio?",
            normReference: "CEI EN 60335-2-21; D.Lgs. 81/2008 art. 80 e All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BOILER_FT_ISOLAMENTO_ELETTRICO_IPX4_TERRA",
            title: "Grado di Protezione Elettrica IPX4 e Collegamento al Conduttore di Terra",
            question: "La custodia dello scaldacqua installato nel sottolavello possiede un grado di protezione dai liquidi non inferiore a IPX4 ed è regolarmente collegata al conduttore di protezione dell'impianto di terra generale del furgone?",
            normReference: "CEI 64-8 Sezione 701 e 717; CEI EN 60335-2-21; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "lavello_inox_ginocchio_veicolare",
        name: "Lavello Inox Compatto con Comando a Ginocchio e Dosatori Integrati",
        type: "Lavamani Professionale Inox con Comando a Pedale/Ginocchio per Ambulanti",
        suggestedManufacturer: "Bonomini / Inox Piave / Forcar",
        suggestedModel: "Lavello Autonomo Inox con Comando a Ginocchio e Paraspruzzi",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LAVELLO_FT_COMANDO_NON_MANUALE_GINOCCHIO",
            title: "Comando di Erogazione Acqua a Ginocchio o Pedale non Manuale (Reg. CE 852/04)",
            question: "Il lavello lavamani è azionato esclusivamente con comando a ginocchio temporizzato o pedale a pavimento senza alcun contatto manuale della rubinetteria da parte degli operatori addetti alla manipolazione alimenti?",
            normReference: "Reg. CE 852/2004 All. II cap. I p. 4; D.Lgs. 81/2008 All. IV p. 1.13",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVELLO_FT_VASCA_INOX_PARASPRUZZI_ALIMENTARE",
            title: "Vasca in Acciaio Inox AISI 304 con Paraspruzzi Posteriore e Laterale a Paratia",
            question: "Il lavello è interamente realizzato in acciaio inox AISI 304 con superfici lisce, spigoli raccordati e alzatina paraspruzzi perimetrale a paratia per impedire schizzi d'acqua su alimenti esposti, taglieri o prese elettriche contigue?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "LAVELLO_FT_DISPENSATORI_SAPONE_CARTA_FISSATI",
            title: "Distributori di Sapone Igienizzante e Carta a Perdere Fissati Rigidemente a Parete",
            question: "In prossimità del lavello sono installati e fissati stabilmente alla parete del furgone un dosatore di sapone liquido antibatterico e un dispenser di asciugamani monouso in carta a perdere con cestino rifiuti azionabile a pedale?",
            normReference: "Reg. CE 852/2004 All. II cap. I p. 4; D.Lgs. 81/2008 All. IV p. 1.13",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVELLO_FT_SCARICO_DIRETTO_SERBATOIO_ACQUE_GRIGIE",
            title: "Sifone Anti-Odore e Scarico Canalizzato a Tenuta nel Serbatoio Reflui",
            question: "La piletta di scarico è collegata a sifone anti-odore ispezionabile con tubazione flessibile spiralata a tenuta stagna che convoglia direttamente i reflui nel serbatoio delle acque grigie senza perdite o esalazioni moleste nell'abitacolo?",
            normReference: "Reg. CE 852/2004 All. II cap. III; D.Lgs. 81/2008 All. IV p. 1.13",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 1-ter. GELATERIA E PASTICCERIA AMBULANTE ITINERANTE (STREET GELATO)
  // ATECO 56.10.41, 56.10.4 (Furgoni, ape car, rimorchi e carretti allestiti per la vendita itinerante di gelato artigianale/soft, granite, crepes, waffle, pasticceria con laboratorio di produzione/pastorizzazione e rimessaggio)
  {
    sectorKey: "gelateria_pasticceria_ambulante",
    sectorLabel: "Gelateria e Pasticceria Ambulante Itinerante (Street Gelato)",
    atecoPrefixes: ["56.10.41", "56.10.4"],
    machines: [
      // --- VEICOLARE STREET GELATO & SERVIZIO (env-gelamb-banco-veicolare, env-ft-crepes-waffle, env-gelamb-vano-tecnico-batterie) ---
      {
        machineKey: "banco_pozzetti_gelato_veicolare",
        name: "Banco a Pozzetti per Carapine Gelato a Glicole da Furgone (6-10 Carapine)",
        type: "Banco Frigorifero Veicolare a Pozzetti a Riserva di Freddo (Glicole)",
        suggestedManufacturer: "IFI / Frigomeccanica / Orion",
        suggestedModel: "IFI Panorama Veicolare / Frigomeccanica Pozzetti Glicole / Orion Core",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BANCO_POZZETTI_GLICOLE_RISERVA_FREDDO",
            title: "Termostato Digitale HACCP e Riserva di Freddo a Glicole (-12°C/-14°C)",
            question: "Il banco a pozzetti a glicole garantisce il mantenimento costante della temperatura di somministrazione (-12°C / -14°C) per oltre 6-8 ore di servizio itinerante senza allaccio elettrico, con termostato digitale HACCP e allarme visivo di temperatura?",
            normReference: "Reg. CE 852/2004 All. II cap. III; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BANCO_POZZETTI_COPERCHI_CAMPANA_BLOCCO_CURVA",
            title: "Coperchi a Campana Inox a Tenuta con Chiusure Anti-Ribaltamento in Curva",
            question: "I coperchi a campana in acciaio inox sono dotati di guarnizioni ermetiche e perni o levette di blocco meccanico anti-apertura e anti-ribaltamento accidentale durante la marcia e le curve del veicolo?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 6; Reg. CE 852/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BANCO_POZZETTI_CIRCUITO_ERMETICO_R290",
            title: "Circuito Frigorifero Ermetico con Gas Ecologico R290 (UNI EN 378)",
            question: "Il gruppo refrigerante ermetico di carica del glicole impiega gas ecologico naturale R290 (propano) ed è installato in vano aerato e conforme alle norme UNI EN 378 e Direttiva Macchine?",
            normReference: "UNI EN 378-1/2; CEI EN 60335-2-89; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BANCO_POZZETTI_CARAPINE_COLLARE_ANTIROTAZIONE",
            title: "Pozzetti con Collari di Tenuta e Anello Sagomato Anti-Rotazione Carapine",
            question: "Ciascun alloggiamento per carapina cilindrica è provvisto di anello in gomma alimentare o sagomatura di fermo anti-rotazione per impedire che il cilindro giri su se stesso durante la spatolatura del gelato duro?",
            normReference: "D.Lgs. 81/2008 art. 71; Reg. CE 1935/2004",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "lavaporzionatore_flusso_continuo",
        name: "Lavaporzionatore Professionale per Palette Gelato a Getto d'Acqua Continuo",
        type: "Dispositivo Igienico di Flussaggio per Porzionatori e Palette Gelato",
        suggestedManufacturer: "Stöckel / San Jamar",
        suggestedModel: "Stöckel Modell E / San Jamar Dipper Well / Celli Group Dispenser",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LAVAPORZIONATORE_GETTO_CONTINUO_TROPPOPIENO_ASL",
            title: "Lavaporzionatore a Flusso Continuo con Troppopieno a Norma ASL ed Eliminazione Ristagni",
            question: "Il lavaporzionatore è alimentato da un getto d'acqua continuo a perdere con scarico a troppopieno canalizzato verso le acque grigie a norma ASL, escludendo l'uso di vaschette con acqua stagnante che favoriscono la proliferazione batterica?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 193/2007; Linee Guida ASL Igiene Alimenti",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "LAVAPORZIONATORE_MATERIALI_MOCA_1935_2004",
            title: "Materiali Conformi MOCA Reg. CE 1935/2004 e Facile Smontaggio Sanificazione",
            question: "La vaschetta, il distributore d'acqua e la griglia poggia-palette sono realizzati in acciaio inox o polimeri certificati per contatto con alimenti (MOCA Reg. CE 1935/2004) e sono completamente smontabili a mano per sanificazione giornaliera?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 29/2017; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVAPORZIONATORE_REGOLAZIONE_PORTATA_DISCONNESSIONE",
            title: "Valvola Micrometrica di Portata e Disconnessione Idrica Anti-Riflusso",
            question: "Il circuito di adduzione è provvisto di rubinetto di regolazione micrometrica del flusso idrico per contenere i consumi della cisterna di bordo ed è protetto da valvola di non ritorno anti-inquinamento idrico UNI EN 1717?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "piastra_crepes_veicolare",
        name: "Piastra Professionale per Crêpes Tonda da Banco in Ghisa Lavorata",
        type: "Apparecchiatura Termica Elettrica da Banco per Crêpes",
        suggestedManufacturer: "Krampouz / Roller Grill",
        suggestedModel: "Krampouz Standard Round 40cm / Roller Grill CDE 400",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "PIASTRA_CREPES_GHISA_CERTIFICATA_MOCA",
            title: "Piano Cottura in Ghisa Certificata MOCA Priva di Rivestimenti Tossici (Reg. CE 1935/2004)",
            question: "Il disco di cottura è realizzato in fusione di ghisa lavorata con certificazione MOCA esente da smalti o rivestimenti antiaderenti chimici deperibili ad alta temperatura, garantendo l'atossicità e la cessione conforme ai test analitici (Reg. CE 1935/2004)?",
            normReference: "Reg. CE 1935/2004; D.M. 21/03/1973; D.Lgs. 29/2017; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_CREPES_TERMOSTATO_SPIA_RESIDUO",
            title: "Termostato Regolabile con Spia di Calore Residuo Anti-Ustione",
            question: "L'apparecchio dispone di termostato regolabile (50-300°C) con spia luminosa indicatrice di inserimento resistenze e spia ottica di calore residuo per segnalare agli operatori la piastra rovente anche dopo lo spegnimento?",
            normReference: "CEI EN 60335-2-38; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_CREPES_PARASPRUZZI_INOX_BORDO",
            title: "Paraspruzzi Inox Perimetrale di Protezione e Fissaggio Meccanico al Banco",
            question: "La piastra è dotata di paraspruzzi circolare perimetrale amovibile in acciaio inox per contenimento colature di pastella bollente ed è saldamente staffata o dotata di piedini a ventosa antiscivolo rinforzati per prevenire spostamenti durante il servizio sul furgone?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "piastra_waffle_gaufre",
        name: "Piastra Elettrica per Waffle / Cialde con Apertura a 180°",
        type: "Apparecchiatura Elettrica Professionale per Cottura Waffle e Cialde",
        suggestedManufacturer: "Krampouz / Neumärker",
        suggestedModel: "Krampouz Waffle Maker 180° / Neumärker Brussels 180°",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "PIASTRA_WAFFLE_STAMPI_GHISA_SMALTATA_MOCA",
            title: "Stampi Sagomati in Ghisa Smaltata Antiaderente Alimentare MOCA",
            question: "Gli stampi alveolari di cottura sono in ghisa lavorata ad alta conducibilità termica con certificato MOCA di conformità alimentare per contatto ripetuto ad alta temperatura (Reg. CE 1935/2004)?",
            normReference: "Reg. CE 1935/2004; D.M. 21/03/1973; D.Lgs. 29/2017",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_WAFFLE_MANIGLIA_ISOLATA_180",
            title: "Maniglia Termoisolante Anti-Ustione e Apertura Bilanciata a 180°",
            question: "Le impugnature di apertura e rotazione sono costruite in bachelite o tecnopolimero atermico termoisolante anti-ustione, con cerniera a frizione bilanciata a 180° per evitare ricadute accidentali del coperchio superiore rovente sulle dita?",
            normReference: "CEI EN 60335-2-38; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_WAFFLE_CASSETTO_BRICIOLE_ESTRAIBILE",
            title: "Cassetto Raccoglibriciole e Colature Estraibile Lavabile",
            question: "Sotto il blocco rotante è installato un vassoio estraibile in acciaio inox a bordi alti per la raccolta di briciole carbonizzate e sfridi di pastella, prevenendo inneschi di fumo e facilitando la pulizia igienica periodica?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "macchina_gelato_soft_veicolare",
        name: "Macchina per Gelato Espresso / Soft e Frozen Yogurt da Banco",
        type: "Macchina Professionale Erogatrice di Gelato Soft ed Espresso",
        suggestedManufacturer: "Carpigiani / Gel Matic",
        suggestedModel: "Carpigiani 161 G SP / Gel Matic BV 100 PM / Carpigiani 191",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "GELATO_SOFT_VASCA_CONSERVAZIONE_4C",
            title: "Vasca Refrigerata con Conservazione a +4°C e Registrazione Digitale HACCP",
            question: "La vasca superiore di alimentazione è costantemente refrigerata e termoregolata a +4°C a tenuta stagna per la conservazione della miscela liquida anche durante le pause di lavoro prolungate, in piena conformità con le temperature HACCP?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 193/2007; UNI EN 12852",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "GELATO_SOFT_MICRO_ARRESTO_AGITATORE",
            title: "Microinterruttore di Arresto Immediato Agitatore all'Apertura Vasca (UNI EN 12852)",
            question: "Il coperchio della vasca e la leva di erogazione sono interbloccati con microinterruttori di sicurezza a norma UNI EN 12852 che arrestano istantaneamente la rotazione dell'agitatore e della pompa se il coperchio viene sollevato?",
            normReference: "UNI EN 12852; D.Lgs. 81/2008 All. V p. 2 e Direttiva Macchine 2006/42/CE",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "GELATO_SOFT_POMPA_PRESSURIZZAZIONE_MOCA",
            title: "Pompa ad Ingranaggi MOCA e Componenti di Erogazione Sanificabili",
            question: "La pompa ad ingranaggi per la regolazione dell'overrun e il cilindro di mantecazione sono certificati MOCA (Reg. CE 1935/2004) e completamente smontabili senza utensili complessi per il lavaggio e sanificazione chimica a fine turno?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 29/2017",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "GELATO_SOFT_CIRCUITO_FRIGO_UNI378",
            title: "Circuito Frigorifero Ermetico Veicolare a Norma UNI EN 378",
            question: "Il circuito frigorifero autonomo condensato ad aria è ermeticamente sigillato a prova di vibrazioni stradali, conforme alla norma UNI EN 378, con scarico convogliato dell'aria calda verso l'esterno dell'autonegozio?",
            normReference: "UNI EN 378; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "vetrina_monoporzioni_gelato",
        name: "Vetrina Refrigerata Panoramica per Monoporzioni e Torte Gelato (-18°C / +4°C)",
        type: "Vetrina Espositiva Refrigerata Panoramica a Bassa Temperatura",
        suggestedManufacturer: "Isa / IFI",
        suggestedModel: "Isa Cristal Tower / IFI Chocolat / Isa Il Chicco",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "VETRINA_MONOPORZIONI_CRISTALLI_RISCALDATI",
            title: "Cristalli Doppi Riscaldati Anticondensa e Vetrocamera di Sicurezza",
            question: "I cristalli perimetrali panoramici sono realizzati in vetrocamera temprato stratificato con sbrinamento o riscaldamento anticondensa, garantendo totale visibilità igienica e protezione contro la rottura da urti accidentali di clienti e operatori?",
            normReference: "UNI EN 12150; D.Lgs. 81/2008 All. IV p. 1.3.6 e All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "VETRINA_MONOPORZIONI_ALLARME_HACCP",
            title: "Controllo Digitale Temperatura con Allarme di Soglia HACCP (-18°C / +4°C)",
            question: "Il display di controllo elettronico visualizza costantemente la temperatura interna d'esercizio ed è corredato da allarme acustico e visivo in caso di innalzamento anomalo oltre le soglie critiche HACCP (-15°C per torte gelato / +5°C per semifreddi)?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 193/2007",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "VETRINA_MONOPORZIONI_ILLUMINAZIONE_LED_BASSA_TENSIONE",
            title: "Illuminazione LED a Bassa Tensione e Ripiani con Fermo Meccanico",
            question: "L'illuminazione interna è a LED a bassissima tensione di sicurezza (SELV) a luce fredda senza riscaldamento delle superfici esposte, e le griglie/ripiani espositivi sono vincolati con ganci anti-sfilamento in curva?",
            normReference: "CEI EN 60598-2-1; CEI 64-8; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "portellone_panoramico_gelateria",
        name: "Portellone Laterale Panoramico con Pistoni a Gas Rinforzati e Blocco Meccanico",
        type: "Apertura Laterale Veicolare per Banco Vendita e Tettoia Parasole",
        suggestedManufacturer: "Allestimenti Speciali Veicolari / Cofi / Carrozzeria Mobile",
        suggestedModel: "Portellone Coibentato Street Gelato / Wings Wing-Van 24V",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "PORTELLONE_GEL_PISTONI_E_PERNO_BLOCCO_VENTO",
            title: "Pistoni a Gas Rinforzati e Perno di Blocco Meccanico Anti-Chiusura da Vento",
            question: "Il portellone sollevabile ad ala è sostenuto da doppi pistoni a gas pressurizzati ad alta portata ed è provvisto di perno o asta telescopica di fermo meccanico obbligatorio per impedire il crollo improvviso del battente causato da raffiche di vento?",
            normReference: "D.Lgs. 81/2008 All. V p. 2; Direttiva Macchine 2006/42/CE; UNI EN ISO 12100",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "PORTELLONE_GEL_ILLUMINAZIONE_LED_24V",
            title: "Illuminazione LED Integrata a 24V con Diffusori Sigillati",
            question: "Il cielino interno del portellone integra plafoniere o barre LED alimentate a tensione di sicurezza (24V c.c.) con grado di protezione minimo IP65 contro l'umidità atmosferica e gli spruzzi durante il lavaggio?",
            normReference: "CEI 64-8 sez. 7; CEI EN 60529 (IP65); D.Lgs. 81/2008 art. 80",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "PORTELLONE_GEL_SERRATURE_CHIAVE_VIAGGIO",
            title: "Serrature Meccaniche a Chiave con Doppio Riscontro per Trasferimento Stradale",
            question: "Il portellone dispone di maniglie incassate con serrature a chiave a doppio punto di chiusura meccanica che garantiscono la perfetta aderenza alle guarnizioni perimetrali a tenuta e impediscono l'apertura accidentale durante il tragitto stradale?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; Codice della Strada art. 164",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "sistema_batterie_inverter_litio",
        name: "Gruppo Batterie LiFePO4 con Inverter Sinusoidale Puro per Autonomia Frigo",
        type: "Sistema Ausiliario Elettrico di Accumulo al Litio e Conversione Tensione",
        suggestedManufacturer: "Victron Energy / Mastervolt",
        suggestedModel: "Victron Lithium SuperPack LiFePO4 + MultiPlus-II / Mastervolt MLI Ultra",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BATTERIE_LITIO_BMS_SOVRATEMPERATURA_CORTO",
            title: "Pacco Batterie LiFePO4 con BMS di Protezione da Sovratemperatura e Cortocircuito",
            question: "Il banco accumulatori al litio ferro fosfato (LiFePO4) è dotato di sistema integrato Battery Management System (BMS) con sgancio rapido automatico in caso di sovratemperatura, sovraccarico, sovrascarica profonda o cortocircuito?",
            normReference: "CEI EN 62619; CEI EN 62133-2; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BATTERIE_LITIO_INVERTER_ONDA_PURA_SALVAVITA",
            title: "Inverter Sinusoidale Puro con Differenziale Salvavita 30 mA (CEI 64-8)",
            question: "L'inverter DC/AC ad onda sinusoidale pura (12V/24V a 230V) è protetto a monte da fusibile calibrato ad alto potere di interruzione e a valle da interruttore differenziale salvavita ad alta sensibilità Idn=30 mA tipo B/F con efficace messa a terra veicolare?",
            normReference: "Norma CEI 64-8/7 art. 717; CEI EN 62109-1; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BATTERIE_LITIO_VANO_VENTILATO_ISOLATO",
            title: "Vano Tecnico Coibentato e Ventilato per Dissipazione Termica",
            question: "Il pacco batterie e l'inverter sono posizionati in vano tecnico dedicato con griglie di ventilazione forzata o naturale adeguate, esenti da polveri e vapori umidi, e separati termicamente dal vano banco gelato?",
            normReference: "CEI 64-8; D.Lgs. 81/2008 art. 71 e art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- LABORATORIO BASE DI PRODUZIONE & FREDDO (env-gelamb-lab-pastorizzazione, env-gelamb-lab-mantecazione, env-gelamb-lab-pasticceria, env-gelamb-cella-stoccaggio) ---
      {
        machineKey: "pastorizzatore_elettronico_gelato",
        name: "Pastorizzatore Elettronico Professionale per Miscele Gelato (60-120 Litri)",
        type: "Apparecchiatura Termica per Trattamento Termico Miscele e Pastorizzazione",
        suggestedManufacturer: "Carpigiani / Bravo / Cattabriga",
        suggestedModel: "Carpigiani Pastomaster 60 RTL / Bravo Trittico Executive / Cattabriga PSK 65",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "PASTORIZZATORE_CICLO_TERMICO_85_4_HACCP",
            title: "Ciclo Termico Alta Pastorizzazione +85°C e Raffreddamento +4°C (Reg. CE 853/04 HACCP)",
            question: "Il pastorizzatore esegue in modo automatico e documentato il ciclo termico ad alta pastorizzazione (+85°C con sosta termica) e abbattimento rapido a +4°C entro i tempi limite prescritti dal Reg. CE 853/2004 per eliminazione di patogeni (Salmonella, Listeria) con memorizzazione dei lotti HACCP?",
            normReference: "Reg. CE 853/2004 All. III sez. IX; Reg. CE 852/2004; D.Lgs. 193/2007",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "PASTORIZZATORE_MICRO_SICUREZZA_COPERCHIO",
            title: "Microinterruttore di Sicurezza al Sollevamento Coperchio con Blocco Agitatore",
            question: "Il coperchio trasparente o in acciaio inox della vasca è munito di microinterruttore di sicurezza a rottura positiva che interrompe istantaneamente il motore dell'agitatore/emulsionatore al minimo accenno di apertura, prevenendo contatti traumatici con gli organi in rapida rotazione (D.Lgs. 81/08 All. V)?",
            normReference: "D.Lgs. 81/2008 All. V p. 2; UNI EN 12852; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "PASTORIZZATORE_RUBINETTO_LAVAGGIO_IGIENICO",
            title: "Rubinetto di Estrazione a Tenuta con Doccetta di Lavaggio Incorporata MOCA",
            question: "Il rubinetto di estrazione della miscela calda/fredda è a tenuta ermetica, privo di zone morte o ristagni microbiologici, conforme MOCA (Reg. CE 1935/2004) ed è dotato di doccetta integrata per il risciacquo idrico guidato del condotto tra una spillatura e l'altra?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 29/2017",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PASTORIZZATORE_PROTEZIONE_BRUCIATORE_RESISTENZE",
            title: "Isolamento Termico Pareti Vasca Anti-Scottatura Operatore",
            question: "Il mantello esterno della vasca è provvisto di isolamento termico ad alta efficienza per impedire che le pareti esterne raggiungano temperature pericolose durante la fase di riscaldamento a +85°C, prevenendo rischi di ustione per gli addetti?",
            normReference: "UNI EN ISO 13732-1; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "mantecatore_orizzontale_gelato",
        name: "Mantecatore Orizzontale Professionale per Gelato Artigianale",
        type: "Macchina per la Mantecazione e Congelamento Dinamico del Gelato",
        suggestedManufacturer: "Carpigiani / Cattabriga / Frigomat",
        suggestedModel: "Carpigiani Labo 20/30 XPL P / Cattabriga Multifreeze PRO / Frigomat Titan",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "MANTECATORE_GRIGLIA_SALVADITA_UNI12852",
            title: "Griglia Salvadita Bocca Carica e Portello Frontale Interbloccato UNI EN 12852",
            question: "La tramoggia di introduzione ingredienti è dotata di griglia salvadita fissa conforme a UNI EN 12852 che impedisce l'introduzione delle dita o spatole verso l'elica, e il portello frontale di estrazione è vincolato a microinterruttore di sicurezza che arresta immediatamente il rotore all'apertura?",
            normReference: "UNI EN 12852; D.Lgs. 81/2008 All. V p. 2; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "MANTECATORE_AGITATORE_RASCHIATORI_MOCA",
            title: "Agitatore Inox con Pattini Raschiatori Polimerici Atossici MOCA",
            question: "L'elica agitatrice interna in acciaio inox è corredata di pattini raschiatori elastici in materiale polimerico certificato per contatto con alimenti (Reg. CE 1935/2004), integri e privi di usure anomale che possano rilasciare particelle estranee nel gelato?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 29/2017; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MANTECATORE_PORTA_ISOLATA_SCARICO_PROTETTO",
            title: "Portello Frontale Termoisolante con Scivolo di Estrazione Raggiato",
            question: "Il portello di chiusura cilindro è coibentato per evitare condense e contatto con parti a -30°C ed è dotato di scivolo salvagoccia raggiato facilmente asportabile e sanificabile senza fessurazioni?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "MANTECATORE_PULSANTE_EMERGENZA_FUNGO",
            title: "Pulsante di Arresto di Emergenza a Fungo e Circuito Frigorifero Ermetico",
            question: "Il quadro comandi dispone di pulsante di arresto di emergenza a fungo a ritenuta meccanica a norma CEI EN 60204-1 e il circuito frigorifero a gas ecologico è conforme alle direttive di sicurezza UNI EN 378?",
            normReference: "CEI EN 60204-1; UNI EN 378; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "abbattitore_surgelatore_carapine",
        name: "Abbattitore Rapido e Surgelatore Dedicato per Gelateria (-35°C)",
        type: "Abbattitore di Temperatura e Surgelatore Rapido per Carapine e Vaschette",
        suggestedManufacturer: "Irinox / Coldline",
        suggestedModel: "Irinox MultiFresh Next Gelato / Coldline Modi Up Gelato",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "ABBATTITORE_GEL_INDURIMENTO_35C_CRISTALLI",
            title: "Ciclo Indurimento Rapido Gelato a -35°C per Micro-Cristallizzazione Stabile",
            question: "L'apparecchiatura dispone di programma specifico per gelateria con ventilazione indiretta a -35°C che congela rapidamente l'acqua libera nella carapina appena estratta dal mantecatore, stabilizzando i microcristalli di ghiaccio ed evitando la formazione di macro-strutture vetrose?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 193/2007; Manuale Buone Prassi Gelateria",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_GEL_SONDA_SPILLONE_CALIBRATA",
            title: "Sonda al Cuore a Spillone Multipunto MOCA Calibrata HACCP",
            question: "La sonda a spillone è interamente in acciaio inox per contatto alimentare MOCA (Reg. CE 1935/2004), regolarmente tarata e corredata di supporto igienico su porta per prevenire contaminazioni crociate?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ABBATTITORE_GEL_CAMERA_RAGGIATA_SANIFICAZIONE",
            title: "Camera Interna Inox AISI 304 con Angoli Raggiati e Scarico Condensa",
            question: "La camera interna e la griglia portacarapine sono in acciaio inox AISI 304 con fondo diamantato e pilette di scarico condensa con tappo ermetico per consentire la completa igienizzazione e sbrinamento?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "ABBATTITORE_GEL_ALLARME_PORTA_GUARNIZIONE_RISCALDATA",
            title: "Guarnizione Magnetica Riscaldata Anticongelamento e Allarme Porta Aperta",
            question: "Il perimetro della porta presenta resistenza elettrica anticongelamento per evitare il bloccaggio della guarnizione a temperature criogeniche (-35°C) ed è presente allarme ottico/acustico per porta aperta prolungata?",
            normReference: "UNI EN 378; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "planetaria_pasticceria_base",
        name: "Impastatrice Planetaria Professionale con Vasca 20-40 Litri",
        type: "Macchina Planetaria per Paste, Creme, Mousse e Cialde",
        suggestedManufacturer: "Dito Sama / Pietro Berto / Fimar",
        suggestedModel: "Dito Sama BE-20 / Pietro Berto King 40 / Fimar IP/20F",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "PLANETARIA_GEL_GRIGLIA_INTERBLOCCATA_UNI454",
            title: "Griglia di Protezione Inox Interbloccata con Arresto Immediato (UNI EN 454)",
            question: "La vasca è protetta da schermo di protezione grigliato o trasparente in policarbonato a norma UNI EN 454, munito di microinterruttore di sicurezza che arresta istantaneamente la rotazione dell'utensile (tempo di arresto < 2 secondi) al sollevamento della griglia o all'abbassamento della vasca?",
            normReference: "UNI EN 454; D.Lgs. 81/2008 All. V p. 2; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "PLANETARIA_GEL_FUNGO_EMERGENZA_RIARMO",
            title: "Pulsante di Emergenza a Fungo a Riarmo Manuale e Relè di Minima Tensione",
            question: "La macchina è equipaggiata con pulsante di arresto d'emergenza a fungo e dispositivo contro il riavvio spontaneo dopo interruzione accidentale dell'alimentazione elettrica (relè di minima tensione) a norma CEI EN 60204-1?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "PLANETARIA_GEL_LEVA_SOLLEVAMENTO_VASCA",
            title: "Leva di Sollevamento Vasca Assistita con Blocco di Posizione Meccanico",
            question: "Il meccanismo di sollevamento e abbassamento vasca è dotato di blocco di fine corsa meccanico e sicura per prevenire la discesa improvvisa della vasca durante il funzionamento o il caricamento degli ingredienti?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PLANETARIA_GEL_UTENSILI_MOCA_1935_2004",
            title: "Utensili di Miscelazione (Frusta, Foglia, Gancio) in Acciaio Inox MOCA",
            question: "Tutti gli utensili intercambiabili di lavorazione sono realizzati in acciaio inox o alluminio anodizzato speciale per alimenti corredati da dichiarazione di conformità MOCA (Reg. CE 1935/2004) e privi di cricche o fili metallici deformati?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 29/2017; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "sfogliatrice_banco_pasticceria",
        name: "Sfogliatrice Professionale da Banco per Paste e Cialde",
        type: "Laminatrice / Sfogliatrice a Cilindri per Laboratorio Pasticceria",
        suggestedManufacturer: "Rollmatic / Rondo / Flamic",
        suggestedModel: "Rollmatic R50B / Rondo Econom / Flamic SF450B",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SFOGLIATRICE_GEL_RIPARI_INTERBLOCCATI_UNI1674",
            title: "Ripari di Protezione Fissi/Mobili Interbloccati sui Cilindri di Laminazione (UNI EN 1674)",
            question: "I cilindri di laminazione dell'impasto sono segregati su entrambi i lati di ingresso da ripari di protezione in acciaio inox o policarbonato a norma UNI EN 1674, provvisti di microinterruttori di arresto immediato del moto se sollevati anche parzialmente?",
            normReference: "UNI EN 1674; D.Lgs. 81/2008 All. V p. 2; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "SFOGLIATRICE_GEL_INVERSIONE_MARCIA_PEDALE",
            title: "Comando di Inversione di Marcia con Protezione Anti-Trascina Dita",
            question: "I comandi a joystick o pedale di inversione del senso di avanzamento dei tappeti funzionano a uomo presente e sono configurati per prevenire l'avvicinamento imprudente delle mani ai cilindri in movimento?",
            normReference: "UNI EN 1674; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SFOGLIATRICE_GEL_TAPPETI_ALIMENTARI_MOCA",
            title: "Tappeti Trasportatori in Tessuto Sintetico Certificato MOCA Privi di Sfilacciamenti",
            question: "I nastri trasportatori scorrevoli sono conformi alle normative MOCA (Reg. CE 1935/2004) per alimenti a base grassa/secca e risultano integri, privi di sfrangiature o bordi sfilacciati che possano rilasciare particelle tessili negli impasti?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 29/2017",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SFOGLIATRICE_GEL_RASCHIATORI_CILINDRI_PULIZIA",
            title: "Raschiatori Rimovibili per Pulizia a Cilindri Fermi e Spenti",
            question: "I raschiatori inferiori dei cilindri sono facilmente smontabili per le ordinarie operazioni di pulizia e sanificazione a fine turno mediante procedura sicura a macchina spenta e scollegata elettricamente?",
            normReference: "D.Lgs. 81/2008 All. V p. 2; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "forno_ventilato_pasticceria",
        name: "Forno Elettrico Ventilato Professionale per Pasticceria e Cialde",
        type: "Forno Combinato / Ventilato a Convezione per Pasticceria e Bakery",
        suggestedManufacturer: "Unox / Rational",
        suggestedModel: "Unox Bakertop Mind.Maps / Rational iCombi Classic Bakery",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FORNO_GEL_DOPPIO_VETRO_ANTIUSTIONE",
            title: "Porta a Doppio Vetro Ventilato Termoisolante Anti-Ustione",
            question: "La porta del forno è munita di doppio o triplo vetro camera basso-emissivo con intercapedine ventilata d'aria che mantiene la temperatura superficiale esterna al di sotto delle soglie di sicurezza (< 60°C) prevenendo ustioni da contatto accidentale?",
            normReference: "UNI EN ISO 13732-1; CEI EN 60335-2-42; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_GEL_ARRESTO_VENTOLA_APERTURA",
            title: "Microinterruttore su Porta per Arresto Immediato Ventole all'Apertura",
            question: "L'apertura della porta attiva un microinterruttore di sicurezza che disinserisce immediatamente le ventole di convezione e l'iniezione vapore, impedendo violente fuoriuscite di correnti di calore bollente verso il viso dell'operatore?",
            normReference: "CEI EN 60335-2-42; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_GEL_CAPPA_CONDENSAZIONE_VAPORI",
            title: "Cappa a Condensazione Vapori Canalizzata e Filtri Antigrasso Inox",
            question: "Il forno è sovrastato da cappa di aspirazione a condensazione canalizzata verso l'esterno o con ricircolo filtrato certificato, con filtri a labirinto in acciaio inox lavabili per prevenire accumuli di vapori nel laboratorio?",
            normReference: "Reg. CE 852/2004 All. II cap. I; D.Lgs. 81/2008 art. 64 e All. IV",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_GEL_SICURA_DOPPIO_SCATTO_MANIGLIA",
            title: "Maniglia di Apertura a Doppio Scatto per Sfiato Vapore Controllato",
            question: "La maniglia della porta presenta un meccanismo a doppio scatto di sicurezza che obbliga a un primo sgancio di sfiato vapore prima dello spalancamento completo dell'anta?",
            normReference: "CEI EN 60335-2-42; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
      {
        machineKey: "lavaoggetti_carapine_stoviglie",
        name: "Lavaoggetti Industriale per Carapine, Vaschette e Fruste (Pot-Washer)",
        type: "Lavastoviglie e Lavaoggetti Industriale ad Alta Pressione per Pasticceria/Gelateria",
        suggestedManufacturer: "Winterhalter / Comenda",
        suggestedModel: "Winterhalter UF-M / Comenda GE 655 RCD / Hoonved EDI",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LAVAOGGETTI_RISCIACQUO_82C_DIN10510",
            title: "Ciclo di Risciacquo Igienizzante ad Alta Temperatura (>= 82°C) DIN 10510",
            question: "La lavaoggetti garantisce boiler e risciacquo finale con temperatura costante superiore a 82°C certificata secondo la norma DIN 10510, per assicurare la termodisinfezione battericida completa di carapine e residui di miscele lattiero-casearie?",
            normReference: "DIN 10510; Reg. CE 852/2004 All. II cap. V; D.Lgs. 193/2007",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "LAVAOGGETTI_CESTO_SAGOMATO_CARAPINE",
            title: "Cesto Sagomato Inox con Supporti Antiribaltamento per Carapine e Fruste",
            question: "I cesti di lavaggio in acciaio inox rinforzato dispongono di alloggiamenti sagomati per sostenere carapine cilindriche pesanti e fruste planetaria, impedendo urti, cadute o danneggiamenti delle giranti rotanti dell'acqua?",
            normReference: "D.Lgs. 81/2008 art. 71; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "LAVAOGGETTI_DISPOSITIVO_ANTIRIFLUSSO_UNI1717",
            title: "Dispositivo Antiriflusso Idrico a Norma UNI EN 1717 (Break Tank con Air Gap)",
            question: "L'allacciamento alla rete idrica potabile è protetto da sistema a serbatoio atmosferico con disconnessione d'aria (Break Tank - Air Gap tipo A) a norma UNI EN 1717, escludendo qualsiasi contaminazione per riflusso verso l'acquedotto?",
            normReference: "UNI EN 1717; D.Lgs. 31/2001; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVAOGGETTI_MICRO_PORTA_DOSATORI_INTEGRATI",
            title: "Microinterruttore di Arresto Apertura Porta e Dosatori Automatici Detergente",
            question: "La porta o capotta controbilanciata è dotata di microinterruttore che blocca istantaneamente le pompe di lavaggio ad alta pressione in caso di apertura e i dosatori perimetrali di detergente chimico sono sigillati a prelievo automatico?",
            normReference: "CEI EN 60335-2-58; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "armadio_congelatore_carapine_sede",
        name: "Armadio Frigorifero a Bassa Temperatura per Stoccaggio Carapine (-25°C)",
        type: "Armadio Frigorifero Verticale a Bassa Temperatura per Conservazione Gelato",
        suggestedManufacturer: "Friulinox / Coldline / Liebherr",
        suggestedModel: "Friulinox Gelato Line / Coldline Master Gelato -25°C / Liebherr GGv 5860",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CONGELATORE_CARAPINE_TEMP_25C_REGOLABILE",
            title: "Temperatura Negativa Costante Regolabile da -15°C a -25°C con Tracciabilità HACCP",
            question: "L'armadio congelatore garantisce refrigerazione ventilata uniforme a bassa temperatura (-15°C / -25°C) con display elettronico visibile e registrazione conforme ai piani di autocontrollo HACCP?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 193/2007",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CONGELATORE_CARAPINE_CREMAGLIERE_INOX_PORTATA",
            title: "Cremagliere e Guide Rinforzate in Acciaio Inox per Carico Pesante Carapine",
            question: "La struttura interna è provvista di cremagliere e ripiani in acciaio inox rinforzato specificamente calcolati per sostenere il carico concentrato delle carapine piene di gelato senza rischio di flessioni o collassi strutturali?",
            normReference: "D.Lgs. 81/2008 art. 71; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CONGELATORE_CARAPINE_ALLARME_HACCP_PORTA",
            title: "Allarme Visivo/Acustico Sovratemperatura e Porta Aperta con Serratura a Chiave",
            question: "La centralina elettronica emette allarme ottico e sonoro in caso di porta lasciata inavvertitamente aperta o di innalzamento termico critico ed è provvista di serratura a chiave per la sicurezza delle scorte durante la chiusura?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: false,
          },
          {
            code: "CONGELATORE_CARAPINE_VALVOLA_COMPENSAZIONE_VUOTO",
            title: "Valvola Termica di Compensazione Pressione per Agevole Riapertura Anta",
            question: "La camera è provvista di valvola riscaldata di compensazione della depressione che consente la riapertura immediata della porta senza forzature traumatiche da parte dell'operatore?",
            normReference: "UNI EN 378; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
    ],
  },

  // 1-quater. BAR, CAFFETTERIA, SNACK BAR, COCKTAIL BAR E BIRRERIA
  // ATECO 56.30.00, 56.30.0, 56.30, 56.3 (Bar, Caffetteria, Snack Bar, Cocktail Bar, Wine Bar, Birreria e Tavola Fredda)
  {
    sectorKey: "bar_caffetteria",
    sectorLabel: "Bar, Caffetteria, Snack Bar, Cocktail Bar e Birreria",
    atecoPrefixes: ["56.30.00", "56.30.0", "56.30", "56.3"],
    machines: [
      // 1. MACCHINA PER CAFFÈ ESPRESSO (env-bar-banco-caffetteria)
      {
        machineKey: "macchina_caffe_bar",
        name: "Macchina per Caffè Espresso Professionale a 2 o 3 Gruppi",
        type: "Macchina Termobarica a Vapore / Pressione per Caffè Espresso",
        suggestedManufacturer: "La Marzocco / Faema / Rancilio",
        suggestedModel: "Linea PB / Faema E71 / Rancilio Classe 9",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_bar_vapore,
        safetyChecks: [
          {
            code: "MACCHINA_CAFFE_CALDAIA_PED_VALVOLA_SOVRAPRESSIONE",
            title: "Caldaia Certificata PED (D.Lgs. 26/2016) e Valvola di Sicurezza Sovrapressione",
            question: "La caldaia a vapore/acqua calda della macchina espresso è costruita e collaudata a norma PED (D.Lgs. 26/2016), provvista di valvola di sicurezza meccanica contro le sovrapressioni con scarico convogliato e priva di trafilamenti?",
            normReference: "D.Lgs. 26/2016 (Direttiva PED 2014/68/UE); D.Lgs. 81/2008 art. 71",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "MACCHINA_CAFFE_LANCIA_VAPORE_COOL_TOUCH_ANTIUSTIONE",
            title: "Lancia Vapore Cool-Touch Termoisolata Anti-Scottatura",
            question: "Le lance vapore per montare il latte sono dotate di isolamento termico interno tipo Cool-Touch o impugnatura atermica in elastomero siliconico per prevenire ustioni e scottature accidentali dell'operatore durante l'uso continuo?",
            normReference: "D.Lgs. 81/2008 art. 71 e All. V p. 9; CEI EN 60335-2-75",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MACCHINA_CAFFE_MANOMETRI_PRESSIONE_CERTIFICATI",
            title: "Manometri di Controllo Pressione Caldaia ed Erogazione Tarati e Funzionanti",
            question: "I manometri analogici o digitali di controllo pressione in caldaia (1.0-1.5 bar) e pressione di spinta della pompa rotativa (8-9 bar) sono integri, perfettamente visibili e tarati con segnalazione delle zone di sovrapressione critica?",
            normReference: "D.Lgs. 81/2008 art. 71; CEI EN 60335-2-75",
            defaultSeverity: 4,
            defaultSanctionable: false,
          },
          {
            code: "MACCHINA_CAFFE_VALVOLA_ANTISUZIONE_ROMPIVUOTO",
            title: "Valvola Rompivuoto Anti-Depressione e Anti-Riflusso Latte",
            question: "Le lance vapore e la caldaia montano valvole anti-vuoto (anti-suzione) perfettamente pulite ed efficienti per impedire la risalita del latte all'interno del circuito pressurizzato della caldaia al termine dell'erogazione?",
            normReference: "Reg. CE 852/2004 All. II cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MACCHINA_CAFFE_SCARICO_CONVOGLIATO_INTERRUZIONE_ARIA",
            title: "Vaschetta Raccogligocce e Scarico Idrico con Interruzione d'Aria (UNI EN 1717)",
            question: "La vaschetta raccogligocce inox d'appoggio tazze è dotata di scarico continuo convogliato a sifone aperto con interruzione d'aria per prevenire ristagni maleodoranti e riflussi dall'impianto fognario?",
            normReference: "UNI EN 1717; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 2. MACINADOSATORE ELETTRONICO ISTANTANEO (env-bar-banco-caffetteria)
      {
        machineKey: "macinadosatore_caffe_ondemand",
        name: "Macinadosatore Elettronico Istantaneo On-Demand per Caffè",
        type: "Macinatore Elettrico con Regolazione Micrometrica Macine",
        suggestedManufacturer: "Mazzer / Eureka / Fiorenzato",
        suggestedModel: "Mazzer Kony S / Eureka Olympus / Fiorenzato F64",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "MACINADOSATORE_CAMPANA_MOCA_MICROINTERRUTTORE",
            title: "Campana Grani Certificata MOCA (Reg. CE 1935/2004) e Microinterruttore di Blocco",
            question: "La campana dei grani di caffè è certificata MOCA (Reg. CE 1935/2004) in materiale atossico antiurto ed è provvista di microinterruttore di sicurezza che arresta il motore impedendo l'avvio a campana rimossa o durante la pulizia delle macine?",
            normReference: "Reg. CE 1935/2004; UNI EN 12852; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MACINADOSATORE_BATTIFILTRO_FONOASSORBENTE_RUMORE",
            title: "Cassetto Battifiltro Fonoassorbente per Abbattimento Rumore Impulsivo",
            question: "Il cassetto o cilindro battifiltro per i fondi di caffè è provvisto di barra rivestita in gomma siliconica ammortizzata fonoassorbente e guarnizioni acustiche per abbattere l'esposizione al rumore impulsivo (D.Lgs. 81/2008 Titolo VIII Capo II)?",
            normReference: "D.Lgs. 81/2008 Titolo VIII Capo II (art. 187-198); UNI EN ISO 11202",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "MACINADOSATORE_REGOLAZIONE_MICROMETRICA_BLOCCO",
            title: "Regolazione Micrometrica con Fermo Meccanico e Protezione Sovraccarico",
            question: "La ghiera di regolazione micrometrica delle macine piane/coniche è dotata di pulsante/fermo meccanico di blocco e salvamotore termico magneto-termico contro surriscaldamenti anomali o blocco accidentale da corpi estranei?",
            normReference: "D.Lgs. 81/2008 art. 71; CEI EN 60335-2-64",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 3. LAVABICCHIERI PROFESSIONALE SOTTOBANCO (env-bar-banco-caffetteria)
      {
        machineKey: "lavabicchieri_bar_sottobanco",
        name: "Lavastoviglie / Lavabicchieri Professionale Sottobanco con Risciacquo 85°C",
        type: "Lavabicchieri Sottobanco con Pompa di Scarico e Dispositivo Break Tank",
        suggestedManufacturer: "Winterhalter / Meiko / Comenda",
        suggestedModel: "Winterhalter UC-S / Meiko M-iClean / Comenda",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "LAVABICCHIERI_RISCIACQUO_85C_HACCP_DIN10511",
            title: "Risciacquo Igienico ad Alta Temperatura 85°C Conforme HACCP",
            question: "La lavabicchieri garantisce durante la fase di risciacquo finale una temperatura dell'acqua di almeno 85°C per un tempo sufficiente ad assicurare la sanificazione termica e igienizzazione dei bicchieri e tazzine a norma HACCP e DIN 10511?",
            normReference: "Reg. CE 852/2004 All. II cap. V; DIN 10511; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVABICCHIERI_DISPOSITIVO_BREAK_TANK_UNI1717",
            title: "Dispositivo Anti-Reflusso Idrico a Interruzione d'Aria Break Tank (UNI EN 1717)",
            question: "La macchina è provvista di dispositivo di non ritorno idrico Break Tank con interruzione d'aria di tipo AA/AB conforme a UNI EN 1717 per impedire qualsiasi riflusso o contaminazione dell'acqua potabile di rete con acque di lavaggio?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023; D.Lgs. 81/2008 All. V",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "LAVABICCHIERI_DOSATORI_PERISTALTICI_CIRCUITO_CHIUSO",
            title: "Dosatori Automatici Peristaltici Detergente e Brillantante a Circuito Chiuso",
            question: "I dosatori di detergente caustico e brillantante sono di tipo peristaltico automatico temporizzato con tubicini di pescaggio a circuito chiuso per evitare travasi manuali e rischio chimico di contatto cutaneo (D.Lgs. 81/08 Titolo IX)?",
            normReference: "D.Lgs. 81/2008 art. 71 e art. 223-225; Reg. CE 1272/2008 (CLP)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVABICCHIERI_MICRO_ARRESTO_CICLO_APERTURA",
            title: "Microinterruttore di Sicurezza Arresto Ciclo all'Apertura Porta",
            question: "L'apertura della porta o cappotta durante la fase di lavaggio provoca l'arresto immediato del ciclo e delle pompe di lavaggio tramite microinterruttore di sicurezza, evitando schizzi di acqua bollente o detergenti sull'operatore?",
            normReference: "UNI EN 60335-2-58; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 4. FABBRICATORE DI GHIACCIO A CUBETTI (env-bar-banco-caffetteria)
      {
        machineKey: "fabbricatore_ghiaccio_bar",
        name: "Fabbricatore di Ghiaccio a Cubetti Cavi/Pieni per Cocktail e Soft Drink",
        type: "Produttore Elettrico Automatico di Ghiaccio Alimentare",
        suggestedManufacturer: "Brema / Icematic / Scotsman",
        suggestedModel: "Brema CB 425 / Icematic CS40",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FABBRICATORE_GHIACCIO_CIRCUITO_ERMETICO_R290",
            title: "Circuito Frigorifero Ermetico con Gas Naturale Ecologico R290 (UNI EN 378)",
            question: "Il circuito di refrigerazione dell'evaporatore a palette o spruzzatori è ermeticamente sigillato, conforme alla norma UNI EN 378 ed impiega gas refrigerante ecologico a basso GWP (propano R290)?",
            normReference: "UNI EN 378-1/2; CEI EN 60335-2-24; Reg. UE 517/2014",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FABBRICATORE_GHIACCIO_MATERIALI_INTERNI_MOCA",
            title: "Vasca di Contenimento e Materiali a Contatto MOCA (Reg. CE 1935/2004)",
            question: "L'interno della vasca di deposito, la portella basculante isolata e la paletta di prelievo sono realizzati in materiali atossici certificati MOCA conformi al Reg. CE 1935/2004, con paletta riposta in supporto dedicato sanificato?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V; D.Lgs. 29/2017",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FABBRICATORE_GHIACCIO_SCARICO_INTERRUZIONE_ARIA",
            title: "Scarico Acque con Interruzione d'Aria Anti-Reflusso Fognario (UNI EN 1717)",
            question: "Il condotto di scarico dell'acqua di scarto e fusione del serbatoio è dotato di disconnessione idraulica a battente aperto / interruzione d'aria conforme a UNI EN 1717 per impedire risalite microbiologiche o fognarie nel ghiaccio?",
            normReference: "UNI EN 1717; Reg. CE 852/2004",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "FABBRICATORE_GHIACCIO_SANIFICAZIONE_PERIODICA_ANTICALCARE",
            title: "Protocollo di Sanificazione Periodica Anticalcare e Disinfezione HACCP",
            question: "Viene effettuata e registrata regolarmente sul piano di autocontrollo HACCP la sanificazione chimica antibatterica con disincrostazione anticalcare periodica dell'evaporatore, ugelli e vasca di contenimento ghiaccio?",
            normReference: "Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 5. COCKTAIL STATION (env-bar-cocktail-station)
      {
        machineKey: "cocktail_station_bar",
        name: "Cocktail Station Completa in Acciaio Inox con Vasca Ghiaccio Coibentata",
        type: "Modulo Operativo Ergonomico Barman / Mixology in Acciaio Inox",
        suggestedManufacturer: "RG Mania / Station Bar / Forcar",
        suggestedModel: "RG Mania / Station Bar / Forcar",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "COCKTAIL_STATION_VASCA_COIBENTATA_SCARICO_DIRETTO",
            title: "Vasca Ghiaccio Coibentata in Inox con Scarico Indipendente e Separatore",
            question: "La vasca centrale per ghiaccio cubetti e tritato è coibentata con isolamento termico privo di CFC, dotata di piletta di scarico continuo dell'acqua di fusione e separatore grigliato asportabile in acciaio inox AISI 304 MOCA?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "COCKTAIL_STATION_SPEED_RAIL_ANTICADUTA",
            title: "Speed-Rail Frontale Portabottiglie Sagomato con Bordo Anticaduta e Antitaglio",
            question: "Lo speed-rail portabottiglie per speed pourer presenta bordi antitaglio arrotondati e spondina di contenimento dimensionata per prevenire cadute accidentali e rotture di bottiglie in vetro con rischio lesioni da taglio?",
            normReference: "D.Lgs. 81/2008 art. 71 e All. V p. 6; UNI EN ISO 14120",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "COCKTAIL_STATION_VASCHETTE_MOCA_COPERCHI",
            title: "Vaschette Guarnizioni/Frutta in Policarbonato MOCA con Coperchio Ermetico",
            question: "Le vaschette per frutta e guarnizioni cocktail (condiment holder) sono certificate MOCA Reg. CE 1935/2004, dotate di coperchio trasparente a chiusura antipolvere per proteggere gli alimenti da contaminazioni crociate ed insetti?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. IX",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "COCKTAIL_STATION_LAVELLO_BAGNAGHIACCIO_UNI1717",
            title: "Piano Lavello con Bagnaghiaccio Pressurizzato e Valvola di Non Ritorno (UNI EN 1717)",
            question: "Il dispositivo bagnaghiaccio / lava-shaker (pitcher rinser) a pressione è collegato all'impianto idrico con interruttore di disconnessione idraulica e valvola di non ritorno conforme a UNI EN 1717?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 6. BLENDER / FRULLATORE PROFESSIONALE INSONORIZZATO (env-bar-cocktail-station)
      {
        machineKey: "blender_frullatore_cocktail",
        name: "Frullatore / Blender Professionale Insonorizzato per Frappè e Cocktail",
        type: "Blender Elettrico Professionale per Mixology con Calotta Insonorizzata",
        suggestedManufacturer: "Vitamix / Hamilton Beach / Blendtec",
        suggestedModel: "Vitamix The Quiet One / Hamilton Beach Eclipse",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BLENDER_CAMPANA_FONOASSORBENTE_MICRO_UNI12852",
            title: "Campana Fonoassorbente con Microinterruttore di Sicurezza UNI EN 12852",
            question: "La calotta insonorizzante di protezione acustica è dotata di microinterruttore di sicurezza a norma UNI EN 12852 che disattiva immediatamente il motore al sollevamento, impedendo l'accesso al bicchiere con le lame in movimento?",
            normReference: "UNI EN 12852; CEI EN 60335-2-64; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BLENDER_BICCHIERE_MOCA_BPA_FREE_ANTIURTO",
            title: "Bicchiere Graduato in Copoliestere MOCA BPA-Free Antiurto",
            question: "La caraffa graduata è realizzata in copoliestere antiurto per alimenti certificata MOCA priva di bisfenolo A (BPA-free) resistente alle sollecitazioni del ghiaccio senza rischio di fessurazioni o scheggiature pericolose?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 29/2017; Reg. UE 10/2011",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BLENDER_LAME_INOX_PROTEZIONE_SOVRACCARICO",
            title: "Gruppo Lame Inox ad Alta Resistenza e Protezione Termica Sovraccarico",
            question: "Il gruppo lame rotanti è in acciaio inossidabile temperato ad alta durezza, con innesto a giunto scanalato protetto e circuito provvisto di salvavita termico a riarmo contro sovraccarichi o blocco meccanico?",
            normReference: "D.Lgs. 81/2008 art. 71; CEI EN 60335-1",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 7. TRITAGHIACCIO PROFESSIONALE (env-bar-cocktail-station)
      {
        machineKey: "tritaghiaccio_professionale_bar",
        name: "Tritaghiaccio Professionale Elettrico per Granite e Cocktail Pestrati",
        type: "Tritaghiaccio Elettrico Professionale per Bar con Tramoggia Protetta",
        suggestedManufacturer: "Sirman / Ceado / Santos",
        suggestedModel: "Sirman Nordkapp / Ceado V90",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "TRITAGHIACCIO_LEVA_PRESSORE_MICRO_UNI12852",
            title: "Bocca di Carico con Leva Pressore Interbloccata a Microinterruttore UNI EN 12852",
            question: "La bocca di carico del ghiaccio è munita di leva pressore interbloccata a microinterruttore di sicurezza conforme a UNI EN 12852 che arresta istantaneamente il motore al sollevamento per prevenire il contatto delle dita con il disco di taglio?",
            normReference: "UNI EN 12852; D.Lgs. 81/2008 All. V p. 6; CEI EN 60335-2-64",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "TRITAGHIACCIO_DISCO_LAME_INOX_ROMPIGHIACCIO",
            title: "Disco Rompighiaccio e Lame in Acciaio Inox MOCA Inaccessibili",
            question: "I dischi frantumatori e le lame rompighiaccio sono in acciaio inossidabile alimentare certificato MOCA, strutturalmente inaccessibili durante il normale funzionamento e protetti da carter ermetico?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TRITAGHIACCIO_CASSETTO_RACCOGLITORE_MOCA_SENSORE",
            title: "Cassetto Raccoglighiaccio Trasparente MOCA con Sensore di Presenza",
            question: "Il cassetto raccoglitore del ghiaccio tritato è in policarbonato trasparente MOCA e dispone di sensore o microinterruttore che impedisce il funzionamento a cassetto aperto o estratto?",
            normReference: "UNI EN 12852; Reg. CE 1935/2004",
            defaultSeverity: 4,
            defaultSanctionable: false,
          },
        ],
      },

      // 8. SPILLATORE BIRRA E BEVANDE (env-bar-spillatura-co2)
      {
        machineKey: "spillatore_birra_bevande",
        name: "Impianto di Spillatura Birra e Bevande a Più Vie con Serpentina Sottobanco",
        type: "Impianto Professionale di Erogazione Bevande con Raffreddatore Sottobanco",
        suggestedManufacturer: "Celli Group / Vin Service / Cornelius",
        suggestedModel: "Celli Group / Vin Service",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SPILLATORE_RUBINETTI_INOX_MOCA_COMPENSATORE",
            title: "Rubinetti e Colonne in Acciaio Inox MOCA con Compensatore di Flusso",
            question: "I rubinetti di spillatura, le colonne e le cannucce di mandata sono realizzati in acciaio inox o leghe certificate MOCA (Reg. CE 1935/2004) provvisti di compensatore di flusso regolabile per impedire schizzi e sprechi?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004; D.Lgs. 29/2017",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "SPILLATORE_SERPENTINA_BANCO_GHIACCIO_ISOLATA",
            title: "Serpentina Inox di Raffreddamento a Banco di Ghiaccio Termoisolata",
            question: "L'unità sottobanco presenta serpentine in acciaio inox immerse in vasca con banco di ghiaccio coibentata, con termostato di sicurezza e agitazione automatica dell'acqua di refrigerazione?",
            normReference: "UNI EN 378; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "SPILLATORE_VASCHETTA_LAVABICCHIERI_UNI1717",
            title: "Vaschetta Raccogligocce Inox con Lavabicchieri a Disconnessione Idrica (UNI EN 1717)",
            question: "La vaschetta raccogligocce d'appoggio bicchieri è dotata di scarico convogliato e dispositivo lavabicchieri a pressione (rinser) protetto da valvola di non ritorno conforme a UNI EN 1717 per evitare ritorni idraulici?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SPILLATORE_SANIFICAZIONE_CHIMICA_LINEE_BIRRA",
            title: "Protocollo di Sanificazione Chimica Periodica Linee Birra (HACCP)",
            question: "Le linee di spillatura della birra e delle bevande vengono sottoposte regolarmente a flussaggio, pulizia chimica alcalina e disinfezione programmata con acido e alcalino conforme al piano HACCP e annotate su apposito registro?",
            normReference: "Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 9. BOMBOLE CO2 ED AZOTO SPILLATURA (env-bar-spillatura-co2)
      {
        machineKey: "bombole_co2_azoto_spillatura",
        name: "Gruppo Bombole CO2 ed Azoto Alimentare (E290/E941) con Rilevatore Gas",
        type: "Impianto Bombole Gas Compresso Alimentare con Riduttori di Pressione",
        suggestedManufacturer: "Messer / Rivoira / SIAD / Nippon Gases",
        suggestedModel: "Messer E290 / SIAD Carboazoto",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.bombole_gas_compressi,
        safetyChecks: [
          {
            code: "BOMBOLE_CO2_CATENELLE_ANTICADUTA_PARETE",
            title: "Bombole Vincolate a Parete con Catenelle Anticaduta Verticali (D.Lgs. 81/08 Tit. XI)",
            question: "Le bombole di anidride carbonica (CO2 E290) e azoto (N2 E941) sia in esercizio che di scorta sono saldamente ancorate a parete o carrello tramite robuste catenelle metalliche o collari a 2/3 dell'altezza per prevenirne la caduta?",
            normReference: "D.Lgs. 81/2008 art. 71, All. V p. 6 e Titolo XI; D.M. 10/03/1998",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_CO2_RIDUTTORE_MANOMETRI_VALVOLA_SOVRAPRESSIONE",
            title: "Riduttore di Pressione Certificato con Manometri di Alta/Bassa e Valvola di Sfogo",
            question: "I riduttori di pressione a norma UNI EN ISO 2503 sono provvisti di manometro di alta pressione (carica bombola), manometro di bassa pressione (mandata linee) e valvola di sicurezza tarata contro le sovrapressioni?",
            normReference: "UNI EN ISO 2503; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_CO2_RILEVATORE_GAS_ALLARME_ANTIASFISSIA",
            title: "Rilevatore a Parete Fughe CO2 con Allarme Ottico-Acustico Anti-Asfissia",
            question: "Nel locale/vano di stoccaggio delle bombole è presente un sensore rilevatore di perdite di CO2 posizionato a circa 20-30 cm dal pavimento (gas pesante) provvisto di allarme ottico-acustico anti-asfissia ed eventuale elettrovalvola/ventilazione?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3, All. IV p. 1.8 e Titolo XI; Linee Guida INAIL",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BOMBOLE_CO2_COLLAUDO_TPED_CAPPELLOTTO",
            title: "Conformità Bombole TPED, Collaudo Periodico Decennale e Cappellotto di Protezione",
            question: "Le bombole sono conformi alla direttiva TPED (D.Lgs. 35/2010), hanno collaudo decennale valido, etichettatura E290/E941 per uso alimentare e le bombole piene di scorta sono provviste di cappellotto di protezione della valvola?",
            normReference: "D.Lgs. 35/2010 (TPED); D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 10. PIASTRA PANINI E TOSTIERA (env-bar-retrobanco-snack)
      {
        machineKey: "piastra_panini_tostiera",
        name: "Piastra Elettrica Doppia Rigata in Ghisa / Vetroceramica per Panini e Toast",
        type: "Piastra Elettrica Doppia da Banco per Cottura e Tostatura Panini",
        suggestedManufacturer: "Sirman / Milan Toast / Spidocook",
        suggestedModel: "Sirman Cort / Milan Toast / Spidocook",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "PIASTRA_PANINI_PIANI_GHISA_VETROCERAMICA_MOCA",
            title: "Piani di Cottura in Ghisa Rigata o Vetroceramica Certificati MOCA",
            question: "Le piastre di cottura in ghisa sabbiata con trattamento antimicrobico o in vetroceramica sono certificate per il contatto con alimenti (MOCA Reg. CE 1935/2004) e prive di lesioni, sfaldamenti o ruggine superficiale?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 29/2017; Reg. CE 852/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_PANINI_MANIGLIA_TERMOISOLANTE_ANTIUSTIONE",
            title: "Maniglia Termoisolante Ergonomica Anti-Ustione con Bilanciamento Piani",
            question: "L'impugnatura del piano superiore mobile è realizzata in materiale atermico termoisolante anti-ustione ed è supportata da molla di bilanciamento che impedisce la caduta traumatica o lo schiacciamento delle dita dell'operatore?",
            normReference: "D.Lgs. 81/2008 art. 71 e All. V p. 9; CEI EN 60335-2-48",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PIASTRA_PANINI_CASSETTO_RACCOGLIGRASSO_FERMO",
            title: "Cassetto Raccogligrasso Estraibile con Fermo Meccanico di Sicurezza",
            question: "La piastra è dotata di cassetto raccogligrasso e residui in acciaio inox estraibile, provvisto di fermo meccanico per prevenirne lo sfilamento accidentale con sversamento di olio o grasso bollente?",
            normReference: "D.Lgs. 81/2008 art. 71; CEI EN 60335-2-48",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "PIASTRA_PANINI_TERMOSTATO_LAVORO_E_SICUREZZA",
            title: "Termostato di Lavoro Fino a 300°C con Termostato di Sicurezza a Riarmo",
            question: "La temperatura di lavoro è controllata da termostato regolabile fino a 300°C con presenza di termostato di sicurezza a riarmo manuale che interviene staccando l'alimentazione in caso di anomalia termica?",
            normReference: "CEI EN 60335-2-48; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 11. FORNO MICROONDE SPEED OVEN (env-bar-retrobanco-snack)
      {
        machineKey: "forno_microonde_speedoven",
        name: "Forno Professionale ad Alta Velocità / Microonde Combinato (Speed Oven)",
        type: "Forno Professionale ad Alta Velocità Combinato Convezione/Microonde",
        suggestedManufacturer: "Merrychef / Menumaster / Turbochef",
        suggestedModel: "Merrychef eikon e2s / Menumaster",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SPEEDOVEN_CAMERA_INOX_SANIFICABILE_MOCA",
            title: "Camera Interna in Acciaio Inox AISI 304 Sanificabile a Norme MOCA",
            question: "La camera interna di cottura è costruita in acciaio inox AISI 304 privo di fessure, con spigoli arrotondati facilmente sanificabili e teglie/accessori certificati MOCA per cotture ad alta temperatura?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "SPEEDOVEN_TRIPLO_INTERBLOCCO_PORTA_MICROONDE",
            title: "Porta Schermata con Triplo Interblocco di Sicurezza Emissione Onde",
            question: "La porta è munita di triplo interblocco elettromeccanico di sicurezza che interrompe immediatamente l'emissione di microonde e disattiva il generatore magnetron non appena l'anta viene sbloccata o aperta?",
            normReference: "CEI EN 60335-2-90; D.Lgs. 81/2008 art. 71 e All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "SPEEDOVEN_CATALIZZATORE_FUMI_SENZA_CANNA_FUMARIA",
            title: "Catalizzatore Fumi Interno Integrato Senza Necessità di Canna Fumaria",
            question: "Il forno speed-oven incorpora un convertitore catalitico interno per il ricircolo e la purificazione dei fumi e vapori di cottura, consentendo l'installazione a vista a banco senza cappa d'aspirazione con fumi all'esterno?",
            normReference: "D.Lgs. 81/2008 art. 71; CEI EN 60335-2-90",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "SPEEDOVEN_RICETTE_PREIMPOSTATE_PARAMETRI_BLOCCATI",
            title: "Programmi di Cottura con Ricette Memorizzate e Blocco Parametri Operatore",
            question: "L'interfaccia digitale dispone di ricette preprogrammate con blocco parametri per prevenire sovra-riscaldamenti, autocombustione degli alimenti o rischi di ustione causati da impostazioni errate del tempo e potenza?",
            normReference: "D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 12. AFFETTATRICE A GRAVITÀ BAR (env-bar-retrobanco-snack)
      {
        machineKey: "affettatrice_gravita_bar",
        name: "Affettatrice Professionale a Gravità per Salumi Lama 300 mm",
        type: "Affettatrice a Gravità Professionale per Salumi e Formaggi",
        suggestedManufacturer: "Berkel / Sirman / RGV",
        suggestedModel: "Berkel Red Line / Sirman Palladio 300",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "AFFETTATRICE_BAR_ANELLO_FISSO_PARALAMA_360",
            title: "Anello Fisso Paralama Continuo a 360° Conforme UNI EN 1974",
            question: "La lama dell'affettatrice è protetta da un anello fisso di protezione continuo a 360° a norma UNI EN 1974 che impedisce il contatto accidentale delle dita con il tagliente anche a coprilama rimosso per la pulizia?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 art. 71 e All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_BAR_BLOCCO_VELA_SPESSORE_ZERO",
            title: "Blocco Meccanico Vela a Spessore Zero per Rimozione Piatto Merce",
            question: "È presente il dispositivo meccanico di interblocco che impedisce lo smontaggio del piatto carrello portamerce se la manopola graduata della vela non è posizionata a 'zero' (lama completamente chiusa)?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 All. V",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_BAR_RELE_MINIMA_TENSIONE_NVR",
            title: "Relè di Minima Tensione NVR Anti-Riavvio Spontaneo",
            question: "Il pulsante di comando marcia/arresto (IP65) è dotato di relè di minima tensione (NVR - No-Volt Release) per prevenire il riavvio spontaneo e pericoloso della lama dopo un'interruzione improvvisa dell'energia elettrica?",
            normReference: "UNI EN 1974; CEI EN 60204-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_BAR_PRESSAMERCE_SCHERMO_SALVADITA",
            title: "Pressamerce Ergonomico con Schermo di Protezione Salvadita Trasparente",
            question: "Il braccio pressamerce è dotato di maniglia ergonomica in tecnopolimero e schermo trasparente salvadita in policarbonato infrangibile che scherma la mano dell'operatore durante l'avanzamento verso la lama?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_BAR_AFFILATOIO_INCORPORATO_CUFFIA",
            title: "Gruppo Affilatoio Incorporato con Protezione a Cuffia Integrale",
            question: "L'affilatoio a due smerigli è incorporato, stabilmente fissato e provvisto di calotta protettiva che impedisce il contatto accidentale con la lama durante le manovre di rotazione per l'affilatura?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 13. VETRINA SNACK REFRIGERATA (env-bar-banco-caffetteria)
      {
        machineKey: "vetrina_snack_refrigerata",
        name: "Vetrina Refrigerata da Banco Porta-Snack, Tramezzini e Brioche (+4°C)",
        type: "Vetrina Espositiva Refrigerata Positiva da Banco con Cristalli Curvi",
        suggestedManufacturer: "Afinox / IFI / Enofrigo",
        suggestedModel: "Afinox / IFI / Enofrigo",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "VETRINA_SNACK_CRISTALLI_CURVI_PARATOIE_HACCP",
            title: "Cristalli Curvi Panoramici Parafiato Igienici Antiaerosol per Clienti",
            question: "La vetrina è munita di cristalli curvi temperati parafiato panoramici che proteggono gli snack esposti (tramezzini, panini, brioche farcite) da aerosol, tosse o contaminazioni da parte della clientela (norme HACCP)?",
            normReference: "Reg. CE 852/2004 All. II cap. III; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "VETRINA_SNACK_CONTROLLO_DIGITALE_TEMP_HACCP",
            title: "Controllo Digitale Temperatura HACCP (+2°C/+6°C) con Allarme e Sbrinamento",
            question: "La centralina digitale regola stabilmente la temperatura interna fra +2°C e +6°C per alimenti deperibili, con allarme sonoro/visivo di superamento soglia critica e ciclo di sbrinamento automatico programmato?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "VETRINA_SNACK_ILLUMINAZIONE_LED_BASSA_TENSIONE",
            title: "Illuminazione Interna a LED a Bassa Tensione 24V Ermetica IP65",
            question: "L'illuminazione dei ripiani è a barre LED a bassissima tensione di sicurezza (SELV 24V) protette con grado di isolamento stagno IP65 contro umidità e contatti accidentali?",
            normReference: "CEI EN 60335-2-89; CEI 64-8",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "VETRINA_SNACK_RIPIANI_INOX_MOCA_ANTIRIBALTAMENTO",
            title: "Ripiani Asportabili in Vetro Temperato o Acciaio Inox MOCA con Fermo",
            question: "I ripiani espositivi sono certificati MOCA, facilmente rimovibili per la sanificazione quotidiana e dotati di fermi o guide antiribaltamento?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 14. ARMADIO FRIGORIFERO PORTE VETRATE (env-bar-celle-frigo / env-bar-deposito-bevande)
      {
        machineKey: "armadio_frigo_bar_bevande",
        name: "Armadio Frigorifero a Porte Vetrate per Bevande e Latte (+2/+4°C)",
        type: "Frigorifero Professionale Verticale a Porte Vetrate Positive",
        suggestedManufacturer: "Friulinox / Liebherr / Polaris",
        suggestedModel: "Friulinox / Liebherr / Polaris",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FRIGO_BAR_PORTE_DOPPIO_VETRO_GUARNIZIONI_MAGNETICHE",
            title: "Porte Doppio Vetro Basso Emissivo con Guarnizioni Magnetiche Sostituibili",
            question: "Le ante a battente montano doppi vetri termoisolanti temperati basso-emissivi con guarnizioni magnetiche a tenuta ermetica, facilmente pulibili e sostituibili per garantire l'igiene ed efficienza energetica?",
            normReference: "Reg. CE 852/2004 All. II cap. V; CEI EN 60335-2-89",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "FRIGO_BAR_TERMOSTATO_DIGITALE_HACCP_SONDA_NTC",
            title: "Termostato Digitale HACCP con Sonda NTC e Sbrinamento Automatico",
            question: "L'armadio dispone di controllo elettronico della temperatura (+2°C / +4°C per latte fresco, bibite e succhi), sonda NTC con display visibile al personale e sbrinamento automatico a gas caldo o fermo compressore?",
            normReference: "Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FRIGO_BAR_CIRCUITO_ECOLOGICO_R290_UNI378",
            title: "Circuito Ecologico con Refrigerante Naturale R290 (UNI EN 378)",
            question: "Il motocompressore integrato impiega refrigerante naturale R290 (propano) conforme alla normativa europea F-Gas ed è inserito in vano motore adeguatamente areato e protetto da griglia di sicurezza?",
            normReference: "UNI EN 378-1/2; Reg. UE 517/2014; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FRIGO_BAR_GRIGLIE_MOCA_PORTATA_CERTIFICATA",
            title: "Griglie Interne Plastificate MOCA con Portata Certificata Anticaduta",
            question: "I ripiani a griglia interni sono realizzati con rivestimento atossico certificato MOCA, con ganci di supporto provvisti di fermo anticaduta e portata minima di 40 kg per ripiano?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 15. SPREMIAGRUMI E CENTRIFUGA (env-bar-banco-caffetteria)
      {
        machineKey: "spremiagrumi_centrifuga_bar",
        name: "Spremiagrumi Elettrico e Centrifuga Professionale per Frutta Fresca",
        type: "Apparecchio Elettrico Professionale da Banco per Spremute ed Estratti",
        suggestedManufacturer: "Ceado / Santos / Zumex",
        suggestedModel: "Ceado S98 / Santos 50 / Zumex",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SPREMIAGRUMI_LEVA_PRESSORE_MICRO_UNI12852",
            title: "Leva Pressore con Microinterruttore di Arresto Motore UNI EN 12852",
            question: "La leva di pressione dello spremiagrumi o il coperchio della centrifuga sono dotati di microinterruttore di sicurezza a norma UNI EN 12852 che interrompe istantaneamente la rotazione del cono/cestello all'apertura?",
            normReference: "UNI EN 12852; CEI EN 60335-2-64; D.Lgs. 81/2008 All. V",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "SPREMIAGRUMI_COMPONENTI_MOCA_LAVABILI",
            title: "Vasca, Pigna e Filtro in Acciaio Inox / Policarbonato MOCA Lavabili",
            question: "Tutte le parti a contatto con gli agrumi e i succhi (vaschetta, pigna rotante, ogiva e beccuccio salvagoccia) sono certificate MOCA Reg. CE 1935/2004 e smontabili senza attrezzi per il lavaggio in lavastoviglie?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II cap. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CENTRIFUGA_PROTEZIONE_DITA_IMBOCCO_PESTELLO",
            title: "Protezione Dita su Imbocco Centrifuga con Pestello Ergonomico",
            question: "L'imbocco di alimentazione della frutta per la centrifuga presenta altezza e diametro tali da impedire l'introduzione involontaria delle dita, con uso obbligatorio di pestello dedicato?",
            normReference: "UNI EN 12852; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CENTRIFUGA_FRENO_MOTORE_ELETTROMAGNETICO",
            title: "Freno Motore Elettromagnetico per Arresto Rapido del Cestello Rotante",
            question: "La centrifuga è equipaggiata con freno motore a disco o controcorrente che garantisce l'arresto completo del cestello filtrante rotante entro 2 secondi dallo spegnimento o sollevamento della leva?",
            normReference: "UNI EN 12852; CEI EN 60335-2-64; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 16. IMPIANTO ADDOLCITORE E FILTRAZIONE ACQUE (env-bar-tecnico-trattamento-acque / env-bar-plonge-lavaggio)
      {
        machineKey: "impianto_addolcitore_acque",
        name: "Impianto Addolcitore e Filtrazione Acque ad Osmosi Inversa per Macchine Bar",
        type: "Sistema Professionale di Trattamento e Addolcimento Acque Potabili per Bar",
        suggestedManufacturer: "BWT water+more / Brita Purity / Everpure",
        suggestedModel: "BWT water+more / Brita Purity",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "ADDOLCITORE_FILTRI_RESINE_POTABILITA_DLGS18_2023",
            title: "Filtri Decloratori e Resine a Scambio Ionico Conformi D.Lgs. 18/2023 e DM 174/2004",
            question: "Il gruppo di trattamento acque impiega cartucce filtranti a carboni attivi sinterizzati e resine a scambio ionico conformi al D.Lgs. 18/2023 e D.M. 174/2004 per materiali a contatto con acqua destinata al consumo umano?",
            normReference: "D.Lgs. 18/2023; D.M. 174/2004; Reg. CE 1935/2004",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "ADDOLCITORE_VALVOLA_ANTIRIFLUSSO_UNI1717",
            title: "Valvola di Sicurezza Anti-Riflusso a Disconnessione Idrica (UNI EN 1717)",
            question: "L'allaccio all'acquedotto a monte del sistema di filtrazione è protetto da valvola di non ritorno e disconnettore idraulico conforme a UNI EN 1717 con manometro di controllo pressione idrica di rete?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "ADDOLCITORE_TEST_DUREZZA_CAMBIO_CARTUCCE_HACCP",
            title: "Test Periodico Durezza Acqua (°fF) e Registro Manutenzioni Sostituzione Cartucce",
            question: "Viene effettuato periodicamente il test colorimetrico della durezza dell'acqua in gradi francesi (°fF) e registrata la sostituzione programmata delle cartucce esauste sul registro di manutenzione HACCP aziendale?",
            normReference: "D.Lgs. 18/2023; Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ADDOLCITORE_FLESSIBILI_INOX_ALTA_PRESSIONE",
            title: "Tubi Flessibili di Collegamento in Treccia d'Acciaio Inox per Alta Pressione",
            question: "Tutti i tubi flessibili di mandata dell'acqua addolcita verso macchina caffè, lavastoviglie e fabbricatore ghiaccio sono in treccia d'acciaio inox certificati MOCA resistenti alla pressione e alle sollecitazioni idrauliche?",
            normReference: "D.M. 174/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
    ],
  },

  // 1-quinquies. HOTEL, ALBERGHI, RESORT, VILLAGGI ALBERGHIERI E STRUTTURE RICETTIVE
  // ATECO 55.10.00, 55.10.0, 55.10, 55.1 (Hotel / Albergo, Resort, Villaggi alberghieri e Strutture Ricettive Turistiche)
  {
    sectorKey: "hotel_strutture_ricettive",
    sectorLabel: "Hotel, Alberghi, Resort e Strutture Ricettive Turistiche",
    atecoPrefixes: ["55.10.00", "55.10.0", "55.10", "55.1"],
    machines: [
      // 1. CENTRALE RIVELAZIONE FUMI, ALLARME INCENDI & SISTEMA EVAC (env-hotel-reception-hall, env-hotel-camere-piano)
      {
        machineKey: "centrale_antincendio_evac",
        name: "Centrale di Rivelazione Fumi, Allarme Incendi & Sistema EVAC",
        type: "Centrale Indirizzata Antincendio e Sistema Vocale di Evacuazione (EVAC)",
        suggestedManufacturer: "Notifier / Inim Electronics / Siemens",
        suggestedModel: "Notifier AM-8200 / Inim Previdia / Siemens Cerberus",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_evac,
        safetyChecks: [
          {
            code: "CENTRALE_ANTINCENDIO_CONFORMITA_EN54_EVAC_ISO7240",
            title: "Centrale Indirizzata Conforme UNI EN 54 e Messaggi Vocali EVAC UNI ISO 7240-19",
            question: "La centrale antincendio è di tipo analogico indirizzato conforme alle norme UNI EN 54-2 e EN 54-4, integrata con sistema di allarme vocale EVAC conforme a UNI ISO 7240-19 con messaggi registrati multilingua per l'evacuazione ordinata degli ospiti e del personale?",
            normReference: "UNI EN 54-2; UNI ISO 7240-19; D.M. 09/04/1994; D.M. 02/09/2021; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CENTRALE_ANTINCENDIO_BATTERIE_TAMPONE_RISERVA",
            title: "Alimentatore Certificato EN 54-4 e Batterie Tampone di Riserva Autonome",
            question: "L'apparato è provvisto di alimentatore caricabatteria conforme UNI EN 54-4 con doppio set di batterie tampone al piombo sigillato capaci di garantire l'autonomia di sorveglianza per almeno 24 ore e 30 minuti consecutivi di allarme generale ed evacuazione vocale?",
            normReference: "UNI EN 54-4; UNI 9795; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CENTRALE_ANTINCENDIO_PULSANTI_MANUALI_FUMI",
            title: "Rivelatori Ottici di Fumo Indirizzati e Pulsanti Manuali a Rottura Vetro",
            question: "Tutte le camere, i corridoi e le aree comuni sono presidiati da rivelatori ottici di fumo indirizzati e pulsanti manuali a rottura vetro posti lungo le vie d'esodo con indicatore ottico d'azione e cartellinatura conforme D.Lgs. 81/08?",
            normReference: "UNI 9795; D.M. 09/04/1994 Titolo I; D.Lgs. 81/2008 Allegato XXIV",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CENTRALE_ANTINCENDIO_VERIFICA_SEMESTRALE_UNI11224",
            title: "Verifica Periodica Semestrale e Registro dei Controlli Antincendio UNI 11224",
            question: "L'impianto è sottoposto a manutenzione e verifica periodica con cadenza semestrale da parte di tecnico qualificato secondo la norma UNI 11224 con regolare annotazione sul Registro dei Controlli Antincendio?",
            normReference: "UNI 11224; D.M. 02/09/2021 Allegato I; D.Lgs. 81/2008 art. 46 c. 2",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
        ],
      },

      // 2. GRUPPO ELETTROGENO DIESEL AUTOMATICO DI EMERGENZA (env-hotel-vano-gruppo-elettrogeno)
      {
        machineKey: "gruppo_elettrogeno_emergenza",
        name: "Gruppo Elettrogeno Diesel Automatico di Emergenza (50-200 kVA)",
        type: "Gruppo Elettrogeno Diesel Autonomo di Emergenza e Continuità Elettrica",
        suggestedManufacturer: "Pramac / Caterpillar / Bruno Generators",
        suggestedModel: "Pramac GSW / Caterpillar / Bruno Generators",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.gruppi_elettrogeni,
        safetyChecks: [
          {
            code: "GRUPPO_ELETTROGENO_QUADRO_ATS_INTERVENTO_15S",
            title: "Quadro Automatico d'Intervento ATS entro 15s in Blackout per Pompe Antincendio ed Emergenza",
            question: "Il gruppo elettrogeno è dotato di quadro di commutazione automatica ATS tarato per l'avviamento e l'assunzione del carico elettrico prioritario entro 15 secondi dall'interruzione di rete, garantendo l'alimentazione delle pompe antincendio, ascensori e illuminazione di sicurezza?",
            normReference: "CEI 64-8/7; D.M. 09/04/1994; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "GRUPPO_ELETTROGENO_BACINO_CONTENIMENTO_GASOLIO_110",
            title: "Bacino di Contenimento Gasolio 110% Conforme D.M. 13/07/2011 e CPI Attività 49",
            question: "Il serbatoio incorporato o di servizio del gasolio è alloggiato entro bacino metallico di contenimento stagno avente capacità volumetrica pari ad almeno il 110% del serbatoio a norma del D.M. 13/07/2011 per attività soggetta a CPI (Attività 49)?",
            normReference: "D.M. 13/07/2011 art. 4; D.P.R. 151/2011 Attività 49; D.Lgs. 152/2006",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "GRUPPO_ELETTROGENO_PULSANTE_EMERGENZA_INTERCETTAZIONE",
            title: "Pulsante di Arresto Emergenza e Intercettazione Fuori Locale",
            question: "All'esterno del locale gruppo elettrogeno sono installati in posizione protetta e segnalata il pulsante a fungo d'arresto di emergenza e la valvola a tirante di rapida intercettazione manuale del combustibile?",
            normReference: "D.M. 13/07/2011; D.Lgs. 81/2008 All. IV e All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "GRUPPO_ELETTROGENO_VERIFICA_AVVIAMENTO_MENSILE_CARICO",
            title: "Verifiche Periodiche di Avviamento a Vuoto Mensile e Sotto Carico Semestrale",
            question: "Vengono eseguite e documentate con regolarità le prove di avviamento a vuoto con frequenza mensile e le verifiche funzionali sotto carico reale con frequenza semestrale con annotazione nel registro manutenzioni?",
            normReference: "CEI 64-8/7 sez. 718; D.Lgs. 81/2008 art. 71 c. 8",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 3. ASCENSORE ELETTRICO/IDRAULICO PER PASSEGGERI (env-hotel-reception-hall, env-hotel-vani-ascensori-montacarichi)
      {
        machineKey: "ascensore_passeggeri_hotel",
        name: "Ascensore Elettrico/Idraulico per Passeggeri (Conformità D.P.R. 162/99)",
        type: "Ascensore per Passeggeri ed Ospiti a Funi o Oleodinamico",
        suggestedManufacturer: "Otis / Schindler / Kone",
        suggestedModel: "Otis Gen2 / Schindler 3300 / Kone MonoSpace",
        isSubjectToInailCheck: true,
        inailFrequencyYears: 2,
        training: TRAINING_REQUIREMENTS_LIBRARY.ascensori_montacarichi,
        safetyChecks: [
          {
            code: "ASCENSORE_HOTEL_TELEALLARME_BIDIREZIONALE_EN81_28",
            title: "Teleallarme Bidirezionale H24 Conforme EN 81-28 con Batteria Autonoma",
            question: "La cabina dell'ascensore è equipaggiata con dispositivo di comunicazione bidirezionale h24 conforme alla norma EN 81-28, dotato di alimentazione autonoma di riserva e collegato permanentemente al pronto intervento ascensori per il soccorso immediato dei passeggeri intrappolati?",
            normReference: "UNI EN 81-28; D.P.R. 162/99 art. 15; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "ASCENSORE_HOTEL_FOTOCELLULA_BARRIERA_PORTE",
            title: "Fotocellula a Barriera a Tutta Altezza su Porte Cabina Anti-Schiacciamento",
            question: "Le porte automatiche di cabina e di piano sono provviste di barriera fotoelettrica multiraggio a infrarossi a tutta altezza che inverte tempestivamente il movimento di chiusura al rilevamento di un ospite o bagaglio per prevenire schiacciamenti?",
            normReference: "UNI EN 81-20 punto 5.3.6; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ASCENSORE_HOTEL_MANOVRA_EMERGENZA_BLACKOUT",
            title: "Manovra Automatica di Emergenza al Piano in Mancanza Rete Elettrica",
            question: "L'impianto ascensore è dotato di dispositivo automatico di emergenza che, in caso di blackout dell'energia elettrica principale, riporta dolcemente la cabina al piano più vicino e apre le porte consentendo l'uscita sicura dei passeggeri?",
            normReference: "UNI EN 81-20; D.P.R. 162/99; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: false,
          },
          {
            code: "ASCENSORE_HOTEL_VERIFICHE_BIENNALI_DPR162_99",
            title: "Verifiche Periodiche Biennali Art. 13 D.P.R. 162/99 con Ente Notificato",
            question: "L'ascensore è sottoposto a regolare verifica periodica biennale di sicurezza ex art. 13 D.P.R. 162/99 effettuata da Organismo Notificato o ASL/ARPA con esito favorevole e annotazione sul libretto d'immatricolazione?",
            normReference: "D.P.R. 162/99 art. 13 e 14; D.Lgs. 81/2008 art. 71 c. 11",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
        ],
      },

      // 4. MONTACARICHI / ASCENSORE DI SERVIZIO PER BIANCHERIA E PIANI (env-hotel-vani-ascensori-montacarichi)
      {
        machineKey: "montacarichi_servizio_piani",
        name: "Montacarichi / Ascensore di Servizio per Biancheria e Piani (Portata 500-1000 kg)",
        type: "Montacarichi e Ascensore di Servizio Verticale per Movimentazione Merci e Biancheria",
        suggestedManufacturer: "Daldoss / Kone / Schindler",
        suggestedModel: "Daldoss Microfreight / Kone / Schindler",
        isSubjectToInailCheck: true,
        inailFrequencyYears: 2,
        training: TRAINING_REQUIREMENTS_LIBRARY.ascensori_montacarichi,
        safetyChecks: [
          {
            code: "MONTACARICHI_HOTEL_PARACADUTE_MECCANICO_ROTTURA_FUNI",
            title: "Paracadute Meccanico Istantaneo a Rottura Funi con Limitatore di Velocità",
            question: "Il montacarichi è provvisto di paracadute meccanico istantaneo o progressivo d'emergenza asservito a limitatore di velocità in grado di arrestare saldamente la cabina sulle guide in caso di allentamento o rottura funi a pieno carico?",
            normReference: "UNI EN 81-20 / EN 81-31; D.P.R. 162/99; D.Lgs. 81/2008 All. V p. 4",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "MONTACARICHI_HOTEL_INTERBLOCCO_PORTE_PIANO_DOPPIO_SCATTO",
            title: "Interblocco Porte di Piano a Doppio Scatto Elettromeccanico di Sicurezza",
            question: "Le porte di accesso al vano su tutti i piani sono dotate di serrature di sicurezza a doppio scatto con contatti elettrici positivi certificati che impediscono l'apertura delle porte se la cabina non è al piano e ne bloccano il movimento ad anta aperta?",
            normReference: "UNI EN 81-20; D.Lgs. 81/2008 All. V p. 6; D.P.R. 162/99",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "MONTACARICHI_HOTEL_AVVISATORE_ACUSTICO_SOVRACCARICO",
            title: "Dispositivo di Pesatura e Avvisatore Acustico Sovraccarico di Portata",
            question: "La cabina è dotata di sensore di sovraccarico con avvisatore acustico e luminoso che impedisce la chiusura delle porte e la partenza dell'impianto qualora venga superata la portata massima omologata (500-1000 kg)?",
            normReference: "UNI EN 81-20; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MONTACARICHI_HOTEL_VERIFICA_BIENNALE_DPR162_99",
            title: "Verifica Periodica Biennale D.P.R. 162/99 e Libretto Matricola",
            question: "L'impianto di elevazione di servizio è registrato con regolare numero di matricola e sottoposto a collaudo e verifiche periodiche biennali ai sensi del D.P.R. 162/99 con verbale dell'organismo di controllo allegato al registro?",
            normReference: "D.P.R. 162/99 art. 13; D.Lgs. 81/2008 art. 71 c. 11",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 5. IMPIANTO DI DOSAGGIO BIOSSIDO DI CLORO / SANIFICAZIONE ACQUE ANTI-LEGIONELLA (env-hotel-centrale-idrica-legionella)
      {
        machineKey: "impianto_dosaggio_biossido_legionella",
        name: "Impianto di Dosaggio Biossido di Cloro / Sanificazione Acque Anti-Legionella",
        type: "Impianto Automatizzato di Generazione e Dosaggio Biossido di Cloro per Trattamento Rete ACS",
        suggestedManufacturer: "ProMinent / Grundfos / BWT",
        suggestedModel: "ProMinent Bello Zon / Grundfos Oxiperm / BWT",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.trattamento_acque_legionella,
        safetyChecks: [
          {
            code: "DOSAGGIO_LEGIONELLA_PROPORZIONALE_DLGS18_2023",
            title: "Dosaggio Proporzionale Continuo su Rete ACS e Monitoraggio Residuo Biossido Cloro",
            question: "L'impianto effettua il dosaggio continuo e proporzionale alla portata del biossido di cloro sulla rete acqua calda sanitaria (ACS) con sonda amperometrica di monitoraggio del residuo mantenuto nei limiti di legge (0.2 - 0.4 mg/l) ex D.Lgs. 18/2023?",
            normReference: "D.Lgs. 18/2023 All. I; Accordo Stato-Regioni 07/05/2015; D.Lgs. 81/2008 Titolo X",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "DOSAGGIO_LEGIONELLA_ALLARME_ESAURIMENTO_REAGENTE",
            title: "Sonde di Livello con Allarme Esaurimento Reagente e Interblocco Pompa",
            question: "I contenitori dei precursori chimici sono dotati di lance di aspirazione con sonde di livello che segnalano acusticamente e visivamente l'esaurimento dei reagenti bloccando la pompa prima dell'aspirazione d'aria?",
            normReference: "D.Lgs. 81/2008 Titolo IX e art. 71; Accordo Stato-Regioni 07/05/2015",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "DOSAGGIO_LEGIONELLA_BACINI_CONTENIMENTO_DPI_CHIMICI",
            title: "Bacini di Contenimento Antispandimento e DPI di Protezione Chimica",
            question: "Le taniche dei reattivi sono posizionate entro distinti bacini di contenimento in materiale anticorrosivo per evitare miscelazioni accidentali e sono presenti occhiali a mascherina, guanti in nitrile e visiera per gli operatori (D.Lgs. 81/08 Titolo IX)?",
            normReference: "D.Lgs. 81/2008 art. 77, art. 225 e All. V p. 9",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "DOSAGGIO_LEGIONELLA_REGISTRO_CAMPIONAMENTI_SEMESTRALI",
            title: "Registro di Controllo Legionella con Campionamenti Microbiologici Semestrali",
            question: "L'albergo detiene il Piano di Valutazione e Gestione del Rischio Legionellosi e il relativo Registro con registrazione dei controlli dosatore e dei referti di laboratorio dei campionamenti analitici semestrali sui punti critici?",
            normReference: "Accordo Stato-Regioni 07/05/2015; D.Lgs. 81/2008 art. 271, 280; D.Lgs. 18/2023",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
        ],
      },

      // 6. CALDAIA A CONDENSAZIONE AD ALTA POTENZA (env-hotel-centrale-termica-clima)
      {
        machineKey: "caldaia_centrale_termica_hotel",
        name: "Caldaia a Condensazione ad Alta Potenza per Riscaldamento e ACS",
        type: "Centrale Termica con Generatore a Condensazione a Gas ad Alta Potenzialità (> 116 kW)",
        suggestedManufacturer: "Viessmann / Ferroli / Riello",
        suggestedModel: "Viessmann Vitocrossal / Ferroli Quadrifoglio / Riello",
        isSubjectToInailCheck: true,
        inailFrequencyYears: 1,
        training: TRAINING_REQUIREMENTS_LIBRARY.centrali_termiche_clima,
        safetyChecks: [
          {
            code: "CALDAIA_HOTEL_CIRCUITO_PED_VALVOLE_INAIL",
            title: "Generatore Termico > 116 kW con Circuito Certificato PED (D.Lgs. 26/2016) e Valvole INAIL",
            question: "La centrale termica di potenza superiore a 116 kW ha circuito certificato secondo la Direttiva PED (D.Lgs. 26/2016), con valvole di sicurezza omologate INAIL, pressostato di blocco, termostato di limite e vasi di espansione piombati?",
            normReference: "D.Lgs. 26/2016 (PED); D.M. 01/12/1975 (Raccolta R INAIL); D.Lgs. 81/2008 art. 71",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CALDAIA_HOTEL_ELETTROVALVOLA_GAS_ESTERNA_RIARMO",
            title: "Intercettazione Automatica Gas con Elettrovalvola Esterna a Riarmo Manuale",
            question: "La tubazione di alimentazione gas a monte del locale è dotata di elettrovalvola esterna normalmente chiusa a riarmo manuale asservita a pulsante di emergenza a sgancio rapido e rivelatori fughe gas?",
            normReference: "D.M. 08/11/2019 (Regola Tecnica Impianti Termici); D.M. 03/09/2021; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CALDAIA_HOTEL_AERAZIONE_LOCALE_PORTA_REI",
            title: "Apertura Permanente di Aerazione e Porta Tagliafuoco REI/EI con Maniglione",
            question: "Il locale centrale termica è provvisto di apertura permanente di aerazione diretta verso l'esterno conforme a D.M. 08/11/2019 e porta tagliafuoco resistente al fuoco REI/EI con congegno di autochiusura e maniglione antipanico?",
            normReference: "D.M. 08/11/2019; D.Lgs. 81/2008 All. IV p. 1.5; D.M. 09/04/1994",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CALDAIA_HOTEL_VERIFICA_ANNUALE_INAIL_RENDIMENTO",
            title: "Verifica Annuale Rendimento di Combustione e Sicurezza INAIL",
            question: "L'impianto termico è sottoposto a verifica annuale di sicurezza INAIL e a controllo di efficienza energetica e analisi dei fumi con trasmissione del rapporto al catasto termico regionale (CURIT/CIT)?",
            normReference: "D.M. 11/04/2011; D.P.R. 74/2013; D.Lgs. 81/2008 art. 71 c. 11",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 7. CENTRALE DI TRATTAMENTO ARIA (UTA / CTA) E RECUPERATORE DI CALORE (env-hotel-centrale-termica-clima)
      {
        machineKey: "centrale_trattamento_aria_uta",
        name: "Centrale di Trattamento Aria (UTA / CTA) e Recuperatore di Calore",
        type: "Unità Trattamento Aria e Recupero Termico Centralizzata con Ventilazione Meccanica Controllata",
        suggestedManufacturer: "Daikin / Carrier / Sabiana",
        suggestedModel: "Daikin Modular / Carrier / Sabiana",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.centrali_termiche_clima,
        safetyChecks: [
          {
            code: "UTA_HOTEL_FILTRI_ALTA_EFFICIENZA_E95_HEPA",
            title: "Filtri Aria ad Alta Efficienza e95/HEPA con Monitoraggio Intasamento",
            question: "La centrale di trattamento aria è equipaggiata con stadi di filtrazione ad alta efficienza (ePM1 80-95% o HEPA) dotati di manometri differenziali per la segnalazione immediata della necessità di sostituzione filtri per garantire la qualità dell'aria indoor (IAQ)?",
            normReference: "UNI EN ISO 16890; Linee Guida Tutela Qualità Aria Indoor; D.Lgs. 81/2008 All. IV p. 1.9",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "UTA_HOTEL_RECUPERATORE_CALORE_SEPARAZIONE_FLUSSI",
            title: "Recuperatore Termico a Flussi Incrociati a Tenuta Senza Ricircolo Microbiologico",
            question: "Il recuperatore di calore è di tipo a flussi incrociati o a piastre con tenuta certificata per evitare qualsiasi contaminazione incrociata o ricircolo di aria viziata proveniente da servizi igienici e cucine verso le camere degli ospiti?",
            normReference: "UNI EN 308; D.Lgs. 81/2008 All. IV p. 1.9; D.M. 09/04/1994",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "UTA_HOTEL_SERRANDE_TAGLIAFUOCO_CANALI_VENTILAZIONE",
            title: "Serrande Tagliafuoco Certificate EI/REI Asservite a Rivelatori Fumi",
            question: "I canali aeraulici di mandata e ripresa sono provvisti di serrande tagliafuoco certificate EI a marchio CE con microinterruttore di segnalazione posizione asservite all'impianto centrale antincendio per isolare le compartimentazioni dell'hotel?",
            normReference: "UNI EN 15650; D.M. 09/04/1994 Titolo II; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "UTA_HOTEL_SANIFICAZIONE_PERIODICA_LINEE_GUIDA_SALUTE",
            title: "Canalizzazioni Sanificabili con Monitoraggio Periodico Polveri e Carica Microbica",
            question: "È attuato un programma periodico documentato di ispezione visiva, bonifica e sanificazione igienico-sanitaria delle canalizzazioni e batterie con monitoraggio microbiologico a norma delle Linee Guida Ministero della Salute e D.Lgs. 81/08?",
            normReference: "Linee Guida Ministero Salute 07/02/2013; D.Lgs. 81/2008 art. 71 e All. IV p. 1.9",
            defaultSeverity: 4,
            defaultSanctionable: false,
          },
        ],
      },

      // 8. LAVATRICE INDUSTRIALE SUPERCENTRIFUGANTE (env-hotel-lavanderia-stireria)
      {
        machineKey: "lavatrice_industriale_hotel",
        name: "Lavatrice Industriale Supercentrifugante per Lavanderia Interna (18-35 kg)",
        type: "Lavatrice Industriale Supercentrifugante Professionale a Carico Frontale",
        suggestedManufacturer: "Miele Professional / Electrolux Professional / Grandimpianti",
        suggestedModel: "Miele Professional PWM / Electrolux Professional Line 6000 / Grandimpianti",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.lavanderia_stireria_industriale,
        safetyChecks: [
          {
            code: "LAVATRICE_HOTEL_MICROINTERRUTTORE_BLOCCO_TERMOELETTRICO",
            title: "Microinterruttore di Sicurezza Sportello con Blocco Termoelettrico a Cestello in Movimento UNI EN ISO 10472-2",
            question: "Lo sportello di carico della lavatrice è provvisto di sistema di interblocco di sicurezza con blocco termoelettrico conforme a UNI EN ISO 10472-2 che impedisce categoricamente l'apertura finché il cestello è in rotazione o la temperatura dell'acqua supera i 50°C?",
            normReference: "UNI EN ISO 10472-2; Direttiva Macchine 2006/42/CE All. I; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "LAVATRICE_HOTEL_FUNGO_ARRESTO_EMERGENZA",
            title: "Fungo d'Arresto Emergenza ad Azione Ritenuta sul Cruscotto Frontale",
            question: "È presente sul pannello frontale comandi un pulsante a fungo d'arresto di emergenza a ritenuta meccanica per l'arresto immediato di tutte le funzioni dell'apparecchiatura in caso di anomalia o intrappolamento indumenti?",
            normReference: "UNI EN ISO 13850; D.Lgs. 81/2008 All. V p. 2.1; Direttiva 2006/42/CE",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVATRICE_HOTEL_DOSATORI_AUTOMATICI_DETERSIVI_CHIMICI",
            title: "Dosatori Automatici Detersivi per Prevenzione Contatto Chimico",
            question: "L'impianto è alimentato da dosatori automatici a pompa peristaltica a circuito chiuso per candeggianti, detergenti alcalini e neutralizzanti, azzerando il rischio di contatto cutaneo ed inalatorio degli operatori con sostanze chimiche corrosive?",
            normReference: "D.Lgs. 81/2008 Titolo IX (Agenti Chimici Pericolosi); UNI EN ISO 10472-2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVATRICE_HOTEL_SISTEMA_AMMORTIZZATORI_ANTI_SBILANCIAMENTO",
            title: "Sistema Ammortizzatori e Sensore Dinamico Anti-Sbilanciamento di Carico",
            question: "La macchina è dotata di sospensioni elastiche industriali con sensore dinamico di vibrazione che interrompe o riequilibra la centrifuga ad alta velocità qualora si verifichi uno sbilanciamento anomalo del carico tessile?",
            normReference: "UNI EN ISO 10472-2; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 9. ESSICCATORE / ASCIUGATRICE ROTATIVA INDUSTRIALE (env-hotel-lavanderia-stireria)
      {
        machineKey: "essiccatore_rotativo_industriale",
        name: "Essiccatore / Asciugatrice Rotativa Industriale per Biancheria (20-40 kg)",
        type: "Asciugatrice Industriale a Tamburo Rotante con Filtrazione Lanugine",
        suggestedManufacturer: "Miele Professional / Electrolux Professional / Girbau",
        suggestedModel: "Miele Professional PDR / Electrolux Professional TD6 / Girbau",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.lavanderia_stireria_industriale,
        safetyChecks: [
          {
            code: "ESSICCATORE_HOTEL_FILTRO_LANUGINE_ALLARME_INTASAMENTO",
            title: "Filtro Lanugine Estraibile con Allarme Intasamento per Prevenzione Inneschi Termici",
            question: "L'essiccatore è dotato di filtro raccogli-lanugine facilmente estraibile e pulibile, assistito da sensore di depressione con allarme ottico-acustico di intasamento per prevenire il surriscaldamento e l'innesco di principi d'incendio da lanugine calda?",
            normReference: "UNI EN ISO 10472-4 punto 5.2; D.Lgs. 81/2008 All. V p. 9; D.M. 02/09/2021",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "ESSICCATORE_HOTEL_TERMOSTATO_MASSIMA_RIARMO_MANUALE",
            title: "Termostato di Massima a Riarmo Manuale Contro Sovratemperature",
            question: "Il circuito termico è protetto da termostato di massima a sicurezza positiva e riarmo esclusivamente manuale che disalimenta istantaneamente il riscaldamento (elettrico o gas) in caso di superamento della soglia termica limite?",
            normReference: "UNI EN ISO 10472-4; CEI EN 60335-2-11; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ESSICCATORE_HOTEL_SPEGNIMENTO_AUTOMATICO_FINE_CICLO",
            title: "Spegnimento Automatico a Fine Ciclo e Fase di Raffreddamento UNI EN ISO 10472-4",
            question: "La macchina esegue a fine ciclo di asciugatura una fase automatica di raffreddamento a ventilazione fredda (Cool Down) e arresta automaticamente la rotazione all'apertura dell'oblò conforme a norma UNI EN ISO 10472-4 per evitare ustioni e autocombustione della biancheria?",
            normReference: "UNI EN ISO 10472-4; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ESSICCATORE_HOTEL_CANALIZZAZIONE_ARIA_ESTERNO",
            title: "Canalizzazione di Evacuazione Aria Umida Diretta all'Esterno",
            question: "La condotta di scarico dell'aria calda umida è realizzata in materiale metallico incombustibile, sigillata e convogliata direttamente all'esterno dell'edificio senza accumulo di umidità e polveri nel locale lavanderia?",
            normReference: "UNI EN ISO 10472-4; D.Lgs. 81/2008 All. IV p. 1.9",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 10. MANGANO / CALANDRA INDUSTRIALE ASCIUGANTE (env-hotel-lavanderia-stireria)
      {
        machineKey: "calandra_mangano_stireria",
        name: "Mangano / Calandra Industriale Asciugante per Lenzuola e Tovaglie",
        type: "Calandra e Mangano Industriale per Stiratura e Asciugatura Biancheria Piana",
        suggestedManufacturer: "Grandimpianti / Electrolux Professional / Miele",
        suggestedModel: "Grandimpianti S140 / Electrolux Professional IC4 / Miele",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.lavanderia_stireria_industriale,
        safetyChecks: [
          {
            code: "CALANDRA_HOTEL_BARRA_SALVADITA_BASCULANTE_ISO10472_5",
            title: "Barra Salvadita Basculante a Microinterruttore per Arresto Immediato Rullo e Apertura Conca UNI EN ISO 10472-5",
            question: "La bocca di introduzione biancheria è dotata di barra salvadita basculante a microinterruttore di sicurezza conforme a UNI EN ISO 10472-5 che comanda l'arresto istantaneo della rotazione del rullo e l'allontanamento immediato della conca riscaldata al minimo tocco delle dita dell'operatore?",
            normReference: "UNI EN ISO 10472-5 punto 5.2.2; Direttiva Macchine 2006/42/CE; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CALANDRA_HOTEL_PEDALE_COMANDO_AZIONE_MANTENUTA",
            title: "Pedale di Comando ad Azione Mantenuta per Controllo Avanzamento Rullo",
            question: "Il comando di avanzamento della biancheria è governato da pedale ad azione mantenuta con arresto della rotazione al rilascio del piede e pulsante a fungo d'emergenza laterale facilmente accessibile?",
            normReference: "UNI EN ISO 10472-5; D.Lgs. 81/2008 All. V p. 2.1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CALANDRA_HOTEL_CARTERATURE_ISOLATE_TERMICAMENTE",
            title: "Carterature Esterne Termicamente Coibentate Contro Ustioni da Contatto",
            question: "Tutti i carter metallici e i pannelli laterali accessibili all'operatore durante le normali operazioni di stiratura sono termoisolati e mantengono temperature superficiali non ustionanti (< 55°C) conforme a UNI EN ISO 13732-1?",
            normReference: "UNI EN ISO 13732-1; D.Lgs. 81/2008 All. V p. 9.1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CALANDRA_HOTEL_DISPOSITIVO_MANUALE_ESTRAZIONE_BLACKOUT",
            title: "Dispositivo Meccanico Manuale di Estrazione Biancheria in Assenza di Corrente",
            question: "È presente apposita manovella meccanica o leva di apertura d'emergenza della conca stirante per consentire il disimpegno immediato della biancheria e prevenire rischi di bruciatura tessuti e innesco fumi in caso di blackout elettrico improvviso?",
            normReference: "UNI EN ISO 10472-5; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 11. MACCHINA AUTOMATICA CAFFÈ E BEVANDE CALDE BUFFET COLAZIONI (env-hotel-sala-colazioni, env-hotel-office-cucina-colazioni)
      {
        machineKey: "distributore_bevande_calde_colazione",
        name: "Macchina Automatica Caffè in Grani e Bevande Calde per Buffet Colazioni",
        type: "Distributore Superautomatico da Banco per Caffetteria e Bevande Calde Self-Service",
        suggestedManufacturer: "WMF / Franke / Schaerer",
        suggestedModel: "WMF 1500S+ / Franke A600 / Schaerer Coffee Soul",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.buffet_colazioni_haccp,
        safetyChecks: [
          {
            code: "DISTRIBUTORE_COLAZIONI_BOILER_PED_VALVOLA_SICUREZZA",
            title: "Boiler Vapore Certificato PED con Valvola di Sicurezza e Scarico Convogliato",
            question: "Il circuito generatore di vapore e acqua calda è costruito e collaudato secondo la Direttiva PED (D.Lgs. 26/2016) ed è provvisto di valvola di sicurezza tarata contro le sovrapressioni con scarico idraulico convogliato protetto?",
            normReference: "D.Lgs. 26/2016 (PED 2014/68/UE); CEI EN 60335-2-75; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "DISTRIBUTORE_COLAZIONI_BREAK_TANK_DISCONNESSIONE_UNI1717",
            title: "Dispositivo Break Tank con Disconnessione Idrica Anti-Reflusso Conforme UNI EN 1717",
            question: "La macchina è collegata alla rete idrica mediante dispositivo di disconnessione idraulica a battente libero Break Tank con valvola di non ritorno conforme a UNI EN 1717 per impedire qualsiasi reflusso o contaminazione dell'acqua potabile?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023; Reg. CE 852/2004 All. II cap. VII",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "DISTRIBUTORE_COLAZIONI_EROGATORI_SANIFICABILI_MOCA",
            title: "Circuiti Erogatori Latte e Caffè Sanificabili e Certificati MOCA (Reg. CE 1935/2004)",
            question: "Tutti i condotti interni, le lance e i gruppi di erogazione di latte e caffè sono realizzati in materiali conformi MOCA (Reg. CE 1935/2004) e provvisti di ciclo automatico quotidiano di lavaggio termico e disinfezione HACCP?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004; D.Lgs. 29/2017",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "DISTRIBUTORE_COLAZIONI_MACINACAFFE_PROTEZIONE_GRIGLIA",
            title: "Macinacaffè Integrato con Griglia di Protezione e Micro di Sicurezza",
            question: "La campana dei grani di caffè è dotata di griglia fissa o microinterruttore di sicurezza che impedisce il contatto delle dita con le macine coniche/piatte in movimento durante il caricamento da parte del personale?",
            normReference: "Direttiva Macchine 2006/42/CE; D.Lgs. 81/2008 All. V p. 6; CEI EN 60335-2-75",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 12. BANCO BUFFET RISCALDATO A BAGNOMARIA / INDUZIONE (env-hotel-sala-colazioni, env-hotel-office-cucina-colazioni)
      {
        machineKey: "linea_buffet_calda_induzione",
        name: "Banco Buffet Riscaldato a Bagnomaria / Induzione per Colazioni (GN 1/1 - GN 3/1)",
        type: "Banco Buffet Termico Riscaldato a Bagnomaria o Induzione per Self-Service Colazioni",
        suggestedManufacturer: "Enofrigo / Afinox / Scaiola",
        suggestedModel: "Enofrigo / Afinox / Scaiola",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.buffet_colazioni_haccp,
        safetyChecks: [
          {
            code: "BUFFET_CALDO_MANTENIMENTO_65C_HACCP_TERMOSTATO_DIGITALE",
            title: "Mantenimento Temperatura Alimenti Cotti Costante >= 65°C a Norma HACCP con Termostato Digitale",
            question: "Il piano riscaldato o la vasca bagnomaria mantengono la temperatura delle uova, bacon e vivande calde costantemente a valori >= +65°C a norma del piano HACCP, monitorata mediante display digitale visibile agli addetti?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BUFFET_CALDO_CRISTALLI_CURVI_PARAFIATO_ANTIAEROSOL",
            title: "Cristalli Curvi Panoramici Parafiato Igienici Antiaerosol a Protezione Alimenti",
            question: "La linea buffet è dotata di schermi parafiato panoramici in cristallo temperato o policarbonato trasparente antiaerosol a protezione completa delle pietanze esposte contro goccioline respiratorie e contaminazioni esterne da parte degli ospiti?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BUFFET_CALDO_PROTEZIONE_RESISTENZE_LIVELLO_ACQUA",
            title: "Sensore di Livello Minimo Acqua e Termostato di Sicurezza Anti-Ebollizione a Secco",
            question: "La vasca è dotata di termostato di sicurezza limite e sensore galleggiante di livello acqua che disalimenta le resistenze elettriche in caso di evaporazione totale per prevenire rischi di fumi, incendio o rottura dell'acciaio?",
            normReference: "CEI EN 60335-2-49; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BUFFET_CALDO_ISOLAMENTO_IPX4_COLLEGAMENTO_TERRA",
            title: "Grado di Protezione IPX4 e Collegamento Equipotenziale di Terra",
            question: "La struttura in acciaio inox presenta grado di protezione da liquidi IPX4, con cavo elettrico con spina industriale o blocco presa con interruttore differenziale ad alta sensibilità da 30 mA a protezione di ospiti e operatori?",
            normReference: "CEI 64-8; CEI EN 60335-2-49; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 13. VETRINA / BANCO BUFFET REFRIGERATO PER COLAZIONI (env-hotel-sala-colazioni)
      {
        machineKey: "linea_buffet_refrigerata_colazioni",
        name: "Vetrina / Banco Buffet Refrigerato per Salumi, Formaggi, Latticini e Frutta (+4°C)",
        type: "Isola Buffet Refrigerata Ventilata da Esposizione per Buffet Colazioni",
        suggestedManufacturer: "Enofrigo / Afinox / IFI",
        suggestedModel: "Enofrigo / Afinox / IFI",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.buffet_colazioni_haccp,
        safetyChecks: [
          {
            code: "BUFFET_FREDDO_TEMPERATURA_4C_DISPLAY_OSPITI_ALLARME",
            title: "Piano o Vasca Refrigerata Ventilata con Display Temperatura Visibile e Allarme HACCP (+4°C)",
            question: "La vasca o piano buffet refrigerato mantiene i prodotti deperibili (formaggi, yogurt, salumi affettati) a temperatura conforme fra 0°C e +4°C, con visualizzatore digitale ben leggibile e allarme acustico in caso di anomalia termica?",
            normReference: "Reg. CE 852/2004 All. II cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BUFFET_FREDDO_RIPARI_PARAFIATO_VETRO_TEMPERATO",
            title: "Ripari Parafiato Igienici in Vetro Temperato Antigoccia e Antirottura",
            question: "La vetrina o banco buffet refrigerato monta barriere parafiato in vetro temperato di sicurezza anti-rottura con illuminazione LED fredda specifica senza dispersione termica per salvaguardare la freschezza degli alimenti esposti?",
            normReference: "Reg. CE 852/2004; UNI EN 1672-2; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BUFFET_FREDDO_GAS_ECOLOGICO_R290_SBRINAMENTO_AUTOMATICO",
            title: "Circuito Ecologico R290 Ermetico e Sbrinamento Automatico Condensa",
            question: "Il gruppo frigorifero adotta gas refrigerante ecologico naturale R290 (propano) conforme alle normative ambientali e F-Gas, con sbrinamento automatico temporizzato ed evaporazione automatica della condensa senza perdite d'acqua a pavimento?",
            normReference: "Regolamento UE 2024/573 (F-Gas); UNI EN 378; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BUFFET_FREDDO_VASCA_INOX_MOCA_RAGGIATA",
            title: "Vasca in Acciaio Inox AISI 304 Certificata MOCA con Spigoli Raggiati",
            question: "La vasca refrigerata è realizzata in acciaio inox AISI 304 per contatto alimentare MOCA con fondo raggiato per convogliare i liquidi di scolo verso foro di scarico con rubinetto, consentendo rapida sanificazione quotidiana senza accumuli?",
            normReference: "Reg. CE 1935/2004 (MOCA); Reg. CE 852/2004; D.Lgs. 29/2017",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 14. CARRELLO ERGONOMICO HOUSEKEEPING PER BIANCHERIA E PIANI (env-hotel-deposito-housekeeping)
      {
        machineKey: "carrelli_housekeeping_piani",
        name: "Carrello Ergonomico Housekeeping per Biancheria e Riassetto Camere",
        type: "Carrello Professionale su Ruote per Servizio ai Piani e Housekeeping Alberghiero",
        suggestedManufacturer: "TTS Cleaning / Filmop / IPC",
        suggestedModel: "TTS Cleaning Magic Hotel / Filmop Morgan / IPC",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_sanificazione,
        safetyChecks: [
          {
            code: "CARRELLO_HOTEL_TELAIO_TECNOPOLIMERO_FRENO_STAZIONAMENTO",
            title: "Telaio in Tecnopolimero Leggero e Freno di Stazionamento a Pedale sulle Ruote Piroettanti",
            question: "Il carrello housekeeping ha telaio ergonomico ultraleggero in tecnopolimero antiruggine ed è provvisto di freno di stazionamento a pedale sulle ruote piroettanti posteriori per impedire lo scivolamento accidentale del carrello lungo i corridoi in pendenza?",
            normReference: "D.Lgs. 81/2008 Titolo VI (MMC ISO 11228); UNI EN ISO 11228-2; art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CARRELLO_HOTEL_VANI_CHIUSI_SERRATURA_CHIMICI",
            title: "Vani Chiusi con Serratura per Detergenti Chimici Concentrati Contro Accesso Ospiti",
            question: "I cassetti o vani contenenti prodotti chimici di pulizia, disinfettanti concentrati e decalcificanti sono provvisti di sportelli richiudibili a chiave/serratura per impedire l'accesso o l'ingestione accidentale da parte di ospiti e bambini dell'hotel?",
            normReference: "D.Lgs. 81/2008 Titolo IX (Agenti Chimici Pericolosi) e art. 71; Reg. CLP",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "CARRELLO_HOTEL_MANIGLIE_ERGONOMICHE_LIMITI_SPINTA_MMC",
            title: "Maniglie di Spinta Ergonomiche e Rispetto Limiti Spinta/Traino MMC",
            question: "Le maniglie di spinta sono regolabili e conformate per evitare sovraccarichi biomeccanici agli arti superiori e alla colonna vertebrale delle cameriere ai piani, mantenendo le forze di spinta iniziali e di mantenimento conformi ai limiti ISO 11228-2?",
            normReference: "D.Lgs. 81/2008 Titolo VI e All. XXXIII; UNI ISO 11228-2",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "CARRELLO_HOTEL_PARACOLPI_ANGOLARI_GOMMA",
            title: "Paracolpi Angolari in Gomma Antistatica Anti-Urti",
            question: "La base del carrello è dotata su ogni angolo di paracolpi rotanti in gomma morbida antitraccia per smorzare gli urti contro porte, pareti e battiscopa evitando cadute accidentali del carico trasportato?",
            normReference: "D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },

      // 15. MONOSPAZZOLA PROFESSIONALE E MACCHINA AD INIEZIONE-ESTRAZIONE PER MOQUETTE (env-hotel-deposito-housekeeping)
      {
        machineKey: "monospazzola_lavasciuga_moquette",
        name: "Monospazzola Professionale e Macchina a Iniezione-Estrazione per Moquette e Pavimenti",
        type: "Monospazzola e Lavamoquette Professionale Elettrica a Iniezione-Estrazione",
        suggestedManufacturer: "Comac / Nilfisk / Kärcher",
        suggestedModel: "Comac CM43 / Nilfisk Viper / Kärcher Puzzi",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_sanificazione,
        safetyChecks: [
          {
            code: "MONOSPAZZOLA_HOTEL_TIMONE_UOMO_PRESENTE_DOPPIO_INTERRUTTORE",
            title: "Timone Ergonomico Regolabile con Comando Uomo Presente a Doppio Interruttore",
            question: "Il timone di guida della monospazzola è provvisto di comando a sicurezza positiva 'uomo presente' con leva a doppio interruttore che impedisce la rotazione involontaria della spazzola al rilascio o con impugnatura in posizione di riposo?",
            normReference: "CEI EN 60335-2-67; Direttiva Macchine 2006/42/CE; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MONOSPAZZOLA_HOTEL_ISOLAMENTO_IPX4_CAVO_ALTA_VISIBILITA",
            title: "Grado di Isolamento Elettrico IPX4 per Ambienti Umidi e Cavo ad Alta Visibilità",
            question: "Il motore e i componenti elettrici sono certificati con grado di protezione minimo IPX4 contro spruzzi d'acqua e detergenti, e il cavo elettrico flessibile è antistrappo ad alta visibilità (giallo/arancione) lungo almeno 15 metri privo di abrasioni?",
            normReference: "CEI EN 60335-2-67; CEI 64-8; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MONOSPAZZOLA_HOTEL_LIVELLO_VIBRAZIONI_MANO_BRACCIO",
            title: "Monitoraggio Livello di Vibrazioni Trasmesse al Sistema Mano-Braccio (HAV)",
            question: "La macchina monospazzola presenta livello di emissione di vibrazioni meccaniche trasmesse al sistema mano-braccio (HAV) inferiore a 2,5 m/s² per prevenire patologie osteoarticolari e vascolari durante l'uso continuativo (D.Lgs. 81/08 Titolo VIII Capo III)?",
            normReference: "D.Lgs. 81/2008 art. 201, 202; UNI EN ISO 5349-1",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "MONOSPAZZOLA_HOTEL_SERBATOIO_ACQUE_RECUPERO_SANIFICABILE",
            title: "Serbatoio Recupero Acque Reflue Smontabile e Sanificabile Contro Rischio Biologico",
            question: "Il gruppo a iniezione-estrazione per moquette ha serbatoio di recupero delle acque reflue trasparente, facilmente estraibile e lavabile per evitare la formazione di bioaerosol, muffe e cattivi odori durante lo svuotamento?",
            normReference: "D.Lgs. 81/2008 Titolo X; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 16. GENERATORE DI OZONO / ATOMIZZATORE PER SANIFICAZIONE CAMERE (env-hotel-camere-piano)
      {
        machineKey: "sanificatore_ozono_perossido",
        name: "Generatore di Ozono / Atomizzatore per Sanificazione e Disinfezione Camere Ospiti",
        type: "Apparecchiatura Elettronica di Generazione Ozono e Sanificazione Ambientale ad Azione Virucida",
        suggestedManufacturer: "Ozonosan / Sanity System / Caleffi",
        suggestedModel: "Ozonosan / Sanity System Sany Plus / Caleffi",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_sanificazione,
        safetyChecks: [
          {
            code: "SANIFICATORE_HOTEL_TIMER_DIGITALE_ALLARME_RICONVERSIONE",
            title: "Timer Digitale Programmabile con Allarme Acustico e Sensore di Riconversione Rapida Catalitica",
            question: "Il generatore di ozono è provvisto di timer digitale programmabile con allarme sonoro pre-avvio e di dispositivo di riconversione catalitica rapida dell'ozono in ossigeno per consentire la rioccupazione immediata della camera in totale sicurezza per addetti ed ospiti?",
            normReference: "D.Lgs. 81/2008 Titolo IX (Agenti Chimici); Rapporto ISS COVID-19 n. 56/2020; Circolare Min. Salute 22/05/2020",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "SANIFICATORE_HOTEL_MARCATURA_CE_PROCEDURE_SICUREZZA",
            title: "Marcatura CE e Procedure di Sicurezza Operative D.Lgs. 81/08 con Cartellinatura Divieto Accesso",
            question: "L'apparecchio possiede marcatura CE ed è impiegato esclusivamente secondo procedura standardizzata con apposizione all'esterno della porta della camera del cartello 'Sanificazione in corso - Divieto d'accesso' durante l'intero ciclo di trattamento?",
            normReference: "Direttiva 2006/42/CE; D.Lgs. 81/2008 art. 71 c. 7, Allegato XXIV",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "SANIFICATORE_HOTEL_SENSORE_OZONO_RESIDUO_SICUREZZA",
            title: "Sensore Elettrochimico di Controllo Concentrazione Residua di Ozono (< 0.1 ppm)",
            question: "L'apparato interrompe il ciclo e sblocca l'accesso solo dopo che la concentrazione residua di ozono in ambiente è scesa al di sotto del valore limite di soglia TLV-TWA di 0.1 ppm a salvaguardia delle vie respiratorie?",
            normReference: "D.Lgs. 81/2008 All. XXXVIII; ACGIH TLV-TWA; Rapporto ISS 56/2020",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SANIFICATORE_HOTEL_DPI_EMERGENZA_VIE_RESPIRATORIE",
            title: "DPI di Riserva per le Vie Respiratorie con Filtro per Gas Inorganici",
            question: "Il personale addetto ha in dotazione e a portata di mano semimaschera filtrante facciale conforme EN 140/EN 14387 con filtro B (gas inorganici) da impiegare in caso di ingresso accidentale o manovra d'emergenza a ciclo in corso?",
            normReference: "D.Lgs. 81/2008 art. 75, 77 e All. VIII",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // ATECO 55.20.20, 55.20.2 (Ostelli della Gioventù, Residence Turistici, Case per Ferie e Alloggi Comunitari)
  {
    sectorKey: "ostello_residence",
    sectorLabel: "Ostelli della Gioventù, Residence Turistici, Case per Ferie e Alloggi Comunitari",
    atecoPrefixes: ["55.20.20", "55.20.2"],
    machines: [
      // 1. PIANO DI COTTURA A INDUZIONE MULTI-ZONA PER CUCINA CONDIVISA (env-ost-cucina-condivisa)
      {
        machineKey: "piano_induzione_comunitario_ostello",
        name: "Piano di Cottura a Induzione Professionale Multi-Zona per Cucina Ospiti",
        type: "Piano Cottura Professionale a Induzione da Incasso / Appoggio per Uso Comunitario",
        suggestedManufacturer: "Electrolux Professional / Foster Commercial / Miele Pro",
        suggestedModel: "Electrolux Libero Point Induzione / Foster Modular Quadro 4 Zone",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_INDUZIONE_SENSORE_PRESENZA_PENTOLE",
            title: "Sensore di Presenza Pentole e Spegnimento Automatico Istantaneo a Vuoto",
            question: "Il piano a induzione è dotato di sensore elettronico di riconoscimento pentole con interruzione istantanea del campo elettromagnetico non appena il recipiente viene rimosso, azzerando il rischio di surriscaldamento a vuoto?",
            normReference: "CEI EN 60335-2-36 punto 22; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_INDUZIONE_BLOCCO_COMANDI_OSPITI",
            title: "Blocco Comandi di Sicurezza (Child Lock / Guest Protection)",
            question: "È presente e funzionante il sistema di blocco della tastiera touch contro accensioni accidentali, manomissioni da parte di minori o uso improprio non sorvegliato nella cucina condivisa?",
            normReference: "CEI EN 60335-2-36 punto 20; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_INDUZIONE_VETROCERAMICA_INTEGRITA_MOCA",
            title: "Integrità Superficie in Vetroceramica e Conformità MOCA",
            question: "Il piano superiore in vetroceramica è privo di crepe, scheggiature o fessurazioni da shock termico che possano esporre le bobine elettriche a infiltrazioni di liquidi, ed è idoneo al contatto alimentare MOCA?",
            normReference: "Reg. CE 1935/2004; CEI EN 60335-2-36 punto 19; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_INDUZIONE_SPIA_CALORE_RESIDUO",
            title: "Indicatori Luminosi di Calore Residuo per Ciascuna Zona",
            question: "Ciascuna zona di cottura presenta spia luminosa ad alta visibilità di calore residuo (H / Hot) attiva finché la temperatura della vetroceramica non scende sotto i 50°C per prevenire ustioni da contatto?",
            normReference: "CEI EN 60335-2-36 punto 7.12; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 2. FORNO A MICROONDE PROFESSIONALE INOX COMUNITARIO (env-ost-cucina-condivisa)
      {
        machineKey: "forno_microonde_inox_comunitario",
        name: "Forno a Microonde Professionale con Camera in Acciaio Inox Liscia",
        type: "Forno a Microonde Professionale Heavy Duty Senza Piatto Girevole per Aree Comuni",
        suggestedManufacturer: "Panasonic / Samsung Commercial / Sirman",
        suggestedModel: "Panasonic NE-1037 / Samsung Commercial CM1089 / Sirman Panasonic Pro",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_MICROONDE_SCHERMATURA_DISPERSIONI",
            title: "Schermatura e Tenuta Contro Dispersioni di Radiazioni Elettromagnetiche",
            question: "Lo sportello e la guarnizione perimetrale sono integri e garantiscono una dispersione di microonde rigorosamente inferiore al limite di sicurezza di 5 mW/cm² a 5 cm dalla superficie?",
            normReference: "CEI EN 60335-2-90 punto 32; D.Lgs. 81/2008 Titolo VIII Capo IV (CEM art. 206-212)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_MICROONDE_DOPPIO_INTERBLOCCO_PORTELLO",
            title: "Doppio Microinterruttore di Sicurezza su Apertura Sportello",
            question: "Il forno è dotato di doppio circuito di interblocco ridondante che spegne istantaneamente il magnetron all'apertura dello sportello, impedendo l'emissione di microonde a vano aperto?",
            normReference: "CEI EN 60335-2-90 punto 22.103; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_MICROONDE_FONDO_CERAMICO_PULIZIA",
            title: "Fondo Fisso Ceramico Sigillato e Pulizia Igienico-Sanitaria MOCA",
            question: "La camera interna in acciaio inox e il fondo fisso in ceramica sono esenti da incrostazioni carbonizzate, ruggine o residui organici, consentendo sanificazione e prevenendo archi elettrici?",
            normReference: "Reg. CE 852/2004 All. II Cap. V; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_MICROONDE_PRESA_TERRA_CAVO",
            title: "Continuità del Conduttore di Protezione PE e Cavo di Alimentazione",
            question: "Il conduttore di terra PE della scocca metallica inox è efficiente e il cavo di alimentazione è integro, protetto da scarico trazione e privo di surriscaldamenti anomali?",
            normReference: "CEI 64-8; D.Lgs. 81/2008 Titolo III Capo III (art. 80-87)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 3. FRIGORIFERO PROFESSIONALE MULTIPOSTO CON SCOMPARTI PER OSPITI (env-ost-dispensa-frigo-ospiti)
      {
        machineKey: "frigorifero_multiposto_ospiti",
        name: "Frigorifero Professionale Ventilato con Scomparti Chiusi per Ospiti (+2/+4°C)",
        type: "Armadio Frigorifero Positivo a Scomparti / Lockers Refrigerati per Comunità",
        suggestedManufacturer: "Liebherr ProfiLine / Friulinox / Polar C-Series",
        suggestedModel: "Liebherr ProfiLine GKPv 6570 / Friulinox CombiBox / Polar Multi-Door 600L",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_FRIGO_TELETERMOMETRO_HACCP",
            title: "Teletermometro Digitale Esterno con Allarme Temperatura HACCP",
            question: "Il frigorifero presenta display digitale esterno tarato per la verifica immediata della temperatura di conservazione (+2°C / +4°C) con registrazione o allarmi per sovratemperatura?",
            normReference: "Reg. CE 852/2004 All. II Cap. IX; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_FRIGO_BOX_SEPARATI_MOCA",
            title: "Scomparti Chiusi Numerati MOCA Contro Contaminazioni Crociate",
            question: "Gli scomparti o cestelli assegnati ai singoli ospiti sono numerati, realizzati in materiale plastico alimentare certificato MOCA, lavabili e separati per prevenire contaminazioni crociate?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_FRIGO_SBRINAMENTO_EVAPORATORE",
            title: "Sistema di Sbrinamento Automatico ed Evaporazione Condensa",
            question: "Il ciclo di sbrinamento automatico e la vaschetta di evaporazione condensa sono perfettamente operativi, prevenendo formazioni di ghiaccio e gocciolamenti sui pavimenti?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3.2; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_FRIGO_GAS_REFRIGERANTE_ECOLOGICO",
            title: "Sicurezza Circuito Gas Refrigerante Ecologico R600a/R290",
            question: "Il circuito refrigerante a gas naturale (R600a/R290) è a tenuta stagna certificata, privo di perdite e collocato in ambiente sufficientemente areato conforme alla norma tecnica?",
            normReference: "UNI EN 378-1/2; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 4. LAVASTOVIGLIE PROFESSIONALE CON CICLO RAPIDO E TERMODISINFEZIONE (env-ost-cucina-condivisa)
      {
        machineKey: "lavastoviglie_ciclo_breve_ostello",
        name: "Lavastoviglie Professionale da Incasso con Ciclo Rapido e Disinfezione Termica",
        type: "Lavastoviglie Professionale Sottobanco con Termodisinfezione DIN 10512 per Uso Comunitario",
        suggestedManufacturer: "Miele Professional / Electrolux Master / Krupps",
        suggestedModel: "Miele Professional PFD 104 U / Electrolux Master E30 / Krupps K540E",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_LAVASTOVIGLIE_TERMODISINFEZIONE_DIN",
            title: "Termodisinfezione Risciacquo ad Alta Temperatura (>= 75-80°C)",
            question: "Il boiler di risciacquo garantisce una temperatura finale certificata di almeno 80°C conforme alla norma DIN 10512 e ai principi HACCP per l'abbattimento della carica batterica su stoviglie comuni?",
            normReference: "DIN 10512; Reg. CE 852/2004; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_LAVASTOVIGLIE_ACQUASTOP_ANTIALLEGAMENTO",
            title: "Sistema Antiallagamento Acquastop con Doppia Elettrovalvola",
            question: "Il tubo di carico è dotato di valvola di sicurezza Acquastop e sensore a galleggiante nella vasca inferiore per l'interruzione immediata dell'erogazione idrica in caso di rottura o perdita?",
            normReference: "UNI EN 61770; D.Lgs. 81/2008 All. IV p. 1.3.2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_LAVASTOVIGLIE_MICROINTERRUTTORE_PORTA",
            title: "Microinterruttore di Blocco Pompa all'Apertura dello Sportello",
            question: "L'apertura dello sportello durante il ciclo di lavaggio arresta istantaneamente la pompa di lavaggio e le giranti, evitando spruzzi di acqua ad alta temperatura e detergenti caustici verso l'operatore?",
            normReference: "CEI EN 60335-2-58 punto 20; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_LAVASTOVIGLIE_DISCONNESSIONE_IDRICA",
            title: "Disconnessione Idrica Anti-Ritorno e Dosatori Detergenti Protetti",
            question: "L'allacciamento idrico presenta dispositivo anti-riflusso conforme UNI EN 1717 (Break Tank / valvola ritegno) e le cannucce di pescaggio detersivo/brillantante sono protette da contatto accidentale?",
            normReference: "UNI EN 1717; D.Lgs. 81/2008 Titolo IX (art. 223-228)",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 5. DISTRIBUTORE AUTOMATICO H24 REFRIGERATO SNACK E BEVANDE (env-ost-reception-lounge)
      {
        machineKey: "distributore_snack_bevande_h24",
        name: "Distributore Automatico H24 Refrigerato per Snack e Bevande a Moneta/App",
        type: "Distributore Automatico Vending Blindato Refrigerato (+3°C) a Spirali",
        suggestedManufacturer: "Necta / Fas International / Sanden Vendo",
        suggestedModel: "Necta Festival Classic / Fas Fast 900 / Sanden Vendo G-Drink Design",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_VENDING_SNACK_BARRIERA_MANI",
            title: "Sportello Ritiro Prodotti con Paratia Meccanica Anti-Intrusione Mani",
            question: "Il vano inferiore di ritiro è munito di saracinesca o bandella basculante anti-intrusione conforme a UNI EN 60335-2-75 che impedisce l'accesso alle parti meccaniche e spirali motorizzate interne?",
            normReference: "UNI EN 60335-2-75 punto 20; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_VENDING_SNACK_ANCORAGGIO_PARETE",
            title: "Staffe di Ancoraggio Meccanico a Parete / Pavimento Antiribaltamento",
            question: "Il distributore è saldamente ancorato a parete o fissato a terra con staffe metalliche per prevenire il ribaltamento accidentale o provocato da tentativi di scuotimento da parte degli utenti?",
            normReference: "UNI EN 60335-2-75 punto 19; D.Lgs. 81/2008 All. IV p. 1.1 e art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_VENDING_SNACK_VETRO_STRATIFICATO",
            title: "Vetrata Frontale in Vetro di Sicurezza Antisfondamento / Stratificato",
            question: "La vetrina espositiva frontale è realizzata in vetro temperato o stratificato di sicurezza conforme alle norme antinfortunistiche, integra e priva di fessurazioni da impatto?",
            normReference: "UNI EN 12600; D.Lgs. 81/2008 All. IV p. 1.3.6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_VENDING_SNACK_TEMPERATURA_REFRIGERAZIONE",
            title: "Controllo Catena del Freddo (+3°C) e Blocco Vendita per Sovratemperatura",
            question: "La centralina frigorifera mantiene la temperatura interna a +3°C per i prodotti deperibili ed è provvista di blocco automatico della vendita in caso di interruzione prolungata della catena del freddo?",
            normReference: "Reg. CE 852/2004 All. II Cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 6. DISTRIBUTORE AUTOMATICO DI CAFFÈ ESPRESSO E BEVANDE CALDE (env-ost-reception-lounge)
      {
        machineKey: "distributore_caffe_bevande_calde",
        name: "Distributore Automatico di Caffè Espresso e Bevande Calde a Moneta/App",
        type: "Distributore Automatico Vending per Bevande Calde con Macinatore e Caldaia a Pressione",
        suggestedManufacturer: "Necta / Bianchi Vending / Rheavendors",
        suggestedModel: "Necta Canto Touch / Bianchi Vending Festa / Rheavendors Cino Grande",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_VENDING_CAFFE_CALDAIA_PED_SICUREZZA",
            title: "Caldaia a Pressione Certificata PED con Valvola di Sovrapressione e Termostato Limitatore",
            question: "La caldaia interna per l'acqua calda e vapore è certificata PED D.Lgs. 26/2016 ed è munita di valvola di sicurezza per sovrapressione a scarico controllato e termostato di blocco a riarmo manuale?",
            normReference: "D.Lgs. 26/2016 (Direttiva PED); D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_VENDING_CAFFE_BREAK_TANK_ANTI_REFLUSSO",
            title: "Dispositivo Break Tank con Disconnessione Idrica Anti-Reflusso UNI EN 1717",
            question: "Il raccordo alla rete idrica potabile è provvisto di serbatoio con battente d'aria a caduta (Break Tank) che rende fisicamente impossibile il riflusso di acqua della caldaia nella rete acquedottistica?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023 (Acque Potabili); D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_VENDING_CAFFE_EROGATORI_MOCA_IGIENE",
            title: "Condotti di Erogazione e Miscelatori Sanificabili Conformi MOCA",
            question: "I cannotti di scarico, le fruste di miscelazione dei solubili e i beccucci di erogazione sono realizzati in polimeri certificati per contatto alimentare MOCA e vengono regolarmente igienizzati contro muffe e biofilm?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004 All. II Cap. V",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_VENDING_CAFFE_VASCHETTA_TROPPAPIENO",
            title: "Sensore a Galleggiante Antiallagamento su Vaschetta Scarico Liquidi",
            question: "La vaschetta raccogligocce di fondo è collegata a microinterruttore a galleggiante che blocca l'erogazione di bevande al raggiungimento del livello massimo, evitando sversamenti sui pavimenti?",
            normReference: "CEI EN 60335-2-75; D.Lgs. 81/2008 All. IV p. 1.3.2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 7. LAVATRICE SELF-SERVICE A GETTONI / APP (env-ost-lavanderia-self)
      {
        machineKey: "lavatrice_selfservice_gettone",
        name: "Lavatrice Professionale a Carica Frontale con Gettoniera / Pagamento App (8-11 kg)",
        type: "Lavatrice Supercentrifugante Professionale a Gettoni / Cassa Centralizzata per Lavanderia Self-Service",
        suggestedManufacturer: "Primus / Speed Queen / Miele Professional",
        suggestedModel: "Primus RX80 Vended / Speed Queen SC020 / Miele Professional PWM 508 Vended",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_LAVATRICE_BLOCCO_OBBLO_RITARDATO",
            title: "Interblocco Elettromagnetico Temporizzato su Chiusura Oblò",
            question: "L'oblò di carico è provvisto di elettroserratura di sicurezza conforme a UNI EN ISO 10472-2 che impedisce l'apertura manuale finché il cestello è in rotazione e l'acqua calda supera i 50°C?",
            normReference: "UNI EN ISO 10472-2 punto 5.2; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_LAVATRICE_FISSAGGIO_ANTIVIBRANTE",
            title: "Ancoraggio Strutturale a Pavimento e Sensore Sbilanciamento Carico",
            question: "La macchina è saldamente imbullonata su basamento solido con tamponi antivibranti ed è provvista di sensore di sbilanciamento (out-of-balance) che riduce i giri o arresta la centrifuga se il carico non è distribuito?",
            normReference: "UNI EN ISO 10472-2 punto 5.3; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_LAVATRICE_SCARICO_FILTRO_ISPEZIONE",
            title: "Filtro Pompa di Scarico con Vano Ispezionabile da Personale Incaricato",
            question: "Il vano inferiore contenente il filtro della pompa di scarico e lo sblocco manuale d'emergenza è protetto da sportellino con chiave per impedire accessi non autorizzati da parte dell'utenza comune?",
            normReference: "UNI EN ISO 10472-2; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_LAVATRICE_COLLEGAMENTO_EQUIPOTENZIALE",
            title: "Protezione Differenziale Dedicata e Collegamento Equipotenziale in Ambiente Umido",
            question: "La linea di alimentazione in lavanderia è asservita a interruttore differenziale ad alta sensibilità (Idn <= 30 mA Tipo A/F) e il corpo macchina è connesso al circuito equipotenziale supplementare?",
            normReference: "CEI 64-8 Sezione 7; D.Lgs. 81/2008 art. 80 e 84",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 8. ASCIUGATRICE INDUSTRIALE A GETTONI (env-ost-lavanderia-self)
      {
        machineKey: "asciugatrice_selfservice_gettone",
        name: "Asciugatrice Industriale a Carica Frontale a Gettoni con Doppio Filtro Lanugine (8-10 kg)",
        type: "Essiccatore Rotativo Professionale Vended a Gettoni per Lavanderia Comunitaria",
        suggestedManufacturer: "Speed Queen / Miele Professional / Girbau",
        suggestedModel: "Speed Queen SD025 Vended / Miele Professional PDR 508 HP / Girbau ED260",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_ASCIUGATRICE_DOPPIO_FILTRO_LANUGINE",
            title: "Doppio Filtro Lanugine Estraibile e Manutenzione Antincendio Periodica",
            question: "L'asciugatrice è munita di filtro lanugine estraibile a maglia fitta, pulito regolarmente per evitare l'accumulo di cascami tessili combustibili a contatto con le resistenze o la pompa di calore?",
            normReference: "UNI EN ISO 10472-4 punto 5.5; D.M. 02/09/2021; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_ASCIUGATRICE_TERMOSTATO_MAX_RIARMO",
            title: "Termostato di Sicurezza di Massima Temperatura a Riarmo Manuale",
            question: "È installato a valle della batteria riscaldante un limitatore termico ridondante a riarmo manuale che toglie tensione alle resistenze in caso di sovratemperatura anomala o blocco del ventilatore?",
            normReference: "UNI EN ISO 10472-4 punto 5.2.2; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_ASCIUGATRICE_INTERBLOCCO_PORTELLO",
            title: "Arresto Istantaneo del Cestello e del Riscaldamento all'Apertura Sportello",
            question: "Il microinterruttore di sicurezza sullo sportello interrompe istantaneamente la rotazione del tamburo e disattiva la fonte di calore non appena l'utente apre il vano, escludendo rischi di trascinamento e ustione?",
            normReference: "UNI EN ISO 10472-4 punto 5.1; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_ASCIUGATRICE_CONDOTTO_ESALAZIONE_ARIA",
            title: "Canalizzazione di Scarico Aria Umida a Parete Esterna Priva di Ostruzioni",
            question: "Il canale di espulsione dell'aria esausta è realizzato in metallo rigido incombustibile, convogliato all'esterno senza curve strozzate e privo di depositi infiammabili di lanugine?",
            normReference: "D.M. 03/09/2021; D.M. 02/09/2021; D.Lgs. 81/2008 All. IV p. 1.9",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 9. ASSE DA STIRO PROFESSIONALE CON FERRO A CALDAIA (env-ost-lavanderia-self)
      {
        machineKey: "ferro_stiro_aspirante_comunitario",
        name: "Asse da Stiro Professionale Aspirante/Riscaldato con Ferro a Vapore Caldaia",
        type: "Postazione da Stiro Professionale per Ospiti con Caldaia a Pressione Separata",
        suggestedManufacturer: "Battistella / Bieffe / Lelit",
        suggestedModel: "Battistella Vaporino Maxi / Bieffe Farfalla / Lelit PS25 Comunitario",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_STIRO_CALDAIA_PED_VALVOLA_SICUREZZA",
            title: "Caldaia Inox Certificata PED con Valvola di Sovrapressione e Termostato Limitatore",
            question: "Il generatore di vapore a pressione in acciaio inox è conforme alla Direttiva PED D.Lgs. 26/2016 ed è munito di valvola di sicurezza tarata per sovrapressione e pressostato di lavoro efficiente?",
            normReference: "D.Lgs. 26/2016 (PED); D.Lgs. 81/2008 art. 71 c. 3 e All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_STIRO_TAPPO_SFIATO_ANTI_APERTURA",
            title: "Tappo di Sicurezza a Sfiato Graduale Anti-Apertura Sotto Pressione",
            question: "Il tappo di riempimento della caldaia è di tipo con sfiato controllato o valvola meccanica che impedisce lo svitamento rapido e lo schizzo di acqua bollente e vapore se la caldaia è in pressione?",
            normReference: "CEI EN 60335-2-3 punto 22.101; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_STIRO_FERRO_PARAVAPORE_SALVAMANI",
            title: "Impugnatura Ferro con Paravapore Salvamani e Tappetino Poggiaferro Siliconico",
            question: "Il ferro da stiro presenta schermo protettivo paravapore sull'impugnatura in sughero per proteggere la mano dal flusso di vapore, e appoggio su tappetino termoresistente in silicone ignifugo?",
            normReference: "CEI EN 60335-2-3 punto 19; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_STIRO_TIMER_SPEGNIMENTO_AUTOMATICO",
            title: "Timer o Dispositivo di Spegnimento Automatico per Inattività",
            question: "La postazione di stiro per ospiti è dotata di spegnimento automatico temporizzato (auto-off dopo 15-30 minuti di non utilizzo) per eliminare rischi di incendio in caso di abbandono?",
            normReference: "D.M. 02/09/2021; D.Lgs. 81/2008 art. 46 e art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 10. BATTERIA DI ARMADIETTI LOCKERS ELETTRONICI (env-ost-deposito-bagagli)
      {
        machineKey: "lockers_elettronici_bagagli",
        name: "Batteria di Armadietti Lockers Elettronici Automatizzati per Bagagli",
        type: "Batteria di Scomparti Portabagagli Modulari in Lamiera con Serratura Elettronica Automatizzata",
        suggestedManufacturer: "Keba / WIB Machines / Polieco",
        suggestedModel: "Keba KePol Locker / WIB Smart Locker Hotel / Polieco Modular Locker",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "OST_LOCKERS_FISSAGGIO_PARETE_ANTIRIBALTAMENTO",
            title: "Ancoraggio a Parete e a Pavimento Strutturale Antiribaltamento",
            question: "La colonna modulare di armadietti bagagli è saldamente ancorata a parete con tasselli strutturali o a pavimento per escludere qualsiasi ribaltamento in caso di carico sbilanciato o spinta?",
            normReference: "UNI EN 14073-2 punto 5.1; D.Lgs. 81/2008 All. IV p. 1.1 e art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_LOCKERS_SBLOCCO_EMERGENZA_BLACKOUT",
            title: "Sistema Meccanico Master di Sblocco Manuale d'Emergenza in Blackout",
            question: "In caso di interruzione prolungata dell'alimentazione elettrica o guasto del software, il responsabile della struttura dispone di chiave fisica master per l'apertura manuale istantanea degli scomparti?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_LOCKERS_BORDI_ANTITAGLIO_ARROTONDATI",
            title: "Bordi della Lamiera Raccordati, Privi di Sbavature e Spigoli Vivi Taglienti",
            question: "Tutti gli sportelli, le cerniere e gli angoli dei singoli vani presentano finiture ribattute o guarnizioni di protezione per impedire tagli o pizzicamento delle dita dell'utente durante l'accesso?",
            normReference: "UNI EN 14073-2 punto 5.2; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_LOCKERS_CIRCUITO_BASSA_TENSIONE",
            title: "Alimentazione Elettronica a Bassissima Tensione di Sicurezza (SELV)",
            question: "I moduli di controllo degli attuatori delle serrature operano a bassissima tensione di sicurezza (SELV 12V/24V DC), escludendo qualsiasi rischio di contatto con tensioni pericolose?",
            normReference: "CEI 64-8; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 11. ASPIRAPOLVERE PROFESSIONALE AD ALTA FILTRAZIONE HEPA (env-ost-dormitori-camerate, env-ost-camere-private)
      {
        machineKey: "aspirapolvere_battitappeto_hepa",
        name: "Aspirapolvere Professionale ad Alta Filtrazione HEPA H13 per Dormitori",
        type: "Aspirapolvere a Traino Silenziato con Filtro Assoluto HEPA H13 per Ambienti Collettivi",
        suggestedManufacturer: "Kärcher / Lindhaus / Taski",
        suggestedModel: "Kärcher T 12/1 eco!efficiency / Lindhaus Valzer 5 HEPA / Taski Aero 8 Plus",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_ostello,
        safetyChecks: [
          {
            code: "OST_ASPIRAPOLVERE_FILTRO_HEPA_H13",
            title: "Filtro Assoluto HEPA H13 Certificato UNI EN 1822 Contro Acari e Allergeni",
            question: "L'aspirapolvere è dotato di cartuccia filtrante HEPA classe H13 certificata con efficienza >= 99,95% integra e manutenuta, che blocca polveri fini, acari e microrganismi espulsi nei dormitori?",
            normReference: "UNI EN 1822; D.Lgs. 81/2008 Titolo X (Rischio Biologico) e art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_ASPIRAPOLVERE_CAVO_FLUORESCENTE_ANTINCIAMPO",
            title: "Cavo di Alimentazione Giallo Fluorescente ad Alta Visibilità Antinciampo",
            question: "Il cavo elettrico è ad alta visibilità (giallo/arancione fluorescente), integro lungo tutta la guaina senza nastrature, con passacavo antirottura su spina e corpo macchina?",
            normReference: "CEI EN 60335-2-69; D.Lgs. 81/2008 All. IV p. 1.3.2 e art. 80",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_ASPIRAPOLVERE_LIVELLO_RUMORE_ERGONOMIA",
            title: "Emissione Sonora Contenuta (< 62 dB(A)) e Tubo Telescopico Ergonomico",
            question: "Il motore a basso impatto acustico emette una pressione sonora < 62 dB(A) e il tubo di aspirazione è regolabile in altezza per garantire la corretta postura degli operatori housekeeping?",
            normReference: "UNI EN ISO 11226; D.Lgs. 81/2008 Titolo VIII Capo II (Rumore) e Titolo VI (MMC)",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_ASPIRAPOLVERE_DOPPIO_ISOLAMENTO_CLASSE_II",
            title: "Costruzione a Doppio Isolamento (Classe II) Senza Conduttore di Terra",
            question: "L'apparecchio è a doppio isolamento elettrico conforme a CEI EN 60335-1, con marchio CE e marcatura di classe II leggibile, protetto contro infiltrazioni di polvere e umidità?",
            normReference: "CEI EN 60335-1 punto 7; D.Lgs. 81/2008 Titolo III Capo III",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 12. LAVASCIUGA PAVIMENTI COMPATTA UOMO A TERRA A BATTERIA (env-ost-corridoi-scale-esodo, env-ost-deposito-housekeeping, env-ost-area-rifiuti)
      {
        machineKey: "lavasciuga_pavimenti_compatta_ostello",
        name: "Lavasciuga Pavimenti Uomo a Terra a Batteria per Corridoi e Aree Comuni",
        type: "Lavasciuga Pavimenti Uomo a Terra a Batteria agli Ioni di Litio per Piccoli/Medi Spazi",
        suggestedManufacturer: "Comac / Kärcher / Fimap",
        suggestedModel: "Comac Vispa 35 B / Kärcher BD 30/4 C Bp Pack / Fimap Genie B",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_ostello,
        safetyChecks: [
          {
            code: "OST_LAVASCIUGA_ASCIUGATURA_IMMEDIATA",
            title: "Asciugatura Istantanea Pavimento con Tergipavimento Parabolico Anti-Scivolamento",
            question: "La lama tergipavimento in para/poliuretano raccoglie completamente l'acqua lasciando la superficie immediatamente asciutta e calpestabile, eliminando il rischio scivolamento nei corridoi comuni?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3.2; CEI EN 60335-2-72",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_LAVASCIUGA_DISPOSITIVO_UOMO_PRESENTE",
            title: "Impugnatura di Comando con Dispositivo 'Uomo Presente' ad Arresto Istantaneo",
            question: "Il rilascio della leva di marcia sulla barra di guida disattiva immediatamente il motore spazzola e l'avanzamento, arrestando la macchina in sicurezza per proteggere terzi?",
            normReference: "CEI EN 60335-2-72 punto 20.103; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_LAVASCIUGA_BATTERIA_LITIO_CARICA",
            title: "Pacco Batterie al Litio Certificato e Ricarica in Area Ventilata",
            question: "La batteria sigillata al litio è dotata di circuito di protezione BMS integrato contro sovraccarichi/surriscaldamento e la stazione di ricarica è ubicata in locale asciutto e privo di combustibili?",
            normReference: "CEI EN 62133; D.Lgs. 81/2008 art. 80 e All. IV p. 1.11",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_LAVASCIUGA_SERBATOI_ESTRAIBILI_IGIENE",
            title: "Serbatoi Acqua Pulita e Recupero Completamente Ispezionabili e Sanificabili",
            question: "I serbatoi in polietilene antiurto sono facilmente estraibili, dotati di tubo di scarico flessibile e sanificati regolarmente per prevenire formazione di odori sgradevoli e cariche batteriche?",
            normReference: "D.Lgs. 81/2008 Titolo X e art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 13. CENTRALE TERMICA A CONDENSAZIONE CON ACCUMULO ACS E SHOCK ANTI-LEGIONELLA (env-ost-centrale-termica-acs)
      {
        machineKey: "caldaia_centrale_acs_legionella",
        name: "Centrale Termica a Condensazione con Accumulo ACS e Shock Termico Anti-Legionella",
        type: "Centrale Termica Murale/Basamento ad Alta Efficienza con Accumulo ACS e Ciclo Anti-Legionella Programmabile",
        suggestedManufacturer: "Viessmann / Vaillant / Atag",
        suggestedModel: "Viessmann Vitodens 200-W con Bollitore Vitocell / Vaillant ecoTEC plus VHR / Atag Q-Series",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.centrali_termiche_clima,
        safetyChecks: [
          {
            code: "OST_CALDAIA_CICLO_SHOCK_LEGIONELLA",
            title: "Programma Elettronico Automatico di Shock Termico Anti-Legionella (65°C)",
            question: "La centralina gestisce a cadenza periodica programmata il ciclo termico ad almeno 65°C per l'intero volume del bollitore e della rete di ricircolo ACS, per la disinfezione termica anti-legionella?",
            normReference: "Linee Guida per la Prevenzione ed il Controllo della Legionellosi (Accordo SR 07/05/2015); D.Lgs. 81/2008 Titolo X",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_CALDAIA_VALVOLA_SICUREZZA_VASO",
            title: "Valvola di Sicurezza Pressione e Vaso di Espansione Tarati e Raccordati a Scarico",
            question: "Il circuito idraulico è provvisto di valvola di sovrapressione (tarata a 3 bar) con scarico convogliato a vista e vaso di espansione a membrana con precarica verificata annualmente?",
            normReference: "D.M. 01/12/1975; Raccolta R INAIL; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_CALDAIA_ELETTROVALVOLA_GAS_ESTERNA",
            title: "Elettrovalvola di Intercettazione Rapida Gas Metano Esterna a Riarmo Manuale",
            question: "Sulla tubazione di adduzione gas all'esterno del locale è installata elettrovalvola NA/NC asservita a sensore fughe gas o pulsante d'emergenza esterno a riarmo manuale?",
            normReference: "D.M. 08/11/2019 (Impianti termici alimentati a gas); UNI 7129 / UNI 11528; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_CALDAIA_LIBRETTO_IMPIANTO_FUMI",
            title: "Libretto di Impianto Termico, Rapporto Efficienza Energetica e Scarico Fumi a Tetto",
            question: "Il libretto di impianto è aggiornato con le verifiche biennali dei fumi, tiraggio camino a norma UNI 10845 e manutenzione ordinaria registrata su catasto termico regionale?",
            normReference: "D.P.R. 74/2013; D.Lgs. 152/2006 Parte V; D.Lgs. 81/2008 art. 71 c. 8",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 14. CENTRALE DI RIVELAZIONE INCENDI E FUMI INDIRIZZATA CON EVAC (env-ost-reception-lounge, env-ost-dormitori-camerate, env-ost-camere-private, env-ost-corridoi-scale-esodo)
      {
        machineKey: "centrale_antincendio_indirizzata_ostello",
        name: "Centrale di Rivelazione Incendi e Fumi Indirizzata con Diffusori EVAC",
        type: "Impianto di Rivelazione Fumi Ottica e Allarme Vocale EVAC per Strutture Ricettive",
        suggestedManufacturer: "Notifier / Inim Electronics / Siemens Cerberus",
        suggestedModel: "Notifier AM-2000 / Inim SmartLight / Siemens Cerberus FIT",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_livello_2,
        safetyChecks: [
          {
            code: "OST_ANTINCENDIO_CENTRALE_INDIRIZZATA",
            title: "Rivelazione Fumi Ottica Indirizzata in Tutti i Dormitori, Camere e Vie di Fuga",
            question: "Tutti i vani notte, corridoi e locali tecnici sono coperti da sensori ottici di fumo indirizzati che identificano univocamente la stanza d'origine del principio d'incendio sul pannello centrale?",
            normReference: "UNI 9795; D.M. 09/04/1994 e D.M. 03/09/2021; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "OST_ANTINCENDIO_DIFFUSORI_EVAC_VOCALI",
            title: "Diffusori Acustici con Messaggi Vocali Multilingue di Evacuazione Guidata EVAC",
            question: "L'impianto EVAC conforme a UNI EN 54-16/24 diffonde chiaramente allarmi sonori e messaggi vocali preregistrati in italiano e inglese comprensibili in tutti i dormitori e parti comuni?",
            normReference: "UNI EN 54-16; UNI ISO 7240-19; D.Lgs. 81/2008 art. 43 e 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_ANTINCENDIO_BATTERIE_TAMPONE_24H",
            title: "Gruppo Batterie Tampone di Emergenza con Autonomia Minima 24h + 30 min Allarme",
            question: "L'alimentatore ausiliario è equipaggiato con accumulatori al piombo sigillati in grado di mantenere operativo il sistema per almeno 24 ore in assenza di rete e garantire 30 minuti di allarme generale?",
            normReference: "UNI EN 54-4; CEI 20-105; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_ANTINCENDIO_MANUTENZIONE_SEMESTRALE_11224",
            title: "Registro Antincendio e Manutenzione Semestrale Certificata ex UNI 11224",
            question: "L'impianto è sottoposto a sorveglianza periodica con prove semestrali di sgancio e attivazione sensori eseguite da ditta abilitata e annotate sul registro antincendio aziendale?",
            normReference: "UNI 11224; D.M. 01/09/2021 (Decreto Controlli); D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 15. PORTE TAGLIAFUOCO EI 30 / EI 60 CON CHIUDIPORTA E MANIGLIONI ANTIPANICO (env-ost-corridoi-scale-esodo)
      {
        machineKey: "porte_tagliafuoco_chiudiporta_ostello",
        name: "Porte Tagliafuoco EI 30 / EI 60 con Maniglione Antipanico e Chiudiporta Idraulico",
        type: "Porte Metalliche Tagliafuoco per Compartimentazione Piani, Dormitori e Uscite di Sicurezza",
        suggestedManufacturer: "Dierre / Ninz / Novoferm",
        suggestedModel: "Ninz Proget EI 60 / Dierre New Idra EI 30/60 / Novoferm NovoPorta Premio",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_livello_2,
        safetyChecks: [
          {
            code: "OST_TAGLIAFUOCO_CHIEUDIPORTA_IDRAULICO",
            title: "Chiudiporta Idraulico Conforme UNI EN 1154 con Completo Accostamento all'Arresto",
            question: "Ciascuna porta tagliafuoco di compartimentazione è dotata di dispositivo di autochiusura (chiudiporta) conforme a UNI EN 1154 perfettamente regolato, che garantisce l'accostamento e lo scatto dello scrocco?",
            normReference: "UNI EN 1154; D.M. 01/09/2021; D.Lgs. 81/2008 All. IV p. 1.5 e art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_TAGLIAFUOCO_MANIGLIONE_ANTIPANICO",
            title: "Maniglioni Antipanico Conforme UNI EN 1125 su Tutte le Uscite di Piano e Scale",
            question: "Le porte situate lungo le vie di fuga e le uscite di sicurezza verso scale d'esodo si aprono nel verso dell'esodo mediante semplice pressione su maniglione antipanico conforme a UNI EN 1125?",
            normReference: "UNI EN 1125; D.M. 03/09/2021; D.Lgs. 81/2008 All. IV p. 1.5.5",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "OST_TAGLIAFUOCO_GUARNIZIONI_TERMOESPANDENTI",
            title: "Integrità Guarnizioni Termoespandenti Perimetrali Tagliafumo",
            question: "Le guarnizioni termoespandenti perimetrali sul telaio e sull'anta sono integre, continue, non verniciate né staccate, garantendo la tenuta ai fumi freddi e caldi in caso di incendio?",
            normReference: "UNI EN 1634-1; UNI 11473-1; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_TAGLIAFUOCO_LIBERTA_INGOMBRO_CUNEO",
            title: "Divieto Assoluto di Bloccare le Ante con Cunei o Fermi Meccanici Impropri",
            question: "Le ante delle porte REI non sono mai bloccate aperte mediante cunei, fermaporta artigianali o arredi che ne impediscano l'immediata chiusura tagliafuoco e tagliafumo in caso di fumo o allarme?",
            normReference: "D.M. 01/09/2021; D.M. 02/09/2021; D.Lgs. 81/2008 All. IV p. 1.5",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
        ],
      },

      // 16. CARRELLO HOUSEKEEPING MULTITASCHE PROFESSIONALE (env-ost-servizi-igienici-comuni, env-ost-deposito-housekeeping, env-ost-area-rifiuti)
      {
        machineKey: "carrello_housekeeping_multitasche",
        name: "Carrello Housekeeping Professionale per Biancheria Dormitori e Igiene",
        type: "Carrello Professionale per Servizio Piani con Moduli Chiusi a Chiave e Supporti Ergonomici",
        suggestedManufacturer: "TTS Cleaning / Filmop / IPC Brix",
        suggestedModel: "TTS Magic Hotel 800 / Filmop Morgan Hotel / IPC Brix Green Care",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_ostello,
        safetyChecks: [
          {
            code: "OST_CARRELLO_SEPARAZIONE_BIANCHERIA",
            title: "Netta Separazione Fisica tra Biancheria Sporca e Pulita Contro Contaminazioni",
            question: "Il carrello prevede sacchi portabiancheria separati e chiusi con coperchio per la biancheria usata e vani sigillati per la biancheria pulita, prevenendo qualsiasi contaminazione crociata nei dormitori?",
            normReference: "Reg. CE 852/2004; D.Lgs. 81/2008 Titolo X (Agenti Biologici) e art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "OST_CARRELLO_VANO_CHIMICO_CHIAVE",
            title: "Scomparto Portadetergenti e Disinfettanti Chiuso a Chiave Contro Usi Indebiti",
            question: "I flaconi di detergenti professionali concentrati e prodotti igienizzanti sono alloggiati in cassetto chiuso con serratura a chiave per impedire accessi non autorizzati o ingestioni accidentali da parte degli ospiti?",
            normReference: "D.Lgs. 81/2008 Titolo IX Capo I (art. 223-228 Agenti Chimici); Reg. CE 1272/2008 (CLP)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "OST_CARRELLO_RUOTE_FRENO_STAZIONAMENTO",
            title: "Ruote Piroettanti Antitraccia con Freno di Stazionamento a Pedale",
            question: "Il carrello è dotato di ruote gommate ad alta scorrevolezza con freno di stazionamento a pedale perfettamente efficiente su entrambe le ruote anteriori per bloccarlo in pendenza o lungo i corridoi?",
            normReference: "UNI EN ISO 11228-2 (Spinta e Traino); D.Lgs. 81/2008 Titolo VI e All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "OST_CARRELLO_MANIGLIONE_ERGONOMICO_MMC",
            title: "Maniglione di Spinta ad Altezza Ergonomica (ISO 11228-2)",
            question: "Il maniglione di spinta è situato a quota ergonomica (tra 90 e 105 cm da terra) con impugnatura anatomica che rispetta le forze limite di spinta e traino previste dalle norme per la prevenzione dei disturbi muscolo-scheletrici?",
            normReference: "UNI EN ISO 11228-2; D.Lgs. 81/2008 art. 167-168 e All. XXXIII",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },
    ],
  },

  // ATECO 55.20.51, 55.20.5, 55.20, 55.2 (Bed & Breakfast, Affittacamere per brevi soggiorni, Guest House, Case Vacanze e Room Rental)
  {
    sectorKey: "bnb_affittacamere",
    sectorLabel: "Bed & Breakfast, Affittacamere, Guest House e Room Rental",
    atecoPrefixes: ["55.20.51", "55.20.5", "55.20", "55.2"],
    machines: [
      // 1. MACCHINA AUTOMATICA PER CAFFÈ ESPRESSO E CAPPUCCINO DA BUFFET (env-bnb-sala-colazioni)
      {
        machineKey: "macchina_caffe_capsule_grani_bnb",
        name: "Macchina Automatica per Caffè Espresso e Cappuccino da Buffet",
        type: "Macchina Espresso Automatica Professionale a Grani/Capsule con Cappuccinatore",
        suggestedManufacturer: "De Longhi / Saeco / Jura",
        suggestedModel: "De Longhi Magnifica S / Saeco Royal OTC / Jura E8",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.haccp_colazioni_extra_alberghiere,
        safetyChecks: [
          {
            code: "BNB_CAFFE_LANCIA_VAPORE_LAVAGGIO_TERMICO",
            title: "Lancia Vapore/Cappuccinatore con Ciclo Lavaggio Termico Automatico e Protezione Scottature",
            question: "La lancia vapore e il circuito cappuccinatore automatico sono dotati di guaina termoisolata antiscottatura (cool-touch) e di programma automatico di risciacquo termico a vapore dopo ogni erogazione per prevenire contaminazioni batteriche da residui di latte?",
            normReference: "Reg. CE 852/2004 All. II Cap. V; D.Lgs. 81/2008 All. V p. 6; CEI EN 60335-2-75",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CAFFE_SERBATOIO_MOCA_SANIFICABILE",
            title: "Serbatoio Acqua Estraibile Sanificabile Conforme MOCA Reg. CE 1935/2004",
            question: "Il serbatoio dell'acqua e i componenti a contatto con gli alimenti sono realizzati in materiali conformi MOCA (Reg. CE 1935/2004), facilmente estraibili per la sanificazione giornaliera e protetti contro il ristagno e la formazione di biofilm?",
            normReference: "Reg. CE 1935/2004; D.Lgs. 29/2017; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CAFFE_TERMOSTATO_SICUREZZA_SOVRAPRESSIONE",
            title: "Termostato di Sicurezza a Riarmo e Valvola di Sovrapressione Idraulica",
            question: "La caldaia interna è dotata di termostato di sicurezza a riarmo per prevenire il surriscaldamento a secco e di valvola di sovrapressione conforme alla Direttiva PED per evitare sovrapressioni accidentali nel circuito idraulico?",
            normReference: "D.Lgs. 26/2016 (PED); CEI EN 60335-2-75; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CAFFE_MESSA_A_TERRA_INTERRUTTORE_IPX1",
            title: "Messa a Terra di Protezione e Interruttore Bipolare con Grado IPX1",
            question: "L'apparecchio è collegato a presa con conduttore di protezione di terra efficiente, cavo integro privo di giunzioni e interruttore generale bipolare protetto dall'ingresso di gocce o schizzi d'acqua (grado minimo IPX1)?",
            normReference: "CEI 64-8; CEI EN 60335-1; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 2. SET ELETTRICO BUFFET: BOLLITORE ACQUA RAPIDO E TOSTAPANE A PINZE/NASTRO (env-bnb-sala-colazioni)
      {
        machineKey: "bollitore_tostapane_buffet_bnb",
        name: "Set Elettrico Buffet: Bollitore Acqua Rapido e Tostapane a Pinze/Nastro",
        type: "Apparecchiature Elettriche da Banco per Buffet Colazioni (Bollitore e Tostapane)",
        suggestedManufacturer: "Smeg / Sirman / Dualit",
        suggestedModel: "Dualit Classic 4 fette / Sirman Tostapane / Smeg KLF03",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.haccp_colazioni_extra_alberghiere,
        safetyChecks: [
          {
            code: "BNB_BOLLITORE_SPEGNIMENTO_AUTO_SECCO",
            title: "Spegnimento Automatico a Ebollizione e Protezione Funzionamento a Secco",
            question: "Il bollitore rapido in acciaio inox è provvisto di sistema di spegnimento automatico al raggiungimento dell'ebollizione (100°C) e di termostato di blocco di sicurezza contro l'accensione accidentale a secco privo d'acqua?",
            normReference: "CEI EN 60335-2-15; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_TOSTAPANE_CASSETTO_BRICIOLE_ESTRAIBILE",
            title: "Cassetto Raccoglibriciole Estraibile per Prevenzione Innesco Fumi e Incendi",
            question: "Il tostapane è provvisto di vassoio/cassetto inferiore raccoglibriciole estraibile per la pulizia quotidiana, al fine di evitare accumuli carboniosi soggetti a surriscaldamento, fumi tossici e innesco di principi d'incendio?",
            normReference: "D.M. 02/09/2021; D.Lgs. 81/2008 art. 46; CEI EN 60335-2-48",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_BUFFET_ISOLAMENTO_TERMICO_COOL_TOUCH",
            title: "Pareti Esterne Termoisolate Cool-Touch e Pinze con Impugnature Fredde",
            question: "Gli apparecchi presentano carter esterni con isolamento termico a pareti fredde (cool-touch) e pinze con manici in materiale atermico per prevenire scottature e ustioni accidentali durante l'uso da parte degli ospiti o del personale?",
            normReference: "UNI EN ISO 13732-1; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_SET_BUFFET_CONFORMITA_MOCA_ALIMENTARE",
            title: "Certificazione Idoneità al Contatto Alimentare MOCA Reg. CE 1935/2004",
            question: "Tutti i componenti a contatto con pane e acqua (caraffa inox, resistenze, pinze e griglie tostapane) dispongono di dichiarazione di conformità MOCA (Reg. CE 1935/2004 e D.M. 21/03/1973) per assenza di cessione di metalli pesanti o sostanze nocive?",
            normReference: "Reg. CE 1935/2004; D.M. 21/03/1973; D.Lgs. 29/2017",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 3. MINI-VETRINA REFRIGERATA DA BANCO O FRIGOBAR ESPOSITORE PER COLAZIONI (+4°C) (env-bnb-sala-colazioni)
      {
        machineKey: "vetrina_refrigerata_snack_bnb",
        name: "Mini-Vetrina Refrigerata da Banco o Frigobar Espositore per Colazioni (+4°C)",
        type: "Vetrina Espositiva Refrigerata Positiva da Banco (+2°C / +8°C)",
        suggestedManufacturer: "Liebherr / Polar / Forcar",
        suggestedModel: "Liebherr FKv 503 / Polar C-Series 68L / Forcar VGP",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.haccp_colazioni_extra_alberghiere,
        safetyChecks: [
          {
            code: "BNB_VETRINA_TERMOSTATO_DIGITALE_DISPLAY_HACCP",
            title: "Termostato Digitale con Display di Temperatura Visibile e Allarme HACCP (+4°C)",
            question: "La mini-vetrina dispone di display digitale esterno per la lettura costante della temperatura interna (+2°C / +4°C) per la verifica della catena del freddo di yogurt, latte e formaggi come prescritto dal manuale HACCP?",
            normReference: "Reg. CE 852/2004 All. II Cap. IX; D.Lgs. 193/2007",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_VETRINA_DOPPIO_VETRO_TEMPERATO_SICUREZZA",
            title: "Porta a Doppio Vetro Temperato di Sicurezza con Guarnizione Magnetica",
            question: "La porta vetrata è realizzata in vetro temperato di sicurezza contro urti accidentali e frammentazione pericolosa, dotata di guarnizione magnetica perimetrale integra a perfetta tenuta termica?",
            normReference: "UNI EN 12150; D.Lgs. 81/2008 All. IV p. 1.3; All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_VETRINA_GAS_ECOLOGICO_R600A_R290",
            title: "Circuito Frigorifero Ermetico con Gas Naturale Ecologico R600a/R290",
            question: "Il circuito sigillato utilizza gas refrigerante naturale ecologico a bassissimo impatto GWP (R600a isobutano o R290 propano) con etichettatura di sicurezza e carter protettivo del motocompressore privo di accumuli di polvere?",
            normReference: "Reg. UE 517/2014; CEI EN 60335-2-89; D.Lgs. 81/2008 Titolo XI",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_VETRINA_SBRINAMENTO_AUTOMATICO_CONDENSA",
            title: "Sbrinamento Automatico con Evaporazione Condensa senza Ristagno Batterico",
            question: "Il sistema prevede ciclo di sbrinamento automatico con vaschetta di raccolta e smaltimento condensa priva di ristagni idrici caldi favorevoli a muffe e colonizzazione microbica?",
            normReference: "Reg. CE 852/2004 All. II Cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 4. SPREMIAGRUMI ELETTRICO PROFESSIONALE COMPATTO DA BUFFET (env-bnb-sala-colazioni)
      {
        machineKey: "spremiagrumi_centrifuga_compatta",
        name: "Spremiagrumi Elettrico Professionale Compatto da Buffet",
        type: "Spremiagrumi Elettrico Professionale a Leva da Banco",
        suggestedManufacturer: "Ceado / Santos / Sirman",
        suggestedModel: "Ceado S98 / Santos 11 / Sirman Apollo Lever",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.haccp_colazioni_extra_alberghiere,
        safetyChecks: [
          {
            code: "BNB_SPREMIAGRUMI_MICROINTERRUTTORE_LEVA_UNI12852",
            title: "Microinterruttore di Sicurezza su Leva Pressore Conforme UNI EN 12852",
            question: "La leva pressore è asservita a microinterruttore di sicurezza elettromeccanico che arresta la rotazione della pigna conica all'apertura o al sollevamento della leva, impedendo il contatto accidentale delle dita con organi in moto?",
            normReference: "UNI EN 12852:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_SPREMIAGRUMI_COMPONENTI_INOX_MOCA_SMONTABILI",
            title: "Vasca Raccoglisucco, Pigna e Filtro in Acciaio Inox MOCA Estraibili",
            question: "Tutti i componenti a contatto con agrumi e succhi (vaschetta, pigna, filtro setaccio) sono in acciaio inox o resine MOCA (Reg. CE 1935/2004), smontabili manualmente senza attrezzi per il lavaggio giornaliero?",
            normReference: "Reg. CE 1935/2004; UNI EN 1672-2; D.Lgs. 29/2017",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_SPREMIAGRUMI_STABILITA_BASAMENTO_VENTOSE",
            title: "Basamento Stabile Pesante con Piedini a Ventosa Antiscivolo",
            question: "Il corpo macchina dispone di basamento metallico zavorrato con piedini in gomma a ventosa per evitare spostamenti, scivolamenti o ribaltamenti accidentali sul banco buffet durante la pressione della leva?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; All. V p. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_SPREMIAGRUMI_PROTEZIONE_TERMICA_MOTORE",
            title: "Protezione Termica Salvamotore Contro Surriscaldamento da Blocco",
            question: "Il motore elettrico a servizio continuo è dotato di sonda termica salvamotore con arresto automatico contro il surriscaldamento in caso di forzatura meccanica o blocco del cono?",
            normReference: "CEI EN 60335-2-64; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 5. LAVASTOVIGLIE CON CICLO IGIENIZZANTE AD ALTA TEMPERATURA (75-80°C) (env-bnb-kitchenette-office)
      {
        machineKey: "lavastoviglie_termodisinfezione_bnb",
        name: "Lavastoviglie con Ciclo Igienizzante ad Alta Temperatura (75-80°C)",
        type: "Lavastoviglie Sottobanco Professionale con Termodisinfezione HACCP",
        suggestedManufacturer: "Miele Professional / Electrolux Professional / Krupps",
        suggestedModel: "Miele Professional PFD 101 U / Electrolux Profline / Krupps K540E",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.haccp_colazioni_extra_alberghiere,
        safetyChecks: [
          {
            code: "BNB_LAVASTOVIGLIE_RISCIACQUO_ALTA_TEMP_DIN10512",
            title: "Ciclo Igienizzante con Risciacquo ad Alta Temperatura (>= 75-80°C) DIN 10512",
            question: "La lavastoviglie garantisce un ciclo termico con boiler di risciacquo ad alta temperatura a non meno di 75-80°C conforme alla norma DIN 10512 per la completa termodisinfezione e distruzione della flora microbica su piatti, tazze e posate?",
            normReference: "DIN 10512; Reg. CE 852/2004; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVASTOVIGLIE_ACQUASTOP_ANTIALAGAMENTO",
            title: "Sensore Antiallagamento Acquastop con Doppia Elettrovalvola di Blocco",
            question: "Il tubo di carico e la base dell'apparecchio sono equipaggiati con dispositivo di sicurezza antiallagamento Acquastop e vasca inferiore con galleggiante di blocco immediato dell'afflusso idrico in caso di perdite?",
            normReference: "CEI EN 61770; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVASTOVIGLIE_MICROINTERRUTTORE_PORTA_BLOCCO",
            title: "Microinterruttore di Sicurezza Porta con Arresto Immediato Getti Caldi",
            question: "La porta anteriore è provvista di microinterruttore di sicurezza che interrompe istantaneamente il funzionamento della pompa di lavaggio e dei getti ad alta temperatura in caso di apertura accidentale durante il ciclo?",
            normReference: "UNI EN 1717; CEI EN 60335-2-58; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVASTOVIGLIE_FILTRO_MICROFORATO_VASCA_INOX",
            title: "Filtro Vasca Microforato in Acciaio Inox e Dosatori Automatici Detergente",
            question: "La vasca di lavaggio è dotata di triplo filtro microforato inox per trattenere frammenti solidi e dosatori peristaltici automatici per detergente e brillantante con tubazioni chimicamente resistenti?",
            normReference: "Reg. CE 852/2004; D.Lgs. 81/2008 Titolo IX",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 6. FORNO A MICROONDE PROFESSIONALE COMBINATO CON GRILL PER RISCALDO PASTI (env-bnb-kitchenette-office)
      {
        machineKey: "forno_microonde_grill_bnb",
        name: "Forno a Microonde Professionale Combinato con Grill per Riscaldo Pasti",
        type: "Forno a Microonde Professionale ad Uso Commerciale Intenso a Fondo Fisso Ceramico",
        suggestedManufacturer: "Panasonic / Samsung Commercial / Sirman",
        suggestedModel: "Panasonic NE-1027 / Samsung Commercial CM1089 / Sirman Panasonic",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.haccp_colazioni_extra_alberghiere,
        safetyChecks: [
          {
            code: "BNB_MICROONDE_DOPPIO_INTERBLOCCO_PORTA",
            title: "Doppio Interblocco di Sicurezza Porta Contro Emissioni Microonde Accidentali",
            question: "La porta è equipaggiata con doppio interblocco meccanico ed elettrico ridondante che disattiva istantaneamente il magnetron all'apertura, garantendo assenza di fughe di radiazione elettromagnetica a radiofrequenza (< 5 mW/cm²)?",
            normReference: "CEI EN 60335-2-90; D.Lgs. 81/2008 Titolo VIII Capo IV (Campi Elettromagnetici)",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BNB_MICROONDE_CAMERA_INOX_SENZA_PIATTO_GIREVOLE",
            title: "Camera Interna Inox Priva di Piatto Girevole a Fondo Fisso Ceramico",
            question: "La camera interna di riscaldo è realizzata in acciaio inox liscio priva di piatto girevole, con piano inferiore in ceramica sigillata per impedire l'infiltrazione di liquidi e facilitare la disinfezione HACCP?",
            normReference: "Reg. CE 852/2004; UNI EN 1672-2; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_MICROONDE_FILTRI_ARIA_FERMO_TERMICO",
            title: "Feritoie di Ventilazione e Filtri Aria Puliti con Termostato di Sovratemperatura",
            question: "Le feritoie di ventilazione e i filtri di aspirazione aria del circuito di raffreddamento magnetron sono mantenuti costantemente sgombri e puliti con termostato di protezione contro i surriscaldamenti anomali?",
            normReference: "CEI EN 60335-2-90; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_MICROONDE_GUARNIZIONI_PORTA_INTEGRE",
            title: "Guarnizioni Porta Integre e Assenza di Deformazioni o Fughe Elettromagnetiche",
            question: "Le guarnizioni perimetrali di tenuta della porta e la rete metallica dello schermo frontale sono perfettamente integre, prive di fessurazioni, sporco indurito o bruciature che possano compromettere la schermatura?",
            normReference: "CEI EN 60335-2-90; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 7. LAVATRICE PROFESSIONALE A CARICA FRONTALE CON PROGRAMMA VAPORE IGIENIZZANTE (8-11 KG) (env-bnb-lavanderia-office)
      {
        machineKey: "lavatrice_vapore_igienizzante_bnb",
        name: "Lavatrice Professionale a Carica Frontale con Programma Vapore Igienizzante (8-11 kg)",
        type: "Lavatrice Professionale a Carica Frontale con Ciclo Termico Vapore Sanificante",
        suggestedManufacturer: "Miele Professional / LG Commercial / Electrolux Professional",
        suggestedModel: "Miele Professional PWM 300 / LG Commercial Giant C+ / Electrolux MyPRO",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_bnb,
        safetyChecks: [
          {
            code: "BNB_LAVATRICE_BLOCCO_ELETTROMAGNETICO_OBLO",
            title: "Blocco di Sicurezza Elettromagnetico dell'Oblò a Cestello in Movimento",
            question: "L'oblò di carico è provvisto di elettroserratura con blocco di sicurezza che impedisce l'apertura manuale durante tutte le fasi del ciclo e fino all'arresto completo del cestello e allo scarico dell'acqua bollente?",
            normReference: "UNI EN ISO 10472-2; CEI EN 60335-2-7; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVATRICE_CICLO_TERMICO_VAPORE_60_90C",
            title: "Ciclo Termico Certificato a 60°/90°C con Programma Vapore Igienizzante",
            question: "La macchina è provvista di programmi con mantenimento termico prolungato a 60°/90°C o vapore igienizzante per garantire l'eliminazione di agenti biologici, acari e batteri da lenzuola, tovaglie e asciugamani degli ospiti?",
            normReference: "D.Lgs. 81/2008 Titolo X (Agenti Biologici); Linee Guida Sanificazione Tessili",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVATRICE_CONTROLLO_SBILANCIAMENTO_CARICO",
            title: "Controllo Elettronico Sbilanciamento Carico con Sensori 3D in Centrifuga",
            question: "È presente un sistema elettronico di rilevamento dello sbilanciamento del carico in centrifuga con riduzione automatica dei giri o ridistribuzione per prevenire vibrazioni pericolose e spostamenti fisici dell'apparecchio?",
            normReference: "CEI EN 60335-2-7; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVATRICE_ACQUASTOP_SCARICO_CONVOGLIATO",
            title: "Tubo di Carico con Valvola Acquastop e Scarico Convogliato a Tenuta",
            question: "Il flessibile di alimentazione idrica è protetto con valvola Acquastop e lo scarico delle acque calde saponose è raccordato a tenuta alla rete fognaria per prevenire allagamenti e scivolamenti nell'ambiente lavanderia?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3; art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 8. ASCIUGATRICE A POMPA DI CALORE AD ALTA EFFICIENZA CON FILTRO LANUGINE (8-10 KG) (env-bnb-lavanderia-office)
      {
        machineKey: "asciugatrice_pompa_calore_bnb",
        name: "Asciugatrice a Pompa di Calore ad Alta Efficienza con Filtro Lanugine (8-10 kg)",
        type: "Asciugatrice a Pompa di Calore Professionale per Strutture Ricettive",
        suggestedManufacturer: "Miele Professional / Bosch Commercial / LG Commercial",
        suggestedModel: "Miele Professional PDR 300 / Bosch Commercial Serie 8 / LG Commercial Titan",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_bnb,
        safetyChecks: [
          {
            code: "BNB_ASCIUGATRICE_DOPPIO_FILTRO_LANUGINE_ALLARME",
            title: "Doppio Filtro Lanugine con Allarme Visivo Intasamento Prevenzione Incendi",
            question: "L'essiccatore è dotato di doppio filtro estraibile per la lanugine tessile e di sensore con allarme acustico/visivo di pulizia per prevenire il surriscaldamento interno e il pericolo di innesco incendio da fibre secche?",
            normReference: "D.M. 02/09/2021; UNI EN ISO 10472-4; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ASCIUGATRICE_SENSORE_UMIDITA_RESIDUA",
            title: "Sensore Elettronico di Umidità Residua e Ciclo di Raffreddamento Antipiega",
            question: "La macchina dispone di controllo elettronico dell'asciugatura con sensori di umidità residua che arrestano il riscaldamento a tempo debito, completando il ciclo con fase di raffreddamento a freddo per evitare shock termici ai tessuti?",
            normReference: "CEI EN 60335-2-11; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ASCIUGATRICE_INTERBLOCCO_PORTELLO_CARICO",
            title: "Interblocco di Sicurezza all'Apertura Portello con Arresto Immediato Tamburo",
            question: "L'apertura dello sportello frontale durante il funzionamento arresta istantaneamente la rotazione del tamburo e la ventilazione forzata entro 2 secondi per la protezione fisica dell'operatore?",
            normReference: "UNI EN ISO 10472-4; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ASCIUGATRICE_SCARICO_CONDENSA_O_VASCHETTA",
            title: "Canalizzazione Scarico Condensa a Tenuta o Serbatoio con Galleggiante di Pieno",
            question: "La condensa prodotta dalla pompa di calore è smaltita mediante tubazione a scarico continuo oppure raccolta in vaschetta con microinterruttore di arresto a serbatoio pieno per prevenire fuoriuscite sul pavimento?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1.3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 9. ASSE DA STIRO PROFESSIONALE ASPIRANTE/RISCALDATO CON GENERATORE DI VAPORE A CALDAIA (env-bnb-lavanderia-office)
      {
        machineKey: "ferro_generatore_vapore_caldaia",
        name: "Asse da Stiro Professionale Aspirante/Riscaldato con Generatore di Vapore a Caldaia",
        type: "Sistema Stirante Professionale con Caldaia a Vapore e Piano Aspirante/Riscaldato",
        suggestedManufacturer: "Battistella / Lelit / Bieffe",
        suggestedModel: "Battistella Vaporino / Lelit PS25 / Bieffe",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_bnb,
        safetyChecks: [
          {
            code: "BNB_STIRO_CALDAIA_PED_PRESSOSTATO_VALVOLA",
            title: "Caldaia Rame/Inox Certificata PED con Pressostato e Valvola di Sicurezza a Riarmo",
            question: "Il generatore di vapore a caldaia è costruito in rame/inox con certificazione PED (D.Lgs. 26/2016), dotato di pressostato di lavoro e valvola di sicurezza meccanica a riarmo contro sovrapressioni accidentali?",
            normReference: "D.Lgs. 26/2016 (PED); CEI EN 60335-2-3; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_STIRO_TAPPO_SICUREZZA_ANTI_SVITAMENTO",
            title: "Tappo Caldaia di Sicurezza con Valvola di Sfiato Depressurizzazione a Caldo",
            question: "Il tappo di riempimento della caldaia è di tipo conico di sicurezza con valvola di sfiato interna che impedisce lo svitamento o l'espulsione improvvisa di getti di vapore bollente fintanto che permane pressione interna?",
            normReference: "CEI EN 60335-2-3; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_STIRO_FERRO_PARAVAPORE_PIASTRA_ISOLATA",
            title: "Ferro da Stiro Industriale con Impugnatura in Sughero e Schermo Paravapore Salvamani",
            question: "Il ferro da stiro presenta impugnatura anatomica in sughero termoisolante, piastra in alluminio pressofuso con resistenze corazzate, schermo paravapore salvamani e appoggiagetto in silicone termoresistente ignifugo?",
            normReference: "UNI EN ISO 13732-1; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_STIRO_PIANO_ASPIRANTE_RISCALDATO_PEDALE",
            title: "Asse Aspirante/Riscaldato con Comando a Pedale Bassa Tensione e Termostato",
            question: "Il tavolo da stiro dispone di piano riscaldato regolabile termostaticamente, aspirazione fumi/vapore azionata da pedaliera ergonomica e telaio robusto con blocco di sicurezza contro la chiusura accidentale dell'asse?",
            normReference: "D.Lgs. 81/2008 Titolo VI (MMC ed Ergonomia); CEI 64-8",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 10. ASPIRAPOLVERE / BATTITAPPETO SILENZIOSO CON FILTRO HEPA H13 PER CAMERE (env-bnb-camere-ospiti, env-bnb-bagni-privati)
      {
        machineKey: "aspirapolvere_filtro_hepa_bnb",
        name: "Aspirapolvere / Battitappeto Silenzioso con Filtro HEPA H13 per Camere",
        type: "Aspirapolvere Professionale per Camere e Moquette ad Alta Filtrazione HEPA H13",
        suggestedManufacturer: "Lindhaus / Kärcher / Numatic",
        suggestedModel: "Lindhaus Valzer / Kärcher T 12/1 / Numatic Henry",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_bnb,
        safetyChecks: [
          {
            code: "BNB_ASPIRAPOLVERE_FILTRO_HEPA_H13_ALLERGENI",
            title: "Filtro Assoluto HEPA H13 Certificato UNI EN 1822 per Trattenimento Allergeni e Polveri",
            question: "L'aspirapolvere è equipaggiato con stadio di filtrazione finale HEPA H13 conforme a UNI EN 1822 con efficienza di ritenzione >= 99,95% per pollini, acari della polvere e polveri sottili nelle camere ospiti?",
            normReference: "UNI EN 1822; D.Lgs. 81/2008 Titolo IX (Agenti Chimici) e Titolo X",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ASPIRAPOLVERE_BASSO_LIVELLO_SONORO_65DB",
            title: "Bassa Emissione Acustica (< 65 dB(A)) a Tutela dell'Operatore e Degli Ospiti",
            question: "La rumorosità dell'apparecchio durante l'uso continuativo è inferiore a 65 dB(A) a norma D.Lgs. 81/08 Titolo VIII Capo II per prevenire affaticamento uditivo dell'operatore e disturbo nelle aree ricettive?",
            normReference: "D.Lgs. 81/2008 Titolo VIII Capo II (Rumore); UNI EN ISO 4871",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ASPIRAPOLVERE_CAVO_ALTA_VISIBILITA_GANCIO",
            title: "Cavo Elettrico ad Alta Visibilità con Gancio Salvastrappo e Doppio Isolamento",
            question: "Il cavo flessibile di alimentazione è di colore ad alta visibilità per prevenire inciampi nei corridoi/camere, integro e munito di attacco pressacavo antistrappo e doppio isolamento elettrico di Classe II?",
            normReference: "CEI 64-8; CEI EN 60335-2-69; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ASPIRAPOLVERE_SACCO_SIGILLATO_SOVRATEMP",
            title: "Sacco Microfibra a Chiusura Ermetica e Protezione Termica Sovratemperatura Motore",
            question: "Il sacco di raccolta polveri è in microfibra multistrato con chiusura a collare ermetico autosigillante per lo smaltimento senza dispersione di polveri e il motore è protetto da termostato salvavita da intasamento?",
            normReference: "D.Lgs. 81/2008 art. 71; CEI EN 60335-2-69",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 11. GENERATORE DI OZONO COMPATTO PER SANIFICAZIONE E BONIFICA CAMERE OSPITI (env-bnb-camere-ospiti, env-bnb-bagni-privati)
      {
        machineKey: "generatore_ozono_sanificazione_bnb",
        name: "Generatore di Ozono Compatto per Sanificazione e Bonifica Camere Ospiti",
        type: "Generatore Portatile di Ozono O3 per Disinfezione e Bonifica Ambienti Chiusi",
        suggestedManufacturer: "Sanity System / Caleffi / Ozonosan",
        suggestedModel: "Sanity System Sany Med / Caleffi / Ozonosan",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_bnb,
        safetyChecks: [
          {
            code: "BNB_OZONO_TIMER_PROGRAMMABILE_RICONVERSIONE",
            title: "Timer Digitale Programmabile e Riconversione Catalitica dell'Ozono in Ossigeno",
            question: "L'apparecchio è provvisto di timer digitale volumetrico con blocco tasti e di filtro/sistema catalitico per la rapida riconversione dell'ozono residuo in ossigeno molecolare (O2) al termine del ciclo di disinfezione?",
            normReference: "Ministero Salute Prot. 24482/1996; D.Lgs. 81/2008 Titolo IX; CEI EN 60335-2-65",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_OZONO_PROTOCOLLO_DIVIETO_ACCESSO_SEGNALATICA",
            title: "Protocollo di Sicurezza con Divieto di Accesso a Persone e Cartello Monitore",
            question: "È rigorosamente applicata la procedura operativa che vieta la presenza di persone o animali nella camera durante l'erogazione, con posizionamento di apposito cartello monitore di pericolo chimico all'esterno della porta chiusa?",
            normReference: "D.Lgs. 81/2008 art. 227 (Rischio Chimico) e Allegato XXIV; Circolare Min. Salute 22/05/2020",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BNB_OZONO_PROCEDURA_AERAZIONE_LOCALE_POST_CICLO",
            title: "Procedura Obbligatoria di Aerazione Naturale dei Locali al Termine del Ciclo",
            question: "Al termine del ciclo di trattamento viene effettuata l'aerazione forzata o naturale dei locali aprendo finestre e balconi per almeno 20-30 minuti prima di consentire l'accesso al personale o ai nuovi ospiti?",
            normReference: "Rapporto ISS COVID-19 n. 56/2020; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_OZONO_MARCATURA_CE_MANUALE_LINEE_GUIDA",
            title: "Marcatura CE e Manuale Operativo con Tempi Volumetrici in Funzione dei m³",
            question: "Il dispositivo è dotato di regolare marcatura CE, manuale d'istruzioni d'uso in lingua italiana recante tempi di emissione in funzione della cubatura in m³ della stanza e registro delle sanificazioni?",
            normReference: "D.Lgs. 17/2010; D.Lgs. 81/2008 art. 70 e art. 71 c. 4",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 12. LAVASCIUGA PAVIMENTI COMPATTA VERTICALE A RULLI PER SPAZI STRETTI (env-bnb-ripostiglio-housekeeping, env-bnb-scale-disimpegni)
      {
        machineKey: "lavasciuga_pavimenti_compatta_bnb",
        name: "Lavasciuga Pavimenti Compatta Verticale a Rulli per Spazi Stretti",
        type: "Lavasciuga Pavimenti Verticale Manovrabile Compatta ad Azione Rapida",
        suggestedManufacturer: "Kärcher / Lindhaus / Fimap",
        suggestedModel: "Kärcher BR 30/4 C / Lindhaus LW30 / Fimap Genie",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_bnb,
        safetyChecks: [
          {
            code: "BNB_LAVASCIUGA_ASCIUGATURA_IMMEDIATA_ANTISCIVOLO",
            title: "Asciugatura Immediata del Pavimento per Prevenzione Cadute e Scivolamenti All. IV",
            question: "Il doppio tergipavimento con aspirazione ad alta depressione asciuga completamente la superficie lavata in un unico passaggio, prevenendo il rischio di scivolamento e caduta degli ospiti e degli addetti ai sensi del D.Lgs. 81/08?",
            normReference: "D.Lgs. 81/2008 Allegato IV punto 1.3.2; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVASCIUGA_SERBATOI_ESTRAIBILI_IGIENICI",
            title: "Serbatoi Acqua Pulita e Sporca Separati, Estraibili e Sanificabili",
            question: "I serbatoi dell'acqua pulita/soluzione detergente e dell'acqua reflua recuperata sono fisicamente separati, rimovibili senza attrezzi con maniglia di trasporto e sanificabili per evitare proliferazioni batteriche?",
            normReference: "D.Lgs. 81/2008 Titolo X; Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVASCIUGA_IMPUGNATURA_ERGONOMICA_UOMO_PRESENTE",
            title: "Impugnatura Ergonomica Regolabile con Dispositivo Uomo Presente",
            question: "Il timone di guida presenta comandi intuitivi con leva di consenso ad azione mantenuta (uomo presente) che interrompe l'azionamento dei rulli e l'erogazione dell'acqua al rilascio dell'impugnatura?",
            normReference: "UNI EN ISO 11228-2; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BNB_LAVASCIUGA_SPAZZOLE_RULLI_SGANCIO_RAPIDO",
            title: "Rulli Spazzola a Sgancio Rapido senza Attrezzi e Grado di Protezione IPX4",
            question: "I rulli spazzolanti sono rimovibili a scatto per la disinfezione periodica e l'apparato elettrico è certificato con grado di protezione minimo IPX4 contro gli spruzzi d'acqua durante il funzionamento?",
            normReference: "CEI EN 60335-2-72; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 13. CALDAIA MURALE A CONDENSAZIONE CON ACCUMULO ACS ANTI-LEGIONELLA (env-bnb-centrale-termica-boiler)
      {
        machineKey: "caldaia_murale_condensazione_acs",
        name: "Caldaia Murale a Condensazione con Accumulo ACS Anti-Legionella",
        type: "Generatore Termico Murale a Condensazione a Gas con Bollitore Sanitario Integrato",
        suggestedManufacturer: "Viessmann / Vaillant / Bosch",
        suggestedModel: "Viessmann Vitodens 100-W / Vaillant ecoTEC plus / Bosch",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_livello_1,
        safetyChecks: [
          {
            code: "BNB_CALDAIA_CAMERA_STAGNA_TIPO_C_FUMI_TETTO",
            title: "Camera Stagna a Tiraggio Forzato Tipo C con Scarico Fumi a Tetto a Norma D.M. 37/08",
            question: "Il generatore è a camera stagna a tiraggio forzato di Tipo C con condotto coassiale di evacuazione fumi certificato a tetto secondo UNI 7129 e provvisto di Dichiarazione di Conformità D.M. 37/2008?",
            normReference: "D.M. 37/2008 art. 7; UNI 7129:2015; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CALDAIA_SHOCK_TERMICO_ANTI_LEGIONELLA_65C",
            title: "Funzione Automatica Termica Settimanale Shock Anti-Legionella a 65°C su Bollitore",
            question: "La centralina elettronica della caldaia/bollitore è programmata per eseguire periodicamente (settimanalmente) un ciclo termico automatico di disinfezione dell'acqua calda sanitaria portando la temperatura ad almeno 65°C per prevenire la proliferazione di Legionella pneumophila?",
            normReference: "Linee Guida Nazionali Legionellosi (Accordo SR 07/05/2015); D.Lgs. 81/2008 Titolo X; D.Lgs. 18/2023",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CALDAIA_MANOMETRO_PRESSOSTATO_BLOCCO_ACQUA",
            title: "Manometro Idraulico e Pressostato di Blocco Minima/Massima Pressione Acqua",
            question: "Il circuito idraulico è dotato di manometro con indicazione di pressione visibile e pressostato di blocco bruciatore in caso di pressione insufficiente (< 0,8 bar) o sovrapressione con valvola di sicurezza a 3 bar convogliata?",
            normReference: "UNI EN 15502; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CALDAIA_VALVOLA_INTERCETTAZIONE_GAS_LIBRETTO",
            title: "Rubinetto di Intercettazione Rapida Gas e Libretto Impianto con Bollino Termico",
            question: "A monte della caldaia è installata una valvola a sfera di intercettazione manuale del gas accessibile e l'impianto dispone di Libretto di Impianto termico aggiornato con controlli periodici di efficienza energetica e bollino regionale?",
            normReference: "D.P.R. 74/2013; D.M. 10/02/2014; D.Lgs. 81/2008 art. 71 c. 8",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 14. SISTEMA DI RIVELAZIONE INCENDI E FUMI CON SENSORI OTTICI WIRELESS E SIRENA (env-bnb-ingresso-reception)
      {
        machineKey: "centralina_rilevazione_fumi_bnb",
        name: "Sistema di Rivelazione Incendi e Fumi con Sensori Ottici Wireless e Sirena",
        type: "Centrale Wireless di Rivelazione Incendi con Rivelatori Ottici di Fumo e Sirena",
        suggestedManufacturer: "Inim / Comelit / Ajax",
        suggestedModel: "Inim Previdia Micro / Comelit / Ajax Hub 2 Plus",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_livello_1,
        safetyChecks: [
          {
            code: "BNB_ANTINCENDIO_SENSORI_FUMO_OTTICI_EN14604_EN54",
            title: "Rilevatori Ottici di Fumo Certificati UNI EN 14604 / EN 54 con Sirena Integrata",
            question: "Tutte le camere per gli ospiti, i corridoi e le aree comuni sono presidiati da rivelatori ottici puntiformi di fumo certificati secondo UNI EN 14604 o UNI EN 54-7 con avvisatore acustico integrato per allarme tempestivo?",
            normReference: "UNI EN 14604; UNI EN 54-7; D.M. 02/09/2021; D.M. 09/04/1994 e D.M. 14/07/2015",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ANTINCENDIO_CENTRALE_BATTERIA_TAMPONE_GSM",
            title: "Centrale di Supervisione con Batteria Tampone di Continuità e Notifica Remota",
            question: "La centrale di gestione allarmi è provvista di alimentatore certificato con batteria tampone di continuità (almeno 24 ore di autonomia in assenza di rete elettrica) e combinatore telefonico/GSM/IP per notifica tempestiva al titolare?",
            normReference: "UNI 9795; UNI EN 54-4; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ANTINCENDIO_SIRENA_ALLARME_POTENTE_OTTICO",
            title: "Sirena Interna ad Alta Potenza (> 85 dB(A)) con Segnalatore Ottico Lampeggiante",
            question: "La struttura è dotata di segnalatori sonori (almeno 85 dB(A) a 3 metri e 75 dB(A) a letto) abbinati a lampeggianti visivi per garantire l'immediato risveglio e allertamento degli ospiti in caso di principio d'incendio?",
            normReference: "UNI EN 54-3; UNI EN 54-23; D.M. 02/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_ANTINCENDIO_REGISTRO_CONTROLLI_SEMESTRALE",
            title: "Verifica Periodica Semestrale e Registro dei Controlli Antincendio UNI 11224",
            question: "L'impianto e i rivelatori sono sottoposti a controllo visivo mensile e a verifica di efficienza con generatore di fumo aerosol semestrale da tecnico qualificato con annotazione sul Registro Antincendio?",
            normReference: "UNI 11224; D.M. 02/09/2021 Allegato I; D.Lgs. 81/2008 art. 46 c. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 15. SISTEMA DI CONTROLLO ACCESSI ELETTRONICO / SMART LOCK PER CAMERE E PORTONE (env-bnb-ingresso-reception, env-bnb-camere-ospiti, env-bnb-bagni-privati)
      {
        machineKey: "serrature_elettroniche_smartlock",
        name: "Sistema di Controllo Accessi Elettronico / Smart Lock per Camere e Portone",
        type: "Serrature Elettroniche Intelligenti con Controllo Accessi e Sblocco Antipanico",
        suggestedManufacturer: "VingCard / Nuki / Yale",
        suggestedModel: "VingCard Essence / Nuki Smart Lock Pro / Yale Linus",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BNB_SMARTLOCK_SBLOCCO_ANTIPANICO_MECCANICO_EN179",
            title: "Sblocco Antipanico Meccanico dall'Interno con Maniglia a Spinta Libera UNI EN 179",
            question: "Tutte le serrature delle camere e delle vie d'uscita consentono lo sblocco immediato a spinta libera della maniglia dall'interno in qualsiasi circostanza senza necessità di chiave o alimentazione elettrica (conformità UNI EN 179) per l'evacuazione rapida?",
            normReference: "UNI EN 179; D.M. 02/09/2021; D.Lgs. 81/2008 Allegato IV punto 1.5 (Vie di Evacuazione)",
            defaultSeverity: 5,
            defaultSanctionable: true,
          },
          {
            code: "BNB_SMARTLOCK_ALIMENTAZIONE_BATTERIA_AVVISO_SCARICA",
            title: "Alimentazione Autonoma a Batteria con Preavviso Scarica e Chiave Fisica di Soccorso",
            question: "I dispositivi sono dotati di segnalazione acustica/visiva preventiva di batteria in esaurimento e di sistema fisico di emergenza (chiave di soccorso meccanica o contatto 9V esterno) per prevenire il blocco accidentale degli ospiti nella camera?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; CEI EN 60335-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_SMARTLOCK_COMPATIBILITA_PORTE_REI_TAGLIAFUOCO",
            title: "Certificazione di Resistenza Meccanica e Compatibilità Porte Tagliafuoco REI",
            question: "I corpi serratura installati su porte REI preservano la resistenza al fuoco della porta certificata secondo UNI EN 1634-1 e non indeboliscono le caratteristiche antincendio e di tenuta ai fumi freddi del serramento?",
            normReference: "UNI EN 1634-1; UNI EN 12209; D.M. 02/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_SMARTLOCK_CRITTOGRAFIA_E_SICUREZZA_DATI",
            title: "Crittografia Sicura delle Comunicazioni (AES 128/256 bit) e Revoca Istantanea Codici",
            question: "Il protocollo di trasmissione wireless (Bluetooth/RFID/WiFi) utilizza crittografia avanzata (AES 128/256 bit) con chiavi temporizzate e revoca istantanea dei codici per impedire intrusioni e manomissioni non autorizzate?",
            normReference: "D.Lgs. 196/2003 e Reg. UE 2016/679 (GDPR); D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 16. CARRELLO ERGONOMICO COMPATTO PER RIASSETTO CAMERE E PRODOTTI PULIZIA (env-bnb-ripostiglio-housekeeping, env-bnb-scale-disimpegni)
      {
        machineKey: "carrello_housekeeping_compatto_bnb",
        name: "Carrello Ergonomico Compatto per Riassetto Camere e Prodotti Pulizia",
        type: "Carrello Modulare Ergonomico Compatto per Housekeeping e Riassetto Piani",
        suggestedManufacturer: "TTS / Filmop / IPC",
        suggestedModel: "TTS Magic Hotel 700 / Filmop Morgan / IPC Brix",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.housekeeping_bnb,
        safetyChecks: [
          {
            code: "BNB_CARRELLO_SEPARAZIONE_BIANCHERIA_SPORCO_PULITO",
            title: "Separazione Fisica Ermetica tra Vani Biancheria Pulita e Sacco Sporco",
            question: "Il carrello è configurato con sacco portabiancheria sporca lavabile/impermeabile fisicamente separato e isolato dai vani contenenti lenzuola, tovaglie e spugne pulite per prevenire cross-contamination biologica?",
            normReference: "D.Lgs. 81/2008 Titolo X (Agenti Biologici); Linee Guida Sanificazione",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CARRELLO_VANO_CHIMICI_CHIUSO_A_CHIAVE",
            title: "Scomparto di Sicurezza Chiuso con Chiave per Detergenti e Prodotti Chimici Concentrati",
            question: "I prodotti chimici di pulizia, disinfettanti concentrati e decalcificanti sono alloggiati in cassetto o scomparto provvisto di chiusura con serratura a chiave per impedire l'accesso o l'ingestione accidentale da parte degli ospiti o bambini?",
            normReference: "D.Lgs. 81/2008 Titolo IX (Agenti Chimici); Reg. CE 1272/2008 (CLP)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CARRELLO_RUOTE_PIROETTANTI_FRENO_STAZIONAMENTO",
            title: "Ruote Piroettanti Antitraccia con Freno di Stazionamento a Pedale",
            question: "Le ruote piroettanti in tecnopolimero o gomma antitraccia (diametro >= 125 mm) sono provviste di freno di stazionamento a pedale perfettamente efficiente per bloccare stabilmente il carrello sui pianerottoli e lungo le pendenze?",
            normReference: "UNI EN ISO 11228-2; D.Lgs. 81/2008 All. V p. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BNB_CARRELLO_ERGONOMIA_SPINTA_TRAINO_ISO11228",
            title: "Struttura Ergonomica Leggera in Tecnopolimero Conforme UNI ISO 11228-2",
            question: "L'altezza e l'inclinazione delle maniglie di spinta sono posizionate ad altezza corretta per l'operatore (tra 90 e 105 cm) e la struttura leggera in tecnopolimero limita lo sforzo iniziale e di traino al di sotto dei valori limite ISO 11228-2?",
            normReference: "UNI ISO 11228-2; D.Lgs. 81/2008 Titolo VI (Movimentazione Manuale dei Carichi)",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // ATECO 55.30.00, 55.30.0, 55.30, 55.3 (Aree di campeggio, Villaggi turistici, Camping village e Allestimenti per camper/caravan)
  {
    sectorKey: "campeggio_villaggio",
    sectorLabel: "Campeggi, Villaggi Turistici, Camping Village e Strutture Ricettive all'Aperto",
    atecoPrefixes: ["55.30.00", "55.30.0", "55.30", "55.3"],
    machines: [
      // 1. TORRETTA / COLONNINA DI EROGAZIONE ELETTRICA E IDRICA PER PIAZZOLE (env-cmp-piazzole-tende-camper)
      {
        machineKey: "colonnina_elettrica_campeggio",
        name: "Torretta / Colonnina di Erogazione Elettrica e Idrica per Piazzole (4 Prese CEE)",
        type: "Colonnina di Distribuzione Energia Elettrica e Acqua Potabile per Piazzole Camping",
        suggestedManufacturer: "Gewiss / Scame / Rosi",
        suggestedModel: "Gewiss Series 68 Q-DIN Campeggio / Scame Parre Camping IP67 / Rosi RS9100",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CMP_COLONNINA_DIFF_INDIVIDUALE_30MA",
            title: "Protezione Differenziale Magnetotermica Individuale 30 mA per Singola Presa",
            question: "Ogni presa a spina CEE 16A 2P+T è protetta da un interruttore magnetotermico differenziale individuale con Idn <= 30 mA tipo A per prevenire dispersioni e interruzioni a cascata sulle piazzole adiacenti?",
            normReference: "CEI 64-8 sez. 708.530.1; D.Lgs. 81/2008 art. 80-86 e All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_COLONNINA_GRADO_PROTEZIONE_IP67",
            title: "Involucro Stagno con Grado di Protezione IP67 Antipioggia, Polvere e Urti IK08",
            question: "L'involucro esterno e le prese a spina garantiscono un grado di protezione minimo IP67 con portelle a molla integre, resistenti all'irraggiamento solare UV e a impatti meccanici accidentali IK08?",
            normReference: "CEI 64-8 sez. 708.512.2; CEI EN 60529; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_COLONNINA_SEPARAZIONE_ACQUA_LUCE",
            title: "Separazione Fisica Netta tra Vano Elettrico e Prese Idriche",
            question: "I rubinetti di prelievo acqua sono alloggiati in un compartimento fisicamente separato e isolato dal vano elettrico, con drenaggio anticondensa e scarico gravitazionale indipendente?",
            normReference: "CEI 64-8 sez. 708.55; D.Lgs. 81/2008 All. IV p. 2; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_COLONNINA_RUBINETTO_ANTIGELO_RITEGNO",
            title: "Rubinetto Acqua con Valvola di Ritegno Anti-Riflusso e Scarico Antigelo",
            question: "I punti di erogazione idrica per uso potabile sono provvisti di valvola di ritegno (disconnettore UNI EN 1717) per impedire ritorni di acque inquinate e valvola di svuotamento per gelo invernale?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 2. STAZIONE ECOLOGICA CAMPER SERVICE AUTOPULENTE (env-cmp-camper-service-scarico)
      {
        machineKey: "camper_service_autopulente",
        name: "Stazione Ecologica Camper Service Autopulente per Scarico Acque Grigie e Nere",
        type: "Piattaforma Meccanizzata Autopulente di Scarico Liquami per Autocaravan con Griglia Carrabile",
        suggestedManufacturer: "WC Wash / Euroservice / Camperclean",
        suggestedModel: "WC Wash Compact Inox Autopulente / Euroservice CS-500 / Camperclean Station D-01",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CMP_CAMPER_TRAMOGGIA_LAVAGGIO_FOTOCELLULA",
            title: "Tramoggia Inox a Pavimento con Getto di Lavaggio Automatico a Fotocellula",
            question: "La tramoggia di scarico a filo pavimento in acciaio inox è dotata di ugelli perimetrali di lavaggio automatico comandati da fotocellula o temporizzatore per sanificare la griglia dopo lo scarico?",
            normReference: "D.Lgs. 81/2008 All. IV p. 1; D.Lgs. 152/2006 art. 101; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CAMPER_DISCONNETTORE_IDRICO_UNI1717",
            title: "Disconnettore Idraulico di Separazione Acqua di Lavaggio UNI EN 1717",
            question: "La colonnina per il lavaggio delle cassette WC è alimentata da un circuito con disconnettore idraulico a zona di pressione ridotta non modificabile (UNI EN 1717) separato nettamente dall'acqua potabile?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023; D.Lgs. 81/2008 Titolo X (Rischio Biologico)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CAMPER_COLONNA_CASSETTE_ASPIRAZIONE",
            title: "Colonna di Svuotamento WC a Cassetta con Sportello Anti-Schizzo e Aspirazione",
            question: "La bocchetta per lo svuotamento delle cassette chimiche estraibili presenta sportello basculante a molla anti-schizzo e conformazione anti-odore per proteggere l'operatore e gli utenti da contaminazioni?",
            normReference: "D.Lgs. 81/2008 Titolo IX e Titolo X (Agenti Biologici e Chimici); art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CAMPER_PAVIMENTAZIONE_ANTISCIVOLO",
            title: "Griglia Carrabile Inox e Pavimentazione con Trattamento Antisdrucciolo R11",
            question: "La piattaforma carrabile presenta pendenze idonee allo smaltimento verso la tramoggia centrale e pavimentazione antiscivolo classe R11 per prevenire scivolamenti su bagnato e schiuma?",
            normReference: "DIN 51130; D.Lgs. 81/2008 All. IV p. 1.3.2; art. 64",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 3. CENTRALINA AUTOMATICA DI DOSAGGIO E CONTROLLO CLORO/PH PER PISCINE (env-cmp-locale-tecnico-cloro)
      {
        machineKey: "impianto_dosaggio_cloro_piscina",
        name: "Centralina Automatica di Dosaggio e Controllo Cloro/pH per Piscine",
        type: "Impianto Elettrochimico di Misura Parametri e Dosaggio Pompe Peristaltiche / Elettromagnetiche",
        suggestedManufacturer: "ProMinent / Grundfos / AstralPool",
        suggestedModel: "ProMinent DULCOMARIN 3 / Grundfos Oxiperm Pro / AstralPool Control Basic Next",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.trattamento_acque_legionella,
        safetyChecks: [
          {
            code: "CMP_CLORO_BLOCCO_POMPE_FLUSSO_ZERO",
            title: "Interblocco Automatico di Blocco Pompe Dosatrici su Flusso Zero (Flussostato)",
            question: "La centralina è interbloccata con un flussostato di sicurezza che arresta immediatamente l'iniezione di ipoclorito di sodio e acido solforico/riduttore pH in assenza di circolazione d'acqua per evitare formazione di gas cloro tossico?",
            normReference: "UNI 10637 p. 5.3; D.Lgs. 81/2008 art. 71 c. 3; Titolo IX Agenti Chimici",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CLORO_BACINI_CONTENIMENTO_CHIMICO",
            title: "Vasche di Contenimento Rigide Anticorrosione per Fusti Cloro e Acido",
            question: "I fusti di ipoclorito e di riduttore pH sono posizionati su bacini di contenimento in polietilene antiacido separati tra loro, con capacità minima pari al volume totale del contenitore per impedire miscelazioni accidentali?",
            normReference: "D.Lgs. 81/2008 Titolo IX Agenti Chimici art. 224; D.Lgs. 152/2006; Accordo SR 16/01/2003",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CLORO_DOCCIA_LAVAOCCHI_EMERGENZA",
            title: "Doccia di Emergenza e Presidio Lavaocchi UNI EN 15154 Immediatamente Accessibile",
            question: "Nel locale tecnico dosaggio prodotti chimici è presente e costantemente alimentato a pressione un presidio lavaocchi d'emergenza con comando a pedale/leva rapida conforme alla norma UNI EN 15154?",
            normReference: "UNI EN 15154-1/2; D.Lgs. 81/2008 All. IV p. 2.1; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CLORO_ALLARMI_OVERDOSAGGIO_REDOX",
            title: "Allarmi di Sovradosaggio, Soglie Min/Max Redox e Sensore Fuga Gas",
            question: "Il sistema dispone di allarme ottico-acustico di superamento soglia massima cloro/redox e tempo massimo di iniezione (time-out pompa), con arresto dosaggio e segnalazione remota?",
            normReference: "UNI 10637; D.Lgs. 81/2008 art. 71 c. 8; D.Lgs. 81/2008 Titolo IX",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 4. ROBOT ELETTRICO PROFESSIONALE PULITORE PER VASCHE PISCINA VILLAGGIO (env-cmp-piscina-solarium)
      {
        machineKey: "robot_pulitore_piscina_industriale",
        name: "Robot Elettrico Professionale Pulitore per Vasche Piscina Villaggio",
        type: "Pulitore Subacqueo Automatico ad Alimentazione a Bassissima Tensione di Sicurezza SELV",
        suggestedManufacturer: "Maytronics / Zodiac / Hayward",
        suggestedModel: "Maytronics Dolphin Wave 100 / Zodiac Vortex Pro Commercial / Hayward TigerShark Commercial",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.bagnino_piscine_villaggio,
        safetyChecks: [
          {
            code: "CMP_ROBOT_ALIMENTAZIONE_SELV_TENSIONE",
            title: "Alimentatore di Sicurezza a Bassissima Tensione SELV (< 30V DC) a Distanza di Sicurezza",
            question: "Il robot è alimentato esclusivamente tramite trasformatore a doppio isolamento SELV a bassissima tensione conforme CEI EN 60335-2-41, posizionato a distanza minima di almeno 3,5 metri dal bordo vasca?",
            normReference: "CEI EN 60335-2-41 punto 22; CEI 64-8 sez. 702; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ROBOT_INTERDIZIONE_BAGNO_FUNZIONAMENTO",
            title: "Divieto Assoluto di Balneazione ed Interdizione Vasca Durante la Pulizia",
            question: "È rigorosamente vietata e segnalata l'immersione di bagnanti durante il funzionamento del robot, programmando i cicli di pulizia esclusivamente a impianto chiuso o vasca interdetta?",
            normReference: "Accordo Stato-Regioni 16/01/2003; UNI 10637; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ROBOT_CAVO_GALLEGGIANTE_ANTINODO",
            title: "Integrità Guaina Cavo Galleggiante con Snodo Swivel Anti-Attorcigliamento",
            question: "Il cavo galleggiante è integro, privo di giunzioni nastrate, abrasioni o tagli, e provvisto di snodo girevole Swivel per impedire nodi e tensioni anomale sul cablaggio?",
            normReference: "CEI EN 60335-2-41; CEI 64-8 sez. 702; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ROBOT_CARRELLO_TRASPORTO_ERGONOMICO",
            title: "Carrello di Trasporto Ergonomico Dedicato (Prevenzione Sovraccarico Biomeccanico)",
            question: "La movimentazione del robot a secco e del relativo cavo avviene mediante carrello di trasporto ergonomico su ruote per azzerare rischi di movimentazione manuale dei carichi su pavimentazione bagnata?",
            normReference: "UNI EN ISO 11228-1; D.Lgs. 81/2008 Titolo VI; art. 168",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 5. GRUPPO DI PRESSURIZZAZIONE ANTINCENDIO UNI EN 12845 CON MOTOPOMPA DIESEL (env-cmp-centrale-idrica-antincendio)
      {
        machineKey: "gruppo_pompe_antincendio_uni12845",
        name: "Gruppo di Pressurizzazione Antincendio a Norma UNI EN 12845 con Motopompa Diesel",
        type: "Centrale Idrica Antincendio di Pressurizzazione Idranti e Sprinkler con Motopompa di Riserva",
        suggestedManufacturer: "Wilo / Lowara / Grundfos",
        suggestedModel: "Wilo SiFire Easy / Lowara GHV Fire / Grundfos Hydro EN 12845",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_livello_3,
        safetyChecks: [
          {
            code: "CMP_ANTINCENDIO_MOTOPOMPA_DIESEL_BATTERIE",
            title: "Avviamento Automatico Motopompa Diesel con Doppie Batterie Indipendenti",
            question: "La motopompa diesel ausiliaria è equipaggiata con due pacchi batterie di avviamento indipendenti con caricabatterie automatico e quadro di commutazione conforme a UNI EN 12845 punto 10.7?",
            normReference: "UNI EN 12845 punto 10.7; D.M. 02/09/2021; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ANTINCENDIO_BACINO_GASOLIO_SERBATOIO",
            title: "Serbatoio Combustibile con Bacino di Contenimento e Valvola di Intercettazione",
            question: "Il serbatoio gasolio della motopompa dispone di bacino metallico di contenimento sversamenti al 100% e valvola a strappo tagliafuoco azionabile dall'esterno del locale?",
            normReference: "UNI EN 12845 punto 10.9; D.M. 13/07/2011; D.Lgs. 81/2008 All. IV p. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ANTINCENDIO_QUADRO_ALLARMI_REMOTI",
            title: "Quadro Elettrico UNI EN 12845 con Segnalazione Allarmi Ottico-Acustici in Portineria",
            question: "Il quadro comandi pompe trasmette gli stati operativi (pompa in marcia, anomalia alimentazione, mancato avviamento, bassa pressione) al presidio della reception con segnalatori ottico-acustici continui?",
            normReference: "UNI EN 12845 punto 10.8; D.M. 28/02/2014; D.Lgs. 81/2008 art. 43",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ANTINCENDIO_PROVA_SETTIMANALE_AVVIO",
            title: "Avvio Settimanale di Prova e Compilazione Registro Controlli Antincendio",
            question: "Viene eseguita settimanalmente la prova di avviamento automatico e manuale della motopompa diesel e dell'elettropompa con relativa annotazione sul registro dei controlli antincendio?",
            normReference: "UNI EN 12845 punto 20; D.M. 02/09/2021 All. I; D.Lgs. 81/2008 art. 64 c. 1 lett. c",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 6. GRUPPO ELETTROGENO DIESEL SILENZIATO DI EMERGENZA (env-cmp-centrale-idrica-antincendio)
      {
        machineKey: "gruppo_elettrogeno_emergenza_campeggio",
        name: "Gruppo Elettrogeno Diesel Silenziato di Emergenza per Continuità Villaggio (60-150 kVA)",
        type: "Generatore Diesel Cabinato Insonorizzato per Continuità Emergenza Strutture Turistiche",
        suggestedManufacturer: "Pramac / Bruno / Caterpillar",
        suggestedModel: "Pramac GSW110 / Bruno Silent GS / Caterpillar C4.4 Silenced",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.gruppi_elettrogeni,
        safetyChecks: [
          {
            code: "CMP_GENERATORE_VASCA_CONTENIMENTO_110",
            title: "Vasca di Raccolta Gasolio Integrata al 110% Conforme D.M. 13/07/2011",
            question: "Il gruppo elettrogeno è dotato di basamento a vasca di raccolta combustibile a tenuta stagna con capacità pari ad almeno il 110% del serbatoio gasolio conforme al D.M. 13/07/2011 per la prevenzione incendi e sversamenti?",
            normReference: "D.M. 13/07/2011 art. 4; D.Lgs. 152/2006; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_GENERATORE_SGANCIO_EMERGENZA_ESTERNO",
            title: "Pulsante di Arresto di Emergenza a Fungo Esterno al Vano Tecnico (IP65)",
            question: "È installato all'esterno della cabina o del locale generatore un pulsante di sgancio d'emergenza a fungo con riarmo manuale che interrompe istantaneamente motore e circuito carburante?",
            normReference: "CEI 64-8 sez. 536; D.M. 13/07/2011; D.Lgs. 81/2008 All. V p. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_GENERATORE_QUADRO_ATS_INTERBLOCCO",
            title: "Quadro Automatico di Scambio Rete/Gruppo ATS con Interblocco Meccanico",
            question: "Il quadro automatico di commutazione rete/gruppo è provvisto di interblocco elettrico e meccanico certificato per evitare qualsiasi immissione accidentale in controfase sulla rete pubblica?",
            normReference: "CEI EN 60947-6-1; CEI 64-8; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_GENERATORE_VERIFICA_SOTTO_CARICO",
            title: "Prova Periodica di Avviamento a Vuoto e Inserzione Carichi di Emergenza",
            question: "Viene eseguito mensilmente l'avviamento di prova del gruppo con verifica del funzionamento sotto carico dei servizi di sicurezza (pompe antincendio, illuminazione di emergenza, EVAC)?",
            normReference: "CEI 64-8/7; D.M. 02/09/2021; D.Lgs. 81/2008 art. 71 c. 11",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 7. SISTEMA DI DIFFUSIONE SONORA EVAC OUTDOOR (env-cmp-reception-direzione)
      {
        machineKey: "sistema_diffusione_sonora_evac_campeggio",
        name: "Sistema di Diffusione Sonora di Emergenza ed Evacuezione All'Aperto (EVAC Outdoor)",
        type: "Impianto EVAC di Evacuazione Vocale e Allarme Esterno con Diffusori IP66 e Centrale Certificata",
        suggestedManufacturer: "Bose / RCF / Paso",
        suggestedModel: "RCF DXT 3000 Outdoor / Paso PAW 4500 Campeggi / Bosch Praesensa Voice Alarm",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_livello_3,
        safetyChecks: [
          {
            code: "CMP_EVAC_DIFFUSORI_TROMBA_IP66",
            title: "Diffusori Acustici a Tromba IP66 ad Elevata Udibilità in Tutte le Piazzole",
            question: "I diffusori sonori dislocati nell'area campeggio presentano grado di protezione IP66, resistenza a salsedine e intemperie e garantiscono un livello di pressione sonora di allarme > 65 dB in ogni piazzola?",
            normReference: "UNI EN 54-24; UNI ISO 7240-19; D.M. 28/02/2014; D.Lgs. 81/2008 art. 43",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_EVAC_MESSAGGI_MULTILINGUE_AUTOMATICI",
            title: "Messaggi Vocali Pre-Registrati di Evacuazione Multilingue Prioritari",
            question: "La centrale di trasmissione vocale è programmata con messaggi preregistrati in italiano, inglese, tedesco e francese con priorità assoluta su qualsiasi altra diffusione audio?",
            normReference: "UNI EN 54-16; D.M. 28/02/2014 Titolo II; D.Lgs. 81/2008 art. 43 e 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_EVAC_ALIMENTAZIONE_RISERVA_24H",
            title: "Alimentazione di Riserva con Batterie Tampone Autonomia Minima 24h + 30 min",
            question: "L'impianto EVAC è alimentato da gruppo soccorritore certificato UNI EN 54-4 in grado di garantire il funzionamento a riposo per almeno 24 ore più 30 minuti continui in stato di allarme vocale?",
            normReference: "UNI EN 54-4; CEI EN 60849; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_EVAC_LINEE_RESISTENTI_AL_FUOCO",
            title: "Linee di Distribuzione con Cavi Resistenti al Fuoco CEI 20-36 e Isolatori di Tronco",
            question: "Le linee degli altoparlanti sono realizzate con cavi a prova di fuoco schermati e provviste di isolatori di linea per impedire che il guasto o l'incendio in un settore comprometta il resto del villaggio?",
            normReference: "CEI 20-36; CEI EN 50200; D.Lgs. 81/2008 art. 46; UNI ISO 7240-19",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 8. VEICOLO ELETTRICO UTILITARIO / GOLF CART NAVETTA (env-cmp-officina-manutenzione)
      {
        machineKey: "golf_cart_elettrico_navetta",
        name: "Veicolo Elettrico Utilitario / Golf Cart Navetta per Manutenzione e Ospiti",
        type: "Veicolo Elettrico a Batteria per Circolazione Interna di Servizio, Trasporto Bagagli e Manutenzione",
        suggestedManufacturer: "Club Car / Yamaha / Melex",
        suggestedModel: "Club Car Carryall 500 / Yamaha Drive2 Fleet AC / Melex 391 Utility",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CMP_GOLFCART_FRENO_STAZIONAMENTO_AUTO",
            title: "Freno di Stazionamento Elettromeccanico Automatico all'Arresto",
            question: "Il veicolo elettrico è provvisto di sistema frenante di stazionamento ad inserimento automatico all'arresto per impedire partenze accidentali o slittamenti sulle pendenze dei vialetti?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; UNI EN ISO 3691-1; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_GOLFCART_AVVISATORE_RETROMARCIA",
            title: "Avvisatore Acustico di Retromarcia e Fari a LED ad Alta Luminosità",
            question: "Il mezzo è dotato di cicalino acustico di sicurezza automatico in retromarcia e fari anteriori/posteriori a LED per garantire la massima visibilità nelle ore notturne tra le tende e i camper?",
            normReference: "D.Lgs. 81/2008 All. VI p. 1.8; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CMP_GOLFCART_LIMITATORE_VELOCITA",
            title: "Limitatore Elettronico di Velocità Massima per Aree Pedonali (< 15 km/h)",
            question: "La centralina motore ha la velocità massima bloccata elettronicamente sotto i 15 km/h per prevenire rischi di investimento dei pedoni e bambini che circolano nei vialetti interni?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 3; D.Lgs. 81/2008 All. VI p. 1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CMP_GOLFCART_RICARICA_AERAZIONE_IDROGENO",
            title: "Locale Ricarica Batterie Aerato con Presa CEE Interbloccata",
            question: "La ricarica dei pacchi batteria avviene in area o locale provvisto di ventilazione naturale o forzata anti-accumulo idrogeno e presa a spina CEE interbloccata protetta da differenziale dedicato?",
            normReference: "CEI EN 62485-3; CEI 64-8; D.Lgs. 81/2008 art. 80 e All. IV p. 1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 9. TRATTORINO TAGLIAERBA PROFESSIONALE PER SFALCIO E PREVENZIONE INCENDI (env-cmp-officina-manutenzione)
      {
        machineKey: "trattorino_tosaerba_sfalcio",
        name: "Trattorino Tagliaerba Professionale per Sfalcio Aree Verdi e Prevenzione Incendi",
        type: "Macchina Semovente Uomo a Bordo per Cura Prati, Sfalcio Ampie Superfici e Fasce Tagliafuoco",
        suggestedManufacturer: "John Deere / Kubota / Husqvarna",
        suggestedModel: "John Deere X350R / Kubota GR1600-II Diesel / Husqvarna TC 242T",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.manutentore_verde_motosega,
        safetyChecks: [
          {
            code: "CMP_TOSAERBA_TELAIO_ROPS_CINTURA",
            title: "Telaio di Protezione Antiribaltamento ROPS Omologato e Cintura di Sicurezza",
            question: "Il trattorino è provvisto di struttura di protezione contro il ribaltamento (archetto ROPS omologato) e cintura di sicurezza addominale obbligatoria per il conducente?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.4 e All. VI p. 2; ISO 5395-3; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_TOSAERBA_SENSORE_UOMO_PRESENTE",
            title: "Microinterruttore di Sicurezza Sedile con Arresto Immediato Lame entro 3s",
            question: "È installato e perfettamente funzionante il sensore di presenza operatore sul sedile che spegne il motore e arresta la rotazione delle lame di taglio entro 3 secondi se il conducente si alza?",
            normReference: "UNI EN ISO 5395-1/3; D.Lgs. 81/2008 All. V p. 6; art. 71 c. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_TOSAERBA_DEFLETTORE_PARASASSI",
            title: "Carter di Protezione Piatto di Taglio e Deflettore Scarico Parasassi",
            question: "Il piatto di taglio è equipaggiato con carter metallici fissi e deflettore mobile con molla di richiamo per intercettare l'espulsione violenta di sassi o detriti verso terzi?",
            normReference: "UNI EN ISO 5395-2; D.Lgs. 81/2008 All. V p. 6.1; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_TOSAERBA_FRENO_LAME_FRIZIONE",
            title: "Frizione Elettromagnetica Inserimento Lame con Freno Incorporato",
            question: "L'innesto delle lame avviene tramite frizione elettromagnetica con freno meccanico integrato che blocca le lame indipendentemente dal motore durante il trasferimento su viali?",
            normReference: "UNI EN ISO 5395-3; D.Lgs. 81/2008 All. V p. 2; art. 71 c. 4",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 10. SET DECESPUGLIATORE PROFESSIONALE E MOTOSEGA DA POTATURA (env-cmp-officina-manutenzione)
      {
        machineKey: "decespugliatore_motosega_potatura",
        name: "Set Decespugliatore Professionale e Motosega da Potatura Alberi e Sottobosco",
        type: "Attrezzature Portatili con Motore a Scoppio/Batteria per Pulizia Sottobosco e Potatura Rami",
        suggestedManufacturer: "Stihl / Husqvarna",
        suggestedModel: "Stihl FS 460 C-EM Decespugliatore & MS 201 TC-M Motosega / Husqvarna 545RXT & T540 XP III",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.manutentore_verde_motosega,
        safetyChecks: [
          {
            code: "CMP_VERDE_FRENO_CATENA_INERZIALE",
            title: "Freno Catena Inerziale Automatico sulla Motosega (QuickStop)",
            question: "La motosega è provvista di freno catena ad attivazione inerziale e manuale sul paramano sinistro che arresta istantaneamente la catena in caso di contraccolpo (kickback)?",
            normReference: "UNI EN ISO 11681-1; D.Lgs. 81/2008 All. V p. 6; art. 71 c. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_VERDE_PARASASSI_DECESPUGLIATORE",
            title: "Carter Parasassi Omologato con Lama Trancia-Filo su Decespugliatore",
            question: "Il decespugliatore monta la protezione parasassi specifica per la testina in uso (a filo o disco metallico) completa di lametta di taglio filo integro per evitare lanci di corpi contundenti?",
            normReference: "UNI EN ISO 11806-1; D.Lgs. 81/2008 All. V p. 6; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_VERDE_ACCELERATORE_DOPPIA_SICURA",
            title: "Leva Comando Acceleratore con Blocco di Sicurezza sull'Impugnatura",
            question: "Le impugnature antivibranti di entrambi gli attrezzi presentano leva di accelerazione con blocco di sicurezza che impedisce azionamenti accidentali dell'organo di taglio a riposo?",
            normReference: "UNI EN ISO 11681-1; UNI EN ISO 11806-1; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_VERDE_DPI_OBBLIGATORI_ANTITAGLIO",
            title: "Dotazione Obbligatoria DPI di III Categoria Antitaglio, Elmetto con Visiera e Cuffie",
            question: "L'operatore indossa obbligatoriamente pantaloni antitaglio classe 1/2, scarponi forestali antitaglio, guanti antivibrazione/antitaglio ed elmetto con visiera a rete e cuffie antirumore?",
            normReference: "D.Lgs. 81/2008 art. 75-79 e All. VIII; D.Lgs. 81/2008 Titolo VIII Capo II (Rumore)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 11. PRESSA COMPATTATRICE ELETTROIDRAULICA PER RIFIUTI E IMBALLAGGI (env-cmp-isola-ecologica-rifiuti)
      {
        machineKey: "compattatore_rifiuti_differenziata",
        name: "Pressa Compattatrice Elettroidraulica per Cartoni e Plastica Riciclabile",
        type: "Pressa Verticale Elettroidraulica per Riduzione Volume Imballaggi e Rifiuti Riciclabili",
        suggestedManufacturer: "Bramidan / Strautmann / HSM",
        suggestedModel: "Bramidan B4 / Strautmann BalePress 4 / HSM V-Press 605",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CMP_COMPATTATORE_INTERBLOCCO_SPORTELLO",
            title: "Microinterruttore di Sicurezza su Sportello di Carico Rifiuti",
            question: "L'avvio e la discesa del piatto pressante sono rigidamente subordinati alla chiusura ermetica dello sportello di carico controllato da interblocco di sicurezza conforme a UNI EN 16500?",
            normReference: "UNI EN 16500 punto 5.2; D.Lgs. 81/2008 All. V p. 6; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_COMPATTATORE_ARRESTO_EMERGENZA_FUNGO",
            title: "Pulsante di Arresto di Emergenza a Fungo a Riarmo Manuale",
            question: "Sul pannello di comando è installato un pulsante d'arresto di emergenza a fungo rosso ben visibile che arresta istantaneamente il circuito idraulico in qualunque fase del ciclo?",
            normReference: "UNI EN ISO 13850; UNI EN 16500; D.Lgs. 81/2008 All. V p. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_COMPATTATORE_ESPULSIONE_BIMANUALE",
            title: "Espulsione Semiautomatica Balla con Comando a Due Mani ad Azione Mantenuta",
            question: "Il ribaltamento e l'espulsione della balla pressata sono azionabili solo tramite comando bimanuale ad azione mantenuta situato a distanza di sicurezza per prevenire schiacciamenti dell'operatore?",
            normReference: "UNI EN 16500 punto 5.3; D.Lgs. 81/2008 All. V p. 2; art. 71 c. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_COMPATTATORE_VALVOLA_MASSIMA_PRESSIONE",
            title: "Valvola di Massima Pressione Oleodinamica e Controllo Raccordi",
            question: "Il circuito idraulico è dotato di valvola limitatrice di pressione tarata e piombata, e le tubazioni flessibili sono integre e protette contro schizzi di fluido ad alta pressione?",
            normReference: "UNI EN ISO 4413; D.Lgs. 81/2008 art. 71 c. 4; All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 12. CENTRALE TERMICA MURALE O MODULARE PER DOCCE AD ALTO FLUSSO (env-cmp-centrale-idrica-antincendio)
      {
        machineKey: "caldaia_centrale_acs_campeggio",
        name: "Centrale Termica Murale o Modulare per Docce ad Alto Flusso con Shock Anti-Legionella",
        type: "Centrale Termica a Cascata per Produzione Acqua Calda Sanitaria Massiva Blocchi Docce",
        suggestedManufacturer: "Viessmann / Ferroli / Daikin",
        suggestedModel: "Viessmann Vitodens 200-W Cascade / Ferroli Force W 80-150 / Daikin Altherma 3 Flex Cascade",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.centrali_termiche_clima,
        safetyChecks: [
          {
            code: "CMP_CALDAIA_SHOCK_TERMICO_LEGIONELLA",
            title: "Ciclo Programmato di Disinfezione Termica Settimanale Anti-Legionella (> 65°C)",
            question: "La centralina dell'accumulo ACS esegue automaticamente con cadenza programmata il trattamento termico anti-legionella innalzando la temperatura a 65°C per almeno un'ora con valvole termostatiche antiscottatura a valle?",
            normReference: "Accordo Stato-Regioni 07/05/2015; D.Lgs. 81/2008 Titolo X; D.Lgs. 18/2023",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CALDAIA_VALVOLE_SICUREZZA_INAIL",
            title: "Valvole di Sicurezza Omologate INAIL e Vasi d'Espansione Certificati PED",
            question: "La centrale è provvista di valvole di sicurezza omologate con scarico a vista convogliato, termostato di blocco combustibile a riarmo manuale e vasi d'espansione conformi alla Raccolta R INAIL?",
            normReference: "Raccolta R INAIL; D.Lgs. 26/2016 (PED); D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CALDAIA_TERMOSTATO_BLOCCO_COMBUSTIBILE",
            title: "Pressostato di Minima e Termostato Limitatore con Intercettazione Elettrovalvola Gas",
            question: "In caso di sovratemperatura o mancanza d'acqua l'elettrovalvola esterna intercetta istantaneamente l'adduzione combustibile con blocco a riarmo esclusivamente manuale?",
            normReference: "UNI EN 12953; Raccolta R INAIL; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_CALDAIA_VENTILAZIONE_LOCALE_GAS",
            title: "Aperture di Aerazione Naturale Permanente Conforme D.M. 08/11/2019",
            question: "Il locale centrale termica presenta aperture di aerazione permanente verso l'esterno calcolate secondo le regole tecniche di prevenzione incendi per impianti oltre 35 kW?",
            normReference: "D.M. 08/11/2019; D.Lgs. 81/2008 All. IV p. 1.8; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 13. LAVATRICE INDUSTRIALE A GETTONI PER LAVANDERIA SELF (env-cmp-lavanderia-self)
      {
        machineKey: "lavatrice_industriale_campeggio",
        name: "Lavatrice Professionale Industriale a Carica Frontale a Gettoni (11-14 kg)",
        type: "Lavatrice Supercentrifugante Professionale a Gettoniera per Uso Comunitario Turisti",
        suggestedManufacturer: "Miele Professional / Primus / Speed Queen",
        suggestedModel: "Miele Professional PWM 909 / Primus RX105 Smart / Speed Queen SC105 Quantum Gold",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CMP_LAVATRICE_BLOCCO_OPLO_RITARDATO",
            title: "Dispositivo Elettromeccanico di Blocco Oblò Ritardato UNI EN ISO 10472-2",
            question: "L'oblò di carico è dotato di elettroserratura con blocco ritardato che impedisce l'apertura finché il cesto è in rotazione (tempo d'arresto < 2s) o la temperatura interna supera 50°C?",
            normReference: "UNI EN ISO 10472-2 punto 5.2; D.Lgs. 81/2008 All. V p. 6; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_LAVATRICE_ARRESTO_EMERGENZA_OSPITI",
            title: "Pulsante d'Arresto Rapido Accessibile all'Utente della Lavanderia Self",
            question: "Nel locale lavanderia self-service è presente un pulsante di sgancio generale di emergenza ben segnalato accessibile agli ospiti per disalimentare le apparecchiature in caso di anomalie?",
            normReference: "UNI EN ISO 13850; D.Lgs. 81/2008 All. V p. 3; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_LAVATRICE_SENSORE_SBILANCIAMENTO",
            title: "Sensore Elettronico di Anti-Sbilanciamento del Carico in Centrifuga",
            question: "La macchina dispone di controllo elettronico delle oscillazioni che blocca la centrifuga ad alta velocità qualora la biancheria sia mal distribuita prevenendo sollecitazioni strutturali pericolose?",
            normReference: "UNI EN ISO 10472-2; D.Lgs. 81/2008 art. 71 c. 4; All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CMP_LAVATRICE_ANCORAGGIO_ANTIVIBRANTE",
            title: "Ancoraggio Strutturale a Pavimento con Tiranti e Dima Antivibrante",
            question: "La lavatrice è ancorata rigidamente al basamento in calcestruzzo mediante tiranti e piastra antivibrante per evitare spostamenti fisici incontrollati durante le fasi di lavaggio e centrifuga?",
            normReference: "D.Lgs. 81/2008 All. V p. 1.2; UNI EN ISO 10472-2; art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
        ],
      },

      // 14. ASCIUGATRICE INDUSTRIALE A GETTONI CON DOPPIO FILTRO (env-cmp-lavanderia-self)
      {
        machineKey: "asciugatrice_industriale_campeggio",
        name: "Asciugatrice Industriale a Carica Frontale a Gettoni con Doppio Filtro Lanugine (11-14 kg)",
        type: "Essiccatore Rotativo Professionale Ventilato con Gettoniera e Filtro Antincendio",
        suggestedManufacturer: "Miele Professional / Speed Queen / Girbau",
        suggestedModel: "Miele Professional PDR 914 / Speed Queen ST030 Commercial / Girbau ED260 Ecomiser",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CMP_ASCIUGATRICE_DOPPIO_FILTRO_LANUGINE",
            title: "Doppio Filtro Lanugine Estraibile con Monitoraggio Flusso Aria (Anti-Innesco)",
            question: "L'essiccatore è provvisto di doppio cassetto filtro lanugine facilmente ispezionabile e sensore di depressione aria che arresta il riscaldamento in caso di intasamento per prevenire incendi?",
            normReference: "UNI EN ISO 10472-4 punto 5.3; D.M. 02/09/2021; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ASCIUGATRICE_TERMOSTATO_MAX_RIARMO",
            title: "Termostato Limitatore di Sovratemperatura a Riarmo Manuale",
            question: "Il circuito di riscaldamento (elettrico o gas) è protetto da un termostato di massima a riarmo manuale che toglie immediatamente tensione se la temperatura interna dell'aria supera i limiti critici?",
            normReference: "UNI EN ISO 10472-4 punto 5.5; D.Lgs. 81/2008 All. V p. 7; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ASCIUGATRICE_CONDOTTO_SCARICO_METALLO",
            title: "Condotto di Evacuazione Vapori Metallico Indipendente Verso l'Esterno",
            question: "L'aria umida e calda è convogliata all'esterno tramite tubazione rigida metallica dedicata in acciaio/alluminio priva di strozzature e provvista di terminale anti-intrusione all'aperto?",
            normReference: "D.M. 08/11/2019; D.Lgs. 81/2008 All. IV p. 2; D.M. 02/09/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_ASCIUGATRICE_INTERBLOCCO_PORTELLO",
            title: "Microinterruttore Sportello con Spegnimento Immediato Rotazione e Riscaldamento",
            question: "L'apertura dell'oblò durante il funzionamento provoca l'immediato arresto della rotazione del tamburo e la disattivazione istantanea delle resistenze o della fiamma gas?",
            normReference: "UNI EN ISO 10472-4; D.Lgs. 81/2008 All. V p. 6; art. 71 c. 3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // 15. FORNO PROFESSIONALE PER PIZZERIA DEL VILLAGGIO (env-cmp-ristorante-minimarket)
      {
        machineKey: "forno_pizze_ristorante_campeggio",
        name: "Forno Professionale Elettrico/Gas per Pizzeria del Villaggio Turistico",
        type: "Forno Professionale Statico a Doppia Camera con Piani Refrattari, Cappa e Isolamento",
        suggestedManufacturer: "Moretti Forni / Cuppone / OEM",
        suggestedModel: "Moretti Forni Serie S 120 / Cuppone Giotto Touch / OEM Domitor 6+6",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "CMP_FORNO_VETRO_VENTILATO_ANTIUSTIONE",
            title: "Porta con Vetro Isolante Ventilato e Maniglia Atermica Anti-Ustione",
            question: "Gli sportelli di cottura sono dotati di doppio vetro temperato con intercapedine ventilata e maniglie in materiale atermico isolante per prevenire ustioni da contatto termico agli operatori?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 All. V p. 7; art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CMP_FORNO_VALVOLA_GAS_TERMOCOPPIA",
            title: "Valvola di Sicurezza con Termocoppia di Rilevazione Fiamma (Modelli a Gas)",
            question: "Nei modelli alimentati a gas/GPL ciascun bruciatore è protetto da valvola di sicurezza a termocoppia che blocca l'erogazione in caso di spegnimento accidentale della fiamma?",
            normReference: "UNI EN 203-1 punto 5.3; D.M. 08/11/2019; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_FORNO_CAPPA_ASPIRAZIONE_TETTO",
            title: "Cappa d'Aspirazione Fumi e Calore Canalizzata a Tetto con Filtri Inox",
            question: "Il forno è sormontato da cappa aspirante in acciaio inox con filtri antigrasso a labirinto canalizzata con canna fumaria autonoma a tetto conforme alle normative igieniche e antincendio?",
            normReference: "D.M. 08/11/2019; D.Lgs. 81/2008 All. IV p. 2.1; Reg. CE 852/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_FORNO_PIANO_REFRATTARIO_MOCA",
            title: "Pietre Refrattarie di Cottura Certificate per Contatto Alimentare MOCA",
            question: "I piani di cottura in pietra refrattaria sono certificati per contatto con alimenti MOCA, privi di crepe, scheggiature o residui chimici nocivi secondo il Reg. CE 1935/2004?",
            normReference: "Reg. CE 1935/2004; D.M. 21/03/1973; D.Lgs. 81/2008 art. 71 c. 3",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // 16. DEFIBRILLATORE SEMIAUTOMATICO DAE IN TECA RISCALDATA (env-cmp-reception-direzione)
      {
        machineKey: "defibrillatore_dae_colonnina",
        name: "Defibrillatore Semiautomatico Esterno (DAE) in Teca Riscaldata per Aree Aperte",
        type: "Dispositivo Medico Elettromedicale Semiautomatico per Soccorso Cardiorespiratorio con Teca Climatizzata",
        suggestedManufacturer: "Philips / Zoll / DefiSign",
        suggestedModel: "Philips HeartStart FRx Outdoor / Zoll AED Plus Outdoor / DefiSign Life AED Teca Aivia 200 Riscaldata",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_evac,
        safetyChecks: [
          {
            code: "CMP_DAE_TECA_CLIMATIZZATA_IP54",
            title: "Teca Esterna Protetta IP54 Climatizzata Anti-Gelo e Anti-Surriscaldamento",
            question: "Il defibrillatore è alloggiato in una teca outdoor con grado di protezione minimo IP54 dotata di riscaldatore termostatico automatico per garantire l'efficienza della batteria e del gel piastre?",
            normReference: "Legge 116/2021; CEI EN 60529; D.M. 24/04/2013; D.Lgs. 81/2008 art. 45",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_DAE_ALLARME_APERTURA_CHIAMATA_112",
            title: "Allarme Sonoro all'Apertura e Combinatore GSM di Soccorso 112",
            question: "L'apertura dello sportello della teca attiva una sirena acustica ad alta intensità per allertare il personale della reception/bagnini e un combinatore telefonico automatico verso il soccorso 112?",
            normReference: "Legge 116/2021 art. 4; D.M. 24/04/2013; D.Lgs. 81/2008 art. 43 e 45",
            defaultSeverity: 3,
            defaultSanctionable: false,
          },
          {
            code: "CMP_DAE_VERIFICA_PERIODICA_SCADENZE",
            title: "Verifica Mensile Stato di Carica Batteria e Scadenza Elettrodi Monouso",
            question: "Viene effettuato il controllo mensile visivo della spia di autotest operativo (OK verde) e registrata la data di scadenza delle piastre per adulti e pediatriche sul registro delle emergenze?",
            normReference: "D.M. 24/04/2013 All. E; D.Lgs. 81/2008 art. 45; Legge 116/2021",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CMP_DAE_SEGNALETICA_ILCOR_RIFLETTE",
            title: "Cartellonistica Internazionale ILCOR ad Alta Visibilità e Riflettanza",
            question: "La postazione DAE è chiaramente individuabile mediante segnaletica standard ILCOR verde con cuore e fulmine visibile dai viali centrali, piscina e reception?",
            normReference: "D.Lgs. 81/2008 Titolo V All. XXV; Legge 116/2021; Raccomandazioni ILCOR",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 14. STABILIMENTI BALNEARI, LIDI, BEACH CLUB E STRUTTURE TURISTICHE COSTIERE (ATECO 93.29.20 / 93.29.2 / 93.29 / 93.2)
  {
    sectorKey: "stabilimento_balneare",
    sectorLabel: "Stabilimenti Balneari, Lidi, Beach Club e Strutture Turistiche Costiere",
    atecoPrefixes: ["93.29.20", "93.29.2", "93.29", "93.2"],
    machines: [
      // 1. Torretta bagnino avvistamento
      {
        machineKey: "torretta_bagnino_avvistamento",
        name: "Torretta di Avvistamento Bagnino in Alluminio/Legno Marino con Parasole",
        type: "Postazione Sopraelevata di Sorveglianza e Primo Intervento Balneare",
        suggestedManufacturer: "Cramer / Maritan / Beach Service / Canobbio",
        suggestedModel: "Torretta Alluminio Marino Professional h 2.5m",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.bagnino_acque_libere_mare,
        safetyChecks: [
          {
            code: "BALN_TORRETTA_ANCORAGGIO_STABILITA",
            title: "Ancoraggio e Stabilità Strutturale Antiribaltamento su Arenile",
            question: "La torretta è saldamente ancorata mediante piastre zavorrate o plinti interrati con calcolo di tenuta alle raffiche di vento e moto ondoso, ed è esente da giochi o deformazioni?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 4 e All. V; Ordinanza di Sicurezza Balneare Capitaneria di Porto; UNI EN 131-7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_TORRETTA_SCALA_CORRIMANO",
            title: "Scala d'Accesso con Gradini Antiscivolo e Corrimano di Salita",
            question: "La scaletta di accesso alla pedana superiore presenta pioli/gradini antiscivolo a distanza costante, montanti continui e corrimano protetto privo di spigoli vivi o bave metalliche taglienti?",
            normReference: "D.Lgs. 81/2008 art. 113 e All. V p. 2; UNI EN 131",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_TORRETTA_PARAPETTO_PROTEZIONE",
            title: "Parapetto Perimetrale Completo con Corrente Superiore e Fermapiede",
            question: "La postazione di vedetta sopraelevata è provvista di parapetto rigido perimetrale alto almeno 1 metro con corrente intermedio e tavola fermapiede per prevenire cadute dall'alto dell'assistente bagnanti durante la sorveglianza?",
            normReference: "D.Lgs. 81/2008 art. 126 e All. V p. 2; Ordinanze Balneari Capitanerie di Porto",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_TORRETTA_PARASOLE_DOTAZIONI",
            title: "Copertura Parasole Anti-UVA e Alloggiamento Bandiere di Segnalazione",
            question: "La torretta dispone di copertura parasole inclinabile contro l'irraggiamento solare acuto per la prevenzione dei colpi di calore del bagnino e di appositi supporti per issare tempestivamente le bandiere regolamentari (bianca, rossa, gialla/nera) e alloggiare megafono e binocolo marino?",
            normReference: "D.Lgs. 81/2008 art. 180 (Radiazioni Ottiche Naturali/Microclima); Ordinanze Balneari Guardia Costiera",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      // 2. Pattino salvataggio rosso
      {
        machineKey: "pattino_salvataggio_rosso",
        name: "Imbarcazione di Salvataggio a Remi Tipo Moscone/Pattino Rosso con Dotazioni",
        type: "Battello di Salvataggio a Remi Omologato per Uso Litoraneo",
        suggestedManufacturer: "Cantiere Navale Foschi / Nautica Viareggio / Martini Costruzioni Nautiche",
        suggestedModel: "Pattino Standard Salvataggio 4.80m Vetroresina Rosso",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.bagnino_acque_libere_mare,
        safetyChecks: [
          {
            code: "BALN_PATTINO_SCAFO_GALLEGGIABILITA",
            title: "Integrità Scafo, Camere Stagne di Riserva e Dicitura 'SALVATAGGIO'",
            question: "Lo scafo presenta colorazione rossa viva indelebile con scritta ben visibile 'SALVATAGGIO' in lettere bianche su entrambi i fianchi, struttura in vetroresina priva di osmosi o falle e blocchi di riserva di galleggiamento poliuretanici interni integri?",
            normReference: "Ordinanze di Sicurezza Balneare Guardia Costiera / Capitanerie di Porto; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_PATTINO_SCALMI_REMI_RISPETTO",
            title: "Scalmiere con Fermo Antislittamento, Coppia Remi e Remo di Rispetto",
            question: "Gli scalmi sono assicurati saldamente con legatura di sicurezza imperdibile per evitare la caduta in mare del remo durante la vogata d'emergenza, ed è presente a bordo il terzo remo di rispetto regolamentare conforme all'ordinanza?",
            normReference: "Ordinanza di Sicurezza Balneare Capitanerie di Porto; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_PATTINO_SALVAGENTE_RULLO_CIMA",
            title: "Salvagente Anulare Omologato SOLAS con Sagola 25m e Cavo di Traino Arenile",
            question: "Il battello è equipaggiato con salvagente anulare omologato munito di sagola galleggiante di almeno 25 metri priva di nodi o usura, pronto per il lancio immediato, e gancio di traino con rullo di soccorso?",
            normReference: "Ordinanza Balneare Capitaneria di Porto; D.P.R. 435/1991 (Regolamento Sicurezza della Navigazione); D.Lgs. 81/2008 art. 43",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_PATTINO_POSIZIONAMENTO_BATTIGIA",
            title: "Posizionamento Strategico a Battigia con Scivolo Libero da Ostacoli",
            question: "Il pattino è collocato direttamente sulla battigia a ridosso dell'arenile, rivolto verso il mare con rulli di alaggio o scivolo sgombro da ombrelloni, lettini o natanti privati per consentire il varo in mare in meno di 30 secondi?",
            normReference: "Ordinanze di Polizia Marittima e Sicurezza Balneare; D.Lgs. 81/2008 art. 43",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      // 3. Defibrillatore DAE in teca climatizzata antisalsedine IP65
      {
        machineKey: "defibrillatore_dae_teca_climatizzata",
        name: "Defibrillatore Semiautomatico Esterno (DAE) in Teca Climatizzata Antisalsedine IP65",
        type: "Apparecchiatura Elettromedicale Salvavita per Emergenza Cardiaca e Drowning",
        suggestedManufacturer: "Philips HeartStart FRx / Zoll AED 3",
        suggestedModel: "HeartStart FRx Marine IP65 con Teca Riscaldata/Ventilata",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.addetto_blsd_dae,
        safetyChecks: [
          {
            code: "BALN_DAE_TECA_IP65_ANTISALSEDINE",
            title: "Teca Climatizzata Antisalsedine con Grado di Protezione IP65 e Allarme Acustico",
            question: "Il DAE è alloggiato in teca stagna IP65 specificamente trattata contro la corrosione da salsedine marina, provvista di sistema termoregolato (anti-surriscaldamento estivo) e sirena/luce stroboscopica all'apertura?",
            normReference: "Legge 116/2021 art. 4; D.M. 24/04/2013 All. E; CEI EN 60601-1; CEI EN 60529 (IP65)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_DAE_VERIFICA_BATTERIA_PIASTRE",
            title: "Autotest Operativo, Scadenza Elettrodi Adulti/Pediatrici e Kit Asciugatura",
            question: "Viene registrato il controllo visivo periodico della spia di autotest (OK verde), la scadenza non superata delle piastre e la presenza a corredo del kit per annegamento (forbici taglia-abiti, rasoio monouso, teli per asciugatura torace, maschera pocket-mask con valvola unidirezionale)?",
            normReference: "Legge 116/2021; D.M. 24/04/2013 All. E; D.Lgs. 81/2008 art. 45",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_DAE_SEGNALETICA_NUE112",
            title: "Cartellonistica Internazionale ILCOR Visibile dall'Arenile e Registrazione NUE 112",
            question: "La postazione DAE è chiaramente segnalata con cartello standard ILCOR verde con cuore e saetta visibile dall'arenile e dall'ingresso lido, ed è geolocalizzata e registrata presso la Centrale Operativa NUE 112 / 118 regionale?",
            normReference: "Legge 116/2021 art. 6; D.Lgs. 81/2008 Titolo V All. XXV; Linee Guida 118 Ares",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      // 4. Sedia anfibia disabili JOB
      {
        machineKey: "sedia_anfibia_disabili_job",
        name: "Sedia a Ruote Anfibia da Mare per Disabili (Tipo J.O.B. / Sand&Sea)",
        type: "Ausilio e Dispositivo di Mobilità e Accessibilità Arenile e Balneazione Disabili",
        suggestedManufacturer: "Neatech (J.O.B.) / SoleMare / Sand&Sea / Offcarr",
        suggestedModel: "J.O.B. Classic con Ruote Pneumatiche Galleggianti",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BALN_JOB_RUOTE_GALLEGGIANTI",
            title: "Integrità Ruote Pneumatiche a Bassa Pressione e Galleggiabilità in Mare",
            question: "Le ruote sagomate a bassa pressione sono integre, correttamente gonfiate per la trazione sulla sabbia asciutta, dotate di cuscinetti plastici privi di usura o bloccaggi da salsedine e garantiscono l'assetto galleggiante stabile in acqua?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 4; D.P.R. 503/1996; Ordinanza Balneare Accessibilità Diversamente Abili",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_JOB_CINTURA_TELAIO_ALLUMINIO",
            title: "Cintura di Sicurezza a Sgancio Rapido e Telaio in Alluminio Anodizzato Marino",
            question: "La seduta è provvista di cintura di sicurezza a sgancio rapido d'emergenza in poliestere imputrescibile e il telaio metallico in alluminio/inox è esente da cricche, corrosione salina o parti taglienti?",
            normReference: "UNI EN ISO 12182 (Ausili tecnici per persone con disabilità); D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_JOB_BRACCIOLI_MANIGLIA_TRAINO",
            title: "Braccioli di Contenimento Ribaltabili e Manubrio di Manovra/Traino",
            question: "I braccioli laterali sono solidi e bloccabili durante il trasporto e la maniglia di spinta/traino posteriore consente all'operatore un controllo stabile durante l'entrata e l'uscita dalla battigia senza rischio di ribaltamento?",
            normReference: "D.Lgs. 81/2008 art. 71; Linee Guida INAIL Accessibilità e Sicurezza Stabilimenti Balneari",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      // 5. Puliscispiaggia semovente trattore
      {
        machineKey: "puliscispiaggia_semovente_trattore",
        name: "Macchina Puliscispiaggia Meccanica con Vagliatore Vibrante per Arenile",
        type: "Macchina Operatrice Semovente / Trainata per Pulizia e Setacciatura Arenili",
        suggestedManufacturer: "Tuareg / Piuma / Sanidelta / Cavalluccio",
        suggestedModel: "Sanidelta Hydro / Tuareg Evo con Vagliatore Setacciatore Vibrante",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.operatore_puliscispiaggia,
        safetyChecks: [
          {
            code: "BALN_PULISCISPIAGGIA_CARTER_ORGANI_MOTO",
            title: "Carter di Protezione Fissi/Interbloccati su Vagliatore, Bielle e Organi di Trasmissione",
            question: "Tutti gli organi meccanici in movimento (setaccio vibrante, bielle di azionamento, alberi cardanici e cinematismi di carico sabbia) sono segregati con carter metallici chiusi e conformi all'All. V del D.Lgs. 81/08 per evitare schiacciamento o cesoiamento?",
            normReference: "D.Lgs. 81/2008 Titolo III All. V p. 6; Direttiva Macchine 2006/42/CE; UNI EN ISO 4254-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_PULISCISPIAGGIA_ARRESTO_EMERGENZA",
            title: "Pulsante di Arresto d'Emergenza a Fungo e Dispositivo Uomo Presente",
            question: "La macchina è equipaggiata con pulsanti di arresto di emergenza a fungo rosso facilmente accessibili e con leva di avanzamento 'a uomo presente' che arresta istantaneamente trazione e vagliatore al rilascio dei comandi da parte dell'operatore?",
            normReference: "D.Lgs. 81/2008 Titolo III All. V p. 2; UNI EN ISO 13850; UNI EN ISO 12100",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_PULISCISPIAGGIA_LAMPEGGIANTE_SEGNALATORE",
            title: "Lampeggiante Giallo Omologato, Fari da Lavoro e Segnalatore Acustico di Retromarcia",
            question: "La macchina è provvista di lampeggiante rotante giallo/arancione attivo durante il funzionamento, fari ad alta visibilità per lavorazioni nelle prime ore dell'alba e avvisatore acustico automatico di retromarcia per la protezione dei pedoni?",
            normReference: "D.Lgs. 81/2008 Titolo III All. VI p. 1.2; C.d.S. art. 57; UNI EN 474-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_PULISCISPIAGGIA_ORARI_USO_SPIAGGIA",
            title: "Rispetto Rigoroso degli Orari di Interdizione Spiaggia al Pubblico",
            question: "L'uso della macchina puliscispiaggia sull'arenile è tassativamente interdetto durante gli orari di apertura al pubblico e di balneazione (es. ammesso esclusivamente tra le 20:00 e le 07:30) per azzerare il rischio di collisione con bagnanti?",
            normReference: "Ordinanza di Polizia Balneare della Capitaneria di Porto; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      // 6. Colonnina docce temporizzate
      {
        machineKey: "colonnina_docce_temporizzate",
        name: "Colonnina Docce Esterne in Acciaio Inox AISI 316 con Pulsante Temporizzato e Lavapiedi",
        type: "Impianto Idrosanitario Esterno con Erogatori Temporizzati su Pedana Antiscivolo",
        suggestedManufacturer: "Ama Luxury Shower / Fontealta / Inoxstyle / AstralPool",
        suggestedModel: "Colonnina Doccia Marina Inox AISI 316 con Lavapiedi e Rubinetto Temporizzato",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BALN_DOCCE_ACCIAIO_INOX_AISI316",
            title: "Struttura in Acciaio Inox AISI 316 Resistente alla Salsedine e Assenza Spigoli Vivi",
            question: "La colonnina doccia è interamente realizzata in acciaio inossidabile austenitico AISI 316 (grado marino), priva di ruggine, ossidazioni o bave taglienti sui profili e sugli ugelli erogatori?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 4; UNI EN 1112; UNI EN 1113",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_DOCCE_VALVOLA_ANTISCOTTATURA",
            title: "Valvola Limitatrice di Temperatura Antiscottatura e Rubinetto Temporizzato",
            question: "L'impianto doccia è equipaggiato con valvola miscelatrice termostatica di sicurezza che limita la temperatura di erogazione a un massimo di 40°C evitando scottature accidentali all'utenza e cartuccia temporizzata per il risparmio idrico?",
            normReference: "UNI EN 1111; D.Lgs. 81/2008 art. 71; D.Lgs. 18/2023 (Qualità acque potabili)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_DOCCE_PEDANA_DRENAGGIO_SCIVOLAMENTO",
            title: "Pedana di Camminamento Antiscivolo e Griglia di Drenaggio Sifonata",
            question: "La base della doccia è dotata di pedana calpestabile a finitura antiscivolo (legno trattato o materiale composito/plastico classe C DIN 51097 per piedi nudi) e griglia di scarico a livello senza ristagni d'acqua o pericolo di scivolamento e caduta?",
            normReference: "D.Lgs. 81/2008 Titolo II All. IV punto 1.3.2; DIN 51097 (Superfici calpestabili piedi scalzi)",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_DOCCE_DISINFEZIONE_ANTILEGIONELLA",
            title: "Programma di Spurgo Termico/Chimico e Decalcificazione dei Soffioni Anti-Legionella",
            question: "I soffioni delle docce esterne e i tubi flessibili sono sottoposti a regolare pulizia e decalcificazione periodica con spurghi ad alta temperatura per prevenire la proliferazione e l'aerosolizzazione di Legionella pneumophila?",
            normReference: "Linee Guida Nazionali Prevenzione Legionellosi (Accordo Stato-Regioni 07/05/2015); D.Lgs. 81/2008 Titolo X; D.Lgs. 18/2023",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      // 7. Caldaia solare ACS docce
      {
        machineKey: "caldaia_solare_acs_docce",
        name: "Impianto Solare Termico con Caldaia a Condensazione e Accumulo ACS Anti-Legionella",
        type: "Centrale Termica / Impianto Ibrido Solare-Gas Produzione Acqua Calda Sanitaria Arenile",
        suggestedManufacturer: "Viessmann / Daikin / Ariston",
        suggestedModel: "Vitosol 200-TM con Caldaia Vitodens e Bollitore Vitocell 100-B 1000L",
        isSubjectToInailCheck: true,
        inailFrequencyYears: 5,
        training: TRAINING_REQUIREMENTS_LIBRARY.centrali_termiche_clima,
        safetyChecks: [
          {
            code: "BALN_CALDAIA_CICLO_ANTILEGIONELLA_65",
            title: "Ciclo Automatico Settimanale di Shock Termico Anti-Legionella a Temperatura >= 65°C",
            question: "Il sistema di gestione del boiler di accumulo attiva regolarmente e traccia un ciclo di disinfezione termica automatica con innalzamento della temperatura ad almeno 65°C per l'abbattimento della carica batterica di Legionella Pneumophila?",
            normReference: "Linee Guida Prevenzione Legionellosi (Accordo Stato-Regioni 07/05/2015); D.Lgs. 81/2008 Titolo X; D.Lgs. 18/2023",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CALDAIA_VALVOLA_SICUREZZA_PED",
            title: "Valvole di Sicurezza Certificate PED/INAIL e Vasi d'Espansione a Membrana",
            question: "Il circuito solare e il generatore di calore sono dotati di valvole di sicurezza omologate e piombate con scarico convogliato a vista, vasi d'espansione conformi e manometri con indicazione chiara della pressione di esercizio?",
            normReference: "D.Lgs. 26/2016 (Direttiva PED 2014/68/UE); Raccolta R INAIL; D.Lgs. 81/2008 art. 71 c. 11",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CALDAIA_MISCELATRICE_GENERALE",
            title: "Miscelatore Termostatico di Sicurezza Generale Antiscottatura in Uscita Accumulo",
            question: "Sulla colonna di mandata principale dell'acqua calda alle docce e ai lavandini del lido è presente una valvola miscelatrice centrale tarata per non superare i 45-48°C per evitare traumi termici all'utenza?",
            normReference: "UNI EN 1111; D.Lgs. 81/2008 art. 71; UNI 9182",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CALDAIA_AERAZIONE_LOCALE_GAS",
            title: "Apertura Permanente di Ventilazione del Locale Tecnico ed Elettrovalvola Gas",
            question: "Il vano tecnico caldaia dispone di aperture permanenti di aerazione naturale verso l'esterno calcolate secondo UNI 7129/11528 e di elettrovalvola di intercettazione gas esterna con pulsante di sgancio d'emergenza?",
            normReference: "D.M. 08/11/2019; UNI 7129-2; UNI 11528; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      // 8. Fabbricatore ghiaccio lido
      {
        machineKey: "fabbricatore_ghiaccio_lido",
        name: "Fabbricatore di Ghiaccio a Cubetti ad Alta Resa con Filtro Acqua Antibatterico",
        type: "Apparecchiatura di Produzione Ghiaccio Alimentare per Bar e Ristorante di Spiaggia",
        suggestedManufacturer: "Brema CB 640 / Icematic",
        suggestedModel: "Brema CB 640 A Marine Edition con Filtri Antipolvere/Sabbia",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_bar_vapore,
        safetyChecks: [
          {
            code: "BALN_GHIACCIO_LAMPADA_UV_MOCA",
            title: "Lampada UV Germicida nel Deposito e Conformità Materiali MOCA",
            question: "La vasca di contenimento del ghiaccio e la coclea di estrazione sono realizzate con materiali conformi MOCA alimentare e dotate di lampada battericida UV o sistema antimicrobico attivo per impedire la contaminazione batterica dell'acqua di falda/rete?",
            normReference: "Reg. CE 1935/2004; Reg. CE 852/2004; D.Lgs. 29/2017 (Sanzioni MOCA)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_GHIACCIO_FILTRO_CONDENSATORE_SABBIA",
            title: "Filtro Antipolvere/Sabbia sul Condensatore e Pulizia Periodica",
            question: "Il condensatore ad aria del gruppo frigorifero è protetto da griglia e filtro antipolvere e antisabbia facilmente ispezionabile e pulibile per evitare surriscaldamenti del compressore e rischio incendio elettrico?",
            normReference: "CEI EN 60335-2-24; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_GHIACCIO_SCARICO_ANTIRIFLUSSO",
            title: "Scarico Sifonato con Interruzione d'Aria (Air-Gap) Anti-Reflusso Fognario",
            question: "La tubazione di scarico della condensa e dello sbrinamento della vasca ghiaccio presenta un'interruzione d'aria visibile (air-gap) a monte del sifone per escludere qualsiasi rigurgito di esalazioni o acque nere fognarie verso il ghiaccio?",
            normReference: "UNI EN 1717; Reg. CE 852/2004 All. II Cap. IX; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_GHIACCIO_PALETTA_MOCA_ESTERNA",
            title: "Paletta Igienica Dedicata per Prelievo con Supporto Esterno Sanificato",
            question: "Il prelievo del ghiaccio avviene unicamente mediante paletta in materiale alimentare MOCA conservata in apposito alloggio protetto e sanificato all'esterno del contenitore ghiaccio per evitare manipolazioni a mani nude?",
            normReference: "Reg. CE 852/2004 All. II; D.Lgs. 193/2007 (HACCP); Reg. CE 1935/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      // 9. Macchina caffe lido
      {
        machineKey: "macchina_caffe_lido",
        name: "Macchina Professionale per Caffè Espresso a 2 o 3 Gruppi",
        type: "Apparecchiatura Elettrica a Pressione per Somministrazione Caffetteria Bar Lido",
        suggestedManufacturer: "La Marzocco Linea / Faema E71 / Victoria Arduino",
        suggestedModel: "La Marzocco Linea Classic 2/3 Gruppi Inox Marine Edition",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_bar_vapore,
        safetyChecks: [
          {
            code: "BALN_CAFFE_VALVOLA_PED_CALDAIA",
            title: "Valvola di Sicurezza Sovrapressione Caldaia PED e Pressostato Operativo",
            question: "La caldaia interna a vapore è munita di valvola di sicurezza certificata PED a riarmo contro sovrapressioni e di manometro di controllo pressione caldaia chiaramente leggibile?",
            normReference: "D.Lgs. 26/2016 (Direttiva PED); D.Lgs. 81/2008 art. 71 c. 4; UNI EN 60335-2-75",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CAFFE_LANCIA_COOLTOUCH_VAPORE",
            title: "Isolamento Termico 'Cool-Touch' e Manopole di Presa sulle Lance Vapore",
            question: "I tubi di erogazione del vapore per la montatura latte sono provvisti di rivestimento interno isolato anti-scottatura (tecnologia Cool-Touch) e impugnatura in gomma termoisolante per prevenire ustioni al personale?",
            normReference: "CEI EN 60335-2-75 punto 11; D.Lgs. 81/2008 Titolo III All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CAFFE_DISCONNETTORE_ANTICALCARE",
            title: "Dispositivo di Non Ritorno UNI EN 1717 e Filtrazione Resine con Rigenerazione Periodica",
            question: "Il raccordo all'impianto idrico comprende un disconnettore di non ritorno certificato a norma UNI EN 1717 per impedire riflussi in rete e un depuratore/addolcitore anticalcare sottoposto a regolare rigenerazione/sostituzione delle resine?",
            normReference: "UNI EN 1717; Reg. CE 852/2004; D.Lgs. 18/2023",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CAFFE_COLLEGAMENTO_EQUIPOTENZIALE",
            title: "Messa a Terra Strutturale, Morsetto Equipotenziale e Interruttore Differenziale 30mA",
            question: "Il telaio metallico in acciaio inox è collegato a terra tramite conduttore PE idoneo e morsetto equipotenziale protetto da interruttore differenziale ad alta sensibilità da 30 mA, costantemente verificato in ambiente a forte umidità marina?",
            normReference: "CEI 64-8 parte 7; CEI EN 60335-1; D.Lgs. 81/2008 art. 80-86",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      // 10. Vetrina gelati lido
      {
        machineKey: "vetrina_gelati_lido",
        name: "Vetrina Gelateria Professionale Ventilata con Cristalli Riscaldati Anticondensa (-18°C)",
        type: "Apparecchiatura Frigorifera per Conservazione ed Esposizione Gelati e Dessert",
        suggestedManufacturer: "IFI / Isa / Frigomeccanica",
        suggestedModel: "IFI Panorama / ISA Millennium 16 Gusti R290 con Cristalli Pirolitici Riscaldati",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.buffet_colazioni_haccp,
        safetyChecks: [
          {
            code: "BALN_GELATI_CRISTALLI_ANTICONDENSA",
            title: "Vetri Riscaldati Pirolitici Anticondensa e Visibilità Perfetta",
            question: "I vetri frontali e laterali sono dotati di riscaldamento pirolitico a basso voltaggio per prevenire l'appannamento da condensa tipico del clima caldo-umido salmastro e garantire trasparenza senza rischi di elettrocuzione?",
            normReference: "CEI EN 60335-2-89; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_GELATI_TEMPERATURA_HACCP_ALLARME",
            title: "Termostato Digitale con Sbrinamento Rapido a Gas Caldo e Allarme Sonoro HACCP",
            question: "La refrigerazione ventilata assicura temperatura costante a -16°C / -18°C sulle vaschette con ciclo rapido di sbrinamento a inversione di ciclo/gas caldo e display con allarme di superamento soglia termica registrato sul manuale HACCP?",
            normReference: "Reg. CE 852/2004; D.Lgs. 193/2007; UNI EN ISO 23953-2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_GELATI_SICUREZZA_GAS_R290",
            title: "Conformità Circuito Ermetico per Gas Refrigerante Idrocarburo R290 (A3)",
            question: "Il circuito refrigerante a gas propano R290 è ermeticamente sigillato, privo di perdite rilevabili e provvisto di marcatura di avviso di infiammabilità secondo la norma UNI EN 378?",
            normReference: "UNI EN 378-1/2; Reg. UE 517/2014 e Reg. UE 2024/573 (F-Gas); CEI EN 60335-2-89",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_GELATI_CHIUSURA_SCORREVOLI_INSETTI",
            title: "Pannelli Posteriori Scorrevoli a Tenuta Antipolvere, Sabbia e Insetti",
            question: "Il lato servizio operatore dispone di chiusure scorrevoli a chiusura automatica/ermetica con guarnizioni a tenuta per schermare le vaschette gelato da granelli di sabbia, raffiche di vento e insetti volanti tipici della spiaggia?",
            normReference: "Reg. CE 852/2004 All. II Cap. I e II; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      // 11. Friggitrice pesce lido
      {
        machineKey: "friggitrice_pesce_lido",
        name: "Friggitrice Professionale a Vasca Singola o Doppia per Pesce e Fritture",
        type: "Apparecchiatura di Cottura Professionale ad Immersione in Olio ad Alta Temperatura",
        suggestedManufacturer: "Lotus / Angelo Po / Giorik",
        suggestedModel: "Lotus Professional 2x15L Vasca a 'V' con Paraspruzzi Inox",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BALN_FRIGGITRICE_TERMOSTATO_SICUREZZA",
            title: "Termostato di Sicurezza Limitatore a Riarmo Manuale Indipendente (< 230°C)",
            question: "La friggitrice è provvista di un termostato di blocco di sicurezza indipendente da quello di regolazione, che intercetta l'alimentazione prima che l'olio raggiunga i 230°C per prevenire l'innesco di autocombustione violenta?",
            normReference: "UNI EN 203-1 punto 5.4; CEI EN 60335-2-37; D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_FRIGGITRICE_VALVOLA_SCARICO_DOPPIA_SICURA",
            title: "Valvola Frontale di Svuotamento Olio con Dispositivo di Blocco a Doppia Azione",
            question: "La valvola per lo scarico dell'olio esausto è dotata di sicura meccanica (leva a scatto o perno di fermo) che impedisce l'apertura accidentale durante il servizio e scarico convogliato in apposito recipiente filtrante in dotazione?",
            normReference: "UNI EN 203-2-4; CEI EN 60335-2-37; D.Lgs. 81/2008 Titolo III All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_FRIGGITRICE_PARASPRUZZI_ZONA_FREDDA",
            title: "Paraspruzzi Inox Perimetrale e Vasca con Zona Fredda per Residui Carboniosi",
            question: "La vasca è corredata da alzatina e paraspruzzi laterali in acciaio inox per contenere schizzi d'olio caldo derivanti dalla frittura di pesce bagnato ed è provvista di zona fredda per evitare la carbonizzazione dei residui e lo sviluppo di acrilammide/fumi tossici?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 4; Reg. UE 2017/2158 (Acrilammide); Reg. CE 852/2004",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_FRIGGITRICE_COPERCHIO_ESTINZIONE",
            title: "Coperchio Metallico di Copertura a Tenuta e Presenza Estintore Classe F",
            question: "È sempre disponibile il coperchio metallico originale per soffocare prontamente eventuali principi d'incendio d'olio e nelle immediate vicinanze è posizionato un estintore a schiuma omologato classe d'incendio F (olii vegetali)?",
            normReference: "D.M. 03/09/2021; UNI EN 3-7 (Classe F); D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      // 12. Cappa aspirazione lido
      {
        machineKey: "cappa_aspirazione_lido",
        name: "Cappa d'Aspirazione Compensata Inox con Filtri a Labirinto e Impianto Ansul R-102",
        type: "Impianto di Estrazione Fumi di Cottura e Soppressione Automatica Incendi Cucina",
        suggestedManufacturer: "Alvial / Smoki / Camini & Cappe",
        suggestedModel: "Cappa Compensata Inox 304 con Impianto Ansul R-102 a Schiuma",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.antincendio_evac,
        safetyChecks: [
          {
            code: "BALN_CAPPA_IMPIANTO_ANSUL_NFPA96",
            title: "Sistema Automatico a Pioggia di Soppressione Incendio Ansul R-102 con Scarico Ugelli",
            question: "La cappa della cucina del ristorante di spiaggia è dotata di impianto automatico di spegnimento a liquido chimico Ansul R-102 conforme NFPA 96, con fusibili termici e tirante manuale di sgancio in posizione sicura?",
            normReference: "NFPA 96; NFPA 17A; D.M. 03/09/2021; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CAPPA_FILTRI_LABIRINTO_LAVAGGIO",
            title: "Filtri a Labirinto Parascintille Inox e Pulizia Periodica Antigocciolamento",
            question: "I filtri a labirinto in acciaio inossidabile sono integri, posizionati con corretta inclinazione verso la canalina di raccolta grassi e smontati e lavati con frequenza settimanale registrata per impedire l'accumulo di grasso infiammabile?",
            normReference: "UNI EN 16282-6; D.Lgs. 81/2008 art. 71; Reg. CE 852/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CAPPA_ASPIRATORE_CONDOTTO_SALSEDINE",
            title: "Motore d'Aspirazione Esterno con Girante Pale Rovesce e Condotto Inox AISI 316",
            question: "Il torrino o cassonetto d'estrazione fumi è resistente alla corrosione marina da salsedine e la canna fumaria è a tenuta e sfociante oltre il colmo del tetto secondo i regolamenti edilizi e igienico-sanitari locali?",
            normReference: "UNI EN 16282-4; D.Lgs. 81/2008 art. 71; Regolamento d'Igiene Locale",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_CAPPA_INTERBLOCCO_ELETTROVALVOLA_GAS",
            title: "Interblocco di Sicurezza con Elettrovalvola Intercettazione Gas Cucina",
            question: "È attivo l'interblocco pressostatico che blocca l'erogazione del gas o spegne le friggitrici qualora l'impianto di aspirazione della cappa sia disattivato o in avaria?",
            normReference: "UNI EN 203-1; UNI 8723; D.M. 08/11/2019; D.Lgs. 81/2008 art. 46",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      // 13. Lavastoviglie capotta lido
      {
        machineKey: "lavastoviglie_capotta_lido",
        name: "Lavastoviglie Industriale a Capotta Passante con Risciacquo Igienizzante (82°C)",
        type: "Macchina Lavastoviglie a Capotta Passante per Ristorante e Bar di Stabilimento Balneare",
        suggestedManufacturer: "Winterhalter PT / Meiko / Krupps",
        suggestedModel: "Winterhalter PT Marine / Krupps Elite Capotta Inox AISI 304",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BALN_LAVASTOVIGLIE_RISCIACQUO_82C",
            title: "Disinfezione Termica con Risciacquo Costante >= 82°C a Norma DIN 10512",
            question: "Il boiler interno assicura un risciacquo igienizzante a temperatura costante non inferiore a 82°C per l'inattivazione di patogeni alimentari su piatti e posate utilizzati per servizio di pesce e crudi di mare?",
            normReference: "DIN 10512; Reg. CE 852/2004; D.Lgs. 193/2007 (HACCP); D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_LAVASTOVIGLIE_BREAK_TANK_EN1717",
            title: "Dispositivo Break Tank Antiriflusso in Rete Idrica Conforme UNI EN 1717",
            question: "La macchina incorpora una vaschetta atmosferica Break Tank con pompa di risciacquo indipendente che impedisce il riflusso di detersivi e acque reflue inquinate nella rete idrica potabile del lido?",
            normReference: "UNI EN 1717; D.Lgs. 18/2023; Reg. CE 852/2004 All. II",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_LAVASTOVIGLIE_MICRO_CAPOTTA_ERGO",
            title: "Interblocco di Sicurezza Arresto Pompa su Sollevamento Capotta e Molle Bilanciate",
            question: "Il sollevamento della capotta provoca l'arresto immediato delle pompe di lavaggio e risciacquo per evitare getti d'acqua bollente sull'operatore, e le molle di bilanciamento impediscono ricadute accidentali per gravità?",
            normReference: "CEI EN 60335-2-58 punto 20; D.Lgs. 81/2008 Titolo III All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_LAVASTOVIGLIE_DOSATORI_PERISTALTICI",
            title: "Dosatori Peristaltici Incorporati e Pescanti con Tappo di Sicurezza Chimica",
            question: "I prodotti chimici corrosivi (detergente alcalino e brillantante acido) sono prelevati da dosatori peristaltici a circuito chiuso con pescanti e tappi di protezione per azzerare il contatto cutaneo dell'addetto?",
            normReference: "D.Lgs. 81/2008 Titolo IX (Rischio Chimico) art. 224; Schede di Sicurezza SDS REACH",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      // 14. Armadio frigo pesce lido
      {
        machineKey: "armadio_frigo_pesce_lido",
        name: "Armadio Frigorifero Statico/Ventilato Speciale Pesce Fresco (-2°C / +2°C)",
        type: "Apparecchiatura Frigorifera Professionale per Conservazione Prodotti Ittici Freschi",
        suggestedManufacturer: "Friulinox / Polaris / Ilsa",
        suggestedModel: "Friulinox Fish Marine 700L con Vaschette Forate Inox e Scolo Liquidi",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BALN_FRIGO_EVAPORATORE_CATAFORESI",
            title: "Evaporatore Trattato con Verniciatura Cataforesi Anticorrosione Salina e Acidi di Pesce",
            question: "La batteria evaporante interna è protetta con trattamento di verniciatura cataforetica per resistere all'azione corrosiva dell'ammoniaca naturale del pesce e della salsedine marina, evitando fughe di gas refrigerante?",
            normReference: "UNI EN ISO 12944; CEI EN 60335-2-89; D.Lgs. 81/2008 art. 71 c. 4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_FRIGO_VASCHETTE_FORATE_MOCA",
            title: "Vaschette Forate in Acciaio Inox AISI 304/316 con Raccogliscolo e Separazione Liquidi",
            question: "Il vano frigo è allestito con vaschette forate estraibili con doppio fondo e raccogliscolo per evitare il ristagno del pesce nell'acqua di scioglimento del ghiaccio, certificate MOCA per contatto alimentare?",
            normReference: "Reg. CE 1935/2004; Reg. CE 853/2004 All. III Sez. VIII; D.Lgs. 29/2017",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_FRIGO_TERMOREGOLATORE_HACCP",
            title: "Monitoraggio Digitale Continuo della Temperatura (-2°C / +2°C) e Registrazione HACCP",
            question: "La temperatura di conservazione del pesce fresco è costantemente mantenuta nel range critico compreso tra -2°C e +2°C con allarmi di deviazione acustici/visivi e tracciamento delle anomalie per la sicurezza alimentare?",
            normReference: "Reg. CE 853/2004; Reg. CE 852/2004; D.Lgs. 193/2007",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_FRIGO_GUARNIZIONI_PEDALE_APERTURA",
            title: "Guarnizioni Magnetiche Estraibili Facilmente Sanificabili e Apertura a Pedale",
            question: "La porta è provvista di pedale per l'apertura a mani libere per scongiurare cross-contaminazioni batteriche durante la manipolazione del pesce e guarnizioni magnetiche integre e prive di fessurazioni o muffe?",
            normReference: "Reg. CE 852/2004 All. II Cap. V; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      // 15. Compattatore differenziata lido
      {
        machineKey: "compattatore_differenziata_lido",
        name: "Pressa Compattatrice Rifiuti e Cartoni da Spiaggia con Quadro Stagno IP65",
        type: "Macchina Industriale di Compattazione e Riduzione Volume Rifiuti Arenile",
        suggestedManufacturer: "Bramidan / Strautmann / Macfab",
        suggestedModel: "Bramidan B3 Marine Edition con Quadro Elettrico Stagno IP65",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BALN_COMPATTATORE_QUADRO_STAGNO_IP65",
            title: "Quadro Elettrico di Comando con Grado di Protezione Stagno IP65",
            question: "Il quadro elettrico e la pulsantiera di comando sono certificati con grado di protezione minimo IP65 per prevenire infiltrazioni di acqua piovana, sabbia e aerosol salino in ambiente esterno costiero?",
            normReference: "CEI EN 60529 (IP65); CEI EN 60204-1; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_COMPATTATORE_INTERBLOCCO_SPORTOTTO",
            title: "Interblocco di Sicurezza Meccanico/Elettrico dello Sportello di Carico (UNI EN 16500)",
            question: "Lo sportello di carico rifiuti è vincolato da microinterruttore di sicurezza con bloccaggio che inibisce la discesa del piatto pressante all'apertura, evitando qualsiasi pericolo di schiacciamento arti?",
            normReference: "UNI EN 16500:2014; D.Lgs. 81/2008 Titolo III All. V punto 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_COMPATTATORE_ARRESTO_EMERGENZA_CHIAVE",
            title: "Fungo d'Emergenza Rosso Riarmo Rotazione e Selettore a Chiave per Personale Autorizzato",
            question: "La macchina è provvista di pulsante di arresto di emergenza a fungo su fondo giallo ben visibile e selettore a chiave per interdire l'azionamento da parte di clienti o persone non addestrate?",
            normReference: "UNI EN ISO 13850; UNI EN 16500; D.Lgs. 81/2008 art. 71 c. 7",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_COMPATTATORE_VASCA_PERCOLATO",
            title: "Vasca di Raccolta Liquidi e Percolato Rifiuti con Valvola di Scarico",
            question: "La base della pressa è dotata di vasca stagna di raccolta dei liquidi di percolato generati dalla compattazione di lattine e rifiuti da spiaggia, con rubinetto di spurgo verso scarico autorizzato per evitare inquinamento del suolo?",
            normReference: "D.Lgs. 152/2006 (Testo Unico Ambientale) art. 186; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      // 16. Trattorino rimorchio spiaggia
      {
        machineKey: "trattorino_rimorchio_spiaggia",
        name: "Trattorino Gommato 4WD con Lampeggiante per Traino Puliscispiaggia e Mezzi Nautici",
        type: "Trattore Agricolo/Comunale Ruotato 4x4 per Movimentazione Arenile e Servizi Spiaggia",
        suggestedManufacturer: "Kubota / Antonio Carraro / John Deere",
        suggestedModel: "Kubota B2441 4WD / Antonio Carraro Tigre 3200 con Pneumatici Sand Garden",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.operatore_puliscispiaggia,
        safetyChecks: [
          {
            code: "BALN_TRATTORINO_TELAIO_ROPS_CINTURA",
            title: "Arco di Protezione Antiribaltamento ROPS Omologato e Cintura di Sicurezza",
            question: "Il trattorino è provvisto di roll-bar o telaio di protezione abbattibile/fisso ROPS certificato secondo direttive OECD e il sedile di guida è munito di cintura di sicurezza ventrale allacciata durante la guida sull'arenile?",
            normReference: "D.Lgs. 81/2008 Titolo III All. V punto 2.4; Direttiva 2003/37/CE; Codice della Strada",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_TRATTORINO_PNEUMATICI_SABBIA",
            title: "Pneumatici a Sezione Larga a Bassa Pressione per Arenile e Trazione 4x4",
            question: "Il trattorino adotta pneumatici 'turf/sand' a sezione allargata e bassa pressione per garantire manovrabilità su sabbia bagnata e asciutta evitando affossamenti improvvisi e ribaltamenti?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 4; Manuale d'Uso del Fabbricante",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BALN_TRATTORINO_GANCIO_TRAINO_SPINA",
            title: "Gancio di Traino Omologato con Perno e Copiglia Elastica di Fermo",
            question: "Il dispositivo di traino per il puliscispiaggia, carrelli lettini o rimorchi natanti presenta gancio omologato conforme C.d.S. provvisto di perno con coppiglia elastica o linguetta a scatto che impedisce lo sgancio accidentale durante il traino?",
            normReference: "Regolamento CEE-ONU 55; C.d.S. art. 57; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BALN_TRATTORINO_LAMPEGGIANTE_RETROMARCIA",
            title: "Lampeggiante Rotante Giallo a Luce Continua e Cicalino Acustico di Retromarcia",
            question: "Il mezzo è provvisto di lampeggiante giallo superiore attivo in ogni spostamento sulla spiaggia e segnalatore acustico di retromarcia per avvisare pedoni e bagnanti presenti sull'arenile?",
            normReference: "D.Lgs. 81/2008 All. VI punto 1.2; C.d.S. art. 153",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 2. RISTORAZIONE & ALIMENTARE
  {
    sectorKey: "ristorazione_alimentare",
    sectorLabel: "Ristorazione, Bar, Pasticceria, Panificazione e Alimentare",
    atecoPrefixes: ["56.", "10."],
    machines: [
      {
        machineKey: "affettatrice",
        name: "Affettatrice Professionale a Gravità",
        type: "Macchina Lavorazione Carni/Salumi",
        suggestedManufacturer: "Berkel / Sirman / RGV",
        suggestedModel: "V350 Special",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BLADE_GUARD_RING",
            title: "Anello Fisso di Protezione Lama (Paralama)",
            question: "La lama dell'affettatrice è protetta su tutto l'arco non lavorativo da un anello di protezione fisso e dal coprilama amovibile fissato con tirante conforme a norma UNI EN 1974?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; UNI EN 1974:2010",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "THICKNESS_INTERLOCK",
            title: "Dispositivo di Blocco Carro a Spessore Zero",
            question: "Il carro portamerce può essere sfilato per la sanificazione solo con la manopola graduata dello spessore posizionata su '0' (lama completamente coperta dalla vela)?",
            normReference: "UNI EN 1974:2010 punto 5.2.4; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "ZERO_VOLTAGE_RESTART",
            title: "Riarmo Spontaneo (Relè di Minima Tensione)",
            question: "L'affettatrice è dotata di pulsantiera di comando con relè di minima tensione che impedisce il riavvio spontaneo dopo una momentanea interruzione di corrente?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "PRESSAMERCE_SHIELD",
            title: "Pressamerce con Protezione Trasparente per le Dita",
            question: "Il piatto merci è provvisto di pressamerce ergonomico integro con schermo trasparente di protezione per evitare il contatto involontario delle dita con la lama?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; UNI EN 1974",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "impastatrice_spirale",
        name: "Impastatrice a Spirale / Planetaria",
        type: "Macchina per Impasti",
        suggestedManufacturer: "Pizzagroup / OEM / Sunmix",
        suggestedModel: "Spiral 30 / Planetary 20L",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "INTERLOCKED_GRID",
            title: "Riparo Mobile Interbloccato sulla Vasca (Griglia Inox)",
            question: "La vasca dell'impastatrice è dotata di griglia di protezione in acciaio inox con microinterruttore di sicurezza che arresta immediatamente gli organi in movimento quando sollevata?",
            normReference: "UNI EN 453:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "EMERGENCY_STOP_BUTTON",
            title: "Pulsante di Arresto di Emergenza a Fungo",
            question: "L'impastatrice è dotata di arresto di emergenza a ritenuta meccanica (fungo rosso su sfondo giallo) facilmente accessibile dall'operatore?",
            normReference: "D.Lgs. 81/2008 All. V p. 2; UNI EN ISO 13850",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "BOWL_CLEARANCE",
            title: "Distanza di Sicurezza tra Organo Lavoratore e Bordo Vasca",
            question: "La distanza tra la spirale/braccio e il fondo/pareti della vasca è tale da non generare zone di schiacciamento/intrappolamento delle mani durante la rotazione?",
            normReference: "UNI EN 453:2010 punto 5.2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "forno_convezione",
        name: "Forno a Convezione / Misto Vapore",
        type: "Attrezzatura Termica di Cottura",
        suggestedManufacturer: "Rational / Unox / Lainox",
        suggestedModel: "iCombi Pro / ChefTop",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "DOUBLE_GLASS_HEAT",
            title: "Porta con Doppio/Triplo Vetro Basso-Emissivo Termoisolante",
            question: "La porta del forno mantiene una temperatura superficiale esterna non scottante (schermo protettivo o vetro ventilato) per prevenire ustioni da contatto accidentale?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "STEAM_DOOR_STOP",
            title: "Blocco Ventole all'Apertura Porta ed Evacuazione Vapore",
            question: "All'apertura della porta del forno il moto dei ventilatori e l'erogazione di vapore vivo si arrestano automaticamente prima dello sgancio totale dell'anta?",
            normReference: "D.Lgs. 81/2008 All. V; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "friggitrice",
        name: "Friggitrice Industriale a Vasca Singola/Doppia",
        type: "Apparecchiatura di Cottura ad Olio",
        suggestedManufacturer: "Zanussi / Lotus / Angelo Po",
        suggestedModel: "FR20G / Professional Fry",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SAFETY_THERMOSTAT",
            title: "Termostato di Sicurezza a Riarmo Manuale (Anti-Autocombustione Olio)",
            question: "La friggitrice è dotata di termostato di massima temperatura (limite < 230°C) indipendente dal termostato di lavoro che stacca l'alimentazione prima del punto di fumo dell'olio?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "DRAIN_VALVE_LOCK",
            title: "Rubinetto di Scarico Olio con Blocco di Sicurezza",
            question: "La valvola di scarico del pozzetto olio caldo è provvista di sicura meccanica contro l'apertura involontaria e prolunga di scarico idonea?",
            normReference: "D.Lgs. 81/2008 All. V p. 7",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 2. IPERMERCATO & GDO ALIMENTARE (Superficie > 2.500 mq)
  {
    sectorKey: "ipermercato_gdo",
    sectorLabel: "Ipermercato e Grande Distribuzione Alimentare (GDO)",
    atecoPrefixes: ["47.11.1", "47.11.10"],
    machines: [
      // --- REPARTO 1: LOGISTICA E RICEVIMENTO MERCI ---
      {
        machineKey: "muletto_frontale_elettrico",
        name: "Carrello Elevatore Elettrico Frontale (Muletto)",
        type: "Apparecchio di Sollevamento e Movimentazione Merci",
        suggestedManufacturer: "Still / Toyota / Linde",
        suggestedModel: "RX 20 / Traigo 48",
        isSubjectToInailCheck: true,
        inailFrequencyYears: 1,
        training: TRAINING_REQUIREMENTS_LIBRARY.carrello_elevatore,
        safetyChecks: [
          {
            code: "MULETTO_ROPS_FOPS",
            title: "Tettuccio di Protezione Conducente (ROPS/FOPS)",
            question: "Il carrello è dotato di tettuccio di protezione integro contro la caduta di carichi dall'alto (FOPS) e contro lo schiacciamento da ribaltamento (ROPS)?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.4; UNI EN ISO 3691-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MULETTO_SAFETY_SEATBELT",
            title: "Cintura di Sicurezza o Sistema di Ritenuta Conducente",
            question: "Il sedile di guida è provvisto di cintura di sicurezza con avvolgitore (o barriere laterali) obbligatoria per trattenere l'operatore in cabina in caso di ribaltamento?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.4 e art. 71; Linee Guida ISPESL",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MULETTO_FORKS_CHAINS_INSPECTION",
            title: "Verifica Trimestrale Catene di Sollevamento e Usura Forche (< 10%)",
            question: "Le forche di sollevamento e le catene fleyer sono sottoposte a verifica periodica trimestrale con registrazione su libretto, usura del tallone inferiore al 10% e assenza di cricche?",
            normReference: "ISO 5057; D.Lgs. 81/2008 art. 71 c. 8",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "MULETTO_REVERSE_ALARM_BLUESPOT",
            title: "Cicalino Retromarcia, Lampeggiante e Segnalatore Blue Spot",
            question: "Il carrello è provvisto di avvisatore acustico bitonale in retromarcia, lampeggiante e sistema ottico di avvertimento pedoni Blue Spot / Red Zone funzionanti?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.2; UNI EN ISO 3691-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "MULETTO_LOAD_CHART",
            title: "Targhetta del Diagramma Portate Residue Visibile",
            question: "È chiaramente visibile e leggibile dal posto guida la targa indelebile con il diagramma delle portate residue in quota in funzione del baricentro del carico?",
            normReference: "D.Lgs. 81/2008 All. V p. 1.2; UNI EN ISO 3691-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "transpallet_elettrico_pedana",
        name: "Transpallet Elettrico con Pedana Operatore a Bordo",
        type: "Carrello Semovente con Conducente a Bordo su Pedana",
        suggestedManufacturer: "Jungheinrich / Still / BT Toyota",
        suggestedModel: "ERE 120 / EXH-S",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.carrello_elevatore,
        safetyChecks: [
          {
            code: "PEDANA_BELLY_BUTTON_SAFETY",
            title: "Pulsante Antischiacciamento sul Timone ('Pulsante Pancia')",
            question: "Sulla testata del timone è presente e funzionante il pulsante di sicurezza antipizzicamento che inverte immediatamente la marcia a contatto con il corpo dell'operatore?",
            normReference: "UNI EN ISO 3691-1 punto 4.4.2; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PEDANA_ELECTROMAGNETIC_BRAKE",
            title: "Freno Elettromagnetico ad Azione Automatica",
            question: "Rilasciando il timone o abbandonando la pedana operatore si attiva immediatamente il freno elettromagnetico di servizio e stazionamento a uomo morto?",
            normReference: "UNI EN ISO 3691-1 punto 4.3; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "PEDANA_SIDE_GUARDS_SENSOR",
            title: "Sponde Laterali di Protezione e Sensore Presenza Operatore",
            question: "La pedana ribaltabile/fissa è provvista di protezioni laterali di contenimento operatore integre e sensore presence-control sotto il pianale?",
            normReference: "UNI EN ISO 3691-1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PEDANA_EMERGENCY_DISCONNECT",
            title: "Fungo di Sgancio Rapido Alimentazione Batteria",
            question: "È presente sul cruscotto o sul telaio il pulsante rosso a fungo di arresto di emergenza per la disconnessione generale immediata del circuito batteria?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "transpallet_elettrico_terra",
        name: "Transpallet Elettrico con Timone - Uomo a Terra",
        type: "Carrello per Movimentazione Bassa con Timone",
        suggestedManufacturer: "Still / Toyota / Linde",
        suggestedModel: "ECV 10 / LWE140",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.transpallet_elettrico,
        safetyChecks: [
          {
            code: "TERRA_VERTICAL_TILLER_MICRO",
            title: "Microinterruttore di Sicurezza Timone Verticale e Marcia Lenta",
            question: "In posizione verticale del timone il transpallet arresta la trazione (freno inserito), salvo attivazione intenzionale del pulsante tartaruga di manovra lenta a timone eretto?",
            normReference: "UNI EN ISO 3691-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TERRA_BELLY_ANTISQUASH",
            title: "Pulsante Antipancia Antischiacciamento al Timone",
            question: "Il pulsante di sicurezza sulla testa timone inverte istantaneamente la traslazione in allontanamento dal conducente se premuto contro il corpo?",
            normReference: "UNI EN ISO 3691-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TERRA_EMERGENCY_STOP_BUTTON",
            title: "Fungo Rosso di Emergenza Staccabatteria",
            question: "È presente e funzionante il pulsante a fungo di arresto emergenza che toglie alimentazione istantanea all'impianto elettrico e mototamburo?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "transpallet_manuale",
        name: "Transpallet Manuale Idraulico",
        type: "Attrezzatura Manuale di Movimentazione Merci",
        suggestedManufacturer: "Lifter Pramac / Jungheinrich / Yale",
        suggestedModel: "GS Basic 25S4 / AM 22",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "TRANSPALLET_OVERLOAD_VALVE",
            title: "Valvola Limitatrice di Massima Pressione (Sovraccarico)",
            question: "Il gruppo pompa idraulica è provvisto di valvola di massima pressione tarata per impedire il sollevamento oltre la portata nominale (2.500 kg ben visibile sul telaio)?",
            normReference: "UNI EN ISO 3691-5; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "TRANSPALLET_STEERING_ROLLERS",
            title: "Rulli di Carico, Ruote Direzionali e Ritorno Verticale Timone",
            question: "I doppi rulli sotto le forche e le ruote sterzanti sono privi di crepe o sgranature e la molla del timone assicura il ritorno spontaneo in posizione verticale a riposo?",
            normReference: "UNI EN ISO 3691-5; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "TRANSPALLET_CONTROL_LEVER",
            title: "Leva di Comando a 3 Posizioni con Discesa Proporzionale",
            question: "La leva di comando sul timone commuta stabilmente tra sollevamento, folle (traino a ruote libere) e discesa con valvola di scarico progressiva senza scatti?",
            normReference: "UNI EN ISO 3691-5",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "pressa_compattatrice",
        name: "Pressa Compattatrice per Cartone e Plastica (Compattatore Verticale)",
        type: "Macchina per Trattamento e Compattazione Rifiuti / Imballaggi",
        suggestedManufacturer: "Bramidan / Strautmann / HSM / Orwak",
        suggestedModel: "B4 / BalePress 10 / Power 4240",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "PRESSA_GATE_INTERLOCK",
            title: "Interblocco di Sicurezza Portellone di Carico (UNI EN 16500)",
            question: "Il piatto pressante scende esclusivamente a portellone anteriore di carico completamente chiuso, con microinterruttore di sicurezza codificato a prova di manomissione?",
            normReference: "UNI EN 16500:2014; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PRESSA_EMERGENCY_STOP",
            title: "Pulsante di Arresto di Emergenza a Fungo",
            question: "La pressa è dotata di arresto di emergenza a ritenuta meccanica (fungo rosso su sfondo giallo) ad azione immediata facilmente raggiungibile sul fronte?",
            normReference: "UNI EN ISO 13850; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PRESSA_TWO_HAND_EJECTION",
            title: "Comando Protetto di Espulsione Balla a Due Mani",
            question: "Il sistema semiautomatico di espulsione e ribaltamento della balla legata richiede comando simultaneo protetto per evitare rischi di schiacciamento arti?",
            normReference: "UNI EN 16500:2014; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "pedana_di_carico",
        name: "Banchina Idraulica di Carico / Dock Leveller",
        type: "Pedana Elettroidraulica di Raccordo Automezzi",
        suggestedManufacturer: "Campisa / Armo / Hörmann / Kopron",
        suggestedModel: "Fidani Telescopic / Dock Leveller RH",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "PEDANA_PARACHUTE_VALVE",
            title: "Valvola Idraulica Paracadute di Blocco Caduta (EN 1398)",
            question: "Il cilindro idraulico principale di sollevamento è dotato di valvola di sicurezza paracadute che blocca all'istante la discesa della rampa in caso di allontanamento intempestivo dell'autocarro?",
            normReference: "UNI EN 1398:2009; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PEDANA_LATERAL_FOOT_GUARDS",
            title: "Bandelle Laterali Salvapiedi Giallo-Nere e Paracolpi in Gomma",
            question: "La banchina presenta bandelle laterali telescopiche salvapiedi con segnaletica zebrata giallo-nera e robusti respingenti in gomma antiurto integri a protezione della struttura?",
            normReference: "UNI EN 1398:2009; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "PEDANA_DOOR_INTERLOCK",
            title: "Interblocco Funzionale con Portone Sezionale di Baia",
            question: "Il quadro elettrico della rampa è asservito al portone sezionale, impedendo la movimentazione del ponte a portone chiuso o non totalmente sollevato?",
            normReference: "UNI EN 1398; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "stazione_ricarica_batterie",
        name: "Stazione di Ricarica Batterie Trazione Muletti",
        type: "Impianto e Apparecchiature Elettriche di Carica Accumulatori",
        suggestedManufacturer: "Fiamm / EnerSys / Zivan / Fronius",
        suggestedModel: "Selectiva 4.0 / Lifeplus Mod",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BATTERIE_ATEX_VENTILATION",
            title: "Aspirazione Idrogeno Antiscintilla ATEX (CEI EN 62485-3)",
            question: "L'area di ricarica accumulatori è provvista di cappa o impianto di aspirazione forzata antiscintilla ATEX o idonea aerazione naturale permanente calcolata per impedire atmosfere esplosive da idrogeno?",
            normReference: "CEI EN 62485-3 / CEI 21-39; D.Lgs. 81/2008 Titolo XI ATEX",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BATTERIE_EMERGENCY_EYEWASH",
            title: "Doccetta Lavaocchi di Emergenza a Prossimità Immediata",
            question: "Nelle immediate vicinanze dei punti di rabbocco/carica è presente una doccetta lavaocchi di emergenza (o doccia di emergenza) alimentata ad acqua potabile e regolarmente collaudata?",
            normReference: "UNI EN 15154-1/2; D.Lgs. 81/2008 art. 45",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BATTERIE_SPILL_KIT_NEUTRALIZER",
            title: "Kit Neutralizzante Acido Solforico e DPI III Categoria",
            question: "È disponibile sul posto polvere assorbente e neutralizzante specifica per acido solforico conforme al D.M. 24/01/2011, unitamente a guanti antiacido in nitrile/neoprene, visiera paraschizzi e grembiule?",
            normReference: "D.M. 24/01/2011; D.Lgs. 81/2008 art. 77 e 225",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BATTERIE_ELECTRICAL_DISCONNECT",
            title: "Fissaggio Raddrizzatori, Connettori REMA e Sgancio Rapido",
            question: "I caricabatterie industriali sono ancorati stabilmente a parete/supporto, i cavi con prese REMA sono integri privi di surriscaldamenti ed è presente un interruttore di sgancio rapido esterno?",
            normReference: "CEI EN 62485-3; CEI 64-8",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "scaffalature_portapallet",
        name: "Scaffalature Industriali Porta-Pallet ad Alta Portata",
        type: "Strutture di Stoccaggio Statiche Portapallet",
        suggestedManufacturer: "Metalsistem / Rosss / Marcegaglia",
        suggestedModel: "Unirack / Super 4-5-6 / Iron Man",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SCAFFALATURE_LOAD_SIGNS",
            title: "Cartelli di Portata Visibili per Corrente e Campata",
            question: "Su tutte le testate di corsia sono affissi e chiaramente leggibili i cartelli segnaletici di carico massimo per coppia di correnti e carico massimo complessivo di campata?",
            normReference: "UNI EN 15635:2009; D.Lgs. 81/2008 art. 63 e All. IV p. 1.4.4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SCAFFALATURE_LOCKING_PINS",
            title: "Perni di Sicurezza Metallici su Tutti i Correnti",
            question: "Tutti i nodi di aggancio tra correnti e montanti sono provvisti di spine/perni metallici di sicurezza inseriti per impedire lo sgancio accidentale da sollevamento involontario con le forche del muletto?",
            normReference: "UNI EN 15635 p. 8.1.1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SCAFFALATURE_COLUMN_PROTECTORS",
            title: "Paracolpi in Acciaio alla Base dei Montanti d'Angolo",
            question: "Tutti i montanti d'angolo e i passaggi carrelli sono provvisti di protezioni d'urto (paracolpi sagomati in acciaio) ancorati stabilmente a pavimento con tasselli strutturali?",
            normReference: "UNI EN 15512; UNI EN 15635",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SCAFFALATURE_ANNUAL_INSPECTION",
            title: "Ispezione Periodica Annuale Scaffalature (UNI EN 15635)",
            question: "L'azienda dispone del registro di controllo periodico e del verbale di ispezione tecnica annuale condotta da tecnico competente qualificato (metodo verde/giallo/rosso)?",
            normReference: "UNI EN 15635 p. 9.4; D.Lgs. 81/2008 art. 71 c. 8",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 2: REPARTO MACELLERIA ---
      {
        machineKey: "segaossa_nastro",
        name: "Segaossa Elettrico a Nastro per Carni e Ossa",
        type: "Macchina per Taglio Carni e Ossa Congelate",
        suggestedManufacturer: "Fimar / Sirman / Kolbe",
        suggestedModel: "SE 1830 / K 330",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SEGAOSSA_ADJUSTABLE_GUARD",
            title: "Guidalama Regolabile in Altezza con Riparo Fisso (UNI EN 12268)",
            question: "Il guidalama regolabile in altezza copre integralmente la lama nastro, lasciando scoperta unicamente la luce strettamente necessaria al passaggio del pezzo da tagliare?",
            normReference: "UNI EN 12268:2014; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SEGAOSSA_PUSHER_SHIELD",
            title: "Spingicarne Guidato con Schermo di Protezione Mani",
            question: "Il segaossa è provvisto di spingicarne scorrevole o basculante con schermo trasparente per evitare l'avvicinamento delle mani dell'operatore alla lama in moto?",
            normReference: "UNI EN 12268:2014; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SEGAOSSA_RAPID_MOTOR_BRAKE",
            title: "Freno Motore con Arresto Rapido Lama entro 4 Secondi",
            question: "La macchina è dotata di freno motore elettro-meccanico che arresta completamente il movimento della lama entro un massimo di 4 secondi dall'arresto o emergenza?",
            normReference: "UNI EN 12268 punto 5.2.2; CEI EN 60204-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SEGAOSSA_PULLEY_DOOR_SWITCH",
            title: "Microinterruttori Interbloccati sui Portelli delle Pulegge",
            question: "I portelli di chiusura pulegge superiore e inferiore sono dotati di microinterruttori di sicurezza con grado di protezione IP che impediscono l'avviamento a vani aperti?",
            normReference: "UNI EN 12268; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "tritacarne_refrigerato",
        name: "Tritacarne Refrigerato Professionale Industriale",
        type: "Macchina per Macinazione Carni con Gruppo Frigo",
        suggestedManufacturer: "Sirman / Minerva Omega / Kolbe",
        suggestedModel: "TC 32 Colorado / C/E 22 Refrigerato",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "TRITACARNE_NECK_SAFETY",
            title: "Bocca di Introduzione Salvadita (Altezza >= 120 mm, Foro max 52 mm)",
            question: "Il collo della tramoggia di carico presenta un'altezza minima di 120 mm e diametro massimo di 52 mm conforme a UNI EN 12331 per impedire il contatto con l'elica conica?",
            normReference: "UNI EN 12331:2010; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TRITACARNE_PESTLE_PRESENCE",
            title: "Pestello Spingicarne MOCA e Divieto Spinta Manuale",
            question: "È obbligatoriamente presente e utilizzato il pestello in materiale plastico alimentare MOCA ed è espressamente vietato l'uso di dita o utensili impropri per la spinta della carne?",
            normReference: "UNI EN 12331; Reg. CE 1935/2004",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TRITACARNE_DEAD_MAN_REVERSE",
            title: "Comando Inversione Marcia ad Azione Mantenuta e Fungo di Emergenza",
            question: "Il comando di inversione rotazione coclea funziona solo ad azione mantenuta (uomo presente) ed è provvisto di pulsante di arresto di emergenza a fungo?",
            normReference: "UNI EN 12331; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "insaccatrice_idraulica",
        name: "Insaccatrice Idraulica a Pistone per Carni",
        type: "Macchina Idraulica per Dosaggio e Insacco Impasti di Carne",
        suggestedManufacturer: "Talsa / Mainca / Sirman",
        suggestedModel: "H 26 / FC 25 / IS 30",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "INSACCATRICE_KNEE_LEVER",
            title: "Comando a Ginocchiera con Rilascio Istantaneo",
            question: "La leva di comando di salita pistone a ginocchiera arresta immediatamente il moto del pistone non appena l'operatore rilascia la pressione del ginocchio?",
            normReference: "UNI EN 12463:2014; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "INSACCATRICE_LID_LOCK",
            title: "Coperchio con Blocco Meccanico di Sicurezza",
            question: "Il coperchio del cilindro presenta robusto blocco meccanico a volantino e microinterruttore che impediscono la pressurizzazione idraulica a coperchio non serrato?",
            normReference: "UNI EN 12463:2014; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "INSACCATRICE_PRESSURE_VALVE",
            title: "Circuito Idraulico con Manometro e Valvola Limitatrice Tarata",
            question: "La centralina oleodinamica a bagno d'olio sigillato è provvista di manometro di controllo e valvola di sicurezza tarata per scaricare sovrapressioni?",
            normReference: "D.Lgs. 81/2008 All. V p. 7; Direttiva Macchine",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 3: REPARTO GASTRONOMIA E SALUMERIA ---
      {
        machineKey: "affettatrice_gravita_gdo",
        name: "Affettatrice Professionale a Gravità / Verticale Lama 370 mm",
        type: "Macchina da Taglio per Gastronomia e Salumeria",
        suggestedManufacturer: "Berkel / Sirman / Kolbe",
        suggestedModel: "Autocut 370 / Palladio 350",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "AFFETTATRICE_GDO_BLADE_RING",
            title: "Anello Fisso di Protezione Lama (Paralama UNI EN 1974)",
            question: "La lama è protetta su tutto l'arco non lavorativo da un anello fisso continuo e il coprilama è fissato stabilmente con tirante a norme UNI EN 1974?",
            normReference: "UNI EN 1974:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_GDO_ZERO_LOCK",
            title: "Dispositivo di Blocco Carro a Spessore Zero",
            question: "Il piatto portamerce può essere sfilato per pulizia e sanificazione solo posizionando la manopola di regolazione spessore fetta sullo zero (lama totalmente schermata dalla vela)?",
            normReference: "UNI EN 1974:2010 punto 5.2.4; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_GDO_MIN_VOLTAGE",
            title: "Relè di Minima Tensione Anti-Riarmo Spontaneo",
            question: "La pulsantiera di comando a bassa tensione è provvista di relè di minima tensione che impedisce la ripartenza spontanea dopo un blackout accidentale?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "AFFETTATRICE_GDO_HAND_SHIELD",
            title: "Pressamerce Ergonomico con Schermo Trasparente Salvadita",
            question: "Il piatto scorrevole è dotato di pressamerce integro con schermo trasparente di protezione in policarbonato per escludere contatti delle dita con la lama?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "forno_gastronomia_gdo",
        name: "Forno Misto Convezione/Vapore per Gastronomia e Polli",
        type: "Attrezzatura Termica di Cottura Professionale",
        suggestedManufacturer: "Rational / Lainox / Unox",
        suggestedModel: "iCombi Pro 10-1/1 / Naboo 101",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FORNO_GDO_VENTILATED_GLASS",
            title: "Porta con Vetro Termoisolante Ventilato Basso-Emissivo",
            question: "La porta della camera di cottura è dotata di doppio/triplo vetro ventilato che garantisce una temperatura esterna al tocco inferiore alle soglie di scottatura?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
          {
            code: "FORNO_GDO_FAN_STEAM_STOP",
            title: "Arresto Immediato Ventole ed Evacuazione Vapore all'Apertura",
            question: "Al primo scatto di apertura della maniglia della porta il moto dei ventilatori e l'immissione di vapore si arrestano automaticamente prima dello sgancio totale dell'anta?",
            normReference: "D.Lgs. 81/2008 All. V; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_GDO_HOOD_EXTRACTION",
            title: "Cappa di Aspirazione Fumi e Scarico Condense Canalizzato",
            question: "Il forno è asservito a cappa di aspirazione fumi o condensatore vapori integrato con scarico canalizzato a norma e scarico condensa a sifone?",
            normReference: "D.Lgs. 81/2008 All. IV p. 2; UNI EN 203-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "confezionatrice_sottovuoto_campana",
        name: "Confezionatrice Sottovuoto a Campana Professionale",
        type: "Macchina per Confezionamento Sottovuoto e Atmosfera Modificata",
        suggestedManufacturer: "Besser Vacuum / Orved / Valko",
        suggestedModel: "Evox 30 / VM 18 / Favola 42",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SOTTOVUOTO_PLEXI_LID_SAFETY",
            title: "Campana in Plexiglass con Pistoni a Gas e Blocco Anticaduta",
            question: "La campana trasparente in plexiglass ad alta resistenza è integra, priva di crepe o scheggiature e sostenuta da pistoni a gas idraulici con blocco anticaduta?",
            normReference: "D.Lgs. 81/2008 All. V; Direttiva Macchine",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SOTTOVUOTO_SEALING_BAR_COVER",
            title: "Barre Saldanti Protette e Disattivazione a Coperchio Aperto",
            question: "Le barre saldanti sono rivestite con nastro in teflon termoisolante integro e l'alimentazione ad alta intensità è disattivata a coperchio sollevato?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SOTTOVUOTO_PUMP_EXHAUST",
            title: "Pompa Vuoto con Filtro Disoleatore e Spia Livello Olio",
            question: "La pompa per vuoto è provvista di cartuccia disoleatrice fumi integra per evitare emissione di vapori d'olio nel locale e livello lubrificante controllato?",
            normReference: "D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 4: REPARTO PANETTERIA E FORNO ---
      {
        machineKey: "impastatrice_spirale_gdo",
        name: "Impastatrice a Spirale Industriale per Panificazione",
        type: "Macchina per Impasti Pesanti ad Alta Capacità",
        suggestedManufacturer: "Esmach / Pietro Berto / Sunmix",
        suggestedModel: "SPI 60 / Compact 60 / Sun 60",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "IMPASTATRICE_GDO_INTERLOCKED_GRID",
            title: "Riparo Mobile Interbloccato a Griglia Inox sulla Vasca",
            question: "La vasca è coperta da una griglia di protezione in acciaio inox con microinterruttore di sicurezza che arresta istantaneamente la spirale e la vasca al sollevamento?",
            normReference: "UNI EN 453:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "IMPASTATRICE_GDO_EMERGENCY_STOP",
            title: "Pulsante di Arresto di Emergenza a Fungo con Ritenuta Meccanica",
            question: "Sul pannello comandi è presente e funzionante il pulsante di arresto emergenza a fungo rosso con sblocco a rotazione conforme a UNI EN ISO 13850?",
            normReference: "UNI EN ISO 13850; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "IMPASTATRICE_GDO_BOWL_CLEARANCE",
            title: "Distanza di Sicurezza tra Organo Lavoratore e Bordo Vasca",
            question: "Le distanze di sicurezza tra la spirale/frangipasta e le pareti/fondo della vasca rispettano i franchi dimensionali della norma UNI EN 453 per prevenire schiacciamenti?",
            normReference: "UNI EN 453:2010 punto 5.2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "spezzatrice_arrotondatrice",
        name: "Spezzatrice / Arrotondatrice Esagonale per Impasti",
        type: "Macchina per Porzionatura e Formatrice Impasti",
        suggestedManufacturer: "Vitella / Sottoriva / Pietro Berto",
        suggestedModel: "SPA M 30 / Rosa Hexagonal / Robocut",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SPEZZATRICE_TWO_HAND_CONTROL",
            title: "Comando Bimanuale di Taglio o Coperchio Interbloccato (EN 12042)",
            question: "La fase di pressata e taglio con coltelli a stella/esagonali richiede azionamento bimanuale simultaneo o discesa di coperchio con microinterruttore di sicurezza codificato?",
            normReference: "UNI EN 12042:2014; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SPEZZATRICE_KNIFE_RING_COVER",
            title: "Anello Perimetrale di Schermatura Coltelli Divisori",
            question: "I coltelli divisori in acciaio inox sono completamente racchiusi dall'anello sagomato per impedire qualsiasi introduzione accidentale delle dita dell'operatore?",
            normReference: "UNI EN 12042:2014; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SPEZZATRICE_CLEANING_DISCONNECT",
            title: "Dispositivo di Blocco Elettromeccanico per Posizione Pulizia",
            question: "La macchina dispone di posizione di sblocco coltelli per pulizia e lavaggio giornaliero che esclude totalmente l'avviamento del motore di pressata?",
            normReference: "D.Lgs. 81/2008 art. 71; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "forno_rotativo_pane",
        name: "Forno Rotativo a Carrello Estraibile per Pane",
        type: "Impianto Termico di Cottura a Carrello Girevole",
        suggestedManufacturer: "Tagliavini / Polin / Mondial Forni",
        suggestedModel: "Rotor 60x80 / Pocket 4060 / Basic",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "FORNO_PANE_PANIC_RELEASE",
            title: "Maniglione Interno di Sicurezza Antipanico Apertura Porta",
            question: "La porta della camera di cottura è dotata di maniglione/dispositivo di sblocco interno che consente l'apertura immediata dall'interno in caso di intrappolamento accidentale dell'operatore?",
            normReference: "UNI EN 1673:2009; D.Lgs. 81/2008 art. 64 e All. IV p. 1.6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_PANE_RACK_STOP_INTERLOCK",
            title: "Microinterruttore Apertura Porta con Blocco Rotazione Carrello",
            question: "All'apertura della porta il moto rotatorio del carrello si arresta immediatamente e si attiva automaticamente la cappa aspirante fumi e vapori caldi?",
            normReference: "UNI EN 1673:2009; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "FORNO_PANE_THERMAL_SEALS",
            title: "Guarnizioni Termiche Integre e Valvola Sfogo Vapori",
            question: "Le guarnizioni perimetrali della porta sono integre per evitare fuoriuscite di calore/fumi e il condotto fumi è dotato di valvola di sovrapressione/scarico vapore efficiente?",
            normReference: "UNI EN 1673; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "tagliapane_professionale",
        name: "Macchina Tagliapane Industriale a Lame",
        type: "Macchina da Taglio Pagnotte a Lame Verticali",
        suggestedManufacturer: "Jac / Rollmatic / Vimar",
        suggestedModel: "Duro 450 / Samurai 45",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "TAGLIAPANE_INTERLOCKED_COVER",
            title: "Coperchio Superiore Interbloccato a Discesa (EN 13954)",
            question: "Il telaio porta lame si avvia esclusivamente a coperchio di protezione superiore abbassato e si arresta istantaneamente se il coperchio viene sollevato durante il taglio?",
            normReference: "UNI EN 13954:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TAGLIAPANE_PUSHER_PROTECTION",
            title: "Spintore Automatico con Protezione Frontale Bocca di Uscita",
            question: "Lo spintore del pane avanza automaticamente fino a fine corsa con arresto del ciclo ed è presente una griglia o scivolo protettivo che impedisce di raggiungere le lame dall'uscita?",
            normReference: "UNI EN 13954:2010; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "TAGLIAPANE_CRUMB_DRAWER_SAFETY",
            title: "Cassetto Raccoglibriciole con Blocco Sicurezza",
            question: "Il cassetto raccoglibriciole inferiore è provvisto di microinterruttore o carter fisso che impedisce l'accesso alla zona inferiore del pacco lame in moto?",
            normReference: "UNI EN 13954; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 5: REPARTO PESCHERIA ---
      {
        machineKey: "fabbricatore_ghiaccio_scaglie",
        name: "Fabbricatore di Ghiaccio a Scaglie Piatte per Banco Pesce",
        type: "Apparecchiatura Frigorifera per Conservazione Ittica",
        suggestedManufacturer: "Brema / Icematic / Scotsman",
        suggestedModel: "Muster 350 / Flake F 200 / Scale Ice 400",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "GHIACCIO_REFRIGERANT_SAFETY",
            title: "Circuito Frigorifero Sigillato Conforme UNI EN 378",
            question: "Il circuito frigorifero è privo di perdite di fluido refrigerante, provvisto di pressostati di sicurezza di alta e bassa pressione e registro manutenzione F-Gas se pertinente?",
            normReference: "UNI EN 378-1/2; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "GHIACCIO_MOCA_CYLINDER",
            title: "Cilindro Evaporatore e Coclea Conformi MOCA con Sanificazione",
            question: "Il cilindro evaporatore e la coclea raschiaghiaccio sono realizzati in acciaio inox alimentare certificato MOCA con procedura di sanificazione e disincrostazione documentata?",
            normReference: "Reg. CE 1935/2004 MOCA; Reg. CE 852/2004 HACCP",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "GHIACCIO_DRAIN_AIR_GAP",
            title: "Scarico con Sifone ad Interruzione d'Aria (Anti-Contaminazione)",
            question: "Lo scarico dell'acqua di condensa e sfioro è dotato di disconnessione idraulica con interruzione d'aria (air gap) per impedire ritorni biologici o reflussi fognari?",
            normReference: "Reg. CE 852/2004 All. II Cap. I",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "squamatore_elettrico",
        name: "Squamatore Elettrico Professionale per Pesce",
        type: "Attrezzatura Elettrica Portatile di Eviscerazione e Pulizia Ittica",
        suggestedManufacturer: "Sirman / KT (KoneTeollisuus)",
        suggestedModel: "KT-S Fish Scaler / Sirman Squamatore",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SQUAMATORE_SELV_TRANSFORMER",
            title: "Alimentazione SELV con Trasformatore di Sicurezza d'Isolamento",
            question: "L'apparecchio portatile opera a bassissima tensione di sicurezza (SELV max 24V) alimentato da trasformatore d'isolamento a doppio isolamento Classe II contro folgorazione in ambiente umido?",
            normReference: "CEI 64-8 sez. 7; CEI EN 60745-1; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SQUAMATORE_SPLASH_GUARD",
            title: "Schermo Paraschizzi e Protezione Dita su Testina Rotante",
            question: "Il mandrino rotante con rullo squamatore è provvisto di schermo trasparente paraschizzi sagomato per proteggere le mani dell'operatore e convogliare le squame?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SQUAMATORE_IP67_SEAL",
            title: "Grado di Protezione IP55/IP67 e Guaina Cavo Stagna Antitaglio",
            question: "L'impugnatura antiscivolo e il cavo di trasmissione flessibile garantiscono tenuta stagna certificata (minimo IP55/IP67) e assenza di lesioni all'isolamento?",
            normReference: "CEI EN 60529; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 6: PULIZIA E IGIENE CORSIE ---
      {
        machineKey: "lavasciuga_uomo_bordo",
        name: "Lavasciuga Pavimenti Industriale con Uomo a Bordo",
        type: "Macchina Semovente per Pulizia Industriale Pavimentazioni",
        suggestedManufacturer: "Comac / Tennant / Nilfisk",
        suggestedModel: "Innova 85 / T7 Ride-on / Viper AS710R",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "LAVASCIUGA_BEACON_BEEPER",
            title: "Lampeggiante di Segnalazione Visiva e Cicalino Retromarcia",
            question: "La macchina è provvista di lampeggiante arancione a 360° visibile a distanza e avvisatore acustico automatico di retromarcia attivi durante il lavaggio in corsia?",
            normReference: "UNI EN ISO 3691-1; D.Lgs. 81/2008 All. V p. 2.2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVASCIUGA_DEAD_MAN_SEAT",
            title: "Sensore Uomo a Bordo sul Sedile e Freno di Emergenza",
            question: "Il sedile di guida è dotato di microinterruttore di presenza operatore che blocca trazione e spazzole se il conducente si alza, oltre a freno di stazionamento ed emergenza a pedale?",
            normReference: "UNI EN ISO 3691-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LAVASCIUGA_LED_SQUEEGEE",
            title: "Fari LED Anteriori e Tergitore Posteriore con Sgancio Rapido",
            question: "Sono presenti fari LED anteriori di lavoro funzionanti e il tergitore parabolico è provvisto di sistema di sgancio di sicurezza antirottura in caso di urto contro montanti o testate scaffali?",
            normReference: "D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "LAVASCIUGA_TANK_OVERFLOW",
            title: "Sensore Elettronico di Troppopieno Serbatoio Recupero",
            question: "Il serbatoio dell'acqua sporca è provvisto di galleggiante/sensore elettronico che arresta tempestivamente il motore di aspirazione al raggiungimento del livello massimo?",
            normReference: "CEI EN 60335-2-72; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 3. SUPERMERCATO ALIMENTARE (Superficie 400 - 2.500 mq)
  {
    sectorKey: "supermercato_alimentare",
    sectorLabel: "Supermercato Alimentare (Superficie 400 - 2.500 mq)",
    atecoPrefixes: ["47.11.2", "47.11.20"],
    machines: [
      // --- REPARTO 1: LOGISTICA E DEPOSITO (env-super-magazzino) ---
      {
        machineKey: "stoccatore_elettrico_timone",
        name: "Carrello Elevatore Stoccatore a Timone con Sollevamento a Forche (Stacker)",
        type: "Carrello Semovente a Grande Alzata con Timone - Operatore a Terra",
        suggestedManufacturer: "Still / Jungheinrich / Toyota",
        suggestedModel: "EXV 12 / ERC 212 / SWE 120",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.transpallet_elettrico,
        safetyChecks: [
          {
            code: "STOCCATORE_BELLY_SAFETY",
            title: "Pulsante Antischiacciamento al Timone ('Pulsante Antipancia')",
            question: "Sulla testata del timone è presente e funzionante il pulsante di sicurezza antipancia che inverte istantaneamente il moto del carrello a contatto con il corpo dell'operatore?",
            normReference: "UNI EN ISO 3691-1 punto 4.4.2; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "STOCCATORE_CREEP_VERTICAL",
            title: "Dispositivo Marcia Lenta a Timone Verticale ('Marcia Tartaruga')",
            question: "Con timone in posizione verticale il carrello frena automaticamente, consentendo la manovra solo azionando intenzionalmente il pulsante tartaruga a velocità ridotta?",
            normReference: "UNI EN ISO 3691-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "STOCCATORE_EMERGENCY_DISCONNECT",
            title: "Fungo Rosso di Arresto di Emergenza / Staccabatteria",
            question: "Sul carrello è presente il pulsante a fungo rosso di emergenza a ritenuta meccanica che seziona immediatamente l'alimentazione generale della batteria di trazione?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "STOCCATORE_CHAINS_FORKS_CHECK",
            title: "Verifica Trimestrale Catene di Sollevamento e Usura Forche (< 10%)",
            question: "Le catene fleyer di sollevamento del montante e le forche sono sottoposte a verifica periodica trimestrale con registrazione su libretto e usura tallone < 10%?",
            normReference: "ISO 5057; D.Lgs. 81/2008 art. 71 c. 8",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "transpallet_elettrico_supermercato",
        name: "Transpallet Elettrico con Timone - Uomo a Terra",
        type: "Carrello per Movimentazione Bassa con Timone",
        suggestedManufacturer: "Still / Toyota / Linde",
        suggestedModel: "ECV 10 / LWE140",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.transpallet_elettrico,
        safetyChecks: [
          {
            code: "SUPER_TRANSP_BELLY_BUTTON",
            title: "Pulsante Antipancia di Sicurezza sul Timone",
            question: "Il pulsante di sicurezza rosso sulla testa timone inverte immediatamente la marcia a contatto con l'operatore prevenendo lo schiacciamento contro strutture fisse?",
            normReference: "UNI EN ISO 3691-1 punto 4.4.2; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_TRANSP_AUTO_BRAKE",
            title: "Freno Automatico Elettromagnetico a Rilascio Timone",
            question: "Rilasciando il timone o portandolo a finecorsa superiore/inferiore si attiva istantaneamente il freno elettromagnetico di stazionamento e servizio ad azione positiva?",
            normReference: "UNI EN ISO 3691-1 punto 4.3; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_TRANSP_HORN_SLOW",
            title: "Avvisatore Acustico (Clacson) e Funzione Marcia Lenta",
            question: "L'avvisatore acustico (clacson) è funzionante ed è presente la modalità marcia lenta per le movimentazioni di carico nei corridoi del supermercato?",
            normReference: "UNI EN ISO 3691-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "transpallet_manuale_supermercato",
        name: "Transpallet Manuale Idraulico 2.500 kg",
        type: "Attrezzatura Manuale di Movimentazione Merci",
        suggestedManufacturer: "Lifter Pramac / Jungheinrich",
        suggestedModel: "GS Basic 25S4 / AM 22",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SUPER_TPM_OVERLOAD_VALVE",
            title: "Valvola Limitatrice di Massima Pressione Idraulica",
            question: "Il gruppo pompa idraulico è dotato di valvola di massima pressione tarata per impedire il sollevamento oltre la portata nominale (2.500 kg ben visibile sul telaio)?",
            normReference: "UNI EN ISO 3691-5; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_TPM_TILLER_RETURN",
            title: "Ritorno a Molla del Timone in Posizione Verticale",
            question: "La molla di richiamo del timone assicura il ritorno spontaneo in posizione verticale a riposo, evitando che il timone abbandonato a terra costituisca pericolo di inciampo?",
            normReference: "UNI EN ISO 3691-5; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_TPM_POLY_ROLLERS",
            title: "Ruote Direzionali e Rulli di Carico in Poliuretano",
            question: "Le ruote direzionali e i rulli sotto le forche in poliuretano anti-traccia sono privi di crepe, tagli o deformazioni che possano pregiudicare la stabilità del carico?",
            normReference: "UNI EN ISO 3691-5; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "pressa_compattatrice_compatta",
        name: "Pressa Compattatrice Verticale per Cartone e Plastica (Baler compatta)",
        type: "Macchina Compattatrice Rifiuti e Imballaggi da Magazzino",
        suggestedManufacturer: "Bramidan / HSM / Strautmann",
        suggestedModel: "B4 / V-Press 605",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SUPER_PRESS_GATE_INTERLOCK",
            title: "Interblocco Cancello di Carico UNI EN 16500",
            question: "Il piatto pressante scende esclusivamente a portellone anteriore completamente chiuso, provvisto di microinterruttore di sicurezza codificato a prova di manomissione?",
            normReference: "UNI EN 16500:2014; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_PRESS_EMERGENCY_STOP",
            title: "Arresto d'Emergenza a Fungo con Ritenuta Meccanica",
            question: "Sul fronte della pressa è presente e facilmente accessibile il pulsante di arresto di emergenza a fungo rosso con ritenuta e sblocco a rotazione?",
            normReference: "UNI EN ISO 13850; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_PRESS_TWO_HAND_EJECTION",
            title: "Espulsione Balla a Due Mani Protetta",
            question: "Il dispositivo meccanico o idraulico di espulsione e ribaltamento della balla legata richiede comando simultaneo protetto a due mani per prevenire schiacciamenti?",
            normReference: "UNI EN 16500:2014; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "scaffalature_deposito_supermercato",
        name: "Scaffalature Industriali Porta-Pallet per Deposito Supermercato",
        type: "Strutture Statiche di Stoccaggio Merci Portapallet",
        suggestedManufacturer: "Metalsistem / Rosss",
        suggestedModel: "Super 1-2-3 / Unirack",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SUPER_SCAFF_LOAD_SIGNS",
            title: "Targhe di Portata Ben Visibili (UNI EN 15635)",
            question: "Sulle testate e sulle campate sono chiaramente affisse e leggibili le targhe di portata indelebili indicanti il carico massimo ammissibile per coppia di correnti e per campata?",
            normReference: "UNI EN 15635:2009; D.Lgs. 81/2008 art. 63 e All. IV p. 1.4.4",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SCAFF_SAFETY_PINS",
            title: "Perni e Spine di Sicurezza su Tutti i Correnti",
            question: "Tutti i nodi tra correnti orizzontali e montanti verticali sono dotati delle spine/perni metallici di sicurezza inseriti contro lo sgancio accidentale da sollevamento involontario?",
            normReference: "UNI EN 15635 p. 8.1.1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SCAFF_COLUMN_GUARDS",
            title: "Paracolpi d'Angolo a Terra in Acciaio",
            question: "I montanti d'angolo esposti al passaggio degli stoccatori e transpallet sono provvisti di robusti paracolpi sagomati in acciaio ancorati stabilmente al pavimento?",
            normReference: "UNI EN 15512; UNI EN 15635; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SCAFF_ANNUAL_INSPECTION",
            title: "Ispezione Periodica Annuale Scaffalature (UNI EN 15635)",
            question: "L'azienda dispone del registro di controllo periodico e del verbale di ispezione tecnica annuale condotta da tecnico qualificato (metodo verde/giallo/rosso)?",
            normReference: "UNI EN 15635 p. 9.4; D.Lgs. 81/2008 art. 71 c. 8",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "caricabatterie_trazione_supermercato",
        name: "Stazione di Ricarica Batterie Trazione Stoccatori e Transpallet",
        type: "Impianto e Apparecchiature Elettriche di Carica Accumulatori",
        suggestedManufacturer: "Fronius / Zivan / EnerSys",
        suggestedModel: "Selectiva / Lifeplus",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SUPER_BATT_HYDROGEN_VENTILATION",
            title: "Aerazione e Aspirazione Idrogeno (CEI EN 62485-3)",
            question: "La postazione di ricarica batterie è provvista di aerazione o aspirazione idonea calcolata per impedire atmosfere esplosive da idrogeno durante la fase di gassificazione?",
            normReference: "CEI EN 62485-3; D.Lgs. 81/2008 Titolo XI ATEX",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_BATT_EMERGENCY_EYEWASH",
            title: "Doccetta Lavaocchi di Emergenza (UNI EN 15154)",
            question: "Nelle immediate adiacenze del punto di ricarica è presente una doccetta lavaocchi di emergenza funzionante e periodicamente collaudata per primo soccorso da schizzi di acido?",
            normReference: "UNI EN 15154-1/2; D.Lgs. 81/2008 art. 45",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_BATT_ACID_SPILL_KIT",
            title: "Kit Neutralizzante Acido Solforico e DPI Specifici",
            question: "È prontamente disponibile il kit di polvere assorbente e neutralizzante specifica per acido solforico conforme al D.M. 24/01/2011, con guanti antiacido e visiera paraschizzi?",
            normReference: "D.M. 24/01/2011; D.Lgs. 81/2008 art. 77 e 225",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_BATT_PLUG_DISCONNECT",
            title: "Connettori REMA Integri e Interruttore di Sgancio Rapido",
            question: "I caricabatterie sono saldamente ancorati, i cavi con connettori REMA sono integri privi di surriscaldamenti ed è presente un interruttore di sgancio rapido esterno?",
            normReference: "CEI EN 62485-3; CEI 64-8",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 2: REPARTO MACELLERIA (env-super-macelleria) ---
      {
        machineKey: "tritacarne_refrigerato_supermercato",
        name: "Tritacarne Refrigerato Professionale da Banco",
        type: "Macchina da Banco per Macinazione Carni con Refrigerazione",
        suggestedManufacturer: "Sirman / Minerva Omega",
        suggestedModel: "TC 22 Barcellona / C/E 22",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SUPER_TRITA_NECK_GUARD",
            title: "Bocca di Introduzione Salvadita (UNI EN 12331, h >= 120 mm, foro max 52 mm)",
            question: "Il collo della tramoggia presenta altezza minima di 120 mm e diametro massimo di 52 mm a norma UNI EN 12331 per impedire il contatto accidentale delle dita con l'elica?",
            normReference: "UNI EN 12331:2010; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_TRITA_PESTLE_MOCA",
            title: "Obbligo Pestello Plastico MOCA e Divieto Spinta Manuale",
            question: "È obbligatoriamente presente e utilizzato il pestello in materiale plastico alimentare MOCA ed è espressamente vietata la spinta manuale della carne nel condotto?",
            normReference: "UNI EN 12331; Reg. CE 1935/2004 MOCA",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_TRITA_DEAD_MAN_REVERSE",
            title: "Inversione Marcia ad Azione Mantenuta e Fungo di Emergenza",
            question: "Il comando di inversione di marcia coclea funziona esclusivamente ad azione mantenuta (uomo presente) ed è provvisto di pulsante di arresto di emergenza a fungo?",
            normReference: "UNI EN 12331; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "termosigillatrice_vaschette_carni",
        name: "Termosigillatrice Professionale per Vaschette Carni in Atmosfera Protettiva (ATM)",
        type: "Macchina Confezionatrice Termosigillatrice Vaschette Alimentari in ATM",
        suggestedManufacturer: "Ilpra / Lavezzini / Valko",
        suggestedModel: "Foodpack Basic / VG 400",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SUPER_SIGIL_DRAWER_SAFETY",
            title: "Cassetto Protetto Antischiacciamento Dita",
            question: "Il cassetto porta-stampi scorrevole è dotato di sagoma protetta o costa sensibile antischiacciamento mani durante la fase di inserimento e chiusura ciclo?",
            normReference: "Direttiva Macchine 2006/42/CE; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SIGIL_DIGITAL_TEMP",
            title: "Regolatore Termico Digitale con Termostato di Sicurezza",
            question: "La piastra saldante è gestita da regolatore termico digitale provvisto di sonda termica e protezione contro surriscaldamenti anomali o corto circuiti?",
            normReference: "D.Lgs. 81/2008 art. 71; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SIGIL_PERIMETER_BLADE",
            title: "Coltello Perimetrale Sagomato Protetto nello Stampo",
            question: "Le lame sagomate di taglio e fustellatura del film plastico sono racchiuse all'interno della campana superiore riscaldata, inaccessibili durante il ciclo lavorativo?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; CEI EN 60204-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "segaossa_banco_macelleria",
        name: "Segaossa Elettrico da Banco per Macelleria",
        type: "Macchina da Banco per Taglio Carni e Ossa",
        suggestedManufacturer: "Sirman / Fimar",
        suggestedModel: "SO 1650 / SE 1550",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SUPER_SEGA_GUIDALAMA_SHIELD",
            title: "Guidalama Regolabile con Schermo Fisso (UNI EN 12268)",
            question: "Il guidalama regolabile in altezza copre integralmente la lama a nastro con schermo fisso, lasciando libera solo la luce strettamente necessaria al taglio del pezzo?",
            normReference: "UNI EN 12268:2014; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SEGA_MEAT_PUSHER",
            title: "Spingicarne Protettivo per Mani e Dita",
            question: "Il segaossa è corredato di spingicarne scorrevole integro con schermo protettivo per evitare l'avvicinamento manuale dell'operatore alla lama in moto?",
            normReference: "UNI EN 12268:2014; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SEGA_PULLEY_DOOR_SWITCH",
            title: "Microinterruttori di Sicurezza sui Carter Pulegge",
            question: "I portelli di accesso alle pulegge superiore e inferiore sono provvisti di microinterruttori di sicurezza interbloccati che impediscono l'avviamento a vano aperto?",
            normReference: "UNI EN 12268; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SEGA_RAPID_BRAKE",
            title: "Freno Elettromeccanico con Arresto Rapido entro 4s",
            question: "La macchina è provvista di dispositivo di arresto rapido motore che blocca completamente la rotazione della lama entro un massimo di 4 secondi dal comando di stop?",
            normReference: "UNI EN 12268 punto 5.2.2; CEI EN 60204-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 3: REPARTO GASTRONOMIA E SALUMERIA (env-super-gastronomia) ---
      {
        machineKey: "affettatrice_gravita_supermercato",
        name: "Affettatrice Professionale a Gravità per Salumeria Lama 350 mm",
        type: "Macchina Affettatrice per Salumi e Formaggi",
        suggestedManufacturer: "Berkel / Sirman",
        suggestedModel: "Domina / Palladio 350",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SUPER_AFF_BLADE_GUARD_RING",
            title: "Anello Fisso di Protezione Lama (Paralama UNI EN 1974)",
            question: "La lama è protetta su tutto l'arco non lavorativo da un anello fisso continuo e il coprilama amovibile è fissato saldamente con tirante conforme a norma UNI EN 1974?",
            normReference: "UNI EN 1974:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_AFF_ZERO_THICKNESS_LOCK",
            title: "Dispositivo di Blocco Carro a Spessore Zero",
            question: "Il carro portamerce può essere sfilato per pulizia e sanificazione solo posizionando la manopola di regolazione spessore fetta sullo zero (lama totalmente schermata)?",
            normReference: "UNI EN 1974:2010 punto 5.2.4; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_AFF_MIN_VOLTAGE_RELAY",
            title: "Relè di Minima Tensione Anti-Riarmo Spontaneo",
            question: "La pulsantiera di comando a bassa tensione è provvista di relè di minima tensione che impedisce il riavvio spontaneo dopo una momentanea interruzione di corrente?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_AFF_TRANSPARENT_PUSHER",
            title: "Pressamerce Trasparente Salvadita",
            question: "Il piatto merci è provvisto di pressamerce ergonomico integro con schermo trasparente di protezione in policarbonato per escludere contatti delle dita con la lama?",
            normReference: "UNI EN 1974; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "confezionatrice_sottovuoto_supermercato",
        name: "Confezionatrice Sottovuoto a Campana da Banco",
        type: "Macchina per Confezionamento Sottovuoto a Campana da Banco",
        suggestedManufacturer: "Besser Vacuum / Orved / Valko",
        suggestedModel: "Mistral / Evox 30",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SUPER_SOTT_PLEXI_LID_SAFETY",
            title: "Pistoni Anticaduta Campana in Plexiglass",
            question: "La campana trasparente in plexiglass ad alta resistenza è sostenuta da pistoni a gas idraulici con blocco anticaduta che ne impediscono la discesa violenta accidentale?",
            normReference: "D.Lgs. 81/2008 All. V; Direttiva Macchine",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SOTT_TEFLON_BARS",
            title: "Barre Saldanti Teflonate e Spegnimento a Coperchio Sollevato",
            question: "Le barre saldanti sono protette con nastro in teflon termoisolante integro e l'alimentazione elettrica di saldatura è interrotta a coperchio sollevato?",
            normReference: "CEI EN 60204-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_SOTT_VACUUM_PUMP",
            title: "Pompa Vuoto con Filtro Disoleatore e Spia Livello Olio",
            question: "La pompa del vuoto è provvista di cartuccia disoleatrice per prevenire vapori d'olio in ambiente ed è presente la spia per il controllo del lubrificante?",
            normReference: "D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "tagliagrana_filo_elettrico",
        name: "Macchina Spaccastagionati e Tagliagrana a Filo/Lama",
        type: "Macchina Professionale per Taglio e Porzionatura Formaggi Stagionati",
        suggestedManufacturer: "Sirman / Boska",
        suggestedModel: "Formatic / Vegas",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SUPER_TAGLIA_BIMANUAL_CONTROL",
            title: "Azionamento a Comando Bimanuale Sincronizzato o Carter Interbloccato",
            question: "L'azionamento di spacco e discesa della lama/filo di taglio richiede il comando bimanuale sincronizzato a uomo presente o la preventiva chiusura di carter protettivo?",
            normReference: "UNI EN ISO 13851; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_TAGLIA_SHATTER_SHIELD",
            title: "Schermo di Protezione Anti-Proiezione Schegge",
            question: "La zona di taglio e spacco presenta carter o schermo paraschegge per impedire l'espulsione violenta di frammenti di crosta o formaggio duro verso l'operatore?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_TAGLIA_EMERGENCY_STOP",
            title: "Pulsante di Arresto di Emergenza e Disattivazione Rapida",
            question: "La macchina è dotata di pulsante di arresto rapido o fungo di emergenza per bloccare istantaneamente la pressione idraulica o meccanica della lama?",
            normReference: "UNI EN ISO 13850; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 4: REPARTO PANETTERIA & PUNTO CALDO (env-super-panetteria) ---
      {
        machineKey: "forno_doratura_pane",
        name: "Forno Misto Ventilato per Doratura Pane e Pasticceria Precotta (Bake-Off)",
        type: "Forno Elettrico Professionale a Convezione per Rigenerazione e Doratura Pane",
        suggestedManufacturer: "Unox / Wiesheu / Lainox",
        suggestedModel: "Bakerlux Shop.Pro / Minimat",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SUPER_FORNO_DOUBLE_GLASS",
            title: "Doppio Vetro Ventilato Anti-Ustione (UNI EN 203-1)",
            question: "La porta della camera di cottura è dotata di doppio/triplo vetro ventilato termoisolante che assicura una temperatura superficiale esterna non scottante al contatto accidentale?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_FORNO_FAN_STOP",
            title: "Arresto Ventole all'Apertura Porta",
            question: "All'apertura della porta della camera di cottura il moto dei ventilatori e l'erogazione di vapore si arrestano automaticamente prima dello sgancio totale dell'anta?",
            normReference: "D.Lgs. 81/2008 All. V; Direttiva Macchine 2006/42/CE",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_FORNO_CONDENSING_HOOD",
            title: "Cappa a Condensazione Canalizzata Integrata",
            question: "Il forno è asservito a cappa di aspirazione/condensazione vapori canalizzata con scarico condensa a sifone per prevenire l'accumulo di vapori caldi nel locale?",
            normReference: "D.Lgs. 81/2008 All. IV p. 2; UNI EN 203-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_FORNO_DOOR_TWO_STEP",
            title: "Maniglia con Apertura di Sicurezza a Doppio Scatto",
            question: "La maniglia di apertura porta della camera opera con sblocco a due stadi per consentire l'evacuazione controllata dei vapori caldi prima dell'apertura completa?",
            normReference: "UNI EN 203-1; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "tagliapane_banco_supermercato",
        name: "Macchina Tagliapane Professionale da Banco a Lame Protette",
        type: "Macchina Tagliapane da Banco a Lame Verticali",
        suggestedManufacturer: "Jac / Rollmatic",
        suggestedModel: "Duro / Samurai Compact",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "SUPER_PANE_INTERLOCKED_LID",
            title: "Coperchio Superiore Interbloccato a Discesa (UNI EN 13954)",
            question: "Il gruppo lame si avvia esclusivamente a coperchio di protezione superiore abbassato e si arresta istantaneamente se il coperchio viene sollevato durante il ciclo di taglio?",
            normReference: "UNI EN 13954:2010; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_PANE_PUSHER_PROTECTION",
            title: "Spintore Automatico Protetto e Bocca Uscita Schermata",
            question: "Lo spintore del pane avanza automaticamente fino a fine corsa con arresto del ciclo ed è presente uno scivolo frontale che impedisce di raggiungere le lame dall'uscita?",
            normReference: "UNI EN 13954:2010; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_PANE_CRUMB_BOX",
            title: "Cassetto Raccoglibriciole con Vano Lame Inaccessibile",
            question: "Il cassetto raccoglibriciole inferiore è provvisto di carter o microinterruttore che interdice l'accesso alle estremità inferiori delle lame in moto durante lo svuotamento?",
            normReference: "UNI EN 13954; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 5: REPARTO PESCHERIA (env-super-pescheria) ---
      {
        machineKey: "fabbricatore_ghiaccio_supermercato",
        name: "Fabbricatore di Ghiaccio a Granuli per Banco Pesce",
        type: "Apparecchiatura Frigorifera per Conservazione Ittica",
        suggestedManufacturer: "Brema / Icematic / Scotsman",
        suggestedModel: "G 280 / Ice Flaker",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SUPER_GHIACCIO_UNI378_CIRCUIT",
            title: "Circuito Frigorifero Sigillato Conforme UNI EN 378",
            question: "Il circuito frigorifero è privo di perdite di fluido refrigerante, provvisto di pressostati di sicurezza di alta/bassa pressione e registro manutenzione F-Gas se pertinente?",
            normReference: "UNI EN 378-1/2; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_GHIACCIO_MOCA_MATERIALS",
            title: "Materiali Idonei MOCA e Igiene Alimentare",
            question: "Il cilindro evaporatore, la coclea raschiaghiaccio e la vasca di contenimento sono realizzati in acciaio inox o materiali MOCA certificati con procedura di sanificazione documentata?",
            normReference: "Reg. CE 1935/2004 MOCA; Reg. CE 852/2004 HACCP",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_GHIACCIO_AIR_GAP_DRAIN",
            title: "Scarico con Interruzione d'Aria (Air Gap) Anti-Reflusso Fognario",
            question: "Lo scarico dell'acqua di sbrinamento e sfioro è dotato di disconnessione idraulica con interruzione d'aria (air-gap) per impedire ritorni biologici o reflussi fognari?",
            normReference: "Reg. CE 852/2004 All. II Cap. I; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },

      // --- REPARTO 6 & 7: CORSIE E BARRIERA CASSE (env-super-corsie e env-super-casse-uffici) ---
      {
        machineKey: "lavasciuga_operatore_terra",
        name: "Lavasciuga Pavimenti Professionale Compatta con Operatore a Terra",
        type: "Macchina per Lavaggio e Asciugatura Pavimenti - Conducente a Terra",
        suggestedManufacturer: "Comac / Fimap / Nilfisk",
        suggestedModel: "Abila 50 / Genie / SC400",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SUPER_LAVASCIUGA_DEAD_MAN",
            title: "Timone con Uomo Presente (Arresto Trazione e Spazzole)",
            question: "I comandi sul timone funzionano con leva ad azione mantenuta (uomo presente), arrestando immediatamente trazione, rotazione spazzole ed erogazione acqua al rilascio?",
            normReference: "CEI EN 60335-2-72; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_LAVASCIUGA_TANKS",
            title: "Serbatoi Estraibili Lavabili con Galleggiante di Troppopieno",
            question: "I serbatoi di soluzione e recupero sono estraibili e sanificabili, provvisti di galleggiante di sicurezza che arresta il motore di aspirazione a riempimento completo?",
            normReference: "CEI EN 60335-2-72; D.Lgs. 81/2008 art. 71",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_LAVASCIUGA_INSULATION",
            title: "Isolamento Elettrico Stagno e Cavo o Caricabatterie a Norma",
            question: "I componenti elettrici, il motore e il cavo o caricabatterie garantiscono grado di protezione stagna IPX4 idoneo contro schizzi d'acqua durante le operazioni di lavaggio?",
            normReference: "CEI EN 60335-2-72; D.Lgs. 81/2008 art. 80",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "banco_cassa_nastro_motorizzato",
        name: "Banco Cassa con Nastro Trasportatore Motorizzato",
        type: "Postazione di Cassa con Nastro Trasportatore Merci Motorizzato",
        suggestedManufacturer: "Cefla / Intrac",
        suggestedModel: "Futura Plus / Compact Checkout",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SUPER_CASSA_STOP_PHOTOCELL",
            title: "Fotocellula di Stop a Fine Corsa Nastro",
            question: "A fine corsa del nastro trasportatore merci è presente una fotocellula ottica funzionante che arresta automaticamente il movimento del nastro all'interruzione del raggio?",
            normReference: "Direttiva Macchine 2006/42/CE; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_CASSA_FOOT_PEDAL",
            title: "Comando a Pedale ad Azione Mantenuta (Uomo Presente)",
            question: "L'avanzamento manuale del nastro da parte del cassiere è comandato da pedale ad azione mantenuta che arresta istantaneamente il moto non appena viene rilasciato?",
            normReference: "D.Lgs. 81/2008 All. V p. 2; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_CASSA_IDLER_GUARDS",
            title: "Protezione Antischiacciamento Mani sui Rulli Folli di Testata",
            question: "I rulli folli di rinvio e testata del nastro trasportatore presentano carterature fisse salvadita che impediscono infilamento o schiacciamento delle dita (UNI EN 619)?",
            normReference: "UNI EN 619; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SUPER_CASSA_EMERGENCY_STOP",
            title: "Pulsante di Disattivazione Rapida o Arresto Emergenza",
            question: "Il posto cassa è provvisto di pulsante di spegnimento o arresto di emergenza a portata immediata dell'operatore per togliere tensione al nastro trasportatore?",
            normReference: "UNI EN ISO 13850; D.Lgs. 81/2008 All. V p. 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 4. LOGISTICA, MAGAZZINO & TRASPORTI
  {
    sectorKey: "logistica_magazzino",
    sectorLabel: "Logistica, Magazzino, Spedizioni e Trasporti",
    atecoPrefixes: ["49.", "52.", "53."],
    machines: [
      {
        machineKey: "carrello_elevatore_frontale",
        name: "Carrello Elevatore Frontale (Muletto)",
        type: "Apparecchio di Sollevamento e Movimentazione",
        suggestedManufacturer: "Toyota / Linde / Jungheinrich / Still",
        suggestedModel: "Traigo 48 / E16C / RX20",
        isSubjectToInailCheck: true, // Soggetto a verifica periodica annuale INAIL / ARPA
        inailFrequencyYears: 1,
        training: TRAINING_REQUIREMENTS_LIBRARY.carrello_elevatore,
        safetyChecks: [
          {
            code: "ROPS_FOPS_CANOPY",
            title: "Tettuccio di Protezione Conducente (ROPS/FOPS)",
            question: "Il carrello è dotato di tettuccio di protezione integro contro la caduta di carichi dall'alto (FOPS) e contro lo schiacciamento da ribaltamento (ROPS)?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.4; UNI EN ISO 3691-1",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "SAFETY_SEATBELT",
            title: "Cintura di Sicurezza o Sistema di Ritenuta Conducente",
            question: "Il sedile di guida è provvisto di cintura di sicurezza con avvolgitore (o barriere laterali) obbligatoria per trattenere l'operatore in cabina in caso di ribaltamento?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.4 e art. 71; Linee Guida ISPESL",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "REVERSE_ALARM_FLASH",
            title: "Cicalino Acustico Retromarcia e Segnalatore Lampeggiante / Blue Spot",
            question: "Il carrello è provvisto di avvisatore acustico bitonale in retromarcia e proiettore luminoso (Blue Spot / lampeggiante) funzionanti per avvisare i pedoni?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.2; UNI EN ISO 3691-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FORK_WEAR_CHECK",
            title: "Integrità Forche di Sollevamento (Usura Tallone < 10%)",
            question: "Le forche di sollevamento risultano integre, prive di deformazioni permanenti, cricche visibili e con usura del tallone inferiore al 10% dello spessore nominale (ISO 5057)?",
            normReference: "ISO 5057; D.Lgs. 81/2008 art. 71 c. 8",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LOAD_CAPACITY_PLATE",
            title: "Targhetta del Diagramma Portate Visibile al Posto Guida",
            question: "È chiaramente leggibile e integra la targhetta con il diagramma delle portate residue in funzione dell'altezza di sollevamento e del baricentro del carico?",
            normReference: "D.Lgs. 81/2008 All. V p. 1.2; UNI EN ISO 3691-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "transpallet_elettrico",
        name: "Transpallet Elettrico con Timone",
        type: "Carrello per Movimentazione Bassa",
        suggestedManufacturer: "Jungheinrich / BT Toyota / Crown",
        suggestedModel: "EJE 116 / Levio LWE180",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.transpallet_elettrico,
        safetyChecks: [
          {
            code: "BELLY_BUTTON_SAFETY",
            title: "Pulsante Antinfortunistico Antipizzicamento sul Timone ('Pulsante Pancia')",
            question: "Sulla testata del timone è presente e funzionante il pulsante di sicurezza rosso che inverte immediatamente la marcia se premuto contro il corpo dell'operatore?",
            normReference: "UNI EN ISO 3691-1 punto 4.4.2; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "DEAD_MAN_BRAKE",
            title: "Freno di Stazionamento Elettromagnetico a Uomo Morto",
            question: "Portando il timone in posizione verticale o completamente orizzontale il transpallet frena automaticamente in sicurezza?",
            normReference: "UNI EN ISO 3691-1 punto 4.3; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "pressa_compattatrice",
        name: "Pressa Compattatrice per Cartone e Plastica",
        type: "Macchina per Imballaggi e Rifiuti",
        suggestedManufacturer: "Orwak / Strautmann / Bramidan",
        suggestedModel: "Compact 3110 / B4",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "PRESS_DOOR_INTERLOCK",
            title: "Interblocco di Sicurezza Portellone di Carico",
            question: "Il piatto pressante scende solo a portellone anteriore completamente chiuso con microinterruttore di sicurezza codificato a prova di manomissione?",
            normReference: "UNI EN 16500:2014; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TWO_HAND_EJECTION",
            title: "Comando di Espulsione Balla a Due Mani",
            question: "Il comando di ribaltamento/espulsione della balla richiede l'azionamento controllato a due mani o protezione per evitare schiacciamento arti?",
            normReference: "UNI EN 16500:2014; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 3. METALMECCANICA, OFFICINA & CARPENTERIA
  {
    sectorKey: "metalmeccanica_officina",
    sectorLabel: "Metalmeccanica, Carpenteria, Saldatura e Costruzioni Meccaniche",
    atecoPrefixes: ["25.", "28."],
    machines: [
      {
        machineKey: "tornio_parallelo",
        name: "Tornio Parallelo Tradizionale / CNC",
        type: "Macchina Utensile ad Asportazione Truciolo",
        suggestedManufacturer: "Graziano / Colchester / Comev",
        suggestedModel: "SAG 14 / Master 3200",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_utensili_metallo,
        safetyChecks: [
          {
            code: "CHUCK_GUARD_INTERLOCK",
            title: "Schermo di Protezione Mandrino con Microinterruttore Interbloccato",
            question: "Il mandrino autocentrante è protetto da un carter ribaltabile in policarbonato con microinterruttore di sicurezza che impedisce l'avvio della rotazione a carter alzato?",
            normReference: "UNI EN ISO 23125:2015; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "LEADSCREW_COVER",
            title: "Copertura a Soffietto/Telescopica Barra Scanalata e Vite Madre",
            question: "La vite madre e la barra di avanzamento del carro sono coperte da carter telescopici metallici o a spirale per impedire il trascinamento degli abiti dell'operatore?",
            normReference: "UNI EN ISO 23125:2015; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "FOOT_BRAKE_PEDAL",
            title: "Freno a Pedale Meccanico/Elettrico di Arresto Mandrino",
            question: "Lungo tutto il basamento è presente il pedale di arresto di emergenza ad azione rapida che blocca istantaneamente il mandrino e toglie tensione al motore?",
            normReference: "D.Lgs. 81/2008 All. V p. 2; UNI EN ISO 13850",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "mola_banco",
        name: "Mola da Banco / Smerigliatrice Fissa",
        type: "Macchina di Finitura / Smerigliatura",
        suggestedManufacturer: "Femi / Nebes / Optimum",
        suggestedModel: "BG 200 / Special 250",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_utensili_metallo,
        safetyChecks: [
          {
            code: "GRINDING_SHIELD_ADJUST",
            title: "Poggiamano Registrabile e Distanza dalla Mola (<= 2 mm)",
            question: "I supporti di appoggio del pezzo (poggiamano) sono registrabili e regolati a una distanza massima di 2 mm dalla superficie della mola per evitare trascinamenti?",
            normReference: "D.Lgs. 81/2008 All. V p. 6.3; UNI EN 13218",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "EYE_SHIELD_SPARK",
            title: "Schermi Trasparenti Paraschegge per gli Occhi",
            question: "Entrambe le mole abrasive sono dotate di schermi trasparenti regolabili in policarbonato antiurto per proteggere gli occhi dalle scintille e frammenti?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; UNI EN 13218",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CARTER_FLANGE_CHECK",
            title: "Carter Perimetrali in Fusione e Flange di Serraggio a Norma",
            question: "I carter metallici racchiudono le mole per almeno i 5/6 della circonferenza e le flange di bloccaggio presentano guarnizioni elastiche conformi?",
            normReference: "D.Lgs. 81/2008 All. V p. 6.1 e 6.2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "saldatrice_filo",
        name: "Saldatrice a Filo Continuo (MIG/MAG) / TIG",
        type: "Attrezzatura per Saldatura Termica",
        suggestedManufacturer: "Telwin / Miller / Fronius / Kemppi",
        suggestedModel: "Mastermig 300 / TransSteel",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.saldatura,
        safetyChecks: [
          {
            code: "WELDING_FUMES_EXTRACTION",
            title: "Presenza e Funzionamento Aspirazione Localizzata Fumi",
            question: "La postazione di saldatura è provvista di braccio aspirante orientabile localizzato sul punto di emissione con filtrazione o espulsione all'esterno (VDR Chimico)?",
            normReference: "D.Lgs. 81/2008 art. 71, 224 e All. IV p. 2",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CABLES_TORCH_INSULATION",
            title: "Isolamento Elettrico Cavi, Morsetti e Torcia",
            question: "I cavi di alimentazione, il cavo di massa con relativa pinza e la guaina della torcia risultano perfettamente isolati senza conduttori di rame scoperti o lesioni?",
            normReference: "CEI EN 60974-1; D.Lgs. 81/2008 art. 80 e All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "GAS_CYLINDER_ANCHOR",
            title: "Fissaggio Bombole Gas Tecnici con Catenella di Sicurezza",
            question: "Le bombole di gas in pressione (Argon, CO2, Miscela) sono saldamente assicurate con catenelle metalliche a carrello o parete per prevenirne la caduta?",
            normReference: "D.Lgs. 81/2008 All. V p. 7; D.M. 329/04",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 4. AUTORIPARAZIONE & GOMMISTI
  {
    sectorKey: "autoriparazione_meccanica",
    sectorLabel: "Officine Meccaniche, Meccatronica, Carrozzeria e Gommisti",
    atecoPrefixes: ["45.2"],
    machines: [
      {
        machineKey: "ponte_sollevatore_auto",
        name: "Ponte Sollevatore per Autoveicoli a 2 Colonne",
        type: "Apparecchio di Sollevamento Veicoli",
        suggestedManufacturer: "Ravaglioli / Corghi / OMCN",
        suggestedModel: "KPX 337 / ERCO 4000",
        isSubjectToInailCheck: true, // Soggetto a verifica periodica annuale INAIL / ARPA
        inailFrequencyYears: 1,
        training: TRAINING_REQUIREMENTS_LIBRARY.ponte_sollevatore,
        safetyChecks: [
          {
            code: "MECHANICAL_FALL_ARREST",
            title: "Dispositivo Meccanico Paracadute / Arpioni di Arresto Caduta",
            question: "Le colonne del ponte sollevatore presentano cricchetti/arpioni meccanici di sicurezza che bloccano automaticamente la discesa accidentale del carrello?",
            normReference: "UNI EN 1493:2010; D.Lgs. 81/2008 All. V e art. 71",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ARM_LOCK_MECHANISM",
            title: "Dispositivo Automatico di Bloccaggio Bracci Portanti",
            question: "I bracci telescopici orientabili si bloccano automaticamente nella loro posizione angolare non appena il ponte si solleva da terra di oltre 50 mm?",
            normReference: "UNI EN 1493:2010 punto 5.5.3",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "DEAD_MAN_CONTROLS",
            title: "Comandi di Salita/Discesa ad Azione Mantenuta (Uomo Presente)",
            question: "I comandi di salita e discesa richiedono la pressione continua dell'operatore e la discesa finale (< 200 mm da terra) emette segnale acustico salvapiedi?",
            normReference: "UNI EN 1493:2010; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "smontagomme",
        name: "Smontagomme Automatico Professionale",
        type: "Attrezzatura per Pneumatici",
        suggestedManufacturer: "Corghi / Giuliano / Mondolfo Ferro",
        suggestedModel: "Artiglio Master / Aquila",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "BEAD_BREAKER_GUARD",
            title: "Protezione Limitatrice Corsa Tallonatore",
            question: "La paletta stallonatrice laterale è provvista di battuta o riparo per impedire lo schiacciamento involontario degli arti inferiori dell'operatore?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; Direttiva Macchine",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "INFLATION_PRESSURE_LIMIT",
            title: "Manometro e Valvola Limitatrice di Pressione Gonfiaggio",
            question: "Il circuito di gonfiaggio è provvisto di limitatore di pressione tarato (max 3.5 bar per tallonatura) e manometro con scala omologata per prevenire scoppi?",
            normReference: "D.Lgs. 81/2008 All. V; D.M. 329/04",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "compressore_aria_serbatoio",
        name: "Compressore d'Aria a Pistoni / Vite con Serbatoio In Pressione",
        type: "Attrezzatura a Pressione (PED)",
        suggestedManufacturer: "Atlas Copco / Fini / Abac / Ceccato",
        suggestedModel: "Piston 500L / Genesis 11",
        isSubjectToInailCheck: true, // Recipienti > 25 bar*l soggetti a verifica periodica INAIL ogni 2/3 anni (D.M. 329/04)
        inailFrequencyYears: 3,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "SAFETY_PRESSURE_VALVE",
            title: "Valvola di Sicurezza Omologata con Sigillo di Piombatura",
            question: "Il serbatoio in pressione presenta valvola di sicurezza omologata PED regolarmente piombata e targhettata con pressione di intervento certificata?",
            normReference: "D.M. 329/04; D.Lgs. 81/2008 All. V e art. 71 c. 11",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BELT_PULLEY_CARTER",
            title: "Carter di Protezione Cinghie e Pulegge Trasmissione",
            question: "La trasmissione a cinghie e la ventola di raffreddamento sono completamente racchiuse in una griglia metallica fissa fissata con viti (rimovibile solo con attrezzo)?",
            normReference: "D.Lgs. 81/2008 All. V p. 6.1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
          {
            code: "CONDENSATE_DRAIN_VALVE",
            title: "Spurgo Periodico della Condensa e Controllo Corrosione Serbatoio",
            question: "È eseguito regolarmente lo spurgo della condensa acquosa dal fondo del serbatoio per prevenire fenomeni di corrosione interna e assottigliamento della lamiera?",
            normReference: "D.Lgs. 81/2008 art. 71 c. 4; D.M. 329/04",
            defaultSeverity: 2,
            defaultSanctionable: false,
          },
        ],
      },
    ],
  },

  // 5. EDILIZIA & IMPIANTISTICA
  {
    sectorKey: "edilizia_cantieri",
    sectorLabel: "Edilizia, Costruzioni, Demolizioni e Impiantistica di Cantiere",
    atecoPrefixes: ["41.", "42.", "43."],
    machines: [
      {
        machineKey: "ple_piattaforma_aerea",
        name: "Piattaforma di Lavoro Elevabile (PLE)",
        type: "Apparecchio di Sollevamento Persone",
        suggestedManufacturer: "JLG / Haulotte / Genie / Palfinger",
        suggestedModel: "Z-45/25 / Compact 10",
        isSubjectToInailCheck: true, // Soggetto a verifica annuale INAIL / ARPA
        inailFrequencyYears: 1,
        training: TRAINING_REQUIREMENTS_LIBRARY.ple,
        safetyChecks: [
          {
            code: "MOMENT_LIMITER_DEVICE",
            title: "Dispositivo Limitatore di Momento e di Carico nel Cestello",
            question: "La PLE è dotata di limitatore di momento antiribaltamento e limitatore di carico che bloccano i movimenti pericolosi all'approssimarsi del sovraccarico?",
            normReference: "UNI EN 280:2015; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "EMERGENCY_DESCENT_GROUND",
            title: "Comandi di Emergenza da Terra per Discesa Cestello",
            question: "Il quadro comandi a terra permette la discesa controllata e lo sblocco di emergenza del cestello in caso di malore o blocco dell'operatore in quota?",
            normReference: "UNI EN 280:2015 punto 5.7.4; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "HARNESS_ANCHOR_POINTS",
            title: "Punti di Ancoraggio Omologati per Imbracatura Anticaduta",
            question: "All'interno del cestello sono presenti e chiaramente identificati i punti di ancoraggio omologati (UNI EN 795) per i cordini con assorbitore delle imbracature dei lavoratori?",
            normReference: "D.Lgs. 81/2008 art. 115 e All. V; UNI EN 280",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "betoniera_cantiere",
        name: "Betoniera a Bicchiere da Cantiere",
        type: "Macchina per Impasti Edili",
        suggestedManufacturer: "Imer / Polieri / Lino Sella",
        suggestedModel: "Syntesi 350 / Mix 250",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "GEAR_CROWN_PROTECTION",
            title: "Carter di Protezione Corona Dentata e Pignone di Rotazione",
            question: "La corona dentata della botte e il pignone di comando sono protetti da carter continuo per impedire l'introduzione involontaria di mani o indumenti?",
            normReference: "UNI EN 12151; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "TILT_PEDAL_LOCK",
            title: "Pedale di Bloccaggio Volano di Ribaltamento",
            question: "Il volano di rotazione del bicchiere è provvisto di pedale di arresto a scatto meccanico per impedire il rovesciamento incontrollato della miscela?",
            normReference: "UNI EN 12151; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 6. FALEGNAMERIA & LAVORAZIONE LEGNO
  {
    sectorKey: "falegnameria_legno",
    sectorLabel: "Falegnameria, Arredamento e Fabbricazione Prodotti in Legno",
    atecoPrefixes: ["16.", "31."],
    machines: [
      {
        machineKey: "squadratrice_banco",
        name: "Sega Circolare Squadratrice a Lama Inclinabile",
        type: "Macchina per Taglio Legno",
        suggestedManufacturer: "SCM / Casadei / Felder",
        suggestedModel: "Si 400 / Kappa 450",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_legno,
        safetyChecks: [
          {
            code: "RIVING_KNIFE_GUARD",
            title: "Cuffia Sospesa con Cappa di Aspirazione e Coltello Divisore",
            question: "La lama è sormontata da cuffia di protezione sospesa registrabile collegata ad aspirazione trucioli e coltello divisore conforme alla norma UNI EN 1870-1?",
            normReference: "UNI EN 1870-1; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "BLADE_BRAKE_10SEC",
            title: "Freno Meccanico/Elettronico della Lama (< 10 secondi)",
            question: "All'arresto del motore la lama si ferma completamente entro un tempo massimo di 10 secondi tramite freno automatico?",
            normReference: "UNI EN 1870-1 punto 5.3; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "PUSH_STICK_PRESENT",
            title: "Presenza Spingipezzo Ergonomico a Bordo Macchina",
            question: "È presente sul banco e viene regolarmente utilizzato lo spingitoio in legno/plastica per il taglio di pezzi corti (< 30 cm) onde evitare il contatto dita-lama?",
            normReference: "D.Lgs. 81/2008 All. VI punto 2",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "pialla_filo_spessore",
        name: "Pialla a Filo e a Spessore Combinata",
        type: "Macchina Lavorazione Legno",
        suggestedManufacturer: "SCM / minimax / Griggio",
        suggestedModel: "FS 41 Elite / Formula f2",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_legno,
        safetyChecks: [
          {
            code: "PLANER_BRIDGE_GUARD",
            title: "Protezione a Ponte Registrabile dell'Albero Pialla",
            question: "L'albero portalame della pialla a filo è protetto da schermo a ponte regolabile in altezza e larghezza per coprire la parte non impegnata nella piallatura?",
            normReference: "UNI EN 859:2012; D.Lgs. 81/2008 All. V p. 6",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ANTI_KICKBACK_FINGERS",
            title: "Denti Antiritorno sulla Pialla a Spessore",
            question: "All'ingresso della pialla a spessore sono installati settori antiritorno snodati (pettine anti-kickback) funzionanti liberamente per gravità?",
            normReference: "UNI EN 860:2012; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "aspiratore_polveri_legno",
        name: "Impianto di Aspirazione Polveri e Trucioli (ATEX)",
        type: "Impianto di Captazione e Depolverazione",
        suggestedManufacturer: "Coral / Spänex / Alfarimini",
        suggestedModel: "Clean Dust 3000 / Eurofilter",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "ATEX_VENT_EXPLOSION",
            title: "Pannelli di Sfogo Antideflagrazione e Conformità ATEX",
            question: "Il filtro depolveratore e le canalizzazioni per polveri di legno combustibili presentano pannelli di sfogo ATEX con sfogo all'esterno e barriere tagliafuoco?",
            normReference: "D.Lgs. 81/2008 Titolo XI; UNI EN 12779; Direttiva 2014/34/UE",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ANTISTATIC_HOSES",
            title: "Tubazioni Flessibili Antistatiche con Messa a Terra",
            question: "I raccordi flessibili tra le macchine e i tubi rigidi d'aspirazione sono di tipo antistatico con spirale di rame collegata all'impianto di terra?",
            normReference: "CEI EN 60079-32-1; D.Lgs. 81/2008 Titolo XI",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 7. COMMERCIO AL DETTAGLIO & SUPERMERCATI
  {
    sectorKey: "commercio_dettaglio",
    sectorLabel: "Commercio al Dettaglio, Supermercati e Negozi Specializzati",
    atecoPrefixes: ["47."],
    machines: [
      {
        machineKey: "affettatrice_banco",
        name: "Affettatrice Professionale Banco Salumeria",
        type: "Macchina Lavorazione Carni/Salumi",
        suggestedManufacturer: "Berkel / Sirman",
        suggestedModel: "Red Line 300 / Palladio",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.macchine_alimentari,
        safetyChecks: [
          {
            code: "BLADE_GUARD_RING",
            title: "Anello Fisso di Protezione Lama (Paralama)",
            question: "La lama dell'affettatrice è protetta su tutto l'arco non lavorativo da un anello di protezione fisso e dal coprilama amovibile fissato con tirante conforme a norma UNI EN 1974?",
            normReference: "D.Lgs. 81/2008 All. V p. 6; UNI EN 1974:2010",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "ZERO_VOLTAGE_RESTART",
            title: "Riarmo Spontaneo (Relè di Minima Tensione)",
            question: "L'affettatrice è dotata di pulsantiera di comando con relè di minima tensione che impedisce il riavvio spontaneo dopo una momentanea interruzione di corrente?",
            normReference: "D.Lgs. 81/2008 All. V p. 2.1; CEI EN 60204-1",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "transpallet_magazzino",
        name: "Transpallet Elettrico per Ricevimento Merci",
        type: "Carrello per Movimentazione Bassa",
        suggestedManufacturer: "Jungheinrich / BT Toyota",
        suggestedModel: "EJE M15 / Levio",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.transpallet_elettrico,
        safetyChecks: [
          {
            code: "BELLY_BUTTON_SAFETY",
            title: "Pulsante Antinfortunistico Antipizzicamento sul Timone ('Pulsante Pancia')",
            question: "Sulla testata del timone è presente e funzionante il pulsante di sicurezza rosso che inverte immediatamente la marcia se premuto contro il corpo dell'operatore?",
            normReference: "UNI EN ISO 3691-1 punto 4.4.2; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "pressa_cartoni",
        name: "Pressa Compattatrice per Scatole e Cartoni",
        type: "Macchina per Imballaggi e Rifiuti",
        suggestedManufacturer: "Strautmann / Orwak",
        suggestedModel: "Bale Press 3110",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "PRESS_DOOR_INTERLOCK",
            title: "Interblocco di Sicurezza Portellone di Carico",
            question: "Il piatto pressante scende solo a portellone anteriore completamente chiuso con microinterruttore di sicurezza codificato a prova di manomissione?",
            normReference: "UNI EN 16500:2014; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },

  // 8. SANITÀ, AMBULATORI & LABORATORI
  {
    sectorKey: "sanita_ambulatori",
    sectorLabel: "Sanità, Strutture Residenziali, Ambulatori e Centri Medici",
    atecoPrefixes: ["86.", "87."],
    machines: [
      {
        machineKey: "autoclave_sterilizzazione",
        name: "Autoclave a Vapore di Sterilizzazione (Classe B)",
        type: "Attrezzatura a Pressione / Sterilizzazione",
        suggestedManufacturer: "Euronda / Melag / Mocom",
        suggestedModel: "Vacuklav 40 B+ / Classic 18",
        isSubjectToInailCheck: true, // Recipiente in pressione PED
        inailFrequencyYears: 2,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "PRESSURE_DOOR_LOCK",
            title: "Blocco Elettromeccanico Portello in Presenza di Pressione",
            question: "L'autoclave presenta un dispositivo di sicurezza a doppio consenso che impedisce tassativamente l'apertura dello sportello se la camera è in pressione (> 0.1 bar) o con ciclo attivo?",
            normReference: "UNI EN 13060:2015; D.Lgs. 81/2008 All. V",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
          {
            code: "CALIBRATED_SAFETY_VALVE",
            title: "Valvola di Sovrapressione Tarata e Certificata PED",
            question: "La camera è provvista di valvola di sicurezza tarata a marchio PED per scaricare istantaneamente eventuali sovrapressioni accidentali?",
            normReference: "D.M. 329/04; Direttiva 2014/68/UE (PED)",
            defaultSeverity: 4,
            defaultSanctionable: true,
          },
        ],
      },
      {
        machineKey: "poltrona_ambulatoriale",
        name: "Riunito / Poltrona per Visite con Azionamento Elettromeccanico",
        type: "Dispositivo Elettromedicale",
        suggestedManufacturer: "Castellini / Anthos / Stern Weber",
        suggestedModel: "Skema 6 / S200",
        isSubjectToInailCheck: false,
        training: TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche,
        safetyChecks: [
          {
            code: "CHAIR_SAFETY_BASE_SWITCH",
            title: "Dispositivo Antischiacciamento alla Base della Poltrona",
            question: "Il basamento e la base dello schienale sono dotati di microinterruttori sensibili che arrestano all'istante la discesa in caso di contatto con ostacoli o piedi dell'operatore?",
            normReference: "CEI EN 60601-1; D.Lgs. 81/2008 All. V",
            defaultSeverity: 3,
            defaultSanctionable: true,
          },
        ],
      },
    ],
  },
];

// Helper per identificare il catalogo settoriale idoneo in base al codice ATECO
export function getSectorMachineCatalogForAteco(atecoCode?: string | null): SectorMachineCatalog {
  if (!atecoCode) {
    return SECTOR_MACHINERY_CATALOGS[0]; // Ristorazione/Somministrazione come default
  }

  const clean = atecoCode.trim();
  const digitsOnly = clean.replace(/[^0-9]/g, "");

  // Troviamo il catalogo con il prefisso coincidente più lungo/specifico
  let bestMatch: { catalog: SectorMachineCatalog; matchLength: number } | null = null;

  for (const cat of SECTOR_MACHINERY_CATALOGS) {
    for (const p of cat.atecoPrefixes) {
      const pDigits = p.replace(/[^0-9]/g, "");
      const matchesClean = clean.startsWith(p);
      const matchesDigits = pDigits.length >= 2 && digitsOnly.startsWith(pDigits);
      if (matchesClean || matchesDigits) {
        const matchLen = Math.max(matchesClean ? p.length : 0, matchesDigits ? pDigits.length : 0);
        if (!bestMatch || matchLen > bestMatch.matchLength) {
          bestMatch = { catalog: cat, matchLength: matchLen };
        }
      }
    }
  }

  if (bestMatch) {
    return bestMatch.catalog;
  }

  // Fallback logistica/magazzino per settori industriali/commerciali generici
  const logisticaFallback = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "logistica_magazzino");
  return logisticaFallback || SECTOR_MACHINERY_CATALOGS[0];
}

// Interfaccia per gli allegati di scansione documenti (Libretto d'uso, Scheda tecnica, Certificato CE)
export interface MachineDocumentAttachment {
  fileName: string;
  fileSize: number; // in byte
  fileType: string; // es. "application/pdf" | "image/jpeg"
  dataUrl?: string; // base64 / data URL
  uploadedAt: string; // ISO
}

// Requisiti documentali obbligatori di legge comuni a tutte le macchine e attrezzature (D.Lgs. 81/08 Titolo III)
export const MANDATORY_DOCUMENTARY_CHECKS: MachineSafetyCheckDef[] = [
  {
    code: "DOC_CE_CERTIFICATION",
    title: "Presenza Certificazione e Conformità CE",
    question: "È presente in azienda la marcatura CE visibile con relativa attestazione/dichiarazione di conformità CE/UE rilasciata dal costruttore (oppure attestazione di rispondenza ai requisiti dell'All. V D.Lgs. 81/08 per macchinari ante-CE)?",
    normReference: "D.Lgs. 81/2008 art. 70 c. 1; D.Lgs. 17/2010 (Direttiva Macchine)",
    defaultSeverity: 3,
    defaultSanctionable: true,
  },
  {
    code: "DOC_WORKMANLIKE_INSTALLATION",
    title: "Installazione a Regola d'Arte e Conformità Impianti",
    question: "L'attrezzatura/macchinario è installata a regola d'arte secondo le istruzioni del costruttore, con ancoraggio stabile, spazi di lavoro e manutenzione idonei e allacciamenti impiantistici conformi alle norme CEI/UNI?",
    normReference: "D.Lgs. 81/2008 art. 71 c. 3 e D.M. 37/2008",
    defaultSeverity: 3,
    defaultSanctionable: true,
  },
  {
    code: "DOC_RISK_ASSESSMENT_DVR",
    title: "Valutazione dei Rischi Inserita nel DVR",
    question: "I rischi specifici connessi all'uso ordinario, straordinario, pulizia e manutenzione della macchina sono formalmente censiti e valutati nel Documento di Valutazione dei Rischi (DVR) aziendale?",
    normReference: "D.Lgs. 81/2008 art. 17 c. 1 lett. a, art. 28 e art. 71 c. 1",
    defaultSeverity: 4,
    defaultSanctionable: true,
  },
  {
    code: "DOC_USER_MANUAL",
    title: "Presenza Libretto d'Uso e Manutenzione",
    question: "Il libretto/manuale d'uso e manutenzione fornito dal fabbricante è disponibile in azienda in lingua italiana e prontamente consultabile dai lavoratori incaricati?",
    normReference: "D.Lgs. 81/2008 art. 70 c. 2 e art. 73 c. 1",
    defaultSeverity: 2,
    defaultSanctionable: true,
  },
];

export function getMandatoryDocumentaryChecksForMachine(machineName: string): MachineSafetyCheckDef[] {
  return MANDATORY_DOCUMENTARY_CHECKS.map((c) => ({
    ...c,
    question: c.question.includes("macchinario")
      ? c.question.replace("L'attrezzatura/macchinario", `L'attrezzatura "${machineName}"`)
      : c.question.includes("macchina")
      ? c.question.replace("della macchina", `di "${machineName}"`)
      : c.question,
  }));
}

// Interfaccia estesa per i metadati di una macchina salvati nel campo `note` (JSON)
export interface MachineFullDetailsMetadata {
  buildYear?: number;
  installationDate?: string; // Data installazione macchina (YYYY-MM-DD)
  ceStatus?: "ce_compliant" | "ante_ce_annex_v" | "non_compliant";
  // Requisiti documentali espliciti (Sì / No / Non Applicabile)
  ceCertificationPresent?: "yes" | "no" | "na";
  installationCompliant?: "yes" | "no" | "na";
  riskAssessmentInDvr?: "yes" | "no" | "na";
  manualPresent?: "yes" | "no" | "na";
  maintenanceLogPresent?: "yes" | "no" | "expired";
  lastMaintenanceDate?: string; // Data ultima manutenzione effettuata (YYYY-MM-DD)
  maintenancePeriodicityMonths?: number; // Periodicità manutenzione ordinaria (12 o 24 mesi)
  nextMaintenanceDate?: string; // Data prossima manutenzione programmata (YYYY-MM-DD)
  inailCheckRequired?: boolean;
  inailSerial?: string;
  inailPeriodicityMonths?: number; // Periodicità verifica periodica INAIL/ARPA ex art. 71 c. 11 (12 o 24 mesi)
  inailLastCheckDate?: string;
  inailNextCheckDate?: string;
  ceReleaseDate?: string; // Data di rilascio dichiarazione CE (documento permanente)
  installationCertifiedDate?: string; // Data certificazione installazione a regola d'arte (documento permanente)
  manualReleaseDate?: string; // Data edizione/rilascio libretto uso (documento permanente)
  requiredCourseCode?: string;
  requiredCourseTitle?: string;
  environmentId?: string; // ID locale di ubicazione (da Step 2)
  environmentName?: string; // Denominazione locale di ubicazione
  authorizedWorkerIds?: string[]; // IDs dei lavoratori dipendenti abilitati all'uso
  authorizedWorkerNames?: string[]; // Nominativi extra lavoratori abilitati all'uso
  manualDocument?: MachineDocumentAttachment; // Scansione Libretto Uso e Manutenzione
  technicalSheetDocument?: MachineDocumentAttachment; // Scansione Scheda Tecnica del Costruttore
  ceDeclarationDocument?: MachineDocumentAttachment; // Scansione Dichiarazione CE
  customRequirements?: MachineSafetyCheckDef[];
}

export function parseMachineMetadata(rawNote?: string | null): MachineFullDetailsMetadata {
  if (!rawNote) return {};
  try {
    if (rawNote.trim().startsWith("{") && rawNote.trim().endsWith("}")) {
      return JSON.parse(rawNote) as MachineFullDetailsMetadata;
    }
  } catch {
    // Non è JSON puro, fallback su nota testuale
  }
  return {};
}

export function serializeMachineMetadata(meta: MachineFullDetailsMetadata, originalNote?: string): string {
  // Salva come JSON compatto
  return JSON.stringify(meta);
}

// ---------------------------------------------------------------------------------
// MOTORE DINAMICO DI RACCOMANDAZIONE MACCHINE INCROCIATO SU LOCALI E CODICE ATECO
// ---------------------------------------------------------------------------------
export interface EnvironmentInputRef {
  id?: string;
  name: string;
  category?: string;
}

export interface SuggestedMachineWithEnvironment extends SectorMachineTemplate {
  targetEnvironmentId?: string;
  targetEnvironmentName?: string;
  targetEnvironmentCategory?: string;
  sourceReason: "environment" | "ateco";
}

export function getSuggestedMachinesForEnvironmentsAndAteco(
  environments: EnvironmentInputRef[] = [],
  atecoCode?: string | null,
): SuggestedMachineWithEnvironment[] {
  const suggested: SuggestedMachineWithEnvironment[] = [];
  const addedKeys = new Set<string>();

  const isRistoranteAteco = !!atecoCode && (
    atecoCode.startsWith("56.10.11") ||
    atecoCode.startsWith("56.10.10") ||
    atecoCode.startsWith("56.10.1") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("561011") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("56101")
  );
  const ristSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "ristorazione_somministrazione");
  const ristMachines = ristSector ? ristSector.machines : [];

  const isPizzeriaAteco = !!atecoCode && (
    atecoCode.startsWith("56.10.20") ||
    atecoCode.startsWith("56.10.2") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("561020") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("56102")
  );
  const pizSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "pizzeria_asporto");
  const pizMachines = pizSector ? pizSector.machines : [];

  const isMenseAteco = !!atecoCode && (
    atecoCode.startsWith("56.29.10") ||
    atecoCode.startsWith("56.29.1") ||
    atecoCode.startsWith("56.29.20") ||
    atecoCode.startsWith("56.29") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("562910") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("5629")
  );
  const menseSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "mense_catering_collettiva");
  const menseMachines = menseSector ? menseSector.machines : [];

  const isCateringEventiAteco = !!atecoCode && (
    atecoCode.startsWith("56.21.00") ||
    atecoCode.startsWith("56.21.0") ||
    atecoCode.startsWith("56.21") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("562100") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("5621")
  );
  const catSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "catering_eventi_banqueting");
  const catMachines = catSector ? catSector.machines : [];

  const isGelateriaAmbulanteAteco = !!atecoCode && (
    atecoCode.startsWith("56.10.41") ||
    (atecoCode.startsWith("56.10.4") && !atecoCode.startsWith("56.10.42")) ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("561041")
  );
  const gelSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "gelateria_pasticceria_ambulante");
  const gelMachines = gelSector ? gelSector.machines : [];

  const isFoodTruckAteco = !!atecoCode && (
    atecoCode.startsWith("56.10.42") ||
    (atecoCode.startsWith("56.10.4") && !atecoCode.startsWith("56.10.41") && !atecoCode.replace(/[^0-9]/g, "").startsWith("561041")) ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("561042") ||
    (atecoCode.replace(/[^0-9]/g, "").startsWith("56104") && !atecoCode.replace(/[^0-9]/g, "").startsWith("561041"))
  );
  const ftSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "food_truck_street_food");
  const ftMachines = ftSector ? ftSector.machines : [];

  const isIperAteco = !!atecoCode && (
    atecoCode.startsWith("47.11.1") ||
    atecoCode.startsWith("47.11.10") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("47111")
  );
  const iperSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "ipermercato_gdo");
  const iperMachines = iperSector ? iperSector.machines : [];

  const isSuperAteco = !!atecoCode && (
    atecoCode.startsWith("47.11.2") ||
    atecoCode.startsWith("47.11.20") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("47112")
  );
  const superSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "supermercato_alimentare");
  const superMachines = superSector ? superSector.machines : [];

  const isBarAteco = !!atecoCode && (
    atecoCode.startsWith("56.30") ||
    atecoCode.startsWith("56.3") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("5630") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("563")
  );
  const barSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "bar_caffetteria");
  const barMachines = barSector ? barSector.machines : [];

  const isHotelAteco = !!atecoCode && (
    atecoCode.startsWith("55.10") ||
    atecoCode.startsWith("55.1") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("5510") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("551")
  );
  const hotelSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "hotel_strutture_ricettive");
  const hotelMachines = hotelSector ? hotelSector.machines : [];

  const isHostelAteco = !!atecoCode && (
    atecoCode.startsWith("55.20.20") ||
    atecoCode.startsWith("55.20.2") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("552020") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("55202")
  );
  const hostelSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "ostello_residence");
  const hostelMachines = hostelSector ? hostelSector.machines : [];

  const isBnbAteco = !isHostelAteco && !!atecoCode && (
    atecoCode.startsWith("55.20.51") ||
    atecoCode.startsWith("55.20.5") ||
    atecoCode.startsWith("55.20") ||
    atecoCode.startsWith("55.2") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("552051") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("55205") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("5520") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("552")
  );
  const bnbSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "bnb_affittacamere");
  const bnbMachines = bnbSector ? bnbSector.machines : [];

  const isCampingAteco = !!atecoCode && (
    atecoCode.startsWith("55.30.00") ||
    atecoCode.startsWith("55.30.0") ||
    atecoCode.startsWith("55.30") ||
    atecoCode.startsWith("55.3") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("553000") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("55300") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("5530") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("553")
  );
  const campingSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "campeggio_villaggio");
  const campingMachines = campingSector ? campingSector.machines : [];

  const isBeachClubAteco = !!atecoCode && (
    atecoCode.startsWith("93.29.20") ||
    atecoCode.startsWith("93.29.2") ||
    atecoCode.startsWith("93.29") ||
    atecoCode.startsWith("93.2") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("932920") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("93292") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("9329") ||
    atecoCode.replace(/[^0-9]/g, "").startsWith("932")
  );
  const beachClubSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "stabilimento_balneare");
  const beachClubMachines = beachClubSector ? beachClubSector.machines : [];

  // 1. MACCHINE SUGGERITE IN BASE AI LOCALI CENSITI NELLO STEP 2
  for (const env of environments) {
    const envId = (env.id || "").toLowerCase();
    const cat = (env.category || "").toLowerCase();
    const nameLower = (env.name || "").toLowerCase();

    // Mappa la categoria del locale alle macchine pertinenti
    let matchingMachines: SectorMachineTemplate[] = [];

    // Reparti Ristorazione con Somministrazione (56.10.11 / 56.10.10 / 56.10.1 - Ristoranti, Trattorie, Osterie)
    if (
      envId === "env-rist-cucina" ||
      envId.includes("rist-cucina") ||
      (isRistoranteAteco && (envId === "env-cucina" || nameLower.includes("cucina") || nameLower.includes("cottura") || cat === "cucina"))
    ) {
      matchingMachines = ristMachines.filter((m) =>
        [
          "cucina_fuochi_gas",
          "forno_misto_ristorante",
          "friggitrice_ristorante",
          "abbattitore_temperatura",
          "frytop_piastra",
          "bollitore_cuocipasta",
          "cappa_aspirazione_cucina",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-rist-prep-fredda" ||
      envId.includes("rist-prep-fredda") ||
      (isRistoranteAteco && (nameLower.includes("preparazione") || nameLower.includes("fredda") || nameLower.includes("lavorazione")))
    ) {
      matchingMachines = ristMachines.filter((m) =>
        [
          "affettatrice_gravita_ristorante",
          "cutter_robot_tagliaverdure",
          "confezionatrice_sottovuoto_ristorante",
          "tritacarne_grattugia_ristorante",
          "frullatore_immersione_mixer",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-rist-plonge" ||
      envId.includes("rist-plonge") ||
      (isRistoranteAteco && (envId === "env-plonge" || nameLower.includes("plonge") || nameLower.includes("lavaggio") || nameLower.includes("stoviglie")))
    ) {
      matchingMachines = ristMachines.filter((m) =>
        [
          "lavastoviglie_capotta_plonge",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-rist-celle" ||
      envId === "env-rist-dispensa" ||
      envId.includes("rist-celle") ||
      envId.includes("rist-dispensa") ||
      (isRistoranteAteco && (envId === "env-cella" || envId === "env-dispensa" || nameLower.includes("cella") || nameLower.includes("celle") || nameLower.includes("dispensa") || (nameLower.includes("frigo") && !nameLower.includes("bar"))))
    ) {
      matchingMachines = ristMachines.filter((m) =>
        [
          "armadio_frigo_conservazione",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-rist-bar-cassa" ||
      envId.includes("rist-bar-cassa") ||
      envId.includes("rist-bar") ||
      (isRistoranteAteco && (envId === "env-sala" || nameLower.includes("bar") || nameLower.includes("cassa") || nameLower.includes("somministrazione") || nameLower.includes("banco") || cat === "sales_office" || cat === "public"))
    ) {
      matchingMachines = ristMachines.filter((m) =>
        [
          "fabbricatore_ghiaccio_ristorante",
          "macchina_caffe_espresso",
        ].includes(m.machineKey)
      );
    }

    // Reparti Pizzeria Tradizionale, al Taglio e Asporto / Delivery (56.10.20 / 56.10.2 / 561020 / 56102)
    else if (
      envId === "env-piz-laboratorio" ||
      envId === "env-piz-forno-legna" ||
      envId.includes("piz-laboratorio") ||
      envId.includes("piz-forno") ||
      (isPizzeriaAteco && (envId === "env-laboratorio" || envId === "env-forno" || nameLower.includes("forno") || nameLower.includes("laboratorio") || nameLower.includes("cottura")))
    ) {
      matchingMachines = pizMachines.filter((m) =>
        [
          "forno_pizze_professionale",
          "banco_pizza_refrigerato",
          "stendi_pizza_dilaminatrice",
          "cappa_aspirazione_forno_pizze",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-piz-impasto" ||
      envId.includes("piz-impasto") ||
      (isPizzeriaAteco && (nameLower.includes("impasto") || nameLower.includes("lievitazione")))
    ) {
      matchingMachines = pizMachines.filter((m) =>
        [
          "impastatrice_spirale_pizzeria",
          "spezzatrice_arrotondatrice_pizze",
          "armadio_ferma_lievitazione",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-piz-prep-ingredienti" ||
      envId.includes("piz-prep") ||
      (isPizzeriaAteco && (nameLower.includes("farcitur") || nameLower.includes("condiment") || nameLower.includes("ingredient") || nameLower.includes("preparazion")))
    ) {
      matchingMachines = pizMachines.filter((m) =>
        [
          "tagliamozzarella_sfilacciatrice",
          "affettatrice_gravita_pizzeria",
          "friggitrice_pizzeria",
          "cutter_robot_condimenti",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-piz-lavaggio" ||
      envId.includes("piz-lavaggio") ||
      (isPizzeriaAteco && (envId === "env-lavaggio" || nameLower.includes("teglie") || (nameLower.includes("lavaggio") && !nameLower.includes("stoviglie")) || (isPizzeriaAteco && nameLower.includes("lavaggio"))))
    ) {
      matchingMachines = pizMachines.filter((m) =>
        [
          "lavaoggetti_lavateglie",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-piz-celle" ||
      envId.includes("piz-celle") ||
      (isPizzeriaAteco && (envId === "env-cella" || nameLower.includes("cella") || nameLower.includes("celle") || nameLower.includes("dispensa") || nameLower.includes("deperibil") || (nameLower.includes("frigo") && !nameLower.includes("banco"))))
    ) {
      matchingMachines = pizMachines.filter((m) =>
        [
          "armadio_frigo_deperibili_pizza",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-piz-sala-asporto" ||
      envId.includes("piz-sala") ||
      envId.includes("piz-asporto") ||
      (isPizzeriaAteco && (nameLower.includes("sala") || nameLower.includes("asporto") || nameLower.includes("delivery") || nameLower.includes("bar") || nameLower.includes("cassa") || cat === "sales_office" || cat === "public"))
    ) {
      matchingMachines = pizMachines.filter((m) =>
        [
          "fabbricatore_ghiaccio_pizzeria",
          "macchina_caffe_pizzeria",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-piz-rifiuti" ||
      envId.includes("piz-rifiuti") ||
      (isPizzeriaAteco && (nameLower.includes("ceneri") || nameLower.includes("rifiuti") || cat === "waste"))
    ) {
      matchingMachines = pizMachines.filter((m) =>
        [
          "bidone_metallico_ceneri",
        ].includes(m.machineKey)
      );
    }

    // Reparti Mense Aziendali, Scolastiche, Ospedaliere e Centri Cottura Pasti Veicolati (56.29.10 / 56.29.1 / 56.29.20 / 56.29)
    else if (
      (envId === "env-mensa-cottura" ||
      envId.includes("mensa-cottura") ||
      (isMenseAteco && (envId === "env-cottura" || nameLower.includes("blocco caldo") || (nameLower.includes("cottura") && !nameLower.includes("lavaggio") && !nameLower.includes("pentole")) || (cat === "cucina" && !nameLower.includes("lavaggio"))))) &&
      !envId.includes("lavaggio") && !envId.includes("pentole") && !envId.includes("tunnel")
    ) {
      matchingMachines = menseMachines.filter((m) =>
        [
          "forno_industriale_carrello",
          "brasiera_ribaltabile_industriale",
          "pentola_cottura_indiretta",
          "abbattitore_roll_in",
          "cuocipasta_ribaltabile_industriale",
          "cappa_compensata_collettivita",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-mensa-mondatura" ||
      envId.includes("mensa-mondatura") ||
      (isMenseAteco && (nameLower.includes("mondatura") || nameLower.includes("ortofrutta") || nameLower.includes("lavaggio verdure")))
    ) {
      matchingMachines = menseMachines.filter((m) =>
        [
          "pelapatate_lavaverdure_industriale",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-mensa-prep-fredda" ||
      envId === "env-mensa-diete-speciali" ||
      envId.includes("mensa-prep-fredda") ||
      envId.includes("mensa-diete") ||
      (isMenseAteco && (nameLower.includes("preparazione fredda") || nameLower.includes("diete speciali") || nameLower.includes("diete") || nameLower.includes("lavorazione carni") || nameLower.includes("laboratorio freddo")))
    ) {
      matchingMachines = menseMachines.filter((m) =>
        [
          "tagliaverdure_cutter_industriale",
          "affettatrice_industriale_continua",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-mensa-confezionamento" ||
      envId.includes("mensa-confezionamento") ||
      (isMenseAteco && (nameLower.includes("confezionamento") || nameLower.includes("veicolati") || nameLower.includes("porzionamento") || nameLower.includes("logistica pasti")))
    ) {
      matchingMachines = menseMachines.filter((m) =>
        [
          "termosigillatrice_automatica_vaschette",
          "contenitori_isotermici_trasporto",
          "transpallet_inox_alimentare",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-mensa-sala-selfservice" ||
      envId.includes("mensa-sala") ||
      envId.includes("mensa-selfservice") ||
      (isMenseAteco && (nameLower.includes("selfservice") || nameLower.includes("self-service") || nameLower.includes("distribuzione pasti") || nameLower.includes("sala mensa") || cat === "sales_office" || cat === "public"))
    ) {
      matchingMachines = menseMachines.filter((m) =>
        [
          "linea_distribuzione_selfservice",
          "carrelli_termici_porta_gn",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-mensa-tunnel-stoviglie" ||
      envId.includes("mensa-tunnel") ||
      (isMenseAteco && (nameLower.includes("tunnel") || nameLower.includes("stoviglie") || (nameLower.includes("lavaggio") && nameLower.includes("vassoi"))))
    ) {
      matchingMachines = menseMachines.filter((m) =>
        [
          "lavastoviglie_tunnel_traino",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-mensa-lavaggio-pentole" ||
      envId.includes("mensa-lavaggio-pentole") ||
      (isMenseAteco && (nameLower.includes("pentole") || nameLower.includes("pot-washer") || nameLower.includes("lavaoggetti")))
    ) {
      matchingMachines = menseMachines.filter((m) =>
        [
          "lavaoggetti_ghigliottina_collettivita",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-mensa-celle-frigo" ||
      envId === "env-mensa-dispensa" ||
      envId.includes("mensa-celle") ||
      envId.includes("mensa-dispensa") ||
      (isMenseAteco && (nameLower.includes("celle") || nameLower.includes("cella") || nameLower.includes("dispensa") || nameLower.includes("campioni") || (nameLower.includes("frigo") && !nameLower.includes("banco"))))
    ) {
      matchingMachines = menseMachines.filter((m) =>
        [
          "armadio_congelatore_campioni",
          "celle_frigorifere_walkin",
        ].includes(m.machineKey)
      );
    }

    // Reparti Catering per Eventi, Banqueting e Ricevimenti (56.21.00 / 56.21.0 / 56.21 / 562100 / 5621)
    else if (
      envId === "env-cat-cucina-centrale" ||
      envId.includes("cat-cucina") ||
      (isCateringEventiAteco && (envId === "env-cucina" || nameLower.includes("cucina") || nameLower.includes("cottura") || cat === "cucina"))
    ) {
      matchingMachines = catMachines.filter((m) =>
        [
          "forno_combinato_catering",
          "abbattitore_temperatura_catering",
          "brasiera_ribaltabile_catering",
          "confezionatrice_sottovuoto_catering",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-cat-prep-fingerfood" ||
      envId === "env-cat-diete-allergeni" ||
      envId.includes("cat-prep") ||
      envId.includes("cat-diete") ||
      (isCateringEventiAteco && (nameLower.includes("fingerfood") || nameLower.includes("finger food") || nameLower.includes("diete") || nameLower.includes("allergeni") || (nameLower.includes("preparazione") && !nameLower.includes("cottura"))))
    ) {
      matchingMachines = catMachines.filter((m) =>
        [
          "affettatrice_gravita_catering",
          "cutter_robot_catering",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-cat-banchina-carico" ||
      envId === "env-cat-deposito-noleggio" ||
      envId.includes("cat-banchina") ||
      envId.includes("cat-deposito-noleggio") ||
      envId.includes("cat-noleggio") ||
      (isCateringEventiAteco && (nameLower.includes("banchina") || nameLower.includes("carico") || nameLower.includes("scarico") || nameLower.includes("furgon") || nameLower.includes("noleggio") || nameLower.includes("spedizion")))
    ) {
      matchingMachines = catMachines.filter((m) =>
        [
          "contenitori_isotermici_catering",
          "rampa_carico_alluminio",
          "roll_container_isotermico",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-cat-deposito-arredi" ||
      envId.includes("cat-deposito-arredi") ||
      envId.includes("cat-arredi") ||
      (isCateringEventiAteco && !envId.includes("noleggio") && !nameLower.includes("noleggio") && (nameLower.includes("arredi") || nameLower.includes("banqueting") || nameLower.includes("open-bar") || nameLower.includes("open bar") || nameLower.includes("ricevimenti") || nameLower.includes("scaldavivande")))
    ) {
      matchingMachines = catMachines.filter((m) =>
        [
          "forno_rigeneratore_mobile",
          "chafing_dish_scaldavivande",
          "friggitrice_mobile_catering",
          "fabbricatore_ghiaccio_catering",
          "banco_bar_mobile_luminoso",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-cat-lavaggio-rientro" ||
      envId.includes("cat-lavaggio") ||
      (isCateringEventiAteco && (nameLower.includes("rientro") || (nameLower.includes("lavaggio") && !nameLower.includes("cucina"))))
    ) {
      matchingMachines = catMachines.filter((m) =>
        [
          "lavastoviglie_capotta_catering",
          "lavaoggetti_teglie_catering",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-cat-deposito-gpl" ||
      envId === "env-cat-ufficio-logistica" ||
      envId.includes("cat-deposito-gpl") ||
      envId.includes("cat-gpl") ||
      envId.includes("cat-ufficio") ||
      (isCateringEventiAteco && (nameLower.includes("gpl") || nameLower.includes("bombole") || (nameLower.includes("ufficio") && !nameLower.includes("cucina")) || nameLower.includes("logistica")))
    ) {
      matchingMachines = catMachines.filter((m) =>
        [
          "quadro_elettrico_mobile",
          "bombole_gpl_cucina_campo",
        ].includes(m.machineKey)
      );
    }

    // Reparti Food Truck, Cibo di Strada e Ristorazione Ambulante Itinerante (56.10.42 / 56.10.4 / 561042 / 56104)
    else if (
      envId === "env-ft-vano-cottura" ||
      envId.includes("ft-vano-cottura") ||
      envId.includes("ft-cottura") ||
      (isFoodTruckAteco && (envId === "env-cottura" || nameLower.includes("cottura") || nameLower.includes("piastr") || (nameLower.includes("vano") && nameLower.includes("cottura")) || (nameLower.includes("cucina") && !nameLower.includes("sede"))))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "piastra_frytop_foodtruck",
          "friggitrice_incasso_foodtruck",
          "cappa_aspirazione_foodtruck",
          "affettatrice_compatta_blocco",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-vano-refrigerazione" ||
      envId.includes("ft-vano-refrigerazione") ||
      envId.includes("ft-refrigerazione") ||
      (isFoodTruckAteco && (nameLower.includes("refrigerazione") || nameLower.includes("freddo") || (nameLower.includes("vano") && (nameLower.includes("frigo") || nameLower.includes("freezer")))))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "banco_frigo_orizzontale_veicolare",
          "armadio_freezer_veicolare",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-banco-somministrazione" ||
      envId.includes("ft-banco-somministrazione") ||
      envId.includes("ft-somministrazione") ||
      (isFoodTruckAteco && (nameLower.includes("somministrazione") || nameLower.includes("banco") || nameLower.includes("portellone") || cat === "sales_office" || cat === "public"))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "vetrina_refrigerata_parafiato",
          "portellone_idraulico_banco",
          "estintore_polvere_co2_foodtruck",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-vano-generatore" ||
      envId.includes("ft-vano-generatore") ||
      envId.includes("ft-generatore") ||
      (isFoodTruckAteco && (nameLower.includes("generatore") || nameLower.includes("corrente") || nameLower.includes("elettric") || nameLower.includes("energia")))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "gruppo_elettrogeno_silenziato",
          "quadro_elettrico_veicolare",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-vano-bombole-gpl" ||
      envId.includes("ft-vano-bombole-gpl") ||
      envId.includes("ft-bombole") ||
      envId.includes("ft-gpl") ||
      (isFoodTruckAteco && (nameLower.includes("gpl") || nameLower.includes("bombole") || nameLower.includes("gas")))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "impianto_rilevazione_gas_gpl",
          "bombole_gpl_vano_ermetico",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-impianto-idrico" ||
      envId.includes("ft-impianto-idrico") ||
      envId.includes("ft-idrico") ||
      (isFoodTruckAteco && (nameLower.includes("idrico") || nameLower.includes("acqua") || nameLower.includes("lavello") || nameLower.includes("lavamani") || nameLower.includes("boiler") || nameLower.includes("autoclave")))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "autoclave_pompa_acqua_12v",
          "boiler_elettrico_compatto",
          "lavello_inox_ginocchio_veicolare",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-cabina-guida" ||
      envId.includes("ft-cabina-guida") ||
      envId.includes("ft-cabina") ||
      (isFoodTruckAteco && (nameLower.includes("cabina") || nameLower.includes("guida") || nameLower.includes("autocarro") || nameLower.includes("furgone")))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "estintore_polvere_co2_foodtruck",
          "quadro_elettrico_veicolare",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-deposito-rimessaggio" ||
      envId === "env-ft-area-carico-scarico" ||
      envId === "env-ft-magazzino-scorte" ||
      envId.includes("ft-deposito-rimessaggio") ||
      envId.includes("ft-rimessaggio") ||
      envId.includes("ft-carico-scarico") ||
      envId.includes("ft-magazzino") ||
      (isFoodTruckAteco && (nameLower.includes("rimessaggio") || nameLower.includes("carico") || nameLower.includes("scarico") || nameLower.includes("scorte") || cat === "warehouse"))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "gruppo_elettrogeno_silenziato",
          "bombole_gpl_vano_ermetico",
          "banco_frigo_orizzontale_veicolare",
          "armadio_freezer_veicolare",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-laboratorio-base" ||
      envId === "env-ft-spogliatoi-sede" ||
      envId.includes("ft-laboratorio") ||
      envId.includes("ft-spogliatoi") ||
      (isFoodTruckAteco && (nameLower.includes("laboratorio") || nameLower.includes("spogliato") || cat === "services"))
    ) {
      matchingMachines = ftMachines.filter((m) =>
        [
          "piastra_frytop_foodtruck",
          "affettatrice_compatta_blocco",
          "cappa_aspirazione_foodtruck",
          "lavello_inox_ginocchio_veicolare",
        ].includes(m.machineKey)
      );
    }

    // Reparti Gelateria e Pasticceria Ambulante Itinerante (56.10.41 / 56.10.4 / 561041)
    else if (
      envId === "env-gelamb-banco-veicolare" ||
      envId.includes("gelamb-banco") ||
      (isGelateriaAmbulanteAteco && (nameLower.includes("banco") || nameLower.includes("pozzetti") || (nameLower.includes("carapine") && !nameLower.includes("lavaggio") && !nameLower.includes("cella") && !nameLower.includes("stoccaggio")) || nameLower.includes("somministrazione") || cat === "sales_office" || cat === "public"))
    ) {
      matchingMachines = gelMachines.filter((m) =>
        [
          "banco_pozzetti_gelato_veicolare",
          "lavaporzionatore_flusso_continuo",
          "vetrina_monoporzioni_gelato",
          "portellone_panoramico_gelateria",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ft-crepes-waffle" ||
      envId.includes("crepes") ||
      envId.includes("waffle") ||
      (isGelateriaAmbulanteAteco && (nameLower.includes("crepe") || nameLower.includes("waffle")))
    ) {
      matchingMachines = gelMachines.filter((m) =>
        [
          "piastra_crepes_veicolare",
          "piastra_waffle_gaufre",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-gelamb-vano-tecnico-batterie" ||
      envId.includes("gelamb-vano-tecnico") ||
      envId.includes("gelamb-batterie") ||
      (isGelateriaAmbulanteAteco && (nameLower.includes("batterie") || nameLower.includes("inverter") || (nameLower.includes("tecnico") && !nameLower.includes("cucina")) || nameLower.includes("soft") || cat === "tecnici_esterno"))
    ) {
      matchingMachines = gelMachines.filter((m) =>
        [
          "macchina_gelato_soft_veicolare",
          "sistema_batterie_inverter_litio",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-gelamb-lab-pastorizzazione" ||
      envId.includes("gelamb-lab-pastorizzazione") ||
      (isGelateriaAmbulanteAteco && (nameLower.includes("pastorizz") || nameLower.includes("miscele")))
    ) {
      matchingMachines = gelMachines.filter((m) =>
        [
          "pastorizzatore_elettronico_gelato",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-gelamb-lab-mantecazione" ||
      envId.includes("gelamb-lab-mantecazione") ||
      (isGelateriaAmbulanteAteco && (nameLower.includes("manteca") || (nameLower.includes("laboratorio") && nameLower.includes("gelato"))))
    ) {
      matchingMachines = gelMachines.filter((m) =>
        [
          "mantecatore_orizzontale_gelato",
          "abbattitore_surgelatore_carapine",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-gelamb-lab-pasticceria" ||
      envId.includes("gelamb-lab-pasticceria") ||
      (isGelateriaAmbulanteAteco && (nameLower.includes("pasticceria") || nameLower.includes("ciald") || (nameLower.includes("laboratorio") && !nameLower.includes("gelato") && !nameLower.includes("pastorizz")) || cat === "production"))
    ) {
      matchingMachines = gelMachines.filter((m) =>
        [
          "planetaria_pasticceria_base",
          "sfogliatrice_banco_pasticceria",
          "forno_ventilato_pasticceria",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-gelamb-lavaggio-carapine" ||
      envId.includes("gelamb-lavaggio") ||
      (isGelateriaAmbulanteAteco && (nameLower.includes("lavaggio") || nameLower.includes("lavaoggetti") || nameLower.includes("stoviglie") || cat === "services"))
    ) {
      matchingMachines = gelMachines.filter((m) =>
        [
          "lavaoggetti_carapine_stoviglie",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-gelamb-cella-stoccaggio" ||
      envId === "env-gelamb-hangar-ricarica" ||
      envId.includes("gelamb-cella") ||
      envId.includes("gelamb-hangar") ||
      (isGelateriaAmbulanteAteco && (nameLower.includes("cella") || nameLower.includes("stoccaggio") || nameLower.includes("hangar") || nameLower.includes("rimessaggio") || cat === "warehouse"))
    ) {
      matchingMachines = gelMachines.filter((m) =>
        [
          "armadio_congelatore_carapine_sede",
        ].includes(m.machineKey)
      );
    }

    // Reparti Bar, Caffetteria, Snack Bar, Cocktail Bar e Birreria (56.30.00 / 56.30.0 / 56.30 / 56.3)
    else if (
      envId === "env-bar-cocktail-station" ||
      envId.includes("bar-cocktail-station") ||
      envId.includes("cocktail") ||
      (isBarAteco && (nameLower.includes("cocktail") || nameLower.includes("mixology") || nameLower.includes("barman")))
    ) {
      matchingMachines = barMachines.filter((m) =>
        [
          "cocktail_station_bar",
          "blender_frullatore_cocktail",
          "tritaghiaccio_professionale_bar",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-bar-banco-caffetteria" ||
      envId.includes("bar-banco-caffetteria") ||
      envId.includes("banco-caffetteria") ||
      (isBarAteco && (
        envId === "env-banco" ||
        nameLower.includes("caffetteria") ||
        nameLower.includes("banco bar") ||
        nameLower.includes("banco caffetteria") ||
        (nameLower.includes("banco") && !nameLower.includes("cocktail") && !nameLower.includes("retrobanco") && !nameLower.includes("bottiglie"))
      ))
    ) {
      matchingMachines = barMachines.filter((m) =>
        [
          "macchina_caffe_bar",
          "macinadosatore_caffe_ondemand",
          "lavabicchieri_bar_sottobanco",
          "fabbricatore_ghiaccio_bar",
          "vetrina_snack_refrigerata",
          "spremiagrumi_centrifuga_bar",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-bar-retrobanco-snack" ||
      envId.includes("bar-retrobanco-snack") ||
      envId.includes("retrobanco") ||
      (isBarAteco && (nameLower.includes("retrobanco") || nameLower.includes("snack") || nameLower.includes("panini") || nameLower.includes("tavola fredda")))
    ) {
      matchingMachines = barMachines.filter((m) =>
        [
          "piastra_panini_tostiera",
          "forno_microonde_speedoven",
          "affettatrice_gravita_bar",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-bar-spillatura-co2" ||
      envId.includes("bar-spillatura-co2") ||
      envId.includes("spillatura") ||
      (isBarAteco && !envId.includes("deposito") && !nameLower.includes("deposito") && !nameLower.includes("magazzino") && (nameLower.includes("spillatura") || nameLower.includes("spina") || nameLower.includes("bombole") || (nameLower.includes("birra") && !nameLower.includes("deposito") && !nameLower.includes("magazzino"))))
    ) {
      matchingMachines = barMachines.filter((m) =>
        [
          "spillatore_birra_bevande",
          "bombole_co2_azoto_spillatura",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-bar-celle-frigo" ||
      envId === "env-bar-deposito-bevande" ||
      envId.includes("bar-celle-frigo") ||
      envId.includes("bar-deposito-bevande") ||
      (isBarAteco && (nameLower.includes("celle") || nameLower.includes("deposito") || nameLower.includes("magazzino") || nameLower.includes("bevande") || (nameLower.includes("frigo") && !nameLower.includes("banco")) || cat === "warehouse"))
    ) {
      matchingMachines = barMachines.filter((m) =>
        [
          "armadio_frigo_bar_bevande",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-bar-tecnico-trattamento-acque" ||
      envId === "env-bar-plonge-lavaggio" ||
      envId.includes("bar-tecnico-trattamento-acque") ||
      envId.includes("bar-plonge-lavaggio") ||
      envId.includes("bar-trattamento-acque") ||
      (isBarAteco && (nameLower.includes("trattamento acque") || nameLower.includes("addolcitore") || nameLower.includes("depuratore") || nameLower.includes("osmosi") || nameLower.includes("plonge") || (nameLower.includes("lavaggio") && !nameLower.includes("bicchieri"))))
    ) {
      matchingMachines = barMachines.filter((m) =>
        [
          "impianto_addolcitore_acque",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-reception-hall" ||
      envId.includes("hotel-reception-hall") ||
      envId.includes("hotel-reception") ||
      (isHotelAteco && (nameLower.includes("reception") || nameLower.includes("hall") || nameLower.includes("portineria") || cat === "reception"))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        ["centrale_antincendio_evac", "ascensore_passeggeri_hotel"].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-camere-piano" ||
      envId.includes("hotel-camere-piano") ||
      envId.includes("hotel-camere") ||
      (isHotelAteco && (nameLower.includes("camere") || nameLower.includes("camera") || nameLower.includes("piano ospiti") || cat === "rooms"))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        ["centrale_antincendio_evac", "sanificatore_ozono_perossido"].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-sala-colazioni" ||
      envId.includes("hotel-sala-colazioni") ||
      (isHotelAteco && (nameLower.includes("sala colazioni") || nameLower.includes("buffet colazioni") || nameLower.includes("sala buffet")))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        [
          "distributore_bevande_calde_colazione",
          "linea_buffet_calda_induzione",
          "linea_buffet_refrigerata_colazioni",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-office-cucina-colazioni" ||
      envId.includes("hotel-office-cucina-colazioni") ||
      envId.includes("hotel-office-cucina") ||
      envId.includes("office-cucina-colazioni") ||
      (isHotelAteco && (nameLower.includes("office") || nameLower.includes("preparazione colazioni") || nameLower.includes("cucina colazioni")))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        ["distributore_bevande_calde_colazione", "linea_buffet_calda_induzione"].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-lavanderia-stireria" ||
      envId.includes("hotel-lavanderia-stireria") ||
      envId.includes("hotel-lavanderia") ||
      envId.includes("lavanderia-stireria") ||
      (isHotelAteco && (nameLower.includes("lavanderia") || nameLower.includes("stireria") || nameLower.includes("guardaroba") || cat === "laundry"))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        [
          "lavatrice_industriale_hotel",
          "essiccatore_rotativo_industriale",
          "calandra_mangano_stireria",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-deposito-housekeeping" ||
      envId.includes("hotel-deposito-housekeeping") ||
      (envId.includes("deposito-housekeeping") && !envId.includes("ost-") && !isHostelAteco) ||
      (isHotelAteco && (nameLower.includes("housekeeping") || nameLower.includes("riassetto") || nameLower.includes("deposito piani") || nameLower.includes("governante")))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        ["carrelli_housekeeping_piani", "monospazzola_lavasciuga_moquette"].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-centrale-idrica-legionella" ||
      envId.includes("hotel-centrale-idrica-legionella") ||
      envId.includes("hotel-centrale-idrica") ||
      envId.includes("centrale-idrica-legionella") ||
      (isHotelAteco && (nameLower.includes("idrica") || nameLower.includes("legionella") || nameLower.includes("autoclave") || nameLower.includes("biossido")))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        ["impianto_dosaggio_biossido_legionella"].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-centrale-termica-clima" ||
      envId.includes("hotel-centrale-termica-clima") ||
      envId.includes("hotel-centrale-termica") ||
      envId.includes("centrale-termica-clima") ||
      (isHotelAteco && (nameLower.includes("termica") || nameLower.includes("climatizzazione") || nameLower.includes("uta") || (nameLower.includes("centrale") && !nameLower.includes("antincendio") && !nameLower.includes("idrica"))))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        ["caldaia_centrale_termica_hotel", "centrale_trattamento_aria_uta"].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-vano-gruppo-elettrogeno" ||
      envId.includes("hotel-vano-gruppo-elettrogeno") ||
      envId.includes("gruppo-elettrogeno") ||
      (isHotelAteco && (nameLower.includes("elettrogeno") || nameLower.includes("generatore") || nameLower.includes("gruppo elettrogeno")))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        ["gruppo_elettrogeno_emergenza"].includes(m.machineKey)
      );
    } else if (
      envId === "env-hotel-vani-ascensori-montacarichi" ||
      envId.includes("hotel-vani-ascensori-montacarichi") ||
      envId.includes("hotel-vani-ascensori") ||
      envId.includes("ascensori-montacarichi") ||
      (isHotelAteco && (nameLower.includes("ascensori") || nameLower.includes("montacarichi") || nameLower.includes("elevatori")))
    ) {
      matchingMachines = hotelMachines.filter((m) =>
        ["ascensore_passeggeri_hotel", "montacarichi_servizio_piani"].includes(m.machineKey)
      );
    }

    // Reparti Ostelli della Gioventù, Residence Turistici, Case per Ferie e Alloggi Comunitari (55.20.20 / 55.20.2 / 552020 / 55202)
    else if (
      envId === "env-ost-reception-lounge" ||
      envId.includes("ost-reception-lounge") ||
      envId.includes("ost-reception") ||
      (isHostelAteco && (nameLower.includes("reception") || nameLower.includes("lounge") || nameLower.includes("portineria") || cat === "reception"))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "distributore_snack_bevande_h24",
          "distributore_caffe_bevande_calde",
          "centrale_antincendio_indirizzata_ostello",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-dormitori-camerate" ||
      envId === "env-ost-camere-private" ||
      envId.includes("ost-dormitori") ||
      envId.includes("ost-camerate") ||
      envId.includes("ost-camere-private") ||
      (isHostelAteco && (nameLower.includes("dormitori") || nameLower.includes("camerat") || nameLower.includes("camera") || nameLower.includes("camere") || cat === "rooms"))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "aspirapolvere_battitappeto_hepa",
          "centrale_antincendio_indirizzata_ostello",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-servizi-igienici-comuni" ||
      envId.includes("ost-servizi-igienici") ||
      envId.includes("ost-bagni") ||
      (isHostelAteco && (nameLower.includes("igienici") || nameLower.includes("bagni") || nameLower.includes("docce") || nameLower.includes("wc") || cat === "bathrooms"))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "carrello_housekeeping_multitasche",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-cucina-condivisa" ||
      envId.includes("ost-cucina-condivisa") ||
      envId.includes("ost-cucina") ||
      (isHostelAteco && (nameLower.includes("cucina") || nameLower.includes("cottura") || cat === "kitchen"))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "piano_induzione_comunitario_ostello",
          "forno_microonde_inox_comunitario",
          "lavastoviglie_ciclo_breve_ostello",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-dispensa-frigo-ospiti" ||
      envId.includes("ost-dispensa-frigo") ||
      envId.includes("ost-frigo-ospiti") ||
      (isHostelAteco && (nameLower.includes("dispensa") || nameLower.includes("frigo ospiti") || (nameLower.includes("frigo") && !nameLower.includes("bar"))))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "frigorifero_multiposto_ospiti",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-lavanderia-self" ||
      envId.includes("ost-lavanderia-self") ||
      envId.includes("ost-lavanderia") ||
      (isHostelAteco && (nameLower.includes("lavanderia") || nameLower.includes("self") || cat === "laundry"))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "lavatrice_selfservice_gettone",
          "asciugatrice_selfservice_gettone",
          "ferro_stiro_aspirante_comunitario",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-deposito-housekeeping" ||
      envId === "env-ost-area-rifiuti" ||
      envId.includes("ost-deposito-housekeeping") ||
      envId.includes("ost-area-rifiuti") ||
      envId.includes("ost-rifiuti") ||
      (isHostelAteco && (nameLower.includes("housekeeping") || nameLower.includes("riassetto") || nameLower.includes("pulizi") || nameLower.includes("rifiuti") || nameLower.includes("immondiz") || cat === "waste"))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "carrello_housekeeping_multitasche",
          "lavasciuga_pavimenti_compatta_ostello",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-deposito-bagagli" ||
      envId.includes("ost-deposito-bagagli") ||
      envId.includes("ost-lockers") ||
      (isHostelAteco && (nameLower.includes("bagagli") || nameLower.includes("lockers") || nameLower.includes("locker")))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "lockers_elettronici_bagagli",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-centrale-termica-acs" ||
      envId.includes("ost-centrale-termica-acs") ||
      envId.includes("ost-centrale-termica") ||
      envId.includes("ost-acs") ||
      (isHostelAteco && (nameLower.includes("centrale termica") || nameLower.includes("caldaia") || nameLower.includes("boiler") || nameLower.includes("acs") || cat === "boiler_room"))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "caldaia_centrale_acs_legionella",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-ost-corridoi-scale-esodo" ||
      envId.includes("ost-corridoi-scale-esodo") ||
      envId.includes("ost-corridoi") ||
      envId.includes("ost-scale") ||
      (isHostelAteco && (nameLower.includes("corridoi") || nameLower.includes("scale") || nameLower.includes("esodo") || nameLower.includes("disimpegni") || cat === "common" || cat === "hallway"))
    ) {
      matchingMachines = hostelMachines.filter((m) =>
        [
          "centrale_antincendio_indirizzata_ostello",
          "porte_tagliafuoco_chiudiporta_ostello",
          "lavasciuga_pavimenti_compatta_ostello",
        ].includes(m.machineKey)
      );
    }

    // Reparti Bed & Breakfast, Affittacamere, Guest House e Room Rental (55.20.51 / 55.20.5 / 55.20 / 55.2)
    else if (
      envId === "env-bnb-ingresso-reception" ||
      envId.includes("bnb-ingresso-reception") ||
      envId.includes("bnb-reception") ||
      (isBnbAteco && (nameLower.includes("reception") || nameLower.includes("ingresso") || nameLower.includes("check-in") || cat === "reception"))
    ) {
      matchingMachines = bnbMachines.filter((m) =>
        ["centralina_rilevazione_fumi_bnb", "serrature_elettroniche_smartlock"].includes(m.machineKey)
      );
    } else if (
      envId === "env-bnb-camere-ospiti" ||
      envId === "env-bnb-bagni-privati" ||
      envId.includes("bnb-camere-ospiti") ||
      envId.includes("bnb-camere") ||
      envId.includes("bnb-bagni-privati") ||
      envId.includes("bnb-bagni") ||
      (isBnbAteco && (nameLower.includes("camera") || nameLower.includes("camere") || nameLower.includes("bagno") || nameLower.includes("bagni") || cat === "rooms" || cat === "bathrooms"))
    ) {
      matchingMachines = bnbMachines.filter((m) =>
        ["aspirapolvere_filtro_hepa_bnb", "generatore_ozono_sanificazione_bnb", "serrature_elettroniche_smartlock"].includes(m.machineKey)
      );
    } else if (
      envId === "env-bnb-sala-colazioni" ||
      envId.includes("bnb-sala-colazioni") ||
      (isBnbAteco && (nameLower.includes("sala colazioni") || nameLower.includes("buffet colazioni") || nameLower.includes("sala buffet")))
    ) {
      matchingMachines = bnbMachines.filter((m) =>
        [
          "macchina_caffe_capsule_grani_bnb",
          "bollitore_tostapane_buffet_bnb",
          "vetrina_refrigerata_snack_bnb",
          "spremiagrumi_centrifuga_compatta",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-bnb-kitchenette-office" ||
      envId.includes("bnb-kitchenette-office") ||
      envId.includes("bnb-kitchenette") ||
      (isBnbAteco && (nameLower.includes("kitchenette") || nameLower.includes("angolo cottura") || nameLower.includes("cucinotto") || nameLower.includes("office")))
    ) {
      matchingMachines = bnbMachines.filter((m) =>
        ["lavastoviglie_termodisinfezione_bnb", "forno_microonde_grill_bnb"].includes(m.machineKey)
      );
    } else if (
      envId === "env-bnb-lavanderia-office" ||
      envId.includes("bnb-lavanderia-office") ||
      envId.includes("bnb-lavanderia") ||
      (isBnbAteco && (nameLower.includes("lavanderia") || nameLower.includes("stireria") || cat === "laundry"))
    ) {
      matchingMachines = bnbMachines.filter((m) =>
        [
          "lavatrice_vapore_igienizzante_bnb",
          "asciugatrice_pompa_calore_bnb",
          "ferro_generatore_vapore_caldaia",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-bnb-centrale-termica-boiler" ||
      envId.includes("bnb-centrale-termica-boiler") ||
      envId.includes("bnb-centrale-termica") ||
      envId.includes("bnb-boiler") ||
      (isBnbAteco && (nameLower.includes("caldaia") || nameLower.includes("boiler") || nameLower.includes("termica") || cat === "boiler_room"))
    ) {
      matchingMachines = bnbMachines.filter((m) =>
        ["caldaia_murale_condensazione_acs"].includes(m.machineKey)
      );
    } else if (
      envId === "env-bnb-ripostiglio-housekeeping" ||
      envId === "env-bnb-scale-disimpegni" ||
      envId.includes("bnb-ripostiglio-housekeeping") ||
      envId.includes("bnb-ripostiglio") ||
      envId.includes("bnb-scale-disimpegni") ||
      envId.includes("bnb-scale") ||
      (isBnbAteco && (nameLower.includes("housekeeping") || nameLower.includes("ripostiglio") || nameLower.includes("scale") || nameLower.includes("disimpegno") || nameLower.includes("corridoio")))
    ) {
      matchingMachines = bnbMachines.filter((m) =>
        ["carrello_housekeeping_compatto_bnb", "lavasciuga_pavimenti_compatta_bnb"].includes(m.machineKey)
      );
    }

    // Reparti Campeggi, Villaggi Turistici, Camping Village e Strutture all'Aperto (55.30.00 / 55.30.0 / 55.30 / 55.3)
    else if (
      envId === "env-cmp-reception-direzione" ||
      envId.includes("cmp-reception") ||
      (isCampingAteco && (nameLower.includes("reception") || nameLower.includes("direzione") || nameLower.includes("accoglienza") || cat === "reception"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["sistema_diffusione_sonora_evac_campeggio", "defibrillatore_dae_colonnina"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-piazzole-tende-camper" ||
      envId.includes("cmp-piazzole") ||
      (isCampingAteco && (nameLower.includes("piazzol") || nameLower.includes("tende") || (nameLower.includes("camper") && !nameLower.includes("service") && !nameLower.includes("scarico")) || cat === "camping_pitches"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["colonnina_elettrica_campeggio", "gruppo_pompe_antincendio_uni12845"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-camper-service-scarico" ||
      envId.includes("cmp-camper-service") ||
      envId.includes("camper-service") ||
      (isCampingAteco && (nameLower.includes("camper service") || (nameLower.includes("scarico") && nameLower.includes("camper")) || nameLower.includes("acque grigie") || nameLower.includes("acque nere")))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["camper_service_autopulente"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-piscina-solarium" ||
      envId.includes("cmp-piscina") ||
      (isCampingAteco && !nameLower.includes("cloro") && (nameLower.includes("piscina") || nameLower.includes("solarium") || nameLower.includes("vasca") || cat === "swimming_pool"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["robot_pulitore_piscina_industriale", "defibrillatore_dae_colonnina"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-locale-tecnico-cloro" ||
      envId.includes("cmp-locale-tecnico-cloro") ||
      envId.includes("cmp-cloro") ||
      (isCampingAteco && (nameLower.includes("tecnico cloro") || nameLower.includes("dosaggio cloro") || (nameLower.includes("cloro") && nameLower.includes("locale"))))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["impianto_dosaggio_cloro_piscina"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-ristorante-minimarket" ||
      envId.includes("cmp-ristorante") ||
      envId.includes("cmp-minimarket") ||
      (isCampingAteco && (nameLower.includes("ristorante") || nameLower.includes("minimarket") || nameLower.includes("pizzeria") || cat === "restaurant" || cat === "kitchen"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["forno_pizze_ristorante_campeggio"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-lavanderia-self" ||
      envId.includes("cmp-lavanderia") ||
      (isCampingAteco && (nameLower.includes("lavanderia") || cat === "laundry"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["lavatrice_industriale_campeggio", "asciugatrice_industriale_campeggio"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-centrale-idrica-antincendio" ||
      envId.includes("cmp-centrale-idrica") ||
      (isCampingAteco && (nameLower.includes("idrica") || nameLower.includes("antincendio") || nameLower.includes("pompe antincendio") || (nameLower.includes("centrale") && !nameLower.includes("cloro")) || cat === "boiler_room"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["gruppo_pompe_antincendio_uni12845", "caldaia_centrale_acs_campeggio"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-vano-gruppo-elettrogeno" ||
      envId.includes("cmp-vano-gruppo-elettrogeno") ||
      (isCampingAteco && (nameLower.includes("gruppo elettrogeno") || nameLower.includes("elettrogeno") || nameLower.includes("generatore diesel")))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["gruppo_elettrogeno_emergenza_campeggio"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-officina-manutenzione" ||
      envId.includes("cmp-officina") ||
      (isCampingAteco && (nameLower.includes("officina") || nameLower.includes("manutenzione") || nameLower.includes("deposito attrezzi") || cat === "maintenance" || cat === "workshop"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        [
          "golf_cart_elettrico_navetta",
          "trattorino_tosaerba_sfalcio",
          "decespugliatore_motosega_potatura",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-isola-ecologica-rifiuti" ||
      envId.includes("cmp-isola-ecologica") ||
      envId.includes("cmp-rifiuti") ||
      (isCampingAteco && (nameLower.includes("ecologica") || nameLower.includes("rifiuti") || nameLower.includes("differenziata") || cat === "waste"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["compattatore_rifiuti_differenziata"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-bungalow-mobilhome" ||
      envId.includes("cmp-bungalow") ||
      envId.includes("cmp-mobilhome") ||
      (isCampingAteco && (nameLower.includes("bungalow") || nameLower.includes("mobilhome") || nameLower.includes("mobil-home") || nameLower.includes("chalet") || cat === "bungalows" || cat === "lodging"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["colonnina_elettrica_campeggio", "caldaia_centrale_acs_campeggio"].includes(m.machineKey)
      );
    } else if (
      envId === "env-cmp-blocchi-servizi-docce" ||
      envId.includes("cmp-blocchi-servizi") ||
      envId.includes("cmp-docce") ||
      (isCampingAteco && (nameLower.includes("blocchi servizi") || nameLower.includes("servizi igienici") || nameLower.includes("docce") || cat === "bathrooms"))
    ) {
      matchingMachines = campingMachines.filter((m) =>
        ["caldaia_centrale_acs_campeggio", "gruppo_pompe_antincendio_uni12845"].includes(m.machineKey)
      );
    }

    // Reparti Stabilimento Balneare, Lido e Beach Club (ATECO 93.29.20 / 93.29.2 / 93.29 / 93.2 / 932920 / 93292 / 9329 / 932)
    else if (
      envId === "env-baln-reception-cassa" ||
      envId.includes("baln-reception") ||
      (isBeachClubAteco && (nameLower.includes("reception") || nameLower.includes("cassa") || cat === "reception" || cat === "sales_office"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["defibrillatore_dae_teca_climatizzata"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-arenile-ombrelloni" ||
      envId.includes("baln-arenile") ||
      envId.includes("baln-ombrelloni") ||
      (isBeachClubAteco && !nameLower.includes("isola") && !nameLower.includes("rifiuti") && !nameLower.includes("infermeria") && !nameLower.includes("chiosco") && !nameLower.includes("bar") && !nameLower.includes("puliscispiaggia") && (nameLower.includes("arenile") || nameLower.includes("ombrelloni") || nameLower.includes("lettini") || cat === "beach" || cat === "arenile"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["sedia_anfibia_disabili_job", "colonnina_docce_temporizzate"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-postazione-salvataggio" ||
      envId.includes("baln-salvataggio") ||
      envId.includes("baln-postazione") ||
      (isBeachClubAteco && (nameLower.includes("salvataggio") || nameLower.includes("bagnino") || nameLower.includes("torretta") || cat === "lifeguard"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["torretta_bagnino_avvistamento", "pattino_salvataggio_rosso"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-infermeria-primo-soccorso" ||
      envId.includes("baln-infermeria") ||
      envId.includes("baln-primo-soccorso") ||
      (isBeachClubAteco && (nameLower.includes("infermeria") || nameLower.includes("primo soccorso") || cat === "first_aid" || cat === "medical"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["defibrillatore_dae_teca_climatizzata"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-blocchi-servizi-docce" ||
      envId.includes("baln-blocchi-servizi") ||
      envId.includes("baln-servizi-docce") ||
      (isBeachClubAteco && (nameLower.includes("blocchi servizi") || (nameLower.includes("docce") && !nameLower.includes("solare")) || cat === "bathrooms" || cat === "showers"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["colonnina_docce_temporizzate", "caldaia_solare_acs_docce"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-chiosco-bar" ||
      envId.includes("baln-chiosco") ||
      envId.includes("baln-bar") ||
      (isBeachClubAteco && (nameLower.includes("chiosco") || nameLower.includes("bar") || cat === "bar"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["fabbricatore_ghiaccio_lido", "macchina_caffe_lido", "vetrina_gelati_lido"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-ristorante-cucina" ||
      envId.includes("baln-ristorante") ||
      envId.includes("baln-cucina") ||
      (isBeachClubAteco && (nameLower.includes("ristorante") || nameLower.includes("cucina") || cat === "restaurant" || cat === "kitchen"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["friggitrice_pesce_lido", "cappa_aspirazione_lido", "lavastoviglie_capotta_lido"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-celle-frigo-dispensa" ||
      envId.includes("baln-celle") ||
      envId.includes("baln-dispensa") ||
      (isBeachClubAteco && (nameLower.includes("celle") || nameLower.includes("dispensa") || nameLower.includes("pesce fresco") || cat === "cold_storage" || cat === "storage"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["armadio_frigo_pesce_lido"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-centrale-idrica-solare" ||
      envId.includes("baln-centrale-idrica") ||
      envId.includes("baln-solare") ||
      (isBeachClubAteco && (nameLower.includes("solare termico") || nameLower.includes("centrale idrica") || cat === "boiler_room" || (cat === "technical" && !nameLower.includes("isola") && !nameLower.includes("rifiuti") && !nameLower.includes("differenziata"))))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["caldaia_solare_acs_docce"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-rimessaggio-puliscispiaggia" ||
      envId.includes("baln-rimessaggio") ||
      envId.includes("baln-puliscispiaggia") ||
      (isBeachClubAteco && (nameLower.includes("rimessaggio") || nameLower.includes("puliscispiaggia") || cat === "garage" || cat === "warehouse"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["puliscispiaggia_semovente_trattore", "trattorino_rimorchio_spiaggia"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-isola-ecologica-spiaggia" ||
      envId.includes("baln-isola-ecologica") ||
      (isBeachClubAteco && (nameLower.includes("ecologica") || nameLower.includes("differenziata") || nameLower.includes("rifiuti") || cat === "waste"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["compattatore_differenziata_lido"].includes(m.machineKey)
      );
    } else if (
      envId === "env-baln-cabine-spogliatoi" ||
      envId.includes("baln-cabine") ||
      envId.includes("baln-spogliatoi") ||
      (isBeachClubAteco && (nameLower.includes("cabine") || nameLower.includes("spogliatoi") || cat === "cabins" || cat === "changing_room"))
    ) {
      matchingMachines = beachClubMachines.filter((m) =>
        ["sedia_anfibia_disabili_job"].includes(m.machineKey)
      );
    } else if (
      envId === "env-super-magazzino" ||
      envId.includes("super-magazzino") ||
      (isSuperAteco && (cat === "warehouse" || cat === "magazzino_merci" || nameLower.includes("deposito") || (nameLower.includes("magazzino") && !nameLower.includes("legnami") && !nameLower.includes("oli"))))
    ) {
      matchingMachines = superMachines.filter((m) =>
        [
          "stoccatore_elettrico_timone",
          "transpallet_elettrico_supermercato",
          "transpallet_manuale_supermercato",
          "pressa_compattatrice_compatta",
          "scaffalature_deposito_supermercato",
          "caricabatterie_trazione_supermercato",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-super-macelleria" ||
      envId.includes("super-macelleria") ||
      (isSuperAteco && (nameLower.includes("macelleria") || cat === "macelleria"))
    ) {
      matchingMachines = superMachines.filter((m) =>
        [
          "tritacarne_refrigerato_supermercato",
          "termosigillatrice_vaschette_carni",
          "segaossa_banco_macelleria",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-super-gastronomia" ||
      envId.includes("super-gastronomia") ||
      (isSuperAteco && (nameLower.includes("gastronomia") || nameLower.includes("salumeria") || cat === "gastronomia"))
    ) {
      matchingMachines = superMachines.filter((m) =>
        [
          "affettatrice_gravita_supermercato",
          "confezionatrice_sottovuoto_supermercato",
          "tagliagrana_filo_elettrico",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-super-panetteria" ||
      envId.includes("super-panetteria") ||
      (isSuperAteco && (nameLower.includes("panetteria") || nameLower.includes("panificio") || nameLower.includes("pane") || cat === "panetteria"))
    ) {
      matchingMachines = superMachines.filter((m) =>
        [
          "forno_doratura_pane",
          "tagliapane_banco_supermercato",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-super-pescheria" ||
      envId.includes("super-pescheria") ||
      (isSuperAteco && (nameLower.includes("pescheria") || nameLower.includes("pesce") || cat === "pescheria"))
    ) {
      matchingMachines = superMachines.filter((m) =>
        [
          "fabbricatore_ghiaccio_supermercato",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-super-corsie" ||
      envId.includes("super-corsie") ||
      (isSuperAteco && (nameLower.includes("corsie") || nameLower.includes("vendita") || cat === "sales_floor" || cat === "public" || cat === "area_vendita"))
    ) {
      matchingMachines = superMachines.filter((m) =>
        [
          "lavasciuga_operatore_terra",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-super-casse-uffici" ||
      envId.includes("super-casse") ||
      (isSuperAteco && (nameLower.includes("cassa") || nameLower.includes("casse") || cat === "casse"))
    ) {
      matchingMachines = superMachines.filter((m) =>
        [
          "banco_cassa_nastro_motorizzato",
        ].includes(m.machineKey)
      );
    }

    // Reparti Ipermercato GDO (intercettati per ID ambiente, categoria o denominazione)
    else if (
      envId === "env-iper-magazzino" ||
      envId.includes("iper-magazzino") ||
      (isIperAteco && (cat === "warehouse" || cat === "magazzino_merci" || nameLower.includes("ricevimento") || (nameLower.includes("magazzino") && !nameLower.includes("legnami") && !nameLower.includes("oli")))) ||
      (!isSuperAteco && isIperAteco && nameLower.includes("ricevimento merci"))
    ) {
      matchingMachines = iperMachines.filter((m) =>
        [
          "muletto_frontale_elettrico",
          "transpallet_elettrico_pedana",
          "transpallet_elettrico_terra",
          "transpallet_manuale",
          "pressa_compattatrice",
          "pedana_di_carico",
          "stazione_ricarica_batterie",
          "scaffalature_portapallet",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-iper-macelleria" ||
      envId.includes("iper-macelleria") ||
      (isIperAteco && (nameLower.includes("macelleria") || cat === "macelleria"))
    ) {
      matchingMachines = iperMachines.filter((m) =>
        [
          "segaossa_nastro",
          "tritacarne_refrigerato",
          "insaccatrice_idraulica",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-iper-pescheria" ||
      envId.includes("iper-pescheria") ||
      (isIperAteco && (nameLower.includes("pescheria") || cat === "pescheria"))
    ) {
      matchingMachines = iperMachines.filter((m) =>
        [
          "fabbricatore_ghiaccio_scaglie",
          "squamatore_elettrico",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-iper-gastronomia" ||
      envId.includes("iper-gastronomia") ||
      (isIperAteco && (nameLower.includes("gastronomia") || nameLower.includes("salumeria") || cat === "gastronomia"))
    ) {
      matchingMachines = iperMachines.filter((m) =>
        [
          "affettatrice_gravita_gdo",
          "forno_gastronomia_gdo",
          "confezionatrice_sottovuoto_campana",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-iper-panetteria" ||
      envId.includes("iper-panetteria") ||
      (isIperAteco && (nameLower.includes("panetteria") || nameLower.includes("panificio") || cat === "panetteria"))
    ) {
      matchingMachines = iperMachines.filter((m) =>
        [
          "impastatrice_spirale_gdo",
          "spezzatrice_arrotondatrice",
          "forno_rotativo_pane",
          "tagliapane_professionale",
        ].includes(m.machineKey)
      );
    } else if (
      envId === "env-iper-corsie" ||
      envId.includes("iper-corsie") ||
      (isIperAteco && (nameLower.includes("corsie") || nameLower.includes("vendita") || cat === "sales_floor" || cat === "public" || cat === "area_vendita"))
    ) {
      matchingMachines = iperMachines.filter((m) =>
        [
          "lavasciuga_uomo_bordo",
        ].includes(m.machineKey)
      );
    } else if (cat === "cucina" || nameLower.includes("cucina") || nameLower.includes("laboratorio")) {
      const restSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "ristorazione_alimentare");
      if (restSector) matchingMachines = restSector.machines;
    } else if (cat === "magazzino_merci" || nameLower.includes("magazzino") || nameLower.includes("deposito")) {
      const logSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "logistica_magazzino");
      if (logSector) matchingMachines = logSector.machines;
    } else if (cat === "officina_meccanica" || nameLower.includes("officina") || nameLower.includes("meccanica")) {
      const autoSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "autoriparazione_meccanica");
      const metalSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "metalmeccanica_officina");
      matchingMachines = [...(autoSector?.machines || []), ...(metalSector?.machines || [])];
    } else if (cat === "saldatura" || nameLower.includes("saldatura")) {
      const metalSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "metalmeccanica_officina");
      matchingMachines = (metalSector?.machines || []).filter((m) => m.machineKey.includes("saldat") || m.machineKey.includes("mola"));
    } else if (cat === "reparto_legno" || nameLower.includes("legno") || nameLower.includes("falegnam")) {
      const woodSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "falegnameria_legno");
      if (woodSector) matchingMachines = woodSector.machines;
    } else if (cat === "esterno_cantiere" || nameLower.includes("cantiere")) {
      const buildSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "edilizia_cantieri");
      if (buildSector) matchingMachines = buildSector.machines;
    } else if (cat === "ambulatorio" || nameLower.includes("ambulatorio") || nameLower.includes("visite")) {
      const healthSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "sanita_ambulatori");
      if (healthSector) matchingMachines = healthSector.machines;
    } else if (cat === "centrale_termica" || cat === "deposito_infiammabili" || nameLower.includes("compressor")) {
      const autoSector = SECTOR_MACHINERY_CATALOGS.find((s) => s.sectorKey === "autoriparazione_meccanica");
      matchingMachines = (autoSector?.machines || []).filter((m) => m.machineKey.includes("compressor"));
    }

    for (const m of matchingMachines) {
      const uniqueKey = `${m.machineKey}_${env.name || env.id}`;
      if (!addedKeys.has(uniqueKey)) {
        addedKeys.add(uniqueKey);
        suggested.push({
          ...m,
          targetEnvironmentId: env.id,
          targetEnvironmentName: env.name,
          targetEnvironmentCategory: env.category,
          sourceReason: "environment",
        });
      }
    }
  }

  // 2. INTEGRA LE MACCHINE DEL SETTORE ATECO SE NON GIÀ AGGIUNTE
  const sectorCatalog = getSectorMachineCatalogForAteco(atecoCode);
  for (const m of sectorCatalog.machines) {
    const alreadyAny = suggested.some((s) => s.machineKey === m.machineKey);
    if (!alreadyAny) {
      suggested.push({
        ...m,
        targetEnvironmentName: undefined,
        targetEnvironmentCategory: undefined,
        sourceReason: "ateco",
      });
    }
  }

  return suggested;
}
