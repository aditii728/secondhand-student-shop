import { useMemo } from "react";
import "../styles/home.css";
import { CategorySection } from "../components/CategorySection";
import { CtaBanner } from "../components/CtaBanner";
import { FeaturedSection } from "../components/FeaturedSection";
import { HeroSection } from "../components/HeroSection";
import { StepsSection } from "../components/StepsSection";
import { useListings } from "../hooks/useListings";
import { categories, heroMedia, heroStats, steps } from "../data/homepageData";

export function HomePage() {
  const { listings, isLoading, error } = useListings();

  const featuredItems = useMemo(
    () => listings.filter((listing) => listing.featured).slice(0, 3),
    [listings],
  );

  const homepageStats = useMemo(
    () =>
      heroStats.map((stat) =>
        stat.label === "active listings"
          ? { ...stat, value: isLoading ? "..." : String(listings.length) }
          : stat,
      ),
    [isLoading, listings.length],
  );

  return (
    <main className="homepage">
      <HeroSection image={heroMedia} stats={homepageStats} />
      <CategorySection categories={categories} />
      <FeaturedSection error={error} isLoading={isLoading} items={featuredItems} />
      <StepsSection steps={steps} />
      <CtaBanner />
    </main>
  );
}
