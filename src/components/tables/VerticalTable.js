import React, { useState } from "react";
import styled from "styled-components";
// 🔹 UPDATED: import HandleCell instead of DropdownCell
import HandleCell from "./cells/HandleCell";
import AddRowBtn from "./AddRowBtn";

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  background-color: #fff;
  font-family: "Arial", sans-serif;
  max-width: 1200px;
`;

const Tr = styled.tr`
  background-color: ${({ $index }) => ($index % 2 === 0 ? "#f8fafc" : "#edf2f7")};
  &:hover {
    background-color: #e4ebf5;
  }
`;

const Th = styled.th`
  border: 1px solid #aaa;
  padding: 8px;
  text-align: right;
  font-weight: bold;
  background-color: #dce8ff;
  width: 30%;
`;

const Td = styled.td`
  border: 1px solid #aaa;
  padding: 8px;
  text-align: right;
  vertical-align: top;
  background-color: #f8fafc;
`;

// Normalize cells for vertical table
const normalizeVerticalCells = (cells = []) => {
  if (!Array.isArray(cells)) return [];
  return cells.map(row => {
    if (Array.isArray(row)) {
      return row.map(cell => {
        if (typeof cell === "object" && cell !== null) {
          return {
            type: cell.type || "text",
            title: cell.title || "",
            value: cell.value ?? "",
            options: cell.options || [],
          };
        }
        return { type: "text", title: "", value: cell ?? "", options: [] };
      });
    }
    return [{ type: "text", title: "", value: row ?? "", options: [] }];
  });
};

const VerticalTable = ({ table }) => {
  const [rows, setRows] = useState(() => {
    // Normalize cells to ensure proper format
    return normalizeVerticalCells(table?.cells || []);
  });

  // Don't return null - show empty table if no data
  if (!table) return null;

  const handleAddRow = (newRow) => {
    // Handle both formats: {cells: [...]} or just [...]
    const rowToAdd = newRow?.cells || newRow;
    if (Array.isArray(rowToAdd)) {
      const normalizedRow = normalizeVerticalCells([rowToAdd])[0] || rowToAdd;
      setRows(prev => [...prev, normalizedRow]);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <AddRowBtn
        std_id={table.std_id}
        table_name={table.table_name}
        onRowAdded={handleAddRow}
      />

      <Table>
        <tbody>
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex} $index={rowIndex}>
              {row.map((cell, colIndex) => {
                const cellValue = cell?.value ?? "";
                const cellOptions = cell?.options ?? [];
                const cellType = cell?.type ?? "text";

                if (colIndex === 0) {
                  return (
                    <Th key={colIndex}>
                      {typeof cellValue === "object"
                        ? cellValue.label ?? JSON.stringify(cellValue)
                        : cellValue}
                    </Th>
                  );
                } else {
                  return (
                    <Td key={colIndex}>
                      {/* 🔹 UPDATED: use HandleCell instead of DropdownCell */}
                      <HandleCell
                        type={cellType}
                        value={cellValue}
                        options={cellOptions}
                        onChange={(val) => {
                          row[colIndex].value = val;
                          setRows([...rows]);
                        }}
                      />
                    </Td>
                  );
                }
              })}
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VerticalTable;
