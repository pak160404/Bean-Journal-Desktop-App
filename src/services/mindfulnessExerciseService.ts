import type { SupabaseClient } from '@supabase/supabase-js';
import type { MindfulnessExercise } from '../types/supabase';

// --- MindfulnessExercise Functions ---

export const getAllMindfulnessExercises = async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from('mindfulness_exercises')
    .select('*')
    .throwOnError();
  return data as MindfulnessExercise[];
};

export const getMindfulnessExerciseById = async (supabase: SupabaseClient, exerciseId: string) => {
  const { data } = await supabase
    .from('mindfulness_exercises')
    .select('*')
    .eq('id', exerciseId)
    .single()
    .throwOnError();
  return data as MindfulnessExercise | null;
};

// CUD for MindfulnessExercises would typically be admin restricted.
// For simplicity, assuming they are managed via Supabase Studio or specific admin interface. 