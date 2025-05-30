<template>
  <!-- Menú lateral que se muestra/oculta según el estado 'Menu' -->
  <v-card class="mx-auto menu" dark :class="{show: Menu}" width="200">
    <v-navigation-drawer permanent>
      <v-list dense nav>
        
        <!-- Opción 1: Ir a la página de Colección -->
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <!-- Router-link navega a la página principal (/) -->
            <router-link to="/" tag="li" class="nav-link" active-class="active" exact>
              <v-list-item-title>Colección</v-list-item-title>
            </router-link>
          </v-list-item-content>
        </v-list-item>

        <!-- Opción 2: Ir a la página de Libros Favoritos -->
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-heart-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <!-- Router-link navega a /favourite -->
            <router-link to="/favourite" tag="li" class="nav-link" active-class="active" exact>
              <v-list-item-title>Libros Favoritos</v-list-item-title>
            </router-link>
          </v-list-item-content>
        </v-list-item>

        <!-- Opción 3: NUEVA - Sistema de Préstamos -->
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-bookmark-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <!-- Router-link navega a /loans -->
            <router-link to="/loans" tag="li" class="nav-link" active-class="active" exact>
              <v-list-item-title>Préstamos</v-list-item-title>
            </router-link>
          </v-list-item-content>
        </v-list-item>

        <!-- Opción 4: Ir a la página de Agregar Libro -->
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-plus-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <!-- Router-link navega a /addBook -->
            <router-link to="/addBook" tag="li" class="nav-link" active-class="active" exact>
              <v-list-item-title>Agregar Libro</v-list-item-title>
            </router-link>
          </v-list-item-content>
        </v-list-item>

        <!-- Opción 5: Ir a la página de Eliminar Libro -->
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <!-- Router-link navega a /deleteBook -->
            <router-link to="/deleteBook" tag="li" class="nav-link" active-class="active" exact>
              <v-list-item-title>Eliminar Libro</v-list-item-title>
            </router-link>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    // Importa función para cambiar estado del menú
    ...mapMutations(["ToggleMenu"])
  },
  computed: {
    // Importa el estado actual del menú (abierto/cerrado)
    ...mapGetters(["Menu"])
  }
};
</script>

<style>
/* Estilos para el menú lateral */
.menu {
  display: none !important;
  position: absolute !important;
  transform: translateX(-200px) !important; /* Oculto por defecto */
  transition: transform 2s !important;
  top: 64px;
  z-index: 10;
  height: 100%;
}

/* Cuando tiene clase 'show', se muestra el menú */
.menu.show {
  display: block !important;
  transform: translateX(0px) !important; /* Se desliza hacia la derecha */
}

.v-list-item__icon {
  margin: 12px 10px 0 0 !important;
}
</style>