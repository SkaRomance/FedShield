import { test, expect } from "@playwright/test";

const SENIOR_EMAIL = "senior@fedshield.local";
const SENIOR_PASSWORD = "fedshield123";

test.describe("Create asset (estintore) + QR golden path", () => {
  test("senior: crea estintore e apre AssetQrPage con kind=extinguisher", async ({
    page,
  }) => {
    // Login senior (admin/senior entrambi possono creare assets;
    // uso senior per coprire role-guard requireSeniorOrAdmin lato backend).
    await page.goto("/");
    await page.getByLabel("Email").fill(SENIOR_EMAIL);
    await page.getByLabel("Password").fill(SENIOR_PASSWORD);
    await page.getByRole("button", { name: /entra/i }).click();

    // Wait dashboard mounted.
    await expect(page.getByRole("button", { name: /tema/i })).toBeVisible({
      timeout: 15_000,
    });

    // Naviga ad "Asset & Attrezzature".
    await page.getByRole("button", { name: "Asset & Attrezzature" }).click();
    await expect(
      page.getByRole("heading", { name: /Asset & Attrezzature/i }),
    ).toBeVisible();

    // Switch tab "Estintori" (etichetta include il counter, es. "Estintori (0)").
    await page.getByRole("button", { name: /^Estintori \(\d+\)$/ }).click();
    await expect(
      page.getByRole("heading", { name: /^Estintori$/ }),
    ).toBeVisible();

    // Apri form "Nuovo estintore". Il companyId è preso dal filtro dropdown
    // header (default: prima azienda — Azienda Test Baseline da seed).
    await page.getByRole("button", { name: /\+ Nuovo estintore/i }).click();

    const stamp = Date.now();
    const code = `EXT-${stamp}`;
    const location = "Cucina principale";

    // Compila form. Il tipo ha già default "polvere ABC" via stato iniziale.
    // L'input code applica .toUpperCase() automaticamente, quindi confronto
    // direttamente con `code` già uppercase.
    await page.getByLabel(/Codice \/ matricola/).fill(code);
    await page.getByLabel(/Ubicazione/).fill(location);

    // Submit (button "Crea" del FormActions condiviso).
    await page.getByRole("button", { name: /^Crea$/ }).click();

    // La nuova riga deve apparire in tabella con il code unico.
    await expect(
      page.getByRole("cell", { name: code, exact: true }).locator(".."),
    ).toBeVisible({ timeout: 10_000 });

    // Click bottone QR sulla riga della nuova riga estintore.
    // RowActions ha 3 ghost-btn: QR, Modifica, Elimina. Targetto il primo
    // QR all'interno della stessa riga (uso cell "code" → riga → bottone QR).
    const newRow = page
      .getByRole("row")
      .filter({ has: page.getByText(code, { exact: true }) });
    await newRow.getByRole("button", { name: /^QR$/ }).click();

    // Atterro sulla AssetQrPage. Asserisco:
    // - heading "QR Code Estintore" (kindLabel("extinguisher") = "Estintore")
    // - presenza del code (campo Codice nella card QR)
    // - presenza del default Tipo "polvere ABC"
    await expect(
      page.getByRole("heading", { name: /QR Code Estintore/i }),
    ).toBeVisible({ timeout: 10_000 });
    // Il code è renderizzato sia nel <h3>{name}</h3> sia nel paragrafo
    // "Codice: ...". Mi accerto che almeno un'occorrenza esista.
    await expect(page.getByText(code).first()).toBeVisible();
    await expect(page.getByText(/polvere ABC/i)).toBeVisible();
  });
});
