export function HeaderIcons({ href, alt, width, height }) {
  return (
    <button className="text-white px-4 py-2 rounded-lg">
      <img src={href} width={width} height={height} alt={alt} />
    </button>
  );
}
