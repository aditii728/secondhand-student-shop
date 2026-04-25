import { useMemo, useState } from "react";
import { buildBrowseCategories, deleteListing } from "../api/listings";
import { BrowseCategoryScroller } from "../components/browse/BrowseCategoryScroller";
import { BrowseFilters } from "../components/browse/BrowseFilters";
import { BrowseListingGrid } from "../components/browse/BrowseListingGrid";
import { SectionHeading } from "../components/SectionHeading";
import { useAuth } from "../hooks/useAuth";
import { useListings } from "../hooks/useListings";
import "../styles/browse.css";
import {
  browseConditions,
  filterBrowseListings,
  sortListings,
} from "../utils/browseListings";

export function BrowsePage() {
  const { accessToken, currentUser, isAuthenticated, refreshSession } = useAuth();
  const { listings, isLoading, error, removeListing } = useListings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [deletingId, setDeletingId] = useState("");

  const browseCategories = useMemo(() => buildBrowseCategories(listings), [listings]);
  const activeSelectedCategory = browseCategories.some(
    (category) => category.id === selectedCategory,
  )
    ? selectedCategory
    : "all";

  const visibleListings = useMemo(() => {
    const filteredListings = filterBrowseListings(listings, {
      searchTerm,
      selectedCategory: activeSelectedCategory,
      selectedCondition,
    });

    return sortListings(filteredListings, sortBy);
  }, [listings, searchTerm, activeSelectedCategory, selectedCondition, sortBy]);

  const selectedCategoryLabel =
    activeSelectedCategory === "all"
      ? "All categories"
      : browseCategories.find((category) => category.id === activeSelectedCategory)?.name;

  function canDeleteListing(listing) {
    return isAuthenticated && currentUser && listing.sellerId === String(currentUser.id);
  }

  async function handleDeleteListing(listing) {
    setDeletingId(listing.id);

    try {
      let token = accessToken;
      if (!token) {
        token = await refreshSession();
      }

      await deleteListing({ accessToken: token, listingId: listing.id });
      removeListing(listing.id);
    } catch (deleteError) {
      window.alert(deleteError.message || "Could not remove listing.");
    } finally {
      setDeletingId("");
    }
  }

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
          selectedCategory={activeSelectedCategory}
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
              <h2>{isLoading ? "Loading listings..." : `${visibleListings.length} listings available`}</h2>
            </div>
            <div className="active-filter-summary">
              <span className="summary-pill">{selectedCategoryLabel}</span>
              <span className="summary-pill">{selectedCondition}</span>
            </div>
          </div>

          <BrowseListingGrid
            canDeleteListing={canDeleteListing}
            deletingId={deletingId}
            error={error}
            isLoading={isLoading}
            listings={visibleListings}
            onDeleteListing={handleDeleteListing}
          />
        </div>
      </section>
    </main>
  );
}
