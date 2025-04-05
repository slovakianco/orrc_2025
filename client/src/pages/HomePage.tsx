import { useTranslation } from "react-i18next";
import HeroSection from "@/components/HeroSection";
import QuickInfoSection from "@/components/QuickInfoSection";
import RacesSection from "@/components/RacesSection";
import SectionsOverview from "@/components/SectionsOverview";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Main Hero Image - Displayed First */}
      <div className="w-full relative">
        <img 
          src="/IMG_3836.jpeg" 
          alt={t('hero.landscapeAlt')} 
          className="w-full h-[60vh] object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-7xl font-bold text-center drop-shadow-lg">
            {t('hero.mainTitle')}
          </h1>
        </div>
      </div>
      
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
      
      {/* Stana de Vale Description Section with Image */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 order-2 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-800">{t('home.stanaDeVale.title')}</h2>
              <div className="prose max-w-none">
                <p className="mb-4">
                  {t('home.stanaDeVale.description1')}
                </p>
                <p className="mb-4">
                  {t('home.stanaDeVale.description2')}
                </p>
                <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-3">{t('home.stanaDeVale.hostTitle')}</h3>
                <p className="mb-4">
                  {t('home.stanaDeVale.hostDescription')}
                </p>
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-1">
              <img
                src="/33km.webp"
                alt={t('hero.trailAlt')}
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      <RacesSection title={t('home.featuredRaces')} />
      <SectionsOverview />
    </div>
  );
};

export default HomePage;
