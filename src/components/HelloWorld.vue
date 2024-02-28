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
  <div class="test-image red-filter">
    <h1 class="py-9">{{ msg }}</h1>
    <div class="card">
      <div type="button">count is {{ count }}</div>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
      <button
        class="btn bg-fuchsia-950 hover:bg-fuchsia-700 tototo"
        @click="count++"
      >
        Click me
      </button>

      <p>
        Check out
        <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
          >create-vue</a
        >, the official Vue + Vite starter
      </p>
      <p>
        Install
        <a href="https://github.com/vuejs/language-tools" target="_blank"
          >Volar</a
        >
        in your IDE for a better DX
      </p>
      <button @click="reset">reset</button>
      <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
    </div>
  </div>
  <div class="bg-stone-50" style="width: 100vw; height: 100vh"></div>
  <div class="bg-violet-50" style="width: 100vw; height: 100vh"></div>
  <div class="bg-stone-50" style="width: 100vw; height: 100vh"></div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.test-image {
  max-width: 100%;
  height: 70.9dvh;
  background-color: #382961;
}
</style>
