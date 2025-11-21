import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Textarea = styled.textarea`
  width: 90%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
  direction: rtl;
  text-align: right;
  resize: none;
  overflow: hidden;
`;

export default function LongTextCell({ value, onChange }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Textarea
      ref={ref}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
