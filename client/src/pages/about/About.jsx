import { AboutAudience } from "./sections/AboutAudience";
import { AboutHero } from "./sections/AboutHero";
import { AboutMethodology } from "./sections/AboutMethodology";
import { AboutMission } from "./sections/AboutMission";
import { AboutTeam } from "./sections/AboutTeam";
import { AboutTechStack } from "./sections/AboutTechStack";
import "./About.scss";

export function About() {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutMission />
      <AboutAudience />
      <AboutTeam />
      <AboutTechStack />
      <AboutMethodology />
    </div>
  );
}
