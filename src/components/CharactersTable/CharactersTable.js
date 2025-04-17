import React from "react";
import { Table } from "@mui/material";
// import "./CharactersTable.module.css"
import TableHeader from "../TableHeader/TableHeader";
import TableBody from "../TableBody/TableBody";

function CharactersTable({ manners, ignoreManners, ignorePlaces }) {
  return (
    <Table>
      <TableHeader manners={manners} ignorePlaces={ignorePlaces} />
      <TableBody manners={manners} ignoreManners={ignoreManners} ignorePlaces={ignorePlaces} />
    </Table>
  );
}

export default CharactersTable;
