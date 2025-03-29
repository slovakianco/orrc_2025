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
};

// Map of language codes to full names
const languageNames: Record<string, string> = {
  en: 'English',
  ro: 'Română',
  fr: 'Français',
  de: 'Deutsch',
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
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-white/20 shadow-md"
          aria-label={`Language: ${getCurrentLanguageName()}`}
        >
          <Globe className="h-4 w-4 mr-1 text-stone-beige" />
          <span className="text-lg">{getCurrentLanguageFlag()}</span>
          <span className="hidden md:inline text-stone-beige font-medium ml-1">{getCurrentLanguageName()}</span>
          <ChevronDown className="h-4 w-4 text-stone-beige ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] border-2 border-slate-gray/10 shadow-xl">
        {Object.keys(languageFlags).map((lang) => (
          <DropdownMenuItem
            key={lang}
            className={cn(
              "flex items-center gap-3 cursor-pointer py-3 px-4 text-base transition-colors",
              i18n.language === lang 
                ? "font-bold bg-alpine/10 text-alpine" 
                : "hover:bg-stone-beige/10"
            )}
            onClick={() => changeLanguage(lang)}
          >
            <span className="text-xl">{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
            {i18n.language === lang && (
              <Check className="h-4 w-4 ml-auto text-alpine" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}