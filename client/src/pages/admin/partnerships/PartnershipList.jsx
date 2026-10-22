import { useLocation, useSearchParams } from "react-router-dom";
import { AdminCard } from "../components/AdminCard";
import { PartnershipListFilters, PartnershipListResults } from "./components/PartnershipListContent";

export function PartnershipList({ data, base }) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const q = params.get("q") || "";
  const status = params.get("status") || "";
  const city = params.get("city") || "";
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next, { replace: true });
  };
  const records = data.partnerships
    .filter(
      (item) =>
        `${item.restaurant_name} ${item.city} ${item.contact_name}`
          .toLowerCase()
          .includes(q.toLowerCase()) &&
        (!status || item.status === status) &&
        (!city || item.city === city),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const page = Math.min(
    Math.max(1, Number(params.get("page")) || 1),
    Math.max(1, Math.ceil(records.length / 15)),
  );
  const hasFilters = !!(q || status || city);
  return (
    <AdminCard>
      <PartnershipListFilters
        q={q}
        status={status}
        city={city}
        data={data}
        hasFilters={hasFilters}
        update={update}
        setParams={setParams}
      />
      <PartnershipListResults
        records={records}
        page={page}
        base={base}
        location={location}
        data={data}
        setParams={setParams}
        update={update}
      />
    </AdminCard>
  );
}
