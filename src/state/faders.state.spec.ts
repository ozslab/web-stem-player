import { it, describe, expect } from "vitest";
import { snapshot_UNSTABLE } from "recoil";
import {
  trackCountState,
  trackMutedState,
  trackSoloedState,
  trackVolumesState,
  trackVolumeState,
} from "./faders.state";

describe("Setting track count", () => {
  it("should set track count", () => {
    const initialSnapshot = snapshot_UNSTABLE(({ set }) =>
      set(trackCountState, 5)
    );

    expect(initialSnapshot.getLoadable(trackCountState).valueOrThrow()).toBe(5);
  });

  it("should set default state for all tracks", () => {
    const initialSnapshot = snapshot_UNSTABLE(({ set }) =>
      set(trackCountState, 2)
    );

    expect(initialSnapshot.getLoadable(trackMutedState(0)).valueOrThrow()).toBe(
      false
    );
    expect(
      initialSnapshot.getLoadable(trackSoloedState(0)).valueOrThrow()
    ).toBe(false);
    expect(
      initialSnapshot.getLoadable(trackVolumeState(0)).valueOrThrow()
    ).toBe(0);
    expect(initialSnapshot.getLoadable(trackMutedState(1)).valueOrThrow()).toBe(
      false
    );
    expect(
      initialSnapshot.getLoadable(trackSoloedState(1)).valueOrThrow()
    ).toBe(false);
    expect(
      initialSnapshot.getLoadable(trackVolumeState(1)).valueOrThrow()
    ).toBe(0);
  });
});

describe("Setting volume", () => {
  it("should set volume", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 3);
      set(trackVolumeState(1), -10);
    });

    expect(testSnapshot.getLoadable(trackVolumeState(1)).valueOrThrow()).toBe(
      -10
    );
    expect(testSnapshot.getLoadable(trackVolumeState(0)).valueOrThrow()).toBe(
      0
    );
    expect(testSnapshot.getLoadable(trackVolumeState(2)).valueOrThrow()).toBe(
      0
    );
  });
});

describe("Solo", () => {
  it("should solo one track", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 4);
      set(trackSoloedState(0), true);
    });

    expect(testSnapshot.getLoadable(trackSoloedState(0)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackSoloedState(1)).valueOrThrow()).toBe(
      false
    );
    expect(testSnapshot.getLoadable(trackSoloedState(2)).valueOrThrow()).toBe(
      false
    );
    expect(testSnapshot.getLoadable(trackSoloedState(3)).valueOrThrow()).toBe(
      false
    );
  });

  it("should solo multiple tracks", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 4);
      set(trackSoloedState(0), true);
      set(trackSoloedState(1), true);
    });

    expect(testSnapshot.getLoadable(trackSoloedState(0)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackSoloedState(1)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackSoloedState(2)).valueOrThrow()).toBe(
      false
    );
    expect(testSnapshot.getLoadable(trackSoloedState(3)).valueOrThrow()).toBe(
      false
    );
  });

  it("should mute all other non-soloed tracks", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 4);
      set(trackSoloedState(1), true);
    });

    expect(testSnapshot.getLoadable(trackMutedState(1)).valueOrThrow()).toBe(
      false
    );
    expect(testSnapshot.getLoadable(trackMutedState(0)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackMutedState(2)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackMutedState(3)).valueOrThrow()).toBe(
      true
    );
  });
});

describe("Mute", () => {
  it("should mute one track", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 4);
      set(trackMutedState(0), true);
    });

    expect(testSnapshot.getLoadable(trackMutedState(0)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackMutedState(1)).valueOrThrow()).toBe(
      false
    );
    expect(testSnapshot.getLoadable(trackMutedState(2)).valueOrThrow()).toBe(
      false
    );
    expect(testSnapshot.getLoadable(trackMutedState(3)).valueOrThrow()).toBe(
      false
    );
  });

  it("should mute multiple tracks", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 4);
      set(trackMutedState(0), true);
      set(trackMutedState(1), true);
    });

    expect(testSnapshot.getLoadable(trackMutedState(0)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackMutedState(1)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackMutedState(2)).valueOrThrow()).toBe(
      false
    );
    expect(testSnapshot.getLoadable(trackMutedState(3)).valueOrThrow()).toBe(
      false
    );
  });

  it("should mute soloed tracks as well", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 2);
      set(trackSoloedState(0), true);
      set(trackSoloedState(1), true);
      set(trackMutedState(0), true);
      set(trackMutedState(1), true);
    });

    expect(testSnapshot.getLoadable(trackMutedState(0)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackMutedState(1)).valueOrThrow()).toBe(
      true
    );
  });
});

describe("trackVolumesState", () => {
  it("should reflect volume change", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 3);
      set(trackVolumeState(1), -10);
    });

    expect(testSnapshot.getLoadable(trackVolumesState).valueOrThrow()).toEqual([
      0, -10, 0,
    ]);
  });

  it("should reflect mute", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 3);
      set(trackMutedState(1), true);
    });

    expect(testSnapshot.getLoadable(trackVolumesState).valueOrThrow()).toEqual([
      0,
      -Infinity,
      0,
    ]);
  });

  it("should reflect solo", () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackCountState, 3);
      set(trackSoloedState(1), true);
    });

    expect(testSnapshot.getLoadable(trackVolumesState).valueOrThrow()).toEqual([
      -Infinity,
      0,
      -Infinity,
    ]);
  });
});
