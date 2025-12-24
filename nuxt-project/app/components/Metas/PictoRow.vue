<template>
    <div class="flex items-center gap-2">
        <button v-for="(action, index) in actions" :key="action?.label ?? index" type="button"
            :aria-label="action?.label ?? ''"
            :disabled="action?.disabled ?? false"
            :aria-disabled="action?.disabled ?? false"
            @click.stop="!action?.disabled && action?.action?.()"
            class="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-75 cursor-pointer"
            @mouseenter="!action?.disabled && (hoveredIndex = index)" @mouseleave="!action?.disabled && (hoveredIndex = null)">
            <img :src="getIcon(action, index)" alt="" class="h-full w-full" />
        </button>
    </div>
</template>
<script setup lang="ts">


type ActionLike = {
    label?: string | null
    action?: (() => void) | null
    icon?: string | null
    hoverIcon?: string | null
    isHovered?: boolean | null
    disabled?: boolean | null
}

const props = withDefaults(defineProps<{ actions?: ActionLike[] }>(), {
    actions: () => []
})

const hoveredIndex = ref<number | null>(null)

const getIcon = (action?: ActionLike, index?: number) => {
    if (!action) return ''
    const icon = action.icon ?? ''
    const hoverIcon = action.hoverIcon ?? icon
    if (action.disabled) return icon
    const isHovered = (typeof index === 'number' && hoveredIndex.value === index) || !!action.isHovered
    return isHovered ? hoverIcon : icon
}
</script>