import { useState } from "react";
import { ChecklistItem } from "../../api";

interface Step2LocaliAttrezzatureProps {
  premisesItems: ChecklistItem[];
  renderAnswersTable: (items: ChecklistItem[]) => React.ReactNode;
  onAddCustomItem?: (item: {
    section: "premises_equipment" | "machinery_safety";
    area: string;
    question: string;
    normReference?: string;
    defaultSeverity?: number;
    defaultSanctionable?: boolean;
    domain?: "safety" | "haccp" | "both";
  }) => Promise<unknown>;
  isInspectionValidated?: boolean;
}

export default function Step2LocaliAttrezzature({
  premisesItems,
  renderAnswersTable,
  onAddCustomItem,
  isInspectionValidated = false,
}: Step2LocaliAttrezzatureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [area, setArea] = useState("");
  const [question, setQuestion] = useState("");
  const [normReference, setNormReference] = useState("");
  const [severity, setSeverity] = useState(2);
  const [sanctionable, setSanctionable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!area.trim() || !question.trim()) {
      setFormError("Compila almeno Area e Domanda/Controllo.");
      return;
    }
    if (!onAddCustomItem) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await onAddCustomItem({
        section: "premises_equipment",
        area: area.trim(),
        question: question.trim(),
        normReference: normReference.trim() || undefined,
        defaultSeverity: severity,
        defaultSanctionable: sanctionable,
        domain: "safety",
      });
      setArea("");
      setQuestion("");
      setNormReference("");
      setSeverity(2);
      setSanctionable(true);
      setIsOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Errore creazione requisito.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel section-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Requisiti locali e attrezzature</h3>
        {onAddCustomItem && !isInspectionValidated ? (
          <button
            type="button"
            className="secondary-btn"
            style={{ fontSize: "0.88rem" }}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? "✕ Chiudi modulo" : "+ Aggiungi Requisito Specifico"}
          </button>
        ) : null}
      </div>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: 20,
            padding: 16,
            backgroundColor: "var(--bg-subtle, #f8fafc)",
            border: "1px solid var(--border-color, #e2e8f0)",
            borderRadius: 8,
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>Nuovo Requisito Specifico (Volontario / Ad-hoc)</h4>
          {formError ? <p style={{ color: "var(--color-error, #ef4444)", marginBottom: 8 }}>{formError}</p> : null}
          <div className="grid-two" style={{ gap: 12 }}>
            <div>
              <label>Area / Impianto / Zona</label>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Es. Forno pizza, Cella BT, Quadro elettrico"
                required
              />
            </div>
            <div>
              <label>Riferimento Normativo (opzionale)</label>
              <input
                value={normReference}
                onChange={(e) => setNormReference(e.target.value)}
                placeholder="Es. D.Lgs. 81/2008, art. 71 c. 4"
              />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Domanda / Verifica di Conformità</label>
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Es. La cappa di aspirazione è provvista di canna fumaria autonoma conforme con libretto di pulizia filtri?"
              required
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid var(--border-color, #cbd5e1)" }}
            />
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
              Gravità:
              <select value={severity} onChange={(e) => setSeverity(Number(e.target.value))} style={{ marginLeft: 4 }}>
                <option value={1}>1 - Bassa</option>
                <option value={2}>2 - Media</option>
                <option value={3}>3 - Alta</option>
                <option value={4}>4 - Critica</option>
              </select>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
              <input
                type="checkbox"
                checked={sanctionable}
                onChange={(e) => setSanctionable(e.target.checked)}
              />
              Sanzionabile in caso di NC
            </label>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ marginLeft: "auto" }}
            >
              {submitting ? "Salvataggio..." : "Salva Requisito nella Checklist"}
            </button>
          </div>
        </form>
      )}

      {renderAnswersTable(premisesItems)}
    </div>
  );
}
