import { motion } from "motion/react";
import { useLandingMotion } from "../../motion/safeMotion";

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
    <section className={`w-full px-4 py-20 ${className}`.trim()}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={lm.highlightsLeft}
          initial="hidden"
          whileInView="visible"
          viewport={lm.viewport}
        >
          <motion.h2
            className="text-[32px] text-left font-bold text-gray-900 mb-6"
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
            className="text-gray-600 text-left text-base mb-10"
            variants={lm.highlightsLeftChild}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-between gap-6 w-full"
            variants={lm.highlightsStatsGroup}
          >
            {statsData.map((item) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center justify-center gap-2"
                variants={lm.statItem}
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
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              className="flex items-center gap-6 p-6 bg-[#8F9BB1] rounded-2xl shadow-sm border border-[#8F9BB1]"
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
              <div className="shrink-0 w-32 h-32 bg-white rounded-lg flex items-center justify-center py-8 px-3">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
