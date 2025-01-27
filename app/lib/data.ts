import { supabase } from '@/lib/supabase';
import { Meta } from './definitions';

export async function fetchMetas() {
  try {
    const data = await supabase.from('metas').select('*');
    return data.rows;
  } catch (error) {
    console.error('fetchMetas Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchMetasByCountryCode(code: string) {
  try {
    const data = await supabase.from('metas').select().eq('country_code', code)
  } catch (error) {
    console.error('fetchMetasByCountryCode error :', error)
  }
}
