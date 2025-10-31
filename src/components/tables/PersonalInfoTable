// PersonalInfoTable.js
import React from "react";
import HorizontalOneRowTable from "./HorizontalOneRowTable";

const PersonalInfoTable = () => {
  const rows = [
    ["שם התלמיד/ה", "דניאל בר"],
    ["כיתה", "א2"],
    ["מחנכת", "דנה"],
    ["שם ביה\"ס", "שיבולים"],
    ["ת.ז", "226009769"],
    ["תאריך לידה", "14.05.2018"],
    ["שנה", "תשפ\"ה"],
    ["תאריך ועדה אחרונה", ""],
    ["שנת יישום הזכאות", ""],
    ["הוגשה בקשה להנגשה", "כן/לא"],
    ["מטרת ההנגשה", "תקשורת, התניידות, השתתפות בתחומי הלמידה"],
  ];

  const firstGroup = rows.slice(0, 6);
  const secondGroup = rows.slice(6);

  const firstColumns = firstGroup.map((r) => r[0]);
  const firstRow = firstGroup.map((r) => r[1]);
  const secondColumns = secondGroup.map((r) => r[0]);
  const secondRow = secondGroup.map((r) => r[1]);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "0.5rem",
          color: "#1a4b7a",
        }}
      >
        פרטים אישיים וביה"ס
      </h3>
      <HorizontalOneRowTable columns={firstColumns} row={firstRow} />
      {secondGroup.length > 0 && (
        <HorizontalOneRowTable columns={secondColumns} row={secondRow} />
      )}
    </div>
  );
};

export default PersonalInfoTable;
