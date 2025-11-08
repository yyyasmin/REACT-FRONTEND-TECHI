import React, { useState, useEffect } from "react";
import TableSection from "./components/TableSection";
import NewStdForm from "./components/NewStdForm";
import ExistingStdSelector from "./components/ExistingStdSelector";
import { fetchStdList, fetchStdData, saveStdData } from "./api";

const App = () => {
  const [tables, setTables] = useState([]);
  const [stds, setStds] = useState([]); // ✅ changed from students
  const [selectedStd, setSelectedStd] = useState(""); // ✅ changed
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStds = async () => {
      try {
        console.log("[DEBUG] Fetching std list...");
        const stdList = await fetchStdList();
        console.log("[DEBUG] Std list response:", stdList);

        setStds(
          stdList.map((s) => ({
            name: s.name,
            id: s.id,
          }))
        );
      } catch (err) {
        console.error("❌ Error loading std list:", err);
      }
    };
    loadStds();
  }, []);

  const handleStdSelect = async (stdId) => { // ✅ changed
    if (!stdId) return;
    setSelectedStd(stdId);
    setTables([]);
    setLoading(true);

    try {
      console.log(`[DEBUG] Fetching data for std ID ${stdId}...`);
      const data = await fetchStdData(stdId);
      console.log("[DEBUG] Raw data received from backend:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        setTables(data);
      } else if (data.tables) {
        setTables(data.tables); // ✅ changed to handle new backend format
      } else {
        console.warn("⚠️ Unexpected data format received:", data);
        setTables([]);
      }
    } catch (err) {
      console.error("❌ Error fetching std data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewStd = async ({ name, id }) => { // ✅ changed
    if (!name || !id) {
      alert("Please enter both name and ID");
      return;
    }

    if (stds.some((s) => s.id === id || s.name === name)) { // ✅ changed
      alert("Std already exists!");
      return;
    }

    try {
      console.log(`[DEBUG] Creating new std: ${name} (${id})`);
      await saveStdData({ name, id, data: [] });

      setStds((prev) => [...prev, { name, id }]); // ✅ changed
      setSelectedStd(id);

      const data = await fetchStdData(id);
      console.log("[DEBUG] Default tables loaded for new std:", data);
      setTables(data.tables || []);
    } catch (err) {
      console.error("❌ Error creating std:", err);
      alert("Failed to create new std");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
        <ExistingStdSelector
          stds={stds} // ✅ changed
          selectedStd={selectedStd} // ✅ changed
          onSelect={handleStdSelect} // ✅ changed
        />
        <NewStdForm onCreate={handleCreateNewStd} /> {/* ✅ changed */}
      </div>

      {loading ? (
        <p>⏳ טוען נתונים...</p>
      ) : tables.length > 0 ? (
        tables.map((t, i) => <TableSection key={i} table={t} />)
      ) : (
        <p>🚀 בחר std או צור std חדש כדי לטעון נתונים...</p> // ✅ changed
      )}
    </div>
  );
};

export default App;
