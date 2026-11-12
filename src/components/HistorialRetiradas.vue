<template>
  <div class="form-modulo">
    <h3>Historial de Peliculas Retiradas</h3>
    <table class="tabla-cine">
      <thead>
        <tr>
          <th>Película</th>
          <th>Género</th>
          <th>Estreno</th>
          <th>Vistas Totales</th>
          <th>Calificación</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in retiradas" :key="p.id">
          <td><strong>{{ p.titulo }}</strong></td>
          <td>{{ p.genero }}</td>
          <td>{{ p.fecha_estreno }}</td>
          <td>{{ p.total_vistas_historico }}</td>
          <td style="color: #ffcc00; font-weight: bold;">
            {{ p.puntuacion_promedio > 0 ? `★ ${p.puntuacion_promedio} / 5` : 'Sin votos' }}
          </td>
        </tr>
        <tr v-if="retiradas.length === 0">
          <td colspan="5" style="text-align: center; color: #888;">No hay peliculas retiradas desde su estreno.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabaseClient'

const retiradas = ref([])

const cargarHistorial = async () => {
  const { data, error } = await supabase
    .from('historial_peliculas_retiradas')
    .select('*')
    .order('puntuacion_promedio', { ascending: false })

  if (!error && data) {
    retiradas.value = data
  }
}

onMounted(cargarHistorial)
</script>

