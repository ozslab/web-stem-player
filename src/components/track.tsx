import { Mark } from "@mui/base";
import {
  Paper,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { useMemo, useState } from "react";
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
  trackLabel: string;
  minDb: number;
  maxDb: number;
};

enum TrackButtonValue {
  muted = "muted",
  soloed = "soloed",
}

const getMarks = (minDb: number, maxDb: number): Mark[] => [
  { value: minDb, label: formatAsDb(minDb) },
  { value: 0, label: formatAsDb(0) },
  { value: maxDb, label: formatAsDb(maxDb) },
];

export function Track({ trackIndex, trackLabel, minDb, maxDb }: Props) {
  const [muted, setMuted] = useRecoilState(trackMutedState(trackIndex));
  const [soloed, setSoloed] = useRecoilState(trackSoloedState(trackIndex));
  const [volume, setVolume] = useRecoilState(trackVolumeState(trackIndex));
  const [defaultVolume] = useState(volume);

  const [activatedButtons, setActivatedButtons] = useState<TrackButtonValue[]>(
    () => {
      const activatedBtns: TrackButtonValue[] = [];

      if (muted) {
        activatedBtns.push(TrackButtonValue.muted);
      }

      if (soloed) {
        activatedBtns.push(TrackButtonValue.soloed);
      }

      return activatedBtns;
    }
  );

  const marks = useMemo(() => getMarks(minDb, maxDb), [minDb, maxDb]);

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newValue: TrackButtonValue[]
  ) => {
    setActivatedButtons(newValue);
    setMuted(newValue.includes(TrackButtonValue.muted));
    setSoloed(newValue.includes(TrackButtonValue.soloed));
  };

  return (
    <Paper
      sx={{
        width: 120,
        height: 270,
      }}
    >
      <Stack direction="column" alignItems="center">
        <Stack
          direction="row"
          sx={{
            marginTop: 2,
            marginBottom: 1,
            justifyContent: "center",
          }}
        >
          {trackLabel}
        </Stack>
        <Stack direction="row" spacing={0} marginTop={1}>
          <ToggleButtonGroup value={activatedButtons} onChange={handleToggle}>
            <ToggleButton value={TrackButtonValue.muted} size="small">
              <Tooltip title="Mute">
                <MusicOffIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TrackButtonValue.soloed} size="small">
              <Tooltip title="Solo">
                <PriorityHighIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack
          sx={{
            height: 120,
            marginTop: 4,
          }}
        >
          <Slider
            sx={{
              '& input[type="range"]': {
                WebkitAppearance: "slider-vertical",
              },
            }}
            orientation="vertical"
            min={minDb}
            max={maxDb}
            step={1}
            defaultValue={defaultVolume}
            marks={marks}
            valueLabelDisplay="auto"
            valueLabelFormat={formatAsDb}
            onChange={(_, volume) => {
              setVolume(volume as number);
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
