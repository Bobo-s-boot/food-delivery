import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CatalogFilters } from "./CatalogFilters";
import { CATEGORIES } from "./const";
import { RestaurantList } from "../../components/cardListRestaurant/RestaurantList";
import { PageHero } from "../../components/pageHero/PageHero";
import { PromoFeature } from "../../components/promoFeature/PromoFeature";
import { useDebounce } from "../../hooks/useDebounce";
import searchIcon from "../../assets/search.svg";


export function Catalog() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const translatedCategories = CATEGORIES.map((cat) => ({
    key: cat.key,
    label: t(`catalog.categories.${cat.translationKey}`),
  }));

  return (
    <div className="w-full mx-auto px-4 md:px-8 pb-12 flex flex-col items-center font-['Inter'] bg-[#FFFFFF]">
      <PageHero
        image="/img/Image_Rest1.png"
        imageAlt="Catalog Background"
        title={t("catalog.freeDeliveryWeekend")}
        description={t("catalog.stayInTreatYourself")}
        buttonLabel={t("catalog.orderNow")}
      />

      <PromoFeature
        heading={t("catalog.exploreLocalFlavors")}
        image="/img/ImageRest2.png"
        imageAlt="New partner restaurant"
        badge={t("catalog.newArrival")}
        title={t("catalog.meetNewPartner")}
        description={t("catalog.authenticPizza")}
        buttonLabel={t("catalog.exploreMenu")}
      />

      <section className="w-full mt-22.5">
        <h2 className="text-[48px] font-normal tracking-[-0.04em] text-black mb-16">
          {t("catalog.exploreLocalRestaurants")}
        </h2>

        <CatalogFilters
          categories={translatedCategories}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          searchPlaceholder={t("catalog.cravingPlaceholder")}
          description={t("catalog.browseDescription")}
          onCategorySelect={setActiveCategory}
          onSearchChange={setSearchQuery}
        />

        <div className="w-full flex justify-center mt-16">
          <div className="w-full max-w-423">
            <RestaurantList
              searchQuery={debouncedSearchQuery}
              activeCategory={activeCategory}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
