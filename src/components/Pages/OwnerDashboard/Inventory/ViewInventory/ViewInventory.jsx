import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ViewInventory.css";

const ViewInventory = ({ onDelete, onUpdate }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    const database = getDatabase(app);
    const inventoryRef = ref(database, "inventory");

    try {
      const snapshot = await get(inventoryRef);
      if (snapshot.exists()) {
        const inventoryArray = [];
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          item.key = childSnapshot.key; // Store the Firebase key
          inventoryArray.push(item);
        });
        setInventoryData(inventoryArray);
        toast.success("Inventory data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.error("Failed to load inventory data!");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredInventory = inventoryData.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedBrand ? item.brand === selectedBrand : true) &&
      (selectedCategory ? item.category === selectedCategory : true)
  );

  return (
    <div className="view-inventory-section">
      <div className="view-inventory-search-bar">
        <input
          className="view-inventory-search-input"
          type="text"
          placeholder="Search by item code or name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="view-inventory-filters">
        <select
          className="view-inventory-brand-select"
          value={selectedBrand}
          onChange={handleBrandChange}
        >
          <option value="">All Brands</option>
          <option value="Ronin">Ronin</option>
          <option value="Faster">Faster</option>
          <option value="Amb">Amb</option>
          {/* Add other brands here */}
        </select>

        <select
          className="view-inventory-category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          <option value="Smart Watches">Smart Watches</option>
          <option value="Wireless Chargers">Wireless Chargers</option>
          <option value="Bluetooths">Bluetooths</option>
          {/* Add other categories here */}
        </select>
      </div>

      <div className="view-inventory-table">
        <table className="view-inventory-table-element">
          <thead className="view-inventory-table-head">
            <tr>
              <th className="view-inventory-table-th">Item Code</th>
              <th className="view-inventory-table-th">Item Name</th>
              <th className="view-inventory-table-th">Purchase Price</th>
              <th className="view-inventory-table-th">Wholesale Price</th>
              <th className="view-inventory-table-th">Retail Price</th>
              <th className="view-inventory-table-th">Qty</th>
              <th className="view-inventory-table-th">Brand</th>
              <th className="view-inventory-table-th">Category</th>
              <th className="view-inventory-table-th">Actions</th>
            </tr>
          </thead>
          <tbody className="view-inventory-table-body">
            {filteredInventory.map((item, index) => (
              <tr className="view-inventory-table-row" key={index}>
                <td className="view-inventory-table-td">{item.code}</td>
                <td className="view-inventory-table-td">{item.name}</td>
                <td className="view-inventory-table-td">
                  {item.purchasePrice}
                </td>
                <td className="view-inventory-table-td">
                  {item.wholesalePrice}
                </td>
                <td className="view-inventory-table-td">{item.retailPrice}</td>
                <td className="view-inventory-table-td">{item.qty}</td>
                <td className="view-inventory-table-td">{item.brand}</td>
                <td className="view-inventory-table-td">{item.category}</td>
                <td className="view-inventory-table-td">
                  <button
                    className="view-inventory-button-update"
                    onClick={() => onUpdate(item)}
                  >
                    Update
                  </button>
                  <button
                    className="view-inventory-button-delete"
                    onClick={() => onDelete(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewInventory;
