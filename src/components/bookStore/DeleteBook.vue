<template>
  <div>
    <!-- Componentes reutilizables: comunicación mediante props implícitas -->
    <Header></Header>
    <Menu></Menu>
    
    <template>
      <!-- Binding condicional: aplica clase según computed property del store -->
      <v-container :class="{show: Menu}">
        <v-card class="mx-auto mt-5" tile>
          <v-card-title>
            <span class="headline">Eliminar Libro</span>
          </v-card-title>
          
          <!-- Lista que muestra datos de entidad books desde API -->
          <v-list-item two-line class="deleteList">
            <!-- v-for: directiva que itera sobre entidad books -->
            <v-list-item-content v-for="libro in allBooks" :key="libro.id">
              <!-- Interpolación: muestra campo title de entidad books -->
              <v-list-item-title v-text="libro.title"></v-list-item-title>
              <!-- Interpolación: muestra campo Author de entidad books -->
              <v-list-item-subtitle v-text="libro.Author"></v-list-item-subtitle>
              
              <v-btn class="delete">
                <!-- Event binding: @click ejecuta método que hace DELETE a API -->
                <v-icon @click="eliminar(libro.id)">mdi-delete-circle mdi-36px</v-icon>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-container>
    </template>
    
    <!-- v-model: binding bidireccional para controlar modal -->
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
// Importación de helpers Vuex para comunicación entre componentes
import { mapActions, mapGetters } from "vuex";
// Importación de componentes reutilizables
import Header from "../common/Header";
import Menu from "../common/Menu";

export default {
  name: "EliminarLibro",
  // Registro de componentes: permite reutilización en template
  components: {
    Menu,
    Header
  },
  // Propiedades reactivas del componente
  data() {
    return {
      dialogo: false  // Controla visibilidad de modal de confirmación
    };
  },
  methods: {
    // mapActions: vincula acciones del store que consumen API
    ...mapActions(["deleteBook", "getBooks"]),
    
    // Método que elimina registro de entidad books mediante API
    eliminar(id) {
      this.dialogo = true;  // Muestra modal de confirmación
      
      // Acción que envía DELETE a API: /books/:id
      this.deleteBook(id);
      
      // Timeout para ocultar modal después de operación
      setTimeout(
        function() {
          this.dialogo = false;
        }.bind(this),
        1500
      );
    }
  },
  computed: {
    // mapGetters: vincula datos del store global con computed properties
    ...mapGetters(["allBooks", "Menu"])
    // allBooks: datos de entidad books desde API GET /books
    // Menu: estado para binding condicional de clases CSS
  },
  // Hook del ciclo de vida: se ejecuta al crear componente
  created() {
    // Acción que consume API GET /books al inicializar
    this.getBooks();
  }
};
</script>

<style>
/* Estilos para lista de elementos de entidad books */
.v-list-item.deleteList {
  display: block;
}

.v-list-item__content {
  flex-wrap: nowrap !important;
  padding: 10px;
}

.v-btn.delete {
  display: contents;
}

.v-btn:before {
  background-color: white;
}

/* Efecto hover para mejor UX al interactuar con entidad */
.deleteList .v-list-item__content:hover {
  background: #c8c8c8 !important;
  border-radius: 25px;
}

/* Estilos para modal de confirmación */
.v-dialog {
  -webkit-box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  -moz-box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  height: 55px;
  overflow: hidden !important;
}
</style>