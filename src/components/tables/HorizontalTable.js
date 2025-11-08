import React from "react";
import styled from "styled-components";
import DropdownCell from "./DropdownCell";

const TableContainer = styled.div`
  margin: 20px auto;
  width: 1200px;
  max-width: 95%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  direction: rtl;
  overflow-x: auto;
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
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  width: 100%;
`;

const HorizontalTable = ({ title, headers = [], data = [], tableName }) => {
  if (!data || !Array.isArray(data)) return null;

  const normalizeRow = (rowObj) => {
    // -------------------------------
    // FIRST THREE TABLES
    // -------------------------------
    if (rowObj.cells) {
      return rowObj.cells.map((cell) => ({
        value: cell.value,
        options: cell.options || [],
        type: cell.type || "text",
        title: cell.title,
      }));
    }

    // -------------------------------
    // PERSONAL EDUCATION TABLE
    // -------------------------------
    if (tableName === "תכנית חינוכית יחידנית") {
      return [
        { title: "תחום תפקוד", value: rowObj.field || "", type: "text" },
        { title: "תפקוד נוכחי", value: rowObj.current_function || "", type: "text" },
        {
          title: "מטרות ויעדים מדידים",
          value: rowObj.goals?.value || "",
          options: rowObj.goals?.options || [],
          type: "dropdown",
        },
        {
          title: "השותפים ופעולות לקידום המטרה",
          value: rowObj.partners?.value || "",
          options: rowObj.partners?.options || [],
          type: "dropdown",
        },
        { title: "הערכה מעצבת", value: rowObj.assessment || "", type: "text" },
      ];
    }

    return [];
  };

  return (
    <TableContainer>
      {title && <Title>{title}</Title>}
      <Table>
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <Th key={idx}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((rowObj, rowIndex) => {
            const normalizedRow = normalizeRow(rowObj);

            return (
              <tr key={rowIndex}>
                {normalizedRow.map((cell, colIndex) => (
                  <Td key={colIndex}>
                    <DropdownCell
                      value={cell.value}
                      options={cell.options || []}
                      type={cell.type || "text"}
                      onChange={(val) => {
                        // -------------------------------
                        // FIRST THREE TABLES
                        // -------------------------------
                        if (rowObj.cells) {
                          rowObj.cells[colIndex].value = val;
                        }

                        // -------------------------------
                        // PERSONAL EDUCATION TABLE
                        // -------------------------------
                        else if (tableName === "תכנית חינוכית יחידנית") {
                          if (colIndex === 2) rowObj.goals.value = val;
                          if (colIndex === 3) rowObj.partners.value = val;
                        }
                      }}
                    />
                  </Td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default HorizontalTable;
