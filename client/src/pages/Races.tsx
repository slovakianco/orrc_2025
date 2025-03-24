import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Mountain, TrendingUp, Award, Users, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Race } from "@/lib/types";
import { Link } from "wouter";
import { getLocalizedRaceName, getDifficultyColor } from "@/lib/utils";

type RaceCategory = "all" | "beginner" | "advanced";

export default function Races() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<RaceCategory>("all");
  const [hoveredRace, setHoveredRace] = useState<number | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Fetch races from API
  const { data: races, isLoading } = useQuery<Race[]>({
    queryKey: ['/api/races'],
  });

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const filterCategories: { value: RaceCategory; label: string; icon: React.ReactNode }[] = [
    { 
      value: "all", 
      label: t("races.filter.all"), 
      icon: <Info className="w-4 h-4 mr-2" /> 
    },
    { 
      value: "beginner", 
      label: t("races.filter.beginner"), 
      icon: <Mountain className="w-4 h-4 mr-2" /> 
    },
    { 
      value: "advanced", 
      label: t("races.filter.advanced"), 
      icon: <Award className="w-4 h-4 mr-2" /> 
    }
  ];

  // Filter races based on selected difficulty
  const filteredRaces = races?.filter(race => {
    if (filter === "all") return true;
    if (filter === "beginner" && (race.difficulty === "beginner")) return true;
    if (filter === "advanced" && (race.difficulty === "advanced" || race.difficulty === "ultra")) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-12 md:py-20 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            {t("races.title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl opacity-90 max-w-2xl"
          >
            {t("races.subtitle")}
          </motion.p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold mb-6 text-center md:text-left">{t("races.filterTitle")}</h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4">
              {filterCategories.map((category) => (
                <Button
                  key={category.value}
                  onClick={() => setFilter(category.value)}
                  variant={filter === category.value ? "default" : "outline"}
                  className={`rounded-full px-4 md:px-6 py-2 text-sm md:text-base font-medium transition-all duration-300 flex items-center ${
                    filter === category.value 
                      ? "bg-[#2E7D32] text-white shadow-lg transform scale-105" 
                      : "bg-white text-neutral-dark border-2 border-[#2E7D32]/20 hover:border-[#2E7D32]/50 hover:scale-105"
                  }`}
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter} // This forces re-render when filter changes
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredRaces?.map((race) => (
                  <motion.div
                    key={race.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    onHoverStart={() => setHoveredRace(race.id)}
                    onHoverEnd={() => setHoveredRace(null)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col"
                  >
                    <div 
                      className={`h-52 md:h-56 ${getDifficultyColor(race.difficulty)} relative`}
                    >
                      {race.imageUrl ? (
                        <img 
                          src={race.imageUrl} 
                          alt={getLocalizedRaceName(race, i18n.language as any)} 
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="absolute inset-0 opacity-20 bg-[url('/trail-pattern.svg')]"></div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="text-white text-xs font-medium mb-2 bg-black/30 w-fit px-3 py-1 rounded-full flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(race.date).toLocaleDateString(i18n.language, { 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                          {getLocalizedRaceName(race, i18n.language as any)}
                        </h3>
                        <div className="flex mt-1 gap-2">
                          <span 
                            className={`text-xs bg-${race.difficulty === 'beginner' ? 'green' : race.difficulty === 'intermediate' ? 'yellow' : 'red'}-100/80 
                            text-${race.difficulty === 'beginner' ? 'green' : race.difficulty === 'intermediate' ? 'yellow' : 'red'}-800 
                            px-2 py-0.5 rounded-full font-medium flex items-center`}
                          >
                            <Award className="w-3 h-3 mr-1" />
                            {t(`race.difficulty.${race.difficulty}`)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-4 mb-6 text-sm">
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-gray-500" />
                          <div>
                            <span className="text-gray-600">{t("races.elevation")}</span>
                            <p className="font-semibold">{race.elevation}m</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <div>
                            <span className="text-gray-600">{t("races.distance")}</span>
                            <p className="font-semibold">{race.distance}km</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <div>
                            <span className="text-gray-600">{t("races.price")}</span>
                            <p className="font-semibold">{race.price} €</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <Link to={`/races/${race.id}`}>
                          <Button 
                            variant="default"
                            className={`w-full ${getDifficultyColor(race.difficulty)} hover:brightness-90 text-white font-medium py-2 rounded-lg transition-all
                              duration-300 transform ${hoveredRace === race.id ? 'scale-105' : 'scale-100'}`}
                          >
                            {t("races.viewDetails")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {filteredRaces?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Mountain className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("races.noRacesFound")}</h3>
              <p className="text-gray-500">{t("races.tryDifferentFilter")}</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}