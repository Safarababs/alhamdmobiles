import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  brandOptions,
  categoryOptions,
} from "../../Common Options/commonOptions"; // Import the options
import "./AddItem.css";

const AddItem = () => {
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const handleAddItem = async () => {
    const database = getDatabase(app);
    const inventoryRef = ref(database, "inventory");

    const newItem = {
      name: itemName,
      code: itemCode,
      purchasePrice: purchasePrice,
      wholesalePrice: wholesalePrice,
      retailPrice: retailPrice,
      qty: quantity,
      brand: brand,
      category: category,
    };

    try {
      await push(inventoryRef, newItem);
      toast.success("Item added successfully!");
      setItemName("");
      setItemCode("");
      setPurchasePrice("");
      setWholesalePrice("");
      setRetailPrice("");
      setQuantity("");
      setBrand("");
      setCategory("");
    } catch (error) {
      toast.error("Failed to add item!");
    }
  };

  return (
    <div className="add-item-section">
      <h3 className="add-item-title">Add Item</h3>
      <div className="add-item-form-group">
        <label className="add-item-label">Item Name</label>
        <input
          className="add-item-input"
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      <div className="add-item-form-group">
        <label className="add-item-label">Item Code</label>
        <input
          className="add-item-input"
          type="text"
          value={itemCode}
          onChange={(e) => setItemCode(e.target.value)}
        />
      </div>
      <div className="add-item-form-group">
        <label className="add-item-label">Purchase Price</label>
        <input
          className="add-item-input"
          type="number"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
        />
      </div>
      <div className="add-item-form-group">
        <label className="add-item-label">Wholesale Price</label>
        <input
          className="add-item-input"
          type="number"
          value={wholesalePrice}
          onChange={(e) => setWholesalePrice(e.target.value)}
        />
      </div>
      <div className="add-item-form-group">
        <label className="add-item-label">Retail Price</label>
        <input
          className="add-item-input"
          type="number"
          value={retailPrice}
          onChange={(e) => setRetailPrice(e.target.value)}
        />
      </div>
      <div className="add-item-form-group">
        <label className="add-item-label">Quantity</label>
        <input
          className="add-item-input"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className="add-item-form-group">
        <label className="add-item-label">Brand</label>
        <select
          className="add-item-select"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Select Brand</option>
          {brandOptions.map((brandOption) => (
            <option key={brandOption} value={brandOption}>
              {brandOption}
            </option>
          ))}
        </select>
      </div>
      <div className="add-item-form-group">
        <label className="add-item-label">Category</label>
        <select
          className="add-item-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categoryOptions.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>
      </div>
      <button className="add-item-button" onClick={handleAddItem}>
        Add Item
      </button>
    </div>
  );
};

export default AddItem;
