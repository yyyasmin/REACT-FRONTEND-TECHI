import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchStudentList, fetchStudentData } from "./api";
import TableSection from "./components/TableSection";
import TeamTable from "./components/tables/TeamTable"; // vertical layout for team table only

const Container = styled.div`
  padding: 30px;
  direction: rtl;
  font-family: "Rubik", Arial, sans-serif;
  background-color: #f9fafb;
  color: #222;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  color: #1a3c6e;
  margin-bottom: 25px;
`;

const Select = styled.select`
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #bbb;
  background-color: white;
  margin-bottom: 30px;
  display: block;
  margin-right: auto;
  margin-left: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #70a0d6;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: #555;
`;

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudentList();
        console.log("Fetched student list raw:", data);

        // ✅ Handle different possible backend formats gracefully
        let studentNames = [];
        if (Array.isArray(data)) {
          studentNames = data;
        } else if (data && Array.isArray(data.students)) {
          studentNames = data.students;
        } else if (data && typeof data === "object") {
          // Fallback: if object with key-value pairs
          studentNames = Object.values(data);
        }

        console.log("Processed student names:", studentNames);
        setStudents(studentNames);
      } catch (err) {
        console.error("Failed to fetch student list:", err);
      }
    };

    loadStudents();
  }, []);

  const handleSelectChange = async (e) => {
    const name = e.target.value;
    setSelectedStudent(name);
    if (!name) {
      setStudentData([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchStudentData(name);
      console.log("Loaded student data:", data);
      setStudentData(data);
    } catch (err) {
      console.error("Failed to fetch student data:", err);
      setStudentData([]);
    } finally {
      setLoading(false);
    }
  };

  const isTeamTable = (tableName) => {
    if (!tableName) return false;
    const clean = tableName.trim().replace(/\s+/g, " ");
    return clean.includes("שותפים") || clean === "שותפים לתוכנית";
  };

  return (
    <Container>
      <Title>פרטי תלמיד</Title>

      <Select value={selectedStudent} onChange={handleSelectChange}>
        <option value="">בחר תלמיד</option>
        {students.map((name, idx) => (
          <option key={idx} value={name}>
            {name}
          </option>
        ))}
      </Select>

      {loading && <LoadingText>טוען נתונים...</LoadingText>}

      {!loading &&
        studentData.length > 0 &&
        studentData.map((table, idx) =>
          isTeamTable(table.table_name) ? (
            <TeamTable
              key={idx}
              rows={table.rows}
              table_name={table.table_name}
            />
          ) : (
            <TableSection key={idx} tableData={table} />
          )
        )}
    </Container>
  );
}

export default App;
