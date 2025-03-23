import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  raceCategory: string;
  bibNumber: number;
}

export default function Participants() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get the participants data from the API
  const { data: participants, isLoading, error } = useQuery({
    queryKey: ["/api/participants"],
    refetchInterval: false,
  });

  // Filter participants based on search query and category
  const filteredParticipants = participants?.filter((participant: Participant) => {
    const matchesSearch = searchQuery === "" || 
      participant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      participant.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || participant.raceCategory === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div>
      <section className="py-8 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("participants.title")}
          </h1>
          <p className="text-lg opacity-90">
            {t("participants.subtitle")}
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-end">
            <div className="w-full md:w-1/3">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                {t("participants.searchLabel")}
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="search"
                  type="text"
                  placeholder={t("participants.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                {t("participants.filterByCategory")}
              </Label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={t("participants.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("participants.allCategories")}</SelectItem>
                  <SelectItem value="ultra">{t("race.ultra.name")}</SelectItem>
                  <SelectItem value="marathon">{t("race.marathon.name")}</SelectItem>
                  <SelectItem value="half">{t("race.half.name")}</SelectItem>
                  <SelectItem value="25k">{t("race.25k.name")}</SelectItem>
                  <SelectItem value="10k">{t("race.10k.name")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-neutral-light rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-8">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>{t("participants.errorLoading")}</p>
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>{t("participants.noParticipants")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-accent">{t("participants.bibNumber")}</TableHead>
                      <TableHead className="font-accent">{t("participants.name")}</TableHead>
                      <TableHead className="font-accent">{t("participants.country")}</TableHead>
                      <TableHead className="font-accent">{t("participants.raceCategory")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant: Participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-semibold">{participant.bibNumber}</TableCell>
                        <TableCell>{`${participant.firstName} ${participant.lastName}`}</TableCell>
                        <TableCell>{participant.country}</TableCell>
                        <TableCell>
                          {t(`race.${participant.raceCategory}.name`)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
