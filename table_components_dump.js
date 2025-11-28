
================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/TableSection.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/AddRowBtn.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/HorizontalTable.js
================================================================================

import React, { useState } from "react";
import styled from "styled-components";
// 🔹 UPDATED: import HandleCell instead of DropdownCell
import HandleCell from "./cells/HandleCell";
import AddRowBtn from "./AddRowBtn";

const TableContainer = styled.div`
  margin: 20px auto;
  width: 1200px;
  max-width: 95%;
  background-color: #fff;
  border-radius: 12px;
  overflow-x: auto;
  direction: rtl;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
`;

const Th = styled.th`
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  background-color: #f2f7ff;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 6px;
  text-align: center;
  background-color: #fafcff;
  vertical-align: top;
`;

const Title = styled.h3`
  text-align: center;
  padding: 10px;
  background-color: #e6f0ff;
  margin: 0;
  border-radius: 12px 12px 0 0;
`;

// ----------------------------
// NORMALIZER (SAFE VERSION) - Handles all formats
// Preserves all properties including options with colors
// ----------------------------
const normalizeCells = (cells = []) =>
  cells.map((cell) => {
    // Handle different cell formats
    let cellObj = cell;
    
    // If cell is a string or primitive, convert to object
    if (typeof cell !== "object" || cell === null) {
      cellObj = { value: cell, type: "text", title: "", options: [] };
    }
    
    // Extract type, handling different formats
    const cellType = (cellObj.type || "text").toLowerCase().trim();
    
    // Extract value, handling different formats
    let cellValue = cellObj.value;
    if (cellValue === null || cellValue === undefined) {
      // Set default based on type
      if (cellType === "checkbox") {
        cellValue = false;
      } else if (cellType === "dropdown") {
        cellValue = [];
      } else {
        cellValue = "";
      }
    }
    
    // Extract options, ensuring array format and preserving all properties (label, value, color, grade)
    let cellOptions = [];
    if (cellObj.options && Array.isArray(cellObj.options)) {
      cellOptions = cellObj.options.map(opt => {
        if (typeof opt === "string") {
          return { label: opt, value: opt, color: "#f2f2f2" };
        }
        if (typeof opt === "object" && opt !== null) {
          return {
            label: opt.label || opt.value || String(opt),
            value: opt.value || opt.label || String(opt),
            color: opt.color || "#f2f2f2",
            grade: opt.grade,
          };
        }
        return { label: String(opt), value: String(opt), color: "#f2f2f2" };
      });
    }
    
    // Extract title
    const cellTitle = cellObj.title || "";
    
    return {
      type: cellType,
      title: cellTitle,
      options: cellOptions, // Preserve full options array with all properties
      value: cellValue,
    };
  });

const HorizontalTable = ({ headers = [], data = [], tableName, std_id }) => {
  // Normalize initial backend data
  const [rows, setRows] = useState(() =>
    data.map((row) => ({
      ...row,
      cells: normalizeCells(row.cells),
    }))
  );

  return (
    <TableContainer>
      <AddRowBtn
        std_id={std_id}
        table_name={tableName}
        onRowAdded={(newRow) => {
          // Backend sends: { new_row: { cells: [...] } }
          // AddRowBtn passes result.new_row directly, so newRow is the new_row object
          if (newRow && newRow.cells) {
            const newCells = normalizeCells(newRow.cells);
            setRows((prev) => [...prev, { cells: newCells }]);
          }
        }}
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
          {rows.map((rowObj, r) => (
            <tr key={r}>
              {rowObj.cells.map((cell, c) => (
                <Td key={c}>
                  {/* 🔹 UPDATED: use HandleCell instead of DropdownCell */}
                  <HandleCell
                    type={cell.type}
                    value={cell.value}
                    options={cell.options}
                    onChange={(val) => {
                      rowObj.cells[c].value = val;
                      setRows([...rows]);
                    }}
                  />
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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/VerticalTable.js
================================================================================

import React, { useState } from "react";
import styled from "styled-components";
// 🔹 UPDATED: import HandleCell instead of DropdownCell
import HandleCell from "./cells/HandleCell";
import AddRowBtn from "./AddRowBtn";

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  background-color: #fff;
  font-family: "Arial", sans-serif;
  max-width: 1200px;
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
  width: 30%;
`;

const Td = styled.td`
  border: 1px solid #aaa;
  padding: 8px;
  text-align: right;
  vertical-align: top;
  background-color: #f8fafc;
`;

// Normalize cells for vertical table
const normalizeVerticalCells = (cells = []) => {
  if (!Array.isArray(cells)) return [];
  return cells.map(row => {
    if (Array.isArray(row)) {
      return row.map(cell => {
        if (typeof cell === "object" && cell !== null) {
          return {
            type: cell.type || "text",
            title: cell.title || "",
            value: cell.value ?? "",
            options: cell.options || [],
          };
        }
        return { type: "text", title: "", value: cell ?? "", options: [] };
      });
    }
    return [{ type: "text", title: "", value: row ?? "", options: [] }];
  });
};

const VerticalTable = ({ table }) => {
  const [rows, setRows] = useState(() => {
    // Normalize cells to ensure proper format
    return normalizeVerticalCells(table?.cells || []);
  });

  // Don't return null - show empty table if no data
  if (!table) return null;

  const handleAddRow = (newRow) => {
    // Handle both formats: {cells: [...]} or just [...]
    const rowToAdd = newRow?.cells || newRow;
    if (Array.isArray(rowToAdd)) {
      const normalizedRow = normalizeVerticalCells([rowToAdd])[0] || rowToAdd;
      setRows(prev => [...prev, normalizedRow]);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <AddRowBtn
        std_id={table.std_id}
        table_name={table.table_name}
        onRowAdded={handleAddRow}
      />

      <Table>
        <tbody>
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex} $index={rowIndex}>
              {row.map((cell, colIndex) => {
                const cellValue = cell?.value ?? "";
                const cellOptions = cell?.options ?? [];
                const cellType = cell?.type ?? "text";

                if (colIndex === 0) {
                  return (
                    <Th key={colIndex}>
                      {typeof cellValue === "object"
                        ? cellValue.label ?? JSON.stringify(cellValue)
                        : cellValue}
                    </Th>
                  );
                } else {
                  return (
                    <Td key={colIndex}>
                      {/* 🔹 UPDATED: use HandleCell instead of DropdownCell */}
                      <HandleCell
                        type={cellType}
                        value={cellValue}
                        options={cellOptions}
                        onChange={(val) => {
                          row[colIndex].value = val;
                          setRows([...rows]);
                        }}
                      />
                    </Td>
                  );
                }
              })}
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VerticalTable;

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells\CheckboxCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells\DateCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells\DropdownCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells\HandleCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells\LongTextCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells\TextCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells/CheckboxCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells/DateCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells/DropdownCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells/HandleCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells/LongTextCell.js
================================================================================

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

================================================================================
// FILE: C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components/tables/cells/TextCell.js
================================================================================

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
