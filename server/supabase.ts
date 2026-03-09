import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

function isValidSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.includes('supabase');
  } catch {
    return false;
  }
}

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  if (isValidSupabaseUrl(process.env.SUPABASE_URL)) {
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
      console.error('Failed to create Supabase client:', err);
      supabase = null;
    }
  } else {
    console.error('Invalid SUPABASE_URL format. Expected a valid Supabase URL (https://xxx.supabase.co)');
  }
} else {
  console.warn('Supabase environment variables not configured. Running without Supabase.');
}

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
