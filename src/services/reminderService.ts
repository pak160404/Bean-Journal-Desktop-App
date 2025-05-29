import type { SupabaseClient } from '@supabase/supabase-js';
import type { Reminder } from '../types/supabase';

// --- Reminder Functions ---

export const getRemindersByUserId = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as Reminder[];
};

export const getReminderById = async (supabase: SupabaseClient, reminderId: string) => {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('id', reminderId)
    .single();
  if (error) throw error;
  return data as Reminder | null;
};

export const createReminder = async (supabase: SupabaseClient, reminderData: Partial<Reminder>) => {
  const { data, error } = await supabase
    .from('reminders')
    .insert([reminderData])
    .select()
    .single();
  if (error) throw error;
  return data as Reminder | null;
};

export const updateReminder = async (supabase: SupabaseClient, reminderId: string, updates: Partial<Reminder>) => {
  const { data, error } = await supabase
    .from('reminders')
    .update(updates)
    .eq('id', reminderId)
    .select()
    .single();
  if (error) throw error;
  return data as Reminder | null;
};

export const deleteReminder = async (supabase: SupabaseClient, reminderId: string) => {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', reminderId);
  if (error) throw error;
  return true;
}; 