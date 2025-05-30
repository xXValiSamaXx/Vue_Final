// Importación del framework principal Vue.js
import Vue from "vue";
// Importación de Vue Router para navegación entre componentes
import VueRouter from "vue-router";
// Importación de configuración de rutas que conecta URLs con componentes
import { routes } from "./routes";
// Importación del componente raíz de la aplicación
import App from "./App.vue";
// Importación de Axios para consumo de API REST de las 3 entidades
import axios from "axios";
// Importación del store global Vuex que maneja estado de entidades
import store  from "../src/store/store";
// Importación de Vuetify para componentes de UI Material Design
import vuetify from './plugins/vuetify';

// Configuración global: hace Axios disponible en todos los componentes
Vue.use(axios);

// Configuración de Vue Router para navegación programática entre componentes
Vue.use(VueRouter);

// Instancia de router con rutas que conectan URLs a componentes específicos
const router = new VueRouter({
  routes  // Array de objetos que mapean rutas a componentes
});

// Configuración de producción: desactiva tips de desarrollo
Vue.config.productionTip = false;

// Instancia principal de Vue: punto de entrada de la aplicación
new Vue({
  router,   // Inyección de router para navegación entre componentes
  store,    // Inyección de store Vuex para manejo de estado global de entidades
  vuetify,  // Inyección de Vuetify para componentes de UI
  render: h => h(App)  // Función de renderizado que monta componente App
}).$mount("#app");  // Monta la aplicación en elemento DOM con id="app"