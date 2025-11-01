// File: src/components/tables/DropdownCell.js
import React, { useState, useEffect } from "react";

export default function DropdownCell({ value, options, type, onChange }) {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || "");
    }
  }, [value]);

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === "Other") {
      setInputValue("");
    } else {
      setInputValue(val);
      onChange(val);
    }
  };

  const handleInputBlur = () => {
    if (inputValue && options && Array.isArray(options) && !options.includes(inputValue)) {
      fetch("http://localhost:5000/add_option", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: "A1",
          subject: "General",
          field: "strengths",
          option: inputValue,
        }),
      });
    }
    onChange(inputValue);
  };

  // Checkbox type
  if (type === "checkbox") {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <label>
          <input
            type="radio"
            name={`yesno-${Math.random()}`}
            checked={inputValue === true || inputValue === "כן"}
            onChange={() => {
              setInputValue("כן");
              onChange("כן");
            }}
          />{" "}
          כן
        </label>
        <label>
          <input
            type="radio"
            name={`yesno-${Math.random()}`}
            checked={inputValue === false || inputValue === "לא"}
            onChange={() => {
              setInputValue("לא");
              onChange("לא");
            }}
          />{" "}
          לא
        </label>
      </div>
    );
  }

  // Date type
  if (type === "date") {
    return (
      <input
        type="date"
        value={inputValue || ""}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        style={{
          width: "95%",
          fontSize: "18px",
          padding: "4px",
          backgroundColor: "#f0f8ff",
        }}
      />
    );
  }

  // Long text type (large textarea)
// Long text type (large textarea, auto-resizing)
if (type === "longtext") {
  return (
    <textarea
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);

        // Auto-resize: reset height and set new scrollHeight
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
      onBlur={handleInputBlur}
      rows={5} // initial height (smaller)
      style={{
        width: "95%",
        fontSize: "16px",
        padding: "10px",
        backgroundColor: "#f0f8ff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        resize: "none", // users can't manually resize, automatic resizing handles it
        overflow: "hidden", // hide scrollbar
      }}
    />
  );
}

  // Dropdown type
  if (options && Array.isArray(options) && options.length > 0) {
    return (
      <div>
        <select
          value={options.includes(inputValue) ? inputValue : ""}
          onChange={handleSelectChange}
          style={{
            width: "95%",
            fontSize: "18px",
            backgroundColor: "#f0f8ff",
            padding: "4px",
          }}
        >
          <option value="">בחר...</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
          <option value="Other">אחר...</option>
        </select>

        {inputValue && !options.includes(inputValue) && (
          <input
            type="text"
            placeholder="הכנס ערך חדש"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputBlur}
            style={{ width: "95%", marginTop: "5px" }}
          />
        )}
      </div>
    );
  }

  // Regular text input
  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
      }}
      onBlur={handleInputBlur}
      style={{
        width: "95%",
        fontSize: "16px",
        backgroundColor: "#f0f8ff",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />
  );
}
