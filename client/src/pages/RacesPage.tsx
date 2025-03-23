import { useTranslation } from "react-i18next";
import RacesSection from "@/components/RacesSection";

const RacesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-8">
      <RacesSection fullPage={true} />
    </div>
  );
};

export default RacesPage;
