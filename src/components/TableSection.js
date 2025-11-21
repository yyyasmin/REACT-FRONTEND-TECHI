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
