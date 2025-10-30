import React from "react";

const styles = {
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
  }
};

export default function ExportButton({ onExport }) {
  return React.createElement(
    "button",
    { style: styles.button, onClick: onExport },
    "📄 יצוא לקובץ Word"
  );
}
