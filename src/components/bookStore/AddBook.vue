<template>
  <div>
    <!-- Componentes reutilizables: comunicación mediante composición -->
    <Header></Header>
    <Menu></Menu>
    <!-- Componente específico que maneja formulario para entidad books -->
    <AddForm></AddForm>
  </div>
</template>

<script>
// Importación de componentes reutilizables
import Header from "../common/Header";  // Componente reutilizable para barra superior
import Menu from "../common/Menu";      // Componente reutilizable para navegación
import AddForm from "./AddForm";        // Componente específico para crear registros en entidad books

export default {
  name: "AddBook",
  // Registro de componentes: permite comunicación mediante composición
  components: {
    Menu,     // Componente que maneja navegación entre vistas
    Header,   // Componente que controla estado global del menú
    AddForm   // Componente que contiene formulario para entidad books
  },
  // Propiedades reactivas del componente
  data() {
    return {
      menu: false  // Variable local no utilizada (estado se maneja en store global)
    };
  }
};
</script>

<style>
/* CSS condicional: se aplica cuando computed property Menu es true */
.menu0.show .container {
  margin-left: 250px !important;
}
</style>