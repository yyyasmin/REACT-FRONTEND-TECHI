
// FILE: cells.js

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





// FILE: CollectedFiles.js

// FILE: cells.js

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





// FILE: components.js

// FILE: ExistingStdSelector.js
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



// FILE: Navigation.js
import React from "react";
import styled from "styled-components";

const NavDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 0 4px;
`;

const Navigation = ({ currentIndex, total, onNext, onPrev, onSave }) => {
  return (
    <NavDiv>
      <Button onClick={onPrev} disabled={currentIndex === 0}>הקודם</Button>
      <Button onClick={onNext} disabled={currentIndex === total - 1}>הבא</Button>
      <Button onClick={onSave}>שמור</Button>
    </NavDiv>
  );
};

export default Navigation;



// FILE: NewStdForm.js
import React, { useState } from "react";

const NewStdForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !id.trim()) return alert("Enter both name and ID!");
    onCreate({ name: name.trim(), id: id.trim() });
    setName("");
    setId("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם std חדש"
      />
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID std"
      />
      <button type="submit">הוסף std חדש</button>
    </form>
  );
};

export default NewStdForm;



// FILE: TableSection.js
import React from "react";
import styled from "styled-components";
import HorizontalTable from "./tables/HorizontalTable";
import VerticalTable from "./tables/VerticalTable";

const Section = styled.div`
  margin: 20px auto;
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: 18px;
  background-color: #f9f9fa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  width: 1200px;
  max-width: 95%;
  direction: rtl;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 12px;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #d0d8e0;
  padding-bottom: 6px;
  text-align: center;
`;

// -------------------------------
// Normalize cells format for HorizontalTable
// Handles both flat array format [{...}, {...}] and array-of-rows format [[{...}], [...]]
// Also handles old format for IndividualEducationalPlan (entry objects)
// -------------------------------
const normalizeTableCells = (cells, tableName) => {
  if (!cells || cells.length === 0) return [];
  
  // Special case for "תכנית חינוכית יחידנית" - convert old format (entry objects) to new format
  if (tableName === "תכנית חינוכית יחידנית") {
    // Check if cells are in old format (entry objects with "field" key)
    if (cells.length > 0 && typeof cells[0] === "object" && cells[0].field) {
      // Convert entry objects to cell objects format
      return cells.map((entry) => ({
        cells: [
          {
            title: "תחום תפקוד",
            type: "text",
            value: entry.field || "",
          },
          {
            title: "תפקוד נוכחי",
            type: "longtext",
            value: entry.current_function || "",
          },
          {
            title: "מטרות ויעדים מדידים",
            type: "dropdown",
            value: entry.goals?.value || "",
            options: entry.goals?.options || [],
          },
          {
            title: "השותפים ופעולות לקידום המטרה",
            type: "dropdown",
            value: entry.partners?.value || "",
            options: entry.partners?.options || [],
          },
          {
            title: "הערכה מעצבת",
            type: "longtext",
            value: entry.assessment || "",
          },
        ],
      }));
    }
    // Already in new format (array of rows with cell objects)
    if (Array.isArray(cells[0]) && cells[0].length > 0 && cells[0][0].title) {
      return cells.map((row) => ({ cells: row }));
    }
    // Fallback: wrap in array of rows format
    return cells.map((row) => ({ cells: Array.isArray(row) ? row : [row] }));
  }
  
  // Check if first element is an array (array of rows) or object (flat array)
  const isArrayOfRows = Array.isArray(cells[0]);
  
  if (isArrayOfRows) {
    // Already in array-of-rows format: [[{...}], [...]]
    return cells.map((row) => ({ cells: row }));
  } else {
    // Flat array format: [{...}, {...}] - wrap in array of rows
    return [{ cells: cells }];
  }
};

const TableSection = ({ table }) => {
  if (!table) return null;

  // -------------------------------
  // Decide data format for HorizontalTable
  // -------------------------------
  // For horizontal tables, normalize cells to array of objects with cells property
  const tableData = normalizeTableCells(table.cells, table.table_name);


  return (
    <Section>
      <SectionTitle>{table.table_name}</SectionTitle>
      {table.direction === "horizontal" ? (
<HorizontalTable
  headers={table.titles || []}
  data={tableData}
  tableName={table.table_name}
  std_id={table.std_id}
/>

      ) : (
        <VerticalTable table={{ ...table, data: table.cells || [] }} />
      )}
    </Section>
  );
};

export default TableSection;





// FILE: helpers.js

// FILE: isEmpty.js

// CHECK IF OBJ OF ANY TYPE IS EMPTY 
function isEmpty(obj) {
  if (typeof obj === 'undefined' || obj === null) {
    return true;
  }

  if (typeof obj === 'string' && obj.trim() === '') {
    return true;
  }

  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  }

  if (typeof obj === 'object' && Object.keys(obj).length === 0) {
    return true;
  }

  return false;
}


export default isEmpty


// FILE: ServerRoutes.js
// src/helpers/ServerRoutes.js

///////////// DEVELOPMENT /////////////
const FLASK_PROXY_URL = "http://127.0.0.1:5000";

///////////// PRODUCTION /////////////
export const NODE_RENDER_URL = "https://mgduplicatesinarownode-production.up.railway.app";
export const FLASK_RENDER_URL = "https://mgduplicatrsinarowflask-production.up.railway.app";
export const BROWSER_RENDER_URL = "https://mgduplicatesrowreact.netlify.app/";

////// CHOOSE ENVIRONMENT VARS //////

// Switch between local and render here
const USE_LOCAL = true;
//const USE_LOCAL = false;

// Export chosen URLs for use in frontend
export const CHOSEN_FLASK_URL = USE_LOCAL ? FLASK_PROXY_URL : FLASK_RENDER_URL;
export const CHOSEN_BROWSER_URL = USE_LOCAL ? "http://127.0.0.1:3000" : BROWSER_RENDER_URL;





// FILE: scripts.js

// FILE: src_files.py
import os

# Root folder to start scanning
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
# Folder to save the collected files
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'CollectedFiles')

# Create the output folder if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

def collect_folder_files(folder_path):
    """Collect all files in a folder (not subfolders) and write to one .js file"""
    folder_name = os.path.basename(folder_path)
    output_file = os.path.join(OUTPUT_DIR, f"{folder_name}.js")

    with open(output_file, 'w', encoding='utf-8') as out_f:
        for item in os.listdir(folder_path):
            item_path = os.path.join(folder_path, item)
            # Only files, ignore subfolders
            if os.path.isfile(item_path):
                out_f.write(f"\n// FILE: {item}\n")
                with open(item_path, 'r', encoding='utf-8', errors='ignore') as f:
                    out_f.write(f.read())
                    out_f.write("\n\n")

def scan_tree(root_dir):
    """Scan the tree starting from root_dir and process each folder"""
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Only include folders inside src
        if os.path.commonpath([ROOT_DIR, dirpath]) == ROOT_DIR:
            collect_folder_files(dirpath)

if __name__ == "__main__":
    scan_tree(ROOT_DIR)
    print(f"All files collected in '{OUTPUT_DIR}'")





// FILE: src.js

// FILE: api.js
const BASE_URL = "http://127.0.0.1:5000";

// ✅ Fetch student list
export const fetchStdList = async () => {
  const routePath = `${BASE_URL}/stds`;
  console.log("fetchStdList →", routePath);

  const res = await fetch(routePath);
  return await res.json(); // [{id, name}]
};

// ✅ Fetch ALL student data (all tables)
export const fetchStdData = async (stdId = "", stdName = "") => {
  const params = new URLSearchParams();
  if (stdId) params.append("id", stdId);
  if (stdName) params.append("std", stdName);

  // 🔥 This is the correct route in your new std_routes
  const res = await fetch(`${BASE_URL}/load?${params.toString()}`);

  return await res.json();
};

// ✅ Save student data (existing function)
export const saveStdData = async ({ name, id, data }) => {
  await fetch(`${BASE_URL}/save_std`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ std: name, id, data }),
  });
};

// ✅ Create a new student (React version)
export const createNewStd = async (id, name) => {
  const res = await fetch(`${BASE_URL}/new_std`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name })
  });

  return await res.json();
};

// Add a new row to a table
export const addRow = async (std_id, table_name) => {
  const res = await fetch(`${BASE_URL}/add_row`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ std_id, table_name }),
  });
  return await res.json();
};




// FILE: App.js
import React, { useState, useEffect } from "react";
import TableSection from "./components/TableSection";
import NewStdForm from "./components/NewStdForm";
import ExistingStdSelector from "./components/ExistingStdSelector";
import { fetchStdList, fetchStdData, saveStdData } from "./api";

const App = () => {
  const [tables, setTables] = useState([]);
  const [stds, setStds] = useState([]); // ✅ changed from students
  const [selectedStd, setSelectedStd] = useState(""); // ✅ changed
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStds = async () => {
      try {
        console.log("[DEBUG] Fetching std list...");
        const stdList = await fetchStdList();
        console.log("[DEBUG] Std list response:", stdList);

        setStds(
          stdList.map((s) => ({
            name: s.name,
            id: s.id,
          }))
        );
      } catch (err) {
        console.error("❌ Error loading std list:", err);
      }
    };
    loadStds();
  }, []);

  const handleStdSelect = async (stdId) => { // ✅ changed
    if (!stdId) return;
    setSelectedStd(stdId);
    setTables([]);
    setLoading(true);

    try {
      console.log(`[DEBUG] Fetching data for std ID ${stdId}...`);
      const data = await fetchStdData(stdId);
      console.log("[DEBUG] Raw data received from backend:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        setTables(data);
      } else if (data.tables) {
        setTables(data.tables); // ✅ changed to handle new backend format
      } else {
        console.warn("⚠️ Unexpected data format received:", data);
        setTables([]);
      }
    } catch (err) {
      console.error("❌ Error fetching std data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewStd = async ({ name, id }) => { // ✅ changed
    if (!name || !id) {
      alert("Please enter both name and ID");
      return;
    }

    if (stds.some((s) => s.id === id || s.name === name)) { // ✅ changed
      alert("Std already exists!");
      return;
    }

    try {
      console.log(`[DEBUG] Creating new std: ${name} (${id})`);
      await saveStdData({ name, id, data: [] });

      setStds((prev) => [...prev, { name, id }]); // ✅ changed
      setSelectedStd(id);

      const data = await fetchStdData(id);
      console.log("[DEBUG] Default tables loaded for new std:", data);
      setTables(data.tables || []);
    } catch (err) {
      console.error("❌ Error creating std:", err);
      alert("Failed to create new std");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
        <ExistingStdSelector
          stds={stds} // ✅ changed
          selectedStd={selectedStd} // ✅ changed
          onSelect={handleStdSelect} // ✅ changed
        />
        <NewStdForm onCreate={handleCreateNewStd} /> {/* ✅ changed */}
      </div>

      {loading ? (
        <p>⏳ טוען נתונים...</p>
      ) : tables.length > 0 ? (
        tables.map((t, i) => <TableSection key={i} table={t} />)
      ) : (
        <p>🚀 בחר std או צור std חדש כדי לטעון נתונים...</p> // ✅ changed
      )}
    </div>
  );
};

export default App;



// FILE: index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);





// FILE: tables.js

// FILE: AddRowBtn.js
import React from "react";
import styled from "styled-components";
import { addRow } from "../../api"; // your backend API call

const Btn = styled.button`
  padding: 8px 16px;
  margin: 12px 0;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const AddRowBtn = ({ std_id, table_name, onRowAdded }) => {
  const handleAddRow = async () => {
    if (!std_id || !table_name) return;
    try {
      const result = await addRow(std_id, table_name);
      if (result.new_row) onRowAdded(result.new_row);
    } catch (err) {
      console.error("Failed to add row:", err);
    }
  };

  return <Btn onClick={handleAddRow}>➕ הוסף שורה</Btn>;
};

export default AddRowBtn;



// FILE: HorizontalTable.js
import React, { useState } from "react";
import styled from "styled-components";
import HandleCell from "./cells/HandleCell";
import AddRowBtn from "./AddRowBtn";

const TableContainer = styled.div`
  margin: 20px auto;
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  background-color: #f2f7ff;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 6px;
  text-align: center;
  vertical-align: top;
`;

const HorizontalTable = ({ headers, data, tableName, std_id, allFields, allGoalsMap, allActivitiesMap }) => {
  const [rows, setRows] = useState(data.map((row) => row.cells));

  const handleFieldChange = (rowIndex, newField) => {
    const newRows = [...rows];
    const row = newRows[rowIndex];

    row[0].value = newField;
    row[2].options = allGoalsMap[newField] || [];
    row[2].value = row[2].options.length ? row[2].options[0].label : "";

    row[3].options = allActivitiesMap[newField] || [];
    row[3].value = row[3].options.length ? row[3].options[0].label : "";

    setRows(newRows);
  };

  return (
    <TableContainer>
      <AddRowBtn
        std_id={std_id}
        table_name={tableName}
        onRowAdded={(newRow) => setRows([...rows, newRow.cells])}
      />
      <Table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <Th key={i}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Td key={colIndex}>
                  {colIndex === 0 ? (
                    <HandleCell
                      type="dropdown"
                      value={cell.value}
                      options={allFields}
                      onChange={(val) => handleFieldChange(rowIndex, val)}
                    />
                  ) : (
                    <HandleCell
                      type={cell.type}
                      value={cell.value}
                      options={cell.options}
                      onChange={(val) => {
                        const newRows = [...rows];
                        newRows[rowIndex][colIndex].value = val;
                        setRows(newRows);
                      }}
                    />
                  )}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default HorizontalTable;



// FILE: VerticalTable.js
import React, { useState } from "react";
import styled from "styled-components";
import HandleCell from "./cells/HandleCell";
import AddRowBtn from "./AddRowBtn";

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const Tr = styled.tr`
  background-color: ${({ $index }) => ($index % 2 === 0 ? "#f8fafc" : "#edf2f7")};
  &:hover {
    background-color: #e4ebf5;
  }
`;

const Th = styled.th`
  border: 1px solid #aaa;
  padding: 8px;
  text-align: right;
  font-weight: bold;
  background-color: #dce8ff;
`;

const Td = styled.td`
  border: 1px solid #aaa;
  padding: 8px;
  text-align: right;
  vertical-align: top;
  background-color: #f8fafc;
`;

const VerticalTable = ({ table, allFields, allGoalsMap, allActivitiesMap }) => {
  const [rows, setRows] = useState(table?.cells || []);

  const handleFieldChange = (rowIndex, newField) => {
    const newRows = [...rows];
    const row = newRows[rowIndex];

    // עדכון התחום בעמודה הראשונה
    row[0].value = newField;

    // עדכון מטרות ופעולות בהתאם
    row[2].options = allGoalsMap[newField] || [];
    row[2].value = row[2].options.length ? row[2].options[0].label : "";

    row[3].options = allActivitiesMap[newField] || [];
    row[3].value = row[3].options.length ? row[3].options[0].label : "";

    setRows(newRows);
  };

  return (
    <div>
      <AddRowBtn
        std_id={table.std_id}
        table_name={table.table_name}
        onRowAdded={(newRow) => setRows([...rows, newRow.cells])}
      />
      <Table>
        <tbody>
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex} $index={rowIndex}>
              {row.map((cell, colIndex) => (
                <Td key={colIndex}>
                  {colIndex === 0 ? (
                    <HandleCell
                      type="dropdown"
                      value={cell.value}
                      options={allFields}
                      onChange={(val) => handleFieldChange(rowIndex, val)}
                    />
                  ) : (
                    <HandleCell
                      type={cell.type}
                      value={cell.value}
                      options={cell.options}
                      onChange={(val) => {
                        const newRows = [...rows];
                        newRows[rowIndex][colIndex].value = val;
                        setRows(newRows);
                      }}
                    />
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VerticalTable;





// FILE: TO_BE_DELETED.js

// FILE: ExistingStudentSelector.js
import React from "react";

const ExistingStdSelector = ({ students = [], selectedStudent, onSelect }) => {
  // Ensure students is always an array — prevents map() errors
  if (!Array.isArray(students)) {
    console.warn("⚠️ students prop is not an array:", students);
    students = [];
  }

  return (
    <div>
      <label htmlFor="studentSelect">בחר תלמיד קיים:</label>
      <select
        id="studentSelect"
        value={selectedStudent || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- בחר תלמיד --</option>
        {students.length > 0 ? (
          students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.id})
            </option>
          ))
        ) : (
          <option disabled>אין תלמידים זמינים</option>
        )}
      </select>
    </div>
  );
};

export default ExistingStdSelector;



// FILE: ExportButton.js
import React from "react";

const styles = {
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
  }
};

export default function ExportButton({ onExport }) {
  return React.createElement(
    "button",
    { style: styles.button, onClick: onExport },
    "📄 יצוא לקובץ Word"
  );
}



// FILE: FileUploader.js
import React from "react";

const styles = {
  container: { margin: "10px 0" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }
};

export default function FileUploader({ onUpload }) {
  const handleFileUpload = function (event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      const data = JSON.parse(e.target.result);
      onUpload(data);
    };
    fileReader.readAsText(event.target.files[0]);
  };

  return React.createElement(
    "div",
    { style: styles.container },
    React.createElement("input", {
      type: "file",
      accept: ".json",
      onChange: handleFileUpload,
      style: styles.input
    })
  );
}



// FILE: NewStudentForm.js
import React, { useState } from "react";

const NewStdForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !id.trim()) return alert("Enter both name and ID!");
    onCreate({ name: name.trim(), id: id.trim() });
    setName("");
    setId("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם std חדש"
      />
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID std"
      />
      <button type="submit">הוסף std חדש</button>
    </form>
  );
};

export default NewStdForm;



// FILE: Pagination.js
import React from "react";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 0"
  },
  button: {
    background: "#4caf50",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    margin: "0 5px",
    cursor: "pointer"
  },
  disabled: { backgroundColor: "#ccc", cursor: "not-allowed" },
  label: { margin: "0 10px" }
};

export default function Pagination({ currentPage, totalPages, onNext, onPrev }) {
  return React.createElement(
    "div",
    { style: styles.container },
    React.createElement(
      "button",
      {
        style: currentPage === 0
          ? { ...styles.button, ...styles.disabled }
          : styles.button,
        onClick: onPrev,
        disabled: currentPage === 0
      },
      "⬅️ הקודם"
    ),
    React.createElement(
      "span",
      { style: styles.label },
      "עמוד ",
      currentPage + 1,
      " מתוך ",
      totalPages
    ),
    React.createElement(
      "button",
      {
        style: currentPage === totalPages - 1
          ? { ...styles.button, ...styles.disabled }
          : styles.button,
        onClick: onNext,
        disabled: currentPage === totalPages - 1
      },
      "הבא ➡️"
    )
  );
}



// FILE: TableCell.js
import React from "react";

const options = ["", "הושג", "הושג חלקית", "לא הושג", "לא שויך"];

const TableCell = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.dropdown}>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  );
};

const styles = {
  dropdown: { width: "100%", padding: "4px" },
};

export default TableCell;



// FILE: TableEditor.js
import React from "react";
import TableRenderer from "./TableRenderer";

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },
  title: { color: "#34495e" },
  description: { color: "#555" }
};

export default function TableEditor({ table, tableIndex, tables, setTables }) {
  const handleCellChange = function (rowIndex, colIndex, newValue) {
    const updated = [...tables];
    updated[tableIndex].rows[rowIndex][colIndex] = newValue;
    setTables(updated);
  };

  return React.createElement(
    "div",
    { style: styles.card },
    React.createElement("h2", { style: styles.title }, table.table_name),
    table.description &&
      React.createElement("p", { style: styles.description }, table.description),
    React.createElement(TableRenderer, {
      table: table,
      onChange: handleCellChange
    })
  );
}



// FILE: TableForm.js
import React from "react";
import DropdownCell from "./DropdownCell";

export default function TableForm({ table }) {
  if (!table) return null;

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>{table.table_name}</h3>
      {table.description && <p>{table.description}</p>}

      <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {table.columns.map((col, cIdx) => (
              <th key={cIdx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>
                  <DropdownCell
                    value={cell}
                    onChange={(val) => console.log("change", val)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



// FILE: TableRenderer.js
import React from "react";

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px 0",
    direction: "rtl"
  },
  th: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "1px solid #ddd",
    padding: "8px"
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px"
  },
  select: {
    width: "100%",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }
};

const dropdownOptions = [
  "מצוין",
  "טוב",
  "בינוני",
  "נדרש שיפור",
  "לא רלוונטי",
  "לחץ או הקש כאן להזנת טקסט."
];

export default function TableRenderer({ table, onChange }) {
  const header = React.createElement(
    "tr",
    null,
    table.columns.map(function (col, i) {
      return React.createElement("th", { key: i, style: styles.th }, col);
    })
  );

  const rows = table.rows.map(function (row, rowIndex) {
    const cells = row.map(function (cell, colIndex) {
      return React.createElement(
        "td",
        { key: colIndex, style: styles.td },
        React.createElement(
          "select",
          {
            value: cell,
            style: styles.select,
            onChange: function (e) {
              onChange(rowIndex, colIndex, e.target.value);
            }
          },
          dropdownOptions.map(function (opt) {
            return React.createElement("option", { key: opt, value: opt }, opt);
          }),
          !dropdownOptions.includes(cell)
            ? React.createElement("option", { value: cell }, cell)
            : null
        )
      );
    });
    return React.createElement("tr", { key: rowIndex }, cells);
  });

  return React.createElement(
    "table",
    { style: styles.table },
    React.createElement("thead", null, header),
    React.createElement("tbody", null, rows)
  );
}




