import {
  KIT_CATALOG,
  KitItem,
  CATEGORY_LABELS,
} from "./catalog";
import type {
  UserProfile,
  KitResult,
  KitResultCategory,
  KitResultItem,
} from "./types";

/**
 * Deterministic kit generator.
 * No LLM — pure rule engine, 0 latency, 0 API cost.
 * Rules are based on Belgian NCCN / EU Commission 72h guidelines (April 2026).
 */
export function computeKit(profile: UserProfile): KitResult {
  const totalPersons =
    profile.adults + profile.children + profile.teens;
  const scenarioTag = mapScenarioToTag(profile.scenario);

  // ─── Filter catalog by scenario tags ─────────────────────────
  const eligible = KIT_CATALOG.filter((item) => {
    if (!item.tags.includes(scenarioTag) && !item.tags.includes("all"))
      return false;
    if (item.forChildren && profile.children === 0) return false;
    if (item.forPets && !profile.hasPets) return false;
    if (item.forMedical && !profile.medicalNeeds) return false;
    return true;
  });

  // ─── Pick items based on autonomy level ──────────────────────
  const selected = eligible.filter((item) => {
    if (item.essential) return true;
    if (profile.autonomyLevel === "basic") return false;
    if (profile.autonomyLevel === "prepared") return true;
    return true; // expert: all
  });

  // ─── Calculate quantities ─────────────────────────────────────
  const itemsWithQty = selected.map((item) =>
    applyQuantityRules(item, profile, totalPersons)
  );

  // ─── Group by category ───────────────────────────────────────
  const grouped = new Map<string, KitResultItem[]>();
  for (const { item, qty } of itemsWithQty) {
    if (!grouped.has(item.category)) {
      grouped.set(item.category, []);
    }
    grouped.get(item.category)!.push({
      sku: item.sku,
      name: item.name,
      qty,
      priceEur: item.priceEur,
      essential: item.essential,
      amazonUrl: item.amazonUrl,
      decathlonUrl: item.decathlonUrl,
    });
  }

  // ─── Build categories array ───────────────────────────────────
  const categoryOrder = [
    "water",
    "food",
    "light",
    "communication",
    "health",
    "shelter",
    "tools",
    "hygiene",
    "documents",
    "cash",
    "kids",
    "pets",
  ];

  const categories: KitResultCategory[] = categoryOrder
    .filter((cat) => grouped.has(cat))
    .map((cat) => ({
      id: cat,
      label: CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS],
      items: grouped.get(cat)!,
    }));

  // ─── Totals ───────────────────────────────────────────────────
  const allItems = itemsWithQty;
  const totalEur = allItems.reduce(
    (sum, { item, qty }) => sum + item.priceEur * qty,
    0
  );
  const totalWeightKg = allItems.reduce(
    (sum, { item, qty }) => sum + item.weightKg * qty,
    0
  );
  const essentialCount = allItems.filter(({ item }) => item.essential).length;
  const coverageHours = profile.scenario === "evacuation" ? 24 : 72;

  return {
    profile,
    categories,
    totalEur: Math.round(totalEur * 10) / 10,
    totalWeightKg: Math.round(totalWeightKg * 10) / 10,
    essentialCount,
    coverageHours,
  };
}

function applyQuantityRules(
  item: KitItem,
  profile: UserProfile,
  totalPersons: number
): { item: KitItem; qty: number } {
  let qty = 1;

  // Water rules: 3L/person/day × 3 days
  if (item.sku === "WTR-001") {
    // 1.5L bottles: 6 per person per 3 days (3L/day × 3 days = 9L, ~6 × 1.5L)
    qty = Math.ceil((totalPersons * 9) / 9);
    // But for evacuation, 1 pack is enough (portable water + filters)
    if (profile.scenario === "evacuation") qty = 1;
  }

  if (item.sku === "WTR-002") {
    qty = Math.ceil(totalPersons / 5) + 1;
  }

  // Food bars: 1 box per person per 3 days
  if (item.sku === "FD-001") {
    qty = totalPersons;
  }

  if (item.sku === "FD-003") {
    qty = Math.ceil(totalPersons * 1.5);
  }

  // Children specific
  if (item.sku === "HLT-004") {
    qty = Math.ceil(profile.children / 2) + 1;
  }

  // Head torches: 1 per adult + 1 spare
  if (item.sku === "LT-001") {
    qty = Math.min(profile.adults + Math.ceil(profile.teens / 2) + 1, 4);
  }

  // Blankets: 1 per person
  if (item.sku === "HLT-002") {
    qty = Math.min(totalPersons, 6);
  }

  // Masks: 1 per person × 2 days
  if (item.sku === "HLT-006") {
    qty = Math.ceil(totalPersons * 2 / 10);
  }

  return { item, qty };
}

function mapScenarioToTag(scenario: UserProfile["scenario"]): string {
  const map: Record<UserProfile["scenario"], string> = {
    urban_power: "urban",
    evacuation: "evacuation",
    mountain: "mountain",
    forest: "forest",
    general: "urban",
  };
  return map[scenario];
}
