import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

async function createSupabaseTables() {
  try {
    console.log('Creating Supabase tables...');

    // Read the SQL script
    const sqlScript = fs.readFileSync(
      path.join(process.cwd(), 'supabase-schema.sql'),
      'utf8'
    );

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql_string: sqlScript
    });

    if (error) {
      console.error('Error creating Supabase tables:', error);
    } else {
      console.log('Supabase tables created successfully');
    }
  } catch (error) {
    console.error('Error in creating Supabase tables:', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createSupabaseTables().then(() => {
    console.log('Finished creating Supabase tables script');
    process.exit(0);
  }).catch(error => {
    console.error('Failed to create Supabase tables:', error);
    process.exit(1);
  });
}

export { createSupabaseTables };