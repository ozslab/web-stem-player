<script setup lang="ts">
import { computed, ref } from "vue";
import Player from "./components/player.vue";
import Track from "./components/track.vue";
import { useAudio } from "./composables/use-audio";
import { getFileNameWithoutExtension } from "./utils/file.util";

const baseUrl = "audio/";

const audioFileNames = ref([
  "drums.mp3",
  "bassguitar.mp3",
  "clav.mp3",
  "leadguitar.mp3",
  "horns.mp3",
]);

const audioFileUrls = computed(() =>
  audioFileNames.value.map((audioFileName) => baseUrl + audioFileName)
);

const { isReady, setVolume, start, stop } = useAudio(audioFileUrls);
</script>

<template>
  <div v-if="isReady">
    <Player @start="start" @stop="stop" />
    <div class="container__track">
      <div
        v-for="(audioFileUrl, trackIndex) in audioFileUrls"
        :key="audioFileUrl"
      >
        <Track
          :trackLabel="getFileNameWithoutExtension(audioFileNames[trackIndex])"
          :trackIndex="trackIndex"
          :minDb="-40"
          :maxDb="10"
        />
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<style scoped>
.container__track {
  display: flex;
  flex-direction: row;
}
</style>
