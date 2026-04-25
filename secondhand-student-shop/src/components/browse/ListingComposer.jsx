import { useMemo, useState } from "react";
import { createListing } from "../../api/listings";
import { useAuth } from "../../hooks/useAuth";

const initialForm = {
  title: "",
  categoryId: "",
  price: "",
  condition: "Good",
  pickupLocation: "",
  description: "",
  imageAlt: "",
  imageFile: null,
};

export function ListingComposer({ categories, onCreated }) {
  const { accessToken, currentUser, refreshSession } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.id !== "all"),
    [categories],
  );

  function handleChange(event) {
    const { files, name, type, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0] || null : value,
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });

    if (submitError) {
      setSubmitError("");
    }

    if (submitMessage) {
      setSubmitMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    try {
      let token = accessToken;
      if (!token) {
        token = await refreshSession();
      }

      const listing = await createListing({
        accessToken: token,
        payload: {
          title: formData.title.trim(),
          category_id: Number(formData.categoryId),
          price: formData.price.trim(),
          condition: formData.condition,
          pickup_location: formData.pickupLocation.trim(),
          description: formData.description.trim(),
          image_alt: formData.imageAlt.trim(),
          image: formData.imageFile,
        },
      });

      onCreated?.(listing);
      setFormData(initialForm);
      setErrors({});
      setSubmitMessage("Your listing is now live.");
    } catch (error) {
      setSubmitError(error.message || "Could not create listing.");
      setErrors(error.fieldErrors || {});
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="listing-composer">
      <div className="listing-composer-heading">
        <div>
          <p className="eyebrow">Sell an item</p>
          <h2>Create a listing</h2>
        </div>
        <p className="listing-composer-note">
          Logged in as <strong>{currentUser.full_name || currentUser.username}</strong>
        </p>
      </div>

      <form className="listing-composer-form" noValidate onSubmit={handleSubmit}>
        <label className="listing-composer-field">
          <span>Title</span>
          <input name="title" onChange={handleChange} type="text" value={formData.title} />
          {errors.title ? <small className="listing-composer-error">{errors.title}</small> : null}
        </label>

        <label className="listing-composer-field">
          <span>Category</span>
          <select name="categoryId" onChange={handleChange} value={formData.categoryId}>
            <option value="">Choose a category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id ? <small className="listing-composer-error">{errors.category_id}</small> : null}
        </label>

        <label className="listing-composer-field">
          <span>Price</span>
          <input name="price" onChange={handleChange} placeholder="12.50" step="0.01" type="number" value={formData.price} />
          {errors.price ? <small className="listing-composer-error">{errors.price}</small> : null}
        </label>

        <label className="listing-composer-field">
          <span>Condition</span>
          <select name="condition" onChange={handleChange} value={formData.condition}>
            <option value="Excellent">Excellent</option>
            <option value="Very good">Very good</option>
            <option value="Good">Good</option>
          </select>
          {errors.condition ? <small className="listing-composer-error">{errors.condition}</small> : null}
        </label>

        <label className="listing-composer-field listing-composer-field-wide">
          <span>Pickup location</span>
          <input
            name="pickupLocation"
            onChange={handleChange}
            placeholder="Library entrance, North campus"
            type="text"
            value={formData.pickupLocation}
          />
          {errors.pickup_location ? <small className="listing-composer-error">{errors.pickup_location}</small> : null}
        </label>

        <label className="listing-composer-field listing-composer-field-wide">
          <span>Description</span>
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Add a short description, item details, or pickup notes."
            rows="4"
            value={formData.description}
          />
        </label>

        <label className="listing-composer-field">
          <span>Image</span>
          <input accept="image/*" name="imageFile" onChange={handleChange} type="file" />
        </label>

        <label className="listing-composer-field">
          <span>Image alt text</span>
          <input
            name="imageAlt"
            onChange={handleChange}
            placeholder="Short description of the image"
            type="text"
            value={formData.imageAlt}
          />
        </label>

        <div className="listing-composer-actions">
          <button className="button-link button-link-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Publishing..." : "Publish listing"}
          </button>
          {submitError ? <p className="listing-composer-error">{submitError}</p> : null}
          {submitMessage ? <p className="listing-composer-success">{submitMessage}</p> : null}
        </div>
      </form>
    </section>
  );
}
