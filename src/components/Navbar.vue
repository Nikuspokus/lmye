<script setup></script>

<template>
  <!-- <div style="background-color: darkorchid; color: white"> -->

  <div
    style="
      border-image: linear-gradient(to left, #743ad5, #d53a9d);
      line-height: 4.5;
    "
  >
    <div class="navbar border-1">
      <div style="background-color: #382961; line-height: 1.5">
        Bienvenue chez la Marque y est ! Livraison offerte à partir de 100€
      </div>
      <nav
        class="container py-0 mx-auto pt-0 md:flex md:justify-between md:items-center;"
      >
        <div class="flex items-center justify-between">
          <img src="../assets/lmye.svg" style="width: 200px" />

          <!-- Mobile menu button -->
          <div @click="showMenu = !showMenu" class="flex md:hidden">
            <button
              type="button"
              class="text-gray-800 hover:text-gray-400 focus:outline-none focus:text-gray-400"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
                <path
                  fill-rule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
        <ul
          :class="showMenu ? 'flex' : 'hidden'"
          class="flex-col mt-8 space-y-4 md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0"
        >
          <a
            href="#home"
            class="text-m font-light text-gray-800 hover:text-violet-400"
          >
            Home
          </a>
          <a
            href="#about"
            class="text-m font-light text-gray-800 hover:text-violet-400"
          >
            About
          </a>
          <a
            href="#galerie"
            class="text-m font-light text-gray-800 hover:text-violet-400"
          >
            Galerie
          </a>
          <a
            class="text-m font-light text-gray-800 hover:text-violet-400"
            href="#contact"
          >
            Contact
          </a>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.logo-marque {
  background-image: url("src\assets\lmye.svg");
}
.border-1 {
  border-bottom: 0.25rem solid;
  border-image: linear-gradient(to right, rgb(43, 2, 139), darkorchid) 1;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
}
</style>
