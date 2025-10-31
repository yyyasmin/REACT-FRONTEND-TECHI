// ProgramsTable.js
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

const ProgramsTable = () => (
  <Wrapper>
    <Title>תכניות בהן משתתף התלמיד בביה"ס</Title>
    <p>מנתחת התנהגות 1ש"ש</p>
  </Wrapper>
);

export default ProgramsTable;
