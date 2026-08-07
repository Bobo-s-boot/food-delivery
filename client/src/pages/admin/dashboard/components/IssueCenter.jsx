import { AdminCard } from "../../components/AdminCard";
import { SectionHeader } from "../../components/SectionHeader";

export function IssueCenter({ issues }) {
  return (
    <AdminCard className="issue-center">
      <SectionHeader title="Issue Center" />

      <div className="issue-center__grid">
        {issues.map((issue) => (
          <article key={issue.title} className="issue-card">
            <h3 className="issue-card__title">{issue.title}</h3>
            <p className="issue-card__text">{issue.text}</p>
            <button className="issue-card__btn">{issue.action}</button>
          </article>
        ))}
      </div>
    </AdminCard>
  );
}
