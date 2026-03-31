import { HeroBlock } from "../../components/heroBlock/HeroBlock";
import { heroData } from "./homeConstants";
import { HomeHighlights } from "../../components/home/HomeHighlights";
import { HomeTrending } from "../../components/home/HomeTrending";

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
    <div className="w-full min-h-screen bg-gray-50 pb-20 space-y-8 flex flex-col">
      <HeroBlock {...heroData} />
      <HomeHighlights />
      <HomeTrending />
      {/* <HomeRestaurants restaurants={restaurants} isLoading={isloading} /> вернуться и сделать подобный функционал для  HomeTrending */}
    </div>
  );
}
