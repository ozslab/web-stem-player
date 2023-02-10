import {
  Paper,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material";
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
          <Tooltip title="Play">
            <ToggleButton value={PlayState.started} onClick={props.onStart}>
              <PlayArrowIcon />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Stop">
            <ToggleButton value={PlayState.stopped} onClick={props.onStop}>
              <StopIcon />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  );
}
