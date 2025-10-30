import React from "react";
import styled from "styled-components";

const NavDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 0 4px;
`;

const Navigation = ({ currentIndex, total, onNext, onPrev, onSave }) => {
  return (
    <NavDiv>
      <Button onClick={onPrev} disabled={currentIndex === 0}>הקודם</Button>
      <Button onClick={onNext} disabled={currentIndex === total - 1}>הבא</Button>
      <Button onClick={onSave}>שמור</Button>
    </NavDiv>
  );
};

export default Navigation;
