import searchIcon from "../../assets/search.svg";

export function CatalogSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full h-13.25">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-full px-6 py-4 rounded-[100px] bg-[#EFEFF1] border-none outline-none text-center text-[18px] tracking-[-0.04em] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)]"
      />
      <img
        src={searchIcon}
        alt="Search"
        className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5"
      />
    </div>
  );
}
