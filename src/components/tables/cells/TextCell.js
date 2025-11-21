import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: 90%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
  direction: rtl;
  text-align: right;
`;

export default function TextCell({ value, onChange }) {
  return (
    <Input
      type="text"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
