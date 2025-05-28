import { supabase } from '../utils/supabaseClient';
import type { MediaAttachment } from '../types/supabase';

// --- MediaAttachment Functions ---

export const getMediaAttachmentsByEntryId = async (entryId: string) => {
  const { data, error } = await supabase
    .from('media_attachments')
    .select('*')
    .eq('entry_id', entryId);
  if (error) throw error;
  return data as MediaAttachment[];
};

export const getMediaAttachmentById = async (attachmentId: string) => {
  const { data, error } = await supabase
    .from('media_attachments')
    .select('*')
    .eq('id', attachmentId)
    .single();
  if (error) throw error;
  return data as MediaAttachment | null;
};

export const createMediaAttachment = async (attachmentData: Partial<MediaAttachment>) => {
  const { data, error } = await supabase
    .from('media_attachments')
    .insert([attachmentData])
    .select()
    .single();
  if (error) throw error;
  return data as MediaAttachment | null;
};

// Note: Supabase Storage handles uploads directly, this is for metadata.
// For actual file upload, use supabase.storage.from('bucket-name').upload(...)

export const deleteMediaAttachment = async (attachmentId: string) => {
    // Remember to also delete the file from Supabase Storage
  const { error } = await supabase
    .from('media_attachments')
    .delete()
    .eq('id', attachmentId);
  if (error) throw error;
  return true;
}; 