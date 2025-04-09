import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { Race, Participant, ParticipantFilters } from "@/lib/types";
import { getStatusColor, getCountryFlag, getCountryName, getLocalizedRaceName } from "@/lib/utils";
import { 
  Search, ChevronLeft, ChevronRight, Globe, Map, Info, List, Grid, 
  Filter, Award, UserCheck, Trophy, Users
} from "lucide-react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Define master age categories
const MASTER_CATEGORIES = [
  { id: 'M35', name: 'M35', gender: 'M', minAge: 35, maxAge: 39 },
  { id: 'M40', name: 'M40', gender: 'M', minAge: 40, maxAge: 44 },
  { id: 'M45', name: 'M45', gender: 'M', minAge: 45, maxAge: 49 },
  { id: 'M50', name: 'M50', gender: 'M', minAge: 50, maxAge: 54 },
  { id: 'M55', name: 'M55', gender: 'M', minAge: 55, maxAge: 59 },
  { id: 'M60', name: 'M60', gender: 'M', minAge: 60, maxAge: 64 },
  { id: 'M65', name: 'M65', gender: 'M', minAge: 65, maxAge: 69 },
  { id: 'M70+', name: 'M70+', gender: 'M', minAge: 70, maxAge: 150 },
  { id: 'F35', name: 'F35', gender: 'F', minAge: 35, maxAge: 39 },
  { id: 'F40', name: 'F40', gender: 'F', minAge: 40, maxAge: 44 },
  { id: 'F45', name: 'F45', gender: 'F', minAge: 45, maxAge: 49 },
  { id: 'F50', name: 'F50', gender: 'F', minAge: 50, maxAge: 54 },
  { id: 'F55', name: 'F55', gender: 'F', minAge: 55, maxAge: 59 },
  { id: 'F60', name: 'F60', gender: 'F', minAge: 60, maxAge: 64 },
  { id: 'F65', name: 'F65', gender: 'F', minAge: 65, maxAge: 69 },
  { id: 'F70+', name: 'F70+', gender: 'F', minAge: 70, maxAge: 150 },
];

// Function to determine the master category of a participant
const getMasterCategory = (gender: string, age: number) => {
  const category = MASTER_CATEGORIES.find(
    cat => cat.gender === gender && age >= cat.minAge && age <= cat.maxAge
  );
  return category ? category.id : null;
};

const ParticipantsList = () => {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState<ParticipantFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const pageSize = 10;

  // Get all races for filter dropdown
  const { data: races } = useQuery<Race[]>({
    queryKey: ['/api/races'],
  });

  // Get participants with filters
  const { data: participants, isLoading } = useQuery<Participant[]>({
    queryKey: [
      filters.raceid ? `/api/participants?raceid=${filters.raceid}` : 
      filters.country ? `/api/participants?country=${filters.country}` : 
      filters.search ? `/api/participants?search=${filters.search}` : 
      '/api/participants'
    ],
  });

  // Get all unique countries
  const countries = useMemo(() => {
    if (!participants) return [];
    return Array.from(new Set(participants.map(p => p.country))).sort();
  }, [participants]);

  // Apply filters to participants
  const filteredParticipants = useMemo(() => {
    if (!participants) return [];

    return participants.filter(participant => {
      // EMA filter
      if (filters.isEmaParticipant !== undefined && participant.isEmaParticipant !== filters.isEmaParticipant) {
        return false;
      }

      // Gender category filter
      if (filters.genderCategory && participant.gender !== filters.genderCategory) {
        return false;
      }

      // Age category filter
      if (filters.ageCategory) {
        const category = getMasterCategory(participant.gender, participant.age);
        if (category !== filters.ageCategory) {
          return false;
        }
      }

      // Status filter
      if (filters.status && participant.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [participants, filters]);

  // Pagination
  const totalPages = filteredParticipants ? Math.ceil(filteredParticipants.length / pageSize) : 1;
  const currentParticipants = filteredParticipants ? filteredParticipants.slice((page - 1) * pageSize, page * pageSize) : [];

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Apply search when search button is clicked or Enter is pressed
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setFilters({ ...filters, search: searchTerm });
    } else {
      const { search, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter by race
  const handleRaceFilter = (value: string) => {
    if (value) {
      setFilters({ ...filters, raceid: parseInt(value) });
    } else {
      const { raceid, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Filter by country
  const handleCountryFilter = (value: string) => {
    if (value) {
      setFilters({ ...filters, country: value });
    } else {
      const { country, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Filter by EMA participation
  const handleEmaFilter = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setFilters({ ...filters, isEmaParticipant: checked });
    }
    setPage(1);
  };

  // Filter by gender category
  const handleGenderFilter = (value: string) => {
    if (value) {
      setFilters({ ...filters, genderCategory: value });
    } else {
      const { genderCategory, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Filter by age category
  const handleAgeCategoryFilter = (value: string) => {
    if (value) {
      setFilters({ ...filters, ageCategory: value });
    } else {
      const { ageCategory, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Filter by status
  const handleStatusFilter = (value: string) => {
    if (value) {
      setFilters({ ...filters, status: value });
    } else {
      const { status, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setPage(1);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Reset other filters when changing tabs
    setSearchTerm("");
    
    switch(value) {
      case "all":
        setFilters({});
        break;
      case "ema":
        setFilters({ isEmaParticipant: true });
        break;
      case "open":
        setFilters({ isEmaParticipant: false });
        break;
      case "masters":
        // Show only participants 35 years and older
        setFilters({
          // This is just a marker for the tab, actual filtering is done in the filtered participants
          ageCategory: 'masters'
        });
        break;
      case "confirmed":
        setFilters({ status: 'confirmed' });
        break;
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <section id="participants" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('participants.title')}</h2>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
            {t('participants.subtitle')}
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={t('participants.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-2 pr-10 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-2 text-neutral-gray hover:text-primary"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <select 
                className="px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                onChange={handleRaceFilter}
                value={filters.raceid || ""}
              >
                <option value="">{t('participants.allRaces')}</option>
                {races?.map(race => (
                  <option key={race.id} value={race.id}>
                    {getLocalizedRaceName(race, i18n.language as any)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select 
                className="px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                onChange={handleCountryFilter}
                value={filters.country || ""}
              >
                <option value="">{t('participants.allCountries')}</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex border border-neutral-light rounded-md overflow-hidden">
              <button 
                onClick={() => setViewMode("table")} 
                className={`px-3 py-2 flex items-center ${viewMode === "table" 
                  ? "bg-primary text-white" 
                  : "bg-white text-neutral-gray hover:bg-neutral-light"
                }`}
              >
                <List className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">{t('participants.tableView')}</span>
              </button>
              <button 
                onClick={() => setViewMode("card")} 
                className={`px-3 py-2 flex items-center ${viewMode === "card" 
                  ? "bg-primary text-white" 
                  : "bg-white text-neutral-gray hover:bg-neutral-light"
                }`}
              >
                <Grid className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">{t('participants.cardView')}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Participants View (Table or Card) */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-neutral-light">
              <thead className="bg-neutral-light bg-opacity-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">
                    {t('participants.table.name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">
                    {t('participants.table.country')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">
                    {t('participants.table.race')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">
                    {t('participants.table.bib')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">
                    {t('participants.table.status')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-light">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      {t('common.loading')}
                    </td>
                  </tr>
                ) : currentParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      {t('participants.noParticipants')}
                    </td>
                  </tr>
                ) : (
                  currentParticipants.map(participant => {
                    const race = races?.find(r => r.id === participant.raceid);
                    
                    return (
                      <tr key={participant.id} className="hover:bg-neutral-light hover:bg-opacity-20 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                              <span className="font-bold">
                                {participant.firstname[0]}{participant.lastname[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{participant.firstname} {participant.lastname}</div>
                              <div className="text-sm text-neutral-gray">
                                {participant.gender}, {participant.age}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="group relative">
                            <div className="flex items-center cursor-pointer">
                              <div className="text-2xl mr-2 transform transition-transform group-hover:scale-125">
                                {getCountryFlag(participant.country)}
                              </div>
                              <span className="text-sm">{participant.country}</span>
                            </div>
                            
                            {/* Tooltip that appears on hover */}
                            <div className="absolute left-0 top-full mt-2 z-10 bg-white p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <div className="flex items-center">
                                <div className="text-3xl mr-3">
                                  {getCountryFlag(participant.country)}
                                </div>
                                <div>
                                  <div className="font-bold">{getCountryName(participant.country)}</div>
                                  <div className="text-xs text-slate-gray mt-1">
                                    <div className="flex items-center">
                                      <Info className="h-3 w-3 mr-1" />
                                      <span>{t('participants.countryParticipants', { count: 
                                        participants?.filter(p => p.country === participant.country).length || 0
                                      })}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium ${
                            race?.difficulty === 'beginner' ? 'bg-accent bg-opacity-10 text-accent' :
                            race?.difficulty === 'intermediate' ? 'bg-secondary bg-opacity-10 text-secondary' :
                            'bg-primary bg-opacity-10 text-primary'
                          } rounded-full`}>
                            {race ? getLocalizedRaceName(race, i18n.language as any) : t('participants.unknownRace')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {participant.bibNumber || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(participant.status)} rounded-full`}>
                            {t(`participants.status.${participant.status}`)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                {t('common.loading')}
              </div>
            ) : currentParticipants.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                {t('participants.noParticipants')}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentParticipants.map(participant => {
                  const race = races?.find(r => r.id === participant.raceid);
                  
                  return (
                    <div key={participant.id} 
                         className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white mr-4">
                            <span className="font-bold text-lg">
                              {participant.firstname[0]}{participant.lastname[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{participant.firstname} {participant.lastname}</h3>
                            <div className="text-sm text-neutral-gray">
                              {t(`participants.gender.${participant.gender.toLowerCase()}`)} • {participant.age} {t('participants.table.age')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mt-4">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3 w-8">
                              {getCountryFlag(participant.country)}
                            </div>
                            <span>{getCountryName(participant.country)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Map className="w-5 h-5 mr-3 ml-1.5 text-neutral-gray" />
                            <div>
                              <span className={`px-2 py-1 text-xs font-medium ${
                                race?.difficulty === 'beginner' ? 'bg-accent bg-opacity-10 text-accent' :
                                race?.difficulty === 'intermediate' ? 'bg-secondary bg-opacity-10 text-secondary' :
                                'bg-primary bg-opacity-10 text-primary'
                              } rounded-full`}>
                                {race ? getLocalizedRaceName(race, i18n.language as any) : t('participants.unknownRace')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <span className="text-sm text-neutral-gray mr-2">{t('participants.table.bibNumber')}:</span>
                              <span className="font-medium">{participant.bibNumber || '-'}</span>
                            </div>
                            
                            <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(participant.status)} rounded-full`}>
                              {t(`participants.status.${participant.status}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {participants && participants.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-gray">
                {t('participants.pagination.showing')} <span className="font-medium">{(page - 1) * pageSize + 1}</span> {t('participants.pagination.to')} <span className="font-medium">{Math.min(page * pageSize, participants.length)}</span> {t('participants.pagination.of')} <span className="font-medium">{participants.length}</span> {t('participants.pagination.entries')}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => goToPage(page - 1)} 
                disabled={page === 1}
                className="px-3 py-1 border border-neutral-light rounded-md bg-white text-neutral-gray hover:bg-neutral-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around the current page
                let pageNum;
                if (totalPages <= 5) {
                  // If we have 5 or fewer pages, show all
                  pageNum = i + 1;
                } else if (page <= 3) {
                  // Near the start
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  // Near the end
                  pageNum = totalPages - 4 + i;
                } else {
                  // In the middle
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button 
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 border rounded-md ${
                      page === pageNum 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-neutral-light bg-white text-neutral-gray hover:bg-neutral-light'
                    } transition-colors duration-200`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={() => goToPage(page + 1)} 
                disabled={page === totalPages}
                className="px-3 py-1 border border-neutral-light rounded-md bg-white text-neutral-gray hover:bg-neutral-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ParticipantsList;
