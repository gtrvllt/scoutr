<template>
  <div class="min-h-screen bg-gray-50">
    <Transition name="fade" mode="out-in">

      <!-- ═══════════════════ SETUP ═══════════════════ -->
      <div v-if="quizState === 'setup'" key="setup" class="max-w-2xl mx-auto py-12 px-4">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Scoutr Quizz</h1>
          <p class="text-gray-500 text-lg">Guess the country from the photo!</p>
        </div>

        <UAlert
          v-if="errorMsg"
          color="error"
          class="mb-6"
          icon="i-heroicons-exclamation-circle"
          :description="errorMsg"
        />

        <UCard class="shadow-sm">
          <div class="space-y-8 p-1">

            <!-- Number of questions -->
            <section>
              <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Number of questions
              </h2>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="n in PRESET_COUNTS"
                  :key="n"
                  class="px-4 py-2 border font-medium text-sm transition-colors"
                  :class="!isCustomCount && questionCount === n
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-gray-700 hover:border-gray-400'"
                  @click="() => { questionCount = n; isCustomCount = false }"
                >{{ n }}</button>
                <input
                  v-if="isCustomCount"
                  ref="customInput"
                  v-model.number="customCount"
                  type="number"
                  min="2"
                  max="50"
                  step="1"
                  class="w-20 px-3 py-2 border border-black bg-black text-white text-sm font-medium focus:outline-none tabular-nums"
                  placeholder="e.g. 15"
                  @keydown="(e) => ['.', ',', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()"
                />
                <button
                  v-else
                  class="px-4 py-2 border font-medium text-sm transition-colors border-gray-200 text-gray-700 hover:border-gray-400"
                  @click="() => { isCustomCount = true; nextTick(() => customInput?.focus()) }"
                >Custom</button>
              </div>
            </section>

            <!-- Scope -->
            <section>
              <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Scope
              </h2>
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  v-for="s in SCOPE_OPTIONS"
                  :key="s.value"
                  class="px-4 py-2 border font-medium text-sm transition-colors"
                  :class="scope === s.value
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-gray-700 hover:border-gray-400'"
                  @click="scope = s.value as ScopeType"
                >{{ s.label }}</button>
              </div>

              <!-- Continent picker -->
              <div v-if="scope === 'continents'" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label
                  v-for="cont in CONTINENTS_LIST"
                  :key="cont.code"
                  class="flex items-center gap-2 px-3 py-2 border cursor-pointer transition-colors text-sm select-none"
                  :class="selectedContinents.includes(cont.code)
                    ? 'border-black bg-gray-50 font-medium'
                    : 'border-gray-200 hover:border-gray-400'"
                >
                  <input type="checkbox" :value="cont.code" v-model="selectedContinents" class="sr-only" />
                  <span class="text-base">{{ cont.flag }}</span>
                  <span class="flex-1">{{ cont.label }}</span>
                  <UIcon v-if="selectedContinents.includes(cont.code)" name="i-heroicons-check" class="w-4 h-4 text-black shrink-0" />
                </label>
              </div>
              <p v-if="scope === 'continents' && selectedContinents.length === 0" class="text-xs text-red-500 mt-2">
                Select at least one continent
              </p>

              <!-- Country picker -->
              <div v-if="scope === 'countries'">
                <p class="text-xs text-gray-500 mb-2">
                  {{ selectedCountries.length }} country/countries selected — minimum 4 required
                </p>
                <div class="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto border p-2 bg-white">
                  <label
                    v-for="c in countries"
                    :key="c.code"
                    class="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-50 text-sm select-none"
                    :class="selectedCountries.includes(c.code) ? 'font-medium' : 'text-gray-600'"
                  >
                    <input type="checkbox" :value="c.code" v-model="selectedCountries" class="border-gray-300 shrink-0" />
                    <span>{{ getFlag(c.code) }}</span>
                    <span class="truncate">{{ c.name }}</span>
                  </label>
                </div>
              </div>
              <p v-if="scope === 'countries' && selectedCountries.length > 0 && selectedCountries.length < 4" class="text-xs text-red-500 mt-2">
                Select at least 4 countries
              </p>
            </section>
          </div>

          <template #footer>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-400">Multiple choice · 4 options</span>
              <UButton
                size="lg"
                color="neutral"
                :loading="loading"
                :disabled="!canStart"
                trailing-icon="i-heroicons-arrow-right"
                @click="startQuiz"
              >
                Start quiz
              </UButton>
            </div>
          </template>
        </UCard>
      </div>

      <!-- ═══════════════════ PLAYING ═══════════════════ -->
      <div v-else-if="quizState === 'playing'" key="playing" class="min-h-screen flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
          <button
            class="text-sm text-gray-400 hover:text-black transition-colors"
            @click="quizState = 'setup'"
          >← Quit</button>
          <h1 class="text-base font-semibold">Guess the country !</h1>
          <span class="text-sm font-medium tabular-nums">
            {{ currentIndex + 1 }}<span class="text-gray-400">/{{ totalQuestions }}</span>
          </span>
        </header>

        <!-- Progress bar -->
        <div class="h-1 bg-gray-100">
          <div
            class="h-full bg-black transition-all duration-700 ease-out"
            :style="{ width: progressPct + '%' }"
          />
        </div>

        <!-- Question -->
        <div class="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div class="w-full max-w-2xl">
            <Transition name="slide-question" mode="out-in">
              <div :key="currentIndex" class="space-y-4">

                <!-- Image -->
                <p v-if="currentQuestion?.meta.name || currentQuestion?.meta.title" class="text-sm font-medium text-gray-700">
                  {{ currentQuestion?.meta.name || currentQuestion?.meta.title }}
                </p>
                <div
                  class="relative bg-white border border-gray-200 overflow-hidden shadow-sm"
                  style="aspect-ratio: 16/9;"
                >
                  <img
                    v-if="currentQuestion?.meta.image_url"
                    :src="currentQuestion.meta.image_url"
                    alt="Guess this country"
                    class="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                    <UIcon name="i-heroicons-photo" class="w-16 h-16" />
                    <span class="text-sm">Image not available</span>
                  </div>
                </div>

                <!-- Choices -->
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="choice in currentQuestion?.choices"
                    :key="choice.code"
                    class="flex items-center gap-3 px-4 py-4 border-2 text-left transition-all duration-200 font-medium text-sm"
                    :class="getChoiceClass(choice.code)"
                    :disabled="answered"
                    @click="selectAnswer(choice.code)"
                  >
                    <span class="text-xl shrink-0">{{ getFlag(choice.code) }}</span>
                    <span class="flex-1">{{ choice.name }}</span>
                    <UIcon
                      v-if="answered && choice.code === currentQuestion?.correctCode"
                      name="i-heroicons-check-circle-solid"
                      class="shrink-0 w-5 h-5 text-green-600"
                    />
                    <UIcon
                      v-else-if="answered && choice.code === selectedAnswer && choice.code !== currentQuestion?.correctCode"
                      name="i-heroicons-x-circle-solid"
                      class="shrink-0 w-5 h-5 text-red-500"
                    />
                  </button>
                </div>

                <!-- Feedback + navigation -->
                <Transition name="fade-up">
                  <div v-if="answered" class="space-y-3 pt-1">

                    <!-- Correctness banner -->
                    <p
                      class="text-sm font-medium"
                      :class="lastAnswerCorrect ? 'text-green-600' : 'text-red-500'"
                    >
                      {{ lastAnswerCorrect ? '✓ Correct!' : `✗ It was ${currentQuestion?.correctName}` }}
                    </p>

                    <!-- Meta description card -->
                    <div
                      v-if="currentQuestion?.meta.title || currentQuestion?.meta.description"
                      class="border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 space-y-1"
                    >
                      <p v-if="currentQuestion.meta.title" class="font-semibold text-gray-900">
                        {{ currentQuestion.meta.title }}
                      </p>
                      <p v-if="currentQuestion.meta.description" class="leading-relaxed text-gray-500">
                        {{ currentQuestion.meta.description }}
                      </p>
                    </div>

                    <!-- Navigation -->
                    <div class="flex justify-end">
                      <UButton
                        v-if="currentIndex < totalQuestions - 1"
                        color="neutral"
                        trailing-icon="i-heroicons-arrow-right"
                        @click="nextQuestion"
                      >Next</UButton>
                      <UButton
                        v-else
                        color="neutral"
                        trailing-icon="i-heroicons-flag"
                        @click="showResults"
                      >Results</UButton>
                    </div>

                  </div>
                </Transition>

              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- ═══════════════════ RESULTS ═══════════════════ -->
      <div v-else-if="quizState === 'results'" key="results" class="max-w-2xl mx-auto py-12 px-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Results</h1>
          <div class="inline-flex items-baseline gap-1 mb-3">
            <span class="text-7xl font-black tabular-nums">{{ score }}</span>
            <span class="text-3xl text-gray-400 font-bold">/{{ totalQuestions }}</span>
          </div>
          <p class="text-2xl mb-1">{{ resultEmoji }}</p>
          <p class="text-gray-500">{{ resultMessage }}</p>
        </div>

        <UCard class="shadow-sm">
          <ul class="divide-y divide-gray-100">
            <li
              v-for="(q, i) in questions"
              :key="i"
              class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span class="text-lg w-6 text-center shrink-0">{{ q.isCorrect ? '✅' : '❌' }}</span>
              <div class="w-14 h-10 overflow-hidden shrink-0 bg-gray-100">
                <img
                  v-if="q.meta.image_url"
                  :src="q.meta.image_url"
                  alt=""
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium">{{ getFlag(q.correctCode) }} {{ q.correctName }}</p>
                <p v-if="!q.isCorrect && q.userAnswer" class="text-xs text-gray-400">
                  Your answer: {{ getFlag(q.userAnswer) }} {{ getCountryName(q.userAnswer) }}
                </p>
              </div>
            </li>
          </ul>

          <template #footer>
            <div class="flex justify-between gap-3">
              <UButton
                variant="outline"
                color="neutral"
                leading-icon="i-heroicons-arrow-left"
                @click="quizState = 'setup'"
              >Change settings</UButton>
              <UButton
                color="neutral"
                leading-icon="i-heroicons-arrow-path"
                :loading="loading"
                @click="restartSameConfig"
              >Scout again</UButton>
            </div>
          </template>
        </UCard>
      </div>

    </Transition>
  </div>
</template>

<script setup lang="ts">
import { countries } from '~/data/countries'
import type { Meta } from '~/types/meta'
import { useMetaStore } from '~/stores/meta'

definePageMeta({ layout: 'default' })

// ─── Types ────────────────────────────────────────────────────────────────────

type ScopeType = 'all' | 'continents' | 'countries'

interface Choice {
  code: string
  name: string
}

interface QuizQuestion {
  meta: Meta
  correctCode: string
  correctName: string
  choices: Choice[]
  userAnswer: string | null
  isCorrect: boolean | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESET_COUNTS = [5, 10, 20, 30] as const

const SCOPE_OPTIONS = [
  { value: 'all', label: 'All countries' },
  { value: 'continents', label: 'By continent' },
  { value: 'countries', label: 'Specific countries' },
] as const

const CONTINENTS_LIST = [
  { code: 'EU', label: 'Europe', flag: '🇪🇺' },
  { code: 'AS', label: 'Asia', flag: '🌏' },
  { code: 'AF', label: 'Africa', flag: '🌍' },
  { code: 'SA', label: 'South America', flag: '🌎' },
  { code: 'NA', label: 'North America', flag: '🌎' },
  { code: 'OC', label: 'Oceania', flag: '🌊' },
]

// ─── Store ────────────────────────────────────────────────────────────────────

const metaStore = useMetaStore()

// ─── State ────────────────────────────────────────────────────────────────────

const quizState = ref<'setup' | 'playing' | 'results'>('setup')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

// Config
const questionCount = ref<number>(10)
const isCustomCount = ref(false)
const customCount = ref<number>(10)
const customInput = ref<HTMLInputElement | null>(null)
const scope = ref<ScopeType>('all')
const selectedContinents = ref<string[]>([])
const selectedCountries = ref<string[]>([])

// Session
const questions = ref<QuizQuestion[]>([])
const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const answered = ref(false)

// ─── Computed ─────────────────────────────────────────────────────────────────

const effectiveCount = computed(() =>
  isCustomCount.value ? Math.max(2, Math.min(50, customCount.value || 10)) : questionCount.value
)

const currentQuestion = computed<QuizQuestion | undefined>(() => questions.value[currentIndex.value])
const totalQuestions = computed(() => questions.value.length)
const score = computed(() => questions.value.filter(q => q.isCorrect === true).length)
const progressPct = computed(() =>
  totalQuestions.value > 0 ? (currentIndex.value / totalQuestions.value) * 100 : 0
)
const lastAnswerCorrect = computed(() =>
  answered.value && selectedAnswer.value === currentQuestion.value?.correctCode
)

const canStart = computed(() => {
  if (loading.value) return false
  if (scope.value === 'continents' && selectedContinents.value.length === 0) return false
  if (scope.value === 'countries' && selectedCountries.value.length < 4) return false
  return true
})

const resultEmoji = computed(() => {
  const pct = totalQuestions.value > 0 ? (score.value / totalQuestions.value) * 100 : 0
  if (pct === 100) return '🏆'
  if (pct >= 80) return '🌟'
  if (pct >= 60) return '👍'
  if (pct >= 40) return '📚'
  return '🌍'
})

const resultMessage = computed(() => {
  const pct = totalQuestions.value > 0 ? (score.value / totalQuestions.value) * 100 : 0
  if (pct === 100) return 'Perfect! You are a true globe-trotter!'
  if (pct >= 80) return 'Excellent score!'
  if (pct >= 60) return 'Not bad at all!'
  if (pct >= 40) return 'Keep exploring the world!'
  return 'Time to travel more!'
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFlag(code: string): string {
  if (!code || code.length !== 2) return '🏳️'
  return code.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

function getCountryName(code: string): string {
  return countries.find(c => c.code === code)?.name ?? code
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i] as T
    a[i] = a[j] as T
    a[j] = tmp
  }
  return a
}

function pick3Distractors(correctCode: string, pool: string[]): string[] {
  return shuffle(pool.filter(c => c !== correctCode)).slice(0, 3)
}

function getChoiceClass(code: string): string {
  if (!answered.value) {
    return 'border-gray-200 hover:border-gray-900 hover:bg-gray-50 cursor-pointer text-gray-800'
  }
  if (code === currentQuestion.value?.correctCode) {
    return 'border-green-400 bg-green-50 text-green-800 cursor-default'
  }
  if (code === selectedAnswer.value) {
    return 'border-red-400 bg-red-50 text-red-700 cursor-default'
  }
  return 'border-gray-100 text-gray-400 cursor-default'
}

// ─── Quiz logic ───────────────────────────────────────────────────────────────

async function startQuiz() {
  loading.value = true
  errorMsg.value = null
  try {
    if (metaStore.list.length === 0) {
      await metaStore.fetchMetas()
    }

    const allMetas = metaStore.list.filter(m => !!m.country_code)

    // Build eligible country codes set for the chosen scope
    let eligibleCodes: Set<string>
    if (scope.value === 'continents' && selectedContinents.value.length > 0) {
      eligibleCodes = new Set(
        countries.filter(c => selectedContinents.value.includes(c.continent)).map(c => c.code)
      )
    } else if (scope.value === 'countries' && selectedCountries.value.length > 0) {
      eligibleCodes = new Set(selectedCountries.value)
    } else {
      eligibleCodes = new Set(countries.map(c => c.code))
    }

    const filtered = allMetas.filter(m => m.country_code && eligibleCodes.has(m.country_code))

    if (filtered.length < 1) {
      errorMsg.value = 'Not enough entries available for this scope. Try a broader selection.'
      return
    }

    const sampled = shuffle(filtered).slice(0, effectiveCount.value)

    // Distractor pool: same scope when possible, fallback to all countries (min 4)
    let distractorPool = [...eligibleCodes]
    if (distractorPool.length < 4) {
      distractorPool = countries.map(c => c.code)
    }

    questions.value = sampled.map(meta => {
      const correctCode = meta.country_code!
      const correctName = getCountryName(correctCode)
      const choices: Choice[] = shuffle([
        { code: correctCode, name: correctName },
        ...pick3Distractors(correctCode, distractorPool).map(code => ({
          code,
          name: getCountryName(code),
        })),
      ])
      return { meta, correctCode, correctName, choices, userAnswer: null, isCorrect: null }
    })

    currentIndex.value = 0
    selectedAnswer.value = null
    answered.value = false
    quizState.value = 'playing'
  } catch (e) {
    errorMsg.value = 'Loading error. Please try again.'
    console.error('startQuiz error:', e)
  } finally {
    loading.value = false
  }
}

function selectAnswer(code: string) {
  if (answered.value) return
  selectedAnswer.value = code
  answered.value = true
  const q = questions.value[currentIndex.value]
  if (q) {
    q.userAnswer = code
    q.isCorrect = code === q.correctCode
  }
}

function nextQuestion() {
  currentIndex.value++
  selectedAnswer.value = null
  answered.value = false
}

function showResults() {
  quizState.value = 'results'
}

async function restartSameConfig() {
  await startQuiz()
}
</script>

<style scoped>
/* State transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Question slide */
.slide-question-enter-active,
.slide-question-leave-active {
  transition: all 0.3s ease;
}
.slide-question-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-question-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* Feedback fade-up */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.2s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-up-leave-to {
  opacity: 0;
}
</style>