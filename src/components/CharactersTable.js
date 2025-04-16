import React from "react";
import { Table } from "@mui/material";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

function CharactersTable({ manners, ignoreManners, ignorePlaces }) {
  return (
    <Table>
      <TableHeader manners={manners} ignorePlaces={ignorePlaces} />
      <TableBody manners={manners} ignoreManners={ignoreManners} ignorePlaces={ignorePlaces} />
    </Table>
  );
}

export default CharactersTable;
