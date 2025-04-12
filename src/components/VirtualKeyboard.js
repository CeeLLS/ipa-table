import React from "react";
import { Box, Button } from "@mui/material";

function VirtualKeyboard({ chars, onSelect }) {
  return (
    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(48px, 1fr))" gap={1} mb={2}>
      {chars.map((c) => (
        <Button key={c.char} variant="outlined" size="small" onClick={() => onSelect(c.char)}>
          {c.char}
        </Button>
      ))}
    </Box>
  );
}

export default VirtualKeyboard;
