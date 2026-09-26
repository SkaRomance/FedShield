import { CalendarClock } from "lucide-react";
import { useOrologioItaliano } from "../../hooks/useOrologioItaliano";

interface DataOraSopralluogoProps {
  /** true quando il consulente registra un sopralluogo svolto in un altro momento. */
  momentoManuale: boolean;
  setMomentoManuale: (valore: boolean) => void;
  dataManuale: string;
  setDataManuale: (valore: string) => void;
  oraManuale: string;
  setOraManuale: (valore: string) => void;
  /** Disattiva i campi quando il sopralluogo non e piu modificabile. */
  bloccato?: boolean;
}

/**
 * Data e ora del sopralluogo, in una riga sola.
 *
 * Il consulente non deve scrivere nulla: il momento viene rilevato con
 * l'orologio italiano e registrato insieme al sopralluogo, quindi qui basta
 * una conferma discreta invece di un riquadro che occupa la schermata.
 *
 * I campi compaiono solo se dichiara di registrare un sopralluogo svolto in
 * un altro momento: senza questa possibilita il verbale porterebbe la data
 * di compilazione invece di quella del sopralluogo vero.
 */
export default function DataOraSopralluogo({
  momentoManuale,
  setMomentoManuale,
  dataManuale,
  setDataManuale,
  oraManuale,
  setOraManuale,
  bloccato = false,
}: DataOraSopralluogoProps) {
  // Un aggiornamento al minuto basta: qui si mostrano solo ore e minuti.
  const orologio = useOrologioItaliano(30_000);

  return (
    <div className="riga-data-ora">
      <span className="riga-data-ora-testo">
        <CalendarClock aria-hidden="true" size={14} />
        {momentoManuale ? (
          "Data e ora indicate a mano"
        ) : (
          <>
            Data e ora del sopralluogo:{" "}
            <strong>
              <time dateTime={orologio.adesso.toISOString()}>
                {orologio.data} · {orologio.ora}
              </time>
            </strong>
            , rilevate in automatico
          </>
        )}
      </span>

      <button
        type="button"
        className="ghost-btn"
        disabled={bloccato}
        onClick={() => setMomentoManuale(!momentoManuale)}
      >
        {momentoManuale ? "Torna alla rilevazione automatica" : "Si è svolto in un altro momento"}
      </button>

      {momentoManuale ? (
        <div className="grid-two riga-data-ora-campi">
          <div>
            <label htmlFor="sopralluogo-data">Data effettiva</label>
            <input
              id="sopralluogo-data"
              type="date"
              value={dataManuale}
              disabled={bloccato}
              onChange={(event) => setDataManuale(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sopralluogo-ora">Ora effettiva</label>
            <input
              id="sopralluogo-ora"
              type="time"
              value={oraManuale}
              disabled={bloccato}
              onChange={(event) => setOraManuale(event.target.value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
