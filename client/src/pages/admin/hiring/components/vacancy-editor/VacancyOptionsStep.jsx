import { VacancyFaqEditor } from "./VacancyFaqEditor";

export function VacancyOptionsStep({
  form,
  pending,
  toggle,
  input,
  errors,
  changeQuestion,
  moveQuestion,
  removeQuestion,
  addQuestion,
}) {
  return (
    <>
      <div className="hiring-wizard-switches">
        {toggle("resume_required", "Require a resume", "Candidates provide an accessible resume link. File uploads are not used for resumes.")}
        {toggle("portfolio_field_enabled", "Show portfolio field", "Candidates can add an optional portfolio link.")}
        {toggle("faq_enabled", "Show FAQ on this vacancy", "Add questions and answers in both languages, or turn the whole block off.")}
      </div>
      {form.faq_enabled && <VacancyFaqEditor
        form={form}
        pending={pending}
        input={input}
        errors={errors}
        changeQuestion={changeQuestion}
        moveQuestion={moveQuestion}
        removeQuestion={removeQuestion}
        addQuestion={addQuestion}
      />}
    </>
  );
}
