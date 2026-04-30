import { test, expect } from "@playwright/test";

test.describe("Emergency News Page", () => {
  test("loads the page and displays the main hero title", async ({ page }) => {
    await page.goto("/emergency-news");
    await expect(page.locator("h1")).toContainText("Info");
    await expect(page.locator("h1")).toContainText("Urgences");
    await expect(page.locator("h1")).toContainText("Belgique");
    
    // Check if the "En direct" indicator is visible
    await expect(page.locator("text=En direct")).toBeVisible();
  });

  test("displays resilient fallback news when API is unavailable", async ({ page }) => {
    await page.goto("/emergency-news");

    // L'API n'est pas configurée dans l'environnement de test (pas de clé, pas d'URL).
    // Le système doit naturellement basculer sur les données de Fallback (Zéro Bug Policy).
    
    // Vérifier la présence d'une alerte critique du fallback
    const criticalNews = page.locator("article", { hasText: "Alerte Inondations : Province de Liège" });
    await expect(criticalNews).toBeVisible();
    
    // Vérifier le tag de sévérité critique
    await expect(criticalNews.locator("span", { hasText: /^Critique$/ })).toBeVisible();
    await expect(criticalNews.locator("text=Source: NCCN")).toBeVisible();
    
    // Vérifier la présence d'une alerte warning du fallback
    const warningNews = page.locator("article", { hasText: "Plan d'Urgence Hivernal Activé" });
    await expect(warningNews).toBeVisible();
    await expect(warningNews.locator("text=Alerte")).toBeVisible();
    
    // Vérifier la présence d'une info du fallback
    const infoNews = page.locator("article", { hasText: "Rapport de disponibilité des kits 72h" });
    await expect(infoNews).toBeVisible();
    await expect(infoNews.locator("text=Info")).toBeVisible();
  });

  test("CTA navigates to the configurator", async ({ page }) => {
    await page.goto("/emergency-news");
    
    // Chercher le bouton de composition de kit en bas de page
    const cta = page.locator("text=Composer mon kit →");
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
    
    await cta.click();
    
    // Doit rediriger vers le tunnel
    await expect(page).toHaveURL(/\/configurer/);
  });
});
