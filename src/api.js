const BASE_URL = "http://127.0.0.1:5000";

// Fetch list of all stds
export const fetchStdList = async () => {
  const res = await fetch(`${BASE_URL}/stds`);
  return await res.json(); // expect [{id, name}]
};

// Fetch data for a single std
export const fetchStdData = async (stdId = "") => {
  const params = new URLSearchParams();
  if (stdId) params.append("id", stdId);

  const res = await fetch(`${BASE_URL}/load?${params.toString()}`);
  return await res.json();
};

// Save std data (full save)
export const saveStdData = async ({ name, id, data }) => {
  await fetch(`${BASE_URL}/save_std`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ std: name, id, data }),
  });
};
