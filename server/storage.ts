import { 
  User, InsertUser, users,
  Race, InsertRace, races,
  Participant, InsertParticipant, participants,
  ContactInquiry, InsertContactInquiry, contactInquiries,
  FAQ, InsertFAQ, faqs,
  ProgramEvent, InsertProgramEvent, programEvents,
  Sponsor, InsertSponsor, sponsors
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Races
  getRaces(): Promise<Race[]>;
  getRaceById(id: number): Promise<Race | undefined>;
  getRacesByDifficulty(difficulty: string): Promise<Race[]>;
  createRace(race: InsertRace): Promise<Race>;

  // Participants
  getParticipants(): Promise<Participant[]>;
  getParticipantById(id: number): Promise<Participant | undefined>;
  getParticipantsByRace(raceId: number): Promise<Participant[]>;
  getParticipantsByCountry(country: string): Promise<Participant[]>;
  searchParticipants(query: string): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  updateParticipantStatus(id: number, status: string): Promise<Participant | undefined>;

  // Contact Inquiries
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;

  // FAQs
  getFAQs(): Promise<FAQ[]>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;

  // Program Events
  getProgramEvents(): Promise<ProgramEvent[]>;
  getProgramEventsByDate(date: string): Promise<ProgramEvent[]>;
  createProgramEvent(event: InsertProgramEvent): Promise<ProgramEvent>;

  // Sponsors
  getSponsors(): Promise<Sponsor[]>;
  getSponsorsByLevel(level: string): Promise<Sponsor[]>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private races: Map<number, Race>;
  private participants: Map<number, Participant>;
  private contactInquiries: Map<number, ContactInquiry>;
  private faqs: Map<number, FAQ>;
  private programEvents: Map<number, ProgramEvent>;
  private sponsors: Map<number, Sponsor>;
  
  private userId: number;
  private raceId: number;
  private participantId: number;
  private contactInquiryId: number;
  private faqId: number;
  private programEventId: number;
  private sponsorId: number;

  constructor() {
    this.users = new Map();
    this.races = new Map();
    this.participants = new Map();
    this.contactInquiries = new Map();
    this.faqs = new Map();
    this.programEvents = new Map();
    this.sponsors = new Map();
    
    this.userId = 1;
    this.raceId = 1;
    this.participantId = 1;
    this.contactInquiryId = 1;
    this.faqId = 1;
    this.programEventId = 1;
    this.sponsorId = 1;

    this.initializeSampleData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Races
  async getRaces(): Promise<Race[]> {
    return Array.from(this.races.values());
  }

  async getRaceById(id: number): Promise<Race | undefined> {
    return this.races.get(id);
  }

  async getRacesByDifficulty(difficulty: string): Promise<Race[]> {
    return Array.from(this.races.values()).filter(
      (race) => race.difficulty === difficulty
    );
  }

  async createRace(race: InsertRace): Promise<Race> {
    const id = this.raceId++;
    const newRace: Race = { ...race, id };
    this.races.set(id, newRace);
    return newRace;
  }

  // Participants
  async getParticipants(): Promise<Participant[]> {
    return Array.from(this.participants.values());
  }

  async getParticipantById(id: number): Promise<Participant | undefined> {
    return this.participants.get(id);
  }

  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    return Array.from(this.participants.values()).filter(
      (participant) => participant.raceId === raceId
    );
  }

  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    return Array.from(this.participants.values()).filter(
      (participant) => participant.country.toLowerCase() === country.toLowerCase()
    );
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.participants.values()).filter(
      (participant) => 
        participant.firstName.toLowerCase().includes(lowercaseQuery) ||
        participant.lastName.toLowerCase().includes(lowercaseQuery) ||
        participant.country.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    const id = this.participantId++;
    
    // Generate bib number based on race
    const race = await this.getRaceById(participant.raceId);
    const raceCode = race ? this.getRaceCodeForBib(race) : 'X';
    
    // Count participants in the same race to determine number
    const raceParticipants = await this.getParticipantsByRace(participant.raceId);
    const participantNumber = raceParticipants.length + 1;
    
    // Format: "X-001", "E-023", etc.
    const bibNumber = `${raceCode}-${participantNumber.toString().padStart(3, '0')}`;
    
    // Current timestamp for registrationDate
    const now = new Date();
    
    const newParticipant: Participant = { 
      ...participant, 
      id,
      bibNumber,
      registrationDate: now,
    };
    
    this.participants.set(id, newParticipant);
    return newParticipant;
  }

  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    const participant = await this.getParticipantById(id);
    if (!participant) return undefined;
    
    const updatedParticipant: Participant = { ...participant, status };
    this.participants.set(id, updatedParticipant);
    return updatedParticipant;
  }

  // Contact Inquiries
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const id = this.contactInquiryId++;
    const now = new Date();
    const newInquiry: ContactInquiry = { ...inquiry, id, createdAt: now };
    this.contactInquiries.set(id, newInquiry);
    return newInquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return Array.from(this.contactInquiries.values());
  }

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    return Array.from(this.faqs.values()).sort((a, b) => a.order - b.order);
  }

  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const id = this.faqId++;
    const newFAQ: FAQ = { ...faq, id };
    this.faqs.set(id, newFAQ);
    return newFAQ;
  }

  // Program Events
  async getProgramEvents(): Promise<ProgramEvent[]> {
    return Array.from(this.programEvents.values()).sort((a, b) => {
      // First sort by date
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // If same date, sort by order
      return a.order - b.order;
    });
  }

  async getProgramEventsByDate(date: string): Promise<ProgramEvent[]> {
    return Array.from(this.programEvents.values())
      .filter((event) => event.date === date)
      .sort((a, b) => a.order - b.order);
  }

  async createProgramEvent(event: InsertProgramEvent): Promise<ProgramEvent> {
    const id = this.programEventId++;
    const newEvent: ProgramEvent = { ...event, id };
    this.programEvents.set(id, newEvent);
    return newEvent;
  }

  // Sponsors
  async getSponsors(): Promise<Sponsor[]> {
    return Array.from(this.sponsors.values()).sort((a, b) => a.order - b.order);
  }

  async getSponsorsByLevel(level: string): Promise<Sponsor[]> {
    return Array.from(this.sponsors.values())
      .filter((sponsor) => sponsor.level === level)
      .sort((a, b) => a.order - b.order);
  }

  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const id = this.sponsorId++;
    const newSponsor: Sponsor = { ...sponsor, id };
    this.sponsors.set(id, newSponsor);
    return newSponsor;
  }

  // Helper methods
  private getRaceCodeForBib(race: Race): string {
    const difficulty = race.difficulty;
    
    switch (difficulty) {
      case 'beginner':
        return 'E'; // Explorer
      case 'intermediate':
        return 'F'; // Forest
      case 'advanced':
      case 'ultra':
        return 'U'; // Ultra
      default:
        return 'X';
    }
  }

  // Initialize sample data
  private initializeSampleData() {
    // Sample Races
    this.createRace({
      name: "Mountain Explorer",
      nameRo: "Exploratorul Montan",
      nameFr: "Explorateur de Montagne",
      nameDe: "Bergentdecker",
      description: "Perfect for beginners, this scenic route offers beautiful mountain views without extreme technical challenges.",
      descriptionRo: "Perfect pentru începători, acest traseu scenic oferă priveliști montane frumoase fără provocări tehnice extreme.",
      descriptionFr: "Parfait pour les débutants, cet itinéraire pittoresque offre de magnifiques vues sur la montagne sans défis techniques extrêmes.",
      descriptionDe: "Perfekt für Anfänger, diese malerische Route bietet wunderschöne Bergpanoramen ohne extreme technische Herausforderungen.",
      distance: 10,
      elevation: 350,
      difficulty: "beginner",
      date: "2024-06-15",
      price: 45,
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306"
    });

    this.createRace({
      name: "Forest Challenge",
      nameRo: "Provocarea Pădurii",
      nameFr: "Défi Forestier",
      nameDe: "Waldherausforderung",
      description: "A beautiful half-marathon through dense forests and rolling hills, suitable for intermediate runners.",
      descriptionRo: "Un semi-maraton frumos prin păduri dense și dealuri line, potrivit pentru alergători de nivel intermediar.",
      descriptionFr: "Un magnifique semi-marathon à travers des forêts denses et des collines vallonnées, adapté aux coureurs intermédiaires.",
      descriptionDe: "Ein schöner Halbmarathon durch dichte Wälder und sanfte Hügel, geeignet für Läufer mit mittlerem Niveau.",
      distance: 21,
      elevation: 850,
      difficulty: "intermediate",
      date: "2024-06-16",
      price: 65,
      imageUrl: "https://images.unsplash.com/photo-1510111652602-195fc654aa83"
    });

    this.createRace({
      name: "Summit Ultra",
      nameRo: "Ultra Vârf",
      nameFr: "Ultra Sommet",
      nameDe: "Gipfel Ultra",
      description: "The ultimate challenge with technical terrain and breathtaking summit views. For experienced trail runners.",
      descriptionRo: "Provocarea supremă cu teren tehnic și vederi uimitoare ale vârfurilor. Pentru alergători cu experiență.",
      descriptionFr: "Le défi ultime avec un terrain technique et des vues imprenables sur les sommets. Pour les coureurs expérimentés.",
      descriptionDe: "Die ultimative Herausforderung mit technischem Gelände und atemberaubenden Gipfelblicken. Für erfahrene Trailläufer.",
      distance: 50,
      elevation: 2500,
      difficulty: "advanced",
      date: "2024-06-17",
      price: 95,
      imageUrl: "https://images.unsplash.com/photo-1590136500603-a143a477b815"
    });

    // Sample FAQs
    this.createFAQ({
      question: "How do I register for the competition?",
      questionRo: "Cum mă înscriu pentru competiție?",
      questionFr: "Comment puis-je m'inscrire à la compétition?",
      questionDe: "Wie melde ich mich für den Wettbewerb an?",
      answer: "Registration is available online through our website. Simply go to the Registration section, choose your race, fill out the form, and complete the payment. You'll receive a confirmation email with all the details.",
      answerRo: "Înregistrarea este disponibilă online prin intermediul site-ului nostru. Accesați secțiunea Înregistrare, alegeți cursa, completați formularul și efectuați plata. Veți primi un e-mail de confirmare cu toate detaliile.",
      answerFr: "L'inscription est disponible en ligne sur notre site web. Accédez simplement à la section Inscription, choisissez votre course, remplissez le formulaire et effectuez le paiement. Vous recevrez un email de confirmation avec tous les détails.",
      answerDe: "Die Registrierung ist online über unsere Website verfügbar. Gehen Sie einfach zum Registrierungsbereich, wählen Sie Ihr Rennen aus, füllen Sie das Formular aus und führen Sie die Zahlung durch. Sie erhalten eine Bestätigungs-E-Mail mit allen Details.",
      order: 1
    });

    this.createFAQ({
      question: "What should I bring on race day?",
      questionRo: "Ce ar trebui să aduc în ziua cursei?",
      questionFr: "Que dois-je apporter le jour de la course?",
      questionDe: "Was sollte ich am Renntag mitbringen?",
      answer: "Bring your ID, confirmation email, and all the required equipment for your race. Check the Rules section for the specific equipment required for your race distance. Don't forget to dress appropriately for the weather conditions.",
      answerRo: "Aduceți actul de identitate, e-mailul de confirmare și tot echipamentul necesar pentru cursa dvs. Verificați secțiunea Reguli pentru echipamentul specific necesar pentru distanța de cursă. Nu uitați să vă îmbrăcați corespunzător pentru condițiile meteorologice.",
      answerFr: "Apportez votre pièce d'identité, votre e-mail de confirmation et tout l'équipement requis pour votre course. Consultez la section Règles pour l'équipement spécifique requis pour la distance de votre course. N'oubliez pas de vous habiller de manière appropriée selon les conditions météorologiques.",
      answerDe: "Bringen Sie Ihren Ausweis, die Bestätigungs-E-Mail und die gesamte erforderliche Ausrüstung für Ihr Rennen mit. Überprüfen Sie den Regelabschnitt für die spezifische Ausrüstung, die für Ihre Renndistanz erforderlich ist. Vergessen Sie nicht, sich angemessen für die Wetterbedingungen zu kleiden.",
      order: 2
    });

    this.createFAQ({
      question: "Are there aid stations on the course?",
      questionRo: "Există stații de ajutor pe traseu?",
      questionFr: "Y a-t-il des postes de ravitaillement sur le parcours?",
      questionDe: "Gibt es Verpflegungsstationen auf der Strecke?",
      answer: "Yes, there are aid stations along all race routes. The 10km race has 2 aid stations, the 21km race has 4 aid stations, and the 50km race has 8 aid stations. Each aid station provides water, sports drinks, and various snacks.",
      answerRo: "Da, există stații de ajutor de-a lungul tuturor traseelor de cursă. Cursa de 10 km are 2 stații de ajutor, cursa de 21 km are 4 stații de ajutor, iar cursa de 50 km are 8 stații de ajutor. Fiecare stație de ajutor oferă apă, băuturi sportive și diverse gustări.",
      answerFr: "Oui, il y a des postes de ravitaillement le long de tous les parcours. La course de 10 km a 2 postes, la course de 21 km a 4 postes, et la course de 50 km a 8 postes. Chaque poste fournit de l'eau, des boissons sportives et diverses collations.",
      answerDe: "Ja, es gibt Verpflegungsstationen entlang aller Rennstrecken. Das 10-km-Rennen hat 2 Stationen, das 21-km-Rennen hat 4 Stationen und das 50-km-Rennen hat 8 Stationen. Jede Station bietet Wasser, Sportgetränke und verschiedene Snacks.",
      order: 3
    });

    this.createFAQ({
      question: "Can I change my race after registering?",
      questionRo: "Pot schimba cursa după înregistrare?",
      questionFr: "Puis-je changer de course après m'être inscrit?",
      questionDe: "Kann ich mein Rennen nach der Anmeldung ändern?",
      answer: "Race changes are possible up to 30 days before the event, subject to availability. To change your race, please contact our support team via email. Note that changing to a more expensive race requires an additional payment, while changing to a less expensive race does not offer a refund of the difference.",
      answerRo: "Schimbările de cursă sunt posibile cu până la 30 de zile înainte de eveniment, în funcție de disponibilitate. Pentru a schimba cursa, vă rugăm să contactați echipa noastră de asistență prin e-mail. Rețineți că schimbarea la o cursă mai scumpă necesită o plată suplimentară, în timp ce schimbarea la o cursă mai puțin costisitoare nu oferă o rambursare a diferenței.",
      answerFr: "Les changements de course sont possibles jusqu'à 30 jours avant l'événement, sous réserve de disponibilité. Pour changer de course, veuillez contacter notre équipe d'assistance par e-mail. Notez que passer à une course plus chère nécessite un paiement supplémentaire, tandis que passer à une course moins chère n'offre pas de remboursement de la différence.",
      answerDe: "Rennänderungen sind bis zu 30 Tage vor der Veranstaltung möglich, vorbehaltlich der Verfügbarkeit. Um Ihr Rennen zu ändern, kontaktieren Sie bitte unser Support-Team per E-Mail. Beachten Sie, dass der Wechsel zu einem teureren Rennen eine zusätzliche Zahlung erfordert, während der Wechsel zu einem günstigeren Rennen keine Rückerstattung der Differenz bietet.",
      order: 4
    });

    // Program Events - Day 1
    this.createProgramEvent({
      date: "2024-06-15",
      startTime: "09:00",
      endTime: "18:00",
      title: "Registration & Bib Collection",
      titleRo: "Înregistrare și ridicare numere",
      titleFr: "Inscription et collecte des dossards",
      titleDe: "Registrierung und Abholung der Startnummern",
      description: "Main Event Center - Collect your registration package and race bib.",
      descriptionRo: "Centrul Principal al Evenimentului - Ridicați pachetul de înregistrare și numărul de concurs.",
      descriptionFr: "Centre Principal de l'Événement - Récupérez votre pack d'inscription et votre dossard.",
      descriptionDe: "Hauptveranstaltungszentrum - Holen Sie Ihr Registrierungspaket und Ihre Startnummer ab.",
      location: "Main Event Center",
      order: 1
    });

    this.createProgramEvent({
      date: "2024-06-15",
      startTime: "14:00",
      endTime: "16:00",
      title: "Expo & Sponsor Showcase",
      titleRo: "Expoziție și prezentare sponsori",
      titleFr: "Expo et présentation des sponsors",
      titleDe: "Expo und Sponsorenpräsentation",
      description: "Outdoor Exhibition Area - Visit our sponsors and check out the latest trail running gear.",
      descriptionRo: "Zona de Expoziție în Aer Liber - Vizitați sponsorii noștri și verificați cele mai recente echipamente de alergare.",
      descriptionFr: "Zone d'Exposition Extérieure - Visitez nos sponsors et découvrez les derniers équipements de trail running.",
      descriptionDe: "Außenausstellungsbereich - Besuchen Sie unsere Sponsoren und entdecken Sie die neueste Trailrunning-Ausrüstung.",
      location: "Outdoor Exhibition Area",
      order: 2
    });

    this.createProgramEvent({
      date: "2024-06-15",
      startTime: "17:00",
      endTime: "18:30",
      title: "Race Briefing: Mountain Explorer",
      titleRo: "Briefing cursă: Exploratorul Montan",
      titleFr: "Briefing course: Explorateur de Montagne",
      titleDe: "Rennbriefing: Bergentdecker",
      description: "Conference Room - Mandatory briefing for all 10km race participants.",
      descriptionRo: "Sala de Conferințe - Briefing obligatoriu pentru toți participanții la cursa de 10 km.",
      descriptionFr: "Salle de Conférence - Briefing obligatoire pour tous les participants à la course de 10 km.",
      descriptionDe: "Konferenzsaal - Obligatorisches Briefing für alle Teilnehmer des 10-km-Rennens.",
      location: "Conference Room",
      order: 3
    });

    // Program Events - Day 2
    this.createProgramEvent({
      date: "2024-06-16",
      startTime: "07:00",
      endTime: null,
      title: "Mountain Explorer Race Start",
      titleRo: "Start cursă: Exploratorul Montan",
      titleFr: "Départ course: Explorateur de Montagne",
      titleDe: "Rennstart: Bergentdecker",
      description: "Main Starting Area - 10km race begins.",
      descriptionRo: "Zona principală de start - Începe cursa de 10 km.",
      descriptionFr: "Zone de départ principale - La course de 10 km commence.",
      descriptionDe: "Hauptstartbereich - Das 10-km-Rennen beginnt.",
      location: "Main Starting Area",
      order: 1
    });

    this.createProgramEvent({
      date: "2024-06-16",
      startTime: "09:00",
      endTime: null,
      title: "Forest Challenge Race Start",
      titleRo: "Start cursă: Provocarea Pădurii",
      titleFr: "Départ course: Défi Forestier",
      titleDe: "Rennstart: Waldherausforderung",
      description: "Main Starting Area - 21km race begins.",
      descriptionRo: "Zona principală de start - Începe cursa de 21 km.",
      descriptionFr: "Zone de départ principale - La course de 21 km commence.",
      descriptionDe: "Hauptstartbereich - Das 21-km-Rennen beginnt.",
      location: "Main Starting Area",
      order: 2
    });

    // Program Events - Day 3
    this.createProgramEvent({
      date: "2024-06-17",
      startTime: "05:00",
      endTime: null,
      title: "Summit Ultra Race Start",
      titleRo: "Start cursă: Ultra Vârf",
      titleFr: "Départ course: Ultra Sommet",
      titleDe: "Rennstart: Gipfel Ultra",
      description: "Main Starting Area - 50km race begins.",
      descriptionRo: "Zona principală de start - Începe cursa de 50 km.",
      descriptionFr: "Zone de départ principale - La course de 50 km commence.",
      descriptionDe: "Hauptstartbereich - Das 50-km-Rennen beginnt.",
      location: "Main Starting Area",
      order: 1
    });

    this.createProgramEvent({
      date: "2024-06-17",
      startTime: "18:00",
      endTime: "20:00",
      title: "Award Ceremony & Closing Party",
      titleRo: "Ceremonia de premiere și petrecerea de închidere",
      titleFr: "Cérémonie de remise des prix et fête de clôture",
      titleDe: "Preisverleihung & Abschlussfeier",
      description: "Main Stage - Celebration, awards for all races, and closing festivities.",
      descriptionRo: "Scena Principală - Festivități, premii pentru toate cursele și festivități de închidere.",
      descriptionFr: "Scène Principale - Célébration, remise des prix pour toutes les courses et festivités de clôture.",
      descriptionDe: "Hauptbühne - Feier, Preise für alle Rennen und Abschlussfeierlichkeiten.",
      location: "Main Stage",
      order: 2
    });

    // Sponsors
    this.createSponsor({
      name: "Outdoor Gear Co.",
      description: "Leading provider of premium outdoor and trail running equipment.",
      descriptionRo: "Furnizor principal de echipamente premium pentru activități în aer liber și alergare montană.",
      descriptionFr: "Fournisseur principal d'équipements premium pour les activités de plein air et la course en montagne.",
      descriptionDe: "Führender Anbieter von Premium-Ausrüstung für Outdoor-Aktivitäten und Trailrunning.",
      logoPlaceholder: "OUTDOOR GEAR CO.",
      website: "https://example.com/outdoorgearco",
      level: "premium",
      order: 1
    });

    this.createSponsor({
      name: "Mountain Energy",
      description: "Sports nutrition specialists providing energy for trail runners.",
      descriptionRo: "Specialiști în nutriție sportivă care oferă energie pentru alergătorii montani.",
      descriptionFr: "Spécialistes en nutrition sportive fournissant de l'énergie aux coureurs de trail.",
      descriptionDe: "Sportnahrungsspezialisten, die Energie für Trailrunner bereitstellen.",
      logoPlaceholder: "MOUNTAIN ENERGY",
      website: "https://example.com/mountainenergy",
      level: "premium",
      order: 2
    });

    this.createSponsor({
      name: "Alpine Resorts",
      description: "Luxury accommodations in the heart of the Carpathian Mountains.",
      descriptionRo: "Cazare de lux în inima Munților Carpați.",
      descriptionFr: "Hébergement de luxe au cœur des Carpates.",
      descriptionDe: "Luxusunterkünfte im Herzen der Karpaten.",
      logoPlaceholder: "ALPINE RESORTS",
      website: "https://example.com/alpineresorts",
      level: "premium",
      order: 3
    });

    // Standard sponsors
    this.createSponsor({
      name: "Trail Shoes",
      description: "Specialized footwear for trail running enthusiasts.",
      descriptionRo: "Încălțăminte specializată pentru entuziaștii de alergare montană.",
      descriptionFr: "Chaussures spécialisées pour les passionnés de course en montagne.",
      descriptionDe: "Spezialisiertes Schuhwerk für Trailrunning-Enthusiasten.",
      logoPlaceholder: "TRAIL SHOES",
      website: "https://example.com/trailshoes",
      level: "standard",
      order: 1
    });

    this.createSponsor({
      name: "Hydro Pack",
      description: "Premium hydration solutions for runners and outdoor enthusiasts.",
      descriptionRo: "Soluții premium de hidratare pentru alergători și entuziaști ai activităților în aer liber.",
      descriptionFr: "Solutions d'hydratation premium pour coureurs et passionnés d'activités de plein air.",
      descriptionDe: "Premium-Hydrationslösungen für Läufer und Outdoor-Enthusiasten.",
      logoPlaceholder: "HYDRO PACK",
      website: "https://example.com/hydropack",
      level: "standard",
      order: 2
    });

    // Sample Participants
    this.createParticipant({
      firstName: "Alex",
      lastName: "Muntean",
      email: "alex.muntean@example.com",
      phoneNumber: "+40123456789",
      country: "Romania",
      birthDate: "1992-05-15",
      raceId: 3, // Summit Ultra
      medicalInfo: "No allergies",
      status: "confirmed",
      gender: "M",
      age: 32
    });

    this.createParticipant({
      firstName: "Sophie",
      lastName: "Dubois",
      email: "sophie.dubois@example.com",
      phoneNumber: "+33678901234",
      country: "France",
      birthDate: "1995-08-20",
      raceId: 2, // Forest Challenge
      medicalInfo: "Mild pollen allergy",
      status: "confirmed",
      gender: "F",
      age: 29
    });

    this.createParticipant({
      firstName: "Markus",
      lastName: "Klein",
      email: "markus.klein@example.com",
      phoneNumber: "+49987654321",
      country: "Germany",
      birthDate: "1979-03-10",
      raceId: 1, // Mountain Explorer
      medicalInfo: "Previous knee injury, fully healed",
      status: "pending",
      gender: "M",
      age: 45
    });
  }
}

export const storage = new MemStorage();
