import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  brandOptions,
  categoryOptions,
} from "../../Common Options/commonOptions"; // Import the options
import "./ViewInventory.css";

const ViewPurchasedInventory = ({ onDelete, onUpdate }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAscending, setIsAscending] = useState(true); // State for sorting order

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

  const handleSortOrderToggle = () => {
    setIsAscending(!isAscending);
  };

  const sortedInventory = inventoryData
    .filter(
      (item) =>
        item.qty > 0 && // ✅ Only items in stock
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBrand ? item.brand === selectedBrand : true) &&
        (selectedCategory ? item.category === selectedCategory : true)
    )
    .sort((a, b) => {
      return isAscending
        ? a.code.localeCompare(b.code)
        : b.code.localeCompare(a.code);
    });
  const totalQty = sortedInventory.reduce(
    (sum, item) => sum + Number(item.qty),
    0
  );
  const totalPurchaseValue = sortedInventory.reduce(
    (sum, item) => sum + item.purchasePrice * item.qty,
    0
  );

  const coverItems = sortedInventory.filter((item) =>
    item.name.toLowerCase().includes("case")
  );

  const totalCoverQty = coverItems.reduce(
    (sum, item) => sum + Number(item.qty),
    0
  );

  const totalCoverPurchaseValue = coverItems.reduce(
    (sum, item) => sum + Number(item.purchasePrice) * Number(item.qty),
    0
  );

  const averageCoverPricePerPiece =
    totalCoverQty > 0
      ? (totalCoverPurchaseValue / totalCoverQty).toFixed(2)
      : 0;

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
          {brandOptions.map((brandOption) => (
            <option key={brandOption} value={brandOption}>
              {brandOption}
            </option>
          ))}
        </select>

        <select
          className="view-inventory-category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSortOrderToggle}>
        Sort by Code: {isAscending ? "Ascending" : "Descending"}
      </button>

      <div className="view-inventory-table">
        <div className="view-inventory-summary">
          <p>
            <strong>Cover Items Summary:</strong>
          </p>
          <p>Total Quantity: {totalCoverQty}</p>
          <p>Total Purchase Value: {totalCoverPurchaseValue}</p>
          <p>Average Price per Piece: {averageCoverPricePerPiece}</p>
        </div>
        <table className="view-inventory-table-element">
          {/* <thead className="view-inventory-table-head">
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
          </thead> */}
          <thead className="view-inventory-table-head">
            <tr>
              <th className="view-inventory-table-th">Item Code</th>
              <th className="view-inventory-table-th">Item Name</th>
              <th className="view-inventory-table-th">Purchase Price</th>
              <th className="view-inventory-table-th">Qty</th>
              <th className="view-inventory-table-th">Total</th>
            </tr>
          </thead>
          <tbody className="view-inventory-table-body">
            {sortedInventory.map((item, index) => (
              <tr className="view-inventory-table-row" key={index}>
                <td className="view-inventory-table-td">{item.code}</td>
                <td className="view-inventory-table-td">{item.name}</td>
                <td className="view-inventory-table-td">
                  {item.purchasePrice}
                </td>
                <td className="view-inventory-table-td">{item.qty}</td>
                <td className="view-inventory-table-td">
                  {item.purchasePrice * item.qty} {/* ✅ Total calculation */}
                </td>
              </tr>
            ))}
            <tr className="view-inventory-table-row view-inventory-total-row">
              <td className="view-inventory-table-td" colSpan={3}>
                <strong>Total</strong>
              </td>
              <td className="view-inventory-table-td">
                <strong>{totalQty}</strong>
              </td>
              <td className="view-inventory-table-td">
                <strong>{totalPurchaseValue}</strong>
              </td>
            </tr>
          </tbody>

          {/* 
          <tbody className="view-inventory-table-body">
            {sortedInventory.map((item, index) => (
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
          </tbody> */}
        </table>
      </div>
    </div>
  );
};

export default ViewPurchasedInventory;
