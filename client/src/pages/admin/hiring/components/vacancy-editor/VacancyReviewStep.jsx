import { Eye } from "lucide-react";
import { hiringLanguages, hiringReviewed, hiringFingerprint } from "../../../../../../../shared/hiring.mjs";

export function VacancyReviewStep({
  form,
  errors,
  pending,
  contentReady,
  contentErrors,
  allErrors,
  ready,
  data,
  setPreview,
  update,
  setStep,
  fieldStep,
  setErrors,
}) {
  return (
    <>
          <p className="hiring-wizard-help">Preview the card and full page, then confirm each language. Any content change requires a fresh review of both versions.</p>
          <div className="hiring-review-languages">{hiringLanguages.map((language) => <section key={language}>
            <h3>{language === "en" ? "English" : "Ukrainian"}</h3>
            <p>{hiringReviewed(form, language) ? "Reviewed and ready" : "Review needed"}</p>
            <div className="hiring-actions"><button type="button" onClick={() => setPreview({ language, mode: "card" })}><Eye size={16} aria-hidden="true" />Preview {language.toUpperCase()}</button></div>
            <label><input type="checkbox" checked={hiringReviewed(form, language)} aria-invalid={!!errors["reviews." + language]} aria-describedby={errors["reviews." + language] ? "review-error-" + language : undefined} disabled={pending || !contentReady} onChange={(event) => update("reviews", { ...form.reviews, [language]: event.target.checked ? hiringFingerprint(form) : "" })} />I have checked this language and its preview</label>
            {errors["reviews." + language] && <p className="hiring-field__error" id={"review-error-" + language}>{errors["reviews." + language]}</p>}
          </section>)}</div>
          {!contentReady && <div className="hiring-review-gaps"><h3>Complete before publishing</h3><ul>{Object.entries(contentErrors).map(([key, message]) => <li key={key}><button type="button" onClick={() => { setStep(fieldStep(key)); setErrors(allErrors); }}>{key.startsWith("content.") ? key.split(".")[1].toUpperCase() + " · " : ""}{key.split(".").at(-1).replaceAll("_", " ")}: {message}</button></li>)}</ul></div>}
          {!data.settings.navigation.careers && <p className="hiring-notice">Careers is disabled. This vacancy can be published, but visitors cannot access it until Careers is enabled in Settings.</p>}
          <p className="hiring-wizard-help">{ready ? "Both languages are ready. Use the controls above to publish." : "Complete the content and review both languages. Then choose Published and save in the controls above."}</p>
        </>
  );
}
