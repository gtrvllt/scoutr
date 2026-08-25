<template>
  <div class="all-metas-page">

    <!-- Titre + bouton toggle -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">All Metas</h1>
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
          <input type="checkbox" v-model="onlyMyMetas" class="w-4 h-4 accent-black" />
          My metas only
        </label>
        <button class="new-meta-btn" :class="{ 'bg-black text-white': showForm }" @click="showForm = !showForm">
        <span v-if="!showForm">New Meta <span class="text-xl leading-none">+</span></span>
        <span v-else class="flex items-center gap-2">Fermer <UIcon name="i-lucide-chevron-up" class="size-4" /></span>
      </button>
      </div>
    </div>

    <!-- Formulaire -->
    <Transition
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div v-if="showForm" class="add-meta-wrapper">

        <!-- Sélecteur de pays -->
        <div class="relative mb-6 max-w-sm">
          <label class="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Pays</label>
          <div class="relative">
            <input
              v-model="countrySearch"
              type="text"
              placeholder="Rechercher un pays..."
              class="w-full border-2 border-black px-4 py-2 text-sm focus:outline-none bg-white"
              :class="selectedCountry ? 'pl-8 pr-10' : 'pr-10'"
              @focus="selectorOpen = true"
              @blur="onBlur"
              @input="selectedCountry = null"
            />
            <div v-if="selectedCountry" class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span class="text-lg pointer-events-none">{{ countryFlag(selectedCountry.code) }}</span>
            </div>
            <button v-if="selectedCountry" type="button" class="absolute left-3 top-1/2 -translate-y-1/2 text-black text-3xl leading-none" @mousedown.prevent="clearCountry">&times;</button>
            <span v-else-if="!countrySearch" class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none text-xs">▾</span>
          </div>
          <ul v-if="selectorOpen && filteredCountries.length"
            class="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border-2 border-black bg-white text-sm">
            <li v-for="c in filteredCountries" :key="c.code"
              class="cursor-pointer px-4 py-2 hover:bg-neutral-100 flex items-center justify-between"
              @pointerdown.prevent="selectCountry(c)">
              <span>{{ c.name }}</span>
              <span class="text-base">{{ countryFlag(c.code) }}</span>
            </li>
          </ul>
        </div>

        <div class="border-t border-neutral-200 mb-6" />
        <div class="relative">
          <AddMeta :country="selectedCountry ?? { code: '', name: '' }" :open="true" :hide-close="true" :no-padding="true" @meta-added="onMetaAdded" />
          <Transition name="fade-overlay">
            <div v-if="!selectedCountry" class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="absolute inset-0 backdrop-blur-sm bg-white/40" />
              <span class="relative z-10 text-sm font-semibold uppercase tracking-widest text-neutral-500">Select a country first</span>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <MetaList :country="{ code: null }" :only-my-metas="onlyMyMetas" />

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSupabaseClient } from '~/lib/supabase.client'
import AddMeta from '@/components/meta/AddMeta.vue'
import MetaList from '@/components/meta/MetaList.vue'

const supabase = useSupabaseClient()

const showForm = ref(false)
const onlyMyMetas = ref(true)
const countrySearch = ref('')
const selectorOpen = ref(false)
const selectedCountry = ref<{ code: string; name: string } | null>(null)
const allCountries = ref<{ code: string; name: string }[]>([])

onMounted(async () => {
  const { data } = await supabase
    .from('countries')
    .select('code,name')
    .order('name')
  allCountries.value = data ?? []
})

const filteredCountries = computed(() => {
  const q = countrySearch.value.trim().toLowerCase()
  return q ? allCountries.value.filter(c => c.name.toLowerCase().includes(q)) : allCountries.value
})

const selectCountry = (c: { code: string; name: string }) => {
  selectedCountry.value = { code: c.code, name: c.name }
  countrySearch.value = c.name
  selectorOpen.value = false
}

const onBlur = () => setTimeout(() => { selectorOpen.value = false }, 150)

const clearCountry = () => {
  selectedCountry.value = null
  countrySearch.value = ''
  selectorOpen.value = true
}

const countryFlag = (code: string) =>
  code.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)))

const onMetaAdded = () => {
  showForm.value = false
  selectedCountry.value = null
  countrySearch.value = ''
}

const onEnter = (el: Element) => {
  const e = el as HTMLElement
  e.style.overflow = 'hidden'
  e.style.height = '0'
  e.style.opacity = '0'
  requestAnimationFrame(() => {
    e.style.transition = 'height 0.35s ease, opacity 0.3s ease'
    e.style.height = e.scrollHeight + 'px'
    e.style.opacity = '1'
  })
}

const onAfterEnter = (el: Element) => {
  const e = el as HTMLElement
  e.style.height = ''
  e.style.overflow = ''
  e.style.transition = ''
}

const onLeave = (el: Element) => {
  const e = el as HTMLElement
  e.style.overflow = 'hidden'
  e.style.height = e.scrollHeight + 'px'
  e.style.opacity = '1'
  requestAnimationFrame(() => {
    e.style.transition = 'height 0.35s ease, opacity 0.25s ease'
    e.style.height = '0'
    e.style.opacity = '0'
  })
}
</script>

<style scoped>
.all-metas-page {
  padding: 2rem;
}

.new-meta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 2px solid black;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.new-meta-btn:hover {
  background: black;
  color: white;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
</style>
