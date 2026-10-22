import { CircleDot, Mail, MessageSquare, Phone } from "lucide-react";
import { AdminField } from "../../hiring/components/HiringPrimitives";
import { EngagementSelect } from "./EngagementSelect";
import { formatDate } from "../../hiring/hiring.utils";

export function FollowUpComposer({ body, entryType, channel, pending, persist, setEntryType, setChannel, setBody }) {
  return (
    <form
          className="hiring-log-composer"
          onSubmit={(event) => {
            event.preventDefault();
            if (body.trim())
              persist({
                type: entryType,
                body: body.trim(),
                ...(entryType === "contact" ? { channel } : {}),
              });
          }}
        >
          <div className="hiring-log-toolbar">
            <div
              className="engagement-segmented"
              aria-label="New log entry type"
            >
              {[
                ["note", "Add note"],
                ["contact", "Log contact"],
              ].map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  aria-pressed={entryType === key}
                  disabled={pending}
                  onClick={() => setEntryType(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            {entryType === "contact" && (
              <EngagementSelect
                id="contact-channel"
                label="Contact channel"
                value={channel}
                options={[
                  { value: "email", label: "Email" },
                  { value: "phone", label: "Phone call" },
                ]}
                onChange={setChannel}
                disabled={pending}
              />
            )}
          </div>
          <AdminField
            name="follow-up-body"
            label={entryType === "note" ? "Note" : "Contact summary"}
            helper={
              entryType === "contact"
                ? "Record a conversation or email that already happened. This action does not send a message or place a call."
                : "Notes are private to administrators reviewing this record."
            }
          >
            <textarea
              id="follow-up-body"
              value={body}
              rows={3}
              maxLength={5000}
              placeholder={
                entryType === "note"
                  ? "Add context or the next step…"
                  : "What was discussed, and what happens next?"
              }
              disabled={pending}
              onChange={(event) => setBody(event.target.value)}
            />
          </AdminField>
          <div className="hiring-actions">
            <button
              className="is-primary"
              type="submit"
              disabled={pending || !body.trim()}
            >
              {pending
                ? "Saving…"
                : entryType === "note"
                  ? "Add note"
                  : "Record contact"}
            </button>
            {body && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setBody("")}
              >
                Discard draft
              </button>
            )}
          </div>
        </form>
  );
}

export function RecordActivity({ activityFilter, setActivityFilter, activity, statuses }) {
  return (
    <>
<div
          className="hiring-log-filters engagement-segmented"
          aria-label="Follow-up log filters"
        >
          {[
            ["all", "All activity"],
            ["note", "Notes"],
            ["contact", "Contact"],
            ["status", "Status changes"],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              aria-pressed={activityFilter === key}
              onClick={() => setActivityFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {activity.length ? (
          <ol className="hiring-activity">
            {activity.map((entry) => {
              const Icon =
                entry.type === "contact"
                  ? entry.channel === "phone"
                    ? Phone
                    : Mail
                  : entry.type === "note"
                    ? MessageSquare
                    : CircleDot;
              const title =
                entry.type === "note"
                  ? "Note added"
                  : entry.type === "contact"
                    ? entry.channel === "phone"
                      ? "Phone contact recorded"
                      : "Email contact recorded"
                    : `Status changed to ${statuses[entry.status] || entry.status}`;
              return (
                <li key={entry.id}>
                  <span className="hiring-activity__icon">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    {entry.body && <p>{entry.body}</p>}
                    <span className="hiring-activity__meta">
                      {entry.author} ·{" "}
                      {entry.at ? (
                        <time dateTime={entry.at}>{formatDate(entry.at)}</time>
                      ) : (
                        <span>Date not recorded</span>
                      )}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="hiring-log-empty">
            {activityFilter === "all"
              ? "No activity recorded yet. Add a note to begin."
              : "No activity of this type yet."}
          </p>
        )}
    </>
  );
}
