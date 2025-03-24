import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 px-2 md:px-3"
          aria-label={`Language: ${getCurrentLanguageName()}`}
        >
          <span className="text-lg mr-1">{getCurrentLanguageFlag()}</span>
          <span className="hidden md:inline">{getCurrentLanguageName()}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {Object.keys(languageFlags).map((lang) => (
          <DropdownMenuItem
            key={lang}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              i18n.language === lang && "font-medium bg-accent"
            )}
            onClick={() => changeLanguage(lang)}
          >
            <span className="text-lg">{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
            {i18n.language === lang && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}