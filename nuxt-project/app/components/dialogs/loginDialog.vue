<template>
    <UModal v-model:open="open" :modal="true" aria-labelledby="login-dialog-title">
        <template #header>
            <div class="flex items-center justify-between w-full">
                <span id="login-dialog-title" class="sr-only">{{ title }}</span>
                <h2 class="text-2xl font-bold">{{ title }}</h2>
                <UButton @click="onclose" icon="i-lucide-x" color="neutral" variant="ghost" />
            </div>
        </template>

        <template #body>
            <div class="">
                <div v-if="mode === 'login'">
                    <label class="block mb-2">Email</label>
                    <input v-model="email" type="email" class="w-full p-2 border rounded mb-3" />

                    <label class="block mb-2">Password</label>
                    <input v-model="password" type="password" class="w-full p-2 border rounded mb-3" />

                    <div class="flex items-center gap-2">
                        <UButton color="neutral" @click="onLogin">Se connecter</UButton>
                        <UButton variant="ghost" color="neutral" @click="switchToSignup">Créer un compte</UButton>
                        <UButton variant="ghost" color="neutral" @click="switchToReset">Mot de passe oublié</UButton>
                    </div>
                </div>

                <div v-else-if="mode === 'signup'">
                    <label class="block mb-2">Email</label>
                    <input v-model="email" type="email" class="w-full p-2 border rounded mb-3" />

                    <label class="block mb-2">Password</label>
                    <input v-model="password" type="password" class="w-full p-2 border rounded mb-3" />

                    <label class="block mb-2">Confirm Password</label>
                    <input v-model="passwordConfirm" type="password" class="w-full p-2 border rounded mb-3" />

                    <div class="flex items-center gap-2">
                        <UButton color="neutral" @click="onSignup">Créer</UButton>
                        <UButton variant="ghost" color="neutral" @click="switchToLogin">Déjà un compte ?</UButton>
                    </div>
                </div>

                <div v-else>
                    <label class="block mb-2">Email</label>
                    <input v-model="email" type="email" class="w-full p-2 border rounded mb-3" />
                    <div class="flex items-center gap-2">
                        <UButton color="neutral" @click="onReset">Envoyer lien de reset</UButton>
                        <UButton variant="ghost" color="neutral" @click="switchToLogin">Retour</UButton>
                    </div>
                </div>

                <div v-if="authStore.error" class="mt-3 text-red-600">{{ authStore.error }}</div>
            </div>

            <div class="mt-4">
                <div class="mb-2">Ou</div>
                <UButton color="neutral" variant="outline" @click="onGoogleLogin">Se connecter avec Google</UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'update:isOpen', value: boolean): void }>()

const authStore = useAuthStore()

const open = computed({
    get: () => props.isOpen,
    set: (v: boolean) => {
        // emit for v-model consumers — parent/store will be updated by v-model binding
        emit('update:isOpen', v)
    },
})

const onclose = () => {
    authStore.isLoginOpen = false
}

const mode = computed(() => authStore.dialogMode)
const title = computed(() => (mode.value === 'login' ? 'Se connecter' : mode.value === 'signup' ? 'Créer un compte' : 'Réinitialiser le mot de passe'))

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

function validatePassword(p: string) {
    // min 8 chars, at least one uppercase, one digit and one special char
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(p)
}

const switchToSignup = () => { authStore.dialogMode = 'signup' }
const switchToLogin = () => { authStore.dialogMode = 'login' }
const switchToReset = () => { authStore.dialogMode = 'reset' }

async function onLogin() {
    authStore.error = null
    await authStore.login(email.value, password.value)
}

async function onSignup() {
    authStore.error = null
    if (password.value !== passwordConfirm.value) {
        authStore.error = 'Les mots de passe ne correspondent pas.'
        return
    }
    if (!validatePassword(password.value)) {
        authStore.error = 'Mot de passe invalide : min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial.'
        return
    }
    await authStore.signUp(email.value, password.value)
}

async function onReset() {
    authStore.error = null
    await authStore.resetPassword(email.value)
}

function onGoogleLogin() {
    authStore.loginWithGoogle()
}
</script>
