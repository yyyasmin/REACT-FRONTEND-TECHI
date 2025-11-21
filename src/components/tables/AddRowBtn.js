import React from "react";
import styled from "styled-components";
import { addRow } from "../../api"; // your backend API call

const Btn = styled.button`
  padding: 8px 16px;
  margin: 12px 0;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const AddRowBtn = ({ std_id, table_name, onRowAdded }) => {
  const handleAddRow = async () => {
    if (!std_id || !table_name) return;
    try {
      const result = await addRow(std_id, table_name);
      if (result.new_row) onRowAdded(result.new_row);
    } catch (err) {
      console.error("Failed to add row:", err);
    }
  };

  return <Btn onClick={handleAddRow}>➕ הוסף שורה</Btn>;
};

export default AddRowBtn;
