import { HeroSection } from "@/components/editorial/HeroSection";
import { StatsSection } from "@/components/editorial/StatsSection";
import { KitsSection } from "@/components/editorial/KitsSection";
import { TimelineSection } from "@/components/editorial/TimelineSection";
import { CtaSection } from "@/components/editorial/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <KitsSection />
      <TimelineSection />
      <CtaSection />
    </>
  );
}
