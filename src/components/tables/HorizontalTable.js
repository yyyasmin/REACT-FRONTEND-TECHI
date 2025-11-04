import React from "react";
import DropdownCell from "./DropdownCell";
import styled from "styled-components";

const TableContainer = styled.div`
  margin: 20px auto;
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  direction: rtl;
  overflow: hidden;
`;

const Title = styled.h3`
  text-align: center;
  padding: 10px;
  background-color: #e6f0ff;
  margin: 0;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
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

const HorizontalTable = ({ title, data = [], headers = [], dropdownOptions = {}, onDataChange }) => {
  const handleCellChange = (rowIndex, colKey, newValue) => {
    const updatedData = [...data];
    if (!updatedData[rowIndex]) updatedData[rowIndex] = {};
    if (Array.isArray(updatedData[rowIndex])) {
      updatedData[rowIndex][headers.indexOf(colKey)] = newValue;
    } else {
      updatedData[rowIndex][colKey] = newValue;
    }
    if (onDataChange) onDataChange(updatedData);
  };

  return (
    <TableContainer>
      {title && <Title>{title}</Title>}
      <Table>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <Th key={idx}>{header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((colKey, colIndex) => {
                const cell = Array.isArray(row) ? row[colIndex] : row[colKey];
                const cellValue = cell?.value ?? cell ?? "";
                const options = cell?.options ?? dropdownOptions[colKey] ?? [];
                const type =
                  cell?.type ||
                  (typeof cellValue === "boolean" || cellValue === "כן" || cellValue === "לא"
                    ? "checkbox"
                    : options.length > 0
                    ? "dropdown"
                    : "text");

                return (
                  <Td key={colIndex}>
                    <DropdownCell
                      value={cellValue}
                      options={options}
                      type={type}
                      onChange={(val) => handleCellChange(rowIndex, colKey, val)}
                    />
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
