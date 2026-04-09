import { HeroBlock as HomeHero } from "../../components/heroBlock/HeroBlock";
import { Highlights as HomeHighlights } from "../../components/highlights/Highlights";
import { Trending as HomeTrending } from "../../components/trending/Trending";
import { Cards as HomeCardRestaurants } from "../../components/cards/Cards";
import { heroData, highlightCards, trendingSection } from "./homeConstants";

export function Home() {
  // const [restaurants, setRestaurants] = useState([]);
  // const [isloading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getRestaurants();
  //       setRestaurants(data);
  //     } catch (error) {
  //       console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20 space-y-8 flex flex-col gap-45">
      <HomeHero {...heroData} />
      <HomeHighlights {...highlightCards} />
      <HomeTrending {...trendingSection} />
      {/* <HomeCardRestaurants {...restaurantCards} /> */}
      {/* <HomeRestaurants restaurants={restaurants} isLoading={isloading} /> вернуться и сделать подобный функционал на беке для  HomeCardRestaurants */}
    </div>
  );
}
