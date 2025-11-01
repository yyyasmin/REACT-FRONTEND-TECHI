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
`;

const TR = styled.tr`
  background-color: ${(props) => (props.isEven ? "#e6f0ff" : "#ffffff")};
`;

const VerticalTable = ({ rows }) => {
  return (
    <Table>
      <tbody>
        {rows.map((row, i) => (
          <TR key={i} isEven={i % 2 === 0}>
            <TH>{row[0]}</TH>
            <TD>{row[1] || "-"}</TD>
          </TR>
        ))}
      </tbody>
    </Table>
  );
};

export default VerticalTable;
