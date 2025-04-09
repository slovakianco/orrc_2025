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
    
    return this.mapParticipantData(data);
  }

  async getParticipantsByRace(raceId: number): Promise<Participant[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('raceid', raceId) // Using lowercase column name to match database
      .order('lastname'); // Using lowercase column name
    
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
      .order('lastname'); // Using lowercase column name
    
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
      .or(`firstname.ilike.%${query}%,lastname.ilike.%${query}%`) // Using lowercase column names
      .order('lastname'); // Using lowercase column name
    
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
    console.log("Using raceid with value:", participant.raceId);
    const { count, error: countError } = await supabase
      .from('participants')
      .select('*', { count: 'exact' })
      .eq('raceid', participant.raceId); // Use lowercase column name exactly as in database
    
    if (countError) {
      console.error('Error counting participants for bib number generation:', countError);
      throw new Error('Failed to generate participant bib number');
    }
    
    const participantCount = count || 0;
    const bibNumber = `${raceCode}-${participantCount + 1}`;
    
    // Insert the participant with the generated bib number
    const now = new Date().toISOString();
    
    // Create an object with lowercase field names for Supabase 
    // Map InsertParticipant fields to the actual column names in the database
    const supabaseParticipant = {
      firstname: participant.firstName,
      lastname: participant.lastName,
      email: participant.email,
      phonenumber: participant.phoneNumber,
      country: participant.country,
      birthdate: participant.birthDate,
      raceid: participant.raceId,
      gender: participant.gender,
      age: participant.age,
      medicalinfo: participant.medicalInfo,
      isemaparticipant: Boolean(participant.isEmaParticipant),
      tshirtsize: participant.tshirtSize || "",
      emergencycontactname: participant.emergencyContactName || "",
      emergencycontactphone: participant.emergencyContactPhone || "",
      
      // Add generated fields
      bibnumber: bibNumber,
      status: 'pending', 
      registrationdate: now
    };
    
    console.log("Supabase participant data:", supabaseParticipant);
    
    const { data, error } = await supabase
      .from('participants')
      .insert(supabaseParticipant)
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
    // Map to lowercase field names for the database
    const inquiryWithDate = {
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
      message: inquiry.message,
      createdat: now // Using lowercase column name
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
      .order('createdat', { ascending: false }); // Using lowercase column name
    
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
      .order('starttime') // Using lowercase column name
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
    // Map to lowercase field names for database
    const eventData = {
      date: event.date,
      starttime: event.startTime, // lowercase column name
      endtime: event.endTime, // lowercase column name
      title: event.title,
      titlero: event.titleRo, // lowercase column name
      titlefr: event.titleFr, // lowercase column name
      titlede: event.titleDe, // lowercase column name
      titleit: event.titleIt, // lowercase column name
      titlees: event.titleEs, // lowercase column name
      description: event.description,
      descriptionro: event.descriptionRo, // lowercase column name
      descriptionfr: event.descriptionFr, // lowercase column name
      descriptionde: event.descriptionDe, // lowercase column name
      descriptionit: event.descriptionIt, // lowercase column name
      descriptiones: event.descriptionEs, // lowercase column name
      location: event.location,
      order_index: event.order // match database column name
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
    // Map to lowercase field names for database
    const sponsorData = {
      name: sponsor.name,
      description: sponsor.description,
      descriptionro: sponsor.descriptionRo, // lowercase column name
      descriptionfr: sponsor.descriptionFr, // lowercase column name
      descriptionde: sponsor.descriptionDe, // lowercase column name
      logoplaceholder: sponsor.logoPlaceholder, // lowercase column name
      website: sponsor.website,
      level: sponsor.level,
      order_index: sponsor.order // match database column name
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
  
  // Payment link management
  async saveParticipantPaymentLink(
    id: number, 
    paymentLink: string,
    expiresAt?: Date,
    paymentToken?: string
  ): Promise<Participant | undefined> {
    // Retrieve the current participant
    const participant = await this.getParticipantById(id);
    if (!participant) {
      console.error(`Participant with ID ${id} not found`);
      return undefined;
    }
    
    // Prepare update data
    const updateData = {
      payment_link: paymentLink,
      payment_link_created_at: new Date().toISOString(),
      payment_link_expires_at: expiresAt ? expiresAt.toISOString() : null,
      payment_token: paymentToken || null
    };
    
    // Update in Supabase
    const { data, error } = await supabase
      .from('participants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      console.error(`Error saving payment link for participant ${id}:`, error);
      throw new Error(`Failed to save payment link: ${error?.message}`);
    }
    
    // If we have a token, also record it in the payment_tokens table
    if (paymentToken && expiresAt) {
      try {
        const { error: tokenError } = await supabase
          .from('payment_tokens')
          .insert({
            token: paymentToken,
            participant_id: id,
            created_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
            used: false
          });
          
        if (tokenError) {
          console.error(`Error saving payment token record for participant ${id}:`, tokenError);
          // Not throwing here as the main update succeeded
        }
      } catch (tokenErr: any) {
        console.error(`Error creating payment token record for participant ${id}:`, tokenErr);
        // Not throwing here as the main update succeeded
      }
    }
    
    // Map Supabase data to our Participant type
    return this.mapParticipantData(data);
  }
  
  async getParticipantPaymentLink(
    id: number
  ): Promise<{ paymentLink: string; createdAt: Date; expiresAt?: Date; paymentToken?: string } | undefined> {
    const { data, error } = await supabase
      .from('participants')
      .select('payment_link, payment_link_created_at, payment_link_expires_at, payment_token')
      .eq('id', id)
      .single();
    
    if (error || !data || !data.payment_link) {
      // Not treating this as an error as no payment link is a valid state
      console.log(`No payment link found for participant ${id}`);
      return undefined;
    }
    
    return {
      paymentLink: data.payment_link,
      createdAt: new Date(data.payment_link_created_at),
      expiresAt: data.payment_link_expires_at ? new Date(data.payment_link_expires_at) : undefined,
      paymentToken: data.payment_token || undefined
    };
  }
  
  async getParticipantByToken(token: string): Promise<Participant | undefined> {
    // First check the payment_tokens table
    const { data: tokenData, error: tokenError } = await supabase
      .from('payment_tokens')
      .select('participant_id, used, expires_at')
      .eq('token', token)
      .single();
      
    if (tokenError || !tokenData) {
      console.log(`No token record found for token: ${token}`);
      
      // Fallback to checking participants table directly
      const { data: participantData, error: participantError } = await supabase
        .from('participants')
        .select('*')
        .eq('payment_token', token)
        .single();
        
      if (participantError || !participantData) {
        console.log(`No participant found with token: ${token}`);
        return undefined;
      }
      
      return this.mapParticipantData(participantData);
    }
    
    // Check if token is expired
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      console.log(`Token expired: ${token}, expired at ${tokenData.expires_at}`);
      return undefined;
    }
    
    // Check if token has been used already
    if (tokenData.used) {
      console.log(`Token already used: ${token}`);
      return undefined;
    }
    
    // Get the participant
    const { data: participantData, error: participantError } = await supabase
      .from('participants')
      .select('*')
      .eq('id', tokenData.participant_id)
      .single();
      
    if (participantError || !participantData) {
      console.log(`No participant found with ID: ${tokenData.participant_id} for token: ${token}`);
      return undefined;
    }
    
    return this.mapParticipantData(participantData);
  }
  
  async markTokenAsUsed(token: string): Promise<boolean> {
    try {
      // Mark the token as used in the payment_tokens table
      const { error: tokenError } = await supabase
        .from('payment_tokens')
        .update({ used: true })
        .eq('token', token);
        
      if (tokenError) {
        console.error(`Error marking token as used: ${token}`, tokenError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error marking token as used: ${token}`, error);
      return false;
    }
  }
  
  // Helper methods
  private mapParticipantData(data: any): Participant {
    // Map Supabase data to our Participant type
    // Need to handle potential case differences between database columns
    // and our expected schema
    return {
      ...data,
      id: data.id,
      firstName: data.firstname || data.firstName,
      lastName: data.lastname || data.lastName,
      email: data.email,
      phoneNumber: data.phonenumber || data.phoneNumber,
      country: data.country,
      birthDate: data.birthdate || data.birthDate,
      raceId: data.raceid || data.raceId,
      bibNumber: data.bibnumber || data.bibNumber,
      status: data.status,
      medicalInfo: data.medicalinfo || data.medicalInfo,
      registrationDate: data.registrationdate || data.registrationDate,
      gender: data.gender,
      age: data.age,
      emergencyContactName: data.emergencycontactname || data.emergencyContactName,
      emergencyContactPhone: data.emergencycontactphone || data.emergencyContactPhone,
      isEmaParticipant: data.isemaparticipant || data.isEmaParticipant,
      tshirtSize: data.tshirtsize || data.tshirtSize,
      payment_link: data.payment_link,
      payment_link_created_at: data.payment_link_created_at,
      payment_link_expires_at: data.payment_link_expires_at
    };
  }
  
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