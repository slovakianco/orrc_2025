import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    // Read the SQL script
    const sqlScript = readFileSync(
      join(dirname(__dirname), 'supabase-schema.sql'),
      'utf8'
    );

    // Execute the SQL script statement by statement
    // This is important because some clients can't handle multiple statements in one query
    const statements = sqlScript
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    for (const statement of statements) {
      try {
        await client.query(statement + ';');
        console.log('Executed statement successfully');
      } catch (error) {
        console.error('Error executing statement:', error);
        console.error('Statement:', statement);
      }
    }
    
    console.log('Tables should be created successfully');

    // Check if races table was created
    try {
      const { rows } = await client.query('SELECT * FROM races');
      console.log(`Found ${rows.length} races`);
    } catch (error) {
      console.error('Error checking races table:', error);
    }
    
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await client.end();
    console.log('Client connection closed');
  }
}

createTables().catch(console.error);