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
  background-color: #E6F0FF;
`;

const HorizontalOneRowTable = ({ columns, row }) => {
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
        <tr>
          {row.map((val, i) => (
            <TD key={i}>{val || "-"}</TD>
          ))}
        </tr>
      </tbody>
    </Table>
  );
};

export default HorizontalOneRowTable;
