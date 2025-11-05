import React, { useState } from "react";

const NewStudentForm = ({ onCreate }) => {
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
        placeholder="שם תלמיד חדש"
      />
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID תלמיד"
      />
      <button type="submit">הוסף תלמיד חדש</button>
    </form>
  );
};

export default NewStudentForm;
