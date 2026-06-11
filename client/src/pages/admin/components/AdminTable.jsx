import "../Admin.scss";

export function AdminTable({ columns, rows, renderRow, className = "" }) {
  return (
    <div className={`admin-table-wrapper ${className}`.trim()}>
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
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}
