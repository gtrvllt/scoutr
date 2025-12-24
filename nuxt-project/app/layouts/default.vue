<template>
    <div class="scoutr-app main-content">
        <AppBar />
        <slot />
        <LoginDialog :isOpen="authStore.isLoginOpen" />
    </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

</script>
<style scoped>
.main-content {
    padding-top: 70px;
    margin-left: 16px;
    margin-right: 16px;
}
</style>