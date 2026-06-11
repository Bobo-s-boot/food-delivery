import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MENU_CATEGORIES, MOCK_MENU_ITEMS } from "./const.js";
import { ProductCard } from "./ProductCard";
import { MenuCategoryList } from "./MenuCategoryList";
import { MenuSearch } from "./MenuSearch";
import { PageHero } from "../../components/pageHero/PageHero";
import { PromoFeature } from "../../components/promoFeature/PromoFeature";
import { useDebounce } from "../../hooks/useDebounce";
import "./Menu.scss";

export function Menu() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("fastFood");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filteredItems = MOCK_MENU_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(debouncedSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-page">
      <PageHero
        image="/img/menu_background.png"
        imageAlt="Menu Background"
        title={t("menu.freeDeliveryWeekend")}
        description={t("menu.stayInTreatYourself")}
        buttonLabel={t("menu.orderNow")}
      />

      <PromoFeature
        heading={t("menu.whatAreYouInTheMoodFor")}
        image="/img/mood_background.png"
        imageAlt="Mood Background"
        badge={t("menu.newArrival")}
        title={t("menu.meetNewPartner")}
        description={t("menu.authenticPizza")}
        buttonLabel={t("menu.exploreMenu")}
      />

      <MenuCategoryList
        categories={MENU_CATEGORIES}
        activeCategory={activeCategory}
        getCategoryLabel={(categoryKey) => t(`menu.categories.${categoryKey}`)}
        onCategorySelect={setActiveCategory}
      />

      <MenuSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t("menu.searchPlaceholder")}
      />

      <div className="menu-page__cards">
        {filteredItems.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
