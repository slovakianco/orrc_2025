import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type RaceCategory = "all" | "ultra" | "marathon" | "half" | "25k" | "10k";

export default function Races() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<RaceCategory>("all");

  const races = [
    { 
      id: 1, 
      name: "race.33k.name", 
      category: "33k", 
      elevation: 1500, 
      difficulty: "race.difficulty.intermediate", 
      date: "race.dates.july16",
      traceDeTrailIframe: "https://tracedetrail.fr/en/iframe/6296"
    },
    { 
      id: 2, 
      name: "race.11k.name", 
      category: "11k", 
      elevation: 500, 
      difficulty: "race.difficulty.beginner", 
      date: "race.dates.july15" 
    }
  ];

  const filterCategories: { value: RaceCategory; label: string }[] = [
    { value: "all", label: "race.filter.all" },
    { value: "33k", label: "race.filter.33k" },
    { value: "11k", label: "race.filter.11k" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-12 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-heading font-bold mb-4">
            {t("races.title")}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            {t("races.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-4">
              <div className="mr-4 text-neutral-dark font-accent font-medium text-lg">
                {t("races.filterBy")}:
              </div>
              {filterCategories.map((category) => (
                <Button
                  key={category.value}
                  onClick={() => setFilter(category.value)}
                  variant={filter === category.value ? "default" : "outline"}
                  className={`rounded-full px-6 py-2 text-base font-accent font-medium transition-all duration-300 transform hover:scale-105 ${
                    filter === category.value 
                      ? "bg-[#2E7D32] text-white shadow-lg" 
                      : "bg-white text-neutral-dark border-2 border-[#2E7D32]/20"
                  }`}
                >
                  {t(category.label)}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {races.map((race) => (
              <div
                key={race.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="h-48 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] relative">
                  <div className="absolute inset-0 opacity-20 bg-[url('/trail-pattern.svg')]"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white text-xs font-medium mb-2 bg-black/30 w-fit px-3 py-1 rounded-full">
                      {t(race.date)}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {t(race.name)}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 flex flex-col">
                      <span className="text-sm text-gray-500">{t("races.elevation")}</span>
                      <span className="font-semibold">{race.elevation}m</span>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="text-sm text-gray-500">{t("races.difficulty.label")}</span>
                      <span className="font-semibold">{t(race.difficulty)}</span>
                    </div>
                  </div>
                  <Button 
                    variant="default"
                    className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    {t("races.viewDetails")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}