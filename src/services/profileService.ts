import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile } from '../types/supabase';

// --- Profile Functions ---

export const getProfileByUserId = async (supabase: SupabaseClient, userId: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
    .throwOnError();
  return data as Profile | null;
};

export const createProfile = async (supabase: SupabaseClient, profileData: Partial<Profile>) => {
  const { data } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single()
    .throwOnError();
  return data as Profile | null;
};

export const updateProfile = async (supabase: SupabaseClient, userId: string, updates: Partial<Profile>) => {
  const { data } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
    .throwOnError();
  return data as Profile | null;
}; 