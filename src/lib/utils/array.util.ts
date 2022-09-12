export const createUpdatedArray = <T>(
  array: T[],
  index: number,
  newTalue: T
): T[] => [...array.slice(0, index - 1), newTalue, ...array.slice(index + 1)];
