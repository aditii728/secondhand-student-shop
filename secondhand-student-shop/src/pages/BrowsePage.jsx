import { useMemo, useState } from "react";
import { BrowseCategoryScroller } from "../components/browse/BrowseCategoryScroller";
import { BrowseFilters } from "../components/browse/BrowseFilters";
import { BrowseListingGrid } from "../components/browse/BrowseListingGrid";
import { SectionHeading } from "../components/SectionHeading";
import { browseCategories, browseListings } from "../data/browseData";
import "../styles/browse.css";
import {
  browseConditions,
  filterBrowseListings,
  sortListings,
} from "../utils/browseListings";

export function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const visibleListings = useMemo(() => {
    const filteredListings = filterBrowseListings(browseListings, {
      searchTerm,
      selectedCategory,
      selectedCondition,
    });

    return sortListings(filteredListings, sortBy);
  }, [searchTerm, selectedCategory, selectedCondition, sortBy]);

  const selectedCategoryLabel =
    selectedCategory === "all"
      ? "All categories"
      : browseCategories.find((category) => category.id === selectedCategory)?.name;

  return (
    <main className="browse-page">
      <section className="section browse-categories-section">
        <SectionHeading
          description="Choose a category to narrow the listings."
          eyebrow="Categories"
          title="Shop by what students need most."
        />

        <BrowseCategoryScroller
          categories={browseCategories}
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </section>

      <section className="browse-content">
        <BrowseFilters
          conditions={browseConditions}
          onSelectCondition={setSelectedCondition}
          onSortByChange={setSortBy}
          selectedCondition={selectedCondition}
          sortBy={sortBy}
        />

        <div className="browse-results">
          <div className="browse-search-shell browse-search-shell-inline">
            <label className="browse-search-label" htmlFor="listing-search">
              Search listings
            </label>
            <input
              className="browse-search-input"
              id="listing-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search books, desks, calculators..."
              type="text"
              value={searchTerm}
            />
          </div>

          <div className="browse-results-header">
            <div>
              <p className="eyebrow">Results</p>
              <h2>{visibleListings.length} listings available</h2>
            </div>
            <div className="active-filter-summary">
              <span className="summary-pill">{selectedCategoryLabel}</span>
              <span className="summary-pill">{selectedCondition}</span>
            </div>
          </div>

          <BrowseListingGrid listings={visibleListings} />
        </div>
      </section>
    </main>
  );
}
