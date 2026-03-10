import { Link } from "react-router-dom";

export function HeaderLink({ children, to }) {
  return (
    <h2 className="text-xl font-normal">
      <Link to={to} className="text-black transition-colors">
        {children}
      </Link>
    </h2>
  );
}
