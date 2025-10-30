import React from "react";

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px 0",
    direction: "rtl"
  },
  th: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "1px solid #ddd",
    padding: "8px"
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px"
  },
  select: {
    width: "100%",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }
};

const dropdownOptions = [
  "מצוין",
  "טוב",
  "בינוני",
  "נדרש שיפור",
  "לא רלוונטי",
  "לחץ או הקש כאן להזנת טקסט."
];

export default function TableRenderer({ table, onChange }) {
  const header = React.createElement(
    "tr",
    null,
    table.columns.map(function (col, i) {
      return React.createElement("th", { key: i, style: styles.th }, col);
    })
  );

  const rows = table.rows.map(function (row, rowIndex) {
    const cells = row.map(function (cell, colIndex) {
      return React.createElement(
        "td",
        { key: colIndex, style: styles.td },
        React.createElement(
          "select",
          {
            value: cell,
            style: styles.select,
            onChange: function (e) {
              onChange(rowIndex, colIndex, e.target.value);
            }
          },
          dropdownOptions.map(function (opt) {
            return React.createElement("option", { key: opt, value: opt }, opt);
          }),
          !dropdownOptions.includes(cell)
            ? React.createElement("option", { value: cell }, cell)
            : null
        )
      );
    });
    return React.createElement("tr", { key: rowIndex }, cells);
  });

  return React.createElement(
    "table",
    { style: styles.table },
    React.createElement("thead", null, header),
    React.createElement("tbody", null, rows)
  );
}
