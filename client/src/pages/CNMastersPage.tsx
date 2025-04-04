import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Medal, Award, Mountain } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const CNMastersPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-light/30">
      <PageHeader 
        title={t('cnMasters.title')}
        subtitle={t('cnMasters.subtitle')}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Introduction section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 flex items-center">
            <Medal className="mr-2 text-red-600" />
            {t('cnMasters.introTitle')}
          </h2>
          <p className="text-neutral-dark mb-6">
            {t('cnMasters.introText')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-600">
              <h3 className="font-bold text-lg mb-3 text-red-700">
                {t('cnMasters.race1.title')}
              </h3>
              <div className="flex items-center mb-2">
                <Mountain className="h-5 w-5 mr-2 text-red-600" />
                <span>33 km / 1700 m D+</span>
              </div>
              <p className="text-neutral-dark">
                {t('cnMasters.race1.description')}
              </p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-600">
              <h3 className="font-bold text-lg mb-3 text-red-700">
                {t('cnMasters.race2.title')}
              </h3>
              <div className="flex items-center mb-2">
                <Mountain className="h-5 w-5 mr-2 text-red-600" />
                <span>11 km / 500 m D+</span>
              </div>
              <p className="text-neutral-dark">
                {t('cnMasters.race2.description')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Categories section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
            {t('cnMasters.categoriesTitle')}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-primary/10 text-left">
                  <th className="py-3 px-4 font-semibold">{t('cnMasters.categoryColumn')}</th>
                  <th className="py-3 px-4 font-semibold">{t('cnMasters.ageColumn')}</th>
                  <th className="py-3 px-4 font-semibold">{t('cnMasters.yearColumn')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4 font-medium">Masters A</td>
                  <td className="py-3 px-4">35-39</td>
                  <td className="py-3 px-4">1986-1990</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Masters B</td>
                  <td className="py-3 px-4">40-44</td>
                  <td className="py-3 px-4">1981-1985</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Masters C</td>
                  <td className="py-3 px-4">45-49</td>
                  <td className="py-3 px-4">1976-1980</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Masters D</td>
                  <td className="py-3 px-4">50-54</td>
                  <td className="py-3 px-4">1971-1975</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Masters E</td>
                  <td className="py-3 px-4">55-59</td>
                  <td className="py-3 px-4">1966-1970</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Masters F</td>
                  <td className="py-3 px-4">60-64</td>
                  <td className="py-3 px-4">1961-1965</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Masters G</td>
                  <td className="py-3 px-4">65+</td>
                  <td className="py-3 px-4">1960 and earlier</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mt-6 text-sm text-neutral-dark/80">
            {t('cnMasters.categoriesNote')}
          </p>
        </div>
        
        {/* Rules section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
            {t('cnMasters.rulesTitle')}
          </h2>
          
          <ul className="list-disc list-inside space-y-3 text-neutral-dark">
            <li>{t('cnMasters.rules.1')}</li>
            <li>{t('cnMasters.rules.2')}</li>
            <li>{t('cnMasters.rules.3')}</li>
            <li>{t('cnMasters.rules.4')}</li>
            <li>{t('cnMasters.rules.5')}</li>
          </ul>
        </div>
        
        {/* Federation info */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
            {t('cnMasters.federationTitle')}
          </h2>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="h-36 w-36 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                <span className="text-gray-500 text-sm">FRA Logo</span>
              </div>
            </div>
            
            <div className="w-full md:w-3/4">
              <h3 className="font-bold text-lg mb-2">Federația Română de Atletism</h3>
              <p className="text-neutral-dark mb-4">
                {t('cnMasters.federationDescription')}
              </p>
              
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="font-semibold w-20">{t('cnMasters.website')}:</span>
                  <a href="https://www.fra.ro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    www.fra.ro
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-20">{t('cnMasters.email')}:</span>
                  <a href="mailto:office@fra.ro" className="text-primary hover:underline">
                    office@fra.ro
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CNMastersPage;