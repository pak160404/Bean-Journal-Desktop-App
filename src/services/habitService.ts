import { supabase } from '../utils/supabaseClient';
import type { Habit, HabitLog } from '../types/supabase';

// --- Habit Functions ---

export const getHabitsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as Habit[];
};

export const getHabitById = async (habitId: string) => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single();
  if (error) throw error;
  return data as Habit | null;
};

export const createHabit = async (habitData: Partial<Habit>) => {
  const { data, error } = await supabase
    .from('habits')
    .insert([habitData])
    .select()
    .single();
  if (error) throw error;
  return data as Habit | null;
};

export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .select()
    .single();
  if (error) throw error;
  return data as Habit | null;
};

export const deleteHabit = async (habitId: string) => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId);
  if (error) throw error;
  return true;
};

// --- HabitLog Functions ---

export const getHabitLogsByHabitId = async (habitId: string) => {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId);
  if (error) throw error;
  return data as HabitLog[];
};

export const getHabitLogsByUserIdAndDate = async (userId: string, logDate: string) => {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', logDate);
  if (error) throw error;
  return data as HabitLog[];
};


export const createHabitLog = async (logData: Partial<HabitLog>) => {
  const { data, error } = await supabase
    .from('habit_logs')
    .insert([logData])
    .select()
    .single();
  if (error) throw error;
  return data as HabitLog | null;
};

export const updateHabitLog = async (logId: string, updates: Partial<HabitLog>) => {
  const { data, error } = await supabase
    .from('habit_logs')
    .update(updates)
    .eq('id', logId)
    .select()
    .single();
  if (error) throw error;
  return data as HabitLog | null;
};

export const deleteHabitLog = async (logId: string) => {
  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('id', logId);
  if (error) throw error;
  return true;
}; 