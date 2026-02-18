<template>
    <div class="app-bar h-[70px] w-full">
        <div class="flex items-center h-full w-full justify-between gap-4">
            <button @click="toggleMenu" class="p-2 focus:outline-none cursor-pointer">
                <img :src="burgerMenuOpen ? closeIcon : burgerIcon" alt="Menu" class="h-6 w-6" />
            </button>
            
            <NuxtLink to="/" class="inline-flex items-center">
                <img src="/logo.svg" alt="Logo" class="h-10 w-auto" />
            </NuxtLink>
            <div class="flex-1 flex items-center justify-center gap-4">
                <NuxtLink to="/metas">All metas</NuxtLink>
                <!-- <NuxtLink to="/addmeta">Add meta</NuxtLink> -->
            </div>
            <UColorModeSwitch color="neutral"/>
            <UserMenu />
        </div>
    </div>
</template>

<script setup lang="ts">
///// burger menu
import burgerIcon from '@/assets/icons/burger.svg'
import closeIcon from '@/assets/icons/close.svg'

const burgerMenuOpen = ref(false)

const toggleMenu = () => {
    // Logic to toggle side menu
    burgerMenuOpen.value = !burgerMenuOpen.value
    console.log('Menu toggled', burgerMenuOpen.value)
}
///// logo
///// liens de l'appbar
///// bouton user


</script>

<style scoped>
.app-bar {
    font-size: 20px;
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
}
</style>