import BookStore from "./components/bookStore/BookStore.vue";
import AddBook from "./components/bookStore/AddBook.vue";
import DeleteBook from "./components/bookStore/DeleteBook.vue";
import Favourite from "./components/bookStore/Favourite.vue";
import LoanManagement from "./components/loans/LoanManagement.vue";

export const routes = [
  { path: "", name: "home", component: BookStore },
  { path: "/addBook", name: "addBook", component: AddBook },
  { path: "/deleteBook", name: "deleteBook", component: DeleteBook },
  { path: "/favourite", name: "favourite", component: Favourite },
  { path: "/loans", name: "loans", component: LoanManagement },
  // redirector
  { path: "*", redirect: "/" }
];