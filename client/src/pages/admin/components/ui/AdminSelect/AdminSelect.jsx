import chevronRight from "../../../../../assets/chevron-right.svg";
import "./AdminSelect.scss";

export function AdminSelect({
  children,
  className = "",
  size = "default",
  fluid = false,
  ...props
}) {
  const sizeClass = `admin-select--${size}`;
  const fluidClass = fluid ? "admin-select--fluid" : "";

  return (
    <span
      className={`admin-select ${sizeClass} ${fluidClass} ${className}`.trim()}
    >
      <select className="admin-select__control" {...props}>
        {children}
      </select>
      <img
        className="admin-select__icon"
        src={chevronRight}
        alt=""
        aria-hidden="true"
      />
    </span>
  );
}
