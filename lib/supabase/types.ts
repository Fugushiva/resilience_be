/**
 * Database types matching the Supabase schema.
 * Keep in sync with supabase/migrations/001_initial_schema.sql
 */

export interface DbProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbKit {
  id: string;
  user_id: string | null;
  share_id: string;
  items: Record<string, unknown>;
  scenario: string | null;
  total_eur: number | null;
  total_weight_kg: number | null;
  essential_count: number | null;
  coverage_hours: number | null;
  persons: number | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbKitInsert {
  id?: string;
  user_id?: string | null;
  share_id?: string;
  items: Record<string, unknown>;
  scenario?: string | null;
  total_eur?: number | null;
  total_weight_kg?: number | null;
  essential_count?: number | null;
  coverage_hours?: number | null;
  persons?: number | null;
  session_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbKitUpdate {
  id?: string;
  user_id?: string | null;
  share_id?: string;
  items?: Record<string, unknown>;
  scenario?: string | null;
  total_eur?: number | null;
  total_weight_kg?: number | null;
  essential_count?: number | null;
  coverage_hours?: number | null;
  persons?: number | null;
  session_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbLead {
  id: string;
  email: string;
  kit_id: string | null;
  source: string | null;
  ip_hash: string | null;
  consent_given: boolean;
  created_at: string;
}

export interface DbLeadInsert {
  id?: string;
  email: string;
  kit_id?: string | null;
  source?: string;
  ip_hash?: string | null;
  consent_given: boolean;
  created_at?: string;
}

/** Supabase Database type map for typed client */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: DbProfile;
        Insert: Omit<DbProfile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<DbProfile, "id" | "created_at">>;
        Relationships: [];
      };
      kits: {
        Row: DbKit;
        Insert: DbKitInsert;
        Update: DbKitUpdate;
        Relationships: [
          {
            foreignKeyName: "kits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: DbLead;
        Insert: DbLeadInsert;
        Update: Partial<DbLead>;
        Relationships: [
          {
            foreignKeyName: "leads_kit_id_fkey";
            columns: ["kit_id"];
            isOneToOne: false;
            referencedRelation: "kits";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
