import { useEffect, useState } from "react";
import { getRestaurants } from "../api/restaurantService";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";
import { formatRestaurant } from "../components/cardListRestaurant/utils/restaurantUtils";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();

        if (isMounted) {
          setRestaurants(data.map(formatRestaurant));
        }
      } catch (error) {
        if (isMounted) {
          console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  return { restaurants, isLoading };
}
