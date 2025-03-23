import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Sponsor } from "@/lib/types";
import { getLocalizedSponsorDescription } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const SponsorsShowcase = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language as 'en' | 'ro' | 'fr' | 'de';

  // Fetch all sponsors
  const { data: allSponsors, isLoading } = useQuery<Sponsor[]>({
    queryKey: ['/api/sponsors'],
  });

  // Split sponsors by level
  const premiumSponsors = allSponsors?.filter(sponsor => sponsor.level === 'premium') || [];
  const standardSponsors = allSponsors?.filter(sponsor => sponsor.level === 'standard') || [];

  if (isLoading) {
    return (
      <section id="sponsors" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('sponsors.title')}</h2>
          <div className="animate-pulse flex justify-center mt-8">
            <div className="h-8 w-8 bg-primary opacity-75 rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sponsors" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('sponsors.title')}</h2>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
            {t('sponsors.subtitle')}
          </p>
        </div>
        
        {/* Premium Sponsors */}
        {premiumSponsors.length > 0 && (
          <div className="mb-12">
            <h3 className="font-heading font-bold text-xl text-center mb-8">{t('sponsors.premiumTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumSponsors.map((sponsor) => (
                <div 
                  key={sponsor.id} 
                  className="bg-white rounded-lg p-8 shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-48 h-32 mb-6 flex items-center justify-center">
                    <div className="bg-neutral-light p-4 rounded-md w-full h-full flex items-center justify-center">
                      <span className="font-bold text-xl text-primary">{sponsor.logoPlaceholder}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{sponsor.name}</h4>
                  <p className="text-center text-neutral-gray mb-4">
                    {getLocalizedSponsorDescription(sponsor, language)}
                  </p>
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary font-medium hover:underline flex items-center"
                  >
                    {t('sponsors.visitWebsite')}
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Standard Sponsors */}
        {standardSponsors.length > 0 && (
          <div>
            <h3 className="font-heading font-bold text-xl text-center mb-8">{t('sponsors.standardTitle')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {standardSponsors.map((sponsor) => (
                <div 
                  key={sponsor.id} 
                  className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-32 h-24 mb-4 flex items-center justify-center">
                    <div className="bg-neutral-light p-2 rounded-md w-full h-full flex items-center justify-center">
                      <span className="font-bold text-primary">{sponsor.logoPlaceholder}</span>
                    </div>
                  </div>
                  <h4 className="font-bold mb-1">{sponsor.name}</h4>
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline flex items-center"
                  >
                    {t('sponsors.visit')}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <a 
            href="mailto:sponsors@trailrun.com" 
            className="inline-block border-2 border-primary text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
          >
            {t('sponsors.becomeButton')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsShowcase;
