// Language types
export type Language = 'en' | 'ro' | 'fr' | 'de' | 'it' | 'es';

// Race types
export interface Race {
  id: number;
  name: string;
  nameRo: string;
  nameFr: string;
  nameDe: string;
  description: string;
  descriptionRo: string;
  descriptionFr: string;
  descriptionDe: string;
  distance: number;
  elevation: number;
  difficulty: 'classic_updown' | 'long_trail';
  date: string;
  price: number;
  imageUrl?: string;
  raceMap?: string; // Embedded iframe code for the race map
  isEMAcertified?: boolean; // EMA Off-Road Running Circuit certification
  isNationalChampionship?: boolean; // National Championship status
  aidStations?: AidStation[]; // List of aid stations
}

export interface AidStation {
  kilometer: number; // Location of the aid station in kilometers
  supplies?: string; // What's available at this aid station
}

// Participant types
export interface Participant {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  country: string;
  birthDate: string;
  raceid: number;
  bibNumber?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  medicalInfo?: string;
  registrationDate: Date;
  gender: 'M' | 'F';
  age: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isEmaParticipant?: boolean;
  tshirtSize?: string;
}

export interface ParticipantFilters {
  raceid?: number;
  country?: string;
  search?: string;
  isEmaParticipant?: boolean;
  genderCategory?: string; // M, F
  ageCategory?: string; // masters categories: M35, M40, M45, etc.
  status?: string; // pending, confirmed, cancelled
}

// Registration form types
export interface RegistrationForm {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  country: string;
  birthDate: string;
  raceid: number;
  medicalInfo?: string;
  gender: 'M' | 'F';
  termsAccepted: boolean;
}

// FAQ types
export interface FAQ {
  id: number;
  question: string;
  questionRo: string;
  questionFr: string;
  questionDe: string;
  answer: string;
  answerRo: string;
  answerFr: string;
  answerDe: string;
  order: number;
}

// Program event types
export interface ProgramEvent {
  id: number;
  date: string;
  startTime: string;
  endTime?: string | null;
  title: string;
  titleRo: string;
  titleFr: string;
  titleDe: string;
  description: string;
  descriptionRo: string;
  descriptionFr: string;
  descriptionDe: string;
  location: string;
  order: number;
}

// Sponsor types
export interface Sponsor {
  id: number;
  name: string;
  description: string;
  descriptionRo: string;
  descriptionFr: string;
  descriptionDe: string;
  logoPlaceholder: string;
  website: string;
  level: 'premium' | 'standard';
  order: number;
}

// Contact form types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  isActive: boolean;
}
