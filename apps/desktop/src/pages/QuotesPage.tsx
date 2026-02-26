import { useEffect, useMemo, useState } from "react";
import {
  Company,
  createQuote,
  fetchQuoteCandidates,
  fetchQuotes,
  processExpiredQuotes,
  Quote,
  QuoteCandidate,
  respondQuote,
} from "../api";
import { queueSyncEvent } from "../services/syncManager";

interface QuotesPageProps {
  token: string;
  companies: Company[];
}

export default function QuotesPage({ token, companies }: QuotesPageProps) {
  const [companyId, setCompanyId] = useState<string>(companies[0]?.id ?? "");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [candidates, setCandidates] = useState<QuoteCandidate[]>([]);
  const [selectedNcId, setSelectedNcId] = useState<string>("");
  const [serviceName, setServiceName] = useState("Servizio di adeguamento");
  const [amount, setAmount] = useState<number>(500);
  const [dueDays, setDueDays] = useState<number>(14);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const filteredQuotes = useMemo(
    () => quotes.filter((quote) => (!companyId ? true : quote.company.id === companyId)),
    [quotes, companyId],
  );

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedNcId),
    [candidates, selectedNcId],
  );

  async function loadData() {
    const [quotesData, candidateData] = await Promise.all([
      fetchQuotes(token),
      fetchQuoteCandidates(token, companyId || undefined),
    ]);
    setQuotes(quotesData);
    setCandidates(candidateData);
    if (!selectedNcId && candidateData[0]) {
      setSelectedNcId(candidateData[0].id);
    }
  }

  useEffect(() => {
    if (!companyId && companies[0]) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId]);

  useEffect(() => {
    loadData().catch((error) => {
      setStatusMessage(`Errore caricamento preventivi: ${error instanceof Error ? error.message : "errore"}`);
    });
  }, [token, companyId]);

  useEffect(() => {
    if (!selectedCandidate?.suggestedService) {
      return;
    }
    setServiceName(selectedCandidate.suggestedService);
  }, [selectedCandidate?.id, selectedCandidate?.suggestedService]);

  async function handleCreateQuote() {
    if (!selectedNcId) {
      setStatusMessage("Seleziona una NC candidata.");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    try {
      await createQuote(token, {
        nonConformityId: selectedNcId,
        serviceName,
        amount,
        dueDays,
      });
      queueSyncEvent({
        eventType: "quote.created",
        entityType: "quote",
        payload: {
          nonConformityId: selectedNcId,
          serviceName,
          amount,
          dueDays,
        },
      });
      await loadData();
      setStatusMessage("Preventivo creato correttamente.");
    } catch (error) {
      setStatusMessage(`Errore creazione preventivo: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleRespond(
    quoteId: string,
    action: "accepted" | "remodeling_requested" | "rejected" | "assigned_to_third_party",
  ) {
    setLoading(true);
    setStatusMessage("");
    try {
      await respondQuote(token, quoteId, {
        action,
        dueDays: action === "remodeling_requested" ? 7 : undefined,
      });
      queueSyncEvent({
        eventType: "quote.responded",
        entityType: "quote",
        entityId: quoteId,
        payload: { action },
      });
      await loadData();
      setStatusMessage(`Preventivo aggiornato: ${action}.`);
    } catch (error) {
      setStatusMessage(`Errore risposta preventivo: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleProcessExpired() {
    setLoading(true);
    setStatusMessage("");
    try {
      const result = await processExpiredQuotes(token);
      queueSyncEvent({
        eventType: "quote.expiration.processed",
        entityType: "quote",
        payload: { processed: result.processed },
      });
      await loadData();
      setStatusMessage(`Countdown processati: ${result.processed}.`);
    } catch (error) {
      setStatusMessage(`Errore countdown: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Preventivi & Countdown</h2>

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
          <label>NC candidata</label>
          <select value={selectedNcId} onChange={(event) => setSelectedNcId(event.target.value)}>
            <option value="">Seleziona NC...</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.inspection.company.name} - {candidate.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-two" style={{ marginTop: 12 }}>
        <div>
          <label>Servizio proposto</label>
          <input value={serviceName} onChange={(event) => setServiceName(event.target.value)} />
        </div>
        <div>
          <label>Importo</label>
          <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
        </div>
      </div>

      {selectedCandidate ? (
        <div className="status-banner status-banner-warning" style={{ marginTop: 12 }}>
          <div>
            <strong>Riferimento normativo:</strong> {selectedCandidate.normReference ?? "n/d"}
          </div>
          <div>
            <strong>Impatto sanzionatorio:</strong> {selectedCandidate.sanctionImpact ?? "n/d"}
          </div>
          <div>
            <strong>Servizio consigliato:</strong> {selectedCandidate.suggestedService ?? "n/d"}
          </div>
        </div>
      ) : null}

      <div className="inline-actions" style={{ marginTop: 12 }}>
        <input
          type="number"
          min={1}
          max={90}
          value={dueDays}
          onChange={(event) => setDueDays(Number(event.target.value))}
          placeholder="Giorni risposta"
        />
        <button className="secondary-btn" disabled={loading} onClick={handleCreateQuote}>
          Crea Preventivo
        </button>
      </div>

      <div className="footer-actions">
        <button disabled={loading} onClick={handleProcessExpired}>
          Esegui controllo countdown
        </button>
        {statusMessage ? <span className="status-message">{statusMessage}</span> : null}
      </div>

      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th>Azienda</th>
              <th>Servizio</th>
              <th>Stato</th>
              <th>Scadenza</th>
              <th>Rif. norma</th>
              <th>Malleva</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((quote) => (
              <tr key={quote.id}>
                <td>{quote.company.name}</td>
                <td>{quote.serviceName}</td>
                <td>{quote.status}</td>
                <td>{new Date(quote.responseDueAt).toLocaleDateString("it-IT")}</td>
                <td>{quote.nonConformity.normReference ?? "-"}</td>
                <td>{quote.malleva ? quote.malleva.reason : "-"}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="ghost-btn"
                      onClick={() => handleRespond(quote.id, "accepted")}
                      disabled={loading}
                    >
                      Accetta
                    </button>
                    <button
                      className="ghost-btn"
                      onClick={() => handleRespond(quote.id, "rejected")}
                      disabled={loading}
                    >
                      Rifiuta
                    </button>
                    <button
                      className="ghost-btn"
                      onClick={() => handleRespond(quote.id, "assigned_to_third_party")}
                      disabled={loading}
                    >
                      Terzi
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredQuotes.length === 0 && (
              <tr>
                <td colSpan={7}>Nessun preventivo presente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
