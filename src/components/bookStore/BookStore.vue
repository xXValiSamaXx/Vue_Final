<template>
  <div>
    <!-- Componentes reutilizables que se comunican vía store global -->
    <Header></Header>
    <Menu></Menu>
    <!-- Componente que muestra datos de entidad books desde API -->
    <BookList></BookList>
  </div>
</template>

<script>
// Importación de componentes reutilizables
import Header from "../common/Header";   // Componente reutilizable para barra superior
import Menu from "../common/Menu";       // Componente reutilizable para navegación lateral
import BookList from "./BookList";       // Componente que consume API GET /books

export default {
  name: "BookStore",
  // Registro de componentes: permite comunicación mediante composición
  components: {
    BookList,  // Componente que muestra entidad books con directivas v-for, v-if
    Menu,      // Componente que maneja navegación programática entre rutas
    Header     // Componente que controla estado global mediante mutaciones
  },
  // Propiedades reactivas del componente
  data() {
    return {
      menu: false  // Variable local no utilizada (estado se centraliza en store)
    };
  }
};
</script>

<style>
/* Estilos para vista principal que muestra entidad books */
</style>