import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import orderConfig from '../data/orderConfig';

const TokenEditor = ({ tokens, combinedData, onTokenUpdate }) => {
  const [selectedToken, setSelectedToken] = React.useState(null);
  const [editedAttributes, setEditedAttributes] = React.useState({});

  const allManners = orderConfig.mannerOrder;
  const allPlaces = orderConfig.placeOrder;

  // Encontrar os dados completos do token selecionado
  const tokenData = combinedData.find(c => c.char === selectedToken) || {};

  const handleAttributeChange = (field, value) => {
    setEditedAttributes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveChanges = () => {
    if (selectedToken) {
      const updatedToken = {
        ...tokenData,
        ...editedAttributes
      };
      onTokenUpdate(selectedToken, updatedToken);
      setEditedAttributes({});
    }
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '30%' }}>Tokens</TableCell>
            <TableCell style={{ width: '70%' }}>Atributos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              {tokens.map((token, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedToken(token)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedToken === token ? '#f0f0f0' : 'transparent',
                    padding: '8px',
                    margin: '4px',
                    borderRadius: '4px'
                  }}
                >
                  /{token}/
                </div>
              ))}
            </TableCell>
            <TableCell>
              {selectedToken && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <label>Manner: </label>
                    <Select
                      value={editedAttributes.manner || tokenData.manner || []}
                      onChange={(e) => handleAttributeChange('manner', e.target.value)}
                      multiple
                      style={{ minWidth: '200px' }}
                    >
                      {allManners.map(manner => (
                        <MenuItem key={manner} value={manner}>{manner}</MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label>Place: </label>
                    <Select
                      value={editedAttributes.place || tokenData.place || []}
                      onChange={(e) => handleAttributeChange('place', e.target.value)}
                      multiple
                      style={{ minWidth: '200px' }}
                    >
                      {allPlaces.map(place => (
                        <MenuItem key={place} value={place}>{place}</MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label>Submanner: </label>
                    <Select
                      value={editedAttributes.submanner || tokenData.submanner || []}
                      onChange={(e) => handleAttributeChange('submanner', e.target.value)}
                      multiple
                      style={{ minWidth: '200px' }}
                    >
                      {['Ejective', 'Glottalized', 'Voiced', 'Voiceless'].map(sm => (
                        <MenuItem key={sm} value={sm}>{sm}</MenuItem>
                      ))}
                    </Select>
                  </div>

                  <button 
                    onClick={saveChanges}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TokenEditor;