import { fetchFromApi } from "../utils/fetch.util";

const genrenatorApiBaseUrl = "https://binaryjazz.us/wp-json/genrenator/v1";
const genrenatorRandomStoryApiUrl = `${genrenatorApiBaseUrl}/story`;

const fetchRandomStory = async (): Promise<string> => {
  const response = await fetchFromApi(`${genrenatorRandomStoryApiUrl}/1`);

  return response ?? "";
};

export function useRandomStory() {
  return fetchRandomStory;
}
