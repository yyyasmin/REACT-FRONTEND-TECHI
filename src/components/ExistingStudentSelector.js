import React from "react";

const ExistingStdSelector = ({ students = [], selectedStudent, onSelect }) => {
  // Ensure students is always an array — prevents map() errors
  if (!Array.isArray(students)) {
    console.warn("⚠️ students prop is not an array:", students);
    students = [];
  }

  return (
    <div>
      <label htmlFor="studentSelect">בחר תלמיד קיים:</label>
      <select
        id="studentSelect"
        value={selectedStudent || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- בחר תלמיד --</option>
        {students.length > 0 ? (
          students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.id})
            </option>
          ))
        ) : (
          <option disabled>אין תלמידים זמינים</option>
        )}
      </select>
    </div>
  );
};

export default ExistingStdSelector;
