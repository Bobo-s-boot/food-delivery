import { dataForFooter } from "./consts";

export function Footer() {
  return (
    <footer className="w-full bg-[#0BB653] text-white py-12 px-10 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Разбиваем массив на 3 колонки, как в дизайне */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-medium">
          {dataForFooter.map((data, index) => (
            <li key={index}>{data}</li>
          ))}
        </ul>
      </div>
    </footer>
  );
}