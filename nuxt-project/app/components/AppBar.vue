<template>
    <nav class="app-bar h-[70px] w-full flex items-center px-4 relative overflow-hidden">

        <button @click="burgerMenuOpen = !burgerMenuOpen"
            class="z-[70] p-2  relative cursor-pointer focus:outline-none">
            <img :src="burgerMenuOpen ? closeIcon : burgerIcon" alt="Menu" class="h-6 w-6" />
        </button>
        <div class="flex items-center h-full z-50  flex-1 transition-all duration-500">

            <div class="menu-actions flex items-center justify-center gap-6 overflow-hidden transition-all duration-500 ease-in-out h-full "
                :class="burgerMenuOpen ? 'flex-1 opacity-100 px-8' : 'w-0 opacity-1 px-0'">
                <NuxtLink to="/newsletter"
                    class="text-base whitespace-nowrap h-full items-center flex hover:bg-black hover:text-white px-4">
                    Newsletter</NuxtLink>
                <NuxtLink to="/about-us"
                    class="text-base whitespace-nowrap h-full items-center flex hover:bg-black hover:text-white px-4">
                    About us</NuxtLink>
                <NuxtLink to="/donate"
                    class="text-base whitespace-nowrap h-full items-center flex hover:bg-black hover:text-white px-4">
                    Donate</NuxtLink>
                <NuxtLink to="/terms-of-use"
                    class="text-base whitespace-nowrap h-full items-center flex hover:bg-black hover:text-white px-4">
                    Terms of use</NuxtLink>
            </div>

            <NuxtLink to="/" class="scoutr-logo inline-flex items-center transition-all duration-500 "
                :class="burgerMenuOpen ? 'ml-0 pr-4' : 'ml-4'">
                <img src="/logo.svg" alt="Logo" class="h-10 w-auto" />
            </NuxtLink>
        </div>

        <div class="main-actions absolute inset-0 flex items-center justify-center z-10 pointer-events-none" :style="{zIndex: burgerMenuOpen ? 0 : 100}">
            <NuxtLink
                to="/metas"
                class="pointer-events-auto px-8 py-1 transition-colors h-full flex items-center"
                :class="route.path === '/metas' ? 'bg-black text-white' : ''"
            >All metas</NuxtLink>
            <NuxtLink
                to="/quizz"
                class="pointer-events-auto px-8 py-1 transition-colors h-full flex items-center"
                :class="route.path === '/quizz' ? 'bg-black text-white' : ''"
            >Quizz</NuxtLink>
        </div>

        <div class="z-[70]  pl-4 h-full flex items-center">
            <UserMenu />
        </div>

    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import burgerIcon from '@/assets/icons/burger.svg'
import closeIcon from '@/assets/icons/close.svg'

const burgerMenuOpen = ref(false)
const route = useRoute()
</script>

<style scoped>
.app-bar {
    z-index: 100;
    background-color: white !important;
    font-size: 25px;
    font-weight: 600;
    background-color: transparent;
    position: fixed;
    top: 0;
    border-bottom: 1px solid #e5e7eb;
}

.menu-actions {
    background: white;
}

.scoutr-logo {
    font-size: 25px;
    font-weight: 600;
    color: #000;
}

/* On s'assure que la transition est fluide pour le changement de largeur */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>