import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Race, Participant, ParticipantFilters } from "@/lib/types";
import { getStatusColor, getCountryFlag, getCountryName, getLocalizedRaceName } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, Globe, Map, Info } from "lucide-react";

const ParticipantsList = () => {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState<ParticipantFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
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
  const handleRaceFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setFilters({ ...filters, raceId: parseInt(value) });
    } else {
      const { raceId, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Filter by country
  const handleCountryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setFilters({ ...filters, country: value });
    } else {
      const { country, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setPage(1);
  };

  // Pagination
  const totalPages = participants ? Math.ceil(participants.length / pageSize) : 1;
  const currentParticipants = participants ? participants.slice((page - 1) * pageSize, page * pageSize) : [];

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Get countries for filter dropdown
  const countries = participants 
    ? Array.from(new Set(participants.map(p => p.country))).sort()
    : [];

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
                value={filters.raceId || ""}
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
          </div>
        </div>
        
        {/* Participants Table */}
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
