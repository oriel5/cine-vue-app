<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    <div class="form-modulo" style="margin-bottom: 0;">
      <h3>Cargar Nueva Pelicula</h3>
      <form @submit.prevent="guardarPelicula">
        <div class="form-group">
          <label>Titulo de la Pelicula:</label>
          <input type="text" v-model="peliculaForm.titulo" class="form-control" placeholder="Ej: El Conjuro 4" required />
        </div>
        <div class="form-group">
          <label>Genero:</label>
          <input type="text" v-model="peliculaForm.genero" class="form-control" placeholder="Ej: Terror" required />
        </div>
        <div class="form-group">
          <label>URL de Imagen (Poster):</label>
          <input type="url" v-model="peliculaForm.poster_url" class="form-control" placeholder="https://ejemplo.com/poster.jpg" />
        </div>
        <div class="form-group">
          <label>Fecha de Estreno:</label>
          <input type="date" v-model="peliculaForm.fecha_estreno" class="form-control" required />
        </div>
        <div class="form-group">
          <label>Descripcion / Sinopsis:</label>
          <textarea v-model="peliculaForm.descripcion" class="form-control" rows="2" placeholder="De que trata la pelicula..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Guardar Película</button>
      </form>
    </div>

    <div class="form-modulo" style="margin-bottom: 0;">
      <h3>Registrar Nueva Sala</h3>
      <form @submit.prevent="guardarSala">
        <div class="form-group">
          <label>Nombre o Numero de Sala:</label>
          <input type="text" v-model="salaForm.nombre" class="form-control" placeholder="Ej: Sala 1 PROMAX" required />
        </div>
        <div class="form-group">
          <label>Capacidad de Butacas:</label>
          <input type="number" v-model="salaForm.capacidad" class="form-control" placeholder="120" required />
        </div>
        <button type="submit" class="btn btn-primary">Guardar Sala</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabaseClient'

const emit = defineEmits(['datos-creados'])

const hoy = new Date().toISOString().split('T')[0]

const peliculaForm = ref({
  titulo: '',
  genero: '',
  poster_url: '',
  fecha_estreno: hoy,
  descripcion: ''
})

const salaForm = ref({
  nombre: '',
  capacidad: ''
})

const guardarPelicula = async () => {
  const { error } = await supabase.from('peliculas').insert([peliculaForm.value])
  if (!error) {
    alert('¡Pelicula guardada en el catalogo!')
    peliculaForm.value = { titulo: '', genero: '', poster_url: '', fecha_estreno: hoy, descripcion: '' }
    emit('datos-creados')
  } else {
    alert('Error al guardar película: ' + error.message)
  }
}

const guardarSala = async () => {
  const { error } = await supabase.from('salas').insert([salaForm.value])
  if (!error) {
    alert('¡Sala registrada!')
    salaForm.value = { nombre: '', capacidad: '' }
    emit('datos-creados')
  } else {
    alert('Error al guardar sala: ' + error.message)
  }
}
</script>


