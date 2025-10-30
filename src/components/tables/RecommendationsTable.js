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
  width: 25%;
`;

const TD = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: right;
  background-color: ${(props) => (props.even ? "#f8f9fa" : "white")};
`;

const RecommendationsTable = () => {
  const recs = [
    ["המלצות פדגוגיות", "לשלב למידה חווייתית ומשחקית לשיפור קריאה"],
    ["תחומי חיזוק", "שיפור מיומנויות קריאה והבנה"],
    ["אמצעים טכנולוגיים", "טאבלט עם תוכנת קריאה מותאמת"],
    ["מעקב תקופתי", "כל חודשיים"],
  ];

  return (
    <Wrapper>
      <Title>המלצות</Title>
      <Table>
        <tbody>
          {recs.map(([key, val], i) => (
            <tr key={i}>
              <TH>{key}</TH>
              <TD even={i % 2 === 0}>{val}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default RecommendationsTable;
