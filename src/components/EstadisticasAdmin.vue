<template>
  <div class="form-modulo">
    <h3>Views de la Cartelera y sus Estrenos</h3>
    <div class="tarjetas-metricas">
      <div class="tarjeta metrica-alta" v-if="masVista">
        <h4 style="margin-top: 0;">Pelicula Mas Vista</h4>
        <p style="font-size: 1.2em; margin: 8px 0;"><strong>{{ masVista.titulo }}</strong></p>
        <span>{{ masVista.total_vistas_ciclo }} reproducciones registradas</span>
      </div>
      <div class="tarjeta metrica-baja" v-if="menosVista">
        <h4 style="margin-top: 0;">Pelicula Menos Vista</h4>
        <p style="font-size: 1.2em; margin: 8px 0;"><strong>{{ menosVista.titulo }}</strong></p>
        <span>{{ menosVista.total_vistas_ciclo }} reproducciones registradas</span>
      </div>
      <div v-if="!masVista && !menosVista" style="color: #888;">
        Aún no hay suficientes visualizaciones registradas en las últimas 3 semanas.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabaseClient'

const masVista = ref(null)
const menosVista = ref(null)

const cargarMetricas = async () => {
  const { data, error } = await supabase
    .from('ranking_ciclo_vida_peliculas')
    .select('*')
    .order('total_vistas_ciclo', { ascending: false })

  if (!error && data && data.length > 0) {
    masVista.value = data[0]
    menosVista.value = data[data.length - 1]
  }
}

onMounted(cargarMetricas)
</script>

