import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSupabaseClient } from '~/lib/supabase.client'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const user = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Modal control and mode (login | signup | reset)
  const isLoginOpen = ref(false)
  const dialogMode = ref<'login' | 'signup' | 'reset'>('login')

  const isLogged = computed(() => !!user.value)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        error.value = err.message
        user.value = null
      } else {
        user.value = data.user
        // redirect to / if not already there
        if (process.client) {
          try {
            const router = useRouter()
            if (router.currentRoute.value.path !== '/') router.push('/')
          } catch (_) {}
        }
        isLoginOpen.value = false
      }
    } finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signUp({ email, password })
      if (err) {
        error.value = err.message
        user.value = null
      } else {
        // supabase may not immediately return user (email confirm flows), but set if present
        user.value = (data as any)?.user ?? null
        // After signup we attempt to redirect if logged
        if (user.value && process.client) {
          try {
            const router = useRouter()
            if (router.currentRoute.value.path !== '/') router.push('/')
          } catch (_) {}
        }
        isLoginOpen.value = false
      }
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(email: string) {
    loading.value = true
    error.value = null
    try {
      // Supabase v2 helper to send reset password email
      // If this method is not available in your version, adapt accordingly.
      const { data, error: err } = await supabase.auth.resetPasswordForEmail(email)
      if (err) {
        error.value = err.message
      }
      return { data, error: err }
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      return { data: null, error: e }
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle() {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (err) error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  // Optionnel : récupérer l'utilisateur au chargement
  async function fetchUser() {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
  }

  // Keep session in sync if Supabase notifies us
  if (process.client) {
    try {
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = (session as any)?.user ?? null
      })
    } catch (_) {}
  }

  return { user, loading, error, login, signUp, resetPassword, loginWithGoogle, logout, fetchUser, isLoginOpen, dialogMode, isLogged }
})