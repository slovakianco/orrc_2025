import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Map of language codes to flag emojis
const languageFlags: Record<string, string> = {
  en: '🇬🇧',
  ro: '🇷🇴',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  es: '🇪🇸',
};

// Map of language codes to full names
const languageNames: Record<string, string> = {
  en: 'English',
  ro: 'Română',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
};

export default function LanguageSelectorWithFlags() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const getCurrentLanguageFlag = () => {
    return languageFlags[i18n.language] || languageFlags['en'];
  };

  const getCurrentLanguageName = () => {
    return languageNames[i18n.language] || languageNames['en'];
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-sunset/20 hover:bg-sunset/30 transition-colors duration-200 border border-sunset/20 shadow-sm"
          aria-label={`Language: ${getCurrentLanguageName()}`}
        >
          <span className="text-base">{getCurrentLanguageFlag()}</span>
          <span className="hidden md:inline text-white text-xs font-medium ml-1">{getCurrentLanguageName()}</span>
          <ChevronDown className="h-3 w-3 text-white ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] border border-slate-gray/20 shadow-xl">
        {Object.keys(languageFlags).map((lang) => (
          <DropdownMenuItem
            key={lang}
            className={cn(
              "flex items-center gap-2 cursor-pointer py-2 px-3 text-sm transition-colors",
              i18n.language === lang 
                ? "font-bold bg-sunset/10 text-sunset" 
                : "hover:bg-stone-beige/5"
            )}
            onClick={() => changeLanguage(lang)}
          >
            <span className="text-lg">{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
            {i18n.language === lang && (
              <Check className="h-3 w-3 ml-auto text-sunset" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}