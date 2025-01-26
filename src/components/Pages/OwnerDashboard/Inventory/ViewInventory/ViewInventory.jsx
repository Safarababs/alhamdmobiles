import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
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
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by item code or name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="filters">
        <select value={selectedBrand} onChange={handleBrandChange}>
          <option value="">All Brands</option>
          <option value="Ronin">Ronin</option>
          <option value="Faster">Faster</option>
          <option value="Amb">Amb</option>
          {/* Add other brands here */}
        </select>

        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Smart Watches">Smart Watches</option>
          <option value="Wireless Chargers">Wireless Chargers</option>
          <option value="Bluetooths">Bluetooths</option>
          {/* Add other categories here */}
        </select>
      </div>

      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Purchase Price</th>
              <th>Wholesale Price</th>
              <th>Retail Price</th>
              <th>Qty</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.purchasePrice}</td>
                <td>{item.wholesalePrice}</td>
                <td>{item.retailPrice}</td>
                <td>{item.qty}</td>
                <td>{item.brand}</td>
                <td>{item.category}</td>
                <td>
                  <button onClick={() => onUpdate(item)}>Update</button>
                  <button onClick={() => onDelete(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ViewInventory;
