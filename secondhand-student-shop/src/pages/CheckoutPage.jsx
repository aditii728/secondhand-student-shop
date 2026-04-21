import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import "../styles/checkout.css";
import { clearCart, getCartItems } from "../utils/cartStorage";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  meetupPoint: "",
  paymentMethod: "Cash on collection",
};

export function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    clearCart();
    setCartItems([]);
  }

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const serviceFee = cartItems.length > 0 ? 5 : 0;
  const total = subtotal + serviceFee;

  if (submitted) {
    return (
      <main className="checkout-page">
        <section className="checkout-success-card">
          <p className="eyebrow">Order placed</p>
          <h2>Checkout completed successfully.</h2>
          <p>
            Your order has been placed in prototype mode. A seller meetup request
            would normally be sent from here in a full production version.
          </p>
          <div className="checkout-success-actions">
            <Link className="button-link button-link-primary" to={ROUTES.home}>
              Back to Home
            </Link>
            <Link className="button-link button-link-secondary" to={ROUTES.browse}>
              Keep Browsing
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-hero">
        <div className="checkout-hero-copy">
          <p className="eyebrow">Simple checkout</p>
          <h2>Confirm your details and complete your order.</h2>
          <p className="checkout-hero-text">
            This Version 1 checkout flow is a front-end prototype that simulates a
            quick student marketplace order experience.
          </p>
        </div>

        <div className="checkout-summary-card">
          <span className="checkout-summary-label">Items</span>
          <strong>{cartItems.length}</strong>
          <p>
            Total payable: <strong>£{total}</strong>
          </p>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="checkout-empty-state">
          <p className="eyebrow">No items ready for checkout</p>
          <h3>Your cart is empty right now.</h3>
          <p>Add items to your cart before moving to checkout.</p>
          <Link className="button-link button-link-primary" to={ROUTES.browse}>
            Browse listings
          </Link>
        </section>
      ) : (
        <section className="checkout-layout">
          <form className="checkout-form-card" onSubmit={handleSubmit}>
            <div className="checkout-form-heading">
              <p className="eyebrow">Buyer details</p>
              <h3>Complete your order</h3>
            </div>

            <div className="checkout-form-grid">
              <label className="checkout-field">
                <span>Full name</span>
                <input
                  name="fullName"
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  type="text"
                  value={form.fullName}
                />
              </label>

              <label className="checkout-field">
                <span>Email</span>
                <input
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={form.email}
                />
              </label>

              <label className="checkout-field">
                <span>Phone</span>
                <input
                  name="phone"
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  type="tel"
                  value={form.phone}
                />
              </label>

              <label className="checkout-field">
                <span>Payment method</span>
                <select
                  name="paymentMethod"
                  onChange={handleChange}
                  value={form.paymentMethod}
                >
                  <option>Cash on collection</option>
                  <option>Bank transfer</option>
                  <option>Mobile payment</option>
                </select>
              </label>

              <label className="checkout-field checkout-field-full">
                <span>Preferred meetup point</span>
                <input
                  name="meetupPoint"
                  onChange={handleChange}
                  placeholder="e.g. Library gate, student centre, main entrance"
                  required
                  type="text"
                  value={form.meetupPoint}
                />
              </label>
            </div>

            <button className="button-link button-link-primary" type="submit">
              Place Order
            </button>
          </form>

          <aside className="checkout-order-card">
            <p className="eyebrow">Order review</p>
            <h3>Your items</h3>

            <div className="checkout-order-items">
              {cartItems.map((item) => (
                <div className="checkout-order-item" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      Qty {item.quantity || 1} · {item.pickup}
                    </p>
                  </div>
                  <span>£{Number(item.price) * Number(item.quantity || 1)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <strong>£{subtotal}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Service fee</span>
              <strong>£{serviceFee}</strong>
            </div>

            <div className="checkout-summary-row checkout-summary-total">
              <span>Total</span>
              <strong>£{total}</strong>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}