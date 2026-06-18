import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const isInternalLink = (to) => typeof to === "string" && to.startsWith("/");

export function FooterColumnLink({ link }) {
  const { t } = useTranslation();

  if (!isInternalLink(link.to)) {
    return null;
  }

  return (
    <li className="footer__link-item">
      <NavLink
        to={link.to}
        end={link.to === "/"}
        className={({ isActive }) =>
          `footer__link ${isActive ? "footer__link--active" : "footer__link--muted"}`
        }
      >
        {t(`footer.links.${link.key}`)}
      </NavLink>
    </li>
  );
}
