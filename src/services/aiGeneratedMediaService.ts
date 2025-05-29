import type { SupabaseClient } from '@supabase/supabase-js';
import type { AiGeneratedMedia } from '../types/supabase';

// --- AiGeneratedMedia Functions ---

export const getAiGeneratedMediaByUserId = async (supabase: SupabaseClient, userId: string) => {
  const { data } = await supabase
    .from('ai_generated_media')
    .select('*')
    .eq('user_id', userId)
    .throwOnError();
  return data as AiGeneratedMedia[];
};

export const getAiGeneratedMediaById = async (supabase: SupabaseClient, mediaId: string) => {
  const { data } = await supabase
    .from('ai_generated_media')
    .select('*')
    .eq('id', mediaId)
    .single()
    .throwOnError();
  return data as AiGeneratedMedia | null;
};

export const createAiGeneratedMedia = async (supabase: SupabaseClient, mediaData: Partial<AiGeneratedMedia>) => {
  const { data } = await supabase
    .from('ai_generated_media')
    .insert([mediaData])
    .select()
    .single()
    .throwOnError();
  return data as AiGeneratedMedia | null;
};

// Note: Supabase Storage handles uploads directly, this is for metadata.

export const deleteAiGeneratedMedia = async (supabase: SupabaseClient, mediaId: string) => {
    // Remember to also delete the file from Supabase Storage
  await supabase
    .from('ai_generated_media')
    .delete()
    .eq('id', mediaId)
    .throwOnError();
  return true;
}; 