import axios from "axios";

// Estado global para entidad books y estado de UI
const state = {
  libros: "",      // Almacena datos de entidad books desde API
  favoritos: "",   // Array filtrado de books donde favorite=true
  menu: false      // Estado de UI para binding condicional
};

// Getters: computed properties que procesan datos de entidad
const getters = {
  // Getter que expone datos completos de entidad books
  allBooks: state => state.libros,
  // Getter para estado de UI usado en binding condicional
  Menu: state => state.menu,
  // Getter que filtra entidad books por campo favorite
  FavoriteList: state => state.favoritos
};

// Actions: métodos asincrónicos que consumen API REST
const actions = {
  // Acción que consume API GET /books para obtener entidad completa
  async getBooks({ commit }) {
    try {
      const res = await axios.get("http://localhost:5000/books");
      // Commit: actualiza estado con datos de entidad books
      commit("SetBooks", res.data);
      // Commit: actualiza array filtrado automáticamente
      commit("FavoriteList");
    } catch (err) {
      console.error(err);
    }
  },
  
  // Acción que consume API POST /books para crear nuevo registro
  async addBook({ commit }, libro) {
    console.log(libro);
    try {
      const res = await axios.post("http://localhost:5000/books", libro);
      console.log(res.data);
      // Commit: agrega nuevo registro a estado local
      commit("Add", res.data);
      // Commit: actualiza lista filtrada de favoritos
      commit("FavoriteList");
    } catch (err) {
      console.error(err);
    }
  },
  
  // Acción que consume API DELETE /books/:id para eliminar registro
  async deleteBook({ commit }, id) {
    console.log(id);
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      // Commit: remueve registro del estado local
      commit("Delete", id);
    } catch (err) {
      console.error(err);
    }
  },
  
  // Acción que consume API PUT /books/:id para actualizar campo favorite
  async ToggleFavorite({ commit }, libro) {
    try {
      const res = await axios.put(
        `http://localhost:5000/books/${libro.id}`,
        libro
      );
      console.log(res.data);
      // Commit: actualiza registro en estado local
      commit("Favorite", libro);
      // Commit: recalcula lista de favoritos
      commit("FavoriteList");
    } catch (err) {
      console.error(err);
    }
  }
};

// Mutations: modifican estado de entidad books inmediatamente
const mutations = {
  // Mutation: inicializa estado con datos completos de entidad
  SetBooks: (state, libros) => (state.libros = libros),
  
  // Mutation: agrega nuevo registro a entidad books local
  Add: (state, libro) => (state.libros = [...state.libros, libro]),
  
  // Mutation: elimina registro de entidad books por ID
  Delete: (state, id) => {
    state.libros = state.libros.filter(libro => libro.id !== id);
  },
  
  // Mutation: marca registro como modificado (usado por API PUT)
  Favorite: libro => {
    libro;
  },
  
  // Mutation: alterna estado de UI para binding condicional
  ToggleMenu: state => {
    state.menu = !state.menu;
  },
  
  // Mutation: filtra entidad books por campo favorite=true
  FavoriteList: state => {
    state.favoritos = state.libros.filter(libro => {
      return libro.favorite == true;
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};