import React from "react";
import styled from "styled-components";
import HorizontalTable from "./tables/HorizontalTable";
import VerticalTable from "./tables/VerticalTable";

const Section = styled.div`
  margin: 20px auto;
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: 18px;
  background-color: #f9f9fa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  width: 1200px;
  max-width: 95%;
  direction: rtl;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 12px;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #d0d8e0;
  padding-bottom: 6px;
  text-align: center;
`;

const TableSection = ({ table }) => {
  if (!table || !table.data) return null;

  return (
    <Section>
      <Title>{table.table_name}</Title>
      {table.direction === "horizontal" ? (
        <HorizontalTable
          title={table.table_name}
          headers={table.titles || []}
          data={table.data || []}
          dropdownOptions={table.dropdowns ?? {}}
        />
      ) : (
        <VerticalTable table={table} />
      )}
    </Section>
  );
};

export default TableSection;
