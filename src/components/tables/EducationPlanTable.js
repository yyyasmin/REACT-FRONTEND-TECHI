import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 2rem;
  direction: rtl;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 1rem;
  color: #1a4b7a;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: right;
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
  background-color: ${(props) => (props.even ? "#f8f9fa" : "white")};
`;

const EducationPlanTable = () => {
  const sections = [
    {
      field: "תלמידאות וכישורי לומד",
      current: "מגיע בזמן ועם הציוד הנדרש. לרוב מבצע את משימות הכיתה, לעיתים זקוק לתיווך. קיימת מוטיבציה ללמידה.",
      goals: "לוח זמנים וציוד מסודר, השלמת משימות",
      actions: "שיקוף, חיזוקים",
      evaluation: "עקיבה רציפה",
    },
    {
      field: "חברתי",
      current: "חברותי. יוצר קשרים חברתיים, לעיתים אינו מבין סיטואציות ולעיתים מגיב בתוקפנות כלפי החבר.",
      goals: "דניאל יפתור בעיות בצורה תקינה",
      actions: "שיקוף סיטואציות חברתיות, עידוד לפניה לעזרה",
      evaluation: "חיזוקים חיוביים",
    },
    {
      field: "רגשי - התנהגותי",
      current: "קשיי הסתגלות, לעיתים יש חרדות, זקוק לזמן לכבס קשר אמון...",
      goals: "דניאל יביע את עצמו בצורה מכבדת ויפנה למבוגר לעזרה",
      actions: "שיקוף בכיתה, חיזוקים חיוביים",
      evaluation: "חיזוקים והערכה",
    },
    {
      field: "עצמאות וכישורי חיים",
      current: "חרדתי, זקוק שילוו אותו לכיתה. חושש להסתובב לבד בביהס...",
      goals: "ביטחון במרחב ושחרור מתלות",
      actions: "שליחת משימות מחוץ לכיתה תוך חיזוק",
      evaluation: "ליווי ושחרור הדרגתי",
    },
    {
      field: "מוטורי-חושי",
      current: "התפתחות מוטורית תקינה",
      goals: "",
      actions: "",
      evaluation: "",
    },
  ];

  return (
    <Wrapper>
      <Title>תוכנית חינוכית יחידנית</Title>
      <Table>
        <thead>
          <tr>
            <TH>תחום תפקוד</TH>
            <TH>תפקוד נוכחי</TH>
            <TH>מטרות ויעדים מדידים</TH>
            <TH>פעולות לקידום המטרה</TH>
            <TH>הערכה מעצבת</TH>
          </tr>
        </thead>
        <tbody>
          {sections.map((sec, i) => (
            <tr key={i}>
              <TD even={i % 2 === 0}>{sec.field}</TD>
              <TD even={i % 2 === 0}>{sec.current}</TD>
              <TD even={i % 2 === 0}>{sec.goals}</TD>
              <TD even={i % 2 === 0}>{sec.actions}</TD>
              <TD even={i % 2 === 0}>{sec.evaluation}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default EducationPlanTable;
