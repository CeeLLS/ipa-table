import React from "react";
import { Box, Chip } from "@mui/material";
// import "./TokenDisplay.module.css"

function TokenDisplay({ tokens, onRemove, onEdit }) {
  return (
    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
      {tokens.map((tk, idx) => (
        <Chip
          key={`${tk}-${idx}`}
          label={`/${tk}/`}
          onDelete={() => onRemove(idx)}
          color="primary"
          variant="outlined"
        />
      ))}
    </Box>
  );
}

export default TokenDisplay;