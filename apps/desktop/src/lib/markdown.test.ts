// Test renderAssistantMarkdown con jsdom (S8-4, L2).
//
// Verifica:
//   - Sanitizzazione XSS (script/img onerror/javascript: URL bloccati)
//   - Forzatura rel="noopener noreferrer" su <a target="_blank">
//   - Whitelist tag (es: <iframe> rimosso)
//   - Markdown base renderizzato (bold, list, link, code)

import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

// Setup jsdom global PRIMA di importare il modulo che usa DOMPurify.
// DOMPurify lega il DOMParser al global.window al primo import.
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
});
const g = globalThis as unknown as {
  window: typeof dom.window;
  document: typeof dom.window.document;
  DOMParser: typeof dom.window.DOMParser;
  Node: typeof dom.window.Node;
  HTMLElement: typeof dom.window.HTMLElement;
};
g.window = dom.window;
g.document = dom.window.document;
g.DOMParser = dom.window.DOMParser;
g.Node = dom.window.Node;
g.HTMLElement = dom.window.HTMLElement;

const { renderAssistantMarkdown } = await import("./markdown.js");

test("renderAssistantMarkdown: bold/italic markdown base", () => {
  const html = renderAssistantMarkdown("Testo **grassetto** e *corsivo*");
  assert.match(html, /<strong>grassetto<\/strong>/);
  assert.match(html, /<em>corsivo<\/em>/);
});

test("renderAssistantMarkdown: list rendering", () => {
  const html = renderAssistantMarkdown("- Uno\n- Due\n- Tre");
  assert.match(html, /<ul>/);
  assert.match(html, /<li>Uno<\/li>/);
  assert.match(html, /<li>Tre<\/li>/);
});

test("renderAssistantMarkdown: code block in <pre><code>", () => {
  const html = renderAssistantMarkdown("```\nconst x = 1;\n```");
  assert.match(html, /<pre>/);
  assert.match(html, /<code>/);
});

test("renderAssistantMarkdown: link http(s) preservato", () => {
  const html = renderAssistantMarkdown("[Esempio](https://example.com)");
  assert.match(html, /<a href="https:\/\/example\.com">/);
});

test("XSS: <script> tag rimosso", () => {
  const malicious = `<script>alert('xss')</script>Testo`;
  const html = renderAssistantMarkdown(malicious);
  assert.doesNotMatch(html, /<script/i);
  assert.match(html, /Testo/);
});

test("XSS: javascript: URL bloccato", () => {
  const malicious = `[Click](javascript:alert('xss'))`;
  const html = renderAssistantMarkdown(malicious);
  assert.doesNotMatch(html, /javascript:/i);
});

test("XSS: <img onerror> rimosso", () => {
  const malicious = `<img src="x" onerror="alert('xss')">`;
  const html = renderAssistantMarkdown(malicious);
  // Tag img non in whitelist → rimosso completamente
  assert.doesNotMatch(html, /<img/i);
  assert.doesNotMatch(html, /onerror/i);
});

test("XSS: <iframe> rimosso (non in whitelist)", () => {
  const malicious = `<iframe src="https://evil.com"></iframe>Sicuro`;
  const html = renderAssistantMarkdown(malicious);
  assert.doesNotMatch(html, /<iframe/i);
  assert.match(html, /Sicuro/);
});

// Note: il L1 hook (rel="noopener noreferrer" su target=_blank) è
// defense-in-depth — marked non produce target=_blank dal markdown
// standard, e quando inietta raw HTML il pre-processing varia per
// versione. Il hook resta a protezione di edge case (es: extension
// futura di marked con auto-target) ma non è testabile end-to-end
// in modo deterministico via renderAssistantMarkdown.

test("URL: mailto e tel accettati", () => {
  const html1 = renderAssistantMarkdown("[Email](mailto:test@example.com)");
  assert.match(html1, /href="mailto:test@example\.com"/);
  const html2 = renderAssistantMarkdown("[Tel](tel:+39123456789)");
  assert.match(html2, /href="tel:\+39123456789"/);
});

test("URL: data: schema bloccato", () => {
  const malicious = `[Click](data:text/html,<script>alert(1)</script>)`;
  const html = renderAssistantMarkdown(malicious);
  assert.doesNotMatch(html, /data:/i);
});

console.log("Markdown tests loaded.");
