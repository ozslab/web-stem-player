import { atom, selector, selectorFamily } from "recoil";

type TracksVolumeState = { [key: number]: number };

type TracksMutedState = { [key: number]: boolean };

type TracksSoloedState = { [key: number]: boolean };

export const tracksVolumeState = atom<TracksVolumeState>({
  key: "TracksVolumeState",
  default: {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  },
});

export const tracksMutedState = atom<TracksMutedState>({
  key: "TracksMutedState",
  default: {
    0: false,
    1: false,
    2: false,
    3: false,
  },
});

export const tracksSoloedState = atom<TracksSoloedState>({
  key: "TracksSoloedState",
  default: {
    0: false,
    1: false,
    2: false,
    3: false,
  },
});

export const trackVolumeState = selectorFamily<number, number>({
  key: "TrackVolumeState",
  get:
    (trackIndex) =>
    ({ get }) =>
      get(tracksVolumeState)[trackIndex],
  set:
    (trackIndex) =>
    ({ set }, newValue) =>
      set(tracksVolumeState, (prevState) => {
        return {
          ...prevState,
          [trackIndex]: newValue as number,
        };
      }),
});

export const hasSoloedTrackState = selector<boolean>({
  key: "HasSoloedTrackState",
  get: ({ get }) => Object.values(get(tracksSoloedState)).indexOf(true) !== -1,
});

export const trackMutedState = selectorFamily<boolean, number>({
  key: "TrackMutedState",
  get:
    (trackIndex) =>
    ({ get }) =>
      get(tracksMutedState)[trackIndex] ||
      (get(hasSoloedTrackState) && !get(tracksSoloedState)[trackIndex]),
  set:
    (trackIndex) =>
    ({ set }, newValue) =>
      set(tracksMutedState, (prevState) => ({
        ...prevState,
        [trackIndex]: newValue as boolean,
      })),
});

export const trackSoloedState = selectorFamily<boolean, number>({
  key: "TrackSoloedState",
  get:
    (trackIndex) =>
    ({ get }) =>
      get(tracksSoloedState)[trackIndex],
  set:
    (trackIndex) =>
    ({ set }, newValue) =>
      set(tracksSoloedState, (prevState) => ({
        ...prevState,
        [trackIndex]: newValue as boolean,
      })),
});
