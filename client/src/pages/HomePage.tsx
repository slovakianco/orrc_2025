import { useTranslation } from "react-i18next";
import HeroSection from "@/components/HeroSection";
import QuickInfoSection from "@/components/QuickInfoSection";
import RacesSection from "@/components/RacesSection";
import SectionsOverview from "@/components/SectionsOverview";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <HeroSection />
      <QuickInfoSection />
      <div className="py-16 bg-stone">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-pine">{t('home.aboutCompetition')}</h2>
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg leading-relaxed mb-4">
              {t('home.competitionDescription1')}
            </p>
            <p className="text-lg leading-relaxed mb-4">
              {t('home.competitionDescription2')}
            </p>
            <p className="text-lg leading-relaxed italic text-pine-green">
              {t('home.competitionDescription3')}
            </p>
          </div>
        </div>
      </div>
      <RacesSection title={t('home.featuredRaces')} />
      <SectionsOverview />
    </div>
  );
};

export default HomePage;
