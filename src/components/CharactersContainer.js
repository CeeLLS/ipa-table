import React, { useState } from "react";
import json from "../data/characters.json";
import fixedData from "../data/fixed_characters.json";
import VirtualKeyboard from "./VirtualKeyboard";
import TokenDisplay from "./TokenDisplay";
import CharactersTable from "./CharactersTable";
import FilterButtons from "./FilterButtons";
import FixedCharactersTable from "./FixedCharactersTable";
import TokenEditor from "./TokenEditor";
import { addCharLogic, removeCharLogic } from "../utils/characterService";
// import orderConfig from "../data/orderConfig.json";

// const allPlaces = orderConfig.placeOrder;
// const allManners = Array.from(new Set([
//   ...orderConfig.mannerOrder,
//   ...Object.keys(manners)
// ]));


const combinedData = [...json, ...fixedData];

const allManners = ["Plosive", "Affricate", "Nasal", "Trill", "Tap", "Fricative", "Lateral", "Approximant"];
const allPlaces = ["Bilabial", "Labiodental", "Dental", "Alveolar", "Postalveolar", "Retroflex", "Palatal", "Velar", "Uvular", "Pharyngeal", "Glottal"];



function CharactersContainer() {
  const [tokens, setTokens] = useState([]);
  const [manners, setManners] = useState({});
  const [addedChars, setAddedChars] = useState(new Set());
  const [ignoreManners, setIgnoreManners] = useState([]);
  const [ignorePlaces, setIgnorePlaces] = useState([]);

  const handleSelect = (char) => {
    if (!tokens.includes(char)) {
      setTokens((prev) => [...prev, char]);
      setManners((prev) => addCharLogic(prev, char, combinedData));
      setAddedChars((prev) => new Set(prev).add(char));
    }
  };

  const handleRemove = (idx) => {
    const char = tokens[idx];
    setTokens((prev) => prev.filter((_, i) => i !== idx));
    setManners((prev) => removeCharLogic(prev, char));
    setAddedChars((prev) => {
      const newSet = new Set(prev);
      newSet.delete(char);
      return newSet;
    });
  };

  const handleTokenUpdate = (oldChar, updatedToken) => {
    const newCombinedData = combinedData.map(c => c.char === oldChar ? updatedToken : c);
    const newTokens = tokens.map(t => t === oldChar ? updatedToken.char : t);
    
    setTokens(newTokens);
    setManners(prev => {
      let newManners = removeCharLogic(prev, oldChar);
      return addCharLogic(newManners, updatedToken.char, newCombinedData);
    });
  };

  return (
    <div>
      <VirtualKeyboard chars={json} onSelect={handleSelect} />
      <FixedCharactersTable onSelectFixed={handleSelect} />
      <TokenEditor 
        tokens={tokens}
        combinedData={combinedData}
        onTokenUpdate={handleTokenUpdate}
      />
      <TokenDisplay tokens={tokens} onRemove={handleRemove} />
      <FilterButtons 
        manners={manners}
        allManners={allManners}
        allPlaces={allPlaces}
        ignoreManners={ignoreManners}
        setIgnoreManners={setIgnoreManners}
        ignorePlaces={ignorePlaces}
        setIgnorePlaces={setIgnorePlaces}
      />
      <CharactersTable 
        manners={manners}
        ignoreManners={ignoreManners}
        ignorePlaces={ignorePlaces}
      />
    </div>
  );
}

export default CharactersContainer;
