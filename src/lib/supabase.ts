
import { createClient } from '@supabase/supabase-js';

// These values will be replaced when you connect your Lovable project to Supabase
// via the Supabase integration button
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase;

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please connect your Lovable project to Supabase using the integration button.');
  
  // Create a mock Supabase client that won't throw runtime errors
  // This allows the app to load even without Supabase connection
  supabase = {
    from: () => ({
      select: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      update: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      eq: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      single: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      order: () => ({ data: null, error: { message: 'Supabase not connected' } }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not connected' } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not connected' } }),
      signOut: () => Promise.resolve(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not connected' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    }
  };
} else {
  // Create the actual Supabase client if credentials are available
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
