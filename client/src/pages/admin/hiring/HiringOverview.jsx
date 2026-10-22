import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Inbox, Timer } from "lucide-react";
import { AdminCard } from "../components/AdminCard";
import { SectionHeader } from "../components/SectionHeader";
import { eligibility } from "../../../../../shared/engagement.mjs";
import { applicationStatuses } from "./engagementLabels";
import { EngagementHeading as HiringHeading, EmptyState } from "../components/engagement/EngagementPrimitives";
import { EngagementTable, RecordLink } from "../components/engagement/EngagementTable";
import { formatSubmissionDate, getHiringStats } from "./hiring.utils";

export function HiringOverview({ data, base }) {
  const stats = getHiringStats(data);
  const [now] = useState(() => Date.now());
  const recentNew = data.applications.filter(
    (item) =>
      item.application_status === "new" &&
      now - new Date(item.createdAt).getTime() <= 7 * 86400000,
  ).length;
  const reviewing = data.applications.filter(
    (item) => item.application_status === "in_review",
  );
  const oldest = reviewing.length
    ? Math.max(
        0,
        ...reviewing.map((item) =>
          Math.floor(
            (now - new Date(item.createdAt).getTime()) /
              86400000,
          ),
        ),
      )
    : 0;
  const accepting = data.vacancies.filter(
    (item) =>
      item.publication_status === "published" &&
      !eligibility(data.settings, "team", item),
  ).length;
  const recent = [...data.applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  return (
    <>
      <HiringHeading
        title="Hiring"
        description="Keep track of new candidates and the roles you’re hiring for."
      />
      {(!data.settings.navigation.careers ||
        !data.settings.hiring.global_enabled) && (
        <p className="hiring-notice">
          {!data.settings.navigation.careers
            ? "The public Careers section is disabled. Existing candidates remain available."
            : "New applications are paused. Existing candidates remain available."}{" "}
          <Link to={`${base}/settings`}>Manage availability</Link>
        </p>
      )}
      <div className="hiring-kpis">
        <Link to={`${base}/applications?status=new`}>
          <span className="hiring-kpi-label">
            <Inbox size={17} aria-hidden="true" />
            New applications
          </span>
          <strong>{stats.newApplications}</strong>
          <span className="hiring-kpi-context">
            {recentNew} received in the last 7 days
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
        <Link to={`${base}/applications?status=in_review`}>
          <span className="hiring-kpi-label">
            <Timer size={17} aria-hidden="true" />
            In review
          </span>
          <strong>{stats.inReview}</strong>
          <span className="hiring-kpi-context">
            {reviewing.length
              ? `Oldest received ${oldest} ${oldest === 1 ? "day" : "days"} ago`
              : "No candidates waiting"}
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
        <Link to={`${base}/vacancies?status=published`}>
          <span className="hiring-kpi-label">
            <BriefcaseBusiness size={17} aria-hidden="true" />
            Published vacancies
          </span>
          <strong>{stats.published}</strong>
          <span className="hiring-kpi-context">
            {accepting} accepting applications
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
      </div>
      <AdminCard>
        <div className="hiring-section-heading">
          <SectionHeader title="Recent applications" />
          <Link className="engagement-text-link" to={`${base}/applications`}>
            View all candidates
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {recent.length ? (
          <EngagementTable
            columns={["Candidate", "Role", "Submitted", "Status"]}
            rows={recent}
            renderRow={(item) => (
              <tr key={item._id}>
                <td className="admin-table__cell">
                  <RecordLink to={`${base}/applications/${item._id}`}>
                    {item.applicant_name}
                  </RecordLink>
                </td>
                <td className="admin-table__cell">{item.vacancy_title}</td>
                <td className="admin-table__cell hiring-date">
                  {formatSubmissionDate(item.createdAt)}
                </td>
                <td className="admin-table__cell">
                  <span
                    className={`hiring-badge hiring-badge--${item.application_status}`}
                  >
                    {applicationStatuses[item.application_status]}
                  </span>
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState
            title="No applications yet"
            description="New candidates will appear here when they apply."
          >
            <Link className="engagement-text-link" to={`${base}/vacancies`}>
              View vacancies
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </EmptyState>
        )}
      </AdminCard>
    </>
  );
}
