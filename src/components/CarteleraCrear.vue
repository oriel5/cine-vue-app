<template>
  <div class="form-modulo">
    <h3>Programar Nueva Funcion en Cartelera</h3>
    <form @submit.prevent="crearFuncion">
      <div class="form-group">
        <label>Película:</label>
        <select v-model="form.pelicula_id" class="form-control" required>
          <option disabled value="">Seleccione una pelicula...</option>
          <option v-for="p in peliculas" :key="p.id" :value="p.id">{{ p.titulo }} ({{ p.genero }})</option>
        </select>
      </div>
      <div class="form-group">
        <label>Sala:</label>
        <select v-model="form.sala_id" class="form-control" required>
          <option disabled value="">Seleccione una sala...</option>
          <option v-for="s in salas" :key="s.id" :value="s.id">{{ s.nombre }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Horario:</label>
        <input type="time" v-model="form.horario" class="form-control" required />
      </div>
      <div class="form-group">
        <label>Idioma:</label>
        <input type="text" v-model="form.idioma" placeholder="Ej: Subtitulada / Castellano" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-success">Agregar a Cartelera</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabaseClient'

defineProps({
  peliculas: Array,
  salas: Array
})

const emit = defineEmits(['funcion-creada'])

const form = ref({
  pelicula_id: '',
  sala_id: '',
  horario: '',
  idioma: ''
})

const crearFuncion = async () => {
  const { error } = await supabase.from('funciones').insert([form.value])
  if (!error) {
    alert('¡Función agregada con exito!')
    form.value = { pelicula_id: '', sala_id: '', horario: '', idioma: '' }
    emit('funcion-creada')
  } else {
    alert('Error al crear: ' + error.message)
  }
}
</script>

