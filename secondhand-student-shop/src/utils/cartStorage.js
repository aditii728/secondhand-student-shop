const CART_KEY = "student-shop-cart";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCartItems() {
  if (!isBrowser()) return [];

  try {
    const stored = window.localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

export function saveCartItems(items) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addItemToCart(listing) {
  const currentItems = getCartItems();
  const existingItem = currentItems.find((item) => item.id === listing.id);

  if (existingItem) {
    const updatedItems = currentItems.map((item) =>
      item.id === listing.id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    saveCartItems(updatedItems);
    return updatedItems;
  }

  const updatedItems = [...currentItems, { ...listing, quantity: 1 }];
  saveCartItems(updatedItems);
  return updatedItems;
}

export function removeItemFromCart(id) {
  const updatedItems = getCartItems().filter((item) => item.id !== id);
  saveCartItems(updatedItems);
  return updatedItems;
}

export function updateItemQuantity(id, quantity) {
  const updatedItems = getCartItems()
    .map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );

  saveCartItems(updatedItems);
  return updatedItems;
}

export function clearCart() {
  saveCartItems([]);
}