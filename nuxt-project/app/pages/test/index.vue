<template>
    <div class="test">
        <UButton label="Open" color="neutral" variant="subtle" @click="isOpen = !isOpen" />
        <UModal v-model:open="isOpen">

            <template #content>
                pouler
            </template>
        </UModal>
        <UModal :modal="false" title="Modal interactive">
            <UButton label="Open false" color="neutral" variant="subtle" />

            <template #body>
                <Placeholder class="h-48" />
            </template>
        </UModal>
        <UModal :modal="true" title="Modal interactive">
            <UButton label="Open true" color="neutral" variant="subtle" />

            <template #body>
                <Placeholder class="h-48" />
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
let isOpen = ref(false)

</script>