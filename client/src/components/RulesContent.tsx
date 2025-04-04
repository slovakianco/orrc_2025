import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RulesContent() {
  const { t, i18n } = useTranslation();

  // Get current language
  const currentLang = i18n.language;

  // Define mandatory equipment based on language
  const getMandatoryEquipment = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Nr. concurs vizibil pe tot parcursul",
          "Telefon mobil încărcat",
          "Foiță impermeabilă",
          "Recipient apă min. 500 ml",
          "Pătură termică",
          "Încălțăminte munte Trail",
        ];
      case "fr":
        return [
          "Numéro de course visible en tout temps",
          "Téléphone mobile chargé",
          "Veste imperméable",
          "Contenant d'eau (minimum 500ml)",
          "Couverture thermique d'urgence",
          "Chaussures de trail running",
        ];
      case "de":
        return [
          "Startnummer jederzeit sichtbar",
          "Aufgeladenes Mobiltelefon",
          "Wasserdichte Jacke",
          "Wasserbehälter (mindestens 500ml)",
          "Rettungsdecke",
          "Trail-Running-Schuhe",
        ];
      case "it":
        return [
          "Numero di gara visibile in ogni momento",
          "Telefono cellulare carico",
          "Giacca impermeabile",
          "Contenitore d'acqua (minimo 500ml)",
          "Coperta termica d'emergenza",
          "Scarpe da trail running",
        ];
      case "es":
        return [
          "Número de carrera visible en todo momento",
          "Teléfono móvil cargado",
          "Chaqueta impermeable",
          "Recipiente de agua (mínimo 500ml)",
          "Manta térmica de emergencia",
          "Zapatillas de trail running",
        ];
      default: // English
        return [
          "Race number visible at all times",
          "Charged mobile phone",
          "Waterproof jacket",
          "Water container (minimum 500ml)",
          "Emergency thermal blanket",
          "Trail running shoes",
        ];
    }
  };
  
  const mandatoryEquipment = getMandatoryEquipment();

  // Define recommended equipment based on language
  const getRecommendedEquipment = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Gel sau baton energizant",
          "Busolă sau buff",
          "Fluier",
          "Colanți sau jambiere",
          "Bețe",
        ];
      case "fr":
        return [
          "Gel ou barre énergétique",
          "Boussole ou buff",
          "Sifflet",
          "Collants ou guêtres",
          "Bâtons de trekking",
        ];
      case "de":
        return [
          "Energiegel oder -riegel",
          "Kompass oder Buff",
          "Pfeife",
          "Tights oder Gamaschen",
          "Trekkingstöcke",
        ];
      case "it":
        return [
          "Gel o barretta energetica",
          "Bussola o buff",
          "Fischietto",
          "Calzamaglia o ghette",
          "Bastoncini da trekking",
        ];
      case "es":
        return [
          "Gel o barra energética",
          "Brújula o buff",
          "Silbato",
          "Mallas o polainas",
          "Bastones de trekking",
        ];
      default: // English
        return [
          "Energy gel or bar",
          "Compass or buff",
          "Whistle",
          "Tights or leggings",
          "Trekking poles",
        ];
    }
  };
  
  const recommendedEquipment = getRecommendedEquipment();

  // Time limits based on language
  const getTimeLimits = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Cursa de 11km: limită totală de timp 3 ore.",
          "Cursa de 33km: limită totală de timp 8 ore cu puncte de control la 15km (3 ore) și 25km (6 ore).",
        ];
      case "fr":
        return [
          "Course de 11km: limite de temps de 3 heures.",
          "Course de 33km: limite de temps de 8 heures avec barrières horaires à 15km (3 heures) et 25km (6 heures).",
        ];
      case "de":
        return [
          "11km-Rennen: 3-Stunden-Zeitlimit.",
          "33km-Rennen: 8-Stunden-Zeitlimit mit Kontrollpunkten bei 15km (3 Stunden) und 25km (6 Stunden).",
        ];
      case "it":
        return [
          "Gara di 11km: limite di tempo di 3 ore.",
          "Gara di 33km: limite di tempo di 8 ore con cancelli orari a 15km (3 ore) e 25km (6 ore).",
        ];
      case "es":
        return [
          "Carrera de 11km: límite de tiempo de 3 horas.",
          "Carrera de 33km: límite de tiempo de 8 horas con cortes en 15km (3 horas) y 25km (6 horas).",
        ];
      default: // English
        return [
          "11km race: 3-hour time limit.",
          "33km race: 8-hour time limit with cut-offs at 15km (3 hours) and 25km (6 hours).",
        ];
    }
  };
  
  const timeLimits = getTimeLimits();

  // Aid stations based on language
  const getAidStations = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Cursa de 11km: Un punct de alimentare la km 5.",
          "Cursa de 33km: Puncte de alimentare la km 9, km 15, km 21, km 25 și km 29.",
        ];
      case "fr":
        return [
          "Course de 11km: Un poste de ravitaillement au km 5.",
          "Course de 33km: Postes de ravitaillement aux km 9, km 15, km 21, km 25 et km 29.",
        ];
      case "de":
        return [
          "11km-Rennen: Eine Verpflegungsstation bei km 5.",
          "33km-Rennen: Verpflegungsstationen bei km 9, km 15, km 21, km 25 und km 29.",
        ];
      case "it":
        return [
          "Gara di 11km: Un punto di ristoro al km 5.",
          "Gara di 33km: Punti di ristoro ai km 9, km 15, km 21, km 25 e km 29.",
        ];
      case "es":
        return [
          "Carrera de 11km: Un avituallamiento en el km 5.",
          "Carrera de 33km: Avituallamientos en los km 9, km 15, km 21, km 25 y km 29.",
        ];
      default: // English
        return [
          "11km race: One aid station at km 5.",
          "33km race: Aid stations at km 9, km 15, km 21, km 25, and km 29.",
        ];
    }
  };
  
  const aidStations = getAidStations();

  // General rules based on language
  const getGeneralRules = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Toți alergătorii trebuie să urmeze traseul marcat în permanență. Devierea de la traseul marcat sau luarea de scurtături este strict interzisă și va duce la descalificare.",
          "Numerele de concurs trebuie să rămână vizibile în orice moment în timpul cursei.",
          "Participanții trebuie să se înregistreze la toate punctele de control de-a lungul traseului.",
          "Alergătorii trebuie să respecte mediul înconjurător. Aruncarea gunoaielor este strict interzisă și va duce la descalificare.",
          "În caz de retragere, participanții trebuie să informeze oficialii cursei la cel mai apropiat punct de control.",
        ];
      case "fr":
        return [
          "Tous les coureurs doivent suivre le parcours balisé à tout moment. S'écarter du parcours balisé ou prendre des raccourcis est strictement interdit et entraînera une disqualification.",
          "Les dossards doivent rester visibles à tout moment pendant la course.",
          "Les participants doivent s'enregistrer à tous les points de contrôle le long du parcours.",
          "Les coureurs doivent respecter l'environnement. Jeter des déchets est strictement interdit et entraînera une disqualification.",
          "En cas d'abandon, les participants doivent en informer les officiels de la course au point de contrôle le plus proche.",
        ];
      case "de":
        return [
          "Alle Läufer müssen der markierten Strecke jederzeit folgen. Abweichungen von der markierten Strecke oder Abkürzungen sind strengstens untersagt und führen zur Disqualifikation.",
          "Die Startnummern müssen während des gesamten Rennens sichtbar bleiben.",
          "Die Teilnehmer müssen sich an allen Kontrollpunkten entlang der Strecke anmelden.",
          "Die Läufer müssen die Umwelt respektieren. Das Wegwerfen von Müll ist strengstens untersagt und führt zur Disqualifikation.",
          "Bei Rückzug müssen die Teilnehmer die Rennoffiziellen am nächsten Kontrollpunkt informieren.",
        ];
      case "it":
        return [
          "Tutti i corridori devono seguire il percorso segnato in ogni momento. Deviare dal percorso segnato o prendere scorciatoie è severamente proibito e comporterà la squalifica.",
          "I numeri di gara devono rimanere visibili in ogni momento durante la gara.",
          "I partecipanti devono registrarsi a tutti i punti di controllo lungo il percorso.",
          "I corridori devono rispettare l'ambiente. Gettare rifiuti è severamente proibito e comporterà la squalifica.",
          "In caso di ritiro, i partecipanti devono informare gli ufficiali di gara al punto di controllo più vicino.",
        ];
      case "es":
        return [
          "Todos los corredores deben seguir la ruta marcada en todo momento. Desviarse de la ruta marcada o tomar atajos está estrictamente prohibido y resultará en descalificación.",
          "Los números de carrera deben permanecer visibles en todo momento durante la carrera.",
          "Los participantes deben registrarse en todos los puntos de control a lo largo de la ruta.",
          "Los corredores deben respetar el medio ambiente. Tirar basura está estrictamente prohibido y resultará en descalificación.",
          "En caso de abandono, los participantes deben informar a los oficiales de carrera en el punto de control más cercano.",
        ];
      default: // English
        return [
          "All runners must follow the marked route at all times. Deviation from the marked route or taking shortcuts is strictly prohibited and will result in disqualification.",
          "Race numbers must remain visible at all times during the race.",
          "Participants must check in at all control points along the route.",
          "Runners must respect the environment. Littering is strictly prohibited and will result in disqualification.",
          "In case of withdrawal, participants must inform race officials at the nearest checkpoint.",
        ];
    }
  };
  
  const generalRules = getGeneralRules();

  // Environment rules based on language
  const getEnvironmentRules = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Este strict interzisă aruncarea gunoiului pe traseu.",
          "Folosiți punctele de colectare a deșeurilor din stațiile de ajutor.",
          "Respectați fauna și flora locală.",
          "Rămâneți pe potecile marcate pentru a preveni eroziunea solului.",
          "Participanții prinși aruncând gunoi vor fi descalificați imediat.",
        ];
      case "fr":
        return [
          "Il est strictement interdit de jeter des déchets sur le parcours.",
          "Utilisez les points de collecte des déchets aux postes de ravitaillement.",
          "Respectez la faune et la flore locales.",
          "Restez sur les sentiers balisés pour éviter l'érosion du sol.",
          "Les participants surpris à jeter des déchets seront immédiatement disqualifiés.",
        ];
      case "de":
        return [
          "Das Wegwerfen von Müll auf der Strecke ist strengstens untersagt.",
          "Nutzen Sie die Abfallsammelstellen an den Verpflegungsstationen.",
          "Respektieren Sie die lokale Fauna und Flora.",
          "Bleiben Sie auf den markierten Wegen, um Bodenerosion zu vermeiden.",
          "Teilnehmer, die beim Wegwerfen von Müll erwischt werden, werden sofort disqualifiziert.",
        ];
      case "it":
        return [
          "È severamente vietato gettare rifiuti sul percorso.",
          "Utilizzare i punti di raccolta rifiuti presso i punti di ristoro.",
          "Rispettare la fauna e la flora locali.",
          "Rimanere sui sentieri segnati per prevenire l'erosione del suolo.",
          "I partecipanti sorpresi a gettare rifiuti saranno immediatamente squalificati.",
        ];
      case "es":
        return [
          "Está estrictamente prohibido tirar basura en el sendero.",
          "Utilice los puntos de recogida de residuos en los puestos de avituallamiento.",
          "Respete la fauna y flora local.",
          "Permanezca en los senderos marcados para prevenir la erosión del suelo.",
          "Los participantes sorprendidos tirando basura serán inmediatamente descalificados.",
        ];
      default: // English
        return [
          "Littering on the trail is strictly prohibited.",
          "Use waste collection points at aid stations.",
          "Respect local fauna and flora.",
          "Stay on marked trails to prevent soil erosion.",
          "Participants caught littering will be immediately disqualified.",
        ];
    }
  };
  
  const environmentRules = getEnvironmentRules();

  // Define safety rules based on language
  const getSafetyRules = () => {
    switch (currentLang) {
      case "ro":
        return [
          "În caz de urgență, sunați la numărul de urgență furnizat la briefing.",
          "Dacă observați un participant rănit, trebuie să îi acordați ajutor.",
          "Participanții trebuie să aibă telefonul mobil încărcat și pornit pe tot parcursul cursei.",
          "Abandonarea unui participant accidentat va duce la descalificare.",
          "În condiții meteo extreme, organizatorii pot modifica traseul sau anula evenimentul.",
        ];
      case "fr":
        return [
          "En cas d'urgence, appelez le numéro d'urgence fourni lors du briefing.",
          "Si vous voyez un participant blessé, vous devez lui porter assistance.",
          "Les participants doivent avoir leur téléphone portable chargé et allumé tout au long de la course.",
          "Abandonner un participant blessé entraînera une disqualification.",
          "En cas de conditions météorologiques extrêmes, les organisateurs peuvent modifier le parcours ou annuler l'événement.",
        ];
      case "de":
        return [
          "Im Notfall rufen Sie die beim Briefing angegebene Notfallnummer an.",
          "Wenn Sie einen verletzten Teilnehmer sehen, müssen Sie Hilfe leisten.",
          "Die Teilnehmer müssen ihr Mobiltelefon während des gesamten Rennens aufgeladen und eingeschaltet haben.",
          "Das Zurücklassen eines verletzten Teilnehmers führt zur Disqualifikation.",
          "Bei extremen Wetterbedingungen können die Organisatoren die Strecke ändern oder die Veranstaltung absagen.",
        ];
      case "it":
        return [
          "In caso di emergenza, chiamare il numero di emergenza fornito durante il briefing.",
          "Se vedi un partecipante ferito, devi fornire assistenza.",
          "I partecipanti devono avere il telefono cellulare carico e acceso per tutta la durata della gara.",
          "Abbandonare un partecipante ferito comporterà la squalifica.",
          "In condizioni meteorologiche estreme, gli organizzatori possono modificare il percorso o annullare l'evento.",
        ];
      case "es":
        return [
          "En caso de emergencia, llame al número de emergencia proporcionado en la reunión informativa.",
          "Si ve a un participante herido, debe proporcionarle asistencia.",
          "Los participantes deben tener su teléfono móvil cargado y encendido durante toda la carrera.",
          "Abandonar a un participante herido resultará en descalificación.",
          "En condiciones climáticas extremas, los organizadores pueden modificar la ruta o cancelar el evento.",
        ];
      default: // English
        return [
          "In case of emergency, call the emergency number provided at the briefing.",
          "If you see an injured participant, you must provide assistance.",
          "Participants must have their mobile phones charged and turned on throughout the race.",
          "Abandoning an injured participant will result in disqualification.",
          "In extreme weather conditions, organizers may modify the route or cancel the event.",
        ];
    }
  };
  
  const safetyRules = getSafetyRules();

  // Penalties rules based on language
  const getPenaltiesRules = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Lipsa echipamentului obligatoriu: penalizare de 30 minute sau descalificare.",
          "Abateri de la traseu: descalificare.",
          "Aruncarea gunoiului: descalificare.",
          "Comportament nesportiv: descalificare.",
          "Neprezentarea la punctele de control: descalificare.",
        ];
      case "fr":
        return [
          "Absence d'équipement obligatoire: pénalité de 30 minutes ou disqualification.",
          "Déviations du parcours: disqualification.",
          "Jeter des déchets: disqualification.",
          "Comportement antisportif: disqualification.",
          "Défaut d'enregistrement aux points de contrôle: disqualification.",
        ];
      case "de":
        return [
          "Fehlen der Pflichtausrüstung: 30-Minuten-Strafe oder Disqualifikation.",
          "Abweichungen von der Strecke: Disqualifikation.",
          "Wegwerfen von Müll: Disqualifikation.",
          "Unsportliches Verhalten: Disqualifikation.",
          "Versäumnis, sich an Kontrollpunkten anzumelden: Disqualifikation.",
        ];
      case "it":
        return [
          "Mancanza di attrezzatura obbligatoria: penalità di 30 minuti o squalifica.",
          "Deviazione dal percorso: squalifica.",
          "Gettare rifiuti: squalifica.",
          "Comportamento antisportivo: squalifica.",
          "Mancata registrazione ai punti di controllo: squalifica.",
        ];
      case "es":
        return [
          "Falta de equipo obligatorio: penalización de 30 minutos o descalificación.",
          "Desviación de la ruta: descalificación.",
          "Tirar basura: descalificación.",
          "Comportamiento antideportivo: descalificación.",
          "No registrarse en los puntos de control: descalificación.",
        ];
      default: // English
        return [
          "Missing mandatory equipment: 30-minute penalty or disqualification.",
          "Route deviation: disqualification.",
          "Littering: disqualification.",
          "Unsportsmanlike behavior: disqualification.",
          "Failure to check in at control points: disqualification.",
        ];
    }
  };
  
  const penaltiesRules = getPenaltiesRules();

  // Registration rules based on language
  const getRegistrationRules = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Prin înscriere, participanții confirmă că sunt apți fizic pentru competiție.",
          "Taxele de înscriere nu sunt rambursabile.",
          "Transferurile între curse sunt permise până la 14 zile înainte de eveniment.",
        ];
      case "fr":
        return [
          "En s'inscrivant, les participants confirment qu'ils sont physiquement aptes à la compétition.",
          "Les frais d'inscription ne sont pas remboursables.",
          "Les transferts entre courses sont autorisés jusqu'à 14 jours avant l'événement.",
        ];
      case "de":
        return [
          "Mit der Anmeldung bestätigen die Teilnehmer, dass sie körperlich für den Wettbewerb geeignet sind.",
          "Die Anmeldegebühren sind nicht erstattungsfähig.",
          "Wechsel zwischen Rennen sind bis zu 14 Tage vor der Veranstaltung erlaubt.",
        ];
      case "it":
        return [
          "Con l'iscrizione, i partecipanti confermano di essere fisicamente idonei alla competizione.",
          "Le quote di iscrizione non sono rimborsabili.",
          "I trasferimenti tra gare sono consentiti fino a 14 giorni prima dell'evento.",
        ];
      case "es":
        return [
          "Al registrarse, los participantes confirman que están físicamente aptos para la competición.",
          "Las tarifas de inscripción no son reembolsables.",
          "Las transferencias entre carreras están permitidas hasta 14 días antes del evento.",
        ];
      default: // English
        return [
          "By registering, participants confirm they are physically fit for the competition.",
          "Registration fees are non-refundable.",
          "Transfers between races are allowed up to 14 days before the event.",
        ];
    }
  };
  
  const registrationRules = getRegistrationRules();

  return (
    <div>
      <section className="py-8 bg-[WHITE] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("rules.title")}
          </h1>
          <p className="text-lg opacity-90">{t("rules.subtitle")}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Alert className="mb-8 border-[#E64A19] bg-[#FFF3E0] text-[#BF360C]">
            <AlertCircle className="h-5 w-5 text-[#E64A19]" />
            <AlertTitle className="text-[#E64A19] font-heading font-semibold text-lg">
              {t("rules.important")}
            </AlertTitle>
            <AlertDescription className="text-[#BF360C] text-base mt-1">
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
          
          {/* EMA Circuit Section - Separate section for EMA Circuit content */}
          <div className="mt-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600 flex items-center">
              <span className="bg-blue-600 text-white p-1 rounded-md mr-3">EMA</span>
              {t("emaCircuit.title")}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Card className="shadow-md border-blue-600/20 h-full">
                  <CardContent className="pt-6">
                    <p className="mb-4">{t("emaCircuit.overview.content")}</p>
                    <p className="font-semibold mb-2">{t("emaCircuit.overview.objectives")}</p>
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <li key={index}>
                          {t(`emaCircuit.overview.objectivesList.${index}`)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="shadow-md border-blue-600/20 h-full">
                  <CardContent className="pt-6">
                    <p className="mb-4">{t("emaCircuit.participation.content")}</p>
                    <p className="mb-2 font-medium">{t("emaCircuit.participation.note1")}</p>
                    <p>{t("emaCircuit.participation.note2")}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="shadow-md border-blue-600/20">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-3 text-blue-600">{t("emaCircuit.liability.title")}</h3>
                  <p className="mb-4">{t("emaCircuit.liability.content")}</p>
                  <p className="mb-4">{t("emaCircuit.liability.insurance")}</p>
                  <p>{t("emaCircuit.liability.health")}</p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-blue-600/20">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-3 text-blue-600">{t("emaCircuit.rankings.title")}</h3>
                  <p className="mb-4">{t("emaCircuit.rankings.content")}</p>
                  <p className="mb-4">{t("emaCircuit.rankings.local")}</p>
                  <p className="mb-4 font-medium">{t("emaCircuit.rankings.eligibility")}</p>
                  <p className="mb-4">{t("emaCircuit.rankings.points")}</p>
                  <p className="mb-4 text-primary font-medium">{t("emaCircuit.rankings.specialPrize")}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center mt-8">
              <a
                href="/api/ema-circuit/regulations" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
              >
                {t("emaCircuit.downloadButton")}
              </a>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-neutral-dark mb-4">
              {t("rules.contactQuestion")}
            </p>
            <a
              href="mailto:slovak.ianco@gmail.com"
              className="text-[#2E7D32] hover:underline font-medium"
            >
              slovak.ianco@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
