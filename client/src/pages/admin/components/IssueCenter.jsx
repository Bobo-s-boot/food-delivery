import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";

export function IssueCenter({ issues }) {
  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader
        title="Issue Center"
        description="Operational issues that need admin attention."
      />
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {issues.map((issue) => (
          <article key={issue.title} className="rounded-2xl bg-[#FFF8E6] p-4">
            <h3 className="font-medium text-[#7A4A00]">{issue.title}</h3>
            <p className="mt-2 text-sm leading-[145%] text-[#695A42]">
              {issue.text}
            </p>
            <button className="mt-4 rounded-full bg-[#0D1A2D] px-4 py-2 text-xs text-white">
              {issue.action}
            </button>
          </article>
        ))}
      </div>
    </AdminCard>
  );
}
