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

const Text = styled.p`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  line-height: 1.5;
`;

const ProgramsTable = () => (
  <Wrapper>
    <Title>תכניות בהן משתתף התלמיד בביה"ס</Title>
    <Text>מנתחת התנהגות 1ש"ש</Text>
  </Wrapper>
);

export default ProgramsTable;
