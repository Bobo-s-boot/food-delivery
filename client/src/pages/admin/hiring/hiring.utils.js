export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Kyiv",
      }).format(new Date(value))
    : "—";
export const formatSubmissionDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeZone: "Europe/Kyiv",
      }).format(new Date(value))
    : "—";
export const formatSubmissionTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Kyiv",
      }).format(new Date(value))
    : "—";
export const getHiringStats = (data) => ({
  newApplications: data.applications.filter(
    (item) => item.application_status === "new",
  ).length,
  inReview: data.applications.filter(
    (item) => item.application_status === "in_review",
  ).length,
  published: data.vacancies.filter(
    (item) => item.publication_status === "published",
  ).length,
});
export const filterVacancies = (items, params) =>
  items.filter(
    (item) =>
      item.title
        .toLocaleLowerCase()
        .includes((params.get("q") || "").toLocaleLowerCase()) &&
      (!params.get("status") ||
        item.publication_status === params.get("status")) &&
      (!params.get("department") ||
        item.department === params.get("department")),
  );
export const filterApplications = (items, params) =>
  items.filter(
    (item) =>
      `${item.applicant_name} ${item.vacancy_title}`
        .toLocaleLowerCase()
        .includes((params.get("q") || "").toLocaleLowerCase()) &&
      (!params.get("status") ||
        item.application_status === params.get("status")) &&
      (!params.get("kind") || item.kind === params.get("kind")) &&
      (!params.get("vacancy") || item.vacancy_id === params.get("vacancy")) &&
      (!params.get("city") || item.city === params.get("city")),
  );

export const getApplicationActivity = (record) => {
  const activity = [...(record.activity || [])];
  for (const [index, entry] of (record.history || []).entries()) {
    if (
      !activity.some(
        (item) =>
          item.type === "status" &&
          item.status === entry.status &&
          new Date(item.at).getTime() === new Date(entry.at).getTime(),
      )
    ) {
      activity.push({
        ...entry,
        id: `history-${index}`,
        type: "status",
        body: "",
        author: entry.author === "Система" ? "System" : entry.author,
      });
    }
  }
  if (
    record.internal_note &&
    !activity.some(
      (item) => item.type === "note" && item.body === record.internal_note,
    )
  ) {
    activity.push({
      id: "existing-internal-note",
      type: "note",
      body: record.internal_note,
      author: "Internal note",
      at: null,
    });
  }
  return activity.sort((a, b) => new Date(b.at) - new Date(a.at));
};
