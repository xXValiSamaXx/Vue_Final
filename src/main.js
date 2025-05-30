import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./routes";
import App from "./App.vue";
import axios from "axios";
import store  from "../src/store/store";
import vuetify from './plugins/vuetify';

Vue.use(axios);

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
