import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Award } from "lucide-react";
import { FaGlobe, FaFileAlt, FaHandshake } from "react-icons/fa";

export default function Sponsors() {
  const { t } = useTranslation();

  const sponsors = [
    {
      id: 1,
      name: "SportGear Pro",
      logo: "SPONSOR 1",
      tier: "gold",
      description: "sponsors.sponsor1.description",
      website: "https://example.com/sportgearpro"
    },
    {
      id: 2,
      name: "Mountain Energy Drinks",
      logo: "SPONSOR 2",
      tier: "gold",
      description: "sponsors.sponsor2.description",
      website: "https://example.com/mountainenergy"
    },
    {
      id: 3,
      name: "TrailTech",
      logo: "SPONSOR 3",
      tier: "silver",
      description: "sponsors.sponsor3.description",
      website: "https://example.com/trailtech"
    },
    {
      id: 4,
      name: "NatureHikes",
      logo: "SPONSOR 4",
      tier: "silver",
      description: "sponsors.sponsor4.description",
      website: "https://example.com/naturehikes"
    },
    {
      id: 5,
      name: "RunMasters",
      logo: "SPONSOR 5",
      tier: "bronze",
      description: "sponsors.sponsor5.description",
      website: "https://example.com/runmasters"
    },
    {
      id: 6,
      name: "Outdoor Fitness",
      logo: "SPONSOR 6",
      tier: "bronze",
      description: "sponsors.sponsor6.description",
      website: "https://example.com/outdoorfitness"
    }
  ];

  const sponsorshipPackages = [
    {
      tier: "gold",
      title: "sponsors.packages.gold.title",
      price: "€5,000",
      benefits: [
        "sponsors.packages.gold.benefit1",
        "sponsors.packages.gold.benefit2",
        "sponsors.packages.gold.benefit3",
        "sponsors.packages.gold.benefit4",
        "sponsors.packages.gold.benefit5"
      ]
    },
    {
      tier: "silver",
      title: "sponsors.packages.silver.title",
      price: "€2,500",
      benefits: [
        "sponsors.packages.silver.benefit1",
        "sponsors.packages.silver.benefit2",
        "sponsors.packages.silver.benefit3",
        "sponsors.packages.silver.benefit4"
      ]
    },
    {
      tier: "bronze",
      title: "sponsors.packages.bronze.title",
      price: "€1,000",
      benefits: [
        "sponsors.packages.bronze.benefit1",
        "sponsors.packages.bronze.benefit2",
        "sponsors.packages.bronze.benefit3"
      ]
    }
  ];

  return (
    <div>
      <section className="py-8 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("sponsors.title")}
          </h1>
          <p className="text-lg opacity-90">
            {t("sponsors.subtitle")}
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold mb-8 text-center text-neutral-dark">
            {t("sponsors.currentSponsors")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {sponsors.map((sponsor) => (
              <Card key={sponsor.id} className={`
                overflow-hidden shadow-md hover:shadow-xl transition duration-300
                ${sponsor.tier === 'gold' 
                  ? 'border-2 border-[#FFD700]' 
                  : sponsor.tier === 'silver' 
                    ? 'border-2 border-[#C0C0C0]' 
                    : 'border-2 border-[#CD7F32]'}
              `}>
                <div className={`
                  p-4 text-center font-accent font-bold uppercase text-white
                  ${sponsor.tier === 'gold' 
                    ? 'bg-[#FFD700] bg-opacity-80' 
                    : sponsor.tier === 'silver' 
                      ? 'bg-[#C0C0C0] bg-opacity-80' 
                      : 'bg-[#CD7F32] bg-opacity-80'}
                `}>
                  {t(`sponsors.tiers.${sponsor.tier}`)}
                </div>
                <CardContent className="p-6">
                  <div className="w-full h-16 bg-neutral-light flex items-center justify-center rounded mb-4">
                    <div className="text-neutral-medium font-bold text-xl">{sponsor.logo}</div>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3 text-neutral-dark">
                    {sponsor.name}
                  </h3>
                  <p className="text-neutral-dark mb-4">
                    {t(sponsor.description)}
                  </p>
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-[#2E7D32] hover:underline"
                  >
                    <FaGlobe className="mr-1" />
                    {t("sponsors.visitWebsite")}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-neutral-light rounded-lg p-8 shadow-md mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-neutral-dark">
                {t("sponsors.becomeASponsor")}
              </h2>
              <p className="max-w-2xl mx-auto text-neutral-dark">
                {t("sponsors.becomeASponsorText")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sponsorshipPackages.map((pkg, idx) => (
                <Card key={idx} className={`
                  overflow-hidden shadow-md transition duration-300
                  ${pkg.tier === 'gold' 
                    ? 'border-2 border-[#FFD700]' 
                    : pkg.tier === 'silver' 
                      ? 'border-2 border-[#C0C0C0]' 
                      : 'border-2 border-[#CD7F32]'}
                `}>
                  <div className={`
                    p-4 text-center font-heading font-bold text-xl text-white
                    ${pkg.tier === 'gold' 
                      ? 'bg-[#FFD700] bg-opacity-80' 
                      : pkg.tier === 'silver' 
                        ? 'bg-[#C0C0C0] bg-opacity-80' 
                        : 'bg-[#CD7F32] bg-opacity-80'}
                  `}>
                    {t(pkg.title)}
                  </div>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold text-[#2E7D32]">{pkg.price}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.benefits.map((benefit, benefitIdx) => (
                        <li key={benefitIdx} className="flex items-start">
                          <Award className="h-5 w-5 text-[#2E7D32] mr-2 flex-shrink-0 mt-0.5" />
                          <span>{t(benefit)}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
                      {t("sponsors.contactUs")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-heading font-bold mb-4 text-neutral-dark">
              {t("sponsors.moreInfo")}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline"
                className="flex items-center gap-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
              >
                <FaFileAlt />
                {t("sponsors.downloadBrochure")}
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
              >
                <FaHandshake />
                {t("sponsors.scheduleCall")}
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {t("sponsors.emailUs")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
