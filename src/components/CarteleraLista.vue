<template>
  <div class="form-modulo">
    <h3>Lista de Funciones Programadas</h3>
    <table class="tabla-cine">
      <thead>
        <tr>
          <th>Película</th>
          <th>Género</th>
          <th>Sala</th>
          <th>Horario</th>
          <th>Idioma</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in funciones" :key="f.id">
          <td>{{ f.peliculas?.titulo }}</td>
          <td>{{ f.peliculas?.genero }}</td>
          <td>{{ f.salas?.nombre }}</td>
          <td><strong>{{ f.horario }}</strong></td>
          <td>{{ f.idioma }}</td>
          <td>
            <button @click="$emit('editar-click', f)" class="btn btn-primary" style="padding: 5px 10px;">Editar</button>
            <button @click="eliminar(f.id)" class="btn btn-danger" style="padding: 5px 10px;">Eliminar</button>
          </td>
        </tr>
        <tr v-if="funciones.length === 0">
          <td colspan="6" style="text-align: center; color: #888;">No hay funciones cargadas todavía.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { supabase } from '../supabaseClient'

defineProps({
  funciones: Array
})

const emit = defineEmits(['registro-eliminado', 'editar-click'])

const eliminar = async (id) => {
  if (confirm('¿Estas seguro de eliminar esta funcion?')) {
    const { error } = await supabase.from('funciones').delete().eq('id', id)
    if (!error) {
      emit('registro-eliminado')
    } else {
      alert('Error al eliminar: ' + error.message)
    }
  }
}
</script>

