import React, { useState } from "react";
import {
  createTrainingCourse,
  createTrainingRecord,
  Employee,
  TrainingCourse,
} from "../../api";
import { PlannedCourseItem } from "../../lib/individualTrainingPlan";
import { Field, formStyle, gridStyle } from "./_shared";
import { Award, GraduationCap, X } from "lucide-react";

interface TrainingRecordModalProps {
  token: string;
  employee: Employee;
  courses: TrainingCourse[];
  preselectedCourse?: PlannedCourseItem;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string | null) => void;
}

export default function TrainingRecordModal({
  token,
  employee,
  courses,
  preselectedCourse,
  onClose,
  onSaved,
  onError,
}: TrainingRecordModalProps) {
  // Trova corso corrispondente
  const matchedCourse = preselectedCourse
    ? courses.find(
        (c) =>
          c.id === preselectedCourse.matchedCatalogCourseId ||
          c.name.toLowerCase() === preselectedCourse.name.toLowerCase() ||
          c.name.toLowerCase().includes(preselectedCourse.name.toLowerCase()),
      )
    : undefined;

  const [courseId, setCourseId] = useState<string>(
    matchedCourse?.id || courses[0]?.id || "NEW",
  );
  const [newCourseName, setNewCourseName] = useState(
    preselectedCourse && !matchedCourse ? preselectedCourse.name : "",
  );
  const [completedAt, setCompletedAt] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [hoursDone, setHoursDone] = useState<string>(
    String(preselectedCourse?.minHours || matchedCourse?.minHours || 4),
  );
  const [certificateNumber, setCertificateNumber] = useState(
    preselectedCourse?.certificateNumber || "",
  );
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);

    try {
      let finalCourseId = courseId;

      // Se il corso non era presente nel catalogo generale e va creato al volo
      if (courseId === "NEW" || !finalCourseId) {
        if (!newCourseName.trim()) {
          onError("Specifica il nome del corso.");
          return;
        }
        const created = await createTrainingCourse(token, {
          name: newCourseName.trim(),
          description: preselectedCourse?.reason || "Corso di formazione obbligatoria",
          targetAudience: preselectedCourse?.categoryLabel || employee.role || "Lavoratori",
          minHours: Number(hoursDone) || preselectedCourse?.minHours || 4,
          frequencyYears: preselectedCourse?.frequencyYears ?? 5,
          normReference: preselectedCourse?.normReference || "D.Lgs. 81/2008 art. 37",
          domain: preselectedCourse?.category === "haccp" ? "haccp" : "safety",
          isActive: true,
        });
        finalCourseId = created.id;
      }

      // Calcola scadenza
      const selCourse = courses.find((c) => c.id === finalCourseId);
      const freqYears = selCourse?.frequencyYears ?? preselectedCourse?.frequencyYears ?? 5;

      let expiresAtStr: string | undefined = undefined;
      if (freqYears > 0) {
        const d = new Date(completedAt);
        d.setFullYear(d.getFullYear() + freqYears);
        expiresAtStr = d.toISOString();
      }

      await createTrainingRecord(token, {
        employeeId: employee.id,
        courseId: finalCourseId,
        completedAt: new Date(completedAt).toISOString(),
        expiresAt: expiresAtStr,
        hoursDone: hoursDone ? Number(hoursDone) : undefined,
        certificateNumber: certificateNumber.trim() || undefined,
        note: note.trim() || (preselectedCourse ? `Corso: ${preselectedCourse.reason}` : undefined),
      });

      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore registrazione attestato");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "560px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#dcfce7",
                color: "#166534",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                Registra Formazione / Attestato
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                Lavoratore: <strong>{employee.lastName} {employee.firstName}</strong> ({employee.role || "Lavoratore"})
              </p>
            </div>
          </div>
          <button
            type="button"
            className="ghost-btn"
            onClick={onClose}
            disabled={busy}
            style={{ padding: "6px", borderRadius: "50%" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          {preselectedCourse && (
            <div
              style={{
                padding: "10px 14px",
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: "6px",
                fontSize: "12.5px",
                color: "#0369a1",
                marginBottom: "16px",
              }}
            >
              <strong>Corso Obiettivo:</strong> {preselectedCourse.name}
              <div style={{ fontSize: "11.5px", color: "#0284c7", marginTop: "2px" }}>
                ⚖️ {preselectedCourse.normReference} — Frequenza:{" "}
                {preselectedCourse.frequencyYears === 0
                  ? "Permanente"
                  : `ogni ${preselectedCourse.frequencyYears} anni`}
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Field label="Seleziona Corso dal Catalogo *">
              <select
                value={courseId}
                onChange={(e) => {
                  const val = e.target.value;
                  setCourseId(val);
                  if (val !== "NEW") {
                    const found = courses.find((c) => c.id === val);
                    if (found) setHoursDone(String(found.minHours));
                  }
                }}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.minHours}h, ogni {c.frequencyYears}a)
                  </option>
                ))}
                <option value="NEW">+ Crea nuovo corso personalizzato...</option>
              </select>
            </Field>

            {courseId === "NEW" && (
              <Field label="Nome del Nuovo Corso *">
                <input
                  required
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="es. Addestramento Uso Piattaforme PLE..."
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Data Conseguimento *">
                <input
                  type="date"
                  required
                  value={completedAt}
                  onChange={(e) => setCompletedAt(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>

              <Field label="Ore Svolte Effettive">
                <input
                  type="number"
                  min={1}
                  value={hoursDone}
                  onChange={(e) => setHoursDone(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>
            </div>

            <Field label="Numero Attestato / Protocollo (Opzionale)">
              <input
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                placeholder="es. ATT-2026-0045"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </Field>

            <Field label="Note / Ente Formatore (Opzionale)">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="es. Ente accreditato Formazione Sicurezza Spa"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </Field>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
              Annulla
            </button>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "Registrazione..." : "Registra Attestato"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
