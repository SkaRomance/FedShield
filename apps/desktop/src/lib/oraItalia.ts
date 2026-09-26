/**
 * Data e ora ufficiali italiane per i sopralluoghi.
 *
 * Tutte le date mostrate e registrate dall'applicazione passano da qui, cosi
 * l'ora e sempre quella italiana anche se il computer del consulente ha un
 * fuso orario sbagliato o e impostato su un'altra nazione.
 *
 * Il passaggio fra ORA LEGALE (CEST, UTC+2) e ORA SOLARE (CET, UTC+1) viene
 * riconosciuto da solo: il sistema non va mai regolato a mano, nemmeno nella
 * notte del cambio, perche il regime viene ricalcolato a ogni lettura.
 */

export const ZONA_ITALIA = "Europe/Rome";

/** Formattatori riusati: crearli a ogni tick dell'orologio sarebbe sprecato. */
const fmtParti = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONA_ITALIA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const fmtData = new Intl.DateTimeFormat("it-IT", {
  timeZone: ZONA_ITALIA,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const fmtDataEstesa = new Intl.DateTimeFormat("it-IT", {
  timeZone: ZONA_ITALIA,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fmtOra = new Intl.DateTimeFormat("it-IT", {
  timeZone: ZONA_ITALIA,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const fmtOraSecondi = new Intl.DateTimeFormat("it-IT", {
  timeZone: ZONA_ITALIA,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const fmtDataOra = new Intl.DateTimeFormat("it-IT", {
  timeZone: ZONA_ITALIA,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Converte qualunque forma accettabile in una data valida, altrimenti null. */
function aData(valore: Date | string | number | null | undefined): Date | null {
  if (valore === null || valore === undefined || valore === "") return null;
  const data = valore instanceof Date ? valore : new Date(valore);
  return Number.isNaN(data.getTime()) ? null : data;
}

/**
 * Scarto in minuti fra l'ora del muro in Italia e il tempo universale.
 * Vale 120 con l'ora legale e 60 con l'ora solare.
 */
export function scartoMinutiItalia(istante: Date = new Date()): number {
  const parti: Record<string, string> = {};
  for (const parte of fmtParti.formatToParts(istante)) {
    if (parte.type !== "literal") parti[parte.type] = parte.value;
  }
  const oreMuro = Number(parti.hour) % 24;
  const muroComeUtc = Date.UTC(
    Number(parti.year),
    Number(parti.month) - 1,
    Number(parti.day),
    oreMuro,
    Number(parti.minute),
    Number(parti.second),
  );
  const istanteAlSecondo = Math.floor(istante.getTime() / 1000) * 1000;
  return Math.round((muroComeUtc - istanteAlSecondo) / 60000);
}

export interface RegimeOrario {
  /** true quando in Italia e in vigore l'ora legale. */
  legale: boolean;
  /** "ora legale" oppure "ora solare". */
  etichetta: string;
  /** Sigla tecnica del fuso: CEST con l'ora legale, CET con l'ora solare. */
  sigla: "CEST" | "CET";
  /** Scarto dal tempo universale gia scritto per la lettura: "UTC+2". */
  scarto: string;
  /** Istante esatto del prossimo cambio dell'ora in Italia. */
  prossimoCambio: Date;
  /** Regime che entrera in vigore al prossimo cambio. */
  prossimaEtichetta: string;
}

/**
 * Istante esatto dei cambi dell'ora nell'Unione Europea: ultima domenica di
 * marzo e di ottobre alle 01:00 UTC. La regola e fissata per legge, quindi si
 * calcola invece di essere cercata a tentativi.
 */
function ultimaDomenicaAlleUnoUtc(anno: number, mese: number): Date {
  const ultimoGiorno = new Date(Date.UTC(anno, mese + 1, 0));
  ultimoGiorno.setUTCDate(ultimoGiorno.getUTCDate() - ultimoGiorno.getUTCDay());
  ultimoGiorno.setUTCHours(1, 0, 0, 0);
  return ultimoGiorno;
}

/** Riconosce se in un dato istante in Italia vale l'ora legale o quella solare. */
export function regimeOrario(istante: Date = new Date()): RegimeOrario {
  const legale = scartoMinutiItalia(istante) >= 120;
  const anno = Number(
    new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_ITALIA, year: "numeric" }).format(istante),
  );

  const inizioLegale = ultimaDomenicaAlleUnoUtc(anno, 2); // ultima domenica di marzo
  const fineLegale = ultimaDomenicaAlleUnoUtc(anno, 9); // ultima domenica di ottobre

  let prossimoCambio: Date;
  if (istante < inizioLegale) {
    prossimoCambio = inizioLegale;
  } else if (istante < fineLegale) {
    prossimoCambio = fineLegale;
  } else {
    prossimoCambio = ultimaDomenicaAlleUnoUtc(anno + 1, 2);
  }

  return {
    legale,
    etichetta: legale ? "ora legale" : "ora solare",
    sigla: legale ? "CEST" : "CET",
    scarto: legale ? "UTC+2" : "UTC+1",
    prossimoCambio,
    prossimaEtichetta: legale ? "ora solare" : "ora legale",
  };
}

/* ------------------------------------------------------------------
   Formattazione: sempre con il fuso italiano
   ------------------------------------------------------------------ */

/** Data in cifre: "26/09/2026". */
export function formattaData(valore: Date | string | number | null | undefined, vuoto = "n/d"): string {
  const data = aData(valore);
  return data ? fmtData.format(data) : vuoto;
}

/** Data per esteso: "sabato 26 settembre 2026". */
export function formattaDataEstesa(
  valore: Date | string | number | null | undefined,
  vuoto = "n/d",
): string {
  const data = aData(valore);
  return data ? fmtDataEstesa.format(data) : vuoto;
}

/** Ora e minuti: "14:35". */
export function formattaOra(valore: Date | string | number | null | undefined, vuoto = "--:--"): string {
  const data = aData(valore);
  return data ? fmtOra.format(data) : vuoto;
}

/** Ora, minuti e secondi: "14:35:07". */
export function formattaOraConSecondi(
  valore: Date | string | number | null | undefined,
  vuoto = "--:--:--",
): string {
  const data = aData(valore);
  return data ? fmtOraSecondi.format(data) : vuoto;
}

/** Data e ora insieme: "26/09/2026, 14:35". */
export function formattaDataOra(
  valore: Date | string | number | null | undefined,
  vuoto = "n/d",
): string {
  const data = aData(valore);
  return data ? fmtDataOra.format(data) : vuoto;
}

/* ------------------------------------------------------------------
   Conversione da e verso i campi del modulo
   ------------------------------------------------------------------ */

/** Valore per un campo data ("AAAA-MM-GG"), letto con il calendario italiano. */
export function perCampoData(istante: Date = new Date()): string {
  const parti: Record<string, string> = {};
  for (const parte of fmtParti.formatToParts(istante)) {
    if (parte.type !== "literal") parti[parte.type] = parte.value;
  }
  return `${parti.year}-${parti.month}-${parti.day}`;
}

/** Valore per un campo ora ("HH:MM"), letto con l'orologio italiano. */
export function perCampoOra(istante: Date = new Date()): string {
  const parti: Record<string, string> = {};
  for (const parte of fmtParti.formatToParts(istante)) {
    if (parte.type !== "literal") parti[parte.type] = parte.value;
  }
  const ore = String(Number(parti.hour) % 24).padStart(2, "0");
  return `${ore}:${parti.minute}`;
}

/**
 * Trasforma la data e l'ora scritte dal consulente (che legge l'orologio
 * italiano) nell'istante reale da registrare. Lo scarto viene applicato due
 * volte perche nella notte del cambio dell'ora il primo tentativo puo cadere
 * nel regime sbagliato.
 */
export function daOraItaliana(data: string, ora: string): Date | null {
  const corrispondenzaData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.trim());
  const corrispondenzaOra = /^(\d{1,2}):(\d{2})$/.exec(ora.trim());
  if (!corrispondenzaData || !corrispondenzaOra) return null;

  const anno = Number(corrispondenzaData[1]);
  const mese = Number(corrispondenzaData[2]) - 1;
  const giorno = Number(corrispondenzaData[3]);
  const ore = Number(corrispondenzaOra[1]);
  const minuti = Number(corrispondenzaOra[2]);
  if (mese < 0 || mese > 11 || giorno < 1 || giorno > 31) return null;
  if (ore > 23 || minuti > 59) return null;

  const muro = Date.UTC(anno, mese, giorno, ore, minuti, 0);

  // Scarta le date inesistenti (31 aprile, 30 febbraio, mese 13): in quei casi
  // il calendario scivola al giorno successivo invece di segnalare l'errore.
  const controllo = new Date(muro);
  if (
    controllo.getUTCFullYear() !== anno ||
    controllo.getUTCMonth() !== mese ||
    controllo.getUTCDate() !== giorno
  ) {
    return null;
  }

  let istante = new Date(muro - 60 * 60000);
  const primoScarto = scartoMinutiItalia(istante);
  istante = new Date(muro - primoScarto * 60000);
  const secondoScarto = scartoMinutiItalia(istante);
  if (secondoScarto !== primoScarto) {
    istante = new Date(muro - secondoScarto * 60000);
  }
  return Number.isNaN(istante.getTime()) ? null : istante;
}

/* ------------------------------------------------------------------
   Fotografia completa di un istante, pronta da mostrare
   ------------------------------------------------------------------ */

export interface LetturaOrologio {
  /** Istante corrente. */
  adesso: Date;
  /** Data in cifre. */
  data: string;
  /** Data per esteso. */
  dataEstesa: string;
  /** Ora e minuti. */
  ora: string;
  /** Ora, minuti e secondi. */
  oraConSecondi: string;
  /** Regime in vigore in quell'istante. */
  regime: RegimeOrario;
}

/** Legge data, ora e regime di un istante in un colpo solo. */
export function leggiOrologio(istante: Date = new Date()): LetturaOrologio {
  return {
    adesso: istante,
    data: formattaData(istante),
    dataEstesa: formattaDataEstesa(istante),
    ora: formattaOra(istante),
    oraConSecondi: formattaOraConSecondi(istante),
    regime: regimeOrario(istante),
  };
}
