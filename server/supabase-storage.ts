import { supabase } from './supabase';
import { IStorage } from './storage';
import { 
  User, InsertUser, 
  Race, InsertRace, 
  Participant, InsertParticipant, 
  ContactInquiry, InsertContactInquiry, 
  FAQ, InsertFAQ, 
  ProgramEvent, InsertProgramEvent, 
  Sponsor, InsertSponsor
} from "@shared/schema";

export class SupabaseStorage implements IStorage {
  constructor() {
    console.log('Initializing Supabase storage...');
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching user by ID:', error);
      return undefined;
    }
    
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
    
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error?.message}`);
    }
    
    return data as User;
  }

  // Races
  async getRaces(): Promise<Race[]> {
    const { data, error } = await supabase
      .from('races')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching races:', error);
      return [];
    }
    
    return data as Race[];
  }

  async getRaceById(id: number): Promise<Race | undefined> {
    const { data, error } = await supabase
      .from('races')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching race with ID ${id}:`, error);
      return undefined;
    }
    
    return data as Race;
  }

  async getRacesByDifficulty(difficulty: string): Promise<Race[]> {
    const { data, error } = await supabase
      .from('races')
      .select('*')
      .eq('difficulty', difficulty)
      .order('id');
    
    if (error) {
      console.error(`Error fetching races with difficulty ${difficulty}:`, error);
      return [];
    }
    
    return data as Race[];
  }

  async createRace(race: InsertRace): Promise<Race> {
    const { data, error } = await supabase
      .from('races')
      .insert(race)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating race:', error);
      throw new Error(`Failed to create race: ${error?.message}`);
    }
    
    return data as Race;
  }
  
  async updateRace(id: number, updateData: Partial<Race>): Promise<Race | undefined> {
    // First, check if the race exists
    const existingRace = await this.getRaceById(id);
    if (!existingRace) {
      console.error(`Race with ID ${id} not found for update`);
      return undefined;
    }
    
    // Proceed with the update
    const { data, error } = await supabase
      .from('races')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      console.error(`Error updating race with ID ${id}:`, error);
      throw new Error(`Failed to update race: ${error?.message}`);
    }
    
    return data as Race;
  }

  // Participants
  async getParticipants(): Promise<Participant[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
    
    return data as Participant[];
  }

  async getParticipantById(id: number): Promise<Participant | undefined> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching participant with ID ${id}:`, error);
      return undefined;
    }
    
    return data as Participant;
  }

  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('raceId', raceId)
      .order('lastName');
    
    if (error) {
      console.error(`Error fetching participants for race ${raceId}:`, error);
      return [];
    }
    
    return data as Participant[];
  }

  async getParticipantsByCountry(country: string): Promise<Participant[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('country', country)
      .order('lastName');
    
    if (error) {
      console.error(`Error fetching participants from country ${country}:`, error);
      return [];
    }
    
    return data as Participant[];
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    // Supabase doesn't support full text search in the same way as SQL
    // We'll do a simple ILIKE search on first name and last name
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .or(`firstName.ilike.%${query}%,lastName.ilike.%${query}%`)
      .order('lastName');
    
    if (error) {
      console.error(`Error searching participants with query ${query}:`, error);
      return [];
    }
    
    return data as Participant[];
  }

  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    // Get the race for bib number generation
    const { data: race, error: raceError } = await supabase
      .from('races')
      .select('*')
      .eq('id', participant.raceId)
      .single();
    
    if (raceError || !race) {
      console.error(`Error fetching race ${participant.raceId} for participant creation:`, raceError);
      throw new Error(`Race with ID ${participant.raceId} not found`);
    }
    
    // Generate bib number
    const raceCode = this.getRaceCodeForBib(race);
    
    // Count participants to generate a sequential bib number
    const { count, error: countError } = await supabase
      .from('participants')
      .select('*', { count: 'exact' })
      .eq('raceId', participant.raceId);
    
    if (countError) {
      console.error('Error counting participants for bib number generation:', countError);
      throw new Error('Failed to generate participant bib number');
    }
    
    const participantCount = count || 0;
    const bibNumber = `${raceCode}-${participantCount + 1}`;
    
    // Insert the participant with the generated bib number
    const now = new Date().toISOString();
    const participantWithBib = {
      ...participant,
      bibNumber,
      status: 'pending', 
      registrationDate: now
    };
    
    const { data, error } = await supabase
      .from('participants')
      .insert(participantWithBib)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating participant:', error);
      throw new Error(`Failed to create participant: ${error?.message}`);
    }
    
    return data as Participant;
  }

  async updateParticipantStatus(id: number, status: string): Promise<Participant | undefined> {
    const { data, error } = await supabase
      .from('participants')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      console.error(`Error updating status for participant ${id}:`, error);
      return undefined;
    }
    
    return data as Participant;
  }

  // Contact Inquiries
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const now = new Date().toISOString();
    const inquiryWithDate = {
      ...inquiry,
      createdAt: now
    };
    
    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert(inquiryWithDate)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating contact inquiry:', error);
      throw new Error(`Failed to create contact inquiry: ${error?.message}`);
    }
    
    return data as ContactInquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching contact inquiries:', error);
      return [];
    }
    
    return data as ContactInquiry[];
  }

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index');
    
    if (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
    
    return data.map(item => ({
      ...item,
      order: item.order_index
    })) as FAQ[];
  }

  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const faqData = {
      ...faq,
      order_index: faq.order
    };
    
    const { data, error } = await supabase
      .from('faqs')
      .insert(faqData)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating FAQ:', error);
      throw new Error(`Failed to create FAQ: ${error?.message}`);
    }
    
    return {
      ...data,
      order: data.order_index
    } as FAQ;
  }

  // Program Events
  async getProgramEvents(): Promise<ProgramEvent[]> {
    const { data, error } = await supabase
      .from('program_events')
      .select('*')
      .order('date')
      .order('order_index');
    
    if (error) {
      console.error('Error fetching program events:', error);
      return [];
    }
    
    return data.map(item => ({
      ...item,
      order: item.order_index
    })) as ProgramEvent[];
  }

  async getProgramEventsByDate(date: string): Promise<ProgramEvent[]> {
    const { data, error } = await supabase
      .from('program_events')
      .select('*')
      .eq('date', date)
      .order('startTime')
      .order('order_index');
    
    if (error) {
      console.error(`Error fetching program events for date ${date}:`, error);
      return [];
    }
    
    return data.map(item => ({
      ...item,
      order: item.order_index
    })) as ProgramEvent[];
  }

  async createProgramEvent(event: InsertProgramEvent): Promise<ProgramEvent> {
    const eventData = {
      ...event,
      order_index: event.order
    };
    
    const { data, error } = await supabase
      .from('program_events')
      .insert(eventData)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating program event:', error);
      throw new Error(`Failed to create program event: ${error?.message}`);
    }
    
    return {
      ...data,
      order: data.order_index
    } as ProgramEvent;
  }

  // Sponsors
  async getSponsors(): Promise<Sponsor[]> {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('level')
      .order('order_index');
    
    if (error) {
      console.error('Error fetching sponsors:', error);
      return [];
    }
    
    return data.map(item => ({
      ...item,
      order: item.order_index
    })) as Sponsor[];
  }

  async getSponsorsByLevel(level: string): Promise<Sponsor[]> {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('level', level)
      .order('order_index');
    
    if (error) {
      console.error(`Error fetching sponsors with level ${level}:`, error);
      return [];
    }
    
    return data.map(item => ({
      ...item,
      order: item.order_index
    })) as Sponsor[];
  }

  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const sponsorData = {
      ...sponsor,
      order_index: sponsor.order
    };
    
    const { data, error } = await supabase
      .from('sponsors')
      .insert(sponsorData)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating sponsor:', error);
      throw new Error(`Failed to create sponsor: ${error?.message}`);
    }
    
    return {
      ...data,
      order: data.order_index
    } as Sponsor;
  }
  
  // Helper methods
  private getRaceCodeForBib(race: any): string {
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

export const supabaseStorage = new SupabaseStorage();