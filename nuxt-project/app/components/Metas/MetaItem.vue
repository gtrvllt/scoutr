<template>
    <article
        class="meta-item flex w-full items-stretch gap-8  p-6 cursor-pointer"
        @mouseenter="isMetaHovered = true"
        @mouseleave="isMetaHovered = false"
    >
        <div :class="[
            'image-frame flex items-center justify-center border-2 border-black bg-[#d7cfce] overflow-hidden'
        ]">
            <img :src="meta.image_url" :alt="`${resolvedTitle} image`" class="h-full w-full object-cover" />
        </div>
        <div class="flex w-full flex-col gap-3">
            <div class="flex items-start justify-between gap-4">
                <h3 class="text-[25px] font-semibold leading-[1.2]">{{ resolvedTitle }}</h3>
                <div class="flex items-center gap-2">
                    <button v-for="action in actions" :key="action.label" type="button" :aria-label="action.label"
                        class="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-75"
                        @mouseenter="action.isHovered = true" @mouseleave="action.isHovered = false">
                        <img :src="getIcon(action)" alt="" class="h-full w-full" />
                    </button>
                </div>
            </div>
            <p class="text-[16px] leading-[1.2] whitespace-pre-line">
                {{ meta.description || '' }}
            </p>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Meta } from '@/types/meta'

const props = defineProps<{ meta: Meta }>()

///// gestion des icones d'actions
import expandIcon from '@/assets/icons/expand.svg'
import hoverExpandIcon from '@/assets/icons/expanding.svg'
import dragIcon from '@/assets/icons/drag.svg'
import editIcon from '@/assets/icons/edit.svg'
import hoverEditIcon from '@/assets/icons/editing.svg'
import trashIcon from '@/assets/icons/trash.svg'
import hoverTrashIcon from '@/assets/icons/trashOpen.svg'


type Action = {
    icon: string
    label: string
    isHovered: boolean
    hoverIcon: string
}

const actions = reactive<Action[]>([
    { icon: expandIcon, label: 'Expand meta details', isHovered: false, hoverIcon: hoverExpandIcon },
    { icon: dragIcon, label: 'Close meta preview', isHovered: false, hoverIcon: dragIcon },
    { icon: editIcon, label: 'Edit meta', isHovered: false, hoverIcon: hoverEditIcon },
    { icon: trashIcon, label: 'Delete meta', isHovered: false, hoverIcon: hoverTrashIcon },
])

const isMetaHovered = ref(false)

const getIcon = (action: Action) => {
    const shouldHover = action.label === 'Expand meta details'
        ? action.isHovered || isMetaHovered.value
        : action.isHovered
    return shouldHover ? action.hoverIcon : action.icon
}
///// gestion du titre à afficher
const resolvedTitle = computed(() => props.meta.title || props.meta.name || 'Meta')
</script>

<style scoped>
.image-frame {
    position: relative;
    width: 220px;
    height: 180px;
    max-width: 100%;
}

@media (min-width: 640px) {
    .image-frame {
        width: 280px;
        height: 200px;
    }
}

@media (min-width: 1024px) {
    .image-frame {
        width: 339px;
        height: 214px;
    }
}
</style>