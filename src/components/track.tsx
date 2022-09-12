import { Mark } from "@mui/base";
import {
  Paper,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import { formatAsDb } from "../lib/utils/audio.util";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { useRecoilState } from "recoil";
import {
  trackMutedState,
  trackSoloedState,
  trackVolumeState,
} from "../state/faders.state";

type Props = {
  trackIndex: number;
  minDb: number;
  maxDb: number;
  onVolumeChange: (trackIndex: number, volumeInDb: number) => void;
};

enum TrackButtonValue {
  muted = 1,
  soloed = 2,
}

const getMarks = (minDb: number, maxDb: number): Mark[] => [
  { value: minDb, label: formatAsDb(minDb) },
  { value: 0, label: formatAsDb(0) },
  { value: maxDb, label: formatAsDb(maxDb) },
];

export function Track(props: Props) {
  const { minDb, maxDb, trackIndex, onVolumeChange } = props;
  const [marks] = useState<Mark[]>(() => getMarks(minDb, maxDb));
  const [muted, setMuted] = useRecoilState(trackMutedState(trackIndex));
  const [soloed, setSoloed] = useRecoilState(trackSoloedState(trackIndex));
  const [volume, setVolume] = useRecoilState(trackVolumeState(trackIndex));
  const [activatedButtons, setActivatedButtons] = useState<number[]>([]);

  useEffect(() => {
    setActivatedButtons([
      ...(muted ? [TrackButtonValue.muted] : []),
      ...(soloed ? [TrackButtonValue.soloed] : []),
    ]);
    onVolumeChange(trackIndex, muted ? -Infinity : volume);
  }, [trackIndex, muted, soloed, volume, onVolumeChange]);

  return (
    <Paper
      sx={{
        width: 96,
        height: 240,
      }}
    >
      <Stack direction="column" alignItems="center">
        <Stack direction="row" spacing={0} marginTop={1}>
          <ToggleButtonGroup value={activatedButtons}>
            <ToggleButton
              value={TrackButtonValue.muted}
              size="small"
              onClick={() => setMuted((currValue) => !currValue)}
            >
              <MusicOffIcon />
            </ToggleButton>
            <ToggleButton
              value={TrackButtonValue.soloed}
              size="small"
              onClick={() => setSoloed((currValue) => !currValue)}
            >
              <PriorityHighIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack
          sx={{
            height: 120,
            marginTop: 6,
          }}
        >
          <Slider
            sx={{
              '& input[type="range"]': {
                WebkitAppearance: "slider-vertical",
              },
            }}
            orientation="vertical"
            min={props.minDb}
            max={props.maxDb}
            step={1}
            defaultValue={0}
            marks={marks}
            valueLabelDisplay="auto"
            valueLabelFormat={formatAsDb}
            onChange={(_, value) => setVolume(value as number)}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
