// src/components/tables/DropdownCell.js
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CreatableSelect from "react-select/creatable";

const Textarea = styled.textarea`
  width: 88%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 15px;
  background-color: #ffffff;
  color: #2c3e50;
  outline: none;
  resize: none;
  overflow: hidden;
  min-height: 50px;
  line-height: 1.5em;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  text-align: right;
  direction: rtl;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
  }
`;

const Checkbox = styled.input`
  transform: scale(1.4);
  cursor: pointer;
`;

const DropdownCell = ({ value, options = [], type = "text", onChange }) => {
  // Always wrap value in an array for consistency
  const [val, setVal] = useState(() => (Array.isArray(value) ? value : [value]));
  const [allOptions, setAllOptions] = useState(
    options.map((opt) => ({
      value: opt.value || opt.label || opt,
      label: opt.label || opt,
      color: opt.color || "#f2f2f2",
    }))
  );
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [val]);

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setVal([newValue]);
    onChange?.(newValue);
  };

  // Dropdown type
  if (type === "dropdown") {
    const selectedOptions = allOptions.filter((o) => val.includes(o.value));

    const handleChange = (selected) => {
      const newValues = selected ? selected.map((s) => s.value) : [];
      setVal(newValues);
      onChange?.(newValues);
    };

    const handleCreateOption = (inputValue) => {
      const newOption = {
        value: inputValue,
        label: inputValue,
        color: "#d9eaf7",
      };
      const updatedOptions = [...allOptions, newOption];
      setAllOptions(updatedOptions);

      const newValues = [...val, inputValue];
      setVal(newValues);
      onChange?.(newValues);
    };

    return (
      <CreatableSelect
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        options={allOptions}
        onCreateOption={handleCreateOption}
        placeholder="בחר או הקלד להוספה..."
        isClearable
        menuPortalTarget={document.body}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: 50,
            textAlign: "right",
            direction: "rtl",
            borderRadius: 6,
            backgroundColor: "#ffffff",
            zIndex: 10,
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menu: (base) => ({ ...base, textAlign: "right", direction: "rtl", zIndex: 9999 }),
          option: (base, { data, isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
              ? data.color
              : isFocused
              ? "#eaeaea"
              : data.color + "33",
            color: "#000",
            cursor: "pointer",
            fontWeight: isSelected ? "600" : "400",
          }),
          multiValue: (base, { data }) => ({
            ...base,
            backgroundColor: data.color,
            borderRadius: 6,
            padding: "2px 6px",
          }),
          multiValueLabel: (base) => ({ ...base, color: "#000", fontWeight: 500 }),
          multiValueRemove: (base) => ({
            ...base,
            color: "#000",
            ":hover": {
              backgroundColor: "#00000022",
              color: "#000",
            },
          }),
        }}
      />
    );
  }

  // Checkbox type
  if (type === "checkbox") {
    return (
      <Checkbox
        type="checkbox"
        checked={val[0] === true || val[0] === "כן"}
        onChange={(e) => {
          const newValue = e.target.checked ? "כן" : "לא";
          setVal([newValue]);
          onChange?.(newValue);
        }}
      />
    );
  }

  // Text or longtext
  return (
    <Textarea
      ref={textareaRef}
      value={Array.isArray(val) ? val[0] || "" : val || ""}
      onChange={handleTextChange}
      placeholder="הקש כאן להזנת טקסט..."
    />
  );
};

export default DropdownCell;
