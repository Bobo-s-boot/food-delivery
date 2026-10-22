import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, BriefcaseBusiness, Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { VacancyImage } from "./VacancyImage";

// Compatibility export for existing image consumers.
export { VacancyImage } from "./VacancyImage";

export function VacancyCard({ vacancy, paused = "", preview = false }) {
  const { t } = useTranslation();
  const content = <>
    {vacancy.images?.card && <div className="eng-roles__visual">
      <VacancyImage id={vacancy.images.card} alt={vacancy.image_alt} />
    </div>}
    <div className="eng-roles__copy">
      <h3>{vacancy.title || t("engagement.hiring.untitled")}</h3>
      <span className="eng-roles__department">{vacancy.department}</span>
      <p className="eng-roles__overview">{vacancy.summary ?? vacancy.overview}</p>
      <div className="eng-roles__meta">
        {vacancy.city && <span><MapPin size={14} aria-hidden="true" />{vacancy.city}</span>}
        {vacancy.employment_type && <span><BriefcaseBusiness size={14} aria-hidden="true" />{vacancy.employment_type}</span>}
        {vacancy.schedule && <span><Clock3 size={14} aria-hidden="true" />{vacancy.schedule}</span>}
      </div>
      {paused && <p>{paused}</p>}
    </div>
    <span className="eng-roles__action">{t("engagement.common.more")}<ArrowUpRight size={20} aria-hidden="true" /></span>
  </>;
  const className = "eng-roles__row" + (!vacancy.images?.card ? " eng-roles__row--text" : "");
  return preview ? <div className={className}>{content}</div> : <Link className={className} to={"/careers/" + vacancy.slug}>{content}</Link>;
}
