export function Trending({
  sectionData = {
    heading: "",
    description: "",
    buttonLabel: "",
    pagination: {
      previousIcon: "",
      nextIcon: "",
    },
  },
  cards = [],
  cardMeta = {},
  className = "",
}) {
  const { heading, description, buttonLabel, pagination } = sectionData;
  const { ratingIcon, locationIcon } = cardMeta;

  return (
    <section
      className={`w-full px-4 py-10 bg-[#EDECF1] rounded-4xl ${className}`.trim()}
    >
      <div className="flex justify-between items-end mb-8">
        <div className="flex flex-row items-center justify-between w-full mb-8 gap-8">
          <h2 className="text-3xl font-medium text-gray-900 shrink-0">
            {heading}
          </h2>
          <p className="text-gray-500 text-right max-w-md">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl border-[#EDECF1] group relative"
          >
            <span className="absolute top-4 right-4 z-10 w-24 h-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
              <p className="text-sm text-slate-100">{card.badge}</p>
            </span>

            <div className="relative w-full h-full bg-[#EDECF1] overflow-hidden rounded-3xl">
              <img
                src={card.image}
                alt={card.title}
                className="object-fill transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="absolute bottom-4 left-4 z-10 flex items-center justify-center shadow">
              <div className="flex flex-col col-1 items-start gap-1">
                <h3 className="text-slate-100 font-semibold text-xl">
                  {card.title}
                </h3>
                <p className="flex flex-row text-sm text-slate-200 gap-2">
                  {card.category}
                  {ratingIcon ? (
                    <>
                      | <img src={ratingIcon} alt="Rating" /> {card.rating}
                    </>
                  ) : (
                    ` | ${card.rating}`
                  )}
                </p>
                <address className="flex flex-row text-slate-200 text-sm gap-2">
                  {locationIcon && <img src={locationIcon} alt="Location" />}{" "}
                  {card.location}
                </address>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center w-full mt-10">
        <button className="bg-[#0D1A2D] text-white text-2xl font-normal py-2 px-4 rounded-3xl hover:bg-[#5f5d5d] transition-colors duration-300">
          {buttonLabel}
        </button>

        <div className="flex flex-row gap-4">
          <button className="w-12 h-12 rounded-full border border-gray-900 text-[#0F1316] flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
            {pagination.previousIcon ? (
              <img src={pagination.previousIcon} alt="Previous" />
            ) : (
              "<"
            )}
          </button>
          <button className="w-12 h-12 rounded-full border border-gray-900 text-[#0F1316] flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
            {pagination.nextIcon ? (
              <img src={pagination.nextIcon} alt="Next" />
            ) : (
              ">"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
