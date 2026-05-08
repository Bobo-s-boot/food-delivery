import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Чтобы достать ID ресторана из URL
import { getDishesByRestaurant } from "../../api/dishService";

export function Restaurant() {
  const { id } = useParams(); // Получаем ID ресторана из адресной строки
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        // Вызываем нашу функцию из сервиса, передавая ID ресторана
        const menuData = await getDishesByRestaurant(id);
        setDishes(menuData);
      } catch (error) {
        console.error("Не удалось загрузить меню", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id]);

  if (isLoading)
    return <div className="text-amber-300">Загружаем вкусное меню... 🍕</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Меню</h2>

      {dishes.length === 0 ? (
        <p className="text-gray-500">
          В этом ресторане пока нет добавленных блюд.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="border rounded-xl p-4 shadow-sm bg-white flex flex-col"
            >
              {/* Если у блюда есть картинка, выводим её */}
              {dish.image && (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              <h3 className="text-lg font-bold">{dish.name}</h3>
              <p className="text-gray-600 text-sm mt-1 flex-grow">
                {dish.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">
                  {dish.price} ₴
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
