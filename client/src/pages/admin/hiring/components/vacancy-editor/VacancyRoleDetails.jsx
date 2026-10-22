import { employmentTypes, workModes } from "../../../../../../../shared/hiring.mjs";
import { AdminField } from "../HiringPrimitives";
import { EngagementSelect } from "../../../components/engagement/EngagementSelect";

export function VacancyRoleDetails({
  form,
  saved,
  updateSlug,
  update,
  input,
  errors,
  pending,
}) {
  const select = (key, label, choices, helper) => <AdminField name={key} label={label} error={errors[key]} helper={helper}>
    <EngagementSelect id={key} label={label.replace(" *", "")} value={form[key]} disabled={pending} options={[{ value: "", label: "Choose an option" }, ...choices.map(([value, text]) => ({ value, label: text }))]} onChange={(value) => update(key, value)} />
  </AdminField>;
  return (
    <div className="hiring-form-grid">
          {input("slug", "Vacancy page link *", form.slug, updateSlug, { disabled: !!saved.published_at, maxLength: 160, helper: `The website address is generated from the job title in the next step. Example: ${window.location.origin}${window.location.pathname}#/careers/customer-support-specialist. Enter only the last part here. You may edit it before the first publication.` })}
          {select("source_language", "Language you write first", [["en", "English"], ["uk", "Ukrainian"]], "Choose which content step comes first. Write and review the other language manually before publishing; the admin controls stay English.")}
          {select("employment_type", "Employment type *", employmentTypes.map((value) => [value, ({ full_time: "Full-time", part_time: "Part-time", contract: "Contract", internship: "Internship" })[value]]), "Shown in Working arrangements on both the card and full page. Choose the type of contract for this role.")}
          {select("work_mode", "Workplace *", workModes.map((value) => [value, ({ onsite: "On-site", hybrid: "Hybrid", remote: "Remote" })[value]]), "Shown beside employment type on the card and full page. Choose whether people work on-site, remotely or both.")}
        </div>
  );
}
