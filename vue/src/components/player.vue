<script setup lang="ts">
const emit = defineEmits(["start", "stop"]);

function start() {
  emit("start");
}

function stop() {
  emit("stop");
}
</script>

<template>
  <div class="stack--row">
    <button @click="start">Play</button>
    <button @click="stop">Stop</button>
  </div>
</template>

<style scoped>
.stack--row {
  display: flex;
  flex-direction: row;
}
</style>
