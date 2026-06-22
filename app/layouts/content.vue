<template>
  <div class="scoutr-app main-content h-full">
    <AppBar />
    <CountryList />
    <div class="content-wrapper">
      <slot />
    </div>
    <LoginDialog v-model:isOpen="authStore.isLoginOpen" />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
</script>
<style scoped>
.main-content {
  padding-top: 70px;
}
.content-wrapper {
  padding-left: 58px;
}
</style>
