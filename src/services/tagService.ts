import type { SupabaseClient } from '@supabase/supabase-js';
import type { Tag, EntryTag } from '../types/supabase';

// --- Tag Functions ---

export const getTagsByUserId = async (supabase: SupabaseClient, userId: string) => {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .throwOnError();
  return data as Tag[];
};

export const getTagById = async (supabase: SupabaseClient, tagId: string) => {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .eq('id', tagId)
    .single()
    .throwOnError();
  return data as Tag | null;
};

export const createTag = async (supabase: SupabaseClient, tagData: Partial<Tag>) => {
  const { data } = await supabase
    .from('tags')
    .insert([tagData])
    .select()
    .single()
    .throwOnError();
  return data as Tag | null;
};

export const updateTag = async (supabase: SupabaseClient, tagId: string, updates: Partial<Tag>) => {
  const { data } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', tagId)
    .select()
    .single()
    .throwOnError();
  return data as Tag | null;
};

export const deleteTag = async (supabase: SupabaseClient, tagId: string) => {
  await supabase
    .from('tags')
    .delete()
    .eq('id', tagId)
    .throwOnError();
  return true;
};

// --- EntryTag Functions ---

export const getEntryTagsByEntryId = async (supabase: SupabaseClient, entryId: string) => {
  const { data } = await supabase
    .from('entry_tags')
    .select('*')
    .eq('entry_id', entryId)
    .throwOnError();
  return data as EntryTag[];
};

export const addTagToEntry = async (supabase: SupabaseClient, entryTagData: EntryTag) => {
  const { data } = await supabase
    .from('entry_tags')
    .insert([entryTagData])
    .select()
    .single()
    .throwOnError();
  return data as EntryTag | null;
};

export const removeTagFromEntry = async (supabase: SupabaseClient, entryId: string, tagId: string) => {
  await supabase
    .from('entry_tags')
    .delete()
    .eq('entry_id', entryId)
    .eq('tag_id', tagId)
    .throwOnError();
  return true;
}; 