import { 
  User, InsertUser, users,
  Race, InsertRace, races,
  Participant, InsertParticipant, participants,
  ContactInquiry, InsertContactInquiry, contactInquiries,
  FAQ, InsertFAQ, faqs,
  ProgramEvent, InsertProgramEvent, programEvents,
  Sponsor, InsertSponsor, sponsors
} from "@shared/schema";
import { eq, like, desc, asc, ilike, or, and, sql } from 'drizzle-orm';
import { db } from './db';
import { IStorage } from './storage';

export class PostgresStorage implements IStorage {
  
  constructor() {
    // Initialize database with sample data if needed
    this.initDatabase().catch(err => {
      console.error("Database initialization error:", err);
    });
  }
  
  // Initialize the database with sample data
  async initDatabase(): Promise<void> {
    try {
      // Check if races table already has data
      const existingRaces = await this.getRaces();
      
      if (existingRaces.length === 0) {
        console.log("Initializing database with sample data...");
        
        // Sample races - add them only if no races exist
        await this.createRace({
          name: "Mountain Explorer",
          nameRo: "Exploratorul Montan",
          nameFr: "L'Explorateur de Montagne",
          nameDe: "Bergentdecker",
          description: "A beautiful trail through mountain forests and alpine meadows, perfect for beginners looking to experience trail running in a safe and supportive environment.",
          descriptionRo: "Un traseu frumos prin păduri montane și pajiști alpine, perfect pentru începători care doresc să experimenteze alergarea pe poteci într-un mediu sigur și primitor.",
          descriptionFr: "Un magnifique sentier à travers les forêts de montagne et les prairies alpines, parfait pour les débutants qui souhaitent découvrir la course de trail dans un environnement sûr et encourageant.",
          descriptionDe: "Ein wunderschöner Pfad durch Bergwälder und Alpenwiesen, perfekt für Anfänger, die das Trail-Running in einer sicheren und unterstützenden Umgebung erleben möchten.",
          distance: 10,
          elevation: 350,
          difficulty: "beginner",
          date: "2025-06-01",
          price: 25,
          imageUrl: "https://images.unsplash.com/photo-1580058572459-91d17466ae89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        });
        
        await this.createRace({
          name: "Valley Challenge",
          nameRo: "Provocarea Văii",
          nameFr: "Le Défi de la Vallée",
          nameDe: "Tal-Herausforderung",
          description: "A fast course that takes you through scenic valleys and along riverside trails. Good for intermediate runners looking to improve their time and technique.",
          descriptionRo: "Un traseu rapid care te poartă prin văi pitorești și de-a lungul potecilor de lângă râu. Bun pentru alergătorii intermediari care doresc să-și îmbunătățească timpul și tehnica.",
          descriptionFr: "Un parcours rapide qui vous emmène à travers des vallées pittoresques et le long de sentiers au bord de la rivière. Idéal pour les coureurs intermédiaires qui souhaitent améliorer leur temps et leur technique.",
          descriptionDe: "Eine schnelle Strecke, die durch malerische Täler und entlang von Flussuferwegen führt. Gut für fortgeschrittene Läufer, die ihre Zeit und Technik verbessern möchten.",
          distance: 25,
          elevation: 750,
          difficulty: "intermediate",
          date: "2025-06-01",
          price: 40,
          imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        });
        
        await this.createRace({
          name: "Mountain Half Marathon",
          nameRo: "Semimaraton Montan",
          nameFr: "Semi-Marathon de Montagne",
          nameDe: "Berg-Halbmarathon",
          description: "The classic half marathon distance but with challenging mountain terrain. Experience steep climbs and technical descents with breathtaking views.",
          descriptionRo: "Distanța clasică de semimaraton, dar cu teren montan provocator. Experimentează urcări abrupte și coborâri tehnice cu priveliști impresionante.",
          descriptionFr: "La distance classique du semi-marathon mais avec un terrain montagneux difficile. Vivez des montées raides et des descentes techniques avec des vues à couper le souffle.",
          descriptionDe: "Die klassische Halbmarathon-Distanz, aber mit anspruchsvollem Berggelände. Erleben Sie steile Anstiege und technische Abfahrten mit atemberaubender Aussicht.",
          distance: 21,
          elevation: 1100,
          difficulty: "intermediate",
          date: "2025-06-01",
          price: 50,
          imageUrl: "https://images.unsplash.com/photo-1563109136-c56be64b9eef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        });
        
        await this.createRace({
          name: "Alpine Marathon",
          nameRo: "Maraton Alpin",
          nameFr: "Marathon Alpin",
          nameDe: "Alpen-Marathon",
          description: "A full marathon distance taking you through alpine landscapes with technical sections that will test your endurance and mountain running skills.",
          descriptionRo: "O distanță completă de maraton care te poartă prin peisaje alpine cu secțiuni tehnice care îți vor testa rezistența și abilitățile de alergare montană.",
          descriptionFr: "Une distance de marathon complète qui vous emmène à travers des paysages alpins avec des sections techniques qui mettront à l'épreuve votre endurance et vos compétences en course de montagne.",
          descriptionDe: "Eine komplette Marathonstrecke, die Sie durch alpine Landschaften mit technischen Abschnitten führt, die Ihre Ausdauer und Ihre Berglauffähigkeiten auf die Probe stellen werden.",
          distance: 42,
          elevation: 2200,
          difficulty: "advanced",
          date: "2025-06-02",
          price: 70,
          imageUrl: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        });
        
        await this.createRace({
          name: "Mountain Ultra",
          nameRo: "Ultra Montan",
          nameFr: "Ultra Montagne",
          nameDe: "Berg-Ultra",
          description: "Our flagship ultra-distance event covering 85km of mountain trails, testing the limits of even the most experienced trail runners with over 4500m of elevation gain.",
          descriptionRo: "Evenimentul nostru emblematic de ultra-distanță care acoperă 85 km de trasee montane, testând limitele chiar și celor mai experimentați alergători de trail cu peste 4500 m de urcare.",
          descriptionFr: "Notre événement phare sur ultra-distance couvrant 85 km de sentiers de montagne, testant les limites des coureurs de trail les plus expérimentés avec plus de 4500 m de dénivelé positif.",
          descriptionDe: "Unser Ultra-Distanz-Flaggschiffrennen über 85 km Bergpfade, das die Grenzen selbst der erfahrensten Trail-Läufer mit über 4500 m Höhenunterschied testet.",
          distance: 85,
          elevation: 4500,
          difficulty: "ultra",
          date: "2025-06-02",
          price: 100,
          imageUrl: "https://images.unsplash.com/photo-1519864967-22b37f31a770?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        });
        
        // Create a few initial FAQs
        await this.createFAQ({
          question: "What equipment do I need?",
          questionRo: "Ce echipament am nevoie?",
          questionFr: "De quel équipement ai-je besoin?",
          questionDe: "Welche Ausrüstung benötige ich?",
          answer: "All participants must have a hydration system, trail running shoes, weather-appropriate clothing, a whistle, and a mobile phone. Ultra distances require additional mandatory equipment including a headlamp, emergency blanket, and first aid kit.",
          answerRo: "Toți participanții trebuie să aibă un sistem de hidratare, pantofi de alergare pe poteci, îmbrăcăminte adecvată condițiilor meteorologice, un fluier și un telefon mobil. Distanțele ultra necesită echipament obligatoriu suplimentar, inclusiv o lanternă frontală, o pătură de urgență și o trusă de prim ajutor.",
          answerFr: "Tous les participants doivent avoir un système d'hydratation, des chaussures de trail, des vêtements adaptés aux conditions météorologiques, un sifflet et un téléphone portable. Les distances ultra nécessitent un équipement obligatoire supplémentaire, notamment une lampe frontale, une couverture de survie et une trousse de premiers secours.",
          answerDe: "Alle Teilnehmer müssen über ein Hydratationssystem, Trail-Running-Schuhe, wettergerechte Kleidung, eine Pfeife und ein Mobiltelefon verfügen. Ultra-Distanzen erfordern zusätzliche Pflichtausrüstung, darunter eine Stirnlampe, eine Rettungsdecke und ein Erste-Hilfe-Set.",
          order: 1
        });
        
        await this.createFAQ({
          question: "What happens if I need to cancel my registration?",
          questionRo: "Ce se întâmplă dacă trebuie să-mi anulez înregistrarea?",
          questionFr: "Que se passe-t-il si je dois annuler mon inscription?",
          questionDe: "Was passiert, wenn ich meine Anmeldung stornieren muss?",
          answer: "Cancellations made more than 60 days before the event will receive a 70% refund. Cancellations 30-60 days before will receive a 50% refund. No refunds are available for cancellations less than 30 days before the event, but you can transfer your entry to another runner for a €10 administration fee.",
          answerRo: "Anulările făcute cu mai mult de 60 de zile înainte de eveniment vor primi o rambursare de 70%. Anulările cu 30-60 de zile înainte vor primi o rambursare de 50%. Nu sunt disponibile rambursări pentru anulările făcute cu mai puțin de 30 de zile înainte de eveniment, dar puteți transfera înscrierea unui alt alergător pentru o taxă administrativă de 10 €.",
          answerFr: "Les annulations effectuées plus de 60 jours avant l'événement recevront un remboursement de 70%. Les annulations 30 à 60 jours avant recevront un remboursement de 50%. Aucun remboursement n'est disponible pour les annulations moins de 30 jours avant l'événement, mais vous pouvez transférer votre inscription à un autre coureur moyennant des frais administratifs de 10 €.",
          answerDe: "Bei Stornierungen, die mehr als 60 Tage vor der Veranstaltung erfolgen, erhalten Sie eine Rückerstattung von 70%. Bei Stornierungen 30-60 Tage vorher erhalten Sie eine Rückerstattung von 50%. Für Stornierungen weniger als 30 Tage vor der Veranstaltung sind keine Rückerstattungen möglich, aber Sie können Ihre Anmeldung gegen eine Verwaltungsgebühr von 10 € auf einen anderen Läufer übertragen.",
          order: 2
        });
        
        console.log("Database initialized with sample data.");
      } else {
        console.log("Database already contains data, skipping initialization.");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const results = await db.insert(users).values(user).returning();
    return results[0];
  }
  
  // Race methods
  async getRaces(): Promise<Race[]> {
    return await db.select().from(races).orderBy(asc(races.id));
  }
  
  async getRaceById(id: number): Promise<Race | undefined> {
    const results = await db.select().from(races).where(eq(races.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getRacesByDifficulty(difficulty: string): Promise<Race[]> {
    // Using a type cast to handle the enum type safely
    return await db.select().from(races)
      .where(eq(races.difficulty, difficulty as any))
      .orderBy(asc(races.id));
  }
  
  async createRace(race: InsertRace): Promise<Race> {
    const results = await db.insert(races).values(race).returning();
    return results[0];
  }
  
  // Participant methods
  async getParticipants(): Promise<Participant[]> {
    return await db.select().from(participants).orderBy(asc(participants.id));
  }
  
  async getParticipantById(id: number): Promise<Participant | undefined> {
    const results = await db.select().from(participants).where(eq(participants.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    return await db.select().from(participants).where(eq(participants.raceId, raceId)).orderBy(asc(participants.id));
  }
  
  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    return await db.select().from(participants).where(eq(participants.country, country)).orderBy(asc(participants.id));
  }
  
  async searchParticipants(query: string): Promise<Participant[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    
    // Use the or() operator to combine multiple conditions
    return await db.select().from(participants)
      .where(
        or(
          ilike(participants.firstName, lowerQuery),
          ilike(participants.lastName, lowerQuery),
          ilike(participants.country, lowerQuery),
          ilike(participants.bibNumber || '', lowerQuery)
        )
      )
      .orderBy(asc(participants.id));
  }
  
  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    const race = await this.getRaceById(participant.raceId);
    
    if (!race) {
      throw new Error("Race not found");
    }
    
    const registrationDate = new Date();
    
    // Calculate age from birthDate string (YYYY-MM-DD)
    const birthYear = parseInt(participant.birthDate.substring(0, 4));
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    // Generate BIB number
    const participantsByRace = await this.getParticipantsByRace(participant.raceId);
    const count = participantsByRace.length + 1;
    const bibNumber = `${this.getRaceCodeForBib(race)}${count.toString().padStart(3, '0')}`;
    
    const newParticipant = {
      ...participant,
      status: 'pending',
      registrationDate,
      bibNumber,
      age
    };
    
    const results = await db.insert(participants).values(newParticipant).returning();
    return results[0];
  }
  
  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    const participant = await this.getParticipantById(id);
    if (!participant) return undefined;
    
    const results = await db
      .update(participants)
      .set({ status })
      .where(eq(participants.id, id))
      .returning();
    
    return results[0];
  }
  
  // Contact inquiry methods
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const now = new Date();
    const newInquiry = { ...inquiry, createdAt: now };
    
    const results = await db.insert(contactInquiries).values(newInquiry).returning();
    return results[0];
  }
  
  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }
  
  // FAQ methods
  async getFAQs(): Promise<FAQ[]> {
    return await db.select().from(faqs).orderBy(asc(faqs.order));
  }
  
  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const results = await db.insert(faqs).values(faq).returning();
    return results[0];
  }
  
  // Program event methods
  async getProgramEvents(): Promise<ProgramEvent[]> {
    return await db.select().from(programEvents)
      .orderBy(asc(programEvents.date), asc(programEvents.order));
  }
  
  async getProgramEventsByDate(date: string): Promise<ProgramEvent[]> {
    return await db.select().from(programEvents)
      .where(eq(programEvents.date, date))
      .orderBy(asc(programEvents.order));
  }
  
  async createProgramEvent(event: InsertProgramEvent): Promise<ProgramEvent> {
    const results = await db.insert(programEvents).values(event).returning();
    return results[0];
  }
  
  // Sponsor methods
  async getSponsors(): Promise<Sponsor[]> {
    return await db.select().from(sponsors).orderBy(asc(sponsors.order));
  }
  
  async getSponsorsByLevel(level: string): Promise<Sponsor[]> {
    return await db.select().from(sponsors)
      .where(eq(sponsors.level, level))
      .orderBy(asc(sponsors.order));
  }
  
  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const results = await db.insert(sponsors).values(sponsor).returning();
    return results[0];
  }
  
  // Helper methods
  private getRaceCodeForBib(race: Race): string {
    const difficulty = race.difficulty.charAt(0).toUpperCase();
    const distance = race.distance.toString().padStart(2, '0');
    return `${difficulty}${distance}`;
  }
}

// Export a singleton instance
export const postgresStorage = new PostgresStorage();