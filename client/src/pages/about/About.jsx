import { AboutAudience } from "./sections/AboutAudience";
import { AboutHero } from "./sections/AboutHero";
import { AboutMethodology } from "./sections/AboutMethodology";
import { AboutMission } from "./sections/AboutMission";
import { AboutTeam } from "./sections/AboutTeam";
import { AboutTechStack } from "./sections/AboutTechStack";

export function About() {
  return (
    <div className="w-full bg-[#FFFFFF] font-['Inter'] text-[#0D1A2D]">
      <AboutHero />
      <AboutMission />
      <AboutAudience />
      <AboutTeam />
      <AboutTechStack />
      <AboutMethodology />
    </div>
  );
}
