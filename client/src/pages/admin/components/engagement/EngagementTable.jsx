import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AdminTable } from "../AdminTable";

export function EngagementTable(props) {
  return (
    <AdminTable
      {...props}
      responsiveCards
      className={`engagement-table ${props.className || ""}`}
    />
  );
}

export function RecordLink({ to, children, state }) {
  return (
    <Link className="engagement-record-link" to={to} state={state}>
      <span>{children}</span>
      <ArrowUpRight size={15} aria-hidden="true" />
    </Link>
  );
}
