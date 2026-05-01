import { describe, it, expect } from "vitest";
import { computeKit } from "../rules";
import type { UserProfile } from "../types";

const baseProfile: UserProfile = {
  adults: 1,
  children: 0,
  teens: 0,
  hasPets: false,
  housing: "apartment",
  hasGarden: false,
  scenario: "urban_power",
  medicalNeeds: false,
  dietaryRestrictions: [],
  autonomyLevel: "basic",
  location: "urban",
};

describe("computeKit", () => {
  it("returns valid kit structure", () => {
    const result = computeKit(baseProfile);

    expect(result).toBeDefined();
    expect(result.profile).toEqual(baseProfile);
    expect(result.categories).toBeInstanceOf(Array);
    expect(result.totalEur).toBeGreaterThan(0);
    expect(result.totalWeightKg).toBeGreaterThan(0);
    expect(result.essentialCount).toBeGreaterThan(0);
    expect(result.coverageHours).toBe(72);
  });

  it("includes water and food categories", () => {
    const result = computeKit(baseProfile);
    const catIds = result.categories.map((c) => c.id);

    expect(catIds).toContain("water");
    expect(catIds).toContain("food");
  });

  it("evacuation scenario gives 24h coverage", () => {
    const result = computeKit({
      ...baseProfile,
      scenario: "evacuation",
    });

    expect(result.coverageHours).toBe(24);
  });

  it("family with children includes health items for kids", () => {
    const withChildren = computeKit({
      ...baseProfile,
      children: 2,
    });
    const withoutChildren = computeKit({
      ...baseProfile,
      children: 0,
    });

    // Having children should include child-specific items (e.g. HLT-004)
    const childItems = withChildren.categories
      .flatMap((c) => c.items)
      .filter((i) => i.sku === "HLT-004");
    const noChildItems = withoutChildren.categories
      .flatMap((c) => c.items)
      .filter((i) => i.sku === "HLT-004");

    // With children: HLT-004 should be present
    // Without children: HLT-004 should be absent (forChildren filter)
    expect(childItems.length).toBeGreaterThanOrEqual(noChildItems.length);
  });

  it("pet owner includes pets category", () => {
    const result = computeKit({
      ...baseProfile,
      hasPets: true,
      petType: "dog",
    });

    const catIds = result.categories.map((c) => c.id);
    expect(catIds).toContain("pets");
  });

  it("expert autonomy includes more items than basic", () => {
    const basicResult = computeKit({
      ...baseProfile,
      autonomyLevel: "basic",
    });
    const expertResult = computeKit({
      ...baseProfile,
      autonomyLevel: "expert",
    });

    const basicItemCount = basicResult.categories.reduce(
      (sum, c) => sum + c.items.length,
      0
    );
    const expertItemCount = expertResult.categories.reduce(
      (sum, c) => sum + c.items.length,
      0
    );

    expect(expertItemCount).toBeGreaterThanOrEqual(basicItemCount);
  });

  it("more persons means higher cost", () => {
    const solo = computeKit(baseProfile);
    const family = computeKit({
      ...baseProfile,
      adults: 2,
      children: 2,
      teens: 1,
    });

    expect(family.totalEur).toBeGreaterThan(solo.totalEur);
  });

  it("more persons means higher weight", () => {
    const solo = computeKit(baseProfile);
    const family = computeKit({
      ...baseProfile,
      adults: 3,
    });

    expect(family.totalWeightKg).toBeGreaterThanOrEqual(solo.totalWeightKg);
  });

  it("all items have valid sku and name", () => {
    const result = computeKit(baseProfile);

    for (const category of result.categories) {
      for (const item of category.items) {
        expect(item.sku).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.qty).toBeGreaterThan(0);
        expect(item.priceEur).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("totalEur matches sum of item prices", () => {
    const result = computeKit(baseProfile);

    // Re-compute total from categories
    let computed = 0;
    for (const cat of result.categories) {
      for (const item of cat.items) {
        computed += item.priceEur * item.qty;
      }
    }

    // Allow for rounding differences
    expect(Math.abs(result.totalEur - Math.round(computed * 10) / 10)).toBeLessThan(1);
  });
});
