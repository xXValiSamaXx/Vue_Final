<template>
  <div>
    <!-- Componentes reutilizables que se comunican vía store global -->
    <Header></Header>
    <Menu></Menu>
    
    <template>
      <!-- Binding condicional de clases según estado del store -->
      <v-container :class="{show: Menu}">
        <v-card class="mx-auto mt-5" tile>
          <v-card-title>
            <span class="headline">Lista de Libros Favoritos</span>
          </v-card-title>

          <!-- v-if: directiva condicional basada en computed property -->
          <!-- Muestra contenido solo si hay elementos en array filtrado -->
          <div v-if="FavoriteList[0]" class="FavoriteList">
            <!-- v-for: itera sobre datos filtrados de entidad books -->
            <v-list-item-content v-for="(libro,i) in FavoriteList" :key="i">
              <!-- Binding de atributos: color dinámico desde campo de entidad -->
              <v-card :color="libro.color" dark>
                <!-- Binding de atributos: URL desde campo cover de entidad books -->
                <img :src="libro.cover" />
                <!-- Interpolación: campo title de entidad books -->
                <span class="font-weight-medium">{{libro.title}}</span> Por
                <!-- Interpolación: campo Author de entidad books -->
                <span class="font-italic">{{libro.Author}}</span>
              </v-card>
            </v-list-item-content>
          </div>
          
          <!-- v-else: directiva condicional alternativa -->
          <!-- Se muestra cuando computed property FavoriteList está vacío -->
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
// Importación de helpers Vuex para comunicación entre componentes
import { mapGetters, mapMutations, mapActions } from "vuex";
// Importación de componentes reutilizables
import Header from "../common/Header";
import Menu from "../common/Menu";

export default {
  name: "Favoritos",
  // Registro de componentes: permite comunicación mediante composición
  components: {
    Menu,
    Header
  },
  // Propiedades reactivas del componente
  data() {
    return {
      menu: false  // Variable local no utilizada actualmente
    };
  },
  methods: {
    // mapActions: vincula acción que consume API GET /books
    ...mapActions(["getBooks"]),
    // mapMutations: vincula mutación para filtrado inmediato
    ...mapMutations(["FavoriteList"])
  },
  computed: {
    // mapGetters: vincula computed properties del store global
    ...mapGetters(["Menu", "FavoriteList"])
    // Menu: estado para binding condicional de clases
    // FavoriteList: computed property que filtra entidad books por favorite=true
  },
  // Hook del ciclo de vida: ejecuta al crear componente
  created() {
    // Acción que consume API y actualiza automáticamente FavoriteList
    this.getBooks();
  }
};
</script>

<style>
/* Estilos para imágenes de entidad books en vista de favoritos */
.FavoriteList img {
  width: 50px;   /* Tamaño fijo para campo cover */
  height: 60px;  /* Proporción para mostrar portadas */
  margin: 5px 10px;
}

/* Espaciado para elementos de entidad filtrada */
.FavoriteList .v-list-item__content {
  padding: 5px;
}
</style>