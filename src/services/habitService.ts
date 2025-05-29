import type { SupabaseClient } from '@supabase/supabase-js';
import type { Habit, HabitLog } from '../types/supabase';

// --- Habit Functions ---

export const getHabitsByUserId = async (supabase: SupabaseClient, userId: string) => {
  const { data } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .throwOnError();
  return data as Habit[];
};

export const getHabitById = async (supabase: SupabaseClient, habitId: string) => {
  const { data } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single()
    .throwOnError();
  return data as Habit | null;
};

export const createHabit = async (supabase: SupabaseClient, habitData: Partial<Habit>) => {
  const { data } = await supabase
    .from('habits')
    .insert([habitData])
    .select()
    .single()
    .throwOnError();
  return data as Habit | null;
};

export const updateHabit = async (supabase: SupabaseClient, habitId: string, updates: Partial<Habit>) => {
  const { data } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .select()
    .single()
    .throwOnError();
  return data as Habit | null;
};

export const deleteHabit = async (supabase: SupabaseClient, habitId: string) => {
  await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .throwOnError();
  return true;
};

// --- HabitLog Functions ---

export const getHabitLogsByHabitId = async (supabase: SupabaseClient, habitId: string) => {
  const { data } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .throwOnError();
  return data as HabitLog[];
};

export const getHabitLogsByUserIdAndDate = async (supabase: SupabaseClient, userId: string, logDate: string) => {
  const { data } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', logDate)
    .throwOnError();
  return data as HabitLog[];
};


export const createHabitLog = async (supabase: SupabaseClient, logData: Partial<HabitLog>) => {
  const { data } = await supabase
    .from('habit_logs')
    .insert([logData])
    .select()
    .single()
    .throwOnError();
  return data as HabitLog | null;
};

export const updateHabitLog = async (supabase: SupabaseClient, logId: string, updates: Partial<HabitLog>) => {
  const { data } = await supabase
    .from('habit_logs')
    .update(updates)
    .eq('id', logId)
    .select()
    .single()
    .throwOnError();
  return data as HabitLog | null;
};

export const deleteHabitLog = async (supabase: SupabaseClient, logId: string) => {
  await supabase
    .from('habit_logs')
    .delete()
    .eq('id', logId)
    .throwOnError();
  return true;
};