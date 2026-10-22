import { FooterBrand, FooterLegal, FooterNavigation, FooterNewsletter, TableDecor } from "./FooterParts";
import { useFooterSystem } from "./useFooterSystem";
import "./Footer.scss";

export function Footer() {
  const model = useFooterSystem();
  return (
    <footer className="ft">
      <div className="ft-table-top">
        <div className="ft-table-story">
          <h2>{model.copy.headlineLead}<br /><span>{model.copy.headlineAccent}</span></h2>
          <p>{model.copy.description}</p>
          <TableDecor />
        </div>
        <FooterNewsletter model={model} />
      </div>
      <div className="ft-table-directory">
        <FooterBrand model={model} />
        <FooterNavigation model={model} />
      </div>
      <FooterLegal model={model} />
    </footer>
  );
}
