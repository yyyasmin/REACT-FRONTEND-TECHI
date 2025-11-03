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
  transition: height 0.2s ease;
  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
  }
`;

const Checkbox = styled.input`
  transform: scale(1.4);
  cursor: pointer;
`;

// ✅ Wrapper to ensure dropdown menu appears above other cells
const CellWrapper = styled.div`
  position: relative;
  overflow: visible !important;
  z-index: 10;
`;

const DropdownCell = ({ value, options = [], type = "text", onChange }) => {
  const [val, setVal] = useState(value || "");
  const textareaRef = useRef(null);

  // ✅ Smooth auto-grow for textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [val]);

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setVal(newValue);
    onChange?.(newValue);
  };

  // ✅ Multi-select dropdown (creatable)
  if (type === "dropdown") {
    const dropdownOptions = options.map((opt) => ({
      value: opt.value || opt.label || opt,
      label: opt.label || opt,
    }));

    const selectedValues = Array.isArray(val)
      ? val.map((v) => ({
          value: v,
          label: dropdownOptions.find((o) => o.value === v)?.label || v,
        }))
      : [];

    return (
      <CellWrapper>
        <CreatableSelect
          isMulti
          value={selectedValues}
          onChange={(selected) => {
            const newValues = selected ? selected.map((s) => s.value) : [];
            setVal(newValues);
            onChange?.(newValues);
          }}
          options={dropdownOptions}
          placeholder="בחר או הוסף אפשרויות..."
          isClearable
          menuPortalTarget={document.body} // ✅ dropdown above all
          styles={{
            control: (base) => ({
              ...base,
              minHeight: 50,
              textAlign: "right",
              direction: "rtl",
              borderColor: "#ccc",
            }),
            menu: (base) => ({
              ...base,
              textAlign: "right",
              direction: "rtl",
              zIndex: 9999,
            }),
            option: (base) => ({
              ...base,
              textAlign: "right",
              direction: "rtl",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#e3f2fd",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#1565c0",
            }),
          }}
        />
      </CellWrapper>
    );
  }

  // ✅ Checkbox type
  if (type === "checkbox") {
    return (
      <Checkbox
        type="checkbox"
        checked={val === "כן"}
        onChange={(e) => {
          const newValue = e.target.checked ? "כן" : "לא";
          setVal(newValue);
          onChange?.(newValue);
        }}
      />
    );
  }

  // ✅ Regular editable text field (auto-grow)
  return (
    <Textarea
      ref={textareaRef}
      value={val}
      onChange={handleTextChange}
      placeholder="הקש כאן להזנת טקסט..."
    />
  );
};

export default DropdownCell;
