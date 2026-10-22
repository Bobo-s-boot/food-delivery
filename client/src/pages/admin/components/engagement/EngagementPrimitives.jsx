import { Fragment, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function EngagementHeading({ title, description, children }) {
  return (
    <header className="hiring-heading admin-page-heading">
      <div className="admin-page-intro admin-page-intro--nested">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="hiring-actions admin-page-heading__actions">{children}</div>}
    </header>
  );
}
export function AdminDataState({ resource, children }) {
  if (!resource.data)
    return resource.error ? (
      <div className="hiring-notice" role="alert">
        {resource.error}{" "}
        <button type="button" onClick={resource.reload}>
          Try again
        </button>
      </div>
    ) : (
      <p role="status">Loading workspace…</p>
    );
  return (
    <>
      {!resource.data.intakeReady && (
        <div className="hiring-notice">
          New submissions are currently unavailable. Existing records can still
          be reviewed.
        </div>
      )}
      {resource.error && (
        <p className="hiring-notice" role="alert">
          {resource.error}{" "}
          <button type="button" data-admin-navigation onClick={resource.reload}>
            Try again
          </button>
        </p>
      )}
      <Fragment key={resource.generation}>{children}</Fragment>
    </>
  );
}
export function ConfirmationDialog({
  title,
  description,
  action,
  onConfirm,
  onClose,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      opener?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="hiring-dialog"
      aria-labelledby="hiring-confirm-title"
      aria-describedby="hiring-confirm-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <h2 id="hiring-confirm-title">{title}</h2>
      <p id="hiring-confirm-description">{description}</p>
      <div className="hiring-actions">
        <button type="button" autoFocus onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="is-danger" onClick={onConfirm}>
          {action}
        </button>
      </div>
    </dialog>
  );
}
export function EmptyState({ title, description, children }) {
  return (
    <div className="hiring-empty">
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function PageControls({ page, total, onChange, size = 15 }) {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <nav className="hiring-pagination" aria-label="List pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
export function BackLink({ to, children }) {
  return (
    <Link className="hiring-back" to={to}>
      <ArrowLeft size={17} aria-hidden="true" />
      {children}
    </Link>
  );
}
