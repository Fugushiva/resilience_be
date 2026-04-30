/**
 * Consent types for Survikit GDPR compliance
 * Conformité APD (Autorité de Protection des Données) Belgique
 */

export type ConsentCategory =
  | "necessary"     // Always true — fonctionnalités déterministes Survikit
  | "analytics"     // Futur: Plausible, Fathom (pas encore implémenté)
  | "marketing"     // Amazon affiliate + Decathlon Awin scripts
  | "payment";      // Stripe Checkout

export interface ConsentChoices {
  necessary: true;   // Non-négociable
  analytics: boolean;
  marketing: boolean;
  payment: boolean;
}

export type ConsentStatus = "pending" | "accepted_all" | "rejected_all" | "custom";

export interface ConsentRecord {
  status: ConsentStatus;
  choices: ConsentChoices;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Expiry ISO 8601 timestamp (6 months) */
  expiresAt: string;
  /** Semantic version for future migrations */
  version: string;
}

export const CONSENT_VERSION = "1.0.0";
export const CONSENT_STORAGE_KEY = "survikit_consent";
/** 6 months in milliseconds */
export const CONSENT_EXPIRY_MS = 6 * 30 * 24 * 60 * 60 * 1000;

export const DEFAULT_CHOICES: ConsentChoices = {
  necessary: true,
  analytics: false,
  marketing: false,
  payment: false,
};

export const ALL_ACCEPTED_CHOICES: ConsentChoices = {
  necessary: true,
  analytics: true,
  marketing: true,
  payment: true,
};
