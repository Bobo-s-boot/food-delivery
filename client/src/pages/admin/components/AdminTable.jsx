export function AdminTable({
  columns,
  rows,
  renderRow,
  minWidth = "min-w-180",
}) {
  return (
    <div className="mt-4 w-full overflow-x-auto">
      <table
        className={`w-full ${minWidth} border-separate border-spacing-y-2 text-left text-sm`}
      >
        <thead>
          <tr className="text-xs uppercase tracking-[0.08em] text-[#7B8794]">
            {columns.map((column) => (
              <th key={column} className="px-3 pb-1 font-medium">
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
