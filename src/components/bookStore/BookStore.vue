<template>
  <div>
    <Header></Header>
    <Menu></Menu>
    <BookList></BookList>
  </div>
</template>

<script>
import Header from "../common/Header";
import Menu from "../common/Menu";
import BookList from "./BookList";
export default {
  name: "BookStore",
  components: {
    BookList,
    Menu,
    Header
  },
  data() {
    return {
      menu: false
    };
  }
};
</script>

<style>
</style>