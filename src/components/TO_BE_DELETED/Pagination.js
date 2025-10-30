import React from "react";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 0"
  },
  button: {
    background: "#4caf50",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    margin: "0 5px",
    cursor: "pointer"
  },
  disabled: { backgroundColor: "#ccc", cursor: "not-allowed" },
  label: { margin: "0 10px" }
};

export default function Pagination({ currentPage, totalPages, onNext, onPrev }) {
  return React.createElement(
    "div",
    { style: styles.container },
    React.createElement(
      "button",
      {
        style: currentPage === 0
          ? { ...styles.button, ...styles.disabled }
          : styles.button,
        onClick: onPrev,
        disabled: currentPage === 0
      },
      "⬅️ הקודם"
    ),
    React.createElement(
      "span",
      { style: styles.label },
      "עמוד ",
      currentPage + 1,
      " מתוך ",
      totalPages
    ),
    React.createElement(
      "button",
      {
        style: currentPage === totalPages - 1
          ? { ...styles.button, ...styles.disabled }
          : styles.button,
        onClick: onNext,
        disabled: currentPage === totalPages - 1
      },
      "הבא ➡️"
    )
  );
}
