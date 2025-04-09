// Race types
export type RaceCategory = "ultra" | "marathon" | "half" | "25k" | "10k";

export interface Race {
  id: number;
  name: string;
  category: RaceCategory;
  elevation: number;
  difficulty: string;
  date: string;
  description?: string;
  raceMap?: string;
  aidStations?: number;
  cutoffTime?: string;
  startTime?: string;
}

// Participant types
export interface Participant {
  id: number;
  firstname: string;
  lastname: string;
  country: string;
  raceCategory: RaceCategory;
  bibNumber: number;
  completionTime?: string;
  rank?: number;
}

// Registration types
export interface RegistrationFormData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  raceCategory: RaceCategory;
  emergencyContactName: string;
  emergencyContactPhone: string;
  termsAccepted: boolean;
}

// Sponsor types
export type SponsorTier = "gold" | "silver" | "bronze";

export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  tier: SponsorTier;
  description: string;
  website: string;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
