import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@fedshield.local";
const ADMIN_PASSWORD = "fedshield123";

test.describe("Login flow", () => {
  test("admin: login con credenziali corrette atterra in dashboard", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "FedShield" })).toBeVisible();
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entra/i }).click();

    // Post-login: il LoginPage smonta e DashboardPage monta. Cerco un
    // elemento stabile che esiste solo nella DashboardPage (toggle tema
    // sun/moon o uno qualunque dei link nav).
    await expect(page.getByRole("button", { name: /tema/i })).toBeVisible({ timeout: 15_000 });
  });

  test("login con password sbagliata mostra error-box e resta su LoginPage", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill("password-sbagliata-X");
    await page.getByRole("button", { name: /entra/i }).click();

    // Il LoginPage mostra .error-box dopo onSubmit reject. Verifico:
    // - error-box visibile con un messaggio
    // - il form Entra resta presente (non ho lasciato la pagina)
    const errorBox = page.locator(".error-box");
    await expect(errorBox).toBeVisible({ timeout: 10_000 });
    await expect(errorBox).not.toBeEmpty();
    await expect(page.getByRole("button", { name: /entra/i })).toBeVisible();
  });
});

test.describe("Golden path browser-level", () => {
  test("admin: login + naviga da Dashboard ad Anagrafica Clienti", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entra/i }).click();

    // Default post-login: tab Dashboard attivo (.nav-item-active).
    const dashboardTab = page.getByRole("button", { name: "Dashboard" });
    const registryTab = page.getByRole("button", { name: "Anagrafica Clienti" });
    await expect(dashboardTab).toHaveClass(/nav-item-active/, { timeout: 15_000 });

    // Clicco la tab Anagrafica Clienti.
    await registryTab.click();

    // Active class si sposta sul nuovo tab; Dashboard non più attivo.
    await expect(registryTab).toHaveClass(/nav-item-active/);
    await expect(dashboardTab).not.toHaveClass(/nav-item-active/);
  });
});
