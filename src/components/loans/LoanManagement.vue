<template>
  <div>
    <Header></Header>
    <Menu></Menu>
    
    <v-container :class="{show: Menu}">
      <!-- Sección para crear nuevo préstamo -->
      <v-card class="mb-4">
        <v-card-title>
          <span class="headline">🆕 Crear Nuevo Préstamo</span>
        </v-card-title>
        <v-card-text>
          <v-row>
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
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.email }} - {{ item.membershipType }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-col>
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
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.Author }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-col>
          </v-row>
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

      <!-- Préstamos Activos -->
      <v-card class="mb-4">
        <v-card-title>
          <span class="headline">📚 Préstamos Activos</span>
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="calculateFines" class="mr-2">
            <v-icon left>mdi-calculator</v-icon>
            Calcular Multas
          </v-btn>
        </v-card-title>
        <v-data-table
          :headers="loanHeaders"
          :items="activeLoans"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.bookCover="{ item }">
            <v-avatar size="40" tile>
              <v-img :src="item.bookCover" :alt="item.bookTitle"></v-img>
            </v-avatar>
          </template>
          
          <template v-slot:item.dueDate="{ item }">
            <v-chip 
              :color="getDueDateColor(item.dueDate)" 
              dark 
              small
            >
              {{ formatDate(item.dueDate) }}
            </v-chip>
          </template>
          
          <template v-slot:item.renewals="{ item }">
            {{ item.renewals }}/{{ item.maxRenewals }}
          </template>
          
          <template v-slot:item.actions="{ item }">
            <v-btn 
              color="success" 
              small 
              @click="returnBook(item)"
              class="mr-1"
            >
              <v-icon small>mdi-keyboard-return</v-icon>
              Devolver
            </v-btn>
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

      <!-- Préstamos Vencidos con Multas -->
      <v-card v-if="overdueLoans.length > 0">
        <v-card-title>
          <span class="headline">⚠️ Préstamos Vencidos</span>
        </v-card-title>
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
          
          <template v-slot:item.fine="{ item }">
            <v-chip color="red" dark>
              ${{ item.fine }}
            </v-chip>
          </template>
          
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

    <!-- Diálogos de confirmación -->
    <v-dialog v-model="successDialog" width="500">
      <v-alert type="success">{{ successMessage }}</v-alert>
    </v-dialog>

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
      selectedUser: null,
      selectedBook: null,
      successDialog: false,
      errorDialog: false,
      successMessage: "",
      errorMessage: "",
      
      loanHeaders: [
        { text: 'Portada', value: 'bookCover', sortable: false },
        { text: 'Libro', value: 'bookTitle' },
        { text: 'Autor', value: 'bookAuthor' },
        { text: 'Usuario', value: 'userName' },
        { text: 'Email', value: 'userEmail' },
        { text: 'Fecha Vencimiento', value: 'dueDate' },
        { text: 'Renovaciones', value: 'renewals' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      
      overdueHeaders: [
        { text: 'Portada', value: 'bookCover', sortable: false },
        { text: 'Libro', value: 'bookTitle' },
        { text: 'Usuario', value: 'userName' },
        { text: 'Teléfono', value: 'userPhone' },
        { text: 'Multa', value: 'fine' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ]
    };
  },
  
  computed: {
    ...mapGetters([
      "Menu", 
      "activeLoans", 
      "overdueLoans", 
      "availableBooks", 
      "activeUsers"
    ])
  },
  
  methods: {
    ...mapActions([
      "loadAllData", 
      "createLoan", 
      "returnBook", 
      "calculateFines",
      "renewLoan"
    ]),
    
    // Crear nuevo préstamo usando las 3 tablas
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
    
    // Devolver libro (actualiza las 3 tablas)
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
    
    // Devolver libro con multa
    async returnBookWithFine(loan) {
      // Confirmar pago de multa
      if (confirm(`¿Confirma el pago de la multa de $${loan.fine}?`)) {
        await this.returnBook(loan);
      }
    },
    
    // Renovar préstamo
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
    
    // Calcular multas automáticamente
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
    
    // Utilidades
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-MX');
    },
    
    getDueDateColor(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'red';
      if (diffDays <= 3) return 'orange';
      return 'green';
    }
  },
  
  created() {
    this.loadAllData();
  }
};
</script>

<style>
.container.show {
  margin-left: 250px !important;
}
.v-data-table {
  background: white;
}
</style>