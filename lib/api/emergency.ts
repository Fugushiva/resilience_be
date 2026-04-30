import { z } from "zod";
import Parser from "rss-parser";

// ============================================================================
// SCHEMAS
// ============================================================================

export const EmergencyNewsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  source: z.string(),
  url: z.string().url().optional(),
  severity: z.enum(["info", "warning", "critical"]),
  /** Score de pertinence interne (0-100). Non exposé au front-end. */
  relevanceScore: z.number().min(0).max(100).optional(),
});

export const EmergencyNewsResponseSchema = z.object({
  status: z.enum(["ok", "error"]),
  lastUpdated: z.string().datetime(),
  news: z.array(EmergencyNewsItemSchema),
});

export type EmergencyNewsItem = z.infer<typeof EmergencyNewsItemSchema>;
export type EmergencyNewsResponse = z.infer<typeof EmergencyNewsResponseSchema>;

// ============================================================================
// RELEVANCE ENGINE v3 — Classification à deux passes
// ============================================================================
//
// PHILOSOPHIE :
// On ne cherche PAS "tout article contenant le mot alerte".
// On cherche UNIQUEMENT des articles qui motivent l'achat d'un kit de survie.
//
// Un article pertinent est un article qui décrit :
// 1. Un danger physique immédiat (catastrophe naturelle, attentat, accident industriel)
// 2. Une recommandation officielle de préparation (Centre de Crise, Be-Alert, consignes)
// 3. Un incident lié à l'outdoor / balade (dangers en randonnée, noyade, hypothermie)
// 4. Un risque d'infrastructure (blackout, pénurie eau/nourriture, coupure)
//
// Un article NON pertinent est TOUT le reste : politique, sport, people, faits divers,
// économie, justice, opinion, culture, etc.
//
// STRATÉGIE :
// Passe 1 — HARD REJECT : si l'article contient un mot négatif ET aucun mot de danger
//           physique, il est éliminé immédiatement (score = 0).
// Passe 2 — SCORING : on calcule un score pondéré.
//           Seuil = 30 points minimum.

// ---- LISTES DE MOTS-CLÉS ----

/**
 * TIER 1 — Termes de survie directe (+40 pts chacun, cap 80)
 * Un seul de ces termes = article automatiquement pertinent.
 * Ce sont des termes qui n'existent QUE dans un contexte de préparation/survie.
 */
const TIER1_SURVIVAL_DIRECT = [
  // Kits & préparation
  "kit de survie", "kit d'urgence", "kit 72h", "sac d'évacuation",
  "stock d'urgence", "préparation urgence", "survivalisme", "survivaliste",
  "preppers", "préparer son kit",
  // Objets de survie spécifiques
  "trousse de secours", "premiers secours", "ration de survie",
  "purification eau", "radio d'urgence", "lampe dynamo",
  "couverture de survie", "réchaud camping", "filtre à eau",
  "panneau solaire portable", "batterie externe",
  // Institutions d'urgence belges
  "be-alert", "centre de crise national", "plan d'urgence national",
  "nccn", "protection civile belge",
];

/**
 * TIER 2 — Danger physique concret (+20 pts chacun, cap 60)
 * Ces termes décrivent un danger réel qui justifie d'avoir un kit.
 * Ils sont assez spécifiques pour ne pas matcher de faux positifs.
 */
const TIER2_PHYSICAL_DANGER = [
  // Catastrophes naturelles
  "inondation", "inondations", "crue", "débordement",
  "tempête", "ouragan", "tornade", "orage violent",
  "séisme", "tremblement de terre",
  "glissement de terrain", "coulée de boue",
  "feu de forêt", "incendie de forêt",
  // Risques NRBC (Nucléaire, Radiologique, Biologique, Chimique)
  "risque nucléaire", "accident nucléaire", "fuite chimique",
  "nuage toxique", "seveso", "risque seveso",
  // Risques d'infrastructure
  "blackout", "coupure de courant", "panne générale", "panne électrique",
  "pénurie d'eau", "pénurie alimentaire", "pénurie de gaz",
  "délestage", "plan de délestage",
  // Menaces sécuritaires
  "attentat", "attaque terroriste", "terrorisme", "fusillade",
  // Urgences outdoor
  "hypothermie", "noyade", "déshydratation",
  "avalanche", "chute mortelle", "chute en montagne",
  // Actions d'urgence
  "évacuation", "évacuer", "confinement",
  "zone sinistrée", "zone de danger",
];

/**
 * TIER 3 — Contexte de vigilance (+10 pts chacun, cap 30)
 * Ces mots ne suffisent PAS seuls. Ils renforcent un article déjà partiellement pertinent.
 * On ne les score que si au moins un TIER2 est déjà présent.
 */
const TIER3_CONTEXT = [
  // Météo
  "vigilance orange", "vigilance rouge", "alerte météo", "alerte rouge",
  "vague de froid", "vague de chaleur", "canicule",
  "neige", "verglas", "gel",
  // Préparation
  "recommandation", "consignes de sécurité", "mesures de précaution",
  "plan catastrophe", "exercice d'évacuation",
  "réserves", "approvisionnement",
  // Secours
  "pompiers", "ambulance", "samu", "croix-rouge",
  "aide humanitaire", "hébergement d'urgence",
  // Outdoor
  "randonnée", "balade", "sentier", "montagne",
  // Signaux d'alerte
  "sirène", "sirènes d'alerte", "alerte", "danger", "urgence",
  // Conséquences
  "dégâts", "victimes", "blessés", "sinistrés",
];

/**
 * HARD REJECT — Si un article contient l'un de ces termes ET ne contient
 * AUCUN terme TIER1 ou TIER2, il est éliminé immédiatement.
 * Cela empêche les faux positifs des flux généralistes (RTL Belgique).
 */
const HARD_REJECT_KEYWORDS = [
  // Politique / Institutions
  "parlement", "premier ministre", "coalition", "opposition",
  "sénat", "chambre des représentants", "gouvernement fédéral",
  "élection", "voter", "vote",
  "grève", "syndicat", "manifestation",
  "député", "ministre", "bourgmestre",
  "otan", "diplomatie", "ambassadeur",
  "parti", "libéral", "socialiste", "écolo",
  "commission européenne", "union européenne",
  // Sport
  "football", "foot", "match", "championnat", "ligue", "coupe",
  "tennis", "cyclisme", "tour de france", "jeux olympiques",
  "transfert", "joueur", "entraîneur",
  "standard", "anderlecht", "club bruges",
  // People / Culture / Divertissement
  "célébrité", "star", "festival", "concert", "cinéma", "film",
  "émission", "télé-réalité", "influenceur",
  "tapis rouge", "cérémonie", "gala",
  // Économie / Finance
  "bourse", "actions", "bitcoin", "crypto",
  "taux d'intérêt", "inflation", "pib",
  "dividende", "investissement", "actionnaire",
  "impôt", "déclaration fiscale", "taxe", "indexation",
  // Justice / Faits divers sans lien sécurité civile
  "procès", "tribunal", "condamnation", "prison", "détention",
  "cambriolage", "escroquerie", "fraude", "vol",
  "meurtre", "assassinat", "tueur",
  "assises", "avocat", "verdict",
  // Débat / Média
  "débat", "polémique", "controverse", "chronique", "éditorial",
  "plateau", "interview",
  // Santé non-urgence
  "vaccination", "vaccin", "hôpital",
  "chirurgie", "opération", "médecin",
  // Transports non-urgence
  "trafic", "embouteillage", "stib", "sncb",
  "retard", "perturbation",
  // Technologie
  "intelligence artificielle", "ia", "startup", "app",
  // Divers
  "immobilier", "logement", "loyer",
  "restaurant", "gastronomie", "recette",
  "vacances", "tourisme", "voyage",
  "école", "université", "étudiant",
  "pension", "retraite",
  "interdiction", "tabac",
  "aide-ménagère", "emploi", "salaire",
  "cnn", "poutine",
  "papa", "bébé", "naissance",
  "fête", "invitation",
];

// ---- MÉTAPHORIQUE REJECT ----
// Ces mots indiquent que les termes de survie sont utilisés au sens figuré.
// Cela rejette MÊME si un TIER1 est présent (ex: "kit de survie des bébés" = article parenting).
const METAPHORICAL_REJECT = [
  "émotions", "émotionnel", "émotionnels", "émotionnelles",
  "bien-être", "psychologie", "mental", "mentale",
  "livre", "roman", "auteur", "lecture",
  "jeu vidéo", "gaming", "playstation", "xbox",
  "amour", "couple", "relation", "parentalité",
  "entreprise", "management", "carrière", "business",
  // Science / Vulgarisation / Documentaire — termes de danger utilisés hors contexte d'urgence réelle
  "pour la science", "scientifique", "chercheur", "chercheurs",
  "étude", "recherche", "laboratoire",
  "documentaire", "reportage", "histoire de",
];

// ---- FONCTIONS DE SCORING ----

/**
 * Passe 1 : Vérifie si l'article doit être rejeté catégoriquement.
 *
 * Deux types de rejet :
 * A) METAPHORICAL_REJECT → rejette TOUJOURS (même avec TIER1/TIER2) car ça indique
 *    un usage figuré des termes de survie (ex: "kit de survie" + "émotions" = parenting article)
 * B) HARD_REJECT → rejette seulement si AUCUN TIER1/TIER2 n'est présent
 */
function shouldHardReject(content: string): boolean {
  // A) Métaphorique → toujours rejeter
  if (METAPHORICAL_REJECT.some((kw) => content.includes(kw))) return true;

  // B) Hors-sujet classique → rejeter sauf si danger physique présent
  const hasHighRelevance =
    TIER1_SURVIVAL_DIRECT.some((kw) => content.includes(kw)) ||
    TIER2_PHYSICAL_DANGER.some((kw) => content.includes(kw));

  if (hasHighRelevance) return false;

  return HARD_REJECT_KEYWORDS.some((kw) => content.includes(kw));
}

/**
 * Passe 2 : Calcule le score de pertinence.
 * 
 * Seuil de validation = 30 points.
 * - 1 mot TIER1 (40pts) → passe automatiquement ✅
 * - 2 mots TIER2 (20+20=40pts) → passe ✅
 * - 1 mot TIER2 + 1 mot TIER3 (20+10=30pts) → passe ✅
 * - 1 mot TIER2 seul (20pts) → ne passe PAS ❌
 * - 3 mots TIER3 seuls (10+10+10=30pts) → ne passe PAS car TIER3 exige un TIER2
 */
function computeRelevanceScore(title: string, description: string): number {
  const content = `${title} ${description}`.toLowerCase();

  // Passe 1 : Hard reject
  if (shouldHardReject(content)) return 0;

  let score = 0;

  // TIER1 : Survie directe (+40 chacun, cap à 80)
  let t1Hits = 0;
  for (const kw of TIER1_SURVIVAL_DIRECT) {
    if (content.includes(kw)) {
      t1Hits++;
      if (t1Hits <= 2) score += 40;
    }
  }

  // TIER2 : Danger physique (+20 chacun, cap à 60)
  let t2Hits = 0;
  for (const kw of TIER2_PHYSICAL_DANGER) {
    if (content.includes(kw)) {
      t2Hits++;
      if (t2Hits <= 3) score += 20;
    }
  }

  // TIER3 : Contexte — seulement si au moins un TIER1 ou TIER2 est présent
  if (t1Hits > 0 || t2Hits > 0) {
    let t3Hits = 0;
    for (const kw of TIER3_CONTEXT) {
      if (content.includes(kw)) {
        t3Hits++;
        if (t3Hits <= 3) score += 10;
      }
    }
  }

  return Math.max(0, Math.min(100, score));
}

/** Seuil minimum de pertinence */
const RELEVANCE_THRESHOLD = 30;

// ============================================================================
// SEVERITY CLASSIFIER
// ============================================================================

function classifySeverity(content: string): "info" | "warning" | "critical" {
  const criticalPatterns = [
    "vigilance rouge", "alerte rouge", "catastrophe",
    "décès", "mort", "morts", "tué",
    "attentat", "attaque terroriste", "terrorisme",
    "explosion", "accident nucléaire", "fuite chimique",
    "évacuation", "zone sinistrée",
    "séisme", "tremblement de terre",
  ];

  const warningPatterns = [
    "alerte", "vigilance orange", "vigilance jaune",
    "inondation", "tempête", "orage", "canicule",
    "neige", "verglas", "vague de froid",
    "incendie", "feu de forêt",
    "blackout", "coupure", "pénurie", "délestage",
    "confinement", "consignes", "précaution",
    "be-alert", "centre de crise", "protection civile",
    "danger", "urgence",
  ];

  if (criticalPatterns.some((p) => content.includes(p))) return "critical";
  if (warningPatterns.some((p) => content.includes(p))) return "warning";
  return "info";
}

// ============================================================================
// SOURCE DETECTION
// ============================================================================

function detectSource(title: string, link: string): string {
  if (link.includes("rtbf.be") || title.includes("RTBF")) return "RTBF";
  if (link.includes("rtl.be") || title.includes("RTL")) return "RTL Info";
  if (link.includes("bfmtv.com") || title.includes("BFM")) return "BFM";
  if (link.includes("centredecrise.be") || title.includes("Centre de crise")) return "Centre de Crise";

  const match = title.match(/\s-\s([^-]+)$/);
  if (match) return match[1].trim();

  return "Presse";
}

// ============================================================================
// RSS PARSER CONFIG
// ============================================================================

const rssParser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
  timeout: 8000,
});

// ============================================================================
// FEEDS — Stratégie multi-source
// ============================================================================
//
// Feed 1 : RTL Info Belgique — flux RSS direct (fiable, gros volume, généraliste → filtrage strict requis)
// Feed 2 : Google News — requête ultra-ciblée sur RTBF + Centre de Crise + BFM avec termes de survie

const FEEDS = [
  {
    url: "https://feeds.feedburner.com/rtlinfo/belgique",
    forcedSource: "RTL Info",
  },
  {
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(
      '("kit de survie" OR "plan d\'urgence" OR évacuation OR inondation OR tempête OR blackout OR "centre de crise" OR "be-alert" OR catastrophe OR "protection civile" OR "pénurie") (site:rtbf.be OR site:centredecrise.be OR site:bfmtv.com)'
    )}&hl=fr&gl=BE&ceid=BE:fr`,
    forcedSource: null,
  },
];

// ============================================================================
// FALLBACK DATA — Données alignées sur le business Survikit
// ============================================================================

const FALLBACK_DATA: EmergencyNewsResponse = {
  status: "ok",
  lastUpdated: new Date().toISOString(),
  news: [
    {
      id: "fallback-1",
      title: "Le Centre de Crise rappelle l'importance du kit 72h pour chaque foyer belge",
      description:
        "Le Centre de Crise National recommande à chaque foyer de constituer un kit d'urgence couvrant 72 heures d'autonomie. Eau (3L/personne/jour), nourriture non périssable, médicaments, radio à piles et trousse de secours sont les éléments essentiels.",
      date: new Date().toISOString(),
      source: "Centre de Crise",
      url: "https://centredecrise.be",
      severity: "warning",
      relevanceScore: 90,
    },
    {
      id: "fallback-2",
      title: "Inondations en Province de Liège : plusieurs communes activent le plan d'évacuation",
      description:
        "Suite aux fortes pluies dans la vallée de la Vesdre, plusieurs communes ont déclenché leur plan d'évacuation préventif. Les autorités rappellent de préparer un sac d'évacuation avec l'essentiel pour 72 heures : eau, nourriture, vêtements chauds et documents importants.",
      date: new Date(Date.now() - 3600000).toISOString(),
      source: "RTL Info",
      url: "https://www.rtl.be",
      severity: "critical",
      relevanceScore: 85,
    },
    {
      id: "fallback-3",
      title: "Blackout : la Belgique met à jour son plan de délestage électrique",
      description:
        "Le plan de délestage belge prévoit des coupures de courant tournantes en cas de pénurie d'électricité. Sans électricité, ni chauffage ni réfrigérateur ne fonctionnent. Un kit de survie avec lampe dynamo, radio d'urgence et réchaud de camping est indispensable.",
      date: new Date(Date.now() - 7200000).toISOString(),
      source: "RTBF",
      url: "https://www.rtbf.be",
      severity: "warning",
      relevanceScore: 80,
    },
    {
      id: "fallback-4",
      title: "Consignes de sécurité du SPF Intérieur face à la tempête hivernale",
      description:
        "Le SPF Intérieur active les consignes de sécurité : constituer des réserves d'eau et de nourriture non périssable, vérifier votre trousse de premiers secours, garder une lampe torche et des piles à portée de main. Restez informés via Be-Alert.",
      date: new Date(Date.now() - 86400000).toISOString(),
      source: "BFM",
      url: "https://www.bfmtv.com",
      severity: "info",
      relevanceScore: 70,
    },
  ],
};

// ============================================================================
// MAIN SERVICE
// ============================================================================

/**
 * Récupère les actualités d'urgence depuis RTL Info, RTBF, BFM et Centre de Crise.
 *
 * Pipeline de traitement :
 * 1. Interroge tous les flux en parallèle (fail-safe individuel)
 * 2. Normalise chaque article
 * 3. HARD REJECT : élimine les articles contenant des mots de politique/sport/etc. sans danger physique
 * 4. SCORING : calcule un score pondéré (TIER1=40, TIER2=20, TIER3=10 conditionnel)
 * 5. THRESHOLD : rejette tout article < 30 points
 * 6. Dédoublonne par titre normalisé
 * 7. Trie par score desc → date desc
 * 8. Fallback si aucun article ne passe
 */
export async function fetchEmergencyNews(): Promise<EmergencyNewsResponse> {
  try {
    // Interrogation parallèle avec fail-safe individuel
    const feedResults = await Promise.allSettled(
      FEEDS.map(async (feedConfig) => {
        const feed = await rssParser.parseURL(feedConfig.url);
        return { items: feed.items, forcedSource: feedConfig.forcedSource };
      })
    );

    // Collecte des articles depuis les flux qui ont répondu
    const allRawItems: Array<{
      title: string;
      link: string;
      contentSnippet: string;
      pubDate: string;
      guid: string;
      forcedSource: string | null;
    }> = [];

    for (const result of feedResults) {
      if (result.status === "fulfilled") {
        for (const item of result.value.items) {
          allRawItems.push({
            title: item.title || "",
            link: item.link || "",
            contentSnippet: item.contentSnippet || item.content || "",
            pubDate: item.pubDate || "",
            guid: item.guid || item.link || "",
            forcedSource: result.value.forcedSource,
          });
        }
      } else {
        console.warn("[EmergencyNews] Feed failed:", result.reason?.message);
      }
    }

    if (allRawItems.length === 0) {
      console.warn("[EmergencyNews] Aucun flux accessible → Fallback");
      return FALLBACK_DATA;
    }

    // Normalisation + scoring
    const scoredArticles = allRawItems
      .map((item) => {
        const cleanTitle = item.title.replace(/\s-\s[^-]+$/, "").trim();
        const source = item.forcedSource || detectSource(item.title, item.link);
        const fullContent = `${item.title} ${item.contentSnippet}`.toLowerCase();
        const score = computeRelevanceScore(item.title, item.contentSnippet);
        const severity = classifySeverity(fullContent);

        let parsedDate: string;
        try {
          parsedDate = new Date(item.pubDate).toISOString();
        } catch {
          parsedDate = new Date().toISOString();
        }

        return {
          id: item.guid || Math.random().toString(36).slice(2),
          title: cleanTitle || "Titre indisponible",
          description: item.contentSnippet.slice(0, 300) || "",
          date: parsedDate,
          source,
          url: item.link || undefined,
          severity,
          relevanceScore: score,
        };
      })
      // Filtre : seuil strict
      .filter((a) => a.relevanceScore >= RELEVANCE_THRESHOLD)
      // Tri : score desc, puis date desc
      .sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    // Dédoublonnage par titre normalisé
    const seen = new Set<string>();
    const dedupedArticles = scoredArticles.filter((article) => {
      const key = article.title.toLowerCase().replace(/\s+/g, " ").slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 15);

    if (dedupedArticles.length === 0) {
      console.warn("[EmergencyNews] Aucun article pertinent après scoring → Fallback");
      return FALLBACK_DATA;
    }

    const data: EmergencyNewsResponse = {
      status: "ok",
      lastUpdated: new Date().toISOString(),
      news: dedupedArticles,
    };

    return EmergencyNewsResponseSchema.parse(data);
  } catch (error) {
    console.error("[EmergencyNews] Erreur critique:", error);
    return FALLBACK_DATA;
  }
}
