import React, { useState } from "react";
import Characters from "../utils/Characters";
import json from "../data/characters.json";

function Input() {
  const [inputValue, setInputValue] = useState("");
  const allowedChacters = json.map((e) => e.char);

  const handleAddChar = (char) => {
    setInputValue(inputValue + char);
  };

  return (
    <div class="inputChars">
      <Characters onAddChar={handleAddChar} />
    </div>
  );
}

export default Input;
