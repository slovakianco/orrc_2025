import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter, Users, Award, Flag, MapPin, Loader2, ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Participant, Race } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLocalizedRaceName, getCountryFlag } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function Participants() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [raceFilter, setRaceFilter] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewType, setViewType] = useState<"table" | "cards">("table");
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Fetch participants data
  const { data: participants = [], isLoading: participantsLoading } = useQuery<Participant[]>({
    queryKey: ['/api/participants'],
  });

  // Fetch races for filtering
  const { data: races = [] } = useQuery<Race[]>({
    queryKey: ['/api/races'],
  });

  // Extract unique countries for filtering
  const countries = useMemo(() => {
    const countriesSet = new Set<string>();
    participants.forEach(p => {
      if (p.country) countriesSet.add(p.country);
    });
    return Array.from(countriesSet).sort();
  }, [participants]);

  // Filter and sort participants
  const filteredParticipants = useMemo(() => {
    let filtered = [...participants];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(search)
      );
    }
    
    // Apply country filter
    if (countryFilter) {
      filtered = filtered.filter(p => p.country === countryFilter);
    }
    
    // Apply race filter
    if (raceFilter) {
      filtered = filtered.filter(p => p.raceid === raceFilter);
    }
    
    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortColumn) {
          case 'name':
            valueA = `${a.firstname} ${a.lastname}`.toLowerCase();
            valueB = `${b.firstname} ${b.lastname}`.toLowerCase();
            break;
          case 'country':
            valueA = a.country?.toLowerCase() || '';
            valueB = b.country?.toLowerCase() || '';
            break;
          case 'race':
            valueA = a.raceid;
            valueB = b.raceid;
            break;
          case 'status':
            valueA = a.status;
            valueB = b.status;
            break;
          default:
            return 0;
        }
        
        const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return filtered;
  }, [participants, searchTerm, countryFilter, raceFilter, sortColumn, sortDirection]);

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get race name by ID
  const getRaceName = (raceid: number) => {
    const race = races.find(r => r.id === raceid);
    return race ? getLocalizedRaceName(race, i18n.language as any) : t('participants.unknownRace');
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setCountryFilter("");
    setRaceFilter(null);
    setSortColumn(null);
  };

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

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
            {t("participants.title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl opacity-90 max-w-2xl"
          >
            {t("participants.subtitle")}
          </motion.p>
        </div>
      </section>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-12"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t("participants.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-lg border-2 border-gray-100 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Select 
                  value={countryFilter} 
                  onValueChange={setCountryFilter}
                >
                  <SelectTrigger className="w-full md:w-44 border-2 border-gray-100 focus:border-[#2E7D32]">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder={t("participants.filterByCountry")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("participants.allCountries")}</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>
                        <div className="flex items-center gap-2">
                          <span className="mr-1">{getCountryFlag(country)}</span>
                          {country}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={raceFilter?.toString() || ""} 
                  onValueChange={(value) => setRaceFilter(value ? parseInt(value) : null)}
                >
                  <SelectTrigger className="w-full md:w-44 border-2 border-gray-100 focus:border-[#2E7D32]">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder={t("participants.filterByRace")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("participants.allRaces")}</SelectItem>
                    {races.map(race => (
                      <SelectItem key={race.id} value={race.id.toString()}>
                        {getLocalizedRaceName(race, i18n.language as any)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(searchTerm || countryFilter || raceFilter) && (
                  <Button 
                    variant="outline"
                    className="flex gap-2 items-center border-2 border-gray-100 hover:bg-gray-50"
                    onClick={resetFilters}
                  >
                    <X className="w-4 h-4" />
                    {t("participants.clearFilters")}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center mt-4">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                {filteredParticipants.length} {t("participants.participantsFound")}
                {(searchTerm || countryFilter || raceFilter) && (
                  <span> • {t("participants.filterApplied")}</span>
                )}
              </div>
              
              <Tabs 
                defaultValue="table" 
                value={viewType} 
                onValueChange={(value) => setViewType(value as "table" | "cards")}
                className="w-full md:w-auto"
              >
                <TabsList className="grid w-full md:w-auto grid-cols-2 h-10">
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {t("participants.tableView")}
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t("participants.cardView")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {participantsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-[#2E7D32] animate-spin mb-4" />
                <p className="text-gray-500">{t("participants.loading")}</p>
              </div>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg"
            >
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("participants.noParticipantsFound")}</h3>
              <p className="text-gray-500 mb-6">{t("participants.tryDifferentFilter")}</p>
              <Button 
                variant="outline"
                className="border-2 border-[#2E7D32]/20 hover:border-[#2E7D32]/50 hover:bg-[#2E7D32]/5"
                onClick={resetFilters}
              >
                {t("participants.clearFilters")}
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {viewType === "table" ? (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th 
                              className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('name')}
                            >
                              <div className="flex items-center">
                                {t("participants.table.name")}
                                {renderSortIndicator('name')}
                              </div>
                            </th>
                            <th 
                              className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('country')}
                            >
                              <div className="flex items-center">
                                {t("participants.table.country")}
                                {renderSortIndicator('country')}
                              </div>
                            </th>
                            <th 
                              className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('race')}
                            >
                              <div className="flex items-center">
                                {t("participants.table.race")}
                                {renderSortIndicator('race')}
                              </div>
                            </th>
                            <th 
                              className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('status')}
                            >
                              <div className="flex items-center">
                                {t("participants.table.status")}
                                {renderSortIndicator('status')}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredParticipants.map((participant) => (
                            <motion.tr 
                              key={participant.id}
                              className="hover:bg-gray-50 transition-colors"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ backgroundColor: "rgba(46, 125, 50, 0.05)" }}
                            >
                              <td className="px-6 py-4 text-sm text-gray-800">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32] font-semibold mr-3">
                                    {participant.firstname?.[0]}{participant.lastname?.[0]}
                                  </div>
                                  <div>
                                    <div className="font-medium">{participant.firstname} {participant.lastname}</div>
                                    <div className="text-xs text-gray-500">#{participant.bibNumber || '---'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800">
                                <div className="flex items-center">
                                  <span className="mr-2 text-lg">{getCountryFlag(participant.country)}</span>
                                  {participant.country}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {getRaceName(participant.raceid)}
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className={`${getStatusColor(participant.status)} px-3 py-1`}>
                                  {t(`participants.status.${participant.status}`)}
                                </Badge>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredParticipants.map((participant) => (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32] font-bold mr-3 text-xl">
                                {participant.firstname?.[0]}{participant.lastname?.[0]}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{participant.firstname} {participant.lastname}</h3>
                                <div className="flex items-center text-gray-500 text-sm">
                                  <span className="mr-1 text-lg">{getCountryFlag(participant.country)}</span>
                                  {participant.country}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className={`${getStatusColor(participant.status)} mt-1`}>
                              {t(`participants.status.${participant.status}`)}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-gray-500">{t("participants.table.race")}</div>
                                <div className="font-medium">{getRaceName(participant.raceid)}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">{t("participants.table.bibNumber")}</div>
                                <div className="font-medium">#{participant.bibNumber || '---'}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">{t("participants.table.gender")}</div>
                                <div className="font-medium">
                                  {participant.gender === 'M' ? t("participants.gender.male") : t("participants.gender.female")}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">{t("participants.table.age")}</div>
                                <div className="font-medium">{participant.age || '---'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.section>
    </div>
  );
}