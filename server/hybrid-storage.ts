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

  // Participants - ONLY use PostgresStorage for database access, no memory fallback
  async getParticipants(): Promise<Participant[]> {
    // Always use database for participants
    return await this.postgresStorage.getParticipants();
  }
  
  async getParticipantById(id: number): Promise<Participant | undefined> {
    // Always use database for participants
    return await this.postgresStorage.getParticipantById(id);
  }
  
  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    // Always use database for participants
    return await this.postgresStorage.getParticipantsByRace(raceId);
  }
  
  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    // Always use database for participants
    return await this.postgresStorage.getParticipantsByCountry(country);
  }
  
  async searchParticipants(query: string): Promise<Participant[]> {
    // Always use database for participants
    return await this.postgresStorage.searchParticipants(query);
  }
  
  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    // Always store participants in database
    return await this.postgresStorage.createParticipant(participant);
  }
  
  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    // Always use database for participants
    return await this.postgresStorage.updateParticipantStatus(id, status);
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