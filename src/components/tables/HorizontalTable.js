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
  background-color: ${(props) => props.bg || "#fff"};
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
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((val, ci) => (
              <TD key={ci} bg={ri % 2 === 0 ? "#E6F0FF" : "#FFFFFF"}>
                {val || "-"}
              </TD>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default HorizontalTable;
