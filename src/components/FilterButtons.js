import React from 'react';
import { Button, Box } from '@mui/material';

const FilterButtons = ({
  manners,            
  allManners,
  allPlaces,
  ignoreManners,
  setIgnoreManners,
  ignorePlaces,
  setIgnorePlaces,
}) => {
  const filteredManners = allManners.filter(manner => {
    const mannerData = manners[manner];
    if (!mannerData) return false;
    const submannerSet = new Set();
    Object.values(mannerData).forEach(placeData => {
      Object.values(placeData).forEach(arr => {
        arr.forEach(item => {
          item.submanner.forEach(sm => submannerSet.add(sm));
        });
      });
    });
    return submannerSet.size > 1;
  });

  const filteredPlaces = allPlaces.filter(place => {
    let subplaces = new Set();
    Object.values(manners).forEach(mannerData => {
      if (mannerData[place]) {
        Object.keys(mannerData[place]).forEach(subplace => {
          subplaces.add(subplace);
        });
      }
    });
    return subplaces.size > 1;
  });

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
      {filteredManners.length > 0 && (
        <Box mb={2}>
          <h3>Manners (ignorar submanners)</h3>
          {filteredManners.map((manner) => (
            <Button
              key={manner}
              variant={ignoreManners.includes(manner) ? "contained" : "outlined"}
              onClick={() => toggleManner(manner)}
            >
              {manner}
            </Button>
          ))}
        </Box>
      )}
      {filteredPlaces.length > 0 && (
        <Box mb={2}>
          <h3>Places (ignorar subplaces)</h3>
          {filteredPlaces.map((place) => (
            <Button
              key={place}
              variant={ignorePlaces.includes(place) ? "contained" : "outlined"}
              onClick={() => togglePlace(place)}
            >
              {place}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FilterButtons;
