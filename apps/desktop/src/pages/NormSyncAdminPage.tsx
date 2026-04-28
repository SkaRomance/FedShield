import { useState, useEffect } from "react";
import { fetchNormSyncProposals, approveNormSyncProposal, rejectNormSyncProposal, NormativeProposal } from "../api";

interface NormSyncAdminPageProps {
  token: string;
}

export default function NormSyncAdminPage({ token }: NormSyncAdminPageProps) {
  const [proposals, setProposals] = useState<NormativeProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const filter = statusFilter === "all" ? undefined : statusFilter;
      const data = await fetchNormSyncProposals(token, filter);
      setProposals(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento proposte.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

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
    <div className="normsync-admin">
      <h2>📜 NormSync — Gestione Proposte Normative</h2>
      <p>Revisiona e approva le modifiche alle checklist rilevate automaticamente dall'AI.</p>

      {error && <div className="status-message" style={{ color: "crimson" }}>{error}</div>}

      <div
        role="tablist"
        aria-label="Filtra per stato proposte"
        style={{ display: "flex", gap: 8, marginBottom: 12 }}
      >
        {(["all", "pending", "approved", "rejected"] as const).map((s) => {
          const labels: Record<typeof s, string> = {
            all: "Tutte",
            pending: "In attesa",
            approved: "Approvate",
            rejected: "Rifiutate",
          };
          return (
            <button
              key={s}
              role="tab"
              aria-selected={statusFilter === s}
              className={`ghost-btn ${statusFilter === s ? "nav-item-active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p>Caricamento...</p>
      ) : proposals.length === 0 ? (
        <p style={{ color: "gray" }}>Nessuna proposta normativa trovata.</p>
      ) : (
        <div className="table-wrap">
        <table className="training-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>Titolo Norma</th>
              <th>Riferimento</th>
              <th>Sommario</th>
              <th>Stato</th>
              <th>Data</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id}>
                <td>{p.normTitle}</td>
                <td><code>{p.normReference}</code></td>
                <td style={{ maxWidth: 300 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.4 }}>{p.changeSummary}</div>
                  {p.normText && (
                    <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>
                      <em>{p.normText.slice(0, 200)}...</em>
                    </div>
                  )}
                </td>
                <td>
                  {p.status === "pending" && (
                    <span role="status" aria-label="In attesa di revisione" className="status-pill-pending">
                      <span aria-hidden="true">🟡</span> In attesa
                    </span>
                  )}
                  {p.status === "approved" && (
                    <span role="status" aria-label="Proposta approvata" className="status-pill-approved">
                      <span aria-hidden="true">✅</span> Approvata
                    </span>
                  )}
                  {p.status === "rejected" && (
                    <span role="status" aria-label="Proposta rifiutata" className="status-pill-rejected">
                      <span aria-hidden="true">❌</span> Rifiutata
                    </span>
                  )}
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString("it-IT")}</td>
                <td>
                  {p.status === "pending" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn-primary"
                        onClick={() => handleApprove(p.id)}
                        disabled={actionLoading === p.id}
                      >
                        Approva
                      </button>
                      <button
                        className="ghost-btn"
                        onClick={() => handleReject(p.id)}
                        disabled={actionLoading === p.id}
                      >
                        Rifiuta
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
