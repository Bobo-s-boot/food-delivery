export function HeaderIcons({ href, alt, width, height, onClick }) {
  return (
    <button className="text-white px-4 py-2 rounded-lg" onClick={onClick}>
      <img src={href} width={width} height={height} alt={alt} />
    </button>
  );
}
