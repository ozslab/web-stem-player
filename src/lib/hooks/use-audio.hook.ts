import { useEffect, useState } from "react";
import { AudioContext, IAudioBufferSourceNode, IAudioContext, IGainNode } from 'standardized-audio-context';
import { convertToGain, decodeAudioData } from "../utils/audio.util";
import { loadFile } from "../utils/file.util";

const useAudioContext = (audioFilePaths: string[]) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffers, setAudioBuffers] = useState<AudioBuffer[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function initAudioContext(audioFilePaths: string[]) {
      const audioCtx = new AudioContext();
      setAudioContext(audioCtx);

      const audioBufs = await Promise.all(
        audioFilePaths.map(async (audioFilePath) => {
          const audioArrayBuffer = await loadFile(audioFilePath);
          const audioBuf = await decodeAudioData(audioCtx, audioArrayBuffer);
          return audioBuf;
        })
      );
      setAudioBuffers(audioBufs);
      setIsReady(true);
    }
    initAudioContext(audioFilePaths);
  }, [audioFilePaths]);

  return { audioContext, audioBuffers, isReady };
};

export function useAudio(audioFilePaths: string[]) {
  const { audioContext, audioBuffers, isReady } =
    useAudioContext(audioFilePaths);
  const [trackSources, setTrackSources] = useState<
    (IAudioBufferSourceNode<IAudioContext> | null)[]
  >([]);
  const [gainNodes, setGainNodes] = useState<IGainNode<IAudioContext>[]>([]);

  const start = () => {
    const trackSrcs: IAudioBufferSourceNode<IAudioContext>[] = [];
    const gainNodes: IGainNode<IAudioContext>[] = [];
    audioBuffers.forEach((audioBuffer, trackIndex) => {
      const trackSource = trackSources[trackIndex];
      if (trackSource) {
        trackSource.stop();
      }
      if (audioContext && audioBuffer) {
        const trackSrc = audioContext.createBufferSource();
        trackSrc.buffer = audioBuffer;
        const gainNode = audioContext.createGain();
        gainNodes.push(gainNode);
        gainNode.gain.value = 1; // setting it to 100%
        gainNode.connect(audioContext.destination);
        trackSrc.connect(gainNode).connect(audioContext.destination);
        trackSrc.start();
        trackSrcs.push(trackSrc);
      }
    });
    setTrackSources(trackSrcs);
    setGainNodes(gainNodes);
  };

  const stop = () => {
    trackSources.forEach((trackSource) => {
      if (trackSource) {
        trackSource.stop();
      }
    });
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
