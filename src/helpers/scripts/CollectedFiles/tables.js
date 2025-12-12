
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


