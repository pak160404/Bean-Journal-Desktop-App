import { supabase } from '../utils/supabaseClient';
import type { Achievement, UserAchievement } from '../types/supabase';

// --- Achievement Functions ---

export const getAllAchievements = async () => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*');
  if (error) throw error;
  return data as Achievement[];
};

export const getAchievementById = async (achievementId: string) => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', achievementId)
    .single();
  if (error) throw error;
  return data as Achievement | null;
};

// CUD for Achievements typically admin restricted.

// --- UserAchievement Functions ---

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)') // Optionally join achievement details
    .eq('user_id', userId);
  if (error) throw error;
  return data as (UserAchievement & { achievements: Achievement })[];
};

export const addUserAchievement = async (userAchievementData: UserAchievement) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert([userAchievementData])
    .select()
    .single();
  if (error) throw error;
  return data as UserAchievement | null;
};

// Deleting a user achievement might not be a common operation. 