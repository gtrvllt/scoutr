<template>
  <section class="country-hero relative isolate">
    <img :src="heroImage" alt="Country landscape" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>

    <div class="relative flex flex-col gap-12 px-6 py-8 text-white sm:px-10 lg:px-16 lg:py-12">
      

      <div class="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
        <div class="space-y-2">
          <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">{{ country.name }}</h1>
          <div class="mt-4 text-sm font-medium text-white/80">
            <p>Capital // <span class="text-white">{{ country.capital || 'Unknown' }}</span></p>
            <p>Language // <span class="text-white">{{ country.language || '—' }}</span></p>
            <p>Code // <span class="text-white">{{ country.code }}</span></p>
            <p>Continent // <span class="text-white">{{ country.continent || '—' }}</span></p>
          </div>
        </div>

        <div class="flex flex-col items-end gap-4 text-right">
          <span class="text-xs uppercase tracking-[0.5em] text-white/70">Status</span>
          <p class="text-2xl font-semibold">
            <span v-if="country.isCovered" class="text-emerald-300">Covered</span>
            <span v-else class="text-amber-200">Needs scouting</span>
          </p>
          
            <img
              v-if="country.code"
              :src="`https://flagsapi.com/${country.code}/flat/64.png`"
              alt="Country flag"
              class="h-8 w-12 object-cover position-relative"
            />
            
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CountryHeaderProps {
  name: string
  code: string
  continent?: string | null
  capital?: string | null
  language?: string | null
  isCovered?: boolean | null
  heroImage?: string | null
}

const props = defineProps<{ country: CountryHeaderProps }>()

const country = computed(() => ({
  ...props.country,
  code: props.country.code?.toUpperCase?.() ?? props.country.code,
}))

const heroImage = computed(() => props.country.heroImage || defaultHero)

const defaultHero =
  'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1400&q=80'

const countryFlag = computed(() => {
  const code = country.value.code
  if (!code || code.length !== 2) return null
  const base = 127397
  return String.fromCodePoint(...code.split('').map((char) => base + char.charCodeAt(0)))
})
</script>

<style scoped>
.country-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 32px;
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
</style>
