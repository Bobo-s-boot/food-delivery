import { useLayoutEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAdminBasePath } from "../admin.routes";
import { useAdminEngagement } from "../hiring/useAdminEngagement";
import { AdminDataState, EngagementHeading as HiringHeading } from "../components/engagement/EngagementPrimitives";
import { PartnershipAvailability } from "../hiring/components/PartnershipAvailability";
import { ApplicationDetails } from "../hiring/ApplicationDetails";
import { PartnershipList } from "./PartnershipList";
import "../hiring/Hiring.scss";

export function AdminPartnerships() {
  const resource = useAdminEngagement();
  const id = useParams()["*"];
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);
  const location = useLocation();
  const base = `${getAdminBasePath(location.pathname)}/partnerships`;
  const saveRecord = (saved) =>
    resource.setData((current) => ({
      ...current,
      partnerships: current.partnerships.map((item) =>
        item._id === saved._id ? saved : item,
      ),
    }));
  const record = resource.data?.partnerships.find((item) => item._id === id);
  return (
    <section className="engagement-admin restaurant-applications" lang="en">
      <AdminDataState resource={resource}>
        {resource.data &&
          (id ? (
            record ? (
              <ApplicationDetails
                key={id}
                record={record}
                base={base}
                partnership
                onSaved={saveRecord}
                onReload={resource.reload}
              />
            ) : (
              <p className="hiring-notice">
                Inquiry not found. <Link to={base}>Back to inquiries</Link>
              </p>
            )
          ) : (
            <>
              <HiringHeading
                title="Restaurant inquiries"
                description="Review potential restaurant partners and keep the next step clear."
              />
              <PartnershipAvailability
                settings={resource.data.settings}
                onSaved={(settings) =>
                  resource.setData((current) => ({ ...current, settings }))
                }
                onReload={resource.reload}
              />
              <PartnershipList data={resource.data} base={base} />
            </>
          ))}
      </AdminDataState>
    </section>
  );
}
