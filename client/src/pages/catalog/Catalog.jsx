import { CatalogTab } from "./CatalogTab";
import { CATEGORIES } from "./const";

export function Catalog() {
  return (
    <div className="space-y-8">
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          name="search"
          placeholder="Шукайте ресторани..."
          className="w-full p-4 pl-12 rounded-2xl border border-green-200 shadow-sm focus:ring-2 focus:ring-green-500 outline-none bg-white text-black"
        />
        <span className="absolute left-4 top-4">🔍</span>
      </div>

      <CatalogTab catregorys={CATEGORIES} />
    </div>
  );
}
