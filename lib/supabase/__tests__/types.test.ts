import { describe, it, expect } from "vitest";
import type { Database, DbKit, DbKitInsert, DbLead, DbLeadInsert } from "../types";

/**
 * Type-level tests — these verify that our Database types are structurally sound.
 * If TypeScript compilation succeeds, the types are valid.
 */
describe("Database types", () => {
  it("DbKit has all required fields", () => {
    const kit: DbKit = {
      id: "test-uuid",
      user_id: null,
      share_id: "abc12345",
      items: {},
      scenario: "urban_power",
      total_eur: 100,
      total_weight_kg: 10,
      essential_count: 5,
      coverage_hours: 72,
      persons: 2,
      session_id: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    expect(kit.id).toBe("test-uuid");
    expect(kit.share_id).toBe("abc12345");
  });

  it("DbKitInsert has only required insert fields", () => {
    // items is the only required field for insert
    const insert: DbKitInsert = {
      items: { categories: [], totalEur: 0 },
    };

    expect(insert.items).toBeDefined();
    expect(insert.user_id).toBeUndefined();
  });

  it("DbLeadInsert requires email and consent", () => {
    const lead: DbLeadInsert = {
      email: "test@example.be",
      consent_given: true,
    };

    expect(lead.email).toBe("test@example.be");
    expect(lead.consent_given).toBe(true);
  });

  it("Database type maps tables correctly", () => {
    // Type-level assertion: ensure Database.public.Tables has the expected keys
    type Tables = Database["public"]["Tables"];
    type HasProfiles = Tables["profiles"];
    type HasKits = Tables["kits"];
    type HasLeads = Tables["leads"];

    // Runtime assertion (the types are enforced at compile time)
    const tables: (keyof Database["public"]["Tables"])[] = [
      "profiles",
      "kits",
      "leads",
    ];
    expect(tables).toHaveLength(3);
  });
});
