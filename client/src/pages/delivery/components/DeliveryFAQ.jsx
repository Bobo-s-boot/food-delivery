import "../Delivery.scss";

export function DeliveryFAQ({ t, faq }) {
  return (
    <section className="delivery-faq">
      {/* Добавили класс для заголовка */}
      <h2 className="delivery-faq__title">{t("delivery.faqTitle")}</h2>

      {/* Поменяли __list на __grid, чтобы сработала наша сетка */}
      <div className="delivery-faq__grid">
        {faq.map((item) => (
          <article key={item.questionKey} className="delivery-faq__card">
            <h3>{t(item.questionKey)}</h3>
            <p>{t(item.answerKey)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
