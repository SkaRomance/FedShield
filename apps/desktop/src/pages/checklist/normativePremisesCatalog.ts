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
