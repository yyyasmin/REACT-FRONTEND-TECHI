import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 2rem;
  direction: rtl;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 0.5rem;
  color: #1a4b7a;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

const TH = styled.th`
  text-align: right;
  background-color: #70a0d6;
  color: white;
  padding: 8px;
  border: 1px solid #ccc;
  width: 30%;
`;

const TD = styled.td`
  text-align: right;
  padding: 8px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.even ? "#f8f9fa" : "#ffffff")};
`;

export default function TeamTable({ rows, table_name }) {
  if (!rows || rows.length === 0) return null;

  return (
    <Wrapper>
      <Title>{table_name}</Title>
      <Table>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <TH>{row[0]}</TH>
              <TD even={i % 2 === 0}>{row[1]}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
}
