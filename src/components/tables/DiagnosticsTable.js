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
`;

const TD = styled.td`
  border: 1px solid #d0d0d0;
  padding: 8px;
  text-align: right;
  background-color: ${(props) => (props.even ? "#f8f9fa" : "white")};
`;

const DiagnosticsTable = () => {
  const rows = [
    ["אבחון רפואי התפתחותי", "אפריל 2024, דר' הוד פיינס רועי שאול"],
    ["סיכום טיפול ק. תקשורת", "יולי 2023, יפעת בר בן שבת"],
    ["בקשה להמשך טיפול", "יולי 2024, אלעד בני ק. תקשורת"],
  ];

  return (
    <Wrapper>
      <Title>פירוט אבחונים</Title>
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

export default DiagnosticsTable;
