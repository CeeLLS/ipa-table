import React from "react";
import { TableRow, TableCell } from "@mui/material";

function TableHeader({ manners, ignorePlaces }) {
  const allPlaces = [
    "Bilabial", "Labiodental", "Dental", "Alveolar", "Postalveolar",
    "Retroflex", "Palatal", "Velar", "Uvular", "Pharyngeal", "Glottal"
  ];
  const allSubplaces = [
    "Unvoiced", "Voiced", "Labialized", "Palatalized", "Velarized", "Pharyngealized"
  ];

  const includeNA = Object.keys(manners).some((manner) =>
    Object.keys(manners[manner] || {}).some((place) =>
      Object.keys(manners[manner][place] || {}).includes("N/A")
    )
  );
  const subplacesToRender = includeNA ? [...allSubplaces, "N/A"] : allSubplaces;

  const getSubplacesForPlace = (place) => {
    if (ignorePlaces.includes(place)) {
      return [];
    }
    const subs = subplacesToRender.filter((subplace) =>
      Object.keys(manners).some((manner) =>
        (manners[manner]?.[place]?.[subplace] || []).length > 0
      )
    );
    return subs.length ? subs : ["N/A"];
  };

  const placesWithData = allPlaces.filter((place) =>
    Object.keys(manners).some((manner) =>
      Object.keys(manners[manner] || {}).includes(place)
    )
  );

  return (
    <>
      <TableRow>
        <TableCell />
        <TableCell />
        {placesWithData.map((place) => {
          const subs = getSubplacesForPlace(place);
          if (ignorePlaces.includes(place) || (subs.length === 1 && subs[0] === "N/A")) {
            return (
              <TableCell key={place} align="center" rowSpan={2}>
                {place}
              </TableCell>
            );
          } else {
            return (
              <TableCell key={place} align="center" colSpan={subs.length}>
                {place}
              </TableCell>
            );
          }
        })}
      </TableRow>
      <TableRow>
        <TableCell />
        <TableCell />
        {placesWithData.map((place) => {
          if (ignorePlaces.includes(place)) return null;
          const subs = getSubplacesForPlace(place);
          if (subs.length === 1 && subs[0] === "N/A") return null;
          return subs.map((subplace, idx) => (
            <TableCell key={`${place}-${subplace}-${idx}`} align="center">
              {subplace === "N/A" ? "Plain" : subplace}
            </TableCell>
          ));
        })}
      </TableRow>
    </>
  );
}

export default TableHeader;
