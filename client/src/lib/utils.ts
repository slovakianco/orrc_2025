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
export function formatCurrency(value: number, currency: string = 'RON', locale: string = 'en-US'): string {
  const formattedValue = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

  // Add EUR equivalent in parentheses if currency is RON
  if (currency === 'RON') {
    const eurValue = value / 5; // 1 EUR = 5 RON
    const eurFormatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(eurValue);
    return `${formattedValue} (${eurFormatted})`;
  }

  return formattedValue;
}

// Get localized race name based on current language
export function getLocalizedRaceName(race: Race, language: Language): string {
  switch (language) {
    case 'ro':
      return race.nameRo || race.name;
    case 'fr':
      return race.nameFr || race.name;
    case 'de':
      return race.nameDe || race.name;
    default:
      return race.name;
  }
}

// Get localized race description based on current language
export function getLocalizedRaceDescription(race: Race, language: Language): string {
  switch (language) {
    case 'ro':
      return race.descriptionRo || race.description;
    case 'fr':
      return race.descriptionFr || race.description;
    case 'de':
      return race.descriptionDe || race.description;
    default:
      return race.description;
  }
}

// Get localized program event title based on current language
export function getLocalizedEventTitle(event: ProgramEvent, language: Language): string {
  switch (language) {
    case 'ro':
      return event.titleRo || event.title;
    case 'fr':
      return event.titleFr || event.title;
    case 'de':
      return event.titleDe || event.title;
    default:
      return event.title;
  }
}

// Get localized program event description based on current language
export function getLocalizedEventDescription(event: ProgramEvent, language: Language): string {
  switch (language) {
    case 'ro':
      return event.descriptionRo || event.description;
    case 'fr':
      return event.descriptionFr || event.description;
    case 'de':
      return event.descriptionDe || event.description;
    default:
      return event.description;
  }
}

// Get localized FAQ question based on current language
export function getLocalizedFAQQuestion(faq: FAQ, language: Language): string {
  switch (language) {
    case 'ro':
      return faq.questionRo || faq.question;
    case 'fr':
      return faq.questionFr || faq.question;
    case 'de':
      return faq.questionDe || faq.question;
    default:
      return faq.question;
  }
}

// Get localized FAQ answer based on current language
export function getLocalizedFAQAnswer(faq: FAQ, language: Language): string {
  switch (language) {
    case 'ro':
      return faq.answerRo || faq.answer;
    case 'fr':
      return faq.answerFr || faq.answer;
    case 'de':
      return faq.answerDe || faq.answer;
    default:
      return faq.answer;
  }
}

// Get localized sponsor description based on current language
export function getLocalizedSponsorDescription(sponsor: Sponsor, language: Language): string {
  switch (language) {
    case 'ro':
      return sponsor.descriptionRo || sponsor.description;
    case 'fr':
      return sponsor.descriptionFr || sponsor.description;
    case 'de':
      return sponsor.descriptionDe || sponsor.description;
    default:
      return sponsor.description;
  }
}

// Get difficulty badge color for background
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-600 text-white';
    case 'intermediate':
      return 'bg-yellow-600 text-white';
    case 'advanced':
      return 'bg-orange-600 text-white';
    case 'ultra':
      return 'bg-red-600 text-white';
    default:
      return 'bg-blue-600 text-white';
  }
}

// Get difficulty badge color for inline badges
export function getDifficultyBadgeColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100/80 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100/80 text-yellow-800';
    case 'advanced':
      return 'bg-orange-100/80 text-orange-800';
    case 'ultra':
      return 'bg-red-100/80 text-red-800';
    default:
      return 'bg-blue-100/80 text-blue-800';
  }
}

// Get status badge color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-green-600 text-white border-green-700';
    case 'pending':
      return 'bg-yellow-600 text-white border-yellow-700';
    case 'cancelled':
      return 'bg-red-600 text-white border-red-700';
    default:
      return 'bg-gray-600 text-white border-gray-700';
  }
}

// Format time (HH:MM)
export function formatTime(time: string): string {
  if (!time) return '';
  
  try {
    return new Date(`2023-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return time;
  }
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

// Get country flag URL from country code
export function getCountryFlag(countryCode: string): string {
  if (!countryCode) return 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/XX.svg';
  
  // Get the uppercase country code
  const code = countryCode.toUpperCase();
  
  // Return the flag URL
  return `https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${code}.svg`;
}

// Get country name from country code
export function getCountryName(countryCode: string): string {
  if (!countryCode) return 'Unknown';
  
  const countryNames: { [key: string]: string } = {
    'RO': 'Romania',
    'FR': 'France',
    'DE': 'Germany',
    'UK': 'United Kingdom',
    'US': 'United States',
    'IT': 'Italy',
    'ES': 'Spain',
    'PT': 'Portugal',
    'BE': 'Belgium',
    'NL': 'Netherlands',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'HU': 'Hungary',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'CA': 'Canada',
    'AU': 'Australia',
    'NZ': 'New Zealand',
    'JP': 'Japan',
    'CN': 'China',
    'IN': 'India',
    'RU': 'Russia',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'ZA': 'South Africa',
    'AR': 'Argentina',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'IE': 'Ireland',
    'GR': 'Greece',
    'IL': 'Israel'
  };
  
  const code = countryCode.toUpperCase();
  return countryNames[code] || countryCode;
}

// Helper function to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Format distance with km suffix
export function formatDistance(distance: number): string {
  return distance + ' km';
}

// Generate initials from full name
export function getInitials(firstname: string, lastname: string): string {
  const firstInitial = firstname?.charAt(0) || '';
  const lastInitial = lastname?.charAt(0) || '';
  return (firstInitial + lastInitial).toUpperCase();
}

// Format date for mobile display (shorter version)
export function formatMobileDate(date: string, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric'
  });
}
