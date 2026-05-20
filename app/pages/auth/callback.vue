<template>
  <div class="flex items-center justify-center h-screen text-gray-500">
    Connexion en cours...
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '~/lib/supabase.client'

const supabase = useSupabaseClient()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code as string | undefined
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }
  router.replace('/')
})
</script>
