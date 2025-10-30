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
`;

const TH = styled.th`
  background-color: #70a0d6;
  color: white;
  padding: 8px;
  border: 1px solid #d0d0d0;
  text-align: right;
  width: 25%;
`;

const TD = styled.td`
  border: 1px solid #d0d0d0;
  padding: 8px;
  text-align: right;
  background-color: ${(props) => (props.even ? "#f8f9fa" : "white")};
`;

const PersonalInfoTable = () => {
  const rows = [
    ["שם התלמיד/ה", "דניאל בר"],
    ["כיתה", "א2"],
    ["מחנכת", "דנה"],
    ["שם ביה\"ס", "שיבולים"],
    ["ת.ז", "226009769"],
    ["תאריך לידה", "14.05.2018"],
    ["שנה", "תשפ\"ה"],
    ["תאריך ועדה אחרונה", ""],
    ["שנת יישום הזכאות", ""],
    ["הוגשה בקשה להנגשה", "כן/לא"],
    ["מטרת ההנגשה", "תקשורת, התניידות, השתתפות בתחומי הלמידה"],
  ];

  return (
    <Wrapper>
      <Title>פרטים אישיים וביה"ס</Title>
      <Table>
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={i}>
              <TH>{label}</TH>
              <TD even={i % 2 === 0}>{value}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default PersonalInfoTable;
