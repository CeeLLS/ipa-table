import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ipaModifiers from "../../data/ipaModifiers.json";
import fixedData from "../../data/fixed_characters.json";
// import "./AddCharacterMenu.module.css";

const AddCharacterMenu = ({
  onAddCharacter,
  availableManners,
  availablePlaces,
}) => {
  const [copyMode, setCopyMode] = useState(false);
  const [selectedFixedChar, setSelectedFixedChar] = useState("");
  const [char, setChar] = useState("");
  const [manner, setManner] = useState([]);
  const [place, setPlace] = useState([]);
  const [subplaces, setSubplaces] = useState([]);
  const [submanners, setSubmanners] = useState([]);

  const toggleSubplace = (modName) => {
    setSubplaces((prev) =>
      prev.includes(modName)
        ? prev.filter((item) => item !== modName)
        : [...prev, modName]
    );
  };

  const toggleSubmanner = (modName) => {
    setSubmanners((prev) =>
      prev.includes(modName)
        ? prev.filter((item) => item !== modName)
        : [...prev, modName]
    );
  };

  const togglePlace = (p) => {
    setPlace((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const getSymbolsFromNames = (names, modifierType) => {
    return names
      .map(
        (name) =>
          ipaModifiers[modifierType].find((m) => m.name === name)?.symbol || ""
      )
      .join("");
  };

  const baseChar = copyMode ? selectedFixedChar : char;
  const finalChar =
    baseChar +
    getSymbolsFromNames(subplaces, "subplace") +
    getSymbolsFromNames(submanners, "submanner");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCharacter({
      char: finalChar,
      manner,
      place,
      subplace: subplaces,
      submanner: submanners.length > 0 ? submanners : ["none"],
    });
    setChar("");
    setSelectedFixedChar("");
    setManner([]);
    setPlace([]);
    setSubplaces([]);
    setSubmanners([]);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="add-character-menu"
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={copyMode}
            onChange={(e) => setCopyMode(e.target.checked)}
            className="theme-checkbox"
          />
        }
        label="Copy from fixed table"
        className="form-control-label"
      />
  
      {copyMode ? (
        <FormControl className="form-control-select" required>
          <InputLabel className="select-label">Fixed Character</InputLabel>
          <Select
            value={selectedFixedChar}
            onChange={(e) => setSelectedFixedChar(e.target.value)}
            label="Fixed Character"
            className="select-input"
          >
            {fixedData.map((item) => (
              <MenuItem key={item.char} value={item.char} className="menu-item">
                {item.char}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          label="Character"
          value={char}
          onChange={(e) => setChar(e.target.value)}
          required
          className="text-input"
        />
      )}
  
      <Accordion className="custom-accordion">
        <AccordionSummary
          expandIcon={<span className="expand-icon">↓</span>}
          className="accordion-summary"
        >
          Manner(s)
        </AccordionSummary>
        <AccordionDetails className="accordion-details">
          <Grid container spacing={1}>
            {availableManners.map((m) => (
              <Grid item key={m}>
                <Tooltip title={m}>
                  <Button
                    className={`manner-button ${manner.includes(m) ? 'contained' : ''}`}
                    onClick={() =>
                      setManner((prev) =>
                        prev.includes(m)
                          ? prev.filter((item) => item !== m)
                          : [...prev, m]
                      )
                    }
                    size="small"
                  >
                    {m}
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
  
      <Accordion className="custom-accordion">
        <AccordionSummary
          expandIcon={<span className="expand-icon">↓</span>}
          className="accordion-summary"
        >
          Place(s)
        </AccordionSummary>
        <AccordionDetails className="accordion-details">
          <Grid container spacing={1}>
            {availablePlaces.map((p) => (
              <Grid item key={p}>
                <Tooltip title={p}>
                  <Button
                    className={`place-button ${place.includes(p) ? 'contained' : ''}`}
                    onClick={() => togglePlace(p)}
                    size="small"
                  >
                    {p}
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
  
      <Accordion className="custom-accordion">
        <AccordionSummary
          expandIcon={<span className="expand-icon">↓</span>}
          className="accordion-summary"
        >
          Subplace(s)
        </AccordionSummary>
        <AccordionDetails className="accordion-details">
          <Grid container spacing={1}>
            {ipaModifiers.subplace.map((mod) => (
              <Grid item key={mod.symbol}>
                <Tooltip title={mod.name}>
                  <Button
                    className={`subplace-button ${subplaces.includes(mod.name) ? 'contained' : ''}`}
                    onClick={() => toggleSubplace(mod.name)}
                    size="small"
                  >
                    {mod.symbol}
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
  
      <Accordion className="custom-accordion">
        <AccordionSummary
          expandIcon={<span className="expand-icon">↓</span>}
          className="accordion-summary"
        >
          Submanner(s)
        </AccordionSummary>
        <AccordionDetails className="accordion-details">
          <Grid container spacing={1}>
            {ipaModifiers.submanner.map((mod) => (
              <Grid item key={mod.symbol}>
                <Tooltip title={mod.name}>
                  <Button
                    className={`submanner-button ${submanners.includes(mod.name) ? 'contained' : ''}`}
                    onClick={() => toggleSubmanner(mod.name)}
                    size="small"
                  >
                    {mod.symbol}
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
  
      <Box className="character-preview">
        <Typography variant="h3" className="preview-text">
          {finalChar}
        </Typography>
      </Box>
  
      <Button type="submit" variant="contained" className="submit-button">
        Add Character
      </Button>
    </Box>
  );
};

export default AddCharacterMenu;