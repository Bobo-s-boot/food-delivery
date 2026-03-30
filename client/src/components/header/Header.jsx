import { useNavigate, Link } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <header className="bg-white h-[90px] px-4 lg:px-[39px] flex justify-between items-center w-full shrink-0">
      <div className="flex items-center gap-8 xl:gap-[178px]">
        <div 
          className="text-[32px] font-medium text-[#000811] tracking-[0.02em] cursor-pointer"
          onClick={() => navigate("/")}
        >
          Defilicious
        </div>
        
        {/* ИЗМЕНЕНИЕ: Настроил gap-[24px] между ссылками */}
        <nav className="hidden lg:flex items-center gap-[24px] text-[20px] text-[#0F1316] tracking-[-0.04em]">
          {/* ИЗМЕНЕНИЕ: Убрал bg-[#F2F2F2], оставил только рамку border-[#EEEEEE] */}
          <Link to="/catalog" className="box-border px-[16px] py-[8px] border border-[#EEEEEE] rounded-[100px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            Restaurants
          </Link>
          <Link to="/menu" className="px-[16px] py-[8px] rounded-[100px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            Menu
          </Link>
          <Link to="/specials" className="px-[16px] py-[8px] rounded-[100px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            Specials
          </Link>
          <Link to="/about" className="px-[16px] py-[8px] rounded-[100px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            Delivery
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-[24px]">
        <div className="relative hidden xl:flex items-center justify-between w-[454px] h-[54px] bg-[#EFEFF1] rounded-[100px] px-[24px]">
          <input 
            type="text" 
            placeholder="Search for dishes, restaurants or cuisines" 
            className="w-full bg-transparent text-[18px] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] outline-none tracking-[-0.04em]"
          />
          <svg className="w-[20px] h-[20px] text-[#0F1316] opacity-50 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div className="flex items-center gap-[16px]">
          <button className="w-[54px] h-[54px] bg-[#0D1A2D] rounded-[100px] flex items-center justify-center text-white hover:bg-gray-800 transition-colors shrink-0">
             <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </button>
          
          <button 
            onClick={user ? handleLogout : () => navigate("/auth")}
            className="w-[54px] h-[54px] bg-[#0D1A2D] rounded-[100px] flex items-center justify-center text-white hover:bg-gray-800 transition-colors shrink-0"
            title={user ? `Logout (${user.username})` : "Login"}
          >
             <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
}