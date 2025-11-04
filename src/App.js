import React, { useState, useEffect } from "react";
import TableSection from "./components/TableSection";
import { fetchStudentList, fetchStudentData, saveStudentData } from "./api";

const App = () => {
  const [tables, setTables] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [newStudentName, setNewStudentName] = useState("");

  // --- Fetch existing student names for dropdown ---
  useEffect(() => {
    const loadStudents = async () => {
      const studentList = await fetchStudentList();
      const cleanList = studentList.map((s) =>
        s.endsWith(".json") ? s.replace(".json", "") : s
      );
      setStudents(cleanList);
    };
    loadStudents();
  }, []);

  const handleStudentChange = async (e) => {
    const studentName = e.target.value;
    setSelectedStudent(studentName);

    // Clear previous tables
    setTables([]);

    // Fetch selected student data
    const data = await fetchStudentData(studentName);

    setTables(data);
    console.log(`[LOG] Loaded full tables for ${studentName}:`, data);
  };

  const handleCreateNewStudent = async () => {
    const name = newStudentName.trim();
    if (!name) return alert("Enter a student name!");
    if (students.includes(name)) return alert("Student already exists!");

    const defaultData = await fetchStudentData();
    await saveStudentData(name, defaultData);

    setStudents((prev) => [...prev, name]);
    setSelectedStudent(name);
    setTables(defaultData);
    setNewStudentName("");
    console.log(`[LOG] New student created: ${name}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
        <div>
          <label>בחר תלמיד: </label>
          <select value={selectedStudent} onChange={handleStudentChange}>
            <option value="" disabled>
              בחר תלמיד
            </option>
            {students.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="שם תלמיד חדש"
          />
          <button onClick={handleCreateNewStudent}>הוסף תלמיד חדש</button>
        </div>
      </div>

      {tables.length > 0 ? (
        tables.map((t, i) => <TableSection key={i} table={t} />)
      ) : (
        <p>🚀 בחר תלמיד או צור תלמיד חדש כדי לטעון נתונים...</p>
      )}
    </div>
  );
};

export default App;
