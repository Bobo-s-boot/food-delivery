import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenActive } from "../../../api/authService";
import {
  adminGetOrders,
  adminUpdateOrderStatus,
} from "../../../api/orderService";
import {
  adminGetDishes,
  createDish,
  deleteDish,
  updateDish,
} from "../../../api/dishService";

import {
  adminGetRestaurants,
  adminCreateRestaurant,
  adminUpdateRestaurant,
  adminDeleteRestaurant,
} from "../../../api/restaurantService";
import { getUsers } from "../../../api/userService";

import {
  buildMenuAvailability,
  formatDishPayload,
  initialDishFormData,
} from "./liveAdmin.utils";
import {
  ADMIN_CONFIRM_MESSAGES,
  ADMIN_ERROR_MESSAGES,
  buildAdminErrorMessage,
} from "../../../errors/error.js";

const STATIC_ADMIN_SECTIONS = new Set(["dashboard", "finance", "support"]);

export function useLiveAdminWorkspace({ section }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [restaurantsRaw, setRestaurantsRaw] = useState([]);
  const [dishesRaw, setDishesRaw] = useState([]);
  const [usersRaw, setUsersRaw] = useState([]);
  const [menuAvailability, setMenuAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(
    () => !STATIC_ADMIN_SECTIONS.has(section),
  );
  const [isDishFormOpen, setIsDishFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishFormData, setDishFormData] = useState({ ...initialDishFormData });

  const loadLiveOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setOrders(await adminGetOrders());
    } catch (error) {
      console.error(ADMIN_ERROR_MESSAGES.LOAD_ORDERS, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDishesWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      const [restaurantsData, dishesData] = await Promise.all([
        adminGetRestaurants(),
        adminGetDishes(),
      ]);

      setRestaurantsRaw(restaurantsData);
      setDishesRaw(dishesData);
      setMenuAvailability(buildMenuAvailability(dishesData));
    } catch (error) {
      console.error(ADMIN_ERROR_MESSAGES.LOAD_DISHES, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load restaurants, dishes and orders for the restaurants section
  const loadRestaurantsWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      const [restaurantsData, dishesData, ordersData] = await Promise.all([
        adminGetRestaurants(),
        adminGetDishes(),
        adminGetOrders(),
      ]);

      setRestaurantsRaw(restaurantsData);
      setDishesRaw(dishesData);
      setOrders(ordersData);
      setMenuAvailability(buildMenuAvailability(dishesData));
    } catch (error) {
      console.error(ADMIN_ERROR_MESSAGES.LOAD_RESTAURANTS_WORKSPACE, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUsersWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      const [usersData, ordersData] = await Promise.all([
        getUsers(),
        adminGetOrders(),
      ]);

      setUsersRaw(usersData);
      setOrders(ordersData);
    } catch (error) {
      console.error(ADMIN_ERROR_MESSAGES.LOAD_USERS_WORKSPACE, error);
      setUsersRaw([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isTokenActive()) {
      localStorage.removeItem("user");
      navigate("/auth", { replace: true });
      return;
    }

    if (STATIC_ADMIN_SECTIONS.has(section)) {
      setIsLoading(false);
      return;
    }

    if (section === "orders") {
      loadLiveOrders();
      return;
    }

    if (section === "dishes") {
      loadDishesWorkspace();
      return;
    }

    if (section === "restaurants") {
      loadRestaurantsWorkspace();
      return;
    }

    if (section === "users") {
      loadUsersWorkspace();
      return;
    }

    setIsLoading(false);
  }, [
    navigate,
    loadDishesWorkspace,
    loadRestaurantsWorkspace,
    loadUsersWorkspace,
    loadLiveOrders,
    section,
  ]);

  // --- DISH HANDLERS ---

  const handleSaveDish = async (dishDataOrEvent, dishId) => {
    if (dishDataOrEvent?.preventDefault) {
      dishDataOrEvent.preventDefault();
    }

    let dishData = dishDataOrEvent;

    if (dishDataOrEvent?.currentTarget) {
      const formData = new FormData(dishDataOrEvent.currentTarget);
      dishData = Object.fromEntries(formData.entries());
    }

    try {
      const id = dishId || dishData?.id || editingDish?.id;

      const payload =
        typeof formatDishPayload === "function"
          ? formatDishPayload(dishData)
          : dishData;

      if (id) {
        await updateDish(id, payload);
      } else {
        await createDish(payload);
      }

      if (section === "restaurants") {
        await loadRestaurantsWorkspace();
      } else {
        await loadDishesWorkspace();
      }

      setIsDishFormOpen(false);
      setEditingDish(null);
    } catch (error) {
      console.error(ADMIN_ERROR_MESSAGES.SAVE_DISH, error.response?.data);
      alert(buildAdminErrorMessage("SAVE_DISH", error));
    }
  };

  const handleEditDishClick = (dish) => {
    const rawDish = dishesRaw.find(
      (item) =>
        item._id === dish.id || item.id === dish.id || item.name === dish.item,
    );
    if (!rawDish) return;

    setEditingDish(rawDish);
    setDishFormData({
      name: rawDish.name || "",
      description: rawDish.description || "",
      price: rawDish.price || "",
      image: rawDish.image || "",
      category: rawDish.category || "",
      restaurantId: rawDish.restaurantId?._id || rawDish.restaurantId || "",
    });
    setIsDishFormOpen(true);
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm(ADMIN_CONFIRM_MESSAGES.DELETE_DISH)) return;

    try {
      await deleteDish(id);
      if (section === "restaurants") {
        await loadRestaurantsWorkspace();
      } else {
        await loadDishesWorkspace();
      }
    } catch (error) {
      console.error(ADMIN_ERROR_MESSAGES.DELETE_DISH, error);
      alert(buildAdminErrorMessage("DELETE_DISH", error));
    }
  };

  // --- RESTAURANT HANDLERS ---

  const handleCreateRestaurant = async (restaurantData) => {
    try {
      const created = await adminCreateRestaurant(restaurantData);
      await loadRestaurantsWorkspace();
      return created;
    } catch (error) {
      alert(buildAdminErrorMessage("CREATE_RESTAURANT", error));
      throw error;
    }
  };

  const handleUpdateRestaurant = async (id, restaurantData) => {
    try {
      const res = await adminUpdateRestaurant(id, restaurantData);

      const updatedRestaurant = res?.data || res;

      setRestaurantsRaw((prev) =>
        prev.map((item) =>
          item._id === id || item.id === id
            ? { ...item, ...updatedRestaurant }
            : item,
        ),
      );
      return updatedRestaurant;
    } catch (error) {
      console.error(ADMIN_ERROR_MESSAGES.UPDATE_RESTAURANT, error);
      throw error;
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm(ADMIN_CONFIRM_MESSAGES.DELETE_RESTAURANT)) return;

    try {
      await adminDeleteRestaurant(id);
      // Удаляем из локального стора строго по _id
      setRestaurantsRaw((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(ADMIN_ERROR_MESSAGES.DELETE_RESTAURANT, error);
      alert(buildAdminErrorMessage("DELETE_RESTAURANT", error));
    }
  };

  // --- ORDER HANDLERS ---

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      if (section === "restaurants") {
        await loadRestaurantsWorkspace();
      } else {
        await loadLiveOrders();
      }
    } catch (error) {
      alert(buildAdminErrorMessage("UPDATE_ORDER_STATUS", error));
    }
  };

  return {
    isLoading,
    orders,
    restaurantsRaw,
    dishesRaw,
    usersRaw,
    menuAvailability,
    isDishFormOpen,
    editingDish,
    dishFormData,
    setIsDishFormOpen,
    setEditingDish,
    setDishFormData,
    handleSaveDish,
    handleEditDishClick,
    handleUpdateStatus,
    handleDeleteDish,
    handleCreateRestaurant,
    handleUpdateRestaurant,
    handleDeleteRestaurant,
  };
}
