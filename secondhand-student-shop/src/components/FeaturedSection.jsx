import { Link } from "react-router-dom";
import { SectionHeading } from "./SectionHeading";

function ListingCard({ item }) {
  return (
    <article className="listing-card">
      <div className="listing-image-frame">
        <img className="listing-image" src={item.image} alt={item.alt} loading="lazy" />
      </div>

      <div className="listing-top">
        <span className="pill">{item.condition}</span>
        <span className="listing-location">{item.pickup}</span>
      </div>
      <h3>{item.title}</h3>
      <div className="listing-footer">
        <strong>{item.priceLabel}</strong>
        <Link className="button-link button-link-secondary" to={`/item/${item.id}`}>
          View item
        </Link>
      </div>
    </article>
  );
}

export function FeaturedSection({ items, isLoading, error }) {
  return (
    <section className="section" id="featured">
      <SectionHeading
        eyebrow="Featured"
        title="Featured listings."
        description="A selection of practical items for student life."
      />

      {isLoading ? <p>Loading featured listings...</p> : null}
      {error ? <p>{error}</p> : null}

      {!isLoading && !error ? (
        <div className="listing-grid">
          {items.map((item) => (
            <ListingCard item={item} key={item.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
