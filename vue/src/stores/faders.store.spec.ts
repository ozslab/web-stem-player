import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useFadersStore } from "./faders.store";

describe("Faders store", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("should set initial state", () => {
    const faders = useFadersStore();

    expect(faders.volume).toBe(0);
    expect(faders.muted).toBe(false);
    expect(faders.soloed).toBe(false);
  });

  it("should set volume", () => {
    const faders = useFadersStore();

    faders.volume = 1;

    expect(faders.volume).toBe(1);
  });

  it("should toggle muted", () => {
    const faders = useFadersStore();

    faders.toggleMuted();

    expect(faders.muted).toBe(true);

    faders.toggleMuted();

    expect(faders.muted).toBe(false);
  });

  it("should toggle soloed", () => {
    const faders = useFadersStore();

    faders.toggleSoloed();

    expect(faders.soloed).toBe(true);

    faders.toggleSoloed();

    expect(faders.soloed).toBe(false);
  });
});
