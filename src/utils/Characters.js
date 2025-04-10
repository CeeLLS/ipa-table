import React, { useState } from "react";
import json from "../data/characters.json";
import { Table, TableRow, TableCell, Box, Button, Chip } from "@mui/material";
import "../styles/App.css";

function Characters() {
  const [tokens, setTokens] = useState([]);
  const [manners, setManners] = useState({});
  const [addedChars, setAddedChars] = useState(new Set());


  const ignoreSubplacesFor = [];
  const ignoreSubmannersFor = []; 

  const VirtualKeyboard = ({ chars, onSelect }) => (
    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(48px, 1fr))" gap={1} mb={2}>
      {chars.map((c) => (
        <Button key={c.char} variant="outlined" size="small" onClick={() => onSelect(c.char)}>
          {c.char}
        </Button>
      ))}
    </Box>
  );
  
  const TokenDisplay = ({ tokens, onRemove }) => (
    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
      {tokens.map((tk, idx) => (
        <Chip key={`${tk}-${idx}`} label={`/${tk}/`} onDelete={() => onRemove(idx)} size="small" />
      ))}
    </Box>
  );

  const handleSelect = (char) => {
    if (!tokens.includes(char)) {
      setTokens((t) => [...t, char]);
      handleAddChar(char);
    }
  };

  const handleRemove = (idx) => {
    const removed = tokens[idx];
    setTokens((t) => t.filter((_, i) => i !== idx));
    handleRemoveChar(removed);
  };

  const handleAddChar = (char) => {
    const charData = json.find((item) => item.char === char);
    if (!charData) return;
    
    const subplace = charData.subplace.length > 0 ? charData.subplace[0] : "N/A";
    const manner = charData.manner[0];
    const ignoreSubmanner = ignoreSubmannersFor.includes(manner);
    const newCharData = {
      ...charData,
      submanner: ignoreSubmanner ? ["all"] : charData.submanner,
    };

    setManners((prev) => {
      const newManners = { ...prev };
      if (!newManners[manner]) {
        newManners[manner] = {};
      }
      charData.place.forEach((place) => {
        if (!newManners[manner][place]) {
          newManners[manner][place] = {};
        }
        if (!newManners[manner][place][subplace]) {
          newManners[manner][place][subplace] = [];
        }
        if (!newManners[manner][place][subplace].some((item) => item.char === char)) {
          newManners[manner][place][subplace].push(newCharData);
        }
      });
      return newManners;
    });
    
    setAddedChars((prev) => new Set(prev).add(char));
  };

  const handleRemoveChar = (char) => {
    setManners((prev) => {
      const newManners = { ...prev };
      Object.keys(newManners).forEach((manner) => {
        Object.keys(newManners[manner]).forEach((place) => {
          Object.keys(newManners[manner][place]).forEach((subplace) => {
            newManners[manner][place][subplace] = newManners[manner][place][subplace].filter(
              (item) => item.char !== char
            );
            if (newManners[manner][place][subplace].length === 0) {
              delete newManners[manner][place][subplace];
            }
          });
          if (Object.keys(newManners[manner][place]).length === 0) {
            delete newManners[manner][place];
          }
        });
        if (Object.keys(newManners[manner]).length === 0) {
          delete newManners[manner];
        }
      });
      return newManners;
    });
    
    setAddedChars((prev) => {
      const newSet = new Set(prev);
      newSet.delete(char);
      return newSet;
    });
  };

  const allPlaces = ["Bilabial", "Labiodental", "Dental", "Alveolar", "Postalveolar", "Retroflex", "Palatal", "Velar", "Uvular", "Pharyngeal", "Glottal"];
  const allSubplaces = ["Unvoiced", "Voiced", "Labialized", "Palatalized", "Velarized", "Pharyngealized"];
  const allManners = ["Plosive", "Affricate", "Nasal", "Trill", "Tap", "Fricative", "Lateral", "Approximant"];
  const allSubmanners = ["Voiceless", "Voiced", "Ejective"];

  const includeNA = Object.keys(manners).some((manner) =>
    Object.keys(manners[manner] || {}).some((place) =>
      Object.keys(manners[manner][place] || {}).includes("N/A")
    )
  );
  const subplacesToRender = includeNA ? [...allSubplaces, "N/A"] : allSubplaces;
  
  const getSubplaceColSpan = (subplace) => 1;

  const TableHeader = () => {
    const placesWithData = allPlaces.filter((place) =>
      Object.keys(manners).some((manner) =>
        Object.keys(manners[manner] || {}).includes(place)
      )
    );
  

    const getSubplacesForPlace = (place) => {
      if (ignoreSubplacesFor.includes(place)) {
        return []; 
      }
      const subs = subplacesToRender.filter((subplace) =>
        Object.keys(manners).some((manner) =>
          (manners[manner]?.[place]?.[subplace] || []).length > 0
        )
      );
      return subs.length ? subs : ["N/A"];
    };
  
    return (
      <>
        <TableRow>
          <TableCell />
          <TableCell />
          {placesWithData.map((place) => {
            const subs = getSubplacesForPlace(place);
            if (ignoreSubplacesFor.includes(place) || (subs.length === 1 && subs[0] === "N/A")) {
              return (
                <TableCell key={place} align="center" rowSpan={2}>
                  {place}
                </TableCell>
              );
            } else {
              const colSpan = subs.reduce((acc, sub) => acc + getSubplaceColSpan(sub), 0);
              return (
                <TableCell key={place} align="center" colSpan={colSpan}>
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
            if (ignoreSubplacesFor.includes(place)) return null;
            const subs = getSubplacesForPlace(place);
            if (subs.length === 1 && subs[0] === "N/A") return null;
            return subs.map((subplace, idx) => (
              <TableCell key={`${place}-${subplace}-${idx}`} align="center" colSpan={getSubplaceColSpan(subplace)}>
                {subplace === "N/A" ? "Plain" : subplace}
              </TableCell>
            ));
          })}
        </TableRow>
      </>
    );
  };
  

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
      merged.push({ content: cells[i].content.trim(), key: cells[i].key, colSpan: mergeCount });
    }
    return merged;
  };


  const TableBody = () => {
    const placesWithData = allPlaces.filter((place) =>
      Object.keys(manners).some((manner) =>
        Object.keys(manners[manner] || {}).includes(place)
      )
    );
  
    const subplacesWithData = (place) => {
      if (ignoreSubplacesFor.includes(place)) {
        return null; 
      }
      const subs = subplacesToRender.filter((subplace) =>
        Object.keys(manners).some((manner) =>
          (manners[manner]?.[place]?.[subplace] || []).length > 0
        )
      );
      return subs.length ? subs : ["N/A"];
    };
  
    return (
      <>
        {allManners.map((manner) => {
          if (!manners[manner]) return null;
  
          const submannersForManner = ignoreSubmannersFor.includes(manner)
            ? ["all"]
            : allSubmanners.filter((submanner) =>
                Object.keys(manners[manner] || {}).some((place) =>
                  Object.keys(manners[manner][place] || {}).some((subplace) =>
                    manners[manner][place][subplace]?.some((item) =>
                      item.submanner.includes(submanner)
                    )
                  )
                )
              );
  
          if (submannersForManner.length === 1) {
            const subm = submannersForManner[0];
            const cellsData = placesWithData.flatMap((place) => {
              if (ignoreSubplacesFor.includes(place)) {
                const keys = Object.keys(manners[manner][place] || {});
                const items = keys.flatMap((k) =>
                  (manners[manner][place][k] || []).filter((item) => item.submanner.includes(subm))
                );
                const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
                return [{
                  key: `${manner}-${place}-all-${subm}`,
                  content: uniqueChars.join(" "),
                }];
              } else {
                return subplacesWithData(place).map((subplace) => {
                  const items = Object.keys(manners[manner] || {}).flatMap((placeKey) =>
                    (manners[manner]?.[placeKey]?.[subplace] || []).filter(
                      (item) =>
                        item.submanner.includes(subm) && item.place.includes(place)
                    )
                  );
                  const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
                  return {
                    key: `${manner}-${place}-${subplace}-${subm}`,
                    content: uniqueChars.join(" "),
                  };
                });
              }
            });
  
            const merged = mergeCells(cellsData);
  
            return (
              <TableRow key={manner}>
                <TableCell align="center" colSpan={2}>{manner}</TableCell>
                {merged.map((cell) => (
                  <TableCell key={cell.key} align="center" colSpan={cell.colSpan}>
                    {cell.content.split(" ").filter(Boolean).map((ch, idx) => (
                      <div key={idx}>/{ch}/</div>
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            );
          }
  
          return (
            <React.Fragment key={manner}>
              {submannersForManner.map((submanner, submIdx) => {
                const cellsData = placesWithData.flatMap((place) => {
                  if (ignoreSubplacesFor.includes(place)) {
                    const keys = Object.keys(manners[manner][place] || {});
                    const items = keys.flatMap((k) =>
                      (manners[manner][place][k] || []).filter((item) => item.submanner.includes(submanner))
                    );
                    const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
                    return [{
                      key: `${manner}-${place}-all-${submanner}`,
                      content: uniqueChars.join(" "),
                    }];
                  } else {
                    return subplacesWithData(place).map((subplace) => {
                      const items = Object.keys(manners[manner] || {}).flatMap((placeKey) =>
                        (manners[manner]?.[placeKey]?.[subplace] || []).filter(
                          (item) =>
                            item.submanner.includes(submanner) && item.place.includes(place)
                        )
                      );
                      const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
                      return {
                        key: `${manner}-${place}-${subplace}-${submanner}`,
                        content: uniqueChars.join(" "),
                      };
                    });
                  }
                });
  
                const merged = mergeCells(cellsData);
  
                return (
                  <TableRow key={`${manner}-${submanner}`}>
                    {submIdx === 0 && (
                      <TableCell align="center" rowSpan={submannersForManner.length}>
                        {manner}
                      </TableCell>
                    )}
                    <TableCell align="center">{submanner}</TableCell>
                    {merged.map((cell) => (
                      <TableCell key={cell.key} align="center" colSpan={cell.colSpan}>
                        {cell.content.split(" ").filter(Boolean).map((ch, idx) => (
                          <div key={idx}>/{ch}/</div>
                        ))}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </React.Fragment>
          );
        })}
      </>
    );
  };
  
  
  
  const renderTable = () => (
    <Table>
      <TableHeader />
      <TableBody />
    </Table>
  );
  
  return (
    <div>
      <VirtualKeyboard chars={json} onSelect={handleSelect} />
      <TokenDisplay tokens={tokens} onRemove={handleRemove} />
      {renderTable()}
    </div>
  );
}
  
export default Characters;
