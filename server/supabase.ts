import { createClient } from '@supabase/supabase-js';

// Check if the required environment variables are present
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY environment variable is required');
}

// Initialize the Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Don't store user session in localStorage
    },
  }
);

// Test the connection
supabase.from('races').select('count', { count: 'exact' })
  .then(({ count, error }) => {
    if (error) {
      console.error('Failed to connect to Supabase:', error.message);
    } else {
      console.log(`Successfully connected to Supabase. Found ${count} races.`);
    }
  })
  .catch((err: Error) => {
    console.error('Error connecting to Supabase:', err);
  });