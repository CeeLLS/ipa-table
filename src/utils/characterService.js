export function addCharLogic(currentManners, char, jsonData) {
  const charData = jsonData.find((item) => item.char === char);
  if (!charData) return currentManners;
  
  const subplace = charData.subplace.length > 0 ? charData.subplace[0] : "N/A";
  const manner = charData.manner[0];
  const ignoreSubmanner = false; 
  const newCharData = {
    ...charData,
    submanner: ignoreSubmanner ? ["all"] : charData.submanner,
  };

  const updatedManners = { ...currentManners };
  if (!updatedManners[manner]) {
    updatedManners[manner] = {};
  }
  charData.place.forEach((place) => {
    if (!updatedManners[manner][place]) {
      updatedManners[manner][place] = {};
    }
    if (!updatedManners[manner][place][subplace]) {
      updatedManners[manner][place][subplace] = [];
    }
    if (!updatedManners[manner][place][subplace].some((item) => item.char === char)) {
      updatedManners[manner][place][subplace].push(newCharData);
    }
  });
  return updatedManners;
}

export function removeCharLogic(currentManners, char) {
  const updatedManners = { ...currentManners };
  Object.keys(updatedManners).forEach((manner) => {
    Object.keys(updatedManners[manner]).forEach((place) => {
      Object.keys(updatedManners[manner][place]).forEach((subplace) => {
        updatedManners[manner][place][subplace] = updatedManners[manner][place][subplace].filter(
          (item) => item.char !== char
        );
        if (updatedManners[manner][place][subplace].length === 0) {
          delete updatedManners[manner][place][subplace];
        }
      });
      if (Object.keys(updatedManners[manner][place]).length === 0) {
        delete updatedManners[manner][place];
      }
    });
    if (Object.keys(updatedManners[manner]).length === 0) {
      delete updatedManners[manner];
    }
  });
  return updatedManners;
}
