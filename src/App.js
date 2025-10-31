import React, { useState, useEffect } from "react";
import TableSection from "./components/TableSection";
import { fetchStudentList, fetchStudentData } from "./api"; // ✅ use the API helper

const App = () => {
  const [tables, setTables] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("defaultStudentData");

  // Fetch student list
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const studentList = await fetchStudentList();
        setStudents(studentList);
      } catch (err) {
        console.error("Error fetching student list:", err);
      }
    };
    loadStudents();
  }, []);

  // Fetch default data (base tables)
  useEffect(() => {
    const loadDefaultData = async () => {
      try {
        const data = await fetchStudentData("defaultStudentData");
        setTables(data);
      } catch (err) {
        console.error("Error fetching default data:", err);
      }
    };
    loadDefaultData();
  }, []);

  // Fetch specific student and merge with default
  const handleStudentChange = async (event) => {
    const studentName = event.target.value;
    setSelectedStudent(studentName);

    try {
      if (studentName === "defaultStudentData") {
        const defaultData = await fetchStudentData("defaultStudentData");
        setTables(defaultData);
      } else {
        const studentData = await fetchStudentData(studentName);
        const defaultData = await fetchStudentData("defaultStudentData");

        const mergedTables = defaultData.map((baseTable) => {
          const studentTable = studentData.find(
            (t) => t.table_name === baseTable.table_name
          );

          if (!studentTable) return baseTable;

          let mergedData = baseTable.data.map((baseRow, rowIndex) => {
            const studentRow = studentTable.data?.[rowIndex] || [];
            return baseRow.map((cell, colIndex) =>
              studentRow[colIndex] !== undefined && studentRow[colIndex] !== ""
                ? studentRow[colIndex]
                : cell
            );
          });

          if (studentTable.data && studentTable.data.length > baseTable.data.length) {
            mergedData = mergedData.concat(
              studentTable.data.slice(baseTable.data.length)
            );
          }

          return { ...baseTable, ...studentTable, data: mergedData };
        });

        setTables(mergedTables);
      }
    } catch (err) {
      console.error("Error loading student data:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="student-select" style={{ marginRight: "10px" }}>
          בחר תלמיד:
        </label>
        <select id="student-select" onChange={handleStudentChange} value={selectedStudent}>
          <option value="defaultStudentData">נתוני ברירת מחדל</option>
          {students.map((student) => (
            <option key={student} value={student}>
              {student}
            </option>
          ))}
        </select>
      </div>

      {tables.map((table, index) => (
        <TableSection key={index} table={table} />
      ))}
    </div>
  );
};

export default App;
