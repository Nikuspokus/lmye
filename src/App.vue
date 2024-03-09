<script setup>
// import HelloWorld from "./components/HelloWorld.vue";
import Navbar from "./components/Navbar.vue";
// import Presentation from "./components/Presentation.vue";
</script>

<template>
  <div class="containerH">
    <Navbar class="navbar" />
    <!-- <Presentation />  -->
    <!-- <HelloWorld class="corps" msg="Vite + Vue" /> -->
    <div class="test-image" id="home">
      <div class="logo" style="padding-top: 13em">
        <img src="./assets/logo-lettre.png" style="width: 200px" />
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
    <div class="bg-red-400 tutu" style="width: 100vw; height: 100vh" id="about">
      <div class="container">
        <div class="slideshow">
          <img
            src="./assets/arno-senoner-oCXVxwTFwqE-unsplash.jpg"
            style="width: 500px"
            class="fade"
          />
          <img
            src="./assets/aromateec--q9tuxLn4hA-unsplash.jpg"
            style="width: 500px"
            class="fade"
          />
          <img
            src="./assets/content-pixie-ZB4eQcNqVUs-unsplash.jpg"
            style="width: 500px"
            class="fade"
          />
          <img
            src="./assets/diana-light-nvQemFKRBUo-unsplash.jpg"
            style="width: 500px"
            class="fade"
          />
          <img
            src="./assets/laura-chouette-CtOA9wbFAdQ-unsplash.jpg"
            style="width: 500px"
            class="fade"
          />
        </div>
      </div>
    </div>
    <div class="bg-violet-300" style="width: 100vw; height: 100vh" id="galerie">
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
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  z-index: 1000;
}

.container {
  width: 20em;
  position: relative;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  overflow: hidden;
}

.wrapperFade {
  display: flex;
  opacity: 0;
  object-fit: cover; /* Pour s'assurer que les images couvrent bien le conteneur */
  animation: fadeEffect 14s infinite;
}

@keyframes fadeEffect {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  } /* Commence à apparaître */
  20% {
    opacity: 1;
  } /* Reste visible */
  25% {
    opacity: 0;
  } /* Commence à disparaître */
  100% {
    opacity: 0;
  }
}

.slideshow {
  position: relative;
  width: 100%; /* Ajustez à la largeur souhaitée */
  height: 400px; /* Ajustez à la hauteur souhaitée */
}

.slideshow img {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  object-fit: cover; /* Pour s'assurer que les images couvrent bien le conteneur */
  animation: fadeEffect 14s infinite; /* 24s est la durée totale, ajustez selon le besoin */
}

/* Animation de l'effet de fondu */
@keyframes fadeEffect {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  } /* Commence à apparaître */
  20% {
    opacity: 1;
  } /* Reste visible */
  25% {
    opacity: 0;
  } /* Commence à disparaître */
  100% {
    opacity: 0;
  }
}

/* Timing de l'animation pour chaque image */
.slideshow img:nth-child(1) {
  animation-delay: 0s;
}

.slideshow img:nth-child(2) {
  animation-delay: 8s; /* Ajustez le délai pour chaque image */
}

.slideshow img:nth-child(3) {
  animation-delay: 16s;
}

.wrapperFade img:nth-child(1) {
  animation-delay: 0s;
}

.wrapperFade img:nth-child(2) {
  animation-delay: 8s; /* Ajustez le délai pour chaque image */
}

.wrapperFade img:nth-child(3) {
  animation-delay: 16s;
}
/*.wrapper {
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
}*/

.test-image {
  max-width: 100%;
  height: 100vh;
  background-color: #382961;
}

.wrapper2 {
  padding: 10em;
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
.containerH {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  scroll-behavior: smooth;
  /* Additional styling for container */
}
.item {
  scroll-snap-align: start;
  flex: none; /* Prevent flexbox from stretching the items */
  width: 100vw; /* Example width, can be adjusted */
  /* Additional styling for items */
}
</style>
