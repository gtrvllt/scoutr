<template>
  <button
    @click="toggleMenu"
    class="relative p-2 w-8 h-8 cursor-pointer focus:outline-none"
  >
    <!-- BURGER ICON -->
    <img
      v-if="!burgerMenuOpen"
      :src="burgerIcon"
      alt="Menu"
      class="absolute inset-0 w-6 h-6 m-auto"
      v-motion
      :initial="{ opacity: 0, rotate: -90 }"
      :enter="{ opacity: 1, rotate: 0 }"
      :leave="{ opacity: 0, rotate: 90 }"
      :transition="{ duration: 0.3, easing: 'ease-in-out' }"
    />

    <!-- CLOSE ICON -->
    <img
      v-else
      :src="closeIcon"
      alt="Close"
      class="absolute inset-0 w-6 h-6 m-auto"
      v-motion
      :initial="{ opacity: 0, rotate: -90 }"
      :enter="{ opacity: 1, rotate: 0 }"
      :leave="{ opacity: 0, rotate: 90 }"
      :transition="{ duration: 0.3, easing: 'ease-in-out' }"
    />
  </button>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const burgerMenuOpen = ref(false)

const toggleMenu = () => {
  burgerMenuOpen.value = !burgerMenuOpen.value
}

const burgerIcon = '@/assets/icons/burger.svg'
const closeIcon = '@/assets/icons/close.svg'
</script>