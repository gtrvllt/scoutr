<template>
  <section class="space-y-8">
    <div class="tags-container">
      <AddMeta :country="country.code && country.name ? { code: country.code, name: country.name } : null" @meta-added="handleMetaAdded" />

      <div v-if="tagNames.length" class="mt-6 flex flex-wrap gap-3">
        <button v-for="tag in tagNames" :key="tag" class="tag-button overflow-hidden"
          :class="selectedTags.includes(tag) ? 'bg-black text-white border-2 border-black' : ' border-2 border-black border-black  hover:border-black'"
          @click="toggleTag(tag)">
          {{ tag }}
        </button>
        <button v-if="selectedTags.length" type="button" class="text-sm underline" @click="clearTags">
          Reset tags
        </button>
      </div>
    </div>

    <div class="">
      <div v-if="loading" class="text-sm text-neutral-500">Chargement des métas…</div>
      <p v-else-if="error" class="text-sm text-rose-600">{{ error }}</p>
      <p v-else-if="!filteredMetas.length" class="text-sm text-neutral-500">
        Aucune méta pour ce pays pour le moment.
      </p>

      <div v-else class="space-y-6">
        <MetaItem v-for="meta in filteredMetas" :key="meta.id" :meta="meta" @edit="handleMetaEdit"
          @deleted="handleMetaDeleted" @error="handleMetaError" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AddMeta from '@/components/meta/AddMeta.vue'
import MetaItem from '@/components/Metas/MetaItem.vue'
import type { Meta } from '@/types/meta'
import { useSupabaseClient } from '~/lib/supabase.client'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{ country: { code: string | null; name?: string } }>()

const supabase = useSupabaseClient()
const toast = useToast()
const authStore = useAuthStore()
const metas = ref<Meta[]>([])
const tagNames = ref<string[]>([])
const selectedTags = ref<string[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const isAddFormOpen = ref(false)

const countryCode = computed(() => props.country.code?.toUpperCase?.() || null)

const refresh = async () => {
  loading.value = true
  error.value = null
  try {
    let metasQuery = supabase.from('metas').select('*')
    let tagsQuery = supabase.from('meta_tags').select('name')
    if (countryCode.value) {
      metasQuery = metasQuery.eq('country_code', countryCode.value)
      tagsQuery = tagsQuery.eq('country_code', countryCode.value)
    }
    const [metasRes, tagsRes] = await Promise.all([
      metasQuery.order('id', { ascending: false }),
      tagsQuery.order('name'),
    ])
    if (metasRes.error) throw metasRes.error
    if (tagsRes.error) throw tagsRes.error
    metas.value = metasRes.data ?? []
    tagNames.value = (tagsRes.data ?? []).map((t) => t.name)
  } catch (err: any) {
    console.error(err)
    error.value = err?.message ?? 'Impossible de récupérer les métas'
  } finally {
    loading.value = false
  }
}

watch(countryCode, async () => {
  selectedTags.value = []
  await refresh()
}, { immediate: true })

const normalizeTags = (value: Meta['tags']) => {
  if (!value) return [] as string[]
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
      return value.split(',').map((tag) => tag.trim()).filter(Boolean)
    } catch {
      return value.split(',').map((tag) => tag.trim()).filter(Boolean)
    }
  }
  return []
}

const filteredMetas = computed(() => {
  const base = metas.value.filter((meta) => {
    if (!selectedTags.value.length) return true
    const tags = normalizeTags(meta.tags)
    return tags.some((tag) => selectedTags.value.includes(tag))
  })

  if (!searchQuery.value.trim()) return base
  const query = searchQuery.value.trim().toLowerCase()
  return base.filter((meta) => {
    const title = (meta.title || meta.name || '').toLowerCase()
    const description = (meta.description || '').toLowerCase()
    return title.includes(query) || description.includes(query)
  })
})

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  } else {
    selectedTags.value = [...selectedTags.value, tag]
  }
}

const clearTags = () => {
  selectedTags.value = []
}

const handleMetaEdit = (meta: Meta) => {
  const title = meta.title || meta.name || meta.id
  toast.add({ title: 'Édition prochainement', description: `La modification de "${title}" arrive bientôt.`, color: 'amber' })
}

const handleMetaDeleted = async () => {
  await refresh()
}

const handleMetaError = (message: string) => {
  error.value = message
  toast.add({ title: 'Action impossible', description: message, color: 'red' })
}

const handleMetaAdded = (meta: Meta) => {
  metas.value.unshift(meta)
  if (meta.tags) {
    const tags = Array.isArray(meta.tags) ? meta.tags : [meta.tags]
    tags.forEach(tag => { if (!tagNames.value.includes(tag)) tagNames.value.push(tag) })
  }
  isAddFormOpen.value = false
}

const toggleAddMeta = () => {
  if (!authStore.isLogged) {
    authStore.isLoginOpen = true
    return
  }
  isAddFormOpen.value = !isAddFormOpen.value
}
</script>
<style scoped>
.tag-button {
  /* Tag button no Hover */
  margin: 2px solid black;
  width: 119px;
  height: 51px;
  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;

}
</style>