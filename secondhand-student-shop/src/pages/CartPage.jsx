import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import "../styles/cart.css";
import {
  getCartItems,
  removeItemFromCart,
  updateItemQuantity,
} from "../utils/cartStorage";

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  function handleRemove(id) {
    setCartItems(removeItemFromCart(id));
  }

  function handleQuantityChange(id, quantity) {
    setCartItems(updateItemQuantity(id, Number(quantity)));
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

  return (
    <main className="cart-page">
      <section className="cart-hero">
        <div className="cart-hero-copy">
          <p className="eyebrow">Shopping cart</p>
          <h2>Review the items you want before checkout.</h2>
          <p className="cart-hero-text">
            Adjust quantity, remove items, and review your estimated order total
            before moving to checkout.
          </p>
        </div>

        <div className="cart-summary-card">
          <span className="cart-summary-label">Items in cart</span>
          <strong>{cartItems.length}</strong>
          <p>
            Subtotal: <strong>£{subtotal}</strong>
          </p>
          <p>
            Estimated total: <strong>£{total}</strong>
          </p>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="cart-empty-state">
          <p className="eyebrow">Your cart is empty</p>
          <h3>Add an item to start your order.</h3>
          <p>Browse listings and add useful student essentials to your cart.</p>
          <Link className="button-link button-link-primary" to={ROUTES.browse}>
            Browse listings
          </Link>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <article className="cart-item-card" key={item.id}>
                <div className="cart-item-image-shell">
                  <img
                    alt={item.alt}
                    className="cart-item-image"
                    src={item.image}
                    style={{ objectPosition: item.imagePosition || "center center" }}
                  />
                </div>

                <div className="cart-item-body">
                  <div className="cart-item-top">
                    <span className="pill">{item.categoryLabel}</span>
                    <span className="listing-location">{item.pickup}</span>
                  </div>

                  <h3>{item.title}</h3>
                  <p className="cart-item-meta">
                    {item.condition} condition · {item.seller}
                  </p>

                  <div className="cart-item-controls">
                    <label className="cart-quantity-field">
                      <span>Qty</span>
                      <select
                        onChange={(event) =>
                          handleQuantityChange(item.id, event.target.value)
                        }
                        value={item.quantity || 1}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </label>

                    <button
                      className="button-link button-link-secondary"
                      onClick={() => handleRemove(item.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-price">
                  <strong>£{Number(item.price) * Number(item.quantity || 1)}</strong>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-order-summary">
            <p className="eyebrow">Order summary</p>
            <h3>Ready for checkout?</h3>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <strong>£{subtotal}</strong>
            </div>

            <div className="cart-summary-row">
              <span>Service fee</span>
              <strong>£{serviceFee}</strong>
            </div>

            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <strong>£{total}</strong>
            </div>

            <Link className="button-link button-link-primary" to={ROUTES.checkout}>
              Proceed to Checkout
            </Link>

            <Link className="button-link button-link-secondary" to={ROUTES.browse}>
              Continue Browsing
            </Link>
          </aside>
        </section>
      )}
    </main>
  );
}