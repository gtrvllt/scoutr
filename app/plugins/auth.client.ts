import { useSupabaseClient } from '~/lib/supabase.client'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()

  // Fires immediately with INITIAL_SESSION (reads session from localStorage)
  // then fires on every subsequent auth change
  supabase.auth.onAuthStateChange((event, session) => {
    authStore.user = session?.user ?? null
    if (event === 'SIGNED_IN') {
      authStore.isLoginOpen = false
    }
  })
})
