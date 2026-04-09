export function ProductCard({ item }) {
  return (
    <div className="relative w-full aspect-[442/552] rounded-[32px] overflow-hidden group font-['Inter'] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-[#0D1A2D]">
      
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/90 pointer-events-none" />

      <div className="absolute top-[23px] right-[24px] flex flex-row justify-center items-center px-[16px] py-[8px] bg-white/25 backdrop-blur-md rounded-[100px] z-10 border border-white/10">
        <span className="text-white text-[14px] font-medium leading-[130%] tracking-[0.02em]">
          {item.price} $
        </span>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-[24px] flex flex-col gap-[12px] z-10">
        
        <h3 className="text-[24px] font-semibold text-white leading-[140%] m-0 truncate">
          {item.title}
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-[12px] text-[16px] text-white/90 font-normal leading-[140%]">
            <span>{item.category}</span>
            <span className="text-white/40">|</span>
            <span>{item.weight}</span>
            <span className="text-white/40">|</span>
            <span>{item.calories}</span>
          </div>

          <div className="flex flex-row items-center gap-[6px] text-[16px] text-white">
            <div className="flex items-center justify-center">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="#E9EE5D" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.7L14.7 8.9H22.3L16.2 13.5L18.9 20.7L12 16.1L5.1 20.7L7.8 13.5L1.7 8.9H9.3L12 1.7Z" />
               </svg>
            </div>
            <span className="font-medium">{item.rating}</span>
            <span className="text-white/60">({item.reviews})</span>
          </div>
        </div>

        <p className="text-[16px] text-white/70 font-normal leading-[140%] line-clamp-2 m-0">
          {item.description}
        </p>

      </div>
    </div>
  );
}