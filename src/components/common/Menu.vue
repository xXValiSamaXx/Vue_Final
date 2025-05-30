<template>
  <!-- Binding condicional: :class aplica 'show' según computed property -->
  <v-card class="mx-auto menu" dark :class="{show: Menu}" width="200">
    <v-navigation-drawer permanent>
      <v-list dense nav>
        
        <!-- Event binding: @click ejecuta método de navegación -->
        <v-list-item link @click="navigateAndClose('/')">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <!-- Navega a componente que muestra entidad books -->
            <v-list-item-title>Colección</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Navegación a componente que filtra entidad books por favorite=true -->
        <v-list-item link @click="navigateAndClose('/favourite')">
          <v-list-item-icon>
            <v-icon>mdi-heart-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Libros Favoritos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Navegación a componente que maneja las 3 entidades -->
        <v-list-item link @click="navigateAndClose('/loans')">
          <v-list-item-icon>
            <v-icon>mdi-bookmark-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <!-- Sistema que relaciona books, users y loans -->
            <v-list-item-title>Préstamos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Navegación a componente que crea registros en entidad books -->
        <v-list-item link @click="navigateAndClose('/addBook')">
          <v-list-item-icon>
            <v-icon>mdi-plus-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Agregar Libro</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Navegación a componente que elimina registros de entidad books -->
        <v-list-item link @click="navigateAndClose('/deleteBook')">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Eliminar Libro</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
// Importación de helpers Vuex para comunicación entre componentes
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    // mapMutations: vincula mutación del store para cambio de estado
    ...mapMutations(["ToggleMenu"]),
    
    // Método que combina navegación programática con cambio de estado
    navigateAndClose(route) {
      // Navegación programática usando Vue Router
      this.$router.push(route);
      
      // Cambio de estado con delay para UX suave
      setTimeout(() => {
        if (this.Menu) { // Condicional: solo cierra si está abierto
          this.ToggleMenu(); // Mutación que cambia estado global
        }
      }, 300); // Timeout para transición suave
    }
  },
  computed: {
    // mapGetters: vincula computed property con estado global
    ...mapGetters(["Menu"])
    // Menu: estado usado para binding condicional en template
  }
};
</script>

<style>
/* CSS condicional: se aplica cuando computed property Menu es true */
.menu {
  display: none !important;
  position: absolute !important;
  transform: translateX(-200px) !important; /* Estado inicial */
  transition: transform 2s !important;
  top: 64px;
  z-index: 10;
  height: 100%;
}

/* Clase aplicada mediante binding condicional */
.menu.show {
  display: block !important;
  transform: translateX(0px) !important; /* Estado cuando Menu=true */
}

.v-list-item__icon {
  margin: 12px 10px 0 0 !important;
}

/* Efectos hover para mejor UX */
.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Cursor pointer indica elemento interactivo */
.v-list-item {
  cursor: pointer !important;
}
</style>