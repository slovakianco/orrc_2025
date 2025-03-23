import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Map, Mountain, Calendar } from "lucide-react";
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
    { label: t('races.filters.beginner'), value: 'beginner' },
    { label: t('races.filters.intermediate'), value: 'intermediate' },
    { label: t('races.filters.advanced'), value: 'advanced' },
    { label: t('races.filters.ultra'), value: 'ultra' }
  ];

  const handleFilterChange = (value: string | null) => {
    setDifficulty(value);
  };

  return (
    <section id="races" className={`py-16 bg-gray-50 ${fullPage ? 'min-h-screen' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {title || t('races.title')}
          </h2>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
            {t('races.subtitle')}
          </p>
        </div>
        
        {/* Race Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-4">
          {difficultyOptions.map((option) => (
            <button
              key={option.value || 'all'}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                difficulty === option.value ? 'bg-primary text-white' : 'bg-white hover:bg-neutral-light'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {races.map((race) => (
              <div key={race.id} className="race-card bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={race.imageUrl || `https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80`} 
                    alt={getLocalizedRaceName(race, i18n.language as any)} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  />
                  <div className={`absolute top-4 left-4 ${getDifficultyColor(race.difficulty)} py-1 px-3 rounded-full text-sm font-bold`}>
                    {t(`races.difficulty.${race.difficulty}`)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-2">{getLocalizedRaceName(race, i18n.language as any)}</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Map className="text-primary mr-2 h-4 w-4" />
                      <span>{race.distance} km</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <Mountain className="text-primary mr-2 h-4 w-4" />
                      <span>{race.elevation} m D+</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="text-primary mr-2 h-4 w-4" />
                      <span>{t(`races.dates.${race.date.split('-')[2]}`)}</span>
                    </div>
                  </div>
                  <div className="elevation-chart mb-4 h-[60px] bg-gradient-to-b from-primary-100 to-primary-200 relative overflow-hidden rounded-md"></div>
                  <p className="text-neutral-gray mb-6">{getLocalizedRaceDescription(race, i18n.language as any)}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{formatCurrency(race.price)}</span>
                    <Link href={`/races/${race.id}`} className="text-accent hover:text-accent-dark font-bold flex items-center">
                      {t('races.viewDetails')} <span className="ml-2">→</span>
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
            <Link href="/races" className="inline-block bg-white border-2 border-primary text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300">
              {t('races.viewAllButton')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RacesSection;
