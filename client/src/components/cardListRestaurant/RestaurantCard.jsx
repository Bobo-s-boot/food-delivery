export function RestaurantCard({ data }) {
  return (
    <div
      key={data.id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform"
    >
      <img
        src={data.image}
        alt={data.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-500">{data.name}</h2>
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
            ⭐ {data.rating}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4">{data.description}</p>
        <button className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900">
          Переглянути меню
        </button>
      </div>
    </div>
  );
}
