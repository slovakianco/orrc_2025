import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Map, Mountain, Calendar, Award, Medal } from "lucide-react";
import { Race } from "@/lib/types";
import { getDifficultyColor, getLocalizedRaceName, getLocalizedRaceDescription, formatCurrency } from "@/lib/utils";

interface RacesSectionProps {
  title?: string;
  fullPage?: boolean;
}

const RacesSection = ({ title, fullPage = false }: RacesSectionProps) => {
  const { t, i18n } = useTranslation();
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const { data: races, isLoading } = useQuery<Race[]>({
    queryKey: [difficulty ? `/api/races?difficulty=${difficulty}` : '/api/races'],
  });

  const difficultyOptions = [
    { label: t('races.filters.all'), value: null },
    { label: t('races.filters.classic_updown'), value: 'classic_updown' },
    { label: t('races.filters.long_trail'), value: 'long_trail' }
  ];

  const handleFilterChange = (value: string | null) => {
    setDifficulty(value);
  };

  return (
    <section id="races" className={`py-10 md:py-16 bg-neutral-light/30 ${fullPage ? 'min-h-screen' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-heading font-bold mb-3 md:mb-4 text-primary">
            {title || t('races.title')}
          </h2>
          <p className="text-base md:text-lg text-neutral-dark/80 max-w-3xl mx-auto">
            {t('races.subtitle')}
          </p>
        </div>
        
        {/* Race Filters */}
        <div className="mb-8 md:mb-10 flex flex-wrap justify-center gap-2 md:gap-4">
          {difficultyOptions.map((option) => (
            <button
              key={option.value || 'all'}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-full font-medium transition-colors duration-200 ${
                difficulty === option.value 
                  ? option.value === 'classic_updown' 
                    ? 'bg-blue-600 text-white' 
                    : option.value === 'long_trail' 
                      ? 'bg-green-700 text-white' 
                      : 'bg-primary text-white' 
                  : 'bg-white hover:bg-neutral-light'
              }`}
              onClick={() => handleFilterChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Race Cards */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : races && races.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {races.map((race) => (
              <div key={race.id} className="race-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-40 sm:h-48 relative overflow-hidden">
                  <img 
                    src={race.imageUrl || `https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80`} 
                    alt={getLocalizedRaceName(race, i18n.language as any)} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  />
                  <div className={`absolute top-3 left-3 md:top-4 md:left-4 py-1 px-2 md:px-3 rounded-full text-xs md:text-sm font-bold ${race.difficulty === 'classic_updown' ? 'bg-blue-600' : 'bg-green-700'} text-white`}>
                    {t(`races.difficulty.${race.difficulty}`)}
                  </div>
                  
                  {/* Add certification badges */}
                  {(race.isemacertified || race.isNationalChampionship) && (
                    <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex flex-col gap-2">
                      {race.isemacertified && (
                        <div className="bg-blue-600 text-white text-xs md:text-sm py-1 px-2 rounded-md font-semibold flex items-center shadow-md">
                          <Award className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span>EMA 2025</span>
                        </div>
                      )}
                      {race.isNationalChampionship && (
                        <div className="bg-red-600 text-white text-xs md:text-sm py-1 px-2 rounded-md font-semibold flex items-center shadow-md">
                          <Medal className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span>{t('races.certification.nationalShort')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-heading font-bold text-lg md:text-xl mb-2 text-primary line-clamp-1">{getLocalizedRaceName(race, i18n.language as any)}</h3>
                  
                  {/* Certification information under title */}
                  {(race.isemacertified || race.isNationalChampionship) && (
                    <div className="mb-3">
                      {race.isemacertified && (
                        <div className="text-blue-600 text-xs md:text-sm mb-1 font-medium">
                          {t('races.certification.ema')}
                        </div>
                      )}
                      {race.isNationalChampionship && (
                        <div className="text-red-600 text-xs md:text-sm font-medium">
                          {t('races.certification.national')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center mb-3 md:mb-4 text-sm md:text-base">
                    <div className="flex items-center mr-3 md:mr-4 mb-1">
                      <Map className="text-secondary mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-neutral-dark">{race.distance} km</span>
                    </div>
                    <div className="flex items-center mr-3 md:mr-4 mb-1">
                      <Mountain className="text-secondary mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-neutral-dark">{race.elevation} m D+</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <Calendar className="text-secondary mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-neutral-dark">{t(`races.dates.${race.date.split('-')[2]}`)}</span>
                    </div>
                  </div>
                  <div className="elevation-chart mb-3 md:mb-4 h-[40px] md:h-[60px] bg-gradient-to-r from-primary/20 to-secondary/30 relative overflow-hidden rounded-md"></div>
                  <div className="flex items-center gap-1 mb-2 text-xs md:text-sm text-blue-600">
                    <span className="inline-block">💧</span> 
                    {race.id === 1 ? 
                      <span>{t('races.aidStations_plural', { count: 5 })}</span> : 
                      <span>{t('races.aidStations', { count: 1 })}</span>
                    }
                  </div>
                  <p className="text-neutral-dark/80 text-sm md:text-base mb-4 md:mb-6 line-clamp-3 md:line-clamp-4">{getLocalizedRaceDescription(race, i18n.language as any)}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{formatCurrency(race.price)}</span>
                    <Link href={`/races/${race.id}`} className="text-accent hover:text-accent-dark font-bold text-sm md:text-base flex items-center">
                      {t('races.viewDetails')} <span className="ml-1 md:ml-2">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>{t('races.noRacesFound')}</p>
          </div>
        )}
        
        {!fullPage && (
          <div className="mt-12 text-center">
            <Link href="/races" className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-dark transition-colors duration-300 shadow-md hover:shadow-lg">
              {t('races.viewAllButton')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RacesSection;
