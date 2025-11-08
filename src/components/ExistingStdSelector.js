import React from "react";

const ExistingStdSelector = ({ stds, selectedStd, onSelect }) => { // ✅ changed
  return (
    <div>
      <label>בחר std: </label> {/* ✅ changed */}
      <select value={selectedStd} onChange={(e) => onSelect(e.target.value)}>
        <option value="" disabled>
          בחר std
        </option>
        {stds.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExistingStdSelector;
