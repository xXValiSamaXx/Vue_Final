// Importación de Vue.js y Vuex para manejo de estado global
import Vue from "vue";
import Vuex from "vuex";

// Importación de módulos que manejan diferentes entidades de la API
import books from "./modules/books";  // Módulo que maneja entidad books
import loans from "./modules/loans";  // Módulo que maneja entidades users, books y loans relacionadas

// Configuración global: hace Vuex disponible en toda la aplicación
Vue.use(Vuex);

// Store principal: centraliza estado de todas las entidades
export default new Vuex.Store({
  // Modules: separa lógica de diferentes entidades en archivos distintos
  modules: {
    books,  // Módulo para operaciones CRUD de entidad books
    loans   // Módulo para operaciones que involucran 3 entidades relacionadas
  }
});