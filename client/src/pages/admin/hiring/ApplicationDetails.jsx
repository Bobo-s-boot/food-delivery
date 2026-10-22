import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AdminCard } from "../components/AdminCard";
import { saveHiringApplication, savePartnershipInquiry, engagementError } from "../../../api/engagementService";
import { useUnsavedChanges } from "../../../features/engagement/useUnsavedChanges";
import { MutationFeedback } from "./components/HiringPrimitives";
import { BackLink, EngagementHeading as HiringHeading } from "../components/engagement/EngagementPrimitives";
import { RecordContactCard, RecordSubmissionCard, RecordReviewCard } from "../components/engagement/RecordDetails";
import { FollowUpComposer, RecordActivity } from "../components/engagement/RecordFollowUp";
import { applicationStatuses, partnershipStatuses, adminMessage, unsavedMessage } from "./engagementLabels";
import { formatDate, getApplicationActivity } from "./hiring.utils";

export function ApplicationDetails({
  record,
  base,
  partnership = false,
  onSaved,
  onReload,
}) {
  const [saved, setSaved] = useState(record);
  const [status, setStatus] = useState(
    partnership ? record.status : record.application_status,
  );
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [entryType, setEntryType] = useState("note");
  const [channel, setChannel] = useState("email");
  const [body, setBody] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const mutex = useRef(false);
  const location = useLocation();
  const statuses = partnership ? partnershipStatuses : applicationStatuses;
  const savedStatus = partnership ? saved.status : saved.application_status;
  const dirty = status !== savedStatus || !!body.trim();
  useUnsavedChanges(dirty, unsavedMessage);
  const activity = getApplicationActivity(saved).filter(
    (entry) => activityFilter === "all" || entry.type === activityFilter,
  );
  const persist = async (entry) => {
    if (mutex.current || (!entry && status === savedStatus)) return;
    mutex.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const payload = {
        revision: saved.revision,
        internal_note: saved.internal_note || "",
        [partnership ? "status" : "application_status"]: entry
          ? savedStatus
          : status,
        ...(entry ? { activity_entry: entry } : {}),
      };
      const result = partnership
        ? await savePartnershipInquiry(saved._id, payload)
        : await saveHiringApplication(saved._id, payload);
      setSaved(result);
      onSaved(result);
      if (entry) {
        setBody("");
        setActivityFilter("all");
      } else setStatus(partnership ? result.status : result.application_status);
      setFeedback({
        message: entry
          ? entry.type === "note"
            ? "Note added to the follow-up log."
            : "Contact recorded in the follow-up log."
          : "Status updated.",
        error: false,
      });
    } catch (error) {
      setFeedback({
        message: adminMessage(
          engagementError(error),
          "Unable to save. Your changes are retained; please try again.",
        ),
        error: true,
        conflict: error.response?.status === 409,
      });
    } finally {
      mutex.current = false;
      setPending(false);
    }
  };
  return (
    <>
      <BackLink to={`${base}${location.state?.listSearch || ""}`}>
        Back to {partnership ? "inquiries" : "candidates"}
      </BackLink>
      <HiringHeading
        title={partnership ? saved.restaurant_name : saved.applicant_name}
        description={partnership ? "Restaurant inquiry" : saved.vacancy_title}
      />
      <div className="hiring-record-meta">
        <span className={`hiring-badge hiring-badge--${savedStatus}`}>
          {statuses[savedStatus]}
        </span>
        <span>Submitted {formatDate(saved.createdAt)}</span>
      </div>
      <div className="hiring-detail-grid">
        <div>
          <RecordContactCard
            saved={saved}
            partnership={partnership}
          />
          <RecordSubmissionCard
            saved={saved}
            partnership={partnership}
          />
        </div>
        <RecordReviewCard
          partnership={partnership}
          status={status}
          statuses={statuses}
          savedStatus={savedStatus}
          pending={pending}
          persist={persist}
          setStatus={setStatus}
        />
      </div>
      <AdminCard className="hiring-follow-up">
        <div className="hiring-section-heading">
          <div>
            <h2>Follow-up log</h2>
            <p>
              Internal notes, contact records, and status changes for this{" "}
              {partnership ? "inquiry" : "candidate"}.
            </p>
          </div>
        </div>
        <FollowUpComposer
          body={body}
          entryType={entryType}
          channel={channel}
          pending={pending}
          persist={persist}
          setEntryType={setEntryType}
          setChannel={setChannel}
          setBody={setBody}
        />
        <MutationFeedback feedback={feedback} onReload={onReload} />
        <RecordActivity
          activityFilter={activityFilter}
          setActivityFilter={setActivityFilter}
          activity={activity}
          statuses={statuses}
        />
      </AdminCard>
    </>
  );
}
