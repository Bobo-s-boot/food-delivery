import { Link } from "react-router-dom";
import { emptyHiringVacancy } from "../../../../../shared/hiring.mjs";
import { VacancyWizard } from "./VacancyWizard";

export function VacancyEditor({ data, base, id, onSaved, onReload }) {
  const record = id === "new" ? emptyHiringVacancy() : data.vacancies.find((item) => item._id === id);
  if (!record) return <p className="hiring-notice">Vacancy not found. <Link to={`${base}/vacancies`}>Back to vacancies</Link></p>;
  return <VacancyWizard key={id} record={record} data={data} base={base} onSaved={onSaved} onReload={onReload} />;
}
