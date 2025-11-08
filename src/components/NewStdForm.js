import React, { useState } from "react";

const NewStdForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !id.trim()) return alert("Enter both name and ID!");
    onCreate({ name: name.trim(), id: id.trim() });
    setName("");
    setId("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם std חדש"
      />
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID std"
      />
      <button type="submit">הוסף std חדש</button>
    </form>
  );
};

export default NewStdForm;
