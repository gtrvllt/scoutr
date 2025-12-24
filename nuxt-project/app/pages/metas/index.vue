<template>
    <div class="all-metas-page">
        <h1 class="text-3xl font-bold mb-6">All Metas</h1>

        <div v-if="pending" class="text-gray-500">Loading metas...</div>
        <div v-else-if="error" class="text-red-600">{{ error }}</div>
        <div v-else-if="!metas?.length" class="text-gray-500">No metas found.</div>
        <!-- <ul v-else class="space-y-2">
            <li v-for="meta in metas" :key="meta.id" class="border p-3 rounded">
                <div class="font-semibold">{{ meta.title || meta.name || 'Meta' }}</div>
                <div class="text-sm text-gray-600">{{ meta.description || '' }}</div>
            </li>
        </ul> -->

        <MetaItem v-for="meta in metas" :key="meta.id" :meta="meta" />
        <!-- </ul> -->
    </div>
</template>
<script setup lang="ts">
import { useSupabaseClient } from '~/lib/supabase.client'

const supabase = useSupabaseClient()

const { data: metas, pending, error } = await useAsyncData('metas', async () => {
    const { data, error } = await supabase
        .from('metas')
        .select('*')
        .order('id', { ascending: false })

    if (error) throw error
    return data ?? []
})
</script>
<style scoped></style>