import searchIcon from "../../assets/search.svg";

export function MenuSearch({ value, onChange, placeholder }) {
  return (
    <div className="w-full h-13.5 xl:h-16 bg-[#EFEFF1] rounded-[100px] flex items-center justify-center mt-13.5 px-10 shrink-0">
      <div className="relative flex items-center justify-center">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 bg-transparent text-[18px] xl:text-[20px] tracking-[-0.04em] text-center text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] focus:outline-none"
        />
        <img
          src={searchIcon}
          alt="Search"
          className="w-5 h-5 ml-4 opacity-40 grayscale brightness-0"
        />
      </div>
    </div>
  );
}
