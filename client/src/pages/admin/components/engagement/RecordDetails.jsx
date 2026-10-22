import { useState } from "react";
import { Check, Clipboard, Mail, Phone } from "lucide-react";
import { isEmail, isPhone, isWebUrl } from "../../../../../../shared/engagement.mjs";
import { AdminCard } from "../AdminCard";
import { AdminField } from "../../hiring/components/HiringPrimitives";
import { EngagementSelect } from "./EngagementSelect";
import { formatSubmissionDate, formatSubmissionTime } from "../../hiring/hiring.utils";

function ExternalLink({ value, label }) {
  return isWebUrl(value) ? (
    <a
      className="engagement-text-link"
      href={value}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label || value} ↗
    </a>
  ) : (
    "—"
  );
}
function CopyContact({ value, label }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <span className="engagement-contact-value">
      <span>{value || "—"}</span>
      {value && (
        <button
          type="button"
          className="engagement-copy"
          aria-label={`Copy ${label}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setFailed(false);
            } catch {
              setFailed(true);
            }
          }}
        >
          {copied ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <Clipboard size={15} aria-hidden="true" />
          )}
        </button>
      )}
      {copied && (
        <span className="hiring-sr-only" role="status">
          {label} copied
        </span>
      )}
      {failed && (
        <span className="engagement-copy-error" role="status">
          Select and copy the {label.toLowerCase()} above.
        </span>
      )}
    </span>
  );
}

export function RecordContactCard({ saved, partnership }) {
  return (
    <AdminCard>
            <h2>
              {partnership ? "Restaurant & contact" : "Candidate details"}
            </h2>
            <dl>
              {partnership && (
                <>
                  <dt>Restaurant name</dt>
                  <dd>{saved.restaurant_name}</dd>
                </>
              )}
              {(partnership || saved.kind === "courier") && (
                <>
                  <dt>City</dt>
                  <dd>{saved.city || "—"}</dd>
                </>
              )}
              <dt>{partnership ? "Contact person" : "Candidate name"}</dt>
              <dd>{partnership ? saved.contact_name : saved.applicant_name}</dd>
              <dt>Phone number</dt>
              <dd>
                <CopyContact value={saved.phone} label="phone number" />
              </dd>
              <dt>Email</dt>
              <dd>
                <CopyContact value={saved.email} label="email" />
              </dd>
              {partnership && (
                <>
                  <dt>Website or social media</dt>
                  <dd>
                    <ExternalLink value={saved.website} />
                  </dd>
                </>
              )}
            </dl>
            <div className="engagement-contact-actions">
              {saved.email && isEmail(saved.email) && (
                <a className="hiring-button" href={`mailto:${saved.email}`}>
                  <Mail size={16} aria-hidden="true" />
                  Email {partnership ? "contact" : "candidate"}
                </a>
              )}
              {saved.phone && isPhone(saved.phone) && (
                <a
                  className="hiring-button"
                  href={`tel:${saved.phone.replace(/[^+\d]/g, "")}`}
                >
                  <Phone size={16} aria-hidden="true" />
                  Call {partnership ? "contact" : "candidate"}
                </a>
              )}
            </div>
          </AdminCard>
  );
}

export function RecordSubmissionCard({ saved, partnership }) {
  return (
    <AdminCard>
            <h2>Submission details</h2>
            <dl>
              {!partnership && (
                <>
                  <dt>Team</dt>
                  <dd>{saved.kind === "courier" ? "Courier" : "Core team"}</dd>
                  <dt>Vacancy</dt>
                  <dd>{saved.vacancy_title}</dd>
                  {saved.vacancy_snapshot && <><dt>Applied to version</dt><dd>{saved.vacancy_snapshot.revision ?? "—"} · {saved.application_language === "uk" ? "Ukrainian" : "English"}</dd></>}
                </>
              )}
              <dt>Submission date</dt>
              <dd>{formatSubmissionDate(saved.createdAt)}</dd>
              <dt>Submission time</dt>
              <dd>{formatSubmissionTime(saved.createdAt)} (Kyiv time)</dd>
            </dl>
            <div className="hiring-comment">
              <h3>Comment</h3>
              <p>{saved.comment || "No comment provided."}</p>
            </div>
            {!partnership && (
              <dl>
                <dt>Resume</dt>
                <dd>
                  <ExternalLink value={saved.resume_url} label="View resume" />
                </dd>
                <dt>Portfolio</dt>
                <dd>
                  <ExternalLink
                    value={saved.portfolio_url}
                    label="View portfolio"
                  />
                </dd>
              </dl>
            )}
          </AdminCard>
  );
}

export function RecordReviewCard({ partnership, status, statuses, savedStatus, pending, persist, setStatus }) {
  return (
    <AdminCard className="hiring-review">
          <h2>Review {partnership ? "inquiry" : "candidate"}</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              persist();
            }}
          >
            <AdminField name="application-status" label="Status">
              <EngagementSelect
                id="application-status"
                label="Status"
                value={status}
                options={Object.entries(statuses).map(([value, label]) => ({
                  value,
                  label,
                }))}
                onChange={setStatus}
                disabled={pending}
              />
            </AdminField>
            <div className="hiring-editor-actions">
              <button
                className="is-primary"
                disabled={status === savedStatus || pending}
                type="submit"
              >
                {pending ? "Saving…" : "Save status"}
              </button>
              {status !== savedStatus && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setStatus(savedStatus)}
                >
                  Discard
                </button>
              )}
            </div>
            <p className="hiring-review-help">
              Status records your review progress. Use the follow-up log below
              to record notes and completed contact.
            </p>
          </form>
        </AdminCard>
  );
}
