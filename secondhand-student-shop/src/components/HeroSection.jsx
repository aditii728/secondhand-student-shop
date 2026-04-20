import { ROUTES } from "../routes/paths";
import { ButtonLink } from "./ButtonLink";

export function HeroSection({ stats, image }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Student Marketplace</p>
        <h2>Buy and sell second-hand essentials with confidence.</h2>
        <p className="hero-text">
          Discover affordable books, room essentials, and study equipment from students in your
          community.
        </p>

        <div className="hero-actions">
          <ButtonLink to={ROUTES.browse}>Browse listings</ButtonLink>
          <ButtonLink href="#how-it-works" variant="secondary">
            Sell an item
          </ButtonLink>
        </div>
      </div>

      <aside className="hero-panel" aria-label="Marketplace summary">
        <div className="hero-image-frame">
          <img className="hero-image" src={image.src} alt={image.alt} />
        </div>

        <div className="hero-panel-block">
          <p className="panel-label">Popular Now</p>
          <h3>Textbooks, desks, and study accessories remain in highest demand.</h3>
        </div>

        <div className="hero-stat-list">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-note">
          <span className="status-dot" />
          <p>Designed for secure, student-focused buying and selling.</p>
        </div>
      </aside>
    </section>
  );
}
