<template>
    <div class="app-bar h-[70px] w-full">
        <div class="flex items-center h-full w-full justify-between gap-4">
            <NuxtLink to="/" class="inline-flex items-center">
                <img src="/logo.svg" alt="Logo" class="h-10 w-auto" />
            </NuxtLink>
            <div class="flex-1 flex items-center justify-center gap-4">
                <NuxtLink to="/metas">All metas</NuxtLink>
                <!-- <NuxtLink to="/addmeta">Add meta</NuxtLink> -->
            </div>
            <UserMenu />
        </div>
    </div>
</template>

<script setup lang="ts">
///// burger menu
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