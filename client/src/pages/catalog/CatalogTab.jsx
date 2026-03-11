export function CatalogTab({ catregorys }) {
  return (
    <div className="flex justify-center gap-4 overflow-x-auto p-4 scrollbar-hide">
      {catregorys.map((category, index) => (
        <button
          key={index}
          className="whitespace-nowrap px-6 py-2 bg-white rounded-full shadow-sm hover:bg-green-500 hover:text-white transition text-black"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
