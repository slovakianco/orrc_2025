import { useTranslation } from "react-i18next";
import { Trophy, Medal, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResultsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white text-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Trophy className="mx-auto h-16 w-16 text-black-400 mb-4" />
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              {t("results.title", "Race Results")}
            </h1>
            <p className="text-xl md:text-2xl text-black-100 max-w-3xl mx-auto">
              {t(
                "results.subtitle",
                "Official results from Stana de Vale Trail Race 2025",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardTitle className="flex items-center text-2xl">
                <Medal className="mr-3 h-8 w-8" />
                {t("results.33km.title", "Trail Run 33K Results")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {t("results.categories.open", "Open Category")}
                  </span>
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {t("results.categories.national", "National Championship")}
                  </span>
                  <Award className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {t("results.categories.ema", "EMA Classification")}
                  </span>
                  <Award className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
              <CardTitle className="flex items-center text-2xl">
                <Medal className="mr-3 h-8 w-8" />
                {t("results.11km.title", "Trail Run 11K Results")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {t("results.categories.open", "Open Category")}
                  </span>
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {t("results.categories.national", "National Championship")}
                  </span>
                  <Award className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {t("results.categories.ema", "EMA Classification")}
                  </span>
                  <Award className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Embedded Results */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white">
            <p className="text-center text-green-100 mt-2">
              {t(
                "results.official.subtitle",
                "Complete rankings and classifications",
              )}
            </p>
          </CardHeader>
          <CardContent className="p-0 relative overflow-hidden">
            {/* Embedded Results iframe */}
            <div 
              className="w-full"
              style={{
                height: "900px",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <iframe
                src="https://my-run.ro/stana-de-vale-trail-race-2025-rezultate/"
                title="Race Results"
                className="border-0"
                allowFullScreen
                loading="lazy"
                style={{
                  width: "100%",
                  height: "1400px",
                  position: "absolute",
                  top: "-200px",
                  left: "0",
                  border: "none",
                  outline: "none"
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <ExternalLink className="h-8 w-8 text-yellow-600 mr-3" />
                <h3 className="text-2xl font-bold text-yellow-800">
                  {t("results.external.title", "View Full Results")}
                </h3>
              </div>
              <p className="text-yellow-700 mb-6 text-lg">
                {t(
                  "results.external.description",
                  "For the complete results with all details, visit the official results page.",
                )}
              </p>
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-md"
                onClick={() =>
                  window.open(
                    "https://my-run.ro/stana-de-vale-trail-race-2025-rezultate/",
                    "_blank",
                  )
                }
              >
                {t("results.external.button", "Open Full Results Page")}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
