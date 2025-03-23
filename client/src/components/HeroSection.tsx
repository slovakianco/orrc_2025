import { useTranslation } from "react-i18next";
import { Link } from "wouter";

interface HeroSectionProps {
  imageUrl?: string;
}

const HeroSection = ({ imageUrl = "https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen min-h-[600px]">
      <div className="absolute inset-0 bg-gray-900 opacity-50 z-10"></div>
      <div className="absolute inset-0 z-0">
        <img src={imageUrl} alt={t('hero.imageAlt')} className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 h-full flex items-center relative z-20">
        <div className="max-w-3xl">
          <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
            {t('hero.date')}
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/registration" className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
              {t('hero.registerButton')}
            </Link>
            <Link href="/races" className="bg-white hover:bg-neutral-light text-primary font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
              {t('hero.exploreButton')}
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-70 z-10"></div>
    </section>
  );
};

export default HeroSection;
