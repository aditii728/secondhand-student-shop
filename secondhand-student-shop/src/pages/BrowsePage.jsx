import { useState } from "react";
import { SectionHeading } from "../components/SectionHeading";
import { browseCategories, browseListings } from "../data/browseData";

const conditions = ["All", "Excellent", "Very good", "Good"];

function formatPostedHours(hours) {
  if (hours <= 1) {
    return "Posted 1h ago";
  }

  return `Posted ${hours}h ago`;
}

function sortListings(listings, sortBy) {
  const sorted = [...listings];

  if (sortBy === "price-low") {
    sorted.sort((left, right) => left.price - right.price);
  } else if (sortBy === "price-high") {
    sorted.sort((left, right) => right.price - left.price);
  } else {
    sorted.sort((left, right) => left.postedHours - right.postedHours);
  }

  return sorted;
}

export function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const visibleListings = sortListings(
    browseListings.filter((listing) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.pickup.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || listing.category === selectedCategory;

      const matchesCondition =
        selectedCondition === "All" || listing.condition === selectedCondition;

      return matchesSearch && matchesCategory && matchesCondition;
    }),
    sortBy,
  );

  return (
    <main className="browse-page">
      <section className="section browse-categories-section">
        <SectionHeading
          description="Choose a category to narrow the listings."
          eyebrow="Categories"
          title="Shop by what students need most."
        />

        <div className="browse-category-grid">
          {browseCategories.map((category) => (
            <button
              className={`browse-category-card ${
                selectedCategory === category.id ? "browse-category-card-active" : ""
              }`}
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              type="button"
            >
              <span className="browse-category-count">{category.count} items</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="browse-content">
        <aside className="filter-panel">
          <div className="filter-group">
            <p className="filter-label">Condition</p>
            <div className="filter-chip-list">
              {conditions.map((condition) => (
                <button
                  className={`filter-chip ${
                    selectedCondition === condition ? "filter-chip-active" : ""
                  }`}
                  key={condition}
                  onClick={() => setSelectedCondition(condition)}
                  type="button"
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="sort-listings">
              Sort by
            </label>
            <select
              className="sort-select"
              id="sort-listings"
              onChange={(event) => setSortBy(event.target.value)}
              value={sortBy}
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>

          <div className="filter-note">
            <span className="status-dot" />
            <p>Student pickup spots include the library, residence halls, and campus buildings.</p>
          </div>
        </aside>

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
              <span className="summary-pill">
                {selectedCategory === "all"
                  ? "All categories"
                  : browseCategories.find((category) => category.id === selectedCategory)?.name}
              </span>
              <span className="summary-pill">{selectedCondition}</span>
            </div>
          </div>

          {visibleListings.length > 0 ? (
            <div className="browse-listing-grid">
              {visibleListings.map((listing) => (
                <article className="browse-listing-card" key={listing.id}>
                  <div className="browse-listing-image-frame">
                    <img
                      alt={listing.alt}
                      className="browse-listing-image"
                      loading="lazy"
                      src={listing.image}
                      style={{ objectPosition: listing.imagePosition || "center center" }}
                    />
                    {listing.featured ? <span className="browse-badge">Featured</span> : null}
                  </div>

                  <div className="browse-listing-body">
                    <div className="browse-listing-meta">
                      <span className="pill">{listing.categoryLabel}</span>
                      <span className="listing-location">{listing.pickup}</span>
                    </div>

                    <h3>{listing.title}</h3>
                    <p className="browse-listing-detail">
                      {listing.condition} condition
                      <span className="browse-divider" />
                      {listing.seller}
                    </p>
                    <p className="browse-listing-posted">{formatPostedHours(listing.postedHours)}</p>

                    <div className="browse-listing-footer">
                      <strong>£{listing.price}</strong>
                      <button type="button">View details</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="browse-empty-state">
              <p className="eyebrow">No matches</p>
              <h3>No listings match the current filters.</h3>
              <p>Try a broader search or switch back to all categories.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
