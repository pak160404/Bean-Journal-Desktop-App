import type { SupabaseClient } from '@supabase/supabase-js';
import type { MoodLog } from '../types/supabase';

// --- MoodLog Functions ---

export const getMoodLogsByUserId = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as MoodLog[];
};

export const getMoodLogByUserIdAndDate = async (supabase: SupabaseClient, userId: string, logDate: string) => {
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', logDate)
    .maybeSingle(); // Use maybeSingle as there is a UNIQUE constraint on (user_id, log_date)
  if (error) throw error;
  return data as MoodLog | null;
};

export const createMoodLog = async (supabase: SupabaseClient, moodLogData: Partial<MoodLog>) => {
  const { data, error } = await supabase
    .from('mood_logs')
    .insert([moodLogData])
    .select()
    .single();
  if (error) throw error;
  return data as MoodLog | null;
};

export const updateMoodLog = async (supabase: SupabaseClient, moodLogId: string, updates: Partial<MoodLog>) => {
  const { data, error } = await supabase
    .from('mood_logs')
    .update(updates)
    .eq('id', moodLogId)
    .select()
    .single();
  if (error) throw error;
  return data as MoodLog | null;
};

export const deleteMoodLog = async (supabase: SupabaseClient, moodLogId: string) => {
  const { error } = await supabase
    .from('mood_logs')
    .delete()
    .eq('id', moodLogId);
  if (error) throw error;
  return true;
}; 