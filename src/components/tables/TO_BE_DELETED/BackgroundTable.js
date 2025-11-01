// BackgroundTable.js
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

const BackgroundTable = () => (
  <Wrapper>
    <Title>רקע כללי</Title>
    <Text>
      דניאל הינו הבן הצעיר מבין שני ילדים. נולד לאחר הריון תקין. כפעוט היו קשיי
      גמילה משמעותיים ממוצץ ומבקבוק, הוריו דיווחו על נוקשות ובכי רבים יחסית.
      התפתחות מוטורית ותפתחות הדיבור התחילו במועד. בגיל 3.8 חודשים עבר אבחון עקב
      קשיים קשביים ושיבושי היגוי. אפריל 2024 - ניתוח להסרת שקד שלישי מוגדל. בפברואר
      2024 סיים סדרת טיפולים אצל ק. תקשורת, הומלץ המשך טיפול. במרץ 2024 החל סדרת
      טיפולים נוספת בביתו.
    </Text>
  </Wrapper>
);

export default BackgroundTable;
