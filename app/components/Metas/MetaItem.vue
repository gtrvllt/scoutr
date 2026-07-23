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
        </div>
        <div class="meta-map" aria-hidden="true"></div>
    </div>

    <!-- version focus -->
    <Teleport to="body">
        <transition name="meta-focus">
            <div v-if="isFocused" class="meta-focus-overlay" role="dialog" aria-modal="true"
                :aria-label="`${resolvedTitle} details`" @click.self="closeFocus">
                <div class="meta-focus-card">
                    <div class="meta-focus-body">
                        <div class="meta-focus-header">
                            <h2 class="meta-focus-title">{{ isEditing ? 'Edit meta' : resolvedTitle }}</h2>
                            <div class="meta-focus-actions">
                                <template v-if="!isEditing">
                                    <button v-for="action in focusActions" :key="`${action.label}-focus`" type="button"
                                        :aria-label="action.label" class="meta-focus-action" :disabled="action.disabled"
                                        :aria-disabled="action.disabled" @click.stop="!action.disabled && action.action()">
                                        <img :src="getIcon(action)" alt="" />
                                    </button>
                                </template>
                                <button type="button" class="meta-focus-close" @click="closeFocus" aria-label="Fermer">
                                    <UIcon name="i-lucide-x" class="cursor-pointer size-6" />
                                </button>
                            </div>
                        </div>

                        <!-- Edit form -->
                        <template v-if="isEditing">
                            <div class="edit-image-panel border-2 border-black cursor-pointer" @dragover.prevent @drop.prevent="onEditDrop">
                                <input ref="editFileInput" type="file" accept="image/*" class="hidden" @change="onEditFileChange" />
                                <div class="relative overflow-hidden edit-image-preview" @click="editFileInput?.click()">
                                    <img :src="editPreview || meta.image_url" alt="Meta image" class="h-full w-full object-cover" />
                                    <div class="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors">
                                        <UIcon name="i-heroicons-camera" class="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
                                    </div>
                                    <button v-if="editPreview" type="button"
                                        class="absolute right-3 top-3 bg-white/80 px-3 py-1 text-xs border border-black"
                                        @click.stop="resetEditImage">clear</button>
                                </div>
                            </div>

                            <div class="flex flex-col gap-3">
                                <input v-model="editForm.name" type="text"
                                    class="w-full px-4 py-2 text-base border border-gray-200 focus:border-black focus:outline-none"
                                    placeholder="Meta name" />

                                <div class="relative">
                                    <input v-model="editTagSearch" type="text"
                                        class="w-full px-4 py-2 text-sm border border-gray-200 focus:border-black focus:outline-none"
                                        placeholder="Tags..."
                                        @keydown.enter.prevent="handleEditTagEnter"
                                        @input="filterEditSuggestions"
                                        @focus="editTagFocused = true"
                                        @blur="editTagFocused = false" />
                                    <ul v-if="editSuggestions.length && editTagFocused"
                                        class="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto border-2 border-black bg-white text-sm">
                                        <li v-for="s in editSuggestions" :key="s"
                                            class="cursor-pointer px-4 py-2 hover:bg-neutral-100"
                                            @pointerdown.prevent="addEditTag(s)">{{ s }}</li>
                                    </ul>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="tag in editSelectedTags" :key="tag"
                                        class="inline-flex items-center gap-1 bg-black px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-white">
                                        {{ tag }}
                                        <button type="button" class="text-white/70" @click="removeEditTag(tag)">&times;</button>
                                    </span>
                                </div>

                                <textarea v-model="editForm.description" rows="3"
                                    class="w-full px-4 py-3 text-base border border-gray-200 focus:border-black focus:outline-none"
                                    placeholder="Description" />
                            </div>

                            <p v-if="editError" class="text-sm text-rose-600">{{ editError }}</p>

                            <div class="flex justify-end gap-3">
                                <button type="button"
                                    class="px-5 py-2 border-2 border-black text-sm font-medium hover:bg-gray-50 transition-colors"
                                    @click="cancelEdit">Cancel</button>
                                <button type="button"
                                    class="px-5 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    :disabled="editSubmitting || !editForm.name"
                                    @click="submitEdit">
                                    {{ editSubmitting ? 'Saving…' : 'Save' }}
                                </button>
                            </div>
                        </template>

                        <!-- View mode -->
                        <template v-else>
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
                        </template>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Meta } from '@/types/meta'
import { useAuthStore } from '~/stores/auth'
import { deleteMeta as apiDeleteMeta, updateMeta as apiUpdateMeta } from '~/lib/supabase.api'
import { useSupabaseClient } from '~/lib/supabase.client'
import expandIcon from '@/assets/icons/expand.svg'
import hoverExpandIcon from '@/assets/icons/expanding.svg'
import editIcon from '@/assets/icons/edit.svg'
import hoverEditIcon from '@/assets/icons/editing.svg'
import trashIcon from '@/assets/icons/trash.svg'
import hoverTrashIcon from '@/assets/icons/trashOpen.svg'
import PictoRow from './PictoRow.vue'

const props = defineProps<{ meta: Meta }>()
const route = useRoute()
const emit = defineEmits<{
    (e: 'edit', meta: Meta): void
    (e: 'deleted', metaId: string): void
    (e: 'error', message: string): void
    (e: 'updated', meta: Meta): void
}>()

const authStore = useAuthStore()
const supabase = useSupabaseClient()
const isLogged = computed(() => authStore.isLogged)
const toast = useToast()

// ─── Edit mode ───────────────────────────────────────────────────────────────
const isEditing = ref(false)
const editForm = reactive({ name: '', description: '' })
const editSelectedTags = ref<string[]>([])
const editTagSearch = ref('')
const editTagFocused = ref(false)
const editSuggestions = ref<string[]>([])
const editAvailableTags = ref<string[]>([])
const editPreview = ref<string | null>(null)
const editNewFile = ref<File | null>(null)
const editFileInput = ref<HTMLInputElement | null>(null)
const editSubmitting = ref(false)
const editError = ref<string | null>(null)

const openEdit = async () => {
    editForm.name = props.meta.name || props.meta.title || ''
    editForm.description = props.meta.description || ''
    editPreview.value = null
    editNewFile.value = null
    editError.value = null
    const raw = props.meta.tags
    if (!raw) editSelectedTags.value = []
    else if (Array.isArray(raw)) editSelectedTags.value = raw
    else {
        try {
            const p = JSON.parse(raw)
            editSelectedTags.value = Array.isArray(p) ? p : raw.split(',').map((t: string) => t.trim()).filter(Boolean)
        } catch { editSelectedTags.value = raw.split(',').map((t: string) => t.trim()).filter(Boolean) }
    }
    if (props.meta.country_code) {
        const { data } = await supabase.from('meta_tags').select('name').eq('country_code', props.meta.country_code.toUpperCase()).order('name')
        editAvailableTags.value = (data ?? []).map((t: any) => t.name)
        filterEditSuggestions()
    }
    isEditing.value = true
}

const cancelEdit = () => { isEditing.value = false; editError.value = null }

const filterEditSuggestions = () => {
    const q = editTagSearch.value.trim().toLowerCase()
    const base = editAvailableTags.value.filter(t => !editSelectedTags.value.includes(t))
    editSuggestions.value = q ? base.filter(t => t.toLowerCase().includes(q)) : base.slice(0, 8)
}
const addEditTag = (tag: string) => {
    if (!tag.trim() || editSelectedTags.value.includes(tag)) return
    editSelectedTags.value = [...editSelectedTags.value, tag]
    editTagSearch.value = ''
    editSuggestions.value = []
}
const removeEditTag = (tag: string) => { editSelectedTags.value = editSelectedTags.value.filter(t => t !== tag) }
const handleEditTagEnter = () => { if (editTagSearch.value.trim()) addEditTag(editTagSearch.value.trim()) }

const onEditFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) setEditFile(file)
}
const onEditDrop = (e: DragEvent) => {
    const file = e.dataTransfer?.files?.[0]
    if (file) setEditFile(file)
}
const setEditFile = (file: File) => {
    editNewFile.value = file
    editPreview.value = URL.createObjectURL(file)
}
const resetEditImage = () => {
    if (editPreview.value) URL.revokeObjectURL(editPreview.value)
    editPreview.value = null
    editNewFile.value = null
}

const submitEdit = async () => {
    if (!editForm.name || editSubmitting.value) return
    editSubmitting.value = true
    editError.value = null
    try {
        let imageUrl = props.meta.image_url
        if (editNewFile.value) {
            const ext = editNewFile.value.name.split('.').pop()
            const name = `public/${crypto.randomUUID()}.${ext}`
            const { error: upErr } = await supabase.storage.from('images').upload(name, editNewFile.value)
            if (upErr) throw upErr
            imageUrl = supabase.storage.from('images').getPublicUrl(name).data.publicUrl
        }
        const { data, error } = await apiUpdateMeta(props.meta.id, {
            name: editForm.name,
            description: editForm.description,
            tags: editSelectedTags.value,
            image_url: imageUrl,
            updated_by: authStore.user?.id,
        })
        if (error) throw error
        emit('updated', data as Meta)
        toast.add({ title: 'Méta mise à jour', color: 'green' })
        isEditing.value = false
    } catch (err: any) {
        editError.value = err?.message ?? 'Unable to save.'
    } finally {
        editSubmitting.value = false
    }
}


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
    if (!isFocused.value) isFocused.value = true
    openEdit()
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
        const { error } = await apiDeleteMeta(props.meta.id)
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
    isEditing.value = false
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

.edit-image-panel {
    overflow: hidden;
}

.edit-image-preview {
    height: 220px;
    cursor: pointer;
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