<template>
  <div>
    <v-app-bar dark color="pink">
      <button @click="ToggleMenu" class="mr-2">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </button>
      <v-toolbar-title>Colección de Libros</v-toolbar-title>
      <v-icon class="ml-1">mdi-library</v-icon>
    </v-app-bar>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "Header",
  methods: {
    ...mapMutations(["ToggleMenu"])
  }
};
</script>

<style>
nav {
  font-size: 20px;
  background: darksalmon;
}
nav img {
  width: 30px;
}
</style>