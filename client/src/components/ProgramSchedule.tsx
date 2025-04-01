import { useTranslation } from "react-i18next";
import { Download, Clock, MapPin } from "lucide-react";

const ProgramSchedule = () => {
  const { t } = useTranslation();

  // Days structure for our new program based on translation keys
  const days = [
    { id: "day1", label: "program.dayTitles.day1" }, // Friday, July 4
    { id: "day2", label: "program.dayTitles.day2" }, // Saturday, July 5
  ];

  return (
    <section id="program" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('program.title')}</h2>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
            {t('program.subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-heading font-bold mb-8 text-center">
            {t('program.detailedSchedule')}
          </h3>
          
          {/* Day 1: Friday, July 4 */}
          <div className="relative mb-12">
            <div className="absolute top-0 bottom-0 left-14 w-1 bg-primary bg-opacity-20"></div>
            <div className="mb-8 flex">
              <div className="bg-primary text-white rounded-lg p-3 z-10 shadow-md">
                <span className="text-xl font-bold block">4</span>
                <span className="text-sm">{t('months.6')}</span>
              </div>
              <div className="ml-8">
                <h3 className="font-heading font-bold text-2xl">
                  {t('program.dayTitles.day1')}
                </h3>
              </div>
            </div>

            <div className="ml-28 space-y-6">
              {/* Kit Pickup - Friday */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-base font-medium text-gray-700">10:00 - 20:00</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.kitPickup.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.kitPickup.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.kitPickup.friday')}</p>
                </div>
              </div>

              {/* Technical Meeting */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-base font-medium text-gray-700">18:00</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.technicalMeeting.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.technicalMeeting.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.technicalMeeting.time')}</p>
                </div>
              </div>

              {/* Pasta Party */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-base font-medium text-gray-700">18:30</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.pastaParty.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.pastaParty.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.pastaParty.time')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Day 2: Saturday, July 5 */}
          <div className="relative mb-12">
            <div className="absolute top-0 bottom-0 left-14 w-1 bg-primary bg-opacity-20"></div>
            <div className="mb-8 flex">
              <div className="bg-primary text-white rounded-lg p-3 z-10 shadow-md">
                <span className="text-xl font-bold block">5</span>
                <span className="text-sm">{t('months.6')}</span>
              </div>
              <div className="ml-8">
                <h3 className="font-heading font-bold text-2xl">
                  {t('program.dayTitles.day2')}
                </h3>
              </div>
            </div>

            <div className="ml-28 space-y-6">
              {/* Kit Pickup - Saturday */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-base font-medium text-gray-700">06:00 - 08:00</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.kitPickup.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.kitPickup.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.kitPickup.saturday')}</p>
                </div>
              </div>

              {/* 33km Race Start */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-base font-medium text-gray-700">08:30</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.raceStart33k.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.raceStart33k.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.raceStart33k.time')}</p>
                </div>
              </div>

              {/* 11km Race Start */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-base font-medium text-gray-700">09:30</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.raceStart11k.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.raceStart11k.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.raceStart11k.time')}</p>
                </div>
              </div>

              {/* Post-Race Meal */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:items-center gap-4 mb-4">
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.finishMeal.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.finishMeal.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.finishMeal.description')}</p>
                </div>
              </div>

              {/* Awards Ceremony */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-base font-medium text-gray-700">15:00</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.awards.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.awards.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.awards.time')}</p>
                </div>
              </div>

              {/* Banquet */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-base font-medium text-gray-700">18:30</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t('program.events.banquet.title')}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-primary-dark font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('program.events.banquet.location')}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{t('program.events.banquet.time')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a 
              href="#" 
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              {t('program.downloadButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramSchedule;