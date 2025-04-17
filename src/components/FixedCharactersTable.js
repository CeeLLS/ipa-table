import React from "react";
import { Table, Button } from "@mui/material";
import fixedData from "../data/fixed_characters.json";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

function FixedCharactersTable({ onSelectFixed }) {
  const fixedManners = {};
  fixedData.forEach((charItem) => {
    const manner = charItem.manner[0];
    const place = charItem.place[0];
    const subplace = charItem.subplace && charItem.subplace.length > 0 ? charItem.subplace[0] : "N/A";
    const submannerArr = charItem.submanner ? charItem.submanner : ["all"];
    const newCharData = { ...charItem, submanner: submannerArr };

    if (!fixedManners[manner]) fixedManners[manner] = {};
    if (!fixedManners[manner][place]) fixedManners[manner][place] = {};
    if (!fixedManners[manner][place][subplace]) fixedManners[manner][place][subplace] = [];
    fixedManners[manner][place][subplace].push(newCharData);
  });

  return (
    <Table>
      <TableHeader manners={fixedManners} ignorePlaces={[]} />
      <TableBody 
        manners={fixedManners} 
        ignoreManners={[]} 
        ignorePlaces={[]} 
        renderCellContent={(ch, idx) => (
          <Button 
            key={idx} 
            variant="outlined" 
            size="small"
            onClick={() => onSelectFixed(ch)}
          >
            {ch}
          </Button>
        )}
      />

    </Table>
  );
}

export default FixedCharactersTable;
