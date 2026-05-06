export function DeliveryFAQ({ t, faq }) {
  return (
    <section className="mt-24 w-full max-w-[1692px]">
      <h2 className="text-[40px] md:text-[56px] font-normal leading-none tracking-[-0.04em] text-black">
        {t("delivery.faqTitle")}
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {faq.map((item) => (
          <article
            key={item.questionKey}
            className="rounded-[32px] bg-[#F3F4F6] p-8"
          >
            <h3 className="text-2xl font-medium tracking-[-0.03em] text-black">
              {t(item.questionKey)}
            </h3>
            <p className="mt-3 text-base leading-[150%] text-[#4B5563]">
              {t(item.answerKey)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
