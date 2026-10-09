import React, { useState } from "react";
import {
  Company,
  createEmployee,
  Employee,
  Machine,
  updateEmployee,
} from "../../api";
import {
  CONTRACT_TYPES,
  EmployeeMetadata,
  extractEmployeeMetadata,
  SAFETY_ROLE_OPTIONS,
  serializeEmployeeMetadata,
  SUGGESTED_JOB_ROLES,
  WEEKLY_HOURS_PRESETS,
} from "../../lib/individualTrainingPlan";
import { Field, formStyle } from "./_shared";
import { Briefcase, Calendar, Shield, User, Wrench, X } from "lucide-react";

interface EmployeeFullModalProps {
  token: string;
  companies: Company[];
  companyId?: string;
  editing: Employee | null;
  machines: Machine[];
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string | null) => void;
}

export default function EmployeeFullModal({
  token,
  companies,
  companyId: initialCompanyId,
  editing,
  machines,
  onClose,
  onSaved,
  onError,
}: EmployeeFullModalProps) {
  const existingMeta: EmployeeMetadata = editing
    ? extractEmployeeMetadata(editing)
    : {
        department: "",
        birthDate: "",
        birthPlace: "",
        contractType: "Tempo Indeterminato",
        weeklyHours: "40",
        safetyRoles: [],
        assignedMachineIds: [],
      };

  const [companyId, setCompanyId] = useState(
    editing?.companyId || initialCompanyId || companies[0]?.id || "",
  );
  const [firstName, setFirstName] = useState(editing?.firstName || "");
  const [lastName, setLastName] = useState(editing?.lastName || "");
  const [fiscalCode, setFiscalCode] = useState(editing?.fiscalCode || "");
  const [birthDate, setBirthDate] = useState(existingMeta.birthDate || "");
  const [birthPlace, setBirthPlace] = useState(existingMeta.birthPlace || "");
  const [role, setRole] = useState(editing?.role || "");
  const [department, setDepartment] = useState(existingMeta.department || "");
  const [contractType, setContractType] = useState(
    existingMeta.contractType || "Tempo Indeterminato",
  );
  const [weeklyHours, setWeeklyHours] = useState<string>(
    String(existingMeta.weeklyHours || "40"),
  );
  const [hireDate, setHireDate] = useState(
    editing?.hireDate ? editing.hireDate.slice(0, 10) : "",
  );
  const [safetyRoles, setSafetyRoles] = useState<string[]>(
    existingMeta.safetyRoles || [],
  );
  const [assignedMachineIds, setAssignedMachineIds] = useState<string[]>(
    existingMeta.assignedMachineIds || [],
  );
  const [busy, setBusy] = useState(false);

  // Filtra le macchine dell'azienda selezionata
  const availableMachines = machines.filter(
    (m) => !companyId || m.companyId === companyId,
  );

  function toggleSafetyRole(code: string) {
    setSafetyRoles((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

  function toggleMachine(machineId: string) {
    setAssignedMachineIds((prev) =>
      prev.includes(machineId)
        ? prev.filter((id) => id !== machineId)
        : [...prev, machineId],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      onError("Inserisci nome e cognome del lavoratore.");
      return;
    }
    if (!editing && !companyId) {
      onError("Seleziona l'azienda di appartenenza.");
      return;
    }

    setBusy(true);
    onError(null);

    try {
      const metaToSave: EmployeeMetadata = {
        department: department.trim(),
        birthDate: birthDate.trim() || undefined,
        birthPlace: birthPlace.trim() || undefined,
        contractType: contractType || undefined,
        weeklyHours: weeklyHours.trim() || undefined,
        safetyRoles,
        assignedMachineIds,
      };

      const payload: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fiscalCode: fiscalCode.trim().toUpperCase() || undefined,
        role: role.trim() || undefined,
        department: department.trim() || undefined,
        hireDate: hireDate ? new Date(hireDate).toISOString() : undefined,
        birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
        birthPlace: birthPlace.trim() || undefined,
        contractType: contractType || undefined,
        weeklyHours: weeklyHours ? Number(weeklyHours) : undefined,
        safetyRoles: JSON.stringify(safetyRoles),
        assignedEquipment: JSON.stringify(assignedMachineIds),
      };

      if (editing) {
        await updateEmployee(token, editing.id, payload);
      } else {
        await createEmployee(token, { companyId, ...payload });
      }

      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio lavoratore");
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
          maxWidth: "840px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Intestazione Modale */}
        <div
          style={{
            padding: "16px 24px",
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
                backgroundColor: "#e0f2fe",
                color: "#0369a1",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "17px", color: "var(--navy-900, #17203c)" }}>
                {editing ? `Modifica Scheda: ${editing.lastName} ${editing.firstName}` : "Nuovo Lavoratore / Dipendente"}
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                Anagrafica completa, mansione, inquadramento contrattuale, ruoli sicurezza e attrezzature
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

        {/* Corpo del Form Scrollabile */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Sezione 1: Dati Anagrafici */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "12px",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "6px",
              }}
            >
              <User size={16} color="#0284c7" />
              <span>1. Dati Anagrafici & Identificativi</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              {!editing && (
                <Field label="Azienda di Appartenenza *">
                  <select
                    required
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Cognome *">
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="es. Rossi"
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>

              <Field label="Nome *">
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="es. Mario"
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>

              <Field label="Codice Fiscale">
                <input
                  value={fiscalCode}
                  onChange={(e) => setFiscalCode(e.target.value.toUpperCase())}
                  maxLength={16}
                  placeholder="RSSMRA80A01H501Z"
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontFamily: "monospace",
                  }}
                />
              </Field>

              <Field label="Data di Nascita">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>

              <Field label="Luogo di Nascita">
                <input
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="es. Roma (RM)"
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>
            </div>
          </div>

          {/* Sezione 2: Mansione Specifica e Suggerimenti Rapidi */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "8px",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "6px",
              }}
            >
              <Briefcase size={16} color="#0284c7" />
              <span>2. Mansione Lavorativa & Reparto Operativo</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "8px" }}>
              <Field label="Mansione Specifica *">
                <input
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="es. Cuoco, Magazziniere, Carrellista..."
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>

              <Field label="Reparto / Postazione">
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="es. Cucina, Magazzino Merci, Ufficio Tecnico..."
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>
            </div>

            {/* Suggerimenti Rapidi Mansione */}
            <div style={{ marginTop: "6px" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                Suggerimenti rapidi (clicca per impostare la mansione):
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {SUGGESTED_JOB_ROLES.map((sugRole) => (
                  <button
                    key={sugRole}
                    type="button"
                    onClick={() => setRole(sugRole)}
                    style={{
                      fontSize: "11.5px",
                      padding: "3px 8px",
                      borderRadius: "14px",
                      border: role === sugRole ? "1px solid #0284c7" : "1px solid #e2e8f0",
                      backgroundColor: role === sugRole ? "#e0f2fe" : "#f8fafc",
                      color: role === sugRole ? "#0369a1" : "#475569",
                      fontWeight: role === sugRole ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {sugRole}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sezione 3: Inquadramento Contrattuale & Orario */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "12px",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "6px",
              }}
            >
              <Calendar size={16} color="#0284c7" />
              <span>3. Tipo di Contratto, Ore Lavorative & Assunzione</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              <Field label="Tipo di Contratto">
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                >
                  {CONTRACT_TYPES.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Ore Lavorative Settimanali">
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      width: "80px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {WEEKLY_HOURS_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setWeeklyHours(preset.value)}
                        style={{
                          fontSize: "11px",
                          padding: "4px 6px",
                          borderRadius: "4px",
                          border: weeklyHours === preset.value ? "1px solid #0284c7" : "1px solid #cbd5e1",
                          backgroundColor: weeklyHours === preset.value ? "#e0f2fe" : "#ffffff",
                          color: weeklyHours === preset.value ? "#0369a1" : "#475569",
                          fontWeight: weeklyHours === preset.value ? 700 : 500,
                          cursor: "pointer",
                        }}
                      >
                        {preset.value}h
                      </button>
                    ))}
                  </div>
                </div>
              </Field>

              <Field label="Data di Assunzione">
                <input
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </Field>
            </div>
          </div>

          {/* Sezione 4: Ruoli di Sicurezza Assegnati */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "8px",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "6px",
              }}
            >
              <Shield size={16} color="#0284c7" />
              <span>4. Incarichi e Ruoli di Sicurezza sul Lavoro (D.Lgs. 81/08)</span>
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#64748b" }}>
              Seleziona gli incarichi formalmente attribuiti a questo lavoratore. Il sistema aggiungerà in automatico i relativi corsi obbligatori al suo piano formativo.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "8px",
              }}
            >
              {SAFETY_ROLE_OPTIONS.map((sr) => {
                const isSelected = safetyRoles.includes(sr.code);
                return (
                  <label
                    key={sr.code}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: isSelected ? "1px solid #0284c7" : "1px solid #e2e8f0",
                      backgroundColor: isSelected ? "#f0f9ff" : "#f8fafc",
                      cursor: "pointer",
                      fontSize: "12.5px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSafetyRole(sr.code)}
                      style={{ marginTop: "2px" }}
                    />
                    <div>
                      <strong style={{ color: isSelected ? "#0369a1" : "#1e293b", display: "block" }}>
                        {sr.label}
                      </strong>
                      <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>
                        {sr.courseHours}h ({sr.normReference})
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sezione 5: Macchinari e Attrezzature Assegnate */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "8px",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "6px",
              }}
            >
              <Wrench size={16} color="#0284c7" />
              <span>5. Macchinari e Attrezzature di Lavoro Assegnate (Accordo S-R 22/02/2012)</span>
            </div>

            {availableMachines.length === 0 ? (
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Nessun macchinario registrato per questa azienda (puoi censirle nella scheda Macchine e Attrezzature nello Step 4 o nella sezione dedicata).
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "8px",
                  maxHeight: "160px",
                  overflowY: "auto",
                }}
              >
                {availableMachines.map((m) => {
                  const isAssigned = assignedMachineIds.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: isAssigned ? "1px solid #f59e0b" : "1px solid #e2e8f0",
                        backgroundColor: isAssigned ? "#fffbeb" : "#f8fafc",
                        cursor: "pointer",
                        fontSize: "12.5px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => toggleMachine(m.id)}
                      />
                      <div>
                        <strong style={{ color: isAssigned ? "#b45309" : "#1e293b", display: "block" }}>
                          {m.name}
                        </strong>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          {m.brand ? `${m.brand} ` : ""}
                          {m.model || ""}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Azioni */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
              Annulla
            </button>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy
                ? "Salvataggio..."
                : editing
                ? "Salva Modifiche Scheda"
                : "Crea Scheda Lavoratore"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
