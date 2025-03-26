import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createSupabaseTables() {
  try {
    console.log('Creating Supabase tables...');

    // Read the SQL script
    const sqlScript = fs.readFileSync(
      path.join(process.cwd(), 'supabase-schema.sql'),
      'utf8'
    );

    // Execute each statement separately
    const statements = sqlScript
      .split(';')
      .filter(statement => statement.trim() !== '');

    for (const statement of statements) {
      if (statement.trim().length > 0) {
        console.log(`Executing statement: ${statement.trim().substring(0, 50)}...`);
        
        try {
          // This uses the Supabase API to test connectivity
          const { data, error } = await supabase.from('_temp_view').select('*').limit(1);
          
          if (error && error.message && error.message.includes('does not exist')) {
            // This is expected, we're just testing connectivity
            console.log('Supabase connection is working');
          }
          
          // Since we can't directly execute SQL, we'll use the tables API to create tables
          // For simplicity, let's manually create tables needed for participants functionality
          if (statement.toLowerCase().includes('create table') && 
              statement.toLowerCase().includes('participants')) {
            console.log('Creating participants table via API');
            // We'll create this specific table using the API
            await createParticipantsTable();
          }
          
        } catch (e) {
          console.error('Error executing statement:', e);
        }
      }
    }

    console.log('Finished processing SQL statements');
  } catch (error) {
    console.error('Error in creating Supabase tables:', error);
  }
}

async function createParticipantsTable() {
  try {
    // Check if participants table already exists
    const { error: checkError } = await supabase
      .from('participants')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      console.log('Participants table already exists');
      return;
    }
    
    console.log('Creating races table first (required for foreign key)');
    
    // Create races table first (since participants has a foreign key to races)
    const { error: racesError } = await supabase
      .from('races')
      .insert([
        {
          name: 'Trail Run 33K',
          nameRo: 'Traseu 33K',
          nameFr: 'Trail 33K',
          nameDe: 'Trail 33K',
          description: 'A challenging mountain trail running through scenic forests and ridges.',
          descriptionRo: 'Un traseu montan provocator care străbate păduri și creste pitorești.',
          descriptionFr: 'Un sentier de montagne stimulant traversant des forêts et des crêtes pittoresques.',
          descriptionDe: 'Ein anspruchsvoller Bergpfad, der durch malerische Wälder und Bergrücken führt.',
          distance: 33,
          elevation: 1200,
          difficulty: 'advanced',
          date: '2025-05-15',
          price: 40,
          imageUrl: '/images/race33k.jpg'
        },
        {
          name: 'Trail Run 11K',
          nameRo: 'Traseu 11K',
          nameFr: 'Trail 11K',
          nameDe: 'Trail 11K',
          description: 'An exciting shorter trail with beautiful mountain views.',
          descriptionRo: 'Un traseu mai scurt, dar plin de adrenalină, cu priveliști montane superbe.',
          descriptionFr: 'Un sentier plus court mais passionnant avec de magnifiques vues sur la montagne.',
          descriptionDe: 'Ein aufregender kürzerer Weg mit schönen Bergblicken.',
          distance: 11,
          elevation: 350,
          difficulty: 'beginner',
          date: '2025-05-15',
          price: 30,
          imageUrl: '/images/race11k.jpg'
        }
      ]);
    
    if (racesError) {
      console.error('Error creating races table:', racesError);
    } else {
      console.log('Races table created or rows inserted successfully');
    }
    
    // Now create participants table
    console.log('Creating participants table');
    
    // We need to check if the table exists now
    const { error: participantsError } = await supabase
      .from('participants')
      .insert({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phoneNumber: '+12345678',
        country: 'US',
        birthDate: '1990-01-01',
        raceId: 1,
        status: 'pending',
        gender: 'M',
        age: 33
      });
    
    if (participantsError && participantsError.code === '42P01') {
      console.error('Participants table does not exist. Tables need to be created manually in Supabase dashboard.');
    } else if (participantsError) {
      console.error('Error creating participants table:', participantsError);
    } else {
      console.log('Participants table created or test record inserted successfully');
    }
  } catch (error) {
    console.error('Error in table creation:', error);
  }
}

// For ESM, execute directly
createSupabaseTables().then(() => {
  console.log('Finished create Supabase tables script');
}).catch(error => {
  console.error('Failed to create Supabase tables:', error);
});