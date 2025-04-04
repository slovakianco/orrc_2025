import { useTranslation } from "react-i18next";
import { FileDown, Award, Users, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

const EmaCircuitPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to handle PDF download
  const handleDownloadPDF = () => {
    window.location.href = "/api/ema-circuit/regulations";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
          {t("emaCircuit.title")}
        </h1>
        <p className="text-xl font-medium mb-6">{t("emaCircuit.subtitle")}</p>
        <Button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 mx-auto"
          size="lg"
        >
          <FileDown className="h-5 w-5" />
          {t("emaCircuit.downloadButton")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card className="shadow-md border-primary/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                {t("emaCircuit.overview.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">{t("emaCircuit.overview.content")}</p>
              <p className="font-semibold mb-2">
                {t("emaCircuit.overview.objectives")}
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                {[0, 1, 2, 3, 4].map((index) => (
                  <li key={index}>
                    {t(`emaCircuit.overview.objectivesList.${index}`)}
                  </li>
                ))}
              </ul>
              <p className="font-medium italic">
                {t("emaCircuit.overview.focus")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-md border-primary/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {t("emaCircuit.participation.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">{t("emaCircuit.participation.content")}</p>
              <p className="mb-2 font-medium">
                {t("emaCircuit.participation.note1")}
              </p>
              <p>{t("emaCircuit.participation.note2")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              {t("emaCircuit.liability.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">{t("emaCircuit.liability.content")}</p>
            <p className="mb-4">{t("emaCircuit.liability.insurance")}</p>
            <p>{t("emaCircuit.liability.health")}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              {t("emaCircuit.rankings.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">{t("emaCircuit.rankings.content")}</p>
            <p className="mb-4">{t("emaCircuit.rankings.local")}</p>
            <p className="mb-4 font-medium">
              {t("emaCircuit.rankings.eligibility")}
            </p>
            <p className="mb-4">{t("emaCircuit.rankings.points")}</p>
            <p className="mb-4 text-primary font-medium">
              {t("emaCircuit.rankings.specialPrize")}
            </p>
            <p className="mb-4">{t("emaCircuit.rankings.ceremony")}</p>
            
            <div className="mt-4 bg-primary/5 p-4 rounded-md">
              <p className="text-sm">
                For detailed ranking rules and complete information, visit the{" "}
                <a 
                  href="https://european-masters-athletics.org/ema-off-road-running-circuit-2025/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  official EMA Circuit page
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-primary/20 mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            {t("emaCircuit.calendar.title")}
          </CardTitle>
          <CardDescription>Official EMA Off-Road Running Circuit 2025</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-6">{t("emaCircuit.calendar.content")}</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-primary/10">
                  <th className="py-3 px-4 text-left border">{t("emaCircuit.calendar.date")}</th>
                  <th className="py-3 px-4 text-left border">{t("emaCircuit.calendar.event")}</th>
                  <th className="py-3 px-4 text-left border">{t("emaCircuit.calendar.country")}</th>
                  <th className="py-3 px-4 text-left border">{t("emaCircuit.calendar.links") || "Links"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border">May 25, 2025</td>
                  <td className="py-3 px-4 border">Ventoux Mountain Running</td>
                  <td className="py-3 px-4 border">France</td>
                  <td className="py-3 px-4 border">
                    <div className="space-y-2">
                      <a 
                        href="https://ventouxmountainrunning.com/inscriptions-mdv/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block text-sm"
                      >
                        Website
                      </a>
                      <a 
                        href="https://ventouxmountainrunning.com/inscriptions-mdv/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block text-sm"
                      >
                        Registration
                      </a>
                      <span className="text-sm">Contact: deniv84@orange.fr</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border">June 22, 2025</td>
                  <td className="py-3 px-4 border">10 Miglia Internazionale Aviano Piancavallo</td>
                  <td className="py-3 px-4 border">Italy</td>
                  <td className="py-3 px-4 border">
                    <div className="space-y-2">
                      <a 
                        href="https://www.piancavallo.run/eventi/10-miglia-aviano-piancavallo/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block text-sm"
                      >
                        Website
                      </a>
                      <a 
                        href="https://my.raceresult.com/324754/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block text-sm"
                      >
                        Registration
                      </a>
                    </div>
                  </td>
                </tr>
                <tr className="bg-primary/5 font-semibold">
                  <td className="py-3 px-4 border">July 5, 2025</td>
                  <td className="py-3 px-4 border">Stana de Vale Trail Race</td>
                  <td className="py-3 px-4 border">Romania</td>
                  <td className="py-3 px-4 border">
                    <div className="space-y-2">
                      <span className="text-sm font-bold text-primary">You are here</span>
                      <a 
                        href="/registration" 
                        className="text-primary hover:underline block text-sm"
                      >
                        Registration
                      </a>
                    </div>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border">September 13, 2025</td>
                  <td className="py-3 px-4 border">Camporredondo de Alba</td>
                  <td className="py-3 px-4 border">Spain</td>
                  <td className="py-3 px-4 border">
                    <div className="space-y-2">
                      <a 
                        href="https://www.fedatletismocyl.es/index.php/master-1/calendario-master" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block text-sm"
                      >
                        Federation Website
                      </a>
                      <span className="text-sm italic">Registration opens June 2025</span>
                      <span className="text-sm">Contact: master@fedatletismocyl.es</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 rounded-md bg-yellow-50 border border-yellow-200">
            <p className="text-sm font-medium text-yellow-800">
              {t("emaCircuit.calendar.updateNote") || "Please note: This calendar has been updated as per the official 2025 EMA Off-Road Running Circuit regulations. Check back regularly for any additional event announcements or changes."}
            </p>
          </div>
          
          <div className="mt-6 bg-primary/5 p-4 rounded-md">
            <p className="font-medium text-sm">
              Official calendar of the EMA Off-Road Running Circuit 2025. For more information, visit the{" "}
              <a 
                href="https://european-masters-athletics.org/ema-off-road-running-circuit-2025/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                European Masters Athletics website
              </a>.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2"
          size="lg"
        >
          <FileDown className="h-5 w-5" />
          {t("emaCircuit.downloadButton")}
        </Button>
      </div>
    </div>
  );
};

export default EmaCircuitPage;
