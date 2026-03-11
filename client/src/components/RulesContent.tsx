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
  const currentLang = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];
  const isRomanian = currentLang === "ro";

  // Define mandatory equipment for 11km race based on language
  const getMandatoryEquipment11k = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Nr. concurs vizibil pe tot parcursul",
          "Telefon mobil încărcat cu numere de urgență",
          "Recipient apă min. 500 ml"
        ];
      case "fr":
        return [
          "Numéro de course visible en tout temps",
          "Téléphone mobile chargé avec numéros d'urgence",
          "Contenant d'eau (minimum 500ml)"
        ];
      case "de":
        return [
          "Startnummer jederzeit sichtbar",
          "Aufgeladenes Mobiltelefon mit Notfallnummern",
          "Wasserbehälter (mindestens 500ml)"
        ];
      case "it":
        return [
          "Numero di gara visibile in ogni momento",
          "Telefono cellulare carico con numeri di emergenza",
          "Contenitore d'acqua (minimo 500ml)"
        ];
      case "es":
        return [
          "Número de carrera visible en todo momento",
          "Teléfono móvil cargado con números de emergencia",
          "Recipiente de agua (mínimo 500ml)",
        ];
      default: // English
        return [
          "Race bib visible at all times",
          "Fully charged mobile phone with emergency numbers",
          "Water container (minimum 500ml)"
        ];
    }
  };

  // Define mandatory equipment for 33km race based on language
  const getMandatoryEquipment33k = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Nr. concurs vizibil pe tot parcursul",
          "Telefon mobil încărcat cu numere de urgență",
          "Foiță impermeabilă",
          "Recipient apă min. 1000 ml",
          "Pătură termică",
          "Încălțăminte munte Trail",
          "Mâncare energizantă (batoane, geluri)",
          "Fluier de urgență",
          "Bandă elastică sau bandaj",
          "Șapcă sau bandană",
        ];
      case "fr":
        return [
          "Numéro de course visible en tout temps",
          "Téléphone mobile chargé avec numéros d'urgence",
          "Veste imperméable",
          "Contenant d'eau (minimum 1000ml)",
          "Couverture thermique d'urgence",
          "Chaussures de trail running",
          "Nourriture énergétique (barres, gels)",
          "Sifflet d'urgence",
          "Bande élastique ou bandage",
          "Casquette ou bandana",
        ];
      case "de":
        return [
          "Startnummer jederzeit sichtbar",
          "Aufgeladenes Mobiltelefon mit Notfallnummern",
          "Wasserdichte Jacke",
          "Wasserbehälter (mindestens 1000ml)",
          "Rettungsdecke",
          "Trail-Running-Schuhe",
          "Energiereiche Nahrung (Riegel, Gels)",
          "Notfallpfeife",
          "Elastische Binde oder Verband",
          "Kappe oder Bandana",
        ];
      case "it":
        return [
          "Numero di gara visibile in ogni momento",
          "Telefono cellulare carico con numeri di emergenza",
          "Giacca impermeabile",
          "Contenitore d'acqua (minimo 1000ml)",
          "Coperta termica d'emergenza",
          "Scarpe da trail running",
          "Cibo energetico (barrette, gel)",
          "Fischietto di emergenza",
          "Fascia elastica o benda",
          "Cappello o bandana",
        ];
      case "es":
        return [
          "Número de carrera visible en todo momento",
          "Teléfono móvil cargado con números de emergencia",
          "Chaqueta impermeable",
          "Recipiente de agua (mínimo 1000ml)",
          "Manta térmica de emergencia",
          "Zapatillas de trail running",
          "Comida energética (barras, geles)",
          "Silbato de emergencia",
          "Venda elástica o vendaje",
          "Gorra o bandana",
        ];
      default: // English
        return [
          "Race bib visible at all times",
          "Fully charged mobile phone with emergency numbers",
          "Waterproof jacket",
          "Water container (minimum 1000ml)",
          "Thermal emergency blanket",
          "Trail running shoes",
          "Energy food (bars, gels)",
          "Emergency whistle",
          "Elastic band or bandage",
          "Cap or bandana",
        ];
    }
  };

  const mandatoryEquipment11k = getMandatoryEquipment11k();
  const mandatoryEquipment33k = getMandatoryEquipment33k();

  // Define recommended equipment based on language - common for both races
  const getRecommendedEquipment = () => {
    switch (currentLang) {
      case "ro":
        return [
          "Bețe de trail running",
          "Ochelari de soare",
          "Cremă de protecție solară",
          "Mănuși ușoare",
          "Buff/bandană multifuncțională",
          "Baterie externă pentru telefon",
        ];
      case "fr":
        return [
          "Bâtons de trail running",
          "Lunettes de soleil",
          "Crème solaire",
          "Gants légers",
          "Buff/bandana multifonction",
          "Batterie externe pour téléphone",
        ];
      case "de":
        return [
          "Trail-Running-Stöcke",
          "Sonnenbrille",
          "Sonnenschutzcreme",
          "Leichte Handschuhe",
          "Multifunktionaler Buff/Bandana",
          "Powerbank fürs Handy",
        ];
      case "it":
        return [
          "Bastoncini da trail running",
          "Occhiali da sole",
          "Crema solare",
          "Guanti leggeri",
          "Buff/bandana multifunzionale",
          "Batteria esterna per telefono",
        ];
      case "es":
        return [
          "Bastones de trail running",
          "Gafas de sol",
          "Protector solar",
          "Guantes ligeros",
          "Buff/bandana multifuncional",
          "Batería externa para teléfono",
        ];
      default: // English
        return [
          "Trail running poles",
          "Sunglasses",
          "Sunscreen",
          "Lightweight gloves",
          "Multifunctional buff/bandana",
          "Phone power bank",
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

  const verticalRules = isRomanian
    ? {
        general: [
          "Vertical 8K are loc vineri, 10 iulie 2026, cu startul în Budureasa și sosirea la Vârful Poieni, Stâna de Vale.",
          "Startul cursei Vertical 8K este la ora 10:00.",
          "Pentru Vertical 8K se întocmesc clasamente open feminin și masculin, precum și clasamente pe categorii de vârstă, pe baza rezultatelor oficiale validate de organizator.",
          "Premierea Vertical 8K se face pe baza clasamentelor oficiale ale cursei."
        ],
        equipment: [
          "Număr de concurs vizibil pe tot parcursul cursei",
          "Telefon mobil încărcat, cu numărul de urgență al organizatorului salvat în telefon",
          "Recipient de apă de minimum 500 ml"
        ],
        recommendations: [
          "Bețele de trail sau trekking sunt permise la Vertical 8K, cu utilizarea lor responsabilă pe tot traseul."
        ],
        timeLimits: [
          "Limită totală de timp: 3 ore.",
          "CP1: km 4, timp limită 1 h 30 min."
        ],
        aidStations: [
          "CP1 este amplasat la km 4 și reprezintă punctul intermediar de control al cursei Vertical 8K."
        ],
        penalties: [
          "Nerespectarea traseului oficial, a trecerii prin CP1 sau a indicațiilor organizatorilor poate duce la penalizare sau descalificare.",
          "Nerespectarea regulilor privind coborârea de la sosire poate duce la descalificare."
        ],
        safety: [
          "Organizatorul poate opri din cursă orice participant care nu mai poate continua în condiții de siguranță.",
          "Coborârea de la sosire se face numai pe varianta indicată de organizatori, cu respectarea instrucțiunilor arbitrilor și voluntarilor."
        ],
        environment: [
          "Pe traseul Vertical 8K este interzisă abandonarea recipientelor, gelurilor sau a oricărui alt echipament în afara zonelor indicate de organizatori."
        ],
        registration: [
          "La Vertical 8K pot participa concurenții apți pentru efort intens în alergare montană și care respectă toate cerințele organizatorului.",
          "Taxa de înscriere pentru Vertical 8K este 100 lei.",
          "Pentru înscrierea cumulată la două curse se acordă o reducere totală de 50 de lei.",
          "Prin înscriere, participantul confirmă că a citit, a înțeles și acceptă regulamentul Vertical 8K.",
          "La Vertical 8K, categoriile de vârstă pentru feminin și masculin sunt: 35-39, 40-44, 45-49, 50-54, 55-59, 60-64, 65-69, 70-74, 75-79 și 80+."
        ]
      }
    : null;

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
                    {verticalRules && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.general.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="equipment">
                  <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                    {t("rules.sections.equipment.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2 text-primary-dark">11km Race - {t("races.shortTrail")}</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        {mandatoryEquipment11k.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-6 mb-4">
                      <h4 className="font-semibold text-lg mb-2 text-primary-dark">33km Race - {t("races.longTrail")}</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        {mandatoryEquipment33k.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    </div>

                    {verticalRules && (
                      <div className="mt-6 mb-4">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.equipment.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    {verticalRules && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.recommendations.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    {verticalRules && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.timeLimits.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    {verticalRules && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.aidStations.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    {verticalRules && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.penalties.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    {verticalRules && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.safety.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    {verticalRules && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.environment.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    {verticalRules && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2 text-primary-dark">Vertical 8K</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {verticalRules.registration.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* EMA Circuit Section - Separate section for EMA Circuit content */}
          <div className="mt-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600 flex items-center">
              <span className="bg-blue-600 text-white p-1 rounded-md mr-3">
                EMA
              </span>
              {t("emaCircuit.title")}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Card className="shadow-md border-blue-600/20 h-full">
                  <CardContent className="pt-6">
                    <p className="mb-4">{t("emaCircuit.overview.content")}</p>
                    <p className="font-semibold mb-2">
                      {t("emaCircuit.overview.objectives")}
                    </p>
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
                    <p className="mb-4">
                      {t("emaCircuit.participation.content")}
                    </p>
                    <p className="mb-2 font-medium">
                      {t("emaCircuit.participation.note1")}
                    </p>
                    <p>{t("emaCircuit.participation.note2")}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="shadow-md border-blue-600/20">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-3 text-blue-600">
                    {t("emaCircuit.liability.title")}
                  </h3>
                  <p className="mb-4">{t("emaCircuit.liability.content")}</p>
                  <p className="mb-4">{t("emaCircuit.liability.insurance")}</p>
                  <p>{t("emaCircuit.liability.health")}</p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-blue-600/20">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-3 text-blue-600">
                    {t("emaCircuit.rankings.title")}
                  </h3>

                  <div className="mb-6">
                    <h4 className="font-bold text-blue-700 mb-2">
                      {t("emaCircuit.rankings.structure.title")}
                    </h4>
                    <ul className="list-disc pl-6 mb-4 space-y-1 text-neutral-700">
                      <li>{t("emaCircuit.rankings.structure.item1")}</li>
                      <li>{t("emaCircuit.rankings.structure.item2")}</li>
                      <li>{t("emaCircuit.rankings.structure.item3")}</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-blue-700 mb-2">
                      {t("emaCircuit.rankings.finalEligibility.title")}
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="font-medium">
                        {t("emaCircuit.rankings.finalEligibility.content")}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-blue-700 mb-2">
                      {t("emaCircuit.rankings.pointAllocation.title")}
                    </h4>
                    <ul className="list-disc pl-6 mb-3 space-y-1 text-neutral-700">
                      <li>{t("emaCircuit.rankings.pointAllocation.item1")}</li>
                      <li>{t("emaCircuit.rankings.pointAllocation.item2")}</li>
                      <li>{t("emaCircuit.rankings.pointAllocation.item3")}</li>
                      <li>{t("emaCircuit.rankings.pointAllocation.item4")}</li>
                    </ul>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                      <p className="text-sm font-medium text-yellow-800">
                        {t("emaCircuit.rankings.pointAllocation.note")}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-blue-700 mb-2">
                      {t("emaCircuit.rankings.categories.title")}
                    </h4>
                    <ul className="list-disc pl-6 mb-3 space-y-1 text-neutral-700">
                      <li>{t("emaCircuit.rankings.categories.item1")}</li>
                      <li>{t("emaCircuit.rankings.categories.item2")}</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-blue-700 mb-2">
                      {t("emaCircuit.rankings.tieBreakers.title")}
                    </h4>
                    <ul className="list-disc pl-6 mb-3 space-y-1 text-neutral-700">
                      <li>{t("emaCircuit.rankings.tieBreakers.item1")}</li>
                      <li>{t("emaCircuit.rankings.tieBreakers.item2")}</li>
                    </ul>
                  </div>

                  <div className="mb-6 bg-blue-50 p-4 rounded-md">
                    <h4 className="font-bold text-blue-700 mb-2">
                      {t("emaCircuit.rankings.specialPrize.title")}
                    </h4>
                    <p>{t("emaCircuit.rankings.specialPrize.content")}</p>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-bold text-blue-700 mb-2">
                      {t("emaCircuit.rankings.awardCeremony.title")}
                    </h4>
                    <ul className="list-disc pl-6 mb-3 space-y-1 text-neutral-700">
                      <li>{t("emaCircuit.rankings.awardCeremony.item1")}</li>
                      <li>{t("emaCircuit.rankings.awardCeremony.item2")}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* EMA Circuit Calendar */}
            <div className="mt-10 mb-8">
              <h3 className="text-xl font-bold mb-6 text-blue-600 border-b pb-2">
                {t("emaCircuit.calendar.title")} - 2026
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border p-3 text-left">
                        {t("emaCircuit.calendar.date")}
                      </th>
                      <th className="border p-3 text-left">
                        {t("emaCircuit.calendar.event")}
                      </th>
                      <th className="border p-3 text-left">
                        {t("emaCircuit.calendar.country")}
                      </th>
                      <th className="border p-3 text-left">
                        {t("emaCircuit.calendar.links") || "Links"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border p-3">May 10, 2026</td>
                      <td className="border p-3">Lloret del Mar</td>
                      <td className="border p-3">Spain 🇪🇸</td>
                      <td className="border p-3">
                        <div className="space-y-1 text-sm">
                          <span className="text-primary font-bold">
                            Information pending
                          </span>
                          <span>Check official EMA and organiser channels</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border p-3">May 24, 2026</td>
                      <td className="border p-3">Mont Ventoux</td>
                      <td className="border p-3">France 🇫🇷</td>
                      <td className="border p-3">
                        <div className="space-y-1 text-sm">
                          <a
                            href="https://ventouxmountainrunning.com/inscriptions-mdv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            Website
                          </a>
                          <a
                            href="https://ventouxmountainrunning.com/inscriptions-mdv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            Registration
                          </a>
                          <span>Contact: deniv84@orange.fr</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border p-3">June 21, 2026</td>
                      <td className="border p-3">Aviano</td>
                      <td className="border p-3">Italy 🇮🇹</td>
                      <td className="border p-3">
                        <div className="space-y-1 text-sm">
                          <a
                            href="https://www.piancavallo.run/eventi/10-miglia-aviano-piancavallo/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            Website
                          </a>
                          <a
                            href="https://my.raceresult.com/324754/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            Registration
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-blue-50 font-semibold">
                      <td className="border p-3">July 10-11, 2026</td>
                      <td className="border p-3">Stâna de Vale Trail Race</td>
                      <td className="border p-3">Romania 🇷🇴</td>
                      <td className="border p-3">
                        <div className="space-y-1 text-sm">
                          <span className="text-primary font-bold">
                            See current event pages
                          </span>
                          <span className="text-gray-500 text-sm block">
                            Check the race pages for current registration details
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-blue-100 font-semibold">
                      <td className="border p-3" colSpan={4}>
                        <div className="flex items-center justify-center">
                          <span>{t("emaCircuit.calendar.finalNote")}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-blue-600 italic mt-3">
                {t("emaCircuit.calendar.updateNote")}
              </p>
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
              href="mailto:contact@stanatrailrace.ro"
              className="text-[#2E7D32] hover:underline font-medium"
            >
              contact@stanatrailrace.ro
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
