import { useEffect, useState } from "react";
import { getRestaurants } from "../../api/restaurantService";
import { RestaurantList } from "../../components/cardListRestaurant/RestaurantList";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";
import smileIcon from "../../assets/smile.svg";
import clockIcon from "../../assets/clock.svg";
import starIcon from "../../assets/star.svg";
import maskIcon from "../../assets/mask.svg";
import headphonesIcon from "../../assets/headphones.svg";
import mapIcon from "../../assets/map.svg";
import arrowLeftIcon from "../../assets/chevron-left.svg";
import arrowRightIcon from "../../assets/chevron-right.svg";
import ratingIcon from "../../assets/rating.svg";
import locationIcon from "../../assets/location.svg";

export function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [isloading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20 space-y-8">
      {/* <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          name="search"
          placeholder="Шукайте ресторани..."
          className="w-full p-4 pl-12 rounded-2xl border border-green-200 shadow-sm focus:ring-2 focus:ring-green-500 outline-none bg-white text-black"
        />
        <span className="absolute left-4 top-4">🔍</span>
      </div> */}

      {/* {isloading ? (
        <div className="text-center text-gray-500 text-xl mt-10">
          Завантаження ресторанів з сервера...
        </div>
      ) : (
        <RestaurantList items={restaurants} />
      )} */}

      {/* === СЕКЦИЯ 1: HERO БАННЕР === */}
      <section className="max-w-450 mx-auto px-4 pt-4">
        <div
          className="relative w-full h-150 rounded-4xl overflow-hidden flex flex-col justify-center px-12"
          style={{
            backgroundImage: 'url("/img/backgroundImage.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 flex flex-col items-center  columns-1 text-white/90 mb-72">
            <h1 className="text- font-normal leading-tight mb-5">
              Explore Remarkable Restaurants Today <br />
              All In Once Place
            </h1>
            <p className="text-base text-white/90 mb-8 w-full text-center mx-auto">
              Join the ultimate dining experience - where taste meets
              convenience. Your next <br /> culinary adventure is just a click
              away.
            </p>
            <button className="bg-gray-900 text-white/90 px-4 py-3 rounded-full font-normal text-base hover:bg-gray-800 transition-colors">
              Start your own culinary journey
            </button>
          </div>

          <div className="absolute right-3 bottom-3 flex gap-2 z-10">
            <div className="flex items-center gap-3 justify-end ">
              <span className="px-4 py-2 text-white text-sm bg-white/20 backdrop-blur-sm cursor-pointer hover:bg-white/40 rounded-lg">
                Instagram
              </span>
              <span className="px-4 py-2 text-white text-sm bg-white/20 backdrop-blur-sm cursor-pointer hover:bg-white/40 rounded-lg">
                Facebook
              </span>
              <span className="px-4 py-2 text-white text-sm bg-white/20 backdrop-blur-sm cursor-pointer hover:bg-white/40 rounded-lg">
                Tik Tok
              </span>
            </div>
          </div>

          <div className="absolute left-3 bottom-3 flex gap-2 z-10">
            <div className="flex items-center justify-start ">
              <p className="font-normal text-white text-base drop-shadow-md leading-snug text-left">
                Highly rated by local foodies.
                <br />
                Get real results.
              </p>
            </div>

            <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1.6 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gray-200/90 z-30"></div>
              <div className="w-7 h-7 rounded-full bg-gray-200/90 -ml-3 z-20"></div>
              <div className="w-7 h-7 rounded-full bg-gray-200/90 -ml-3 z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-300 mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[32px] text-left font-bold text-gray-900 mb-6">
              Why Thousands of Foodies Choose
              <br />
              Defilicious Every Single Day
            </h2>
            <p className="text-gray-600 text-left text-base mb-10">
              From local hidden gems to top-rated restaurants, we make ordering
              your favorite meals fast, fresh, and hassle-free. Discover new
              flavors with seamless delivery and round-the-clock support.
            </p>

            <div className="flex justify-between max-w-115">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-black">
                  <img src={smileIcon} alt="smile" width={32} height={32} />
                </div>
                <span className="text-black text-lg font-bold">50k+</span>
                <p className="text-black text-sm">Happy Foodies</p>
              </div>

              <div className="flex justify-center items-center flex-col gap-2">
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-black">
                  <img src={clockIcon} alt="clock" width={32} height={32} />
                </div>
                <span className="text-black text-lg font-bold ">
                  {"<"} 30 Min
                </span>
                <p className="text-black text-sm">Average Delivery Time</p>
              </div>

              <div className="flex justify-center items-center flex-col gap-2">
                <div className="flex justify-center items-centerx w-12 h-12 rounded-full bg-black">
                  <img src={starIcon} alt="star" width={32} height={32} />
                </div>
                <span className="text-black text-lg font-bold">150+</span>
                <p className="text-black text-sm">Top-Rated Restaurants</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-6 p-6 bg-[#8F9BB1] rounded-2xl shadow-sm border border-[#8F9BB1]">
              <div className="w-64 h-32 bg-white rounded-lg flex items-center justify-center py-8 px-3">
                <img src={maskIcon} alt="mask" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-medium text-white text-left">
                  Handpicked Selection
                </h3>
                <p className="text-white text-left text-lg">
                  We partner only with the best local kitchens and highly-rated
                  chefs to guarantee a premium and delicious experience every
                  time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-[#8F9BB1] rounded-2xl shadow-sm border border-[#8F9BB1]">
              <div className="w-64 h-32 bg-white rounded-lg flex items-center justify-center text-2xl py-8 px-3">
                <img src={mapIcon} alt="map" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-medium text-white text-left">
                  Real-Time Tracking
                </h3>
                <p className="text-white text-left text-lg">
                  Track your order from the kitchen straight to your door. Fast,
                  seamless, and perfectly tailored to your cravings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-[#8F9BB1] rounded-2xl shadow-sm border border-[#8F9BB1]">
              <div className="w-76 h-32 bg-white rounded-lg flex items-center justify-center text-2xl py-8 px-3">
                <img src={headphonesIcon} alt="headphones" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-medium text-white text-left">
                  24/7 Customer Support
                </h3>
                <p className="text-white text-left text-lg">
                  Hungry at 2 AM? We’ve got you covered. Our support team is
                  always online to resolve any issues and ensure your food
                  arrives hot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-274 mx-auto px-4 py-10 bg-[#EDECF1] rounded-4xl">
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-row items-center justify-between w-full mb-8 gap-8">
            <h2 className="text-3xl font-medium text-gray-900 shrink-0">
              Trending Near You
            </h2>

            <p className="text-gray-500 text-right max-w-md">
              From cozy local cafes to premium dining spots, discover the best
              places to satisfy your cravings right now.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border-[#EDECF1] group relative">
            <span className="absolute top-4 right-4 z-10 w-24 h-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
              <p className="text-sm text-slate-100">Free Delivery</p>
            </span>

            <div className="relative w-full h-full bg-[#EDECF1] overflow-hidden rounded-3xl">
              <img
                src="./img/card-1.png"
                alt="restaurant"
                className="object-fill transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="absolute bottom-4 left-4 z-10  flex items-center justify-center shadow">
              <div className="flex flex-col col-1 items-start gap-1">
                <h3 className="text-slate-100 font-semibold text-xl">
                  The Burger Joint
                </h3>
                <p className="flex flex-row text-sm text-slate-200 gap-2">
                  American • Fast Food | <img src={ratingIcon} alt="Rating" />{" "}
                  4.8 (1.2k)
                </p>
                <address className="flex flex-row text-slate-200 text-sm gap-2">
                  <img src={locationIcon} alt="Location" /> Downtown District
                </address>
              </div>
            </div>
          </div>

          <div className="bg-[#EDECF1] rounded-2xl overflow-hidden  border-[#EDECF1] group relative">
            <span className="absolute top-4 right-4 z-10 w-24 h-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
              <p className="text-sm text-slate-100">20-30 min</p>
            </span>
            <div className="relative w-full h-full bg-[#EDECF1] overflow-hidden rounded-3xl">
              <img
                src="./img/card-2.png"
                alt="restaurant"
                className="object-fill transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="absolute bottom-4 left-4 z-10  flex items-center justify-center shadow">
              <div className="flex flex-col col-1 items-start gap-1">
                <h3 className="text-slate-100 font-semibold text-xl">
                  Kyoto Sushi & Wok
                </h3>
                <p className="flex flex-row text-sm text-slate-200 gap-2">
                  Japanese • Asian | <img src={ratingIcon} alt="Rating" /> 4.9
                  (950k)
                </p>
                <address className="flex flex-row text-slate-200 text-sm gap-2">
                  <img src={locationIcon} alt="Location" /> Westside Boulevard
                </address>
              </div>
            </div>
          </div>

          <div className="bg-[#EDECF1] rounded-2xl overflow-hidden  border-[#EDECF1] group relative">
            <span className="absolute top-4 right-4 z-10 w-24 h-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
              <p className="text-sm text-slate-100">15-20 min</p>
            </span>
            <div className="relative w-full h-full bg-[#EDECF1] overflow-hidden rounded-3xl">
              <img
                src="./img/card-3.png"
                alt="restaurant"
                className="object-fill transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="absolute bottom-4 left-4 z-10  flex items-center justify-center shadow">
              <div className="flex flex-col col-1 items-start gap-1">
                <h3 className="text-slate-100 font-semibold text-xl">
                  Fresh Poke Bowls
                </h3>
                <p className="flex flex-row text-sm text-slate-200 gap-2">
                  Healthy • Vegan | <img src={ratingIcon} alt="Rating" /> 4.7
                  (430)
                </p>
                <address className="flex flex-row text-slate-200 text-sm gap-2">
                  <img src={locationIcon} alt="Location" /> Green Park Area
                </address>
              </div>
            </div>
          </div>

          <div className="bg-[#EDECF1] rounded-2xl overflow-hidden  border-[#EDECF1] group relative">
            <span className="absolute top-4 right-4 z-10 w-24 h-8 rounded-3xl flex items-center justify-center shadow-lg bg-white/20 backdrop-blur-sm">
              <p className="text-sm text-slate-100">-20% Today</p>
            </span>
            <div className="relative w-full h-full bg-[#EDECF1] overflow-hidden rounded-3xl">
              <img
                src="./img/card-4.png"
                alt="restaurant"
                className="object-fill transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="absolute bottom-4 left-4 z-10  flex items-center justify-center shadow">
              <div className="flex flex-col col-1 items-start gap-1">
                <h3 className="text-slate-100 font-semibold text-xl">
                  Luigi's Woodfire
                </h3>
                <p className="flex flex-row text-sm text-slate-200 gap-2">
                  Italian • Fast Pizza | <img src={ratingIcon} alt="Rating" />
                  4.6 (2.1k)
                </p>
                <div>
                  <address className="flex flex-row text-slate-200 text-sm gap-2">
                    <img src={locationIcon} alt="Location" /> Little Italy
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center w-full mt-10">
          <button className="bg-[#0D1A2D] text-white py-2 px-4 rounded-3xl hover:bg-[#5f5d5d] transition-colors duration-300">
            View all restaurants
          </button>

          <div className="flex flex-row gap-4">
            <button className="w-12 h-12 rounded-full border border-gray-900 text-[#0F1316] flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
              <img src={arrowLeftIcon} alt="Previous" />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-900 text-[#0F1316] flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
              <img src={arrowRightIcon} alt="Next" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
