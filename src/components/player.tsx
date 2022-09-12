import { Paper, Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useState } from "react";

type Props = {
  onStart: () => void;
  onStop: () => void;
};

enum PlayState {
  "started" = "started",
  "stopped" = "stopped",
}

export function Player(props: Props) {
  const [playState, setPlayState] = useState<PlayState | null>(null);

  return (
    <Paper sx={{ marginTop: 2, marginBottom: 2 }}>
      <Stack direction="row">
        <ToggleButtonGroup
          exclusive
          value={playState}
          onChange={(_, newPlayState) => {
            if (newPlayState) {
              setPlayState(newPlayState);
            }
          }}
        >
          <ToggleButton value={PlayState.started} onClick={props.onStart}>
            <PlayArrowIcon />
          </ToggleButton>
          <ToggleButton value={PlayState.stopped} onClick={props.onStop}>
            <StopIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  );
}
