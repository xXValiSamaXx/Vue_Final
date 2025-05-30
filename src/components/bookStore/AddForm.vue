<template>
  <div>
    <!-- Contenedor que se adapta cuando el menú está abierto -->
    <v-container :class="{show: Menu}">
      <!-- Título de la sección -->
      <v-card-title>
        <span class="headline mt-5">Agregar Libro</span>
      </v-card-title>
      
      <!-- Formulario para agregar un nuevo libro -->
      <form>
        <!-- Campo 1: Título del libro -->
        <v-text-field
          v-model="titulo"
          :error-messages="erroresTitulo"
          label="Título del Libro"
          prepend-icon="mdi-book"
          required
          @input="$v.titulo.$touch()"   
          @blur="$v.titulo.$touch()"     
        ></v-text-field>
        
        <!-- Campo 2: Autor del libro -->
        <v-text-field
          v-model="autor"
          :error-messages="erroresAutor"
          label="Autor del Libro"
          prepend-icon="mdi-account"
          required
          @input="$v.autor.$touch()"
          @blur="$v.autor.$touch()"
        ></v-text-field>
        
        <!-- Campo 3: URL de la portada -->
        <v-text-field
          v-model="portada"
          :error-messages="erroresPortada"
          label="URL de la Portada del Libro"
          prepend-icon="mdi-image"
          required
          @input="$v.portada.$touch()"
          @blur="$v.portada.$touch()"
        ></v-text-field>

        <!-- Botones de acción -->
        <div class="mt-3">
          <v-btn class="mr-4" @click="enviar">Enviar</v-btn>
          <v-btn class="mr-4" @click="limpiar">Limpiar</v-btn>
        </div>
      </form>
    </v-container>
    
    <!-- Diálogo que se muestra cuando el libro se agrega exitosamente -->
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
  // Incluye el mixin de validación para usar vuelidate
  mixins: [validationMixin],

  // Reglas de validación para cada campo
  validations: {
    titulo: { required },   // El título es obligatorio
    autor: { required },    // El autor es obligatorio  
    portada: { required }   // La portada es obligatoria
  },

  data() {
    return {
      titulo: "",     // Almacena el título ingresado
      autor: "",      // Almacena el autor ingresado
      portada: "",    // Almacena la URL de portada ingresada
      dialogo: false  // Controla si se muestra el diálogo de éxito
    };
  },

  computed: {
    // Importa datos del store
    ...mapGetters(["allBooks", "Menu"]),
    
    /**
     * Calcula y retorna errores de validación para el título
     */
    erroresTitulo() {
      const errores = [];
      // Si el campo no ha sido tocado, no muestra errores
      if (!this.$v.titulo.$dirty) return errores;
      // Si no cumple la validación 'required', agrega error
      !this.$v.titulo.required && errores.push("El título del libro es requerido.");
      return errores;
    },
    
    /**
     * Calcula y retorna errores de validación para el autor
     */
    erroresAutor() {
      const errores = [];
      if (!this.$v.autor.$dirty) return errores;
      !this.$v.autor.required && errores.push("El autor es requerido");
      return errores;
    },
    
    /**
     * Calcula y retorna errores de validación para la portada
     */
    erroresPortada() {
      const errores = [];
      if (!this.$v.portada.$dirty) return errores;
      !this.$v.portada.required && errores.push("La portada es requerida.");
      return errores;
    }
  },

  methods: {
    // Importa acción del store para agregar libros
    ...mapActions(["addBook"]),
    
    /**
     * Función que se ejecuta cuando se hace clic en "Enviar"
     * Valida los campos y crea un nuevo libro
     */
    enviar() {
      // Activa todas las validaciones
      this.$v.$touch();
      
      // Verifica si todos los campos están vacíos
      if (this.titulo == "" && this.autor == "" && this.portada == "") {
        alert("Todos los campos son requeridos");
      } else if (this.titulo == "") {
        alert("El título es requerido");
      } else if (this.autor == "") {
        alert("El autor es requerido");
      } else if (this.portada == "") {
        alert("La imagen de portada es requerida");
      } else {
        // Si todo está correcto, crea el objeto del nuevo libro
        const nuevoLibro = {
          // Genera un color aleatorio para la tarjeta
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          title: this.titulo,
          Author: this.autor,
          cover: this.portada,
          favorite: false  // Por defecto no es favorito
        };
        
        // Muestra el diálogo de éxito
        this.dialogo = true;
        
        // Después de 1.5 segundos:
        setTimeout(
          function() {
            this.dialogo = false;           // Oculta el diálogo
            this.$router.push("Home");      // Redirige a la página principal
            this.addBook(nuevoLibro);       // Guarda el libro en la base de datos
            this.limpiar();                 // Limpia el formulario
          }.bind(this),
          1500
        );
      }
    },
    
    /**
     * Función que limpia todos los campos del formulario
     */
    limpiar() {
      this.$v.$reset();   // Resetea las validaciones
      this.titulo = "";   // Limpia el título
      this.autor = "";    // Limpia el autor
      this.portada = "";  // Limpia la portada
    }
  }
};
</script>

<style></style>