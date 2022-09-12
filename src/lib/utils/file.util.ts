export async function loadFile(filePath: string): Promise<ArrayBuffer> {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    
    return arrayBuffer;
}
