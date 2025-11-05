import React from "react";

const ExistingStudentSelector = ({ students, selectedStudent, onSelect }) => {
  return (
    <div>
      <label>בחר תלמיד: </label>
      <select value={selectedStudent} onChange={(e) => onSelect(e.target.value)}>
        <option value="" disabled>
          בחר תלמיד
        </option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExistingStudentSelector;
