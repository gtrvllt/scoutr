import { createClient } from '@supabase/supabase-js'
import type { PostgrestError } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

type Result<T = any> = { data: T | null; error: PostgrestError | null }

export function createClientWithToken(token?: string) {
  const config = useRuntimeConfig()
  const url = config.public.SUPABASE_URL
  const key = config.public.SUPABASE_ANON_KEY
  const options = token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : undefined
  return createClient(url, key, options)
}

export async function fetchMetas(params: { limit?: number; offset?: number } = {}, token?: string): Promise<Result> {
  const supabase = createClientWithToken(token)
  let query = supabase.from('metas').select('*')
  const { limit, offset } = params
  if (typeof limit === 'number' && typeof offset === 'number') {
    query = query.range(offset, offset + limit - 1)
  } else if (typeof limit === 'number') {
    query = query.limit(limit)
  }
  const res = await query
  return { data: res.data ?? null, error: res.error ?? null }
}

export async function fetchMetaById(id: string | number, token?: string): Promise<Result> {
  const supabase = createClientWithToken(token)
  const res = await supabase.from('metas').select('*').eq('id', id).single()
  return { data: res.data ?? null, error: res.error ?? null }
}

export async function createMeta(data: Record<string, any>, token?: string): Promise<Result> {
  const supabase = createClientWithToken(token)
  const res = await supabase.from('metas').insert([data]).select().single()
  return { data: res.data ?? null, error: res.error ?? null }
}

export async function updateMeta(id: string | number, data: Record<string, any>, token?: string): Promise<Result> {
  const supabase = createClientWithToken(token)
  const res = await supabase.from('metas').update(data).eq('id', id).select().single()
  return { data: res.data ?? null, error: res.error ?? null }
}

export async function deleteMeta(id: string | number, token?: string): Promise<Result> {
  const supabase = createClientWithToken(token)
  const res = await supabase.from('metas').delete().eq('id', id).select().single()
  return { data: res.data ?? null, error: res.error ?? null }
}
