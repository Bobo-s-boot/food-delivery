import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { dataLinksForFooter } from "./consts.js";
import { dataSmallLinksForFooter } from "./consts.js";

const isInternalLink = (to) => typeof to === "string" && to.startsWith("/");

export function Footer() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer className="w-full bg-[#0D1A2D] text-white py-12 px-10 mt-10">
      <div className="max-w-400 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="flex flex-col">
            <span className="text-[32px] font-medium text-white tracking-wide ">
              Defilicious
            </span>
          </div>

          {dataLinksForFooter.map((column, index) => (
            <div key={index} className="flex flex-col gap-4">
              <ul className="grid grid-cols-1 gap-y-2">
                {column.links.map((link, linkIndex) => {
                  const linkClasses =
                    "text-xl transition-all h-10 flex items-center font-normal border-b-2 w-max";

                  return (
                    <li key={linkIndex}>
                      {isInternalLink(link.to) ? (
                        <NavLink
                          to={link.to}
                          end={link.to === "/"}
                          className={({ isActive }) =>
                            `${linkClasses} ${
                              isActive
                                ? "text-white box-border px-4 py-2 border border-[#EEEEEE] rounded-full hover:bg-[#EEEEEE] transition-colors"
                                : "text-[#8F9BB1] border-transparent hover:text-white"
                            }`
                          }
                        >
                          {t(`footer.links.${link.key}`)}
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">{t("footer.dealsTitle")}</h3>
            <p className="text-sm font-normal">
              {t("footer.dealsDescription")}
            </p>

            <input
              type="email"
              name="email"
              placeholder={t("footer.emailPlaceholder")}
              className="w-full align-center rounded-full px-2 py-2 bg-[#EFEFF1] text-base xl:text-lg text-[#0F131680] placeholder:text-[#0F131680] outline-none tracking-[-0.04em] truncate"
            />
          </div>
        </div>

        <div className="flex flex-row w-full justify-between items-center mt-10  gap-2">
          <small className="text-xs text-[#8F9BB1]">
            {t("footer.copyright")}
          </small>
          <div className="flex flex-row items-center gap-3">
            {dataSmallLinksForFooter.links.map((link, index) => (
              <a
                key={index}
                href={link.to}
                className="text-[#8F9BB1] hover:text-white transition-colors text-xs"
              >
                {t(`footer.links.${link.key}`)}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-8 lg:mt-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeLanguage("en")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  i18n.language === "en"
                    ? "bg-white text-[#0D1A2D]"
                    : "bg-[#1A2332] text-[#8F9BB1] hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage("uk")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  i18n.language === "uk"
                    ? "bg-white text-[#0D1A2D]"
                    : "bg-[#1A2332] text-[#8F9BB1] hover:text-white"
                }`}
              >
                UK
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
