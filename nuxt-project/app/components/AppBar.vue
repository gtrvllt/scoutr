<template>
    <div class="app-bar h-[70px] w-full">
        <div class="flex items-center h-full w-full justify-between gap-4">
            <button @click="toggleMenu" class="p-2 focus:outline-none cursor-pointer burger-btn">
                <img :src="burgerMenuOpen ? closeIcon : burgerIcon" alt="Menu" class="h-6 w-6" />
            </button>
            <div ref="logoContainer" class="logo-container flex items-center">
                <!-- Left div that appears and moves with the logo (hidden behind burger when closed) -->
                <div ref="leftBadge" class="menu-actions mr-2 opacity-0 pointer-events-none">
                    <NuxtLink to="/" :class="burgerMenuOpen ? 'scoutr-logo-open' : 'scoutr-logo'"
                        class="inline-flex items-center">
                        CGU
                    </NuxtLink>
                    <NuxtLink to="/" :class="burgerMenuOpen ? 'scoutr-logo-open' : 'scoutr-logo'"
                        class="inline-flex items-center">
                        ppouler
                    </NuxtLink>
                </div>
                <NuxtLink to="/" :class="burgerMenuOpen ? 'scoutr-logo-open' : 'scoutr-logo'"
                    class="inline-flex items-center">
                    <img src="/logo.svg" alt="Logo" class="h-10 w-auto" />
                </NuxtLink>
            </div>
            <div ref="actionsWrap" class="main-appbar-actions flex-1 flex items-center justify-center gap-4">
                <NuxtLink to="/metas">All metas</NuxtLink>
                <NuxtLink to="/quizz" class="ml-6">Quizz</NuxtLink>
                <!-- <NuxtLink to="/addmeta">Add meta</NuxtLink> -->
            </div>
            <!-- <UColorModeSwitch color="neutral"/> -->
            <div ref="userMenuWrap">
                <UserMenu />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
///// burger menu
import burgerIcon from '@/assets/icons/burger.svg'
import closeIcon from '@/assets/icons/close.svg'

import { ref, nextTick } from 'vue'

const burgerMenuOpen = ref(false)

// refs for DOM elements
const logoContainer = ref<HTMLElement | null>(null)
const userMenuWrap = ref<HTMLElement | null>(null)
const actionsWrap = ref<HTMLElement | null>(null)
const leftBadge = ref<HTMLElement | null>(null)

const toggleMenu = async () => {
    const opening = !burgerMenuOpen.value
    burgerMenuOpen.value = opening

    // wait DOM update
    await nextTick()

    // if opening, slide logo to the right so it overlays actions and sits left of user menu
    if (opening && logoContainer.value && userMenuWrap.value) {
        const logoRect = logoContainer.value.getBoundingClientRect()
        const userRect = userMenuWrap.value.getBoundingClientRect()
        const desiredMargin = 8 // px gap between logo and user menu
        // compute dx so logo's right edge ends desiredMargin left of user menu's left
        const dx = userRect.left - (logoRect.left + logoRect.width) - desiredMargin
        // apply transform
        logoContainer.value.style.transform = `translateX(${dx}px)`
        logoContainer.value.style.zIndex = '60'
        // show left badge
        if (leftBadge.value) {
            leftBadge.value.style.opacity = '1'
            leftBadge.value.style.pointerEvents = 'auto'
        }
        // fade actions while sliding
        if (actionsWrap.value) {
            actionsWrap.value.classList.add('opacity-0', 'pointer-events-none')
        }
    } else if (!opening && logoContainer.value) {
        // closing: reset transform and show actions
        logoContainer.value.style.transform = ''
        logoContainer.value.style.zIndex = ''
        // hide left badge
        if (leftBadge.value) {
            leftBadge.value.style.opacity = '0'
            leftBadge.value.style.pointerEvents = 'none'
        }
        if (actionsWrap.value) {
            actionsWrap.value.classList.remove('opacity-0', 'pointer-events-none')
        }
    }

    console.log('Menu toggled', burgerMenuOpen.value)
}
///// logo
///// liens de l'appbar
///// bouton user


</script>

<style scoped>
.app-bar {
    font-size: 25px;
    color: black;
    font-weight: 600;
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

/* logo */
.scoutr-logo {
    display: flex;
    position: relative;
    /* right: 0px; */
    left: 0px;
    /* spring-like */
}

.logo-container {
    transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
    position: relative; /* allow menu-actions absolute positioning relative to the container */
}

.scoutr-logo-open {
    right: 0px;
}

.menu-actions {
    transition: opacity 0.35s ease-in-out, transform 0.45s ease-in-out;
    /* place behind the burger by default (will be hidden) */
    position: absolute;
    left: -44px; /* adjust to sit under the burger button */
    top: 50%;
    /* transform: translateY(-50%); */
    z-index: 10;
    /* display: none; */
}

.burger-btn {
    position: relative;
    z-index: 70;
}
</style>