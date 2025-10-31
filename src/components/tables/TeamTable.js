import React from "react";
import HorizontalTable from "./HorizontalTable";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 2rem;
  direction: rtl;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 0.5rem;
  color: #1a4b7a;
`;

const TeamTable = ({ table_name, columns, rows }) => {
  if (!rows || rows.length === 0) return null;

  return (
    <Wrapper>
      <Title>{table_name}</Title>
      <HorizontalTable columns={columns} rows={rows} />
    </Wrapper>
  );
};

export default TeamTable;
