export function Highlights({
  sectionData = {
    headingLines: ["", ""],
    description: "",
  },
  statsData = [],
  cards = [],
  className = "",
}) {
  const { headingLines, description } = sectionData;

  return (
    <section className={`w-full px-4 py-20 ${className}`.trim()}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-[32px] text-left font-bold text-gray-900 mb-6">
            {headingLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < headingLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <p className="text-gray-600 text-left text-base mb-10">
            {description}
          </p>

          <div className="flex flex-wrap justify-between gap-6 w-full">
            {statsData.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-black">
                  <img
                    src={item.icon}
                    alt={item.label}
                    width={32}
                    height={32}
                  />
                </div>
                <span className="text-black text-lg font-bold">
                  {item.value}
                </span>
                <p className="text-black text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex items-center gap-6 p-6 bg-[#8F9BB1] rounded-2xl shadow-sm border border-[#8F9BB1]"
            >
              <div className="w-64 h-32 bg-white rounded-lg flex items-center justify-center py-8 px-3">
                <img src={card.icon} alt={card.title} />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-medium text-white text-left">
                  {card.title}
                </h3>
                <p className="text-white text-left text-lg">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
