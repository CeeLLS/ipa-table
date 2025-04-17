import React from "react";
import { Paper, Select, MenuItem } from "@mui/material";
import orderConfig from "../data/orderConfig";

const TokenEditor = ({ tokens, combinedData, onTokenUpdate }) => {
  const [selectedToken, setSelectedToken] = React.useState(null);
  const [editedAttributes, setEditedAttributes] = React.useState({});

  const tokenData = combinedData.find((c) => c.char === selectedToken) || {};

  const handleAttributeChange = (field, value) => {
    setEditedAttributes((prev) => ({ ...prev, [field]: value }));
  };

  const handleTokenSelect = (token) => {
    setSelectedToken((prev) => (prev === token ? null : token));
    setEditedAttributes({});
  };

  const saveChanges = () => {
    if (!selectedToken) return;

    const updatedToken = {
      ...tokenData,
      ...editedAttributes,
      manner: editedAttributes.manner || tokenData.manner || [],
      place: editedAttributes.place || tokenData.place || [],
      submanner: editedAttributes.submanner || tokenData.submanner || [],
      subplace: editedAttributes.subplace || tokenData.subplace || [],
    };

    onTokenUpdate(selectedToken, updatedToken);
    setEditedAttributes({});
  };

  return (
    <Paper className="token-editor-paper">
      <div className="token-editor-container">
        <div className="token-list-container">
          <h4 className="editor-section-title">Selected Tokens</h4>
          <div className="token-list">
            {tokens.map((token) => (
              <div
                key={token}
                onClick={() => handleTokenSelect(token)}
                className={`token-item ${selectedToken === token ? "selected" : ""}`}
              >
                /{token}/
              </div>
            ))}
          </div>
        </div>

        {selectedToken && (
          <div className="attribute-editor">
            <h4 className="editor-section-title">
              Editando: /{selectedToken}/
            </h4>

            <SelectField
              label="Manner"
              values={orderConfig.mannerOrder}
              current={editedAttributes.manner || tokenData.manner || []}
              onChange={(v) => handleAttributeChange("manner", v)}
            />

            <SelectField
              label="Place"
              values={orderConfig.placeOrder}
              current={editedAttributes.place || tokenData.place || []}
              onChange={(v) => handleAttributeChange("place", v)}
            />

            <SelectField
              label="Submanner"
              values={["Ejective", "Glottalized", "Voiced", "Voiceless"]}
              current={editedAttributes.submanner || tokenData.submanner || []}
              onChange={(v) => handleAttributeChange("submanner", v)}
            />

            <SelectField
              label="Subplace"
              values={orderConfig.subplaceOrder}
              current={editedAttributes.subplace || tokenData.subplace || []}
              onChange={(v) => handleAttributeChange("subplace", v)}
            />

            <button onClick={saveChanges} className="save-button">
              Salvar Alterações
            </button>
          </div>
        )}
      </div>
    </Paper>
  );
};

const SelectField = ({ label, values, current, onChange }) => (
  <div className="select-field">
    <label className="select-label">{label}:</label>
    <Select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      multiple
      fullWidth
      variant="outlined"
      className="select-input"
      renderValue={(selected) => selected.join(", ")}
    >
      {values.map((value) => (
        <MenuItem key={value} value={value} className="select-menu-item">
          {value}
        </MenuItem>
      ))}
    </Select>
  </div>
);

export default TokenEditor;
