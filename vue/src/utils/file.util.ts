export async function loadFile(filePath: string): Promise<ArrayBuffer> {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();

  return arrayBuffer;
}

export function getFileNameWithoutExtension(fileName: string) {
  return fileName.substring(0, fileName.lastIndexOf("."));
}
