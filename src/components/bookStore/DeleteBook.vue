<template>
  <div>
    <Header></Header>
    <Menu></Menu>
    <template>
      <v-container :class="{show: Menu}">
        <v-card class="mx-auto mt-5" tile>
          <v-card-title>
            <span class="headline">Eliminar Libro</span>
          </v-card-title>
          <v-list-item two-line class="deleteList">
            <v-list-item-content v-for="libro in allBooks" :key="libro.id">
              <v-list-item-title v-text="libro.title"></v-list-item-title>
              <v-list-item-subtitle v-text="libro.Author"></v-list-item-subtitle>
              <v-btn class="delete">
                <v-icon @click="eliminar(libro.id)">mdi-delete-circle mdi-36px</v-icon>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-container>
    </template>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialogo" width="500">
          <v-alert type="error" icon="mdi-alert-circle-outline">Libro Eliminado Exitosamente</v-alert>
        </v-dialog>
      </div>
    </template>
  </div>
</template>
 
<script>
import { mapActions, mapGetters } from "vuex";
import Header from "../common/Header";
import Menu from "../common/Menu";

export default {
  name: "EliminarLibro",
  components: {
    Menu,
    Header
  },
  data() {
    return {
      dialogo: false
    };
  },
  methods: {
    ...mapActions(["deleteBook", "getBooks"]),
    eliminar(id) {
      this.dialogo = true;
      this.deleteBook(id);
      setTimeout(
        function() {
          this.dialogo = false;
        }.bind(this),
        1500
      );
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
.deleteList .v-list-item__content:hover {
  background: #c8c8c8 !important;
  border-radius: 25px;
}
.v-dialog {
  -webkit-box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  -moz-box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  box-shadow: 0px 18px 38px 14px rgba(0, 0, 0, 0.61) !important;
  height: 55px;
  overflow: hidden !important;
}
</style>