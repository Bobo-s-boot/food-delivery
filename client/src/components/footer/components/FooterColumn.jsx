import { dataLinksForFooter } from "../consts.js";
import { FooterColumnLink } from "./FooterColumnLink.jsx";

export function FooterColumn() {
  return (
    <>
      {dataLinksForFooter.map((column, index) => (
        <div key={index} className="footer__column">
          <ul className="footer__links-list">
            {column.links.map((link) => (
              <FooterColumnLink key={link.key || link.to} link={link} />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
