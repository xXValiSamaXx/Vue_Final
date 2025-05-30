<template>
  <v-card class="mx-auto">
    <!-- Contenedor principal que se adapta cuando el menú está abierto -->
    <v-container class="my-4 mt-5" :class="{show: Menu}">
      <!-- Grid responsivo para mostrar los libros -->
      <v-row dense>
        <!-- Por cada libro en la lista, crea una tarjeta -->
        <v-col v-for="libro in allBooks" :key="libro.id" cols="6" class="p-2">
          <!-- Tarjeta con el color personalizado del libro -->
          <v-card :color="libro.color" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              
              <!-- Sección izquierda: Información del libro -->
              <div class style="display: grid">
                <div>
                  <!-- Título del libro -->
                  <v-card-title class="headline" v-text="libro.title"></v-card-title>
                  <!-- Autor del libro -->
                  <v-card-subtitle v-text="libro.Author"></v-card-subtitle>
                </div>
              </div>

              <!-- Sección centro: Imagen de portada -->
              <v-avatar class="ma-3" size="125" tile>
                <v-img :src="libro.cover"></v-img>
              </v-avatar>
              
              <!-- Sección derecha: Botón de favoritos -->
              <!-- Si el libro YA ES favorito, muestra corazón lleno -->
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
              
              <!-- Si el libro NO ES favorito, muestra corazón vacío -->
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
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Libros",
  data() {
    return {
      option: false
    };
  },
  methods: {
    // Importa acciones del store para manejar libros
    ...mapActions(["deleteBook", "getBooks", "ToggleFavorite"]),
    // Importa mutación para controlar el menú
    ...mapMutations(["ToggleMenu"]),
    
    /**
     * Función que maneja el cambio de estado de favorito
     * @param {Object} libro - El libro al que se le cambiará el estado
     */
    marcarFavorito(libro) {
      if (libro.favorite == true) {
        // Si ya es favorito, lo quita de favoritos
        libro.favorite = false;
        this.ToggleFavorite(libro); // Actualiza en la base de datos
      } else {
        // Si no es favorito, lo agrega a favoritos
        libro.favorite = true;
        this.ToggleFavorite(libro); // Actualiza en la base de datos
      }
    }
  },
  computed: {
    // Importa datos del store
    ...mapGetters(["allBooks", "Menu"])
    // allBooks: lista de todos los libros
    // Menu: estado del menú (abierto/cerrado)
  },
  created() {
    // Cuando se crea el componente, carga todos los libros desde la API
    this.getBooks();
  }
};
</script>

<style>
/* Cuando el menú está abierto, mueve el contenedor a la derecha */
.container.show {
  margin-left: 250px !important;
}

/* Permite que el título se rompa en líneas si es muy largo */
.v-card__title {
  word-break: break-word !important;
}

/* Quita sombra de las tarjetas */
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none !important;
}

/* Hace que la imagen se ajuste sin recortarse */
.v-image__image--cover {
  background-size: contain !important;
  background-position: right !important;
}

/* Estilo para las acciones de la tarjeta */
.v-card__actions {
  display: flex;
  justify-content: space-between;
}

/* Quita el outline de los botones */
button:focus {
  outline: none !important;
}

/* Posiciona el botón de corazón en la esquina inferior derecha */
.heart {
  position: absolute;
  right: 0;
  margin: 8px;
  bottom: 0;
}

/* Estilos para opciones (no se usan actualmente) */
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