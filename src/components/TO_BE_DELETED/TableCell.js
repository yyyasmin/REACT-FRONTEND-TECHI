import React from "react";

const options = ["", "הושג", "הושג חלקית", "לא הושג", "לא שויך"];

const TableCell = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.dropdown}>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  );
};

const styles = {
  dropdown: { width: "100%", padding: "4px" },
};

export default TableCell;
