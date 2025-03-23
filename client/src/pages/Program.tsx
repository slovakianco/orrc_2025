import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Download } from "lucide-react";

export default function Program() {
  const { t } = useTranslation();

  const days = [
    { id: "day1", label: "program.day1" },
    { id: "day2", label: "program.day2" },
    { id: "day3", label: "program.day3" },
  ];

  const events = {
    day1: [
      {
        time: "08:00 - 18:00",
        title: "program.day1.event1.title",
        location: "program.day1.event1.location",
        description: "program.day1.event1.description"
      },
      {
        time: "14:00 - 16:00",
        title: "program.day1.event2.title",
        location: "program.day1.event2.location",
        description: "program.day1.event2.description"
      },
      {
        time: "17:00 - 19:00",
        title: "program.day1.event3.title",
        location: "program.day1.event3.location",
        description: "program.day1.event3.description"
      }
    ],
    day2: [
      {
        time: "05:30 - 06:30",
        title: "program.day2.event1.title",
        location: "program.day2.event1.location",
        description: "program.day2.event1.description"
      },
      {
        time: "07:00",
        title: "program.day2.event2.title",
        location: "program.day2.event2.location",
        description: "program.day2.event2.description"
      },
      {
        time: "07:30",
        title: "program.day2.event3.title",
        location: "program.day2.event3.location",
        description: "program.day2.event3.description"
      },
      {
        time: "16:00 - 19:00",
        title: "program.day2.event4.title",
        location: "program.day2.event4.location",
        description: "program.day2.event4.description"
      }
    ],
    day3: [
      {
        time: "06:00 - 07:00",
        title: "program.day3.event1.title",
        location: "program.day3.event1.location",
        description: "program.day3.event1.description"
      },
      {
        time: "07:30",
        title: "program.day3.event2.title",
        location: "program.day3.event2.location",
        description: "program.day3.event2.description"
      },
      {
        time: "14:00 - 16:00",
        title: "program.day3.event3.title",
        location: "program.day3.event3.location",
        description: "program.day3.event3.description"
      },
      {
        time: "17:00",
        title: "program.day3.event4.title",
        location: "program.day3.event4.location",
        description: "program.day3.event4.description"
      }
    ]
  };

  const handleDownloadPDF = () => {
    // In a real implementation, this would download the actual PDF
    // For this demo, we'll just show an alert
    alert(t("program.downloadStarted"));
  };

  return (
    <div>
      <section className="py-8 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("program.title")}
          </h1>
          <p className="text-lg opacity-90">
            {t("program.subtitle")}
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-neutral-dark">
              {t("program.schedule")}
            </h2>
            <Button 
              onClick={handleDownloadPDF}
              variant="outline" 
              className="flex items-center gap-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
            >
              <Download className="h-4 w-4" />
              <span>{t("program.downloadPDF")}</span>
            </Button>
          </div>
          
          <Tabs defaultValue="day1" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              {days.map((day) => (
                <TabsTrigger 
                  key={day.id} 
                  value={day.id}
                  className="font-accent"
                >
                  {t(day.label)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(events).map(([day, dayEvents]) => (
              <TabsContent key={day} value={day} className="mt-0">
                <div className="space-y-6">
                  {dayEvents.map((event, idx) => (
                    <Card key={idx} className="border-l-4 border-l-[#2E7D32] overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-heading font-bold text-neutral-dark">
                            {t(event.title)}
                          </CardTitle>
                          <div className="flex items-center text-sm bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start gap-2 mb-2 text-sm text-neutral-dark">
                          <MapPin className="h-4 w-4 text-[#FF5722] mt-0.5" />
                          <span>{t(event.location)}</span>
                        </div>
                        <p className="text-neutral-dark">{t(event.description)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-12 p-6 bg-neutral-light rounded-lg shadow-sm">
            <h3 className="text-xl font-heading font-semibold mb-4 text-neutral-dark">
              {t("program.notes.title")}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-[#2E7D32] mt-0.5" />
                <span>{t("program.notes.note1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-[#2E7D32] mt-0.5" />
                <span>{t("program.notes.note2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-[#2E7D32] mt-0.5" />
                <span>{t("program.notes.note3")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
