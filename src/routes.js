// Importación de componentes que manejan diferentes aspectos de las entidades
import BookStore from "./components/bookStore/BookStore.vue";      // Componente que muestra entidad books
import AddBook from "./components/bookStore/AddBook.vue";          // Componente que crea registros en entidad books
import DeleteBook from "./components/bookStore/DeleteBook.vue";    // Componente que elimina registros de entidad books
import Favourite from "./components/bookStore/Favourite.vue";      // Componente que filtra entidad books por favorite=true
import LoanManagement from "./components/loans/LoanManagement.vue"; // Componente que maneja las 3 entidades relacionadas

// Configuración de rutas: mapea URLs a componentes específicos
export const routes = [
  // Ruta raíz: muestra componente que consume API GET /books
  { path: "", name: "home", component: BookStore },
  
  // Ruta para crear: navega a componente con formulario que hace POST /books
  { path: "/addBook", name: "addBook", component: AddBook },
  
  // Ruta para eliminar: navega a componente que hace DELETE /books/:id
  { path: "/deleteBook", name: "deleteBook", component: DeleteBook },
  
  // Ruta para favoritos: navega a componente que filtra entidad books
  { path: "/favourite", name: "favourite", component: Favourite },
  
  // Ruta para préstamos: navega a componente que maneja 3 entidades (books, users, loans)
  { path: "/loans", name: "loans", component: LoanManagement },
  
  // Redirector: cualquier ruta no definida redirige a componente principal
  { path: "*", redirect: "/" }
];