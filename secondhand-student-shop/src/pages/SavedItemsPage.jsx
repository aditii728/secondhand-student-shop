import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { browseListings } from "../data/browseData";
import { ROUTES } from "../routes/paths";
import "../styles/saved.css";

const initialSavedIds = ["listing-1", "listing-3", "listing-8"];

export function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState(
    browseListings.filter((item) => initialSavedIds.includes(item.id))
  );

  function handleRemoveItem(id) {
    setSavedItems((previousItems) =>
      previousItems.filter((item) => item.id !== id)
    );
  }

  const totalSavedValue = useMemo(
    () => savedItems.reduce((total, item) => total + item.price, 0),
    [savedItems]
  );

  const categoryCount = useMemo(
    () => new Set(savedItems.map((item) => item.category)).size,
    [savedItems]
  );

  const newestSavedItem = useMemo(() => {
    if (savedItems.length === 0) return null;
    return [...savedItems].sort((a, b) => a.postedHours - b.postedHours)[0];
  }, [savedItems]);

  return (
    <main className="saved-page">
      <section className="saved-hero">
        <div className="saved-hero-copy">
          <p className="eyebrow">Saved for later</p>
          <h2>Keep track of listings you want to revisit.</h2>
          <p className="saved-hero-text">
            Save useful items while browsing so you can compare them later,
            return to details quickly, and decide what to buy next.
          </p>
        </div>

        <div className="saved-stats-grid">
          <div className="saved-stat-card">
            <span className="saved-stat-label">Saved items</span>
            <strong>{savedItems.length}</strong>
          </div>

          <div className="saved-stat-card">
            <span className="saved-stat-label">Categories</span>
            <strong>{categoryCount}</strong>
          </div>

          <div className="saved-stat-card">
            <span className="saved-stat-label">Estimated value</span>
            <strong>£{totalSavedValue}</strong>
          </div>

          <div className="saved-stat-card">
            <span className="saved-stat-label">Newest saved match</span>
            <strong>{newestSavedItem ? newestSavedItem.title : "None"}</strong>
          </div>
        </div>
      </section>

      {savedItems.length === 0 ? (
        <section className="saved-empty-state">
          <p className="eyebrow">Nothing saved yet</p>
          <h3>Your saved list is currently empty.</h3>
          <p>
            Browse student listings and save anything you want to compare or
            revisit later.
          </p>
          <Link className="button-link button-link-primary" to={ROUTES.browse}>
            Browse listings
          </Link>
        </section>
      ) : (
        <section className="saved-grid">
          {savedItems.map((item) => (
            <article className="saved-card" key={item.id}>
              <div className="saved-card-image-shell">
                <img
                  alt={item.alt}
                  className="saved-card-image"
                  src={item.image}
                  style={{ objectPosition: item.imagePosition || "center center" }}
                />
              </div>

              <div className="saved-card-body">
                <div className="saved-card-top">
                  <span className="pill">{item.categoryLabel}</span>
                  <span className="listing-location">{item.pickup}</span>
                </div>

                <h3>{item.title}</h3>

                <p className="saved-card-meta">
                  {item.condition} condition · {item.seller}
                </p>

                <p className="saved-card-posted">
                  Posted {item.postedHours} hours ago
                </p>

                <div className="saved-card-footer">
                  <strong>£{item.price}</strong>

                  <div className="saved-card-actions">
                    <Link
                      className="button-link button-link-secondary"
                      to={`/item/${item.id}`}
                    >
                      View item
                    </Link>

                    <button
                      className="button-link button-link-primary"
                      onClick={() => handleRemoveItem(item.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}