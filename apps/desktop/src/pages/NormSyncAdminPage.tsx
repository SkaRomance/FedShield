import { useState, useEffect } from "react";
import {
  fetchNormSyncProposals,
  approveNormSyncProposal,
  rejectNormSyncProposal,
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
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);

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

  async function handleSyncNow() {
    try {
      setSyncing(true);
      setError(null);
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
    try {
      await approveNormSyncProposal(token, id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore approvazione.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    try {
      await rejectNormSyncProposal(token, id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore rifiuto.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="normsync-admin" style={{ padding: "0 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: "0 0 6px 0", fontSize: 24 }}>📜 NormSync — Monitoraggio Fonti & Proposte Normative</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: 14 }}>
            Sincronizzazione in tempo reale da Gazzetta Ufficiale ed EUR-Lex con deduplicazione SHA-256 e integrazione controlli ispettivi.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn-primary"
            onClick={handleSyncNow}
            disabled={syncing}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", fontWeight: 600 }}
          >
            {syncing ? (
              <>
                <span className="spinner" style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Sincronizzazione in corso...
              </>
            ) : (
              <>
                <span aria-hidden="true">🔄</span> Sincronizza Fonti Ufficiali Ora
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="status-message" style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid #ef4444", padding: "12px 16px", borderRadius: 8, marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {syncResult && (
        <div
          style={{
            background: syncResult.proposalsCreated > 0 ? "rgba(16,185,129,0.08)" : "rgba(59,130,246,0.08)",
            border: `1px solid ${syncResult.proposalsCreated > 0 ? "#10b981" : "#3b82f6"}`,
            padding: "14px 18px",
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
            {syncResult.proposalsCreated > 0 ? "✅ Nuove proposte generate!" : "ℹ️ Sincronizzazione completata — Archivio allineato"}
          </div>
          <div>
            Controllate <strong>{syncResult.sourcesChecked} fonti</strong> ({syncResult.itemsFound} atti esaminati, {syncResult.relevantItems} pertinenti a sicurezza/HACCP).
            Generati <strong>{syncResult.proposalsCreated} nuovi requisiti</strong> in bozza per revisione. {syncResult.skippedExisting} atti già presenti (duplicati scartati tramite hash SHA-256).
          </div>
          {syncResult.offlineFallbackUsed && (
            <div style={{ marginTop: 6, fontSize: 12, color: "#f59e0b" }}>
              ⚡ Rete esterna non raggiungibile: caricato feed normativo locale certificato per garantire operatività offline.
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "var(--color-card-bg, #1e293b)", padding: 16, borderRadius: 8, border: "1px solid var(--color-border, #334155)" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Fonti Monitorate</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
            {status?.sources.length ?? 3} <span style={{ fontSize: 13, fontWeight: 400, color: "#10b981" }}>● Attive</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>Gazzetta Uff., EUR-Lex, Min. Salute</div>
        </div>

        <div style={{ background: "var(--color-card-bg, #1e293b)", padding: 16, borderRadius: 8, border: "1px solid var(--color-border, #334155)" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", textTransform: "uppercase" }}>In Attesa Revisione</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>
            {status?.counts.pending ?? proposals.filter((p) => p.status === "pending").length}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>Richiedono approvazione consulente</div>
        </div>

        <div style={{ background: "var(--color-card-bg, #1e293b)", padding: 16, borderRadius: 8, border: "1px solid var(--color-border, #334155)" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Approvate & Integrate</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#10b981", marginTop: 4 }}>
            {status?.counts.approved ?? proposals.filter((p) => p.status === "approved").length}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>Attive nelle checklist ispettive</div>
        </div>

        <div style={{ background: "var(--color-card-bg, #1e293b)", padding: 16, borderRadius: 8, border: "1px solid var(--color-border, #334155)" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Rifiutate / Archiviate</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-muted)", marginTop: 4 }}>
            {status?.counts.rejected ?? proposals.filter((p) => p.status === "rejected").length}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>Escluse dall'audit</div>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Filtra per stato proposte"
        style={{ display: "flex", gap: 8, marginBottom: 14 }}
      >
        {(["all", "pending", "approved", "rejected"] as const).map((s) => {
          const labels: Record<typeof s, string> = {
            all: "Tutte le proposte",
            pending: "🟡 In attesa",
            approved: "✅ Approvate",
            rejected: "❌ Rifiutate",
          };
          return (
            <button
              key={s}
              role="tab"
              aria-selected={statusFilter === s}
              className={`ghost-btn ${statusFilter === s ? "nav-item-active" : ""}`}
              onClick={() => setStatusFilter(s)}
              style={{ padding: "6px 14px" }}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ padding: "24px 0", textAlign: "center" }}>Caricamento proposte...</p>
      ) : proposals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px dashed var(--color-border, #334155)" }}>
          <p style={{ color: "var(--color-text-muted)", fontSize: 16, margin: "0 0 12px 0" }}>Nessuna proposta normativa trovata in questo stato.</p>
          <button className="btn-primary" onClick={handleSyncNow} disabled={syncing}>
            Avvia Sincronizzazione Ora
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="training-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
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
                const isExpanded = expandedProposalId === p.id;
                const changes = Array.isArray(p.proposedChanges) ? p.proposedChanges : [];

                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border, #334155)" }}>
                    <td style={{ verticalAlign: "top", padding: "12px 8px" }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.normTitle}</div>
                      <button
                        className="ghost-btn"
                        style={{ fontSize: 11, padding: "2px 6px", marginTop: 6, color: "var(--color-primary, #38bdf8)" }}
                        onClick={() => setExpandedProposalId(isExpanded ? null : p.id)}
                      >
                        {isExpanded ? "▲ Nascondi dettaglio modifiche" : "▼ Mostra modifiche proposte"}
                      </button>
                    </td>
                    <td style={{ verticalAlign: "top", padding: "12px 8px" }}>
                      <code style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, background: "rgba(255,255,255,0.05)" }}>
                        {p.normReference}
                      </code>
                    </td>
                    <td style={{ verticalAlign: "top", padding: "12px 8px" }}>
                      <div style={{ fontSize: 13, lineHeight: 1.4 }}>{p.changeSummary}</div>
                      {p.normText && (
                        <div style={{ marginTop: 4, fontSize: 12, color: "var(--color-text-muted)" }}>
                          <em>{p.normText.slice(0, 180)}...</em>
                        </div>
                      )}

                      {/* Espansione proposta */}
                      {isExpanded && (
                        <div style={{ marginTop: 10, padding: 10, background: "rgba(0,0,0,0.25)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Requisiti ispettivi che verranno integrati:</div>
                          {changes.length === 0 ? (
                            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Requisito generico di conformità D.Lgs. 81/08</div>
                          ) : (
                            changes.map((ch: any, i: number) => (
                              <div key={i} style={{ fontSize: 12, marginTop: 4, padding: "4px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 4 }}>
                                <strong>• Domanda:</strong> {ch.question}
                                <br />
                                <span style={{ color: "var(--color-text-muted)" }}>
                                  Ambito: <code>{ch.domain}</code> | Sezione: <code>{ch.section}</code> | Sanzionabile: {ch.sanctionable ? "Sì" : "No"} (Gravità: {ch.severity})
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ verticalAlign: "top", padding: "12px 8px" }}>
                      {p.status === "pending" && (
                        <span role="status" aria-label="In attesa di revisione" className="status-pill-pending" style={{ display: "inline-block", padding: "4px 8px", borderRadius: 4, background: "rgba(245,158,11,0.15)", color: "#f59e0b", fontSize: 12 }}>
                          🟡 In attesa
                        </span>
                      )}
                      {p.status === "approved" && (
                        <span role="status" aria-label="Proposta approvata" className="status-pill-approved" style={{ display: "inline-block", padding: "4px 8px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 12 }}>
                          ✅ Approvata
                        </span>
                      )}
                      {p.status === "rejected" && (
                        <span role="status" aria-label="Proposta rifiutata" className="status-pill-rejected" style={{ display: "inline-block", padding: "4px 8px", borderRadius: 4, background: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: 12 }}>
                          ❌ Rifiutata
                        </span>
                      )}
                    </td>
                    <td style={{ verticalAlign: "top", padding: "12px 8px", fontSize: 13, color: "var(--color-text-muted)" }}>
                      {formattaData(p.createdAt)}
                    </td>
                    <td style={{ verticalAlign: "top", padding: "12px 8px" }}>
                      {p.status === "pending" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <button
                            className="btn-primary"
                            onClick={() => handleApprove(p.id)}
                            disabled={actionLoading === p.id}
                            style={{ fontSize: 12, padding: "5px 10px" }}
                          >
                            Approva
                          </button>
                          <button
                            className="ghost-btn"
                            onClick={() => handleReject(p.id)}
                            disabled={actionLoading === p.id}
                            style={{ fontSize: 12, padding: "5px 10px" }}
                          >
                            Rifiuta
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
