export const createArrayWithIndices = (arrayLength: number): number[] => {
  const array = [];

  for (let index = 0; index < arrayLength; ++index) {
    array.push(index);
  }

  return array;
};
