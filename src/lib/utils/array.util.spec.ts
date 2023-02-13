import { it, describe, expect } from "vitest";
import { createArrayWithIndices } from "./array.util";

describe("ArrayUtil", () => {
  describe("createArrayWithIndices", () => {
    it("should create array with indices", () => {
      expect(createArrayWithIndices(0)).toEqual([]);
      expect(createArrayWithIndices(1)).toEqual([0]);
      expect(createArrayWithIndices(4)).toEqual([0, 1, 2, 3]);
    });
  });
});
