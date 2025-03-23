import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ProgramEvent } from "@/lib/types";
import { formatDate, getLocalizedEventTitle, getLocalizedEventDescription, groupEventsByDate } from "@/lib/utils";
import { Download, Clock } from "lucide-react";

const ProgramSchedule = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language as 'en' | 'ro' | 'fr' | 'de';

  const { data: events, isLoading } = useQuery<ProgramEvent[]>({
    queryKey: ['/api/program'],
  });

  if (isLoading) {
    return (
      <section id="program" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('program.title')}</h2>
          <div className="animate-pulse flex justify-center mt-8">
            <div className="h-8 w-8 bg-primary opacity-75 rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  const eventsByDate = events ? groupEventsByDate(events) : {};
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <section id="program" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('program.title')}</h2>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
            {t('program.subtitle')}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {sortedDates.map((date, dateIndex) => (
            <div key={date} className="relative mb-12">
              <div className="absolute top-0 bottom-0 left-14 w-1 bg-primary bg-opacity-20"></div>
              <div className="mb-8 flex">
                <div className="bg-primary text-white rounded-lg p-3 z-10 shadow-md">
                  <span className="text-xl font-bold block">{new Date(date).getDate()}</span>
                  <span className="text-sm">{t(`months.${new Date(date).getMonth()}`)}</span>
                </div>
                <div className="ml-8">
                  <h3 className="font-heading font-bold text-2xl">
                    {t('program.day')} {dateIndex + 1}: {t(`program.dayTitles.day${dateIndex + 1}`)}
                  </h3>
                </div>
              </div>
              
              <div className="ml-28 space-y-6">
                {eventsByDate[date].map((event) => (
                  <div key={event.id} className="bg-white rounded-lg p-6 shadow-md relative">
                    <div className="absolute -left-16 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-24">
                        <span className="text-primary font-bold">
                          {event.startTime}{event.endTime ? `-${event.endTime}` : ''}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-lg mb-1">
                          {getLocalizedEventTitle(event, language)}
                        </h4>
                        <p className="text-neutral-gray">
                          {getLocalizedEventDescription(event, language)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
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
