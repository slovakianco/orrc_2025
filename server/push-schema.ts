import { db } from './db';
import * as schema from '../shared/schema';

async function main() {
  try {
    console.log("Creating database schema...");

    // Create participants table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS participants (
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
      )
    `);

    console.log("Schema creation complete!");
  } catch (error) {
    console.error("Error creating schema:", error);
    process.exit(1);
  }
}

main();