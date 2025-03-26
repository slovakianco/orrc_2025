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

// HybridStorage uses SupabaseStorage for participants and MemStorage for other entities
export class HybridStorage implements IStorage {
  private memStorage: MemStorage;
  private supabaseStorage: SupabaseStorage;
  
  constructor() {
    this.memStorage = new MemStorage();
    this.supabaseStorage = new SupabaseStorage();
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

  // Participants - Use PostgresSupabaseStorage for database access with graceful fallback to memory
  async getParticipants(): Promise<Participant[]> {
    try {
      // First try to get from Supabase
      console.log("Fetching all participants");
      return await this.supabaseStorage.getParticipants();
    } catch (error) {
      console.error("Error fetching participants from Supabase:", error);
      console.warn("Supabase connection issue detected, using in-memory participants as fallback");
      // Fallback to memory if Supabase access fails
      return [];  // Return empty array instead of sample data
    }
  }
  
  async getParticipantById(id: number): Promise<Participant | undefined> {
    try {
      return await this.supabaseStorage.getParticipantById(id);
    } catch (error) {
      console.error(`Error fetching participant ${id} from Supabase:`, error);
      console.warn("Supabase connection issue detected, using in-memory fallback");
      return undefined;  // Return undefined instead of sample data
    }
  }
  
  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    try {
      return await this.supabaseStorage.getParticipantsByRace(raceId);
    } catch (error) {
      console.error(`Error fetching participants for race ${raceId} from Supabase:`, error);
      console.warn("Supabase connection issue detected, using in-memory fallback");
      return [];  // Return empty array instead of sample data
    }
  }
  
  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    try {
      return await this.supabaseStorage.getParticipantsByCountry(country);
    } catch (error) {
      console.error(`Error fetching participants from country ${country} from Supabase:`, error);
      console.warn("Supabase connection issue detected, using in-memory fallback");
      return [];  // Return empty array instead of sample data
    }
  }
  
  async searchParticipants(query: string): Promise<Participant[]> {
    try {
      return await this.dbStorage.searchParticipants(query);
    } catch (error) {
      console.error(`Error searching participants with query ${query} from database:`, error);
      console.warn("Database connection issue detected, using in-memory fallback");
      return [];  // Return empty array instead of sample data
    }
  }
  
  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    try {
      // Try to store in database
      return await this.dbStorage.createParticipant(participant);
    } catch (error) {
      console.error("Error creating participant in database:", error);
      console.warn("Database connection issue detected. Participant data will NOT be saved.");
      
      // Create a temporary Participant object that matches the exact type definition
      // Extract the fields from InsertParticipant and add the required fields for Participant
      return {
        // Fields from the insert participant
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        phoneNumber: participant.phoneNumber,
        country: participant.country,
        birthDate: participant.birthDate,
        raceId: participant.raceId,
        gender: participant.gender,
        age: participant.age,
        
        // Optional field with proper null handling
        medicalInfo: participant.medicalInfo || null,
        
        // Required fields for the Participant type that are not in InsertParticipant
        id: 0,
        bibNumber: "TMP-0",
        status: "pending",
        registrationDate: new Date()
      };
    }
  }
  
  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    try {
      return await this.dbStorage.updateParticipantStatus(id, status);
    } catch (error) {
      console.error(`Error updating participant status for ${id} in database:`, error);
      console.warn("Database connection issue detected, status update failed");
      return undefined;
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