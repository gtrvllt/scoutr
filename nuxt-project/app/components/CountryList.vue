<template>
  <div class="country-list-drawer">
    <div ref="panelRef" class="country-list-panel" :class="{ open: isCountryListOpen, closed: !isCountryListOpen }"
      @click="handlePanelClick">
      <div v-if="isCountryListOpen" class="country-list-content" @click.stop>
        <div class="country-list-search">
          <label :for="searchInputId" class="sr-only">search</label>
          <div class="country-list-search-field">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
              <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" />
            </svg>
            <input :id="searchInputId" v-model="search" type="search" autocomplete="off" placeholder="search"
              class="country-list-search-input" />
          </div>
        </div>
        <ul class="country-list-items">
          <li v-for="country in filteredCountries" :key="country.code" class="country-list-item">
            <NuxtLink :to="`/country/${country.code.toLowerCase()}`" class="country-link p-4" @click="closeCountryList">
              <span class="country-continent">{{ country.continent }}</span>
              <div class="flex w-full">
                <span class="country-name pl-3">{{ country.name }}</span>
                <img :src="`https://flagsapi.com/${country.code}/flat/64.png`" style="height: 24px;"
                  class="country-flag" />
              </div>
            </NuxtLink>
          </li>
          <li v-if="filteredCountries.length === 0" class="country-list-empty">
            Aucun pays ne correspond à votre recherche.
          </li>
        </ul>
      </div>
    </div>
    <button ref="toggleButtonRef" type="button" class="country-list-toggle" :class="{ open: isCountryListOpen }"
      @click.stop="toggleCountryList" aria-label="Basculer la liste des pays" :aria-expanded="isCountryListOpen">
      <img :src="toggleIcon" alt="" class="country-list-toggle-icon white-icon" />
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import toggleIcon from '../assets/icons/toggle.svg?url'
import { countries, type CountryEntry } from '~/data/countries'
import { useCountryListStore } from '~/stores/countryList'

const searchInputId = 'country-search'
const countryListStore = useCountryListStore()
const isCountryListOpen = computed(() => countryListStore.isCountryListOpen)
const search = ref('')
const panelRef = ref<HTMLElement | null>(null)
const toggleButtonRef = ref<HTMLElement | null>(null)

const filteredCountries = computed<CountryEntry[]>(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) {
    return countries
  }
  return countries.filter((country) => country.name.toLowerCase().includes(term) || country.continent?.toLowerCase().includes(term))
})

watch(isCountryListOpen, (open) => {
  if (!open) {
    search.value = ''
  }
})

const handleDocumentPointerDown = (event: PointerEvent) => {
  if (!isCountryListOpen.value) return
  if (!(event.target instanceof Node)) return
  if (panelRef.value?.contains(event.target)) return
  if (toggleButtonRef.value?.contains(event.target)) return
  closeCountryList()
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})

const toggleCountryList = () => countryListStore.toggle()
const closeCountryList = () => countryListStore.setIsCountryListOpen(false)
const handlePanelClick = () => {
  if (!isCountryListOpen.value) {
    toggleCountryList()
  }
}
</script>
<style scoped>
.country-list-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 45;
  display: flex;
  align-items: stretch;
  pointer-events: none;
  --drawer-open-width: 280px;
  --drawer-closed-width: 0px;
}

.country-list-panel {
  pointer-events: all;
  width: var(--drawer-open-width);
  max-height: 100vh;
  background: rgba(7, 11, 18, 0.98);
  backdrop-filter: blur(18px);
  box-shadow: 6px 0 30px rgba(0, 0, 0, 0.45);
  transition: width 260ms ease, box-shadow 260ms ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.country-list-panel.closed {
  width: var(--drawer-closed-width);
}

.country-list-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
}

.country-list-search {
  padding: 1.25rem 1.5rem 0.75rem;
}

.country-list-search-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.35rem 0rem;
  color: #656262;
}

.country-list-search-field svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  opacity: 0.7;
}

.country-list-search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: inherit;
  outline: none;
  font-size: 0.95rem;
}

.country-list-items {
  margin: 0;
  list-style: none;
  padding: 0 0 1.5rem 0;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.country-list-item {
  /* padding: 0 1.5rem; */
  width: 100%;
}

.country-link:hover {
  background-color: black !important;
  color: white;
}

.country-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: 0.35rem 1.75rem;
  transition: background 200ms ease;
}

.country-link:hover {
  background: rgba(255, 255, 255, 0.08);
}

.country-link:hover {
  .country-continent {
    opacity: 0.8;
    color: white;

  }
}

.country-name {
  font-size: 0.95rem;
  font-weight: 500;
}

.country-continent {
  font-size: 0.75rem;
  color: black;
  opacity: 0.6;
}

.country-list-empty {
  margin: 0 1.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.country-list-toggle {
  pointer-events: all;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  /* left: calc(var(--drawer-closed-width) - 2px); */
  background: black;
  border: none;
  width: 58px;
  height: 111px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 260ms ease, background 220ms ease;
}

.country-list-toggle-icon.white-icon {
  filter: brightness(0) invert(1);
  /* ou plus court : */
  /* filter: invert(1); */
}

.country-list-toggle.open {
  left: calc(var(--drawer-open-width));
}

.country-list-toggle-icon {
  width: 18px;
  height: 32px;
  object-fit: contain;
  filter: invert(1) sepia(0) saturate(50) brightness(1.5);
  transition: transform 220ms ease;
}

.country-list-toggle.open .country-list-toggle-icon {
  transform: rotate(180deg);
}

.country-flag {
  position: relative;
  margin-left: 0.px;
  position: relative;
  margin-left: auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
