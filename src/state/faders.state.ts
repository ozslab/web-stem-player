import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { createArrayWithIndices } from "../lib/utils/array.util";

interface TrackState {
  volume: number;
  muted: boolean;
  soloed: boolean;
}

const getDefaultTrackState = (): TrackState => ({
  volume: 0,
  muted: false,
  soloed: false,
});

const trackIndicesState = atom<number[]>({
  key: "trackIndicesState",
  default: [],
});

const tracksState = atomFamily<TrackState, number>({
  key: "tracksState",
  default: getDefaultTrackState(),
});

export const trackCountState = selector<number>({
  key: "trackCountState",
  get: ({ get }) => get(trackIndicesState).length,
  set: ({ set }, newTrackCount) => {
    set(trackIndicesState, createArrayWithIndices(newTrackCount as number));
    for (let trackIndex = 0; trackIndex < newTrackCount; ++trackIndex) {
      set(tracksState(trackIndex), getDefaultTrackState());
    }
  },
});

export const trackSoloedState = selectorFamily<boolean, number>({
  key: "trackSoloedState",
  get:
    (trackIndex) =>
    ({ get }) =>
      get(tracksState(trackIndex)).soloed,
  set:
    (trackIndex) =>
    ({ set }, newValue) => {
      set(tracksState(trackIndex), (prev) => ({
        ...prev,
        soloed: newValue as boolean,
      }));
    },
});

const hasSoloedTrackState = selector<boolean>({
  key: "hasSoloedTrackState",
  get: ({ get }) =>
    get(trackIndicesState)
      .map((trackIndex) => get(trackSoloedState(trackIndex)))
      .includes(true),
});

export const trackMutedState = selectorFamily<boolean, number>({
  key: "trackMutedState",
  get:
    (trackIndex) =>
    ({ get }) => {
      const trackState = get(tracksState(trackIndex));
      const hasSoloedTracks = get(hasSoloedTrackState);
      return trackState.muted || (hasSoloedTracks && !trackState.soloed);
    },
  set:
    (trackIndex) =>
    ({ set }, newValue) => {
      set(tracksState(trackIndex), (prev) => ({
        ...prev,
        muted: newValue as boolean,
      }));
    },
});

export const trackVolumeState = selectorFamily<number, number>({
  key: "trackVolumeState",
  get:
    (trackIndex) =>
    ({ get }) =>
      get(tracksState(trackIndex)).volume,
  set:
    (trackIndex) =>
    ({ set }, newValue) => {
      set(tracksState(trackIndex), (prev) => ({
        ...prev,
        volume: newValue as number,
      }));
    },
});

export const trackVolumesState = selector<number[]>({
  key: "trackVolumesState",
  get: ({ get }) =>
    get(trackIndicesState).map((trackIndex) =>
      get(trackMutedState(trackIndex))
        ? -Infinity
        : get(trackVolumeState(trackIndex))
    ),
});
