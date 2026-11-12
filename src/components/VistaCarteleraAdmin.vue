<template>
  <div>
    <div class="form-modulo">
      <h3>Cartelera (Vista Previa)</h3>
      <p style="color: #aaa; font-size: 0.9em; margin: 0;">
        No te lo pierdas nuestros mejores estrenos de esta semana!!!
      </p>
    </div>

    <div class="cartelera-grid">
      <div v-for="f in funcionesProcesadas" :key="f.id" class="tarjeta-pelicula">
        <span :class="['badge-estado', f.esEstreno ? 'badge-estreno' : 'badge-emision']">
          {{ f.esEstreno ? 'Estreno' : 'En Emisión' }}
        </span>

        <img
          :src="f.peliculas?.poster_url || 'https://via.placeholder.com/300x400/1e1e24/ffffff?text=Sin+Portada'"
          :alt="f.peliculas?.titulo"
          class="poster-pelicula"
        />

        <div class="cuerpo-pelicula">
          <h3>{{ f.peliculas?.titulo }}</h3>

          <div class="meta-pelicula">
            <span class="tag-genero">{{ f.peliculas?.genero }}</span>
            <span class="nota-estrellas">
              {{ f.promedio > 0 ? `★ ${f.promedio} / 5` : '★ Sin votos' }}
            </span>
          </div>

          <p class="descripcion-pelicula">{{ f.peliculas?.descripcion || 'Sin descripción disponible.' }}</p>

          <p class="detalle-sala">
            {{ f.salas?.nombre }} |  <strong>{{ f.horario }}</strong> ({{ f.idioma }})
          </p>

          <div class="caja-encuesta">
            <p class="pregunta-encuesta">¿Viste la película?</p>

            <div v-if="!estadoEncuesta[f.id]">
              <button @click="marcarVista(f.id, f.peliculas?.id)" class="btn btn-success" style="padding: 6px 12px;">
                Sí, la vi
              </button>
              <button @click="marcarNoVista(f.id)" class="btn btn-secondary" style="padding: 6px 12px; margin-right: 0;">
                Todavía no
              </button>
            </div>

            <div v-if="estadoEncuesta[f.id] === 'si'">
              <p style="font-size: 0.85em; color: #ccc; margin: 0 0 5px 0;">¿Qué nota le das del 1 al 5?</p>
              <div class="barra-estrellas">
                <span
                  v-for="nota in 5"
                  :key="nota"
                  @click="calificarPelicula(f.id, f.peliculas?.id, nota)"
                  class="estrella-item"
                >
                  ★
                </span>
              </div>
            </div>

            <div v-if="estadoEncuesta[f.id] === 'no'">
              <p style="color: #ffcc00; font-size: 0.9em; margin: 0 0 8px 0;">
                <strong>¡Te la recomiendo!</strong> Es una excelente opcion en cartelera.
              </p>
              <button @click="estadoEncuesta[f.id] = null" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8em; margin: 0;">
                Volver
              </button>
            </div>

            <div v-if="estadoEncuesta[f.id] === 'votado'">
              <p style="color: var(--cine-verde); font-weight: bold; font-size: 0.9em; margin: 0;">
                ¡Gracias! Por puntuarnos te esperamos la proxima!!!.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="funcionesProcesadas.length === 0" class="form-modulo" style="grid-column: 1 / -1; text-align: center;">
        <p style="color: #888;">Aun no hay funciones activas programadas para hoy.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabaseClient'

const funcionesProcesadas = ref([])
const estadoEncuesta = ref({})
let reloj = null
let canal = null

const cargarCartelera = async () => {
  const horaActual = new Date().toTimeString().split(' ')[0]
  const haceTresSemanas = new Date()
  haceTresSemanas.setDate(haceTresSemanas.getDate() - 21)
  const fechaFiltro = haceTresSemanas.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('funciones')
    .select('*, peliculas(*, puntuaciones(estrellas)), salas(*)')

  if (error || !data) return

  const vigentes = data.filter(f => f.horario > horaActual)

  const mapeadas = vigentes.map(f => {
    const votos = f.peliculas?.puntuaciones || []
    const suma = votos.reduce((acc, v) => acc + v.estrellas, 0)
    const promedio = votos.length > 0 ? parseFloat((suma / votos.length).toFixed(1)) : 0

    return {
      ...f,
      promedio,
      esEstreno: f.peliculas?.fecha_estreno >= fechaFiltro
    }
  })

  funcionesProcesadas.value = mapeadas.sort((a, b) => b.promedio - a.promedio)
}

const marcarVista = async (funcionId, peliculaId) => {
  estadoEncuesta.value[funcionId] = 'si'
  if (peliculaId) {
    await supabase.from('vistas_peliculas').insert([{ pelicula_id: peliculaId }])
  }
}

const marcarNoVista = (funcionId) => {
  estadoEncuesta.value[funcionId] = 'no'
}

const calificarPelicula = async (funcionId, peliculaId, estrellas) => {
  if (!peliculaId) return

  const { error } = await supabase
    .from('puntuaciones')
    .insert([{ pelicula_id: peliculaId, estrellas: estrellas }])

  if (!error) {
    estadoEncuesta.value[funcionId] = 'votado'
    cargarCartelera()
  }
}

onMounted(() => {
  cargarCartelera()
  canal = supabase
    .channel('cambios-vista-admin')
    .on('postgres_changes', { event: '*', filter: 'table=eq.funciones' }, cargarCartelera)
    .subscribe()

  reloj = setInterval(cargarCartelera, 60000)
})

onUnmounted(() => {
  if (reloj) clearInterval(reloj)
  if (canal) supabase.removeChannel(canal)
})
</script>


