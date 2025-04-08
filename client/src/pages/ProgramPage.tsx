import ProgramSchedule from "@/components/ProgramSchedule";
import { useTranslation } from "react-i18next";
import { MapPin, Building, InfoIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";

const ProgramPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <PageHeader title={t("program.title")} subtitle={t("program.subtitle")} />

      {/* Hotel Iadolina Information */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-primary text-white p-3 rounded-full">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2 flex items-center">
                  {t("program.raceCenter.title")}
                </h3>
                <p className="text-gray-700">
                  {t("program.raceCenter.description")}
                </p>
                <p className="mt-3 font-medium flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Hotel Iadolina, Stana de Vale
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProgramSchedule />
    </div>
  );
};

export default ProgramPage;
