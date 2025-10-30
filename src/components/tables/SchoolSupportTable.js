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

const SchoolSupportTable = () => {
  const rows = [
    ["תומך/כת הוראה", "3.5=15"],
    ["הוראה מותאמת", "1"],
    ["מטפל/ת בהבעה ויצירה", "1"],
    ["מנתח/ת התנהגות", ""],
    ["מרפא/ה בעיסוק", ""],
    ["קלינאי/ת תקשורת", ""],
    ["אחר", ""],
    ["אחר נוסף", ""],
  ];

  return (
    <Wrapper>
      <Title>תמיכות בביה"ס ובקהילה</Title>
      <Table>
        <tbody>
          {rows.map(([type, hours], i) => (
            <tr key={i}>
              <TH>{type}</TH>
              <TD even={i % 2 === 0}>{hours}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default SchoolSupportTable;
