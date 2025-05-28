import { supabase } from '../utils/supabaseClient';
import type { JournalEntry } from '../types/supabase';

// --- JournalEntry Functions ---

export const getJournalEntriesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as JournalEntry[];
};

export const getJournalEntryById = async (entryId: string) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', entryId)
    .single();
  if (error) throw error;
  return data as JournalEntry | null;
};

export const createJournalEntry = async (entryData: Partial<JournalEntry>) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entryData])
    .select()
    .single();
  if (error) throw error;
  return data as JournalEntry | null;
};

export const updateJournalEntry = async (entryId: string, updates: Partial<JournalEntry>) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', entryId)
    .select()
    .single();
  if (error) throw error;
  return data as JournalEntry | null;
};

export const deleteJournalEntry = async (entryId: string) => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId);
  if (error) throw error;
  return true;
}; 