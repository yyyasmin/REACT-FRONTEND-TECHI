import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 2rem;
  direction: rtl;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 0.4rem;
  color: #1a4b7a;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const TH = styled.th`
  background-color: #70a0d6;
  color: white;
  font-weight: bold;
  padding: 8px;
  border: 1px solid #ccc;
  width: 30%;
  text-align: right;
`;

const TD = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: right;
  background-color: ${(props) => (props.even ? "#f8f9fa" : "white")};
`;

const InterestsTable = () => {
  const rows = [
    ["תחומי עניין/חוגים", "משחקי מחשב, אייפד ולבנות בלגו"],
    ["מוקדי כוח וכישורים", "חברותי, אוהב משחקי לגו וספורט"],
    ["השאיפה/המטרה שלי", "להיות חכם ולהצליח לקרוא"],
    ["מטרת הילד ממבט ההורים", "סיוע לדניאל בקריאה"],
    ["מטרת העצמה - טיפוח מוקד כוח", "לפתח תחושת מסוגלות גבוהה והצלחות בלמידה"],
  ];

  return (
    <Wrapper>
      <Title>תחומי עניין וחוזקות</Title>
      <Table>
        <tbody>
          {rows.map(([key, value], i) => (
            <tr key={i}>
              <TH>{key}</TH>
              <TD even={i % 2 === 0}>{value}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default InterestsTable;
