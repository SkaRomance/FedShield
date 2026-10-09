import React, { useState } from "react";
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  Award,
  Shield,
  Wrench,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Employee, TrainingCourse } from "../../api";
import {
  IndividualTrainingPlan,
  PlannedCourseItem,
  SAFETY_ROLE_OPTIONS,
} from "../../lib/individualTrainingPlan";
import { formattaData } from "../../lib/oraItalia";

interface IndividualPlanCardProps {
  plan: IndividualTrainingPlan;
  employee: Employee;
  courses: TrainingCourse[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onAddTrainingRecord: (employee: Employee, preselectedCourse?: PlannedCourseItem) => void;
  defaultExpanded?: boolean;
}

export default function IndividualPlanCard({
  plan,
  employee,
  onEdit,
  onDelete,
  onAddTrainingRecord,
  defaultExpanded = false,
}: IndividualPlanCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const statusBorderColor =
    plan.overallStatus === "conforme"
      ? "#22c55e"
      : plan.overallStatus === "attenzione"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderLeft: `5px solid ${statusBorderColor}`,
        borderRadius: "10px",
        marginBottom: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Intestazione Scheda Lavoratore */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          backgroundColor: "#f8fafc",
          borderBottom: expanded ? "1px solid #e2e8f0" : "none",
        }}
      >
        <div style={{ flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h4
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--navy-900, #17203c)",
              }}
            >
              {plan.employeeFullName}
            </h4>
            {plan.fiscalCode && (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "#475569",
                  backgroundColor: "#e2e8f0",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: 600,
                }}
              >
                {plan.fiscalCode}
              </span>
            )}
            <span
              style={{
                backgroundColor:
                  plan.overallStatus === "conforme"
                    ? "#dcfce7"
                    : plan.overallStatus === "attenzione"
                    ? "#fef3c7"
                    : "#fee2e2",
                color:
                  plan.overallStatus === "conforme"
                    ? "#15803d"
                    : plan.overallStatus === "attenzione"
                    ? "#b45309"
                    : "#b91c1c",
                fontSize: "12px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {plan.overallStatus === "conforme" && <CheckCircle2 size={13} />}
              {plan.overallStatus === "attenzione" && <AlertTriangle size={13} />}
              {plan.overallStatus === "critico" && <XCircle size={13} />}
              {plan.compliancePercentage}% Conforme ({plan.completedCoursesCount}/{plan.totalRequiredCourses} corsi)
            </span>
          </div>

          {/* Dettagli Mansione, Contratto, Reparto */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "8px",
              fontSize: "13px",
              color: "#475569",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Briefcase size={14} color="#0284c7" />
              <strong>Mansione:</strong> {plan.role}
            </span>
            {plan.cleanDepartment && plan.cleanDepartment !== "—" && (
              <span>
                <strong>Reparto:</strong> {plan.cleanDepartment}
              </span>
            )}
            {plan.contractType && (
              <span>
                <strong>Contratto:</strong> {plan.contractType}
              </span>
            )}
            {plan.weeklyHours && (
              <span>
                <strong>Orario:</strong> {plan.weeklyHours}h/sett.
              </span>
            )}
            {plan.birthDate && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={13} color="#64748b" />
                Nato: {formattaData(plan.birthDate)} {plan.birthPlace ? `a ${plan.birthPlace}` : ""}
              </span>
            )}
          </div>

          {/* Ruoli di Sicurezza e Macchine Assegnate */}
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            {plan.safetyRoles.map((roleCode) => {
              const def = SAFETY_ROLE_OPTIONS.find((r) => r.code === roleCode);
              return (
                <span
                  key={roleCode}
                  style={{
                    backgroundColor: "#e0e7ff",
                    color: "#3730a3",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    border: "1px solid #c7d2fe",
                  }}
                >
                  <Shield size={12} />
                  {def ? def.label : roleCode}
                </span>
              );
            })}

            {plan.assignedMachines.map((m) => (
              <span
                key={m.id}
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  border: "1px solid #fde68a",
                }}
              >
                <Wrench size={12} />
                {m.name}
              </span>
            ))}
          </div>
        </div>

        {/* Barra di Avanzamento e Azioni Rapide */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Progress Bar Compatta */}
          <div style={{ width: "130px", textAlign: "right" }}>
            <div
              style={{
                height: "8px",
                backgroundColor: "#e2e8f0",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${plan.compliancePercentage}%`,
                  backgroundColor:
                    plan.overallStatus === "conforme"
                      ? "#22c55e"
                      : plan.overallStatus === "attenzione"
                      ? "#f59e0b"
                      : "#ef4444",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600 }}>
              {plan.totalCompletedHours}h su {plan.totalRequiredHours}h obbligatorie
            </span>
          </div>

          {/* Pulsanti Azione */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => onAddTrainingRecord(employee)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                padding: "6px 10px",
                backgroundColor: "#f0f9ff",
                color: "#0369a1",
                borderColor: "#bae6fd",
                fontWeight: 600,
              }}
              title="Registra attestato per questo lavoratore"
            >
              <Plus size={14} />
              + Formazione
            </button>

            <button
              type="button"
              className="ghost-btn"
              onClick={() => onEdit(employee)}
              style={{ padding: "6px 8px" }}
              title="Modifica anagrafica lavoratore"
            >
              <Pencil size={14} />
            </button>

            <button
              type="button"
              className="ghost-btn"
              onClick={() => onDelete(employee.id)}
              style={{ padding: "6px 8px", color: "var(--color-error, #ef4444)" }}
              title="Disattiva lavoratore"
            >
              <Trash2 size={14} />
            </button>

            <button
              type="button"
              className="ghost-btn"
              onClick={() => setExpanded((prev) => !prev)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
                fontWeight: 600,
                fontSize: "12.5px",
                backgroundColor: expanded ? "#e2e8f0" : "#ffffff",
              }}
            >
              {expanded ? (
                <>
                  Chiudi <ChevronUp size={15} />
                </>
              ) : (
                <>
                  Dettagli ({plan.courses.length}) <ChevronDown size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scheda Espandibile: Progettazione Formativa Dettagliata */}
      {expanded && (
        <div style={{ padding: "16px 20px", backgroundColor: "#ffffff" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <GraduationCap size={18} color="#0284c7" />
              <h5 style={{ margin: 0, fontSize: "14.5px", color: "#1e293b", fontWeight: 700 }}>
                Piano Formativo Individuale di Legge (D.Lgs. 81/08 & Accordi S-R)
              </h5>
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Totale fabbisogno: <strong>{plan.totalRequiredHours} ore</strong> | Valide:{" "}
              <strong style={{ color: "#16a34a" }}>{plan.totalCompletedHours} ore</strong>
            </div>
          </div>

          {/* Tabella dei corsi pianificati per il lavoratore */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", textAlign: "left", borderBottom: "1px solid #cbd5e1" }}>
                  <th style={{ padding: "8px 10px", color: "#475569", fontWeight: 600 }}>Corso di Legge</th>
                  <th style={{ padding: "8px 10px", color: "#475569", fontWeight: 600 }}>Motivo & Norma</th>
                  <th style={{ padding: "8px 10px", color: "#475569", fontWeight: 600 }}>Ore</th>
                  <th style={{ padding: "8px 10px", color: "#475569", fontWeight: 600 }}>Frequenza</th>
                  <th style={{ padding: "8px 10px", color: "#475569", fontWeight: 600 }}>Stato & Scadenza</th>
                  <th style={{ padding: "8px 10px", color: "#475569", fontWeight: 600 }}>Attestato</th>
                  <th style={{ padding: "8px 10px", color: "#475569", fontWeight: 600, textAlign: "right" }}>
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody>
                {plan.courses.map((course) => (
                  <tr
                    key={course.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      backgroundColor: course.status === "valido" ? "transparent" : "#fffbeb",
                    }}
                  >
                    {/* Nome Corso */}
                    <td style={{ padding: "10px", verticalAlign: "top" }}>
                      <strong style={{ color: "#0f172a", display: "block" }}>{course.name}</strong>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          backgroundColor: "#f1f5f9",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          marginTop: "2px",
                          display: "inline-block",
                        }}
                      >
                        {course.categoryLabel}
                      </span>
                    </td>

                    {/* Motivo e Norma */}
                    <td style={{ padding: "10px", verticalAlign: "top", color: "#475569", fontSize: "12px" }}>
                      <div style={{ color: "#334155" }}>{course.reason}</div>
                      <div style={{ color: "#64748b", fontStyle: "italic", marginTop: "2px" }}>
                        ⚖️ {course.normReference}
                      </div>
                    </td>

                    {/* Ore */}
                    <td style={{ padding: "10px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <strong>{course.hoursDone || course.minHours}h</strong> / {course.minHours}h
                    </td>

                    {/* Frequenza */}
                    <td style={{ padding: "10px", verticalAlign: "top", color: "#64748b", whiteSpace: "nowrap" }}>
                      {course.frequencyYears === 0
                        ? "Permanente"
                        : `ogni ${course.frequencyYears} ${course.frequencyYears === 1 ? "anno" : "anni"}`}
                    </td>

                    {/* Stato & Scadenza */}
                    <td style={{ padding: "10px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          backgroundColor: course.statusBg,
                          color: course.statusColor,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          display: "inline-block",
                        }}
                      >
                        {course.statusLabel}
                      </span>
                      {course.expiresAt && (
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                          Scadenza: {formattaData(course.expiresAt)}
                        </div>
                      )}
                    </td>

                    {/* Dati Attestato */}
                    <td style={{ padding: "10px", verticalAlign: "top", fontSize: "12px", color: "#475569" }}>
                      {course.certificateNumber ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Award size={13} color="#059669" />
                          <strong>N. {course.certificateNumber}</strong>
                        </span>
                      ) : course.status === "valido" ? (
                        <span style={{ color: "#16a34a" }}>Registrato</span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                      {course.completedAt && (
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          del {formattaData(course.completedAt)}
                        </div>
                      )}
                    </td>

                    {/* Azione Registra Attestato */}
                    <td style={{ padding: "10px", verticalAlign: "top", textAlign: "right" }}>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => onAddTrainingRecord(employee, course)}
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          color: "#0284c7",
                          borderColor: "#bae6fd",
                          backgroundColor: "#f0f9ff",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                        title="Registra attestato per questo corso"
                      >
                        {course.record ? "Aggiorna" : "+ Registra Attestato"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
