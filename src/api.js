const BASE_URL = "http://127.0.0.1:5000";

// ✅ Fetch student list
export const fetchStdList = async () => {
  const routePath = `${BASE_URL}/stds`;
  console.log("fetchStdList →", routePath);

  const res = await fetch(routePath);
  return await res.json(); // [{id, name}]
};

// ✅ Fetch ALL student data (all tables)
export const fetchStdData = async (stdId = "", stdName = "") => {
  const params = new URLSearchParams();
  if (stdId) params.append("id", stdId);
  if (stdName) params.append("std", stdName);

  // 🔥 This is the correct route in your new std_routes
  const res = await fetch(`${BASE_URL}/load?${params.toString()}`);

  return await res.json();
};

// ✅ Save student data (existing function)
export const saveStdData = async ({ name, id, data }) => {
  await fetch(`${BASE_URL}/save_std`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ std: name, id, data }),
  });
};

// ✅ Create a new student (React version)
export const createNewStd = async (id, name) => {
  const res = await fetch(`${BASE_URL}/new_std`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name })
  });

  return await res.json();
};

// Add a new row to a table
export const addRow = async (std_id, table_name) => {
  const res = await fetch(`${BASE_URL}/add_row`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ std_id, table_name }),
  });
  return await res.json();
};

