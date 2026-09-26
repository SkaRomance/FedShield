import { useEffect, useMemo, useState } from "react";
import { LetturaOrologio, leggiOrologio } from "../lib/oraItalia";

/**
 * Orologio italiano sempre allineato.
 *
 * Data, ora e regime vengono ricalcolati a ogni battito: nella notte del
 * cambio l'indicazione passa da sola da "ora legale" a "ora solare" e
 * viceversa, senza ricaricare la pagina e senza regolazioni manuali.
 *
 * L'ora viene riallineata anche quando si torna sulla scheda, perche i
 * browser rallentano i contatori delle pagine lasciate in secondo piano.
 */
export function useOrologioItaliano(intervalloMs = 1000): LetturaOrologio {
  const [adesso, setAdesso] = useState<Date>(() => new Date());

  useEffect(() => {
    const battito = window.setInterval(() => setAdesso(new Date()), intervalloMs);
    const riallinea = () => setAdesso(new Date());
    document.addEventListener("visibilitychange", riallinea);
    window.addEventListener("focus", riallinea);
    return () => {
      window.clearInterval(battito);
      document.removeEventListener("visibilitychange", riallinea);
      window.removeEventListener("focus", riallinea);
    };
  }, [intervalloMs]);

  return useMemo(() => leggiOrologio(adesso), [adesso]);
}
