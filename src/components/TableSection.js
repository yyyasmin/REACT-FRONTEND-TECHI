import React from "react";
import HorizontalTable from "./tables/HorizontalTable";
import HorizontalOneRowTable from "./tables/HorizontalOneRowTable";
import VerticalTable from "./tables/VerticalTable";

const TableSection = ({ tableData }) => {
  if (!tableData) return null;

  const {
    table_name,
    description,
    columns = [],
    rows = [],
    direction = "horizontal", // <-- NEW unified key
  } = tableData;

  // ✅ תחומי עניין וחוזקות stays horizontal
  if (table_name === "תחומי עניין וחוזקות" && rows.length > 0) {
    return (
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ textAlign: "center", marginBottom: "0.2rem" }}>{table_name}</h3>
        {description && (
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "#505050",
              marginBottom: "0.5rem",
            }}
          >
            {description}
          </p>
        )}
        <HorizontalTable columns={columns} rows={rows} />
      </div>
    );
  }

  // ✅ פרטים אישיים stays horizontal split
  if (table_name === "פרטים אישיים" && rows.length > 0) {
    const firstGroup = rows.slice(0, 6);
    const secondGroup = rows.slice(6);

    const firstColumns = firstGroup.map((r) => r[0]);
    const firstRow = firstGroup.map((r) => r[1]);

    const secondColumns = secondGroup.map((r) => r[0]);
    const secondRow = secondGroup.map((r) => r[1]);

    return (
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ textAlign: "center", marginBottom: "0.2rem" }}>{table_name}</h3>
        {description && (
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "#505050",
              marginBottom: "0.5rem",
            }}
          >
            {description}
          </p>
        )}
        <HorizontalOneRowTable columns={firstColumns} row={firstRow} />
        {secondGroup.length > 0 && (
          <>
            <h4 style={{ textAlign: "center", marginTop: "1rem", marginBottom: "0.5rem" }}>
              פרטי בית הספר
            </h4>
            <HorizontalOneRowTable columns={secondColumns} row={secondRow} />
          </>
        )}
      </div>
    );
  }

  // ✅ All other tables use direction from JSON
  return (
    <div style={{ marginBottom: "2rem" }}>
      {table_name && (
        <h3 style={{ textAlign: "center", marginBottom: "0.2rem" }}>{table_name}</h3>
      )}
      {description && (
        <p
          style={{
            textAlign: "center",
            fontStyle: "italic",
            color: "#505050",
            marginBottom: "0.5rem",
          }}
        >
          {description}
        </p>
      )}

      {direction === "vertical" ? (
        <VerticalTable rows={rows} />
      ) : rows.length === 1 ? (
        <HorizontalOneRowTable columns={columns} row={rows[0]} />
      ) : (
        <HorizontalTable columns={columns} rows={rows} />
      )}
    </div>
  );
};

export default TableSection;
