import { ref } from 'vue'
import type { Meta } from '@/types/meta'
// import { useSupabaseClient } from '~/lib/supabase.client'
import { useMetaStore } from '~/stores/meta'
import { MetaSchema, MetaCreateSchema, MetaUpdateSchema } from '@/schemas/meta'

import { createMeta as apiCreateMeta, updateMeta as apiUpdateMeta, deleteMeta as apiDeleteMeta } from '~/lib/supabase.api'

export const useMeta = () => {
  const store = useMetaStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getMetas(opts: { limit?: number; offset?: number } = {}) {
    loading.value = true
    error.value = null
    try {
      return await store.fetchMetas(opts)
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      return [] as Meta[]
    } finally {
      loading.value = false
    }
  }

  async function getMeta(id: string) {
    loading.value = true
    error.value = null
    try {
      return await store.fetchMetaById(id)
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createMeta(payload: Partial<Meta>) {
    loading.value = true
    error.value = null
    try {
      // validate payload with Zod before sending
      const parsed = MetaCreateSchema.safeParse(payload)
      if (!parsed.success) {
        error.value = parsed.error.message
        return null
      }
      const { data, error: err } = await apiCreateMeta(parsed.data)
      if (err) {
        error.value = err.message
        return null
      }
      const meta = data as Meta
      store.addMeta(meta)
      return meta
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateMeta(id: string, patch: Partial<Meta>, opts: { optimistic?: boolean } = {}) {
    loading.value = true
    error.value = null
    const prev = store.items[id]
    if (opts.optimistic && prev) store.updateMetaLocal(id, patch)
    try {
      // validate patch
      const parsed = MetaUpdateSchema.safeParse(patch)
      if (!parsed.success) {
        error.value = parsed.error.message
        if (opts.optimistic && prev) store.addMeta(prev)
        return null
      }
      const { data, error: err } = await apiUpdateMeta(id, parsed.data)
      if (err) {
        error.value = err.message
        if (opts.optimistic && prev) store.addMeta(prev)
        return null
      }
      const meta = data as Meta
      store.addMeta(meta)
      return meta
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      if (opts.optimistic && prev) store.addMeta(prev)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteMeta(id: string, opts: { optimistic?: boolean } = {}) {
    loading.value = true
    error.value = null
    const prev = store.items[id]
    if (opts.optimistic) store.removeMeta(id)
    try {
      const { error: err } = await apiDeleteMeta(id)
      if (err) {
        error.value = err.message
        if (opts.optimistic && prev) store.addMeta(prev)
        return false
      }
      if (!opts.optimistic) store.removeMeta(id)
      return true
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      if (opts.optimistic && prev) store.addMeta(prev)
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, error, getMetas, getMeta, createMeta, updateMeta, deleteMeta }
}

export default useMeta
