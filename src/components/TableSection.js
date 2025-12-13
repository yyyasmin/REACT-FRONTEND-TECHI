import React from "react";
import styled from "styled-components";
import HorizontalTable from "./tables/HorizontalTable";
import VerticalTable from "./tables/VerticalTable";

const Section = styled.div`
  margin: ${props => props.isIndividualTable ? '5px -20px 5px -60px' : '20px auto'}; /* Even more negative margin on left (end in RTL) to expand leftward */
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: ${props => props.isIndividualTable ? '8px' : '18px'}; /* Minimal padding for individual table */
  background-color: #f9f9fa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  width: ${props => props.isIndividualTable ? 'calc(100% + 80px)' : '90%'}; /* Extend even more into parent padding for individual table */
  max-width: ${props => props.isIndividualTable ? 'calc(100% + 80px)' : '90%'};
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isIndividualTable ? 'stretch' : 'center'}; /* Stretch for individual table to use full width */
  overflow-x: visible; /* Allow horizontal overflow if needed */
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
  
  // Special case for "תכנית חינוכית יחידנית" or "תוכנית לימודית אישית" - convert old format (entry objects) to new format
  if (tableName === "תכנית חינוכית יחידנית" || tableName === "תוכנית לימודית אישית") {
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

  // Extract allFields, allGoalsMap, and allActivitiesMap for "תכנית חינוכית יחידנית"
  let allFields = null;
  let allGoalsMap = {};
  let allActivitiesMap = {};

  if ((table.table_name === "תכנית חינוכית יחידנית" || table.table_name === "תוכנית לימודית אישית") && tableData.length > 0) {
    const firstRow = tableData[0]?.cells || [];
    const fieldCell = firstRow.find((c) => c.title === "תחום תפקוד");
    
    if (fieldCell && fieldCell.options) {
      allFields = fieldCell.options;
      
      // Build goals map from all rows - collect goals for each field
      tableData.forEach((rowData) => {
        const row = rowData.cells || [];
        const field = row.find((c) => c.title === "תחום תפקוד")?.value;
        const fieldLabel = typeof field === "object" ? (field.label || field.value) : field;
        const goalsCell = row.find((c) => c.title === "מטרות ויעדים מדידים");
        const activitiesCell = row.find((c) => c.title === "השותפים ופעולות לקידום המטרה");
        
        if (fieldLabel && goalsCell?.options) {
          allGoalsMap[fieldLabel] = goalsCell.options;
        }
        
        // Activities are mapped by goal label, not by field
        if (goalsCell?.value && activitiesCell?.options) {
          const goalValue = goalsCell.value;
          const goalLabel = typeof goalValue === "object" ? (goalValue.label || goalValue.value) : goalValue;
          if (goalLabel && !allActivitiesMap[goalLabel]) {
            allActivitiesMap[goalLabel] = activitiesCell.options;
          }
        }
      });
      
      // For fields that don't have rows yet, we need to ensure they're in allGoalsMap
      // The backend will provide goals when cells are generated, but for now we'll initialize with empty
      allFields.forEach((field) => {
        const fieldName = field.label || field.value || field;
        if (!allGoalsMap[fieldName]) {
          // Try to find goals for this field in any row
          let found = false;
          tableData.forEach((rowData) => {
            const row = rowData.cells || [];
            const rowField = row.find((c) => c.title === "תחום תפקוד")?.value;
            const rowFieldLabel = typeof rowField === "object" ? (rowField.label || rowField.value) : rowField;
            if (rowFieldLabel === fieldName) {
              const goalsCell = row.find((c) => c.title === "מטרות ויעדים מדידים");
              if (goalsCell?.options && goalsCell.options.length > 0) {
                allGoalsMap[fieldName] = [...goalsCell.options]; // Create a copy
                found = true;
              }
            }
          });
          
          // If still not found, initialize with empty array
          // When user selects this field, backend will generate cells with correct goals
          if (!found) {
            allGoalsMap[fieldName] = [];
          }
        }
      });
      
      console.log("TableSection - allGoalsMap:", allGoalsMap);
      console.log("TableSection - allFields:", allFields);
    }
  }

  return (
    <Section isIndividualTable={table.table_name === "תכנית חינוכית יחידנית" || table.table_name === "תוכנית לימודית אישית"}>
      <SectionTitle>{table.table_name}</SectionTitle>
      {table.direction === "horizontal" ? (
<HorizontalTable
  headers={table.titles || []}
  data={tableData}
  tableName={table.table_name}
  std_id={table.std_id}
  allFields={allFields}
  allGoalsMap={allGoalsMap}
  allActivitiesMap={allActivitiesMap}
/>

      ) : (
        <VerticalTable 
          table={{ ...table, data: table.cells || [] }} 
          allFields={allFields}
          allGoalsMap={allGoalsMap}
          allActivitiesMap={allActivitiesMap}
        />
      )}
    </Section>
  );
};

export default TableSection;
