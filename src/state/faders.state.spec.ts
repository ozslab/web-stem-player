import { snapshot_UNSTABLE } from "recoil";
import { trackSoloedState } from "./faders.state";

describe("Solo", () => {
  it("should solo one channel", () => {
    const initialSnapshot = snapshot_UNSTABLE();

    const testSnapshot = snapshot_UNSTABLE(({ set }) =>
      set(trackSoloedState(0), true)
    );
    expect(testSnapshot.getLoadable(trackSoloedState(0)).valueOrThrow()).toBe(
      true
    );
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
