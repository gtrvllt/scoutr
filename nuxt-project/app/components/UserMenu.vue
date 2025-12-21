<template>
    <div class="user-menu h-full ml-auto">
        <!-- <UDropdownMenu :items="items" :content="{ align: 'end', side: 'bottom' }" :ui="{ content: 'w-48 bg-white' }"> -->
        <UDropdownMenu :items="items" :content="{ align: 'end', side: 'bottom', sideOffset: 0 }"
            :ui="{ content: 'bg-white p-[12px] border-2 border-black' }">
            <UButton color="neutral" variant="outline" class="h-full cursor-pointer px-3" aria-label="Ouvrir le menu utilisateur">
                <template #leading>
                    <UIcon name="i-lucide-user" class="h-6 w-6" />
                </template>
            </UButton>
        </UDropdownMenu>
    </div>
</template>
<script setup lang="ts">
///// affichage du bouton

///// gestion du menu déroulant
import type { DropdownMenuItem } from '@nuxt/ui'

const items = ref<DropdownMenuItem[]>([
    {
        label: 'Connexion',
        icon: 'i-lucide-user',
        onSelect: () => {console.log('connexion')}
    },
    {
        label: 'Billing',
        icon: 'i-lucide-credit-card'
    },
    {
        label: 'Settings',
        icon: 'i-lucide-cog'
    }
])

///// gestion de la déconnexion
</script>
<style scoped>
.user-menu {
    height: 100% !important;
}
</style>