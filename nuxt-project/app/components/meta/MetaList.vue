<template>
  <section class="space-y-8">
    <div class="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-xl">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search a meta"
            class="w-full max-w-xl"
            variant="outline"
          />
          <div class="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-neutral-400">
            <span>Metas</span>
            <span class="h-1 w-1 rounded-full bg-neutral-300" aria-hidden="true"></span>
            <span>{{ metas.length }} entries</span>
          </div>
        </div>
        <UButton size="lg" color="black" class="uppercase tracking-[0.4em]" @click="toggleAddMeta">
          {{ isAddFormOpen ? 'Close' : 'New Meta' }}
        </UButton>
      </div>

      <Transition name="fade">
        <div v-if="isAddFormOpen" class="mt-6">
          <AddMeta v-model:open="isAddFormOpen" :country="country" @meta-added="handleMetaAdded">
            <template #actions>
              <UButton variant="ghost" @click="isAddFormOpen = false">Fermer</UButton>
            </template>
          </AddMeta>
        </div>
      </Transition>

      <div v-if="tagNames.length" class="mt-6 flex flex-wrap gap-3">
        <button
          v-for="tag in tagNames"
          :key="tag"
          type="button"
          class="rounded-full border px-4 py-1 text-sm font-medium transition"
          :class="selectedTags.includes(tag) ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white hover:border-black'"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
        <button v-if="selectedTags.length" type="button" class="text-sm underline" @click="clearTags">
          Reset
        </button>
      </div>
    </div>

    <div class="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-xl">
      <div v-if="loading" class="text-sm text-neutral-500">Chargement des métas…</div>
      <p v-else-if="error" class="text-sm text-rose-600">{{ error }}</p>
      <p v-else-if="!filteredMetas.length" class="text-sm text-neutral-500">
        Aucune méta pour ce pays pour le moment.
      </p>

      <div v-else class="space-y-6">
        <MetaItem
          v-for="meta in filteredMetas"
          :key="meta.id"
          :meta="meta"
          @edit="handleMetaEdit"
          @deleted="handleMetaDeleted"
          @error="handleMetaError"
        />
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

const props = defineProps<{ country: { code: string; name: string } }>()

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

const countryCode = computed(() => props.country.code?.toUpperCase?.())

const refresh = async () => {
  if (!countryCode.value) return
  loading.value = true
  error.value = null
  try {
    const [metasRes, tagsRes] = await Promise.all([
      supabase.from('metas').select('*').eq('country_code', countryCode.value).order('id', { ascending: false }),
      supabase.from('meta_tags').select('name').eq('country_code', countryCode.value).order('name'),
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

watch(countryCode, async (value) => {
  selectedTags.value = []
  if (!value) {
    metas.value = []
    tagNames.value = []
    return
  }
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

const handleMetaAdded = async () => {
  await refresh()
  isAddFormOpen.value = false
}

const toggleAddMeta = () => {
  if (!authStore.isLogged) {
    authStore.dialogMode = 'login'
    authStore.isLoginOpen = true
    return
  }
  isAddFormOpen.value = !isAddFormOpen.value
}
</script>
