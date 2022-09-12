import { Box, CircularProgress, Paper, Stack } from "@mui/material";
import "./app.css";
import { Track } from "./components/track";
import { Player } from "./components/player";
import { useAudio } from "./lib/hooks/use-audio.hook";

const baseUrl = "http://127.0.0.1:5500/audio/";
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

function App() {
  const { isReady, start, stop, setVolume } = useAudio(audioFileUrls);

  return isReady ? (
    <Paper sx={{ padding: 2 }}>
      <Stack direction="column">
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
  );
}

export default App;
