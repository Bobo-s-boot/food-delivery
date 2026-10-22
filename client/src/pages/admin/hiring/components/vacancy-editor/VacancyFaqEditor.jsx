import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { hiringLanguages } from "../../../../../../../shared/hiring.mjs";

export function VacancyFaqEditor({
  form,
  pending,
  input,
  errors,
  changeQuestion,
  moveQuestion,
  removeQuestion,
  addQuestion,
}) {
  return (
    <>
      {form.content.en.faq.map((item, index) => <div className="hiring-faq-editor" key={item.id}>
        <div className="hiring-faq-editor__heading"><h3>Question {index + 1}</h3><div>
          <button type="button" aria-label={"Move question " + (index + 1) + " up"} disabled={pending || index === 0} onClick={() => moveQuestion(index, index - 1)}><ArrowUp size={16} /></button>
          <button type="button" aria-label={"Move question " + (index + 1) + " down"} disabled={pending || index === form.content.en.faq.length - 1} onClick={() => moveQuestion(index, index + 1)}><ArrowDown size={16} /></button>
          <button type="button" disabled={pending} onClick={() => removeQuestion(item)}>Remove question {index + 1}</button>
        </div></div>
        <div className="hiring-form-grid">{hiringLanguages.map((language) => <div key={language} lang={language}>
          <h4>{language === "en" ? "English" : "Ukrainian"}</h4>
          {input("faq-" + index + "-" + language + "-question", "Question " + (index + 1) + " — " + (language === "en" ? "English" : "Ukrainian"), form.content[language].faq[index].question, (value) => changeQuestion(language, index, "question", value), { maxLength: 240, helper: "A question visitors can expand in the FAQ near the bottom of this vacancy page. Write the same question in both languages." })}
          {input("faq-" + index + "-" + language + "-answer", "Answer " + (index + 1) + " — " + (language === "en" ? "English" : "Ukrainian"), form.content[language].faq[index].answer, (value) => changeQuestion(language, index, "answer", value), { multiline: true, maxLength: 3000, helper: "The answer shown when a visitor opens this question. Enter useful details for this role, up to 3,000 characters." })}
          {errors["content." + language + ".faq." + index] && <p className="hiring-field__error">{errors["content." + language + ".faq." + index]}</p>}
        </div>)}</div>
      </div>)}
      <button type="button" disabled={pending || form.content.en.faq.length >= 20} onClick={addQuestion}><Plus size={16} aria-hidden="true" />Add question</button>
    </>
  );
}
