import { Company, Inspection } from "../api";

interface CustomersPageProps {
  companies: Company[];
  inspections: Inspection[];
  onUseForInspection: (companyId: string, inspectionId?: string) => void;
}

function inspectionsForCompany(inspections: Inspection[], company: Company): Inspection[] {
  return inspections
    .filter((inspection) => inspection.companyId === company.id || inspection.company.name === company.name)
    .sort((a, b) => new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime());
}

export default function CustomersPage({ companies, inspections, onUseForInspection }: CustomersPageProps) {
  return (
    <section className="panel">
      <h2>Anagrafiche clienti</h2>

      {companies.map((company) => {
        const companyInspections = inspectionsForCompany(inspections, company);
        const lastInspection = companyInspections[0];

        return (
          <article key={company.id} className="panel section-panel">
            <div className="grid-two">
              <div>
                <label>Ragione sociale</label>
                <input value={company.name} readOnly />
              </div>
              <div>
                <label>P.IVA</label>
                <input value={company.vatNumber} readOnly />
              </div>
              <div>
                <label>ATECO</label>
                <input value={company.atecoCode ?? "-"} readOnly />
              </div>
              <div>
                <label>Citta</label>
                <input value={company.city ?? "-"} readOnly />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label>Elenco sopralluoghi</label>
              {companyInspections.length > 0 ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Titolo</th>
                        <th>Data</th>
                        <th>Stato</th>
                        <th>NC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyInspections.map((inspection) => (
                        <tr key={inspection.id}>
                          <td>{inspection.title}</td>
                          <td>{new Date(inspection.happenedAt).toLocaleDateString("it-IT")}</td>
                          <td>{inspection.status}</td>
                          <td>{inspection.nonConformities.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="status-message">Nessun sopralluogo presente per questa anagrafica.</p>
              )}
            </div>

            <div className="footer-actions">
              <button onClick={() => onUseForInspection(company.id, lastInspection?.id)}>Usa per sopralluogo</button>
            </div>
          </article>
        );
      })}

      {companies.length === 0 && <p className="status-message">Nessuna anagrafica cliente disponibile.</p>}
    </section>
  );
}
