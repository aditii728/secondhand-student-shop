export const browseConditions = ["All", "Excellent", "Very good", "Good"];

export function formatPostedHours(hours) {
  if (hours <= 1) {
    return "Posted 1h ago";
  }

  return `Posted ${hours}h ago`;
}

export function sortListings(listings, sortBy) {
  const sorted = [...listings];

  if (sortBy === "price-low") {
    sorted.sort((left, right) => left.price - right.price);
  } else if (sortBy === "price-high") {
    sorted.sort((left, right) => right.price - left.price);
  } else {
    sorted.sort((left, right) => left.postedHours - right.postedHours);
  }

  return sorted;
}

export function filterBrowseListings(listings, filters) {
  const { searchTerm, selectedCategory, selectedCondition } = filters;

  return listings.filter((listing) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesSearch =
      normalizedSearch === "" ||
      listing.title.toLowerCase().includes(normalizedSearch) ||
      listing.categoryLabel.toLowerCase().includes(normalizedSearch) ||
      listing.pickup.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "all" || listing.category === selectedCategory;

    const matchesCondition =
      selectedCondition === "All" || listing.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });
}
