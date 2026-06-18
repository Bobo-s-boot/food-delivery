import { useTranslation } from "react-i18next";
import { dataSmallLinksForFooter } from "../consts.js";

export function FooterSmallLinks() {
  const { t } = useTranslation();

  return (
    <div className="footer__short-links">
      {dataSmallLinksForFooter.links.map((link) => (
        <a
          key={link.key || link.to}
          href={link.to}
          className="footer__small-link"
        >
          {t(`footer.links.${link.key}`)}
        </a>
      ))}
    </div>
  );
}
