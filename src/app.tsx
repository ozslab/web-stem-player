import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
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

const baseUrl = "audio/";
const audioFileNames = [
  "Drums.mp3",
  "Bass.mp3",
  "Instruments.mp3",
  "Vocal.mp3",
  // "Verb.mp3",
  // "Vocal_Verb.mp3",
];

const audioFileUrls = audioFileNames.map(
  (audioFileName) => baseUrl + audioFileName
);

const lightTheme = getTheme("light");
const darkTheme = getTheme("dark");

export function App() {
  const isDarkTheme = useThemeDetector();
  const [theme, setTheme] = useState(isDarkTheme ? darkTheme : lightTheme);
  const { isReady, start, stop, setVolume } = useAudio(audioFileUrls);

  useEffect(() => {
    setTheme(isDarkTheme ? darkTheme : lightTheme);
  }, [isDarkTheme]);

  return (
    <ThemeProvider theme={theme}>
      {isReady ? (
        <Paper>
          <Stack direction="row" justifyContent="end">
            <RandomStory />
            <ToggleButtonGroup
              value={theme}
              exclusive
              onChange={(_, newTheme) => {
                if (newTheme) {
                  setTheme(newTheme);
                }
              }}
            >
              <Tooltip title="Light theme">
                <ToggleButton value={lightTheme} size="small">
                  <LightModeIcon />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Dark theme">
                <ToggleButton value={darkTheme} size="small">
                  <DarkModeIcon />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Stack>
          <Stack direction="column" sx={{ paddingX: 6, paddingY: 3 }}>
            <Player onStart={start} onStop={stop} />
            <Stack direction="row" spacing={2}>
              {audioFileUrls.map((audioFileUrl, trackIndex) => (
                <Track
                  key={audioFileUrl}
                  trackIndex={trackIndex}
                  onVolumeChange={setVolume}
                  minDb={-40}
                  maxDb={10}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <Box sx={{ display: "flex" }} margin={2}>
          <Stack direction="row" alignItems="center">
            <CircularProgress />
            <Box margin={2}>Loading...</Box>
          </Stack>
        </Box>
      )}
    </ThemeProvider>
  );
}
