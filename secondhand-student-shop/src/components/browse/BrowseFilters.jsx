export function BrowseFilters({
  conditions,
  selectedCondition,
  onSelectCondition,
  sortBy,
  onSortByChange,
}) {
  return (
    <aside className="filter-panel">
      <div className="filter-group">
        <p className="filter-label">Condition</p>
        <div className="filter-chip-list">
          {conditions.map((condition) => (
            <button
              className={`filter-chip ${
                selectedCondition === condition ? "filter-chip-active" : ""
              }`}
              key={condition}
              onClick={() => onSelectCondition(condition)}
              type="button"
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="sort-listings">
          Sort by
        </label>
        <select
          className="sort-select"
          id="sort-listings"
          onChange={(event) => onSortByChange(event.target.value)}
          value={sortBy}
        >
          <option value="latest">Latest</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>

      <div className="filter-note">
        <span className="status-dot" />
        <p>Student pickup spots include the library, residence halls, and campus buildings.</p>
      </div>
    </aside>
  );
}
