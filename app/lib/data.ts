import { supabase } from '@/lib/supabase';
import { Meta } from './definitions';
export async function fetchMetas() {
  try {
    const data = await supabase.from('metas').select('*');
    console.log('fetchMetas data:', data);
    return data.data;
  } catch (error) {
    console.error('fetchMetas Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchTags() {
  try {
    const data = await supabase.from('meta_tags').select('*');
    console.log('fetchTags data:', data);
    return data.data;
  } catch (error) {
    console.error('fetchMetas Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function addTag(value:String) {
  try {

    const response = await supabase
      .from('meta-tag')
      .insert([
        { name: value, created_at: new Date() },
      ])
    if (response.error) {
      console.error('Error adding tag:', response.error);
      return null;
    }
    console.log('Tag added:', response);
    return response
  } catch (error) {
    console.error('fetchMetas Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchMetasByCountryCode(code: string) {
  try {
    const data = await supabase.from('metas').select().eq('country_code', code)
    return data.data
  } catch (error) {
    console.error('fetchMetasByCountryCode error :', error)
  }
}
