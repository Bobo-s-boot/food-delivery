export function HeroBlock({
  titleLines = [],
  description = "",
  actionLabel = "",
  actionHref,
  onActionClick,
  backgroundImage,
  socialLinks = [],
  noteLines = [],
  sectionClassName = "",
  containerClassName = "",
  buttonClassName = "",
  contentClassName = "",
  rightPanelClassName = "",
  bottomPanelClassName = "",
  children,
}) {
  const actionContent = <span>{actionLabel}</span>;

  const actionElement = actionHref ? (
    <a
      href={actionHref}
      className={`bg-gray-900 text-white/90 px-4 py-3 rounded-full font-normal text-base hover:bg-gray-800 transition-colors ${buttonClassName}`.trim()}
    >
      {actionContent}
    </a>
  ) : (
    <button
      type="button"
      onClick={onActionClick}
      className={`bg-gray-900 text-white/90 px-4 py-3 rounded-full font-normal text-base hover:bg-gray-800 transition-colors ${buttonClassName}`.trim()}
    >
      {actionContent}
    </button>
  );

  const renderLines = (lines) =>
    lines.map((line, index) => (
      <span key={`${line}-${index}`}>
        {line}
        {index < lines.length - 1 ? <br /> : null}
      </span>
    ));

  return (
    <section className={`w-full px-4 pt-4 ${sectionClassName}`.trim()}>
      <div
        className={`relative w-full h-150 rounded-4xl overflow-hidden flex flex-col justify-center px-12 ${containerClassName}`.trim()}
        style={
          backgroundImage
            ? {
                backgroundImage: `url("${backgroundImage}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div
          className={`relative z-10 flex flex-col items-center text-white/90 mb-72 ${contentClassName}`.trim()}
        >
          <h1 className="text-center font-normal leading-tight mb-5">
            {renderLines(titleLines)}
          </h1>
          <p className="text-base text-white/90 mb-8 w-full text-center mx-auto">
            {description}
          </p>
          {actionElement}
        </div>

        {socialLinks.length > 0 && (
          <div
            className={`absolute right-3 bottom-3 flex gap-2 z-10 ${rightPanelClassName}`.trim()}
          >
            <div className="flex items-center gap-3 justify-end">
              {socialLinks.map((link, index) => {
                const label = typeof link === "string" ? link : link.label;
                return (
                  <span
                    key={`${label}-${index}`}
                    className="px-4 py-2 text-white text-sm bg-white/20 backdrop-blur-sm cursor-pointer hover:bg-white/40 rounded-lg"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div
          className={`absolute left-3 bottom-3 flex gap-2 z-10 ${bottomPanelClassName}`.trim()}
        >
          <div className="flex items-center justify-start">
            <p className="font-normal text-white text-base drop-shadow-md leading-snug text-left">
              {renderLines(noteLines)}
            </p>
          </div>

          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1.6 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-gray-200/90 z-30" />
            <div className="w-7 h-7 rounded-full bg-gray-200/90 -ml-3 z-20" />
            <div className="w-7 h-7 rounded-full bg-gray-200/90 -ml-3 z-10" />
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
