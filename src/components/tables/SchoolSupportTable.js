// SchoolSupportTable.js
import React from "react";
import VerticalTable from "./VerticalTable";

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
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#1a4b7a" }}>
        תמיכות בביה"ס ובקהילה
      </h3>
      <VerticalTable rows={rows} />
    </div>
  );
};

export default SchoolSupportTable;
