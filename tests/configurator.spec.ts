import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("survivrez");
  });

  test("shows stats section", async ({ page }) => {
    await page.goto("/");
    await page.locator("text=EN CHIFFRES").scrollIntoViewIfNeeded();
    await expect(page.locator("text=premières heures")).toBeVisible();
  });

  test("shows 5 kit cards", async ({ page }) => {
    await page.goto("/");
    await page.locator("text=NOS KITS").scrollIntoViewIfNeeded();
    await expect(page.locator("text=Essentiels Alpine")).toBeVisible();
    await expect(page.locator("text=Panne Urbaine")).toBeVisible();
    await expect(page.locator("text=Kit Famille")).toBeVisible();
  });

  test("CTA navigates to configurator", async ({ page }) => {
    await page.goto("/");
    await page.locator("text=Composer mon kit →").first().click();
    await expect(page).toHaveURL(/\/configurer/);
  });
});

test.describe("Configurator tunnel", () => {
  test("step 1: shows foyer step", async ({ page }) => {
    await page.goto("/configurer");
    await expect(page.locator("h1")).toContainText("Votre foyer");
    await expect(page.locator("text=Adultes")).toBeVisible();
    await expect(page.locator("text=Enfants")).toBeVisible();
  });

  test("step navigation forward", async ({ page }) => {
    await page.goto("/configurer");
    // Step 1: foyer
    await expect(page.locator("h1")).toContainText("Votre foyer");
    await page.locator("text=Continuer →").click();

    // Step 2: logement
    await expect(page.locator("h1")).toContainText("Votre logement");
    await page.locator("text=Continuer →").click();

    // Step 3: scenario
    await expect(page.locator("h1")).toContainText("Le scénario");
  });

  test("step navigation backward", async ({ page }) => {
    await page.goto("/configurer");
    await page.locator("text=Continuer →").click();
    await expect(page.locator("h1")).toContainText("Votre logement");
    await page.locator("text=← Retour").click();
    await expect(page.locator("h1")).toContainText("Votre foyer");
  });

  test("complete full tunnel and reach kit result", async ({ page }) => {
    await page.goto("/configurer");

    // Step 1: foyer (defaults OK)
    await page.locator("text=Continuer →").click();

    // Step 2: logement
    await page.locator("text=Continuer →").click();

    // Step 3: scenario
    await page.locator("text=Continuer →").click();

    // Step 4: sante
    await page.locator("text=Continuer →").click();

    // Step 5: autonomie → compute
    await page.locator("text=Calculer mon kit →").click();

    // Computing screen
    await expect(page.locator("text=Calcul en cours")).toBeVisible();

    // Wait for redirect to kit page (max 5s)
    await page.waitForURL(/\/kit/, { timeout: 8000 });
    await expect(page.locator("text=VOTRE KIT PERSONNALISÉ")).toBeVisible();
    await expect(page.locator("text=Articles essentiels")).toBeVisible();
  });

  test("kit result shows affiliate links", async ({ page }) => {
    await page.goto("/configurer");
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Calculer mon kit →").click();
    await page.waitForURL(/\/kit/, { timeout: 8000 });

    // At least one affiliate link should be present
    const affiliateLinks = page.locator("a[rel*='sponsored']");
    await expect(affiliateLinks.first()).toBeVisible();
  });

  test("kit result shows budget estimate", async ({ page }) => {
    await page.goto("/configurer");
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Calculer mon kit →").click();
    await page.waitForURL(/\/kit/, { timeout: 8000 });

    await expect(page.locator("text=Budget estimé")).toBeVisible();
  });
});

test.describe("Kit rules engine", () => {
  // Unit-level smoke test via full UI
  test("family profile includes kids items", async ({ page }) => {
    await page.goto("/configurer");

    // Set 2 children
    const addChildBtn = page.locator("[aria-label='Augmenter Enfants']");
    await addChildBtn.click();
    await addChildBtn.click();

    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Calculer mon kit →").click();
    await page.waitForURL(/\/kit/, { timeout: 8000 });

    // Should include children's items
    await expect(page.locator("text=Enfants")).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("configurator buttons have aria labels", async ({ page }) => {
    await page.goto("/configurer");
    const increaseBtn = page.locator("[aria-label='Augmenter Adultes']");
    await expect(increaseBtn).toBeVisible();
  });

  test("kit result has affiliate disclosure", async ({ page }) => {
    await page.goto("/configurer");
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Continuer →").click();
    await page.locator("text=Calculer mon kit →").click();
    await page.waitForURL(/\/kit/, { timeout: 8000 });

    await expect(
      page.locator("text=programme")
    ).toBeVisible();
  });
});
