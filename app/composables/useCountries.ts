import type { SupabaseClient } from '@supabase/supabase-js'
import { useSupabaseClient } from '~/lib/supabase.client'

export async function fetchCountries(): Promise<Array<any>> {
  try {
    const supabase: SupabaseClient = useSupabaseClient()
    const { data, error } = await supabase.from('countries').select('code,isCovered')
    if (error) {
      console.warn('fetchCountries supabase error', error)
      return []
    }
    return data || []
  } catch (e) {
    console.error('fetchCountries failed', e)
    return []
  }
}
