<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage class="h-full"/>
    </NuxtLayout>
    <NuxtRouteAnnouncer />
  </UApp>
</template>
<script setup lang="ts">
const colorMode = useColorMode()
colorMode.preference = 'light'
</script>