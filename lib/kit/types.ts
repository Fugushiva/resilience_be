export interface UserProfile {
  adults: number;
  children: number; // 0-12 ans
  teens: number; // 13-17 ans
  hasPets: boolean;
  petType?: "dog" | "cat" | "other";
  housing: "apartment" | "house" | "rural";
  hasGarden: boolean;
  scenario: "urban_power" | "evacuation" | "mountain" | "forest" | "general";
  medicalNeeds: boolean;
  dietaryRestrictions: string[];
  autonomyLevel: "basic" | "prepared" | "expert";
  location: "urban" | "suburban" | "rural";
}

export interface KitResult {
  profile: UserProfile;
  categories: KitResultCategory[];
  totalEur: number;
  totalWeightKg: number;
  essentialCount: number;
  coverageHours: number;
}

export interface KitResultCategory {
  id: string;
  label: string;
  items: KitResultItem[];
}

export interface KitResultItem {
  sku: string;
  name: string;
  qty: number;
  priceEur: number;
  essential: boolean;
  amazonUrl?: string;
  decathlonUrl?: string;
}

// Configurateur step types
export type ConfigStep =
  | "foyer"
  | "logement"
  | "scenario"
  | "sante"
  | "autonomie";

export interface StepData {
  id: ConfigStep;
  title: string;
  subtitle: string;
  progress: number; // 1-5
}

export const STEPS: StepData[] = [
  {
    id: "foyer",
    title: "Votre foyer",
    subtitle: "Qui protège-vous ?",
    progress: 1,
  },
  {
    id: "logement",
    title: "Votre logement",
    subtitle: "Où vous réfugiez-vous ?",
    progress: 2,
  },
  {
    id: "scenario",
    title: "Le scénario",
    subtitle: "Quel risque principal ?",
    progress: 3,
  },
  {
    id: "sante",
    title: "Santé & besoins",
    subtitle: "Des besoins spécifiques ?",
    progress: 4,
  },
  {
    id: "autonomie",
    title: "Niveau d'autonomie",
    subtitle: "Quelle expérience ?",
    progress: 5,
  },
];
