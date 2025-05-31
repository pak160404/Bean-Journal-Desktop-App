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

export const addTagToEntry = async (supabase: SupabaseClient, entryTagData: { user_id: string, entry_id: string, tag_id: string }) => {
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

export const getTagsForEntry = async (supabase: SupabaseClient, entryId: string): Promise<Tag[]> => {
  if (!entryId) return [];
  const { data: entryTags, error: entryTagsError } = await supabase
    .from('entry_tags')
    .select('tag_id')
    .eq('entry_id', entryId);

  if (entryTagsError) {
    console.error('Error fetching entry tags:', entryTagsError);
    throw entryTagsError;
  }

  if (!entryTags || entryTags.length === 0) {
    return [];
  }

  const tagIds = entryTags.map(et => et.tag_id);

  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('*')
    .in('id', tagIds);

  if (tagsError) {
    console.error('Error fetching tags:', tagsError);
    throw tagsError;
  }

  return (tags as Tag[]) || [];
};

export const updateEntryTags = async (
  supabase: SupabaseClient,
  userId: string,
  entryId: string,
  newTagIds: string[]
): Promise<void> => {
  const currentEntryTags = await getEntryTagsByEntryId(supabase, entryId);
  const currentTagIds = currentEntryTags.map(et => et.tag_id);

  const tagIdsToAdd = newTagIds.filter(id => !currentTagIds.includes(id));
  const entryTagsToRemove = currentEntryTags.filter(et => !newTagIds.includes(et.tag_id));

  if (tagIdsToAdd.length > 0) {
    const newEntryTagData = tagIdsToAdd.map(tag_id => ({
      user_id: userId,
      entry_id: entryId,
      tag_id,
    }));
    await supabase.from('entry_tags').insert(newEntryTagData).throwOnError();
  }

  if (entryTagsToRemove.length > 0) {
    for (const entryTag of entryTagsToRemove) {
        await removeTagFromEntry(supabase, entryId, entryTag.tag_id);
    }
  }
}; 