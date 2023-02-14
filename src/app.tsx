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
  const { isReady, start, stop, setVolume } = useAudio(audioFileUrls);

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
                  trackLabel={getFileNameWithoutExtension(
                    audioFileNames[trackIndex]
                  )}
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
