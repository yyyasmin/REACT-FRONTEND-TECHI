// RecommendationsTable.js
import React from "react";
import VerticalTable from "./VerticalTable";

const RecommendationsTable = () => {
  const recs = [
    ["המלצות פדגוגיות", "לשלב למידה חווייתית ומשחקית לשיפור קריאה"],
    ["תחומי חיזוק", "שיפור מיומנויות קריאה והבנה"],
    ["אמצעים טכנולוגיים", "טאבלט עם תוכנת קריאה מותאמת"],
    ["מעקב תקופתי", "כל חודשיים"],
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{ textAlign: "center", color: "#1a4b7a" }}>המלצות</h3>
      <VerticalTable rows={recs} />
    </div>
  );
};

export default RecommendationsTable;
