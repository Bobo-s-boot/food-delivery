import {
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  FileText,
  Users,
  Settings2,
  CircleHelp,
} from "lucide-react";
import { getAdminBasePath } from "../../admin.routes";
import { HiringHelpContext } from "../HiringHelpContext";
import { useHiringNotification } from "../HiringNotificationContext";

// Compatibility exports; shared presentation is owned by the neutral admin components.
export {
  AdminDataState,
  BackLink,
  ConfirmationDialog,
  EmptyState,
  EngagementHeading as HiringHeading,
  PageControls,
} from "../../components/engagement/EngagementPrimitives";

const sections = [
  ["", "Overview", LayoutDashboard],
  ["vacancies", "Vacancies", FileText],
  ["applications", "Candidates", Users],
  ["settings", "Settings", Settings2],
];
export function HiringSidebar() {
  const { pathname } = useLocation();
  const base = `${getAdminBasePath(pathname)}/hiring`;
  return (
    <aside className="hiring-sidebar">
      <div className="hiring-sidebar__title">
        <BriefcaseBusiness size={20} aria-hidden="true" />
        Hiring
      </div>
      <nav aria-label="Hiring">
        {sections.map(([path, label], index) => {
          const Icon = sections[index][2];
          return (
            <Link
              key={label}
              to={`${base}${path ? `/${path}` : ""}`}
              aria-current={
                (
                  path
                    ? pathname === `${base}/${path}`
                    : pathname === base || pathname === `${base}/`
                )
                  ? "page"
                  : undefined
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <Link
        className="hiring-sidebar__public"
        to="/careers"
        target="_blank"
        rel="noopener noreferrer"
      >
        View careers page ↗
      </Link>
    </aside>
  );
}
export function AdminField({ name, label, error, children, helper }) {
  const hoverHelp = useContext(HiringHelpContext);
  const describedBy = isValidElement(children)
    ? [
        ...new Set(
          [
            children.props["aria-describedby"],
            helper ? `${name}-help` : undefined,
            error ? `${name}-error` : undefined,
          ].filter(Boolean),
        ),
      ].join(" ")
    : "";
  return (
    <div className="hiring-field">
      <div className="hiring-field__label-row">
        <label htmlFor={name}>{label}</label>
        {helper && (hoverHelp ? <HiringHint id={`${name}-help`} label={label}>{helper}</HiringHint> : (
          <details className="hiring-field__help">
            <summary aria-label={`Help for ${label}`}>
              <CircleHelp size={15} aria-hidden="true" />
            </summary>
            <small id={`${name}-help`}>{helper}</small>
          </details>
        ))}
      </div>
      {isValidElement(children)
        ? cloneElement(children, {
            "aria-describedby": describedBy || undefined,
            "aria-invalid": error ? true : children.props["aria-invalid"],
          })
        : children}
      {error && (
        <span className="hiring-field__error" id={`${name}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
export function HiringHint({ id, label, children }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const tooltip = useRef(null);
  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const box = root.current?.getBoundingClientRect(), tip = tooltip.current;
      if (!box || !tip) return;
      const width = Math.min(320, window.innerWidth - 32);
      Object.assign(tip.style, { position: "fixed", width: width + "px", right: "auto", left: Math.max(16, Math.min(box.left, window.innerWidth - width - 16)) + "px", top: box.bottom + "px", overflowWrap: "anywhere" });
      if (tip.getBoundingClientRect().bottom > window.innerHeight - 16)
        tip.style.top = Math.max(16, box.top - tip.offsetHeight) + "px";
    };
    position(); window.addEventListener("resize", position); window.addEventListener("scroll", position, true);
    return () => { window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return <span ref={root} className="hiring-hover-help"
    onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); } }}>
    <button type="button" aria-label={`Help for ${label}`} aria-expanded={open} aria-describedby={open ? id : undefined}
      onFocus={() => setOpen(true)} onClick={() => setOpen(true)}>
      <CircleHelp size={15} aria-hidden="true" />
    </button>
    {open && <small ref={tooltip} role="tooltip" id={id}>{children}</small>}
  </span>;
}
export function MutationFeedback({ feedback, onReload }) {
  const notify = useHiringNotification();
  useEffect(() => {
    if (feedback && notify) notify({ tone: feedback.error ? "error" : "success", title: feedback.error ? "Changes could not be saved" : ({ "Status updated.": "Candidate status updated", "Note added to the follow-up log.": "Note added", "Contact recorded in the follow-up log.": "Contact recorded" })[feedback.message] || feedback.message.replace(/\.$/, ""), description: feedback.error ? feedback.message : "" });
  }, [feedback, notify]);
  if (!feedback || (notify && !feedback.conflict)) return null;
  return (
    <div className="hiring-notice" role={feedback.error ? "alert" : "status"}>
      {feedback.message}
      {feedback.conflict && onReload && (
        <button type="button" data-admin-navigation onClick={onReload}>
          Load latest data
        </button>
      )}
    </div>
  );
}
