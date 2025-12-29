<template>
    <article class="meta-item flex w-full items-stretch gap-8 bg-white p-6 text-black cursor-pointer my-2"
        :class="isMetaHovered ? 'shadow-sm' : ''" @mouseenter="isMetaHovered = true" @mouseleave="isMetaHovered = false"
        @click="openFocus">
        <div :class="[
            'image-frame flex items-center justify-center border-2 border-black bg-[#d7cfce] overflow-hidden'
        ]">
            <img :src="meta.image_url" :alt="`${resolvedTitle} image`" class="h-full w-full object-cover" loading="lazy"/>
        </div>
        <div class="flex w-full flex-col gap-3">
            <div class="flex items-start justify-between gap-4">
                <h3 class="text-[25px] font-semibold leading-[1.2] flex items-center gap-3">
                    <span v-if="countryFlag">
                        <NuxtLink v-if="countryLink" :to="countryLink" class="flag-wrapper mr-2 relative inline-flex items-center group" @click.stop>
                            <span class="country-flag" :aria-label="countryName || props.meta.country_code">{{ countryFlag }}</span>
                            <span class="flag-tooltip pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 shadow z-20 group-hover:opacity-100 transition-opacity" role="tooltip">
                                {{ countryName || props.meta.country_code }}
                            </span>
                        </NuxtLink>
                        <span v-else class="flag-wrapper mr-2 relative inline-flex items-center group">
                            <span class="country-flag" :aria-label="countryName || props.meta.country_code">{{ countryFlag }}</span>
                            <span class="flag-tooltip pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 shadow z-20 group-hover:opacity-100 transition-opacity" role="tooltip">
                                {{ countryName || props.meta.country_code }}
                            </span>
                        </span>
                    </span>
                    {{ resolvedTitle }}
                </h3>
                <div class="flex items-center gap-2">
                    <PictoRow :actions="visibleActions" />
                </div>
            </div>
            <p class="text-[16px] leading-[1.2] whitespace-pre-line">
                {{ meta.description || '' }}
            </p>
        </div>
    </article>

    <Teleport to="body">
        <transition name="meta-focus">
            <div v-if="isFocused" class="meta-focus-overlay" role="dialog" aria-modal="true"
                :aria-label="`${resolvedTitle} details`" @click.self="closeFocus">
                <div class="meta-focus-card">
                    <!-- <button type="button" class="meta-focus-close" @click="closeFocus" aria-label="Fermer">
                        <UIcon name="i-lucide-x" class="h-6 w-6" />
                    </button> -->
                    <div class="meta-focus-body">
                        <div class="meta-focus-header">
                            <h2 class="meta-focus-title">{{ resolvedTitle }}</h2>
                            <div class="meta-focus-actions">
                                <div v-for="action in actions">
                                    <button v-if="action.showOnFocus" :key="`${action.label}-focus`" type="button"
                                        :aria-label="action.label" class="meta-focus-action">
                                        <img :src="action.hoverIcon" alt="" />
                                    </button>
                                </div>
                                <button type="button" class="" @click="closeFocus" aria-label="Fermer">
                                    <UIcon name="i-lucide-x" class="cursor-pointer size-7" />
                                </button>
                            </div>
                        </div>
                        <div class="meta-focus-media">
                            <img :src="meta.image_url" :alt="`${resolvedTitle} image`" />
                        </div>
                        <p class="meta-focus-description">{{ meta.description || '' }}</p>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { Teleport, computed, ref } from 'vue'
import type { Meta } from '@/types/meta'

const props = defineProps<{ meta: Meta }>()

// auth helper to know if actions should be visible
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const isLogged = computed(() => authStore.isLogged)

///// gestion des icones d'actions
import expandIcon from '@/assets/icons/expand.svg'
import hoverExpandIcon from '@/assets/icons/expanding.svg'
import dragIcon from '@/assets/icons/drag.svg'
import editIcon from '@/assets/icons/edit.svg'
import hoverEditIcon from '@/assets/icons/editing.svg'
import trashIcon from '@/assets/icons/trash.svg'
import hoverTrashIcon from '@/assets/icons/trashOpen.svg'
import PictoRow from './PictoRow.vue'


type Action = {
    icon: string
    label: string
    isHovered: boolean
    hoverIcon: string
    showOnFocus: boolean
    action: () => void
    disabled?: boolean
}

const isFocused = ref(false)
const openFocus = () => {
    isFocused.value = true
}

const onEditMeta = () => {
    console.log('Edit meta', props.meta.id)
}
const onDeleteMeta = () => {
    console.log('Delete meta', props.meta.id)
}
const actions = reactive<Action[]>([
    { icon: expandIcon, action: openFocus, label: 'Expand meta details', isHovered: false, hoverIcon: hoverExpandIcon, showOnFocus: false },
    // { icon: dragIcon, label: 'Close meta preview', isHovered: false, hoverIcon: dragIcon, showOnFocus: false },
    { icon: editIcon, action: onEditMeta, label: 'Edit meta', isHovered: false, hoverIcon: hoverEditIcon, showOnFocus: true },
    { icon: trashIcon, action: onDeleteMeta, label: 'Delete meta', isHovered: false, hoverIcon: hoverTrashIcon, showOnFocus: true },
])

const visibleActions = computed(() => {
    return actions.map(a => ({
        ...a,
        disabled: !isLogged.value && (a.label === 'Edit meta' || a.label === 'Delete meta')
    }))
})

const isMetaHovered = ref(false)

const getIcon = (action: Action) => {
    const shouldHover = action.label === 'Expand meta details'
        ? action.isHovered || isMetaHovered.value
        : action.isHovered
    return shouldHover ? action.hoverIcon : action.icon
}


const closeFocus = () => {
    isFocused.value = false
}
///// gestion du titre à afficher
const resolvedTitle = computed(() => props.meta.title || props.meta.name || 'Meta')

// computed country flag (emoji) from 2-letter country code
const countryFlag = computed(() => {
    const code = props.meta.country_code?.trim()
    if (!code || code.length !== 2) return null
    const upper = code.toUpperCase()
    const cp = Array.from(upper).map(c => 127397 + c.charCodeAt(0))
    try {
        return String.fromCodePoint(...cp)
    } catch {
        return null
    }
})

// try to resolve country name for tooltip (uses Intl if available)
const countryName = computed(() => {
    const code = props.meta.country_code?.trim()?.toUpperCase()
    if (!code) return null
    try {
        // Intl.DisplayNames may not be available in all environments
        // fallback to the raw code if not
        // @ts-ignore
        if (typeof Intl !== 'undefined' && (Intl as any).DisplayNames) {
            // @ts-ignore
            return new Intl.DisplayNames(['en'], { type: 'region' }).of(code)
        }
    } catch (e) {
        // ignore
    }
    return null
})

// link to country page (assumes route /country/:code)
const countryLink = computed(() => {
    const code = props.meta.country_code?.trim()?.toLowerCase()
    if (!code) return null
    return `/country/${code}`
})
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

.meta-focus-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    padding: 24px;
    z-index: 1000;
}

.meta-focus-card {
    position: relative;
    max-width: 960px;
    width: 100%;
    max-height: 90vh;
    background-color: #ffffff;
    border: 2px solid #000000;
    display: flex;
    flex-direction: column;
    padding: 32px;
    overflow: hidden;
}

.meta-focus-close {
    position: absolute;
    top: 16px;
    right: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: 2px solid #000000;
    background-color: #ffffff;
    cursor: pointer;
}

.meta-focus-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
    overflow: hidden;
}

.meta-focus-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
}

.meta-focus-media {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #000000;
    background-color: #d7cfce;
    overflow: hidden;
    min-height: 360px;
}

.meta-focus-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.meta-focus-title {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.1;
}

.meta-focus-description {
    font-size: 18px;
    line-height: 1.4;
    white-space: pre-line;
    overflow-y: auto;
    padding-right: 8px;
}

.country-flag {
    font-size: 22px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.flag-wrapper {
    cursor: pointer;
}

.meta-focus-actions {
    display: flex;
    gap: 12px;
}

.meta-focus-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* border: 2px solid #000000; */
    /* background-color: #ffffff; */
    cursor: pointer;
}

.meta-focus-action img {
    width: 25px;
    height: 25px;
}

.meta-focus-enter-active,
.meta-focus-leave-active {
    transition: opacity 0.2s ease;
}

.meta-focus-enter-from,
.meta-focus-leave-to {
    opacity: 0;
}
</style>