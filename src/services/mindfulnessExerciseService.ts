import { supabase } from '../utils/supabaseClient';
import type { MindfulnessExercise } from '../types/supabase';

// --- MindfulnessExercise Functions ---

export const getAllMindfulnessExercises = async () => {
  const { data, error } = await supabase
    .from('mindfulness_exercises')
    .select('*');
  if (error) throw error;
  return data as MindfulnessExercise[];
};

export const getMindfulnessExerciseById = async (exerciseId: string) => {
  const { data, error } = await supabase
    .from('mindfulness_exercises')
    .select('*')
    .eq('id', exerciseId)
    .single();
  if (error) throw error;
  return data as MindfulnessExercise | null;
};

// CUD for MindfulnessExercises would typically be admin restricted.
// For simplicity, assuming they are managed via Supabase Studio or specific admin interface. 