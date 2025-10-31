import React from "react";
import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  background-color: #fff;
  font-family: "Arial", sans-serif;
`;

const Th = styled.th`
  border: 1px solid #aaa;
  padding: 10px;
  text-align: center;
  background-color: #d9e8ff; /* Highlighted header */
  font-weight: bold;
  font-size: 15px;
`;

const Tr = styled.tr`
  background-color: ${({ index }) => (index % 2 === 0 ? "#f7f9fc" : "#edf2f7")};

  &:hover {
    background-color: #e4ebf5;
  }
`;

const Td = styled.td`
  border: 1px solid #aaa;
  padding: 8px;
  text-align: center;
  background-color: ${({ rowIndex, colIndex }) =>
    rowIndex % 2 === 0
      ? colIndex % 2 === 0
        ? "#f7f9fc"
        : "#f1f4fa"
      : colIndex % 2 === 0
      ? "#edf2f7"
      : "#e8eef5"};
`;

const HorizontalTable = ({ table }) => {
  return (
    <Table>
      <thead>
        <tr>
          {table.titles?.map((title, idx) => (
            <Th key={idx}>{title}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.data?.map((row, rIdx) => (
          <Tr key={rIdx} index={rIdx}>
            {row.map((cell, cIdx) => (
              <Td key={cIdx} rowIndex={rIdx} colIndex={cIdx}>
                {cell}
              </Td>
            ))}
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};

export default HorizontalTable;
