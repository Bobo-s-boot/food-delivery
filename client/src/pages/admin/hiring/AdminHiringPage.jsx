import { useCallback, useLayoutEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAdminBasePath } from "../admin.routes";
import { useAdminEngagement } from "./useAdminEngagement";
import { HiringSidebar } from "./components/HiringPrimitives";
import { AdminDataState } from "../components/engagement/EngagementPrimitives";
import { HiringOverview } from "./HiringOverview";
import { HiringLists } from "./HiringLists";
import { VacancyEditor } from "./VacancyEditor";
import { HiringSettings } from "./HiringSettings";
import { ApplicationDetails } from "./ApplicationDetails";
import "./Hiring.scss";
import { HiringHelpContext } from "./HiringHelpContext";
import { HiringNotificationContext } from "./HiringNotificationContext";
import { AppToast } from "../../../components/toast/AppToast";
import "./HiringAdminUx.scss";

export function AdminHiringPage() {
  const [notification, setNotification] = useState(null);
  const notify = useCallback((value) => setNotification({ closeLabel: "Dismiss notification", ...value }), []);
  const dismiss = useCallback(() => setNotification(null), []);
  const resource = useAdminEngagement(true);
  const { pathname } = useLocation();
  const wildcard = useParams()["*"] || "";
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [wildcard]);
  const [view = "", id] = wildcard.split("/");
  const base = `${getAdminBasePath(pathname)}/hiring`;
  const onSaved = (collection, record) =>
    resource.setData((current) => ({
      ...current,
      [collection]:
        collection === "settings"
          ? record
          : current[collection].some((item) => item._id === record._id)
            ? current[collection].map((item) =>
                item._id === record._id ? record : item,
              )
            : [record, ...current[collection]],
    }));
  return (
    <HiringNotificationContext.Provider value={notify}><HiringHelpContext.Provider value={true}><div className="hiring-shell" lang="en">
      <HiringSidebar />
      <section className="hiring-content">
        <AdminDataState resource={resource}>
          {resource.data && (
            <HiringContent
              key={`${view}:${id || ""}`}
              view={view}
              id={id}
              data={resource.data}
              base={base}
              onSaved={onSaved}
              onReload={resource.reload}
            />
          )}
        </AdminDataState>
      </section>
    </div><AppToast notification={notification} onDismiss={dismiss} className="hiring-toast" /></HiringHelpContext.Provider></HiringNotificationContext.Provider>
  );
}
function HiringContent({ view, id, data, base, onSaved, onReload }) {
  if (!view) return <HiringOverview data={data} base={base} />;
  if (view === "settings")
    return (
      <HiringSettings
        data={data}
        onSaved={(record) => onSaved("settings", record)}
        onReload={onReload}
      />
    );
  if (view === "vacancies" && id)
    return (
      <VacancyEditor
        data={data}
        base={base}
        id={id}
        onSaved={(record) => onSaved("vacancies", record)}
        onReload={onReload}
      />
    );
  if (view === "applications" && id) {
    const record = data.applications.find((item) => item._id === id);
    return record ? (
      <ApplicationDetails
        record={record}
        base={`${base}/applications`}
        onSaved={(item) => onSaved("applications", item)}
        onReload={onReload}
      />
    ) : (
      <p className="hiring-notice">
        Application not found.{" "}
        <Link to={`${base}/applications`}>Back to candidates</Link>
      </p>
    );
  }
  if (["vacancies", "applications"].includes(view))
    return (
      <HiringLists
        data={data}
        base={base}
        candidates={view === "applications"}
      />
    );
  return (
    <p className="hiring-notice">
      Page not found. <Link to={base}>Hiring overview</Link>
    </p>
  );
}
