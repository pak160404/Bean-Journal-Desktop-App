import type { SupabaseClient } from '@supabase/supabase-js';
import type { TodoItem } from '../types/supabase';

// --- TodoItem Functions ---

export const getTodoItemsByUserId = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('todo_items')
    .select('*, journal_entries (title)')
    .eq('user_id', userId);
  if (error) throw error;
  return data as TodoItem[];
};

export const getTodoItemsByEntryId = async (supabase: SupabaseClient, entryId: string) => {
  const { data, error } = await supabase
    .from('todo_items')
    .select('*')
    .eq('entry_id', entryId);
  if (error) throw error;
  return data as TodoItem[];
};

export const createTodoItem = async (supabase: SupabaseClient, todoData: Partial<TodoItem>) => {
  const { data, error } = await supabase
    .from('todo_items')
    .insert([todoData])
    .select()
    .single();
  if (error) throw error;
  return data as TodoItem | null;
};

export const updateTodoItem = async (supabase: SupabaseClient, todoId: string, updates: Partial<TodoItem>) => {
  const { data, error } = await supabase
    .from('todo_items')
    .update(updates)
    .eq('id', todoId)
    .select()
    .single();
  if (error) throw error;
  return data as TodoItem | null;
};

export const deleteTodoItem = async (supabase: SupabaseClient, todoId: string) => {
  const { error } = await supabase
    .from('todo_items')
    .delete()
    .eq('id', todoId);
  if (error) throw error;
  return true;
}; 