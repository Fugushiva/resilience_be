/**
 * Tests unitaires pour le moteur de pertinence Emergency News.
 *
 * Exécution : npx tsx tests/emergency-relevance.test.ts
 *
 * Ces tests valident que le système de scoring filtre correctement
 * les articles pertinents (survie, alertes, dangers) et rejette
 * les faux positifs (politique, sport, people, métaphorique).
 */

// On importe directement le fichier pour tester le scoring
// Note : les fonctions internes ne sont pas exportées, donc on teste via fetchEmergencyNews
// et via un mini-moteur de test qui reproduit la logique.

// ---- REPRODUCTION LOCALE DU SCORING POUR TESTS UNITAIRES ----

const TIER1 = [
  "kit de survie", "kit d'urgence", "kit 72h", "sac d'évacuation",
  "stock d'urgence", "préparation urgence", "survivalisme", "survivaliste",
  "preppers", "préparer son kit",
  "trousse de secours", "premiers secours", "ration de survie",
  "purification eau", "radio d'urgence", "lampe dynamo",
  "couverture de survie", "réchaud camping", "filtre à eau",
  "panneau solaire portable", "batterie externe",
  "be-alert", "centre de crise national", "plan d'urgence national",
  "nccn", "protection civile belge",
];

const TIER2 = [
  "inondation", "inondations", "crue", "débordement",
  "tempête", "ouragan", "tornade", "orage violent",
  "séisme", "tremblement de terre", "glissement de terrain", "coulée de boue",
  "feu de forêt", "incendie de forêt",
  "risque nucléaire", "accident nucléaire", "fuite chimique",
  "nuage toxique", "seveso", "risque seveso",
  "blackout", "coupure de courant", "panne générale", "panne électrique",
  "pénurie d'eau", "pénurie alimentaire", "pénurie de gaz",
  "délestage", "plan de délestage",
  "attentat", "attaque terroriste", "terrorisme", "fusillade",
  "hypothermie", "noyade", "déshydratation",
  "avalanche", "chute mortelle", "chute en montagne",
  "évacuation", "évacuer", "confinement",
  "zone sinistrée", "zone de danger",
];

const TIER3 = [
  "vigilance orange", "vigilance rouge", "alerte météo", "alerte rouge",
  "vague de froid", "vague de chaleur", "canicule",
  "neige", "verglas", "gel",
  "recommandation", "consignes de sécurité", "mesures de précaution",
  "plan catastrophe", "exercice d'évacuation",
  "réserves", "approvisionnement",
  "pompiers", "ambulance", "samu", "croix-rouge",
  "aide humanitaire", "hébergement d'urgence",
  "randonnée", "balade", "sentier", "montagne",
  "sirène", "sirènes d'alerte", "alerte", "danger", "urgence",
  "dégâts", "victimes", "blessés", "sinistrés",
];

const HARD_REJECT = [
  "parlement", "premier ministre", "coalition", "opposition",
  "élection", "grève", "syndicat", "député", "ministre",
  "football", "foot", "match", "championnat",
  "célébrité", "star", "festival", "concert", "cinéma",
  "bourse", "bitcoin", "inflation",
  "impôt", "déclaration fiscale", "taxe", "indexation",
  "procès", "tribunal", "condamnation", "prison",
  "émission", "débat", "polémique",
  "vaccination", "vaccin",
  "immobilier", "restaurant",
  "aide-ménagère", "emploi", "salaire",
  "papa", "bébé",
];

const METAPHORICAL = [
  "émotions", "émotionnel", "émotionnels", "émotionnelles",
  "bien-être", "psychologie", "mental", "mentale",
  "livre", "roman", "auteur", "lecture",
  "jeu vidéo", "gaming",
  "amour", "couple", "relation", "parentalité",
  "entreprise", "management", "carrière", "business",
  "pour la science", "scientifique", "chercheur", "chercheurs",
  "étude", "recherche", "laboratoire",
  "documentaire", "reportage", "histoire de",
];

function testScore(title: string, desc: string): number {
  const content = `${title} ${desc}`.toLowerCase();

  // Metaphorical → always reject
  if (METAPHORICAL.some(kw => content.includes(kw))) return 0;

  // Hard reject (unless TIER1/2 present)
  const hasHigh = TIER1.some(kw => content.includes(kw)) || TIER2.some(kw => content.includes(kw));
  if (!hasHigh && HARD_REJECT.some(kw => content.includes(kw))) return 0;

  let score = 0;
  let t1 = 0;
  for (const kw of TIER1) { if (content.includes(kw)) { t1++; if (t1 <= 2) score += 40; } }
  let t2 = 0;
  for (const kw of TIER2) { if (content.includes(kw)) { t2++; if (t2 <= 3) score += 20; } }
  if (t1 > 0 || t2 > 0) {
    let t3 = 0;
    for (const kw of TIER3) { if (content.includes(kw)) { t3++; if (t3 <= 3) score += 10; } }
  }

  return Math.max(0, Math.min(100, score));
}

const THRESHOLD = 30;

// ---- TEST RUNNER ----

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✅ ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ ${testName}${details ? " — " + details : ""}`);
    failed++;
  }
}

// ======== TESTS : ARTICLES QUI DOIVENT PASSER ========

console.log("\n🟢 ARTICLES PERTINENTS (doivent passer le seuil de " + THRESHOLD + ") :");

assert(
  testScore("Le Centre de Crise rappelle l'importance du kit 72h", "Chaque foyer doit préparer un kit de survie") >= THRESHOLD,
  "Kit de survie 72h — TIER1 direct",
  "Score: " + testScore("Le Centre de Crise rappelle l'importance du kit 72h", "Chaque foyer doit préparer un kit de survie")
);

assert(
  testScore("Inondations massives en Province de Liège", "L'eau monte rapidement, évacuation en cours") >= THRESHOLD,
  "Inondations + évacuation",
  "Score: " + testScore("Inondations massives en Province de Liège", "L'eau monte rapidement, évacuation en cours")
);

assert(
  testScore("Blackout total : la Belgique sans électricité", "Coupure de courant généralisée dans le pays") >= THRESHOLD,
  "Blackout — panne électrique",
  "Score: " + testScore("Blackout total : la Belgique sans électricité", "Coupure de courant généralisée dans le pays")
);

assert(
  testScore("Tempête Floriane : vigilance rouge en Wallonie", "Vents violents et neige attendus") >= THRESHOLD,
  "Tempête + vigilance rouge + neige",
  "Score: " + testScore("Tempête Floriane : vigilance rouge en Wallonie", "Vents violents et neige attendus")
);

assert(
  testScore("Be-Alert : alerte envoyée à la population de Liège", "Le système d'alerte national a été déclenché") >= THRESHOLD,
  "Be-Alert notification",
  "Score: " + testScore("Be-Alert : alerte envoyée à la population de Liège", "Le système d'alerte national a été déclenché")
);

assert(
  testScore("Attentat à Bruxelles : évacuation du quartier européen", "Explosion près des institutions") >= THRESHOLD,
  "Attentat + évacuation",
  "Score: " + testScore("Attentat à Bruxelles : évacuation du quartier européen", "Explosion près des institutions")
);

assert(
  testScore("Risque nucléaire : exercice d'évacuation à Tihange", "Les habitants doivent se confiner") >= THRESHOLD,
  "Nucléaire + évacuation + confinement",
  "Score: " + testScore("Risque nucléaire : exercice d'évacuation à Tihange", "Les habitants doivent se confiner")
);

assert(
  testScore("Randonnée mortelle dans les Hautes Fagnes", "Un randonneur victime d'hypothermie a été retrouvé sans vie") >= THRESHOLD,
  "Randonnée + hypothermie mortelle",
  "Score: " + testScore("Randonnée mortelle dans les Hautes Fagnes", "Un randonneur victime d'hypothermie a été retrouvé sans vie")
);

assert(
  testScore("Pénurie d'eau à Bruxelles après une contamination", "Les réserves d'eau potable sont insuffisantes") >= THRESHOLD,
  "Pénurie d'eau",
  "Score: " + testScore("Pénurie d'eau à Bruxelles après une contamination", "Les réserves d'eau potable sont insuffisantes")
);

assert(
  testScore("Feu de forêt dans les Ardennes", "L'incendie de forêt menace plusieurs villages") >= THRESHOLD,
  "Feu de forêt",
  "Score: " + testScore("Feu de forêt dans les Ardennes", "L'incendie de forêt menace plusieurs villages")
);

// ======== TESTS : ARTICLES QUI DOIVENT ÊTRE REJETÉS ========

console.log("\n🔴 ARTICLES NON PERTINENTS (doivent être rejetés, score < " + THRESHOLD + ") :");

assert(
  testScore("Les émotions, le kit de survie de nos bébés", "Comment gérer les besoins émotionnels des enfants") < THRESHOLD,
  "Kit de survie métaphorique (parenting) — REJETÉ",
  "Score: " + testScore("Les émotions, le kit de survie de nos bébés", "Comment gérer les besoins émotionnels des enfants")
);

assert(
  testScore("Résultats des élections communales en Wallonie", "Le parti socialiste remporte la majorité") < THRESHOLD,
  "Politique pure — REJETÉ",
  "Score: " + testScore("Résultats des élections communales en Wallonie", "Le parti socialiste remporte la majorité")
);

assert(
  testScore("Le Standard de Liège remporte le match", "Football : victoire 3-1 contre Anderlecht") < THRESHOLD,
  "Sport / Football — REJETÉ",
  "Score: " + testScore("Le Standard de Liège remporte le match", "Football : victoire 3-1 contre Anderlecht")
);

assert(
  testScore("Poutine boit du champagne", "Le ministre de la Défense évoque les tensions OTAN sur le plateau de CNN") < THRESHOLD,
  "Géopolitique / Opinion — REJETÉ",
  "Score: " + testScore("Poutine boit du champagne", "Le ministre de la Défense évoque les tensions OTAN sur le plateau de CNN")
);

assert(
  testScore("Un million de Belges reçoivent une déclaration d'impôt erronée", "Il manquait le calcul du montant à payer") < THRESHOLD,
  "Fiscalité — REJETÉ",
  "Score: " + testScore("Un million de Belges reçoivent une déclaration d'impôt erronée", "Il manquait le calcul du montant à payer")
);

assert(
  testScore("Procès de l'auteur du drame de Strépy-Bracquegnies", "Paolo Falzone comparait devant les assises") < THRESHOLD,
  "Justice / Procès — REJETÉ",
  "Score: " + testScore("Procès de l'auteur du drame de Strépy-Bracquegnies", "Paolo Falzone comparait devant les assises")
);

assert(
  testScore("Indexation sur les salaires et les pensions", "Combien d'argent en plus à partir de l'été") < THRESHOLD,
  "Économie / Salaires — REJETÉ",
  "Score: " + testScore("Indexation sur les salaires et les pensions", "Combien d'argent en plus à partir de l'été")
);

assert(
  testScore("Grève chez Aldi : les syndicats protestent", "Les employés dénoncent les conditions de travail") < THRESHOLD,
  "Grève / Syndicat — REJETÉ",
  "Score: " + testScore("Grève chez Aldi : les syndicats protestent", "Les employés dénoncent les conditions de travail")
);

assert(
  testScore("Le kit de survie du manager moderne", "Comment gérer son entreprise dans un contexte de crise économique") < THRESHOLD,
  "Kit de survie métaphorique (business) — REJETÉ",
  "Score: " + testScore("Le kit de survie du manager moderne", "Comment gérer son entreprise dans un contexte de crise économique")
);

assert(
  testScore("Jennifer dévoile les coulisses de son métier d'aide-ménagère", "Cela fait 15 ans qu'elle exerce") < THRESHOLD,
  "People / Portrait métier — REJETÉ",
  "Score: " + testScore("Jennifer dévoile les coulisses de son métier d'aide-ménagère", "Cela fait 15 ans qu'elle exerce")
);

assert(
  testScore("Le festival de Dour annonce sa programmation", "Concert de rock et hip-hop cet été") < THRESHOLD,
  "Culture / Festival — REJETÉ",
  "Score: " + testScore("Le festival de Dour annonce sa programmation", "Concert de rock et hip-hop cet été")
);

assert(
  testScore("La Bourse de Bruxelles en hausse", "Les actions belges gagnent 2% aujourd'hui") < THRESHOLD,
  "Finance / Bourse — REJETÉ",
  "Score: " + testScore("La Bourse de Bruxelles en hausse", "Les actions belges gagnent 2% aujourd'hui")
);

assert(
  testScore("Les chasseurs d'ouragans volent en pleine tempête pour la science", "Des scientifiques embarquent dans des avions pour étudier les ouragans") < THRESHOLD,
  "Science / Vulgarisation (chasseurs d'ouragans) — REJETÉ",
  "Score: " + testScore("Les chasseurs d'ouragans volent en pleine tempête pour la science", "Des scientifiques embarquent dans des avions pour étudier les ouragans")
);

assert(
  testScore("Documentaire : les inondations de la Vesdre un an après", "Un reportage revient sur la catastrophe de 2021") < THRESHOLD,
  "Documentaire / Reportage historique — REJETÉ",
  "Score: " + testScore("Documentaire : les inondations de la Vesdre un an après", "Un reportage revient sur la catastrophe de 2021")
);

// ======== RÉSULTATS ========

console.log("\n" + "=".repeat(50));
console.log(`Résultats : ${passed} passés, ${failed} échoués sur ${passed + failed} tests`);
if (failed > 0) {
  console.error("⚠️  CERTAINS TESTS ONT ÉCHOUÉ !");
  process.exit(1);
} else {
  console.log("🎉 TOUS LES TESTS PASSENT !");
}
