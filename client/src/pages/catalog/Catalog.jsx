import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CatalogFilters } from "./CatalogFilters";
import { CATEGORIES } from "./const";
import { RestaurantList } from "../../components/cardListRestaurant/RestaurantList";
import { PageHero } from "../../components/pageHero/PageHero";
import { PromoFeature } from "../../components/promoFeature/PromoFeature";
import { useDebounce } from "../../hooks/useDebounce";
import "./Catalog.scss";

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
    <div className="catalog-page">
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

      <section className="catalog-page__section">
        <h2 className="catalog-page__heading">
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

        <div className="catalog-page__list-wrapper">
          <div className="catalog-page__list-inner">
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
