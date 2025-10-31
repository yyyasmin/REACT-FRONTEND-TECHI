// HorizontalOneRowTable.js
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
  color: white;
  padding: 8px;
  font-weight: bold;
  border: 1px solid #d0d0d0;
`;

const TD = styled.td`
  text-align: right;
  padding: 8px;
  border: 1px solid #d0d0d0;
  /* ✅ Column odd/even within row shading */
  background-color: ${(props) => (props.isEvenCol ? "#D9E8FF" : "#E6F0FF")};
`;

const HorizontalOneRowTable = ({ table }) => {
  if (!table || !table.data || !Array.isArray(table.data) || !table.data[0]) {
    return <div>לא נמצא מידע להצגה</div>;
  }

  const titles = table.titles || [];
  const row = table.data[0] || [];

  return (
    <Table>
      <thead>
        <tr>
          {titles.map((col, i) => (
            <TH key={i}>{col}</TH>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {row.map((val, i) => (
            <TD key={i} isEvenCol={i % 2 === 0}>
              {val || "-"}
            </TD>
          ))}
        </tr>
      </tbody>
    </Table>
  );
};

export default HorizontalOneRowTable;
