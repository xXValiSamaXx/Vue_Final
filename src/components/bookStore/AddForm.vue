<template>
  <div>
    <v-container :class="{show: Menu}">
      <v-card-title>
        <span class="headline mt-5">Agregar Libro</span>
      </v-card-title>
      <form>
        <v-text-field
          v-model="titulo"
          :error-messages="erroresTitulo"
          label="Título del Libro"
          prepend-icon="mdi-book"
          required
          @input="$v.titulo.$touch()"
          @blur="$v.titulo.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="autor"
          :error-messages="erroresAutor"
          label="Autor del Libro"
          prepend-icon="mdi-account"
          required
          @input="$v.autor.$touch()"
          @blur="$v.autor.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="portada"
          :error-messages="erroresPortada"
          label="URL de la Portada del Libro"
          prepend-icon="mdi-image"
          required
          @input="$v.portada.$touch()"
          @blur="$v.portada.$touch()"
        ></v-text-field>

        <div class="mt-3">
          <v-btn class="mr-4" @click="enviar">Enviar</v-btn>
          <v-btn class="mr-4" @click="limpiar">Limpiar</v-btn>
        </div>
      </form>
    </v-container>
    <v-dialog v-model="dialogo" width="500">
      <v-alert type="success">Libro Agregado Exitosamente</v-alert>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "AgregarLibro",
  components: {},
  mixins: [validationMixin],

  validations: {
    titulo: { required },
    autor: { required },
    portada: { required }
  },

  data() {
    return {
      titulo: "",
      autor: "",
      portada: "",
      dialogo: false
    };
  },

  computed: {
    ...mapGetters(["allBooks", "Menu"]),
    erroresTitulo() {
      const errores = [];
      if (!this.$v.titulo.$dirty) return errores;
      !this.$v.titulo.required && errores.push("El título del libro es requerido.");
      return errores;
    },
    erroresAutor() {
      const errores = [];
      if (!this.$v.autor.$dirty) return errores;
      !this.$v.autor.required && errores.push("El autor es requerido");
      return errores;
    },
    erroresPortada() {
      const errores = [];
      if (!this.$v.portada.$dirty) return errores;
      !this.$v.portada.required && errores.push("La portada es requerida.");
      return errores;
    }
  },

  methods: {
    ...mapActions(["addBook"]),
    enviar() {
      this.$v.$touch();
      if (this.titulo == "" && this.autor == "" && this.portada == "") {
        alert("Todos los campos son requeridos");
      } else if (this.titulo == "") {
        alert("El título es requerido");
      } else if (this.autor == "") {
        alert("El autor es requerido");
      } else if (this.portada == "") {
        alert("La imagen de portada es requerida");
      } else {
        const nuevoLibro = {
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          title: this.titulo,
          Author: this.autor,
          cover: this.portada,
          favorite: false
        };
        this.dialogo = true;
        setTimeout(
          function() {
            this.dialogo = false;
            this.$router.push("Home");
            this.addBook(nuevoLibro);
            this.limpiar();
          }.bind(this),
          1500
        );
      }
    },
    limpiar() {
      this.$v.$reset();
      this.titulo = "";
      this.autor = "";
      this.portada = "";
    }
  }
};
</script>

<style></style>