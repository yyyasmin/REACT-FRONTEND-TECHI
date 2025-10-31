import React from "react";
import styled from "styled-components";

// ---------- Styled Components ----------
const TableContainer = styled.div`
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  font-size: 15px;
  background-color: #fff;
`;

const TH = styled.th`
  padding: 10px;
  text-align: center;
  border: 1px solid #ccc;
  font-weight: bold;
  background-color: ${(props) => (props.isEvenCol ? "#70a0d6" : "#8bb8e8")};
  color: white;
`;

const TD = styled.td`
  padding: 8px;
  text-align: center;
  border: 1px solid #ccc;
  background-color: ${(props) =>
    props.isEvenRow
      ? props.isEvenCol
        ? "#f0f6ff"
        : "#e7f0ff"
      : props.isEvenCol
      ? "#f9fbff"
      : "#eef5ff"};
`;

// ---------- Component ----------
const HorizontalTable = ({ table }) => {
  if (!table || !table.data || !Array.isArray(table.data)) {
    return <div>לא נמצא מידע להצגה</div>;
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            {table.titles &&
              table.titles.map((title, colIndex) => (
                <TH key={colIndex} isEvenCol={colIndex % 2 === 0}>
                  {title}
                </TH>
              ))}
          </tr>
        </thead>
        <tbody>
          {table.data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <TD
                  key={colIndex}
                  isEvenRow={rowIndex % 2 === 0}
                  isEvenCol={colIndex % 2 === 0}
                >
                  {cell || "-"}
                </TD>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default HorizontalTable;
