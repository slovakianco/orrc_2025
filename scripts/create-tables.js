const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function createTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    // Read the SQL script
    const sqlScript = fs.readFileSync(
      path.join(process.cwd(), 'supabase-schema.sql'),
      'utf8'
    );

    // Execute the SQL
    await client.query(sqlScript);
    console.log('Tables created successfully');

    // Check if races table was created
    const { rows } = await client.query('SELECT * FROM races');
    console.log(`Found ${rows.length} races`);
    
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await client.end();
    console.log('Client connection closed');
  }
}

createTables().catch(console.error);