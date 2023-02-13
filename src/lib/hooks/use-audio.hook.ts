import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  AudioContext,
  IAudioBufferSourceNode,
  IAudioContext,
  IGainNode,
} from "standardized-audio-context";
import { trackVolumesState } from "../../state/faders.state";
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

const createGainNode = (audioContext: IAudioContext, value: number) => {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 1; // setting it to 100%
  return gainNode;
};

export function useAudio(audioFilePaths: string[]) {
  const { audioContext, audioBuffers, isReady } =
    useAudioContext(audioFilePaths);
  const [isPlaying, setIsPlaying] = useState(false);
  const trackVolumes = useRecoilValue(trackVolumesState);
  const [trackSources] = useState<IAudioBufferSourceNode<IAudioContext>[]>([]);
  const [gainNodes] = useState<IGainNode<IAudioContext>[]>([]);

  useEffect(() => {
    trackVolumes.forEach((trackVolume: number, trackIndex: number) =>
      setVolume(trackIndex, trackVolume)
    );
  });

  const stop = () => {
    if (isPlaying) {
      trackSources.forEach((trackSource) => {
        if (trackSource) {
          trackSource.stop();
        }
      });
      setIsPlaying(false);
    }
  };

  const initTracks = (
    audioContext: IAudioContext | null,
    audioBuffers: AudioBuffer[],
    trackVolumes: number[]
  ) => {
    if (audioContext) {
      trackSources.length = 0;
      gainNodes.length = 0;
      audioBuffers.forEach((audioBuffer, trackIndex) => {
        const trackSrc = audioContext.createBufferSource();
        trackSrc.buffer = audioBuffer;
        const gainNode = createGainNode(
          audioContext,
          convertToGain(trackVolumes[trackIndex])
        );
        gainNodes.push(gainNode);
        gainNode.connect(audioContext.destination);
        trackSrc.connect(gainNode).connect(audioContext.destination);
        trackSources.push(trackSrc);
      });
    }
  };

  const start = () => {
    stop();
    setTimeout(() => {
      initTracks(audioContext, audioBuffers, trackVolumes);
      trackSources.forEach((trackSource) => {
        trackSource.start();
      });
      setIsPlaying(true);
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
