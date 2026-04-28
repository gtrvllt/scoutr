<template>
    <div class="meta-card flex flex-row items-stretch w-full bg-white cursor-pointer border-2 "
        :class="isMetaHovered ? 'border-black' : 'border-transparent'" @mouseenter="isMetaHovered = true"
        @mouseleave="isMetaHovered = false" @click="openFocus">
        <div class="image-frame" :class="isMetaHovered ? 'border-r-2 border-black' : 'border-2 border-black'">
            <img :src="meta.image_url" :alt="`${resolvedTitle} image`" class="h-full w-full object-cover"
                loading="lazy" />
        </div>
        <div class="meta-content flex w-full h-full flex-col p-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div class="">
                    <div class="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-neutral-400">
                        <!-- <span>{{ primaryTag || 'Meta' }}</span> -->
                        <span v-if="countryFlag && route.path === '/metas'" class="inline-flex items-center gap-1">
                            <NuxtLink v-if="countryLink" :to="countryLink" class="flag-chip" aria-label="Voir le pays"
                                @click.stop>
                                <span>{{ countryFlag }}</span>
                                <span class="text-[10px]">{{ countryName || props.meta.country_code }}</span>
                            </NuxtLink>
                            <span v-else class="flag-chip">
                                <span>{{ countryFlag }}</span>
                                <span class="text-[10px]">{{ countryName || props.meta.country_code }}</span>
                            </span>
                        </span>
                    </div>
                    <h3 class="text-2xl font-semibold leading-tight">{{ resolvedTitle }}</h3>
                </div>
                <div class="flex items-center justify-end gap-3">
                    <PictoRow :actions="visibleActions" :isMetaHovered="isMetaHovered" />
                </div>
            </div>
            <p class="text-base leading-relaxed text-neutral-700">
                {{ meta.description || '' }}
            </p>
            <!-- <div class="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-neutral-500">
                <span v-for="tag in normalizedTags" :key="tag" class="rounded-full border border-neutral-200 px-3 py-1">
                    {{ tag }}
                </span>
            </div> -->
        </div>
        <div class="meta-map" aria-hidden="true"></div>
    </div>

    <!-- version focus -->
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
                                <button v-for="action in focusActions" :key="`${action.label}-focus`" type="button"
                                    :aria-label="action.label" class="meta-focus-action" :disabled="action.disabled"
                                    :aria-disabled="action.disabled" @click.stop="!action.disabled && action.action()">
                                    <img :src="getIcon(action)" alt="" />
                                </button>
                                <button type="button" class="meta-focus-close" @click="closeFocus" aria-label="Fermer">
                                    <UIcon name="i-lucide-x" class="cursor-pointer size-6" />
                                </button>
                            </div>
                        </div>
                        <div
                            class="meta-focus-media"
                            :style="{ cursor: lbDragging ? 'grabbing' : lbScale > 1 ? 'grab' : 'zoom-in' }"
                            @wheel.prevent="onLbWheel"
                            @mousedown="onLbMouseDown"
                            @mousemove="onLbMouseMove"
                            @mouseup="onLbMouseUp"
                            @mouseleave="onLbMouseUp"
                        >
                            <img
                                :src="meta.image_url"
                                :alt="`${resolvedTitle} image`"
                                :style="{ transform: `scale(${lbScale}) translate(${lbTranslateX / lbScale}px, ${lbTranslateY / lbScale}px)`, transformOrigin: 'center center', transition: lbDragging ? 'none' : 'transform 0.15s ease' }"
                                style="width:100%;height:100%;object-fit:cover;user-select:none;"
                                draggable="false"
                            />
                            <button
                                v-if="lbScale > 1"
                                type="button"
                                class="meta-focus-zoom-reset"
                                @click.stop="lbReset"
                            >Reset zoom</button>
                        </div>
                        <p class="meta-focus-description">{{ meta.description || '' }}</p>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { Teleport, computed, reactive, ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Meta } from '@/types/meta'

const props = defineProps<{ meta: Meta }>()
const route = useRoute()
const emit = defineEmits<{
    (e: 'edit', meta: Meta): void
    (e: 'deleted', metaId: string): void
    (e: 'error', message: string): void
}>()

// auth helper to know if actions should be visible
import { useAuthStore } from '~/stores/auth'
import { useSupabaseClient } from '~/lib/supabase.client'
const authStore = useAuthStore()
const isLogged = computed(() => authStore.isLogged)
const supabase = useSupabaseClient()
const toast = useToast()

///// gestion des icones d'actions
import expandIcon from '@/assets/icons/expand.svg'
import hoverExpandIcon from '@/assets/icons/expanding.svg'
import editIcon from '@/assets/icons/edit.svg'
import hoverEditIcon from '@/assets/icons/editing.svg'
import trashIcon from '@/assets/icons/trash.svg'
import hoverTrashIcon from '@/assets/icons/trashOpen.svg'
import PictoRow from './PictoRow.vue'


type Action = {
    name: string
    icon: string
    label: string
    isHovered: boolean
    hoverIcon: string
    showOnFocus: boolean
    action: () => void
    disabled?: boolean
    requiresAuth?: boolean
}

const isFocused = ref(false)
const openFocus = () => {
    isFocused.value = true
}

const isMetaHovered = ref(false)

const onEditMeta = () => {
    if (!isLogged.value) {
        toast.add({ title: 'Connexion requise', description: 'Identifiez-vous pour modifier une méta.', color: 'amber' })
        return
    }
    emit('edit', props.meta)
}

const isDeleting = ref(false)

const onDeleteMeta = async () => {
    if (isDeleting.value) return
    if (!isLogged.value) {
        toast.add({ title: 'Connexion requise', description: 'Identifiez-vous pour supprimer une méta.', color: 'amber' })
        return
    }
    const confirmed = window.confirm('Supprimer cette méta ? Cette action est irréversible.')
    if (!confirmed) return
    try {
        isDeleting.value = true
        const { error } = await supabase.from('metas').delete().eq('id', props.meta.id)
        if (error) throw error
        toast.add({ title: 'Méta supprimée', description: `${resolvedTitle.value} a été retirée.`, color: 'green' })
        emit('deleted', props.meta.id)
        closeFocus()
    } catch (err: any) {
        const message = err?.message ?? 'Impossible de supprimer la méta.'
        toast.add({ title: 'Erreur', description: message, color: 'red' })
        emit('error', message)
    } finally {
        isDeleting.value = false
    }
}
const actions = reactive<Action[]>([
    { icon: expandIcon, action: openFocus, name: 'expand', label: 'Expand meta details', isHovered: isMetaHovered.value, hoverIcon: hoverExpandIcon, showOnFocus: false },
    { icon: editIcon, action: onEditMeta, name: 'edit', label: 'Edit meta', isHovered: false, hoverIcon: hoverEditIcon, showOnFocus: true, requiresAuth: true },
    { icon: trashIcon, action: onDeleteMeta, name: 'delete', label: 'Delete meta', isHovered: false, hoverIcon: hoverTrashIcon, showOnFocus: true, requiresAuth: true },
])

const visibleActions = computed(() => {
    return actions.map((action) => {
        const disabledByAuth = action.requiresAuth && !isLogged.value
        const disabledByDeletion = action.label === 'Delete meta' && isDeleting.value
        return {
            ...action,
            disabled: action.disabled || disabledByAuth || disabledByDeletion,
        }
    })
})

const focusActions = computed(() => visibleActions.value.filter((action) => action.showOnFocus))



const getIcon = (action: Action) => {
    const shouldHover = action.label === 'Expand meta details'
        ? action.isHovered || isMetaHovered.value
        : action.isHovered
    return shouldHover ? action.hoverIcon : action.icon
}

const normalizedTags = computed(() => {
    if (!props.meta.tags) return []
    if (Array.isArray(props.meta.tags)) return props.meta.tags
    try {
        const parsed = JSON.parse(props.meta.tags)
        if (Array.isArray(parsed)) return parsed
    } catch {
        return props.meta.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }
    return []
})

const primaryTag = computed(() => normalizedTags.value[0] || null)


const closeFocus = () => {
    isFocused.value = false
    lbReset()
}

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFocused.value) {
        closeFocus()
    }
}

// ─── Lightbox zoom/pan ────────────────────────────────────────────────────────
const lbScale = ref(1)
const lbTranslateX = ref(0)
const lbTranslateY = ref(0)
const lbDragging = ref(false)
let lbDragStart = { x: 0, y: 0, tx: 0, ty: 0 }

function lbReset() {
    lbScale.value = 1
    lbTranslateX.value = 0
    lbTranslateY.value = 0
}
function onLbWheel(e: WheelEvent) {
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    lbScale.value = Math.min(8, Math.max(1, lbScale.value * delta))
    if (lbScale.value === 1) { lbTranslateX.value = 0; lbTranslateY.value = 0 }
}
function onLbMouseDown(e: MouseEvent) {
    if (lbScale.value <= 1) return
    lbDragging.value = true
    lbDragStart = { x: e.clientX, y: e.clientY, tx: lbTranslateX.value, ty: lbTranslateY.value }
}
function onLbMouseMove(e: MouseEvent) {
    if (!lbDragging.value) return
    lbTranslateX.value = lbDragStart.tx + (e.clientX - lbDragStart.x)
    lbTranslateY.value = lbDragStart.ty + (e.clientY - lbDragStart.y)
}
function onLbMouseUp() {
    lbDragging.value = false
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
})

watch(isFocused, (focused) => {
    document.body.style.overflow = focused ? 'hidden' : ''
})
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
.meta-card {
    overflow: hidden;
    box-sizing: border-box;
}

.image-frame {
    position: relative;
    width: 220px;
    min-width: 220px;
    height: 180px;
    background: #d7cfce;
    overflow: hidden;
}

.meta-content {
    padding-right: 4px;
}

@media (min-width: 768px) {
    .image-frame {
        width: 400px;
        height: 200px;
    }
}

.flag-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 2px 10px;
    font-size: 12px;
    line-height: 1;
}

.meta-map {
    position: absolute;
    inset: 0;
    background-image: url('https://uploads-ssl.webflow.com/641b5f3c4b5cb9df5c8e87af/6420636d4fb490b8da8932e8_italy-map.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 320px auto;
    opacity: 0.05;
    pointer-events: none;
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
    position: relative;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #000000;
    background-color: #d7cfce;
    overflow: hidden;
    min-height: 360px;
}

.meta-focus-zoom-reset {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: rgba(255,255,255,0.8);
    background: rgba(0,0,0,0.45);
    border: none;
    border-radius: 999px;
    padding: 4px 14px;
    cursor: pointer;
    transition: color 0.15s;
}
.meta-focus-zoom-reset:hover {
    color: #fff;
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
    font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'Twemoji', 'sans-serif';
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