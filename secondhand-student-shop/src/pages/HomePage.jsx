import "../styles/home.css";
import { CategorySection } from "../components/CategorySection";
import { CtaBanner } from "../components/CtaBanner";
import { FeaturedSection } from "../components/FeaturedSection";
import { HeroSection } from "../components/HeroSection";
import { StepsSection } from "../components/StepsSection";
import {
  categories,
  featuredItems,
  heroMedia,
  heroStats,
  steps,
} from "../data/homepageData";

export function HomePage() {
  return (
    <main className="homepage">
      <HeroSection image={heroMedia} stats={heroStats} />
      <CategorySection categories={categories} />
      <FeaturedSection items={featuredItems} />
      <StepsSection steps={steps} />
      <CtaBanner />
    </main>
  );
}
