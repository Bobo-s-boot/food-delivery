import "../Admin.scss";
import { Children, cloneElement, isValidElement } from "react";

export function AdminTable({ columns, rows, renderRow, className = "", responsiveCards = false }) {
  return (
    <div className={`admin-table-wrapper ${responsiveCards ? "admin-table-wrapper--cards" : ""} ${className}`.trim()}>
      <table className="admin-table">
        <thead>
          <tr className="admin-table__header-row">
            {columns.map((column) => (
              <th key={column} className="admin-table__header-cell">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const rendered = renderRow(row, index);
            return responsiveCards && isValidElement(rendered)
              ? cloneElement(
                  rendered,
                  {},
                  Children.toArray(rendered.props.children).map((cell, cellIndex) =>
                    isValidElement(cell)
                      ? cloneElement(cell, { "data-label": columns[cellIndex] })
                      : cell,
                  ),
                )
              : rendered;
          })}
        </tbody>
      </table>
    </div>
  );
}
