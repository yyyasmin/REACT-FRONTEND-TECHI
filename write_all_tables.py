import os

# Base path to your src/components folder
BASE_PATH = r"C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src\components"

# File contents dictionary
files = {
    "TableSection.js": """
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

const normalizeTableCells = (cells, tableName) => {
  if (!cells || cells.length === 0) return [];
  
  if (tableName === "תכנית חינוכית יחידנית") {
    if (cells.length > 0 && typeof cells[0] === "object" && cells[0].field) {
      return cells.map((entry) => ({
        cells: [
          { title: "תחום תפקוד", type: "text", value: entry.field || "" },
          { title: "תפקוד נוכחי", type: "longtext", value: entry.current_function || "" },
          { title: "מטרות ויעדים מדידים", type: "dropdown", value: entry.goals?.value || "", options: entry.goals?.options || [] },
          { title: "השותפים ופעולות לקידום המטרה", type: "dropdown", value: entry.partners?.value || "", options: entry.partners?.options || [] },
          { title: "הערכה מעצבת", type: "longtext", value: entry.assessment || "" },
        ],
      }));
    }
    if (Array.isArray(cells[0]) && cells[0].length > 0 && cells[0][0].title) {
      return cells.map((row) => ({ cells: row }));
    }
    return cells.map((row) => ({ cells: Array.isArray(row) ? row : [row] }));
  }
  
  const isArrayOfRows = Array.isArray(cells[0]);
  if (isArrayOfRows) return cells.map((row) => ({ cells: row }));
  return [{ cells: cells }];
};

const TableSection = ({ table }) => {
  if (!table) return null;
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
""",
    "tables/AddRowBtn.js": """
import React from "react";
import styled from "styled-components";
import { addRow } from "../../api";

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
""",
    "tables/HorizontalTable.js": "/* HorizontalTable.js content (from dump above) */",
    "tables/VerticalTable.js": "/* VerticalTable.js content (from dump above) */",
    "tables/cells/HandleCell.js": "/* HandleCell.js content */",
    "tables/cells/CheckboxCell.js": "/* CheckboxCell.js content */",
    "tables/cells/DateCell.js": "/* DateCell.js content */",
    "tables/cells/DropdownCell.js": "/* DropdownCell.js content */",
    "tables/cells/LongTextCell.js": "/* LongTextCell.js content */",
    "tables/cells/TextCell.js": "/* TextCell.js content */",
}

# Function to create directories and files
for path, content in files.items():
    file_path = os.path.join(BASE_PATH, path.replace("/", os.sep))
    dir_path = os.path.dirname(file_path)
    os.makedirs(dir_path, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"✅ Created: {file_path}")
