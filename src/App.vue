<template>
  <!-- Componente raíz de Vuetify que envuelve toda la aplicación -->
  <v-app>
    <!-- Contenedor principal donde se renderizan todos los componentes -->
    <v-main>
      <!-- router-view: directiva que renderiza componente según ruta actual -->
      <!-- Aquí se muestran los componentes que manejan las entidades books, users, loans -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',  // Nombre del componente raíz

  // Components: no se registran componentes aquí porque se usan mediante router-view
  components: {
    
  },

  // Data: estado local del componente raíz (actualmente vacío)
  data: () => ({
    //
  }),
};
</script>