<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuth} from '../services/authService'
import Alert from "@/components/utils/Alert.vue";
import BaseInput from "@/components/utils/BaseInput.vue";

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const errors = ref({
  username: '',
  password: ''
})

async function onSubmit() {
  errors.value = { username: '', password: '' }

  const result = await login(username.value, password.value)
  if(result.success) {
    router.push({name: 'dashboard'})
  } else {
    error.value = result.message || 'Login fehlgeschlagen'
  }
}
</script>

<template>
  <section>
    <img src="@/assets/logo.png" class="mx-auto d-block mb-4" alt="Logo" style="height: 48px;"/>
    <alert type="info">{{ $t('login.subtitle') }}</alert>

    <h2 class="sr-only">{{ $t('login.title') }}</h2>

    <form @submit.prevent="onSubmit">
      <Alert v-if="error" type="danger" headline="general.error_headline">
        {{ error }}
      </Alert>
      <BaseInput
          v-model="username"
          label="general.username"
          placeholder="..."
          :error="errors.username"></BaseInput>
      <BaseInput
          v-model="password"
          type="password"
          label="Passwort"
          placeholder="..."
          :error="errors.password"
      />
      <div class="form-check mb-3">
        <input type="checkbox" class="form-check-input" id="rememberMe" />
        <label for="rememberMe" class="form-check-label">
          {{$t('login.remember_me')}}
        </label>
      </div>
      <button class="btn btn-primary w-100" type="submit">{{ $t('login.button_label') }}</button>
    </form>
  </section>
</template>

<style scoped>

</style>
