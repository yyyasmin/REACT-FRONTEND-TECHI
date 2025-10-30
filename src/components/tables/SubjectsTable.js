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
  border: 1px solid #d0d0d0;
  background-color: #70a0d6;
  color: white;
  padding: 8px;
`;

const TD = styled.td`
  border: 1px solid #d0d0d0;
  padding: 8px;
  text-align: right;
  background-color: ${(props) => (props.even ? "#f8f9fa" : "white")};
`;

const SubjectsTable = () => {
  const rows = [
    ["תחומי עניין/חוגים", "כדורגל, משחק באקס בוקס"],
    ["מוקדי כוח וכישורים", "משחק כדורגל, חברותי"],
    ["השאיפה/המטרה שלי", "להצליח להסתובב לבד בבית הספר"],
    ["מטרת הילד ממבט ההורים", "שמירה על גבולות בביה\"ס וקשרים חברתיים תקינים"],
    ["מטרת העצמה - טיפוח מוקד כוח", "חיזוק ועידוד התנהלות חברתית"],
  ];

  return (
    <Wrapper>
      <Title>תחומי עניין וכישורים</Title>
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

export default SubjectsTable;
