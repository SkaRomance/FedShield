interface NcGuidance {
  normReference: string;
  sanctionImpact: string;
  suggestedService: string;
}

const EXPLICIT_GUIDANCE: Record<string, NcGuidance> = {
  "dvr aggiornato, firmato e coerente con le mansioni presenti?": {
    normReference: "D.Lgs. 81/2008, artt. 17 e 28",
    sanctionImpact: "Rischio sanzioni penali/amministrative per mancata valutazione rischi.",
    suggestedService: "Aggiornamento DVR e adeguamento sistema sicurezza aziendale",
  },
  "manuale haccp aggiornato e coerente con menu, processi e layout reali?": {
    normReference: "Reg. CE 852/2004, art. 5",
    sanctionImpact: "Rischio sanzioni igienico-sanitarie e prescrizioni ODV/ASL.",
    suggestedService: "Revisione manuale HACCP e procedure operative ristorante",
  },
  "analisi pericoli e piano ccp/cp formalizzati con limiti critici definiti?": {
    normReference: "Reg. CE 852/2004, art. 5",
    sanctionImpact: "Rischio non conformita gravi su autocontrollo alimentare.",
    suggestedService: "Implementazione piano CCP/CP con check list controlli critici",
  },
  "registri temperature conservazione compilati regolarmente e firmati?": {
    normReference: "Reg. CE 852/2004 e prassi HACCP",
    sanctionImpact: "Rischio contestazioni su conservazione alimenti e catena del freddo.",
    suggestedService: "Sistema registrazione temperature e formazione addetti",
  },
  "gestione allergeni formalizzata con mappatura ingredienti e menu aggiornato?": {
    normReference: "Reg. UE 1169/2011",
    sanctionImpact: "Rischio sanzioni per informazioni allergeni incomplete/errate.",
    suggestedService: "Piano allergeni, etichettatura menu e formazione personale sala/cucina",
  },
  "procedure operative per evitare contaminazione crociata allergeni rispettate?": {
    normReference: "Reg. UE 1169/2011 e Reg. CE 852/2004",
    sanctionImpact: "Rischio sanzioni elevate e potenziale danno sanitario al consumatore.",
    suggestedService: "Protocollo anti cross-contamination e audit operativo in cucina",
  },
  "layout del ristorante idoneo alla separazione sporco/pulito e crudo/cotto?": {
    normReference: "Reg. CE 852/2004, Allegato II",
    sanctionImpact: "Rischio prescrizioni immediate e rilievi su sicurezza alimentare.",
    suggestedService: "Progetto di riorganizzazione layout e flussi produttivi",
  },
  "ventilazione e aspirazione in cucina adeguate e manutenute?": {
    normReference: "D.Lgs. 81/2008 e Reg. CE 852/2004",
    sanctionImpact: "Rischio contestazioni su salubrita ambienti e sicurezza lavoro.",
    suggestedService: "Piano manutenzione cappe/aspirazione e verifica tecnica impianti",
  },
  "presidi antincendio presenti, segnalati e manutenuti entro scadenza?": {
    normReference: "D.Lgs. 81/2008 e normativa antincendio vigente",
    sanctionImpact: "Rischio sanzioni su prevenzione incendi e incolumita persone.",
    suggestedService: "Adeguamento antincendio, registro controlli e formazione addetti",
  },
  "vie di esodo libere, uscite di emergenza accessibili e segnaletica presente?": {
    normReference: "D.Lgs. 81/2008, Allegato IV",
    sanctionImpact: "Rischio prescrizioni immediate e sospensione attivita nei casi gravi.",
    suggestedService: "Audit sicurezza vie d'esodo e piano adeguamento emergenze",
  },
  "attrezzature di cottura in sicurezza con protezioni e stato manutentivo idoneo?": {
    normReference: "D.Lgs. 81/2008, Titolo III",
    sanctionImpact: "Rischio sanzioni per uso attrezzature non sicure.",
    suggestedService: "Piano manutenzioni attrezzature e check sicurezza macchine",
  },
  "frigoriferi, congelatori e abbattitore efficienti con termometri funzionanti?": {
    normReference: "Reg. CE 852/2004 e prassi HACCP",
    sanctionImpact: "Rischio sanzioni su conservazione alimenti e catena del freddo.",
    suggestedService: "Verifica catena del freddo e manutenzione impianti refrigerazione",
  },
  "piano pulizie e sanificazioni con frequenze, responsabilita e registrazioni?": {
    normReference: "Reg. CE 852/2004, Allegato II",
    sanctionImpact: "Rischio rilievi su igiene ambientale e contaminazioni.",
    suggestedService: "Implementazione piano pulizie/sanificazioni con modulistica tracciata",
  },
  "formazione haccp personale in corso di validita e verificabile per tutti gli addetti?": {
    normReference: "Normativa regionale HACCP e Reg. CE 852/2004",
    sanctionImpact: "Rischio sanzioni per personale non formato o attestati scaduti.",
    suggestedService: "Piano formativo HACCP e gestione scadenziario attestati",
  },
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function getNcGuidance(question: string, area?: string): NcGuidance {
  const normalizedQuestion = normalize(question);
  const explicit = EXPLICIT_GUIDANCE[normalizedQuestion];
  if (explicit) {
    return explicit;
  }

  const normalizedArea = normalize(area ?? "");
  if (normalizedArea.includes("allergeni")) {
    return {
      normReference: "Reg. UE 1169/2011",
      sanctionImpact: "Rischio sanzioni su comunicazione allergeni e gestione contaminazioni.",
      suggestedService: "Pacchetto compliance allergeni (menu, procedure e formazione)",
    };
  }

  if (normalizedArea.includes("haccp") || normalizedArea.includes("igiene")) {
    return {
      normReference: "Reg. CE 852/2004",
      sanctionImpact: "Rischio non conformita igienico-sanitarie in sede ispettiva.",
      suggestedService: "Adeguamento sistema HACCP e audit operativo periodico",
    };
  }

  if (normalizedArea.includes("impianti") || normalizedArea.includes("antincendio")) {
    return {
      normReference: "D.Lgs. 81/2008 e normativa tecnica di settore",
      sanctionImpact: "Rischio sanzioni per carenze impiantistiche e sicurezza ambiente lavoro.",
      suggestedService: "Verifica tecnica impianti e piano di adeguamento sicurezza",
    };
  }

  if (normalizedArea.includes("formazione")) {
    return {
      normReference: "D.Lgs. 81/2008 e accordi Stato-Regioni",
      sanctionImpact: "Rischio sanzioni per formazione non conforme o scaduta.",
      suggestedService: "Piano formativo obbligatorio con monitoraggio scadenze",
    };
  }

  return {
    normReference: "Normativa salute, sicurezza e igiene applicabile al ristorante",
    sanctionImpact: "Rischio sanzionatorio variabile in base alla gravita della NC.",
    suggestedService: "Audit specialistico e piano di adeguamento normativo",
  };
}

export function composeNcDescription(
  note: string | null | undefined,
  guidance: NcGuidance,
): string {
  const lines = [
    note?.trim() ? `Nota consulente: ${note.trim()}` : "Nota consulente: non specificata",
    `Riferimento normativo: ${guidance.normReference}`,
    `Impatto sanzionatorio: ${guidance.sanctionImpact}`,
    `Servizio Fedinvest consigliato: ${guidance.suggestedService}`,
  ];

  return lines.join("\n");
}

export function parseNcDescription(description?: string | null): {
  note: string | null;
  normReference: string | null;
  sanctionImpact: string | null;
  suggestedService: string | null;
} {
  const fallback = {
    note: description ?? null,
    normReference: null,
    sanctionImpact: null,
    suggestedService: null,
  };

  if (!description) {
    return fallback;
  }

  const lines = description.split("\n").map((line) => line.trim());
  const find = (prefix: string) => {
    const value = lines.find((line) => line.toLowerCase().startsWith(prefix.toLowerCase()));
    return value ? value.slice(prefix.length).trim() : null;
  };

  const note = find("Nota consulente:");
  const normReference = find("Riferimento normativo:");
  const sanctionImpact = find("Impatto sanzionatorio:");
  const suggestedService = find("Servizio Fedinvest consigliato:");

  return {
    note,
    normReference,
    sanctionImpact,
    suggestedService,
  };
}
