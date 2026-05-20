<template>
  <section class="space-y-10 pb-16">
    <div v-if="pending" class="text-sm text-neutral-500">Chargement du pays…</div>
    <p v-else-if="error" class="text-sm text-rose-600">{{ error.data?.statusMessage || error.message }}</p>
    <div v-else-if="country" class="space-y-10">
      <CountryHeader :country="country" />
      <div class="country-content">
        <MetaList :country="{ code: country.code, name: country.name }" />
      </div>
    </div>
    <p v-else class="text-sm text-neutral-500">Pays introuvable.</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CountryHeader from '@/components/country/CountryHeader.vue'
import MetaList from '@/components/meta/MetaList.vue'
import { useSupabaseClient } from '~/lib/supabase.client'
import { createError, useAsyncData, useRoute } from '#imports'

const route = useRoute()
const supabase = useSupabaseClient()

const codeParam = computed(() => String(route.params.code || ''))
const normalizedCode = computed(() => codeParam.value.toUpperCase())

const { data: country, pending, error } = await useAsyncData(
  () => `country-${normalizedCode.value}`,
  async () => {
    if (!normalizedCode.value) {
      throw createError({ statusCode: 404, statusMessage: 'Pays introuvable' })
    }
    const { data, error } = await supabase
      .from('countries')
      .select('code,name,continent,isCovered,capital')
      .eq('code', normalizedCode.value)
      .single()

    if (error || !data) {
      throw createError({ statusCode: 404, statusMessage: 'Pays introuvable' })
    }

    return data
  },
  { watch: [normalizedCode] }
)
</script>
<style scoped>
.country-content {
  padding-left: 120px;
  padding-right: 120px; 
  padding-bottom: 60px; 
}
</style>