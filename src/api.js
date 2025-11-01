// src/api.js
import { CHOSEN_FLASK_URL } from "./helpers/ServerRoutes";

export async function fetchStudentList() {
  const res = await fetch(`${CHOSEN_FLASK_URL}/students`);
  if (!res.ok) throw new Error("Failed to load student list");
  return await res.json();
}

export async function fetchStudentData(studentName = "") {
  // If no name provided → backend defaults to "defaultStudentData"
const queryParam = studentName ? `?student=${encodeURIComponent(studentName)}` : "";
  const res = await fetch(`${CHOSEN_FLASK_URL}/load${queryParam}`);
  if (!res.ok) throw new Error("Failed to load student data");
  return await res.json();
}
