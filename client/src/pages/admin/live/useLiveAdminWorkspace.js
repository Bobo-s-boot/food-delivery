import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenActive } from "../../../api/authService";
import { adminGetRestaurants } from "../../../api/restaurantService";
import { adminGetOrders, adminUpdateOrderStatus } from "../../../api/orderService";
import {
  adminGetDishes,
  createDish,
  deleteDish,
  updateDish,
} from "../../../api/dishService";
import {
  buildLiveOrderRows,
  buildMenuAvailability,
  formatDishPayload,
  initialDishFormData,
} from "./liveAdmin.utils";

const STATIC_ADMIN_SECTIONS = new Set([
  "dashboard",
  "restaurants",
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

    setIsLoading(false);
  }, [navigate, loadDishesWorkspace, loadLiveOrders, previewMode, section]);

  const handleSaveDish = async (event) => {
    event.preventDefault();
    if (previewMode) {
      setIsDishFormOpen(false);
      setEditingDish(null);
      return;
    }

    try {
      if (!dishFormData.restaurantId) {
        alert("Выберите ресторан для блюда");
        return;
      }

      const formattedData = formatDishPayload(dishFormData);
      if (editingDish) {
        await updateDish(editingDish._id, formattedData);
      } else {
        await createDish(formattedData);
      }

      setIsDishFormOpen(false);
      setEditingDish(null);
      setDishFormData({ ...initialDishFormData });
      await loadDishesWorkspace();
    } catch (error) {
      alert(
        "Ошибка при сохранении блюда: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleEditDishClick = (dish) => {
    const rawDish = dishesRaw.find(
      (item) => item._id === dish.id || item.name === dish.item,
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (previewMode) return;

    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      await loadLiveOrders();
    } catch (error) {
      alert(
        "Ошибка при обновлении статуса заказа: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDeleteDish = async (id) => {
    if (previewMode) return;
    if (!window.confirm("Удалить это блюдо из меню?")) return;

    try {
      await deleteDish(id);
      await loadDishesWorkspace();
    } catch (error) {
      console.error("Error deleting dish", error);
      alert("Ошибка при удалении блюда. Проверьте права доступа.");
    }
  };

  return {
    isLoading,
    restaurantsRaw,
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
  };
}
