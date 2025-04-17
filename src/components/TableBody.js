import React from "react";
import orderConfig from "../data/orderConfig.json";
import { TableRow, TableCell } from "@mui/material";

function TableBody({ manners, ignoreManners, ignorePlaces, renderCellContent }) {
  const allPlaces = orderConfig.placeOrder;
  const dynamicManners = Array.from(new Set([
    ...orderConfig.mannerOrder,
    ...Object.keys(manners)
  ]));

  const allManners = dynamicManners;

  const getComboSubplacesForPlace = (place) => {
    if (ignorePlaces.includes(place)) return [];
    const combos = new Set();
    Object.keys(manners).forEach(mannerKey => {
      const placeData = manners[mannerKey][place];
      if (placeData) {
        Object.keys(placeData).forEach(subKey => {
          placeData[subKey].forEach(item => {
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

  const placesWithData = allPlaces.filter(place =>
    Object.keys(manners).some(mKey => manners[mKey]?.[place])
  );
  const columns = [];
  placesWithData.forEach(place => {
    if (ignorePlaces.includes(place)) {
      columns.push({ place, subplace: null });
    } else {
      const combos = getComboSubplacesForPlace(place);
      if (combos.length === 0) {
        columns.push({ place, subplace: null });
      } else {
        combos.forEach(combo => columns.push({ place, subplace: combo }));
      }
    }
  });

  const mergeCells = (cells) => {
    const merged = [];
    for (let i = 0; i < cells.length; i++) {
      let mergeCount = 1;
      while (
        i + 1 < cells.length &&
        cells[i].content.trim() === cells[i + 1].content.trim()
      ) {
        mergeCount++;
        i++;
      }
      merged.push({
        content: cells[i].content.trim(),
        key: cells[i].key,
        colSpan: mergeCount,
      });
    }
    return merged;
  };

  const getColumnItems = (manner, col) => {
    if (!manners[manner]) return [];
    const placeData = manners[manner][col.place] || {};
    let items = [];
    if (col.subplace === null) {
      Object.keys(placeData).forEach(sub => {
        items = items.concat(placeData[sub] || []);
      });
    } else {
      items.push(...getItemsForColumn(manner, col.place, col.subplace));
    }
    return items;
  };

  const getItemsForColumn = (manner, place, subCombo) => {
    const items = [];
    const placeData = manners[manner][place] || {};
    if (subCombo === null) {
      Object.keys(placeData).forEach(subKey => {
        items.push(...(placeData[subKey] || []));
      });
    } else {
      Object.keys(placeData).forEach(subKey => {
        placeData[subKey].forEach(item => {
          let combo;
          if (item.subplace && item.subplace.length > 0) {
            const sortedSubplaces = Array.from(item.subplace).sort((a, b) =>
              orderConfig.subplaceOrder.indexOf(a) - orderConfig.subplaceOrder.indexOf(b)
            );
            combo = sortedSubplaces.join(" & ");
          } else {
            combo = "N/A";
          }
          if (combo === subCombo) {
            items.push(item);
          }
        });
      });
    }
    return items;
  };

  const computeCellData = (manner, col, filterFn, extraKeyPart = "") => {
    const items = getColumnItems(manner, col);
    const filteredItems = filterFn ? items.filter(filterFn) : items;
    const uniqueChars = Array.from(new Set(filteredItems.map(i => i.char)));
    return {
      key: `${manner}-${col.place}-${col.subplace || "all"}${extraKeyPart}`,
      content: uniqueChars.join(" "),
    };
  };

  const hasDataForManner = (manner) => {
    return Object.keys(manners).some(mKey => {
      return Object.keys(manners[mKey] || {}).some(place => {
        return Object.keys(manners[mKey][place] || {}).some(sub =>
          manners[mKey][place][sub].some(item => item.manner.includes(manner))
        );
      });
    });
  };

  const getUniqueCombos = (manner) => {
    let itemsForManner = [];
    Object.keys(manners[manner] || {}).forEach(place => {
      Object.keys(manners[manner][place] || {}).forEach(sub => {
        itemsForManner.push(...(manners[manner][place][sub] || []));
      });
    });
    const comboSet = new Set(
      itemsForManner.map(item =>
        Array.from(new Set(item.submanner)).sort().join("|")
      )
    );
    let uniqueCombos = Array.from(comboSet);
    if (uniqueCombos.length === 0) uniqueCombos.push("all");
    return uniqueCombos;
  };

  return (
    <>
      {allManners.map(manner => {
        if (!manners[manner] || !hasDataForManner(manner)) return null;

        if (ignoreManners.includes(manner)) {
          const cellData = columns.map(col =>
            computeCellData(manner, col)
          );
          const mergedCells = mergeCells(cellData);
          return (
            <TableRow key={manner}>
              <TableCell align="center" colSpan={2}>{manner}</TableCell>
              {mergedCells.map(cell => (
                <TableCell key={cell.key} align="center" colSpan={cell.colSpan}>
                  {cell.content.split(" ").filter(Boolean).map((ch, idx) =>
                    renderCellContent ? renderCellContent(ch, idx) : <div key={idx}>/{ch}/</div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          );
        } else {
          const uniqueCombos = getUniqueCombos(manner);
          if (uniqueCombos.length === 1) {
            const combo = uniqueCombos[0];
            const filterFn = item =>
              Array.from(new Set(item.submanner)).sort().join("|") === combo;
            const cellData = columns.map(col =>
              computeCellData(manner, col, filterFn)
            );
            const mergedCells = mergeCells(cellData);
            return (
              <TableRow key={manner}>
                <TableCell align="center" colSpan={2}>{manner}</TableCell>
                {mergedCells.map(cell => (
                  <TableCell key={cell.key} align="center" colSpan={cell.colSpan}>
                    {cell.content.split(" ").filter(Boolean).map((ch, idx) =>
                      renderCellContent ? renderCellContent(ch, idx) : <div key={idx}>/{ch}/</div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          } else {
            return (
              <React.Fragment key={manner}>
                {uniqueCombos.map((combo, comboIdx) => {
                  const groupLabel = combo.split("|").join(" & ");
                  const filterFn = item =>
                    Array.from(new Set(item.submanner)).sort().join("|") === combo;
                  const cellData = columns.map(col =>
                    computeCellData(manner, col, filterFn, `-${groupLabel}`)
                  );
                  const mergedCells = mergeCells(cellData);
                  return (
                    <TableRow key={`${manner}-${groupLabel}`}>
                      {comboIdx === 0 && (
                        <TableCell align="center" rowSpan={uniqueCombos.length}>
                          {manner}
                        </TableCell>
                      )}
                      <TableCell align="center">{groupLabel}</TableCell>
                      {mergedCells.map(cell => (
                        <TableCell key={cell.key} align="center" colSpan={cell.colSpan}>
                          {cell.content.split(" ").filter(Boolean).map((ch, idx) =>
                            renderCellContent ? renderCellContent(ch, idx) : <div key={idx}>/{ch}/</div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </React.Fragment>
            );
          }
        }
      })}
    </>
  );
}

export default TableBody;
