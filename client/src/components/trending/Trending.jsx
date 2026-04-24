import { motion } from "motion/react";
import { useState } from "react";
import { useLandingMotion } from "../../motion/safeMotion";
import { useNavigate } from "react-router-dom";

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
  const lm = useLandingMotion();
  const navigate = useNavigate();

  const VISIBLE_CARDS = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const safeCards = Array.isArray(cards) ? cards.filter(Boolean) : [];
  const hasCards = safeCards.length > 0;

  const handleNext = () => {
    if (!hasCards) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % safeCards.length);
  };

  const handlePrevious = () => {
    if (!hasCards) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + safeCards.length) % safeCards.length);
  };

  const carouselGridVariants = {
    hidden: (d) => ({
      x: lm.reduced ? 0 : (d ?? 1) * 36,
      opacity: lm.reduced ? 1 : 0.9,
    }),

    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 420, damping: 36, mass: 0.72 },
        opacity: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  };

  const visibleCards = [];
  if (hasCards) {
    for (let i = 0; i < VISIBLE_CARDS; i++) {
      visibleCards.push(safeCards[(currentIndex + i) % safeCards.length]);
    }
  }

  return (
    <section
      className={`w-full px-4 py-10 bg-[#EDECF1] rounded-4xl ${className}`.trim()}
    >
      <motion.div
        className="flex justify-between items-end mb-8"
        variants={lm.highlightsLeft}
        initial="hidden"
        whileInView="visible"
        viewport={lm.viewport}
      >
        <div className="flex flex-row items-center justify-between w-full mb-8 gap-8">
          <motion.h2
            className="text-3xl font-medium text-gray-900 shrink-0"
            variants={lm.highlightsLeftChild}
          >
            {heading}
          </motion.h2>

          <motion.p
            className="text-gray-500 text-right max-w-md"
            variants={lm.highlightsLeftChild}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        key={currentIndex}
        custom={direction}
        variants={carouselGridVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {visibleCards.map((card, index) => {
          const cardName = card.name || card.title || "";

          return (
            <motion.div
            key={card.id ? `${card.id}-${index}` : `trending-card-${index}`}
            className="rounded-2xl border-[#EDECF1] group relative flex min-h-0 flex-col"
            variants={lm.gridItem}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            whileHover={lm.reduced ? undefined : { y: -6 }}
          >
            <span className="absolute top-4 right-4 z-10 w-24 h-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
              <p className="text-sm text-slate-100">{card?.badge}</p>
            </span>

            <div className="relative w-full aspect-3/4 shrink-0 bg-[#EDECF1] overflow-hidden rounded-3xl">
              <img
                src={card.image}
                alt={cardName}
                className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="absolute bottom-4 left-4 z-10 flex items-center justify-center shadow">
              <div className="flex flex-col col-1 items-start gap-1">
                <h3 className="text-slate-100 font-semibold text-xl">
                  {cardName}
                </h3>

                <p className="flex flex-row text-sm text-slate-200 gap-2">
                  {card.category} |
                  {ratingIcon ? (
                    <>
                      <img src={ratingIcon} alt="Rating" /> {card.rating}
                    </>
                  ) : (
                    ` | ${card.rating}`
                  )}
                </p>

                <address className="flex flex-row text-slate-200 text-sm gap-2">
                  {locationIcon && <img src={locationIcon} alt="Location" />}
                  {card.location}
                </address>
              </div>
            </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="flex justify-between items-center w-full mt-10"
        variants={lm.footerRow}
        initial="hidden"
        whileInView="visible"
        viewport={lm.viewport}
      >
        <motion.button
          type="button"
          className="bg-[#0D1A2D] text-white py-2 px-4 rounded-3xl hover:bg-[#5f5d5d] transition-colors duration-300"
          whileHover={lm.reduced ? undefined : { scale: 1.03 }}
          whileTap={lm.reduced ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 450, damping: 22 }}
          onClick={() => navigate("/catalog")}
        >
          {buttonLabel}
        </motion.button>

        <div className="flex flex-row gap-4">
          <motion.button
            type="button"
            onClick={handlePrevious}
            className="w-12 h-12 rounded-full border border-gray-900 text-[#0F1316] flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
            whileHover={lm.reduced ? undefined : { scale: 1.08 }}
            whileTap={lm.reduced ? undefined : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            {pagination.previousIcon ? (
              <img src={pagination.previousIcon} alt="Previous" />
            ) : (
              "<"
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-gray-900 text-[#0F1316] flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
            whileHover={lm.reduced ? undefined : { scale: 1.08 }}
            whileTap={lm.reduced ? undefined : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            {pagination.nextIcon ? (
              <img src={pagination.nextIcon} alt="Next" />
            ) : (
              ">"
            )}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
