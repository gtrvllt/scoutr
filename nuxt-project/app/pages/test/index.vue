<template>
    <div class="test">
        <UButton label="Open" color="neutral" variant="subtle" @click="isOpen = !isOpen" />
        <UModal v-model:open="isOpen">

            <template #content>
                pouler
            </template>
        </UModal>

    </div>
</template>
<script setup lang="ts">
let isOpen = ref(false)

</script>