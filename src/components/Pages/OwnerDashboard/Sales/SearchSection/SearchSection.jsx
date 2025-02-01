import React from "react";
import "./SearchSection.css";

const SearchSection = ({
  searchTerm,
  handleSearch,
  filteredInventory,
  handleSelectItem,
}) => {
  return (
    <div className="search-section">
      <input
        type="text"
        placeholder="Search by item name or code"
        value={searchTerm}
        onChange={handleSearch}
      />
      {searchTerm && (
        <div className="search-results">
          {filteredInventory.map((item) => (
            <div
              key={item.key}
              className="search-result-item"
              onClick={() => handleSelectItem(item)}
            >
              {item.name} ({item.code}) - Stock: {item.qty}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSection;
