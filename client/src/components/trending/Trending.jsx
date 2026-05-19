import { motion } from "motion/react";
import { useState } from "react";
import { useLandingMotion } from "../../motion/safeMotion";
import { useNavigate } from "react-router-dom";
import "./Trending.scss";

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
    <section className={`trending ${className}`.trim()}>
      <motion.div
        className="trending__header"
        variants={lm.highlightsLeft}
        initial="hidden"
        whileInView="visible"
        viewport={lm.viewport}
      >
        <div className="trending__header-row">
          <motion.h2
            className="trending__title"
            variants={lm.highlightsLeftChild}
          >
            {heading}
          </motion.h2>
          <motion.p
            className="trending__description"
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
        className="trending__grid"
      >
        {visibleCards.map((card, index) => {
          const cardName = card.name || card.title || "";

          return (
            <motion.div
              key={card.id ? `${card.id}-${index}` : `trending-card-${index}`}
              className="trending-card"
              variants={lm.gridItem}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              whileHover={lm.reduced ? undefined : { y: -6 }}
            >
              <span className="trending-card__badge">
                <p className="trending-card__badge-text">{card?.badge}</p>
              </span>

              <div className="trending-card__image-wrapper">
                <img
                  src={card.image}
                  alt={cardName}
                  className="trending-card__image"
                />
                <div className="trending-card__gradient" />
              </div>

              <div className="trending-card__info">
                <h3 className="trending-card__name">{cardName}</h3>
                <p className="trending-card__meta">
                  {card.category}
                  <span className="trending-card__divider">|</span>
                  {ratingIcon ? (
                    <>
                      <img
                        src={ratingIcon}
                        alt="Rating"
                        className="trending-card__icon"
                      />
                      {card.rating}
                    </>
                  ) : (
                    card.rating
                  )}
                </p>
                <address className="trending-card__location">
                  {locationIcon && (
                    <img
                      src={locationIcon}
                      alt="Location"
                      className="trending-card__icon"
                    />
                  )}
                  {card.location}
                </address>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="trending__footer"
        variants={lm.footerRow}
        initial="hidden"
        whileInView="visible"
        viewport={lm.viewport}
      >
        <motion.button
          type="button"
          className="trending__cta-button"
          whileHover={lm.reduced ? undefined : { scale: 1.03 }}
          whileTap={lm.reduced ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 450, damping: 22 }}
          onClick={() => navigate("/catalog")}
        >
          {buttonLabel}
        </motion.button>

        <div className="trending__controls">
          <motion.button
            type="button"
            onClick={handlePrevious}
            className="trending__control-button"
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
            className="trending__control-button"
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
