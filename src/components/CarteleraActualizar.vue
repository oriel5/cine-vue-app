<template>
  <div class="form-modulo" style="border-color: var(--cine-azul);">
    <h3>Modificar Funcion</h3>
    <form @submit.prevent="actualizarFuncion">
      <div class="form-group">
        <label>Película:</label>
        <select v-model="form.pelicula_id" class="form-control" required>
          <option v-for="p in peliculas" :key="p.id" :value="p.id">{{ p.titulo }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Sala:</label>
        <select v-model="form.sala_id" class="form-control" required>
          <option v-for="s in salas" :key="s.id" :value="s.id">{{ s.nombre }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Horario:</label>
        <input type="time" v-model="form.horario" class="form-control" required />
      </div>
      <div class="form-group">
        <label>Idioma:</label>
        <input type="text" v-model="form.idioma" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Actualizar Cambios</button>
      <button type="button" @click="$emit('cancelar')" class="btn btn-secondary">Cancelar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '../supabaseClient'

const props = defineProps({
  funcionSeleccionada: Object,
  peliculas: Array,
  salas: Array
})

const emit = defineEmits(['funcion-actualizada', 'cancelar'])

const form = ref({ ...props.funcionSeleccionada })

watch(
  () => props.funcionSeleccionada,
  (newVal) => {
    form.value = { ...newVal }
  },
  { deep: true }
)

const actualizarFuncion = async () => {
  const { error } = await supabase
    .from('funciones')
    .update({
      pelicula_id: form.value.pelicula_id,
      sala_id: form.value.sala_id,
      horario: form.value.horario,
      idioma: form.value.idioma
    })
    .eq('id', form.value.id)

  if (!error) {
    alert('Función actualizada correctamente')
    emit('funcion-actualizada')
  } else {
    alert('Error al actualizar: ' + error.message)
  }
}
</script>


