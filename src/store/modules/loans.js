import axios from "axios";

const state = {
  books: [],
  users: [],
  loans: [],
  menu: false
};

const getters = {
  allBooks: state => state.books,
  allUsers: state => state.users,
  allLoans: state => state.loans,
  Menu: state => state.menu,
  
  // Getter que combina las 3 tablas - PROCESO COMPLETO
  loansWithDetails: state => {
    return state.loans.map(loan => {
      const book = state.books.find(book => book.id === loan.bookId);
      const user = state.users.find(user => user.id === loan.userId);
      return {
        ...loan,
        bookTitle: book ? book.title : 'Libro no encontrado',
        bookAuthor: book ? book.Author : '',
        bookCover: book ? book.cover : '',
        userName: user ? user.name : 'Usuario no encontrado',
        userEmail: user ? user.email : '',
        userPhone: user ? user.phone : ''
      };
    });
  },
  
  // Préstamos activos con detalles
  activeLoans: (state, getters) => {
    return getters.loansWithDetails.filter(loan => loan.status === 'active');
  },
  
  // Préstamos vencidos con multas
  overdueLoans: (state, getters) => {
    return getters.loansWithDetails.filter(loan => loan.status === 'overdue');
  },
  
  // Libros disponibles para préstamo
  availableBooks: state => {
    return state.books.filter(book => book.available === true);
  },
  
  // Usuarios activos
  activeUsers: state => {
    return state.users.filter(user => user.active === true);
  }
};

const actions = {
  // Cargar datos de las 3 tablas
  async loadAllData({ commit }) {
    try {
      const [booksRes, usersRes, loansRes] = await Promise.all([
        axios.get("http://localhost:5000/books"),
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/loans")
      ]);
      
      commit("setBooks", booksRes.data);
      commit("setUsers", usersRes.data);
      commit("setLoans", loansRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  },

  // PROCESO: Crear préstamo
  async createLoan({ commit, dispatch }, { userId, bookId }) {
    try {
      // 1. Crear el préstamo
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setMonth(dueDate.getMonth() + 1); // 1 mes de préstamo
      
      const newLoan = {
        userId: parseInt(userId),
        bookId: parseInt(bookId),
        loanDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        returnDate: null,
        status: 'active',
        fine: 0,
        renewals: 0,
        maxRenewals: 2
      };
      
      const loanRes = await axios.post("http://localhost:5000/loans", newLoan);
      commit("addLoan", loanRes.data);
      
      // 2. Actualizar disponibilidad del libro
      await dispatch('updateBookAvailability', { bookId, available: false });
      
      return { success: true, loan: loanRes.data };
    } catch (err) {
      console.error("Error creating loan:", err);
      return { success: false, error: err.message };
    }
  },

  // PROCESO: Devolver libro (actualiza las 3 tablas)
  async returnBook({ commit, dispatch }, { loanId, bookId }) {
    try {
      // 1. Actualizar el préstamo
      const today = new Date().toISOString().split('T')[0];
      const updatedLoan = {
        returnDate: today,
        status: 'returned'
      };
      
      await axios.patch(`http://localhost:5000/loans/${loanId}`, updatedLoan);
      commit("updateLoan", { loanId, updates: updatedLoan });
      
      // 2. Actualizar disponibilidad del libro
      await dispatch('updateBookAvailability', { bookId, available: true });
      
      return { success: true };
    } catch (err) {
      console.error("Error returning book:", err);
      return { success: false, error: err.message };
    }
  },

  // PROCESO: Calcular y aplicar multas (usa las 3 tablas)
  async calculateFines({ commit, state }) {
    try {
      const today = new Date();
      const updates = [];
      
      for (const loan of state.loans) {
        if (loan.status === 'active' && !loan.returnDate) {
          const dueDate = new Date(loan.dueDate);
          if (today > dueDate) {
            const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
            const fine = daysLate * 10; // $10 por día de retraso
            
            const updatedLoan = {
              status: 'overdue',
              fine: fine
            };
            
            await axios.patch(`http://localhost:5000/loans/${loan.id}`, updatedLoan);
            updates.push({ loanId: loan.id, updates: updatedLoan });
          }
        }
      }
      
      // Actualizar el estado local
      updates.forEach(update => {
        commit("updateLoan", update);
      });
      
      return { success: true, updatedLoans: updates.length };
    } catch (err) {
      console.error("Error calculating fines:", err);
      return { success: false, error: err.message };
    }
  },

  // Auxiliar: Actualizar disponibilidad del libro
  async updateBookAvailability({ commit }, { bookId, available }) {
    try {
      await axios.patch(`http://localhost:5000/books/${bookId}`, { available });
      commit("updateBookAvailability", { bookId, available });
    } catch (err) {
      console.error("Error updating book availability:", err);
    }
  },

  // Renovar préstamo
  async renewLoan({ commit }, { loanId, currentRenewals }) {
    try {
      if (currentRenewals >= 2) {
        return { success: false, error: "Máximo de renovaciones alcanzado" };
      }
      
      const newDueDate = new Date();
      newDueDate.setMonth(newDueDate.getMonth() + 1);
      
      const updates = {
        dueDate: newDueDate.toISOString().split('T')[0],
        renewals: currentRenewals + 1,
        status: 'active',
        fine: 0 // Reset multa al renovar
      };
      
      await axios.patch(`http://localhost:5000/loans/${loanId}`, updates);
      commit("updateLoan", { loanId, updates });
      
      return { success: true };
    } catch (err) {
      console.error("Error renewing loan:", err);
      return { success: false, error: err.message };
    }
  }
};

const mutations = {
  setBooks: (state, books) => (state.books = books),
  setUsers: (state, users) => (state.users = users),
  setLoans: (state, loans) => (state.loans = loans),
  
  addLoan: (state, loan) => {
    state.loans.push(loan);
  },
  
  updateLoan: (state, { loanId, updates }) => {
    const index = state.loans.findIndex(loan => loan.id === loanId);
    if (index !== -1) {
      state.loans[index] = { ...state.loans[index], ...updates };
    }
  },
  
  updateBookAvailability: (state, { bookId, available }) => {
    const book = state.books.find(book => book.id === bookId);
    if (book) {
      book.available = available;
    }
  },
  
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