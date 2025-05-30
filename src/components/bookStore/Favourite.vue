<template>
  <div>
    <!-- Incluye Header y Menu en esta página -->
    <Header></Header>
    <Menu></Menu>
    
    <template>
      <!-- Contenedor que se adapta cuando el menú está abierto -->
      <v-container :class="{show: Menu}">
        <!-- Tarjeta principal -->
        <v-card class="mx-auto mt-5" tile>
          <!-- Título de la sección -->
          <v-card-title>
            <span class="headline">Lista de Libros Favoritos</span>
          </v-card-title>

          <!-- Si HAY libros favoritos, los muestra -->
          <div v-if="FavoriteList[0]" class="FavoriteList">
            <!-- Por cada libro favorito, crea una tarjeta -->
            <v-list-item-content v-for="(libro,i) in FavoriteList" :key="i">
              <!-- Tarjeta con el color del libro -->
              <v-card :color="libro.color" dark>
                <!-- Imagen de portada del libro -->
                <img :src="libro.cover" />
                <!-- Título del libro en negritas -->
                <span class="font-weight-medium">{{libro.title}}</span> Por
                <!-- Autor del libro en cursivas -->
                <span class="font-italic">{{libro.Author}}</span>
              </v-card>
            </v-list-item-content>
          </div>
          
          <!-- Si NO HAY libros favoritos, muestra este mensaje -->
          <div v-else>
            <v-list-item-content class="text-center mt-3">
              <v-list-item-title>
                "No hay libros en la lista de favoritos"
              </v-list-item-title>
            </v-list-item-content>
          </div>
        </v-card>
      </v-container>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import Header from "../common/Header";
import Menu from "../common/Menu";

export default {
  name: "Favoritos",
  // Componentes que usa esta página
  components: {
    Menu,
    Header
  },
  data() {
    return {
      menu: false  // Variable local (no se usa actualmente)
    };
  },
  methods: {
    // Importa acciones del store
    ...mapActions(["getBooks"]),
    // Importa mutaciones del store
    ...mapMutations(["FavoriteList"])
  },
  computed: {
    // Importa datos calculados del store
    ...mapGetters(["Menu", "FavoriteList"])
    // Menu: estado del menú (abierto/cerrado)
    // FavoriteList: lista filtrada de solo los libros marcados como favoritos
  },
  created() {
    // Cuando se carga la página, obtiene todos los libros
    // Esto automáticamente actualizará la lista de favoritos
    this.getBooks();
  }
};
</script>

<style>
/* Estilo para las imágenes en la lista de favoritos */
.FavoriteList img {
  width: 50px;   /* Ancho fijo */
  height: 60px;  /* Alto fijo */
  margin: 5px 10px;  /* Espaciado alrededor */
}

/* Espaciado para el contenido de cada elemento */
.FavoriteList .v-list-item__content {
  padding: 5px;
}
</style>