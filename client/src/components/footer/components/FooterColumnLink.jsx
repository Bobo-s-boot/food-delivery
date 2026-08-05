import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAccountNavigation } from "../../../hooks/useAccountNavigation";
import { useSupport } from "../../../features/support/useSupport";

const isInternalLink = (to) => typeof to === "string" && to.startsWith("/");

export function FooterColumnLink({ link }) {
  const { t } = useTranslation();
  const { openOrderTracking, openStudentDiscounts } = useAccountNavigation();
  const { openSupport } = useSupport();

  const footerActions = {
    support: openSupport,
    trackOrder: openOrderTracking,
    studentDiscounts: openStudentDiscounts,
  };

  if (link.action && footerActions[link.action]) {
    return (
      <li className="footer__link-item">
        <button
          type="button"
          className="footer__link footer__link--muted footer__link--button"
          onClick={footerActions[link.action]}
        >
          {t(`footer.links.${link.key}`)}
        </button>
      </li>
    );
  }

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
