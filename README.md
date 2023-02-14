# Web Stem Player

This is a proof-of-concept project to create a multi-track player which works in the browser.

## Motivation

I have created this very simple application to see how the following technologies work

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Recoil](https://recoiljs.org/)

## Implementation

I have wrapped web audio functionalities into a custom hook called `useAudio` (see in `src/lib/hooks/use-audio.hook.ts`).

I have implemented state management using Recoil in `src/state/faders.state.ts` .

To build the frontend, I have used [Material UI](https://mui.com/) (MUI) controls.

## Implemented features

- Play
- Stop
- Solo
- Mute
- Set volume

## Source of audio files

https://github.com/mdn/webaudio-examples/tree/57346451fe5e695052ec0c350af8a7c75bf8a3ca/multi-track

## Ideas to implement

- Master fader
- Mute master
- Clear solo
- Display:
  - Audio length
  - Elapsed time
- Seeking in audio (i.e. move forward and back in the played audio)
- Spectrum analyser
