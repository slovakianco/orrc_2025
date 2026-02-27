import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Gracefully initialize Supabase - don't crash if env vars are missing
let supabase: SupabaseClient | null = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );
    console.log('Supabase client initialized successfully');
  } catch (err) {
    console.error('Error initializing Supabase client:', err);
    supabase = null;
  }
} else {
  const missing = [];
  if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!process.env.SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');
  console.warn(`Supabase not configured: missing ${missing.join(', ')}. Using in-memory storage.`);
}

// Test the connection if client exists
if (supabase) {
  (async () => {
    try {
      const { count, error } = await supabase!.from('races').select('count', { count: 'exact' });
      if (error) {
        console.error('Failed to connect to Supabase:', error.message);
      } else {
        console.log(`Successfully connected to Supabase. Found ${count} races.`);
      }
    } catch (err) {
      console.error('Error connecting to Supabase:', err);
    }
  })();
}

export { supabase };
