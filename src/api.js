const BASE_URL = "http://127.0.0.1:5000";

// ✅ Fetch std list
export const fetchStdList = async () => {
  const res = await fetch(`${BASE_URL}/stds`);
  return await res.json(); // expect [{id, name}]
};

// ✅ Fetch std data
export const fetchStdData = async (stdId = "", stdName = "") => {
  const params = new URLSearchParams();
  if (stdId) params.append("id", stdId);
  if (stdName) params.append("std", stdName);

  // ✅ CHANGE: use the new endpoint
  const res = await fetch(`${BASE_URL}/load_all_std_tables_from_db?${params.toString()}`);
  return await res.json();
};

// ✅ Save std data
export const saveStdData = async ({ name, id, data }) => {
  await fetch(`${BASE_URL}/save_std`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ std: name, id, data }),
  });
};
