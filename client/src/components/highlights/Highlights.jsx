import { motion } from "motion/react";
import { useLandingMotion } from "../../motion/safeMotion";
import "./Highlights.scss";

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
  const lm = useLandingMotion();

  return (
    <section className={`highlights ${className}`.trim()}>
      <div className="highlights__grid">
        <motion.div
          variants={lm.highlightsLeft}
          initial="hidden"
          whileInView="visible"
          viewport={lm.viewport}
          className="highlights__text"
        >
          <motion.h2
            className="highlights__title"
            variants={lm.highlightsLeftChild}
          >
            {headingLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < headingLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </motion.h2>
          <motion.p
            className="highlights__description"
            variants={lm.highlightsLeftChild}
          >
            {description}
          </motion.p>

          <motion.div
            className="highlights__stats"
            variants={lm.highlightsStatsGroup}
          >
            {statsData.map((item) => (
              <motion.div
                key={item.label}
                className="highlights__stat"
                variants={lm.statItem}
              >
                <div className="highlights__stat-icon">
                  <img
                    src={item.icon}
                    alt={item.label}
                    width={32}
                    height={32}
                  />
                </div>
                <span className="highlights__stat-value">{item.value}</span>
                <p className="highlights__stat-label">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="highlights__cards">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              className="highlights__card"
              variants={lm.highlightCard(index)}
              initial="hidden"
              whileInView="visible"
              viewport={lm.viewport}
              whileHover={
                lm.reduced
                  ? undefined
                  : {
                      y: -4,
                      boxShadow: "0 24px 48px rgba(15, 23, 42, 0.2)",
                    }
              }
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div className="highlights__card-icon">
                <img src={card.icon} alt={card.title} />
              </div>

              <div className="highlights__card-content">
                <h3 className="highlights__card-title">{card.title}</h3>
                <p className="highlights__card-text">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
