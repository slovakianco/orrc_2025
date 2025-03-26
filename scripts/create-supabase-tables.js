// Script to create Supabase tables using direct PostgreSQL connection

import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL schema file
const sqlSchemaPath = path.join(process.cwd(), 'supabase-schema.sql');
const sqlSchema = fs.readFileSync(sqlSchemaPath, 'utf8');

// Split schema into individual statements
const statements = sqlSchema
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

async function executeRawSql() {
  try {
    console.log('Fetching connection information from Supabase...');
    
    // Get connection string from DATABASE_URL environment variable
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      // If DATABASE_URL is not available, try individual parameters
      if (!process.env.PGHOST || !process.env.PGDATABASE || !process.env.PGUSER || !process.env.PGPASSWORD) {
        console.error('Error: Database connection information is missing. Make sure DATABASE_URL or individual PG* variables are set.');
        process.exit(1);
      }
    }

    // Create a PostgreSQL client
    const client = connectionString 
      ? new pg.Client({ connectionString }) 
      : new pg.Client({
          host: process.env.PGHOST,
          database: process.env.PGDATABASE,
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
          port: process.env.PGPORT || 5432,
          ssl: { rejectUnauthorized: false }
        });

    // Connect to the database
    console.log('Connecting to PostgreSQL database...');
    await client.connect();

    // Execute each SQL statement
    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 60)}...`);
        await client.query(statement);
        console.log('Statement executed successfully');
      } catch (error) {
        // If the error is about the table already existing, continue
        if (error.message.includes('already exists')) {
          console.log('Table already exists, continuing...');
        } else {
          console.error('Error executing statement:', error.message);
        }
      }
    }

    // Close the connection
    await client.end();
    console.log('Tables created successfully!');
    
    // Test with Supabase API to confirm tables exist
    await testSupabaseTables();
  } catch (error) {
    console.error('Failed to execute SQL:', error);
  }
}

async function testSupabaseTables() {
  console.log('\nTesting tables with Supabase API:');
  
  // Test races table
  const { data: races, error: racesError } = await supabase
    .from('races')
    .select('*')
    .limit(5);
  
  if (racesError) {
    console.error('Error accessing races table:', racesError.message);
  } else {
    console.log(`Successfully accessed races table. Found ${races.length} races.`);
  }
  
  // Test participants table
  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('*')
    .limit(5);
  
  if (participantsError) {
    console.error('Error accessing participants table:', participantsError.message);
  } else {
    console.log(`Successfully accessed participants table. Found ${participants.length} participants.`);
  }
}

// Run the function
executeRawSql().catch(console.error);