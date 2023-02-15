import { Box, Button, CircularProgress, Tooltip } from "@mui/material";
import { useState } from "react";
import { useRandomCatGif } from "../lib/hooks/use-random-cat-gif";

export function RandomCatGif() {
  const fetchRandomCatGif = useRandomCatGif();
  const [randomCatGif, setRandomCatGif] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    setRandomCatGif(await fetchRandomCatGif());
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        width: 320,
        height: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "blue",
        overflow: "clip",
      }}
    >
      <Tooltip title={isLoading ? "" : "Click to get a random cat animation"}>
        <Button
          sx={{
            width: "100%",
            height: "100%",
          }}
          aria-label="Click to get a random cat animation"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress
              size={64}
              thickness={8}
              disableShrink
              aria-label="Loading a random cat animation"
            />
          ) : randomCatGif ? (
            <img height={200} src={randomCatGif} alt="A random cat animation" />
          ) : null}
        </Button>
      </Tooltip>
    </Box>
  );
}
