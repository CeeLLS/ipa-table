import React from "react";
import { Box, Button } from "@mui/material";
// import "./VirtualKeyboard.module.css";

function VirtualKeyboard({ chars, onSelect }) {
  return (
    <Box className="virtual-keyboard">
      {chars.map((c) => (
        <Button 
          key={c.char} 
          className="keyboard-button"
          onClick={() => onSelect(c.char)}
        >
          {c.char}
        </Button>
      ))}
    </Box>
  );
}

export default VirtualKeyboard;
