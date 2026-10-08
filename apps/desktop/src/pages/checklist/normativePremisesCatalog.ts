// Catalogo e tassonomia per la Sezione Locali e Ambienti di Lavoro (Step 2)
// Basato su D.Lgs. 81/2008 Allegato IV (Requisiti dei luoghi di lavoro)
// e Reg. CE 852/2004 Allegato II (Requisiti igienico-sanitari per locali alimentari)

export type PremisesAreaKey =
  | "uffici"
  | "magazzino"
  | "laboratorio_cucina"
  | "vendita_pubblico"
  | "servizi_spogliatoi"
  | "tecnici_esterno"
  | "tutti";

export interface PremisesEnvironmentDef {
  key: PremisesAreaKey;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  normReference: string;
  minHeightStandard: number; // in metri
  minHeightLabel: string;
  keywords: string[];
  typicalNonConformities: Array<{
    label: string;
    noteText: string;
    severity: number;
    sanctionable: boolean;
  }>;
}

export const PREMISES_ENVIRONMENTS: Record<PremisesAreaKey, PremisesEnvironmentDef> = {
  uffici: {
    key: "uffici",
    label: "Uffici e Postazioni di Lavoro (VDT)",
    shortLabel: "Uffici & VDT",
    icon: "🏢",
    description: "Postazioni impiegatizie, videoterminali, sale riunioni e reception.",
    normReference: "D.Lgs. 81/2008, Titolo VII e Allegato IV, punto 1.2",
    minHeightStandard: 2.7,
    minHeightLabel: "Minimo 2,70 m (o deroga D.Lgs. 81/08 art. 65)",
    keywords: ["uffic", "vdt", "scrivan", "postazion", "riunion", "cassa", "amministraz", "reception"],
    typicalNonConformities: [
      {
        label: "Cavi a terra lungo il passaggio",
        noteText: "Presenza di cavi elettrici e prolunghe volanti a pavimento lungo i percorsi di transito privi di canalina passacavi (rischio inciampo).",
        severity: 2,
        sanctionable: true,
      },
      {
        label: "Riflessi o abbagliamento su schermi VDT",
        noteText: "Postazioni videoterminale orientate verso finestre prive di schermature idonee (tende frangisole); riscontrati riflessi molesti sullo schermo.",
        severity: 1,
        sanctionable: false,
      },
      {
        label: "Sedie da lavoro non ergonomiche",
        noteText: "Sedute di lavoro prive di regolazione indipendente in altezza e supporto lombare conforme all'Allegato XXXIV D.Lgs. 81/08.",
        severity: 2,
        sanctionable: true,
      },
      {
        label: "Microclima e ricambio d'aria insufficiente",
        noteText: "Scarso ricambio d'aria naturale o impianto di climatizzazione privo di registro manutenzione e sanificazione filtri.",
        severity: 2,
        sanctionable: true,
      },
    ],
  },
  magazzino: {
    key: "magazzino",
    label: "Magazzino, Logistica e Aree Stoccaggio",
    shortLabel: "Magazzino & Merci",
    icon: "📦",
    description: "Aree deposito materie prime, merci finite, soppalchi e baie di carico/scarico.",
    normReference: "D.Lgs. 81/2008, art. 71, Titolo VI e Allegato IV punto 1.4",
    minHeightStandard: 3.0,
    minHeightLabel: "Minimo 3,00 m per locali industriali/commerciali (o autorizzazione deroga)",
    keywords: ["magazzin", "scaffal", "pallet", "stoccag", "corsie", "baie", "carrell", "soppalc", "merci", "deposito"],
    typicalNonConformities: [
      {
        label: "Scaffalatura priva di cartello di portata",
        noteText: "Scaffalature industriali metalliche prive di cartelli indicanti la portata massima ammissibile per campata/ripiano (UNI EN 15635).",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Corsie ostruite da pallet e merci",
        noteText: "Corsie di transito pedonale e vie verso le uscite di emergenza parzialmente ostruite da bancali e materiali stoccati a terra.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Spalle scaffali prive di protezioni antiurto",
        noteText: "Montanti perimetrali delle scaffalature esposti al transito carrelli privi di paracolpi antiurto di base conformi.",
        severity: 2,
        sanctionable: false,
      },
      {
        label: "Mancanza verifica periodica scaffali (UNI EN 15635)",
        noteText: "Assenza del verbale annuale di ispezione statica delle scaffalature industriali da parte di tecnico qualificato.",
        severity: 3,
        sanctionable: true,
      },
    ],
  },
  laboratorio_cucina: {
    key: "laboratorio_cucina",
    label: "Cucina, Laboratorio e Area Lavorazione",
    shortLabel: "Cucina / Laboratorio",
    icon: "🍳",
    description: "Cucine professionali, laboratori alimentari, pasticceria, lavorazione carni/pesce o mensa.",
    normReference: "Reg. CE 852/2004 Allegato II, D.Lgs. 81/2008 Allegato IV",
    minHeightStandard: 3.0,
    minHeightLabel: "Minimo 3,00 m (o 2,70 m con deroga specifica ASL/requisiti locali)",
    keywords: ["cucina", "laborator", "cappa", "lavab", "aliment", "celle", "cottura", "frigo", "trasformaz", "haccp"],
    typicalNonConformities: [
      {
        label: "Superfici o pareti non lavabili o usurate",
        noteText: "Pareti della zona lavorazione prive di rivestimento impermeabile e lavabile fino ad almeno 2 metri di altezza o con piastrelle fessurate.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Cappa priva di manutenzione e pulizia filtri",
        noteText: "Cappa aspirante con filtri intasati di grasso e priva di registro attestante la periodica bonifica e sgrassaggio delle canalizzazioni.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Finestre prive di reti anti-insetto",
        noteText: "Finestre e aperture verso l'esterno dell'area lavorazione sprovviste di zanzariere a maglia fitta lavabili e amovibili.",
        severity: 2,
        sanctionable: true,
      },
      {
        label: "Lavamani sprovvisto di comando non manuale",
        noteText: "Rubinetteria del lavamani per il personale azionabile manualmente; assenti fotocellula, comando a pedale o a leva clinica.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Pozzetti di scarico non sifonati o senza griglia",
        noteText: "Pozzetti di scarico a pavimento privi di cestello raccoglitore, non sifonati o danneggiati (rischio esalazioni e infestanti).",
        severity: 3,
        sanctionable: true,
      },
    ],
  },
  vendita_pubblico: {
    key: "vendita_pubblico",
    label: "Area Vendita, Somministrazione e Spazi Pubblici",
    shortLabel: "Vendita & Pubblico",
    icon: "🛍️",
    description: "Sale ristorante/bar, negozi, corsie di vendita al dettaglio, zone cassa e aree aperte al pubblico.",
    normReference: "D.Lgs. 81/2008 Allegato IV, D.M. 03/09/2021 (Mini-Codice Antincendio)",
    minHeightStandard: 2.7,
    minHeightLabel: "Minimo 2,70 m per aree commerciali e di vendita",
    keywords: ["vendita", "somministraz", "client", "pubblico", "sala", "corsie", "banco", "tavoli", "negozio", "showroom"],
    typicalNonConformities: [
      {
        label: "Uscita di sicurezza ostruita o bloccata",
        noteText: "Porta di sicurezza verso l'esterno con maniglione antipanico ostruita da merci/arredi o chiusa a chiave con persone presenti nel locale.",
        severity: 4,
        sanctionable: true,
      },
      {
        label: "Illuminazione di emergenza non funzionante",
        noteText: "Presenza di lampade di emergenza con spia guasto o prive di autonomia minima di 60 minuti in caso di black-out.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Assenza cartellonistica di esodo fotoluminescente",
        noteText: "Vie di fuga e uscite di emergenza prive di cartelli di salvataggio conformi UNI EN ISO 7010 ben visibili e illuminati.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Pavimentazione sconnessa o rischio inciampo",
        noteText: "Dislivelli o gradini privi di segnaletica giallo/nera ad alta visibilità o strisce antiscivolo lungo i percorsi dei clienti/lavoratori.",
        severity: 2,
        sanctionable: true,
      },
    ],
  },
  servizi_spogliatoi: {
    key: "servizi_spogliatoi",
    label: "Spogliatoi, Docce e Servizi Igienici del Personale",
    shortLabel: "Spogliatoi & Servizi",
    icon: "🚻",
    description: "Servizi igienici esclusivi del personale, antibagni, armadietti spogliatoio e docce.",
    normReference: "D.Lgs. 81/2008 Allegato IV punto 1.12 e 1.13, Reg. CE 852/2004",
    minHeightStandard: 2.4,
    minHeightLabel: "Minimo 2,40 m per servizi igienici, spogliatoi e disimpegni",
    keywords: ["spogliato", "serviz", "bagno", "docce", "armadiett", "wc", "antibagno", "igien"],
    typicalNonConformities: [
      {
        label: "Armadietti privi di separazione sporco/pulito",
        noteText: "Spogliatoio per personale alimentare o esposto a polveri/sostanze provvisto di armadietti a singolo scomparto (obbligatorio doppio scomparto o divisorio sporco/pulito).",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Assenza antibagno o porta a chiusura automatica",
        noteText: "W.C. comunicante direttamente con l'area di lavoro/lavorazione privo di idoneo disimpegno antibagno dotato di porta con molla di ritorno.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Aerazione del servizio igienico non conforme",
        noteText: "Locale W.C. cieco privo di impianto di aspirazione forzata funzionante con almeno 5 ricambi d'aria orari collegato all'illuminazione.",
        severity: 2,
        sanctionable: true,
      },
      {
        label: "Mancanza dotazioni igieniche nei lavabi",
        noteText: "Lavamani del servizio sprovvisto di dispenser per sapone liquido igienizzante e asciugamani monouso a perdere (o asciugatore ad aria).",
        severity: 2,
        sanctionable: true,
      },
    ],
  },
  tecnici_esterno: {
    key: "tecnici_esterno",
    label: "Locali Tecnici, Quadri Elettrici ed Esterno",
    shortLabel: "Tecnici & Esterno",
    icon: "⚡",
    description: "Locale quadro generale, centrale termica, compressori, area rifiuti e viabilità esterna.",
    normReference: "D.Lgs. 81/2008 Titolo III e Allegato IV, D.M. 37/2008",
    minHeightStandard: 2.5,
    minHeightLabel: "Altezza idonea all'ispezione sicura degli impianti",
    keywords: ["tecnic", "quadro", "elettric", "central", "estern", "rifiuti", "compressor", "piazzale", "viabilit", "caldaia"],
    typicalNonConformities: [
      {
        label: "Quadro elettrico aperto o non segnalato",
        noteText: "Quadro elettrico generale lasciato privo di chiusura a chiave/attrezzo o sprovvisto del triangolo giallo di segnalazione pericolo alta tensione (D.Lgs. 81/08 art. 80).",
        severity: 4,
        sanctionable: true,
      },
      {
        label: "Area antistante quadro elettrico ostruita",
        noteText: "Presenza di scatoloni, materiali o attrezzature accatastate davanti al quadro elettrico che impediscono l'accesso immediato all'interruttore generale di sgancio.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Deposito rifiuti speciali/pericolosi non a norma",
        noteText: "Rifiuti pericolosi (olii esausti, imballaggi contaminati, batterie) stoccati a terra privi di idoneo bacino di contenimento stagno e cartellonistica di pericolo.",
        severity: 3,
        sanctionable: true,
      },
      {
        label: "Viabilità esterna pedoni/mezzi non delimitata",
        noteText: "Piazzale esterno privo di corsie pedonali segnate a terra e specchi parabolici nei punti ciechi di manovra automezzi/furgoni.",
        severity: 2,
        sanctionable: false,
      },
    ],
  },
  tutti: {
    key: "tutti",
    label: "Tutti i Reparti e Ambienti (Vista Globale)",
    shortLabel: "Tutti i Reparti",
    icon: "🌐",
    description: "Visualizzazione unificata di tutti i controlli strutturali e dei locali.",
    normReference: "D.Lgs. 81/2008 Allegato IV",
    minHeightStandard: 2.7,
    minHeightLabel: "Standard D.Lgs. 81/2008 Allegato IV",
    keywords: [],
    typicalNonConformities: [],
  },
};

export interface PremisesEnvironmentMeasurements {
  surfaceSqM?: number;
  heightM?: number;
  aerationType: "natural" | "mechanical" | "mixed" | "insufficient";
  lightingType: "natural_artificial" | "artificial_only" | "poor";
  flooringCondition: "compliant" | "minor_issues" | "slippery_damaged";
  electricalSafety: "compliant" | "open_panels_wires" | "needs_check";
  notes?: string;
}

export function defaultEnvironmentMeasurements(): PremisesEnvironmentMeasurements {
  return {
    aerationType: "natural",
    lightingType: "natural_artificial",
    flooringCondition: "compliant",
    electricalSafety: "compliant",
  };
}

/**
 * Categorizza un requisito di checklist assegnandolo all'ambiente fisico più idoneo.
 */
export function categorizePremisesItem(
  item: { area: string; question: string; normReference?: string },
): PremisesAreaKey {
  const text = `${item.area} ${item.question} ${item.normReference ?? ""}`.toLowerCase();

  // 1. Spogliatoi e servizi igienici
  if (
    text.includes("spogliato") ||
    text.includes("serviz") ||
    text.includes("bagno") ||
    text.includes("docce") ||
    text.includes("armadiett") ||
    text.includes("wc") ||
    text.includes("antibagno")
  ) {
    return "servizi_spogliatoi";
  }

  // 2. Cucina, laboratorio o trasformazione alimentare
  if (
    text.includes("cucina") ||
    text.includes("laborator") ||
    text.includes("cappa") ||
    text.includes("lavab") ||
    text.includes("aliment") ||
    text.includes("celle") ||
    text.includes("cottura") ||
    text.includes("haccp") ||
    text.includes("trasformaz")
  ) {
    return "laboratorio_cucina";
  }

  // 3. Magazzino, scaffalature, logistica
  if (
    text.includes("scaffal") ||
    text.includes("magazzin") ||
    text.includes("pallet") ||
    text.includes("stoccag") ||
    text.includes("baie") ||
    text.includes("carrell") ||
    text.includes("soppalc") ||
    text.includes("deposito") ||
    text.includes("merci")
  ) {
    return "magazzino";
  }

  // 4. Vendita, pubblico, clienti
  if (
    text.includes("vendita") ||
    text.includes("somministraz") ||
    text.includes("client") ||
    text.includes("pubblico") ||
    text.includes("layout vendita") ||
    text.includes("tavoli") ||
    text.includes("sala") ||
    text.includes("negozio")
  ) {
    return "vendita_pubblico";
  }

  // 5. Quadri elettrici, locali tecnici ed esterno
  if (
    text.includes("quadro") ||
    text.includes("quadri elettrici") ||
    text.includes("tecnic") ||
    text.includes("rifiuti") ||
    text.includes("compressor") ||
    text.includes("caldaia") ||
    text.includes("centrale") ||
    text.includes("piazzale") ||
    text.includes("viabilit")
  ) {
    return "tecnici_esterno";
  }

  // 6. Uffici, VDT, postazioni fisse
  if (
    text.includes("uffic") ||
    text.includes("vdt") ||
    text.includes("videoterminal") ||
    text.includes("scrivan") ||
    text.includes("cassa") ||
    text.includes("postazion") ||
    text.includes("ergonomia") ||
    text.includes("reception")
  ) {
    return "uffici";
  }

  // Default per requisiti strutturali generici
  return "uffici";
}

/**
 * Genera chiave storage per i rilievi dimensionali dei locali di una specifica ispezione.
 */
export function premisesMeasurementsStorageKey(inspectionId: string, areaKey: string): string {
  return `fedshield:inspection:${inspectionId}:premises_measurements:${areaKey}`;
}

export function workEnvironmentsStorageKey(inspectionId: string): string {
  return `fedshield:inspection:${inspectionId}:work_environments_list`;
}

// ============================================================================
// NUOVA STRUTTURA: AMBIENTI DI LAVORO DINAMICI PER ATECO (STEP 2)
// ============================================================================

export type WorkEnvironmentCategory =
  | "production"
  | "warehouse"
  | "office"
  | "services"
  | "public"
  | "technical"
  | "outdoor";

export interface WorkEnvironmentFeatures {
  aerationType: "natural" | "mechanical_vmc" | "forced_hood" | "mixed" | "insufficient";
  forcedExhaustPresent: boolean;
  forcedExhaustType: "kitchen_hood" | "welding_arm" | "spray_booth" | "wood_dust_atex" | "blind_toilet_fan" | "none";
  lightingType: "natural_artificial" | "artificial_only" | "insufficient";
  emergencyLighting: boolean;
  flooringCondition: "compliant_anti_slip" | "regular_smooth" | "damaged_slippery";
  wallsCondition: "washable_sanitizable_2m" | "plaster_dry" | "damaged_mold";
  windowsSafe: boolean;
  insectScreens: boolean;
  antiShatterGlass: boolean;
  shelvingCertified: boolean;
  microclimateCompliant: boolean;
  fireLoadHigh?: boolean;
}

export interface WorkEnvironmentInstance {
  id: string;
  key: string;
  name: string;
  icon: string;
  category: WorkEnvironmentCategory;
  isDefault: boolean;
  surfaceSqM?: number;
  heightM?: number;
  volumeCuM?: number;
  occupantsCount?: number;
  windowSurfaceSqM?: number;
  isConfirmed: boolean;
  features: WorkEnvironmentFeatures;
}

export function defaultEnvironmentFeatures(category: WorkEnvironmentCategory): WorkEnvironmentFeatures {
  return {
    aerationType: "natural",
    forcedExhaustPresent: category === "production",
    forcedExhaustType: category === "production" ? "kitchen_hood" : "none",
    lightingType: "natural_artificial",
    emergencyLighting: true,
    flooringCondition: "compliant_anti_slip",
    wallsCondition: category === "production" ? "washable_sanitizable_2m" : "plaster_dry",
    windowsSafe: true,
    insectScreens: category === "production",
    antiShatterGlass: true,
    shelvingCertified: category === "warehouse",
    microclimateCompliant: true,
    fireLoadHigh: category === "warehouse",
  };
}

/**
 * Catalogo Ambienti Standard profilati dinamicamente per Codice ATECO
 */
export function getStandardEnvironmentsForAteco(atecoCode?: string): WorkEnvironmentInstance[] {
  const ateco = (atecoCode ?? "").trim().replace(/[^0-9]/g, "");

  // 1. Ristorazione, HoReCa, Somministrazione alimenti (56.x, 10.x, 11.x, 47.11, 47.2, 55.1)
  if (
    ateco.startsWith("56") ||
    ateco.startsWith("10") ||
    ateco.startsWith("11") ||
    ateco.startsWith("4711") ||
    ateco.startsWith("472") ||
    ateco.startsWith("551") ||
    ateco.startsWith("93292") ||
    ateco.startsWith("93291")
  ) {
    return [
      {
        id: "env-cucina",
        key: "cucina_laboratorio",
        name: "Cucina / Laboratorio Preparazione Alimenti",
        icon: "🍳",
        category: "production",
        isDefault: true,
        heightM: 3.0,
        surfaceSqM: 35.0,
        volumeCuM: 105.0,
        occupantsCount: 3,
        windowSurfaceSqM: 4.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          insectScreens: true,
        },
      },
      {
        id: "env-sala",
        key: "sala_somministrazione",
        name: "Sala Ristorazione / Somministrazione",
        icon: "🍽️",
        category: "public",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 80.0,
        volumeCuM: 216.0,
        occupantsCount: 40,
        windowSurfaceSqM: 10.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
          antiShatterGlass: true,
        },
      },
      {
        id: "env-dispensa",
        key: "dispensa_deposito",
        name: "Dispensa / Deposito Alimenti Non Deperibili",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 18.0,
        volumeCuM: 48.6,
        occupantsCount: 1,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-cella",
        key: "cella_frigorifera",
        name: "Cella Frigorifera / Deposito Deperibili",
        icon: "❄️",
        category: "production",
        isDefault: true,
        heightM: 2.4,
        surfaceSqM: 10.0,
        volumeCuM: 24.0,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          aerationType: "insufficient",
          flooringCondition: "compliant_anti_slip",
          wallsCondition: "washable_sanitizable_2m",
        },
      },
      {
        id: "env-plonge",
        key: "lavaggio_stoviglie",
        name: "Zona Lavaggio Stoviglie (Plonge)",
        icon: "🧼",
        category: "production",
        isDefault: true,
        heightM: 3.0,
        surfaceSqM: 12.0,
        volumeCuM: 36.0,
        occupantsCount: 1,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
        },
      },
      {
        id: "env-spogliatoio-staff",
        key: "spogliatoio_servizi_staff",
        name: "Spogliatoio & Servizi Igienici Personale (con Antibagno)",
        icon: "🚻",
        category: "services",
        isDefault: true,
        heightM: 2.4,
        surfaceSqM: 14.0,
        volumeCuM: 33.6,
        occupantsCount: 4,
        windowSurfaceSqM: 1.8,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("services"),
          wallsCondition: "washable_sanitizable_2m",
        },
      },
      {
        id: "env-wc-clienti",
        key: "wc_clienti",
        name: "Servizi Igienici Clienti / Pubblico",
        icon: "🚹",
        category: "public",
        isDefault: true,
        heightM: 2.4,
        surfaceSqM: 10.0,
        volumeCuM: 24.0,
        occupantsCount: 2,
        windowSurfaceSqM: 1.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("public"),
      },
      {
        id: "env-rifiuti",
        key: "deposito_rifiuti_soa",
        name: "Area Stoccaggio Rifiuti e Sottoprodotti SOA",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        heightM: 2.5,
        surfaceSqM: 8.0,
        volumeCuM: 20.0,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
        },
      },
    ];
  }

  // 2. Officine Meccaniche, Carrozzerie, Carpenterie, Manutenzioni (45.2, 25.x, 28.x, 29.x, 30.x, 33.x)
  if (
    ateco.startsWith("452") ||
    ateco.startsWith("25") ||
    ateco.startsWith("28") ||
    ateco.startsWith("29") ||
    ateco.startsWith("30") ||
    ateco.startsWith("33")
  ) {
    return [
      {
        id: "env-officina-ponti",
        key: "officina_meccanica",
        name: "Officina Meccanica / Area Ponti Sollevatori",
        icon: "🔧",
        category: "production",
        isDefault: true,
        heightM: 4.5,
        surfaceSqM: 180.0,
        volumeCuM: 810.0,
        occupantsCount: 4,
        windowSurfaceSqM: 20.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "welding_arm",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-cabina-verniciatura",
        key: "cabina_verniciatura",
        name: "Cabina Verniciatura & Zona Carteggiatura",
        icon: "🎨",
        category: "production",
        isDefault: true,
        heightM: 3.5,
        surfaceSqM: 40.0,
        volumeCuM: 140.0,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          aerationType: "mechanical_vmc",
          forcedExhaustPresent: true,
          forcedExhaustType: "spray_booth",
        },
      },
      {
        id: "env-magazzino-oli",
        key: "magazzino_ricambi_oli",
        name: "Magazzino Ricambi, Oli Nuovi e Lubrificanti",
        icon: "🛢️",
        category: "warehouse",
        isDefault: true,
        heightM: 3.5,
        surfaceSqM: 50.0,
        volumeCuM: 175.0,
        occupantsCount: 1,
        windowSurfaceSqM: 5.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
          fireLoadHigh: true,
        },
      },
      {
        id: "env-rifiuti-pericolosi",
        key: "deposito_rifiuti_pericolosi",
        name: "Deposito Temporaneo Rifiuti Pericolosi (Oli esausti, Batterie)",
        icon: "☣️",
        category: "technical",
        isDefault: true,
        heightM: 3.0,
        surfaceSqM: 20.0,
        volumeCuM: 60.0,
        occupantsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-ufficio-accettazione",
        key: "ufficio_accettazione",
        name: "Ufficio Accettazione Clienti / Cassa",
        icon: "🏢",
        category: "office",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 25.0,
        volumeCuM: 67.5,
        occupantsCount: 2,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("office"),
      },
      {
        id: "env-spogliatoi-docce",
        key: "spogliatoi_docce",
        name: "Spogliatoi con Docce e Servizi Igienici Lavoratori",
        icon: "🚿",
        category: "services",
        isDefault: true,
        heightM: 2.4,
        surfaceSqM: 22.0,
        volumeCuM: 52.8,
        occupantsCount: 5,
        windowSurfaceSqM: 2.5,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("services"),
      },
      {
        id: "env-piazzale",
        key: "piazzale_esterno",
        name: "Piazzale Esterno e Manovra Mezzi",
        icon: "🚗",
        category: "outdoor",
        isDefault: true,
        heightM: 0,
        surfaceSqM: 250.0,
        volumeCuM: 0,
        occupantsCount: 2,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("outdoor"),
      },
    ];
  }

  // 3. Edilizia, Costruzioni, Cantieri (41.x, 42.x, 43.x)
  if (ateco.startsWith("41") || ateco.startsWith("42") || ateco.startsWith("43")) {
    return [
      {
        id: "env-ufficio-cantiere",
        key: "baraccamento_ufficio",
        name: "Baraccamento / Ufficio di Cantiere",
        icon: "🏗️",
        category: "office",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 20.0,
        volumeCuM: 54.0,
        occupantsCount: 2,
        windowSurfaceSqM: 2.5,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("office"),
      },
      {
        id: "env-refettorio-cantiere",
        key: "spogliatoio_refettorio",
        name: "Spogliatoio e Locale Refettorio Maestranze",
        icon: "🥪",
        category: "services",
        isDefault: true,
        heightM: 2.5,
        surfaceSqM: 25.0,
        volumeCuM: 62.5,
        occupantsCount: 8,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("services"),
      },
      {
        id: "env-servizi-cantiere",
        key: "servizi_cantiere",
        name: "Servizi Igienici di Cantiere",
        icon: "🚽",
        category: "services",
        isDefault: true,
        heightM: 2.4,
        surfaceSqM: 8.0,
        volumeCuM: 19.2,
        occupantsCount: 1,
        windowSurfaceSqM: 1.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("services"),
      },
      {
        id: "env-stoccaggio-materiali",
        key: "stoccaggio_materiali_ponteggi",
        name: "Area Stoccaggio Materiali Edili, Ponteggi e Armature",
        icon: "🧱",
        category: "warehouse",
        isDefault: true,
        heightM: 0,
        surfaceSqM: 150.0,
        volumeCuM: 0,
        occupantsCount: 2,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("warehouse"),
      },
      {
        id: "env-terre-macerie",
        key: "deposito_terre_macerie",
        name: "Area Deposito Terre da Scavo e Macerie Inerti (DPR 120/17)",
        icon: "🚜",
        category: "outdoor",
        isDefault: true,
        heightM: 0,
        surfaceSqM: 100.0,
        volumeCuM: 0,
        occupantsCount: 1,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("outdoor"),
      },
      {
        id: "env-ricarica-batterie",
        key: "locale_ricarica_attrezzi",
        name: "Locale Ricarica Batterie e Minute Attrezzature",
        icon: "🔋",
        category: "technical",
        isDefault: true,
        heightM: 2.5,
        surfaceSqM: 15.0,
        volumeCuM: 37.5,
        occupantsCount: 1,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("technical"),
      },
    ];
  }

  // 4. Falegnameria e Lavorazione Legno (16.x, 31.x)
  if (ateco.startsWith("16") || ateco.startsWith("31")) {
    return [
      {
        id: "env-taglio-pialla",
        key: "reparto_macchine_taglio",
        name: "Reparto Macchine Stazionarie da Taglio e Pialla (Aspirazione ATEX)",
        icon: "🪵",
        category: "production",
        isDefault: true,
        heightM: 4.0,
        surfaceSqM: 150.0,
        volumeCuM: 600.0,
        occupantsCount: 4,
        windowSurfaceSqM: 15.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "wood_dust_atex",
        },
      },
      {
        id: "env-carteggiatura-legno",
        key: "reparto_carteggiatura_verniciatura",
        name: "Reparto Carteggiatura e Verniciatura Legno",
        icon: "🧴",
        category: "production",
        isDefault: true,
        heightM: 3.5,
        surfaceSqM: 45.0,
        volumeCuM: 157.5,
        occupantsCount: 2,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "spray_booth",
        },
      },
      {
        id: "env-magazzino-legnami",
        key: "magazzino_legname",
        name: "Magazzino Legnami e Pannelli",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        heightM: 4.0,
        surfaceSqM: 120.0,
        volumeCuM: 480.0,
        occupantsCount: 2,
        windowSurfaceSqM: 10.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
          fireLoadHigh: true,
        },
      },
      {
        id: "env-deposito-colle",
        key: "deposito_colle_chimici",
        name: "Deposito Colle, Solventi e Vernici Infiammabili",
        icon: "🧪",
        category: "technical",
        isDefault: true,
        heightM: 3.0,
        surfaceSqM: 18.0,
        volumeCuM: 54.0,
        occupantsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("technical"),
      },
      {
        id: "env-uffici-legno",
        key: "uffici_servizi",
        name: "Uffici Amministrativi e Servizi Personale",
        icon: "🏢",
        category: "office",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 30.0,
        volumeCuM: 81.0,
        occupantsCount: 2,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("office"),
      },
    ];
  }

  // 5. Commercio al Dettaglio, Negozi, Supermercati (47.x)
  if (ateco.startsWith("47")) {
    return [
      {
        id: "env-area-vendita",
        key: "area_vendita_casse",
        name: "Area Vendita, Corsie Espositive e Casse",
        icon: "🛍️",
        category: "public",
        isDefault: true,
        heightM: 3.0,
        surfaceSqM: 160.0,
        volumeCuM: 480.0,
        occupantsCount: 15,
        windowSurfaceSqM: 16.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-magazzino-merci",
        key: "magazzino_merci",
        name: "Magazzino Merci e Banchina Scarico",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        heightM: 3.5,
        surfaceSqM: 80.0,
        volumeCuM: 280.0,
        occupantsCount: 2,
        windowSurfaceSqM: 8.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-ufficio-negozio",
        key: "ufficio_amministrazione",
        name: "Ufficio Direzione e Amministrazione",
        icon: "🏢",
        category: "office",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 20.0,
        volumeCuM: 54.0,
        occupantsCount: 2,
        windowSurfaceSqM: 2.5,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("office"),
      },
      {
        id: "env-servizi-negozio",
        key: "spogliatoio_servizi_personale",
        name: "Spogliatoi e Servizi Igienici Dipendenti",
        icon: "🚻",
        category: "services",
        isDefault: true,
        heightM: 2.4,
        surfaceSqM: 16.0,
        volumeCuM: 38.4,
        occupantsCount: 3,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("services"),
      },
    ];
  }

  // 6. Uffici, IT, Terziario, Studi Professionali (62.x, 69.x, 70.x, ecc.)
  if (
    ateco.startsWith("62") ||
    ateco.startsWith("69") ||
    ateco.startsWith("70") ||
    ateco.startsWith("71") ||
    ateco.startsWith("72") ||
    ateco.startsWith("73") ||
    ateco.startsWith("74") ||
    ateco.startsWith("78") ||
    ateco.startsWith("82") ||
    ateco.startsWith("64") ||
    ateco.startsWith("65") ||
    ateco.startsWith("66")
  ) {
    return [
      {
        id: "env-open-space",
        key: "uffici_vdt_openspace",
        name: "Uffici Operativi Open-Space (Postazioni VDT)",
        icon: "💻",
        category: "office",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 70.0,
        volumeCuM: 189.0,
        occupantsCount: 6,
        windowSurfaceSqM: 9.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("office"),
      },
      {
        id: "env-sala-riunioni",
        key: "sala_riunioni",
        name: "Sala Riunioni e Meeting Room",
        icon: "🤝",
        category: "office",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 30.0,
        volumeCuM: 81.0,
        occupantsCount: 8,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("office"),
      },
      {
        id: "env-server-archivio",
        key: "server_room_archivio",
        name: "Locale Server Room e Archivio Documentale",
        icon: "🗄️",
        category: "technical",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 15.0,
        volumeCuM: 40.5,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          fireLoadHigh: true,
        },
      },
      {
        id: "env-area-break",
        key: "area_break_ristoro",
        name: "Area Break / Locale Ristoro",
        icon: "☕",
        category: "services",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 16.0,
        volumeCuM: 43.2,
        occupantsCount: 4,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("services"),
      },
      {
        id: "env-servizi-uffici",
        key: "servizi_igienici_uffici",
        name: "Servizi Igienici Personale (con Antibagno)",
        icon: "🚻",
        category: "services",
        isDefault: true,
        heightM: 2.4,
        surfaceSqM: 12.0,
        volumeCuM: 28.8,
        occupantsCount: 2,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("services"),
      },
    ];
  }

  // 7. Settore Sanitario, Ambulatori, Studi Medici (86.x, 87.x, 88.x)
  if (ateco.startsWith("86") || ateco.startsWith("87") || ateco.startsWith("88")) {
    return [
      {
        id: "env-ambulatori",
        key: "ambulatori_visita",
        name: "Ambulatori Visita e Sale Mediche",
        icon: "🩺",
        category: "production",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 25.0,
        volumeCuM: 67.5,
        occupantsCount: 2,
        windowSurfaceSqM: 3.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          wallsCondition: "washable_sanitizable_2m",
        },
      },
      {
        id: "env-attesa-reception",
        key: "sala_attesa_reception",
        name: "Sala d'Attesa e Reception",
        icon: "🛋️",
        category: "public",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 40.0,
        volumeCuM: 108.0,
        occupantsCount: 10,
        windowSurfaceSqM: 5.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("public"),
      },
      {
        id: "env-sterilizzazione",
        key: "locale_sterilizzazione",
        name: "Locale Sterilizzazione e Dispositivi Medici",
        icon: "🧴",
        category: "production",
        isDefault: true,
        heightM: 2.7,
        surfaceSqM: 14.0,
        volumeCuM: 37.8,
        occupantsCount: 1,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
        },
      },
      {
        id: "env-rot-rifiuti",
        key: "deposito_rifiuti_sanitari",
        name: "Deposito Rifiuti Sanitari Pericolosi (ROT)",
        icon: "☣️",
        category: "technical",
        isDefault: true,
        heightM: 2.5,
        surfaceSqM: 10.0,
        volumeCuM: 25.0,
        occupantsCount: 1,
        windowSurfaceSqM: 1.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("technical"),
      },
      {
        id: "env-servizi-sanita",
        key: "servizi_igienici_sanita",
        name: "Spogliatoi Personale e Servizi Igienici Utenti",
        icon: "🚻",
        category: "services",
        isDefault: true,
        heightM: 2.4,
        surfaceSqM: 16.0,
        volumeCuM: 38.4,
        occupantsCount: 2,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: defaultEnvironmentFeatures("services"),
      },
    ];
  }

  // 8. Fallback per Attività Generica
  return [
    {
      id: "env-uffici-base",
      key: "uffici_postazioni",
      name: "Uffici e Postazioni di Lavoro",
      icon: "🏢",
      category: "office",
      isDefault: true,
      heightM: 2.7,
      surfaceSqM: 45.0,
      volumeCuM: 121.5,
      occupantsCount: 3,
      windowSurfaceSqM: 6.0,
      isConfirmed: false,
      features: defaultEnvironmentFeatures("office"),
    },
    {
      id: "env-magazzino-base",
      key: "magazzino_stoccaggio",
      name: "Magazzino e Aree Stoccaggio",
      icon: "📦",
      category: "warehouse",
      isDefault: true,
      heightM: 3.0,
      surfaceSqM: 60.0,
      volumeCuM: 180.0,
      occupantsCount: 2,
      windowSurfaceSqM: 6.0,
      isConfirmed: false,
      features: defaultEnvironmentFeatures("warehouse"),
    },
    {
      id: "env-servizi-base",
      key: "servizi_spogliatoi",
      name: "Servizi Igienici e Spogliatoi",
      icon: "🚻",
      category: "services",
      isDefault: true,
      heightM: 2.4,
      surfaceSqM: 15.0,
      volumeCuM: 36.0,
      occupantsCount: 2,
      windowSurfaceSqM: 1.5,
      isConfirmed: false,
      features: defaultEnvironmentFeatures("services"),
    },
    {
      id: "env-tecnico-base",
      key: "locali_tecnici",
      name: "Locali Tecnici e Impianti",
      icon: "⚡",
      category: "technical",
      isDefault: true,
      heightM: 2.5,
      surfaceSqM: 12.0,
      volumeCuM: 30.0,
      occupantsCount: 1,
      windowSurfaceSqM: 1.0,
      isConfirmed: false,
      features: defaultEnvironmentFeatures("technical"),
    },
  ];
}

/**
 * Risultato della valutazione di conformità dimensionale, geometrica e CPI
 */
export interface EnvironmentComplianceResult {
  isHeightCompliant: boolean;
  minHeightRequired: number;
  cubaturePerWorker: number | null;
  isCubatureCompliant: boolean;
  surfacePerWorker: number | null;
  isSurfacePerWorkerCompliant: boolean;
  aeroilluminantRatio: number | null;
  isAeroilluminantCompliant: boolean;
  cpiActivityAlert: { code: string; title: string; description: string } | null;
  summaryBadges: Array<{ text: string; status: "success" | "warning" | "danger" | "info" }>;
}

/**
 * Valuta la conformità del locale secondo D.Lgs. 81/2008 Allegato IV e D.P.R. 151/2011 (CPI)
 */
export function evaluateEnvironmentCompliance(
  env: WorkEnvironmentInstance,
  atecoCode?: string,
): EnvironmentComplianceResult {
  const summaryBadges: Array<{ text: string; status: "success" | "warning" | "danger" | "info" }> = [];

  // 1. Altezza minima richiesta per legge (All. IV D.Lgs. 81/08 p.to 1.2)
  let minHeightRequired = 2.7;
  if (env.category === "production" || env.category === "warehouse") {
    minHeightRequired = 3.0; // 3,00 m per locali industriali e lavorazioni
  } else if (env.category === "services" || env.category === "technical") {
    minHeightRequired = 2.4; // 2,40 m per bagni, spogliatoi e disimpegni
  }

  const height = env.heightM ?? 0;
  const isHeightCompliant = height >= minHeightRequired;
  if (height > 0) {
    if (isHeightCompliant) {
      summaryBadges.push({ text: `Altezza a norma (${height.toFixed(2)}m ≥ ${minHeightRequired.toFixed(2)}m)`, status: "success" });
    } else {
      summaryBadges.push({
        text: `Altezza sotto soglia (${height.toFixed(2)}m < ${minHeightRequired.toFixed(2)}m) - Deroga ASL art. 65`,
        status: "warning",
      });
    }
  }

  // 2. Cubatura per lavoratore (All. IV p.to 1.2: almeno 10 mc per operatore)
  const surface = env.surfaceSqM ?? 0;
  const volume = env.volumeCuM ?? (surface > 0 && height > 0 ? surface * height : 0);
  const occupants = env.occupantsCount ?? 1;

  let cubaturePerWorker: number | null = null;
  let isCubatureCompliant = true;
  if (volume > 0 && occupants > 0) {
    cubaturePerWorker = volume / occupants;
    isCubatureCompliant = cubaturePerWorker >= 10.0;
    if (isCubatureCompliant) {
      summaryBadges.push({
        text: `Cubatura OK (${cubaturePerWorker.toFixed(1)} mc/op. ≥ 10 mc)`,
        status: "success",
      });
    } else {
      summaryBadges.push({
        text: `Sovraffollamento (${cubaturePerWorker.toFixed(1)} mc/op. < 10 mc di legge)`,
        status: "danger",
      });
    }
  }

  // 3. Superficie per lavoratore (All. IV p.to 1.2: almeno 2 mq liberi per operatore)
  let surfacePerWorker: number | null = null;
  let isSurfacePerWorkerCompliant = true;
  if (surface > 0 && occupants > 0) {
    surfacePerWorker = surface / occupants;
    isSurfacePerWorkerCompliant = surfacePerWorker >= 2.0;
    if (!isSurfacePerWorkerCompliant) {
      summaryBadges.push({
        text: `Superficie insufficiente (${surfacePerWorker.toFixed(1)} mq/op. < 2 mq)`,
        status: "danger",
      });
    }
  }

  // 4. Rapporto Aeroilluminante (RAI All. IV p.to 1.3: finestre ≥ 1/8 superficie)
  const windowSurface = env.windowSurfaceSqM ?? 0;
  let aeroilluminantRatio: number | null = null;
  let isAeroilluminantCompliant = true;
  if (surface > 0) {
    if (windowSurface > 0) {
      aeroilluminantRatio = windowSurface / surface;
      isAeroilluminantCompliant = aeroilluminantRatio >= 0.125 || env.features.aerationType === "mechanical_vmc";
      if (isAeroilluminantCompliant) {
        summaryBadges.push({ text: `Aerazione/Luce naturale OK (1/${Math.round(1 / aeroilluminantRatio)})`, status: "success" });
      } else {
        summaryBadges.push({
          text: `Aeroilluminante ridotto (1/${Math.round(1 / aeroilluminantRatio)} < 1/8) - VMC necessaria`,
          status: "warning",
        });
      }
    } else if (env.features.aerationType === "insufficient") {
      isAeroilluminantCompliant = false;
      summaryBadges.push({ text: "Locale cieco privo di aerazione meccanica forzata", status: "danger" });
    }
  }

  // 5. Assoggettabilità Certificato di Prevenzione Incendi (CPI - D.P.R. 151/2011)
  let cpiActivityAlert: { code: string; title: string; description: string } | null = null;

  // Attività 70: Magazzini merci combustibili con superficie > 500 mq o carico incendio elevato
  if (
    (env.category === "warehouse" || env.key.includes("magazzin") || env.key.includes("deposit")) &&
    surface >= 500
  ) {
    cpiActivityAlert = {
      code: "Attività 70 (D.P.R. 151/2011)",
      title: "Deposito Merci Combustibili ≥ 500 m² - Soggetto a CPI / SCIA VVF",
      description:
        "Locale di stoccaggio con superficie pari o superiore a 500 m²: obbligo di SCIA Antincendio / Certificato di Prevenzione Incendi VVF.",
    };
    summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 70 - Magazzino ≥500mq)", status: "danger" });
  }

  // Attività 75: Officine riparazione e autorimesse con superficie > 300 mq
  if (
    (env.key.includes("officin") || env.key.includes("autorimess") || env.key.includes("carrozzer")) &&
    surface >= 300
  ) {
    cpiActivityAlert = {
      code: "Attività 75 (D.P.R. 151/2011)",
      title: "Officina / Autorimessa ≥ 300 m² - Soggetta a CPI / SCIA VVF",
      description:
        "Officina o autorimessa con superficie coperta pari o superiore a 300 m²: soggetta a controlli di prevenzione incendi VVF.",
    };
    summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 75 - Officina ≥300mq)", status: "danger" });
  }

  // Attività 69: Esercizi commerciali e vendita con superficie > 400 mq
  if (
    (env.category === "public" || env.key.includes("vendit") || env.key.includes("negoz")) &&
    surface >= 400
  ) {
    cpiActivityAlert = {
      code: "Attività 69 (D.P.R. 151/2011)",
      title: "Locale di Vendita al Dettaglio ≥ 400 m² - Soggetto a CPI / SCIA VVF",
      description:
        "Locale commerciale con superficie lorda accessibile al pubblico pari o superiore a 400 m²: soggetto a controllo VVF.",
    };
    summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 69 - Vendita ≥400mq)", status: "danger" });
  }

  // Attività 65: Locali di pubblico spettacolo / somministrazione con affollamento > 100 persone
  if (
    (env.category === "public" || env.key.includes("sala") || env.key.includes("somministraz")) &&
    (occupants > 100 || surface >= 200)
  ) {
    cpiActivityAlert = {
      code: "Attività 65 (D.P.R. 151/2011)",
      title: "Locale di Trattenimento / Somministrazione Affollato - Rischio Esodo",
      description:
        "Capienza elevata o superficie estesa: obbligatorie almeno 2 uscite di sicurezza contrapposte con maniglioni antipanico (UNI EN 1125).",
    };
    summaryBadges.push({ text: "🔥 Alta Capienza (Attività 65 / Esodo Rilevante)", status: "warning" });
  }

  return {
    isHeightCompliant,
    minHeightRequired,
    cubaturePerWorker,
    isCubatureCompliant,
    surfacePerWorker,
    isSurfacePerWorkerCompliant,
    aeroilluminantRatio,
    isAeroilluminantCompliant,
    cpiActivityAlert,
    summaryBadges,
  };
}

/**
 * Singolo requisito di verifica della checklist del locale
 */
export interface EnvironmentCheckItem {
  id: string;
  area: string;
  title: string;
  question: string;
  normReference: string;
  defaultSeverity: number; // 1-4
  defaultSanctionable: boolean;
  domain: "safety" | "haccp" | "both";
  categoryTag:
    | "dimensionale"
    | "cpi"
    | "aspirazione"
    | "pavimenti_pareti"
    | "finestre"
    | "arredi_scaffali"
    | "microclima_luce"
    | "igiene";
  suggestedNonConformity: string;
}

/**
 * Genera dinamicamente l'elenco dei requisiti specifici per il singolo ambiente di lavoro
 */
export function generateEnvironmentChecklistItems(
  env: WorkEnvironmentInstance,
  atecoCode?: string,
): EnvironmentCheckItem[] {
  const items: EnvironmentCheckItem[] = [];
  const evalResult = evaluateEnvironmentCompliance(env, atecoCode);
  const isFoodEnv = env.category === "production" && (env.key.includes("cucina") || env.key.includes("plonge") || env.key.includes("cella"));

  // 1. Requisito Dimensionale & Cubatura
  items.push({
    id: `${env.id}-dim-cubatura`,
    area: env.name,
    title: "Altezza, Cubatura e Spazio Lavoratore",
    question: `Il locale presenta altezza utile (rilevata: ${env.heightM ? `${env.heightM}m` : "da verificare"}), cubatura (${env.volumeCuM ? `${env.volumeCuM}m³` : "da verificare"}) e superficie per operatore conformi all'Allegato IV punto 1.2 D.Lgs. 81/2008?`,
    normReference: "D.Lgs. 81/2008, Allegato IV punto 1.2 e art. 65",
    defaultSeverity: evalResult.isCubatureCompliant && evalResult.isHeightCompliant ? 2 : 3,
    defaultSanctionable: true,
    domain: "safety",
    categoryTag: "dimensionale",
    suggestedNonConformity: !evalResult.isHeightCompliant
      ? `Altezza del locale (${env.heightM}m) inferiore al minimo di legge (${evalResult.minHeightRequired}m): necessaria richiesta di deroga ASL ex art. 65 D.Lgs. 81/08.`
      : !evalResult.isCubatureCompliant
      ? `Cubatura per lavoratore insufficiente (${evalResult.cubaturePerWorker?.toFixed(1)} m³/operatore rispetto ai 10 m³ minimi prescritti dall'All. IV punto 1.2).`
      : "Parametri dimensionali non conformi agli standard minimi di igiene edilizia.",
  });

  // 2. Requisito CPI (se assoggettabile per soglia di superficie)
  if (evalResult.cpiActivityAlert) {
    items.push({
      id: `${env.id}-cpi-prevenzione`,
      area: env.name,
      title: evalResult.cpiActivityAlert.title,
      question: `Essendo la superficie del locale pari a ${env.surfaceSqM} m², è presente il Certificato di Prevenzione Incendi (CPI) o SCIA Antincendio VVF (${evalResult.cpiActivityAlert.code}) in corso di validità?`,
      normReference: "D.P.R. 151/2011 e D.Lgs. 139/2006",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity: `Locale con superficie di ${env.surfaceSqM} m² assoggettato a ${evalResult.cpiActivityAlert.code} privo di SCIA Antincendio / CPI in corso di validità.`,
    });
  }

  // 3. Requisito Pavimenti & Pendenze
  items.push({
    id: `${env.id}-pavimenti`,
    area: env.name,
    title: "Sicurezza Pavimentazione, Dislivelli e Sdrucciolamento",
    question: "La pavimentazione è fissa, stabile, antisdrucciolo, priva di buche, fessurazioni o dislivelli pericolosi, e dotata di idonee pendenze verso chiusini sifonati?",
    normReference: isFoodEnv ? "D.Lgs. 81/08 All. IV p.to 1.3 e Reg. CE 852/04 All. II Cap. II" : "D.Lgs. 81/2008, Allegato IV punto 1.3",
    defaultSeverity: 3,
    defaultSanctionable: true,
    domain: isFoodEnv ? "both" : "safety",
    categoryTag: "pavimenti_pareti",
    suggestedNonConformity: isFoodEnv
      ? "Pavimentazione con piastrelle rotte/fessurate o priva di caratteristiche antisdrucciolo adeguate; riscontrati ristagni d'acqua per assenza pendenze verso chiusini sifonati."
      : "Pavimento sconnesso con buche e dislivelli non segnalati lungo i percorsi di camminamento, con rischio di inciampo e scivolamento.",
  });

  // 4. Requisito Pareti & Finiture Igieniche
  items.push({
    id: `${env.id}-pareti`,
    area: env.name,
    title: isFoodEnv ? "Rivestimento Pareti Lavabili (Reg. CE 852/04)" : "Stato Pareti, Soffitti e Assenza Umidità",
    question: isFoodEnv
      ? "Le pareti sono rivestite con materiale impermeabile, non assorbente, lavabile e disinfettabile fino ad almeno 2 metri di altezza, con sguscia di raccordo arrotondata a pavimento?"
      : "Le pareti e i soffitti si presentano stabili, tinteggiati, privi di muffe, efflorescenze, umidità di risalita o intonaci pericolanti?",
    normReference: isFoodEnv ? "Reg. CE 852/2004, Allegato II, Cap. II punto 1" : "D.Lgs. 81/2008, Allegato IV punto 1.3.7",
    defaultSeverity: isFoodEnv ? 3 : 2,
    defaultSanctionable: true,
    domain: isFoodEnv ? "both" : "safety",
    categoryTag: "pavimenti_pareti",
    suggestedNonConformity: isFoodEnv
      ? "Pareti dell'area lavorazione prive di rivestimento lavabile fino ad altezza di 2,00 metri o con sguscia di raccordo rotta (Reg. CE 852/04)."
      : "Presenza di muffe diffuse, umidità e distacco di intonaco sulle pareti del locale con pregiudizio per la salubrità dell'ambiente.",
  });

  // 5. Requisito Finestre, Infissi e Vetri di Sicurezza
  items.push({
    id: `${env.id}-finestre`,
    area: env.name,
    title: "Finestre, Dispositivi di Apertura e Reti Anti-Insetto",
    question: isFoodEnv
      ? "Le finestre sono apribili in sicurezza, dotate di vetri antisfondamento e di zanzariere a maglia fitta lavabili e amovibili verso l'esterno?"
      : "Le finestre, lucernari e aperture sono dotati di congegni di manovra ad altezza uomo per apertura/chiusura in sicurezza e vetri stratificati di sicurezza (UNI EN 12600)?",
    normReference: isFoodEnv ? "D.Lgs. 81/08 All. IV p.to 1.3.16 e Reg. CE 852/04 All. II" : "D.Lgs. 81/2008, Allegato IV punto 1.3.16 e UNI EN 12600",
    defaultSeverity: 2,
    defaultSanctionable: true,
    domain: isFoodEnv ? "both" : "safety",
    categoryTag: "finestre",
    suggestedNonConformity: isFoodEnv
      ? "Aperture verso l'esterno sprovviste di zanzariere a maglia fitta lavabili, o con reti strappate (rischio ingresso infestanti)."
      : "Finestre prive di dispositivi di apertura sicuri da terra o con vetrate semplici esposte a rischio urto non protette con pellicola/stratificato.",
  });

  // 6. Requisito Impianto Aspirazione Forzata / VMC (se richiesto dal tipo di locale)
  if (env.features.forcedExhaustPresent || env.category === "production" || env.features.aerationType !== "natural") {
    let exhaustTitle = "Impianto di Aspirazione Forzata e Filtrazione";
    let exhaustQuestion = "L'impianto di aspirazione forzata / cappa è efficiente, canalizzato all'esterno con filtri puliti e sottoposto a manutenzione periodica?";
    let exhaustNote = "Impianto di aspirazione forzata non funzionante o con filtri intasati di polveri/grassi privo di registro manutenzione.";

    if (env.features.forcedExhaustType === "kitchen_hood" || env.key.includes("cucina")) {
      exhaustTitle = "Cappa Aspirante e Canna Fumaria Cucina";
      exhaustQuestion = "La cappa aspirante è dimensionata per la cottura, canalizzata all'esterno con canna fumaria certificata e filtri antigrasso puliti?";
      exhaustNote = "Cappa aspirante con filtri colmi di grasso e canna fumaria priva di dichiarazione di conformità DM 37/08 e pulizia canalizzazioni.";
    } else if (env.features.forcedExhaustType === "welding_arm") {
      exhaustTitle = "Aspirazione Localizzata Fumi di Saldatura";
      exhaustQuestion = "I banchi di saldatura sono provvisti di bracci snodati aspiranti posizionati sul punto di emissione con velocità di cattura a norma?";
      exhaustNote = "Assenza o inefficienza dei bracci aspiranti sui punti di saldatura con dispersione di fumi metallici nell'ambiente (D.Lgs. 81/08 art. 225).";
    } else if (env.features.forcedExhaustType === "spray_booth") {
      exhaustTitle = "Cabina Verniciatura ed Espulsione Solventi";
      exhaustQuestion = "La cabina di verniciatura dispone di depressione controllata, filtri paint-stop e carboni attivi con registro sostituzione?";
      exhaustNote = "Cabina di verniciatura con filtri saturi o registro carboni attivi non aggiornato (D.Lgs. 152/06 e D.Lgs. 81/08).";
    } else if (env.features.forcedExhaustType === "wood_dust_atex") {
      exhaustTitle = "Impianto Aspirazione Polveri Legno (Norma ATEX)";
      exhaustQuestion = "Tutte le macchine per legno sono collegate all'impianto centralizzato con silos esterno, valvole di non ritorno e filtro ATEX?";
      exhaustNote = "Macchine da taglio legno sprovviste di collegamento all'aspiratore centralizzato con deposito polveri combustibili a terra (rischio ATEX).";
    } else if (env.category === "services" && env.windowSurfaceSqM === 0) {
      exhaustTitle = "Aspiratore Meccanico Servizio Cieco";
      exhaustQuestion = "Il locale W.C. cieco è provvisto di impianto di estrazione forzata funzionante (almeno 5 ricambi d'aria orari) collegato alla luce?";
      exhaustNote = "Servizio igienico privo di finestra con aspiratore forzato guasto o assente (violazione regolamento igienico-sanitario).";
    }

    items.push({
      id: `${env.id}-aspirazione-forzata`,
      area: env.name,
      title: exhaustTitle,
      question: exhaustQuestion,
      normReference: "D.Lgs. 81/2008, Allegato IV punto 1.9 e art. 224-225",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity: exhaustNote,
    });
  }

  // 7. Requisito Arredi, Scaffalature e Postazioni di Lavoro
  if (env.category === "warehouse" || env.features.shelvingCertified) {
    items.push({
      id: `${env.id}-scaffali-portata`,
      area: env.name,
      title: "Scaffalature Metalliche e Cartelli di Portata (UNI EN 15635)",
      question: "Le scaffalature industriali sono ancorate saldamente, provviste di cartelli di portata massima visibili, paracolpi montanti e verbale di ispezione annuale?",
      normReference: "D.Lgs. 81/2008, art. 71 e norma UNI EN 15635",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity: "Scaffalature metalliche prive di cartelli attestanti la portata per campata/ripiano e prive di verifica periodica statica annuale.",
    });
  } else if (env.category === "office") {
    items.push({
      id: `${env.id}-arredi-ergonomia`,
      area: env.name,
      title: "Ergonomia Postazioni VDT e Arredi",
      question: "Le scrivanie e le sedute di lavoro sono ergonomiche, regolabili, con supporto lombare e cavi elettrici canalizzati senza rischio inciampo?",
      normReference: "D.Lgs. 81/2008, Titolo VII e Allegato XXXIV",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity: "Sedie da lavoro prive di regolazione ergonomica lombare o presenza di cavi elettrici volanti a terra privi di canalina passacavi.",
    });
  } else if (env.category === "services") {
    items.push({
      id: `${env.id}-armadietti-spogliatoio`,
      area: env.name,
      title: "Armadietti a Doppio Scomparto (Sporco/Pulito)",
      question: "Gli armadietti spogliatoio sono individuali, lavabili, dotati di chiave e provvisti di doppio scomparto per separare gli abiti civili da quelli da lavoro?",
      normReference: "D.Lgs. 81/2008, Allegato IV punto 1.12",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: isFoodEnv ? "both" : "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity: "Armadietti dello spogliatoio a scomparto singolo non idonei alla separazione degli indumenti da lavoro da quelli civili (All. IV p.to 1.12).",
    });
  }

  // 8. Requisito Illuminazione di Emergenza & Vie di Fuga
  items.push({
    id: `${env.id}-luce-emergenza-esodo`,
    area: env.name,
    title: "Illuminazione di Emergenza e Vie di Fuga",
    question: "Le vie di fuga, porte e uscite di emergenza sono segnalate con cartelli fotoluminescenti (UNI EN ISO 7010) e dotate di lampade di emergenza funzionanti?",
    normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e D.M. 02/09/2021",
    defaultSeverity: 3,
    defaultSanctionable: true,
    domain: "safety",
    categoryTag: "microclima_luce",
    suggestedNonConformity: "Lampade di illuminazione di emergenza guaste o con batterie esauste lungo i percorsi di esodo verso l'uscita.",
  });

  // 9. Requisito Microclima & Ventilazione
  items.push({
    id: `${env.id}-microclima-areazione`,
    area: env.name,
    title: "Microclima, Riscaldamento e Ricambio d'Aria",
    question: "La temperatura, l'umidità e la velocità dell'aria sono adeguate alle mansioni svolte, senza correnti d'aria fastidiose e con split/UTA sanificati periodicamente?",
    normReference: "D.Lgs. 81/2008, Allegato IV punto 1.9",
    defaultSeverity: 2,
    defaultSanctionable: true,
    domain: "safety",
    categoryTag: "microclima_luce",
    suggestedNonConformity: "Impianto di climatizzazione con filtri sporchi e assenza di registro attestante la periodica sanificazione e pulizia delle canalizzazioni.",
  });

  return items;
}

