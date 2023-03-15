<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { defaultVolume, useFadersStore } from "../stores/faders.store";

const fadersStore = useFadersStore();

const props = defineProps<{
  trackIndex: number;
  trackLabel: string;
  minDb: number;
  maxDb: number;
}>();

const inputId = computed(
  () => `track-fader_${props.trackIndex}_${props.trackLabel}`
);
const volume = fadersStore.volume(props.trackIndex);

const emit = defineEmits(["setVolume"]);

watchEffect(() => emit("setVolume", volume));
</script>

<template>
  <div class="track">
    <label :for="inputId">{{ trackLabel }}</label>
    <input
      :id="inputId"
      type="range"
      :min="minDb"
      :max="maxDb"
      orient="vertical"
      v-model="volume"
      @dblclick="volume = defaultVolume"
    />
  </div>
</template>

<style scoped>
.track {
  display: flex;
  flex-direction: column;
  margin: 2em;
  width: 5em;
}
</style>
