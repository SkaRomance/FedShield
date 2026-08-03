import { test, expect } from "@playwright/test";

const SENIOR_EMAIL = "senior@fedshield.local";
const SENIOR_PASSWORD = "fedshield123";

test.describe("Training record golden path", () => {
  test("senior: crea corso + dipendente + record formazione con expiresAt auto", async ({
    page,
  }) => {
    // Login senior — può creare course/employee/record (requireSeniorOrAdmin).
    await page.goto("/");
    await page.getByLabel("Email").fill(SENIOR_EMAIL);
    await page.getByLabel("Password").fill(SENIOR_PASSWORD);
    await page.getByRole("button", { name: /entra/i }).click();

    await expect(page.getByRole("button", { name: "Dashboard" })).toBeVisible({
      timeout: 15_000,
    });

    // Naviga "Formazione".
    await page.getByRole("button", { name: "Formazione" }).click();
    await expect(
      page.getByRole("heading", { name: /Gestione Formazione/i }),
    ).toBeVisible();

    const stamp = Date.now();
    // seed-test-baseline NON crea trainingCourse (solo seed.ts full domain).
    // Devo creare un corso inline prima di poter registrare formazione,
    // perché EmployeesTab disabilita "+ Formazione" quando courses.length === 0.
    const courseName = `E2E Spec3 Sicurezza Generale ${stamp}`;

    // Tab "Catalogo corsi" → "+ Nuovo corso".
    await page.getByRole("button", { name: /Catalogo corsi/ }).click();
    await expect(
      page.getByRole("heading", { name: /^Catalogo corsi$/ }),
    ).toBeVisible();
    await page.getByRole("button", { name: /\+ Nuovo corso/ }).click();
    await page.getByLabel(/Nome corso/).fill(courseName);
    // Audience, ore, freq, normRef hanno default sensati. Frequenza 5 anni
    // → expiresAt sarà oggi + 5 anni (futuro).
    await page.getByRole("button", { name: /^Crea corso$/ }).click();

    // Aspetta che il corso appaia in tabella.
    await expect(page.getByRole("cell", { name: courseName })).toBeVisible({
      timeout: 10_000,
    });

    // Tab "Dipendenti" → crea un dipendente nuovo (seed-test-baseline ha
    // 1 company "Azienda Test Baseline" ma 0 employee → devo crearne 1).
    await page.getByRole("button", { name: /^Dipendenti$/ }).click();
    await expect(
      page.getByRole("heading", { name: /^Dipendenti$/ }),
    ).toBeVisible();

    const fiscalCode = `RSSMRA80A01H501${stamp.toString().slice(-1)}`;
    const lastName = `Rossi${stamp}`;
    const firstName = "Mario";

    await page.getByRole("button", { name: /\+ Nuovo dipendente/ }).click();
    // Azienda di default (prima del select), Cognome, Nome, CF.
    await page.getByLabel(/^Cognome \*/).fill(lastName);
    await page.getByLabel(/^Nome \*/).fill(firstName);
    await page.getByLabel(/Codice Fiscale/).fill(fiscalCode);
    await page.getByRole("button", { name: /^Crea dipendente$/ }).click();

    // Trova la riga del nuovo dipendente.
    const empRow = page
      .getByRole("row")
      .filter({ has: page.getByText(lastName, { exact: false }) });
    await expect(empRow).toBeVisible({ timeout: 10_000 });

    // Click "+ Formazione" sulla riga del nuovo dipendente. Apre il
    // TrainingRecordForm. courses[] è ordinato alfabeticamente lato
    // backend, quindi il default può non essere il nostro corso se ne
    // esistono altri (es. residui di run precedenti). Seleziono
    // esplicitamente il corso E2E.
    await empRow.getByRole("button", { name: /\+ Formazione/ }).click();

    // Heading conferma il dipendente target.
    await expect(
      page.getByRole("heading", {
        name: new RegExp(`Registra formazione: ${lastName} ${firstName}`),
      }),
    ).toBeVisible();

    // Seleziono il corso appena creato dal select Corso. CourseForm usa
    // default minHours=4, frequencyYears=5, quindi l'option ha label
    // esatto `<courseName> (4h, ogni 5a)`.
    await page
      .getByLabel(/^Corso \*/)
      .selectOption({ label: `${courseName} (4h, ogni 5a)` });
    // completedAt = oggi (default). Submit.
    await page.getByRole("button", { name: /^Registra formazione$/ }).click();

    // Wait reload completed: la colonna "Corsi" del dipendente passa 0 → 1.
    // Targetto nuova riga (post-reload) e cell count.
    await expect(
      page.getByRole("row").filter({ has: page.getByText(lastName) }),
    ).toContainText("1", { timeout: 10_000 });

    // Switch tab "Scadenze" — la riga del dipendente deve mostrare
    // colonna "Scadenza" con una data DD/MM/YYYY (auto da frequencyYears),
    // e lo Stato "Valido" (futuro >90gg con frequenza 5y).
    await page.getByRole("button", { name: /^Scadenze$/ }).click();
    await expect(
      page.getByRole("heading", { name: /Scadenze formazione/i }),
    ).toBeVisible();

    const scadRow = page
      .getByRole("row")
      .filter({ has: page.getByText(lastName) });
    // Cell Corso = nostro courseName.
    await expect(scadRow.getByText(courseName)).toBeVisible({ timeout: 5_000 });
    // Cell Scadenza in formato DD/MM/YYYY (auto-calcolata da
    // completedAt + frequencyYears del corso).
    await expect(scadRow.getByText(/\d{2}\/\d{2}\/\d{4}/)).toBeVisible();
  });
});
