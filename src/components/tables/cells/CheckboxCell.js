import React from "react";
import styled from "styled-components";

const Box = styled.input`
  transform: scale(1.4);
  cursor: pointer;
`;

export default function CheckboxCell({ value, onChange }) {
  // Handle different value formats: boolean, string "כן"/"לא", or other truthy values
  const checked = 
    value === true || 
    value === "כן" || 
    value === "true" ||
    (typeof value === "string" && value.toLowerCase() === "true");

  return (
    <Box
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        // Return boolean for consistency, but also support string format
        if (onChange) {
          onChange(e.target.checked);
        }
      }}
    />
  );
}
