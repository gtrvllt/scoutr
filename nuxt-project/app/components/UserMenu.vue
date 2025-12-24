<template>
    <div class="user-menu h-full ml-auto flex content-center">
        <UDropdownMenu v-if="authStore.isLogged" :items="loggedItems"
            :content="{ align: 'end', side: 'bottom', sideOffset: 0 }"
            :ui="{ content: 'bg-white p-[12px] border-2 border-black' }">
            <UButton color="neutral" variant="ghost" class="h-full cursor-pointer px-3"
                aria-label="Ouvrir le menu utilisateur">
                <template #leading>
                    <UIcon name="i-lucide-user" class="h-6 w-6" />
                </template>
            </UButton>
        </UDropdownMenu>

        <div v-else class="content-center">
            <UButton variant="ghost" class="cursor-pointer" color="neutral" @click="openLogin">Connexion</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const openLogin = () => {
    authStore.dialogMode = 'login'
    authStore.isLoginOpen = true
}

const openSignup = () => {
    authStore.dialogMode = 'signup'
    authStore.isLoginOpen = true
}

const openReset = () => {
    authStore.dialogMode = 'reset'
    authStore.isLoginOpen = true
}

const loggedItems = ref<DropdownMenuItem[]>([
    {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        onSelect: () => { authStore.logout() }
    }
])

const items = ref<DropdownMenuItem[]>([
    { label: 'Connexion', icon: 'i-lucide-user', onSelect: openLogin },
    { label: 'Créer un compte', icon: 'i-lucide-user-plus', onSelect: openSignup },
    { label: 'Mot de passe oublié', icon: 'i-lucide-key', onSelect: openReset }
])
</script>

<style scoped>
.user-menu {
    height: 100% !important;
}
</style>