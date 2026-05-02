/**
 * lib/seo/keywords.ts
 * Champs lexicaux SEO structurés par page.
 *
 * Registre : "sécurité civile" + "sérénité familiale"
 * INTERDIT : jargon survivaliste extrême, sensationnalisme, "collapse", "armageddon"
 *
 * Sources sémantiques :
 *  - Recommandations NCCN belge (Centre de Crise National)
 *  - Guide de Résilience Familiale 72h — chapitres I à VIII
 *  - BE-Alert (système d'alerte population belge)
 *  - SPF Intérieur / Protection Civile
 */

// ─── Landing page (/) ─────────────────────────────────────────────────────────

export const KEYWORDS_HOME = [
  // Requêtes primaires haute intention
  "kit urgence Belgique",
  "kit survie 72h Belgique",
  "kit urgence 72h Belgique",
  "préparation urgence famille",
  "préparation urgence famille Belgique",
  "kit d'urgence personnalisé",
  "résilience familiale Belgique",
  // Requêtes institutionnelles (EEAT)
  "Centre de Crise National belge",
  "NCCN kit urgence",
  "recommandations NCCN kit urgence",
  "BE-Alert préparation",
  "BE-Alert préparation urgence famille",
  "recommandations SPF Intérieur",
  "SPF Intérieur kit urgence citoyen",
  "Centre de Crise National Belgique conseils",
  // Requêtes sérénité / action
  "préparer sa famille aux urgences",
  "comment préparer sa famille aux catastrophes naturelles",
  "sécurité civile famille",
  "protection civile Belgique",
  "autonomie 72 heures",
  "liste kit urgence belge",
  // Longue traîne
  "que mettre dans un kit d'urgence",
  "combien de litres d'eau par personne kit survie",
  "combien d'eau stocker urgence par personne",
  "que faire en cas de panne de courant hiver Belgique",
  "inondation Belgique que faire préparer famille",
  "communication sans réseau téléphone urgence famille",
  "kit survie famille Bruxelles",
  "kit survie famille Liège",
  "kit survie famille Gand",
  "liste préparation urgence gouvernement belge",
] as const;

// ─── Configurateur (/configurer) ──────────────────────────────────────────────

export const KEYWORDS_CONFIGURATOR = [
  "configurateur kit urgence",
  "créer kit urgence personnalisé",
  "liste personnalisée kit survie 72h",
  "outil préparation urgence famille",
  "diagnostic préparation civile",
  "kit urgence adapté famille belgique",
  "kit urgence appartement",
  "kit urgence maison",
  "kit urgence enfants",
  "kit urgence animal de compagnie",
  "kit urgence besoins médicaux",
  "étapes préparation urgence",
  "scénario panne électrique Belgique",
  "scénario évacuation d'urgence",
  "scénario inondation Belgique",
] as const;

// ─── Page résultat kit (/kit) ─────────────────────────────────────────────────

export const KEYWORDS_KIT = [
  "mon kit urgence personnalisé",
  "résultat diagnostic kit survie",
  "liste articles kit 72h",
  "kit urgence prêt à commander",
  "acheter kit survie Belgique",
  "articles essentiels kit urgence famille",
  "budget kit survie famille",
] as const;

// ─── Guide PDF Premium (/guide) ───────────────────────────────────────────────

export const KEYWORDS_GUIDE = [
  // Produit
  "guide résilience familiale PDF",
  "guide préparation urgence Belgique PDF",
  "guide kit survie famille PDF",
  "checklist kit urgence imprimable",
  // Mots-clés primaires haute intention (analyse SEO)
  "kit urgence 72h Belgique",
  "préparation urgence famille Belgique",
  "résilience familiale Belgique",
  // Contenu chapitres
  "plan familial urgence Belgique",
  "contacts d'urgence Belgique",
  "numéros d'urgence Belgique liste",
  "plan évacuation maison",
  "réserves eau alimentation urgence",
  "premiers secours kit famille",
  "communication urgence famille",
  "documents importants urgence",
  "argent liquide urgence",
  "gestion stress urgence famille",
  // Longue traîne commerciale (analyse SEO)
  "kit urgence 72h contenu liste imprimable",
  "acheter guide préparation catastrophe Belgique PDF",
  "plan évacuation famille Belgique modèle",
  "acheter guide survie famille Belgique",
  "télécharger guide kit urgence",
  "guide numérique préparation 72h",
] as const;
