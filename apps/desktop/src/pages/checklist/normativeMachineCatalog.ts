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
  for (const cat of SECTOR_MACHINERY_CATALOGS) {
    if (
      cat.atecoPrefixes.some((p) => {
        const pDigits = p.replace(/[^0-9]/g, "");
        return clean.startsWith(p) || (pDigits.length >= 2 && digitsOnly.startsWith(pDigits));
      })
    ) {
      return cat;
    }
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
