import { useTranslation } from "react-i18next";
import { Link } from "wouter";

interface HeroSectionProps {
  imageUrl?: string;
}

const HeroSection = ({ imageUrl = "https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen min-h-[600px]">
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/70 z-10"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src={imageUrl} alt={t('hero.imageAlt')} className="w-full h-full object-cover" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-20">
        <div className="max-w-3xl">
          {/* Event date badge */}
          <span className="inline-block bg-accent text-white px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-md">
            {t('hero.date')}
          </span>
          
          {/* Main title with gradient text */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
            <span className="inline-block bg-gradient-to-r from-white to-neutral-light bg-clip-text text-transparent mb-2">
              {t('hero.title')}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-white text-opacity-90 mb-10 max-w-2xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-5">
            <Link 
              href="/registration" 
              className="bg-accent hover:bg-accent-dark text-white font-bold py-3.5 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('hero.registerButton')}
            </Link>
            <Link 
              href="/races" 
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-bold py-3.5 px-8 rounded-lg transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('hero.exploreButton')}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-dark to-transparent h-32 opacity-80 z-10"></div>
    </section>
  );
};

export default HeroSection;
