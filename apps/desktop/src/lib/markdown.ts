// Markdown rendering pipeline per messaggi chatbot AI.
//
// Estratto da ChatbotPage in S8 per testabilità isolata (jsdom + node:test).
// La pipeline è: marked → HTML → DOMPurify (whitelist).
//
// Sicurezza:
//   - Tag whitelist conservativa (no script/iframe/style)
//   - URL solo http(s)/mailto/tel
//   - target="_blank" forza rel="noopener noreferrer" via afterSanitizeAttributes

import DOMPurify from "dompurify";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

let hookRegistered = false;

/**
 * Inizializza l'hook DOMPurify che forza rel="noopener noreferrer" sui link
 * con target="_blank". Idempotente (no-op se già registrato).
 *
 * Va chiamato una volta a module-load (sia in app reale che nei test).
 */
export function ensureDomPurifyHook(): void {
  if (hookRegistered) return;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  hookRegistered = true;
}

ensureDomPurifyHook();

/**
 * Trasforma il testo markdown del chatbot in HTML sanitizzato.
 *
 * Usa una whitelist conservativa: niente <script>, <iframe>, <style>,
 * <object>, <embed>. URL accettate solo http(s)/mailto/tel.
 */
export function renderAssistantMarkdown(content: string): string {
  const html = marked.parse(content, { async: false }) as string;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "code", "pre",
      "ul", "ol", "li", "blockquote",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "a", "table", "thead", "tbody", "tr", "th", "td",
      "hr", "span",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:)/i,
    ADD_ATTR: ["target"],
  });
}
