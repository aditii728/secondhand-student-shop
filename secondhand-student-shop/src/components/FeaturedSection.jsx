import { Link } from "react-router-dom";
import { SectionHeading } from "./SectionHeading";

function ListingCard({ item }) {
  return (
    <article className="listing-card">
      <div className="listing-image-frame">
        <img
          className="listing-image"
          src={item.image}
          alt={item.alt}
          loading="lazy"
          style={{ objectPosition: item.imagePosition || "center center" }}
        />
      </div>

      <div className="listing-top">
        <span className="pill">{item.condition}</span>
        <span className="listing-location">{item.pickup}</span>
      </div>

      <h3>{item.title}</h3>

      <div className="listing-footer">
        <strong>£{item.price}</strong>
        <Link className="listing-action-link" to={`/item/${item.id}`}>
          View item
        </Link>
      </div>
    </article>
  );
}

export function FeaturedSection({ items }) {
  return (
    <section className="section" id="featured">
      <SectionHeading
        eyebrow="Featured"
        title="Featured listings."
        description="A selection of practical items for student life."
      />

      <div className="listing-grid">
        {items.map((item) => (
          <ListingCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}