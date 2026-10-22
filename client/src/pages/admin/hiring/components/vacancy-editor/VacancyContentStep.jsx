import { emptyHiringContent, hiringTextFields } from "../../../../../../../shared/hiring.mjs";

export function VacancyContentStep({
  form,
  steps,
  step,
  input,
  updateContent,
  titles,
  contentHelp,
}) {
  return (
    (() => {
          const language = steps[step][0], content = form.content[language] || emptyHiringContent();
          return <div className="hiring-form-grid" lang={language}>
            {["title", "department", "city", "schedule", "summary", "overview", "responsibilities", "requirements", "conditions"].map((key) => {
              const list = ["responsibilities", "requirements", "conditions"].includes(key);
              return <div key={key} className={["summary", "overview", "conditions"].includes(key) ? "is-wide" : undefined}>
                {input("content." + language + "." + key, titles[key] + (["title", "department", "city", "summary", "overview", "responsibilities", "requirements"].includes(key) ? " *" : ""),
                  list ? content[key].join("\n") : content[key], (value) => updateContent(language, key, list ? value.split("\n") : value),
                  { multiline: list || ["summary", "overview"].includes(key), maxLength: hiringTextFields[key], helper: contentHelp[key] })}
                {key === "summary" && <small className="hiring-wizard-count">{content.summary.length} / 320 characters</small>}
              </div>;
            })}
          </div>;
        })()
  );
}
