export const fetchFromApi = async (
  apiUrl: string,
  jsonParseResponse: boolean = true
): Promise<any | null> => {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return null;
    }

    const result = jsonParseResponse
      ? await response.json()
      : await response.arrayBuffer();
    return result;
  } catch (error) {
    return null;
  }
};
