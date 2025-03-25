import { IStorage, MemStorage } from "./storage";
import { PostgresStorage } from "./postgres-storage";
import { 
  User, InsertUser, 
  Race, InsertRace, 
  Participant, InsertParticipant, 
  ContactInquiry, InsertContactInquiry, 
  FAQ, InsertFAQ, 
  ProgramEvent, InsertProgramEvent, 
  Sponsor, InsertSponsor
} from "@shared/schema";

// HybridStorage uses PostgresStorage for participants and MemStorage for other entities
export class HybridStorage implements IStorage {
  private memStorage: MemStorage;
  private postgresStorage: PostgresStorage;
  
  constructor() {
    this.memStorage = new MemStorage();
    this.postgresStorage = new PostgresStorage();
  }
  
  // Users - delegate to MemStorage
  async getUser(id: number): Promise<User | undefined> {
    return this.memStorage.getUser(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.memStorage.getUserByUsername(username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    return this.memStorage.createUser(user);
  }

  // Races - delegate to MemStorage
  async getRaces(): Promise<Race[]> {
    return this.memStorage.getRaces();
  }
  
  async getRaceById(id: number): Promise<Race | undefined> {
    return this.memStorage.getRaceById(id);
  }
  
  async getRacesByDifficulty(difficulty: string): Promise<Race[]> {
    return this.memStorage.getRacesByDifficulty(difficulty);
  }
  
  async createRace(race: InsertRace): Promise<Race> {
    return this.memStorage.createRace(race);
  }

  // Participants - use PostgresStorage for database access
  async getParticipants(): Promise<Participant[]> {
    try {
      // First try to get from PostgreSQL
      return await this.postgresStorage.getParticipants();
    } catch (error) {
      console.error("Error fetching participants from database, falling back to memory:", error);
      // Fallback to memory if database access fails
      return this.memStorage.getParticipants();
    }
  }
  
  async getParticipantById(id: number): Promise<Participant | undefined> {
    try {
      return await this.postgresStorage.getParticipantById(id);
    } catch (error) {
      console.error(`Error fetching participant ${id} from database, falling back to memory:`, error);
      return this.memStorage.getParticipantById(id);
    }
  }
  
  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    try {
      return await this.postgresStorage.getParticipantsByRace(raceId);
    } catch (error) {
      console.error(`Error fetching participants for race ${raceId} from database, falling back to memory:`, error);
      return this.memStorage.getParticipantsByRace(raceId);
    }
  }
  
  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    try {
      return await this.postgresStorage.getParticipantsByCountry(country);
    } catch (error) {
      console.error(`Error fetching participants from country ${country} from database, falling back to memory:`, error);
      return this.memStorage.getParticipantsByCountry(country);
    }
  }
  
  async searchParticipants(query: string): Promise<Participant[]> {
    try {
      return await this.postgresStorage.searchParticipants(query);
    } catch (error) {
      console.error(`Error searching participants with query ${query} from database, falling back to memory:`, error);
      return this.memStorage.searchParticipants(query);
    }
  }
  
  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    try {
      // Store the participant in PostgreSQL
      return await this.postgresStorage.createParticipant(participant);
    } catch (error) {
      console.error("Error creating participant in database, falling back to memory:", error);
      // Fallback to memory storage if database access fails
      return this.memStorage.createParticipant(participant);
    }
  }
  
  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    try {
      return await this.postgresStorage.updateParticipantStatus(id, status);
    } catch (error) {
      console.error(`Error updating participant status for ${id} in database, falling back to memory:`, error);
      return this.memStorage.updateParticipantStatus(id, status);
    }
  }

  // Contact Inquiries - delegate to MemStorage
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    return this.memStorage.createContactInquiry(inquiry);
  }
  
  async getContactInquiries(): Promise<ContactInquiry[]> {
    return this.memStorage.getContactInquiries();
  }

  // FAQs - delegate to MemStorage
  async getFAQs(): Promise<FAQ[]> {
    return this.memStorage.getFAQs();
  }
  
  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    return this.memStorage.createFAQ(faq);
  }

  // Program Events - delegate to MemStorage
  async getProgramEvents(): Promise<ProgramEvent[]> {
    return this.memStorage.getProgramEvents();
  }
  
  async getProgramEventsByDate(date: string): Promise<ProgramEvent[]> {
    return this.memStorage.getProgramEventsByDate(date);
  }
  
  async createProgramEvent(event: InsertProgramEvent): Promise<ProgramEvent> {
    return this.memStorage.createProgramEvent(event);
  }

  // Sponsors - delegate to MemStorage
  async getSponsors(): Promise<Sponsor[]> {
    return this.memStorage.getSponsors();
  }
  
  async getSponsorsByLevel(level: string): Promise<Sponsor[]> {
    return this.memStorage.getSponsorsByLevel(level);
  }
  
  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    return this.memStorage.createSponsor(sponsor);
  }
}

// Export a singleton instance
export const hybridStorage = new HybridStorage();