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
    <div className="fixed top-5 right-5 z-50 bg-white rounded-lg shadow-md p-2 flex space-x-2 language-switcher">
      <button 
        className={`language-selector flex items-center justify-center p-2 rounded-md border-2 ${
          currentLanguage === 'en' ? 'active border-accent bg-accent bg-opacity-10' : 'border-neutral-light'
        }`} 
        onClick={() => changeLanguage('en')}
      >
        <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GB.svg" alt="English" className="w-6 h-auto mr-2" />
        <span className="text-sm font-medium">EN</span>
      </button>
      <button 
        className={`language-selector flex items-center justify-center p-2 rounded-md border-2 ${
          currentLanguage === 'ro' ? 'active border-accent bg-accent bg-opacity-10' : 'border-neutral-light'
        }`} 
        onClick={() => changeLanguage('ro')}
      >
        <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RO.svg" alt="Romanian" className="w-6 h-auto mr-2" />
        <span className="text-sm font-medium">RO</span>
      </button>
      <button 
        className={`language-selector flex items-center justify-center p-2 rounded-md border-2 ${
          currentLanguage === 'fr' ? 'active border-accent bg-accent bg-opacity-10' : 'border-neutral-light'
        }`} 
        onClick={() => changeLanguage('fr')}
      >
        <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FR.svg" alt="French" className="w-6 h-auto mr-2" />
        <span className="text-sm font-medium">FR</span>
      </button>
      <button 
        className={`language-selector flex items-center justify-center p-2 rounded-md border-2 ${
          currentLanguage === 'de' ? 'active border-accent bg-accent bg-opacity-10' : 'border-neutral-light'
        }`} 
        onClick={() => changeLanguage('de')}
      >
        <img src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DE.svg" alt="German" className="w-6 h-auto mr-2" />
        <span className="text-sm font-medium">DE</span>
      </button>
    </div>
  );
};

export default LanguageSelector;
