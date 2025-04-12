import React from "react";
import { TableRow, TableCell } from "@mui/material";

function TableBody({ manners, ignoreManners, ignorePlaces, renderCellContent }) {
  const allPlaces = [
    "Bilabial", "Labiodental", "Dental", "Alveolar", "Postalveolar",
    "Retroflex", "Palatal", "Velar", "Uvular", "Pharyngeal", "Glottal"
  ];
  const allSubplaces = [
    "Unvoiced", "Voiced", "Labialized", "Palatalized", "Velarized", "Pharyngealized"
  ];
  const allManners = [
    "Plosive", "Affricate", "Nasal", "Trill", "Tap", "Fricative", "Lateral", "Approximant"
  ];
  const allSubmanners = ["Voiceless", "Voiced", "Ejective"];

  const includeNA = Object.keys(manners).some((manner) =>
    Object.keys(manners[manner] || {}).some((place) =>
      Object.keys(manners[manner][place] || {}).includes("N/A")
    )
  );
  const subplacesToRender = includeNA ? [...allSubplaces, "N/A"] : allSubplaces;

  const placesWithData = allPlaces.filter((place) =>
    Object.keys(manners).some((manner) =>
      Object.keys(manners[manner] || {}).includes(place)
    )
  );
  
  const columns = [];
  placesWithData.forEach((place) => {
    if (ignorePlaces.includes(place)) {
      columns.push({ place, subplace: null });
    } else {
      const subs = subplacesToRender.filter((sub) =>
        Object.keys(manners).some((manner) =>
          (manners[manner]?.[place]?.[sub] || []).length > 0
        )
      );
      if (subs.length === 0) {
        columns.push({ place, subplace: null });
      } else {
        subs.forEach((sub) => {
          columns.push({ place, subplace: sub });
        });
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

  return (
    <>
      {allManners.map((manner) => {
        if (!manners[manner]) return null;

        if (ignoreManners.includes(manner)) {
          const cellData = columns.map((col) => {
            let items = [];
            if (col.subplace === null) {
              Object.keys(manners[manner][col.place] || {}).forEach((sub) => {
                items = items.concat(manners[manner][col.place][sub] || []);
              });
            } else {
              items = manners[manner][col.place]?.[col.subplace] || [];
            }
            const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
            return {
              key: `${manner}-${col.place}-${col.subplace || "all"}`,
              content: uniqueChars.join(" "),
            };
          });
          const mergedCells = mergeCells(cellData);
          return (
            <TableRow key={manner}>
              <TableCell align="center" colSpan={2}>{manner}</TableCell>
              {mergedCells.map((cell) => (
  <TableCell key={cell.key} align="center" colSpan={cell.colSpan}>
    {cell.content.split(" ").filter(Boolean).map((ch, idx) =>
      renderCellContent 
        ? renderCellContent(ch, idx)
        : <div key={idx}>/{ch}/</div>
    )}
  </TableCell>
))}

            </TableRow>
          );
        } else {
const submannersForManner = allSubmanners.filter((submanner) =>
  Object.keys(manners[manner] || {}).some((place) =>
    Object.keys(manners[manner][place] || {}).some((sub) =>
      manners[manner][place][sub]?.some((item) =>
        item.submanner.includes(submanner)
      )
    )
  )
);
if (submannersForManner.length === 0) {
  submannersForManner.push("all");
}

if (submannersForManner.length === 1) {
  const submanner = submannersForManner[0];
  const cellData = columns.map((col) => {
    let items = [];
    if (col.subplace === null) {
      Object.keys(manners[manner][col.place] || {}).forEach((sub) => {
        items = items.concat(
          (manners[manner][col.place][sub] || []).filter((item) =>
            item.submanner.includes(submanner)
          )
        );
      });
    } else {
      items = (manners[manner][col.place]?.[col.subplace] || []).filter((item) =>
        item.submanner.includes(submanner)
      );
    }
    const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
    return {
      key: `${manner}-${col.place}-${col.subplace || "all"}-${submanner}`,
      content: uniqueChars.join(" "),
    };
  });
  const mergedCells = mergeCells(cellData);
  return (
    <TableRow key={manner}>
      <TableCell align="center" colSpan={2}>{manner}</TableCell>
      {mergedCells.map((cell) => (
        <TableCell key={cell.key} align="center" colSpan={cell.colSpan}>
          {cell.content.split(" ").filter(Boolean).map((ch, idx) => (
            // <div key={idx}>/{ch}/</div>
            renderCellContent 
            ? renderCellContent(ch, idx)
            : <div key={idx}>/{ch}/</div>
          ))}
        </TableCell>
      ))}
    </TableRow>
  );
} else {
  return (
    <React.Fragment key={manner}>
      {submannersForManner.map((submanner, subIdx) => {
        const cellData = columns.map((col) => {
          let items = [];
          if (col.subplace === null) {
            Object.keys(manners[manner][col.place] || {}).forEach((sub) => {
              items = items.concat(
                (manners[manner][col.place][sub] || []).filter((item) =>
                  item.submanner.includes(submanner)
                )
              );
            });
          } else {
            items = (manners[manner][col.place]?.[col.subplace] || []).filter((item) =>
              item.submanner.includes(submanner)
            );
          }
          const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
          return {
            key: `${manner}-${col.place}-${col.subplace || "all"}-${submanner}`,
            content: uniqueChars.join(" "),
          };
        });
        const mergedCells = mergeCells(cellData);
        return (
          <TableRow key={`${manner}-${submanner}`}>
            {subIdx === 0 && (
              <TableCell align="center" rowSpan={submannersForManner.length}>
                {manner}
              </TableCell>
            )}
            <TableCell align="center">{submanner}</TableCell>
            {mergedCells.map((cell) => (
              <TableCell key={cell.key} align="center" colSpan={cell.colSpan}>
                {cell.content.split(" ").filter(Boolean).map((ch, idx) =>
                  renderCellContent 
                    ? renderCellContent(ch, idx)
                    : <div key={idx}>/{ch}/</div>
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
