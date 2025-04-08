import React from 'react';

interface CountryFlagProps {
  countryCode: string;
  className?: string;
  showName?: boolean;
}

/**
 * Component to render a country flag emoji
 */
const CountryFlag: React.FC<CountryFlagProps> = ({ 
  countryCode, 
  className = "", 
  showName = false
}) => {
  if (!countryCode) return <span className={className}>🏳️</span>;
  
  // Get country name for display and alt text
  const countryName = getCountryName(countryCode);
  
  // Generate flag emoji from country code
  const flagEmoji = getFlagEmoji(countryCode);
  
  return (
    <span className={`inline-flex items-center ${className}`} title={countryName}>
      <span className="flag-emoji">{flagEmoji}</span>
      {showName && <span className="ml-1">{countryName}</span>}
    </span>
  );
};

// Generate flag emoji from country code
function getFlagEmoji(countryCode: string): string {
  try {
    // Convert country code to uppercase
    const code = countryCode.toUpperCase();
    
    // Handle special case for UK
    if (code === 'UK') {
      return '🇬🇧';
    }
    
    // Each letter is converted to Regional Indicator Symbol Letters
    // These letters are in the range 0x1F1E6 to 0x1F1FF
    // A = 0x1F1E6, B = 0x1F1E7, etc.
    const offset = 0x1F1E6; // Regional Indicator Symbol Letter A
    const firstLetter = code.charCodeAt(0) - 65 + offset;
    const secondLetter = code.charCodeAt(1) - 65 + offset;
    
    return String.fromCodePoint(firstLetter) + String.fromCodePoint(secondLetter);
  } catch (e) {
    console.error('Error generating flag emoji:', e);
    return countryCode;
  }
}

// Get country name from country code
function getCountryName(countryCode: string): string {
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

export default CountryFlag;