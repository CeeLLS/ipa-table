import React, { useState } from "react";
import json from "../data/characters.json";
import { Table, TableRow, TableCell, TextField, Box, Button, Chip } from "@mui/material";
import "../styles/App.css";


// const VirtualKeyboard = ({ chars, onSelect }) => (
//   <Box
//     display="grid"
//     gridTemplateColumns="repeat(auto-fill, minmax(48px, 1fr))"
//     gap={1}
//     mb={2}
//   >
//     {chars.map((c) => (
//       <Button
//         key={c.char}
//         variant="outlined"
//         size="small"
//         onClick={() => onSelect(c.char)}
//       >
//         {c.char}
//       </Button>
//     ))}
//   </Box>
// );

// const TokenDisplay = ({ tokens, onRemove }) => (
//   <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
//     {tokens.map((tk, idx) => (
//       <Chip
//         key={`${tk}-${idx}`}
//         label={`/${tk}/`}
//         onDelete={() => onRemove(idx)}
//         size="small"
//       />
//     ))}
//   </Box>
// );






function Characters() {
  const [tokens, setTokens] = useState([]);
  const [manners, setManners] = useState({});
  // const [input, setInput] = useState("");
  const [addedChars, setAddedChars] = useState(new Set());


  const VirtualKeyboard = ({ chars, onSelect }) => (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(48px, 1fr))"
      gap={1}
      mb={2}
    >
      {chars.map((c) => (
        <Button
          key={c.char}
          variant="outlined"
          size="small"
          onClick={() => onSelect(c.char)}
        >
          {c.char}
        </Button>
      ))}
    </Box>
  );
  
  const TokenDisplay = ({ tokens, onRemove }) => (
    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
      {tokens.map((tk, idx) => (
        <Chip
          key={`${tk}-${idx}`}
          label={`/${tk}/`}
          onDelete={() => onRemove(idx)}
          size="small"
        />
      ))}
    </Box>
  );

  const handleSelect = (char) => {
    if (!tokens.includes(char)) {
      setTokens((t) => [...t, char]);
      handleAddChar(char);
    }
  };

  // Quando o usuário remove um bloco/token:
  const handleRemove = (idx) => {
    const removed = tokens[idx];
    setTokens((t) => t.filter((_, i) => i !== idx));
    handleRemoveChar(removed);
  };


  const handleAddChar = (char) => {
    const charData = json.find((item) => item.char === char);
    if (!charData) return;
  
    // Usa o primeiro subplace, ou "N/A" se não houver
    const subplace = charData.subplace.length > 0 ? charData.subplace[0] : "N/A";
    const manner = charData.manner[0];
  
    setManners((prev) => {
      const newManners = { ...prev };
      if (!newManners[manner]) {
        newManners[manner] = {};
      }
      // Itera por todos os valores de place
      charData.place.forEach((place) => {
        if (!newManners[manner][place]) {
          newManners[manner][place] = {};
        }
        if (!newManners[manner][place][subplace]) {
          newManners[manner][place][subplace] = [];
        }
        // Adiciona o caractere se ainda não estiver presente
        if (!newManners[manner][place][subplace].some((item) => item.char === char)) {
          newManners[manner][place][subplace].push(charData);
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

  // const handleInputChange = (e) => {
  //   const value = e.target.value;
  //   const validChars = [...new Set(value.split(""))].filter((char) =>
  //     json.some((item) => item.char === char)
  //   );

  //   setInput(validChars.join(""));

  //   validChars.forEach((char) => {
  //     if (!addedChars.has(char)) {
  //       handleAddChar(char);
  //     }
  //   });

  //   [...addedChars].forEach((char) => {
  //     if (!validChars.includes(char)) {
  //       handleRemoveChar(char);
  //     }
  //   });
  // };

  // Variáveis fixas para a tabela
  const allPlaces = ["Bilabial", "Labiodental", "Dental", "Alveolar", "Postalveolar", "Retroflex", "Palatal", "Velar", "Uvular", "Pharyngeal", "Glottal"];
  const allSubplaces = ["Unvoiced", "Voiced", "Labialized"];
  const allManners = ["Plosive", "Affricate", "Nasal", "Trill", "Tap", "Fricative", "Lateral", "Approximant"];
  const allSubmanners = ["Voiceless", "Voiced"];

  // Se algum caractere não tiver subplace definido, será "N/A"
  const includeNA = Object.keys(manners).some((manner) =>
    Object.keys(manners[manner] || {}).some((place) =>
      Object.keys(manners[manner][place] || {}).includes("N/A")
    )
  );
  const subplacesToRender = includeNA ? [...allSubplaces, "N/A"] : allSubplaces;

  // Função utilitária para determinar o colSpan: "N/A" ocupa 2 colunas
  const getSubplaceColSpan = (subplace) => {
    return subplace === "N/A" ? 1 : 1;
  };

  const TableHeader = () => {
    // Inclui todos os lugares que possuem dados em "manners"
    const placesWithData = allPlaces.filter((place) =>
      Object.keys(manners).some((manner) =>
        Object.keys(manners[manner] || {}).includes(place)
      )
    );
  
    const getSubplacesForPlace = (place) => {
      return subplacesToRender.filter((subplace) =>
        Object.keys(manners).some((manner) =>
          (manners[manner]?.[place]?.[subplace] || []).length > 0
        )
      );
    };
  
    return (
      <>
        <TableRow>
          <TableCell />
          <TableCell />
          {placesWithData.map((place) => {
            const subs = getSubplacesForPlace(place);
            if (subs.length === 1 && subs[0] === "N/A") {
              return (
                <TableCell key={place} align="center" rowSpan={2}>
                  {place}
                </TableCell>
              );
            } else {
              const colSpan = subs.reduce(
                (acc, sub) => acc + getSubplaceColSpan(sub),
                0
              );
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
            const subs = getSubplacesForPlace(place);
            if (subs.length === 1 && subs[0] === "N/A") return null;
            return subs.map((subplace) => (
              <TableCell
                key={`${place}-${subplace}`}
                align="center"
                colSpan={getSubplaceColSpan(subplace)}
              >
                {/* Substituir "N/A" por "Plain" para qualquer lugar */}
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
      cells[i].content.trim() === cells[i + 1].content.trim() // Remove espaços extras
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

  const subplacesWithData = (place) =>
    subplacesToRender.filter((subplace) =>
      subplace === "N/A" ||
      Object.keys(manners).some((manner) =>
        manners[manner]?.[place]?.[subplace]?.length
      )
    );

  return (
    <>
      {allManners.map((manner) => {
        const hasData = Object.keys(manners[manner] || {}).length > 0;
        if (!hasData) return null;

        // Descobre quantos submanners esse manner tem
        const submannersForManner = allSubmanners.filter((submanner) =>
          Object.keys(manners[manner] || {}).some((place) =>
            Object.keys(manners[manner][place] || {}).some((subplace) =>
              manners[manner][place][subplace]?.some((item) =>
                item.submanner.includes(submanner)
              )
            )
          )
        );

        // CASO ESPECIAL: só 1 submanner
        if (submannersForManner.length === 1) {
          const subm = submannersForManner[0];

          // Gera os dados das células para este único submanner
          const cellsData = placesWithData.flatMap((place) =>
            subplacesWithData(place).map((subplace) => {
              const items = Object.keys(manners[manner] || {}).flatMap(
                (placeKey) =>
                  (manners[manner]?.[placeKey]?.[subplace] || []).filter(
                    (item) =>
                      item.submanner.includes(subm) &&
                      item.place.includes(place)
                  )
              );
              const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
              return {
                key: `${manner}-${place}-${subplace}-${subm}`,
                content: uniqueChars.join(" "),
              };
            })
          );

          // Aplica mergeCells para fundir colunas com mesmo conteúdo
          const merged = mergeCells(cellsData);

          return (
            <TableRow key={manner}>
              {/* Junta manner + submanner numa célula só */}
              <TableCell align="center" colSpan={2}>
                {manner}
              </TableCell>
              {/* Renderiza as células mescladas */}
              {merged.map((cell) => (
                <TableCell
                  key={cell.key}
                  align="center"
                  colSpan={cell.colSpan}
                >
                  {cell.content
                    .split(" ")
                    .filter(Boolean)
                    .map((ch, idx) => (
                      <div key={idx}>/{ch}/</div>
                    ))}
                </TableCell>
              ))}
            </TableRow>
          );
        }

        // CASO NORMAL: múltiplos submanners (seu código original)
        return (
          <React.Fragment key={manner}>
            {allSubmanners.map((submanner, submIdx) => {
              // Gera os dados das células para este submanner
              const cellsData = placesWithData.flatMap((place) =>
                subplacesWithData(place).map((subplace) => {
                  const items = Object.keys(manners[manner] || {}).flatMap(
                    (placeKey) =>
                      (manners[manner]?.[placeKey]?.[subplace] || []).filter(
                        (item) =>
                          item.submanner.includes(submanner) &&
                          item.place.includes(place)
                      )
                  );
                  const uniqueChars = Array.from(new Set(items.map((i) => i.char)));
                  return {
                    key: `${manner}-${place}-${subplace}-${submanner}`,
                    content: uniqueChars.join(" "),
                  };
                })
              );

              const merged = mergeCells(cellsData);

              return (
                <TableRow key={`${manner}-${submanner}`}>
                  {submIdx === 0 && (
                    <TableCell
                      align="center"
                      rowSpan={submannersForManner.length}
                    >
                      {manner}
                    </TableCell>
                  )}
                  <TableCell align="center">{submanner}</TableCell>
                  {merged.map((cell) => (
                    <TableCell
                      key={cell.key}
                      align="center"
                      colSpan={cell.colSpan}
                    >
                      {cell.content
                        .split(" ")
                        .filter(Boolean)
                        .map((ch, idx) => (
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