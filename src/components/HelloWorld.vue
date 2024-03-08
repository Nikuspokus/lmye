<script setup>
import { ref } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);

const reset = () => {
  count.value = 0;
};
</script>

<template>
  <div class="test-image">
    <div class="logo" style="padding-top: 13em">
      <img src="../assets/logo-lettre.png" style="width: 200px" />
    </div>
    <div class="toto" style="">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat
        obcaecati magni fugit? Vero molestias obcaecati dolorum, consectetur
        fuga necessitatibus dolor soluta! Pariatur quia quaerat aliquam quas
        amet repudiandae eos laborum.
      </p>
    </div>
  </div>
  <div class="bg-red-400 tutu" style="width: 100vw; height: 100vh">
    <div class="container">
      <div class="wrapper">
        <img
          src="../assets/arno-senoner-oCXVxwTFwqE-unsplash.jpg"
          style="width: 500px"
        />
        <img
          src="../assets/aromateec--q9tuxLn4hA-unsplash.jpg"
          style="width: 500px"
        />
        <img
          src="../assets/content-pixie-ZB4eQcNqVUs-unsplash.jpg"
          style="width: 500px"
        />
        <img
          src="../assets/diana-light-nvQemFKRBUo-unsplash.jpg"
          style="width: 500px"
        />
        <img
          src="../assets/laura-chouette-CtOA9wbFAdQ-unsplash.jpg"
          style="width: 500px"
        />
      </div>
    </div>
  </div>
  <div class="bg-violet-300" style="width: 100vw; height: 100vh">
    <div class="wrapper2">
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
      <div>Five</div>
    </div>
  </div>
  <div class="bg-stone-300" style="width: 100vw; height: 100vh">
    <p>Configurateur</p>
  </div>
  <div class="bg-amber-300" style="width: 100vw; height: 100vh" id="contact">
    <p>footer</p>
  </div>
</template>

<style scoped>
.container {
  width: 20em;
  position: relative;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  overflow: hidden;
}
.wrapper {
  display: flex;
  animation: slide 20s infinite;
}
@keyframes slide {
  0% {
    transform: translateX(0);
  }
  18% {
    transform: translateX(0%);
  }
  20% {
    transform: translateX(-100%);
  }
  38% {
    transform: translateX(-100%);
  }
  40% {
    transform: translateX(-200%);
  }
  58% {
    transform: translateX(-200%);
  }
  60% {
    transform: translateX(-300%);
  }
  78% {
    transform: translateX(-300%);
  }
  80% {
    transform: translateX(-400%);
  }
  98% {
    transform: translateX(-400%);
  }
}

.test-image {
  max-width: 100%;
  height: 100vh;
  background-color: #382961;
}

.wrapper2 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 3em;
  row-gap: 3em;
}

.wrapper2 > div {
  border: 2px solid #ffa94d;
  border-radius: 5px;
  background-color: #ffd8a8;
  padding: 8em;
  color: #d9480f;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.toto {
  word-wrap: break-word;
  width: 600px;
  margin: 0 auto;
  padding-top: 5em;
}
</style>
