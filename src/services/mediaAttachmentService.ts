import type { SupabaseClient } from '@supabase/supabase-js';
import type { MediaAttachment } from '../types/supabase';

// --- MediaAttachment Functions ---

export const getMediaAttachmentsByEntryId = async (supabase: SupabaseClient, entryId: string) => {
  const { data } = await supabase
    .from('media_attachments')
    .select('*')
    .eq('entry_id', entryId)
    .throwOnError();
  return data as MediaAttachment[];
};

export const getMediaAttachmentById = async (supabase: SupabaseClient, attachmentId: string) => {
  const { data } = await supabase
    .from('media_attachments')
    .select('*')
    .eq('id', attachmentId)
    .single()
    .throwOnError();
  return data as MediaAttachment | null;
};

export const createMediaAttachment = async (supabase: SupabaseClient, attachmentData: Partial<MediaAttachment>) => {
  const { data } = await supabase
    .from('media_attachments')
    .insert([attachmentData])
    .select()
    .single()
    .throwOnError();
  return data as MediaAttachment | null;
};

// Note: Supabase Storage handles uploads directly, this is for metadata.
// For actual file upload, use supabase.storage.from('bucket-name').upload(...)

export const deleteMediaAttachment = async (supabase: SupabaseClient, attachmentId: string) => {
    // Remember to also delete the file from Supabase Storage
  await supabase
    .from('media_attachments')
    .delete()
    .eq('id', attachmentId)
    .throwOnError();
  return true;
}; 