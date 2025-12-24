<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const code = route.params.code as string
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-semibold">Country: {{ $route.params.code }}</h1>
    <p class="mt-2">This dynamic country page renders for code: {{ $route.params.code }}</p>
  </div>
</template>
