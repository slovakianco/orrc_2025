import { IStorage } from './storage';
import { db } from './db';
import { eq, like, or, sql } from 'drizzle-orm';
import { 
  users, User, InsertUser, 
  races, Race, InsertRace, 
  participants, Participant, InsertParticipant, 
  contactInquiries, ContactInquiry, InsertContactInquiry, 
  faqs, FAQ, InsertFAQ, 
  programEvents, ProgramEvent, InsertProgramEvent, 
  sponsors, Sponsor, InsertSponsor
} from "@shared/schema";

export class PostgresSupabaseStorage implements IStorage {
  constructor() {
    console.log('Initializing PostgreSQL-Supabase storage...');
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(user).returning();
      if (result.length === 0) {
        throw new Error('Failed to create user: No data returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
  }

  // Races
  async getRaces(): Promise<Race[]> {
    try {
      return await db.select().from(races).orderBy(races.id);
    } catch (error) {
      console.error('Error fetching races:', error);
      return [];
    }
  }

  async getRaceById(id: number): Promise<Race | undefined> {
    try {
      const result = await db.select().from(races).where(eq(races.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error(`Error fetching race with ID ${id}:`, error);
      return undefined;
    }
  }

  async getRacesByDifficulty(difficulty: string): Promise<Race[]> {
    try {
      // Using sql`` to create a typed condition for the enum
      return await db.select().from(races).where(sql`${races.difficulty} = ${difficulty}`).orderBy(races.id);
    } catch (error) {
      console.error(`Error fetching races with difficulty ${difficulty}:`, error);
      return [];
    }
  }

  async createRace(race: InsertRace): Promise<Race> {
    try {
      const result = await db.insert(races).values(race).returning();
      if (result.length === 0) {
        throw new Error('Failed to create race: No data returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating race:', error);
      throw new Error(`Failed to create race: ${(error as Error).message}`);
    }
  }

  // Participants
  async getParticipants(): Promise<Participant[]> {
    try {
      return await db.select().from(participants).orderBy(participants.id);
    } catch (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
  }

  async getParticipantById(id: number): Promise<Participant | undefined> {
    try {
      const result = await db.select().from(participants).where(eq(participants.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error(`Error fetching participant with ID ${id}:`, error);
      return undefined;
    }
  }

  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    try {
      return await db.select().from(participants).where(eq(participants.raceId, raceId)).orderBy(participants.lastName);
    } catch (error) {
      console.error(`Error fetching participants for race ${raceId}:`, error);
      return [];
    }
  }

  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    try {
      return await db.select().from(participants).where(eq(participants.country, country)).orderBy(participants.lastName);
    } catch (error) {
      console.error(`Error fetching participants from country ${country}:`, error);
      return [];
    }
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    try {
      return await db.select().from(participants).where(
        or(
          like(participants.firstName, `%${query}%`),
          like(participants.lastName, `%${query}%`)
        )
      ).orderBy(participants.lastName);
    } catch (error) {
      console.error(`Error searching participants with query ${query}:`, error);
      return [];
    }
  }

  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    try {
      // Get the race for bib number generation
      const race = await this.getRaceById(participant.raceId);
      if (!race) {
        throw new Error(`Race with ID ${participant.raceId} not found`);
      }
      
      // Generate bib number
      const raceCode = this.getRaceCodeForBib(race);
      
      // Count participants to generate a sequential bib number
      const participantCount = await db.select({ count: sql`count(*)` }).from(participants).where(eq(participants.raceId, participant.raceId));
      const count = Number(participantCount[0].count) || 0;
      
      const bibNumber = `${raceCode}-${count + 1}`;
      
      // Insert the participant with the generated bib number
      const now = new Date().toISOString();
      
      // Create a new object that conforms to the expected type
      // Since we're getting TypeScript errors about array properties
      const result = await db.insert(participants).values({
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        phoneNumber: participant.phoneNumber,
        country: participant.country,
        birthDate: participant.birthDate, 
        raceId: participant.raceId,
        gender: participant.gender,
        age: participant.age,
        medicalInfo: participant.medicalInfo || null,
        bibNumber,
        status: 'pending',
        registrationDate: now
      }).returning();
      if (result.length === 0) {
        throw new Error('Failed to create participant: No data returned');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error creating participant:', error);
      throw new Error(`Failed to create participant: ${(error as Error).message}`);
    }
  }

  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    try {
      const result = await db.update(participants).set({ status }).where(eq(participants.id, id)).returning();
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error(`Error updating status for participant ${id}:`, error);
      return undefined;
    }
  }

  // Contact Inquiries
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    try {
      const now = new Date().toISOString();
      
      // Create a new object with explicit properties to avoid array type mismatch
      const result = await db.insert(contactInquiries).values({
        name: inquiry.name,
        email: inquiry.email,
        subject: inquiry.subject,
        message: inquiry.message,
        createdAt: now
      }).returning();
      
      if (result.length === 0) {
        throw new Error('Failed to create contact inquiry: No data returned');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error creating contact inquiry:', error);
      throw new Error(`Failed to create contact inquiry: ${(error as Error).message}`);
    }
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    try {
      return await db.select().from(contactInquiries).orderBy(sql`${contactInquiries.createdAt} DESC`);
    } catch (error) {
      console.error('Error fetching contact inquiries:', error);
      return [];
    }
  }

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    try {
      return await db.select().from(faqs).orderBy(faqs.order);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }

  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    try {
      const result = await db.insert(faqs).values(faq).returning();
      if (result.length === 0) {
        throw new Error('Failed to create FAQ: No data returned');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw new Error(`Failed to create FAQ: ${(error as Error).message}`);
    }
  }

  // Program Events
  async getProgramEvents(): Promise<ProgramEvent[]> {
    try {
      return await db.select().from(programEvents).orderBy([programEvents.date, programEvents.order]);
    } catch (error) {
      console.error('Error fetching program events:', error);
      return [];
    }
  }

  async getProgramEventsByDate(date: string): Promise<ProgramEvent[]> {
    try {
      return await db.select().from(programEvents).where(eq(programEvents.date, date)).orderBy([programEvents.startTime, programEvents.order]);
    } catch (error) {
      console.error(`Error fetching program events for date ${date}:`, error);
      return [];
    }
  }

  async createProgramEvent(event: InsertProgramEvent): Promise<ProgramEvent> {
    try {
      const result = await db.insert(programEvents).values(event).returning();
      if (result.length === 0) {
        throw new Error('Failed to create program event: No data returned');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error creating program event:', error);
      throw new Error(`Failed to create program event: ${(error as Error).message}`);
    }
  }

  // Sponsors
  async getSponsors(): Promise<Sponsor[]> {
    try {
      return await db.select().from(sponsors).orderBy([sponsors.level, sponsors.order]);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      return [];
    }
  }

  async getSponsorsByLevel(level: string): Promise<Sponsor[]> {
    try {
      return await db.select().from(sponsors).where(eq(sponsors.level, level)).orderBy(sponsors.order);
    } catch (error) {
      console.error(`Error fetching sponsors with level ${level}:`, error);
      return [];
    }
  }

  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    try {
      const result = await db.insert(sponsors).values(sponsor).returning();
      if (result.length === 0) {
        throw new Error('Failed to create sponsor: No data returned');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error creating sponsor:', error);
      throw new Error(`Failed to create sponsor: ${(error as Error).message}`);
    }
  }
  
  // Helper methods
  private getRaceCodeForBib(race: Race): string {
    // Create a code based on the race distance
    const distance = race.distance || 0;
    
    if (distance <= 10) {
      return "10K";
    } else if (distance <= 21) {
      return "21K";
    } else if (distance <= 33) {
      return "33K";
    } else {
      return "ULTRA";
    }
  }
}

export const postgresSupabaseStorage = new PostgresSupabaseStorage();