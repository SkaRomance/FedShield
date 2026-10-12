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

  // 0-quinquies. Mense e Ristorazione Collettiva / Centri Cottura (56.29.10, 56.29.1, 56.29.20, 56.29 - Mense aziendali, scolastiche, ospedaliere, pasti veicolati caldo e Cook & Chill)
  if (
    ateco.startsWith("562910") ||
    ateco.startsWith("56291") ||
    ateco.startsWith("56292") ||
    ateco.startsWith("5629")
  ) {
    return [
      {
        id: "env-mensa-cottura",
        key: "mensa_cucina_grandi_cotture",
        name: "Cucina Calda & Zona Grandi Cotture Industriali",
        icon: "🍳",
        category: "production",
        isDefault: true,
        surfaceSqM: 80,
        heightM: 3.5,
        volumeCuM: 280,
        occupantsCount: 5,
        windowSurfaceSqM: 8.0,
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
        id: "env-mensa-prep-fredda",
        key: "mensa_prep_fredda_salumi_condimenti",
        name: "Laboratorio Preparazione Fredda, Salumi & Condimenti",
        icon: "🥗",
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
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
          microclimateCompliant: true,
        },
      },
      {
        id: "env-mensa-diete-speciali",
        key: "mensa_diete_speciali_senza_glutine",
        name: "Area Dedicata Diete Speciali & Senza Glutine (Prevenzione Cross-Contact)",
        icon: "🛡️",
        category: "production",
        isDefault: true,
        surfaceSqM: 16,
        heightM: 3.0,
        volumeCuM: 48,
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
        id: "env-mensa-mondatura",
        key: "mensa_ricevimento_mondatura_ortofrutta",
        name: "Locale Ricevimento & Mondatura Ortofrutta",
        icon: "🥔",
        category: "production",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 3.0,
        volumeCuM: 75,
        occupantsCount: 2,
        windowSurfaceSqM: 2.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-mensa-confezionamento",
        key: "mensa_porzionamento_termosigillatura_veicolati",
        name: "Area Porzionamento, Termosigillatura & Spedizione Pasti Veicolati",
        icon: "📦",
        category: "production",
        isDefault: true,
        surfaceSqM: 40,
        heightM: 3.2,
        volumeCuM: 128,
        occupantsCount: 3,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-mensa-celle-frigo",
        key: "mensa_celle_frigo_deperibili_abbattuti",
        name: "Celle Frigorifere Walk-in Deperibili & Cella Abbattuti (Cook & Chill)",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 45,
        heightM: 3.0,
        volumeCuM: 135,
        occupantsCount: 2,
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
        id: "env-mensa-dispensa",
        key: "mensa_magazzino_merci_secche_scorte",
        name: "Magazzino Merci Secche & Scorte Non Deperibili",
        icon: "🏢",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 50,
        heightM: 3.5,
        volumeCuM: 175,
        occupantsCount: 2,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-mensa-lavaggio-pentole",
        key: "mensa_plonge_lavaggio_pentolame_teglie",
        name: "Plonge Industriale Lavaggio Pentolame & Teglie GN 2/1",
        icon: "🧽",
        category: "production",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 3.0,
        volumeCuM: 75,
        occupantsCount: 2,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-mensa-tunnel-stoviglie",
        key: "mensa_centrale_lavaggio_tunnel_stoviglie",
        name: "Centrale Lavaggio Meccanizzato Stoviglie & Vassoi (Tunnel a Traino/Nastro)",
        icon: "🍽️",
        category: "production",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 3.0,
        volumeCuM: 105,
        occupantsCount: 3,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-mensa-sala-selfservice",
        key: "mensa_sala_ristorazione_distribuzione_selfservice",
        name: "Sala Ristorazione & Linea Distribuzione Self-Service / Free-Flow",
        icon: "🏢",
        category: "public",
        isDefault: true,
        surfaceSqM: 180,
        heightM: 3.0,
        volumeCuM: 540,
        occupantsCount: 120,
        emergencyExitsCount: 3,
        windowSurfaceSqM: 20.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
          antiShatterGlass: true,
          emergencyExitsCount: 3,
        },
      },
      {
        id: "env-mensa-spogliatoi-filtro",
        key: "mensa_spogliatoi_personale_filtro_igienico",
        name: "Spogliatoi del Personale con Zona Filtro Igienico",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 2.7,
        volumeCuM: 94.5,
        occupantsCount: 15,
        windowSurfaceSqM: 3.0,
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
        id: "env-mensa-rifiuti-tecnico",
        key: "mensa_locale_rifiuti_climatizzato_cella_umido_tecnico",
        name: "Locale Rifiuti Climatizzato, Impianti & Cella Frigo Rifiuti Umidi",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.7,
        volumeCuM: 67.5,
        occupantsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
          gasLeakDetectorPresent: true,
        },
      },
    ];
  }

  // 0-sexies. Catering per Eventi e Banqueting (56.21.00, 56.21.0, 56.21, 562100, 5621 - Matrimoni, convegni, fiere, ricevimenti con laboratorio di preparazione centrale, allestimenti mobili e logistica delle attrezzature da trasferta)
  if (
    ateco.startsWith("562100") ||
    ateco.startsWith("56210") ||
    ateco.startsWith("5621")
  ) {
    return [
      {
        id: "env-cat-cucina-centrale",
        key: "cat_cucina_centrale_cotture_base",
        name: "Cucina Centrale & Cotture di Base per Eventi",
        icon: "🍳",
        category: "production",
        isDefault: true,
        surfaceSqM: 60,
        heightM: 3.2,
        volumeCuM: 192,
        occupantsCount: 4,
        windowSurfaceSqM: 6.0,
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
        id: "env-cat-prep-fingerfood",
        key: "cat_laboratorio_prep_fredda_fingerfood",
        name: "Laboratorio Preparazione Fredda, Pasticceria Salata & Finger Food",
        icon: "🥗",
        category: "production",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 3.0,
        volumeCuM: 90,
        occupantsCount: 3,
        windowSurfaceSqM: 3.0,
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
        id: "env-cat-diete-allergeni",
        key: "cat_area_diete_speciali_buffet_allergeni",
        name: "Area Dedicata Diete Speciali & Buffet Intolleranze",
        icon: "🛡️",
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
          insectScreens: true,
        },
      },
      {
        id: "env-cat-celle-frigo",
        key: "cat_celle_frigo_walkin_stoccaggio_eventi",
        name: "Celle Frigorifere Walk-in Deperibili & Cella Stoccaggio Eventi",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 2.8,
        volumeCuM: 98,
        occupantsCount: 2,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
        },
      },
      {
        id: "env-cat-dispensa-dry",
        key: "cat_magazzino_merci_secche_beverage",
        name: "Magazzino Merci Secche & Beverage (Vini, Liquori, Bevande)",
        icon: "🍾",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 45,
        heightM: 3.2,
        volumeCuM: 144,
        occupantsCount: 2,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-cat-deposito-noleggio",
        key: "cat_magazzino_stoviglie_tovagliato_noleggio",
        name: "Magazzino Stoviglie, Tovagliato, Posateria & Attrezzature Noleggio",
        icon: "🍽️",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 80,
        heightM: 3.5,
        volumeCuM: 280,
        occupantsCount: 3,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-cat-deposito-arredi",
        key: "cat_deposito_arredi_chafing_banchi_bar",
        name: "Deposito Arredi Mobili, Chafing Dish & Banchi Bar per Ricevimenti",
        icon: "🪑",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 70,
        heightM: 3.5,
        volumeCuM: 245,
        occupantsCount: 2,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-cat-banchina-carico",
        key: "cat_baia_carico_scarico_furgoni_flotta",
        name: "Baia di Carico/Scarico Furgoni Coibentati & Flotta Logistica",
        icon: "🚚",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 60,
        heightM: 4.0,
        volumeCuM: 240,
        occupantsCount: 3,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-cat-lavaggio-rientro",
        key: "cat_plonge_lavaggio_rientro_stoviglie",
        name: "Plonge & Centrale Lavaggio Rientro Stoviglie Sporche da Eventi",
        icon: "🧼",
        category: "production",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 3.0,
        volumeCuM: 105,
        occupantsCount: 2,
        windowSurfaceSqM: 2.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-cat-deposito-gpl",
        key: "cat_deposito_bombole_gpl_cucina_campo",
        name: "Locale / Area Esterna Stoccaggio Bombole GPL per Cucina da Campo",
        icon: "🛢️",
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
      {
        id: "env-cat-spogliatoi",
        key: "cat_spogliatoio_servizi_personale_laboratorio",
        name: "Spogliatoio e Servizi Igienici Personale di Laboratorio e Servizio",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.7,
        volumeCuM: 67.5,
        occupantsCount: 10,
        windowSurfaceSqM: 2.0,
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
        id: "env-cat-ufficio-logistica",
        key: "cat_ufficio_pianificazione_banqueting_logistica",
        name: "Ufficio Pianificazione Eventi, Banqueting & Spedizioni",
        icon: "💻",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.7,
        volumeCuM: 54,
        occupantsCount: 2,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
        },
      },
    ];
  }

  // 0-octies. Gelateria e Pasticceria Ambulante (56.10.41, 56.10.4, 561041, 56104 - Furgoni, ape car, rimorchi e carretti allestiti per gelato artigianale/soft, granite, crepes, waffle, pasticceria con laboratorio di produzione/pastorizzazione e hangar di rimessaggio)
  if (
    ateco.startsWith("561041") ||
    (ateco.startsWith("56104") && !ateco.startsWith("561042"))
  ) {
    return [
      {
        id: "env-gelamb-banco-veicolare",
        key: "gelamb_banco_pozzetti_porzionatura_veicolare",
        name: "Vano Operativo Banco Pozzetti Gelato & Porzionatura Veicolare",
        icon: "🍦",
        category: "production",
        isDefault: true,
        surfaceSqM: 8,
        heightM: 2.2,
        volumeCuM: 17.6,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.5,
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
        id: "env-ft-crepes-waffle",
        key: "ft_crepes_waffle_farciture_calde_bordo",
        name: "Zona Piastre Crêpes, Waffle & Farciture Calde a Bordo",
        icon: "🥞",
        category: "production",
        isDefault: true,
        surfaceSqM: 4,
        heightM: 2.2,
        volumeCuM: 8.8,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-gelamb-vano-tecnico-batterie",
        key: "gelamb_vano_tecnico_batterie_litio_inverter",
        name: "Vano Tecnico Batterie Litio, Inverter & Quadro CEE Veicolare",
        icon: "⚡",
        category: "technical",
        isDefault: true,
        surfaceSqM: 3,
        heightM: 1.2,
        volumeCuM: 3.6,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-gelamb-centrale-idrica",
        key: "gelamb_centrale_idrica_veicolare_boiler",
        name: "Centrale Idrica Veicolare (Acqua Potabile, Boiler & Lavaporzionatore)",
        icon: "💧",
        category: "technical",
        isDefault: true,
        surfaceSqM: 2,
        heightM: 1.2,
        volumeCuM: 2.4,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
        },
      },
      {
        id: "env-gelamb-cabina-guida",
        key: "gelamb_cabina_guida_apecar_furgone",
        name: "Cabina di Guida Furgone / Ape Car Allestito Gelateria",
        icon: "🚚",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 4,
        heightM: 1.8,
        volumeCuM: 7.2,
        occupantsCount: 1,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-gelamb-lab-pastorizzazione",
        key: "gelamb_lab_pastorizzazione_maturazione_miscele",
        name: "Laboratorio Base: Zona Pastorizzazione & Maturazione Miscele Gelato",
        icon: "🥛",
        category: "production",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 3.0,
        volumeCuM: 75,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.5,
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
        id: "env-gelamb-lab-mantecazione",
        key: "gelamb_lab_mantecazione_abbattimento_farcitura",
        name: "Laboratorio Base: Zona Mantecazione, Abbattimento & Farcitura",
        icon: "🍨",
        category: "production",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 3.0,
        volumeCuM: 90,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 3.0,
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
        id: "env-gelamb-lab-pasticceria",
        key: "gelamb_lab_pasticceria_forno_cialde_coni",
        name: "Laboratorio Base: Reparto Pasticceria da Forno, Cialde & Coni",
        icon: "🥐",
        category: "production",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 3.0,
        volumeCuM: 75,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
        },
      },
      {
        id: "env-gelamb-cella-stoccaggio",
        key: "gelamb_cella_negativa_stoccaggio_carapine_20c",
        name: "Cella Frigorifera Negativa Stoccaggio Carapine & Torte Gelato (-20°C)",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.6,
        volumeCuM: 52,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
        },
      },
      {
        id: "env-gelamb-dispensa-coni",
        key: "gelamb_magazzino_secco_coni_packaging_moca",
        name: "Magazzino Secco, Coni, Coppette & Packaging MOCA di Sede",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 3.0,
        volumeCuM: 75,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-gelamb-lavaggio-carapine",
        key: "gelamb_plonge_sede_lavaggio_carapine_fruste",
        name: "Plonge di Sede: Lavaggio & Sanificazione Carapine e Fruste",
        icon: "🧼",
        category: "production",
        isDefault: true,
        surfaceSqM: 18,
        heightM: 3.0,
        volumeCuM: 54,
        occupantsCount: 1,
        emergencyExitsCount: 1,
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
        id: "env-gelamb-hangar-ricarica",
        key: "gelamb_hangar_rimessaggio_coperto_ricarica_notturna",
        name: "Hangar Rimessaggio Coperto con Colonnina di Ricarica Notturna Frigo",
        icon: "🏢",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 45,
        heightM: 4.0,
        volumeCuM: 180,
        occupantsCount: 2,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          emergencyLighting: true,
        },
      },
    ];
  }

  // 0-septies. Food Truck / Cibo di Strada e Ristorazione Ambulante (56.10.42, 56.10.4, 561042, 56104 - Furgoni e autonegozi speciali allestiti per somministrazione itinerante, chioschi mobili, paninoteche ambulanti, rosticcerie mobili con laboratorio/rimessaggio di sede)
  if (
    ateco.startsWith("561042") ||
    ateco.startsWith("56104")
  ) {
    return [
      {
        id: "env-ft-vano-cottura",
        key: "ft_vano_cottura_piastre",
        name: "Vano Operativo di Cottura & Piastre Food Truck",
        icon: "🍳",
        category: "production",
        isDefault: true,
        surfaceSqM: 10,
        heightM: 2.2,
        volumeCuM: 22,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.5,
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
        id: "env-ft-banco-somministrazione",
        key: "ft_banco_somministrazione_cassa_parafiato",
        name: "Banco di Somministrazione, Cassa & Vetrina Parafiato Clienti",
        icon: "🍔",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 6,
        heightM: 2.2,
        volumeCuM: 13.2,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ft-vano-refrigerazione",
        key: "ft_vano_frigo_stoccaggio_deperibili_bordo",
        name: "Vano Frigoriferi & Stoccaggio Deperibili a Bordo (Positivo/Negativo)",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 5,
        heightM: 2.2,
        volumeCuM: 11,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
        },
      },
      {
        id: "env-ft-vano-bombole-gpl",
        key: "ft_vano_tecnico_bombole_gpl_veicolo",
        name: "Vano Tecnico Bombole GPL del Veicolo (Isolato ed Areato Esterno)",
        icon: "🛢️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 2,
        heightM: 1.2,
        volumeCuM: 2.4,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
          gasLeakDetectorPresent: true,
        },
      },
      {
        id: "env-ft-vano-generatore",
        key: "ft_vano_generatore_elettrico_ausiliario",
        name: "Vano Generatore Elettrico Ausiliario & Quadro Tecnico",
        icon: "⚡",
        category: "technical",
        isDefault: true,
        surfaceSqM: 3,
        heightM: 1.2,
        volumeCuM: 3.6,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ft-impianto-idrico",
        key: "ft_centrale_idrica_mobile_serbatoi",
        name: "Centrale Idrica Mobile (Serbatoi Acqua Potabile & Acque Grigie)",
        icon: "💧",
        category: "technical",
        isDefault: true,
        surfaceSqM: 2,
        heightM: 1.2,
        volumeCuM: 2.4,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
        },
      },
      {
        id: "env-ft-cabina-guida",
        key: "ft_cabina_guida_furgone_autocarro",
        name: "Cabina di Guida del Furgone / Autocarro Allestito",
        icon: "🚚",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 5,
        heightM: 1.8,
        volumeCuM: 9,
        occupantsCount: 2,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ft-deposito-rimessaggio",
        key: "ft_area_rimessaggio_coperto_ricarica",
        name: "Hangar / Area Rimessaggio Coperto del Veicolo & Ricarica Notturna",
        icon: "🏢",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 50,
        heightM: 4.0,
        volumeCuM: 200,
        occupantsCount: 2,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ft-area-carico-scarico",
        key: "ft_piazzale_carico_scarico_acque",
        name: "Piazzale di Carico Merci, Rifornimento Acqua & Scarico Acque Grigie",
        icon: "🚰",
        category: "technical",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 4.0,
        volumeCuM: 120,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-ft-magazzino-scorte",
        key: "ft_magazzino_secco_packaging_moca_sede",
        name: "Magazzino Secco & Packaging Monouso / MOCA di Sede",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 3.0,
        volumeCuM: 75,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-ft-laboratorio-base",
        key: "ft_laboratorio_base_plonge_preparazione",
        name: "Laboratorio Base / Plonge di Sanificazione e Preparazione Linee",
        icon: "🧼",
        category: "production",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 3.0,
        volumeCuM: 60,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-ft-spogliatoi-sede",
        key: "ft_spogliatoio_servizi_personale_sede",
        name: "Spogliatoio e Servizi Igienici Personale presso la Sede Operativa",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 15,
        heightM: 2.7,
        volumeCuM: 40.5,
        occupantsCount: 4,
        emergencyExitsCount: 1,
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
    ];
  }

  // 0-nonies. Bar, Caffetteria, Snack Bar, Cocktail Bar, Wine Bar e Birreria (56.30, 56.3, 563000, 56300, 5630, 563)
  if (
    ateco.startsWith("563000") ||
    ateco.startsWith("56300") ||
    ateco.startsWith("5630") ||
    ateco.startsWith("563")
  ) {
    return [
      {
        id: "env-bar-banco-caffetteria",
        key: "bar_banco_caffetteria_mescita",
        name: "Banco Bar Principale, Caffetteria & Mescita",
        icon: "☕",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.8,
        volumeCuM: 70,
        occupantsCount: 3,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
        },
      },
      {
        id: "env-bar-cocktail-station",
        key: "bar_cocktail_station_mescita_alcolici",
        name: "Zona Cocktail Bar, Mescita Alcolici & Banchi Bottiglie",
        icon: "🍸",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 12,
        heightM: 2.8,
        volumeCuM: 33.6,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 1.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-bar-retrobanco-snack",
        key: "bar_laboratorio_tavola_fredda_snack",
        name: "Laboratorio Tavola Fredda, Piastre Panini & Preparazione Snack",
        icon: "🥪",
        category: "production",
        isDefault: true,
        surfaceSqM: 15,
        heightM: 3.0,
        volumeCuM: 45,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
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
        id: "env-bar-spillatura-co2",
        key: "bar_impianto_spillatura_birra_vano_co2",
        name: "Impianto Spillatura Birra & Vano Bombole CO2 / Azoto Alimentare",
        icon: "🍺",
        category: "technical",
        isDefault: true,
        surfaceSqM: 8,
        heightM: 2.5,
        volumeCuM: 20,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 1.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
          gasLeakDetectorPresent: true,
        },
      },
      {
        id: "env-bar-plonge-lavaggio",
        key: "bar_plonge_lavaggio_bicchieri_stoviglie",
        name: "Zona Lavaggio Bicchieri, Tazzine & Stoviglie (Plonge Separata)",
        icon: "🧼",
        category: "production",
        isDefault: true,
        surfaceSqM: 10,
        heightM: 2.8,
        volumeCuM: 28,
        occupantsCount: 1,
        emergencyExitsCount: 1,
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
        id: "env-bar-deposito-bevande",
        key: "bar_deposito_merci_secche_bibite_fusti",
        name: "Magazzino Merci Secche, Bibite, Fusti & Cantina Vini",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 3.0,
        volumeCuM: 90,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-bar-celle-frigo",
        key: "bar_armadi_frigoriferi_stoccaggio_deperibili",
        name: "Armadi Frigoriferi di Stoccaggio Deperibili (+2/+4°C e -18°C)",
        icon: "❄️",
        category: "storage",
        isDefault: true,
        surfaceSqM: 12,
        heightM: 2.6,
        volumeCuM: 31.2,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
        },
      },
      {
        id: "env-bar-sala-consumo",
        key: "bar_sala_somministrazione_tavoli_clienti",
        name: "Sala Somministrazione, Tavoli & Zona Seduta Clienti (40-60 Coperti)",
        icon: "🍽️",
        category: "public",
        isDefault: true,
        surfaceSqM: 80,
        heightM: 3.0,
        volumeCuM: 240,
        occupantsCount: 50,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 12.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
          antiShatterGlass: true,
        },
      },
      {
        id: "env-bar-dehor-esterno",
        key: "bar_dehor_esterno_tavoli_gazebo",
        name: "Dehor Esterno / Area Tavoli all'Aperto & Gazebo",
        icon: "☀️",
        category: "public",
        isDefault: true,
        surfaceSqM: 40,
        heightM: 2.8,
        volumeCuM: 112,
        occupantsCount: 30,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-bar-wc-clienti",
        key: "bar_servizi_igienici_clienti_disabili",
        name: "Servizi Igienici Clienti (Accessibile Disabili D.P.R. 503/96 - D.M. 236/89)",
        icon: "♿",
        category: "services",
        isDefault: true,
        surfaceSqM: 12,
        heightM: 2.4,
        volumeCuM: 28.8,
        occupantsCount: 2,
        emergencyExitsCount: 1,
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
        id: "env-bar-spogliatoi-staff",
        key: "bar_spogliatoio_wc_personale_antibagno",
        name: "Spogliatoio e Servizi Igienici del Personale con Antibagno",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 12,
        heightM: 2.4,
        volumeCuM: 28.8,
        occupantsCount: 4,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 1.0,
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
        id: "env-bar-tecnico-trattamento-acque",
        key: "bar_locale_tecnico_quadro_elettrico_trattamento_acque",
        name: "Locale Tecnico / Quadro Elettrico & Impianto Trattamento Acque",
        icon: "⚙️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 8,
        heightM: 2.5,
        volumeCuM: 20,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
        },
      },
    ];
  }

  // 0-undecies-bis. Ostello, Residence, Case per Ferie, Alloggi per Studenti e Turisti (55.20.20, 55.20.2, 552020, 55202)
  if (
    ateco.startsWith("552020") ||
    ateco.startsWith("55202") ||
    ateco.startsWith("55.20.20") ||
    ateco.startsWith("55.20.2")
  ) {
    return [
      {
        id: "env-ost-reception-lounge",
        key: "ost_reception_desk_lounge_sociale",
        name: "Reception, Desk Accoglienza H24 & Lounge Sociale",
        icon: "🛋️",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 60,
        heightM: 3.0,
        volumeCuM: 180,
        occupantsCount: 3,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 8.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ost-dormitori-camerate",
        key: "ost_dormitori_comuni_camerate_castello",
        name: "Dormitori Comuni & Camerate a Letti a Castello (4-8 Posti Letto)",
        icon: "🛏️",
        category: "production",
        isDefault: true,
        surfaceSqM: 80,
        heightM: 2.7,
        volumeCuM: 216,
        occupantsCount: 16,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 10.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ost-camere-private",
        key: "ost_camere_private_residence_bagno_disabili",
        name: "Camere Private / Monolocali Residence con Bagno Esclusivo (anche Disabili PMR)",
        icon: "🚪",
        category: "production",
        isDefault: true,
        surfaceSqM: 50,
        heightM: 2.7,
        volumeCuM: 135,
        occupantsCount: 6,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 6.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ost-servizi-igienici-comuni",
        key: "ost_blocco_servizi_igienici_docce_comuni",
        name: "Blocco Servizi Igienici & Docce Multiple Comuni (Separati M/F e Disabili)",
        icon: "🚿",
        category: "services",
        isDefault: true,
        surfaceSqM: 45,
        heightM: 2.4,
        volumeCuM: 108,
        occupantsCount: 6,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 4.5,
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
        id: "env-ost-cucina-condivisa",
        key: "ost_cucina_comune_condivisa_self_catering",
        name: "Cucina Comune Condivisa per Ospiti (Self-Catering) & Zona Pranzo",
        icon: "🍳",
        category: "production",
        isDefault: true,
        surfaceSqM: 40,
        heightM: 3.0,
        volumeCuM: 120,
        occupantsCount: 8,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 5.0,
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
        id: "env-ost-dispensa-frigo-ospiti",
        key: "ost_dispensa_comune_frigoriferi_condivisi",
        name: "Dispensa Comune & Frigoriferi Condivisi per Ospiti (con Etichettatura Alimenti)",
        icon: "🥫",
        category: "storage",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.6,
        volumeCuM: 52,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
        },
      },
      {
        id: "env-ost-lavanderia-self",
        key: "ost_lavanderia_self_service_stireria",
        name: "Lavanderia Self-Service per Ospiti a Gettoni/App & Locale Stireria",
        icon: "🧺",
        category: "services",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.5,
        volumeCuM: 62.5,
        occupantsCount: 3,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.5,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("services"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          forcedExhaustPresent: true,
        },
      },
      {
        id: "env-ost-deposito-housekeeping",
        key: "ost_guardaroba_biancheria_deposito_housekeeping",
        name: "Guardaroba Biancheria, Deposito Housekeeping & Prodotti Pulizia",
        icon: "🧹",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.5,
        volumeCuM: 50,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-ost-deposito-bagagli",
        key: "ost_deposito_bagagli_custodito_lockers",
        name: "Locale Deposito Bagagli Ospiti Custodito & Lockers Elettronici",
        icon: "🧳",
        category: "storage",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.7,
        volumeCuM: 54,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ost-centrale-termica-acs",
        key: "ost_centrale_termica_acs_anti_legionella",
        name: "Centrale Termica / Impianto Riscaldamento & Produzione ACS Anti-Legionella",
        icon: "⚡",
        category: "technical",
        isDefault: true,
        surfaceSqM: 18,
        heightM: 2.6,
        volumeCuM: 46.8,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ost-corridoi-scale-esodo",
        key: "ost_corridoi_piani_scale_esodo_uscite",
        name: "Corridoi ai Piani, Vano Scale Antincendio & Uscite di Emergenza",
        icon: "🚪",
        category: "services",
        isDefault: true,
        surfaceSqM: 90,
        heightM: 2.7,
        volumeCuM: 243,
        occupantsCount: 15,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 8.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("services"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-ost-area-rifiuti",
        key: "ost_area_rifiuti_differenziata_compattatore",
        name: "Locale / Area Esterna Differenziata & Compattatore Rifiuti",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 15,
        heightM: 2.4,
        volumeCuM: 36,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
    ];
  }

  // 0-undecies. B&B, Affittacamere, Case Vacanze, Guest House e Room Rental (55.20.51, 55.20.5, 55.20, 55.2, 552051, 55205, 5520, 552)
  if (
    ateco.startsWith("552051") ||
    ateco.startsWith("55205") ||
    ateco.startsWith("5520") ||
    ateco.startsWith("552") ||
    ateco.startsWith("55.20.51") ||
    ateco.startsWith("55.20.5") ||
    ateco.startsWith("55.20") ||
    ateco.startsWith("55.2")
  ) {
    return [
      {
        id: "env-bnb-ingresso-reception",
        key: "bnb_ingresso_reception_checkin",
        name: "Ingresso Principale, Check-in / Desk Accoglienza & Zona Comune",
        icon: "🔑",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.8,
        volumeCuM: 70,
        occupantsCount: 4,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
          antiShatterGlass: true,
        },
      },
      {
        id: "env-bnb-camere-ospiti",
        key: "bnb_camere_ospiti_camere_disabili",
        name: "Camere da Letto Ospiti (Standard, Superior & Camera Accessibile Disabili)",
        icon: "🛏️",
        category: "public",
        isDefault: true,
        surfaceSqM: 120,
        heightM: 2.7,
        volumeCuM: 324,
        occupantsCount: 12,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 18.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-bnb-bagni-privati",
        key: "bnb_bagni_privati_camere_disabili",
        name: "Servizi Igienici Privati Camere & Bagno Disabili (D.P.R. 503/96)",
        icon: "🚿",
        category: "services",
        isDefault: true,
        surfaceSqM: 24,
        heightM: 2.4,
        volumeCuM: 57.6,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 3.0,
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
        id: "env-bnb-sala-colazioni",
        key: "bnb_area_colazioni_living_ospiti",
        name: "Area Colazioni, Zona Living & Tavoli Ospiti",
        icon: "☕",
        category: "public",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 2.8,
        volumeCuM: 98,
        occupantsCount: 16,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 5.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-bnb-kitchenette-office",
        key: "bnb_kitchenette_angolo_cottura_office",
        name: "Kitchenette / Angolo Cottura, Scaldavivande & Office Colazioni",
        icon: "🍳",
        category: "production",
        isDefault: true,
        surfaceSqM: 12,
        heightM: 2.7,
        volumeCuM: 32.4,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          forcedExhaustType: "kitchen_hood",
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          insectScreens: true,
        },
      },
      {
        id: "env-bnb-guardaroba-biancheria",
        key: "bnb_ripostiglio_guardaroba_biancheria_kit",
        name: "Ripostiglio Guardaroba, Biancheria Pulita & Kit Cortesia",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 10,
        heightM: 2.6,
        volumeCuM: 26,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 1.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-bnb-lavanderia-office",
        key: "bnb_locale_lavanderia_stireria_detergenti",
        name: "Locale Lavanderia Interna, Stireria & Deposito Detergenti",
        icon: "🧺",
        category: "production",
        isDefault: true,
        surfaceSqM: 12,
        heightM: 2.6,
        volumeCuM: 31.2,
        occupantsCount: 1,
        emergencyExitsCount: 1,
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
        id: "env-bnb-centrale-termica-boiler",
        key: "bnb_vano_caldaia_condensazione_boiler_acs",
        name: "Vano Caldaia Murale a Condensazione & Accumulo ACS (Boiler)",
        icon: "⚙️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 6,
        heightM: 2.5,
        volumeCuM: 15,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
          gasLeakDetectorPresent: true,
        },
      },
      {
        id: "env-bnb-terrazzo-balconi",
        key: "bnb_terrazzo_balconi_spazi_aperti",
        name: "Terrazzo, Balconi & Spazi di Sosta all'Aperto",
        icon: "☀️",
        category: "public",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.8,
        volumeCuM: 70,
        occupantsCount: 8,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-bnb-scale-disimpegni",
        key: "bnb_vano_scale_corridoi_disimpegni",
        name: "Vano Scale, Corridoi di Distribuzione & Disimpegni Piani",
        icon: "🪜",
        category: "public",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.7,
        volumeCuM: 67.5,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 3.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-bnb-ripostiglio-housekeeping",
        key: "bnb_ripostiglio_attrezzature_pulizie_carrello",
        name: "Armadio / Ripostiglio Attrezzature Pulizie & Carrello Piani",
        icon: "🧹",
        category: "storage",
        isDefault: true,
        surfaceSqM: 6,
        heightM: 2.4,
        volumeCuM: 14.4,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("storage"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-bnb-area-rifiuti-differenziata",
        key: "bnb_area_raccolta_differenziata_rifiuti",
        name: "Zona Raccolta Differenziata Rifiuti & Stoccaggio Imballaggi",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 8,
        heightM: 2.4,
        volumeCuM: 19.2,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
    ];
  }

  // 0-decies. Hotel, Albergo, Resort e Strutture Ricettive Turistiche (55.10.00, 55.10.0, 55.10, 55.1, 551000, 55100, 5510, 551)
  if (
    ateco.startsWith("551000") ||
    ateco.startsWith("55100") ||
    ateco.startsWith("5510") ||
    ateco.startsWith("551") ||
    ateco.startsWith("55.1")
  ) {
    return [
      {
        id: "env-hotel-reception-hall",
        key: "hotel_reception_hall_accoglienza",
        name: "Hall Principale, Reception & Area Accoglienza Clienti",
        icon: "🛎️",
        category: "sales_office",
        isDefault: true,
        surfaceSqM: 120,
        heightM: 3.5,
        volumeCuM: 420,
        occupantsCount: 8,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 15.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("sales_office"),
          emergencyLighting: true,
          antiShatterGlass: true,
        },
      },
      {
        id: "env-hotel-camere-piano",
        key: "hotel_camere_ospiti_suite_corridoi_piani",
        name: "Camere Ospiti, Suite & Corridoi ai Piani (con Camere Disabili)",
        icon: "🛏️",
        category: "public",
        isDefault: true,
        surfaceSqM: 400,
        heightM: 2.7,
        volumeCuM: 1080,
        occupantsCount: 80,
        emergencyExitsCount: 4,
        windowSurfaceSqM: 60.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-hotel-sala-colazioni",
        key: "hotel_sala_colazioni_ristorazione_ospiti",
        name: "Sala Colazioni & Ristorazione Ospiti (80-120 Coperti)",
        icon: "☕",
        category: "public",
        isDefault: true,
        surfaceSqM: 150,
        heightM: 3.0,
        volumeCuM: 450,
        occupantsCount: 100,
        emergencyExitsCount: 2,
        windowSurfaceSqM: 20.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("public"),
          emergencyLighting: true,
          antiShatterGlass: true,
        },
      },
      {
        id: "env-hotel-office-cucina-colazioni",
        key: "hotel_office_cucina_colazioni_rigenerazione",
        name: "Office / Cucina Preparazione Colazioni & Rigenerazione Cibi",
        icon: "🍳",
        category: "production",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 3.0,
        volumeCuM: 90,
        occupantsCount: 3,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 3.0,
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
        id: "env-hotel-lavanderia-stireria",
        key: "hotel_lavanderia_stireria_gestione_biancheria",
        name: "Lavanderia e Stireria Interna / Gestione Biancheria",
        icon: "🧺",
        category: "production",
        isDefault: true,
        surfaceSqM: 40,
        heightM: 3.0,
        volumeCuM: 120,
        occupantsCount: 3,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 4.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("production"),
          forcedExhaustPresent: true,
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
        },
      },
      {
        id: "env-hotel-deposito-housekeeping",
        key: "hotel_guardaroba_magazzino_biancheria_depositi",
        name: "Guardaroba / Magazzino Biancheria Pulita & Depositi Piani",
        icon: "📦",
        category: "warehouse",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 2.7,
        volumeCuM: 94.5,
        occupantsCount: 2,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("warehouse"),
          shelvingCertified: true,
        },
      },
      {
        id: "env-hotel-centrale-idrica-legionella",
        key: "hotel_centrale_idrica_acs_anti_legionella",
        name: "Centrale Idrica, Impianto ACS & Dosaggio Anti-Legionella",
        icon: "💧",
        category: "technical",
        isDefault: true,
        surfaceSqM: 25,
        heightM: 2.7,
        volumeCuM: 67.5,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
          emergencyLighting: true,
        },
      },
      {
        id: "env-hotel-centrale-termica-clima",
        key: "hotel_centrale_termica_gruppi_frigo_cta",
        name: "Centrale Termica / Gruppi Frigo & Centrale Trattamento Aria (CTA)",
        icon: "❄️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 35,
        heightM: 3.0,
        volumeCuM: 105,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
          gasLeakDetectorPresent: true,
        },
      },
      {
        id: "env-hotel-vano-gruppo-elettrogeno",
        key: "hotel_locale_gruppo_elettrogeno_serbatoio_gasolio",
        name: "Locale Gruppo Elettrogeno & Vano Serbatoio Gasolio Emergenza",
        icon: "⚡",
        category: "technical",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.8,
        volumeCuM: 56,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-hotel-vani-ascensori-montacarichi",
        key: "hotel_vani_corsa_ascensori_montacarichi_servizio",
        name: "Vani Corsa Ascensori Ospiti & Montacarichi di Servizio",
        icon: "🛗",
        category: "technical",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 3.0,
        volumeCuM: 90,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          emergencyLighting: true,
        },
      },
      {
        id: "env-hotel-spogliatoi-personale",
        key: "hotel_spogliatoi_servizi_personale_uomini_donne",
        name: "Spogliatoi e Servizi Igienici Personale (Uomini e Donne)",
        icon: "🚻",
        category: "changing_rooms",
        isDefault: true,
        surfaceSqM: 30,
        heightM: 2.4,
        volumeCuM: 72,
        occupantsCount: 15,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 2.0,
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
        id: "env-hotel-deposito-rifiuti-differenziata",
        key: "hotel_area_deposito_rifiuti_differenziata_compattatore",
        name: "Area Deposito Rifiuti, Differenziata & Vano Compattatore",
        icon: "🗑️",
        category: "technical",
        isDefault: true,
        surfaceSqM: 20,
        heightM: 2.6,
        volumeCuM: 52,
        occupantsCount: 1,
        emergencyExitsCount: 1,
        windowSurfaceSqM: 0,
        isConfirmed: false,
        features: {
          ...defaultEnvironmentFeatures("technical"),
          wallsCondition: "washable_sanitizable_2m",
          flooringCondition: "compliant_anti_slip",
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
  if (
    env.id === "env-ft-vano-cottura" ||
    env.id === "env-ft-banco-somministrazione" ||
    env.id === "env-ft-vano-refrigerazione" ||
    env.id === "env-gelamb-banco-veicolare" ||
    env.id === "env-ft-crepes-waffle"
  ) {
    minHeightRequired = 2.0; // Deroga per autonegozi speciali e veicoli allestiti con ventilazione forzata certificata
  } else if (env.id === "env-ft-cabina-guida" || env.id === "env-gelamb-cabina-guida") {
    minHeightRequired = 1.8; // Cabina di guida veicolare omologata
  } else if (
    env.id === "env-ft-vano-bombole-gpl" ||
    env.id === "env-ft-vano-generatore" ||
    env.id === "env-ft-impianto-idrico" ||
    env.id === "env-gelamb-vano-tecnico-batterie" ||
    env.id === "env-gelamb-centrale-idrica"
  ) {
    minHeightRequired = 1.2; // Vani tecnici veicolari ispezionabili
  } else if (
    env.id === "env-bar-plonge-lavaggio" ||
    env.key.includes("bar_plonge") ||
    env.id === "env-bar-banco-caffetteria" ||
    env.id === "env-bar-cocktail-station"
  ) {
    minHeightRequired = 2.7; // 2,70 m per ambienti di somministrazione / bar e plonge lavabicchieri con deroga ASL / commerciale
  } else if (
    env.id === "env-bar-celle-frigo" ||
    env.key.includes("bar_armadi_frigoriferi") ||
    env.id === "env-gelamb-cella-stoccaggio" ||
    env.key.includes("cella_negativa") ||
    env.key.includes("cella_stoccaggio")
  ) {
    minHeightRequired = 2.4; // 2,40 m per celle frigorifere prefabbricate e locali tecnici refrigerati
  } else if (
    env.id === "env-hotel-deposito-housekeeping" ||
    env.key.includes("hotel_guardaroba")
  ) {
    minHeightRequired = 2.7; // 2,70 m per guardaroba e magazzini biancheria ai piani alberghieri
  } else if (
    env.id === "env-bnb-kitchenette-office" ||
    env.key.includes("bnb_kitchenette")
  ) {
    minHeightRequired = 2.7; // 2,70 m per kitchenette residenziale B&B (D.M. 05/07/1975)
  } else if (
    env.id === "env-bnb-guardaroba-biancheria" ||
    env.id === "env-bnb-ripostiglio-housekeeping" ||
    env.id === "env-bnb-lavanderia-office" ||
    env.key.includes("bnb_guardaroba") ||
    env.key.includes("bnb_ripostiglio") ||
    env.key.includes("bnb_lavanderia")
  ) {
    minHeightRequired = 2.4; // 2,40 m per vani accessori, lavanderie, ripostigli e guardaroba B&B (D.M. 05/07/1975)
  } else if (
    env.id === "env-ost-dormitori-camerate" ||
    env.id === "env-ost-camere-private" ||
    env.key.includes("ost_dormitori") ||
    env.key.includes("ost_camere")
  ) {
    minHeightRequired = 2.7; // 2,70 m per dormitori comuni, camerate e camere private ostello/residence (D.M. 05/07/1975)
  } else if (
    env.id === "env-ost-dispensa-frigo-ospiti" ||
    env.id === "env-ost-deposito-housekeeping" ||
    env.id === "env-ost-deposito-bagagli" ||
    env.key.includes("ost_dispensa") ||
    env.key.includes("ost_guardaroba") ||
    env.key.includes("ost_deposito")
  ) {
    minHeightRequired = 2.4; // 2,40 m per dispense, depositi bagagli e guardaroba ostello (D.M. 05/07/1975)
  } else if (env.category === "production" || env.category === "warehouse" || env.category === "storage") {
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

  // Attività 66: Alberghi, pensioni, motel, villaggi alberghieri con oltre 25 posti letto (D.M. 09/04/1994 e D.P.R. 151/2011)
  if (
    env.id === "env-hotel-camere-piano" ||
    env.key.includes("hotel_camere") ||
    (env.id.includes("hotel-") && occupants > 25)
  ) {
    cpiActivityAlert = {
      code: "Attività 66 (D.P.R. 151/2011)",
      title: "Albergo / Struttura Ricettiva con oltre 25 Posti Letto - Soggetto a CPI VVF",
      description:
        "Struttura ricettiva alberghiera con capacità ricettiva superiore a 25 posti letto: soggetta a controllo di prevenzione incendi secondo D.M. 09/04/1994, D.M. 14/07/2015 o D.M. 09/08/2016 (RTV V.5).",
    };
    summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 66 - Albergo >25 posti letto)", status: "danger" });
  }

  // Attività 74: Impianti per la produzione di calore / Centrale termica con potenza > 116 kW (D.M. 08/11/2019 e D.P.R. 151/2011)
  if (
    env.id === "env-hotel-centrale-termica-clima" ||
    env.key.includes("hotel_centrale_termica")
  ) {
    cpiActivityAlert = {
      code: "Attività 74 (D.P.R. 151/2011)",
      title: "Centrale Termica / Impianto Produzione Calore > 116 kW - CPI VVF",
      description:
        "Impianto termico centralizzato per riscaldamento/climatizzazione con potenzialità termica > 116 kW: soggetto a prevenzione incendi D.M. 08/11/2019.",
    };
    summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 74 - Centrale Termica >116 kW)", status: "danger" });
  }

  // Attività 49: Gruppi elettrogeni con motore a combustione interna con potenza > 25 kW (D.M. 13/07/2011 e D.P.R. 151/2011)
  if (
    env.id === "env-hotel-vano-gruppo-elettrogeno" ||
    env.key.includes("hotel_locale_gruppo_elettrogeno")
  ) {
    cpiActivityAlert = {
      code: "Attività 49 (D.P.R. 151/2011)",
      title: "Gruppo Elettrogeno di Emergenza > 25 kW - CPI VVF",
      description:
        "Installazione fissa di gruppo elettrogeno con motore endotermico diesel > 25 kW e serbatoio gasolio di emergenza: soggetta a D.M. 13/07/2011 e D.P.R. 151/2011.",
    };
    summaryBadges.push({ text: "🔥 Soggetto a CPI (Attività 49 - Gruppo Elettrogeno >25 kW)", status: "danger" });
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

  // 9. Regole ad hoc per Mense e Ristorazione Collettiva / Centri Cottura (56.29.10 / 56.29)
  // a) Cucina Grandi Cotture Industriali
  const isMensaCooking =
    env.id === "env-mensa-cottura" ||
    env.key === "mensa_cucina_grandi_cotture" ||
    (env.id.includes("cottura") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("5629") ?? false));
  if (isMensaCooking) {
    if (height >= 3.5) {
      summaryBadges.push({
        text: "🍳 Cucina grandi cotture: altezza ottimale ≥ 3,50m, cappa compensata con Ansul & canaline con degrassatore UNI EN 1825",
        status: "success",
      });
    } else if (height >= 3.0) {
      summaryBadges.push({
        text: "🍳 Cucina grandi cotture a norma: altezza ≥ 3,00m, cappa compensata Ansul & degrassatore",
        status: "success",
      });
    } else {
      summaryBadges.push({
        text: "🍳 Cucina grandi cotture con altezza ridotta: necessaria deroga ASL e VMC potenziata",
        status: "warning",
      });
    }
    summaryBadges.push({
      text: "🚿 Lavamani comando non manuale a ginocchio/pedale con sapone antibatterico (Reg. CE 852/04)",
      status: "info",
    });
  }

  // b) Area Diete Speciali & Senza Glutine
  const isMensaSpecialDiets =
    env.id === "env-mensa-diete-speciali" ||
    env.key === "mensa_diete_speciali_senza_glutine";
  if (isMensaSpecialDiets) {
    summaryBadges.push({
      text: "🛡️ Area diete speciali & gluten-free: postazione isolata prevenzione cross-contact (Reg. UE 1169/2011)",
      status: "info",
    });
  }

  // c) Confezionamento e Spedizione Pasti Veicolati
  const isMensaPackaging =
    env.id === "env-mensa-confezionamento" ||
    env.key === "mensa_porzionamento_termosigillatura_veicolati";
  if (isMensaPackaging) {
    summaryBadges.push({
      text: "📦 Confezionamento pasti veicolati: legame caldo ≥ 65°C / legame freddo ≤ 4°C (Cook & Chill)",
      status: "info",
    });
  }

  // d) Celle Frigorifere Deperibili & Abbattuti
  const isMensaColdRooms =
    env.id === "env-mensa-celle-frigo" ||
    env.key === "mensa_celle_frigo_deperibili_abbattuti";
  if (isMensaColdRooms) {
    summaryBadges.push({
      text: "🌡️ Teletermometri continui HACCP per celle pluritemperatura & cella abbattuti Cook & Chill (0-3°C)",
      status: "info",
    });
  }

  // e) Sala Ristorazione & Self-Service
  const isMensaDiningHall =
    env.id === "env-mensa-sala-selfservice" ||
    env.key === "mensa_sala_ristorazione_distribuzione_selfservice";
  if (isMensaDiningHall) {
    summaryBadges.push({
      text: "🚪 Vie di esodo libere ≥ 1,20m & uscite di emergenza con maniglioni antipanico",
      status: "info",
    });
    summaryBadges.push({
      text: "🍽️ Linea self-service bagnomaria ≥ 65°C con parafiato igienico & illuminazione emergenza",
      status: "success",
    });
  }

  // f) Spogliatoi con Filtro Igienico
  const isMensaLockerFilter =
    env.id === "env-mensa-spogliatoi-filtro" ||
    env.key === "mensa_spogliatoi_personale_filtro_igienico";
  if (isMensaLockerFilter) {
    summaryBadges.push({
      text: "🚻 Filtro igienico con lavamani a fotocellula & armadietti doppio scomparto sporco/pulito",
      status: "info",
    });
  }

  // g) Locale Rifiuti Climatizzato e Tecnico
  const isMensaWasteTechnical =
    env.id === "env-mensa-rifiuti-tecnico" ||
    env.key === "mensa_locale_rifiuti_climatizzato_cella_umido_tecnico";
  if (isMensaWasteTechnical) {
    summaryBadges.push({
      text: "🗑️ Cella frigorifera rifiuti umidi (≤ 5°C), oli vegetali esausti CER 20 01 25 & elettrovalvola gas",
      status: "warning",
    });
  }

  // 10. Regole ad hoc per Catering per Eventi e Banqueting (56.21.00 / 56.21)
  // a) Cucina Centrale & Cotture di Base per Eventi
  const isCateringKitchen =
    env.id === "env-cat-cucina-centrale" ||
    env.key === "cat_cucina_centrale_cotture_base" ||
    (env.id.includes("cat-cucina") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("5621") ?? false));
  if (isCateringKitchen) {
    if (height >= 3.0) {
      summaryBadges.push({
        text: "🍳 Cucina centrale eventi a norma: altezza ≥ 3,00m, cappa con Ansul R-102 & canaline sifonate con degrassatore",
        status: "success",
      });
    } else {
      summaryBadges.push({
        text: "🍳 Cucina centrale eventi con altezza ridotta (< 3,00m): necessaria deroga ASL e aspirazione potenziata",
        status: "warning",
      });
    }
    summaryBadges.push({
      text: "🚿 Lavamani a ginocchio/pedale acqua calda/fredda con sapone e salviette a perdere (Reg. CE 852/04)",
      status: "info",
    });
  }

  // b) Area Dedicata Diete Speciali & Buffet Intolleranze
  const isCateringSpecialDiets =
    env.id === "env-cat-diete-allergeni" ||
    env.key === "cat_area_diete_speciali_buffet_allergeni";
  if (isCateringSpecialDiets) {
    summaryBadges.push({
      text: "🛡️ Area diete speciali & buffet allergeni: postazione isolata prevenzione cross-contact (Reg. UE 1169/2011 & D.Lgs. 231/2017)",
      status: "info",
    });
  }

  // c) Baia di Carico/Scarico Furgoni Coibentati & Flotta Logistica
  const isCateringLoadingBay =
    env.id === "env-cat-banchina-carico" ||
    env.key === "cat_baia_carico_scarico_furgoni_flotta";
  if (isCateringLoadingBay) {
    summaryBadges.push({
      text: "🚚 Baia logistica eventi: rampe di carico certificate e prese industriali CEE ricarica gruppi frigo ATP",
      status: "info",
    });
  }

  // d) Locale / Area Esterna Stoccaggio Bombole GPL
  const isCateringGplStorage =
    env.id === "env-cat-deposito-gpl" ||
    env.key === "cat_deposito_bombole_gpl_cucina_campo";
  if (isCateringGplStorage) {
    summaryBadges.push({
      text: "🛢️ Stoccaggio bombole GPL per cucine da campo: gabbia metallica areata esterna con catenelle ed estintore a polvere",
      status: "warning",
    });
  }

  // e) Celle Frigorifere Walk-in Deperibili & Cella Stoccaggio Eventi
  const isCateringColdRooms =
    env.id === "env-cat-celle-frigo" ||
    env.key === "cat_celle_frigo_walkin_stoccaggio_eventi";
  if (isCateringColdRooms) {
    summaryBadges.push({
      text: "🌡️ Teletermometri continui HACCP per deperibili (0-4°C) & carrelli pronti (0-3°C)",
      status: "info",
    });
    summaryBadges.push({
      text: "🚨 Allarme uomo intrappolato a 24V h24 a norma UNI EN 378 e sblocco fluorescente interno",
      status: "success",
    });
  }

  // f) Plonge & Centrale Lavaggio Rientro Stoviglie Sporche da Eventi
  const isCateringReturnDishwash =
    env.id === "env-cat-lavaggio-rientro" ||
    env.key === "cat_plonge_lavaggio_rientro_stoviglie";
  if (isCateringReturnDishwash) {
    summaryBadges.push({
      text: "🧼 Centrale lavaggio rientro: marcia in avanti per stoviglie sporche da eventi contro contaminazioni incrociate",
      status: "info",
    });
  }

  // 11. Regole ad hoc per Food Truck e Ristorazione Ambulante (56.10.42 / 56.10.4)
  // a) Vano Operativo di Cottura & Piastre Food Truck
  const isFoodTruckCooking =
    env.id === "env-ft-vano-cottura" ||
    env.key === "ft_vano_cottura_piastre" ||
    (env.id.includes("ft-vano-cottura") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56104") ?? false));
  if (isFoodTruckCooking) {
    if (height >= 2.0) {
      summaryBadges.push({
        text: "🍳 Vano cottura food truck a norma: altezza veicolare ≥ 2,00m con cappa aspirazione inox",
        status: "success",
      });
    } else {
      summaryBadges.push({
        text: "🍳 Vano cottura con altezza veicolare insufficiente (< 2,00m): necessaria conformità ASL autonegozi",
        status: "warning",
      });
    }
    summaryBadges.push({
      text: "🚿 Lavamani con comando non manuale a ginocchio e acqua calda sanitaria (Reg. CE 852/04)",
      status: "info",
    });
  }

  // b) Banco di Somministrazione, Cassa & Vetrina Parafiato Clienti
  const isFoodTruckCounter =
    env.id === "env-ft-banco-somministrazione" ||
    env.key === "ft_banco_somministrazione_cassa_parafiato" ||
    (env.id.includes("ft-banco") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56104") ?? false));
  if (isFoodTruckCounter) {
    summaryBadges.push({
      text: "🚪 Portellone panoramico con pistoni a gas e perno di fermo meccanico anticaduta",
      status: "info",
    });
    summaryBadges.push({
      text: "🛡️ Vetrina refrigerata parafiato curvo igienico antiaerosol per protezione alimenti",
      status: "success",
    });
  }

  // c) Vano Tecnico Bombole GPL del Veicolo
  const isFoodTruckGpl =
    env.id === "env-ft-vano-bombole-gpl" ||
    env.key === "ft_vano_tecnico_bombole_gpl_veicolo" ||
    (env.id.includes("ft-vano-bombole") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56104") ?? false));
  if (isFoodTruckGpl) {
    summaryBadges.push({
      text: "🛢️ Vano bombole GPL stagno verso l'abitacolo con griglie di aerazione permanente a pavimento all'esterno",
      status: "warning",
    });
    summaryBadges.push({
      text: "⚡ Rilevatore fughe gas 12V con elettrovalvola esterna NC, catenelle anticaduta e crash-sensor",
      status: "danger",
    });
  }

  // d) Vano Generatore Elettrico Ausiliario & Quadro Tecnico
  const isFoodTruckGen =
    env.id === "env-ft-vano-generatore" ||
    env.key === "ft_vano_generatore_elettrico_ausiliario" ||
    (env.id.includes("ft-vano-generatore") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56104") ?? false));
  if (isFoodTruckGen) {
    summaryBadges.push({
      text: "⚡ Generatore ausiliario: scarico fumi canalizzato a tetto all'esterno & insonorizzazione",
      status: "info",
    });
    summaryBadges.push({
      text: "🔌 Quadro elettrico con salvavita differenziale 30 mA & presa CEE esterna per allaccio rete",
      status: "success",
    });
  }

  // e) Centrale Idrica Mobile (Serbatoi Acqua Potabile & Acque Grigie)
  const isFoodTruckWater =
    env.id === "env-ft-impianto-idrico" ||
    env.key === "ft_centrale_idrica_mobile_serbatoi" ||
    (env.id.includes("ft-impianto-idrico") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56104") ?? false));
  if (isFoodTruckWater) {
    summaryBadges.push({
      text: "💧 Centrale idrica mobile: serbatoi acqua potabile e pompa autoclave a pressostato conformi MOCA",
      status: "info",
    });
    summaryBadges.push({
      text: "🚰 Serbatoio acque grigie con valvola saracinesca per smaltimento reflui autorizzato",
      status: "warning",
    });
  }

  // 12. Regole ad hoc per Gelateria e Pasticceria Ambulante (56.10.41 / 56.10.4)
  // a) Banco pozzetti veicolare & porzionatura
  const isGelambCounter =
    env.id === "env-gelamb-banco-veicolare" ||
    env.key === "gelamb_banco_pozzetti_porzionatura_veicolare" ||
    (env.id.includes("gelamb-banco") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56104") ?? false));
  if (isGelambCounter) {
    if (height >= 2.0) {
      summaryBadges.push({
        text: "🍦 Banco pozzetti veicolare a norma: altezza ≥ 2,00m con banco a glicole -12/-14°C",
        status: "success",
      });
    } else {
      summaryBadges.push({
        text: "🍦 Banco pozzetti veicolare con altezza insufficiente (< 2,00m)",
        status: "warning",
      });
    }
    summaryBadges.push({
      text: "🚿 Lavamani con comando non manuale a ginocchio & lavaporzionatore a flusso continuo/sanificato",
      status: "info",
    });
    summaryBadges.push({
      text: "🛡️ Vetrina parafiato curvo antiaerosol & portellone con pistoni e fermo meccanico anticaduta",
      status: "success",
    });
  }

  // b) Zona Piastre Crêpes, Waffle & Farciture Calde a Bordo
  const isGelambCrepes =
    env.id === "env-ft-crepes-waffle" ||
    env.key === "ft_crepes_waffle_farciture_calde_bordo" ||
    env.id.includes("crepes-waffle");
  if (isGelambCrepes) {
    if (height >= 2.0) {
      summaryBadges.push({
        text: "🥞 Postazione crêpes/waffle a norma: altezza veicolare ≥ 2,00m e piastre MOCA",
        status: "success",
      });
    } else {
      summaryBadges.push({
        text: "🥞 Postazione crêpes/waffle con altezza insufficiente (< 2,00m)",
        status: "warning",
      });
    }
    summaryBadges.push({
      text: "🍳 Cappa aspirazione fumi inox a tetto & paraspruzzi perimetrale di sicurezza",
      status: "info",
    });
  }

  // c) Vano Tecnico Batterie Litio & Inverter Veicolare
  const isGelambBatteries =
    env.id === "env-gelamb-vano-tecnico-batterie" ||
    env.key === "gelamb_vano_tecnico_batterie_litio_inverter" ||
    env.id.includes("tecnico-batterie");
  if (isGelambBatteries) {
    summaryBadges.push({
      text: "⚡ Pacco batterie LiFePO4 con BMS di sicurezza termica & inverter sinusoidale 230V",
      status: "warning",
    });
    summaryBadges.push({
      text: "🔌 Quadro elettrico veicolare con salvavita differenziale 30 mA & presa CEE esterna",
      status: "success",
    });
  }

  // d) Centrale Idrica Veicolare (Acqua Potabile, Boiler & Lavaporzionatore)
  const isGelambWater =
    env.id === "env-gelamb-centrale-idrica" ||
    env.key === "gelamb_centrale_idrica_veicolare_boiler" ||
    (env.id.includes("gelamb-centrale-idrica") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("56104") ?? false));
  if (isGelambWater) {
    summaryBadges.push({
      text: "💧 Centrale idrica veicolare: serbatoio acqua potabile MOCA 80L, autoclave 12V e boiler sanitario",
      status: "info",
    });
    summaryBadges.push({
      text: "🚰 Serbatoio acque grigie con saracinesca di scarico a tenuta",
      status: "warning",
    });
  }

  // e) Cabina di Guida Furgone / Ape Car Allestito Gelateria
  const isGelambCab =
    env.id === "env-gelamb-cabina-guida" ||
    env.key === "gelamb_cabina_guida_apecar_furgone" ||
    env.id.includes("gelamb-cabina");
  if (isGelambCab) {
    summaryBadges.push({
      text: "🚚 Postazione guida omologata con paratia divisoria fissa di sicurezza anti-intrusione",
      status: "info",
    });
    summaryBadges.push({
      text: "🧯 Estintore veicolare a polvere 2 kg pronto all'uso",
      status: "success",
    });
  }

  // f) Laboratorio Base: Zona Pastorizzazione & Maturazione Miscele Gelato
  const isGelambPast =
    env.id === "env-gelamb-lab-pastorizzazione" ||
    env.key === "gelamb_lab_pastorizzazione_maturazione_miscele" ||
    env.id.includes("pastorizzazione");
  if (isGelambPast) {
    summaryBadges.push({
      text: "🥛 Ciclo termico pastorizzazione HACCP (+85°C) e shock termico rapido (+4°C) a norma Reg. CE 853/04",
      status: "success",
    });
    summaryBadges.push({
      text: "🚿 Lavamani a comando non manuale a ginocchio con sapone antibatterico",
      status: "info",
    });
  }

  // g) Laboratorio Base: Zona Mantecazione, Abbattimento & Farcitura
  const isGelambMantecazione =
    env.id === "env-gelamb-lab-mantecazione" ||
    env.key === "gelamb_lab_mantecazione_abbattimento_farcitura" ||
    env.id.includes("mantecazione");
  if (isGelambMantecazione) {
    summaryBadges.push({
      text: "🍨 Mantecazione e abbattimento rapido carapine a -35°C per stabilizzazione cristalli",
      status: "info",
    });
    summaryBadges.push({
      text: "⚙️ Mantecatore orizzontale con microinterruttore di sicurezza & canaline sifonate inox a pavimento",
      status: "success",
    });
  }

  // h) Laboratorio Base: Reparto Pasticceria da Forno, Cialde & Coni
  const isGelambPasticceria =
    env.id === "env-gelamb-lab-pasticceria" ||
    env.key === "gelamb_lab_pasticceria_forno_cialde_coni" ||
    env.id.includes("lab-pasticceria");
  if (isGelambPasticceria) {
    summaryBadges.push({
      text: "🥐 Macchine pasticceria a norma: planetaria con riparo UNI EN 454 e sfogliatrice UNI EN 1674",
      status: "success",
    });
    summaryBadges.push({
      text: "🔥 Forno pasticceria con cappa d'aspirazione e piastra coni/cialde artigianali",
      status: "info",
    });
  }

  // i) Cella Frigorifera Negativa Stoccaggio Carapine & Torte Gelato (-20°C)
  const isGelambCella =
    env.id === "env-gelamb-cella-stoccaggio" ||
    env.key === "gelamb_cella_negativa_stoccaggio_carapine_20c" ||
    env.id.includes("gelamb-cella");
  if (isGelambCella) {
    summaryBadges.push({
      text: "❄️ Stoccaggio carapine gelato a -20°C con teletermometri continui HACCP",
      status: "info",
    });
    summaryBadges.push({
      text: "🚨 Allarme acustico-visivo uomo intrappolato a 24V h24 a norma UNI EN 378 e sblocco fluorescente",
      status: "danger",
    });
  }

  // j) Magazzino Secco, Coni, Coppette & Packaging MOCA di Sede
  const isGelambPackaging =
    env.id === "env-gelamb-dispensa-coni" ||
    env.key === "gelamb_magazzino_secco_coni_packaging_moca" ||
    env.id.includes("dispensa-coni");
  if (isGelambPackaging) {
    summaryBadges.push({
      text: "📦 Stoccaggio coni, coppette e packaging MOCA rialzato ≥ 15 cm (Reg. CE 1935/2004)",
      status: "info",
    });
  }

  // k) Plonge di Sede: Lavaggio & Sanificazione Carapine e Fruste
  const isGelambPlonge =
    env.id === "env-gelamb-lavaggio-carapine" ||
    env.key === "gelamb_plonge_sede_lavaggio_carapine_fruste" ||
    env.id.includes("lavaggio-carapine");
  if (isGelambPlonge) {
    summaryBadges.push({
      text: "🧼 Plonge e lavaoggetti con risciacquo igienico ≥ 82°C per sanificazione carapine inox",
      status: "success",
    });
    summaryBadges.push({
      text: "🚰 Disconnettore idrico antiriflusso a norma UNI EN 1717",
      status: "info",
    });
  }

  // l) Hangar Rimessaggio Coperto con Colonnina di Ricarica Notturna Frigo
  const isGelambHangar =
    env.id === "env-gelamb-hangar-ricarica" ||
    env.key === "gelamb_hangar_rimessaggio_coperto_ricarica_notturna" ||
    env.id.includes("hangar-ricarica");
  if (isGelambHangar) {
    summaryBadges.push({
      text: "🏢 Colonnina allaccio elettrico notturno a norma CEI per mantenimento freddo glicole a veicolo fermo",
      status: "info",
    });
    summaryBadges.push({
      text: "🧯 Estintori carrellati e vie di manovra libere nell'hangar",
      status: "success",
    });
  }

  // 13. Regole ad hoc per Bar, Caffetteria, Snack Bar, Cocktail Bar e Birreria (56.30 / 56.3)
  // a) Banco bar / caffetteria: altezza minima >= 2.70m, lavamani a comando non manuale con acqua calda/fredda, banco sanificabile MOCA
  const isBarCounter =
    env.id === "env-bar-banco-caffetteria" ||
    env.key === "bar_banco_caffetteria_mescita" ||
    (env.id.includes("bar-banco") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("563") ?? false));
  if (isBarCounter) {
    if (height >= 2.7) {
      summaryBadges.push({
        text: "☕ Banco bar e mescita a norma: altezza ≥ 2,70m, superficie lavabile e gocciolatoi MOCA",
        status: "success",
      });
    }
    summaryBadges.push({
      text: "🚿 Lavamani a comando non manuale (ginocchio/pedale) con acqua calda e fredda",
      status: "info",
    });
    summaryBadges.push({
      text: "☕ Macchina caffè con valvola di sicurezza PED certificata & lancia vapore cool-touch",
      status: "success",
    });
  }

  // b) Zona Cocktail Bar & Mescita Alcolici
  const isBarCocktail =
    env.id === "env-bar-cocktail-station" ||
    env.key === "bar_cocktail_station_mescita_alcolici";
  if (isBarCocktail) {
    summaryBadges.push({
      text: "🍸 Cocktail station inox coibentata con vasca ghiaccio a scarico diretto e speed-rail",
      status: "info",
    });
    summaryBadges.push({
      text: "⚙️ Blender e tritaghiaccio insonorizzati conformi UNI EN 12852 con microinterruttore",
      status: "success",
    });
  }

  // c) Laboratorio Tavola Fredda & Preparazione Snack
  const isBarSnack =
    env.id === "env-bar-retrobanco-snack" ||
    env.key === "bar_laboratorio_tavola_fredda_snack";
  if (isBarSnack) {
    summaryBadges.push({
      text: "🥪 Laboratorio tavola fredda: cappa d'aspirazione sopra piastre panini & fornetti",
      status: "info",
    });
    summaryBadges.push({
      text: "🔪 Affettatrice a gravità con anello paralama continuo 360° (UNI EN 1974) e blocco vela a zero",
      status: "success",
    });
  }

  // d) Impianto Spillatura Birra & Vano Bombole CO2 / Azoto
  const isBarSpillatura =
    env.id === "env-bar-spillatura-co2" ||
    env.key === "bar_impianto_spillatura_birra_vano_co2";
  if (isBarSpillatura) {
    summaryBadges.push({
      text: "🍺 Bombole CO2 ed azoto vincolate con catenelle verticali anticaduta (D.Lgs. 81/08 Titolo XI)",
      status: "info",
    });
    summaryBadges.push({
      text: "🚨 Rilevatore fughe CO2 con allarme ottico-acustico anti-asfissia & aerazione forzata",
      status: "danger",
    });
  }

  // e) Plonge Lavaggio Bicchieri & Tazzine
  const isBarPlonge =
    env.id === "env-bar-plonge-lavaggio" ||
    env.key === "bar_plonge_lavaggio_bicchieri_stoviglie";
  if (isBarPlonge) {
    summaryBadges.push({
      text: "🧼 Lavabicchieri con risciacquo igienico ≥ 82-85°C & Break Tank UNI EN 1717",
      status: "success",
    });
    summaryBadges.push({
      text: "💧 Canalina di scolo a pavimento sifonata con griglia inox rimovibile",
      status: "info",
    });
  }

  // f) Magazzino Merci Secche, Bibite & Fusti
  const isBarStorage =
    env.id === "env-bar-deposito-bevande" ||
    env.key === "bar_deposito_merci_secche_bibite_fusti";
  if (isBarStorage) {
    summaryBadges.push({
      text: "📦 Stoccaggio bibite e fusti birra su scaffali certificati rialzati ≥ 15 cm da terra",
      status: "info",
    });
  }

  // g) Armadi Frigoriferi Deperibili (+2/+4°C e -18°C)
  const isBarFrigo =
    env.id === "env-bar-celle-frigo" ||
    env.key === "bar_armadi_frigoriferi_stoccaggio_deperibili";
  if (isBarFrigo) {
    summaryBadges.push({
      text: "❄️ Armadi frigoriferi positivi (+2/+4°C) e negativi (-18°C) con teletermometri continui HACCP",
      status: "info",
    });
  }

  // h) Sala Somministrazione Tavoli Clienti
  const isBarHall =
    env.id === "env-bar-sala-consumo" ||
    env.key === "bar_sala_somministrazione_tavoli_clienti";
  if (isBarHall) {
    summaryBadges.push({
      text: "🚪 Vie di esodo libere ≥ 1,20m & uscite di sicurezza con maniglioni antipanico",
      status: "info",
    });
    summaryBadges.push({
      text: "🧯 Illuminazione di emergenza ≥ 5 lux & estintori omologati 34A 233B",
      status: "success",
    });
  }

  // i) Dehor Esterno & Area Tavoli all'Aperto
  const isBarDehor =
    env.id === "env-bar-dehor-esterno" ||
    env.key === "bar_dehor_esterno_tavoli_gazebo";
  if (isBarDehor) {
    summaryBadges.push({
      text: "☀️ Dehor esterno: paraventi certificati con ancoraggio antivento zavorrato/fissato",
      status: "info",
    });
    summaryBadges.push({
      text: "🔥 Funghi riscaldanti GPL con valvola antiribaltamento o lampade IR marcate CE",
      status: "success",
    });
  }

  // j) Servizi Igienici Clienti Disabili
  const isBarWc =
    env.id === "env-bar-wc-clienti" ||
    env.key === "bar_servizi_igienici_clienti_disabili";
  if (isBarWc) {
    summaryBadges.push({
      text: "♿ W.C. accessibile disabili (D.P.R. 503/96 - D.M. 236/89) con tirante allarme a campanello",
      status: "success",
    });
  }

  // k) Spogliatoio & WC Staff
  const isBarStaff =
    env.id === "env-bar-spogliatoi-staff" ||
    env.key === "bar_spogliatoio_wc_personale_antibagno";
  if (isBarStaff) {
    summaryBadges.push({
      text: "🚻 Armadietti a doppio scomparto sporco/pulito & lavamani non manuale con antibagno",
      status: "info",
    });
  }

  // l) Locale Tecnico / Quadro Elettrico & Impianto Trattamento Acque
  const isBarTech =
    env.id === "env-bar-tecnico-trattamento-acque" ||
    env.key === "bar_locale_tecnico_quadro_elettrico_trattamento_acque";
  if (isBarTech) {
    summaryBadges.push({
      text: "💧 Addolcitore a resine e filtri conformi D.Lgs. 18/2023 & D.M. 174/2004 con disconnettore UNI EN 1717",
      status: "info",
    });
    summaryBadges.push({
      text: "⚡ Quadro elettrico con differenziale ad alta sensibilità e pulsante di sgancio rapido",
      status: "warning",
    });
  }

  // ========================================================================
  // REGOLE AD HOC HOTEL, RESORT E STRUTTURE RICETTIVE (55.10.00 / 55.1)
  // ========================================================================
  // 1. Reception & Hall
  const isHotelReception =
    env.id === "env-hotel-reception-hall" ||
    env.key === "hotel_reception_hall_accoglienza" ||
    (env.id.includes("hotel-reception") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelReception) {
    summaryBadges.push({
      text: "🛎️ Reception a norma VDT D.Lgs. 81/08 Titolo VII & percorsi di esodo ampi ≥ 1,50 m",
      status: "info",
    });
    summaryBadges.push({
      text: "🚪 Porte automatiche scorrevoli a norma UNI EN 16005 con apertura di sicurezza a spinta per vie di fuga",
      status: "success",
    });
  }

  // 2. Camere Ospiti, Suite & Corridoi ai Piani
  const isHotelCamere =
    env.id === "env-hotel-camere-piano" ||
    env.key === "hotel_camere_ospiti_suite_corridoi_piani" ||
    (env.id.includes("hotel-camere") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelCamere) {
    summaryBadges.push({
      text: "🚪 Porte tagliafuoco EI 30 / EI 60 con chiudiporta omologato a norma D.M. 09/04/1994",
      status: "warning",
    });
    summaryBadges.push({
      text: "🚨 Rilevatori ottici di fumo indirizzati in ogni camera e corridoio con impianto IRAI",
      status: "info",
    });
    summaryBadges.push({
      text: "🗺️ Planimetrie bilingue di evacuazione dietro ogni porta con indicazione vie di fuga",
      status: "info",
    });
    summaryBadges.push({
      text: "♿ Bagni camere disabili D.P.R. 503/96 con tirante allarme a campanello e maniglioni",
      status: "success",
    });
  }

  // 3. Sala Colazioni & Ristorazione Ospiti
  const isHotelSalaColazioni =
    env.id === "env-hotel-sala-colazioni" ||
    env.key === "hotel_sala_colazioni_ristorazione_ospiti" ||
    (env.id.includes("hotel-sala-colazioni") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelSalaColazioni) {
    summaryBadges.push({
      text: "☕ Vie di esodo libere ≥ 1,20 m & uscite antipanico UNI EN 1125",
      status: "success",
    });
    summaryBadges.push({
      text: "🛡️ Linea buffet calda/fredda con cristalli parafiato igienici antiaerosol",
      status: "info",
    });
  }

  // 4. Office / Cucina Preparazione Colazioni & Rigenerazione Cibi
  const isHotelOffice =
    env.id === "env-hotel-office-cucina-colazioni" ||
    env.key === "hotel_office_cucina_colazioni_rigenerazione" ||
    (env.id.includes("hotel-office") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelOffice) {
    summaryBadges.push({
      text: "🍳 Cappa d'aspirazione fumi con filtri a labirinto & forni con porta doppio vetro",
      status: "info",
    });
    summaryBadges.push({
      text: "🧼 Lavamani a ginocchio/pedale & lavastoviglie con Break Tank UNI EN 1717 e risciacquo a 85°C",
      status: "success",
    });
  }

  // 5. Lavanderia e Stireria Interna
  const isHotelLavanderia =
    env.id === "env-hotel-lavanderia-stireria" ||
    env.key === "hotel_lavanderia_stireria_gestione_biancheria" ||
    (env.id.includes("hotel-lavanderia") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelLavanderia) {
    summaryBadges.push({
      text: "🧺 Calandra mangano con barra salvadita a microinterruttore (UNI EN ISO 10472-5)",
      status: "warning",
    });
    summaryBadges.push({
      text: "🔄 Separazione marcia in avanti circuito sporco/pulito & ventilazione forzata anti-umidità",
      status: "info",
    });
  }

  // 6. Guardaroba / Magazzino Housekeeping
  const isHotelGuardaroba =
    env.id === "env-hotel-deposito-housekeeping" ||
    env.key === "hotel_guardaroba_magazzino_biancheria_depositi" ||
    (env.id.includes("hotel-deposito-housekeeping") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelGuardaroba) {
    summaryBadges.push({
      text: "📦 Scaffalature metalliche lisce sollevate ≥ 15 cm da terra & stoccaggio carrelli piani",
      status: "info",
    });
    summaryBadges.push({
      text: "🧪 Schede di sicurezza detergenti consultabili per gli addetti ai piani (D.Lgs. 81/08 art. 227)",
      status: "info",
    });
  }

  // 7. Centrale Idrica, Impianto ACS & Dosaggio Anti-Legionella
  const isHotelCentraleIdrica =
    env.id === "env-hotel-centrale-idrica-legionella" ||
    env.key === "hotel_centrale_idrica_acs_anti_legionella" ||
    (env.id.includes("hotel-centrale-idrica") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelCentraleIdrica) {
    summaryBadges.push({
      text: "💧 Accumulo ACS ≥ 60°C e ricircolo ≥ 50°C a norma Accordo Stato-Regioni 07/05/2015 e D.Lgs. 18/2023",
      status: "danger",
    });
    summaryBadges.push({
      text: "📋 Registro Legionella aggiornato con campionamenti periodici & dosaggio biossido di cloro",
      status: "warning",
    });
  }

  // 8. Centrale Termica / Gruppi Frigo & CTA
  const isHotelCentraleTermica =
    env.id === "env-hotel-centrale-termica-clima" ||
    env.key === "hotel_centrale_termica_gruppi_frigo_cta" ||
    (env.id.includes("hotel-centrale-termica") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelCentraleTermica) {
    summaryBadges.push({
      text: "❄️ Caldaie con valvole INAIL, vaso espansione PED & registro manutenzione filtri CTA/UTA",
      status: "info",
    });
    summaryBadges.push({
      text: "⚠️ Rilevatore fughe gas metano con elettrovalvola esterna a riarmo manuale",
      status: "warning",
    });
  }

  // 9. Locale Gruppo Elettrogeno & Vano Gasolio
  const isHotelGruppoElettrogeno =
    env.id === "env-hotel-vano-gruppo-elettrogeno" ||
    env.key === "hotel_locale_gruppo_elettrogeno_serbatoio_gasolio" ||
    (env.id.includes("hotel-vano-gruppo-elettrogeno") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelGruppoElettrogeno) {
    summaryBadges.push({
      text: "⚡ Vasca di contenimento gasolio al 110% & aerazione permanente D.M. 13/07/2011",
      status: "warning",
    });
    summaryBadges.push({
      text: "🚪 Porta tagliafuoco EI 120 verso l'esterno & alimentazione di emergenza pompe antincendio",
      status: "danger",
    });
  }

  // 10. Vani Ascensori e Montacarichi
  const isHotelAscensori =
    env.id === "env-hotel-vani-ascensori-montacarichi" ||
    env.key === "hotel_vani_corsa_ascensori_montacarichi_servizio" ||
    (env.id.includes("hotel-vani-ascensori") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelAscensori) {
    summaryBadges.push({
      text: "🛗 Dispositivo di comunicazione bidirezionale h24 EN 81-28 & ritorno automatico al piano in blackout",
      status: "info",
    });
    summaryBadges.push({
      text: "📜 Verifica periodica biennale ascensori D.P.R. 162/99 art. 13 con verbale ente notificato",
      status: "success",
    });
  }

  // 11. Spogliatoi e Servizi Igienici Personale
  const isHotelSpogliatoi =
    env.id === "env-hotel-spogliatoi-personale" ||
    env.key === "hotel_spogliatoi_servizi_personale_uomini_donne" ||
    (env.id.includes("hotel-spogliatoi") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelSpogliatoi) {
    summaryBadges.push({
      text: "🚻 Armadietti a doppio scomparto per separazione abiti civili e divise alberghiere",
      status: "info",
    });
    summaryBadges.push({
      text: "🚿 Servizi igienici con docce, lavamani non manuali e aerazione forzata temporizzata",
      status: "success",
    });
  }

  // 12. Area Deposito Rifiuti, Differenziata & Compattatore
  const isHotelRifiuti =
    env.id === "env-hotel-deposito-rifiuti-differenziata" ||
    env.key === "hotel_area_deposito_rifiuti_differenziata_compattatore" ||
    (env.id.includes("hotel-deposito-rifiuti") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isHotelRifiuti) {
    summaryBadges.push({
      text: "🗑️ Area lavabile e disinfettabile con canaletta di scolo sifonata & cassonetti ermetici",
      status: "info",
    });
    summaryBadges.push({
      text: "📦 Compattatore cartone/plastica a norma UNI EN 16500 & separazione frazione umida",
      status: "success",
    });
  }

  // ========================================================================
  // REGOLE AD HOC B&B, AFFITTACAMERE, CASE VACANZE & GUEST HOUSE (55.20.51 / 55.20)
  // ========================================================================
  // 1. Ingresso e Reception
  const isBnbReception =
    env.id === "env-bnb-ingresso-reception" ||
    env.key === "bnb_ingresso_reception_checkin" ||
    (env.id.includes("bnb-ingresso-reception") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbReception) {
    summaryBadges.push({
      text: "🔑 Estintore omologato 13A 89B a norma D.M. 03/09/2021 (Mini-Codice Antincendio)",
      status: "success",
    });
    summaryBadges.push({
      text: "🗺️ Planimetria di esodo bilingue con numeri di emergenza & serratura antipanico o smart lock",
      status: "info",
    });
    summaryBadges.push({
      text: "💡 Illuminazione di emergenza con lampade autoalimentate sui percorsi di esodo",
      status: "info",
    });
  }

  // 2. Camere Ospiti
  const isBnbCamere =
    env.id === "env-bnb-camere-ospiti" ||
    env.key === "bnb_camere_ospiti_camere_disabili" ||
    (env.id.includes("bnb-camere-ospiti") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbCamere) {
    summaryBadges.push({
      text: "🚨 Rilevatori ottici autonomi di fumo conformi a norma UNI EN 14604 in ogni camera",
      status: "info",
    });
    summaryBadges.push({
      text: "🪟 Aerazione naturale diretta con rapporto aeroilluminante ≥ 1/8 superficie & finestre apribili",
      status: "success",
    });
    summaryBadges.push({
      text: "🛏️ Letti ergonomici per prevenzione disturbi muscolo-scheletrici addetti rifacimento camere (D.Lgs. 81/08 Titolo VI)",
      status: "info",
    });
  }

  // 3. Bagni Privati & Bagno Disabili
  const isBnbBagni =
    env.id === "env-bnb-bagni-privati" ||
    env.key === "bnb_bagni_privati_camere_disabili" ||
    (env.id.includes("bnb-bagni-privati") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbBagni) {
    summaryBadges.push({
      text: "♿ Bagno accessibile D.P.R. 503/96 & D.M. 236/89 con tirante allarme a campanello e maniglioni",
      status: "success",
    });
    summaryBadges.push({
      text: "🚿 Soffioni doccia ispezionabili e disincrostati periodicamente contro il rischio Legionella",
      status: "warning",
    });
    summaryBadges.push({
      text: "💨 Aerazione forzata meccanica temporizzata per servizi igienici privi di finestra",
      status: "info",
    });
  }

  // 4. Area Colazioni & Living
  const isBnbSalaColazioni =
    env.id === "env-bnb-sala-colazioni" ||
    env.key === "bnb_area_colazioni_living_ospiti" ||
    (env.id.includes("bnb-sala-colazioni") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbSalaColazioni) {
    summaryBadges.push({
      text: "☕ Buffet con campane e alzatine parafiato MOCA a norma Reg. CE 1935/2004",
      status: "info",
    });
    summaryBadges.push({
      text: "🚪 Vie di esodo libere (larghezza 0,90-1,20 m) verso l'uscita & estintore portatile adiacente",
      status: "success",
    });
  }

  // 5. Kitchenette / Angolo Cottura & Office
  const isBnbKitchenette =
    env.id === "env-bnb-kitchenette-office" ||
    env.key === "bnb_kitchenette_angolo_cottura_office" ||
    (env.id.includes("bnb-kitchenette-office") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbKitchenette) {
    summaryBadges.push({
      text: "🍳 Piano cottura con termocoppia/induzione, cappa aspirante a tetto & lavello inox",
      status: "info",
    });
    summaryBadges.push({
      text: "❄️ Frigorifero con termometro a lettura esterna mantenuto a +4°C (Reg. CE 852/2004 HACCP)",
      status: "success",
    });
    summaryBadges.push({
      text: "🍽️ Stoviglie e superfici conformi MOCA Reg. CE 1935/2004 & lavastoviglie con ciclo igienizzante",
      status: "info",
    });
  }

  // 6. Centrale Termica & Boiler ACS
  const isBnbCentraleTermica =
    env.id === "env-bnb-centrale-termica-boiler" ||
    env.key === "bnb_vano_caldaia_condensazione_boiler_acs" ||
    (env.id.includes("bnb-centrale-termica-boiler") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbCentraleTermica) {
    summaryBadges.push({
      text: "💧 Boiler ACS mantenuto a ≥ 55-60°C contro la proliferazione di Legionella (Accordo 07/05/2015)",
      status: "warning",
    });
    summaryBadges.push({
      text: "⚙️ Caldaia a condensazione con libretto d'impianto, scarico a tetto D.M. 37/08 & valvola di sicurezza convogliata",
      status: "info",
    });
    summaryBadges.push({
      text: "⚠️ Rilevatore fughe di gas metano con allarme acustico e visivo",
      status: "warning",
    });
  }

  // 7. Terrazzo e Balconi
  const isBnbTerrazzo =
    env.id === "env-bnb-terrazzo-balconi" ||
    env.key === "bnb_terrazzo_balconi_spazi_aperti" ||
    (env.id.includes("bnb-terrazzo-balconi") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbTerrazzo) {
    summaryBadges.push({
      text: "☀️ Parapetti e ringhiere a norma h ≥ 1,00 m insuperabili privi di elementi orizzontali scalabili",
      status: "success",
    });
    summaryBadges.push({
      text: "🚶 Pavimentazione esterna antiscivolo classe R11 resistente agli agenti atmosferici",
      status: "info",
    });
  }

  // 8. Ripostiglio Guardaroba Biancheria
  const isBnbGuardaroba =
    env.id === "env-bnb-guardaroba-biancheria" ||
    env.key === "bnb_ripostiglio_guardaroba_biancheria_kit" ||
    (env.id.includes("bnb-guardaroba-biancheria") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbGuardaroba) {
    summaryBadges.push({
      text: "📦 Armadi e scaffali rialzati ≥ 15 cm per stoccaggio biancheria pulita sigillata e kit cortesia",
      status: "info",
    });
  }

  // 9. Lavanderia e Stireria
  const isBnbLavanderia =
    env.id === "env-bnb-lavanderia-office" ||
    env.key === "bnb_locale_lavanderia_stireria_detergenti" ||
    (env.id.includes("bnb-lavanderia-office") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbLavanderia) {
    summaryBadges.push({
      text: "🧺 Lavatrice/asciugatrice classe A ciclo vapore igienizzante & asse stiro con poggiaferro termoisolante",
      status: "info",
    });
    summaryBadges.push({
      text: "🧪 Armadietto chiuso a chiave per detergenti e sostanze chimiche con schede di sicurezza SDS",
      status: "warning",
    });
  }

  // 10. Scale e Disimpegni
  const isBnbScale =
    env.id === "env-bnb-scale-disimpegni" ||
    env.key === "bnb_vano_scale_corridoi_disimpegni" ||
    (env.id.includes("bnb-scale-disimpegni") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbScale) {
    summaryBadges.push({
      text: "🪜 Gradini con profilo antisdrucciolo, corrimano continuo a norma e vie di esodo sgombre",
      status: "success",
    });
    summaryBadges.push({
      text: "💡 Lampade di emergenza a led con autonomia ≥ 1h ad accensione automatica in blackout",
      status: "info",
    });
  }

  // 11. Ripostiglio Housekeeping
  const isBnbHousekeeping =
    env.id === "env-bnb-ripostiglio-housekeeping" ||
    env.key === "bnb_ripostiglio_attrezzature_pulizie_carrello" ||
    (env.id.includes("bnb-ripostiglio-housekeeping") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbHousekeeping) {
    summaryBadges.push({
      text: "🧹 Stoccaggio carrello piani, aspirapolvere con filtro HEPA & armadio DPI operatori pulizia",
      status: "info",
    });
  }

  // 12. Area Rifiuti Differenziata
  const isBnbRifiuti =
    env.id === "env-bnb-area-rifiuti-differenziata" ||
    env.key === "bnb_area_raccolta_differenziata_rifiuti" ||
    (env.id.includes("bnb-area-rifiuti-differenziata") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isBnbRifiuti) {
    summaryBadges.push({
      text: "🗑️ Bidoni ermetici con comando a pedale per raccolta differenziata & superficie lavabile",
      status: "info",
    });
  }

  // ========================================================================
  // REGOLE AD HOC OSTELLO, RESIDENCE, CASE PER FERIE, ALLOGGI STUDENTI E TURISTI (55.20.20 / 55.20.2)
  // ========================================================================
  // 1. Reception, Desk Accoglienza H24 & Lounge Sociale
  const isOstReception =
    env.id === "env-ost-reception-lounge" ||
    env.key === "ost_reception_desk_lounge_sociale" ||
    (env.id.includes("ost-reception-lounge") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstReception) {
    summaryBadges.push({
      text: "🛋️ Postazione VDT ergonomica D.Lgs. 81/08 Titolo VII & quadro elettrico differenziale 30 mA",
      status: "success",
    });
    summaryBadges.push({
      text: "🧯 Estintore omologato 34A 233B, Planimetria di esodo bilingue & videosorveglianza D.Lgs. 196/03",
      status: "info",
    });
  }

  // 2. Dormitori Comuni & Camerate a Letti a Castello
  const isOstDormitori =
    env.id === "env-ost-dormitori-camerate" ||
    env.key === "ost_dormitori_comuni_camerate_castello" ||
    (env.id.includes("ost-dormitori-camerate") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstDormitori) {
    summaryBadges.push({
      text: "🛏️ Letti a castello conformi UNI EN 747 con spondine anticaduta e scalette fisse di sicurezza",
      status: "success",
    });
    summaryBadges.push({
      text: "🚨 Rilevatori ottici di fumo indirizzati UNI EN 54 & planimetria di esodo bilingue su retro porta",
      status: "info",
    });
    summaryBadges.push({
      text: "🔒 Armadietti metallici individuali con lucchetto/badge & prese USB/230V con alveoli protetti",
      status: "info",
    });
  }

  // 3. Camere Private / Monolocali Residence con Bagno Esclusivo
  const isOstCamerePrivate =
    env.id === "env-ost-camere-private" ||
    env.key === "ost_camere_private_residence_bagno_disabili" ||
    (env.id.includes("ost-camere-private") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstCamerePrivate) {
    summaryBadges.push({
      text: "♿ Camere accessibili disabili D.P.R. 503/96 & D.M. 236/89 con tirante allarme a campanello",
      status: "success",
    });
    summaryBadges.push({
      text: "🚪 Porte tagliafuoco EI 30 con chiudiporta idraulico & rilevatori ottici di fumo indirizzati",
      status: "info",
    });
  }

  // 4. Blocco Servizi Igienici & Docce Multiple Comuni
  const isOstServiziIgienici =
    env.id === "env-ost-servizi-igienici-comuni" ||
    env.key === "ost_blocco_servizi_igienici_docce_comuni" ||
    (env.id.includes("ost-servizi-igienici-comuni") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstServiziIgienici) {
    summaryBadges.push({
      text: "🚿 Box doccia con piatto antiscivolo classe R11, pareti lavabili a 2m e canaline sifonate",
      status: "success",
    });
    summaryBadges.push({
      text: "💧 Disinfezione anticalcare soffioni doccia e prevenzione rischio Legionella (D.Lgs. 18/2023)",
      status: "warning",
    });
    summaryBadges.push({
      text: "💨 Antibagno con lavamani e aerazione forzata meccanica temporizzata per bagni ciechi",
      status: "info",
    });
  }

  // 5. Cucina Comune Condivisa per Ospiti (Self-Catering) & Zona Pranzo
  const isOstCucina =
    env.id === "env-ost-cucina-condivisa" ||
    env.key === "ost_cucina_comune_condivisa_self_catering" ||
    (env.id.includes("ost-cucina-condivisa") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstCucina) {
    summaryBadges.push({
      text: "🍳 Piani cottura a induzione professionali (assenza fiamme libere) & cappa con filtri labirinto inox",
      status: "success",
    });
    summaryBadges.push({
      text: "🧯 Estintore dedicato classe F per fuochi oli vegetali e coperta antifiamma a portata immediata",
      status: "warning",
    });
    summaryBadges.push({
      text: "🍽️ Superfici MOCA Reg. CE 1935/2004, forni a microonde inox igienici & zanzariere a finestre",
      status: "info",
    });
  }

  // 6. Dispensa Comune & Frigoriferi Condivisi per Ospiti
  const isOstDispensaFrigo =
    env.id === "env-ost-dispensa-frigo-ospiti" ||
    env.key === "ost_dispensa_comune_frigoriferi_condivisi" ||
    (env.id.includes("ost-dispensa-frigo-ospiti") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstDispensaFrigo) {
    summaryBadges.push({
      text: "❄️ Frigoriferi ventilati multipli con box/cassetti numerati MOCA & teletermometri digitali HACCP",
      status: "info",
    });
    summaryBadges.push({
      text: "🏷️ Procedura HACCP etichettatura alimenti (nome/check-out) e smaltimento settimanale deperibili",
      status: "warning",
    });
  }

  // 7. Lavanderia Self-Service per Ospiti & Stireria
  const isOstLavanderia =
    env.id === "env-ost-lavanderia-self" ||
    env.key === "ost_lavanderia_self_service_stireria" ||
    (env.id.includes("ost-lavanderia-self") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstLavanderia) {
    summaryBadges.push({
      text: "🧺 Lavatrici/asciugatrici a colonna con blocco oblò di sicurezza UNI EN ISO 10472 & pavimento antiscivolo",
      status: "success",
    });
    summaryBadges.push({
      text: "🔥 Pulizia quotidiana filtri lanugine essiccatori contro inneschi termici (D.M. 02/09/2021)",
      status: "warning",
    });
    summaryBadges.push({
      text: "💨 Locale con evacuazione forzata vapori, vasca lavatoio a mano & asse da stiro industriale a vapore",
      status: "info",
    });
  }

  // 8. Guardaroba Biancheria, Deposito Housekeeping & Prodotti Pulizia
  const isOstHousekeeping =
    env.id === "env-ost-deposito-housekeeping" ||
    env.key === "ost_guardaroba_biancheria_deposito_housekeeping" ||
    (env.id.includes("ost-deposito-housekeeping") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstHousekeeping) {
    summaryBadges.push({
      text: "📦 Scaffalature metalliche lisce rialzate ≥ 15 cm per stoccaggio biancheria pulita igienizzata",
      status: "info",
    });
    summaryBadges.push({
      text: "🧪 Armadio chiuso a chiave per detergenti concentrati D.Lgs. 81/08 Titolo IX con SDS",
      status: "warning",
    });
    summaryBadges.push({
      text: "🧹 Carrelli riassetto camere & aspirapolvere professionale con filtro HEPA",
      status: "info",
    });
  }

  // 9. Locale Deposito Bagagli Ospiti Custodito & Lockers Elettronici
  const isOstDepositoBagagli =
    env.id === "env-ost-deposito-bagagli" ||
    env.key === "ost_deposito_bagagli_custodito_lockers" ||
    (env.id.includes("ost-deposito-bagagli") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstDepositoBagagli) {
    summaryBadges.push({
      text: "🧳 Lockers automatizzati con apertura a codice/badge & scaffali portavaligie con bordo anticaduta",
      status: "info",
    });
    summaryBadges.push({
      text: "📹 Porta con controllo accessi, videosorveglianza D.Lgs. 196/03 & illuminazione di sicurezza",
      status: "info",
    });
  }

  // 10. Centrale Termica / Impianto Riscaldamento & Produzione ACS Anti-Legionella
  const isOstCentraleTermica =
    env.id === "env-ost-centrale-termica-acs" ||
    env.key === "ost_centrale_termica_acs_anti_legionella" ||
    (env.id.includes("ost-centrale-termica-acs") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstCentraleTermica) {
    summaryBadges.push({
      text: "💧 Bollitori accumulo ACS a costante ≥ 60°C, anello ricircolo ≥ 50°C e disinfezione termica settimanale",
      status: "warning",
    });
    summaryBadges.push({
      text: "📋 Registro aziendale Legionella aggiornato con campionamenti periodici (D.Lgs. 18/2023)",
      status: "warning",
    });
    summaryBadges.push({
      text: "⚙️ Generatori a condensazione con valvole di sicurezza INAIL e vasi di espansione PED verificati",
      status: "success",
    });
  }

  // 11. Corridoi ai Piani, Vano Scale Antincendio & Uscite di Emergenza
  const isOstCorridoiScale =
    env.id === "env-ost-corridoi-scale-esodo" ||
    env.key === "ost_corridoi_piani_scale_esodo_uscite" ||
    (env.id.includes("ost-corridoi-scale-esodo") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstCorridoiScale) {
    summaryBadges.push({
      text: "🚪 Vie di fuga sgombre ≥ 1,20 m & maniglioni antipanico UNI EN 1125 su uscite verso l'esterno",
      status: "success",
    });
    summaryBadges.push({
      text: "🔥 Porte tagliafuoco EI 30 / EI 60 con chiudiporta idraulico conforme D.M. 09/04/1994",
      status: "info",
    });
    summaryBadges.push({
      text: "💡 Illuminazione di emergenza autoalimentata ≥ 5 lux & sistema ottico-acustico allarme evacuazione",
      status: "info",
    });
  }

  // 12. Locale / Area Esterna Differenziata & Compattatore Rifiuti
  const isOstAreaRifiuti =
    env.id === "env-ost-area-rifiuti" ||
    env.key === "ost_area_rifiuti_differenziata_compattatore" ||
    (env.id.includes("ost-area-rifiuti") && (atecoCode?.replace(/[^0-9]/g, "").startsWith("55") ?? false));
  if (isOstAreaRifiuti) {
    summaryBadges.push({
      text: "🗑️ Bidoni carrellati a tenuta con coperchio per differenziata & compattatore cartoni/plastica",
      status: "info",
    });
    summaryBadges.push({
      text: "🚿 Zona lavabile con pendenza verso griglia sifonata & derattizzazione perimetrale",
      status: "info",
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
      env.key.includes("piz_") ||
      env.id.includes("mensa-") ||
      env.key.includes("mensa_") ||
      env.id.includes("cat-") ||
      env.key.includes("cat_") ||
      env.id.includes("ft-") ||
      env.key.includes("ft_") ||
      env.id.includes("gelamb-") ||
      env.key.includes("gelamb_") ||
      env.id.includes("bar-") ||
      env.key.includes("bar_") ||
      env.id.includes("hotel-office-cucina") ||
      env.key.includes("hotel_office_cucina") ||
      env.id.includes("ost-cucina") ||
      env.key.includes("ost_cucina") ||
      env.id.includes("ost-dispensa") ||
      env.key.includes("ost_dispensa"));

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

    if (env.features.forcedExhaustType === "kitchen_hood" || env.key.includes("cucina") || env.id.includes("mensa-cottura") || env.id.includes("cat-cucina-centrale")) {
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
    const isFoodSector =
      isFoodEnv ||
      env.id.includes("rist") ||
      env.id.includes("super") ||
      env.id.includes("iper") ||
      env.id.includes("piz") ||
      env.id.includes("mensa") ||
      env.id.includes("cat-") ||
      env.key.includes("cat_") ||
      env.id.includes("hotel-") ||
      env.key.includes("hotel_");
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

  // ============================================================================
  // 13. Requisiti Specifici Mense e Ristorazione Collettiva / Centri Cottura (ATECO 56.29.10 / 56.29)
  // ============================================================================

  // a) Cucina Calda & Zona Grandi Cotture Industriali
  if (env.id === "env-mensa-cottura" || env.id.includes("mensa-cottura")) {
    items.push({
      id: `${env.id}-pentole-vapore-ped`,
      area: env.name,
      title: "Pentole a Vapore a Cottura Indiretta e Valvole di Sicurezza PED",
      question:
        "Le pentole industriali a cottura indiretta a vapore sono conformi alla Direttiva PED (2014/68/UE), dotate di valvole di sicurezza tarate e sigillate sull'intercapedine, manometro di pressione con settore rosso di pericolo ben visibile e sottoposte a verifiche periodiche di integrità ai sensi dell'art. 71 D.Lgs. 81/08?",
      normReference: "D.Lgs. 81/2008 art. 71, Direttiva 2014/68/UE (PED) e Raccolta ISPESL",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Pentole industriali a vapore con valvola di sicurezza intercapedine bloccata, manometro illeggibile o verifica periodica recipienti a pressione scaduta (art. 71 D.Lgs. 81/08).",
    });

    items.push({
      id: `${env.id}-brasiere-ribaltabili-sicurezza`,
      area: env.name,
      title: "Brasiere Ribaltabili Industriali con Arresto Riscaldamento (UNI EN 13885)",
      question:
        "Le brasiere industriali ribaltabili motorizzate sono conformi alla norma UNI EN 13885, dotate di dispositivo di interblocco che arresta automaticamente l'erogazione di calore (gas o elettrico) non appena inizia la rotazione della vasca e comando di ribaltamento ad azione mantenuta (uomo presente)?",
      normReference: "Norma UNI EN 13885 e D.Lgs. 81/2008 Allegato V e VI",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Brasiera ribaltabile con dispositivo di spegnimento riscaldamento manomesso durante lo scarico o sistema di ribaltamento privo di pulsante ad azione mantenuta.",
    });

    items.push({
      id: `${env.id}-impianto-spegnimento-ansul`,
      area: env.name,
      title: "Impianto Spegnimento Automatico Cappa Ansul R-102 e Filtri a Labirinto",
      question:
        "La cappa d'aspirazione compensata è provvista di filtri a labirinto in acciaio inox e di impianto fisso di estinzione automatica incendi a umido a protezione di brasiere, friggitrici e blocchi cottura (tipo Ansul R-102 conforme UNI EN 16282-7), con sgancio manuale di emergenza accessibile e bombole cariche?",
      normReference: "UNI EN 16282-7, D.M. 08/11/2019 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Cappa grandi cotture sprovvista di impianto automatico di spegnimento tipo Ansul R-102 o con ugelli erogatori ostruiti e bombole estinguenti prive di revisione periodica.",
    });

    items.push({
      id: `${env.id}-canaline-degrassatore-disoleatore`,
      area: env.name,
      title: "Canaline Sifonate Inox e Pozzetto Separatore Grassi / Disoleatore (UNI EN 1825)",
      question:
        "La pavimentazione è dotata di ampie canaline di scolo con griglie carrabili in acciaio inox asportabili e chiusini sifonati antiodore, e la linea di scarico è collegata a un degrassatore/separatore di grassi esterno conforme alla norma UNI EN 1825 con spurgo periodico registrato?",
      normReference: "Norma UNI EN 1825-1/2, D.Lgs. 152/2006 art. 101 e Reg. CE 852/2004 All. II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Assenza di pozzetto degrassatore conforme UNI EN 1825 sulla linea di scarico acque reflue cucina o canaline a pavimento intasate da sedimenti e prive di sifonatura.",
    });

    items.push({
      id: `${env.id}-lavamani-non-manuale-antibatterico`,
      area: env.name,
      title: "Lavamani a Comando non Manuale con Sapone Antibatterico",
      question:
        "La cucina dispone di lavamani con comando non manuale a ginocchio o pedale erogante acqua calda e fredda miscelata, distributore a parete di sapone liquido antibatterico e salviette monouso a perdere con cestino a pedale?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavamani della cucina grandi cotture con rubinetteria manuale o sprovvisto di sapone liquido antibatterico e salviette a perdere.",
    });
  }

  // b) Laboratorio Preparazione Fredda, Salumi & Condimenti
  if (env.id === "env-mensa-prep-fredda" || env.id.includes("mensa-prep-fredda")) {
    items.push({
      id: `${env.id}-temperatura-climatizzata-18c`,
      area: env.name,
      title: "Climatizzazione a Temperatura Controllata (≤ 18°C) e Filtrazione Aria",
      question:
        "Il laboratorio di preparazione fredda e porzionamento salumi garantisce una temperatura ambientale controllata non superiore a 18°C durante le lavorazioni di alimenti deperibili, con impianto di climatizzazione sanificato regolarmente e ricambio d'aria privo di getti diretti sugli operatori?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. I e D.Lgs. 81/2008 Allegato IV punto 1.9",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Temperatura ambiente nel laboratorio preparazione fredda superiore a 18°C durante la manipolazione di salumi e carni deperibili, o climatizzatore privo di sanificazione filtri.",
    });

    items.push({
      id: `${env.id}-tavoli-refrigerati-affettatrici`,
      area: env.name,
      title: "Tavoli Refrigerati Inox (+0/+4°C) e Affettatrici/Tagliaverdure con Interblocchi (UNI EN 1974 / UNI EN 1678)",
      question:
        "I banchi da lavoro e tavoli refrigerati in acciaio inox mantengono temperatura tra 0°C e +4°C con display digitale visibile, e le macchine affettatrici e tagliaverdure industriali dispongono di carter fissi, pressamerce, interblocchi di sicurezza conformi a UNI EN 1974 e UNI EN 1678 e pulsanti di arresto di emergenza?",
      normReference: "Reg. CE 852/2004 All. II Cap. V, norma UNI EN 1974 e UNI EN 1678",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Tavolo refrigerato con display spento o temperatura superiore a +4°C, oppure affettatrice/tagliaverdure con dispositivo di sicurezza carter manomesso.",
    });

    items.push({
      id: `${env.id}-lavello-disinfezione-ortaggi`,
      area: env.name,
      title: "Lavello Dedicato Sanificazione e Disinfezione Ortaggi e Crudi",
      question:
        "L'area di preparazione dispone di vasca e lavello in acciaio inox riservati esclusivamente al lavaggio, risciacquo e disinfezione di verdure fresche e crudi con acqua potabile, fisicamente separati dai lavamani e dai punti lavaggio stoviglie?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II punto 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavaggio e disinfezione verdure eseguito in lavelli promiscui utilizzati per stoviglie o pentolame con pericolo grave di contaminazione microbiologica.",
    });
  }

  // c) Area Dedicata Diete Speciali & Senza Glutine (Prevenzione Cross-Contact)
  if (env.id === "env-mensa-diete-speciali" || env.id.includes("mensa-diete-speciali")) {
    items.push({
      id: `${env.id}-cross-contact-allergeni-glutine`,
      area: env.name,
      title: "Prevenzione Cross-Contact Allergeni e Celiachia (Reg. UE 1169/2011 e D.Lgs. 231/2017)",
      question:
        "La postazione di preparazione pasti speciali e senza glutine è fisicamente isolata dal flusso delle grandi cotture con farine, provvista di utensili, taglieri, pentole e contenitori dedicati con marcatura o codice colore specifico, per prevenire qualsiasi cross-contact con allergeni e glutine?",
      normReference: "Reg. UE 1169/2011, D.Lgs. 231/2017 e Reg. CE 852/2004 Allegato II",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancata segregazione fisica o promiscuità di piani di lavoro e utensili tra linea pasti convenzionali e pasti per celiaci/allergici con rischio letale di cross-contamination.",
    });

    items.push({
      id: `${env.id}-armadietto-chiuso-gluten-free`,
      area: env.name,
      title: "Armadietto Chiuso Esclusivo per Materie Prime Gluten-Free ed Allergeni",
      question:
        "Gli ingredienti, le materie prime confezionate e i condimenti riservati alle diete speciali e celiachia sono stoccati in armadietto chiuso esclusivo identificato, protetto da polveri volatili di farina e accessibile solo da personale specificamente formato?",
      normReference: "Reg. UE 1169/2011 e Linee Guida Ministero della Salute per la Celiachia",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Materie prime gluten-free stoccate su scaffali aperti promiscui esposti alla ricaduta di polveri di farine ordinarie.",
    });
  }

  // d) Locale Ricevimento & Mondatura Ortofrutta
  if (env.id === "env-mensa-mondatura" || env.id.includes("mensa-mondatura")) {
    items.push({
      id: `${env.id}-pelapatate-microinterruttori-carter`,
      area: env.name,
      title: "Pelapatate Industriale con Filtro Decantatore Bucce e Microinterruttori (UNI EN 13208)",
      question:
        "La macchina pelapatate industriale è provvista di marcatura CE a norma UNI EN 13208, microinterruttore di sicurezza che arresta il disco abrasivo all'apertura del coperchio o della bocca di scarico, e cestello/filtro decantatore estraibile per la separazione delle bucce prima dello scarico idrico?",
      normReference: "Norma UNI EN 13208 e D.Lgs. 81/2008 Allegato V e VI",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Pelapatate industriale con microinterruttore di protezione manomesso o privo di filtro decantatore bucce con intasamento della linea di scarico.",
    });

    items.push({
      id: `${env.id}-vasche-lavaggio-vortice-disinfezione`,
      area: env.name,
      title: "Vasche di Lavaggio a Vortice Continuo e Procedure di Disinfezione Ortofrutta",
      question:
        "Le vasche di lavaggio ortaggi a gorgogliamento/vortice continuo garantiscono flusso idrico regolabile di acqua potabile, scarico di troppo-pieno con griglia e procedure validate di disinfezione alimentare con registrazione dei tempi di contatto e concentrazioni?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II e Capitolo IX",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Vasche di lavaggio ortaggi prive di ricambio idrico continuo o disinfezione eseguita senza dosaggio controllato di sanificante.",
    });

    items.push({
      id: `${env.id}-pavimento-antiscivolo-canaletta-mondatura`,
      area: env.name,
      title: "Pavimentazione Antiscivolo R13 e Canale di Scolo con Griglia Sifonata",
      question:
        "Il pavimento del locale mondatura presenta grado antisdrucciolo elevato R13 con pendenze marcate verso canalette di scolo con griglie asportabili inox sifonate per convogliare i costanti flussi idrici e scarti terrosi evitando scivolamenti e pozzanghere?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.3 e Reg. CE 852/2004 All. II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Pavimentazione con pendenze insufficienti e ristagni d'acqua e terra nel locale mondatura, con rischio scivolamento e proliferazione batterica.",
    });
  }

  // e) Area Porzionamento, Termosigillatura & Spedizione Pasti Veicolati
  if (env.id === "env-mensa-confezionamento" || env.id.includes("mensa-confezionamento")) {
    items.push({
      id: `${env.id}-termosigillatrice-carter-fotocellule`,
      area: env.name,
      title: "Termosigillatrice Automatica Vaschette con Carter e Fotocellule di Sicurezza (UNI EN 415-3)",
      question:
        "La linea di termosigillatura automatica vaschette (monoporzione/multiporzione anche in atmosfera protettiva ATM) è dotata di ripari fissi, barriere fotoelettriche di protezione contro l'accesso allo stampo saldante riscaldato e arresto rapido d'emergenza a fungo conforme a UNI EN 415-3?",
      normReference: "Norma UNI EN 415-3, Direttiva Macchine 2006/42/CE e D.Lgs. 81/2008 All. V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Termosigillatrice con barriere di sicurezza disattivate o carter di protezione stampo rimosso con rischio grave di ustioni e schiacciamento arti.",
    });

    items.push({
      id: `${env.id}-temperatura-legame-caldo-freddo`,
      area: env.name,
      title: "Controllo Termico Legame Caldo (≥ 65°C) o Freddo (≤ 4°C Cook & Chill) alla Spedizione",
      question:
        "Prima della sigillatura e chiusura nei contenitori termici viene effettuata e registrata la misurazione della temperatura al cuore dei cibi per garantire il mantenimento del legame caldo a temperatura costante non inferiore a +65°C o del legame refrigerato (Cook & Chill) a non più di +4°C fino al consumo?",
      normReference: "Reg. CE 852/2004 All. II Cap. IX e Linee Guida Ristorazione Collettiva",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Pasti veicolati in legame caldo sigillati e spediti con temperatura al cuore inferiore a +65°C o cibi refrigerati Cook & Chill sopra i +4°C con rischio proliferazione tossine batteriche.",
    });

    items.push({
      id: `${env.id}-contenitori-isotermici-trasporto-atp`,
      area: env.name,
      title: "Contenitori Isotermici Gastronorm e Automezzi Coibentati ATP",
      question:
        "I contenitori isotermici Gastronorm (polipropilene espanso o inox riscaldati/refrigerati) sono integri, sanificati e corredati di guarnizioni a tenuta, e il carico avviene tramite baia o rampa protetta direttamente su furgoni isotermici muniti di attestazione ATP valida?",
      normReference: "Accordo ATP, Reg. CE 852/2004 All. II Cap. IV e Reg. CE 1935/2004",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Contenitori isotermici con chiusure rotte o guarnizioni mancanti, o trasporto pasti eseguito su automezzi privi di certificato ATP o non idonei al trasporto alimenti.",
    });
  }

  // f) Celle Frigorifere Walk-in Deperibili & Cella Abbattuti (Cook & Chill)
  if (env.id === "env-mensa-celle-frigo" || env.id.includes("mensa-celle-frigo")) {
    items.push({
      id: `${env.id}-registrazione-temperature-campioni-72h`,
      area: env.name,
      title: "Teletermometria Continua HACCP, Cella Abbattuti (0-3°C) e Campionatura Pasti Testimone (72h)",
      question:
        "Tutte le celle walk-in (carni 0-4°C, ortofrutta +6°C, latticini +4°C, surgelati -18°C e cella piatti cotti abbattuti Cook & Chill 0-3°C) dispongono di registrazione teletermometrica continua HACCP con allarmi di soglia, e viene conservata la campionatura testimone di ogni pasto erogato per almeno 72 ore a temperatura congelata (≤ -18°C)?",
      normReference: "Reg. CE 852/2004 All. II Cap. IX, Reg. CE 37/2005 e Linee Guida Ristorazione Scolastica/Ospedaliera",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancata conservazione dei pasti testimone congelati per 72h o teletermometri delle celle deperibili/abbattuti privi di registrazione continua e allarmi di scostamento.",
    });
  }

  // g) Magazzino Merci Secche & Scorte Non Deperibili
  if (env.id === "env-mensa-dispensa" || env.id.includes("mensa-dispensa")) {
    items.push({
      id: `${env.id}-scaffali-sollevati-ispezione-infestanti`,
      area: env.name,
      title: "Scaffalature Sollevate (≥ 15 cm) e Piano Monitoraggio Infestanti / Roditori",
      question:
        "Le scaffalature industriali per lo stoccaggio scorte secche sono metalliche/plastiche lavabili, sollevate da terra almeno 15 cm e distanziate dalle pareti per agevolare il lavaggio e il monitoraggio contro roditori e insetti, con pedane plastiche lisce e trappole pest control numerate?",
      normReference: "Reg. CE 852/2004 All. II Cap. I e Cap. X, D.Lgs. 81/2008 All. IV",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Imballaggi alimentari e scatolame stoccati direttamente sul pavimento o scaffali addossati ai muri che impediscono le ispezioni del monitoraggio infestanti.",
    });
  }

  // h) Plonge Industriale Lavaggio Pentolame & Teglie GN 2/1
  if (env.id === "env-mensa-lavaggio-pentole" || env.id.includes("mensa-lavaggio-pentole")) {
    items.push({
      id: `${env.id}-dispositivo-antiriflusso-rete-idrica`,
      area: env.name,
      title: "Dispositivo di Protezione Antiriflusso Rete Idrica Potabile (UNI EN 1717)",
      question:
        "La lavaoggetti industriale e i doccioni di ammollo delle grandi pentole sono allacciati alla rete idrica mediante disconnettore idraulico antiriflusso conforme a UNI EN 1717 per impedire qualsiasi contaminazione della rete di acqua potabile da sostanze chimiche o reflui?",
      normReference: "Norma UNI EN 1717, D.Lgs. 18/2023 e Reg. CE 852/2004 All. II Cap. VII",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavaoggetti o doccione di lavaggio pentole privo di dispositivo antiriflusso UNI EN 1717 con rischio grave di contaminazione della rete idrica potabile.",
    });

    items.push({
      id: `${env.id}-cappa-aspirazione-vapori-plonge`,
      area: env.name,
      title: "Cappa di Aspirazione e Condensazione Vapori Plonge Industriale",
      question:
        "La zona plonge pentolame dispone di cappa di aspirazione ed estrazione dei vapori caldi posizionata sopra la lavaoggetti e vasche di ammollo per evitare accumulo di calore, condensa e muffe a soffitto a tutela del benessere microclimatico degli addetti?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.9",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Assenza di cappa o impianto di estrazione vapori sopra la plonge industriale con condensa gocciolante su pareti e soffitti e microclima disagevole.",
    });

    items.push({
      id: `${env.id}-dosatori-chimici-contatto`,
      area: env.name,
      title: "Dosatori Automatici Detergenti Caustici e Vasche di Contenimento",
      question:
        "I detergenti sgrassanti caustici e disincrostanti per pentolame sono collegati a dosatori automatici sigillati con pescanti a circuito chiuso, taniche posizionate in bacini di contenimento plastici e disponibilità di DPI specifici (guanti in nitrile lunghi, visiera paraschizzi)?",
      normReference: "D.Lgs. 81/2008 Titolo IX (Agenti Chimici) e All. IV p.to 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Travaso manuale di prodotti chimici corrosivi ad alta concentrazione senza dosatore o taniche prive di vasca di contenimento.",
    });
  }

  // i) Centrale Lavaggio Meccanizzato Stoviglie & Vassoi (Tunnel a Traino/Nastro)
  if (env.id === "env-mensa-tunnel-stoviglie" || env.id.includes("mensa-tunnel-stoviglie")) {
    items.push({
      id: `${env.id}-arresto-emergenza-tunnel-nastro`,
      area: env.name,
      title: "Dispositivi di Arresto di Emergenza a Fungo lungo il Nastro Trasportatore (UNI EN ISO 13850)",
      question:
        "La macchina lavastoviglie a tunnel o nastro continuo è provvista di pulsanti a fungo di arresto di emergenza ben visibili sia sul lato carico sporco sia sul lato scarico pulito (UNI EN ISO 13850), ripari fissi sugli organi di traino e carter paraspruzzi integri?",
      normReference: "Norma UNI EN ISO 13850, Direttiva 2006/42/CE e D.Lgs. 81/2008 All. V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Lavastoviglie a tunnel continuo priva di pulsanti di arresto di emergenza sui punti operatore o pulsante a fungo non funzionante.",
    });

    items.push({
      id: `${env.id}-risciacquo-termico-82c-sanificazione`,
      area: env.name,
      title: "Risciacquo Termico Igienizzante a Temperatura Costante (≥ 82°C) e Recuperatore Calore",
      question:
        "Il modulo di risciacquo finale del tunnel di lavaggio garantisce temperatura dell'acqua costante di almeno 82°C (norma DIN 10510) rilevabile su termometro digitale visibile per la termodisinfezione certificata di piatti e posate, con condensatore o recuperatore di calore fumi funzionante?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. V e norma DIN 10510",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Temperatura del boiler di risciacquo inferiore a 82°C con mancata igienizzazione termica di stoviglie e vassoi della mensa.",
    });

    items.push({
      id: `${env.id}-separazione-sbarazzo-pulito`,
      area: env.name,
      title: "Netta Separazione tra Area Sbarazzo Sporco e Ricevimento Stoviglie Pulite",
      question:
        "È garantita la netta separazione fisica ed operativa tra la zona di ricezione e sbarazzo vassoi sporchi (con lavello tritarifiuti/sbarazzo) e la zona di prelievo e stoccaggio vassoi e stoviglie pulite sanificate, per prevenire qualsiasi contaminazione crociata (marcia in avanti)?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II e D.Lgs. 81/2008 All. IV",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Promiscuità di percorsi tra vassoi sporchi in rientro e stoviglie pulite appena lavate con rischio di ricontaminazione batterica.",
    });
  }

  // j) Sala Ristorazione & Linea Distribuzione Self-Service / Free-Flow
  if (env.id === "env-mensa-sala-selfservice" || env.id.includes("mensa-sala-selfservice")) {
    items.push({
      id: `${env.id}-bagnomaria-parafiato-selfservice`,
      area: env.name,
      title: "Mantenimento Caldo a Bagnomaria (≥ 65°C) e Schermi Parafiato Igienici",
      question:
        "I moduli della linea di distribuzione self-service per pietanze calde mantengono la temperatura continua non inferiore a +65°C mediante bagnomaria o piastre riscaldanti con display tarato, e sono protetti verso l'utenza da schermi parafiato in vetro/plexiglas trasparente?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. IX e Cap. V",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Banchi bagnomaria caldi della linea self-service con temperatura inferiore a 65°C o privi di schermo parafiato igienico parasputi a protezione dei cibi.",
    });

    items.push({
      id: `${env.id}-vie-esodo-maniglioni-sala-mensa`,
      area: env.name,
      title: "Vie di Fuga (≥ 1,20 m), Uscite Antipanico ed Estintori Omologati",
      question:
        "I percorsi di esodo principali della sala ristorazione collettiva garantiscono larghezza libera costante di almeno 1,20 metri, le porte di sicurezza verso l'esterno sono provviste di maniglioni antipanico certificati UNI EN 1125 apribili a spinta e sono presenti estintori portatili omologati 34A 233B?",
      normReference: "D.M. 03/08/2015, D.M. 02/09/2021 e D.Lgs. 81/2008 All. IV p.to 1.4",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Vie di fuga della sala mensa intralciate da arredi o porte di emergenza chiuse a chiave o con maniglione antipanico duro o bloccato.",
    });
  }

  // k) Spogliatoi del Personale con Zona Filtro Igienico
  if (env.id === "env-mensa-spogliatoi-filtro" || env.id.includes("mensa-spogliatoi-filtro")) {
    items.push({
      id: `${env.id}-filtro-igienico-lavaggio-mani-dpi`,
      area: env.name,
      title: "Zona Filtro Igienico: Lavamani a Fotocellula, Sanificazione Mani e Calzari/Copricapo",
      question:
        "Il varco di accesso dalla zona spogliatoi ai reparti di preparazione alimentare è configurato come filtro igienico obbligatorio provvisto di lavamani a fotocellula, distributore automatico di disinfettante mani alcolico, cestino a pedale e dispenser di copricapo, mascherine e copriscarpe/calzari monouso?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4 e Capitolo VIII",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Accesso alla cucina privo di filtro igienico funzionante, con lavamani a comando manuale o dispenser di disinfettante e copricapo esauriti.",
    });
  }

  // l) Locale Rifiuti Climatizzato, Impianti & Cella Frigo Rifiuti Umidi
  if (env.id === "env-mensa-rifiuti-tecnico" || env.id.includes("mensa-rifiuti-tecnico")) {
    items.push({
      id: `${env.id}-cella-frigo-rifiuti-umidi-5c`,
      area: env.name,
      title: "Cella Frigorifera Rifiuti Umidi / Organici (≤ 5°C) per Abbattimento Odori e Fermentazioni",
      question:
        "Il locale rifiuti dispone di cella frigorifera chiusa e dedicata al mantenimento della frazione umida e scarti organici a temperatura non superiore a +5°C fino al conferimento, al fine di inibire fermentazioni batteriche, miasmi maleodoranti e richiamo di infestanti e mosche?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo VI punto 3 e D.Lgs. 81/2008 All. IV",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Cella frigorifera rifiuti organici guasta o rifiuti umidi stoccati a temperatura ambiente con fermentazioni, odori nauseabondi e presenza di mosche.",
    });

    items.push({
      id: `${env.id}-fusti-oli-vegetali-esausti-cer`,
      area: env.name,
      title: "Stoccaggio Olio Vegetale Esausto (CER 20 01 25) con Bacino di Contenimento e FIR",
      question:
        "Gli oli vegetali esausti derivanti da friggitrici e cotture sono stoccati in fusti stagni metallici/plastici alloggiati all'interno di bacino di contenimento di sicurezza, etichettati con codice CER 20 01 25 e smaltiti tramite trasportatore autorizzato con formulario FIR?",
      normReference: "D.Lgs. 152/2006 art. 190-193 e Reg. CE 852/2004 All. II Cap. VI",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Fusti di olio vegetale esausto privi di bacino di contenimento con sversamenti a pavimento o mancata tenuta dei formulari di smaltimento FIR.",
    });

    items.push({
      id: `${env.id}-elettrovalvola-gas-sgancio-mensa`,
      area: env.name,
      title: "Elettrovalvola Esterna Gas Metano a Riarmo Manuale e Pulsante Sgancio d'Emergenza",
      question:
        "La conduttura di adduzione del gas metano a servizio della centrale termica e cucina è provvista di elettrovalvola normalmente chiusa a riarmo manuale asservita a pulsante di sgancio di emergenza esterno in cassetta protetta e a sensori di fughe gas, con quadro elettrico dotato di interruttore generale con bobina di sgancio?",
      normReference: "D.M. 08/11/2019, norma UNI CIG 7129 e D.Lgs. 81/2008 All. IV p.to 1.4",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Conduttura del gas metano priva di elettrovalvola esterna normalmente chiusa o pulsante di sgancio d'emergenza esterno inaccessibile.",
    });
  }

  // ============================================================================
  // 14. Requisiti Specifici Catering per Eventi e Banqueting (ATECO 56.21.00 / 56.21)
  // ============================================================================

  // a) Cucina Centrale & Cotture di Base per Eventi
  if (env.id === "env-cat-cucina-centrale" || env.id.includes("cat-cucina-centrale")) {
    items.push({
      id: `${env.id}-termocoppie-fuochi-ansul-r102`,
      area: env.name,
      title: "Termocoppie di Sicurezza Fuochi e Impianto di Spegnimento Ansul R-102 (UNI EN 16282-7)",
      question:
        "Tutti i bruciatori e fornelli a gas della cucina centrale sono dotati di termocoppia di sicurezza con blocco automatico dell'erogazione in caso di spegnimento fiamma e la cappa con filtri inox a labirinto è protetta da un impianto fisso di spegnimento automatico ad umido Ansul R-102 con comando manuale d'emergenza ad altezza uomo?",
      normReference: "UNI EN 16282-7, UNI CIG 7129 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Fornelli a gas privi di termocoppia attiva o cappa della cucina centrale priva di impianto di spegnimento automatico Ansul R-102.",
    });

    items.push({
      id: `${env.id}-canaline-degrassatore-uni-en-1825`,
      area: env.name,
      title: "Canaline Inox Sifonate con Griglie Asportabili e Pozzetto Degrassatore (UNI EN 1825)",
      question:
        "La pavimentazione è provvista di canaline di scolo in acciaio inox con griglie carrabili asportabili e chiusini sifonati antiodore, collegate a un pozzetto degrassatore/disoleatore esterno conforme alla norma UNI EN 1825 con spurgo periodico registrato?",
      normReference: "Norma UNI EN 1825-1/2, D.Lgs. 152/2006 art. 101 e Reg. CE 852/2004 All. II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Canaline di scolo a pavimento ostruite o assenza di pozzetto degrassatore conforme UNI EN 1825 a protezione degli scarichi idrici.",
    });

    items.push({
      id: `${env.id}-lavamani-non-manuale-ginocchio-pedale`,
      area: env.name,
      title: "Lavamani a Comando non Manuale con Acqua Calda/Fredda e Sapone Antibatterico",
      question:
        "La cucina centrale dispone di lavamani ad azionamento non manuale a ginocchio o pedale erogante acqua calda e fredda miscelata, distributore di sapone liquido antibatterico e asciugamani monouso a perdere con cestino a pedale?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavamani della cucina con rubinetto a vite manuale o assenza di sapone antibatterico e salviette monouso a perdere.",
    });
  }

  // b) Laboratorio Preparazione Fredda, Pasticceria Salata & Finger Food
  if (env.id === "env-cat-prep-fingerfood" || env.id.includes("cat-prep-fingerfood")) {
    items.push({
      id: `${env.id}-catena-freddo-fingerfood-18c`,
      area: env.name,
      title: "Rispetto della Catena del Freddo nelle Lavorazioni Deperibili (≤ 18°C)",
      question:
        "Nel laboratorio di preparazione finger food e antipasti la temperatura ambientale è mantenuta costantemente non superiore a 18°C durante la manipolazione di alimenti deperibili per eventi, con impianto di climatizzazione sanificato regolarmente?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. I e D.Lgs. 81/2008 Allegato IV punto 1.9",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Temperatura nel laboratorio finger food superiore a 18°C con rischio interruzione della catena del freddo per semilavorati deperibili.",
    });

    items.push({
      id: `${env.id}-tenuta-saldatura-sottovuoto-evento`,
      area: env.name,
      title: "Confezionatrice Sottovuoto a Doppia Barra e Verifica Tenuta Saldatura Buste Evento",
      question:
        "La macchina confezionatrice sottovuoto è provvista di doppia barra saldante integra, vacuometro tarato e viene effettuato il controllo quotidiano della tenuta della sigillatura delle buste destinate alla conservazione e trasferta per eventi?",
      normReference: "Reg. CE 852/2004 All. II Cap. V e Reg. CE 1935/2004 (MOCA)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Barra saldante della macchina sottovuoto usurata con perdita di vuoto nelle buste contenenti basi alimentari da trasferta.",
    });

    items.push({
      id: `${env.id}-protezioni-salvadita-affettatrici-cutter`,
      area: env.name,
      title: "Protezioni Salvadita e Dispositivi di Sicurezza su Affettatrici e Tagliaverdure (UNI EN 1974)",
      question:
        "L'affettatrice a gravità, il tagliaverdure e il cutter da laboratorio sono conformi alla norma UNI EN 1974 e UNI EN 12852, dotati di carter salvadita trasparente, pressamerce con impugnatura ergonomica, anello coprilama fisso e microinterruttori di blocco all'apertura?",
      normReference: "UNI EN 1974, UNI EN 12852 e D.Lgs. 81/2008 art. 71, All. V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Affettatrice o tagliaverdure con protezione salvadita smontata o microinterruttore di sicurezza bloccato.",
    });
  }

  // c) Area Dedicata Diete Speciali & Buffet Intolleranze
  if (env.id === "env-cat-diete-allergeni" || env.id.includes("cat-diete-allergeni")) {
    items.push({
      id: `${env.id}-utensili-codice-colore-celiachia-allergeni`,
      area: env.name,
      title: "Utensili Esclusivi con Codice Colore per Celiachia e Diete Speciali (Cross-Contact)",
      question:
        "La postazione dedicata alle diete speciali ed intolleranze dispone di un set completo ed esclusivo di taglieri, coltelli e contenitori identificati con codice colore (es. viola), impiegati unicamente per menu celiaci e allergeni al fine di azzerare il rischio di cross-contact (Reg. UE 1169/2011 e D.Lgs. 231/2017)?",
      normReference: "Reg. UE 1169/2011, D.Lgs. 231/2017 e Reg. CE 852/2004 All. II",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Uso promiscuo di stoviglie o taglieri tra preparazioni ordinarie e menu speciali per celiaci o soggetti allergici per eventi.",
    });

    items.push({
      id: `${env.id}-armadietto-chiuso-ingredienti-gluten-free`,
      area: env.name,
      title: "Armadietto Chiuso e Sigillato per Ingredienti e Semilavorati Gluten-Free",
      question:
        "Gli ingredienti, farine e prodotti specifici senza glutine e per diete speciali sono conservati in armadietto dedicato chiuso ad ante, al fine di evitare ogni contaminazione da polveri volatili di farina convenzionale?",
      normReference: "Reg. UE 1169/2011 art. 9 e Reg. CE 852/2004 Allegato II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Materie prime gluten-free stoccate su ripiani aperti a contatto con polveri di farina convenzionale o ingredienti con allergeni non sigillati.",
    });
  }

  // d) Celle Frigorifere Walk-in Deperibili & Cella Stoccaggio Eventi
  if (env.id === "env-cat-celle-frigo" || env.id.includes("cat-celle-frigo")) {
    items.push({
      id: `${env.id}-allarme-uomo-intrappolato-batteria-tampone`,
      area: env.name,
      title: "Allarme Uomo Intrappolato a 24V h24 con Batteria Tampone e Sblocco Interno (UNI EN 378)",
      question:
        "Le celle frigorifere walk-in sono dotate di dispositivo di apertura interna di sicurezza fluorescente/luminoso e di pulsante di allarme uomo intrappolato a 24V con segnalatore ottico-acustico esterno alimentato da batteria tampone a norma UNI EN 378?",
      normReference: "UNI EN 378-1/2 e D.Lgs. 81/2008 Allegato IV punto 1.11",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Allarme uomo intrappolato della cella frigorifera walk-in non funzionante o maniglia di sblocco interno fluorescente mancante.",
    });

    items.push({
      id: `${env.id}-monitoraggio-temperature-haccp-carrelli`,
      area: env.name,
      title: "Monitoraggio Temperature HACCP per Carni/Pesce (0-4°C) e Carrelli Buffet Pronti (0-3°C)",
      question:
        "Le celle frigorifere dispongono di teletermometri continui con display e allarmi di superamento soglia per il mantenimento dei deperibili (0-4°C) e della cella carrelli buffet pronti per il carico evento (0-3°C), con registrazione sistematica delle schede HACCP?",
      normReference: "Reg. CE 852/2004 All. II Cap. IX e Reg. CE 853/2004",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Mancata registrazione delle temperature delle celle o cella stoccaggio carrelli evento a temperatura superiore a +3°C.",
    });
  }

  // e) Magazzino Merci Secche & Beverage
  if (env.id === "env-cat-dispensa-dry" || env.id.includes("cat-dispensa-dry")) {
    items.push({
      id: `${env.id}-scaffali-sollevati-derattizzazione-beverage`,
      area: env.name,
      title: "Scaffalature Sollevate da Terra (≥ 15 cm) e Monitoraggio Pest Control Beverage",
      question:
        "Le scaffalature del magazzino merci secche e beverage sono metalliche, lavabili, sollevate dal pavimento di almeno 15 cm e distanziate dalle pareti per consentire ispezione e derattizzazione/pest control, con pedane plastiche lisce?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. III e D.Lgs. 81/2008 All. IV p.to 1.4",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Scatoloni di alimenti e bevande stoccati a diretto contatto con il pavimento o scaffali non distanziati da terra e pareti per il pest control.",
    });
  }

  // f) Magazzino Stoviglie, Tovagliato, Posateria & Attrezzature Noleggio
  if (env.id === "env-cat-deposito-noleggio" || env.id.includes("cat-deposito-noleggio")) {
    items.push({
      id: `${env.id}-integrita-sanificazione-ceste-stoviglie-antipolvere`,
      area: env.name,
      title: "Integrità e Sanificazione Ceste Bicchieri e Piatti con Coperture Antipolvere Sigillate",
      question:
        "Le stoviglie, i bicchieri lavati e sanificati e la posateria MOCA sono riposti in ceste sagomate protette da film plastico o coperture antipolvere sigillate, e il tovagliato stirato è conservato in sacchi protettivi chiusi fino al momento del carico per l'evento?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e Reg. CE 1935/2004 (MOCA)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Ceste con piatti e bicchieri sanificati lasciate aperte a contatto con polvere a magazzino o tovagliato esposto a sporcizia e umidità.",
    });

    items.push({
      id: `${env.id}-stabilita-scaffalature-porta-casse-noleggio`,
      area: env.name,
      title: "Stabilità Scaffalature Porta-Casse e Portata Certificata (UNI EN 15635)",
      question:
        "Le scaffalature industriali per lo stoccaggio delle casse stoviglie e carrelli sono ancorate saldamente alle pareti/pavimento, provviste di cartelli di portata massima ammissibile (UNI EN 15635) e prive di deformazioni strutturali sui montanti?",
      normReference: "UNI EN 15635 e D.Lgs. 81/2008 art. 71, Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Scaffalature porta-casse pesanti prive di cartelli di portata o montanti danneggiati con rischio crollo o ribaltamento.",
    });
  }

  // g) Deposito Arredi Mobili, Chafing Dish & Banchi Bar per Ricevimenti
  if (env.id === "env-cat-deposito-arredi" || env.id.includes("cat-deposito-arredi")) {
    items.push({
      id: `${env.id}-stoccaggio-sicuro-arredi-gazebi-ribaltamento`,
      area: env.name,
      title: "Stoccaggio Sicuro Arredi Mobili, Tavoli Buffet e Gazebi contro il Ribaltamento",
      question:
        "I tavoli tondi buffet, le sedie impilate, gli ombrelloni e i gazebi modulari sono stoccati su appositi carrelli o rastrelliere dotati di cinghie e barre di contenimento per prevenirne il ribaltamento accidentale e facilitare la movimentazione carichi?",
      normReference: "D.Lgs. 81/2008 art. 71, Titolo VI (MMC) e Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Sedie o tavoli da banqueting impilati in modo instabile ad altezze pericolose o gazebi privi di ritegno anticaduta.",
    });

    items.push({
      id: `${env.id}-bruciatori-gel-chafing-dish-spegnifiamma`,
      area: env.name,
      title: "Verifica Bruciatori, Gel Atossico per Chafing Dish e Dispositivi Spegnifiamma",
      question:
        "Gli scaldavivande chafing dish da buffet sono provvisti di bruciatori integri con coperchio spegnifiamma e viene impiegato esclusivamente gel combustibile atossico per buffet stoccato in armadietto di sicurezza lontano da fiamme e fonti di calore?",
      normReference: "D.Lgs. 81/2008 Titolo IX (Agenti Chimici), Allegato IV e D.M. 03/09/2021",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Barattoli di gel combustibile per chafing dish stoccati aperti, privi di scheda di sicurezza o scaldavivande privi di spegnifiamma.",
    });
  }

  // h) Baia di Carico/Scarico Furgoni Coibentati & Flotta Logistica
  if (env.id === "env-cat-banchina-carico" || env.id.includes("cat-banchina-carico")) {
    items.push({
      id: `${env.id}-portata-rampe-alluminio-mandorlato`,
      area: env.name,
      title: "Verifica Portata Rampe di Carico in Alluminio Mandorlato Antiscivolo",
      question:
        "Le rampe e pedane di carico mobili utilizzate per la movimentazione dei roll-container sui furgoni sono in alluminio mandorlato antiscivolo, con bordi laterali di contenimento, marcatura CE, portata certificata leggibile e blocco di sicurezza di aggancio al mezzo?",
      normReference: "D.Lgs. 81/2008 Allegato V punto 2.3 e Allegato VI",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Rampe di carico furgoni prive di superficie antiscivolo, deformate o usate senza blocco di sicurezza di appoggio al veicolo.",
    });

    items.push({
      id: `${env.id}-cavi-prese-industriali-cee-veicoli-atp`,
      area: env.name,
      title: "Prese Industriali CEE Stagne per Alimentazione Gruppi Frigoriferi ATP in Sosta",
      question:
        "La baia di carico dispone di prese industriali CEE con grado di protezione IP67 e quadro protetto da interruttore magnetotermico differenziale per l'alimentazione stazionaria dei gruppi frigoriferi dei furgoni ATP in sosta?",
      normReference: "Norma CEI 64-8 e D.Lgs. 81/2008 Titolo III Capo III",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Cavi elettrici prolunga volanti logorati o prese di alimentazione per i gruppi frigo ATP danneggiate e non stagne.",
    });

    items.push({
      id: `${env.id}-igiene-vani-carico-coibentati-atp`,
      area: env.name,
      title: "Igiene e Sanificazione Vani di Carico Coibentati dei Veicoli ATP e Contenitori Isotermici",
      question:
        "I vani di carico coibentati degli automezzi e i contenitori isotermici per il trasporto dei pasti all'evento sono sottoposti a lavaggio e disinfezione prima di ciascuna trasferta e i veicoli frigoriferi dispongono di attestato di omologazione ATP in corso di validità?",
      normReference: "Reg. CE 852/2004 All. II Cap. IV e Accordo ATP D.P.R. 29/05/1979 n. 404",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Vani di carico dei furgoni sporchi o trasporto alimenti deperibili effettuato su veicoli privi di certificato ATP in corso di validità.",
    });
  }

  // i) Plonge & Centrale Lavaggio Rientro Stoviglie Sporche da Eventi
  if (env.id === "env-cat-lavaggio-rientro" || env.id.includes("cat-lavaggio-rientro")) {
    items.push({
      id: `${env.id}-separazione-stoviglie-sporche-rientro-pulito`,
      area: env.name,
      title: "Separazione Fisica Percorso Stoviglie Sporche da Eventi rispetto al Pulito (Marcia in Avanti)",
      question:
        "La centrale di lavaggio rientro assicura una rigorosa separazione fisica e un flusso 'marcia in avanti' tra le stoviglie sporche di rientro dalle location esterne e le stoviglie pulite sanificate pronte per il reimballo, scongiurando ogni contaminazione incrociata?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II punto 1",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Contatto o incrocio tra ceste di piatti sporchi di rientro da eventi e stoviglie pulite in uscita dalla lavastoviglie.",
    });

    items.push({
      id: `${env.id}-cappa-aspirazione-vapori-lavastoviglie-rientro`,
      area: env.name,
      title: "Cappa d'Aspirazione Vapori su Lavastoviglie e Vasche di Sbarazzo",
      question:
        "Sopra la lavastoviglie industriale a capotta/tunnel e le vasche di sbarazzo è installata una cappa d'aspirazione vapori efficiente con espulsione all'esterno per impedire condense persistenti, muffe e vapori caldi nell'ambiente di lavoro?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.9 e Reg. CE 852/2004 All. II Cap. I",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Plonge di rientro priva di cappa di aspirazione vapori con condense persistenti a soffitto e sgocciolamento.",
    });

    items.push({
      id: `${env.id}-dispositivo-antiriflusso-uni-en-1717-lavaggio`,
      area: env.name,
      title: "Dispositivo di Disconnessione Idrica Antiriflusso (UNI EN 1717) su Lavastoviglie e Dosatori",
      question:
        "I collegamenti idrici della lavastoviglie industriale e dei doccioni di lavaggio sono equipaggiati con valvola di non ritorno o disconnettore idraulico a norma UNI EN 1717 per prevenire l'inquinamento della rete idropotabile da acque saponate o reflue?",
      normReference: "Norma UNI EN 1717, D.Lgs. 18/2023 e Reg. CE 852/2004 All. II Cap. VII",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Assenza di disconnettore antiriflusso conforme UNI EN 1717 sulla linea idrica di alimentazione della lavastoviglie industriale.",
    });
  }

  // j) Locale / Area Esterna Stoccaggio Bombole GPL per Cucina da Campo
  if (env.id === "env-cat-deposito-gpl" || env.id.includes("cat-deposito-gpl")) {
    items.push({
      id: `${env.id}-catenelle-metalliche-anticaduta-bombole-gpl`,
      area: env.name,
      title: "Catenelle Metalliche Anticaduta per Bombole GPL Piene e Vuote (UNI 7131)",
      question:
        "Le bombole GPL per le cucine mobili da campo sono stoccate in posizione verticale in gabbia metallica areata, assicurate singolarmente con catenelle o collari antiribaltamento e con netta separazione tra bombole piene e vuote?",
      normReference: "Norma UNI 7131, D.Lgs. 81/2008 art. 71, Allegato IV punto 4 e Allegato V",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Bombole GPL mobili lasciate libere prive di catenella anticaduta o stoccate in orizzontale.",
    });

    items.push({
      id: `${env.id}-ventilazione-naturale-permanente-gpl-esterno`,
      area: env.name,
      title: "Ventilazione Naturale Permanente all'Aperto e Distanza da Cantine e Caditoie",
      question:
        "L'area di stoccaggio delle bombole GPL è all'aperto in gabbia metallica grigliata o in vano con aperture permanenti di ventilazione naturale a filo pavimento e a soffitto, distante da pozzetti fognari, caditoie e scantinati?",
      normReference: "D.M. 08/11/2019, UNI 7131 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Deposito bombole GPL situato in locale privo di ventilazione permanente o in prossimità di caditoie fognarie.",
    });

    items.push({
      id: `${env.id}-estintore-polvere-34a-233b-deposito-gpl`,
      area: env.name,
      title: "Presenza di Estintore a Polvere Omologato (Classe 34A 233B C) Pronto all'Uso",
      question:
        "In prossimità immediata del deposito bombole GPL è presente almeno un estintore a polvere idoneo per fuochi di gas (classi A-B-C, minimo 34A 233B), chiaramente segnalato e con revisione periodica semestrale in corso di validità?",
      normReference: "D.M. 03/09/2021, D.Lgs. 81/2008 art. 46 e UNI 9994-1",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Deposito bombole GPL privo di estintore a polvere nelle immediate vicinanze o con estintore scaduto di revisione.",
    });

    items.push({
      id: `${env.id}-scadenza-tubi-flessibili-uni-7140-gpl`,
      area: env.name,
      title: "Controllo Data di Scadenza dei Tubi Flessibili in Gomma (UNI 7140)",
      question:
        "Tutti i tubi flessibili per il collegamento delle bombole GPL ai bruciatori mobili sono conformi a norma UNI 7140 (o metallici UNI EN 14800), con data di scadenza stampigliata non superata (max 5 anni), privi di screpolature e serrati con fascette adeguate?",
      normReference: "Norma UNI 7140, UNI 7131 e D.Lgs. 81/2008 Allegato V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Tubi in gomma per bombole GPL con data di scadenza superata o fessurazioni da invecchiamento.",
    });
  }

  // k) Ufficio Pianificazione Eventi, Banqueting & Spedizioni
  if (env.id === "env-cat-ufficio-logistica" || env.id.includes("cat-ufficio-logistica")) {
    items.push({
      id: `${env.id}-ergonomia-postazioni-vdt-logistica`,
      area: env.name,
      title: "Ergonomia delle Postazioni Videoterminale e Regolazione Sedute (All. XXXIV D.Lgs. 81/08)",
      question:
        "Le postazioni dell'ufficio pianificazione eventi e logistica sono conformi al Titolo VII D.Lgs. 81/2008, con schermi orientabili privi di riflessi molesti, sedute ergonomiche regolabili e cablaggi elettrici protetti contro il rischio inciampo?",
      normReference: "D.Lgs. 81/2008 Titolo VII e Allegato XXXIV",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Postazioni VDT con sedie non ergonomiche o cavi elettrici volanti lungo le vie di transito dell'ufficio.",
    });

    items.push({
      id: `${env.id}-tracciabilita-lotti-schede-allergeni-commesse`,
      area: env.name,
      title: "Tracciabilità Lotti Alimentari e Schede Allergeni Menu per Ciascun Evento",
      question:
        "L'ufficio pianificazione gestisce e conserva i fogli di viaggio con la tracciabilità dei lotti alimentari utilizzati per ogni evento (Reg. CE 178/2002) e il fascicolo delle schede allergeni/ingredienti dei menu fornito ai clienti e committenti (Reg. UE 1169/2011 e D.Lgs. 231/2017)?",
      normReference: "Reg. CE 178/2002 art. 18, Reg. UE 1169/2011 e D.Lgs. 231/2017",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancata registrazione della tracciabilità lotti per i banchetti o schede allergeni non trasmesse/conservate per gli eventi serviti.",
    });
  }

  // ============================================================================
  // 15. Requisiti Specifici Food Truck & Ristorazione Ambulante (ATECO 56.10.42 / 56.10.4)
  // ============================================================================

  // a) Vano Operativo di Cottura & Piastre Food Truck
  if (env.id === "env-ft-vano-cottura" || env.id.includes("ft-vano-cottura")) {
    items.push({
      id: `${env.id}-cappa-aspirazione-labirinto-tetto`,
      area: env.name,
      title: "Cappa Aspirazione a Tetto con Filtri a Labirinto Inox e Comignolo Antivento (UNI EN 16282)",
      question:
        "Il vano cottura del food truck è provvisto di cappa aspirante in acciaio inox posizionata sopra piastre e friggitrice, dotata di filtri a labirinto antigrasso asportabili e scarico fumi canalizzato a tetto con comignolo antivento idoneo?",
      normReference: "Reg. CE 852/2004 All. II Cap. III e D.Lgs. 81/2008 Allegato IV punto 1.9",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Cappa aspirazione priva di scarico a tetto o filtri antigrasso intasati/assenti nel vano cottura del food truck.",
    });

    items.push({
      id: `${env.id}-paraspruzzi-blocco-grassi-friggitrice-piastra`,
      area: env.name,
      title: "Paraspruzzi Inox e Protezioni Antiscottatura su Friggitrice e Fry-Top",
      question:
        "La friggitrice e le piastre fry-top sono equipaggiate con paraspruzzi perimetrali in acciaio inox, coperchio di chiusura da trasporto, termostato di sicurezza a riarmo e dispositivi per prevenire schizzi d'olio bollente durante il lavoro e le manovre?",
      normReference: "D.Lgs. 81/2008 art. 71, Allegato V e VI",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Friggitrice o piastra fry-top prive di paraspruzzi o con termostato di sicurezza bypassato a bordo veicolo.",
    });

    items.push({
      id: `${env.id}-lavamani-ginocchio-acqua-calda-sapone`,
      area: env.name,
      title: "Lavamani a Comando non Manuale a Ginocchio con Acqua Calda Sanitaria e Dosatori a Perdere",
      question:
        "Nel vano cottura è presente un lavello lavamani dedicato con comando a ginocchio/pedale, alimentato con acqua calda e fredda miscelata, distributore di sapone liquido e carta monouso a perdere con cestino a pedale?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo III punto 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavamani a bordo privo di comando non manuale, erogatore d'acqua calda non funzionante o assenza di salviette a perdere.",
    });

    items.push({
      id: `${env.id}-pareti-inox-sanificabili-pavimento-antiscivolo`,
      area: env.name,
      title: "Rivestimento Pareti in Acciaio Inox AISI 304 Lavabili e Pavimento Antiscivolo R11",
      question:
        "Le pareti del vano cottura sono rivestite in acciaio inox AISI 304 satinato lavabile e sanificabile fino al soffitto (o almeno 2m) e la pavimentazione del furgone è impermeabile, antiscivolo (R11) e raccordata con sgusce perimetrali per il drenaggio?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. II e D.Lgs. 81/2008 Allegato IV punto 1.3",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Pareti del vano cottura non sanificabili o pavimento del food truck sdrucciolevole privo di sgusce di pulizia.",
    });
  }

  // b) Banco di Somministrazione, Cassa & Vetrina Parafiato Clienti
  if (env.id === "env-ft-banco-somministrazione" || env.id.includes("ft-banco-somministrazione")) {
    items.push({
      id: `${env.id}-fermo-meccanico-portellone-laterale`,
      area: env.name,
      title: "Fermo Meccanico di Sicurezza Portellone Panoramico Anti-Chiusura Accidentale",
      question:
        "Il portellone laterale ribaltabile ad apertura verso l'alto è provvisto, oltre ai pistoni a gas di sollevamento, di un perno o asta di fermo meccanico di sicurezza per impedirne la chiusura accidentale dovuta a raffiche di vento o cedimento idraulico?",
      normReference: "D.Lgs. 81/2008 Allegato V punto 1.3 e Allegato IV punto 1.6",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Portellone laterale del food truck sprovvisto di blocco meccanico anticaduta o con pistoni a gas usurati.",
    });

    items.push({
      id: `${env.id}-vetrina-parafiato-igienico-curvo`,
      area: env.name,
      title: "Vetrina Refrigerata Parafiato Curvo Igienico Antiaerosol per Protezione Alimenti",
      question:
        "Il banco di somministrazione al pubblico è dotato di vetrina espositiva refrigerata (+4°C) provvista di schermo parafiato in cristallo o policarbonato trasparente curvo per proteggere gli alimenti esposti da goccioline aerosol e contaminazioni dei clienti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo III punto 1 e Allegato II Capitolo IX",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Alimenti pronti esposti al pubblico senza idoneo schermo parafiato o vetrina refrigerata non funzionante.",
    });

    items.push({
      id: `${env.id}-estintore-polvere-coperta-antifiamma-banco`,
      area: env.name,
      title: "Estintore Omologato 34A 233B + Classe F e Coperta Antifiamma a Portata Immediata",
      question:
        "Presso il banco di somministrazione/cottura è posizionato un estintore a polvere omologato (o polivalente con classe F per fuochi da olio/grassi vegetali) con revisione valida e una coperta antifiamma a pronto prelievo?",
      normReference: "D.M. 03/09/2021, D.Lgs. 81/2008 art. 46 e D.M. 10/03/1998",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Assenza di estintore idoneo classe F o coperta antifiamma ad accesso immediato presso la postazione food truck.",
    });
  }

  // c) Vano Frigoriferi & Stoccaggio Deperibili a Bordo (Positivo/Negativo)
  if (env.id === "env-ft-vano-refrigerazione" || env.id.includes("ft-vano-refrigerazione")) {
    items.push({
      id: `${env.id}-blocco-meccanico-apertura-frigo-curva`,
      area: env.name,
      title: "Blocco Meccanico a Scatto e Chiavistelli Anti-Apertura Ante/Cassetti Frigo in Curva",
      question:
        "Tutti i banchi frigo, cassetti e armadi freezer a bordo del veicolo sono equipaggiati con chiusure di sicurezza a scatto o chiavistelli meccanici di blocco per impedire l'apertura accidentale durante il trasporto e la marcia su strada?",
      normReference: "D.Lgs. 81/2008 Allegato V e Codice della Strada art. 164",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Cassetti o ante frigorifere del furgone prive di fermo meccanico da viaggio con rischio caduta merci durante la guida.",
    });

    items.push({
      id: `${env.id}-registrazione-continua-temperature-haccp-frigo`,
      area: env.name,
      title: "Monitoraggio e Registrazione Continua Temperature HACCP (Carni/Latticini +2/+4°C, Freezer -18°C)",
      question:
        "I frigoriferi e i congelatori a bordo dispongono di teletermometri o data-logger a display visibile con controllo e registrazione quotidiana delle temperature (0/+4°C per carni e formaggi, ≤-18°C per surgelati) sia durante la somministrazione che nel trasporto?",
      normReference: "Reg. CE 852/2004 All. II Cap. IX e Reg. CE 37/2005",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancata rilevazione delle temperature frigorifere a bordo o display termometrico guasto con rischio rottura della catena del freddo.",
    });
  }

  // d) Vano Tecnico Bombole GPL del Veicolo (Isolato ed Areato Esterno)
  if (env.id === "env-ft-vano-bombole-gpl" || env.id.includes("ft-vano-bombole-gpl")) {
    items.push({
      id: `${env.id}-tenuta-stagna-abitacolo-griglie-aerazione-pavimento`,
      area: env.name,
      title: "Isolamento Ermetico verso l'Abitacolo e Griglie di Aerazione Permanente a Pavimento verso l'Esterno",
      question:
        "Il vano contenente le bombole GPL è a tenuta stagna rispetto al vano abitacolo/cucina, accessibile solo dall'esterno (o con portello a guarnizione ermetica), e dotato di aperture permanenti di ventilazione naturale a filo pavimento verso l'esterno?",
      normReference: "Norma UNI 7131, UNI EN 1949 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Vano bombole GPL non isolato ermeticamente dall'abitacolo o privo di feritoie di sfiato a pavimento verso l'esterno.",
    });

    items.push({
      id: `${env.id}-catenelle-metalliche-anticaduta-bombole-gpl`,
      area: env.name,
      title: "Fissaggio Bombole GPL con Doppie Catenelle Metalliche o Cinghie Anticaduta Certificate",
      question:
        "Le bombole di GPL sono saldamente ancorate alla struttura del veicolo in posizione rigorosamente verticale mediante doppie catenelle metalliche o staffe a sgancio rapido conformi, impedendone qualsiasi movimento durante il tragitto?",
      normReference: "Norma UNI EN 1949, UNI 7131 e D.Lgs. 81/2008 Allegato IV punto 1",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Bombole GPL non ancorate in verticale o prive di staffe/catenelle metalliche di sicurezza nel veicolo.",
    });

    items.push({
      id: `${env.id}-centralina-rilevatore-gas-12v-elettrovalvola-nc`,
      area: env.name,
      title: "Centralina Rilevatore Fughe Gas a 12V con Elettrovalvola Esterna Normalmente Chiusa",
      question:
        "È installato un sistema di rilevazione fughe GPL funzionante a 12V collegato a un'elettrovalvola di sicurezza esterna normalmente chiusa con riarmo manuale, tarata per intercettare ed interrompere istantaneamente il flusso di gas in caso di perdita?",
      normReference: "Norma CEI EN 50194, UNI EN 1949 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Rilevatore fughe GPL assente o non collegato a elettrovalvola automatica di intercettazione gas sul circuito.",
    });

    items.push({
      id: `${env.id}-scadenza-tubi-flessibili-uni-7140-crash-sensor`,
      area: env.name,
      title: "Tubi Flessibili a Norma UNI 7140 in Scadenza e Regolatore di Pressione con Crash-Sensor",
      question:
        "I tubi flessibili di raccordo in gomma per GPL sono a norma UNI 7140 (o metallici UNI EN 14800) con data di scadenza (max 5 anni) non superata, e il riduttore di pressione è provvisto di valvola di sicurezza da impatto (crash-sensor) per il blocco del gas?",
      normReference: "Norma UNI 7140, UNI EN 1949 e D.Lgs. 81/2008 Allegato V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Tubi flessibili GPL con data di scadenza superata o regolatore di pressione sprovvisto di crash-sensor.",
    });
  }

  // e) Vano Generatore Elettrico Ausiliario & Quadro Tecnico
  if (env.id === "env-ft-vano-generatore" || env.id.includes("ft-vano-generatore")) {
    items.push({
      id: `${env.id}-scarico-fumi-tetto-generatore-ausiliario`,
      area: env.name,
      title: "Evacuazione Fumi di Scarico all'Esterno a Tetto senza Rientri nell'Abitacolo",
      question:
        "Il tubo di scarico dei gas di combustione del generatore a motore endotermico è coibentato termicamente, convogliato all'esterno oltre la sagoma del tetto con silenziatore e comignolo, senza rischio di infiltrazione di monossido di carbonio (CO) nel laboratorio?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.9 e punto 2.1",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Scarico del generatore non canalizzato all'esterno con potenziale accumulo di gas di scarico/CO nel food truck.",
    });

    items.push({
      id: `${env.id}-salvavita-differenziale-30ma-quadro-veicolo`,
      area: env.name,
      title: "Efficienza Interruttore Differenziale Salvavita da 30 mA e Quadro Generale di Bordo",
      question:
        "Il quadro elettrico principale a valle del generatore e della presa di terra esterna è equipaggiato con interruttore magnetotermico differenziale ad alta sensibilità (≤ 30 mA) verificato periodicamente con tasto di prova 'T'?",
      normReference: "Norma CEI 64-8/7 sez. 717, D.Lgs. 81/2008 art. 80 e 84",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Differenziale salvavita non funzionante o quadro elettrico veicolare privo di protezione differenziale da 30 mA.",
    });
  }

  // f) Centrale Idrica Mobile (Serbatoi Acqua Potabile & Acque Grigie)
  if (env.id === "env-ft-impianto-idrico" || env.id.includes("ft-impianto-idrico")) {
    items.push({
      id: `${env.id}-certificazione-moca-serbatoio-pompa-acqua-potabile`,
      area: env.name,
      title: "Certificazione Atossica MOCA Serbatoio Acqua Potabile e Pompa Autoclave (Reg. CE 1935/2004)",
      question:
        "Il serbatoio dell'acqua potabile (almeno 100 litri) e la pompa autoclave sono realizzati con materiali per contatto alimentare conformi al Reg. CE 1935/2004 (MOCA), con programma periodico di sanificazione e disinfezione con prodotti a base di cloro registrato?",
      normReference: "Reg. CE 852/2004 All. II Cap. VII e Reg. CE 1935/2004 (MOCA)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Serbatoio acqua privo di idoneità MOCA per uso potabile o assenza di piano di sanificazione periodica antilegionella/antibiocoltura.",
    });

    items.push({
      id: `${env.id}-boiler-acqua-calda-sanitaria-funzionamento`,
      area: env.name,
      title: "Efficienza Boiler Elettrico Acqua Calda Sanitaria (45-50°C)",
      question:
        "Il boiler elettrico compatto dedicato alla produzione di acqua calda per il lavamani e il lavello di servizio è perfettamente funzionante, collegato idraulicamente e garantisce l'erogazione costante a 45-50°C per un corretto lavaggio igienico delle mani?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo III punto 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancata erogazione di acqua calda sanitaria dal boiler di bordo durante le fasi di preparazione e somministrazione.",
    });

    items.push({
      id: `${env.id}-tenuta-serbatoio-acque-grigie-valvola-saracinesca`,
      area: env.name,
      title: "Tenuta Ermetica Serbatoio Acque Grigie di Recupero con Valvola Saracinesca Carrabile",
      question:
        "Il serbatoio di recupero delle acque reflue/grigie di lavaggio ha capienza almeno pari al serbatoio di carico, è provvisto di sfiato con filtro antiodore e saracinesca stagna di chiusura priva di perdite o gocciolamenti a terra durante la sosta e il transito?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. III e D.Lgs. 152/2006 art. 101",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Serbatoio acque grigie con valvola di scarico trafilante o perdite di liquami reflui sul suolo pubblico.",
    });
  }

  // g) Cabina di Guida del Furgone / Autocarro Allestito
  if (env.id === "env-ft-cabina-guida" || env.id.includes("ft-cabina-guida")) {
    items.push({
      id: `${env.id}-paratia-divisoria-fissa-sicurezza-cucina`,
      area: env.name,
      title: "Paratia Divisoria Fissa di Sicurezza tra Cabina di Guida e Laboratorio Posteriore",
      question:
        "Tra i sedili della cabina di guida e il laboratorio/cucina posteriore è installata una paratia divisoria rigida di sicurezza anti-intrusione omologata a protezione dell'autista da spostamento merci, utensili o schizzi in caso di brusca frenata?",
      normReference: "D.Lgs. 81/2008 art. 71 e Codice della Strada art. 164",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Paratia divisoria tra cabina di guida e vano cucina assente o priva di fissaggio strutturale conforme.",
    });

    items.push({
      id: `${env.id}-estintore-veicolare-polvere-cabina`,
      area: env.name,
      title: "Presenza di Estintore Veicolare Omologato da 2 kg in Cabina di Guida",
      question:
        "Nella cabina di guida del veicolo è alloggiato con staffa a sgancio rapido un estintore a polvere omologato da 2 kg con manometro in pressione e revisione semestrale in corso di validità?",
      normReference: "D.M. 03/09/2021, D.Lgs. 81/2008 art. 46 e Codice della Strada",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Estintore in cabina di guida assente, non fissato saldamente o con revisione periodica scaduta.",
    });
  }

  // h) Hangar / Area Rimessaggio Coperto del Veicolo & Ricarica Notturna
  if (env.id === "env-ft-deposito-rimessaggio" || env.id.includes("ft-deposito-rimessaggio")) {
    items.push({
      id: `${env.id}-colonnina-ricarica-notturna-norma-cei`,
      area: env.name,
      title: "Colonnina di Allacciamento Elettrico Notturno a Norma CEI per Gruppi Frigo a Bordo",
      question:
        "L'area coperta di rimessaggio dispone di presa industriale CEE stagna a norma CEI con linea dedicata e salvavita differenziale per consentire il mantenimento sotto tensione dei frigoriferi del veicolo a motore spento durante la notte?",
      normReference: "Norma CEI 64-8 e D.Lgs. 81/2008 Titolo III Capo III",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Allaccio elettrico notturno per il furgone realizzato con prolunghe precarie o sprovvisto di presa industriale protetta.",
    });

    items.push({
      id: `${env.id}-estintori-carrellati-rimessaggio-vie-fuga`,
      area: env.name,
      title: "Dotazione Antincendio con Estintori Carrellati e Corsie di Manovra Libere nell'Hangar",
      question:
        "Nell'hangar di rimessaggio dei mezzi le vie di manovra e le uscite carrabili sono tenute costantemente sgombre da ostacoli ed è presente almeno un estintore carrellato o portatile 34A 233B adeguatamente segnalato?",
      normReference: "D.M. 03/09/2021 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Vie di transito del rimessaggio ostruite o presidi antincendio non segnalati e inaccessibili.",
    });
  }

  // i) Piazzale di Carico Merci, Rifornimento Acqua & Scarico Acque Grigie
  if (env.id === "env-ft-area-carico-scarico" || env.id.includes("ft-area-carico-scarico")) {
    items.push({
      id: `${env.id}-pozzetto-scarico-acque-grigie-autorizzato`,
      area: env.name,
      title: "Scarico Acque Grigie Esclusivamente in Pozzetto Fognario Autorizzato (Divieto Sversamento a Terra)",
      question:
        "Lo svuotamento del serbatoio delle acque grigie avviene esclusivamente tramite raccordi stagni in apposito pozzetto fognario carrabile autorizzato presso la sede o camper service autorizzati, con divieto assoluto di sversamento su pubblica via o caditoie stradali?",
      normReference: "D.Lgs. 152/2006 art. 101, art. 137 e Reg. CE 852/2004 Allegato II Cap. III",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Scaricamento delle acque grigie in tombini stradali di acque bianche o sul suolo in violazione del D.Lgs. 152/2006.",
    });

    items.push({
      id: `${env.id}-rifornimento-acqua-potabile-canna-moca-antiriflusso`,
      area: env.name,
      title: "Punto Rifornimento Acqua Potabile con Canna Alimentare MOCA e Valvola Antiriflusso UNI EN 1717",
      question:
        "Il punto di carico dell'acqua potabile per il furgone è provvisto di rubinetto con valvola di non ritorno antiriflusso conforme UNI EN 1717 e tubazione flessibile alimentare sanificata e dotata di raccordi protetti da tappi antipolvere?",
      normReference: "Norma UNI EN 1717, D.Lgs. 18/2023 (acque potabili) e Reg. CE 852/2004",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Canna di rifornimento acqua non per alimenti o priva di protezione antiriflusso contro inquinamento della rete idrica.",
    });
  }

  // j) Magazzino Secco & Packaging Monouso / MOCA di Sede
  if (env.id === "env-ft-magazzino-scorte" || env.id.includes("ft-magazzino-scorte")) {
    items.push({
      id: `${env.id}-conformita-moca-packaging-street-food`,
      area: env.name,
      title: "Dichiarazioni di Conformità MOCA Packaging Monouso (Reg. CE 1935/2004 e Reg. UE 10/2011)",
      question:
        "Tutti i materiali monouso a contatto con alimenti (vaschette da asporto, coni fritti, bicchieri, posate e carte oleate) dispongono della dichiarazione di conformità MOCA del fabbricante conservata agli atti e sono stoccati al riparo da polvere e umidità?",
      normReference: "Reg. CE 1935/2004, Reg. UE 10/2011 e D.Lgs. 29/2017",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Packaging monouso per street food privo di dichiarazione di conformità MOCA o stoccato in ambienti polverosi.",
    });

    items.push({
      id: `${env.id}-stoccaggio-rialzato-scaffali-scorte`,
      area: env.name,
      title: "Stoccaggio Merci e Packaging su Scaffalature Rialzate ≥ 15 cm da Terra",
      question:
        "Tutte le scatole di imballaggi, bibite e alimenti non deperibili sono collocate su scaffalature metalliche o pedane sollevate di almeno 15 cm dal pavimento per consentire la pulizia e il monitoraggio da infestanti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 2 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Cartoni di packaging o alimenti appoggiati direttamente sul pavimento del magazzino scorte.",
    });
  }

  // k) Laboratorio Base / Plonge di Sanificazione e Preparazione Linee
  if (env.id === "env-ft-laboratorio-base" || env.id.includes("ft-laboratorio-base")) {
    items.push({
      id: `${env.id}-plonge-sanificazione-attrezzature-rientro`,
      area: env.name,
      title: "Vasca Lavello Inox Gigante per Sanificazione Attrezzature e Piastre di Rientro dal Servizio",
      question:
        "Il laboratorio di base dispone di un lavello plonge di dimensioni adeguate in acciaio inox per il lavaggio e la sanificazione approfondita di teglie, piastre fry-top smontabili e attrezzature al rientro dall'evento itinerante?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II punto 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Assenza di vasca di lavaggio adatta alla sanificazione delle attrezzature voluminose di rientro dal food truck.",
    });

    items.push({
      id: `${env.id}-cappa-aspirazione-laboratorio-base`,
      area: env.name,
      title: "Cappa di Aspirazione Fumi ed Impianto di Ricambio d'Aria nel Laboratorio Base",
      question:
        "Il laboratorio di preparazione linee è equipaggiato con cappa d'aspirazione fumi e vapori canalizzata all'esterno, pareti con rivestimento impermeabile e lavabile fino a 2 metri e pavimento antiscivolo con canalina di scolo?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.3 e 1.9, Reg. CE 852/2004 All. II Cap. II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Laboratorio base privo di aspirazione fumi o con pareti degradate non sanificabili.",
    });
  }

  // l) Spogliatoio e Servizi Igienici Personale presso la Sede Operativa
  if (env.id === "env-ft-spogliatoi-sede" || env.id.includes("ft-spogliatoi-sede")) {
    items.push({
      id: `${env.id}-armadietti-doppio-scomparto-spogliatoio-sede`,
      area: env.name,
      title: "Armadietti Individuali a Doppio Scomparto Sporco/Pulito per Personale Food Truck",
      question:
        "Lo spogliatoio della sede dispone di armadietti metallici individuali lavabili a doppio scomparto per la separazione netta tra abiti civili e divise da lavoro/cucina intrise di grassi o fumi?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.12 e Reg. CE 852/2004 Allegato II Cap. I",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Spogliatoio privo di armadietti a doppio scomparto per il personale di cucina e vendita del food truck.",
    });

    items.push({
      id: `${env.id}-lavamani-antibagno-sede`,
      area: env.name,
      title: "Servizi Igienici con Antibagno e Lavamani a Comando non Manuale nella Sede",
      question:
        "I servizi igienici della sede sono preceduti da idoneo antibagno provvisto di lavamani ad azionamento non manuale (a ginocchio, pedale o fotocellula), sapone liquido antibatterico e asciugamani a perdere?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 3 e 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Wc senza antibagno o lavamani con rubinetto a vite manuale nei servizi igienici della sede.",
    });
  }

  // 12. Regole e Requisiti per Gelateria e Pasticceria Ambulante (56.10.41 / 56.10.4)
  // a) Vano Operativo Banco Pozzetti Gelato & Porzionatura Veicolare
  if (env.id === "env-gelamb-banco-veicolare" || env.id.includes("gelamb-banco-veicolare")) {
    items.push({
      id: `${env.id}-temperatura-pozzetti-carapine-glicole`,
      area: env.name,
      title: "Mantenimento Temperatura Pozzetti a Glicole (-12°C / -14°C) per Porzionatura Gelato",
      question:
        "Il banco a pozzetti a glicole del veicolo mantiene costantemente la temperatura di servizio tra -12°C e -14°C verificata con termometro digitale ben visibile all'operatore, garantendo la consistenza idonea e la sicurezza igienico-sanitaria del gelato?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. IX e Reg. CE 37/2005",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Temperatura del banco pozzetti veicolare non conforme (> -12°C) o display termometrico guasto con rischio fusione e proliferazione microbiologica nel gelato.",
    });

    items.push({
      id: `${env.id}-lavaporzionatore-flusso-continuo-sanificante`,
      area: env.name,
      title: "Lavaporzionatore a Flusso Continuo d'Acqua o Vaschetta con Acqua Sanificante Rinnovata",
      question:
        "Il lavaporzionatore per palette e dosatori di gelato a bordo è alimentato a flusso d'acqua continuo a perdere oppure, se a pozzetto statico, l'acqua viene addizionata con disinfettante alimentare idoneo e rinnovata frequentemente ad ogni turno operativo?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V punto 1",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavaporzionatore con acqua stagnante non rinnovata o privo di sanificante a bordo con rischio contaminazione crociata microbica e da allergeni tra gusti.",
    });

    items.push({
      id: `${env.id}-vetrina-parafiato-curvo-antiaerosol`,
      area: env.name,
      title: "Vetrina Parafiato Igienico Curvo Antiaerosol per Protezione Pozzetti e Clienti",
      question:
        "La postazione di porzionatura e somministrazione verso il pubblico è protetta da vetrata parafiato curva trasparente e igienica di altezza idonea per isolare le carapine da polveri stradali e goccioline aerosol dei clienti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo III punto 1 e 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Vetrina parafiato assente, danneggiata o di altezza insufficiente a proteggere le carapine del gelato e le cialde dalle contaminazioni esterne dei clienti.",
    });

    items.push({
      id: `${env.id}-fermo-meccanico-portellone-veicolare`,
      area: env.name,
      title: "Portellone Panoramico Veicolare con Pistoni Idraulici e Fermo Meccanico Anticaduta",
      question:
        "Il portellone panoramico sollevabile del veicolo dispone di pistoni idraulici/a gas in piena efficienza e di perno/asta di fermo meccanico di sicurezza anticaduta per prevenire la discesa improvvisa dovuta a folate di vento o cedimento della pressione?",
      normReference: "D.Lgs. 81/2008 Allegato V punto 1 e art. 71",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Portellone panoramico del furgone/ape car privo di blocco meccanico anticaduta o con pistoni a gas usurati con pericolo di schiacciamento dell'operatore.",
    });

    items.push({
      id: `${env.id}-lavamani-comando-non-manuale-acqua-calda`,
      area: env.name,
      title: "Lavamani a Bordo Veicolo con Comando a Ginocchio, Acqua Calda Sanitaria ed Erogatori",
      question:
        "Il vano banco del veicolo dispone di lavamani autonomo in acciaio inox con comando ad azionamento non manuale (a ginocchio o pedale), boiler per acqua calda sanitaria, erogatore di sapone antibatterico e asciugamani a perdere?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4 e Cap. III",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavamani a bordo veicolo privo di comando a ginocchio, mancante di acqua calda sanitaria o sprovvisto di sapone antibatterico e salviette monouso.",
    });
  }

  // b) Zona Piastre Crêpes, Waffle & Farciture Calde a Bordo
  if (env.id === "env-ft-crepes-waffle" || env.id.includes("ft-crepes-waffle") || env.id.includes("crepes-waffle")) {
    items.push({
      id: `${env.id}-piastre-ghisa-moca-certificazione`,
      area: env.name,
      title: "Piastre per Crêpes e Waffle in Ghisa Alimentare Certificata MOCA",
      question:
        "Le piastre per crêpes e le piastre da cialde/waffle a bordo sono realizzate in ghisa alimentare o rivestimenti antiaderenti certificati conformi MOCA, mantenute prive di scrostature, ruggine o residui carbonizzati?",
      normReference: "Reg. CE 1935/2004 e D.M. 21/03/1973 (Materiali ed Oggetti a Contatto con Alimenti)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Piastre per crêpes/waffle usurate o prive di attestato di conformità MOCA con rischio cessione di composti nocivi agli alimenti cotti.",
    });

    items.push({
      id: `${env.id}-paraspruzzi-inox-perimetrale`,
      area: env.name,
      title: "Paraspruzzi Inox Perimetrale di Protezione contro Contatti Termici e Ustioni Operatore",
      question:
        "Il piano di lavoro delle piastre è provvisto di paraspruzzi perimetrali in acciaio inox per isolare le superfici ad alta temperatura (200-250°C), prevenendo schizzi di pastella bollente e contatti termici accidentali dell'operatore a bordo?",
      normReference: "D.Lgs. 81/2008 Allegato V punto 6 (Rischio termico e ustioni)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Assenza di paratie o paraspruzzi perimetrali in acciaio inox attorno alle piastre calde con pericolo ustione per il personale a bordo.",
    });

    items.push({
      id: `${env.id}-cappa-aspirazione-scarico-tetto`,
      area: env.name,
      title: "Cappa di Aspirazione Inox con Filtri a Labirinto e Scarico Fumi Canalizzato a Tetto",
      question:
        "La zona piastre crêpes e scaldatopping a bordo veicolo è dotata di cappa aspirante in acciaio inox con filtri a labirinto asportabili e condotto di espulsione fumi e vapori canalizzato all'esterno a tetto con comignolo antivento?",
      normReference: "Reg. CE 852/2004 All. II Cap. III e D.Lgs. 81/2008 Allegato IV punto 1.9",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Cappa di aspirazione fumi piastre priva di scarico canalizzato a tetto o filtri antigrasso intasati all'interno dell'abitacolo operativo.",
    });
  }

  // c) Vano Tecnico Batterie Litio, Inverter & Quadro CEE Veicolare
  if (env.id === "env-gelamb-vano-tecnico-batterie" || env.id.includes("gelamb-vano-tecnico-batterie")) {
    items.push({
      id: `${env.id}-batterie-litio-bms-ventilazione`,
      area: env.name,
      title: "Pacco Batterie Litio LiFePO4 con BMS di Controllo Termico e Vano Areato",
      question:
        "Il pacco batterie di accumulo LiFePO4 per l'alimentazione in marcia dei pozzetti a glicole è alloggiato in vano tecnico dedicato con griglie di aerazione, sensore di temperatura e sistema BMS con distacco automatico in caso di surriscaldamento?",
      normReference: "D.Lgs. 81/2008 art. 80 e CEI EN 62619 (Sicurezza accumulatori litio industriali)",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Pacco batterie litio privo di BMS con allarmi termici o vano batterie privo di ventilazione con pericolo surriscaldamento a bordo veicolo.",
    });

    items.push({
      id: `${env.id}-salvavita-30ma-inverter-quadro-cee`,
      area: env.name,
      title: "Interruttore Differenziale Salvavita 30 mA su Inverter e Presa CEE Esterna di Rete",
      question:
        "Il quadro elettrico veicolare è protetto da interruttore differenziale (salvavita) ad alta sensibilità da 30 mA sia durante l'alimentazione tramite inverter 230V che durante l'allaccio alla colonnina CEE esterna?",
      normReference: "Norma CEI 64-8 sez. 717 e D.Lgs. 81/2008 Titolo III Capo III",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Quadro elettrico del veicolo privo di interruttore differenziale salvavita 30 mA efficiente a monte delle linee di alimentazione frigoriferi e piastre.",
    });
  }

  // d) Centrale Idrica Veicolare (Acqua Potabile, Boiler & Lavaporzionatore)
  if (env.id === "env-gelamb-centrale-idrica" || env.id.includes("gelamb-centrale-idrica")) {
    items.push({
      id: `${env.id}-serbatoio-moca-pompa-autoclave-pressostato`,
      area: env.name,
      title: "Serbatoio Acqua Potabile MOCA e Autoclave Sanitaria a Pressostato Certificata",
      question:
        "Il serbatoio per l'acqua potabile da 80L e l'elettropompa autoclave a pressostato 12V sono realizzati in materiali certificati MOCA e sottoposti a programma documentato di sanificazione e disinfezione periodica?",
      normReference: "D.Lgs. 18/2023 (Acque destinate al consumo umano) e Reg. CE 852/2004 All. II Cap. VII",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Serbatoio acqua non certificato MOCA o assenza di sanificazione periodica documentata dell'impianto idrico di bordo con rischio contaminazione biologica.",
    });

    items.push({
      id: `${env.id}-boiler-acqua-calda-funzionamento`,
      area: env.name,
      title: "Boiler Elettrico per Acqua Calda Sanitaria e Verifica Temperatura Erogazione (45-50°C)",
      question:
        "Il boiler compatto installato a bordo assicura l'erogazione costante di acqua calda a temperatura idonea (45-50°C) al lavamani e al lavaporzionatore per garantire l'efficacia igienica delle operazioni?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Boiler elettrico inefficiente o acqua fredda al lavamani di bordo che impedisce la corretta igiene delle mani dell'operatore e delle attrezzature.",
    });

    items.push({
      id: `${env.id}-serbatoio-acque-grigie-saracinesca-scarico`,
      area: env.name,
      title: "Tenuta Serbatoio Acque Grigie Reflue con Saracinesca Ermetica di Scarico",
      question:
        "Il serbatoio di recupero delle acque grigie provenienti dal lavaporzionatore e lavamani è dotato di sfiato canalizzato e saracinesca ermetica di scarico a tenuta stagna senza perdite durante il trasporto?",
      normReference: "D.Lgs. 152/2006 (Testo Unico Ambientale) e Reg. CE 852/2004 All. II Cap. III",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Serbatoio acque reflue con saracinesca non ermetica o gocciolante con potenziale dispersione di acque sporche a terra.",
    });
  }

  // e) Cabina di Guida Furgone / Ape Car Allestito Gelateria
  if (env.id === "env-gelamb-cabina-guida" || env.id.includes("gelamb-cabina-guida")) {
    items.push({
      id: `${env.id}-paratia-divisoria-fissa-sicurezza`,
      area: env.name,
      title: "Paratia Divisoria Fissa di Sicurezza tra Cabina di Guida e Laboratorio Gelato",
      question:
        "La cabina di guida è separata dal comparto laboratorio/banco posteriore da una paratia rigida fissa di sicurezza a norma CdS, idonea a trattenere carichi e strumenti in caso di frenata brusca?",
      normReference: "D.Lgs. 81/2008 Allegato V punto 1 e Codice della Strada art. 164",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Paratia di sicurezza tra cabina di guida e laboratorio assente o non fissata saldamente con rischio impatto carichi sul conducente.",
    });

    items.push({
      id: `${env.id}-estintore-veicolare-polvere-2kg`,
      area: env.name,
      title: "Estintore Veicolare Omologato da 2 kg a Polvere con Fissaggio a Sgancio Rapido",
      question:
        "In cabina di guida è presente un estintore a polvere da almeno 2 kg, provvisto di controllo semestrale valido e fissato con staffa metallica a sgancio rapido?",
      normReference: "D.M. 03/09/2021 e D.Lgs. 81/2008 Allegato IV punto 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Estintore veicolare assente in cabina di guida o con revisione semestrale scaduta.",
    });
  }

  // f) Laboratorio Base: Zona Pastorizzazione & Maturazione Miscele Gelato
  if (env.id === "env-gelamb-lab-pastorizzazione" || env.id.includes("gelamb-lab-pastorizzazione")) {
    items.push({
      id: `${env.id}-registrazione-ciclo-pastorizzazione-shock-termico`,
      area: env.name,
      title: "Registrazione Digitale Ciclo Termico Pastorizzazione (+85°C) e Shock Rapido (+4°C)",
      question:
        "Il pastorizzatore elettronico registra digitalmente i parametri del ciclo termico ad almeno +85°C e del successivo rapido abbattimento/shock a +4°C a norma Reg. CE 853/2004, con archiviazione verificabile dei lotti delle miscele?",
      normReference: "Reg. CE 853/2004 Allegato III Sezione IX e Reg. CE 852/2004",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Mancata registrazione digitale del ciclo termico di pastorizzazione (+85°C) e shock a +4°C delle miscele gelato con grave rischio biologico.",
    });

    items.push({
      id: `${env.id}-lavamani-antibagno-laboratorio-pedale`,
      area: env.name,
      title: "Lavamani a Ginocchio/Pedale con Sapone Disinfettante e Asciugamani a Perdere nel Laboratorio",
      question:
        "Il laboratorio di preparazione e pastorizzazione dispone di lavamani ad azionamento non manuale (a ginocchio o a pedale) completo di sapone liquido antibatterico, salviette monouso in dispenser e cestino con comando a pedale?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4 e D.Lgs. 81/2008 All. IV",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavamani del laboratorio con comando a manopola manuale o privo di sapone disinfettante e salviette monouso.",
    });
  }

  // g) Laboratorio Base: Zona Mantecazione, Abbattimento & Farcitura
  if (env.id === "env-gelamb-lab-mantecazione" || env.id.includes("gelamb-lab-mantecazione")) {
    items.push({
      id: `${env.id}-microinterruttore-sicurezza-scarico-mantecatore`,
      area: env.name,
      title: "Microinterruttore di Sicurezza Interbloccato su Portella e Bocca Scarico Mantecatore",
      question:
        "Il mantecatore professionale orizzontale è equipaggiato con microinterruttore di sicurezza interbloccato che arresta istantaneamente la rotazione delle pale raschianti all'apertura della bocca di estrazione del gelato?",
      normReference: "D.Lgs. 81/2008 Allegato V punto 2 e Direttiva Macchine 2006/42/CE (UNI EN 203 / UNI EN 1672-2)",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Mantecatore con microinterruttore di sicurezza disattivato o non conforme sulla bocca di scarico con grave pericolo di lesioni e amputazione dita.",
    });

    items.push({
      id: `${env.id}-abbattimento-rapido-carapine-35c`,
      area: env.name,
      title: "Abbattitore Rapido Surgelazione Carapine (-35°C) per Stabilizzazione Cristalli di Ghiaccio",
      question:
        "È presente un abbattitore rapido di temperatura a -35°C in grado di portare a cuore le carapine di gelato appena estratte dal mantecatore per la rapida microcristallizzazione prima dello stoccaggio?",
      normReference: "Reg. CE 852/2004 Allegato II Cap. IX punto 5 e Manuale HACCP di Gelateria",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Assenza di abbattimento rapido post-mantecazione delle carapine con formazione di macrocristalli e decadimento qualitativo e microbiologico del gelato.",
    });
  }

  // h) Laboratorio Base: Reparto Pasticceria da Forno, Cialde & Coni
  if (env.id === "env-gelamb-lab-pasticceria" || env.id.includes("gelamb-lab-pasticceria")) {
    items.push({
      id: `${env.id}-griglia-interbloccata-planetaria-uni-en-454`,
      area: env.name,
      title: "Griglia Inox di Protezione Interbloccata per Vasca Planetaria (UNI EN 454)",
      question:
        "L'impastatrice planetaria del laboratorio dispone di griglia inox di protezione conforme a UNI EN 454 con microinterruttore di arresto istantaneo della rotazione degli utensili in caso di sollevamento del riparo?",
      normReference: "UNI EN 454 e D.Lgs. 81/2008 Allegato V punto 2",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Planetaria per creme e impasti priva di riparo grigliato interbloccato con rischio trascinamento arti superiori.",
    });

    items.push({
      id: `${env.id}-ripari-mobili-sfogliatrice-uni-en-1674`,
      area: env.name,
      title: "Ripari Mobili Interbloccati all'Imbocco dei Cilindri della Sfogliatrice (UNI EN 1674)",
      question:
        "La sfogliatrice per la laminazione degli impasti è dotata di ripari interbloccati a norma UNI EN 1674 all'imbocco dei rulli per impedire l'introduzione delle mani durante la lavorazione?",
      normReference: "UNI EN 1674 e D.Lgs. 81/2008 Allegato V punto 2",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Sfogliatrice da banco priva di ripari interbloccati sui rulli laminatori con pericolo schiacciamento mani.",
    });

    items.push({
      id: `${env.id}-arresto-ventola-forno-pasticceria`,
      area: env.name,
      title: "Arresto Automatico Ventole di Convezione all'Apertura del Portellone del Forno",
      question:
        "Il forno di pasticceria dispone di interruttore finecorsa sulla porta che blocca immediatamente la ventola di convezione all'apertura del portellone, evitando violenti ritorni di vapori e calore verso l'operatore?",
      normReference: "D.Lgs. 81/2008 Allegato V punto 6 e Allegato VI punto 1",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Forno di pasticceria con ventola di convezione attiva all'apertura del portellone con rischio ustioni da vapori incandescenti.",
    });
  }

  // i) Cella Frigorifera Negativa Stoccaggio Carapine & Torte Gelato (-20°C)
  if (env.id === "env-gelamb-cella-stoccaggio" || env.id.includes("gelamb-cella-stoccaggio")) {
    items.push({
      id: `${env.id}-allarme-uomo-intrappolato-batteria-tampone-24v`,
      area: env.name,
      title: "Allarme Acustico-Visivo Uomo Intrappolato a 24V h24 e Maniglia Fluorescente (UNI EN 378)",
      question:
        "La cella frigorifera a bassa temperatura (-20°C) è dotata di pulsante luminoso di allarme uomo intrappolato a 24V alimentato da batteria tampone h24 con segnalatore ottico-acustico esterno e maniglia interna fluorescente a sblocco meccanico permanente?",
      normReference: "UNI EN 378-1/2/3 e D.Lgs. 81/2008 Allegato IV punto 1.11",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Cella frigorifera a -20°C priva di allarme uomo intrappolato a 24V con batteria tampone o con maniglia di apertura interna di sicurezza guasta.",
    });

    items.push({
      id: `${env.id}-teletermometro-registratore-continuo-haccp-20c`,
      area: env.name,
      title: "Monitoraggio e Registrazione Continua Temperature Stoccaggio (≤ -20°C)",
      question:
        "La cella di conservazione carapine e torte gelato è dotata di teletermometro registratore continuo digitale HACCP conforme a Reg. CE 37/2005 per la verifica del mantenimento costante della catena del freddo a temperatura ≤ -20°C?",
      normReference: "Reg. CE 852/2004 All. II Cap. IX e Reg. CE 37/2005",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Mancata registrazione della temperatura nella cella congelatore del gelato o temperatura superiore a -18°C con perdita di stabilità dei prodotti.",
    });
  }

  // j) Magazzino Secco, Coni, Coppette & Packaging MOCA di Sede
  if (env.id === "env-gelamb-dispensa-coni" || env.id.includes("gelamb-dispensa-coni")) {
    items.push({
      id: `${env.id}-conformita-moca-coni-coppette-palette`,
      area: env.name,
      title: "Conformità MOCA e Rintracciabilità per Coni, Coppette e Palette Monouso (Reg. CE 1935/2004)",
      question:
        "Tutti i coni, cialde, coppette, coperchi e palette monouso destinati al contatto con il gelato sono provvisti di dichiarazione di conformità MOCA del produttore e stoccati in imballi chiusi e protetti da polvere e contaminanti?",
      normReference: "Reg. CE 1935/2004, Reg. CE 2023/2006 (GMP) e D.Lgs. 29/2017",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Packaging monouso e palette per gelato sprovvisti di conformità MOCA o conservati aperti esposti a polvere nel magazzino.",
    });

    items.push({
      id: `${env.id}-stoccaggio-rialzato-scaffali-scorte`,
      area: env.name,
      title: "Stoccaggio Merci Secche e Cialde su Scaffalature Rialzate ≥ 15 cm e Monitoraggio Farfalline",
      question:
        "Le scorte di basi per gelato, zuccheri, paste aromatizzanti e cartoni di coni sono collocate su scaffalature sollevate da terra almeno 15 cm ed è attivo un piano di monitoraggio per insetti e farfalline della farina?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo IX e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Cartoni di coni o sacchi di zucchero appoggiati direttamente a terra sul pavimento o assenza di monitoraggio infestanti alimentari.",
    });
  }

  // k) Plonge di Sede: Lavaggio & Sanificazione Carapine e Fruste
  if (env.id === "env-gelamb-lavaggio-carapine" || env.id.includes("gelamb-lavaggio-carapine")) {
    items.push({
      id: `${env.id}-lavaoggetti-risciacquo-igienico-82c`,
      area: env.name,
      title: "Lavaoggetti Industriale con Risciacquo Termico Igienico a Temperatura ≥ 82°C",
      question:
        "La lavaoggetti della plonge assicura un risciacquo termico a una temperatura non inferiore a 82°C per la termodisinfezione di carapine inox, fruste, vasche e pale dei mantecatori rientrate dal servizio itinerante?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V punto 1",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavaoggetti della plonge con temperatura di risciacquo inferiore a 82°C o priva di dosatore automatico di sanificante.",
    });

    items.push({
      id: `${env.id}-disconnettore-antiriflusso-uni-en-1717`,
      area: env.name,
      title: "Disconnettore Idraulico Antiriflusso a Protezione della Rete Potabile (UNI EN 1717)",
      question:
        "Il gruppo lavello con doccione e l'alimentazione della lavaoggetti sono muniti di dispositivo antiriflusso conforme a UNI EN 1717 a salvaguardia della rete idrica potabile?",
      normReference: "UNI EN 1717 e D.Lgs. 18/2023",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Punto di attacco doccione della plonge privo di valvola antiriflusso con rischio di aspirazione di reflui nella rete potabile.",
    });
  }

  // l) Hangar Rimessaggio Coperto con Colonnina di Ricarica Notturna Frigo
  if (env.id === "env-gelamb-hangar-ricarica" || env.id.includes("gelamb-hangar-ricarica")) {
    items.push({
      id: `${env.id}-colonnina-ricarica-notturna-norma-cei`,
      area: env.name,
      title: "Colonnina con Presa Industriale CEE IP67 Dedicata per Mantenimento Notturno Pozzetti a Glicole",
      question:
        "L'area di rimessaggio dispone di presa industriale CEE IP67 dedicata protetta da differenziale magneto-termico per garantire l'allaccio notturno del veicolo e il mantenimento del freddo a glicole a motore spento?",
      normReference: "Norma CEI 64-8 e D.Lgs. 81/2008 Titolo III Capo III",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Allacciamento elettrico notturno per il mantenimento dei pozzetti frigo privo di presa industriale stagna a norma CEI o senza salvavita.",
    });

    items.push({
      id: `${env.id}-estintori-carrellati-hangar`,
      area: env.name,
      title: "Estintori Carrellati/Portatili e Vie di Manovra Libere nel Rimessaggio Furgoni",
      question:
        "L'hangar di rimessaggio è dotato di estintori idonei posizionati lungo le vie di fuga e le corsie di manovra dei furgoni/carretti sono mantenute costantemente sgombre da ostacoli?",
      normReference: "D.M. 03/09/2021 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Estintori non accessibili o corsie di manovra dell'hangar ostruite da materiali con ostacolo all'evacuazione del veicolo in emergenza.",
    });
  }

  // ============================================================================
  // 13. Regole e Requisiti per Bar, Caffetteria, Snack Bar, Cocktail Bar e Birreria (56.30 / 56.3)
  // ============================================================================

  // a) Banco Bar Principale, Caffetteria & Mescita
  if (env.id === "env-bar-banco-caffetteria" || env.id.includes("bar-banco-caffetteria")) {
    items.push({
      id: `${env.id}-macchina-espresso-valvola-ped-lancia-cooltouch`,
      area: env.name,
      title: "Macchina Caffè Espresso con Valvola di Sicurezza PED e Lance Vapore Cool-Touch",
      question:
        "La macchina per caffè espresso è dotata di valvola di sicurezza certificata PED (D.Lgs. 26/2016) revisionata, manometro di pressione caldaia funzionante e lance vapore con isolamento termico cool-touch per prevenire ustioni agli operatori?",
      normReference: "D.Lgs. 26/2016 (Direttiva PED 2014/68/UE) e D.Lgs. 81/2008 Allegato IV e V",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Macchina caffè priva di verifica valvola PED o con lancia vapore priva di impugnatura antiscottatura con pericolo di ustioni gravi.",
    });

    items.push({
      id: `${env.id}-macinadosatore-battifiltro-insonorizzato-rumore`,
      area: env.name,
      title: "Macinadosatori On-Demand con Cassetto Battifiltro Fonoassorbente (Titolo VIII Rumore)",
      question:
        "I macinadosatori del caffè sono provvisti di cassetto battifiltro fonoassorbente per attutire i colpi e di macine integre per limitare le vibrazioni e il rumore impulsivo continuo al banco mescita?",
      normReference: "D.Lgs. 81/2008 Titolo VIII Capo II (Protezione dei lavoratori contro i rischi di esposizione al rumore)",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Cassetto battifiltro metallico privo di gomma fonoassorbente con elevate emissioni di rumore impulsivo a carico dei baristi.",
    });

    items.push({
      id: `${env.id}-vetrina-refrigerata-snack-parafiato-moca`,
      area: env.name,
      title: "Vetrina Refrigerata Snack con Schermo Parafiato e Temperatura di Conservazione +4°C",
      question:
        "La vetrina refrigerata espositiva per brioche salate, tramezzini e panini al banco è dotata di barriera parafiato verso il pubblico, gocciolatoi inox e termometro visibile attestante temperatura ≤ +4°C?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo IX e D.Lgs. 193/2007",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Vetrina snack con coperchio o parafiato rotto o temperatura interna superiore a +4°C con interruzione della catena del freddo per prodotti farciti.",
    });

    items.push({
      id: `${env.id}-lavamani-banco-comando-non-manuale`,
      area: env.name,
      title: "Lavamani al Banco con Comando a Ginocchio/Pedale, Acqua Calda/Fredda e Asciugamani a Perdere",
      question:
        "Il banco mescita dispone di lavamani dedicato ad uso esclusivo del personale azionabile con comando a ginocchio o pedale, erogatore di sapone igienizzante e salviette monouso a perdere?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4 e Capitolo II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavamani del banco bar azionabile con manopole manuali o sprovvisto di asciugamani a perdere o acqua calda per il lavaggio frequente delle mani del personale.",
    });
  }

  // b) Zona Cocktail Bar, Mescita Alcolici & Banchi Bottiglie
  if (env.id === "env-bar-cocktail-station" || env.id.includes("bar-cocktail-station")) {
    items.push({
      id: `${env.id}-cocktail-station-vasca-ghiaccio-scarico-diretto`,
      area: env.name,
      title: "Cocktail Station Coibentata con Vasca Ghiaccio a Scarico Diretto Anticontaminazione",
      question:
        "La cocktail station presenta vasca per cubetti di ghiaccio in acciaio inox coibentata con pozzetto e scarico continuo a tenuta per evitare ristagni di acqua di fusione ed è dotata di palette dedicate MOCA per il prelievo esclusivo?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo II e Reg. CE 1935/2004 MOCA",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Prelievo del ghiaccio alimentare con bicchieri in vetro o ristagno di acqua torbida nella vasca della cocktail station per scarico ostruito.",
    });

    items.push({
      id: `${env.id}-blender-tritaghiaccio-microinterruttore-uni-en-12852`,
      area: env.name,
      title: "Blender e Tritaghiaccio Professionali con Microinterruttore di Blocco (UNI EN 12852)",
      question:
        "Il frullatore/blender e il tritaghiaccio elettrico sono marcati CE e muniti di dispositivo di sicurezza (microinterruttore) che arresta istantaneamente la rotazione delle lame all'apertura del coperchio o campana insonorizzante?",
      normReference: "UNI EN 12852 e D.Lgs. 81/2008 Allegato V punto 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Blender o tritaghiaccio privo di microinterruttore di sicurezza sul coperchio con pericolo di contatto accidentale delle mani con le lame rotanti.",
    });

    items.push({
      id: `${env.id}-speed-rail-anticaduta-bottiglie-ergonomia`,
      area: env.name,
      title: "Speed-Rail Portabottiglie Rinforzato con Bordo Anticaduta e Lavello Bagnaghiaccio a Pressione",
      question:
        "Le rastrelliere portabottiglie (speed-rail) sono fissate saldamente al banco con parapetto anticaduta e il lavello con sciacquabicchiere a pressione (pitcher rinser) è provvisto di valvola antiriflusso?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e UNI EN 1717",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Speed-rail instabile o privo di bordatura di contenimento con rischio di rottura bottiglie e ferite da taglio per gli operatori.",
    });
  }

  // c) Laboratorio Tavola Fredda, Piastre Panini & Preparazione Snack
  if (env.id === "env-bar-retrobanco-snack" || env.id.includes("bar-retrobanco-snack")) {
    items.push({
      id: `${env.id}-affettatrice-paralama-360-blocco-vela-uni-en-1974`,
      area: env.name,
      title: "Affettatrice a Gravità con Anello Paralama Fisso Continuo 360° e Blocco Vela a Zero (UNI EN 1974)",
      question:
        "L'affettatrice è conforme alla norma UNI EN 1974, provvista di anello paralama perimetrale fisso a 360°, blocco carrello con manopola graduata a zero per la pulizia e dispositivo premi-alimento trasparente?",
      normReference: "UNI EN 1974 e D.Lgs. 81/2008 Titolo III Capo I e All. V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Affettatrice con lama scoperta o priva del blocco carrello a lama chiusa, con gravissimo rischio di amputazione o lesioni da taglio durante le operazioni di smontaggio e pulizia.",
    });

    items.push({
      id: `${env.id}-piastra-panini-isolamento-termico-cappa`,
      area: env.name,
      title: "Piastre Panini e Fornetti con Maniglie Termoisolanti e Aspirazione Idonea dei Fumi",
      question:
        "Le piastre in ghisa rigate/lisce e i fornetti/toaster sono provvisti di maniglie e comandi termicamente isolati, cavi resistenti al calore e posizionati sotto cappa o impianto di aerazione forzata idoneo per l'estrazione dei fumi di tostatura?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.9 e Reg. CE 852/2004 All. II Cap. II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Piastra per panini priva di protezione dal calore sulle maniglie o fumi di cottura persistenti nel retrobanco per assenza di idonea estrazione o cappa.",
    });

    items.push({
      id: `${env.id}-taglieri-coltelli-codice-colore-haccp`,
      area: env.name,
      title: "Taglieri in Polietilene a Codice Colore e Coltelli MOCA per Separazione Alimenti",
      question:
        "La preparazione di snack, panini, affettati e verdure avviene su taglieri in polietilene alimentare atossico differenziati per codice colore (es. rosso per carni cotte/salumi, verde per verdure) sanificati dopo ogni utilizzo?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e Reg. CE 1935/2004",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Utilizzo di taglieri unici fessurati o in legno non ammessi per la manipolazione promiscua di salumi e verdure con rischio di contaminazione crociata microbiologica.",
    });
  }

  // d) Impianto Spillatura Birra & Vano Bombole CO2 / Azoto Alimentare
  if (env.id === "env-bar-spillatura-co2" || env.id.includes("bar-spillatura-co2")) {
    items.push({
      id: `${env.id}-bombole-co2-azoto-catenelle-verticali-titolo-xi`,
      area: env.name,
      title: "Fissaggio Sicuro Bombole Gas Compresso CO2/Azoto con Catenelle Verticali (D.Lgs. 81/08)",
      question:
        "Tutte le bombole di gas compresso (anidride carbonica E290 e azoto E941 per spillatura) sono saldamente assicurate a muro mediante catenelle o collari metallici posti a 2/3 dell'altezza per prevenirne il ribaltamento accidentale?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e Titolo XI (Atmosfere esplosive ed asfissianti)",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Bombole di CO2 per spillatura libere a terra o non vincolate con catenelle di sicurezza con rischio di caduta, rottura valvola ed effetto missile ad alta pressione.",
    });

    items.push({
      id: `${env.id}-rilevatore-fughe-co2-allarme-anti-asfissia`,
      area: env.name,
      title: "Rilevatore Fughe Gas Asfissiante CO2 con Allarme Ottico-Acustico ed Estrattore d'Aria",
      question:
        "Nel vano spillatura/deposito fusti è installato un sensore per la rilevazione di perdite di anidride carbonica (CO2) con allarme ottico-acustico esterno e attivazione automatica della ventilazione forzata contro il rischio di asfissia e saturazione dell'aria?",
      normReference: "D.Lgs. 81/2008 art. 66 e Allegato IV punto 1.9 e Titolo XI",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Locale bombole CO2 privo di sistema di rilevazione fughe o ventilazione con potenziale accumulo di gas pesante asfissiante sul fondo del locale e pericolo di morte.",
    });

    items.push({
      id: `${env.id}-linee-spillatura-sanificazione-periodica-haccp`,
      area: env.name,
      title: "Sanificazione e Flussaggio Chimico Periodico Linee e Serpentini di Spillatura",
      question:
        "I tubi, serpentini di raffreddamento e rubinetti di mescita dell'impianto di spillatura sono sottoposti a ciclo documentato di sanificazione e decalcificazione chimica (con registro interventi HACCP) per prevenire biofilm e contaminazioni batteriche?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V punto 1 e D.Lgs. 193/2007",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Linee dell'impianto di spillatura non sanificate periodicamente con depositi di tartaro di birra, lieviti e biofilm all'interno delle canne di mescita.",
    });
  }

  // e) Zona Lavaggio Bicchieri, Tazzine & Stoviglie (Plonge Separata)
  if (env.id === "env-bar-plonge-lavaggio" || env.id.includes("bar-plonge-lavaggio")) {
    items.push({
      id: `${env.id}-lavabicchieri-risciacquo-85c-break-tank-uni-en-1717`,
      area: env.name,
      title: "Lavabicchieri Professionale con Risciacquo Igienico a 85°C e Break Tank UNI EN 1717",
      question:
        "La lavabicchieri/lavastoviglie della plonge garantisce una temperatura di risciacquo finale non inferiore a 82-85°C per l'igienizzazione termica di tazze e bicchieri ed è provvista di Break Tank (disconnettore idrico antiriflusso UNI EN 1717)?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e UNI EN 1717",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavabicchieri con temperatura del boiler di risciacquo inferiore a 80°C o priva di dosatore automatico di brillantante/sanificante con mancata igienizzazione delle stoviglie.",
    });

    items.push({
      id: `${env.id}-vasche-lavello-doccione-canalina-antiscivolo`,
      area: env.name,
      title: "Lavello Inox a Vasca Profonda con Doccione Sbarazzo Flessibile e Canalina Sifonata a Terra",
      question:
        "Il lavello di lavaggio è realizzato in acciaio inox con gocciolatoio e doccione flessibile a molla, e la zona calpestio è dotata di canalina di scolo sifonata con griglia inox per evitare allagamenti e scivolamenti?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.3 e Reg. CE 852/2004 All. II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Pavimento della plonge con ristagni continui di acqua saponata per assenza di canaline di scolo o pendenze adeguate, con elevato rischio scivolamento.",
    });
  }

  // f) Magazzino Merci Secche, Bibite, Fusti & Cantina Vini
  if (env.id === "env-bar-deposito-bevande" || env.id.includes("bar-deposito-bevande")) {
    items.push({
      id: `${env.id}-scaffalature-portata-fusti-casse-acque`,
      area: env.name,
      title: "Scaffalature Industriali per Fusti e Casse d'Acqua con Portate Limite Verificate (UNI EN 15635)",
      question:
        "Le scaffalature metalliche destinate a sostenere il peso gravoso di fusti di birra, casse di bibite e bottiglie di vino presentano cartelli di portata massima, ancoraggi a parete/pavimento e campate sollevate ≥ 15 cm dal suolo?",
      normReference: "UNI EN 15635 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Scaffali metallici sovraccarichi di casse di bottiglie e fusti privi di targhette di portata o deformati senza ancoraggi di sicurezza al muro.",
    });

    items.push({
      id: `${env.id}-monitoraggio-infestanti-pallettizzazione-cantina`,
      area: env.name,
      title: "Stoccaggio Alimenti su Pedane Plastiche Lavabili e Monitoraggio Roditori/Blatte (Pest Control)",
      question:
        "I cartoni di bevande, vini e alimenti secchi sono stoccati su pallet o ripiani plastici lisci sanificabili e sono attive trappole collanti/monitoraggio infestanti conformi al manuale HACCP?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo IX punto 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Casse di bottiglie o cartoni appoggiati direttamente sul pavimento umido del magazzino o assenza di postazioni di monitoraggio contro insetti e topi.",
    });
  }

  // g) Armadi Frigoriferi di Stoccaggio Deperibili (+2/+4°C e -18°C)
  if (env.id === "env-bar-celle-frigo" || env.id.includes("bar-celle-frigo")) {
    items.push({
      id: `${env.id}-teletermometri-registrazione-continua-haccp`,
      area: env.name,
      title: "Teletermometri a Lettura Esterna e Registrazione Continua Temperature HACCP (+4°C / -18°C)",
      question:
        "Gli armadi frigoriferi per latte fresco, salumi, formaggi e dessert (+2/+4°C) e il congelatore per prodotti surgelati (-18°C) sono muniti di teletermometro a display esterno con registro di controllo delle temperature?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo IX e Reg. CE 37/2005",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Frigorifero per il latte e farciture deperibili sprovvisto di termometro o con temperatura superiore a +4°C rilevata durante l'ispezione.",
    });

    items.push({
      id: `${env.id}-guarnizioni-frigo-integre-illuminazione-interna`,
      area: env.name,
      title: "Guarnizioni Magnetiche Integre e Pulibili e Maniglie con Apertura di Sicurezza",
      question:
        "Le guarnizioni magnetiche delle porte dei frigoriferi si presentano prive di muffe, tagli o fessurazioni, assicurando la perfetta tenuta termica e la facile igienizzazione con detergenti idonei?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e D.Lgs. 81/2008 All. IV",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Guarnizioni degli armadi frigoriferi annerite da muffe persistenti o lacerate con dispersione di freddo e condensa a terra.",
    });
  }

  // h) Sala Somministrazione, Tavoli & Zona Seduta Clienti (40-60 Coperti)
  if (env.id === "env-bar-sala-consumo" || env.id.includes("bar-sala-consumo")) {
    items.push({
      id: `${env.id}-vie-esodo-corridoi-passaggio-liberi-120cm`,
      area: env.name,
      title: "Vie di Esodo e Passaggi tra i Tavoli Liberi e di Ampiezza ≥ 1,20 Metri",
      question:
        "I corridoi di transito principali tra i tavoli e i banchi verso le uscite di sicurezza presentano larghezza utile netta non inferiore a 1,20 metri e risultano costantemente sgombri da sedie, scatoloni o arredi provvisori?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e D.M. 03/09/2021 (Minicodice)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Vie di fuga e corridoi tra i tavoli del bar ristretti a meno di 1,20 m o ostruiti con rischio di intralcio e schiacciamento in caso di rapida evacuazione.",
    });

    items.push({
      id: `${env.id}-uscite-sicurezza-maniglioni-antipanico-luci-emergenza`,
      area: env.name,
      title: "Uscite di Emergenza con Maniglioni Antipanico e Illuminazione di Sicurezza (≥ 5 lux)",
      question:
        "Le porte delle uscite di emergenza si aprono facilmente nel verso dell'esodo mediante maniglioni antipanico a barra orizzontale marcati CE (UNI EN 1125) ed è presente illuminazione di emergenza ad attivazione automatica in caso di blackout?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 e UNI EN 1125",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Uscita di emergenza della sala sbarrata a chiave o con maniglione antipanico bloccato o illuminazione di sicurezza non funzionante.",
    });
  }

  // i) Dehor Esterno / Area Tavoli all'Aperto & Gazebo
  if (env.id === "env-bar-dehor-esterno" || env.id.includes("bar-dehor-esterno")) {
    items.push({
      id: `${env.id}-paraventi-dehor-ancoraggio-antivento-certificato`,
      area: env.name,
      title: "Paraventi, Gazebo e Strutture del Dehor con Ancoraggio Antivento Certificato",
      question:
        "I paraventi perimetrali, tende, ombrelloni e coperture fisse/mobili del dehor esterno sono saldamente ancorati al suolo o zavorrati secondo i carichi di vento previsti per evitare ribaltamenti su clienti e passanti?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.1 e Regolamenti Comunali di Occupazione Suolo Pubblico",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Ombrelloni o paraventi del dehor non zavorrati adeguatamente con pericolo di ribaltamento per folate di vento e lesioni a persone.",
    });

    items.push({
      id: `${env.id}-riscaldatori-dehor-funghi-gpl-lampade-infrarossi`,
      area: env.name,
      title: "Apparecchi Riscaldanti Esterni (Funghi a GPL o Lampade IR) a Norma con Valvola Antiribaltamento",
      question:
        "Gli apparecchi di riscaldamento del dehor (funghi radianti a GPL o stufe a infrarossi) sono provvisti di valvola di sicurezza antiribaltamento con spegnimento immediato della fiamma/alimentazione e posizionati a distanza di sicurezza da tendaggi infiammabili?",
      normReference: "D.M. 03/09/2021, Norma UNI 10738 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Fungo a gas GPL posizionato sotto tende infiammabili o privo di valvola termoelettrica antiribaltamento con grave pericolo di incendio e ustioni.",
    });
  }

  // j) Servizi Igienici Clienti (Accessibile Disabili D.P.R. 503/96 - D.M. 236/89)
  if (env.id === "env-bar-wc-clienti" || env.id.includes("bar-wc-clienti")) {
    items.push({
      id: `${env.id}-accessibilita-disabili-dpr-503-dm-236`,
      area: env.name,
      title: "Servizi Igienici Accessibili ai Disabili (D.P.R. 503/96 - D.M. 236/89) con Tirante Allarme",
      question:
        "Il bagno clienti è privo di barriere architettoniche, munito di porta con luce netta ≥ 85 cm, tazza W.C. con apertura frontale e maniglioni di sostegno, lavabo ergonomico e tirante di soccorso collegato a suoneria e luce fuori porta?",
      normReference: "D.P.R. 503/1996, D.M. 236/1989 art. 5 e D.Lgs. 81/2008 Allegato IV punto 1.13",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Bagno clienti privo di tirante di allarme a campanello o con maniglioni per disabili mancanti o porta con larghezza insufficiente per carrozzine.",
    });

    items.push({
      id: `${env.id}-antibagno-lavamani-non-manuale-aerazione-forzata`,
      area: env.name,
      title: "Antibagno con Lavamani Non Manuale e Ventilazione Meccanica se Bagno Cieco",
      question:
        "Il servizio igienico è preceduto da locale antibagno separato con porta a chiusura automatica, lavamani con miscelatore a ginocchio/fotocellula, dosatore sapone e aspiratore d'aria forzata temporizzato se il bagno è privo di finestra?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 3 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Bagno clienti comunicante direttamente con la sala somministrazione senza antibagno o con aspiratore dell'aria guasto nel locale cieco.",
    });
  }

  // k) Spogliatoio e Servizi Igienici del Personale con Antibagno
  if (env.id === "env-bar-spogliatoi-staff" || env.id.includes("bar-spogliatoi-staff")) {
    items.push({
      id: `${env.id}-armadietti-doppio-scomparto-sporco-pulito-staff`,
      area: env.name,
      title: "Armadietti Individuali a Doppio Scomparto per Separazione Abiti Civili e da Lavoro",
      question:
        "Lo spogliatoio del personale dispone di armadietti metallici individuali a due scomparti (uno per gli indumenti civili e uno per le divise da barista/cameriere) lavabili e muniti di serratura a chiave o lucchetto?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.12 e Reg. CE 852/2004 All. II Cap. I",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Assenza di armadietti a doppio scomparto con promiscuità tra abiti civili e divise da lavoro a contatto con alimenti e bevande.",
    });

    items.push({
      id: `${env.id}-servizio-igienico-personale-doccia-lavamani`,
      area: env.name,
      title: "Servizio Igienico Esclusivo Personale con Doccia e Lavamani con Comando a Pedale/Ginocchio",
      question:
        "Il bagno del personale è fisicamente distinto da quello dei clienti, dotato di antibagno con lavamani a comando non manuale, erogatore di sapone disinfettante, asciugamani monouso e piatto doccia con acqua calda?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.13 e Reg. CE 852/2004 Allegato II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Bagno del personale utilizzato promiscuamente come ripostiglio merci o privo di sapone disinfettante e comando lavamani igienico.",
    });
  }

  // l) Locale Tecnico / Quadro Elettrico & Impianto Trattamento Acque
  if (env.id === "env-bar-tecnico-trattamento-acque" || env.id.includes("bar-tecnico-trattamento-acque")) {
    items.push({
      id: `${env.id}-impianto-addolcitore-resine-potabilita-dlgs-18-2023`,
      area: env.name,
      title: "Addolcitore Acque e Filtrazione Conforme a D.Lgs. 18/2023 e D.M. 174/2004",
      question:
        "L'impianto di addolcimento a scambio ionico e osmosi per la macchina del caffè e fabbricatore di ghiaccio rispetta i parametri di potabilità (durezza residua ≥ 15°F), impiega materiali atossici certificati D.M. 174/2004 ed è provvisto di registro manutenzione filtri?",
      normReference: "D.Lgs. 18/2023 (Acque destinate al consumo umano) e D.M. 174/2004",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancata rigenerazione del sale dell'addolcitore o filtri a carboni attivi mai sostituiti con rischio di proliferazione batterica e cessione sostanze nell'acqua per il caffè e ghiaccio.",
    });

    items.push({
      id: `${env.id}-quadro-elettrico-differenziale-sgancio-rapido-emergenza`,
      area: env.name,
      title: "Quadro Elettrico Generale con Differenziale Selettivo e Pulsante di Sgancio di Emergenza",
      question:
        "Il quadro elettrico generale presenta porta chiusa a chiave con simbolo di pericolo alta tensione, sezionamento indipendente per banchi frigo, cappe e prese mescita, interruttore differenziale ad alta sensibilità e pulsante di sgancio rapido accessibile?",
      normReference: "Norma CEI 64-8 e D.Lgs. 81/2008 Titolo III Capo III",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Quadro elettrico aperto o con cavi a vista senza sportello di protezione e pulsante di sgancio di emergenza ostruito da cartoni.",
    });
  }

  // ========================================================================
  // REQUISITI SPECIFICI HOTEL, RESORT E STRUTTURE RICETTIVE (ATECO 55.10.00 / 55.1)
  // ========================================================================

  // a) Hall Principale, Reception & Area Accoglienza Clienti
  if (env.id === "env-hotel-reception-hall" || env.id.includes("hotel-reception-hall")) {
    items.push({
      id: `${env.id}-porte-automatiche-uni-en-16005-esodo`,
      area: env.name,
      title: "Porte Scorrevoli Automatiche con Dispositivo a Spinta per Esodo (UNI EN 16005)",
      question:
        "Le porte scorrevoli automatiche della hall principale dispongono di sistema a sfondamento o apertura di sicurezza a spinta manuale nel verso dell'esodo in conformità alla norma UNI EN 16005 e D.M. 09/04/1994?",
      normReference: "Norma UNI EN 16005, D.M. 09/04/1994 Titolo II e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Porte scorrevoli automatiche dell'ingresso hall prive di dispositivo di sicurezza per apertura a spinta in emergenza o non collegate al sistema di allarme antincendio.",
    });

    items.push({
      id: `${env.id}-banco-reception-ergonomia-vdt-presidio-h24`,
      area: env.name,
      title: "Banco Reception a Norma VDT (D.Lgs. 81/08 Titolo VII) e Presidio Allarmi H24",
      question:
        "Il banco reception presenta postazioni videoterminale ergonomiche con schermi antiriflesso, sedute regolabili e quadro di controllo/segnalazione centrale antincendio continuamente presidiato o rinviato?",
      normReference: "D.Lgs. 81/2008 Titolo VII, Allegato XXXIV e D.M. 09/04/1994 Titolo II",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Postazioni reception con schermi VDT esposti ad abbagliamenti molesti, sedie prive di regolazione lombare o pannello di allarme incendi privo di istruzioni operative per il personale.",
    });

    items.push({
      id: `${env.id}-percorsi-esodo-hall-planimetrie-luci-emergenza`,
      area: env.name,
      title: "Vie di Esodo della Hall (≥ 1,50 m), Planimetrie di Evacuazione e Luci Emergenza (≥ 5 lux)",
      question:
        "I percorsi di esodo principali attraverso la hall sono mantenuti liberi con larghezza non inferiore a 1,50 metri, dotati di illuminazione di emergenza ≥ 5 lux e planimetrie di evacuazione orientate?",
      normReference: "D.M. 09/04/1994 Titolo II punto 6 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Vie di fuga della hall parzialmente ostruite da carrelli bagagli o espositori con larghezza utile ridotta sotto 1,50 m, o illuminazione di sicurezza insufficiente.",
    });
  }

  // b) Camere Ospiti, Suite & Corridoi ai Piani (con Camere Disabili)
  if (env.id === "env-hotel-camere-piano" || env.id.includes("hotel-camere-piano")) {
    items.push({
      id: `${env.id}-porte-tagliafuoco-camere-ei30-chiudiporta-dm-1994`,
      area: env.name,
      title: "Porte Tagliafuoco delle Camere EI 30 / EI 60 con Dispositivo di Autochiusura (D.M. 09/04/1994)",
      question:
        "Tutte le porte delle camere ospiti che prospettano sui corridoi di piano possiedono resistenza al fuoco almeno EI 30 (o EI 60 per edifici oltre determinata altezza antincendio) con chiudiporta omologato a norma D.M. 09/04/1994?",
      normReference: "D.M. 09/04/1994 Titolo II punto 4 e D.P.R. 151/2011 Attività 66",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Porte delle camere d'albergo con chiudiporta guasto/manomesso o bloccate con cunei/zeppe a terra con compromissione della compartimentazione tagliafuoco.",
    });

    items.push({
      id: `${env.id}-rilevatori-fumo-irai-planimetrie-bilingue-evacuazione`,
      area: env.name,
      title: "Rilevatori Ottici di Fumo Indirizzati in Camera e Planimetrie Bilingue con Vie di Fuga",
      question:
        "Ogni camera e corridoio è dotato di rilevatore ottico di fumo indirizzato collegato alla centrale IRAI, ed è esposta sul retro della porta d'ingresso la planimetria di evacuazione bilingue indicante la posizione e le vie di fuga?",
      normReference: "D.M. 09/04/1994 Titolo II punto 10, Norma UNI 9795 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Mancanza di planimetria di evacuazione bilingue dietro la porta della camera o rilevatore di fumo schermato/scollegato con pericolo di ritardo allarme in caso di incendio notturno.",
    });

    items.push({
      id: `${env.id}-bagni-camere-disabili-dpr-503-tirante-soccorso`,
      area: env.name,
      title: "Bagni Camere Accessibili Disabili con Tirante Allarme a Campanello (D.P.R. 503/96 - D.M. 236/89)",
      question:
        "Le camere destinate ad ospiti con ridotta capacità motoria dispongono di bagno a norma D.P.R. 503/1996 e D.M. 236/1989 con porta scorrevole o verso l'esterno, maniglioni accostamento e tirante d'allarme a campanello con suoneria e luce fuori porta?",
      normReference: "D.P.R. 503/1996 art. 5, D.M. 236/1989 e Legge 104/1992",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Bagno per disabili privo di tirante a campanello per chiamata di soccorso o maniglioni di sostegno non fissati saldamente con rischio di caduta dell'ospite.",
    });
  }

  // c) Sala Colazioni & Ristorazione Ospiti (80-120 Coperti)
  if (env.id === "env-hotel-sala-colazioni" || env.id.includes("hotel-sala-colazioni")) {
    items.push({
      id: `${env.id}-buffet-colazioni-parafiato-cristallo-temperature-haccp`,
      area: env.name,
      title: "Linea Buffet Calda/Fredda con Cristalli Parafiato e Monitoraggio Temperature HACCP",
      question:
        "I banchi del buffet colazioni sono dotati di schermi parafiato continui in cristallo/vetro stratificato igienico, vasche calde a bagnomaria mantenute a ≥ 60°C e ripiani refrigerati a ≤ 4°C a tutela degli alimenti deperibili?",
      normReference: "Reg. CE 852/2004 Allegato II Capitoli V e IX e Linee Guida HACCP Ristorazione",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Alimenti sfusi al buffet (affettati, formaggi, yogurt) esposti senza protezione da goccioline respiratorie o privi di refrigerazione controllata.",
    });

    items.push({
      id: `${env.id}-vie-esodo-sala-coperti-porte-antipanico-uni-en-1125`,
      area: env.name,
      title: "Vie di Esodo tra i Tavoli (≥ 1,20 m) e Uscite con Maniglioni Antipanico (UNI EN 1125)",
      question:
        "La sala colazioni (80-120 coperti) garantisce corridoi di transito principali liberi di larghezza ≥ 1,20 m e uscite di emergenza con maniglioni antipanico a norma UNI EN 1125 apribili verso l'esterno?",
      normReference: "D.M. 09/04/1994 Titolo II punto 6 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Passaggi tra i tavoli della sala colazioni ristretti da carrelli di sbarazzo o uscite di sicurezza con maniglione antipanico ostruito.",
    });

    items.push({
      id: `${env.id}-estintori-omologati-34a-233b-luci-emergenza`,
      area: env.name,
      title: "Dotazione Estintori Omologati 34A 233B e Illuminazione di Emergenza",
      question:
        "La sala è dotata di estintori portatili omologati con capacità estinguente minima 34A 233B regolarmente revisionati e di illuminazione di emergenza autonoma conforme (D.M. 09/04/1994)?",
      normReference: "D.M. 09/04/1994 Titolo II punto 9 e D.M. 03/09/2021",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Estintori della sala colazioni non revisionati entro i 6 mesi o lampade di sicurezza non funzionanti in test di blackout.",
    });
  }

  // d) Office / Cucina Preparazione Colazioni & Rigenerazione Cibi
  if (env.id === "env-hotel-office-cucina-colazioni" || env.id.includes("hotel-office-cucina-colazioni")) {
    items.push({
      id: `${env.id}-cappa-aspirazione-filtri-labirinto-forni-doppio-vetro`,
      area: env.name,
      title: "Cappa d'Aspirazione Fumi con Filtri a Labirinto e Forni con Porta a Doppio Vetro",
      question:
        "L'office colazioni e rigenerazione dispone di cappa d'aspirazione fumi e vapori con filtri metallici a labirinto lavabili, canna fumaria con scarico a tetto e forni rigenerazione con porta a doppio vetro termoisolante?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.9 e Reg. CE 852/2004 Allegato II Capitolo I",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Filtri a labirinto della cappa saturi di unto e grasso con pericolo di innesco incendio o porta del forno non termoisolata con pericolo di ustioni.",
    });

    items.push({
      id: `${env.id}-lavamani-ginocchio-pedale-sapone-antibatterico`,
      area: env.name,
      title: "Lavamani a Comando Non Manuale (Ginocchio/Pedale) con Sapone Antibatterico",
      question:
        "È installato nell'office un lavamani dedicato ad azionamento non manuale (ginocchio o pedale), provvisto di miscelatore per acqua calda/fredda, erogatore di sapone liquido antibatterico e carta monouso a perdere?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I punto 4 e Capitolo II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Rubinetto lavamani ad azionamento manuale o assenza di sapone disinfettante e rotoli asciugamani a perdere.",
    });

    items.push({
      id: `${env.id}-lavastoviglie-break-tank-uni-en-1717-risciacquo-85c`,
      area: env.name,
      title: "Lavastoviglie Professionale con Break Tank UNI EN 1717 e Risciacquo a 85°C",
      question:
        "La lavastoviglie dell'office è provvista di Break Tank con disconnessione idrica conforme a UNI EN 1717 contro riflussi nella rete potabile e garantisce ciclo di risciacquo igienizzante a 85°C?",
      normReference: "Norma UNI EN 1717, Reg. CE 852/2004 Allegato II e D.Lgs. 18/2023",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavastoviglie priva di boiler di risciacquo a temperatura controllata (inferiore a 80-85°C) con rischio di sanificazione insufficiente di tazze e bicchieri.",
    });
  }

  // e) Lavanderia e Stireria Interna / Gestione Biancheria
  if (env.id === "env-hotel-lavanderia-stireria" || env.id.includes("hotel-lavanderia-stireria")) {
    items.push({
      id: `${env.id}-lavatrici-essiccatori-industriali-uni-en-iso-10472`,
      area: env.name,
      title: "Lavatrici ed Essiccatori Industriali a Norma UNI EN ISO 10472 con Blocchi di Sicurezza",
      question:
        "I macchinari di lavanderia ed essiccazione industriale rispondono alla norma UNI EN ISO 10472 e dispongono di interblocchi di sicurezza sull'apertura degli oblò e dispositivi di arresto di emergenza a riarmo manuale?",
      normReference: "Norma UNI EN ISO 10472 (parti 1-4) e D.Lgs. 81/2008 Allegato V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Oblò della lavatrice industriale privo di blocco elettromeccanico di sicurezza durante la centrifuga con rischio di lesioni gravissime per gli operatori.",
    });

    items.push({
      id: `${env.id}-calandra-mangano-barra-salvadita-microinterruttore-uni-en-iso-10472-5`,
      area: env.name,
      title: "Calandra Mangano con Barra Salvadita a Microinterruttore (UNI EN ISO 10472-5)",
      question:
        "La calandra mangano per stiratura lenzuola dispone di barra salvadita frontale con microinterruttore di sicurezza a contatto positivo che arresta istantaneamente la rotazione del rullo riscaldato in caso di contatto accidentale delle mani?",
      normReference: "Norma UNI EN ISO 10472-5 e D.Lgs. 81/2008 art. 70-71 e All. V",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Barra salvadita del mangano disallineata o manomessa con grave pericolo di schiacciamento e ustione delle mani dell'addetto alla stireria.",
    });

    items.push({
      id: `${env.id}-separazione-marcia-in-avanti-sporco-pulito-ventilazione`,
      area: env.name,
      title: "Separazione Marcia in Avanti Circuito Sporco/Pulito e Ventilazione Forzata Anti-Umidità",
      question:
        "Il locale lavanderia prevede un percorso a 'marcia in avanti' senza incrocio tra biancheria sporca da lavare e pulita stirata, con ventilazione meccanica forzata per l'estrazione di calore e vapori umidi?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.9 e Linee Guida di Igiene e Sanificazione Tessile",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Stoccaggio promiscuo di sacchi di biancheria sporca a contatto con la biancheria pulita pronta per i piani o umidità e condensa diffusa per mancata estrazione forzata.",
    });
  }

  // f) Guardaroba / Magazzino Biancheria Pulita & Depositi Piani
  if (env.id === "env-hotel-deposito-housekeeping" || env.id.includes("hotel-deposito-housekeeping")) {
    items.push({
      id: `${env.id}-scaffalature-biancheria-sollevate-15cm-portata-certificata`,
      area: env.name,
      title: "Scaffalature Metalliche Lisce Sollevate ≥ 15 cm da Terra con Cartello di Portata (UNI EN 15635)",
      question:
        "I ripiani del magazzino biancheria sono costituiti da scaffalature metalliche lisce e forate, sollevate almeno 15 cm dal pavimento per agevolare la pulizia, fissate stabilmente a parete e provviste di cartello di portata certificata?",
      normReference: "Norma UNI EN 15635 e D.Lgs. 81/2008 Allegato IV punto 1.4 e art. 71",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Scaffali metallici di stoccaggio biancheria privi di fissaggio a parete, instabili o caricati oltre la portata limite senza cartellino indicatore.",
    });

    items.push({
      id: `${env.id}-stoccaggio-carrelli-piani-schede-sicurezza-detergenti`,
      area: env.name,
      title: "Stoccaggio Carrelli Piani, Prodotti Cortesia e Schede di Sicurezza Detergenti (SDS)",
      question:
        "Il guardaroba di piano garantisce spazi idonei di sosta per i carrelli delle cameriere ai piani e conserva i prodotti chimici di pulizia nei flaconi originali con etichettatura CLP e schede di sicurezza (SDS) accessibili?",
      normReference: "D.Lgs. 81/2008 Titolo IX artt. 223-227 e Reg. CE 1272/2008 (CLP)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Presenza di prodotti per la pulizia delle camere travasi in bottiglie non etichettate o mancata disponibilità delle schede di sicurezza per gli addetti all'housekeeping.",
    });
  }

  // g) Centrale Idrica, Impianto ACS & Dosaggio Anti-Legionella
  if (env.id === "env-hotel-centrale-idrica-legionella" || env.id.includes("hotel-centrale-idrica-legionella")) {
    items.push({
      id: `${env.id}-temperatura-accumulo-acs-60c-ricircolo-50c-legionella`,
      area: env.name,
      title: "Temperatura Accumulo ACS ≥ 60°C e Rete di Ricircolo ≥ 50°C (Accordo Stato-Regioni 07/05/2015)",
      question:
        "I boiler di accumulo dell'acqua calda sanitaria (ACS) mantengono costantemente una temperatura non inferiore a 60°C e la rete di ricircolo garantisce almeno 50°C al rientro e sui punti terminali più distanti a prevenzione della Legionella?",
      normReference: "Accordo Stato-Regioni 07/05/2015 (Linee Guida Controllo Legionellosi) e D.Lgs. 18/2023",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Temperatura dell'acqua calda sanitaria erogata o del circuito di ricircolo inferiore a 50°C con rischio critico di proliferazione batterica di Legionella pneumophila.",
    });

    items.push({
      id: `${env.id}-registro-legionella-campionamenti-periodici-dosaggio-cloro`,
      area: env.name,
      title: "Registro Legionella Aggiornato, Campionamenti Periodici e Dosaggio Biossido di Cloro",
      question:
        "La struttura dispone di Registro Aziendale per il Rischio Legionellosi aggiornato, con Valutazione del Rischio redatta da tecnico qualificato, esecuzione di campionamenti periodici accreditati e impianto di dosaggio biossido di cloro / argento funzionante?",
      normReference: "Accordo Stato-Regioni 07/05/2015 par. 5, D.Lgs. 81/2008 Titolo X e D.Lgs. 18/2023",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Assenza del Registro di Controllo Legionellosi o mancata esecuzione dei campionamenti analitici microbiologici periodici sui terminali idrici dell'hotel.",
    });

    items.push({
      id: `${env.id}-disconnettori-idrici-uni-en-1717-vaso-espansione-sicurezza`,
      area: env.name,
      title: "Disconnettori Idrici a Norma UNI EN 1717 e Valvole di Sicurezza Boiler Verificate",
      question:
        "La centrale idrica dispone di disconnettori idraulici certificati UNI EN 1717 per prevenire ritorni d'acqua contaminata nell'acquedotto potabile e di valvole di sicurezza tarate e convogliate sui vasi di espansione dei boiler?",
      normReference: "Norma UNI EN 1717, D.Lgs. 18/2023 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancanza di disconnettore idraulico a riflusso o valvole di sovrapressione dei boiler di accumulo con scarico libero non convogliato verso pozzetto.",
    });
  }

  // h) Centrale Termica / Gruppi Frigo & Centrale Trattamento Aria (CTA)
  if (env.id === "env-hotel-centrale-termica-clima" || env.id.includes("hotel-centrale-termica-clima")) {
    items.push({
      id: `${env.id}-rilevatore-fughe-gas-elettrovalvola-esterna-dm-2019`,
      area: env.name,
      title: "Rilevatore Fughe Gas Metano con Elettrovalvola Esterna a Riarmo Manuale (D.M. 08/11/2019)",
      question:
        "La centrale termica a gas metano è dotata di sensore fughe gas tarato e omologato collegato a elettrovalvola esterna d'intercettazione a riarmo manuale normalmente chiusa e pulsante di sgancio rapido esterno?",
      normReference: "D.M. 08/11/2019, D.P.R. 151/2011 Attività 74 e Norma CEI 64-8",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Sensore di rilevazione gas metano non revisionato o elettrovalvola esterna bloccata in posizione aperta anche durante la prova di sgancio d'emergenza.",
    });

    items.push({
      id: `${env.id}-caldaie-valvole-inail-vaso-ped-attivita-74`,
      area: env.name,
      title: "Caldaie Centralizzate con Valvole di Sicurezza INAIL e Vasi Espansione PED (Attività 74)",
      question:
        "I generatori termici centralizzati dispongono di libretto d'impianto, valvole di sicurezza omologate con verbale di verifica periodica INAIL e vasi di espansione a norma della direttiva PED 2014/68/UE?",
      normReference: "Raccolta R INAIL, D.M. 01/12/1975, Direttiva PED 2014/68/UE e D.P.R. 151/2011 Attività 74",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Generatori di calore centralizzati privi di libretto di centrale aggiornato o con valvole di sicurezza INAIL prive di sigillo e verifica periodica.",
    });

    items.push({
      id: `${env.id}-centrale-trattamento-aria-cta-filtri-sanificazione-canali`,
      area: env.name,
      title: "Centrale Trattamento Aria (CTA/UTA): Pulizia Periodica Filtri e Sanificazione Canali",
      question:
        "Le Unità di Trattamento Aria (UTA) e canalizzazioni di climatizzazione sono sottoposte a pulizia periodica, sostituzione filtri semestrale e sanificazione antimicrobica certificata a tutela della qualità dell'aria?",
      normReference: "Accordo Stato-Regioni 07/05/2015, D.Lgs. 81/2008 Allegato IV punto 1.9 e Linee Guida AIISA",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "microclima_luce",
      suggestedNonConformity:
        "Filtri aria della CTA intasati o assenza di evidenza documentale di sanificazione e bonifica microbiologica dei canali dell'aria primaria.",
    });
  }

  // i) Locale Gruppo Elettrogeno & Vano Serbatoio Gasolio Emergenza
  if (env.id === "env-hotel-vano-gruppo-elettrogeno" || env.id.includes("hotel-vano-gruppo-elettrogeno")) {
    items.push({
      id: `${env.id}-vasca-contenimento-gasolio-110-dm-13-07-2011-attivita-49`,
      area: env.name,
      title: "Vasca di Contenimento Gasolio al 110% e Valvola di Intercettazione Combustibile (D.M. 13/07/2011)",
      question:
        "Il serbatoio di gasolio a servizio del gruppo elettrogeno è posizionato all'interno di bacino/vasca di contenimento metallica a tenuta stagna con capacità pari ad almeno il 110% del serbatoio stesso a norma D.M. 13/07/2011?",
      normReference: "D.M. 13/07/2011 Titolo I punto 5 e D.P.R. 151/2011 Attività 49",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Serbatoio gasolio del generatore privo di vasca di contenimento o con presenza di perdite di carburante non contenute sul pavimento del locale.",
    });

    items.push({
      id: `${env.id}-porta-tagliafuoco-ei120-aerazione-permanente-dm-2011`,
      area: env.name,
      title: "Porta Tagliafuoco EI 120 e Aperture di Aerazione Permanente verso l'Esterno",
      question:
        "Il locale del gruppo elettrogeno è compartimentato con porta tagliafuoco EI 120 dotata di chiudiporta a molla e dispone di aerazione naturale permanente verso l'esterno calcolata secondo il D.M. 13/07/2011?",
      normReference: "D.M. 13/07/2011 Titolo I punto 4 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Porta tagliafuoco del vano generatore manomessa o aperture di aerazione permanente ostruite da materiali o fogliame.",
    });

    items.push({
      id: `${env.id}-continuita-alimentazione-pompe-antincendio-luci-sicurezza`,
      area: env.name,
      title: "Quadro Elettrico di Commutazione e Continuità Alimentazione Pompe Antincendio",
      question:
        "Il generatore diesel garantisce avviamento automatico entro pochi secondi dal blackout con alimentazione preferenziale delle pompe del gruppo antincendio (UNI EN 12845) e degli ascensori antincendio?",
      normReference: "Norma CEI 64-8/7 sez. 718, UNI EN 12845 e D.M. 09/04/1994",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Mancata esecuzione della prova periodica mensile di accensione del generatore sotto carico o batterie di avviamento scariche.",
    });
  }

  // j) Vani Corsa Ascensori Ospiti & Montacarichi di Servizio
  if (env.id === "env-hotel-vani-ascensori-montacarichi" || env.id.includes("hotel-vani-ascensori-montacarichi")) {
    items.push({
      id: `${env.id}-teleallarme-bidirezionale-h24-uni-en-81-28`,
      area: env.name,
      title: "Dispositivo di Comunicazione Bidirezionale H24 a Norma UNI EN 81-28",
      question:
        "Tutte le cabine ascensori e montacarichi sono provviste di dispositivo di comunicazione bidirezionale a due vie costantemente attivo e collegato h24 a un centro di soccorso (UNI EN 81-28) per emergenze intrappolamento?",
      normReference: "Norma UNI EN 81-28 e D.P.R. 162/1999 art. 12",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Dispositivo di soccorso bidirezionale in cabina non funzionante, linea telefonica staccata o mancata risposta della centrale di soccorso nelle prove periodiche.",
    });

    items.push({
      id: `${env.id}-ritorno-automatico-piano-blackout-uni-en-81-20`,
      area: env.name,
      title: "Dispositivo di Ritorno Automatico al Piano con Apertura Porte in Caso di Blackout",
      question:
        "Gli ascensori dispongono di dispositivo di emergenza a batterie per la manovra automatica di accostamento al piano più vicino e riapertura delle porte in caso di improvvisa interruzione dell'alimentazione elettrica?",
      normReference: "Norma UNI EN 81-20 e D.M. 09/04/1994 Titolo II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Assenza del dispositivo di manovra automatica al piano con conseguente blocco della cabina tra due piani e panico per gli occupanti in blackout.",
    });

    items.push({
      id: `${env.id}-verifica-biennale-ascensori-dpr-162-99-ente-notificato`,
      area: env.name,
      title: "Verifica Periodica Biennale dell'Impianto da parte di Ente Notificato (D.P.R. 162/99)",
      question:
        "È disponibile il libretto di immatricolazione dell'ascensore con regolare assegnazione del numero di matricola comunale e verbale di verifica periodica biennale in corso di validità rilasciato da Ente Notificato o ASL/ARPA?",
      normReference: "D.P.R. 162/1999 art. 13 e 14 e D.Lgs. 81/2008 art. 71",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Verifica biennale obbligatoria dell'ascensore scaduta da oltre 24 mesi senza verbale di collaudo periodico dell'Organismo Notificato abilitato.",
    });
  }

  // k) Spogliatoi e Servizi Igienici Personale (Uomini e Donne)
  if (env.id === "env-hotel-spogliatoi-personale" || env.id.includes("hotel-spogliatoi-personale")) {
    items.push({
      id: `${env.id}-armadietti-doppio-scomparto-divise-alberghiere`,
      area: env.name,
      title: "Armadietti a Doppio Scomparto per Separazione Abiti Civili e Divise Alberghiere",
      question:
        "Gli spogliatoi del personale (uomini e donne) dispongono di armadietti metallici individuali lavabili a doppio scomparto con feritoie di aerazione per separare gli indumenti civili dalle divise da lavoro (camerieri, facchini, cuochi)?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.12 e Reg. CE 852/2004 Allegato II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Armadietti a scomparto singolo con promiscuità tra abiti civili e divise da servizio o numero insufficiente rispetto ai dipendenti in forza.",
    });

    items.push({
      id: `${env.id}-docce-lavamani-non-manuali-aerazione-temporizzata`,
      area: env.name,
      title: "Servizi Igienici con Docce Calde, Lavamani Non Manuali e Aerazione Temporizzata",
      question:
        "I servizi igienici annessi agli spogliatoi sono provvisti di piatti doccia con acqua calda, lavamani con comando a pedale/ginocchio, dispenser di sapone disinfettante e impianto di aspirazione forzata temporizzato se privi di finestre?",
      normReference: "D.Lgs. 81/2008 Allegato IV punti 1.13-1.14 e Reg. CE 852/2004 Allegato II",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Mancanza di erogazione di acqua calda nei bagni del personale, piatto doccia ostruito o estrattore dell'aria inattivo nel locale cieco.",
    });
  }

  // l) Area Deposito Rifiuti, Differenziata & Vano Compattatore
  if (env.id === "env-hotel-deposito-rifiuti-differenziata" || env.id.includes("hotel-deposito-rifiuti-differenziata")) {
    items.push({
      id: `${env.id}-area-rifiuti-lavabile-chiusino-sifonato-igiene`,
      area: env.name,
      title: "Area Rifiuti con Pavimentazione Lavabile, Presa d'Acqua e Canaletta di Scolo Sifonata",
      question:
        "Il locale di deposito rifiuti presenta pavimento e pareti impermeabili, presa d'acqua per il lavaggio frequente con gomma e canaletta di scolo a terra con chiusino sifonato per evitare ristagni e fuoriuscita di odori?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo VI e Regolamento di Igiene Pubblica",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Area rifiuti priva di allacciamento idrico per la pulizia o con pavimentazione fessurata e priva di scolo con formazione di percolato maleodorante.",
    });

    items.push({
      id: `${env.id}-cassonetti-ermetici-differenziata-protezione-infestanti`,
      area: env.name,
      title: "Cassonetti Ermetici con Coperchio per Raccolta Differenziata e Barriere Anti-Infestanti",
      question:
        "I rifiuti (umido/organico, vetro, plastica, cartone e indifferenziato) sono stoccati in contenitori rigidi chiudibili, puliti e sanificati periodicamente, in locale protetto dall'accesso di roditori e insetti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo VI e D.Lgs. 152/2006 art. 188",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Cassonetti dei rifiuti privi di coperchio, tracimanti o con sacchi depositati direttamente a terra con forte attrazione di mosche e roditori.",
    });

    items.push({
      id: `${env.id}-pressa-compattatore-uni-en-16500-dispositivi-protezione`,
      area: env.name,
      title: "Pressa Compattatrice Cartone/Plastica a Norma UNI EN 16500 con Protezioni Operatore",
      question:
        "L'eventuale pressa compattatrice per imballaggi in cartone o plastica è conforme alla norma armonizzata UNI EN 16500, dotata di sportello interbloccato a chiusura protetta e comandi bimanuali uomo presente?",
      normReference: "Norma UNI EN 16500 e D.Lgs. 81/2008 Allegato V e art. 71",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Compattatore di rifiuti con interblocco di sicurezza dello sportello manomesso o privo di istruzioni di emergenza e DPI obbligatori per l'uso.",
    });
  }

  // ========================================================================
  // REQUISITI SPECIFICI B&B, AFFITTACAMERE, CASE VACANZE & GUEST HOUSE (ATECO 55.20.51 / 55.20 / 55.2)
  // ========================================================================

  // a) Ingresso Principale, Check-in / Desk Accoglienza & Zona Comune
  if (env.id === "env-bnb-ingresso-reception" || env.id.includes("bnb-ingresso-reception")) {
    items.push({
      id: `${env.id}-estintore-13a-89b-dm-03-09-2021-minicodice`,
      area: env.name,
      title: "Estintore Portatile Omologato 13A 89B (D.M. 03/09/2021) e Presidio Antincendio",
      question:
        "L'ingresso principale / reception dispone di almeno un estintore portatile omologato di capacità estinguente non inferiore a 13A 89B a norma del D.M. 03/09/2021 (Mini-Codice Antincendio), installato a parete a un'altezza compresa tra 1,10 e 1,50 m con cartellino di revisione semestrale valido?",
      normReference:
        "D.M. 03/09/2021 (Criteri generali di progettazione, realizzazione ed esercizio della sicurezza antincendio per luoghi di lavoro a basso rischio) e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Estintore portatile assente all'ingresso/reception, ostruito da mobilio o privo del controllo periodico semestrale da parte di ditta abilitata a norma UNI 9994-1.",
    });

    items.push({
      id: `${env.id}-planimetria-esodo-bilingue-numeri-soccorso`,
      area: env.name,
      title: "Planimetria di Esodo Bilingue, Numeri di Emergenza e Istruzioni Evacuazione",
      question:
        "È chiaramente esposta nell'area di accoglienza/ingresso la planimetria orientata di emergenza ed esodo bilingue (italiano/inglese) con indicazione del punto di raccolta, percorsi di fuga e numeri di soccorso (112 NUE)?",
      normReference: "D.M. 03/09/2021, D.M. 02/09/2021 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Assenza di planimetria di esodo bilingue o cartellonistica di sicurezza non conforme, con rischio di mancato orientamento degli ospiti stranieri in caso di emergenza.",
    });

    items.push({
      id: `${env.id}-serratura-antipanico-smart-lock-illuminazione-emergenza`,
      area: env.name,
      title: "Porta d'Accesso con Apertura Facile dall'Interno (Smart Lock / Antipanico) e Illuminazione Emergenza",
      question:
        "La porta d'ingresso della struttura è apribile dall'interno senza l'uso di chiavi in qualunque momento (serratura antipanico o smart lock con sblocco meccanico immediato) ed è presente lampada di emergenza autoalimentata?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4.2 e D.M. 03/09/2021",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Porta principale chiusa a chiave dall'interno durante le ore notturne senza meccanismo di sgancio rapido per l'esodo di emergenza.",
    });
  }

  // b) Camere da Letto Ospiti (Standard, Superior & Camera Accessibile Disabili)
  if (env.id === "env-bnb-camere-ospiti" || env.id.includes("bnb-camere-ospiti")) {
    items.push({
      id: `${env.id}-rilevatori-ottici-autonomi-fumo-uni-en-14604`,
      area: env.name,
      title: "Rilevatori Ottici Autonomi di Fumo a Norma UNI EN 14604 in Ciascuna Camera",
      question:
        "Tutte le camere da letto ospiti sono provviste di rilevatori ottici autonomi di fumo conformi alla norma UNI EN 14604 alimentati a batteria a lunga durata (10 anni) con pulsante di test e segnale acustico di allarme?",
      normReference: "Norma UNI EN 14604, D.M. 03/09/2021 e Legge Regionale Ricettività Extra-Alberghiera",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Mancanza di dispositivi autonomi di rivelazione fumo nelle camere ospiti o batterie scariche senza verifiche periodiche di funzionamento.",
    });

    items.push({
      id: `${env.id}-aerazione-naturale-rapporto-aeroilluminante-finestre`,
      area: env.name,
      title: "Rapporto Aeroilluminante Naturale Diretto (≥ 1/8) e Finestre Apribili in Sicurezza",
      question:
        "Le camere da letto garantiscono un rapporto aeroilluminante naturale non inferiore a 1/8 della superficie di calpestio (D.M. 05/07/1975) con serramenti apribili in sicurezza privi di rischio caduta verso l'esterno?",
      normReference: "D.M. 05/07/1975 art. 5 e D.Lgs. 81/2008 Allegato IV punto 1.3",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "finestre",
      suggestedNonConformity:
        "Finestre delle camere bloccate o con superficie apribile inferiore a 1/8, comportante insufficiente ricambio d'aria naturale o rischio di accumulo di umidità.",
    });

    items.push({
      id: `${env.id}-ergonomia-rifacimento-letti-prevenzione-dms-housekeeping`,
      area: env.name,
      title: "Ergonomia Arredi e Prevenzione Sovraccarico Biomeccanico Addetti Pulizie (D.Lgs. 81/08 Titolo VI)",
      question:
        "I letti e gli arredi delle camere consentono spazi di manovra laterali adeguati per le operazioni di pulizia e rifacimento letto, prevenendo posture incongrue e flessioni ripetute del rachide da parte del personale (D.Lgs. 81/08 Titolo VI)?",
      normReference: "D.Lgs. 81/2008 Titolo VI e Allegato XXXIII (Movimentazione Manuale dei Carichi e Sovraccarico Biomeccanico)",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Letti incassati senza spazio di accesso laterale o materassi sprovvisti di maniglie di presa ergonomiche, che costringono l'operatore a torsioni e sovraccarico lombare continuo.",
    });

    items.push({
      id: `${env.id}-planimetria-fuga-retro-porta-istruzioni-emergenza`,
      area: env.name,
      title: "Istruzioni di Sicurezza e Planimetria di Fuga sul Retro della Porta di Ciascuna Camera",
      question:
        "Sul retro della porta d'accesso di ciascuna camera è presente il cartello con la planimetria orientata di fuga indicante la posizione della camera, l'uscita più vicina e le norme di comportamento in caso di incendio?",
      normReference: "D.M. 03/09/2021 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Mancanza del prospetto di evacuazione dietro le porte delle camere o planimetria non orientata rispetto alla reale collocazione della stanza.",
    });
  }

  // c) Servizi Igienici Privati Camere & Bagno Disabili (D.P.R. 503/96)
  if (env.id === "env-bnb-bagni-privati" || env.id.includes("bnb-bagni-privati")) {
    items.push({
      id: `${env.id}-bagno-disabili-tirante-campanello-maniglioni-dpr-503-96`,
      area: env.name,
      title: "Bagno Accessibile Disabili con Tirante Allarme a Campanello e Maniglioni (D.P.R. 503/96 - D.M. 236/89)",
      question:
        "Il bagno per ospiti a ridotta capacità motoria è dotato di campanello d'allarme a tirante azionabile anche da terra con suoneria e luce ottica all'esterno, wc accessibile con doccetta, maniglioni di sostegno orizzontali e doccia a filo pavimento?",
      normReference: "D.P.R. 503/1996, D.M. 236/1989 art. 8.1.6 e Legge 104/1992",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Tirante a fune di allarme assente o con corda tagliata non raggiungibile da terra in caso di caduta dell'ospite, o maniglioni di sostegno non ancorati solidamente.",
    });

    items.push({
      id: `${env.id}-prevenzione-legionella-soffioni-doccia-anticalcare-flussaggio`,
      area: env.name,
      title: "Prevenzione Rischio Legionellosi: Soffioni Doccia Ispezionabili, Decalcificazione e Flussaggio",
      question:
        "I soffioni delle docce, i flessibili e i rompigetto dei rubinetti sono smontabili ed ispezionabili, sottoposti a decalcificazione periodica e a flussaggio preventivo ad alta temperatura prima dell'arrivo di nuovi ospiti (Accordo 07/05/2015 e D.Lgs. 18/2023)?",
      normReference:
        "Linee Guida Nazionali per la Prevenzione della Legionellosi (Accordo Stato-Regioni 07/05/2015) e D.Lgs. 18/2023",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Soffioni doccia ostruiti da incrostazioni calcaree o biofilm batterico e mancato flussaggio dei terminali idrici nelle camere non occupate da oltre una settimana.",
    });

    items.push({
      id: `${env.id}-pavimentazione-antiscivolo-aerazione-forzata-temporizzata`,
      area: env.name,
      title: "Pavimentazione Antiscivolo e Aerazione Meccanica Forzata Temporizzata per Bagni Ciechi",
      question:
        "La pavimentazione dei servizi igienici garantisce caratteristiche antisdrucciolo a piedi bagnati, e negli eventuali bagni ciechi è presente elettroaspiratore temporizzato con espulsione diretta verso l'esterno a norma del D.M. 05/07/1975?",
      normReference: "D.M. 05/07/1975 art. 7 e D.Lgs. 81/2008 Allegato IV punto 1.3",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Aspiratore del bagno cieco non funzionante con ristagno prolungato di vapore e condense, o piatto doccia scivoloso privo di trattamento o tappetino antiscivolo.",
    });
  }

  // d) Area Colazioni, Zona Living & Tavoli Ospiti
  if (env.id === "env-bnb-sala-colazioni" || env.id.includes("bnb-sala-colazioni")) {
    items.push({
      id: `${env.id}-buffet-parafiato-moca-reg-ce-1935-2004-igiene`,
      area: env.name,
      title: "Esposizione Alimenti Buffet con Protezioni Parafiato MOCA (Reg. CE 1935/2004 e Reg. CE 852/2004)",
      question:
        "I prodotti alimentari sfusi esposti al buffet della colazione (dolci, pane, frutta, cereali) sono protetti da campane, vetrine o alzatine parafiato conformi alla disciplina dei materiali a contatto con alimenti MOCA (Reg. CE 1935/2004)?",
      normReference: "Reg. CE 1935/2004, Reg. CE 852/2004 Allegato II Capitolo V e D.Lgs. 29/2017",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Alimenti da forno o affettati lasciati aperti sul tavolo colazioni senza alcuna protezione da polvere, tosse o manipolazione diretta da parte dei clienti.",
    });

    items.push({
      id: `${env.id}-cartello-allergeni-prodotti-colazione-reg-ue-1169-2011`,
      area: env.name,
      title: "Informativa Allergeni Scritta e Chiaramente Visibile sul Buffet (Reg. UE 1169/2011)",
      question:
        "È presente sul tavolo delle colazioni un'informativa scritta ben visibile e dettagliata contenente l'elenco dei 14 allergeni alimentari presenti nei singoli cibi e bevande somministrati, a norma del Reg. UE 1169/2011 e D.Lgs. 231/2017?",
      normReference: "Regolamento UE 1169/2011 art. 44 e D.Lgs. 231/2017 art. 19",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Assenza del cartello o registro degli allergeni per i prodotti somministrati a colazione, con grave rischio anafilattico per soggetti allergici o intolleranti.",
    });

    items.push({
      id: `${env.id}-vie-esodo-sala-sgombre-estintore-adiacente`,
      area: env.name,
      title: "Vie di Fuga Libere (0,90-1,20 m) e Presidio Estintore Portatile Adiacente alla Sala",
      question:
        "I passaggi tra i tavoli e le porte di uscita della sala colazioni/living garantiscono percorsi di esodo sgombri con larghezza minima di almeno 0,90-1,20 m e la presenza di un estintore portatile prontamente utilizzabile?",
      normReference: "D.M. 03/09/2021 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Percorsi di transito della sala ostruiti da sedie supplementari, bagagli o mobili con larghezza utile ridotta al di sotto delle dimensioni di sicurezza.",
    });
  }

  // e) Kitchenette / Angolo Cottura, Scaldavivande & Office Colazioni
  if (env.id === "env-bnb-kitchenette-office" || env.id.includes("bnb-kitchenette-office")) {
    items.push({
      id: `${env.id}-cappa-aspirazione-canna-fumaria-pareti-lavabili`,
      area: env.name,
      title: "Cappa d'Aspirazione Fumi canalizzata/filtrante e Pareti Lavabili fino a 2 Metri",
      question:
        "Il punto cottura dell'angolo colazioni è provvisto di cappa d'aspirazione fumi e vapori efficiente con filtri puliti, e le pareti circostanti sono rivestite con materiale liscio, impermeabile e disinfettabile fino a 2 metri di altezza (Reg. CE 852/2004)?",
      normReference: "Reg. CE 852/2004 Allegato II Capitoli I e II e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Piano cottura privo di cappa aspirante o con filtri saturi di grasso, oppure pareti della kitchenette tinteggiate a tempera assorbente soggetta a muffe.",
    });

    items.push({
      id: `${env.id}-frigorifero-termometro-lettura-esterna-4c-haccp`,
      area: env.name,
      title: "Frigorifero per Alimenti Colazione a +4°C con Termometro e Monitoraggio HACCP",
      question:
        "Il frigorifero destinato alla conservazione di latte, yogurt, burro, formaggi e prodotti deperibili è dotato di termometro di precisione a lettura esterna mantenuto costantemente a temperatura ≤ +4°C con monitoraggio giornaliero?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo IX e Linee Guida HACCP",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Frigorifero alimenti colazione privo di termometro di controllo o con temperatura riscontrata superiore a +8°C con rischio proliferazione batterica.",
    });

    items.push({
      id: `${env.id}-piano-cottura-sicurezza-termocoppia-induzione-dm-37-08`,
      area: env.name,
      title: "Piano Cottura a Gas con Termocoppia di Sicurezza o Induzione (D.M. 37/08 e UNI 7129)",
      question:
        "Il piano cottura a gas dispone di valvole di sicurezza a termocoppia su tutti i fuochi per blocco automatico del gas in caso di spegnimento fiamma, o in alternativa piano a induzione magnetica con blocco tasti bambini e conformità D.M. 37/08?",
      normReference: "D.M. 37/2008, Norma UNI 7129 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Fornello a gas vetusto privo di dispositivo di sicurezza termocoppia o tubo flessibile del gas scaduto con rischio perdita gas ed esplosione.",
    });

    items.push({
      id: `${env.id}-lavastoviglie-ciclo-termico-igienizzante-stoviglie-moca`,
      area: env.name,
      title: "Lavastoviglie con Ciclo Igienizzante ad Alta Temperatura e Stoviglie MOCA",
      question:
        "Le stoviglie, tazze, bicchieri e posate utilizzate per la colazione vengono sanificate tramite lavastoviglie con ciclo igienizzante ad alta temperatura (risciacquo ≥ 65-70°C) e sono riposte al riparo da polvere e contaminanti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e Reg. CE 1935/2004",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Lavaggio manuale approssimativo delle tazzine con acqua tiepida senza sanificazione o stoviglie scheggiate mantenute in uso.",
    });
  }

  // f) Ripostiglio Guardaroba, Biancheria Pulita & Kit Cortesia
  if (env.id === "env-bnb-guardaroba-biancheria" || env.id.includes("bnb-guardaroba-biancheria")) {
    items.push({
      id: `${env.id}-stoccaggio-biancheria-pulita-armadi-chiusi-sollevati-15cm`,
      area: env.name,
      title: "Stoccaggio Biancheria Pulita in Armadi Chiusi o Sollevati ≥ 15 cm da Terra",
      question:
        "La biancheria pulita (lenzuola, federe, asciugamani sigillati) e i kit di cortesia sono stoccati in armadi chiusi o su scaffalature lisce sollevate almeno 15 cm dal pavimento in ambiente asciutto, aerato e sanificato?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I e D.Lgs. 81/2008 Allegato IV punto 1.1",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Biancheria da letto pulita appoggiata direttamente a terra o su ripiani polverosi esposti ad umidità o infestanti.",
    });

    items.push({
      id: `${env.id}-scaffalature-stabili-fissaggio-parete-antiribaltamento`,
      area: env.name,
      title: "Stabilità Scaffalature e Fissaggio Antiribaltamento (D.Lgs. 81/08 All. IV)",
      question:
        "Le scaffalature del ripostiglio biancheria sono stabili, integre, provviste di staffaggio antiribaltamento a parete e con carichi distribuiti in modo uniforme (materiali più pesanti sui ripiani inferiori)?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.1 e Titolo I",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Scaffali metallici instabili, non ancorati a parete o sovraccaricati sui ripiani alti con rischio di collasso addosso all'operatore.",
    });
  }

  // g) Locale Lavanderia Interna, Stireria & Deposito Detergenti
  if (env.id === "env-bnb-lavanderia-office" || env.id.includes("bnb-lavanderia-office")) {
    items.push({
      id: `${env.id}-armadietto-chiuso-detergenti-sds-etichettatura-clp`,
      area: env.name,
      title: "Armadietto Chiuso per Prodotti Chimici Detergenti con Schede di Sicurezza SDS (CLP)",
      question:
        "I prodotti detergenti, disinfettanti e anticalcare utilizzati per il bucato e le pulizie sono conservati in armadietto chiuso con chiave, nelle confezioni originali etichettate a norma Reg. CE 1272/2008 (CLP) con SDS aggiornate?",
      normReference: "D.Lgs. 81/2008 Titolo IX (Sostanze Pericolose), art. 227 e Regolamento CE 1272/2008",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Detergenti chimici travasati in bottiglie anonime prive di etichetta o conservati a giorno senza armadietto chiuso con rischio intossicazione o ustioni chimiche.",
    });

    items.push({
      id: `${env.id}-sicurezza-elettrica-lavatrice-asciugatrice-ferro-stiro`,
      area: env.name,
      title: "Sicurezza Elettrica Elettrodomestici Lavanderia e Postazione Stiro Ergonomica",
      question:
        "La lavatrice, l'asciugatrice e il ferro da stiro a vapore sono collegati a prese conformi CEI dotate di messa a terra, il ferro poggia su supporto termoisolante stabile e il cavo elettrico è privo di spellature o danneggiamenti?",
      normReference: "D.Lgs. 81/2008 Titolo III Capo III (Impianti e Apparecchi Elettrici) e D.M. 37/2008",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Uso di adattatori multipli o prolunghe volanti per alimentare contemporaneamente lavatrice ed asciugatrice con rischio surriscaldamento ed incendio.",
    });
  }

  // h) Vano Caldaia Murale a Condensazione & Accumulo ACS (Boiler)
  if (env.id === "env-bnb-centrale-termica-boiler" || env.id.includes("bnb-centrale-termica-boiler")) {
    items.push({
      id: `${env.id}-temperatura-accumulo-boiler-acs-55-60c-legionella`,
      area: env.name,
      title: "Temperatura Accumulo ACS nel Boiler ≥ 55-60°C per Prevenzione Legionellosi",
      question:
        "Il boiler/accumulatore di acqua calda sanitaria (ACS) è tarato e mantenuto costantemente a una temperatura non inferiore a 55-60°C al fine di inibire la proliferazione batterica di Legionella pneumophila (Accordo 07/05/2015 e D.Lgs. 18/2023)?",
      normReference:
        "Accordo Stato-Regioni 07/05/2015 (Linee Guida Legionellosi) e D.Lgs. 18/2023 (Qualità delle acque destinate al consumo umano)",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Temperatura del bollitore ACS impostata a valori inferiori a 50°C per risparmio energetico, creando condizioni ottimali per la moltiplicazione di Legionella nella rete idrica.",
    });

    items.push({
      id: `${env.id}-caldaia-condensazione-libretto-impianto-scarico-fumi-dm-37-08`,
      area: env.name,
      title: "Caldaia a Condensazione a Norma D.M. 37/08, Scarico Fumi a Tetto e Libretto d'Impianto",
      question:
        "La caldaia murale dispone di Dichiarazione di Conformità D.M. 37/08, libretto di impianto termico di climatizzazione con rapporti di efficienza energetica periodici e canna fumaria con scarico fumi certificato a tetto?",
      normReference: "D.M. 37/2008, D.P.R. 74/2013 e Norma UNI 7129",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Caldaia priva di libretto d'impianto aggiornato o con manutenzione annuale omessa e scarico condensa non convogliato a norma.",
    });

    items.push({
      id: `${env.id}-rilevatore-gas-valvola-sicurezza-scarico-convogliato`,
      area: env.name,
      title: "Rilevatore Fughe Gas Combustibile e Valvola di Sicurezza Sovrapressione con Scarico Convogliato",
      question:
        "Nel locale caldaia è installato un rilevatore di fughe di gas metano/GPL con segnalazione di allarme, e la valvola di sicurezza di sovrapressione del circuito idraulico presenta scarico convogliato per evitare allagamenti e getti di vapore?",
      normReference: "Norma UNI 7129, D.M. 37/2008 e D.Lgs. 81/2008 Allegato IV",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Assenza di rilevatore di gas in vano chiuso o valvola di sicurezza del boiler con scarico libero a parete con rischio ustioni in caso di apertura accidentale.",
    });
  }

  // i) Terrazzo, Balconi & Spazi di Sosta all'Aperto
  if (env.id === "env-bnb-terrazzo-balconi" || env.id.includes("bnb-terrazzo-balconi")) {
    items.push({
      id: `${env.id}-parapetti-ringhiere-altezza-100cm-inscalabili`,
      area: env.name,
      title: "Parapetti e Ringhiere di Protezione a Norma (Altezza ≥ 1,00 m, Inscalabili)",
      question:
        "I balconi e i terrazzi accessibili agli ospiti presentano parapetti o ringhiere di protezione con altezza minima non inferiore a 1,00 m dal piano di calpestio, privi di fessure con luce superiore a 10 cm e privi di traverse orizzontali scalabili da bambini?",
      normReference: "D.M. 236/1989 punto 8.1.8 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 5,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Ringhiera del balcone con altezza inferiore a 1,00 m o con elementi orizzontali che consentono la facile arrampicata, con grave pericolo di precipitazione nel vuoto.",
    });

    items.push({
      id: `${env.id}-pavimentazione-esterna-antiscivolo-r11-illuminazione`,
      area: env.name,
      title: "Pavimentazione Esterna Antiscivolo (R11) e Illuminazione Notturna di Sicurezza",
      question:
        "La pavimentazione degli spazi esterni garantisce adeguate caratteristiche antiscivolo anche in presenza di bagnato (classe R11) ed è presente illuminazione artificiale per prevenire inciampi e cadute nelle ore serali/notturne?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.3 e D.M. 236/1989",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Pavimentazione del terrazzo scivolosa o fessurata con presenza di muschio o priva di illuminazione notturna sui gradini di accesso.",
    });
  }

  // j) Vano Scale, Corridoi di Distribuzione & Disimpegni Piani
  if (env.id === "env-bnb-scale-disimpegni" || env.id.includes("bnb-scale-disimpegni")) {
    items.push({
      id: `${env.id}-gradini-antisdrucciolo-corrimano-continuo-vie-esodo`,
      area: env.name,
      title: "Scale Interne con Gradini Antisdrucciolo, Corrimano Continuo e Percorsi Liberi",
      question:
        "Le scale di collegamento ai piani presentano gradini a pianta regolare con profilo o striscia antisdrucciolo, corrimano continuo a norma posizionato ad altezza compresa tra 0,90 e 1,00 m e percorsi di transito liberi da qualsiasi ingombro?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.7 e D.M. 236/1989 punto 8.1.10",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Gradini scivolosi privi di paraspigolo antisdrucciolo, corrimano assente o interrotto, o deposito di valigie/scatoloni sulle rampe con ostacolo all'esodo.",
    });

    items.push({
      id: `${env.id}-luci-emergenza-led-autonomia-1h-accensione-automatica`,
      area: env.name,
      title: "Illuminazione di Emergenza a LED con Autonomia ≥ 1 Ora lungo le Scale e i Disimpegni",
      question:
        "Lungo le scale e i corridoi di distribuzione sono installate lampade di emergenza a led autoalimentate con autonomia non inferiore a 60 minuti, ad accensione automatica immediata in caso di interruzione dell'energia elettrica?",
      normReference: "Norma UNI EN 1838, D.M. 03/09/2021 e D.Lgs. 81/2008 Allegato IV punto 1.4",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Lampade di emergenza con batterie esauste non funzionanti al test di disconnessione della corrente elettrica con rischio panico e cadute al buio.",
    });
  }

  // k) Armadio / Ripostiglio Attrezzature Pulizie & Carrello Piani
  if (env.id === "env-bnb-ripostiglio-housekeeping" || env.id.includes("bnb-ripostiglio-housekeeping")) {
    items.push({
      id: `${env.id}-attrezzature-pulizia-aspirapolvere-hepa-mop-separati`,
      area: env.name,
      title: "Attrezzature di Pulizia Housekeeping, Aspirapolvere con Filtro HEPA e Mop Distinti",
      question:
        "Le attrezzature per le pulizie (aspirapolvere dotato di filtro HEPA per trattenere polveri e allergeni, carrello pulizie, mop e panni in microfibra) sono pulite, igienizzate e differenziate per colore (rosso bagni, blu camere) per prevenire contaminazioni crociate?",
      normReference: "D.Lgs. 81/2008 Titolo X (Agenti Biologici) e Reg. CE 852/2004 Allegato II Capitolo I",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Uso indiscriminato dello stesso straccio o mop sia per la sanificazione dei servizi igienici che per i pavimenti delle camere da letto con cross-contaminazione microbica.",
    });

    items.push({
      id: `${env.id}-dotazione-dpi-operatori-pulizie-guanti-mascherine`,
      area: env.name,
      title: "Dispositivi di Protezione Individuale (DPI) per il Personale di Pulizia e Housekeeping",
      question:
        "È presente in apposito armadietto pulito una scorta adeguata di DPI per gli addetti alle pulizie (guanti monouso in nitrile/gomma a protezione chimica e biologica, mascherine protettive, calzature antiscivolo a norma EN ISO 20347)?",
      normReference: "D.Lgs. 81/2008 Titolo III Capo II (Uso dei DPI) artt. 75, 77 e 78",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Addetti alle pulizie operanti privi di guanti protettivi adatti al contatto con candeggina/disinfettanti o privi di calzature chiuse antiscivolo.",
    });
  }

  // l) Zona Raccolta Differenziata Rifiuti & Stoccaggio Imballaggi
  if (env.id === "env-bnb-area-rifiuti-differenziata" || env.id.includes("bnb-area-rifiuti-differenziata")) {
    items.push({
      id: `${env.id}-bidoni-raccolta-differenziata-coperchio-pedale-ermetici`,
      area: env.name,
      title: "Contenitori Raccolta Differenziata con Coperchio a Pedale e Chiusura Ermetica",
      question:
        "I contenitori per la raccolta differenziata dei rifiuti (frazione organica, plastica/metallo, carta, vetro, secco residuo) sono in materiale plastico rigido lavabile, dotati di coperchio a tenuta e azionamento a pedale per evitare il contatto manuale?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo VI e D.Lgs. 152/2006 art. 188",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Bidoni dell'umido sprovvisti di coperchio o con pedale rotto che costringe all'apertura manuale, con rischio contaminazione e sviluppo di odori molesti.",
    });

    items.push({
      id: `${env.id}-pavimentazione-lavabile-pulizia-periodica-lotta-infestanti`,
      area: env.name,
      title: "Pavimentazione Lavabile, Igiene del Locale Rifiuti e Protezione da Infestanti",
      question:
        "L'area destinata alla sosta dei rifiuti presenta pavimento e pareti lavabili, è mantenuta costantemente pulita e disinfettata ed è protetta contro l'intrusione di animali e parassiti (Reg. CE 852/2004)?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo VI e Regolamento Locale di Igiene",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Area rifiuti con pavimentazione sporca da colature di liquidi organici, residui accumulati all'esterno dei contenitori e presenza di formiche o roditori.",
    });
  }

  // ========================================================================
  // REQUISITI SPECIFICI OSTELLO, RESIDENCE, ALLOGGI STUDENTI E TURISTI (ATECO 55.20.20 / 55.20.2)
  // ========================================================================

  // a) Reception, Desk Accoglienza H24 & Lounge Sociale
  if (env.id === "env-ost-reception-lounge" || env.id.includes("ost-reception-lounge")) {
    items.push({
      id: `${env.id}-postazione-vdt-ergonomica-quadro-differenziale-30ma`,
      area: env.name,
      title: "Postazione Reception VDT Ergonomica e Quadro Elettrico Differenziale ad Alta Sensibilità",
      question:
        "La postazione di reception/accoglienza è dotata di seduta ergonomica regolabile con supporto lombare, illuminazione priva di abbagliamento conforme al Titolo VII del D.Lgs. 81/08 e il quadro elettrico d'area dispone di interruttore differenziale coordinato da 30 mA regolarmente provato?",
      normReference: "D.Lgs. 81/2008 Titolo VII (Attrezzature munite di videoterminali) e CEI 64-8",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Sedia reception non regolabile, cablaggi volanti a terra privi di canalina passacavi e quadro privo di verifica periodica del tasto test del differenziale.",
    });

    items.push({
      id: `${env.id}-estintore-34a-233b-planimetria-esodo-bilingue-112`,
      area: env.name,
      title: "Presidio Antincendio Estintore 34A 233B, Planimetria di Esodo Bilingue e Numeri di Soccorso",
      question:
        "Nella reception/lounge sociale è presente un estintore portatile omologato di capacità almeno 34A 233B regolarmente revisionato ogni 6 mesi, accompagnato da planimetria di emergenza bilingue (italiano/inglese) con indicazione chiara del punto di raccolta e del Numero Unico di Emergenza 112?",
      normReference: "D.M. 03/09/2021 (Mini-Codice), D.M. 09/04/1994 e D.Lgs. 81/2008 art. 43",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Estintore scaduto di revisione o nascosto da arredi; assenza di planimetria di orientamento ed esodo per gli ospiti internazionali.",
    });

    items.push({
      id: `${env.id}-videosorveglianza-privacy-cassette-sicurezza-gdpr`,
      area: env.name,
      title: "Informativa Videosorveglianza Privacy e Cassette di Sicurezza Ospiti",
      question:
        "L'impianto di videosorveglianza presente nella reception e nella lounge dispone di cartellonistica di avviso a norma GDPR/Garante Privacy (con accordo sindacale o autorizzazione ITL se inquadra personale dipendente) e le cassette di sicurezza/lockers per valori sono ancorate saldamente alle pareti?",
      normReference: "D.Lgs. 196/2003, Reg. UE 2016/679 (GDPR) e Statuto dei Lavoratori art. 4",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Telecamere attive prive di cartello di informativa per gli ospiti e i lavoratori, o cassette di sicurezza appoggiate senza ancoraggio antiribaltamento.",
    });
  }

  // b) Dormitori Comuni & Camerate a Letti a Castello
  if (env.id === "env-ost-dormitori-camerate" || env.id.includes("ost-dormitori-camerate")) {
    items.push({
      id: `${env.id}-letti-castello-spondine-scalette-uni-en-747`,
      area: env.name,
      title: "Conformità di Sicurezza Letti a Castello UNI EN 747: Spondine Anticaduta e Scalette Fisse",
      question:
        "I letti a castello presenti nei dormitori comuni sono conformi alla norma UNI EN 747, con spondine di protezione anticaduta continue sui quattro lati del letto superiore (altezza libera minima 260 mm dal materasso) e scaletta di accesso saldamente ancorata alla struttura con gradini antiscivolo?",
      normReference: "UNI EN 747-1/2 (Requisiti di sicurezza e prove per letti a castello) e D.Lgs. 81/2008 art. 64",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Letti a castello privi di sponde di protezione sul letto superiore o con spondine oscillanti e scalette mobili pericolose per la caduta degli occupanti.",
    });

    items.push({
      id: `${env.id}-rilevatori-ottici-fumo-indirizzati-uni-en-54`,
      area: env.name,
      title: "Rilevatori Ottici di Fumo Indirizzati a Soffitto Collegati a Centrale Antincendio",
      question:
        "In ciascun dormitorio e camerata comune è installato a soffitto un rilevatore ottico di fumo indirizzato a norma UNI EN 54 collegato alla centrale antincendio della struttura, sottoposto a manutenzione semestrale certificata da tecnico abilitato?",
      normReference: "D.M. 09/04/1994, D.M. 14/07/2015 e norma UNI EN 54-7 (Sistemi di rivelazione incendi)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Rilevatore di fumo assente, scollegato o privo del registro dei controlli periodici obbligatori antincendio.",
    });

    items.push({
      id: `${env.id}-planimetria-esodo-bilingue-retro-porta-istruzioni`,
      area: env.name,
      title: "Planimetria di Esodo Bilingue Affissa sul Retro della Porta della Camerata",
      question:
        "Sul retro della porta d'ingresso della camerata è stabilmente affissa la planimetria schematica di piano con l'indicazione 'Voi siete qui', i percorsi di fuga bilingue (italiano/inglese), l'ubicazione degli estintori, dei pulsanti d'allarme e le norme di comportamento in caso di terremoto o incendio?",
      normReference: "D.M. 09/04/1994 Titolo IV e D.Lgs. 81/2008 Allegato IV punto 1.8",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Assenza delle istruzioni di emergenza e del layout di fuga sul retroporta del dormitorio.",
    });

    items.push({
      id: `${env.id}-armadietti-individuali-serratura-prese-protette`,
      area: env.name,
      title: "Armadietti Metallici Individuali con Serratura/Badge e Prese con Alveoli Schermati",
      question:
        "Ogni posto letto dispone di un armadietto metallico individuale lavabile e igienizzabile con chiusura di sicurezza (lucchetto personale o transponder RFID), e i punti presa elettrici/USB in prossimità dei letti hanno alveoli schermati contro contatti accidentali a norma CEI?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.12 e CEI 64-8",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Assenza di armadietti chiudibili per la custodia sicura del bagaglio degli ospiti o prese elettriche danneggiate con parti attive a vista.",
    });
  }

  // c) Camere Private / Monolocali Residence con Bagno Esclusivo
  if (env.id === "env-ost-camere-private" || env.id.includes("ost-camere-private")) {
    items.push({
      id: `${env.id}-camere-disabili-pmr-porte-manovra-dpr-503-96`,
      area: env.name,
      title: "Accessibilità Camere Private per Disabili PMR (D.P.R. 503/96 e D.M. 236/89)",
      question:
        "Le camere private/residence riservate a persone con disabilità o ridotta capacità motoria presentano varchi porta con larghezza netta ≥ 80 cm, spazio di rotazione per sedia a ruote con diametro ≥ 150 cm e percorsi complanari privi di dislivelli e scalini?",
      normReference: "D.P.R. 503/1996, D.M. 236/1989 e Legge 104/1992",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Porte di accesso con luce netta inferiore a 80 cm, presenza di gradini di soglia non raccordati con rampe o spazi insufficienti per manovra sedia a ruote.",
    });

    items.push({
      id: `${env.id}-campanello-allarme-tirante-bagno-privato-soccorso`,
      area: env.name,
      title: "Campanello d'Allarme a Tirante nel Bagno Privato con Suoneria Esterna",
      question:
        "Nei bagni delle camere e in particolare nei servizi accessibili è presente in prossimità del WC e del box doccia un tirante d'emergenza con cordicella a meno di 20 cm da terra, collegato a suoneria ottico-acustica esterna per allertare il personale in caso di caduta o malore?",
      normReference: "D.M. 236/1989 art. 8.1.6 e D.P.R. 503/1996",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Tirante allarme del bagno mancante, arrotolato in alto fuori dalla portata di persona caduta a terra o non funzionante.",
    });

    items.push({
      id: `${env.id}-porte-tagliafuoco-ei30-chiudiporta-dm-09-04-1994`,
      area: env.name,
      title: "Porte delle Camere Resistenti al Fuoco EI 30 con Chiudiporta Idraulico Automatico",
      question:
        "Le porte di accesso delle camere private verso i corridoi di piano possiedono classe di resistenza al fuoco almeno EI 30, guarnizioni per la tenuta ai fumi freddi e dispositivo di autochiusura perfettamente funzionante senza zeppe di blocco?",
      normReference: "D.M. 09/04/1994 Titolo II punto 4 (se struttura > 25 posti letto) e UNI EN 1634",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Porte tagliafuoco bloccate aperte mediante cunei in legno o prive di guarnizione intumescente integra sul perimetro del telaio.",
    });
  }

  // d) Blocco Servizi Igienici & Docce Multiple Comuni
  if (env.id === "env-ost-servizi-igienici-comuni" || env.id.includes("ost-servizi-igienici-comuni")) {
    items.push({
      id: `${env.id}-disinfezione-soffioni-doccia-legionella-dlgs-18-2023`,
      area: env.name,
      title: "Disinfezione Periodica Anticalcare Soffioni Doccia e Flussaggio Anti-Legionella",
      question:
        "I soffioni delle docce multiple e i flessibili vengono sottoposti a regolare pulizia anticalcare e disinfezione chimica, unitamente a flussaggio settimanale ad alta temperatura dell'acqua calda sanitaria (> 60°C) per prevenire la formazione del biofilm e la colonizzazione da Legionella pneumophila?",
      normReference: "D.Lgs. 18/2023 (Acque destinate al consumo umano) e Linee Guida Ministero Salute Legionella 07/05/2015",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Soffioni doccia incrostati di calcare e residui biologici senza evidenza documentale di smontaggio, disincrostazione e flussaggi preventivi.",
    });

    items.push({
      id: `${env.id}-piatti-doccia-pavimento-antiscivolo-r11-canaline-sifonate`,
      area: env.name,
      title: "Pavimentazione e Piatti Doccia Antiscivolo R11 con Pendenze e Canaline Sifonate",
      question:
        "La pavimentazione del blocco docce e servizi presenta coefficiente di attrito antisdrucciolo certificato R11 (o classe B/C a piedi scalzi), con adeguate pendenze verso canaline di scolo dotate di griglie asportabili e sifoni a barriera d'odore per scongiurare scivolamenti e ristagni?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.3.2 e DIN 51097 / DIN 51130 classe R11/Gruppo B",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Pavimentazione eccessivamente liscia e viscida in presenza di bagnato; ristagni d'acqua persistenti per pendenze errate verso i pozzetti di scarico.",
    });

    items.push({
      id: `${env.id}-tirante-allarme-bagno-disabili-pmr-suoneria-esterna`,
      area: env.name,
      title: "Tirante d'Emergenza nel Servizio Igienico Disabili con Segnalatore Fuoriporta",
      question:
        "Il bagno per ospiti con disabilità PMR è provvisto di tirante a cordicella azionabile da terra, maniglioni orizzontali e ribaltabili accanto al vaso WC, lavabo a mensola con rubinetto a leva clinica o fotocellula e specchio reclinabile?",
      normReference: "D.M. 236/1989 art. 4.1.6 e D.P.R. 503/1996",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Mancanza di maniglione ribaltabile a lato WC o rubinetteria a manopola non manovrabile da persone con ridotta abilità motoria.",
    });

    items.push({
      id: `${env.id}-antibagno-lavamani-sapone-asciugamani-aria-carta`,
      area: env.name,
      title: "Antibagno Attrezzato con Lavamani, Distributore Sapone e Asciugamani a Perdere/Lama d'Aria",
      question:
        "Il blocco servizi è provvisto di idoneo disimpegno antibagno dotato di lavamani con erogatore di sapone liquido, cestino gettacarte a pedale e sistema igienico di asciugatura mani (carta a perdere o asciugatore elettrico a lama d'aria con filtro)?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.13 e Regolamenti d'Igiene comunali",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Accesso diretto dei WC alla zona comune privo di antibagno di separazione o presenza di asciugamani in tessuto condivisi ad uso promiscuo.",
    });
  }

  // e) Cucina Comune Condivisa per Ospiti (Self-Catering) & Zona Pranzo
  if (env.id === "env-ost-cucina-condivisa" || env.id.includes("ost-cucina-condivisa")) {
    items.push({
      id: `${env.id}-cappa-aspirazione-filtri-labirinto-inox-manutenzione`,
      area: env.name,
      title: "Cappa Aspirante con Filtri a Labirinto Inox Lavabili ed Espulsione Fumi All'Esterno",
      question:
        "La cucina per ospiti dispone di cappa di aspirazione fumi e vapori canalizzata verso l'esterno, equipaggiata con filtri a labirinto in acciaio inossidabile periodicamente lavati e sgrassati per eliminare i depositi oleosi combustibili?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo I e D.M. 03/09/2021",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "aspirazione",
      suggestedNonConformity:
        "Cappa aspirante con filtri metallici intasati di grassi e unto da cucina senza registro di manutenzione, con rischio di gocciolamento e incendio.",
    });

    items.push({
      id: `${env.id}-piani-induzione-spegnimento-automatico-sicurezza`,
      area: env.name,
      title: "Piani Cottura a Induzione Elettrici Professionali con Spegnimento Automatico (Zero Fiamme)",
      question:
        "I punti cottura condivisi per self-catering impiegano piani elettrici a induzione dotati di timer di autospegnimento e sensore di presenza pentola per azzerare il pericolo di fiamme libere, fughe di gas combustibile e scottature accidentali?",
      normReference: "D.Lgs. 81/2008 art. 80 e CEI EN 60335-2-6",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Piani di cottura a gas obsoleti con accensione manuale privi di termocoppia di sicurezza in ambiente comune privo di sorveglianza continua.",
    });

    items.push({
      id: `${env.id}-estintore-classe-f-coperta-antifiamma-immediata`,
      area: env.name,
      title: "Estintore Speciale Classe F e Coperta Antifiamma a Portata Immediata",
      question:
        "In prossimità dei blocchi cottura è installato e chiaramente segnalato un estintore portatile per fuochi di oli e grassi vegetali di classe F, affiancato da una coperta antifiamma omologata UNI EN 1869 ad estrazione rapida?",
      normReference: "D.M. 03/09/2021 e UNI EN 3-7 (Estintori per fuochi classe F)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Assenza di coperta antifiamma e di estintore classe F nei pressi dell'area di preparazione cibi self-catering.",
    });

    items.push({
      id: `${env.id}-igienizzazione-superfici-moca-reg-ce-1935-2004`,
      area: env.name,
      title: "Sanificazione Giornaliera Piani di Lavoro MOCA e Forni a Microonde Inox",
      question:
        "I piani di preparazione, i lavelli inox e gli elettrodomestici a disposizione degli ospiti (microonde, tostapane, bollitori) sono realizzati in materiali conformi MOCA e vengono quotidianamente sgrassati e sanificati con prodotti disinfettanti ad uso alimentare?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo V e Reg. CE 1935/2004 (MOCA)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Incrostazioni di cibo nei forni a microonde condivisi, taglieri usurati in legno non sanificabile o assenza di piano di igienizzazione giornaliero.",
    });
  }

  // f) Dispensa Comune & Frigoriferi Condivisi per Ospiti
  if (env.id === "env-ost-dispensa-frigo-ospiti" || env.id.includes("ost-dispensa-frigo-ospiti")) {
    items.push({
      id: `${env.id}-etichettatura-alimenti-ospiti-procedura-haccp-scaduti`,
      area: env.name,
      title: "Procedura HACCP Etichettatura Alimenti Condivisi e Smaltimento Settimanale Cibi Scaduti",
      question:
        "È esposta in lingua italiana e inglese la regola cogente di etichettare ogni alimento inserito nei frigoriferi o scaffali con nome dell'ospite e data di partenza (check-out), con procedura scritta di eliminazione e smaltimento settimanale di cibi privi di etichetta o deperiti?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo IX (Igiene dei prodotti alimentari)",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Frigoriferi con confezioni aperte prive di identificazione, prodotti alimentari deperiti con muffe o privi di controllo delle scadenze.",
    });

    items.push({
      id: `${env.id}-teletermometri-digitali-frigoriferi-temperatura-haccp`,
      area: env.name,
      title: "Monitoraggio della Temperatura dei Frigoriferi con Termometri Digitali (+2°C / +4°C)",
      question:
        "I frigoriferi condivisi sono dotati di display digitale della temperatura interna visibile dall'esterno, tarato tra +2°C e +4°C per la conservazione dei cibi deperibili, con monitoraggio quotidiano da parte del personale dell'ostello?",
      normReference: "Reg. CE 852/2004 Allegato II e D.P.R. 327/1980",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "haccp",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Frigorifero privo di termometro o con temperatura interna superiore a +8°C che compromette la catena del freddo degli alimenti conservati dagli ospiti.",
    });
  }

  // g) Lavanderia Self-Service per Ospiti a Gettoni/App & Locale Stireria
  if (env.id === "env-ost-lavanderia-self" || env.id.includes("ost-lavanderia-self")) {
    items.push({
      id: `${env.id}-blocco-oblo-interblocco-sicurezza-uni-en-iso-10472`,
      area: env.name,
      title: "Interblocco di Sicurezza Oblò Lavatrici ed Essiccatori a Cestello Rotante",
      question:
        "Le lavatrici e le asciugatrici a disposizione degli ospiti sono dotate di dispositivo di sicurezza elettromeccanico che impedisce l'avvio della rotazione a oblò aperto e ne mantiene il blocco per l'intera durata del ciclo di centrifuga ad alta velocità?",
      normReference: "UNI EN ISO 10472 (Requisiti di sicurezza per macchine per lavanderia industriale) e D.Lgs. 81/08 Allegato V",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Sportello dell'essiccatore o lavatrice apribile mentre il cestello è ancora in piena rotazione con rischio di trascinamento e fratture agli arti superiori.",
    });

    items.push({
      id: `${env.id}-pulizia-filtri-lanugine-asciugatrici-prevenzione-incendi`,
      area: env.name,
      title: "Pulizia Giornaliera Filtri Lanugine Asciugatrici Contro Inneschi Termici",
      question:
        "I filtri trattenitori della lanugine (fluff filter) degli essiccatori a condensazione o pompa di calore vengono ispezionati e puliti quotidianamente dagli operatori per evitare accumuli di fibre infiammabili in prossimità delle resistenze termiche?",
      normReference: "D.M. 02/09/2021 (Manutenzione impianti antincendio) e Libretti di Uso e Manutenzione Costruttori",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Filtri lanugine intasati da spessi strati di pelucchi tessili surriscaldati, con elevato potenziale di innesco di focolai d'incendio all'interno dell'apparecchiatura.",
    });
  }

  // h) Guardaroba Biancheria, Deposito Housekeeping & Prodotti Pulizia
  if (env.id === "env-ost-deposito-housekeeping" || env.id.includes("ost-deposito-housekeeping")) {
    items.push({
      id: `${env.id}-stoccaggio-biancheria-pulita-scaffali-sollevati-15cm`,
      area: env.name,
      title: "Stoccaggio Biancheria Pulita su Scaffalature Metalliche Lisce Sollevate ≥ 15 cm",
      question:
        "La scorta di lenzuola, federe e asciugamani puliti igienizzati è riposta su scaffali metallici lisci e lavabili, sollevati di almeno 15 cm dal pavimento e distanziati dalle pareti, in ambiente asciutto e privo di umidità o polvere?",
      normReference: "Reg. CE 852/2004 e Buone Pratiche Igienico-Sanitarie Strutture Ricettive",
      defaultSeverity: 2,
      defaultSanctionable: false,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Biancheria da letto appoggiata direttamente sul pavimento o in prossimità di tubazioni con condensa o macchie di muffa.",
    });

    items.push({
      id: `${env.id}-armadio-detergenti-concentrati-sds-clp-titolo-ix`,
      area: env.name,
      title: "Armadio Chiuso a Chiave per Detergenti Concentrati con Schede SDS",
      question:
        "I prodotti chimici utilizzati per la pulizia e sanificazione (disincrostanti, candeggina, sgrassatori) sono custoditi in armadio metallico chiuso a chiave provvisto di bacino di contenimento perdite, con le Schede di Dati di Sicurezza (SDS) aggiornate disponibili per gli addetti?",
      normReference: "D.Lgs. 81/2008 Titolo IX Capo I (Sostanze pericolose) artt. 223, 227 e Reg. CLP 1272/2008",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Flaconi di acido disincrostante e solventi lasciati incustoditi aperti sul carrello o scaffale senza chiusura a chiave, esponendo gli ospiti a rischio di ingestione/ustione chimica.",
    });
  }

  // i) Locale Deposito Bagagli Ospiti Custodito & Lockers Elettronici
  if (env.id === "env-ost-deposito-bagagli" || env.id.includes("ost-deposito-bagagli")) {
    items.push({
      id: `${env.id}-lockers-bagagli-ancoraggio-parete-bordo-anticaduta`,
      area: env.name,
      title: "Ancoraggio Strutturale Armadietti Lockers e Scaffali Portavaligie con Bordo Anticaduta",
      question:
        "Le batterie di armadietti lockers e le scaffalature metalliche porta-valigie sono tassellate saldamente alle pareti strutturali per impedire ribaltamenti in caso di sbilanciamento dei pesi, e presentano bordi di contenimento per evitare la caduta accidentale dei bagagli pesanti?",
      normReference: "D.Lgs. 81/2008 Allegato IV punto 1.4 (Stabilità delle strutture e scaffalature)",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Scaffali per valigie pesanti non fissati al muro che oscillano al carico o privi di bordino ferma-bagaglio.",
    });
  }

  // j) Centrale Termica / Impianto Riscaldamento & Produzione ACS Anti-Legionella
  if (env.id === "env-ost-centrale-termica-acs" || env.id.includes("ost-centrale-termica-acs")) {
    items.push({
      id: `${env.id}-shock-termico-periodico-acs-65c-ricircolo-50c`,
      area: env.name,
      title: "Mantenimento Temperatura ACS in Accumulo ≥ 60°C, Ricircolo ≥ 50°C e Shock Termico Periodico",
      question:
        "L'impianto idrico sanitario mantiene nei bollitori di accumulo una temperatura costante di almeno 60°C e nella rete di ricircolo non inferiore a 50°C, con programmazione periodica di cicli automatici di disinfezione termica (shock termico a 65-70°C sui punti terminali)?",
      normReference: "Linee Guida Ministero Salute Legionellosi (Accordo CSR 07/05/2015) e D.Lgs. 18/2023",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Temperatura dell'accumulo ACS abbassata a 45°C per risparmio energetico, creando la temperatura ideale (25-45°C) per la proliferazione batterica di Legionella pneumophila.",
    });

    items.push({
      id: `${env.id}-registro-legionella-campionamenti-semestrali-valutazione`,
      area: env.name,
      title: "Registro Autocontrollo Rischio Legionellosi e Campionamenti Analitici Periodici",
      question:
        "La struttura ricettiva possiede il Documento di Valutazione del Rischio Legionellosi ed un Registro di Autocontrollo aggiornato, comprensivo dei rapporti di prova dei campionamenti microbiologici dell'acqua eseguiti con frequenza almeno semestrale?",
      normReference: "Linee Guida Ministero Salute 07/05/2015 e D.Lgs. 81/2008 Titolo X (Agenti Biologici)",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Assenza del piano di autocontrollo legionella o mancanza di rapporti di analisi di laboratorio sulle acque della rete idrica negli ultimi 12 mesi.",
    });

    items.push({
      id: `${env.id}-valvole-sicurezza-inail-vasi-ped-generatore-termico`,
      area: env.name,
      title: "Valvole di Sicurezza Omologate INAIL e Vasi di Espansione PED Verificati",
      question:
        "I generatori termici a servizio del riscaldamento e dell'ACS sono provvisti di valvole di sicurezza omologate con scarico canalizzato a vista, vaso di espansione conforme alla Direttiva PED verificato nella precarica e libretto di centrale regolarmente compilato?",
      normReference: "D.M. 01/12/1975 (Raccolta R INAIL), Direttiva PED 2014/68/UE e D.Lgs. 81/08 art. 71",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "arredi_scaffali",
      suggestedNonConformity:
        "Valvola di sicurezza con scarico libero a terra privo di convogliamento o manometro di pressione con quadrante rotto.",
    });
  }

  // k) Corridoi ai Piani, Vano Scale Antincendio & Uscite di Emergenza
  if (env.id === "env-ost-corridoi-scale-esodo" || env.id.includes("ost-corridoi-scale-esodo")) {
    items.push({
      id: `${env.id}-porte-tagliafuoco-ei-chiudiporta-idraulico-dm-09-04-1994`,
      area: env.name,
      title: "Porte Tagliafuoco EI 30 / EI 60 con Chiudiporta Idraulico Perfettamente Efficiente",
      question:
        "Le porte tagliafuoco di compartimentazione delle scale e dei corridoi ai piani sono munite di dispositivo chiudiporta idraulico regolato per garantire la chiusura completa e l'aggancio dello scrocco, e sono prive di cunei, fermi o ostacoli che ne impediscano l'accostamento?",
      normReference: "D.M. 09/04/1994 Titolo II, D.M. 14/07/2015 e UNI EN 1154 (Dispositivi di chiusura controllata delle porte)",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Porta tagliafuoco del vano scale tenuta aperta con zeppa di legno o chiudiporta scarico d'olio che non accosta la porta in battuta.",
    });

    items.push({
      id: `${env.id}-maniglioni-antipanico-uni-en-1125-vie-esodo-sgombre-120cm`,
      area: env.name,
      title: "Maniglioni Antipanico UNI EN 1125 su Uscite di Sicurezza e Vie di Esodo Larghezza ≥ 1,20 m",
      question:
        "Le porte di uscita di sicurezza che immettono all'esterno o sul luogo sicuro sono apribili verso l'esodo mediante maniglione antipanico a barra orizzontale conforme a UNI EN 1125 e i corridoi e le rampe di scala mantengono costantemente libera una larghezza utile di passaggio di almeno 1,20 m?",
      normReference: "UNI EN 1125, D.M. 09/04/1994 e D.Lgs. 81/2008 Allegato IV punto 1.5",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "dimensionale",
      suggestedNonConformity:
        "Uscita di sicurezza chiusa a chiave con catenaccio durante la presenza di ospiti, oppure corridoi di piano ingombrati da carrelli biancheria e materassi.",
    });

    items.push({
      id: `${env.id}-illuminazione-emergenza-5lux-allarme-ottico-acustico`,
      area: env.name,
      title: "Illuminazione di Emergenza Autoalimentata ≥ 5 Lux e Segnalazione Ottico-Acustica di Allarme",
      question:
        "Lungo tutti i corridoi e le scale di esodo è installato un impianto di illuminazione di sicurezza ad intervento automatico che garantisce almeno 5 lux al suolo con autonomia minima di 60 minuti, accompagnato da targhe segnaletiche fotoluminescenti e sistema ottico-acustico di allarme evacuazione?",
      normReference: "UNI EN 1838, D.M. 09/04/1994 e D.M. 03/09/2021",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      categoryTag: "cpi",
      suggestedNonConformity:
        "Lampade di emergenza con batterie esauste non funzionanti al test di disconnessione della rete elettrica o segnaletica di uscita mancante.",
    });
  }

  // l) Locale / Area Esterna Differenziata & Compattatore Rifiuti
  if (env.id === "env-ost-area-rifiuti" || env.id.includes("ost-area-rifiuti")) {
    items.push({
      id: `${env.id}-bidoni-differenziata-carrellati-tenuta-coperchio-compattatore`,
      area: env.name,
      title: "Bidoni Carrellati a Tenuta Ermetica per Differenziata Spinta e Compattatore Rifiuti",
      question:
        "L'area stoccaggio rifiuti dispone di contenitori carrellati lavabili con coperchio a tenuta per le diverse frazioni differenziate (organico, carta, plastica, metallo, secco) e gli eventuali compattatori di cartone/plastica sono dotati di marcatura CE e arresto d'emergenza a fungo?",
      normReference: "Reg. CE 852/2004 Allegato II Capitolo VI e D.Lgs. 152/2006 art. 188",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "igiene",
      suggestedNonConformity:
        "Rifiuti organici e imballaggi accumulati in sacchi a terra aperti esposti a intemperie e attrattiva per gabbiani, ratti o randagi.",
    });

    items.push({
      id: `${env.id}-pavimento-lavabile-pendenza-griglia-sifonata-derattizzazione`,
      area: env.name,
      title: "Pavimentazione Lavabile con Pendenza verso Griglia Sifonata e Piano di Derattizzazione",
      question:
        "La piazzola o locale rifiuti presenta pavimento impermeabile e lavabile con idropulitrice, pendenza verso pozzetto grigliato sifonato per il drenaggio delle acque di lavaggio, e postazioni perimetrali di monitoraggio roditori con erogatori d'esca protetti e numerati?",
      normReference: "Reg. CE 852/2004 e Regolamento di Igiene del Comune",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "both",
      categoryTag: "pavimenti_pareti",
      suggestedNonConformity:
        "Pavimentazione dell'area ecologica fessurata con pozze di percolato maleodorante prive di drenaggio o assenza di trappole derattizzazione.",
    });
  }

  return items;
}

