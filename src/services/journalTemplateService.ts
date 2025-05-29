import type { SupabaseClient } from '@supabase/supabase-js';
import type { JournalTemplate } from '../types/supabase';

// --- JournalTemplate Functions ---

export const getPredefinedJournalTemplates = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from('journal_templates')
    .select('*')
    .eq('is_predefined', true);
  if (error) throw error;
  return data as JournalTemplate[];
};

export const getUserCreatedJournalTemplates = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('journal_templates')
    .select('*')
    .eq('user_id', userId)
    .eq('is_predefined', false);
  if (error) throw error;
  return data as JournalTemplate[];
};

export const createJournalTemplate = async (supabase: SupabaseClient, templateData: Partial<JournalTemplate>) => {
  const { data, error } = await supabase
    .from('journal_templates')
    .insert([{ ...templateData, is_predefined: false }])
    .select()
    .single();
  if (error) throw error;
  return data as JournalTemplate | null;
};

export const updateJournalTemplate = async (supabase: SupabaseClient, templateId: string, updates: Partial<JournalTemplate>) => {
  const { data, error } = await supabase
    .from('journal_templates')
    .update(updates)
    .eq('id', templateId)
    .eq('is_predefined', false)
    .select()
    .single();
  if (error) throw error;
  return data as JournalTemplate | null;
};

export const deleteJournalTemplate = async (supabase: SupabaseClient, templateId: string) => {
  const { error } = await supabase
    .from('journal_templates')
    .delete()
    .eq('id', templateId)
    .eq('is_predefined', false);
  if (error) throw error;
  return true;
}; 