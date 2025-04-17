import "./styles/App.css";
import React from "react";
import { Container } from "@mui/material";
import CharactersContainer from "./components/CharactersContainer/CharactersContainer";
import ThemeSwitch from "./components/ThemeSwitch/ThemeSwitch";

function App() {
  return (
    <div className="App">
      <ThemeSwitch />
      <Container>
        <CharactersContainer />
      </Container>
    </div>
  );
}

export default App;