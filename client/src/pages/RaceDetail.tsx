import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  Calendar,
  Map,
  Mountain,
  Clock,
  Flag,
  ChevronLeft,
  Download,
} from "lucide-react";
import { Race } from "@/lib/types";
import {
  getDifficultyColor,
  getLocalizedRaceName,
  getLocalizedRaceDescription,
  formatCurrency,
  formatDate,
} from "@/lib/utils";

const RaceDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const raceid = parseInt(id);

  const {
    data: race,
    isLoading,
    error,
  } = useQuery<Race>({
    queryKey: [`/api/races/${raceid}`],
    enabled: !isNaN(raceid),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !race) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-neutral-dark mb-4">
          {t("races.notFound.title")}
        </h2>
        <p className="text-neutral-gray mb-8 text-center">
          {t("races.notFound.message")}
        </p>
        <Link
          href="/races"
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg"
        >
          {t("races.notFound.backButton")}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-light/30 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/races"
            className="inline-flex items-center text-neutral-dark hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>{t("races.backToList")}</span>
          </Link>
        </div>

        {/* Race header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 md:h-80 relative overflow-hidden">
            <img
              src={
                race.imageUrl ||
                `https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80`
              }
              alt={getLocalizedRaceName(race, i18n.language as any)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
              <div
                className={`inline-block py-1 px-3 rounded-full text-sm font-bold mb-3 bg-difficulty-${race.difficulty} text-white`}
              >
                {t(`races.difficulty.${race.difficulty}`)}
              </div>
              <h1 className="text-2xl md:text-4xl font-heading font-bold text-white mb-2">
                {getLocalizedRaceName(race, i18n.language as any)}
              </h1>
              <div className="flex flex-wrap items-center text-white/90 text-sm md:text-base gap-3 md:gap-5">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="text-white">
                    {formatDate(race.date, i18n.language)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Map className="mr-2 h-4 w-4" />
                  <span className="text-white">{race.distance} km</span>
                </div>
                <div className="flex items-center">
                  <Mountain className="mr-2 h-4 w-4" />
                  <span className="text-white">{race.elevation} m D+</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="text-white">{race.id === 1 ? "08:30" : "09:30"}</span>{" "}
                  {/* Different start times for each race */}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Race details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-4 text-primary">
                  {t("races.details.about")}
                </h2>
                <div className="prose prose-lg max-w-none mb-8">
                  <p>
                    {getLocalizedRaceDescription(race, i18n.language as any)}
                  </p>
                </div>

                {/* Aid Stations Section */}
                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-heading font-bold mb-4 text-primary flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                      <span className="text-sm">💧</span>
                    </span>
                    {t("races.details.aidStationsTitle")}
                  </h2>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 md:p-6">
                    <p className="text-sm md:text-base mb-4">
                      {t("races.details.aidStationsDescription")}
                    </p>

                    {race.id === 1 ? (
                      <div className="space-y-3">
                        <h3 className="font-bold text-base md:text-lg text-primary">
                          {t("races.details.aidStationsLocations")} (33km)
                        </h3>
                        <div className="relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-200">
                          <div className="relative mb-6">
                            <div className="absolute left-[-24px] top-0 w-6 h-6 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-600 text-xs font-bold">
                              1
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                              <p className="font-semibold text-primary">
                                {t("races.details.aidStation")} 1 - km 5.4
                              </p>
                              <p className="text-sm text-gray-600">
                                {t("races.details.waterAndSnacks")}
                              </p>
                            </div>
                          </div>
                          <div className="relative mb-6">
                            <div className="absolute left-[-24px] top-0 w-6 h-6 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-600 text-xs font-bold">
                              2
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                              <p className="font-semibold text-primary">
                                {t("races.details.aidStation")} 2 - km 10.4
                              </p>
                              <p className="text-sm text-gray-600">
                                {t("races.details.waterAndSnacks")}
                              </p>
                            </div>
                          </div>
                          <div className="relative mb-6">
                            <div className="absolute left-[-24px] top-0 w-6 h-6 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-600 text-xs font-bold">
                              3
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                              <p className="font-semibold text-primary">
                                {t("races.details.aidStation")} 3 - km 15.5
                              </p>
                              <p className="text-sm text-gray-600">
                                {t("races.details.waterAndSnacks")}
                              </p>
                            </div>
                          </div>
                          <div className="relative mb-6">
                            <div className="absolute left-[-24px] top-0 w-6 h-6 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-600 text-xs font-bold">
                              4
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                              <p className="font-semibold text-primary">
                                {t("races.details.aidStation")} 4 - km 20.9
                              </p>
                              <p className="text-sm text-gray-600">
                                {t("races.details.waterAndSnacks")}
                              </p>
                            </div>
                          </div>
                          <div className="relative mb-6">
                            <div className="absolute left-[-24px] top-0 w-6 h-6 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-600 text-xs font-bold">
                              5
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                              <p className="font-semibold text-primary">
                                {t("races.details.aidStation")} 5 - km 26.6
                              </p>
                              <p className="text-sm text-gray-600">
                                {t("races.details.waterAndSnacks")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="font-bold text-base md:text-lg text-primary">
                          {t("races.details.aidStationsLocations")} (11km)
                        </h3>
                        <div className="relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-200">
                          <div className="relative mb-6">
                            <div className="absolute left-[-24px] top-0 w-6 h-6 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-600 text-xs font-bold">
                              1
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                              <p className="font-semibold text-primary">
                                {t("races.details.aidStation")} 1 - km 5
                              </p>
                              <p className="text-sm text-gray-600">
                                {t("races.details.waterAndSnacks")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Race Map */}
                {race.raceMap && (
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-heading font-bold mb-4 text-primary">
                      {t("races.details.map")}
                    </h2>
                    <div
                      className="bg-white rounded-lg overflow-hidden shadow-md"
                      dangerouslySetInnerHTML={{ __html: race.raceMap }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-neutral-light/50 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-bold mb-4 text-primary">
                    {t("races.details.info")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-light">
                      <span className="text-neutral-dark">
                        {t("races.details.price")}
                      </span>
                      <span className="font-bold text-xl text-primary">
                        {formatCurrency(race.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-light">
                      <span className="text-neutral-dark">
                        {t("races.details.date")}
                      </span>
                      <span className="font-medium">
                        {formatDate(race.date, i18n.language)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-light">
                      <span className="text-neutral-dark">
                        {t("races.details.startTime")}
                      </span>
                      <span className="font-medium">
                        {race.id === 1 ? "08:30" : "09:30"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-light">
                      <span className="text-neutral-dark">
                        {t("races.details.distance")}
                      </span>
                      <span className="font-medium">{race.distance} km</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-light">
                      <span className="text-neutral-dark">
                        {t("races.details.elevation")}
                      </span>
                      <span className="font-medium">{race.elevation} m D+</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-light">
                      <span className="text-neutral-dark">
                        {t("races.details.difficulty")}
                      </span>
                      <span
                        className={`font-medium text-difficulty-${race.difficulty}`}
                      >
                        {t(`races.difficulty.${race.difficulty}`)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-light">
                      <span className="text-neutral-dark">
                        {t("races.details.aidStations")}
                      </span>
                      <span className="font-medium">
                        {race.id === 1 ? 5 : 1}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/registration"
                      className="block w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors duration-300 text-center shadow-md hover:shadow-lg"
                    >
                      {t("races.details.registerButton")}
                    </Link>

                    <a
                      href={`/api/races/${race.id}/gpx`}
                      download
                      className="flex items-center justify-center w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2.5 rounded-lg transition-colors duration-300 text-center border border-primary/20"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t("races.details.downloadGPX")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceDetail;
