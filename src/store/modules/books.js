import axios from "axios";

const state = {
  libros: "",
  favoritos: "",
  menu: false
};

const getters = {
  allBooks: state => state.libros,
  Menu: state => state.menu,
  FavoriteList: state => state.favoritos
};

const actions = {
  async getBooks({ commit }) {
    try {
      const res = await axios.get("http://localhost:5000/books");
      commit("SetBooks", res.data);
      commit("FavoriteList");
    } catch (err) {
      console.error(err);
    }
  },
  
  async addBook({ commit }, libro) {
    console.log(libro);
    try {
      const res = await axios.post("http://localhost:5000/books", libro);
      console.log(res.data);
      commit("Add", res.data);
      commit("FavoriteList");
    } catch (err) {
      console.error(err);
    }
  },
  
  async deleteBook({ commit }, id) {
    console.log(id);
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      commit("Delete", id);
    } catch (err) {
      console.error(err);
    }
  },
  
  async ToggleFavorite({ commit }, libro) {
    try {
      const res = await axios.put(
        `http://localhost:5000/books/${libro.id}`,
        libro
      );
      console.log(res.data);
      commit("Favorite", libro);
      commit("FavoriteList");
    } catch (err) {
      console.error(err);
    }
  }
};

const mutations = {
  SetBooks: (state, libros) => (state.libros = libros),
  Add: (state, libro) => (state.libros = [...state.libros, libro]),
  Delete: (state, id) => {
    state.libros = state.libros.filter(libro => libro.id !== id);
  },
  Favorite: libro => {
    libro;
  },
  ToggleMenu: state => {
    state.menu = !state.menu;
  },
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