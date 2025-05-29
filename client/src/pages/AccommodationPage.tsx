import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Home, Phone, Globe, MapPin, Star, Coffee, Utensils, Wifi, Car } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Accommodation {
  id: number;
  name: string;
  description: string;
  image: string;
  stars: number;
  address: string;
  phone: string;
  website?: string;
  distance: number; // distance from race center in km
  features: string[];
  price: string; // price range
}

const AccommodationPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Accommodation data
  const accommodations: Accommodation[] = [
    {
      id: 1,
      name: "Hotel Iadolina",
      description: "Hotel Iadolina recomandat unde sportivi care vor participa la Stâna de Vale trail race vor avea reducere, camera dublă va fi de 300 lei și single 280 lei cu mic dejun.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      stars: 3,
      address: "Stâna de Vale, Bihor County, Romania",
      phone: "+40744599334",
      website: "https://hoteliadolina.ro",
      distance: 0.1,
      features: ["restaurant", "parking", "wifi", "breakfast"],
      price: "280-300 lei",
    },
  ];

  // Feature icons mapping
  const featureIcons: Record<string, any> = {
    restaurant: <Utensils className="h-5 w-5" />,
    parking: <Car className="h-5 w-5" />,
    wifi: <Wifi className="h-5 w-5" />,
    breakfast: <Coffee className="h-5 w-5" />
  };

  return (
    <div className="min-h-screen bg-neutral-light/30">
      <PageHeader 
        title={t('accommodation.title')}
        subtitle={t('accommodation.subtitle')}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
            {t('accommodation.introTitle')}
          </h2>
          <p className="text-neutral-dark mb-6">
            {t('accommodation.introText')}
          </p>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
            <h3 className="text-orange-800 font-semibold mb-2">{t('accommodation.noteTitle')}</h3>
            <p className="text-orange-700">
              {t('accommodation.noteText')}
            </p>
          </div>
        </div>
        
        {/* Accommodations listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {accommodations.map((accommodation) => (
            <div key={accommodation.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={accommodation.image} 
                  alt={accommodation.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/80 rounded-full text-sm font-bold flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 mr-0.5 ${i < accommodation.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-primary text-white rounded-full text-sm font-bold">
                  {accommodation.price}
                </div>
              </div>
              
              <div className="p-5 flex-grow">
                <h3 className="font-bold text-lg text-primary mb-2">{accommodation.name}</h3>
                
                <div className="flex items-center mb-3 text-sm">
                  <MapPin className="h-4 w-4 text-red-500 mr-1.5" />
                  <span className="text-neutral-dark">
                    {t('accommodation.distanceFromCenter', { distance: accommodation.distance })}
                  </span>
                </div>
                
                <p className="text-neutral-dark/80 text-sm mb-4">{accommodation.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {accommodation.features.map((feature) => (
                    <div key={feature} className="px-2 py-1 bg-stone-beige rounded-md text-primary-dark text-xs flex items-center">
                      {featureIcons[feature]}
                      <span className="ml-1 capitalize">{t(`accommodation.features.${feature}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-5 pt-0 text-sm border-t border-gray-100">
                <div className="flex items-center mb-2">
                  <Home className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-neutral-dark">{accommodation.address}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <a href={`tel:${accommodation.phone}`} className="text-primary hover:underline">
                    {accommodation.phone}
                  </a>
                </div>
                {accommodation.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-500 mr-2" />
                    <a 
                      href={accommodation.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {accommodation.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional accommodation options */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
            {t('accommodation.alternativesTitle')}
          </h2>
          <p className="text-neutral-dark mb-6">
            {t('accommodation.alternativesText')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-beige/30 p-5 rounded-lg">
              <h3 className="font-bold text-lg mb-3">{t('accommodation.camping.title')}</h3>
              <p className="text-neutral-dark mb-4">
                {t('accommodation.camping.description')}
              </p>
              <div className="text-sm bg-white p-3 rounded">
                <p className="font-medium mb-1">{t('accommodation.camping.priceTitle')}</p>
                <p className="text-neutral-dark">{t('accommodation.camping.priceDetails')}</p>
              </div>
            </div>
            
            <div className="bg-stone-beige/30 p-5 rounded-lg">
              <h3 className="font-bold text-lg mb-3">{t('accommodation.beius.title')}</h3>
              <p className="text-neutral-dark mb-4">
                {t('accommodation.beius.description')}
              </p>
              <div className="text-sm bg-white p-3 rounded">
                <p className="font-medium mb-1">{t('accommodation.beius.distanceTitle')}</p>
                <p className="text-neutral-dark">{t('accommodation.beius.distanceDetails')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact for assistance */}
        <div className="bg-primary/10 rounded-lg p-6 md:p-8 text-center">
          <h3 className="font-bold text-lg md:text-xl text-primary mb-3">
            {t('accommodation.needHelpTitle')}
          </h3>
          <p className="text-neutral-dark mb-5 max-w-2xl mx-auto">
            {t('accommodation.needHelpText')}
          </p>
          <a 
            href="mailto:info@stanadevaletrail.ro" 
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            {t('accommodation.contactButton')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccommodationPage;