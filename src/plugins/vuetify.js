// Importación de Vue.js framework principal
import Vue from 'vue';
// Importación de Vuetify: librería de componentes UI Material Design
import Vuetify from 'vuetify/lib';

// Configuración global: hace Vuetify disponible en todos los componentes
Vue.use(Vuetify);

// Exportación de instancia de Vuetify configurada para la aplicación
export default new Vuetify({
  // Configuración vacía: usa configuración por defecto de Material Design
  // Vuetify proporciona componentes como v-card, v-btn, v-data-table, v-dialog
  // que se usan en los componentes para mostrar datos de las entidades
});