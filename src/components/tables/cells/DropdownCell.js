import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";

export default function DropdownCell({ value = [], options = [], onChange, isMulti = true }) {
  // Debug: verify isMulti prop
  if (!isMulti) {
    console.log("DropdownCell - SINGLE-SELECT mode - isMulti:", isMulti, "value:", value, "value type:", typeof value, "isArray:", Array.isArray(value));
  }
  const [allOptions, setAllOptions] = useState(
    options.map((o) => ({
      value: o.value ?? o.label ?? o,
      label: o.label ?? o.value ?? o,
      color: o.color ?? "#f2f2f2",
    }))
  );

  // Update allOptions when options prop changes
  useEffect(() => {
    console.log("DropdownCell - options prop received:", options);
    console.log("DropdownCell - options length:", options?.length);
    
    if (!options || !Array.isArray(options) || options.length === 0) {
      setAllOptions([]);
      return;
    }
    
    const mappedOptions = options.map((o) => {
      // Handle different option formats
      if (typeof o === "string") {
        return { value: o, label: o, color: "#f2f2f2" };
      }
      if (typeof o === "object") {
        return {
          value: o.value ?? o.label ?? String(o),
          label: o.label ?? o.value ?? String(o),
          color: o.color ?? "#f2f2f2",
        };
      }
      return { value: String(o), label: String(o), color: "#f2f2f2" };
    });
    console.log("DropdownCell - mappedOptions:", mappedOptions);
    setAllOptions(mappedOptions);
  }, [options]);

  // Normalize value for single vs multi-select
  let normalizedValue;
  if (isMulti) {
    // Multi-select: always use array
    normalizedValue = Array.isArray(value) ? value : (value ? [value] : []);
  } else {
    // Single-select: always use single value (string), not array
    if (Array.isArray(value)) {
      normalizedValue = value[0] || "";
    } else if (value && typeof value === "object") {
      normalizedValue = value.value || value.label || "";
    } else {
      normalizedValue = value || "";
    }
  }

  const selected = isMulti 
    ? allOptions.filter((o) => {
        const valArray = Array.isArray(normalizedValue) ? normalizedValue : [normalizedValue];
        return valArray.includes(o.value) || valArray.includes(o.label);
      })
    : (() => {
        // For single-select, find ONE option and return it as a single object (not array!)
        const found = allOptions.find((o) => {
          // For single-select, compare string values
          const optionValue = o.value || o.label || "";
          return normalizedValue === optionValue || String(normalizedValue) === String(optionValue);
        });
        // Return null if not found, or the single object (NOT an array!)
        return found || null;
      })();
  
  // Debug for field dropdown
  if (!isMulti) {
    console.log("Single-select DropdownCell - isMulti:", isMulti, "value:", value, "value type:", typeof value, "isArray:", Array.isArray(value), "normalizedValue:", normalizedValue, "normalizedValue type:", typeof normalizedValue, "selected:", selected, "selected type:", typeof selected, "isArray:", Array.isArray(selected), "selected?.value:", selected?.value);
  }

  // Debug logging
  useEffect(() => {
    if (allOptions.length > 0 && allOptions[0]?.label?.includes("אבחון")) {
      console.log("DropdownCell - סוג איבחון - allOptions:", allOptions);
      console.log("DropdownCell - סוג איבחון - value:", value);
      console.log("DropdownCell - סוג איבחון - selected:", selected);
    }
  }, [allOptions, value, selected]);

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

  // Force single-select if isMulti is explicitly false
  // Make sure isMulti is a boolean, not undefined
  const actualIsMulti = isMulti === false ? false : Boolean(isMulti);
  
  // CRITICAL: For single-select, selected MUST be a single object or null, NEVER an array
  // If selected is an array (even with one item), react-select will treat it as multi-select
  const finalSelected = actualIsMulti 
    ? selected  // Multi-select: selected is an array
    : (Array.isArray(selected) ? (selected.length > 0 ? selected[0] : null) : selected); // Single-select: ensure it's a single object or null
  
  console.log("CreatableSelect - isMulti prop:", isMulti, "actualIsMulti:", actualIsMulti, "selected:", selected, "finalSelected:", finalSelected, "finalSelected type:", typeof finalSelected, "isArray:", Array.isArray(finalSelected));
  
  return (
    <CreatableSelect
      isMulti={actualIsMulti}
      value={finalSelected}
      options={allOptions}
      onChange={(items) => {
        if (isMulti) {
          if (items) {
            onChange?.(items.map((i) => i.value));
          } else {
            onChange?.([]);
          }
        } else {
          // Single-select: items is a single object or null
          if (items) {
            const val = items.value || items.label || "";
            onChange?.(val);
          } else {
            onChange?.("");
          }
        }
      }}
      onCreateOption={handleCreate}
      placeholder="בחר..."
      isClearable={!isMulti} // Only show clear button for single-select (avoids duplicate X)
      menuPortalTarget={document.body}
      components={isMulti ? { Option, MultiValueLabel } : { Option }}
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
          padding: "2px 4px",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
        }),
        clearIndicator: (base) => ({
          ...base,
          padding: "4px",
          cursor: "pointer",
        }),
      }}
    />
  );
}
