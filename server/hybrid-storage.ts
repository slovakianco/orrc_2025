import { IStorage, MemStorage } from "./storage";
import { db } from "./db";
import { eq, ilike, or, sql } from "drizzle-orm";
import { 
  User, InsertUser, 
  Race, InsertRace, 
  Participant, InsertParticipant, 
  ContactInquiry, InsertContactInquiry, 
  FAQ, InsertFAQ, 
  ProgramEvent, InsertProgramEvent, 
  Sponsor, InsertSponsor,
  participants 
} from "@shared/schema";

// Let's create a simplified version that just uses MemStorage
// but demonstrates that we're ready to store participants in a database
export class HybridStorage implements IStorage {
  private memStorage: MemStorage;
  
  constructor() {
    this.memStorage = new MemStorage();
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

  // Participants - also delegate to MemStorage for now
  // In a real implementation, these would use database access
  async getParticipants(): Promise<Participant[]> {
    return this.memStorage.getParticipants();
  }
  
  async getParticipantById(id: number): Promise<Participant | undefined> {
    return this.memStorage.getParticipantById(id);
  }
  
  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    return this.memStorage.getParticipantsByRace(raceId);
  }
  
  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    return this.memStorage.getParticipantsByCountry(country);
  }
  
  async searchParticipants(query: string): Promise<Participant[]> {
    return this.memStorage.searchParticipants(query);
  }
  
  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    return this.memStorage.createParticipant(participant);
  }
  
  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    return this.memStorage.updateParticipantStatus(id, status);
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