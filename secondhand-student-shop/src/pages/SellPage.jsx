import { useMemo, useState } from "react";
import { browseCategories } from "../data/browseData";
import "../styles/sell.css";

const categoryOptions = browseCategories.filter((category) => category.id !== "all");

const initialForm = {
  title: "",
  price: "",
  category: "books",
  condition: "Good",
  pickup: "",
  image:
    "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=900",
  description: "",
};

export function SellPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  const selectedCategory = useMemo(
    () => categoryOptions.find((category) => category.id === form.category),
    [form.category]
  );

  return (
    <main className="sell-page">
      <section className="sell-hero">
        <div className="sell-hero-copy">
          <p className="eyebrow">Post a listing</p>
          <h2>Sell your student essentials in a few simple steps.</h2>
          <p className="sell-hero-text">
            Add your item details, preview how your listing will appear, and prepare
            it for campus buyers. This is a Version 1 front-end prototype, so the
            form currently demonstrates the posting experience without a live backend.
          </p>
        </div>

        <div className="sell-tips-card">
          <h3>Quick tips for better listings</h3>
          <ul className="sell-tips-list">
            <li>Use a clear title with the actual item name.</li>
            <li>Set a student-friendly price that feels fair.</li>
            <li>Choose a specific pickup point on or near campus.</li>
            <li>Write a short description with useful condition details.</li>
          </ul>
        </div>
      </section>

      <section className="sell-layout">
        <form className="sell-form-card" onSubmit={handleSubmit}>
          <div className="sell-form-heading">
            <p className="eyebrow">Listing form</p>
            <h3>Create your item listing</h3>
          </div>

          <div className="sell-form-grid">
            <label className="sell-field">
              <span>Item title</span>
              <input
                name="title"
                onChange={handleChange}
                placeholder="e.g. HP scientific calculator"
                type="text"
                value={form.title}
              />
            </label>

            <label className="sell-field">
              <span>Price (£)</span>
              <input
                min="0"
                name="price"
                onChange={handleChange}
                placeholder="e.g. 20"
                type="number"
                value={form.price}
              />
            </label>

            <label className="sell-field">
              <span>Category</span>
              <select name="category" onChange={handleChange} value={form.category}>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="sell-field">
              <span>Condition</span>
              <select name="condition" onChange={handleChange} value={form.condition}>
                <option value="Excellent">Excellent</option>
                <option value="Very good">Very good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </label>

            <label className="sell-field sell-field-full">
              <span>Pickup location</span>
              <input
                name="pickup"
                onChange={handleChange}
                placeholder="e.g. Library gate"
                type="text"
                value={form.pickup}
              />
            </label>

            <label className="sell-field sell-field-full">
              <span>Image URL</span>
              <input
                name="image"
                onChange={handleChange}
                placeholder="Paste an image URL"
                type="url"
                value={form.image}
              />
            </label>

            <label className="sell-field sell-field-full">
              <span>Description</span>
              <textarea
                name="description"
                onChange={handleChange}
                placeholder="Add key details about the item, condition, and anything included."
                rows="5"
                value={form.description}
              />
            </label>
          </div>

          <div className="sell-form-actions">
            <button className="button-link button-link-primary" type="submit">
              Publish listing
            </button>
            <button
              className="button-link button-link-secondary"
              onClick={() => {
                setForm(initialForm);
                setSubmitted(false);
              }}
              type="button"
            >
              Reset form
            </button>
          </div>

          {submitted ? (
            <div className="sell-success-banner">
              Listing submitted in UI prototype mode. In Version 1, this demonstrates
              the user flow before backend integration is added.
            </div>
          ) : null}
        </form>

        <aside className="sell-preview-card">
          <div className="sell-preview-heading">
            <p className="eyebrow">Live preview</p>
            <h3>How your card will look</h3>
          </div>

          <article className="sell-preview-listing">
            <div className="sell-preview-image-shell">
              <img
                alt={form.title || "Listing preview"}
                className="sell-preview-image"
                src={form.image}
              />
            </div>

            <div className="sell-preview-top">
              <span className="pill">{selectedCategory?.name || "Category"}</span>
              <span className="listing-location">
                {form.pickup || "Pickup location"}
              </span>
            </div>

            <h4>{form.title || "Your item title will appear here"}</h4>

            <p className="sell-preview-condition">
              {form.condition} condition
            </p>

            <p className="sell-preview-description">
              {form.description || "Your item description preview will appear here once you start typing."}
            </p>

            <div className="sell-preview-footer">
              <strong>£{form.price || "0"}</strong>
              <span className="sell-preview-status">Draft preview</span>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}