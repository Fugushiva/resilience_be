/**
 * tests/seo.spec.ts
 * Suite Playwright — Validation SEO technique Survikit.
 *
 * Couvre :
 *  1.  Sitemap XML — structure, URLs, hreflang
 *  2.  Robots.txt — directives, Sitemap, bots LLM
 *  3.  Métadonnées home — title, description, canonical, OG, Twitter, hreflang
 *  4.  JSON-LD home — Organization, WebSite, SoftwareApplication, Product
 *  5.  Métadonnées /configurer — title, description, BreadcrumbList
 *  6.  Métadonnées /kit dynamiques — params ?score=85 → titre contient "85%"
 *  7.  Métadonnées /kit statiques — noindex, robots
 *  8.  Métadonnées /guide — title, Product JSON-LD avec prix et Gumroad URL
 *  9.  Métadonnées /emergency-news — ItemList JSON-LD
 *  10. OG image racine — 200, PNG, 1200×630
 *  11. Anti-sensationnalisme — titres/descriptions sans jargon survivaliste
 */

import { test, expect } from "@playwright/test";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extrait et parse tous les blocs JSON-LD d'une page.
 */
async function getJsonLdData(page: import("@playwright/test").Page) {
  const scripts = await page.$$eval(
    'script[type="application/ld+json"]',
    (els) => els.map((el) => el.textContent ?? "")
  );
  return scripts.map((s) => {
    try {
      return JSON.parse(s) as unknown;
    } catch {
      return null;
    }
  });
}

/**
 * Aplatit les tableaux JSON-LD (certains schemas sont des arrays de @graph).
 */
function flattenJsonLd(items: unknown[]): unknown[] {
  return items.flatMap((item) => {
    if (Array.isArray(item)) return flattenJsonLd(item);
    if (item && typeof item === "object" && "@graph" in item) {
      return flattenJsonLd((item as { "@graph": unknown[] })["@graph"]);
    }
    return [item];
  });
}

/**
 * Trouve un schéma par @type dans la liste aplatie.
 */
function findSchema(items: unknown[], type: string): Record<string, unknown> | null {
  const flat = flattenJsonLd(items);
  return (
    (flat.find(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        (item as Record<string, unknown>)["@type"] === type
    ) as Record<string, unknown>) ?? null
  );
}

// ─── 1. Sitemap XML ───────────────────────────────────────────────────────────

test.describe("Sitemap XML", () => {
  test("retourne 200 avec content-type XML", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const ct = response.headers()["content-type"] ?? "";
    expect(ct).toMatch(/xml/);
  });

  test("contient les 5 URLs principales", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("survikit.be/</loc>");   // Home
    expect(xml).toContain("/configurer</loc>");
    expect(xml).toContain("/emergency-news</loc>");
    expect(xml).toContain("/guide</loc>");
    expect(xml).toContain("/kit</loc>");
  });

  test("contient les alternates hreflang fr-BE et nl-BE", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("hreflang");
    expect(xml).toContain("fr-BE");
    expect(xml).toContain("nl-BE");
    expect(xml).toContain("x-default");
  });

  test("home a priority=1.0", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    // La priorité 1.0 doit apparaître
    expect(xml).toContain("<priority>1</priority>");
  });
});

// ─── 2. Robots.txt ────────────────────────────────────────────────────────────

test.describe("Robots.txt", () => {
  test("retourne 200", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
  });

  test("contient le lien vers le sitemap", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("Sitemap:");
    expect(txt).toContain("sitemap.xml");
  });

  test("bloque /api/ et /_next/", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("Disallow: /api/");
    expect(txt).toContain("Disallow: /_next/");
  });

  test("bloque /kit pour tous les bots", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("Disallow: /kit");
  });

  test("autorise GPTBot (stratégie SGE)", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("User-agent: GPTBot");
    // GPTBot doit avoir Allow: /
    const gptSection = txt.split("User-agent: GPTBot")[1]?.split("User-agent:")[0] ?? "";
    expect(gptSection).toContain("Allow: /");
  });

  test("autorise Claude-Web", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("User-agent: Claude-Web");
  });
});

// ─── 3. Métadonnées Home (/) ──────────────────────────────────────────────────

test.describe("Métadonnées Home (/)", () => {
  test("title contient Survikit et 72h", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title).toContain("Survikit");
    expect(title).toMatch(/72h|72 h/i);
  });

  test("description meta de qualité (>100 chars)", async ({ page }) => {
    await page.goto("/");
    const desc = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(desc.length).toBeGreaterThan(100);
    expect(desc).toContain("NCCN");
  });

  test("canonical pointe sur la home", async ({ page }) => {
    await page.goto("/");
    const canonical = await page.$eval(
      'link[rel="canonical"]',
      (el) => el.getAttribute("href") ?? ""
    );
    expect(canonical).toMatch(/survikit\.be\/?$/);
  });

  test("og:title présent", async ({ page }) => {
    await page.goto("/");
    const ogTitle = await page.$eval(
      'meta[property="og:title"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(ogTitle.length).toBeGreaterThan(10);
  });

  test("og:locale = fr_BE", async ({ page }) => {
    await page.goto("/");
    const locale = await page.$eval(
      'meta[property="og:locale"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(locale).toBe("fr_BE");
  });

  test("twitter:card = summary_large_image", async ({ page }) => {
    await page.goto("/");
    const card = await page.$eval(
      'meta[name="twitter:card"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(card).toBe("summary_large_image");
  });

  test("hreflang fr-BE présent", async ({ page }) => {
    await page.goto("/");
    const hreflang = await page.$eval(
      'link[hreflang="fr-BE"]',
      (el) => el.getAttribute("href") ?? ""
    );
    expect(hreflang).toContain("survikit.be");
  });

  test("hreflang nl-BE présent (infrastructure i18n)", async ({ page }) => {
    await page.goto("/");
    const hreflangNl = await page.$eval(
      'link[hreflang="nl-BE"]',
      (el) => el.getAttribute("href") ?? ""
    );
    expect(hreflangNl).toContain("survikit.be");
    expect(hreflangNl).toContain("/nl");
  });

  test("x-default présent", async ({ page }) => {
    await page.goto("/");
    const xDefault = await page.$eval(
      'link[hreflang="x-default"]',
      (el) => el.getAttribute("href") ?? ""
    );
    expect(xDefault).toContain("survikit.be");
  });
});

// ─── 4. JSON-LD Home ──────────────────────────────────────────────────────────

test.describe("JSON-LD Home (/)", () => {
  test("Organization présent avec areaServed BE", async ({ page }) => {
    await page.goto("/");
    const schemas = await getJsonLdData(page);
    const org = findSchema(schemas, "Organization");
    expect(org).not.toBeNull();
    expect((org as Record<string, unknown>)?.areaServed).toBeTruthy();
  });

  test("WebSite présent avec url survikit.be", async ({ page }) => {
    await page.goto("/");
    const schemas = await getJsonLdData(page);
    const website = findSchema(schemas, "WebSite");
    expect(website).not.toBeNull();
    const url = (website as Record<string, unknown>)?.url as string;
    expect(url).toContain("survikit.be");
  });

  test("SoftwareApplication présent avec price=0", async ({ page }) => {
    await page.goto("/");
    const schemas = await getJsonLdData(page);
    const app = findSchema(schemas, "SoftwareApplication");
    expect(app).not.toBeNull();
    const offers = (app as Record<string, unknown>)?.offers as Record<string, unknown>;
    expect(String(offers?.price)).toBe("0");
  });

  test("Product présent avec price=12.00 et URL Gumroad", async ({ page }) => {
    await page.goto("/");
    const schemas = await getJsonLdData(page);
    const product = findSchema(schemas, "Product");
    expect(product).not.toBeNull();
    const offers = (product as Record<string, unknown>)?.offers as Record<string, unknown>;
    expect(String(offers?.price)).toBe("12.00");
    expect(String(offers?.priceCurrency)).toBe("EUR");
    expect(String(offers?.url)).toContain("gumroad.com");
  });

  test("Product n'a PAS d'aggregateRating (compliance Google)", async ({ page }) => {
    await page.goto("/");
    const schemas = await getJsonLdData(page);
    const product = findSchema(schemas, "Product");
    // Les étoiles sont interdites sans vraies reviews — vérification de conformité
    expect((product as Record<string, unknown>)?.aggregateRating).toBeUndefined();
  });
});

// ─── 5. Métadonnées /configurer ───────────────────────────────────────────────

test.describe("Métadonnées /configurer", () => {
  test("title contient Configurer et NCCN/diagnostic", async ({ page }) => {
    await page.goto("/configurer");
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/configurer|diagnostic/);
    expect(title).toContain("Survikit");
  });

  test("description mentionne 5 étapes et gratuité", async ({ page }) => {
    await page.goto("/configurer");
    const desc = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(desc.toLowerCase()).toMatch(/5 \u00e9tapes?|étapes?/);
    expect(desc.toLowerCase()).toMatch(/gratuit|sans inscription/);
  });

  test("BreadcrumbList JSON-LD avec 2 éléments", async ({ page }) => {
    await page.goto("/configurer");
    const schemas = await getJsonLdData(page);
    const breadcrumb = findSchema(schemas, "BreadcrumbList");
    expect(breadcrumb).not.toBeNull();
    const items = (breadcrumb as Record<string, unknown>)?.itemListElement as unknown[];
    expect(items?.length).toBe(2);
  });
});

// ─── 6. Métadonnées /kit dynamiques ──────────────────────────────────────────

test.describe("Métadonnées /kit avec searchParams", () => {
  test("titre contient le score quand ?score=85", async ({ page }) => {
    await page.goto("/kit?score=85&persons=4&hours=72&essentials=23");
    const title = await page.title();
    expect(title).toContain("85%");
    expect(title).toMatch(/72h|72 h/i);
  });

  test("description mentionne le nombre de personnes", async ({ page }) => {
    await page.goto("/kit?score=85&persons=4&hours=72&essentials=23");
    const desc = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(desc).toContain("4");
  });
});

// ─── 7. Métadonnées /kit statiques ───────────────────────────────────────────

test.describe("Métadonnées /kit sans params (noindex)", () => {
  test("robots = noindex", async ({ page }) => {
    await page.goto("/kit");
    const robots = await page.$eval(
      'meta[name="robots"]',
      (el) => el.getAttribute("content") ?? ""
    );
    expect(robots).toContain("noindex");
  });

  test("canonical pointe sur /kit sans params", async ({ page }) => {
    await page.goto("/kit?score=99");
    const canonical = await page.$eval(
      'link[rel="canonical"]',
      (el) => el.getAttribute("href") ?? ""
    );
    // Le canonical ne doit pas avoir de query params
    expect(canonical).not.toContain("?");
    expect(canonical).toContain("/kit");
  });
});

// ─── 8. Page /guide ───────────────────────────────────────────────────────────

test.describe("Page Guide (/guide)", () => {
  test("page retourne 200", async ({ page }) => {
    const response = await page.goto("/guide");
    expect(response?.status()).toBe(200);
  });

  test("title contient Résilience Familiale", async ({ page }) => {
    await page.goto("/guide");
    const title = await page.title();
    expect(title).toMatch(/R\u00e9silience Familiale|resilience familiale/i);
  });

  test("Product JSON-LD présent avec Gumroad URL", async ({ page }) => {
    await page.goto("/guide");
    const schemas = await getJsonLdData(page);
    const product = findSchema(schemas, "Product");
    expect(product).not.toBeNull();
    const offers = (product as Record<string, unknown>)?.offers as Record<string, unknown>;
    expect(String(offers?.url)).toContain("gumroad.com");
    expect(String(offers?.price)).toBe("12.00");
  });

  test("lien Gumroad avec rel=noopener", async ({ page }) => {
    await page.goto("/guide");
    const gumroadLinks = await page.$$eval(
      'a[href*="gumroad.com"]',
      (els) => els.map((el) => ({ href: el.getAttribute("href"), rel: el.getAttribute("rel") }))
    );
    expect(gumroadLinks.length).toBeGreaterThan(0);
    gumroadLinks.forEach((link) => {
      expect(link.rel).toContain("noopener");
    });
  });

  test("8 chapitres listés sur la page", async ({ page }) => {
    await page.goto("/guide");
    const chapterNumbers = await page.$$eval(
      "section h3",
      (els) => els.length
    );
    // Au moins 8 titres de chapitres
    expect(chapterNumbers).toBeGreaterThanOrEqual(8);
  });

  test("BreadcrumbList JSON-LD présent", async ({ page }) => {
    await page.goto("/guide");
    const schemas = await getJsonLdData(page);
    const breadcrumb = findSchema(schemas, "BreadcrumbList");
    expect(breadcrumb).not.toBeNull();
  });
});

// ─── 9. JSON-LD /emergency-news ──────────────────────────────────────────────

test.describe("JSON-LD /emergency-news", () => {
  test("ItemList présent", async ({ page }) => {
    await page.goto("/emergency-news");
    const schemas = await getJsonLdData(page);
    const itemList = findSchema(schemas, "ItemList");
    expect(itemList).not.toBeNull();
  });

  test("BreadcrumbList présent", async ({ page }) => {
    await page.goto("/emergency-news");
    const schemas = await getJsonLdData(page);
    const breadcrumb = findSchema(schemas, "BreadcrumbList");
    expect(breadcrumb).not.toBeNull();
  });
});

// ─── 10. OG Images ───────────────────────────────────────────────────────────

test.describe("Open Graph Images", () => {
  test("image racine retourne 200 PNG", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    const ct = response.headers()["content-type"] ?? "";
    expect(ct).toContain("image/png");
  });

  test("image /configurer retourne 200", async ({ request }) => {
    const response = await request.get("/configurer/opengraph-image");
    expect(response.status()).toBe(200);
  });

  test("image /guide retourne 200", async ({ request }) => {
    const response = await request.get("/guide/opengraph-image");
    expect(response.status()).toBe(200);
  });

  test("image /kit dynamique retourne 200 avec params", async ({ request }) => {
    const response = await request.get(
      "/kit/opengraph-image?score=85&persons=4&hours=72"
    );
    expect(response.status()).toBe(200);
  });
});

// ─── 11. Anti-sensationnalisme ────────────────────────────────────────────────

const FORBIDDEN_WORDS = [
  /armageddon/i,
  /collapse/i,
  /prepper extrême/i,
  /fin du monde/i,
  /apocalypse/i,
  /survivaliste/i,
  /catastrophiste/i,
];

test.describe("Anti-sensationnalisme — champ lexical", () => {
  for (const path of ["/", "/guide", "/configurer", "/emergency-news"]) {
    test(`${path} — titres et description sans jargon interdit`, async ({ page }) => {
      await page.goto(path);

      const title = await page.title();
      const desc = await page
        .$eval(
          'meta[name="description"]',
          (el) => el.getAttribute("content") ?? ""
        )
        .catch(() => "");
      const h1 = await page
        .$eval("h1", (el) => el.textContent ?? "")
        .catch(() => "");

      const combined = `${title} ${desc} ${h1}`;

      for (const pattern of FORBIDDEN_WORDS) {
        expect(combined).not.toMatch(pattern);
      }
    });
  }
});

// ─── 12. Accessibilité SEO minimale ──────────────────────────────────────────

test.describe("Accessibilité SEO", () => {
  test("/ — un seul h1", async ({ page }) => {
    await page.goto("/");
    const h1s = await page.$$("h1");
    expect(h1s.length).toBe(1);
  });

  test("/guide — un seul h1", async ({ page }) => {
    await page.goto("/guide");
    const h1s = await page.$$("h1");
    expect(h1s.length).toBe(1);
  });

  test("/emergency-news — un seul h1", async ({ page }) => {
    await page.goto("/emergency-news");
    const h1s = await page.$$("h1");
    expect(h1s.length).toBe(1);
  });

  test("/ — html lang='fr'", async ({ page }) => {
    await page.goto("/");
    const lang = await page.$eval("html", (el) => el.getAttribute("lang") ?? "");
    expect(lang).toBe("fr");
  });
});
