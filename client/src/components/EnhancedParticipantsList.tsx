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
  { id: 'M70', name: 'M70+', gender: 'M', minAge: 70, maxAge: 150 },
  { id: 'F35', name: 'F35', gender: 'F', minAge: 35, maxAge: 39 },
  { id: 'F40', name: 'F40', gender: 'F', minAge: 40, maxAge: 44 },
  { id: 'F45', name: 'F45', gender: 'F', minAge: 45, maxAge: 49 },
  { id: 'F50', name: 'F50', gender: 'F', minAge: 50, maxAge: 54 },
  { id: 'F55', name: 'F55', gender: 'F', minAge: 55, maxAge: 59 },
  { id: 'F60', name: 'F60', gender: 'F', minAge: 60, maxAge: 64 },
  { id: 'F65', name: 'F65', gender: 'F', minAge: 65, maxAge: 69 },
  { id: 'F70', name: 'F70+', gender: 'F', minAge: 70, maxAge: 150 },
];

// Function to determine the master category of a participant
const getMasterCategory = (gender: string, age: number) => {
  const category = MASTER_CATEGORIES.find(
    cat => cat.gender === gender && age >= cat.minAge && age <= cat.maxAge
  );
  return category ? category.id : null;
};

const EnhancedParticipantsList = () => {
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
      filters.raceId ? `/api/participants?raceId=${filters.raceId}` : 
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
        // Special case for 'masters' filter - show all master age categories
        if (filters.ageCategory === 'masters') {
          const category = getMasterCategory(participant.gender, participant.age);
          return category !== null; // Return true if participant has a master category
        } else {
          const category = getMasterCategory(participant.gender, participant.age);
          if (category !== filters.ageCategory) {
            return false;
          }
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
    if (value && value !== "all_races") {
      setFilters({ ...filters, raceId: parseInt(value) });
    } else {
      const { raceId, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Filter by country
  const handleCountryFilter = (value: string) => {
    if (value && value !== "all_countries") {
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
    if (value && value !== "all_genders") {
      setFilters({ ...filters, genderCategory: value });
    } else {
      const { genderCategory, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Filter by age category
  const handleAgeCategoryFilter = (value: string) => {
    if (value && value !== "all_ages") {
      setFilters({ ...filters, ageCategory: value });
    } else {
      const { ageCategory, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Filter by status
  const handleStatusFilter = (value: string) => {
    if (value && value !== "all_statuses") {
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

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <div className="flex justify-center mb-4">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{t('participants.filters.all')}</span>
              </TabsTrigger>
              <TabsTrigger value="ema" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>{t('participants.filters.ema')}</span>
              </TabsTrigger>
              <TabsTrigger value="open" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span>{t('participants.filters.open')}</span>
              </TabsTrigger>
              <TabsTrigger value="masters" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>{t('participants.filters.masters')}</span>
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <span>{t('participants.filters.confirmed')}</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Tab content */}
          <TabsContent value={activeTab}>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 flex-grow">
                  <div className="flex-grow max-w-md">
                    <div className="relative">
                      <Input 
                        type="text" 
                        placeholder={t('participants.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                    <Select
                      value={filters.raceId?.toString() || ""}
                      onValueChange={handleRaceFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('participants.allRaces')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_races">{t('participants.allRaces')}</SelectItem>
                        {races?.map(race => (
                          <SelectItem key={race.id} value={race.id.toString()}>
                            {getLocalizedRaceName(race, i18n.language as any)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select
                      value={filters.country || ""}
                      onValueChange={handleCountryFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('participants.allCountries')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_countries">{t('participants.allCountries')}</SelectItem>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>
                            {getCountryFlag(country)} {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" size="icon" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                    <Filter className="h-4 w-4" />
                  </Button>
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
              
              {/* Additional Filters Panel (toggles visibility) */}
              {showFilterMenu && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="block mb-2">{t('participants.filters.emaFilter')}</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="ema-mode" 
                          checked={filters.isEmaParticipant || false}
                          onCheckedChange={handleEmaFilter}
                        />
                        <Label htmlFor="ema-mode">{t('participants.filters.showEmaOnly')}</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">{t('participants.filters.genderCategory')}</Label>
                      <Select
                        value={filters.genderCategory || ""}
                        onValueChange={handleGenderFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('participants.filters.allGenders')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_genders">{t('participants.filters.allGenders')}</SelectItem>
                          <SelectItem value="M">{t('participants.filters.male')}</SelectItem>
                          <SelectItem value="F">{t('participants.filters.female')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">{t('participants.filters.ageCategory')}</Label>
                      <Select
                        value={filters.ageCategory || ""}
                        onValueChange={handleAgeCategoryFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('participants.filters.allAges')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_ages">{t('participants.filters.allAges')}</SelectItem>
                          <SelectItem value="masters">{t('participants.filters.allMasters')}</SelectItem>
                          {MASTER_CATEGORIES.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">{t('participants.filters.status')}</Label>
                      <Select
                        value={filters.status || ""}
                        onValueChange={handleStatusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('participants.filters.allStatuses')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_statuses">{t('participants.filters.allStatuses')}</SelectItem>
                          <SelectItem value="pending">{t('participants.status.pending')}</SelectItem>
                          <SelectItem value="confirmed">{t('participants.status.confirmed')}</SelectItem>
                          <SelectItem value="cancelled">{t('participants.status.cancelled')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-2 flex items-end">
                      <Button variant="outline" onClick={resetFilters}>
                        {t('participants.filters.resetFilters')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Filter tags/badges */}
            {Object.keys(filters).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.isEmaParticipant !== undefined && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {filters.isEmaParticipant ? t('participants.filters.ema') : t('participants.filters.open')}
                    <button className="ml-1" onClick={() => {
                      const { isEmaParticipant, ...rest } = filters;
                      setFilters(rest);
                    }}>&times;</button>
                  </Badge>
                )}
                
                {filters.raceId && races && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Map className="h-3 w-3" />
                    {getLocalizedRaceName(races.find(r => r.id === filters.raceId) || races[0], i18n.language as any)}
                    <button className="ml-1" onClick={() => {
                      const { raceId, ...rest } = filters;
                      setFilters(rest);
                    }}>&times;</button>
                  </Badge>
                )}
                
                {filters.country && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {getCountryFlag(filters.country)} {filters.country}
                    <button className="ml-1" onClick={() => {
                      const { country, ...rest } = filters;
                      setFilters(rest);
                    }}>&times;</button>
                  </Badge>
                )}
                
                {filters.genderCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.genderCategory === 'M' ? '♂' : '♀'} 
                    {filters.genderCategory === 'M' ? t('participants.filters.male') : t('participants.filters.female')}
                    <button className="ml-1" onClick={() => {
                      const { genderCategory, ...rest } = filters;
                      setFilters(rest);
                    }}>&times;</button>
                  </Badge>
                )}
                
                {filters.ageCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {filters.ageCategory === 'masters' 
                      ? t('participants.filters.allMasters') 
                      : filters.ageCategory}
                    <button className="ml-1" onClick={() => {
                      const { ageCategory, ...rest } = filters;
                      setFilters(rest);
                    }}>&times;</button>
                  </Badge>
                )}
                
                {filters.status && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    {t(`participants.status.${filters.status}`)}
                    <button className="ml-1" onClick={() => {
                      const { status, ...rest } = filters;
                      setFilters(rest);
                    }}>&times;</button>
                  </Badge>
                )}
                
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    "{filters.search}"
                    <button className="ml-1" onClick={() => {
                      const { search, ...rest } = filters;
                      setFilters(rest);
                    }}>&times;</button>
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="ml-auto text-xs"
                >
                  {t('participants.filters.clearAll')}
                </Button>
              </div>
            )}

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
                        const race = races?.find(r => r.id === participant.raceId);
                        const masterCategory = getMasterCategory(participant.gender, participant.age);
                        
                        return (
                          <tr key={participant.id} className="hover:bg-neutral-light hover:bg-opacity-20 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                                  <span className="font-bold">
                                    {participant.firstName[0]}{participant.lastName[0]}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium">{participant.firstName} {participant.lastName}</div>
                                  <div className="text-sm text-neutral-gray">
                                    {participant.gender}, {participant.age}
                                    {masterCategory && (
                                      <Badge variant="outline" className="ml-2">
                                        {masterCategory}
                                      </Badge>
                                    )}
                                    {participant.isEmaParticipant && (
                                      <Badge className="ml-2 bg-amber-500">
                                        {t('participants.filters.ema')}
                                      </Badge>
                                    )}
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
                                      <div className="font-medium">{getCountryName(participant.country)}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {race && (
                                <div className="flex items-center">
                                  <Map className="h-4 w-4 text-primary mr-2" />
                                  <span className="font-medium">
                                    {getLocalizedRaceName(race, i18n.language as any)}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {participant.bibNumber ? (
                                <span className="px-3 py-1 inline-flex text-md leading-5 font-semibold rounded-full bg-primary bg-opacity-10 text-primary">
                                  {participant.bibNumber}
                                </span>
                              ) : (
                                <span className="text-sm text-neutral-gray italic">
                                  {t('participants.notAssigned')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(participant.status)}`}>
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
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  <div className="text-center col-span-full py-8">
                    {t('common.loading')}
                  </div>
                ) : currentParticipants.length === 0 ? (
                  <div className="text-center col-span-full py-8">
                    {t('participants.noParticipants')}
                  </div>
                ) : (
                  currentParticipants.map(participant => {
                    const race = races?.find(r => r.id === participant.raceId);
                    const masterCategory = getMasterCategory(participant.gender, participant.age);
                    
                    return (
                      <Card key={participant.id} className="overflow-hidden transition-transform hover:scale-105 duration-300">
                        <CardHeader className="bg-primary text-white p-4 pb-6">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-primary">
                                <span className="font-bold text-lg">
                                  {participant.firstName[0]}{participant.lastName[0]}
                                </span>
                              </div>
                              <div className="flex mt-2 space-x-2">
                                {participant.isEmaParticipant && (
                                  <Badge className="bg-amber-500">
                                    {t('participants.filters.ema')}
                                  </Badge>
                                )}
                                {masterCategory && (
                                  <Badge variant="outline" className="bg-transparent border-white text-white">
                                    {masterCategory}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-3xl">
                              {getCountryFlag(participant.country)}
                            </div>
                          </div>
                          <CardTitle className="mt-3 text-xl">
                            {participant.firstName} {participant.lastName}
                          </CardTitle>
                          <CardDescription className="text-white flex items-center">
                            <Globe className="h-4 w-4 mr-1" />
                            <span>{participant.country}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-700 text-sm font-medium">{t('participants.race')}:</span>
                              <span className="font-medium">
                                {race && getLocalizedRaceName(race, i18n.language as any)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-700 text-sm font-medium">{t('participants.gender')}:</span>
                              <span className="font-medium">{participant.gender}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-700 text-sm font-medium">{t('participants.age')}:</span>
                              <span className="font-medium">{participant.age}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-700 text-sm font-medium">{t('participants.bibNumber')}:</span>
                              <span>
                                {participant.bibNumber ? (
                                  <span className="font-bold text-primary">
                                    {participant.bibNumber}
                                  </span>
                                ) : (
                                  <span className="text-gray-500 italic">
                                    {t('participants.notAssigned')}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full w-full justify-center ${getStatusColor(participant.status)}`}>
                            {t(`participants.status.${participant.status}`)}
                          </span>
                        </CardFooter>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
            
            {/* Pagination */}
            {filteredParticipants && filteredParticipants.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center">
                  <button 
                    onClick={() => goToPage(page - 1)} 
                    disabled={page === 1}
                    className={`mr-2 p-2 rounded-md ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-light'}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="flex items-center mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`mx-1 h-8 w-8 rounded-md flex items-center justify-center ${
                            pageNum === page 
                            ? 'bg-primary text-white font-bold' 
                            : 'hover:bg-neutral-light'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="mx-1">...</span>
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="mx-1 h-8 w-8 rounded-md flex items-center justify-center hover:bg-neutral-light"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => goToPage(page + 1)} 
                    disabled={page === totalPages}
                    className={`ml-2 p-2 rounded-md ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-light'}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default EnhancedParticipantsList;