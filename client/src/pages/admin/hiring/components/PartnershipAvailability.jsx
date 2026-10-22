import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { AdminCard } from "../../components/AdminCard";
import {
  saveEngagementSettings,
  engagementError,
  announceEngagementUpdate,
} from "../../../../api/engagementService";
import { useUnsavedChanges } from "../../../../features/engagement/useUnsavedChanges";
import { adminMessage, unsavedMessage } from "../engagementLabels";
import { MutationFeedback } from "./HiringPrimitives";
import { ConfirmationDialog } from "../../components/engagement/EngagementPrimitives";

export function PartnershipAvailability({ settings, onSaved, onReload }) {
  const [saved, setSaved] = useState(settings);
  const [enabled, setEnabled] = useState(settings.navigation.restaurants);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const mutex = useRef(false);
  const dirty = enabled !== saved.navigation.restaurants;
  useUnsavedChanges(dirty, unsavedMessage);
  const persist = async () => {
    if (mutex.current || !dirty) return;
    mutex.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const result = await saveEngagementSettings({
        ...saved,
        navigation: { ...saved.navigation, restaurants: enabled },
      });
      setSaved(result);
      onSaved(result);
      announceEngagementUpdate();
      setFeedback({
        message: "For Restaurants availability saved.",
        error: false,
      });
    } catch (error) {
      setFeedback({
        message: adminMessage(
          engagementError(error),
          "Unable to save availability. Your selection is retained; please try again.",
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
    <AdminCard className="partnership-availability">
      <div className="partnership-availability__row">
        <label className="hiring-switch">
          <input
            type="checkbox"
            role="switch"
            checked={enabled}
            disabled={pending}
            onChange={(event) => setEnabled(event.target.checked)}
          />
          <span>
            <strong>Enable For Restaurants</strong>
            <small>
              Controls the footer link and public page access. When disabled,
              its URL shows a 404 and new inquiries are blocked.
            </small>
          </span>
        </label>
        <div className="hiring-actions">
          {saved.navigation.restaurants && (
            <Link
              className="engagement-text-link"
              to="/for-restaurants"
              target="_blank"
              rel="noopener noreferrer"
            >
              View page
              <ExternalLink size={14} aria-hidden="true" />
            </Link>
          )}
          {dirty && (
            <>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setEnabled(saved.navigation.restaurants);
                  setFeedback(null);
                }}
              >
                Discard
              </button>
              <button
                type="button"
                className="is-primary"
                disabled={pending}
                onClick={() => (!enabled ? setConfirm(true) : persist())}
              >
                {pending ? "Saving…" : "Save changes"}
              </button>
            </>
          )}
        </div>
      </div>
      <MutationFeedback feedback={feedback} onReload={onReload} />
      {confirm && (
        <ConfirmationDialog
          title="Disable For Restaurants?"
          description="Its footer link will disappear, direct URLs will show a 404 page, and new inquiries will be blocked. Existing inquiries remain available here."
          action="Disable section"
          onClose={() => setConfirm(false)}
          onConfirm={() => {
            setConfirm(false);
            persist();
          }}
        />
      )}
    </AdminCard>
  );
}
