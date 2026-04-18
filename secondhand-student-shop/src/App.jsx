import "./App.css";
import { CategorySection } from "./components/CategorySection";
import { CtaBanner } from "./components/CtaBanner";
import { FeaturedSection } from "./components/FeaturedSection";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { StepsSection } from "./components/StepsSection";
import {
  categories,
  featuredItems,
  heroMedia,
  heroStats,
  navigationLinks,
  steps,
} from "./data/homepageData";

function App() {
  return (
    <div className="app-shell" id="top">
      <Header links={navigationLinks} />

      <main className="homepage">
        <HeroSection image={heroMedia} stats={heroStats} />
        <CategorySection categories={categories} />
        <FeaturedSection items={featuredItems} />
        <StepsSection steps={steps} />
        <CtaBanner />
      </main>
    </div>
  );
}

export default App;
