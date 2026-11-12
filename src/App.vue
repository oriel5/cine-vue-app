<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <div>
    <header class="navbar">
      <h1 style="margin: 0; font-size: 1.4em;">CineVue - (Control de Admistracion)</h1>
      <div v-if="usuario" style="display: flex; align-items: center; gap: 12px;">
        <span><i class="fa-solid fa-user"></i> {{ usuario.email }}</span>
        <button @click="cerrarSesion" class="btn-logout">Cerrar Sesion</button>
      </div>
    </header>
    <main>
      <Login v-if="!usuario" @login-exitoso="usuario = $event" />
      <PanelCartelera v-else />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabaseClient'
import Login from './components/Login.vue'
import PanelCartelera from './components/PanelCartelera.vue'

const usuario = ref(null)

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  usuario.value = session ? session.user : null

  supabase.auth.onAuthStateChange((_event, session) => {
    usuario.value = session ? session.user : null
  })
})

const cerrarSesion = async () => {
  await supabase.auth.signOut()
  usuario.value = null
}
</script>


