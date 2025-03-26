import { IStorage, MemStorage } from "./storage";
import { SupabaseStorage } from "./supabase-storage";
import { 
  User, InsertUser, 
  Race, InsertRace, 
  Participant, InsertParticipant, 
  ContactInquiry, InsertContactInquiry, 
  FAQ, InsertFAQ, 
  ProgramEvent, InsertProgramEvent, 
  Sponsor, InsertSponsor
} from "@shared/schema";

// HybridStorage uses Supabase for participants data and in-memory storage for other entities
export class HybridStorage implements IStorage {
  private memStorage: MemStorage;
  private supabaseStorage: SupabaseStorage;
  private supabaseAvailable: boolean = true;
  
  constructor() {
    this.memStorage = new MemStorage();
    this.supabaseStorage = new SupabaseStorage();
    
    // Test Supabase connection
    this.testSupabaseConnection();
  }
  
  private async testSupabaseConnection() {
    try {
      await this.supabaseStorage.getParticipants();
      this.supabaseAvailable = true;
      console.log("Supabase connection is available for participants data");
    } catch (error) {
      // If we get a "relation does not exist" error, Supabase is available but tables aren't created
      if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
        this.supabaseAvailable = false;
        console.warn("Supabase tables not created yet, using memory storage as fallback");
      } else {
        this.supabaseAvailable = false;
        console.error("Supabase connection failed, using memory storage as fallback:", error);
      }
    }
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

  // Participants - Use Supabase for storage with graceful fallback to in-memory storage
  async getParticipants(): Promise<Participant[]> {
    if (!this.supabaseAvailable) {
      console.log("Supabase not available for participants, using MemStorage");
      return this.memStorage.getParticipants();
    }

    try {
      // First try to get from Supabase
      console.log("Fetching all participants from Supabase");
      return await this.supabaseStorage.getParticipants();
    } catch (error) {
      console.error("Error fetching participants from Supabase:", error);
      console.warn("Falling back to in-memory participants data");
      return this.memStorage.getParticipants();
    }
  }
  
  async getParticipantById(id: number): Promise<Participant | undefined> {
    if (!this.supabaseAvailable) {
      console.log(`Supabase not available, using MemStorage for participant ${id}`);
      return this.memStorage.getParticipantById(id);
    }

    try {
      return await this.supabaseStorage.getParticipantById(id);
    } catch (error) {
      console.error(`Error fetching participant ${id} from Supabase:`, error);
      console.warn("Falling back to in-memory participant data");
      return this.memStorage.getParticipantById(id);
    }
  }
  
  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    if (!this.supabaseAvailable) {
      console.log(`Supabase not available, using MemStorage for participants in race ${raceId}`);
      return this.memStorage.getParticipantsByRace(raceId);
    }

    try {
      return await this.supabaseStorage.getParticipantsByRace(raceId);
    } catch (error) {
      console.error(`Error fetching participants for race ${raceId} from Supabase:`, error);
      console.warn("Falling back to in-memory participants data");
      return this.memStorage.getParticipantsByRace(raceId);
    }
  }
  
  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    if (!this.supabaseAvailable) {
      console.log(`Supabase not available, using MemStorage for participants from ${country}`);
      return this.memStorage.getParticipantsByCountry(country);
    }

    try {
      return await this.supabaseStorage.getParticipantsByCountry(country);
    } catch (error) {
      console.error(`Error fetching participants from country ${country} from Supabase:`, error);
      console.warn("Falling back to in-memory participants data");
      return this.memStorage.getParticipantsByCountry(country);
    }
  }
  
  async searchParticipants(query: string): Promise<Participant[]> {
    if (!this.supabaseAvailable) {
      console.log(`Supabase not available, using MemStorage for participant search: ${query}`);
      return this.memStorage.searchParticipants(query);
    }

    try {
      return await this.supabaseStorage.searchParticipants(query);
    } catch (error) {
      console.error(`Error searching participants with query ${query} from Supabase:`, error);
      console.warn("Falling back to in-memory participants data");
      return this.memStorage.searchParticipants(query);
    }
  }
  
  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    if (!this.supabaseAvailable) {
      console.log("Supabase not available, storing participant data in memory only");
      return this.memStorage.createParticipant(participant);
    }

    try {
      // Try to store in Supabase
      const newParticipant = await this.supabaseStorage.createParticipant(participant);
      console.log("Participant data successfully stored in Supabase:", newParticipant.id);
      return newParticipant;
    } catch (error) {
      console.error("Error creating participant in Supabase:", error);
      console.warn("Falling back to in-memory storage for participant data");
      
      // Store in memory as a fallback
      return this.memStorage.createParticipant(participant);
    }
  }
  
  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    if (!this.supabaseAvailable) {
      console.log(`Supabase not available, updating participant ${id} status in memory only`);
      return this.memStorage.updateParticipantStatus(id, status);
    }

    try {
      const updated = await this.supabaseStorage.updateParticipantStatus(id, status);
      console.log(`Successfully updated participant ${id} status to ${status} in Supabase`);
      return updated;
    } catch (error) {
      console.error(`Error updating participant status for ${id} in Supabase:`, error);
      console.warn("Falling back to in-memory storage for status update");
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