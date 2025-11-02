import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Select = styled.select`
  width: 95%; /* ✅ Perfect fit inside cells */
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 15px;
  background-color: #ffffff;
  color: #2c3e50;
  outline: none;
  direction: rtl;
  text-align: right;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  line-height: 1.5em;
  min-height: 50px;
  height: auto;
  resize: none;
  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
  }
`;

const Option = styled.option`
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  font-size: 14px;
  line-height: 1.5em;
  padding: 5px;
  text-align: right;
  direction: rtl;
  color: #2c3e50;
`;

const Textarea = styled.textarea`
  width: 88%; /* ✅ Narrower so even long text fits neatly inside */
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 15px;
  background-color: #ffffff;
  color: #2c3e50;
  outline: none;
  resize: none;
  overflow: hidden; /* ✅ No scrollbars */
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
  const [val, setVal] = useState(value || "");
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  // ✅ Auto-grow textareas vertically as content expands
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [val, isEditing]);

  const handleDropdownChange = (e) => {
    const newValue = e.target.value;
    setVal(newValue);
    setIsEditing(true); // ✅ All dropdowns editable
    onChange?.(newValue);
  };

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setVal(newValue);
    onChange?.(newValue);
  };

  if (type === "dropdown") {
    const dropdownOptions = [...options, { label: "אחר" }];
    return (
      <>
        {!isEditing ? (
          <Select value={val} onChange={handleDropdownChange}>
            <Option value="">בחר...</Option>
            {dropdownOptions.map((opt, i) => (
              <Option
                key={i}
                value={opt.label || opt}
                style={{ backgroundColor: opt.color || "white" }}
              >
                {opt.label || opt}
              </Option>
            ))}
          </Select>
        ) : (
          <Textarea
            ref={textareaRef}
            value={val}
            onChange={handleTextChange}
            placeholder="כתוב כאן..."
          />
        )}
      </>
    );
  }

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

  // ✅ Regular editable text field
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
