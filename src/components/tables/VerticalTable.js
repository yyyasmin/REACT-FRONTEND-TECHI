import React from "react";
import styled from "styled-components";
import DropdownCell from "./DropdownCell";

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

const VerticalTable = ({ table }) => {
  if (!table?.data || !Array.isArray(table.data)) return null;

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <Table>
        <tbody>
          {table.data.map((row, rowIndex) => (
            <Tr key={rowIndex} $index={rowIndex}>
              {row.map((cell, colIndex) => {
                // Safely extract backend object values
                const cellValue = cell?.value ?? "";
                const cellOptions = cell?.options ?? [];
                const cellType = cell?.type ?? "text";

                if (colIndex === 0) {
                  // First column as header
                  return (
                    <Th key={colIndex}>
                      {typeof cellValue === "object"
                        ? cellValue.label ?? JSON.stringify(cellValue)
                        : cellValue}
                    </Th>
                  );
                } else {
                  // Editable cell with DropdownCell
                  return (
                    <Td key={colIndex}>
                      <DropdownCell
                        value={cellValue}
                        options={cellOptions}
                        type={cellType}
                        onChange={(val) => {
                          table.data[rowIndex][colIndex].value = val;
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
