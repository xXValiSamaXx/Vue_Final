<template>
  <v-card class="mx-auto">
    <v-container class="my-4 mt-5" :class="{show: Menu}">
      <v-row dense>
        <v-col v-for="libro in allBooks" :key="libro.id" cols="6" class="p-2">
          <v-card :color="libro.color" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div class style="display: grid">
                <div>
                  <v-card-title class="headline" v-text="libro.title"></v-card-title>
                  <v-card-subtitle v-text="libro.Author"></v-card-subtitle>
                </div>
              </div>

              <v-avatar class="ma-3" size="125" tile>
                <v-img :src="libro.cover"></v-img>
              </v-avatar>
              <v-tooltip bottom v-if="libro.favorite">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="heart"
                    fab
                    dark
                    x-small
                    color="red"
                    @click="marcarFavorito(libro)"
                  >
                    <v-icon dark>mdi-heart</v-icon>
                  </v-btn>
                </template>
                <span>Quitar de Favoritos</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="heart"
                    fab
                    dark
                    x-small
                    :color="libro.color"
                    @click="marcarFavorito(libro)"
                  >
                    <v-icon color="pink">mdi-heart-outline</v-icon>
                  </v-btn>
                </template>
                <span>Agregar a Favoritos</span>
              </v-tooltip>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "Libros",
  data() {
    return {
      option: false
    };
  },
  methods: {
    ...mapActions(["deleteBook", "getBooks", "ToggleFavorite"]),
    ...mapMutations(["ToggleMenu"]),
    marcarFavorito(libro) {
      if (libro.favorite == true) {
        libro.favorite = false;
        this.ToggleFavorite(libro);
      } else {
        libro.favorite = true;
        this.ToggleFavorite(libro);
      }
    }
  },
  computed: {
    ...mapGetters(["allBooks", "Menu"])
  },
  created() {
    this.getBooks();
  }
};
</script>

<style>
.container.show {
  margin-left: 250px !important;
}
.v-card__title {
  word-break: break-word !important;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none !important;
}
.v-image__image--cover {
  background-size: contain !important;
  background-position: right !important;
}
.v-card__actions {
  display: flex;
  justify-content: space-between;
}
button:focus {
  outline: none !important;
}
.heart {
  position: absolute;
  right: 0;
  margin: 8px;
  bottom: 0;
}
.options {
  display: none;
  transform: transition 2s;
}
.options.show {
  display: block;
  position: absolute;
  left: 40px;
  background: #c8c8c8;
}
</style>