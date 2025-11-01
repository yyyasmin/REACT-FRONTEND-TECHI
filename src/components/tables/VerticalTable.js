// File: src/components/tables/VerticalTable.js
import React from "react";
import styled from "styled-components";
import DropdownCell from "./DropdownCell"; // ✅ import at top

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  background-color: #fff;
  font-family: "Arial", sans-serif;
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
  width: 35%;
  background-color: ${({ $rowIndex }) =>
    $rowIndex % 2 === 0 ? "#dce8ff" : "#d4e2ff"};
  font-weight: bold;
`;

const Td = styled.td`
  border: 1px solid #aaa;
  padding: 8px;
  text-align: right;
  background-color: ${({ $rowIndex, $colIndex }) =>
    $rowIndex % 2 === 0
      ? $colIndex % 2 === 0
        ? "#f8fafc"
        : "#f3f6fa"
      : $colIndex % 2 === 0
      ? "#edf2f7"
      : "#e9eef5"};
`;

const safeRender = (val) => {
  if (val == null) return "";
  if (typeof val === "object") {
    if ("value" in val) return val.value;
    return JSON.stringify(val);
  }
  return String(val);
};

const VerticalTable = ({ table }) => {
  return (
    <Table>
      <tbody>
        {table.data?.map((row, idx) => (
          <Tr key={idx} $index={idx}>
            <Th $rowIndex={idx}>{safeRender(row[0])}</Th>
            <Td $rowIndex={idx} $colIndex={1}>
              <DropdownCell
                value={row[1]}
                type="text"
                onChange={(val) => {
                  row[1] = val;
                }}
              />
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};

export default VerticalTable;
