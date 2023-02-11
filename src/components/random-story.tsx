import { debounce } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import CloseIcon from "@mui/icons-material/Close";

import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import { useCallback, useState } from "react";
import { useRandomStory } from "../lib/hooks/use-random-story";

export function RandomStory() {
  const fetchRandomStory = useRandomStory();
  const [randomStory, setRandomStory] = useState("");
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);

  const debouncedHandleClick = useCallback(
    debounce(async () => {
      setRandomStory(await fetchRandomStory());
      setSnackbarIsOpen(true);
    }, 250),
    []
  );
  const handleClose = (_: any, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarIsOpen(false);
  };
  const actionComponent = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <>
      <Tooltip title="A random story (powered by Genrenator)">
        <Button onClick={debouncedHandleClick}>
          <CasinoIcon />
        </Button>
      </Tooltip>
      <Snackbar
        autoHideDuration={null}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={snackbarIsOpen}
        onClose={handleClose}
        message={randomStory}
        action={actionComponent}
      />
    </>
  );
}
