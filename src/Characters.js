import React from "react";
import json from "./characters.json";
import { Table, TableRow, TableCell, Button } from "@mui/material";
import "./App.css";

function Characters({ onAddChar }) {
  const arrays = {};
  json.forEach((e) => {
    const manner = e.manner[0];
    if (!arrays[manner]) {
      arrays[manner] = [];
    }
    arrays[manner].push(e);
  });

  return (
    <Table>
      {Object.keys(arrays).map((manner, index) => (
        <TableRow>
          <TableCell variant="head">{manner}</TableCell>
          {arrays[manner].map((item, itemIndex) => (
            <TableCell>
              <Button
                style={{ textTransform: "none" }}
                onClick={() => onAddChar(item.char)}
                color="primary"
              >
                /{item.char}/
              </Button>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </Table>
  );
}

export default Characters;
