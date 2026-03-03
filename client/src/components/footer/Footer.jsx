import { dataForFooter } from "./consts";

export function Footer() {
  return (
    <footer className="bg-green-600 text-white text-left py-4 mt-8 rounded-xl">
      <div className="py-3 px-6">
        <ul className="grid grid-cols-3 gap-3 text-sm font-medium">
          {dataForFooter.map((data, index) => (
            <li key={index}>{data}</li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
