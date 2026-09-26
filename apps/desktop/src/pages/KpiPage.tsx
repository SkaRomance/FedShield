import { useEffect, useState } from "react";
import { Company, createKpiSnapshot, fetchCompanyKpi, fetchKpiOverview, KpiOverview } from "../api";
import { siNo } from "../lib/etichette";
import { formattaOra } from "../lib/oraItalia";

interface KpiPageProps {
  token: string;
  companies: Company[];
}

export default function KpiPage({ token, companies }: KpiPageProps) {
  const [overview, setOverview] = useState<KpiOverview | null>(null);
  const [companyId, setCompanyId] = useState<string>(companies[0]?.id ?? "");
  const [companyKpi, setCompanyKpi] = useState<Awaited<ReturnType<typeof fetchCompanyKpi>> | null>(null);
  const [message, setMessage] = useState("");

  async function loadAll() {
    const [overviewData, companyData] = await Promise.all([
      fetchKpiOverview(token),
      companyId ? fetchCompanyKpi(token, companyId) : Promise.resolve(null),
    ]);
    setOverview(overviewData);
    setCompanyKpi(companyData as Awaited<ReturnType<typeof fetchCompanyKpi>> | null);
  }

  useEffect(() => {
    if (!companyId && companies[0]) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId]);

  useEffect(() => {
    loadAll().catch((error) => {
      setMessage(`Errore indicatori: ${error instanceof Error ? error.message : "errore"}`);
    });
  }, [token, companyId]);

  async function handleSnapshot() {
    try {
      const result = await createKpiSnapshot(token);
      setMessage(
        `Rilevazione salvata: ${result.companySnapshots} aziende, ${result.consultantSnapshots} consulenti.`,
      );
      await loadAll();
    } catch (error) {
      setMessage(
        `Errore salvataggio rilevazione: ${error instanceof Error ? error.message : "errore"}`,
      );
    }
  }

  return (
    <section className="panel">
      <h2>Indicatori e prestazioni</h2>
      <div className="kpi-grid">
        <article className="kpi-card">
          <h3>Punteggio medio conformità</h3>
          <strong>{overview?.averageComplianceScore ?? 0}</strong>
        </article>
        <article className="kpi-card">
          <h3>Aziende monitorate</h3>
          <strong>{overview?.companiesCount ?? 0}</strong>
        </article>
        <article className="kpi-card">
          <h3>Consulenti monitorati</h3>
          <strong>{overview?.consultantsCount ?? 0}</strong>
        </article>
        <article className="kpi-card">
          <h3>Ultimo aggiornamento</h3>
          <strong>{formattaOra(overview?.generatedAt)}</strong>
        </article>
      </div>

      <div className="grid-two" style={{ marginTop: 12 }}>
        <div>
          <label>Azienda</label>
          <select
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            aria-label="Azienda"
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ alignSelf: "end" }}>
          <button className="btn-primary" onClick={handleSnapshot}>
            Salva rilevazione
          </button>
        </div>
      </div>

      {companyKpi ? (
        <>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <article className="kpi-card">
              <h3>Punteggio azienda</h3>
              <strong>{companyKpi.complianceScore}</strong>
            </article>
            <article className="kpi-card">
              <h3>Stelle FED</h3>
              <strong>{"★".repeat(companyKpi.stars)}{"☆".repeat(5 - companyKpi.stars)}</strong>
            </article>
            <article className="kpi-card">
              <h3>NC sanzionabili</h3>
              <strong>{companyKpi.totals.sanctionableNc}</strong>
            </article>
            <article className="kpi-card">
              <h3>Collaborazione</h3>
              <strong>{companyKpi.collaborationScore}</strong>
            </article>
          </div>

          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Punteggio</th>
                </tr>
              </thead>
              <tbody>
                {companyKpi.radar.map((item) => (
                  <tr key={item.area}>
                    <td>{item.area}</td>
                    <td>{item.score}</td>
                  </tr>
                ))}
                {companyKpi.radar.length === 0 && (
                  <tr>
                    <td colSpan={2} className="tabella-vuota">
                      Nessun punteggio per area: completa un sopralluogo per questa azienda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>Mese</th>
                  <th>Sopralluoghi</th>
                  <th>NC</th>
                  <th>NC sanzionabili</th>
                </tr>
              </thead>
              <tbody>
                {companyKpi.trend.map((item) => (
                  <tr key={item.month}>
                    <td>{item.month}</td>
                    <td>{item.inspections}</td>
                    <td>{item.nc}</td>
                    <td>{item.sanctionableNc}</td>
                  </tr>
                ))}
                {companyKpi.trend.length === 0 && (
                  <tr>
                    <td colSpan={4} className="tabella-vuota">
                      Nessun andamento disponibile per questa azienda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th>Consulente</th>
              <th>Sopralluoghi</th>
              <th>NC</th>
              <th>Conversione %</th>
              <th>Sotto soglia</th>
            </tr>
          </thead>
          <tbody>
            {(overview?.consultants ?? []).map((item) => (
              <tr key={item.consultantId}>
                <td>{item.fullName}</td>
                <td>{item.inspectionsCount}</td>
                <td>{item.ncTotal}</td>
                <td>{item.conversionRate}</td>
                <td>{siNo(item.lowNcAlert)}</td>
              </tr>
            ))}
            {(overview?.consultants ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="tabella-vuota">
                  Nessun consulente monitorato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message ? <p className="status-message">{message}</p> : null}
    </section>
  );
}
