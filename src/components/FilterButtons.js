import React from 'react';
import { Button, Box } from '@mui/material';

const FilterButtons = ({
  allManners,
  allPlaces,
  ignoreManners,
  setIgnoreManners,
  ignorePlaces,
  setIgnorePlaces,
}) => {
  const toggleManner = (manner) => {
    if (ignoreManners.includes(manner)) {
      setIgnoreManners(ignoreManners.filter((m) => m !== manner));
    } else {
      setIgnoreManners([...ignoreManners, manner]);
    }
  };

  const togglePlace = (place) => {
    if (ignorePlaces.includes(place)) {
      setIgnorePlaces(ignorePlaces.filter((p) => p !== place));
    } else {
      setIgnorePlaces([...ignorePlaces, place]);
    }
  };

  return (
    <Box mb={2}>
      <Box mb={2}>
        <h3>Manners (ignorar submanners)</h3>
        {allManners.map((manner) => (
          <Button
            key={manner}
            variant={ignoreManners.includes(manner) ? "contained" : "outlined"}
            onClick={() => toggleManner(manner)}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            {manner}
          </Button>
        ))}
      </Box>
      <Box mb={2}>
        <h3>Places (ignorar subplaces)</h3>
        {allPlaces.map((place) => (
          <Button
            key={place}
            variant={ignorePlaces.includes(place) ? "contained" : "outlined"}
            onClick={() => togglePlace(place)}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            {place}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default FilterButtons;
