<template>
  <div class="star-rating">
    <p class="star-rating-label">Rate this meta</p>
    <div v-if="isLoggedIn" class="stars">
      <button
        v-for="n in 5"
        :key="n"
        class="star"
        :class="{ filled: n <= (hovered ?? selected ?? 0), saving }"
        :disabled="saving"
        @mouseenter="hovered = n"
        @mouseleave="hovered = null"
        @click="rate(n)"
      >★</button>
    </div>
    <p v-else class="star-rating-guest">Sign in to rate</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { upsertMetaRating } from '~/lib/supabase.api'

const props = defineProps<{ metaId: string; isLoggedIn: boolean }>()

const selected = ref<number | null>(null)
const hovered = ref<number | null>(null)
const saving = ref(false)

async function rate(n: number) {
  if (saving.value) return
  saving.value = true
  await upsertMetaRating(props.metaId, n)
  selected.value = n
  saving.value = false
}
</script>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star-rating-label {
  font-size: 0.8rem;
  color: #6b7280;
  white-space: nowrap;
}

.stars {
  display: flex;
  gap: 0.1rem;
}

.star {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #d1d5db;
  transition: color 120ms ease, transform 120ms ease;
  padding: 0 0.1rem;
  line-height: 1;
}

.star.filled {
  color: #000;
}

.star:not(:disabled):hover {
  transform: scale(1.15);
}

.star.saving {
  opacity: 0.5;
  cursor: wait;
}

.star-rating-guest {
  font-size: 0.8rem;
  color: #9ca3af;
  font-style: italic;
}
</style>
