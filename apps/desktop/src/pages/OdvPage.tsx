import { useEffect, useState } from "react";
import {
  Company,
  createOdvInspection,
  fetchOdvDefensiveReport,
  fetchOdvInspections,
  OdvInspection,
} from "../api";
import { queueSyncEvent } from "../services/syncManager";

interface OdvPageProps {
  token: string;
  companies: Company[];
}

export default function OdvPage({ token, companies }: OdvPageProps) {
  const [companyId, setCompanyId] = useState<string>(companies[0]?.id ?? "");
  const [authorityName, setAuthorityName] = useState("ASL");
  const [violationTitle, setViolationTitle] = useState("Violazione riscontrata");
  const [violationNorm, setViolationNorm] = useState("D.Lgs. 81/08");
  const [amount, setAmount] = useState<number>(1200);
  const [inspections, setInspections] = useState<OdvInspection[]>([]);
  const [defensiveReport, setDefensiveReport] = useState<{
    inspections: number;
    sanctions: number;
    matched: number;
    partial: number;
    unmatched: number;
    coverageRate: number;
  } | null>(null);
  const [message, setMessage] = useState("");

  async function loadData() {
    const [odvData, reportData] = await Promise.all([
      fetchOdvInspections(token, companyId || undefined),
      companyId
        ? fetchOdvDefensiveReport(token, companyId)
        : Promise.resolve({ inspections: 0, sanctions: 0, matched: 0, partial: 0, unmatched: 0, coverageRate: 0 }),
    ]);

    setInspections(odvData);
    setDefensiveReport(reportData);
  }

  useEffect(() => {
    if (!companyId && companies[0]) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId]);

  useEffect(() => {
    loadData().catch((error) => {
      setMessage(`Errore ODV: ${error instanceof Error ? error.message : "errore"}`);
    });
  }, [token, companyId]);

  async function handleCreateInspection() {
    if (!companyId) {
      setMessage("Seleziona un'azienda.");
      return;
    }

    try {
      await createOdvInspection(token, {
        companyId,
        authorityName,
        inspectedAt: new Date().toISOString(),
        sanctions: [
          {
            violationTitle,
            violationNorm,
            amount,
          },
        ],
      });
      queueSyncEvent({
        eventType: "odv.inspection.created",
        entityType: "odvInspection",
        payload: {
          companyId,
          authorityName,
          violationTitle,
          violationNorm,
          amount,
        },
      });

      setMessage("Ispezione ODV registrata.");
      await loadData();
    } catch (error) {
      setMessage(`Errore creazione ODV: ${error instanceof Error ? error.message : "errore"}`);
    }
  }

  return (
    <section className="panel">
      <h2>Modulo ODV & Difesa</h2>

      <div className="grid-two">
        <div>
          <label>Azienda</label>
          <select value={companyId} onChange={(event) => setCompanyId(event.target.value)}>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Organo di vigilanza</label>
          <input value={authorityName} onChange={(event) => setAuthorityName(event.target.value)} />
        </div>
      </div>

      <div className="grid-two" style={{ marginTop: 10 }}>
        <div>
          <label>Violazione</label>
          <input value={violationTitle} onChange={(event) => setViolationTitle(event.target.value)} />
        </div>
        <div>
          <label>Norma</label>
          <input value={violationNorm} onChange={(event) => setViolationNorm(event.target.value)} />
        </div>
      </div>

      <div className="inline-actions" style={{ marginTop: 10 }}>
        <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
        <button className="secondary-btn" onClick={handleCreateInspection}>
          Registra ispezione ODV
        </button>
      </div>

      {defensiveReport ? (
        <div className="kpi-grid" style={{ marginTop: 12 }}>
          <article className="kpi-card">
            <h3>Ispezioni ODV</h3>
            <strong>{defensiveReport.inspections}</strong>
          </article>
          <article className="kpi-card">
            <h3>Sanzioni</h3>
            <strong>{defensiveReport.sanctions}</strong>
          </article>
          <article className="kpi-card">
            <h3>Match con NC segnalate</h3>
            <strong>{defensiveReport.matched}</strong>
          </article>
          <article className="kpi-card">
            <h3>Coverage %</h3>
            <strong>{defensiveReport.coverageRate}</strong>
          </article>
        </div>
      ) : null}

      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Autorita</th>
              <th>Sanzioni</th>
              <th>Esito confronto</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <tr key={inspection.id}>
                <td>{new Date(inspection.inspectedAt).toLocaleDateString("it-IT")}</td>
                <td>{inspection.authorityName}</td>
                <td>{inspection.sanctions.length}</td>
                <td>
                  {inspection.sanctions
                    .map((sanction) => `${sanction.violationTitle} [${sanction.matchStatus}]`)
                    .join("; ")}
                </td>
              </tr>
            ))}
            {inspections.length === 0 && (
              <tr>
                <td colSpan={4}>Nessuna ispezione ODV registrata.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message ? <p className="status-message">{message}</p> : null}
    </section>
  );
}
