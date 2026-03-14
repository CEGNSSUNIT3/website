import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('*, photos(*)')
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getGalleryPhotos() {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createActivity(
  title: string,
  description: string,
  date: string
) {
  const { data, error } = await supabase
    .from('activities')
    .insert({ title, description, date })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addPhoto(activityId: string, imageUrl: string) {
  const { error } = await supabase
    .from('photos')
    .insert({ activity_id: activityId, image_url: imageUrl });

  if (error) throw error;
}

export async function deleteActivity(id: string) {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadPhoto(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('nss-photos')
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('nss-photos')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
