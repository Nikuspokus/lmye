<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import Navbar from "./components/Navbar.vue";
// import Presentation from "./components/Presentation.vue";
</script>

<template>
  <Navbar class="navbar" />
  <!-- <Presentation />  -->
  <HelloWorld class="corps" msg="Vite + Vue" />
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  z-index: 1000;
}
</style>
