import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Meta } from '@/types/meta'
import { fetchMetas as apiFetchMetas, fetchMetaById as apiFetchMetaById } from '~/lib/supabase.api'

export const useMetaStore = defineStore('meta', () => {
  const items = ref<Record<string, Meta>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const list = computed(() => Object.values(items.value))

  function setMetas(metas: Meta[]) {
    items.value = {}
    metas.forEach(m => { items.value[m.id] = m })
  }

  function addMeta(m: Meta) {
    items.value[m.id] = m
  }

  function updateMetaLocal(id: string, patch: Partial<Meta>) {
    if (!items.value[id]) return
    items.value[id] = { ...items.value[id], ...patch }
  }

  function removeMeta(id: string) {
    delete items.value[id]
  }

  async function fetchMetas(opts: { limit?: number; offset?: number } = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await apiFetchMetas(opts)
      if (err) {
        error.value = err.message
        return [] as Meta[]
      }
      const metas = (data ?? []) as Meta[]
      setMetas(metas)
      return metas
    } finally {
      loading.value = false
    }
  }

  async function fetchMetaById(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await apiFetchMetaById(id)
      if (err) {
        error.value = err.message
        return null
      }
      const meta = data as Meta
      addMeta(meta)
      return meta
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    list,
    loading,
    error,
    setMetas,
    addMeta,
    updateMetaLocal,
    removeMeta,
    fetchMetas,
    fetchMetaById
  }
})
