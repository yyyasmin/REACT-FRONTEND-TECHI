const BASE_URL = "http://127.0.0.1:5000";

export const fetchStudentList = async () => {
  const res = await fetch(`${BASE_URL}/students`);
  return await res.json();
};

export const fetchStudentData = async (studentName = "") => {
  const url = studentName
    ? `${BASE_URL}/load?student=${studentName}`
    : `${BASE_URL}/load`;
  const res = await fetch(url);
  return await res.json();
};

export const saveStudentData = async (studentName, data) => {
  await fetch(`${BASE_URL}/save_student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student: studentName, data })
  });
};
