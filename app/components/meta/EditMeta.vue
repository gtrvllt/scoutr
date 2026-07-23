<template>
  <Teleport to="body">
    <Transition name="edit-meta-fade">
      <div v-if="modelValue" class="edit-meta-overlay" @click.self="close">
        <div class="edit-meta-card">
          <div class="edit-meta-header">
            <h2 class="edit-meta-title">Edit meta</h2>
            <button type="button" class="edit-meta-close" @click="close">
              <UIcon name="i-lucide-x" class="size-6 cursor-pointer" />
            </button>
          </div>

          <form class="edit-meta-body" @submit.prevent="onSubmit">
            <!-- Image -->
            <div class="image-panel border-2 border-black cursor-pointer" @dragover.prevent @drop.prevent="onDrop">
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
              <div class="relative h-48 overflow-hidden" @click="triggerFileDialog">
                <img :src="preview || meta?.image_url" alt="Meta image" class="h-full w-full object-cover" />
                <div class="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors duration-200">
                  <UIcon name="i-heroicons-camera" class="w-8 h-8 text-white opacity-0 hover-show" />
                </div>
                <button v-if="preview" type="button"
                  class="absolute right-3 top-3 bg-white/80 px-3 py-1 text-xs border border-black cursor-pointer"
                  @click.stop="resetImage">clear</button>
              </div>
              <input type="text" class="w-full border-t-2 border-black px-4 py-2 text-sm" placeholder="Or paste image URL" @paste.prevent="onPaste" @click.prevent="" />
            </div>

            <!-- Fields -->
            <div class="flex flex-col gap-4">
              <input v-model="form.name" type="text" class="w-full px-5 py-2 text-base border border-gray-200 focus:border-black focus:outline-none" placeholder="Meta name" />

              <!-- Tags -->
              <div class="relative">
                <input v-model="tagSearch" type="text" class="w-full px-4 py-2 text-sm border border-gray-200 focus:border-black focus:outline-none"
                  placeholder="Tags..."
                  @keydown.enter.prevent="handleTagEnter"
                  @input="filterSuggestions"
                  @focus="tagFocused = true"
                  @blur="tagFocused = false" />
                <ul v-if="suggestions.length && tagFocused"
                  class="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto border-2 border-black bg-white text-sm">
                  <li v-for="s in suggestions" :key="s"
                    class="cursor-pointer px-4 py-2 hover:bg-neutral-100"
                    @pointerdown.prevent="addTag(s)">{{ s }}</li>
                </ul>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in selectedTags" :key="tag"
                  class="inline-flex items-center gap-1 bg-black px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-white">
                  {{ tag }}
                  <button type="button" class="text-white/70" @click="removeTag(tag)">&times;</button>
                </span>
              </div>

              <textarea v-model="form.description" rows="4"
                class="w-full px-5 py-4 text-base border border-gray-200 focus:border-black focus:outline-none"
                placeholder="Description" />
            </div>

            <p v-if="submitError" class="text-sm text-rose-600">{{ submitError }}</p>

            <div class="flex justify-end gap-3">
              <button type="button"
                class="px-6 py-2 border-2 border-black text-sm font-medium hover:bg-gray-50 transition-colors"
                @click="close">Cancel</button>
              <button type="submit"
                class="px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                :disabled="submitting || !form.name">
                {{ submitting ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useSupabaseClient } from '~/lib/supabase.client'
import { useAuthStore } from '~/stores/auth'
import { updateMeta as apiUpdateMeta } from '~/lib/supabase.api'
import type { Meta } from '@/types/meta'

const props = defineProps<{ modelValue: boolean; meta: Meta | null }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'meta-updated', meta: Meta): void
}>()

const supabase = useSupabaseClient()
const authStore = useAuthStore()

const form = reactive({ name: '', description: '' })
const selectedTags = ref<string[]>([])
const tagSearch = ref('')
const tagFocused = ref(false)
const suggestions = ref<string[]>([])
const availableTags = ref<string[]>([])
const preview = ref<string | null>(null)
const newFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const submitting = ref(false)
const submitError = ref<string | null>(null)

watch(() => props.meta, async (meta) => {
  if (!meta) return
  form.name = meta.name || meta.title || ''
  form.description = meta.description || ''
  preview.value = null
  newFile.value = null
  submitError.value = null

  const rawTags = meta.tags
  if (!rawTags) {
    selectedTags.value = []
  } else if (Array.isArray(rawTags)) {
    selectedTags.value = rawTags
  } else {
    try {
      const parsed = JSON.parse(rawTags)
      selectedTags.value = Array.isArray(parsed) ? parsed : rawTags.split(',').map((t: string) => t.trim()).filter(Boolean)
    } catch {
      selectedTags.value = rawTags.split(',').map((t: string) => t.trim()).filter(Boolean)
    }
  }

  if (meta.country_code) {
    const { data } = await supabase.from('meta_tags').select('name').eq('country_code', meta.country_code.toUpperCase()).order('name')
    availableTags.value = (data ?? []).map((t) => t.name)
    filterSuggestions()
  }
}, { immediate: true })

const close = () => emit('update:modelValue', false)

const filterSuggestions = () => {
  const q = tagSearch.value.trim().toLowerCase()
  const base = availableTags.value.filter(t => !selectedTags.value.includes(t))
  suggestions.value = q ? base.filter(t => t.toLowerCase().includes(q)) : base.slice(0, 8)
}

const addTag = (tag: string) => {
  if (!tag.trim() || selectedTags.value.includes(tag)) return
  selectedTags.value = [...selectedTags.value, tag]
  tagSearch.value = ''
  suggestions.value = []
}

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const handleTagEnter = () => {
  if (tagSearch.value.trim()) addTag(tagSearch.value.trim())
}

const triggerFileDialog = () => fileInput.value?.click()

const setFile = (file: File | null) => {
  if (!file) return
  newFile.value = file
  preview.value = URL.createObjectURL(file)
}

const resetImage = () => {
  newFile.value = null
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = null
}

const onFileChange = (e: Event) => setFile((e.target as HTMLInputElement).files?.[0] || null)
const onDrop = (e: DragEvent) => setFile(e.dataTransfer?.files?.[0] || null)
const onPaste = (e: ClipboardEvent) => setFile(e.clipboardData?.files?.[0] || null)

const uploadImage = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop()
  const name = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('images').upload(`public/${name}`, file)
  if (error) throw error
  return supabase.storage.from('images').getPublicUrl(`public/${name}`).data.publicUrl
}

const onSubmit = async () => {
  if (!props.meta || !form.name) return
  submitting.value = true
  submitError.value = null
  try {
    let imageUrl = props.meta.image_url
    if (newFile.value) imageUrl = await uploadImage(newFile.value)

    const payload = {
      name: form.name,
      description: form.description,
      tags: selectedTags.value,
      image_url: imageUrl,
      updated_by: authStore.user?.id,
    }
    const { data, error } = await apiUpdateMeta(props.meta.id, payload)
    if (error) throw error
    emit('meta-updated', data as Meta)
    close()
  } catch (err: any) {
    submitError.value = err?.message ?? 'Unable to save the meta.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.edit-meta-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 24px;
  z-index: 1100;
}

.edit-meta-card {
  background: white;
  border: 2px solid black;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.edit-meta-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
}

.edit-meta-title {
  font-size: 24px;
  font-weight: 700;
}

.edit-meta-close {
  background: none;
  border: none;
  cursor: pointer;
}

.edit-meta-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

.image-panel {
  overflow: hidden;
}

.edit-meta-fade-enter-active,
.edit-meta-fade-leave-active {
  transition: opacity 0.2s ease;
}

.edit-meta-fade-enter-from,
.edit-meta-fade-leave-to {
  opacity: 0;
}
</style>
