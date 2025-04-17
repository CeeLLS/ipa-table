import React from "react";
import { TableRow, TableCell } from "@mui/material";
import orderConfig from "../../data/orderConfig.json";
// import "./TableHeader.module.css";

function TableHeader({ manners, ignorePlaces }) {
  const allPlaces = orderConfig.placeOrder;


  const getSubplacesForPlace = (place) => {
    if (ignorePlaces.includes(place)) return [];
    const combos = new Set();
    Object.keys(manners).forEach((manner) => {
      const placeData = manners[manner][place];
      if (placeData) {
        Object.keys(placeData).forEach((subKey) => {
          placeData[subKey].forEach((item) => {
            let subCombo;
            if (item.subplace && item.subplace.length > 0) {
              const sortedSubplaces = Array.from(item.subplace).sort((a, b) =>
                orderConfig.subplaceOrder.indexOf(a) - orderConfig.subplaceOrder.indexOf(b)
              );
              subCombo = sortedSubplaces.join(" & ");
            } else {
              subCombo = "N/A";
            }
            combos.add(subCombo);
          });
        });
      }
    });
    const combosArr = combos.size > 0 ? Array.from(combos) : ["N/A"];
    combosArr.sort((a, b) => {
      const arrA = a.split(" & ");
      const arrB = b.split(" & ");
      for (let i = 0; i < Math.min(arrA.length, arrB.length); i++) {
        const idxA = orderConfig.subplaceOrder.indexOf(arrA[i]);
        const idxB = orderConfig.subplaceOrder.indexOf(arrB[i]);
        if (idxA !== idxB) return idxA - idxB;
      }
      return arrA.length - arrB.length;
    });
    return combosArr;
  };

  const placesWithData = allPlaces.filter((place) =>
    Object.keys(manners).some((manner) => manners[manner]?.[place])
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
