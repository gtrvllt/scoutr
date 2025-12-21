import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export const useSupabaseClient = () => {
  if (client) return client

  const config = useRuntimeConfig()
  const url = config.public.SUPABASE_URL
  const key = config.public.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase URL or anon key is missing in runtime config')
  }

  client = createClient(url, key)
  return client
}
