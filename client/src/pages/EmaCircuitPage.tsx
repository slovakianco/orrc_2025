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
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                {t("emaCircuit.overview.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">{t("emaCircuit.overview.content")}</p>
              <p className="font-semibold mb-2">{t("emaCircuit.overview.objectives")}</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                {[0, 1, 2, 3, 4].map((index) => (
                  <li key={index} className="text-neutral-700">
                    {t(`emaCircuit.overview.objectivesList.${index}`)}
                  </li>
                ))}
              </ul>
              <p className="text-neutral-700 font-medium italic">
                {t("emaCircuit.overview.focus")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-md border-primary/20 h-full">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {t("emaCircuit.participation.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">{t("emaCircuit.participation.content")}</p>
              <p className="mb-2 font-medium">{t("emaCircuit.participation.note1")}</p>
              <p className="text-neutral-700">{t("emaCircuit.participation.note2")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-md border-primary/20">
          <CardHeader className="bg-primary/5">
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
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              {t("emaCircuit.rankings.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">{t("emaCircuit.rankings.content")}</p>
            <p className="mb-4">{t("emaCircuit.rankings.local")}</p>
            <p className="mb-4 font-medium">{t("emaCircuit.rankings.eligibility")}</p>
            <p className="mb-4">{t("emaCircuit.rankings.points")}</p>
            <p className="mb-4 text-primary font-medium">{t("emaCircuit.rankings.specialPrize")}</p>
            <p>{t("emaCircuit.rankings.ceremony")}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-primary/20 mb-12">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            {t("emaCircuit.calendar.title")}
          </CardTitle>
          <CardDescription>
            Coming Soon
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p>{t("emaCircuit.calendar.content")}</p>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleDownloadPDF}
          variant="outline" 
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