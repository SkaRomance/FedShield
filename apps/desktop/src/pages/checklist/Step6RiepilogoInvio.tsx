// Step 6 "Riepilogo e Invio" — originariamente Step 4 (S13-A), rinominato a
// Step 6 in Sprint 18 Wave B per fare spazio agli step Asset & Attrezzature
// (Step 4) e Formazione (Step 5). Logica invariata.

import { InspectionSummary } from "../../api";

interface Step6RiepilogoInvioProps {
  summary: InspectionSummary | null;
  loading: boolean;
  selectedInspectionId: string;
  isInspectionValidated: boolean;
  user: { role: "junior" | "senior" | "admin" };
  handleSaveChecklist: () => Promise<void>;
  handleValidateInspection: () => Promise<void>;
  handleSendToAdmin: () => Promise<void>;
  handleGenerateVerbale: () => Promise<void>;
  handleGenerateAttestato: () => Promise<void>;
}

export default function Step6RiepilogoInvio({
  summary,
  loading,
  selectedInspectionId,
  isInspectionValidated,
  user,
  handleSaveChecklist,
  handleValidateInspection,
  handleSendToAdmin,
  handleGenerateVerbale,
  handleGenerateAttestato,
}: Step6RiepilogoInvioProps) {
  return (
    <div className="panel section-panel">
      <h3>Riepilogo finale</h3>
      {summary ? (
        <div className="kpi-grid">
          <article className="kpi-card">
            <h3>Punteggio conformità</h3>
            <strong>{summary.score}/100</strong>
          </article>
          <article className="kpi-card">
            <h3>Stelle FED</h3>
            <strong>
              {"★".repeat(summary.stars)}
              {"☆".repeat(5 - summary.stars)}
            </strong>
          </article>
          <article className="kpi-card">
            <h3>NC totali</h3>
            <strong>{summary.totals.nonConformities}</strong>
          </article>
          <article className="kpi-card">
            <h3>NC sanzionabili</h3>
            <strong>{summary.totals.sanctionableNc}</strong>
          </article>
        </div>
      ) : (
        <p>Nessun riepilogo disponibile.</p>
      )}

      <div className={`status-banner ${summary?.attestato.eligible ? "status-banner-ok" : "status-banner-warning"}`}>
        <strong>Attestato:</strong> {summary?.attestato.reason ?? "Salva il sopralluogo per valutare l'idoneità all'attestato."}
      </div>

      <div className="footer-actions" style={{ flexWrap: "wrap" }}>
        {/* Una sola azione principale in arancio: le altre restano neutre
            per non mettere sullo stesso piano salvataggio e stampe. */}
        <button
          className="btn-primary"
          onClick={handleSaveChecklist}
          disabled={loading || !selectedInspectionId || isInspectionValidated}
        >
          Salva checklist completa
        </button>
        <button
          className="secondary-btn"
          onClick={handleValidateInspection}
          disabled={loading || !selectedInspectionId || user.role === "junior" || isInspectionValidated}
        >
          Valida sopralluogo
        </button>
        <button
          className="secondary-btn"
          onClick={handleSendToAdmin}
          disabled={loading || !selectedInspectionId}
        >
          Invia ad amministrazione
        </button>
        <button
          className="secondary-btn"
          onClick={handleGenerateVerbale}
          disabled={loading || !selectedInspectionId}
        >
          Genera verbale cliente
        </button>
        <button
          className="secondary-btn"
          onClick={handleGenerateAttestato}
          disabled={loading || !selectedInspectionId || !summary?.attestato.eligible}
        >
          Genera attestato
        </button>
      </div>
    </div>
  );
}
