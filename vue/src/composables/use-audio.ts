import {
  AudioContext,
  IAudioBufferSourceNode,
  IAudioContext,
  IGainNode,
} from "standardized-audio-context";
import { convertToGain, decodeAudioData } from "../utils/audio.util";
import { loadFile } from "../utils/file.util";
import { onMounted, Ref, ref } from "vue";

const createGainNode = (audioContext: IAudioContext) => {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 1; // setting it to 100%
  return gainNode;
};

export function useAudio(audioFilePaths: Ref<string[]>) {
  const audioContext: AudioContext = new AudioContext();

  let isPlaying = false;
  let audioBuffers: AudioBuffer[] = [];
  let trackSources: IAudioBufferSourceNode<IAudioContext>[] = [];
  let gainNodes: IGainNode<IAudioContext>[] = [];

  const isReady = ref<boolean>(false);

  const getAudioBuffers = (
    audioContext: AudioContext,
    audioFilePaths: string[]
  ): Promise<AudioBuffer[]> =>
    Promise.all(
      audioFilePaths.map(async (audioFilePath) => {
        const audioArrayBuffer = await loadFile(audioFilePath);
        const audioBuffer = await decodeAudioData(
          audioContext,
          audioArrayBuffer
        );
        return audioBuffer;
      })
    );

  onMounted(async () => {
    audioBuffers = await getAudioBuffers(audioContext, audioFilePaths.value);
    isReady.value = true;
  });

  const stop = () => {
    if (isPlaying) {
      trackSources.forEach((trackSource) => {
        if (trackSource) {
          trackSource.stop();
        }
      });
      isPlaying = false;
    }
  };

  const initTracks = (
    audioContext: IAudioContext,
    audioBuffers: AudioBuffer[]
  ) => {
    trackSources = [];
    gainNodes = [];
    audioBuffers.forEach((audioBuffer) => {
      const trackSrc = audioContext.createBufferSource();
      trackSrc.buffer = audioBuffer;
      const gainNode = createGainNode(audioContext);
      gainNodes.push(gainNode);
      gainNode.connect(audioContext.destination);
      trackSrc.connect(gainNode).connect(audioContext.destination);
      trackSources.push(trackSrc);
    });
  };

  const start = () => {
    stop();

    initTracks(audioContext, audioBuffers);
    trackSources.forEach((trackSource) => {
      trackSource.start();
    });

    isPlaying = true;
  };

  const setVolume = (trackIndex: number, volumeInDb: number) => {
    const newGain = convertToGain(volumeInDb);
    const gainNode = gainNodes[trackIndex];
    if (gainNode) {
      gainNode.gain.value = newGain;
    }
  };

  return { isReady, start, stop, setVolume };
}
