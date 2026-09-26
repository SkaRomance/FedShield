import { CalendarClock } from "lucide-react";
import { useOrologioItaliano } from "../../hooks/useOrologioItaliano";
import { formattaDataEstesa } from "../../lib/oraItalia";

interface DataOraSopralluogoProps {
  /** true quando il consulente registra un sopralluogo svolto in un altro momento. */
  momentoManuale: boolean;
  setMomentoManuale: (valore: boolean) => void;
  dataManuale: string;
  setDataManuale: (valore: string) => void;
  oraManuale: string;
  setOraManuale: (valore: string) => void;
  /** Disattiva i campi quando il sopralluogo e gia stato creato o validato. */
  bloccato?: boolean;
}

/**
 * Data e ora del sopralluogo.
 *
 * Il consulente non deve scrivere nulla: l'orologio italiano viene letto da
 * solo e resta allineato al secondo. Il passaggio fra ora legale e ora solare
 * e riconosciuto in automatico, quindi la sera del cambio il riquadro si
 * aggiorna senza toccare niente.
 *
 * Resta comunque possibile registrare un sopralluogo svolto in un altro
 * momento: il campo compare solo quando serve davvero.
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
  const orologio = useOrologioItaliano();
  const regime = orologio.regime;

  return (
    <>
      <h4 style={{ marginTop: "var(--sp-5)", marginBottom: "var(--sp-3)" }}>
        <CalendarClock
          aria-hidden="true"
          size={15}
          style={{ verticalAlign: "-2px", marginRight: 7, color: "var(--color-accent)" }}
        />
        Data e ora del sopralluogo
      </h4>

      <div className="rilevazione-ora">
        <div className="rilevazione-ora-blocco">
          <span className="rilevazione-ora-etichetta">Giorno</span>
          <span className="rilevazione-ora-valore">{orologio.dataEstesa}</span>
        </div>

        <div className="rilevazione-ora-blocco">
          <span className="rilevazione-ora-etichetta">Ora esatta</span>
          <span className="rilevazione-ora-valore rilevazione-ora-valore--grande">
            <time dateTime={orologio.adesso.toISOString()}>{orologio.oraConSecondi}</time>
          </span>
        </div>

        <div className="rilevazione-ora-blocco">
          <span className="rilevazione-ora-etichetta">In vigore</span>
          <span
            className={`badge-regime ${regime.legale ? "badge-regime--legale" : "badge-regime--solare"}`}
            title={`Fuso ${regime.sigla} (${regime.scarto})`}
          >
            {regime.etichetta}
          </span>
        </div>

        <p className="rilevazione-ora-nota">
          Data e ora vengono rilevate da sole con l&apos;orologio italiano ({regime.sigla},{" "}
          {regime.scarto}) e restano corrette anche se il computer è impostato su un altro fuso.
          Il passaggio all&apos;{regime.prossimaEtichetta} è previsto per{" "}
          {formattaDataEstesa(regime.prossimoCambio)} e verrà applicato da solo.
        </p>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: "var(--sp-4)",
          marginBottom: 0,
          cursor: bloccato ? "not-allowed" : "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={momentoManuale}
          disabled={bloccato}
          onChange={(event) => setMomentoManuale(event.target.checked)}
        />
        Il sopralluogo si è svolto in un altro momento
      </label>

      {momentoManuale ? (
        <div className="grid-two" style={{ marginTop: "var(--sp-3)" }}>
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
    </>
  );
}
