// Language types
export type Language = 'en' | 'ro' | 'fr' | 'de';

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
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'ultra';
  date: string;
  price: number;
  imageUrl?: string;
  raceMap?: string; // Embedded iframe code for the race map
}

// Participant types
export interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  birthDate: string;
  raceId: number;
  bibNumber?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  medicalInfo?: string;
  registrationDate: Date;
  gender: 'M' | 'F';
  age: number;
}

export interface ParticipantFilters {
  raceId?: number;
  country?: string;
  search?: string;
}

// Registration form types
export interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  birthDate: string;
  raceId: number;
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
