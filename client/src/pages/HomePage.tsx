import { useTranslation } from "react-i18next";
import HeroSection from "@/components/HeroSection";
import QuickInfoSection from "@/components/QuickInfoSection";
import RacesSection from "@/components/RacesSection";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <HeroSection />
      <QuickInfoSection />
      <RacesSection title={t('home.featuredRaces')} />
    </div>
  );
};

export default HomePage;
