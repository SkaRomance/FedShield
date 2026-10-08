import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  Building2,
  FileBadge,
  HardHat,
  Apple,
  Wrench,
  Flame,
  GraduationCap,
  ArrowUpDown,
} from "lucide-react";
import {
  Company,
  Equipment,
  fetchEmployees,
  fetchEquipment,
  fetchFireExtinguishers,
  fetchFirstAidKits,
  fetchInspectionDocumentRequirements,
  fetchMachines,
  fetchTrainingCourses,
  FireExtinguisher,
  FirstAidKit,
  Inspection,
  InspectionDocumentRequirement,
  Machine,
  TrainingCourse,
  Employee,
} from "../api";
import { formattaData, perCampoData } from "../lib/oraItalia";
import {
  aggregateAllDeadlines,
  AggregatedDeadline,
  CalculationMethod,
  DEADLINE_CATEGORIES_INFO,
  DeadlineCategory,
  DeadlinesSortBy,
  DeadlineUrgency,
  getDeadlinesSummary,
  getUrgencyBadgeColor,
  getUrgencyLabel,
  sortDeadlines,
  SortDirection,
} from "../lib/deadlinesEngine";

export interface DeadlinesPageProps {
  token: string;
  companies: Company[];
  inspections: Inspection[];
  userRole?: string;
  initialCompanyId?: string;
}

const CATEGORY_ICONS: Record<DeadlineCategory, typeof HardHat> = {
  autorizzazioni: FileBadge,
  sicurezza: HardHat,
  haccp_acque: Apple,
  attrezzature: Wrench,
  antincendio_pronto_soccorso: Flame,
  formazione_sanitaria: GraduationCap,
};

export default function DeadlinesPage({
  token,
  companies,
  inspections,
  userRole,
  initialCompanyId,
}: DeadlinesPageProps) {
  // Filtri
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanyId ?? "");
  const [selectedCategory, setSelectedCategory] = useState<DeadlineCategory | "all">("all");
  const [selectedUrgency, setSelectedUrgency] = useState<DeadlineUrgency | "all" | "upcoming">("all");
  const [selectedMethod, setSelectedMethod] = useState<CalculationMethod | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<DeadlinesSortBy>("urgency");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  // Dati remoti
  const [machines, setMachines] = useState<Machine[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [fireExtinguishers, setFireExtinguishers] = useState<FireExtinguisher[]>([]);
  const [firstAidKits, setFirstAidKits] = useState<FirstAidKit[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>([]);
  const [inspectionDocumentsMap, setInspectionDocumentsMap] = useState<
    Record<string, InspectionDocumentRequirement[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Caricamento dati
  async function loadRemoteAssets() {
    setLoading(true);
    setStatusMessage("Caricamento scadenze da beni, attrezzature e formazione...");
    try {
      const [eqRes, macRes, feRes, fakRes, empRes, tcRes] = await Promise.allSettled([
        fetchEquipment(token),
        fetchMachines(token),
        fetchFireExtinguishers(token),
        fetchFirstAidKits(token),
        fetchEmployees(token),
        fetchTrainingCourses(token),
      ]);

      if (eqRes.status === "fulfilled") setEquipment(eqRes.value);
      if (macRes.status === "fulfilled") setMachines(macRes.value);
      if (feRes.status === "fulfilled") setFireExtinguishers(feRes.value);
      if (fakRes.status === "fulfilled") setFirstAidKits(fakRes.value);
      if (empRes.status === "fulfilled") setEmployees(empRes.value);
      if (tcRes.status === "fulfilled") setTrainingCourses(tcRes.value);

      // Carica requisiti documentali per i sopralluoghi più recenti (fino a 30)
      const recentInspections = inspections.slice(0, 30);
      const docEntries = await Promise.all(
        recentInspections.map(async (insp) => {
          try {
            const docs = await fetchInspectionDocumentRequirements(token, insp.id);
            return [insp.id, docs] as const;
          } catch {
            return [insp.id, []] as const;
          }
        }),
      );

      const docMap: Record<string, InspectionDocumentRequirement[]> = {};
      for (const [id, docs] of docEntries) {
        docMap[id] = docs;
      }
      setInspectionDocumentsMap(docMap);
      setStatusMessage("");
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Errore durante il caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRemoteAssets();
  }, [token, inspections]);

  // Aggregazione globale di tutte le scadenze
  const allDeadlines = useMemo(() => {
    const enrichedInspections = inspections.map((insp) => ({
      id: insp.id,
      title: insp.title,
      happenedAt: insp.happenedAt,
      status: insp.status,
      checklistMode: insp.checklistMode,
      companyId: insp.companyId,
      company: insp.company,
      documents: (inspectionDocumentsMap[insp.id] || []).map((doc) => ({
        templateId: doc.documentTemplateId,
        name: doc.name,
        status: doc.status,
        note: doc.note,
        isRequired: doc.isRequired,
      })),
    }));

    return aggregateAllDeadlines({
      companies,
      inspections: enrichedInspections,
      machines,
      equipment,
      fireExtinguishers,
      firstAidKits,
      employees,
      trainingCourses,
    });
  }, [
    companies,
    inspections,
    inspectionDocumentsMap,
    machines,
    equipment,
    fireExtinguishers,
    firstAidKits,
    employees,
    trainingCourses,
  ]);

  // Riepilogo statistico (KPI)
  const summary = useMemo(() => {
    const companyFiltered = selectedCompanyId
      ? allDeadlines.filter((d) => d.companyId === selectedCompanyId)
      : allDeadlines;
    return getDeadlinesSummary(companyFiltered);
  }, [allDeadlines, selectedCompanyId]);

  // Filtraggio e ordinamento per la tabella
  const filteredDeadlines = useMemo(() => {
    let list = allDeadlines;

    if (selectedCompanyId) {
      list = list.filter((d) => d.companyId === selectedCompanyId);
    }
    if (selectedCategory !== "all") {
      list = list.filter((d) => d.category === selectedCategory);
    }
    if (selectedUrgency !== "all") {
      if (selectedUrgency === "upcoming") {
        list = list.filter(
          (d) => d.urgency === "expired" || d.urgency === "critical" || d.urgency === "warning",
        );
      } else {
        list = list.filter((d) => d.urgency === selectedUrgency);
      }
    }
    if (selectedMethod !== "all") {
      list = list.filter((d) => d.calculationMethod === selectedMethod);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.subTitle && d.subTitle.toLowerCase().includes(q)) ||
          (d.identifier && d.identifier.toLowerCase().includes(q)) ||
          (d.normReference && d.normReference.toLowerCase().includes(q)) ||
          d.companyName.toLowerCase().includes(q) ||
          (d.companyAteco && d.companyAteco.toLowerCase().includes(q)) ||
          (d.note && d.note.toLowerCase().includes(q)),
      );
    }

    return sortDeadlines(list, sortBy, sortDir);
  }, [allDeadlines, selectedCompanyId, selectedCategory, selectedUrgency, selectedMethod, searchQuery, sortBy, sortDir]);

  // Esportazione CSV
  function handleExportCsv() {
    if (filteredDeadlines.length === 0) return;
    const headers = [
      "Azienda",
      "ATECO",
      "Categoria",
      "Titolo Adempimento",
      "Identificativo / Matricola / CF",
      "Norma di Legge",
      "Data Emissione / Rilevamento",
      "Data Scadenza",
      "Giorni Residui",
      "Stato Urgenza",
      "Metodo Calcolo",
      "Note",
    ];
    const rows = filteredDeadlines.map((d) => [
      `"${(d.companyName || "").replace(/"/g, '""')}"`,
      `"${(d.companyAteco || "").replace(/"/g, '""')}"`,
      `"${(d.categoryLabel || "").replace(/"/g, '""')}"`,
      `"${(d.title || "").replace(/"/g, '""')}"`,
      `"${(d.identifier || "").replace(/"/g, '""')}"`,
      `"${(d.normReference || "").replace(/"/g, '""')}"`,
      `"${d.issueDate ? formattaData(d.issueDate) : ""}"`,
      `"${d.deadlineDate ? formattaData(d.deadlineDate) : "Da programmare"}"`,
      d.daysRemaining !== null && d.daysRemaining !== undefined ? String(d.daysRemaining) : "",
      `"${getUrgencyLabel(d.urgency, d.daysRemaining)}"`,
      `"${d.calculationMethod === "explicit" ? "Manuale" : d.calculationMethod === "calculated_from_issue" ? "Di Legge (da data rilascio)" : d.calculationMethod === "calculated_from_inspection" ? "Di Legge (da sopralluogo)" : "Da programmare"}"`,
      `"${(d.note || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fedshield-scadenzario-${perCampoData(new Date())}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleToggleSort(field: DeadlinesSortBy) {
    if (sortBy === field) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4, 16px)" }}>
      {/* Testata della pagina */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarClock size={24} style={{ color: "var(--color-primary, #0f4c81)" }} />
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text, #1e293b)" }}>
              Scadenzario Globale & Conformità Normativa
            </h1>
          </div>
          <p style={{ margin: "4px 0 0 0", color: "var(--color-text-muted, #64748b)", fontSize: 14 }}>
            Monitoraggio continuo e calcolo automatico dei termini di legge (D.Lgs. 81/08, D.P.R. 462, D.P.R. 151, Reg. CE 852, D.Lgs. 18/23).
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className="ghost-btn"
            onClick={loadRemoteAssets}
            disabled={loading}
            title="Ricarica tutti i dati"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} />
            <span>Aggiorna</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleExportCsv}
            disabled={filteredDeadlines.length === 0}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Download size={15} />
            <span>Esporta CSV ({filteredDeadlines.length})</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="status-banner status-banner-warning" style={{ fontSize: 13 }}>
          {statusMessage}
        </div>
      )}

      {/* Griglia KPI con conteggi interattivi */}
      <section className="kpi-grid">
        <article
          className={`kpi-card ${selectedUrgency === "all" ? "kpi-card-selected" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedUrgency("all")}
          title="Mostra tutti gli adempimenti"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Totale Adempimenti</h3>
            <CalendarClock size={16} style={{ color: "var(--color-text-muted)" }} />
          </div>
          <strong>{summary.total}</strong>
          <span className="kpi-card-nota">Tutti i record tracciati</span>
        </article>

        <article
          className={`kpi-card ${summary.expired > 0 ? "kpi-card-critico" : ""} ${
            selectedUrgency === "expired" ? "kpi-card-selected" : ""
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedUrgency("expired")}
          title="Filtra solo gli adempimenti scaduti"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: summary.expired > 0 ? "#b42318" : undefined }}>Scaduti</h3>
            <AlertTriangle size={16} style={{ color: summary.expired > 0 ? "#b42318" : "var(--color-text-muted)" }} />
          </div>
          <strong style={{ color: summary.expired > 0 ? "#b42318" : undefined }}>{summary.expired}</strong>
          <span className="kpi-card-nota" style={{ color: summary.expired > 0 ? "#b42318" : undefined }}>
            {summary.expired === 0 ? "Nessun adempimento scaduto" : "Azione immediata richiesta"}
          </span>
        </article>

        <article
          className={`kpi-card ${summary.critical > 0 ? "kpi-card-critico" : ""} ${
            selectedUrgency === "critical" ? "kpi-card-selected" : ""
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedUrgency("critical")}
          title="Filtra scadenze entro 30 giorni"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: summary.critical > 0 ? "#cc4409" : undefined }}>Entro 30 giorni</h3>
            <Clock size={16} style={{ color: summary.critical > 0 ? "#cc4409" : "var(--color-text-muted)" }} />
          </div>
          <strong style={{ color: summary.critical > 0 ? "#cc4409" : undefined }}>{summary.critical}</strong>
          <span className="kpi-card-nota">Rinnovare con urgenza</span>
        </article>

        <article
          className={`kpi-card ${selectedUrgency === "warning" ? "kpi-card-selected" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedUrgency("warning")}
          title="Filtra scadenze tra 31 e 90 giorni"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Entro 90 giorni</h3>
            <Clock size={16} style={{ color: "var(--color-text-muted)" }} />
          </div>
          <strong>{summary.warning}</strong>
          <span className="kpi-card-nota">Pianificare nel trimestre</span>
        </article>

        <article
          className={`kpi-card ${selectedUrgency === "ok" ? "kpi-card-selected" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedUrgency("ok")}
          title="Filtra adempimenti regolari"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Regolari</h3>
            <CheckCircle2 size={16} style={{ color: "#067647" }} />
          </div>
          <strong>{summary.ok}</strong>
          <span className="kpi-card-nota">Validità &gt; 90 giorni</span>
        </article>

        <article
          className={`kpi-card ${selectedUrgency === "to_schedule" ? "kpi-card-selected" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedUrgency("to_schedule")}
          title="Filtra adempimenti privi di data certa"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Da Programmare</h3>
            <HelpCircle size={16} style={{ color: "var(--color-text-muted)" }} />
          </div>
          <strong>{summary.toSchedule}</strong>
          <span className="kpi-card-nota">Data assente o non pervenuta</span>
        </article>
      </section>

      {/* Barra dei Filtri */}
      <section className="panel" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          {/* Selettore Azienda */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 260 }}>
            <Building2 size={18} style={{ color: "var(--color-text-muted)" }} />
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--color-border, #d8dde6)",
                background: "var(--color-surface, #fff)",
                fontSize: 14,
                fontWeight: 500,
                width: "100%",
              }}
            >
              <option value="">Tutte le aziende ({companies.length})</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.atecoCode ? `(${c.atecoCode})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Ricerca testuale rapida */}
          <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Cerca per titolo, norma, matricola, note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "8px 12px 8px 32px",
                borderRadius: 6,
                border: "1px solid var(--color-border, #d8dde6)",
                width: "100%",
                fontSize: 14,
              }}
            />
          </div>

          {/* Filtro Urgenza */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Urgenza:</span>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value as any)}
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--color-border, #d8dde6)",
                fontSize: 13,
              }}
            >
              <option value="all">Tutte le urgenze</option>
              <option value="upcoming">Tutte le imminenti (&lt; 90 gg o scadute)</option>
              <option value="expired">Solo scadute (&lt; 0 gg)</option>
              <option value="critical">Critiche (0 - 30 gg)</option>
              <option value="warning">In scadenza (31 - 90 gg)</option>
              <option value="ok">Regolari (&gt; 90 gg)</option>
              <option value="to_schedule">Da programmare</option>
            </select>
          </div>

          {/* Filtro Metodo */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Metodo:</span>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as any)}
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--color-border, #d8dde6)",
                fontSize: 13,
              }}
            >
              <option value="all">Tutti i metodi</option>
              <option value="explicit">Inseriti manualmente</option>
              <option value="calculated_from_issue">Di Legge (da data rilascio)</option>
              <option value="calculated_from_inspection">Di Legge (da sopralluogo)</option>
              <option value="unscheduled">Da programmare</option>
            </select>
          </div>
        </div>

        {/* Categorie in pillole orizzontali */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, borderTop: "1px solid var(--color-border, #e2e8f0)", paddingTop: 12 }}>
          <button
            type="button"
            className={`ghost-btn ${selectedCategory === "all" ? "ghost-btn-active" : ""}`}
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: "5px 12px",
              fontSize: 13,
              borderRadius: 20,
              background: selectedCategory === "all" ? "var(--color-primary, #0f4c81)" : undefined,
              color: selectedCategory === "all" ? "#ffffff" : undefined,
              border: "1px solid var(--color-border, #d8dde6)",
            }}
          >
            Tutte le categorie ({allDeadlines.length})
          </button>

          {(Object.keys(DEADLINE_CATEGORIES_INFO) as DeadlineCategory[]).map((catKey) => {
            const meta = DEADLINE_CATEGORIES_INFO[catKey];
            const Icon = CATEGORY_ICONS[catKey] || HardHat;
            const count = allDeadlines.filter((d) => d.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                type="button"
                className="ghost-btn"
                onClick={() => setSelectedCategory(catKey)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  fontSize: 13,
                  borderRadius: 20,
                  background: isSelected ? "var(--color-primary, #0f4c81)" : undefined,
                  color: isSelected ? "#ffffff" : undefined,
                  border: "1px solid var(--color-border, #d8dde6)",
                }}
              >
                <Icon size={14} />
                <span>{meta.title}</span>
                <span style={{ opacity: 0.8, fontSize: 12 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tabella degli adempimenti */}
      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
            Elenco Adempimenti & Scadenze ({filteredDeadlines.length})
          </h2>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            Ordinamento: <strong>{sortBy}</strong> ({sortDir === "asc" ? "crescente" : "decrescente"})
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 140, cursor: "pointer" }} onClick={() => handleToggleSort("urgency")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span>Stato / Urgenza</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th style={{ width: 140, cursor: "pointer" }} onClick={() => handleToggleSort("category")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span>Categoria</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleToggleSort("company")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span>Azienda Cliente</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleToggleSort("title")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span>Adempimento / Bene / Corso</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th>Riferimento di Legge</th>
                <th style={{ width: 110 }}>Data Riferimento</th>
                <th style={{ width: 140, cursor: "pointer" }} onClick={() => handleToggleSort("deadlineDate")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span>Data Scadenza</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDeadlines.map((item) => {
                const colors = getUrgencyBadgeColor(item.urgency);
                const label = getUrgencyLabel(item.urgency, item.daysRemaining);
                const Icon = CATEGORY_ICONS[item.category] || HardHat;

                return (
                  <tr key={item.id}>
                    {/* Badge Urgenza */}
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </span>
                    </td>

                    {/* Categoria */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                        <Icon size={14} style={{ color: "var(--color-primary, #0f4c81)" }} />
                        <span>{item.categoryLabel}</span>
                      </div>
                    </td>

                    {/* Azienda */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.companyName}</div>
                      {item.companyAteco && (
                        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                          ATECO: {item.companyAteco}
                        </div>
                      )}
                    </td>

                    {/* Titolo e Dettagli */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text, #1e293b)" }}>
                        {item.title}
                      </div>
                      {item.subTitle && (
                        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{item.subTitle}</div>
                      )}
                      {item.identifier && (
                        <div style={{ fontSize: 12, color: "var(--color-primary, #0f4c81)", fontFamily: "monospace" }}>
                          Identificativo: {item.identifier}
                        </div>
                      )}
                      {item.note && (
                        <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic", marginTop: 2 }}>
                          {item.note}
                        </div>
                      )}
                    </td>

                    {/* Norma di riferimento */}
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontSize: 12,
                          background: "#f1f5f9",
                          color: "#334155",
                          border: "1px solid #cbd5e1",
                        }}
                      >
                        {item.normReference}
                      </span>
                    </td>

                    {/* Data Riferimento / Rilascio */}
                    <td style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                      {item.issueDate ? formattaData(item.issueDate) : "—"}
                    </td>

                    {/* Data Scadenza + Metodo */}
                    <td>
                      {item.deadlineDate ? (
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{formattaData(item.deadlineDate)}</div>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: 2,
                              fontSize: 11,
                              padding: "1px 5px",
                              borderRadius: 3,
                              background:
                                item.calculationMethod === "explicit"
                                  ? "#e0e7ff"
                                  : item.calculationMethod === "calculated_from_issue"
                                  ? "#ecfdf5"
                                  : "#fef3c7",
                              color:
                                item.calculationMethod === "explicit"
                                  ? "#3730a3"
                                  : item.calculationMethod === "calculated_from_issue"
                                  ? "#065f46"
                                  : "#92400e",
                            }}
                          >
                            {item.calculationMethod === "explicit"
                              ? "Inserita a mano"
                              : item.calculationMethod === "calculated_from_issue"
                              ? "Di Legge (da rilascio)"
                              : "Di Legge (da sopralluogo)"}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 13 }}>
                            Da programmare
                          </span>
                          <div style={{ fontSize: 11, color: "#e11d48", fontWeight: 500 }}>
                            Mancano dati temporali
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredDeadlines.length === 0 && (
                <tr>
                  <td colSpan={7} className="tabella-vuota" style={{ padding: 32, textAlign: "center" }}>
                    Nessuna scadenza trovata per i filtri selezionati.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
