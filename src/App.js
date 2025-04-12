import "./styles/App.css";
import React from "react";
import { Container } from "@mui/material";
import CharactersContainer from "./components/CharactersContainer";

function App() {
  return (
    <div className="App">
      <Container>
        <CharactersContainer />
      </Container>
    </div>
  );
}

export default App;
