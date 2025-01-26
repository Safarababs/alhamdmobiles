import React, { useState, useEffect } from "react";
import { getDatabase, ref, update } from "firebase/database";
import app from "../../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateItem.css";
import {
  brandOptions,
  categoryOptions,
} from "../../Common Options/commonOptions"; // Import common options

const UpdateItem = ({ selectedItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setItemName(selectedItem.name);
      setItemCode(selectedItem.code);
      setPurchasePrice(selectedItem.purchasePrice);
      setWholesalePrice(selectedItem.wholesalePrice);
      setRetailPrice(selectedItem.retailPrice);
      setQuantity(selectedItem.qty);
      setCategory(selectedItem.category);
      setBrand(selectedItem.brand);
    }
  }, [selectedItem]);

  const handleUpdateItem = async () => {
    const database = getDatabase(app);
    const itemRef = ref(database, `inventory/${selectedItem.id}`);

    const updatedItem = {
      name: itemName,
      code: itemCode,
      purchasePrice: purchasePrice,
      wholesalePrice: wholesalePrice,
      retailPrice: retailPrice,
      qty: quantity,
      category: category,
      brand: brand,
    };

    try {
      await update(itemRef, updatedItem);
      toast.success("Item updated successfully!");
    } catch (error) {
      toast.error("Failed to update item!");
    }
  };

  return (
    <div className="update-item-section">
      <h3>Update Item</h3>
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
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Brand</label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Select Brand</option>
          {brandOptions.map((br) => (
            <option key={br} value={br}>
              {br}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleUpdateItem}>Update Item</button>
      <ToastContainer />
    </div>
  );
};

export default UpdateItem;
