import React, { useState, useEffect } from "react";
import TableSection from "./components/TableSection";
import NewStudentForm from "./components/NewStudentForm";
import ExistingStudentSelector from "./components/ExistingStudentSelector";

// Correct imports to match api.js
import { fetchStdList, fetchStdData, saveStdData } from "./api";

const App = () => {
  const [tables, setTables] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing student list on mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        console.log("[DEBUG] Fetching student list...");
        const studentList = await fetchStdList();
        console.log("[DEBUG] Student list response:", studentList);

        setStudents(
          studentList.map((s) => ({
            name: s.name,
            id: s.id,
          }))
        );
      } catch (err) {
        console.error("❌ Error loading student list:", err);
      }
    };
    loadStudents();
  }, []);

  // Load data for a selected student
  const handleStudentSelect = async (studentId) => {
    if (!studentId) return;
    setSelectedStudent(studentId);
    setTables([]);
    setLoading(true);

    try {
      console.log(`[DEBUG] Fetching data for student ID ${studentId}...`);
      const data = await fetchStdData(studentId);
      console.log("[DEBUG] Raw data received from backend:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        setTables(data);
      } else {
        console.warn("⚠️ Unexpected data format received:", data);
        setTables([]);
      }
    } catch (err) {
      console.error("❌ Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new student and load their tables
  const handleCreateNewStudent = async ({ name, id }) => {
    if (!name || !id) {
      alert("Please enter both name and ID");
      return;
    }

    if (students.some((s) => s.id === id || s.name === name)) {
      alert("Student already exists!");
      return;
    }

    try {
      console.log(`[DEBUG] Creating new student: ${name} (${id})`);
      await saveStdData({ name, id, data: [] });

      setStudents((prev) => [...prev, { name, id }]);
      setSelectedStudent(id);

      const data = await fetchStdData(id);
      console.log("[DEBUG] Default tables loaded for new student:", data);
      setTables(data);
    } catch (err) {
      console.error("❌ Error creating student:", err);
      alert("Failed to create new student");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
        <ExistingStudentSelector
          students={students}
          selectedStudent={selectedStudent}
          onSelect={handleStudentSelect}
        />
        <NewStudentForm onCreate={handleCreateNewStudent} />
      </div>

      {loading ? (
        <p>⏳ טוען נתונים...</p>
      ) : tables.length > 0 ? (
        tables.map((t, i) => <TableSection key={i} table={t} />)
      ) : (
        <p>🚀 בחר תלמיד או צור תלמיד חדש כדי לטעון נתונים...</p>
      )}
    </div>
  );
};

export default App;
