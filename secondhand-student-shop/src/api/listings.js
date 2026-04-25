const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const categoryDescriptions = {
  books: "Core textbooks, revision guides, and class notes.",
  daily: "Kitchenware, bags, jackets, and practical items.",
  furniture: "Desks, shelves, lamps, and compact dorm furniture.",
  tech: "Calculators, monitors, keyboards, and study tools.",
};

function createPlaceholderImage(title) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#e6dccf" />
      <rect x="56" y="56" width="688" height="488" rx="32" fill="#f6f1ea" />
      <text
        x="400"
        y="310"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="42"
        fill="#5f5447"
      >
        ${title}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getPostedHours(createdAt) {
  const createdAtMs = Date.parse(createdAt);

  if (Number.isNaN(createdAtMs)) {
    return 1;
  }

  const hours = Math.floor((Date.now() - createdAtMs) / (1000 * 60 * 60));
  return Math.max(1, hours);
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export function mapListingFromApi(listing) {
  const price = Number(listing.price ?? 0);

  return {
    id: String(listing.id),
    title: listing.title,
    category: listing.category.slug,
    categoryLabel: listing.category.name,
    categoryDescription:
      listing.category.description ||
      categoryDescriptions[listing.category.slug] ||
      "Student essentials currently listed on campus.",
    price,
    priceLabel: formatPrice(price),
    condition: listing.condition,
    pickup: listing.pickup_location,
    sellerId: listing.seller?.id ? String(listing.seller.id) : "",
    sellerUsername: listing.seller?.username || "",
    seller: listing.seller?.name || "Student seller",
    postedHours: getPostedHours(listing.created_at),
    featured: Boolean(listing.is_featured),
    image: listing.image_url || createPlaceholderImage(listing.title),
    alt: listing.image_alt || listing.title,
    description:
      listing.description?.trim() ||
      "This listing is available for campus pickup at an affordable student price.",
    createdAt: listing.created_at,
    updatedAt: listing.updated_at,
  };
}

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || fallbackMessage || `Request failed (${response.status})`);
    error.fieldErrors = data.errors || {};
    throw error;
  }

  return data;
}

export async function fetchListings({ signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/items/`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load listings (${response.status})`);
  }

  const payload = await response.json();
  return (payload.items || []).map(mapListingFromApi);
}

export async function fetchCategories({ signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/categories/`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load categories (${response.status})`);
  }

  const payload = await response.json();
  return payload.items || [];
}

export async function createListing({ accessToken, payload }) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    formData.append(key, value);
  });

  const response = await fetch(`${API_BASE_URL}/items/create/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await parseResponse(response, `Failed to create listing (${response.status})`);
  return mapListingFromApi(data.item);
}

export async function deleteListing({ accessToken, listingId }) {
  const response = await fetch(`${API_BASE_URL}/items/${listingId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseResponse(response, `Failed to remove listing (${response.status})`);
}

export function buildBrowseCategories(listings) {
  const categoryMap = new Map();

  listings.forEach((listing) => {
    const existing = categoryMap.get(listing.category);

    if (existing) {
      existing.count += 1;
      return;
    }

    categoryMap.set(listing.category, {
      id: listing.category,
      name: listing.categoryLabel,
      description: listing.categoryDescription,
      count: 1,
    });
  });

  return [
    {
      id: "all",
      name: "All items",
      description: "Everything currently available across campus.",
      count: listings.length,
    },
    ...Array.from(categoryMap.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    ),
  ];
}
