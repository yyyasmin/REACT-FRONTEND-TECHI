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

const TextArea = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  line-height: 1.5;
`;

const SummaryTable = () => (
  <Wrapper>
    <Title>הערכה מסכמת</Title>
    <TextArea>
      <b>מטרות העבודה שהוצבו בתחילת השנה:</b>
      <br />1. לחץ או הקש כאן להזנת טקסט.
      <br />2. לחץ או הקש כאן להזנת טקסט.
      <br />3. לחץ או הקש כאן להזנת טקסט.
    </TextArea>
    <TextArea>
      <b>תהליך הלמידה תוך התייחסות למטרות:</b>
      <br />תלמידאות וכישורי לומד: ...
      <br />מבחינה לימודית: ...
      <br />מבחינה רגשית - התנהגותית: ...
      <br />מבחינה חברתית: ...
    </TextArea>
    <TextArea>
      <b>מטרות להמשך:</b>
      <br />1. לחץ או הקש כאן להזנת טקסט.
      <br />2. לחץ או הקש כאן להזנת טקסט.
      <br />3. לחץ או הקש כאן להזנת טקסט.
    </TextArea>
    <TextArea>
      <b>המלצות:</b>
      <br />• לחץ או הקש כאן להזנת טקסט.
      <br />• לחץ או הקש כאן להזנת טקסט.
    </TextArea>
  </Wrapper>
);

export default SummaryTable;
