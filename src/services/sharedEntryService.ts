import { supabase } from '../utils/supabaseClient';
import type { SharedEntry, JournalEntry, Profile } from '../types/supabase';

// --- SharedEntry Functions ---

export const getSharedEntriesForUser = async (userId: string) => { // Entries shared *with* this user
  const { data, error } = await supabase
    .from('shared_entries')
    .select('*, journal_entries(*, profiles!sharer_user_id(*))') // Join entry and sharer profile
    .eq('shared_with_user_id', userId);
  if (error) throw error;
  // Adjust type according to actual join structure
  return data as (SharedEntry & { journal_entries: JournalEntry & { profiles: Profile } })[];
};

export const getSharesBySharer = async (sharerUserId: string) => { // Entries shared *by* this user
  const { data, error } = await supabase
    .from('shared_entries')
    .select('*, journal_entries(*), profiles!shared_with_user_id(*)') // Join entry and recipient profile
    .eq('sharer_user_id', sharerUserId);
  if (error) throw error;
  // Adjust type
  return data as (SharedEntry & { journal_entries: JournalEntry, profiles: Profile })[];
};


export const createSharedEntry = async (shareData: Partial<SharedEntry>) => {
  const { data, error } = await supabase
    .from('shared_entries')
    .insert([shareData])
    .select()
    .single();
  if (error) throw error;
  return data as SharedEntry | null;
};

export const deleteSharedEntry = async (shareId: string) => {
  const { error } = await supabase
    .from('shared_entries')
    .delete()
    .eq('id', shareId);
  if (error) throw error;
  return true;
}; 