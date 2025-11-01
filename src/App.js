// src/App.js
import React, { useState, useEffect } from "react";
import TableSection from "./components/TableSection";
import { fetchStudentList, fetchStudentData } from "./api";

const App = () => {
  const [tables, setTables] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  // --- Load default JSON automatically on first render ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const defaultData = await fetchStudentData(); // no argument → loads default
        setTables(defaultData);
      } catch (err) {
        console.error("❌ Failed to load default data:", err);
      }
    };
    loadInitialData();
  }, []);

  // --- Fetch student list (names) for dropdown ---
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const studentList = await fetchStudentList();
        setStudents(studentList);
      } catch (err) {
        console.error("❌ Failed to fetch students:", err);
      }
    };
    loadStudents();
  }, []);

  // --- Handle student dropdown selection ---
  const handleStudentChange = async (e) => {
    const studentName = e.target.value;
    setSelectedStudent(studentName);

    try {
      const data = await fetchStudentData(studentName);
      setTables(data);
    } catch (err) {
      console.error("❌ Failed to fetch student data:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label>בחר תלמיד: </label>
        <select value={selectedStudent} onChange={handleStudentChange}>
          <option value="" disabled>בחר תלמיד</option>
          {students.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {tables.length > 0 ? (
        tables.map((t, i) => <TableSection key={i} table={t} />)
      ) : (
        <p>🚀 טוען נתוני ברירת מחדל...</p>
      )}
    </div>
  );
};

export default App;
