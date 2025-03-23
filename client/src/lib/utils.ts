import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language, Race, ProgramEvent, FAQ, Sponsor } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to localized string
export function formatDate(date: string, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Calculate age from birthdate
export function calculateAge(birthdate: string): number {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Format currency
export function formatCurrency(value: number, currency: string = 'EUR', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

// Get localized race name based on current language
export function getLocalizedRaceName(race: Race, language: Language): string {
  switch (language) {
    case 'ro':
      return race.nameRo;
    case 'fr':
      return race.nameFr;
    case 'de':
      return race.nameDe;
    default:
      return race.name;
  }
}

// Get localized race description based on current language
export function getLocalizedRaceDescription(race: Race, language: Language): string {
  switch (language) {
    case 'ro':
      return race.descriptionRo;
    case 'fr':
      return race.descriptionFr;
    case 'de':
      return race.descriptionDe;
    default:
      return race.description;
  }
}

// Get localized program event title based on current language
export function getLocalizedEventTitle(event: ProgramEvent, language: Language): string {
  switch (language) {
    case 'ro':
      return event.titleRo;
    case 'fr':
      return event.titleFr;
    case 'de':
      return event.titleDe;
    default:
      return event.title;
  }
}

// Get localized program event description based on current language
export function getLocalizedEventDescription(event: ProgramEvent, language: Language): string {
  switch (language) {
    case 'ro':
      return event.descriptionRo;
    case 'fr':
      return event.descriptionFr;
    case 'de':
      return event.descriptionDe;
    default:
      return event.description;
  }
}

// Get localized FAQ question based on current language
export function getLocalizedFAQQuestion(faq: FAQ, language: Language): string {
  switch (language) {
    case 'ro':
      return faq.questionRo;
    case 'fr':
      return faq.questionFr;
    case 'de':
      return faq.questionDe;
    default:
      return faq.question;
  }
}

// Get localized FAQ answer based on current language
export function getLocalizedFAQAnswer(faq: FAQ, language: Language): string {
  switch (language) {
    case 'ro':
      return faq.answerRo;
    case 'fr':
      return faq.answerFr;
    case 'de':
      return faq.answerDe;
    default:
      return faq.answer;
  }
}

// Get localized sponsor description based on current language
export function getLocalizedSponsorDescription(sponsor: Sponsor, language: Language): string {
  switch (language) {
    case 'ro':
      return sponsor.descriptionRo;
    case 'fr':
      return sponsor.descriptionFr;
    case 'de':
      return sponsor.descriptionDe;
    default:
      return sponsor.description;
  }
}

// Get difficulty badge color
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-accent text-white'; // Orange
    case 'intermediate':
      return 'bg-secondary text-white'; // Green
    case 'advanced':
    case 'ultra':
      return 'bg-primary-dark text-white'; // Dark Blue
    default:
      return 'bg-neutral-gray text-white';
  }
}

// Get status badge color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-status-success bg-opacity-10 text-status-success'; // Green
    case 'cancelled':
      return 'bg-status-error bg-opacity-10 text-status-error'; // Red
    case 'pending':
      return 'bg-status-warning bg-opacity-10 text-status-warning'; // Orange
    default:
      return 'bg-neutral-gray bg-opacity-10 text-neutral-gray';
  }
}

// Format time (HH:MM)
export function formatTime(time: string): string {
  return time;
}

// Group program events by date
export function groupEventsByDate(events: ProgramEvent[]): { [key: string]: ProgramEvent[] } {
  return events.reduce((acc, event) => {
    const dateKey = event.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as { [key: string]: ProgramEvent[] });
}

// Get country flag emoji from country code
export function getCountryFlag(countryCode: string): string {
  const countryCodeUpperCase = countryCode.toUpperCase();
  return `https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${countryCodeUpperCase}.svg`;
}
