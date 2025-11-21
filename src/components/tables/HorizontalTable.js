import React, { useState } from "react";
import styled from "styled-components";
// 🔹 UPDATED: import HandleCell instead of DropdownCell
import HandleCell from "./cells/HandleCell";
import AddRowBtn from "./AddRowBtn";

const TableContainer = styled.div`
  margin: 20px auto;
  width: 1200px;
  max-width: 95%;
  background-color: #fff;
  border-radius: 12px;
  overflow-x: auto;
  direction: rtl;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
`;

const Th = styled.th`
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  background-color: #f2f7ff;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 6px;
  text-align: center;
  background-color: #fafcff;
  vertical-align: top;
`;

const Title = styled.h3`
  text-align: center;
  padding: 10px;
  background-color: #e6f0ff;
  margin: 0;
  border-radius: 12px 12px 0 0;
`;

// ----------------------------
// NORMALIZER (SAFE VERSION) - Handles all formats
// Preserves all properties including options with colors
// ----------------------------
const normalizeCells = (cells = []) =>
  cells.map((cell) => {
    // Handle different cell formats
    let cellObj = cell;
    
    // If cell is a string or primitive, convert to object
    if (typeof cell !== "object" || cell === null) {
      cellObj = { value: cell, type: "text", title: "", options: [] };
    }
    
    // Extract type, handling different formats
    const cellType = (cellObj.type || "text").toLowerCase().trim();
    
    // Extract value, handling different formats
    let cellValue = cellObj.value;
    if (cellValue === null || cellValue === undefined) {
      // Set default based on type
      if (cellType === "checkbox") {
        cellValue = false;
      } else if (cellType === "dropdown") {
        cellValue = [];
      } else {
        cellValue = "";
      }
    }
    
    // Extract options, ensuring array format and preserving all properties (label, value, color, grade)
    let cellOptions = [];
    if (cellObj.options && Array.isArray(cellObj.options)) {
      cellOptions = cellObj.options.map(opt => {
        if (typeof opt === "string") {
          return { label: opt, value: opt, color: "#f2f2f2" };
        }
        if (typeof opt === "object" && opt !== null) {
          return {
            label: opt.label || opt.value || String(opt),
            value: opt.value || opt.label || String(opt),
            color: opt.color || "#f2f2f2",
            grade: opt.grade,
          };
        }
        return { label: String(opt), value: String(opt), color: "#f2f2f2" };
      });
    }
    
    // Extract title
    const cellTitle = cellObj.title || "";
    
    return {
      type: cellType,
      title: cellTitle,
      options: cellOptions, // Preserve full options array with all properties
      value: cellValue,
    };
  });

const HorizontalTable = ({ headers = [], data = [], tableName, std_id }) => {
  // Normalize initial backend data
  const [rows, setRows] = useState(() =>
    data.map((row) => ({
      ...row,
      cells: normalizeCells(row.cells),
    }))
  );

  return (
    <TableContainer>
      <AddRowBtn
        std_id={std_id}
        table_name={tableName}
        onRowAdded={(newRow) => {
          // Backend sends: { new_row: { cells: [...] } }
          // AddRowBtn passes result.new_row directly, so newRow is the new_row object
          if (newRow && newRow.cells) {
            const newCells = normalizeCells(newRow.cells);
            setRows((prev) => [...prev, { cells: newCells }]);
          }
        }}
      />

      <Table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <Th key={i}>{h}</Th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((rowObj, r) => (
            <tr key={r}>
              {rowObj.cells.map((cell, c) => (
                <Td key={c}>
                  {/* 🔹 UPDATED: use HandleCell instead of DropdownCell */}
                  <HandleCell
                    type={cell.type}
                    value={cell.value}
                    options={cell.options}
                    onChange={(val) => {
                      rowObj.cells[c].value = val;
                      setRows([...rows]);
                    }}
                  />
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default HorizontalTable;
