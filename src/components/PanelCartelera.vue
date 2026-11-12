<template>
  <div style="padding: 20px; max-width: 1000px; margin: auto;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
      <h2 style="margin: 0;">Contenido de Peliculas</h2>

      <button
        @click="verCartelera = !verCartelera"
        :class="['btn', verCartelera ? 'btn-success' : 'btn-primary']"
        style="margin: 0;"
      >
        {{ verCartelera ? 'Volver al Panel' : 'Ver Cartelera en Vivo' }}
      </button>
    </div>

    <VistaCarteleraAdmin v-if="verCartelera" />

    <div v-else>
      <EstadisticasAdmin />
      <hr style="border-color: #333; margin: 20px 0;" />

      <CrearPeliculaSalas @datos-creados="cargarDatos" />
      <hr style="border-color: #333; margin: 20px 0;" />

      <CarteleraActualizar
        v-if="funcionEnEdicion"
        :funcionSeleccionada="funcionEnEdicion"
        :peliculas="peliculas"
        :salas="salas"
        @funcion-actualizada="finalizarEdicion"
        @cancelar="funcionEnEdicion = null"
      />

      <CarteleraCrear
        v-else
        :peliculas="peliculas"
        :salas="salas"
        @funcion-creada="cargarDatos"
      />

      <CarteleraLista
        :funciones="funciones"
        @registro-eliminado="cargarDatos"
        @editar-click="activarEdicion"
      />

      <hr style="border-color: #333; margin: 20px 0;" />
      <HistorialRetiradas />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabaseClient'

import VistaCarteleraAdmin from './VistaCarteleraAdmin.vue'
import CrearPeliculaSalas from './CrearPeliculaSalas.vue'
import CarteleraCrear from './CarteleraCrear.vue'
import CarteleraActualizar from './CarteleraActualizar.vue'
import CarteleraLista from './CarteleraLista.vue'
import EstadisticasAdmin from './EstadisticasAdmin.vue'
import HistorialRetiradas from './HistorialRetiradas.vue'

const verCartelera = ref(false)
const funciones = ref([])
const peliculas = ref([])
const salas = ref([])
const funcionEnEdicion = ref(null)

const cargarDatos = async () => {
  const { data: p } = await supabase.from('peliculas').select('*').order('id', { ascending: false })
  peliculas.value = p || []

  const { data: s } = await supabase.from('salas').select('*').order('id', { ascending: true })
  salas.value = s || []

  const { data: f } = await supabase.from('funciones').select('*, peliculas(*), salas(*)').order('horario', { ascending: true })
  funciones.value = f || []
}

const activarEdicion = (func) => {
  funcionEnEdicion.value = func
}

const finalizarEdicion = () => {
  funcionEnEdicion.value = null
  cargarDatos()
}

onMounted(cargarDatos)
</script>


