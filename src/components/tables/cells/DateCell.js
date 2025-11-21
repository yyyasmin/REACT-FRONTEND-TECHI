import React from "react";

export default function DateCell({ value, onChange }) {
  return (
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: "90%",
        padding: "6px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        textAlign: "right",
        direction: "rtl",
      }}
    />
  );
}
