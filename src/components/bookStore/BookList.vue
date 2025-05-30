<template>
  <v-card class="mx-auto">
    <!-- Binding condicional de clases: aplica 'show' según computed property -->
    <v-container class="my-4 mt-5" :class="{show: Menu}">
      <!-- Grid responsivo usando Vuetify -->
      <v-row dense>
        <!-- v-for: directiva que itera sobre datos de entidad books desde API -->
        <v-col v-for="libro in allBooks" :key="libro.id" cols="6" class="p-2">
          <!-- Binding de atributos: color dinámico desde campo de entidad -->
          <v-card :color="libro.color" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              
              <!-- Sección que muestra datos de entidad books -->
              <div class style="display: grid">
                <div>
                  <!-- Interpolación: título desde campo de entidad books -->
                  <v-card-title class="headline" v-text="libro.title"></v-card-title>
                  <!-- Interpolación: autor desde campo de entidad books -->
                  <v-card-subtitle v-text="libro.Author"></v-card-subtitle>
                </div>
              </div>

              <!-- Binding de atributos: URL de imagen desde entidad books -->
              <v-avatar class="ma-3" size="125" tile>
                <v-img :src="libro.cover"></v-img>
              </v-avatar>
              
              <!-- v-if/v-else: directivas condicionales basadas en campo de entidad -->
              <!-- Si favorite=true muestra corazón lleno -->
              <v-tooltip bottom v-if="libro.favorite">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="heart"
                    fab
                    dark
                    x-small
                    color="red"
                    @click="marcarFavorito(libro)"
                  >
                    <v-icon dark>mdi-heart</v-icon>
                  </v-btn>
                </template>
                <span>Quitar de Favoritos</span>
              </v-tooltip>
              
              <!-- v-else: directiva condicional alternativa -->
              <!-- Si favorite=false muestra corazón vacío -->
              <v-tooltip bottom v-else>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="heart"
                    fab
                    dark
                    x-small
                    :color="libro.color"
                    @click="marcarFavorito(libro)"
                  >
                    <v-icon color="pink">mdi-heart-outline</v-icon>
                  </v-btn>
                </template>
                <span>Agregar a Favoritos</span>
              </v-tooltip>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
// Importación de helpers Vuex para comunicación entre componentes
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Libros",
  // Propiedades reactivas del componente
  data() {
    return {
      option: false
    };
  },
  // Métodos: manejan eventos y comunican con store
  methods: {
    // mapActions: vincula acciones del store que consumen API
    ...mapActions(["deleteBook", "getBooks", "ToggleFavorite"]),
    // mapMutations: vincula mutaciones para cambio de estado inmediato
    ...mapMutations(["ToggleMenu"]),
    
    // Método que actualiza entidad books mediante API
    marcarFavorito(libro) {
      if (libro.favorite == true) {
        // Cambio local del campo favorite en entidad books
        libro.favorite = false;
        // Acción que envía PUT a API para persistir cambio
        this.ToggleFavorite(libro);
      } else {
        // Cambio local del campo favorite en entidad books
        libro.favorite = true;
        // Acción que envía PUT a API para persistir cambio
        this.ToggleFavorite(libro);
      }
    }
  },
  // Computed properties: datos derivados del store global
  computed: {
    // mapGetters: vincula getters del store con computed properties
    ...mapGetters(["allBooks", "Menu"])
    // allBooks: datos de entidad books desde API
    // Menu: estado para binding condicional de clases CSS
  },
  // Hook del ciclo de vida: se ejecuta al crear componente
  created() {
    // Acción que consume API GET /books al inicializar componente
    this.getBooks();
  }
};
</script>

<style>
/* CSS condicional: se aplica cuando computed property Menu es true */
.container.show {
  margin-left: 250px !important;
}

/* Permite que el título se ajuste si es muy largo */
.v-card__title {
  word-break: break-word !important;
}

/* Estilos para optimizar visualización de datos de entidad */
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none !important;
}

/* Ajuste de imagen desde campo cover de entidad books */
.v-image__image--cover {
  background-size: contain !important;
  background-position: right !important;
}

.v-card__actions {
  display: flex;
  justify-content: space-between;
}

button:focus {
  outline: none !important;
}

/* Posicionamiento para botón que modifica campo favorite */
.heart {
  position: absolute;
  right: 0;
  margin: 8px;
  bottom: 0;
}

.options {
  display: none;
  transform: transition 2s;
}
.options.show {
  display: block;
  position: absolute;
  left: 40px;
  background: #c8c8c8;
}
</style>