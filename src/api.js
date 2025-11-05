const BASE_URL = "http://127.0.0.1:5000";

export const fetchStudentList = async () => {
  const res = await fetch(`${BASE_URL}/students`);
  return await res.json(); // expect [{id, name}]
};

export const fetchStudentData = async (studentId = "", studentName = "") => {
  const params = new URLSearchParams();
  if (studentId) params.append("id", studentId);
  if (studentName) params.append("student", studentName);

  const res = await fetch(`${BASE_URL}/load?${params.toString()}`);
  console.log("RES:", res)
  return await res.json();
};

export const saveStudentData = async ({ name, id, data }) => {
  await fetch(`${BASE_URL}/save_student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student: name, id, data }),
  });
};
