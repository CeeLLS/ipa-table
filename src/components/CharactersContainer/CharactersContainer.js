import React, { useState } from "react";
// import './CharactersContainer.module.css'
import json from "../../data/characters.json";
import fixedData from "../../data/fixed_characters.json";
import VirtualKeyboard from "../VirtualKeyboard/VirtualKeyboard";
import TokenDisplay from "../TokenDisplay/TokenDisplay";
import CharactersTable from "../CharactersTable/CharactersTable";
import FilterButtons from "../FilterButtons/FilterButtons";
import FixedCharactersTable from "../FixedCharactersTable/FixedCharactersTable";
import TokenEditor from "../TokenEditor/TokenEditor";
import AddCharacterMenu from "../AddCharacterMenu/AddCharacterMenu";
import { addCharLogic, removeCharLogic } from "../../utils/characterService";

const allManners = [
  "Plosive",
  "Affricate",
  "Nasal",
  "Trill",
  "Tap",
  "Fricative",
  "Lateral",
  "Approximant",
];
const allPlaces = [
  "Bilabial",
  "Labiodental",
  "Dental",
  "Alveolar",
  "Postalveolar",
  "Retroflex",
  "Palatal",
  "Velar",
  "Uvular",
  "Pharyngeal",
  "Glottal",
];

function CharactersContainer() {
  const [editableData, setEditableData] = useState(json);
  const combinedData = [...editableData, ...fixedData];
  
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
    setEditableData(prev => 
      prev.map(c => c.char === oldChar ? updatedToken : c)
    );
    
    if (tokens.includes(oldChar)) {
      setTokens(prev => 
        prev.map(t => t === oldChar ? updatedToken.char : t)
      );
    }
    
    setManners(prev => {
      const cleaned = removeCharLogic(prev, oldChar);
      return addCharLogic(cleaned, updatedToken.char, combinedData);
    });
  };

  return (
    <div>
      <VirtualKeyboard chars={editableData} onSelect={handleSelect} />
      <FixedCharactersTable onSelectFixed={handleSelect} />
      
    <div className="form-container">
      <AddCharacterMenu 
        availableManners={allManners}
        availablePlaces={allPlaces}
      />
      <TokenEditor
        tokens={tokens}
        combinedData={combinedData}
        onTokenUpdate={handleTokenUpdate}
      />
    </div>


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
