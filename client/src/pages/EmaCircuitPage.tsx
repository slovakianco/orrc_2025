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
                  <th className="py-3 px-4 text-left border">Date</th>
                  <th className="py-3 px-4 text-left border">Event</th>
                  <th className="py-3 px-4 text-left border">Location</th>
                  <th className="py-3 px-4 text-left border">Website</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border">April 20</td>
                  <td className="py-3 px-4 border">Denia - Spain (Maraton Carreras por Montana)</td>
                  <td className="py-3 px-4 border">Denia, Spain</td>
                  <td className="py-3 px-4 border">
                    <a href="https://montgotrail.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      montgotrail.com
                    </a>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border">May 18</td>
                  <td className="py-3 px-4 border">Montegrappa - Italy (Bassano)</td>
                  <td className="py-3 px-4 border">Bassano, Italy</td>
                  <td className="py-3 px-4 border">
                    <a href="https://www.bassanorunningfestival.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      bassanorunningfestival.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border">June 1</td>
                  <td className="py-3 px-4 border">Pico Blanco - Spain (Liérganes)</td>
                  <td className="py-3 px-4 border">Liérganes, Spain</td>
                  <td className="py-3 px-4 border">
                    <a href="https://picoblanco.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      picoblanco.com
                    </a>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border">July 5</td>
                  <td className="py-3 px-4 border">Stana de Vale - Romania</td>
                  <td className="py-3 px-4 border">Stana de Vale, Romania</td>
                  <td className="py-3 px-4 border">
                    <a href="/" className="text-primary hover:underline font-semibold">
                      stanadevaletrail.ro
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border">August 3</td>
                  <td className="py-3 px-4 border">Skopje - North Macedonia</td>
                  <td className="py-3 px-4 border">Skopje, North Macedonia</td>
                  <td className="py-3 px-4 border">
                    <a href="https://trailrunning.mk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      trailrunning.mk
                    </a>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border">August 24</td>
                  <td className="py-3 px-4 border">Olympos - Greece</td>
                  <td className="py-3 px-4 border">Olympos, Greece</td>
                  <td className="py-3 px-4 border">
                    <a href="https://olympusolympicotrail.gr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      olympusolympicotrail.gr
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border">September 14</td>
                  <td className="py-3 px-4 border">Innsbruck - Austria (K43) - EMA MOUNTAIN RUNNING CHAMPIONSHIP</td>
                  <td className="py-3 px-4 border">Innsbruck, Austria</td>
                  <td className="py-3 px-4 border">
                    <a href="https://innsbruck-alpine.at" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      innsbruck-alpine.at
                    </a>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border">September 28</td>
                  <td className="py-3 px-4 border">Balaton - Hungary (Ultrabalaton)</td>
                  <td className="py-3 px-4 border">Balaton, Hungary</td>
                  <td className="py-3 px-4 border">
                    <a href="https://ultrabalaton.hu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ultrabalaton.hu
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border">October 19</td>
                  <td className="py-3 px-4 border">SumatraTRAIL - Portugal (Madeira)</td>
                  <td className="py-3 px-4 border">Madeira, Portugal</td>
                  <td className="py-3 px-4 border">
                    <a href="https://sumatratrail.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      sumatratrail.com
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
