// src/components/TokenDisplay.js
import React from "react";
import { Box, Chip } from "@mui/material";

function TokenDisplay({ tokens, onRemove, onEdit }) {
  return (
    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
      {tokens.map((tk, idx) => (
        <Chip
          key={`${tk}-${idx}`}
          label={`/${tk}/`}
          onDelete={() => onRemove(idx)}
          // onClick={() => onEdit(idx)}
          color="primary"
          variant="outlined"
        />
      ))}
    </Box>
  );
}

export default TokenDisplay;