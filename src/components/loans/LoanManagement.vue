<template>
  <div>
    <!-- Uso de componentes: Header y Menu se reutilizan en múltiples vistas -->
    <Header></Header>
    <Menu></Menu>
    
    <!-- Binding de clases dinámicas: :class aplica 'show' según estado del menú -->
    <v-container :class="{show: Menu}">
      
      <!-- SECCIÓN 1: Formulario que usa las 3 entidades (users, books, loans) -->
      <v-card class="mb-4">
        <v-card-title>
          <span class="headline">🆕 Crear Nuevo Préstamo</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- v-model: binding bidireccional para capturar selección del usuario -->
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
                <!-- v-slot: directiva para personalizar template de cada item -->
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <!-- Interpolación: mostrar datos de entidad users -->
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.email }} - {{ item.membershipType }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-col>
            
            <!-- v-model: binding bidireccional para capturar selección del libro -->
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
                <!-- Template personalizado para mostrar datos de entidad books -->
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.Author }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-col>
          </v-row>
          
          <!-- Event binding: @click ejecuta método que crea registro en entidad loans -->
          <v-btn 
            color="primary" 
            @click="handleCreateLoan"
            :disabled="!selectedUser || !selectedBook"
            class="mr-2"
          >
            <v-icon left>mdi-plus</v-icon>
            Crear Préstamo
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- SECCIÓN 2: Tabla que muestra datos combinados de las 3 entidades -->
      <v-card class="mb-4">
        <v-card-title>
          <span class="headline">📚 Préstamos Activos</span>
          <v-spacer></v-spacer>
          <!-- Método que procesa datos de las 3 tablas -->
          <v-btn color="warning" @click="handleCalculateFines" class="mr-2">
            <v-icon left>mdi-calculator</v-icon>
            Calcular Multas
          </v-btn>
        </v-card-title>
        
        <!-- Binding de datos: :items usa computed property que combina 3 entidades -->
        <v-data-table
          :headers="loanHeaders"
          :items="activeLoans"
          item-key="id"
          class="elevation-1"
        >
          <!-- v-slot: template personalizado para columna de portada -->
          <template v-slot:item.bookCover="{ item }">
            <v-avatar size="40" tile>
              <!-- Binding de atributos: :src obtiene URL de entidad books -->
              <v-img :src="item.bookCover" :alt="item.bookTitle"></v-img>
            </v-avatar>
          </template>
          
          <!-- Template que usa computed property para determinar color -->
          <template v-slot:item.dueDate="{ item }">
            <v-chip 
              :color="getDueDateColor(item.dueDate)" 
              dark 
              small
            >
              <!-- Método que formatea fecha de entidad loans -->
              {{ formatDate(item.dueDate) }}
            </v-chip>
          </template>
          
          <!-- Interpolación: muestra datos de entidad loans -->
          <template v-slot:item.renewals="{ item }">
            {{ item.renewals }}/{{ item.maxRenewals }}
          </template>
          
          <!-- Event binding: botones que modifican entidades books y loans -->
          <template v-slot:item.actions="{ item }">
            <v-btn 
              color="success" 
              small 
              @click="handleReturnBook(item)"
              class="mr-1"
            >
              <v-icon small>mdi-keyboard-return</v-icon>
              Devolver
            </v-btn>
            <!-- Binding condicional: :disabled usa computed logic -->
            <v-btn 
              color="info" 
              small 
              @click="handleRenewLoan(item)"
              :disabled="item.renewals >= item.maxRenewals"
            >
              <v-icon small>mdi-refresh</v-icon>
              Renovar
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- v-if: directiva condicional que muestra sección solo si hay préstamos vencidos -->
      <v-card v-if="overdueLoans.length > 0">
        <v-card-title>
          <span class="headline">⚠️ Préstamos Vencidos</span>
        </v-card-title>
        
        <!-- Tabla que filtra datos de las 3 entidades para mostrar solo vencidos -->
        <v-data-table
          :headers="overdueHeaders"
          :items="overdueLoans"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.bookCover="{ item }">
            <v-avatar size="40" tile>
              <v-img :src="item.bookCover" :alt="item.bookTitle"></v-img>
            </v-avatar>
          </template>
          
          <!-- Interpolación: muestra campo calculado de entidad loans -->
          <template v-slot:item.fine="{ item }">
            <v-chip color="red" dark>
              ${{ item.fine }}
            </v-chip>
          </template>
          
          <!-- Método que actualiza múltiples entidades -->
          <template v-slot:item.actions="{ item }">
            <v-btn 
              color="success" 
              small 
              @click="handleReturnBookWithFine(item)"
            >
              <v-icon small>mdi-keyboard-return</v-icon>
              Devolver (Pagar Multa)
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- v-model: binding bidireccional para controlar visibilidad de diálogos -->
    <v-dialog v-model="successDialog" width="500">
      <!-- Interpolación: muestra mensaje dinámico -->
      <v-alert type="success">{{ successMessage }}</v-alert>
    </v-dialog>

    <v-dialog v-model="errorDialog" width="500">
      <v-alert type="error">{{ errorMessage }}</v-alert>
    </v-dialog>
  </div>
</template>

<script>
// Importación de helpers de Vuex para manejo de estado global
import { mapActions, mapGetters } from "vuex";
// Importación de componentes reutilizables
import Header from "../common/Header";
import Menu from "../common/Menu";

export default {
  name: "LoanManagement",
  // Registro de componentes: permite usar Header y Menu en template
  components: {
    Header,
    Menu
  },
  // Propiedades reactivas del componente
  data() {
    return {
      selectedUser: null,    // Binding bidireccional para formulario
      selectedBook: null,    // Binding bidireccional para formulario
      successDialog: false,  // Controla visibilidad de modal
      errorDialog: false,    // Controla visibilidad de modal
      successMessage: "",    // Mensaje dinámico para interpolación
      errorMessage: "",      // Mensaje dinámico para interpolación
      
      // Configuración de tabla: define estructura de datos para v-data-table
      loanHeaders: [
        { text: 'Portada', value: 'bookCover', sortable: false },
        { text: 'Libro', value: 'bookTitle' },           // Campo de entidad books
        { text: 'Autor', value: 'bookAuthor' },          // Campo de entidad books
        { text: 'Usuario', value: 'userName' },          // Campo de entidad users
        { text: 'Email', value: 'userEmail' },           // Campo de entidad users
        { text: 'Fecha Vencimiento', value: 'dueDate' }, // Campo de entidad loans
        { text: 'Renovaciones', value: 'renewals' },     // Campo de entidad loans
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      
      // Headers para tabla de préstamos vencidos
      overdueHeaders: [
        { text: 'Portada', value: 'bookCover', sortable: false },
        { text: 'Libro', value: 'bookTitle' },    // Campo de entidad books
        { text: 'Usuario', value: 'userName' },   // Campo de entidad users
        { text: 'Teléfono', value: 'userPhone' }, // Campo de entidad users
        { text: 'Multa', value: 'fine' },         // Campo calculado de entidad loans
        { text: 'Acciones', value: 'actions', sortable: false }
      ]
    };
  },
  
  // Computed properties: procesan datos de múltiples entidades
  computed: {
    // mapGetters: vincula getters del store con computed properties
    ...mapGetters([
      "Menu",           // Estado del menú para binding condicional
      "activeLoans",    // Combina datos de 3 entidades: users, books, loans
      "overdueLoans",   // Filtra y combina datos de las 3 entidades
      "availableBooks", // Filtra entidad books por disponibilidad
      "activeUsers"     // Filtra entidad users por estado activo
    ])
  },
  
  // Métodos: manejan eventos y procesan datos de las 3 entidades
  methods: {
    // mapActions: vincula actions del store con métodos del componente
    ...mapActions([
      "loadAllData",     // Consume API de las 3 entidades
      "createLoan",      // Crea registro en loans, actualiza books
      "returnBook",      // Actualiza loans y books
      "renewLoan"        // Actualiza entidad loans
    ]),
    
    // Método que procesa múltiples entidades para crear préstamo
    async handleCreateLoan() {
      const result = await this.createLoan({
        userId: this.selectedUser,    // Referencia a entidad users
        bookId: this.selectedBook     // Referencia a entidad books
      });
      
      if (result.success) {
        this.successMessage = "Préstamo creado exitosamente";
        this.successDialog = true;
        this.selectedUser = null;
        this.selectedBook = null;
        
        // Recarga datos de las 3 entidades desde API
        await this.loadAllData();
      } else {
        this.errorMessage = "Error al crear préstamo: " + result.error;
        this.errorDialog = true;
      }
    },
    
    // Método que actualiza múltiples entidades al devolver libro
    async handleReturnBook(loan) {
      const result = await this.returnBook({
        loanId: loan.id,      // ID de entidad loans
        bookId: loan.bookId   // ID de entidad books
      });
      
      if (result.success) {
        this.successMessage = `Libro "${loan.bookTitle}" devuelto exitosamente`;
        this.successDialog = true;
        
        // Sincroniza datos de las 3 entidades
        await this.loadAllData();
      } else {
        this.errorMessage = "Error al devolver libro: " + result.error;
        this.errorDialog = true;
      }
    },
    
    // Método con validación adicional para pagos de multa
    async handleReturnBookWithFine(loan) {
      if (confirm(`¿Confirma el pago de la multa de $${loan.fine}?`)) {
        await this.handleReturnBook(loan);
      }
    },
    
    // Método que actualiza entidad loans con nueva fecha
    async handleRenewLoan(loan) {
      const result = await this.renewLoan({
        loanId: loan.id,
        currentRenewals: loan.renewals
      });
      
      if (result.success) {
        this.successMessage = `Préstamo renovado por 1 mes más`;
        this.successDialog = true;
        
        await this.loadAllData();
      } else {
        this.errorMessage = result.error;
        this.errorDialog = true;
      }
    },
    
    // Método que procesa todas las entidades para calcular multas
    async handleCalculateFines() {
      // Llama acción que lee loans, calcula multas y actualiza registros
      const result = await this.$store.dispatch('calculateFines');
      
      if (result.success) {
        this.successMessage = `Multas calculadas. ${result.updatedLoans} préstamos actualizados`;
        this.successDialog = true;
        
        await this.loadAllData();
      } else {
        this.errorMessage = "Error al calcular multas: " + result.error;
        this.errorDialog = true;
      }
    },
    
    // Método utilitario para formateo de fechas
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-MX');
    },
    
    // Computed method: determina color basado en lógica de negocio
    getDueDateColor(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'red';       // Vencido
      if (diffDays <= 3) return 'orange';   // Por vencer
      return 'green';                       // Tiempo suficiente
    }
  },
  
  // Hook del ciclo de vida: se ejecuta al crear el componente
  created() {
    // Carga inicial de datos de las 3 entidades desde API
    this.loadAllData();
  }
};
</script>

<style>
/* Binding condicional de clases CSS */
.container.show {
  margin-left: 250px !important;
}

.v-data-table {
  background: white;
}
</style>