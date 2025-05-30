<template>
  <div>
    <!-- Barra superior reutilizable en toda la aplicación -->
    <v-app-bar dark color="pink">
      <!-- Event binding: @click ejecuta método que cambia estado global -->
      <button @click="toggleMenu" class="mr-2">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </button>
      <v-toolbar-title>Colección de Libros</v-toolbar-title>
      <v-icon class="ml-1">mdi-library</v-icon>
    </v-app-bar>
    
    <!-- v-if: directiva condicional basada en computed property del store -->
    <!-- Overlay que se muestra solo cuando Menu=true -->
    <v-overlay 
      v-if="Menu" 
      @click="closeMenu" 
      opacity="0.3"
      z-index="5"
    ></v-overlay>
  </div>
</template>

<script>
// Importación de helpers Vuex para comunicación con store global
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "Header",
  computed: {
    // mapGetters: vincula computed property con estado global del store
    ...mapGetters(["Menu"])
    // Menu: estado usado para binding condicional en template
  },
  methods: {
    // mapMutations: vincula mutación que modifica estado global inmediatamente
    ...mapMutations(["ToggleMenu"]),
    
    // Método que alterna estado del menú mediante mutación
    toggleMenu() {
      this.ToggleMenu(); // Mutación que cambia state.menu
    },
    
    // Método que específicamente cierra menú (no lo alterna)
    closeMenu() {
      if (this.Menu) { // Condicional basada en computed property
        this.ToggleMenu(); // Mutación para cambiar estado
      }
    }
  },
  
  // Hook del ciclo de vida: se ejecuta cuando componente se monta en DOM
  mounted() {
    // Event listener global para cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.Menu) {
        this.closeMenu(); // Método que ejecuta mutación
      }
    });
  }
};
</script>

<style>
/* Estilos para componente reutilizable */
nav {
  font-size: 20px;
  background: darksalmon;
}
nav img {
  width: 30px;
}

/* Estilos para botón que controla estado global */
button {
  background: transparent;
  border: none;
  color: white;
}

button:focus {
  outline: none;
}

/* Estilos para overlay que aparece condicionalmente */
.v-overlay {
  backdrop-filter: blur(2px);
}
</style>