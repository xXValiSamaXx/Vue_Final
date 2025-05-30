import axios from "axios";

// Estado global: almacena datos de las 3 entidades principales
const state = {
  books: [],  // Entidad 1: tabla de libros
  users: [],  // Entidad 2: tabla de usuarios  
  loans: [],  // Entidad 3: tabla de préstamos
  menu: false
};

// Getters: computed properties que procesan datos de múltiples entidades
const getters = {
  // Getters básicos para acceso a cada entidad
  allBooks: state => state.books,
  allUsers: state => state.users,
  allLoans: state => state.loans,
  Menu: state => state.menu,
  
  // Getter complejo: combina las 3 entidades en una vista unificada
  loansWithDetails: state => {
    return state.loans.map(loan => {
      // Relaciona entidad loans con books mediante bookId
      const book = state.books.find(book => book.id === loan.bookId);
      // Relaciona entidad loans con users mediante userId
      const user = state.users.find(user => user.id === loan.userId);
      return {
        ...loan,
        // Campos de entidad books
        bookTitle: book ? book.title : 'Libro no encontrado',
        bookAuthor: book ? book.Author : '',
        bookCover: book ? book.cover : '',
        // Campos de entidad users
        userName: user ? user.name : 'Usuario no encontrado',
        userEmail: user ? user.email : '',
        userPhone: user ? user.phone : ''
      };
    });
  },
  
  // Getter que filtra datos combinados por estado
  activeLoans: (state, getters) => {
    return getters.loansWithDetails.filter(loan => loan.status === 'active');
  },
  
  // Getter que filtra préstamos vencidos con datos de las 3 entidades
  overdueLoans: (state, getters) => {
    return getters.loansWithDetails.filter(loan => loan.status === 'overdue');
  },
  
  // Getter que filtra entidad books por disponibilidad
  availableBooks: state => {
    return state.books.filter(book => book.available === true);
  },
  
  // Getter que filtra entidad users por estado activo
  activeUsers: state => {
    return state.users.filter(user => user.active === true);
  }
};

// Actions: métodos asincrónicos que consumen API y procesan múltiples entidades
const actions = {
  // Acción que consume API de las 3 entidades simultáneamente
  async loadAllData({ commit }) {
    try {
      // Consumo paralelo de 3 endpoints de API usando Promise.all
      const [booksRes, usersRes, loansRes] = await Promise.all([
        axios.get("http://localhost:5000/books"),   // API entidad books
        axios.get("http://localhost:5000/users"),   // API entidad users
        axios.get("http://localhost:5000/loans")    // API entidad loans
      ]);
      
      // Commit: actualiza estado con datos de las 3 entidades
      commit("setBooks", booksRes.data);
      commit("setUsers", usersRes.data);
      commit("setLoans", loansRes.data);
      
      return { success: true };
    } catch (err) {
      console.error("Error loading data:", err);
      return { success: false, error: err.message };
    }
  },

  // Acción compleja: crea préstamo afectando múltiples entidades
  async createLoan({ commit, state }, { userId, bookId }) {
    try {
      // Validación usando entidad books
      const book = state.books.find(b => b.id === parseInt(bookId));
      if (!book || !book.available) {
        return { success: false, error: "El libro no está disponible" };
      }

      // Validación usando entidad users
      const user = state.users.find(u => u.id === parseInt(userId));
      if (!user || !user.active) {
        return { success: false, error: "El usuario no está activo" };
      }

      // Lógica de negocio: cálculo de fechas para entidad loans
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setMonth(dueDate.getMonth() + 1); // 1 mes de préstamo
      
      // Objeto para nueva entrada en entidad loans
      const newLoan = {
        userId: parseInt(userId),    // FK a entidad users
        bookId: parseInt(bookId),    // FK a entidad books
        loanDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        returnDate: null,
        status: 'active',
        fine: 0,
        renewals: 0,
        maxRenewals: 2
      };
      
      // POST a API: crea registro en entidad loans
      const loanRes = await axios.post("http://localhost:5000/loans", newLoan);
      
      // PUT a API: actualiza entidad books (disponibilidad)
      const updatedBook = { ...book, available: false };
      await axios.put(`http://localhost:5000/books/${bookId}`, updatedBook);
      
      // Mutations: actualiza estado local de múltiples entidades
      commit("addLoan", loanRes.data);
      commit("updateBookAvailability", { bookId: parseInt(bookId), available: false });
      
      return { success: true, loan: loanRes.data };
    } catch (err) {
      console.error("Error creating loan:", err);
      return { success: false, error: err.message };
    }
  },

  // Acción que actualiza múltiples entidades al devolver libro
  async returnBook({ commit, state }, { loanId, bookId }) {
    try {
      // PATCH a API: actualiza entidad loans
      const today = new Date().toISOString().split('T')[0];
      const updatedLoanData = {
        returnDate: today,
        status: 'returned'
      };
      
      await axios.patch(`http://localhost:5000/loans/${loanId}`, updatedLoanData);
      
      // PUT a API: actualiza entidad books (disponibilidad)
      const book = state.books.find(b => b.id === parseInt(bookId));
      if (book) {
        const updatedBook = { ...book, available: true };
        await axios.put(`http://localhost:5000/books/${bookId}`, updatedBook);
      }
      
      // Mutations: sincroniza estado local de ambas entidades
      commit("updateLoan", { loanId: parseInt(loanId), updates: updatedLoanData });
      commit("updateBookAvailability", { bookId: parseInt(bookId), available: true });
      
      return { success: true };
    } catch (err) {
      console.error("Error returning book:", err);
      return { success: false, error: err.message };
    }
  },

  // Acción que procesa entidad loans para calcular multas
  async calculateFines({ commit, state }) {
    try {
      const today = new Date();
      const updates = [];
      
      // Iteración sobre entidad loans para lógica de negocio
      for (const loan of state.loans) {
        if (loan.status === 'active' && !loan.returnDate) {
          const dueDate = new Date(loan.dueDate);
          if (today > dueDate) {
            // Cálculo de multa: $10 por día de retraso
            const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
            const fine = daysLate * 10;
            
            const updatedLoan = {
              status: 'overdue',
              fine: fine
            };
            
            // PATCH a API: actualiza registro específico en entidad loans
            await axios.patch(`http://localhost:5000/loans/${loan.id}`, updatedLoan);
            
            // Mutation: actualiza estado local inmediatamente
            commit("updateLoan", { loanId: loan.id, updates: updatedLoan });
            updates.push({ loanId: loan.id, updates: updatedLoan });
          }
        }
      }
      
      return { success: true, updatedLoans: updates.length };
    } catch (err) {
      console.error("Error calculating fines:", err);
      return { success: false, error: err.message };
    }
  },

  // Acción que actualiza entidad loans con renovación
  async renewLoan({ commit }, { loanId, currentRenewals }) {
    try {
      // Validación de reglas de negocio
      if (currentRenewals >= 2) {
        return { success: false, error: "Máximo de renovaciones alcanzado" };
      }
      
      // Cálculo de nueva fecha de vencimiento
      const newDueDate = new Date();
      newDueDate.setMonth(newDueDate.getMonth() + 1);
      
      // Objeto con campos a actualizar en entidad loans
      const updates = {
        dueDate: newDueDate.toISOString().split('T')[0],
        renewals: currentRenewals + 1,
        status: 'active',
        fine: 0 // Reset multa al renovar
      };
      
      // PATCH a API: actualiza entidad loans
      await axios.patch(`http://localhost:5000/loans/${loanId}`, updates);
      
      // Mutation: actualiza estado local
      commit("updateLoan", { loanId: parseInt(loanId), updates });
      
      return { success: true };
    } catch (err) {
      console.error("Error renewing loan:", err);
      return { success: false, error: err.message };
    }
  }
};

// Mutations: modifican estado local de las entidades
const mutations = {
  // Mutations para inicializar datos de cada entidad
  setBooks: (state, books) => (state.books = books),
  setUsers: (state, users) => (state.users = users),
  setLoans: (state, loans) => (state.loans = loans),
  
  // Mutation: agrega nuevo registro a entidad loans
  addLoan: (state, loan) => {
    state.loans.push(loan);
  },
  
  // Mutation: actualiza registro específico en entidad loans
  updateLoan: (state, { loanId, updates }) => {
    const index = state.loans.findIndex(loan => loan.id === loanId);
    if (index !== -1) {
      state.loans[index] = { ...state.loans[index], ...updates };
    }
  },
  
  // Mutation: actualiza campo específico en entidad books
  updateBookAvailability: (state, { bookId, available }) => {
    const book = state.books.find(book => book.id === bookId);
    if (book) {
      book.available = available;
    }
  },
  
  // Mutation para estado de UI
  ToggleMenu: state => {
    state.menu = !state.menu;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};