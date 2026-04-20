export function BrowseCategoryScroller({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="browse-category-grid">
      {categories.map((category) => (
        <button
          className={`browse-category-card ${
            selectedCategory === category.id ? "browse-category-card-active" : ""
          }`}
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          type="button"
        >
          <span className="browse-category-count">{category.count} items</span>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
        </button>
      ))}
    </div>
  );
}
