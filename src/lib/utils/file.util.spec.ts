import { describe, expect, it } from "vitest";
import { getFileNameWithoutExtension } from "./file.util";

describe("FileUtil", () => {
  describe("getFileNameWithoutExtension", () => {
    it("should get the filename without extension", () => {
      expect(getFileNameWithoutExtension("drums.mp3")).toBe("drums");
    });
  });
});
