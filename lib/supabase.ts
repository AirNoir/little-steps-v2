import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  email: string;
  is_pro: boolean;
  child_name: string | null;
  updated_at: string;
}

export interface VoiceLog {
  id: string;
  user_id: string;
  audio_url: string | null;
  raw_text: string | null;
  structured_json: {
    category?: string;
    summary?: string;
    milestones?: string[];
    next_steps?: string[];
    mood?: string;
    progress_score?: number;
  } | null;
  created_at: string;
}

// Check weekly usage
export async function getWeeklyUsage(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('voice_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (error) throw error;
  return count || 0;
}

// Check if user can record
export async function canRecord(userId: string): Promise<{ allowed: boolean; remaining: number; isPro: boolean }> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;

  const isPro = profile?.is_pro || false;
  const weeklyLimit = isPro ? 20 : 2;
  const used = await getWeeklyUsage(userId);
  const remaining = weeklyLimit - used;

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    isPro
  };
}

// Save voice log
export async function saveVoiceLog(
  userId: string,
  audioUrl: string,
  rawText: string,
  structuredJson: VoiceLog['structured_json']
) {
  const { data, error } = await supabase
    .from('voice_logs')
    .insert({
      user_id: userId,
      audio_url: audioUrl,
      raw_text: rawText,
      structured_json: structuredJson
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get user's voice logs
export async function getVoiceLogs(userId: string): Promise<VoiceLog[]> {
  const { data, error } = await supabase
    .from('voice_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
