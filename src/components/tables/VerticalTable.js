import React from "react";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const TH = styled.th`
  text-align: right;
  background-color: #70a0d6;
  color: #fff;
  padding: 6px;
  font-weight: bold;
  border: 1px solid #ccc;
`;

const TD = styled.td`
  text-align: right;
  padding: 6px;
  border: 1px solid #ccc;
  /* ✅ Set background color based on row and column */
  background-color: ${(props) =>
    props.isEvenRow
      ? props.isEvenCol
        ? "#D9E8FF" // slightly different shade for even column
        : "#E6F0FF" // row default color for odd column
      : props.isEvenCol
      ? "#F8F8F8" // slightly different shade for even column in white row
      : "#FFFFFF"}; // row default color for odd column
`;

const TR = styled.tr``;

const VerticalTable = ({ rows }) => {
  return (
    <Table>
      <tbody>
        {rows.map((row, rIdx) => (
          <TR key={rIdx}>
            {row.map((cell, cIdx) => {
              const isEvenRow = rIdx % 2 === 0;
              const isEvenCol = cIdx % 2 === 0;
              return (
                <TD key={cIdx} isEvenRow={isEvenRow} isEvenCol={isEvenCol}>
                  {cell || "-"}
                </TD>
              );
            })}
          </TR>
        ))}
      </tbody>
    </Table>
  );
};

export default VerticalTable;
