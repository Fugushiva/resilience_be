import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────

// Build a fluent mock chain that supports any call ordering.
// Every method returns the chain so .insert().select().single() all work.
const mockSingle = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn();

function resetChain() {
  const chain = {
    insert: mockInsert,
    update: mockUpdate,
    select: mockSelect,
    eq: mockEq,
    single: mockSingle,
    order: mockOrder,
  };

  mockSingle.mockReset();
  mockOrder.mockReset().mockReturnValue(Promise.resolve({ data: [], error: null }));
  mockEq.mockReset().mockReturnValue(chain);
  mockSelect.mockReset().mockReturnValue(chain);
  mockInsert.mockReset().mockReturnValue(chain);
  mockUpdate.mockReset().mockReturnValue(chain);
  mockFrom.mockReset().mockImplementation(() => chain);
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: () => [],
    set: vi.fn(),
  })),
}));

import {
  saveKit,
  updateKit,
  getKit,
  getKitByShareId,
  captureLead,
  getKitsBySession,
} from "../actions";
import type { KitResult, UserProfile } from "@/lib/kit/types";

// ─── Test Data ───────────────────────────────────────────────

const mockProfile: UserProfile = {
  adults: 2,
  children: 1,
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

const mockKitResult: KitResult = {
  profile: mockProfile,
  categories: [
    {
      id: "water",
      label: "Eau",
      items: [
        {
          sku: "WTR-001",
          name: "Pack eau 6×1.5L",
          qty: 1,
          priceEur: 3.5,
          essential: true,
        },
      ],
    },
  ],
  totalEur: 45.5,
  totalWeightKg: 12.3,
  essentialCount: 8,
  coverageHours: 72,
};

const mockDbKit = {
  id: "kit-uuid-123",
  user_id: null,
  share_id: "abc12345def67890",
  items: mockKitResult as unknown as Record<string, unknown>,
  scenario: "urban_power",
  total_eur: 45.5,
  total_weight_kg: 12.3,
  essential_count: 8,
  coverage_hours: 72,
  persons: 3,
  session_id: "session-123",
  created_at: "2026-04-30T10:00:00Z",
  updated_at: "2026-04-30T10:00:00Z",
};

// ─── Tests ───────────────────────────────────────────────────

describe("saveKit", () => {
  beforeEach(() => {
    resetChain();
  });

  it("should insert a kit and return the saved row", async () => {
    mockSingle.mockResolvedValueOnce({ data: mockDbKit, error: null });

    const result = await saveKit(mockKitResult, "session-123");

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data!.share_id).toBe("abc12345def67890");
    expect(mockFrom).toHaveBeenCalledWith("kits");
  });

  it("should return error on Supabase failure", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "DB connection failed", code: "500" },
    });

    const result = await saveKit(mockKitResult);

    expect(result.success).toBe(false);
    expect(result.error).toBe("DB connection failed");
  });

  it("should include session_id when provided", async () => {
    mockSingle.mockResolvedValueOnce({ data: mockDbKit, error: null });

    await saveKit(mockKitResult, "my-session-id");

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        session_id: "my-session-id",
      })
    );
  });

  it("should calculate persons from profile", async () => {
    mockSingle.mockResolvedValueOnce({ data: mockDbKit, error: null });

    await saveKit(mockKitResult);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        persons: 3, // 2 adults + 1 child + 0 teens
      })
    );
  });
});

describe("updateKit", () => {
  beforeEach(() => {
    resetChain();
  });

  it("should update an existing kit", async () => {
    mockSingle.mockResolvedValueOnce({ data: mockDbKit, error: null });

    const result = await updateKit("kit-uuid-123", mockKitResult);

    expect(result.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("kits");
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should return error when kit not found", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "Kit not found", code: "PGRST116" },
    });

    const result = await updateKit("nonexistent-id", mockKitResult);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Kit not found");
  });
});

describe("getKit", () => {
  beforeEach(() => {
    resetChain();
  });

  it("should fetch a kit by ID", async () => {
    mockSingle.mockResolvedValueOnce({ data: mockDbKit, error: null });

    const result = await getKit("kit-uuid-123");

    expect(result.success).toBe(true);
    expect(result.data!.id).toBe("kit-uuid-123");
  });

  it("should return error for missing kit", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found", code: "PGRST116" },
    });

    const result = await getKit("missing-id");

    expect(result.success).toBe(false);
  });
});

describe("getKitByShareId", () => {
  beforeEach(() => {
    resetChain();
  });

  it("should fetch a kit by share_id", async () => {
    mockSingle.mockResolvedValueOnce({ data: mockDbKit, error: null });

    const result = await getKitByShareId("abc12345def67890");

    expect(result.success).toBe(true);
    expect(result.data!.share_id).toBe("abc12345def67890");
  });

  it("should reject short share IDs", async () => {
    const result = await getKitByShareId("abc");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Share ID invalide");
  });

  it("should reject empty share IDs", async () => {
    const result = await getKitByShareId("");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Share ID invalide");
  });

  it("should return friendly error for not found", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found", code: "PGRST116" },
    });

    const result = await getKitByShareId("nonexistent1234567");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Kit introuvable");
  });
});

describe("captureLead", () => {
  beforeEach(() => {
    resetChain();
  });

  it("should capture a valid lead with consent", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "lead-uuid-1" },
      error: null,
    });

    const formData = new FormData();
    formData.set("email", "test@example.be");
    formData.set("consent", "true");

    const result = await captureLead(formData);

    expect(result.success).toBe(true);
    expect(result.data!.id).toBe("lead-uuid-1");
  });

  it("should reject without consent (GDPR)", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.be");
    formData.set("consent", "false");

    const result = await captureLead(formData);

    expect(result.success).toBe(false);
    expect(result.error).toContain("consentement");
  });

  it("should reject invalid email", async () => {
    const formData = new FormData();
    formData.set("email", "not-an-email");
    formData.set("consent", "true");

    const result = await captureLead(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should reject missing email", async () => {
    const formData = new FormData();
    formData.set("consent", "true");

    const result = await captureLead(formData);

    expect(result.success).toBe(false);
  });

  it("should pass kit_id when provided as valid UUID", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "lead-uuid-2" },
      error: null,
    });

    const formData = new FormData();
    formData.set("email", "test@example.be");
    formData.set("kit_id", "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
    formData.set("consent", "true");

    const result = await captureLead(formData);

    expect(result.success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        kit_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      })
    );
  });

  it("should default source to 'kit_result'", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "lead-uuid-3" },
      error: null,
    });

    const formData = new FormData();
    formData.set("email", "test@example.be");
    formData.set("consent", "true");

    await captureLead(formData);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "kit_result",
      })
    );
  });
});

describe("getKitsBySession", () => {
  beforeEach(() => {
    resetChain();
  });

  it("should fetch kits by session ID", async () => {
    mockOrder.mockReturnValueOnce(
      Promise.resolve({ data: [mockDbKit], error: null })
    );

    const result = await getKitsBySession("session-123");

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it("should return empty array for no kits", async () => {
    mockOrder.mockReturnValueOnce(
      Promise.resolve({ data: [], error: null })
    );

    const result = await getKitsBySession("empty-session");

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(0);
  });
});
