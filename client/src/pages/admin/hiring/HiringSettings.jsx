import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { AdminCard } from "../components/AdminCard";
import { SectionHeader } from "../components/SectionHeader";
import {
  saveEngagementSettings,
  engagementError,
  announceEngagementUpdate,
} from "../../../api/engagementService";
import { useUnsavedChanges } from "../../../features/engagement/useUnsavedChanges";
import {
  AdminField,
  MutationFeedback,
} from "./components/HiringPrimitives";
import { ConfirmationDialog, EngagementHeading as HiringHeading } from "../components/engagement/EngagementPrimitives";
import { adminMessage, unsavedMessage } from "./engagementLabels";

export function HiringSettings({ data, onSaved, onReload }) {
  const [saved, setSaved] = useState(data.settings);
  const [form, setForm] = useState(data.settings);
  const [cities, setCities] = useState(
    data.settings.hiring.courier_cities.join("\n"),
  );
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const mutex = useRef(false);
  const proposed = {
    ...form,
    hiring: {
      ...form.hiring,
      courier_cities: cities
        .split("\n")
        .map((city) => city.trim())
        .filter(Boolean),
    },
  };
  const dirty = JSON.stringify(proposed) !== JSON.stringify(saved);
  useUnsavedChanges(dirty, unsavedMessage);
  const disabling = saved.navigation.careers && !form.navigation.careers;
  const pausing = saved.hiring.global_enabled && !form.hiring.global_enabled;
  const update = (group, key, value) =>
    setForm((current) => ({
      ...current,
      [group]: { ...current[group], [key]: value },
    }));
  const persist = async () => {
    if (mutex.current || !dirty) return;
    mutex.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const result = await saveEngagementSettings(proposed);
      setForm(result);
      setSaved(result);
      setCities(result.hiring.courier_cities.join("\n"));
      onSaved(result);
      announceEngagementUpdate();
      setFeedback({ message: "Settings saved.", error: false });
    } catch (error) {
      setFeedback({
        message: adminMessage(
          engagementError(error),
          "Unable to save settings. Your changes are retained; please try again.",
        ),
        error: true,
        conflict: error.response?.status === 409,
      });
    } finally {
      mutex.current = false;
      setPending(false);
    }
  };
  const toggle = (group, key, label, description, disabled = false) => (
    <label className="hiring-switch">
      <input
        type="checkbox"
        role="switch"
        checked={form[group][key]}
        disabled={pending || disabled}
        onChange={(event) => update(group, key, event.target.checked)}
      />
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
    </label>
  );
  const preferencesDisabled = !form.navigation.careers;
  return (
    <>
      <HiringHeading
        title="Settings"
        description="Control the public Careers section and how candidates can apply."
      />
      <AdminCard>
        <SectionHeader
          title="Careers section"
          description="One switch controls public access and its footer link."
        />
        {toggle(
          "navigation",
          "careers",
          "Enable Careers",
          "When disabled, the footer link is hidden and all Careers URLs show a 404 page. Existing candidates and vacancies stay here.",
        )}
        <div className="hiring-availability-state">
          <span
            className={`hiring-badge hiring-badge--${saved.navigation.careers ? "published" : "closed"}`}
          >
            {saved.navigation.careers
              ? "Public section enabled"
              : "Public section disabled"}
          </span>
          {saved.navigation.careers && (
            <Link
              className="engagement-text-link"
              to="/careers"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Careers
              <ExternalLink size={14} aria-hidden="true" />
            </Link>
          )}
        </div>
      </AdminCard>
      <AdminCard>
        <SectionHeader
          title="Application preferences"
          description="These settings control forms while the Careers section is enabled."
        />
        {toggle(
          "hiring",
          "global_enabled",
          "Accept new applications",
          "Pause applications without hiding the Careers page or changing published vacancies.",
          preferencesDisabled,
        )}
        <div className="hiring-preference-grid">
          {toggle(
            "hiring",
            "team_enabled",
            "Core team",
            "Applications to published vacancies.",
            preferencesDisabled || !form.hiring.global_enabled,
          )}
          {toggle(
            "hiring",
            "courier_enabled",
            "Couriers",
            "Applications in the recruitment cities below.",
            preferencesDisabled || !form.hiring.global_enabled,
          )}
        </div>
        <AdminField
          name="courier-cities"
          label="Courier recruitment cities"
          helper="Enter one city per line, up to 50. Courier applications are available only in these cities."
        >
          <textarea
            id="courier-cities"
            value={cities}
            disabled={
              pending || preferencesDisabled || !form.hiring.global_enabled
            }
            rows={4}
            onChange={(event) => setCities(event.target.value)}
          />
        </AdminField>
      </AdminCard>
      {dirty && (
        <p className="hiring-draft-status" role="status">
          Unsaved changes
        </p>
      )}
      <MutationFeedback feedback={feedback} onReload={onReload} />
      <div className="hiring-editor-actions">
        <button
          type="button"
          className="is-primary"
          disabled={!dirty || pending}
          onClick={() => (disabling || pausing ? setConfirm(true) : persist())}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          disabled={!dirty || pending}
          onClick={() => {
            setForm(saved);
            setCities(saved.hiring.courier_cities.join("\n"));
            setFeedback(null);
          }}
        >
          Discard changes
        </button>
      </div>
      {confirm && (
        <ConfirmationDialog
          title={disabling ? "Disable Careers?" : "Pause new applications?"}
          description={
            disabling
              ? "The footer link will disappear and Careers, courier, and vacancy URLs will show a 404 page. Existing records remain available here."
              : "Candidates will be unable to submit new applications. The Careers page and existing records remain available."
          }
          action={disabling ? "Disable Careers" : "Pause applications"}
          onClose={() => setConfirm(false)}
          onConfirm={() => {
            setConfirm(false);
            persist();
          }}
        />
      )}
    </>
  );
}
