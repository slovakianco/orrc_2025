import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RulesContent() {
  const { t, i18n } = useTranslation();
  
  // Get current language
  const currentLang = i18n.language;
  
  // Define mandatory equipment based on language
  const mandatoryEquipment = currentLang === "ro" ? [
    "Nr. concurs vizibil pe tot parcursul",
    "Telefon mobil încărcat",
    "Foiță impermeabilă",
    "Recipient apă min. 500 ml",
    "Pătură termică",
    "Încălțăminte munte Trail"
  ] : [
    "Race number visible at all times",
    "Charged mobile phone",
    "Waterproof jacket",
    "Water container (minimum 500ml)",
    "Emergency thermal blanket",
    "Trail running shoes"
  ];

  // Define recommended equipment based on language
  const recommendedEquipment = currentLang === "ro" ? [
    "Gel sau baton energizant",
    "Busolă sau buff",
    "Fluier",
    "Colanți sau jambiere",
    "Bețe"
  ] : [
    "Energy gel or bar",
    "Compass or buff",
    "Whistle",
    "Tights or leggings",
    "Trekking poles"
  ];

  // Time limits based on language
  const timeLimits = currentLang === "ro" ? [
    "Cursa de 11km: limită totală de timp 3 ore.",
    "Cursa de 33km: limită totală de timp 8 ore cu puncte de control la 15km (3 ore) și 25km (6 ore)."
  ] : [
    "11km race: 3-hour time limit.",
    "33km race: 8-hour time limit with cut-offs at 15km (3 hours) and 25km (6 hours)."
  ];

  // Aid stations based on language
  const aidStations = currentLang === "ro" ? [
    "Cursa de 11km: Un punct de alimentare la km 5.",
    "Cursa de 33km: Puncte de alimentare la km 9, km 15, km 21, km 25 și km 29."
  ] : [
    "11km race: One aid station at km 5.",
    "33km race: Aid stations at km 9, km 15, km 21, km 25, and km 29."
  ];

  // General rules based on language
  const generalRules = currentLang === "ro" ? [
    "Toți alergătorii trebuie să urmeze traseul marcat în permanență. Devierea de la traseul marcat sau luarea de scurtături este strict interzisă și va duce la descalificare.",
    "Numerele de concurs trebuie să rămână vizibile în orice moment în timpul cursei.",
    "Participanții trebuie să se înregistreze la toate punctele de control de-a lungul traseului.",
    "Alergătorii trebuie să respecte mediul înconjurător. Aruncarea gunoaielor este strict interzisă și va duce la descalificare.",
    "În caz de retragere, participanții trebuie să informeze oficialii cursei la cel mai apropiat punct de control."
  ] : [
    "All runners must follow the marked route at all times. Deviation from the marked route or taking shortcuts is strictly prohibited and will result in disqualification.",
    "Race numbers must remain visible at all times during the race.",
    "Participants must check in at all control points along the route.",
    "Runners must respect the environment. Littering is strictly prohibited and will result in disqualification.",
    "In case of withdrawal, participants must inform race officials at the nearest checkpoint."
  ];

  // Environment rules based on language
  const environmentRules = currentLang === "ro" ? [
    "Este strict interzisă aruncarea gunoiului pe traseu.",
    "Folosiți punctele de colectare a deșeurilor din stațiile de ajutor.",
    "Respectați fauna și flora locală.",
    "Rămâneți pe potecile marcate pentru a preveni eroziunea solului.",
    "Participanții prinși aruncând gunoi vor fi descalificați imediat."
  ] : [
    "Littering on the trail is strictly prohibited.",
    "Use waste collection points at aid stations.",
    "Respect local fauna and flora.",
    "Stay on marked trails to prevent soil erosion.",
    "Participants caught littering will be immediately disqualified."
  ];

  // Define safety rules based on language
  const safetyRules = currentLang === "ro" ? [
    "În caz de urgență, sunați la numărul de urgență furnizat la briefing.",
    "Dacă observați un participant rănit, trebuie să îi acordați ajutor.",
    "Participanții trebuie să aibă telefonul mobil încărcat și pornit pe tot parcursul cursei.",
    "Abandonarea unui participant accidentat va duce la descalificare.",
    "În condiții meteo extreme, organizatorii pot modifica traseul sau anula evenimentul."
  ] : [
    "In case of emergency, call the emergency number provided at the briefing.",
    "If you see an injured participant, you must provide assistance.",
    "Participants must have their mobile phones charged and turned on throughout the race.",
    "Abandoning an injured participant will result in disqualification.",
    "In extreme weather conditions, organizers may modify the route or cancel the event."
  ];

  // Penalties rules based on language
  const penaltiesRules = currentLang === "ro" ? [
    "Lipsa echipamentului obligatoriu: penalizare de 30 minute sau descalificare.",
    "Abateri de la traseu: descalificare.",
    "Aruncarea gunoiului: descalificare.",
    "Comportament nesportiv: descalificare.",
    "Neprezentarea la punctele de control: descalificare."
  ] : [
    "Missing mandatory equipment: 30-minute penalty or disqualification.",
    "Route deviation: disqualification.",
    "Littering: disqualification.",
    "Unsportsmanlike behavior: disqualification.",
    "Failure to check in at control points: disqualification."
  ];

  // Registration rules based on language
  const registrationRules = currentLang === "ro" ? [
    "Participanții trebuie să aibă cel puțin 18 ani în ziua competiției.",
    "Este necesară o adeverință medicală valabilă.",
    "Prin înscriere, participanții confirmă că sunt apți fizic pentru competiție.",
    "Taxele de înscriere nu sunt rambursabile.",
    "Transferurile între curse sunt permise până la 14 zile înainte de eveniment."
  ] : [
    "Participants must be at least 18 years old on race day.",
    "A valid medical certificate is required.",
    "By registering, participants confirm they are physically fit for the competition.",
    "Registration fees are non-refundable.",
    "Transfers between races are allowed up to 14 days before the event."
  ];

  return (
    <div>
      <section className="py-8 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("rules.title")}
          </h1>
          <p className="text-lg opacity-90">
            {t("rules.subtitle")}
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Alert className="mb-8 border-[#E64A19] bg-orange-50">
            <AlertCircle className="h-4 w-4 text-[#E64A19]" />
            <AlertTitle className="text-[#E64A19] font-heading font-semibold">
              {t("rules.important")}
            </AlertTitle>
            <AlertDescription>
              {t("rules.importantDescription")}
            </AlertDescription>
          </Alert>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="mb-6 text-lg">{t("rules.introduction")}</p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="general">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.general.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {generalRules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="equipment">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.equipment.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {mandatoryEquipment.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="recommendations">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.recommendations.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {recommendedEquipment.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="timeLimits">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.timeLimits.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {timeLimits.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="aidStations">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.aidStations.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {aidStations.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="penalties">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.penalties.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {penaltiesRules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="safety">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.safety.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {safetyRules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="environment">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.environment.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {environmentRules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="registration">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.registration.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {registrationRules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-neutral-dark mb-4">
              {t("rules.contactQuestion")}
            </p>
            <a 
              href="mailto:rules@stanatrailrace.ro" 
              className="text-[#2E7D32] hover:underline font-medium"
            >
              rules@stanatrailrace.ro
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}