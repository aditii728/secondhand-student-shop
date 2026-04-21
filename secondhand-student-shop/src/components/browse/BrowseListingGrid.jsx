import { Link } from "react-router-dom";
import { formatPostedHours } from "../../utils/browseListings";

function BrowseListingCard({ listing }) {
  return (
    <article className="browse-listing-card">
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
          <Link className="button-link button-link-primary" to={`/item/${listing.id}`}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

function BrowseEmptyState() {
  return (
    <div className="browse-empty-state">
      <p className="eyebrow">No matches</p>
      <h3>No listings match the current filters.</h3>
      <p>Try a broader search or switch back to all categories.</p>
    </div>
  );
}

export function BrowseListingGrid({ listings }) {
  if (listings.length === 0) {
    return <BrowseEmptyState />;
  }

  return (
    <div className="browse-listing-grid">
      {listings.map((listing) => (
        <BrowseListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}