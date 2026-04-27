import { useTranslation } from "react-i18next";
import { HeroBlock as HomeHero } from "../../components/heroBlock/HeroBlock";
import { Highlights as HomeHighlights } from "../../components/highlights/Highlights";
import { Trending as HomeTrending } from "../../components/trending/Trending";
import { Cards as HomeCardRestaurants } from "../../components/cards/Cards";
import { heroData, highlightCards, trendingSection } from "./const";
import { useEffect, useState } from "react";
import { getRestaurants } from "../../api/restaurantService";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";
import { Loading } from "../../components/loading/Loading";

export function Home() {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const translatedHeroData = {
    ...heroData,

    titleLines: [t("home.hero.titleLine1"), t("home.hero.titleLine2")],

    description: [
      t("home.hero.descriptionLine1"),
      t("home.hero.descriptionLine2"),
    ],

    actionLabel: t("home.hero.actionLabel"),

    noteLines: [t("home.hero.noteLine1"), t("home.hero.noteLine2")],
  };

  const translatedHighlightCards = {
    sectionData: {
      headingLines: [
        t("home.highlights.sectionData.headingLine1"),
        t("home.highlights.sectionData.headingLine2"),
      ],
      description: t("home.highlights.sectionData.description"),
    },

    statsData: highlightCards.statsData.map((stat) => ({
      ...stat,
      label: t(`home.highlights.stats.${stat.key}`),
    })),

    cards: highlightCards.cards.map((card) => ({
      ...card,
      title: t(
        `home.highlights.${card.title.toLowerCase().replace(/\s+/g, "")}.title`,
      ),

      description: t(
        `home.highlights.${card.title.toLowerCase().replace(/\s+/g, "")}.description`,
      ),
    })),
  };

  const translatedTrendingSection = {
    ...trendingSection,

    sectionData: {
      ...trendingSection.sectionData,

      heading: t("home.trending.heading"),
      description: t("home.trending.description"),
      buttonLabel: t("home.trending.buttonLabel"),
    },

    cards: (Array.isArray(restaurants) ? restaurants : []).map(
      (card, index) => ({
        ...card,
        id: card.id || `home-rest-${index}`,
        name: card.name || card.title || "Restaurant",
        badge: card.tags && card.tags.length > 0 ? card.tags[0] : "",
        image:
          typeof card.image === "string" && card.image.startsWith("/img/")
            ? card.image
            : `/img/card-${(index % 8) + 1}.png`,
      }),
    ),
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20 space-y-8 flex flex-col gap-45">
      <HomeHero {...translatedHeroData} />
      <HomeHighlights {...translatedHighlightCards} />

      <>
        {isLoading ? (
          <Loading message={"restourants"} />
        ) : (
          <HomeTrending {...translatedTrendingSection} />
        )}
      </>

      {/* <HomeCardRestaurants {...restaurantCards} /> */}
      {/* <HomeRestaurants restaurants={restaurants} isLoading={isloading} /> вернуться и сделать подобный функционал на беке для  HomeCardRestaurants */}
    </div>
  );
}
