import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "../../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      <h3>Add Item</h3>
      <div className="form-group">
        <label>Item Name</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Item Code</label>
        <input
          type="text"
          value={itemCode}
          onChange={(e) => setItemCode(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Purchase Price</label>
        <input
          type="number"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Wholesale Price</label>
        <input
          type="number"
          value={wholesalePrice}
          onChange={(e) => setWholesalePrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Retail Price</label>
        <input
          type="number"
          value={retailPrice}
          onChange={(e) => setRetailPrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Brand</label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Select Brand</option>
          <option value="Ronin">Ronin</option>
          <option value="Faster">Faster</option>
          <option value="Amb">Amb</option>
          {/* Add other brands here */}
        </select>
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Smart Watches">Smart Watches</option>
          <option value="Wireless Chargers">Wireless Chargers</option>
          <option value="Bluetooths">Bluetooths</option>
          {/* Add other categories here */}
        </select>
      </div>
      <button onClick={handleAddItem}>Add Item</button>
      <ToastContainer />
    </div>
  );
};

export default AddItem;
