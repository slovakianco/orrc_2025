import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";

// Create a custom sponsor type for our hardcoded sponsors
interface CustomSponsor {
  id: number;
  name: string;
  description: string;
  descriptionRo: string;
  descriptionFr: string;
  descriptionDe: string;
  logoUrl: string;
  website: string;
  level: string;
  order_index: number;
}

// Custom getLocalizedDescription function that works with our CustomSponsor type
const getLocalizedDescription = (
  sponsor: CustomSponsor,
  language: string,
): string => {
  switch (language) {
    case "ro":
      return sponsor.descriptionRo;
    case "fr":
      return sponsor.descriptionFr;
    case "de":
      return sponsor.descriptionDe;
    default:
      return sponsor.description;
  }
};

const SponsorsShowcase = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // Use hardcoded sponsors instead of loading from API
  const sponsors: CustomSponsor[] = [
    {
      id: 1,
      name: "Ety Market",
      description:
        "One of the leading supermarkets in Beiuș, offering a wide range of quality products.",
      descriptionRo:
        "Unul dintre principalele supermarketuri din Beiuș, oferind o gamă largă de produse de calitate.",
      descriptionFr:
        "L'une des principales chaînes de supermarchés de Beiuș, offrant une large gamme de produits de qualité.",
      descriptionDe:
        "Eine der führenden Supermarktketten in Beiuș, die eine breite Palette an Qualitätsprodukten anbietet.",
      logoUrl: "/logo1.png",
      website: "https://www.facebook.com/etymarketbeius",
      level: "premium",
      order_index: 1,
    },
    {
      id: 2,
      name: "Pantano",
      description:
        "High-quality building materials and home improvement solutions provider.",
      descriptionRo:
        "Furnizor de materiale de construcții și soluții de îmbunătățire a locuinței de înaltă calitate.",
      descriptionFr:
        "Fournisseur de matériaux de construction et de solutions d'amélioration de l'habitat de haute qualité.",
      descriptionDe:
        "Anbieter von hochwertigen Baumaterialien und Heimwerkerlösungen.",
      logoUrl: "/logo2.png",
      website: "https://pantano.ro",
      level: "premium",
      order_index: 2,
    },
    {
      id: 3,
      name: "Divin Garden",
      description:
        "Premium nuts, dried fruits, and healthy snacks provider supporting athletes and outdoor enthusiasts.",
      descriptionRo:
        "Furnizor premium de nuci, fructe uscate și gustări sănătoase, susținând atleții și pasionații de activități în aer liber.",
      descriptionFr:
        "Fournisseur premium de noix, fruits secs et collations saines, soutenant les athlètes et les amateurs de plein air.",
      descriptionDe:
        "Premium-Anbieter von Nüssen, Trockenfrüchten und gesunden Snacks, die Sportler und Outdoor-Enthusiasten unterstützen.",
      logoUrl: "/logo3.png",
      website: "https://divingarden.com",
      level: "premium",
      order_index: 3,
    },
    {
      id: 4,
      name: "European Drinks",
      description:
        "Romanian producer of soft drinks and mineral waters with international presence.",
      descriptionRo:
        "Producător român de băuturi răcoritoare și ape minerale, cu prezență internațională.",
      descriptionFr:
        "Producteur roumain de boissons rafraîchissantes et d'eaux minérales avec présence internationale.",
      descriptionDe:
        "Rumänischer Hersteller von Erfrischungsgetränken und Mineralwasser mit internationaler Präsenz.",
      logoUrl: "/logo_4.png",
      website: "https://edinternational.ro/",
      level: "premium",
      order_index: 4,
    },
    {
      id: 5,
      name: "EuropeanFood",
      description:
        "Leader in snacks, cereals and food products exported to over 27 countries.",
      descriptionRo:
        "Lider în snacksuri, cereale și produse alimentare exportate în peste 27 de țări.",
      descriptionFr:
        "Leader dans les collations, céréales et produits alimentaires exportés dans plus de 27 pays.",
      descriptionDe:
        "Marktführer bei Snacks, Cerealien und Lebensmitteln, die in über 27 Länder exportiert werden.",
      logoUrl: "/logo_5.png",
      website: "https://europeanfoodinternational.ro/",
      level: "premium",
      order_index: 5,
    },
  ];

  // Split sponsors by level
  const premiumSponsors = sponsors.filter(
    (sponsor) => sponsor.level === "premium",
  );
  const standardSponsors = sponsors.filter(
    (sponsor) => sponsor.level === "standard",
  );

  return (
    <section id="sponsors" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {t("sponsors.title")}
          </h2>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
            {t("sponsors.subtitle")}
          </p>
        </div>

        {/* Premium Sponsors */}
        {premiumSponsors.length > 0 && (
          <div className="mb-12">
            <h3 className="font-heading font-bold text-xl text-center mb-8">
              {t("sponsors.premiumTitle")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="bg-white rounded-lg p-8 shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-48 h-32 mb-6 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-full h-full flex items-center justify-center">
                      <img
                        src={sponsor.logoUrl}
                        alt={`${sponsor.name} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{sponsor.name}</h4>
                  <p className="text-center text-neutral-gray mb-4">
                    {getLocalizedDescription(sponsor, language)}
                  </p>
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline flex items-center"
                  >
                    {t("sponsors.visitWebsite")}
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
            <h3 className="font-heading font-bold text-xl text-center mb-8">
              {t("sponsors.standardTitle")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {standardSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-32 h-24 mb-4 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-md w-full h-full flex items-center justify-center">
                      <img
                        src={sponsor.logoUrl}
                        alt={`${sponsor.name} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  <h4 className="font-bold mb-1">{sponsor.name}</h4>
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline flex items-center"
                  >
                    {t("sponsors.visit")}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="mailto:contact@stanatrailrace.ro"
            className="inline-block border-2 border-primary text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
          >
            {t("sponsors.becomeButton")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsShowcase;
