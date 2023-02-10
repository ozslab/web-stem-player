// Based on https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48

import { useEffect, useState } from "react";

export const useThemeDetector = () => {
  const darkThemeMediaQueryList = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );
  const isCurrentThemeDark = () => darkThemeMediaQueryList.matches;
  const [isDarkTheme, setIsDarkTheme] = useState(isCurrentThemeDark);
  const mediaQueryListener = (mediaQueryListEvent: MediaQueryListEvent) => {
    setIsDarkTheme(mediaQueryListEvent.matches);
  };

  useEffect(() => {
    darkThemeMediaQueryList.addEventListener("change", mediaQueryListener);

    return () => {
      darkThemeMediaQueryList.removeEventListener("change", mediaQueryListener);
    };
  }, []);

  return isDarkTheme;
};
