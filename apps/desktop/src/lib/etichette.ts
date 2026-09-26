/**
 * Traduzioni in italiano dei codici tecnici che arrivano dal servizio.
 *
 * Il database conserva valori in inglese (draft, active, expired...) perche
 * sono identificativi, non testo. Tutto cio che finisce davanti agli occhi
 * del consulente passa invece da qui: nell'interfaccia non deve comparire
 * nessuna sigla inglese.
 *
 * Se il servizio introduce un valore nuovo e ancora sconosciuto, viene
 * mostrato ripulito (trattini bassi sostituiti da spazi) invece di lasciare
 * la schermata vuota.
 */

function ripiego(valore: string | null | undefined, vuoto: string): string {
  if (!valore) return vuoto;
  const pulito = valore.replace(/_/g, " ").trim();
  return pulito ? pulito.charAt(0).toUpperCase() + pulito.slice(1) : vuoto;
}

function traduci(
  dizionario: Record<string, string>,
  valore: string | null | undefined,
  vuoto = "n/d",
): string {
  if (!valore) return vuoto;
  return dizionario[valore] ?? ripiego(valore, vuoto);
}

/* ---------------- Stato del sopralluogo ---------------- */

const STATO_SOPRALLUOGO: Record<string, string> = {
  draft: "Bozza",
  pending_validation: "In validazione",
  validated: "Validato",
};

export function etichettaStatoSopralluogo(valore: string | null | undefined): string {
  return traduci(STATO_SOPRALLUOGO, valore, "Bozza");
}

/** Classe della pastiglia colorata associata allo stato del sopralluogo. */
export function pastigliaStatoSopralluogo(valore: string | null | undefined): string {
  if (valore === "validated") return "status-pill-approved";
  if (valore === "pending_validation") return "status-pill-pending";
  return "status-pill-neutral";
}

/* ---------------- Licenza del dispositivo ---------------- */

const STATO_LICENZA: Record<string, string> = {
  active: "Attiva",
  expired: "Scaduta",
  revoked: "Revocata",
};

export function etichettaStatoLicenza(valore: string | null | undefined): string {
  return traduci(STATO_LICENZA, valore, "Non disponibile");
}

/* ---------------- Stato di beni e attrezzature ---------------- */

const STATO_BENE: Record<string, string> = {
  active: "Attivo",
  under_maintenance: "In manutenzione",
  expired: "Scaduto",
  decommissioned: "Dismesso",
};

export function etichettaStatoBene(valore: string | null | undefined): string {
  return traduci(STATO_BENE, valore, "n/d");
}

/* ---------------- Preventivi ---------------- */

const STATO_PREVENTIVO: Record<string, string> = {
  pending: "In attesa di risposta",
  accepted: "Accettato",
  remodeling_requested: "Rimodulazione richiesta",
  rejected: "Rifiutato",
  expired: "Scaduto",
  assigned_to_third_party: "Affidato a terzi",
};

export function etichettaStatoPreventivo(valore: string | null | undefined): string {
  return traduci(STATO_PREVENTIVO, valore, "n/d");
}

const MOTIVO_MALLEVA: Record<string, string> = {
  rejected: "Preventivo rifiutato",
  expired: "Preventivo scaduto",
  assigned_to_third_party: "Affidato a terzi",
};

export function etichettaMotivoMalleva(valore: string | null | undefined): string {
  return traduci(MOTIVO_MALLEVA, valore, "-");
}

/* ---------------- Confronto con le sanzioni ODV ---------------- */

const ESITO_CONFRONTO: Record<string, string> = {
  matched_to_reported_nc: "Corrispondente a NC segnalata",
  unmatched_not_reported: "Non segnalata",
  partially_matched: "Parzialmente corrispondente",
};

export function etichettaEsitoConfronto(valore: string | null | undefined): string {
  return traduci(ESITO_CONFRONTO, valore, "n/d");
}

/* ---------------- Ambito normativo ---------------- */

const AMBITO_NORMATIVO: Record<string, string> = {
  safety: "Sicurezza",
  haccp: "HACCP",
  both: "Entrambi",
};

export function etichettaAmbitoNormativo(valore: string | null | undefined): string {
  return traduci(AMBITO_NORMATIVO, valore, "—");
}

/* ---------------- Ruolo dell'utente ---------------- */

const RUOLO_UTENTE: Record<string, string> = {
  admin: "Amministratore",
  senior: "Consulente Senior",
  junior: "Consulente Junior",
};

export function etichettaRuolo(valore: string | null | undefined): string {
  return traduci(RUOLO_UTENTE, valore, "Consulente");
}

/* ---------------- Risposte sì / no ---------------- */

export function siNo(valore: boolean | null | undefined): string {
  return valore ? "Sì" : "No";
}
