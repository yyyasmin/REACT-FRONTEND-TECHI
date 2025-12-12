
// FILE: CheckboxCell.js
import React from "react";
import styled from "styled-components";

const Box = styled.input`
  transform: scale(1.4);
  cursor: pointer;
`;

export default function CheckboxCell({ value, onChange }) {
  // Handle different value formats: boolean, string "כן"/"לא", or other truthy values
  const checked = 
    value === true || 
    value === "כן" || 
    value === "true" ||
    (typeof value === "string" && value.toLowerCase() === "true");

  return (
    <Box
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        // Return boolean for consistency, but also support string format
        if (onChange) {
          onChange(e.target.checked);
        }
      }}
    />
  );
}



// FILE: DateCell.js
import React from "react";

export default function DateCell({ value, onChange }) {
  return (
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: "90%",
        padding: "6px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        textAlign: "right",
        direction: "rtl",
      }}
    />
  );
}



// FILE: DropdownCell.js
import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";

export default function DropdownCell({ value = [], options = [], onChange }) {
  const [allOptions, setAllOptions] = useState(
    options.map((o) => ({
      value: o.value ?? o.label ?? o,
      label: o.label ?? o.value ?? o,
      color: o.color ?? "#f2f2f2",
    }))
  );

  const selected = allOptions.filter((o) => {
    if (Array.isArray(value)) {
      return value.includes(o.value) || value.includes(o.label);
    }
    return value === o.value || value === o.label;
  });

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue, color: "#f2f2f2" };
    setAllOptions([...allOptions, newOption]);
    const currentValue = Array.isArray(value) ? value : (value ? [value] : []);
    onChange?.([...currentValue, inputValue]);
  };

  // Custom option component with background color
  const Option = (props) => {
    const { data } = props;
    return (
      <components.Option {...props}>
        <div style={{ 
          backgroundColor: data.color || "#f2f2f2", 
          padding: "4px 8px", 
          borderRadius: "4px",
          margin: "-4px -8px"
        }}>
          {data.label}
        </div>
      </components.Option>
    );
  };

  // Custom multi-value label component with background color
  const MultiValueLabel = (props) => {
    const { data } = props;
    return (
      <div style={{ 
        backgroundColor: data.color || "#f2f2f2", 
        padding: "2px 6px", 
        borderRadius: "4px",
        marginRight: "4px"
      }}>
        <components.MultiValueLabel {...props} />
      </div>
    );
  };

  return (
    <CreatableSelect
      isMulti
      value={selected}
      options={allOptions}
      onChange={(items) => {
        if (items) {
          onChange?.(items.map((i) => i.value));
        } else {
          onChange?.([]);
        }
      }}
      onCreateOption={handleCreate}
      placeholder="בחר..."
      isClearable
      menuPortalTarget={document.body}
      components={{ Option, MultiValueLabel }}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: 40,
          direction: "rtl",
          textAlign: "right",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: "transparent",
        }),
        multiValueLabel: (base) => ({
          ...base,
          padding: 0,
        }),
        multiValueRemove: (base) => ({
          ...base,
          backgroundColor: "transparent",
        }),
      }}
    />
  );
}



// FILE: HandleCell.js
import React from "react";
import TextCell from "./TextCell";
import LongTextCell from "./LongTextCell";
import CheckboxCell from "./CheckboxCell";
import DateCell from "./DateCell";
import DropdownCell from "./DropdownCell";

const HandleCell = ({ type, value, options, onChange }) => {
  // Normalize cell type - handle different cases and missing types
  const cellType = (type || "text").toLowerCase().trim();

  // Normalize value based on type
  const normalizeValue = (val, cellType) => {
    if (val === null || val === undefined) {
      // Return default based on type
      if (cellType === "checkbox") return false;
      if (cellType === "dropdown") return [];
      return "";
    }

    // Handle different value formats
    if (cellType === "checkbox") {
      // Checkbox: handle boolean, string "כן"/"לא", or other truthy values
      if (typeof val === "boolean") return val;
      if (val === "כן" || val === true || val === "true") return true;
      if (val === "לא" || val === false || val === "false") return false;
      return Boolean(val);
    }

    if (cellType === "dropdown") {
      // Dropdown: always return array
      if (Array.isArray(val)) return val;
      if (typeof val === "string" && val.trim() !== "") return [val];
      if (val && typeof val === "object" && val.value) {
        // Handle object format {value: "...", options: [...]}
        return Array.isArray(val.value) ? val.value : [val.value];
      }
      return [];
    }

    if (cellType === "date") {
      // Date: ensure string format
      if (typeof val === "string") return val;
      if (val && typeof val === "object" && val.date) return val.date;
      return "";
    }

    // Text and longtext: convert to string
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (val && typeof val === "object") {
      // Handle object format - try to extract value
      if (val.value !== undefined) return String(val.value);
      if (val.label !== undefined) return String(val.label);
      return JSON.stringify(val);
    }
    return "";
  };

  // Normalize options - ensure array format with proper structure
  const normalizeOptions = (opts) => {
    if (!opts) return [];
    if (Array.isArray(opts)) {
      return opts.map((opt) => {
        if (typeof opt === "string") {
          return { label: opt, value: opt, color: "#f2f2f2" };
        }
        if (typeof opt === "object") {
          return {
            label: opt.label || opt.value || opt.text || String(opt),
            value: opt.value || opt.label || opt.text || String(opt),
            color: opt.color || "#f2f2f2",
            grade: opt.grade,
          };
        }
        return { label: String(opt), value: String(opt), color: "#f2f2f2" };
      });
    }
    return [];
  };

  // Normalize onChange handler to ensure consistent format
  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const normalizedValue = normalizeValue(value, cellType);
  const normalizedOptions = normalizeOptions(options);

  switch (cellType) {
    case "text":
      return <TextCell value={normalizedValue} onChange={handleChange} />;

    case "longtext":
      return <LongTextCell value={normalizedValue} onChange={handleChange} />;

    case "checkbox":
      return <CheckboxCell value={normalizedValue} onChange={handleChange} />;

    case "date":
      return <DateCell value={normalizedValue} onChange={handleChange} />;

    case "dropdown":
      return (
        <DropdownCell
          value={normalizedValue}
          options={normalizedOptions}
          onChange={handleChange}
        />
      );

    default:
      // Default to text for unknown types
      return <TextCell value={normalizedValue} onChange={handleChange} />;
  }
};

export default HandleCell;



// FILE: LongTextCell.js
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Textarea = styled.textarea`
  width: 90%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
  direction: rtl;
  text-align: right;
  resize: none;
  overflow: hidden;
`;

export default function LongTextCell({ value, onChange }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Textarea
      ref={ref}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}



// FILE: TextCell.js
import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: 90%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
  direction: rtl;
  text-align: right;
`;

export default function TextCell({ value, onChange }) {
  return (
    <Input
      type="text"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}


