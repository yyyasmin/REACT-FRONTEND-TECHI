import React from "react";
import TableRenderer from "./TableRenderer";

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },
  title: { color: "#34495e" },
  description: { color: "#555" }
};

export default function TableEditor({ table, tableIndex, tables, setTables }) {
  const handleCellChange = function (rowIndex, colIndex, newValue) {
    const updated = [...tables];
    updated[tableIndex].rows[rowIndex][colIndex] = newValue;
    setTables(updated);
  };

  return React.createElement(
    "div",
    { style: styles.card },
    React.createElement("h2", { style: styles.title }, table.table_name),
    table.description &&
      React.createElement("p", { style: styles.description }, table.description),
    React.createElement(TableRenderer, {
      table: table,
      onChange: handleCellChange
    })
  );
}
