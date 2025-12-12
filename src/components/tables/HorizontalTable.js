import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HandleCell from "./cells/HandleCell";
import AddRowBtn from "./AddRowBtn";

// --------------------- Styled Components ---------------------
const TableContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ccc;
  padding: 12px;
  text-align: center;
  background-color: #f2f7ff;
  min-width: 150px;
  white-space: nowrap;
  font-size: 14px;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  vertical-align: top;
  min-width: 150px;
`;

// --------------------- HorizontalTable Component ---------------------
const HorizontalTable = ({ headers, data, tableName, std_id, allFields, allGoalsMap, allActivitiesMap }) => {
  // --------------------- State ---------------------
  const [rows, setRows] = useState(data.map((row) => row.cells));

  // Update rows when data changes (e.g., after adding a row)
  useEffect(() => {
    // When data changes, filter goals/activities based on selected field
    // But only filter if field is selected - otherwise keep original options
    const filteredRows = data.map((row) => {
      const rowCells = row.cells || [];
      const fieldCell = rowCells.find((c) => c.title === "תחום תפקוד");
      // Handle field value - could be string, array, or object
      let fieldLabel = "";
      if (fieldCell?.value) {
        if (Array.isArray(fieldCell.value)) {
          fieldLabel = fieldCell.value[0] || "";
        } else if (typeof fieldCell.value === "object") {
          fieldLabel = fieldCell.value.label || fieldCell.value.value || "";
        } else {
          fieldLabel = fieldCell.value;
        }
      }
      
      return rowCells.map((cell) => {
        // Only filter goals if field is selected and we have goals for that field
        if (cell.title === "מטרות ויעדים מדידים") {
          console.log("Filtering goals - fieldLabel:", fieldLabel, "allGoalsMap:", allGoalsMap, "cell.options:", cell.options);
          if (fieldLabel && allGoalsMap && allGoalsMap[fieldLabel] && allGoalsMap[fieldLabel].length > 0) {
            // Field is selected and we have goals - use filtered goals
            console.log("Using filtered goals:", allGoalsMap[fieldLabel]);
            return { ...cell, options: allGoalsMap[fieldLabel] };
          }
          // Field not selected or no goals - keep original options from backend (don't filter to empty)
          console.log("Keeping original goals from backend:", cell.options);
          return cell;
        }
        // Only filter activities if goal is selected and we have activities for that goal
        if (cell.title === "השותפים ופעולות לקידום המטרה") {
          const goalCell = rowCells.find((c) => c.title === "מטרות ויעדים מדידים");
          const currentGoal = goalCell?.value || "";
          let goalLabel = "";
          if (currentGoal) {
            if (Array.isArray(currentGoal)) {
              goalLabel = currentGoal[0]?.label || currentGoal[0]?.value || currentGoal[0] || "";
            } else if (typeof currentGoal === "object") {
              goalLabel = currentGoal.label || currentGoal.value || "";
            } else {
              goalLabel = currentGoal;
            }
          }
          if (goalLabel && allActivitiesMap && allActivitiesMap[goalLabel] && allActivitiesMap[goalLabel].length > 0) {
            // Goal is selected and we have activities - use filtered activities
            return { ...cell, options: allActivitiesMap[goalLabel] };
          }
          // Goal not selected or no activities - keep original options from backend
          return cell;
        }
        return cell;
      });
    });
    setRows(filteredRows);
  }, [data, allGoalsMap, allActivitiesMap]);

  // --------------------- Field Change Handler ---------------------
  const handleFieldChange = async (rowIndex, newField) => {
    const newRows = rows.map((r, idx) => {
      if (idx !== rowIndex) return r;
      // Create a new row array to ensure React detects the change
      return r.map(cell => ({ ...cell }));
    });
    const row = newRows[rowIndex];

    // Extract field label from newField (for single-select, it should be a string or object, not array)
    let fieldLabel = "";
    if (Array.isArray(newField)) {
      // If it's an array, take the first item (shouldn't happen for single-select, but handle it)
      fieldLabel = newField[0]?.label || newField[0]?.value || newField[0] || "";
    } else if (typeof newField === "object" && newField !== null) {
      // If it's an object, extract label or value
      fieldLabel = newField.label || newField.value || "";
    } else {
      // If it's a string, use it directly
      fieldLabel = newField || "";
    }

    console.log("Field changed to:", fieldLabel, "allGoalsMap:", allGoalsMap);

    // Find the field cell (first column)
    const fieldCell = row[0];
    if (fieldCell) {
      fieldCell.value = fieldLabel;
    }

    // If field is empty, clear goals and activities
    if (!fieldLabel || fieldLabel === "") {
      row.forEach((cell, cellIndex) => {
        if (cell.type === "dropdown") {
          if (cell.title === "מטרות ויעדים מדידים" || cell.title === "השותפים ופעולות לקידום המטרה") {
            row[cellIndex] = {
              ...cell,
              options: [],
              value: ""
            };
          }
        }
      });
      setRows(newRows);
      return; // Don't save to backend if field is empty
    }

    // First, try to get goals from allGoalsMap or other rows
    let goals = allGoalsMap?.[fieldLabel] || [];
    
    console.log("Looking for goals for field:", fieldLabel, "allGoalsMap:", allGoalsMap, "found goals:", goals);
    
    // If no goals found, try to find them from another row with the same field
    if (goals.length === 0 && rows.length > 0) {
      for (let otherRow of rows) {
        const otherFieldCell = otherRow.find((c) => c.title === "תחום תפקוד");
        let otherFieldLabel = "";
        if (otherFieldCell?.value) {
          if (Array.isArray(otherFieldCell.value)) {
            otherFieldLabel = otherFieldCell.value[0] || "";
          } else if (typeof otherFieldCell.value === "object") {
            otherFieldLabel = otherFieldCell.value.label || otherFieldCell.value.value || "";
          } else {
            otherFieldLabel = otherFieldCell.value;
          }
        }
        
        if (otherFieldLabel === fieldLabel) {
          const otherGoalsCell = otherRow.find((c) => c.title === "מטרות ויעדים מדידים");
          if (otherGoalsCell?.options && otherGoalsCell.options.length > 0) {
            goals = [...otherGoalsCell.options]; // Create a copy
            // Update allGoalsMap for future use
            if (allGoalsMap) {
              allGoalsMap[fieldLabel] = goals;
            }
            console.log("Found goals from another row:", goals);
            break;
          }
        }
      }
    }

    // Update goals and activities based on the selected field
    row.forEach((cell, cellIndex) => {
      if (cell.type === "dropdown") {
        // Map Goals and Activities dynamically based on the first column value
        if (cell.title === "מטרות ויעדים מדידים") {
          console.log("Final goals for field", fieldLabel, ":", goals);
          
          // Always update options, even if empty (this clears old goals)
          // Create a new cell object to ensure React detects the change
          console.log("Updating goals cell with options:", goals, "for field:", fieldLabel, "goals length:", goals.length);
          // If no goals found yet, keep original options from backend (don't clear them)
          const finalGoals = goals.length > 0 ? goals : (cell.options || []);
          row[cellIndex] = {
            ...cell,
            options: finalGoals,
            value: finalGoals.length > 0 
              ? (finalGoals[0].value || finalGoals[0].label || "")
              : ""
          };
          console.log("Goals cell updated - final options:", finalGoals.length, "options");
        } else if (cell.title === "השותפים ופעולות לקידום המטרה") {
          // Activities are mapped by goal, so we need to get the current goal first
          const goalCell = row.find((c) => c.title === "מטרות ויעדים מדידים");
          const currentGoal = goalCell?.value || "";
          // Get activities for the selected goal (activities are mapped by goal label)
          const goalLabel = Array.isArray(currentGoal) 
            ? (currentGoal[0]?.label || currentGoal[0]?.value || currentGoal[0])
            : (typeof currentGoal === "object" ? (currentGoal.label || currentGoal.value) : currentGoal);
          const activities = allActivitiesMap?.[goalLabel] || [];
          // Create a new cell object to ensure React detects the change
          row[cellIndex] = {
            ...cell,
            options: activities,
            value: activities.length > 0 
              ? (activities[0].value || activities[0].label || "")
              : ""
          };
        }
      }
    });

    setRows(newRows);

    // Save to backend so it regenerates cells with correct goals for the new field
    // This ensures goals are always correct even for fields that don't exist in other rows
    if ((tableName === "תכנית חינוכית יחידנית" || tableName === "תוכנית לימודית אישית") && std_id) {
      try {
        const tableDataToSave = newRows;
        const response = await fetch(`http://127.0.0.1:5000/save_table`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            std_id: std_id,
            table_name: tableName,
            table_data: tableDataToSave,
            direction: "horizontal"
          })
        });
        
        if (response.ok) {
          // Reload table data to get updated goals from backend
          const loadResponse = await fetch(`http://127.0.0.1:5000/load?id=${std_id}`);
          const updatedTables = await loadResponse.json();
          const updatedTable = updatedTables.find((t) => t.table_name === tableName);
          if (updatedTable && updatedTable.cells && updatedTable.cells.length > rowIndex) {
            const updatedRow = updatedTable.cells[rowIndex];
            // Update the row with backend-generated goals
            const updatedFieldCell = updatedRow.find((c) => c.title === "תחום תפקוד");
            let updatedFieldLabel = fieldLabel;
            if (updatedFieldCell?.value) {
              if (Array.isArray(updatedFieldCell.value)) {
                updatedFieldLabel = updatedFieldCell.value[0] || fieldLabel;
              } else if (typeof updatedFieldCell.value === "object") {
                updatedFieldLabel = updatedFieldCell.value.label || updatedFieldCell.value.value || fieldLabel;
              } else {
                updatedFieldLabel = updatedFieldCell.value || fieldLabel;
              }
            }
            
            // Get goals from backend response (backend generates correct goals for the field)
            const backendGoalsCell = updatedRow.find((c) => c.title === "מטרות ויעדים מדידים");
            const backendGoals = backendGoalsCell?.options || [];
            
            console.log("Backend returned goals for field", updatedFieldLabel, ":", backendGoals);
            
            // Update allGoalsMap with goals from backend
            if (allGoalsMap && backendGoals.length > 0) {
              allGoalsMap[updatedFieldLabel] = [...backendGoals];
              console.log("Updated allGoalsMap for field", updatedFieldLabel, ":", allGoalsMap[updatedFieldLabel]);
            }
            
            newRows[rowIndex] = updatedRow.map((cell, idx) => {
              if (cell.title === "מטרות ויעדים מדידים") {
                // Use goals from backend (they're already filtered for the selected field)
                return { ...cell, options: backendGoals };
              } else if (cell.title === "השותפים ופעולות לקידום המטרה") {
                // Activities should be filtered by goal, get from allActivitiesMap
                const goalCell = updatedRow.find((c) => c.title === "מטרות ויעדים מדידים");
                const currentGoal = goalCell?.value || "";
                let goalLabel = "";
                if (currentGoal) {
                  if (Array.isArray(currentGoal)) {
                    goalLabel = currentGoal[0]?.label || currentGoal[0]?.value || currentGoal[0] || "";
                  } else if (typeof currentGoal === "object") {
                    goalLabel = currentGoal.label || currentGoal.value || "";
                  } else {
                    goalLabel = currentGoal;
                  }
                }
                const backendActivitiesCell = updatedRow.find((c) => c.title === "השותפים ופעולות לקידום המטרה");
                const backendActivities = backendActivitiesCell?.options || [];
                
                // Update allActivitiesMap with activities from backend
                if (allActivitiesMap && goalLabel && backendActivities.length > 0) {
                  allActivitiesMap[goalLabel] = [...backendActivities];
                }
                
                return { ...cell, options: backendActivities };
              }
              return cell;
            });
            setRows([...newRows]);
          }
        }
      } catch (err) {
        console.error("Error saving table after field change:", err);
      }
    }
  };

  // --------------------- Render ---------------------
  return (
    <TableContainer>
      <AddRowBtn
        std_id={std_id}
        table_name={tableName}
        onRowAdded={(newRow) => {
          console.log("New row added:", newRow);
          if (newRow && newRow.cells) {
            setRows([...rows, newRow.cells]);
          } else if (newRow && Array.isArray(newRow)) {
            setRows([...rows, newRow]);
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
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                // Log cell.options for debugging, especially for "סוג איבחון"
                if (cell.type === "dropdown" && cell.title === "סוג איבחון") {
                  console.log("סוג איבחון - cell.options:", cell.options);
                  console.log("סוג איבחון - cell.options length:", cell.options?.length);
                  console.log("סוג איבחון - cell.options first item:", cell.options?.[0]);
                  console.log("סוג איבחון - cell.title:", cell.title);
                  console.log("סוג איבחון - cell.value:", cell.value);
                  console.log("סוג איבחון - tableName:", tableName);
                  console.log("סוג איבחון - colIndex:", colIndex);
                  console.log("סוג איבחון - will use allFields?", colIndex === 0 && (tableName === "תכנית חינוכית יחידנית" || tableName === "תוכנית לימודית אישית") && allFields);
                  console.log("סוג איבחון - will use cell.options?", !(colIndex === 0 && (tableName === "תכנית חינוכית יחידנית" || tableName === "תוכנית לימודית אישית") && allFields));
                }
                
                return (
                  <Td key={colIndex}>
             {colIndex === 0 && (tableName === "תכנית חינוכית יחידנית" || tableName === "תוכנית לימודית אישית") && allFields ? (
               <HandleCell
                 type="dropdown"
                 value={Array.isArray(cell.value) ? cell.value[0] : cell.value} // Ensure single value, not array
                 options={allFields}
                 onChange={(val) => {
                   console.log("FIELD DROPDOWN onChange - received:", val, "type:", typeof val, "isArray:", Array.isArray(val));
                   handleFieldChange(rowIndex, val);
                 }}
                 isMulti={false} // Field dropdown is single-select
               />
             ) : (
                      <HandleCell
                        type={cell.type}
                        value={cell.value}
                        options={cell.options}
                        onChange={(val) => {
                          const newRows = [...rows];
                          newRows[rowIndex][colIndex].value = val;
                          
                          // If goal changed, update activities
                          if (cell.title === "מטרות ויעדים מדידים" && (tableName === "תכנית חינוכית יחידנית" || tableName === "תוכנית לימודית אישית")) {
                            const goalValue = Array.isArray(val) ? val[0] : val;
                            const goalLabel = typeof goalValue === "object" ? (goalValue.label || goalValue.value) : goalValue;
                            const activitiesCell = newRows[rowIndex].find((c) => c.title === "השותפים ופעולות לקידום המטרה");
                            if (activitiesCell && allActivitiesMap) {
                              const activities = allActivitiesMap[goalLabel] || [];
                              activitiesCell.options = activities;
                              if (activities.length > 0 && !activities.find((o) => (o.value || o.label) === activitiesCell.value)) {
                                activitiesCell.value = activities[0].value || activities[0].label || "";
                              } else if (activities.length === 0) {
                                activitiesCell.value = "";
                              }
                            }
                          }
                          
                          setRows(newRows);
                        }}
                      />
                    )}
                  </Td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default HorizontalTable;
