// SubjectsTable.js
import React from "react";
import VerticalTable from "./VerticalTable";

const SubjectsTable = () => {
  const rows = [
    ["תחומי עניין/חוגים", "כדורגל, משחק באקס בוקס"],
    ["מוקדי כוח וכישורים", "משחק כדורגל, חברותי"],
    ["השאיפה/המטרה שלי", "להצליח להסתובב לבד בבית הספר"],
    ["מטרת הילד ממבט ההורים", "שמירה על גבולות בביה\"ס וקשרים חברתיים תקינים"],
    ["מטרת העצמה - טיפוח מוקד כוח", "חיזוק ועידוד התנהלות חברתית"],
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{ textAlign: "center", color: "#1a4b7a" }}>תחומי עניין וכישורים</h3>
      <VerticalTable rows={rows} />
    </div>
  );
};

export default SubjectsTable;
