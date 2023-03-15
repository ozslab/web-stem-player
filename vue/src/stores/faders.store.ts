import { defineStore } from "pinia";
import { Ref, ref } from "vue";

interface FaderState {
  volume: Ref<number>;
  muted: Ref<boolean>;
  soloed: Ref<boolean>;
}

export const defaultVolume = 0;

const getDefaultFaderState = (): FaderState => ({
  volume: ref(defaultVolume),
  muted: ref(false),
  soloed: ref(false),
});

export const useFadersStore = defineStore("faders", () => {
  const faderState = new Map<number, FaderState>();

  const initFaderState = (trackIndex: number) =>
    faderState.set(trackIndex, getDefaultFaderState());

  const getCurrentFaderState = (trackIndex: number): FaderState => {
    const currentFaderState = faderState.get(trackIndex);
    if (currentFaderState) {
      return currentFaderState;
    }

    initFaderState(trackIndex);

    return faderState.get(trackIndex)!;
  };

  const volume = (trackIndex: number): Ref<number> =>
    getCurrentFaderState(trackIndex).volume;

  return { volume };
});
