/**
 * Consent storage utilities — localStorage with 6-month expiry
 * Conforme APD Belgique : consentement libre, éclairé, spécifique et univoque
 */

import {
  type ConsentChoices,
  type ConsentRecord,
  type ConsentStatus,
  ALL_ACCEPTED_CHOICES,
  CONSENT_EXPIRY_MS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  DEFAULT_CHOICES,
} from "./types";

function buildRecord(
  status: ConsentStatus,
  choices: ConsentChoices
): ConsentRecord {
  const now = Date.now();
  return {
    status,
    choices,
    timestamp: new Date(now).toISOString(),
    expiresAt: new Date(now + CONSENT_EXPIRY_MS).toISOString(),
    version: CONSENT_VERSION,
  };
}

/**
 * Reads the stored consent record from localStorage.
 * Returns null if not set, expired, or corrupted.
 */
export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const record = JSON.parse(raw) as ConsentRecord;

    // Guard against missing fields (e.g. old format)
    if (
      !record.status ||
      !record.choices ||
      !record.expiresAt ||
      !record.version
    ) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }

    // Check expiry
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }

    return record;
  } catch {
    // Corrupted storage — reset
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // Storage not accessible
    }
    return null;
  }
}

/**
 * Persists a consent record to localStorage.
 */
function writeConsent(record: ConsentRecord): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // QuotaExceededError or SecurityError — silently fail
  }
}

export function acceptAll(): ConsentRecord {
  const record = buildRecord("accepted_all", ALL_ACCEPTED_CHOICES);
  writeConsent(record);
  return record;
}

export function rejectAll(): ConsentRecord {
  const record = buildRecord("rejected_all", DEFAULT_CHOICES);
  writeConsent(record);
  return record;
}

export function saveCustomChoices(choices: ConsentChoices): ConsentRecord {
  const record = buildRecord("custom", {
    ...choices,
    necessary: true, // Always force true
  });
  writeConsent(record);
  return record;
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Storage not accessible
  }
}
