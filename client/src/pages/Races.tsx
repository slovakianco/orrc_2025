import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mountain, Star } from "lucide-react";
import { Link } from "wouter";

type RaceCategory = "all" | "ultra" | "marathon" | "half" | "25k" | "10k";

export default function Races() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<RaceCategory>("all");

  const races = [
    { 
      id: 1, 
      name: "race.ultra.name", 
      category: "ultra", 
      elevation: 3500, 
      difficulty: "race.difficulty.expert", 
      date: "race.dates.july17" 
    },
    { 
      id: 2, 
      name: "race.half.name", 
      category: "half", 
      elevation: 850, 
      difficulty: "race.difficulty.intermediate", 
      date: "race.dates.july16" 
    },
    { 
      id: 3, 
      name: "race.10k.name", 
      category: "10k", 
      elevation: 350, 
      difficulty: "race.difficulty.beginner", 
      date: "race.dates.july15" 
    },
    { 
      id: 4, 
      name: "race.marathon.name", 
      category: "marathon", 
      elevation: 1200, 
      difficulty: "race.difficulty.intermediate", 
      date: "race.dates.july16" 
    },
    { 
      id: 5, 
      name: "race.25k.name", 
      category: "25k", 
      elevation: 600, 
      difficulty: "race.difficulty.intermediate", 
      date: "race.dates.july15" 
    }
  ];

  const filterCategories: { value: RaceCategory; label: string }[] = [
    { value: "all", label: "race.filter.all" },
    { value: "ultra", label: "race.filter.ultra" },
    { value: "marathon", label: "race.filter.marathon" },
    { value: "half", label: "race.filter.half" },
    { value: "25k", label: "race.filter.25k" },
    { value: "10k", label: "race.filter.10k" },
  ];

  return (
    <div>
      <section className="py-8 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("races.title")}
          </h1>
          <p className="text-lg opacity-90">
            {t("races.subtitle")}
          </p>
        </div>
      </section>
      
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="mr-4 text-neutral-dark font-accent font-medium">
                {t("races.filterBy")}:
              </div>
              {filterCategories.map((category) => (
                <Button
                  key={category.value}
                  onClick={() => setFilter(category.value)}
                  variant={filter === category.value ? "default" : "outline"}
                  className={`rounded-full text-sm font-accent font-medium transition duration-300 ${
                    filter === category.value 
                      ? "bg-[#2E7D32] text-white" 
                      : "bg-neutral-light text-neutral-dark"
                  }`}
                >
                  {t(category.label)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {races
              .filter((race) => filter === "all" || filter === race.category)
              .map((race) => (
                <Card key={race.id} className="bg-neutral-light rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                  <div 
                    className="h-40 bg-cover bg-center" 
                    style={{ backgroundImage: `url('https://source.unsplash.com/random/800x400?trail,mountains,running&${race.id}')` }}
                  ></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-[#2E7D32] text-white text-xs font-accent font-bold px-2 py-1 rounded">
                        {race.category.toUpperCase()}
                      </span>
                      <span className="text-neutral-medium text-sm">{t(race.date)}</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-2 text-neutral-dark">
                      {t(race.name)}
                    </h3>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Mountain className="text-[#2E7D32] mr-2 h-4 w-4" />
                        <span className="text-sm text-neutral-dark">
                          {t("race.elevation", { elevation: race.elevation })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="text-[#2E7D32] mr-2 h-4 w-4" />
                        <span className="text-sm text-neutral-dark">
                          {t("race.difficulty.label")}: {t(race.difficulty)}
                        </span>
                      </div>
                    </div>
                    <div className="elevation-chart h-[60px] rounded-md relative overflow-hidden mb-4 bg-gradient-to-b from-transparent via-[#2E7D32] to-[#C62828]" aria-hidden="true">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 25%22%3E%3Cpath fill=%22none%22 stroke=%22white%22 stroke-width=%220.5%22 d=%22M0,25 L15,15 Q25,5 35,15 T55,10 T75,20 T100,5 L100,25 Z%22/%3E%3C/svg%3E')] bg-no-repeat"></div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="default" 
                        className="flex-1 text-center bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-accent font-medium py-2 rounded transition duration-300"
                      >
                        {t("races.details")}
                      </Button>
                      <Link href="/registration">
                        <Button 
                          variant="default" 
                          className="flex-1 text-center bg-[#FF5722] hover:bg-[#E64A19] text-white font-accent font-medium py-2 rounded transition duration-300"
                        >
                          {t("races.register")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
