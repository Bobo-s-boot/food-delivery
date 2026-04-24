import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CatalogTab } from "./CatalogTab";
import { CATEGORIES } from "./const";
import { RestaurantList } from "../../components/cardListRestaurant/RestaurantList";
import searchIcon from "../../assets/search.svg";

export function Catalog() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const translatedCategories = CATEGORIES.map((cat) => ({
    key: cat.key,
    label: t(`catalog.categories.${cat.translationKey}`),
  }));

  const categories = [...translatedCategories];

  return (
    <div className="w-full mx-auto px-4 md:px-8 pb-12 flex flex-col items-center font-['Inter'] bg-[#FFFFFF]">
      <div className="relative w-full h-112.5 rounded-[64px] overflow-hidden mt-0 shadow-sm shrink-0">
        <img
          src="/img/Image_Rest1.png"
          alt="Catalog Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        <div className="absolute left-20 bottom-14.5 z-20 w-98.25 flex flex-col gap-3 text-white">
          <h1 className="text-[36px] md:text-[48px] font-normal tracking-[-0.04em] leading-11">
            {t("catalog.freeDeliveryWeekend")}
          </h1>

          <p className="text-[16px] font-normal leading-[140%]">
            {t("catalog.stayInTreatYourself")}
          </p>
        </div>

        <div className="absolute right-20 bottom-14.5 z-20">
          <button className="flex items-center justify-center w-32.5 h-10.5 rounded-[100px] border-2 border-white text-white text-[18px] tracking-[-0.02em] hover:bg-white hover:text-black transition duration-300 whitespace-nowrap">
            {t("catalog.orderNow")}
          </button>
        </div>
      </div>

      <section className="mt-30 flex flex-col md:flex-row justify-between items-start w-full gap-10">
        <div className="w-full md:w-auto">
          <h2 className="text-[64px] font-normal tracking-[-0.04em] leading-none text-black">
            {t("catalog.exploreLocalFlavors")}
          </h2>
        </div>

        <div className="relative w-full max-w-181.75 h-67.5 rounded-4xl overflow-hidden shrink-0">
          <img
            src="/img/ImageRest2.png"
            alt="New partner restaurant"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20 z-10"></div>

          <div className="absolute top-6 right-6 z-20">
            <span className="bg-white/20 backdrop-blur-md border border-white/40 text-white text-[12px] px-4 py-1.5 rounded-[100px] font-sans">
              New Arrival
            </span>
          </div>

          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-full max-w-105 text-white flex flex-col gap-3">
            <h3 className="text-[24px] font-normal tracking-[-0.04em] leading-7.25 mb-3">
              {t("catalog.meetNewPartner")}
            </h3>

            <p className="text-[16px] font-normal leading-[140%] text-gray-100 mb-6">
              {t("catalog.authenticPizza")}
            </p>

            <div>
              <button className="border border-white text-white px-5 py-1.5 rounded-[100px] text-[16px] hover:bg-white hover:text-black transition duration-300">
                {t("catalog.exploreMenu")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mt-22.5">
        <h2 className="text-[48px] font-normal tracking-[-0.04em] text-black mb-16">
          {t("catalog.exploreLocalRestaurants")}
        </h2>

        <div className="w-full flex justify-center">
          <div className="flex flex-col lg:flex-row justify-between items-start w-full max-w-423 gap-30">
            <div className="flex flex-col gap-5 w-full max-w-211.25 items-start">
              <CatalogTab
                categories={categories}
                activeCategory={activeCategory}
                onCategorySelect={setActiveCategory}
              />

              <div className="relative w-full h-13.25">
                <input
                  type="text"
                  placeholder={t("catalog.cravingPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full px-6 py-4 rounded-[100px] bg-[#EFEFF1] border-none outline-none text-center text-[18px] tracking-[-0.04em] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)]"
                />
                <img
                  src={searchIcon}
                  alt="Search"
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 "
                />
              </div>
            </div>

            <div className="w-full max-w-181.75 shrink-0 mt-0">
              <p className="text-[16px] font-normal leading-[140%] text-gray-800">
                {t("catalog.browseDescription")}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-16">
          <div className="w-full max-w-423">
            <RestaurantList
              searchQuery={searchQuery}
              activeCategory={activeCategory}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
