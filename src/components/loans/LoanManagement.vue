<template>
  <div>
    <!-- Incluye Header y Menu en esta página -->
    <Header></Header>
    <Menu></Menu>
    
    <!-- Contenedor principal que se adapta cuando el menú está abierto -->
    <v-container :class="{show: Menu}">
      
      <!-- SECCIÓN 1: CREAR NUEVO PRÉSTAMO (Usa las 3 tablas: users, books, loans) -->
      <v-card class="mb-4">
        <v-card-title>
          <span class="headline">🆕 Crear Nuevo Préstamo</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- Dropdown para seleccionar USUARIO (tabla users) -->
            <v-col cols="6">
              <v-select
                v-model="selectedUser"
                :items="activeUsers"
                item-text="name"
                item-value="id"
                label="Seleccionar Usuario"
                prepend-icon="mdi-account"
                :rules="[v => !!v || 'Usuario requerido']"
              >
                <!-- Muestra nombre, email y tipo de membresía del usuario -->
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.email }} - {{ item.membershipType }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-col>
            
            <!-- Dropdown para seleccionar LIBRO (tabla books) -->
            <v-col cols="6">
              <v-select
                v-model="selectedBook"
                :items="availableBooks"
                item-text="title"
                item-value="id"
                label="Seleccionar Libro"
                prepend-icon="mdi-book"
                :rules="[v => !!v || 'Libro requerido']"
              >
                <!-- Muestra título y autor del libro -->
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.Author }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-col>
          </v-row>
          
          <!-- Botón para crear préstamo (crea registro en tabla loans) -->
          <v-btn 
            color="primary" 
            @click="createLoan"
            :disabled="!selectedUser || !selectedBook"
            class="mr-2"
          >
            <v-icon left>mdi-plus</v-icon>
            Crear Préstamo
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- SECCIÓN 2: PRÉSTAMOS ACTIVOS (Lee y combina las 3 tablas) -->
      <v-card class="mb-4">
        <v-card-title>
          <span class="headline">📚 Préstamos Activos</span>
          <v-spacer></v-spacer>
          <!-- Botón para calcular multas automáticamente -->
          <v-btn color="warning" @click="calculateFines" class="mr-2">
            <v-icon left>mdi-calculator</v-icon>
            Calcular Multas
          </v-btn>
        </v-card-title>
        
        <!-- Tabla que muestra datos combinados de las 3 tablas -->
        <v-data-table
          :headers="loanHeaders"
          :items="activeLoans"
          item-key="id"
          class="elevation-1"
        >
          <!-- Columna de portada del libro -->
          <template v-slot:item.bookCover="{ item }">
            <v-avatar size="40" tile>
              <v-img :src="item.bookCover" :alt="item.bookTitle"></v-img>
            </v-avatar>
          </template>
          
          <!-- Columna de fecha de vencimiento con colores según urgencia -->
          <template v-slot:item.dueDate="{ item }">
            <v-chip 
              :color="getDueDateColor(item.dueDate)" 
              dark 
              small
            >
              {{ formatDate(item.dueDate) }}
            </v-chip>
          </template>
          
          <!-- Columna de renovaciones (actual/máximo) -->
          <template v-slot:item.renewals="{ item }">
            {{ item.renewals }}/{{ item.maxRenewals }}
          </template>
          
          <!-- Columna de acciones -->
          <template v-slot:item.actions="{ item }">
            <!-- Botón para devolver libro (actualiza las 3 tablas) -->
            <v-btn 
              color="success" 
              small 
              @click="returnBook(item)"
              class="mr-1"
            >
              <v-icon small>mdi-keyboard-return</v-icon>
              Devolver
            </v-btn>
            <!-- Botón para renovar préstamo -->
            <v-btn 
              color="info" 
              small 
              @click="renewLoan(item)"
              :disabled="item.renewals >= item.maxRenewals"
            >
              <v-icon small>mdi-refresh</v-icon>
              Renovar
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- SECCIÓN 3: PRÉSTAMOS VENCIDOS CON MULTAS -->
      <v-card v-if="overdueLoans.length > 0">
        <v-card-title>
          <span class="headline">⚠️ Préstamos Vencidos</span>
        </v-card-title>
        
        <!-- Tabla específica para préstamos vencidos -->
        <v-data-table
          :headers="overdueHeaders"
          :items="overdueLoans"
          item-key="id"
          class="elevation-1"
        >
          <!-- Portada del libro -->
          <template v-slot:item.bookCover="{ item }">
            <v-avatar size="40" tile>
              <v-img :src="item.bookCover" :alt="item.bookTitle"></v-img>
            </v-avatar>
          </template>
          
          <!-- Multa calculada automáticamente -->
          <template v-slot:item.fine="{ item }">
            <v-chip color="red" dark>
              ${{ item.fine }}
            </v-chip>
          </template>
          
          <!-- Acción para devolver libro pagando multa -->
          <template v-slot:item.actions="{ item }">
            <v-btn 
              color="success" 
              small 
              @click="returnBookWithFine(item)"
            >
              <v-icon small>mdi-keyboard-return</v-icon>
              Devolver (Pagar Multa)
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- DIÁLOGOS DE CONFIRMACIÓN -->
    <!-- Diálogo de éxito -->
    <v-dialog v-model="successDialog" width="500">
      <v-alert type="success">{{ successMessage }}</v-alert>
    </v-dialog>

    <!-- Diálogo de error -->
    <v-dialog v-model="errorDialog" width="500">
      <v-alert type="error">{{ errorMessage }}</v-alert>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Header from "../common/Header";
import Menu from "../common/Menu";

export default {
  name: "LoanManagement",
  components: {
    Header,
    Menu
  },
  data() {
    return {
      selectedUser: null,    // ID del usuario seleccionado
      selectedBook: null,    // ID del libro seleccionado
      successDialog: false,  // Controla diálogo de éxito
      errorDialog: false,    // Controla diálogo de error
      successMessage: "",    // Mensaje de éxito
      errorMessage: "",      // Mensaje de error
      
      // Definición de columnas para tabla de préstamos activos
      loanHeaders: [
        { text: 'Portada', value: 'bookCover', sortable: false },
        { text: 'Libro', value: 'bookTitle' },           // De tabla books
        { text: 'Autor', value: 'bookAuthor' },          // De tabla books
        { text: 'Usuario', value: 'userName' },          // De tabla users
        { text: 'Email', value: 'userEmail' },           // De tabla users
        { text: 'Fecha Vencimiento', value: 'dueDate' }, // De tabla loans
        { text: 'Renovaciones', value: 'renewals' },     // De tabla loans
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      
      // Definición de columnas para tabla de préstamos vencidos
      overdueHeaders: [
        { text: 'Portada', value: 'bookCover', sortable: false },
        { text: 'Libro', value: 'bookTitle' },    // De tabla books
        { text: 'Usuario', value: 'userName' },   // De tabla users
        { text: 'Teléfono', value: 'userPhone' }, // De tabla users
        { text: 'Multa', value: 'fine' },         // De tabla loans
        { text: 'Acciones', value: 'actions', sortable: false }
      ]
    };
  },
  
  computed: {
    // Importa getters que combinan datos de las 3 tablas
    ...mapGetters([
      "Menu",           // Estado del menú
      "activeLoans",    // Préstamos activos (combina 3 tablas)
      "overdueLoans",   // Préstamos vencidos (combina 3 tablas)
      "availableBooks", // Libros disponibles para préstamo
      "activeUsers"     // Usuarios activos
    ])
  },
  
  methods: {
    // Importa acciones que trabajan con las 3 tablas
    ...mapActions([
      "loadAllData",     // Carga datos de las 3 tablas
      "createLoan",      // Crea préstamo (actualiza 3 tablas)
      "returnBook",      // Devuelve libro (actualiza 3 tablas)
      "calculateFines",  // Calcula multas (lee 3 tablas)
      "renewLoan"        // Renueva préstamo (actualiza loans)
    ]),
    
    /**
     * PROCESO: Crear nuevo préstamo usando las 3 tablas
     * 1. Valida usuario (tabla users)
     * 2. Valida libro disponible (tabla books)
     * 3. Crea registro de préstamo (tabla loans)
     * 4. Actualiza disponibilidad del libro (tabla books)
     */
    async createLoan() {
      const result = await this.createLoan({
        userId: this.selectedUser,
        bookId: this.selectedBook
      });
      
      if (result.success) {
        this.successMessage = "Préstamo creado exitosamente";
        this.successDialog = true;
        this.selectedUser = null;
        this.selectedBook = null;
      } else {
        this.errorMessage = "Error al crear préstamo: " + result.error;
        this.errorDialog = true;
      }
    },
    
    /**
     * PROCESO: Devolver libro (actualiza las 3 tablas)
     * 1. Actualiza fecha de devolución en loans
     * 2. Cambia status en loans
     * 3. Marca libro como disponible en books
     */
    async returnBook(loan) {
      const result = await this.returnBook({
        loanId: loan.id,
        bookId: loan.bookId
      });
      
      if (result.success) {
        this.successMessage = `Libro "${loan.bookTitle}" devuelto exitosamente`;
        this.successDialog = true;
      } else {
        this.errorMessage = "Error al devolver libro: " + result.error;
        this.errorDialog = true;
      }
    },
    
    /**
     * Devolver libro con multa (confirma pago antes de procesar)
     */
    async returnBookWithFine(loan) {
      if (confirm(`¿Confirma el pago de la multa de $${loan.fine}?`)) {
        await this.returnBook(loan);
      }
    },
    
    /**
     * Renovar préstamo (extiende fecha de vencimiento)
     */
    async renewLoan(loan) {
      const result = await this.renewLoan({
        loanId: loan.id,
        currentRenewals: loan.renewals
      });
      
      if (result.success) {
        this.successMessage = `Préstamo renovado por 1 mes más`;
        this.successDialog = true;
      } else {
        this.errorMessage = result.error;
        this.errorDialog = true;
      }
    },
    
    /**
     * PROCESO: Calcular multas automáticamente
     * 1. Lee todos los préstamos activos (tabla loans)
     * 2. Compara fechas de vencimiento
     * 3. Calcula multa ($10 por día de retraso)
     * 4. Actualiza status y multa en loans
     */
    async calculateFines() {
      const result = await this.calculateFines();
      
      if (result.success) {
        this.successMessage = `Multas calculadas. ${result.updatedLoans} préstamos actualizados`;
        this.successDialog = true;
      } else {
        this.errorMessage = "Error al calcular multas: " + result.error;
        this.errorDialog = true;
      }
    },
    
    /**
     * Formatea fecha para mostrar en formato mexicano
     */
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-MX');
    },
    
    /**
     * Determina color del chip según cercanía a fecha de vencimiento
     * Verde: más de 3 días
     * Naranja: 3 días o menos
     * Rojo: vencido
     */
    getDueDateColor(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'red';       // Vencido
      if (diffDays <= 3) return 'orange';   // Por vencer
      return 'green';                       // Tiempo suficiente
    }
  },
  
  created() {
    // Al cargar el componente, obtiene datos de las 3 tablas
    this.loadAllData();
  }
};
</script>

<style>
/* Cuando el menú está abierto, mueve el contenedor */
.container.show {
  margin-left: 250px !important;
}

/* Fondo blanco para las tablas */
.v-data-table {
  background: white;
}
</style>