import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 2rem;
  direction: rtl;
`;

const Title = styled.h3`
  text-align: center;
  color: #1a4b7a;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const TH = styled.th`
  background-color: #70a0d6;
  color: white;
  font-weight: bold;
  padding: 8px;
  border: 1px solid #ccc;
`;

const TD = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: right;
  background-color: ${(props) => (props.even ? "#f8f9fa" : "white")};
`;

const ProfessionalsTable = () => {
  const professionals = [
    ["מרפאה בעיסוק", "שרה כהן"],
    ["קלינאית תקשורת", "רונית בר"],
    ["פסיכולוגית", "ד"ר עדי דנון"],
    ["מורה לחינוך מיוחד", "מיכל לוי"],
    ["מטפלת רגשית (CBT)", "עינת סולומון"],
  ];

  return (
    <Wrapper>
      <Title>צוות מקצועי מלווה</Title>
      <Table>
        <tbody>
          {professionals.map(([role, name], i) => (
            <tr key={i}>
              <TH>{role}</TH>
              <TD even={i % 2 === 0}>{name || "-"}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default ProfessionalsTable;
