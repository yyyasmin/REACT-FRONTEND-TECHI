import React, { useState, useEffect } from "react";
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

  // Update allOptions when options prop changes
  useEffect(() => {
    console.log("DropdownCell - options prop received:", options);
    console.log("DropdownCell - options length:", options?.length);
    const mappedOptions = options.map((o) => ({
      value: o.value ?? o.label ?? o,
      label: o.label ?? o.value ?? o,
      color: o.color ?? "#f2f2f2",
    }));
    console.log("DropdownCell - mappedOptions:", mappedOptions);
    setAllOptions(mappedOptions);
  }, [options]);

  const selected = allOptions.filter((o) => {
    if (Array.isArray(value)) {
      return value.includes(o.value) || value.includes(o.label);
    }
    return value === o.value || value === o.label;
  });

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
