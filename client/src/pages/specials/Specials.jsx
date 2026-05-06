import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SpecialsFilters } from "./components/SpecialsFilters";
import { SpecialsGrid } from "./components/SpecialsGrid";
import { SpecialsHero } from "./components/SpecialsHero";
import { SpecialsHowItWorks } from "./components/SpecialsHowItWorks";
import { SpecialsPromo } from "./components/SpecialsPromo";
import { DEALS, SPECIAL_FILTERS, SPECIAL_STEPS } from "./const";

export function Specials() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredDeals = useMemo(() => {
    if (activeFilter === "All") {
      return DEALS;
    }

    return DEALS.filter((deal) => deal.filterCategory === activeFilter);
  }, [activeFilter]);

  return (
    <div className="w-full bg-white font-['Inter'] text-[#0D1A2D] px-4 md:px-8 pb-24 flex flex-col items-center">
      <SpecialsHero t={t} />
      <SpecialsFilters
        t={t}
        filters={SPECIAL_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <SpecialsPromo t={t} />
      <SpecialsGrid t={t} deals={filteredDeals} />
      <SpecialsHowItWorks t={t} steps={SPECIAL_STEPS} />
    </div>
  );
}
