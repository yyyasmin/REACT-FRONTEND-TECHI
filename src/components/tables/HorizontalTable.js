import React from "react";
import styled from "styled-components";
import DropdownCell from "./DropdownCell";

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

const HorizontalTable = ({ title, headers = [], data = [] }) => {
  if (!data) return null;

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
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Td key={colIndex}>
                  <DropdownCell
                    value={cell.value}
                    type={cell.type}
                    options={cell.options || []}
                    onChange={(val) => (data[rowIndex][colIndex].value = val)}
                  />
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
