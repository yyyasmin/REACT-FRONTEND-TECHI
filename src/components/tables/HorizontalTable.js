import React, { useState } from "react";
import styled from "styled-components";
import HandleCell from "./cells/HandleCell";
import AddRowBtn from "./AddRowBtn";

// --------------------- Styled Components ---------------------
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

// --------------------- HorizontalTable Component ---------------------
const HorizontalTable = ({ headers, data, tableName, std_id, allFields, allGoalsMap, allActivitiesMap }) => {
  // --------------------- State ---------------------
  const [rows, setRows] = useState(data.map((row) => row.cells));

  // --------------------- Field Change Handler ---------------------
  const handleFieldChange = (rowIndex, newField) => {
    const newRows = [...rows];
    const row = newRows[rowIndex];

    row.forEach((cell) => {
      if (cell.type === "dropdown") {
        // --------------------- CHANGES HERE ---------------------
        // Map Goals and Activities dynamically based on the first column value
        if (cell.title === "מטרות ויעדים מדידים") {
          cell.options = allGoalsMap[newField] || [];
        } else if (cell.title === "השותפים ופעולות לקידום המטרה") {
          cell.options = allActivitiesMap[newField] || [];
        }
        // --------------------- END CHANGES ---------------------

        // Preserve existing value if it's still valid; otherwise take the first option
        if (!cell.options.find((o) => o.value === cell.value)) {
          cell.value = cell.options.length ? cell.options[0].value : "";
        }
      }
    });

    setRows(newRows);
  };

  // --------------------- Render ---------------------
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
                  console.log("סוג איבחון - will use allFields?", colIndex === 0 && tableName === "תכנית חינוכית יחידנית" && allFields);
                  console.log("סוג איבחון - will use cell.options?", !(colIndex === 0 && tableName === "תכנית חינוכית יחידנית" && allFields));
                }
                
                return (
                  <Td key={colIndex}>
                    {colIndex === 0 && tableName === "תכנית חינוכית יחידנית" && allFields ? (
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
