import { 
  participants, races, users, 
  type Participant, type Race, type User,
  type InsertParticipant, type InsertRace, type InsertUser 
} from "@shared/schema";

// Storage interface for all our data types
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Participant methods
  getParticipants(): Promise<Participant[]>;
  getParticipantById(id: number): Promise<Participant | undefined>;
  getParticipantsByRaceCategory(category: string): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  searchParticipants(query: string): Promise<Participant[]>;

  // Race methods
  getRaces(): Promise<Race[]>;
  getRaceById(id: number): Promise<Race | undefined>;
  getRacesByCategory(category: string): Promise<Race[]>;
  createRace(race: InsertRace): Promise<Race>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private participantsData: Map<number, Participant>;
  private racesData: Map<number, Race>;
  private currentUserId: number;
  private currentParticipantId: number;
  private currentRaceId: number;
  private currentBibNumber: number;

  constructor() {
    this.usersData = new Map();
    this.participantsData = new Map();
    this.racesData = new Map();
    this.currentUserId = 1;
    this.currentParticipantId = 1;
    this.currentRaceId = 1;
    this.currentBibNumber = 1001;

    // Initialize with some sample races
    this.initializeRaces();
  }

  // Initialize with default races
  private initializeRaces(): void {
    const sampleRaces: InsertRace[] = [
      {
        name: 'Mountain Ultra 80K',
        category: 'ultra',
        elevation: 3500,
        difficulty: 'expert',
        date: 'July 17',
        description: 'The ultimate challenge for experienced trail runners.',
        startTime: '07:30',
        cutoffTime: '24:00',
        aidStations: 8
      },
      {
        name: 'Marathon Challenge',
        category: 'marathon',
        elevation: 1200,
        difficulty: 'intermediate',
        date: 'July 16',
        description: 'A beautiful but challenging marathon course through mountain trails.',
        startTime: '07:30',
        cutoffTime: '10:00',
        aidStations: 5
      },
      {
        name: 'Forest Half Marathon',
        category: 'half',
        elevation: 850,
        difficulty: 'intermediate',
        date: 'July 16',
        description: 'Run through scenic forest paths with moderate elevation.',
        startTime: '09:00',
        cutoffTime: '5:00',
        aidStations: 3
      },
      {
        name: 'Twilight 25K',
        category: '25k',
        elevation: 600,
        difficulty: 'intermediate',
        date: 'July 15',
        description: 'An evening race with beautiful sunset views.',
        startTime: '16:00',
        cutoffTime: '4:00',
        aidStations: 2
      },
      {
        name: 'Sunrise 10K',
        category: '10k',
        elevation: 350,
        difficulty: 'beginner',
        date: 'July 15',
        description: 'Perfect for beginners, enjoy the sunrise during this morning run.',
        startTime: '07:00',
        cutoffTime: '2:00',
        aidStations: 1
      }
    ];

    sampleRaces.forEach(race => {
      this.createRace(race);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.usersData.set(id, user);
    return user;
  }

  // Participant methods
  async getParticipants(): Promise<Participant[]> {
    return Array.from(this.participantsData.values());
  }

  async getParticipantById(id: number): Promise<Participant | undefined> {
    return this.participantsData.get(id);
  }

  async getParticipantsByRaceCategory(category: string): Promise<Participant[]> {
    return Array.from(this.participantsData.values()).filter(
      (participant) => participant.raceCategory === category
    );
  }

  async createParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const id = this.currentParticipantId++;
    const bibNumber = this.currentBibNumber++;
    const registrationDate = new Date();
    
    const participant: Participant = { 
      ...insertParticipant, 
      id,
      bibNumber,
      registrationDate
    };
    
    this.participantsData.set(id, participant);
    return participant;
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.participantsData.values()).filter(
      (participant) => 
        participant.firstName.toLowerCase().includes(lowerQuery) ||
        participant.lastName.toLowerCase().includes(lowerQuery)
    );
  }

  // Race methods
  async getRaces(): Promise<Race[]> {
    return Array.from(this.racesData.values());
  }

  async getRaceById(id: number): Promise<Race | undefined> {
    return this.racesData.get(id);
  }

  async getRacesByCategory(category: string): Promise<Race[]> {
    if (category === 'all') {
      return this.getRaces();
    }
    
    return Array.from(this.racesData.values()).filter(
      (race) => race.category === category
    );
  }

  async createRace(insertRace: InsertRace): Promise<Race> {
    const id = this.currentRaceId++;
    const race: Race = { ...insertRace, id };
    this.racesData.set(id, race);
    return race;
  }
}

// Create and export a single instance
export const storage = new MemStorage();
