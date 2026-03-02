<template>
    <div class="app-bar h-[70px] w-full">
        <div class="flex items-center h-full w-full relative px-4">

            <button @click="toggleMenu" class="p-2 focus:outline-none cursor-pointer z-[70] bg-[#f8f9fa]">
                <img :src="burgerMenuOpen ? closeIcon : burgerIcon" alt="Menu" class="h-6 w-6" />
            </button>

            <div ref="testText"
                class="test-label absolute font-bold transition-all duration-500 ease-out pointer-events-none"
                :class="burgerMenuOpen ? 'translate-x-[60px] opacity-100' : 'translate-x-0 opacity-0'">
                <NuxtLink to="/newsletter">Newsletter</NuxtLink>
                <NuxtLink to="/about-us">About us</NuxtLink>
                <NuxtLink to="/donate">Donate</NuxtLink>
                <NuxtLink to="/terms-of-use">Terms of use</NuxtLink>
            </div>

            <div ref="logoContainer" class="logo-container flex items-center z-50 ml-4 bg-[#f8f9fa]">
                <NuxtLink to="/" class="inline-flex items-center">
                    <img src="/logo.svg" alt="Logo" class="h-10 w-auto" />
                    <!-- <span class="ml-2">Scoutr</span> -->
                </NuxtLink>
            </div>

            <div ref="actionsWrap"
                class="flex-1 flex items-center justify-center gap-8 transition-opacity duration-300">
                <NuxtLink to="/metas">All metas</NuxtLink>
                <NuxtLink to="/quizz">Quizz</NuxtLink>
            </div>

            <div ref="userMenuWrap" class="z-[70]">
                <UserMenu />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import burgerIcon from '@/assets/icons/burger.svg'
import closeIcon from '@/assets/icons/close.svg'

const burgerMenuOpen = ref(false)
const logoContainer = ref<HTMLElement | null>(null)
const userMenuWrap = ref<HTMLElement | null>(null)
const actionsWrap = ref<HTMLElement | null>(null)
const leftBadge = ref<HTMLElement | null>(null)
const testText = ref<HTMLElement | null>(null)

const toggleMenu = async () => {
    burgerMenuOpen.value = !burgerMenuOpen.value
    await nextTick()

    if (burgerMenuOpen.value && logoContainer.value && userMenuWrap.value) {
        const logoRect = logoContainer.value.getBoundingClientRect()
        const userRect = userMenuWrap.value.getBoundingClientRect()

        // Calcul pour coller à gauche du bouton user (avec 16px de marge)
        const desiredMargin = 16
        const dx = userRect.left - logoRect.right - desiredMargin

        logoContainer.value.style.transform = `translateX(${dx}px)`

        if (leftBadge.value) {
            leftBadge.value.style.opacity = '1'
            leftBadge.value.style.pointerEvents = 'auto'
        }
        if (actionsWrap.value) {
            actionsWrap.value.style.opacity = '0'
            actionsWrap.value.style.pointerEvents = 'none'
        }
    } else if (logoContainer.value) {
        // Reset
        logoContainer.value.style.transform = ''
        if (leftBadge.value) leftBadge.value.style.opacity = '0'
        if (actionsWrap.value) {
            actionsWrap.value.style.opacity = '1'
            actionsWrap.value.style.pointerEvents = 'auto'
        }
    }
}
</script>

<style scoped>
.app-bar {
    font-size: 25px;
    color: black;
    font-weight: 600;
    background-color: #f8f9fa;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    border-bottom: 1px solid #e5e7eb;
}

.logo-container {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    /* Effet ressort */
    will-change: transform;
}

.test-label {
    left: 20px;
    /* Position de départ sous le bouton burger */
    font-size: 20px;
    z-index: 65;
}

.menu-actions {
    transition: opacity 0.4s ease;
}
</style>