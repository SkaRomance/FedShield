import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { ChecklistSection, ComplianceDomain, InspectionChecklistMode } from "@prisma/client";
import { writeAudit } from "../../plugins/audit.js";

function buildAtecoVariants(atecoCode?: string | null) {
  if (!atecoCode) {
    return [];
  }

  const normalized = atecoCode.trim();
  const digits = normalized.replace(/\D/g, "");
  const parts = normalized.split(".");
  const variants = new Set<string>([normalized]);

  if (parts.length >= 2) {
    variants.add(`${parts[0]}.${parts[1]}`);
  }
  if (parts.length >= 1) {
    variants.add(parts[0]);
  }

  // Normalizzazione per codici ATECO privi di separatori (es. "551000", "561011", "5510", "551")
  if (digits.length >= 2) {
    const d2 = digits.slice(0, 2);
    variants.add(d2);
    if (digits.length === 3) {
      variants.add(`${d2}.${digits.slice(2, 3)}`);
    }
    if (digits.length >= 4) {
      const d4 = `${d2}.${digits.slice(2, 4)}`;
      variants.add(d4);
      if (digits.length >= 5) {
        variants.add(`${d4}.${digits.slice(4, 6)}`);
      }
    }
  }

  // Macrosettori HoReCa / Ricettività / Alloggio per Divisione ATECO 55
  if (parts[0] === "55" || digits.startsWith("55")) {
    variants.add("HO.RE.CA");
    variants.add("HORECA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("ALLOGGIO");
  }

  const upper = normalized.toUpperCase();

  // Hotel / Alberghi (55.10.00, 55.10, 55.1, 551000, 5510, 551)
  const isHotelText =
    upper === "HOTEL" ||
    upper === "ALBERGO" ||
    upper === "ALBERGHI" ||
    upper === "RESORT";

  if (
    normalized.startsWith("55.10") ||
    normalized.startsWith("55.1") ||
    digits.startsWith("5510") ||
    digits === "551" ||
    isHotelText
  ) {
    variants.add("55.10.00");
    variants.add("55.10");
    variants.add("55.1");
    variants.add("551000");
    variants.add("5510");
    variants.add("HOTEL");
    variants.add("ALBERGO");
    variants.add("ALBERGHI");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
  }

  // B&B e Affittacamere (55.20.51, 55.20.5, 55.20, 55.2, 552051, 55205, 5520, 552)
  const isBnbCode =
    normalized.startsWith("55.20.5") ||
    digits.startsWith("55205") ||
    normalized === "55.20" ||
    normalized === "55.2" ||
    digits === "5520" ||
    digits === "552";

  const isBnbText =
    upper === "BEB_AFFITTACAMERE" ||
    upper === "AFFITTACAMERE" ||
    upper === "B&B" ||
    upper === "B & B" ||
    upper === "BNB" ||
    upper === "GUESTHOUSE" ||
    upper === "BED AND BREAKFAST" ||
    upper === "BED & BREAKFAST" ||
    upper === "BED_AND_BREAKFAST" ||
    upper === "EXTRA ALBERGHIERO" ||
    upper === "EXTRA_ALBERGHIERO" ||
    upper === "EXTRAALBERGHIERO";

  if (isBnbCode || isBnbText) {
    variants.add("55.20.51");
    variants.add("55.20.5");
    variants.add("55.20");
    variants.add("55.2");
    variants.add("552051");
    variants.add("55205");
    variants.add("5520");
    variants.add("BEB_AFFITTACAMERE");
    variants.add("AFFITTACAMERE");
    variants.add("B&B");
    variants.add("BNB");
    variants.add("GUESTHOUSE");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("ALLOGGIO");
  }

  // Ostelli e Residence (55.20.20, 55.20.2, 552020, 55202)
  const isOstelloCode =
    normalized.startsWith("55.20.2") ||
    digits.startsWith("55202");

  const isOstelloText =
    upper === "OSTELLI_RESIDENCE" ||
    upper === "OSTELLO_RESIDENCE" ||
    upper === "OSTELLI" ||
    upper === "OSTELLO" ||
    upper === "RESIDENCE" ||
    upper === "HOSTEL" ||
    upper === "CASE_PER_FERIE" ||
    upper === "CASE PER FERIE" ||
    upper === "STUDENTATO" ||
    upper === "ALLOGGI_STUDENTI" ||
    upper === "ALLOGGI STUDENTI";

  if (isOstelloCode || isOstelloText) {
    variants.add("55.20.20");
    variants.add("55.20.2");
    variants.add("55.20");
    variants.add("552020");
    variants.add("55202");
    variants.add("OSTELLI_RESIDENCE");
    variants.add("OSTELLO_RESIDENCE");
    variants.add("RESIDENCE");
    variants.add("OSTELLI");
    variants.add("OSTELLO");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("ALLOGGIO");
  }

  // Campeggi e Villaggi turistici (55.30.00, 55.30.0, 55.30, 55.3, 553000, 55300, 5530, 553)
  const isCampingText =
    upper === "CAMPEGGIO_VILLAGGIO" ||
    upper === "CAMPEGGI_VILLAGGI" ||
    upper === "CAMPEGGIO" ||
    upper === "CAMPEGGI" ||
    upper === "CAMPING" ||
    upper === "CAMPING_VILLAGE" ||
    upper === "CAMPING VILLAGE" ||
    upper === "VILLAGGIO_TURISTICO" ||
    upper === "VILLAGGI_TURISTICI" ||
    upper === "VILLAGGIO TURISTICO" ||
    upper === "VILLAGGI TURISTICI";

  if (normalized.startsWith("55.3") || digits.startsWith("553") || isCampingText) {
    variants.add("55.30.00");
    variants.add("55.30.0");
    variants.add("55.30");
    variants.add("55.3");
    variants.add("553000");
    variants.add("55300");
    variants.add("5530");
    variants.add("553");
    variants.add("CAMPEGGIO_VILLAGGIO");
    variants.add("CAMPEGGI_VILLAGGI");
    variants.add("CAMPEGGIO");
    variants.add("CAMPEGGI");
    variants.add("CAMPING");
    variants.add("CAMPING_VILLAGE");
    variants.add("VILLAGGIO_TURISTICO");
    variants.add("VILLAGGI_TURISTICI");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("ALLOGGIO");
  }

  // Divisione ATECO 56 (Ristorazione e somministrazione alimenti / HoReCa)
  if (parts[0] === "56" || digits.startsWith("56")) {
    variants.add("HO.RE.CA");
    variants.add("HORECA");
  }

  if (normalized.startsWith("56.10.41") || digits.startsWith("561041")) {
    variants.add("PASTICCERIA_AMBULANTE");
  }
  if (normalized.startsWith("56.10.42") || digits.startsWith("561042")) {
    variants.add("FOOD_TRUCK");
  }

  // Pasticcerie e Gelaterie artigianali con laboratorio (56.10.30, 56.10.3, 561030, 56103)
  const isPastryGelateriaText =
    upper === "PASTICCERIA" ||
    upper === "PASTICCERIE" ||
    upper === "GELATERIA" ||
    upper === "GELATERIE" ||
    upper === "PASTICCERIA_GELATERIA" ||
    upper === "GELATERIA_PASTICCERIA" ||
    upper === "PASTICCERIA GELATERIA" ||
    upper === "GELATERIA PASTICCERIA" ||
    upper === "LABORATORIO_PASTICCERIA" ||
    upper === "LABORATORIO PASTICCERIA";

  const isPastryGelateriaCode =
    normalized.startsWith("56.10.3") ||
    digits.startsWith("56103");

  if (isPastryGelateriaCode || isPastryGelateriaText) {
    variants.add("56.10.30");
    variants.add("56.10.3");
    variants.add("561030");
    variants.add("56103");
    variants.add("PASTICCERIA_GELATERIA");
    variants.add("PASTICCERIA");
    variants.add("GELATERIA");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
  }

  if (normalized.startsWith("56.10.20") || digits.startsWith("561020")) {
    variants.add("PIZZERIA_ASPORTO");
  }
  if (normalized.startsWith("56.10.11") || digits.startsWith("561011") || normalized === "56.10.1") {
    variants.add("RISTORANTI");
  }
  if (normalized.startsWith("56.29.10") || digits.startsWith("562910")) {
    variants.add("MENSE_CATERING");
  }
  if (normalized.startsWith("56.21.00") || digits.startsWith("562100")) {
    variants.add("CATERING_EVENTI");
  }
  if (normalized.startsWith("56.30") || digits.startsWith("5630")) {
    variants.add("BAR");
  }

  // Discoteche, sale da ballo, night-club, locali serali e club (93.29.10, 93.29.1, 932910, 93291)
  const isDiscoText =
    upper === "DISCOTECA_LOCALE_SERALE" ||
    upper === "DISCOTECHE_LOCALI_SERALI" ||
    upper === "DISCOTECA LOCALE SERALE" ||
    upper === "DISCOTECHE LOCALI SERALI" ||
    upper === "DISCOTECA" ||
    upper === "DISCOTECHE" ||
    upper === "LOCALE_SERALE" ||
    upper === "LOCALI_SERALI" ||
    upper === "LOCALE SERALE" ||
    upper === "LOCALI SERALI" ||
    upper === "LOCALE_NOTTURNO" ||
    upper === "LOCALI_NOTTURNI" ||
    upper === "LOCALE NOTTURNO" ||
    upper === "LOCALI NOTTURNI" ||
    upper === "NIGHTLIFE" ||
    upper === "NIGHT_LIFE" ||
    upper === "NIGHT LIFE" ||
    upper === "NIGHTCLUB" ||
    upper === "NIGHT_CLUB" ||
    upper === "NIGHT CLUB" ||
    upper === "NIGHT-CLUB" ||
    upper === "CLUB" ||
    upper === "PUB_SERALE" ||
    upper === "PUB SERALE" ||
    upper === "PUB_DISCO" ||
    upper === "PUB DISCO" ||
    upper === "SALA_DA_BALLO" ||
    upper === "SALE_DA_BALLO" ||
    upper === "SALA DA BALLO" ||
    upper === "SALE DA BALLO" ||
    upper === "DISCO";

  const isDiscoCode =
    normalized.startsWith("93.29.1") ||
    digits.startsWith("93291");

  if (isDiscoCode || isDiscoText) {
    variants.add("93.29.10");
    variants.add("93.29.1");
    variants.add("932910");
    variants.add("93291");
    variants.add("DISCOTECA_LOCALE_SERALE");
    variants.add("DISCOTECA");
    variants.add("DISCOTECHE");
    variants.add("LOCALE_SERALE");
    variants.add("LOCALI_SERALI");
    variants.add("LOCALE_NOTTURNO");
    variants.add("LOCALI_NOTTURNI");
    variants.add("NIGHTLIFE");
    variants.add("NIGHTCLUB");
    variants.add("CLUB");
    variants.add("PUB_SERALE");
    variants.add("PUB_DISCO");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
  }

  // Stabilimenti balneari / Lidi / Beach club (93.29.20, 93.29.2, 93.29, 93.2, 932920, 93292, 9329, 932)
  const isBeachClubText =
    upper === "STABILIMENTO_BALNEARE" ||
    upper === "STABILIMENTI_BALNEARI" ||
    upper === "STABILIMENTO BALNEARE" ||
    upper === "STABILIMENTI BALNEARI" ||
    upper === "LIDO" ||
    upper === "LIDI" ||
    upper === "BEACH_CLUB" ||
    upper === "BEACH CLUB" ||
    upper === "BEACHCLUB" ||
    upper === "BALNEARE" ||
    upper === "BALNEARI" ||
    upper === "STRUTTURE_BALNEARI" ||
    upper === "STRUTTURA_BALNEARE" ||
    upper === "STRUTTURE BALNEARI" ||
    upper === "STRUTTURA BALNEARE";

  const isBeachClubCode =
    normalized.startsWith("93.29.2") ||
    digits.startsWith("93292") ||
    ((normalized === "93.29" || digits === "9329" || normalized === "93.2" || digits === "932") &&
      !isDiscoCode);

  if (isBeachClubCode || isBeachClubText) {
    variants.add("93.29.20");
    variants.add("93.29.2");
    variants.add("93.29");
    variants.add("93.2");
    variants.add("932920");
    variants.add("93292");
    variants.add("9329");
    variants.add("932");
    variants.add("STABILIMENTO_BALNEARE");
    variants.add("STABILIMENTI_BALNEARI");
    variants.add("LIDO");
    variants.add("BEACH_CLUB");
    variants.add("BALNEARE");
    variants.add("STRUTTURE_BALNEARI");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
  }

  // Ricerca testuale diretta per nome macrosettore
  if (upper === "HOTEL" || upper === "ALBERGO" || upper === "ALBERGHI") {
    variants.add("55.10.00");
    variants.add("55.10");
    variants.add("55.1");
    variants.add("551000");
    variants.add("HOTEL");
    variants.add("ALBERGO");
    variants.add("HO.RE.CA");
    variants.add("HORECA");
    variants.add("RICETTIVITA");
    variants.add("STRUTTURE_RICETTIVE");
  }
  if (
    upper === "HORECA" ||
    upper === "HO.RE.CA" ||
    upper === "RICETTIVITA" ||
    upper === "RICETTIVITÀ" ||
    upper === "STRUTTURE_RICETTIVE" ||
    upper === "STRUTTURE RICETTIVE" ||
    upper === "ALLOGGIO"
  ) {
    variants.add("HO.RE.CA");
    variants.add("HORECA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("ALLOGGIO");
    variants.add("HOTEL");
    variants.add("55.10.00");
    variants.add("55.10");
    variants.add("BEB_AFFITTACAMERE");
    variants.add("AFFITTACAMERE");
    variants.add("B&B");
    variants.add("BNB");
    variants.add("GUESTHOUSE");
    variants.add("55.20.51");
    variants.add("55.20");
    variants.add("OSTELLI_RESIDENCE");
    variants.add("OSTELLO_RESIDENCE");
    variants.add("OSTELLI");
    variants.add("OSTELLO");
    variants.add("RESIDENCE");
    variants.add("55.20.20");
    variants.add("55.20.2");
    variants.add("552020");
    variants.add("55202");
    variants.add("55.30.00");
    variants.add("55.30");
    variants.add("553000");
    variants.add("CAMPEGGIO_VILLAGGIO");
    variants.add("CAMPEGGI_VILLAGGI");
    variants.add("CAMPEGGIO");
    variants.add("CAMPING");
    variants.add("VILLAGGIO_TURISTICO");
    variants.add("VILLAGGI_TURISTICI");
    variants.add("STABILIMENTI_BALNEARI");
    variants.add("STABILIMENTO_BALNEARE");
    variants.add("BEACH_CLUB");
    variants.add("LIDO");
    variants.add("BALNEARE");
    variants.add("STRUTTURE_BALNEARI");
    variants.add("93.29.20");
    variants.add("932920");
    variants.add("LOCALI_SERALI");
    variants.add("LOCALE_SERALE");
    variants.add("DISCOTECA");
    variants.add("DISCOTECHE");
    variants.add("DISCOTECA_LOCALE_SERALE");
    variants.add("93.29.10");
    variants.add("932910");
  }

  // Commercio al Dettaglio Non Alimentare / Abbigliamento, Calzature, Casalinghi, Elettronica ed Esercizi Commerciali Specializzati
  // ATECO 47.71, 47.72, 47.5, 47.6, 47.7 e prefissi
  const isFoodRetail =
    normalized.startsWith("47.11") ||
    digits.startsWith("4711") ||
    normalized.startsWith("47.2") ||
    digits.startsWith("472") ||
    normalized.startsWith("47.81") ||
    digits.startsWith("4781");

  const isCommerceNonFoodText =
    upper === "COMMERCIO_NON_FOOD" ||
    upper === "COMMERCIO NON FOOD" ||
    upper === "COMMERCIO_NON_ALIMENTARE" ||
    upper === "COMMERCIO NON ALIMENTARE" ||
    upper === "RETAIL_NON_FOOD" ||
    upper === "RETAIL NON FOOD" ||
    upper === "NEGOZIO_ABBIGLIAMENTO" ||
    upper === "NEGOZIO ABBIGLIAMENTO" ||
    upper === "COMMERCIO_DETTAGLIO_NON_FOOD" ||
    upper === "COMMERCIO DETTAGLIO NON FOOD";

  const isCommerceNonFoodCode =
    !isFoodRetail &&
    (normalized.startsWith("47.71") ||
      normalized.startsWith("47.72") ||
      normalized.startsWith("47.7") ||
      normalized.startsWith("47.5") ||
      normalized.startsWith("47.6") ||
      digits.startsWith("4771") ||
      digits.startsWith("4772") ||
      digits.startsWith("477") ||
      digits.startsWith("475") ||
      digits.startsWith("476") ||
      normalized === "47" ||
      digits === "47" ||
      parts[0] === "47");

  if (isCommerceNonFoodCode || isCommerceNonFoodText) {
    variants.add("47.71");
    variants.add("47.71.1");
    variants.add("47.71.10");
    variants.add("47.71.2");
    variants.add("47.71.3");
    variants.add("47.72");
    variants.add("47.5");
    variants.add("47.6");
    variants.add("47.7");
    variants.add("4771");
    variants.add("477110");
    variants.add("477120");
    variants.add("47711");
    variants.add("47712");
    variants.add("47713");
    variants.add("477");
    variants.add("475");
    variants.add("476");
    variants.add("COMMERCIO_NON_FOOD");
    variants.add("COMMERCIO_NON_ALIMENTARE");
    variants.add("RETAIL_NON_FOOD");
    variants.add("NEGOZIO_ABBIGLIAMENTO");
  }
  // Logistica, Magazzino Merci, Depositi Industriali, Centri di Smistamento e Spedizioni
  // ATECO 52.10, 52.29, 49.41, 52.1, 52.2, 49.4 e relativi prefissi/alias
  const isLogisticsText =
    upper === "LOGISTICA_MAGAZZINO" ||
    upper === "LOGISTICA MAGAZZINO" ||
    upper === "LOGISTICA" ||
    upper === "MAGAZZINO" ||
    upper === "MAGAZZINAGGIO" ||
    upper === "SPEDIZIONI_LOGISTICA" ||
    upper === "SPEDIZIONI LOGISTICA" ||
    upper === "LOGISTICA_TRASPORTI" ||
    upper === "LOGISTICA TRASPORTI" ||
    upper === "CORRIERE_LOGISTICA" ||
    upper === "CORRIERE LOGISTICA" ||
    upper === "DEPOSITO_MERCI" ||
    upper === "DEPOSITO MERCI";

  const isLogisticsCode =
    normalized.startsWith("52.10") ||
    normalized.startsWith("52.1") ||
    normalized.startsWith("52.29") ||
    normalized.startsWith("52.2") ||
    normalized.startsWith("52.") ||
    normalized.startsWith("53.") ||
    normalized.startsWith("49.41") ||
    normalized.startsWith("49.42") ||
    normalized.startsWith("49.4") ||
    digits.startsWith("5210") ||
    digits.startsWith("521") ||
    digits.startsWith("5229") ||
    digits.startsWith("522") ||
    digits.startsWith("4941") ||
    digits.startsWith("4942") ||
    digits.startsWith("494") ||
    digits.startsWith("52") ||
    digits.startsWith("53") ||
    normalized === "52" ||
    normalized === "53" ||
    digits === "52" ||
    digits === "53" ||
    parts[0] === "52" ||
    parts[0] === "53";

  if (isLogisticsCode || isLogisticsText) {
    variants.add("52.10");
    variants.add("52.10.1");
    variants.add("52.10.2");
    variants.add("52.29");
    variants.add("52.2");
    variants.add("52.1");
    variants.add("49.41");
    variants.add("49.4");
    variants.add("5210");
    variants.add("521010");
    variants.add("521020");
    variants.add("5229");
    variants.add("4941");
    variants.add("LOGISTICA_MAGAZZINO");
    variants.add("LOGISTICA");
    variants.add("MAGAZZINO");
    variants.add("MAGAZZINAGGIO");
    variants.add("SPEDIZIONI_LOGISTICA");
    variants.add("LOGISTICA_TRASPORTI");
    variants.add("DEPOSITO_MERCI");
  }
  if (normalized.startsWith("81.2")) {
    variants.add("PULIZIE_SANIFICAZIONE");
  }
  if (normalized.startsWith("96.02") || normalized.startsWith("96.04")) {
    variants.add("SERVIZI_PERSONA");
  }
  if (parts[0] === "85") {
    variants.add("ISTRUZIONE_FORMAZIONE");
  }
  if (parts[0] === "45" || normalized.startsWith("45.2")) {
    variants.add("AUTORIPARAZIONE");
  }
  // Gastronomia / Produzione e Confezionamento di Piatti Pronti, Pasti Cotti e Basi Alimentari Refrigerate/Surgelate
  // ATECO 10.85 (10.85, 10.85.0, 10.85.00, 10.85.01, 10.8, 108500, 10850, 1085, 108)
  const isGastronomyCode =
    normalized.startsWith("10.85") ||
    digits.startsWith("1085") ||
    normalized === "10.8" ||
    digits === "108";

  const isGastronomyText =
    upper === "GASTRONOMIA_PRODUZIONE" ||
    upper === "GASTRONOMIA PRODUZIONE" ||
    upper === "GASTRONOMIA" ||
    upper === "PRODUZIONE_ALIMENTARE" ||
    upper === "PRODUZIONE ALIMENTARE" ||
    upper === "PASTI_PRONTI" ||
    upper === "PASTI PRONTI" ||
    upper === "PIATTI_PRONTI" ||
    upper === "PIATTI PRONTI" ||
    upper === "INDUSTRIA_ALIMENTARE" ||
    upper === "INDUSTRIA ALIMENTARE";

  if (isGastronomyCode || isGastronomyText) {
    variants.add("10.85");
    variants.add("10.85.0");
    variants.add("10.85.00");
    variants.add("10.85.01");
    variants.add("10.8");
    variants.add("108500");
    variants.add("10850");
    variants.add("1085");
    variants.add("108");
    variants.add("GASTRONOMIA_PRODUZIONE");
    variants.add("GASTRONOMIA");
    variants.add("PRODUZIONE_ALIMENTARE");
    variants.add("PASTI_PRONTI");
    variants.add("PIATTI_PRONTI");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
  }

  if (parts[0] === "10" && !isGastronomyCode) {
    variants.add("INDUSTRIA_ALIMENTARE");
  }

  // EDILIZIA (Costruzioni, cantieri, ingegneria civile, impiantistica)
  if (parts[0] === "41" || parts[0] === "42" || parts[0] === "43") {
    variants.add("EDILIZIA");
    variants.add("construction");
  }

  // METALMECCANICA (Fabbricazione prodotti in metallo, macchinari, saldatura)
  if (parts[0] === "25" || parts[0] === "28") {
    variants.add("metalmechanics");
    variants.add("METALMECCANICO");
    variants.add("METALMECCANICA");
    variants.add("metalworking");
  }

  // SANITA (Assistenza sanitaria, studi medici, odontoiatria, RSA)
  if (parts[0] === "86" || parts[0] === "87") {
    variants.add("healthcare");
    variants.add("SANITA");
  }

  // UFFICI / SERVIZI IT (Informatica, software, consulenza, studi professionali)
  if (
    parts[0] === "62" ||
    parts[0] === "69" ||
    parts[0] === "70" ||
    parts[0] === "74" ||
    parts[0] === "58" ||
    parts[0] === "63"
  ) {
    variants.add("office-it");
    variants.add("office");
    variants.add("UFFICI");
  }

  // AGRICOLTURA (Coltivazioni agricole, produzione prodotti animali, vivai, cantine)
  if (parts[0] === "01") {
    variants.add("agriculture");
    variants.add("AGRICOLTURA");
  }

  // SPORT & FITNESS (Palestre, piscine, circoli sportivi, impianti fitness)
  if (normalized.startsWith("93.1")) {
    variants.add("SPORT_FITNESS");
    variants.add("sport_fitness");
  }

  // TRASPORTO PERSONE (NCC, taxi, noleggio bus con conducente)
  if (normalized.startsWith("49.3")) {
    variants.add("TRASPORTO_PERSONE");
    variants.add("passenger_transport");
  }

  // FALEGNAMERIA / LAVORAZIONE LEGNO (Industria del legno, fabbricazione mobili)
  if (parts[0] === "16" || parts[0] === "31") {
    variants.add("FALEGNAMERIA_LEGNO");
    variants.add("woodworking");
  }

  return [...variants];
}

function buildDomainFilterByChecklistMode(checklistMode?: InspectionChecklistMode) {
  if (!checklistMode || checklistMode === InspectionChecklistMode.unified) {
    return undefined;
  }

  if (checklistMode === InspectionChecklistMode.haccp_only) {
    return {
      in: [ComplianceDomain.haccp, ComplianceDomain.both],
    };
  }

  return {
    in: [ComplianceDomain.safety, ComplianceDomain.both],
  };
}

function parseRetailScopes(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function buildRetailScopeVariants(scopes: string[]): string[] {
  const mapping: Record<string, string[]> = {
    retail_restaurant: ["RISTORANTI"],
    retail_pizzeria: ["PIZZERIA_ASPORTO"],
    retail_bar: ["BAR"],
    retail_butcher_counter: ["RETAIL_LARGE_BUTCHER"],
    retail_fish_counter: ["RETAIL_LARGE_FISH"],
    retail_produce_counter: ["RETAIL_LARGE_PRODUCE"],
    retail_deli_counter: ["RETAIL_LARGE_DELI"],
    retail_icecream: ["PASTICCERIA_GELATERIA"],
    retail_pastry: ["PASTICCERIA_GELATERIA"],
  };

  const variants = new Set<string>();
  for (const scope of scopes) {
    const key = scope.toLowerCase();
    const mapped = mapping[key];
    if (mapped) {
      mapped.forEach((value) => variants.add(value));
      continue;
    }
    variants.add(scope);
  }
  return [...variants];
}

const checklistRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/checklists/templates",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const query = z
        .object({
          atecoCode: z.string().optional(),
          checklistMode: z.nativeEnum(InspectionChecklistMode).optional(),
          retailScopes: z.string().optional(),
        })
        .safeParse(request.query);

      if (!query.success) {
        return reply.badRequest("Query non valida.");
      }

      const atecoVariants = buildAtecoVariants(query.data.atecoCode);
      const auth = request.user;
      const retailScopeVariants =
        auth.role === "admin" ? [] : buildRetailScopeVariants(parseRetailScopes(query.data.retailScopes));
      const macroGroupVariants = [...new Set([...atecoVariants, ...retailScopeVariants])];
      const domainFilter = buildDomainFilterByChecklistMode(query.data.checklistMode);
      const where =
        atecoVariants.length > 0
          ? {
              isActive: true,
              OR: [
                { isGeneral: true },
                { atecoCode: { in: atecoVariants } },
                ...(macroGroupVariants.length > 0 ? [{ macroGroup: { in: macroGroupVariants } }] : []),
              ],
              ...(domainFilter ? { items: { some: { domain: domainFilter } } } : {}),
            }
          : {
              isActive: true,
              ...(domainFilter ? { items: { some: { domain: domainFilter } } } : {}),
            };

      return fastify.prisma.checklistTemplate.findMany({
        where,
        orderBy: [{ isGeneral: "desc" }, { name: "asc" }],
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      });
    },
  );

  fastify.get(
    "/checklists/templates/:id/items",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const query = z
        .object({
          checklistMode: z.nativeEnum(InspectionChecklistMode).optional(),
        })
        .safeParse(request.query);
      if (!params.success) {
        return reply.badRequest("Template ID non valido.");
      }
      if (!query.success) {
        return reply.badRequest("Query non valida.");
      }

      const template = await fastify.prisma.checklistTemplate.findUnique({
        where: { id: params.data.id },
      });

      if (!template || !template.isActive) {
        return reply.notFound("Checklist template non trovata.");
      }

      const domainFilter = buildDomainFilterByChecklistMode(query.data.checklistMode);
      const items = await fastify.prisma.checklistItem.findMany({
        where: {
          templateId: template.id,
          ...(domainFilter ? { domain: domainFilter } : {}),
        },
        orderBy: { orderIndex: "asc" },
      });

      return {
        template,
        items,
      };
    },
  );

  fastify.get(
    "/checklists/document-templates",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const query = z
        .object({
          atecoCode: z.string().optional(),
          checklistMode: z.nativeEnum(InspectionChecklistMode).optional(),
          retailScopes: z.string().optional(),
        })
        .safeParse(request.query);

      if (!query.success) {
        return reply.badRequest("Query non valida.");
      }

      const atecoVariants = buildAtecoVariants(query.data.atecoCode);
      const auth = request.user;
      const retailScopeVariants =
        auth.role === "admin" ? [] : buildRetailScopeVariants(parseRetailScopes(query.data.retailScopes));
      const macroGroupVariants = [...new Set([...atecoVariants, ...retailScopeVariants])];
      const domainFilter = buildDomainFilterByChecklistMode(query.data.checklistMode);
      const where =
        atecoVariants.length > 0
          ? {
              isActive: true,
              OR: [
                { isGeneral: true },
                { atecoCode: { in: atecoVariants } },
                ...(macroGroupVariants.length > 0 ? [{ macroGroup: { in: macroGroupVariants } }] : []),
              ],
              ...(domainFilter ? { domain: domainFilter } : {}),
            }
          : {
              isActive: true,
              ...(domainFilter ? { domain: domainFilter } : {}),
            };

      return fastify.prisma.documentTemplate.findMany({
        where,
        orderBy: [{ isRequired: "desc" }, { name: "asc" }],
      });
    },
  );

  // ---- S20: Aggiunta Volontaria Requisiti Specifici (Custom Checklist Items) ----
  // Consente al consulente di aggiungere controlli personalizzati / specifici
  // durante un sopralluogo per una determinata attività.
  fastify.post(
    "/checklists/custom-items",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const schema = z.object({
        templateId: z.string().min(1),
        section: z.nativeEnum(ChecklistSection).default(ChecklistSection.premises_equipment),
        domain: z.nativeEnum(ComplianceDomain).default(ComplianceDomain.both),
        area: z.string().min(1),
        question: z.string().min(3),
        normReference: z.string().optional(),
        defaultSeverity: z.number().int().min(1).max(4).default(1),
        defaultSanctionable: z.boolean().default(false),
      });

      const parsed = schema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati requisito specifico non validi.");
      }

      const template = await fastify.prisma.checklistTemplate.findUnique({
        where: { id: parsed.data.templateId },
      });
      if (!template) {
        return reply.notFound("Checklist template non trovata.");
      }

      const maxItem = await fastify.prisma.checklistItem.findFirst({
        where: { templateId: template.id },
        orderBy: { orderIndex: "desc" },
      });
      const nextOrderIndex = (maxItem?.orderIndex ?? 0) + 1;

      const created = await fastify.prisma.checklistItem.create({
        data: {
          templateId: template.id,
          section: parsed.data.section,
          domain: parsed.data.domain,
          area: parsed.data.area,
          question: parsed.data.question,
          normReference: parsed.data.normReference ?? null,
          defaultSeverity: parsed.data.defaultSeverity,
          defaultSanctionable: parsed.data.defaultSanctionable,
          orderIndex: nextOrderIndex,
          isRequired: false,
        },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "checklistItem.create_custom",
        entityType: "checklistItem",
        entityId: created.id,
        data: {
          templateId: template.id,
          area: created.area,
          question: created.question,
        },
      });

      return reply.code(201).send(created);
    },
  );

  // Bulk creation per inserimento massivo (es. requisiti specifici generati da macchine registrate)
  fastify.post(
    "/checklists/custom-items/bulk",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const schema = z.object({
        templateId: z.string().min(1),
        items: z
          .array(
            z.object({
              section: z.nativeEnum(ChecklistSection).default(ChecklistSection.premises_equipment),
              domain: z.nativeEnum(ComplianceDomain).default(ComplianceDomain.both),
              area: z.string().min(1),
              question: z.string().min(3),
              normReference: z.string().optional(),
              defaultSeverity: z.number().int().min(1).max(4).default(1),
              defaultSanctionable: z.boolean().default(false),
            }),
          )
          .min(1),
      });

      const parsed = schema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload requisiti massivi non valido.");
      }

      const template = await fastify.prisma.checklistTemplate.findUnique({
        where: { id: parsed.data.templateId },
      });
      if (!template) {
        return reply.notFound("Checklist template non trovata.");
      }

      const maxItem = await fastify.prisma.checklistItem.findFirst({
        where: { templateId: template.id },
        orderBy: { orderIndex: "desc" },
      });
      let currentOrderIndex = maxItem?.orderIndex ?? 0;

      const createdItems = [];
      for (const item of parsed.data.items) {
        currentOrderIndex += 1;
        const created = await fastify.prisma.checklistItem.create({
          data: {
            templateId: template.id,
            section: item.section,
            domain: item.domain,
            area: item.area,
            question: item.question,
            normReference: item.normReference ?? null,
            defaultSeverity: item.defaultSeverity,
            defaultSanctionable: item.defaultSanctionable,
            orderIndex: currentOrderIndex,
            isRequired: false,
          },
        });
        createdItems.push(created);
      }

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "checklistItem.create_bulk_custom",
        entityType: "checklistItem",
        entityId: template.id,
        data: { count: createdItems.length },
      });

      return reply.code(201).send(createdItems);
    },
  );

  fastify.delete(
    "/checklists/custom-items/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("Item ID non valido.");
      }

      const existing = await fastify.prisma.checklistItem.findUnique({
        where: { id: params.data.id },
      });
      if (!existing) {
        return reply.notFound("Requisito non trovato.");
      }

      await fastify.prisma.checklistItem.delete({
        where: { id: params.data.id },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "checklistItem.delete_custom",
        entityType: "checklistItem",
        entityId: params.data.id,
      });

      return reply.send({ success: true, id: params.data.id });
    },
  );
};

export default checklistRoutes;
