export function Header() {
  return (
    <header className="mb-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-green-600">FoodExpress</h1>
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
        Кошик (0)
      </button>
    </header>
  );
}
