import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL") {
  console.warn("Supabase URL is not defined. Please set VITE_SUPABASE_URL environment variable or update supabaseClient.ts");
}

if (!supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
  console.warn("Supabase anon key is not defined. Please set VITE_SUPABASE_ANON_KEY environment variable or update supabaseClient.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 