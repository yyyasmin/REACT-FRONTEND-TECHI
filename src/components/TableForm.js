import React from "react";
import DropdownCell from "./DropdownCell";

export default function TableForm({ table }) {
  if (!table) return null;

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>{table.table_name}</h3>
      {table.description && <p>{table.description}</p>}

      <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {table.columns.map((col, cIdx) => (
              <th key={cIdx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>
                  <DropdownCell
                    value={cell}
                    onChange={(val) => console.log("change", val)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
