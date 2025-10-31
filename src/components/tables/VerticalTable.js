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
  width: 35%;
  padding: 8px;
  text-align: right;
  border: 1px solid #ccc;
  font-weight: bold;
  background-color: ${(props) => (props.isEvenRow ? "#70a0d6" : "#8bb8e8")};
  color: white;
`;

const TD = styled.td`
  width: 65%;
  padding: 8px;
  text-align: right;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.isEvenRow ? "#f0f6ff" : "#eef5ff")};
`;

// ---------- Component ----------
const VerticalTable = ({ table }) => {
  if (!table || !table.data || !Array.isArray(table.data)) {
    return <div>לא נמצא מידע להצגה</div>;
  }

  return (
    <TableContainer>
      <Table>
        <tbody>
          {table.data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <TH isEvenRow={rowIndex % 2 === 0}>
                {Array.isArray(row) ? row[0] : `שדה ${rowIndex + 1}`}
              </TH>
              <TD isEvenRow={rowIndex % 2 === 0}>
                {Array.isArray(row) ? row.slice(1).join(", ") : row || "-"}
              </TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default VerticalTable;
