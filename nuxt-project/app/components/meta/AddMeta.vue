<template>
  <div class="add-meta-container space-y-4">
    <transition name="fade">
      <div class="add-meta-block border-2 border-black">
        <form id="add-meta-form" @submit.prevent="onSubmit">
          <div v-if="isCreating" class="flex flex-col gap-6  bg-white/95 p-6 lg:flex-row">
            <div class="media-panel flex flex-1 cursor-pointer flex-col " @dragover.prevent @drop.prevent="onDrop">
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
              <div class="image-container border-2 border-black">
                <div v-if="!preview"
                  class="flex  h-48 flex-col items-center justify-center gap-3 text-sm text-neutral-600"
                  @click="triggerFileDialog">

                  <!-- use the SVG file from public/ so it's the actual addImage.svg asset -->
                  <img src="/addImage.svg" alt="Add image" class="w-6 h-6 text-neutral-500 mx-auto" />

                  <p class="text-xs text-neutral-400">Click or drag an image</p>
                </div>
                <div v-else class="relative h-48 overflow-hidden">
                  <img :src="preview" alt="Prévisualisation" class="h-full w-full object-cover" />
                  <button type="button"
                    class="absolute right-3 top-3  bg-white/80 px-3 py-1 text-xs border-1 border-black cursor-pointer"
                    @click.stop="resetImage">
                    clear
                  </button>
                </div>
              </div>
              <input ref="pasteInput" type="text" class="border-2 border-black px-4 py-2 mt-2 text-sm"
                placeholder="Or paste your image" @paste.prevent="onPaste" @click.prevent="" />
            </div>

            <div class="flex flex-1 flex-col gap-4">
              <div class="flex flex-col gap-4 lg:flex-row">
                <input v-model="form.name" type="text" class="w-full px-5 py-2 text-base h-10 shadow-inner"
                  placeholder="Meta name" />
                <div class="tag-select w-full px-4">
                  <div class="relative">
                    <input v-model="tagSearch" type="text" class="w-full px-4 py-2 text-sm" placeholder="Tags..."
                      @keydown.enter.prevent="handleTagEnter" @input="filterSuggestions" @focus="tagFocused = true"
                      @blur="tagFocused = false" />
                    <ul v-if="suggestions.length && tagFocused"
                      class="suggestions absolute z-10 mt-2 max-h-40 w-full overflow-y-auto border-2 border-black bg-white text-sm">
                      <li v-for="suggestion in suggestions" :key="suggestion"
                        class="cursor-pointer px-4 py-2 hover:bg-neutral-100" @pointerdown.prevent="addTag(suggestion)">
                        {{ truncate(suggestion) }}
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
              <div class="">
                <span v-for="tag in selectedTags" :key="tag"
                  class="inline-flex items-center gap-1 bg-black px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-white overflow-hidden mr-2">
                  <span class="block truncate max-w-[140px]" :title="tag">{{ truncate(tag) }}</span>
                  <button type="button" class="text-white/70" @click="removeTag(tag)">&times;</button>
                </span>
              </div>

              <textarea v-model="form.description" rows="3" class="w-full shadow-inner px-5 py-4 text-base"
                placeholder="Description"></textarea>
            </div>
            <img class="close-add-meta cursor-pointer" :src="closeIcon" @click="onClose">
          </div>
          <button type="button"
            class="add-meta-button group flex items-center justify-center transition hover:bg-black hover:text-white cursor-pointer"
            :class="isCreating ? 'border-1 border-black' : ''"
            :disabled="isCreating && (!isValid || !country || submitting)"
            :style="{ width: isCreating ? 'calc(100% - 48px)' : '100%', margin: isCreating ? '24px' : '0' }"
            @click="onSubmit">

            {{ isCreating ? 'Add the meta' : 'Add a meta' }}
            <span class="ml-3 flex items-center justify-center">
              <svg v-if="!isCreating" width="21" height="20" viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"
                class="transition group-hover:text-white">
                <path
                  d="M10.5 0C4.989 0 0.5 4.489 0.5 10C0.5 15.511 4.989 20 10.5 20C16.011 20 20.5 15.511 20.5 10C20.5 4.489 16.011 0 10.5 0ZM10.5 2C14.9301 2 18.5 5.56988 18.5 10C18.5 14.4301 14.9301 18 10.5 18C6.06988 18 2.5 14.4301 2.5 10C2.5 5.56988 6.06988 2 10.5 2ZM9.5 5V9H5.5V11H9.5V15H11.5V11H15.5V9H11.5V5H9.5Z"
                  fill="currentColor" />
              </svg>
              <svg v-else width="21" height="20" viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"
                class="transition group-hover:text-white">
                <circle cx="10.5" cy="10" r="9" stroke="currentColor" stroke-width="2" fill="none" />
                <path d="M6.5 10.5L9.5 13.5L15 8" stroke="currentColor" stroke-width="2" fill="none"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </transition>


    <p v-if="submitError" class="text-sm text-rose-600">{{ submitError }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useSupabaseClient } from '~/lib/supabase.client'
import { useAuthStore } from '~/stores/auth'


// gestion ouverture
import closeIcon from '@/assets/icons/close.svg'
const onClose = () => {
  isCreating.value = false
}

const props = defineProps<{ country: { code: string; name: string } | null }>()
const emit = defineEmits<{ (e: 'meta-added'): void }>()

const supabase = useSupabaseClient()
const authStore = useAuthStore()

const isCreating = ref(!props.country)
const submitting = ref(false)
const submitError = ref<string | null>(null)
const preview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const pasteInput = ref<HTMLInputElement | null>(null)
const availableTagNames = ref<string[]>([])
const selectedTags = ref<string[]>([])
const tagSearch = ref('')
const suggestions = ref<string[]>([])
const tagFocused = ref(false)

const form = reactive({
  name: '',
  description: '',
  file: null as File | null,
})


const countryCode = computed(() => props.country?.code?.toUpperCase?.())

const isValid = computed(() => !!form.name && !!form.description && !!form.file && !!countryCode.value)

// Move loadTags definition above watcher to fix ReferenceError
const loadTags = async (code: string) => {
  const { data, error } = await supabase
    .from('meta_tags')
    .select('name')
    .eq('country_code', code)
    .order('name')
  if (error) {
    console.error('Error fetching tags', error)
    availableTagNames.value = []
    return
  }
  availableTagNames.value = (data ?? []).map((t) => t.name)
  filterSuggestions()
}

watch(countryCode, async (val) => {
  selectedTags.value = []
  if (!val) {
    availableTagNames.value = []
    isCreating.value = true
    return
  }
  await loadTags(val)
}, { immediate: true })

watch(() => props.country, (val) => {
  if (!val) {
    isCreating.value = true
  }
})

const filterSuggestions = () => {
  const query = tagSearch.value.trim().toLowerCase()
  const base = availableTagNames.value.filter((tag) => !selectedTags.value.includes(tag))
  suggestions.value = query ? base.filter((tag) => tag.toLowerCase().includes(query)) : base.slice(0, 8)
}

const addTag = (tag: string) => {
  const value = tag.trim()
  if (!value || selectedTags.value.includes(value)) return
  selectedTags.value = [...selectedTags.value, value]
  tagSearch.value = ''
  suggestions.value = []
}

const truncate = (s: string, max = 20) => {
  if (!s) return s
  return s.length > max ? s.slice(0, max) + '…' : s
}

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag)
}

const handleTagEnter = async () => {
  const value = tagSearch.value.trim()
  if (!value) return
  await createTag(value)
}

const createTag = async (value: string) => {
  if (!countryCode.value) return
  try {
    const { error } = await supabase
      .from('meta_tags')
      .insert({ name: value, country_code: countryCode.value, created_at: new Date() })
    if (error) throw error
    if (!availableTagNames.value.includes(value)) {
      availableTagNames.value.push(value)
    }
    addTag(value)
  } catch (err) {
    console.error('Error creating tag', err)
  }
}

const triggerFileDialog = () => {
  fileInput.value?.click()
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  setFile(file || null)
}

const onDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  setFile(file || null)
}

const onPaste = (event: ClipboardEvent) => {
  const file = event.clipboardData?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    setFile(file)
  } else {
    const text = event.clipboardData?.getData('text')
    if (text) {
      submitError.value = 'L\'image collée doit être un fichier.'
      window.setTimeout(() => (submitError.value = null), 3000)
    }
  }
}

const revokePreview = () => {
  if (preview.value) {
    URL.revokeObjectURL(preview.value)
    preview.value = null
  }
}

const setFile = (file: File | null) => {
  revokePreview()
  if (!file) {
    form.file = null
    return
  }
  form.file = renameFile(file)
  preview.value = URL.createObjectURL(form.file)
}

const resetImage = () => {
  form.file = null
  revokePreview()
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

const renameFile = (file: File) => {
  const extension = file.name.split('.').pop()
  const newName = `${generateId()}.${extension}`
  return new File([file], newName, { type: file.type })
}

// const uploadImage = async (file: File) => {
//   const test = await supabase.auth.getUser()
//   console.log(test)
//   const path = `public/${file.name}`
//   const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
//   console.log('Upload result:', { error })
//   if (error) throw error
//   const { data } = supabase.storage.from('images').getPublicUrl(path)
//   return data.publicUrl
// }
const uploadImage = async (file: File) => {
  const { data: userData } = await supabase.auth.getUser()
  const { data: sessionData } = await supabase.auth.getSession()

  console.log("USER:", userData.user)
  console.log("SESSION:", sessionData.session)

  const path = `public/${file.name}`
  console.log("PATH:", path)

  const { error } = await supabase.storage
    .from('images')
    .upload(path, file, { upsert: true })

  console.log('Upload result:', { error })

  if (error) throw error

  const { data } = supabase.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

const onSubmit = async () => {
  if (!isCreating.value) {
    if (!ensureAccess()) return
    isCreating.value = true
    return
  }
  if (!isValid.value || !props.country) return
  await submit()
}

const ensureAccess = () => {
  if (!props.country) {
    submitError.value = 'Sélectionne un pays pour ajouter une méta.'
    return false
  }
  if (!authStore.isLogged) {
    authStore.dialogMode = 'login'
    authStore.isLoginOpen = true
    return false
  }
  return true
}

const submit = async () => {
  if (!isValid.value || !countryCode.value || !form.file) return
  submitting.value = true
  submitError.value = null
  try {
    const imageUrl = await uploadImage(form.file)
    const payload = {
      name: form.name,
      description: form.description,
      tags: selectedTags.value,
      image_url: imageUrl,
      country_code: countryCode.value,
      user_id: authStore.user?.id
    }
    console.log('Submitting meta with payload:', payload)
    const { error } = await supabase.from('metas').insert(payload)
    if (error) throw error
    emit('meta-added')
    resetForm()
    isCreating.value = false
  } catch (err: any) {
    console.error(err)
    submitError.value = err?.message ?? 'Impossible de créer la méta'
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.file = null
  revokePreview()
  selectedTags.value = []
  tagSearch.value = ''
  suggestions.value = []
  submitError.value = null
}
</script>

<style scoped>
.add-meta-button {
  /* Add a meta */
  box-sizing: border-box;
  /* Auto layout */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 0px;
  gap: 10px;

  width: 100%;
  height: 56px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;

}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.close-add-meta {
  position: relative;
  top: 0px;
  right: 0px;
  height: 24px;
  width: 24px;
}
</style>
