import React from "react";
import { Box, Chip } from "@mui/material";

function TokenDisplay({ tokens, onRemove }) {
  return (
    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
      {tokens.map((tk, idx) => (
        <Chip key={`${tk}-${idx}`} label={`/${tk}/`} onDelete={() => onRemove(idx)} size="small" />
      ))}
    </Box>
  );
}

export default TokenDisplay;
