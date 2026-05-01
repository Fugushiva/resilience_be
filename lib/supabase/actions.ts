"use server";

import { z } from "zod";
import { createClient } from "./server";
import type { DbKit } from "./types";
import type { KitResult } from "@/lib/kit/types";

// ─── Validation Schemas ──────────────────────────────────────

const SaveKitSchema = z.object({
  items: z.record(z.string(), z.unknown()),
  scenario: z.string().nullable().optional(),
  total_eur: z.number().nullable().optional(),
  total_weight_kg: z.number().nullable().optional(),
  essential_count: z.number().int().nullable().optional(),
  coverage_hours: z.number().int().nullable().optional(),
  persons: z.number().int().nullable().optional(),
  session_id: z.string().nullable().optional(),
});

const CaptureLeadSchema = z.object({
  email: z.string().email(),
  kit_id: z.string().uuid().nullable().optional(),
  source: z.string().optional().default("kit_result"),
  consent_given: z.boolean(),
});

// ─── Action Result Types ─────────────────────────────────────

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Save Kit ────────────────────────────────────────────────

/**
 * Persist a computed kit result to Supabase.
 * Returns the saved kit row including the generated share_id.
 */
export async function saveKit(
  kitResult: KitResult,
  sessionId?: string
): Promise<ActionResult<DbKit>> {
  try {
    const supabase = await createClient();

    const profile = kitResult.profile;
    const persons = profile.adults + profile.children + profile.teens;

    const payload = {
      items: kitResult as unknown as Record<string, unknown>,
      scenario: profile.scenario,
      total_eur: kitResult.totalEur,
      total_weight_kg: kitResult.totalWeightKg,
      essential_count: kitResult.essentialCount,
      coverage_hours: kitResult.coverageHours,
      persons,
      session_id: sessionId ?? null,
    };

    // Validate server-side
    const validated = SaveKitSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: `Validation failed: ${validated.error.issues.map((i) => i.message).join(", ")}`,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("kits")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("[saveKit] Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as DbKit };
  } catch (err) {
    console.error("[saveKit] Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}

// ─── Update Kit ──────────────────────────────────────────────

/**
 * Update an existing kit with new result data.
 */
export async function updateKit(
  kitId: string,
  kitResult: KitResult
): Promise<ActionResult<DbKit>> {
  try {
    const supabase = await createClient();

    const updatePayload = {
      items: kitResult as unknown as Record<string, unknown>,
      scenario: kitResult.profile.scenario,
      total_eur: kitResult.totalEur,
      total_weight_kg: kitResult.totalWeightKg,
      essential_count: kitResult.essentialCount,
      coverage_hours: kitResult.coverageHours,
      persons:
        kitResult.profile.adults +
        kitResult.profile.children +
        kitResult.profile.teens,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("kits")
      .update(updatePayload)
      .eq("id", kitId)
      .select()
      .single();

    if (error) {
      console.error("[updateKit] Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as DbKit };
  } catch (err) {
    console.error("[updateKit] Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}

// ─── Get Kit by ID ───────────────────────────────────────────

export async function getKit(
  kitId: string
): Promise<ActionResult<DbKit>> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("kits")
      .select()
      .eq("id", kitId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as DbKit };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}

// ─── Get Kit by Share ID ─────────────────────────────────────

/**
 * Fetch a kit by its public share_id slug.
 * Used for the /kit/[shareId] public sharing route.
 */
export async function getKitByShareId(
  shareId: string
): Promise<ActionResult<DbKit>> {
  try {
    if (!shareId || shareId.length < 8) {
      return { success: false, error: "Share ID invalide" };
    }

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("kits")
      .select()
      .eq("share_id", shareId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "Kit introuvable" };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: data as DbKit };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}

// ─── Capture Lead ────────────────────────────────────────────

/**
 * Capture an email lead, optionally linked to a kit.
 * Validates consent for Belgian GDPR compliance.
 */
export async function captureLead(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const raw = {
      email: formData.get("email"),
      kit_id: formData.get("kit_id") || null,
      source: formData.get("source") || "kit_result",
      consent_given: formData.get("consent") === "true",
    };

    const validated = CaptureLeadSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((i) => i.message).join(", "),
      };
    }

    if (!validated.data.consent_given) {
      return {
        success: false,
        error: "Le consentement est requis (RGPD)",
      };
    }

    const supabase = await createClient();

    const leadPayload = {
      email: validated.data.email,
      kit_id: validated.data.kit_id ?? null,
      source: validated.data.source,
      consent_given: validated.data.consent_given,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("leads")
      .insert(leadPayload)
      .select("id")
      .single();

    if (error) {
      console.error("[captureLead] Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error("[captureLead] Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}

// ─── Get Kits by Session ─────────────────────────────────────

/**
 * Fetch all kits created in a given anonymous session.
 * Useful for restoring state on page reload before auth.
 */
export async function getKitsBySession(
  sessionId: string
): Promise<ActionResult<DbKit[]>> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("kits")
      .select()
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data ?? []) as DbKit[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}
