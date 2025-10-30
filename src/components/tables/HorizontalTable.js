import React from "react";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const TH = styled.th`
  text-align: center;
  background-color: #70a0d6;
  color: #fff;
  padding: 6px;
  font-weight: bold;
`;

const TD = styled.td`
  text-align: right;
  padding: 6px;
  border: 1px solid #ccc;
  /* ✅ Adjust background color by row and column */
  background-color: ${(props) =>
    props.isEvenRow
      ? props.isEvenCol
        ? "#D9E8FF"
        : "#E6F0FF"
      : props.isEvenCol
      ? "#F8F8F8"
      : "#FFFFFF"};
`;

const HorizontalTable = ({ columns, rows }) => {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <TH key={i}>{col}</TH>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rIdx) => (
          <tr key={rIdx}>
            {row.map((val, cIdx) => {
              const isEvenRow = rIdx % 2 === 0;
              const isEvenCol = cIdx % 2 === 0;
              return (
                <TD key={cIdx} isEvenRow={isEvenRow} isEvenCol={isEvenCol}>
                  {val || "-"}
                </TD>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default HorizontalTable;
