import { Link } from "react-router-dom";
import { translateEngagementMessage } from "../engagement.utils";

export function ApplicationConsent({
  kind,
  copy,
  values,
  errors,
  pending,
  preview,
  setValue,
  t,
}) {
  return (
    <>
      <div className="eng-consent">
        <input
          id={kind + "-consent"}
          type="checkbox"
          name="consent"
          checked={values.consent}
          onChange={(event) => setValue("consent", event.target.checked)}
          required
          disabled={pending || preview}
          aria-invalid={!!errors.consent}
          aria-describedby={
            errors.consent ? kind + "-consent-error" : undefined
          }
        />
        <label htmlFor={kind + "-consent"}>
          {copy.consent}{" "}
          <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
            {copy.privacy}
          </Link>
          . *
        </label>
      </div>
      {errors.consent && (
        <p id={kind + "-consent-error"} className="eng-field__error">
          {translateEngagementMessage(errors.consent, t, "form.errors.invalid")}
        </p>
      )}
    </>
  );
}
