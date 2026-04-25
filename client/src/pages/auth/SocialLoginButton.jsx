export function SocialLoginButton({ provider, icon, alt, label, onLogin }) {
  return (
    <button
      type="button"
      onClick={() => onLogin(provider)}
      className="w-[47%] lg:w-72.25 h-12 box-border rounded-[100px] border-2 border-white flex items-center justify-start px-3 lg:px-6 gap-2 hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
    >
      <img src={icon} alt={alt} className="w-5 h-5 object-contain shrink-0" />
      <span className="text-white text-[14px] lg:text-[20px] font-normal leading-6 tracking-[-0.04em] overflow-hidden text-ellipsis">
        {label}
      </span>
    </button>
  );
}
