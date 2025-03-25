import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";

const { Pool } = pg;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance
const db = drizzle(pool, { schema });

async function main() {
  console.log("Connecting to database...");
  
  try {
    // First clear all data in existing tables to prevent conflicts
    console.log("Clearing existing data...");
    
    try {
      await db.delete(schema.participants);
      console.log("- Cleared participants table");
    } catch (e) {
      console.log("- No participants table exists yet");
    }
    
    try {
      await db.delete(schema.races);
      console.log("- Cleared races table");
    } catch (e) {
      console.log("- No races table exists yet");
    }
    
    try {
      await db.delete(schema.contactInquiries);
      console.log("- Cleared contact inquiries table");
    } catch (e) {
      console.log("- No contact inquiries table exists yet");
    }
    
    try {
      await db.delete(schema.faqs);
      console.log("- Cleared FAQs table");
    } catch (e) {
      console.log("- No FAQs table exists yet");
    }
    
    try {
      await db.delete(schema.programEvents);
      console.log("- Cleared program events table");
    } catch (e) {
      console.log("- No program events table exists yet");
    }
    
    try {
      await db.delete(schema.sponsors);
      console.log("- Cleared sponsors table");
    } catch (e) {
      console.log("- No sponsors table exists yet");
    }
    
    console.log("Applying schema...");
    
    // Drop and recreate tables with proper fields for races
    try {
      await pool.query(`
        DROP TABLE IF EXISTS races CASCADE;
        
        CREATE TABLE races (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          namero TEXT NOT NULL,
          namefr TEXT NOT NULL,
          namede TEXT NOT NULL,
          description TEXT NOT NULL,
          descriptionro TEXT NOT NULL,
          descriptionfr TEXT NOT NULL,
          descriptionde TEXT NOT NULL,
          distance INTEGER NOT NULL,
          elevation INTEGER NOT NULL,
          difficulty difficulty NOT NULL,
          date TEXT NOT NULL,
          price INTEGER NOT NULL,
          imageurl TEXT,
          racemap TEXT
        );
      `);
      console.log("- Recreated races table with racemap field");
    } catch (e) {
      console.error("Error recreating races table:", e);
    }
    
    // Drop and recreate participants table
    try {
      await pool.query(`
        DROP TABLE IF EXISTS participants CASCADE;
        
        CREATE TABLE participants (
          id SERIAL PRIMARY KEY,
          firstname TEXT NOT NULL,
          lastname TEXT NOT NULL,
          email TEXT NOT NULL,
          phonenumber TEXT NOT NULL,
          country TEXT NOT NULL,
          birthdate TEXT NOT NULL,
          raceid INTEGER NOT NULL,
          bibnumber TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          medicalinfo TEXT,
          registrationdate TIMESTAMP DEFAULT NOW(),
          gender TEXT NOT NULL,
          age INTEGER NOT NULL
        );
      `);
      console.log("- Recreated participants table");
    } catch (e) {
      console.error("Error recreating participants table:", e);
    }
    
    console.log("Schema update complete");
  } catch (error) {
    console.error("Database error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});