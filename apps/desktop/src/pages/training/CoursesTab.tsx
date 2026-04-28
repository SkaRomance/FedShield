import { useState } from "react";
import { createTrainingCourse, TrainingCourse } from "../../api";
import { Field, formStyle, gridStyle } from "./_shared";

interface CoursesTabProps {
  token: string;
  courses: TrainingCourse[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}

export default function CoursesTab({
  token,
  courses,
  onChanged,
  onError,
}: CoursesTabProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Catalogo corsi</h3>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Chiudi" : "+ Nuovo corso"}
        </button>
      </header>

      {showForm ? (
        <CourseForm
          token={token}
          onClose={() => setShowForm(false)}
          onSaved={async () => {
            setShowForm(false);
            await onChanged();
          }}
          onError={onError}
        />
      ) : null}

      <table>
        <thead>
          <tr>
            <th>Nome corso</th>
            <th>Audience</th>
            <th>Ore minime</th>
            <th>Frequenza</th>
            <th>Riferimento normativo</th>
            <th>Dominio</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>
                <strong>{c.name}</strong>
                {c.description ? <small style={{ display: "block" }}>{c.description}</small> : null}
              </td>
              <td>{c.targetAudience}</td>
              <td>{c.minHours}h</td>
              <td>{c.frequencyYears} anni</td>
              <td>{c.normReference}</td>
              <td>{c.domain || "—"}</td>
            </tr>
          ))}
          {courses.length === 0 ? (
            <tr>
              <td colSpan={6}>Nessun corso in catalogo.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function CourseForm({
  token,
  onClose,
  onSaved,
  onError,
}: {
  token: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("Lavoratori");
  const [minHours, setMinHours] = useState("4");
  const [frequencyYears, setFrequencyYears] = useState("5");
  const [normReference, setNormReference] = useState("D.Lgs. 81/2008, art. 36");
  const [domain, setDomain] = useState<"safety" | "haccp" | "both">("safety");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      await createTrainingCourse(token, {
        name: name.trim(),
        description: description.trim() || undefined,
        targetAudience: targetAudience.trim(),
        minHours: Number(minHours),
        frequencyYears: Number(frequencyYears),
        normReference: normReference.trim(),
        domain,
      });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio corso");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form" style={formStyle}>
      <h4>Nuovo corso</h4>
      <div style={gridStyle}>
        <Field label="Nome corso *">
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Audience *">
          <input
            required
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Lavoratori, Preposti, RSPP, ..."
          />
        </Field>
        <Field label="Ore minime *">
          <input
            type="number"
            required
            min={1}
            value={minHours}
            onChange={(e) => setMinHours(e.target.value)}
          />
        </Field>
        <Field label="Frequenza (anni) *">
          <input
            type="number"
            required
            min={1}
            value={frequencyYears}
            onChange={(e) => setFrequencyYears(e.target.value)}
          />
        </Field>
        <Field label="Riferimento normativo *">
          <input
            required
            value={normReference}
            onChange={(e) => setNormReference(e.target.value)}
            placeholder="Es. D.Lgs. 81/2008, art. 36"
          />
        </Field>
        <Field label="Dominio">
          <select value={domain} onChange={(e) => setDomain(e.target.value as typeof domain)}>
            <option value="safety">Sicurezza</option>
            <option value="haccp">HACCP</option>
            <option value="both">Entrambi</option>
          </select>
        </Field>
        <Field label="Descrizione" full>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Salvataggio..." : "Crea corso"}
        </button>
        <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
          Annulla
        </button>
      </div>
    </form>
  );
}
