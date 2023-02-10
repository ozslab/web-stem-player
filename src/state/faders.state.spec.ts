import { it, describe, expect } from "vitest";
import { snapshot_UNSTABLE } from "recoil";
import { trackMutedState, trackSoloedState } from "./faders.state";

describe("Solo", () => {
  it("should solo one channel", () => {
    const initialSnapshot = snapshot_UNSTABLE();

    const testSnapshot = snapshot_UNSTABLE(({ set }) =>
      set(trackSoloedState(0), true)
    );

    expect(testSnapshot.getLoadable(trackSoloedState(0)).valueOrThrow()).toBe(
      true
    );
    [1, 2, 3].forEach((channelNumber) => {
      expect(
        testSnapshot.getLoadable(trackSoloedState(channelNumber)).valueOrThrow()
      ).toBe(false);
    });
  });

  it("should solo multiple channels", () => {
    const initialSnapshot = snapshot_UNSTABLE();

    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
      set(trackSoloedState(0), true);
      set(trackSoloedState(1), true);
    });

    expect(testSnapshot.getLoadable(trackSoloedState(0)).valueOrThrow()).toBe(
      true
    );
    expect(testSnapshot.getLoadable(trackSoloedState(1)).valueOrThrow()).toBe(
      true
    );
  });
});

describe("Mute", () => {
  it("should mute one channel", () => {
    const initialSnapshot = snapshot_UNSTABLE();

    const testSnapshot = snapshot_UNSTABLE(({ set }) =>
      set(trackMutedState(0), true)
    );

    expect(testSnapshot.getLoadable(trackMutedState(0)).valueOrThrow()).toBe(
      true
    );
    [1, 2, 3].forEach((channelNumber) => {
      expect(
        testSnapshot.getLoadable(trackMutedState(channelNumber)).valueOrThrow()
      ).toBe(false);
    });
  });

  it("should mute multiple channels", () => {
    const initialSnapshot = snapshot_UNSTABLE();

    const testSnapshot = snapshot_UNSTABLE(({ set }) => {
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
