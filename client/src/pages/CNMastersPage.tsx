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
        title="Campionatul Naţional de Alergare Montană Masters"
        subtitle="Ediția 2025 - Stâna de Vale"
      />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Introduction section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 flex items-center">
            <Medal className="mr-2 text-red-600" />
            Campionatul Naţional de Alergare Montană Masters
          </h2>
          <p className="text-neutral-dark mb-6">
            În 2025, Stâna de Vale găzduiește Campionatul Naţional de Alergare Montană Masters pentru categoriile de vârstă 35-79 ani. Competiția este organizată sub egida Federației Române de Atletism și include două curse oficiale.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-600">
              <h3 className="font-bold text-lg mb-3 text-red-700">
                Cursa Long Trail 33km
              </h3>
              <div className="flex items-center mb-2">
                <Mountain className="h-5 w-5 mr-2 text-red-600" />
                <span>33 km / 1700 m D+</span>
              </div>
              <p className="text-neutral-dark">
                Cursa principală a Campionatului Naţional Masters de Alergare Montană, cu o distanță de 33 km și 1700 m diferență de nivel. Această cursă face parte din EMA Off-Road Running Circuit 2025.
              </p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-600">
              <h3 className="font-bold text-lg mb-3 text-red-700">
                Cursa Classic UP/Down 11km
              </h3>
              <div className="flex items-center mb-2">
                <Mountain className="h-5 w-5 mr-2 text-red-600" />
                <span>11 km / 500 m D+</span>
              </div>
              <p className="text-neutral-dark">
                Proba scurtă a Campionatului Naţional Masters de Alergare Montană, cu un traseu clasic up/down de 11 km și 500 m diferență de nivel. Această cursă face parte din EMA Off-Road Running Circuit 2025.
              </p>
            </div>
          </div>
        </div>
        
        {/* Categories section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
            Categorii de vârstă
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-primary/10 text-left">
                  <th className="py-3 px-4 font-semibold">Categorie</th>
                  <th className="py-3 px-4 font-semibold">Vârstă</th>
                  <th className="py-3 px-4 font-semibold">An naștere</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4 font-medium">M35/F35</td>
                  <td className="py-3 px-4">35-39</td>
                  <td className="py-3 px-4">1986-1990</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">M40/F40</td>
                  <td className="py-3 px-4">40-44</td>
                  <td className="py-3 px-4">1981-1985</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">M45/F45</td>
                  <td className="py-3 px-4">45-49</td>
                  <td className="py-3 px-4">1976-1980</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">M50/F50</td>
                  <td className="py-3 px-4">50-54</td>
                  <td className="py-3 px-4">1971-1975</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">M55/F55</td>
                  <td className="py-3 px-4">55-59</td>
                  <td className="py-3 px-4">1966-1970</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">M60/F60</td>
                  <td className="py-3 px-4">60-64</td>
                  <td className="py-3 px-4">1961-1965</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">M65/F65</td>
                  <td className="py-3 px-4">65-69</td>
                  <td className="py-3 px-4">1956-1960</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">M70/F70</td>
                  <td className="py-3 px-4">70+</td>
                  <td className="py-3 px-4">1955 and earlier</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mt-6 text-sm text-neutral-dark/80">
            Notă: Vârsta se calculează conform regulamentelor FRA pentru competițiile de alergare montană Masters.
          </p>
        </div>
        
        {/* Rules section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
            Regulament
          </h2>
          
          <ul className="list-disc list-inside space-y-3 text-neutral-dark">
            <li>Campionatul Naţional Masters de Alergare Montană se desfășoară în cadrul competiției Stana de Vale Trail Race.</li>
            <li>Participanții trebuie să aibă vârsta de minim 35 de ani împliniți la data competiției.</li>
            <li>Cursele se desfășoară conform regulamentului general al competiției și regulamentelor FRA.</li>
            <li>Participanții la Campionatul Naţional Masters vor fi clasați și în clasamentul general al competiției.</li>
            <li>Premiile pentru Campionatul Naţional Masters vor fi acordate în cadrul ceremoniei de premiere.</li>
          </ul>
        </div>
        
        {/* Federation info */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
            Comisia de Atletism Masters (CAM)
          </h2>
          
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <h3 className="font-bold text-lg mb-2">Comisia de Atletism Masters</h3>
              <p className="text-neutral-dark mb-4">
                Comisia de Atletism Masters coordonează activitatea atletică pentru sportivii Masters (35+ ani) din România, organizând campionate naționale pentru diverse probe, inclusiv alergare montană. Competițiile se desfășoară conform regulamentelor internaționale WMA (World Masters Athletics).
              </p>
              
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="font-semibold w-20">Website:</span>
                  <a href="https://www.fracam.ro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    www.fracam.ro
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-20">Email:</span>
                  <span className="text-neutral-dark">contact (at) fracam.ro</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-20">Facebook:</span>
                  <a href="https://www.facebook.com/RomanianMastersAthletics/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    /RomanianMastersAthletics
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