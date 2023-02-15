import { encode } from "base64-arraybuffer";
import { fetchFromApi } from "../utils/fetch.util";

const randomCatApiBaseUrl = "https://cataas.com";
const randomCatApiBaseUrlApiUrl = `${randomCatApiBaseUrl}/cat/gif`;

const fetchRandomCatGif = async (): Promise<string> => {
  const response = await fetchFromApi(randomCatApiBaseUrlApiUrl, false);

  if (response) {
    return `data:image/gif;base64,${encode(response)}`;
  }

  return "";
};

export function useRandomCatGif() {
  return fetchRandomCatGif;
}
