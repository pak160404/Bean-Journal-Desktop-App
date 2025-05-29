import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserIntegration } from '../types/supabase';

// --- UserIntegration Functions ---

export const getUserIntegrationsByUserId = async (supabase: SupabaseClient, userId: string) => {
  const { data } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', userId)
    .throwOnError();
  return data as UserIntegration[];
};

export const getUserIntegrationById = async (supabase: SupabaseClient, integrationId: string) => {
  const { data } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('id', integrationId)
    .single()
    .throwOnError();
  return data as UserIntegration | null;
};

export const createUserIntegration = async (supabase: SupabaseClient, integrationData: Partial<UserIntegration>) => {
  const { data } = await supabase
    .from('user_integrations')
    .insert([integrationData])
    .select()
    .single()
    .throwOnError();
  return data as UserIntegration | null;
};

export const updateUserIntegration = async (supabase: SupabaseClient, integrationId: string, updates: Partial<UserIntegration>) => {
  const { data } = await supabase
    .from('user_integrations')
    .update(updates)
    .eq('id', integrationId)
    .select()
    .single()
    .throwOnError();
  return data as UserIntegration | null;
};

export const deleteUserIntegration = async (supabase: SupabaseClient, integrationId: string) => {
  await supabase
    .from('user_integrations')
    .delete()
    .eq('id', integrationId)
    .throwOnError();
  return true;
}; 