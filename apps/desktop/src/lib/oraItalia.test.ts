import assert from "node:assert/strict";
import {
  daOraItaliana,
  formattaData,
  formattaDataOra,
  formattaOra,
  perCampoData,
  perCampoOra,
  regimeOrario,
  scartoMinutiItalia,
} from "./oraItalia.js";

let superati = 0;

function prova(nome: string, corpo: () => void) {
  corpo();
  superati += 1;
  console.log(`  ok  ${nome}`);
}

console.log("oraItalia — data e ora italiane");

prova("a gennaio vale l'ora solare (CET, UTC+1)", () => {
  const inverno = new Date("2026-01-15T12:00:00Z");
  assert.equal(scartoMinutiItalia(inverno), 60);
  const regime = regimeOrario(inverno);
  assert.equal(regime.legale, false);
  assert.equal(regime.etichetta, "ora solare");
  assert.equal(regime.sigla, "CET");
  assert.equal(regime.scarto, "UTC+1");
});

prova("a luglio vale l'ora legale (CEST, UTC+2)", () => {
  const estate = new Date("2026-07-15T12:00:00Z");
  assert.equal(scartoMinutiItalia(estate), 120);
  const regime = regimeOrario(estate);
  assert.equal(regime.legale, true);
  assert.equal(regime.etichetta, "ora legale");
  assert.equal(regime.sigla, "CEST");
  assert.equal(regime.scarto, "UTC+2");
});

prova("il cambio di marzo 2026 cade domenica 29 alle 01:00 UTC", () => {
  const primaDelCambio = new Date("2026-03-29T00:59:00Z");
  const dopoIlCambio = new Date("2026-03-29T01:00:00Z");
  assert.equal(regimeOrario(primaDelCambio).legale, false);
  assert.equal(regimeOrario(dopoIlCambio).legale, true);
  // L'orologio italiano salta dalle 01:59 alle 03:00.
  assert.equal(formattaOra(primaDelCambio), "01:59");
  assert.equal(formattaOra(dopoIlCambio), "03:00");
});

prova("il cambio di ottobre 2026 cade domenica 25 alle 01:00 UTC", () => {
  const primaDelCambio = new Date("2026-10-25T00:59:00Z");
  const dopoIlCambio = new Date("2026-10-25T01:00:00Z");
  assert.equal(regimeOrario(primaDelCambio).legale, true);
  assert.equal(regimeOrario(dopoIlCambio).legale, false);
  assert.equal(formattaOra(primaDelCambio), "02:59");
  assert.equal(formattaOra(dopoIlCambio), "02:00");
});

prova("il prossimo cambio viene indicato correttamente", () => {
  const inverno = regimeOrario(new Date("2026-01-15T12:00:00Z"));
  assert.equal(inverno.prossimoCambio.toISOString(), "2026-03-29T01:00:00.000Z");
  assert.equal(inverno.prossimaEtichetta, "ora legale");

  const estate = regimeOrario(new Date("2026-07-15T12:00:00Z"));
  assert.equal(estate.prossimoCambio.toISOString(), "2026-10-25T01:00:00.000Z");
  assert.equal(estate.prossimaEtichetta, "ora solare");

  const tardoAutunno = regimeOrario(new Date("2026-12-01T12:00:00Z"));
  assert.equal(tardoAutunno.prossimoCambio.toISOString(), "2027-03-28T01:00:00.000Z");
});

prova("la data mostrata e quella italiana anche a cavallo della mezzanotte", () => {
  // In Italia sono gia le 00:30 del 27 giugno, in tempo universale e ancora il 26.
  const istante = new Date("2026-06-26T22:30:00Z");
  assert.equal(formattaData(istante), "27/06/2026");
  assert.equal(formattaOra(istante), "00:30");
  assert.equal(formattaDataOra(istante), "27/06/2026, 00:30");
});

prova("i campi del modulo leggono l'orologio italiano", () => {
  const istante = new Date("2026-06-26T22:30:00Z");
  assert.equal(perCampoData(istante), "2026-06-27");
  assert.equal(perCampoOra(istante), "00:30");
});

prova("cio che il consulente scrive torna all'istante giusto", () => {
  const estate = daOraItaliana("2026-07-15", "14:35");
  assert.ok(estate);
  assert.equal(estate.toISOString(), "2026-07-15T12:35:00.000Z"); // ora legale: -2h

  const inverno = daOraItaliana("2026-01-15", "14:35");
  assert.ok(inverno);
  assert.equal(inverno.toISOString(), "2026-01-15T13:35:00.000Z"); // ora solare: -1h
});

prova("scrivere l'ora subito dopo il cambio resta coerente", () => {
  const dopoCambioMarzo = daOraItaliana("2026-03-29", "03:30");
  assert.ok(dopoCambioMarzo);
  assert.equal(dopoCambioMarzo.toISOString(), "2026-03-29T01:30:00.000Z");
  assert.equal(formattaOra(dopoCambioMarzo), "03:30");

  const primaCambioMarzo = daOraItaliana("2026-03-29", "01:30");
  assert.ok(primaCambioMarzo);
  assert.equal(primaCambioMarzo.toISOString(), "2026-03-29T00:30:00.000Z");
  assert.equal(formattaOra(primaCambioMarzo), "01:30");
});

prova("i valori non validi non fanno saltare l'applicazione", () => {
  assert.equal(formattaData(null), "n/d");
  assert.equal(formattaData(""), "n/d");
  assert.equal(formattaData("non-una-data"), "n/d");
  assert.equal(formattaOra(undefined), "--:--");
  assert.equal(daOraItaliana("", ""), null);
  assert.equal(daOraItaliana("2026-13-01", "10:00"), null);
  assert.equal(daOraItaliana("2026-01-01", "99:00"), null);
});

console.log(`\n${superati} verifiche superate.`);
