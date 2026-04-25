import { Link } from "react-router-dom";
import { formatPostedHours } from "../../utils/browseListings";

function BrowseListingCard({ listing, canDelete, onDelete, deletingId }) {
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
          <div className="browse-listing-actions">
            <Link className="button-link button-link-primary" to={`/item/${listing.id}`}>
              View details
            </Link>
            {canDelete ? (
              <button
                className="button-link button-link-secondary"
                disabled={deletingId === listing.id}
                onClick={() => onDelete(listing)}
                type="button"
              >
                {deletingId === listing.id ? "Removing..." : "Remove"}
              </button>
            ) : null}
          </div>
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

export function BrowseListingGrid({ listings, isLoading, error, canDeleteListing, deletingId, onDeleteListing }) {
  if (isLoading) {
    return (
      <div className="browse-empty-state">
        <p className="eyebrow">Loading</p>
        <h3>Loading listings...</h3>
        <p>Fetching the latest items from the backend API.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-empty-state">
        <p className="eyebrow">Unavailable</p>
        <h3>We could not load listings.</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return <BrowseEmptyState />;
  }

  return (
    <div className="browse-listing-grid">
      {listings.map((listing) => (
        <BrowseListingCard
          canDelete={canDeleteListing?.(listing)}
          deletingId={deletingId}
          key={listing.id}
          listing={listing}
          onDelete={onDeleteListing}
        />
      ))}
    </div>
  );
}
