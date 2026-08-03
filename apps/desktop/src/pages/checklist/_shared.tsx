// Shared helpers/types/constants extracted from ChecklistPage.tsx during S13-A refactor.
// Pure extraction: nessun cambio di logica rispetto al monolite originale.

import { ChecklistItem, InspectionDocumentRequirement } from "../../api";

export type AnswerValue = "yes" | "no" | "na";

export interface LocalAnswer {
  value: AnswerValue;
  note: string;
  severity?: number;
  isSanctionable?: boolean;
}

export type RegistrationTaskKey = "general" | "safety" | "haccp";

export interface PersonCardData {
  fullName: string;
  taxCode: string;
  contact: string;
  notes: string;
}

export interface RolePersonCardData extends PersonCardData {
  role: string;
}

export const STEPS = [
  "1. Dati Azienda",
  "2. Documenti",
  "3. Locali e Attrezzature",
  "4. Procedure e Igiene",
  "5. Asset & Attrezzature",
  "6. Formazione",
  "7. Riepilogo e Invio",
] as const;

export const DOCUMENT_STATUS_OPTIONS: Array<{ value: InspectionDocumentRequirement["status"]; label: string }> = [
  { value: "viewed_on_site", label: "Visionato in sede" },
  { value: "requested_later", label: "Richiesto in differita" },
  { value: "not_available", label: "Non disponibile" },
  { value: "not_applicable", label: "Non applicabile" },
];

export const ACTIVITY_TYPE_OPTIONS = [
  { value: "hypermarket", label: "Ipermercato", atecoCode: "47.11.1" },
  { value: "supermarket", label: "Supermercato", atecoCode: "47.11.2" },
  { value: "restaurant", label: "Ristorante", atecoCode: "56.10.11" },
  { value: "pizzeria", label: "Pizzeria / Asporto", atecoCode: "56.10.20" },
  { value: "canteen", label: "Mense / Catering", atecoCode: "56.29.10" },
  { value: "event_catering", label: "Catering Eventi", atecoCode: "56.21.00" },
  { value: "food_truck", label: "Food Truck / Street Food", atecoCode: "56.10.42" },
  { value: "ambulant_pastry", label: "Gelateria/Pasticceria Ambulante", atecoCode: "56.10.41" },
  { value: "bar", label: "Bar / Caffetteria", atecoCode: "56.30" },
  { value: "hotel", label: "Hotel / Albergo", atecoCode: "55.10.00" },
  { value: "bnb_guesthouse", label: "B&B / Affittacamere", atecoCode: "55.20.51" },
  { value: "hostel_residence", label: "Ostello / Residence", atecoCode: "55.20.20" },
  { value: "camping_village", label: "Campeggio / Villaggio turistico", atecoCode: "55.30.00" },
  { value: "beach_club", label: "Stabilimento balneare con somministrazione", atecoCode: "93.29.20" },
  { value: "nightlife_venue", label: "Locale serale / Discoteca con somministrazione", atecoCode: "93.29.10" },
  { value: "pastry", label: "Pasticceria / Gelateria", atecoCode: "56.10.30" },
  { value: "gastronomy_production", label: "Gastronomia / Produzione alimentare", atecoCode: "10.85" },
  { value: "non_food_retail", label: "Commercio non alimentare", atecoCode: "47.71" },
  { value: "logistics_warehouse", label: "Logistica / Magazzino", atecoCode: "52.10" },
  { value: "cleaning_services", label: "Pulizie / Sanificazione", atecoCode: "81.21" },
  { value: "personal_services", label: "Parrucchiere / Estetica", atecoCode: "96.02" },
  { value: "education_training", label: "Scuola / Formazione", atecoCode: "85.59" },
  { value: "auto_repair", label: "Autoriparazione / Officina", atecoCode: "45.20" },
  { value: "food_industry", label: "Industria alimentare", atecoCode: "10.71" },
  { value: "building_construction", label: "Edilizia / Costruzioni", atecoCode: "41.20" },
  { value: "civil_engineering", label: "Infrastrutture / Opere civili", atecoCode: "42.11" },
  { value: "demolition_excavation", label: "Demolizioni / Scavi", atecoCode: "43.11" },
  { value: "special_foundations", label: "Fondazioni speciali / Perforazioni", atecoCode: "43.13" },
  { value: "asphalt_paving", label: "Asfalti / Pavimentazioni stradali", atecoCode: "42.11" },
  { value: "electrical_installation", label: "Impianti elettrici", atecoCode: "43.21" },
  { value: "thermal_plumbing", label: "Termoidraulica / HVAC", atecoCode: "43.22" },
  { value: "building_finishing", label: "Finiture / Ristrutturazioni", atecoCode: "43.33" },
  { value: "windows_facades", label: "Serramenti / Facciate / Vetri", atecoCode: "43.32" },
  { value: "roofing_specialized", label: "Coperture / Opere specializzate", atecoCode: "43.91" },
  { value: "metal_carpentry", label: "Carpenteria metallica / Prefabbricati", atecoCode: "25.11" },
  { value: "equipment_rental", label: "Noleggio mezzi cantiere", atecoCode: "77.32" },
  { value: "green_works", label: "Verde / Opere esterne", atecoCode: "81.30" },
  { value: "environmental_remediation", label: "Bonifiche / Amianto", atecoCode: "39.00" },
  { value: "construction_waste", label: "Rifiuti edili / Recupero", atecoCode: "38.11" },
  { value: "design_engineering", label: "Progettazione / Direzione lavori", atecoCode: "71.12" },
  { value: "plant_installation", label: "Impiantistica / Manutenzione", atecoCode: "43.21" },
  { value: "property_management", label: "Gestione immobili / Condomini", atecoCode: "68.32" },
  { value: "passenger_transport", label: "Trasporto persone", atecoCode: "49.31" },
  { value: "wood_furniture", label: "Legno / Arredo", atecoCode: "16.23" },
  { value: "chemical_cosmetics", label: "Chimica / Cosmetica", atecoCode: "20.42" },
  { value: "laundry_dry_cleaning", label: "Lavanderia / Tintoria", atecoCode: "96.01" },
  { value: "events_staging", label: "Eventi / Allestimenti", atecoCode: "90.02" },
  { value: "custom", label: "Altro (ATECO manuale)", atecoCode: "" },
] as const;

export type ActivityTypeOption = (typeof ACTIVITY_TYPE_OPTIONS)[number]["value"];
export type ChecklistActivityFilter = "company" | ActivityTypeOption;
export type InspectionChecklistMode = "unified" | "haccp_only" | "safety_only";

export const CHECKLIST_MODE_OPTIONS: Array<{ value: InspectionChecklistMode; label: string }> = [
  { value: "unified", label: "Checklist unificata (HACCP + Sicurezza)" },
  { value: "haccp_only", label: "Solo HACCP" },
  { value: "safety_only", label: "Solo Sicurezza lavoro" },
];

export const HACCP_ROLE_OPTIONS = [
  "Responsabile produzione",
  "Responsabile industria alimentare",
  "Responsabile cucina",
  "Responsabile bar",
  "Responsabile pasticceria",
  "Responsabile gelateria",
] as const;

export const SUPERMARKET_INTERNAL_SCOPE_OPTIONS = [
  { value: "retail_butcher_counter", label: "Macelleria interna" },
  { value: "retail_fish_counter", label: "Pescheria interna" },
  { value: "retail_produce_counter", label: "Ortofrutta assistita" },
  { value: "retail_deli_counter", label: "Salumeria/Gastronomia assistita" },
] as const;

export const HYPERMARKET_INTERNAL_SCOPE_OPTIONS = [
  { value: "retail_restaurant", label: "Ristorante" },
  { value: "retail_pizzeria", label: "Pizzeria" },
  { value: "retail_bar", label: "Bar" },
  { value: "retail_butcher_counter", label: "Macelleria" },
  { value: "retail_fish_counter", label: "Pescheria" },
  { value: "retail_produce_counter", label: "Ortofrutta" },
  { value: "retail_deli_counter", label: "Gastronomia" },
  { value: "retail_icecream", label: "Gelateria" },
  { value: "retail_pastry", label: "Pasticceria" },
] as const;

export function emptyPersonCard(): PersonCardData {
  return {
    fullName: "",
    taxCode: "",
    contact: "",
    notes: "",
  };
}

export function emptyRolePersonCard(role = ""): RolePersonCardData {
  return {
    role,
    ...emptyPersonCard(),
  };
}

export function hasPersonContent(person: PersonCardData | RolePersonCardData): boolean {
  return Boolean(person.fullName.trim() || person.taxCode.trim() || person.contact.trim() || person.notes.trim());
}

export function parsePersonCard(jsonValue?: string | null): PersonCardData {
  if (!jsonValue) return emptyPersonCard();
  try {
    const parsed = JSON.parse(jsonValue) as Partial<PersonCardData>;
    return {
      fullName: parsed.fullName?.toString() ?? "",
      taxCode: parsed.taxCode?.toString() ?? "",
      contact: parsed.contact?.toString() ?? "",
      notes: parsed.notes?.toString() ?? "",
    };
  } catch {
    return emptyPersonCard();
  }
}

export function parseRolePersonCards(jsonValue?: string | null): RolePersonCardData[] {
  if (!jsonValue) return [];
  try {
    const parsed = JSON.parse(jsonValue) as Array<Partial<RolePersonCardData>>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        role: item.role?.toString() ?? "",
        fullName: item.fullName?.toString() ?? "",
        taxCode: item.taxCode?.toString() ?? "",
        contact: item.contact?.toString() ?? "",
        notes: item.notes?.toString() ?? "",
      }))
      .filter((item) => item.role.trim() || hasPersonContent(item));
  } catch {
    return [];
  }
}

export function parseRetailAdditionalScopes(jsonValue?: string | null): string[] {
  if (!jsonValue) return [];
  try {
    const parsed = JSON.parse(jsonValue) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
  } catch {
    return jsonValue
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
}

export function parseCompanyActivities(jsonValue?: string | null): ActivityTypeOption[] {
  if (!jsonValue) return [];
  const validValues = new Set<ActivityTypeOption>(ACTIVITY_TYPE_OPTIONS.map((option) => option.value));
  try {
    const parsed = JSON.parse(jsonValue) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => (typeof item === "string" ? item : ""))
      .filter((item): item is ActivityTypeOption => validValues.has(item as ActivityTypeOption));
  } catch {
    return [];
  }
}

export function inferActivitiesFromAteco(atecoCode?: string | null): ActivityTypeOption[] {
  const inferred = inferActivityFromAteco(atecoCode);
  return inferred === "custom" ? [] : [inferred];
}

export function retailScopesStorageKey(companyId: string): string {
  return `fedshield.retailScopes.${companyId}`;
}

export function companyActivitiesStorageKey(companyId: string): string {
  return `fedshield.companyActivities.${companyId}`;
}

export function checklistModeLabel(mode?: InspectionChecklistMode) {
  return CHECKLIST_MODE_OPTIONS.find((option) => option.value === mode)?.label ?? "Checklist unificata";
}

export function inferActivityFromAteco(atecoCode?: string | null): ActivityTypeOption {
  const normalized = atecoCode?.trim() ?? "";
  if (normalized.startsWith("47.11.1")) return "hypermarket";
  if (normalized.startsWith("47.11.2")) return "supermarket";
  if (normalized.startsWith("55.10")) return "hotel";
  if (normalized.startsWith("55.20.51")) return "bnb_guesthouse";
  if (normalized.startsWith("55.20.20")) return "hostel_residence";
  if (normalized.startsWith("55.30")) return "camping_village";
  if (normalized.startsWith("93.29.20")) return "beach_club";
  if (normalized.startsWith("93.29.10")) return "nightlife_venue";
  if (normalized.startsWith("56.10.30")) return "pastry";
  if (normalized.startsWith("56.10.20")) return "pizzeria";
  if (normalized.startsWith("56.29.10")) return "canteen";
  if (normalized.startsWith("56.21.00")) return "event_catering";
  if (normalized.startsWith("56.10.42")) return "food_truck";
  if (normalized.startsWith("56.10.41")) return "ambulant_pastry";
  if (normalized.startsWith("10.85")) return "gastronomy_production";
  if (normalized.startsWith("47.") && !normalized.startsWith("47.11")) return "non_food_retail";
  if (normalized.startsWith("49.4") || normalized.startsWith("52") || normalized.startsWith("53")) return "logistics_warehouse";
  if (normalized.startsWith("81.2")) return "cleaning_services";
  if (normalized.startsWith("96.02") || normalized.startsWith("96.04")) return "personal_services";
  if (normalized.startsWith("85")) return "education_training";
  if (normalized.startsWith("45.2")) return "auto_repair";
  if (normalized.startsWith("10")) return "food_industry";
  if (normalized.startsWith("41")) return "building_construction";
  if (normalized.startsWith("42.11") || normalized.startsWith("42.99")) return "asphalt_paving";
  if (normalized.startsWith("42")) return "civil_engineering";
  if (normalized.startsWith("43.11") || normalized.startsWith("43.12")) return "demolition_excavation";
  if (normalized.startsWith("43.13")) return "special_foundations";
  if (normalized.startsWith("43.21")) return "electrical_installation";
  if (normalized.startsWith("43.22")) return "thermal_plumbing";
  if (normalized.startsWith("43.32")) return "windows_facades";
  if (normalized.startsWith("43.3")) return "building_finishing";
  if (normalized.startsWith("43.91") || normalized.startsWith("43.99")) return "roofing_specialized";
  if (normalized.startsWith("25.11")) return "metal_carpentry";
  if (normalized.startsWith("77.32")) return "equipment_rental";
  if (normalized.startsWith("81.30")) return "green_works";
  if (normalized.startsWith("39") || normalized.startsWith("38.22")) return "environmental_remediation";
  if (normalized.startsWith("38")) return "construction_waste";
  if (normalized.startsWith("71.1")) return "design_engineering";
  if (normalized.startsWith("43.2")) return "plant_installation";
  if (normalized.startsWith("68.32") || normalized.startsWith("81.10")) return "property_management";
  if (normalized.startsWith("49.3")) return "passenger_transport";
  if (normalized.startsWith("16") || normalized.startsWith("31")) return "wood_furniture";
  if (normalized.startsWith("20")) return "chemical_cosmetics";
  if (normalized.startsWith("96.01")) return "laundry_dry_cleaning";
  if (
    normalized.startsWith("90.02") ||
    normalized.startsWith("82.30") ||
    (normalized.startsWith("93.29") && !normalized.startsWith("93.29.10") && !normalized.startsWith("93.29.20"))
  ) {
    return "events_staging";
  }
  if (normalized.startsWith("56.30")) return "bar";
  if (normalized.startsWith("56.10")) return "restaurant";
  return "custom";
}

export function atecoFromActivity(activity: ActivityTypeOption): string {
  return ACTIVITY_TYPE_OPTIONS.find((option) => option.value === activity)?.atecoCode ?? "";
}

export function defaultAnswer(item: ChecklistItem): LocalAnswer {
  return {
    value: "na",
    note: "",
    severity: item.defaultSeverity,
    isSanctionable: item.defaultSanctionable,
  };
}
