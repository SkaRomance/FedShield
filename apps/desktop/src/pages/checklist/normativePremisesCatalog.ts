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
  | "outdoor"
  | "sales_office"
  | "storage"
  | "changing_rooms";

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
  emergencyExitsCount?: number;
  hasTrappedPersonAlarm?: boolean;
  gasLeakDetectorPresent?: boolean;
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
  hasForcedVentilation?: boolean;
  gasThermalPowerKw?: number;
  emergencyExitsCount?: number;
}

export function defaultEnvironmentFeatures(category: WorkEnvironmentCategory): WorkEnvironmentFeatures {
  const isProd = category === "production";
  const isWh = category === "warehouse" || category === "storage";
  const isServices = category === "services" || category === "changing_rooms";
  return {
    aerationType: "natural",
    forcedExhaustPresent: isProd,
    forcedExhaustType: isProd ? "kitchen_hood" : "none",
    lightingType: "natural_artificial",
    emergencyLighting: true,
    flooringCondition: "compliant_anti_slip",
    wallsCondition: isProd || isServices ? "washable_sanitizable_2m" : "plaster_dry",
    windowsSafe: true,
    insectScreens: isProd,
    antiShatterGlass: true,
    shelvingCertified: isWh,
    microclimateCompliant: true,
    fireLoadHigh: isWh,
  };
}

/**
 * Catalogo Ambienti Standard profilati dinamicamente per Codice ATECO
 */
export function getStandardEnvironmentsForAteco(atecoCode?: string): WorkEnvironmentInstance[] {
  const ateco = (atecoCode ?? "").trim().replace(/[^0-9]/g, "");

  // 0. Ipermercato e Grandi Strutture di Vendita GDO (47.11.1, 47.11.10 - superficie oltre 2.500 mq)
  if (ateco.startsWith("47111")) {
    return [
      {
        id: "env-iper-corsie",
        key: "iper_corsie_area_vendita",
        name: "Area Vendita / Corsie Ipermercato e Scaffalature",
        icon: "🛒",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 3500,
        heightM: 5.0,
        volumeCuM: 17500,
        occupantsCount: 30,
        emergencyExitsCount: 6,
        windowSurfaceSqM: 50,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          forcedExhaustPresent: true,
          emergencyLighting: true,
          emergencyExitsCount: 6,
          shelvingCertified: true,
          fireLoadHigh: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-iper-macelleria",
        key: "iper_macelleria_laboratorio",
        name: "Reparto Macelleria / Laboratorio Lavorazione Carni & Cella",
        icon: "🥩",
        category: "production",
        isDefault: true,
        surfaceSqM: 65,
        heightM: 3.2,
        volumeCuM: 208,
        occupantsCount: 4,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-iper-pescheria",
        key: "iper_pescheria_laboratorio",
        name: "Reparto Pescheria / Laboratorio Eviscerazione & Cella Pesce",
        icon: "🐟",
        category: "production",
        isDefault: true,
        surfaceSqM: 50,
        heightM: 3.2,
        volumeCuM: 160,
        occupantsCount: 3,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-iper-gastronomia",
        key: "iper_gastronomia_cucina",
        name: "Reparto Gastronomia / Salumeria / Cucina Calda & Banco Assistito",
        icon: "🧀",
        category: "production",
        isDefault: true,
        surfaceSqM: 55,
        heightM: 3.2,
        volumeCuM: 176,
        occupantsCount: 4,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-iper-panetteria",
        key: "iper_panetteria_forno",
        name: "Reparto Panetteria / Pasticceria / Forno & Laboratorio Panificazione",
        icon: "🥖",
        category: "production",
        isDefault: true,
        surfaceSqM: 70,
        heightM: 3.5,
        volumeCuM: 245,
        occupantsCount: 3,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-iper-ortofrutta",
        key: "iper_ortofrutta_mondatura",
        name: "Reparto Ortofrutta / Esposizione, Mondatura & Cella Verdura",
        icon: "🥦",
        category: "production",
        isDefault: true,
        surfaceSqM: 80,
        heightM: 3.5,
        volumeCuM: 280,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-iper-magazzino",
        key: "iper_magazzino_ricevimento",
        name: "Magazzino Centrale / Ricevimento Merci & Baie di Carico",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 1200,
        heightM: 6.5,
        volumeCuM: 7800,
        occupantsCount: 8,
        emergencyExitsCount: 4,
        windowSurfaceSqM: 30,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          emergencyLighting: true,
          shelvingCertified: true,
          fireLoadHigh: true,
          flooringCondition: "compliant_anti_slip",
          emergencyExitsCount: 4,
        },
      },
      {
        id: "env-iper-celle-frigo",
        key: "iper_celle_frigo_stoccaggio",
        name: "Celle Frigorifere di Stoccaggio Principali (Celle TN e BT)",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 150,
        heightM: 3.5,
        volumeCuM: 525,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          aerationType: "insufficient",
          flooringCondition: "compliant_anti_slip",
          wallsCondition: "washable_sanitizable_2m",
          shelvingCertified: true,
          hasTrappedPersonAlarm: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-iper-centrale-frigo",
        key: "iper_centrale_frigorifera",
        name: "Locale Tecnico Centrale Frigorifera & Impianti",
        icon: "⚙️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 45,
        heightM: 3.0,
        volumeCuM: 135,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          forcedExhaustPresent: true,
          gasLeakDetectorPresent: true,
          emergencyLighting: true,
        },
      },
      {
        id: "env-iper-compattatore",
        key: "iper_locale_compattatori",
        name: "Locale Compattatori Rifiuti & Stoccaggio Cartone/Plastica",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 60,
        heightM: 4.0,
        volumeCuM: 240,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          fireLoadHigh: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-iper-casse-uffici",
        key: "iper_barriera_casse_uffici",
        name: "Barriera Casse / Uffici Cassa Centrale & Direzione",
        icon: "🖥️",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 120,
        heightM: 3.0,
        volumeCuM: 360,
        occupantsCount: 12,
        windowSurfaceSqM: 15,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-iper-spogliatoi",
        key: "iper_spogliatoi_personale",
        name: "Spogliatoi e Servizi Igienici Personale (Uomini e Donne)",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 90,
        heightM: 2.7,
        volumeCuM: 243,
        occupantsCount: 25,
        windowSurfaceSqM: 6,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("changing_rooms"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          forcedExhaustPresent: true,
          forcedExhaustType: "blind_toilet_fan",
        },
      },
    ];
  }

  // 0-bis. Supermercato (47.11.2, 47.11.20 - superficie di vendita da 400 a 2.500 mq)
  if (ateco.startsWith("47112")) {
    return [
      {
        id: "env-super-corsie",
        key: "super_corsie_area_vendita",
        name: "Area Vendita / Corsie Supermercato a Libero Servizio",
        icon: "🛒",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 900,
        heightM: 3.8,
        volumeCuM: 3420,
        occupantsCount: 12,
        emergencyExitsCount: 3,
        windowSurfaceSqM: 20,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          forcedExhaustPresent: true,
          emergencyLighting: true,
          emergencyExitsCount: 3,
          shelvingCertified: true,
          fireLoadHigh: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-super-gastronomia",
        key: "super_gastronomia_banco",
        name: "Reparto Gastronomia / Salumeria / Formaggi & Banco Assistito",
        icon: "🧀",
        category: "production",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 3.0,
        volumeCuM: 105,
        occupantsCount: 3,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-super-macelleria",
        key: "super_macelleria_laboratorio",
        name: "Reparto Macelleria / Laboratorio Porzionamento Carni & Banco",
        icon: "🥩",
        category: "production",
        isDefault: true,
        surfaceSqM: 40,
        heightM: 3.0,
        volumeCuM: 120,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-super-panetteria",
        key: "super_panetteria_bakeoff",
        name: "Reparto Panetteria / Punto Caldo Bake-Off & Confezionati",
        icon: "🥖",
        category: "production",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 3.2,
        volumeCuM: 96,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-super-ortofrutta",
        key: "super_ortofrutta_mondatura",
        name: "Reparto Ortofrutta / Esposizione e Mondatura",
        icon: "🥦",
        category: "production",
        isDefault: true,
        surfaceSqM: 45,
        heightM: 3.2,
        volumeCuM: 144,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-super-pescheria",
        key: "super_pescheria_banco",
        name: "Reparto Pescheria / Banco Pesce Fresco & Cella",
        icon: "🐟",
        category: "production",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 3.0,
        volumeCuM: 90,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-super-magazzino",
        key: "super_magazzino_merci",
        name: "Magazzino Merci & Deposito Scorte con Portone Scarico",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 350,
        heightM: 4.5,
        volumeCuM: 1575,
        occupantsCount: 4,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 10,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          emergencyLighting: true,
          shelvingCertified: true,
          fireLoadHigh: true,
          flooringCondition: "compliant_anti_slip",
          emergencyExitsCount: 2,
        },
      },
      {
        id: "env-super-celle-frigo",
        key: "super_celle_frigo_stoccaggio",
        name: "Celle Frigorifere Principali di Stoccaggio TN e BT",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 50,
        heightM: 3.0,
        volumeCuM: 150,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          aerationType: "insufficient",
          flooringCondition: "compliant_anti_slip",
          wallsCondition: "washable_sanitizable_2m",
          shelvingCertified: true,
          hasTrappedPersonAlarm: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-super-compattatore",
        key: "super_locale_compattatore",
        name: "Locale Compattatore Cartone & Stoccaggio Imballaggi",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 3.2,
        volumeCuM: 96,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          fireLoadHigh: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-super-casse-uffici",
        key: "super_barriera_casse_uffici",
        name: "Barriera Casse & Ufficio Cassa / Direzione",
        icon: "🖥️",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 50,
        heightM: 3.0,
        volumeCuM: 150,
        occupantsCount: 6,
        windowSurfaceSqM: 8,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-super-spogliatoi",
        key: "super_spogliatoi_personale",
        name: "Spogliatoi e Servizi Igienici Personale (Uomini e Donne)",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 45,
        heightM: 2.7,
        volumeCuM: 121.5,
        occupantsCount: 12,
        windowSurfaceSqM: 4,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("changing_rooms"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          forcedExhaustPresent: true,
          forcedExhaustType: "blind_toilet_fan",
        },
      },
      {
        id: "env-super-tecnico",
        key: "super_locale_tecnico_quadri",
        name: "Locale Tecnico / Quadri Elettrici & Compressori Frigo",
        icon: "⚙️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 3.0,
        volumeCuM: 75,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          forcedExhaustPresent: true,
          emergencyLighting: true,
          gasLeakDetectorPresent: true,
        },
      },
    ];
  }

  // 0-ter. Ristorazione con somministrazione (56.10.11, 56.10.1, 56.10.10 - Ristoranti, Trattorie, Osterie)
  if (ateco.startsWith("561011") || ateco.startsWith("56101")) {
    return [
      {
        id: "env-rist-cucina",
        key: "rist_cucina_calda",
        name: "Cucina / Reparto Cottura Calda & Preparazione Primaria",
        icon: "🍳",
        category: "production",
        isDefault: true,
        surfaceSqM: 45,
        heightM: 3.0,
        volumeCuM: 135,
        occupantsCount: 4,
        windowSurfaceSqM: 4.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-rist-plonge",
        key: "rist_plonge_lavaggio",
        name: "Zona Lavaggio Stoviglie & Pentole (Plonge Separata)",
        icon: "🧼",
        category: "production",
        isDefault: true,
        surfaceSqM: 15,
        heightM: 3.0,
        volumeCuM: 45,
        occupantsCount: 2,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-rist-prep-fredda",
        key: "rist_prep_fredda",
        name: "Zona Preparazione Fredda / Antipasti, Crudi & Pasticceria",
        icon: "🥗",
        category: "production",
        isDefault: true,
        surfaceSqM: 18,
        heightM: 3.0,
        volumeCuM: 54,
        occupantsCount: 2,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-rist-celle",
        key: "rist_celle_frigo_deperibili",
        name: "Celle Frigorifere / Deposito Deperibili (Carni, Verdura, Latticini, Pesce, BT)",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.6,
        volumeCuM: 52,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
          hasTrappedPersonAlarm: true,
        },
      },
      {
        id: "env-rist-dispensa",
        key: "rist_dispensa_secco_vini",
        name: "Dispensa Alimenti Non Deperibili (Magazzino Secco & Cantina Vini)",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.7,
        volumeCuM: 67.5,
        occupantsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-rist-sala",
        key: "rist_sala_somministrazione",
        name: "Sala Ristorazione / Somministrazione & Pranzo",
        icon: "🍽️",
        category: "public",
        isDefault: true,
        surfaceSqM: 120,
        heightM: 2.8,
        volumeCuM: 336,
        occupantsCount: 60,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 15.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
          antiShatterGlass: true,
          emergencyExitsCount: 2,
        },
      },
      {
        id: "env-rist-bar-cassa",
        key: "rist_banco_bar_cassa",
        name: "Banco Bar / Mescita Bevande, Caffetteria & Punto Cassa",
        icon: "☕",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.8,
        volumeCuM: 56,
        occupantsCount: 2,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-rist-spogliatoi",
        key: "rist_spogliatoi_personale",
        name: "Spogliatoio e Servizi Igienici Personale (con Antibagno)",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 16,
        heightM: 2.4,
        volumeCuM: 38.4,
        occupantsCount: 6,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("changing_rooms"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          forcedExhaustPresent: true,
          forcedExhaustType: "blind_toilet_fan",
        },
      },
      {
        id: "env-rist-wc-clienti",
        key: "rist_wc_clienti_disabili",
        name: "Servizi Igienici Clienti (Accessibile Disabili D.P.R. 503/96 - D.M. 236/89)",
        icon: "♿",
        category: "services",
        isDefault: true,
        surfaceSqM: 15,
        heightM: 2.4,
        volumeCuM: 36,
        occupantsCount: 2,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("services"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          forcedExhaustPresent: true,
          forcedExhaustType: "blind_toilet_fan",
        },
      },
      {
        id: "env-rist-rifiuti",
        key: "rist_deposito_rifiuti_olii",
        name: "Area Deposito Rifiuti & Stoccaggio Olii Esausti",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 12,
        heightM: 2.7,
        volumeCuM: 32.4,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-rist-tecnico",
        key: "rist_centrale_termica_gas",
        name: "Centrale Termica / Impianto Gas Metano & Quadro Elettrico",
        icon: "⚡",
        category: "technical",
        isDefault: true,
        surfaceSqM: 10,
        heightM: 2.5,
        volumeCuM: 25,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
          gasLeakDetectorPresent: true,
        },
      },
    ];
  }

  // 0-quater. Pizzeria / Asporto / Delivery (56.10.20, 56.10.2 - Pizzerie tradizionali, al taglio, asporto e delivery)
  if (ateco.startsWith("561020") || ateco.startsWith("56102")) {
    return [
      {
        id: "env-piz-laboratorio",
        key: "piz_laboratorio_stesura_cottura",
        name: "Laboratorio Pizzeria / Banco Stesura, Farcitura & Cottura Pizze",
        icon: "🍕",
        category: "production",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 3.0,
        volumeCuM: 105,
        occupantsCount: 3,
        windowSurfaceSqM: 3.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-piz-impasto",
        key: "piz_impasto_lievitazione",
        name: "Locale Impasto & Lievitazione / Fermentazione Impasti",
        icon: "🥣",
        category: "production",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 3.0,
        volumeCuM: 60,
        occupantsCount: 2,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-piz-forno-legna",
        key: "piz_forno_legna_deposito",
        name: "Area Forno Pizze & Deposito Legna da Ardere",
        icon: "🔥",
        category: "production",
        isDefault: true,
        surfaceSqM: 15,
        heightM: 3.2,
        volumeCuM: 48,
        occupantsCount: 1,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-piz-prep-ingredienti",
        key: "piz_prep_ingredienti_tagliamozzarella",
        name: "Zona Preparazione Ingredienti & Tagliamozzarella",
        icon: "🧀",
        category: "production",
        isDefault: true,
        surfaceSqM: 18,
        heightM: 3.0,
        volumeCuM: 54,
        occupantsCount: 2,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
        },
      },
      {
        id: "env-piz-lavaggio",
        key: "piz_lavaggio_teglie_cassette",
        name: "Zona Lavaggio Teglie, Cassette Impasto & Stoviglie",
        icon: "🧼",
        category: "production",
        isDefault: true,
        surfaceSqM: 14,
        heightM: 3.0,
        volumeCuM: 42,
        occupantsCount: 1,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-piz-celle",
        key: "piz_celle_frigo_deperibili",
        name: "Celle Frigorifere / Deposito Deperibili (Latticini, Mozzarelle, Salumi, Verdure)",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 18,
        heightM: 2.6,
        volumeCuM: 46.8,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
          hasTrappedPersonAlarm: true,
        },
      },
      {
        id: "env-piz-dispensa",
        key: "piz_dispensa_secco_farine_cartoni",
        name: "Dispensa Secco / Deposito Sacchi Farina & Cartoni Pizza MOCA",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.7,
        volumeCuM: 67.5,
        occupantsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-piz-sala-asporto",
        key: "piz_sala_somministrazione_asporto",
        name: "Sala Somministrazione & Area Ritiro Asporto / Delivery",
        icon: "🍽️",
        category: "public",
        isDefault: true,
        surfaceSqM: 90,
        heightM: 2.8,
        volumeCuM: 252,
        occupantsCount: 45,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 12.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
          antiShatterGlass: true,
          emergencyExitsCount: 2,
        },
      },
      {
        id: "env-piz-spogliatoi",
        key: "piz_spogliatoi_personale",
        name: "Spogliatoio e Servizi Igienici Personale (con Antibagno)",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 15,
        heightM: 2.4,
        volumeCuM: 36,
        occupantsCount: 5,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("changing_rooms"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          forcedExhaustPresent: true,
          forcedExhaustType: "blind_toilet_fan",
        },
      },
      {
        id: "env-piz-wc-clienti",
        key: "piz_wc_clienti_disabili",
        name: "Servizi Igienici Clienti (Accessibile Disabili D.P.R. 503/96 - D.M. 236/89)",
        icon: "♿",
        category: "services",
        isDefault: true,
        surfaceSqM: 12,
        heightM: 2.4,
        volumeCuM: 28.8,
        occupantsCount: 2,
        windowSurfaceSqM: 1.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("services"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          forcedExhaustPresent: true,
          forcedExhaustType: "blind_toilet_fan",
        },
      },
      {
        id: "env-piz-rifiuti",
        key: "piz_deposito_rifiuti_ceneri",
        name: "Area Deposito Rifiuti & Smaltimento Ceneri Forno Legna",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 10,
        heightM: 2.6,
        volumeCuM: 26,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-piz-tecnico",
        key: "piz_locale_tecnico_gas_abbattitore",
        name: "Locale Tecnico / Quadro Elettrico, Allacciamento Gas & Abbattitore Fumi",
        icon: "⚡",
        category: "technical",
        isDefault: true,
        surfaceSqM: 10,
        heightM: 2.5,
        volumeCuM: 25,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
          gasLeakDetectorPresent: true,
        },
      },
    ];
  }

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
  if (env.category === "production" || env.category === "warehouse" || env.category === "storage") {
    minHeightRequired = 3.0; // 3,00 m per locali industriali, stoccaggio e lavorazioni
  } else if (env.category === "services" || env.category === "changing_rooms" || env.category === "technical") {
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
    (env.category === "warehouse" || env.category === "storage" || env.key.includes("magazzin") || env.key.includes("deposit")) &&
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

  // Attività 69: Esercizi commerciali e vendita con superficie ≥ 400 mq (69.1.A: 400-1500 mq, 69.2.B: 1500-3000 mq, 69.3.C: ≥3000 mq)
  if (
    (env.category === "public" ||
      env.category === "sales_office" ||
      env.key.includes("vendit") ||
      env.key.includes("negoz") ||
      env.key.includes("corsie")) &&
    surface >= 400
  ) {
    if (surface >= 3000) {
      cpiActivityAlert = {
        code: "Attività 69.3.C (D.P.R. 151/2011)",
        title: "Grande Struttura di Vendita / Ipermercato ≥ 3.000 m² - Categoria C CPI VVF",
        description:
          "Locale di vendita al dettaglio con superficie lorda accessibile al pubblico > 3.000 m²: soggetta a parere preventivo di conformità, SCIA e sopralluogo con CPI da parte del Comando VVF.",
      };
      summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 69.C - Ipermercato ≥3.000mq)", status: "danger" });
    } else if (surface > 1500) {
      cpiActivityAlert = {
        code: "Attività 69.2.B (D.P.R. 151/2011)",
        title: "Supermercato / Vendita > 1.500 m² e ≤ 3.000 m² - Categoria B CPI VVF",
        description:
          "Locale commerciale con superficie lorda accessibile al pubblico compresa tra 1.501 e 3.000 m²: soggetto a valutazione del progetto da parte dei VVF e SCIA antincendio con controlli a campione (D.P.R. 151/2011).",
      };
      summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 69.2.B - Supermercato >1.500mq)", status: "danger" });
    } else {
      cpiActivityAlert = {
        code: "Attività 69.1.A (D.P.R. 151/2011)",
        title: "Supermercato / Vendita 400-1.500 m² - Categoria A CPI VVF",
        description:
          "Locale commerciale con superficie lorda accessibile al pubblico compresa tra 400 e 1.500 m²: soggetto a presentazione di SCIA antincendio senza obbligo di preventivo esame progetto (D.P.R. 151/2011).",
      };
      summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 69.1.A - Supermercato 400-1.500mq)", status: "danger" });
    }
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

  // 6. Regole ad hoc per reparti Ipermercato/Supermercato e impianti specifici
  // a) Celle frigorifere: Obbligo dispositivo allarme uomo intrappolato a norma UNI EN 378
  const isColdRoom =
    env.id.includes("celle-frigo") ||
    env.key.includes("cella") ||
    env.category === "storage" ||
    !!env.features.hasTrappedPersonAlarm;
  if (isColdRoom) {
    summaryBadges.push({
      text: "❄️ Allarme uomo intrappolato e sblocco fluorescente (UNI EN 378)",
      status: "warning",
    });
  }

  // b) Area Vendita / Corsie Ipermercato: Vie di esodo larghe ≥ 2,40m e uscite di emergenza
  const isLargeRetailArea =
    env.id.includes("iper-corsie") ||
    env.key.includes("iper_corsie") ||
    ((env.category === "sales_office" || env.category === "public") && surface >= 2500);
  if (isLargeRetailArea) {
    summaryBadges.push({
      text: "🚪 Corsie di esodo principali ≥ 2,40m (D.M. 27/07/2010)",
      status: "info",
    });
    const exits = env.emergencyExitsCount ?? env.features.emergencyExitsCount ?? 0;
    if (exits >= 4) {
      summaryBadges.push({
        text: `Uscite di emergenza: ${exits} varchi con maniglioni antipanico`,
        status: "success",
      });
    }
  }

  // b2) Area Vendita / Corsie Supermercato: Vie di esodo larghe ≥ 1,80m e uscite di emergenza
  const isSupermarketRetailArea =
    env.id.includes("super-corsie") ||
    env.key.includes("super_corsie") ||
    (!isLargeRetailArea &&
      (env.category === "sales_office" || env.category === "public") &&
      surface >= 400 &&
      surface < 2500);
  if (isSupermarketRetailArea) {
    summaryBadges.push({
      text: "🚪 Corsie di esodo principali ≥ 1,80m (D.M. 27/07/2010)",
      status: "info",
    });
    const exits = env.emergencyExitsCount ?? env.features.emergencyExitsCount ?? 0;
    if (exits >= 3) {
      summaryBadges.push({
        text: `Uscite di emergenza: ${exits} varchi con maniglioni antipanico`,
        status: "success",
      });
    }
  }

  // c) Centrale frigorifera / Locale tecnico compressori: Sensori fughe gas refrigerante e ventilazione meccanica di emergenza
  const isRefrigerationPlant =
    (env.id.includes("centrale-frigo") ||
      env.key.includes("centrale_frigo") ||
      env.id.includes("super-tecnico") ||
      env.key.includes("super_tecnico") ||
      (!env.id.includes("rist") && !env.key.includes("rist") && !env.id.includes("piz") && !env.key.includes("piz") && (env.id.includes("tecnico") || env.key.includes("tecnico")))) &&
    !!env.features.gasLeakDetectorPresent;
  if (isRefrigerationPlant) {
    summaryBadges.push({
      text: "⚙️ Sensori gas refrigerante & ventilazione emergenza (UNI EN 378)",
      status: "warning",
    });
  }

  // d) Compattatori rifiuti: sicurezza macchine pressatrici e rischio incendio
  if (env.id.includes("compattatore") || env.key.includes("compattator")) {
    summaryBadges.push({
      text: "🗑️ Presse compattatrici: sicurezza macchine & rischio incendio",
      status: "info",
    });
  }

  // 7. Regole ad hoc per Ristorazione con somministrazione (56.10.11 / 56.10.1 - Ristoranti, Trattorie)
  // a) Cucina ristorante: altezza minima 3.00m (o deroga ASL se >= 2.70m con VMC), cappa compensata filtri a labirinto, lavamani non manuale
  const isRestaurantKitchen =
    env.id === "env-rist-cucina" ||
    env.key === "rist_cucina_calda" ||
    (env.id.includes("cucina") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56101") ?? false));
  if (isRestaurantKitchen) {
    if (height >= 3.0) {
      summaryBadges.push({
        text: "🍳 Cucina a norma: altezza ≥ 3,00m, cappa compensata a labirinto & Ansul",
        status: "success",
      });
    } else if (height >= 2.7) {
      summaryBadges.push({
        text: "🍳 Cucina con deroga ASL: altezza ≥ 2,70m con VMC e cappa compensata",
        status: "warning",
      });
    }
    summaryBadges.push({
      text: "🚿 Lavamani comando non manuale acqua calda/fredda (Reg. CE 852/04)",
      status: "info",
    });
  }

  // b) Sala ristorazione: vie di esodo libere >= 1.20m, uscite di emergenza con maniglioni antipanico, illuminazione di sicurezza
  const isRestaurantHall =
    env.id === "env-rist-sala" ||
    env.key === "rist_sala_somministrazione" ||
    (env.id.includes("sala") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56101") ?? false));
  if (isRestaurantHall) {
    summaryBadges.push({
      text: "🚪 Vie di esodo libere ≥ 1,20m & uscite di emergenza con maniglioni antipanico",
      status: "info",
    });
    summaryBadges.push({
      text: "💡 Illuminazione di emergenza ≥ 5 lux & estintori 34A 233B",
      status: "success",
    });
  }

  // c) Plonge: separazione rispetto all'area cottura/preparazione per evitare reflussi e contaminazioni crociate (marcia in avanti)
  const isRestaurantPlonge =
    env.id === "env-rist-plonge" ||
    env.key === "rist_plonge_lavaggio" ||
    env.id.includes("plonge");
  if (isRestaurantPlonge) {
    summaryBadges.push({
      text: "🧼 Plonge separata: percorso sporco/pulito marcia in avanti & cappa vapore",
      status: "info",
    });
  }

  // d) Celle deperibili: teletermometri continui HACCP (allarme uomo intrappolato già aggiunto da isColdRoom)
  const isRestaurantColdRoom =
    env.id === "env-rist-celle" ||
    env.key === "rist_celle_frigo_deperibili";
  if (isRestaurantColdRoom) {
    summaryBadges.push({
      text: "🌡️ Teletermometri continui HACCP (carni 0-4°C, pesce 0-2°C, BT -18°C)",
      status: "info",
    });
  }

  // e) Spogliatoi staff: armadietti a doppio scomparto sporco/pulito
  const isRestaurantStaffLocker =
    env.id === "env-rist-spogliatoi" ||
    env.key === "rist_spogliatoi_personale";
  if (isRestaurantStaffLocker) {
    summaryBadges.push({
      text: "🚻 Armadietti doppio scomparto sporco/pulito & lavamani con antibagno",
      status: "info",
    });
  }

  // f) Locale tecnico: elettrovalvola gas metano con pulsante di sgancio di emergenza esterno
  const isRestaurantTechnicalGas =
    env.id === "env-rist-tecnico" ||
    env.key === "rist_centrale_termica_gas";
  if (isRestaurantTechnicalGas) {
    summaryBadges.push({
      text: "⚡ Elettrovalvola gas metano esterna a riarmo manuale con pulsante sgancio emergenza",
      status: "warning",
    });
  }

  // 8. Regole ad hoc per Pizzeria / Asporto / Delivery (56.10.20 / 56.10.2)
  // a) Laboratorio pizzeria: altezza minima 3.00m (o deroga ASL), cappa aspirazione sopra bocca forno, lavamani non manuale
  const isPizzeriaLab =
    env.id === "env-piz-laboratorio" ||
    env.key === "piz_laboratorio_stesura_cottura" ||
    (env.id.includes("laboratorio") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56102") ?? false));
  if (isPizzeriaLab) {
    if (height >= 3.0) {
      summaryBadges.push({
        text: "🍕 Laboratorio pizzeria a norma: altezza ≥ 3,00m & cappa aspirazione fumi forno",
        status: "success",
      });
    } else if (height >= 2.7) {
      summaryBadges.push({
        text: "🍕 Laboratorio con deroga ASL: altezza ≥ 2,70m con VMC e cappa fumi",
        status: "warning",
      });
    }
    summaryBadges.push({
      text: "🚿 Lavamani comando non manuale a ginocchio/pedale (Reg. CE 852/04)",
      status: "info",
    });
  }

  // b) Area Forno a legna e ceneri: abbattitore fuliggine ad acqua UNI 1127, legna vergine certificata, estintore
  const isPizzeriaWoodOven =
    env.id === "env-piz-forno-legna" ||
    env.key === "piz_forno_legna_deposito";
  if (isPizzeriaWoodOven) {
    summaryBadges.push({
      text: "🔥 Abbattitore fuliggine ad acqua conforme UNI 1127 & canna fumaria",
      status: "warning",
    });
    summaryBadges.push({
      text: "🪵 Stoccaggio legna vergine certificata (All. IV p. 4) & estintore 34A 233B",
      status: "info",
    });
  }

  // c) Locale Impasto: riparo interbloccato impastatrice a spirale UNI EN 453 e aspirazione polveri farina
  const isPizzeriaDough =
    env.id === "env-piz-impasto" ||
    env.key === "piz_impasto_lievitazione";
  if (isPizzeriaDough) {
    summaryBadges.push({
      text: "🥣 Riparo interbloccato impastatrice a spirale (UNI EN 453) & aspirazione polveri farina",
      status: "info",
    });
  }

  // d) Dispensa secco: stoccaggio sacchi farina su pedane sollevate >= 15 cm e cartoni pizza MOCA
  const isPizzeriaPantry =
    env.id === "env-piz-dispensa" ||
    env.key === "piz_dispensa_secco_farine_cartoni";
  if (isPizzeriaPantry) {
    summaryBadges.push({
      text: "📦 Sacchi farina su pedane sollevate ≥ 15 cm & cartoni pizza MOCA",
      status: "info",
    });
  }

  // e) Sala somministrazione & asporto: vie di esodo libere >= 1.20m, uscite di emergenza con maniglioni antipanico
  const isPizzeriaHall =
    env.id === "env-piz-sala-asporto" ||
    env.key === "piz_sala_somministrazione_asporto";
  if (isPizzeriaHall) {
    summaryBadges.push({
      text: "🚪 Vie di esodo libere ≥ 1,20m & uscite di emergenza con maniglioni antipanico",
      status: "info",
    });
    summaryBadges.push({
      text: "💡 Illuminazione di emergenza ≥ 5 lux & banco ritiro asporto",
      status: "success",
    });
  }

  // f) Celle deperibili: teletermometri continui HACCP
  const isPizzeriaColdRoom =
    env.id === "env-piz-celle" ||
    env.key === "piz_celle_frigo_deperibili";
  if (isPizzeriaColdRoom) {
    summaryBadges.push({
      text: "🌡️ Teletermometri continui HACCP (+2/+4°C latticini, mozzarelle e salumi)",
      status: "info",
    });
  }

  // g) Spogliatoi staff: armadietti a doppio scomparto abiti civili/lavoro infarinati
  const isPizzeriaStaffLocker =
    env.id === "env-piz-spogliatoi" ||
    env.key === "piz_spogliatoi_personale";
  if (isPizzeriaStaffLocker) {
    summaryBadges.push({
      text: "🚻 Armadietti doppio scomparto abiti civili/lavoro infarinati & antibagno",
      status: "info",
    });
  }

  // h) Deposito rifiuti e ceneri: bidone metallico stagno per ceneri forno a legna
  const isPizzeriaWaste =
    env.id === "env-piz-rifiuti" ||
    env.key === "piz_deposito_rifiuti_ceneri";
  if (isPizzeriaWaste) {
    summaryBadges.push({
      text: "🗑️ Bidone metallico stagno per ceneri forno a legna & mastelli differenziata",
      status: "warning",
    });
  }

  // i) Locale tecnico: elettrovalvola gas a riarmo manuale & ricircolo abbattitore fuliggine
  const isPizzeriaTechnical =
    env.id === "env-piz-tecnico" ||
    env.key === "piz_locale_tecnico_gas_abbattitore";
  if (isPizzeriaTechnical) {
    summaryBadges.push({
      text: "⚡ Elettrovalvola gas metano esterna a riarmo manuale & ricircolo abbattitore fuliggine",
      status: "warning",
    });
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
  const isFoodEnv =
    (env.category === "production" || env.category === "storage") &&
    (env.key.includes("cucina") ||
      env.key.includes("plonge") ||
      env.key.includes("cella") ||
      env.key.includes("macelleria") ||
      env.key.includes("pescheria") ||
      env.key.includes("gastronomia") ||
      env.key.includes("panetteria") ||
      env.key.includes("ortofrutta") ||
      env.key.includes("prep_fredda") ||
      env.id.includes("prep-fredda") ||
      env.id.includes("rist-cucina") ||
      env.id.includes("rist-plonge") ||
      env.id.includes("rist-celle") ||
      env.id.includes("piz-") ||
      env.key.includes("piz_"));

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
  if (env.category === "warehouse" || env.category === "storage" || env.features.shelvingCertified) {
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
  } else if (env.category === "office" || env.category === "sales_office") {
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
  } else if (
    env.category === "changing_rooms" ||
    (env.category === "services" && !env.id.includes("wc-clienti") && !env.id.includes("clienti") && !env.key.includes("wc_clienti"))
  ) {
    const isFoodSector = isFoodEnv || env.id.includes("rist") || env.id.includes("super") || env.id.includes("iper") || env.id.includes("piz");
    items.push({
      id: `${env.id}-armadietti-spogliatoio`,
      area: env.name,
      title: "Armadietti a Doppio Scomparto (Sporco/Pulito)",
      question: "Gli armadietti spogliatoio sono individuali, lavabili, dotati di chiave e provvisti di doppio scomparto per separare gli abiti civili da quelli da lavoro?",
      normReference: "D.Lgs. 81/2008, Allegato IV punto 1.12",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: isFoodSector ? "both" : "safety",
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

  // 10. Requisiti Specifici di Reparto Ipermercato e Settori Specializzati
  // a) Reparto Macelleria / Laboratorio Carni: Guidovie aeree e sterilizzatore coltelli
  if (env.id.includes("macelleria") || env.key.includes("macelleria")) {
    items.push({
      id: `${env.id}-ganciere-guidovie`,
      area: env.name,
      title: "Guidovie Aeree, Ganciere e Arresti Fine Corsa",
      question:
        "Le guidovie aeree e le ganciere per la movimentazione delle mezzene sono certificate per la portata, provviste di dispositivi di arresto fine corsa contro la caduta accidentale e sottoposte a pulizia e lubrificazione con prodotti per uso alimentare (NSF H1)?",
      normReference: "D.Lgs. 81/2008 art. 71 e All. V parte II p.to 3, Reg. CE 853/2004 All. III",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Guidovie aeree e ganciere prive di arresti meccanici di sicurezza a fine corsa o con tracce di ossidazione e lubrificanti non idonei al contatto alimentare.",
    });

    items.push({
      id: `${env.id}-lavamani-sterilizzatore`,
      area: env.name,
      title: "Lavamani a Comando non Manuale e Sterilizzatore Coltelleria",
      question:
        "Il laboratorio carni dispone di lavamani con rubinetteria a comando non manuale (ginocchio/pedale), sapone disinfettante, asciugamani a perdere e sterilizzatore a caldo/UV per la coltelleria a norma Reg. CE 853/2004?",
      normReference: "Reg. CE 852/2004 All. II Cap. I e Reg. CE 853/2004 All. III Sez. I",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Assenza di comando non manuale (ginocchio/pedale) al lavamani del laboratorio macelleria o sterilizzatore coltelli assente/non funzionante.",
    });

    items.push({
      id: `${env.id}-banco-carni-canalina-cella`,
      area: env.name,
      title: "Banco Carni (+0/+4°C), Canaline di Scolo Inox Sifonate e Cella Carni",
      question:
        "Il banco carni garantisce temperatura continua tra 0°C e +4°C, il pavimento dispone di canaline di scolo sifonate con griglie asportabili in acciaio inox, le pareti sono rivestite con materiale lavabile fino ad almeno 2 metri di altezza e la cella carni è dedicata ed igienizzata?",
      normReference: "Reg. CE 852/2004 All. II Cap. II e Reg. CE 853/2004 All. III",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Canaline di scolo del laboratorio carni prive di griglie inox o con ristagno di residui organici, oppure banco carni con temperatura superiore a +4°C.",
    });
  }

  // b) Reparto Pescheria: Banco ghiaccio a scolo continuo e pavimentazione bagnata R13
  if (env.id.includes("pescheria") || env.key.includes("pescheria")) {
    items.push({
      id: `${env.id}-banco-pesce-scolo`,
      area: env.name,
      title: "Banco Vendita Pesce e Scarico Acque di Fusione Ghiaccio",
      question:
        "Il banco espositivo del pesce garantisce ghiaccio a scaglie prodotto con acqua potabile e canalizzazione dello scolo delle acque di fusione direttamente alla rete fognaria sifonata, senza ristagni o scarichi a pavimento?",
      normReference: "Reg. CE 852/2004 All. II Cap. VII e Reg. CE 853/2004 All. III Sez. VIII",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Acque di fusione del ghiaccio del banco pescheria con gocciolamento a pavimento privo di convogliamento in canalina sifonata chiusa.",
    });

    items.push({
      id: `${env.id}-sicurezza-pescheria-dpi`,
      area: env.name,
      title: "Pavimentazione Bagnata R13 e DPI Taglio ed Eviscerazione",
      question:
        "Il pavimento presenta grado di resistenza allo scivolamento R12/R13 con pendenze >1,5% e gli addetti dispongono di calzature di sicurezza con suola SRC, stivali impermeabili, grembiuli protettivi e guanti in maglia d'acciaio antitaglio per l'eviscerazione e sfilettatura?",
      normReference: "D.Lgs. 81/2008 art. 75-77 e Allegato IV punto 1.3",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Pavimento del laboratorio pescheria con pendenza insufficiente e ristagni d'acqua, o mancata dotazione e utilizzo dei guanti in maglia antitaglio.",
    });
  }

  // c) Reparto Gastronomia: Protezioni affettatrici e forni
  if (env.id.includes("gastronomia") || env.key.includes("gastronomia")) {
    items.push({
      id: `${env.id}-attrezzature-gastronomia`,
      area: env.name,
      title: "Sicurezza Affettatrici, Forni Polli e Rosticceria",
      question:
        "Le affettatrici a gravità sono dotate di anello di protezione lama fisso, pressamerce, paralama e interblocco sul piatto (UNI EN 1974), e i forni per polli/rosticceria sono dotati di cappa con filtri antincendio e scarico condensa a norma?",
      normReference: "D.Lgs. 81/2008 Allegato V e VI, norma UNI EN 1974",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Affettatrice con dispositivo di protezione lama o carrello manomesso/incompleto, o cappa dei forni colma di residui grassi combustibili.",
    });

    items.push({
      id: `${env.id}-gastronomia-banco-lavamani`,
      area: env.name,
      title: "Banco Gastronomia (+4°C), Pareti Lavabili e Lavamani a Comando Non Manuale",
      question:
        "Il banco assistito di gastronomia, salumi e formaggi assicura il mantenimento continuo della temperatura a +4°C rilevabile su display, e il reparto dispone di lavamani a comando non manuale (a ginocchio o pedale) con sapone disinfettante, carta a perdere e pareti lisce lavabili h >= 2 metri?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I e Capitolo II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Rubinetteria lavamani del reparto gastronomia azionabile manualmente o banco espositivo formaggi/salumi con temperatura non conforme a +4°C.",
    });
  }

  // d) Reparto Panetteria / Pasticceria / Bake-off: Forni, tagliapane e polveri
  if (env.id.includes("panetteria") || env.key.includes("panetteria")) {
    items.push({
      id: `${env.id}-sicurezza-impastatrici-polveri`,
      area: env.name,
      title: "Protezione Meccanica Impastatrici e Polveri di Farina",
      question:
        "Le impastatrici a spirale/forcella sono provviste di griglia di protezione interbloccata a microinterruttore di arresto (UNI EN 453) e il locale dispone di aspirazione idonea a prevenire la dispersione di polveri organiche (rischio asma del panettiere e polveri combustibili ATEX)?",
      normReference: "D.Lgs. 81/2008 Titolo IX, All. V e norma UNI EN 453",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Impastatrice con griglia di protezione bypassata o difettosa, o presenza di depositi diffusi di polveri di farina nell'ambiente.",
    });

    items.push({
      id: `${env.id}-forno-doratura-bakeoff`,
      area: env.name,
      title: "Forno Doratura Bake-Off, Cappa a Condensazione e Dispositivi Scottature",
      question:
        "Il forno di doratura/cottura per prodotti bake-off è provvisto di cappa aspirante o a condensazione dei vapori funzionante, maniglie termoisolanti e sportello con doppio vetro intatto, e gli operatori dispongono di guanti termici DPI certificati (EN 407) contro il rischio scottature?",
      normReference: "D.Lgs. 81/2008 All. V e VI, Reg. CE 852/2004 All. II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Forno bake-off con cappa fumi non aspirante o guarnizioni usurate con fuoriuscita vapori caldi, o addetti sprovvisti di guanti di protezione termica idonei.",
    });

    items.push({
      id: `${env.id}-tagliapane-banchi-selfservice`,
      area: env.name,
      title: "Macchina Tagliapane con Ripari Interbloccati e Banchi Self-Service Pane",
      question:
        "La macchina tagliapane è provvista di riparo mobile interbloccato che impedisce il contatto con la lama in movimento (UNI EN 13954), e i banchi di vendita self-service del pane sono provvisti di sportelli richiudibili, pinze in acciaio inox o distributori di guanti monouso per prevenire contaminazioni?",
      normReference: "Norma UNI EN 13954, D.Lgs. 81/2008 All. V e Reg. CE 852/2004 All. II Cap. IX",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Macchina tagliapane con carter di protezione lama manomesso o banco self-service pane privo di pinze/guanti monouso a disposizione dei clienti.",
    });
  }

  // d2) Reparto Ortofrutta: Esposizione, mondatura e bilance self-service
  if (env.id.includes("ortofrutta") || env.key.includes("ortofrutta")) {
    items.push({
      id: `${env.id}-ortofrutta-mondatura-bilance`,
      area: env.name,
      title: "Tavoli Mondatura Inox, Lavello Dedicato e Bilance Self-Service Omologate",
      question:
        "L'area ortofrutta dispone di tavoli e lavello in acciaio inox dedicati alla mondatura degli ortaggi con flusso idrico potabile, e le bilance per il pubblico sono omologate con dispenser di sacchetti e guanti monouso igienici obbligatori?",
      normReference: "Reg. CE 852/2004 All. II Cap. II e Cap. IX",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Assenza di guanti monouso igienici per i clienti nell'area ortofrutta a libero servizio o lavello mondatura utilizzato promiscuamente senza sapone e asciugamani a perdere.",
    });
  }

  // e) Celle Frigorifere: Allarme uomo intrappolato (UNI EN 378) e teletermometro continuo
  if (
    env.id.includes("celle-frigo") ||
    env.key.includes("cella") ||
    env.category === "storage" ||
    !!env.features.hasTrappedPersonAlarm
  ) {
    items.push({
      id: `${env.id}-allarme-uomo-intrappolato`,
      area: env.name,
      title: "Allarme Uomo Intrappolato e Maniglione Fluorescente (UNI EN 378)",
      question:
        "Tutte le celle frigorifere a bassa temperatura e media temperatura sono dotate di dispositivo di apertura interna di emergenza ad azionamento immediato con maniglione luminescente e pulsante di allarme 'uomo intrappolato' a bassa tensione collegato a postazione presidiata h24?",
      normReference: "D.Lgs. 81/2008 All. IV p.to 1.11 e norma UNI EN 378-1/3",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Cella frigorifera priva di dispositivo di allarme ottico-acustico per uomo intrappolato o porta sprovvista di sblocco interno fluorescente di emergenza.",
    });

    items.push({
      id: `${env.id}-teletermometro-registrazione`,
      area: env.name,
      title: "Monitoraggio Continuo Temperature e Allarmi HACCP",
      question:
        "Le celle frigorifere di stoccaggio alimenti deperibili e surgelati dispongono di termografi/teletermometri con registrazione continua conforme a Reg. CE 37/2005 e UNI EN 12830 con allarmi di deviazione termica (carni 0-4°C, pesce 0-2°C, verdure +4°C, surgelati -18°C)?",
      normReference: "Reg. CE 852/2004 All. II Cap. IX e Reg. CE 37/2005",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Celle di stoccaggio surgelati prive di strumento di registrazione continua della temperatura conforme a UNI EN 12830 o parametri termici HACCP non conformi.",
    });
  }

  // f) Area Vendita Corsie: Vie di esodo (≥ 2.40m Ipermercato o ≥ 1.80m Supermercato) e scaffali di vendita
  if (
    env.id.includes("corsie") ||
    env.key.includes("corsie") ||
    (env.category === "sales_office" && (env.surfaceSqM ?? 0) >= 400)
  ) {
    const isSupermarket =
      env.id.includes("super-corsie") ||
      env.key.includes("super_corsie") ||
      ((env.surfaceSqM ?? 0) < 2500);

    if (isSupermarket) {
      items.push({
        id: `${env.id}-corsie-esodo-vie-fuga`,
        area: env.name,
        title: "Larghezza Corsie Principali e Vie di Esodo (≥ 1,80 m)",
        question:
          "Le corsie principali di scorrimento del supermercato presentano larghezza utile non inferiore a 1,80 metri (almeno 3 moduli di passaggio a norma D.M. 27/07/2010), sono libere da isole promozionali ingombranti, transpallet o bancali provvisori, e conducono direttamente alle uscite di emergenza con maniglioni antipanico?",
        normReference: "D.M. 27/07/2010 (Attività commerciali) e D.Lgs. 81/2008 All. IV p.to 1.4",
        defaultSeverity: 4,
        defaultSanctionable: true,
        domain: "safety",
        categoryTag: "cpi",
        suggestedNonConformity:
          "Corsie principali di circolazione del supermercato con larghezza inferiore a 1,80m o parzialmente ostruite da espositori promozionali e merci a terra lungo i percorsi verso le uscite di sicurezza.",
      });
    } else {
      items.push({
        id: `${env.id}-corsie-esodo-vie-fuga`,
        area: env.name,
        title: "Larghezza Corsie Principali e Vie di Esodo (≥ 2,40 m)",
        question:
          "Le corsie principali di scorrimento dell'ipermercato presentano larghezza utile non inferiore a 2,40 metri (almeno 4 moduli di uscita), sono libere da isole promozionali ingombranti, transpallet o bancali provvisori, e conducono direttamente alle uscite di emergenza con maniglioni antipanico?",
        normReference: "D.M. 27/07/2010 (Attività commerciali) e D.Lgs. 81/2008 All. IV p.to 1.4",
        defaultSeverity: 4,
        defaultSanctionable: true,
        domain: "safety",
        categoryTag: "cpi",
        suggestedNonConformity:
          "Corsie principali di circolazione e percorsi di esodo ristretti a meno di 2,40m o parzialmente ostruiti da espositori promozionali e merci a terra lungo i percorsi verso le uscite di sicurezza.",
      });
    }

    items.push({
      id: `${env.id}-scaffali-vendita-corsie`,
      area: env.name,
      title: "Scaffalature di Vendita, Reti Anticaduta e Portata Certificata",
      question:
        "Le scaffalature dell'area di vendita aperte al pubblico con stoccaggio merci ad alta quota sopra i clienti sono provviste di reti posteriori anticaduta, fermo-pallet antisfilamento, paracolpi d'angolo e cartelli di portata conforme a UNI EN 15635?",
      normReference: "D.Lgs. 81/2008 art. 71 e norma UNI EN 15635",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Scaffalature di vendita aperte al pubblico con stoccaggio merci ad altezza superiore a 2 metri prive di rete posteriore anticaduta o prive di cartelli di portata massima ammissibile.",
    });

    items.push({
      id: `${env.id}-banchi-frigo-murali`,
      area: env.name,
      title: "Banchi Frigoriferi Murali, Vasche Surgelati e Teletermometri",
      question:
        "I banchi frigoriferi murali verticali e le vasche surgelati dell'area vendita a libero servizio sono provvisti di display termometrici tarati visibili, sonde di temperatura con teletermometri continui (+4°C freschi / -18°C surgelati), allarmi di deviazione termica e chiusure notturne o ante a vetro per la catena del freddo?",
      normReference: "Reg. CE 852/2004 All. II Cap. IX e Reg. CE 37/2005",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Banchi frigoriferi murali a libero servizio con display termometrici non funzionanti o temperature superiori ai limiti HACCP con rischio interruzione catena del freddo.",
    });
  }

  // g) Barriera Casse & Uffici: Varchi evacuazione, ergonomia e nastri motorizzati
  if ((env.id.includes("casse") || env.key.includes("casse")) && !env.id.includes("rist")) {
    items.push({
      id: `${env.id}-barriera-casse-esodo`,
      area: env.name,
      title: "Varchi di Evacuazione Barriera Casse e Pulsante Sblocco",
      question:
        "La barriera casse è provvista di varchi di emergenza a spinta rapida antipanico apribili nel verso dell'esodo, varchi dedicati a persone a ridotta mobilità (larghezza ≥ 90 cm) e pulsante di sblocco centralizzato di tutte le barre di passaggio in caso di allarme evacuazione?",
      normReference: "D.M. 27/07/2010 Titolo II e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Varchi della barriera casse bloccati meccanicamente o privi di dispositivo di sgancio automatico/antipanico in caso di allarme evacuazione.",
    });

    items.push({
      id: `${env.id}-ergonomia-postazione-cassa`,
      area: env.name,
      title: "Ergonomia Postazioni di Cassa e Schermature Correnti d'Aria",
      question:
        "Le postazioni di cassa dispongono di sedute ergonomiche regolabili con poggiapiedi, scanner ottico ad altezza corretta per prevenzione disturbi muscolo-scheletrici (ISO 11228-3) e protezioni contro correnti d'aria causate dalle porte d'ingresso?",
      normReference: "D.Lgs. 81/2008 Titolo VI e All. XXXIII, norma ISO 11228-3",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Postazioni di cassa prive di pedane poggiapiedi regolabili o esposte a correnti d'aria fredda continue causate dalla vicinanza delle porte automatiche d'ingresso.",
    });

    items.push({
      id: `${env.id}-nastri-motorizzati-casse`,
      area: env.name,
      title: "Sicurezza Nastri Motorizzati Casse (Fotocellula, Pedale Uomo Presente e Ripari)",
      question:
        "I banchi cassa a nastro trasportatore motorizzato sono dotati di fotocellula di arresto automatico a fine corsa, comando di avanzamento a pedale uomo presente a bassa tensione per l'azionamento, carter di protezione anti-trascinamento sui rulli di rinvio e pulsante di arresto rapido conforme alle norme di sicurezza macchine?",
      normReference: "D.Lgs. 81/2008 All. V e All. VI, Direttiva 2006/42/CE e norma UNI EN 619",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Nastro motorizzato cassa privo di fotocellula di arresto all'estremità o carter di protezione rulli rimosso con pericolo di trascinamento e schiacciamento dita.",
    });
  }

  // h) Locale Tecnico / Centrale Frigorifera: Rilevatori fughe gas, sgancio emergenza e ventilazione
  if (
    (env.id.includes("centrale-frigo") ||
      env.key.includes("centrale_frigo") ||
      env.id.includes("super-tecnico") ||
      env.key.includes("super_tecnico") ||
      (!env.id.includes("rist") && !env.key.includes("rist") && !env.id.includes("piz") && !env.key.includes("piz") && (env.id.includes("tecnico") || env.key.includes("tecnico")))) &&
    !!env.features.gasLeakDetectorPresent
  ) {
    items.push({
      id: `${env.id}-centrale-frigo-gas-refrigerante`,
      area: env.name,
      title: "Rilevazione Gas Refrigerante e Ventilazione Meccanica Emergenza (UNI EN 378)",
      question:
        "Il locale della centrale frigorifera o vano compressori è dotato di impianto o sensori per la rilevazione continua di perdite di gas refrigerante con segnalazione ottico-acustica esterna e ventilazione di emergenza ad alta portata?",
      normReference: "Norma UNI EN 378-3, D.Lgs. 81/2008 Titolo IX e Reg. UE 2024/573",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Centrale frigorifera o vano compressori sprovvisto di impianto di rilevamento fughe gas refrigerante con allarme ottico-acustico esterno o ventilazione d'emergenza non funzionante.",
    });

    items.push({
      id: `${env.id}-centrale-frigo-accesso-dpi`,
      area: env.name,
      title: "Accesso Riservato Personale Autorizzato, Sgancio Emergenza e Schede Gas",
      question:
        "La porta di accesso al locale tecnico è tenuta chiusa a chiave con cartelli di divieto d'accesso ai non autorizzati, il quadro elettrico generale dispone di pulsante di sgancio d'emergenza accessibile e all'esterno sono esposte le procedure di emergenza gas e DPI specifici?",
      normReference: "D.Lgs. 81/2008 art. 75-77 e Allegato IV punto 1.1, CEI 64-8",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Locale tecnico con porta liberamente accessibile a personale non addestrato, quadro elettrico con sgancio ostruito o privo delle procedure di emergenza per rilascio accidentale gas refrigerante.",
    });
  }

  // i) Locale Compattatori Rifiuti & Stoccaggio Cartone/Plastica: Sicurezza macchine e igiene
  if (env.id.includes("compattatore") || env.key.includes("compattator")) {
    items.push({
      id: `${env.id}-compattatori-sicurezza-macchine`,
      area: env.name,
      title: "Sicurezza Macchine Presse Compattatrici (Direttiva 2006/42/CE e UNI EN 16500)",
      question:
        "Le presse compattatrici per imballaggi cartone e plastica dispongono di marcatura CE, conformità UNI EN 16500 (per compattatrici verticali) o UNI EN 16252, pulsanti di arresto d'emergenza a fungo ben visibili e ripristinabili, interblocchi di sicurezza sulle tramogge di carico che impediscono l'avvio con sportello aperto?",
      normReference: "D.Lgs. 81/2008 All. V, norma UNI EN 16500 e UNI EN 16252",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Pressa compattatrice con dispositivi di sicurezza bypassati, assenza di arresto d'emergenza a fungo o personale non specificamente addestrato all'uso (art. 73 D.Lgs. 81/08).",
    });

    items.push({
      id: `${env.id}-pressa-compattatrice-verticale`,
      area: env.name,
      title: "Pressa Compattatrice Verticale Cartone (UNI EN 16500) e Arresto a Fungo",
      question:
        "La pressa compattatrice verticale per cartone e imballaggi è provvista di marcatura CE con certificazione UNI EN 16500, sportello di caricamento con interblocco elettromeccanico di blocco ciclo, arresto di emergenza a fungo ben accessibile e istruzioni d'uso esposte?",
      normReference: "Norma UNI EN 16500 e D.Lgs. 81/2008 art. 70-71 e All. V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Pressa compattatrice verticale con interblocco sportello disattivato con funzionamento a vano aperto o pulsante di arresto d'emergenza a fungo non funzionante.",
    });

    items.push({
      id: `${env.id}-igiene-area-rifiuti`,
      area: env.name,
      title: "Igiene Area Rifiuti, Lavaggio Pavimento e Rischio Infestanti",
      question:
        "L'area stoccaggio rifiuti e compattatori dispone di pavimento impermeabile lavabile con pendenza verso scarico sifonato con griglia antiroditore, presa d'acqua per lavaggio e piano di disinfestazione e derattizzazione monitorato?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo VI",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Area compattatori rifiuti con colaticcio a terra priva di punto acqua per disinfezione o esche derattizzazione assenti con rischio richiamo infestanti.",
    });
  }

  // j) Magazzino Merci / Baie di Carico
  if (env.id.includes("magazzino") && (env.surfaceSqM ?? 0) >= 500) {
    items.push({
      id: `${env.id}-baie-carico-banchine`,
      area: env.name,
      title: "Sicurezza Baie di Carico, Pedane Idrauliche e Banchine",
      question:
        "Le banchine e baie di carico automezzi sono dotate di protezioni anticaduta dei carrelli (bordi rialzati), pedane idrauliche conformi a UNI EN 1398, calzatoie bloccaruota per bilici in scarico e segnaletica luminosa/semaforica per i conducenti?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4.11 e norma UNI EN 1398",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Baie di carico prive di sistema di blocco ruote per autocarri durante le manovre di carico/scarico con transpallet/carrello elevatore, o pedana con dislivello pericoloso non segnalato.",
    });
  }

  // j2) Magazzino Merci: Scaffalature porta-pallet medie e portone scarico merci
  if (env.id.includes("magazzino") || env.key.includes("magazzino")) {
    items.push({
      id: `${env.id}-scaffalature-transpallet-scarico`,
      area: env.name,
      title: "Scaffalature Porta-Pallet Medie (UNI EN 15635), Corsie e Portone Scarico",
      question:
        "Le scaffalature porta-pallet (fino a 4m di altezza) presentano cartelli di portata massima ammissibile (UNI EN 15635), le corsie per stoccatori e transpallet risultano sgombre con percorsi pedonali definiti, e il portone di scarico merci autocarri è provvisto di dispositivi di sicurezza contro la caduta accidentale (paracadute funi/molle)?",
      normReference: "D.Lgs. 81/2008 art. 71, All. IV p.to 1.4 e All. V p.to 1.8, norma UNI EN 15635",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Scaffalature porta-pallet del magazzino prive di cartelli di portata per campata o portone carraio di scarico merci privo di paracadute di sicurezza anticaduta in caso di rottura organi di sospensione.",
    });
  }

  // ============================================================================
  // 11. Requisiti Specifici Ristorazione con Somministrazione (ATECO 56.10.11 / 56.10.1)
  // ============================================================================

  // a) Cucina Ristorante: Termocoppie, Ansul, filtri a labirinto, lavamani ginocchio, canaline scolo
  if (env.id === "env-rist-cucina" || env.id.includes("rist-cucina")) {
    items.push({
      id: `${env.id}-termocoppie-cappa-ansul`,
      area: env.name,
      title: "Termocoppie Fuochi a Gas e Impianto Spegnimento Automatico Cappa Ansul",
      question:
        "I piani cottura a gas sono dotati di termocoppie di sicurezza su tutti i fuochi con blocco automatico del gas in caso di spegnimento fiamma, e la cappa aspirante è provvista di impianto di spegnimento automatico a umido (tipo Ansul R-102) a protezione di friggitrici e fuochi?",
      normReference: "D.M. 08/11/2019 (Regola tecnica impianti a gas), D.Lgs. 81/2008 Allegato IV e UNI EN 16282-7",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Piani cottura privi di termocoppie o con termocoppie manomesse, oppure cappa cottura priva di impianto automatico di spegnimento incendi a umido per friggitrici e fuochi.",
    });

    items.push({
      id: `${env.id}-filtri-antigrasso-labirinto`,
      area: env.name,
      title: "Filtri Antigrasso a Labirinto Lavabili e Canna Fumaria a Tetto",
      question:
        "La cappa di aspirazione è provvista di filtri antigrasso a labirinto in acciaio inox asportabili e lavabili, con canalizzazioni sgrassate periodicamente e canna fumaria con scarico oltre il colmo del tetto?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. I e UNI EN 16282-2, D.Lgs. 81/2008 All. IV p.to 1.9",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Filtri a labirinto della cappa intasati di grasso e privi di lavaggio frequente o assenza di certificazione di pulizia periodica della canna fumaria.",
    });

    items.push({
      id: `${env.id}-lavamani-non-manuale`,
      area: env.name,
      title: "Lavamani a Comando non Manuale, Sapone e Asciugamani a Perdere",
      question:
        "La cucina dispone di lavamani con comando a ginocchio o pedale erogante acqua calda e fredda miscelata, dotato di distributore di sapone liquido antibatterico e salviette monouso a perdere con cestino a pedale?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavamani della cucina azionabile manualmente o sprovvisto di erogatore di sapone liquido e asciugamani a perdere monouso.",
    });

    items.push({
      id: `${env.id}-canaline-scolo-sifonate`,
      area: env.name,
      title: "Canaline di Scolo a Pavimento Sifonate con Griglie Inox",
      question:
        "Il pavimento della cucina è provvisto di canaline di scolo con pendenze adeguate, chiusini sifonati antiodore con cestelli estraibili e griglie carrabili in acciaio inox per impedire ristagni d'acqua e risalita di esalazioni o infestanti?",
      normReference: "Reg. CE 852/2004 All. II Cap. II p.to 1 e D.Lgs. 81/2008 All. IV p.to 1.3",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Canaline di scolo a pavimento non sifonate, prive di cestello raccoglitore inox o con ristagni di grassi e residui alimentari.",
    });
  }

  // b) Plonge: cappa aspirazione lavastoviglie, marcia in avanti, dosatori chimici
  if (env.id === "env-rist-plonge" || env.id.includes("rist-plonge")) {
    items.push({
      id: `${env.id}-cappa-vapori-lavastoviglie`,
      area: env.name,
      title: "Cappa Aspirazione Vapori Lavastoviglie a Capotta Passante",
      question:
        "La zona lavaggio stoviglie dispone di cappa di captazione dei vapori caldi posizionata sopra la lavastoviglie a capotta passante per prevenire condensa, muffe e stress termico per gli operatori?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.9 e Reg. CE 852/2004 All. II",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Lavastoviglie a capotta priva di cappa di aspirazione vapori con accumulo di condensa su pareti e soffitti della plonge.",
    });

    items.push({
      id: `${env.id}-marcia-avanti-stoviglie`,
      area: env.name,
      title: "Separazione Percorso Sporco/Pulito (Principio Marcia in Avanti)",
      question:
        "L'area plonge garantisce la netta separazione fisica tra il percorso di ricezione stoviglie sporche con lavello sbarazzo e doccione, e il percorso di scarico e stoccaggio stoviglie pulite sanificate, nel rispetto della marcia in avanti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II e Manuale HACCP",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Incrocio tra stoviglie sporche e stoviglie pulite con rischio di ricontaminazione crociata microbiologica delle stoviglie sanificate.",
    });

    items.push({
      id: `${env.id}-dosatori-automatici-chimici`,
      area: env.name,
      title: "Dosatori Automatici Detergenti e Rischio Chimico Corrosivi",
      question:
        "I prodotti chimici detergenti e brillantanti per lavastoviglie sono collegati a dosatori automatici a circuito chiuso, con taniche alloggiate in vasche di contenimento e schede di sicurezza (SDS) disponibili con DPI adatti (guanti e occhiali paraschizzi)?",
      normReference: "D.Lgs. 81/2008 Titolo IX art. 223-227 e All. IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Taniche di detergente caustico aperte con travaso manuale privo di dosatore automatico o assenza di vasca di contenimento e DPI paraschizzi.",
    });
  }

  // c) Prep Fredda: tavoli refrigerati display, lavello verdure, taglieri e coltelli HACCP
  if (env.id === "env-rist-prep-fredda" || env.id.includes("rist-prep-fredda")) {
    items.push({
      id: `${env.id}-tavoli-refrigerati-termometro`,
      area: env.name,
      title: "Tavoli Refrigerati con Display Termometrico Tarato (+0/+4°C)",
      question:
        "I banchi e tavoli da lavoro refrigerati in acciaio inox per antipasti e crudi garantiscono temperatura costante tra 0°C e +4°C rilevabile su display digitale tarato, con guarnizioni integre e pulizia periodica evaporatori?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e Reg. CE 37/2005",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Tavolo refrigerato con display termometrico guasto o temperatura interna superiore a +4°C con rischio deterioramento semilavorati deperibili.",
    });

    items.push({
      id: `${env.id}-lavello-dedicato-verdure`,
      area: env.name,
      title: "Lavello Dedicato Lavaggio Verdure e Prevenzione Cross-Contamination",
      question:
        "L'area preparazione fredda dispone di lavello in acciaio inox ad uso esclusivo per il lavaggio e sanificazione delle verdure e alimenti crudi, separato dai lavelli per lavaggio mani o stoviglie, per prevenire cross-contamination tra alimenti crudi e cotti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II punto 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavaggio di verdure crudo in lavelli promiscui utilizzati per stoviglie o carni, con rischio grave di contaminazione crociata microbiologica.",
    });

    items.push({
      id: `${env.id}-coltelleria-taglieri-codice-colore`,
      area: env.name,
      title: "Taglieri e Coltelleria con Codice Colore HACCP",
      question:
        "I taglieri in polietilene alimentare e i manici della coltelleria sono differenziati per codice colore (rosso carni crude, blu pesce, verde verdure, giallo pollame, bianco cotti/latticini) e privi di incisioni profonde o deformazioni?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e Manuale di Corretta Prassi Igienica",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Utilizzo di taglieri unici o privi di codice colore per manipolazione contemporanea di carni crude, verdure e cibi pronti al consumo.",
    });
  }

  // d) Dispensa Secco: Scaffalature sollevate per pest control, assenza muffe
  if (env.id === "env-rist-dispensa" || env.id.includes("rist-dispensa")) {
    items.push({
      id: `${env.id}-scaffalature-sollevate-pest-control`,
      area: env.name,
      title: "Scaffalature Sollevate da Terra (≥ 15-20 cm) e Distanziate per Pest Control",
      question:
        "Gli alimenti secchi, scatolame e bottiglie di vino sono stoccati su scaffalature forate lavabili sollevate da terra almeno 15-20 cm e distanziate dalle pareti per consentire pulizia e monitoraggio infestanti (pest control)?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I e Capitolo X",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Alimenti o scatolame depositati direttamente a pavimento o scaffali addossati ai muri che impediscono l'ispezione contro roditori e insetti.",
    });

    items.push({
      id: `${env.id}-assenza-umidita-muffe`,
      area: env.name,
      title: "Assenza di Umidità, Condense e Muffe nel Magazzino Secco",
      question:
        "Il locale dispensa e cantina si presenta asciutto, adeguatamente areato, privo di odori anomali, tracce di umidità di risalita o efflorescenze e muffe sulle pareti e soffitti?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.3.7 e Reg. CE 852/2004 All. II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Presenza di muffe e umidità sui muri della dispensa con rischio deterioramento degli alimenti e compromissione della salubrità dell'ambiente.",
    });
  }

  // e) Sala Ristorazione: Vie di esodo libere >= 1.20m, uscite antipanico, illuminazione emergenza
  if (env.id === "env-rist-sala" || env.id.includes("rist-sala")) {
    items.push({
      id: `${env.id}-vie-esodo-sala`,
      area: env.name,
      title: "Vie di Esodo e Corridoi di Passaggio Sala Liberi (≥ 1,20 m)",
      question:
        "I percorsi di transito principali e le vie di esodo tra i tavoli della sala presentano larghezza utile minima non inferiore a 1,20 metri e risultano costantemente liberi da sedie, tavoli provvisori o carrelli di servizio per un rapido esodo?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e D.M. 03/08/2015",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Corridoi di passaggio tra i tavoli della sala ristretti a meno di 1,20m o vie di fuga ostruite da arredi con grave intralcio all'evacuazione rapida.",
    });

    items.push({
      id: `${env.id}-uscite-emergenza-antipanico`,
      area: env.name,
      title: "Porte di Sicurezza con Apertura a Spinta e Maniglioni Antipanico (UNI EN 1125)",
      question:
        "Le uscite di emergenza della sala si aprono nel verso dell'esodo, sono provviste di maniglioni antipanico certificati UNI EN 1125 perfettamente manovrabili e prive di catene, lucchetti o chiavi inserite durante la presenza di clienti?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e norma UNI EN 1125",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Porte di sicurezza chiuse a chiave durante l'orario di servizio o maniglione antipanico duro o bloccato.",
    });

    items.push({
      id: `${env.id}-illuminazione-sicurezza-estintori`,
      area: env.name,
      title: "Illuminazione di Sicurezza (≥ 5 lux) ed Estintori Omologati (34A 233B)",
      question:
        "La sala dispone di illuminazione di sicurezza ad attivazione automatica con livello ≥ 5 lux lungo i percorsi di esodo, ed estintori portatili omologati (classe minima 34A 233B) posizionati ad altezza norma e revisionati regolarmente?",
      normReference: "D.M. 02/09/2021, D.M. 03/08/2015 e norma UNI 9994-1",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Lampade di emergenza non funzionanti o estintori della sala ristorazione scaduti di revisione periodica semestrale.",
    });
  }

  // f) Bar / Mescita / Cassa: Lancia vapore cool-touch, lavabicchieri 85°C, fabbricatore ghiaccio MOCA
  if (env.id === "env-rist-bar-cassa" || env.id.includes("rist-bar-cassa")) {
    items.push({
      id: `${env.id}-lancia-vapore-cooltouch`,
      area: env.name,
      title: "Lancia Vapore Macchina Caffè con Protezione Termica Cool-Touch",
      question:
        "Le lance vapore della macchina da caffè professionale sono dotate di rivestimento isolante antiscottatura (tecnologia cool-touch isolata o impugnatura siliconica) per prevenire ustioni accidentali da contatto?",
      normReference: "D.Lgs. 81/2008 art. 71 e Allegato V",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Lancia vapore con impugnatura termica usurata o mancante con pericolo di ustioni da contatto termico per il personale di banco.",
    });

    items.push({
      id: `${env.id}-lavabicchieri-temperatura-risciacquo`,
      area: env.name,
      title: "Lavabicchieri con Dosatore Brillantante e Risciacquo ad Alta Temperatura (≥ 80-85°C)",
      question:
        "La lavabicchieri del banco mescita garantisce un risciacquo termico a temperatura di 80-85°C con dosatore automatico di brillantante per la sanificazione igienica di calici e tazze?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e norma DIN 10511",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavabicchieri con temperatura del boiler di risciacquo inferiore a 80°C o dosatore brillantante non funzionante con mancata igienizzazione dei bicchieri.",
    });

    items.push({
      id: `${env.id}-fabbricatore-ghiaccio-moca`,
      area: env.name,
      title: "Fabbricatore Ghiaccio Conforme MOCA e Filtrazione Acqua Potabile",
      question:
        "Il fabbricatore di ghiaccio alimentare per il bar è conforme ai requisiti MOCA, alimentato con acqua potabile microfiltrata, dotato di paletta dedicata e sottoposto a periodica sanificazione del circuito e decalcificazione?",
      normReference: "Reg. CE 1935/2004 (MOCA), Reg. CE 852/2004 All. II Cap. VII e D.Lgs. 18/2023",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Fabbricatore di ghiaccio privo di paletta dedicata o con presenza di incrostazioni calcaree e muffe prive di sanificazione registrata.",
    });
  }

  // g) Spogliatoio Personale: Lavamani nell'antibagno
  if (env.id === "env-rist-spogliatoi" || env.id.includes("rist-spogliatoi")) {
    items.push({
      id: `${env.id}-lavamani-antibagno-spogliatoio`,
      area: env.name,
      title: "Lavamani con Acqua Calda/Fredda e Comandi Igienici nell'Antibagno",
      question:
        "L'antibagno dei servizi spogliatoio è provvisto di lavamani con erogazione di acqua calda e fredda, distributore di sapone liquido, salviette monouso a perdere e comando preferibilmente non manuale?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.13 e Reg. CE 852/2004 All. II",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancanza di erogazione di acqua calda al lavamani dell'antibagno spogliatoio o assenza di dispenser di sapone e asciugamani a perdere monouso.",
    });
  }

  // h) Servizi Igienici Clienti: Accessibilità disabili, tirante a campanello e maniglioni
  if (env.id === "env-rist-wc-clienti" || env.id.includes("rist-wc-clienti")) {
    items.push({
      id: `${env.id}-wc-disabili-tirante-campanello`,
      area: env.name,
      title: "Accessibilità Disabili, Campanello a Tirante e Maniglioni Laterali (D.P.R. 503/96 - D.M. 236/89)",
      question:
        "Il bagno clienti accessibile ai disabili dispone di porta larga almeno 85 cm con apertura verso l'esterno, tazza WC con maniglioni di sostegno laterali e specchio reclinabile, e tirante a cordicella per allarme di soccorso a campanello collegato all'esterno?",
      normReference: "D.M. 236/1989 art. 8.2, D.P.R. 503/1996 e D.Lgs. 81/2008 All. IV p.to 1.13",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Tirante a cordicella dell'allarme soccorso disabili mancante o non funzionante, oppure assenza di maniglione di sostegno ribaltabile a lato WC.",
    });
  }

  // i) Deposito Rifiuti & Olii Esausti: Mastelli differenziata ermetici e stoccaggio olio vegetale CER 20 01 25
  if (env.id === "env-rist-rifiuti" || env.id.includes("rist-rifiuti")) {
    items.push({
      id: `${env.id}-mastelli-olio-esausto-cer`,
      area: env.name,
      title: "Mastelli Differenziata Ermetici e Stoccaggio Olio Vegetale Esausto (CER 20 01 25)",
      question:
        "I rifiuti organici e secchi sono stoccati in mastelli carrellati a chiusura ermetica e lavabili, e l'olio vegetale esausto di frittura è stoccato in bidone ermetico con bacino di contenimento per il conferimento tracciato con formulario FIR (codice CER 20 01 25) a ditta autorizzata?",
      normReference: "D.Lgs. 152/2006 art. 190-193, Reg. CE 852/2004 All. II Cap. VI",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mastelli rifiuti privi di coperchio con richiamo di infestanti, o stoccaggio privo di bacino di contenimento e tracciabilità FIR per oli alimentari esausti (CER 20 01 25).",
    });
  }

  // j) Locale Tecnico Gas: Elettrovalvola esterna intercettazione metano con pulsante di sgancio d'emergenza
  if (env.id === "env-rist-tecnico" || env.id.includes("rist-tecnico")) {
    items.push({
      id: `${env.id}-elettrovalvola-gas-sgancio-emergenza`,
      area: env.name,
      title: "Elettrovalvola Esterna Intercettazione Gas Metano a Riarmo Manuale e Pulsante Sgancio Emergenza",
      question:
        "L'adduzione del gas metano per cucina e riscaldamento è provvista di elettrovalvola esterna normalmente chiusa a riarmo manuale asservita a pulsante di sgancio d'emergenza posizionato all'esterno in posizione accessibile e protetta, e a sensori di fughe gas?",
      normReference: "D.M. 08/11/2019, norma UNI CIG 7129 e D.Lgs. 81/2008 Allegato IV p.to 1.4",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Elettrovalvola di intercettazione gas metano assente o con riarmo automatico non conforme, oppure pulsante di sgancio d'emergenza esterno non accessibile o privo di cartello identificativo.",
    });
  }

  // ============================================================================
  // 12. Requisiti Specifici Pizzeria / Asporto / Delivery (ATECO 56.10.20 / 56.10.2)
  // ============================================================================

  // a) Laboratorio Pizzeria / Banco Stesura, Farcitura & Cottura Pizze
  if (env.id === "env-piz-laboratorio" || env.id.includes("piz-laboratorio")) {
    items.push({
      id: `${env.id}-banco-stesura-moca`,
      area: env.name,
      title: "Banco Stesura Pizze in Granito/Inox Conforme MOCA e Vetrina Refrigerata (+4°C)",
      question:
        "Il banco di stesura e farcitura pizze dispone di piano liscio e integro in granito o acciaio inox certificato per alimenti MOCA, privo di fessurazioni o porosità, e di vetrina refrigerata porta-ingredienti protetta da parafiato in vetro che mantiene la temperatura costante tra +2°C e +4°C?",
      normReference: "Reg. CE 1935/2004 (MOCA), Reg. CE 852/2004 Allegato II Cap. V e Cap. IX",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Piano di stesura con fessurazioni o materiali non conformi MOCA, oppure vetrina ingredienti con temperatura superiore a +4°C o priva di vetro parafiato protettivo.",
    });

    items.push({
      id: `${env.id}-vetrina-ingredienti-refrigerata`,
      area: env.name,
      title: "Vetrina Ingredienti Refrigerata (+4°C) con Parafiato Igienico",
      question:
        "La vetrina orizzontale porta-ingredienti (bacinelle GN) per la farcitura delle pizze assicura temperatura controllata tra +2°C e +4°C con display digitale visibile ed è provvista di struttura parafiato superiore in vetro a protezione degli alimenti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e Capitolo IX",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Vetrina refrigerata ingredienti non funzionante o con display assente/spento e temperatura superiore al limite HACCP di +4°C.",
    });

    items.push({
      id: `${env.id}-cappa-aspirazione-bocca-forno`,
      area: env.name,
      title: "Cappa di Aspirazione Fumi e Calore sopra la Bocca del Forno Pizze",
      question:
        "La bocca di infornamento del forno pizze è sovrastata da cappa di aspirazione ad alta captazione con canna fumaria dedicata conforme a UNI 7129 / UNI 1127, filtri metallici puliti e tiraggio efficiente a protezione dell'operatore pizzaiolo da esalazioni e colpi di calore?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.9 e art. 180 (microclima e calore radiante)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Cappa fumi sopra la bocca del forno assente, sottodimensionata o con filtri saturi di fuliggine/grasso con dispersione di fumi e calore radiante nell'ambiente di lavoro.",
    });

    items.push({
      id: `${env.id}-lavamani-pedale-ginocchio`,
      area: env.name,
      title: "Lavamani a Pedale o Ginocchio con Acqua Calda/Fredda e Salviette Monouso",
      question:
        "Il laboratorio pizzeria dispone di lavamani ad azionamento non manuale (a ginocchio o a pedale) con rubinetto miscelatore di acqua calda e fredda, dispenser di sapone antibatterico e distributore di salviette monouso a perdere con cestino a pedale?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Rubinetteria del lavamani azionabile con le mani o priva di distributore di sapone liquido disinfettante e salviette monouso a perdere.",
    });

    items.push({
      id: `${env.id}-canaline-inox-sifonate`,
      area: env.name,
      title: "Canaline di Scolo a Pavimento Sifonate con Griglie Inox Asportabili",
      question:
        "La pavimentazione del laboratorio è provvista di canaline di scolo con pendenze idonee verso chiusini sifonati antiodore con griglie carrabili in acciaio inox asportabili e lavabili per prevenire ristagni d'acqua, scivolamenti e risalita di esalazioni fognarie?",
      normReference: "Reg. CE 852/2004 All. II Cap. II e D.Lgs. 81/2008 All. IV p.to 1.3",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Canaline di scolo a pavimento intasate, non sifonate o prive di griglie asportabili in acciaio inox con ristagno di residui e rischio scivolamento.",
    });
  }

  // b) Locale Impasto & Lievitazione / Fermentazione Impasti
  if (env.id === "env-piz-impasto" || env.id.includes("piz-impasto")) {
    items.push({
      id: `${env.id}-impastatrice-riparo-interbloccato`,
      area: env.name,
      title: "Impastatrice a Spirale con Riparo Interbloccato a Microinterruttore (UNI EN 453)",
      question:
        "L'impastatrice a spirale (o a forcella/bracci tuffanti) è dotata di griglia mobile di protezione in acciaio inox interbloccata che arresta immediatamente il movimento degli organi lavoratori in caso di sollevamento (norma UNI EN 453) e arresto di emergenza a fungo?",
      normReference: "Norma UNI EN 453, D.Lgs. 81/2008 art. 70-71 e Allegato V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Impastatrice con griglia di protezione mobile bypassata o microinterruttore di sicurezza manomesso con pericolo gravissimo di trascinamento e schiacciamento arti superiori.",
    });

    items.push({
      id: `${env.id}-cassette-portapalline-moca`,
      area: env.name,
      title: "Cassette Portapalline Impasto Idonee al Contatto Alimentare MOCA e Sanificazione",
      question:
        "Le cassette per la lievitazione delle palline impasto pizza sono realizzate in polietilene alimentare conforme MOCA (Reg. CE 1935/2004), integre e prive di scheggiature, impilabili ermeticamente per prevenire contaminazioni aeree e sanificate periodicamente con schede di registrazione?",
      normReference: "Reg. CE 1935/2004 (MOCA) e Reg. CE 852/2004 Allegato II Cap. V",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Cassette impasto fessurate, usurate o prive di marcatura MOCA per alimenti, o stoccate prive di coperchio a contatto con polveri ambientali.",
    });

    items.push({
      id: `${env.id}-aspirazione-polveri-farina`,
      area: env.name,
      title: "Prevenzione e Aspirazione Polveri di Farina (Rischio Asma del Panettiere e ATEX)",
      question:
        "Il locale impasto è dotato di aerazione/aspirazione localizzata o procedure per limitare il sollevamento di polveri di farina durante il caricamento dell'impastatrice, ed è vietato l'uso di getti d'aria compressa o scopa a secco per la pulizia per prevenire asma professionale e atmosfere esplosive?",
      normReference: "D.Lgs. 81/2008 Titolo IX (Agenti Chimici) e Titolo XI (Atmosfere Esplosive ATEX)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Dispersione massiva di polveri di farina nell'ambiente di lavoro privo di ricambio d'aria adeguato, o pulizia eseguita a secco con scopa anziché mediante aspirapolvere industriale certificato.",
    });
  }

  // c) Area Forno Pizze & Deposito Legna da Ardere
  if (env.id === "env-piz-forno-legna" || env.id.includes("piz-forno-legna")) {
    items.push({
      id: `${env.id}-abbattitore-fuliggine-acqua`,
      area: env.name,
      title: "Abbattitore di Fuliggine ad Acqua Conforme UNI 1127 e Canna Fumaria Indipendente",
      question:
        "Il forno per pizze a legna è collegato a canna fumaria indipendente in acciaio inox coibentato dotata di abbattitore di fuliggine ad acqua a ricircolo conforme alla norma UNI 1127, sottoposto a manutenzione periodica certificata e con scarico oltre il colmo del tetto?",
      normReference: "Norma UNI 1127, UNI 10683, D.Lgs. 81/2008 Allegato IV e D.M. 03/08/2015",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Canna fumaria del forno a legna sprovvista di abbattitore di fuliggine ad acqua a norma UNI 1127 o priva di registro di pulizia periodica delle canalizzazioni con elevato rischio incendio canna fumaria.",
    });

    items.push({
      id: `${env.id}-canna-fumaria-indipendente`,
      area: env.name,
      title: "Canna Fumaria Indipendente Certificata e Pulizia Periodica",
      question:
        "La canna fumaria del forno a legna è totalmente indipendente da altri impianti, certificata secondo DM 37/08 con libretto d'impianto e sottoposta a spazzolatura e pulizia periodica registrata per la rimozione dei depositi di creosoto e fuliggine?",
      normReference: "D.M. 37/2008 art. 7, UNI 10683 e D.Lgs. 81/2008 All. IV p.to 1.9",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Canna fumaria priva di dichiarazione di conformità DM 37/08 o assenza di registrazioni di pulizia periodica da parte di fumista abilitato.",
    });

    items.push({
      id: `${env.id}-legna-vergine-certificata`,
      area: env.name,
      title: "Stoccaggio Esclusivo di Legna Vergine Certificata Priva di Trattamenti Chimici",
      question:
        "La legna da ardere utilizzata per la cottura delle pizze è esclusivamente legna vergine naturale certificata (faggio, rovere, carpino), priva di vernici, colle, impregnanti, resine o residui di bancali/scarti di falegnameria, stoccata sollevata da terra e al riparo da umidità e muffe?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. I e Cap. IX, D.Lgs. 152/2006 All. X",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Presenza nel deposito legna di bancali usati, legname verniciato o trattato chimicamente con rilascio di idrocarburi policiclici aromatici (IPA) e diossine tossiche sugli alimenti in cottura.",
    });

    items.push({
      id: `${env.id}-pala-metallica-guanti-termici`,
      area: env.name,
      title: "Pale Metalliche, Guanti Termici Antiscottatura (EN 407) ed Estintore Dedicato",
      question:
        "Gli addetti al forno dispongono di pale in alluminio/inox con manico termoisolante, spazzole in ottone con asta idonea, guanti termici di protezione contro calore e fiamme certificati EN 407, ed è presente nelle immediate vicinanze un estintore a polvere/idrico 34A 233B?",
      normReference: "D.Lgs. 81/2008 art. 75-77 e All. VIII, norma EN 407 e D.M. 02/09/2021",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Mancata dotazione di guanti di protezione termica certificati per alte temperature con rischio ustioni, o estintore antincendio assente nell'area forno.",
    });
  }

  // d) Zona Preparazione Ingredienti & Tagliamozzarella
  if (env.id === "env-piz-prep-ingredienti" || env.id.includes("piz-prep-ingredienti")) {
    items.push({
      id: `${env.id}-tagliamozzarella-microinterruttore`,
      area: env.name,
      title: "Tagliamozzarella / Sfilacciatrice Elettrica con Microinterruttore e Pestello Salvadita",
      question:
        "La macchina tagliamozzarella o sfilacciatrice elettrica è conforme alle norme di sicurezza (UNI EN 12852), provvista di microinterruttore sulla tramoggia che blocca la lama in apertura, pestello spingitore salvadita e anello fisso di protezione?",
      normReference: "Norma UNI EN 12852, D.Lgs. 81/2008 Allegato V e VI",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Macchina tagliamozzarella con microinterruttore della bocca di carico manomesso o priva di pestello pressatore con rischio amputazione dita.",
    });

    items.push({
      id: `${env.id}-lavello-verdure-condimenti`,
      area: env.name,
      title: "Lavello Dedicato al Lavaggio e Sanificazione Verdure per Farcitura Pizze",
      question:
        "La zona preparazione dispone di lavello in acciaio inox ad uso esclusivo per il lavaggio, mondatura e disinfezione delle verdure destinate alla farcitura delle pizze, con erogazione di acqua potabile e separato dai lavelli lavamani e lavastoviglie?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II punto 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mondatura e lavaggio verdure condimenti eseguito promiscuamente in lavelli utilizzati per il lavaggio mani o stoviglie sporche (contaminazione crociata).",
    });

    items.push({
      id: `${env.id}-taglieri-coltelli-codice-colore`,
      area: env.name,
      title: "Taglieri e Coltelleria con Codice Colore HACCP per Ingredienti e Condimenti",
      question:
        "I taglieri in polietilene alimentare e la coltelleria sono differenziati per codice colore (verde verdure, rosso carni/salumi, bianco formaggi/latticini), integri e privi di solchi profondi, e periodicamente sanificati?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e Buone Pratiche Igieniche",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Uso di taglieri promiscui non codificati o taglieri in legno vietati per il taglio di salumi e verdure.",
    });
  }

  // e) Zona Lavaggio Teglie, Cassette Impasto & Stoviglie
  if (env.id === "env-piz-lavaggio" || env.id.includes("piz-lavaggio")) {
    items.push({
      id: `${env.id}-lavaoggetti-dosatori-antiriflusso`,
      area: env.name,
      title: "Lavaoggetti / Lavateglie Industriale con Dispositivo Antiriflusso (UNI EN 1717) e Dosatori",
      question:
        "La lavaoggetti per teglie 60x40 e cassette impasto è provvista di dosatori automatici di detergente/brillantante a circuito chiuso, boiler di risciacquo igienico ad alta temperatura (≥ 80-85°C) e valvola antiriflusso a norma UNI EN 1717 sulla rete idrica?",
      normReference: "Reg. CE 852/2004 All. II Cap. V, norma UNI EN 1717 e D.Lgs. 81/2008 Titolo IX",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavaoggetti industriale priva di dispositivo antiriflusso sulla rete idrica o con temperatura di risciacquo insufficiente per la sanificazione delle teglie e cassette impasto.",
    });

    items.push({
      id: `${env.id}-sanificazione-teglie-cassette`,
      area: env.name,
      title: "Lavaggio e Sanificazione Teglie 60x40 e Cassette Impasto MOCA con Doccione",
      question:
        "L'area lavaggio dispone di lavello profondo in acciaio inox con doccione flessibile per il prelavaggio di teglie e cassette, e di scaffali forati in acciaio inox per l'asciugatura all'aria pulita delle teglie sollevate da terra?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II e Capitolo V",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Teglie da forno o cassette impasto stoccate a terra umide o prive di procedura di lavaggio e sgrassaggio ad alta temperatura.",
    });
  }

  // f) Celle Frigorifere Deperibili (Latticini, Mozzarelle, Salumi, Verdure)
  if (env.id === "env-piz-celle" || env.id.includes("piz-celle")) {
    items.push({
      id: `${env.id}-monitoraggio-mozzarella-salumi`,
      area: env.name,
      title: "Monitoraggio Continuo Temperature Mozzarelle, Salumi e Latticini (+2/+4°C)",
      question:
        "Le celle frigorifere di conservazione della pizzeria garantiscono il monitoraggio continuo e la registrazione su display delle temperature idonee per mozzarelle, latticini (+2/+4°C), salumi e verdure con verifica periodica delle sonde termometriche?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. IX e Manuale HACCP",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Cella frigorifera deperibili pizzeria con temperatura superiore a +4°C con rischio alterazione delle caratteristiche igieniche di mozzarelle e latticini.",
    });
  }

  // g) Dispensa Secco / Deposito Sacchi Farina & Cartoni Pizza MOCA
  if (env.id === "env-piz-dispensa" || env.id.includes("piz-dispensa")) {
    items.push({
      id: `${env.id}-sacchi-farina-pedane`,
      area: env.name,
      title: "Stoccaggio Sacchi Farina su Pedane Plastiche Sollevate (≥ 15 cm) e Areazione",
      question:
        "I sacchi di farina sono stoccati esclusivamente su pedane plastiche lisce e forate sollevate da terra almeno 15 cm, distanziate dalle pareti per consentire l'aerazione e il controllo infestanti, con divieto assoluto di appoggio diretto a pavimento?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I e Capitolo X",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Sacchi di farina appoggiati direttamente sul pavimento o addossati alle pareti, con rischio di assorbimento umidità e contaminazione da infestanti.",
    });

    items.push({
      id: `${env.id}-cartoni-pizza-moca`,
      area: env.name,
      title: "Cartoni Pizza da Asporto con Dichiarazione di Conformità MOCA (Reg. CE 1935/2004)",
      question:
        "I cartoni e contenitori per pizza d'asporto sono vergini, certificati per il contatto con alimenti caldi e grassi (simbolo forchetta e bicchiere), corredati di Dichiarazione di Conformità MOCA del produttore e stoccati sigillati al riparo da polvere e umidità?",
      normReference: "Reg. CE 1935/2004 (MOCA), D.M. 21/03/1973 e Reg. CE 2023/2006 (GMP)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Scatole pizza da asporto prive di dichiarazione di conformità MOCA del fornitore o stoccate aperte esposte a polvere e contaminanti ambientali.",
    });

    items.push({
      id: `${env.id}-monitoraggio-infestanti-farfalline`,
      area: env.name,
      title: "Monitoraggio Infestanti e Trappole a Feromoni per Farfalline della Farina (Pest Control)",
      question:
        "Il locale dispensa dispone di monitoraggio continuo degli infestanti con lampade UV cattura-insetti a piastra collante e trappole a feromoni specifiche per insetti delle farine (Anagasta kuehniella / Plodia interpunctella), con registro controlli aggiornato?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo IX e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Dispensa farine priva di trappole di monitoraggio per insetti delle farine o riscontrata presenza di ragnatele/farfalline sui sacchi di farina.",
    });
  }

  // h) Sala Somministrazione & Area Ritiro Asporto / Delivery
  if (env.id === "env-piz-sala-asporto" || env.id.includes("piz-sala-asporto")) {
    items.push({
      id: `${env.id}-vie-esodo-sala-asporto`,
      area: env.name,
      title: "Vie di Esodo e Percorsi Ritiro Asporto / Delivery Liberi (≥ 1,20 m)",
      question:
        "I percorsi di transito della sala somministrazione e dell'area di attesa asporto/delivery mantengono una larghezza utile non inferiore a 1,20 metri, costantemente sgombri da scatoloni, sedie o biciclette/zaini dei rider?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e D.M. 03/08/2015",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Percorsi di esodo o area di transito asporto ostruiti da zaini delivery, tavolini o merci con riduzione della larghezza utile di fuga a meno di 1,20 m.",
    });

    items.push({
      id: `${env.id}-uscite-emergenza-antipanico`,
      area: env.name,
      title: "Porte di Sicurezza con Apertura a Spinta e Maniglioni Antipanico (UNI EN 1125)",
      question:
        "Le uscite di emergenza della sala/asporto si aprono nel verso dell'esodo, sono provviste di maniglioni antipanico certificati UNI EN 1125 facilmente azionabili e prive di catene o lucchetti durante l'orario di apertura al pubblico?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e norma UNI EN 1125",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Porte di sicurezza con maniglione antipanico bloccato o uscite di sicurezza chiuse a chiave durante l'orario di servizio al pubblico.",
    });

    items.push({
      id: `${env.id}-illuminazione-sicurezza-estintori`,
      area: env.name,
      title: "Illuminazione di Sicurezza (≥ 5 lux) ed Estintori Omologati (34A 233B)",
      question:
        "I locali aperti al pubblico dispongono di illuminazione di sicurezza ad intervento automatico (≥ 5 lux lungo le vie di fuga) ed estintori portatili omologati (classe minima 34A 233B) posizionati ad altezza norma e regolarmente revisionati ogni 6 mesi?",
      normReference: "D.M. 02/09/2021, D.M. 03/08/2015 e norma UNI 9994-1",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Lampade di emergenza guaste o assenti nell'area somministrazione/asporto, oppure estintori scaduti di revisione periodica.",
    });
  }

  // i) Spogliatoi Personale
  if (env.id === "env-piz-spogliatoi" || env.id.includes("piz-spogliatoi")) {
    items.push({
      id: `${env.id}-lavamani-antibagno-spogliatoio`,
      area: env.name,
      title: "Lavamani con Acqua Calda/Fredda e Comandi Igienici nell'Antibagno Spogliatoio",
      question:
        "L'antibagno dei servizi spogliatoio personale dispone di lavamani erogante acqua calda e fredda, dispenser di sapone liquido, salviette monouso a perdere e rubinetteria a comando non manuale?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.13 e Reg. CE 852/2004 All. II",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Assenza di acqua calda al lavamani dell'antibagno spogliatoio o distributore di sapone e salviette monouso mancante.",
    });
  }

  // j) Servizi Igienici Clienti Disabili
  if (env.id === "env-piz-wc-clienti" || env.id.includes("piz-wc-clienti")) {
    items.push({
      id: `${env.id}-wc-disabili-tirante-campanello`,
      area: env.name,
      title: "Accessibilità Disabili, Campanello a Tirante e Maniglioni Laterali (D.P.R. 503/96 - D.M. 236/89)",
      question:
        "Il bagno clienti accessibile a persone con disabilità dispone di porta con luce netta ≥ 85 cm apribile verso l'esterno, tazza WC con maniglioni di sostegno laterali e specchio reclinabile, e tirante allarme a cordicella per soccorso collegato a segnalatore esterno?",
      normReference: "D.M. 236/1989 art. 8.2, D.P.R. 503/1996 e D.Lgs. 81/2008 All. IV p.to 1.13",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Tirante a cordicella per allarme soccorso disabili mancante o non funzionante, o maniglione laterale di sostegno assente.",
    });
  }

  // k) Deposito Rifiuti & Smaltimento Ceneri Forno Legna
  if (env.id === "env-piz-rifiuti" || env.id.includes("piz-rifiuti")) {
    items.push({
      id: `${env.id}-bidone-ceneri-forno-legna`,
      area: env.name,
      title: "Bidone Metallico Stagno con Coperchio per Ceneri e Carboni Spenti Forno a Legna",
      question:
        "Le ceneri e i carboni spenti estratti dal forno a legna sono raccolti esclusivamente in apposito bidone metallico stagno in lamiera con coperchio ermetico per prevenire qualsiasi innesco accidentale di incendi, tenuto distante da materiali combustibili e lasciato raffreddare prima dello smaltimento?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 4 (Misure contro l'incendio) e D.M. 03/08/2015",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Ceneri del forno a legna depositate in contenitori di plastica o cartone, o bidone metallico privo di coperchio posizionato a ridosso di materiali combustibili con gravissimo rischio di incendio.",
    });

    items.push({
      id: `${env.id}-mastelli-differenziata-ermetici`,
      area: env.name,
      title: "Mastelli Rifiuti Differenziati Ermetici, Lavabili e Piano Antinfestanti",
      question:
        "I contenitori per rifiuti organici e differenziati sono realizzati in materiale plastico rigido lavabile, provvisti di coperchio a tenuta per prevenire odori e richiamo di infestanti, e l'area è dotata di pavimentazione lavabile con pendenza a scarico sifonato?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo VI e D.Lgs. 152/2006",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mastelli rifiuti tenuti aperti o privi di coperchio con presenza di mosche e richiamo di infestanti, o area rifiuti sporca priva di punto acqua per il lavaggio.",
    });
  }

  // l) Locale Tecnico / Quadro Elettrico, Gas & Abbattitore Fumi
  if (env.id === "env-piz-tecnico" || env.id.includes("piz-tecnico")) {
    items.push({
      id: `${env.id}-quadro-generale-elettrovalvola-gas`,
      area: env.name,
      title: "Elettrovalvola Esterna Gas Metano a Riarmo Manuale e Quadro Elettrico con Sgancio",
      question:
        "La conduttura del gas per forni e impianti dispone di elettrovalvola esterna a riarmo manuale collegata a pulsante di sgancio d'emergenza esterno in cassetta piombata e a sensori di fughe gas, e il quadro elettrico generale dispone di sgancio rapido accessibile?",
      normReference: "D.M. 08/11/2019, norma UNI CIG 7129 e D.Lgs. 81/2008 Allegato IV p.to 1.4",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Elettrovalvola gas metano assente o con riarmo automatico, oppure pulsante di sgancio d'emergenza ostruito o privo di cartellonistica.",
    });

    items.push({
      id: `${env.id}-ricircolo-idraulico-abbattitore`,
      area: env.name,
      title: "Impianto Idraulico di Ricircolo Acqua Abbattitore di Fuliggine e Pompa di Pressione",
      question:
        "Il circuito idraulico di alimentazione e ricircolo dell'abbattitore di fuliggine del forno a legna dispone di pompa di pressione funzionante, manometro di controllo pressione idrica, filtro autopulente e valvola di sicurezza contro sovrapressioni e allagamenti?",
      normReference: "Norma UNI 1127, D.Lgs. 81/2008 art. 71 e All. IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Pompa di ricircolo acqua dell'abbattitore fumi non funzionante o perdite idriche nel circuito con abbattimento fumi inefficace.",
    });
  }

  return items;
}

