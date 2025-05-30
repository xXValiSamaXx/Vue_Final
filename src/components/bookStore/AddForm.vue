<template>
  <div>
    <!-- Binding condicional: aplica clase CSS según computed property -->
    <v-container :class="{show: Menu}">
      <v-card-title>
        <span class="headline mt-5">Agregar Libro</span>
      </v-card-title>
      
      <!-- Formulario que creará nueva entrada en entidad books -->
      <form>
        <!-- v-model: binding bidireccional para captura de datos -->
        <v-text-field
          v-model="titulo"
          :error-messages="erroresTitulo"
          label="Título del Libro"
          prepend-icon="mdi-book"
          required
          @input="$v.titulo.$touch()"   
          @blur="$v.titulo.$touch()"     
        ></v-text-field>
        
        <!-- v-model: binding bidireccional para campo Author de entidad books -->
        <v-text-field
          v-model="autor"
          :error-messages="erroresAutor"
          label="Autor del Libro"
          prepend-icon="mdi-account"
          required
          @input="$v.autor.$touch()"
          @blur="$v.autor.$touch()"
        ></v-text-field>
        
        <!-- v-model: binding bidireccional para campo cover de entidad books -->
        <v-text-field
          v-model="portada"
          :error-messages="erroresPortada"
          label="URL de la Portada del Libro"
          prepend-icon="mdi-image"
          required
          @input="$v.portada.$touch()"
          @blur="$v.portada.$touch()"
        ></v-text-field>

        <!-- Event binding: @click ejecuta método que envía datos a API -->
        <div class="mt-3">
          <v-btn class="mr-4" @click="enviar">Enviar</v-btn>
          <v-btn class="mr-4" @click="limpiar">Limpiar</v-btn>
        </div>
      </form>
    </v-container>
    
    <!-- v-model: binding bidireccional para controlar visibilidad de modal -->
    <v-dialog v-model="dialogo" width="500">
      <v-alert type="success">Libro Agregado Exitosamente</v-alert>
    </v-dialog>
  </div>
</template>

<script>
// Importación de helpers Vuex para comunicación entre componentes
import { mapActions, mapGetters } from "vuex";
// Importación de mixin para validaciones de formulario
import { validationMixin } from "vuelidate";
// Importación de validadores para campos de entidad
import { required } from "vuelidate/lib/validators";

export default {
  name: "AgregarLibro",
  components: {},
  // Mixin: añade funcionalidad de validación al componente
  mixins: [validationMixin],

  // Reglas de validación para campos que van a entidad books
  validations: {
    titulo: { required },   // Campo title de entidad books es obligatorio
    autor: { required },    // Campo Author de entidad books es obligatorio  
    portada: { required }   // Campo cover de entidad books es obligatorio
  },

  // Propiedades reactivas: almacenan datos del formulario
  data() {
    return {
      titulo: "",     // Se mapea a campo title de entidad books
      autor: "",      // Se mapea a campo Author de entidad books
      portada: "",    // Se mapea a campo cover de entidad books
      dialogo: false  // Controla modal de confirmación
    };
  },

  // Computed properties: procesan datos reactivos y del store
  computed: {
    // mapGetters: vincula datos del store global
    ...mapGetters(["allBooks", "Menu"]),
    
    // Computed property: calcula errores de validación dinámicamente
    erroresTitulo() {
      const errores = [];
      // Si campo no ha sido tocado, no muestra errores
      if (!this.$v.titulo.$dirty) return errores;
      // Validación: campo requerido para entidad books
      !this.$v.titulo.required && errores.push("El título del libro es requerido.");
      return errores;
    },
    
    // Computed property: validación para campo Author de entidad
    erroresAutor() {
      const errores = [];
      if (!this.$v.autor.$dirty) return errores;
      !this.$v.autor.required && errores.push("El autor es requerido");
      return errores;
    },
    
    // Computed property: validación para campo cover de entidad
    erroresPortada() {
      const errores = [];
      if (!this.$v.portada.$dirty) return errores;
      !this.$v.portada.required && errores.push("La portada es requerida.");
      return errores;
    }
  },

  methods: {
    // mapActions: vincula acción que hace POST a API
    ...mapActions(["addBook"]),
    
    // Método que crea nueva entrada en entidad books
    enviar() {
      // Activa todas las validaciones del formulario
      this.$v.$touch();
      
      // Validaciones antes de enviar a API
      if (this.titulo == "" && this.autor == "" && this.portada == "") {
        alert("Todos los campos son requeridos");
      } else if (this.titulo == "") {
        alert("El título es requerido");
      } else if (this.autor == "") {
        alert("El autor es requerido");
      } else if (this.portada == "") {
        alert("La imagen de portada es requerida");
      } else {
        // Objeto que se enviará como POST a API entidad books
        const nuevoLibro = {
          // Campo color: generado automáticamente para UI
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          title: this.titulo,        // Campo title de entidad books
          Author: this.autor,        // Campo Author de entidad books
          cover: this.portada,       // Campo cover de entidad books
          favorite: false,           // Campo favorite por defecto
          available: true,           // Campo available por defecto
          isbn: "",                  // Campo opcional de entidad
          category: ""               // Campo opcional de entidad
        };
        
        // Muestra modal de confirmación
        this.dialogo = true;
        
        // Después de mostrar mensaje, ejecuta acción y navega
        setTimeout(
          function() {
            this.dialogo = false;           // Oculta modal
            this.$router.push("Home");      // Navegación programática
            this.addBook(nuevoLibro);       // Acción que hace POST a API
            this.limpiar();                 // Limpia formulario
          }.bind(this),
          1500
        );
      }
    },
    
    // Método que resetea formulario y validaciones
    limpiar() {
      this.$v.$reset();   // Resetea estado de validaciones
      this.titulo = "";   // Limpia binding de campo title
      this.autor = "";    // Limpia binding de campo Author
      this.portada = "";  // Limpia binding de campo cover
    }
  }
};
</script>

<style></style>