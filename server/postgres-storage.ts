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
        // 11km Short Trail Race
        await this.createRace({
          name: "Short Trail",
          nameRo: "Traseu Scurt",
          nameFr: "Trail Court",
          nameDe: "Kurzer Trail",
          description: "A beginner-friendly 11km trail with 500m elevation gain. Perfect for those new to trail running or looking for a shorter distance.",
          descriptionRo: "Un traseu prietenos de 11km cu 500m diferență de nivel. Perfect pentru cei noi în alergarea montană sau care caută o distanță mai scurtă.",
          descriptionFr: "Un parcours de 11km adapté aux débutants avec 500m de dénivelé. Parfait pour les nouveaux coureurs de trail ou ceux qui recherchent une distance plus courte.",
          descriptionDe: "Ein anfängerfreundlicher 11km-Trail mit 500m Höhenunterschied. Perfekt für Einsteiger im Trail-Running oder für alle, die eine kürzere Strecke suchen.",
          distance: 11,
          elevation: 500,
          difficulty: "beginner",
          date: "2025-06-01",
          price: 30,
          raceMap: "/short-trail-11km.gpx",
          imageUrl: "https://images.unsplash.com/photo-1580058572459-91d17466ae89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        });
        
        // 33km Long Trail Race
        await this.createRace({
          name: "Long Trail",
          nameRo: "Traseu Lung",
          nameFr: "Trail Long",
          nameDe: "Langer Trail",
          description: "A challenging 33km trail with 1,600m elevation gain, featuring technical sections and breathtaking mountain views.",
          descriptionRo: "Un traseu provocator de 33km cu 1,600m diferență de nivel, cu secțiuni tehnice și priveliști montane spectaculoase.",
          descriptionFr: "Un parcours exigeant de 33km avec 1,600m de dénivelé, comprenant des sections techniques et des vues imprenables sur la montagne.",
          descriptionDe: "Ein anspruchsvoller 33km-Trail mit 1,600m Höhenunterschied, technischen Abschnitten und atemberaubenden Bergpanoramen.",
          distance: 33,
          elevation: 1600,
          difficulty: "advanced",
          date: "2025-06-01",
          price: 40,
          raceMap: "/long-trail-33km.gpx",
          imageUrl: "/33km.webp"
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
          order_index: 1
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
          order_index: 2
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
    return await db.select().from(faqs).orderBy(asc(faqs.order_index));
  }
  
  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const results = await db.insert(faqs).values(faq).returning();
    return results[0];
  }
  
  // Program event methods
  async getProgramEvents(): Promise<ProgramEvent[]> {
    return await db.select().from(programEvents)
      .orderBy(asc(programEvents.date), asc(programEvents.order_index));
  }
  
  async getProgramEventsByDate(date: string): Promise<ProgramEvent[]> {
    return await db.select().from(programEvents)
      .where(eq(programEvents.date, date))
      .orderBy(asc(programEvents.order_index));
  }
  
  async createProgramEvent(event: InsertProgramEvent): Promise<ProgramEvent> {
    const results = await db.insert(programEvents).values(event).returning();
    return results[0];
  }
  
  // Sponsor methods
  async getSponsors(): Promise<Sponsor[]> {
    return await db.select().from(sponsors).orderBy(asc(sponsors.order_index));
  }
  
  async getSponsorsByLevel(level: string): Promise<Sponsor[]> {
    return await db.select().from(sponsors)
      .where(eq(sponsors.level, level))
      .orderBy(asc(sponsors.order_index));
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