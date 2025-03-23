import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Language } from "@/lib/types";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    setCurrentLanguage(i18n.language as Language);
  }, [i18n.language]);

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
  };

  return (
    <div className="fixed top-16 right-2 md:top-24 md:right-6 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-1.5 md:p-2 flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 language-switcher">
      <button 
        className={`language-selector flex items-center justify-center p-1.5 md:p-2 rounded-md border ${
          currentLanguage === 'en' 
            ? 'active border-accent bg-accent/10 text-accent' 
            : 'border-neutral-light hover:border-primary/30 hover:bg-primary/5'
        }`} 
        onClick={() => changeLanguage('en')}
        aria-label="Switch to English"
      >
        <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GB.svg" alt="English" className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-xs md:text-sm font-medium ml-1.5">EN</span>
      </button>
      <button 
        className={`language-selector flex items-center justify-center p-1.5 md:p-2 rounded-md border ${
          currentLanguage === 'ro' 
            ? 'active border-accent bg-accent/10 text-accent' 
            : 'border-neutral-light hover:border-primary/30 hover:bg-primary/5'
        }`} 
        onClick={() => changeLanguage('ro')}
        aria-label="Switch to Romanian"
      >
        <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RO.svg" alt="Romanian" className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-xs md:text-sm font-medium ml-1.5">RO</span>
      </button>
      <button 
        className={`language-selector flex items-center justify-center p-1.5 md:p-2 rounded-md border ${
          currentLanguage === 'fr' 
            ? 'active border-accent bg-accent/10 text-accent' 
            : 'border-neutral-light hover:border-primary/30 hover:bg-primary/5'
        }`} 
        onClick={() => changeLanguage('fr')}
        aria-label="Switch to French"
      >
        <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FR.svg" alt="French" className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-xs md:text-sm font-medium ml-1.5">FR</span>
      </button>
      <button 
        className={`language-selector flex items-center justify-center p-1.5 md:p-2 rounded-md border ${
          currentLanguage === 'de' 
            ? 'active border-accent bg-accent/10 text-accent' 
            : 'border-neutral-light hover:border-primary/30 hover:bg-primary/5'
        }`} 
        onClick={() => changeLanguage('de')}
        aria-label="Switch to German"
      >
        <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DE.svg" alt="German" className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-xs md:text-sm font-medium ml-1.5">DE</span>
      </button>
    </div>
  );
};

export default LanguageSelector;
