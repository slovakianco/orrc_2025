import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Language } from "@/lib/types";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLanguage(i18n.language as Language);
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    setIsOpen(false);
  };

  const languageNames: Record<Language, string> = {
    en: 'English',
    ro: 'Română',
    fr: 'Français',
    de: 'Deutsch'
  };

  const flagUrls: Record<Language, string> = {
    en: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GB.svg",
    ro: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RO.svg",
    fr: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FR.svg",
    de: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DE.svg"
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center justify-center p-1.5 rounded-md text-neutral-dark hover:text-primary hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <Globe className="h-5 w-5 mr-1" />
        <span className="text-xs font-medium uppercase">{currentLanguage}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              className={`w-full text-left px-4 py-2 flex items-center hover:bg-gray-100 ${
                currentLanguage === code ? 'bg-primary-light/10 font-medium text-primary' : ''
              }`}
              onClick={() => changeLanguage(code as Language)}
            >
              <img 
                src={flagUrls[code as Language]} 
                alt={name} 
                className="w-5 h-5 mr-3" 
              />
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
