import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@fedshield.local";
const ADMIN_PASSWORD = "fedshield123";

test.describe("Create company golden path", () => {
  test("admin: crea azienda da Anagrafica e la usa in Checklist", async ({
    page,
  }) => {
    // Login (inline helper, no shared file finché 4+ specs duplicano).
    await page.goto("/");
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entra/i }).click();

    // Wait dashboard mounted.
    await expect(page.getByRole("button", { name: "Dashboard" })).toBeVisible({
      timeout: 15_000,
    });

    // Naviga ad Anagrafica Clienti: la registrazione cliente vive qui.
    await page.getByRole("button", { name: "Anagrafica Clienti" }).click();
    await expect(
      page.getByRole("heading", { name: /Anagrafica e Storico Clienti/i }),
    ).toBeVisible();

    // Dati unici per run (ripetibilità senza reset DB).
    const stamp = Date.now();
    const companyName = `E2E Spec1 Trattoria ${stamp}`;
    const vatNumber = `IT0017${stamp}`;
    const atecoCode = "56.10.11";
    const city = "Roma";

    // Compila i campi richiesti dal backend (name + vatNumber min) e quelli
    // chiamati esplicitamente dal task: ATECO, Città.
    await page.getByLabel("Ragione sociale").fill(companyName);
    await page
      .getByLabel(
        "Codice fiscale, Partita IVA e n. Iscr. Al Registro delle Imprese",
      )
      .fill(vatNumber);
    // ATECO ha già default "56.10.11" da resetCompanyRegistrationForm; lo
    // riconfermo esplicitamente per chiarezza spec.
    await page.getByLabel("Codice ATECO").fill(atecoCode);
    await page.getByLabel("Citta").fill(city);

    // Salva anagrafica. Triggera POST /api/companies + onReload.
    await page.getByRole("button", { name: /^Registra cliente$/ }).click();

    // Aspetta status message di conferma.
    await expect(page.locator(".status-message").first()).toContainText(
      /Cliente registrato in anagrafica/i,
      { timeout: 10_000 },
    );

    // L'elenco completo include la nuova azienda con il name unico.
    await expect(page.getByRole("cell", { name: companyName })).toBeVisible({
      timeout: 5_000,
    });

    await page.getByRole("button", { name: /^Avvia sopralluogo$/ }).first().click();
    await expect(
      page.getByRole("heading", { name: /Checklist Ho\.Re\.Ca guidata/i }),
    ).toBeVisible();
    await expect(page.getByText(companyName)).toBeVisible();
  });
});
