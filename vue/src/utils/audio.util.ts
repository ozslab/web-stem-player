import { IAudioContext } from "standardized-audio-context";

export async function decodeAudioData(
  audioContext: IAudioContext,
  audioArrayBuffer: ArrayBuffer
): Promise<AudioBuffer> {
  const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);
  return audioBuffer;
}

export function formatAsDb(value: number): string {
  return `${value}dB`;
}

export function convertToGain(volumeInDb: number) {
  return Math.pow(10, volumeInDb / 20);
}
