import { TextField } from "@mui/material";
import React, { useState } from "react";
import Characters from "./Characters";
import json from "./characters.json";

function Input() {
  const [inputValue, setInputValue] = useState("");
  const allowedChacters = json.map((e) => e.char);

  const handleKeypress = (event) => {
    const pressedKey = event.key.toLowerCase();
    if (!allowedChacters.includes(pressedKey)) {
      event.preventDefault();
    }
  };

  const handleChange = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
  };

  const handleAddChar = (char) => {
    setInputValue(inputValue + char);
  };

  return (
    <div class="inputChars">
      <TextField
        label="CharactersPresent"
        fullWidth
        onKeyDown={handleKeypress}
        onChange={handleChange}
        value={inputValue}
      />
      <Characters onAddChar={handleAddChar} />
    </div>
  );
}

export default Input;
