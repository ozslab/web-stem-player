import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Theme,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./app.css";
import { Track } from "./components/track";
import { Player } from "./components/player";
import { useAudio } from "./lib/hooks/use-audio.hook";
import { getTheme } from "./lib/utils/theme.util";
import { useThemeDetector } from "./lib/hooks/use-theme-detector";
import { RandomStory } from "./components/random-story";
import { useSetRecoilState } from "recoil";
import { trackCountState } from "./state/faders.state";
import { getFileNameWithoutExtension } from "./lib/utils/file.util";
import { RandomCatGif } from "./components/random-cat-gif";

const baseUrl = "audio/";
const audioFileNames = [
  "drums.mp3",
  "bassguitar.mp3",
  "clav.mp3",
  "leadguitar.mp3",
  "horns.mp3",
];

const audioFileUrls = audioFileNames.map(
  (audioFileName) => baseUrl + audioFileName
);

const lightTheme = getTheme("light");
const darkTheme = getTheme("dark");

export function App() {
  const isDarkTheme = useThemeDetector();
  const [theme, setTheme] = useState(isDarkTheme ? darkTheme : lightTheme);
  const setTrackCount = useSetRecoilState(trackCountState);
  const { isReady, start, stop } = useAudio(audioFileUrls);

  useEffect(() => {
    setTheme(isDarkTheme ? darkTheme : lightTheme);
  }, [isDarkTheme]);

  useEffect(() => {
    setTrackCount(audioFileUrls.length);
  }, [audioFileUrls]);

  return (
    <ThemeProvider theme={theme}>
      {isReady ? (
        <Paper>
          <Stack direction="row" justifyContent="end">
            <RandomStory />
            <ToggleButtonGroup
              value={theme}
              exclusive
              onChange={(_, newTheme: Theme | null) => {
                if (newTheme) {
                  setTheme(newTheme);
                }
              }}
            >
              <ToggleButton
                value={lightTheme}
                size="small"
                aria-label="Switch to light theme"
              >
                <Tooltip title="Light theme">
                  <LightModeIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value={darkTheme}
                size="small"
                aria-label="Switch to dark theme"
              >
                <Tooltip title="Dark theme">
                  <DarkModeIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack direction="column" sx={{ paddingX: 6, paddingY: 3 }}>
            <Player onStart={start} onStop={stop} />
            <Stack direction="row" spacing={2} alignItems="center">
              {audioFileUrls.map((audioFileUrl, trackIndex) => (
                <Track
                  key={audioFileUrl}
                  trackIndex={trackIndex}
                  trackLabel={getFileNameWithoutExtension(
                    audioFileNames[trackIndex]
                  )}
                  minDb={-40}
                  maxDb={10}
                />
              ))}
              <RandomCatGif />
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <Box sx={{ display: "flex" }} margin={2}>
          <Stack direction="row" alignItems="center">
            <CircularProgress aria-label="The app is loading, please wait" />
            <Box margin={2}>Loading...</Box>
          </Stack>
        </Box>
      )}
    </ThemeProvider>
  );
}
