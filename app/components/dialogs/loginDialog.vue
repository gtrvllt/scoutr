<template>
    <UModal v-model:open="open" :modal="true" aria-labelledby="login-dialog-title">
        <template #header>
            <div class="flex items-center justify-between w-full">
                <span id="login-dialog-title" class="sr-only">Se connecter</span>
                <h2 class="text-2xl font-bold">Se connecter</h2>
                <button @click="onclose" class="p-1 hover:bg-black hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </template>

        <template #body>
            <div class="flex flex-col items-center gap-6 py-6">
                <button
                    @click="onGoogleLogin"
                    class="flex items-center gap-3 px-6 py-3 border border-black font-semibold text-base hover:bg-black hover:text-white transition-colors w-full justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5 flex-shrink-0">
                        <path fill="currentColor" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.5-4z"/>
                    </svg>
                    Continuer avec Google
                </button>
                <div v-if="authStore.error" class="text-red-600 text-sm text-center">{{ authStore.error }}</div>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'update:isOpen', value: boolean): void }>()

const authStore = useAuthStore()

const open = computed({
    get: () => props.isOpen,
    set: (v: boolean) => emit('update:isOpen', v),
})

const onclose = () => {
    authStore.isLoginOpen = false
}

function onGoogleLogin() {
    authStore.loginWithGoogle()
}
</script>
