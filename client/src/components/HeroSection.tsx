import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import CountdownTimer from "./CountdownTimer";

interface HeroSectionProps {
  imageUrl?: string;
}

const HeroSection = ({ imageUrl = "/images/33km.webp" }: HeroSectionProps) => {
  const { t } = useTranslation();
  const eventDate = new Date('2025-06-06T08:00:00');

  return (
    <section className="relative h-screen min-h-[700px]">
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-gray/80 to-pine-green/80 z-10"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src={imageUrl} alt={t('hero.imageAlt')} className="w-full h-full object-cover" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20">
        <div className="max-w-3xl">
          {/* Event date badge */}
          <span className="inline-block bg-sunset text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 shadow-md">
            {t('hero.date')}
          </span>
          
          {/* Main title with gradient text */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white mb-4 md:mb-6 leading-tight shadow-text">
            <span className="inline-block text-white mb-1 md:mb-2">
              {t('hero.title')}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white text-opacity-90 mb-6 md:mb-10 max-w-2xl leading-relaxed shadow-text">
            {t('hero.subtitle')}
          </p>
          
          {/* Enhanced description */}
          <div className="bg-slate-gray/70 backdrop-blur-sm p-4 rounded-lg mb-6 max-w-2xl border border-white/20">
            <p className="text-white text-opacity-90 leading-relaxed">
              {t('hero.enhancedDescription')}
            </p>
          </div>
          
          {/* Details section */}
          <div className="bg-sunset/80 backdrop-blur-sm p-4 rounded-lg mb-6 max-w-2xl border border-white/20">
            <p className="text-white font-medium">
              {t('home.details')}
            </p>
          </div>
          
          {/* Countdown Timer */}
          <div className="mb-8">
            <CountdownTimer targetDate={eventDate} className="bg-slate-gray/60 backdrop-blur-sm p-4 rounded-lg border border-white/20" />
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 md:gap-5">
            <Link 
              href="/registration" 
              className="bg-sunset hover:bg-sunset/90 text-white font-bold py-2.5 md:py-3.5 px-6 md:px-8 text-sm md:text-base rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              {t('hero.registerButton')}
            </Link>
            <Link 
              href="/races" 
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 font-bold py-2.5 md:py-3.5 px-6 md:px-8 text-sm md:text-base rounded-lg transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('hero.exploreButton')}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-gray to-transparent h-32 opacity-80 z-10"></div>
    </section>
  );
};

export default HeroSection;
