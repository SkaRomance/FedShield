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
};

// -------------------------------------------------------------
// CATALOGO MACCHINE PREFORMATO PER SETTORI ATECO
// -------------------------------------------------------------
export const SECTOR_MACHINERY_CATALOGS: SectorMachineCatalog[] = [
  // 1. RISTORAZIONE & ALIMENTARE
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

  // 2. LOGISTICA, MAGAZZINO & TRASPORTI
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
    return SECTOR_MACHINERY_CATALOGS[0]; // Ristorazione/Alimentare come default
  }

  const clean = atecoCode.trim();
  for (const cat of SECTOR_MACHINERY_CATALOGS) {
    if (cat.atecoPrefixes.some((p) => clean.startsWith(p))) {
      return cat;
    }
  }

  // Fallback logistica/magazzino per settori industriali/commerciali generici
  return SECTOR_MACHINERY_CATALOGS[1];
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
  inailCheckRequired?: boolean;
  inailSerial?: string;
  inailLastCheckDate?: string;
  inailNextCheckDate?: string;
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

  // 1. MACCHINE SUGGERITE IN BASE AI LOCALI CENSITI NELLO STEP 2
  for (const env of environments) {
    const cat = (env.category || "").toLowerCase();
    const nameLower = (env.name || "").toLowerCase();

    // Mappa la categoria del locale alle macchine pertinenti
    let matchingMachines: SectorMachineTemplate[] = [];

    if (cat === "cucina" || nameLower.includes("cucina") || nameLower.includes("laboratorio")) {
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
      const uniqueKey = `${m.machineKey}_${env.name}`;
      if (!addedKeys.has(uniqueKey)) {
        addedKeys.add(uniqueKey);
        suggested.push({
          ...m,
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
