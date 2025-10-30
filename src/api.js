const API_URL = "http://127.0.0.1:5000";

export async function fetchStudentList() {
  const res = await fetch(`${API_URL}/students`);
  if (!res.ok) throw new Error("Failed to load student list");
  return await res.json();
}

export async function fetchStudentData(studentName) {
  const res = await fetch(`${API_URL}/load?student=${studentName}`);
  if (!res.ok) throw new Error("Failed to load student data");
  return await res.json();
}
