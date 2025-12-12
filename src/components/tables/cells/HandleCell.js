import React from "react";
import TextCell from "./TextCell";
import LongTextCell from "./LongTextCell";
import CheckboxCell from "./CheckboxCell";
import DateCell from "./DateCell";
import DropdownCell from "./DropdownCell";

const HandleCell = ({ type, value, options, onChange, isMulti = undefined }) => {
  // Normalize cell type - handle different cases and missing types
  const cellType = (type || "text").toLowerCase().trim();

  // Normalize value based on type
  const normalizeValue = (val, cellType, isMulti) => {
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
      // Dropdown: Handle based on isMulti prop
      // If isMulti is false (single-select), return string; otherwise return array
      // Since isMulti is passed as prop, we can use it here
      if (isMulti === false) {
        // Single-select: return string (not array!)
        if (Array.isArray(val)) {
          // If it's an array, take first element and convert to string
          const first = val[0];
          if (typeof first === "string") return first;
          if (first && typeof first === "object") return first.value || first.label || "";
          return String(first || "");
        }
        if (typeof val === "string") return val;
        if (val && typeof val === "object") {
          // Extract value or label as string
          return val.value || val.label || "";
        }
        return "";
      } else {
        // Multi-select: return array
        if (Array.isArray(val)) return val;
        if (typeof val === "string" && val.trim() !== "") return [val];
        if (val && typeof val === "object" && val.value) {
          return Array.isArray(val.value) ? val.value : [val.value];
        }
        return [];
      }
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

  const normalizedValue = normalizeValue(value, cellType, isMulti);
  const normalizedOptions = normalizeOptions(options);

  // Debug logging for "סוג איבחון"
  if (cellType === "dropdown" && options && Array.isArray(options) && options.length > 0 && options[0]?.label?.includes("אבחון")) {
    console.log("HandleCell - סוג איבחון - raw options:", options);
    console.log("HandleCell - סוג איבחון - normalizedOptions:", normalizedOptions);
    console.log("HandleCell - סוג איבחון - normalizedValue:", normalizedValue);
  }

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
      // Debug: log isMulti prop for field dropdown
      if (isMulti === false) {
        console.log("HandleCell - DROPDOWN with isMulti=false - normalizedValue:", normalizedValue, "normalizedOptions:", normalizedOptions?.length);
      }
      return (
        <DropdownCell
          value={normalizedValue}
          options={normalizedOptions}
          onChange={(val) => {
            // For single-select, ensure we pass a string, not an array
            if (isMulti === false) {
              const stringVal = Array.isArray(val) ? val[0] : (typeof val === "object" ? (val.value || val.label || "") : val);
              console.log("HandleCell - Single-select onChange - val:", val, "stringVal:", stringVal);
              handleChange(stringVal);
            } else {
              handleChange(val);
            }
          }}
          isMulti={isMulti !== undefined ? isMulti : true} // Default to multi-select unless specified
        />
      );

    default:
      // Default to text for unknown types
      return <TextCell value={normalizedValue} onChange={handleChange} />;
  }
};

export default HandleCell;
