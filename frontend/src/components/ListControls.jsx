export default function ListControls({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  placeholder = "Search...",
  options = [
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
  ],
}) {
  return (
    <div className="list-controls">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="sort-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}