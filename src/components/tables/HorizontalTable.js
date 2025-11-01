import React from "react";
import DropdownCell from "./DropdownCell";

const HorizontalTable = ({ title, data = [], headers = [], dropdownOptions = {}, onDataChange }) => {
  const handleCellChange = (rowIndex, colKey, newValue) => {
    const updatedData = [...data];
    if (!updatedData[rowIndex]) updatedData[rowIndex] = {};
    // Support both array and object data formats
    if (Array.isArray(updatedData[rowIndex])) {
      updatedData[rowIndex][headers.indexOf(colKey)] = newValue;
    } else {
      updatedData[rowIndex][colKey] = newValue;
    }
    if (onDataChange) onDataChange(updatedData);
  };

  return (
    <div
      style={{
        margin: "20px auto",
        width: "98%",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
        overflowX: "auto",
        direction: "rtl",
      }}
    >
      {title && (
        <h3
          style={{
            textAlign: "center",
            padding: "10px",
            backgroundColor: "#e6f0ff",
            margin: 0,
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          {title}
        </h3>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "18px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f7ff" }}>
            {headers && headers.map((header, idx) => (
              <th
                key={idx}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data && data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((colKey, colIndex) => {
                // Support both array and object rows
                const cell = Array.isArray(row) ? row[colIndex] : row[colKey];
                const cellValue = cell?.value ?? cell ?? "";
                const options = cell?.options ?? dropdownOptions[colKey] ?? [];
                const type =
                  cell?.type ||
                  (typeof cellValue === "boolean" || cellValue === "כן" || cellValue === "לא"
                    ? "checkbox"
                    : colKey.toLowerCase().includes("תאריך")
                    ? "date"
                    : options.length > 0
                    ? "dropdown"
                    : "text");

                return (
                  <td
                    key={colIndex}
                    style={{
                      border: "1px solid #ccc",
                      padding: "6px",
                      textAlign: "center",
                      backgroundColor: "#fafcff",
                    }}
                  >
                    <DropdownCell
                      value={cellValue}
                      options={options}
                      type={type}
                      onChange={(val) => handleCellChange(rowIndex, colKey, val)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HorizontalTable;
