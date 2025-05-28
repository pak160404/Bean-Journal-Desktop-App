import { supabase } from '../utils/supabaseClient';
import type { Tag, EntryTag } from '../types/supabase';

// --- Tag Functions ---

export const getTagsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as Tag[];
};

export const getTagById = async (tagId: string) => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', tagId)
    .single();
  if (error) throw error;
  return data as Tag | null;
};

export const createTag = async (tagData: Partial<Tag>) => {
  const { data, error } = await supabase
    .from('tags')
    .insert([tagData])
    .select()
    .single();
  if (error) throw error;
  return data as Tag | null;
};

export const updateTag = async (tagId: string, updates: Partial<Tag>) => {
  const { data, error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', tagId)
    .select()
    .single();
  if (error) throw error;
  return data as Tag | null;
};

export const deleteTag = async (tagId: string) => {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId);
  if (error) throw error;
  return true;
};

// --- EntryTag Functions ---

export const getEntryTagsByEntryId = async (entryId: string) => {
  const { data, error } = await supabase
    .from('entry_tags')
    .select('*')
    .eq('entry_id', entryId);
  if (error) throw error;
  return data as EntryTag[];
};

export const addTagToEntry = async (entryTagData: EntryTag) => {
  const { data, error } = await supabase
    .from('entry_tags')
    .insert([entryTagData])
    .select()
    .single();
  if (error) throw error;
  return data as EntryTag | null;
};

export const removeTagFromEntry = async (entryId: string, tagId: string) => {
  const { error } = await supabase
    .from('entry_tags')
    .delete()
    .eq('entry_id', entryId)
    .eq('tag_id', tagId);
  if (error) throw error;
  return true;
}; 