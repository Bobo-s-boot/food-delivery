export function SpecialsHowItWorks({ t, steps }) {
  return (
    <section className="specials-steps">
      <h2 className="specials-steps__title">{t("specials.stepsTitle")}</h2>
      <div className="specials-step-list">
        {steps.map((step, index) => (
          <article key={step.titleKey} className="specials-step">
            <span className="specials-step__number">{index + 1}</span>
            <div>
              <h3 className="specials-step__title">{t(step.titleKey)}</h3>
              <p className="specials-step__text">{t(step.textKey)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
