import React from "react";
import HorizontalTable from "./tables/HorizontalTable";
import VerticalTable from "./tables/VerticalTable";
import styled from "styled-components";

// ✅ Wrapper for each table
const Wrapper = styled.div`
  margin-bottom: 2rem;
  direction: rtl;
`;

// ✅ Table title styling
const Title = styled.h3`
  text-align: center;
  margin-bottom: 0.2rem;
  color: #1a4b7a;
`;

// ✅ Table description styling
const Description = styled.p`
  text-align: center;
  font-style: italic;
  color: #505050;
  margin-bottom: 0.5rem;
`;

const TableSection = ({ tableData }) => {
  if (!tableData) return null;

  const {
    table_name,
    description,
    titles = [],
    data = [],
    direction = "horizontal", // <- use this to determine table layout
  } = tableData;

  if (!table_name && (!data || data.length === 0)) return null;

  return (
    <Wrapper>
      {table_name && <Title>{table_name}</Title>}
      {description && <Description>{description}</Description>}

      {direction === "vertical" ? (
        <VerticalTable table={{ titles, data }} />
      ) : (
        <HorizontalTable table={{ titles, data }} />
      )}
    </Wrapper>
  );
};

export default TableSection;
