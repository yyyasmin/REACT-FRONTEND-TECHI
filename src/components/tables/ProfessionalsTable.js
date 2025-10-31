import React from "react";
import VerticalTable from "./VerticalTable";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 2rem;
  direction: rtl;
`;

const Title = styled.h3`
  text-align: center;
  color: #1a4b7a;
`;

const ProfessionalsTable = () => {
  const rows = [
    ["מרפאה בעיסוק", "שרה כהן"],
    ["קלינאית תקשורת", "רונית בר"],
    ["פסיכולוגית", "ד"ר עדי דנון"],
    ["מורה לחינוך מיוחד", "מיכל לוי"],
    ["מטפלת רגשית (CBT)", "עינת סולומון"],
  ];

  return (
    <Wrapper>
      <Title>צוות מקצועי מלווה</Title>
      <VerticalTable rows={rows} />
    </Wrapper>
  );
};

export default ProfessionalsTable;
