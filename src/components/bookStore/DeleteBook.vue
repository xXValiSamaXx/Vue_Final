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
            <span class="headline">Eliminar Libro</span>
          </v-card-title>
          
          <!-- Lista de libros para eliminar -->
          <v-list-item two-line class="deleteList">
            <!-- Por cada libro, crea un elemento de lista -->
            <v-list-item-content v-for="libro in allBooks" :key="libro.id">
              <!-- Título del libro -->
              <v-list-item-title v-text="libro.title"></v-list-item-title>
              <!-- Autor del libro -->
              <v-list-item-subtitle v-text="libro.Author"></v-list-item-subtitle>
              
              <!-- Botón para eliminar -->
              <v-btn class="delete">
                <!-- Icono de eliminar que ejecuta la función al hacer clic -->
                <v-icon @click="eliminar(libro.id)">mdi-delete-circle mdi-36px</v-icon>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-container>
    </template>
    
    <!-- Diálogo de confirmación que aparece después de eliminar -->
    <template>
      <div class="text-center">
        <v-dialog v-model="dialogo" width="500">
          <v-alert type="error" icon="mdi-alert-circle-outline">
            Libro Eliminado Exitosamente
          </v-alert>
        </v-dialog>
      </div>
    </template>
  </div>
</template>
 
<script>
import { mapActions, mapGetters } from "vuex";
import Header from "../common/Header";
import Menu from "../common/Menu";

export default {
  name: "EliminarLibro",
  // Componentes que usa esta página
  components: {
    Menu,
    Header
  },
  data() {
    return {
      dialogo: false  // Controla si se muestra el diálogo de confirmación
    };
  },
  methods: {
    // Importa acciones del store
    ...mapActions(["deleteBook", "getBooks"]),
    
    /**
     * Función que elimina un libro por su ID
     * @param {number} id - El ID del libro a eliminar
     */
    eliminar(id) {
      // Muestra el diálogo de confirmación
      this.dialogo = true;
      
      // Llama a la acción del store para eliminar el libro
      this.deleteBook(id);
      
      // Después de 1.5 segundos, oculta el diálogo
      setTimeout(
        function() {
          this.dialogo = false;
        }.bind(this),
        1500
      );
    }
  },
  computed: {
    // Importa datos del store
    ...mapGetters(["allBooks", "Menu"])
    // allBooks: lista de todos los libros
    // Menu: estado del menú (abierto/cerrado)
  },
  created() {
    // Cuando se carga la página, obtiene todos los libros
    this.getBooks();
  }
};
</script>

<style>
/* Hace que la lista se muestre como bloque */
.v-list-item.deleteList {
  display: block;
}

/* Estilo para el contenido de cada elemento de lista */
.v-list-item__content {
  flex-wrap: nowrap !important;
  padding: 10px;
}

/* Hace que el botón se muestre como contenido normal */
.v-btn.delete {
  display: contents;
}

/* Quita el fondo del botón */
.v-btn:before {
  background-color: white;
}

/* Efecto hover para resaltar el elemento al pasar el mouse */
.deleteList .v-list-item__content:hover {
  background: #c8c8c8 !important;
  border-radius: 25px;
}

/* Estilos para el diálogo de confirmación */
.v-dialog {
  -webkit-box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  -moz-box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  height: 55px;
  overflow: hidden !important;
}
</style>