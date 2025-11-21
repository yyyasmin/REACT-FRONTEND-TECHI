import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CreatableSelect from "react-select/creatable";

const Textarea = styled.textarea`
  width: 88%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 15px;
  background-color: #fff;
  direction: rtl;
  text-align: right;
  min-height: 50px;
  resize: none;
`;

const Checkbox = styled.input`transform: scale(1.4); cursor: pointer;`;

const DropdownCell = ({ value, options = [], type = "text", onChange }) => {
  const [val, setVal] = useState(
    type === "dropdown" ? value || [] : type === "checkbox" ? value || "לא" : value || ""
  );
  const [allOptions, setAllOptions] = useState(
    options.map((o) => ({ value: o.value ?? o.label ?? o, label: o.label ?? o, color: o.color ?? "#f2f2f2" }))
  );

  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [val]);

  // Text / LongText
  if (type === "text" || type === "longtext") {
    return <Textarea ref={textareaRef} value={val} onChange={e => { setVal(e.target.value); onChange?.(e.target.value); }} />;
  }

  // Checkbox
  if (type === "checkbox") {
    return (
      <Checkbox
        type="checkbox"
        checked={val === true || val === "כן"}
        onChange={(e) => {
          const newValue = e.target.checked ? "כן" : "לא";
          setVal(newValue);
          onChange?.(newValue);
        }}
      />
    );
  }

  // Date
  if (type === "date") {
    return (
      <input
        type="date"
        value={val || ""}
        onChange={(e) => { setVal(e.target.value); onChange?.(e.target.value); }}
        style={{ width: "90%", padding: "6px", borderRadius: "6px", border: "1px solid #ccc", textAlign: "right", direction: "rtl" }}
      />
    );
  }

  // Dropdown
  if (type === "dropdown") {
    const selectedOptions = allOptions.filter(o => val.includes(o.value));
    const handleChange = (selected) => {
      const newValues = selected ? selected.map(s => s.value) : [];
      setVal(newValues);
      onChange?.(newValues);
    };
    const handleCreate = (inputValue) => {
      const newOption = { value: inputValue, label: inputValue, color: "#d9eaf7" };
      setAllOptions([...allOptions, newOption]);
      setVal([...val, inputValue]);
      onChange?.([...val, inputValue]);
    };
    return (
      <CreatableSelect
        isMulti
        value={selectedOptions}
        options={allOptions}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder="בחר או הקלד להוספה..."
        isClearable
        menuPortalTarget={document.body}
        styles={{
          control: base => ({ ...base, minHeight: 40, direction: "rtl", textAlign: "right", borderRadius: 6 }),
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          menu: base => ({ ...base, direction: "rtl" }),
          multiValue: base => ({ ...base, borderRadius: 6, padding: "2px 6px" }),
        }}
      />
    );
  }

  return null;
};

export default DropdownCell;
