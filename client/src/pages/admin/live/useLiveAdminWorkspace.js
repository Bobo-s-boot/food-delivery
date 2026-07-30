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

import {
  buildLiveOrderRows,
  buildMenuAvailability,
  formatDishPayload,
  initialDishFormData,
} from "./liveAdmin.utils";

// Убираем "restaurants" из статических секций, чтобы в Live-режиме шла загрузка из БД
const STATIC_ADMIN_SECTIONS = new Set([
  "dashboard",
  "users",
  "finance",
  "support",
]);

export function useLiveAdminWorkspace({ section, previewMode }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [restaurantsRaw, setRestaurantsRaw] = useState([]);
  const [dishesRaw, setDishesRaw] = useState([]);
  const [menuAvailability, setMenuAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(
    () => !previewMode && !STATIC_ADMIN_SECTIONS.has(section),
  );
  const [isDishFormOpen, setIsDishFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishFormData, setDishFormData] = useState({ ...initialDishFormData });

  const loadLiveOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setOrders(await adminGetOrders());
    } catch (error) {
      console.error("Error loading admin orders", error);
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
      console.error("Error loading admin dishes", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загружаем рестораны, блюда И заказы для раздела restaurants
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
      console.error("Error loading admin restaurants workspace", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (previewMode) {
      setIsLoading(false);
      return;
    }

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

    setIsLoading(false);
  }, [
    navigate,
    loadDishesWorkspace,
    loadRestaurantsWorkspace,
    loadLiveOrders,
    previewMode,
    section,
  ]);

  // --- ОБРАБОТЧИКИ ДЛЯ БЛЮД ---

  const handleSaveDish = async (dishDataOrEvent, dishId) => {
    if (dishDataOrEvent?.preventDefault) {
      dishDataOrEvent.preventDefault();
    }

    if (previewMode) {
      setIsDishFormOpen(false);
      setEditingDish(null);
      return;
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
        console.log("Обновление блюда ID:", id, payload);
        await updateDish(id, payload);
      } else {
        console.log("Создание нового блюда:", payload);
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
      console.error("Ошибка при сохранении блюда:", error.response?.data);
      alert(
        "Ошибка при сохранении блюда: " +
          (error.response?.data?.message || error.message),
      );
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
    if (previewMode) return;
    if (!window.confirm("Удалить это блюдо из меню?")) return;

    try {
      await deleteDish(id);
      if (section === "restaurants") {
        await loadRestaurantsWorkspace();
      } else {
        await loadDishesWorkspace();
      }
    } catch (error) {
      console.error("Error deleting dish", error);
      alert("Ошибка при удалении блюда. Проверьте права доступа.");
    }
  };

  // --- ОБРАБОТЧИКИ ДЛЯ РЕСТОРАНОВ ---

  const handleCreateRestaurant = async (restaurantData) => {
    if (previewMode) return null;

    try {
      const created = await adminCreateRestaurant(restaurantData);
      await loadRestaurantsWorkspace();
      return created;
    } catch (error) {
      alert(
        "Ошибка при создании ресторана: " +
          (error.response?.data?.message || error.message),
      );
      throw error;
    }
  };

  const handleUpdateRestaurant = async (id, restaurantData) => {
    if (previewMode) return null;

    try {
      const updated = await adminUpdateRestaurant(id, restaurantData);
      setRestaurantsRaw((prev) =>
        prev.map((item) =>
          item._id === id || item.id === id ? updated : item,
        ),
      );
      return updated;
    } catch (error) {
      alert(
        "Ошибка при обновлении ресторана: " +
          (error.response?.data?.message || error.message),
      );
      throw error;
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (previewMode) return;
    if (!window.confirm("Удалить этот ресторан?")) return;

    try {
      await adminDeleteRestaurant(id);
      setRestaurantsRaw((prev) =>
        prev.filter((item) => item._id !== id && item.id !== id),
      );
    } catch (error) {
      console.error("Error deleting restaurant", error);
      alert("Ошибка при удалении ресторана. Проверьте права доступа.");
    }
  };

  // --- ОБРАБОТЧИКИ ДЛЯ ЗАКАЗОВ ---

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (previewMode) return;

    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      if (section === "restaurants") {
        await loadRestaurantsWorkspace();
      } else {
        await loadLiveOrders();
      }
    } catch (error) {
      alert(
        "Ошибка при обновлении статуса заказа: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return {
    isLoading,
    orders,
    restaurantsRaw,
    dishesRaw,
    menuAvailability,
    liveOrdersData: buildLiveOrderRows(orders),
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
