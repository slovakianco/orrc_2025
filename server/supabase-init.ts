import { supabase } from './supabase';

// This script will create all the necessary tables in Supabase
async function initializeSupabaseTables() {
  console.log('Initializing Supabase tables...');

  // Create users table
  const { error: usersError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'users',
    columns: `
      id serial primary key,
      username text not null unique,
      password_hash text not null,
      email text,
      is_admin boolean default false
    `
  });

  if (usersError) {
    console.error('Error creating users table:', usersError);
  } else {
    console.log('Users table created successfully');
  }

  // Create races table
  const { error: racesError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'races',
    columns: `
      id serial primary key,
      name text not null,
      name_ro text not null,
      name_fr text not null,
      name_de text not null,
      description text not null,
      description_ro text not null,
      description_fr text not null,
      description_de text not null,
      distance numeric not null,
      elevation numeric not null,
      difficulty text not null,
      date text not null,
      price numeric not null,
      image_url text,
      race_map text
    `
  });

  if (racesError) {
    console.error('Error creating races table:', racesError);
  } else {
    console.log('Races table created successfully');
  }

  // Create participants table
  const { error: participantsError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'participants',
    columns: `
      id serial primary key,
      first_name text not null,
      last_name text not null,
      email text not null,
      phone_number text not null,
      country text not null,
      birth_date text not null,
      race_id integer not null references races(id),
      bib_number text,
      status text not null default 'pending',
      medical_info text,
      registration_date timestamp with time zone default now(),
      gender text not null,
      age integer not null
    `
  });

  if (participantsError) {
    console.error('Error creating participants table:', participantsError);
  } else {
    console.log('Participants table created successfully');
  }

  // Create contact_inquiries table
  const { error: contactInquiriesError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'contact_inquiries',
    columns: `
      id serial primary key,
      name text not null,
      email text not null,
      subject text not null,
      message text not null,
      created_at timestamp with time zone default now()
    `
  });

  if (contactInquiriesError) {
    console.error('Error creating contact_inquiries table:', contactInquiriesError);
  } else {
    console.log('Contact inquiries table created successfully');
  }

  // Create faqs table
  const { error: faqsError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'faqs',
    columns: `
      id serial primary key,
      question text not null,
      question_ro text not null,
      question_fr text not null,
      question_de text not null,
      answer text not null,
      answer_ro text not null,
      answer_fr text not null,
      answer_de text not null,
      order_index integer not null
    `
  });

  if (faqsError) {
    console.error('Error creating faqs table:', faqsError);
  } else {
    console.log('FAQs table created successfully');
  }

  // Create program_events table
  const { error: programEventsError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'program_events',
    columns: `
      id serial primary key,
      date text not null,
      start_time text not null,
      end_time text,
      title text not null,
      title_ro text not null,
      title_fr text not null,
      title_de text not null,
      description text not null,
      description_ro text not null,
      description_fr text not null,
      description_de text not null,
      location text not null,
      order_index integer not null
    `
  });

  if (programEventsError) {
    console.error('Error creating program_events table:', programEventsError);
  } else {
    console.log('Program events table created successfully');
  }

  // Create sponsors table
  const { error: sponsorsError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'sponsors',
    columns: `
      id serial primary key,
      name text not null,
      description text not null,
      description_ro text not null,
      description_fr text not null,
      description_de text not null,
      logo_placeholder text not null,
      website text not null,
      level text not null,
      order_index integer not null
    `
  });

  if (sponsorsError) {
    console.error('Error creating sponsors table:', sponsorsError);
  } else {
    console.log('Sponsors table created successfully');
  }

  console.log('Supabase tables initialization completed');
}

// Export the function for use in other files
export { initializeSupabaseTables };

// Run the function if this file is executed directly
if (require.main === module) {
  initializeSupabaseTables().catch(error => {
    console.error('Error initializing Supabase tables:', error);
    process.exit(1);
  });
}