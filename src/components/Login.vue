<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <div style="display: flex; justify-content: center; margin-top: 60px; padding: 0 15px;">
    <div class="form-modulo" style="width: 100%; max-width: 400px;">
      <h2><i class="fa-solid fa-lock"></i> Panel de Control</h2>
      <p style="color: #aaa; font-size: 0.9em;">Ingresa tu cuenta para administrar la cartelera</p>
      <form @submit.prevent="iniciarSesion">
        <div class="form-group">
          <label>Correo Electronico:</label>
          <input type="email" v-model="email" class="form-control" placeholder="Ej: oriel@besto.com" required />
        </div>
        <div class="form-group">
          <label>Contraseña:</label>
          <input type="password" v-model="password" class="form-control" placeholder="Ej: ••••••••••" required />
        </div>
        <button type="submit" class="btn btn-danger" style="width: 100%; margin-top: 8px;" :disabled="cargando">
          {{ cargando ? 'Verificando...' : 'Ingresar' }}
        </button>
      </form>
      <p v-if="errorMsg" style="color: var(--cine-rojo); margin-top: 12px; text-align: center;">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabaseClient'

const email = ref('')
const password = ref('')
const cargando = ref(false)
const errorMsg = ref('')
const emit = defineEmits(['login-exitoso'])

const iniciarSesion = async () => {
  cargando.value = true
  errorMsg.value = ''

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  cargando.value = false

  if (error) {
    errorMsg.value = 'Error: ' + error.message
  } else {
    emit('login-exitoso', data.user)
  }
}
</script>



