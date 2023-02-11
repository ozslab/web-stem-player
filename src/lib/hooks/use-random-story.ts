const genrenatorApiBaseUrl = "https://binaryjazz.us/wp-json/genrenator/v1";
const genrenatorRandomStoryApiUrl = `${genrenatorApiBaseUrl}/story`;

const fetchRandomStory = async (): Promise<string> => {
  try {
    const response = await fetch(`${genrenatorRandomStoryApiUrl}/1`);
    if (!response.ok) {
      return "";
    }
    const randomStory = (await response.json()) as string;
    return randomStory;
  } catch {
    return "";
  }
};

export function useRandomStory() {
  return fetchRandomStory;
}
