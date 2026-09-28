import geoData from "./geoData.json";

export interface ItalianProvince {
  sigla: string;
  nome: string;
  regione: string;
}

export interface ItalianComune {
  nome: string;
  sigla: string;
  cap: string;
}

export const ITALIAN_PROVINCES: ItalianProvince[] = geoData.provinces;

// Comuni array: [nome, sigla, cap]
const COMUNI_RAW: [string, string, string][] = geoData.comuni as [string, string, string][];

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Cerca comuni per testo digitato, opzionalmente filtrati per sigla provincia.
 * Ordina i risultati dando priorità ai comuni che iniziano con la stringa cercata.
 */
export function searchComuni(
  query: string,
  provinceSigla?: string,
  limit = 25,
): ItalianComune[] {
  const normQuery = normalize(query);
  const provUpper = provinceSigla?.toUpperCase().trim();

  const exactPrefixMatches: ItalianComune[] = [];
  const substringMatches: ItalianComune[] = [];

  for (let i = 0; i < COMUNI_RAW.length; i++) {
    const [nome, sigla, cap] = COMUNI_RAW[i];

    if (provUpper && sigla !== provUpper) {
      continue;
    }

    if (!normQuery) {
      exactPrefixMatches.push({ nome, sigla, cap });
      if (exactPrefixMatches.length >= limit) break;
      continue;
    }

    const normNome = normalize(nome);
    if (normNome.startsWith(normQuery)) {
      exactPrefixMatches.push({ nome, sigla, cap });
      if (exactPrefixMatches.length >= limit) break;
    } else if (normNome.includes(normQuery)) {
      if (substringMatches.length + exactPrefixMatches.length < limit * 2) {
        substringMatches.push({ nome, sigla, cap });
      }
    }
  }

  const combined = [...exactPrefixMatches, ...substringMatches];
  return combined.slice(0, limit);
}

/**
 * Cerca un comune per nome esatto (case and accent insensitive).
 */
export function findComuneByName(name: string): ItalianComune | undefined {
  const normName = normalize(name);
  if (!normName) return undefined;
  const match = COMUNI_RAW.find(([n]) => normalize(n) === normName);
  if (!match) return undefined;
  return { nome: match[0], sigla: match[1], cap: match[2] };
}
