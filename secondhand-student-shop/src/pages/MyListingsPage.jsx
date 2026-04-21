import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { browseListings } from "../data/browseData";
import { ROUTES } from "../routes/paths";
import "../styles/my-listings.css";

const initialListings = browseListings.slice(0, 4).map((item, index) => ({
  ...item,
  listingStatus: index === 2 ? "Sold" : "Active",
  views: [24, 31, 18, 27][index] || 12,
  saves: [5, 7, 2, 4][index] || 1,
}));

export function MyListingsPage() {
  const [myListings, setMyListings] = useState(initialListings);

  function handleDelete(id) {
    setMyListings((previous) => previous.filter((item) => item.id !== id));
  }

  function handleToggleStatus(id) {
    setMyListings((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              listingStatus: item.listingStatus === "Sold" ? "Active" : "Sold",
            }
          : item
      )
    );
  }

  const activeCount = useMemo(
    () => myListings.filter((item) => item.listingStatus === "Active").length,
    [myListings]
  );

  const soldCount = useMemo(
    () => myListings.filter((item) => item.listingStatus === "Sold").length,
    [myListings]
  );

  const totalViews = useMemo(
    () => myListings.reduce((total, item) => total + item.views, 0),
    [myListings]
  );

  const totalSaves = useMemo(
    () => myListings.reduce((total, item) => total + item.saves, 0),
    [myListings]
  );

  return (
    <main className="my-listings-page">
      <section className="my-listings-hero">
        <div className="my-listings-copy">
          <p className="eyebrow">Seller dashboard</p>
          <h2>Manage your active and sold listings.</h2>
          <p className="my-listings-text">
            Track your posted items, check listing performance, and update status
            as your items get sold. This Version 1 page demonstrates the seller-side
            management experience using front-end mock data.
          </p>
        </div>

        <div className="my-listings-summary-grid">
          <div className="my-summary-card">
            <span className="my-summary-label">Active</span>
            <strong>{activeCount}</strong>
          </div>

          <div className="my-summary-card">
            <span className="my-summary-label">Sold</span>
            <strong>{soldCount}</strong>
          </div>

          <div className="my-summary-card">
            <span className="my-summary-label">Views</span>
            <strong>{totalViews}</strong>
          </div>

          <div className="my-summary-card">
            <span className="my-summary-label">Saves</span>
            <strong>{totalSaves}</strong>
          </div>
        </div>
      </section>

      <section className="my-listings-toolbar">
        <div>
          <p className="eyebrow">Your items</p>
          <h3>Current listings</h3>
        </div>

        <Link className="button-link button-link-primary" to={ROUTES.sell}>
          Add new listing
        </Link>
      </section>

      {myListings.length === 0 ? (
        <section className="my-empty-state">
          <p className="eyebrow">No listings yet</p>
          <h3>You have not posted any items yet.</h3>
          <p>
            Create your first listing to start selling to other students in your
            campus community.
          </p>
          <Link className="button-link button-link-primary" to={ROUTES.sell}>
            Create a listing
          </Link>
        </section>
      ) : (
        <section className="my-listings-grid">
          {myListings.map((item) => (
            <article className="my-listing-card" key={item.id}>
              <div className="my-listing-image-shell">
                <img
                  alt={item.alt}
                  className="my-listing-image"
                  src={item.image}
                  style={{ objectPosition: item.imagePosition || "center center" }}
                />
              </div>

              <div className="my-listing-body">
                <div className="my-listing-top">
                  <span className="pill">{item.categoryLabel}</span>
                  <span
                    className={`my-status-badge ${
                      item.listingStatus === "Sold"
                        ? "my-status-sold"
                        : "my-status-active"
                    }`}
                  >
                    {item.listingStatus}
                  </span>
                </div>

                <h3>{item.title}</h3>

                <p className="my-listing-meta">
                  {item.condition} condition · {item.pickup}
                </p>

                <div className="my-listing-stats">
                  <span>{item.views} views</span>
                  <span>{item.saves} saves</span>
                </div>

                <div className="my-listing-footer">
                  <strong>£{item.price}</strong>

                  <div className="my-listing-actions">
                    <Link
                      className="button-link button-link-secondary"
                      to={`/item/${item.id}`}
                    >
                      View
                    </Link>

                    <button
                      className="button-link button-link-secondary"
                      onClick={() => handleToggleStatus(item.id)}
                      type="button"
                    >
                      {item.listingStatus === "Sold" ? "Relist" : "Mark Sold"}
                    </button>

                    <button
                      className="button-link button-link-primary"
                      onClick={() => handleDelete(item.id)}
                      type="button"
                    >
                      Delete
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