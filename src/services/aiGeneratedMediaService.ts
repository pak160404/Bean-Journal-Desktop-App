import { supabase } from '../utils/supabaseClient';
import type { AiGeneratedMedia } from '../types/supabase';

// --- AiGeneratedMedia Functions ---

export const getAiGeneratedMediaByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_generated_media')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as AiGeneratedMedia[];
};

export const getAiGeneratedMediaById = async (mediaId: string) => {
  const { data, error } = await supabase
    .from('ai_generated_media')
    .select('*')
    .eq('id', mediaId)
    .single();
  if (error) throw error;
  return data as AiGeneratedMedia | null;
};

export const createAiGeneratedMedia = async (mediaData: Partial<AiGeneratedMedia>) => {
  const { data, error } = await supabase
    .from('ai_generated_media')
    .insert([mediaData])
    .select()
    .single();
  if (error) throw error;
  return data as AiGeneratedMedia | null;
};

// Note: Supabase Storage handles uploads directly, this is for metadata.

export const deleteAiGeneratedMedia = async (mediaId: string) => {
    // Remember to also delete the file from Supabase Storage
  const { error } = await supabase
    .from('ai_generated_media')
    .delete()
    .eq('id', mediaId);
  if (error) throw error;
  return true;
}; 