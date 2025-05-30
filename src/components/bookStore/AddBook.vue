<template>
  <div>
    <Header></Header>
    <Menu></Menu>
    <AddForm></AddForm>
  </div>
</template>

<script>
import Header from "../common/Header";
import Menu from "../common/Menu";
import AddForm from "./AddForm";
export default {
  name: "AddBook",
  components: {
    Menu,
    Header,
    AddForm
  },
  data() {
    return {
      menu: false
    };
  }
};
</script>

<style>
.menu0.show .container {
  margin-left: 250px !important;
}
</style>