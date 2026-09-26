import { CalendarClock } from "lucide-react";
import { useOrologioItaliano } from "../hooks/useOrologioItaliano";

/**
 * Orologio italiano nell'intestazione.
 *
 * Sta in un componente a se perche il contatore fa ridisegnare cio che lo
 * usa: tenendolo qui si aggiorna solo questa riga e non tutta la pagina.
 * Mostrando ore e minuti basta un aggiornamento ogni mezzo minuto.
 */
export default function OrologioTestata() {
  const { adesso, data, ora, regime } = useOrologioItaliano(30_000);

  return (
    <div
      className="orologio-header"
      title={`Ora italiana (${regime.sigla}, ${regime.scarto}) — in vigore l'${regime.etichetta}`}
    >
      <CalendarClock aria-hidden="true" />
      <time dateTime={adesso.toISOString()}>
        {data} · {ora}
      </time>
      <span className="orologio-regime">{regime.etichetta}</span>
    </div>
  );
}
