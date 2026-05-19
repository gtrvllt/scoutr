import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import { useSupabaseClient } from '~/lib/supabase.client'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoginOpen = ref(false)
  const isLogged = computed(() => !!user.value)

  async function loginWithGoogle() {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (err) error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  async function fetchUser() {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
  }

  return { user, loading, error, loginWithGoogle, logout, fetchUser, isLoginOpen, isLogged }
})
