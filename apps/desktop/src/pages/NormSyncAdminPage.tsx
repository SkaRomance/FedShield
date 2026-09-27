import { useState, useEffect } from "react";
import {
  CheckCheck,
  Check,
  XCircle,
  RefreshCw,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
} from "lucide-react";
import {
  fetchNormSyncProposals,
  approveNormSyncProposal,
  rejectNormSyncProposal,
  bulkApproveNormSyncProposals,
  bulkRejectNormSyncProposals,
  triggerNormSync,
  fetchNormSyncStatus,
  NormativeProposal,
  NormSyncStatus,
  NormSyncResult,
} from "../api";

import { formattaData } from "../lib/oraItalia";
interface NormSyncAdminPageProps {
  token: string;
}

export default function NormSyncAdminPage({ token }: NormSyncAdminPageProps) {
  const [proposals, setProposals] = useState<NormativeProposal[]>([]);
  const [status, setStatus] = useState<NormSyncStatus | null>(null);
  const [syncResult, setSyncResult] = useState<NormSyncResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedProposalIds, setExpandedProposalIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  async function load() {
    try {
      setLoading(true);
      const filter = statusFilter === "all" ? undefined : statusFilter;
      const [proposalsData, statusData] = await Promise.all([
        fetchNormSyncProposals(token, filter),
        fetchNormSyncStatus(token).catch(() => null),
      ]);
      setProposals(proposalsData);
      if (statusData) setStatus(statusData);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento proposte normative.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  function toggleExpand(id: string) {
    setExpandedProposalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSyncNow() {
    try {
      setSyncing(true);
      setError(null);
      setSuccessMessage(null);
      const res = await triggerNormSync(token);
      setSyncResult(res);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore durante la sincronizzazione delle fonti.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleApprove(id: string) {
    setActionLoading(id);
    setError(null);
    setSuccessMessage(null);
    try {
      await approveNormSyncProposal(token, id);
      setSuccessMessage("Proposta normativa approvata e integrata nelle checklist ispettive.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore approvazione.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    setError(null);
    setSuccessMessage(null);
    try {
      await rejectNormSyncProposal(token, id);
      setSuccessMessage("Proposta normativa rifiutata / archiviata.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore rifiuto.");
    } finally {
      setActionLoading(null);
    }
  }

  // Pending count from status or proposal list
  const pendingCount =
    status?.counts.pending ?? proposals.filter((p) => p.status === "pending").length;

  async function handleBulkApprove() {
    if (pendingCount === 0) return;
    const confirmed = window.confirm(
      `Confermi di voler approvare tutti i ${pendingCount} aggiornamenti normativi in attesa?\n\nVerranno applicati automaticamente ai requisiti ispettivi delle checklist aziendali.`
    );
    if (!confirmed) return;

    try {
      setActionLoading("bulk-approve");
      setError(null);
      setSuccessMessage(null);
      const res = await bulkApproveNormSyncProposals(token);
      setSuccessMessage(`✅ ${res.count} aggiornamenti normativi approvati con successo e integrati nelle checklist!`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore durante l'approvazione di tutti gli aggiornamenti.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleBulkReject() {
    if (pendingCount === 0) return;
    const confirmed = window.confirm(
      `Confermi di voler rifiutare tutti i ${pendingCount} aggiornamenti normativi in attesa?\n\nNon verranno inseriti nelle checklist ispettive.`
    );
    if (!confirmed) return;

    try {
      setActionLoading("bulk-reject");
      setError(null);
      setSuccessMessage(null);
      const res = await bulkRejectNormSyncProposals(token);
      setSuccessMessage(`ℹ️ ${res.count} aggiornamenti normativi rifiutati e archiviati.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore durante il rifiuto di tutti gli aggiornamenti.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="normsync-admin" style={{ padding: "0 8px" }}>
      {/* Header with Title and Global Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <h2 style={{ margin: "0 0 6px 0", fontSize: 24, fontWeight: 700 }}>
            📜 NormSync — Aggiornamenti Normativi &amp; Fonti Ufficiali
          </h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: 14 }}>
            Monitoraggio in tempo reale da Gazzetta Ufficiale ed EUR-Lex con verifica SHA-256 e integrazione controlli ispettivi.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Sync Button */}
          <button
            className="btn-primary"
            onClick={handleSyncNow}
            disabled={syncing || actionLoading !== null}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px" }}
          >
            {syncing ? (
              <>
                <span
                  className="spinner"
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid #fff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Sincronizzazione in corso...
              </>
            ) : (
              <>
                <RefreshCw size={15} /> Sincronizza Fonti Ora
              </>
            )}
          </button>

          {/* Bulk Approve Button */}
          <button
            className="btn-success"
            onClick={handleBulkApprove}
            disabled={actionLoading !== null || syncing || pendingCount === 0}
            title={pendingCount === 0 ? "Nessun aggiornamento in attesa di approvazione" : "Approva tutti gli aggiornamenti normativi"}
          >
            {actionLoading === "bulk-approve" ? (
              <>
                <span
                  className="spinner"
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid #fff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Approvazione in corso...
              </>
            ) : (
              <>
                <CheckCheck size={16} /> Approva tutti ({pendingCount})
              </>
            )}
          </button>

          {/* Bulk Reject Button */}
          <button
            className="btn-danger-outline"
            onClick={handleBulkReject}
            disabled={actionLoading !== null || syncing || pendingCount === 0}
            title={pendingCount === 0 ? "Nessun aggiornamento in attesa da rifiutare" : "Rifiuta tutti gli aggiornamenti normativi"}
          >
            {actionLoading === "bulk-reject" ? (
              <>
                <span
                  className="spinner"
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid var(--color-error)",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Rifiuto in corso...
              </>
            ) : (
              <>
                <XCircle size={16} /> Rifiuta tutti ({pendingCount})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div
          className="status-message"
          style={{
            color: "var(--color-error)",
            background: "var(--color-error-soft)",
            border: "1px solid var(--color-error)",
            padding: "12px 16px",
            borderRadius: "var(--r-md)",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div
          style={{
            color: "var(--color-success)",
            background: "var(--color-success-soft)",
            border: "1px solid var(--color-success)",
            padding: "12px 16px",
            borderRadius: "var(--r-md)",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {syncResult && (
        <div
          style={{
            background: syncResult.proposalsCreated > 0 ? "var(--color-success-soft)" : "var(--color-pending-soft)",
            border: `1px solid ${syncResult.proposalsCreated > 0 ? "var(--color-success)" : "var(--color-pending)"}`,
            padding: "14px 18px",
            borderRadius: "var(--r-md)",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
            {syncResult.proposalsCreated > 0 ? "✅ Nuove proposte generate!" : "ℹ️ Sincronizzazione completata — Archivio allineato"}
          </div>
          <div>
            Controllate <strong>{syncResult.sourcesChecked} fonti</strong> ({syncResult.itemsFound} atti esaminati,{" "}
            {syncResult.relevantItems} pertinenti a sicurezza/HACCP). Generati{" "}
            <strong>{syncResult.proposalsCreated} nuovi requisiti</strong> in bozza per revisione.{" "}
            {syncResult.skippedExisting} atti già presenti (duplicati scartati tramite hash SHA-256).
          </div>
          {syncResult.offlineFallbackUsed && (
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-warning)" }}>
              ⚡ Rete esterna non raggiungibile: caricato feed normativo locale certificato per garantire operatività offline.
            </div>
          )}
        </div>
      )}

      {/* KPI Cards: White/Surface background, high contrast, clean typography */}
      <div className="kpi-grid" style={{ marginTop: 0, marginBottom: 20 }}>
        <article className="kpi-card">
          <h3>Fonti Monitorate</h3>
          <strong>
            {status?.sources.length ?? 3}{" "}
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-success)" }}>● Attive</span>
          </strong>
          <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "var(--color-text-muted)" }}>
            Gazzetta Uff., EUR-Lex, Min. Salute
          </p>
        </article>

        <article className="kpi-card">
          <h3>In Attesa Revisione</h3>
          <strong style={{ color: "var(--color-warning)" }}>{pendingCount}</strong>
          <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "var(--color-text-muted)" }}>
            Richiedono approvazione consulente
          </p>
        </article>

        <article className="kpi-card">
          <h3>Approvate &amp; Integrate</h3>
          <strong style={{ color: "var(--color-success)" }}>
            {status?.counts.approved ?? proposals.filter((p) => p.status === "approved").length}
          </strong>
          <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "var(--color-text-muted)" }}>
            Attive nelle checklist ispettive
          </p>
        </article>

        <article className="kpi-card">
          <h3>Rifiutate / Archiviate</h3>
          <strong style={{ color: "var(--color-text-muted)" }}>
            {status?.counts.rejected ?? proposals.filter((p) => p.status === "rejected").length}
          </strong>
          <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "var(--color-text-muted)" }}>
            Escluse dall'audit
          </p>
        </article>
      </div>

      {/* Controls Bar: Filter Tabs + View Mode Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Tabs */}
        <div role="tablist" aria-label="Filtra per stato proposte" style={{ display: "flex", gap: 8 }}>
          {(["all", "pending", "approved", "rejected"] as const).map((s) => {
            const labels: Record<typeof s, string> = {
              all: "Tutte le proposte",
              pending: `🟡 In attesa (${pendingCount})`,
              approved: "✅ Approvate",
              rejected: "❌ Rifiutate",
            };
            return (
              <button
                key={s}
                role="tab"
                aria-selected={statusFilter === s}
                className={`ghost-btn ${statusFilter === s ? "tab-btn-active" : ""}`}
                onClick={() => setStatusFilter(s)}
                style={{ padding: "7px 14px", fontWeight: statusFilter === s ? 600 : 500 }}
              >
                {labels[s]}
              </button>
            );
          })}
        </div>

        {/* View switcher: Cards (Riquadri) vs Table */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", padding: 2 }}>
          <button
            className={`ghost-btn ${viewMode === "cards" ? "tab-btn-active" : ""}`}
            onClick={() => setViewMode("cards")}
            style={{ padding: "5px 10px", fontSize: 12.5 }}
            title="Vista Schede / Riquadri (consigliata)"
          >
            <LayoutGrid size={14} /> Schede / Riquadri
          </button>
          <button
            className={`ghost-btn ${viewMode === "table" ? "tab-btn-active" : ""}`}
            onClick={() => setViewMode("table")}
            style={{ padding: "5px 10px", fontSize: 12.5 }}
            title="Vista Tabella"
          >
            <List size={14} /> Tabella
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
          <span
            className="spinner"
            style={{
              display: "inline-block",
              width: 24,
              height: 24,
              border: "3px solid var(--color-accent)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              marginBottom: 12,
            }}
          />
          <div>Caricamento aggiornamenti normativi...</div>
        </div>
      ) : proposals.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            background: "var(--color-surface)",
            borderRadius: "var(--r-lg)",
            border: "1px dashed var(--color-border)",
          }}
        >
          <p style={{ color: "var(--color-text-muted)", fontSize: 16, margin: "0 0 16px 0" }}>
            Nessun aggiornamento normativo trovato in questo stato.
          </p>
          <button className="btn-primary" onClick={handleSyncNow} disabled={syncing}>
            <RefreshCw size={14} /> Avvia Sincronizzazione Ora
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* VISTA SCHEDE / RIQUADRI: Visibile a dimensioni normali, azioni sempre in primo piano a destra */
        <div className="norm-proposals-container" style={{ width: "100%" }}>
          {proposals.map((p) => {
            const isExpanded = expandedProposalIds.has(p.id);
            const changes = Array.isArray(p.proposedChanges) ? p.proposedChanges : [];

            return (
              <div key={p.id} className="norm-proposal-card">
                {/* Header della Scheda: Badge, Riferimento, Data E Pulsanti Azione subito visibili */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  {/* Left: Status, Code, Date */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {p.status === "pending" && <span className="status-pill-pending">🟡 In attesa</span>}
                    {p.status === "approved" && <span className="status-pill-approved">✅ Approvata</span>}
                    {p.status === "rejected" && <span className="status-pill-rejected">❌ Rifiutata</span>}

                    <code
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: "var(--color-surface-muted)",
                        color: "var(--color-accent)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {p.normReference}
                    </code>

                    <span
                      style={{
                        fontSize: 12.5,
                        color: "var(--color-text-muted)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Calendar size={13} />
                      {new Date(p.createdAt).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Right: Individual Action Buttons (Approva / Rifiuta) IMMEDIATELY VISIBLE */}
                  {p.status === "pending" && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        className="btn-success"
                        onClick={() => handleApprove(p.id)}
                        disabled={actionLoading !== null}
                        style={{ padding: "6px 14px", fontSize: 12.5 }}
                        title="Approva questo aggiornamento normativo"
                      >
                        {actionLoading === p.id ? "..." : (
                          <>
                            <Check size={14} /> Approva
                          </>
                        )}
                      </button>
                      <button
                        className="btn-danger-outline"
                        onClick={() => handleReject(p.id)}
                        disabled={actionLoading !== null}
                        style={{ padding: "6px 14px", fontSize: 12.5 }}
                        title="Rifiuta questo aggiornamento normativo"
                      >
                        <XCircle size={14} /> Rifiuta
                      </button>
                    </div>
                  )}
                </div>

                {/* Norm Title */}
                <div style={{ marginTop: 10, fontSize: 16, fontWeight: 700, color: "var(--color-text)", lineHeight: 1.35 }}>
                  {p.normTitle}
                </div>

                {/* Change Summary */}
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13.5,
                    color: "var(--color-content-text)",
                    lineHeight: 1.5,
                    background: "var(--color-surface-muted)",
                    padding: "10px 14px",
                    borderRadius: "var(--r-md)",
                  }}
                >
                  <strong style={{ color: "var(--color-text)" }}>Sommario modifica: </strong>
                  {p.changeSummary}
                </div>

                {/* Legislative Excerpt */}
                {p.normText && (
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      fontStyle: "italic",
                      borderLeft: "3px solid var(--color-border-strong)",
                      paddingLeft: 10,
                      lineHeight: 1.45,
                    }}
                  >
                    "{p.normText.slice(0, 240)}
                    {p.normText.length > 240 ? "..." : ""}"
                  </div>
                )}

                {/* Expandable Checklist Requisites */}
                <div style={{ marginTop: 10 }}>
                  <button
                    className="ghost-btn"
                    style={{ fontSize: 12, padding: "4px 8px", color: "var(--color-accent)", fontWeight: 500 }}
                    onClick={() => toggleExpand(p.id)}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={13} /> Nascondi dettaglio modifiche ispettive
                      </>
                    ) : (
                      <>
                        <ChevronDown size={13} /> Mostra modifiche proposte per l'audit ({changes.length})
                      </>
                    )}
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: 12,
                        background: "var(--color-bg)",
                        borderRadius: "var(--r-md)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8, color: "var(--color-text)" }}>
                        Requisiti ispettivi che verranno integrati automaticamente nelle checklist:
                      </div>
                      {changes.length === 0 ? (
                        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                          Requisito generico di conformità normativa D.Lgs. 81/08
                        </div>
                      ) : (
                        changes.map((ch: any, i: number) => (
                          <div
                            key={i}
                            style={{
                              fontSize: 12.5,
                              marginTop: 6,
                              padding: "8px 12px",
                              background: "var(--color-surface)",
                              borderRadius: "var(--r-sm)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            <div style={{ fontWeight: 600, color: "var(--color-text)" }}>• {ch.question}</div>
                            <div style={{ marginTop: 4, color: "var(--color-text-muted)", fontSize: 11.5 }}>
                              Ambito: <code style={{ color: "var(--color-accent)" }}>{ch.domain}</code> | Sezione:{" "}
                              <code>{ch.section}</code> | Sanzionabile: <strong>{ch.sanctionable ? "Sì" : "No"}</strong>{" "}
                              (Gravità: {ch.severity})
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA TABELLA COMPATTA: Nessun overflow orizzontale, 100% responsive */
        <div className="table-wrap" style={{ width: "100%", overflowX: "auto" }}>
          <table className="table-responsive-fixed">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>Titolo Norma</th>
                <th style={{ width: "16%" }}>Riferimento</th>
                <th style={{ width: "32%" }}>Sommario della Modifica</th>
                <th style={{ width: "10%" }}>Stato</th>
                <th style={{ width: "8%" }}>Data</th>
                <th style={{ width: "10%" }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => {
                const isExpanded = expandedProposalIds.has(p.id);
                const changes = Array.isArray(p.proposedChanges) ? p.proposedChanges : [];

                return (
                  <tr key={p.id}>
                    <td style={{ verticalAlign: "top" }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.normTitle}</div>
                      <button
                        className="ghost-btn"
                        style={{ fontSize: 11, padding: "2px 6px", marginTop: 4, color: "var(--color-accent)" }}
                        onClick={() => toggleExpand(p.id)}
                      >
                        {isExpanded ? "▲ Nascondi" : "▼ Modifiche"}
                      </button>
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <code
                        style={{
                          fontSize: 11.5,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "var(--color-surface-muted)",
                        }}
                      >
                        {p.normReference}
                      </code>
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <div style={{ fontSize: 13, lineHeight: 1.4 }}>{p.changeSummary}</div>
                      {p.normText && (
                        <div style={{ marginTop: 4, fontSize: 11.5, color: "var(--color-text-muted)" }}>
                          <em>{p.normText.slice(0, 140)}...</em>
                        </div>
                      )}
                      {isExpanded && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: 8,
                            background: "var(--color-surface-muted)",
                            borderRadius: "var(--r-sm)",
                            fontSize: 11.5,
                          }}
                        >
                          <strong>Requisiti integrati:</strong>
                          {changes.map((ch: any, i: number) => (
                            <div key={i} style={{ marginTop: 3 }}>
                              • {ch.question} ({ch.domain})
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ verticalAlign: "top", fontSize: 12.5, color: "var(--color-text-muted)" }}>
                      {formattaData(p.createdAt)}
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      {p.status === "pending" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <button
                            className="btn-success"
                            onClick={() => handleApprove(p.id)}
                            disabled={actionLoading === p.id}
                            style={{ fontSize: 11.5, padding: "4px 8px" }}
                          >
                            ✓ Approva
                          </button>
                          <button
                            className="btn-danger-outline"
                            onClick={() => handleReject(p.id)}
                            disabled={actionLoading === p.id}
                            style={{ fontSize: 11.5, padding: "4px 8px" }}
                          >
                            ✕ Rifiuta
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
