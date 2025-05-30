<template>
  <div>
    <!-- Barra superior de la aplicación -->
    <v-app-bar dark color="pink">
      <!-- Botón hamburguesa para abrir/cerrar el menú lateral -->
      <button @click="ToggleMenu" class="mr-2">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </button>
      <!-- Título principal de la aplicación -->
      <v-toolbar-title>Colección de Libros</v-toolbar-title>
      <!-- Icono de biblioteca al lado del título -->
      <v-icon class="ml-1">mdi-library</v-icon>
    </v-app-bar>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "Header",
  methods: {
    // Importa la función ToggleMenu del store para mostrar/ocultar menú
    ...mapMutations(["ToggleMenu"])
  }
};
</script>

<style>
/* Estilos para la barra de navegación */
nav {
  font-size: 20px;
  background: darksalmon;
}
nav img {
  width: 30px;
}
</style>