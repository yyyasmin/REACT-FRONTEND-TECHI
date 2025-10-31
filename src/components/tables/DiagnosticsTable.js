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

const DiagnosticsTable = () => {
  const rows = [
    ["אבחון רפואי התפתחותי", "אפריל 2024, דר' הוד פיינס רועי שאול"],
    ["סיכום טיפול ק. תקשורת", "יולי 2023, יפעת בר בן שבת"],
    ["בקשה להמשך טיפול", "יולי 2024, אלעד בני ק. תקשורת"],
  ];

  return (
    <Wrapper>
      <Title>פירוט אבחונים</Title>
      <VerticalTable rows={rows} />
    </Wrapper>
  );
};

export default DiagnosticsTable;
