import axios from "axios";
import { useTranslation } from "react-i18next";
import { HeroBlock as HomeHero } from "../../components/heroBlock/HeroBlock";
import { Highlights as HomeHighlights } from "../../components/highlights/Highlights";
import { Trending as HomeTrending } from "../../components/trending/Trending";
import { Cards as HomeCardRestaurants } from "../../components/cards/Cards";
import { heroData, highlightCards, trendingSection } from "./const";
import { useEffect, useState } from "react";
import { getRestaurants } from "../../api/restaurantService";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";

export function Home() {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(getRestaurants());

        setRestaurants(response.data);
      } catch (error) {
        console.error("Ошибка сети:", error);
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

    cards: restaurants.map((card) => ({
      ...card,
      // Подставляем данные из нашей базы (как мы делали в прошлый раз)
      title: card.name,
      badge: card.tags && card.tags.length > 0 ? card.tags[0] : "",
      image: card.image || "",
    })),
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20 space-y-8 flex flex-col gap-45">
      <HomeHero {...translatedHeroData} />
      <HomeHighlights {...translatedHighlightCards} />
      <HomeTrending {...translatedTrendingSection} />
      {/* <HomeCardRestaurants {...restaurantCards} /> */}
      {/* <HomeRestaurants restaurants={restaurants} isLoading={isloading} /> вернуться и сделать подобный функционал на беке для  HomeCardRestaurants */}
    </div>
  );
}
