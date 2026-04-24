import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import { ROUTES } from "../routes/paths";
import "../styles/item-details.css";

export function ItemDetailsPage() {
  const { id } = useParams();
  const { listings, isLoading, error } = useListings();

  const listing = useMemo(
    () => listings.find((item) => item.id === id),
    [id, listings],
  );

  const relatedItems = useMemo(
    () =>
      listings
        .filter((item) => item.category === listing?.category && item.id !== listing?.id)
        .slice(0, 3),
    [listing, listings],
  );

  if (isLoading) {
    return (
      <main className="item-details-page">
        <section className="item-details-empty">
          <p className="eyebrow">Loading</p>
          <h2>Loading item details...</h2>
          <p>Fetching the latest listing information from the backend API.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="item-details-page">
        <section className="item-details-empty">
          <p className="eyebrow">Unavailable</p>
          <h2>We could not load this listing.</h2>
          <p>{error}</p>
          <Link className="button-link button-link-primary" to={ROUTES.browse}>
            Back to browse
          </Link>
        </section>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="item-details-page">
        <section className="item-details-empty">
          <p className="eyebrow">Listing not found</p>
          <h2>We could not find that item.</h2>
          <p>It may have been removed or the link may be incorrect.</p>
          <Link className="button-link button-link-primary" to={ROUTES.browse}>
            Back to browse
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="item-details-page">
      <section className="item-details-hero">
        <div className="item-details-media-card">
          <img alt={listing.alt} className="item-details-image" src={listing.image} />
        </div>

        <div className="item-details-summary">
          <div className="item-details-topline">
            <span className="pill">{listing.categoryLabel}</span>
            {listing.featured ? (
              <span className="item-featured-badge">Featured</span>
            ) : null}
          </div>

          <h1>{listing.title}</h1>
          <p className="item-details-price">{listing.priceLabel}</p>

          <div className="item-details-meta-grid">
            <div className="item-meta-card">
              <span className="item-meta-label">Condition</span>
              <strong>{listing.condition}</strong>
            </div>
            <div className="item-meta-card">
              <span className="item-meta-label">Pickup</span>
              <strong>{listing.pickup}</strong>
            </div>
            <div className="item-meta-card">
              <span className="item-meta-label">Seller</span>
              <strong>{listing.seller}</strong>
            </div>
            <div className="item-meta-card">
              <span className="item-meta-label">Posted</span>
              <strong>
                {listing.postedHours} {listing.postedHours === 1 ? "hour" : "hours"} ago
              </strong>
            </div>
          </div>

          <div className="item-action-row">
            <button className="button-link button-link-primary" type="button">
              Contact Seller
            </button>
            <button className="button-link button-link-secondary" type="button">
              Save Item
            </button>
          </div>

          <Link className="item-back-link" to={ROUTES.browse}>
            ← Back to Browse Listings
          </Link>
        </div>
      </section>

      <section className="item-details-info">
        <div className="item-description-card">
          <p className="eyebrow">Item overview</p>
          <h2>About this listing</h2>
          <p>{listing.description}</p>
          <p>
            The seller has marked the item as <strong>{listing.condition}</strong>,
            and pickup is arranged at <strong>{listing.pickup}</strong>. Contact and
            save actions are still UI placeholders for Sprint 1.
          </p>
        </div>

        <div className="item-seller-card">
          <p className="eyebrow">Seller details</p>
          <h3>{listing.seller}</h3>
          <p className="item-seller-copy">
            Verified student seller listing items for quick campus collection.
            Ideal for fast peer-to-peer buying within the university community.
          </p>

          <ul className="item-seller-points">
            <li>Campus pickup available</li>
            <li>Student-to-student exchange</li>
            <li>Affordable secondhand pricing</li>
          </ul>
        </div>
      </section>

      <section className="item-related-section">
        <div className="section-heading">
          <p className="eyebrow">You may also like</p>
          <h2>Related listings</h2>
          <p className="section-description">
            More items from the same category that students might be interested in.
          </p>
        </div>

        {relatedItems.length === 0 ? (
          <p>No related listings are available right now.</p>
        ) : (
          <div className="item-related-grid">
            {relatedItems.map((item) => (
              <article className="item-related-card" key={item.id}>
                <div className="item-related-image-shell">
                  <img alt={item.alt} className="item-related-image" src={item.image} />
                </div>

                <div className="item-related-body">
                  <span className="pill">{item.categoryLabel}</span>
                  <h3>{item.title}</h3>
                  <p className="item-related-meta">
                    {item.condition} condition · {item.pickup}
                  </p>

                  <div className="item-related-footer">
                    <strong>{item.priceLabel}</strong>
                    <Link className="button-link button-link-secondary" to={`/item/${item.id}`}>
                      View item
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
