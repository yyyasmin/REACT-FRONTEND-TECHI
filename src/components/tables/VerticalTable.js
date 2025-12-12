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
                  {colIndex === 0 && (table?.table_name === "תכנית חינוכית יחידנית" || table?.table_name === "תוכנית לימודית אישית") && allFields ? (
                    <HandleCell
                      type="dropdown"
                      value={cell.value}
                      options={allFields}
                      onChange={(val) => handleFieldChange(rowIndex, val)}
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
